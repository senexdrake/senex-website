<script lang="ts">
    import type {LinkItem} from "$model/types";
    import {stripTrailingSlash} from "$lib/util-shared";

    const shortLinkBase = "https://zdrake.eu"
    
    const addBaseUrl = (target: string) => stripTrailingSlash(shortLinkBase) + target
    const processLinkTarget = (item: LinkItem) => {
        if (!item.target.startsWith("/")) return
        item.target = addBaseUrl(item.target)
    }
    
    const bigLinks: LinkItem[] = [
        { name: 'Twitter', target: '/tw-fur', order: 1 },
        { name: 'Itaku', target: '/itaku', order: 2 },
        { name: 'FurAffinity', target: '/fa', order: 3 },
        { name: 'Mastodon', target: '/mastodon', order: 4 },
        { name: 'BlueSky', target: '/bsky-fur', order: 5 },
        { name: 'Telegram', target: '/telegram', order: 8 },
        { name: 'Character References', target: '/senex-refs', order: 100 }
    ]

    const smallLinks: LinkItem[] = [
        { name: 'Steam', target: '/steam', order: 10 },
        { name: 'E-Mail', target: 'mailto:furry@zdrake.eu', order: 11 },
        { name: 'Furry Network', target: '/fn', order: 12 },
    ]

    const allLinks = bigLinks.concat(smallLinks).sort((a, b) => a.order - b.order)

    allLinks.forEach(processLinkTarget)

    const discordName = "@arisendrake"

</script>

<section>
    <ul id="big-links">
        {#each allLinks as link}
            <li class="link">
                <a href="{link.target}" class="button">
                    <span>{link.name}</span>
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
        Or contact me on Discord: <span class="font-weight-bold" id="discord-name">{discordName}</span><br>
        (please, Discord, give us a linkable URL...)
    </div>
</section>

<style lang="scss">
    @use "$styles/variables" as *;
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

    //#small-links {
    //    display: flex;
    //    flex-direction: row;
    //    a {
    //        border-radius: 50%;
    //    }
    //}


    #big-links {
        margin: 0;
        padding: 0;
        display: grid;

        grid-template-columns: 1fr;
        @include mixins.breakpoint($big-links-breakpoint) {
            grid-template-columns: 1fr 1fr;
        }
        grid-auto-flow: dense;
        align-items: start;

        gap: 1rem;

        .link {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }
    }
</style>
