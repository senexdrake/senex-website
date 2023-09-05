import { parse as parseYaml } from "yaml"
import {readFile, copyFile, writeFile, rename} from "fs/promises";
import {createReadStream, createWriteStream} from "fs";
import type {ImageAuthor, IconExport, ImageExport, ImageSrc} from "../../model/types"
import type {IconsRaw, ImageRaw, LinkDefinition} from "./types";
import type {ResizeOptions} from "sharp"
import createSharp from 'sharp'
import axios from "axios"
import mustache from "mustache"
import { glob } from "glob"
import {
    checkAuthor,
    clearPath,
    fileNameFromImage,
    fileNameHash,
    replaceExtension,
} from "./util"
import { promisify } from "util"
import path from "path"
import * as stream from "stream"
import {
    allowEnlargementFor,
    defaultFaviconFormat, defaultFaviconSize,
    defaultImageType,
    fileEncoding,
    originalTransformQuality,
    processingRules,
} from "./config"
import type {AssetHandlingConfig} from "./types";
import {addTrailingSlash, pathExists} from "../../util";
const finished = promisify(stream.finished)

const imageCatalogueName = 'images.json'
const iconCatalogueName = 'icons.json'

export async function runAssetHandling(config: AssetHandlingConfig) {

    const authors = new Map<string, ImageAuthor>()
    const tmpDir = path.resolve(process.cwd(), "./.tmp-asset-handling")
    const remoteAssetBaseUrl = addTrailingSlash(config.remoteAssetsBaseUrl)
    const { metaOutputDir } = config

    const assetOutputDir = path.resolve(config.targetDir, config.assetOutputPrefix)
    const imageOutputDir = path.resolve(assetOutputDir, config.imageOutputPrefix)

    const faviconDir = config.faviconDir ?? path.resolve('../', imageOutputDir)
    const metaPath = 'meta/'
    const resoucePath = './resources'

    async function setup() {
        await clearPath(imageOutputDir)
        await clearPath(config.metaOutputDir)
        await clearPath(tmpDir)
        await clearPath(path.resolve(tmpDir, metaPath))
    }

    async function runImageCatalogueProcessing() {
        authors.clear()
        const parsedAuthors: ImageAuthor[] = parseYaml((await readFile(
            await fetchMeta('authors.yml')
        )).toString(fileEncoding))
        parsedAuthors.forEach(author => authors.set(author.name.toLowerCase(), author))

        const imagesRaw: ImageRaw[] = parseYaml((await readFile(
            await fetchMeta('images.yml')
        )).toString(fileEncoding))

        const ids = new Set<number>()
        imagesRaw.forEach(image => {
            if (ids.has(image.id)) throw new Error('Encountered repeated id ' + image.id)
            ids.add(image.id)
        })

        const images = await Promise.all(imagesRaw.map(raw => {
            checkAuthor(raw.author, authors)
            return processImage(raw)
        }))

        console.log(`Processed ${images.length} images`)

        const imageCatalogueTargetPath = path.resolve(imageOutputDir, imageCatalogueName)
        await writeFile(imageCatalogueTargetPath, JSON.stringify(images))
        console.log("Wrote image catalogue to", imageCatalogueTargetPath)
    }

    async function runIconProcessing() {
        const iconsRaw: IconsRaw = parseYaml((await readFile(
            await fetchMeta('icons.yml')
        )).toString(fileEncoding))
        const icons = await processIcons(iconsRaw)
        const iconCatalogueTargetPath = path.resolve(imageOutputDir, iconCatalogueName)
        await writeFile(iconCatalogueTargetPath, JSON.stringify(icons))
    }

    async function runIndexCreation() {
        const templateName = "index-template.mustache"
        const templateFile = path.resolve(resoucePath, templateName)
        if (!(await pathExists(templateFile))) {
            console.log(`Gallery asset index template ${templateName} not found, skipping index creation`)
            return
        }

        const files = (await glob(`${assetOutputDir}/**/*`, { nodir: true, absolute: true,  }))
            .map((file) => {
                return <LinkDefinition>{
                    name: path.basename(file),
                    target: '/' + path.relative(config.targetDir, file).replace(/(\\)/g, "/")
                }
            }).sort((a, b) => a.name.localeCompare(b.name))

        const rendered = mustache.render(
            (await readFile(templateFile)).toString(fileEncoding),
            {
                files: files
            }
        )
        const filename = 'index.html'
        await writeFile(path.resolve(imageOutputDir, filename), rendered)
        await writeFile(path.resolve(assetOutputDir, filename), rendered)
    }

    async function fetchRemoteAsset(assetPath: string) : Promise<string> {
        const targetPath = path.resolve(tmpDir, assetPath)
        const url = remoteAssetBaseUrl + assetPath
        const writer = createWriteStream(targetPath)

        return axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        }).then(async (response) => {
            response.data.pipe(writer);
            await finished(writer);
            console.log("Fetched asset", targetPath)
            return targetPath
        });
    }
    async function fetchRemoteImage(image: ImageRaw|string): Promise<string> {
        const imageName = typeof image === 'string' ? image : fileNameFromImage(image)
        return await fetchRemoteAsset(imageName)
    }

    async function fetchMeta(metaFile: string): Promise<string> {
        return await fetchRemoteAsset(addTrailingSlash(metaPath) + metaFile)
    }

    async function processImage(rawImage: ImageRaw) : Promise<ImageExport> {
        checkAuthor(rawImage.author, authors)

        const sourceFilePath = await fetchRemoteImage(rawImage)
        console.log("Processing", sourceFilePath)
        let originalName = fileNameFromImage(rawImage)
        const sharp = createSharp()
        createReadStream(sourceFilePath).pipe(sharp)

        const { width: originalWidth, height: originalHeight } = await sharp.metadata()
        if (!originalWidth) throw new Error('Image width is undefined')
        if (!originalHeight) throw new Error('Image height is undefined')
        const heightLimited = (originalHeight ?? 0) > (originalWidth ?? 0)
        const allowEnlargement = rawImage.categories?.some(c => allowEnlargementFor.includes(c))

        const processingPromises = processingRules.map(async (rule) => {
            const resizeOptions: ResizeOptions = {
                height: heightLimited ? rule.maxDimension : undefined,
                width: heightLimited ? undefined : rule.maxDimension,
                withoutEnlargement: rule.withoutEnlargement && !allowEnlargement
            }

            const nameWithoutExtension = originalName.substring(0, originalName.lastIndexOf('.'))

            const tmpFilePath = path.resolve(
                tmpDir,
                nameWithoutExtension + '.' + fileNameHash() + '.' + rule.format
            )

            const { width, height, format } = await sharp.clone()
                .resize(resizeOptions)
                .toFormat(rule.format, { quality: rule.quality })
                .toFile(tmpFilePath)


            const newFileName = `${nameWithoutExtension}-${width}x${height}`
            const targetImageName = `${newFileName}.${format}`

            const processedTargetPath = path.resolve(imageOutputDir, targetImageName)
            await copyFile(tmpFilePath, processedTargetPath)

            console.log("Wrote processed image to", processedTargetPath)

            return <ImageSrc>{
                src: targetImageName,
                format: format,
                height: height,
                width: width
            }
        })

        const sources = await Promise.all(processingPromises)
        let originalPath = sourceFilePath
        let originalFormat = rawImage.format ?? defaultImageType

        if (!originalName.endsWith(defaultImageType)) {
            originalFormat = defaultImageType
            originalName = replaceExtension(originalName, originalFormat)
            originalPath = path.resolve(tmpDir, originalName)
            // Process the original as well
            await sharp.clone()
                .toFormat(defaultImageType, { quality: originalTransformQuality })
                .toFile(originalPath)
        }

        const originalTargetPath = path.resolve(imageOutputDir, originalName)
        await copyFile(originalPath, originalTargetPath)
        console.log("Wrote original image to", originalTargetPath)

        return {
            id: rawImage.id,
            name: rawImage.name,
            title: rawImage.title,
            nsfw: rawImage.nsfw,
            description: rawImage.description,
            author: authors.get(rawImage.author.toLowerCase()),
            src: sources,
            categories: rawImage.categories ?? ['images'],
            original: {
                width: originalWidth,
                height: originalHeight,
                src: originalName,
                format: originalFormat
            }
        }
    }
    async function processIcons(icons: IconsRaw): Promise<IconExport[]> {
        const sourceImage = await fetchRemoteImage(icons.source)
        const sourceImagePath = path.resolve(tmpDir, sourceImage)
        const sharp = createSharp()
        createReadStream(sourceImagePath).pipe(sharp)

        const processing: Promise<IconExport>[] = []

        icons.variants.forEach(variant => {
            const { size } = variant
            const formats = Array.isArray(variant.format) ? variant.format : [variant.format]
            const quality = variant.quality ?? icons.quality
            const name = variant.name ?? "favicon"

            formats.forEach((format) => {
                const tmpPath = path.resolve(
                    tmpDir,
                    name + '.' + fileNameHash() + '.' + format
                )
                const promise = sharp.clone()
                    .resize({ width: size })
                    .toFormat(format, { quality: quality })
                    .toFile(tmpPath)
                    .then(async (outputInfo) => {
                        const {width, height, format: outputFormat} = outputInfo
                        const targetFileName = `${name}-${width}x${height}.${outputFormat}`
                        const targetPath = path.resolve(imageOutputDir, targetFileName)
                        await copyFile(tmpPath, targetPath);
                        return {
                            name: targetFileName,
                            width: width,
                            height: height,
                            format: outputFormat
                        };
                    })

                processing.push(promise)
            })
        })

        processing.push(fetchDefaultIcon())

        const processedIcons = await Promise.all(processing)

        const defaultIconTemplate = processedIcons
            .find(icon => icon.format === defaultFaviconFormat && icon.width === defaultFaviconSize)

        if (!defaultIconTemplate) throw Error('no default icon found')
        const defaultIcon = { ...defaultIconTemplate }
        defaultIcon.name = 'favicon.png'
        await copyFile(path.resolve(imageOutputDir, defaultIconTemplate.name), path.resolve(imageOutputDir, defaultIcon.name))

        processedIcons.push(defaultIcon)

        return processedIcons
    }

    async function fetchDefaultIcon(): Promise<IconExport> {
        const name = "favicon.ico"
        const icon = await fetchRemoteImage(name)
        await copyFile(icon, path.resolve(imageOutputDir, name))
        return {
            width: 96,
            height: 96,
            name: name,
            format: "ico"
        }
    }

    async function copyFaviconsToFaviconDir() : Promise<void> {
        const favicons = await glob.glob(addTrailingSlash(imageOutputDir) + 'favicon*')
        await Promise.all(favicons.map(iconPath => {
            const name = path.basename(iconPath)
            return copyFile(iconPath, path.resolve(faviconDir, name))
        }))
    }

    async function cleanup(cleanupOutDir = false) {
        if (cleanupOutDir) {
            await clearPath(imageOutputDir)
            await clearPath(metaOutputDir)
        }
        await clearPath(tmpDir)
    }

    async function copyMetadata() {
        const imageCatalogueTargetPath = path.resolve(metaOutputDir, imageCatalogueName)
        await copyFile(path.resolve(imageOutputDir, imageCatalogueName), imageCatalogueTargetPath)
        console.log('Copied image catalogue to', imageCatalogueTargetPath)

        const iconCatalogueTargetPath = path.resolve(metaOutputDir, iconCatalogueName)
        await copyFile(path.resolve(imageOutputDir, iconCatalogueName), iconCatalogueTargetPath)
        console.log('Copied icon catalogue to', iconCatalogueTargetPath)
    }

    await setup()
    await runImageCatalogueProcessing()
    await runIconProcessing()
    await runIndexCreation()


    // Copy Cloudflare's _header file to output dir
    // const headersFileName = '_headers'
    // await copyFile(headersFileName, path.resolve(outDir, headersFileName))

    await copyFaviconsToFaviconDir()
    await copyMetadata()

    // cleanup
    await cleanup()
}