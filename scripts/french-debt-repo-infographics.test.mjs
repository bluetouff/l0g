import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { Resvg } from '@resvg/resvg-js';
import opentype from '@shuding/opentype.js';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { tag, attrs, nodes, content, pathPoints } from './insurance-returns-svg-assertions.mjs';

const components = ['FrenchRepoSnapshots2026', 'FrenchRepoCircuit2026', 'FrenchOatPricing2026'].map(name => {
  const source = readFileSync(new URL(`../src/components/infographics/${name}.astro`, import.meta.url), 'utf8');
  const marker = 'const art = ', start = source.indexOf(marker) + marker.length;
  assert.ok(start >= marker.length, 'Static, reviewable SVG data must exist');
  return { name, source, art: JSON.parse(source.slice(start, source.indexOf(' as const;', start))) };
});
const scenes = components.flatMap(c => ['fr', 'en'].flatMap(lang => ['desktop', 'mobile'].map(mode => ({ ...c, lang, mode, svg: c.art[lang][mode] }))));
const data = JSON.parse(readFileSync(new URL('../src/data/french-debt-repo-2026.json', import.meta.url), 'utf8'));
const fontFile = new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf', import.meta.url);
const fontBytes = readFileSync(fontFile);
const font = opentype.parse(fontBytes.buffer.slice(fontBytes.byteOffset, fontBytes.byteOffset + fontBytes.byteLength));
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
const themes = {
  dark: { surface: '#121419', paper: '#e7e9ee', muted: '#8b909b', 'line-strong': '#414349', signal: '#5eead4', amber: '#f5b13d', accent: '#ff4d87' },
  light: { surface: '#fffefa', paper: '#1b1d23', muted: '#4d5461', 'line-strong': '#b9b8b7', signal: '#0b5f58', amber: '#92400e', accent: '#a50f4d' },
};
const allowed = {
  svg: 'xmlns width style viewBox role aria-labelledby xml:lang data-variant', title: 'id', desc: 'id',
  rect: 'x y width height rx fill stroke stroke-width', circle: 'cx cy r fill', g: 'transform data-icon',
  path: 'd fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray data-relationship data-series data-observations',
  text: 'x y font-family font-size font-weight text-anchor fill data-panel',
};
const parsed = svg => {
  assert.equal(XMLValidator.validate(svg), true);
  const roots = parser.parse(svg); assert.equal(roots.length, 1);
  return { root: roots[0], all: nodes(roots[0]) };
};
function box(node) {
  const a = attrs(node), value = content(node), size = Number(a['font-size']);
  for (const char of value) assert.notEqual(font.charToGlyphIndex(char), 0, `Missing regular-font glyph ${char}`);
  const width = font.getAdvanceWidth(value, size, { kerning: true });
  const x = Number(a.x) - (a['text-anchor'] === 'middle' ? width / 2 : a['text-anchor'] === 'end' ? width : 0);
  return { value, panel: a['data-panel'], x1: x, x2: x + width, y1: Number(a.y) - font.ascender * size / font.unitsPerEm, y2: Number(a.y) - font.descender * size / font.unitsPerEm };
}
const overlap = (a, b, inset = 0) => Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > inset && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > inset;
const approx = (a, b, message) => assert.ok(Math.abs(a - b) <= .011, `${message}: ${a} versus ${b}`);

