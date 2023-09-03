import type {Image} from "$lib/model/types";

import set from "$remoteAssets/ArisenDrake_BV1.png?gallery"
import large from "$remoteAssets/ArisenDrake_BV1.png?fullsize"
import {cringeworthington as author} from "../authors";

export default <Image>{
    title: "Hey there! Wanna join them?",
    description: 'Now would you look at that, a friendly giant! Using his... eh... equipment to bring joy!',
    nsfw: true,
    author: author,
    src: [...set, large]
}