import type {Image} from "$lib/model/types";

import set from "+gi/refsheet-sfw.webp/gw"
import large from "+gi/refsheet-sfw.webp/full"
import {wolke as author} from "../authors";

export default <Image>{
    title: "Refsheet (SFW)",
    description: "SFW Refsheet for Senex. Refsheet is made by me, based on a 3D model",
    nsfw: false,
    author: author,
    src: [...set, large]
}