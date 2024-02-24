import type {GalleryMetadata, ImageCategory, Metadata, PageLoadData} from "$lib/model/types";
import type {UserSettings} from "$lib/stores/userSettings"
import {categories, categoryNames, defaultCategory, nsfwSuffix} from "$lib/model/gallery";
import {userSettings} from "$lib/stores/userSettings"
import {error} from "@sveltejs/kit";
import {fullSizeMaxWidth} from '$/config'

export const csr = true
const categorySeperator = '-'

export function load(data: PageLoadData) : Metadata|GalleryMetadata {
    let nsfwEnabled = false
    userSettings.subscribe((us: UserSettings) => {
        nsfwEnabled = us.showNsfw
    })

    const rawCategory = data.params["category"] as string ?? defaultCategory
    const categoryParts = rawCategory.split(categorySeperator)

    const lastPart = categoryParts.pop()
    const nsfw = lastPart === 'nsfw'
    const sfw = lastPart === 'sfw'

    // If it's not NSFW, the last part of the category name is actually valid
    // so we have to add it back in
    if (lastPart && !nsfw && !sfw) categoryParts.push(lastPart)

    const categoryName = categoryParts.join(categorySeperator)

    if (!categoryNames.has(categoryName)) error(404)

    return {
        category: categoryName,
        nsfw: nsfw || nsfwEnabled,
        title: "Senex's Gallery",
        description: "This little site contains a select collection of artworks (specially Refsheets) " +
            "I've commissioned over the past years for my fursona.",
        maxWidth: fullSizeMaxWidth
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