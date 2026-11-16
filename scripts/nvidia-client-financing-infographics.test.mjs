import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { Resvg } from '@resvg/resvg-js';
import opentype from '@shuding/opentype.js';
import { tag, attrs, nodes, content, pathPoints } from './insurance-returns-svg-assertions.mjs';

const components = ['NvidiaClientCapital2026', 'NvidiaCapacitySupport2026'].map(name => {
  const source = readFileSync(new URL(`../src/components/infographics/${name}.astro`, import.meta.url), 'utf8');
  const marker = 'const art = ', start = source.indexOf(marker) + marker.length;
  assert.ok(start >= marker.length);
  return { name, source, art: JSON.parse(source.slice(start, source.indexOf(' as const;', start))) };
});
const scenes = components.flatMap(c => ['fr', 'en'].flatMap(lang => ['desktop', 'mobile'].map(mode => ({ ...c, lang, mode, svg: c.art[lang][mode] }))));
const fontFile = new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf', import.meta.url);
const bytes = readFileSync(fontFile);
const font = opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
const themes = {
  dark: { surface: '#121419', paper: '#e7e9ee', muted: '#8b909b', 'line-strong': '#414349', signal: '#5eead4', amber: '#f5b13d' },
  light: { surface: '#fffefa', paper: '#1b1d23', muted: '#4d5461', 'line-strong': '#b9b8b7', signal: '#0b5f58', amber: '#92400e' },
};
const allowed = {
  svg: 'xmlns width style viewBox role aria-labelledby xml:lang data-variant', title: 'id', desc: 'id',
  rect: 'x y width height rx fill stroke stroke-width',
  g: 'transform data-icon',
  path: 'd fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray data-relationship',
  text: 'x y font-family font-size font-weight text-anchor fill',
};
const parse = svg => { assert.equal(XMLValidator.validate(svg), true); const roots = parser.parse(svg); assert.equal(roots.length, 1); return { root: roots[0], all: nodes(roots[0]) }; };
function labelBox(node) {
  const a = attrs(node), value = content(node), size = Number(a['font-size']);
  for (const char of value) assert.notEqual(font.charToGlyphIndex(char), 0, `Missing glyph ${char}`);
  const advance = font.getAdvanceWidth(value, size, { kerning: true });
  const x = Number(a.x) - (a['text-anchor'] === 'middle' ? advance / 2 : a['text-anchor'] === 'end' ? advance : 0);
  return { value, x1: x, x2: x + advance, y1: Number(a.y) - font.ascender * size / font.unitsPerEm, y2: Number(a.y) - font.descender * size / font.unitsPerEm };
}
const overlaps = (a, b, clearance = 0) => Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > -clearance && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > -clearance;

test('financing figures contain passive XML, unique accessible descriptions and regular local typography', () => {
  const allIds = [];
  for (const { lang, mode, svg } of scenes) {
    assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?|\bon[a-z]+\s*=|\b(?:href|src)\s*=|url\(/iu);
    const { root, all } = parse(svg), a = attrs(root);
    assert.equal(tag(root), 'svg'); assert.equal(a.xmlns, 'http://www.w3.org/2000/svg');
    assert.equal(a.width, '100%'); assert.equal(a.style, 'height:auto');
    assert.equal(a.role, 'img'); assert.equal(a['xml:lang'], lang); assert.equal(a['data-variant'], mode);
    const ids = all.map(n => attrs(n).id).filter(Boolean); assert.equal(ids.length, new Set(ids).size); allIds.push(...ids);
    for (const id of a['aria-labelledby'].split(' ')) assert.equal(all.filter(n => attrs(n).id === id && ['title', 'desc'].includes(tag(n)) && content(n).trim()).length, 1);
    for (const node of all) {
      const name = tag(node); assert.ok(Object.hasOwn(allowed, name), `Forbidden ${name}`);
      for (const [key, value] of Object.entries(attrs(node))) {
        assert.ok(allowed[name].split(' ').includes(key), `Forbidden ${name}.${key}`);
        if (['fill', 'stroke'].includes(key)) assert.match(value, /^(?:none|var\(--color-(?:surface|paper|muted|line-strong|signal|amber)\))$/u);
        if (key === 'transform') assert.match(value, /^translate\(\d{1,3} \d{1,3}\)$/u);
      }
      if (name === 'text') { assert.equal(attrs(node)['font-family'], 'l0g Nvidia Client Financing'); assert.equal(attrs(node)['font-weight'], '400'); assert.ok(Number(attrs(node)['font-size']) >= 12 && Number(attrs(node)['font-size']) <= 16); }
    }
  }
  assert.equal(allIds.length, new Set(allIds).size, 'FR/EN and responsive variants have distinct IDs');
});

