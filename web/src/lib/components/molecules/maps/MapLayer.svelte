<script lang="ts">
    import type { Map } from 'maplibre-gl';
    import { untrack } from 'svelte';

    interface Props {
        map: Map | any;
        id: string;
        sourceType: 'vector' | 'raster' | 'geojson' | 'video' | 'image';
        type: 'fill' | 'line' | 'symbol' | 'circle' | 'heatmap' | 'fill-extrusion' | 'raster' | 'hillshade' | 'background';
        data?: any | string;
        url?: string;
        tiles?: string[];
        videoUrls?: string[];
        coordinates?: number[][];
        minzoom?: number;
        maxzoom?: number;
        tileSize?: number;
        bounds?: [number, number, number, number];
        paint?: any;
        layout?: any;
        filter?: any[];
        sourceLayer?: string;
        beforeId?: string;
        visible?: boolean;
    }

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
        bounds = undefined,
        paint = {},
        layout = {},
        filter = undefined,
        sourceLayer = undefined,
        beforeId = undefined,
        visible = true
    } : Props = $props();

    let layerReady = $state(false);
    
    $effect(() => {
        if (!map) return;

        const setup = () => {
            if (!map.getStyle() || map.getLayer(layerId)) return;

            if (!map.getSource(layerId)) {
                const sourceConfig: any = { type: sourceType };
                if (sourceType === 'geojson') {
                    sourceConfig.data = data;
                } else if (sourceType === 'vector' || sourceType === 'raster') {
                    if (url) sourceConfig.url = url;
                    if (tiles) sourceConfig.tiles = tiles;
                    if (tileSize) sourceConfig.tileSize = tileSize;
                    if (bounds) sourceConfig.bounds = bounds;
                } else if (sourceType === 'image') {
                    sourceConfig.url = url;
                    sourceConfig.coordinates = coordinates;
                } else if (sourceType === 'video') {
                    sourceConfig.urls = videoUrls || (url ? [url] : []);
                    sourceConfig.coordinates = coordinates;
                }
                if (minzoom !== undefined) sourceConfig.minzoom = minzoom;
                if (maxzoom !== undefined) sourceConfig.maxzoom = maxzoom;
                map.addSource(layerId, sourceConfig);
            }

            try {
                map.addLayer(
                    {
                        id: layerId,
                        type,
                        source: layerId,
                        ...(sourceLayer ? { 'source-layer': sourceLayer } : {}),
                        ...(filter ? { filter } : {}),
                        paint: untrack(() => paint),
                        layout: {
                            ...untrack(() => layout),
                            visibility: untrack(() => visible) ? 'visible' : 'none'
                        },
                        ...(minzoom !== undefined ? { minzoom } : {}),
                        ...(maxzoom !== undefined ? { maxzoom } : {})
                    },
                    beforeId
                );
                layerReady = true;
            } catch (e) {
                console.error(`Error afegint la capa [${layerId}]:`, e);
            }
        };

        if (map.isStyleLoaded()) setup();
        else map.once('load', setup);

        return () => {
            map.off?.('load', setup);
            layerReady = false;
            untrack(() => {
                if (!map || !map.getStyle()) return;
                if (map.getLayer(layerId)) map.removeLayer(layerId);
                if (map.getSource(layerId)) map.removeSource(layerId);
            });
        };
    });

    $effect(() => {
        const v = visible;
        if (!layerReady || !map.getLayer(layerId)) return;
        map.setLayoutProperty(layerId, 'visibility', v ? 'visible' : 'none');
    });

    $effect(() => {
        const p = paint;
        if (!layerReady || !map.getLayer(layerId)) return;
        for (const [key, value] of Object.entries(p)) {
            map.setPaintProperty(layerId, key, value);
        }
    });
</script>