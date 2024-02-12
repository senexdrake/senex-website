import {readFile, copyFile, writeFile, readdir, stat, cp} from "fs/promises";
import {createWriteStream} from "fs";
import type {ImageAuthor, IconExport, ImageExport, ImageSrc} from "../../model/types"
import type {
    CategoryRaw,
    LinkDefinition,
    FetchedCategory,
    FetchedAuthor, FetchedImage, FetchedImageVariant, FetchedIcon
} from "./types";
import axios from "axios"
import {decode} from 'html-entities';
import mustache from "mustache"
import { glob } from "glob"
import {
    clearPath, formattedDuration, plainTextRenderer, timeLog,
    addTrailingSlash, chalk, formatBytes, pathExists, fileSizeLog
} from "./util"
import { promisify } from "util"
import path from "path"
import * as stream from "stream"
import {
    debug, defaultCategory as defaultCategoryName,
    fileEncoding, imageFetchChunkSize
} from "./config"
import type {AssetHandlingConfig} from "./types";
import type {MarkedExtension} from "marked";
import {Marked} from "marked";
import * as https from "https";
import {stripTrailingSlash} from "../../util-shared";
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

const defaultCategory: FetchedCategory = {
    id: 0,
    name: defaultCategoryName,
    description: "A collection of all images available on this site.",
    displayName: "All Images",
    nsfw: false,
    show: true
}

const timeLogPrefix = "✓"

const makeRelative = (p: string, base: string = process.cwd()) => {
    return path.relative(base, p)
}

