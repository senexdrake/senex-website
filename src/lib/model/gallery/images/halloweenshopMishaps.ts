import type {Image} from "$lib/model/types";

import set from "$remoteAssets/halloweenshop-mishaps.png?galleryWidth"
import large from "$remoteAssets/halloweenshop-mishaps.png?fullsize"
import {deadAnthro as author} from "../authors";

export default <Image>{
    title: "Halloween-shopping mishaps",
    description: "I really want to be a magician, and I am so glad my friend Blue is trying to help me. " +
        "It's not easy with a friend whose endowments are bigger and a lot heavier than your whole body.",
    nsfw: true,
    author: author,
    src: [...set, large]
}