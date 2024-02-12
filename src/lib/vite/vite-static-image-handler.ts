import type {Plugin, ResolvedConfig} from "vite";
import {readdir, } from "fs/promises";
import {staticAssetsPrefix, galleryAssetPrefix, galleryAssetDir, imageMetaDir} from "../../config"
import * as path from "path";
import {chalk, pathExists} from "../util";
import {runAssetHandling} from "./asset-handling"
import {remoteAssetBaseUrl} from "./asset-handling/config";

function onFinished() {
    console.log(chalk.bold(
        "-- Asset handler done --"
    ))
}

export function staticImageHandler() : Plugin {
    let viteConfig: ResolvedConfig

    return {
        name: 'static-image-handler',
        enforce: 'pre',
        configResolved(cfg) {
            viteConfig = cfg
        },
        async buildStart() {
            console.log(chalk.bold(
                "-- Asset handler starting --"
            ))
            const galleryAssetOutDir = path.resolve(viteConfig.publicDir, galleryAssetDir)
            if ((await pathExists(galleryAssetOutDir)) && (!viteConfig.build.ssr || (await readdir(galleryAssetOutDir)).length > 0)) {
                console.log(chalk.greenBright(
                    `Skipping asset handling because ${galleryAssetOutDir} is not empty!`
                ))
                onFinished()
                return
            }

            try {
                await runAssetHandling({
                    assetOutputPrefix: staticAssetsPrefix,
                    imageOutputPrefix: galleryAssetPrefix,
                    targetDir: viteConfig.publicDir,
                    metaOutputDir: imageMetaDir,
                    assetsServer: remoteAssetBaseUrl,
                    faviconDir: viteConfig.publicDir
                })
                onFinished()
            } catch (e) {
                console.error(chalk.red("Error handling static assets:"), e)
                process.exit(1)
            }

        }
    }
}