import type {LinkType} from "$lib/model/LinkType";

export interface LinkItem {
    target: string,
    name: string,
    order: number
    icon?: string,
    linkType?: LinkType
}

export interface Image {
    src: string,
    title: string,
    description: string
}

export interface ImageCategory {
    title: string,
    description: string,
    images: Image[]
}