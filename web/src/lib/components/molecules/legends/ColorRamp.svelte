<script lang="ts">
    let {
        title, 
        minLabel,
        maxLabel,
        colors = ["#ffeaa7", "#fab1a0", "#ff7675", "#d63031"],
        height = "10px"
    } = $props<{
        title?: string,
        minLabel: string,
        maxLabel: string, 
        colors?: string[],
        height?: string
    }>();

    let gradient = $derived(`linear-gradient(to right, ${colors.join(', ')})`);
</script>

<div class="color-ramp-container">
    {#if title}
        <div class="ramp-title">{title}</div>
    {/if}

    <div class="bar" style:background="{gradient}" style:height="{height}"></div>

    <div class="labels">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
    </div>

</div>

<style>
    .color-ramp-container {
        display: flex;
        flex-direction: column;
        gap: 4px;
        width: 50%;
        min-width: 150px;
    }
    .ramp-title {
        font-size: 0.75rem;
        font-weight: 600;
        color: #444;
    }
    .bar {
        width: 100%;
    }
    .labels {
        display: flex;
        justify-content: space-between;
        font-size: .7rem;
        color:#666;
    }
</style>