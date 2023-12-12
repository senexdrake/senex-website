<script lang="ts">
import { page } from "$app/stores";
import type {ImageCategory, ImageExport, ImageSrc} from "$model/types";
import GalleryImage from "../../GalleryImage.svelte";
import {imageCategories, nsfwSuffix} from "$model/gallery";

let image: ImageExport
$: image = $page.data.image

let categories: ImageCategory[]
$: categories = (imageCategories.get(image.id) ?? []).filter(category => category.show)

function categoryUrl(category: ImageCategory): string {
    let url = `/gallery/${category.name}`
    if (image.nsfw) url += nsfwSuffix
    return url
}

</script>

<section id="image">
    <GalleryImage image={image} singleView={true}></GalleryImage>
    <hr>
    Categories:
    <ul>
    {#each categories as category (category.name)}
        <li><a href={categoryUrl(category)}>{category.displayName}</a></li>
    {/each}
    </ul>
</section>