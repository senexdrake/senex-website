import type {Image} from "$lib/model/types";

import set from "$remoteAssets/bunkerbuster.png?gallery"
import large from "$remoteAssets/bunkerbuster.png?fullsize"
import setCock from "$remoteAssets/bunkerbuster-cock.png?gallery"
import largeCock from "$remoteAssets/bunkerbuster-cock.png?fullsize"
import {blueblaster as author} from "../authors";

export const bunkerbusterBulge: Image = {
    title: "You better come out or I'll have to get angry...",
    description: 'Thought they could hide in there. Thought I wouldn\'t be able to reach them because I\'m... quite big. Well, maybe they are right.',
    nsfw: true,
    author: author,
    src: [...set, large]
}

export const bunkerbusterCock: Image = {
    title: "You better come out or I'll have to get angry... (Cock Version)",
    description: 'Thought they could hide in there. Thought I wouldn\'t be able to reach them because I\'m... quite big. ' +
        'Well, maybe they are right. They will be in for a ... creamy surprise though if they stay down there!',
    nsfw: true,
    author: author,
    src: [...setCock, largeCock]
}

export default [bunkerbusterBulge, bunkerbusterCock]