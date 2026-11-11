import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { OG, h, fonts } from './og-kit.mjs';
import { readArticleIllustration } from '../src/lib/article-social.mjs';
import { renderArticleWithCache } from './article-social-cache.mjs';

const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const regularFonts = fonts.filter(font => font.weight === 400);
const jpegOptions = { quality: 88, chromaSubsampling: '4:4:4' };
let rendererIdentity;

function overlay(card, size, titleTop) {
  return h('div', { position: 'relative', display: 'flex', width: 1200, height: 630, fontFamily: 'JetBrains Mono', fontWeight: 400, color: OG.paper },
    h('div', { position: 'absolute', left: 0, top: 0, width: 1200, height: 630, backgroundImage: 'linear-gradient(180deg, rgba(12,13,16,0.16) 0%, rgba(12,13,16,0.04) 32%, rgba(12,13,16,0.9) 57%, #0c0d10 70%)' }),
    h('div', { position: 'absolute', display: 'flex', alignItems: 'baseline', left: 56, top: 38, fontSize: 40, letterSpacing: '-3px' }, h('span', {}, 'l'), h('span', { color: OG.teal }, '0'), h('span', {}, 'g'), h('span', { color: OG.rose, marginLeft: 10 }, '_')),
    h('div', { position: 'absolute', display: 'flex', right: 56, top: 55, fontSize: 14, color: '#c0c7cf', letterSpacing: '1.4px' }, card.label),
    h('div', { position: 'absolute', left: 56, top: titleTop - 22, width: 32, height: 1, backgroundColor: OG.teal }),
    h('div', { position: 'absolute', left: 94, top: titleTop - 22, width: 7, height: 1, backgroundColor: OG.rose }),
    h('div', { position: 'absolute', display: 'flex', left: 56, top: titleTop, width: 1088, fontSize: size, lineHeight: 1.14, letterSpacing: '-1.6px', overflowWrap: 'anywhere' }, card.title),
    h('div', { position: 'absolute', left: 56, top: 464, width: 2, height: 70, backgroundImage: `linear-gradient(180deg, ${OG.teal}, ${OG.teal}22)` }),
    h('div', { position: 'absolute', display: 'flex', left: 76, top: 460, width: 1068, fontSize: 28, lineHeight: 1.25, color: OG.paper, letterSpacing: '-.1px', overflowWrap: 'anywhere' }, card.description),
    h('div', { position: 'absolute', left: 56, top: 580, width: 1088, height: 1, backgroundColor: '#ffffff1c' }),
    h('div', { position: 'absolute', display: 'flex', left: 56, top: 597, fontSize: 12, letterSpacing: '1.4px', color: '#a7b0bc' }, card.dateLabel),
    h('div', { position: 'absolute', display: 'flex', right: 56, top: 592, fontSize: 19, color: OG.teal }, card.lang === 'fr' ? 'l0g.fr' : 'l0g.fr / en'),
  );
}

export async function renderArticleSocialSvg(card, { onNodeDetected } = {}) {
  for (let size = 48; size >= 36; size -= 2) {
    const measured = [];
    await satori(overlay(card, size, 288), { width: 1200, height: 630, fonts: regularFonts, onNodeDetected: node => measured.push(node) });
    const title = measured.find(node => node.textContent === card.title);
    if (!title || title.height > 168) continue;
    const nodes = [];
    const svg = await satori(overlay(card, size, 424 - title.height), { width: 1200, height: 630, fonts: regularFonts, onNodeDetected: node => nodes.push(node) });
    const actualTitle = nodes.find(node => node.textContent === card.title);
    const description = nodes.find(node => node.textContent === card.description);
    const inside = nodes.every(node => [node.left, node.top, node.width, node.height].every(Number.isFinite)
      && node.left >= 0 && node.top >= 0 && node.width >= 0 && node.height >= 0
      && node.left + node.width <= 1200 && node.top + node.height <= 630);
    if (inside && actualTitle && description && description.top + description.height <= 566
      && description.top - actualTitle.top - actualTitle.height >= 28) {
      if (onNodeDetected) nodes.forEach(onNodeDetected);
      return svg;
    }
  }
  throw new Error(`Article OG: composition too long (${card.image}); shorten ogTitle before publishing.`);
}

export async function renderArticleSocialJpeg(card, { publicDirectory, cacheDirectory = process.env.L0G_OG_CACHE_DIR } = {}) {
  const artwork = readArticleIllustration(card.illustration, publicDirectory);
  if (digest(artwork) !== card.artworkHash) throw new Error('Article OG: artwork changed after fingerprinting.');
  const meta = await sharp(artwork, { failOn: 'warning', limitInputPixels: 20_000_000 }).metadata();
  if (!['jpeg', 'png', 'webp'].includes(meta.format) || !meta.width || !meta.height || (meta.pages ?? 1) !== 1) throw new Error('Article OG: invalid raster image.');
  rendererIdentity ??= {
    implementation: digest(readFileSync(new URL(import.meta.url))),
    cache: digest(readFileSync(new URL('./article-social-cache.mjs', import.meta.url))),
    lockfile: digest(readFileSync(new URL('../package-lock.json', import.meta.url))),
    fonts: regularFonts.map(({ data, ...font }) => ({ ...font, sha256: digest(data) })),
    runtime: process.versions, platform: process.platform, architecture: process.arch, sharp: sharp.versions,
  };
  return renderArticleWithCache({ cacheDirectory, inputs: { card, rendererIdentity, jpegOptions }, render: async () => {
    const layer = new Resvg(await renderArticleSocialSvg(card)).render().asPng();
    const bytes = await sharp(artwork, { failOn: 'warning', limitInputPixels: 20_000_000 }).resize(1200, 630, { fit: 'cover' }).composite([{ input: layer }]).jpeg(jpegOptions).toBuffer();
    if (bytes.length > 400_000) throw new Error('Article OG: JPEG exceeds 400 KB budget.');
    return bytes;
  } });
}
