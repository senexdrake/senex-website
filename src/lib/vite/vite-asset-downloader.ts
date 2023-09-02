import type {Plugin, ResolvedConfig} from "vite";
import axios from "axios";
import {stat, access, mkdir} from "fs/promises";
import {createWriteStream, statSync, accessSync, WriteStream} from "fs";
import {remoteAssetsDir} from "../../config"

export function assetDownloader() : Plugin {

    const resolvingAssets = new Map<string, Promise<void>>()

    let viteConfig: ResolvedConfig
    let basePath: string
    let baseUrl: string

    const addTrailingSlash = (input: string) => input + (input.endsWith('/') ? '' : '/')

    return {
        name: 'asset-downloader',
        enforce: 'pre',
        async configResolved(cfg) {
            viteConfig = cfg
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            basePath = addTrailingSlash(remoteAssetsDir)


            try {
                await access(basePath)
            } catch (e: any) {
                await mkdir(basePath)
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            baseUrl = addTrailingSlash(process.env.REMOTE_ASSETS_BASE_URL ?? "https://pics.arisendrake.de")
        },
        load(id) {
            if (id.indexOf('&remote') === -1) return
            const assetName = id.substring(id.lastIndexOf('/') + 1, id.indexOf('?'))
            if (resolvingAssets.has(assetName)) return resolvingAssets.get(assetName)
            const promise = new Promise<void>((resolve, reject) => {
                const assetTargetPath = basePath + assetName
                try {
                    accessSync(assetTargetPath)
                    const fileStats = statSync(assetTargetPath)
                    if (fileStats.size > 100) {
                        console.debug(`File "${assetTargetPath}" exists and is not empty, skipping fetch`)
                        return resolve()
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
                            resolve();
                        }
                        //no need to call the reject here, as it will have been called in the
                        //'error' stream;
                    })
                })
            })
            resolvingAssets.set(assetName, promise)
            return promise
        }
    }
}