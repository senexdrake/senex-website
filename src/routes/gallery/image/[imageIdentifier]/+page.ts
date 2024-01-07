import type {ImagePageMetadata, Metadata, PageLoadData, MetadataImage, ImageExport} from "$lib/model/types"
import { dev } from "$app/environment"
import { error } from '@sveltejs/kit';
import {categories, getImage, imagesForCategory} from "$lib/model/gallery";
import {stripTrailingSlash} from "$lib/util-shared";
import {PUBLIC_BASE_PATH} from "$env/static/public";
import {galleryAssetBaseUrl} from "$/config"

export const csr = dev

const useImageAsMetadataImage = true
const allowNsfwMetadataImage = true

export function load(data: PageLoadData) : Metadata|ImagePageMetadata {
    const identifier = data.params["imageIdentifier"]

    const image: ImageExport|undefined = getImage(identifier)
    if (!image) error(404, 'Not Found');

    let metadataImages: MetadataImage[]|undefined = undefined

    if (useImageAsMetadataImage && (allowNsfwMetadataImage || !image.nsfw)) {
        const src = image.metadataSrc
        metadataImages = [{
            height: src.height,
            width: src.width,
            alt: image.title,
            url: stripTrailingSlash(PUBLIC_BASE_PATH) + galleryAssetBaseUrl + src.src,
            type: "image/" + src.format
        }]
    }

    return {
        galleryImage: image,
        images: metadataImages,
        title: `Senex's Gallery - ${image.title}`,
        description: image.descriptionPlain,
        cardType: "summary_large_image"
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