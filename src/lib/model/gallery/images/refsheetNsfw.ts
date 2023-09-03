import type {Image} from "$lib/model/types";

import set from "$remoteAssets/refsheet-naked.png?gallery"
import large from "$remoteAssets/refsheet-naked.png?fullsize"
import {wolke as author} from "../authors";

export default <Image>{
    title: "Refsheet (NSFW, naked)",
    description: "NSFW Refsheet for Senex (naked with hyper genitals). Refsheet is made by me, based on a 3D model",
    nsfw: true,
    author: author,
    src: [...set, large]
}