test('all twelve static scenes use accessible passive XML, local regular typography and the l0g palette', () => {
  assert.equal(scenes.length, 12);
  const ids = [];
  for (const { lang, mode, svg } of scenes) {
    assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?|\bon[a-z]+\s*=|\b(?:href|src)\s*=|url\(/iu);
    const { root, all } = parsed(svg), a = attrs(root);
    assert.equal(tag(root), 'svg'); assert.equal(a.xmlns, 'http://www.w3.org/2000/svg');
    assert.equal(a.width, '100%'); assert.equal(a.style, 'height:auto'); assert.equal(a.role, 'img');
    assert.equal(a['xml:lang'], lang); assert.equal(a['data-variant'], mode);
    for (const id of a['aria-labelledby'].split(' ')) assert.equal(all.filter(n => attrs(n).id === id && ['title', 'desc'].includes(tag(n)) && content(n).trim()).length, 1);
    ids.push(...all.map(n => attrs(n).id).filter(Boolean));
    for (const node of all) {
      const t = tag(node); assert.ok(Object.hasOwn(allowed, t), `Forbidden element ${t}`);
      for (const [key, value] of Object.entries(attrs(node))) {
        assert.ok(allowed[t].split(' ').includes(key), `Forbidden attribute ${t}.${key}`);
        if (['fill', 'stroke'].includes(key)) assert.match(value, /^(?:none|var\(--color-(?:surface|paper|muted|line-strong|signal|amber|accent)\))$/u);
        if (key === 'transform') assert.match(value, /^translate\(\d{1,3} \d{1,3}\)$/u);
      }
      if (t === 'text') {
        assert.equal(attrs(node)['font-family'], 'l0g French Debt Repo'); assert.equal(attrs(node)['font-weight'], '400');
        assert.ok(Number(attrs(node)['font-size']) >= 13 && Number(attrs(node)['font-size']) <= 18);
      }
    }
  }
  assert.equal(ids.length, new Set(ids).size, 'Accessible IDs are unique across languages, layouts and figures');
});

test('verified ECB inputs preserve all 96 dated balances, scope and the reported source digests', () => {
  assert.equal(data.weekly.length, 96);
  assert.equal(data.weekly[0].date, '2025-01-08'); assert.equal(data.weekly.at(-1).date, '2026-11-04');
  for (let i = 1; i < data.weekly.length; i++) assert.equal(Date.parse(data.weekly[i].date) - Date.parse(data.weekly[i - 1].date), 7 * 86400000);
  assert.equal(data.sources.ecb.zipSha256, '105be31c05f19b60ee66cbb201b5816ef833e5a1ca074fba3d7e3adfff57f168');
  assert.equal(data.sources.ecb.workbookSha256, 'aff77ba073e498403f8510088bb7205f58a1698e72b1ddba210c03debe946ef3');
  assert.equal(data.sources.ecb.range, 'O10:S105');
  const on = date => data.weekly.find(row => row.date === date);
  assert.equal(on('2026-02-25').fr, '33.152530114249998');
  assert.equal(on('2026-04-01').fr, '22.380736507990001');
  assert.equal(on('2026-11-04').fr, '55.128495182649694');
  assert.equal(on('2026-03-04').fourIssuers, '109.9857193907400017');
  assert.equal(data.weekly.reduce((a, b) => Number(a.fr) > Number(b.fr) ? a : b).date, '2026-11-04');
  assert.ok(Number(data.changes.find(r => r.country === 'DE').spring) < 0);
  assert.ok(Number(data.changes.find(r => r.country === 'DE').autumn) < 0);
  approx(data.changes.reduce((sum, r) => sum + Number(r.spring), 0), -50.36669121629, 'Spring changes sum');
  approx(data.changes.reduce((sum, r) => sum + Number(r.autumn), 0), 22.03530055428, 'Later changes sum');
});

test('all 96 points per curve retain the verified weekly inputs and contributions stay distinct from balances', () => {
  for (const { lang, mode, svg } of scenes.filter(s => s.name === 'FrenchRepoSnapshots2026')) {
    const { all } = parsed(svg), series = all.filter(n => attrs(n)['data-series']);
    assert.equal(series.length, 2);
    const [x0, x1, y0, y1] = mode === 'mobile' ? [44, 304, 86, 196] : [44, 405, 96, 270];
    for (const curve of series) {
      const field = attrs(curve)['data-series']; assert.ok(['fourIssuers', 'fr'].includes(field));
      const points = pathPoints(attrs(curve).d); assert.equal(points.length, 96); assert.equal(attrs(curve)['data-observations'], '96');
      for (const [i, [x, y]] of points.entries()) {
        approx(x, x0 + i / 95 * (x1 - x0), `Week ${i} x`);
        approx(y, y1 - (Number(data.weekly[i][field]) + 5) / 125 * (y1 - y0), `Week ${i} ${field} y`);
      }
    }
    const text = all.filter(n => tag(n) === 'text').map(content).join(' '), desc = all.filter(n => tag(n) === 'desc').map(content).join(' ');
    assert.match(text, lang === 'fr' ? /55,13/u : /55\.13/u); assert.match(text, lang === 'fr' ? /−10,77/u : /−10\.77/u);
    assert.match(text, lang === 'fr' ? /\+32,75/u : /\+32\.75/u);
    assert.match(desc, lang === 'fr' ? /prêt net/u : /net cash lending/u);
    assert.match(desc, lang === 'fr' ? /variations ne sont pas des ventes/u : /changes are distinct from bond sales/u);
  }
});

