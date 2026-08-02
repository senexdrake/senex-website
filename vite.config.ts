import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite';
import {siteMeta} from "./src/lib/vite/vite-site-meta.ts";
import {appInfo} from "./src/lib/vite/vite-app-info.ts";
import {versionEnvironmentName, libIconDir} from "./src/config.js"
import {assetHandler} from "./src/lib/vite/vite-external-asset-handler.ts";
import {FileSystemIconLoader} from "unplugin-icons/loaders";

export default defineConfig({
	build: {
		// Inline all assets up to 5 KiB
		assetsInlineLimit: 5 * 1024,
	},
	plugins: [
		assetHandler(),
		appInfo({
			versionEnvironmentName: versionEnvironmentName
		}),
		sveltekit(),
		siteMeta(),
		Icons({
			compiler: 'svelte',
			customCollections: {
				local: FileSystemIconLoader(
					libIconDir,
					svg => svg.replace(/^<svg /, '<svg fill="currentColor" '),
				)
			}
		})
	],
	css: {
		preprocessorOptions: {
			scss: {
				// TODO migrate usage of if-functions in SCSS files to new syntax
				silenceDeprecations: ["if-function"]
			}
		}
	}
});
