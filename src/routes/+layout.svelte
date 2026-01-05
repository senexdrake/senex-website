<script lang="ts">
	import '$styles/styles.scss'
	import Header from './Header.svelte'
	import MetaData from "./MetaData.svelte"
	import type {Snippet} from "svelte";
	import {page} from "$app/state"
	import {resolve} from "$app/paths"
	import {appVersion, buildDate} from "$lib/app-info"
	import {repoUrl, linkToRepo, showBuildDate} from "$/config"
	import CardFooter from "$/routes/CardFooter.svelte";

	let { children }: {
		children?: Snippet
	} = $props();

	let width: string = $derived(page.data.width ?? '100%')
	let maxWidth: string = $derived(page.data.maxWidth ?? '50rem')
	let cardFooterMeme: boolean = $derived(page.data.enableCardFooterMeme ?? true)

	const startYear = 2023
	const currentYear = new Date().getFullYear()

	const maxVersionLength = 8
	const versionString = appVersion.substring(0, maxVersionLength)
	const versionLink = repoUrl + "/tree/" + appVersion
</script>

<div class="app">
	<MetaData />
	<Header />

	<main style="--width: {width}; --max-width: {maxWidth}" id="main">
		{@render children?.()}
		{#if cardFooterMeme}
			<CardFooter />
		{/if}
	</main>

	<footer>
		<div class="text-center">
			© {startYear}-{currentYear} ZenDrake, Version
			{#if linkToRepo}
				<a href={linkToRepo ? versionLink : '#'} rel="external">{versionString}</a>
			{:else}
				{versionString}
			{/if}
			{#if showBuildDate && buildDate}
				<br>(built at: {buildDate?.toISOString()})
			{/if}
			<br>
			- made with ♥ and <a href="https://kit.svelte.dev/" rel="external">SvelteKit</a>! -
		</div>
		<div id="legal-footer" class="text-center">
			<a class="font-weight-bold" href={resolve("/legal")} rel="help privacy-policy">Legal stuff</a>
		</div>
	</footer>
</div>

<style lang="scss">
	@use "$styles/variables" as vars;
	@use "$styles/mixins";

	#legal-footer {
		margin-top: .2rem;
		text-decoration: underline;
	}

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		padding: .5rem;
		@include mixins.breakpoint(vars.$big-links-breakpoint) {
			padding: 1rem;
		}
	}

	main {
		--width: 100%;
		--max-width: 100%;
		max-width: var(--max-width);
		display: flex;
		flex-direction: column;
		width: var(--width);
		margin: 0 auto;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		box-shadow: 0 0 25px 2px #000;
		border-radius: vars.$main-border-radius;
		background-color: var(--color-bg-card);
		backdrop-filter: blur(10px);


		padding: 1rem 1rem;
		@include mixins.breakpoint(vars.$big-links-breakpoint) {
			padding: 2rem 2rem;
		}
	}

	footer {
		--footer-text-color: #e8e8e8;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding-top: 12px;
		color: var(--footer-text-color);

		a {
			display: inline;
			text-decoration: none;
			color: var(--footer-text-color);
		}

		@include mixins.whenDark() {
			--footer-text-color: #9d9d9d;
		}
	}
</style>
