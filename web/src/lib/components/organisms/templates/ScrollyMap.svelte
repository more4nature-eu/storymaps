<script lang="ts">
  import Legend from "$lib/components/molecules/legends/Legend.svelte";
  import MapBase from "$lib/components/molecules/maps/MapBase.svelte";
  import LegendItem from "$lib/components/molecules/legends/LegendItem.svelte";
  import SearchBar from "$lib/components/atoms/SearchBar.svelte";
  import type { Chapter } from "$lib/types/chapter";
  
  let mapInstance: any = $state(); 
  let activeChapterIndex = $state(0);
  let isInteractiveMode = $state(false);
  let { 
    chapters = [] 
  } = $props<{
    mainTitle?: string;
    subtitle?: string;
    introElement?: import('svelte').Snippet;
    authorName?: string;
    introParagraphs?: string[];
    chapters?: Chapter[];
  }>();

  let isLastChapter = $derived(chapters.length > 0 && activeChapterIndex === chapters.length - 1);

  function observe(node: HTMLElement, index: number) {
      const observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
              if (entry.isIntersecting) {
                  activeChapterIndex = index;
              }
          });
      }, {
          rootMargin: "0px",
          threshold: 0.3
      });

      observer.observe(node);

      return {
          destroy() {
              observer.disconnect();
          }
      };
  }

  $effect(() => {
      if (mapInstance && chapters[activeChapterIndex] && !isInteractiveMode) {
          const chapter = chapters[activeChapterIndex];
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

          const targetCamera = (isMobile && chapter.mobileCamera)
                ? { ...chapter.mobileCamera }
                : chapter.camera;
            
          mapInstance.flyTo({
              ...targetCamera,
              duration: 1800,
              essential: true,
              easing: (t: number) => t * (2 - t)
          });
      }
  });

  $effect(() => {
    if (!mapInstance) return;

    if (isInteractiveMode) {
        mapInstance.scrollZoom?.enable();
        mapInstance.dragPan?.enable();
        mapInstance.touchZoomRotate?.enable();
        mapInstance.doubleClickZoom?.enable();
        mapInstance.dragRotate?.enable();
        mapInstance.touchPitch?.enable();
        
        document.body.style.overflow = "hidden";
    } else {
        mapInstance.scrollZoom?.disable();
        mapInstance.dragPan?.disable();
        mapInstance.touchZoomRotate?.disable();
        mapInstance.doubleClickZoom?.disable();

        document.body.style.overflow = "visible";
        document.body.style.overflowX = "clip";
    }
});

  function handleSelectPlace(place: { name: string; lng: number; lat: number; bbox?: [number, number, number, number] }) {
      if (!mapInstance) return;

      if (place.bbox) {
          mapInstance.fitBounds(
              [
                  [place.bbox[0], place.bbox[1]], // sud-oest
                  [place.bbox[2], place.bbox[3]]  // nord-est
              ],
              {
                  padding: 60,
                  duration: 2000,
                  maxZoom: 14
              }
          );
      } else {
          mapInstance.flyTo({
              center: [place.lng, place.lat],
              zoom: 12.5,
              pitch: 0,
              duration: 2000,
              essential: true
          });
      }
  }

  function toggleInteractive() {
      isInteractiveMode = !isInteractiveMode;
  }
</script>

<div class="storymap-layout">
    <div class="map-wrapper" class:interactive-mode={isInteractiveMode}>
        <MapBase themeName="CAMBODIA_WHITE" bind:mapInstance={mapInstance} isInteractive={true}/>
        {#if activeChapterIndex >= 1}
            <div class="counter">En àrea visible s'ha guanyat X masa forestal</div>
        {/if}
    </div>
    <div class="scroll-container" class:hide-cards={isInteractiveMode}>
        {#each chapters as chapter, i}
            <section 
                class="step" 
                use:observe={i}
                class:active={activeChapterIndex === i}
            >
                    <div class="card">
                        <h2>{chapter.title}</h2>
                        <p>{chapter.description}</p>

                        {#if chapter.graphic}
                            <chapter.graphic />
                        {/if}
                    </div>
            </section>
        {/each}
    </div>
</div>

<style>
.storymap-layout {
  position: relative;
  width: 100%;
  background-color: var(--bg-dark, #0f172a);
}

.map-wrapper {
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  height: 100svh;
  z-index: 1;
  pointer-events: none;
}

.scroll-container {
  position: relative;
  z-index: 10;
  pointer-events: none;
  margin-top: -50vh;
}

.step {
  height: 100vh;
  height: 100svh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 6%;
  box-sizing: border-box;
}

.card {
  position: relative;
  width: 380px;
  max-width: 88vw;
  padding: 1.5rem;
  pointer-events: auto;
}

@media (max-width: 768px) {
  .step {
    justify-content: center;
    padding-left: 0;
    padding: 0 1rem;
  }

  .card {
    width: 90%;
    padding: 1.2rem;
  }
}
</style>
