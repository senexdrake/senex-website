import type {Plugin} from "vite";
import {writeFile} from "fs/promises";
import {dataDir, appInfoFile} from "../../config"
import {ensurePathExists} from "../util";
import {exec as origExec} from "child_process"
import {promisify} from "util";

const exec = promisify(origExec)

export interface AppInfo {
    version: string
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
            let version = process.env[config.versionEnvironmentName]
            if (!version && config.tryGit) {
                const gitCommand = "git rev-parse HEAD"
                await exec(gitCommand).then(res => {
                    version = res.stdout.trim()
                })
            }

            if (!version) version = "unknown"

            await ensurePathExists(dataDir)
            await writeFile(appInfoFile, JSON.stringify(<AppInfo>{
                version: version
            }))
        }
    }
}