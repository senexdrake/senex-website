import type {PathLike} from "fs";
import {access, mkdir, rm} from "fs/promises";
import {appVersion as appVersionImpl} from "../../helpers"

export { addTrailingSlash } from "./util-shared"

export async function ensurePathExists(path: PathLike, recursive = true) {
    if (!await pathExists(path)) await mkdir(path, { recursive: recursive })
}

export async function pathExists(path: PathLike) : Promise<boolean> {
    try {
        await access(path)
        return true
    } catch (err: any) {
        if (err.code === 'ENOENT') return false
        throw err
    }
}

export async function clearPath(path: PathLike) {
    if (await pathExists(path)) {
        await rm(path, { recursive: true })
    }
    await ensurePathExists(path)
}

export async function appVersion(versionEnvironmentName: string, tryGit: boolean = true) {
    return appVersionImpl(versionEnvironmentName, tryGit)
}