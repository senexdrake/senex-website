<script lang="ts">
	import Links from "./Links.svelte";
	import {iconCatalogue} from "$model";
	import type {IconExport} from "$model/types.d";
	import {PUBLIC_IMAGE_BASE_PATH} from "$env/static/public"

	const profileIconName = "senex-profile"
	const preferredFormat = "webp"
	const fallbackFormat = "png"

	function iconToSourceSet(icons: IconExport[]): string {
		let sourceSet = ""
		for (const icon of icons) {
			if (sourceSet.length !== 0) sourceSet += ', '
			sourceSet += `${PUBLIC_IMAGE_BASE_PATH}/${icon.name} ${icon.width}w`
		}
		return sourceSet
	}

	const senexProfileFallback = iconCatalogue.sort((a, b) => b.width - a.width).find(icon => icon.format == fallbackFormat)
	const senexProfileIcons = iconCatalogue.filter(icon => icon.name.startsWith(profileIconName) && icon.format == preferredFormat)
</script>

<section id="home">
	<picture id="profile-pic">
		<source srcset="{iconToSourceSet(senexProfileIcons)}" type="image/webp">
		<img src="{PUBLIC_IMAGE_BASE_PATH}/{senexProfileFallback.name}" alt="Senex profile" />
	</picture>
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

	#home {
		flex: 1;
		padding: 0 0;
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	#about-me {
		margin: -$hr-margin 0;
	}

	#profile-pic {
		img {
			//border-radius: 50%;
			//background: black;
			//border: 2px solid black;
			max-height: 15rem;
		}
	}


</style>
