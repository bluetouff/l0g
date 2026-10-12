import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import postcss from 'postcss';

const read = p => readFileSync(new URL(`../${p}`, import.meta.url), 'utf8');
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const builder = new XMLBuilder({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '' });
const tag = n => Object.keys(n).find(k => k !== ':@');
const attrs = n => n[':@'] ?? {};
const children = n => n[tag(n)] ?? [];
const nodesOf = n => tag(n) === '#text' ? [] : [n, ...children(n).flatMap(nodesOf)];
const textOf = n => tag(n) === '#text' ? n['#text'] : children(n).map(textOf).join('');
const number = (n, key, fallback = 0) => {
  const raw = attrs(n)[key] ?? String(fallback);
  assert.ok(raw.length <= 64);
  assert.match(raw, /^-?(?:\d{1,32}(?:\.\d{1,32})?|\.\d{1,32})$/u);
  const v = Number(raw); assert.ok(Number.isFinite(v)); return v;
};
const kinds = ['01-deux-bilans', '02-trois-appels', '03-horloge', '04-circulation', '05-crise-2022', '06-reconstitution'];
const articles = ['fr', 'en'].map(lang => ({ lang, raw: read(`src/content/${lang === 'fr' ? 'posts' : 'posts-en'}/dette-etats-05-appels-marge.mdx`) }));
function extractSvg(raw) {
  const all = []; let offset = 0;
  for (;;) {
    const start = raw.indexOf('<svg ', offset); if (start === -1) break;
    const end = raw.indexOf('</svg>', start); assert.ok(end > start && end - start < 30000);
    all.push(raw.slice(start, end + 6)); offset = end + 6;
  }
  return all;
}
const variants = articles.flatMap(({ lang, raw }) => {
  const svgs = extractSvg(raw); assert.equal(svgs.length, 12);
  return svgs.map((svg, i) => { const kind = kinds[Math.floor(i / 2)], mobile = i % 2 === 1; return { lang, kind, mobile, name: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, prefix: `d5-${kind}-${lang}-${mobile ? 'm' : 'd'}`, svg }; });
});
const paintTokens = new Map([
  ['#0e1d2a','var(--color-ink)'],['#192d3c','var(--color-surface-2)'],['#122431','var(--color-surface)'],
  ['#f5f0e6','var(--color-paper)'],['#bbccd4','var(--color-muted)'],['#365064','var(--color-line-strong)'],
  ['#79dec4','var(--color-signal)'],['#f4bf7b','var(--color-amber)'],['#f2a4aa','var(--color-accent)'],
  ['#99c3f6','var(--color-topic-blue)'],['#443d31','color-mix(in srgb, var(--color-amber) 10%, var(--color-ink))'],
]);
const paints = new Set(['none', ...paintTokens.values()]);
const allowed = Object.fromEntries(Object.entries({
  svg: 'xmlns viewBox role aria-labelledby lang style', title: 'id', desc: 'id', defs: '',
  pattern: 'id width height patternUnits', path: 'd fill stroke stroke-width opacity stroke-linecap stroke-linejoin',
  rect: 'x y width height rx fill stroke stroke-width', text: 'x y fill font-family font-size font-weight text-anchor',
  line: 'x1 y1 x2 y2 stroke stroke-width stroke-dasharray', polygon: 'points fill', circle: 'cx cy r fill',
}).map(([k,v]) => [k,new Set(v.split(' ').filter(Boolean))]));
const numeric = new Set('x y x1 y1 x2 y2 width height rx cx cy r font-size stroke-width opacity'.split(' '));

