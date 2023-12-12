<script lang="ts">
import { page } from "$app/stores";
import type {ImageCategory, ImageExport} from "$model/types";
import GalleryImage from "../../GalleryImage.svelte";
import {imageCategories, nsfwSuffix, allImages} from "$model/gallery";

let image: ImageExport
$: image = $page.data.image

let relatedImages: ImageExport[]
$: relatedImages = image.related.map(id => {
    return allImages.get(id)
}).filter(image => image !== undefined)

let categories: ImageCategory[]
$: categories = (imageCategories.get(image.id) ?? []).filter(category => category.show)


function categoryUrl(category: ImageCategory): string {
    let url = `/gallery/${category.name}`
    if (image.nsfw) url += nsfwSuffix
    return url
}

function relatedImageUrl(image: ImageExport): string {
    return `/gallery/image/${image.nameUnique}#image`
}

</script>

<section id="image">
    <GalleryImage image={image} singleView={true}></GalleryImage>
    <hr>
    {#if relatedImages.length > 0}
        <span class="font-weight-bold">Related Images:</span>
        <ul>
            {#each relatedImages as relatedImage (relatedImage.id)}
                <li><a href={relatedImageUrl(relatedImage)}>{relatedImage.title}</a></li>
            {/each}
        </ul>
        <hr>
    {/if}
    <span class="font-weight-bold">Categories:</span>
    <ul>
    {#each categories as category (category.name)}
        <li><a href={categoryUrl(category)}>{category.displayName}</a></li>
    {/each}
    </ul>
</section>