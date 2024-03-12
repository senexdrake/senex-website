<script lang="ts">
    import {faviconCatalogue, iconCatalogue} from "$model";
    import { galleryAssetBaseUrl, defaultTitle, defaultDescription } from "../config";
    import {page} from "$app/stores";
    import type {IconExport, Metadata, MetadataImage} from "$model/types";
    import {stripTrailingSlash} from "$lib/util-shared";
    import {publicUrl} from "../lib/app-info";

    $: pageData = $page.data as Metadata|undefined


    $: normalFavIcons = faviconCatalogue.filter((icon: IconExport) => [32, 48, 96, 192, 512].includes(icon.width))
    $: appleFavIcon = faviconCatalogue.filter((icon: IconExport) => [167, 180].includes(icon.width))

    const mastodonLinks = [
        "https://wobbl.xyz/@zdrake",
        "https://meow.social/@senex"
    ]
    const basePath = publicUrl
    let url: string
    $: url = basePath + $page.url.pathname
    const baseImagePath = galleryAssetBaseUrl

    let title: string
    $: title = pageData?.title ?? defaultTitle

    let description: string
    $: description = pageData?.description ?? defaultDescription

    const defaultImages = iconCatalogue
        .filter(icon => icon.type.includes('profile'))
        .filter(icon => icon.format == 'png')
        .map((icon) => {
            return <MetadataImage>{
                height: icon.height,
                width: icon.width,
                alt: "Senex's Profile",
                url: stripTrailingSlash(publicUrl) + baseImagePath + icon.name,
                type: "image/" + icon.format
            }
    })

    let images: MetadataImage[]
    $: images = pageData?.images ?? defaultImages


    let primaryImage: MetadataImage
    $: primaryImage = images.find((image) => image.type == "image/png") ?? images[images.length - 1]

    let cardType: string
    $: cardType = pageData?.cardType ?? "summary"

    let creator: string
    $: creator = pageData?.creator ?? "@senexAD"
</script>

<svelte:head>
    <title>{title}</title>
    {#each normalFavIcons as icon}
        <link rel="icon" href="/{icon.name}" sizes="{icon.width}x{icon.height}" type="image/{icon.format}">
    {/each}
    {#each appleFavIcon as icon}
        <link rel="apple-touch-icon" href="/{icon.name}" sizes="{icon.width}x{icon.height}" type="image/{icon.format}">
    {/each}
    {#each mastodonLinks as mastodonLink}
        <link rel="me" href={mastodonLink}>
    {/each}
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

    <meta property="profile:first_name" content="ZenDrake" />
    <meta property="profile:last_name" content="the Dragon" />
    <meta property="profile:username" content="ZenDrake" />
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