import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from "vite-imagetools";
import { assetDownloader } from "./src/lib/vite/vite-asset-downloader";

export default defineConfig({
	plugins: [
		sveltekit(),
		assetDownloader(),
		imagetools({
			defaultDirectives: url => {
				if (url.searchParams.has('gallery')) {
					return new URLSearchParams('w=1200;2400&h=1200;2400&withoutEnlargement&fit=inside&format=webp&quality=50&as=meta')
				}
				if (url.searchParams.has('fullsize')) {
					return new URLSearchParams('w=4000&withoutEnlargement&format=webp&quality=90&as=meta')
				}
				return new URLSearchParams()
			}
		}),
	]
});
