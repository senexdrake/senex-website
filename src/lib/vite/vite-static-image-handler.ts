import type {Plugin, ResolvedConfig} from "vite";
import { dataToEsm } from "@rollup/pluginutils"
import {access, copyFile, mkdir} from "fs/promises";
import * as path from "path";

const imagePath = '_assets/gallery/'

export async function ensurePublicGalleryPathExists(basePath: string) : Promise<void> {
    const targetPath = path.resolve(basePath, imagePath)
    try {
        await access(targetPath)
    } catch (e: any) {
        await mkdir(targetPath, { recursive: true })
    }
}

export function staticImageHandler() : Plugin {
    let viteConfig: ResolvedConfig

    return {
        name: 'static-image-handler',
        enforce: 'pre',
        async configResolved(cfg) {
            viteConfig = cfg
            await ensurePublicGalleryPathExists(viteConfig.publicDir)
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
        }
    }
}