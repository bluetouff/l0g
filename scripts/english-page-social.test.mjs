import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import satori from 'satori';
import sharp from 'sharp';
import { englishPageSocialCards, defaultEnglishPageSocial, getEnglishPageSocial } from '../src/config/english-page-social.mjs';
import { englishPageCard } from './english-page-social-card.mjs';
import { fonts, OG, renderOgPng } from './og-kit.mjs';

test('English section cards cover navigation, pagination and definitions without crossing editions', () => {
  const asia = getEnglishPageSocial('/en/asia/');
  assert.equal(asia.key, 'asia');
  assert.equal(asia.titleLines.join(' '), 'Asia in the global economy');
  assert.equal(getEnglishPageSocial('/en/asia'), asia);
  assert.equal(getEnglishPageSocial('/en/analysis/page/2/').key, 'analysis');
  assert.equal(getEnglishPageSocial('/en/glossary/repo/').key, 'glossary');
  assert.equal(getEnglishPageSocial('/en/tools/model-pump-adequacy/').key, 'model-pump');
  assert.equal(getEnglishPageSocial('/en/tools/a-future-tool/').key, 'tools');
  assert.equal(getEnglishPageSocial('/en/a-future-page/'), defaultEnglishPageSocial);
  for (const path of ['/asia/', '/enough/', '/', undefined]) assert.equal(getEnglishPageSocial(path), null);
  assert.equal(new Set(englishPageSocialCards.map(card => card.path)).size, englishPageSocialCards.length);
  assert.equal(new Set(englishPageSocialCards.map(card => card.image)).size, englishPageSocialCards.length);
  for (const card of englishPageSocialCards) assert.match(card.image, /^\/og\/en\/pages\/[a-z-]+-[a-f0-9]{12}\.png$/);
});

test('every English page card keeps copy and illustration inside the sharing canvas', async () => {
  for (const card of englishPageSocialCards) {
    const nodes = [];
    await satori(englishPageCard(card), { width: OG.width, height: OG.height, fonts, onNodeDetected: node => nodes.push(node) });
    for (const node of nodes) {
      assert.ok([node.left, node.top, node.width, node.height].every(Number.isFinite), card.key);
      assert.ok(node.left >= 0 && node.top >= 0 && node.width >= 0 && node.height >= 0, card.key);
      assert.ok(node.left + node.width <= OG.width + .01 && node.top + node.height <= OG.height + .01,
        `${card.key}: box leaves the canvas: ${node.textContent ?? node.type}`);
    }
    for (const title of card.titleLines) {
      const node = nodes.find(node => node.textContent === title);
      assert.ok(node && node.left + node.width < 740, `${card.key}: title crosses into the schematic`);
    }
    assert.ok(nodes.some(node => node.textContent === `l0g.fr${card.path}`), card.key);
  }
});

test('English schematics produce compact landscape PNGs in each visual family', async () => {
  for (const motif of ['network', 'reference', 'tools', 'data']) {
    const card = englishPageSocialCards.find(card => card.motif === motif);
    const bytes = await renderOgPng(englishPageCard(card), { cacheDir: null });
    const meta = await sharp(bytes).metadata();
    assert.deepEqual([meta.width, meta.height, meta.format], [1200, 630, 'png']);
    assert.ok(bytes.length < 120_000, `${card.key}: social image exceeds 120 KB`);
  }
});

test('the English layout preserves dedicated artwork ahead of the English section fallback', async () => {
  const layout = await readFile(new URL('../src/layouts/EnglishGuidesLayout.astro', import.meta.url), 'utf8');
  assert.doesNotMatch(layout, /ogImage\s*=\s*['"]\/og-default\.png['"]/);
  assert.match(layout, /publicationSocial\?\.image\s*\?\?\s*ogImage\s*\?\?\s*pageSocial\.image/);
  assert.match(layout, /property="og:image" content=\{ogImageUrl\}/);
  assert.match(layout, /name="twitter:image" content=\{ogImageUrl\}/);
});

test('the shared layout localizes its fallback without changing French metadata defaults', async () => {
  const layout = await readFile(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
  assert.doesNotMatch(layout, /ogImage\s*=\s*['"]\/og-default\.png['"]/);
  assert.match(layout, /ogLocale\s*=\s*lang === 'en' \? 'en_US' : 'fr_FR'/);
  assert.match(layout, /publicationSocial\?\.image\s*\?\?\s*ogImage\s*\?\?\s*\(lang === 'en' \? pageSocial\.image : '\/og-default\.png'\)/);
  assert.match(layout, /publicationSocial\?\.alt\s*\?\?\s*ogImageAlt\s*\?\?\s*\(lang === 'en'/);
  assert.match(layout, /ogImage \? `\$\{socialTitle\}: l0g\.fr social card` : pageSocial\.alt/);
  assert.match(layout, /: `\$\{socialTitle\} - carte sociale l0g\.fr`/);
  assert.match(layout, /property="og:image" content=\{ogImageUrl\}/);
  assert.match(layout, /name="twitter:image" content=\{ogImageUrl\}/);
});

test('shared-layout English routes pass their language to the document and social metadata', async () => {
  for (const path of ['../src/pages/en/tools/who-can-see-my-e-invoice.astro', '../src/pages/en/tools/cooling-adaptation-quote.astro', '../src/pages/en/tools/e-invoice-incident-log.astro']) {
    const page = await readFile(new URL(path, import.meta.url), 'utf8');
    assert.match(page, /<BaseLayout\s[^>]*\blang="en"/, path);
  }
  const publication = await readFile(new URL('../src/components/DigitalEuroEpubPage.astro', import.meta.url), 'utf8');
  assert.match(publication, /<BaseLayout\s[^>]*\blang=\{lang\}/);
});
