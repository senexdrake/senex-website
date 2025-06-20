<script lang="ts">
    import {faviconCatalogue, iconCatalogue} from "$model"
    import { galleryAssetBaseUrl, defaultTitle, defaultDescription, pwaThemeColor } from "$/config"
    import {page} from "$app/state"
    import {base} from "$app/paths"
    import type {IconExport, Metadata, MetadataImage} from "$model/types"
    import {stripTrailingSlash} from "$lib/util-shared"
    import {publicUrl} from "$lib/app-info"

    let pageData = $derived(page.data as Metadata|undefined)


    let normalFavIcons = $derived(faviconCatalogue.filter((icon: IconExport) => [32, 48, 96, 192, 512].includes(icon.width)))
    let appleFavIcon = $derived(faviconCatalogue.filter((icon: IconExport) => [167, 180].includes(icon.width)))

    const mastodonLinks = [
        "https://wobbl.xyz/@zdrake",
        "https://meow.social/@senex"
    ]

    const basePath = publicUrl
    let url: string = $derived(basePath + page.url.pathname)
    
    const baseImagePath = galleryAssetBaseUrl

    const defaultImages = iconCatalogue
        .filter(icon => icon.type.includes('profile'))
        .filter(icon => icon.format == 'png')
        .map((icon) => {
            return {
                height: icon.height,
                width: icon.width,
                alt: "Drake's Profile",
                url: stripTrailingSlash(publicUrl) + base + baseImagePath + icon.name,
                type: "image/" + icon.format
            } as MetadataImage
    })

    let title: string               = $derived(pageData?.title ?? defaultTitle)
    let description: string         = $derived(pageData?.description ?? defaultDescription)
    let images: MetadataImage[]     = $derived(pageData?.images ?? defaultImages)
    let primaryImage: MetadataImage = $derived(images.find((image) => image.type == "image/png") ?? images[images.length - 1])
    let cardType: string            = $derived(pageData?.cardType ?? "summary")
    let creator: string             = $derived(pageData?.creator ?? "@senexAD")
    
</script>

<svelte:head>
    <title>{title}</title>

    <link rel="manifest" href="{base}/app.webmanifest">

    <link rel="icon" href="{base}/favicon.ico" />
    <link rel="icon" href="{base}/favicon.png" />

    {#each normalFavIcons as icon (icon.name)}
        <link rel="icon" href="{base}/{icon.name}" sizes="{icon.width}x{icon.height}" type="image/{icon.format}">
    {/each}
    {#each appleFavIcon as icon (icon.name)}
        <link rel="apple-touch-icon" href="{base}/{icon.name}" sizes="{icon.width}x{icon.height}" type="image/{icon.format}">
    {/each}
    {#each mastodonLinks as mastodonLink (mastodonLink)}
        <link rel="me" href={mastodonLink}>
    {/each}
    <link rel="canonical" href={url}>
    <meta name="description" content={description} />

    <meta name="theme-color" content={pwaThemeColor}>

    <meta property="og:url" content={url} />
    <meta property="og:site_name" content={title} />
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="profile" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />

    {#each images as image (image.url)}
        <meta property="og:image" content={image.url} />
        <meta property="og:image:secure_url" content={image.url} />
        <meta property="og:image:alt" content={image.alt} />
        <meta property="og:image:width" content={image.width.toString()} />
        <meta property="og:image:height" content={image.height.toString()} />
        <meta property="og:image:type" content={image.type} />
    {/each}

    <meta property="profile:first_name" content="ZenDrake" />
    <meta property="profile:last_name" content="the Bull-Dragon" />
    <meta property="profile:username" content="ZenDrake" />
    <meta property="profile:gender" content="male" />

    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={primaryImage.url} />
    <meta name="twitter:image:alt" content={primaryImage.alt} />
    <meta name="twitter:site" content={creator} />
    <meta name="twitter:creator" content={creator} />
    <meta name="twitter:card" content={cardType} />
    <meta name="twitter:url" content={url} />
</svelte:head>