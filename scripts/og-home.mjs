// Images de marque : accueils et catalogues FR/EN, avec une typographie native.
// Le JPEG versionné évite de réutiliser les anciennes cartes mises en cache.
import fs from 'node:fs';
import sharp from 'sharp';
import { OG, h, renderOgPng } from './og-kit.mjs';

const art = {
  home: fs.readFileSync(new URL('../public/illustrations/brand/l0g-home-aperture-v1.jpg', import.meta.url)),
  catalogue: fs.readFileSync(new URL('../public/illustrations/brand/l0g-publications-library-v1.jpg', import.meta.url)),
};
const titleGradient = `linear-gradient(90deg, ${OG.teal}, ${OG.rose})`;
const editions = [
  {
    section: 'home', lang: 'fr', file: 'l0g-finance-v2.jpg',
    labels: ['ENQUÊTES', 'DONNÉES', 'OUTILS'],
    title: ['Les angles morts', 'de la finance.'],
    tagline: ['Lire les mécanismes avant', 'qu’ils deviennent l’événement.'],
    footer: 'Sources primaires · analyse indépendante', domain: 'l0g.fr',
  },
  {
    section: 'home', lang: 'en', file: 'l0g-finance-en-v2.jpg',
    labels: ['INVESTIGATIONS', 'DATA', 'TOOLS'],
    title: ['Finance’s', 'blind spots.'],
    tagline: ['Understand the mechanisms', 'before they make headlines.'],
    footer: 'Primary sources · independent analysis', domain: 'l0g.fr/en',
  },
  {
    section: 'catalogue', lang: 'fr', file: 'publications-fr-v1.jpg',
    labels: ['COLLECTION', 'SOURCES', 'EPUB'],
    title: ['Les enquêtes', 'en livres.'],
    tagline: ['Des éditions numériques,', 'avec leurs sources et références.'],
    footer: 'Éditions numériques · accès libre', domain: 'l0g.fr/publications',
  },
  {
    section: 'catalogue', lang: 'en', file: 'publications-en-v1.jpg',
    labels: ['COLLECTION', 'SOURCES', 'EPUB'],
    title: ['Investigations', 'in EPUB.'],
    tagline: ['Long-form digital editions,', 'with sources and references.'],
    footer: 'Digital editions · open access', domain: 'l0g.fr/en/publications',
  },
];

const cardFor = (copy) => h('div', {
  position: 'relative', width: OG.width, height: OG.height, display: 'flex',
  overflow: 'hidden', backgroundColor: OG.ink, color: OG.bright,
  fontFamily: 'JetBrains Mono', fontWeight: 400,
},
  { type: 'img', props: {
    src: `data:image/jpeg;base64,${art[copy.section].toString('base64')}`,
    width: OG.width, height: OG.height,
    style: { position: 'absolute', left: 0, top: 0 },
  } },
  h('div', {
    position: 'absolute', left: 62, top: 46, display: 'flex',
    alignItems: 'baseline', fontSize: 50, fontWeight: 700, letterSpacing: -3,
  }, 'l', h('span', { color: OG.teal }, '0'), 'g', h('span', { color: OG.rose }, '_')),
  h('div', {
    position: 'absolute', left: 64, top: 172, display: 'flex',
    alignItems: 'center', gap: 15, fontSize: 17, letterSpacing: 1.4,
  },
    h('span', { color: OG.teal }, copy.labels[0]),
    h('span', { color: OG.muted }, '/'),
    h('span', { color: OG.paper }, copy.labels[1]),
    h('span', { color: OG.muted }, '/'),
    h('span', { color: OG.rose }, copy.labels[2]),
  ),
  h('div', {
    position: 'absolute', left: 60, top: 227, display: 'flex',
    flexDirection: 'column', gap: 5, fontSize: 56, lineHeight: 1.15,
    letterSpacing: -2.6,
  },
    h('div', { display: 'flex' }, copy.title[0]),
    h('div', { display: 'flex' }, h('span', {
      color: 'transparent', backgroundImage: titleGradient, backgroundClip: 'text',
    }, copy.title[1])),
  ),
  h('div', {
    position: 'absolute', left: 64, top: 398, display: 'flex',
    flexDirection: 'column', gap: 5, color: OG.paper,
    fontSize: 20, lineHeight: 1.45,
  },
    h('div', { display: 'flex' }, copy.tagline[0]),
    h('div', { display: 'flex' }, copy.tagline[1]),
  ),
  h('div', {
    position: 'absolute', left: 64, right: 64, top: 526, height: 1,
    backgroundImage: `linear-gradient(90deg, ${OG.teal}55, ${OG.rose}30, transparent)`,
  }),
  h('div', {
    position: 'absolute', left: 64, top: 553, display: 'flex',
    color: OG.muted, fontSize: 17, letterSpacing: 0.2,
  }, copy.footer),
  h('div', {
    position: 'absolute', right: 64, top: 548, display: 'flex',
    color: OG.bright, fontSize: 24,
  }, copy.domain),
);

for (const edition of editions) {
  const png = await renderOgPng(cardFor(edition));
  // L’ancien PNG reste disponible pour les liens déjà partagés.
  if (edition.section === 'home' && edition.lang === 'fr') fs.writeFileSync('public/og-home.png', png);
  const jpeg = await sharp(png).jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true }).toBuffer();
  const directory = `public/og/${edition.section}`;
  fs.mkdirSync(directory, { recursive: true });
  const output = `${directory}/${edition.file}`;
  fs.writeFileSync(output, jpeg);
  console.log(`[og-home] ${edition.lang} : 1200 × 630, JPEG ${jpeg.length} octets : ${output}`);
}
