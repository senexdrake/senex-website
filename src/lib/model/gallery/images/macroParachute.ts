import type {Image} from "$lib/model/types";

import set from "+gi/syc-macro-parachute.webp/gw"
import large from "+gi/syc-macro-parachute.webp/lg"
import full from "+gi/syc-macro-parachute.webp/full"
import {syc as author} from "../authors";

export default <Image>{
    title: "Parachuting gone wrong",
    description: "Look, I know this sounds silly, but they claimed these parachutes very \"heavy duty\"!",
    nsfw: false,
    author: author,
    src: [...set, large],
    full: full
}