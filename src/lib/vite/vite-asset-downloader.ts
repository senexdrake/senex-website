import type {Plugin, ResolvedConfig} from "vite";
import axios from "axios";
import {stat, access, mkdir} from "fs/promises";
import {createWriteStream, statSync, accessSync} from "fs";

export function assetDownloader() : Plugin {

    const resolvingAssets = new Map<string, Promise<void>>()

    let viteConfig: ResolvedConfig
    let basePath: string

    return {
        name: 'asset-downloader',
        enforce: 'pre',
        async configResolved(cfg) {
            viteConfig = cfg
            basePath = "src/lib/remote-assets"
            try {
                await access(basePath)
            } catch (e: any) {
                await mkdir(basePath)
            }
        },
        load(id) {
            if (id.indexOf('&remote') === -1) return
            const assetName = id.substring(id.lastIndexOf('/'), id.indexOf('?'))
            if (resolvingAssets.has(assetName)) return resolvingAssets.get(assetName)
            const promise = new Promise<void>((resolve, reject) => {
                const assetTargetPath = basePath + assetName
                try {
                    accessSync(assetTargetPath)
                    const fileStats = statSync(assetTargetPath)
                    if (fileStats.size > 100) {
                        console.debug("File exists and is not empty, skipping fetch")
                        return resolve()
                    }
                } catch (e) {
                    // Target does not exist
                }

                const baseUrl = viteConfig.env.PUBLIC_ASSETS_BASE_URL ?? "https://pics.arisendrake.de"

                const writer = createWriteStream(assetTargetPath)
                const url = baseUrl + assetName

                console.log("Trying to resolve asset from", url)

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