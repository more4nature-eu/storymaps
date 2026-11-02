<script lang="ts">
    import type { Snippet } from "svelte";
    interface Props {title?: string, children: Snippet } 
    let { title, children } : Props = $props();
</script>

<div class="legend-container">
    {#if title}
        <h4 class="legend-title">{title}</h4>
    {/if}
    <div class="legend-items">
        {@render children()}
    </div>
</div>

<style>
    .legend-container {
        position: relative;
        margin-top: 0.5rem;
    }

    .legend-title {
        margin: 0 0 0.5rem 0;
        font-size: 0.75rem;
        font-weight: bold;
        text-transform: uppercase;
        color: var(--text-main);
        font-family: var(--font-sans);
        text-align: left;
    }

    .legend-items {
        display: flex;
        flex-wrap: wrap;
        gap: 0;
    }

    @media (max-width: 768px) {
        .legend-container {
            position: relative;
            margin-top: 0.85rem;
        }
        .legend-title {
            font-size: 0.95rem;
            margin-bottom:0.5rem;
        }
        .legend-items {
            display: flex;
            flex-direction: row; 
            flex-wrap: wrap;
            justify-content: left;
            align-items: left;
        }
    }
</style>