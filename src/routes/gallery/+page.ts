import type {Metadata} from "$model/types";

// Unlike the main page, the gallery requires client side rendering
export const csr = true;

export function load() {
    return <Metadata>{
        title: "Senex's Gallery",
        description: "Coming Soon!"
    }
}