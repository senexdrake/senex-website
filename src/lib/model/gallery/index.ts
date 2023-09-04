import imageCatalogueRaw from "$lib/data/images.json"
import type {ImageExport} from "../types";

export const imageCatalogue = (imageCatalogueRaw as ImageExport[])
    .filter(image => image.categories?.includes('images'))

export const profileBanner = (imageCatalogueRaw as ImageExport[])
    .find(image => image.categories?.includes('profile'))