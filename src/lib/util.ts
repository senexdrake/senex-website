import type {PathLike} from "fs";
import AsyncIterator = NodeJS.AsyncIterator;
import {access, mkdir, rm} from "fs/promises";
import {appVersion as appVersionImpl} from "../../helpers"
import {Chalk} from "chalk";

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

export async function appVersion(versionEnvironmentName: string, tryGit: boolean = true): Promise<string|undefined> {
    return appVersionImpl(versionEnvironmentName, tryGit)
}

export function formatBytes(bytes: number, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export const chalk = new Chalk({
    level: 2
})

type AsyncIterMapFunction<T, R> = (item: T) => R
export async function mapAsyncIter<T, R>(asyncIter: AsyncIterator<T>, func: AsyncIterMapFunction<T, R>): Promise<R[]> {
    const promises: Promise<T>[] = []
    for await (const value of asyncIter) {
        promises.push(func(value))
    }
    return promises
}