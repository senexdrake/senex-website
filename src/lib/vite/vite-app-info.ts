import type {Plugin} from "vite";
import {writeFile} from "fs/promises";
import {dataDir, appInfoFile} from "../../config"
import {publicUrl} from "../../../helpers"
import {appVersion, ensurePathExists} from "../util";

export interface AppInfo {
    timestamp: string,
    version: string,
    publicUrl: string
}

export interface AppInfoConfig {
    tryGit?: boolean
    versionEnvironmentName: string
}

const defaultConfig: AppInfoConfig = {
    tryGit: true,
    versionEnvironmentName: "VERSION_HASH"
}

export function appInfo(_config?: AppInfoConfig) : Plugin {
    const config: AppInfoConfig = {
        ...defaultConfig,
        ..._config
    }

    return {
        enforce: 'post',
        name: 'app-info',
        async buildStart() {
            const version = await appVersion(
                config.versionEnvironmentName,
                config.tryGit
            ) ?? "unknown"


            await ensurePathExists(dataDir)

            await writeFile(appInfoFile, JSON.stringify(<AppInfo>{
                version: version,
                publicUrl: publicUrl(),
                timestamp: new Date().toISOString()
            }))
        }
    }
}