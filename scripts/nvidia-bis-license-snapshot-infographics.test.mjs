import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { Resvg } from '@resvg/resvg-js';
import opentype from '@shuding/opentype.js';
import { tag, attrs, nodes, content } from './insurance-returns-svg-assertions.mjs';

const source = readFileSync(new URL('../src/components/infographics/NvidiaBisLicenseSnapshot2026.astro', import.meta.url), 'utf8');
const marker = 'const art = ', start = source.indexOf(marker) + marker.length;
assert.ok(start >= marker.length);
const art = JSON.parse(source.slice(start, source.indexOf(' as const;', start)));
const scenes = ['fr', 'en'].flatMap(lang => ['desktop', 'mobile'].map(mode => ({ lang, mode, svg: art[lang][mode] })));
const fontFile = new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf', import.meta.url);
const bytes = readFileSync(fontFile);
const font = opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
const themes = {
  dark: { surface: '#121419', paper: '#e7e9ee', muted: '#8b909b', 'line-strong': '#414349', signal: '#5eead4', amber: '#f5b13d' },
  light: { surface: '#fffefa', paper: '#1b1d23', muted: '#4d5461', 'line-strong': '#b9b8b7', signal: '#0b5f58', amber: '#92400e' },
};
const allowed = {
  svg: 'xmlns width style viewBox role aria-labelledby xml:lang data-variant data-snapshot data-disclosed data-unit',
  title: 'id', desc: 'id', g: 'transform data-icon',
  rect: 'x y width height rx fill fill-opacity stroke stroke-width data-measure data-value',
  path: 'd fill stroke stroke-width stroke-linecap stroke-linejoin',
  text: 'x y font-family font-size font-weight text-anchor fill',
};
const parse = svg => {
  assert.equal(XMLValidator.validate(svg), true);
  const roots = parser.parse(svg); assert.equal(roots.length, 1);
  return { root: roots[0], all: nodes(roots[0]) };
};
function labelBox(node) {
  const a = attrs(node), value = content(node), size = Number(a['font-size']);
  for (const char of value) assert.notEqual(font.charToGlyphIndex(char), 0, `Missing glyph ${char}`);
  const advance = font.getAdvanceWidth(value, size, { kerning: true });
  const x = Number(a.x) - (a['text-anchor'] === 'middle' ? advance / 2 : a['text-anchor'] === 'end' ? advance : 0);
  return { value, x1: x, x2: x + advance, y1: Number(a.y) - font.ascender * size / font.unitsPerEm, y2: Number(a.y) - font.descender * size / font.unitsPerEm };
}
const overlaps = (a, b) => Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 1 && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 1;

test('BIS snapshot is passive and accessible with distinct FR/EN responsive IDs and local regular type', () => {
  const allIds = [];
  for (const { lang, mode, svg } of scenes) {
    assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?|\bon[a-z]+\s*=|\b(?:href|src)\s*=|url\(/iu);
    const { root, all } = parse(svg), a = attrs(root);
    assert.equal(tag(root), 'svg'); assert.equal(a.xmlns, 'http://www.w3.org/2000/svg');
    assert.equal(a.width, '100%'); assert.equal(a.style, 'height:auto');
    assert.equal(a.role, 'img'); assert.equal(a['xml:lang'], lang); assert.equal(a['data-variant'], mode);
    const ids = all.map(n => attrs(n).id).filter(Boolean);
    assert.equal(ids.length, new Set(ids).size); allIds.push(...ids);
    for (const id of a['aria-labelledby'].split(' ')) assert.equal(all.filter(n => attrs(n).id === id && ['title', 'desc'].includes(tag(n)) && content(n).trim()).length, 1);
    for (const node of all) {
      const name = tag(node); assert.ok(Object.hasOwn(allowed, name), `Forbidden ${name}`);
      for (const [key, value] of Object.entries(attrs(node))) {
        assert.ok(allowed[name].split(' ').includes(key), `Forbidden ${name}.${key}`);
        if (['fill', 'stroke'].includes(key)) assert.match(value, /^(?:none|var\(--color-(?:surface|paper|muted|line-strong|signal|amber)\))$/u);
        if (key === 'transform') assert.match(value, /^translate\(\d{1,3} \d{1,3}\)$/u);
      }
      if (name === 'text') {
        const a = attrs(node);
        assert.equal(a['font-family'], 'l0g Nvidia BIS License Snapshot'); assert.equal(a['font-weight'], '400');
        assert.ok(Number(a['font-size']) >= 12 && Number(a['font-size']) <= 16);
      }
    }
  }
  assert.equal(allIds.length, new Set(allIds).size);
});

