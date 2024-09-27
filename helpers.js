import {exec as origExec} from "child_process"
import {promisify} from "util";
const exec = promisify(origExec)

/**
 *
 * @param {string} versionEnvironmentName
 * @param {boolean} tryGit
 * @returns {Promise<string>}
 */
export async function appVersion(versionEnvironmentName, tryGit) {
    if (tryGit === undefined) tryGit = true
    let version = process.env[versionEnvironmentName]
    if (!version && tryGit) {
        const gitCommand = "git rev-parse HEAD"
        await exec(gitCommand).then(res => {
            version = res.stdout.trim()
        })
    }

    return version ?? "UNKNOWN"
}

export function publicUrl() {
    let url = process.env.PUBLIC_BASE_PATH
    if (!url) url = process.env.CF_PAGES_URL
    return url ?? "https://me.zdrake.net"
}