test('capital circuits stay open to outside funding and each commitment reduction has its own documented use', () => {
  for (const { name, svg } of scenes) {
    const { all } = parse(svg), relations = all.filter(n => attrs(n)['data-relationship']);
    const names = relations.map(n => attrs(n)['data-relationship']);
    if (name.includes('ClientCapital')) assert.deepEqual(names.sort(), ['compute-purchase', 'equipment-purchase', 'nvidia-equity-investment', 'other-cloud-funding', 'other-lab-funding']);
    else {
      assert.deepEqual(names.sort(), ['nvidia-research-use', 'research-use-reduces-commitment', 'third-party-resale', 'third-party-use-reduces-commitment']);
      assert.equal(attrs(relations.find(n => attrs(n)['data-relationship'] === 'third-party-resale'))['stroke-dasharray'], '3 4');
      assert.doesNotMatch(svg, /\b(?:29|36)\b|dollar-for-dollar|dollar pour dollar|USD|\$/u);
    }
  }
});

test('all layouts keep labels and relationship paths separated within compact painted bounds', () => {
  for (const { name, lang, mode, svg } of scenes) {
    const { root, all } = parse(svg), [, , w, h] = attrs(root).viewBox.split(' ').map(Number);
    assert.equal(w, mode === 'mobile' ? 320 : 600); assert.ok(h <= 330);
    const labels = all.filter(n => tag(n) === 'text').map(labelBox);
    for (const [i, b] of labels.entries()) {
      assert.ok(b.x1 >= 3 && b.x2 <= w - 3 && b.y1 >= 3 && b.y2 <= h - 3, `${name}/${lang}/${mode}: ${b.value} outside viewBox`);
      for (const other of labels.slice(i + 1)) assert.equal(overlaps(b, other, -1), false, `${name}/${lang}/${mode}: ${b.value} overlaps ${other.value}`);
    }
    for (const node of all.filter(n => attrs(n)['data-relationship'])) {
      const a = attrs(node), points = pathPoints(a.d);
      for (let i = 1; i < points.length; i++) {
        const [x1, y1] = points[i - 1], [x2, y2] = points[i];
        assert.ok(x1 === x2 || y1 === y2, 'Relationship routes use orthogonal segments');
        const line = { x1: Math.min(x1, x2), x2: Math.max(x1, x2), y1: Math.min(y1, y2), y2: Math.max(y1, y2) };
        for (const label of labels) assert.equal(overlaps(line, label, 2), false, `${name}/${lang}/${mode}: ${a['data-relationship']} crowds ${label.value}`);
      }
    }
    for (const colors of Object.values(themes)) {
      const rendered = svg.replaceAll('l0g Nvidia Client Financing', 'Liberation Sans').replace(/var\(--color-([a-z-]+)\)/gu, (_, color) => colors[color]);
      const renderer = new Resvg(rendered, { font: { fontFiles: [fontFile.pathname], loadSystemFonts: false } });
      const bounds = renderer.getBBox();
      assert.ok(bounds && bounds.x >= -0.1 && bounds.y >= -0.1 && bounds.x + bounds.width <= w + 0.1 && bounds.y + bounds.height <= h + 0.1, `${name}/${lang}/${mode}: painted artwork outside viewBox`);
    }
  }
});

test('both Astro components compile and keep local fonts, source S04 and compact container rules', async () => {
  for (const { source } of components) {
    await transform(source);
    for (const contract of [/max-width:37\.5rem/u, /@container\(max-width:520px\)/u, /padding-bottom:1rem/u, /liberation-sans-400\.ttf/u, /href="#source-S04"/u]) assert.match(source, contract);
  }
});
