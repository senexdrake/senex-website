<script lang="ts">
    import type {LinkItem} from "$model/types";

    const bigLinks: LinkItem[] = [
        { name: 'Twitter', target: 'https://senex.link/tw-fur', order: 1 },
        { name: 'Itaku', target: 'https://senex.link/itaku', order: 2 },
        { name: 'FurAffinity', target: 'https://senex.link/fa', order: 3 },
        { name: 'Mastodon', target: 'https://senex.link/mastodon', order: 4 },
        { name: 'Telegram', target: 'https://senex.link/telegram', order: 5 },
        { name: 'Character References', target: 'https://senex.link/senex-refs', order: 100 }
    ]

    const smallLinks: LinkItem[] = [
        { name: 'Steam', target: 'https://senex.link/steam', order: 10 },
        { name: 'E-Mail', target: 'mailto:fa@arisendrake.de', order: 11 },
        { name: 'Furry Network', target: 'https://senex.link/fn', order: 12 },
    ]

    const allLinks = bigLinks.concat(smallLinks).sort((a, b) => a.order - b.order)

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

    .button {
        box-sizing: border-box;
        background-color: var(--color-btn-1);
        color: #fff;

        @include mixins.whenDark() {
            color: $color-text-dark;
        }

        background-image: linear-gradient(45deg, var(--color-btn-2) 0%, var(--color-btn-1) 75%);
        text-decoration: none;
        display: inline-flex;
        height: 3rem;
        line-height: 3rem;
        padding: 0 1rem;
        vertical-align: middle;
        font-size: 1.125em;
        flex-direction: row-reverse;
        justify-content: center;
        border-radius: 1rem;
        transition: color 0.25s ease, background-color 0.25s ease, border-color 0.25s ease;

        &:hover {
            background-color: $color-btn-hover;
            @include mixins.whenDark() {
              background-color: $color-btn-hover-dark;
            }
        }
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
