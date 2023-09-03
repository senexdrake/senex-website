import type {Image} from "$lib/model/types";

import set from "+gi/not-today-spacerock-trousers.webp/gw"
import large from "+gi/not-today-spacerock-trousers.webp/full"
import setCock from "+gi/not-today-spacerock-speedos.webp/gw"
import largeCock from "+gi/not-today-spacerock-speedos.webp/full"
import {kittykage as author} from "../authors";

export const spacerockTrousers: Image = {
    title: "Not today, Spacerock!",
    description: "Gotta put my size to good use here and save these poor people. " +
        "Although, with this size (especially between the legs), a bit of collateral damage is unavoidable.",
    nsfw: true,
    author: author,
    src: [...set, large]
}

export const spacerockSpeedos: Image = {
    title: "Not today, Spacerock! (Even more lewd)",
    description: "Gotta put my size to good use here and save these poor people. " +
        "Although, with this size (especially between the legs), a bit of collateral damage is unavoidable. " +
        "But oh my, these people down there surely get something to see, right?",
    nsfw: true,
    author: author,
    src: [...setCock, largeCock]
}

export default [spacerockTrousers, spacerockSpeedos]