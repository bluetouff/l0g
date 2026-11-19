import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { Resvg } from '@resvg/resvg-js';
import opentype from '@shuding/opentype.js';
import { tag, attrs, nodes, content, pathPoints } from './insurance-returns-svg-assertions.mjs';

const source = readFileSync(new URL('../src/components/infographics/NvidiaCreditTransmission2026.astro', import.meta.url), 'utf8');
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
  svg: 'xmlns width style viewBox role aria-labelledby xml:lang data-variant', title: 'id', desc: 'id',
  rect: 'x y width height rx fill stroke stroke-width', g: 'transform data-icon',
  path: 'd fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray data-relationship',
  text: 'x y font-family font-size font-weight text-anchor fill',
};
const parse = svg => {
  assert.equal(XMLValidator.validate(svg), true);
  const roots = parser.parse(svg);
  assert.equal(roots.length, 1);
  return { root: roots[0], all: nodes(roots[0]) };
};
function labelBox(node) {
  const a = attrs(node), value = content(node), size = Number(a['font-size']);
  for (const char of value) assert.notEqual(font.charToGlyphIndex(char), 0, `Missing glyph ${char}`);
  const advance = font.getAdvanceWidth(value, size, { kerning: true });
  const x = Number(a.x) - (a['text-anchor'] === 'middle' ? advance / 2 : a['text-anchor'] === 'end' ? advance : 0);
  return { value, x1: x, x2: x + advance, y1: Number(a.y) - font.ascender * size / font.unitsPerEm, y2: Number(a.y) - font.descender * size / font.unitsPerEm };
}
const overlaps = (a, b, clearance = 0) => Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > -clearance && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > -clearance;

test('credit transmission artwork is passive, locally typeset and accessible in all four variants', () => {
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
        assert.equal(a['font-family'], 'l0g Nvidia Credit Transmission'); assert.equal(a['font-weight'], '400');
        assert.ok(Number(a['font-size']) >= 11.5 && Number(a['font-size']) <= 16);
      }
    }
  }
  assert.equal(allIds.length, new Set(allIds).size, 'FR/EN and responsive variants need distinct IDs');
});

test('the three channels stay parallel and distinguish planned loans and the conditional subscription', () => {
  for (const { lang, mode, svg } of scenes) {
    const { root, all } = parse(svg), relations = all.filter(n => attrs(n)['data-relationship']);
    assert.deepEqual(relations.map(n => attrs(n)['data-relationship']), ['own-debt-funding', 'planned-third-party-client-loans', 'conditional-anthropic-equity']);
    const expectedY = mode === 'mobile' ? [89, 166, 250] : [99, 177, 255];
    relations.forEach((node, index) => {
      const a = attrs(node), points = pathPoints(a.d);
      assert.equal(points.length, 2);
      assert.ok(points[0][0] < points[1][0]);
      assert.deepEqual(points.map(p => p[1]), [expectedY[index], expectedY[index]]);
      assert.equal(a['stroke-dasharray'], index > 0 ? '3 4' : undefined);
    });
    const description = content(root.svg.find(n => tag(n) === 'desc'));
    assert.match(description, /Aa1/u); assert.doesNotMatch(svg, /AA1/u);
    assert.doesNotMatch(svg, /\bUSD\b|\$|step-up|coupon/iu);
    if (lang === 'fr') {
      assert.match(description, /visent à mobiliser des capitaux tiers/u); assert.match(description, /éventuel soutien Nvidia propre à chaque projet/u);
      assert.match(description, /conditionnée au règlement/u); assert.match(description, /ne forment pas un agrégat/u);
    } else {
      assert.match(description, /aim to raise outside capital/u); assert.match(description, /possible Nvidia support specific to each project/u);
      assert.match(description, /conditional on the IPO closing/u); assert.match(description, /do not form an aggregate/u);
    }
  }
});

test('compact layouts keep labels, arrows and painted artwork separated and inside the viewBox', () => {
  for (const { lang, mode, svg } of scenes) {
    const { root, all } = parse(svg), [, , w, h] = attrs(root).viewBox.split(' ').map(Number);
    assert.equal(w, mode === 'mobile' ? 320 : 600); assert.ok(h <= 330);
    const labels = all.filter(n => tag(n) === 'text').map(labelBox);
    for (const [i, b] of labels.entries()) {
      assert.ok(b.x1 >= 3 && b.x2 <= w - 3 && b.y1 >= 3 && b.y2 <= h - 3, `${lang}/${mode}: ${b.value} outside viewBox`);
      for (const other of labels.slice(i + 1)) assert.equal(overlaps(b, other, -1), false, `${lang}/${mode}: ${b.value} overlaps ${other.value}`);
    }
    for (const node of all.filter(n => attrs(n)['data-relationship'])) {
      const a = attrs(node), [from, to] = pathPoints(a.d);
      const line = { x1: from[0], x2: to[0], y1: from[1], y2: to[1] };
      for (const label of labels) assert.equal(overlaps(line, label, 2), false, `${lang}/${mode}: ${a['data-relationship']} crowds ${label.value}`);
    }
    for (const colors of Object.values(themes)) {
      const rendered = svg.replaceAll('l0g Nvidia Credit Transmission', 'Liberation Sans').replace(/var\(--color-([a-z-]+)\)/gu, (_, color) => colors[color]);
      const renderer = new Resvg(rendered, { font: { fontFiles: [fontFile.pathname], loadSystemFonts: false } });
      const b = renderer.getBBox();
      assert.ok(b && b.x >= -0.1 && b.y >= -0.1 && b.x + b.width <= w + 0.1 && b.y + b.height <= h + 0.1, `${lang}/${mode}: painted artwork outside viewBox`);
    }
  }
});

test('credit transmission component compiles with the shared responsive, font and source contract', async () => {
  await transform(source);
  for (const contract of [/max-width:37\.5rem/u, /@container\(max-width:520px\)/u, /padding-bottom:1rem/u, /liberation-sans-400\.ttf/u]) assert.match(source, contract);
  for (const id of ['S01', 'S04', 'S06', 'S07']) assert.match(source, new RegExp(`href="#source-${id}"`, 'u'));
});
