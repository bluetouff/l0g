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
import { softbankFundingSvg, SOFTBANK_FUNDING_KINDS, SOFTBANK_FUNDING_DATA } from '../src/lib/softbankFundingFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Complete raw and browser-tree goldens independently derived from 24 supplied
// exports/svg assets: twenty unchanged, two French cash titles, two English
// trigger-copy corrections. No implementation module or compiled HTML generated
// these goldens; all geometry, data, backgrounds and native fields are pinned.
const originals = {
  "funding-fr-desktop": {
    "rawHash": "1061084bb81810e76866c1b213e57a93035f36c8b3e3ccd0272020c713acf671",
    "domHash": "65a12f798a8dca1073c9d52e8b837c98bed095bb05d74824ac4292c470d40a55",
    "viewBox": "0 0 1000 812"
  },
  "funding-fr-mobile": {
    "rawHash": "8efa78388cde54e62973583cae48672788a87118abc50b98565350e06733c5cc",
    "domHash": "a131bdad4c4cb85ed66c9f3cd14326ed6b63fa18c6e4ca6daa6d706311251800",
    "viewBox": "0 0 400 1246"
  },
  "funding-en-desktop": {
    "rawHash": "90319f73c6054b0ecb27e802b00bf3d49254b95b32e34f3fd9e9ca28a645e8dd",
    "domHash": "ef40fb3fd9c2c5022968d6c6ffc1a2efbe0979fc8343d630f4c7e24cc69e5db5",
    "viewBox": "0 0 1000 812"
  },
  "funding-en-mobile": {
    "rawHash": "894d6a484468be05898aad45062b029e692daac8a863410c2282021e9b5ad778",
    "domHash": "15465c7af4895daef74e51045cd72e07f97410d7ed7793aaa0affb353c4f3ae1",
    "viewBox": "0 0 400 1246"
  },
  "coupons-fr-desktop": {
    "rawHash": "a77d37d5ba53a77dc71e3fc7765b4717c4f158b8317c20a6be1d861f9340a282",
    "domHash": "b68033f8b4b29e907a678063705cf06600f482ba2fb3b49c5842a479870257e0",
    "viewBox": "0 0 1000 958"
  },
  "coupons-fr-mobile": {
    "rawHash": "63d7c2b3b335a925d6c2078d75ca07ed8b5e969c1933f79659f79923cf7aaea1",
    "domHash": "f718725ee9b0c35adb8e2e697a6c677d8fa82e4b15450c09a5577add05edb3f5",
    "viewBox": "0 0 400 1263"
  },
  "coupons-en-desktop": {
    "rawHash": "96e72f02d8505ae4fa6f26bdc39366c50652dab409affa3c38eff03d4e5f61b1",
    "domHash": "3119684a79ead50e2b06708a25216201627186e39eacdf49b80128b885dc79a1",
    "viewBox": "0 0 1000 958"
  },
  "coupons-en-mobile": {
    "rawHash": "c32542897aeb42e853bbed2f56e44dd078f6760a337993f6300429aaba5d7f32",
    "domHash": "673525f8d025442ad34aa3ec23c4a2a4ef7ae07daa61e0dc38a4598b8c2c3bba",
    "viewBox": "0 0 400 1263"
  },
  "ltv-fr-desktop": {
    "rawHash": "799b5f180f47ae8b772b43e83de24e87f1c19fab1264783e09623d5151cfc5fe",
    "domHash": "30a5ab1f6a16d86a332b71e6288a8629f1781ccc3d8d5d97e934bad6e1da3fec",
    "viewBox": "0 0 1000 900"
  },
  "ltv-fr-mobile": {
    "rawHash": "211111a53aae99f420057b9f3bc3ae5757a032adf7a795ea05a3a867a70b6cdb",
    "domHash": "37d0631b12079eef0605ac18872cfc00843e84aeedb944843923c0b40808ab5b",
    "viewBox": "0 0 400 1151"
  },
  "ltv-en-desktop": {
    "rawHash": "4869bf12f3cedca4b4db2e21acbb0faa2fec059b70d73609d60c97412526fc16",
    "domHash": "3d4c9e2c95fd11a3b523f465d1a9305228ccddce3600e631897b60308c575220",
    "viewBox": "0 0 1000 900"
  },
  "ltv-en-mobile": {
    "rawHash": "d09f769c1201e5198cbd0df34b4f9ba2a03dc3380d76823f9a62dda8fe1841d5",
    "domHash": "fe87cac55797c96498e305c8a1ea17e5287c2eceb642737470bcb352c121cbe7",
    "viewBox": "0 0 400 1151"
  },
  "cash-fr-desktop": {
    "rawHash": "a81c578a965772243fb6543471c664f5b25e056a3e149cc2d4427f865749bb9b",
    "domHash": "8397280904ec3defa1510b5b5864e4b3806d44ac5d53d88e8dd8b712b7e3b242",
    "viewBox": "0 0 1000 949"
  },
  "cash-fr-mobile": {
    "rawHash": "165d4263125cea0fcb4a7d160a003c3ccb47bf66199d41e549875efd489b79cc",
    "domHash": "238de09705df1a5f8cc91c631bd0197f13051403761a2ff4c3e9c7d731a1be7c",
    "viewBox": "0 0 400 1313"
  },
  "cash-en-desktop": {
    "rawHash": "3069c1a2cf0849c22f6d45f1520ca959bf2be2fd5001c7a463446ce97728c090",
    "domHash": "187e93cc94245b846b2ae977e3d52dae95ed13f486704e3272d6ec5c3a4c7a7f",
    "viewBox": "0 0 1000 949"
  },
  "cash-en-mobile": {
    "rawHash": "fca0de09b41258ba6c21bcb1747221ea743addf6acdf34b6c14d68be8769d67c",
    "domHash": "2c02cdb381cee5c8999556580759f5da217596d86ab0fe78f83393138977d6be",
    "viewBox": "0 0 400 1313"
  },
  "trigger-fr-desktop": {
    "rawHash": "18e90f579306cf0fef68756e70356f42d86f270ac8107bbe439203222c1c253b",
    "domHash": "f495afe02339459b47a002dbb40bbb4ac5f6e6ace6fcbb630163cebc735c426f",
    "viewBox": "0 0 1000 877"
  },
  "trigger-fr-mobile": {
    "rawHash": "7b9b264963f3666835222d8393ac1016b6c6a504a459c3b30a60c0183cf21d14",
    "domHash": "88dd994db947acb407f5e20c09d7014ec73fa9e7b1a17954401d10d28564106e",
    "viewBox": "0 0 400 1328"
  },
  "trigger-en-desktop": {
    "rawHash": "3166ec297ba08701e9fdf34deb0d1843f30b9d295f8126a7903da5fc1c8cf6d6",
    "domHash": "70124f6ae18ddb8c9ece9f2a6982ba86ea5924f8a5e49c046d5dd80a6f3ab32e",
    "viewBox": "0 0 1000 877"
  },
  "trigger-en-mobile": {
    "rawHash": "3b8831f8c8153f7dd6028a659a7774ac8ee9e2718b439eb77017f6c234536bca",
    "domHash": "2d664d6d4616821cd00c17abf359ce144025ca87a035e5436c1e4446fb348d00",
    "viewBox": "0 0 400 1328"
  },
  "ipo-fr-desktop": {
    "rawHash": "14abef92bf37926937a9499bc8ec588394718a47e9b0f51c917456d293a9d346",
    "domHash": "1bd4b8a9600e8d475a6fd770d07bac7befb895bbe62047d6d51d8c32261feae2",
    "viewBox": "0 0 1000 963"
  },
  "ipo-fr-mobile": {
    "rawHash": "876b6242c3bf5b26a6ea8b7e11996314677396bdf506a5dea3a26f1ab106f339",
    "domHash": "7647eeec1fcb032901b58a650d8a749e3802c75dc16dda54e67677ca28c094e5",
    "viewBox": "0 0 400 1349"
  },
  "ipo-en-desktop": {
    "rawHash": "ddaf64e5e6477d3f4cfc0d6a1780601715c8ca02c29cf4ccaee3d4bf68371c3e",
    "domHash": "bc68770b1dc7eb85017eb51c97c0374b83358f7eea28eaf8756a08e30bbbc0ce",
    "viewBox": "0 0 1000 963"
  },
  "ipo-en-mobile": {
    "rawHash": "22ddf61285a3c767dca980e4a89c5f3967e6da066226e09ea0d6baae774cc265",
    "domHash": "288a2804578a85e3bafacc9edc27615cacffca2da3004089c78e23e69681f485",
    "viewBox": "0 0 400 1349"
  }
};
const sourceLinks = {
  "fr": [
    [
      [
        "https://group.softbank/en/news/press/20261001",
        "Execution of Follow-on Investment (Third Tranche) in OpenAI"
      ]
    ],
    [
      [
        "https://group.softbank/en/news/press/20260909",
        "Early Repayment of Bridge Loans"
      ]
    ],
    [
      [
        "https://group.softbank/en/news/press/20260924",
        "Issuance of Foreign Currency-Denominated Senior Notes"
      ]
    ],
    [
      [
        "https://group.softbank/en/news/press/20260227",
        "Follow-on Investments in OpenAI"
      ]
    ],
    [
      [
        "https://group.softbank/media/Project/sbg/sbg/pdf/ir/financials/financial_reports/financial-report_q1fy2026_01_en.pdf",
        "Consolidated Financial Report for the Three-month Period Ended June 30, 2026"
      ]
    ],
    [
      [
        "https://group.softbank/media/Project/sbg/sbg/pdf/ir/presentations/2026/investor-finance_q1fy2026_01_en.pdf",
        "Q1 FY2026 Earnings Results: Investor Briefing (Finance)"
      ]
    ],
    [
      [
        "https://group.softbank/media/Project/sbg/sbg/pdf/ir/presentations/2026/investor-presentation_q1fy2026_02_en.pdf",
        "FY26Q1 Investor Briefing Q&A"
      ]
    ],
    [
      [
        "https://group.softbank/en/ir/stock/sotp",
        "Net Asset Value per Share"
      ]
    ],
    [
      [
        "https://spratings.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3595415",
        "SoftBank Group Outlook Revised Up To Stable On Arm Stock Rise; BB+ Affirmed"
      ]
    ],
    [
      [
        "https://group.softbank/en/news/press/20260904",
        "Issuance of Unsecured Bonds (70th Series)"
      ]
    ],
    [
      [
        "https://group.softbank/en/news/press/20230919",
        "Closing of Arm’s Initial Public Offering and Full Exercise of Underwriters’ Option"
      ]
    ],
    [
      [
        "https://group.softbank/en/ir/investors/management_policy/risk_factor",
        "Risk Factors"
      ]
    ],
    [
      [
        "https://group.softbank/en/ir/financials/annual_reports/2026/message/goto",
        "Annual Report 2026: Message from CFO"
      ]
    ],
    [
      [
        "https://www.moneycontrol.com/news/business/softbank-gets-upsized-11-9-billion-loan-in-openai-funding-push-14029111.html",
        "SoftBank gets upsized $11.9 billion loan in OpenAI funding push"
      ]
    ],
    [
      [
        "https://links.sgx.com/FileOpen/SoftBank%20Group%20Corp.%20-%20Offering%20Memorandum%20dated%2023%20September%202026.ashx?App=Prospectus&FileID=71217",
        "Offering Memorandum, 23 September 2026"
      ]
    ],
    [
      [
        "https://group.softbank/en/news/press/20261009",
        "Early Redemption of EUR-denominated Senior Notes Issued in 2021"
      ]
    ]
  ],
  "en": [
    [
      [
        "https://group.softbank/en/news/press/20261001",
        "Execution of Follow-on Investment (Third Tranche) in OpenAI"
      ]
    ],
    [
      [
        "https://group.softbank/en/news/press/20260909",
        "Early Repayment of Bridge Loans"
      ]
    ],
    [
      [
        "https://group.softbank/en/news/press/20260924",
        "Issuance of Foreign Currency-Denominated Senior Notes"
      ]
    ],
    [
      [
        "https://group.softbank/en/news/press/20260227",
        "Follow-on Investments in OpenAI"
      ]
    ],
    [
      [
        "https://group.softbank/media/Project/sbg/sbg/pdf/ir/financials/financial_reports/financial-report_q1fy2026_01_en.pdf",
        "Consolidated Financial Report for the Three-month Period Ended June 30, 2026"
      ]
    ],
    [
      [
        "https://group.softbank/media/Project/sbg/sbg/pdf/ir/presentations/2026/investor-finance_q1fy2026_01_en.pdf",
        "Q1 FY2026 Earnings Results: Investor Briefing (Finance)"
      ]
    ],
    [
      [
        "https://group.softbank/media/Project/sbg/sbg/pdf/ir/presentations/2026/investor-presentation_q1fy2026_02_en.pdf",
        "FY26Q1 Investor Briefing Q&A"
      ]
    ],
    [
      [
        "https://group.softbank/en/ir/stock/sotp",
        "Net Asset Value per Share"
      ]
    ],
    [
      [
        "https://spratings.spglobal.com/ratings/en/regulatory/article/-/view/type/HTML/id/3595415",
        "SoftBank Group Outlook Revised Up To Stable On Arm Stock Rise; BB+ Affirmed"
      ]
    ],
    [
      [
        "https://group.softbank/en/news/press/20260904",
        "Issuance of Unsecured Bonds (70th Series)"
      ]
    ],
    [
      [
        "https://group.softbank/en/news/press/20230919",
        "Closing of Arm’s Initial Public Offering and Full Exercise of Underwriters’ Option"
      ]
    ],
    [
      [
        "https://group.softbank/en/ir/investors/management_policy/risk_factor",
        "Risk Factors"
      ]
    ],
    [
      [
        "https://group.softbank/en/ir/financials/annual_reports/2026/message/goto",
        "Annual Report 2026: Message from CFO"
      ]
    ],
    [
      [
        "https://www.moneycontrol.com/news/business/softbank-gets-upsized-11-9-billion-loan-in-openai-funding-push-14029111.html",
        "SoftBank gets upsized $11.9 billion loan in OpenAI funding push"
      ]
    ],
    [
      [
        "https://links.sgx.com/FileOpen/SoftBank%20Group%20Corp.%20-%20Offering%20Memorandum%20dated%2023%20September%202026.ashx?App=Prospectus&FileID=71217",
        "Offering Memorandum, 23 September 2026"
      ]
    ],
    [
      [
        "https://group.softbank/en/news/press/20261009",
        "Early Redemption of EUR-denominated Senior Notes Issued in 2021"
      ]
    ]
  ]
};
const kinds = ['funding', 'coupons', 'ltv', 'cash', 'trigger', 'ipo'];
const figureSources = { funding: [1, 2, 3], coupons: [3], ltv: [6, 8], cash: [6], trigger: [5, 7], ipo: [4, 11] };
const variants = ['fr', 'en'].flatMap(lang => kinds.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, key: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: softbankFundingSvg(lang, kind, mobile) }))));
const articles = ['fr', 'en'].map(lang => ({ lang, raw: read(`src/content/${lang === 'fr' ? 'posts/softbank-openai-echeances-liberte-attendre' : 'posts-en/softbank-openai-financing-freedom-to-wait'}.mdx`) }));
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
  svg: 'xmlns viewBox role aria-labelledby style',
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
  const prefix = `sbclock-${v.kind}-${v.lang}-${v.mobile ? 'm' : 'd'}`;
  assert.deepEqual(attrs(root), { xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[v.key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto' });
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
      if (k === 'opacity') assert.fail('No authored SoftBank opacity');
      if (k === 'transform') assert.fail('No authored SoftBank transforms');
    }
  }
  assert.deepEqual(ids.sort(), [`${prefix}-desc`, `${prefix}-title`]);

  for (const type of ['title', 'desc', 'metadata']) { const found = nodes.filter(n => tag(n) === type); assert.equal(found.length, 1); assert.ok(xmlText(found[0]).trim()); }
  const meta = JSON.parse(xmlText(nodes.find(n => tag(n) === 'metadata')));
  assert.deepEqual(meta, { asOf: '2026-10-15', sources: figureSources[v.kind], kind: v.kind, lang: v.lang, mobile: v.mobile, status: 'reported-data-and-explanatory-mechanisms', sourceUrls: figureSources[v.kind].map(id => sourceLinks[v.lang][id - 1][0][0]) });
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
const fonts = Object.fromEntries([400, 700].map(w => [w, fontFrom(`public/fonts/softbank-funding/liberation-sans-${w}.ttf`)]));
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
function checkSources(raw, lang) {
  assert.equal(typeof raw, 'string'); assert.ok(raw.length < 200000);
  const all = htmlNodes(parse(raw));
  const lists = all.filter(n => n.tagName === 'ol' && htmlAttr(n, 'class') === 'softbank-funding-sources'); assert.equal(lists.length, 1);
  assert.deepEqual(lists[0].attrs.map(a => [a.name, a.value]), [['class', 'softbank-funding-sources']]);
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
test('SoftBank funding variant selection is frozen, complete and rejects prototypes or coercion', () => {
  assert.deepEqual(SOFTBANK_FUNDING_KINDS, kinds); assert.ok(Object.isFrozen(SOFTBANK_FUNDING_KINDS)); assert.equal(variants.length, 24);
  for (const lang of ['', 'FR', '__proto__', 'constructor', {}, null, ['fr']]) assert.throws(() => softbankFundingSvg(lang, 'funding', false), TypeError);
  for (const kind of ['', '__proto__', 'constructor', 'prototype', {}, null, ['funding']]) assert.throws(() => softbankFundingSvg('fr', kind, false), TypeError);
  for (const mobile of [0, 1, '', 'false', null, new Boolean(false), {}, []]) assert.throws(() => softbankFundingSvg('fr', 'funding', mobile), TypeError);
  assert.equal(softbankFundingSvg('fr', 'funding'), softbankFundingSvg('fr', 'funding', false));
});
test('24 supplied SVGs preserve twenty raw variants, two cash titles and two English copy corrections', () => { for (const v of variants) faithful(v); });
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
    if ([1, 16].includes(record.id)) assert.equal(record.value, 'l0g Funding Sans');
    if ([2, 17].includes(record.id)) assert.equal(record.value, style);
    if ([3, 4, 18].includes(record.id)) assert.equal(record.value, `l0g Funding Sans ${style}`);
    if (record.id === 6) assert.equal(record.value, `l0gFundingSans-${style}`);
  }
}
test('redistributed font subsets retain copyrights and use the licensed derivative family name', () => {
  for (const weight of [400, 700]) {
    const subsetBytes = readFileSync(new URL(`../public/fonts/softbank-funding/liberation-sans-${weight}.ttf`, import.meta.url));
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
  const licence = read('public/fonts/softbank-funding/LICENSE.txt'); assertFontLicenseReferences(licence, 'liberation');
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
  const component = read('src/components/SoftbankFundingFigure.astro'), styles = component.match(/<style>([\s\S]*?)<\/style>/u); assert.ok(styles);
  const css = postcss.parse(styles[1]), declarations = n => Object.fromEntries(n.nodes.filter(d => d.type === 'decl').map(d => [d.prop, d.value]));
  const base = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.softbank-funding-figure'));
  assert.deepEqual([base.width, base['max-width'], base['container-type'], base['padding-bottom']], ['100%', '760px', 'inline-size', '.85rem']);
  assert.equal(base.overflow, 'visible');
  const graphic = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.softbank-funding-figure :global(svg)'));
  assert.deepEqual([graphic.width, graphic.height, graphic.overflow, graphic['letter-spacing']], ['100%', 'auto', 'visible', 'normal']);
  const labelFont = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.softbank-funding-figure :global(svg text)'));
  assert.equal(labelFont['font-family'], "'l0g SoftBank Funding', 'Liberation Sans', Arial, sans-serif");
  const mobile = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.softbank-funding-mobile'));
  assert.deepEqual([mobile.display, mobile.width, mobile['max-width'], mobile['margin-inline']], ['none', '100%', '400px', 'auto']);
  for (const kind of ['media', 'container']) {
    const rule = css.nodes.find(n => n.type === 'atrule' && n.name === kind && n.params === '(max-width: 640px)'); assert.ok(rule);
    assert.deepEqual(rule.nodes.map(n => [n.selector, declarations(n).display]), [['.softbank-funding-desktop', 'none'], ['.softbank-funding-mobile', 'block']]);
  }
  const faces = css.nodes.filter(n => n.type === 'atrule' && n.name === 'font-face').map(n => declarations(n));
  assert.deepEqual(faces.map(d => [d['font-family'], d.src, d['font-weight'], d['font-style']]), [400, 700].map(w => ["'l0g SoftBank Funding'", `url('/fonts/softbank-funding/liberation-sans-${w}.ttf') format('truetype')`, String(w), 'normal']));
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
  const figures = mdxNodes(tree).filter(n => n.name === 'SoftbankFundingFigure'); assert.equal(figures.length, 6);
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
  for (const [a, b] of [['kind="funding"', 'kind="ipo"'], ['number="01"', 'number="06"'], ['sources="1 2 3"', 'sources="1 99"'], ['lang="fr"', 'lang="en"']]) assert.throws(() => articleFigures(raw.replace(a, b), 'fr'));
  const first = mdxNodes(createProcessor().parse(raw)).find(n => n.name === 'SoftbankFundingFigure');
  const attribute = first.attributes.find(a=>a.name==='caption');
  const invalid = raw.slice(0, attribute.position.start.offset) + 'caption={process.env.SECRET}' + raw.slice(attribute.position.end.offset);
  assert.throws(() => articleFigures(invalid, 'fr'));
});
function quantitativeGeometry(v) {
  const ns = inspect(v).nodes, close = (a, b) => assert.ok(Math.abs(a - b) <= .001, `${v.key}: quantitative geometry ${a} / ${b}`);
  if (v.kind === 'ltv') {
    const holding = ns.filter(n => tag(n) === 'rect' && attrs(n).stroke === 'var(--color-signal, #5eead4)' && value(n, 'rx') === 0);
    const debt = ns.filter(n => tag(n) === 'rect' && attrs(n).fill === 'var(--color-amber, #f5b13d)');
    assert.equal(holding.length, 2); assert.equal(debt.length, 2);
    const scale = v.mobile ? 344 / 90 : 6.9;
    for (const [i, bar] of holding.entries()) {
      close(value(bar, 'x'), v.mobile ? 28 : 177); close(value(bar, 'width'), [48.3, 83.1][i] * scale);
      close(value(bar, 'height'), v.mobile ? 31 : 39); close(value(bar, 'y'), (v.mobile ? [318, 570] : [257, 434])[i]);
    }
    for (const [i, bar] of debt.entries()) {
      close(value(bar, 'x'), v.mobile ? 28 : 177); close(value(bar, 'width'), [8.2, 10.8][i] * scale);
      close(value(bar, 'height'), v.mobile ? 20 : 19); close(value(bar, 'y'), (v.mobile ? [401, 653] : [328, 505])[i]);
    }
    if (!v.mobile) {
      const share = ns.filter(n => tag(n) === 'rect' && attrs(n).fill === 'var(--color-signal, #5eead4)'); assert.equal(share.length, 1);
      close(value(share[0], 'x'), 57); close(value(share[0], 'width'), 580 * 49.91 / 83.11); close(value(share[0], 'height'), 26);
    }
  }
  if (v.kind === 'cash' && !v.mobile) {
    const bars = ns.filter(n => tag(n) === 'rect' && value(n, 'width') === 115); assert.equal(bars.length, 5);
    const stages = [[0, 2509.2], [2509.2, 1824.3], [0, 1824.3], [1824.3, 2313.8], [0, 2313.8]];
    for (const [i, bar] of bars.entries()) {
      const ends = stages[i].map(n => 602 - n * .115);
      close(value(bar, 'x'), 110 + i * 176); close(value(bar, 'width'), 115);
      close(value(bar, 'y'), Math.min(...ends)); close(value(bar, 'height'), Math.abs(ends[1] - ends[0]));
    }
    assert.equal(attrs(bars[3])['stroke-dasharray'], '7 5', 'Undrawn credit is a distinct outline, not funded cash');
  }
  if (v.kind === 'coupons') {
    const principal = ns.filter(n => tag(n) === 'circle'); assert.equal(principal.length, 5);
    const maturity = ['2030-04-01', '2032-04-01', '2034-04-01', '2030-10-01', '2032-10-01'];
    const day = date => Date.parse(date + 'T00:00:00Z'), start = day('2026-09-29'), end = day('2034-10-01');
    const fx = date => 403 + (day(date) - start) / (end - start) * 537;
    const rows = v.mobile ? [249, 386, 523, 660, 797] : [268, 345, 422, 527, 604];
    for (const [i, dot] of principal.entries()) {
      close(value(dot, 'cx'), v.mobile ? 350 : fx(maturity[i])); close(value(dot, 'cy'), rows[i]); close(value(dot, 'r'), v.mobile ? 6 : 7);
      const line = ns.filter(n => tag(n) === 'line' && value(n, 'y1') === rows[i] && value(n, 'y2') === rows[i] && attrs(n)['stroke-width'] === '2.5');
      assert.equal(line.length, 1); close(value(line[0], 'x1'), v.mobile ? 28 : 403); close(value(line[0], 'x2'), value(dot, 'cx'));
      const ticks = ns.filter(n => tag(n) === 'line' && value(n, 'y1') === rows[i] - 5 && value(n, 'y2') === rows[i] + 5);
      if (v.mobile) { assert.equal(ticks.length, 8); for (const [j, tick] of ticks.entries()) { close(value(tick, 'x1'), 58 + j * 36); close(value(tick, 'x2'), 58 + j * 36); } }
      else {
        const dates = []; for (let year = 2027; year <= 2034; year++) for (const month of ['04', '10']) { const d = `${year}-${month}-01`; if (day(d) < day(maturity[i])) dates.push(d); }
        assert.equal(ticks.length, dates.length); for (const [j, tick] of ticks.entries()) { close(value(tick, 'x1'), fx(dates[j])); close(value(tick, 'x2'), fx(dates[j])); }
      }
    }
  }
}
test('LTV bars, cash waterfall and coupon dates preserve their independent units, baselines and scales', () => { for (const v of variants) quantitativeGeometry(v); });
test('quantitative geometry rejects flattened bars, shifted baselines and altered coupon dates', () => {
  for (const kind of ['ltv', 'cash', 'coupons']) for (const mobile of [false, true]) {
    if (kind === 'cash' && mobile) continue;
    const v = variants.find(v => v.lang === 'fr' && v.kind === kind && v.mobile === mobile);
    const target = ns => ns.find(n => kind === 'coupons' ? tag(n) === 'circle' : tag(n) === 'rect' && (kind === 'cash' ? value(n, 'width') === 115 : attrs(n).fill === 'var(--color-amber, #f5b13d)'));
    for (const field of kind === 'coupons' ? ['cx', 'cy', 'r'] : ['width', 'height', 'y']) assert.throws(() => quantitativeGeometry(mutate(v, (_, ns) => { attrs(target(ns))[field] = '0'; })));
  }
});
test('bridge capacity, cumulative drawings and remaining debt remain distinct reported quantities', () => {
  const d = SOFTBANK_FUNDING_DATA; assert.ok(Object.isFrozen(d)); assert.equal(d.asOf, '2026-10-15');
  assert.deepEqual(d.bridge, {facilityUSDm:40000,cumulativeDrawnUSDm:30000,remainingBeforeRepaymentUSDm:25900,undrawnCancelledUSDm:10000,closedConfirmed:'2026-10-01',sourceIds:[1,2]});
  assert.notEqual(d.bridge.facilityUSDm + d.bridge.cumulativeDrawnUSDm, d.bridge.remainingBeforeRepaymentUSDm);
});
test('annual nominal coupons use each reported principal and rate without currency aggregation', () => {
  const d = SOFTBANK_FUNDING_DATA;
  assert.deepEqual(d.notes.map(n => [n.currency,n.principalMillions,n.couponPct,n.maturity]),[
    ['USD',1000,8.625,'2030-04-01'],['USD',4500,9.25,'2032-04-01'],['USD',4500,9.75,'2034-04-01'],['EUR',500,7.125,'2030-10-01'],['EUR',500,8,'2032-10-01'],
  ]);
  // Store rates as exact eighths of a percentage point, then total in 1/800 millions.
  const totals = {}; for (const n of d.notes) { assert.ok(Number.isInteger(n.couponPct * 8)); totals[n.currency] = (totals[n.currency] ?? 0) + n.principalMillions * n.couponPct * 8; }
  assert.deepEqual(totals, {USD:753000,EUR:60500}); assert.equal(totals.USD / 800,941.25); assert.equal(totals.EUR / 800,75.625);
  assert.equal(d.notesSource,3); assert.match(d.notesBasis,/full twelve-month nominal coupons/u); assert.match(d.notesBasis,/no FX aggregation, fees, hedges or accrued-interest stub/u);
});
test('cash reconciliation treats PB debt and undrawn credit as stages, not additive cash pools', () => {
  const d=SOFTBANK_FUNDING_DATA.cash;
  assert.deepEqual(d,{date:'2026-06-30',unit:'JPY billion',standAloneGross:2509.2,primeBrokerLoan:684.9,effective:1824.3,undrawnLine:489.5,includingUndrawn:2313.8,sourceId:6});
  assert.equal(25092-6849,18243); assert.equal(18243+4895,23138);
  assert.ok(d.includingUndrawn>d.effective); assert.notEqual(d.standAloneGross+d.effective+d.undrawnLine,d.includingUndrawn);
});
test('adjusted holdings and net debt retain dated like-for-like LTV and Arm concentration', () => {
  const d=SOFTBANK_FUNDING_DATA.balance; assert.deepEqual(d,{dates:['2026-03-31','2026-06-30'],holdingsTrillionJPY:[48.3,83.1],adjustedNetDebtTrillionJPY:[8.2,10.8],ltvPct:[17,13],sourceIds:[6,8]});
  for (const i of [0,1]) assert.equal(Math.round(d.adjustedNetDebtTrillionJPY[i]/d.holdingsTrillionJPY[i]*1000)/10,d.ltvPct[i]);
  assert.equal(Math.round(49.91/83.11*1000)/10,60.1);
});
test('August loan preserves cash collateral, parent guarantee, confirmed drawing and unknown current exposure', () => {
  assert.deepEqual(SOFTBANK_FUNDING_DATA.loan,{agreement:'2026-08-05',agreedUSDm:10000,maturity:'2028-08',currentOutstandingUnknown:true,drawdownDate:'2026-08-07',drawnUSDm:10000,collateral:'Borrower cash collateral account',guarantor:'SoftBank Group Corp.',OpenAIsharesPledged:false,thresholdUnknown:true,sourceIds:[5,7,15]});
});
test('Arm IPO precedent is historical net proceeds to the seller before other expenses', () => {
  assert.deepEqual(SOFTBANK_FUNDING_DATA.armIPO,{closing:'2023-09-18',ADSsoldMillions:102.5,expectedNetUSDm:5123,netBasis:'After underwriting discounts and commissions, before other expenses',sourceId:11});
});

test('sixteen source references retain complete primary and supplemental link fields', () => {
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
