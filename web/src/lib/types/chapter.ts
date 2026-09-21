import type { Component } from "svelte";

export interface Chapter {
    id: string;
    title?: string;
    isHeader?: boolean;
    hasLegend?:boolean;
    description: string;
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
  }