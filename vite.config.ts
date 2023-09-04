import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { imagetools } from "vite-imagetools";
import { assetDownloader } from "./src/lib/vite/vite-asset-downloader";
import {staticImageHandler} from "./src/lib/vite/vite-static-image-handler";

export default defineConfig({
	plugins: [
		sveltekit(),
		assetDownloader(),
		staticImageHandler(),
		imagetools({
			defaultDirectives: url => {
				if (url.searchParams.has('gallery')) {
					return new URLSearchParams('w=1200;2400&h=1200;2400&withoutEnlargement&fit=inside&format=webp&quality=50&as=meta')
				}
				if (url.searchParams.has('galleryWidth')) {
					return new URLSearchParams('w=1200;2400&withoutEnlargement&fit=inside&format=webp&quality=50&as=meta')
				}
				if (url.searchParams.has('galleryHeight')) {
					return new URLSearchParams('h=1200;2400&withoutEnlargement&fit=inside&format=webp&quality=50&as=meta')
				}
				if (url.searchParams.has('large')) {
					return new URLSearchParams('w=4000&h=4000&withoutEnlargement&fit=inside&format=webp&quality=90&as=meta')
				}
				return new URLSearchParams()
			}
		})
	]
});
