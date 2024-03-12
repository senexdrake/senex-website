import iconCatalogueRaw from "$lib/data/gallery/icons.json"
import profileBannerRaw from "$lib/data/gallery/profileBanner.json"
import type {IconExport, ProfileBannerExport} from "./types";

export const iconCatalogue = iconCatalogueRaw as IconExport[]
export const faviconCatalogue = iconCatalogue.filter(icon => icon.type.startsWith("favicon"))

export const profileBanner = profileBannerRaw as ProfileBannerExport