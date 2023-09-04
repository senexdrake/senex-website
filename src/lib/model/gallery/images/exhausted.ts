import type {Image} from "$lib/model/types";

import set from "+gi/schwarzfox-commission1430.webp/gw"
import large from "+gi/schwarzfox-commission1430.webp/lg"
import full from "+gi/schwarzfox-commission1430.webp/full"
import {schwarzfox as author} from "../authors";

export default <Image>{
    title: "Exhausted",
    description: "That was one hell of a workout! Wait, what do you mean we haven't started yet? I feel so pent up already though...",
    nsfw: true,
    author: author,
    src: [set, large],
    full: full
}