import type {Image} from "$lib/model/types";

import set from "$remoteAssets/commission1430.png?galleryWidth"
import large from "$remoteAssets/commission1430.png?fullsize"
import {schwarzfox as author} from "../authors";

export default <Image>{
    title: "Exhausted",
    description: "That was one hell of a workout! Wait, what do you mean we haven't started yet? I feel so pent up already though...",
    nsfw: true,
    author: author,
    src: [set, large]
}