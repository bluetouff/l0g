import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';
import { Resvg } from '@resvg/resvg-js';
import opentype from '@shuding/opentype.js';
import postcss from 'postcss';
import sharp from 'sharp';
import { gsibSnapshotSvg, validateGsibSnapshotFigure, GSIB_KINDS } from '../src/lib/gsibSnapshotFigures.mjs';

const kinds = Array.from({ length: 7 }, (_, i) => `figure${i + 1}`);
const variants = ['fr', 'en'].flatMap(lang => kinds.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, name: `${String(kinds.indexOf(kind) + 1).padStart(2, '0')}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: gsibSnapshotSvg(lang, kind, mobile) }))));
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const tag = n => Object.keys(n).find(k => k !== ':@');
const attrs = n => n[':@'] || {};
const children = n => n[tag(n)] || [];
const all = n => tag(n) === '#text' ? [] : [n, ...children(n).flatMap(all)];
const content = n => tag(n) === '#text' ? n['#text'] : children(n).map(content).join('');
const num = (n, k, fallback = 0) => { const value = Number(attrs(n)[k] ?? fallback); assert.ok(Number.isFinite(value)); return value; };
const native = {};
postcss.parse(readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8')).walkDecls(d => { if (d.parent.type === 'atrule' && d.parent.name === 'theme') native[d.prop] = d.value; });
const paint = role => `var(--color-${role}, ${native[`--color-${role}`]})`;
const safePaints = new Set(['none', ...['ink', 'surface', 'surface-2', 'paper', 'muted', 'line-strong', 'signal', 'amber', 'topic-blue'].map(paint)]);
const safeTags = new Set('svg title desc metadata defs marker rect line path circle text'.split(' '));
const safeAttributes = new Set('xmlns viewBox width height role aria-labelledby data-gsib-kind style id x y rx fill stroke stroke-width x1 y1 x2 y2 stroke-dasharray d stroke-linejoin cx cy r font-family font-size font-weight text-anchor marker-end markerWidth markerHeight refX refY orient markerUnits'.split(' '));
function inspect(svg) {
  assert.equal(XMLValidator.validate(svg), true);
  assert.doesNotMatch(svg, /<!|<\?/u);
  const tree = parser.parse(svg); assert.equal(tree.length, 1);
  const root = tree[0], nodes = all(root), ids = new Set();
  assert.equal(tag(root), 'svg'); assert.equal(attrs(root).xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(attrs(root).role, 'img'); assert.equal(attrs(root).style, 'display:block;width:100%;height:auto');
  for (const n of nodes) {
    assert.ok(safeTags.has(tag(n)), tag(n));
    for (const [k, value] of Object.entries(attrs(n))) {
      assert.ok(safeAttributes.has(k), k); assert.equal(typeof value, 'string');
      if (k === 'fill' || k === 'stroke') assert.ok(safePaints.has(value), value);
      if (k === 'id') { assert.match(value, /^g[1-7]-(?:fr|en)-(?:d|m)-(?:title|desc|ink|teal|gold)$/u); assert.ok(!ids.has(value)); ids.add(value); }
      if (k === 'style') { assert.equal(n, root); assert.equal(value, attrs(root).style); }
      if (k === 'marker-end') assert.match(value, /^url\(#g[1-7]-(?:fr|en)-(?:d|m)-(?:ink|teal|gold)\)$/u);
      else assert.ok(!value.includes('url('), value);
      if (k === 'font-family') assert.equal(value, 'DejaVu Sans, Arial, sans-serif');
      if (k === 'font-size') assert.ok(num(n, k) >= 18 && num(n, k) <= 64);
      if (k === 'font-weight') assert.ok(['400', '700'].includes(value));
    }
  }
  const aria = attrs(root)['aria-labelledby'].split(' '); assert.equal(aria.length, 2);
  for (const type of ['title', 'desc']) { const found = nodes.filter(n => tag(n) === type); assert.equal(found.length, 1); assert.ok(aria.includes(attrs(found[0]).id)); assert.ok(content(found[0]).trim()); }
  for (const n of nodes) if (attrs(n)['marker-end']) assert.ok(ids.has(attrs(n)['marker-end'].slice(5, -1)));
  const metadata = JSON.parse(content(nodes.find(n => tag(n) === 'metadata')));
  assert.equal(metadata.asOf, '2026-10-10'); assert.match(metadata.status, /hypothetical|published/u);
  return { root, nodes };
}
// Fingerprints independently taken from supplied XML before adaptation.
// Native paints and root sizing adapt. Six FIG5 text replacements distinguish
// net notional from risk. One shorter FIG1 label and four wider FIG5 cards repair
// glyphs that were concealed or outside their cards with the authored DejaVu font.
// All remaining text, geometry, fonts and primitive order stay locked.
const originalSignatures = {
  "01-en-desktop": "2d9cfb966cb8c3e85cf8a212613e4f3090977cdf183699a9debb7b1241529ec4",
  "01-en-mobile": "e560b17dfe1d92d353bb5bcc06cb1484b18d5c88b1a256d647fb4f4695e869c7",
  "01-fr-desktop": "f46941092ecd7e9b382780277a3d92c580b0219e3e90b008749064de20a6d9f3",
  "01-fr-mobile": "70c78c32f23f5cf9c32fda9d78dc72409ace2c17380fccad5e0c736e2cce1edd",
  "02-en-desktop": "0f70a88186d8c42d1682c23cd61693052e05ab0ad01e439d6684028c649a0adb",
  "02-en-mobile": "308e7d1729d28fc1719e6e269496cc706494b4c347a131d1c31e5198275c173c",
  "02-fr-desktop": "3d6c47d4213a1ee704fe686c9f5a210e66a48f42688defd690758c9255083d53",
  "02-fr-mobile": "c335f98b14095105baba2f69d27618eefc0ce526f70770e8c82a7e37d89674ab",
  "03-en-desktop": "80b53cff2085675d903a9b763f0566f6012d9a7d196f586fcb6fec70e7d7a06c",
  "03-en-mobile": "f8137491fa1b2601b8dd778af39acedfb1ab07aca87f7bcfbaf724f64646643e",
  "03-fr-desktop": "2e95bf798aa88f953ff4af0fbcc05a893dc865c6b9bcb7712a81ad707ee34d6f",
  "03-fr-mobile": "3ae092a3aa550df9ec6d8e56d57f4a09cd1a04f49c8160ada2cb77ffc70e8704",
  "04-en-desktop": "229d362474a306f6bf3165f385a9bce73ef6557824939c253061ab52ff68149d",
  "04-en-mobile": "29e4adb3775f96dce07b65849655c3217aa99f530879f33e00d2a204fd6b7b52",
  "04-fr-desktop": "9bd90e6d2c64a9ed1ca86321a87d597c20a569533c9a861b2715c75779ded105",
  "04-fr-mobile": "9c808250221853f414cb9955a8350a402c2177a2c167dae8f908f9686642c121",
  "05-en-desktop": "403544767396b6c29009a821f219d38a237413accd6d4ebbe916181f0dc5a295",
  "05-en-mobile": "ddec21fa904589e91d5fda7be4cfb1bbbb0b2ab7f799447aadba6b168f88a453",
  "05-fr-desktop": "e1390cdf58e63e58f301f8053c9ea93b54a0df4df3b7209428c6af27cf53f449",
  "05-fr-mobile": "ea41299b497007d6f53faa2cc8f055e470757ec8178adfa01487d46595524fd8",
  "06-en-desktop": "0b1dac88232042018dd568fa978931a8b21a5c6aa94b665fc09f781c8a3f4d32",
  "06-en-mobile": "0f63bb4d27e7fad1366c826c89ec41fc95f3e47dedd9b743fcd581acd7749e10",
  "06-fr-desktop": "6b32adca92be2c3d5c8bc35e7ceb47929fe64147ebd3df5a03ff319ad1ceb7e7",
  "06-fr-mobile": "8c0b5a3c66cc6ebec06ce322c87c8e41cb606eeced371749a2d3535ba09dbf12",
  "07-en-desktop": "521147afc6554b869b210b0b87fa3d888357b7e436e3af014db15e028ff794a0",
  "07-en-mobile": "57fff8b7e7dfd779b955d5114fd8ef79afe14034cd3e7fe8c606f17ebbb9a940",
  "07-fr-desktop": "c51fb60605bf35dba4f5cb9b87468de355628cc36086e167a113cc25780edd56",
  "07-fr-mobile": "d9bbced6d4193755852006866e75497e621dd4d47c38c22db5deb7ff3dba48ba"
};
const textRepairs = {
  '01-fr-desktop': { 'Moy. 4 fins de trim.': 'Moy. 4 fins de trimestre' },
  '05-fr-desktop': { 'Notionnel net': 'Risque de taux', ': 10 M€': 'net : 10 M€' },
  '05-en-desktop': { 'Net notional': 'Net rate', 'in model:': 'exposure:' },
  '05-fr-mobile': { 'Notionnel net du modèle': 'Exposition nette de taux du modèle' },
  '05-en-mobile': { 'Model net notional: €10m': 'Model net rate exposure: €10m' },
};
const counterpartyCards = {
  '05-fr-desktop': { x: '1018', y: '258.0' },
  '05-en-desktop': { x: '1018', y: '258.0' },
  '05-fr-mobile': { x: '418', y: '387.3' },
  '05-en-mobile': { x: '418', y: '321.9' },
};
function signature(v) {
  const { root, nodes } = inspect(v.svg);
  const position = counterpartyCards[v.name];
  const repairedCards = position ? nodes.filter(n => tag(n) === 'rect' && attrs(n).x === position.x && attrs(n).y === position.y && attrs(n).height === '100' && attrs(n).rx === '12') : [];
  assert.equal(repairedCards.length, position ? 1 : 0);
  if (position) assert.equal(attrs(repairedCards[0]).width, '172');
  const entries = nodes.map(n => {
    const a = { ...attrs(n) };
    if (repairedCards.includes(n)) a.width = '150';
    if (n === root) for (const k of ['width', 'height', 'style', 'data-gsib-kind']) delete a[k];
    const t = ['text', 'title', 'desc', 'metadata'].includes(tag(n)) ? content(n) : '';
    return [tag(n), Object.entries(a).filter(([k]) => !['fill', 'stroke'].includes(k)).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), textRepairs[v.name]?.[t] || t];
  });
  return createHash('sha256').update(JSON.stringify(entries)).digest('hex');
}
test('all twenty-eight supplied compositions retain their complete primitive order, coordinates, font metrics and labels', () => {
  assert.equal(variants.length, 28); assert.deepEqual(GSIB_KINDS, kinds);
  for (const v of variants) assert.equal(signature(v), originalSignatures[v.name], v.name);
});
test('static diagrams use native theme paints, local markers and unique accessible IDs', () => {
  const ids = new Set();
  for (const v of variants) {
    const { root, nodes } = inspect(v.svg);
    assert.equal(num(root, 'width'), v.mobile ? 600 : 1200);
    assert.equal(num(root, 'height'), Number(attrs(root).viewBox.split(' ')[3]));
    assert.equal(attrs(nodes.find(n => tag(n) === 'rect')).fill, paint('ink'));
    for (const n of nodes) if (attrs(n).id) { assert.ok(!ids.has(attrs(n).id)); ids.add(attrs(n).id); }
    for (const n of nodes.filter(n => tag(n) === 'title')) assert.doesNotMatch(content(n), /ce (?:que|qui|qu[’'])|what .* (?:means|reveals)|—/iu);
  }
  assert.equal(ids.size, 140);
});
const glyphCache = new Map();
const fontFiles = [400, 700].map(weight => fileURLToPath(new URL(`../public/fonts/bank-snapshot/dejavu-sans-${weight}.ttf`, import.meta.url)));
const fontHashes = ['843ad628539ab1a4fe1f74ff971550609028b42439a106b8783881dd2a8b6177', '082056ee6fb7981b18f09ac6cafa23c3c25e755ed5b3ebe11cfe53681e39aa84'];
const fontFaces = Object.fromEntries(fontFiles.map((path, i) => {
  const bytes = readFileSync(path);
  return [[400, 700][i], opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));
test('geometry uses the checked local DejaVu faces without system font substitution', () => {
  fontFiles.forEach((path, i) => assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), fontHashes[i]));
});
test('both DejaVu faces cover every figure character, including spacing, punctuation and directional symbols', () => {
  const characters = new Set(variants.flatMap(v => inspect(v.svg).nodes.filter(n => tag(n) === 'text').flatMap(n => [...content(n)])));
  assert.equal(characters.size, 93);
  for (const c of [' ', '·', '\u202f', '←', '−', '↓', '↑']) assert.ok(characters.has(c));
  for (const [weight, face] of Object.entries(fontFaces)) {
    for (const c of characters) assert.ok(face.charToGlyphIndex(c) > 0, `Missing DejaVu ${weight} glyph U+${c.codePointAt(0).toString(16)}`);
  }
  const css = postcss.parse(readFileSync(new URL('../src/styles/gsib-snapshot.css', import.meta.url), 'utf8'));
  const faces = [];
  css.walkAtRules('font-face', rule => faces.push(Object.fromEntries(rule.nodes.filter(n => n.type === 'decl').map(n => [n.prop, n.value]))));
  assert.deepEqual(faces, [400, 700].map(weight => ({
    'font-family': "'DejaVu Sans'", 'font-style': 'normal', 'font-weight': String(weight), 'font-display': 'swap',
    src: `url('/fonts/bank-snapshot/dejavu-sans-${weight}.ttf') format('truetype')`,
  })));
  const license = readFileSync(new URL('../public/fonts/bank-snapshot/LICENSE.txt', import.meta.url), 'utf8');
  assert.match(license, /https:\/\/dejavu-fonts\.github\.io\/License\.html/u);
  assert.match(license, /Copyright \(c\) 2003 by Bitstream/u);
  assert.match(license, /Permission is hereby granted/u);
});
async function glyph(n) {
  const a = attrs(n), value = content(n), key = JSON.stringify([a['font-size'], a['font-weight'], a['text-anchor'], value]);
  const face = fontFaces[a['font-weight']];
  for (const c of value) assert.ok(face.charToGlyphIndex(c) > 0, `Missing DejaVu ${a['font-weight']} glyph U+${c.codePointAt(0).toString(16)}`);
  if (!glyphCache.has(key)) {
    const escaped = value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8192" height="256"><text x="4096" y="160" fill="white" font-family="DejaVu Sans, Arial, sans-serif" font-size="${a['font-size']}" font-weight="${a['font-weight']}" text-anchor="${a['text-anchor']}">${escaped}</text></svg>`;
    // Fontconfig resolved this stack to Arial on macOS and DejaVu on Linux.
    // Render the already checked local font explicitly on every platform.
    const png = new Resvg(svg, { font: { loadSystemFonts: false, fontFiles } }).render().asPng();
    const { info } = await sharp(png).trim().raw().toBuffer({ resolveWithObject: true });
    const x = -info.trimOffsetLeft - 4096, y = -info.trimOffsetTop - 160;
    glyphCache.set(key, { x, y, right: x + info.width, bottom: y + info.height });
  }
  return glyphCache.get(key);
}
async function assertGeometry(v) {
    const { root } = inspect(v.svg), [, , width, height] = attrs(root).viewBox.split(' ').map(Number);
    const leaves = children(root).filter(n => ['rect', 'line', 'circle', 'path', 'text'].includes(tag(n))), boxes = [];
    const inside = (x, y) => assert.ok(x >= 0 && y >= 0 && x <= width && y <= height, `${v.name}: outside viewBox ${x},${y}`);
    for (const n of leaves) {
      if (tag(n) === 'rect') { inside(num(n, 'x'), num(n, 'y')); inside(num(n, 'x') + num(n, 'width'), num(n, 'y') + num(n, 'height')); }
      if (tag(n) === 'line') { inside(num(n, 'x1'), num(n, 'y1')); inside(num(n, 'x2'), num(n, 'y2')); }
      if (tag(n) === 'circle') { inside(num(n, 'cx') - num(n, 'r'), num(n, 'cy') - num(n, 'r')); inside(num(n, 'cx') + num(n, 'r'), num(n, 'cy') + num(n, 'r')); }
    }
    for (const n of leaves.filter(n => tag(n) === 'text')) {
      const g = await glyph(n), x = num(n, 'x'), y = num(n, 'y'), b = { x: x + g.x, y: y + g.y, right: x + g.right, bottom: y + g.bottom, label: content(n) };
      assert.ok(b.x >= 2 && b.y >= 2 && b.right <= width - 2 && b.bottom <= height - 2, `${v.name}: canvas ${b.label} ${JSON.stringify(b)}`);
      const ix = leaves.indexOf(n), cx = (b.x + b.right) / 2, cy = (b.y + b.bottom) / 2;
      const card = leaves.slice(0, ix).filter(c => tag(c) === 'rect' && num(c, 'rx') > 0 && num(c, 'width') > 80 && num(c, 'x') > 0 && cx >= num(c, 'x') && cx <= num(c, 'x') + num(c, 'width') && cy >= num(c, 'y') && cy <= num(c, 'y') + num(c, 'height')).at(-1);
      if (card) assert.ok(b.x >= num(card, 'x') + 2 && b.y >= num(card, 'y') + 2 && b.right <= num(card, 'x') + num(card, 'width') - 2 && b.bottom <= num(card, 'y') + num(card, 'height') - 2, `${v.name}: card ${b.label} ${JSON.stringify(b)} ${JSON.stringify(attrs(card))}`);
      for (const other of boxes) assert.ok(!(b.x < other.right && b.right > other.x && b.y < other.bottom && b.bottom > other.y), `${v.name}: glyph collision ${other.label}/${b.label}`);
      for (const cover of leaves.slice(ix + 1).filter(c => tag(c) === 'rect' && attrs(c).fill !== 'none')) assert.ok(!(b.x < num(cover, 'x') + num(cover, 'width') && b.right > num(cover, 'x') && b.y < num(cover, 'y') + num(cover, 'height') && b.bottom > num(cover, 'y')), `${v.name}: concealed ${b.label}`);
      boxes.push(b);
    }
}
test('actual glyphs fit the full canvas and their cards without clipping, collisions or later paint concealment', async () => {
  for (const v of variants) await assertGeometry(v);
});
const fixtureBuilder = new XMLBuilder({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '' });
function mutateVariant(v, change) {
  const tree = parser.parse(v.svg);
  change(tree[0]);
  return { ...v, svg: fixtureBuilder.build(tree) };
}
test('deterministic DejaVu metrics reject the original covered label and four overflowing counterparty cards', async () => {
  const first = variants.find(v => v.name === '01-fr-desktop');
  const covered = mutateVariant(first, root => {
    const n = children(root).find(n => tag(n) === 'text' && content(n) === 'Moy. 4 fins de trim.');
    assert.ok(n); n.text = [{ '#text': 'Moy. 4 fins de trimestre' }];
  });
  await assert.rejects(assertGeometry(covered), /concealed Moy\. 4 fins de trimestre/u);
  for (const name of Object.keys(counterpartyCards)) {
    const v = variants.find(v => v.name === name), position = counterpartyCards[name];
    const narrow = mutateVariant(v, root => {
      const n = children(root).find(n => tag(n) === 'rect' && attrs(n).x === position.x && attrs(n).y === position.y && attrs(n).height === '100');
      assert.equal(attrs(n).width, '172'); attrs(n).width = '150';
    });
    await assert.rejects(assertGeometry(narrow), /card (?:contrepartie|counterparty)/u);
  }
});
test('geometry still rejects displaced shapes, colliding type and later paint over otherwise valid labels', async () => {
  const v = variants.find(v => v.name === '01-fr-desktop');
  const outside = mutateVariant(v, root => { const n = children(root).find(n => tag(n) === 'rect'); attrs(n).x = '1'; });
  await assert.rejects(assertGeometry(outside), /outside viewBox/u);
  const collision = mutateVariant(v, root => { const n = children(root).find(n => tag(n) === 'text'); root.svg.push(structuredClone(n)); });
  await assert.rejects(assertGeometry(collision), /glyph collision/u);
  const concealed = mutateVariant(v, root => { root.svg.push({ rect: [], ':@': { x: '32', y: '60', width: '1136', height: '60', rx: '0', fill: paint('paper') } }); });
  await assert.rejects(assertGeometry(concealed), /concealed/u);
});
test('geometry rejects unsupported characters instead of measuring a replacement glyph', async () => {
  const v = variants.find(v => v.name === '01-fr-desktop');
  const missing = mutateVariant(v, root => { const n = children(root).find(n => tag(n) === 'text'); n.text = [{ '#text': '\u{1f984}' }]; });
  await assert.rejects(assertGeometry(missing), /Missing DejaVu 700 glyph U\+1f984/u);
});
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} != ${b}`);
test('five-day exposure reduction yields distinct point-in-time, quarterly, monthly and daily bar lengths', () => {
  const reductions = [50, 50 / 4, 50 / 12, 50 * 5 / 365];
  for (const v of variants.filter(v => v.kind === 'figure1')) {
    const { root, nodes } = inspect(v.svg);
    const bars = nodes.filter(n => tag(n) === 'rect' && num(n, 'rx') === 0 && num(n, 'height') === (v.mobile ? 13 : 26) && [paint('paper'), paint('signal')].includes(attrs(n).fill));
    assert.equal(bars.length, 4);
    bars.forEach((n, i) => close(num(n, 'width') / (v.mobile ? 435 : 700), reductions[i] / 50));
    assert.match(content(root), v.lang === 'fr' ? /999,315/u : /999\.315/u);
    assert.match(content(root), v.lang === 'fr' ? /fictif/u : /Hypothetical|hypothetical/u);
    assert.match(content(root), /940/u); assert.match(content(root), /1[ ,]?010/u);
  }
});
test('compression shows a preserved net notional with gross contracts reduced, without claiming to measure rate risk', () => {
  for (const v of variants.filter(v => v.kind === 'figure5')) {
    const { root, nodes } = inspect(v.svg), copy = content(root).replace(/\s+/gu, ' ');
    assert.match(copy, v.lang === 'fr' ? /Notionnel net/u : /(?:Net|net) notional/u);
    assert.doesNotMatch(copy, /Risque de taux|Exposition nette de taux|Net rate|Model net rate exposure/u);
    assert.match(copy, /190/u); assert.match(copy, /100/u); assert.match(copy, /90/u); assert.match(copy, /10/u);
    const bars = nodes.filter(n => tag(n) === 'rect' && num(n, 'rx') === 0 && num(n, 'height') === (v.mobile ? 28 : 34));
    assert.equal(bars.length, 2); close(num(bars[0], 'width') / num(bars[1], 'width'), 190 / 10);
    for (const replacement of Object.keys(textRepairs[v.name])) assert.ok(nodes.some(n => tag(n) === 'text' && content(n) === replacement), replacement);
  }
});
test('published repo estimates remain historical and separate from pedagogical funding and capital scenarios', () => {
  for (const v of variants.filter(v => v.kind === 'figure4')) {
    const { root, nodes } = inspect(v.svg), copy = content(root).replace(/\s+/gu, ' ');
    for (const value of ['2016', '2021', '2023', '28', '2026']) assert.ok(copy.includes(value));
    assert.match(copy, v.lang === 'fr' ? /66,3/u : /66\.3/u); assert.match(copy, v.lang === 'fr' ? /131,7/u : /131\.7/u);
    assert.match(copy, v.lang === 'fr' ? /ne s’additionnent pas/u : /not additive|must not be added|cannot be added/u);
    const bars = nodes.filter(n => tag(n) === 'rect' && num(n, 'rx') === 0 && [paint('signal'), paint('amber')].includes(attrs(n).fill));
    assert.equal(bars.length, 2); close(num(bars[1], 'width') / num(bars[0], 'width'), 131.7 / 66.3);
  }
  for (const v of variants.filter(v => v.kind === 'figure7')) {
    const { root } = inspect(v.svg), copy = content(root).replace(/\s+/gu, ' ');
    assert.match(copy, /ACT\/360/u); assert.match(copy, /500/u); assert.match(copy, /25/u); assert.match(copy, /100/u); assert.match(copy, /300/u);
    assert.equal(Math.round(500e6 * .01 * 5 / 360), 69444);
    assert.match(copy, /69[ ,]444/u);
    assert.match(copy, v.lang === 'fr' ? /Hypothèses, pas des prix de marché/u : /not market prices/u);
  }
});
test('component props reject invalid types, unknown figures, duplicate references and injection', () => {
  const props = { lang: 'fr', kind: 'figure1', number: '01', caption: 'Illustration', sources: 'S02 S11' };
  assert.deepEqual(validateGsibSnapshotFigure(props), { lang: 'fr', kind: 'figure1', number: '01', caption: 'Illustration', references: ['S02', 'S11'] });
  for (const bad of [null, [], { ...props, lang: 'de' }, { ...props, kind: '__proto__' }, { ...props, kind: { toString: () => 'figure1' } }, { ...props, number: '02' }, { ...props, number: 1 }, { ...props, caption: '' }, { ...props, sources: '' }, { ...props, sources: 'S02 S02' }, { ...props, sources: 'S00' }, { ...props, sources: 'S14' }, { ...props, sources: 'S02\" onclick=bad' }]) assert.throws(() => validateGsibSnapshotFigure(bad), TypeError);
  assert.throws(() => gsibSnapshotSvg('fr', '__proto__'), TypeError); assert.throws(() => gsibSnapshotSvg('fr', 'figure1', 'true'), TypeError);
});
test('component and sources remain native, compact, printable and accessible without client scripts', () => {
  const component = readFileSync(new URL('../src/components/GsibSnapshotFigure.astro', import.meta.url), 'utf8');
  assert.match(component, /set:html=\{gsibSnapshotSvg\(lang, kind, false\)\}/u); assert.match(component, /set:html=\{gsibSnapshotSvg\(lang, kind, true\)\}/u);
  assert.match(component, /@media \(max-width: 640px\)/u); assert.match(component, /@container \(max-width: 640px\)/u); assert.match(component, /max-width: 25rem/u); assert.match(component, /margin-inline: auto/u); assert.match(component, /@media print/u); assert.match(component, /<slot \/>/u);
  assert.doesNotMatch(component, /<script|max-height|overflow:\s*hidden|client:|100vw|translateX/u);
  const css = readFileSync(new URL('../src/styles/gsib-snapshot.css', import.meta.url), 'utf8');
  assert.match(css, /\.g-source h3[^}]*font-size: \.875rem/u); assert.match(css, /\.g-source a[^}]*font-size: \.875rem/u); assert.match(css, /summary:focus-visible/u);
  assert.doesNotMatch(css, /#[0-9a-f]{3,8}\b|!important|font-size:\s*(?:[2-9]\d|[3-9])px/iu);
});
