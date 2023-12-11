import imageCatalogueRaw from "$lib/data/images.json"
import categoryCatalogueRaw from "$lib/data/categories.json"
import type {ImageCategory, ImageExport} from "../types";

export const allImages = new Map((imageCatalogueRaw as ImageExport[]).map(image => [image.id, image]))

export const nsfwSuffix = "-nsfw"
export const defaultCategory = "images"

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

const profileImages = categoryImageMap.get('profile') ?? []
export const profileBanner: ImageExport = profileImages[0]

const oldestFirst = ['references', 'refsheets']
export function imagesForCategory(category: string): ImageExport[] {
    const images = Array.from(categoryImageMap.get(category) ?? [])
    if (!oldestFirst.includes(category)) images.reverse()
    return images
}