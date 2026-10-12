import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import postcss from 'postcss';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

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
const kinds = ['01','02','03','04','05','06'];
const articles = ['fr', 'en'].map(lang => ({ lang, raw: read(`src/content/${lang === 'fr' ? 'posts' : 'posts-en'}/dette-etats-07-dernier-acheteur.mdx`) }));
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
  return svgs.map((svg, i) => { const kind = kinds[Math.floor(i / 2)], mobile = i % 2 === 1; return { lang, kind, mobile, name: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, prefix: `f7-${kind}-${lang}-${mobile ? 'm' : 'd'}`, svg }; });
});
const paintTokens = new Map([["#0b1a25","var(--color-ink)"],["#142d3b","var(--color-surface)"],["#193746","var(--color-surface-2)"],["#355367","var(--color-line-strong)"],["#77dfc2","var(--color-signal)"],["#8cbafa","var(--color-topic-blue)"],["#aec2ca","var(--color-muted)"],["#f0f4ee","var(--color-paper)"],["#fc9ba0","var(--color-accent)"],["#ffc67c","var(--color-amber)"],["#bdb3fc","var(--color-topic-blue)"],["#102e3e","var(--color-surface-2)"]]);
const paints = new Set(['none', ...paintTokens.values()]);
const allowed = Object.fromEntries(Object.entries({
  svg: 'xmlns viewBox role aria-labelledby lang style', title: 'id', desc: 'id', defs: '',
  pattern: 'id width height patternUnits', linearGradient: 'id x1 x2 y1 y2', stop: 'offset stop-color', path: 'd fill stroke stroke-width opacity stroke-linecap stroke-linejoin stroke-dasharray',
  rect: 'x y width height rx fill stroke stroke-width', text: 'x y fill font-family font-size font-weight text-anchor opacity',
  line: 'x1 y1 x2 y2 stroke stroke-width stroke-dasharray', polygon: 'points fill', circle: 'cx cy r fill opacity stroke stroke-width',
}).map(([k,v]) => [k,new Set(v.split(' ').filter(Boolean))]));
const numeric = new Set('x y x1 y1 x2 y2 width height rx cx cy r font-size stroke-width opacity'.split(' '));

