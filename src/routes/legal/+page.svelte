<script lang="ts">
    import {iconMeta, profileBanner} from "$lib/model";
    import {galleryAssetBaseUrl, contactEmail} from "$/config";
    import type {ImageAuthor} from "$lib/model/types";

    interface ImageCredit {
        name: string,
        link: string
        author: ImageAuthor
    }

    const imageCredits = <ImageCredit[]>[
        { name: "Profile banner", link: galleryAssetBaseUrl + profileBanner.original.src, author: profileBanner.author },
        { name: "Favicon and derivatives", link: "/favicon.png", author: iconMeta.author }
    ]

    interface IconCredit {
        name: string,
        url: string
    }

    const iconCredits = <IconCredit[]>[
        { name: "Simple Icons", url: "https://github.com/simple-icons/simple-icons/blob/master/LICENSE.md" },
        { name: "Dashicons", url: "https://github.com/WordPress/dashicons/blob/master/LICENSE" }
    ]

</script>

<div class="content">
    <a href="/" class="button">Back to home</a>
    <hr class="default">
    <h2>Contact</h2>
    You can contact this site's administrator using the following email address:<br>
    <a href="mailto:{contactEmail}">{contactEmail}</a>
    <hr class="default">
    <h2>Copyright Notices</h2>
    <p>
        <span class="font-weight-bold">Used Images</span>
        {#each imageCredits as imageCredit}
            <div><a href={imageCredit.link}>{imageCredit.name}</a> - made by <a href={imageCredit.author.url}>{imageCredit.author.name}</a></div>
        {/each}
    </p>
    <p>
        <span class="font-weight-bold">Used Iconsets</span>
        {#each iconCredits as iconCredit}
            <div><a href={iconCredit.url}>{iconCredit.name}</a></div>
        {/each}
    </p>
    <hr class="default">
</div>

<style lang="scss">
    .content {
        width: 100%
    }
</style>