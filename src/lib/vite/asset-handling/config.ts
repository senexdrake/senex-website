export const debug = false
export const defaultImageType = 'webp'
export const fileEncoding = 'utf-8'

export const assetsServer = (process.env.ASSETS_SERVER ?? "https://pics.zdrake.net")
export const assetsServerPath = (process.env.ASSETS_SERVER_PATH ?? addTrailingSlash(assetsServer) + "export") + '/'

export const imageFetchChunkSize = 10

export const metaMaxHeight = 1000
export const defaultCategory = 'images'