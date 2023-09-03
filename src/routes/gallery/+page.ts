import type {ImageCategories, Metadata} from "$model/types";
import type {PageLoad} from "./$types";
import {combined} from "$lib/model/gallery/categories";

export function load(params: PageLoad) {
    return <Metadata|ImageCategories>{
        categories: combined,
        title: "Senex's Gallery",
        description: "This little site contains a select collection of artworks (specially Refsheets) " +
            "I've commissioned over the past years for my fursona.",
    }
}