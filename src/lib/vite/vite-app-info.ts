import type {Plugin} from "vite";
import {writeFile} from "fs/promises";
import {dataDir, appInfoFile} from "../../config"
import {ensurePathExists} from "../util";
import {exec as origExec} from "child_process"
import {promisify} from "util";

const exec = promisify(origExec)

const tryGitExecutableForVersion = true

export interface AppInfo {
    version: string
}

export function appInfo() : Plugin {
    return {
        enforce: 'post',
        name: 'app-info',
        async buildStart() {
            let version = process.env.VERSION_HASH ?? process.env.CF_PAGES_COMMIT_SHA
            if (!version && tryGitExecutableForVersion) {
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