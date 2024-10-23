import type {Plugin, ResolvedConfig} from "vite";
import type {IconExport, IconMeta} from "../model/types";
import type {DisplayModeType, ImageResource, WebAppManifest} from "web-app-manifest";
import {readFile, writeFile} from "fs/promises";
import path from "path";
import xml from "xmlbuilder2"
import { imageMetaDir, defaultTitle, defaultDescription, galleryAssetBaseUrl, pwaThemeColor, pwaBackgroundColor, libAssetDir } from "../../config"
import {stripTrailingSlash} from "../util-shared";
import {publicUrl} from "../../../helpers"

interface CustomWebAppManifest extends WebAppManifest {
    display_override?: DisplayModeType[]
}

interface SiteMap {
    urlSet: Array<{
        url: string,
        lastModified: string,
        priority?: number,
        changeFrequency?: "always"|"hourly"|"daily"|"weekly"|"monthly"|"yearly"|"never"
    }>
}

const fileFormatMimeMapping = new Map(Object.entries({
    ico: 'image/x-icon'
}))

function sitemapXml(siteMap: SiteMap): string {
    const root = xml.create({ version: "1.0", encoding: "UTF-8" })
    const urlset = root.ele('urlset', { xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9" })
    siteMap.urlSet.forEach(us => {
        urlset.ele('url')
            .ele('loc').txt(us.url).up()
            .ele('lastmod').txt(us.lastModified).up()
            .ele('changefreq').txt(us.changeFrequency ?? "daily").up()
            .ele('priority').txt((us.priority ?? 0.5).toString())
    })
    return root.toString({format: "xml"})
}

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

async function webmanifest(viteConfig: ResolvedConfig) {
    const iconPath = path.join(imageMetaDir, 'icons.json')
    const iconCatalogueRaw: IconMeta = JSON.parse((await readFile(iconPath)).toString())

    const validSizes = [96, 192, 512]

    const iconCatalogue = iconCatalogueRaw.icons.filter(icon => {
        return validSizes.includes(icon.width)
    })

    const normalIcons = iconCatalogue
        .filter(icon => icon.name.startsWith("favicon_"))
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
        background_color: pwaBackgroundColor,
        theme_color: pwaThemeColor,
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
            }
        ]
    }

    webmanifest.display = displayModes[0] ?? 'browser'
    webmanifest.short_name = webmanifest.name

    const filePath = path.join(viteConfig.publicDir, "app.webmanifest")
    return writeFile(filePath, JSON.stringify(webmanifest))
}

async function sitemap(viteConfig: ResolvedConfig) {
    const lastMod = new Date().toISOString()
    const publicUrlString = stripTrailingSlash(publicUrl())
    const siteMap: SiteMap = {urlSet: [
            { url: publicUrlString + "/", lastModified: lastMod, priority: 1.0 },
            { url: publicUrlString + "/legal", lastModified: lastMod }
        ]}
    const filePath = path.join(viteConfig.publicDir, "sitemap.xml")
    return writeFile(filePath, sitemapXml(siteMap))
}

async function robots(viteConfig: ResolvedConfig) {
    const templatePath = path.join(libAssetDir, "site-meta", "robots.template.txt")
    const template = (await readFile(templatePath)).toString()
    const publicUrlString = stripTrailingSlash(publicUrl())
    const content = template.replaceAll("{{PUBLIC_URL}}", publicUrlString)
    const filePath = path.join(viteConfig.publicDir, "robots.txt")
    return writeFile(filePath, content)
}

export function siteMeta() : Plugin {
    let viteConfig: ResolvedConfig

    return {
        name: 'siteMeta',
        configResolved(cfg) {
            viteConfig = cfg
        },
        async buildEnd() {
            await Promise.allSettled([
                webmanifest(viteConfig),
                sitemap(viteConfig),
                robots(viteConfig)
            ])
        }
    }
}