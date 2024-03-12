import {
    AvifOptions,
    GifOptions,
    HeifOptions, Jp2Options,
    JpegOptions,
    JxlOptions,
    OutputOptions,
    PngOptions, TiffOptions,
    WebpOptions
} from "sharp";
import {ImageAuthor} from "../../model/types";

export interface AssetHandlingConfig {
    imageOutputPrefix: string,
    metaOutputDir: string,
    assetOutputPrefix: string
    assetsServer: string,
    faviconDir?: string,
    templateFolder?: string,
    targetDir: string
}

export interface ProcessingRule {
    maxDimension: number,
    quality: number,
    format: keyof FormatEnum | AvailableFormatInfo,
    withoutEnlargement?: boolean
}

export interface IconVariant {
    size: number,
    format: (keyof FormatEnum | AvailableFormatInfo)|(keyof FormatEnum | AvailableFormatInfo)[],
    name?: string
    quality?: number,
    background?: string
}

export interface IconsRaw {
    defaultSource: string,
    source: string,
    variants: IconVariant[],
    quality: number
}

export interface ProfileBanner {
    src: string,
    author: ImageAuthor
}

export interface ImageRaw {
    id: number,
    name: string,
    title: string,
    description: string,
    author: string,
    nsfw: boolean,
    skip?: boolean,
    noResize?: boolean
    src?: string,
    format?: string,
    categories?: string[],
    related?: number[]
    ignoreAuthorName?: boolean
}

export interface CategoryRaw {
    name: string,
    displayName: string,
    description: string,
    show?: boolean,
    nsfw?: boolean
}

export interface FetchedAuthor {
    id: number
    name: string
    url: string
}

export interface FetchedCategory {
    id: number
    name: string
    displayName: string
    description: string
    show?: boolean
    nsfw?: boolean
}

export interface FetchedIcon {
    height: number
    width: number
    format: webp
    fileName: string
    type: string
    defaultIcon: boolean
}

export interface FetchedImage {
    id: number
    name: string
    title: string
    description: string
    nsfw: boolean
    format: string
    noResize: boolean
    ignoreAuthorName: string
    authorId: number
    sortIndex?: number
    categories?: number[]
    variants?: FetchedImageVariant[]
    related?: number[]
}

export interface FetchedImageVariant {
    height: number,
    width: number,
    format: string,
    fileName: string,
    quality: string,
    name: string,
    suffix?: string,
    original?: boolean,
    imageId: number
}

export interface LinkDefinition {
    name: string,
    target: string
}

type FormatOptions = OutputOptions
    | JpegOptions
    | PngOptions
    | WebpOptions
    | AvifOptions
    | HeifOptions
    | JxlOptions
    | GifOptions
    | Jp2Options
    | TiffOptions