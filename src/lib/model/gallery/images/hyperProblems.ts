import type {Image} from "$lib/model/types";

import set from "$remoteAssets/hyper-problems.png?gallery"
import large from "$remoteAssets/hyper-problems.png?fullsize"
import {klotzzilla as author} from "../authors";

export default <Image>{
    title: "Hyper problems",
    description: "I swear, this underwear is getting smaller every day. So annoying.",
    nsfw: true,
    author: author,
    src: [set, large]
}