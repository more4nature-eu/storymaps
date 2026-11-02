<script lang="ts">
  import { onMount, onDestroy, type Snippet } from 'svelte';
  import { THEMES } from '$lib/components/molecules/maps/themes';
  import { generateStyleFromTheme } from '$lib/styles/maps/styleFactory';
  import type { Map, Marker } from 'maplibre-gl';
  import 'maplibre-gl/dist/maplibre-gl.css';

  interface Props {
    themeName?: keyof typeof THEMES;
    mapInstance?: Map | undefined;
    isInteractive?: boolean;
    autoRotate?: boolean;
    children?: Snippet;
    onload?: (data: { map: Map; Marker: typeof Marker }) => void;
    onmove?: () => void;
  }

  let { 
    themeName = 'GLOBE_3D_WHITE', 
    mapInstance = $bindable(undefined),
    isInteractive = false,
    autoRotate = true,
    children,
    onload,
    onmove
  }: Props = $props();

  let mapContainer: HTMLDivElement;
  let animationFrameId: number | null = null;
  let userInteracting = false;
  let resumeTimeout: ReturnType<typeof setTimeout>;
  
  let currentBearing = $state(0);

  function setupAutoRotate(map: Map, speedDegreesPerSec = 3, maxZoomToRotate = 4.5) {
    let lastTime = performance.now();

    function rotate() {
      const now = performance.now();
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (autoRotate && !userInteracting && map.getZoom() < maxZoomToRotate) {
        const center = map.getCenter();
        center.lng -= speedDegreesPerSec * delta;
        
        if (center.lng < -180) center.lng += 360;
        map.setCenter(center);
      }

      animationFrameId = requestAnimationFrame(rotate);
    }

    const pauseEvents = ['mousedown', 'touchstart', 'movestart', 'pitchstart'] as const;
    pauseEvents.forEach((evt) => {
      map.on(evt, (e) => {
        if (e.originalEvent) {
          userInteracting = true;
          clearTimeout(resumeTimeout);
        }
      });
    });

    map.on('moveend', () => {
      clearTimeout(resumeTimeout);
      resumeTimeout = setTimeout(() => {
        userInteracting = false;
      }, 3000);
    });

    rotate();
  }

  let pmtilesRegistered = false;

  onMount(async () => {
    const [maplibreModule, pmtilesModule] = await Promise.all([
      import('maplibre-gl'),
      import('pmtiles')
    ]);
    
    const maplibregl: typeof import('maplibre-gl') =
      (maplibreModule as any).default ?? maplibreModule;

    const { Map: MaplibreMap, Marker, ScaleControl } = maplibregl;
    const { Protocol } = (pmtilesModule as any).default ?? pmtilesModule;

    if (!pmtilesRegistered) {
      const protocol = new Protocol();
      maplibregl.addProtocol('pmtiles', protocol.tile);
      pmtilesRegistered = true;
    }

    const theme = THEMES[themeName];
    const style = generateStyleFromTheme(theme);
    const isMobile = window.innerWidth < 768;

    mapInstance = new MaplibreMap({
      container: mapContainer,
      style: style,
      center: theme.center,
      zoom: isMobile ? theme.mobileZoom : theme.zoom,
      minZoom: theme.minZoom || 0,
      maxZoom: theme.maxZoom || 20,
      pitch: theme.pitch || 0,
      maxBounds: theme.bounds,
      maxPitch: theme.maxPitch,
      bearing: theme.bearing || 0,
      interactive: isInteractive,
      scrollZoom: false,
      boxZoom: false,
      doubleClickZoom: false,
      touchZoomRotate: false
    });

    mapInstance.addControl(
      new ScaleControl(),
      'bottom-left'
    );

    mapInstance.on('rotate', () => {
      currentBearing = mapInstance?.getBearing() || 0;
    });

    mapInstance.on('load', () => {
        mapInstance?.resize();
        
        if (theme.projection === 'globe') {
            mapInstance?.setProjection({ type: 'globe' });
        }

        if (theme.features.autoRotate) {
            setupAutoRotate(
              mapInstance!,
              theme.features.autoRotateSpeed || 3
            );
        }

        onload?.({ map: mapInstance!, Marker });
    });
    
    mapInstance.on('move', () => {
        onmove?.();
    });
  });
  

  onDestroy(() => {
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    clearTimeout(resumeTimeout);
    mapInstance?.remove();
  });
</script>

<div bind:this={mapContainer} class="map-viewport">
  {#if children}
    {@render children()}
  {/if}

  <div class="north-indicator">
    <span class="north-label">N</span>
    <svg 
      class="north-arrow" 
      style="transform: rotate({-currentBearing}deg);" 
      viewBox="0 0 24 24" 
      width="15" 
      height="15"
    >
      <path fill="var(--neutral, #243B4A)" d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
    </svg>
  </div>
</div>

<style>
    .map-viewport {
        width: 100%;
        height: 100%;
        position: relative;
    }

    :global(.maplibregl-ctrl-scale) {
        background-color: transparent !important;
        border: none !important;
        border-bottom: 2px solid var(--neutral, #243B4A) !important;
        color: var(--neutral, #243B4A) !important;
        font-family: var(--font-sans, sans-serif) !important;
        margin-bottom: 12px !important;
    }

    .north-indicator {
        position: absolute;
        bottom: 12px;
        left: 115px;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 3px;
        font-family: var(--font-sans, sans-serif);
        font-size: 11px;
        font-weight: 700;
        color: var(--neutral, #243B4A);
        pointer-events: none;
    }

    .north-arrow {
        transition: transform 0.1s linear;
    }
</style>