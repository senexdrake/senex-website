import type {Image} from "$lib/model/types";

import set from "$remoteAssets/refsheet-bulge.webp?galleryWidth"
import large from "$remoteAssets/refsheet-bulge.webp?fullsize"
import {wolke as author} from "../authors";

export default <Image>{
    title: "Refsheet (NSFW, bulge)",
    description: "NSFW Refsheet for Senex (clothed with hyper bulge). Refsheet is made by me, based on a 3D model",
    nsfw: true,
    author: author,
    src: [...set, large]
}