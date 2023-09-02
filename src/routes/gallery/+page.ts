import type {Metadata} from "$model/types";

export function load() {
    return <Metadata>{
        title: "Senex's Gallery",
        description: "This little site contains a select collection of artworks (specially Refsheets) " +
            "I've commissioned over the past years for my fursona."
    }
}