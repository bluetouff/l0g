import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { h, fonts, OG } from './og-kit.mjs';
import { renderArticleSocialSvg } from './article-social-card.mjs';
import { aiCreditorsEditions } from '../src/config/ai-creditors-publication.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const regularFonts = fonts.filter(font => font.weight === 400);

/** Native publisher typography over a separate, original conceptual artwork. */
export async function renderAiCreditorsCover(lang, artwork, { onNodeDetected } = {}) {
  if (!Object.hasOwn(aiCreditorsEditions, lang)) throw new TypeError('Unsupported AI-creditors edition');
  const book = aiCreditorsEditions[lang], isEn = lang === 'en';
  if (book.chapters.length !== 6 || book.figureCount !== 17) throw new Error('AI-creditors cover corpus mismatch');
  const lines = isEn ? ['AI’s', 'creditors'] : ['Les créanciers', 'de l’IA'];
  if (lines.join(' ') !== book.title) throw new Error('AI-creditors cover title mismatch');
  const meta = await sharp(artwork).metadata();
  if (!meta.width || !meta.height || meta.width * 1536 !== meta.height * 1024) throw new Error('Portrait artwork must retain its 2:3 composition');
  const image = await sharp(artwork).resize(1024, 1536, { fit: 'fill' }).png().toBuffer();
  const tree = h('div', { position: 'relative', width: 1024, height: 1536, display: 'flex', fontFamily: 'JetBrains Mono', fontWeight: 400, backgroundColor: OG.ink, color: OG.bright },
    { type: 'img', props: { src: `data:image/png;base64,${image.toString('base64')}`, style: { position: 'absolute', width: 1024, height: 1536, left: 0, top: 0 } } },
    h('div', { position: 'absolute', left: 0, bottom: 0, width: 1024, height: 230, backgroundImage: 'linear-gradient(0deg, rgba(12,13,16,.64), rgba(12,13,16,.18) 55%, rgba(12,13,16,0))' }),
    h('div', { position: 'absolute', left: 66, right: 66, top: 57, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
      h('div', { display: 'flex', fontSize: 43, letterSpacing: -3 }, 'l', h('span', { color: OG.teal }, '0'), 'g', h('span', { color: OG.rose, marginLeft: 9 }, '_')),
      h('span', { color: '#b2c8c8', fontSize: 15, letterSpacing: 1.1 }, isEn ? 'DOCUMENTED INVESTIGATION' : 'ENQUÊTE DOCUMENTAIRE')),
    h('div', { position: 'absolute', left: 66, right: 66, top: 146, display: 'flex', flexDirection: 'column' },
      ...lines.map((line, i) => h('div', { display: 'flex', fontSize: 76, letterSpacing: -3.4, lineHeight: 1.15, color: i ? OG.teal : OG.bright }, line)),
      h('div', { display: 'flex', width: 82, height: 1, backgroundColor: OG.rose, marginTop: 24, marginBottom: 20 }),
      h('div', { display: 'flex', fontSize: 24, lineHeight: 1.45, color: '#d9e2e3' }, book.subtitle)),
    h('div', { position: 'absolute', left: 66, right: 66, bottom: 55, display: 'flex', flexDirection: 'column', gap: 15 },
      h('div', { display: 'flex', fontSize: 24 }, isEn ? 'Six complete investigations' : 'Six enquêtes intégrales'),
      h('div', { display: 'flex', fontSize: 19, color: '#c7d3d4' }, isEn ? '17 infographics · References · Glossary' : '17 infographies · Sources · Glossaire'),
      h('div', { display: 'flex', justifyContent: 'space-between', fontSize: 16, marginTop: 7, color: '#b9c7c9' },
        h('span', {}, isEn ? 'NOVEMBER 2026' : 'NOVEMBRE 2026'), h('span', { color: OG.teal }, 'bluetouff · l0g.fr'))));
  const svg = await satori(tree, { width: 1024, height: 1536, fonts: regularFonts, onNodeDetected });
  return { svg, image: new Resvg(svg).render().asPng() };
}

/** A full-frame publication card reusing the reviewed regular-weight overlay. */
export async function renderAiCreditorsPublicationSocial(card, art, { onNodeDetected } = {}) {
  if (card.key !== 'ai-creditors' || !Object.hasOwn(aiCreditorsEditions, card.lang)) throw new TypeError('Unsupported AI-creditors social card');
  const meta = await sharp(art).metadata();
  if (meta.width !== 1200 || meta.height !== 630) throw new Error(`Incorrect social artwork dimensions: ${card.art}`);
  const book = aiCreditorsEditions[card.lang];
  const overlay = {
    layout: 'immersive', lang: card.lang, image: card.image,
    title: card.titleLines.join(' '), description: card.subtitleLines.join(' '),
    label: card.lang === 'fr' ? 'ÉDITIONS L0G · EPUB GRATUIT' : 'L0G PUBLICATIONS · FREE EPUB',
    dateLabel: new Date(`${book.date}T12:00:00Z`).toLocaleDateString(card.lang === 'fr' ? 'fr-FR' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Europe/Paris' }).toLocaleUpperCase(card.lang),
  };
  const svg = await renderArticleSocialSvg(overlay, { onNodeDetected });
  const layer = new Resvg(svg).render().asPng();
  return { svg, image: await sharp(art).composite([{ input: layer }]).jpeg({ quality: 88, mozjpeg: true }).toBuffer() };
}

export async function generateAiCreditorsArtwork() {
  const portrait = readFileSync(join(ROOT, 'src/epub-assets/ai-creditors-cover-art.png'));
  const panorama = readFileSync(join(ROOT, 'src/epub-assets/ai-creditors-publication-art.png'));
  for (const lang of ['fr', 'en']) {
    const book = aiCreditorsEditions[lang];
    const { image } = await renderAiCreditorsCover(lang, portrait);
    writeFileSync(join(ROOT, 'src/epub-assets', `${book.directory}-cover.png`), image);
    const output = join(ROOT, 'public', book.cover);
    mkdirSync(dirname(output), { recursive: true });
    const jpeg = await sharp(image).jpeg({ quality: 91, mozjpeg: true }).toBuffer();
    if (jpeg.length > 500_000) throw new Error('AI-creditors cover exceeds image budget');
    writeFileSync(output, jpeg);
    for (const width of [320, 640, 960]) await sharp(image).resize({ width }).webp({ quality: 84 }).toFile(output.replace('.jpg', `-${width}.webp`));
  }
  // Preserve all four artwork edges, including the detailed lower foreground.
  const output = join(ROOT, 'public/publications/ai-creditors-publication-panorama.jpg');
  const wide = await sharp(panorama).resize(1600, 840, { fit: 'fill' }).jpeg({ quality: 89, mozjpeg: true }).toBuffer();
  writeFileSync(output, wide);
  for (const width of [640, 960, 1600]) await sharp(wide).resize({ width }).webp({ quality: 82 }).toFile(output.replace('.jpg', `-${width}.webp`));
  const social = join(ROOT, 'public/publications/og/art/ai-creditors-v1.jpg');
  mkdirSync(dirname(social), { recursive: true });
  await sharp(panorama).resize(1200, 630, { fit: 'fill' }).jpeg({ quality: 89, mozjpeg: true }).toFile(social);
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) await generateAiCreditorsArtwork();
