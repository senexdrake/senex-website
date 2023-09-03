import type {Image} from "$lib/model/types";

import set from "$remoteAssets/refsheet-sfw.png?gallery"
import large from "$remoteAssets/refsheet-sfw.png?fullsize"
import {wolke as author} from "../authors";

export default <Image>{
    title: "Refsheet (SFW)",
    description: "SFW Refsheet for Senex. Refsheet is made by me, based on a 3D model",
    nsfw: false,
    author: author,
    src: [...set, large]
}