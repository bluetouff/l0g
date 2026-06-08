// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://l0g.fr',

  // Sortie 100% statique : aucun runtime ne tourne sur zen.
  // (Pas d'adapter = build statique par défaut.)

  integrations: [mdx(), sitemap()],

  vite: {
    plugins: [tailwindcss()],
  },

  // La CSP est gérée au niveau Apache (deploy/l0g.fr.apache.conf) pour
  // pouvoir whitelister proprement les domaines TradingView des embeds.
  build: {
    inlineStylesheets: 'auto',
  },
});
