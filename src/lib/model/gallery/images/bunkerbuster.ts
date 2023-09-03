import type {Image} from "$lib/model/types";

import set from "+gi/bunkerbuster.png/gw"
import large from "+gi/bunkerbuster.png/full"
import setCock from "+gi/bunkerbuster-cock.png/gw"
import largeCock from "+gi/bunkerbuster-cock.png/full"
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