import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { fonts, h, OG } from './og-kit.mjs';
import { nvidiaVolumeTwoEditions } from '../src/config/nvidia-volume-two-publication.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const asset = name => join(ROOT, 'src/epub-assets', name);
const output = name => join(ROOT, 'public/publications', name);
const prefix = 'nvidia-volume-two';
const background = '#071215';
const amber = '#eeb56b';
const coverWidth = 1024;
const coverHeight = 1536;

const labels = {
  fr: {
    slug: 'qui-gouverne-nvidia', title: 'Qui gouverne Nvidia ?',
    lines: ['Qui gouverne', 'Nvidia ?'], volume: 'TOME II', category: 'ENQUÊTE DOCUMENTAIRE',
    chapters: 'analyses intégrales', figures: 'infographies · Sources · Glossaire',
  },
  en: {
    slug: 'who-governs-nvidia', title: 'Who Governs Nvidia?',
    lines: ['Who Governs', 'Nvidia?'], volume: 'VOLUME II', category: 'DOCUMENTED INVESTIGATION',
    chapters: 'complete analyses', figures: 'infographics · References · Glossary',
  },
};

/** Typeset a localized portrait over the shared conceptual artwork. */
export async function renderNvidiaVolumeTwoCover(lang, artwork) {
  if (!Object.hasOwn(labels, lang)) throw new Error('Unsupported Nvidia volume II language');
  const book = nvidiaVolumeTwoEditions[lang];
  const copy = labels[lang];
  if (book?.title !== copy.title || book.cover !== `/publications/${copy.slug}-cover.jpg` || !book.subtitle || !book.chapters?.length || !Number.isSafeInteger(book.figureCount) || book.figureCount < 0) {
    throw new Error('Nvidia volume II cover metadata mismatch');
  }
  const date = new Intl.DateTimeFormat(book.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${book.date}T12:00:00Z`)).toLocaleUpperCase(book.locale);
  const portrait = await sharp(artwork).resize(coverWidth, coverHeight, { fit: 'cover' }).png().toBuffer();
  const tree = h('div', { width: coverWidth, height: coverHeight, position: 'relative', display: 'flex', fontFamily: 'JetBrains Mono', background, color: OG.bright },
    { type: 'img', props: { src: `data:image/png;base64,${portrait.toString('base64')}`, style: { position: 'absolute', width: coverWidth, height: coverHeight, left: 0, top: 0 } } },
    h('div', { position: 'absolute', left: 0, bottom: 0, width: coverWidth, height: 247, backgroundImage: 'linear-gradient(0deg, #071215, rgba(7,18,21,.93) 51%, rgba(7,18,21,0))' }),
    h('div', { position: 'absolute', left: 70, right: 70, top: 60, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
      h('div', { display: 'flex', fontSize: 43, fontWeight: 700, letterSpacing: -3 }, 'l', h('span', { color: OG.teal }, '0'), 'g'),
      h('div', { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 },
        h('div', { display: 'flex', letterSpacing: 2.1, fontSize: 27, color: amber }, copy.volume),
        h('div', { display: 'flex', letterSpacing: 1.4, fontSize: 17, color: OG.teal }, copy.category))),
    h('div', { position: 'absolute', left: 66, right: 60, top: 155, display: 'flex', flexDirection: 'column' },
      ...copy.lines.map((line, index) => h('div', { display: 'flex', fontSize: 91, fontWeight: 700, letterSpacing: -4.5, lineHeight: 1.1, color: index ? OG.teal : OG.bright }, line)),
      h('div', { display: 'flex', width: 105, height: 2, marginTop: 29, marginBottom: 23, backgroundColor: amber }),
      h('div', { display: 'flex', maxWidth: 810, fontSize: 25, lineHeight: 1.5, color: '#d9e2e3' }, book.subtitle)),
    h('div', { position: 'absolute', left: 70, right: 70, bottom: 58, display: 'flex', flexDirection: 'column', gap: 16 },
      h('div', { display: 'flex', fontSize: 25, color: OG.bright }, `${book.chapters.length} ${copy.chapters}`),
      h('div', { display: 'flex', fontSize: 19, color: '#c5d1d3' }, `${book.figureCount} ${copy.figures}`),
      h('div', { display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 17, color: '#c5d1d3' },
        h('span', {}, date), h('span', { color: OG.teal }, 'bluetouff · l0g.fr'))));
  const svg = await satori(tree, { width: coverWidth, height: coverHeight, fonts });
  return { svg, image: new Resvg(svg).render().asPng() };
}

export async function generateNvidiaVolumeTwoArtwork() {
  const portrait = readFileSync(asset(`${prefix}-cover-art.png`));
  const panorama = readFileSync(asset(`${prefix}-panorama.png`));
  const files = [];
  for (const [lang, copy] of Object.entries(labels)) {
    const { image } = await renderNvidiaVolumeTwoCover(lang, portrait);
    const jpeg = await sharp(image).jpeg({ quality: 89, mozjpeg: true }).toBuffer();
    if (jpeg.length >= 500_000) throw new Error(`Nvidia volume II ${lang} cover exceeds image budget`);
    files.push([asset(`${copy.slug}-cover.png`), image], [output(`${copy.slug}-cover.jpg`), jpeg]);
    for (const width of [320, 640, 960]) {
      const variant = await sharp(image).resize({ width }).webp({ quality: 84 }).toBuffer();
      if (variant.length >= 500_000) throw new Error(`Nvidia volume II ${lang} cover variant exceeds image budget`);
      files.push([output(`${copy.slug}-cover-${width}.webp`), variant]);
    }
  }
  const wide = await sharp(panorama).resize(1600, 800, { fit: 'cover' }).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  files.push([output(`${prefix}-publication-panorama.jpg`), wide]);
  for (const width of [640, 960, 1600]) {
    files.push([output(`${prefix}-publication-panorama-${width}.webp`), await sharp(wide).resize({ width }).webp({ quality: 82 }).toBuffer()]);
  }
  const social = await sharp(panorama).resize(1200, 630, { fit: 'cover', position: 'right' }).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
  if (wide.length >= 500_000 || social.length >= 500_000) throw new Error('Nvidia volume II landscape exceeds image budget');
  files.push([output(`og/art/${prefix}-v1.jpg`), social]);
  for (const [path, bytes] of files) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, bytes);
  }
  console.log('Nvidia volume II: localized covers, panorama, responsive variants and social artwork.');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await generateNvidiaVolumeTwoArtwork();
