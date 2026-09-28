<script lang="ts">
    import { onMount } from 'svelte';
    import type OpenSeadragonType from 'openseadragon';
    
    export let dziUrl = '/mosaic_logging.dzi';

    let viewerId = 'openseadragon-viewer';
    let viewer: OpenSeadragonType.Viewer | undefined;

    onMount(async () => {
        const OpenSeadragon = (await import('openseadragon')).default;

        viewer = OpenSeadragon({
            id: viewerId,
            prefixUrl: "https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/", 
            tileSources: dziUrl,
            showNavigationControl: true,
            defaultZoomLevel: 0,
            minZoomImageRatio: 1,
            panVertical: true,
            visibilityRatio: 1
        });

        return () => {
            if (viewer) {
                viewer.destroy();
            }
        };
    });
</script>

<div id={viewerId}></div>

<style>
    #openseadragon-viewer {
        background-color: rgb(255, 255, 255);
        width: 100vw;
        height: 90dvh;
        margin: 0;
        padding: 0; 
    }
</style>