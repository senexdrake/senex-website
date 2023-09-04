import type {Image} from "$lib/model/types";

import set from "+gi/elkaart-castlevolcano.webp/gh"
import large from "+gi/elkaart-castlevolcano.webp/lg"
import full from "+gi/elkaart-castlevolcano.webp/full"
import {elkaart as author} from "../authors";

export default <Image>{
    title: "Volcanic Eruption",
    description: "Those puny \"defenders\" will witness a very special kind of eruption...",
    nsfw: true,
    author: author,
    src: [...set, large],
    full: full
}