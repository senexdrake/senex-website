import type {Plugin, ResolvedConfig} from "vite";
import {addTrailingSlash, chalk, clearPath, ensurePathExists, pathExists} from "../util";
import {createReadStream} from "fs";
import type {PngOptions, ResizeOptions} from "sharp";
import createSharp from 'sharp'
import type {IconExport, ImageSrc, ProfileBannerExport} from "../model/types";
import type {FetchedMeta, FormatOptions, IconsRaw, IconVariant, ProfileBanner} from "./asset-handling/types";
import path from "path";
import {fileNameHash, replaceExtension} from "./asset-handling/util";
import {copyFile, readdir, writeFile} from "fs/promises";
import {
    assetsServerPath,
    defaultImageType, metaMaxHeight, metaMaxWidth,
    originalMaxDimension,
    originalTransformQuality,
    processingRules
} from "./asset-handling/config";
import {glob} from "glob";
import {staticAssetsPrefix} from "../../config"
import axios from "axios";
import * as https from "https";
import {createWriteStream} from "node:fs";
import {promisify} from "node:util";
import * as stream from "stream";
import { parse as parseYaml } from "yaml"
const finished = promisify(stream.finished)

const tmpDir = "./.tmp-asset-handling"
const assetDir = addTrailingSlash(path.join(tmpDir, "fetched"))
const metadataDir = "./src/lib/data/gallery"

const axiosInstance = axios.create({
    timeout: 30000,
    httpsAgent: new https.Agent({keepAlive: true})
})

const pwaBackground = '#4376C6'

const iconVariants: Array<IconVariant> = [
    { size: 32, format: ['webp', 'png'] },
    { size: 48, format: ['webp', 'png'] },
    { size: 96, format: ['webp', 'png'] },
    { size: 180, format: ['webp', 'png'] },
    { size: 192, format: ['webp', 'png'] },
    { size: 512, format: ['webp', 'png'] },

    // PWA-Icons
    { size: 32, format: ['webp', 'png'], name: 'pwa-icon', background: pwaBackground },
    { size: 512, format: ['webp', 'png'], name: 'pwa-icon', background: pwaBackground },

    // Profile
    { size: 600, format: ['webp', 'png'], name: 'profile' },
]

export function assetHandler() : Plugin {
    let viteConfig: ResolvedConfig

    return {
        name: 'asset-handler',
        enforce: 'pre',
        configResolved(cfg) {
            viteConfig = cfg
        },
        async buildStart() {
            console.log(chalk.bold(
                "-- Asset handler starting --"
            ))

            const publicAssetPath = path.join(viteConfig.publicDir, staticAssetsPrefix)

            if ((await pathExists(publicAssetPath)) && (!viteConfig.build.ssr || (await readdir(publicAssetPath)).length > 0)) {
                console.log(chalk.greenBright(
                    `Skipping asset handling because ${publicAssetPath} is not empty!`
                ))
                await onFinished()
                return
            }

            await clearPath(tmpDir)
            await clearPath(publicAssetPath)
            await clearPath(metadataDir)

            const {profileBanner, favicon} = await fetchMeta(assetsServerPath + "meta.yml")

            await fetchAssets(assetsServerPath, [profileBanner.file, favicon.file, favicon.icoFile], assetDir)


            const processProfileBannerJob = processProfileBanner({
                src: assetDir + profileBanner.file,
                author: profileBanner.author
            }, publicAssetPath).then(
                result => writeFile(path.join(metadataDir, "profileBanner.json"), JSON.stringify(result))
            )
            .catch(error => {
                console.error("Error processing profile banner:", error)
            })


            const processIconsJob = processIcons({
                defaultSource: assetDir + favicon.icoFile,
                source: assetDir + favicon.file,
                variants: iconVariants,
                quality: 95
            }, publicAssetPath).then(result => {
                return Promise.all([
                    writeFile(path.join(metadataDir, "icons.json"), JSON.stringify(result)),
                    copyFaviconsToFaviconDir(publicAssetPath, viteConfig.publicDir)
                ])
            }).catch(error => {
                console.error("Error processing icons:", error)
            })

            await Promise.all([
                processProfileBannerJob,
                processIconsJob
            ])

            await onFinished()
        }
    }
}

