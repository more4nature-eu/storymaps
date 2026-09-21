<script lang="ts">
    let {
        title, 
        steps = [10, 20, 40], 
        labels = [], 
        color = '#444' 
    } = $props<{
        title ?: string,
        steps: number[],
        labels ?: string[],
        color ?: string
    }>();

    const sortedSteps = $derived([...steps].sort((a, b) => b - a));
    
    const maxSize = $derived(Math.max(...steps));
</script>

<div class="size-legend">
    {#if title}
        <div class="legend-title">{title}</div>
    {/if}

    <div class="nested-container" style:width="{maxSize}px" style:height="{maxSize}px">
        
        {#each sortedSteps as size, i}
            <div   
                class="circle"
                style:width="{size}px"
                style:height="{size}px"
                style:background-color={color}
                style:border-color={color}
                style:z-index={i} 
            ></div>

            {#if labels}
                <div 
                    class="label-group" 
                    style:bottom="{size}px"
                    style:left="50%"
                    style:width="{maxSize/2 + 20}px" 
                >
                    <div class="line" style:background-color={color}></div>
                    
                    <span class="label">
                        {labels[steps.indexOf(size)]}
                    </span>
                </div>
            {/if}
        {/each}
    </div>
</div>

<style>
    .size-legend {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
        position: relative;
    }

    .legend-title {
        font-size: 0.75rem;
        font-weight: 600;
        color: #444;
        margin-bottom: 4px;
    }

    .nested-container {
        position: relative;
        margin: 0 auto;
    }

    .circle {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        border-radius: 50%;
        border: 1px solid;
        opacity: 0.2; 
        box-sizing: border-box;
    }

    .label-group {
        position: absolute;
        display: flex;
        align-items: end;
    }

    .line {
        flex-grow: 1;
        height: 1px;
        opacity: 0.6;
        margin-right: 4px;
    }

    .label {
        font-size: 0.7rem;
        color: #666;
        white-space: nowrap;
        transform: translateY(5px);
    }
</style>