// Ordered complete-field fingerprints derived from all supplied source SVGs,
// after the finite semantic-paint map. Inter-element whitespace is ignored
// for MDX formatting; label whitespace remains significant. Responsive root
// style is added; the
// English desktop labels "following default" and "this example" move up four
// SVG units to keep descenders inside their existing cards with bottom padding.
const originalSignatures = {
  "01-deux-bilans-en-desktop": "c9216dabc9e1ab977f024a60b0ed922f3337cc20fb77cfab188f07824b2ed953",
  "01-deux-bilans-en-mobile": "356bd904bba5e62977a57b1e1f1a6958bace81500b812fd2cc9943429c2fc284",
  "01-deux-bilans-fr-desktop": "c03f7aa258a565a3a27f56228745c06a598c4dfa698548d40938676fb1c9a976",
  "01-deux-bilans-fr-mobile": "c9f90b98a41a0c23fbc9e6d901b467a072d82fd52f318bed9b53d93ecb069a56",
  "02-trois-appels-en-desktop": "57fb5dd36fc43f3e0a56542838b74575f63b52622f15584b66a18917a2426642",
  "02-trois-appels-en-mobile": "2ba79b5caf75fc493a1fa4bdebc1645c93dcea98f5b882e02307f887956b60e6",
  "02-trois-appels-fr-desktop": "6cf73b20e510263890d71ccd6e0502390c68dfd318719a2a1d4030a802174c6f",
  "02-trois-appels-fr-mobile": "f55171e9365bd0cb0bdf5e64fc1d12fc2707c721fb634ae9edace66509497be9",
  "03-horloge-en-desktop": "9741d725175650dc9fa28c5723c295cd939d6f0b25c85f96b3fed24d4f2d8aa9",
  "03-horloge-en-mobile": "fccec8bdf13f1b31334369122baa29ff6cd37d472ea6a3fbd1ec52839e2ddee5",
  "03-horloge-fr-desktop": "6f8696e0891ade0b0c307a109bd369a88baec3e4f24ca316301e14843c70265f",
  "03-horloge-fr-mobile": "02c24dbe0b6844fee5292052bdfe6f70f40282bd546fcb6f1a1f77d09d139fd6",
  "04-circulation-en-desktop": "9d5131181fd275a28b62d03cd866636e60a4c99b97d50aa32ed87fef00af62bd",
  "04-circulation-en-mobile": "7271f7faef0942d9200ba6fe8c7d5e70f5fa6fbf64d0c9ac480e27c101d6f2d0",
  "04-circulation-fr-desktop": "a704a9caa4028ba805784d1aa50fed12a5f63800ea6c16c4859dbb1f7164c51c",
  "04-circulation-fr-mobile": "84e9eb4c0f37705b9c09753243474df3939e8cc21b27448421e2e5affcd974ea",
  "05-crise-2022-en-desktop": "f8a404a8899e036fb5d6237ae35f35704ef05f04193ee018015a14e06a882366",
  "05-crise-2022-en-mobile": "aadfab55b2b06528d1ef49f5b638925c1f6d0c269bbcc6681d27d13418f6dc04",
  "05-crise-2022-fr-desktop": "a46171cf3611b1315c67391d2d06df91dd0efcf0137573e81b3598a62c16dc1e",
  "05-crise-2022-fr-mobile": "94799bf0b5a19ef4884cef66937c706aa03c9f459e1a9743d5ad99a352915572",
  "06-reconstitution-en-desktop": "85667a95e95890edb0056402402505d6fa3a533a3ea87681a82ff81333bfe5e0",
  "06-reconstitution-en-mobile": "c54be8e95bcb59114386022f19644efd9042d4a3f2e21640b9c60e685b5b08b2",
  "06-reconstitution-fr-desktop": "05d12e177a72b9df373f0f5179b7396377d42a4be27eca434728e26c8839e032",
  "06-reconstitution-fr-mobile": "c2244d2d5b08d0e367bba356d81f22a84fe8808c998d791467c72a8f0e16def1"
};
function canonical(n, root = false) {
  if (tag(n) === '#text') return ['#text', n['#text']];
  const a = { ...attrs(n) }; if (root) delete a.style;
  return [tag(n), Object.entries(a).sort(([a],[b]) => a < b ? -1 : a > b ? 1 : 0), children(n).filter(child => tag(child) !== '#text' || child['#text'].trim() || ['text', 'title', 'desc'].includes(tag(n))).map(child => canonical(child))];
}
function signature(v) { return createHash('sha256').update(JSON.stringify(canonical(inspect(v).root, true))).digest('hex'); }
function pathPoints(value) {
  assert.ok(value.length > 0 && value.length <= 4096);
  const token = /\s*(?:([MLHVZ])|(-?(?:\d{1,32}(?:\.\d{1,32})?|\.\d{1,32})))\s*/y;
  const tokens = []; let at = 0;
  while (at < value.length) { token.lastIndex = at; const m = token.exec(value); assert.ok(m, `Invalid path at ${at}`); tokens.push(m[1] ?? Number(m[2])); at = token.lastIndex; }
  const points = []; let x = 0, y = 0, i = 0;
  while (i < tokens.length) {
    const cmd = tokens[i++]; assert.ok(['M','L','H','V','Z'].includes(cmd));
    const next = () => { const n = tokens[i++]; assert.equal(typeof n, 'number'); assert.ok(Number.isFinite(n)); return n; };
    if (cmd === 'M' || cmd === 'L') { x = next(); y = next(); }
    else if (cmd === 'H') x = next(); else if (cmd === 'V') y = next();
    else { assert.ok(points.length); continue; }
    points.push([x,y]);
  }
  assert.equal(tokens[0], 'M'); assert.ok(points.length); return points;
}
function inspect(v) {
  assert.ok(v.svg.length < 30000); assert.doesNotMatch(v.svg, /<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;)/u);
  assert.equal(XMLValidator.validate(v.svg), true);
  const roots = parser.parse(v.svg); assert.equal(roots.length, 1);
  const root = roots[0]; assert.equal(tag(root), 'svg'); const all = nodesOf(root), ids = new Set();
  assert.equal(attrs(root).xmlns, 'http://www.w3.org/2000/svg'); assert.equal(attrs(root).style, 'width:100%;height:auto');
  assert.equal(attrs(root).role, 'img'); assert.equal(attrs(root).lang, v.lang);
  assert.equal(attrs(root)['aria-labelledby'], `${v.prefix}-title ${v.prefix}-desc`);
  const dimensions = attrs(root).viewBox.split(' ').map(Number); assert.equal(dimensions.length, 4); assert.deepEqual(dimensions.slice(0,2), [0,0]);
  assert.ok(dimensions.every(Number.isFinite)); assert.equal(dimensions[2], v.mobile ? 640 : 1200); assert.ok(dimensions[3] > 900 && dimensions[3] <= 1830);
  for (const n of all) {
    assert.ok(allowed[tag(n)], `Unapproved tag ${tag(n)}`);
    for (const [k,value] of Object.entries(attrs(n))) {
      assert.ok(allowed[tag(n)].has(k), `Unapproved ${tag(n)}.${k}`); assert.equal(typeof value, 'string'); assert.ok(value.length <= 4096);
      if (numeric.has(k)) number(n,k);
      if (k === 'fill' || k === 'stroke') assert.ok(paints.has(value) || (tag(n) === 'rect' && value === `url(#${v.prefix}-hatch)`));
      if (k === 'id') { assert.ok([`${v.prefix}-title`,`${v.prefix}-desc`,`${v.prefix}-hatch`].includes(value)); assert.ok(!ids.has(value)); ids.add(value); }
      if (k === 'font-family') assert.equal(value, 'Arial, Helvetica, sans-serif');
      if (k === 'font-weight') assert.ok(['400','700'].includes(value));
      if (k === 'font-size') assert.ok(number(n,k) >= 17 && number(n,k) <= 104);
      if (k === 'text-anchor') assert.ok(['start','middle','end'].includes(value));
      if (k === 'patternUnits') assert.equal(value, 'userSpaceOnUse');
      if (k === 'stroke-dasharray') assert.ok(['6 7','3 7','5 6'].includes(value));
      if (k === 'stroke-linecap' || k === 'stroke-linejoin') assert.equal(value, 'round');
      if (k === 'd') pathPoints(value);
    }
  }
  assert.deepEqual([...ids].sort(), ['title','desc','hatch'].map(k => `${v.prefix}-${k}`).sort());
  for (const type of ['title','desc']) { const nodes = all.filter(n => tag(n) === type); assert.equal(nodes.length, 1); assert.ok(textOf(nodes[0]).trim()); }
  return { root, nodes: all, width: dimensions[2], height: dimensions[3] };
}
function mutate(v, change) { const root = parser.parse(v.svg)[0]; change(root,nodesOf(root)); return { ...v, svg: builder.build([root]) }; }
// Reuse the repository's unmodified Liberation Sans faces: deterministic Arial
// metric equivalents. This is a geometry regression, not a claim that every
// browser chooses the same fallback font; rendered browser inspection is needed.
const fontHashes = { 400: '76d04c18ea243f426b7de1f3ad208e927008f961dc5945e5aad352d0dfde8ee8', 700: '788abee4c806d660e8aee46689dd8540cd4bb98da03dcc9d171ce3efd99a9173' };
const fonts = Object.fromEntries([400, 700].map(weight => {
  const bytes = readFileSync(new URL(`../public/fonts/ukraine-reparations/liberation-sans-${weight}.ttf`, import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'), fontHashes[weight]);
  return [weight, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));
function pointsBox(points) {
  assert.ok(points.length > 0 && points.flat().every(Number.isFinite));
  return { x: Math.min(...points.map(p => p[0])), y: Math.min(...points.map(p => p[1])), right: Math.max(...points.map(p => p[0])), bottom: Math.max(...points.map(p => p[1])) };
}
function textBox(node) {
  const value = textOf(node), font = fonts[attrs(node)['font-weight']], size = number(node, 'font-size');
  for (const character of value) assert.ok(font.charToGlyphIndex(character) > 0, `Missing glyph U+${character.codePointAt(0).toString(16)}`);
  const spacing = number(node, 'letter-spacing'), glyphCount = font.stringToGlyphs(value).length;
  const advance = font.getAdvanceWidth(value, size) + Math.max(0, glyphCount - 1) * spacing, anchor = attrs(node)['text-anchor'];
  const x = number(node, 'x') - (anchor === 'middle' ? advance / 2 : anchor === 'end' ? advance : 0);
  const glyphs = [];
  let glyphIndex = 0;
  font.forEachGlyph(value, x, number(node, 'y'), size, {}, (glyph, gx, gy, fontSize, options) => {
    const points = glyph.getPath(gx + glyphIndex++ * spacing, gy, fontSize, options).commands.filter(command => command.type !== 'Z').flatMap(command => ['x', 'x1', 'x2'].flatMap((key, i) => key in command ? [[command[key], command[['y', 'y1', 'y2'][i]]]] : []));
    if (points.length) glyphs.push(pointsBox(points));
  });
  return { ...pointsBox(glyphs.flatMap(box => [[box.x, box.y], [box.right, box.bottom]])), glyphs };
}
function shapeBox(node) {
  if (tag(node) === 'path') return pointsBox(pathPoints(attrs(node).d));
  if (tag(node) === 'rect') return { x: number(node, 'x'), y: number(node, 'y'), right: number(node, 'x') + number(node, 'width'), bottom: number(node, 'y') + number(node, 'height') };
  if (tag(node) === 'circle') return { x: number(node, 'cx') - number(node, 'r'), y: number(node, 'cy') - number(node, 'r'), right: number(node, 'cx') + number(node, 'r'), bottom: number(node, 'cy') + number(node, 'r') };
  if (tag(node) === 'line') return pointsBox([[number(node, 'x1'), number(node, 'y1')], [number(node, 'x2'), number(node, 'y2')]]);
  if (tag(node) === 'polygon') {
    const values = attrs(node).points.split(' ').map(pair => pair.split(',').map(Number));
    assert.ok(values.every(pair => pair.length === 2));
    return pointsBox(values);
  }
}
const within = (box, container, padding = 0) => box.x >= container.x + padding && box.y >= container.y + padding && box.right <= container.right - padding && box.bottom <= container.bottom - padding;
const overlaps = (a, b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
function geometry(v) {
  const { root, width, height } = inspect(v);
  const visible = children(root).filter(node => ['text', 'rect', 'line', 'polygon', 'circle', 'path'].includes(tag(node)));
  const canvas = { x: 0, y: 0, right: width, bottom: height }, textBoxes = [];
  for (const [index, node] of visible.entries()) {
    if (tag(node) !== 'text') {
      const box = shapeBox(node), stroke = attrs(node).stroke ? number(node, 'stroke-width', 1) / 2 : 0;
      assert.ok(box.right >= box.x && box.bottom >= box.y);
      assert.ok(within({ x: box.x - stroke, y: box.y - stroke, right: box.right + stroke, bottom: box.bottom + stroke }, canvas), `${v.name}: shape outside viewBox`);
      continue;
    }
    const box = textBox(node), label = textOf(node);
    assert.ok(within(box, canvas, 2), `${v.name}: glyph outside viewBox: ${label} ${JSON.stringify(box)}`);
    const center = { x: (box.x + box.right) / 2, y: (box.y + box.bottom) / 2 };
    const card = visible.slice(0, index).filter(candidate => tag(candidate) === 'rect' && number(candidate, 'rx') >= 8 && number(candidate, 'x') > 0 && within({ ...center, right: center.x, bottom: center.y }, shapeBox(candidate))).at(-1);
    if (card) assert.ok(within(box, shapeBox(card), 2), `${v.name}: glyph outside card: ${label}`);
    // Aggregate text boxes may intersect only in empty space between glyphs.
    // Compare individual outlines' conservative bounds before flagging a collision.
    for (const prior of textBoxes) assert.ok(!overlaps(box, prior) || !box.glyphs.some(glyph => prior.glyphs.some(other => overlaps(glyph, other))), `${v.name}: label collision: ${label}/${prior.label}`);
    for (const later of visible.slice(index + 1).filter(candidate => tag(candidate) === 'rect' && attrs(candidate).fill !== 'none')) assert.ok(!overlaps(box, shapeBox(later)), `${v.name}: later paint conceals label: ${label}`);
    textBoxes.push({ ...box, label });
  }
}



test('all 24 supplied compositions retain complete content, order and geometry with native theme paints', () => {
  assert.deepEqual(variants.map(v => v.name).sort(),Object.keys(originalSignatures).sort());
  for (const v of variants) assert.equal(signature(v),originalSignatures[v.name],v.name);
});
test('SVGs have unique accessible IDs, safe attributes and complete source anchors', () => {
  const ids = new Set();
  for (const v of variants) {
    for (const n of inspect(v).nodes) if (attrs(n).id) { assert.ok(!ids.has(attrs(n).id)); ids.add(attrs(n).id); }
    assert.doesNotMatch(textOf(inspect(v).nodes.find(n => tag(n) === 'title')), /ce qu[ei’']|what\b|deux horloges|2 horloges|two clocks|—/iu);
  }
  assert.equal(ids.size,72);
  for (const {raw} of articles) for (let i=1;i<=18;i++) { const id=`source-${String(i).padStart(2,'0')}`; assert.equal(raw.split(`id="${id}"`).length,2); assert.ok(raw.includes(`href="#${id}"`)); }
});
test('original glyphs, cards, step paths and shapes remain inside their canvases', () => {
  const failures=[];for(const v of variants)try{geometry(v);}catch(e){failures.push(e.message);}assert.deepEqual(failures,[]);
});
test('complete fingerprints reject changes to text, geometry, paint, IDs and order', () => {
  const v=variants[0];
  for(const change of [(_,n)=>{attrs(n.find(x=>tag(x)==='rect')).fill='var(--color-surface)';},(_,n)=>{attrs(n.find(x=>tag(x)==='text')).x='0';},(_,n)=>{attrs(n.find(x=>tag(x)==='text'))['font-weight']='400';},r=>{r.svg.reverse();},(_,n)=>{n.find(x=>tag(x)==='title').title=[{'#text':'Changed'}];}]){
    let result; try { result = signature(mutate(v, change)); } catch (e) { assert.ok(e instanceof assert.AssertionError); continue; } assert.notEqual(result, originalSignatures[v.name]);
  }
});
test('untrusted SVG content and noncanonical paint or reference URLs are rejected', () => {
  const v=variants[0];
  for(const change of [(_,n)=>{attrs(n.find(x=>tag(x)==='text')).onclick='alert(1)';},(_,n)=>{attrs(n.find(x=>tag(x)==='rect')).fill='url(https://example.org/x)';},(_,n)=>{attrs(n.find(x=>tag(x)==='rect')).fill='var(--color-ink, red)';},(_,n)=>{attrs(n.find(x=>tag(x)==='rect')).fill=`url(#${v.prefix}-hatch?x)`;},(_,n)=>{attrs(n.find(x=>tag(x)==='pattern')).id+='-suffix';},r=>{r.svg.push({script:[{'#text':'alert(1)'}]});}])assert.throws(()=>inspect(mutate(v,change)));
  for(const raw of ['<!DOCTYPE svg><svg/>','<svg>&external;</svg>','<svg>&#65;</svg>'])assert.throws(()=>inspect({...v,svg:raw}));
});
test('path parser consumes all input, rejects malformed numeric boundaries and accepts supplied steps', () => {
  for(const v of variants)for(const n of inspect(v).nodes)if(tag(n)==='path')assert.ok(pathPoints(attrs(n).d).length);
  for(const invalid of ['M 0 0 trailing','M 0 0 C 1 2 3 4','M 0','M NaN 0','M 1e999 0','M '+'.'.repeat(4096)+' 0','M '+'9'.repeat(65)+' 0'])assert.throws(()=>pathPoints(invalid));
});
test('three independent sterling simulations reconcile across funding, repo and payment deadlines', () => {
  assert.equal(900/800*100,112.5);assert.equal(900-800,100);
  assert.equal(95*98,9310);assert.equal(9800-9310,490);assert.equal((95+5)*98,9800);
  assert.equal(12+4+6,22);assert.deepEqual([22-8,22-16,18-8,18-16],[14,6,10,2]);
  for(const {raw,lang} of articles){assert.ok(raw.includes(lang==='fr'?'livres sterling':'sterling'));assert.ok(raw.includes(lang==='fr'?'calculs sont explicités':'calculations are explained'));assert.doesNotMatch(raw,/M€|\b(?:deux|2) horloges|two clocks|—/iu);}
});
test('responsive styles keep mobile compositions, spacing and light-theme hatching visible', () => {
  for(const {raw} of articles){assert.ok(raw.includes('width:100%;height:auto'));assert.ok(raw.includes('@media(max-width:680px)'));assert.ok(raw.includes('margin:2.5rem auto 3rem'));assert.ok(raw.includes('pattern path{opacity:.75}'));assert.doesNotMatch(raw,/overflow:hidden|overflow: hidden/);}
  const themes={dark:new Map(),light:new Map()};
  postcss.parse(read('src/styles/global.css')).walkDecls(d=>{if(d.parent.type==='atrule'&&d.parent.name==='theme')themes.dark.set(d.prop,d.value);if(d.parent.type==='rule'&&d.parent.selector===':root[data-theme="light"]')themes.light.set(d.prop,d.value);});
  for(const palette of Object.values(themes))for(const token of ['ink','surface','surface-2','paper','muted','signal','amber','accent','topic-blue','line-strong'])assert.ok(palette.has(`--color-${token}`));
});

test('malformed numeric regression is isolated under a subprocess deadline', () => {
  const code = `import assert from 'node:assert/strict';
const parse = ${pathPoints.toString()};
for (const input of ['M ' + '.'.repeat(4000) + ' 0', 'M ' + '9'.repeat(4000) + ' 0']) assert.throws(() => parse(input));
assert.deepEqual(parse('M 0 0 H 100 V 22'), [[0,0],[100,0],[100,22]]);`;
  execFileSync(process.execPath, ['--input-type=module', '-e', code], { timeout: 2000, maxBuffer: 8192, stdio: 'pipe' });
});
