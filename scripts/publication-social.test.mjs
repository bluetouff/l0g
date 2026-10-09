import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import test from 'node:test';
import sharp from 'sharp';
import { publicationSocialCards, getPublicationSocial } from '../src/config/publication-social.mjs';
import { renderPublicationSocial } from './generate-publication-social.mjs';
import { editorialTitleViolation } from './editorial-title-policy.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);

test('publication social titles identify their subjects directly', () => {
  for (const card of publicationSocialCards) {
    for (const title of [card.titleLines.join(' '), card.subtitleLines.join(' ')]) {
      assert.equal(editorialTitleViolation(title), null, `${card.path}: ${title}`);
    }
  }
});

test('every dedicated EPUB page has a distinct landscape social card', () => {
  const routes = [
    ['src/pages/publications', '/publications'],
    ['src/pages/en/publications', '/en/publications'],
  ].flatMap(([directory, prefix]) => readdirSync(join(ROOT, directory))
    .filter(file => file.endsWith('.astro') && file !== 'index.astro')
    .map(file => `${prefix}/${file.slice(0, -6)}/`));
  assert.deepEqual(publicationSocialCards.map(card => card.path).sort(), routes.sort());
  assert.equal(new Set(publicationSocialCards.map(card => card.image)).size, routes.length);
  for (const card of publicationSocialCards) {
    assert.equal(getPublicationSocial(card.path), card);
    assert(card.alt.includes(card.titleLines.join(' ')));
    assert(!card.image.includes('cover'), 'a portrait-cover derivative cannot stand in for a landscape composition');
    assert(card.titleLines.length >= 2 && card.titleLines.length <= 3);
    assert(card.titleLines.every(line => line.length <= 19));
  }
});

test('unknown and adversarial routes cannot manufacture asset references', () => {
  for (const path of ['/posts/example/', '/publications/../../secret/', '__proto__', 'constructor', '/publications/missing/', '/publications/']) {
    assert.equal(getPublicationSocial(path), undefined);
  }
});

test('cards and generated artwork use the declared 1200×630 ratio within budget', async () => {
  for (const card of publicationSocialCards) {
    for (const path of [card.image, card.art]) {
      const file = join(ROOT, 'public', path);
      const meta = await sharp(file).metadata();
      assert.equal(meta.width, 1200, path);
      assert.equal(meta.height, 630, path);
      assert.equal(meta.format, 'jpeg', path);
      assert(statSync(file).size <= (path === card.image ? 250_000 : 500_000), path);
    }
    assert.notDeepEqual(readFileSync(join(ROOT, 'public', card.image)), readFileSync(join(ROOT, 'public', card.art)), 'each art asset receives a native, legible title composition');
  }
});

test('both layouts publish the registered image and alt to OG and Twitter metadata', () => {
  for (const layout of ['BaseLayout.astro', 'EnglishGuidesLayout.astro']) {
    const source = readFileSync(join(ROOT, 'src/layouts', layout), 'utf8');
    assert(source.includes('getPublicationSocial(Astro.url.pathname)'));
    assert(source.includes('publicationSocial?.image ?? ogImage'));
    assert(source.includes('publicationSocial?.alt ?? ogImageAlt'));
    assert.match(source, /property="og:image" content=\{ogImageUrl\}/u);
    assert.match(source, /name="twitter:image" content=\{ogImageUrl\}/u);
    assert.match(source, /property="og:image:width" content="1200"/u);
    assert.match(source, /property="og:image:height" content="630"/u);
  }
});

test('generation is reproducible and rejects incorrectly sized artwork', async () => {
  const card = publicationSocialCards[0];
  const art = readFileSync(join(ROOT, 'public', card.art));
  const first = await renderPublicationSocial(card, art);
  const second = await renderPublicationSocial(card, art);
  assert.deepEqual(first.image, second.image);
  assert.deepEqual(first.image, readFileSync(join(ROOT, 'public', card.image)));
  assert.doesNotMatch(first.svg, /(?:(?:href|src)="https?:\/\/|onload=|<script\b|<foreignObject\b)/u);
  const invalid = await sharp(art).resize(1199, 630).toBuffer();
  await assert.rejects(renderPublicationSocial(card, invalid), /Incorrect social artwork dimensions/u);
});
