<script lang="ts">
import type {ImageExport} from "$model/types";
import {linkToImagePage} from "$model/gallery";

export let image: ImageExport
export let centered = false
export let large = false
</script>

<span
    class="font-weight-bold"
    class:text-center={centered}
    class:large={large}
><a class="no-decoration" href={linkToImagePage(image)}>{image.title}</a></span>

<style lang="scss">

    .no-decoration {
        text-decoration: none;
    }

    span {
        font-size: 1.2em;
        * {
            transition: color 0.2s ease;
            &:hover {
                color: var(--color-theme-1);
            }
        }
    }

    span.large {
        font-size: 2em;
    }
</style>