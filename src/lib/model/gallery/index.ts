import imageCatalogueRaw from "$lib/data/gallery/images.json"
import categoryCatalogueRaw from "$lib/data/gallery/categories.json"
import type {ImageCategory, ImageExport} from "../types";

export const allImages = new Map((imageCatalogueRaw as ImageExport[]).map(image => [image.id, image]))

const imageNameToIdMap = new Map<string, number>(
    Array.from(allImages.values()).map((image) => {
        return [image.nameUnique, image.id]
    })
)

export const nsfwSuffix = "-nsfw"
export const defaultCategory = "images"

const catMap = new Map<string, ImageExport[]>()
allImages.forEach(image => image.categories?.forEach((category => {
    if (!catMap.has(category)) catMap.set(category, [])
    catMap.get(category)?.push(image)
})))
export const categoryImageMap = catMap
export const categories = new Map<string, ImageCategory>(
    (categoryCatalogueRaw as ImageCategory[]).filter(cat => cat.show).map(cat => {
        return [cat.name, cat]
    }
))

export const categoryNames = new Set(categories.keys())
export function isChristmas(): boolean {
    const christmasEndDay = 5
    const christmasStartDay = 25

    const now = new Date()

    switch (now.getUTCMonth()) {
        // Keep it around till january at the specified date
        case 0:
            return now.getUTCDate() <= christmasEndDay
        // Start early in november
        case 10:
            return now.getUTCDate() >= christmasStartDay
        // It's always Christmas in december
        case 11:
            return true
    }

    return false
}

let profileImages = categoryImageMap.get('profile') ?? []
const christmasImages = profileImages.filter(image => image.name.includes("christmas"))

if (isChristmas() && christmasImages.length > 0) profileImages = christmasImages

export const profileBanner: ImageExport = profileImages[0]

const oldestFirst = ['references', 'refsheets']
export function imagesForCategory(category: string): ImageExport[] {
    const images = Array.from(categoryImageMap.get(category) ?? [])
    if (!oldestFirst.includes(category)) images.reverse()
    return images
}

export const imageCategories = new Map<number, ImageCategory[]>
categories.forEach(category => {
    const images = categoryImageMap.get(category.name) ?? []
    images.forEach(image => {
        if (!imageCategories.has(image.id)) imageCategories.set(image.id, [])
        imageCategories.get(image.id)?.push(category)
    })
})

export function getImage(name: string): ImageExport|undefined {
    const id = imageNameToIdMap.get(name)
    if (!id) return undefined
    return allImages.get(id)
}

export function linkToImagePage(image: ImageExport, addMainElementFragment = false): string {
    let link = `/gallery/image/${image.nameUnique}`
    if (addMainElementFragment) link += '#main'
    return link
}