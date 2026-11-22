import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { Resvg } from '@resvg/resvg-js';
import opentype from '@shuding/opentype.js';
import { tag, attrs, nodes, content, pathPoints } from './insurance-returns-svg-assertions.mjs';

const source = readFileSync(new URL('../src/components/infographics/NvidiaSaturnFunding2026.astro', import.meta.url), 'utf8');
const marker = 'const art = ', start = source.indexOf(marker) + marker.length;
assert.ok(start >= marker.length);
const artSource = source.slice(start, source.indexOf(' as const;', start));
assert.doesNotMatch(artSource, /\$\{/u, 'Artwork is static, without template interpolation');
assert.equal([...artSource.matchAll(/`/gu)].length, 8, 'Four static SVG template literals');
const art = Object.fromEntries(['fr', 'en'].map(lang => {
  const match = artSource.match(new RegExp(lang + ': \\{\\s*desktop: `([^`]+)`,\\s*mobile: `([^`]+)`', 'u'));
  assert.ok(match, `${lang}: both readable static SVGs must be present`);
  return [lang, { desktop: match[1], mobile: match[2] }];
}));
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
  svg: 'xmlns width style viewBox role aria-labelledby xml:lang data-variant data-status data-pricing',
  title: 'id', desc: 'id', g: 'transform data-icon',
  rect: 'x y width height rx fill fill-opacity stroke stroke-width data-measure data-value',
  path: 'd fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray data-relationship',
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

test('Saturn financing is passive and accessible with distinct FR/EN responsive IDs and local regular type', () => {
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
        assert.equal(a['font-family'], 'l0g Nvidia Saturn Funding'); assert.equal(a['font-weight'], '400');
        assert.ok(Number(a['font-size']) >= 12 && Number(a['font-size']) <= 16);
      }
    }
  }
  assert.equal(allIds.length, new Set(allIds).size);
});

test('Saturn issues the notes while WHCO leases the equipment and receives the planned rents', () => {
  for (const { lang, mode, svg } of scenes) {
    const { root, all } = parse(svg), a = attrs(root);
    assert.equal(a['data-status'], 'planned-structure'); assert.equal(a['data-pricing'], '2026-11-20');
    const relations = all.filter(n => attrs(n)['data-relationship']);
    assert.deepEqual(relations.map(n => attrs(n)['data-relationship']), ['investor-subscription', 'equipment-financing', 'equipment-lease', 'quarterly-rents']);
    for (const node of relations) assert.equal(attrs(node)['stroke-dasharray'], '3 4', 'All depicted flows are planned');
    const [capital, financing, equipment, rents] = relations.map(n => pathPoints(attrs(n).d));
    assert.ok(capital[0][0] < capital.at(-1)[0]);
    if (mode === 'mobile') {
      assert.ok(financing[0][1] < financing.at(-1)[1]);
      assert.ok(equipment[0][0] > equipment.at(-1)[0]);
      assert.ok(rents[0][0] < rents.at(-1)[0]);
    } else {
      assert.ok(financing[0][0] < financing.at(-1)[0]);
      assert.ok(equipment[0][0] < equipment.at(-1)[0]);
      assert.ok(rents[0][0] > rents.at(-1)[0]);
    }
    const labels = all.filter(n => tag(n) === 'text').map(content);
    for (const label of ['Saturn', 'WHCO', 'SpaceX']) assert.ok(labels.includes(label));
    assert.ok(labels.includes(lang === 'fr' ? 'Émet les titres' : 'Issues notes'));
    assert.ok(labels.includes(lang === 'fr' ? 'Achète et loue' : 'Buys and leases'));
    assert.ok(labels.includes(lang === 'fr' ? 'Loyers trimestriels' : 'Quarterly rents'));
    assert.ok(labels.some(label => label.includes(lang === 'fr' ? 'Livraisons attendues' : 'Deliveries expected')));
    assert.ok(labels.some(label => label.includes(lang === 'fr' ? 'S1 2027' : 'H1 2027')));
    const description = content(all.find(n => tag(n) === 'desc'));
    assert.match(description, lang === 'fr' ? /filiale indirecte de WHCO/u : /indirect subsidiary of WHCO/u);
    assert.match(description, lang === 'fr' ? /chaque tranche à compter de sa livraison/u : /each tranche starting on its delivery/u);
    assert.doesNotMatch([...labels, description].join('\n'), /Anthropic|(?:44|10)\s*(?:Md|billion)|USD|\$/iu, 'Keep unrelated equity and aggregate deal amounts out of this mechanism');
  }
});

test('Saturn icons, labels and orthogonal flows stay compact and separated in both themes', () => {
  for (const { lang, mode, svg } of scenes) {
    const { root, all } = parse(svg), [, , w, h] = attrs(root).viewBox.split(' ').map(Number);
    assert.equal(w, mode === 'mobile' ? 320 : 600); assert.ok(h <= 288);
    const labels = all.filter(n => tag(n) === 'text').map(labelBox);
    for (const [i, box] of labels.entries()) {
      assert.ok(box.x1 >= 3 && box.x2 <= w - 3 && box.y1 >= 3 && box.y2 <= h - 3, `${lang}/${mode}: ${box.value} outside viewBox`);
      for (const other of labels.slice(i + 1)) assert.equal(overlaps(box, other), false, `${lang}/${mode}: ${box.value} overlaps ${other.value}`);
    }
    for (const node of all.filter(n => attrs(n)['data-relationship'])) {
      const a = attrs(node), points = pathPoints(a.d);
      for (let i = 1; i < points.length; i++) {
        const [x1, y1] = points[i - 1], [x2, y2] = points[i];
        assert.ok(x1 === x2 || y1 === y2);
        const box = { x1: Math.min(x1, x2) - 1, x2: Math.max(x1, x2) + 1, y1: Math.min(y1, y2) - 1, y2: Math.max(y1, y2) + 1 };
        for (const label of labels) assert.equal(overlaps(box, label), false, `${lang}/${mode}: ${a['data-relationship']} crowds ${label.value}`);
      }
    }
    for (const colors of Object.values(themes)) {
      const rendered = svg.replaceAll('l0g Nvidia Saturn Funding', 'Liberation Sans').replace(/var\(--color-([a-z-]+)\)/gu, (_, color) => colors[color]);
      const renderer = new Resvg(rendered, { font: { fontFiles: [fontFile.pathname], loadSystemFonts: false } });
      const box = renderer.getBBox();
      assert.ok(box && box.x >= -0.1 && box.y >= -0.1 && box.x + box.width <= w + 0.1 && box.y + box.height <= h + 0.1, `${lang}/${mode}: painted artwork outside viewBox`);
    }
  }
});

test('Saturn component compiles with local type, source S03/S04/S05 and the compact responsive contract', async () => {
  await transform(source);
  for (const contract of [/max-width:37\.5rem/u, /@container\(max-width:520px\)/u, /padding-bottom:1rem/u, /liberation-sans-400\.ttf/u]) assert.match(source, contract);
  for (const id of ['S03', 'S04', 'S05']) assert.match(source, new RegExp(`href="#source-${id}"`, 'u'));
});
