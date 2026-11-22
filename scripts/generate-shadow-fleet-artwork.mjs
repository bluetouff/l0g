import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import sharp from 'sharp';
import { shadowFleetEditions } from '../src/config/shadow-fleet-publication.mjs';
import { fonts, h, OG } from './og-kit.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const publications = resolve(root, 'public/publications');
const portraitWidth = 1024;
const portraitHeight = 1536;

const coverCopy = {
  fr: { heading: ['La flotte', 'fantôme russe'], imprint: 'ÉDITIONS L0G', collection: 'Quatre enquêtes' },
  en: { heading: ['Russia’s', 'Shadow Fleet'], imprint: 'L0G PUBLICATIONS', collection: 'Four investigations' },
};

async function renderCover(book, art) {
  const image = { type: 'img', props: {
    src: `data:image/jpeg;base64,${art.toString('base64')}`,
    style: { position: 'absolute', left: 0, top: 0, width: portraitWidth, height: portraitHeight },
  } };
  const tree = h('div', {
    position: 'relative', width: portraitWidth, height: portraitHeight, display: 'flex',
    backgroundColor: OG.ink, color: OG.bright, fontFamily: 'JetBrains Mono', fontWeight: 400,
  },
  image,
  h('div', {
    position: 'absolute', inset: 0, width: portraitWidth, height: portraitHeight,
    backgroundImage: 'linear-gradient(180deg, rgba(0,10,20,.55), rgba(0,10,20,.46) 19%, rgba(0,10,20,.13) 39%, rgba(0,10,20,0) 60%, rgba(0,10,20,.16) 81%, rgba(0,10,20,.62) 100%)',
  }),
  h('div', {
    position: 'absolute', top: 62, left: 70, right: 70, display: 'flex',
    alignItems: 'center', justifyContent: 'space-between',
  },
  h('div', { display: 'flex', alignItems: 'center', letterSpacing: -3, fontSize: 44 },
    'l', h('span', { color: OG.teal }, '0'), 'g', h('span', { color: OG.rose, marginLeft: 9 }, '_')),
  h('span', { color: '#d1e3e6', letterSpacing: 2.5, fontSize: 17 }, book.imprint)),
  h('div', {
    position: 'absolute', top: 169, left: 70, right: 60, display: 'flex', flexDirection: 'column',
  },
  ...book.heading.map((line, index) => h('div', {
    display: 'flex', fontSize: 105, lineHeight: 1.07, letterSpacing: -6, color: index ? '#99e8df' : OG.bright,
  }, line)),
  h('div', { width: 75, height: 2, backgroundColor: '#dc9e75', marginTop: 28, marginBottom: 26 }),
  h('span', { color: '#e3eff0', fontSize: 28, letterSpacing: -0.9 }, book.subtitle)),
  h('div', {
    position: 'absolute', bottom: 63, left: 70, right: 70, display: 'flex', flexDirection: 'column', gap: 18,
  },
  h('span', { fontSize: 31, letterSpacing: -1 }, 'bluetouff'),
  h('div', { width: '100%', height: 1, backgroundColor: '#b5d6da77' }),
  h('div', { display: 'flex', justifyContent: 'space-between', fontSize: 19, color: '#dee8ec' },
    h('span', {}, book.collection), h('span', { color: '#99e8df' }, 'l0g.fr'))));
  const svg = await satori(tree, { width: portraitWidth, height: portraitHeight, fonts });
  return new Resvg(svg).render().asPng();
}

export async function generateShadowFleetArtwork() {
  const portrait = readFileSync(resolve(root, 'src/epub-assets/shadow-fleet-cover-art.jpg'));
  const { width: artWidth, height: artHeight } = await sharp(portrait).metadata();
  if (artWidth !== portraitWidth || artHeight !== portraitHeight) throw new Error('Expected the full-frame 2:3 cover artwork');
  for (const book of Object.values(shadowFleetEditions)) {
    const copy = coverCopy[book.lang];
    if (copy.heading.join(' ') !== book.title) throw new Error(`Cover title mismatch: ${book.directory}`);
    const rendered = await renderCover({ ...book, ...copy }, portrait);
    const path = resolve(publications, `${book.directory}-cover`);
    const jpeg = await sharp(rendered).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
    if (jpeg.length > 500_000) throw new Error(`Cover exceeds image budget: ${book.directory}`);
    writeFileSync(`${path}.jpg`, jpeg);
    for (const width of [320, 640, 960]) {
      await sharp(rendered).resize({ width }).webp({ quality: 84 }).toFile(`${path}-${width}.webp`);
    }
  }

  const panoramaPath = resolve(publications, 'shadow-fleet-publication-panorama');
  const panorama = readFileSync(resolve(root, 'src/epub-assets/shadow-fleet-panorama.jpg'));
  const { width, height } = await sharp(panorama).metadata();
  if (width !== 1600 || height !== 840) throw new Error('Expected the full-frame 1600 × 840 panorama');
  writeFileSync(`${panoramaPath}.jpg`, panorama);
  for (const width of [640, 960, 1600]) {
    await sharp(panorama).resize({ width }).webp({ quality: 83 }).toFile(`${panoramaPath}-${width}.webp`);
  }
  const socialDirectory = resolve(publications, 'og/art');
  mkdirSync(socialDirectory, { recursive: true });
  await sharp(panorama).resize(1200, 630).jpeg({ quality: 91, mozjpeg: true })
    .toFile(resolve(socialDirectory, 'shadow-fleet-v1.jpg'));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await generateShadowFleetArtwork();
}
