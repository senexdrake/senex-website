<script lang="ts">
    import {base} from "$app/paths"
    import {iconMeta, profileBanner} from "$lib/model"
    import {galleryAssetBaseUrl, contactEmail} from "$/config"
    import type {ImageAuthor} from "$lib/model/types"

    interface ImageCredit {
        name: string,
        link: string
        author: ImageAuthor
    }

    const imageCredits: ImageCredit[] = [
        { name: "Profile banner", link: galleryAssetBaseUrl + profileBanner.original.src, author: profileBanner.author },
        { name: "Favicon and derivatives", link: "/favicon.png", author: iconMeta.author }
    ].map(c => {
        c.link = base + c.link
        return c
    })

    interface IconCredit {
        name: string,
        url: string
    }

    const iconCredits: IconCredit[] = [
        { name: "Simple Icons", url: "https://github.com/simple-icons/simple-icons/blob/master/LICENSE.md" },
        { name: "Dashicons", url: "https://github.com/WordPress/dashicons/blob/master/LICENSE" }
    ]

    const customIcons = [
        'FurAffinity',
        'Itaku',
        'BARQ!'
    ]

</script>

<div class="content">
    <a href="{base}/" class="button">Back to home</a>
    <hr class="default">
    <h2>Contact</h2>
    You can contact this site's administrator using the following email address:<br>
    <a href="mailto:{contactEmail}">{contactEmail}</a>
    <hr class="default">
    <h2>Copyright Notices</h2>
    <div class="copyright-section">
        <span class="font-weight-bold">Used Images</span>
        <div id="image-credits">
        {#each imageCredits as imageCredit (imageCredit.name)}
            <div><a href={imageCredit.link}>{imageCredit.name}</a></div>
            <div>- original made by <a href={imageCredit.author.url}>{imageCredit.author.name}</a></div>
        {/each}
        </div>
    </div>
    <div class="copyright-section">
        <span class="font-weight-bold">Used Iconsets</span>
        {#each iconCredits as iconCredit (iconCredit.name)}
            <div><a href={iconCredit.url}>{iconCredit.name}</a></div>
        {/each}
        <br>
        <div>
            The icons for the following pages have been taken from their respective websites.<br>
            Please don't sue 😥
            <ul>
            {#each customIcons as icon (icon)}
                <li>{icon}</li>
            {/each}
            </ul>

        </div>
    </div>
    <hr class="default">
</div>

<style lang="scss">
    #image-credits {
        display: grid;
        grid-template-columns: max-content 1fr;
        column-gap: 1rem;
    }

    .content {
        width: 100%
    }

    .copyright-section {
        margin: 1rem 0;
    }
</style>