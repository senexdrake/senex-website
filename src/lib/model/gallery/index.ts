import imageCatalogueRaw from "$lib/data/images.json"
import categoryCatalogueRaw from "$lib/data/categories.json"
import type {ImageCategory, ImageExport} from "../types";

export const allImages = imageCatalogueRaw as ImageExport[]


const catMap = new Map<string, ImageExport[]>()
allImages.forEach(image => image.categories?.forEach((category => {
    const targetList: ImageExport[] = catMap.get(category) ?? []
    targetList.push(image)
    catMap.set(category, targetList)
})))
export const categoryImageMap = catMap
export const categories = new Map<string, ImageCategory>(
    (categoryCatalogueRaw as ImageCategory[]).filter(cat => cat.show).map(cat => {
        return [cat.name, cat]
    }
))



export const imageCatalogue = categoryImageMap.get('images') ?? []

const profileImages = categoryImageMap.get('profile') ?? []
export const profileBanner: ImageExport = profileImages[0]

const oldestFirst = ['references']
export function imagesForCategory(category: string): ImageExport[] {
    const images = categoryImageMap.get(category) ?? []
    if (!oldestFirst.includes(category)) images.reverse()
    return images
}