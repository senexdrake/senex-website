import iconMetaRaw from "$lib/data/gallery/icons.json"
import profileBannerRaw from "$lib/data/gallery/profileBanner.json"
import type {IconMeta, ProfileBannerExport} from "./types";

export const iconMeta = iconMetaRaw as IconMeta
export const iconCatalogue = iconMeta.icons
export const faviconCatalogue = iconCatalogue.filter(icon => icon.type.startsWith("favicon"))

export const profileBanner = profileBannerRaw as ProfileBannerExport