test('the repo diagram separates collateral, repo cash, futures hedging, margin accounts and conditional unwind', () => {
  for (const { lang, svg } of scenes.filter(s => s.name === 'FrenchRepoCircuit2026')) {
    const { all } = parsed(svg), labels = all.filter(n => tag(n) === 'text').map(content).join(' '), desc = all.filter(n => tag(n) === 'desc').map(content).join(' ');
    assert.deepEqual(all.filter(n => attrs(n)['data-relationship']).map(n => attrs(n)['data-relationship']), ['bond-collateral', 'repo-cash', 'futures-hedge', 'futures-margins']);
    assert.match(desc, lang === 'fr' ? /Schéma pédagogique/u : /Illustrative mechanism/u);
    assert.match(desc, lang === 'fr' ? /compte de marge.*distinct/u : /margin and repo funding use separate accounts/u);
    assert.match(desc, lang === 'fr' ? /réponse possible/u : /possible response/u);
    assert.match(labels, lang === 'fr' ? /rachat du futur/u : /buy(?:ing)? back futures/u);
    assert.doesNotMatch(labels, /HSBC|CoreWeave|Jupiter|55[,.]13|640/u, 'Generic mechanism is separate from individual observed financing positions');
    assert.equal(all.filter(n => attrs(n)['data-icon']).length, 3);
  }
});

test('margin cash is bidirectional and its arrowheads stay clear of the futures-sale arrowhead in both layouts', () => {
  for (const { lang, mode, svg } of scenes.filter(s => s.name === 'FrenchRepoCircuit2026')) {
    const { all } = parsed(svg);
    const paths = all.filter(n => tag(n) === 'path');
    const hedgeIndex = paths.findIndex(n => attrs(n)['data-relationship'] === 'futures-hedge');
    const marginIndex = paths.findIndex(n => attrs(n)['data-relationship'] === 'futures-margins');
    assert.ok(hedgeIndex >= 0 && marginIndex > hedgeIndex);
    const hedge = paths[hedgeIndex], margin = paths[marginIndex];
    assert.equal(attrs(hedge).stroke, 'var(--color-signal)');
    assert.equal(attrs(margin).stroke, 'var(--color-accent)');
    const hedgePoints = pathPoints(attrs(hedge).d), marginPoints = pathPoints(attrs(margin).d);
    const hedgeHead = pathPoints(attrs(paths[hedgeIndex + 1]).d);
    const marginHeads = [paths[marginIndex + 1], paths[marginIndex + 2]].map(n => pathPoints(attrs(n).d));
    assert.equal(hedgeHead.length, 3); assert.ok(marginHeads.every(head => head.length === 3));
    assert.deepEqual(hedgeHead[1], hedgePoints.at(-1), 'The green arrowhead belongs to the futures-sale route');
    assert.deepEqual(marginHeads[0][1], marginPoints.at(-1), 'One pink arrowhead points to the fund');
    assert.deepEqual(marginHeads[1][1], marginPoints[0], 'The other pink arrowhead points to the futures account');
    const bounds = points => ({ x1: Math.min(...points.map(p => p[0])) - .55, x2: Math.max(...points.map(p => p[0])) + .55, y1: Math.min(...points.map(p => p[1])) - .55, y2: Math.max(...points.map(p => p[1])) + .55 });
    const green = bounds(hedgeHead);
    for (const head of marginHeads) {
      const pink = bounds(head);
      const dx = Math.max(green.x1 - pink.x2, pink.x1 - green.x2, 0);
      const dy = Math.max(green.y1 - pink.y2, pink.y1 - green.y2, 0);
      assert.ok(Math.hypot(dx, dy) >= 12, `${lang}/${mode}: contrasting arrowheads need at least 12px of painted clearance`);
    }
    const labels = all.filter(n => tag(n) === 'text').map(content).join(' ');
    const description = all.filter(n => tag(n) === 'desc').map(content).join(' ');
    assert.match(labels, lang === 'fr' ? /Flux de marge/u : mode === 'mobile' ? /Margin flows/u : /Margin cash flows/u);
    assert.match(description, lang === 'fr' ? /versements du fonds et restitutions vers le fonds/u : /payments by the fund and cash returned to the fund/u);
    assert.match(description, lang === 'fr' ? /compte de marge.*distinct du financement repo/u : /Futures margin and repo funding use separate accounts/u);
  }
});

