<script lang="ts">
    import type { ComponentProps } from 'svelte';
    import MapBase from '$lib/components/molecules/maps/MapBase.svelte';
    import MapControls from '$lib/components/molecules/maps/MapControls.svelte';
    import MapLayer from '$lib/components/molecules/maps/MapLayer.svelte';
    import StoryCard from '$lib/components/molecules/story/Card.svelte';
    import type { CardSide, LayerDef, Chapter } from '$lib/types/chapter';
    import { playYears, resetYears } from '$lib/types/playYears';

    interface Props {
        steps: Chapter[];
        layers: LayerDef[];
        themeName?: ComponentProps<typeof MapBase>['themeName'];
    }
    let { steps, layers, themeName = 'CAMBODIA_WHITE' }: Props = $props();

    let mapInstance: any = $state();
    let activeIndex = $state(0);
    let interactive = $state(false);
    let blurred = $state(false);
    let vw = $state(1200);
    let year = $state<number | null>(null);

    const isMobile = $derived(vw < 768);
    const activeStep = $derived(steps[activeIndex]);

    const sideOf = (s: Chapter): CardSide => (s.header ? 'none' : (s.cardSide ?? 'left'));
    const hasCard = (s: Chapter) => !!(s.title || s.text || s.graphic || s.cta);

    // Càmera
    $effect(() => {
        const map = mapInstance;
        const step = steps[activeIndex];
        const mobile = isMobile;
        if (!map || !step || interactive) return;

        const cam = (mobile && step.mobileCamera) || step.camera;
        const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

        map.flyTo({
            ...cam,
            duration: calm ? 0 : 1800,
            essential: true,
            easing: (t: number) => t * (2 - t)
        });
    });

    // Animació d'anys
    $effect(() => {
        const map = mapInstance;
        const anim = activeStep?.animation;
        if (!map || !anim) {
            year = null;
            return;
        }

        if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
            resetYears(map, anim.layerId, true);
            year = anim.to;
            return;
        }

        resetYears(map, anim.layerId);
        year = anim.from;
        const stop = playYears(map, anim, (y) => (year = y));

        return () => {
            stop();
            resetYears(map, anim.layerId, true);
        };
    });

    const HANDLERS = ['scrollZoom', 'dragPan', 'touchZoomRotate', 'doubleClickZoom', 'dragRotate', 'touchPitch'];

    $effect(() => {
        const map = mapInstance;
        if (!map) return;
        const on = interactive;

        for (const h of HANDLERS) map[h]?.[on ? 'enable' : 'disable']();
        if (on) map.easeTo({ duration: 400 });

        document.body.style.overflow = on ? 'hidden' : 'visible';
        if (!on) document.body.style.overflowX = 'clip';
    });

    $effect(() => () => {
        document.body.style.overflow = '';
        document.body.style.overflowX = '';
    });

    let stepEls: HTMLElement[] = $state([]);
    let raf = 0;

    function syncActive() {
        if (interactive) return;
        const mid = window.innerHeight / 2;
        for (let i = 0; i < stepEls.length; i++) {
            const r = stepEls[i]?.getBoundingClientRect();
            if (r && r.top <= mid && r.bottom > mid) {
                if (i !== activeIndex) activeIndex = i;
                return;
            }
        }
    }
    const onScroll = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(syncActive);
    };

    const ETIQUETES = ['place-labels', 'place-labels-line', 'street-labels', 'town-labels'];

    $effect(() => {
        const map = mapInstance;
        if (!map) return;

        const amaga = () => {
            for (const id of ETIQUETES) {
                if (map.getLayer(id)) map.setLayoutProperty(id, 'visibility', 'none');
            }
        };

        if (map.isStyleLoaded()) amaga();
        else map.once('load', amaga);
    });
    
</script>

<svelte:window bind:innerWidth={vw} onscroll={onScroll} onresize={onScroll} />

