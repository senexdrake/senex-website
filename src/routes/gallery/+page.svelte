<script lang="ts">
	import refsheetSfw from "$remoteAssets/refsheet-sfw.png?w=1200;2400&format=webp&remote&as=srcset"
	import refsheetNsfw from "$remoteAssets/refsheet-naked.png?w=1200;2400&format=webp&remote&as=srcset"
	import refsheetBulge from "$remoteAssets/refsheet-bulge.png?w=1200;2400&format=webp&remote&as=srcset"

	import { page } from "$app/stores";
	import type {ImageCategory, Images} from "$model/types";

	const cdnPath = "https://pics.senex.link"
	const maxWidth = "600"
	const previewQuality = 50

	const references: ImageCategory = {
		title: "",
		description: "",
		images: [
			{ title: "Refsheet SFW", description: "SFW Refsheet for Senex, based on a 3D model", src: refsheetSfw },
			{ title: "Refsheet NSFW (Bulge)", description: "NSFW Refsheet for Senex, based on a 3D model, featuring a hyper bulge", src: refsheetBulge, nsfw: true },
			{ title: "Refsheet NSFW (Naked)", description: "NSFW Refsheet for Senex, based on a 3D model, naked", src: refsheetNsfw, nsfw: true }
		]
	}

	let showNsfw = false

	const toggleNsfw = () => {
		if (!showNsfw) {
			showNsfw = confirm('Are you sure you want to enable NSFW content?')
		} else {
			showNsfw = false
		}
	}
	$: isBlurred = (isNsfw: boolean) => isNsfw && !showNsfw
	const singleSrc = (srcset: string) => srcset.substring(0, srcset.indexOf(' '))
</script>


<section class="text-column">

	<button on:click={toggleNsfw} id="nsfw-toggle">Toggle NSFW</button>

	<div class="text-center">
		{#each references.images as image}
			<picture class={isBlurred(image.nsfw ?? false) ? 'blur' : ''}>
				<source srcset={image.src}>
				<img src={singleSrc(image.src)} alt={image.title}>
			</picture>
			<h3>{image.title}</h3>
			<p>{image.description}</p>
			<hr class="default">
		{/each}
	</div>

	<h1>Coming Soon!</h1>
	<div>... hopefully. FurAffinity hasn't been as reliable as I wanted it to be over the last years...</div>
</section>

<style lang="scss">
	#nsfw-toggle {
		margin-bottom: 2rem;
	}

	.blur img {
		filter: brightness(0);
	}

	section {
		margin-top: 1rem;
	}

	img {
		width: 100%;
	}
</style>
