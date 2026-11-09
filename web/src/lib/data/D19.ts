import { base } from '$app/paths';
import type { Chapter, LayerDef } from '$lib/types/chapter';

export const layers: LayerDef[] = [
    {
    id:'landcover_protected_areas_2023',
        sourceType: 'raster',
        type:'raster',
        url:`pmtiles://https://more4nature-storage.fablabbcn.org/d-19/data/landcover_2023_project_areas.pmtiles`,
        paint:{
            'raster-opacity':1
        }
    },
    {
        id: 'protected_areas_fill',
        sourceType: 'vector',
        type: 'fill',
        url: `pmtiles://https://more4nature-storage.fablabbcn.org/d-19/data/wildlife_protected_areas.pmtiles`,
        sourceLayer: 'Reprojected',
        paint: {
            'fill-color': '#c7d168',
            'fill-opacity': 0.25
        }
        },
        {
        id: 'protected_areas_outline',
        sourceType: 'vector',
        type: 'line',
        url: `pmtiles://https://more4nature-storage.fablabbcn.org/d-19/data/wildlife_protected_areas.pmtiles`,
        sourceLayer: 'Reprojected',
        paint: {
            'line-color': '#2d4324',
            'line-width': 1,
            'line-dasharray': [4, 2]
        }
    },
    {
        id: 'forest_loss_animated',
        sourceType: 'vector',
        type: 'fill',
        url: `pmtiles://https://more4nature-storage.fablabbcn.org/d-19/data/forest_loss_protected_areas_hansen_2025.pmtiles`,
        sourceLayer: 'Dissolved',
        paint: {
            'fill-color': ['interpolate', ['linear'], ['get', 'DN'], 1, '#d5ad4a', 25, '#5c0339'],
            'fill-opacity': 0.9
        }
        }
];

const LEGEND_BEFORE = {
    title:'',
    items: [
        {color: '#d5ad4a', label: 'Before 2016'},
         {color: '#5c0339', label: 'After 2016'},
    ]
}

export const chapters: Chapter[] = [
    {
        id: 'step-0',
        title: 'Not only Prey Lang',
        text: 'Cambodia has lost almost a third of its tree cover since 2000. In 2023 alone, <mark class="loss">120,829 hectares disappeared</mark>, 40% of them inside protected areas. Prey Lang is one of four such areas in this part of the country.',
        camera: { center: [104.4, 13.5], zoom: 8.2, pitch: 0, bearing: 0 },
        mobileCamera: { center: [104.9, 12.9], zoom: 5.8, pitch: 0, bearing: 0 },
        layers: ['protected_areas_fill', 'protected_areas_outline']
    },
    {
        id: 'step-1',
        title: 'Protected, and still disappearing',
        text: 'Prey Lang became a wildlife sanctuary in 2016. Watch what happens to its forest, year by year.',
        camera: { center: [105.52, 13.2], zoom: 9.2, pitch: 0, bearing: 0 },
        mobileCamera: { center: [105.55, 13.3], zoom: 9, pitch: 0, bearing: 0 },
        layers: ['protected_areas_outline', 'forest_loss_animated'],
        animation: {
            layerId: 'forest_loss_animated',
            from: 2001,
            to: 2025,
            duration: 10000
        },
        legend: LEGEND_BEFORE
    },
    {
        id: 'step-2',
        title: '',
        special:true,
        text: 'The forest has rangers and checkpoints, yet timber keeps leaving. In a conversation recorded by patrollers, a logger said he pays rangers 50,000 riel, about $12.50, at the checkpoint. Patrollers also report rangers ignoring the traffic: on some days, they say, ten to twenty motorbikes carried timber out.',
        camera: { center: [105.36289333333, 13.256048333333], zoom: 16.5, pitch: 20, bearing: 0 },
        mobileCamera: { center: [105.52, 13.0], zoom: 9.5, pitch: 15, bearing: 0 },
        layers: ['protected_areas_outline'],
        media: { src: '/images/cambodian-deforestation/PLI-41499.jpg', alt: '', caption: '', }
    }
];

export interface Photo {
  id: number;
  img: string;
  caption: string;
  aspectRatio: string;
}

export const photos: Photo[] = [
  {
    id: 1,
    img: `${base}/images/cambodian-deforestation/836DC191-D502-496E-A441-372CD78E5B7D.jpeg`,
    caption: 'Illegally logged tree recorded by PLCN forest patrol',
    aspectRatio: '4 / 5'
  },
  {
    id: 2,
    img: `${base}/images/cambodian-deforestation/65B6F92C-63AF-4CC3-92E8-4E0CD83F00FD.jpeg`,
    caption: 'Illegal loggers cutting trees in Chhertheal Bang Keou, Cambodia, on January 30, 2019.',
    aspectRatio: '4 / 5'
  },
  {
    id: 3,
    img: `${base}/images/cambodian-deforestation/8A5A5197-3371-4FCB-B4F8-397C2E806B90.jpeg`,
    caption: 'Burning is a common practice to clear land for planting crops afterwards.',
    aspectRatio: '4 / 5'
  },
  {
    id: 4,
    img: `${base}/images/cambodian-deforestation/A9159EBA-E3CD-41F7-86B5-430AD12D0709.jpeg`,
    caption: "Freshly felled 'Sralao' (Lagerstroemia cochinchinensis) in Prey Lang Wildlife Sanctuary.",
    aspectRatio: '3 / 2'
  }
];