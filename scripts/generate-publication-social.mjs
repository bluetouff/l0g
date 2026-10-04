import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { h, fonts, OG } from './og-kit.mjs';
import { publicationSocialCards } from '../src/config/publication-social.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);

/** Build a native typeset card around a purpose-made, text-free illustration. */
export async function renderPublicationSocial(card, art) {
  const meta = await sharp(art).metadata();
  if (meta.width !== 1200 || meta.height !== 630) throw new Error(`Incorrect social artwork dimensions: ${card.art}`);
  const illustration = { type: 'img', props: { src: `data:image/jpeg;base64,${art.toString('base64')}`, style: { position: 'absolute', left: 0, top: 0, width: 1200, height: 630 } } };
  const gradient = h('div', { position: 'absolute', left: 0, top: 0, width: 1200, height: 630,
    backgroundImage: 'linear-gradient(90deg, #0b0d10 0%, rgba(11,13,16,0.98) 25%, rgba(11,13,16,0.85) 43%, rgba(11,13,16,0.18) 65%, rgba(11,13,16,0) 80%)' });
  const titleSize = card.titleLines.some(line => line.length > 15) ? 48 : 55;
  const copy = h('div', { position: 'absolute', left: 56, top: 48, width: 568, height: 532, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
    h('div', { display: 'flex', flexDirection: 'column' },
      h('div', { display: 'flex', gap: 18, alignItems: 'center', color: '#62dfd1', fontSize: 16, letterSpacing: 2, textTransform: 'uppercase' },
        h('div', { display: 'flex', color: '#f5f6f8', fontWeight: 700, fontSize: 34, letterSpacing: -2, textTransform: 'none' }, 'l', h('span', { color: '#62dfd1' }, '0'), 'g'),
        h('span', { width: 1, height: 24, backgroundColor: '#43505a' }), h('span', {}, card.label)),
      h('div', { display: 'flex', flexDirection: 'column', marginTop: 48, color: '#f5f6f8', fontSize: titleSize, fontWeight: 700, lineHeight: 1.14, letterSpacing: -2 },
        ...card.titleLines.map((line, i) => h('div', { display: 'flex', color: i === card.titleLines.length - 1 ? '#62dfd1' : '#f5f6f8' }, line))),
      h('div', { display: 'flex', flexDirection: 'column', marginTop: 24, color: '#d9dde4', fontSize: 20, lineHeight: 1.5 }, ...card.subtitleLines.map(line => h('div', { display: 'flex' }, line)))),
    h('div', { display: 'flex', alignItems: 'center', gap: 20, color: '#e8ad49', fontSize: 17, letterSpacing: 1 },
      h('span', { padding: '9px 13px', border: '1px solid #e8ad4966', borderRadius: 5, backgroundColor: '#e8ad490d' }, card.format),
      h('span', { color: '#d9dde4', fontSize: 17 }, 'l0g.fr')));
  const cardTree = h('div', { width: OG.width, height: OG.height, position: 'relative', display: 'flex', backgroundColor: '#0b0d10', fontFamily: 'JetBrains Mono' },
    illustration, gradient, h('div', { position: 'absolute', left: 56, top: 20, width: 1088, height: 2, backgroundImage: 'linear-gradient(90deg, #62dfd1, #62dfd100 40%, #e8ad4970)' }), copy);
  const svg = await satori(cardTree, { width: OG.width, height: OG.height, fonts });
  const png = new Resvg(svg).render().asPng();
  return { svg, image: await sharp(png).jpeg({ quality: 88, mozjpeg: true }).toBuffer() };
}

export async function generatePublicationSocial() {
  for (const card of publicationSocialCards) {
    const art = readFileSync(join(ROOT, 'public', card.art));
    const output = join(ROOT, 'public', card.image);
    mkdirSync(dirname(output), { recursive: true });
    const { image } = await renderPublicationSocial(card, art);
    if (image.length > 250_000) throw new Error(`Social card exceeds 250 KB: ${card.image}`);
    writeFileSync(output, image);
    console.log(`${card.path} → ${card.image} (${image.length} bytes)`);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) await generatePublicationSocial();
