import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { Resvg } from '@resvg/resvg-js';
import opentype from '@shuding/opentype.js';
import { tag, attrs, nodes, content, pathPoints } from './insurance-returns-svg-assertions.mjs';

const components = ['AnthropicLobbyingRevenue2026', 'AnthropicLobbyingMandate2026'].map(name => {
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
  rect: 'x y width height rx fill stroke stroke-width data-quarter data-value',
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

test('Anthropic figures use passive XML, unique accessible descriptions and restrained local type', () => {
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
      if (name === 'text') {
        assert.equal(attrs(node)['font-family'], 'l0g Anthropic Lobbying');
        assert.equal(attrs(node)['font-weight'], '400');
        assert.ok(Number(attrs(node)['font-size']) >= 12 && Number(attrs(node)['font-size']) <= 16);
      }
    }
  }
  assert.equal(allIds.length, new Set(allIds).size, 'Every language and responsive variant has distinct IDs');
});

test('six LD-2 income estimates preserve periods, a zero baseline and separate annual totals', () => {
  const expected = [['2025-Q2', 90], ['2025-Q3', 90], ['2025-Q4', 110], ['2026-Q1', 150], ['2026-Q2', 150], ['2026-Q3', 150]];
  for (const { lang, mode, svg } of scenes.filter(s => s.name.includes('Revenue'))) {
    const { all } = parse(svg), bars = all.filter(n => attrs(n)['data-quarter']);
    assert.deepEqual(bars.map(n => [attrs(n)['data-quarter'], Number(attrs(n)['data-value'])]), expected);
    assert.equal(expected.slice(0, 3).reduce((sum, [, n]) => sum + n, 0), 290);
    assert.equal(expected.slice(3).reduce((sum, [, n]) => sum + n, 0), 450);
    assert.equal(expected.reduce((sum, [, n]) => sum + n, 0), 740);
    for (const bar of bars) {
      const a = attrs(bar);
      assert.equal(Number(a.y) + Number(a.height), mode === 'mobile' ? 210 : 211);
      assert.equal(Number(a.height), Number(a['data-value']) * 0.8);
    }
    const labels = all.filter(n => tag(n) === 'text').map(content).join(' ');
    const desc = all.filter(n => tag(n) === 'desc').map(content).join(' ');
    assert.match(labels, /2025 · 290/u); assert.match(labels, /2026 · 450/u); assert.match(labels, /740/u);
    assert.match(labels, lang === 'fr' ? /milliers USD/u : /USD thousands/u);
    assert.match(desc, lang === 'fr' ? /estimés/u : /estimated/u);
    assert.match(desc, lang === 'fr' ? /encaisser/u : /receivable/u);
    assert.doesNotMatch(labels, /Rubio|Martinez|payé|paid|décaissement|cash/u);
  }
});

test('mandate graph separates the registered engagement from the documented 2016 Senate role', () => {
  for (const { lang, svg } of scenes.filter(s => s.name.includes('Mandate'))) {
    const { all } = parse(svg), relations = all.filter(n => attrs(n)['data-relationship']);
    assert.deepEqual(relations.map(n => attrs(n)['data-relationship']).sort(), ['client-mandate', 'historical-senate-role', 'registered-lobbyist']);
    const historical = relations.find(n => attrs(n)['data-relationship'] === 'historical-senate-role');
    assert.equal(attrs(historical)['stroke-dasharray'], '3 4'); assert.equal(attrs(historical).stroke, 'var(--color-amber)');
    for (const current of relations.filter(n => n !== historical)) assert.equal(attrs(current)['stroke-dasharray'], undefined);
    const labels = all.filter(n => tag(n) === 'text').map(content).join(' ');
    const desc = all.filter(n => tag(n) === 'desc').map(content).join(' ');
    assert.match(labels, /Anthropic/u); assert.match(labels, /Continental/u); assert.match(labels, /Alberto Martinez/u); assert.match(labels, /2016/u);
    assert.match(labels, lang === 'fr' ? /24 avr\. 2025/u : /Apr 24, 2025/u);
    assert.match(desc, lang === 'fr' ? /chef de cabinet du sénateur Marco Rubio/u : /Senator Marco Rubio’s chief of staff/u);
    assert.match(desc, lang === 'fr' ? /historique/u : /historical/u);
    assert.doesNotMatch(`${labels} ${desc}`, /Huang|Nvidia|2026.*Rubio|rendez-vous|meeting|rencontr[ée]|access to Rubio/iu);
  }
});

