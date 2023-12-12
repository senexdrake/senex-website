<script lang="ts">
import {validSources} from "$lib/imageHelper";
import type {ImageExport, ImageSrc} from "$model/types.d";
import { galleryAssetBaseUrl as imageBaseUrl } from '$/config'
import {beforeUpdate} from "svelte";
import GalleryImageTitle from "./GalleryImageTitle.svelte";

export let image: ImageExport
export let singleView = false
export let titleAboveImage = false
export let lazyLoad = !singleView
export let compact = false

let largestVariant: ImageSrc
$: largestVariant = validSources(image.src).pop() || image.src[0]

let description = image.description


$: sourceSet = (src: ImageSrc) => {
    return `${imageBaseUrl}${src.src} ${src.width}w`
}

beforeUpdate(() => {
    // Force rerendering of image description after an update
    description = ""
    description = image.description
})

// HTMl tags are safe in this case, as they are directly read from a configuration file
/* eslint-disable svelte/no-at-html-tags */

</script>

<div class="image" id={image.nameUnique}>
    {#if !singleView && !compact}
    <hr>
    {/if}
    {#if titleAboveImage}
        <div id="title-above" class="text-center">
            <GalleryImageTitle image={image} large={true}></GalleryImageTitle>
        </div>
    {/if}
    <div class="img-container img-format">
        <a href="{imageBaseUrl}{image.original.src}" target="_blank">
            <picture>
                {#each validSources(image.src) as source}
                    <source srcset={sourceSet(source)}
                            height={source.height}
                            width={source.width}
                            media="(max-width: {source.width}px)"
                            type="image/{source.format}"
                    >
                {/each}

                <img
                        src="{imageBaseUrl}{largestVariant.src}"
                        height={largestVariant.height}
                        width={largestVariant.height}
                        alt={image.title}
                        loading={lazyLoad ? 'lazy' : 'eager'}
                        class:limit-height={!singleView}
                >
            </picture>
            <div class="img-overlay text-center">
                Open full picture
            </div>
        </a>
    </div>
    {#if !titleAboveImage}
        <div id="title" class:compact={compact}>
            <GalleryImageTitle image={image} large={singleView}></GalleryImageTitle>
        </div>
    {/if}
    {#if !compact}
        <p>{@html description}</p>
    {/if}
    {#if image.author}
        <p>by <a href={image.author.url} class="author-link font-weight-bold">{image.author.name}</a></p>
    {/if}
</div>

<style lang="scss">
  @use "$styles/variables" as *;

  $img-blur-speed: .2s;
  $img-transition: $img-blur-speed ease all;
  $img-max-height: 65vh;

  hr {
    margin: 0 0 $hr-margin;
  }

  #title-above {
    margin-bottom: 1em;
  }

  #title {
    margin: 1.5em 0 .5em;
    &.compact {
      margin: 1em 0 0;
    }
  }

  .image {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  .img-container {
    cursor: pointer;

    &:hover {
      .img-overlay {
        opacity: 1;
      }

      img {
        filter: blur(4px);
        transform: scale(1.05);
      }
    }

    img {
      display: block;
      transition: $img-transition;
      width: 100%;
      height: auto;
    }

    img.limit-height {
      max-height: $img-max-height;
    }

    .img-overlay {
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      font-size: 2em;
      top: 0;
      left: 0;
      bottom: 0;
      width: 100%;
      text-align: center;
      background: rgba(0, 0, 0, 0.5);
      color: $color-text-dark;
      opacity: 0;
      transition: $img-transition;
    }
  }
</style>