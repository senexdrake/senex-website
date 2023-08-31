import type {LinkType} from "$model/LinkType";

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

export interface Metadata {
    title?: string,
    description?: string,
    creator?: string,
    image?: MetadataImage,
    images?: MetadataImage[],
    cardType?: string
}

export interface MetadataImage {
    url: string,
    width: number,
    height: number,
    type: string,
    alt: string
}