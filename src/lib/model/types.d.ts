import type {LinkType} from "$model/LinkType";

export interface LinkItem {
    target: string,
    name: string,
    order: number
    icon?: string,
    linkType?: LinkType
}

export interface ImageAuthor {
    name: string,
    url: string
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
    galleryImages: ImageExport[]
}

export interface ImageSrc {
    src: string,
    width: number,
    height: number,
    format: string
}

export interface ImageExport {
    id: number,
    name: string,
    title: string,
    description: string,
    author: Author
    nsfw: boolean,
    categories?: string[]
    src: ImageSrc[],
    original: ImageSrc
}

export interface IconExport {
    name: string,
    width: number,
    height: number,
    format: string
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