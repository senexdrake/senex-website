import { parse as parseYaml } from "yaml"
import {readFile, copyFile, writeFile, readdir, stat} from "fs/promises";
import {createReadStream, createWriteStream} from "fs";
import type {ImageAuthor, IconExport, ImageExport, ImageSrc} from "../../model/types"
import type {CategoryRaw, IconsRaw, ImageRaw, LinkDefinition, FormatOptions} from "./types";
import type {PngOptions, ResizeOptions} from "sharp"
import createSharp from 'sharp'
import axios from "axios"
import {decode} from 'html-entities';
import mustache from "mustache"
import { glob } from "glob"
import {
    checkAuthor,
    clearPath,
    fileNameFromImage,
    fileNameHash, formattedDuration, plainTextRenderer,
    replaceExtension, timeLog,
    addTrailingSlash, chalk, formatBytes, pathExists, fileSizeLog
} from "./util"
import { promisify } from "util"
import path from "path"
import * as stream from "stream"
import {
    allowEnlargementFor, debug, defaultCategory,
    defaultFaviconFormat, defaultFaviconSize,
    defaultImageType,
    fileEncoding, metaMaxDimension, originalMaxDimension,
    originalTransformQuality,
    processingRules,
} from "./config"
import type {AssetHandlingConfig} from "./types";
import type {MarkedExtension} from "marked";
import {Marked} from "marked";
import * as https from "https";
const finished = promisify(stream.finished)

const imageCatalogueName = 'images.json'
const iconCatalogueName = 'icons.json'
const categoryCatalogueName = 'categories.json'

const axiosInstance = axios.create({
    timeout: 30000,
    httpsAgent: new https.Agent({keepAlive: true})
})

const markedOptions: MarkedExtension = {
    gfm: true,
    breaks: true
}
const defaultMarked = new Marked(markedOptions)

const plainMarked = new Marked({
    ...markedOptions,
    renderer: plainTextRenderer
})

const timeLogPrefix = "✓"

const makeRelative = (p: string, base: string = process.cwd()) => {
    return path.relative(base, p)
}

