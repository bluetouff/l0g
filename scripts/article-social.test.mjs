import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import { articleSocialCard, articleSocialCacheKey as htmlKey, readArticleIllustration } from '../src/lib/article-social.mjs';
import { renderArticleSocialSvg, renderArticleSocialJpeg } from './article-social-card.mjs';
import { renderArticleWithCache, articleSocialCacheKey } from './article-social-cache.mjs';
import { generateArticleSocial } from './generate-article-social.mjs';
import { auditArticleSocial } from './audit-article-social.mjs';

const hash = value => createHash('sha256').update(value).digest('hex');
const photo = await sharp({ create: { width: 1200, height: 630, channels: 3, background: '#162e32' } }).jpeg().toBuffer();
const entry = () => ({ id: 'risk-funding', data: {
  title: 'Le financement du risque', description: 'Des prêts, des réseaux et des engagements financiers dont les mécanismes méritent une lecture précise.',
  pubDate: '2026-11-06T13:39:00+01:00', tags: ['Énergie', 'Infrastructures'], ogImage: '/illustrations/news/art.jpg',
} });

function fixture(t) {
  const root = fs.realpathSync(fs.mkdtempSync(path.join(tmpdir(), 'l0g-article-social-')));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const publicDirectory = path.join(root, 'public');
  fs.mkdirSync(path.join(publicDirectory, 'illustrations/news'), { recursive: true });
  fs.writeFileSync(path.join(publicDirectory, 'illustrations/news/art.jpg'), photo);
  return { root, publicDirectory, options: { publicDirectory }, card: lang => articleSocialCard(entry(), lang, { publicDirectory }) };
}

