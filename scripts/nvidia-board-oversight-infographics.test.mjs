import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { Resvg } from '@resvg/resvg-js';
import opentype from '@shuding/opentype.js';
import { tag, attrs, nodes, content, pathPoints } from './insurance-returns-svg-assertions.mjs';

const components = ['NvidiaBoardOversight2026', 'NvidiaInvestigationTimeline2026'].map(name => {
  const source = readFileSync(new URL(`../src/components/infographics/${name}.astro`, import.meta.url), 'utf8');
  const marker = 'const art = ', start = source.indexOf(marker) + marker.length;
  assert.ok(start >= marker.length, 'The static SVG collection is present');
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
  rect: 'x y width height rx fill stroke stroke-width', circle: 'cx cy r fill',
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

test('board and investigation figures use passive XML, accessible IDs and regular local type', () => {
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
        assert.equal(attrs(node)['font-family'], 'l0g Nvidia Board Oversight');
        assert.equal(attrs(node)['font-weight'], '400');
        assert.ok(Number(attrs(node)['font-size']) >= 12 && Number(attrs(node)['font-size']) <= 16);
      }
    }
  }
  assert.equal(allIds.length, new Set(allIds).size, 'Every language and responsive variant has unique accessible IDs');
});

test('the new committee and interim CEO receive both existing teams through the reporting junction', () => {
  for (const { lang, mode, svg } of scenes.filter(s => s.name === 'NvidiaBoardOversight2026')) {
    const { all } = parse(svg), relations = all.filter(n => attrs(n)['data-relationship']);
    assert.deepEqual(relations.map(n => attrs(n)['data-relationship']).sort(), ['committee-reporting', 'dual-reporting-bus', 'interim-ceo-reporting', 'security-reporting', 'trade-reporting']);
    const routes = Object.fromEntries(relations.map(n => [attrs(n)['data-relationship'], pathPoints(attrs(n).d)]));
    const junction = routes['dual-reporting-bus'];
    for (const team of ['security-reporting', 'trade-reporting']) assert.ok(junction.some(p => p.toString() === routes[team].at(-1).toString()), 'Both teams enter the common reporting junction');
    for (const recipient of ['committee-reporting', 'interim-ceo-reporting']) assert.ok(junction.some(p => p.toString() === routes[recipient][0].toString()), 'Both recipients leave the common reporting junction');
    assert.equal(all.filter(n => attrs(n)['data-icon']).length, 4);
    const labels = all.filter(n => tag(n) === 'text').map(content).join(' '), desc = all.filter(n => tag(n) === 'desc').map(content).join(' ');
    assert.match(labels, /Colette Kress/u);
    assert.match(labels, lang === 'fr' ? /DG intérimaire/u : /Interim CEO/u);
    assert.match(desc, lang === 'fr' ? /existantes/u : /existing/u);
    assert.match(desc, lang === 'fr' ? /annonce/u : /announced/u);
    assert.match(desc, /17.*2026|2026.*17/u);
    assert.doesNotMatch(`${labels} ${desc}`, /Trump|Washington|Huang|DOJ|judgment|jugement|veto|droit de nomination/iu);
    assert.equal(attrs(all.find(n => attrs(n)['data-relationship'] === 'dual-reporting-bus'))['stroke-dasharray'], undefined);
    assert.equal(mode === 'mobile' ? junction[0][1] : junction[0][0], mode === 'mobile' ? 192 : 291);
  }
});

