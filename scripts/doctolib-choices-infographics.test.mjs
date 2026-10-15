import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import { parse } from 'parse5';
import { createProcessor } from '@mdx-js/mdx';
import opentype from '@shuding/opentype.js';
import postcss from 'postcss';
import { doctolibChoicesSvg, DOCTOLIB_CHOICES_KINDS } from '../src/lib/doctolibChoicesFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Independent SHA256 and complete browser-tree goldens from the 24 supplied SVG exports.
// Only four lifecycle metadata scopes replace clocks with periods; visible text, geometry, source data and backgrounds are preserved.
const originals = {
  "lifecycle-fr-desktop": {"rawHash":"043a8dc5a201eb288e76b83a9d22bb2b748e9cc08974eb63cea04c29e1460176","domHash":"e6489aa1f0c508b6ff4c466c155a4554bc011d72c1cb4c3d2cf44affcd94109a","viewBox":"0 0 1000 857"},
  "lifecycle-fr-mobile": {"rawHash":"cd21a9e7924756faa7e0b8479090794e7186109938d0f96c18699e3738ef973d","domHash":"3bf8f2bc52da9ea5c7814d1f5e8839cf6a67153f6aa68aee33de99b42d03f16c","viewBox":"0 0 400 1233"},
  "lifecycle-en-desktop": {"rawHash":"a52e827431f51dab72190d25abddda415c080c553979a2173b86e2db521fea52","domHash":"bcdf2017bf2c71d9f0fe07f5fd38ce33bb5f873f1aab8a8a9d109f9cbb5a365c","viewBox":"0 0 1000 857"},
  "lifecycle-en-mobile": {"rawHash":"ba1ef0ffcac555f2e6757b711d86e3d0bcb20f27a3c87940f3cb22b245b038bd","domHash":"638140b92784c42c96cfc57f101dbc399939fc46b0e3e6eadbacd9472a67ce74","viewBox":"0 0 400 1233"},
  "evidence-fr-desktop": {"rawHash": "8fef851b8919bad098cf1faf820f3e34ad1519281af3569544068b0ec583c354", "domHash": "d46206a6f2dd18b0d116d590d479fe5e661e6f57afa3359117cb5e59ed7b128e", "viewBox": "0 0 1000 833"},
  "evidence-fr-mobile": {"rawHash": "bb131e7e0026891c7407e8d27970f0fdb2ecb0fe994d60192c8afbe4aad0efcd", "domHash": "dc289c41fb9d6a650dd96dcac0dec430578630ebb6bd8108ab67d95d9552c3bf", "viewBox": "0 0 400 1039"},
  "evidence-en-desktop": {"rawHash": "d7413544bdc31caf894eb8f541922333d612b8ce360e1332261c3378e9376646", "domHash": "93c2abad399901aed5d0ac7a6479e4e46e7420be9232b6651d1be9bf9ee779f5", "viewBox": "0 0 1000 833"},
  "evidence-en-mobile": {"rawHash": "708f0a7bfacb855ea48fbc4e02c3742b2998365b66aae95cbebde4a4d4bee97f", "domHash": "d731bedb48fd5c24e860b4050059c7fda8e29f094a6eedda136203043639c043", "viewBox": "0 0 400 1039"},
  "network-fr-desktop": {"rawHash": "ffdece8d33daf8e9d141fd41687dadcb522dd6df118ce5bf0b129b0c1aaa2948", "domHash": "fc53102d408539183e5cd504ccbd5982b115b9d91968268b3888fcb3b27381b2", "viewBox": "0 0 1000 845"},
  "network-fr-mobile": {"rawHash": "b87efd70ada814112329d9e933fe8b38ce7b2f0697a17dcc6a876d7f9d043cbc", "domHash": "43c1e7bb531cb0b0dda6473c994a64565beebfac513a7873223584d0c7a2cd5f", "viewBox": "0 0 400 1173"},
  "network-en-desktop": {"rawHash": "17303da764f54d3b7ece4ffb1df7d8223c442cb3e3c3e9e2d528a9131a6eb924", "domHash": "b888a6b57e34246fa3b15d35b6c77ba9bd348705dc69ad82529c3119d57cca9a", "viewBox": "0 0 1000 845"},
  "network-en-mobile": {"rawHash": "0f9fba3d213fdd8f0345bef44962bf37420c50dc9bd22cfd320084ea2f99c4db", "domHash": "a808fa5b7f4232e5b6b29f8c8ddc4dd67586e6623534821502b7a71570532c5a", "viewBox": "0 0 400 1173"},
  "routes-fr-desktop": {"rawHash": "d458af073ea92cafe06864e60f82f83c9e7b04a62629f1acbc288563bb765a43", "domHash": "840a19a18c5fb9f0695e4e1884d2aed0874fe66fd3ac93253e0fbc6a3122699f", "viewBox": "0 0 1000 886"},
  "routes-fr-mobile": {"rawHash": "3294f96914c439c82bb8d83a5be701286e9419c653343cc61edd1a6f316cddca", "domHash": "4d7d43d02d9cd3eddf9b92d3e4aef8c1f5c874e6898e1d7cd5daad095904c9c0", "viewBox": "0 0 400 1221"},
  "routes-en-desktop": {"rawHash": "02ca5b7939b77e80f5498361bc76f8431586d9959f7d764eac4b8a8a3ebad2da", "domHash": "ee6dfd56ecf4b2ba7d9e965d2461773b0d48388100d590ddae0a86436ffb607c", "viewBox": "0 0 1000 886"},
  "routes-en-mobile": {"rawHash": "a624f32e1042998c6445b652178095bcd0802805a6d16dba4b62980cad1be5ce", "domHash": "9fad185a75a6a62065a3749b55d9edb5ce225d26c77a92515cd2d0f7437a14f7", "viewBox": "0 0 400 1221"},
  "export-fr-desktop": {"rawHash": "1c386fea187323a50133fb7017f6dc36c4df7917c0100a76590fc7afffdf1235", "domHash": "3ca373eea0710be58b36b575969b56c506ff85264514890e52020b6aef6fba78", "viewBox": "0 0 1000 884"},
  "export-fr-mobile": {"rawHash": "c0ef18377338b2aeffdb1ad20ea7a13229d8d6fb06eeb97c705a8d91601f3ad0", "domHash": "1633774d860e3f9c6f683b2b54a04a3c79d08fa51c74a24ef27fa0719065419a", "viewBox": "0 0 400 1311"},
  "export-en-desktop": {"rawHash": "29a990dd83101fb483b7690fb9bcfeb8cf6f5628ed2e80a9effa0cc8d55d2abf", "domHash": "c6906c2021823bdba518821acb5da0033f66a4313de96b02a85117edb52139a0", "viewBox": "0 0 1000 884"},
  "export-en-mobile": {"rawHash": "190fa81079bd526af042d3325cbbdecb3a0be143a964043cf8df7671d6128d18", "domHash": "0e054ac2451cd2a9e00f89bd5ba6709f15f82d5c66a849356cd2218471b092c2", "viewBox": "0 0 400 1311"},
  "autonomy-fr-desktop": {"rawHash": "e3c6f344a02703fb0b45d42fb3f7173258452db0f53c196beb71bd282dd09e20", "domHash": "cda22f01fb24ca5dd31536d9660073d8455121fdfe8d6bd41414816a21762f26", "viewBox": "0 0 1000 880"},
  "autonomy-fr-mobile": {"rawHash": "32ea7b9fcfd896dff3e4c060ddae311a59a17f7bea2ec1be51f850b8f8ece3c7", "domHash": "d37f5bb761d42ff1cced8c2290ccffe9b57fa20a2809dd0cf14dc27641a744b9", "viewBox": "0 0 400 1453"},
  "autonomy-en-desktop": {"rawHash": "4b14015d2bda0ea1a17997d9e1abe74c527a43830b3c135a1c2e82727ed78276", "domHash": "66cb2636d48bf2909aaad3573908abc800b6141cc8de4ffdc09fb033970fb757", "viewBox": "0 0 1000 880"},
  "autonomy-en-mobile": {"rawHash": "52c6c35ecd8f0541172dc5e6073e73998212712b9d49a980f5404bbf797d01d1", "domHash": "287395a830aa72bc34b903ef18cc421ba10b8d68163e7f947daa527162c3e51e", "viewBox": "0 0 400 1453"}
};
const sourceUrls = {
  "4": "https://doctolib.zendesk.com/hc/fr/articles/30839804494996-Comment-utiliser-l-Assistant-de-consultation-avec-Doctolib-M%C3%A9decin",
  "5": "https://doctolib.zendesk.com/hc/fr/articles/31108321772436-M-informer-sur-la-confidentialit%C3%A9-et-la-s%C3%A9curit%C3%A9-des-donn%C3%A9es-de-l-Assistant-de-consultation",
  "9": "https://academic.oup.com/jamia/article/33/5/990/8494986",
  "11": "https://www.autoritedelaconcurrence.fr/en/press-release/autorite-fines-doctolib-eu4665000-abusing-its-dominant-position-online-medical",
  "12": "https://www.autoritedelaconcurrence.fr/sites/default/files/integral_texts/2025-11/25d06_version_publique.pdf",
  "13": "https://www.autoritedelaconcurrence.fr/fr/decision/relative-des-pratiques-mises-en-oeuvre-dans-le-secteur-de-la-prise-de-rendez-vous-medicaux",
  "14": "https://about.doctolib.com/news/doctolib-will-appeal-the-decision-of-the-french-competition-authority/",
  "6": "https://doctolib.zendesk.com/hc/fr/articles/37479338946452-Comment-utiliser-l-Assistant-de-consultation-autonome",
  "7": "https://doctolib.zendesk.com/hc/fr/articles/4767400892308-Exporter-ma-base-patients-Doctolib-M%C3%A9decin",
  "8": "https://doctolib.zendesk.com/hc/fr/articles/4409598721940-Exporter-un-dossier-patient-dans-Doctolib-M%C3%A9decin",
  "15": "https://esante.gouv.fr/ens/offre/ci-sis",
  "1": "https://about.doctolib.fr/news/doctolib-va-accelerer-dans-lia-en-sante-grace-a-un-investissement-de-nvidia/",
  "2": "https://community.doctolib.fr/t/nvidia-rejoint-doctolib-pour-accelerer-lia-en-sante-en-europe/203785",
  "10": "https://esante.gouv.fr/produits-services/hds"
};
const scopes = {
  "lifecycle": "Documented retention rules, not a measured retention audit. Separate 48-hour periods start at different events; no combined period inferred.",
  "evidence": "Published study Table 3. Adjusted B minus A time differences, minutes, 95% confidence intervals. US 2024 trial; publication 23 February 2026. Not a test of Doctolib.",
  "network": "Historical network mechanism assessed in decision 25-D-06, which is under appeal. Workflow dependence is a conditional analytical extension, not a finding about current AI conduct.",
  "routes": "Two documented product workflows. No claim that the models or performance are identical. No universal automatic connector is asserted.",
  "export": "45-file CSV count is documented. Identifiers P7, C12 and D4 are fictional and do not reproduce actual export columns. The two-month window concerns retrieval after preparation.",
  "autonomy": "Analytical tests at vendor and practice levels; neither infrastructure portability nor a complete practice migration has been tested here."
};
const kinds = ["lifecycle", "evidence", "network", "routes", "export", "autonomy"];
const figureSources = {"lifecycle": [4, 5], "evidence": [9], "network": [11, 12, 13, 14], "routes": [4, 6], "export": [7, 8, 15], "autonomy": [1, 2, 7, 10, 15]};
const variants = ['fr', 'en'].flatMap(lang => kinds.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, key: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: doctolibChoicesSvg(lang, kind, mobile) }))));
const articles = ['fr', 'en'].map(lang => ({ lang, raw: read(`src/content/${lang === 'fr' ? 'posts/doctolib-nvidia-liberte-changer-outil' : 'posts-en/doctolib-nvidia-freedom-to-switch-tools'}.mdx`) }));
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
  svg: 'xmlns viewBox role aria-labelledby style data-doctolib-kind',
  g: 'data-outcome data-value data-lower data-upper',
  title: 'id', desc: 'id', metadata: '',
  rect: 'x y width height rx fill stroke stroke-width stroke-dasharray opacity',
  text: 'x y fill font-family font-size font-weight text-anchor',
  line: 'x1 y1 x2 y2 stroke stroke-width stroke-dasharray',
  circle: 'cx cy r fill stroke stroke-width',
  path: 'd fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray opacity',
}).map(([k, v]) => [k, new Set(v ? v.split(' ') : [])]));
const paints = new Set(['none',
  'var(--color-accent, #ff4d87)', 'var(--color-amber, #f5b13d)',
  'var(--color-ink, #0c0d10)', 'var(--color-muted, #8b909b)',
  'var(--color-paper, #e7e9ee)', 'var(--color-signal, #5eead4)',
  'var(--color-surface, #121419)', 'var(--color-surface-2, #171a20)',
  'var(--color-topic-blue, #7aa2f7)',
  'var(--color-line-strong, rgba(255, 255, 255, 0.20))',
]);
const numeric = new Set('x y x1 y1 x2 y2 width height rx cx cy r font-size stroke-width data-value data-lower data-upper'.split(' '));
function number(value) {
  assert.equal(typeof value, 'string');
  assert.ok(value.length > 0 && value.length <= 32);
  assert.match(value, /^-?(?:\d{1,4}(?:\.\d{1,16})?|\.\d{1,16})$/u);
  const n = Number(value); assert.ok(Number.isFinite(n) && Math.abs(n) <= 10000);
  return n;
}
const value = (n, k, fallback = '0') => number(attrs(n)[k] ?? fallback);
// Complete bounded parser for the supplied absolute commands, with quadratic,
// cubic and reflected T control points. Every character must be consumed.
function curvePoints(p) {
  assert.ok([3, 4].includes(p.length) && p.flat().every(Number.isFinite));
  const points = [p[0], p.at(-1)];
  const at = t => p.length === 3
    ? [0, 1].map(k => (1 - t) ** 2 * p[0][k] + 2 * (1 - t) * t * p[1][k] + t ** 2 * p[2][k])
    : [0, 1].map(k => (1 - t) ** 3 * p[0][k] + 3 * (1 - t) ** 2 * t * p[1][k] + 3 * (1 - t) * t ** 2 * p[2][k] + t ** 3 * p[3][k]);
  for (const k of [0, 1]) {
    let roots;
    if (p.length === 3) {
      const denominator = p[0][k] - 2 * p[1][k] + p[2][k];
      roots = denominator === 0 ? [] : [(p[0][k] - p[1][k]) / denominator];
    } else {
      const a = -p[0][k] + 3 * p[1][k] - 3 * p[2][k] + p[3][k];
      const b = 2 * (p[0][k] - 2 * p[1][k] + p[2][k]);
      const c = p[1][k] - p[0][k], discriminant = b * b - 4 * a * c;
      roots = Math.abs(a) < 1e-12 ? (Math.abs(b) < 1e-12 ? [] : [-c / b])
        : discriminant < 0 ? [] : [(-b - Math.sqrt(discriminant)) / (2 * a), (-b + Math.sqrt(discriminant)) / (2 * a)];
    }
    for (const t of roots) if (t > 0 && t < 1) points.push(at(t));
  }
  assert.ok(points.flat().every(Number.isFinite)); return points;
}
function pathPoints(raw) {
  assert.equal(typeof raw, 'string'); assert.ok(raw.length > 0 && raw.length <= 8192);
  const token = /[MLHVZCQT]|-?(?:\d{1,4}(?:\.\d{1,16})?|\.\d{1,16})/uy;
  const tokens = []; let offset = 0;
  while (offset < raw.length) {
    if (/\s/u.test(raw[offset])) { offset++; continue; }
    token.lastIndex = offset; const match = token.exec(raw); assert.ok(match, 'Complete path token');
    tokens.push(match[0]); assert.ok(tokens.length <= 2048); offset = token.lastIndex;
  }
  assert.equal(tokens[0], 'M'); const points = []; let i = 0, current, origin, quadraticControl, count = 0;
  const pair = () => [number(tokens[i++]), number(tokens[i++])];
  while (i < tokens.length) {
    const command = tokens[i++]; assert.ok(['M', 'L', 'H', 'V', 'Z', 'C', 'Q', 'T'].includes(command));
    assert.ok(++count <= 512);
    if (command === 'Z') { assert.ok(origin); current = [...origin]; quadraticControl = undefined; }
    else if (command === 'M' || command === 'L') {
      if (command === 'L') assert.ok(current);
      current = pair(); quadraticControl = undefined;
      if (command === 'M') origin = [...current];
    } else if (command === 'H' || command === 'V') {
      assert.ok(current); current = [...current]; current[command === 'H' ? 0 : 1] = number(tokens[i++]); quadraticControl = undefined;
    } else {
      assert.ok(current); let controls;
      if (command === 'C') { controls = [pair(), pair()]; quadraticControl = undefined; }
      else {
        const control = command === 'Q' ? pair() : quadraticControl ? [2 * current[0] - quadraticControl[0], 2 * current[1] - quadraticControl[1]] : [...current];
        controls = [control]; quadraticControl = control;
      }
      const end = pair(); points.push(...curvePoints([current, ...controls, end])); current = end;
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
  const prefix = `dn-${v.kind}-${v.lang}-${v.mobile ? 'mobile' : 'desktop'}`;
  assert.deepEqual(attrs(root), { xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[v.key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto', 'data-doctolib-kind': v.kind });
  const nodes = xmlNodes(root); assert.ok(nodes.length < 512);
  const ids = [];
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
      if (k === 'font-family') assert.equal(val, 'Arial, Helvetica, sans-serif');
      if (k === 'font-weight') assert.ok(['400', '700'].includes(val));
      if (k === 'font-size') assert.ok(number(val) >= 13 && number(val) <= 64);
      if (k === 'text-anchor') assert.ok(['start', 'middle', 'end'].includes(val));
      if (k === 'stroke-dasharray') assert.ok(['5 5', '6 5', '7 5'].includes(val));
      if (k === 'stroke-linecap' || k === 'stroke-linejoin') assert.equal(val, 'round');
      if (k === 'd') pathPoints(val);
      if (k === 'data-outcome') assert.ok(['notes', 'outside'].includes(val));
      if (k === 'data-doctolib-kind') assert.equal(val, v.kind);
      if (k === 'opacity') assert.fail('No authored Doctolib opacity');
      if (k === 'transform') assert.fail('No authored Doctolib transforms');
    }
  }
  assert.deepEqual(ids.sort(), [`${prefix}-desc`, `${prefix}-title`]);

  for (const type of ['title', 'desc', 'metadata']) { const found = nodes.filter(n => tag(n) === type); assert.equal(found.length, 1); assert.ok(xmlText(found[0]).trim()); }
  const meta = JSON.parse(xmlText(nodes.find(n => tag(n) === 'metadata')));
  assert.deepEqual(meta, { asOf: '2026-10-15', kind: v.kind, lang: v.lang, variant: v.mobile ? 'mobile' : 'desktop', sources: figureSources[v.kind], scope: scopes[v.kind], sourceUrls: figureSources[v.kind].map(id => sourceUrls[id]) });
  const [, , width, height] = attrs(root).viewBox.split(' ').map(number);
  return { root, nodes, width, height };
}
function faithful(v) {
  inspect(v);
  assert.equal(digest(v.svg), originals[v.key].rawHash, `${v.key}: approved source bytes preserved`);
  assert.equal(domHash(v.svg), originals[v.key].domHash, `${v.key}: complete browser SVG tree`);
}
const mutate = (v, change) => { const root = parser.parse(v.svg)[0]; change(root, xmlNodes(root)); return { ...v, svg: builder.build([root]) }; };
const fontFrom = file => {
  const bytes = readFileSync(new URL(`../${file}`, import.meta.url));
  return opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
};
const fonts = Object.fromEntries([400, 700].map(w => [w, fontFrom(`public/fonts/doctolib-choices/liberation-sans-${w}.ttf`)]));
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
  const advance = font.getAdvanceWidth(label, size);
  const x = value(n, 'x') - (attrs(n)['text-anchor'] === 'middle' ? advance / 2 : attrs(n)['text-anchor'] === 'end' ? advance : 0);
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
  const { nodes, width, height } = inspect(v), canvas = { x: 0, y: 0, right: width, bottom: height };
  const shapes = nodes.filter(n => ['rect', 'circle', 'line', 'path', 'text'].includes(tag(n)));
  const panels = shapes.filter(n => tag(n) === 'rect' && value(n, 'rx') >= 9 && value(n, 'x') > 1 && value(n, 'width') >= 100 && value(n, 'height') >= 40).map(shapeBox);
  const labels = [];
  for (const n of shapes) {
    if (tag(n) !== 'text') {
      const b = shapeBox(n), stroke = attrs(n).stroke && attrs(n).stroke !== 'none' ? value(n, 'stroke-width', '1') / 2 : 0;
      assert.ok(within({ x: b.x - stroke, y: b.y - stroke, right: b.right + stroke, bottom: b.bottom + stroke }, canvas, .01), `${v.key}: shape outside viewBox`);
      continue;
    }
    const b = textBox(n);
    assert.ok(within(b, canvas, .01), `${v.key}: text outside viewBox: ${b.label}`);
    const centre = { x: (b.x + b.right) / 2, y: (b.y + b.bottom) / 2, right: (b.x + b.right) / 2, bottom: (b.y + b.bottom) / 2 };
    const panel = panels.filter(p => within(centre, p)).at(-1);
    if (panel) assert.ok(within(b, panel, .1), `${v.key}: text outside panel: ${b.label}`);
    for (const prior of labels) assert.ok(!overlaps(b, prior), `${v.key}: labels overlap: ${b.label} / ${prior.label}`);
    labels.push(b);
  }
}
test('Doctolib choices variant selection is frozen, complete and rejects prototypes or coercion', () => {
  assert.deepEqual(DOCTOLIB_CHOICES_KINDS, kinds); assert.ok(Object.isFrozen(DOCTOLIB_CHOICES_KINDS)); assert.equal(variants.length, 24);
  for (const lang of ['', 'FR', '__proto__', 'constructor', {}, null, ['fr']]) assert.throws(() => doctolibChoicesSvg(lang, 'lifecycle', false), TypeError);
  for (const kind of ['', '__proto__', 'constructor', 'prototype', {}, null, ['lifecycle']]) assert.throws(() => doctolibChoicesSvg('fr', kind, false), TypeError);
  for (const mobile of [0, 1, '', 'false', null, new Boolean(false), {}, []]) assert.throws(() => doctolibChoicesSvg('fr', 'lifecycle', mobile), TypeError);
  assert.equal(doctolibChoicesSvg('fr', 'lifecycle'), doctolibChoicesSvg('fr', 'lifecycle', false));
});
test('twenty supplied SVGs retain all bytes and four lifecycle variants only clarify metadata timing', () => { for (const v of variants) faithful(v); });
test('all original shapes and font glyphs remain in viewBox and panels', () => {
  const issues = []; for (const v of variants) { try { geometry(v); } catch (error) { issues.push(error.message); } }
  assert.deepEqual(issues, []);
});
test('geometry checks reject shape overflow and overlapping ink', () => {
  const v = variants[0];
  for (const change of [
    (_, ns) => { attrs(ns.find(n => tag(n) === 'rect')).x = '9999'; },
    (_, ns) => { attrs(ns.find(n => tag(n) === 'text')).x = '-10'; },
    (_, ns) => { const root = ns[0], label=ns.find(n => tag(n)==='text'); root.svg.push(JSON.parse(JSON.stringify(label))); },
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
test('complete M/L/H/V/Z/C/Q/T parsing computes actual curve extrema and reflected controls', () => {
  assert.deepEqual(pathPoints('M0 0 H10 V20 L30 40 Z M5 6 L7 8'), [[0, 0], [10, 0], [10, 20], [30, 40], [0, 0], [5, 6], [7, 8]]);
  const q = pointsBox(pathPoints('M0 0 Q10 20 20 0'));
  assert.deepEqual(q, { x: 0, y: 0, right: 20, bottom: 10 });
  const cubic = pointsBox(pathPoints('M0 0 C0 20 20 20 20 0'));
  assert.deepEqual(cubic, { x: 0, y: 0, right: 20, bottom: 15 });
  const smooth = pointsBox(pathPoints('M0 0 Q10 20 20 0 T40 0'));
  assert.deepEqual(smooth, { x: 0, y: -10, right: 40, bottom: 10 });
  const reset = pointsBox(pathPoints('M0 0 Q10 20 20 0 L30 0 T40 0'));
  assert.deepEqual(reset, { x: 0, y: 0, right: 40, bottom: 10 });
  assert.deepEqual(pointsBox(pathPoints('M0 0 T20 10')), { x: 0, y: 0, right: 20, bottom: 10 });
  assert.ok(pathPoints('M79.53999999999999 351.02 L0 0').flat().every(Number.isFinite));
});
test('path validation rejects malformed, unconsumed and excessive work within a child deadline', () => {
  const bad = ['L0 0', 'M0', 'M0 0 trailing', 'M0 0 1 1', 'MNaN 0', 'M1e999 0', 'M0,,0',
    'M0 0 C1 2 3 4 5', 'M0 0 Q1 2 3', 'M0 0 T1', 'M0 0 C1 2 3 4 5 6 trailing',
    'M0 0 H', 'M0 0 V', 'M0 0 A1 1 0 0 0 1 1', 'M0 0 q1 2 3 4', 'M0 0 S1 2 3 4',
    'M10001 0', 'M0 0 L99999 0', 'M' + '.'.repeat(8000) + ' 0', 'M' + '9'.repeat(8000) + ' 0',
    'M0.' + '9'.repeat(8000) + ' 0', 'M0 0 ' + 'L1 1 '.repeat(513), 'M0 0 ' + 'C1 1 1 1 1 1 '.repeat(300)];
  for (const raw of bad) assert.throws(() => pathPoints(raw));
  for (const raw of ['', null, {}, [], 0, new String('M0 0')]) assert.throws(() => pathPoints(raw));
  const code = `import assert from 'node:assert/strict'; const number=${number.toString()}; const curvePoints=${curvePoints.toString()}; const paths=${pathPoints.toString()}; for(let i=0;i<100;i++) for(const raw of ${JSON.stringify(bad)}) assert.throws(()=>paths(raw));`;
  execFileSync(process.execPath, ['--input-type=module', '-e', code], { timeout: 5000, maxBuffer: 8192, stdio: 'pipe' });
});
// Read bounded sfnt names directly. The installed outline parser intentionally
// omits name records, and the source job must not depend on Python/fontTools.
function fontNames(bytes) {
  assert.ok(Buffer.isBuffer(bytes) && bytes.length >= 12 && bytes.length < 2_000_000);
  assert.equal(bytes.readUInt32BE(0), 0x00010000, 'Authored TrueType sfnt');
  const count = bytes.readUInt16BE(4);
  assert.ok(count > 0 && count <= 128 && 12 + count * 16 <= bytes.length);
  const nameTables = [];
  for (let i = 0; i < count; i++) {
    const row = 12 + i * 16;
    if (bytes.toString('ascii', row, row + 4) === 'name') nameTables.push({ offset: bytes.readUInt32BE(row + 8), length: bytes.readUInt32BE(row + 12) });
  }
  assert.equal(nameTables.length, 1, 'Exactly one font name table');
  const { offset, length } = nameTables[0], end = offset + length;
  assert.ok(offset >= 12 + count * 16 && length >= 6 && end <= bytes.length, 'Bounded name table');
  assert.equal(bytes.readUInt16BE(offset), 0, 'Supported native name-table format');
  const recordCount = bytes.readUInt16BE(offset + 2), storage = offset + bytes.readUInt16BE(offset + 4);
  assert.ok(recordCount > 0 && recordCount <= 1024 && offset + 6 + recordCount * 12 <= storage && storage <= end);
  const records = [];
  for (let i = 0; i < recordCount; i++) {
    const row = offset + 6 + i * 12, platform = bytes.readUInt16BE(row), encoding = bytes.readUInt16BE(row + 2), language = bytes.readUInt16BE(row + 4), id = bytes.readUInt16BE(row + 6), size = bytes.readUInt16BE(row + 8), start = storage + bytes.readUInt16BE(row + 10);
    assert.ok([0, 1, 3].includes(platform) && start >= storage && start + size <= end, 'Bounded supported font name record');
    const raw = Buffer.from(bytes.subarray(start, start + size));
    if (platform === 0 || platform === 3) assert.equal(raw.length % 2, 0, 'UTF-16 font name');
    const value = platform === 0 || platform === 3 ? raw.swap16().toString('utf16le') : raw.toString('latin1');
    records.push({ platform, encoding, language, id, value });
  }
  return records;
}
function renamedSubsetNames(subset, original, weight) {
  const style = weight === 400 ? 'Regular' : 'Bold';
  assert.ok([400, 700].includes(weight));
  for (const id of [1, 2, 3, 4, 6]) assert.ok(subset.some(n => n.id === id), 'Required renamed subset name');
  assert.ok(original.some(n => n.id === 0), 'Original copyright record');
  assert.deepEqual(subset.filter(n => n.id === 0), original.filter(n => n.id === 0), 'Every original copyright record remains unchanged');
  for (const record of subset.filter(n => [1, 2, 3, 4, 6, 16, 17, 18].includes(n.id))) {
    assert.doesNotMatch(record.value, /Liberation|Arimo|Tinos|Cousine/iu, 'Reserved font names absent from derivative names');
    if ([1, 16].includes(record.id)) assert.equal(record.value, 'l0g Choices Sans');
    if ([2, 17].includes(record.id)) assert.equal(record.value, style);
    if ([3, 4, 18].includes(record.id)) assert.equal(record.value, `l0g Choices Sans ${style}`);
    if (record.id === 6) assert.equal(record.value, `l0gChoicesSans-${style}`);
  }
}
test('redistributed font subsets retain copyrights and use the licensed derivative family name', () => {
  for (const weight of [400, 700]) {
    const subsetBytes = readFileSync(new URL(`../public/fonts/doctolib-choices/liberation-sans-${weight}.ttf`, import.meta.url));
    const originalBytes = readFileSync(new URL(`../src/epub-assets/debt-chain-fonts/liberation-sans-${weight}.ttf`, import.meta.url));
    renamedSubsetNames(fontNames(subsetBytes), fontNames(originalBytes), weight);
    for (const bytes of [Buffer.alloc(0), subsetBytes.subarray(0, 12), subsetBytes.subarray(0, 128)]) assert.throws(() => fontNames(bytes));
    const invalid = Buffer.from(subsetBytes); invalid.writeUInt16BE(65535, 4); assert.throws(() => fontNames(invalid));
    const subset = fontNames(subsetBytes), original = fontNames(originalBytes);
    for (const id of [0, 1, 2, 3, 4, 6]) {
      const changed = subset.map(record => ({ ...record, value: record.id === id ? 'Liberation Sans' : record.value }));
      assert.throws(() => renamedSubsetNames(changed, original, weight));
    }
    assert.throws(() => renamedSubsetNames(subset.filter(record => record.id !== 1), original, weight));
  }
});
test('dedicated fonts retain every original glyph outline, metrics and canonical complete licence', () => {
  const licence = read('public/fonts/doctolib-choices/LICENSE.txt'); assertFontLicenseReferences(licence, 'liberation');
  assert.equal(licence, read('src/epub-assets/debt-chain-fonts/liberation-LICENSE.txt'));
  for (const weight of [400, 700]) {
    const font = fonts[weight], original = fontFrom(`src/epub-assets/debt-chain-fonts/liberation-sans-${weight}.ttf`);
    assert.deepEqual([font.unitsPerEm, font.ascender, font.descender], [original.unitsPerEm, original.ascender, original.descender]);
    const characters = new Set(variants.flatMap(v => inspect(v).nodes.filter(n => tag(n) === 'text' && attrs(n)['font-weight'] === String(weight)).flatMap(n => [...xmlText(n)])));
    for (const c of characters) {
      assert.ok(font.charToGlyphIndex(c) > 0); const a = font.charToGlyph(c), b = original.charToGlyph(c);
      assert.equal(a.advanceWidth, b.advanceWidth); assert.deepEqual(a.getPath(0, 0, font.unitsPerEm).commands, b.getPath(0, 0, original.unitsPerEm).commands);
    }
  }
});
test('responsive component uses compact article proportions, charter tokens and dedicated fonts', () => {
  const component = read('src/components/DoctolibChoicesFigure.astro'), styles = component.match(/<style>([\s\S]*?)<\/style>/u); assert.ok(styles);
  const css = postcss.parse(styles[1]), declarations = n => Object.fromEntries(n.nodes.filter(d => d.type === 'decl').map(d => [d.prop, d.value]));
  const base = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.doctolib-choices-figure'));
  assert.deepEqual([base.width, base['max-width'], base['container-type'], base['padding-bottom']], ['100%', '760px', 'inline-size', '.85rem']);
  assert.equal(base.overflow, 'visible');
  const graphic = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.doctolib-choices-figure :global(svg)'));
  assert.deepEqual([graphic.width, graphic.height, graphic.overflow, graphic['letter-spacing']], ['100%', 'auto', 'visible', 'normal']);
  const labelFont = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.doctolib-choices-figure :global(svg text)'));
  assert.equal(labelFont['font-family'], "'l0g Doctolib Choices', 'Liberation Sans', Arial, sans-serif");
  const mobile = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.doctolib-choices-mobile'));
  assert.deepEqual([mobile.display, mobile.width, mobile['max-width'], mobile['margin-inline']], ['none', '100%', '400px', 'auto']);
  for (const kind of ['media', 'container']) {
    const rule = css.nodes.find(n => n.type === 'atrule' && n.name === kind && n.params === '(max-width: 640px)'); assert.ok(rule);
    assert.deepEqual(rule.nodes.map(n => [n.selector, declarations(n).display]), [['.doctolib-choices-desktop', 'none'], ['.doctolib-choices-mobile', 'block']]);
  }
  const faces = css.nodes.filter(n => n.type === 'atrule' && n.name === 'font-face').map(n => declarations(n));
  assert.deepEqual(faces.map(d => [d['font-family'], d.src, d['font-weight'], d['font-style']]), [400, 700].map(w => ["'l0g Doctolib Choices'", `url('/fonts/doctolib-choices/liberation-sans-${w}.ttf') format('truetype')`, String(w), 'normal']));
  assert.doesNotMatch(styles[1], /#(?:[a-f0-9]{3}){1,2}\b|(?:clip-path|overflow\s*:\s*hidden|transform\s*:|100vw)/iu);
  const themes = { dark: new Map(), light: new Map() };
  postcss.parse(read('src/styles/global.css')).walkDecls(d => { if (d.parent.type === 'atrule' && d.parent.name === 'theme') themes.dark.set(d.prop, d.value); if (d.parent.type === 'rule' && d.parent.selector === ':root[data-theme="light"]') themes.light.set(d.prop, d.value); });
  for (const theme of Object.values(themes)) for (const token of ['ink', 'paper', 'surface', 'surface-2', 'muted', 'signal', 'amber', 'accent', 'topic-blue', 'line-strong']) assert.ok(theme.has(`--color-${token}`));
});
const mdxNodes = n => [n, ...(n.children ?? []).flatMap(mdxNodes)];
const mdxText = n => n.type === 'text' ? n.value : (n.children ?? []).map(mdxText).join('');
const mdxBody = raw => raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u, '');
function articleFigures(raw, lang) {
  const tree = createProcessor().parse(mdxBody(raw));
  const figures = mdxNodes(tree).filter(n => n.name === 'DoctolibChoicesFigure'); assert.equal(figures.length, 6);
  for (const [i, figure] of figures.entries()) {
    assert.deepEqual(figure.attributes.map(a => a.name), ['lang', 'kind', 'number', 'sources', 'caption']);
    assert.ok(figure.attributes.every(a => a.type === 'mdxJsxAttribute'));
    const fields = Object.fromEntries(figure.attributes.map(a => [a.name, a.value]));
    assert.deepEqual(['lang', 'kind', 'number', 'sources'].map(k => fields[k]), [lang, kinds[i], String(i + 1).padStart(2, '0'), figureSources[kinds[i]].join(' ')]);
    const caption = fields.caption;
    if (typeof caption === 'string') assert.ok(caption.length > 100);
    else {
      assert.equal(caption.type, 'mdxJsxAttributeValueExpression');
      const program = caption.data.estree; assert.equal(program.type, 'Program'); assert.equal(program.body.length, 1);
      const expression = program.body[0]; assert.equal(expression.type, 'ExpressionStatement'); assert.equal(expression.expression.type, 'Literal');
      assert.equal(typeof expression.expression.value, 'string'); assert.ok(expression.expression.value.length > 100);
    }
    const details = mdxNodes(figure).filter(n => n.name === 'details'); assert.equal(details.length, 1);
    assert.equal(mdxNodes(details[0]).filter(n => n.name === 'summary').length, 1); assert.ok(mdxText(details[0]).length > 150);
  }
  const headings = mdxNodes(tree).filter(n => n.type === 'heading').map(mdxText);
  for (const title of headings) assert.doesNotMatch(title, /ce qu[ei’']|ce qui|ce que|what .*(?:reveals|means)|what happens behind|, (?:pas|not) /iu);
  assert.doesNotMatch(raw, /deux horloges|2 horloges|two clocks|—/iu);
}
test('six article figures per language preserve native MDX order, static captions, references and method notes', () => {
  for (const { lang, raw } of articles) articleFigures(raw, lang);
});
test('article figure contracts reject wrong kinds, source references and executable captions', () => {
  const raw = mdxBody(articles[0].raw);
  for (const [a, b] of [['kind="lifecycle"', 'kind="autonomy"'], ['number="01"', 'number="06"'], ['sources="4 5"', 'sources="4 99"'], ['lang="fr"', 'lang="en"']]) assert.throws(() => articleFigures(raw.replace(a, b), 'fr'));
  const first = mdxNodes(createProcessor().parse(raw)).find(n => n.name === 'DoctolibChoicesFigure');
  const attribute = first.attributes.find(a=>a.name==='caption');
  const invalid = raw.slice(0, attribute.position.start.offset) + 'caption={process.env.SECRET}' + raw.slice(attribute.position.end.offset);
  assert.throws(() => articleFigures(invalid, 'fr'));
});

const outcomes = [{id:'notes',value:-3.19,lower:-4.87,upper:-1.50},{id:'outside',value:-2.19,lower:-4.74,upper:.37}];
function trialGeometry(v) {
  const {nodes}=inspect(v), groups=nodes.filter(n=>tag(n)==='g');
  assert.equal(groups.length, v.kind==='evidence'?2:0);
  if(v.kind!=='evidence') return;
  const scale=v.mobile?38.5:58.125, start=v.mobile?46:465;
  const x=value=>start+(value+6)*scale;
  const close=(a,b)=>assert.ok(Math.abs(a-b)<.001, `${v.key}: interval scale ${a} / ${b}`);
  for(const [i,g] of groups.entries()) {
    const d=outcomes[i];
    assert.deepEqual(attrs(g), {'data-outcome':d.id,'data-value':String(d.value),'data-lower':String(d.lower),'data-upper':String(d.upper)});
    const children=xmlNodes(g), lines=children.filter(n=>tag(n)==='line'), dots=children.filter(n=>tag(n)==='circle');
    assert.equal(lines.length,3);assert.equal(dots.length,1);
    close(value(lines[0],'x1'),x(d.lower));close(value(lines[0],'x2'),x(d.upper));
    close(value(dots[0],'cx'),x(d.value));
    close(value(lines[0],'y1'),value(lines[0],'y2'));close(value(dots[0],'cy'),value(lines[0],'y1'));
    for(const [j,cap] of lines.slice(1).entries()) {close(value(cap,'x1'),x(j?d.upper:d.lower));close(value(cap,'x2'),x(j?d.upper:d.lower));close(value(cap,'y1'),value(lines[0],'y1')-(v.mobile?8:9));close(value(cap,'y2'),value(lines[0],'y1')+(v.mobile?8:9));}
  }
}
test('trial differences and confidence intervals retain their common linear scale and named scope',()=>{for(const v of variants) trialGeometry(v);});
test('trial geometry rejects altered values, interval bounds, cap positions and point locations',()=>{
  for(const v of variants.filter(v=>v.kind==='evidence')) for(const change of [
    (_,ns)=>{attrs(ns.find(n=>tag(n)==='g'))['data-value']='0';},
    (_,ns)=>{attrs(ns.find(n=>tag(n)==='g'))['data-upper']='0';},
    (_,ns)=>{attrs(ns.find(n=>tag(n)==='g').g.find(n=>tag(n)==='line')).x1='0';},
    (_,ns)=>{attrs(ns.find(n=>tag(n)==='circle')).cx='0';},
  ]) assert.throws(()=>trialGeometry(mutate(v,change)));
});

const reviewedReferences = [[["https://about.doctolib.fr/news/doctolib-va-accelerer-dans-lia-en-sante-grace-a-un-investissement-de-nvidia/","Doctolib va accélérer dans l’IA en santé grâce à un investissement de NVIDIA"]],[["https://community.doctolib.fr/t/nvidia-rejoint-doctolib-pour-accelerer-lia-en-sante-en-europe/203785","NVIDIA rejoint Doctolib pour accélérer l’IA en santé, en Europe"]],[["https://live.euronext.com/en/financial-news/nvidia-buys-stakes-french-tech-startups-doctolib-genesis-ai","Nvidia buys stakes in French tech startups Doctolib, Genesis AI"]],[["https://doctolib.zendesk.com/hc/fr/articles/30839804494996-Comment-utiliser-l-Assistant-de-consultation-avec-Doctolib-M%C3%A9decin","Comment utiliser l’Assistant de consultation avec Doctolib Médecin ?"]],[["https://doctolib.zendesk.com/hc/fr/articles/31108321772436-M-informer-sur-la-confidentialit%C3%A9-et-la-s%C3%A9curit%C3%A9-des-donn%C3%A9es-de-l-Assistant-de-consultation","Confidentialité et sécurité des données de l’Assistant de consultation"]],[["https://doctolib.zendesk.com/hc/fr/articles/37479338946452-Comment-utiliser-l-Assistant-de-consultation-autonome","Comment utiliser l’Assistant de consultation autonome ?"]],[["https://doctolib.zendesk.com/hc/fr/articles/4767400892308-Exporter-ma-base-patients-Doctolib-M%C3%A9decin","Exporter ma base patients Doctolib Médecin"]],[["https://doctolib.zendesk.com/hc/fr/articles/4409598721940-Exporter-un-dossier-patient-dans-Doctolib-M%C3%A9decin","Exporter un dossier patient dans Doctolib Médecin"]],[["https://academic.oup.com/jamia/article/33/5/990/8494986","Comparing ambient scribes: a randomized crossover clinical trial addressing ambient scribe technologies’ impact on physician burnout"]],[["https://esante.gouv.fr/produits-services/hds","Certification HDS : tout savoir"]],[["https://www.autoritedelaconcurrence.fr/en/press-release/autorite-fines-doctolib-eu4665000-abusing-its-dominant-position-online-medical","The Autorité fines Doctolib €4,665,000 for abusing its dominant position"]],[["https://www.autoritedelaconcurrence.fr/sites/default/files/integral_texts/2025-11/25d06_version_publique.pdf","Décision 25-D-06, version publique"]],[["https://www.autoritedelaconcurrence.fr/fr/decision/relative-des-pratiques-mises-en-oeuvre-dans-le-secteur-de-la-prise-de-rendez-vous-medicaux","Décision 25-D-06 : suivi du recours"]],[["https://about.doctolib.com/news/doctolib-will-appeal-the-decision-of-the-french-competition-authority/","Doctolib will appeal the decision of the French Competition Authority"]],[["https://esante.gouv.fr/ens/offre/ci-sis","CI-SIS : Cadre d’interopérabilité des systèmes d’information de santé"]],[["https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en","European Health Data Space Regulation"]],[["https://doctolib.zendesk.com/hc/fr/articles/15593310583700-D%C3%A9sactiver-la-r%C3%A9utilisation-des-donn%C3%A9es-par-Doctolib","Désactiver la réutilisation des données par Doctolib"]],[["https://about.doctolib.fr/expertise-medicale/","Expertise médicale"]],[["https://www.cnil.fr/fr/definir-une-finalite-0","IA : définir une finalité"]],[["https://www.cnil.fr/fr/assurer-que-le-traitement-est-licite-reutilisation-des-donnees","IA : réutilisation des données, tests et vérifications nécessaires"]]];
const sourceLinks = {fr:reviewedReferences,en:reviewedReferences};
function checkSources(raw, lang) {
  assert.equal(typeof raw, 'string'); assert.ok(raw.length < 200000);
  const all = htmlNodes(parse(raw));
  const lists = all.filter(n => n.tagName === 'ol' && htmlAttr(n, 'class') === 'doctolib-choices-sources'); assert.equal(lists.length, 1);
  assert.deepEqual(lists[0].attrs.map(a => [a.name, a.value]), [['class', 'doctolib-choices-sources']]);
  for (const n of htmlNodes(lists[0])) assert.ok(n.nodeName === '#text' || ['ol', 'li', 'a', 'strong'].includes(n.tagName), 'Passive bibliography markup');
  for (const n of htmlNodes(lists[0]).filter(n => n.tagName === 'strong')) assert.deepEqual(n.attrs, [], 'Publisher markup has no active or substituted native fields');
  const sections = htmlNodes(lists[0]).filter(n => n.tagName === 'li');
  assert.deepEqual(sections.map(n => htmlAttr(n, 'id')), sourceLinks[lang].map((_, i) => `source-${i + 1}`));
  for (const [i, section] of sections.entries()) {
    assert.deepEqual(section.attrs.map(a => [a.name, a.value]), [['id', `source-${i + 1}`]]);
    const links = htmlNodes(section).filter(n => n.tagName === 'a');
    assert.deepEqual(links.map(n => [htmlAttr(n, 'href'), htmlText(n), htmlAttr(n, 'target'), htmlAttr(n, 'rel')]), sourceLinks[lang][i].map(([url, title]) => [url, title, undefined, undefined]), `Complete source-${i + 1} fields`);
    for (const link of links) assert.deepEqual(link.attrs.map(a => a.name), ['href'], 'Only controlled native link fields');
    assert.ok(all.some(n => n.tagName === 'a' && htmlAttr(n, 'href') === `#source-${i + 1}`), `Source ${i + 1} cited`);
  }
  const ids = all.map(n => htmlAttr(n, 'id')).filter(Boolean); assert.equal(new Set(ids).size, ids.length);
  for (const n of all.filter(n => n.tagName === 'a' && (htmlAttr(n, 'href') ?? '').startsWith('#source-'))) assert.ok(ids.includes(htmlAttr(n, 'href').slice(1)), 'Every citation resolves');
}
test('twenty source references retain complete primary and supplemental link fields', () => {
  for (const { raw, lang } of articles) checkSources(raw, lang);
});
test('bibliography contracts reject URL aliases, unsafe fields, labels, duplicate IDs and active markup', () => {
  const raw = articles[0].raw, escape = value => value.replaceAll('&', '&amp;');
  for (const [url] of sourceLinks.fr.flat()) {
    const parsed = new URL(url);
    for (const replacement of [url + '#hidden', url + (parsed.search ? '&' : '?') + 'alias=1', url + '/', url.replace('https:', 'http:'),
      url.replace(parsed.hostname, `${parsed.hostname}.example.org`), url.replace('https://', 'https://user@'),
      url.replace('https://', 'https://example.org/'), 'javascript:alert(1)', 'data:text/html,untrusted', ' ' + url]) {
      assert.notEqual(replacement, url); assert.throws(() => checkSources(raw.replace(`href="${escape(url)}"`, `href="${escape(replacement)}"`), 'fr'));
    }
  }
  const [url, title] = sourceLinks.fr[0][0];
  for (const field of ['onload', '__proto__', 'constructor', 'prototype', 'target', 'rel']) assert.throws(() => checkSources(raw.replace(`href="${url}"`, `href="${url}" ${field}="bad"`), 'fr'));
  assert.throws(() => checkSources(raw.replace(`>${title}</a>`, '>Changed</a>'), 'fr'));
  assert.throws(() => checkSources(raw.replace('id="source-2"', 'id="source-1"'), 'fr'));
  assert.throws(() => checkSources(raw.replace('id="source-1"', 'id="source-99"'), 'fr'));
  assert.throws(() => checkSources(raw.replace('</ol>', '<script>bad</script></ol>'), 'fr'));
  assert.throws(() => checkSources(raw.replace('<strong>', '<strong onclick="bad">'), 'fr'));
  assert.throws(() => checkSources(raw.replace('href="#source-11"', 'href="#source-99"'), 'fr'));
});

test('the documented 45-file export remains a counted grid with explicitly fictional relationship identifiers', () => {
  for (const v of variants.filter(v => v.kind === 'export')) {
    const { nodes } = inspect(v);
    const files = nodes.filter(n => tag(n) === 'rect' && value(n, 'width') === (v.mobile ? 12 : 13) && value(n, 'height') === (v.mobile ? 15 : 17) && value(n, 'rx') === 2);
    assert.equal(files.length, 45);
    assert.equal(new Set(files.map(n => `${value(n, 'x')},${value(n, 'y')}`)).size, 45);
    for (const id of ['P7', 'C12', 'D4']) assert.ok(nodes.some(n => tag(n) === 'text' && xmlText(n) === id));
    assert.match(scopes.export, /fictional and do not reproduce actual export columns/u);
    assert.match(scopes.export, /retrieval after preparation/u);
  }
});
