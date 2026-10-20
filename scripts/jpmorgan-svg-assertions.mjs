import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { parseFragment } from 'parse5';
import opentype from '@shuding/opentype.js';

// Compact scenes retain the verified amounts, populations, chart scales and
// relationships. Reflow removes repeated prose already present in captions,
// body and method notes; source and rendered pins protect each final scene.
const hashes = {
  "fr-0": "5748f2d76fa20a0830409be01489b72974cb457669f90100c4da00a586bd4a6e",
  "fr-1": "bba4d9ff505ba5aeb23d8a583ea1105aa00d669343160e0f01a8710032a4c127",
  "fr-2": "a800829572cb6504d1de20889d144fe8ed1f66321960e3d64ce78ef1d63734cd",
  "fr-3": "908be81828d41e2ba12f637f760e8816203298403bf43d7cdcb59200b254fb1c",
  "fr-4": "d3cd96b9ce55ca38698c1632495b27543361d13dce26878a6259324599036f86",
  "fr-5": "2ac5f7b3e98ac206ba6651ced6d3716d6534765f8d923196ec042a2a9285c830",
  "fr-6": "0796c18966601f1908e89cc829c74789f1167680bdc2a8dd1a5c44c72e297dcf",
  "fr-7": "064127f20de1842560c6cb46f6e06ae325708ccb728a80a513ae4cb9cabb559c",
  "fr-8": "c26e7269a9066c69c2a5922d84aff799506d556ef27e8b16e799786929d88c21",
  "fr-9": "36bd93a6e8b278236f2beca1e74ca9cb19629cc89901ef6a6ba9ed8a5ee97713",
  "fr-10": "a082dd646888ceec95bc1b4b368b3354cf270ef874e782ed3fd9793030d73b5d",
  "fr-11": "c8e6d5e344ddb0ea867657b2d6f345c2216195fce4e99d600d3c35b0f7fdb375",
  "en-0": "e8fda533610ffe798c06a962ebc07cb791aa7c7e5e34c0521bb3cbdfff27cd3f",
  "en-1": "febdea659b5d10a11da4beb5cd5d07802cba7d0e8afd2f37f627b4447c098657",
  "en-2": "ac7c382b7186f3b5dbd8ce14d2152620e1c64400ccbd1429d97abae8c8acdab8",
  "en-3": "3281f9da33c27676c37ddcc8c8304604860c9979df98ee640914cdfce0291b5e",
  "en-4": "392a53d263fe0e0b1963cdd74ed82fe18239abdf15579e314b928ee713654d44",
  "en-5": "9d422a91e2227030b167f1ee3c5b88ac83d7361ee758474c5f419f198c4d1efa",
  "en-6": "79dd41dff81c55d8aa49dc093733c70e4bfd4030ccbce70bd9f939b79fd86122",
  "en-7": "a6716a8946db2e57f37e3d0414962cd1150490f63292a38b2a39424ec0af09a3",
  "en-8": "2a4e4a06687a6f6d5218e703264639d6b42000bba1afb3c00d5df11dfc87e8a9",
  "en-9": "e3aa286cf60b551380368044a2ba680f891ec454b98193574f6d8aacebd656fe",
  "en-10": "7b874d9dcd5b6439964e306f03698ccef9361214de483f40f2eb5cb6d2f99287",
  "en-11": "c391b74671713cc4b2899b0c597903d2ed1c3a44a8059fb8f03a27a3ffb5b914"
};
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '', preserveOrder: true, trimValues: false, parseTagValue: false });
export const jpmTag = node => Object.keys(node).find(key => key !== ':@');
export const jpmAttrs = node => node[':@'] ?? {};
export const jpmNodes = node => [node, ...(node[jpmTag(node)] ?? []).filter(child => jpmTag(child) !== '#text').flatMap(jpmNodes)];
export const jpmText = node => (node[jpmTag(node)] ?? []).map(child => jpmTag(child) === '#text' ? child['#text'] : jpmText(child)).join('');
const number = (node, key) => Number(jpmAttrs(node)[key]);
const allowed = {
  svg: 'style xmlns viewBox role aria-labelledby', title: 'id', desc: 'id', defs: '',
  marker: 'id viewBox refX refY markerWidth markerHeight orient',
  pattern: 'id width height patternUnits',
  path: 'id d fill stroke stroke-width stroke-dasharray marker-end',
  rect: 'x y width height rx fill stroke stroke-width stroke-dasharray',
  text: 'x y font-family font-size font-weight text-anchor fill',
  line: 'x1 y1 x2 y2 stroke stroke-width stroke-dasharray marker-end',
  circle: 'cx cy r fill stroke stroke-width', a: 'href',
};
const fonts = new Map([400, 700].map(weight => {
  const bytes = readFileSync(new URL(`../public/fonts/jpmorgan/dejavu-sans-${weight}.ttf`, import.meta.url));
  return [weight, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));
export const jpmSourceFigures = article => [...article.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]);

export function inspectJpmSvg(svg) {
  assert.equal(typeof svg, 'string');
  assert.ok(svg.length < 50000);
  assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<!\[CDATA\[|<\?/iu);
  assert.doesNotMatch(svg, /\b(?:fontFamily|fontSize|fontWeight|textAnchor|strokeWidth|strokeDasharray|markerEnd)=/u, 'SVG presentation attributes use native names');
  assert.equal(XMLValidator.validate(svg), true);
  const roots = parser.parse(svg);
  assert.equal(roots.length, 1);
  const root = roots[0], nodes = jpmNodes(root), a = jpmAttrs(root);
  assert.equal(jpmTag(root), 'svg');
  assert.equal(a.style, 'width:100%;height:auto');
  assert.equal(a.role, 'img');
  assert.match(a.viewBox, /^0 0 (?:480|1000) [0-9]+$/u);
  const ids = nodes.map(node => jpmAttrs(node).id).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  for (const id of a['aria-labelledby'].split(' ')) assert.ok(nodes.some(node => jpmAttrs(node).id === id && ['title', 'desc'].includes(jpmTag(node)) && jpmText(node).trim()));
  for (const node of nodes) {
    assert.ok(Object.hasOwn(allowed, jpmTag(node)), `Forbidden SVG element: ${jpmTag(node)}`);
    for (const [key, value] of Object.entries(jpmAttrs(node))) {
      assert.ok(allowed[jpmTag(node)].split(' ').includes(key), `Forbidden SVG attribute: ${key}`);
      if (key === 'href') {
        const label = jpmText(node).trim().match(/^(S[0-9]{2})$/u)?.[1];
        assert.ok(label && Number(label.slice(1)) >= 1 && Number(label.slice(1)) <= 20);
        assert.equal(value, `#source-${label}`);
      }
      if (['fill', 'stroke'].includes(key)) assert.match(value, /^(?:none|var\(--color-(?:surface|surface-2|paper|muted|line-strong|signal|amber)\)|url\(#[a-z0-9-]+\))$/u);
      if (String(value).includes('url(')) {
        const reference = String(value).match(/^url\(#([a-z0-9-]+)\)$/u);
        assert.ok(reference && ids.includes(reference[1]));
      }
    }
  }
  return { root, nodes };
}

export function assertJpmSourceFaithful(svg, lang, index) {
  inspectJpmSvg(svg);
  assert.equal(createHash('sha256').update(svg).digest('hex'), hashes[`${lang}-${index}`], 'Verified compact composition, labels or semantic-theme mapping changed');
}

export function assertJpmGeometry(svg) {
  const { root, nodes } = inspectJpmSvg(svg), [,, width, height] = jpmAttrs(root).viewBox.split(' ').map(Number);
  const labelBoxes = [];
  const visible = node => jpmTag(node) === 'defs' ? [] : [node, ...(node[jpmTag(node)] ?? []).filter(child => jpmTag(child) !== '#text').flatMap(visible)];
  const point = (x, y) => assert.ok(Number.isFinite(x) && Number.isFinite(y) && x >= 0 && y >= 0 && x <= width && y <= height, `Shape outside viewBox: ${x},${y}`);
  for (const node of visible(root)) {
    const a = jpmAttrs(node), tag = jpmTag(node);
    if (tag === 'rect') {
      const x = Number(a.x ?? 0), y = Number(a.y ?? 0), w = a.width === '100%' ? width : Number(a.width), h = a.height === '100%' ? height : Number(a.height);
      assert.ok(w >= 0 && h >= 0); point(x, y); point(x + w, y + h);
    }
    if (tag === 'circle') { const x = number(node, 'cx'), y = number(node, 'cy'), r = number(node, 'r'); assert.ok(r >= 0); point(x - r, y - r); point(x + r, y + r); }
    if (tag === 'line') { point(number(node, 'x1'), number(node, 'y1')); point(number(node, 'x2'), number(node, 'y2')); }
    if (tag === 'path') {
      // All supplied visible paths use absolute straight segments. Consume the
      // entire bounded grammar rather than extracting numbers from unknown SVG.
      const token = /[MLHVZ]|-?(?:\d{1,4}(?:\.\d{1,18})?|\.\d{1,18})/uy, tokens = [];
      let offset = 0;
      while (offset < a.d.length) {
        if (/\s/u.test(a.d[offset])) { offset++; continue; }
        token.lastIndex = offset; const match = token.exec(a.d); assert.ok(match, 'Every path character is consumed');
        tokens.push(match[0]); offset = token.lastIndex;
      }
      assert.ok(tokens.length < 1024); assert.equal(tokens[0], 'M');
      let i = 0, x, y, origin;
      const value = () => { const n = Number(tokens[i++]); assert.ok(Number.isFinite(n)); return n; };
      while (i < tokens.length) {
        const command = tokens[i++];
        if (command === 'M' || command === 'L') { x = value(); y = value(); if (command === 'M') origin = [x, y]; }
        else if (command === 'H') x = value();
        else if (command === 'V') y = value();
        else { assert.equal(command, 'Z'); assert.ok(origin); [x, y] = origin; }
        point(x, y);
      }
    }
  }
  const panels = nodes.filter(node => jpmTag(node) === 'rect' && [8, 10, 12].includes(number(node, 'rx')));
  for (const node of nodes.filter(node => jpmTag(node) === 'text')) {
    const a = jpmAttrs(node), size = Number(a['font-size']), font = fonts.get(Number(a['font-weight'])), label = jpmText(node);
    assert.ok(font);
    for (const glyph of Array.from(label)) assert.ok(font.charToGlyphIndex(glyph) > 0, `Missing local glyph: ${glyph}`);
    const advance = font.getAdvanceWidth(label, size), x = number(node, 'x') - (a['text-anchor'] === 'middle' ? advance / 2 : a['text-anchor'] === 'end' ? advance : 0), y = number(node, 'y');
    const box = { x1: Infinity, y1: Infinity, x2: -Infinity, y2: -Infinity }, scale = size / font.unitsPerEm;
    font.forEachGlyph(label, x, y, size, {}, (glyph, gx, gy) => {
      if (!Number.isFinite(glyph.xMin) || glyph.xMin === glyph.xMax && glyph.yMin === glyph.yMax) return;
      box.x1 = Math.min(box.x1, gx + glyph.xMin * scale); box.x2 = Math.max(box.x2, gx + glyph.xMax * scale);
      box.y1 = Math.min(box.y1, gy - glyph.yMax * scale); box.y2 = Math.max(box.y2, gy - glyph.yMin * scale);
    });
    assert.ok(box.x1 >= 2 && box.y1 >= 2 && box.x2 <= width - 2 && box.y2 <= height - 2, `Text outside viewBox: ${label}`);
    labelBoxes.push({ ...box, label });
    const panel = panels.filter(panel => number(node, 'x') >= number(panel, 'x') && number(node, 'x') <= number(panel, 'x') + number(panel, 'width') && y >= number(panel, 'y') && y <= number(panel, 'y') + number(panel, 'height')).sort((a, b) => number(a, 'width') * number(a, 'height') - number(b, 'width') * number(b, 'height'))[0];
    if (panel) assert.ok(box.x1 >= number(panel, 'x') + 2 && box.y1 >= number(panel, 'y') + 2 && box.x2 <= number(panel, 'x') + number(panel, 'width') - 2 && box.y2 <= number(panel, 'y') + number(panel, 'height') - 2, `Text outside internal panel: ${label}`);
  }
  for (let i = 0; i < labelBoxes.length; i++) for (let j = i + 1; j < labelBoxes.length; j++) {
    const a = labelBoxes[i], b = labelBoxes[j];
    assert.ok(!(Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 1 && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 1), `Overlapping labels: ${a.label} / ${b.label}`);
  }
  return true;
}

export function assertJpmProportions(svg) {
  const { root, nodes } = inspectJpmSvg(svg), [,, width, height] = jpmAttrs(root).viewBox.split(' ').map(Number), mobile = width === 480;
  assert.ok(height / width <= (mobile ? 1.55 : .7), 'Artwork retains compact in-page proportions');
  const minimum = Math.min(...nodes.filter(node => jpmTag(node) === 'text').map(node => number(node, 'font-size')));
  assert.ok(minimum >= (mobile ? 22 : 24), 'Compactness must preserve legible typography');
  // Use the actual 320px page's 280px column and the exact horizontal
  // breakpoint boundary, allowing for the panel's two 1px borders. The smallest
  // desktop notes reach about 11.47px immediately above 480px; they reach
  // 14.35px in the usual 600px column. Do not claim a 12px boundary minimum.
  const column = mobile ? 280 : 480.01;
  assert.ok(minimum * (column - 2) / width >= (mobile ? 12.5 : 11.4));
}

const near = (actual, expected) => assert.ok(Math.abs(Number(actual) - expected) <= .0006, `${actual} != ${expected}`);
export function assertJpmQuantitative(svg, figure) {
  const { root, nodes } = inspectJpmSvg(svg), mobile = jpmAttrs(root).viewBox.startsWith('0 0 480 ');
  if (figure === 5) {
    // Explicit hypothetical annual model: revenues × 45% - fixed costs 20 - debt service 12.
    const chart = nodes.find(node => jpmTag(node) === 'path' && (jpmAttrs(node).id ?? '').endsWith('-cash-curve'));
    assert.ok(chart);
    const points = [...jpmAttrs(chart).d.matchAll(/[ML]([0-9.]+) ([0-9.]+)/gu)].map(match => match.slice(1).map(Number));
    assert.equal(points.length, 71);
    const x = revenue => (mobile ? 64 : 80) + (revenue - 40) / 70 * (mobile ? 384 : 872);
    const top = mobile ? 166 : 136;
    const y = balance => top + (20 - balance) / 35 * (mobile ? 292 : 280);
    for (const [index, point] of points.entries()) { near(point[0], x(40 + index)); near(point[1], y((40 + index) * .45 - 32)); }
    for (const [revenue, radius] of [[60, 6], [100, 6], [32 / .45, 5]]) {
      const circle = nodes.find(node => jpmTag(node) === 'circle' && number(node, 'r') === radius && Math.abs(number(node, 'cx') - x(revenue)) < .001);
      assert.ok(circle); near(number(circle, 'cy'), y(.45 * revenue - 32));
    }
    const labels = nodes.filter(node => jpmTag(node) === 'text').map(jpmText);
    for (const label of ['−5', '+13']) assert.ok(labels.includes(label));
    assert.ok(labels.some(label => /71[,.]1/u.test(label)));
    assert.ok(labels.some(label => /FICTIF|HYPOTHETICAL/u.test(label)), 'Hypothetical values remain identified');
  }
  if (figure === 6) {
    const circles = nodes.filter(node => jpmTag(node) === 'circle'), rows = [...new Set(circles.map(node => number(node, 'cy')))];
    assert.equal(rows.length, 3);
    const expected = [5, 12, 3];
    for (const [index, row] of rows.entries()) {
      const group = circles.filter(node => number(node, 'cy') === row);
      assert.equal(group.length, 15);
      assert.equal(group.filter(node => jpmAttrs(node).fill === 'var(--color-signal)').length, expected[index]);
    }
    const labels = nodes.filter(node => jpmTag(node) === 'text').map(jpmText);
    for (const count of expected) assert.ok(labels.includes(`${count}/15`));
    assert.ok(labels.some(label => /généralisable|generalized|generalizable/u.test(label)), 'GAO sample limit remains visible');
  }
}

const projection = node => {
  if (node.nodeName === '#comment') return null;
  if (node.nodeName === '#text') return node.value.trim() ? { text: node.value } : null;
  return { tag: node.tagName ?? node.nodeName, attrs: Object.fromEntries((node.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a.localeCompare(b))), children: (node.childNodes ?? []).map(projection).filter(Boolean) };
};
export function assertJpmRenderedFaithful(svg, source, lang, index) {
  assertJpmSourceFaithful(source, lang, index);
  assertJpmGeometry(svg);
  assertJpmQuantitative(svg, Math.floor(index / 2) + 1);
  assert.deepEqual(projection(parseFragment(svg)), projection(parseFragment(source)), 'Astro preserves all native SVG attributes, text and element ordering');
}
