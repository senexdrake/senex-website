import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import {webmanifest} from "./src/lib/vite/vite-webmanifest";
import {appInfo} from "./src/lib/vite/vite-app-info";
import {versionEnvironmentName} from "./src/config"
import {assetHandler} from "./src/lib/vite/vite-external-asset-handler";

export default defineConfig({
	plugins: [
		assetHandler(),
		appInfo({
			versionEnvironmentName: versionEnvironmentName
		}),
		sveltekit(),
		webmanifest(),
	]
});
