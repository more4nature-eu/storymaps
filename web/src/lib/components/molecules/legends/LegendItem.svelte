<script lang="ts">
    let {
        label,
        color = '#000',
        type = 'square',
        variant = 'solid',
        size = 'md',
        opacity = 1,
        faded = false,
        onHover,
        onLeave,
        onClick
    } = $props<{
        label: string
        color: string,
        type ?: 'square' | 'circle' | 'line' | 'rect',
        variant ?: 'solid' | 'outline' | 'dashed',
        size ?: 'sm' | 'md' | 'lg',
        opacity ?: number,
        faded ?: boolean,
        onHover ?: () => void,
        onLeave ?: () => void,
        onClick ?: () => void,
    }>();

    const sizeMap = {
        sm: '8px',
        md: '12px',
        lg: '16px'
    };

    const cssSize = '12px';

</script>

<button 
    class="legend-item"
    class:is-faded = {faded}
    onmouseenter={onHover}
    onmouseleave={onLeave}
    onclick={onClick}
    tabindex="0">
    <div
        class="symbol"
        class:is-circle = {type === 'circle'}
        class:is-line = {type === 'line'}
        class:is-rect = {type === 'rect'}

        style:--color = {color}
        style:--size = {cssSize} 
        style:--opacity = {opacity}
        style:--border-style = {variant === 'dashed' ? 'dashed' : 'solid'}
        
        style:--bg-color = {variant === 'outline' ? `color-mix(in srgb, ${color} ${opacity * 100}%, transparent)` : color}
        style:--border-width={variant === 'outline' ? '2px' : (type === 'line' ? '2px' : '0px')}
        >
    </div>
    <span class="label">{label}</span>
</button>

<style>
    .legend-item {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
        font-size: 0.85rem;
        color: var(--neutral);
        transition: opacity 0.3s ease;
        border: none;
        background-color: transparent;
    }

    .legend-item.is-faded {
        opacity:0.25;
    }

    .symbol {
        width: var(--size); 
        height: var(--size);
        background-color: var(--bg-color);
        border-color: var(--color);
        border-width: var(--border-width);
        border-style: var(--border-style); 
        box-sizing: border-box;
    }

    .is-circle {
        border-radius: 50%;
    }

    .is-rect {
        width: calc(var(--size) * 1.6);
    }

    .is-line {
        height: 0;
        background-color: transparent;
        border-top-width: 2px;
        border-top-style: var(--border-style);
        width: calc(var(--size) * 2);
        border-color: var(--color);
        opacity: var(--opacity);
    }

    @media (max-width:768px) {
        .label {
            font-size: .8rem;
        }
    }
</style>