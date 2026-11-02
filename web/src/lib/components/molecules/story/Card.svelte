<script lang="ts">
  import LegendItem from '$lib/components/molecules/legends/LegendItem.svelte';
  import type { Chapter } from '$lib/types/chapter';
  import ImgContainerNoFade from '../images/ImgContainerNoFade.svelte';
  import Legend from '../legends/Legend.svelte';

    let {
        step,
        active = false,
        oncta
    }: {
        step: Chapter;
        active?: boolean;
        oncta?: () => void;
    } = $props();

    const Graphic = $derived(step.graphic);
</script>
{#if step.special}
    <article class="full-w" class:active>
        {#if step.title}
            <h2>{step.title}</h2>
        {/if}

        {#if step.text}
            <p class="text">{@html step.text}</p>
        {/if}

        {#if step.media?.src}
            <div class="media">
                <ImgContainerNoFade imgSrc={step.media.src} alt={step.media?.alt} size="wide" caption={step.media?.caption} credits={step.media?.credits} />
            </div>
        {/if}

        {#if Graphic}
            <div class="graphic"><Graphic /></div>
        {/if}

        {#if step.legend}
            <div class="legend">
            <Legend title={step.legend.title}>
                {#each step.legend.items as item (item.label)}
                <LegendItem label={item.label} color={item.color} type="square" />
                {/each}
            </Legend>
            </div>
        {/if}

        {#if step.cta}
            <button class="cta" onclick={oncta}>{step.cta}</button>
        {/if}
    </article>
{:else}
    <article class="card" class:active>
        {#if step.title}
            <h2>{step.title}</h2>
        {/if}

        {#if step.text}
            <p class="text">{@html step.text}</p>
        {/if}

        {#if step.media?.src && !step.special}
            <ImgContainerNoFade imgSrc={step.media.src} alt={step.media?.alt} size="wide" />
        {/if}

        {#if Graphic}
            <div class="graphic"><Graphic /></div>
        {/if}

        {#if step.legend}
            <div class="legend">
            <Legend title={step.legend.title}>
                {#each step.legend.items as item (item.label)}
                <LegendItem label={item.label} color={item.color} type="square" />
                {/each}
            </Legend>
            </div>
        {/if}
        {#if step.cta}
            <button class="cta" onclick={oncta}>{step.cta}</button>
        {/if}
    </article>
{/if}

<style>
    .card {
        position: relative;
        flex: none;
        box-sizing: border-box;
        width: min(420px, 34vw);
        padding: .2rem .4rem;
        color: var(--text-main);
        font-family: var(--font-sans);
        text-align: left;
        pointer-events: auto;
        transform: translateY(10px);
        transition: opacity 0.5s ease, transform 0.5s ease;
    }

    .full-w {
        flex: none;              
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100vw;
        margin-inline: calc(50% - 50vw);
        padding: 4rem 1rem;
        background-color: var(--bg-color);
        border: none;
        border-radius: 0;
        box-shadow: none;
        transform: none;
        pointer-events: auto;
        font-family: var(--font-serif);
    }

    .full-w .text {
        max-width: 600px;
        margin: 0 auto;
        padding: 0.2rem 0;
        font-size: 1.05rem;
        line-height: 1.5;
    }

    .full-w .media {
        width: min(100%, 900px);
    }

    h2 {
        margin: 0 0 0.4rem;
        padding: 0;
    }

    .text {
        margin: 0;
        padding: 0.2rem 0;
        font-size: 1.05rem;
        line-height: 1.5;
    }

    .text :global(mark) {
        --mark-color: var(--forest, #2d5a27);
        --mark-text: var(--bg-color);

        background-color: transparent;
        color: var(--text-main);
        background-image: linear-gradient(var(--mark-color), var(--mark-color));
        background-repeat: no-repeat;
        background-position: 0 90%;
        background-size: 0% 100%;
        padding: 0 0.15em;
        box-decoration-break: clone;
        -webkit-box-decoration-break: clone;
        transition: background-size 1.1s ease 0.5s, color 0.4s ease 1s;
    }
    .text :global(mark.loss)  { --mark-color: #c7d168; }

    .card.active .text :global(mark),
    .full-w.active .text :global(mark) {
        background-size: 100% 100%;
        color: var(--mark-text);
    }

    .cta {
        margin-top: 0.75rem;
        padding: 0.5rem 0.85rem;
        background-color: var(--forest, #2d5a27);
        color: #fff;
        border: none;
        border-radius: 6px;
        font-family: var(--font-sans);
        font-size: 0.85rem;
        font-weight: 700;
        cursor: pointer;
        transition: transform 0.2s ease, background-color 0.2s ease;
    }

    .cta:hover {
        transform: translateY(-2px);
        background-color: var(--text-main);
    }

    @media (max-width: 767px) {
        .card {
            width: 100%;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .card,
        .text :global(mark) {
            transition: none;
        }
    }
</style>