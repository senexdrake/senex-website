import type {ProcessingRule} from "./types";

export const defaultImageType = 'webp'
export const fileEncoding = 'utf-8'

export const remoteAssetBaseUrl = (process.env.REMOTE_ASSETS_BASE_URL ?? "https://pics.arisendrake.de") + '/'

export const allowEnlargementFor: string[] = []
const defaultEnlargementRule: 'allow'|'deny' = "deny"

const defaultRules: ProcessingRule[] = [
    { maxDimension: 600, quality: 65, format: defaultImageType },
    { maxDimension: 900, quality: 65, format: defaultImageType },
    { maxDimension: 1200, quality: 65, format: defaultImageType },
    { maxDimension: 2400, quality: 65, format: defaultImageType },
    { maxDimension: 4000, quality: 90, format: defaultImageType }
]
export const processingRules = defaultRules.map(rule => {
    if (rule.withoutEnlargement === undefined) {
        rule.withoutEnlargement = defaultEnlargementRule === 'deny'
    }
    return rule
})

export const originalTransformQuality = 95

export const defaultFaviconSize = 192
export const defaultFaviconFormat = 'png'
export const defaultCategory = 'images'