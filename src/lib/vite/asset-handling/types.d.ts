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

export interface ImageMeta {
    file: string
    author: ImageAuthor
}

export interface FetchedMeta {
    profileBanner: ImageMeta
    favicon: ImageMeta & { icoFile: string }
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