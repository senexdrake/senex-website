import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import {staticImageHandler} from "./src/lib/vite/vite-static-image-handler";
import {webmanifest} from "./src/lib/vite/vite-webmanifest";

export default defineConfig({
	plugins: [
		staticImageHandler(),
		sveltekit(),
		webmanifest(),
	]
});
