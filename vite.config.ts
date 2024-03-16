import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite';
import {webmanifest} from "./src/lib/vite/vite-webmanifest";
import {appInfo} from "./src/lib/vite/vite-app-info";
import {versionEnvironmentName} from "./src/config"
import {assetHandler} from "./src/lib/vite/vite-external-asset-handler";
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
		webmanifest(),
		Icons({
			compiler: 'svelte',
			customCollections: {
				local: FileSystemIconLoader(
					'./src/lib/assets/icons',
					svg => svg.replace(/^<svg /, '<svg fill="currentColor" '),
				)
			}
		})
	]
});
