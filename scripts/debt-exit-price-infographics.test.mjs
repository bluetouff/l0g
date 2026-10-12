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
const kinds = ['01-profondeur', '02-prix-et-coupon', '03-empreinte-ldi', '04-adjudications', '05-cohortes', '06-sensibilite'];
const articles = ['fr', 'en'].map(lang => ({ lang, raw: read(`src/content/${lang === 'fr' ? 'posts' : 'posts-en'}/dette-etats-06-prix-sortie.mdx`) }));
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
  return svgs.map((svg, i) => { const kind = kinds[Math.floor(i / 2)], mobile = i % 2 === 1; return { lang, kind, mobile, name: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, prefix: `d6-${kind}-${lang}-${mobile ? 'm' : 'd'}`, svg }; });
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

// Ordered complete-field fingerprints of all supplied source SVGs after
// the finite semantic-paint mapping; only inter-element whitespace and
// the separately validated responsive root style are excluded.
const originalSignatures = {
  "01-profondeur-en-desktop": "651a18f7de33b90a2614242c15a8f216718a5128677db2b74bdd1951463f3ec2",
  "01-profondeur-en-mobile": "ebef0c11df94d5f6dc96e77af710e6867b53ad01af1ce88f8f2357dd6b9c806a",
  "01-profondeur-fr-desktop": "10a4654067f9b2e0163a80bd519b73d3558d3d0c55b7f4c8daff43c3e88dc2dd",
  "01-profondeur-fr-mobile": "f374cae3091577bcd2d7e2418906677a1b8c920791131a53d8e7cb2a237b4f4d",
  "02-prix-et-coupon-en-desktop": "ca66f3eda5d025ad19b96593db8c314f10fc30dd6c842849700e887b633c2e9c",
  "02-prix-et-coupon-en-mobile": "1367df0266809000b2f359995d7289e20c21bd4499359c93f881241fe73501b6",
  "02-prix-et-coupon-fr-desktop": "d3f87ab140341d5a3ec96f73346821ab514baa005689713775d67b84e306c943",
  "02-prix-et-coupon-fr-mobile": "aa94c523f15e508a61143dc4b6919c45f913a827e7f3d80ba910ae0fd6d762f7",
  "03-empreinte-ldi-en-desktop": "f16df5469288dd250d0b69d54deb35d256c5aea76cdce5af1a8139ec35f8ac1e",
  "03-empreinte-ldi-en-mobile": "3df3ad9872e8e8fec936ea338e3de8e328af4e2066dc9ea1099216741da72008",
  "03-empreinte-ldi-fr-desktop": "c32b4d6d16eb618f5c25fc783f941a9120fbac1c18e2b2a7df0213137819b9c5",
  "03-empreinte-ldi-fr-mobile": "7bf107d6c9853c6210ff171dcde87426f48f820975310e2deddcb9d2abee8fd3",
  "04-adjudications-en-desktop": "cda4a1d6c8c622bd13cfa79f1b9ab069ae64b330d853b34efd9aec20497c39e3",
  "04-adjudications-en-mobile": "c669c141f3f721213a2393ddbadf071652c5f6b75b52b3839e791e37a6330bc5",
  "04-adjudications-fr-desktop": "1e842f318aba6dc01288f34d54a0c487c57ac59df581032799a52af59ac61f76",
  "04-adjudications-fr-mobile": "a511810e8cca2bacdfce0ff83971b658fc868e221af66054449638a8b82a5978",
  "05-cohortes-en-desktop": "981a303e276cd790d7cd232c6d7a02799ed474d8c89688105a1c66878284df96",
  "05-cohortes-en-mobile": "8e3bbf60dc9a297e8ff03dd302b70fcc855c2397abc4a230cd6bf8113940044d",
  "05-cohortes-fr-desktop": "81101f52afe36b883f50f0b0d61a10d23dbe11d9b955544f131e48175194f28a",
  "05-cohortes-fr-mobile": "32dbd47a8743ce019cbd2789bc696243c827d4c41934b74aab0845b0c615694b",
  "06-sensibilite-en-desktop": "01bb54e6daf08008cde994e5387d6967411311a0eb07c9aa43d735054325e1fb",
  "06-sensibilite-en-mobile": "217f205df81ad5bb246bf953485319c117cd9126493c5fc91378ff01777a16a5",
  "06-sensibilite-fr-desktop": "7777984242578d2382d92dc55839202ee3580bcfbc1d5c07c1ba8a299eadabca",
  "06-sensibilite-fr-mobile": "772bdc4efd45cb4f31ae5e2b8e1f2acf4ca6c195711399bc91bf54f05e23a7ab"
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
  assert.ok(dimensions.every(Number.isFinite)); assert.equal(dimensions[2], v.mobile ? 640 : 1200); assert.ok(dimensions[3] > 900 && dimensions[3] <= 2000);
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
  for(const invalid of ['M 0 0 trailing','M 0 0 C 1 2 3 4','M 0','M NaN 0','M 1e999 0','M '+'.'.repeat(4096)+' 0','M '+'9'.repeat(65)+' 0'])assert.throws(()=>pathPoints(invalid));
});
test('order books, annual bond payments, auction scopes and refinancing cohorts reconcile', () => {
  const proceeds = (fills, prices) => fills.reduce((sum,q,i) => sum + q * prices[i], 0) / 100;
  assert.equal(proceeds([20,20,0,0],[100,99.8,99.5,99.2]),39.96);
  assert.equal(proceeds([5,5,10,20],[100,99.8,99.5,99.2]),39.78);
  assert.ok(Math.abs((39.96-39.78)*1e6-180000)<1e-8);
  const price = rate => Array.from({length:10},(_,i)=>4/(1+rate)**(i+1)).reduce((a,b)=>a+b,0)+100/(1+rate)**10;
  assert.ok(Math.abs(price(.04)-100)<1e-10);assert.ok(Math.abs(price(.05)-92.27826507081517)<1e-10);
  assert.equal((39_000_000_000n * (102_513731n-101_490492n))/100_000000n,399_063210n);
  assert.equal(Math.round(100947581200/39000114800*100)/100,2.59);
  assert.equal(Math.round(103943606800/39000018800*100)/100,2.67);
  assert.ok(Math.abs((4.435-4.31)*100-12.5)<1e-10);
  const extra = Array.from({length:10},(_,i)=>100*(i+1));assert.equal(extra[4],500);assert.equal(extra[9],1000);assert.equal(extra.reduce((a,b)=>a+b,0),5500);
  assert.equal(100*10,1000);
  for(const [short,long,total] of [[1.3,1.9,3.2],[2,21.5,23.5],[2,31.5,33.5]])assert.ok(Math.abs(short+long-total)<1e-12);
  for(const {raw,lang} of articles){
    assert.ok(raw.includes(lang==='fr'?'entièrement fictif':'entirely hypothetical'));
    assert.ok(raw.includes(lang==='fr'?'pas une estimation des dommages':'not an estimate of damage'));
    assert.ok(raw.includes(lang==='fr'?'pas d’un cumul':'not a cumulative amount'));
    assert.doesNotMatch(raw,/\b(?:deux|2) horloges|two clocks|three clocks|—/iu);
  }
});
test('every plotted bond-price point reproduces annual discounting in both layouts', () => {
  for (const v of variants.filter(v => v.kind === '02-prix-et-coupon')) {
    const all = inspect(v).nodes;
    const curve = all.find(n => tag(n) === 'path' && attrs(n).stroke === 'var(--color-topic-blue)');
    const points = pathPoints(attrs(curve).d);
    assert.equal(points.length, 101);
    const top = number(all.find(n => tag(n) === 'text' && textOf(n) === '120'), 'y') - 7;
    const chartHeight = v.mobile ? 330 : 320;
    const left = points[0][0], right = points.at(-1)[0];
    for (const [i, [x, y]] of points.entries()) {
      const rate = .02 + i * .0005;
      const price = Array.from({ length: 10 }, (_, t) => 4 / (1 + rate) ** (t + 1)).reduce((a, b) => a + b, 0) + 100 / (1 + rate) ** 10;
      assert.ok(Math.abs(x - (left + i / 100 * (right - left))) <= .0051);
      assert.ok(Math.abs(y - (top + chartHeight - (price - 75) / 45 * chartHeight)) <= .0051);
    }
  }
});
test('cohort grids distinguish annual payments from cumulative totals without interpolating observations', () => {
  for (const v of variants.filter(v => v.kind === '05-cohortes')) {
    const size = v.mobile ? 31 : 29;
    const cells = inspect(v).nodes.filter(n => tag(n) === 'rect' && number(n, 'width') === size && number(n, 'height') === size);
    assert.equal(cells.filter(n => attrs(n).fill === 'var(--color-signal)').length, 10);
    assert.equal(cells.filter(n => attrs(n).fill === 'var(--color-amber)').length, 55);
    assert.equal(cells.filter(n => attrs(n).fill === 'var(--color-surface)').length, 45);
  }
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
