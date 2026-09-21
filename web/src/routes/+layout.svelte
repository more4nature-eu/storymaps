<script lang="ts">
  import "$lib/styles/global.css";
  import Header from "$lib/components/organisms/templates/Header.svelte";
  import Footer from "$lib/components/organisms/templates/Footer.svelte";
  import { page } from "$app/state";
  
  let { children } = $props();
  const isDark = $derived(page.data.isDark ?? false);
</script>

<Header /> 

<main>
  {@render children()}
</main>

<style>
  main {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
</style>