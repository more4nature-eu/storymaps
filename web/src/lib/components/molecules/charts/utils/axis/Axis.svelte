<script lang="ts">
 interface AxisProps {
    scale:any;
    placement?: 'bottom' | 'left' | 'top' | 'right';
    position?: 'inside' | 'outside';
    gridlines?: boolean;
    showDomain?: boolean;
    chartWidth?: number;
    chartHeight?: number;
    formatTick?: (d:any) => string | number;
    rotateLabels?: 'auto' | 'none' | '90' | '45';
    ticksCount?: number;
  }

  let { 
    scale,
    placement = 'bottom',
    position = 'outside',
    gridlines = true,
    showDomain= false,
    chartWidth = 0,
    chartHeight = 0,
    formatTick = (d:any) => d,
    rotateLabels = 'none',
    ticksCount = 2
  }: AxisProps = $props();

  let isVertical = $derived(placement === 'left' || placement === 'right');

  let ticks = $derived(
    scale && scale.ticks ? scale.ticks(ticksCount) : (scale ? scale.domain() : [])
  );

  let rotationAngle = $derived(
    rotateLabels === 'auto' && !isVertical && ticks.length > 8 ? 45:
    rotateLabels === '45' ? 45 :
    rotateLabels === '90' ? 90 : 0
  );

  let offset = $derived(position == 'outside' ? 15 : -12);
</script>

{#if scale}
    <g class="axis-container" class:vertical={isVertical}>
      {#if showDomain}
          {#if placement === 'bottom'}
            <line class="domain-line" x1={0} x2={chartWidth} y1={chartHeight} y2={chartHeight}/>
          {:else if placement === 'left' || placement === 'right'}
            <line class="domain-line" x1={0} x2={0} y1={0} y2={chartHeight}/>
          {/if}
      {/if}

      {#each ticks as tick}
        {@const xPos = isVertical 
          ? (placement === 'left' ? 0 : chartWidth) 
          : scale(tick) + (scale.bandwidth ? scale.bandwidth() / 2 : 0)}
        
        {@const yPos = isVertical 
          ? scale(tick) + (scale.bandwidth ? scale.bandwidth() / 2 : 0) 
          : (placement === 'bottom' ? chartHeight : 0)}

        <g class="tick" transform="translate({xPos},{yPos})">
          {#if gridlines}
            <line
              class="gridline"
              x2={isVertical ? (placement === 'left' ? chartWidth : -chartWidth) : 0}
              y2={isVertical ? 0 : (placement === 'bottom' ? -chartHeight : chartHeight)}
            />
          {/if}

          <text
            y={isVertical ? 0 : (placement === 'bottom' ? offset : -offset)}
            x={isVertical ? (placement === 'left' ? -offset : offset) : 0}
            dx={rotationAngle > 0 ? (rotationAngle === 90 ? "-0.5em" : "-0.3em") : 0}
            dy={rotationAngle > 0 ? "0.5em" : (isVertical ? "0.32em" : "0.71em")}
            text-anchor={rotationAngle > 0 ? 'start' : isVertical ? (placement === 'left' ? 'end' : 'start') : 'middle'}
            dominant-baseline={isVertical ? 'middle' : rotationAngle > 0 ? 'middle' : placement === 'bottom' ? 'hanging' : 'baseline'}
            transform={rotationAngle > 0 ? `rotate(${rotationAngle})` : null}
          >{formatTick(tick)}</text>
        </g>
      {/each}
    </g>
{/if}


<style>
  .domain-line {
    stroke: #101010;
    stroke-width: 2px;
  }
  
  .tick text {
    font-size:  0.7rem;
    fill: #666;
    user-select: none;
  }

  .gridline {
    stroke: #e5e7eb; 
    z-index: -1;
  }
</style>