import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { h, fonts, OG } from './og-kit.mjs';
import { ordinaryMachinesEditions } from '../src/config/ordinary-machines-publication.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);

/** Typeset exact native titles around the original, text-free conceptual art. */
export async function renderOrdinaryMachinesCover(lang, artwork) {
  if (!Object.hasOwn(ordinaryMachinesEditions, lang)) throw new Error('Unsupported machines edition');
  const book = ordinaryMachinesEditions[lang];
  if (book.chapters.length !== 7 || book.figureCount !== 33) throw new Error('Machines cover corpus mismatch');
  const isEn = lang === 'en';
  const lines = isEn ? ['The War on', 'Everyday', 'Machines'] : ['La guerre', 'des machines', 'ordinaires'];
  if (lines.join(' ') !== book.title) throw new Error('Machines cover title mismatch');
  const art = await sharp(artwork).resize(1024, 1638, { fit: 'cover' }).png().toBuffer();
  const tree = h('div', { position: 'relative', width: 1024, height: 1638, display: 'flex', fontFamily: 'JetBrains Mono', background: OG.ink, color: OG.bright },
    { type: 'img', props: { src: `data:image/png;base64,${art.toString('base64')}`, style: { position: 'absolute', width: 1024, height: 1638, left: 0, top: 0 } } },
    h('div', { position: 'absolute', left: 0, top: 0, width: 1024, height: 670, backgroundImage: 'linear-gradient(180deg, rgba(12,13,16,.7), rgba(12,13,16,.45) 68%, rgba(12,13,16,0))' }),
    h('div', { position: 'absolute', left: 0, bottom: 0, width: 1024, height: 310, backgroundImage: 'linear-gradient(0deg, #0c0d10, rgba(12,13,16,.92) 58%, rgba(12,13,16,0))' }),
    h('div', { position: 'absolute', left: 70, right: 70, top: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
      h('div', { display: 'flex', fontSize: 48, fontWeight: 700, letterSpacing: -3 }, 'l', h('span', { color: OG.teal }, '0'), 'g'),
      h('span', { color: OG.teal, fontSize: 18, letterSpacing: 1.4 }, isEn ? 'DOCUMENTARY INVESTIGATION' : 'ENQUÊTE DOCUMENTAIRE')),
    h('div', { position: 'absolute', left: 66, right: 60, top: 170, display: 'flex', flexDirection: 'column' },
      ...lines.map((line, i) => h('div', { display: 'flex', fontSize: 86, fontWeight: 700, letterSpacing: -4, lineHeight: 1.12, color: i === 2 ? OG.teal : OG.bright }, line)),
      h('div', { display: 'flex', width: 112, height: 3, backgroundColor: OG.amber, marginTop: 28, marginBottom: 24 }),
      h('div', { display: 'flex', fontSize: 25, lineHeight: 1.45, maxWidth: 820, color: '#d9dde4' }, book.subtitle)),
    h('div', { position: 'absolute', left: 70, right: 70, bottom: 62, display: 'flex', flexDirection: 'column', gap: 20 },
      h('div', { display: 'flex', fontSize: 28, color: OG.bright }, isEn ? 'Seven complete investigations' : 'Sept enquêtes intégrales'),
      h('div', { display: 'flex', fontSize: 22, color: '#c5cbd4' }, isEn ? '33 infographics · Sources · Glossary' : '33 infographies · Sources · Glossaire'),
      h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 19, color: '#c5cbd4' },
        h('span', {}, isEn ? 'NOVEMBER 2026' : 'NOVEMBRE 2026'), h('span', { color: OG.teal }, 'bluetouff · l0g.fr'))));
  const svg = await satori(tree, { width: 1024, height: 1638, fonts });
  return { svg, image: new Resvg(svg).render().asPng() };
}

export async function generateOrdinaryMachinesArtwork() {
  const portrait = readFileSync(join(ROOT, 'src/epub-assets/ordinary-machines-cover-art.png'));
  const panorama = readFileSync(join(ROOT, 'src/epub-assets/ordinary-machines-panorama.png'));
  for (const lang of ['fr', 'en']) {
    const book = ordinaryMachinesEditions[lang];
    const { image } = await renderOrdinaryMachinesCover(lang, portrait);
    writeFileSync(join(ROOT, 'src/epub-assets', `${book.directory}-cover.png`), image);
    const output = join(ROOT, 'public', book.cover);
    mkdirSync(dirname(output), { recursive: true });
    const jpeg = await sharp(image).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
    if (jpeg.length > 500_000) throw new Error('Machines cover exceeds image budget');
    writeFileSync(output, jpeg);
    for (const width of [320, 640, 960]) await sharp(image).resize({ width }).webp({ quality: 84 }).toFile(output.replace('.jpg', `-${width}.webp`));
  }
  const output = join(ROOT, 'public/publications/ordinary-machines-publication-panorama.jpg');
  const wide = await sharp(panorama).resize(1600, 800, { fit: 'cover' }).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  writeFileSync(output, wide);
  for (const width of [640, 960, 1600]) await sharp(wide).resize({ width }).webp({ quality: 82 }).toFile(output.replace('.jpg', `-${width}.webp`));
  const social = join(ROOT, 'public/publications/og/art/ordinary-machines-v1.jpg');
  mkdirSync(dirname(social), { recursive: true });
  await sharp(panorama).resize(1200, 630, { fit: 'cover', position: 'right' }).jpeg({ quality: 88, mozjpeg: true }).toFile(social);
  console.log('Machines: two native portrait covers, panorama and dedicated landscape social art.');
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) await generateOrdinaryMachinesArtwork();
