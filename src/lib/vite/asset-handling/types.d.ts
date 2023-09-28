export interface AssetHandlingConfig {
    imageOutputPrefix: string,
    metaOutputDir: string,
    assetOutputPrefix: string
    remoteAssetsBaseUrl: string,
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
    quality: number,
    background?: string
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

export interface CategoryRaw {
    name: string,
    displayName: string,
    description: string,
    show?: boolean,
    nsfw?: boolean
}

export interface LinkDefinition {
    name: string,
    target: string
}