import type {Image} from "$lib/model/types";

import set from "+gi/afurreak-senexmirror.webp/gw"
import large from "+gi/afurreak-senexmirror.webp/lg"
import full from "+gi/afurreak-senexmirror.webp/full"
import {aFurreak as author} from "../authors";

export default <Image>{
    title: "Is that the biggest size you got?",
    description: 'How is something that\'s this tiny supposed to fit anyone?!',
    nsfw: false,
    author: author,
    src: [...set, large],
    full: full
}