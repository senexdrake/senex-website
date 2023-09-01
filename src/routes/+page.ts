import type {Metadata} from "$model/types";

// As of now, this doesn't require client side JavaScript. Setting this option to false prevents any
// hydration, which isn't needed right now. The year in the footer will be evaluated at runtime...
export const csr = false
export function load() {
    return <Metadata>{}
}