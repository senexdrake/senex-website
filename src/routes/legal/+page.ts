import type {Metadata} from "$model/types";
import {dev} from "$app/environment"
import {defaultTitle} from "$/config";

// As of now, this doesn't require client side JavaScript. Setting this option to false prevents any
// hydration, which isn't needed right now. The year in the footer will be evaluated at runtime...
// It's enabled in dev mode though to enable hot reloading
export const csr = dev
export function load() {
    return <Metadata>{
        title: defaultTitle + " - Legal stuff"
    }
}