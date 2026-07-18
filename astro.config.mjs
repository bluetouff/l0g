// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { glossaryRedirects } from './src/config/glossary-redirects.mjs';
import { glossaryAtlasEntries } from './src/config/glossary.ts';

const indexedGlossaryUrls = new Set(glossaryAtlasEntries.map((entry) => `https://l0g.fr${entry.url}`));

// https://astro.build/config
export default defineConfig({
  site: 'https://l0g.fr',

  // Sortie 100% statique : aucun runtime ne tourne sur zen.
  // (Pas d'adapter = build statique par défaut.)

  integrations: [mdx(), sitemap({
    filter: (page) => page === 'https://l0g.fr/glossaire/'
      || !page.startsWith('https://l0g.fr/glossaire/')
      || indexedGlossaryUrls.has(page),
  })],

  redirects: Object.fromEntries(
    Object.entries(glossaryRedirects).map(([from, to]) => [from, { status: 301, destination: to }])
  ),

  vite: {
    plugins: [tailwindcss()],
  },

  // La CSP est gérée au niveau Apache (deploy/l0g.fr.apache.conf) pour
  // pouvoir whitelister proprement les domaines TradingView des embeds.
  build: {
    inlineStylesheets: 'auto',
  },
});
