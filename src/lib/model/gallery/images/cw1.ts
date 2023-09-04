import type {Image, ImageOutputMetadata} from "$lib/model/types";

import set from "+gi/cringeworthington-cock-jumping.webp/gw"
import large from "+gi/cringeworthington-cock-jumping.webp/lg"
import full from "+gi/cringeworthington-cock-jumping.webp/full"
import {cringeworthington as author} from "../authors";

export default <ImageOutputMetadata>{
    title: "Hey there! Wanna join them?",
    description: 'Now would you look at that, a friendly giant! Using his... eh... equipment to bring joy!',
    nsfw: true,
    author: author,
    src: [
        ...set,
        large
    ],
    full: full
}