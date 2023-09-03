import type {Image} from "$lib/model/types";

import set from "$remoteAssets/commission1513.png?gallery"
import large from "$remoteAssets/commission1513.png?fullsize"
import {schwarzfox as author} from "../authors";

export default <Image>{
    title: "Dancing... King?",
    description: "Hope you like what you see, don't know how long this pole can handle me!",
    nsfw: true,
    author: author,
    src: [set, large]
}