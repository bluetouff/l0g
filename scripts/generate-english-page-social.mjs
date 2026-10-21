import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { englishPageSocialCards } from '../src/config/english-page-social.mjs';
import { englishPageCard } from './english-page-social-card.mjs';
import { renderOgPng } from './og-kit.mjs';

for (const card of englishPageSocialCards) {
  const output = resolve('public', `.${card.image}`);
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, await renderOgPng(englishPageCard(card)));
  console.log(`[og-en-page] ${card.path} -> ${card.image}`);
}
