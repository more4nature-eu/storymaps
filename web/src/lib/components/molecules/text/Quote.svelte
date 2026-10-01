<!-- FocusQuote.svelte -->
<script lang="ts">
    import { onMount } from 'svelte';
    import type { Snippet } from 'svelte';

    interface Props {
        author?: string;
        role?: string;
        children?: Snippet;
    }

    let { author, role, children }: Props = $props();
    let quoteRef = $state<HTMLElement | null>(null);
    let isActive = $state(false);

    onMount(() => {
        if (!quoteRef) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                isActive = entry.isIntersecting;
            },
            {
                rootMargin: '-30% 0px -30% 0px',
                threshold: 0.4
            }
        );

        observer.observe(quoteRef);
        return () => observer.disconnect();
    });
</script>

<figure bind:this={quoteRef} class="focus-quote" class:active={isActive}>
    <div class="blockquote-custum">
        {#if children}
            {@render children()}
        {/if}
    </div>

    {#if author}
        <figcaption class="fig-custum">
            <strong class="name">{author}</strong>{#if role}<span class="role">  —  {role}</span>{/if}
        </figcaption>
    {/if}
</figure>

<style>
    .focus-quote {
        position: relative;
        width: 100%;
        margin: clamp(1.5rem, 5vw, 2rem) 0;
        padding: 0.5rem 0;
        opacity: 0.35;
        transform: scale(0.98);
        transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), 
                    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: opacity, transform;
    }

    .focus-quote.active {
        opacity: 1;
        transform: scale(1);
    }

    .blockquote-custum {
        margin: 0 !important;
        padding: 0 !important;
        border: none !important;
        padding-left:0 !important;
        font-family: var(--font-serif);
        font-size: clamp(1.45rem, 1.2rem + 0.6vw, 2rem);
        line-height: 1.4;
        color: var(--text-main);
        font-weight: 700;
    }

    .blockquote-custum :global(p) {
        margin: 0 !important;
        padding: 0 !important;
        padding-left:0 !important;
        border: none !important;
        font-family: inherit;
        font-size: inherit;
        line-height: inherit;
    }

    .fig-custum {
        margin-top: 1rem;
        font-family: var(--font-sans);
        font-size: 0.875rem;
        color: var(--text-muted);
    }

    .name {
        color: var(--text-main);
        font-weight: 700;
    }
    :global(.text-wrapper > *) {
        transition: opacity 0.7s ease, filter 0.7s ease;
    }
</style>