import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';

const paths = [
  'src/content/posts/licenciements-ia-delocalisations-qantas-ai-washing.md',
  'src/content/posts-en/ai-layoffs-offshoring-qantas-ai-washing.md',
];
const parser = new XMLParser({
  ignoreAttributes: false,
  preserveOrder: true,
  trimValues: false,
  parseTagValue: false,
});
const bytes = readFileSync(new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf', import.meta.url));
const font = opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const attr = node => node[':@'] ?? {};
const tag = node => Object.keys(node).find(key => key !== ':@');
const children = node => Array.isArray(node[tag(node)]) ? node[tag(node)] : [];
const all = node => [node, ...children(node).flatMap(all)];
const text = node => tag(node) === '#text' ? node['#text'] : children(node).map(text).join('');
const inside = (outer, inner, padding = 0) =>
  inner.every(Number.isFinite) && inner[0] >= outer[0] + padding &&
  inner[1] >= outer[1] + padding && inner[2] <= outer[2] - padding &&
  inner[3] <= outer[3] - padding;
const overlap = (a, b) => Math.min(a[2], b[2]) - Math.max(a[0], b[0]) > 1 &&
  Math.min(a[3], b[3]) - Math.max(a[1], b[1]) > 1;
const close = (actual, expected, message) => assert.ok(Math.abs(actual - expected) < 1e-9, message);
const scenes = paths.flatMap((path, index) => {
  const source = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
  return [...source.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => ({
    lang: index ? 'en' : 'fr',
    svg: match[0],
  }));
});

test('two bilingual figures have distinct, accessible mobile and desktop compositions', () => {
  assert.equal(scenes.length, 8);
  const ids = [];
  const compositions = [];
  for (const { svg, lang } of scenes) {
    assert.equal(XMLValidator.validate(svg), true);
    const root = parser.parse(svg)[0];
    const a = attr(root);
    const nodes = all(root);
    assert.equal(a['@_width'], '100%');
    assert.equal(a['@_style'], 'height:auto');
    assert.equal(a['@_xml:lang'], lang);
    assert.equal(a['@_role'], 'img');
    const labelledBy = a['@_aria-labelledby'].split(' ');
    assert.equal(labelledBy.length, 2);
    const composition = labelledBy[0].match(/^aiwork-(fr|en)-([12])-(desktop|mobile)-title$/u);
    assert.ok(composition, labelledBy[0]);
    assert.equal(composition[1], lang);
    assert.equal(a['@_class'], `aiwork-${composition[3]}`);
    compositions.push(`${lang}-${composition[2]}-${composition[3]}`);
    for (const id of labelledBy) {
      assert.equal(nodes.filter(node => attr(node)['@_id'] === id && text(node).trim()).length, 1);
    }
    ids.push(...nodes.map(node => attr(node)['@_id']).filter(Boolean));
    assert.doesNotMatch(svg, /<(?:script|foreignObject|image|use)\b|<!\s*(?:DOCTYPE|ENTITY)|\b(?:href|src|on\w+)\s*=|url\(|\u2014|horloges|clocks/iu);
    for (const node of nodes) {
      assert.ok(['svg', 'title', 'desc', 'text', '#text', 'g', 'rect', 'line'].includes(tag(node)));
      for (const [key, value] of Object.entries(attr(node))) {
        assert.notEqual(key, '@_transform', 'Geometry assertions require untransformed coordinates');
        if (['@_fill', '@_stroke'].includes(key)) {
          assert.match(value, /^(?:none|var\(--color-(?:paper|muted|line-strong|signal|accent|amber|surface)\))$/u);
        }
      }
    }
  }
  assert.equal(ids.length, new Set(ids).size);
  assert.deepEqual(compositions.sort(), ['fr', 'en'].flatMap(lang => [1, 2].flatMap(figure =>
    ['desktop', 'mobile'].map(variant => `${lang}-${figure}-${variant}`))).sort());
});

for (const { svg, lang } of scenes) {
  test(`${lang}: ${svg.match(/aria-labelledby="([^"]+)/u)?.[1]} geometry and restrained typography`, () => {
    const root = parser.parse(svg)[0];
    const a = attr(root);
    const viewBox = a['@_viewBox'].split(' ').map(Number);
    const [x, y, width, height] = viewBox;
    assert.deepEqual([x, y], [0, 0]);
    assert.ok(width === 340 || width === 600);
    assert.ok(height >= 250 && height <= 360);
    const frame = [0, 0, width, height];
    const boxes = [];
    const walk = (node, region = frame) => {
      const at = attr(node);
      if (at['@_data-region']) {
        const [rx, ry, rw, rh] = at['@_data-region'].split(' ').map(Number);
        assert.ok(rw > 0 && rh > 0);
        region = [rx, ry, rx + rw, ry + rh];
        assert.ok(inside(frame, region), 'Label region remains inside viewBox');
      }
      if (tag(node) === 'text') {
        const size = Number(at['@_font-size']);
        const value = text(node);
        assert.ok(size >= (width === 340 ? 14 : 12) && size <= 18);
        assert.equal(at['@_font-weight'], '400');
        assert.equal(at['@_font-family'], 'l0g AIwork');
        for (const character of value) assert.notEqual(font.charToGlyphIndex(character), 0, `Missing glyph: ${character}`);
        const advance = font.getAdvanceWidth(value, size, { kerning: true });
        const anchor = at['@_text-anchor'];
        assert.ok(['start', 'middle', 'end'].includes(anchor));
        const tx = Number(at['@_x']) - (anchor === 'middle' ? advance / 2 : anchor === 'end' ? advance : 0);
        const ty = Number(at['@_y']);
        const box = [tx, ty - font.ascender * size / font.unitsPerEm,
          tx + advance, ty - font.descender * size / font.unitsPerEm];
        assert.ok(inside(region, box), `Label outside its region: ${value}`);
        assert.ok(inside(frame, box, 3), `Label outside viewBox: ${value}`);
        boxes.push({ box, value });
      }
      for (const child of children(node)) walk(child, region);
    };
    walk(root);
    for (let i = 0; i < boxes.length; i++) {
      for (const other of boxes.slice(i + 1)) {
        assert.ok(!overlap(boxes[i].box, other.box), `Overlapping labels: ${boxes[i].value} / ${other.value}`);
      }
    }
    for (const node of all(root)) {
      const at = attr(node);
      const number = key => Number(at[`@_${key}`]);
      let box;
      if (tag(node) === 'rect') {
        assert.ok(number('width') > 0 && number('height') > 0);
        box = [number('x'), number('y'), number('x') + number('width'), number('y') + number('height')];
      }
      if (tag(node) === 'line') {
        box = [Math.min(number('x1'), number('x2')), Math.min(number('y1'), number('y2')),
          Math.max(number('x1'), number('x2')), Math.max(number('y1'), number('y2'))];
      }
      if (box) assert.ok(inside(frame, box, 1), 'Shape outside viewBox');
    }
  });
}

test('the hypothetical comparison preserves total work and its 80/20 split', () => {
  const revenue = 100;
  const internalBefore = 100;
  const internalAfter = 80;
  const supplierAfter = 20;
  assert.equal(internalAfter + supplierAfter, internalBefore);
  const ratioBefore = revenue / internalBefore;
  const ratioAfter = revenue / internalAfter;
  close(ratioAfter, 1.25, 'Revenue per internal employee');
  close((ratioAfter / ratioBefore - 1) * 100, 25, 'Percentage increase uses the original ratio');
  for (const { svg } of scenes.filter(scene => scene.svg.includes(`aiwork-${scene.lang}-2-`))) {
    const root = parser.parse(svg)[0];
    const mobile = attr(root)['@_viewBox'].split(' ')[2] === '340';
    const rects = all(root).filter(node => tag(node) === 'rect');
    const supplier = rects.find(node => attr(node)['@_stroke'] === 'var(--color-accent)');
    assert.ok(supplier);
    const afterY = attr(supplier)['@_y'];
    const internal = rects.find(node => attr(node)['@_stroke'] === 'var(--color-signal)' && attr(node)['@_y'] === afterY);
    assert.ok(internal);
    const ia = attr(internal), sa = attr(supplier);
    const total = Number(ia['@_width']) + Number(sa['@_width']);
    close(total, mobile ? 316 : 460, 'Both compositions retain the complete 100-FTE bar');
    close(Number(ia['@_width']) / total, internalAfter / internalBefore, 'Internal staff retain 80% of the work');
    close(Number(sa['@_width']) / total, supplierAfter / internalBefore, 'Supplier staff retain 20% of the work');
    close(Number(ia['@_x']) + Number(ia['@_width']), Number(sa['@_x']), 'Segments meet without a gap');
    assert.equal(ia['@_height'], sa['@_height']);
    const before = rects.find(node => Number(attr(node)['@_y']) < Number(afterY) && Number(attr(node)['@_width']) === total);
    assert.ok(before, 'Before and after bars use the same scale');
    assert.match(svg, /100 \/ 80 = 1[,.]25/u);
    assert.match(svg, /\+25\s?%/u);
    assert.match(svg, /fictif|[Hh]ypothetical/u);
  }
});
