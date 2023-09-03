import type {Image} from "$lib/model/types";

import set from "$remoteAssets/refsheet-sfw.webp?gallery"
import large from "$remoteAssets/refsheet-sfw.webp?fullsize"
import {wolke as author} from "../authors";

export default <Image>{
    title: "Refsheet (SFW)",
    description: "SFW Refsheet for Senex. Refsheet is made by me, based on a 3D model",
    nsfw: false,
    author: author,
    src: [...set, large]
}