test('bar lengths reproduce chip counts on one scale and keep the May 11 snapshot distinct from disclosure', () => {
  for (const { root, all } of scenes.map(({ svg }) => parse(svg))) {
    assert.equal(attrs(root)['data-snapshot'], '2026-05-11');
    assert.equal(attrs(root)['data-disclosed'], '2026-11-19');
    assert.equal(attrs(root)['data-unit'], 'chips');
    const bars = all.filter(n => attrs(n)['data-measure']);
    assert.deepEqual(bars.map(n => attrs(n)['data-measure']), ['requested', 'approved']);
    const [requested, approved] = bars.map(attrs);
    assert.equal(requested['data-value'], '3444160'); assert.equal(approved['data-value'], '879868');
    assert.equal(requested.x, approved.x); assert.equal(requested.height, approved.height);
    assert.ok(Math.abs(Number(approved.width) / Number(requested.width) - 879868 / 3444160) < 1e-12);
    const labels = all.filter(n => tag(n) === 'text').map(content);
    for (const value of ['3444160', '879868']) assert.ok(labels.some(label => label.replace(/[ ,]/gu, '') === value), value);
    const description = content(all.find(n => tag(n) === 'desc'));
    assert.match(description, /H200/u); assert.match(description, /MI325X/u);
    assert.match(description, /21/u); assert.match(description, /Approved, not shipped/u);
    assert.doesNotMatch(description, /non-shipped|November 19 shipment|expédiées le 19 novembre/u);
  }
});

test('the approved-application status stays explicitly dated in each visible language variant', () => {
  for (const { lang, svg } of scenes) {
    const { all } = parse(svg), labels = all.filter(n => tag(n) === 'text').map(content);
    assert.ok(labels.includes(lang === 'fr' ? '21 demandes approuvées' : '21 approved applications'));
    assert.ok(labels.includes(lang === 'fr' ? 'Statut : non expédiées' : 'Status: not shipped'));
    assert.ok(labels.includes(lang === 'fr' ? 'au 11 mai 2026' : 'as of May 11, 2026'));
    assert.match(content(all.find(n => tag(n) === 'desc')), lang === 'fr' ? /Synthèse partielle/u : /Partial BIS snapshot/u);
  }
});

test('BIS bars, icons and labels remain compact, separated and inside painted bounds in both themes', () => {
  for (const { lang, mode, svg } of scenes) {
    const { root, all } = parse(svg), [, , w, h] = attrs(root).viewBox.split(' ').map(Number);
    assert.equal(w, mode === 'mobile' ? 320 : 600); assert.ok(h <= 300);
    const labels = all.filter(n => tag(n) === 'text').map(labelBox);
    for (const [i, b] of labels.entries()) {
      assert.ok(b.x1 >= 3 && b.x2 <= w - 3 && b.y1 >= 3 && b.y2 <= h - 3, `${lang}/${mode}: ${b.value} outside viewBox`);
      for (const other of labels.slice(i + 1)) assert.equal(overlaps(b, other), false, `${lang}/${mode}: ${b.value} overlaps ${other.value}`);
    }
    for (const node of all.filter(n => attrs(n)['data-measure'])) {
      const a = attrs(node), box = { x1: Number(a.x), x2: Number(a.x) + Number(a.width), y1: Number(a.y), y2: Number(a.y) + Number(a.height) };
      for (const label of labels) assert.equal(overlaps(box, label), false, `${lang}/${mode}: bar crowds ${label.value}`);
    }
    for (const colors of Object.values(themes)) {
      const rendered = svg.replaceAll('l0g Nvidia BIS License Snapshot', 'Liberation Sans').replace(/var\(--color-([a-z-]+)\)/gu, (_, color) => colors[color]);
      const renderer = new Resvg(rendered, { font: { fontFiles: [fontFile.pathname], loadSystemFonts: false } });
      const b = renderer.getBBox();
      assert.ok(b && b.x >= -0.1 && b.y >= -0.1 && b.x + b.width <= w + 0.1 && b.y + b.height <= h + 0.1, `${lang}/${mode}: painted artwork outside viewBox`);
    }
  }
});

test('BIS snapshot component compiles with local fonts, source S01/S02 and compact responsive sizing', async () => {
  await transform(source);
  for (const contract of [/max-width:37\.5rem/u, /@container\(max-width:520px\)/u, /padding-bottom:1rem/u, /liberation-sans-400\.ttf/u]) assert.match(source, contract);
  for (const id of ['S01', 'S02']) assert.match(source, new RegExp(`href="#source-${id}"`, 'u'));
});
