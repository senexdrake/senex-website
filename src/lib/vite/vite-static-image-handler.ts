import type {Plugin, ResolvedConfig} from "vite";
import { dataToEsm } from "@rollup/pluginutils"
import {createWriteStream, PathLike} from "fs";
import {access, copyFile, mkdir, readdir, rm} from "fs/promises";
import {remoteAssetsDir, dataDir, galleryAssetPrefix} from "../../config"
import * as path from "path";
import {addTrailingSlash, ensurePathExists} from "../util";
import {promisify} from "util";
import stream from "stream";
import axios from "axios";
import {runAssetHandling} from "./asset-handling"
import {remoteAssetBaseUrl} from "./asset-handling/config";
import {glob} from "glob";

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

    async function removeDirectoryIfExists(path: PathLike) {
        try {
            await rm(path, { recursive: true })
        } catch (err: any) {
            if (err.code != 'ENOENT') throw err
            // ENOENT isn't problematic
        }
    }

    async function cleanupFavicons() : Promise<void> {
        const favicons = await glob(addTrailingSlash(viteConfig.publicDir) + 'favicon*')
        await Promise.all(favicons.map(icon => rm(icon)))
    }

    async function cleanupAssets() : Promise<void> {
        await removeDirectoryIfExists(path.resolve(viteConfig.publicDir, staticAssetPath))
        await cleanupFavicons()
    }

    return {
        name: 'static-image-handler',
        enforce: 'pre',
        async configResolved(cfg) {
            viteConfig = cfg
            await ensureStaticGalleryPathExists(viteConfig.publicDir)
        },
        async buildStart() {
            const assetOutputDir = path.resolve(viteConfig.publicDir, galleryAssetPrefix)
            if (!viteConfig.build.ssr || (await readdir(assetOutputDir)).length > 0) {
                console.log(`Gallery asset directory at "${assetOutputDir}" not empty, skipping asset handling`)
                return
            }

            await runAssetHandling({
                assetOutputDir: assetOutputDir,
                metaOutputDir: './src/lib/data',
                remoteAssetsBaseUrl: remoteAssetBaseUrl,
                faviconDir: viteConfig.publicDir
            })
        },
        async closeBundle() {
            // Copy cloudflare _headers file to dist
            const name = '_headers'
            await copyFile(name, path.resolve(viteConfig.build.outDir, name))
            if (!this.meta.watchMode) await cleanupAssets()
        },
        async closeWatcher() {
            await cleanupAssets()
        }
    }
}