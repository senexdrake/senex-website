import type {Plugin, ResolvedConfig} from "vite";
import axios from "axios";
import {stat, access, mkdir} from "fs/promises";
import {createWriteStream, statSync, accessSync, WriteStream} from "fs";
import {remoteAssetsDir} from "../../config"

const addTrailingSlash = (input: string) => input + (input.endsWith('/') ? '' : '/')
const basePath = addTrailingSlash(remoteAssetsDir)
const baseUrl = addTrailingSlash(process.env.REMOTE_ASSETS_BASE_URL ?? "https://pics.arisendrake.de")

export async function ensureRemoteAssetsPathExists() : Promise<void> {
    try {
        await access(basePath)
    } catch (e: any) {
        await mkdir(basePath)
    }
}
export function downloadAsset(assetName: string) : Promise<string> {
    return new Promise((resolve, reject) => {
        const assetTargetPath = basePath + assetName
        try {
            accessSync(assetTargetPath)
            const fileStats = statSync(assetTargetPath)
            if (fileStats.size > 100) {
                console.debug(`File "${assetTargetPath}" exists and is not empty, skipping fetch`)
                return resolve(assetTargetPath)
            }
        } catch (e) {
            // Target does not exist
        }

        const writer: WriteStream = createWriteStream(assetTargetPath)
        const url = baseUrl + assetName

        console.log(`Trying to resolve asset "${assetTargetPath}" from "${url}"`)

        axios({
            method: 'GET',
            url: url,
            responseType: 'stream'
        }).then(response => {
            response.data.pipe(writer);
            let error: any = null;
            writer.on('error', err => {
                error = err;
                writer.close();
                reject(err);
            });
            writer.on('close', () => {
                if (!error) {
                    resolve(assetTargetPath);
                }
                //no need to call the reject here, as it will have been called in the
                //'error' stream;
            })
        })
    })
}

export function assetDownloader() : Plugin {

    const acceptedParams = [
        '&remote',
        '?remote',
        '&gallery',
        '?gallery',
        '&fullsize',
        '?fullsize'
    ]

    const resolvingAssets = new Map<string, Promise<void>>()

    return {
        name: 'asset-downloader',
        enforce: 'pre',
        async configResolved(cfg) {
            await ensureRemoteAssetsPathExists()
        },
        load(id) {
            if (!acceptedParams.some(param => id.indexOf(param) !== -1)) return
            const assetName = id.substring(id.lastIndexOf('/') + 1, id.indexOf('?'))
            if (resolvingAssets.has(assetName)) return resolvingAssets.get(assetName)
            const promise = new Promise<void>((resolve, reject) => {
                downloadAsset(assetName).then(() => resolve()).catch(() => reject())
            })
            resolvingAssets.set(assetName, promise)
            return promise
        }
    }
}