import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { appVersion } from "./helpers.js";
import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite'
import { defineConfig } from 'vite';
import {siteMeta} from "./src/lib/vite/vite-site-meta.ts";
import {appInfo} from "./src/lib/vite/vite-app-info.ts";
import {versionEnvironmentName, libIconDir} from "./src/config.js"
import {assetHandler} from "./src/lib/vite/vite-external-asset-handler.ts";
import {FileSystemIconLoader} from "unplugin-icons/loaders";

const version = await appVersion(versionEnvironmentName);
const timestampedVersion = `${version}-${Date.now()}`;

export default defineConfig({
	build: {
		// Inline all assets up to 5 KiB
		assetsInlineLimit: 5 * 1024,
	},
	plugins: [
		assetHandler(),
		appInfo({ versionEnvironmentName }),
		sveltekit({
			// Consult https://kit.svelte.dev/docs/integrations#preprocessors
			// for more information about preprocessors
			preprocess: [vitePreprocess()],
			//inlineStyleThreshold: 50 * 1024, // 50KiB
			version: { name: timestampedVersion },
			paths: { relative: false },
			adapter: adapter({
				pages: 'dist',
				assets: 'dist',
				fallback: undefined,
				precompress: false,
				strict: true
			}),
		}),
		siteMeta(),
		Icons({
			compiler: 'svelte',
			customCollections: {
				local: FileSystemIconLoader(libIconDir, (svg) => svg.replace(/^<svg /, '<svg fill="currentColor" '))
			}
		})
	],
	css: {
		preprocessorOptions: {
			scss: {
				loadPaths: ['src/lib']
			}
		}
	}
});
