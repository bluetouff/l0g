import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import sharp from 'sharp';
import { trumpWarChestEditions } from '../src/config/trump-war-chest-publication.mjs';
import { fonts, h, OG } from './og-kit.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const portraitWidth = 1024;
const portraitHeight = 1536;
const regularFonts = fonts.filter(font => font.weight === 400);
const coverCopy = {
  fr: {
    lines: ['Le trésor de guerre', 'du clan Trump'], sizes: [76, 94],
    imprint: 'ÉDITIONS L0G', collection: 'Six enquêtes',
  },
  en: {
    lines: ['The Trump Clan’s', 'War Chest'], sizes: [82, 101],
    imprint: 'L0G PUBLICATIONS', collection: 'Six investigations',
  },
};

export async function renderTrumpWarChestCover(book, art) {
  const copy = coverCopy[book.lang];
  if (!copy || copy.lines.join(' ') !== book.title) throw new Error(`War chest cover title mismatch: ${book.directory}`);
  const { width, height } = await sharp(art).metadata();
  if (width !== portraitWidth || height !== portraitHeight) throw new Error('War chest cover artwork must be 1024 × 1536');

  const illustration = { type: 'img', props: {
    src: `data:image/jpeg;base64,${art.toString('base64')}`,
    style: { position: 'absolute', left: 0, top: 0, width, height },
  } };
  const layout = h('div', {
    position: 'relative', width, height, display: 'flex',
    fontFamily: 'JetBrains Mono', fontWeight: 400, color: OG.bright, backgroundColor: OG.ink,
  },
  illustration,
  h('div', {
    position: 'absolute', left: 0, top: 0, width, height,
    backgroundImage: 'linear-gradient(180deg, rgba(12,13,16,.54), rgba(12,13,16,.45) 24%, rgba(12,13,16,.09) 48%, rgba(12,13,16,0) 66%, rgba(12,13,16,.2) 83%, rgba(12,13,16,.68) 100%)',
  }),
  h('div', {
    position: 'absolute', left: 70, right: 70, top: 59, display: 'flex',
    alignItems: 'center', justifyContent: 'space-between',
  },
  h('div', { display: 'flex', fontSize: 43, letterSpacing: -3 },
    'l', h('span', { color: OG.teal }, '0'), 'g', h('span', { color: OG.rose, marginLeft: 9 }, '_')),
  h('span', { color: '#d1e3e6', letterSpacing: 2.2, fontSize: 17 }, copy.imprint)),
  h('div', {
    position: 'absolute', left: 70, right: 68, top: 160, display: 'flex', flexDirection: 'column',
  },
  ...copy.lines.map((line, i) => h('div', {
    display: 'flex', fontSize: copy.sizes[i], lineHeight: 1.10, letterSpacing: -4,
    color: i === 0 ? OG.bright : '#a5e6de',
  }, line)),
  h('div', { display: 'flex', width: 74, height: 2, backgroundColor: '#d4a473', marginTop: 25, marginBottom: 22 }),
  h('span', { color: '#e3e9e9', fontSize: 27, lineHeight: 1.35, letterSpacing: -0.8 }, book.subtitle)),
  h('div', {
    position: 'absolute', left: 70, right: 70, bottom: 60, display: 'flex', flexDirection: 'column', gap: 16,
  },
  h('span', { fontSize: 28, letterSpacing: -1 }, 'bluetouff'),
  h('div', { width: '100%', height: 1, backgroundColor: '#b5d6da62' }),
  h('div', { display: 'flex', justifyContent: 'space-between', fontSize: 18, color: '#dee8ec' },
    h('span', {}, copy.collection), h('span', { color: '#a5e6de' }, 'l0g.fr'))));
  const svg = await satori(layout, { width, height, fonts: regularFonts });
  return new Resvg(svg).render().asPng();
}

export async function generateTrumpWarChestArtwork() {
  const portrait = readFileSync(resolve(root, 'src/epub-assets/trump-war-chest-cover-art.jpg'));
  for (const book of Object.values(trumpWarChestEditions)) {
    const rendered = await renderTrumpWarChestCover(book, portrait);
    const cover = resolve(root, 'public', book.cover.slice(1));
    mkdirSync(dirname(cover), { recursive: true });
    const jpeg = await sharp(rendered).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
    if (jpeg.length > 500_000) throw new Error(`War chest cover exceeds image budget: ${book.directory}`);
    writeFileSync(cover, jpeg);
    for (const width of [320, 640, 960]) {
      await sharp(rendered).resize({ width }).webp({ quality: 84 }).toFile(cover.replace(/\.jpg$/u, `-${width}.webp`));
    }
  }

  const panorama = readFileSync(resolve(root, 'src/epub-assets/trump-war-chest-panorama.jpg'));
  const { width, height } = await sharp(panorama).metadata();
  if (width !== 1600 || height !== 840) throw new Error('War chest panorama must be 1600 × 840');
  const landscape = resolve(root, 'public/publications/trump-war-chest-publication-panorama');
  writeFileSync(`${landscape}.jpg`, panorama);
  for (const width of [640, 960, 1600]) {
    await sharp(panorama).resize({ width }).webp({ quality: 84 }).toFile(`${landscape}-${width}.webp`);
  }
  const social = resolve(root, 'public/publications/og/art/trump-war-chest-v1.jpg');
  mkdirSync(dirname(social), { recursive: true });
  await sharp(panorama).resize(1200, 630, { fit: 'fill' }).jpeg({ quality: 90, mozjpeg: true }).toFile(social);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await generateTrumpWarChestArtwork();
}
