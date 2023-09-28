import iconCatalogueRaw from "$lib/data/icons.json"
import type {IconExport} from "./types";

export const iconCatalogue = iconCatalogueRaw as IconExport[]
export const faviconCatalogue = iconCatalogue.filter(icon => icon.name.startsWith("favicon"))