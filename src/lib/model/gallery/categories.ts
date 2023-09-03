import type {ImageCategory} from "../types";
import refsheetSfw from "./images/refsheetSfw";
import refsheetBulge from "./images/refsheetBulge";
import refsheetNsfw from "./images/refsheetNsfw";
import cw1 from "./images/cw1";
import phoneBg from "./images/phoneBg";

export const references: ImageCategory = {
    title: "References",
    description: "References for Senex, my big Dragon",
    images: [
        refsheetSfw,
        refsheetBulge,
        refsheetNsfw,
        // TODO implement proper category separation in the UI
        // This "default category" will just be filled with everything for now
        cw1,
        phoneBg
    ]
}

export const additional: ImageCategory = {
    title: "Additional Art",
    description: "Art that I really like, but wouldn't use for references",
    images: [
        cw1,
        phoneBg
    ]
}

export const combined: ImageCategory[] = [references, additional]