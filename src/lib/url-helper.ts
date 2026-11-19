import type { AssetPath } from "$app/types";
import { asset } from "$app/paths";
import { galleryAssetBaseUrl } from "$/config";

/**
 * Resolve the URL of an asset in your static directory. A "/" will be prefixed if necessary.
 * @param path
 * @see asset
 */
export const assetPath = (path: AssetPath) => {
    if (!path.startsWith("/")) path = "/" + path;

    return asset(path);
};

export const galleryAssetPath = (path: string) => asset(galleryAssetBaseUrl + path);
