import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import {staticImageHandler} from "./src/lib/vite/vite-static-image-handler";

export default defineConfig({
	plugins: [
		staticImageHandler(),
		sveltekit()
	]
});
