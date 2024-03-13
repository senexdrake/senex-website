import type {LinkType} from "$model/LinkType";

export interface LinkItem {
    target: string,
    name: string,
    order: number
    icon?: string,
    linkType?: LinkType,
    fullWidth?: boolean
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
    cardType?: string,
    width?: string,
    maxWidth?: string
}

export interface GalleryMetadata {
    category: string,
    nsfw: boolean
}

export interface ImagePageMetadata {
    galleryImage: ImageExport
}

export interface RefPageMetadata {
    nsfw: boolean
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

export interface ProfileBannerExport {
    author: ImageAuthor,
    src: ImageSrc[],
    original: ImageSrc,
    metadataSrc: ImageSrc
}

export interface ImageExport {
    id: number,
    name: string,
    nameUnique: string,
    title: string,
    description: string,
    descriptionPlain: string,
    author: ImageAuthor
    nsfw: boolean,
    categories: string[]
    src: ImageSrc[],
    original: ImageSrc,
    related?: number[],
    metadataSrc: ImageSrc
}

export interface ImageCategory {
    name: string,
    displayName: string,
    description: string,
    show: boolean,
    nsfw: boolean
}

export interface IconExport {
    type: string,
    name: string,
    width: number,
    height: number,
    format: string
}

export interface IconMeta {
    author: ImageAuthor,
    icons: IconExport[]
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

export interface PageLoadData {
    params: [string, string]
}