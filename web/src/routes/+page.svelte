<script lang="ts">
  import DeepZoomViewer from "$lib/components/organisms/viewers/DeepZoomViewer.svelte";
  import StaticMap from '$lib/components/molecules/maps/StaticMap.svelte';
</script>

<div class="sticky-map-wrapper">
    <StaticMap />
</div>

<style>
    .sticky-map-wrapper {
        position: relative;
        width: 100vw;
        height: 100vh;
    }
</style>