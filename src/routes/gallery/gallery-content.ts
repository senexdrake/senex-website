import type {ImageAuthor, ImageCategory} from "$lib/model/types";

import refsheetSfw from "$remoteAssets/refsheet-sfw.png?gallery&remote"
import refsheetSfwLarge from "$remoteAssets/refsheet-sfw.png?fullsize&remote"
import refsheetBulge from "$remoteAssets/refsheet-bulge.png?gallery&remote"
import refsheetBulgeLarge from "$remoteAssets/refsheet-bulge.png?fullsize&remote"
import refsheetNaked from "$remoteAssets/refsheet-naked.png?gallery&remote"
import refsheetNakedLarge from "$remoteAssets/refsheet-naked.png?fullsize&remote"

import cringeworthington1 from "$remoteAssets/ArisenDrake_BV1.png?gallery&remote"
import cringeworthington1Large from "$remoteAssets/ArisenDrake_BV1.png?fullsize&remote"
import phoneBgDeadAnthro from "$remoteAssets/phone-bg-deadanthro.png?gallery&remote"
import phoneBgDeadAnthroLarge from "$remoteAssets/phone-bg-deadanthro.png?fullsize&remote"

const additional: ImageCategory = {
    title: "Additional Art",
    description: "Art that I really like, but wouldn't use for references",
    images: [
        {
            title: "Hey there! Wanna join them?",
            description: 'Now would you look at that, a friendly giant! Using his... eh... equipment to bring joy!',
            nsfw: true,
            author: {
                name: 'Cringeworthington',
                url: 'https://www.furaffinity.net/user/cringeworthington/'
            },
            src: [...cringeworthington1, cringeworthington1Large]
        },
        {
            title: "Stop taking pictures, man!",
            description: "Don't you see that I am in a ... difficult situation right now with these tiny short?!",
            nsfw: true,
            author: {
                name: 'DeadAnthro',
                url: 'https://twitter.com/DeadAnthro'
            },
            src: [...phoneBgDeadAnthro, phoneBgDeadAnthroLarge]
        }
    ]
}

// TODO Implement proper seperation for references

const authorWolke: ImageAuthor = { name: "Wolke", url: "https://wolke.carrd.co" }
const references: ImageCategory = {
    title: "References",
    description: "References for Senex, my big Dragon",
    images: [
        {
            title: "Refsheet (SFW)",
            description: "SFW Refsheet for Senex. Refsheet is made by me, based on a 3D model",
            nsfw: false,
            author: authorWolke,
            src: [...refsheetSfw, refsheetSfwLarge],
        },
        {
            title: "Refsheet (NSFW, bulge)",
            description: "NSFW Refsheet for Senex (clothed with hyper bulge). Refsheet is made by me, based on a 3D model",
            nsfw: true,
            author: authorWolke,
            src: [...refsheetBulge, refsheetBulgeLarge],
        },
        {
            title: "Refsheet (NSFW, naked)",
            description: "NSFW Refsheet for Senex (naked with hyper genitals). Refsheet is made by me, based on a 3D model",
            nsfw: true,
            author: authorWolke,
            src: [...refsheetNaked, refsheetNakedLarge],
        },
        ...additional.images
    ]
}
export const categories = [references]