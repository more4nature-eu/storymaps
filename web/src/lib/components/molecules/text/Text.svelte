<script lang="ts">
    import type { Snippet } from 'svelte';

    interface Props {
        children?: Snippet;
    }

    let { children }: Props = $props();
</script>

<div class="text-wrapper">
    {#if children}
        {@render children()}
    {/if}
</div>

<style>
    .text-wrapper {
        position: relative;
        display: flex;
        flex-direction: column;
        gap: clamp(1.25rem, 2vw, 2rem);
        max-width: 600px;
        margin: clamp(1rem, 5vw, 2rem) auto;
        padding: 0 1rem;
    }
    .text-wrapper :global(p) {
        font-family: var(--font-serif);
        font-size: clamp(1.2rem, 1rem + 0.3vw, 1.1rem);
        font-weight: 400;
        letter-spacing: .02em;
        line-height: 1.7rem;
        margin: 0;
        padding: 0;
        text-align: left;
        -webkit-hyphens: auto;
        hyphens: auto;
    }
</style>