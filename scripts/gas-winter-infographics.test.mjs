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
import { gasWinterSvg, GAS_WINTER_KINDS } from '../src/lib/gasWinterFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Derived independently from all 24 supplied exports/svg assets. The raw hash
// preserves every byte; the HTML-tree hash also covers all native fields and
// text after the browser's XML attribute/entity parsing. No implementation
// output was used to derive these expectations. One reviewed correction changes
// only a strategic-reserve card height from 144 to 160; original hashes remain.
const originals = {
  "stocks-fr-desktop": {
    "rawHash": "63b5c147981d21f7c02a982947e047dc93ce824e1d6d1932ff5da1e78325fba6",
    "domHash": "199959ea560b19a9ff9ede0f97fd7846c82f2b8ac1ed0509ee4fce45a986fb5c",
    "viewBox": "0 0 960 1055"
  },
  "stocks-fr-mobile": {
    "rawHash": "46cc5e9668ff6b586a7d4d68ccfe0aeaa55ffeb08374c6edc7fd536d868accc6",
    "domHash": "5d0eb80085d9ca064cb52af25c369ef5a89ce51d5643b65c7019758b5ca22273",
    "viewBox": "0 0 400 1364"
  },
  "chain-fr-desktop": {
    "rawHash": "eba8248288a39c4fc19694502715ed09ae8175613725a4b130fe0071347b5929",
    "domHash": "7a1be27f46bd606e186a7c434fb5ef0030bd13de90de6410ef3f558ff923d26c",
    "viewBox": "0 0 960 1096"
  },
  "chain-fr-mobile": {
    "rawHash": "8609dad92bc8578a3441f4c3a3ab4d09df2abb696488ffb471bb983e4a16a584",
    "domHash": "bcf6f790f06509c06ac281785d09313e45123733ee321e4642a5086290900303",
    "viewBox": "0 0 400 1439"
  },
  "scenarios-fr-desktop": {
    "rawHash": "87e89e0ad4724f8a2c81ccef4d7ae5349c7409d5bcd9dd9efcd9cc23371dc273",
    "domHash": "651d95597d66944d79f5fbdebb6ec80df88c5ede2711fef74126ee5988712e85",
    "viewBox": "0 0 960 1012"
  },
  "scenarios-fr-mobile": {
    "rawHash": "0d476cb8dadefc1349dd722dbecd723ea910328dc9839e0380f32e952a5e794b",
    "domHash": "29523740a249c7abd5848abb71834074da5266146a1bb44c982b7aacc5c840bd",
    "viewBox": "0 0 400 1520",
    "originalRawHash": "f3216ac12de1548efe7a8a5181b5a3b1682da8c1e9eb3a051b5b1d9c9cda259c",
    "originalDomHash": "6ae96c4e8bfc4c384918f655fa43ea9d09d107a2c13c93b98ba38dfdcf58743d"
  },
  "peak-fr-desktop": {
    "rawHash": "ed7ff6a8a200558c644049271eab6ce3b2c4d0e473bc4108f34125c3b6c515eb",
    "domHash": "e85787f1ee80da70629f6dc439a0c1ed62fd1e534e8f65e33f4b5a94101f2049",
    "viewBox": "0 0 960 845"
  },
  "peak-fr-mobile": {
    "rawHash": "0e2830b586c35f4a5f354af65d8e21e2b86f4c5dfe9f25dd01db161a7eb85691",
    "domHash": "6d8d44cc0a457451acd2799d02bfc52fd18533c6d1c7865631ca620ed5bfc0a1",
    "viewBox": "0 0 400 1334"
  },
  "refill-fr-desktop": {
    "rawHash": "0db02d228ae2737c65cb7e37ebb0b992bba14bab0517ba56e501e84dc9a044d5",
    "domHash": "56ef635917436af157a1ebb0ee10d859f2bb5117e4c99b4f83491b84f5af30e8",
    "viewBox": "0 0 960 998"
  },
  "refill-fr-mobile": {
    "rawHash": "e76002ab04fd73cb65d35b3898e20322d379626f620846148b097af728f35a61",
    "domHash": "1bc3a78ae97d1bb876ed73939f3c6793ad23ae8abacc2bb22b7e481928cdcc12",
    "viewBox": "0 0 400 1494"
  },
  "curve-fr-desktop": {
    "rawHash": "773520401c72812f7a9984659b4a6ee5dfa730bcfe3ff5e1a5f9c98ab26e0835",
    "domHash": "d12a30e8b2bc615c49f464e6e7cb8bdd60175de1733f5c387ffd0e7964e92745",
    "viewBox": "0 0 960 971"
  },
  "curve-fr-mobile": {
    "rawHash": "2d79c248c08a819f2818fd85dba718dfea4aabd6b27023133d2595baac88f5eb",
    "domHash": "20fe846d26e2ba321f7560fcb15c9acdf5c0de981a0e11f4b48e54c3bfa611d2",
    "viewBox": "0 0 400 1446"
  },
  "stocks-en-desktop": {
    "rawHash": "b0527ad36a985c296a2de7a474623c4f8de15e3d6672dbb02140d4617de2adef",
    "domHash": "0d8f82705aacb835b3f301fac9c0f07c3aea4ccc9e3cf9573ecb4d3d7b169276",
    "viewBox": "0 0 960 1034"
  },
  "stocks-en-mobile": {
    "rawHash": "035cadb0c6298a1b81d83247b7c6367c37461f2a350e44cd5820f2cd0a557b76",
    "domHash": "d8069279b71d45663d370fa30649763093ec223f82d5e16c5462a4c0fb562ca8",
    "viewBox": "0 0 400 1334"
  },
  "chain-en-desktop": {
    "rawHash": "e127e2da691f2a07bb0c7e3e16c945e1e83382c2e74766e8a6e4035eb677e9e7",
    "domHash": "10ea19820f91c4f631939d4dbdbf964e76a59930452127ad2f70c5cbd531606a",
    "viewBox": "0 0 960 1096"
  },
  "chain-en-mobile": {
    "rawHash": "b14894de64a9831e2a6a57d7170fb40f3d12aa9463c81978754639c0018f3b86",
    "domHash": "d2a9043bd25c6ed0d9a95f5e015438c36fbd85fb03a897606e9d0a684aa0e876",
    "viewBox": "0 0 400 1475"
  },
  "scenarios-en-desktop": {
    "rawHash": "192e32476f54a3716d32e000479481f28cf368ad2630204f5077be0375c749e3",
    "domHash": "f008b261c2b382c8e4a759456dfeb1aa17cd0e6c9007b517c6b5a08d05662600",
    "viewBox": "0 0 960 1012"
  },
  "scenarios-en-mobile": {
    "rawHash": "af05810b8da982bce03f2ac8b319ff8772cf30107b2bea61e53590a46cde339d",
    "domHash": "fab206fa2936bde640fc832a204478f53d755702ab7f06834d50220fec5b4a96",
    "viewBox": "0 0 400 1511"
  },
  "peak-en-desktop": {
    "rawHash": "466d1ad83fc3f350991c37d548cd1247283ff879ab97b86ce37338a8f3765a08",
    "domHash": "5ea059daf5d658b3f0c81bec8b7a03d120e5026a84b5781b75e1f08a07f3dba8",
    "viewBox": "0 0 960 845"
  },
  "peak-en-mobile": {
    "rawHash": "3af27c8b43e05fb484700c6fcb3ac64bbc9c3ad5e06bf0484fa187eeb22e1218",
    "domHash": "becbd93c47b1275bf516942a20b84546cc9e245187134dc1ef8a0a40fa3055fb",
    "viewBox": "0 0 400 1340"
  },
  "refill-en-desktop": {
    "rawHash": "1f292aa7b76a4e9bd97dd24a982cdbb2d2d341090c48d7c00271c587ad126c32",
    "domHash": "d03edfce11c0288d3143484b7ad829d0f7f8101ea1135e5cb9abed09629d7d6e",
    "viewBox": "0 0 960 998"
  },
  "refill-en-mobile": {
    "rawHash": "1c402a6dcefa5791b6db4a1a6decef680c59660c59fbccdc79b0b7ff4805993a",
    "domHash": "525731dbd640ad87a409a427b09073904a5f078f7a6e8b51e4be5fc32d497d31",
    "viewBox": "0 0 400 1542"
  },
  "curve-en-desktop": {
    "rawHash": "7cf311cd92a36cd5b82bd602896ec024a2811c68ea67db6968986b0999ffb236",
    "domHash": "154e5c29b62854128d9b5acfa0d2b88070e66a892fd1586770e3b459a8c9d8e0",
    "viewBox": "0 0 960 971"
  },
  "curve-en-mobile": {
    "rawHash": "eab35209ef84a03c9b0e9838e121e342a0fce6e634c9ca7adb16fc80bd73bffc",
    "domHash": "82e7c564a82a357946939ff9cece0302eea66089959d98cc45cd1525b1cb1c95",
    "viewBox": "0 0 400 1475"
  }
};
// Exact canonical source fields independently reviewed, then frozen from the
// controlled bilingual copy. Provider report prices retain their dated scope.
const sourceLinks = {
  "fr": [
    [
      [
        "https://www.edison.it/en/edison-qatarenergy-extends-force-majeure-until-beginning-december-2026",
        "Edison · Edison: QatarEnergy extends force majeure until the beginning of December 2026"
      ]
    ],
    [
      [
        "https://www.entsog.eu/sites/default/files/2026-10/SO0072-26_Winter%20Supply%20Outlook%202026-27.pdf",
        "ENTSOG · Winter Supply Outlook 2026/27 including Summer 2027 Overview, SO0072-26"
      ]
    ],
    [
      [
        "https://www.gie.eu/press/europe-enters-winter-with-historically-low-storage-levels-reinforcing-the-need-for-lng-imports-and-storage-flexibility/",
        "Gas Infrastructure Europe · Europe enters winter with historically low storage levels, reinforcing the need for LNG imports and storage flexibility"
      ]
    ],
    [
      [
        "https://energy.ec.europa.eu/news/eu-gas-system-prepared-winter-despite-lower-storage-levels-2026-10-08_en",
        "Commission européenne / European Commission · EU gas system prepared for the winter despite lower storage levels"
      ]
    ],
    [
      [
        "https://www.eia.gov/naturalgas/storage/basics/",
        "US Energy Information Administration · The Basics of Underground Natural Gas Storage"
      ]
    ],
    [
      [
        "https://www.acer.europa.eu/news/eu-lng-imports-hit-record-high-2025-acer-warns-growing-exposure-global-market-risks",
        "ACER · EU LNG imports hit record high in 2025 – ACER warns of growing exposure to global market risks"
      ],
      [
        "https://www.acer.europa.eu/sites/default/files/documents/Publications/ACER-LNG-Monitoring-Report-2026.pdf",
        "Rapport intégral ACER"
      ]
    ],
    [
      [
        "https://www.iea.org/news/global-demand-for-natural-gas-expected-to-contract-this-year-as-tighter-supply-pushes-up-prices",
        "Agence internationale de l’énergie / International Energy Agency · Global demand for natural gas expected to contract this year as tighter supply pushes up prices"
      ]
    ],
    [
      [
        "https://www.banque-france.fr/fr/publications-et-statistiques/publications/enquete-mensuelle-de-conjoncture-debut-octobre-2026",
        "Banque de France · Enquête mensuelle de conjoncture – Début octobre 2026"
      ]
    ],
    [
      [
        "https://www.ecb.europa.eu/press/key/date/2026/html/ecb.sp260506~1bbd4ed780.en.html",
        "Banque centrale européenne / European Central Bank · The new energy shock: economic scenarios and policy implications"
      ]
    ],
    [
      [
        "https://www.consilium.europa.eu/en/press/press-releases/2025/07/18/gas-storage-council-greenlights-2-year-extension-of-reserves-filling-rules-to-safeguard-winter-supply/",
        "Conseil de l’Union européenne / Council of the EU · Gas storage: Council greenlights 2-year extension of reserves filling rules to safeguard winter supply"
      ],
      [
        "https://eur-lex.europa.eu/legal-content/en/TXT/?uri=CELEX%3A32025R1733",
        "Regulation (EU) 2025/1733 of 18 July 2025"
      ]
    ],
    [
      [
        "https://www.entsog.eu/outlooks-reviews",
        "ENTSOG · Outlooks & Reviews"
      ],
      [
        "https://www.entsog.eu/sites/default/files/2026-10/Annex%20A%20-%20UGS%20WGV%2C%20Injection%20and%20Withdrawal%20Curves%20%28rev2%29.xlsx",
        "Annexe A rev2"
      ],
      [
        "https://www.entsog.eu/sites/default/files/2026-10/Annex%20B%20-%20Demand%2CNational%20Production%2CSupply%20and%20Export%20%28rev2%29.xlsx",
        "Annexe B rev2"
      ],
      [
        "https://www.entsog.eu/sites/default/files/2026-10/Annex%20D%20-%20Curtailment%20rate%20results.xlsx",
        "Annexe D"
      ]
    ],
    [
      [
        "https://www.iea.org/reports/gas-reserve-mechanisms-and-flexibility-options/executive-summary",
        "IEA · Gas Reserve Mechanisms and Flexibility Options"
      ]
    ]
  ],
  "en": [
    [
      [
        "https://www.edison.it/en/edison-qatarenergy-extends-force-majeure-until-beginning-december-2026",
        "Edison · Edison: QatarEnergy extends force majeure until the beginning of December 2026"
      ]
    ],
    [
      [
        "https://www.entsog.eu/sites/default/files/2026-10/SO0072-26_Winter%20Supply%20Outlook%202026-27.pdf",
        "ENTSOG · Winter Supply Outlook 2026/27 including Summer 2027 Overview, SO0072-26"
      ]
    ],
    [
      [
        "https://www.gie.eu/press/europe-enters-winter-with-historically-low-storage-levels-reinforcing-the-need-for-lng-imports-and-storage-flexibility/",
        "Gas Infrastructure Europe · Europe enters winter with historically low storage levels, reinforcing the need for LNG imports and storage flexibility"
      ]
    ],
    [
      [
        "https://energy.ec.europa.eu/news/eu-gas-system-prepared-winter-despite-lower-storage-levels-2026-10-08_en",
        "Commission européenne / European Commission · EU gas system prepared for the winter despite lower storage levels"
      ]
    ],
    [
      [
        "https://www.eia.gov/naturalgas/storage/basics/",
        "US Energy Information Administration · The Basics of Underground Natural Gas Storage"
      ]
    ],
    [
      [
        "https://www.acer.europa.eu/news/eu-lng-imports-hit-record-high-2025-acer-warns-growing-exposure-global-market-risks",
        "ACER · EU LNG imports hit record high in 2025 – ACER warns of growing exposure to global market risks"
      ],
      [
        "https://www.acer.europa.eu/sites/default/files/documents/Publications/ACER-LNG-Monitoring-Report-2026.pdf",
        "Full ACER report"
      ]
    ],
    [
      [
        "https://www.iea.org/news/global-demand-for-natural-gas-expected-to-contract-this-year-as-tighter-supply-pushes-up-prices",
        "Agence internationale de l’énergie / International Energy Agency · Global demand for natural gas expected to contract this year as tighter supply pushes up prices"
      ]
    ],
    [
      [
        "https://www.banque-france.fr/fr/publications-et-statistiques/publications/enquete-mensuelle-de-conjoncture-debut-octobre-2026",
        "Banque de France · Enquête mensuelle de conjoncture – Début octobre 2026"
      ]
    ],
    [
      [
        "https://www.ecb.europa.eu/press/key/date/2026/html/ecb.sp260506~1bbd4ed780.en.html",
        "Banque centrale européenne / European Central Bank · The new energy shock: economic scenarios and policy implications"
      ]
    ],
    [
      [
        "https://www.consilium.europa.eu/en/press/press-releases/2025/07/18/gas-storage-council-greenlights-2-year-extension-of-reserves-filling-rules-to-safeguard-winter-supply/",
        "Conseil de l’Union européenne / Council of the EU · Gas storage: Council greenlights 2-year extension of reserves filling rules to safeguard winter supply"
      ],
      [
        "https://eur-lex.europa.eu/legal-content/en/TXT/?uri=CELEX%3A32025R1733",
        "Regulation (EU) 2025/1733 of 18 July 2025"
      ]
    ],
    [
      [
        "https://www.entsog.eu/outlooks-reviews",
        "ENTSOG · Outlooks & Reviews"
      ],
      [
        "https://www.entsog.eu/sites/default/files/2026-10/Annex%20A%20-%20UGS%20WGV%2C%20Injection%20and%20Withdrawal%20Curves%20%28rev2%29.xlsx",
        "Annex A rev2"
      ],
      [
        "https://www.entsog.eu/sites/default/files/2026-10/Annex%20B%20-%20Demand%2CNational%20Production%2CSupply%20and%20Export%20%28rev2%29.xlsx",
        "Annex B rev2"
      ],
      [
        "https://www.entsog.eu/sites/default/files/2026-10/Annex%20D%20-%20Curtailment%20rate%20results.xlsx",
        "Annex D"
      ]
    ],
    [
      [
        "https://www.iea.org/reports/gas-reserve-mechanisms-and-flexibility-options/executive-summary",
        "IEA · Gas Reserve Mechanisms and Flexibility Options"
      ]
    ]
  ]
};
const kinds = ['stocks', 'chain', 'scenarios', 'peak', 'refill', 'curve'];
const figureSources = { stocks: [2, 5], chain: [1, 2, 6], scenarios: [2], peak: [2, 5], refill: [2], curve: [2, 3] };
const variants = ['fr', 'en'].flatMap(lang => kinds.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, key: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: gasWinterSvg(lang, kind, mobile) }))));
const articles = ['fr', 'en'].map(lang => ({ lang, raw: read(`src/content/${lang === 'fr' ? 'posts/gaz-europeen-tenir-entre-deux-cargaisons' : 'posts-en/european-gas-bridging-gap-between-cargoes'}.mdx`) }));
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
  svg: 'xmlns viewBox role aria-labelledby style data-gas-winter-kind',
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
  const prefix = `gas-${v.kind}-${v.lang}-${v.mobile ? 'm' : 'd'}`;
  assert.deepEqual(attrs(root), { xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[v.key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto', 'data-gas-winter-kind': v.kind });
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
      if (k === 'text-anchor') assert.ok(['start', 'middle', 'end'].includes(val));
      if (k === 'stroke-dasharray') assert.ok(['5 4', '5 6'].includes(val));
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
const originalPanel = '<rect x="24" y="1226.36" width="352" height="144" rx="10"';
const correctedPanel = '<rect x="24" y="1226.36" width="352" height="160" rx="10"';
function faithful(v) {
  inspect(v);
  if (v.key === 'scenarios-fr-mobile') {
    assert.equal(v.svg.split(correctedPanel).length, 2, 'One anchored card correction');
    assert.ok(!v.svg.includes(originalPanel));
    const restored = v.svg.replace(correctedPanel, originalPanel);
    assert.equal(digest(restored), originals[v.key].originalRawHash, 'Every other original byte unchanged');
    assert.equal(domHash(restored), originals[v.key].originalDomHash, 'Every other original native field unchanged');
  } assert.equal(digest(v.svg), originals[v.key].rawHash, `${v.key}: complete reviewed SVG`);
  assert.equal(domHash(v.svg), originals[v.key].domHash, `${v.key}: complete browser SVG tree`);
}
const mutate = (v, change) => { const root = parser.parse(v.svg)[0]; change(root, xmlNodes(root)); return { ...v, svg: builder.build([root]) }; };
const fontFrom = file => {
  const bytes = readFileSync(new URL(`../${file}`, import.meta.url));
  return opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
};
const fonts = Object.fromEntries([400, 700].map(w => [w, fontFrom(`public/fonts/gas-winter/dejavu-sans-${w}.ttf`)]));
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
function checkSources(raw, lang) {
  assert.equal(typeof raw, 'string'); assert.ok(raw.length < 200000);
  const all = htmlNodes(parse(raw));
  const lists = all.filter(n => n.tagName === 'ol' && htmlAttr(n, 'class') === 'sources-list gas-winter-sources'); assert.equal(lists.length, 1);
  assert.deepEqual(lists[0].attrs.map(a => [a.name, a.value]), [['class', 'sources-list gas-winter-sources']]);
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
test('Gas winter variant selection is frozen, complete and rejects prototypes or coercion', () => {
  assert.deepEqual(GAS_WINTER_KINDS, kinds); assert.ok(Object.isFrozen(GAS_WINTER_KINDS)); assert.equal(variants.length, 24);
  for (const lang of ['', 'FR', '__proto__', 'constructor', {}, null, ['fr']]) assert.throws(() => gasWinterSvg(lang, 'stocks', false), TypeError);
  for (const kind of ['', '__proto__', 'constructor', 'prototype', {}, null, ['stocks']]) assert.throws(() => gasWinterSvg('fr', kind, false), TypeError);
  for (const mobile of [0, 1, '', 'false', null, new Boolean(false), {}, []]) assert.throws(() => gasWinterSvg('fr', 'stocks', mobile), TypeError);
  assert.equal(gasWinterSvg('fr', 'stocks'), gasWinterSvg('fr', 'stocks', false));
});
test('24 supplied SVGs preserve complete native fields with one exact bounded card repair', () => { for (const v of variants) faithful(v); });
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
  const licence = read('public/fonts/gas-winter/LICENSE.txt'); assertFontLicenseReferences(licence, 'dejavu');
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
  const component = read('src/components/GasWinterFigure.astro'), styles = component.match(/<style>([\s\S]*?)<\/style>/u); assert.ok(styles);
  const css = postcss.parse(styles[1]), declarations = n => Object.fromEntries(n.nodes.filter(d => d.type === 'decl').map(d => [d.prop, d.value]));
  const base = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.gas-winter-figure'));
  assert.deepEqual([base.width, base['max-width'], base['container-type'], base['padding-bottom']], ['100%', '760px', 'inline-size', '.85rem']);
  assert.equal(base.overflow, 'visible');
  const graphic = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.gas-winter-figure :global(svg)'));
  assert.deepEqual([graphic.width, graphic.height, graphic.overflow, graphic['letter-spacing']], ['100%', 'auto', 'visible', 'normal']);
  const labelFont = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.gas-winter-figure :global(svg text)'));
  assert.equal(labelFont['font-family'], "'l0g Gas Winter', 'DejaVu Sans', Arial, sans-serif");
  const mobile = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.gas-winter-mobile'));
  assert.deepEqual([mobile.display, mobile.width, mobile['max-width'], mobile['margin-inline']], ['none', '100%', '400px', 'auto']);
  for (const kind of ['media', 'container']) {
    const rule = css.nodes.find(n => n.type === 'atrule' && n.name === kind && n.params === '(max-width: 640px)'); assert.ok(rule);
    assert.deepEqual(rule.nodes.map(n => [n.selector, declarations(n).display]), [['.gas-winter-desktop', 'none'], ['.gas-winter-mobile', 'block']]);
  }
  const faces = css.nodes.filter(n => n.type === 'atrule' && n.name === 'font-face').map(n => declarations(n));
  assert.deepEqual(faces.map(d => [d['font-family'], d.src, d['font-weight'], d['font-style']]), [400, 700].map(w => ["'l0g Gas Winter'", `url('/fonts/gas-winter/dejavu-sans-${w}.ttf') format('truetype')`, String(w), 'normal']));
  assert.doesNotMatch(styles[1], /#(?:[a-f0-9]{3}){1,2}\b|(?:clip-path|overflow\s*:\s*hidden|transform\s*:|100vw)/iu);
  const themes = { dark: new Map(), light: new Map() };
  postcss.parse(read('src/styles/global.css')).walkDecls(d => { if (d.parent.type === 'atrule' && d.parent.name === 'theme') themes.dark.set(d.prop, d.value); if (d.parent.type === 'rule' && d.parent.selector === ':root[data-theme="light"]') themes.light.set(d.prop, d.value); });
  for (const theme of Object.values(themes)) for (const token of ['ink', 'paper', 'surface', 'surface-2', 'muted', 'signal', 'amber', 'accent', 'topic-blue', 'line-strong']) assert.ok(theme.has(`--color-${token}`));
});
const mdxNodes = n => [n, ...(n.children ?? []).flatMap(mdxNodes)];
const mdxText = n => n.type === 'text' ? n.value : (n.children ?? []).map(mdxText).join('');
function articleFigures(raw, lang) {
  const tree = createProcessor().parse(raw);
  const figures = mdxNodes(tree).filter(n => n.name === 'GasWinterFigure'); assert.equal(figures.length, 6);
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
  for (const [a, b] of [['kind="stocks"', 'kind="curve"'], ['number="01"', 'number="06"'], ['sources="2 5"', 'sources="2 99"'], ['lang="fr"', 'lang="en"']]) assert.throws(() => articleFigures(raw.replace(a, b), 'fr'));
  const caption = raw.match(/caption=\{("[^"\n]+")\}/u); assert.ok(caption);
  assert.throws(() => articleFigures(raw.replace(caption[0], 'caption={process.env.SECRET}'), 'fr'));
});
test('price arithmetic uses correctly ordered seasonal deliveries and preserves gross scope', () => {
  // Integer milli-euros retain the precision of the institutional source.
  assert.equal(72350 - 53405, 18945);
  assert.equal(49030 - 53405, -4375);
  assert.equal(53405 - 49030, 4375);
  for (const { lang, raw } of articles) {
    const terms = lang === 'fr' ? ['30 septembre 2026', '72,350', '53,405', '49,030', '−4,375', '18,945', 'non consultée directement']
      : ['30 September 2026', '72.350', '53.405', '49.030', '−€4.375', '18.945', 'not accessed directly'];
    for (const term of terms) assert.ok(raw.includes(term), `${lang}: dated, attributed seasonal observation ${term}`);
  }
});
test('twelve source references retain all seventeen exact primary and supplemental links', () => {
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
test('the single strategic-reserve card repair provides padding and rejects alternative attributes', () => {
  const v = variants.find(v => v.key === 'scenarios-fr-mobile'); faithful(v); geometry(v);
  const ns = inspect(v).nodes, label = ns.find(n => tag(n) === 'text' && xmlText(n) === 'nationales.'); assert.ok(label);
  const card = ns.find(n => tag(n) === 'rect' && attrs(n).x === '24' && attrs(n).y === '1226.36' && attrs(n).width === '352'); assert.ok(card);
  const box = shapeBox(card), ink = textBox(label);
  assert.equal(value(card, 'height'), 160); assert.ok(box.bottom - ink.bottom >= 11);
  const divider = ns.find(n => tag(n) === 'line' && attrs(n).y1 === '1401.08'); assert.ok(divider);
  assert.ok(value(divider, 'y1') - value(divider, 'stroke-width') / 2 - box.bottom >= 13);
  for (const height of [144, 156, 161]) assert.throws(() => faithful({ ...v, svg: v.svg.replace(correctedPanel, correctedPanel.replace('height="160"', `height="${height}"`)) }));
  assert.throws(() => faithful({ ...v, svg: v.svg.replace(correctedPanel, correctedPanel.replace('width="352"', 'width="353"')) }));
});
