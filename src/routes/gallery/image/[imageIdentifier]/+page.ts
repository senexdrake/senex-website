import type {ImagePageMetadata, Metadata, PageLoadData, ImageCategory} from "$lib/model/types"
import { dev } from "$app/environment"
import { error } from '@sveltejs/kit';
import {categories, getImage, imagesForCategory} from "$lib/model/gallery";

export const csr = dev

export function load(data: PageLoadData) : Metadata|ImagePageMetadata {
    const identifier = data.params["imageIdentifier"]

    const image = getImage(identifier)
    if (!image) throw error(404, 'Not Found')

    return {
        image: image,
        title: `Senex's Gallery - ${image.title}`,
        description: image.description
    }
}

export function entries() {
    const entries: { imageIdentifier: string }[] = []

    categories.forEach(cat => {
        if (!cat.show) return
        imagesForCategory(cat.name).forEach(image => {
            entries.push({ imageIdentifier: image.nameUnique })
        })
    })

    return entries
}