test('same-ISIN auction prices and yields use a separate panel from the monthly benchmark spread', () => {
  assert.equal(data.sources.aft.isin, 'FR0014012II5');
  assert.deepEqual(data.auctions.map(r => [r.date, r.price, r.yieldPct]), [['2026-02-05', '100.42', '3.45'], ['2026-03-05', '100.90', '3.39'], ['2026-04-02', '98.16', '3.73']]);
  assert.equal(data.monthlySpread.length, 10);
  approx(Number(data.monthlySpread[8].spreadBp), 96.59090909, 'September spread');
  approx(Number(data.monthlySpread[9].spreadBp), 147.40909091, 'October spread');
  for (const { lang, mode, svg } of scenes.filter(s => s.name === 'FrenchOatPricing2026')) {
    const { all } = parsed(svg), labels = all.filter(n => tag(n) === 'text').map(content).join(' ');
    const series = all.filter(n => attrs(n)['data-series']); assert.equal(series.length, 2);
    assert.deepEqual(series.map(n => [attrs(n)['data-series'], pathPoints(attrs(n).d).length]), [['auction-price', 3], ['monthly-spread', 10]]);
    assert.match(labels, /FR0014012II5/u);
    for (const value of lang === 'fr' ? ['100,42', '100,90', '98,16', '3,45', '3,39', '3,73', '147,4'] : ['100.42', '100.90', '98.16', '3.45', '3.39', '3.73', '147.4']) assert.ok(labels.includes(value), value);
    for (const node of all.filter(n => tag(n) === 'text' && attrs(n)['data-panel'] === 'spread')) {
      const b = box(node); assert.ok(mode === 'mobile' ? b.y1 > 280 : b.x1 > 360, 'Monthly spread labels remain inside their own panel');
    }
  }
});

