<script lang="ts">
    import type { Map} from 'maplibre-gl';
    import { untrack } from 'svelte';
    let {
        map, 
        id: layerId,
        sourceType,
        type, 
        
        data = undefined,
        url = undefined,
        tiles = undefined,
        videoUrls = undefined,
        coordinates = undefined,

        minzoom = undefined,
        maxzoom = undefined,
        tileSize = 512,
        bounds = undefined, // [num, num, num, num]

        paint = {},
        layout = {},
        filter = undefined,
        sourceLayer = undefined,
        beforeId = undefined,
        opacity = 1
    } = $props<{
        map: Map | any; 
        id: string;
        sourceType: 'vector' | 'raster' | 'geojson' | 'video' | 'image';
        type: 'fill' | 'line' | 'symbol' | 'circle' | 'heatmap' | 'fill-extrusion' | 'raster' | 'hillshade' | 'background';
        
        data?: any | string;
        url?: string;
        tiles?: string[];
        videoUrls?: string[];
        coordinates?: number[][]; // [[lng,lat], [lng,lat]...]
        
        minzoom?: number;
        maxzoom?: number;
        tileSize?: number;
        bounds?: [number, number, number, number];

        paint?: any;
        layout?: any;
        filter?: any[];
        sourceLayer?: string;
        beforeId?: string;
        opacity?: number;
    }>();

    $effect(() => {
        if (!map) return;

        const setup = () => {
            if (!map.getStyle() || map.getLayer(layerId)) return;
            const sourceId = layerId;

            if (!map.getSource(sourceId)) {
                const sourceConfig: any = { type: sourceType };
                if (sourceType === 'geojson') {
                    sourceConfig.data = data;
                } 
                else if (sourceType === 'vector' || sourceType === 'raster') {
                    if (url) sourceConfig.url = url; 
                    if (tiles) sourceConfig.tiles = tiles; 
                    if (tileSize) sourceConfig.tileSize = tileSize;
                    if (bounds) sourceConfig.bounds = bounds;
                } 
                else if (sourceType === 'image') {
                    sourceConfig.url = url;
                    sourceConfig.coordinates = coordinates;
                }
                else if (sourceType === 'video') {
                    sourceConfig.urls = videoUrls || (url ? [url] : []);
                    sourceConfig.coordinates = coordinates;
                }
                if (minzoom !== undefined) sourceConfig.minzoom = minzoom;
                if (maxzoom !== undefined) sourceConfig.maxzoom = maxzoom;

            try {
                if (!map.getSource(sourceId)) {
                    map.addSource(sourceId, sourceConfig);
                }

                map.addLayer({
                    id: layerId,
                    type,
                    source: sourceId,
                    'source-layer': sourceLayer,
                    paint: untrack(() => paint),
                    layout: untrack(() => layout),
                    minzoom,
                    maxzoom
                }, beforeId);
                
                console.log(`Capa [${layerId}] muntada`);
            } catch (e) {
                console.error("Error afegint capa:", e);
            }
            }
        };

        if (map.isStyleLoaded()) {
            setup();
        } else {
            map.once('load', setup);
        }

        return () => {
            untrack(() => {
                if (!map || !map.getStyle()) return;
                if (map.getLayer(layerId)) map.removeLayer(layerId);
                if (map.getSource(layerId)) map.removeSource(layerId);
            });
        };
    });

    $effect(() => {
        if (map && map.getLayer(layerId) && map.isStyleLoaded()) {
            for (const [key, value] of Object.entries(paint)) {
                map.setPaintProperty(layerId, key, value);
            }
        }
    });
</script>