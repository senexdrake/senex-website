import type {AssetPath} from "$app/types"
import {asset} from "$app/paths";
import {galleryAssetBaseUrl} from "#config";

const stripLeadingSlash = (path: string) => path.replace(/^\/+/, "")

/**
 * Resolve the URL of an asset in your static directory. A leading "/" will be removed if present,
 * since SvelteKit 3 asset paths are relative to the static directory.
 * @param path
 * @see asset
 */
export const assetPath = (path: string) => asset(stripLeadingSlash(path) as AssetPath)

export const galleryAssetPath = (path: string) => asset(stripLeadingSlash(galleryAssetBaseUrl + path) as AssetPath)