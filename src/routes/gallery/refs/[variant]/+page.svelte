<script lang="ts">
import { page } from "$app/stores";
import type {ImageExport} from "$model/types";
import GalleryImage from "../../GalleryImage.svelte";
import {
    imagesForCategory
} from "$model/gallery";

let nsfwEnabled: boolean
$: nsfwEnabled = $page.data.nsfw

const refImageCategory = "references"
const baseUrl = "/gallery/refs/"

$: variantToggleLink = baseUrl + (nsfwEnabled ? 'sfw' : 'nsfw')
$: variantToggleText = nsfwEnabled ? 'Show SFW' : 'Show NSFW'

let images: ImageExport[]
$: images = imagesForCategory(refImageCategory)
    .filter(image => {
        if (nsfwEnabled) return true
        return !image.nsfw
    })


</script>

<section>
    <div id="header">
        <span>
            This is a small site to show Senex's references in a compact matter.<br>
            Clicking on an image will open the full resolution version. Clicking on the title will open a singular image page.
        </span>
        <div>
            <a id="nsfw-toggle" class="button" href={variantToggleLink}>
                {variantToggleText}
            </a>
        </div>
    </div>
    <hr>
    <div class="images text-center">
        {#each images as image (image.id)}
            <GalleryImage image={image} compact={true}></GalleryImage>
        {/each}
    </div>
</section>

<style lang="scss">
  @use "$styles/variables" as *;
  @use "$styles/mixins";

  #header {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    @include mixins.breakpoint('xs') {
      grid-template-columns: 1fr 1fr;
    }
  }

  hr {
    margin: 1em 0;
  }

  .images {
    --columns: 1;
    display: grid;
    grid-template-columns: repeat(var(--columns), 1fr);
    grid-auto-flow: row;
    align-items: start;
    grid-auto-rows: auto;

    column-gap: 1rem;

    @include mixins.breakpoint('xs') {
      --columns: 2;
    }
    @include mixins.breakpoint('sm') {
      --columns: 3;
    }
    @include mixins.breakpoint('md') {
      --columns: 4;
    }
    @include mixins.breakpoint('lg') {
      --columns: 5;
    }
    @include mixins.breakpoint('xl') {
      --columns: 6;
    }
  }
</style>