import type {Image} from "$lib/model/types";

import set from "+gi/klotzzilla-hyper-problems.webp/gh"
import large from "+gi/klotzzilla-hyper-problems.webp/lg"
import full from "+gi/klotzzilla-hyper-problems.webp/full"
import {klotzzilla as author} from "../authors";

export default <Image>{
    title: "Hyper problems",
    description: "I swear, this underwear is getting smaller every day. So annoying.",
    nsfw: true,
    author: author,
    src: [set, large],
    full: full
}