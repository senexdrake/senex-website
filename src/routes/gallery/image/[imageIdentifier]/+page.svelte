<script lang="ts">
import { page } from "$app/stores";
import type {ImageCategory, ImageExport} from "$model/types";
import GalleryImage from "../../GalleryImage.svelte";
import {imageCategories, nsfwSuffix, allImages, linkToImagePage, imageRatingDisplayName} from "$model/gallery";

let image: ImageExport
$: image = $page.data.galleryImage

let relatedImages: ImageExport[]
$: relatedImages = (image.related?.map(id => {
    return allImages.get(id)
}).filter(image => image !== undefined) as ImageExport[]|undefined) ?? []

let categories: ImageCategory[]
$: categories = (imageCategories.get(image.id) ?? []).filter(category => category.show)


function categoryUrl(category: ImageCategory): string {
    let url = `/gallery/${category.name}`
    if (image.nsfw) url += nsfwSuffix
    return url
}

function relatedImageUrl(image: ImageExport): string {
    return linkToImagePage(image)
}

</script>

<section id="image">
    <GalleryImage image={image} singleView={true}></GalleryImage>
    <div>
        Marked as <span class="font-weight-bold rating" class:rating-nsfw={image.nsfw}>{imageRatingDisplayName(image)}</span>
    </div>
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

<style lang="scss">
    @use "$styles/mixins";

    .rating {
        color: #006900;
        @include mixins.whenDark() {
            color: #4fff4f;
        }
    }

    .rating-nsfw {
        color: #960000;
        @include mixins.whenDark() {
            color: #fd2e2e;
        }
    }
</style>