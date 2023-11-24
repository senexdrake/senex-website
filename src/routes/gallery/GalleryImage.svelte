<script lang="ts">
import {validSources} from "$lib/imageHelper";
import type {ImageExport, ImageSrc} from "$model/types.d";
import { galleryAssetBaseUrl as imageBaseUrl } from '$/config'

export let image: ImageExport

let largestVariant: ImageSrc
$: largestVariant = validSources(image.src).pop() || image.src[0]

$: sourceSet = (src: ImageSrc) => {
    return `${imageBaseUrl}${src.src} ${src.width}w`
}

// HTMl tags are safe in this case, as they are directly read from a configuration file
/* eslint-disable svelte/no-at-html-tags */

</script>

<div class="image" id={image.nameUnique}>
    <hr class="default">
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
                        loading="lazy"
                >
            </picture>
            <div class="img-overlay text-center">
                Open full picture
            </div>
        </a>
    </div>
    <h3>{image.title}</h3>
    <p>{@html image.description}</p>
    {#if image.author}
        <p>by <a href={image.author.url} class="author-link font-weight-bold">{image.author.name}</a></p>
    {/if}
</div>

<style lang="scss">
  @use "$styles/variables" as *;

  $img-blur-speed: .2s;
  $img-transition: $img-blur-speed ease all;
  $img-max-height: 65vh;

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
      max-height: $img-max-height;
      transition: $img-transition;
      width: 100%;
      height: auto;

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