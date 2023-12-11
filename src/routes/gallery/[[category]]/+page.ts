import type {GalleryMetadata, ImageCategory, Metadata} from "$lib/model/types";
import {categories, defaultCategory, nsfwSuffix} from "$lib/model/gallery";

export const csr = true

export function load(data: any) : Metadata|GalleryMetadata {
    const rawCategory = data.params.category as string ?? defaultCategory
    const categoryParts = rawCategory.split('-')

    const categoryName = categoryParts[0]
    const nsfw = categoryParts[1] === 'nsfw'
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