test('compact layouts keep text, icons and routed relationships clear at both widths', () => {
  for (const { name, lang, mode, svg } of scenes) {
    const { root, all } = parse(svg), [, , w, h] = attrs(root).viewBox.split(' ').map(Number);
    assert.equal(w, mode === 'mobile' ? 320 : 600); assert.ok(h >= 250 && h <= 330);
    const labels = all.filter(n => tag(n) === 'text').map(labelBox);
    for (const [i, b] of labels.entries()) {
      assert.ok(b.x1 >= 3 && b.x2 <= w - 3 && b.y1 >= 3 && b.y2 <= h - 3, `${name}/${lang}/${mode}: ${b.value} outside viewBox`);
      for (const other of labels.slice(i + 1)) assert.equal(overlaps(b, other, -1), false, `${name}/${lang}/${mode}: ${b.value} overlaps ${other.value}`);
    }
    for (const match of svg.matchAll(/<g\b[^>]*\bdata-icon="[^"]+"[^>]*>[\s\S]*?<\/g>/gu)) {
      const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${match[0]}</svg>`
        .replace(/var\(--color-([a-z-]+)\)/gu, (_, color) => themes.dark[color]);
      const b = new Resvg(iconSvg, { font: { loadSystemFonts: false } }).getBBox();
      assert.ok(b, 'Every icon has painted geometry');
      const icon = { x1: b.x, x2: b.x + b.width, y1: b.y, y2: b.y + b.height };
      for (const label of labels) assert.equal(overlaps(icon, label, 0.5), false, `${name}/${lang}/${mode}: icon crowds ${label.value}`);
    }
    for (const node of all.filter(n => attrs(n)['data-relationship'])) {
      const a = attrs(node), points = pathPoints(a.d);
      for (let i = 1; i < points.length; i++) {
        const [x1, y1] = points[i - 1], [x2, y2] = points[i];
        assert.ok(x1 === x2 || y1 === y2, 'Relationship routes are orthogonal');
        const line = { x1: Math.min(x1, x2), x2: Math.max(x1, x2), y1: Math.min(y1, y2), y2: Math.max(y1, y2) };
        for (const label of labels) assert.equal(overlaps(line, label, 2), false, `${name}/${lang}/${mode}: ${a['data-relationship']} crowds ${label.value}`);
      }
    }
  }
});

test('both static Astro components compile with precise source links and responsive containers', async () => {
  for (const { name, source } of components) {
    await transform(source);
    for (const contract of [/max-width:37\.5rem/u, /@container\(max-width:520px\)/u, /padding-bottom:1rem/u, /liberation-sans-400\.ttf/u]) assert.match(source, contract);
    for (const id of name.includes('Revenue') ? ['S02', 'S03'] : ['S01', 'S04']) assert.match(source, new RegExp(`href="#source-${id}"`, 'u'));
  }
});

for (const component of components) for (const lang of ['fr', 'en']) for (const [theme, colors] of Object.entries(themes)) {
  test(`${component.name}/${lang}/${theme}: both responsive variants rasterize inside the viewBox`, () => {
    for (const mode of ['desktop', 'mobile']) {
      const svg = component.art[lang][mode];
      const { root } = parse(svg), [, , w, h] = attrs(root).viewBox.split(' ').map(Number);
      const rendered = svg.replaceAll('l0g Anthropic Lobbying', 'Liberation Sans').replace(/var\(--color-([a-z-]+)\)/gu, (_, color) => colors[color]);
      const renderer = new Resvg(rendered, { font: { fontFiles: [fontFile.pathname], loadSystemFonts: false } });
      const bounds = renderer.getBBox();
      assert.ok(bounds && bounds.x >= -0.1 && bounds.y >= -0.1 && bounds.x + bounds.width <= w + 0.1 && bounds.y + bounds.height <= h + 0.1, `${component.name}/${lang}/${mode}/${theme}: painted artwork outside viewBox`);
      assert.ok(renderer.render().asPng().length > 500, 'Raster output contains the scene');
    }
  });
}
