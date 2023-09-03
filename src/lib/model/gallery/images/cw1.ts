import type {Image, ImageOutputMetadata} from "$lib/model/types";

import set from "+gi/ArisenDrake_BV1.png/gw"
import large from "+gi/ArisenDrake_BV1.png/full"
import {cringeworthington as author} from "../authors";

export default <ImageOutputMetadata>{
    title: "Hey there! Wanna join them?",
    description: 'Now would you look at that, a friendly giant! Using his... eh... equipment to bring joy!',
    nsfw: true,
    author: author,
    src: [
        ...set,
        large
    ]
}