import type {Image} from "$lib/model/types";

import set from "+gi/blueblaster-bunkerbuster.webp/gw"
import large from "+gi/blueblaster-bunkerbuster.webp/lg"
import full from "+gi/blueblaster-bunkerbuster.webp/full"
import setCock from "+gi/blueblaster-bunkerbuster-cock.webp/gw"
import largeCock from "+gi/blueblaster-bunkerbuster-cock.webp/lg"
import fullCock from "+gi/blueblaster-bunkerbuster-cock.webp/full"
import {blueblaster as author} from "../authors";

export const bunkerbusterBulge: Image = {
    title: "You better come out or I'll have to get angry...",
    description: 'Thought they could hide in there. Thought I wouldn\'t be able to reach them because I\'m... quite big. Well, maybe they are right.',
    nsfw: true,
    author: author,
    src: [...set, large],
    full: full
}

export const bunkerbusterCock: Image = {
    title: "You better come out or I'll have to get angry... (Cock Version)",
    description: 'Thought they could hide in there. Thought I wouldn\'t be able to reach them because I\'m... quite big. ' +
        'Well, maybe they are right. They will be in for a ... creamy surprise though if they stay down there!',
    nsfw: true,
    author: author,
    src: [...setCock, largeCock],
    full: fullCock
}

export default [bunkerbusterBulge, bunkerbusterCock]