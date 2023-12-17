import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import {dataDir, remoteAssetsRelative, versionEnvironmentName} from "./src/config.js";
import {appVersion} from "./helpers.js";

const dev = true

const version = await appVersion(versionEnvironmentName)
const timestampedVersion = `${version}-${Date.now()}`

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://kit.svelte.dev/docs/integrations#preprocessors
	// for more information about preprocessors
	preprocess: vitePreprocess(),
	kit: {
		version: {
			name: timestampedVersion
		},
		paths: {
			relative: false
		},
		adapter: adapter({
			pages: 'dist',
			assets: 'dist',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		alias: {
			$: "src/",
			$model: "src/lib/model",
			$icons: "src/lib/icons",
			$styles: "src/lib/styles",
			$img: "src/lib/images",
			$data: dataDir,
			$remoteAssets: remoteAssetsRelative
		}
	}
};

export default config;
