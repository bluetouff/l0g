// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { glossaryRedirects } from './src/config/glossary-redirects.mjs';
import { legacySurfaceRedirects } from './src/config/legacy-surface-redirects.mjs';
import { glossaryAtlasEntries } from './src/config/glossary.ts';
import { sitemapLastmod } from './src/config/sitemap-lastmod.mjs';
import { weeklySitemapLastmods } from './src/config/weekly-editions.ts';
import inlineHomeStyles from './scripts/inline-home-styles.mjs';

const indexedGlossaryUrls = new Set(glossaryAtlasEntries.map((entry) => `https://l0g.fr${entry.url}`));
const weeklyLastmods = weeklySitemapLastmods('https://l0g.fr');

// https://astro.build/config
export default defineConfig({
  site: 'https://l0g.fr',

  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
    },
  },

  // Sortie 100% statique : aucun runtime ne tourne sur zen.
  // (Pas d'adapter = build statique par défaut.)

  integrations: [mdx(), sitemap({
    filter: (page) => page !== 'https://l0g.fr/recherche/'
      && (
        page === 'https://l0g.fr/glossaire/'
        || !page.startsWith('https://l0g.fr/glossaire/')
        || indexedGlossaryUrls.has(page)
      ),
    serialize: (item) => ({
      ...item,
      lastmod: weeklyLastmods.get(item.url) ?? sitemapLastmod(item.url),
    }),
  }), inlineHomeStyles()],

  redirects: Object.fromEntries(
    Object.entries({
      ...glossaryRedirects,
      ...legacySurfaceRedirects,
    }).map(([from, to]) => [from, { status: 301, destination: to }])
  ),

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Astro réutilise ce seuil pour décider d'injecter un petit chunk JS
      // ou une petite police en data:. La CSP Apache interdit ces deux modes
      // d'exécution/chargement afin de garder script-src et font-src sur self.
      assetsInlineLimit: (filePath) => /\.(?:m?js|woff2?)$/i.test(filePath) ? false : undefined,
    },
  },

  // Les scripts applicatifs sont externalisés par Astro. Apache peut ainsi
  // interdire tout JavaScript inline dans son CSP sans alourdir chaque page.
  build: {
    inlineStylesheets: 'auto',
  },
});
