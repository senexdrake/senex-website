import type {Image} from "$lib/model/types";

import set from "$remoteAssets/macro-parachute.webp?galleryWidth"
import large from "$remoteAssets/macro-parachute.webp?fullsize"
import {syc as author} from "../authors";

export default <Image>{
    title: "Parachuting gone wrong",
    description: "Look, I know this sounds silly, but they claimed these parachutes very \"heavy duty\"!",
    nsfw: false,
    author: author,
    src: [...set, large]
}