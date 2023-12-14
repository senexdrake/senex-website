<script lang="ts">
	import '$styles/styles.scss';
	import Header from './Header.svelte';
	import MetaData from "./MetaData.svelte";
	import {page} from "$app/stores";
	import {appVersion} from "$lib/app-info"
	import {repoUrl, linkToRepo} from "$/config"

	$: maxWidth = $page.data.width ?? '50rem'
	const currentYear = new Date().getFullYear()

	const maxVersionLength = 8

	let appVersionTrimmed = appVersion.substring(0, maxVersionLength)

	let versionLink = repoUrl + "/tree/" + appVersion

</script>

<div class="app">
	<MetaData />
	<Header />

	<main style="--width: {maxWidth}" id="main">
		<slot />
	</main>

	<footer>
		<div class="text-center">
			© {currentYear.toString()} Senex / ArisenDrake,
			Version
			{#if linkToRepo}
				<a href={versionLink}>{appVersionTrimmed}</a>
			{:else}
				{appVersionTrimmed}
			{/if}
			- made with ♥ and <a href="https://kit.svelte.dev/">SvelteKit</a>!
		</div>
	</footer>
</div>

<style lang="scss">
	@use "$styles/variables" as *;
	@use "$styles/mixins";

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		padding: 0 1rem;
	}

	main {
		max-width: var(--width);
		display: flex;
		flex-direction: column;
		width: 100%;
		margin: 1.5rem auto 0;
		justify-content: center;
		align-items: center;
		box-sizing: border-box;
		box-shadow: 0 0 25px 2px #000;
		border-radius: $main-border-radius;
		background-color: var(--color-bg-card);

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
		padding: 12px;
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

	@include mixins.breakpoint('xs') {
		footer {
			padding: 12px 0;
		}
	}
</style>
