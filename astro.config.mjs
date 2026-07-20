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
    build: {
      // Astro réutilise ce seuil pour décider d'injecter un petit chunk JS
      // directement dans le HTML. La CSP Apache interdit ce mode d'exécution.
      assetsInlineLimit: (filePath) => filePath.endsWith('.js') ? false : undefined,
    },
  },

  // Les scripts applicatifs sont externalisés par Astro. Apache peut ainsi
  // interdire tout JavaScript inline dans son CSP sans alourdir chaque page.
  build: {
    inlineStylesheets: 'auto',
  },
});
