<script lang="ts">
	import { galleryAssetPrefix } from '$/config'
	import { page } from "$app/stores";
	import { userSettings } from "$lib/stores/userSettings"
	import type {
		ImageAuthor,
		ImageExport,
		ImageSrc
	} from "$model/types";

	const imgMaxWidth = 1200
	const imageBaseUrl = galleryAssetPrefix

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

	$: largestVariants = new Map<string, ImageSrc>(images.map(image => {
		const sources = validSources(image.src)
		return [image.name, sources[sources.length - 1]]
	}))

	$: showImage = (isNsfw: boolean) => !isNsfw || showNsfw

	$: sourceSet = (src: ImageSrc) => {
		return `${imageBaseUrl}${src.src} ${src.width}w`
	}

	$: validSources = (sources: ImageSrc[]) => sources.filter(src => src.width <= imgMaxWidth)

</script>


<section>

	<button class="button" on:click={toggleNsfw} id="nsfw-toggle">{showNsfw ? 'Hide NSFW content' : 'Show NSFW content'}</button>

	<div class="text-center">
		{#each images as image}
			{#if showImage(image.nsfw ?? false)}
				<div class="img-container img-format">
					<a href="{imageBaseUrl}{image.original.src}" target="_blank">
						<picture>
							{#each validSources(image.src) as source}
								<source srcset={sourceSet(source)}
										height={source.height}
										width={source.width}
										media="(max-width: {source.width}px)"
										type="image/{source.format}"
								>
								{/each}

							<img
								src="{imageBaseUrl}{largestVariants.get(image.name)?.src}"
								height={largestVariants.get(image.name)?.height}
								width={largestVariants.get(image.name)?.height}
								alt={image.title}
								loading="lazy"
							>
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



	.img-container {
		cursor: pointer;

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
			display: block;
			max-height: $img-max-height;
			transition: $img-transition;
			width: 100%;
			height: auto;

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
