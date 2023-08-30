<script lang="ts">
	import '../styles/styles.scss';
	import Header from './Header.svelte';
	import {page} from "$app/stores";
	import type {Metadata, MetadataImage} from "$lib/model/types";
	import senexProfile from '$lib/images/senex-profile.webp';
	import senexProfileFallback from '$lib/images/senex-profile.png';

	$: pageData = $page.data as Metadata|undefined

	const currentYear = new Date().getFullYear()
	const mastodonLink = "https://meow.social/@senex"
	const domain = "me.senex.link"
	const basePath = `https://${domain}`
	const url = basePath + $page.url.pathname

	let title: string
	$: title = pageData?.title ?? "Senex, the big Dragon"

	let description: string
	$: description = pageData?.description ?? "An overview of ways to find and contact the big Dragon!"

	let primaryImage: MetadataImage
	$: primaryImage = pageData?.image ?? {
		url: senexProfileFallback,
		height: 600,
		width: 600,
		alt: "Senex's profile picture",
		type: "image/png"
	}

	let images: MetadataImage[]
	$: images = pageData?.images ?? [
		{ url: senexProfile, height: 600, width: 600, alt: "Senex's profile picture", type: "image/webp" },
		primaryImage
	]

	let cardType: string
	$: cardType = pageData?.cardType ?? "summary"

	let creator: string
	$: creator = pageData?.creator ?? "@senexAD"
</script>

<svelte:head>
	<title>{title}</title>
	<link rel="me" href={mastodonLink}>
	<link rel="canonical" href={url}>

	<meta property="og:url" content={url} />

	<meta name="description" content={description} />
	<meta property="og:site_name" content={title} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:type" content="profile" />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />

	{#each images as image}
		<meta property="og:image" content="{basePath}{image.url}" />
		<meta property="og:image:alt" content={image.alt} />
		<meta property="og:image:width" content={image.width} />
		<meta property="og:image:height" content={image.height} />
		<meta property="og:image:type" content={image.type} />
	{/each}

	<meta property="profile:first_name" content="Senex" />
	<meta property="profile:last_name" content="the Dragon" />
	<meta property="profile:username" content="senex" />
	<meta property="profile:gender" content="male" />

	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content="{basePath}{primaryImage.url}" />
	<meta name="twitter:image:alt" content={primaryImage.alt} />
	<meta name="twitter:site" content={creator} />
	<meta name="twitter:creator" content={creator} />
	<meta name="twitter:card" content={cardType} />
	<meta name="twitter:domain" content={domain} />
	<meta name="twitter:url" content={url} />
</svelte:head>

<div class="app">

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
		--footer-text-color: #fff;
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
	}

	@include breakpoint('xs') {
		footer {
			padding: 12px 0;
		}
	}
</style>
