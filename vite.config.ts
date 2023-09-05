import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from "vite-imagetools";
import { assetDownloader } from "./src/lib/vite/vite-asset-downloader";
import {staticImageHandler} from "./src/lib/vite/vite-static-image-handler";

export default defineConfig({
	plugins: [
		staticImageHandler(),
		sveltekit()
	]
});
