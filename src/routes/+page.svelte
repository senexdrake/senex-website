<script>
	import senexProfile from '$remoteAssets/senex-profile.webp?w=400;600&quality=50&format=webp&remote&as=srcset';
	import senexProfileFallback from '$remoteAssets/senex-profile.webp?format=png&remote';
	import Links from "./Links.svelte";
</script>

<section id="home">
	<picture id="profile-pic">
		<source srcset="{senexProfile}" type="image/webp">
		<img src={senexProfileFallback} alt="Senex profile" />
	</picture>
	<hr class="default">
	<div id="about-me" class="text-center">
		<p>Hey, I'm <span class="font-weight-bold">Senex</span>, also known as ArisenDrake in my... eh... non-furry related activities!</p>
		<p>This is a small overview page for me and my fursona, a pretty big (and massive) dragon.</p>
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
			max-width: 100%;
			max-height: 15rem;
		}
	}


</style>
