<script lang="ts">
    import senexProfile from '$lib/images/senex-profile.webp';
    import senexProfileFallback from '$lib/images/senex-profile.png';
    import {page} from "$app/stores";
    import type {Metadata, MetadataImage} from "$lib/model/types";
    import {PUBLIC_BASE_PATH} from "$env/static/public";

    $: pageData = $page.data as Metadata|undefined

    const mastodonLink = "https://meow.social/@senex"
    const basePath = PUBLIC_BASE_PATH ?? "https://example.com"
    const url = basePath + $page.url.pathname

    let title: string
    $: title = pageData?.title ?? "Senex, the big Dragon"

    let description: string
    $: description = pageData?.description ?? "An overview of ways to find and contact the big Dragon!"

    let primaryImage: MetadataImage
    $: primaryImage = pageData?.image ?? {
        url: senexProfileFallback,
        height: 600,
        width: 600,
        alt: "Senex's profile picture",
        type: "image/png"
    }

    let images: MetadataImage[]
    $: images = pageData?.images ?? [
        { url: senexProfile, height: 600, width: 600, alt: "Senex's profile picture", type: "image/webp" },
        primaryImage
    ]

    let cardType: string
    $: cardType = pageData?.cardType ?? "summary"

    let creator: string
    $: creator = pageData?.creator ?? "@senexAD"
</script>

<svelte:head>
    <title>{title}</title>
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
        <meta property="og:image" content="{basePath}{image.url}" />
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
    <meta name="twitter:image" content="{basePath}{primaryImage.url}" />
    <meta name="twitter:image:alt" content={primaryImage.alt} />
    <meta name="twitter:site" content={creator} />
    <meta name="twitter:creator" content={creator} />
    <meta name="twitter:card" content={cardType} />
    <meta name="twitter:url" content={url} />
</svelte:head>