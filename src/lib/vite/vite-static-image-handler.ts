import type {Plugin, ResolvedConfig} from "vite";
import { dataToEsm } from "@rollup/pluginutils"
import {createWriteStream} from "fs";
import {access, copyFile, mkdir, rm} from "fs/promises";
import {remoteAssetsDir, dataDir} from "../../config"
import * as path from "path";
import {addTrailingSlash, ensurePathExists} from "../util";
import {promisify} from "util";
import stream from "stream";
import axios from "axios";

const finished = promisify(stream.finished)

const staticAssetPath = '_assets/'
const imagePath = staticAssetPath + 'gallery/'
const baseUrl = addTrailingSlash(process.env.PUBLIC_IMAGE_BASE_PATH ?? "https://pics.senex.link")

export async function ensureStaticGalleryPathExists(basePath: string) : Promise<void> {
    await ensurePathExists(path.resolve(basePath, imagePath))
}

export async function ensureDataDirectoryExits() : Promise<void> {
    await ensurePathExists(dataDir)
}

export function staticImageHandler() : Plugin {
    let viteConfig: ResolvedConfig

    async function cleanupStaticGallery() : Promise<void> {
        const targetPath = path.resolve(viteConfig.publicDir, staticAssetPath)
        try {
            await rm(targetPath, { recursive: true })
        } catch (err: any) {
            if (err.code != 'ENOENT') throw err
            // ENOENT isn't problematic
        }
    }

    async function fetchCatalogue(catalogueName: string) {
        const targetPath = path.resolve(dataDir, catalogueName)
        const writer = createWriteStream(targetPath)
        await axios({
            method: 'GET',
            url: baseUrl + catalogueName,
            responseType: 'stream'
        }).then(async (response) => {
            response.data.pipe(writer)
            await finished(writer)
            console.log('Wrote catalogue to', targetPath)
        })
    }

    async function fetchImageCatalogue() {
        await fetchCatalogue("images.json")
    }

    async function fetchIconCatalogue() {
        await fetchCatalogue("icons.json")
    }

    const acceptedGalleryImagePrefixes = [
        '+i/',
        '+images/',
        '+gi/'
    ]

    return {
        name: 'static-image-handler',
        enforce: 'pre',
        async configResolved(cfg) {
            viteConfig = cfg
            await ensureStaticGalleryPathExists(viteConfig.publicDir)
        },
        async buildStart() {
            await ensureDataDirectoryExits()
            await fetchImageCatalogue()
            await fetchIconCatalogue()
        },
        resolveId(source: string) {
            if (!acceptedGalleryImagePrefixes.some(param => source.indexOf(param) !== -1)) return null
            const pathParts = source.split('/')
            const assetName = pathParts[1]
            if (!assetName) return null
            const type = (() => {
                switch (pathParts[2]) {
                    case 'fullsize':
                    case 'full':
                    case 'f':
                        return 'fullsize'
                    case 'large':
                    case 'lg':
                        return 'large'
                    case 'gh': return 'galleryHeight'
                    default: return 'galleryWidth'
                }
            })()
            return process.cwd() +'/' + remoteAssetsDir + '/' + assetName + '?' + type
        },
        async load(id) {
            if (id.includes('fullsize')) {
                const srcPath = id.substring(0, id.indexOf('?'))
                const assetName = path.basename(srcPath)
                const fullTargetPath = path.resolve(viteConfig.publicDir, imagePath, assetName)
                await copyFile(srcPath, fullTargetPath)
                const relativePath = '/' + imagePath + assetName
                return dataToEsm(relativePath, {
                    namedExports: viteConfig.json?.namedExports ?? true,
                    compact: !!viteConfig.build.minify ?? false,
                    preferConst: true
                })
            }
        },
        async closeBundle() {
            if (!this.meta.watchMode) await cleanupStaticGallery()
        },
        async closeWatcher() {
            await cleanupStaticGallery()
        }
    }
}