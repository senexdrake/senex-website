import type {Image} from "$lib/model/types";

import set from "+gi/schwarzfox-commission1513.webp/gh"
import large from "+gi/schwarzfox-commission1513.webp/lg"
import full from "+gi/schwarzfox-commission1513.webp/full"
import {schwarzfox as author} from "../authors";

export default <Image>{
    title: "Dancing... King?",
    description: "Hope you like what you see, don't know how long this pole can handle me!",
    nsfw: true,
    author: author,
    src: [set, large],
    full: full
}