// Ordered complete-field fingerprints of all supplied source SVGs after
// the finite semantic-paint mapping; only inter-element whitespace and
// the separately validated responsive root style are excluded.
const originalSignatures = {
  "01-en-desktop": "d5b5e27bd711392e97ef621780346ffb2a0109a27a5b2584bde9149527d655bf",
  "01-en-mobile": "28948cdef34caf8eb00471f690ff652889707b1d1a1a76e5bce11654d5e0c1bf",
  "01-fr-desktop": "f97a8920f8021b20cd746893173e5f19e598c42f60662e7c55bdfeda4b8bc1de",
  "01-fr-mobile": "6ea4204c9d9a12371f7278d9daf3a7f0b88b6da98bfaa9c11d8265db2ea279f8",
  "02-en-desktop": "f11189de78a98850d8950d4e0b57602b3da58e349140b13971f332a31b3d8b96",
  "02-en-mobile": "c3c32454733d350ece088e6164210a620001e396a49f170c9fee74a566bc4e2a",
  "02-fr-desktop": "6f8b7867cc3c0f0bfe593cc55eda43acf4c65888984d214df678648c98327b17",
  "02-fr-mobile": "f372fae052745f6a61fd72720ac0ec86352c41a4d20240aa0224eda61193387e",
  "03-en-desktop": "99904b3e4123afc999dea79507d032e2bb14f758f8f02cf38b5c1a77c5b04dbc",
  "03-en-mobile": "6039e81e94c313a2c519ea9bd53918ec19753344ad470a830711c104c177d36f",
  "03-fr-desktop": "f64d5deabbeb48f40ff30f020e6808e6f083703075e54482ac854f86f8fe178f",
  "03-fr-mobile": "4afa7bb1c0c0ccc5b1c4aeda750b1053175b43dd29ced53338147e2d3b14da62",
  "04-en-desktop": "e52256cd5255946759fe9b704ac2a432eb2d2fa28237a4f2123a37848983c0c8",
  "04-en-mobile": "f00cfcde5f1099b20b1d28a5393c3894cdc443b37f130026295bc6540f10041f",
  "04-fr-desktop": "ca51fbac15b644bc974509ab0a2fcea01571d65943812492a8a27580d5b40242",
  "04-fr-mobile": "0c567a534519eea8f192b68357878ddff7402c0b853ee482097cbf4e8b2c434f",
  "05-en-desktop": "c54cc2028b9eaee104319ecbb8753500dd68e088c6a787498ead9f2f6ada7545",
  "05-en-mobile": "3f019a1caeb0df3a6ecf3168ab37b863ec356063f838b3acec1ac548f6b351a4",
  "05-fr-desktop": "eb61e5573070b2cb800698cc642a84c54ba5cd9ecc2e1dfe4a88eea04930ba65",
  "05-fr-mobile": "4adf09fc5a71ec9958944270e2d8d4cb43ddf6932615091d9de0a2891b313a55",
  "06-en-desktop": "780a876ef2142ae7a3e27e355bfd1f6a783dbc7cbc071a844bf82db9e1605384",
  "06-en-mobile": "f4f4503b6fdaa52706b5ae8faa9d49ef15cd1d43b114176b19374a2af8ba1969",
  "06-fr-desktop": "34ef51722b5d233389c379380f6f3456ebad5c7ba5b6ddab8f3f04e83959d7ff",
  "06-fr-mobile": "54581c93c6b04cc91ceda30364bfbacc9c49c7dc15e7406b62e36ee66e50d12d"
};
function canonical(n, root = false) {
  if (tag(n) === '#text') return ['#text', n['#text']];
  const a = { ...attrs(n) }; if (root) delete a.style;
  return [tag(n), Object.entries(a).sort(([a],[b]) => a < b ? -1 : a > b ? 1 : 0), children(n).filter(child => tag(child) !== '#text' || child['#text'].trim() || ['text', 'title', 'desc'].includes(tag(n))).map(child => canonical(child))];
}
function signature(v) { return createHash('sha256').update(JSON.stringify(canonical(inspect(v).root, true))).digest('hex'); }
function pathPoints(value) {
  assert.ok(value.length > 0 && value.length <= 4096);
  const token = /(?:([MLHVZ])|(-?(?:\d{1,32}(?:\.\d{1,32})?|\.\d{1,32})))/y;
  const tokens = []; let at = 0, comma = false;
  while (at < value.length) {
    if (/\s/u.test(value[at])) { at++; continue; }
    if (value[at] === ',') { assert.equal(typeof tokens.at(-1), 'number'); assert.ok(!comma); comma = true; at++; continue; }
    token.lastIndex = at; const m = token.exec(value); assert.ok(m, 'Invalid path at '+at);
    if (comma) assert.ok(m[2]); comma = false;
    tokens.push(m[1] ?? Number(m[2])); at = token.lastIndex;
  }
  assert.ok(!comma); const points = []; let x = 0, y = 0, startX = 0, startY = 0, i = 0;
  while (i < tokens.length) {
    const cmd = tokens[i++]; assert.ok(['M','L','H','V','Z'].includes(cmd));
    const next = () => { const n = tokens[i++]; assert.equal(typeof n, 'number'); assert.ok(Number.isFinite(n)); return n; };
    if (cmd === 'M' || cmd === 'L') { x = next(); y = next(); if (cmd === 'M') { startX = x; startY = y; } }
    else if (cmd === 'H') x = next(); else if (cmd === 'V') y = next();
    else { assert.ok(points.length); x = startX; y = startY; continue; }
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
  assert.equal(attrs(root)['aria-labelledby'], `${v.prefix}-t ${v.prefix}-d`);
  const dimensions = attrs(root).viewBox.split(' ').map(Number); assert.equal(dimensions.length, 4); assert.deepEqual(dimensions.slice(0,2), [0,0]);
  assert.ok(dimensions.every(Number.isFinite)); assert.equal(dimensions[2], v.mobile ? 740 : 1200); assert.ok(dimensions[3] === (v.mobile ? (['04','06'].includes(v.kind) ? 1190 : 1090) : 870));
  for (const n of all) {
    assert.ok(allowed[tag(n)], `Unapproved tag ${tag(n)}`);
    for (const [k,value] of Object.entries(attrs(n))) {
      assert.ok(allowed[tag(n)].has(k), `Unapproved ${tag(n)}.${k}`); assert.equal(typeof value, 'string'); assert.ok(value.length <= 4096);
      if (numeric.has(k)) number(n,k);
      if (k === 'fill' || k === 'stroke' || k === 'stop-color') assert.ok(paints.has(value) || (tag(n) === 'rect' && value === `url(#dots-${v.prefix})`));
      if (k === 'id') { assert.ok([`${v.prefix}-t`,`${v.prefix}-d`,`g-${v.prefix}`,`dots-${v.prefix}`].includes(value)); assert.ok(!ids.has(value)); ids.add(value); }
      if (k === 'font-family') assert.equal(value, 'DejaVu Sans,Arial,sans-serif');
      if (k === 'font-weight') assert.ok(['400','700'].includes(value));
      if (k === 'font-size') assert.ok(number(n,k) >= 12 && number(n,k) <= 43);
      if (k === 'text-anchor') assert.ok(['start','middle','end'].includes(value));
      if (k === 'patternUnits') assert.equal(value, 'userSpaceOnUse');
      if (k === 'stroke-dasharray') assert.ok(['4 4','5 7'].includes(value));
      if (k === 'stroke-linecap' || k === 'stroke-linejoin') assert.equal(value, 'round');
      if (k === 'd') pathPoints(value);
    }
  }
  assert.deepEqual([...ids].sort(), [`${v.prefix}-t`,`${v.prefix}-d`,`g-${v.prefix}`,`dots-${v.prefix}`].sort());
  for (const type of ['title','desc']) { const nodes = all.filter(n => tag(n) === type); assert.equal(nodes.length, 1); assert.ok(textOf(nodes[0]).trim()); }
  return { root, nodes: all, width: dimensions[2], height: dimensions[3] };
}
function mutate(v, change) { const root = parser.parse(v.svg)[0]; change(root,nodesOf(root)); return { ...v, svg: builder.build([root]) }; }
// Reuse the supplied font family already shipped by the repository. Rendered
// checks also verify the browser's actual font fallback and glyph geometry.
const fontHashes = {"400":"db2317b1e8fc6c43c708391e367e40b8801c68c01a11aa4aec02628957609b90","700":"c34a2976ce4386b7e483361611b3920c001711681820d6d73f4f4843dff6027a"};
const fonts = Object.fromEntries([400, 700].map(weight => {
  const bytes = readFileSync(new URL(`../public/fonts/debt-last-buyer/dejavu-sans-${weight}.ttf`, import.meta.url));
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



test('24 supplied compositions match the source plus six audited desktop legibility repairs', () => {
  assert.deepEqual(variants.map(v => v.name).sort(),Object.keys(originalSignatures).sort());
  for (const v of variants) assert.equal(signature(v),originalSignatures[v.name],v.name);
});
test('SVGs have unique accessible IDs, safe attributes and complete source anchors', () => {
  const ids = new Set();
  for (const v of variants) {
    for (const n of inspect(v).nodes) if (attrs(n).id) { assert.ok(!ids.has(attrs(n).id)); ids.add(attrs(n).id); }
    assert.doesNotMatch(textOf(inspect(v).nodes.find(n => tag(n) === 'title')), /ce qu[ei’']|what\b|deux horloges|2 horloges|two clocks|—/iu);
  }
  assert.equal(ids.size,96);
  for (const {raw} of articles) for (let i=1;i<=23;i++) { const id=`source-${String(i).padStart(2,'0')}`; assert.equal(raw.split(`id="${id}"`).length,2); assert.ok(raw.includes(`href="#${id}"`)); }
});
test('original glyphs, cards, curve paths and shapes remain inside their canvases', () => {
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
test('path parser consumes all input, rejects malformed numeric boundaries and accepts supplied paths', () => {
  for(const v of variants)for(const n of inspect(v).nodes)if(tag(n)==='path')assert.ok(pathPoints(attrs(n).d).length);
  for(const invalid of ['M 0,,0','M,0 0','M 0 0,','M 0 0, L 1 1','M 0 0 trailing','M 0 0 C 1 2 3 4','M 0','M NaN 0','M 1e999 0','M '+'.'.repeat(4096)+' 0','M '+'9'.repeat(65)+' 0'])assert.throws(()=>pathPoints(invalid));
});
// Federal Reserve accessible table, checked 12 October 2026; USD billions.
const dailyPurchases = [[37,0,37],[40,7.6,84.61],[40.01,3.61,128.23],[45.01,6.19,179.42],[75,14.42,268.84],[72.12,35.82,376.77],[73.83,30.17,480.77],[68.95,36.42,586.14],[70.95,39.88,696.97],[73.68,35.8,806.45],[71.5,41.04,918.99],[71.5,20.73,1011.22],[72.9,19.56,1103.68],[72.9,27.44,1204.02],[58.5,24.86,1287.38],[58.5,19.86,1365.74]];
test('each bar reproduces official daily Treasury and agency-MBS purchases', () => {
  for (const v of variants.filter(v=>v.kind==='01')) {
    const bars=inspect(v).nodes.filter(n=>tag(n)==='rect'&&number(n,'rx')===1);
    assert.equal(bars.length,32); const scale=(v.mobile?471:321)/120, bottom=v.mobile?810:575;
    for(const [i,row] of dailyPurchases.entries()) {
      const treasury=bars[i*2],mbs=bars[i*2+1];
      assert.equal(attrs(treasury).fill,'var(--color-signal)');assert.equal(attrs(mbs).fill,'var(--color-amber)');
      assert.ok(Math.abs(number(treasury,'height')-row[0]*scale)<=.011);assert.ok(Math.abs(number(mbs,'height')-row[1]*scale)<=.011);
      assert.ok(Math.abs(number(treasury,'y')-(bottom-row[0]*scale))<=.011);assert.ok(Math.abs(number(mbs,'y')-(bottom-(row[0]+row[1])*scale))<=.011);
    }
  }
});
test('closing each subpath restores its own origin before horizontal and vertical segments',()=>{
  assert.deepEqual(pathPoints('M 0,0 L 100,100 Z H 22 V 33 M 5,5 L 6,6 Z H 7'),[[0,0],[100,100],[22,0],[22,33],[5,5],[6,6],[7,5]]);
  assert.throws(()=>pathPoints('Z M 0 0'));assert.throws(()=>pathPoints('L 0 0 Z'));
});
test('capacity, transactions, return and cumulative APF cash transfers remain distinct',()=>{
  assert.equal(Math.round(19.3/65*1000)/10,29.7);assert.equal(Math.round((12.1+7.2)*10)/10,19.3);
  assert.equal(Math.round((123.9-16.2)*10)/10,107.7);assert.equal(Math.round((71.5+41.04)*100)/100,112.54);
  for(const {raw,lang} of articles){assert.ok(raw.includes(lang==='fr'?'ultérieurement relevée':'later increased'));assert.ok(raw.includes(lang==='fr'?'du résultat de l’intervention LDI':'from the LDI intervention'));assert.doesNotMatch(raw,/\b(?:deux|2) horloges|two clocks|—/iu);}
});
test('responsive styles keep mobile compositions, spacing and light-theme hatching visible', () => {
  for(const {raw} of articles){assert.ok(raw.includes('width:100%;height:auto'));assert.ok(raw.includes('@media(max-width:680px)'));assert.ok(raw.includes('margin:2.5rem auto 3rem'));assert.doesNotMatch(raw,/overflow:hidden|overflow: hidden/);}
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

test('bundled DejaVu subsets retain the complete canonical licence and stay small',()=>{const licence=read('public/fonts/debt-last-buyer/LICENSE.txt');assertFontLicenseReferences(licence,'dejavu');for(const w of [400,700])assert.ok(readFileSync(new URL('../public/fonts/debt-last-buyer/dejavu-sans-'+w+'.ttf',import.meta.url)).length<30000);});
