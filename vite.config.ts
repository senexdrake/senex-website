import { fileURLToPath, URL } from "url";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: [
			{ find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
			{ find: '@styles', replacement: fileURLToPath(new URL('./src/styles', import.meta.url)) },
			{ find: '@img', replacement: fileURLToPath(new URL('./src/lib/images', import.meta.url)) }
		]
	}
});
