import type {Image} from "$lib/model/types";

import set from "+gi/kittykage-spacerock.webp/gw"
import large from "+gi/kittykage-spacerock.webp/lg"
import full from "+gi/kittykage-spacerock.webp/full"
import setCock from "+gi/kittykage-spacerock-speedos.webp/gw"
import largeCock from "+gi/kittykage-spacerock-speedos.webp/lg"
import fullCock from "+gi/kittykage-spacerock-speedos.webp/full"
import {kittykage as author} from "../authors";

export const spacerockTrousers: Image = {
    title: "Not today, Spacerock!",
    description: "Gotta put my size to good use here and save these poor people. " +
        "Although, with this size (especially between the legs), a bit of collateral damage is unavoidable.",
    nsfw: true,
    author: author,
    src: [...set, large],
    full: full
}

export const spacerockSpeedos: Image = {
    title: "Not today, Spacerock! (Even more lewd)",
    description: "Gotta put my size to good use here and save these poor people. " +
        "Although, with this size (especially between the legs), a bit of collateral damage is unavoidable. " +
        "But oh my, these people down there surely get something to see, right?",
    nsfw: true,
    author: author,
    src: [...setCock, largeCock],
    full: fullCock
}

export default [spacerockTrousers, spacerockSpeedos]