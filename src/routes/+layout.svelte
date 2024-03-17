<script lang="ts">
	import '$styles/styles.scss';
	import Header from './Header.svelte';
	import MetaData from "./MetaData.svelte";
	import {page} from "$app/stores";
	import {base} from "$app/paths";
	import {appVersion} from "$lib/app-info"
	import {repoUrl, linkToRepo} from "$/config"

	$: width = $page.data.width ?? '100%'
	$: maxWidth = $page.data.maxWidth ?? '50rem'
	const startYear = 2023
	const currentYear = new Date().getFullYear()

	const maxVersionLength = 8

	let appVersionTrimmed = appVersion.substring(0, maxVersionLength)

	let versionLink = repoUrl + "/tree/" + appVersion

</script>

<div class="app">
	<MetaData />
	<Header />

	<main style="--width: {width}; --max-width: {maxWidth}" id="main">
		<slot />
	</main>

	<footer>
		<div class="text-center">
			© {startYear}-{currentYear} ZenDrake,
			Version
			{#if linkToRepo}
				<a href={versionLink}>{appVersionTrimmed}</a>
			{:else}
				{appVersionTrimmed}
			{/if}
			- made with ♥ and <a href="https://kit.svelte.dev/">SvelteKit</a>!
		</div>
		<div id="legal-footer" class="text-center">
			<a class="font-weight-bold" href="{base}/legal">Legal stuff</a>
		</div>
	</footer>
</div>

<style lang="scss">
	@use "$styles/variables" as *;
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
		@include mixins.breakpoint($big-links-breakpoint) {
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
		border-radius: $main-border-radius;
		background-color: var(--color-bg-card);
		backdrop-filter: blur(10px);


		padding: 1rem 1rem;
		@include mixins.breakpoint($big-links-breakpoint) {
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
