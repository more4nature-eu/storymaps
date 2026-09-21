<script lang="ts">
    import type { Snippet } from "svelte";
    let { title, children } = $props<{ title?: string, children: Snippet }>();
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
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 1.5rem auto 0 auto; 
        width: fit-content;
        pointer-events: auto;
    }

    .legend-title {
        margin: 0 0 0.5rem 0;
        font-size: 0.75rem;
        font-weight: bold;
        text-transform: uppercase;
        color: var(--bg-color, #243B4A);
        text-align: center;
    }

    .legend-items {
        display: flex;
        flex-direction: row; 
        flex-wrap: wrap; 
        justify-content: center;
        align-items: center;
        gap: 1rem; 
    }

    @media (max-width: 768px) {
        .legend-container {
            margin-top: .5rem;
        }
        .legend-title {
            font-size: 0.85rem;
            margin-bottom: 0.5rem;
        }
        .legend-items {
            gap: 0.5rem;
        }
    }
</style>