async function fetchMeta(url: string): Promise<FetchedMeta> {
    const extension = path.extname(url)
    const isYaml = ['.yml', '.yaml'].includes(extension)
    const response = await axiosInstance.get(url)

    if (response.status != 200) throw Error("Error fetching image metadata")

    const data = response.data
    if (!isYaml) return data as FetchedMeta
    return parseYaml(data) as FetchedMeta
}

async function processIcons(icons: IconsRaw, iconTargetPath: string): Promise<IconExport[]> {
    const sourceImage = icons.source
    const sharp = createSharp()
    // Fix for processing a lot of variants for one image without rereading the stream
    sharp.setMaxListeners(icons.variants.length * 5)

    const processing: Promise<IconExport>[] = []

    icons.variants.forEach(variant => {
        const { size } = variant
        const formats = Array.isArray(variant.format) ? variant.format : [variant.format]
        const quality = variant.quality ?? icons.quality
        const name = variant.name ?? "favicon"
        const background = variant.background

        formats.forEach(format => {
            const tmpPath = path.join(
                tmpDir,
                name + '.' + fileNameHash() + '.' + format
            )

            let qualitySettings: FormatOptions = { quality: quality }
            if (format === "png") {
                qualitySettings = <PngOptions>{ quality: 100 }
            }

            const localSharp = sharp.clone()
            if (background) {
                localSharp.flatten({ background: background })
            }

            const promise = localSharp
                .resize({ width: size })
                .toFormat(format, qualitySettings)
                .toFile(tmpPath)
                .then(async (outputInfo) => {
                    const {width, height, format: outputFormat} = outputInfo
                    const targetFileName = `${name}_${width}x${height}.${outputFormat}`
                    const targetPath = path.join(iconTargetPath, targetFileName)
                    await copyFile(tmpPath, targetPath);
                    return {
                        name: targetFileName,
                        width: width,
                        height: height,
                        format: outputFormat,
                        type: name
                    };
                })

            processing.push(promise)
        })
    })

    createReadStream(sourceImage).pipe(sharp)

    const processedIcons = await Promise.all(processing)

    await copyFile(icons.defaultSource, path.join(iconTargetPath, "favicon.ico"))
    processedIcons.push({
        name: "favicon.ico",
        format: "ico",
        width: 96,
        height: 96,
        type: "favicon"
    })

    const defaultIconTemplate = processedIcons
        .find(icon => icon.format === "png" && icon.width === 192)

    if (!defaultIconTemplate) throw Error('no default icon found')
    const defaultIcon = { ...defaultIconTemplate }
    defaultIcon.name = 'favicon.png'
    await copyFile(path.join(iconTargetPath, defaultIconTemplate.name), path.join(iconTargetPath, defaultIcon.name))

    processedIcons.push(defaultIcon)

    return processedIcons
}

