import { defineConfig } from 'astro/config';

// Salida estática: Cloudflare Pages sirve /dist tal cual.
// No hace falta adaptador mientras no uses SSR.
export default defineConfig({
  site: 'https://nuriaiglesias.com',
  output: 'static',
  build: { inlineStylesheets: 'auto' }
});
