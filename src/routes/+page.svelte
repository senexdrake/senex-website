<script lang="ts">
	import Links from "./Links.svelte";
	import {profileBanner} from "$model/gallery";
	import type {ImageExport} from "$model/types.d";
	import { galleryAssetDir } from '../config'
	import {validSources} from "$lib/imageHelper";

	function iconToSourceSet(image: ImageExport): string {
		let sourceSet = ""
		for (const src of validSources(image.src)) {
			if (sourceSet.length !== 0) sourceSet += ', '
			sourceSet += `${galleryAssetDir}${src.src} ${src.width}w`
		}
		return sourceSet
	}

	const senexProfileFallback = profileBanner.src.sort((a, b) => b.width - a.width)[0]
	const senexProfileIcons = profileBanner
</script>

<section id="home">
	<div class="img-format">
		<a href="{galleryAssetDir}{profileBanner.original.src}">
			<picture id="profile-pic">
				<source srcset="{iconToSourceSet(senexProfileIcons)}" type="image/webp">
				<img src="{galleryAssetDir}{senexProfileFallback.src}" alt="Senex profile" fetchpriority="high" />
			</picture>
		</a>
	</div>
	<hr class="default">
	<div id="about-me" class="text-center">
		<p>Hey, I'm <span class="font-weight-bold">Senex</span>, also known as ArisenDrake in my... eh... non-furry related activities!</p>
		<p>
			This is a small overview page for me and my fursona, a pretty big (and massive) dragon. There's also a small
			<a href="/gallery">Gallery</a> featuring some of my favorite artworks that I've commissioned over the years.
		</p>
		<p>
			Don't have much to say here, except that I <span class="font-italic">LOVE</span> big fellas, especially dragons.
			Also, please expect NSFW content on my art galleries.
		</p>
	</div>
	<hr class="default">
	<Links />
</section>

<style lang="scss">
	@use "$styles/variables" as *;
	@use "$styles/mixins";

	#home {
		flex: 1;
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	#about-me {
		margin: -$hr-margin 0;
	}

	.img-format {
		border-radius: 0;
		box-shadow: none;
		margin: 0 (-0.5rem) (-$hr-margin) (-0.5rem);

		@include mixins.breakpoint($big-links-breakpoint) {
			margin: 0 0 (-$hr-margin) 0;
		}
	}

	#profile-pic {
		img {
			//border-radius: 50%;
			//background: black;
			//border: 2px solid black;
			max-height: 25rem;
		}
	}


</style>
