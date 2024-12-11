<script lang="ts">
	import {base} from "$app/paths"
	import Links from "./Links.svelte"
	import {profileBanner} from "$model"
	import type {ImageAuthor, ImageSrc, ProfileBannerExport} from "$model/types.d"
	import { galleryAssetBaseUrl } from '../config'
	import {validSources} from "$lib/imageHelper"

	function sourcesByFormat(image: ProfileBannerExport): Map<string, ImageSrc[]> {
		const ret = new Map<string, ImageSrc[]>
		validSources(image.src).forEach(src => {
			if (!ret.has(src.format)) ret.set(src.format, [])
			const sourcesForFormat = ret.get(src.format)
			sourcesForFormat.push(src)
		})
		return ret
	}

	function imageSourceSets(image: ProfileBannerExport): Map<string, string> {
		const sourceSetByFormat = new Map<string, string>
		sourcesByFormat(image).forEach((value, key) => {
			let sourceSet = ""
			value.forEach(src => {
				if (sourceSet.length !== 0) sourceSet += ', '
				sourceSet += `${base}${galleryAssetBaseUrl}${src.src} ${src.width}w`
			})
			sourceSetByFormat.set(key, sourceSet)
		})
		return sourceSetByFormat
	}

	const senexProfileFallback = profileBanner.src.filter(src => src.format == "png").sort((a, b) => b.width - a.width)[0]
	const senexProfileIcons = profileBanner
	const senexProfileAuthor: ImageAuthor|undefined = profileBanner.author
</script>

<section id="home">
	<div class="img-format">
		<a href={base + galleryAssetBaseUrl + profileBanner.original.src}>
			<picture id="profile-pic">
				{#each imageSourceSets(senexProfileIcons).entries() as [format, sourceSet]}
					<source srcset={sourceSet} type="image/{format}">
				{/each}
				<img
						src={base + galleryAssetBaseUrl + senexProfileFallback.src}
						width={senexProfileFallback.width} height={senexProfileFallback.height}
						alt="Senex profile banner" fetchpriority="high" />
			</picture>
		</a>
	</div>
	<hr class="default">
	<div id="about-me" class="text-center">
		{#if senexProfileAuthor}
			<p id="banner-description">
				(Original banner image by <a href={senexProfileAuthor.url}>{senexProfileAuthor.name}</a>, edited by me)
			</p>
		{/if}
		<p>Hey, I'm <span class="font-weight-bold">ZenDrake</span>, sometimes also known as Senex (my sona's name) or ArisenDrake.</p>
		<p>
			This is a small overview page for me and my fursona, a pretty big (and massive) dragon.
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
	@use "$styles/variables" as vars;
	@use "$styles/mixins";

	#banner-description {
		--text-color: #676767;
		font-size: .75em;
		font-style: italic;
		color: var(--text-color);

		@include mixins.whenDark() {
			--text-color: grey;
		}

		* {
			color: var(--text-color)
		}
	}

	#home {
		flex: 1;
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	#about-me {
		margin: -(vars.$hr-margin) 0;
	}

	.img-format {
		border-radius: 0;
		box-shadow: none;
		margin: 0 0 (-(vars.$hr-margin)) 0;

		//@include mixins.breakpoint(vars.$big-links-breakpoint) {
		//	margin: 0 0 (-(vars.$hr-margin)) 0;
		//}
	}

	#profile-pic {
		img {
			//border-radius: 50%;
			//background: black;
			//border: 2px solid black;
			// Profile banner should be width limited anyway
			--brightness: 1.1;

			display: block;
			width: 100%;
			height: 100%;
			max-height: 80vh;
			filter: drop-shadow(0 0 10px #000000) brightness(var(--brightness));

			@include mixins.whenDark() {
				--brightness: 1.0;
			}
		}
	}


</style>
