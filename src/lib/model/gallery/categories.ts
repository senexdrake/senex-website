import type {ImageCategory} from "../types";
import refsheetSfw from "./images/refsheetSfw";
import refsheetBulge from "./images/refsheetBulge";
import refsheetNsfw from "./images/refsheetNsfw";
import cw1 from "./images/cw1";
import phoneBg from "./images/phoneBg";
import clothingStore from "./images/clothingStore";
import bunkerbuster from "./images/bunkerbuster";
import spacerock from "./images/spacerock";
import volcanicEruption from "./images/volcanicEruption";
import dancingKing from "./images/dancingKing";
import exhausted from "./images/exhausted";
import halloweenshopMishaps from "./images/halloweenshopMishaps";
import hyperProblems from "./images/hyperProblems";
import macroParachute from "./images/macroParachute";

export const additional: ImageCategory = {
    title: "Additional Art",
    description: "Art that I really like, but wouldn't use for references",
    images: [
        clothingStore,
        cw1,
        ...bunkerbuster,
        phoneBg,
        ...spacerock,
        volcanicEruption,
        dancingKing,
        exhausted,
        halloweenshopMishaps,
        hyperProblems,
        macroParachute
    ]
}
export const references: ImageCategory = {
    title: "References",
    description: "References for Senex, my big Dragon",
    images: [
        refsheetSfw,
        refsheetBulge,
        refsheetNsfw,
        // TODO implement proper category separation in the UI
        // This "default category" will just be filled with everything for now
        ...additional.images
    ]
}

export const combined: ImageCategory[] = [references, additional]