import type {LinkItem, Metadata} from "$model/types";
import {resolveLink, toBoolean} from "$lib/util-shared";
import {allLinks} from "$model/links";
import {RESOLVE_LINKS} from "$env/static/private";

const resolveParallel = true
const resolveLinks = async (links: LinkItem[]): Promise<Map<string, string>> => {
    const linkMap = new Map<string, string>()
    if (!toBoolean(RESOLVE_LINKS)) {
        console.log("Not resolving links")
        return linkMap
    }
    console.log("Resolving links...")
    console.log("Parallel:", resolveParallel)
    const promises: Promise<string>[] = []
    for (const link of links) {
        if (!link.target.startsWith("http")) continue

        const resolved = resolveLink(link.target).then(resolved =>
            linkMap.set(link.target, resolved)
        )
        promises.push(resolved)
        if (!resolveParallel) await resolved
    }

    await Promise.all(promises)
    return linkMap
}

let linkMap: Map<string, string>|undefined = undefined

export async function load() {
    if (!linkMap) {
        linkMap = await resolveLinks(allLinks)
    }

    return <Metadata|LinkData>{
        linkMap: linkMap
    }
}