export async function runAssetHandling(config: AssetHandlingConfig) {

    const hiddenCategories = new Set<string>()
    const authors = new Map<string, ImageAuthor>()
    const tmpDir = path.join(process.cwd(), "./.tmp-asset-handling")
    const remoteAssetBaseUrl = addTrailingSlash(config.remoteAssetsBaseUrl)
    const { metaOutputDir } = config

    const assetOutputDir = path.join(config.targetDir, config.assetOutputPrefix)
    const imageOutputDir = path.join(assetOutputDir, config.imageOutputPrefix)

    const faviconDir = config.faviconDir ?? path.join(imageOutputDir, '../../')
    const metaPath = 'meta/'
    const resourcePath = './resources'

    async function setup() {
        await clearPath(imageOutputDir)
        await clearPath(config.metaOutputDir)
        await clearPath(tmpDir)
        await clearPath(path.join(tmpDir, metaPath))
    }

    async function parseImageList(): Promise<ImageRaw[]> {
        const filePath = await fetchMeta('images.yml')
        const imagesRaw = parseYaml((await readFile(filePath)).toString()) as ImageRaw[]

        const ids = new Set<number>()
        const filteredImages: ImageRaw[] = []

        for (const image of imagesRaw) {
            if (ids.has(image.id)) throw new Error('Encountered repeated id ' + image.id)
            ids.add(image.id)

            // Filter images that have been marked as "skip"
            if (image.skip) continue

            filteredImages.push(image)
        }

        return filteredImages
    }

    async function runImageCatalogueProcessing() {
        let start = Date.now()
        authors.clear()
        const parsedAuthors: ImageAuthor[] = parseYaml((await readFile(
            await fetchMeta('authors.yml')
        )).toString(fileEncoding))
        parsedAuthors.forEach(author => authors.set(author.name.toLowerCase(), author))

        const categoriesRaw: CategoryRaw[] = parseYaml((await readFile(
            await fetchMeta('categories.yml')
        )).toString(fileEncoding))
        // If "show" attribute is not set, assume it's true
        // If "nsfw" is not set, assume it's false
        categoriesRaw.forEach(cat => {
            if (cat.show === undefined) cat.show = true
            if (cat.nsfw === undefined) cat.nsfw = false
        })
        categoriesRaw.filter(cat => !cat.show).forEach(cat => hiddenCategories.add(cat.name))

        const imagesRaw = await parseImageList()

        console.log(timeLog(
            timeLogPrefix, "Meta fetched in", formattedDuration(start)
        ))

        start = Date.now()
        const fetchedImages: {rawImage: ImageRaw, sourceFilePath: string}[] = []

        for (const image of imagesRaw) {
            fetchedImages.push({
                rawImage: image,
                sourceFilePath: await fetchRemoteImage(image)
            })
        }
        console.log(timeLog(
            timeLogPrefix, `Fetched ${fetchedImages.length} images in`, formattedDuration(start)
        ))
        console.log(chalk.bold(
            "Size of fetched assets:", fileSizeLog(formatBytes(await dirSize(tmpDir)))
        ))

        start = Date.now()
        console.log(chalk.bold(
            "Starting processing..."
        ))
        const images = await Promise.all(
            fetchedImages.map(({rawImage, sourceFilePath}) => processImage(rawImage, sourceFilePath))
        )

        console.log(timeLog(
            timeLogPrefix, `Processed ${images.length} images in`, formattedDuration(start)
        ))

        const imageCatalogueTargetPath = path.join(imageOutputDir, imageCatalogueName)
        await writeFile(imageCatalogueTargetPath, JSON.stringify(images))
        console.log("Wrote image catalogue to", makeRelative(imageCatalogueTargetPath))

        const categoryCatalogueTargetPath = path.join(imageOutputDir, categoryCatalogueName)
        await writeFile(categoryCatalogueTargetPath, JSON.stringify(categoriesRaw))
        console.log('Wrote category catalogue to', makeRelative(categoryCatalogueTargetPath))
    }

    async function runIconProcessing() {
        const iconsRaw: IconsRaw = parseYaml((await readFile(
            await fetchMeta('icons.yml')
        )).toString(fileEncoding))
        const icons = await processIcons(iconsRaw)
        const iconCatalogueTargetPath = path.join(imageOutputDir, iconCatalogueName)
        await writeFile(iconCatalogueTargetPath, JSON.stringify(icons))
    }

    async function runIndexCreation() {
        const templateName = "index-template.mustache"
        const templateFile = path.join(resourcePath, templateName)
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
        await writeFile(path.join(imageOutputDir, filename), rendered)
        await writeFile(path.join(assetOutputDir, filename), rendered)
    }

    async function fetchRemoteAsset(assetPath: string) : Promise<string> {
        const targetPath = path.join(tmpDir, assetPath)
        const url = remoteAssetBaseUrl + assetPath
        const writer = createWriteStream(targetPath)

        return axiosInstance({
            method: 'GET',
            url: url,
            responseType: 'stream'
        }).then(async (response) => {
            response.data.pipe(writer);
            await finished(writer);
            console.log("Fetched asset", makeRelative(targetPath, tmpDir))
            return targetPath
        })
    }
    async function fetchRemoteImage(image: ImageRaw|string): Promise<string> {
        const imageName = typeof image === 'string' ? image : fileNameFromImage(image)
        try {
            return await fetchRemoteAsset(imageName)
        } catch (error: any) {
            if (error.code === 404) {
                console.error("Could not find image", imageName)
            }
            throw error
        }
    }

    async function fetchMeta(metaFile: string): Promise<string> {
        return await fetchRemoteAsset(addTrailingSlash(metaPath) + metaFile)
    }

    async function processImage(rawImage: ImageRaw, sourceFilePath: string) : Promise<ImageExport> {
        checkAuthor(rawImage.author, authors)
        if (debug) console.debug("Processing", makeRelative(sourceFilePath, tmpDir))
        let originalName = fileNameFromImage(rawImage)
        const sharp = createSharp()
        createReadStream(sourceFilePath).pipe(sharp)

        const { width: originalWidth, height: originalHeight } = await sharp.metadata()
        if (!originalWidth) throw new Error('Image width is undefined')
        if (!originalHeight) throw new Error('Image height is undefined')
        const heightLimited = (originalHeight ?? 0) > (originalWidth ?? 0)
        const allowEnlargement = rawImage.categories?.some(c => allowEnlargementFor.includes(c))
        const nameWithoutExtension = originalName.substring(0, originalName.lastIndexOf('.'))

        const processingPromises = processingRules.map(async (rule) => {
            const resizeOptions: ResizeOptions = {
                height: heightLimited ? rule.maxDimension : undefined,
                width: heightLimited ? undefined : rule.maxDimension,
                withoutEnlargement: rule.withoutEnlargement && !allowEnlargement
            }

            const tmpFilePath = path.join(
                tmpDir,
                nameWithoutExtension + '.' + fileNameHash() + '.' + rule.format
            )

            const { width, height, format } = await sharp.clone()
                .resize(resizeOptions)
                .toFormat(rule.format, { quality: rule.quality })
                .toFile(tmpFilePath)


            const newFileName = `${nameWithoutExtension}-${width}x${height}`
            const targetImageName = `${newFileName}.${format}`

            const processedTargetPath = path.join(imageOutputDir, targetImageName)
            await copyFile(tmpFilePath, processedTargetPath)

            if (debug) console.debug("Wrote processed image to", makeRelative(processedTargetPath))

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
        const originalFormat = rawImage.format ?? defaultImageType
        let needsResize = (heightLimited && originalHeight > originalMaxDimension) || originalWidth > originalMaxDimension
        needsResize = needsResize && !rawImage.noResize

        const original: ImageSrc = {
            width: originalWidth,
            height: originalHeight,
            format: originalFormat,
            src: originalName
        }

        if (originalFormat !== defaultImageType || needsResize) {
            // Process the original as well
            let clonedSharp = sharp.clone()

            if (!rawImage.noResize) clonedSharp = clonedSharp.resize({
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
        }

        const originalTargetPath = path.join(imageOutputDir, originalName)
        await copyFile(originalPath, originalTargetPath)
        if (debug) console.debug("Wrote original image to", makeRelative(originalTargetPath))

        // --- Metadata Version ---

        const metadataVersionFormat = "png"
        const metadataVersionName = nameWithoutExtension + '-meta.' + metadataVersionFormat
        const metadataVersionPath = path.join(tmpDir, metadataVersionName)
        const metadataMaxDimension = metaMaxDimension
        const metadataVersionResult = await sharp.clone()
            .resize({
                height: heightLimited ? metadataMaxDimension : undefined,
                width: heightLimited ? undefined : metadataMaxDimension,
                withoutEnlargement: true
            })
            .toFormat(metadataVersionFormat, { quality: originalTransformQuality })
            .toFile(metadataVersionPath)

        const metadataVersionTargetPath = path.join(imageOutputDir, metadataVersionName)
        await copyFile(metadataVersionPath, metadataVersionTargetPath)

        const metadataVersion: ImageSrc = {
            width: metadataVersionResult.width,
            height: metadataVersionResult.height,
            format: metadataVersionFormat,
            src: metadataVersionName
        }

        if (debug) console.debug("Wrote metadata image to", makeRelative(metadataVersionTargetPath))

        // --- Done ---

        const categories = Array.from(rawImage.categories ?? [])
        if (!categories.includes(defaultCategory) && categories.every(cat => !hiddenCategories.has(cat))) {
            categories.push(defaultCategory)
        }

        const author = authors.get(rawImage.author.toLowerCase()) ?? { name: "UNKNOWN", url: "" }

        const rawDescription = rawImage.description.split("\\")
            .map(description => description.trim())
            .join("\n")

        const parsedDescription = await defaultMarked.parseInline(rawDescription)
        const plainDescription = decode(await plainMarked
            .parseInline(rawDescription))

        const relatedImages = (rawImage.related ?? []).sort((a, b) => a - b)
        if (relatedImages.includes(rawImage.id)) throw Error(`Image ${rawImage.id} contains image relation to itself!`)

        console.log("Processed", makeRelative(sourceFilePath, tmpDir), "->", original.src)

        return {
            id: rawImage.id,
            name: rawImage.name,
            nameUnique: `${author.name.toLowerCase()}-${rawImage.name}`,
            title: rawImage.title,
            nsfw: rawImage.nsfw,
            description: parsedDescription,
            descriptionPlain: plainDescription,
            author: author,
            src: sources,
            categories: categories,
            related: relatedImages,
            original: original,
            metadataSrc: metadataVersion
        }
    }

    async function processIcons(icons: IconsRaw): Promise<IconExport[]> {
        const sourceImage = await fetchRemoteImage(icons.source)
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
                        const targetFileName = `${name}-${width}x${height}.${outputFormat}`
                        const targetPath = path.join(imageOutputDir, targetFileName)
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

        createReadStream(sourceImage).pipe(sharp)
        processing.push(fetchDefaultIcon())

        const processedIcons = await Promise.all(processing)

        const defaultIconTemplate = processedIcons
            .find(icon => icon.format === defaultFaviconFormat && icon.width === defaultFaviconSize)

        if (!defaultIconTemplate) throw Error('no default icon found')
        const defaultIcon = { ...defaultIconTemplate }
        defaultIcon.name = 'favicon.png'
        await copyFile(path.join(imageOutputDir, defaultIconTemplate.name), path.join(imageOutputDir, defaultIcon.name))

        processedIcons.push(defaultIcon)

        return processedIcons
    }

    async function fetchDefaultIcon(): Promise<IconExport> {
        const name = "favicon.ico"
        const icon = await fetchRemoteImage(name)
        await copyFile(icon, path.join(imageOutputDir, name))
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
            return copyFile(iconPath, path.join(faviconDir, name))
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
        const categoryCataloguePath = path.join(metaOutputDir, categoryCatalogueName)
        await copyFile(path.join(imageOutputDir, categoryCatalogueName), categoryCataloguePath)
        console.log('Copied category catalogue to', makeRelative(categoryCataloguePath))

        const imageCatalogueTargetPath = path.join(metaOutputDir, imageCatalogueName)
        await copyFile(path.join(imageOutputDir, imageCatalogueName), imageCatalogueTargetPath)
        console.log('Copied image catalogue to', makeRelative(imageCatalogueTargetPath))

        const iconCatalogueTargetPath = path.join(metaOutputDir, iconCatalogueName)
        await copyFile(path.join(imageOutputDir, iconCatalogueName), iconCatalogueTargetPath)
        console.log('Copied icon catalogue to', makeRelative(iconCatalogueTargetPath))
    }

    async function dirSize(directory: string) {
        const files = await readdir( directory )
        const stats = await Promise.all(files.map( file => stat( path.join( directory, file ) ) ))

        return stats.reduce((accumulator, { size }) => accumulator + size, 0);
    }

    const start = Date.now()

    await setup()
    await runImageCatalogueProcessing()
    await runIconProcessing()
    await runIndexCreation()


    // Copy Cloudflare's _header file to output dir
    // const headersFileName = '_headers'
    // await copyFile(headersFileName, path.join(outDir, headersFileName))

    await copyFaviconsToFaviconDir()
    await copyMetadata()

    // cleanup
    await cleanup()

    const timeInSeconds = formattedDuration(start, Date.now())
    console.log(timeLog(
        timeLogPrefix, "Image handling took", timeInSeconds
    ))
    console.log(chalk.bold(
        "Total size of gallery assets:", fileSizeLog(formatBytes(await dirSize(imageOutputDir)))
    ))

}