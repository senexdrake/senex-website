import type {Image} from "$lib/model/types";

import set from "+gi/refsheet-bulge.webp/gw"
import large from "+gi/refsheet-bulge.webp/lg"
import full from "+gi/refsheet-bulge.webp/full"
import {wolke as author} from "../authors";

export default <Image>{
    title: "Refsheet (NSFW, bulge)",
    description: "NSFW Refsheet for Senex (clothed with hyper bulge). Refsheet is made by me, based on a 3D model",
    nsfw: true,
    author: author,
    src: [...set, large],
    full: full
}