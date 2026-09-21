<script lang="ts">
  import { onMount } from 'svelte';
  import { fly, fade } from 'svelte/transition';
  import { goto } from '$app/navigation';
  import type { Map, MapMouseEvent } from 'maplibre-gl';

  import MapBase from "$lib/components/molecules/maps/MapBase.svelte";
  import MapLayer from "$lib/components/molecules/maps/MapLayer.svelte"; 
  import LocatorMap from "./LocatorMap.svelte"; 
  import Legend from "../legends/Legend.svelte";
  import LegendItem from "../legends/LegendItem.svelte";

  import { PROJECTS_GEOJSON, type ProjectProperties } from "$lib/data/projects";

  let mapInstance = $state<Map | undefined>(undefined); 
  
  let activeProject = $state<(ProjectProperties & { slug?: string; description?: string }) | null>(null);
  let hoveredProject = $state<ProjectProperties | null>(null);
  let hoverPos = $state<{ x: number; y: number; isTop: boolean; isLeft: boolean } | null>(null);
  
  let isFlying = $state(false);
  let showLocator = $state(false);
  let activeProjectIndex = $state(-1);

  const words = ['stories!', 'datasets!', 'world!'];
  let currentIndex = $state(0);

  onMount(() => {
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % words.length;
    }, 2500);

    return () => clearInterval(interval);
  });

  $effect(() => {
    const map = mapInstance;
    if (!map) return;

    const onMouseEnter = () => { map.getCanvas().style.cursor = 'pointer'; };
    const onMouseLeave = () => {
      map.getCanvas().style.cursor = '';
      hoveredProject = null;
      hoverPos = null;
    };

    const onMouseMove = (e: MapMouseEvent & { features?: any[] }) => {
      if (!e.features || !e.features[0]) return;
      const props = e.features[0].properties as ProjectProperties;
      const coords = e.features[0].geometry.coordinates;
      const pixelPos = map.project(coords as [number, number]);

      hoveredProject = props;
      hoverPos = {
        x: pixelPos.x,
        y: pixelPos.y,
        isTop: pixelPos.y > window.innerHeight - 120,
        isLeft: pixelPos.x > window.innerWidth - 180
      };
    };

    const onClick = (e: MapMouseEvent & { features?: any[] }) => {
      if (!e.features || !e.features[0]) return;
      const props = e.features[0].properties as ProjectProperties;
      const coords = e.features[0].geometry.coordinates as [number, number];
      flyToProject({ ...props, coords });
    };

    const bindEvents = () => {
      if (!map.getLayer('projects-hitbox')) return;
      map.on('mouseenter', 'projects-hitbox', onMouseEnter);
      map.on('mouseleave', 'projects-hitbox', onMouseLeave);
      map.on('mousemove', 'projects-hitbox', onMouseMove);
      map.on('click', 'projects-hitbox', onClick);
    };

    map.on('styledata', bindEvents);
    bindEvents();

    return () => {
      map.off('styledata', bindEvents);
      map.off('mouseenter', 'projects-hitbox', onMouseEnter);
      map.off('mouseleave', 'projects-hitbox', onMouseLeave);
      map.off('mousemove', 'projects-hitbox', onMouseMove);
      map.off('click', 'projects-hitbox', onClick);
    };
  });

  function flyToProject(project: ProjectProperties & { coords: [number, number] }) {
    if (!mapInstance) return;
    mapInstance.stop();

    activeProject = project;
    isFlying = true;
    showLocator = true;

    const targetZoom = Number(project.zoom) || 9;
    const targetPitch = project.pitch !== undefined ? Number(project.pitch) : 45;
    const targetBearing = project.bearing !== undefined ? Number(project.bearing) : 0;

    mapInstance.flyTo({
      center: project.coords,
      zoom: targetZoom,
      pitch: targetPitch,
      bearing: targetBearing,
      speed: 0.8,
      curve: 1.4,
      essential: true
    });

    mapInstance.once('moveend', () => { 
      isFlying = false; 
    });
  }

  function resetToGlobalView() {
    if (!mapInstance) return;

    mapInstance.stop();

    activeProject = null;
    isFlying = true;
    showLocator = false;

    mapInstance.flyTo({
      center: [0, 20],
      zoom: 3,
      pitch: 0,
      bearing: 0,
      speed: 1,
      essential: true
    });

    mapInstance.once('moveend', () => { isFlying = false; });
  }

  function startGuidedTour() {
    if (!PROJECTS_GEOJSON?.features?.length) return;

    activeProjectIndex = (activeProjectIndex + 1) % PROJECTS_GEOJSON.features.length;
    const feat = PROJECTS_GEOJSON.features[activeProjectIndex];
    
    let coords: [number, number] | null = null;
    const geom = feat.geometry as any;

    if (geom.type === 'Point') {
      coords = geom.coordinates as [number, number];
    } else if (geom.coordinates && Array.isArray(geom.coordinates[0])) {
      coords = geom.coordinates[0] as [number, number];
    }

    if (!coords) return;

    flyToProject({
      ...(feat.properties as ProjectProperties),
      coords
    });
  }

  function openStoryPage(id?: string) {
    if (id) {
        goto(`/stories/${id}`);
    }
    }
