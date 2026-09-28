<script lang="ts">
    let {
        beforeImage,
        afterImage,
        beforeLabel = "1945",
        afterLabel = "Actual",
        initialPos = 50,
        alt = "Comparació d'imatges"
    } = $props<{
        beforeImage: string;
        afterImage: string;
        beforeLabel?: string;
        afterLabel?: string;
        initialPos?: number;
        alt?: string;
    }>();

    let sliderPos = $state(initialPos);
</script>

<div class="slider-container">
    <img src={afterImage} {alt} class="img-base" />
    {#if afterLabel}
        <span class="label right">{afterLabel}</span>
    {/if}

    <div class="img-overlay-wrapper" style="clip-path: inset(0 {100 - sliderPos}% 0 0);">
        <img src={beforeImage} {alt} class="img-overlay" />
        {#if beforeLabel}
            <span class="label left">{beforeLabel}</span>
        {/if}
    </div>

    <div class="divider" style="left: {sliderPos}%;">
        <div class="handle">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" stroke-width="2.5" fill="none">
                <path d="M8 7l-5 5 5 5M16 7l5 5-5 5" />
            </svg>
        </div>
    </div>

    <input
        type="range"
        min="0"
        max="100"
        bind:value={sliderPos}
        class="slider-input"
        aria-label="Llisca per comparar les dues imatges"
    />
</div>

<style>
    .slider-container {
        position: relative;
        width: 100%;
        aspect-ratio:9 / 16;
        overflow: hidden;
        user-select: none;
        background-color: transparent;
        max-width: 500px;
        max-height: fit-content;
        margin: auto;
    }

    .img-base,
    .img-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        pointer-events: none;
    }

    .img-overlay-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
    }
    .divider {
        position: absolute;
        top: 0;
        bottom: 0;
        width: 2px;
        background-color: #ffffff;
        transform: translateX(-50%);
        pointer-events: none;
        z-index: 10;
    }
    .handle {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #ffffff;
        color: #1a1a1a;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
    }
    .slider-input {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        margin: 0;
        opacity: 0;
        cursor: ew-resize;
        z-index: 20;
    }
    .label {
        position: absolute;
        top: 12px;
        padding: 4px 10px;
        background: rgba(0, 0, 0, 0.65);
        color: #ffffff;
        font-family: var(--font-sans, sans-serif);
        font-size: 0.75rem;
        font-weight: 700;
        border-radius: 4px;
        backdrop-filter: blur(4px);
        pointer-events: none;
        z-index: 5;
    }

    .label.left {
        left: 12px;
    }

    .label.right {
        right: 12px;
    }

    @media(max-width:768px) {
        .slider-container {
            max-width: 95%;
        }
    }
</style>