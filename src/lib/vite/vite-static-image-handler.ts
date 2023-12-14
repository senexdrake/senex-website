import type {Plugin, ResolvedConfig} from "vite";
import {readdir, } from "fs/promises";
import {staticAssetsPrefix, galleryAssetPrefix, galleryAssetDir, imageMetaDir} from "../../config"
import * as path from "path";
import {pathExists} from "../util";
import {runAssetHandling} from "./asset-handling"
import {remoteAssetBaseUrl} from "./asset-handling/config";



export function staticImageHandler() : Plugin {
    let viteConfig: ResolvedConfig

    return {
        name: 'static-image-handler',
        enforce: 'pre',
        configResolved(cfg) {
            viteConfig = cfg
        },
        async buildStart() {
            const galleryAssetOutDir = path.resolve(viteConfig.publicDir, galleryAssetDir)
            if ((await pathExists(galleryAssetOutDir)) && (!viteConfig.build.ssr || (await readdir(galleryAssetOutDir)).length > 0)) {
                console.log(`Gallery asset directory at "${galleryAssetOutDir}" not empty, skipping asset handling`)
                return
            }

            try {
                await runAssetHandling({
                    assetOutputPrefix: staticAssetsPrefix,
                    imageOutputPrefix: galleryAssetPrefix,
                    targetDir: viteConfig.publicDir,
                    metaOutputDir: imageMetaDir,
                    remoteAssetsBaseUrl: remoteAssetBaseUrl,
                    faviconDir: viteConfig.publicDir
                })
            } catch (e: any) {
                console.error("Error handling static assets:", e)
                process.exit(1)
            }


        }
    }
}