</script>

<div class="map-container">
    {#if !activeProject}
        <header class="hero-header" transition:fade={{ duration: 300 }}>
            <h1 class="hero-title">
                <span class="static-prefix">Explore our</span>
                <span class="word-wrapper">
                    {#key currentIndex}
                        <span 
                            class="animated-word"
                            in:fly={{ y: 35, duration: 450, delay: 150 }} 
                            out:fly={{ y: -35, duration: 450 }}
                        >
                            {words[currentIndex]}
                        </span>
                    {/key}
                </span>
            </h1>

            <Legend>
                <LegendItem label="Zero pollution" color="#C7D5E0" />
                <LegendItem label="Biodiversity protection" color="#F8BA88" />
                <LegendItem label="Deforestation prevention" color="#E1E692" />
            </Legend>

            <button class="cta-explore-btn" onclick={startGuidedTour}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>
                </svg>
                Guided Tour
            </button>
        </header>
    {/if}

    {#if activeProject}
        <div class="active-story-container" in:fly={{ y: -20, duration: 400 }} out:fade={{ duration: 200 }}>
            <h2 class="active-story-title">{activeProject.name}</h2>
            
            {#if activeProject.description}
                <p class="active-story-description">{activeProject.description}</p>
            {/if}

            <div class="active-story-actions">
                <button class="enter-story-btn" onclick={() => openStoryPage(activeProject?.id)}>
                    Read Story ↓
                </button>
                <button class="nav-back-btn" onclick={resetToGlobalView}>
                    ← Back to Globe
                </button>
            </div>
        </div>
    {/if}

    <MapBase 
        themeName="GLOBE_3D_WHITE" 
        bind:mapInstance={mapInstance} 
        isInteractive={true}
        autoRotate={!activeProject && !isFlying}
    />

    {#if mapInstance}
        <MapLayer
            map={mapInstance}
            id="projects-hitbox"
            sourceType="geojson"
            type="circle"
            data={PROJECTS_GEOJSON}
            paint={{
                'circle-radius': 18,
                'circle-color': ['get', 'color'],
                'circle-opacity': 0.2,
                'circle-stroke-width': 1.5,
                'circle-stroke-color': ['get', 'color'],
                'circle-stroke-opacity': 0.6
            }}
        />

        <MapLayer
            map={mapInstance}
            id="projects-dots"
            sourceType="geojson"
            type="circle"
            data={PROJECTS_GEOJSON}
            paint={{
                'circle-radius': 6,
                'circle-color': ['get', 'color']
            }}
        />
    {/if}

    {#if mapInstance && showLocator}
        <LocatorMap mainMap={mapInstance} />
    {/if}

    {#if hoveredProject && hoverPos && !activeProject}
        <div 
            class="hover-tooltip"
            style="left: {hoverPos.x}px; top: {hoverPos.y}px; --marker-color: {hoveredProject.color};"
            class:pos-top={hoverPos.isTop}
            class:pos-bottom={!hoverPos.isTop}
            class:pos-left={hoverPos.isLeft}
            class:pos-right={!hoverPos.isLeft}
        >
            <div class="tooltip-badge">
                <span class="tooltip-dot" style="background-color: {hoveredProject.color};"></span>
                <span class="tooltip-title">{hoveredProject.name}</span>
            </div>
        </div>
    {/if}
</div>

<style>
    :global(html, body) {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
    }

    .map-container {
        position: relative;
        width: 100vw;
        height: 100dvh;
        z-index: 10;
        overflow: hidden;
    }

    .hero-header {
        position: absolute;
        top: 8%;
        left: 50%;
        transform: translateX(-50%);
        z-index: 20;
        width: 90%;
        max-width: 900px;
        text-align: center;
        pointer-events: none;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.6rem;
    }

    .hero-title {
        font-family: var(--font-sans, system-ui, sans-serif);
        font-size: clamp(2.2rem, 5.5vw, 4.5rem);
        font-weight: 800;
        line-height: 1.1;
        letter-spacing: -0.02em;
        color: var(--neutral, #243B4A);
        text-shadow: 0 2px 10px rgba(255, 255, 255, 0.8);
        margin: 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.1em;
    }

    .static-prefix { display: block; }

    .word-wrapper {
        display: inline-grid;
        position: relative;
        overflow: hidden;
        padding-bottom: 0.1em;
    }

    .animated-word {
        grid-area: 1 / 1;
        display: inline-block;
        white-space: nowrap;
    }

    .cta-explore-btn {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: var(--neutral, #243B4A);
        color: #ffffff;
        border: none;
        padding: 12px 24px;
        border-radius: 30px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s ease, background-color 0.2s ease;
        pointer-events: auto;
        margin-top: 0.4rem;
    }

    .cta-explore-btn:hover {
        transform: scale(1.04);
        background: #192934;
    }

    .active-story-container {
        position: absolute;
        top: 15%;
        left: 50%;
        transform: translateX(-50%);
        z-index: 30;
        width: 90%;
        max-width: 650px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: auto;
    }

    .active-story-title {
        font-family: var(--font-sans, system-ui, sans-serif);
        font-size: clamp(2rem, 4vw, 3.2rem);
        font-weight: 800;
        color: var(--neutral, #243B4A);
        text-shadow: 0 2px 12px rgba(255, 255, 255, 0.9);
        margin: 2rem 0 1rem 0;
        line-height: 1.15;
    }

    .active-story-description {
        font-size: clamp(0.95rem, 1.8vw, 1.15rem);
        color: #334155;
        margin: 0 0 1.2rem 0;
        max-width: 550px;
        line-height: 1.5;
        font-weight: 500;
        text-shadow: 0 1px 4px rgba(255, 255, 255, 0.9);
    }

    .active-story-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
    }

    .enter-story-btn, .nav-back-btn {
        border: none;
        padding: 12px 22px;
        border-radius: 30px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
        transition: transform 0.2s ease, background 0.2s ease;
    }

    .enter-story-btn {
        background: var(--neutral, #243B4A);
        color: #ffffff;
    }

    .enter-story-btn:hover {
        transform: scale(1.04);
        background: #192934;
    }

    .nav-back-btn {
        background: rgba(255, 255, 255, 0.9);
        color: #334155;
        backdrop-filter: blur(8px);
        border: 1px solid rgba(0, 0, 0, 0.08);
    }

    .nav-back-btn:hover {
        transform: scale(1.04);
        background: #ffffff;
    }

    .hover-tooltip {
        position: absolute;
        pointer-events: none;
        z-index: 99999;
        transform: translate(-50%, -100%);
    }

    .tooltip-badge {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 14px;
        background: rgba(15, 23, 42, 0.88);
        backdrop-filter: blur(8px);
        border-radius: 20px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.15);
    }

    .tooltip-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
    }

    .tooltip-title {
        font-size: 13px;
        font-weight: 600;
        color: #ffffff;
        white-space: nowrap;
    }

    .hover-tooltip.pos-top { transform: translate(-50%, -100%) translateY(-12px); }
    .hover-tooltip.pos-bottom { transform: translate(-50%, 0%) translateY(12px); }

    @media (max-width: 768px) {
        .hero-header { top: 8%; width: 95%; }
        .active-story-container { top: 8%; width: 95%; }
        .active-story-actions { flex-direction: column; gap: 8px; width: 100%; }
        .enter-story-btn, .nav-back-btn { width: 100%; }
        .enter-story-btn, .nav-back-btn { max-width:50% }
    }
</style>