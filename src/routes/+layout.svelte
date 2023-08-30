<script lang="ts">
	import Header from './Header.svelte';
	import '../styles/styles.scss';

	const currentYear = new Date().getFullYear()
	const mastodonLink = "https://meow.social/@senex"
</script>

<svelte:head>
	<link rel="me" href="{mastodonLink}">
</svelte:head>

<div class="app">

	<Header />

	<main>
		<slot />
	</main>

	<footer>
		© {currentYear.toString()} Senex / ArisenDrake
	</footer>
</div>

<style lang="scss">
	@import "@styles/breakpoints";

	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
	}

	main {
		display: flex;
		flex-direction: column;
		width: 100%;
		max-width: 50rem;
		margin: 0 auto;
		justify-content: center;
		align-items: center;
		padding: 2rem;
		box-sizing: border-box;
	}

	footer {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		padding: 12px;
	}

	@include breakpoint('xs') {
		footer {
			padding: 12px 0;
		}
	}
</style>
