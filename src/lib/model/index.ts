import iconCatalogueRaw from "$lib/data/gallery/icons.json"
import type {IconExport} from "./types";

export const iconCatalogue = iconCatalogueRaw as IconExport[]
export const faviconCatalogue = iconCatalogue.filter(icon => icon.type.startsWith("favicon"))