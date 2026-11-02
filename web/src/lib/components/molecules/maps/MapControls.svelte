<script lang="ts">
    import type { Map as MapLibreMap } from 'maplibre-gl';

    interface Props {
        mainMap?: MapLibreMap;
        pitch3D?: number;
    }
    let { mainMap, pitch3D = 65 }: Props = $props();

    let zoom = $state(0);
    let minZoom = $state(0);
    let maxZoom = $state(22);
    let bearing = $state(0);
    let pitch = $state(0);

    let is3D = $derived(pitch > 5);
    let atMin = $derived(zoom <= minZoom + 0.01);
    let atMax = $derived(zoom >= maxZoom - 0.01);

    $effect(() => {
        if (!mainMap) return;
        const map = mainMap;

        const sync = () => {
            zoom = map.getZoom();
            minZoom = map.getMinZoom();
            maxZoom = map.getMaxZoom();
            bearing = map.getBearing();
            pitch = map.getPitch();
        };

        map.on('move', sync);   // cobreix zoom, rotació i pitch
        sync();

        return () => map.off('move', sync);
    });

    const zoomIn = () => mainMap?.zoomIn({ duration: 300 });
    const zoomOut = () => mainMap?.zoomOut({ duration: 300 });
    const resetNorth = () => mainMap?.easeTo({ bearing: 0, duration: 600 });
    const togglePitch = () => {
        if (!mainMap) return;
        mainMap.easeTo({
            pitch: is3D ? 0 : Math.min(pitch3D, mainMap.getMaxPitch()),
            duration: 700
        });
    };
</script>

<div class="map-controls" role="group" aria-label="Controls del mapa">
    <div class="group">
        <button type="button" onclick={zoomIn} disabled={atMax} aria-label="Apropar">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
            </svg>
        </button>
        <button type="button" onclick={zoomOut} disabled={atMin} aria-label="Allunyar">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                <path d="M5 12h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" />
            </svg>
        </button>
    </div>

    <div class="group">
        <button type="button" onclick={resetNorth} aria-label="Orientar el mapa al nord">
            <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                style="transform: rotate({-bearing}deg);"
                aria-hidden="true"
            >
                <path fill="currentColor" d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
            </svg>
        </button>
        <button
            type="button"
            class="pitch"
            onclick={togglePitch}
            aria-pressed={is3D}
            aria-label={is3D ? 'Canviar a vista 2D' : 'Canviar a vista 3D'}
        >
            {is3D ? '2D' : '3D'}
        </button>
    </div>
</div>

<style>
    .map-controls {
        position: absolute;
        top: 126px;
        right: 20px;
        z-index: 50;
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: auto;
    }

    .group {
        display: flex;
        flex-direction: column;
        background: var(--bg-color);
        border: 1px solid var(--bg-dark);
        border-radius: 4px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        overflow: hidden;
    }

    button {
        width: 30px;
        height: 30px;
        display: grid;
        place-items: center;
        padding: 0;
        border: none;
        background: transparent;
        color: var(--text-main);
        font-family: var(--font-sans, sans-serif);
        font-size: 0.8rem;
        font-weight: 700;
        cursor: pointer;
        transition: background-color 0.15s ease;
    }

    button + button {
        border-top: 1px solid var(--bg-dark);
    }

    button:hover:not(:disabled) {
        background: color-mix(in srgb, var(--text-main) 10%, transparent);
    }

    button:focus-visible {
        outline: 2px solid var(--corporative);
        outline-offset: -2px;
    }

    button:disabled {
        opacity: 0.35;
        cursor: default;
    }

    .pitch[aria-pressed='true'] {
        background: var(--corporative);
        color: #fff;
    }

    @media (min-width: 768px) {
        .map-controls {
            top: 166px;        /* 60px + 96px + marge */
        }
    }
</style>