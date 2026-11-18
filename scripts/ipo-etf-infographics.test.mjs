import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { Resvg } from '@resvg/resvg-js';
import opentype from '@shuding/opentype.js';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { tag, attrs, nodes, content, pathPoints } from './insurance-returns-svg-assertions.mjs';

const components = ['IpoEtfPosition2026', 'IpoIndexCalendar2026', 'IpoReturns2026'].map(name => {
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
  dark: { surface: '#121419', paper: '#e7e9ee', muted: '#8b909b', 'line-strong': '#414349', signal: '#5eead4', amber: '#f5b13d', accent: '#ff4d87' },
  light: { surface: '#fffefa', paper: '#1b1d23', muted: '#4d5461', 'line-strong': '#b9b8b7', signal: '#0b5f58', amber: '#92400e', accent: '#a50f4d' },
};
const allowed = {
  svg: 'xmlns width style viewBox role aria-labelledby xml:lang data-variant', title: 'id', desc: 'id',
  rect: 'x y width height rx fill stroke stroke-width data-series data-horizon data-value data-line-direction',
  circle: 'cx cy r fill data-metric data-value data-entry data-days-from-first-trade',
  path: 'd fill stroke stroke-width stroke-linecap data-metric data-value',
  text: 'x y font-family font-size font-weight text-anchor fill data-panel',
};
function parsed(svg) {
  assert.equal(XMLValidator.validate(svg), true);
  const roots = parser.parse(svg); assert.equal(roots.length, 1);
  return { root: roots[0], all: nodes(roots[0]) };
}
function box(node) {
  const a = attrs(node), value = content(node), size = Number(a['font-size']);
  for (const char of value) assert.notEqual(font.charToGlyphIndex(char), 0, `Missing font glyph: ${char}`);
  const width = font.getAdvanceWidth(value, size, { kerning: true });
  const x = Number(a.x) - (a['text-anchor'] === 'middle' ? width / 2 : a['text-anchor'] === 'end' ? width : 0);
  return { value, x1: x, x2: x + width, y1: Number(a.y) - font.ascender * size / font.unitsPerEm, y2: Number(a.y) - font.descender * size / font.unitsPerEm };
}
const overlap = (a, b) => Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > .8 && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > .8;

test('twelve scenes contain only accessible passive SVG and the regular local l0g font', () => {
  assert.equal(scenes.length, 12);
  const ids = [];
  for (const { svg, mode, lang } of scenes) {
    assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?|\bon[a-z]+\s*=|\b(?:href|src)\s*=|url\(/iu);
    const { root, all } = parsed(svg), a = attrs(root);
    assert.equal(tag(root), 'svg'); assert.equal(a.xmlns, 'http://www.w3.org/2000/svg');
    assert.equal(a.width, '100%'); assert.equal(a.style, 'height:auto'); assert.equal(a.role, 'img');
    assert.equal(a['xml:lang'], lang); assert.equal(a['data-variant'], mode);
    for (const id of a['aria-labelledby'].split(' ')) assert.equal(all.filter(n => attrs(n).id === id && ['title', 'desc'].includes(tag(n)) && content(n).trim()).length, 1);
    ids.push(...all.map(n => attrs(n).id).filter(Boolean));
    for (const n of all) {
      const t = tag(n); assert.ok(Object.hasOwn(allowed, t), t);
      for (const [key, value] of Object.entries(attrs(n))) {
        assert.ok(allowed[t].split(' ').includes(key), `${t}.${key}`);
        if (['fill', 'stroke'].includes(key)) assert.match(value, /^(?:none|var\(--color-(?:surface|paper|muted|line-strong|signal|amber|accent)\))$/u);
      }
      if (t === 'text') {
        assert.equal(attrs(n)['font-family'], 'l0g IPO ETF'); assert.equal(attrs(n)['font-weight'], '400');
        assert.ok(Number(attrs(n)['font-size']) >= 13 && Number(attrs(n)['font-size']) <= 18);
      }
    }
  }
  assert.equal(ids.length, new Set(ids).size);
});

test('all labels, chart strokes and quantity markers stay within compact canvas margins', () => {
  for (const { name, lang, mode, svg } of scenes) {
    const { root, all } = parsed(svg), [, , w, h] = attrs(root).viewBox.split(' ').map(Number);
    assert.equal(w, mode === 'mobile' ? 320 : 680); assert.ok(h <= 380 && h >= 320);
    const labels = all.filter(n => tag(n) === 'text').map(box);
    for (const [i, b] of labels.entries()) {
      assert.ok(b.x1 >= 4 && b.x2 <= w - 4 && b.y1 >= 4 && b.y2 <= h - 4, `${name}/${lang}/${mode}: ${JSON.stringify(b)}`);
      for (const other of labels.slice(i + 1)) assert.equal(overlap(b, other), false, `${name}/${lang}/${mode}: ${b.value} crowds ${other.value}`);
    }
    for (const n of all) {
      const a = attrs(n);
      if (tag(n) === 'rect') assert.ok(Number(a.x) >= 0 && Number(a.y) >= 0 && Number(a.x) + Number(a.width) <= w && Number(a.y) + Number(a.height) <= h);
      if (tag(n) === 'path') for (const [x, y] of pathPoints(a.d)) assert.ok(x >= 4 && x <= w - 4 && y >= 4 && y <= h - 4);
      if (tag(n) === 'circle') assert.ok(Number(a.cx) - Number(a.r) >= 4 && Number(a.cx) + Number(a.r) <= w - 4 && Number(a.cy) - Number(a.r) >= 4 && Number(a.cy) + Number(a.r) <= h - 4);
    }
  }
});

test('position snapshots preserve both counts, the exact decomposition and 101-line comparison', () => {
  assert.equal(5588487 - 2531081, 3057406);
  assert.equal(Math.round(3057406 * 152.71 * 100), 46689647026);
  assert.equal(Math.round(2531081 * (152.71 - 154.81) * 100), -531527010);
  assert.equal(46689647026 - 531527010, 46158120016);
  for (const { svg, lang, mode } of scenes.filter(s => s.name === 'IpoEtfPosition2026')) {
    const { all } = parsed(svg), text = all.filter(n => tag(n) === 'text').map(content).join(' ');
    const metrics = all.filter(n => attrs(n)['data-metric']).map(n => [attrs(n)['data-metric'], Number(attrs(n)['data-value'])]);
    assert.deepEqual(metrics, [['quantity', 466.896], ['price', -5.315], ['total', 461.581], ['spcx-share-change', 120.79], ['other-median', -1.38]]);
    assert.match(text, /2 531 081/u); assert.match(text, /5 588 487/u);
    assert.ok(text.includes(lang === 'fr' ? '−1,38' : '−1.38'));
    const marks = all.filter(n => attrs(n)['data-line-direction']);
    assert.equal(marks.length, 100); assert.equal(marks.filter(n => attrs(n)['data-line-direction'] === 'decrease').length, 71);
    const [start, end, y] = mode === 'mobile' ? [38, 290, 283] : [379, 649, 151];
    const scale = value => start + (value + 5) / 130 * (end - start);
    for (const node of all.filter(n => tag(n) === 'circle' && attrs(n)['data-metric'])) {
      assert.ok(Math.abs(Number(attrs(node).cx) - scale(Number(attrs(node)['data-value']))) <= .011);
      assert.equal(Number(attrs(node).cy), y);
    }
    for (const value of [0, 120]) {
      const label = all.find(n => tag(n) === 'text' && content(n) === `${value} %`);
      assert.ok(label); assert.ok(Math.abs(Number(attrs(label).x) - scale(value)) <= .011, 'Percentage tick and marker use the same scale');
    }
    for (const n of all.filter(n => tag(n) === 'path' && attrs(n)['data-metric'])) {
      const [[x0], [x1]] = pathPoints(attrs(n).d), value = Number(attrs(n)['data-value']);
      assert.ok(Math.abs((x1 - x0) - value / 466.896 * (mode === 'mobile' ? 113 : 280)) < .001, 'Signed decomposition uses one proportional scale');
    }
  }
});

test('calendar retains conditional admissions, implementation versus effect and separate S&P selection', () => {
  for (const { svg, lang } of scenes.filter(s => s.name === 'IpoIndexCalendar2026')) {
    const { all } = parsed(svg), desc = all.filter(n => tag(n) === 'desc').map(content).join(' ');
    assert.deepEqual(all.filter(n => attrs(n)['data-entry']).map(n => [attrs(n)['data-entry'], Number(attrs(n)['data-days-from-first-trade'])]), [['S17', 12], ['S29', 25], ['S31', 32], ['S26', 32]]);
    assert.match(desc, lang === 'fr' ? /conditionnel.*19 novembre 2026/u : /Conditional.*November 19, 2026/u);
    assert.match(desc, lang === 'fr' ? /clôture du 30 novembre.*1er décembre/u : /November 30 close.*December 1/u);
    assert.match(desc, /S&P 500/u); assert.match(desc, /2027/u);
    assert.match(desc, lang === 'fr' ? /décision du comité/u : /committee selection/u);
  }
});

test('historic IPO and market bars use exact BCE values, one common scale and distinct horizons', () => {
  for (const { svg, lang, mode } of scenes.filter(s => s.name === 'IpoReturns2026')) {
    const { all } = parsed(svg), desc = all.filter(n => tag(n) === 'desc').map(content).join(' ');
    const bars = all.filter(n => attrs(n)['data-series']);
    assert.deepEqual(bars.map(n => [attrs(n)['data-horizon'], attrs(n)['data-series'], attrs(n)['data-value']]), [['month', 'ipo', '4.97'], ['month', 'market', '1.00'], ['year', 'ipo', '7.61'], ['year', 'market', '9.70']]);
    for (const n of bars) assert.ok(Math.abs(Number(attrs(n).width) / Number(attrs(n)['data-value']) - (mode === 'mobile' ? 21 : 22.4)) < .001, 'Identical percentage scale');
    assert.match(desc, /S&P 500.*EURO STOXX 300/u); assert.match(desc, /1995.*2026/u);
    assert.match(desc, lang === 'fr' ? /montant offert.*capitalisation/u : /issuance volume.*market capitalisation/u);
    assert.match(desc, lang === 'fr' ? /ETF/u : /ETF/u);
  }
});

test('components compile and keep licensed fonts, source links and at least 12 CSSpx at desktop boundary', async () => {
  assertFontLicenseReferences(readFileSync(new URL('../public/fonts/ukraine-reparations/LICENSE.txt', import.meta.url), 'utf8'), 'liberation');
  const refs = { IpoEtfPosition2026: ['S38', 'S39'], IpoIndexCalendar2026: ['S17', 'S26', 'S29', 'S31', 'S33'], IpoReturns2026: ['S18'] };
  for (const { name, source, art } of components) {
    await transform(source);
    for (const contract of [/max-width:42\.5rem/u, /padding-bottom:1rem/u, /max-width:20rem/u, /liberation-sans-400\.ttf/u]) assert.match(source, contract);
    const thresholds = [...source.matchAll(/@container\s*\(\s*max-width\s*:\s*(\d+(?:\.\d+)?)px\s*\)/gu)]; assert.equal(thresholds.length, 1);
    const threshold = Number(thresholds[0][1]);
    for (const lang of ['fr', 'en']) {
      const { root, all } = parsed(art[lang].desktop), [, , width] = attrs(root).viewBox.split(' ').map(Number);
      const smallest = Math.min(...all.filter(n => tag(n) === 'text').map(n => Number(attrs(n)['font-size'])));
      assert.ok(threshold < width && smallest * threshold / width >= 12);
    }
    for (const id of refs[name]) assert.ok(source.includes(`href="#source-${id}"`));
    assert.doesNotMatch(source, /font-weight:(?:600|700|bold)|—/u);
  }
});

for (const c of components) for (const lang of ['fr', 'en']) for (const [theme, colors] of Object.entries(themes)) {
  test(`${c.name}/${lang}/${theme}: both compact layouts rasterize within their canvas`, () => {
    for (const mode of ['desktop', 'mobile']) {
      const svg = c.art[lang][mode], { root } = parsed(svg), [, , w, h] = attrs(root).viewBox.split(' ').map(Number);
      const rendered = svg.replaceAll('l0g IPO ETF', 'Liberation Sans').replace(/var\(--color-([a-z-]+)\)/gu, (_, key) => colors[key]);
      const renderer = new Resvg(rendered, { font: { fontFiles: [fontFile.pathname], loadSystemFonts: false } }), b = renderer.getBBox();
      assert.ok(b && b.x >= -.1 && b.y >= -.1 && b.x + b.width <= w + .1 && b.y + b.height <= h + .1);
      assert.ok(renderer.render().asPng().length > 1000);
    }
  });
}
