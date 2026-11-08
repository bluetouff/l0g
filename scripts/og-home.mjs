// Illustration originale, typographie native et image sociale statique de la home.
// Le JPEG versionné évite de réutiliser les anciennes cartes mises en cache.
import fs from 'node:fs';
import sharp from 'sharp';
import { OG, h, renderOgPng } from './og-kit.mjs';

const art = fs.readFileSync(new URL('../public/illustrations/brand/l0g-home-aperture-v1.jpg', import.meta.url));
const titleGradient = `linear-gradient(90deg, ${OG.teal}, ${OG.rose})`;
const card = h('div', {
  position: 'relative', width: OG.width, height: OG.height, display: 'flex',
  overflow: 'hidden', backgroundColor: OG.ink, color: OG.bright,
  fontFamily: 'JetBrains Mono', fontWeight: 400,
},
  { type: 'img', props: {
    src: `data:image/jpeg;base64,${art.toString('base64')}`,
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
    h('span', { color: OG.teal }, 'ENQUÊTES'),
    h('span', { color: OG.muted }, '/'),
    h('span', { color: OG.paper }, 'DONNÉES'),
    h('span', { color: OG.muted }, '/'),
    h('span', { color: OG.rose }, 'OUTILS'),
  ),
  h('div', {
    position: 'absolute', left: 60, top: 227, display: 'flex',
    flexDirection: 'column', gap: 5, fontSize: 56, lineHeight: 1.15,
    letterSpacing: -2.6,
  },
    h('div', { display: 'flex' }, 'Les angles morts'),
    h('div', { display: 'flex' }, h('span', {
      color: 'transparent', backgroundImage: titleGradient, backgroundClip: 'text',
    }, 'de la finance.')),
  ),
  h('div', {
    position: 'absolute', left: 64, top: 398, display: 'flex',
    flexDirection: 'column', gap: 5, color: OG.paper,
    fontSize: 20, lineHeight: 1.45,
  },
    h('div', { display: 'flex' }, 'Lire les mécanismes avant'),
    h('div', { display: 'flex' }, 'qu’ils deviennent l’événement.'),
  ),
  h('div', {
    position: 'absolute', left: 64, right: 64, top: 526, height: 1,
    backgroundImage: `linear-gradient(90deg, ${OG.teal}55, ${OG.rose}30, transparent)`,
  }),
  h('div', {
    position: 'absolute', left: 64, top: 553, display: 'flex',
    color: OG.muted, fontSize: 17, letterSpacing: 0.2,
  }, 'Sources primaires · analyse indépendante'),
  h('div', {
    position: 'absolute', right: 64, top: 548, display: 'flex',
    color: OG.bright, fontSize: 24,
  }, 'l0g.fr'),
);

const png = await renderOgPng(card);
// L’ancien PNG reste disponible pour les liens déjà partagés.
fs.writeFileSync('public/og-home.png', png);
fs.mkdirSync('public/og/home', { recursive: true });
const jpeg = await sharp(png).jpeg({ quality: 90, chromaSubsampling: '4:4:4', mozjpeg: true }).toBuffer();
fs.writeFileSync('public/og/home/l0g-finance-v2.jpg', jpeg);
console.log(`[og-home] 1200 × 630, JPEG ${jpeg.length} octets : public/og/home/l0g-finance-v2.jpg`);
