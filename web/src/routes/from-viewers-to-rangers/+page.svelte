<script lang="ts">
  import SearchBar from "$lib/components/atoms/SearchBar.svelte";
  import ImgSliderContainer from "$lib/components/molecules/images/ImgSliderContainer.svelte";
  import Text from "$lib/components/molecules/text/Text.svelte";
  import ScrollyMap from "$lib/components/organisms/templates/ScrollyMap.svelte";
  import DeepZoomViewer from "$lib/components/organisms/viewers/DeepZoomViewer.svelte";
  import { base } from '$app/paths';

 import { chapters, photos, layers } from '$lib/data/D19';
  import Legend from "$lib/components/molecules/legends/Legend.svelte";
  import LegendItem from "$lib/components/molecules/legends/LegendItem.svelte";

  let mouseX = $state(0);
  let mouseY = $state(0);

  function handleMouseMove(e: MouseEvent): void {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
  }

  let scrollY = $state(0);
  let innerHeight = $state(0);
  let layoutEl = $state<HTMLElement>();

  const BLUR_START = 0.2;
  const BLUR_END = 0.9;
  const MAX_BLUR = 5;

  let titleProgress = $derived.by(() => {
    scrollY;
    if (!layoutEl || !innerHeight) return 0;

    const scrolled = -layoutEl.getBoundingClientRect().top;
    const start = innerHeight * BLUR_START;
    const end = innerHeight * BLUR_END;

    return Math.min(Math.max((scrolled - start) / (end - start), 0), 1);
  });
</script>

<svelte:window onmousemove={handleMouseMove} bind:scrollY bind:innerHeight />

