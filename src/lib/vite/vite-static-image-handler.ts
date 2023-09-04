import type {Plugin, ResolvedConfig} from "vite";
import { dataToEsm } from "@rollup/pluginutils"
import {access, copyFile, mkdir, rm} from "fs/promises";
import {remoteAssetsDir} from "../../config"
import * as path from "path";

const staticAssetPath = '_assets/'
const imagePath = staticAssetPath + 'gallery/'

export async function ensureStaticGalleryPathExists(basePath: string) : Promise<void> {
    const targetPath = path.resolve(basePath, imagePath)
    try {
        await access(targetPath)
    } catch (e: any) {
        await mkdir(targetPath, { recursive: true })
    }
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