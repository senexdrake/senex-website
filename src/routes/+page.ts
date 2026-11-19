import type {LinkData, Metadata} from "#lib/model/types.d.ts"
import {allLinksCopy} from "#lib/model/links.ts";


export async function load({ data }) {
    const linkMap = data.linkMap ?? new Map<string, string>()
    const links = allLinksCopy().map(link => {
        const resolvedLink = linkMap.get(link.target)
        if (resolvedLink) link.target = resolvedLink
        return link
    })

    return <Metadata|LinkData>{
        links: links
    }
}