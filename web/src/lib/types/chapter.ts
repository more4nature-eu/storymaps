import type { Component } from 'svelte';

export type CardSide = 'left' | 'right' | 'none';
export interface Chapter {
    id: string;
    title?: string;
    header?: boolean;
    special?: boolean;
    text?: string;
    span?: string;
    cardSide?: CardSide;
    media?: StoryMedia;
    legend?: { title: string; items: LegendEntry[] };
    camera: { 
        center: [number, number]; 
        zoom: number; 
        pitch: number; 
        bearing: number;
    };
    mobileCamera?: { 
        center: [number, number]; 
        zoom: number; 
        pitch: number; 
        bearing: number;
    };
    image?: string;
    caption?: string;
    source?: string;
    graphic?: Component;
    layers?: string[];
    cta?: string;
    animation?: ChapterAnimation;
  }
export interface LegendEntry {
  label: string;
  color: string;
}
export interface StoryMedia {
  src: string;
  alt: string;
  caption?: string;
  credits?: string;
}
export interface LayerDef {
  id: string;
  sourceType: 'vector' | 'raster' | 'geojson' | 'video' | 'image';
  type: 'fill' | 'line' | 'symbol' | 'circle' | 'heatmap' | 'fill-extrusion' | 'raster' | 'hillshade' | 'background';
  url?: string;
  tiles?: string[];
  data?: unknown;
  sourceLayer?: string;
  minzoom?: number;
  maxzoom?: number;
  tileSize?: number;
  paint?: Record<string, unknown>;
  filter?: unknown[];
}

export interface ChapterAnimation {
  layerId: string;
  from: number;
  to: number;
  duration: number;
  delay?: number;
}