import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { renderArticleSocialJpeg } from '../../scripts/article-social-card.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const illustration = '/illustrations/news/private-credit-atlas-v1.jpg';
const artworkHash = createHash('sha256').update(readFileSync(path.join(root, 'public', illustration))).digest('hex');
const editions = {
  fr: {
    title: 'Atlas du crédit privé',
    description: 'Fonds, assureurs et banques : suivre les capitaux et les garanties.',
    label: 'ATLAS · FINANCEMENT',
    dateLabel: 'ACTEURS · CONTRATS · SOURCES',
  },
  en: {
    title: 'Private credit atlas',
    description: 'Funds, insurers and banks: trace capital, contracts and guarantees.',
    label: 'ATLAS · FINANCING',
    dateLabel: 'ACTORS · CONTRACTS · SOURCES',
  },
};
for (const [lang, copy] of Object.entries(editions)) {
  const image = `/og/atlas/private-credit-${lang}-v1.jpg`;
  const card = { ...copy, lang, illustration, artworkHash, image, layout: 'immersive' };
  const bytes = await renderArticleSocialJpeg(card, { publicDirectory: path.join(root, 'public'), cacheDirectory: null });
  const output = path.join(root, 'public', image);
  mkdirSync(path.dirname(output), { recursive: true });
  writeFileSync(output, bytes);
  console.log(`${image}: ${bytes.length} bytes`);
}
