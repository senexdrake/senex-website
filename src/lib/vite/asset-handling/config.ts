import {addTrailingSlash} from "./util";
import type {ProcessingRule} from "./types";

export const debug = false
export const defaultImageType = 'webp'
export const fileEncoding = 'utf-8'

export const assetsServer = (process.env.ASSETS_SERVER ?? "https://pics.zdrake.net")
export const assetsServerPath = addTrailingSlash(process.env.ASSETS_SERVER_PATH ?? assetsServer)

export const imageFetchChunkSize = 20

export const defaultCategory = 'images'

const defaultEnlargementRule: 'allow'|'deny' = "deny"

const defaultRules: ProcessingRule[] = [
    //{ maxDimension: 600, quality: 65, format: defaultImageType },
    { maxDimension: 900, quality: 75, format: defaultImageType },
    { maxDimension: 1200, quality: 75, format: defaultImageType },
    { maxDimension: 2400, quality: 75, format: defaultImageType },
    { maxDimension: 3000, quality: 90, format: defaultImageType }
]
export const processingRules = defaultRules.map(rule => {
    if (rule.withoutEnlargement === undefined) {
        rule.withoutEnlargement = defaultEnlargementRule === 'deny'
    }
    return rule
})

export const originalMaxDimension = 4000
export const originalTransformQuality = 95

export const metaMaxHeight = 1000
export const metaMaxWidth = Math.round(metaMaxHeight * 1.91)

export const defaultFaviconSize = 192
export const defaultFaviconFormat = 'png'