export interface AssetHandlingConfig {
    imageOutputDir: string,
    metaOutputDir: string,
    assetOutputDir: string
    remoteAssetsBaseUrl: string,
    faviconDir?: string,
    templateFolder?: string
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

export interface LinkDefinition {
    name: string,
    target: string
}