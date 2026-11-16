import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transform } from '@astrojs/compiler-rs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { Resvg } from '@resvg/resvg-js';
import opentype from '@shuding/opentype.js';

const components = ['NvidiaSuccessionPressure2026', 'NvidiaExportSupport2026'].map(name => {
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
const entities = new Map([['&amp;', '&'], ['&lt;', '<'], ['&gt;', '>'], ['&#x27;', "'"], ['&quot;', '"']]);
const decode = value => value.replace(/&(?:amp|lt|gt|#x27|quot);/gu, entity => entities.get(entity));
const colors = { surface: '#121419', paper: '#e7e9ee', muted: '#8b909b', 'line-strong': '#414349', signal: '#5eead4', amber: '#f5b13d' };
const scenes = components.flatMap(component => ['fr', 'en'].flatMap(lang => ['desktop', 'mobile'].map(mode => ({ ...component, lang, mode, svg: component.art[lang][mode] }))));

test('SVG label entities are decoded once for geometry measurements', () => {
  assert.equal(decode('&amp;lt; &amp;gt; &amp;quot;'), '&lt; &gt; &quot;');
  assert.equal(decode('&amp; &lt; &gt; &#x27; &quot;'), '& < > \' "');
  assert.equal(decode('&unknown; NVIDIA'), '&unknown; NVIDIA');
});

test('succession and export diagrams distinguish decisions, public calls, loans and conditional cover', () => {
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
    if (name.includes('Succession')) {
      assert.deepEqual(relations.sort(), (mode === 'desktop' ? ['interim-appointment', 'permanent-search', 'political-request', 'search-firm-selection'] : ['interim-appointment', 'political-request', 'search-firm-selection']).sort());
      const political = [...svg.matchAll(/<path ([^>]+)\/>/gu)].map(m => attrs(m[1])).find(a => a['data-relationship'] === 'political-request');
      assert.equal(political['stroke-dasharray'], '3 4');
      assert.match(svg, /Kress/u); assert.match(svg, /Bessent/u);
      assert.doesNotMatch(svg, /Haas|Huang|Treasury appointment|nommé par le Trésor/iu);
    } else {
      assert.deepEqual(relations.sort(), ['buyer-repayment', 'conditional-export-guarantee', 'export-loan', 'integrated-offer']);
      const guarantee = [...svg.matchAll(/<path ([^>]+)\/>/gu)].map(m => attrs(m[1])).find(a => a['data-relationship'] === 'conditional-export-guarantee');
      assert.equal(guarantee['stroke-dasharray'], '3 4');
      assert.match(svg, /EXIM/u);
      assert.doesNotMatch(svg, /USD|\$|billion|milliard|Nvidia.*(?:received|reçu)/iu);
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
    const rendered = svg.replaceAll('l0g Nvidia Succession', 'Liberation Sans').replace(/var\(--color-([a-z-]+)\)/gu, (_, color) => colors[color]);
    const renderer = new Resvg(rendered, { font: { fontFiles: [fontFile.pathname], loadSystemFonts: false } });
    const bounds = renderer.getBBox();
    assert.ok(bounds && bounds.x >= -0.1 && bounds.y >= -0.1 && bounds.x + bounds.width <= w + 0.1 && bounds.y + bounds.height <= h + 0.1, `${name}/${lang}/${mode}: artwork outside viewBox`);
  }
});

test('both diagrams compile and preserve compact responsive rules and source anchors', async () => {
  for (const { name, source } of components) {
    await transform(source);
    assert.match(source, /@container\(max-width:520px\)/u);
    assert.match(source, /max-width:37\.5rem/u); assert.match(source, /padding-bottom:1rem/u);
    assert.match(source, /liberation-sans-400\.ttf/u);
    for (const id of name.includes('Succession') ? ['S01', 'S02', 'S03'] : ['S06', 'S07', 'S10']) assert.match(source, new RegExp(`href="#source-${id}"`, 'u'));
  }
});

function segments(d) {
  const tokens = d.match(/[MLHV]|[-+]?(?:\d*\.\d+|\d+)/gu) ?? [];
  assert.equal(tokens.join(''), d.replaceAll(/\s+/gu, ''), 'Relationship routes use complete finite orthogonal coordinates');
  let i = 0, x = 0, y = 0;
  const result = [];
  const n = () => { const value = Number(tokens[i++]); assert.ok(Number.isFinite(value)); return value; };
  while (i < tokens.length) {
    const op = tokens[i++], oldX = x, oldY = y;
    if (op === 'M' || op === 'L') { x = n(); y = n(); }
    else if (op === 'H') x = n();
    else if (op === 'V') y = n();
    else assert.fail(`Unsupported relationship command ${op}`);
    if (op !== 'M') {
      assert.ok(oldX === x || oldY === y, 'The diagram uses orthogonal relationship routes');
      result.push({ x1: Math.min(oldX, x), x2: Math.max(oldX, x), y1: Math.min(oldY, y), y2: Math.max(oldY, y) });
    }
  }
  return result;
}

test('relationship parsing consumes complete subpaths and rejects bounded malformed numbers', { timeout: 2000 }, () => {
  assert.deepEqual(segments('M0 0H20V10M4 4L4 9'), [
    { x1: 0, x2: 20, y1: 0, y2: 0 },
    { x1: 20, x2: 20, y1: 0, y2: 10 },
    { x1: 4, x2: 4, y1: 4, y2: 9 },
  ]);
  const started = performance.now();
  for (const malformed of ['M1 1H', 'M1 1X2', 'M1 1L2 2', `M0 0H${'9'.repeat(4096)}`, `M0 0H${'1'.repeat(50000)}.`]) {
    assert.throws(() => segments(malformed), { name: 'AssertionError' });
  }
  assert.ok(performance.now() - started < 1000, 'Malformed static paths must fail promptly');
});

test('documented relationship routes leave clearance around labels in both layouts', () => {
  for (const { name, lang, mode, svg } of scenes) {
    const labels = [...svg.matchAll(/<text ([^>]+)>([^<]*)<\/text>/gu)].map(match => {
      const a = attrs(match[1]), size = Number(a['font-size']);
      const label = decode(match[2]);
      const width = font.getAdvanceWidth(label, size, { kerning: true });
      const x = Number(a.x) - (a['text-anchor'] === 'middle' ? width / 2 : a['text-anchor'] === 'end' ? width : 0);
      return { label, x1: x, x2: x + width, y1: Number(a.y) - font.ascender * size / font.unitsPerEm, y2: Number(a.y) - font.descender * size / font.unitsPerEm };
    });
    for (const match of svg.matchAll(/<path ([^>]+)\/>/gu)) {
      const a = attrs(match[1]);
      if (!a['data-relationship']) continue;
      for (const line of segments(a.d)) for (const label of labels) {
        const overlaps = line.x2 > label.x1 - 2 && line.x1 < label.x2 + 2 && line.y2 > label.y1 - 2 && line.y1 < label.y2 + 2;
        assert.equal(overlaps, false, `${name}/${lang}/${mode}: ${a['data-relationship']} crosses or crowds ${label.label}`);
      }
    }
  }
});
