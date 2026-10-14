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
import { copperBorderSvg, COPPER_BORDER_KINDS, COPPER_BORDER_DATA } from '../src/lib/copperBorderFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Complete raw and browser-tree goldens derived independently from all 24 supplied
// preview/svg assets, with eight heading-only edits and four variants receiving
// two closing-label fill corrections each. No implementation module or compiled
// output created these goldens; every other geometry/native field is pinned.
const originals = {
  "capacity-en-desktop": {
    "rawHash": "799dc54617108069e68ca5d57f029c3e33436cf53fb2996117d1259de292e7e0",
    "domHash": "87b89fdc6202a1a411b53bdcd552d1c5a3559ea4cd977fdde88b2dc1b029821e",
    "viewBox": "0 0 1000 670"
  },
  "capacity-en-mobile": {
    "rawHash": "763404ce32926c8077822d3e49c0d7ea5018c6cd4ad232f23c19a4d03d690d2d",
    "domHash": "965e62ff9b25ab9da8929f8f71b72a0e50bd77c25f696eac166077f62fd17e04",
    "viewBox": "0 0 400 850"
  },
  "capacity-fr-desktop": {
    "rawHash": "89e2a8323608553210975ee178d41f07f25798be6fef5f01cb8f488f2ccd5480",
    "domHash": "8ad3fa9c7e99faa68d439eff0dac80706a548e5fa5cb8a0c71bd6854d2bf12a4",
    "viewBox": "0 0 1000 670"
  },
  "capacity-fr-mobile": {
    "rawHash": "73515dcf9de27cf425bf8d877b8ac0bd5921f8c6efbb02559387adc97a08837c",
    "domHash": "d2180240005d9747a17a7ab925e2fddbc2b41091ea1a09067425550198e2eee8",
    "viewBox": "0 0 400 850"
  },
  "customs-en-desktop": {
    "rawHash": "43fccbc1ffe88389cdf86f8c7e7e97a8197126aa5b64494509f37cb9d650dc02",
    "domHash": "00d60fb62d11382f229adfc40ada9e81beb0223f75276d05f1b4faf13afddffb",
    "viewBox": "0 0 1000 840"
  },
  "customs-en-mobile": {
    "rawHash": "ee59019705bd798620ea5d17b1f9f5dd3b81bddb742e33e05b3375516853c964",
    "domHash": "d512b72ab4cffec21b16a456df17526d72d2ca8d9fbe707eade39c7d6fff145e",
    "viewBox": "0 0 400 1100"
  },
  "customs-fr-desktop": {
    "rawHash": "a9e899b9c24b6174b09a97f1182b7e3b079602e226aa50a0d91ff99722cdb9e9",
    "domHash": "cf49d11c40e001166eb7801098058ddc6e9ee4f9c857b7e58e3db116316d0c88",
    "viewBox": "0 0 1000 840"
  },
  "customs-fr-mobile": {
    "rawHash": "2371d64acfdad59f07cae790f14ca86148a1837a229a8fb923505ba946f21264",
    "domHash": "f04ffb442e635824651104a07a5e7c55977e0a641ac288e9edc99c28e7759d68",
    "viewBox": "0 0 400 1100"
  },
  "flows-en-desktop": {
    "rawHash": "d31fb05e7c49c36449f070f9ef9b4b336b3b9155192115d7ceee28526ea33475",
    "domHash": "09b7606ea57097b2dcc4904d11b29ea8bbbce45937be30a22d4d01b7ba15018f",
    "viewBox": "0 0 1000 825"
  },
  "flows-en-mobile": {
    "rawHash": "d0f1eefd51590d3f90193c4619b5995c3d1ef20a9d0fd7acc0a3a6f40f1612c5",
    "domHash": "f5359028962e447b9577ea0d76e9d1fdee17d3f206d1042465a7596b2594e486",
    "viewBox": "0 0 400 1410"
  },
  "flows-fr-desktop": {
    "rawHash": "497d6a4c8a76bea668d259490a3ed8f0ec7333d023f58b2d2442c5282dad257f",
    "domHash": "0bace685de02bdc04d22e37665683d6d03ca8974c302fabf4bf2c692da357760",
    "viewBox": "0 0 1000 825"
  },
  "flows-fr-mobile": {
    "rawHash": "b6ede71c5d6384b5d7a0289a93f34bc420c39756c298c9106c6430bfcec5c4c3",
    "domHash": "cb9a619ed55bdabcbf4284243803ccac95251453f08132e36c3933e45826c29a",
    "viewBox": "0 0 400 1410"
  },
  "hedge-en-desktop": {
    "rawHash": "36eac8419a71a2012a0496b22c20e7db96b98b5226d35123e53c481edd3b57ff",
    "domHash": "e2c7d1c9ea7a9f67c38370ab78ed25bd359a97a2a1af3b8e48b077edfbe65853",
    "viewBox": "0 0 1000 930"
  },
  "hedge-en-mobile": {
    "rawHash": "273f8405647088bedaf7b6d08703e51abd3a96d9027a8009a6f9541602ac6bd4",
    "domHash": "bf67175be268c105fc78e624f670d4d15a5cdf43a7f60151b9531e787d849ab1",
    "viewBox": "0 0 400 1050"
  },
  "hedge-fr-desktop": {
    "rawHash": "469cb65e28d4641c5957dcad68a0b1ebde67428ae5d307d7949e5856d84d4121",
    "domHash": "d47e75983155ce50b03462878548c79608d1ccff9facc712b654464340548ed6",
    "viewBox": "0 0 1000 930"
  },
  "hedge-fr-mobile": {
    "rawHash": "4f72c0c9b4460ed06320deea189ed374ee77abc3f6d779dee33393e5cee11fbb",
    "domHash": "a182d3d93ae07f2f0bf88cfff5d5d8b55b2e28c8b3e152dc68cffb4d09082de1",
    "viewBox": "0 0 400 1050"
  },
  "receipt-en-desktop": {
    "rawHash": "e249375c235959c6215c265015f146511b32fa9def71cacfc6b8b0c8548bb3b4",
    "domHash": "f31fd0cb4f9f73003b89f58727f56a990679b314541f041b646eaf99822d8b1c",
    "viewBox": "0 0 1000 830"
  },
  "receipt-en-mobile": {
    "rawHash": "bef748d2124ff08591873151a0b1b3ae836c911f19ceafb6b3fa7a71b200cce1",
    "domHash": "6e62aeb53347af6a0bf4b40986bfce2089f3c6e42d8a0892ae4aff1465d5ebdc",
    "viewBox": "0 0 400 1200"
  },
  "receipt-fr-desktop": {
    "rawHash": "8348ad37e13543577c55558f003a5e83b0408510f6a4071e81af74c8254741d7",
    "domHash": "2d3ea6918cbb995d1ff0129a93fefc7ac13a38385e20080dd6873399829b77fe",
    "viewBox": "0 0 1000 830"
  },
  "receipt-fr-mobile": {
    "rawHash": "bf05c64043282564e59d8d1bd96649899bbf1dc624ce0e7c4e1b418d3c006653",
    "domHash": "77db98d7208af65d1c595d9220090be34f1044ee157fa4073ccb3cf129d001c2",
    "viewBox": "0 0 400 1200"
  },
  "thresholds-en-desktop": {
    "rawHash": "5c7ac1353cc65bdbbf231c8557065ad09ff9816b43542edd56e11d081f0f67c1",
    "domHash": "c0999cdf13d7625fd6a375577a314641d93d55548b14d3b84e85b88aa6ea53c4",
    "viewBox": "0 0 1000 760"
  },
  "thresholds-en-mobile": {
    "rawHash": "0e622c111334711c35acab36bd698ad69c58c4bcbf795c71dddc53b2d8b96366",
    "domHash": "63cc8a3cfc5e74a4b9e8d6ef0d8e8f42cb33e01e6ea5f8c95f93b8e7259fb821",
    "viewBox": "0 0 400 1050"
  },
  "thresholds-fr-desktop": {
    "rawHash": "d8cc4c12a8d00094626b4a9f36223398c424e9838bf2da7eb5f075ebd7ca0b97",
    "domHash": "ad78840b223ba81045e75a27f30a83bd03a522e1178f59e8ef37cce427027d6d",
    "viewBox": "0 0 1000 760"
  },
  "thresholds-fr-mobile": {
    "rawHash": "28bb23e8410d0fbf7a668cc0adf9b6eda880bb4aced74ae2491f1b1e236a0d84",
    "domHash": "04aa847a1dff60ed85bfead5c83bfe920cba36a3c740e3666568b968f1f4d7a5",
    "viewBox": "0 0 400 1050"
  }
};
const sourceLinks = {
  "fr": [
    [
      [
        "https://www.cmegroup.com/notices/market-regulation/2026/10/mkr10-05-26.html",
        "Regularity Approval for Aluminum, Copper, Lead, and Zinc : Laredo"
      ]
    ],
    [
      [
        "https://www.cmegroup.com/notices/market-regulation/2026/08/mkr08-28-26.html",
        "Regularity Approval for Aluminum, Copper, Lead, and Zinc : Memphis"
      ]
    ],
    [
      [
        "https://www.cmegroup.com/notices/market-regulation/2026/09/mkr09-11-26.html",
        "Regularity Approval for Copper : Chicago"
      ]
    ],
    [
      [
        "https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication1038.pdf",
        "SP 1038, The International System of Units (SI): Conversion Factors for General Use"
      ]
    ],
    [
      [
        "https://www.cmegroup.com/notices/market-regulation/2026/08/mkr08-31-26b.html",
        "Approved Decrease in Copper Regularity : Tucson"
      ]
    ],
    [
      [
        "https://www.reuters.com/world/asia-pacific/trump-tariff-threat-built-us-copper-mountain-effects-are-fading-2026-10-14/",
        "Trump tariff threat built a US copper mountain, but the effects are fading"
      ],
      [
        "https://ca.investing.com/news/economic-indicators/analysistrump-tariff-threat-built-a-us-copper-mountain-but-the-effects-are-fading-4880286",
        "republication consultée"
      ]
    ],
    [
      [
        "https://www.reuters.com/commentary/reuters-open-interest/us-has-built-strategic-copper-reserve-now-can-it-keep-it-2026-10-12/",
        "The US has built a strategic copper reserve. Now can it keep it?"
      ],
      [
        "https://www.devdiscourse.com/article/international/3990984-roi-us-has-built-a-strategic-copper-reserve-now-can-it-keep-it-andy-home",
        "republication consultée"
      ]
    ],
    [
      [
        "https://www.whitehouse.gov/presidential-actions/2025/07/adjusting-imports-of-copper-into-the-united-states/",
        "Adjusting Imports of Copper Into the United States"
      ]
    ],
    [
      [
        "https://www.whitehouse.gov/presidential-actions/2026/04/strengthening-actions-taken-to-adjust-imports-of-aluminum-steel-and-copper-into-the-united-states/",
        "Strengthening Actions Taken to Adjust Imports of Aluminum, Steel, and Copper Into the United States"
      ]
    ],
    [
      [
        "https://www.whitehouse.gov/presidential-actions/2026/06/further-adjusting-the-tariff-regimes-for-imports-of-aluminum-steel-and-copper-into-the-united-states/",
        "Further Adjusting the Tariff Regimes for Imports of Aluminum, Steel, and Copper Into the United States"
      ]
    ],
    [
      [
        "https://www.cmegroup.com/rulebook/COMEX/1a/111.pdf",
        "Rulebook, Chapter 111 : Copper Futures"
      ]
    ],
    [
      [
        "https://www.stonex.com/en/insights/section-232-remains-copper-s-biggest-swing-factor-into-the-year-end/",
        "Section 232 remains copper’s biggest swing factor into the year-end"
      ]
    ],
    [
      [
        "https://www.cmegroup.com/rulebook/COMEX/1/7.pdf",
        "Rulebook, Chapter 7 : Delivery Facilities and Procedures"
      ]
    ],
    [
      [
        "https://www.cmegroup.com/education/courses/introduction-to-base-metals/what-is-the-base-metals-delivery-process",
        "What is the Base Metals Delivery Process?"
      ]
    ],
    [
      [
        "https://www.lme.com/en/Market-data/Reports-and-data/Warehouse-and-stocks-reports/Off-warrant-stock-reporting",
        "Off-warrant stock reporting"
      ]
    ],
    [
      [
        "https://www.ecfr.gov/current/title-19/chapter-I/part-141/subpart-E/section-141.69",
        "19 CFR § 141.69 : Applicable rates of duty"
      ]
    ],
    [
      [
        "https://www.ecfr.gov/current/title-19/chapter-I/part-144/subpart-D/section-144.38",
        "19 CFR § 144.38 : Withdrawal for consumption"
      ]
    ],
    [
      [
        "https://www.cmegroup.com/notices/market-regulation/2026/10/msn10-13-26.html",
        "Amendments to Rule 703.B : Copper Load-Out Procedures"
      ]
    ],
    [
      [
        "https://www.lme.com/en/Education/Online-resources/LME-Digest/The-role-of-premiums-and-discounts-in-pricing-of-industrial-metals-contracts",
        "The role of premiums and discounts in pricing of industrial metals contracts"
      ]
    ],
    [
      [
        "https://www.cmegroup.com/education/courses/introduction-to-futures/mark-to-market",
        "Mark-to-Market"
      ]
    ],
    [
      [
        "https://www.miningweekly.com/article/icsg-sees-global-refined-copper-surplus-widening-in-2027-2026-10-14",
        "ICSG sees global refined copper surplus widening in 2027"
      ]
    ]
  ],
  "en": [
    [
      [
        "https://www.cmegroup.com/notices/market-regulation/2026/10/mkr10-05-26.html",
        "Regularity Approval for Aluminum, Copper, Lead, and Zinc : Laredo"
      ]
    ],
    [
      [
        "https://www.cmegroup.com/notices/market-regulation/2026/08/mkr08-28-26.html",
        "Regularity Approval for Aluminum, Copper, Lead, and Zinc : Memphis"
      ]
    ],
    [
      [
        "https://www.cmegroup.com/notices/market-regulation/2026/09/mkr09-11-26.html",
        "Regularity Approval for Copper : Chicago"
      ]
    ],
    [
      [
        "https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication1038.pdf",
        "SP 1038, The International System of Units (SI): Conversion Factors for General Use"
      ]
    ],
    [
      [
        "https://www.cmegroup.com/notices/market-regulation/2026/08/mkr08-31-26b.html",
        "Approved Decrease in Copper Regularity : Tucson"
      ]
    ],
    [
      [
        "https://www.reuters.com/world/asia-pacific/trump-tariff-threat-built-us-copper-mountain-effects-are-fading-2026-10-14/",
        "Trump tariff threat built a US copper mountain, but the effects are fading"
      ],
      [
        "https://ca.investing.com/news/economic-indicators/analysistrump-tariff-threat-built-a-us-copper-mountain-but-the-effects-are-fading-4880286",
        "republication read"
      ]
    ],
    [
      [
        "https://www.reuters.com/commentary/reuters-open-interest/us-has-built-strategic-copper-reserve-now-can-it-keep-it-2026-10-12/",
        "The US has built a strategic copper reserve. Now can it keep it?"
      ],
      [
        "https://www.devdiscourse.com/article/international/3990984-roi-us-has-built-a-strategic-copper-reserve-now-can-it-keep-it-andy-home",
        "republication read"
      ]
    ],
    [
      [
        "https://www.whitehouse.gov/presidential-actions/2025/07/adjusting-imports-of-copper-into-the-united-states/",
        "Adjusting Imports of Copper Into the United States"
      ]
    ],
    [
      [
        "https://www.whitehouse.gov/presidential-actions/2026/04/strengthening-actions-taken-to-adjust-imports-of-aluminum-steel-and-copper-into-the-united-states/",
        "Strengthening Actions Taken to Adjust Imports of Aluminum, Steel, and Copper Into the United States"
      ]
    ],
    [
      [
        "https://www.whitehouse.gov/presidential-actions/2026/06/further-adjusting-the-tariff-regimes-for-imports-of-aluminum-steel-and-copper-into-the-united-states/",
        "Further Adjusting the Tariff Regimes for Imports of Aluminum, Steel, and Copper Into the United States"
      ]
    ],
    [
      [
        "https://www.cmegroup.com/rulebook/COMEX/1a/111.pdf",
        "Rulebook, Chapter 111 : Copper Futures"
      ]
    ],
    [
      [
        "https://www.stonex.com/en/insights/section-232-remains-copper-s-biggest-swing-factor-into-the-year-end/",
        "Section 232 remains copper’s biggest swing factor into the year-end"
      ]
    ],
    [
      [
        "https://www.cmegroup.com/rulebook/COMEX/1/7.pdf",
        "Rulebook, Chapter 7 : Delivery Facilities and Procedures"
      ]
    ],
    [
      [
        "https://www.cmegroup.com/education/courses/introduction-to-base-metals/what-is-the-base-metals-delivery-process",
        "What is the Base Metals Delivery Process?"
      ]
    ],
    [
      [
        "https://www.lme.com/en/Market-data/Reports-and-data/Warehouse-and-stocks-reports/Off-warrant-stock-reporting",
        "Off-warrant stock reporting"
      ]
    ],
    [
      [
        "https://www.ecfr.gov/current/title-19/chapter-I/part-141/subpart-E/section-141.69",
        "19 CFR § 141.69 : Applicable rates of duty"
      ]
    ],
    [
      [
        "https://www.ecfr.gov/current/title-19/chapter-I/part-144/subpart-D/section-144.38",
        "19 CFR § 144.38 : Withdrawal for consumption"
      ]
    ],
    [
      [
        "https://www.cmegroup.com/notices/market-regulation/2026/10/msn10-13-26.html",
        "Amendments to Rule 703.B : Copper Load-Out Procedures"
      ]
    ],
    [
      [
        "https://www.lme.com/en/Education/Online-resources/LME-Digest/The-role-of-premiums-and-discounts-in-pricing-of-industrial-metals-contracts",
        "The role of premiums and discounts in pricing of industrial metals contracts"
      ]
    ],
    [
      [
        "https://www.cmegroup.com/education/courses/introduction-to-futures/mark-to-market",
        "Mark-to-Market"
      ]
    ],
    [
      [
        "https://www.miningweekly.com/article/icsg-sees-global-refined-copper-surplus-widening-in-2027-2026-10-14",
        "ICSG sees global refined copper surplus widening in 2027"
      ]
    ]
  ]
};
const kinds = ['capacity', 'thresholds', 'receipt', 'customs', 'hedge', 'flows'];
const figureSources = { capacity: [1, 2, 3, 4, 5], thresholds: [11, 12], receipt: [13, 14, 15], customs: [16, 17], hedge: [19, 20], flows: [13] };
const variants = ['fr', 'en'].flatMap(lang => kinds.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, key: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: copperBorderSvg(lang, kind, mobile) }))));
const articles = ['fr', 'en'].map(lang => ({ lang, raw: read(`src/content/${lang === 'fr' ? 'posts/cuivre-stocks-americains-conditions-retour' : 'posts-en/copper-us-stockpiles-conditions-for-return'}.mdx`) }));
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
  svg: 'xmlns viewBox role aria-labelledby style data-copper-kind',
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
  const prefix = `cb-${v.kind}-${v.lang}-${v.mobile ? 'm' : 'd'}`;
  assert.deepEqual(attrs(root), { xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[v.key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto', 'data-copper-kind': v.kind });
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
      if (k === 'stroke-dasharray') assert.ok(['4 5', '4 6', '5 4', '5 5', '5 6'].includes(val));
      if (k === 'stroke-linecap' || k === 'stroke-linejoin') assert.equal(val, 'round');
      if (k === 'd') pathPoints(val);
      if (k === 'opacity') assert.equal(val, '0.22');
      if (k === 'transform') assert.fail('No authored copper transforms');
    }
  }
  assert.deepEqual(ids.sort(), [`${prefix}-desc`, `${prefix}-title`]);

  for (const type of ['title', 'desc', 'metadata']) { const found = nodes.filter(n => tag(n) === type); assert.equal(found.length, 1); assert.ok(xmlText(found[0]).trim()); }
  const meta = JSON.parse(xmlText(nodes.find(n => tag(n) === 'metadata')));
  assert.deepEqual(meta, { asOf: '2026-10-14', kind: v.kind, lang: v.lang, mobile: v.mobile });
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
const fonts = Object.fromEntries([400, 700].map(w => [w, fontFrom(`public/fonts/copper-border/liberation-sans-${w}.ttf`)]));
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
  const lists = all.filter(n => n.tagName === 'ol' && htmlAttr(n, 'class') === 'copper-border-sources'); assert.equal(lists.length, 1);
  assert.deepEqual(lists[0].attrs.map(a => [a.name, a.value]), [['class', 'copper-border-sources']]);
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
test('Copper border variant selection is frozen, complete and rejects prototypes or coercion', () => {
  assert.deepEqual(COPPER_BORDER_KINDS, kinds); assert.ok(Object.isFrozen(COPPER_BORDER_KINDS)); assert.equal(variants.length, 24);
  for (const lang of ['', 'FR', '__proto__', 'constructor', {}, null, ['fr']]) assert.throws(() => copperBorderSvg(lang, 'capacity', false), TypeError);
  for (const kind of ['', '__proto__', 'constructor', 'prototype', {}, null, ['capacity']]) assert.throws(() => copperBorderSvg('fr', kind, false), TypeError);
  for (const mobile of [0, 1, '', 'false', null, new Boolean(false), {}, []]) assert.throws(() => copperBorderSvg('fr', 'capacity', mobile), TypeError);
  assert.equal(copperBorderSvg('fr', 'capacity'), copperBorderSvg('fr', 'capacity', false));
});
test('24 reviewed SVGs preserve geometry with eight title-only and four contrast-only variants', () => { for (const v of variants) faithful(v); });
function closingLabelContrast(v) {
  assert.equal(v.kind, 'flows');
  const label = v.lang === 'fr' ? 'stock final' : 'closing stock';
  const labels = inspect(v).nodes.filter(n => tag(n) === 'text' && xmlText(n) === label);
  assert.equal(labels.length, 2, `${v.key}: two closing-stock labels`);
  for (const n of labels) assert.equal(attrs(n).fill, 'var(--color-paper, #e7e9ee)', `${v.key}: high-contrast closing-stock label`);
}
test('closing-stock labels use paper ink over the original translucent stock bars', () => {
  const selected = variants.filter(v => v.kind === 'flows'); assert.equal(selected.length, 4);
  for (const v of selected) closingLabelContrast(v);
});
test('closing-stock contrast checks reject a return to muted ink in every variant', () => {
  for (const v of variants.filter(v => v.kind === 'flows')) {
    const label = v.lang === 'fr' ? 'stock final' : 'closing stock';
    const regressed = mutate(v, (_, ns) => { attrs(ns.find(n => tag(n) === 'text' && xmlText(n) === label)).fill = 'var(--color-muted, #8b909b)'; });
    assert.throws(() => closingLabelContrast(regressed)); assert.throws(() => faithful(regressed));
  }
});
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
    if ([1, 16].includes(record.id)) assert.equal(record.value, 'l0g Debt Sans');
    if ([2, 17].includes(record.id)) assert.equal(record.value, style);
    if ([3, 4, 18].includes(record.id)) assert.equal(record.value, `l0g Debt Sans ${style}`);
    if (record.id === 6) assert.equal(record.value, `l0gDebtSans-${style}`);
  }
}
test('redistributed font subsets retain copyrights and use the licensed original family name', () => {
  for (const weight of [400, 700]) {
    const subsetBytes = readFileSync(new URL(`../public/fonts/copper-border/liberation-sans-${weight}.ttf`, import.meta.url));
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
  const licence = read('public/fonts/copper-border/LICENSE.txt'); assertFontLicenseReferences(licence, 'liberation');
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
  const component = read('src/components/CopperBorderFigure.astro'), styles = component.match(/<style>([\s\S]*?)<\/style>/u); assert.ok(styles);
  const css = postcss.parse(styles[1]), declarations = n => Object.fromEntries(n.nodes.filter(d => d.type === 'decl').map(d => [d.prop, d.value]));
  const base = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.copper-border-figure'));
  assert.deepEqual([base.width, base['max-width'], base['container-type'], base['padding-bottom']], ['100%', '760px', 'inline-size', '.85rem']);
  assert.equal(base.overflow, 'visible');
  const graphic = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.copper-border-figure :global(svg)'));
  assert.deepEqual([graphic.width, graphic.height, graphic.overflow, graphic['letter-spacing']], ['100%', 'auto', 'visible', 'normal']);
  const labelFont = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.copper-border-figure :global(svg text)'));
  assert.equal(labelFont['font-family'], "'l0g Copper Border', 'Liberation Sans', Arial, sans-serif");
  const mobile = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.copper-border-mobile'));
  assert.deepEqual([mobile.display, mobile.width, mobile['max-width'], mobile['margin-inline']], ['none', '100%', '400px', 'auto']);
  for (const kind of ['media', 'container']) {
    const rule = css.nodes.find(n => n.type === 'atrule' && n.name === kind && n.params === '(max-width: 640px)'); assert.ok(rule);
    assert.deepEqual(rule.nodes.map(n => [n.selector, declarations(n).display]), [['.copper-border-desktop', 'none'], ['.copper-border-mobile', 'block']]);
  }
  const faces = css.nodes.filter(n => n.type === 'atrule' && n.name === 'font-face').map(n => declarations(n));
  assert.deepEqual(faces.map(d => [d['font-family'], d.src, d['font-weight'], d['font-style']]), [400, 700].map(w => ["'l0g Copper Border'", `url('/fonts/copper-border/liberation-sans-${w}.ttf') format('truetype')`, String(w), 'normal']));
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
  const figures = mdxNodes(tree).filter(n => n.name === 'CopperBorderFigure'); assert.equal(figures.length, 6);
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
  for (const [a, b] of [['kind="capacity"', 'kind="flows"'], ['number="01"', 'number="06"'], ['sources="1 2 3 4 5"', 'sources="1 99"'], ['lang="fr"', 'lang="en"']]) assert.throws(() => articleFigures(raw.replace(a, b), 'fr'));
  const first = mdxNodes(createProcessor().parse(raw)).find(n => n.name === 'CopperBorderFigure');
  const attribute = first.attributes.find(a=>a.name==='caption');
  const invalid = raw.slice(0, attribute.position.start.offset) + 'caption={process.env.SECRET}' + raw.slice(attribute.position.end.offset);
  assert.throws(() => articleFigures(invalid, 'fr'));
});
function quantitativeGeometry(v) {
  const ns = inspect(v).nodes, close = (a, b) => assert.ok(Math.abs(a - b) <= .001, `${v.key}: quantitative geometry ${a} / ${b}`);
  if (v.kind === 'capacity') {
    const bars = ns.filter(n => tag(n) === 'rect' && attrs(n).fill === 'var(--color-amber, #f5b13d)');
    assert.equal(bars.length, 3);
    for (const [i, bar] of bars.entries()) {
      close(value(bar, 'x'), v.mobile ? 24 : 282);
      close(value(bar, 'width'), COPPER_BORDER_DATA.approvals[i].rounded_metric_tonnes / 40000 * (v.mobile ? 352 : 624));
      close(value(bar, 'height'), v.mobile ? 26 : 29);
    }
  }
  if (v.kind === 'thresholds') {
    const zones = ns.filter(n => tag(n) === 'rect' && attrs(n).fill === 'var(--color-surface-2, #171a20)');
    assert.equal(zones.length, 3);
    const boundaries = [-600, -250, 300, 800], map = d => v.mobile ? 255 + (800 - d) * 650 / 1400 : 66 + (d + 600) * 868 / 1400;
    for (const [i, zone] of zones.entries()) {
      const ends = [map(boundaries[i]), map(boundaries[i + 1])];
      close(value(zone, v.mobile ? 'y' : 'x'), Math.min(...ends));
      close(value(zone, v.mobile ? 'height' : 'width'), Math.abs(ends[1] - ends[0]));
      close(value(zone, v.mobile ? 'x' : 'y'), v.mobile ? 36 : 253);
      close(value(zone, v.mobile ? 'width' : 'height'), v.mobile ? 29 : 62);
    }
    const dots = ns.filter(n => tag(n) === 'circle'); assert.equal(dots.length, 3);
    for (const [i, dot] of dots.entries()) {
      close(value(dot, v.mobile ? 'cy' : 'cx'), map((v.mobile ? [600, 100, -400] : [-400, 100, 600])[i]));
      close(value(dot, v.mobile ? 'cx' : 'cy'), v.mobile ? 51 : 283);
    }
  }
  if (v.kind === 'hedge') {
    const bars = ns.filter(n => tag(n) === 'rect' && ['var(--color-topic-blue, #7aa2f7)', 'var(--color-amber, #f5b13d)', 'var(--color-paper, #e7e9ee)'].includes(attrs(n).fill));
    assert.equal(bars.length, 4);
    const pairs = [[0, -500], [-500, 200], [200, 700], [0, 700]], scale = v.mobile ? 159 / 700 : .3;
    for (const [i, bar] of bars.entries()) {
      const coordinates = pairs[i].map(n => v.mobile ? 178.28571428571428 + n * scale : 520 - n * scale);
      close(value(bar, v.mobile ? 'x' : 'y'), Math.min(...coordinates));
      close(value(bar, v.mobile ? 'width' : 'height'), Math.abs(pairs[i][1] - pairs[i][0]) * scale);
      close(value(bar, v.mobile ? 'height' : 'width'), v.mobile ? 37 : 126);
    }
  }
  if (v.kind === 'flows') {
    const opening = ns.filter(n => tag(n) === 'rect' && attrs(n)['stroke-dasharray']);
    const closing = ns.filter(n => tag(n) === 'rect' && attrs(n).opacity === '0.22');
    assert.equal(opening.length, 2); assert.equal(closing.length, 2);
    for (const [i, bar] of closing.entries()) {
      close(value(bar, 'height') / value(opening[i], 'height'), 180 / 200);
      close(value(bar, 'y') + value(bar, 'height'), value(opening[i], 'y') + value(opening[i], 'height'));
      close(value(bar, 'width'), v.mobile ? 128 : 146);
    }
  }
}
test('quantitative geometry retains zero baselines, proportional bars, thresholds and a distinct total', () => {
  for (const v of variants) quantitativeGeometry(v);
});
test('numeric geometry rejects flat bars, shifted baselines and misleading proportional lengths', () => {
  for (const kind of ['capacity', 'thresholds', 'hedge', 'flows']) for (const mobile of [false, true]) {
    const v = variants.find(v => v.lang === 'fr' && v.kind === kind && v.mobile === mobile);
    const target = ns => ns.find(n => tag(n) === 'rect' && (kind === 'capacity' ? attrs(n).fill === 'var(--color-amber, #f5b13d)' : kind === 'thresholds' ? attrs(n).fill === 'var(--color-surface-2, #171a20)' : kind === 'hedge' ? attrs(n).fill === 'var(--color-topic-blue, #7aa2f7)' : attrs(n).opacity === '0.22'));
    for (const field of ['width', 'height']) assert.throws(() => quantitativeGeometry(mutate(v, (_, ns) => { attrs(target(ns))[field] = '0'; })));
    assert.throws(() => quantitativeGeometry(mutate(v, (_, ns) => { attrs(target(ns))[kind === 'flows' || kind === 'hedge' && !mobile || kind === 'thresholds' && mobile ? 'y' : 'x'] = '0'; })));
  }
});
test('reported capacities retain exact units, dates and reproducible rounded conversions', () => {
  const d = COPPER_BORDER_DATA;
  assert.ok(Object.isFrozen(d)); assert.equal(d.asOf, '2026-10-14');
  assert.deepEqual(d.approvals.map(a => [a.city,a.operator,a.date,a.short_tons,a.rounded_metric_tonnes,a.source]), [
    ['Memphis','Henry Bath','2026-08-28',33565,30450,2],
    ['Chicago','Metal Ox','2026-09-11',44092,40000,3],
    ['Laredo','Henry Bath','2026-10-05',40345,36600,1],
  ]);
  assert.deepEqual(d.conversion,{short_ton_to_metric_tonne:0.90718474,source:4});
  for (const a of d.approvals) {
    assert.ok(Math.abs(a.metric_tonnes-a.short_tons*d.conversion.short_ton_to_metric_tonne)<1e-9);
    assert.equal(Math.round(a.metric_tonnes),a.rounded_metric_tonnes);
  }
  assert.deepEqual(d.inventory_estimates,[{estimator:'Citi',publication:'2026-10-12',million_metric_tonnes:1.1,source:7},{estimator:'Macquarie',publication:'2026-10-14',million_metric_tonnes:1.6,source:6}]);
  assert.equal(d.estimates_comparable,false);
});
test('hypothetical inbound/outbound thresholds include both frictions and keep zero-profit boundaries', () => {
  const a=COPPER_BORDER_DATA.arbitrage;
  assert.equal(a.status,'hypothetical'); assert.equal(a.unit,'USD/metric tonne');
  assert.deepEqual([a.inbound_friction,a.outbound_friction,a.spreads,a.tariff_and_option_value_included],[300,250,[600,100,-400],false]);
  const incoming=d=>d-a.inbound_friction,outgoing=d=>-d-a.outbound_friction;
  assert.equal(incoming(600),300); assert.equal(outgoing(100),-350); assert.equal(outgoing(-400),150);
  assert.equal(incoming(300),0); assert.equal(outgoing(-250),0);
  for(const d of [-250,0,100,300]) assert.ok(incoming(d)<=0&&outgoing(d)<=0);
  assert.ok(incoming(300.01)>0);assert.ok(outgoing(-250.01)>0);
});
test('warrant simulation distinguishes title/status changes from physical withdrawal', () => {
  const w=COPPER_BORDER_DATA.warrant;
  assert.equal(w.status,'hypothetical');assert.equal(w.unit,'metric tonnes');assert.equal(w.cargo,1000);
  assert.deepEqual(w.states,[{registered:1000,eligible:0,total:1000},{registered:1000,eligible:0,total:1000},{registered:0,eligible:1000,total:1000},{registered:0,eligible:0,total:0}]);
  for(const s of w.states) assert.equal(s.registered+s.eligible,s.total);
});
test('perfect long benchmark hedge leaves only the explicit premium increase', () => {
  const h=COPPER_BORDER_DATA.hedge;
  assert.equal(h.status,'hypothetical');assert.equal(h.unit,'USD/metric tonne');
  assert.deepEqual([h.base_initial,h.base_final,h.premium_initial,h.premium_final,h.long_future_initial,h.long_future_final,h.perfect_base_hedge_assumed],[10000,9500,200,900,10000,9500,true]);
  const budget=h.base_initial+h.premium_initial,invoice=h.base_final+h.premium_final,pnl=h.long_future_final-h.long_future_initial;
  assert.deepEqual([budget,invoice,pnl,invoice-pnl,invoice-pnl-budget],[10200,10400,-500,10900,700]);
  assert.equal(h.premium_final-h.premium_initial,invoice-pnl-budget);
});
test('identical inventory drawdowns retain different hypothetical domestic/export flows', () => {
  const d=COPPER_BORDER_DATA.drawdown;
  assert.equal(d.status,'hypothetical');assert.equal(d.unit,'thousand metric tonnes over a fictitious month');
  assert.deepEqual([d.start,d.receipts,d.scenarios],[200,40,[{domestic:60,export:0,end:180},{domestic:40,export:20,end:180}]]);
  for(const s of d.scenarios) assert.equal(d.start+d.receipts-s.domestic-s.export,s.end);
  assert.equal(d.start-d.scenarios[0].end,20);assert.notEqual(d.scenarios[0].export,d.scenarios[1].export);
});
test('twenty-one source references retain complete primary and supplemental link fields', () => {
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
  assert.throws(() => checkSources(raw.replace('<strong>', '<strong onclick="bad">'), 'fr'));
  assert.throws(() => checkSources(raw.replace('href="#source-11"', 'href="#source-99"'), 'fr'));
});
