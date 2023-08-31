<script lang="ts">
	import '@styles/styles.scss';
	import Header from './Header.svelte';
	import MetaData from "./MetaData.svelte";

	const currentYear = new Date().getFullYear()
</script>

<div class="app">
	<MetaData />
	<Header />

	<main>
		<slot />
	</main>

	<footer>
		<div class="text-center">
			© {currentYear.toString()} Senex / ArisenDrake -
			made with ♥ and <a href="https://kit.svelte.dev/">SvelteKit</a>!
		</div>
	</footer>
</div>

<style lang="scss">
	@import "@styles/breakpoints";
	@import "@styles/darkmode";

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		padding: 0 1rem;
	}

	main {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 50rem;
		margin: 1.5rem auto 0;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		box-sizing: border-box;
		box-shadow: 0 0 25px 2px #000;
		border-radius: 20px;

		background-color: var(--color-bg-card);
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

		@include whenDark() {
			--footer-text-color: #9d9d9d;
		}
	}

	@include breakpoint('xs') {
		footer {
			padding: 12px 0;
		}
	}
</style>
