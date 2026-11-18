import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { Resvg } from '@resvg/resvg-js';
import opentype from '@shuding/opentype.js';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';
import { tag, attrs, nodes, content, pathPoints } from './insurance-returns-svg-assertions.mjs';

const components = ['NvidiaCommitmentActivation2026', 'AolaniCreditChain2026'].map(name => {
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

test('neocloud and Aolani figures use passive XML, accessible IDs and regular local type', () => {
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
        assert.equal(attrs(node)['font-family'], 'l0g Nvidia Aolani Financing');
        assert.equal(attrs(node)['font-weight'], '400');
        assert.ok(Number(attrs(node)['font-size']) >= 12 && Number(attrs(node)['font-size']) <= 16);
      }
    }
  }
  assert.equal(allIds.length, new Set(allIds).size, 'Every language and responsive variant has unique accessible IDs');
});

test('only the USD 32bn neocloud agreements use the financing, deployment and acceptance activation chain', () => {
  for (const { lang, svg } of scenes.filter(s => s.name === 'NvidiaCommitmentActivation2026')) {
    const { all } = parse(svg);
    const relations = all.filter(n => attrs(n)['data-relationship']);
    assert.deepEqual(relations.map(n => attrs(n)['data-relationship']), ['agreement-financing', 'financing-deployment', 'deployment-acceptance', 'acceptance-activation']);
    for (const route of relations) assert.equal(attrs(route)['stroke-dasharray'], '3 4', 'The diagram represents conditions rather than completed milestones');
    const labels = all.filter(n => tag(n) === 'text').map(content).join(' ');
    const description = all.filter(n => tag(n) === 'desc').map(content).join(' ');
    assert.match(labels, lang === 'fr' ? /32 Md USD/u : /USD 32bn/u);
    assert.match(labels, lang === 'fr' ? /25 octobre 2026/u : /October 25, 2026/u);
    for (const term of lang === 'fr' ? ['Financement', 'Déploiement', 'opérationnel', 'Acceptation', 'Nvidia', 'Activation'] : ['Financing', 'Deployment', 'operational', 'Acceptance', 'Nvidia', 'take effect']) assert.ok(labels.includes(term));
    assert.match(description, lang === 'fr' ? /maximum conditionnel/u : /conditional maximum/u);
    assert.match(description, lang === 'fr' ? /sans attester leur réalisation/u : /without asserting they have been fulfilled/u);
    assert.doesNotMatch(labels + ' ' + description, /118|480|Aolani|guarantee|garantie|SB Energy|cash received|encaiss/iu);
    assert.equal(all.filter(n => attrs(n)['data-icon']).length, 5);
  }
});

test('the Aolani loan remains a reported preparation chain with DBS arranging and remote ByteDance use', () => {
  for (const { lang, mode, svg } of scenes.filter(s => s.name === 'AolaniCreditChain2026')) {
    const { all } = parse(svg), relations = all.filter(n => attrs(n)['data-relationship']);
    assert.deepEqual(relations.map(n => attrs(n)['data-relationship']), ['lenders-proposed-loan', 'proposed-loan-aolani', 'aolani-planned-hardware', 'planned-remote-access']);
    for (const route of relations) assert.equal(attrs(route)['stroke-dasharray'], '3 4', 'Projected loan and use links are visibly discontinuous');
    const labels = all.filter(n => tag(n) === 'text').map(content).join(' ');
    const description = all.filter(n => tag(n) === 'desc').map(content).join(' ');
    for (const term of ['480', 'Aolani Cloud', 'DBS', 'Nvidia', 'ByteDance']) assert.ok(labels.includes(term));
    assert.match(labels, lang === 'fr' ? /Malaisie/u : /Malaysia/u);
    assert.match(labels, lang === 'fr' ? /Travail suspendu/u : /Work paused/u);
    assert.match(description, lang === 'fr' ? /arrangeur mandaté et teneur de livre/u : /mandated lead arranger and bookrunner/u);
    assert.match(description, lang === 'fr' ? /sources anonymes/u : /anonymous sources/u);
    assert.match(description, lang === 'fr' ? /annoncés le 16 novembre/u : /announced November 16/u);
    assert.match(description, lang === 'fr' ? /17 novembre 2026/u : /November 17, 2026/u);
    assert.doesNotMatch(labels + ' ' + description, /trois ans|three.year|36 months|default|défaut|cancelled|annulé|licence refusée|license denied|H100|H200|GB200|GB300|B200|B300|Johor|2019/iu);
    assert.equal(all.filter(n => attrs(n)['data-icon']).length, mode === 'desktop' ? 7 : 5);
  }
});

test('the existing regular font is embedded with its redistribution licence', () => {
  const licence = readFileSync(new URL('../public/fonts/ukraine-reparations/LICENSE.txt', import.meta.url), 'utf8');
  assertFontLicenseReferences(licence, 'liberation');
  assert.match(licence, /SIL OPEN FONT LICENSE Version 1\.1/u);
  assert.match(licence, /Liberation Sans 2\.1\.5, regular and bold/u);
  assert.ok(bytes.byteLength > 10000);
});

test('compact scenes keep text, icons, panels and projected paths clear', () => {
  for (const { name, lang, mode, svg } of scenes) {
    const { root, all } = parse(svg), [, , w, h] = attrs(root).viewBox.split(' ').map(Number);
    assert.equal(w, mode === 'mobile' ? 320 : 600); assert.ok(h >= 280 && h <= 330);
    const labels = all.filter(n => tag(n) === 'text').map(labelBox);
    for (const n of all.filter(n => tag(n) === 'rect')) { const a=attrs(n); assert.ok(Number(a.x) >= 0 && Number(a.y) >= 0 && Number(a.x)+Number(a.width) <= w && Number(a.y)+Number(a.height) <= h, 'Panel remains within the viewBox'); }
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

test('static Astro components compile with source S01 or S04/S05 and compact local styling', async () => {
  for (const { name, source } of components) {
    await transform(source);
    for (const contract of [/max-width:37\.5rem/u, /@container\(max-width:520px\)/u, /padding-bottom:1rem/u, /liberation-sans-400\.ttf/u]) assert.match(source, contract);
    for (const id of name === 'NvidiaCommitmentActivation2026' ? ['S01'] : ['S04', 'S05']) assert.match(source, new RegExp(`href="#source-${id}"`, 'u'));
    assert.doesNotMatch(source, /font-weight:(?:600|700|bold)/u);
  }
});

for (const component of components) for (const lang of ['fr', 'en']) for (const [theme, colors] of Object.entries(themes)) {
  test(`${component.name}/${lang}/${theme}: responsive variants rasterize inside the viewBox`, () => {
    for (const mode of ['desktop', 'mobile']) {
      const svg = component.art[lang][mode];
      const { root } = parse(svg), [, , w, h] = attrs(root).viewBox.split(' ').map(Number);
      const rendered = svg.replaceAll('l0g Nvidia Aolani Financing', 'Liberation Sans').replace(/var\(--color-([a-z-]+)\)/gu, (_, color) => colors[color]);
      const renderer = new Resvg(rendered, { font: { fontFiles: [fontFile.pathname], loadSystemFonts: false } });
      const bounds = renderer.getBBox();
      assert.ok(bounds && bounds.x >= -0.1 && bounds.y >= -0.1 && bounds.x + bounds.width <= w + 0.1 && bounds.y + bounds.height <= h + 0.1, `${component.name}/${lang}/${mode}/${theme}: painted artwork outside viewBox`);
      assert.ok(renderer.render().asPng().length > 500, 'Raster output contains the full scene');
    }
  });
}