<div class="storymap">
    <div class="map-wrapper" class:interactive>
        <div class="map-stage" class:blurred>
            <MapBase {themeName} bind:mapInstance isInteractive={false} />
        </div>

        {#each layers as def (def.id)}
            <MapLayer map={mapInstance} {...def} beforeId="place-labels" visible={activeStep?.layers?.includes(def.id) ?? false} />
        {/each}

        {#if year}
            <div class="year-label" aria-live="off">{year}</div>
        {/if}

        {#if interactive}
            <button class="exit-interactive-btn" onclick={() => (interactive = false)}>
                <span>✕</span> Sortir del mode interactiu (seguir llegint)
            </button>
            <div class="search-bar">
            </div>
            <MapControls mainMap={mapInstance} />
        {/if}

    </div>

    <div class="scroll-container" class:hide={interactive}>
        {#each steps as step, i (step.id)}
            <section
                class="step {sideOf(step)}"
                class:special={step.special}
                class:active={activeIndex === i}
                bind:this={stepEls[i]}
            >
                {#if step.header}
                    <div class="hero">
                        <div class="title-block">
                            <h1>{step.title}</h1>
                            {#if step.text}<h2 class="subtitle">{step.text}</h2>{/if}
                        </div>

                        {#if step.span}
                            <div class="pin">
                                <span class="pin-label">{step.span}</span>
                            </div>
                        {/if}
                    </div>
                {:else if hasCard(step)}
                    <StoryCard {step} active={activeIndex === i} oncta={() => (interactive = true)} />
                {/if}
            </section>
        {/each}
    </div>
</div>

<style>
    .storymap {
        position: relative;
        width: 100%;
        background-color: var(--bg-color);
    }

    .map-wrapper {
        position: sticky;
        top: 0;
        left: 0;
        width: 100%;
        height: 100lvh !important;
        z-index: 1;
        pointer-events: none;
    }
    .map-stage {
        position: absolute;
        inset: 0;
    }

    .map-wrapper.interactive {
        pointer-events: auto;
        z-index: 20;
    }

    .scroll-container {
        position: relative;
        z-index: 10;
        margin-top: -100lvh;
        pointer-events: none;
        transition: opacity 0.4s ease, visibility 0s;
    }

    .scroll-container.hide {
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.4s ease, visibility 0s 0.4s;
    }

    .step {
        box-sizing: border-box;
        min-height: 100lvh;
        display: flex;
        align-items: center;
        gap: 3vw;
        padding: 0 4vw;
        pointer-events: none;
        font-family: var(--font-serif);
    }

    .step:last-child {
        min-height: 100lvh;
    }

    .step.none {
        justify-content: center;
        padding: 1rem;
    }

    .step.special {
        min-height: 120lvh;
    }

    .step:not(.special) + .step.special {
        margin-top: clamp(3rem, 18svh, 10rem);
    }

    .step.right {
        flex-direction: row-reverse;
    }

    @media (min-width: 768px) {
        .step.left,
        .step.right {
            justify-content: space-between;
        }
    }

    @media (max-width: 767px) {
        .step,
        .step.right {
            flex-direction: column;
            justify-content: flex-end;
            align-items: center;
            gap: 0.75rem;
            padding: 0 4vw 4svh;
        }
    }

    .hero {
        position: relative;
        width: 100% !important;
        height: 100lvh;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        padding: 3.5rem 0;
        box-sizing: border-box;
        color: var(--text-main);
        font-family: var(--font-sans);
        background: linear-gradient(180deg, var(--bg-dark) 0%, rgba(0, 0, 0, 0) 60%);
    }

    h1 {
        margin: 0;
        padding: 2rem 1rem 0;
        font-family: var(--font-sans);
        font-size: clamp(2.2rem, 3.5vw + 1.2rem, 3.8rem);
        font-weight: 900;
        line-height: 1.1;
        letter-spacing: -0.02em;
        color: var(--bg-color);
        text-align: center;
    }

    .subtitle {
        margin: 0;
        padding: 0 1rem;
        font-size: medium;
        color: var(--bg-color);
        text-align: center;
    }

    .pin {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        pointer-events: none;
        animation: pin-in 0.8s ease 2.1s both;
    }

    .pin-label {
        position: absolute;
        top: var(--pin-gap, 18px);
        left: 0;
        transform: translateX(-50%);
        width: max-content;
        max-width: min(80vw, 320px);
        padding: 0.3rem 0.65rem;
        background: var(--bg-color);
        color: var(--text-main);
        font-family: var(--font-sans);
        font-size: 0.85rem;
        font-weight: 600;
        line-height: 1.3;
        text-align: center;
    }

    @keyframes pin-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .title-block {
        --blur-from: 28px;

        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        animation:
            fade-in 1.2s ease-out 0.3s backwards,
            unblur 1.8s cubic-bezier(0.25, 0.1, 0.25, 1) 0.3s backwards;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
    }

    @keyframes unblur {
        from {
            filter: blur(var(--blur-from));
        }
    }

    @media (max-width: 767px) {
        .title-block {
            --blur-from: 18px;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .title-block {
            animation: none;
        }
    }

    .search-bar {
        position: absolute;
        top: 7%;
        left: 2%;
        z-index: 1000;
        pointer-events: auto;
    }

    .exit-interactive-btn {
        position: absolute;
        bottom: 3rem;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 0.85rem;
        background: rgba(18, 18, 18, 0.9);
        color: #fff;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        font-family: var(--font-sans);
        font-size: 0.85rem;
        font-weight: 600;
        cursor: pointer;
        backdrop-filter: blur(8px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
        pointer-events: auto;
        transition: background 0.2s ease;
    }

    .exit-interactive-btn:hover {
        background: #000;
    }

    .year-label {
        position: absolute;
        right: 4vw;
        bottom: 8svh;
        z-index: 5;
        font-family: var(--font-sans);
        font-size: clamp(2.5rem, 8vw, 7rem);
        font-weight: 900;
        line-height: 1;
        font-variant-numeric: tabular-nums;
        color: var(--text-main);
        opacity: 0.85;
        pointer-events: none;
        }

    @media (max-width: 767px) {
        .year-label {
            top: 5svh;
            bottom: auto;
            right: 4vw;
        }
        }

    @media (max-width: 767px) {
        .exit-interactive-btn {
            bottom: 1.5rem;
            width: 90%;
            justify-content: center;
        }
          .title-block {
            --blur-from: 18px;
            margin-top: min(7svh, 80px);
        }
        .pin-label {
            top: 1rem;
        }
    }
</style>