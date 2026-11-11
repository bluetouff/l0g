import assert from 'node:assert/strict';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import { guideSocialCard, guideSocialCacheKey } from '../src/lib/guide-social.mjs';
import { renderGuideSocialSvg, renderGuideSocialJpeg } from './guide-social-card.mjs';
import { generateGuideSocial } from './generate-guide-social.mjs';
import { auditGuideSocial } from './audit-guide-social.mjs';

const entry = () => ({ id: 'read-inflation', data: { title: 'Lire l’inflation : mesures et mécanismes', description: 'Un guide des indices, des pondérations et des effets de base pour lire les publications statistiques.', pubDate: '2026-06-01', updatedDate: '2026-11-06T23:30:00Z', category: 'macro' } });
function fixture(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(tmpdir(), 'l0g-guide-og-test-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return root;
}

test('guides use native copy, an honest excerpt, revision date in Paris and their own FR/EN namespace', () => {
  const item = entry(), fr = guideSocialCard(item, 'fr'), en = guideSocialCard(item, 'en');
  assert.deepEqual(fr, guideSocialCard(item, 'fr'));
  assert.match(fr.image, /^\/og\/guides\/fr\/read-inflation-[a-f0-9]{16}\.jpg$/u);
  assert.match(en.image, /^\/og\/guides\/en\//u); assert.notEqual(en.image, fr.image);
  assert.equal(fr.label, 'GUIDE DE RÉFÉRENCE'); assert.equal(en.label, 'REFERENCE GUIDE');
  assert.equal(fr.version, 'reference-manual-v2', 'readability changes must renew existing social-image URLs');
  assert.equal(fr.category, 'Macroéconomie'); assert.equal(en.category, 'Macroeconomics');
  assert.match(fr.dateLabel, /^Révisé le 7 nov\. 2026$/u);
  assert.match(en.dateLabel, /^Revised 7 Nov 2026$/u);
  const custom = { ...item, data: { ...item.data, ogTitle: 'A precise English social title' } };
  assert.equal(guideSocialCard(custom, 'en').title, custom.data.ogTitle);
  assert.notEqual(guideSocialCard(custom, 'fr').title, custom.data.ogTitle);
  item.data.description = 'Une description fidèle à la source. '.repeat(20);
  const card = guideSocialCard(item, 'fr');
  assert.ok(Array.from(card.description).length <= 160); assert.ok(card.description.endsWith('…'));
  const noRevision = entry(); delete noRevision.data.updatedDate;
  assert.equal(guideSocialCard(noRevision, 'en').revisedAt, '2026-06-01T00:00:00.000Z');
});

test('content and revision changes renew both the public image URL and cached HTML', () => {
  const first = guideSocialCard(entry(), 'en'), key = guideSocialCacheKey('base', entry(), 'en');
  for (const patch of [{ title: 'A new title' }, { ogTitle: 'A social title' }, { description: 'A new description.' }, { updatedDate: '2026-11-08' }, { category: 'crypto' }]) {
    const item = entry(); Object.assign(item.data, patch);
    assert.notEqual(guideSocialCard(item, 'en').image, first.image);
    assert.notEqual(guideSocialCacheKey('base', item, 'en'), key);
  }
  const item = entry(); item.data.updatedDate = new Date(item.data.updatedDate);
  assert.equal(guideSocialCard(item, 'en').image, first.image);
});

test('manual artwork and drafts preserve their established behavior', () => {
  for (const patch of [{ draft: true }, { ogImage: '/og/bespoke.png' }, { ogImage: '/illustrations/news/manual-art.jpg' }]) {
    const item = entry(); Object.assign(item.data, patch); assert.equal(guideSocialCard(item, 'fr'), null);
  }
});

test('unsafe metadata, traversal, invalid revisions and prototype-looking categories fail closed', () => {
  for (const patch of [{ title: '' }, { title: 'x\u0000y' }, { description: '' }, { updatedDate: '2026-02-31' }, { updatedDate: 'invalid' }, { draft: 'false' }, { category: '__proto__' }, { category: 'unknown' }, { ogImage: {} }, { ogImage: '' }]) {
    const item = entry(); Object.assign(item.data, patch); assert.throws(() => guideSocialCard(item, 'fr'));
  }
  for (const id of ['../private', 'a/b', 'a?x', 'a#b', 'A']) assert.throws(() => guideSocialCard({ ...entry(), id }, 'en'));
  assert.throws(() => guideSocialCard(entry(), 'de'));
});

test('full long titles, regular typography and escaped input remain inside the sharing area', async () => {
  for (const [lang, title] of [
    ['fr', 'Lire la masse monétaire M2 : signal de liquidité, lectures erronées et lien avec le risk-on'],
    ['en', 'How to Read the Dollar: DXY, Cross-Currency Basis and Offshore Dollar Debt'],
    ['en', '<script>alert("guide")</script> & inflation'],
    ['fr', 'Lire le CPI : l’inflation américaine, mesure par mesure'],
  ]) {
    const item = entry(); item.data.title = title;
    const card = guideSocialCard(item, lang), nodes = [];
    const svg = await renderGuideSocialSvg(card, { onNodeDetected: node => nodes.push(node) });
    const headline = nodes.find(node => node.textContent === card.title), description = nodes.find(node => node.textContent === card.description);
    assert.ok(headline && description);
    assert.ok(description.props.style.fontSize >= 28, 'descriptions must remain readable at sharing-preview scale');
    assert.equal(description.props.style.color, '#e7e9ee');
    assert.ok(description.top - headline.top - headline.height >= 27);
    assert.ok(description.top + description.height <= 546);
    assert.ok(headline.left + headline.width <= 808);
    assert.ok(nodes.every(node => node.left >= 0 && node.top >= 0 && node.left + node.width <= 1200 && node.top + node.height <= 630));
    assert.doesNotMatch(svg, /<script|<foreignObject|(?:href|src)=["']https?:\/\//u);
  }
  await assert.rejects(renderGuideSocialSvg({ ...guideSocialCard(entry(), 'en'), title: 'A'.repeat(500) }), /too long/);
});

test('guide JPEGs respect their dimensions and budget; a warm cache reuses exact bytes', async t => {
  const root = fixture(t), cacheDirectory = path.join(root, 'cache'), card = guideSocialCard(entry(), 'fr');
  const first = await renderGuideSocialJpeg(card, { cacheDirectory });
  const meta = await sharp(first).metadata(); assert.equal(meta.format, 'jpeg'); assert.equal(meta.width, 1200); assert.equal(meta.height, 630); assert.ok(first.length <= 200000);
  const directory = path.join(cacheDirectory, 'article-jpeg');
  assert.equal(fs.readdirSync(directory).length, 1);
  const file = path.join(directory, fs.readdirSync(directory)[0]), time = fs.statSync(file).mtimeMs;
  assert.deepEqual(await renderGuideSocialJpeg(card, { cacheDirectory }), first);
  assert.equal(fs.statSync(file).mtimeMs, time);
  await renderGuideSocialJpeg(guideSocialCard({ ...entry(), data: { ...entry().data, title: 'Une autre notion' } }, 'fr'), { cacheDirectory });
  assert.equal(fs.readdirSync(directory).length, 2);
});

function writeFixture(root) {
  const cards = [];
  const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
  for (const [collection, lang, prefix] of [['guides', 'fr', 'guides'], ['guides-en', 'en', 'en/guides']]) {
    const item = entry(); item.data.title = lang === 'fr' ? 'Prix & inflation' : 'Prices & inflation';
    const directory = path.join(root, 'src/content', collection); fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(path.join(directory, item.id + '.md'), `---\n${Object.entries(item.data).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}\n---\nGuide.`);
    const card = guideSocialCard(item, lang), route = path.join(root, 'dist', prefix, item.id); fs.mkdirSync(route, { recursive: true });
    const metas = [['og:image', 'https://l0g.fr' + card.image], ['twitter:image', 'https://l0g.fr' + card.image], ['og:image:alt', card.alt], ['twitter:image:alt', card.alt], ['og:title', card.title], ['twitter:title', card.title], ['twitter:card', 'summary_large_image']].map(([key, value]) => `<meta property="${key}" content="${escape(value)}">`).join('');
    const ld = { '@graph': [{ '@type': 'Article', headline: item.data.title, inLanguage: lang, image: 'https://l0g.fr' + card.image }] };
    fs.writeFileSync(path.join(route, 'index.html'), `<head>${metas}<script type="application/ld+json">${JSON.stringify(ld)}</script></head><body><h1>${escape(item.data.title)}</h1><p class="post-lede">${escape(item.data.description)}</p></body>`);
    cards.push(card);
  }
  return cards;
}

test('the generator and complete HTML audit enforce native metadata and unchanged visible guide copy', async t => {
  const root = fixture(t); writeFixture(root);
  assert.equal((await generateGuideSocial(root)).count, 2);
  fs.cpSync(path.join(root, 'public/og'), path.join(root, 'dist/og'), { recursive: true });
  assert.equal((await auditGuideSocial(root)).count, 2);
  const file = path.join(root, 'dist/guides/read-inflation/index.html'), good = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, good.replace(/https:\/\/l0g\.fr\/og\/guides\/fr\/[^" ]+\.jpg/u, 'https://l0g.fr/og/old.jpg'));
  await assert.rejects(auditGuideSocial(root), /stale or mismatched/);
  fs.writeFileSync(file, good.replace('<h1>Prix &amp; inflation</h1>', '<h1>Changed guide title</h1>'));
  await assert.rejects(auditGuideSocial(root), /visible guide copy changed/);
});

test('guide output paths refuse symlinks and hardlinks instead of overwriting another file', async t => {
  const root = fixture(t), [card] = writeFixture(root);
  const output = path.join(root, 'public', card.image), outside = path.join(root, 'outside.jpg');
  fs.mkdirSync(path.dirname(output), { recursive: true }); fs.writeFileSync(outside, 'original');
  fs.symlinkSync(outside, output); await assert.rejects(generateGuideSocial(root), /unsafe output path/); assert.equal(fs.readFileSync(outside, 'utf8'), 'original');
  fs.unlinkSync(output); fs.linkSync(outside, output); await assert.rejects(generateGuideSocial(root), /unsafe output path/); assert.equal(fs.readFileSync(outside, 'utf8'), 'original');
});
