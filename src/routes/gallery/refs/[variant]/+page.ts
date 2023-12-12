import type {
    Metadata,
    PageLoadData,
    RefPageMetadata
} from "$lib/model/types"

export const csr = true

export function load(data: PageLoadData) : Metadata|RefPageMetadata {
    const nsfw = data.params["variant"] == "nsfw"

    let title = "Reference Page"
    if (nsfw) title += " (NSFW)"

    let description = "References for my fursona Senex"
    if (nsfw) description += " - NSFW Warning!"

    return {
        nsfw: nsfw,
        title: `Senex's Gallery - ${title}`,
        description: description,
        width: "100%"
    }
}

export function entries() {
    return [
        { variant: "sfw" },
        { variant: "nsfw" }
    ]
}