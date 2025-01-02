<script lang="ts">
    import type {LinkItem} from "$model/types"
    import {stripTrailingSlash} from "$lib/util-shared"
    import {contactEmail} from "$/config"

    // ----- ICONS -----
    import IconX from 'virtual:icons/simple-icons/x'
    import IconTelegram from 'virtual:icons/simple-icons/telegram'
    import IconArt from 'virtual:icons/dashicons/art'
    import IconEmail from 'virtual:icons/dashicons/email-alt'
    import IconMastodon from 'virtual:icons/simple-icons/mastodon'
    import IconBluesky from 'virtual:icons/simple-icons/bluesky'
    import IconFuraffinity from 'virtual:icons/local/furaffinity'
    import IconSteam from 'virtual:icons/simple-icons/steam'
    import IconItaku from 'virtual:icons/local/itaku'
    import IconBarq from 'virtual:icons/local/barq'
    import IconDiscord from 'virtual:icons/simple-icons/discord'
    // ----- END ICONS -----

    const shortLinkBase = "https://zdrake.net"
    
    const addBaseUrl = (target: string) => stripTrailingSlash(shortLinkBase) + target
    const processLinkTarget = (item: LinkItem) => {
        if (!item.target.startsWith("/")) return
        item.target = addBaseUrl(item.target)
    }

    const bigLinks: LinkItem[] = [
        { name: 'X (Twitter)', target: '/tw-fur', icon: IconX, order: 1 },
        { name: 'Itaku', target: '/itaku', icon: IconItaku, order: 21 },
        { name: 'FurAffinity', target: '/fa', icon: IconFuraffinity, order: 3 },
        { name: 'Mastodon', target: '/mastodon', icon: IconMastodon, order: 20 },
        { name: 'BlueSky', target: '/bsky-fur', icon: IconBluesky, order: 5 },
        { name: 'Telegram', target: '/telegram', icon: IconTelegram, order: 8 },
        { name: 'Character Refs', target: '/senex-refs', icon: IconArt, fullWidth: false, order: 1001 },
        //{ name: "Discord", target: "/discord", order: 10 },
        { name: "BARQ!", target: "/barq", order: 11, icon: IconBarq }
    ]

    const smallLinks: LinkItem[] = [
        { name: 'Steam', target: '/steam', icon: IconSteam, order: 100 },
        { name: 'E-Mail', target: `mailto:${contactEmail}`, icon: IconEmail, order: 110 },
        //{ name: 'Furry Network', target: '/fn', order: 120 },
    ]

    const allLinks = bigLinks.concat(smallLinks).sort((a, b) => a.order - b.order)

    allLinks.forEach(processLinkTarget)

    const discordName = "@zdrakee"

</script>

<section>
    <ul id="big-links">
        {#each allLinks as link}
            <li class="link" class:full-width={link.fullWidth}>
                <a href="{link.target}" class="button flex-row">
                    {#if link.icon}
                        <span class="left link-icon"><link.icon/></span>
                    {:else}
                        <span class="left"></span>
                    {/if}
                    <span class="center">{link.name}</span>
                    <span class="right"></span>
                </a>
            </li>
        {/each}
    </ul>
<!--    <hr>-->
<!--    <div id="small-links">-->
<!--        {#each smallLinks as link}-->
<!--            <a href="{link.target}" class="button">-->
<!--                <span>{link.icon}</span>-->
<!--            </a>-->
<!--        {/each}-->
<!--    </div>-->
    <div class="text-center" id="discord">
        Or contact me on <a href={addBaseUrl("/discord")}>Discord <span id="discord-icon"><IconDiscord /></span></a>: <span class="font-weight-bold" id="discord-name">{discordName}</span><br>
        (please, Discord, give us a good linkable URL...)
    </div>
</section>

<style lang="scss">
    @use "$styles/variables" as vars;
    @use "$styles/mixins";

    section {
      width: 100%;
    }

    @media (min-width: 650px) {
      .link:nth-of-type(2n + 1) {
        grid-column: 1;
      }
    }

    #discord {
        margin-top: 2rem;
    }

    #discord-name {
        line-height: 2em;
    }

    #discord-icon {
      display: inline-flex;
      font-size: 1.1em;
      vertical-align: text-bottom;
      align-items: center;
    }

    .left, .right {
      flex: 1
    }

    #big-links {
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: 1fr;
        grid-auto-flow: dense;
        align-items: start;
        gap: 1rem;

        @include mixins.breakpoint(vars.$big-links-breakpoint) {
            grid-template-columns: 1fr 1fr;
            .full-width {
                grid-column: 1/span 2;
            }
        }

        .link {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }


        .link-icon {
            font-size: 1.3em;
            height: 100%;
            align-items: center;
            display: flex;
        }
    }
</style>
