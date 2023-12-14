import type {Plugin} from "vite";
import {writeFile} from "fs/promises";
import {dataDir, appInfoFile} from "../../config"
import {ensurePathExists} from "../util";

export interface AppInfo {
    version: string
}

export function appInfo() : Plugin {
    return {
        enforce: 'post',
        name: 'app-info',
        async buildStart() {
            const version = process.env.VERSION_HASH ?? process.env.CF_PAGES_COMMIT_SHA ?? "master"

            await ensurePathExists(dataDir)
            await writeFile(appInfoFile, JSON.stringify(<AppInfo>{
                version: version
            }))
        }
    }
}