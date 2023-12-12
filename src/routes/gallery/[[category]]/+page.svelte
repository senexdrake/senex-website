<script lang="ts">
    import { imagesForCategory, categories, nsfwSuffix, defaultCategory } from '$lib/model/gallery'
	import { page } from "$app/stores";
	import { goto } from "$app/navigation"
	import { redirectToNsfw } from "$/config"
	import { userSettings } from "$lib/stores/userSettings"
	import type {
		ImageCategory,
		ImageExport
	} from "$model/types";
	import {onMount} from "svelte";
	import GalleryImage from "../GalleryImage.svelte";
	import {browser} from "$app/environment";

	$: showNsfw = $page.data.nsfw
	$: allowNsfw = $userSettings.allowNsfw
	$: needsNsfwConsent = showNsfw && !allowNsfw

	$: currentCategory = categories.get($page.data.category)

	$: allImages = (category: string|ImageCategory|undefined): ImageExport[] => {
		if (category === undefined) return []
		if (typeof category !== 'string') category = category.name
		return imagesForCategory(category)
	}

	$: filteredImages = (category: string|ImageCategory|undefined): ImageExport[] => {
		if (category === undefined) return []
		let images = allImages(category)
		if (!showNsfw) images = images.filter(image => !image.nsfw)
		return images
	}

	$: currentImages = allImages(currentCategory)
	$: currentImagesFiltered = filteredImages(currentCategory)

	let selectedCategory = ""
	$: filteredCategories = Array.from(categories.values()).filter(cat => showNsfw || !cat.nsfw)

	$: imagesSfw = currentImages.filter(image => !image.nsfw)
	$: imagesNsfw = currentImages.filter(image => image.nsfw)

	let loading = false

	async function gotoCategory(categoryName = '', nsfw: boolean = showNsfw, keepHash: boolean = false) {
		loading = true
		if (nsfw) categoryName += nsfwSuffix
		let url = `/gallery/${categoryName}`
		if (browser && keepHash) url += location.hash
		await goto(url)
		if (currentCategory !== undefined) {
			selectedCategory = currentCategory.name
		}
		loading = false
	}

	async function onCategoryChange() {
		await gotoCategory(selectedCategory)
	}


	function enableNsfw() : boolean {
		const nsfwResponse = allowNsfw ? true : confirm('Do you want to enable NSFW content?')

		let categoryTarget = currentCategory?.name ?? ''
		if (!nsfwResponse && currentCategory?.nsfw) {
			categoryTarget = ''
		}

		$userSettings.showNsfw = nsfwResponse
		$userSettings.allowNsfw = nsfwResponse

		if (nsfwResponse && categoryTarget.length == 0)
			categoryTarget = defaultCategory

		gotoCategory(categoryTarget, nsfwResponse, nsfwResponse)
		return nsfwResponse
	}

	function disableNsfw() {
		let redirectToDefault = false

		if (currentCategory?.nsfw) {
			redirectToDefault = confirm('This category is marked as NSFW only. Do you really want to disable NSFW content?' +
					' You will be redirected to the default category.')
			if (!redirectToDefault) return
		}

		$userSettings.showNsfw = false
		if (redirectToDefault) {
			gotoCategory('', false)
		} else {
			gotoCategory(currentCategory?.name, false)
		}
	}

	// If the page will be NSFW, we need to anticipate a NSFW consent pop up
	let imageContainerHidden = $page.data.nsfw

	onMount(() => {
		// Redirect to NSFW page when last NSFW setting was set to show
		if (redirectToNsfw && $userSettings.showNsfw && !$page.data.nsfw) {
			enableNsfw()
		}

		if (needsNsfwConsent) {
			enableNsfw()
		}

		selectedCategory = currentCategory?.name ?? ''
		imageContainerHidden = false

		// Manually scroll to the selected element
		if (browser) {
			setTimeout(() => {
				const hashValue = location.hash.substring(1)
				const targetElement = document.getElementById(hashValue)
				targetElement?.scrollIntoView({
					behavior: "auto"
				})
			}, 100)
		}
	})


	const toggleNsfw = () => {
		if (showNsfw) {
			disableNsfw()
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
			<select id="category" class="select" bind:value={selectedCategory} on:change={onCategoryChange}>
				{#each filteredCategories as category}
					<option value={category.name}>
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
		in this category.<br>
		Clicking on an image will open the full resolution version. Clicking on the title will open a singular image page.
	</p>

	{#if loading}
		<div>Loading images...</div>
	{:else}
		<div class="images text-center" class:hidden={imageContainerHidden}>
			{#each currentImagesFiltered as image (image.id)}
				<GalleryImage image={image}></GalleryImage>
			{/each}
		</div>
	{/if}
	<hr class="default">
	<h1>More coming Soon!</h1>
	<div>Now that I've figured out the asset management, I now have to figure out how to structure this page...</div>
	<hr>
	Reference Pages:
	<ul>
		<li><a href="/gallery/refs/sfw">SFW References</a></li>
		<li><a href="/gallery/refs/nsfw">NSFW References</a></li>
	</ul>
</section>

<style lang="scss">
	@use "$styles/variables" as *;
	@use "$styles/mixins";

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

	.hidden {
		display: none !important;
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
