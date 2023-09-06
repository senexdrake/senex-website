import type {Images, Metadata} from "$lib/model/types";
import {categories} from "$lib/model/gallery";

export function load(data: any) {
    return <Metadata|Images>{
        category: data.params.category ?? 'images',
        title: "Senex's Gallery",
        description: "This little site contains a select collection of artworks (specially Refsheets) " +
            "I've commissioned over the past years for my fursona.",
        width: '100%'
    }
}

export function entries() {
    return Array.from(categories.keys()).map(category => {
        return { category: category }
    })
}