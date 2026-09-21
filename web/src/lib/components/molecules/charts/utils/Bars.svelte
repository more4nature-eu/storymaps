<script lang="ts">
    import { getContext } from "svelte";

    const {data, xScale, yScale, xAccessor, yAccessor, height} = getContext<any>('chart-context');

    export let color= '#3b82f6'
</script>

<g class="bars">
    {#each $data as d}
        <rect 
            x={$xScale($xAccessor(d))}
            y={$yScale($yAccessor(d))}
            width={$xScale.bandwidth()}
            height={$height - $yScale($yAccessor(d))}
            fill= {color}
            class='bar'/>
    {/each}
</g>
<style>
    .bar:hover {
        fill:orangered;
        cursor:pointer;
    }
</style>

