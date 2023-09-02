<script lang="ts">
	import refsheetSfwSrcSet from "$remoteAssets/refsheet-sfw.png?w=1000;2000&format=webp&remote&as=srcset"
	import refsheetNsfwSrcSet from "$remoteAssets/refsheet-naked.png?w=1000;2000&format=webp&remote&as=srcset"
	import refsheetBulgeSrcSet from "$remoteAssets/refsheet-bulge.png?w=1000;2000&format=webp&remote&as=srcset"

	import refsheetSfwLarge from '$remoteAssets/refsheet-sfw.png?w=4000&format=webp&remote'
	import refsheetNsfwLarge from '$remoteAssets/refsheet-naked.png?w=4000&format=webp&remote'
	import refsheetBulgeLarge from '$remoteAssets/refsheet-bulge.png?w=4000&format=webp&remote'

	import { page } from "$app/stores";
	import { userSettings } from "$lib/stores/userSettings"
	import type {ImageAuthor, ImageCategory, Images} from "$model/types";

	const refsheetAuthor: ImageAuthor = {
		name: "Wolke",
		url: "https://wolke.carrd.co/"
	}

	const references: ImageCategory = {
		title: "",
		description: "",
		images: [
			{ title: "Refsheet SFW", description: "SFW Refsheet for Senex. Refsheet is made by me, based on a 3D model",
				author: refsheetAuthor,
				srcset: refsheetSfwSrcSet,
				src: refsheetSfwLarge,
			},
			{ title: "Refsheet NSFW (Bulge)", description: "NSFW Refsheet for Senex (clothed with hyper bulge). Refsheet is made by me, based on a 3D model",
				author: refsheetAuthor,
				srcset: refsheetBulgeSrcSet,
				src: refsheetBulgeLarge,
				nsfw: true
			},
			{ title: "Refsheet NSFW (Naked)", description: "NSFW Refsheet for Senex (naked with hyper genitals). Refsheet is made by me, based on a 3D model",
				author: refsheetAuthor,
				srcset: refsheetNsfwSrcSet,
				src: refsheetNsfwLarge,
				nsfw: true
			}
		]
	}

	$: showNsfw = $userSettings.showNsfw
	$: allowNsfw = $userSettings.allowNsfw

	const toggleNsfw = () => {
		if (showNsfw) {
			$userSettings.showNsfw = !showNsfw
		} else {
			const nsfwResponse = allowNsfw ? true : confirm('Do you want to enable NSFW content?')
			$userSettings.showNsfw = nsfwResponse
			$userSettings.allowNsfw = nsfwResponse
		}
	}

	$: showImage = (isNsfw: boolean) => !isNsfw || showNsfw

</script>


<section>

	<button class="button" on:click={toggleNsfw} id="nsfw-toggle">{showNsfw ? 'Hide NSFW content' : 'Show NSFW content'}</button>

	<div class="text-center">
		{#each references.images as image}
			<div hidden={!showImage(image.nsfw ?? false)}>
				<div class="img-container">
					<a href={image.src} target="_blank">
						<picture>
							<source srcset={image.srcset}>
							<img src={image.src} alt={image.title}>
						</picture>
						<div class="img-overlay text-center">
							Open full picture
						</div>
					</a>
				</div>
				<h3>{image.title}</h3>
				<p>{image.description}</p>
				{#if image.author}
					<p>by <a href={image.author.url} class="author-link font-weight-bold">{image.author.name}</a></p>
				{/if}
				<hr class="default">
			</div>
		{/each}
	</div>

	<h1>More coming Soon!</h1>
	<div>Now that I've figured out the asset management, I now have to figure out how to structure this page...</div>
</section>

<style lang="scss">
	@use "$styles/variables" as *;

	$img-blur-speed: .2s;
	$img-transition: $img-blur-speed ease all;


	hr {
		margin-bottom: 2rem !important;
	}

	button {
		border-style: none;
	}

	#nsfw-toggle {
		margin-bottom: 2rem;
	}

	section {
		margin: 1rem 0;
	}

	.img-container {
		cursor: pointer;
		position: relative;
		overflow: hidden;
		border-radius: $img-border-radius;
		box-shadow: 0 0 20px 10px rgba(0, 0, 0, 0.7);

		&:hover {
			.img-overlay {
				opacity: 1;
			}

			img {
				filter: blur(4px);
				transform: scale(1.05);
			}
		}

		img {
			transition: $img-transition;
		}

		.img-overlay {
			display: flex;
			justify-content: center;
			align-items: center;
			position: absolute;
			font-size: 2em;
			top: 0;
			left: 0;
			bottom: 0;
			width: 100%;
			text-align: center;
			background: rgba(0, 0, 0, 0.5);
			color: $color-text-dark;
			opacity: 0;
			transition: $img-transition;
		}
	}

	.author-link {
		color: var(--color-text)
	}
</style>