test('the government chronology separates the June commercial listing from the investigation sequence', () => {
  for (const { lang, mode, svg } of scenes.filter(s => s.name === 'NvidiaInvestigationTimeline2026')) {
    const { all } = parse(svg), relations = all.filter(n => attrs(n)['data-relationship']);
    assert.deepEqual(relations.map(n => attrs(n)['data-relationship']).sort(), ['check-doj', 'commerce-records', 'records-check']);
    const labels = all.filter(n => tag(n) === 'text').map(content).join(' '), desc = all.filter(n => tag(n) === 'desc').map(content).join(' ');
    for (const expected of ['2024', '2025', 'Commerce', 'Nvidia', 'BIS', 'DOJ']) {
      assert.ok(`${labels} ${desc}`.includes(expected), `Expected chronology detail ${expected}`);
    }
    assert.match(desc, /Alice Huang/u);
    assert.match(labels, /Alice Huang/u);
    assert.match(`${labels} ${desc}`, /no[- ]sell/u);
    assert.match(desc, lang === 'fr' ? /enquête Megaspeed en 2024/u : /began a Megaspeed investigation in 2024/u);
    assert.match(desc, lang === 'fr' ? /ordre des deux actions de juin/u : /order of the two June actions/u);
    assert.match(labels, lang === 'fr' ? /Date non précisée/u : /Date unspecified/u);
    assert.match(desc, lang === 'fr' ? /Selon le communiqué/u : /According to the joint/u);
    assert.doesNotMatch(`${labels} ${desc}`, /Entity List|inculp|convict|guilty|culpab|17 defendants|17 prévenus/iu);
    assert.equal(all.filter(n => attrs(n)['data-icon'] === 'no-sell').length, 1);
    const noSell = svg.match(/<g\b[^>]*\bdata-icon="no-sell"[^>]*>[\s\S]*?<\/g>/u)[0];
    assert.doesNotMatch(noSell, /data-relationship/u, 'The commercial listing is not linked as the cause of the DOJ transition');
  }
});

test('compact scenes keep text, icons and orthogonal reporting paths clear', () => {
  for (const { name, lang, mode, svg } of scenes) {
    const { root, all } = parse(svg), [, , w, h] = attrs(root).viewBox.split(' ').map(Number);
    assert.equal(w, mode === 'mobile' ? 320 : 600); assert.ok(h >= 280 && h <= 330);
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
      assert.ok(icon.x1 >= 3 && icon.x2 <= w - 3 && icon.y1 >= 3 && icon.y2 <= h - 3);
      for (const label of labels) assert.equal(overlaps(icon, label, 0.5), false, `${name}/${lang}/${mode}: icon crowds ${label.value}`);
    }
    for (const node of all.filter(n => attrs(n)['data-relationship'])) {
      const a = attrs(node), points = pathPoints(a.d);
      for (let i = 1; i < points.length; i++) {
        const [x1, y1] = points[i - 1], [x2, y2] = points[i];
        assert.ok(x1 === x2 || y1 === y2, 'Relationship routes remain orthogonal');
        const line = { x1: Math.min(x1, x2), x2: Math.max(x1, x2), y1: Math.min(y1, y2), y2: Math.max(y1, y2) };
        for (const label of labels) assert.equal(overlaps(line, label, 2), false, `${name}/${lang}/${mode}: ${a['data-relationship']} crowds ${label.value}`);
      }
    }
  }
});

test('static Astro components compile and retain their distinct primary sources', async () => {
  for (const { name, source } of components) {
    await transform(source);
    for (const contract of [/max-width:37\.5rem/u, /@container\(max-width:520px\)/u, /padding-bottom:1rem/u, /liberation-sans-400\.ttf/u]) assert.match(source, contract);
    assert.match(source, new RegExp(`href="#source-${name === 'NvidiaBoardOversight2026' ? 'S01' : 'S03'}"`, 'u'));
    assert.doesNotMatch(source, /font-weight:(?:600|700|bold)/u);
  }
});

for (const component of components) for (const lang of ['fr', 'en']) for (const [theme, colors] of Object.entries(themes)) {
  test(`${component.name}/${lang}/${theme}: responsive variants rasterize inside the viewBox`, () => {
    for (const mode of ['desktop', 'mobile']) {
      const svg = component.art[lang][mode];
      const { root } = parse(svg), [, , w, h] = attrs(root).viewBox.split(' ').map(Number);
      const rendered = svg.replaceAll('l0g Nvidia Board Oversight', 'Liberation Sans').replace(/var\(--color-([a-z-]+)\)/gu, (_, color) => colors[color]);
      const renderer = new Resvg(rendered, { font: { fontFiles: [fontFile.pathname], loadSystemFonts: false } });
      const bounds = renderer.getBBox();
      assert.ok(bounds && bounds.x >= -0.1 && bounds.y >= -0.1 && bounds.x + bounds.width <= w + 0.1 && bounds.y + bounds.height <= h + 0.1, `${component.name}/${lang}/${mode}/${theme}: painted artwork outside viewBox`);
      assert.ok(renderer.render().asPng().length > 500, 'Raster output contains the full scene');
    }
  });
}
