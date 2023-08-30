<script>
	import senexProfile from '$lib/images/senex-profile.webp';
	import senexProfileFallback from '$lib/images/senex-profile.png';
	import Links from "./Links.svelte";
</script>

<svelte:head>
	<title>Senex the Dragon</title>
	<meta name="description" content="Senex the Dragon" />
</svelte:head>

<section id="home">
	<picture id="profile-pic">
		<source srcset="{senexProfile}" type="image/webp">
		<img src={senexProfileFallback} alt="Senex profile" />
	</picture>

	<div id="about-me" class="text-center">
		Hey, I'm Senex, also known as ArisenDrake. <br>
		This is a small overview page for me and my fursona, a pretty big dragon.
	</div>

	<Links />
</section>

<style lang="scss">
	@import "@styles/breakpoints";
	#home {
		padding: 2rem 2rem 1rem 2rem;
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	#about-me {
		margin-top: 2rem;
		margin-bottom: 1rem;
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
