import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import { parse } from 'parse5';
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
const htmlNodes = n => [n, ...(n.childNodes ?? []).flatMap(htmlNodes)];
const htmlAttr = (n,k) => n.attrs?.find(a => a.name === k)?.value;
const htmlText = n => n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(htmlText).join('');
const articles = ['fr', 'en'].map(lang => ({ lang, raw: read(`src/content/${lang === 'fr' ? 'posts' : 'posts-en'}/dollar-facture-energie.mdx`) }));
function extractSvg(raw) {
  assert.ok(raw.length < 500000);
  const all = []; let offset = 0;
  for (;;) {
    const start = raw.indexOf('<svg ', offset); if (start === -1) break;
    const end = raw.indexOf('</svg>', start); assert.ok(end > start && end - start < 30000);
    all.push(raw.slice(start, end + 6)); offset = end + 6;
  }
  return all;
}
const variants = articles.flatMap(({ lang, raw }) => {
  const svg = extractSvg(raw); assert.equal(svg.length, 12);
  return svg.map((s, i) => ({ lang, kind: String(Math.floor(i / 2) + 1).padStart(2, '0'), mobile: i % 2 === 1, name: `ep-${String(Math.floor(i / 2) + 1).padStart(2, '0')}-${lang}-${i % 2 ? 'm' : 'd'}`, svg: s }));
});
// Independently generated from the 24 attached assets/svg originals, after
// the finite semantic palette mapping. Geometry, text, all child attributes,
// order and viewBox are covered. Responsive root fields are checked separately.
// The four figure-05 cost labels on each original grey band map to ink,
// preserving contrast against muted in both themes; all 16 keep their geometry.
const originals = {
  "ep-01-en-d": {
    "hash": "d6ed641a0797a801c95f900402b08f80ff5dccacb890f3b981b809610fe9c1c1",
    "viewBox": "0 0 1120 1033"
  },
  "ep-01-en-m": {
    "hash": "8812c9e6990f5508529d4f92b09befd52e6aff411dcc8bdedcc011e49b996e28",
    "viewBox": "0 0 440 1034"
  },
  "ep-01-fr-d": {
    "hash": "3327cbdecd0e07a39f8c3ef6d6c5cedb5ea5cc8361d44d0f5eafbd24a02065ff",
    "viewBox": "0 0 1120 1033"
  },
  "ep-01-fr-m": {
    "hash": "2bc79dda45c778d048a349a50ebdb648a80b6d74cb02eeca2937712513e17f6d",
    "viewBox": "0 0 440 1058"
  },
  "ep-02-en-d": {
    "hash": "a1ea2b54dca0954b6884da9512b7cb0acf77fdfbb3cc089841746dd29382bfb1",
    "viewBox": "0 0 1120 1003"
  },
  "ep-02-en-m": {
    "hash": "b0dd612750ca62166dae8dc76f34dd6320162888cfae61b38065b1c58ae2450c",
    "viewBox": "0 0 440 1103"
  },
  "ep-02-fr-d": {
    "hash": "88a1bb112bee7fc5cc05f68643b95207ca9a46798b3cb2986ac3f753337d24ad",
    "viewBox": "0 0 1120 1024"
  },
  "ep-02-fr-m": {
    "hash": "a8d1c839f6bd94506f21bb26c02d7392a9f5ab7cc2432c48c4bec54700450bfb",
    "viewBox": "0 0 440 1103"
  },
  "ep-03-en-d": {
    "hash": "5790a49ca7f8347814365c3503de59fd9677be89ba4662787e5e85eea24b32f5",
    "viewBox": "0 0 1120 956"
  },
  "ep-03-en-m": {
    "hash": "c2e82dcefd0f3e3f6996579c61b77114ae1a672ebb5f46e3dc9db60099eb1562",
    "viewBox": "0 0 440 1345"
  },
  "ep-03-fr-d": {
    "hash": "56c53a92f51a9e1941bba33dc2380cde356ad18f8bcea5ad5af1f18482351f8c",
    "viewBox": "0 0 1120 980"
  },
  "ep-03-fr-m": {
    "hash": "6caed11354acdf3ad1f8e892c7650eb04fd639309c515be16c946c9fd170a174",
    "viewBox": "0 0 440 1386"
  },
  "ep-04-en-d": {
    "hash": "68f58b1da0db73006d8644009507cdc2fd9e7271f307ef990f930a1181d6d42a",
    "viewBox": "0 0 1120 1102"
  },
  "ep-04-en-m": {
    "hash": "27fada65d1f65854272159c2da47f09a849f72aece586cfe3025c5a011015d85",
    "viewBox": "0 0 440 1494"
  },
  "ep-04-fr-d": {
    "hash": "39782b30089499fa89ffe760b45e8199a197f4e887eb81aab08a76c485303327",
    "viewBox": "0 0 1120 1122"
  },
  "ep-04-fr-m": {
    "hash": "1e7697d298b879153b17acae6ebf06e8a94b0171d92b39fb421f8c99c3118eb4",
    "viewBox": "0 0 440 1517"
  },
  "ep-05-en-d": {
    "hash": "035c363abf810207ae3d0f738ddab7b53d6b82f645c52783bd4092d124b8c964",
    "viewBox": "0 0 1120 1009"
  },
  "ep-05-en-m": {
    "hash": "f0f13e0fc76b9f1b858d89129212fcdcec9684162a6c657ec7d9bddddfa74a7e",
    "viewBox": "0 0 440 1520"
  },
  "ep-05-fr-d": {
    "hash": "5035fccaa264d01f690f45e30a419c3ea583ebe6ca89d711333f3c718881bec8",
    "viewBox": "0 0 1120 1029"
  },
  "ep-05-fr-m": {
    "hash": "b89403d6efe69f1458f05a0d73ec0d32bb6d2f9e5675ce5f8edbdc810c79c08a",
    "viewBox": "0 0 440 1543"
  },
  "ep-06-en-d": {
    "hash": "1eea225fbc552778f82d028bb1f3a0ad6e4b23a8a224cb31fe45d522541178a2",
    "viewBox": "0 0 1120 990"
  },
  "ep-06-en-m": {
    "hash": "cf4777f0d861fbe98be2427a72570ce1bb575c01d72cc502120bc73a7fc10648",
    "viewBox": "0 0 440 1368"
  },
  "ep-06-fr-d": {
    "hash": "99ee63454edd4efffe69fa1f90d9f3fa36efadeaade86e7d9e578cb2dd7a2736",
    "viewBox": "0 0 1120 990"
  },
  "ep-06-fr-m": {
    "hash": "ccdc850fd48fb33af4d3194b05b0689fd514c82797ce82846e84f4fba181fff0",
    "viewBox": "0 0 440 1344"
  }
};
const sourceUrls = [
  "https://www.reuters.com/business/euro-skids-toward-fifth-weekly-fall-selling-pressure-slows-2026-10-09/",
  "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/eurofxref-graph-usd.en.html",
  "https://www.eia.gov/dnav/pet/hist/RBRTED.htm",
  "https://fred.stlouisfed.org/series/DCOILBRENTEU",
  "https://www.eia.gov/dnav/pet/TblDefs/pet_pri_spt_tbldef2.asp",
  "https://ec.europa.eu/eurostat/en/web/products-eurostat-news/w/wdn-20260318-1",
  "https://www.ice.com/products/27996665",
  "https://www.bde.es/wbe/es/publicaciones/analisis-economico-investigacion/documentos-ocasionales/exchange-rate-passthrough-euro-area-and-eu-countries.html",
  "https://www.ecb.europa.eu/press/financial-stability-publications/fsr/special/html/ecb.fsrart202211_01~173476301a.en.html",
  "https://www.globenewswire.com/news-release/2026/07/30/3335784/0/en/Air-France-KLM-Q2-2026-Results.html",
  "https://www.safran-group.com/pressroom/safran-reports-its-first-half-2026-results-2026-07-28",
  "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en",
  "https://www.tresor.economie.gouv.fr/Articles/2022/12/07/repartition-des-pertes-dues-a-la-degradation-des-termes-de-l-echange-energetiques",
  "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.fr.html",
  "https://www.ecb.europa.eu/press/inter/date/2026/html/ecb.in261006~bc94400297.en.html",
  "https://www.cftc.gov/LearnAndProtect/EducationCenter/economicpurpose"
];
const observations = [["2026-09-01",96.02,1.159],["2026-09-02",97.59,1.1578],["2026-09-03",100.52,1.1615],["2026-09-04",102.24,1.1622],["2026-09-07",104.47,1.1622],["2026-09-08",106.12,1.1614],["2026-09-09",109.51,1.1652],["2026-09-10",120.98,1.1616],["2026-09-11",118.06,1.1592],["2026-09-14",121.25,1.1551],["2026-09-15",130.8,1.1539],["2026-09-16",127.84,1.1537],["2026-09-17",121.18,1.1481],["2026-09-18",119.66,1.146],["2026-09-21",116.15,1.149],["2026-09-22",114.89,1.1463],["2026-09-23",117.45,1.1411],["2026-09-24",120.92,1.1367],["2026-09-25",116.01,1.1403],["2026-09-28",119.97,1.1378],["2026-09-29",113.96,1.1355],["2026-09-30",115.91,1.1355],["2026-10-01",114.82,1.1298],["2026-10-02",135.51,1.1225],["2026-10-05",125.51,1.1204],["2026-10-06",125.44,1.1269]];
function canonical(n, root = false) {
  if (tag(n) === '#text') return ['#text', n['#text']];
  const a = { ...attrs(n) }; if (root) for (const k of ['width', 'height', 'style', 'lang']) delete a[k];
  return [tag(n), Object.entries(a).sort(([a],[b]) => a < b ? -1 : a > b ? 1 : 0), children(n).filter(c => tag(c) !== '#text' || c['#text'].trim() || ['text', 'title', 'desc'].includes(tag(n))).map(c => canonical(c))];
}
const allowed = Object.fromEntries(Object.entries({
  svg: 'xmlns viewBox role aria-labelledby lang style', title: 'id', desc: 'id',
  rect: 'x y width height rx fill stroke stroke-width',
  text: 'x y fill font-family font-size font-weight text-anchor dominant-baseline',
  line: 'x1 y1 x2 y2 stroke stroke-width stroke-dasharray',
  path: 'd fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray',
  circle: 'cx cy r fill stroke stroke-width',
}).map(([k, v]) => [k, new Set(v.split(' '))]));
const paints = new Set(['none', ...['ink', 'paper', 'muted', 'signal', 'line-strong', 'amber', 'surface-2', 'surface'].map(v => `var(--color-${v})`)]);
const numeric = new Set('x y x1 y1 x2 y2 width height rx cx cy r font-size stroke-width'.split(' '));
function number(n, key, fallback = 0) {
  const value = attrs(n)[key] ?? String(fallback); assert.equal(typeof value, 'string'); assert.ok(value.length <= 32);
  assert.match(value, /^-?(?:\d{1,10}(?:\.\d{1,10})?|\.\d{1,10})$/u);
  const v = Number(value); assert.ok(Number.isFinite(v) && Math.abs(v) <= 10000); return v;
}
// The supplied shapes use only explicit M/L/Z segments. This bounded token
// walk consumes every coordinate; it does not evaluate or approximate curves.
function pathPoints(value) {
  assert.equal(typeof value, 'string'); assert.ok(value.length > 0 && value.length <= 4096);
  const tokens = value.trim().split(/\s+/u); assert.ok(tokens.length <= 1024);
  assert.equal(tokens[0], 'M'); const points = []; let i = 0, origin;
  while (i < tokens.length) {
    const command = tokens[i++]; assert.ok(['M', 'L', 'Z'].includes(command));
    if (command === 'Z') { assert.ok(origin); points.push([...origin]); continue; }
    const x = number({ ':@': { coordinate: tokens[i++] } }, 'coordinate', NaN);
    const y = number({ ':@': { coordinate: tokens[i++] } }, 'coordinate', NaN);
    if (command === 'M') origin = [x, y]; points.push([x, y]);
  }
  assert.ok(points.length); return points;
}
function inspect(v) {
  assert.ok(v.svg.length < 30000); assert.doesNotMatch(v.svg, /<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;)/u);
  assert.doesNotMatch(v.svg, /\b(?:__proto__|constructor|prototype)\s*=/u);
  assert.equal(XMLValidator.validate(v.svg), true);
  const roots = parser.parse(v.svg); assert.equal(roots.length, 1); const root = roots[0]; assert.equal(tag(root), 'svg');
  assert.deepEqual(attrs(root), { xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[v.name].viewBox, role: 'img', 'aria-labelledby': `${v.name}-title ${v.name}-desc`, style: 'width:100%;height:auto', lang: v.lang });
  const nodes = nodesOf(root), ids = [];
  for (const n of nodes) {
    assert.ok(Object.hasOwn(allowed, tag(n)), `Unapproved SVG tag ${tag(n)}`);
    for (const [k, value] of Object.entries(attrs(n))) {
      assert.ok(allowed[tag(n)].has(k), `Unapproved ${tag(n)}.${k}`); assert.equal(typeof value, 'string'); assert.ok(value.length <= 4096);
      if (numeric.has(k)) { const value = number(n, k); if (['width', 'height', 'r', 'rx', 'stroke-width'].includes(k)) assert.ok(value >= 0); }
      if (k === 'fill' || k === 'stroke') assert.ok(paints.has(value), `Unapproved paint ${value}`);
      if (k === 'id') { assert.ok([`${v.name}-title`, `${v.name}-desc`].includes(value)); ids.push(value); }
      if (k === 'font-family') assert.equal(value, 'DejaVu Sans, Arial, sans-serif');
      if (k === 'font-weight') assert.ok(['400', '700'].includes(value));
      if (k === 'font-size') assert.ok(number(n,k) >= 12 && number(n,k) <= 48);
      if (k === 'text-anchor') assert.ok(['start', 'middle', 'end'].includes(value));
      if (k === 'dominant-baseline') assert.equal(value, 'hanging');
      if (k === 'stroke-dasharray') assert.ok(['7 5', '4 5', '3 3', '4 4'].includes(value));
      if (k === 'stroke-linecap' || k === 'stroke-linejoin') assert.equal(value, 'round');
      if (k === 'd') pathPoints(value);
    }
  }
  assert.deepEqual(ids.sort(), [`${v.name}-desc`, `${v.name}-title`]);
  for (const type of ['title', 'desc']) { const matches = nodes.filter(n => tag(n) === type); assert.equal(matches.length, 1); assert.ok(textOf(matches[0]).trim()); }
  return { root, nodes, width: Number(attrs(root).viewBox.split(' ')[2]), height: Number(attrs(root).viewBox.split(' ')[3]) };
}
function signature(v) { return createHash('sha256').update(JSON.stringify(canonical(inspect(v).root, true))).digest('hex'); }
function mutate(v, change) { const root = parser.parse(v.svg)[0]; change(root, nodesOf(root)); return { ...v, svg: builder.build([root]) }; }
const fonts = Object.fromEntries([400, 700].map(w => {
  const bytes = readFileSync(new URL(`../public/fonts/energy-fx/dejavu-sans-${w}.ttf`, import.meta.url));
  assert.ok(bytes.length > 1000 && bytes.length < 65536);
  return [w, opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength))];
}));
const within = (a, b, pad = 0) => a.x >= b.x + pad && a.y >= b.y + pad && a.right <= b.right - pad && a.bottom <= b.bottom - pad;
const overlaps = (a, b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
function pointsBox(points) { assert.ok(points.length && points.flat().every(Number.isFinite)); return { x: Math.min(...points.map(p => p[0])), y: Math.min(...points.map(p => p[1])), right: Math.max(...points.map(p => p[0])), bottom: Math.max(...points.map(p => p[1])) }; }
function shapeBox(n) {
  if (tag(n) === 'rect') return { x: number(n,'x'), y: number(n,'y'), right: number(n,'x') + number(n,'width'), bottom: number(n,'y') + number(n,'height') };
  if (tag(n) === 'circle') return { x: number(n,'cx') - number(n,'r'), y: number(n,'cy') - number(n,'r'), right: number(n,'cx') + number(n,'r'), bottom: number(n,'cy') + number(n,'r') };
  if (tag(n) === 'line') return pointsBox([[number(n,'x1'),number(n,'y1')], [number(n,'x2'),number(n,'y2')]]);
  if (tag(n) === 'path') return pointsBox(pathPoints(attrs(n).d));
}
function textBox(n) {
  const value = textOf(n), font = fonts[attrs(n)['font-weight']], size = number(n,'font-size');
  for (const c of value) assert.ok(font.charToGlyphIndex(c) > 0, `Missing U+${c.codePointAt(0).toString(16)}`);
  const advance = font.getAdvanceWidth(value, size), anchor = attrs(n)['text-anchor'];
  const x = number(n,'x') - (anchor === 'middle' ? advance / 2 : anchor === 'end' ? advance : 0);
  // Hanging labels are laid out in non-overlapping em envelopes here. Actual
  // browser glyph bounds and theme visibility are inspected in responsive QA.
  return { x, y: number(n,'y'), right: x + advance, bottom: number(n,'y') + size };
}
function geometry(v) {
  const { root, width, height } = inspect(v), visible = children(root).filter(n => ['text', 'rect', 'line', 'circle', 'path'].includes(tag(n)));
  const canvas = { x: 0, y: 0, right: width, bottom: height }, boxes = [];
  for (const [i, n] of visible.entries()) {
    if (tag(n) !== 'text') {
      const b = shapeBox(n), stroke = attrs(n).stroke && attrs(n).stroke !== 'none' ? number(n,'stroke-width',1) / 2 : 0;
      assert.ok(within({ x: b.x - stroke, y: b.y - stroke, right: b.right + stroke, bottom: b.bottom + stroke }, canvas), `${v.name}: shape outside viewBox`); continue;
    }
    const b = textBox(n), label = textOf(n); assert.ok(within(b,canvas,2), `${v.name}: label outside viewBox ${label}`);
    const center = { x: (b.x+b.right)/2, y: (b.y+b.bottom)/2, right: (b.x+b.right)/2, bottom: (b.y+b.bottom)/2 };
    const card = visible.slice(0,i).filter(c => tag(c) === 'rect' && number(c,'rx') >= 6 && number(c,'x') > 0 && within(center,shapeBox(c))).at(-1);
    if (card) assert.ok(within(b,shapeBox(card),2), `${v.name}: label outside card ${label}`);
    for (const prior of boxes) assert.ok(!overlaps(b,prior), `${v.name}: labels overlap ${label} / ${prior.label}`);
    for (const c of visible.slice(i+1).filter(c => tag(c) === 'rect' && attrs(c).fill !== 'none')) assert.ok(!overlaps(b,shapeBox(c)), `${v.name}: later rectangle conceals ${label}`);
    boxes.push({ ...b, label });
  }
}
const supplementalSources = {
  fr: [['https://www.marketscreener.com/news/euro-skids-toward-fifth-weekly-fall-but-selling-pressure-slows-ce785ddfdf88f423','reprise publiée par MarketScreener'],['https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/usd.xml','fichier XML SDMX officiel']],
  en: [['https://www.marketscreener.com/news/euro-skids-toward-fifth-weekly-fall-but-selling-pressure-slows-ce785ddfdf88f423','MarketScreener republication'],['https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/usd.xml','official SDMX XML file']],
};
function checkSources(raw,lang) {
  const all = htmlNodes(parse(raw));
  const sections = all.filter(n => n.tagName === 'section' && /^source-s\d{2}$/u.test(htmlAttr(n,'id') ?? ''));
  assert.deepEqual(sections.map(n => htmlAttr(n,'id')), sourceUrls.map((_,i) => `source-s${String(i+1).padStart(2,'0')}`));
  for (const [i,section] of sections.entries()) {
    const displayLiteral=`{${JSON.stringify(sourceUrls[i])}}`;
    const links = htmlNodes(section).filter(n => n.tagName === 'a' && (htmlAttr(n,'class') === 'ep-url' || htmlAttr(n,'classname') === 'ep-url'));
    assert.equal(links.length,1); assert.deepEqual(links.map(n => [htmlAttr(n,'href'),htmlText(n),htmlAttr(n,'rel')]), [[sourceUrls[i],displayLiteral,'noopener noreferrer']]);
    const expected=[[sourceUrls[i],displayLiteral,'noopener noreferrer','_blank']];
    if(i<2) expected.push([...supplementalSources[lang][i],'noopener noreferrer','_blank']);
    assert.deepEqual(htmlNodes(section).filter(n=>n.tagName==='a').map(n=>[htmlAttr(n,'href'),htmlText(n),htmlAttr(n,'rel'),htmlAttr(n,'target')]),expected);
    assert.ok(all.some(n => n.tagName === 'a' && htmlAttr(n,'href') === `#source-s${String(i+1).padStart(2,'0')}`));
  }
}
function figureTables(raw) {
  const all = htmlNodes(parse(raw)); const result = [];
  for (let i=1; i<=6; i++) {
    const figures = all.filter(n => n.tagName === 'figure' && htmlAttr(n,'id') === `figure-${i}`); assert.equal(figures.length,1);
    const tables = htmlNodes(figures[0]).filter(n => n.tagName === 'table'); assert.equal(tables.length,1);
    const bodies = htmlNodes(tables[0]).filter(n => n.tagName === 'tbody'); assert.equal(bodies.length,1);
    result.push(htmlNodes(bodies[0]).filter(n => n.tagName === 'tr').map(row => htmlNodes(row).filter(n => n.tagName === 'td').map(htmlText)));
  }
  return result;
}
const sourceTableRows = {"fr":[[["2026-09-01","96,02","1,1590","82,8473"],["2026-09-02","97,59","1,1578","84,2892"],["2026-09-03","100,52","1,1615","86,5433"],["2026-09-04","102,24","1,1622","87,9711"],["2026-09-07","104,47","1,1622","89,8899"],["2026-09-08","106,12","1,1614","91,3725"],["2026-09-09","109,51","1,1652","93,9839"],["2026-09-10","120,98","1,1616","104,1494"],["2026-09-11","118,06","1,1592","101,8461"],["2026-09-14","121,25","1,1551","104,9693"],["2026-09-15","130,80","1,1539","113,3547"],["2026-09-16","127,84","1,1537","110,8087"],["2026-09-17","121,18","1,1481","105,5483"],["2026-09-18","119,66","1,1460","104,4154"],["2026-09-21","116,15","1,1490","101,0879"],["2026-09-22","114,89","1,1463","100,2268"],["2026-09-23","117,45","1,1411","102,9270"],["2026-09-24","120,92","1,1367","106,3781"],["2026-09-25","116,01","1,1403","101,7364"],["2026-09-28","119,97","1,1378","105,4403"],["2026-09-29","113,96","1,1355","100,3611"],["2026-09-30","115,91","1,1355","102,0784"],["2026-10-01","114,82","1,1298","101,6286"],["2026-10-02","135,51","1,1225","120,7216"],["2026-10-05","125,51","1,1204","112,0225"],["2026-10-06","125,44","1,1269","111,3142"]],[["96.02","1.159","82,847282"],["125.44","1.159","108,231234"],["96.02","1.1269","85,207206"],["125.44","1.1269","111,314225"]],[["Budget","8 333 333,33","0,0000"],["Sans protection","11 363 636,36","36,3636"],["Pétrole seul","9 090 909,09","9,0909"],["Change seul, notionnel fixe","10 606 060,61","27,2727"],["Pétrole et change","8 333 333,33","0,0000"]],[["0","100","0,0","0,0"],["20","80","-2,0","0,0"],["60","125","4,5","-12,5"]],[["Initial","20,000000","3,000000","15,0000"],["0 %","20,000000","1,181818","5,9091"],["60 %","21,090909","2,272727","10,7759"],["100 %","21,818182","3,000000","13,7500"]],[["100 $ / baril","83,3333 €","90,9091 €"],["80 € / MWh","80 €","80 €"],["4 M$ nets","3,333333 M€","3,636364 M€"]]],"en":[[["2026-09-01","96.02","1.1590","82.8473"],["2026-09-02","97.59","1.1578","84.2892"],["2026-09-03","100.52","1.1615","86.5433"],["2026-09-04","102.24","1.1622","87.9711"],["2026-09-07","104.47","1.1622","89.8899"],["2026-09-08","106.12","1.1614","91.3725"],["2026-09-09","109.51","1.1652","93.9839"],["2026-09-10","120.98","1.1616","104.1494"],["2026-09-11","118.06","1.1592","101.8461"],["2026-09-14","121.25","1.1551","104.9693"],["2026-09-15","130.80","1.1539","113.3547"],["2026-09-16","127.84","1.1537","110.8087"],["2026-09-17","121.18","1.1481","105.5483"],["2026-09-18","119.66","1.1460","104.4154"],["2026-09-21","116.15","1.1490","101.0879"],["2026-09-22","114.89","1.1463","100.2268"],["2026-09-23","117.45","1.1411","102.9270"],["2026-09-24","120.92","1.1367","106.3781"],["2026-09-25","116.01","1.1403","101.7364"],["2026-09-28","119.97","1.1378","105.4403"],["2026-09-29","113.96","1.1355","100.3611"],["2026-09-30","115.91","1.1355","102.0784"],["2026-10-01","114.82","1.1298","101.6286"],["2026-10-02","135.51","1.1225","120.7216"],["2026-10-05","125.51","1.1204","112.0225"],["2026-10-06","125.44","1.1269","111.3142"]],[["96.02","1.159","82.847282"],["125.44","1.159","108.231234"],["96.02","1.1269","85.207206"],["125.44","1.1269","111.314225"]],[["Budget","8,333,333.33","0.0000"],["Unhedged","11,363,636.36","36.3636"],["Oil only","9,090,909.09","9.0909"],["FX only, fixed notional","10,606,060.61","27.2727"],["Oil and FX","8,333,333.33","0.0000"]],[["0","100","0.0","0.0"],["20","80","-2.0","0.0"],["60","125","4.5","-12.5"]],[["Initial","20.000000","3.000000","15.0000"],["0 %","20.000000","1.181818","5.9091"],["60 %","21.090909","2.272727","10.7759"],["100 %","21.818182","3.000000","13.7500"]],[["$100 / barrel","€83.3333","€90.9091"],["€80 / MWh","€80","€80"],["$4m net","€3.333333m","€3.636364m"]]]};

test('24 original energy/FX drawings retain complete ordered fields and only semantic paint changes', () => {
  assert.deepEqual(variants.map(v => v.name).sort(),Object.keys(originals).sort());
  for (const v of variants) assert.equal(signature(v),originals[v.name].hash,v.name);
  for(const v of variants.filter(v=>v.kind==='05')) {
    const ns=inspect(v).nodes;
    const labels=ns.filter(n=>tag(n)==='text'&&textOf(n)===(v.lang==='fr'?'12,0':'12.0'));
    assert.equal(labels.length,4);
    for(const label of labels) {
      assert.equal(attrs(label).fill,'var(--color-ink)');
      const point={x:number(label,'x'),y:number(label,'y')+number(label,'font-size')/2};
      assert.ok(ns.slice(0,ns.indexOf(label)).some(n=>tag(n)==='rect'&&attrs(n).fill==='var(--color-muted)'&&within({...point,right:point.x,bottom:point.y},shapeBox(n))));
    }
  }
});
test('all source figures have passive XML, responsive roots and globally unique accessible IDs', () => {
  const ids = new Set(); for (const v of variants) for (const n of inspect(v).nodes) if (attrs(n).id) { assert.ok(!ids.has(attrs(n).id)); ids.add(attrs(n).id); }
  assert.equal(ids.size,48);
  for (const v of variants) assert.doesNotMatch(textOf(inspect(v).nodes.find(n => tag(n) === 'title')), /ce qu[ei’']|what\b|deux horloges|2 horloges|two clocks|—/iu);
});
test('source labels, cards, axes, bands and line vertices stay inside their original viewBox', () => {
  const failures=[]; for (const v of variants) try { geometry(v); } catch (e) { failures.push(e.message); } assert.deepEqual(failures,[]);
});
test('full-field fingerprints reject silent text, coordinates, paint, IDs and node order changes', () => {
  const v=variants[0];
  for (const change of [(_,ns) => { attrs(ns.find(n => tag(n) === 'rect')).fill='var(--color-surface)'; }, (_,ns) => { attrs(ns.find(n => tag(n) === 'text')).x='0'; }, (_,ns) => { attrs(ns.find(n => tag(n) === 'text'))['font-weight']='400'; }, (_,ns) => { attrs(ns.find(n => tag(n) === 'title')).id='changed'; }, (_,ns) => { ns.find(n => tag(n) === 'title').title=[{'#text':'Changed'}]; }, r => { r.svg.reverse(); }]) {
    let hash; try { hash=signature(mutate(v,change)); } catch(e) { assert.ok(e instanceof assert.AssertionError); continue; } assert.notEqual(hash,originals[v.name].hash);
  }
});
test('active elements, event handlers, references, prototypes and out-of-range numerics fail closed', () => {
  const v=variants[0];
  for (const change of [r => { r.svg.push({script:[{'#text':'alert(1)'}]}); }, (_,ns) => { attrs(ns.find(n => tag(n) === 'text')).onload='alert(1)'; }, (_,ns) => { attrs(ns.find(n => tag(n) === 'rect')).fill='url(https://example.org/x)'; }, (_,ns) => { attrs(ns.find(n => tag(n) === 'rect')).fill='var(--color-ink,red)'; }, (_,ns) => { attrs(ns.find(n => tag(n) === 'text')).constructor='x'; }, (_,ns) => { attrs(ns.find(n => tag(n) === 'text')).x='Infinity'; }, (_,ns) => { attrs(ns.find(n => tag(n) === 'text')).x='10001'; }, (_,ns) => { attrs(ns.find(n => tag(n) === 'rect')).width='-1'; }]) assert.throws(() => inspect(mutate(v,change)));
  for (const svg of ['<!DOCTYPE svg><svg/>','<svg>&external;</svg>','<svg>&#65;</svg>']) assert.throws(() => inspect({...v,svg}));
  assert.throws(()=>inspect({...v,svg:v.svg.replace('<text ','<text __proto__="untrusted" ')}));
});
test('bounded M/L/Z paths consume complete input and reject malformed boundaries under a deadline', () => {
  assert.deepEqual(pathPoints('M 0 0 L 100 100 Z M 5 5 L 6 6 Z'),[[0,0],[100,100],[0,0],[5,5],[6,6],[5,5]]);
  const bad=['L 0 0','M 0','M 0 0 trailing','M NaN 0','M 1e999 0','M 0,,0','M 0 0 C 1 2 3 4','M 10001 0','M '+'.'.repeat(4000)+' 0','M '+'9'.repeat(4000)+' 0'];
  for (const s of bad) assert.throws(() => pathPoints(s));
  const code=`import assert from 'node:assert/strict'; const attrs=${attrs.toString()}; const number=${number.toString()}; const paths=${pathPoints.toString()}; for(const raw of ${JSON.stringify(bad)}) assert.throws(()=>paths(raw));`;
  execFileSync(process.execPath,['--input-type=module','-e',code],{timeout:2000,maxBuffer:8192,stdio:'pipe'});
});
test('all six table bodies in each language match the independently audited original data', () => {
  for (const { raw, lang } of articles) assert.deepEqual(figureTables(raw),sourceTableRows[lang]);
});
test('the observation paths match all 26 calendar dates, dollar prices and converted prices', () => {
  for (const v of variants.filter(v=>v.kind==='01')) {
    const ns=inspect(v).nodes, paths=ns.filter(n=>tag(n)==='path'); assert.equal(paths.length,2);
    const y100=ns.find(n=>tag(n)==='text' && textOf(n)==='100'); const y110=ns.find(n=>tag(n)==='text' && textOf(n)==='110');
    const first=pathPoints(attrs(paths[0]).d)[0], last=pathPoints(attrs(paths[0]).d).at(-1), scale=(number(y100,'y')-number(y110,'y'))/10;
    const base=observations[0][1], baseEuro=base/observations[0][2], firstDate=Date.parse(observations[0][0]), days=35;
    for (const [j,p] of paths.entries()) {
      assert.equal(attrs(p).stroke,j===0?'var(--color-amber)':'var(--color-signal)'); const points=pathPoints(attrs(p).d); assert.equal(points.length,26);
      for (const [i,[date,oil,fx]] of observations.entries()) {
        const x=first[0]+(last[0]-first[0])*(Date.parse(date)-firstDate)/86400000/days;
        const value=j===0?oil/base*100:(oil/fx)/baseEuro*100;
        assert.ok(Math.abs(points[i][0]-x)<.011); assert.ok(Math.abs(points[i][1]-(first[1]-(value-100)*scale))<.05);
      }
    }
  }
});
test('matched observations, decomposition, hedge notional, margin cash flow and surplus arithmetic reconcile', () => {
  const euro0=96.02/1.159,euro1=125.44/1.1269,oil=125.44/1.159,fx=96.02/1.1269;
  assert.equal(euro0.toFixed(2),'82.85'); assert.equal(euro1.toFixed(2),'111.31'); assert.equal(oil.toFixed(2),'108.23'); assert.equal(fx.toFixed(2),'85.21');
  assert.equal((oil-euro0).toFixed(2),'25.38'); assert.equal((euro1-oil).toFixed(2),'3.08'); assert.ok(Math.abs((oil-euro0)+(euro1-oil)-(euro1-euro0))<1e-12);
  const budget=10/1.2,open=12.5/1.1,fxOnly=10/1.2+2.5/1.1; assert.deepEqual([budget,open,10/1.1,fxOnly].map(n=>n.toFixed(3)),['8.333','11.364','9.091','10.606']);
  assert.equal((100000*(80-100)/1000000).toFixed(1),'-2.0');assert.equal((100000*(125-80)/1000000).toFixed(1),'4.5');assert.equal(-2+4.5-12.5,-10);
  const added=5*(open/budget-1);assert.equal((20-12-5-added).toFixed(3),'1.182');assert.equal((20+.6*added-12-5-added).toFixed(3),'2.273');assert.equal((3/(20+added)*100).toFixed(2),'13.75');
  assert.equal((4/1.2).toFixed(3),'3.333');assert.equal((4/1.1).toFixed(3),'3.636');
  for (const {raw,lang} of articles) { checkSources(raw,lang); assert.doesNotMatch(raw,/deux horloges|2 horloges|two clocks|—/iu); }
});
test('dedicated DejaVu subsets cover every original label and retain the complete licence', () => {
  assertFontLicenseReferences(read('public/fonts/energy-fx/LICENSE.txt'),'dejavu');
  for(const weight of [400,700]) {
    const bytes=readFileSync(new URL(`../src/epub-assets/debt-chain-fonts/dejavu-sans-${weight}.ttf`,import.meta.url));
    const original=opentype.parse(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength));
    const subset=fonts[weight];
    assert.deepEqual([subset.unitsPerEm,subset.ascender,subset.descender],[original.unitsPerEm,original.ascender,original.descender]);
    const characters=new Set(variants.flatMap(v=>inspect(v).nodes.filter(n=>tag(n)==='text'&&attrs(n)['font-weight']===String(weight)).flatMap(n=>[...textOf(n)])));
    for(const c of characters) {
      assert.ok(subset.charToGlyphIndex(c)>0);
      const a=subset.charToGlyph(c),b=original.charToGlyph(c);
      assert.equal(a.advanceWidth,b.advanceWidth);
      assert.deepEqual(a.getPath(0,0,subset.unitsPerEm).commands,b.getPath(0,0,original.unitsPerEm).commands);
    }
  }
  for(const v of variants) for(const n of inspect(v).nodes.filter(n=>tag(n)==='text')) textBox(n);
});
test('responsive CSS uses site semantic colours, article width and mobile figure switching', () => {
  const css=postcss.parse(read('src/styles/euro-petrole-double-risque.css'));
  const themes={dark:new Map(),light:new Map()}; postcss.parse(read('src/styles/global.css')).walkDecls(d=>{if(d.parent.type==='atrule'&&d.parent.name==='theme')themes.dark.set(d.prop,d.value);if(d.parent.type==='rule'&&d.parent.selector===':root[data-theme="light"]')themes.light.set(d.prop,d.value);});
  for (const palette of Object.values(themes)) for(const token of ['ink','surface','surface-2','paper','muted','signal','amber','line-strong']) assert.ok(palette.has(`--color-${token}`));
  css.walkDecls(d=>assert.doesNotMatch(d.value,/#(?:[a-f0-9]{3}){1,2}\b/iu));
  const declarations=n=>Object.fromEntries(n.nodes.filter(d=>d.type==='decl').map(d=>[d.prop,d.value]));
  const base=css.nodes.find(n=>n.type==='rule'&&n.selector==='.energy-article .ep-figure');assert.ok(base);
  const b=declarations(base);assert.deepEqual([b.width,b['max-width'],b.margin,b.background],['100%','760px','2.5rem auto 3rem','var(--color-ink)']);
  assert.equal(declarations(css.nodes.find(n=>n.type==='rule'&&n.selector==='.energy-article .ep-chart--mobile')).display,'none');
  const mobile=css.nodes.find(n=>n.type==='atrule'&&n.name==='media'&&n.params==='(max-width:680px)');assert.ok(mobile);
  assert.deepEqual(mobile.nodes.filter(n=>n.type==='rule'&&['.energy-article .ep-chart--desktop','.energy-article .ep-chart--mobile'].includes(n.selector)).map(n=>[n.selector,declarations(n).display]),[['.energy-article .ep-chart--desktop','none'],['.energy-article .ep-chart--mobile','block']]);
  assert.equal(declarations(mobile.nodes.find(n=>n.type==='rule'&&n.selector==='.energy-article .ep-figure'))['max-width'],'416px');
  const faces=css.nodes.filter(n=>n.type==='atrule'&&n.name==='font-face');
  assert.deepEqual(faces.map(n=>{const d=declarations(n);return [d['font-family'],d.src,d['font-weight'],d['font-style']];}),[400,700].map(w=>['"DejaVu Sans"',`url("/fonts/energy-fx/dejavu-sans-${w}.ttf") format("truetype")`,String(w),'normal']));
});
