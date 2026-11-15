import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { h, fonts, OG } from './og-kit.mjs';
import { nvidiaEditions } from '../src/config/nvidia-publication.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);

/** Add exact bilingual typography to the original conceptual cover artwork. */
export async function renderNvidiaCover(lang, artwork) {
  if (!Object.hasOwn(nvidiaEditions, lang)) throw new Error('Unsupported Nvidia edition');
  const book = nvidiaEditions[lang];
  if (book.chapters.length !== 12 || book.figureCount !== 26) throw new Error('Nvidia cover corpus mismatch');
  const isEn = lang === 'en';
  const lines = isEn ? ['The Nvidia', 'System'] : ['Le système', 'Nvidia'];
  if (lines.join(' ') !== book.title) throw new Error('Nvidia cover title mismatch');
  const art = await sharp(artwork).resize(1024, 1536, { fit: 'cover' }).png().toBuffer();
  const tree = h('div', { position: 'relative', width: 1024, height: 1536, display: 'flex', fontFamily: 'JetBrains Mono', background: '#071215', color: OG.bright },
    { type: 'img', props: { src: `data:image/png;base64,${art.toString('base64')}`, style: { position: 'absolute', width: 1024, height: 1536, left: 0, top: 0 } } },
    h('div', { position: 'absolute', left: 0, bottom: 0, width: 1024, height: 230, backgroundImage: 'linear-gradient(0deg, #071215, rgba(7,18,21,.92) 50%, rgba(7,18,21,0))' }),
    h('div', { position: 'absolute', left: 70, right: 70, top: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
      h('div', { display: 'flex', fontSize: 43, fontWeight: 700, letterSpacing: -3 }, 'l', h('span', { color: OG.teal }, '0'), 'g'),
      h('span', { color: OG.teal, fontSize: 17, letterSpacing: 1.5 }, isEn ? 'DOCUMENTED INVESTIGATION' : 'ENQUÊTE DOCUMENTAIRE')),
    h('div', { position: 'absolute', left: 66, right: 60, top: 155, display: 'flex', flexDirection: 'column' },
      ...lines.map((line, index) => h('div', { display: 'flex', fontSize: 91, fontWeight: 700, letterSpacing: -4.5, lineHeight: 1.1, color: index === 1 ? OG.teal : OG.bright }, line)),
      h('div', { display: 'flex', width: 105, height: 2, backgroundColor: '#eeb56b', marginTop: 29, marginBottom: 23 }),
      h('div', { display: 'flex', fontSize: 25, lineHeight: 1.5, maxWidth: 810, color: '#d9e2e3' }, book.subtitle)),
    h('div', { position: 'absolute', left: 70, right: 70, bottom: 58, display: 'flex', flexDirection: 'column', gap: 16 },
      h('div', { display: 'flex', fontSize: 25, color: OG.bright }, isEn ? 'Twelve complete analyses' : 'Douze analyses intégrales'),
      h('div', { display: 'flex', fontSize: 19, color: '#c5d1d3' }, isEn ? '26 infographics · References · Glossary' : '26 infographies · Sources · Glossaire'),
      h('div', { display: 'flex', justifyContent: 'space-between', fontSize: 17, marginTop: 6, color: '#c5d1d3' },
        h('span', {}, isEn ? 'NOVEMBER 2026' : 'NOVEMBRE 2026'), h('span', { color: OG.teal }, 'bluetouff · l0g.fr'))));
  const svg = await satori(tree, { width: 1024, height: 1536, fonts });
  return { svg, image: new Resvg(svg).render().asPng() };
}

export async function generateNvidiaArtwork() {
  const portrait = readFileSync(join(ROOT, 'src/epub-assets/nvidia-cover-art.png'));
  const panorama = readFileSync(join(ROOT, 'src/epub-assets/nvidia-panorama.png'));
  for (const lang of ['fr', 'en']) {
    const book = nvidiaEditions[lang];
    const { image } = await renderNvidiaCover(lang, portrait);
    writeFileSync(join(ROOT, 'src/epub-assets', `${book.directory}-cover.png`), image);
    const output = join(ROOT, 'public', book.cover);
    mkdirSync(dirname(output), { recursive: true });
    const jpeg = await sharp(image).jpeg({ quality: 89, mozjpeg: true }).toBuffer();
    if (jpeg.length > 500_000) throw new Error('Nvidia cover exceeds image budget');
    writeFileSync(output, jpeg);
    for (const width of [320, 640, 960]) await sharp(image).resize({ width }).webp({ quality: 84 }).toFile(output.replace('.jpg', `-${width}.webp`));
  }
  const output = join(ROOT, 'public/publications/nvidia-publication-panorama.jpg');
  const wide = await sharp(panorama).resize(1600, 800, { fit: 'cover' }).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  writeFileSync(output, wide);
  for (const width of [640, 960, 1600]) await sharp(wide).resize({ width }).webp({ quality: 82 }).toFile(output.replace('.jpg', `-${width}.webp`));
  const social = join(ROOT, 'public/publications/og/art/nvidia-v1.jpg');
  mkdirSync(dirname(social), { recursive: true });
  await sharp(panorama).resize(1200, 630, { fit: 'cover', position: 'right' }).jpeg({ quality: 88, mozjpeg: true }).toFile(social);
  console.log('Nvidia: two native portrait covers, panorama and dedicated landscape social artwork.');
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) await generateNvidiaArtwork();
