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
import { tradeCycleSvg, TRADE_CYCLE_KINDS, TRADE_CYCLE_DATA } from '../src/lib/tradeCycleFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Complete raw and browser-tree goldens derived independently from all 24 supplied
// exports/svg assets. No implementation or compiled output created these goldens.
const originals = {
  "borders-en-desktop": {
    "rawHash": "53fdf86e852ef6835be5fdd04b4b07f4caf3d5f0952ec6e70f48626fc6d65e2e",
    "domHash": "d14b85bba362b986a7b29c56dd36e6064b4aa98bda14c972a5219c7bdbb9f509",
    "viewBox": "0 0 1000 992"
  },
  "borders-en-mobile": {
    "rawHash": "bb1b71c5bfde10ccd1ef1459dd15e9c072debe0f6ef05ed0a0301aff640675a3",
    "domHash": "cfd2c18896999e3fb9fe346609be507ea17c3b80869d16e7454ba7a92654d934",
    "viewBox": "0 0 400 1388"
  },
  "borders-fr-desktop": {
    "rawHash": "4e3941965b3ca0c843e8c4b1cbcd1a67591b9ab40ba34cef7a902b873fa18603",
    "domHash": "99800bc25c10dd78633efbd3f50f43c5487da63c7d86f3e9ee70bc3647043adc",
    "viewBox": "0 0 1000 992"
  },
  "borders-fr-mobile": {
    "rawHash": "72907c6d1e5a8bf1e48d45afcba2b7faad3dd18964d9a613473cf8069ecaa8d7",
    "domHash": "6b79e6a586e281c90a557f0b40a5f5c9a344f39594e9a668de94caa00a5aaf7d",
    "viewBox": "0 0 400 1388"
  },
  "buyers-en-desktop": {
    "rawHash": "4ed8400d927e4430cc365e721b85a659de598d3942f63f827811af442cb501cb",
    "domHash": "524631332dbb4c8696e53af6eae5619881739b9307f7fa02e376683a3b4841e3",
    "viewBox": "0 0 1000 1200"
  },
  "buyers-en-mobile": {
    "rawHash": "047f8b0c41495eee5ff533b3ba44fca0b95f9abf3b5bb4d50aa1304d680d478f",
    "domHash": "644eeb03512747fc935641a0c3b447d48da6ba130393c41fa2bc9bd2d55decf6",
    "viewBox": "0 0 400 1340"
  },
  "buyers-fr-desktop": {
    "rawHash": "ebea16672e17cfb058fb151e223a84400c91f2658e20260fe2ea9a210a305e64",
    "domHash": "d99e2ad145a641577a26ee8ce96efa0db0a47833ea1248c2b6862bdca9370254",
    "viewBox": "0 0 1000 1200"
  },
  "buyers-fr-mobile": {
    "rawHash": "c1935bfa6846ab9758ef90fb3947826a57e4b8133b5f96ba96867bc864500830",
    "domHash": "ea6e0291c40955cd4ed8334d192273f26be7baa81d1c8e9c4acbba84398a18c2",
    "viewBox": "0 0 400 1340"
  },
  "inventory-en-desktop": {
    "rawHash": "6246b1cac6b16b0e997e5cdc89c078ed44186c5db5488ca187a01a0dd86431e7",
    "domHash": "43622a299c4d8d10f7f29a00d5c85370b8b2fb9c5fb22ef4df7f6e14647ee773",
    "viewBox": "0 0 1000 1150"
  },
  "inventory-en-mobile": {
    "rawHash": "0ba552a85f4d74bd92b041040fe3002e271f4c0874dd975393791b8ef175db1e",
    "domHash": "f8e03cad67b92d77723a8645d9d429f06dc8b5f9baf95a1406829e859fbfc63b",
    "viewBox": "0 0 400 1121"
  },
  "inventory-fr-desktop": {
    "rawHash": "c76d6f6e1ba936f0dd0e9d71107090d6c231a93332ec61006d96ff48ed520365",
    "domHash": "6bf9e27a9441ac23b9dd48b4009282520828e2f64a837d04459a5321a8e72675",
    "viewBox": "0 0 1000 1150"
  },
  "inventory-fr-mobile": {
    "rawHash": "db0828e974e827a26450fa2e0d817349ba29d3e989ea43cef0a256fbc347065c",
    "domHash": "a4f7914ed2c355f10cdd6b56882fa55246c85d796b08765b502c40360f6c663e",
    "viewBox": "0 0 400 1121"
  },
  "macro-en-desktop": {
    "rawHash": "471468c902d22c911776c8abe42f3325e784aed745c6f89e1f0bb8637e96c1d2",
    "domHash": "f25b83240f5792117e3fa413036236876a89573cc34dec3a504af1bc7d0958cf",
    "viewBox": "0 0 1000 1074"
  },
  "macro-en-mobile": {
    "rawHash": "1b7c2414133cf51faf1beae35a3248446511a36975533b54cb3451075bca2582",
    "domHash": "ff70a136a64f11863dcfed46625beb0dfff09a14d82fbee76335ccd3aab0777c",
    "viewBox": "0 0 400 1542"
  },
  "macro-fr-desktop": {
    "rawHash": "c3ebc5495abfb7aa92636f844636d7a0f50396ef9656235b17b352352945c5e3",
    "domHash": "6801894ceee0a74e8dca0f37d5250834cca1b661af9655ad6d806c9a3fe53087",
    "viewBox": "0 0 1000 1074"
  },
  "macro-fr-mobile": {
    "rawHash": "0705ae5ed3cbf1ee9d867e3ea3aa3462b9a20a98470ff728f0611776e8c56bcd",
    "domHash": "eb8f9eff883d418b4c2294118c6fedb9da1f4dd8fa243a1591887809efdaa6c6",
    "viewBox": "0 0 400 1542"
  },
  "momentum-en-desktop": {
    "rawHash": "673331bff82eeb894db3f2d1723ba1331037756eb8d8831fcaa050492f01c17b",
    "domHash": "fb198a332867bd5d8c94ce836d7b2a1a7812db73f28650515da8d2f917bba33d",
    "viewBox": "0 0 1000 842"
  },
  "momentum-en-mobile": {
    "rawHash": "4735cf4e7f53d247546ea3c487841f6ccbed244b4a3e67140949b7e13ab3d170",
    "domHash": "14b79f311622e7349f92fe1682f9a3850d72d7389ffb9a48858f703ffe97612e",
    "viewBox": "0 0 400 938"
  },
  "momentum-fr-desktop": {
    "rawHash": "49c6f87d805e611bb58e3d3705a57e3d71229fe562fec89141ef7eaff0b6e4b4",
    "domHash": "c52bdd30c2259c0bbff892695b96987c645dd0ef0c397f0833620edabdada4a2",
    "viewBox": "0 0 1000 842"
  },
  "momentum-fr-mobile": {
    "rawHash": "e98972ab3d622aa1afb3949bd663fced4af5e4fbac2eb158cbedb0caea5ca49b",
    "domHash": "bc1c6a0a87173520b6aea5bda9c44f461355ac1ff26cbdf67c92fd90e7d0f41f",
    "viewBox": "0 0 400 938"
  },
  "taiwan-en-desktop": {
    "rawHash": "18f138cd13530c28b1b428d609ae258880b86c4df38f0534e50f30b3561a8d8d",
    "domHash": "5ae33a75077851e62c7d8a42a7af3bd98806a00868aab25b47c965344bfb1c25",
    "viewBox": "0 0 1000 950"
  },
  "taiwan-en-mobile": {
    "rawHash": "e499e516f9fb731ab2fb69874d7558dbaa45d27da688fd4df4d79aa27dbb031a",
    "domHash": "d25094d320e9ebd1300532c8b5cbf589307600d08c247fbc6e9a656fe93828e2",
    "viewBox": "0 0 400 1388"
  },
  "taiwan-fr-desktop": {
    "rawHash": "ed20e966155913bc3448a3e69ca53366b14429c432675e07234b125ad17a3e40",
    "domHash": "a64b6bb858dcec6c4367bf4054d55f39b2954cb19aaf841419bb08ffff07c055",
    "viewBox": "0 0 1000 950"
  },
  "taiwan-fr-mobile": {
    "rawHash": "99c2d2c8f79c4d98c5d91501f7b341be063b33b9f4ecd59949331857450f1b9b",
    "domHash": "e2ab03c859b687203fc58e923e6f53357c0b42199d81cf2ea805f54bb62c4e66",
    "viewBox": "0 0 400 1388"
  }
};
// Exact canonical source fields independently reviewed, then frozen from the
// controlled bilingual copy. Every observation retains its published period and scope.
const sourceLinks = {
  "fr": [
    [
      [
        "https://www.reuters.com/world/asia-pacific/chinas-exports-surge-363-yy-september-imports-up-31-2026-10-14/",
        "Reuters, China’s exports surge 36.3% y/y in September, imports up 31%"
      ],
      [
        "https://www.investing.com/news/economy-news/chinas-exports-surge-363-yy-in-september-imports-up-31-4947903",
        "Document complémentaire"
      ]
    ],
    [
      [
        "https://news.bjd.com.cn/2026/10/14/11994548.shtml",
        "SCIO / Douanes chinoises, Conférence de presse sur le commerce extérieur des neuf premiers mois de 2026"
      ]
    ],
    [
      [
        "https://www.wto.org/english/news_e/news26_e/stat_08oct26_510_e.htm",
        "OMC / WTO · AI boom and trade resilience to Middle East crisis lift outlook, but gains to be uneven"
      ],
      [
        "https://www.wto.org/english/res_e/booksp_e/gtos1026_e.pdf",
        "rapport intégral"
      ]
    ],
    [
      [
        "https://www.mof.gov.tw/Eng/singlehtml/f48d641f159a4866b1d31c0916fbcc71?cntId=c4c81d1e185c4e85a192a0fb65f7cd64",
        "Ministère des Finances de Taïwan / Taiwan Ministry of Finance, Exports and Imports in September 2026"
      ],
      [
        "https://service.mof.gov.tw/public/Data/statistic/trade/news/11509/11509_%E8%8B%B1%E6%96%87%E6%96%B0%E8%81%9E%E7%A8%BF.pdf",
        "Document complémentaire"
      ]
    ],
    [
      [
        "https://www.oecd.org/en/topics/sub-issues/trade-in-value-added.html",
        "OCDE / OECD, Trade in value added"
      ]
    ],
    [
      [
        "https://www.oecd.org/en/publications/trade-in-value-added-country-notes_f5cbfae2-en/united-states_7b474500-en.html",
        "OCDE / OECD, Trade in Value Added – Country notes: United States"
      ],
      [
        "https://www.oecd.org/en/publications/seeing-the-capital-behind-trade_913e24ec-en.html",
        "Seeing the capital behind trade"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm",
        "NVIDIA / SEC EDGAR, Form 10-Q, quarter ended July 26, 2026"
      ]
    ],
    [
      [
        "https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Second-Quarter-Fiscal-2027/",
        "NVIDIA, NVIDIA Announces Financial Results for Second Quarter Fiscal 2027"
      ]
    ],
    [
      [
        "https://www.bis.org/publications/bulletin-48-bottlenecks-causes-and-macroeconomic-implications",
        "BRI / BIS, Bottlenecks: causes and macroeconomic implications, Bulletin 48"
      ],
      [
        "https://www.bis.org/publications/bulletin-48-bottlenecks-causes-and-macroeconomic-implications.pdf",
        "Bulletin intégral"
      ]
    ],
    [
      [
        "https://mediacenter.imf.org/news/imf-world-economic-output-press-briefing/s/85df82f1-2ffe-44b3-91c4-a7a0e01042ae",
        "FMI / IMF, World Economic Outlook press briefing"
      ]
    ],
    [
      [
        "https://www.ecb.europa.eu/press/key/date/2026/html/ecb.sp260323_1~1e06784a89.en.html",
        "BCE / ECB, AI and the euro area economy, Philip R. Lane"
      ]
    ],
    [
      [
        "https://stats.wto.org/assets/UserGuide/TechnicalNotes_en.pdf",
        "OMC / WTO · Technical notes, international merchandise trade statistics"
      ]
    ],
    [
      [
        "https://www.oecd.org/en/publications/global-value-chain-repositioning_8c97068d-en.html",
        "OCDE · Global value chain repositioning"
      ],
      [
        "https://www.oecd.org/en/publications/global-value-chain-repositioning_8c97068d-en/full-report.html",
        "Rapport intégral"
      ]
    ],
    [
      [
        "https://storage.fasb.org/FASAC-ALL-201809%20All%20Meeting%20Materials%20public.pdf",
        "FASB / FASAC · Meeting materials, 25 September 2018"
      ]
    ]
  ],
  "en": [
    [
      [
        "https://www.reuters.com/world/asia-pacific/chinas-exports-surge-363-yy-september-imports-up-31-2026-10-14/",
        "Reuters, China’s exports surge 36.3% y/y in September, imports up 31%"
      ],
      [
        "https://www.investing.com/news/economy-news/chinas-exports-surge-363-yy-in-september-imports-up-31-4947903",
        "Supporting document"
      ]
    ],
    [
      [
        "https://news.bjd.com.cn/2026/10/14/11994548.shtml",
        "SCIO / Douanes chinoises, Conférence de presse sur le commerce extérieur des neuf premiers mois de 2026"
      ]
    ],
    [
      [
        "https://www.wto.org/english/news_e/news26_e/stat_08oct26_510_e.htm",
        "WTO · AI boom and trade resilience to Middle East crisis lift outlook, but gains to be uneven"
      ],
      [
        "https://www.wto.org/english/res_e/booksp_e/gtos1026_e.pdf",
        "full report"
      ]
    ],
    [
      [
        "https://www.mof.gov.tw/Eng/singlehtml/f48d641f159a4866b1d31c0916fbcc71?cntId=c4c81d1e185c4e85a192a0fb65f7cd64",
        "Ministère des Finances de Taïwan / Taiwan Ministry of Finance, Exports and Imports in September 2026"
      ],
      [
        "https://service.mof.gov.tw/public/Data/statistic/trade/news/11509/11509_%E8%8B%B1%E6%96%87%E6%96%B0%E8%81%9E%E7%A8%BF.pdf",
        "Supporting document"
      ]
    ],
    [
      [
        "https://www.oecd.org/en/topics/sub-issues/trade-in-value-added.html",
        "OCDE / OECD, Trade in value added"
      ]
    ],
    [
      [
        "https://www.oecd.org/en/publications/trade-in-value-added-country-notes_f5cbfae2-en/united-states_7b474500-en.html",
        "OCDE / OECD, Trade in Value Added – Country notes: United States"
      ],
      [
        "https://www.oecd.org/en/publications/seeing-the-capital-behind-trade_913e24ec-en.html",
        "Seeing the capital behind trade"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/1045810/000104581026000075/nvda-20260726.htm",
        "NVIDIA / SEC EDGAR, Form 10-Q, quarter ended July 26, 2026"
      ]
    ],
    [
      [
        "https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-Financial-Results-for-Second-Quarter-Fiscal-2027/",
        "NVIDIA, NVIDIA Announces Financial Results for Second Quarter Fiscal 2027"
      ]
    ],
    [
      [
        "https://www.bis.org/publications/bulletin-48-bottlenecks-causes-and-macroeconomic-implications",
        "BRI / BIS, Bottlenecks: causes and macroeconomic implications, Bulletin 48"
      ],
      [
        "https://www.bis.org/publications/bulletin-48-bottlenecks-causes-and-macroeconomic-implications.pdf",
        "Full bulletin"
      ]
    ],
    [
      [
        "https://mediacenter.imf.org/news/imf-world-economic-output-press-briefing/s/85df82f1-2ffe-44b3-91c4-a7a0e01042ae",
        "FMI / IMF, World Economic Outlook press briefing"
      ]
    ],
    [
      [
        "https://www.ecb.europa.eu/press/key/date/2026/html/ecb.sp260323_1~1e06784a89.en.html",
        "BCE / ECB, AI and the euro area economy, Philip R. Lane"
      ]
    ],
    [
      [
        "https://stats.wto.org/assets/UserGuide/TechnicalNotes_en.pdf",
        "WTO · Technical notes, international merchandise trade statistics"
      ]
    ],
    [
      [
        "https://www.oecd.org/en/publications/global-value-chain-repositioning_8c97068d-en.html",
        "OECD · Global value chain repositioning"
      ],
      [
        "https://www.oecd.org/en/publications/global-value-chain-repositioning_8c97068d-en/full-report.html",
        "Full report"
      ]
    ],
    [
      [
        "https://storage.fasb.org/FASAC-ALL-201809%20All%20Meeting%20Materials%20public.pdf",
        "FASB / FASAC · Meeting materials, 25 September 2018"
      ]
    ]
  ]
};
const kinds = ['momentum', 'taiwan', 'borders', 'buyers', 'inventory', 'macro'];
const figureSources = { momentum: [3, 12], taiwan: [4], borders: [5, 6], buyers: [7, 14], inventory: [9], macro: [5, 10, 11] };
const variants = ['fr', 'en'].flatMap(lang => kinds.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, key: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: tradeCycleSvg(lang, kind, mobile) }))));
const articles = ['fr', 'en'].map(lang => ({ lang, raw: read(`src/content/${lang === 'fr' ? 'posts/commerce-mondial-rythme-commandes-ia' : 'posts-en/world-trade-rhythm-ai-orders'}.mdx`) }));
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
  svg: 'xmlns viewBox role aria-labelledby style data-kind data-lang data-mobile',
  title: 'id', desc: 'id', metadata: '', g: 'data-region data-bounds',
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
  'var(--color-line-strong, rgba(255,255,255,.20))',
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
  const prefix = `tc-${v.kind}-${v.lang}-${v.mobile ? 'm' : 'd'}`;
  assert.deepEqual(attrs(root), { xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[v.key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto', 'data-kind': v.kind, 'data-lang': v.lang, 'data-mobile': String(v.mobile) });
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
      if (k === 'data-region') { assert.match(val, /^[a-z][a-z0-9-]{0,50}$/u); labels.push(val); }
      if (k === 'data-bounds') { const b = val.split(' '); assert.equal(b.length, 4); const nums = b.map(number); assert.ok(nums[2] > 0 && nums[3] > 0); }
      if (k === 'font-family') assert.equal(val, 'Arial, Helvetica, sans-serif');
      if (k === 'font-weight') assert.ok(['400', '700'].includes(val));
      if (k === 'font-size') assert.ok(number(val) >= 14 && number(val) <= 64);
      if (k === 'text-anchor') assert.ok(['start', 'middle', 'end'].includes(val));
      if (k === 'stroke-dasharray') assert.ok(['4 4'].includes(val));
      if (k === 'stroke-linecap' || k === 'stroke-linejoin') assert.equal(val, 'round');
      if (k === 'd') pathPoints(val);
    }
    if (tag(n) === 'g') { assert.ok(attrs(n)['data-region']); assert.ok(attrs(n)['data-bounds']); assert.ok(children(n).every(c => tag(c) === 'text')); }
  }
  assert.deepEqual(ids.sort(), [`${prefix}-desc`, `${prefix}-title`]);
  assert.equal(new Set(labels).size, labels.length); assert.ok(labels.length > 5);
  for (const type of ['title', 'desc', 'metadata']) { const found = nodes.filter(n => tag(n) === type); assert.equal(found.length, 1); assert.ok(xmlText(found[0]).trim()); }
  const metadata = JSON.parse(xmlText(nodes.find(n => tag(n) === 'metadata')));
  assert.deepEqual(Object.keys(metadata).sort(), ['asOf', 'kind', 'lang', 'mobile', 'status']);
  assert.deepEqual([metadata.asOf, metadata.kind, metadata.lang, metadata.mobile], ['2026-10-14', v.kind, v.lang, v.mobile]);
  assert.equal(typeof metadata.status, 'string'); assert.ok(metadata.status.length > 0 && metadata.status.length < 500);
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
const fonts = Object.fromEntries([400, 700].map(w => [w, fontFrom(`public/fonts/trade-cycle/dejavu-sans-${w}.ttf`)]));
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
  const { root, nodes, width, height } = inspect(v), canvas = { x: 0, y: 0, right: width, bottom: height };
  const visible = children(root).filter(n => ['rect', 'circle', 'line', 'path', 'g'].includes(tag(n)));
  const panels = visible.filter(n => tag(n) === 'rect' && value(n, 'rx') >= 9 && value(n, 'x') > 1 && value(n, 'width') >= 100 && value(n, 'height') >= 40).map(shapeBox);
  const labels = [];
  for (const n of nodes.filter(n => ['rect', 'circle', 'line', 'path'].includes(tag(n)))) {
    const b = shapeBox(n), stroke = attrs(n).stroke && attrs(n).stroke !== 'none' ? value(n, 'stroke-width', '1') / 2 : 0;
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
function checkSources(raw, lang) {
  assert.equal(typeof raw, 'string'); assert.ok(raw.length < 200000);
  const all = htmlNodes(parse(raw));
  const lists = all.filter(n => n.tagName === 'ol' && htmlAttr(n, 'class') === 'sources-list trade-cycle-sources'); assert.equal(lists.length, 1);
  assert.deepEqual(lists[0].attrs.map(a => [a.name, a.value]), [['class', 'sources-list trade-cycle-sources']]);
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
test('Trade cycle variant selection is frozen, complete and rejects prototypes or coercion', () => {
  assert.deepEqual(TRADE_CYCLE_KINDS, kinds); assert.ok(Object.isFrozen(TRADE_CYCLE_KINDS)); assert.equal(variants.length, 24);
  for (const lang of ['', 'FR', '__proto__', 'constructor', {}, null, ['fr']]) assert.throws(() => tradeCycleSvg(lang, 'momentum', false), TypeError);
  for (const kind of ['', '__proto__', 'constructor', 'prototype', {}, null, ['momentum']]) assert.throws(() => tradeCycleSvg('fr', kind, false), TypeError);
  for (const mobile of [0, 1, '', 'false', null, new Boolean(false), {}, []]) assert.throws(() => tradeCycleSvg('fr', 'momentum', mobile), TypeError);
  assert.equal(tradeCycleSvg('fr', 'momentum'), tradeCycleSvg('fr', 'momentum', false));
});
test('24 supplied SVGs preserve every byte and complete native fields', () => { for (const v of variants) faithful(v); });
test('all original shapes and font glyphs remain in viewBox, declared bounds and panels', () => {
  const issues = []; for (const v of variants) { try { geometry(v); } catch (error) { issues.push(error.message); } }
  assert.deepEqual(issues, []);
});
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
test('dedicated fonts retain every original glyph outline, metrics and canonical complete licence', () => {
  const licence = read('public/fonts/trade-cycle/LICENSE.txt'); assertFontLicenseReferences(licence, 'dejavu');
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
  const component = read('src/components/TradeCycleFigure.astro'), styles = component.match(/<style>([\s\S]*?)<\/style>/u); assert.ok(styles);
  const css = postcss.parse(styles[1]), declarations = n => Object.fromEntries(n.nodes.filter(d => d.type === 'decl').map(d => [d.prop, d.value]));
  const base = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.trade-cycle-figure'));
  assert.deepEqual([base.width, base['max-width'], base['container-type'], base['padding-bottom']], ['100%', '760px', 'inline-size', '.85rem']);
  assert.equal(base.overflow, 'visible');
  const graphic = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.trade-cycle-figure :global(svg)'));
  assert.deepEqual([graphic.width, graphic.height, graphic.overflow, graphic['letter-spacing']], ['100%', 'auto', 'visible', 'normal']);
  const labelFont = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.trade-cycle-figure :global(svg text)'));
  assert.equal(labelFont['font-family'], "'l0g Trade Cycle', 'DejaVu Sans', Arial, sans-serif");
  const mobile = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.trade-cycle-mobile'));
  assert.deepEqual([mobile.display, mobile.width, mobile['max-width'], mobile['margin-inline']], ['none', '100%', '400px', 'auto']);
  for (const kind of ['media', 'container']) {
    const rule = css.nodes.find(n => n.type === 'atrule' && n.name === kind && n.params === '(max-width: 640px)'); assert.ok(rule);
    assert.deepEqual(rule.nodes.map(n => [n.selector, declarations(n).display]), [['.trade-cycle-desktop', 'none'], ['.trade-cycle-mobile', 'block']]);
  }
  const faces = css.nodes.filter(n => n.type === 'atrule' && n.name === 'font-face').map(n => declarations(n));
  assert.deepEqual(faces.map(d => [d['font-family'], d.src, d['font-weight'], d['font-style']]), [400, 700].map(w => ["'l0g Trade Cycle'", `url('/fonts/trade-cycle/dejavu-sans-${w}.ttf') format('truetype')`, String(w), 'normal']));
  assert.doesNotMatch(styles[1], /#(?:[a-f0-9]{3}){1,2}\b|(?:clip-path|overflow\s*:\s*hidden|transform\s*:|100vw)/iu);
  const themes = { dark: new Map(), light: new Map() };
  postcss.parse(read('src/styles/global.css')).walkDecls(d => { if (d.parent.type === 'atrule' && d.parent.name === 'theme') themes.dark.set(d.prop, d.value); if (d.parent.type === 'rule' && d.parent.selector === ':root[data-theme="light"]') themes.light.set(d.prop, d.value); });
  for (const theme of Object.values(themes)) for (const token of ['ink', 'paper', 'surface', 'surface-2', 'muted', 'signal', 'amber', 'accent', 'topic-blue', 'line-strong']) assert.ok(theme.has(`--color-${token}`));
});
const mdxNodes = n => [n, ...(n.children ?? []).flatMap(mdxNodes)];
const mdxText = n => n.type === 'text' ? n.value : (n.children ?? []).map(mdxText).join('');
function articleFigures(raw, lang) {
  const tree = createProcessor().parse(raw);
  const figures = mdxNodes(tree).filter(n => n.name === 'TradeCycleFigure'); assert.equal(figures.length, 6);
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
  for (const [a, b] of [['kind="momentum"', 'kind="macro"'], ['number="01"', 'number="06"'], ['sources="3 12"', 'sources="3 99"'], ['lang="fr"', 'lang="en"']]) assert.throws(() => articleFigures(raw.replace(a, b), 'fr'));
  const caption = raw.match(/caption="[^"\n]+"/u); assert.ok(caption);
  assert.throws(() => articleFigures(raw.replace(caption[0], 'caption={process.env.SECRET}'), 'fr'));
});
test('trade observations and fictional balances retain denominators, precision and explicit status', () => {
  assert.ok(Object.isFrozen(TRADE_CYCLE_DATA));
  assert.deepEqual(TRADE_CYCLE_DATA, {
    asOf: '2026-10-14',
    wto: { period: '2026-H1', contributionAI: 47, contributionOther: 53, basketGrowth: 67, volumeForecast2026: 3.9, forecastDate: '2026-10-08' },
    taiwan: { period: '2026-09', status: 'preliminary', unit: 'USD million, current', total: 87222, products: [39128, 31131, 16963], destinations: [27461, 20622, 18881, 20258] },
    directCustomers: { unit: 'percent of total quarterly revenue', periods: ['2025-07-27', '2026-07-26'], threshold: 10, reported: [[23, 16], [16]], remainder: [61, 84], identities: null, ultimateShare: null },
    chain: { status: 'hypothetical', exports: [40, 70, 100], valueAdded: [40, 30, 30], finalInvestment: 100, grossExports: 210 },
    inventory: { status: 'hypothetical', opening: 40, baselineSales: 100, baselineClosing: 40, baselinePurchases: 100, revisedSales: 90, revisedClosing: 20, revisedPurchases: 70 },
  });
  assert.equal(39128 + 31131 + 16963, 87222);
  assert.equal(27461 + 20622 + 18881 + 20258, 87222);
  assert.equal(Number(((39128 + 31131) / 87222 * 100).toFixed(1)), 80.6);
  assert.deepEqual([27461, 20622, 18881].map(x => Number((x / 87222 * 100).toFixed(1))), [31.5, 23.6, 21.6]);
  assert.equal(40 + 70 + 100, 210); assert.equal(40 + 30 + 30, 100);
  assert.equal(100 - 23 - 16, 61); assert.equal(100 - 16, 84);
  assert.equal(40 + 100 - 100, 40); assert.equal(40 + 70 - 90, 20);
  assert.equal((100 - 90) / 100 * 100, 10); assert.equal((100 - 70) / 100 * 100, 30);
  assert.equal(90 + 40 - 40, 90);
});
test('fourteen source references retain complete primary and supplemental link fields', () => {
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
  assert.throws(() => checkSources(raw.replace('href="#source-12"', 'href="#source-99"'), 'fr'));
});