<div class="story-container">
  <main class="main-layout" bind:this={layoutEl}>
    <div
      class="title-block"
      style="
        filter: blur({titleProgress * MAX_BLUR}px);
        transform: scale({1 - titleProgress * 0.015});
      "
    >
      <h1 class="story-title">
        From Viewers<br/>to Rangers
      </h1>
      <p class="story-subtitle">
        How a community banned from its own forest keeps documenting its destruction
      </p>
      <img src="{base}/images/cambodian-deforestation/CAMBODIA.svg" alt="cambodia_protected_areas" height="fit-content" width="300">
      <p class="low-hight">
        Main investigators
      </p>
      <p class="credits">
        Ida Theilade & Dimitris Argyriou
      </p>
      <p class="low-hight">
        Written by
      </p>
      <p class="credits">
        Carlos Albaladejo 
      </p>
      <p class="low-hight">
        Photographies
      </p>
      <p class="credits">
        Prey Lang Community Network
      </p>
    </div>

    <div class="mosaic-layer">
      <div class="mosaic-parallax" style="transform: translate3d({mouseX}px, {mouseY}px, 0);">
        {#each photos as photo, i}
          <div class="photo-card pos-{i}">
            <div class="card-inner" style="aspect-ratio: {photo.aspectRatio};">
              <img src={photo.img} alt={photo.caption} loading="lazy" />
            </div>
            <p class="photo-caption">{photo.caption}</p>
          </div>
        {/each}
      </div>
    </div>
    </main>
    <Text>
        <p>
          “Transporting timber every day. Please take action to stop them, or the forest and natural resources will be gone soon.” The plea came from a 
          volunteer of the Prey Lang Community Network (PLCN), a coalition of villages that has spent more 
          than 20 years trying to protect one of Cambodia’s oldest remaining forests.
        </p>
        <h3 style="margin:-.8rem 0rem">Prey Lang Wildlife Sanctuary</h3>
            <Legend>
                <LegendItem label="Evergreen" color="#2d4324" />
                <LegendItem label="Deciduous" color="#92ab4e" />
                <LegendItem label="Rubber" color="#c7d168" />
                <LegendItem label="Other Plantation" color="#b65b1f" />
                <LegendItem label="Cropland" color="#e8e8b1" />
            </Legend>
        <ImgSliderContainer
          beforeImage="{base}/images/cambodian-deforestation/prey_lang_landcover_2015.png"
          afterImage="{base}/images/cambodian-deforestation/Prey Lang area_landcover_2023.png"
          beforeLabel = "2015"
          afterLabel = "2023"
          initialPos = {50}
          alt = "Comparing images"/>
        <span class="">Source data: <a href="https:opendevelopmentcambodia.net">OpenDevelopment Cambodia</a></span>
        <p>
          In the last 20 years the sanctuary  has lost <strong>21% of the tree cover</strong> it had in 2001. More than half of that loss came after 2018, when it was already protected.
          In August 2023 the government expanded the sanctuary to almost 490,000 hectares. Conservationists asked how a ministry unable to protect the old borders would patrol the new ones.
        </p>
    </Text>        
    <ScrollyMap steps={chapters} layers={layers} />
    <Text>
        <p>
          "The illegal logging has increased despite the designation of the protected areas due to the lack of enforcement of the Protected Area Law, 
          government collusion in logging, widespread corruption and the lack of an independent judiciary", explains Ida Theilade, lead researcher on this project. 
        </p>
        <p>
          The sanctuary is not empty land. Volunteers recorded marble and cement operations and gold mining working in or beside it. Some, they say, hold government licences. Theilade points to concessions granted inside protected areas to well-connected businesses.
        </p>
        <p>
          Faced with institutional inaction, local communities have gathered 2,400 geotagged records of illegal logging. Patrollers record what they find with a smartphone app built on icons rather than text, so anyone can report regardless of literacy. Every entry is geotagged and photographed. 
          Then, researchers at the University of Copenhagen cross-check it with satellite alerts and publish the results on an open platform, IFOROS. 
          "One of the problems to the use of citizens’ generated data is that all the evidence obtained from satellite imagery is treated as invalid by Cambodian authorities," explains Ida Theilade.
        </p>
    </Text>
    <Text>
      <h3>
          Do you need more evidence? 
      </h3>
    </Text>
  <DeepZoomViewer 
    dziUrl="/mosaic_logging.dzi"
    indexUrl="/data/mosaic_logging_index.json"
  />
  <Text>
    <p>
      Despite their achievements, PLCN members face ongoing harassment and arrests. After a crackdown in 2023, authorities announced 12 arrests and more than 328,000 cubic metres of seized timber. Activists dismissed it as a show aimed at small-time loggers while the big bosses remained free.
    </p>
    <p>
      The forest is not only timber. Thousands of families around Prey Lang tap resin trees for a year-round income and gather food and medicine from the understorey. Since 2001, its loss has released about 53 million tonnes of CO₂ equivalent. Species such as the banteng, a wild cattle, have seen their numbers fall by more than 70% in a decade.
    </p>
  </Text>
</div>

<style>
  .story-container {
    width: 100%;
    margin: 0;
    padding: 0;
  }

  .main-layout {
    position: relative;
    min-height: 200vh; 
    overflow-x: clip; 
  }

  .title-block {
    position: sticky;
    top: 15vh;
    max-width: 400px;
    padding-left: 4rem;
    z-index: 1;
    margin-bottom: 5rem;;
    height: fit-content;
    will-change: filter, transform;
    transform-origin: left top;
  }

  .story-title {
    font-size: clamp(2rem, 3.5vw, 3.2rem);
    font-weight: 800;
    line-height: 1.1;
    margin: 0 0 0.8rem 0;
    color: var(--neutral, #243B4A);
    letter-spacing: -0.02em;
  }

  .story-subtitle {
    font-size: clamp(0.95rem, 1.3vw, 1.1rem);
    line-height: 1.5;
    color: #475569;
    margin: 0;
    font-weight: 400;
  }

  /* CAPA MOSAIC: Passa per sobre del títol i el difumina */
  .mosaic-layer {
    position: relative;
    z-index: 10;
    
    /* Espai inicial perquè el títol es vegi bé abans de fer scroll cap avall */
    margin-top: -20vh; 
    padding-top: 20vh; 
    padding-bottom: 20vh;
  }

  /* GRAELLA INTERNA AMB MOVIMENT DE RATOLÍ */
  .mosaic-parallax {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 1.5rem;
    will-change: transform;
    transition: transform 0.1s ease-out;
  }

  .photo-card {
    position: relative;
    pointer-events: none;
  }

  .card-inner {
    width: 100%;
    position: relative;
    overflow: hidden;
    border-radius: 0;
    box-shadow: none; 
  }

  .card-inner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .photo-caption {
    margin: 0.6rem 0 0 0;
    font-size: 0.8rem;
    line-height: 1.35;
    color: #64748b;
    padding: 0;
    display: inline-block;
  }

  .pos-0 { grid-column: 9 / span 7; margin-top: -65vh; }
  .pos-1 { grid-column: 1 / span 4; margin-top: 10vh; }
  .pos-2 { grid-column: 7 / span 5; margin-top: 50vh; }
  .pos-3 { grid-column: 5 / span 8; margin-top: 25vh; margin-bottom: -15vh; }

  .low-hight {
    font-weight: 300;
    font-size: .85rem;
    margin:.3rem 0;
  }

  .credits {
    font-size: .95rem;
    margin-top: 0rem;
  }

  @media (max-width: 850px) {
    .title-block {
      max-width: 85%;
      padding-left: 1.25rem;
      padding-right: 1.25rem;
      top: 18vh;
    }

    .mosaic-layer {
      margin-top: 10vh;
      padding-top: 10vh;
      padding-bottom: 10vh;
     
    }

    .mosaic-parallax {
      display: grid;
      grid-template-columns: repeat(12, 1fr);
      gap: 0.5rem;
      padding: 0 0.75rem;
      transform: none !important;
    }

    .photo-card {
      width: 100%;
    }

    .pos-0 { grid-column: 3 / span 10; margin-top: 20vh; }
    .pos-1 { grid-column: 1 / span 8; margin-top: 25vh; }
    .pos-2 { grid-column: 6 / span 7; margin-top: 10vh; }
    .pos-3 { grid-column: 1 / span 12; margin-top: 20vh; margin-bottom: 5vh; }

    .photo-caption {
      font-size: 0.7rem;
      margin-top: 0.3rem;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .title-block {
      filter: none !important;
      transform: none !important;
    }
  }
</style>