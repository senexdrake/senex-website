<script lang="ts">
    import {discordLink} from "$model/links";
    import type {LinkItem} from "$model/types";

    let { links }: { links: LinkItem[] } = $props()

    //let bigLinks = links.filter(link => link.linkType === LinkType.BUTTON)
    //let smallLinks = links.filter(link => link.linkType === LinkType.BUTTON_SMALL)


    const discordName = "@zdrakee"
</script>

<section>
    <ul id="big-links">
        {#each links as link (link.name)}
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
        Or contact me on <a href={discordLink.target}>{discordLink.name} <span id="discord-icon"><discordLink.icon/></span></a>: <span class="font-weight-bold" id="discord-name">{discordName}</span><br>
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
