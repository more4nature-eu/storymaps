<script lang="ts">
  import SearchBar from "$lib/components/atoms/SearchBar.svelte";
  import ImgSliderContainer from "$lib/components/molecules/images/ImgSliderContainer.svelte";
  import Text from "$lib/components/molecules/text/Text.svelte";
  import ScrollyMap from "$lib/components/organisms/templates/ScrollyMap.svelte";
  import DeepZoomViewer from "$lib/components/organisms/viewers/DeepZoomViewer.svelte";
  import type { Chapter } from "$lib/types/chapter";

  const Stories: Chapter[] = [
    {
      id: "step-1-overview",
      isHeader: true,
      title: "",
      description: "",
      hasLegend: true,
      camera: { center: [103.991, 12.565], zoom: 7.2, pitch: 0, bearing: 0 },
      mobileCamera: { center: [104.991, 12.565], zoom: 6.2, pitch: 0, bearing: 0 }
    },
    {
      id: "step-2-prey-lang",
      isHeader: false,
      title: "Prey Lang Sanctuary",
      description: "One of Southeast Asia's oldest evergreen rainforests, facing severe threats from illegal logging operations.",
      camera: { center: [105.52, 13.12], zoom: 11.5, pitch: 45, bearing: -20 },
      mobileCamera: { center: [105.52, 13.12], zoom: 10.2, pitch: 35, bearing: -20 }
    },
    {
      id: "step-3-community-patrols",
      isHeader: false,
      title: "Community Patrols",
      description: "Indigenous rangers use geotagged imagery to document unauthorized clearings and send real-time alerts.",
      camera: { center: [105.42, 13.02], zoom: 13.8, pitch: 55, bearing: 35 },
      mobileCamera: { center: [105.42, 13.02], zoom: 12.2, pitch: 45, bearing: 25 }
    },
    {
      id: "step-4-interactive",
      isHeader: false,
      title: "Explore Protected Zones",
      description: "Explore the protected areas network and examine forest loss data across the country.",
      camera: { center: [104.991, 12.565], zoom: 8.0, pitch: 0, bearing: 0 },
      mobileCamera: { center: [104.991, 12.565], zoom: 7.0, pitch: 0, bearing: 0 }
    }
  ];

  // Diferents aspect-ratios per donar varietat de tamanys i orientacions
  const photos = [
    {
      id: 1,
      img: '/images/cambodian-deforestation/836DC191-D502-496E-A441-372CD78E5B7D.jpeg',
      caption: 'Big log',
      aspectRatio: '4 / 5'
    },
    {
      id: 2,
      img: '/images/cambodian-deforestation/65B6F92C-63AF-4CC3-92E8-4E0CD83F00FD.jpeg',
      caption: 'Evidence of illegal logging activity.',
      aspectRatio: '4 / 5' // Vertical
    },
    {
      id: 3,
      img: '/images/cambodian-deforestation/8A5A5197-3371-4FCB-B4F8-397C2E806B90.jpeg',
      caption: 'Community members geotagging data.',
      aspectRatio: '4 / 5' // Quadrada
    },
    {
      id: 4,
      img: '/images/cambodian-deforestation/A9159EBA-E3CD-41F7-86B5-430AD12D0709.jpeg',
      caption: 'Canopy monitoring and satellite verification.',
      aspectRatio: '3 / 2' // Horitzontal estàndard
    }
  ];

  let mouseX = $state(0);
  let mouseY = $state(0);

  function handleMouseMove(e: MouseEvent): void {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 30;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 30;
  }
</script>

<svelte:window onmousemove={handleMouseMove} />

<div class="story-container">
  <main class="main-layout">
    <div class="title-block">
      <h1 class="story-title">
        From Viewers<br/>to Rangers
      </h1>
      <p class="story-subtitle">
        Logging control in Wildlife Protected Areas using images provided by the community.
      </p>
      <img src="/images/cambodian-deforestation/CAMBODIA.svg" alt="cambodia_protected_areas" height="fit-content" width="300">
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
        Photografies
      </p>
      <p class="credits">
        Prey Lang Community
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
        <p>“Please take action to stop them, if not the forest and natural resources will be gone soon”. That was one of the urgent appeals from one of the xxx volunteers of the Pray Lang Community Network. A community that is trying to stop logging deforestation in one of the oldest verge forest in Cambodia, where XX hectares of tropical forest have been cut down over the past  XX years.</p>
    </Text>
    <ImgSliderContainer
        beforeImage="/images/cambodian-deforestation/prey_lang_landcover_2015.png"
        afterImage="/images/cambodian-deforestation/Prey Lang area_landcover_2023.png"
        beforeLabel = "2015"
        afterLabel = "2023"
        initialPos = {50}
        alt = "Comparing images"/>
    <Text>
        <p>Faced with institutional inaction, local communities have organized to gather 2,400 geotagged evidence of illegal logging. "One of the biggest problems is that all the evidence obtained from satellite imagery is denied and treated as invalid by Cambodian authorities," explains Ida Theilade, lead researcher on the XXX project.</p>
      <SearchBar/>
    </Text>
  <DeepZoomViewer />
  <Text>
    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letraset's Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised thanks to these sheets and more recently with desktop publishing software like Aldus PageMaker and Microsoft Word including versions of Lorem Ipsum.</p>
  </Text>
</div>
<ScrollyMap chapters={Stories} />

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
</style>