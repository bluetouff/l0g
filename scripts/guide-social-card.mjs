import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { OG, h, fonts } from './og-kit.mjs';
import { renderArticleWithCache as renderJpegWithCache } from './article-social-cache.mjs';

const regularFonts = fonts.filter(font => font.weight === 400);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const jpegOptions = { quality: 90, chromaSubsampling: '4:4:4' };
let rendererIdentity;

// A controlled book symbol, not a chart or an observation. No external resources.
const manual = `<svg xmlns="http://www.w3.org/2000/svg" width="280" height="340" viewBox="0 0 280 340">
<defs><linearGradient id="page" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#203437"/><stop offset="1" stop-color="#10171d"/></linearGradient></defs>
<circle cx="140" cy="157" r="116" fill="none" stroke="#5eead4" stroke-opacity=".09"/>
<path d="M140 22v19m0 232v19M5 157h19m232 0h19" stroke="#47535b"/>
<path d="M39 78l101 30 101-30v167l-101 30-101-30z" fill="#10171d" stroke="#39454d" stroke-width="1.2"/>
<path d="M39 69l101 30 101-30v167l-101 30-101-30z" fill="#111b21" stroke="#4c646a" stroke-width="1.2"/>
<path d="M45 53l95 28 95-28v170l-95 29-95-29z" fill="url(#page)" stroke="#5eead4" stroke-opacity=".65" stroke-width="1.3"/>
<path d="M140 81v171" stroke="#5eead4" stroke-opacity=".45" stroke-width="1.2"/>
<path d="M184 69v55l13-12 13 4V61" fill="#152c2e" stroke="#f5b13d" stroke-opacity=".9" stroke-width="1.2"/>
<path d="M64 94l54 16m-54 5 54 16m-54 5 40 12m60 10 51-15m-51 36 51-15m-51 36 37-11M64 187l54 16m46 10 51-15" stroke="#6b858b" stroke-opacity=".6" stroke-width="1.2" stroke-linecap="round"/>
<path d="M140 302h49m-98 0h21" stroke="#4b5c64"/><path d="M121 302h12" stroke="#5eead4"/><circle cx="140" cy="302" r="2" fill="#f5b13d"/>
</svg>`;
const art = { type: 'img', props: { src: `data:image/svg+xml;base64,${Buffer.from(manual).toString('base64')}`, width: 280, height: 340, style: { position: 'absolute', left: 872, top: 164 } } };

function composition(card, titleSize, descriptionTop) {
  return h('div', { position: 'relative', display: 'flex', width: 1200, height: 630, backgroundColor: '#0d1117', backgroundImage: 'radial-gradient(ellipse at 1020px 280px, #17343a 0%, #0d1117 52%)', fontFamily: 'JetBrains Mono', fontWeight: 400, color: OG.paper },
    h('div', { position: 'absolute', left: 0, top: 0, width: 9, height: 630, backgroundColor: '#233c40' }),
    h('div', { position: 'absolute', display: 'flex', alignItems: 'baseline', left: 64, top: 36, fontSize: 40, letterSpacing: '-3px' }, 'l', h('span', { color: OG.teal }, '0'), 'g', h('span', { color: OG.rose, marginLeft: 8 }, '_')),
    h('div', { position: 'absolute', left: 64, top: 104, width: 1072, height: 1, backgroundColor: '#ffffff1a' }),
    h('div', { position: 'absolute', display: 'flex', left: 64, top: 141, fontSize: 15, letterSpacing: '1.7px', color: OG.amber }, card.label),
    h('div', { position: 'absolute', display: 'flex', right: 64, top: 55, fontSize: 14, color: '#b3c0c9', letterSpacing: '.3px' }, card.category),
    h('div', { position: 'absolute', left: 840, top: 156, width: 1, height: 370, backgroundColor: '#5eead41c' }),
    h('div', { position: 'absolute', display: 'flex', left: 60, top: 193, width: 748, fontSize: titleSize, lineHeight: 1.16, letterSpacing: '-1.4px', overflowWrap: 'anywhere' }, card.title),
    h('div', { position: 'absolute', left: 64, top: descriptionTop + 4, width: 2, height: 70, backgroundImage: `linear-gradient(180deg, ${OG.teal}, ${OG.teal}22)` }),
    h('div', { position: 'absolute', display: 'flex', left: 84, top: descriptionTop, width: 710, fontSize: 28, lineHeight: 1.25, letterSpacing: '-.1px', color: OG.paper, overflowWrap: 'anywhere' }, card.description),
    art,
    h('div', { position: 'absolute', left: 64, top: 576, width: 1072, height: 1, backgroundColor: '#ffffff1a' }),
    h('div', { position: 'absolute', display: 'flex', left: 64, top: 598, fontSize: 13, color: '#9eacb7' }, card.dateLabel),
    h('div', { position: 'absolute', display: 'flex', right: 64, top: 594, fontSize: 17, color: OG.teal }, card.lang === 'fr' ? 'l0g.fr / guides' : 'l0g.fr / en / guides'),
  );
}

export async function renderGuideSocialSvg(card, { onNodeDetected } = {}) {
  for (let size = 48; size >= 36; size -= 2) {
    const measured = [];
    await satori(composition(card, size, 440), { width: 1200, height: 630, fonts: regularFonts, onNodeDetected: node => measured.push(node) });
    const title = measured.find(node => node.textContent === card.title);
    if (!title || title.height > 220) continue;
    const nodes = [];
    const svg = await satori(composition(card, size, 193 + title.height + 28), { width: 1200, height: 630, fonts: regularFonts, onNodeDetected: node => nodes.push(node) });
    const actualTitle = nodes.find(node => node.textContent === card.title), description = nodes.find(node => node.textContent === card.description);
    const inside = nodes.every(node => [node.left, node.top, node.width, node.height].every(Number.isFinite)
      && node.left >= 0 && node.top >= 0 && node.width >= 0 && node.height >= 0
      && node.left + node.width <= 1200 && node.top + node.height <= 630);
    if (inside && actualTitle && description && description.top + description.height <= 546
      && description.top - actualTitle.top - actualTitle.height >= 27) {
      if (onNodeDetected) nodes.forEach(onNodeDetected);
      return svg;
    }
  }
  throw new Error(`Guide OG: composition too long (${card.image}); shorten the social title before publishing.`);
}

export async function renderGuideSocialJpeg(card, { cacheDirectory = process.env.L0G_OG_CACHE_DIR } = {}) {
  rendererIdentity ??= {
    implementation: digest(readFileSync(new URL(import.meta.url))),
    cache: digest(readFileSync(new URL('./article-social-cache.mjs', import.meta.url))),
    lockfile: digest(readFileSync(new URL('../package-lock.json', import.meta.url))),
    fonts: regularFonts.map(({ data, ...font }) => ({ ...font, sha256: digest(data) })),
    runtime: process.versions, platform: process.platform, architecture: process.arch, sharp: sharp.versions,
  };
  return renderJpegWithCache({ cacheDirectory, inputs: { card, rendererIdentity, jpegOptions }, render: async () => {
    const png = new Resvg(await renderGuideSocialSvg(card)).render().asPng();
    const bytes = await sharp(png).jpeg(jpegOptions).toBuffer();
    if (bytes.length > 200_000) throw new Error('Guide OG: JPEG exceeds 200 KB budget.');
    return bytes;
  } });
}
