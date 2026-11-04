import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { OG, h } from './og-kit.mjs';
import { readWeeklyIllustration } from '../src/lib/weekly-social.ts';

export const weeklyFonts = [
  { name: 'Instrument Serif', data: readFileSync(new URL('../public/fonts/hebdo/InstrumentSerif-Regular.ttf', import.meta.url)), weight: 400, style: 'normal' },
  { name: 'Weekly Sans', data: readFileSync(new URL('../public/fonts/usdc-borders/liberation-sans-400.ttf', import.meta.url)), weight: 400, style: 'normal' },
];
const paper = '#e2e7df';
const muted = '#a5b8ae';

function titleFontSize(title) {
  return title.length <= 62 ? 54 : title.length <= 90 ? 49 : title.length <= 140 ? 42 : title.length <= 220 ? 36 : 28;
}

export function weeklyCoverCard(card, artwork, titleSize = titleFontSize(card.title)) {
  return h('div', {
    position: 'relative', display: 'flex', width: OG.width, height: OG.height,
    backgroundColor: '#13231f', backgroundImage: 'linear-gradient(125deg, #1b302c 0%, #13231f 55%, #101a19 100%)',
    color: paper, fontFamily: 'Weekly Sans', fontWeight: 400,
  },
  artwork ? { type: 'img', props: { src: artwork, width: 540, height: 630, style: { position: 'absolute', left: 660, top: 0 } } }
    : h('div', { position: 'absolute', left: 660, top: 0, width: 540, height: 630, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Instrument Serif', fontSize: 250, color: '#8eac9a' }, card.issueLabel.slice(3)),
  h('div', { position: 'absolute', display: 'flex', alignItems: 'center', left: 52, top: 38, height: 28 },
    h('div', { fontSize: 25, letterSpacing: '-1px', marginRight: 18 }, 'l0g'),
    h('div', { height: 16, width: 1, backgroundColor: '#91b3a34d', marginRight: 18 }),
    h('div', { fontSize: 13, letterSpacing: '2px', color: muted }, 'LA REVUE DE LA SEMAINE'),
  ),
  h('div', { position: 'absolute', display: 'flex', left: 48, top: 82, width: 550, fontFamily: 'Instrument Serif', fontSize: 124, lineHeight: 1, letterSpacing: '-3px' },
    h('span', {}, 'L’Hebdo'), h('span', { color: '#a5c9b8' }, '.'),
  ),
  h('div', { position: 'absolute', display: 'flex', alignItems: 'center', left: 53, top: 225, height: 24, fontSize: 17, color: muted },
    h('div', { letterSpacing: '1px' }, card.issueLabel),
    h('div', { height: 1, width: 24, backgroundColor: '#91b3a34d', marginLeft: 16, marginRight: 16 }),
    h('div', { letterSpacing: '.3px' }, card.dateLabel),
  ),
  h('div', { position: 'absolute', left: 53, top: 272, width: 548, height: 1, backgroundColor: '#91b3a34d' }),
  h('div', { position: 'absolute', display: 'flex', left: 52, top: 303, width: 550, fontFamily: 'Instrument Serif', fontSize: titleSize, lineHeight: 1.07, letterSpacing: '-.3px', overflowWrap: 'anywhere' }, card.title),
  h('div', { position: 'absolute', display: 'flex', left: 53, top: 578, fontSize: 16, color: muted }, 'l0g.fr / hebdo'),
  h('div', { position: 'absolute', display: 'flex', left: 302, top: 580, fontSize: 12, letterSpacing: '1.6px', color: muted }, 'CHAQUE DIMANCHE'),
  h('div', { position: 'absolute', left: 660, top: 592, width: 540, height: 38, display: 'flex', alignItems: 'center', paddingLeft: 24, color: '#c2d7ca', backgroundColor: '#17312b', fontSize: 12, letterSpacing: '1.6px' }, 'MACRO · FINANCE · POUVOIRS'),
  );
}

async function illustrationData(card) {
  if (!card.illustration) return undefined;
  const bytes = readWeeklyIllustration(card.illustration);
  if (createHash('sha256').update(bytes).digest('hex') !== card.artworkHash) throw new Error('Hebdo OG : illustration modifiée après calcul de son identité.');
  const cropped = await sharp(bytes).resize(540, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 92, mozjpeg: true }).toBuffer();
  return `data:image/jpeg;base64,${cropped.toString('base64')}`;
}

export async function renderWeeklySocialSvg(card, { onNodeDetected, ...options } = {}) {
  const artwork = await illustrationData(card);
  // Actual font geometry decides whether the complete title fits. Failure is
  // explicit, never a cropped headline or an unreadable type size.
  for (let size = titleFontSize(card.title); size >= 28; size = Math.max(27, size - 2)) {
    const nodes = [];
    const svg = await satori(weeklyCoverCard(card, artwork, size), {
      ...options, width: OG.width, height: OG.height, fonts: weeklyFonts,
      onNodeDetected: (node) => nodes.push(node),
    });
    const title = nodes.find(({ textContent }) => textContent === card.title);
    const footer = nodes.find(({ textContent }) => textContent === 'l0g.fr / hebdo');
    const inCanvas = nodes.every(({ left, top, width, height }) =>
      [left, top, width, height].every(Number.isFinite)
      && left >= 0 && top >= 0 && width >= 0 && height >= 0
      && left + width <= OG.width + .01 && top + height <= OG.height + .01);
    if (inCanvas && title && footer && title.left + title.width <= 620 && footer.top - title.top - title.height >= 24) {
      if (onNodeDetected) nodes.forEach(onNodeDetected);
      return svg;
    }
  }
  throw new Error('Hebdo OG : composition trop longue. Prévoir un titre de couverture plus court et relancer la génération.');
}

export async function renderWeeklySocialPng(card) {
  const png = new Resvg(await renderWeeklySocialSvg(card)).render().asPng();
  return sharp(png).png({ palette: true, colours: 256, quality: 100, effort: 7, dither: .7 }).toBuffer();
}
