import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import sharp from 'sharp';
import { aiCreditorsEditions } from '../src/config/ai-creditors-publication.mjs';
import { publicationSocialCards } from '../src/config/publication-social.mjs';
import { renderAiCreditorsCover } from './generate-ai-creditors-artwork.mjs';
import { renderPublicationSocial } from './generate-publication-social.mjs';

const file = value => new URL(`../${value}`, import.meta.url);
const portrait = readFileSync(file('src/epub-assets/ai-creditors-cover-art.png'));
const inside = (node, width, height) => [node.left, node.top, node.width, node.height].every(Number.isFinite)
  && node.left >= 0 && node.top >= 0 && node.left + node.width <= width && node.top + node.height <= height;

test('both native book covers keep complete artwork, correct copy and restrained typography inside the portrait', async () => {
  for (const [lang, book] of Object.entries(aiCreditorsEditions)) {
    const nodes = [];
    const result = await renderAiCreditorsCover(lang, portrait, { onNodeDetected: node => nodes.push(node) });
    const meta = await sharp(result.image).metadata();
    assert.deepEqual([meta.width, meta.height], [1024, 1536]);
    assert(nodes.every(node => inside(node, 1024, 1536)), `${lang}: visible cover contents fit`);
    assert(nodes.some(node => node.textContent === book.subtitle), 'Complete native subtitle');
    assert(nodes.some(node => node.textContent === (lang === 'fr' ? 'Six enquêtes intégrales' : 'Six complete investigations')));
    assert(nodes.every(node => !node.props?.style?.fontWeight || node.props.style.fontWeight === 400));
    assert(nodes.some(node => node.type === 'img' && node.left === 0 && node.top === 0 && node.width === 1024 && node.height === 1536), 'Continuous full-frame artwork');
    assert.doesNotMatch(result.svg, /<script\b|<foreignObject\b|(?:href|src)="https?:/u);
  }
});

test('new publication cards retain the full scene, regular title, complete subtitle and lower reserve', async () => {
  const cards = publicationSocialCards.filter(card => card.key === 'ai-creditors');
  assert.equal(cards.length, 2);
  for (const card of cards) {
    const nodes = [], art = readFileSync(file(`public${card.art}`));
    const result = await renderPublicationSocial(card, art, { onNodeDetected: node => nodes.push(node) });
    const title = nodes.find(node => node.textContent === card.titleLines.join(' '));
    const subtitle = nodes.find(node => node.textContent === card.subtitleLines.join(' '));
    assert(title && subtitle);
    assert(nodes.every(node => inside(node, 1200, 630)));
    assert(title.props.style.fontSize <= 42);
    assert(nodes.every(node => !node.props?.style?.fontWeight || node.props.style.fontWeight === 400));
    assert.equal(subtitle.top - title.top - title.height, 16);
    assert(630 - subtitle.top - subtitle.height >= 98, 'Reserve beneath the complete description');
    assert.doesNotMatch(result.svg, /#0c0d10\s+70%|font-weight="700"/u, 'No old opaque text panel');
    assert(result.image.length <= 250_000);
    const meta = await sharp(result.image).metadata();
    assert.deepEqual([meta.width, meta.height, meta.format], [1200, 630, 'jpeg']);
    assert.deepEqual(result.image, readFileSync(file(`public${card.image}`)));
  }
});

test('cover and social generation reject an unknown edition and an incompatible art canvas', async () => {
  for (const lang of ['__proto__', 'constructor', 'xx']) await assert.rejects(renderAiCreditorsCover(lang, portrait), /Unsupported/u);
  const wrongPortrait = await sharp(portrait).resize(1023, 1536).png().toBuffer();
  await assert.rejects(renderAiCreditorsCover('fr', wrongPortrait), /2:3/u);
  const card = publicationSocialCards.find(card => card.key === 'ai-creditors');
  const wrongWide = await sharp(portrait).resize(1199, 630).jpeg().toBuffer();
  await assert.rejects(renderPublicationSocial(card, wrongWide), /Incorrect social artwork dimensions/u);
});