test('native FR/EN metadata is deterministic, dated in Paris and namespaced separately', t => {
  const f = fixture(t), fr = f.card('fr'), en = f.card('en');
  assert.deepEqual(fr, f.card('fr'));
  assert.match(fr.image, /^\/og\/analysis\/fr\/risk-funding-[a-f0-9]{16}\.jpg$/u);
  assert.match(en.image, /^\/og\/analysis\/en\//u);
  assert.notEqual(en.image, fr.image);
  assert.equal(fr.label, 'ENQUÊTE · INFRASTRUCTURES');
  assert.match(en.label, /^INVESTIGATION/);
  assert.equal(fr.artworkHash, hash(photo));
  assert.equal(fr.version, 'photo-title-excerpt-v2', 'readability changes must invalidate existing social-image URLs');
  assert.match(fr.dateLabel, /2026/);
  const dateObject = entry(); dateObject.data.pubDate = new Date(dateObject.data.pubDate);
  assert.equal(articleSocialCard(dateObject, 'fr', f.options).image, fr.image);
});

test('legacy cards retain their exact metadata fingerprint and SVG when layout is absent', async t => {
  const f = fixture(t), card = f.card('fr');
  const legacy = {
    version: 'photo-title-excerpt-v2', lang: 'fr', title: 'Le financement du risque',
    description: 'Des prêts, des réseaux et des engagements financiers dont les mécanismes méritent une lecture précise.',
    label: 'ENQUÊTE · INFRASTRUCTURES', publishedAt: '2026-11-06T12:39:00.000Z', dateLabel: '6 NOV. 2026',
    illustration: '/illustrations/news/art.jpg', artworkHash: hash(photo),
  };
  const image = `/og/analysis/fr/risk-funding-${hash(JSON.stringify(legacy)).slice(0, 16)}.jpg`;
  assert.deepEqual(card, { ...legacy, image, alt: `${legacy.title}. ${legacy.description} l0g.fr` });
  const svgCard = { title: legacy.title, description: legacy.description, label: legacy.label, dateLabel: legacy.dateLabel, lang: 'fr', image: '/test.jpg' };
  assert.equal(hash(await renderArticleSocialSvg(svgCard)), '8f58fcf0b24b01da5785ab759eb487be8f3cc906604d49bae670002a21013bab');
});

test('immersive layout is an explicit closed choice with independent social and HTML fingerprints', async t => {
  const f = fixture(t), article = entry(), legacy = f.card('fr');
  const originalKey = htmlKey('base', article, 'fr', f.options);
  article.data.ogLayout = 'immersive';
  const card = articleSocialCard(article, 'fr', f.options);
  assert.equal(card.layout, 'immersive');
  assert.equal(card.version, 'photo-title-excerpt-immersive-v1');
  assert.notEqual(card.image, legacy.image);
  assert.notEqual(htmlKey('base', article, 'fr', f.options), originalKey);
  for (const invalid of [null, '', 'classic', 'IMMERSIVE', true, 1, {}, []]) {
    article.data.ogLayout = invalid;
    assert.throws(() => articleSocialCard(article, 'fr', f.options), /invalid layout/);
    await assert.rejects(renderArticleSocialSvg({ ...legacy, layout: invalid }), /invalid layout/);
  }
});

test('every visible copy/artwork change invalidates both the social URL and editorial HTML key', async t => {
  const f = fixture(t), original = f.card('fr');
  const firstKey = htmlKey('base', entry(), 'fr', f.options);
  for (const patch of [{ title: 'Un nouveau titre' }, { ogTitle: 'Un titre social précis' }, { description: 'Un nouvel extrait.' }, { pubDate: '2026-11-07' }, { tags: ['Crédit privé'] }]) {
    const changed = entry(); Object.assign(changed.data, patch);
    assert.notEqual(articleSocialCard(changed, 'fr', f.options).image, original.image);
    assert.notEqual(htmlKey('base', changed, 'fr', f.options), firstKey);
  }
  const changedPhoto = await sharp(photo).tint('#aabbcc').jpeg().toBuffer();
  fs.writeFileSync(path.join(f.publicDirectory, 'illustrations/news/art.jpg'), changedPhoto);
  assert.notEqual(f.card('fr').image, original.image);
  assert.notEqual(htmlKey('base', entry(), 'fr', f.options), firstKey);
});

test('manual OG art, non-illustrated articles and drafts keep their existing behavior', t => {
  const f = fixture(t);
  for (const ogImage of [undefined, '/og/custom.png', '/images/og/bespoke.jpg', 'https://example.test/image.jpg', 'file:///private/secret']) {
    const article = entry(); article.data.ogImage = ogImage;
    assert.equal(articleSocialCard(article, 'fr', f.options), null);
  }
  const draft = entry(); draft.data.draft = true;
  assert.equal(articleSocialCard(draft, 'fr', f.options), null);
});

test('unsafe metadata, slugs and dates fail before rendering; long descriptions are honest excerpts', t => {
  const f = fixture(t);
  for (const patch of [{ title: '' }, { title: 'x\u0000y' }, { description: '' }, { pubDate: '2026-02-31' }, { pubDate: 'invalid' }, { draft: 'false' }]) {
    const article = entry(); Object.assign(article.data, patch);
    assert.throws(() => articleSocialCard(article, 'fr', f.options));
  }
  for (const id of ['../private', 'x/y', 'x?query', 'x#hash']) assert.throws(() => articleSocialCard({ ...entry(), id }, 'fr', f.options));
  assert.throws(() => articleSocialCard(entry(), 'de', f.options));
  const article = entry(); article.data.description = 'Une phrase complète. '.repeat(30);
  const card = articleSocialCard(article, 'fr', f.options);
  assert.ok(Array.from(card.description).length <= 160);
  assert.ok(card.description.endsWith('…'));
});

test('raster access rejects traversal, remote paths, escaping symlinks and impostor image bytes', t => {
  const f = fixture(t);
  for (const src of ['/illustrations/news/../secret.jpg', '/illustrations/news/%2e%2e.jpg?x', 'https://evil.test/a.jpg', '/illustrations/news/a.svg']) assert.throws(() => readArticleIllustration(src, f.publicDirectory));
  fs.writeFileSync(path.join(f.root, 'outside.jpg'), photo);
  fs.symlinkSync(path.join(f.root, 'outside.jpg'), path.join(f.publicDirectory, 'illustrations/news/link.jpg'));
  assert.throws(() => readArticleIllustration('/illustrations/news/link.jpg', f.publicDirectory), /outside/);
  fs.writeFileSync(path.join(f.publicDirectory, 'illustrations/news/fake.jpg'), '<svg onload="alert(1)"/>');
  assert.throws(() => readArticleIllustration('/illustrations/news/fake.jpg', f.publicDirectory), /raster/);
});

test('FR/EN layouts keep full titles, regular type and all text inside the safe sharing area', async t => {
  const f = fixture(t);
  for (const [lang, title] of [
    ['fr', 'Google dans l’Indre : les milliards privés et la facture des réseaux'],
    ['en', 'Google’s French data center: the grid bill behind the billions'],
    ['fr', 'La contagion silencieuse : comment le crédit privé tisse une toile invisible entre banques, assureurs, marchés actions, crypto et stablecoins'],
    ['en', 'SpaceX goes public, 12 June 2026: the red carpet the SEC rolls out for the most expensive IPO in history by bending its own rules'],
    ['en', '<script>alert("risk")</script> & capital'],
  ]) {
    const article = entry(); article.data.title = title;
    const card = articleSocialCard(article, lang, f.options), nodes = [];
    const svg = await renderArticleSocialSvg(card, { onNodeDetected: node => nodes.push(node) });
    const headline = nodes.find(node => node.textContent === card.title), excerpt = nodes.find(node => node.textContent === card.description);
    assert.ok(headline && excerpt);
    assert.ok(excerpt.props.style.fontSize >= 28, 'the description must remain readable at sharing-preview scale');
    assert.equal(excerpt.props.style.color, '#e7e9ee');
    assert.ok(excerpt.top - headline.top - headline.height >= 28);
    assert.ok(excerpt.top + excerpt.height <= 566);
    assert.ok(nodes.every(node => node.left >= 0 && node.top >= 0 && node.left + node.width <= 1200 && node.top + node.height <= 630));
    assert.doesNotMatch(svg, /<script|<foreignObject|(?:href|src)=["']https?:\/\//u);
  }
  const longDeck = { ...f.card('fr'), description: 'De Saras à Engen, les acquisitions de Vitol changent les choix d’approvisionnement. Enquête sur la propriété des actifs et les conditions de concurrence.' };
  const deckNodes = [];
  await renderArticleSocialSvg(longDeck, { onNodeDetected: node => deckNodes.push(node) });
  assert.ok(deckNodes.find(node => node.textContent === longDeck.description).height <= 105);
  await assert.rejects(renderArticleSocialSvg({ ...f.card('fr'), title: 'A'.repeat(500) }), /too long/);
  const image = await renderArticleSocialJpeg(f.card('fr'), { ...f.options, cacheDirectory: null });
  const meta = await sharp(image).metadata();
  assert.equal(meta.format, 'jpeg'); assert.equal(meta.width, 1200); assert.equal(meta.height, 630);
  assert.ok(image.length < 400_000);
  await assert.rejects(renderArticleSocialJpeg({ ...f.card('fr'), artworkHash: '0'.repeat(64) }, f.options), /changed/);
});

test('immersive FR/EN cards use measured compact text and preserve a translucent full-frame background', async t => {
  const f = fixture(t);
  for (const [lang, title, description] of [
    ['fr', 'Nvidia : qui garantit les milliards de l’IA ?', 'Nvidia doit arbitrer ses garanties aux prêteurs, alors que Singapour et la Malaisie précisent leurs enquêtes.'],
    ['en', 'Nvidia: who backs AI’s billions?', 'Nvidia faces demands for stronger guarantees as Singapore and Malaysia sharpen their scrutiny of server deals.'],
    ['fr', 'La contagion silencieuse : comment le crédit privé tisse une toile invisible entre banques, assureurs, marchés actions, crypto et stablecoins', 'De Saras à Engen, les acquisitions de Vitol changent les choix d’approvisionnement. Enquête sur la propriété des actifs et les conditions de concurrence.'],
    ['en', 'SpaceX goes public, 12 June 2026: the red carpet the SEC rolls out for the most expensive IPO in history by bending its own rules', 'A detailed investigation into funding commitments, safeguards and the contractual rights governing a project through periods of financial stress.'],
  ]) {
    const article = entry(); Object.assign(article.data, { title, description, ogLayout: 'immersive' });
    const card = articleSocialCard(article, lang, f.options), nodes = [];
    const svg = await renderArticleSocialSvg(card, { onNodeDetected: node => nodes.push(node) });
    const headline = nodes.find(node => node.textContent === card.title), excerpt = nodes.find(node => node.textContent === card.description);
    assert.ok(headline && excerpt);
    assert.ok(headline.props.style.fontSize >= 36 && headline.props.style.fontSize <= 42);
    assert.equal(excerpt.props.style.fontSize, 28);
    assert.equal(excerpt.props.style.color, '#e7e9ee');
    assert.ok(Math.abs(excerpt.top - headline.top - headline.height - 16) < 0.01);
    assert.ok(headline.top >= 250 && excerpt.top + excerpt.height <= 532);
    assert.ok(Math.abs(excerpt.top + excerpt.height - 530) < 0.01);
    assert.ok(580 - excerpt.top - excerpt.height >= 48, 'the footer keeps a separate safe margin');
    assert.ok(nodes.every(node => [node.left, node.top, node.width, node.height].every(Number.isFinite)
      && node.left >= 0 && node.top >= 0 && node.left + node.width <= 1200 && node.top + node.height <= 630));
    assert.ok(nodes.filter(node => node.props.style?.fontWeight !== undefined).every(node => node.props.style.fontWeight === 400));
    const shade = nodes.find(node => node.props.style?.backgroundImage?.includes('rgba(12,13,16,0.82)'));
    assert.ok(shade && shade.width === 1200 && shade.height === 630);
    assert.doesNotMatch(shade.props.style.backgroundImage, /#0c0d10|rgba\(12,13,16,1\)/u);
    assert.doesNotMatch(svg, /<script|<foreignObject|(?:href|src)=["']https?:\/\//u);
  }
  const article = entry(); article.data.ogLayout = 'immersive';
  const card = articleSocialCard(article, 'fr', f.options);
  await assert.rejects(renderArticleSocialSvg({ ...card, title: 'A'.repeat(500) }), /too long/);
  await assert.rejects(renderArticleSocialSvg({ ...card, description: 'A'.repeat(500) }), /too long/);
  const image = await renderArticleSocialJpeg(card, { ...f.options, cacheDirectory: null });
  const meta = await sharp(image).metadata();
  assert.equal(meta.format, 'jpeg'); assert.equal(meta.width, 1200); assert.equal(meta.height, 630);
  assert.ok(image.length < 400_000);
});

test('warm JPEG cache returns exact bytes without rerendering; changed inputs regenerate', async t => {
  const f = fixture(t), cacheDirectory = path.join(f.root, 'cache');
  let renders = 0;
  const options = { cacheDirectory, inputs: { title: 'original' }, render: async () => { renders++; return photo; } };
  assert.deepEqual(await renderArticleWithCache(options), photo);
  assert.deepEqual(await renderArticleWithCache(options), photo);
  assert.equal(renders, 1);
  await renderArticleWithCache({ ...options, inputs: { title: 'updated' } });
  assert.equal(renders, 2);
  const file = path.join(cacheDirectory, 'article-jpeg', `${articleSocialCacheKey(options.inputs)}.json`);
  for (const invalid of ['not json', 'x'.repeat(2_000_001), JSON.stringify({ version: 1, key: articleSocialCacheKey(options.inputs), sha256: '0'.repeat(64), jpeg: photo.toString('base64') })]) {
    fs.writeFileSync(file, invalid);
    await renderArticleWithCache(options);
  }
  assert.equal(renders, 5);
  const good = JSON.parse(fs.readFileSync(file));
  for (const invalid of [photo.subarray(0, 100), await sharp(photo).resize(100, 50).jpeg().toBuffer()]) {
    fs.writeFileSync(file, JSON.stringify({ ...good, sha256: hash(invalid), jpeg: invalid.toString('base64') }));
    await renderArticleWithCache(options);
  }
  assert.equal(renders, 7);
});

test('JPEG cache never follows or overwrites links, and render failures remain visible', async t => {
  const f = fixture(t), cacheDirectory = path.join(f.root, 'cache');
  let renders = 0;
  const options = { cacheDirectory, inputs: 'fixture', render: async () => { renders++; return photo; } };
  await renderArticleWithCache(options);
  const file = path.join(cacheDirectory, 'article-jpeg', `${articleSocialCacheKey(options.inputs)}.json`), outside = path.join(f.root, 'outside.json');
  fs.renameSync(file, outside); fs.symlinkSync(outside, file);
  await renderArticleWithCache(options); assert.equal(renders, 2); assert.ok(fs.lstatSync(file).isSymbolicLink());
  fs.unlinkSync(file); fs.linkSync(outside, file);
  await renderArticleWithCache(options); assert.equal(renders, 3); assert.equal(fs.statSync(file).nlink, 2);
  const linked = path.join(f.root, 'linked'); fs.symlinkSync(cacheDirectory, linked);
  await renderArticleWithCache({ ...options, cacheDirectory: linked }); assert.equal(renders, 4);
  await assert.rejects(renderArticleWithCache({ ...options, inputs: 'failure', render: async () => { throw new Error('visible render failure'); } }), /visible render failure/);
});

test('generator and rendered metadata preserve original artwork and the native social image', async t => {
  const f = fixture(t);
  for (const [collection, lang, prefix] of [['posts', 'fr', 'posts'], ['posts-en', 'en', 'en/analysis']]) {
    fs.mkdirSync(path.join(f.root, 'src/content', collection), { recursive: true });
    const item = entry(); item.data.title = lang === 'fr' ? 'Risque & financement' : 'Risk & funding';
    fs.writeFileSync(path.join(f.root, 'src/content', collection, item.id + '.md'), `---\n${Object.entries(item.data).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')}\n---\nArticle.`);
    const card = articleSocialCard(item, lang, f.options), route = path.join(f.root, 'dist', prefix, item.id);
    fs.mkdirSync(route, { recursive: true });
    const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
    const metas = [['og:image', 'https://l0g.fr' + card.image], ['twitter:image', 'https://l0g.fr' + card.image], ['og:image:alt', card.alt], ['twitter:image:alt', card.alt]].map(([key, value]) => `<meta property="${key}" content="${escape(value)}">`).join('');
    const ld = { '@graph': [{ '@type': 'NewsArticle', image: [{ url: 'https://l0g.fr' + item.data.ogImage }, { url: 'https://l0g.fr' + card.image }] }] };
    fs.writeFileSync(path.join(route, 'index.html'), `<head>${metas}<script type="application/ld+json">${JSON.stringify(ld)}</script></head><body><img data-article-image src="${item.data.ogImage}"></body>`);
  }
  const result = await generateArticleSocial(f.root); assert.equal(result.count, 2);
  fs.cpSync(path.join(f.root, 'public/og'), path.join(f.root, 'dist/og'), { recursive: true });
  assert.equal((await auditArticleSocial(f.root)).count, 2);
  const file = path.join(f.root, 'dist/posts/risk-funding/index.html'), good = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, good.replace('data-article-image src="/illustrations/news/art.jpg"', 'data-article-image src="/wrong.jpg"'));
  await assert.rejects(auditArticleSocial(f.root), /original illustration/);
  fs.writeFileSync(file, good.replace(/https:\/\/l0g\.fr\/og\/analysis\/fr\/[^"]+\.jpg/u, 'https://l0g.fr/og/old.jpg'));
  await assert.rejects(auditArticleSocial(f.root), /stale or mismatched/);
});
