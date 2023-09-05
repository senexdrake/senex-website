<script lang="ts">
    import {iconCatalogue} from "$model";
    import { galleryAssetDir } from "$/config";
    import {page} from "$app/stores";
    import type {IconExport, Metadata, MetadataImage} from "$model/types";
    import {PUBLIC_BASE_PATH} from "$env/static/public";
    import {addTrailingSlash} from "$lib/util-shared";

    $: pageData = $page.data as Metadata|undefined


    $: normalFavIcons = iconCatalogue.filter((icon: IconExport) => [16, 32, 48, 192].includes(icon.width))
    $: appleFavIcon = iconCatalogue.filter((icon: IconExport) => [167, 180].includes(icon.width))

    const mastodonLink = "https://meow.social/@senex"
    const basePath = PUBLIC_BASE_PATH
    const url = basePath + $page.url.pathname
    const baseImagePath = galleryAssetDir

    let title: string
    $: title = pageData?.title ?? "Senex, the big Dragon"

    let description: string
    $: description = pageData?.description ?? "An overview of ways to find and contact the big Dragon!"


    const defaultImages = iconCatalogue.filter(icon => icon.name.startsWith('senex-profile')).map((icon) => {
        return <MetadataImage>{
            height: icon.height,
            width: icon.width,
            alt: "Senex's Profile",
            url: addTrailingSlash(PUBLIC_BASE_PATH) + baseImagePath + icon.name,
            type: "image/" + icon.format
        }
    })

    let images: MetadataImage[]
    $: images = pageData?.images ?? defaultImages


    let primaryImage: MetadataImage
    $: primaryImage = images.find((image) => image.type == "image/png")

    let cardType: string
    $: cardType = pageData?.cardType ?? "summary"

    let creator: string
    $: creator = pageData?.creator ?? "@senexAD"
</script>

<svelte:head>
    <title>{title}</title>
    {#each normalFavIcons as icon}
        <link rel="icon" href="./{icon.name}" sizes="{icon.width}x{icon.height}" type="image/{icon.format}">
    {/each}
    {#each appleFavIcon as icon}
        <link rel="apple-touch-icon" href="./{icon.name}" sizes="{icon.width}x{icon.height}" type="image/{icon.format}">
    {/each}
    <link rel="me" href={mastodonLink}>
    <link rel="canonical" href={url}>
    <meta name="description" content={description} />

    <meta property="og:url" content={url} />
    <meta property="og:site_name" content={title} />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="profile" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />

    {#each images as image}
        <meta property="og:image" content="{image.url}" />
        <meta property="og:image:alt" content={image.alt} />
        <meta property="og:image:width" content={image.width.toString()} />
        <meta property="og:image:height" content={image.height.toString()} />
        <meta property="og:image:type" content={image.type} />
    {/each}

    <meta property="profile:first_name" content="Senex" />
    <meta property="profile:last_name" content="the Dragon" />
    <meta property="profile:username" content="senex" />
    <meta property="profile:gender" content="male" />

    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content="{primaryImage.url}" />
    <meta name="twitter:image:alt" content={primaryImage.alt} />
    <meta name="twitter:site" content={creator} />
    <meta name="twitter:creator" content={creator} />
    <meta name="twitter:card" content={cardType} />
    <meta name="twitter:url" content={url} />
</svelte:head>