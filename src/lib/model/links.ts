import type {LinkItem} from "$model/types"
import {stripTrailingSlash} from "$lib/util-shared"
import {contactEmail} from "$/config"

// ----- ICONS -----
import IconX from 'virtual:icons/simple-icons/x'
import IconTelegram from 'virtual:icons/simple-icons/telegram'
import IconArt from 'virtual:icons/mdi/art'
import IconEmail from 'virtual:icons/mdi/email'
import IconMastodon from 'virtual:icons/simple-icons/mastodon'
import IconBluesky from 'virtual:icons/simple-icons/bluesky'
import IconFuraffinity from 'virtual:icons/local/furaffinity'
import IconSteam from 'virtual:icons/simple-icons/steam'
import IconItaku from 'virtual:icons/local/itaku'
import IconBarq from 'virtual:icons/local/barq-transparent'
import IconDiscord from 'virtual:icons/simple-icons/discord'
import {LinkType} from "$model/LinkType"
// ----- END ICONS -----

const shortLinkBase = "https://zdrake.net"
const addBaseUrl = (target: string) => stripTrailingSlash(shortLinkBase) + target

export const bigLinks: LinkItem[] = [
    { name: 'FurAffinity', target: '/fa', icon: IconFuraffinity },
    { name: 'BlueSky', target: '/bsky-fur', icon: IconBluesky },
    { name: 'Telegram', target: '/telegram', icon: IconTelegram },
    { name: 'X (Twitter)', target: '/tw-fur', icon: IconX },
    { name: 'Itaku', target: '/itaku', icon: IconItaku },
    { name: 'Mastodon', target: '/mastodon', icon: IconMastodon },

    { name: 'Character Refs', target: '/drake-refs', icon: IconArt, fullWidth: false },
    //{ name: "Discord", target: "/discord", order: 10 },
    { name: "BARQ!", target: "/barq", icon: IconBarq }
]
bigLinks.forEach(link => link.linkType = LinkType.BUTTON)

export const smallLinks: LinkItem[] = [
    { name: 'Steam', target: '/steam', icon: IconSteam },
    { name: 'E-Mail', target: `mailto:${contactEmail}`, icon: IconEmail },
    //{ name: 'Furry Network', target: '/fn', order: 120 },
]
smallLinks.forEach(link => link.linkType = LinkType.BUTTON_SMALL)

export const discordLink: LinkItem = { name: 'Discord', target: '/discord', icon: IconDiscord, linkType: LinkType.SPECIAL }

export const allLinks: LinkItem[] = [...bigLinks, ...smallLinks, discordLink]
export const allLinksCopy = () => allLinks.map(link => Object.assign({}, link))
export const processLinkTarget = (link: LinkItem) => {
    if (link.target.startsWith("/"))
        link.target = addBaseUrl(link.target)
}

allLinks.forEach(processLinkTarget)