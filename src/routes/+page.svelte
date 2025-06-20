<script lang="ts">
	import {base} from "$app/paths"
	import Links from "./Links.svelte"
	import { page } from '$app/state';
	import {profileBanner} from "$model"
	import type {ImageAuthor, ImageSrc, ProfileBannerExport} from "$model/types.d"
	import {galleryAssetBaseUrl, linkToProfileBanner} from '$/config'
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

	const profileFallback = profileBanner.src.filter(src => src.format == "png").sort((a, b) => b.width - a.width)[0]
	const profileIcons = profileBanner
	const profileAuthor: ImageAuthor|undefined = profileBanner.author
	const profileLink = linkToProfileBanner ? base + galleryAssetBaseUrl + profileBanner.original.src : undefined
</script>

<section id="home">
	<div class="img-format">
		<a href={profileLink}>
			<picture id="profile-pic">
				{#each imageSourceSets(profileIcons).entries() as [format, sourceSet] (format)}
					<source srcset={sourceSet} type="image/{format}">
				{/each}
				<img
						src={base + galleryAssetBaseUrl + profileFallback.src}
						width={profileFallback.width} height={profileFallback.height}
						alt="Drake profile banner" fetchpriority="high" />
			</picture>
		</a>
	</div>
	<hr class="default">
	<div id="about-me" class="text-center">
		{#if profileAuthor}
			<p id="banner-description">
				(Original banner image by <a href={profileAuthor.url}>{profileAuthor.name}</a>, edited by me)
			</p>
		{/if}
		<p>Hey, I'm <span class="font-weight-bold">ZenDrake</span>, sometimes also known as Drake (my sona's name) or ArisenDrake.</p>
		<p>
			This is a small overview page for me and my fursona, a pretty big (and massive) Bull-Dragon hybrid thing called Drake (peak creativity, I know).
		</p>
		<p>
			Don't have much to say here, except that I <span class="font-italic">LOVE</span> big fellas, especially dragons and bulls.
			Also, please expect NSFW content on my art galleries.
		</p>
	</div>
	<hr class="default">
	<Links links={page.data.links} />
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
