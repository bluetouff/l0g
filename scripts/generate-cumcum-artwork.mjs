import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { h, fonts, OG } from './og-kit.mjs';
import { cumcumEditions } from '../src/config/cumcum-publication.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);

/** Native typesetting keeps both editions exact around original conceptual artwork. */
export async function renderCumCumCover(lang, artwork) {
  if (!Object.hasOwn(cumcumEditions, lang)) throw new Error('Unsupported cum-cum edition language');
  const isEn = lang === 'en';
  const book = cumcumEditions[lang];
  const expectedTitle = isEn ? 'Cum-cum: The Tax Battle' : 'Cum-cum : la bataille de l’impôt';
  if (book.title !== expectedTitle || book.chapters.length !== 6 || book.figureCount !== 26) throw new Error('Cum-cum cover metadata mismatch');
  const art = await sharp(artwork).resize(1024, 1638, { fit: 'cover' }).png().toBuffer();
  const lines = isEn ? ['The Tax', 'Battle'] : ['La bataille', 'de l’impôt'];
  const tree = h('div', { position: 'relative', width: 1024, height: 1638, display: 'flex', fontFamily: 'JetBrains Mono', background: OG.ink, color: OG.bright },
    { type: 'img', props: { src: `data:image/png;base64,${art.toString('base64')}`, style: { position: 'absolute', width: 1024, height: 1638, left: 0, top: 0 } } },
    h('div', { position: 'absolute', left: 0, top: 0, width: 1024, height: 630, backgroundImage: 'linear-gradient(180deg, rgba(11,13,16,.93), rgba(11,13,16,.7) 66%, rgba(11,13,16,0))' }),
    h('div', { position: 'absolute', left: 0, bottom: 0, width: 1024, height: 300, backgroundImage: 'linear-gradient(0deg, rgba(11,13,16,1), rgba(11,13,16,.88) 60%, rgba(11,13,16,0))' }),
    h('div', { position: 'absolute', left: 72, right: 72, top: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
      h('div', { display: 'flex', fontSize: 48, fontWeight: 700, letterSpacing: -3 }, 'l', h('span', { color: OG.teal }, '0'), 'g'),
      h('span', { color: OG.teal, fontSize: 18, letterSpacing: 1.5 }, isEn ? 'DOCUMENTARY INVESTIGATION' : 'ENQUÊTE DOCUMENTAIRE')),
    h('div', { position: 'absolute', left: 68, right: 60, top: 170, display: 'flex', flexDirection: 'column' },
      h('div', { display: 'flex', fontSize: 120, fontWeight: 700, letterSpacing: -6, lineHeight: 1.08 }, 'CUM-CUM'),
      h('div', { display: 'flex', width: 104, height: 3, backgroundColor: OG.amber, marginTop: 28, marginBottom: 28 }),
      ...lines.map((line, index) => h('div', { display: 'flex', fontSize: 76, lineHeight: 1.14, fontWeight: 700, letterSpacing: -3, color: index === 1 ? OG.teal : OG.bright }, line))),
    h('div', { position: 'absolute', left: 72, right: 72, bottom: 62, display: 'flex', flexDirection: 'column', gap: 22 },
      h('div', { display: 'flex', color: OG.bright, fontSize: 26 }, isEn ? 'Six investigations into dividend arbitrage' : 'Six enquêtes sur l’arbitrage de dividendes'),
      h('div', { display: 'flex', color: '#b8bec7', fontSize: 22 }, isEn ? '26 infographics · Sources · Glossary' : '26 infographies · Sources · Glossaire'),
      h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#b8bec7', fontSize: 19 },
        h('span', {}, isEn ? 'OCTOBER 2026' : 'OCTOBRE 2026'), h('span', { color: OG.teal }, 'bluetouff · l0g.fr'))));
  const svg = await satori(tree, { width: 1024, height: 1638, fonts });
  return { svg, image: new Resvg(svg).render().asPng() };
}

export async function generateCumCumArtwork() {
  const portrait = readFileSync(join(ROOT, 'src/epub-assets/cumcum-cover-art.png'));
  const panorama = readFileSync(join(ROOT, 'src/epub-assets/cumcum-panorama.png'));
  for (const lang of ['fr', 'en']) {
    const book = cumcumEditions[lang];
    const { image } = await renderCumCumCover(lang, portrait);
    writeFileSync(join(ROOT, 'src/epub-assets', `${book.directory}-cover.png`), image);
    const output = join(ROOT, 'public', book.cover);
    mkdirSync(dirname(output), { recursive: true });
    const jpeg = await sharp(image).jpeg({ quality: 88, mozjpeg: true }).toBuffer();
    if (jpeg.length > 500_000) throw new Error('Cum-cum cover exceeds image budget');
    writeFileSync(output, jpeg);
    for (const width of [320, 640, 960]) await sharp(image).resize({ width }).webp({ quality: 84 }).toFile(output.replace('.jpg', `-${width}.webp`));
  }
  const output = join(ROOT, 'public/publications/cumcum-publication-panorama.jpg');
  const wide = await sharp(panorama).resize(1600, 800, { fit: 'cover' }).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  writeFileSync(output, wide);
  for (const width of [640, 960, 1600]) await sharp(wide).resize({ width }).webp({ quality: 82 }).toFile(output.replace('.jpg', `-${width}.webp`));
  const social = join(ROOT, 'public/publications/og/art/cumcum-v1.jpg');
  mkdirSync(dirname(social), { recursive: true });
  await sharp(panorama).resize(1200, 630, { fit: 'cover', position: 'right' }).jpeg({ quality: 88, mozjpeg: true }).toFile(social);
  console.log('Cum-cum: two native portrait covers, independent panorama and landscape social artwork.');
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) await generateCumCumArtwork();
