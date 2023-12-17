import {exec as origExec} from "child_process"
import {promisify} from "util";
const exec = promisify(origExec)

export async function appVersion(versionEnvironmentName, tryGit) {
    if (tryGit === undefined) tryGit = true
    let version = process.env[versionEnvironmentName]
    if (!version && tryGit) {
        const gitCommand = "git rev-parse HEAD"
        await exec(gitCommand).then(res => {
            version = res.stdout.trim()
        })
    }

    return version ?? "unknown"
}