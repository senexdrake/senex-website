<script lang="ts">
    import { imagesForCategory, categories } from '$lib/model/gallery'
	import { page } from "$app/stores";
	import { goto } from "$app/navigation"
	import { userSettings } from "$lib/stores/userSettings"
	import type {
		ImageCategory,
		ImageExport
	} from "$model/types";
	import {onMount} from "svelte";
	import GalleryImage from "../GalleryImage.svelte";

	$: showNsfw = $userSettings.showNsfw
	$: allowNsfw = $userSettings.allowNsfw

	$: currentCategory = categories.get($page.data.category)

	$: allImages = (category: string|ImageCategory): ImageExport[] => {
		if (typeof category !== 'string') category = category.name
		return imagesForCategory(category)
	}

	$: filteredImages = (category: string|ImageCategory): ImageExport[] => {
		let images = allImages(category)
		if (!showNsfw) images = images.filter(image => !image.nsfw)
		return images
	}

	$: currentImages = allImages(currentCategory)
	$: currentImagesFiltered = filteredImages(currentCategory)

	let currentCategoryName = ""
	$: filteredCategories = Array.from(categories.values()).filter(cat => showNsfw || !cat.nsfw)

	$: imagesSfw = currentImages.filter(image => !image.nsfw)
	$: imagesNsfw = currentImages.filter(image => image.nsfw)

	let loading = false

	async function gotoCategory(categoryName = '') {
		loading = true
		await goto(`/gallery/${categoryName}`)
		loading = false
	}

	async function onCategoryChange() {
		await gotoCategory(currentCategoryName)
	}


	function enableNsfw() : boolean {
		const nsfwResponse = allowNsfw ? true : confirm('Do you want to enable NSFW content?')
		$userSettings.showNsfw = nsfwResponse
		$userSettings.allowNsfw = nsfwResponse
		return nsfwResponse
	}

	onMount(() => {
		if (currentCategory?.nsfw) {
			// If the user does not accept NSFW content, go to default category
			if (!enableNsfw()) gotoCategory()
		}

		currentCategoryName = currentCategory?.name ?? ''
	})


	const toggleNsfw = () => {
		if (showNsfw) {
			let redirectToDefault = false

			if (currentCategory?.nsfw) {
				redirectToDefault = confirm('This category is marked as NSFW only. Do you really want to disable NSFW content?' +
						' You will be redirected to the default category.')
				if (!redirectToDefault) return
			}

			$userSettings.showNsfw = false
			if (redirectToDefault) gotoCategory()
		} else {
			enableNsfw()
		}
	}

</script>


<section>
	<div id="header">
		<div>
			<label for="nsfw-toggle">NSFW Content</label>
			<button id="nsfw-toggle" class="button" on:click={toggleNsfw}>{showNsfw ? 'Hide NSFW content' : 'Show NSFW content'}</button>
		</div>
		<div>
			<label for="category">Category</label>
			<select id="category" class="select" bind:value={currentCategoryName} on:change={onCategoryChange}>
				{#each filteredCategories as category}
					<option value={category.name} selected={currentCategory?.name === category.name}>
						{category.displayName} ({filteredImages(category).length})
					</option>
				{/each}
			</select>
		</div>
	</div>

	<p>
		{currentCategory?.description}
	</p>
	<p>
		Currently showing <span class="font-weight-bold">{currentImagesFiltered.length}</span> images out of a total
		of <span class="font-weight-bold">{currentImages.length}</span> images
		(<span class="font-weight-bold">{imagesSfw.length}</span> <span class="font-italic">SFW</span> and
		<span class="font-weight-bold">{imagesNsfw.length}</span> <span class="font-italic">NSFW</span>)
		in this category.
	</p>

	{#if loading}
		<div>Loading images...</div>
	{:else}
		<div class="images text-center">
			{#each currentImagesFiltered as image}
				<GalleryImage image={image}></GalleryImage>
			{/each}
		</div>
	{/if}
	<hr class="default">
	<h1>More coming Soon!</h1>
	<div>Now that I've figured out the asset management, I now have to figure out how to structure this page...</div>
</section>

<style lang="scss">
	@use "$styles/variables" as *;
	@use "$styles/mixins";

	$img-blur-speed: .2s;
	$img-transition: $img-blur-speed ease all;
	$img-max-height: 65vh;

	#header {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
		row-gap: 0;
		@include mixins.breakpoint('xs') {
			grid-template-columns: 1fr 1fr;
		}

		label {
			font-weight: bold;
		}

		button, select {
			margin-top: 1rem;
		}
	}

	.images {
		display: grid;
		grid-template-columns: 1fr;
		grid-auto-flow: row;
		align-items: start;
		grid-auto-rows: auto;

		column-gap: 1rem;

		@include mixins.breakpoint('sm') {
			grid-template-columns: 1fr 1fr;
		}
		@include mixins.breakpoint('lg') {
			grid-template-columns: 1fr 1fr 1fr;
		}
	}

	hr {
		margin-bottom: 2rem !important;
	}

	#nsfw-toggle {
		margin-bottom: 2rem;
	}
</style>
