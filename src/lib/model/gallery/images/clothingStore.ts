import type {Image} from "$lib/model/types";

import set from "$remoteAssets/senexmirror.webp?gallery"
import large from "$remoteAssets/senexmirror.webp?fullsize"
import {aFurreak as author} from "../authors";

export default <Image>{
    title: "Is that the biggest size you got?",
    description: 'How is something that\'s this tiny supposed to fit anyone?!',
    nsfw: false,
    author: author,
    src: [...set, large]
}