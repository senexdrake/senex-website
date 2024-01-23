import type {Plugin, ResolvedConfig} from "vite";
import type {IconExport} from "../model/types";
import type {DisplayModeType, ImageResource, WebAppManifest} from "web-app-manifest";
import {readFile, writeFile} from "fs/promises";
import path from "path";
import { imageMetaDir, defaultTitle, defaultDescription, galleryAssetBaseUrl } from "../../config"

interface CustomWebAppManifest extends WebAppManifest {
    display_override?: DisplayModeType[]
}

const fileFormatMimeMapping = new Map(Object.entries({
    ico: 'image/x-icon'
}))

function iconMimeType(icon: IconExport) : string {
    const mime = fileFormatMimeMapping.get(icon.format)
    return mime ?? `image/${icon.format}`
}

function iconToImage(icon: IconExport, prefix = '/', maskable = false) : ImageResource {
    return {
        purpose: maskable ? 'maskable' : 'any',
        src: prefix + icon.name,
        sizes: `${icon.width}x${icon.height}`,
        type: iconMimeType(icon)
    }
}

export function webmanifest() : Plugin {
    let viteConfig: ResolvedConfig

    return {
        name: 'webmanifest',
        configResolved(cfg) {
            viteConfig = cfg
        },
        async buildEnd() {
            const iconPath = path.join(imageMetaDir, 'icons.json')
            const iconCatalogueRaw = await readFile(iconPath)

            const validSizes = [96, 192, 512]

            const iconCatalogue = (JSON.parse(iconCatalogueRaw.toString()) as IconExport[]).filter(icon => {
                return validSizes.includes(icon.width)
            })

            const normalIcons = iconCatalogue
                .filter(icon => icon.name.startsWith("favicon-"))
                .map(icon => {
                    return iconToImage(icon)
            })

            const maskableIcons = iconCatalogue
                .filter(icon => icon.name.startsWith("pwa-icon"))
                .map(icon => {
                    return iconToImage(icon, galleryAssetBaseUrl, true)
            })

            const icons = [...normalIcons, ...maskableIcons]

            const shortcutIconTypes = ['image/png']
            const shortcutIcons = icons.filter(icon => shortcutIconTypes.includes(icon.type ?? ""))

            const displayModes: DisplayModeType[] = ['minimal-ui', 'browser']

            const webmanifest: CustomWebAppManifest = {
                id: 'zendrake-website',
                orientation: 'any',
                lang: 'en',
                background_color: '#424242',
                theme_color: '#4075a6',
                name: defaultTitle,
                description: defaultDescription,
                start_url: "/",
                display_override: displayModes,
                categories: ['gallery', 'blog', 'personal'],
                icons: icons,
                shortcuts: [
                    {
                        icons: shortcutIcons,
                        name: "Home",
                        url: "/",
                        description: "Home page, featuring a description of the big Dragon as well as contact links"
                    },
                    {
                        icons: shortcutIcons,
                        name: "Gallery",
                        url: "/gallery",
                        description: "A gallery showcasing the big Dragon"
                    },
                    {
                        icons: shortcutIcons,
                        name: "References",
                        url: "/gallery/refs/sfw",
                        description: "A selection of images that should serve as references of the big Dragon"
                    },
                    {
                        icons: shortcutIcons,
                        name: "References (NSFW)",
                        url: "/gallery/refs/nsfw",
                        description: "A selection of images that should serve as references of the big Dragon - NSFW Warning!"
                    }
                ]
            }

            webmanifest.display = displayModes[0] ?? 'browser'
            webmanifest.short_name = webmanifest.name

            const webmanifestPath = path.join(viteConfig.publicDir, "app.webmanifest")
            return await writeFile(webmanifestPath, JSON.stringify(webmanifest))
        }
    }
}