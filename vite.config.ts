import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import {imagetools} from "vite-imagetools";
import {assetDownloader} from "./src/lib/vite/vite-asset-downloader";

export default defineConfig({
	plugins: [
		sveltekit(),
		assetDownloader(),
		imagetools({
			defaultDirectives: url => {
				if (url.searchParams.has('gallery')) {
					return new URLSearchParams('w=1200;2400&format=webp&as=srcset')
				}
				return new URLSearchParams()
			}
		}),
	]
});
