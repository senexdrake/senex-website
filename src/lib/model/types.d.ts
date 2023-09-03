import type {LinkType} from "$model/LinkType";

export interface LinkItem {
    target: string,
    name: string,
    order: number
    icon?: string,
    linkType?: LinkType
}

export interface Image {
    src: ImageOutputMetadata[],
    title: string,
    description: string,
    nsfw?: boolean,
    author?: ImageAuthor
}

export interface ImageAuthor {
    name: string,
    url: string
}

export interface ImageCategory {
    title: string,
    description: string,
    images: Image[]
}


export interface ImageCategories {
    categories: ImageCategory[]
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

export interface Images {
    images: Image[]
}

export interface ImageOutputMetadata {
    src: string // URL of the generated image
    width: number // Width of the image
    height: number // Height of the image
    format: string // Format of the generated image

    // The following options are the same as sharps input options
    space: string // Name of colour space interpretation
    channels: number // Number of bands e.g. 3 for sRGB, 4 for CMYK
    density: number //  Number of pixels per inch
    depth: string // Name of pixel depth format
    hasAlpha: boolean // presence of an alpha transparency channel
    hasProfile: boolean // presence of an embedded ICC profile
    isProgressive: boolean // indicating whether the image is interlaced using a progressive scan
}