test('internal labels, quantitative panels, icons and relationship routes retain visible safety margins', () => {
  for (const { name, lang, mode, svg } of scenes) {
    const { root, all } = parsed(svg), [, , w, h] = attrs(root).viewBox.split(' ').map(Number);
    assert.equal(w, mode === 'mobile' ? 320 : 680); assert.ok(h >= 330 && h <= 380);
    const labels = all.filter(n => tag(n) === 'text').map(box);
    for (const [i, b] of labels.entries()) {
      assert.ok(b.x1 >= 4 && b.x2 <= w - 4 && b.y1 >= 4 && b.y2 <= h - 4, `${name}/${lang}/${mode}: ${b.value} outside the canvas (${JSON.stringify(b)})`);
      for (const other of labels.slice(i + 1)) assert.equal(overlap(b, other, .8), false, `${name}/${lang}/${mode}: ${b.value} crowds ${other.value}`);
      if (name === 'FrenchRepoSnapshots2026' && mode === 'desktop') {
        if (b.panel === 'stock') assert.ok(b.x2 < 417);
        if (b.panel === 'changes') assert.ok(b.x1 > 438 && b.x2 < 665);
      }
      if (name === 'FrenchOatPricing2026' && mode === 'desktop') {
        if (b.panel === 'auctions') assert.ok(b.x2 < 343);
        if (b.panel === 'spread') assert.ok(b.x1 > 360 && b.x2 < 663);
      }
    }
    for (const n of all.filter(n => tag(n) === 'rect')) {
      const a = attrs(n); assert.ok(Number(a.x) >= 0 && Number(a.y) >= 0 && Number(a.x) + Number(a.width) <= w && Number(a.y) + Number(a.height) <= h);
    }
    for (const match of svg.matchAll(/<g\b[^>]*\bdata-icon="[^"]+"[^>]*>[\s\S]*?<\/g>/gu)) {
      const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${match[0]}</svg>`.replace(/var\(--color-([a-z-]+)\)/gu, (_, color) => themes.dark[color]);
      const b = new Resvg(iconSvg, { font: { loadSystemFonts: false } }).getBBox(); assert.ok(b);
      const icon = { x1: b.x, x2: b.x + b.width, y1: b.y, y2: b.y + b.height };
      for (const label of labels) assert.equal(overlap(icon, label), false, `${name}/${lang}/${mode}: icon crowds ${label.value}`);
    }
    for (const route of all.filter(n => attrs(n)['data-relationship'])) {
      const points = pathPoints(attrs(route).d);
      for (let i = 1; i < points.length; i++) {
        const [x1, y1] = points[i - 1], [x2, y2] = points[i]; assert.ok(x1 === x2 || y1 === y2);
        const edge = { x1: Math.min(x1, x2), x2: Math.max(x1, x2), y1: Math.min(y1, y2), y2: Math.max(y1, y2) };
        for (const label of labels) assert.equal(overlap(edge, label, -.5), false, `${name}/${lang}/${mode}: ${attrs(route)['data-relationship']} crowds ${label.value}`);
      }
    }
  }
});

test('all static components compile, cite sources, retain responsive contracts and reuse the licensed font', async () => {
  assertFontLicenseReferences(readFileSync(new URL('../public/fonts/ukraine-reparations/LICENSE.txt', import.meta.url), 'utf8'), 'liberation');
  const refs = { FrenchRepoSnapshots2026: ['S01', 'S02'], FrenchRepoCircuit2026: ['S07', 'S08', 'S17'], FrenchOatPricing2026: ['S03', 'S04', 'S05', 'S06', 'S10', 'S11'] };
  for (const { name, source, art } of components) {
    await transform(source);
    for (const contract of [/max-width:42\.5rem/u, /padding-bottom:1rem/u, /liberation-sans-400\.ttf/u]) assert.match(source, contract);
    const thresholds = [...source.matchAll(/@container\s*\(\s*max-width\s*:\s*(\d+(?:\.\d+)?)px\s*\)/gu)];
    assert.equal(thresholds.length, 1, `${name}: one explicit responsive threshold`);
    const threshold = Number(thresholds[0][1]);
    assert.ok(Number.isFinite(threshold) && threshold > 0);
    for (const lang of ['fr', 'en']) {
      const { root, all } = parsed(art[lang].desktop);
      const [, , desktopWidth] = attrs(root).viewBox.split(' ').map(Number);
      const labelSizes = all.filter(n => tag(n) === 'text').map(n => Number(attrs(n)['font-size']));
      assert.ok(labelSizes.length && labelSizes.every(size => Number.isFinite(size) && size > 0));
      assert.ok(threshold < desktopWidth, `${name}/${lang}: desktop remains reachable before its full display width`);
      const minimumEffectiveLabel = Math.min(...labelSizes) * threshold / desktopWidth;
      assert.ok(minimumEffectiveLabel >= 12, `${name}/${lang}: smallest desktop label would render at ${minimumEffectiveLabel.toFixed(3)} CSSpx at the responsive boundary`);
    }
    for (const id of refs[name]) assert.ok(source.includes(`href="#source-${id}"`));
    assert.doesNotMatch(source, /font-weight:(?:600|700|bold)|—/u);
  }
});

for (const c of components) for (const lang of ['fr', 'en']) for (const [theme, colors] of Object.entries(themes)) {
  test(`${c.name}/${lang}/${theme}: both scenes rasterize completely inside the viewBox`, () => {
    for (const mode of ['desktop', 'mobile']) {
      const svg = c.art[lang][mode], { root } = parsed(svg), [, , w, h] = attrs(root).viewBox.split(' ').map(Number);
      const rendered = svg.replaceAll('l0g French Debt Repo', 'Liberation Sans').replace(/var\(--color-([a-z-]+)\)/gu, (_, color) => colors[color]);
      const renderer = new Resvg(rendered, { font: { fontFiles: [fontFile.pathname], loadSystemFonts: false } });
      const b = renderer.getBBox(); assert.ok(b && b.x >= -.1 && b.y >= -.1 && b.x + b.width <= w + .1 && b.y + b.height <= h + .1);
      const png = renderer.render().asPng(); assert.ok(png.length > 1000);
    }
  });
}
