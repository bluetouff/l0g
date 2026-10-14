import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import { parse } from 'parse5';
import opentype from '@shuding/opentype.js';
import postcss from 'postcss';
import { aiWagesSvg, AI_WAGES_KINDS } from '../src/lib/aiWagesFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Derived independently from all 24 supplied exports/svg assets. The raw hash
// preserves every byte; the HTML-tree hash also covers all native fields and
// text after the browser's XML attribute/entity parsing. No implementation
// output was used to derive these expectations.
const originals = {
  "options-fr-desktop": {
    "rawHash": "414289e235f68f175a0779190b93ee7a741c4bab463dc45f5540a03257253b38",
    "domHash": "f22050be302e29d83e4ae4b2e7436dd927bf585f4c2c03281ea0516fd67d7085",
    "viewBox": "0 0 960 962"
  },
  "options-fr-mobile": {
    "rawHash": "bc4970079a233772257014f277895b2415b1928ddf69c5c3cf7f729a2ab414a5",
    "domHash": "8b5294637cf159f28c7cfbcda0e9184a67f3a235365bcfefa17ce574c14bfd89",
    "viewBox": "0 0 400 1152"
  },
  "entry-fr-desktop": {
    "rawHash": "9cc52141c2e43d8f9b507128ec29195d510ce6188567f79c98f3a4d72a7c9258",
    "domHash": "09cc998e22b203467883ce81d47bb61910f7245190f2a581bdc55e2378b279e3",
    "viewBox": "0 0 960 909"
  },
  "entry-fr-mobile": {
    "rawHash": "21dc484ff578592d36a70361c968a1daf1d47669b5edffc9d8cf891449d98a14",
    "domHash": "bdda8721b66ddd3820ba6afe40c65322b786261a8ac223e67fa702d900cf015c",
    "viewBox": "0 0 400 1175"
  },
  "expectations-fr-desktop": {
    "rawHash": "41e1ab596c53aae5578a646d74a3f90eece5e127b54ea66415178b4942883d37",
    "domHash": "f3041477525d31a12489cb802af8f231f078e602805385af6ddff696b905c864",
    "viewBox": "0 0 960 894"
  },
  "expectations-fr-mobile": {
    "rawHash": "4fbbe1ae1eea5f20bbe81167560c1425718e14cd18d0240b4a3cf91105256323",
    "domHash": "acec12f7b091ff57e1708353696cca6b5df9d7e290f6dfdd0c82c60ec13244b8",
    "viewBox": "0 0 400 1031"
  },
  "sharing-fr-desktop": {
    "rawHash": "833f03b38fd7102c07d20834b228d4f3c1afd06810d352105fe094f13ef13277",
    "domHash": "ce74b8a1503c59e0d013c9013165158d1f3cc17a69756b2fadc7fdbbe576a4c4",
    "viewBox": "0 0 960 833"
  },
  "sharing-fr-mobile": {
    "rawHash": "a774b04b5830a002fa68db2df00fba34145ea13b8d4e3cad0ba5aad09bf8553e",
    "domHash": "b2f77faf3924bf68b972e63b993708c60f6c37154a88c444d3561dd4c6fa9cd4",
    "viewBox": "0 0 400 1098"
  },
  "contracts-fr-desktop": {
    "rawHash": "951f0bed9a944db7c4c6452e0c79dbb2f4aa8e9d846639f4fb5905fc24a60224",
    "domHash": "fabd94ace631b36b9ea785e96215f7220cb43d34baab7edc21c1c3aabfccaf67",
    "viewBox": "0 0 960 849"
  },
  "contracts-fr-mobile": {
    "rawHash": "a096a96922b747f059d090b618a40291bd63f9a6256b81904770c796a8f31da8",
    "domHash": "fed34e96955c0b3b91554ff1cb866c73e90175c53b1941d6793795f8c08d144d",
    "viewBox": "0 0 400 1188"
  },
  "macro-fr-desktop": {
    "rawHash": "86a60078a8b787b4ad9b63ec0c21f217882089ece32d961a760715ac253a1b52",
    "domHash": "590bb4768093eda6fd5dcfb6c9300c1576192d3995937e0d4ae7882c7e9d9437",
    "viewBox": "0 0 960 1045"
  },
  "macro-fr-mobile": {
    "rawHash": "1a08ca1ecc34300ca5301eccf2c6695dfed6e956c92f73f31823512ed8c8dd37",
    "domHash": "9f7890440ce44c5141badcb9a2c704c32bd2e9ad87da89813bf476f3bcb733f5",
    "viewBox": "0 0 400 1393"
  },
  "options-en-desktop": {
    "rawHash": "aa34212263813974ba941ae07a97f6b9d564225c5886391d2a731c70ccfedccb",
    "domHash": "b405828695426c16e2192f82b4a31c200d608298d4757510abe05ba008daae0b",
    "viewBox": "0 0 960 962"
  },
  "options-en-mobile": {
    "rawHash": "0fbc4ae994c4d55ee4dff8fc660c7cacf8da04a20182cd1b149f8f7ff91a0c0b",
    "domHash": "7b0de180c49ddcdda3b915e8499a69f47afadb7da69bb28cd42e49b813fc0402",
    "viewBox": "0 0 400 1125"
  },
  "entry-en-desktop": {
    "rawHash": "e65351a5ecc3af42044234dcc1703a5053d25d2e35af68b1a0920e5abd4defe8",
    "domHash": "0f4bfcbb7b50cbfca808c5fb042561eca16d3beb5c67ec55d8e8f52ad8378478",
    "viewBox": "0 0 960 881"
  },
  "entry-en-mobile": {
    "rawHash": "bfdfe16c578fa24c4f014709d5d584926d7648607a9e8315ee6c32941da0d100",
    "domHash": "6269e27b0fb57771ec89718a1f68aa1398c1b3910d8281009f9fbae48a1e6332",
    "viewBox": "0 0 400 1175"
  },
  "expectations-en-desktop": {
    "rawHash": "641137142d5d62674840354481a6669c7a7c2613e4e4dd3539e4972e2fba0374",
    "domHash": "cac1fe2004c660b39b7ae4922f8cf189e7f20a8c32df40770ef32974731ba89d",
    "viewBox": "0 0 960 851"
  },
  "expectations-en-mobile": {
    "rawHash": "82df029ebb00629667be754feddc51415ac8ded15ded9c4e017d65d19c21f1ad",
    "domHash": "a03b3750a743d7c05d23aa82a35342e7ac6aa9c45eaa6e535b034631c251c0bc",
    "viewBox": "0 0 400 995"
  },
  "sharing-en-desktop": {
    "rawHash": "b80537d94fa764f1756d376c12a8dde7cfaa751e8e12ad8484d88dbef0ad7f88",
    "domHash": "d2e19a2b2fb8a89bc57b1352f827d4e23cc2ff47311a654e068a85ba07c3d417",
    "viewBox": "0 0 960 833"
  },
  "sharing-en-mobile": {
    "rawHash": "cf7e6fb0034655607f646cb8a0c0701ee615bff0d02175ccf9996e1dd439341b",
    "domHash": "415aa85207d643524876fb4bb63de2dc44d7f282acb97327d9f78ab65710231d",
    "viewBox": "0 0 400 1070"
  },
  "contracts-en-desktop": {
    "rawHash": "414f561a52d2fb3ce5e01ad55c21241d9280f6e5194bfbf3058f0c818f97b9ab",
    "domHash": "37187fd4dad237a0e9551f5ef78572b59af6629973dedc8586d57b29666eea19",
    "viewBox": "0 0 960 849"
  },
  "contracts-en-mobile": {
    "rawHash": "683811e9b6a1cf0ece93c201d35fcbef23316c5b4ee721e3d1479b49e4aa4f69",
    "domHash": "72b4e6ef117a416223c6bf388d5dc0a3a881829cea330ca0fc8bf7bded558feb",
    "viewBox": "0 0 400 1224"
  },
  "macro-en-desktop": {
    "rawHash": "66fd6e0e8b6396241ae559b4cb03661d47b776adaa8a9419bdbb8ccba2b5ad72",
    "domHash": "d7852562d22f3d26ac1a5fee00210fa7a5ae8b4ef6a9a4bc1baf121e5a7cee08",
    "viewBox": "0 0 960 1045"
  },
  "macro-en-mobile": {
    "rawHash": "a008adeeb9115b3df5d11913040e69fcd8e6e5cc6be0d67d211b7577374f5702",
    "domHash": "eb75403fd697a5a523c30e76bab0e16a10fee546c2e22b76f7ee8210dcec9581",
    "viewBox": "0 0 400 1393"
  }
};
const kinds = ['options', 'entry', 'expectations', 'sharing', 'contracts', 'macro'];
const figureSources = { options: [1, 2, 3], entry: [5], expectations: [8], sharing: [3], contracts: [11], macro: [1, 9, 10, 12, 13] };
const variants = ['fr', 'en'].flatMap(lang => kinds.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, key: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: aiWagesSvg(lang, kind, mobile) }))));
const articles = ['fr', 'en'].map(lang => ({ lang, raw: read(`src/content/${lang === 'fr' ? 'posts/ia-salaires-pouvoir-partir' : 'posts-en/ai-wages-power-walk-away'}.mdx`) }));
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const builder = new XMLBuilder({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '' });
const tag = n => Object.keys(n).find(k => k !== ':@');
const attrs = n => n[':@'] ?? {};
const children = n => n[tag(n)] ?? [];
const xmlNodes = n => tag(n) === '#text' ? [] : [n, ...children(n).flatMap(xmlNodes)];
const xmlText = n => tag(n) === '#text' ? n['#text'] : children(n).map(xmlText).join('');
const htmlNodes = n => [n, ...(n.childNodes ?? []).flatMap(htmlNodes)];
const htmlAttr = (n, k) => n.attrs?.find(a => a.name === k)?.value;
const htmlText = n => n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(htmlText).join('');
const canonical = n => n.nodeName === '#text' ? ['#text', n.value] : [n.tagName, (n.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), (n.childNodes ?? []).filter(c => c.nodeName !== '#text' || c.value.trim() || ['text', 'title', 'desc', 'metadata'].includes(n.tagName)).map(canonical)];
const domHash = raw => {
  const roots = htmlNodes(parse(raw)).filter(n => n.tagName === 'svg');
  assert.equal(roots.length, 1);
  return digest(JSON.stringify(canonical(roots[0])));
};
const allowed = Object.fromEntries(Object.entries({
  svg: 'xmlns viewBox role aria-labelledby style data-ai-wages-kind',
  title: 'id', desc: 'id', metadata: '', g: 'data-label data-bounds',
  rect: 'x y width height rx fill stroke stroke-width stroke-dasharray',
  text: 'x y fill font-family font-size font-weight text-anchor',
  line: 'x1 y1 x2 y2 stroke stroke-width stroke-dasharray',
  circle: 'cx cy r fill stroke stroke-width',
  path: 'd fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray',
}).map(([k, v]) => [k, new Set(v ? v.split(' ') : [])]));
const paints = new Set(['none',
  'var(--color-accent, #ff4d87)', 'var(--color-amber, #f5b13d)',
  'var(--color-ink, #0c0d10)', 'var(--color-muted, #8b909b)',
  'var(--color-paper, #e7e9ee)', 'var(--color-signal, #5eead4)',
  'var(--color-surface, #121419)', 'var(--color-surface-2, #171a20)',
  'var(--color-topic-blue, #7aa2f7)',
  'var(--color-line-strong, rgba(255,255,255,0.20))',
]);
const numeric = new Set('x y x1 y1 x2 y2 width height rx cx cy r font-size stroke-width'.split(' '));
function number(value) {
  assert.equal(typeof value, 'string');
  assert.ok(value.length > 0 && value.length <= 32);
  assert.match(value, /^-?(?:\d{1,4}(?:\.\d{1,6})?|\.\d{1,6})$/u);
  const n = Number(value); assert.ok(Number.isFinite(n) && Math.abs(n) <= 10000);
  return n;
}
const value = (n, k, fallback = '0') => number(attrs(n)[k] ?? fallback);
// Complete, bounded token walk for the supplied absolute M/L/H/V/Z paths.
// A command must provide exactly its required coordinates. Unknown commands,
// exponents, repeated punctuation and trailing input fail before geometry use.
function pathPoints(raw) {
  assert.equal(typeof raw, 'string'); assert.ok(raw.length > 0 && raw.length <= 8192);
  const token = /[MLHVZ]|-?(?:\d{1,4}(?:\.\d{1,6})?|\.\d{1,6})/uy;
  const tokens = []; let offset = 0;
  while (offset < raw.length) {
    if (/\s/u.test(raw[offset])) { offset++; continue; }
    token.lastIndex = offset; const match = token.exec(raw); assert.ok(match, 'Complete path token');
    tokens.push(match[0]); assert.ok(tokens.length <= 2048); offset = token.lastIndex;
  }
  assert.equal(tokens[0], 'M'); const points = []; let i = 0, current, origin;
  while (i < tokens.length) {
    const command = tokens[i++]; assert.ok(['M', 'L', 'H', 'V', 'Z'].includes(command));
    if (command === 'Z') { assert.ok(origin); current = [...origin]; }
    else if (command === 'M' || command === 'L') {
      if (command === 'L') assert.ok(current);
      current = [number(tokens[i++]), number(tokens[i++])];
      if (command === 'M') origin = [...current];
    } else {
      assert.ok(current); current = [...current]; current[command === 'H' ? 0 : 1] = number(tokens[i++]);
    }
    points.push([...current]);
  }
  assert.ok(points.length); return points;
}
function inspect(v) {
  assert.ok(v.svg.length > 100 && v.svg.length < 30000);
  assert.doesNotMatch(v.svg, /<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;)/u);
  assert.doesNotMatch(v.svg, /\b(?:__proto__|constructor|prototype)\s*=/u);
  assert.equal(XMLValidator.validate(v.svg), true);
  const roots = parser.parse(v.svg); assert.equal(roots.length, 1);
  const root = roots[0]; assert.equal(tag(root), 'svg');
  const prefix = `aiw-${v.kind}-${v.lang}-${v.mobile ? 'm' : 'd'}`;
  assert.deepEqual(attrs(root), { xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[v.key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto', 'data-ai-wages-kind': v.kind });
  const nodes = xmlNodes(root); assert.ok(nodes.length < 512);
  const ids = [], labels = [];
  for (const n of nodes) {
    assert.ok(Object.hasOwn(allowed, tag(n)), `Passive tag ${tag(n)}`);
    for (const [k, val] of Object.entries(attrs(n))) {
      assert.ok(allowed[tag(n)].has(k), `Known field ${tag(n)}.${k}`);
      assert.equal(typeof val, 'string'); assert.ok(val.length <= 8192);
      if (numeric.has(k)) {
        const num = number(val);
        if (['width', 'height', 'rx', 'r', 'stroke-width'].includes(k)) assert.ok(num >= 0);
      }
      if (k === 'fill' || k === 'stroke') assert.ok(paints.has(val), `Semantic paint ${val}`);
      if (k === 'id') { assert.ok([`${prefix}-title`, `${prefix}-desc`].includes(val)); ids.push(val); }
      if (k === 'data-label') { assert.match(val, /^t[1-9]\d?$/u); labels.push(val); }
      if (k === 'data-bounds') { const b = val.split(' '); assert.equal(b.length, 4); const nums = b.map(number); assert.ok(nums[2] > 0 && nums[3] > 0); }
      if (k === 'font-family') assert.equal(val, 'DejaVu Sans, Arial, sans-serif');
      if (k === 'font-weight') assert.ok(['400', '700'].includes(val));
      if (k === 'font-size') assert.ok(number(val) >= 14 && number(val) <= 44);
      if (k === 'text-anchor') assert.ok(['start', 'middle'].includes(val));
      if (k === 'stroke-dasharray') assert.ok(['5 5', '6 6', '7 5'].includes(val));
      if (k === 'stroke-linecap' || k === 'stroke-linejoin') assert.equal(val, 'round');
      if (k === 'd') pathPoints(val);
    }
    if (tag(n) === 'g') { assert.ok(attrs(n)['data-label']); assert.ok(attrs(n)['data-bounds']); assert.ok(children(n).every(c => tag(c) === 'text')); }
  }
  assert.deepEqual(ids.sort(), [`${prefix}-desc`, `${prefix}-title`]);
  assert.equal(new Set(labels).size, labels.length); assert.ok(labels.length > 5);
  for (const type of ['title', 'desc', 'metadata']) { const found = nodes.filter(n => tag(n) === type); assert.equal(found.length, 1); assert.ok(xmlText(found[0]).trim()); }
  const metadata = JSON.parse(xmlText(nodes.find(n => tag(n) === 'metadata')));
  assert.deepEqual(Object.keys(metadata).sort(), ['asOf', 'figure', 'lang', 'layout', 'sources', 'status']);
  assert.deepEqual([metadata.asOf, metadata.figure, metadata.lang, metadata.layout, metadata.sources], ['2026-10-14', v.kind, v.lang, v.mobile ? 'mobile' : 'desktop', figureSources[v.kind]]);
  assert.equal(typeof metadata.status, 'string'); assert.ok(metadata.status.length > 0 && metadata.status.length < 500);
  const [, , width, height] = attrs(root).viewBox.split(' ').map(number);
  return { root, nodes, width, height };
}
function faithful(v) {
  inspect(v); assert.equal(digest(v.svg), originals[v.key].rawHash, `${v.key}: complete original SVG`);
  assert.equal(domHash(v.svg), originals[v.key].domHash, `${v.key}: complete browser SVG tree`);
}
const mutate = (v, change) => { const root = parser.parse(v.svg)[0]; change(root, xmlNodes(root)); return { ...v, svg: builder.build([root]) }; };
const fontFrom = file => {
  const bytes = readFileSync(new URL(`../${file}`, import.meta.url));
  return opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
};
const fonts = Object.fromEntries([400, 700].map(w => [w, fontFrom(`public/fonts/ai-wages/dejavu-sans-${w}.ttf`)]));
const within = (a, b, tolerance = 0) => a.x >= b.x - tolerance && a.y >= b.y - tolerance && a.right <= b.right + tolerance && a.bottom <= b.bottom + tolerance;
const overlaps = (a, b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
const pointsBox = points => { assert.ok(points.length && points.flat().every(Number.isFinite)); return { x: Math.min(...points.map(p => p[0])), y: Math.min(...points.map(p => p[1])), right: Math.max(...points.map(p => p[0])), bottom: Math.max(...points.map(p => p[1])) }; };
function shapeBox(n) {
  if (tag(n) === 'rect') return { x: value(n, 'x'), y: value(n, 'y'), right: value(n, 'x') + value(n, 'width'), bottom: value(n, 'y') + value(n, 'height') };
  if (tag(n) === 'circle') return { x: value(n, 'cx') - value(n, 'r'), y: value(n, 'cy') - value(n, 'r'), right: value(n, 'cx') + value(n, 'r'), bottom: value(n, 'cy') + value(n, 'r') };
  if (tag(n) === 'line') return pointsBox([[value(n, 'x1'), value(n, 'y1')], [value(n, 'x2'), value(n, 'y2')]]);
  if (tag(n) === 'path') return pointsBox(pathPoints(attrs(n).d));
}
function textBox(n) {
  const label = xmlText(n), font = fonts[attrs(n)['font-weight']], size = value(n, 'font-size');
  for (const c of label) assert.ok(font.charToGlyphIndex(c) > 0, `Glyph U+${c.codePointAt(0).toString(16)}`);
  const x = value(n, 'x') - (attrs(n)['text-anchor'] === 'middle' ? font.getAdvanceWidth(label, size) / 2 : 0);
  // Include quadratic/cubic extrema, rather than treating control points as
  // visible ink or depending on an API absent from the installed font library.
  const points = []; let current, origin;
  const curve = (p, t) => p.length === 3
    ? [0, 1].map(k => (1 - t) ** 2 * p[0][k] + 2 * (1 - t) * t * p[1][k] + t ** 2 * p[2][k])
    : [0, 1].map(k => (1 - t) ** 3 * p[0][k] + 3 * (1 - t) ** 2 * t * p[1][k] + 3 * (1 - t) * t ** 2 * p[2][k] + t ** 3 * p[3][k]);
  for (const command of font.getPath(label, x, value(n, 'y'), size).commands) {
    assert.ok(['M', 'L', 'Q', 'C', 'Z'].includes(command.type));
    if (command.type === 'Z') { assert.ok(origin); current = [...origin]; points.push(current); continue; }
    const end = [command.x, command.y]; assert.ok(end.every(Number.isFinite));
    if (command.type === 'M') origin = [...end];
    if (command.type === 'Q' || command.type === 'C') {
      assert.ok(current); const p = [current, [command.x1, command.y1], ...(command.type === 'C' ? [[command.x2, command.y2]] : []), end];
      for (const k of [0, 1]) {
        let roots;
        if (p.length === 3) { const denominator = p[0][k] - 2 * p[1][k] + p[2][k]; roots = denominator === 0 ? [] : [(p[0][k] - p[1][k]) / denominator]; }
        else {
          const a = -p[0][k] + 3 * p[1][k] - 3 * p[2][k] + p[3][k], b = 2 * (p[0][k] - 2 * p[1][k] + p[2][k]), c = p[1][k] - p[0][k], discriminant = b * b - 4 * a * c;
          roots = Math.abs(a) < 1e-12 ? (Math.abs(b) < 1e-12 ? [] : [-c / b]) : discriminant < 0 ? [] : [(-b - Math.sqrt(discriminant)) / (2 * a), (-b + Math.sqrt(discriminant)) / (2 * a)];
        }
        for (const t of roots) if (t > 0 && t < 1) points.push(curve(p, t));
      }
    }
    points.push(end); current = end;
  }
  return { ...pointsBox(points), label };
}
function geometry(v) {
  const { root, nodes, width, height } = inspect(v), canvas = { x: 0, y: 0, right: width, bottom: height };
  const visible = children(root).filter(n => ['rect', 'circle', 'line', 'path', 'g'].includes(tag(n)));
  const panels = visible.filter(n => tag(n) === 'rect' && value(n, 'rx') >= 9 && value(n, 'x') > 1 && value(n, 'width') >= 100 && value(n, 'height') >= 40).map(shapeBox);
  const labels = [];
  for (const n of nodes.filter(n => ['rect', 'circle', 'line', 'path'].includes(tag(n)))) {
    const b = shapeBox(n), stroke = attrs(n).stroke ? value(n, 'stroke-width', '1') / 2 : 0;
    assert.ok(within({ x: b.x - stroke, y: b.y - stroke, right: b.right + stroke, bottom: b.bottom + stroke }, canvas, .01), `${v.key}: shape outside viewBox`);
  }
  for (const group of nodes.filter(n => tag(n) === 'g')) {
    const [x, y, w, h] = attrs(group)['data-bounds'].split(' ').map(number), bounds = { x, y, right: x + w, bottom: y + h };
    assert.ok(within(bounds, canvas), `${v.key}: data-bounds outside viewBox`);
    for (const n of children(group)) {
      const b = textBox(n); assert.ok(within(b, bounds, .1), `${v.key}: text outside declared bounds: ${b.label}`);
      assert.ok(within(b, canvas), `${v.key}: text outside viewBox: ${b.label}`);
      const centre = { x: (b.x + b.right) / 2, y: (b.y + b.bottom) / 2, right: (b.x + b.right) / 2, bottom: (b.y + b.bottom) / 2 };
      const panel = panels.filter(p => within(centre, p)).at(-1);
      if (panel) assert.ok(within(b, panel, .1), `${v.key}: text outside panel: ${b.label}`);
      for (const prior of labels) assert.ok(!overlaps(b, prior), `${v.key}: labels overlap: ${b.label} / ${prior.label}`);
      labels.push(b);
    }
  }
}
const sourceUrls = [
  "https://www.ecb.europa.eu/press/key/date/2026/html/ecb.sp261013~9db9bf4fd6.en.html",
  "https://www.bde.es/f/webbe/SES/Secciones/Publicaciones/PublicacionesSeriadas/DocumentosTrabajo/25/Files/dt2536e.pdf",
  "https://eminakamura.com/papers/Commoditization.pdf",
  "https://doi.org/10.1093/qje/qjae044",
  "https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf",
  "https://www.insee.fr/fr/statistiques/8907419",
  "https://www.rfberlin.com/research-insights/still-waters-rapid-currents/",
  "https://www.ecb.europa.eu/press/economic-bulletin/focus/2026/html/ecb.ebbox202602_06~c9f485c478.en.html",
  "https://www.bis.org/publications/working-paper-1325-ai-adoption-productivity-and-employment-evidence-european-firms",
  "https://www.ecb.europa.eu/press/blog/date/2026/html/ecb.blog20260826~e1c1a89999.en.html",
  "https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.pr260916~7bc58ebef4.en.html",
  "https://www.ecb.europa.eu/press/blog/date/2026/html/ecb.blog20261006~35bf3c24cb.en.html",
  "https://www.oecd.org/en/publications/2023/07/oecd-employment-outlook-2023_904bcef3/full-report/social-dialogue-and-collective-bargaining-in-the-age-of-artificial-intelligence_5828691a.html",
  "https://www.ecb.europa.eu/press/blog/date/2026/html/ecb.blog20260304~d9e34fc95f.en.html",
  "https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/3945.pdf",
  "https://www.oecd.org/en/data/indicators/employee-compensation-by-activity.html",
  "https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/3278.pdf"
];
const sourceTitles = {
  "fr": [
    "The AI opportunity for Europe",
    "Robot adoption and inflation dynamics",
    "The Commoditization of Labor",
    "Generative AI at Work",
    "Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence",
    "Avec l’essor de l’intelligence artificielle générative, l’investissement numérique tire davantage la croissance aux États-Unis qu’en France, tandis que l’emploi recule dans les activités informatiques des deux côtés de l’Atlantique",
    "Still Waters, Rapid Currents",
    "Adopting and investing in AI: evidence from euro area firms in the SAFE",
    "AI adoption, productivity and employment: evidence from European firms",
    "AI adoption and the productivity promise: what workers report",
    "ECB wage tracker at 2.7% in H1 2027, pointing to a modest uptick in negotiated wage growth",
    "Funding the AI revolution: evidence from euro area sectors",
    "Social dialogue and collective bargaining in the age of artificial intelligence",
    "Artificial Intelligence: friend or foe for hiring in Europe today?",
    "Eurostat : valeur ajoutée",
    "OCDE : rémunération des salariés",
    "Eurostat : excédent brut d’exploitation"
  ],
  "en": [
    "The AI opportunity for Europe",
    "Robot adoption and inflation dynamics",
    "The Commoditization of Labor",
    "Generative AI at Work",
    "Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence",
    "Avec l’essor de l’intelligence artificielle générative, l’investissement numérique tire davantage la croissance aux États-Unis qu’en France, tandis que l’emploi recule dans les activités informatiques des deux côtés de l’Atlantique",
    "Still Waters, Rapid Currents",
    "Adopting and investing in AI: evidence from euro area firms in the SAFE",
    "AI adoption, productivity and employment: evidence from European firms",
    "AI adoption and the productivity promise: what workers report",
    "ECB wage tracker at 2.7% in H1 2027, pointing to a modest uptick in negotiated wage growth",
    "Funding the AI revolution: evidence from euro area sectors",
    "Social dialogue and collective bargaining in the age of artificial intelligence",
    "Artificial Intelligence: friend or foe for hiring in Europe today?",
    "Eurostat: value added",
    "OECD: employee compensation",
    "Eurostat: gross operating surplus"
  ]
};
const supplemental = {
  "fr": {
    "4": [
      [
        "https://danielle.li/assets/docs/GenerativeAIatWork.pdf",
        "texte intégral hébergé par Danielle Li"
      ]
    ],
    "5": [
      [
        "https://digitaleconomy.stanford.edu/news/canariesaug26/",
        "Annonce de la révision."
      ]
    ]
  },
  "en": {
    "4": [
      [
        "https://danielle.li/assets/docs/GenerativeAIatWork.pdf",
        "full paper hosted by Danielle Li"
      ]
    ],
    "5": [
      [
        "https://digitaleconomy.stanford.edu/news/canariesaug26/",
        "Revision announcement."
      ]
    ]
  }
};
function checkSources(raw, lang) {
  assert.equal(typeof raw, 'string'); assert.ok(raw.length < 200000);
  const all = htmlNodes(parse(raw));
  const bibliographies = all.filter(n => n.tagName === 'ol' && htmlAttr(n, 'class') === 'sources-list'); assert.equal(bibliographies.length, 1);
  const sections = htmlNodes(bibliographies[0]).filter(n => n.tagName === 'li');
  assert.deepEqual(sections.map(n => htmlAttr(n, 'id')), sourceUrls.map((_, i) => `source-${i + 1}`));
  for (const [i, section] of sections.entries()) {
    const expected = [[sourceUrls[i], sourceTitles[lang][i], undefined, undefined], ...(supplemental[lang][i + 1] ?? []).map(([url, title]) => [url, title, undefined, undefined])];
    const links = htmlNodes(section).filter(n => n.tagName === 'a');
    assert.deepEqual(links.map(n => [htmlAttr(n, 'href'), htmlText(n), htmlAttr(n, 'target'), htmlAttr(n, 'rel')]), expected, `Complete source-${i + 1} fields`);
    for (const link of links) assert.deepEqual(link.attrs.map(a => a.name), ['href'], 'Only controlled native link fields');
    assert.ok(all.some(n => n.tagName === 'a' && htmlAttr(n, 'href') === `#source-${i + 1}`), `Source ${i + 1} cited`);
  }
  const ids = all.map(n => htmlAttr(n, 'id')).filter(Boolean); assert.equal(new Set(ids).size, ids.length);
}

test('AI wages variant selection is frozen, complete and rejects prototypes or coercion', () => {
  assert.deepEqual(AI_WAGES_KINDS, kinds); assert.ok(Object.isFrozen(AI_WAGES_KINDS)); assert.equal(variants.length, 24);
  for (const lang of ['', 'FR', '__proto__', 'constructor', {}, null, ['fr']]) assert.throws(() => aiWagesSvg(lang, 'options', false), TypeError);
  for (const kind of ['', '__proto__', 'constructor', 'prototype', {}, null, ['options']]) assert.throws(() => aiWagesSvg('fr', kind, false), TypeError);
  for (const mobile of [0, 1, '', 'false', null, new Boolean(false), {}, []]) assert.throws(() => aiWagesSvg('fr', 'options', mobile), TypeError);
  assert.equal(aiWagesSvg('fr', 'options'), aiWagesSvg('fr', 'options', false));
});
test('24 original SVGs retain every byte, native XML attribute, inert metadata and text', () => { for (const v of variants) faithful(v); });
test('all original shapes and font glyphs remain in viewBox, declared bounds and panels', () => { for (const v of variants) geometry(v); });
test('geometry checks reject overflow, false label bounds and overlapping ink', () => {
  const v = variants[0];
  for (const change of [
    (_, ns) => { attrs(ns.find(n => tag(n) === 'rect')).x = '9999'; },
    (_, ns) => { attrs(ns.find(n => tag(n) === 'text')).x = '-10'; },
    (_, ns) => { attrs(ns.find(n => tag(n) === 'g'))['data-bounds'] = '0 0 1 1'; },
    (_, ns) => { const group = ns.find(n => tag(n) === 'g'); group.g.push(JSON.parse(JSON.stringify(group.g[0]))); },
  ]) assert.throws(() => geometry(mutate(v, change)));
});
test('complete fingerprints detect geometry, text, metadata, palette and child-order mutations', () => {
  const v = variants[0];
  for (const change of [(_, ns) => { attrs(ns.find(n => tag(n) === 'text')).x = '0'; }, (_, ns) => { attrs(ns.find(n => tag(n) === 'rect')).fill = 'var(--color-surface, #121419)'; }, (_, ns) => { ns.find(n => tag(n) === 'title').title = [{ '#text': 'Changed' }]; }, (_, ns) => { ns.find(n => tag(n) === 'metadata').metadata = [{ '#text': '{}' }]; }, root => { root.svg.reverse(); }]) assert.throws(() => faithful(mutate(v, change)));
});
test('passive SVG validation rejects active markup, entities, URL paints, prototypes and malformed fields', () => {
  const v = variants[0];
  for (const type of ['script', 'foreignObject', 'image', 'use', 'a', 'style', 'animate', 'filter']) assert.throws(() => inspect(mutate(v, root => { root.svg.push({ [type]: [] }); })));
  for (const [field, val] of [['onload', 'alert(1)'], ['href', 'https://example.org/'], ['xlink:href', 'javascript:alert(1)'], ['constructor', 'x'], ['prototype', 'x'], ['transform', 'translate(0 0)'], ['style', 'fill:red'], ['font-size', 'Infinity'], ['x', '1e999'], ['x', '10001']]) assert.throws(() => inspect(mutate(v, (_, ns) => { attrs(ns.find(n => tag(n) === 'text'))[field] = val; })));
  for (const paint of ['url(#x)', 'url(https://example.org/x)', 'var(--color-ink, red)', '#0c0d10', 'red']) assert.throws(() => inspect(mutate(v, (_, ns) => { attrs(ns.find(n => tag(n) === 'rect')).fill = paint; })));
  assert.throws(() => inspect(mutate(v, (_, ns) => { attrs(ns.find(n => tag(n) === 'rect')).width = '-1'; })));
  for (const raw of ['<!DOCTYPE svg><svg/>', '<?xml version="1.0"?><svg/>', '<svg>&external;</svg>', '<svg>&#65;</svg>', '<svg><text></svg>', v.svg.replace('<text ', '<text __proto__="x" ')]) assert.throws(() => inspect({ ...v, svg: raw }));
});
test('complete M/L/H/V/Z parsing rejects malformed input and keeps adversarial work bounded', () => {
  assert.deepEqual(pathPoints('M0 0 H10 V20 L30 40 Z M5 6 L7 8'), [[0, 0], [10, 0], [10, 20], [30, 40], [0, 0], [5, 6], [7, 8]]);
  const bad = ['L0 0', 'M0', 'M0 0 trailing', 'M0 0 1 1', 'MNaN 0', 'M1e999 0', 'M0,,0', 'M0 0 C1 2 3 4 5 6', 'M10001 0', 'M0 0 H', 'M0 0 V', 'M' + '.'.repeat(8000) + ' 0', 'M' + '9'.repeat(8000) + ' 0'];
  for (const raw of bad) assert.throws(() => pathPoints(raw));
  const code = `import assert from 'node:assert/strict'; const number=${number.toString()}; const paths=${pathPoints.toString()}; for(let i=0;i<200;i++) for(const raw of ${JSON.stringify(bad)}) assert.throws(()=>paths(raw));`;
  execFileSync(process.execPath, ['--input-type=module', '-e', code], { timeout: 5000, maxBuffer: 8192, stdio: 'pipe' });
});
test('dedicated fonts retain every original glyph outline, metrics and canonical complete licence', () => {
  const licence = read('public/fonts/ai-wages/LICENSE.txt'); assertFontLicenseReferences(licence, 'dejavu');
  assert.equal(licence, read('src/epub-assets/debt-chain-fonts/dejavu-LICENSE.txt'));
  for (const weight of [400, 700]) {
    const font = fonts[weight], original = fontFrom(`src/epub-assets/debt-chain-fonts/dejavu-sans-${weight}.ttf`);
    assert.deepEqual([font.unitsPerEm, font.ascender, font.descender], [original.unitsPerEm, original.ascender, original.descender]);
    const characters = new Set(variants.flatMap(v => inspect(v).nodes.filter(n => tag(n) === 'text' && attrs(n)['font-weight'] === String(weight)).flatMap(n => [...xmlText(n)])));
    for (const c of characters) {
      assert.ok(font.charToGlyphIndex(c) > 0); const a = font.charToGlyph(c), b = original.charToGlyph(c);
      assert.equal(a.advanceWidth, b.advanceWidth); assert.deepEqual(a.getPath(0, 0, font.unitsPerEm).commands, b.getPath(0, 0, original.unitsPerEm).commands);
    }
  }
});
test('responsive component uses compact article proportions, charter tokens and dedicated fonts', () => {
  const component = read('src/components/AiWagesFigure.astro'), styles = component.match(/<style>([\s\S]*?)<\/style>/u); assert.ok(styles);
  const css = postcss.parse(styles[1]), declarations = n => Object.fromEntries(n.nodes.filter(d => d.type === 'decl').map(d => [d.prop, d.value]));
  const base = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.ai-wages-figure'));
  assert.deepEqual([base.width, base['max-width'], base['container-type'], base['padding-bottom']], ['100%', '760px', 'inline-size', '.85rem']);
  assert.equal(declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.ai-wages-mobile')).display, 'none');
  for (const kind of ['media', 'container']) {
    const rule = css.nodes.find(n => n.type === 'atrule' && n.name === kind && n.params === '(max-width: 640px)'); assert.ok(rule);
    assert.deepEqual(rule.nodes.map(n => [n.selector, declarations(n).display]), [['.ai-wages-desktop', 'none'], ['.ai-wages-mobile', 'block']]);
  }
  const faces = css.nodes.filter(n => n.type === 'atrule' && n.name === 'font-face').map(n => declarations(n));
  assert.deepEqual(faces.map(d => [d['font-family'], d.src, d['font-weight'], d['font-style']]), [400, 700].map(w => ["'l0g AI Wages'", `url('/fonts/ai-wages/dejavu-sans-${w}.ttf') format('truetype')`, String(w), 'normal']));
  assert.doesNotMatch(styles[1], /#(?:[a-f0-9]{3}){1,2}\b|(?:clip-path|overflow\s*:\s*hidden|transform\s*:|100vw)/iu);
  const themes = { dark: new Map(), light: new Map() };
  postcss.parse(read('src/styles/global.css')).walkDecls(d => { if (d.parent.type === 'atrule' && d.parent.name === 'theme') themes.dark.set(d.prop, d.value); if (d.parent.type === 'rule' && d.parent.selector === ':root[data-theme="light"]') themes.light.set(d.prop, d.value); });
  for (const theme of Object.values(themes)) for (const token of ['ink', 'paper', 'surface', 'surface-2', 'muted', 'signal', 'amber', 'accent', 'topic-blue', 'line-strong']) assert.ok(theme.has(`--color-${token}`));
});
test('six article figures per language preserve ordering, captions, references and method notes', () => {
  for (const { lang, raw } of articles) {
    const figures = htmlNodes(parse(raw)).filter(n => n.tagName === 'aiwagesfigure'); assert.equal(figures.length, 6);
    for (const [i, figure] of figures.entries()) {
      assert.deepEqual(['lang', 'kind', 'number', 'sources'].map(k => htmlAttr(figure, k)), [lang, kinds[i], String(i + 1).padStart(2, '0'), figureSources[kinds[i]].join(' ')]);
      assert.ok(htmlAttr(figure, 'caption').length > 100);
      const details = htmlNodes(figure).filter(n => n.tagName === 'details'); assert.equal(details.length, 1);
      assert.equal(htmlNodes(details[0]).filter(n => n.tagName === 'summary').length, 1); assert.ok(htmlText(details[0]).length > 150);
    }
    assert.doesNotMatch(raw, /deux horloges|2 horloges|two clocks|—/iu);
  }
});
test('seventeen source references keep complete exact primary and supplemental fields', () => { for (const { raw, lang } of articles) checkSources(raw, lang); });
test('canonical bibliographies reject URL substitutions, unsafe protocols, extra fields and duplicate IDs', () => {
  const original = sourceUrls[0], raw = articles[0].raw, origin = new URL(original);
  for (const replacement of [original + '#hidden', original + '?alias=1', original + '/', original.replace('https:', 'http:'), original.replace(origin.hostname, `${origin.hostname}.example.org`), original.replace('https://', 'https://user@'), original.replace('https://', 'https://example.org/'), original.replace('/press/', '/%70ress/'), 'javascript:alert(1)', 'data:text/html,untrusted', ' ' + original]) {
    assert.notEqual(replacement, original); assert.throws(() => checkSources(raw.replace(`href="${original}"`, `href="${replacement}"`), 'fr'));
  }
  for (const field of ['onload', '__proto__', 'constructor', 'prototype', 'target', 'rel']) assert.throws(() => checkSources(raw.replace(`href="${original}"`, `href="${original}" ${field}="bad"`), 'fr'));
  assert.throws(() => checkSources(raw.replace(`>${sourceTitles.fr[0]}</a>`, '>Changed</a>'), 'fr'));
  assert.throws(() => checkSources(raw.replace('id="source-2"', 'id="source-1"'), 'fr'));
  assert.throws(() => checkSources(raw.replace('id="source-1"', 'id="source-99"'), 'fr'));
});
test('SAFE gaps and clearly fictional sharing/composition calculations reconcile', () => {
  assert.equal((3.7 - 3.1).toFixed(1), '0.6'); assert.equal((2.8 - .6).toFixed(1), '2.2');
  assert.equal(((61.2 / 60 - 1) * 100).toFixed(1), '2.0'); assert.equal(((110 / 100 - 1) * 100).toFixed(1), '10.0');
  assert.equal((61.2 / 110 * 100).toFixed(3), '55.636'); assert.equal((60 - 61.2 / 110 * 100).toFixed(1), '4.4');
  assert.equal((110 - 61.2).toFixed(1), '48.8'); assert.equal((48.8 - 40).toFixed(1), '8.8'); assert.equal((30 + 50) / 2, 40);
});
