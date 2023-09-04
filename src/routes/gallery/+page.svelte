<script lang="ts">
	import { page } from "$app/stores";
	import { userSettings } from "$lib/stores/userSettings"
	import type {
		ImageAuthor,
		ImageExport,
		ImageSrc
	} from "$model/types";

	const refsheetAuthor: ImageAuthor = {
		name: "Wolke",
		url: "https://wolke.carrd.co/"
	}

	const imageBaseUrl = "https://pics.senex.link"

	const images: ImageExport[] = $page.data.galleryImages

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

	$: sourceSet = (src: ImageSrc[]) => {
		const lastValidIndex = src.length - 2
		let sourceSet = ""
		if (lastValidIndex < 0) return sourceSet
		for (let i = 0; i <= lastValidIndex; i++) {
			if (sourceSet.length !== 0) sourceSet += ', '
			sourceSet += `${imageBaseUrl}/${src[i].src} ${src[i].width}w`
		}
		return sourceSet
	}

	$: largestVariant = (image: ImageExport) : string => {
		// Largest variant is always the last one
		if (image.original) return image.original.src
		const sources = image.src
		return sources[sources.length - 1].src
	}

</script>


<section>

	<button class="button" on:click={toggleNsfw} id="nsfw-toggle">{showNsfw ? 'Hide NSFW content' : 'Show NSFW content'}</button>

	<div class="text-center">
		{#each images as image}
			{#if showImage(image.nsfw ?? false)}
				<div class="img-container">
					<a href="{imageBaseUrl}/{largestVariant(image)}" target="_blank">
						<picture>
							<source srcset={sourceSet(image.src)}>
							<img src="{imageBaseUrl}/{largestVariant(image)}" alt={image.title}>
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
			{/if}
		{/each}
	</div>

	<h1>More coming Soon!</h1>
	<div>Now that I've figured out the asset management, I now have to figure out how to structure this page...</div>
</section>

<style lang="scss">
	@use "$styles/variables" as *;

	$img-blur-speed: .2s;
	$img-transition: $img-blur-speed ease all;
	$img-max-height: 65vh;


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
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
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
			max-height: $img-max-height;
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
</style>
