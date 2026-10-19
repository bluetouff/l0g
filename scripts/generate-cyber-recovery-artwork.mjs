import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { h, fonts, OG } from './og-kit.mjs';
import { cyberRecoveryEditions } from '../src/config/cyber-recovery-publication.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);

/** Typeset the book around original portrait artwork; social art is a separate composition. */
export async function renderCyberRecoveryCover(lang, artwork) {
  if (!Object.hasOwn(cyberRecoveryEditions, lang)) throw new Error('Unsupported recovery cover language');
  const book = cyberRecoveryEditions[lang];
  const art = await sharp(artwork).resize(1024, 1638, { fit: 'cover' }).png().toBuffer();
  const isEn = lang === 'en';
  const titleLines = isEn ? ['After the', 'cyberattack'] : ['Après la', 'cyberattaque'];
  if (titleLines.join(' ') !== book.title) throw new Error('Recovery cover title diverges from the book');
  const scene = { type: 'img', props: { src: `data:image/png;base64,${art.toString('base64')}`, style: { position: 'absolute', width: 1024, height: 1638, left: 0, top: 0 } } };
  const tree = h('div', { position: 'relative', width: 1024, height: 1638, display: 'flex', fontFamily: 'JetBrains Mono', background: OG.ink, color: OG.bright },
    scene,
    h('div', { position: 'absolute', left: 0, top: 0, width: 1024, height: 600, backgroundImage: 'linear-gradient(180deg, rgba(12,13,16,.92), rgba(12,13,16,.6) 67%, rgba(12,13,16,0))' }),
    h('div', { position: 'absolute', left: 0, bottom: 0, width: 1024, height: 310, backgroundImage: 'linear-gradient(0deg, rgba(12,13,16,1), rgba(12,13,16,.87) 58%, rgba(12,13,16,0))' }),
    h('div', { position: 'absolute', left: 72, right: 72, top: 62, display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
      h('div', { display: 'flex', fontSize: 48, fontWeight: 700, letterSpacing: -3 }, 'l', h('span', { color: OG.teal }, '0'), 'g'),
      h('span', { color: OG.teal, fontSize: 20, letterSpacing: 2, textTransform: 'uppercase' }, isEn ? 'Investigations' : 'Enquêtes')),
    h('div', { position: 'absolute', left: 72, top: 175, right: 60, display: 'flex', flexDirection: 'column' },
      ...titleLines.map((line, i) => h('div', { display: 'flex', fontSize: 86, lineHeight: 1.12, fontWeight: 700, letterSpacing: -4, color: i === 1 ? OG.teal : OG.bright }, line)),
      h('div', { marginTop: 33, display: 'flex', color: OG.paper, fontSize: 31, letterSpacing: -1 }, book.subtitle)),
    h('div', { position: 'absolute', left: 72, right: 72, bottom: 62, display: 'flex', flexDirection: 'column', gap: 24 },
      h('div', { display: 'flex', width: 104, height: 3, backgroundColor: OG.amber }),
      h('div', { display: 'flex', color: OG.bright, fontSize: 24 }, isEn ? '8 chapters · 32 infographics' : '8 chapitres · 32 infographies'),
      h('div', { display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#b8bec7', fontSize: 19 },
        h('span', {}, isEn ? 'OCTOBER 2026' : 'OCTOBRE 2026'), h('span', { color: OG.teal }, 'l0g.fr'))));
  const svg = await satori(tree, { width: 1024, height: 1638, fonts });
  return new Resvg(svg).render().asPng();
}

export async function generateCyberRecoveryArtwork() {
  const portrait = readFileSync(join(ROOT, 'src/epub-assets/cyber-recovery-cover-art.png'));
  const panorama = readFileSync(join(ROOT, 'src/epub-assets/cyber-recovery-panorama.png'));
  for (const lang of ['fr', 'en']) {
    const book = cyberRecoveryEditions[lang];
    const cover = await renderCyberRecoveryCover(lang, portrait);
    writeFileSync(join(ROOT, 'src/epub-assets', `${book.directory}-cover.png`), cover);
  }
  const output = join(ROOT, 'public/publications/cyber-recovery-publication-panorama.jpg');
  mkdirSync(dirname(output), { recursive: true });
  const wide = await sharp(panorama).resize(1600, 800, { fit: 'cover' }).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  writeFileSync(output, wide);
  for (const width of [640, 960, 1600]) {
    await sharp(wide).resize({ width }).webp({ quality: 82 }).toFile(output.replace('.jpg', `-${width}.webp`));
  }
  const social = join(ROOT, 'public/publications/og/art/cyber-recovery-v1.jpg');
  mkdirSync(dirname(social), { recursive: true });
  await sharp(panorama).resize(1200, 630, { fit: 'cover', position: 'right' }).jpeg({ quality: 88, mozjpeg: true }).toFile(social);
  console.log('Recovery book: two native portrait covers, independent panorama and landscape social artwork.');
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) await generateCyberRecoveryArtwork();
