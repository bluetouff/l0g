import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';

const source = readFileSync(new URL('../src/components/infographics/NvidiaBoardMandates2026.astro', import.meta.url), 'utf8');
const marker = 'const art = ', start = source.indexOf(marker) + marker.length;
assert.ok(start >= marker.length);
const art = JSON.parse(source.slice(start, source.indexOf(' as const;', start)));
const scenes = ['fr', 'en'].flatMap(lang => ['desktop', 'mobile'].map(mode => ({ lang, mode, svg: art[lang][mode] })));
const bytes = readFileSync(new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf', import.meta.url));
const font = opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@', parseTagValue: false, trimValues: false });
const decode = s => s.replaceAll('&amp;', '&').replaceAll('&gt;', '>').replaceAll('&lt;', '<');
const attrs = str => Object.fromEntries([...str.matchAll(/([a-zA-Z0-9:-]+)="([^"]*)"/gu)].map(m => [m[1], m[2]]));
function assertPathBounds(d, w, h) {
  const tokens = d.match(/[MLHVQCZ]|[-+]?(?:\d*\.\d+|\d+)/gu);
  assert.equal(tokens.join(''), d.replaceAll(/\s+/gu, ''));
  let i = 0, x = 0, y = 0;
  const n = () => { const v = Number(tokens[i++]); assert.ok(Number.isFinite(v)); return v; };
  const point = () => { x = n(); y = n(); assert.ok(x >= 0 && x <= w && y >= 0 && y <= h, `${x},${y} outside ${w}x${h}`); };
  while (i < tokens.length) {
    const op = tokens[i++];
    if (op === 'M' || op === 'L') point();
    else if (op === 'C') { point(); point(); point(); }
    else if (op === 'Q') { point(); point(); }
    else if (op === 'H') { x = n(); assert.ok(x >= 0 && x <= w); }
    else if (op === 'V') { y = n(); assert.ok(y >= 0 && y <= h); }
    else assert.equal(op, 'Z');
  }
}

test('mandate map keeps only documented, separate relations in every language and layout', () => {
  for (const { lang, mode, svg } of scenes) {
    assert.equal(XMLValidator.validate(svg), true);
    const root = parser.parse(svg).svg;
    assert.equal(root['@width'], '100%'); assert.equal(root['@style'], 'height:auto');
    assert.equal(root['@role'], 'img'); assert.equal(root['@xml:lang'], lang); assert.equal(root['@data-variant'], mode);
    const ids = root['@aria-labelledby'].split(' ');
    assert.equal(ids.length, 2); assert.equal(root.title['@id'], ids[0]); assert.equal(root.desc['@id'], ids[1]);
    assert.match(svg, /Wachtell Lipton/u); assert.match(svg, /Paul Weiss/u); assert.match(svg, /Huang/u); assert.match(svg, /Teter/u);
    assert.deepEqual([...svg.matchAll(/data-relationship="([^"]+)"/gu)].map(m => m[1]).sort(), ['appearance-request', 'board-retainer', 'personal-retainer']);
    assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?|\bon[a-z]+\s*=|\b(?:href|src)\s*=|url\(/iu);
    const elements = [...svg.matchAll(/<([a-zA-Z][a-zA-Z0-9]*)\b/gu)].map(m => m[1]);
    for (const tag of elements) assert.ok(['svg', 'title', 'desc', 'rect', 'path', 'circle', 'text'].includes(tag), tag);
    for (const weight of svg.matchAll(/font-weight="([^"]+)"/gu)) assert.equal(weight[1], '400');
  }
});

test('all four mandate maps preserve proportionate type, label separation and bounded artwork', () => {
  for (const { lang, mode, svg } of scenes) {
    const [, w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/u).map(Number);
    assert.equal(w, mode === 'mobile' ? 320 : 600); assert.ok(h <= 330);
    const labels = [];
    for (const m of svg.matchAll(/<text ([^>]+)>([^<]*)<\/text>/gu)) {
      const a = attrs(m[1]), size = Number(a['font-size']), label = decode(m[2]);
      assert.ok(size >= 11.5 && size <= 16); assert.equal(a['font-family'], 'l0g Nvidia Board Mandates');
      for (const c of label) assert.notEqual(font.charToGlyphIndex(c), 0, `Missing glyph ${c}`);
      const width = font.getAdvanceWidth(label, size, { kerning: true });
      const x = Number(a.x) - (a['text-anchor'] === 'middle' ? width / 2 : a['text-anchor'] === 'end' ? width : 0);
      const b = { label, x1: x, x2: x + width, y1: Number(a.y) - font.ascender * size / font.unitsPerEm, y2: Number(a.y) - font.descender * size / font.unitsPerEm };
      assert.ok(b.x1 >= 3 && b.x2 <= w - 3 && b.y1 >= 3 && b.y2 <= h - 3, `${lang}/${mode}: ${label} outside viewBox`);
      for (const old of labels) assert.ok(Math.min(old.x2, b.x2) - Math.max(old.x1, b.x1) <= 1 || Math.min(old.y2, b.y2) - Math.max(old.y1, b.y1) <= 1, `${lang}/${mode}: ${old.label} overlaps ${label}`);
      labels.push(b);
    }
    for (const m of svg.matchAll(/<path [^>]*d="([^"]+)"/gu)) assertPathBounds(m[1], w, h);
    for (const m of svg.matchAll(/<circle ([^>]+)\/>/gu)) { const a = attrs(m[1]), x = Number(a.cx), y = Number(a.cy), r = Number(a.r); assert.ok(x - r >= 0 && y - r >= 0 && x + r <= w && y + r <= h); }
  }
});

test('mandate component compiles and keeps the compact responsive and source contract', async () => {
  await transform(source);
  assert.match(source, /max-width:37\.5rem/u); assert.match(source, /@container\(max-width:520px\)/u);
  assert.match(source, /padding-bottom:1rem/u); assert.match(source, /height:auto/u);
  assert.match(source, /liberation-sans-400\.ttf/u);
  for (const id of ['S02', 'S04', 'S05']) assert.match(source, new RegExp(`href="#source-${id}"`, 'u'));
});
