import type {Images, Metadata} from "$model/types";
import type {PageLoad} from "./$types";
import {imageCatalogue} from "$lib/model/gallery";

export function load(params: PageLoad) {
    return <Metadata|Images>{
        galleryImages: imageCatalogue,
        title: "Senex's Gallery",
        description: "This little site contains a select collection of artworks (specially Refsheets) " +
            "I've commissioned over the past years for my fursona.",
    }
}