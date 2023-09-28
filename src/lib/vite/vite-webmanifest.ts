import type {Plugin, ResolvedConfig} from "vite";
import type {IconExport} from "../model/types";
import type {DisplayModeType, ImageResource, WebAppManifest} from "web-app-manifest";
import {readFile, writeFile} from "fs/promises";
import path from "path";
import { dataDir, defaultTitle, defaultDescription } from "../../config"

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
export function webmanifest() : Plugin {
    let viteConfig: ResolvedConfig

    return {
        name: 'webmanifest',
        async configResolved(cfg) {
            viteConfig = cfg
        },
        buildEnd: async function () {
            const iconPath = path.join(dataDir, 'icons.json')
            const iconCatalogueRaw = await readFile(iconPath)
            const iconCatalogue = JSON.parse(iconCatalogueRaw.toString()) as IconExport[]

            const validSizes = [96, 192, 512]
            const maskableIconSize = [512]

            const icons: ImageResource[] = []
            const shortcutIcons: ImageResource[] = []

            iconCatalogue
                .filter(icon => icon.name.startsWith("favicon") && validSizes.includes(icon.width))
                .forEach(icon => {
                    const imageResource: ImageResource = {
                        purpose: 'any',
                        src: `/${icon.name}`,
                        sizes: `${icon.width}x${icon.height}`,
                        type: iconMimeType(icon)
                    }
                    icons.push(imageResource)

                    if (maskableIconSize.includes(icon.width)) {
                        const maskableResource = Object.assign({}, imageResource)
                        maskableResource.purpose = 'maskable'
                        icons.push(maskableResource)
                    }

            })



            const displayModes: DisplayModeType[] = ['minimal-ui', 'browser']

            const webmanifest: CustomWebAppManifest = {
                id: 'senex-gallery',
                orientation: 'portrait-primary',
                lang: 'en',
                background_color: '#424242',
                theme_color: '#4075a6',
                name: defaultTitle,
                description: defaultDescription,
                start_url: "/",
                display_override: displayModes,
                categories: ['gallery', 'blog', 'personal'],
                shortcuts: [
                    {
                        icons: icons,
                        name: "Home",
                        url: "/",
                        description: "Home page, featuring a description of the big Dragon as well as contact links"
                    },
                    {
                        icons: icons,
                        name: "Gallery",
                        url: "/gallery",
                        description: "A gallery showcasing the big Dragon"
                    },
                    {
                        icons: icons,
                        name: "Reference Gallery",
                        url: "/gallery/references",
                        description: "A selection of images that should serve as references of the big Dragon"
                    }
                ],
                icons: icons
            }

            webmanifest.display = displayModes[0] ?? 'browser'
            webmanifest.short_name = webmanifest.name

            const webmanifestPath = path.join(viteConfig.publicDir, "app.webmanifest")
            await writeFile(webmanifestPath, JSON.stringify(webmanifest))
        }
    }
}