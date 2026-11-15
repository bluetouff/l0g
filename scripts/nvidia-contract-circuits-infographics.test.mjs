import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { Resvg } from '@resvg/resvg-js';
import opentype from '@shuding/opentype.js';

const components = ['NvidiaNaverCommitments2026', 'NvidiaPublicCompute2026'].map(name => {
  const source = readFileSync(new URL(`../src/components/infographics/${name}.astro`, import.meta.url), 'utf8');
  const marker = 'const art = ', start = source.indexOf(marker) + marker.length;
  assert.ok(start >= marker.length);
  return { name, source, art: JSON.parse(source.slice(start, source.indexOf(' as const;', start))) };
});
const fontFile = new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf', import.meta.url);
const bytes = readFileSync(fontFile);
const font = opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@', parseTagValue: false, trimValues: false });
const attrs = str => Object.fromEntries([...str.matchAll(/([a-zA-Z0-9:-]+)="([^"]*)"/gu)].map(m => [m[1], m[2]]));
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&#x27;', "'").replaceAll('&quot;', '"');
const colors = { surface: '#121419', paper: '#e7e9ee', muted: '#8b909b', 'line-strong': '#414349', signal: '#5eead4', amber: '#f5b13d' };
const scenes = components.flatMap(component => ['fr', 'en'].flatMap(lang => ['desktop', 'mobile'].map(mode => ({ ...component, lang, mode, svg: component.art[lang][mode] }))));

test('contract diagrams use passive XML, accessible descriptions and separate documented flows', () => {
  for (const { name, lang, mode, svg } of scenes) {
    assert.equal(XMLValidator.validate(svg), true, `${name}/${lang}/${mode}`);
    const root = parser.parse(svg).svg;
    assert.equal(root['@width'], '100%'); assert.equal(root['@style'], 'height:auto');
    assert.equal(root['@xml:lang'], lang); assert.equal(root['@role'], 'img');
    const ids = root['@aria-labelledby'].split(' ');
    assert.equal(root.title['@id'], ids[0]); assert.equal(root.desc['@id'], ids[1]);
    assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?|\bon[a-z]+\s*=|\b(?:href|src)\s*=|url\(/iu);
    for (const tag of [...svg.matchAll(/<([a-zA-Z][a-zA-Z0-9]*)\b/gu)].map(m => m[1])) assert.ok(['svg', 'title', 'desc', 'rect', 'g', 'path', 'circle', 'text'].includes(tag), tag);
    const relations = [...svg.matchAll(/data-relationship="([^"]+)"/gu)].map(m => m[1]);
    if (name.includes('Naver')) {
      assert.deepEqual(relations.sort(), ['brookfield-planned-investment', 'cloud-usage-fees', 'compute-service', 'naver-fee-guarantee', 'nvidia-equity-payment']);
      assert.match(svg, /stroke-dasharray="3 4" data-relationship="naver-fee-guarantee"/u);
    } else {
      for (const relation of ['dedicated-compute-reservation', 'managed-research-platform', 'platform-orchestration']) assert.ok(relations.includes(relation));
      assert.doesNotMatch(svg, /USD|\$|billion|milliard|payment|cash|finance/iu);
      assert.match(svg, /HGX H100/u);
    }
  }
});

test('all eight circuits preserve bounded lettering, regular type and separated labels', () => {
  for (const { name, lang, mode, svg } of scenes) {
    const [, w, h] = svg.match(/viewBox="0 0 (\d+) (\d+)"/u).map(Number);
    assert.equal(w, mode === 'mobile' ? 320 : 600); assert.ok(h <= 330);
    const labels = [];
    for (const match of svg.matchAll(/<text ([^>]+)>([^<]*)<\/text>/gu)) {
      const a = attrs(match[1]), size = Number(a['font-size']), label = decode(match[2]);
      assert.ok(size >= 12 && size <= 16); assert.equal(a['font-weight'], '400');
      for (const char of label) assert.notEqual(font.charToGlyphIndex(char), 0, `Missing glyph ${char}`);
      const width = font.getAdvanceWidth(label, size, { kerning: true });
      const x = Number(a.x) - (a['text-anchor'] === 'middle' ? width / 2 : a['text-anchor'] === 'end' ? width : 0);
      const b = { label, x1: x, x2: x + width, y1: Number(a.y) - font.ascender * size / font.unitsPerEm, y2: Number(a.y) - font.descender * size / font.unitsPerEm };
      assert.ok(b.x1 >= 3 && b.x2 <= w - 3 && b.y1 >= 3 && b.y2 <= h - 3, `${name}/${lang}/${mode}: ${label} outside viewBox`);
      for (const old of labels) assert.ok(Math.min(old.x2, b.x2) - Math.max(old.x1, b.x1) <= 1 || Math.min(old.y2, b.y2) - Math.max(old.y1, b.y1) <= 1, `${name}/${lang}/${mode}: ${old.label} overlaps ${label}`);
      labels.push(b);
    }
    const rendered = svg.replaceAll('l0g Nvidia Commitments', 'Liberation Sans').replace(/var\(--color-([a-z-]+)\)/gu, (_, color) => colors[color]);
    const renderer = new Resvg(rendered, { font: { fontFiles: [fontFile.pathname], loadSystemFonts: false } });
    const bounds = renderer.getBBox();
    assert.ok(bounds && bounds.x >= -0.1 && bounds.y >= -0.1 && bounds.x + bounds.width <= w + 0.1 && bounds.y + bounds.height <= h + 0.1, `${name}/${lang}/${mode}: artwork outside viewBox`);
  }
});

test('both components compile and retain local fonts, source anchors and compact responsive rules', async () => {
  for (const { name, source } of components) {
    await transform(source);
    assert.match(source, /@container\(max-width:520px\)/u);
    assert.match(source, /max-width:37\.5rem/u); assert.match(source, /padding-bottom:1rem/u);
    assert.match(source, /liberation-sans-400\.ttf/u);
    for (const id of name.includes('Naver') ? ['S05', 'S06'] : ['S12', 'S13']) assert.match(source, new RegExp(`href="#source-${id}"`, 'u'));
  }
});
