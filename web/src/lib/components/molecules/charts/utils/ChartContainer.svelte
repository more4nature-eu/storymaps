<script lang="ts">
    import { setContext, type Snippet } from "svelte";

    let {
        margin = { top: 10, right: 10, bottom: 30, left: 10 },
        height = 200,
        children
    } = $props<{
        margin?: { top: number; right: number; bottom: number; left: number };
        height?: number;
        children?: Snippet;
    }>();

    let width = $state(0);

    let w = $derived(Math.max(0, width - margin.left - margin.right));
    let h = $derived(Math.max(0, height - margin.top - margin.bottom));

    setContext('chart-context', {
        get width() { return w; },
        get height() { return h; },
        get margin() { return margin; }
    });
</script>

<div class="chart-wrapper" bind:clientWidth={width} bind:clientHeight={height}>
    {#if width > 0 && height > 0}
        <svg {width} {height}>
            <g transform="translate({margin.left}, {margin.top})">
                {#if children}
                    {@render children()}
                {/if}
            </g>
        </svg>
    {/if}
</div>

<style>
    .chart-wrapper {
        position: relative;
        width: 100%;
    }
    svg {
        display: block;
        overflow: visible;
    }
</style>