export async function runAssetHandling(config: AssetHandlingConfig) {
    const tmpDir = path.join(process.cwd(), "./.tmp-asset-handling")
    const { metaOutputDir } = config

    const assetsServerBasePath = stripTrailingSlash(config.assetsServer)

    const assetOutputDir = path.join(config.targetDir, config.assetOutputPrefix)
    const imageOutputDir = path.join(assetOutputDir, config.imageOutputPrefix)

    const faviconDir = config.faviconDir ?? path.join(imageOutputDir, '../../')
    const resourcePath = './resources'



    async function setup() {
        await clearPath(imageOutputDir)
        await clearPath(config.metaOutputDir)
        await clearPath(tmpDir)
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

    async function fetchIcons(): Promise<Map<string, FetchedIcon[]>> {
        const result = await axiosInstance
            .get(stripTrailingSlash(assetsServerBasePath) + "/icons/icons.json")

        const icons = result.data as FetchedIcon[]

        await Promise.all(icons.map(icon => {
            return fetchIcon(icon)
        }))

        const iconMap = new Map<string, FetchedIcon[]>
        icons.forEach(i => {
            const mappedIcons = iconMap.get(i.type) ?? []
            mappedIcons.push(i)
            iconMap.set(i.type, mappedIcons)
        })

        const defaultFavicons = (iconMap.get("favicon") ?? []).filter(i => i.defaultIcon).map(async (icon) => {
            const newFilename = "favicon." + icon.format
            await copyFile(path.join(tmpDir, icon.fileName), path.join(tmpDir, newFilename))
            return <FetchedIcon>{
                height: icon.height,
                width: icon.width,
                fileName: newFilename,
                defaultIcon: true,
                format: icon.format,
                type: icon.type
            }
        })

        await Promise.all(defaultFavicons).then(icons => icons.forEach(icon => {
            const favicons = iconMap.get("favicon") ?? []
            favicons.push(icon)
            iconMap.set("favicon", favicons)
        }))

        return iconMap
    }

    async function fetchCategories(): Promise<Map<number, FetchedCategory>> {
        const result = await axiosInstance
            .get(stripTrailingSlash(assetsServerBasePath) + "/meta/categories.json")

        const categories = result.data as FetchedCategory[]

        return new Map(categories.map(c => [c.id, c]))
    }

    async function fetchAuthors(): Promise<Map<number, FetchedAuthor>> {
        const result = await axiosInstance
            .get(stripTrailingSlash(assetsServerBasePath) + "/meta/authors.json")

        const authors = result.data as FetchedAuthor[]

        return new Map(authors.map(a => [a.id, a]))
    }

    async function fetchImagesMeta(): Promise<FetchedImage[]> {
        const result = await axiosInstance
            .get(stripTrailingSlash(assetsServerBasePath) + "/meta/images.json")

        return (result.data as FetchedImage[]).filter(i => !nonImageCategories.has(i.id))
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

    async function fetchDefaultIcon() {
        const name = "favicon.ico"
        const targetPath = path.join(tmpDir, name)
        const url = addTrailingSlash(assetsServerBasePath) + "icons/" + name
        const writer = createWriteStream(targetPath)


        return axiosInstance({
            method: 'GET',
            url: url,
            responseType: 'stream'
        }).then(async (response) => {
            response.data.pipe(writer);
            await finished(writer);
            if (debug) console.debug("Fetched asset", makeRelative(targetPath, tmpDir))
            return targetPath
        })
    }

    async function fetchIcon(icon: FetchedIcon): Promise<string> {
        const assetPath = icon.fileName
        const targetPath = path.join(tmpDir, assetPath)
        const url = addTrailingSlash(assetsServerBasePath) + "icons/" + assetPath
        const writer = createWriteStream(targetPath)

        return axiosInstance({
            method: 'GET',
            url: url,
            responseType: 'stream'
        }).then(async (response) => {
            response.data.pipe(writer);
            await finished(writer);
            if (debug) console.debug("Fetched asset", makeRelative(targetPath, tmpDir))
            return targetPath
        })
    }

    async function fetchProcessedImage(variant: FetchedImageVariant): Promise<string> {
        const assetPath = variant.fileName
        const targetPath = path.join(tmpDir, assetPath)
        const url = addTrailingSlash(assetsServerBasePath) + assetPath
        const writer = createWriteStream(targetPath)

        return axiosInstance({
            method: 'GET',
            url: url,
            responseType: 'stream'
        }).then(async (response) => {
            response.data.pipe(writer);
            await finished(writer);
            if (debug) console.debug("Fetched asset", makeRelative(targetPath, tmpDir))
            return targetPath
        })
    }

    async function fetchImageVariantsChunked(variants: FetchedImageVariant[]) {
        for (let i = 0; i < variants.length; i += imageFetchChunkSize) {
            const currentChunk = Math.floor(i / imageFetchChunkSize) + 1
            const chunk = variants.slice(i, i + imageFetchChunkSize)
            const chunkPromises = chunk
                .map(variant => fetchProcessedImage(variant).then(() => variant))

            await Promise.all(chunkPromises)

            if (debug) console.debug(chalk.grey(
                "Finished chunk", currentChunk
            ))
        }
    }

    async function fetchImageAssets(images: FetchedImage[]): Promise<ImageExport[]> {
        const variantsPerImage = new Map<number, number>
        images.forEach(i => variantsPerImage.set(i.id, 0))

        const exportedImages: ImageExport[] = []

        for (const image of images) {
            const variants = image.variants
            if (variants == undefined || variants.length == 0) continue
            await fetchImageVariantsChunked(variants)
            const fetchedAuthor = authors.get(image.authorId)
            const author: ImageAuthor = {
                name: fetchedAuthor?.name ?? "",
                url: fetchedAuthor?.url ?? ""
            }

            const imageCategories = (image.categories ?? []).map(c => {
                const fetchedCategory = categories.get(c)
                if (!fetchedCategory) {
                    console.error("Image category not found in category list:", c)
                    return undefined
                }
                return fetchedCategory
            }).filter((c): c is FetchedCategory => !!c)
            
            const categoryIds = imageCategories.map(c => c.id)

            if (!categoryIds.includes(defaultCategory.id) && categoryIds.every(c => !hiddenCategories.has(c))) {
                imageCategories.push(defaultCategory)
            }

            const rawDescription = image.description.split("\\")
                .map(description => description.trim())
                .join("\n")

            const parsedDescription = await defaultMarked.parseInline(rawDescription)
            const plainDescription = decode(await plainMarked
                .parseInline(rawDescription))

            // const relatedImages = (image.related ?? []).sort((a, b) => a - b)
            // if (relatedImages.includes(image.id)) throw Error(`Image ${rawImage.id} contains image relation to itself!`)

            const variantSources: ImageSrc[] = []
            let metaSrc: ImageSrc|undefined = undefined
            let originalSrc: ImageSrc|undefined = undefined
            
            for (const v of variants) {
                const src = <ImageSrc>{
                    src: v.fileName,
                    format: v.format,
                    height: v.height,
                    width: v.width
                }
                
                if (v.original) {
                    originalSrc = src
                    continue
                }
                
                if (v.suffix == "meta") {
                    metaSrc = src
                    continue
                }
                
                variantSources.push(src)
            }

            exportedImages.push({
                id: image.id,
                name: image.name,
                nameUnique: `${author.name.toLowerCase()}-${image.name}`,
                title: image.title,
                description: parsedDescription,
                descriptionPlain: plainDescription,
                src: variantSources,
                original: originalSrc!,
                metadataSrc: metaSrc!,
                author: author,
                categories: imageCategories.map(c => c.name),
                nsfw: image.nsfw,
                related: image.related
            })
            console.log(`Fetched ${variants.length} variants for image ${image.name}`)
        }

        return exportedImages
    }

    async function copyAssetsToAssetsDir() {
        return cp(tmpDir, imageOutputDir, { recursive: true })
    }

    const start = Date.now()
    await setup()

    const categories = await fetchCategories()
    const hiddenCategories = new Set<number>(Array.from(categories.values()).filter(c => c.show !== true).map(c => c.id))
    const nonImageCategories = new Set<number>(Array.from(categories.values()).filter(c => c.name == "favicon").map(c => c.id))
    const authors =  await fetchAuthors()
    const images = (await fetchImagesMeta()).sort((a, b) => {
        if (a.sortIndex !== undefined && b.sortIndex !== undefined) {
            return a.sortIndex - b.sortIndex
        }

        return a.id - b.id
    })
    const exportedImages = await fetchImageAssets(images)
    const icons = await fetchIcons()

    await fetchDefaultIcon()

    const imageCatalogueTargetPath = path.join(imageOutputDir, imageCatalogueName)
    await writeFile(imageCatalogueTargetPath, JSON.stringify(exportedImages))
    console.log("Wrote image catalogue to", makeRelative(imageCatalogueTargetPath))

    const categoryCatalogueTargetPath = path.join(imageOutputDir, categoryCatalogueName)
    const categoriesRaw = Array.from(categories.values()).map(c => <CategoryRaw>{
        name: c.name,
        nsfw: c.nsfw,
        show: c.show,
        description: c.description,
        displayName: c.displayName
    })

    // Add default category
    categoriesRaw.unshift({
        name: defaultCategory.name,
        description: defaultCategory.description,
        displayName: defaultCategory.displayName,
        show: true,
        nsfw: false
    })

    await writeFile(categoryCatalogueTargetPath, JSON.stringify(categoriesRaw))
    console.log('Wrote category catalogue to', makeRelative(categoryCatalogueTargetPath))

    const iconCatalogueTargetPath = path.join(imageOutputDir, iconCatalogueName)
    await writeFile(iconCatalogueTargetPath, JSON.stringify(Array.from(icons.values()).flat().map(i => <IconExport>{
        type: i.type,
        name: i.fileName,
        format: i.format,
        height: i.height,
        width: i.width
    })))
    console.log("Wrote icon catalogue to", makeRelative(iconCatalogueTargetPath))

    // Copy Cloudflare's _header file to output dir
    // const headersFileName = '_headers'
    // await copyFile(headersFileName, path.join(outDir, headersFileName))

    await copyAssetsToAssetsDir()
    await copyFaviconsToFaviconDir()
    await copyMetadata()

    await runIndexCreation()

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