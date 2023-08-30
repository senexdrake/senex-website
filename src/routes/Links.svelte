<script lang="ts">
    import type {LinkItem} from "@/types";
    import '@styles/styles.scss';

    const links: LinkItem[] = [
        { name: 'Twitter', target: 'https://senex.link/tw-fur' },
        { name: 'Itaku', target: 'https://senex.link/itaku' },
        { name: 'FurAffinity', target: 'https://senex.link/fa' },
        { name: 'Furry Network', target: 'https://senex.link/fn' },
        { name: 'Mastodon', target: 'https://senex.link/mastodon' },
        { name: 'Telegram', target: 'https://senex.link/telegram' },
        { name: 'Steam', target: 'https://senex.link/steam' },
        { name: 'E-Mail', target: 'mailto:fa@arisendrake.de' },
        { name: 'Character References', target: 'https://senex.link/senex-refs' }
    ]
</script>

<section>
    <ul id="link-container">
        {#each links as link}
            <li class="link">
                <a href="{link.target}" class="button">
                    <span>{link.name}</span>
                </a>
            </li>
        {/each}
    </ul>


</section>

<style lang="scss">
    @import "@styles/breakpoints";

    section {
      width: 100%;
    }

    .button {
      background-color: rgb(51, 130, 94);
      color: rgb(232, 230, 227);
      background-image: linear-gradient(45deg, rgba(33, 37, 137, 0.77) 0%, rgba(51, 130, 94, 0.01) 75%);
    }

    @media (min-width: 650px) {
      .link:nth-of-type(2n + 1) {
        grid-column: 1;
      }
    }


    #link-container {
        padding: 0;
        display: grid;

        grid-template-columns: 1fr;
        @include breakpoint('sm') {
            grid-template-columns: 1fr 1fr;
        }
        grid-auto-flow: dense;
        align-items: start;

        gap: 1rem;

        .link {

            display: flex;
            flex-direction: column;
            justify-content: flex-end;

            * {
                box-sizing: border-box;
            }

            a {
                text-decoration: none;
                display: inline-flex;
                width: 100%;
                max-width: 100%;
                height: 3.75rem;
                line-height: 3.75rem;
                padding: 0 1.875rem;
                vertical-align: middle;
                font-family: 'Sora', sans-serif;
                font-size: 1.125em;
                font-weight: 300;
                border-radius: 2rem;
                flex-direction: row-reverse;
                justify-content: flex-end;
                transition: color 0.25s ease, background-color 0.25s ease, border-color 0.25s ease;
            }

            :hover {
              color: var(--color-theme-1);
            }
        }
    }
</style>
