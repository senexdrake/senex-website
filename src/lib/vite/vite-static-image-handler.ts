import type {Plugin, ResolvedConfig} from "vite";
import {readdir, } from "fs/promises";
import {staticAssetsPrefix, galleryAssetPrefix} from "../../config"
import * as path from "path";
import {pathExists} from "../util";
import {runAssetHandling} from "./asset-handling"
import {remoteAssetBaseUrl} from "./asset-handling/config";



export function staticImageHandler() : Plugin {
    let viteConfig: ResolvedConfig

    return {
        name: 'static-image-handler',
        enforce: 'pre',
        async configResolved(cfg) {
            viteConfig = cfg
        },
        async buildStart() {
            const staticAssetOutDir = path.resolve(viteConfig.publicDir, staticAssetsPrefix)
            const galleryAssetOutDir = path.resolve(viteConfig.publicDir, galleryAssetPrefix)
            if ((await pathExists(galleryAssetOutDir)) && (!viteConfig.build.ssr || (await readdir(galleryAssetOutDir)).length > 0)) {
                console.log(`Gallery asset directory at "${galleryAssetOutDir}" not empty, skipping asset handling`)
                return
            }

            await runAssetHandling({
                imageOutputDir: galleryAssetOutDir,
                assetOutputDir: staticAssetOutDir,
                metaOutputDir: './src/lib/data',
                remoteAssetsBaseUrl: remoteAssetBaseUrl,
                faviconDir: viteConfig.publicDir
            })
        }
    }
}