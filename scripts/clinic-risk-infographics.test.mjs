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
import { clinicRiskSvg, CLINIC_RISK_KINDS, PUT_MARKS, FLOOR_EXAMPLE } from '../src/lib/clinicRiskFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Complete raw and browser-tree goldens derived independently from all 24 supplied
// exports/svg assets. No implementation or compiled output created these goldens.
const originals = {
  "routes-en-desktop": {
    "rawHash": "246420e39ea89e0b4b42fbf5e5b7ef35d1fe8d1dcffbe7ee3f8c175a38992647",
    "domHash": "855791b5366268d5185c6e3be8af6cb447634db564690a43c3a859c8d2a6cfb4",
    "viewBox": "0 0 1000 770"
  },
  "routes-en-mobile": {
    "rawHash": "6e61a46ed9da14627389678a82aa90ccd0465968e7b651619b68c7dc3cb9108b",
    "domHash": "e9623b0c8f4c2fdff94cdcada69f5e8a534d5ca7ac0dcd18849c13c68242ca84",
    "viewBox": "0 0 400 1120"
  },
  "routes-fr-desktop": {
    "rawHash": "7180e2c3e382c8fc5c753e9df887161ba607f29bb24ba899168d49183bd842b3",
    "domHash": "0896c4b61c35e3be3fc0557a8511beb3df5a3783f28906de50e360f6e32c63e1",
    "viewBox": "0 0 1000 770"
  },
  "routes-fr-mobile": {
    "rawHash": "b205a636415e2882acb8dcd9a22cb0e64a00d3b50ce0e1ff358a75f212db7a15",
    "domHash": "72cf52b4fa4f8ff3ec80ef20953fda21445f55584b38d001d76cc3650acfcbb0",
    "viewBox": "0 0 400 1120"
  },
  "clock-en-desktop": {
    "rawHash": "62ee1f23f358722a22ce98bcb71959d32518c5cb4abbef9fabda0856ec1946fe",
    "domHash": "768bbbf9d5973997ef91f0d6a28bf69c803a4ac4409744a828388e2b2c491c6b",
    "viewBox": "0 0 1000 820"
  },
  "clock-en-mobile": {
    "rawHash": "4e7cb43910f1dfa81466408e375c499ea812bf2566ae586d5611effee87cbd61",
    "domHash": "3ad5ee676c0017e1e548e5d3cc7d74e1c425546d1074ce9dfa8a92b47ab25631",
    "viewBox": "0 0 400 1020"
  },
  "clock-fr-desktop": {
    "rawHash": "27518573c7d7cb479272a2026030b0d5729b6de4847010f49d83714b9e60f65f",
    "domHash": "f7e0a960405c1567d3b08c25b2804b6360daf039ea1e28be0a17d16dcf52b9a0",
    "viewBox": "0 0 1000 820"
  },
  "clock-fr-mobile": {
    "rawHash": "d5779f05fa201f94c8cd40fe6e72a60a119e2447f61d9e10f14b6d1d7b09a29f",
    "domHash": "543668f5e0ebde497436d4a69e1e244cbf03cabb3ba0015bf3381474570185b2",
    "viewBox": "0 0 400 1020"
  },
  "balance-en-desktop": {
    "rawHash": "7262b214c5f0e42bf936445f723a70dc844e77967d8d10bcd9bb33317da0766f",
    "domHash": "8769ccbb2db4a59ba12b81502f0604083d7420c3f46d7a2df274d72dde69ed7d",
    "viewBox": "0 0 1000 810"
  },
  "balance-en-mobile": {
    "rawHash": "5a6deec080d1247d0097a3ed71913c9f0215cf7f8de9282573382f22f0a9a1ee",
    "domHash": "7ea341d4f3c86027800cd13ab593addbef059707ee660c4436ad163b74e47ce0",
    "viewBox": "0 0 400 990"
  },
  "balance-fr-desktop": {
    "rawHash": "67544635fd217f277f7d16ac490c007962b6315158a98324cca8234b227a38c0",
    "domHash": "940f975b5e7e81c575d49e8983d99807e465723d4437c36a2b2730c1e5793048",
    "viewBox": "0 0 1000 810"
  },
  "balance-fr-mobile": {
    "rawHash": "2b91ba81a4b040e338da6052b93a942246a7924584282b737de221f0024a7054",
    "domHash": "2db4413e45e5e6f4cda295874ef05aa40b96bbd0e11ca6c94c019f121e8c6a0b",
    "viewBox": "0 0 400 990"
  },
  "floor-en-desktop": {
    "rawHash": "e2e0ed622e90da20c5b9fd5cac465e85df15999fe6e37dcb2422f230b96600ff",
    "domHash": "aec2f788275648637755f6b95c7af4fffd6395949b620b0bffbd9b450e8db220",
    "viewBox": "0 0 1000 805"
  },
  "floor-en-mobile": {
    "rawHash": "6763ddb038bfb817a307f857e79ac6d0c32dbcbc00643ff8a5186e445963767c",
    "domHash": "cb39037ae72283c69f6e28c094506d7e43ac8ff878484ef9d4dcbe96663ca7b6",
    "viewBox": "0 0 400 1200"
  },
  "floor-fr-desktop": {
    "rawHash": "88f8194c823154d2c7a814d3d3041dca78b4403d8ef166838bd48ab16b3f6307",
    "domHash": "19fc77d586140c995780fcad01971117aba78d37dced20bb0a3137f844bed206",
    "viewBox": "0 0 1000 805"
  },
  "floor-fr-mobile": {
    "rawHash": "c8d018bed23019213acb9970442ed26824508f5bd9f730ba85450f47558d8ad8",
    "domHash": "47625aea6327e89a90c5fd6d1878c79b001154a71fa6f76d53a46e8cb36cc7cd",
    "viewBox": "0 0 400 1200"
  },
  "care-en-desktop": {
    "rawHash": "73080881df0702842cea1ce814af27a044bc6756d7a14cf45d6f9dc36838c323",
    "domHash": "de801d45a2e884095d4ab83258616b1a92e48986aacff20ee28e03528abf793d",
    "viewBox": "0 0 1000 915"
  },
  "care-en-mobile": {
    "rawHash": "bce5792427fa0cbdd399379dc4a30a360b9d30dd8ed54350cc80b6a928c259f8",
    "domHash": "17497966d7c2b78b18d8f7f99b0ee9bd4c374b4587ba6a2f2aaa8b1ce9386c44",
    "viewBox": "0 0 400 1210"
  },
  "care-fr-desktop": {
    "rawHash": "93def22780b9fa9307a0e07ef41dd55ce95cd8a9df9e4f080fbd0084abc8f59d",
    "domHash": "f8d8b6f164c1ea4cdcb51517a6abe1c4f9077e4a4dd03187e6f60efdc1bf9b30",
    "viewBox": "0 0 1000 915"
  },
  "care-fr-mobile": {
    "rawHash": "c1cfc54fc7be83709afd47e418373a92669403a7e88ab8e10b584f9e87d74b10",
    "domHash": "93e8ff197436d099ebc72100f041087375c17fcf885acd5c15f1185610ae7c57",
    "viewBox": "0 0 400 1210"
  },
  "stress-en-desktop": {
    "rawHash": "54085bda39344c0ef7270dc9aff17a1e28474c958983eae8a4d984eaa7f137c0",
    "domHash": "b594058a80c96ab5b645fec8e46aace2508ded149e41a838f69216c67c7a678c",
    "viewBox": "0 0 1000 855"
  },
  "stress-en-mobile": {
    "rawHash": "9ce70f60a4ddfb7da3c6c34da5e825ec63d1a4de9d5f3d21ff5187d5273ad3d0",
    "domHash": "aa1cdb71f29bedefcbfd38c1ac339959f65ca9ab1a0f6288d86248fe7bec6e03",
    "viewBox": "0 0 400 1120"
  },
  "stress-fr-desktop": {
    "rawHash": "b770d3384d4efa5fb539e50e322fbc8102e915f441417a58e97e88b91a8ac073",
    "domHash": "1137f787a2ae77d6c176de0fc97ae4bb5232446e544573f33f5339b9b1f67b65",
    "viewBox": "0 0 1000 855"
  },
  "stress-fr-mobile": {
    "rawHash": "928b42b031ff9007e77cb53222d4379a036331ffcf7b2f07abf87b6e2af99910",
    "domHash": "532bb29677e7cb6e1cbe6b8cdacd2811f9a2ce8ff71d8f030364cfb9979f82ca",
    "viewBox": "0 0 400 1120"
  }
};
// Exact canonical source fields independently reviewed, then frozen from the
// controlled bilingual copy. Every observation retains its published period and scope.
const sourceLinks = {
  "fr": [
    [
      [
        "https://humana.gcs-web.com/news-releases/news-release-details/humana-announces-new-strategic-joint-venture-blackrock-manage",
        "Humana, annonce de la nouvelle coentreprise"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/49071/000004907126000060/hum-20261013.htm",
        "Humana, Form 8-K du 13 octobre 2026"
      ],
      [
        "https://humana.gcs-web.com/static-files/dfe310cd-69fc-4205-ae9f-8477b5a0d9bc",
        "Copie PDF publiée par Humana"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/49071/000004907126000050/hum-20260630.htm",
        "Humana, Form 10-Q au 30 juin 2026"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/49071/000004907126000009/hum-20251231.htm",
        "Humana, Form 10-K pour 2025"
      ]
    ],
    [
      [
        "https://humana.gcs-web.com/node/35751",
        "Humana–WCAS, annonce de la deuxième coentreprise"
      ]
    ],
    [
      [
        "https://humana.gcs-web.com/news-releases/news-release-details/humanas-partners-primary-care-and-welsh-carson-anderson-stowe",
        "Humana–WCAS, annonce du partenariat initial"
      ]
    ],
    [
      [
        "https://www.cms.gov/priorities/innovation/key-concepts/value-based-care",
        "CMS, Value-Based Care"
      ]
    ],
    [
      [
        "https://www.cms.gov/newsroom/fact-sheets/2026-medicare-advantage-part-d-rate-announcement",
        "CMS, annonce finale des paramètres Medicare Advantage 2026"
      ]
    ],
    [
      [
        "https://ir.blackrock.com/news-and-events/press-releases/press-releases-details/2025/BlackRock-Completes-Acquisition-of-HPS-Investment-Partners/default.aspx",
        "BlackRock, finalisation de l’acquisition de HPS"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/49071/000004907126000060/0000049071-26-000060-index.htm",
        "SEC EDGAR, inventaire des pièces du 8-K"
      ]
    ],
    [
      [
        "https://live.euronext.com/en/financial-news/blackrock-replaces-wcas-joint-venture-humana-senior-clinics",
        "Reuters via Euronext, BlackRock replaces WCAS in joint venture with Humana senior clinics"
      ]
    ]
  ],
  "en": [
    [
      [
        "https://humana.gcs-web.com/news-releases/news-release-details/humana-announces-new-strategic-joint-venture-blackrock-manage",
        "Humana, new joint-venture announcement"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/49071/000004907126000060/hum-20261013.htm",
        "Humana, Form 8-K, 13 October 2026"
      ],
      [
        "https://humana.gcs-web.com/static-files/dfe310cd-69fc-4205-ae9f-8477b5a0d9bc",
        "Humana’s PDF copy"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/49071/000004907126000050/hum-20260630.htm",
        "Humana, Form 10-Q for 30 June 2026"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/49071/000004907126000009/hum-20251231.htm",
        "Humana, 2025 Form 10-K"
      ]
    ],
    [
      [
        "https://humana.gcs-web.com/node/35751",
        "Humana–WCAS, second joint-venture announcement"
      ]
    ],
    [
      [
        "https://humana.gcs-web.com/news-releases/news-release-details/humanas-partners-primary-care-and-welsh-carson-anderson-stowe",
        "Humana–WCAS, initial partnership announcement"
      ]
    ],
    [
      [
        "https://www.cms.gov/priorities/innovation/key-concepts/value-based-care",
        "CMS, Value-Based Care"
      ]
    ],
    [
      [
        "https://www.cms.gov/newsroom/fact-sheets/2026-medicare-advantage-part-d-rate-announcement",
        "CMS, final 2026 Medicare Advantage payment announcement"
      ]
    ],
    [
      [
        "https://ir.blackrock.com/news-and-events/press-releases/press-releases-details/2025/BlackRock-Completes-Acquisition-of-HPS-Investment-Partners/default.aspx",
        "BlackRock, completion of the HPS acquisition"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/49071/000004907126000060/0000049071-26-000060-index.htm",
        "SEC EDGAR, 8-K filing inventory"
      ]
    ],
    [
      [
        "https://live.euronext.com/en/financial-news/blackrock-replaces-wcas-joint-venture-humana-senior-clinics",
        "Reuters via Euronext, BlackRock replaces WCAS in joint venture with Humana senior clinics"
      ]
    ]
  ]
};
const kinds = ['routes', 'clock', 'balance', 'floor', 'care', 'stress'];
const figureSources = { routes: [1, 2, 9], clock: [2, 3, 5], balance: [2, 3, 4], floor: [2], care: [4, 7], stress: [2, 3, 4, 8] };
const variants = ['fr', 'en'].flatMap(lang => kinds.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, key: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: clinicRiskSvg(lang, kind, mobile) }))));
const articles = ['fr', 'en'].map(lang => ({ lang, raw: read(`src/content/${lang === 'fr' ? 'posts/humana-blackrock-promesse-cliniques' : 'posts-en/humana-blackrock-promise-behind-clinics'}.mdx`) }));
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
  svg: 'xmlns viewBox role aria-labelledby style data-kind',
  title: 'id', desc: 'id', metadata: '', g: 'transform',
  rect: 'x y width height rx fill stroke stroke-width stroke-dasharray',
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
  'var(--color-line-strong, rgba(255,255,255,0.20))',
]);
const numeric = new Set('x y x1 y1 x2 y2 width height rx cx cy r font-size stroke-width'.split(' '));
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
  const prefix = `hbr-${v.kind}-${v.lang}-${v.mobile ? 'm' : 'd'}`;
  assert.deepEqual(attrs(root), { xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[v.key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto', 'data-kind': v.kind });
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
      if (k === 'stroke-dasharray') assert.ok(['5 4', '5 5', '6 5'].includes(val));
      if (k === 'stroke-linecap' || k === 'stroke-linejoin') assert.equal(val, 'round');
      if (k === 'd') pathPoints(val);
      if (k === 'opacity') assert.equal(val, '0.14');
      if (k === 'transform') transform(val);
    }
    if (tag(n) === 'g') { assert.ok(attrs(n).transform); assert.ok(children(n).every(c => ['rect', 'path', 'circle', 'line'].includes(tag(c)))); }
  }
  assert.deepEqual(ids.sort(), [`${prefix}-desc`, `${prefix}-title`]);

  for (const type of ['title', 'desc', 'metadata']) { const found = nodes.filter(n => tag(n) === type); assert.equal(found.length, 1); assert.ok(xmlText(found[0]).trim()); }
  const meta = JSON.parse(xmlText(nodes.find(n => tag(n) === 'metadata')));
  assert.deepEqual(Object.keys(meta).sort(), ['asOf', 'sourceIds', 'status']);
  assert.equal(meta.asOf, '2026-10-14');
  assert.deepEqual(meta.sourceIds, v.kind === 'balance' ? [3, 4] : figureSources[v.kind]);
  assert.equal(meta.status, v.kind === 'floor' ? 'hypothetical' : v.kind === 'stress' ? 'conditional-mechanism' : 'reported-and-explained');
  const [, , width, height] = attrs(root).viewBox.split(' ').map(number);
  return { root, nodes, width, height };
}
function faithful(v) {
  inspect(v);
  assert.equal(digest(v.svg), originals[v.key].rawHash, `${v.key}: every supplied byte preserved`);
  assert.equal(domHash(v.svg), originals[v.key].domHash, `${v.key}: complete browser SVG tree`);
}
const mutate = (v, change) => { const root = parser.parse(v.svg)[0]; change(root, xmlNodes(root)); return { ...v, svg: builder.build([root]) }; };
const fontFrom = file => {
  const bytes = readFileSync(new URL(`../${file}`, import.meta.url));
  return opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
};
const fonts = Object.fromEntries([400, 700].map(w => [w, fontFrom(`public/fonts/clinic-risk/liberation-sans-${w}.ttf`)]));
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
// Authored icons use only translate(x y) scale(s). Keep this grammar bounded
// and fully consumed; reject arbitrary CSS/SVG transforms and malformed numbers.
function transform(raw) {
  assert.equal(typeof raw, 'string'); assert.ok(raw.length <= 128);
  const m = /^translate\((-?(?:\d{1,4}(?:\.\d{1,16})?|\.\d{1,16})) (-?(?:\d{1,4}(?:\.\d{1,16})?|\.\d{1,16}))\) scale\(((?:\d{1,2}(?:\.\d{1,16})?|\.\d{1,16}))\)$/u.exec(raw);
  assert.ok(m, 'Complete translate/scale transform');
  const [x, y, scale] = m.slice(1).map(number); assert.ok(scale > 0 && scale <= 8);
  return [scale, 0, 0, scale, x, y];
}
const identity = [1, 0, 0, 1, 0, 0];
const multiply = (a, b) => [a[0]*b[0]+a[2]*b[1], a[1]*b[0]+a[3]*b[1], a[0]*b[2]+a[2]*b[3], a[1]*b[2]+a[3]*b[3], a[0]*b[4]+a[2]*b[5]+a[4], a[1]*b[4]+a[3]*b[5]+a[5]];
const mappedBox = (b, m) => pointsBox([[b.x,b.y],[b.right,b.y],[b.x,b.bottom],[b.right,b.bottom]].map(([x,y]) => [m[0]*x+m[2]*y+m[4],m[1]*x+m[3]*y+m[5]]));
function geometry(v) {
  const { root, width, height } = inspect(v), canvas = { x: 0, y: 0, right: width, bottom: height };
  const flattened = [];
  const visit = (n, inherited) => {
    const matrix = attrs(n).transform ? multiply(inherited, transform(attrs(n).transform)) : inherited;
    if (['rect', 'circle', 'line', 'path', 'text'].includes(tag(n))) flattened.push({ n, matrix });
    for (const child of children(n)) if (tag(child) !== '#text') visit(child, matrix);
  };
  visit(root, identity);
  const panels = flattened.filter(({n}) => tag(n) === 'rect' && value(n,'rx') >= 9 && value(n,'x') > 1 && value(n,'width') >= 100 && value(n,'height') >= 40).map(({n,matrix})=>mappedBox(shapeBox(n),matrix));
  const labels = [];
  for (const {n,matrix} of flattened) {
    if (tag(n) !== 'text') {
      const b=shapeBox(n), stroke=attrs(n).stroke && attrs(n).stroke !== 'none' ? value(n,'stroke-width','1')/2 : 0;
      const box=mappedBox({x:b.x-stroke,y:b.y-stroke,right:b.right+stroke,bottom:b.bottom+stroke},matrix);
      assert.ok(within(box,canvas,.01),`${v.key}: transformed shape outside viewBox`);
      continue;
    }
    const local=textBox(n), b={...mappedBox(local,matrix),label:local.label};
    assert.ok(within(b,canvas,.01),`${v.key}: text outside viewBox: ${b.label}`);
    const centre={x:(b.x+b.right)/2,y:(b.y+b.bottom)/2,right:(b.x+b.right)/2,bottom:(b.y+b.bottom)/2};
    const panel=panels.filter(p=>within(centre,p)).at(-1);
    if(panel) assert.ok(within(b,panel,.1),`${v.key}: text outside panel: ${b.label}`);
    for(const prior of labels) assert.ok(!overlaps(b,prior),`${v.key}: labels overlap: ${b.label} / ${prior.label}`);
    labels.push(b);
  }
}
function checkSources(raw, lang) {
  assert.equal(typeof raw, 'string'); assert.ok(raw.length < 200000);
  const all = htmlNodes(parse(raw));
  const lists = all.filter(n => n.tagName === 'ol' && htmlAttr(n, 'class') === 'sources-list clinic-risk-sources'); assert.equal(lists.length, 1);
  assert.deepEqual(lists[0].attrs.map(a => [a.name, a.value]), [['class', 'sources-list clinic-risk-sources']]);
  for (const n of htmlNodes(lists[0])) assert.ok(n.nodeName === '#text' || ['ol', 'li', 'a'].includes(n.tagName), 'Passive bibliography markup');
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
test('Clinic risk variant selection is frozen, complete and rejects prototypes or coercion', () => {
  assert.deepEqual(CLINIC_RISK_KINDS, kinds); assert.ok(Object.isFrozen(CLINIC_RISK_KINDS)); assert.equal(variants.length, 24);
  for (const lang of ['', 'FR', '__proto__', 'constructor', {}, null, ['fr']]) assert.throws(() => clinicRiskSvg(lang, 'routes', false), TypeError);
  for (const kind of ['', '__proto__', 'constructor', 'prototype', {}, null, ['routes']]) assert.throws(() => clinicRiskSvg('fr', kind, false), TypeError);
  for (const mobile of [0, 1, '', 'false', null, new Boolean(false), {}, []]) assert.throws(() => clinicRiskSvg('fr', 'routes', mobile), TypeError);
  assert.equal(clinicRiskSvg('fr', 'routes'), clinicRiskSvg('fr', 'routes', false));
});
test('24 supplied SVGs preserve every byte and complete native fields', () => { for (const v of variants) faithful(v); });
test('all original transformed shapes and font glyphs remain in viewBox and panels', () => {
  const issues = []; for (const v of variants) { try { geometry(v); } catch (error) { issues.push(error.message); } }
  assert.deepEqual(issues, []);
});
test('geometry checks reject transformed overflow and overlapping ink', () => {
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
test('icon transforms are bounded, fully consumed and validated before geometry', () => {
  assert.deepEqual(transform('translate(117 423) scale(1.12)'),[1.12,0,0,1.12,117,423]);
  assert.deepEqual(mappedBox({x:-10,y:-20,right:30,bottom:40},multiply(identity,transform('translate(100 200) scale(2)'))),{x:80,y:160,right:160,bottom:280});
  for (const raw of ['',null,{},'translate(1 2)','translate(1 2) scale(0)','translate(1 2) scale(-1)','translate(1 2) scale(9)','translate(1,2) scale(1)','translate(1 2) scale(1) trailing','translate(NaN 2) scale(1)','translate(1e9 2) scale(1)','rotate(90)','matrix(1 0 0 1 0 0)','translate(10001 2) scale(1)','translate(1 2) scale(Infinity)','translate(1 2) scale(1e9)']) assert.throws(()=>transform(raw));
  const v=variants.find(v=>v.kind==='care'&&!v.mobile);
  assert.throws(()=>geometry(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='g')).transform='translate(9999 0) scale(1)';})));
  assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='g')).transform='translate(1 2) scale(1) garbage';})));
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
    if ([1, 16].includes(record.id)) assert.equal(record.value, 'l0g Debt Sans');
    if ([2, 17].includes(record.id)) assert.equal(record.value, style);
    if ([3, 4, 18].includes(record.id)) assert.equal(record.value, `l0g Debt Sans ${style}`);
    if (record.id === 6) assert.equal(record.value, `l0gDebtSans-${style}`);
  }
}
test('redistributed font subsets retain copyrights and use the licensed original family name', () => {
  for (const weight of [400, 700]) {
    const subsetBytes = readFileSync(new URL(`../public/fonts/clinic-risk/liberation-sans-${weight}.ttf`, import.meta.url));
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
  const licence = read('public/fonts/clinic-risk/LICENSE.txt'); assertFontLicenseReferences(licence, 'liberation');
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
  const component = read('src/components/ClinicRiskFigure.astro'), styles = component.match(/<style>([\s\S]*?)<\/style>/u); assert.ok(styles);
  const css = postcss.parse(styles[1]), declarations = n => Object.fromEntries(n.nodes.filter(d => d.type === 'decl').map(d => [d.prop, d.value]));
  const base = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.clinic-risk-figure'));
  assert.deepEqual([base.width, base['max-width'], base['container-type'], base['padding-bottom']], ['100%', '760px', 'inline-size', '.85rem']);
  assert.equal(base.overflow, 'visible');
  const graphic = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.clinic-risk-figure :global(svg)'));
  assert.deepEqual([graphic.width, graphic.height, graphic.overflow, graphic['letter-spacing']], ['100%', 'auto', 'visible', 'normal']);
  const labelFont = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.clinic-risk-figure :global(svg text)'));
  assert.equal(labelFont['font-family'], "'l0g Clinic Risk', 'Liberation Sans', Arial, sans-serif");
  const mobile = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.clinic-risk-mobile'));
  assert.deepEqual([mobile.display, mobile.width, mobile['max-width'], mobile['margin-inline']], ['none', '100%', '400px', 'auto']);
  for (const kind of ['media', 'container']) {
    const rule = css.nodes.find(n => n.type === 'atrule' && n.name === kind && n.params === '(max-width: 640px)'); assert.ok(rule);
    assert.deepEqual(rule.nodes.map(n => [n.selector, declarations(n).display]), [['.clinic-risk-desktop', 'none'], ['.clinic-risk-mobile', 'block']]);
  }
  const faces = css.nodes.filter(n => n.type === 'atrule' && n.name === 'font-face').map(n => declarations(n));
  assert.deepEqual(faces.map(d => [d['font-family'], d.src, d['font-weight'], d['font-style']]), [400, 700].map(w => ["'l0g Clinic Risk'", `url('/fonts/clinic-risk/liberation-sans-${w}.ttf') format('truetype')`, String(w), 'normal']));
  assert.doesNotMatch(styles[1], /#(?:[a-f0-9]{3}){1,2}\b|(?:clip-path|overflow\s*:\s*hidden|transform\s*:|100vw)/iu);
  const themes = { dark: new Map(), light: new Map() };
  postcss.parse(read('src/styles/global.css')).walkDecls(d => { if (d.parent.type === 'atrule' && d.parent.name === 'theme') themes.dark.set(d.prop, d.value); if (d.parent.type === 'rule' && d.parent.selector === ':root[data-theme="light"]') themes.light.set(d.prop, d.value); });
  for (const theme of Object.values(themes)) for (const token of ['ink', 'paper', 'surface', 'surface-2', 'muted', 'signal', 'amber', 'accent', 'topic-blue', 'line-strong']) assert.ok(theme.has(`--color-${token}`));
});
const mdxNodes = n => [n, ...(n.children ?? []).flatMap(mdxNodes)];
const mdxText = n => n.type === 'text' ? n.value : (n.children ?? []).map(mdxText).join('');
function articleFigures(raw, lang) {
  const tree = createProcessor().parse(raw);
  const figures = mdxNodes(tree).filter(n => n.name === 'ClinicRiskFigure'); assert.equal(figures.length, 6);
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
  const raw = articles[0].raw;
  for (const [a, b] of [['kind="routes"', 'kind="stress"'], ['number="01"', 'number="06"'], ['sources="1 2 9"', 'sources="1 99"'], ['lang="fr"', 'lang="en"']]) assert.throws(() => articleFigures(raw.replace(a, b), 'fr'));
  const first = mdxNodes(createProcessor().parse(raw)).find(n => n.name === 'ClinicRiskFigure');
  const attribute = first.attributes.find(a=>a.name==='caption');
  const invalid = raw.slice(0, attribute.position.start.offset) + 'caption={process.env.SECRET}' + raw.slice(attribute.position.end.offset);
  assert.throws(() => articleFigures(invalid, 'fr'));
});
test('historical marks and fictional protection retain dates, scope and exact arithmetic', () => {
  assert.deepEqual(PUT_MARKS,[883,1400,1600]); assert.ok(Object.isFrozen(PUT_MARKS));
  assert.deepEqual(FLOOR_EXAMPLE,{threshold:110,proceeds:[60,100,140]}); assert.ok(Object.isFrozen(FLOOR_EXAMPLE));
  assert.deepEqual(FLOOR_EXAMPLE.proceeds.map(p=>Math.max(FLOOR_EXAMPLE.threshold-p,0)),[50,10,0]);
  assert.deepEqual(FLOOR_EXAMPLE.proceeds.map(p=>p+Math.max(FLOOR_EXAMPLE.threshold-p,0)),[110,110,140]);
  for(const {raw,lang} of articles) {
    assert.match(raw,/2024|883/u); assert.match(raw,/2025|1[ ,]400/u); assert.match(raw,/2026/u);
    assert.match(raw,/2028/u); assert.match(raw,/2033/u);
    assert.match(raw,lang==='fr'?/fictif|fictive/u:/fictional|hypothetical/u);
    assert.match(raw,lang==='fr'?/inconnu|non publi|pas indiqu|ne sont pas indiqu/u:/undisclosed|not disclosed|unknown/u);
  }
});
test('eleven source references retain complete primary and supplemental link fields', () => {
  for (const { raw, lang } of articles) checkSources(raw, lang);
});
test('bibliography contracts reject URL aliases, unsafe fields, labels, duplicate IDs and active markup', () => {
  const raw = articles[0].raw;
  for (const [url] of sourceLinks.fr.flat()) {
    const parsed = new URL(url);
    for (const replacement of [url + '#hidden', url + (parsed.search ? '&' : '?') + 'alias=1', url + '/', url.replace('https:', 'http:'),
      url.replace(parsed.hostname, `${parsed.hostname}.example.org`), url.replace('https://', 'https://user@'),
      url.replace('https://', 'https://example.org/'), 'javascript:alert(1)', 'data:text/html,untrusted', ' ' + url]) {
      assert.notEqual(replacement, url); assert.throws(() => checkSources(raw.replace(`href="${url}"`, `href="${replacement}"`), 'fr'));
    }
  }
  const [url, title] = sourceLinks.fr[0][0];
  for (const field of ['onload', '__proto__', 'constructor', 'prototype', 'target', 'rel']) assert.throws(() => checkSources(raw.replace(`href="${url}"`, `href="${url}" ${field}="bad"`), 'fr'));
  assert.throws(() => checkSources(raw.replace(`>${title}</a>`, '>Changed</a>'), 'fr'));
  assert.throws(() => checkSources(raw.replace('id="source-2"', 'id="source-1"'), 'fr'));
  assert.throws(() => checkSources(raw.replace('id="source-1"', 'id="source-99"'), 'fr'));
  assert.throws(() => checkSources(raw.replace('</ol>', '<script>bad</script></ol>'), 'fr'));
  assert.throws(() => checkSources(raw.replace('href="#source-11"', 'href="#source-99"'), 'fr'));
});
