import type {LinkData, Metadata} from "$model/types"
import {allLinksCopy} from "$model/links";


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