export interface AssetHandlingConfig {
    assetOutputDir: string,
    metaOutputDir: string,
    remoteAssetsBaseUrl: string,
    faviconDir?: string,
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
    quality: number
}
export interface IconsRaw {
    source: string,
    variants: IconVariant[],
    quality: number
}

export interface ImageRaw {
    id: number,
    name: string,
    title: string,
    description: string,
    author: string,
    nsfw: boolean,
    src?: string,
    format?: string,
    categories?: string[],
    ignoreAuthorName?: boolean
}