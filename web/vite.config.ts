import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  optimizeDeps: {
    exclude: ['maplibre-gl']
  },
  ssr: {
    noExternal: ['maplibre-gl']
  }
});