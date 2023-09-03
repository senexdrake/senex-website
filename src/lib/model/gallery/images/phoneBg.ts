import type {Image} from "$lib/model/types";

import set from "+gi/phone-bg-deadanthro.png/gh"
import large from "+gi/phone-bg-deadanthro.png/full"
import {deadAnthro as author} from "../authors";

export default <Image>{
    title: "Stop taking pictures, man!",
    description: "Don't you see that I am in a ... difficult situation right now with these tiny short?!",
    nsfw: true,
    author: author,
    src: [...set, large]
}