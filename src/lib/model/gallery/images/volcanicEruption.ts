import type {Image} from "$lib/model/types";

import set from "$remoteAssets/castlevolcano.webp?gallery"
import large from "$remoteAssets/castlevolcano.webp?fullsize"
import {elkaart as author} from "../authors";

export default <Image>{
    title: "Volcanic Eruption",
    description: "Those puny \"defenders\" will witness a very special kind of eruption...",
    nsfw: true,
    author: author,
    src: [...set, large]
}