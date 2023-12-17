import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import {staticImageHandler} from "./src/lib/vite/vite-static-image-handler";
import {webmanifest} from "./src/lib/vite/vite-webmanifest";
import {appInfo} from "./src/lib/vite/vite-app-info";
import {versionEnvironmentName} from "./src/config"

export default defineConfig({
	plugins: [
		staticImageHandler(),
		appInfo({
			versionEnvironmentName: versionEnvironmentName
		}),
		sveltekit(),
		webmanifest(),
	]
});
