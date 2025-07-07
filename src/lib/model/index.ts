import iconMetaRaw from "$lib/data/gallery/icons.json"
import profileBannerRaw from "$lib/data/gallery/profileBanner.json"
import type {IconExport, IconMeta, ProfileBannerExport} from "./types";

const iconsSortFunction = (a: IconExport, b: IconExport) => {
    const lengthDiff = a.name.length - b.name.length
    if (lengthDiff !== 0) return lengthDiff
    return b.name.localeCompare(a.name)
}

export const iconMeta = iconMetaRaw as IconMeta
export const iconCatalogue = iconMeta.icons
    .sort(iconsSortFunction)
export const faviconCatalogue = iconCatalogue
    .filter(icon => icon.type.startsWith("favicon"))
    .sort(iconsSortFunction)

export const profileBanner = profileBannerRaw as ProfileBannerExport