import type {GalleryMetadata, ImageCategory, Metadata, PageLoadData} from "$lib/model/types";
import {categories, defaultCategory, nsfwSuffix} from "$lib/model/gallery";

export const csr = true
const categorySeperator = '-'

export function load(data: PageLoadData) : Metadata|GalleryMetadata {
    const rawCategory = data.params["category"] as string ?? defaultCategory
    const categoryParts = rawCategory.split(categorySeperator)

    const lastPart = categoryParts.pop()
    const nsfw = lastPart === 'nsfw'

    // If it's not NSFW, the last part of the category name is actually valid
    // so we have to add it back in
    if (!nsfw && lastPart) categoryParts.push(lastPart)

    const categoryName = categoryParts.join(categorySeperator)

    return {
        category: categoryName,
        nsfw: nsfw,
        title: "Senex's Gallery",
        description: "This little site contains a select collection of artworks (specially Refsheets) " +
            "I've commissioned over the past years for my fursona.",
        width: '100%'
    }
}

export function entries() {
    const entries: Array<{ category: string }> = []

    categories.forEach((category: ImageCategory) => {
        if (!category.nsfw) entries.push({ category: category.name })
        entries.push({ category: category.name + nsfwSuffix })
    })

    return entries
}