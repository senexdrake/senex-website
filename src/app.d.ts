// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces


// Seems to be kinda buggy?
//import "unplugin-icons/types/svelte"

declare module 'virtual:icons/*' {
	import type { Component } from 'svelte'
	const icon: Component
	export = icon
}

declare module '~icons/*' {
	import type { Component } from 'svelte'
	const icon: Component
	export = icon
}

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}
}

export {}