async function processProfileBanner(rawImage: ProfileBanner, target: string) : Promise<ProfileBannerExport> {
    const sharp = createSharp()
    let originalName = path.basename(rawImage.src)
    createReadStream(rawImage.src).pipe(sharp)

    const { width: originalWidth, height: originalHeight, format: originalFormat } = await sharp.metadata()
    if (!originalWidth) throw new Error('Image width is undefined')
    if (!originalHeight) throw new Error('Image height is undefined')
    const heightLimited = (originalHeight ?? 0) > (originalWidth ?? 0)
    const nameWithoutExtension = originalName.substring(0, originalName.lastIndexOf('.'))

    const processingPromises = processingRules.map(async (rule) => {
        const resizeOptions: ResizeOptions = {
            height: heightLimited ? rule.maxDimension : undefined,
            width: heightLimited ? undefined : rule.maxDimension,
            withoutEnlargement: true
        }

        const tmpFilePath = path.join(
            tmpDir,
            nameWithoutExtension + '.' + fileNameHash() + '.' + rule.format
        )

        const { width, height, format } = await sharp.clone()
            .resize(resizeOptions)
            .toFormat(rule.format, { quality: rule.quality })
            .toFile(tmpFilePath)


        const newFileName = `${nameWithoutExtension}_${width}x${height}`
        const targetImageName = `${newFileName}.${format}`

        const processedTargetPath = path.join(target, targetImageName)
        await copyFile(tmpFilePath, processedTargetPath)

        return <ImageSrc>{
            src: targetImageName,
            format: format,
            height: height,
            width: width
        }
    })

    const sources = await Promise.all(processingPromises)

    originalName = replaceExtension(originalName, defaultImageType)
    const originalPath = path.join(tmpDir, originalName)
    const needsResize = (heightLimited && originalHeight > originalMaxDimension) || originalWidth > originalMaxDimension

    const original: ImageSrc = {
        width: originalWidth,
        height: originalHeight,
        format: originalFormat ?? defaultImageType,
        src: originalName
    }

    if (originalFormat !== defaultImageType || needsResize) {
        // Process the original as well
        const clonedSharp = sharp.clone().resize({
            height: heightLimited ? originalMaxDimension : undefined,
            width: heightLimited ? undefined : originalMaxDimension,
            withoutEnlargement: true
        })

        const originalOutput = await clonedSharp
            .toFormat(defaultImageType, { quality: originalTransformQuality })
            .toFile(originalPath)

        original.width = originalOutput.width
        original.height = originalOutput.height
        original.format = originalOutput.format
    } else {
        await copyFile(rawImage.src, originalPath)
    }

    const originalTargetPath = path.join(target, originalName)
    await copyFile(originalPath, originalTargetPath)

    // --- Metadata Version ---

    const metadataVersionFormat = "png"
    const metadataVersionName = nameWithoutExtension + '_meta.' + metadataVersionFormat
    const metadataVersionPath = path.join(tmpDir, metadataVersionName)
    const metadataVersionResult = await sharp.clone()
        .resize({
            height: metaMaxHeight,
            width: metaMaxWidth,
            fit: "cover",
            position: "attention"
        })

        .toFormat(metadataVersionFormat, { quality: originalTransformQuality })
        .toFile(metadataVersionPath)

    const metadataVersionTargetPath = path.join(target, metadataVersionName)
    await copyFile(metadataVersionPath, metadataVersionTargetPath)

    const metadataVersion: ImageSrc = {
        width: metadataVersionResult.width,
        height: metadataVersionResult.height,
        format: metadataVersionFormat,
        src: metadataVersionName
    }

    // --- Done ---

    return {
        author: rawImage.author,
        src: sources,
        original: original,
        metadataSrc: metadataVersion
    }
}

async function copyFaviconsToFaviconDir(assetPath: string, targetPath: string) : Promise<void> {
    const favicons = await glob.glob(addTrailingSlash(assetPath) + 'favicon*')
    await Promise.all(favicons.map(iconPath => {
        const name = path.basename(iconPath)
        return copyFile(iconPath, path.join(targetPath, name))
    }))
}

async function fetchAssets(sourceUrl: string, assetNames: Array<string>, target: string) {
    await ensurePathExists(target)
    const assetPromises = assetNames.map(assetName => {
        const assetSource = addTrailingSlash(sourceUrl) + assetName
        return fetchAsset(assetSource, path.join(target, assetName))
    })
    return await Promise.all(assetPromises)
}

async function fetchAsset(sourceUrl: string, target: string) {
    const writer = createWriteStream(target)

    return axiosInstance({
        method: 'GET',
        url: sourceUrl,
        responseType: 'stream'
    }).then(async (response) => {
        response.data.pipe(writer);
        await finished(writer);
        return target
    })
}

async function onFinished() {
    await clearPath(tmpDir)
    console.log(chalk.bold(
        "-- Asset handler done --"
    ))
}