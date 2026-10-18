import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import { parse } from 'parse5';
import { createProcessor } from '@mdx-js/mdx';
import postcss from 'postcss';
import { bncSvg, BNC_KINDS } from '../src/lib/bncFigures.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Independent complete supplied XML, browser DOM and attribute-tree goldens.
const originals={
  "channels-fr-desktop": {
    "rawHash": "e6dc24828477899964475ebd1917b20d71db0446469647702581066521035b45",
    "domHash": "4d02262f2d47063ceaf8701717a7b20d083ddbf9dc3faaa2ef05d05dc343bcb8",
    "geometryHash": "fdfb99cf38859e2755602fd96b733a379e47a59d4ec8602e2a39663e70278622",
    "viewBox": "0 0 1200 810"
  },
  "channels-fr-mobile": {
    "rawHash": "565c880cb8c076f1cf5d0d2a1cff82ba7fbd8d28e46ab3b229a0622ba98039ae",
    "domHash": "f332561ccf8b923b77300f8b72ddf1e2559087a1842d9b8c2000795677a473d5",
    "geometryHash": "d33de0ca96f03eb8b5f83c24b436b64f42f1f256a9b5b0dcc1c0f80266ea0673",
    "viewBox": "0 0 420 1190"
  },
  "filings-fr-desktop": {
    "rawHash": "9707fef055824baac5e51fa21f0284755bb3381cc2c22ccd7a93d18ff7221a36",
    "domHash": "7260b9fa7298e7ee8a74133348d07edda241d671390aad7f800b70f32f1be2ca",
    "geometryHash": "d6f8cbb829fda0d5387cc79ba266b7cb0e216c660be5f6706535239f8f8ff64e",
    "viewBox": "0 0 1200 755"
  },
  "filings-fr-mobile": {
    "rawHash": "320cbc397d91f1bed30555f78507d944d753e0e871aa3bb189e0b351ac56dd8b",
    "domHash": "57ef9dfab7341d737ef61780efc2c18d8d4eef4d0c95f8ca1ca879a85269eabc",
    "geometryHash": "6d736dae03c91cd5e94c8cfc902aaf1daf27fc5fa9fe98f16345ec7cdc73875a",
    "viewBox": "0 0 420 1160"
  },
  "deadlines-fr-desktop": {
    "rawHash": "6774172823a1f5ef67062ab86e9ab2a25fc87351778913259cc866f1470c1a75",
    "domHash": "77aa7ffce0ac4862fc0e1d6e43180fac541762fe4e627c705acbe18f855166ba",
    "geometryHash": "1da43447d7e2b9dc511dd33ca75835425e6657f6e31ff51dc09695a3309ae37d",
    "viewBox": "0 0 1200 960"
  },
  "deadlines-fr-mobile": {
    "rawHash": "0b696ccf618a737ecc0a40c6499531ebcced48d08bca516febf083fa2aa7a607",
    "domHash": "a78397fdd61ed9dbe61a799f64823f1c8592081ef98002a156e4fe6b43bdbc7f",
    "geometryHash": "7bd1a62427772dd1d09c11190c43cc09fdaaf9c8b4189ecff64eb4b7afbfa31f",
    "viewBox": "0 0 420 1435"
  },
  "fallback-fr-desktop": {
    "rawHash": "943b8b296f7f0f3175cb4a4407683689c2668f40a71b83e876f8a437f59e6667",
    "domHash": "de2ba2416e591201de002decd408653d59f5a90d11dfad180725d9f40c6dece5",
    "geometryHash": "2a9fba09f348261eb180ad8bff2c1eb73cd21a8802f3ead1fc41d486b4d12012",
    "viewBox": "0 0 1200 940"
  },
  "fallback-fr-mobile": {
    "rawHash": "4a9f9b5d76ed02d9b299aeb6300e346b49e1e08ccc2d1f57d8bf3c6bba31a895",
    "domHash": "cf82942f961138d9c261411fab5aee8023b4cc6de2abe91dadfd532a70e7852f",
    "geometryHash": "f08972662872f509fe502187b97d3e16347137fe518636dd16e7d4b52d977bd1",
    "viewBox": "0 0 420 1425"
  },
  "backlog-fr-desktop": {
    "rawHash": "d264b96a43559f517953a290ba134fc0e1d4b8d3da5f043d5e6fd286f8cea1fd",
    "domHash": "e3a7a8e1d4ccc3849569648f392fb9e986d86e7de3b811f17c1897a4897e39fe",
    "geometryHash": "5c60fe8f1243937b9bbe275eb9416816c5e4bc789416c92bfbd9711d3b569f5f",
    "viewBox": "0 0 1200 875"
  },
  "backlog-fr-mobile": {
    "rawHash": "c90a3bac82e9062c22d64378c2f8d77e8d31d60bd529ae0133679602b739390c",
    "domHash": "8843df70972da55151874687cdcb7986752f82d2cc9e4f59f3ed29d2caab7aef",
    "geometryHash": "149cdf4179e440b4b088d8ec236154b5ea6b9dd00d1cae78ca0cff6795b13dcc",
    "viewBox": "0 0 420 1190"
  },
  "reconciliation-fr-desktop": {
    "rawHash": "d6755b12dc9b1f49c816e34baeb2d1d41454e9520383f13b5ea1c45faacdeed6",
    "domHash": "6715c6c708bf917f057201b191c4b1c7f6d94a97dadba38e470f35450305539f",
    "geometryHash": "bfb6e242226d486a6b1d837a075e206435cb7bfd68bab2f7ee47b5610a5987ff",
    "viewBox": "0 0 1200 965"
  },
  "reconciliation-fr-mobile": {
    "rawHash": "a38fb92bfea028be1a51f65a17f3b86e3e3ff274385969f553f191a31dfee8c4",
    "domHash": "6575027a45851542dc8855df5ce7973511c100883154257b4fb08c6561783c0c",
    "geometryHash": "442859ffac21cf6182eef4c592cd4d45e424e11710d8727d02cef62e4570eea9",
    "viewBox": "0 0 420 1420"
  },
  "channels-en-desktop": {
    "rawHash": "1fde7b43958d036ed1693c74c3ba0975abacf51b4ef7f43ee7f149341ac894ab",
    "domHash": "1c590fa007469aaa106c9dcaa78a3124144205786da7d83a288f0a9f71714b36",
    "geometryHash": "b755d750a4b4911d7ce1c77fed00a33714c466f6fc9f5b0941a3ebfd3c41d7c3",
    "viewBox": "0 0 1200 810"
  },
  "channels-en-mobile": {
    "rawHash": "e8ce229cbf7e0f945518095a9df2c4db71a884618f88aff839af77b3ce4c5e61",
    "domHash": "fce1b3ef71270a7c323cfc81d0ded016cb8164c1813254f1e56d21aa3a0dd6e1",
    "geometryHash": "e1dde1d39b943ef3c70895e028397e3231dbdd7884bf003bde35b69b600ba6f8",
    "viewBox": "0 0 420 1190"
  },
  "filings-en-desktop": {
    "rawHash": "98b724753861b779db06a5921b7bf49595174de3a9207910e01dce63093ef245",
    "domHash": "d15b5e9c5b03f0999be13df500310850fec43b08dddb14ff58e6a196f5f7482e",
    "geometryHash": "28f765e292589a310770e1cb1dc02af290c0dacdaa6e427c1005d9b8609bb829",
    "viewBox": "0 0 1200 755"
  },
  "filings-en-mobile": {
    "rawHash": "23741505e14059401e91b5f8a106eff9693bed8f2224f27eb60c99bd8763ae48",
    "domHash": "acc51381152464d3132d3620bc973314017f98f41d3dbfc75c086e54f567e132",
    "geometryHash": "78b51000e6f2bb9551bc30a072067db87d54bdbfaeb1910b465ada776fb16162",
    "viewBox": "0 0 420 1160"
  },
  "deadlines-en-desktop": {
    "rawHash": "d275866c95f5c945a879472edaac70570b53fa6bbc8404dd2f9f5bc6bf99b40a",
    "domHash": "03759414d7929d213d3f1d25e698142f22f8a444450751276b3b6754223bc5f8",
    "geometryHash": "954e10cb860f8f930a8587d18e41ebdf0fa64b2130d51c10aaf284a19e82b9f0",
    "viewBox": "0 0 1200 960"
  },
  "deadlines-en-mobile": {
    "rawHash": "efdbc6d8b95912baa9ed710f511cb038db9a68b7393c1de988477813614d66cd",
    "domHash": "70035c48de1d0e2acd8651fb902a483f0e97790dbe58143f1b7a19f7005ff7ac",
    "geometryHash": "458dc4e62241aacb71e1a9e11a951f8b0edd987392b6d754700cb1ef4b73c30f",
    "viewBox": "0 0 420 1435"
  },
  "fallback-en-desktop": {
    "rawHash": "e2733d9d1c6ee2558206df8e08fcd8856d044ed6c1a0fd9ba4311b78ce775604",
    "domHash": "3c16a9ee21a86d4c60074b4e218461321bc851e2f298530d24e58d8466388911",
    "geometryHash": "e757fcc7dea08087d2b6b390f0dac68083976b888519210824c2588817ca5ef8",
    "viewBox": "0 0 1200 940"
  },
  "fallback-en-mobile": {
    "rawHash": "9d067184f1354e84f6e8ff12791f81bf3d568f3aea07cb85f37f7b626d10159e",
    "domHash": "6474d8ebb5405fe756a7c543bfd2416633c63ca9491164c2e010ab0702e55194",
    "geometryHash": "b8cb60fb3a1b7dd4c5e59227f4a0e7d59d6465c140046c8b007f298e38fb7a56",
    "viewBox": "0 0 420 1425"
  },
  "backlog-en-desktop": {
    "rawHash": "4b6af2182e0daaa2d5302e0340cb0053fa3faa204ec8d60ec7d9ffae5dc1b218",
    "domHash": "ceba4e7534b98f85bfb8e5e4f2d57045f89f3ccee05e5492738a0f46e1f63a54",
    "geometryHash": "3fe95cb43e64009ead002f0c22e6269e22b30b1ed9bbab551f41eb60f4041316",
    "viewBox": "0 0 1200 875"
  },
  "backlog-en-mobile": {
    "rawHash": "911d9ce901394348937cef51373060b9d9c6f2aee5a567326de149e2c5312419",
    "domHash": "0872271c187a33932a5567e8b1be5cbb846006976a1304ec14e901bf07e78de4",
    "geometryHash": "82f6ca5347d7660a23d7fa84cdbf337fec614c04a15c5648a5594ec24a74ad5a",
    "viewBox": "0 0 420 1190"
  },
  "reconciliation-en-desktop": {
    "rawHash": "c70dc07239f02bbaebe8849d264a5c0099927976f3330e3caa3e3a148a025a5a",
    "domHash": "14b7b548c8c50000284d570343d53c213a0488f75106b24f839922396235be29",
    "geometryHash": "509beee7b36979ebb133f261a0950a4270452cd11ee2b3e5d8f4a5b8ef3033f5",
    "viewBox": "0 0 1200 965"
  },
  "reconciliation-en-mobile": {
    "rawHash": "d4639ebd08d13ad215b4d5ff243606afd1b5a40e996ab5ab27629d1563fe30f8",
    "domHash": "5c7a9c4776ecd1463c2d6523f6036ac96111949e31f4a68cbf460c171c210feb",
    "geometryHash": "04fe9808230ee0ef749f9821d91e4f3143bf3a3ac52c5c3c0047cab4805727e4",
    "viewBox": "0 0 420 1420"
  }
};
const textCorrections={
  "filings-fr-desktop": {
    "pairs": [
      [
        "<text x=\"953\" y=\"395.1\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"18\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >581 570 sur 608</text>",
        "<text x=\"953\" y=\"395.1\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"18\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >581 570 sur</text>",
        1
      ],
      [
        "<text x=\"953\" y=\"419.4\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"18\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >511 dossiers</text>",
        "<text x=\"953\" y=\"419.4\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"18\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >608 511 dossiers</text>",
        1
      ]
    ],
    "expectedHash": "3041b57a672f59d34012763c6f3f96a53cf1f2dcd00abc1fe3f8fafdd2b29c29",
    "expectedDomHash": "4c3bf17c2fd8ebc6775deb34a3d812b96ffcd3e589b6edca1af00949919adc2e"
  },
  "deadlines-en-desktop": {
    "pairs": [
      [
        "<title id=\"bnc-f3-en-d-title\">Different clocks start from different events</title>",
        "<title id=\"bnc-f3-en-d-title\">Deadlines start from different events</title>",
        1
      ],
      [
        "<text x=\"56\" y=\"91.0\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"37\" font-weight=\"700\" text-anchor=\"start\" fill=\"#f1f5f2\" >Different clocks start from different events</text>",
        "<text x=\"56\" y=\"91.0\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"37\" font-weight=\"700\" text-anchor=\"start\" fill=\"#f1f5f2\" >Deadlines start from different events</text>",
        1
      ],
      [
        "<text x=\"56\" y=\"888.0\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"15\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >* Separate legal regimes, not a single timeline. Rule-specific extensions; no universal pause of the clocks.</text>",
        "<text x=\"56\" y=\"888.0\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"15\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >* Separate legal regimes, not a single timeline. Rule-specific extensions; no universal pause of deadlines.</text>",
        1
      ]
    ],
    "expectedHash": "7f702385fc5cc64437151e46abdfef0300e2f2e53c7296cb4183e4ebc89faa2a",
    "expectedDomHash": "a0b867dfdf04ee1951ed25fc70cdd732e66a979fb4732e12b1e052437f61cc70"
  },
  "deadlines-en-mobile": {
    "pairs": [
      [
        "<title id=\"bnc-f3-en-m-title\">Different clocks start from different events</title>",
        "<title id=\"bnc-f3-en-m-title\">Deadlines start from different events</title>",
        1
      ],
      [
        "<text x=\"28\" y=\"76.0\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"25\" font-weight=\"700\" text-anchor=\"start\" fill=\"#f1f5f2\" >Different clocks start from</text>",
        "<text x=\"28\" y=\"76.0\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"25\" font-weight=\"700\" text-anchor=\"start\" fill=\"#f1f5f2\" >Deadlines start from</text>",
        1
      ],
      [
        "<text x=\"28\" y=\"1344.55\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"13\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >Rule-specific extensions; no universal pause of the</text>",
        "<text x=\"28\" y=\"1344.55\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"13\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >Rule-specific extensions; no universal pause of</text>",
        1
      ],
      [
        "<text x=\"28\" y=\"1362.1\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"13\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >clocks.</text>",
        "<text x=\"28\" y=\"1362.1\" font-family=\"Arial, Helvetica, sans-serif\" font-size=\"13\" font-weight=\"400\" text-anchor=\"start\" fill=\"#b5c7c8\" >deadlines.</text>",
        1
      ]
    ],
    "expectedHash": "8207717a212a0db971ca62d5a91dc55c200c9f7c8a11ae42d6a30229db9a21f5",
    "expectedDomHash": "6aa8b175c892a9b6a249cac50a4ad4f9f9b2bde7a7350b8f28988bc9d0813f1c"
  }
};
const kinds=["channels", "filings", "deadlines", "fallback", "backlog", "reconciliation"];
const variants=['fr','en'].flatMap(lang=>kinds.flatMap(kind=>[false,true].map(mobile=>({lang,kind,mobile,key:`${kind}-${lang}-${mobile?'mobile':'desktop'}`,svg:bncSvg(lang,kind,mobile)}))));
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const builder = new XMLBuilder({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '' });
const tag = n => Object.keys(n).find(k => k !== ':@');
const attrs = n => n[':@'] ?? {};
const children = n => n[tag(n)] ?? [];
const xmlNodes = n => tag(n) === '#text' ? [] : [n, ...children(n).flatMap(xmlNodes)];
const xmlText = n => tag(n) === '#text' ? n['#text'] : children(n).map(xmlText).join('');
const htmlNodes = n => [n, ...(n.childNodes ?? []).flatMap(htmlNodes)];
const canonical = n => n.nodeName === '#text' ? ['#text', n.value] : [n.tagName, (n.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), (n.childNodes ?? []).filter(c => c.nodeName !== '#text' || c.value.trim() || ['text', 'tspan', 'title', 'desc', 'metadata', 'style'].includes(n.tagName)).map(canonical)];
const domHash = raw => { const roots = htmlNodes(parse(raw)).filter(n => n.tagName === 'svg'); assert.equal(roots.length, 1); return digest(JSON.stringify(canonical(roots[0]))); };
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
// SVG 2 Appendix B.2 endpoint-to-center conversion, with true rotated extrema.
// https://www.w3.org/TR/SVG2/implnote.html#ArcImplementationNotes
function arcPoints(start, radii, rotation, large, sweep, end) {
  assert.ok([start, radii, end].every(p => p.length === 2 && p.every(Number.isFinite)));
  assert.ok(Number.isFinite(rotation) && [0, 1].includes(large) && [0, 1].includes(sweep));
  let [rx, ry] = radii.map(Math.abs);
  if ((start[0] === end[0] && start[1] === end[1]) || rx === 0 || ry === 0) return [start, end];
  const phi = (rotation % 360) * Math.PI / 180, cos = Math.cos(phi), sin = Math.sin(phi);
  const dx = (start[0] - end[0]) / 2, dy = (start[1] - end[1]) / 2;
  const xp = cos * dx + sin * dy, yp = -sin * dx + cos * dy;
  const scale = xp * xp / (rx * rx) + yp * yp / (ry * ry);
  if (scale > 1) { rx *= Math.sqrt(scale); ry *= Math.sqrt(scale); }
  const denominator = rx * rx * yp * yp + ry * ry * xp * xp;
  const factor = (large === sweep ? -1 : 1) * Math.sqrt(Math.max(0, (rx * rx * ry * ry - denominator) / denominator));
  const cxp = factor * rx * yp / ry, cyp = -factor * ry * xp / rx;
  const cx = cos * cxp - sin * cyp + (start[0] + end[0]) / 2;
  const cy = sin * cxp + cos * cyp + (start[1] + end[1]) / 2;
  const u = [(xp - cxp) / rx, (yp - cyp) / ry], v = [(-xp - cxp) / rx, (-yp - cyp) / ry];
  const theta = Math.atan2(u[1], u[0]), tau = 2 * Math.PI;
  let delta = Math.atan2(u[0] * v[1] - u[1] * v[0], u[0] * v[0] + u[1] * v[1]);
  if (!sweep && delta > 0) delta -= tau;
  if (sweep && delta < 0) delta += tau;
  const mod = a => ((a % tau) + tau) % tau;
  const withinSweep = a => (sweep ? mod(a - theta) : mod(theta - a)) <= Math.abs(delta) + 1e-12;
  const at = a => [cx + rx * Math.cos(a) * cos - ry * Math.sin(a) * sin, cy + rx * Math.cos(a) * sin + ry * Math.sin(a) * cos];
  const xCritical = Math.atan2(-ry * sin, rx * cos), yCritical = Math.atan2(ry * cos, rx * sin);
  const result = [start, end, ...[xCritical, xCritical + Math.PI, yCritical, yCritical + Math.PI].filter(withinSweep).map(at)];
  assert.ok(result.flat().every(Number.isFinite)); return result;
}
function pathPoints(raw) {
  assert.equal(typeof raw, 'string'); assert.ok(raw.length > 0 && raw.length <= 8192);
  // The supplied polylines use legal comma separators only between coordinate numbers.
  raw = raw.replace(/(?<=\d),(?=-?(?:\d|\.\d))/gu, ' ');
  const token = /[MLHVZCQTAlz]|-?(?:\d{1,4}(?:\.\d{1,18})?|\.\d{1,18})/uy;
  const tokens = []; let offset = 0;
  while (offset < raw.length) {
    if (/\s/u.test(raw[offset])) { offset++; continue; }
    token.lastIndex = offset; const match = token.exec(raw); assert.ok(match, 'Complete path token');
    tokens.push(match[0]); assert.ok(tokens.length <= 2048); offset = token.lastIndex;
  }
  assert.equal(tokens[0], 'M'); const points = []; let i = 0, current, origin, quadraticControl, count = 0, repeat;
  const pair = () => [number(tokens[i++]), number(tokens[i++])];
  while (i < tokens.length) {
    const command = /^[MLHVZCQTAlz]$/u.test(tokens[i]) ? tokens[i++] : repeat; assert.ok(['M', 'L', 'H', 'V', 'Z', 'C', 'Q', 'T', 'A', 'l', 'z'].includes(command));
    assert.ok(++count <= 512); repeat = command === 'M' ? 'L' : ['Z','z'].includes(command) ? undefined : command;
    if (command === 'Z' || command === 'z') { assert.ok(origin); current = [...origin]; quadraticControl = undefined; }
    else if (command === 'M' || command === 'L' || command === 'l') {
      if (command !== 'M') assert.ok(current);
      const next=pair();current=command==='l'?next.map((v,k)=>v+current[k]):next;assert.ok(current.every(n=>Number.isFinite(n)&&Math.abs(n)<=10000));quadraticControl=undefined;
      if (command === 'M') origin = [...current];
    } else if (command === 'H' || command === 'V') {
      assert.ok(current); current = [...current]; current[command === 'H' ? 0 : 1] = number(tokens[i++]); quadraticControl = undefined;
    } else if (command === 'A') {
      assert.ok(current);const radii=pair(),rotation=number(tokens[i++]),large=number(tokens[i++]),sweep=number(tokens[i++]),end=pair();
      points.push(...arcPoints(current,radii,rotation,large,sweep,end));current=end;quadraticControl=undefined;
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
const originalNavigation={
  "channels-fr-desktop": [
    {
      "attributes": {
        "href": "https://www.txeb.uscourts.gov/news/bnc-service-disruption-notification",
        "target": "_blank",
        "aria-label": "BNC Service Disruption Notification"
      },
      "text": "\nS02\n"
    },
    {
      "attributes": {
        "href": "https://www.almb.uscourts.gov/news/nationwide-bankruptcy-noticing-center-outage-october-2026",
        "target": "_blank",
        "aria-label": "Nationwide Bankruptcy Noticing Center Outage – October 2026"
      },
      "text": "\nS03\n"
    },
    {
      "attributes": {
        "href": "https://www.insb.uscourts.gov/sites/insb/files/BNC_10162026_FAQs.pdf",
        "target": "_blank",
        "aria-label": "BNC Service Interruption: Update and FAQs as of October 16, 2026"
      },
      "text": "\nS05\n"
    }
  ],
  "channels-fr-mobile": [
    {
      "attributes": {
        "href": "https://www.txeb.uscourts.gov/news/bnc-service-disruption-notification",
        "target": "_blank",
        "aria-label": "BNC Service Disruption Notification"
      },
      "text": "\nS02\n"
    },
    {
      "attributes": {
        "href": "https://www.almb.uscourts.gov/news/nationwide-bankruptcy-noticing-center-outage-october-2026",
        "target": "_blank",
        "aria-label": "Nationwide Bankruptcy Noticing Center Outage – October 2026"
      },
      "text": "\nS03\n"
    },
    {
      "attributes": {
        "href": "https://www.insb.uscourts.gov/sites/insb/files/BNC_10162026_FAQs.pdf",
        "target": "_blank",
        "aria-label": "BNC Service Interruption: Update and FAQs as of October 16, 2026"
      },
      "text": "\nS05\n"
    }
  ],
  "filings-fr-desktop": [
    {
      "attributes": {
        "href": "https://www.uscourts.gov/data-news/judiciary-news/2026/07/28/bankruptcies-rise-122-percent",
        "target": "_blank",
        "aria-label": "Bankruptcies Rise 12.2 Percent"
      },
      "text": "\nS15\n"
    },
    {
      "attributes": {
        "href": "https://www.uscourts.gov/sites/default/files/document/bf_f2_0630.2026.pdf",
        "target": "_blank",
        "aria-label": "Table F-2: U.S. Bankruptcy Courts, Business and Nonbusiness Cases Commenced"
      },
      "text": "\nS16\n"
    }
  ],
  "filings-fr-mobile": [
    {
      "attributes": {
        "href": "https://www.uscourts.gov/data-news/judiciary-news/2026/07/28/bankruptcies-rise-122-percent",
        "target": "_blank",
        "aria-label": "Bankruptcies Rise 12.2 Percent"
      },
      "text": "\nS15\n"
    },
    {
      "attributes": {
        "href": "https://www.uscourts.gov/sites/default/files/document/bf_f2_0630.2026.pdf",
        "target": "_blank",
        "aria-label": "Table F-2: U.S. Bankruptcy Courts, Business and Nonbusiness Cases Commenced"
      },
      "text": "\nS16\n"
    }
  ],
  "deadlines-fr-desktop": [
    {
      "attributes": {
        "href": "https://www.uscourts.gov/sites/default/files/document/federal-rules-of-bankruptcy-procedure.pdf",
        "target": "_blank",
        "aria-label": "Federal Rules of Bankruptcy Procedure"
      },
      "text": "\nS12\n"
    },
    {
      "attributes": {
        "href": "https://uscode.house.gov/us/usc/119-118/t11/s362/",
        "target": "_blank",
        "aria-label": "11 U.S.C. §362 — Automatic stay"
      },
      "text": "\nS13\n"
    },
    {
      "attributes": {
        "href": "https://uscode.house.gov/us/usc/119-118/t11/s342/",
        "target": "_blank",
        "aria-label": "11 U.S.C. §342 — Notice"
      },
      "text": "\nS14\n"
    }
  ],
  "deadlines-fr-mobile": [
    {
      "attributes": {
        "href": "https://www.uscourts.gov/sites/default/files/document/federal-rules-of-bankruptcy-procedure.pdf",
        "target": "_blank",
        "aria-label": "Federal Rules of Bankruptcy Procedure"
      },
      "text": "\nS12\n"
    },
    {
      "attributes": {
        "href": "https://uscode.house.gov/us/usc/119-118/t11/s362/",
        "target": "_blank",
        "aria-label": "11 U.S.C. §362 — Automatic stay"
      },
      "text": "\nS13\n"
    },
    {
      "attributes": {
        "href": "https://uscode.house.gov/us/usc/119-118/t11/s342/",
        "target": "_blank",
        "aria-label": "11 U.S.C. §342 — Notice"
      },
      "text": "\nS14\n"
    }
  ],
  "fallback-fr-desktop": [
    {
      "attributes": {
        "href": "https://www.insb.uscourts.gov/sites/insb/files/26-0004.pdf",
        "target": "_blank",
        "aria-label": "General Order 26-0004"
      },
      "text": "\nS04\n"
    },
    {
      "attributes": {
        "href": "https://www.laeb.uscourts.gov/sites/laeb/files/AGO2026-1_BNC101326.pdf",
        "target": "_blank",
        "aria-label": "General Order 2026-1"
      },
      "text": "\nS06\n"
    },
    {
      "attributes": {
        "href": "https://www.nyeb.uscourts.gov/sites/nyeb/files/general-ordes/ord_844.pdf",
        "target": "_blank",
        "aria-label": "Administrative Order 844"
      },
      "text": "\nS07\n"
    },
    {
      "attributes": {
        "href": "https://www.akb.uscourts.gov/news/important-notice-bankruptcy-noticing-center-service-disruption",
        "target": "_blank",
        "aria-label": "Important Notice: BNC Service Disruption"
      },
      "text": "\nS11\n"
    }
  ],
  "fallback-fr-mobile": [
    {
      "attributes": {
        "href": "https://www.insb.uscourts.gov/sites/insb/files/26-0004.pdf",
        "target": "_blank",
        "aria-label": "General Order 26-0004"
      },
      "text": "\nS04\n"
    },
    {
      "attributes": {
        "href": "https://www.laeb.uscourts.gov/sites/laeb/files/AGO2026-1_BNC101326.pdf",
        "target": "_blank",
        "aria-label": "General Order 2026-1"
      },
      "text": "\nS06\n"
    },
    {
      "attributes": {
        "href": "https://www.nyeb.uscourts.gov/sites/nyeb/files/general-ordes/ord_844.pdf",
        "target": "_blank",
        "aria-label": "Administrative Order 844"
      },
      "text": "\nS07\n"
    },
    {
      "attributes": {
        "href": "https://www.akb.uscourts.gov/news/important-notice-bankruptcy-noticing-center-service-disruption",
        "target": "_blank",
        "aria-label": "Important Notice: BNC Service Disruption"
      },
      "text": "\nS11\n"
    }
  ],
  "backlog-fr-desktop": [],
  "backlog-fr-mobile": [],
  "reconciliation-fr-desktop": [
    {
      "attributes": {
        "href": "https://www.insb.uscourts.gov/sites/insb/files/BNC_10162026_FAQs.pdf",
        "target": "_blank",
        "aria-label": "BNC Service Interruption: Update and FAQs as of October 16, 2026"
      },
      "text": "\nS05\n"
    },
    {
      "attributes": {
        "href": "https://www.gasb.uscourts.gov/news/important-information-regarding-bankruptcy-noticing-center-bnc-nationwide-service-disruption",
        "target": "_blank",
        "aria-label": "Important Information Regarding BNC Nationwide Service Disruption"
      },
      "text": "\nS10\n"
    },
    {
      "attributes": {
        "href": "https://www.mnb.uscourts.gov/news/update-regarding-bankruptcy-noticing-center-service-interruption",
        "target": "_blank",
        "aria-label": "Update Regarding Bankruptcy Noticing Center Service Interruption"
      },
      "text": "\nS20\n"
    }
  ],
  "reconciliation-fr-mobile": [
    {
      "attributes": {
        "href": "https://www.insb.uscourts.gov/sites/insb/files/BNC_10162026_FAQs.pdf",
        "target": "_blank",
        "aria-label": "BNC Service Interruption: Update and FAQs as of October 16, 2026"
      },
      "text": "\nS05\n"
    },
    {
      "attributes": {
        "href": "https://www.gasb.uscourts.gov/news/important-information-regarding-bankruptcy-noticing-center-bnc-nationwide-service-disruption",
        "target": "_blank",
        "aria-label": "Important Information Regarding BNC Nationwide Service Disruption"
      },
      "text": "\nS10\n"
    },
    {
      "attributes": {
        "href": "https://www.mnb.uscourts.gov/news/update-regarding-bankruptcy-noticing-center-service-interruption",
        "target": "_blank",
        "aria-label": "Update Regarding Bankruptcy Noticing Center Service Interruption"
      },
      "text": "\nS20\n"
    }
  ],
  "channels-en-desktop": [
    {
      "attributes": {
        "href": "https://www.txeb.uscourts.gov/news/bnc-service-disruption-notification",
        "target": "_blank",
        "aria-label": "BNC Service Disruption Notification"
      },
      "text": "\nS02\n"
    },
    {
      "attributes": {
        "href": "https://www.almb.uscourts.gov/news/nationwide-bankruptcy-noticing-center-outage-october-2026",
        "target": "_blank",
        "aria-label": "Nationwide Bankruptcy Noticing Center Outage – October 2026"
      },
      "text": "\nS03\n"
    },
    {
      "attributes": {
        "href": "https://www.insb.uscourts.gov/sites/insb/files/BNC_10162026_FAQs.pdf",
        "target": "_blank",
        "aria-label": "BNC Service Interruption: Update and FAQs as of October 16, 2026"
      },
      "text": "\nS05\n"
    }
  ],
  "channels-en-mobile": [
    {
      "attributes": {
        "href": "https://www.txeb.uscourts.gov/news/bnc-service-disruption-notification",
        "target": "_blank",
        "aria-label": "BNC Service Disruption Notification"
      },
      "text": "\nS02\n"
    },
    {
      "attributes": {
        "href": "https://www.almb.uscourts.gov/news/nationwide-bankruptcy-noticing-center-outage-october-2026",
        "target": "_blank",
        "aria-label": "Nationwide Bankruptcy Noticing Center Outage – October 2026"
      },
      "text": "\nS03\n"
    },
    {
      "attributes": {
        "href": "https://www.insb.uscourts.gov/sites/insb/files/BNC_10162026_FAQs.pdf",
        "target": "_blank",
        "aria-label": "BNC Service Interruption: Update and FAQs as of October 16, 2026"
      },
      "text": "\nS05\n"
    }
  ],
  "filings-en-desktop": [
    {
      "attributes": {
        "href": "https://www.uscourts.gov/data-news/judiciary-news/2026/07/28/bankruptcies-rise-122-percent",
        "target": "_blank",
        "aria-label": "Bankruptcies Rise 12.2 Percent"
      },
      "text": "\nS15\n"
    },
    {
      "attributes": {
        "href": "https://www.uscourts.gov/sites/default/files/document/bf_f2_0630.2026.pdf",
        "target": "_blank",
        "aria-label": "Table F-2: U.S. Bankruptcy Courts, Business and Nonbusiness Cases Commenced"
      },
      "text": "\nS16\n"
    }
  ],
  "filings-en-mobile": [
    {
      "attributes": {
        "href": "https://www.uscourts.gov/data-news/judiciary-news/2026/07/28/bankruptcies-rise-122-percent",
        "target": "_blank",
        "aria-label": "Bankruptcies Rise 12.2 Percent"
      },
      "text": "\nS15\n"
    },
    {
      "attributes": {
        "href": "https://www.uscourts.gov/sites/default/files/document/bf_f2_0630.2026.pdf",
        "target": "_blank",
        "aria-label": "Table F-2: U.S. Bankruptcy Courts, Business and Nonbusiness Cases Commenced"
      },
      "text": "\nS16\n"
    }
  ],
  "deadlines-en-desktop": [
    {
      "attributes": {
        "href": "https://www.uscourts.gov/sites/default/files/document/federal-rules-of-bankruptcy-procedure.pdf",
        "target": "_blank",
        "aria-label": "Federal Rules of Bankruptcy Procedure"
      },
      "text": "\nS12\n"
    },
    {
      "attributes": {
        "href": "https://uscode.house.gov/us/usc/119-118/t11/s362/",
        "target": "_blank",
        "aria-label": "11 U.S.C. §362 — Automatic stay"
      },
      "text": "\nS13\n"
    },
    {
      "attributes": {
        "href": "https://uscode.house.gov/us/usc/119-118/t11/s342/",
        "target": "_blank",
        "aria-label": "11 U.S.C. §342 — Notice"
      },
      "text": "\nS14\n"
    }
  ],
  "deadlines-en-mobile": [
    {
      "attributes": {
        "href": "https://www.uscourts.gov/sites/default/files/document/federal-rules-of-bankruptcy-procedure.pdf",
        "target": "_blank",
        "aria-label": "Federal Rules of Bankruptcy Procedure"
      },
      "text": "\nS12\n"
    },
    {
      "attributes": {
        "href": "https://uscode.house.gov/us/usc/119-118/t11/s362/",
        "target": "_blank",
        "aria-label": "11 U.S.C. §362 — Automatic stay"
      },
      "text": "\nS13\n"
    },
    {
      "attributes": {
        "href": "https://uscode.house.gov/us/usc/119-118/t11/s342/",
        "target": "_blank",
        "aria-label": "11 U.S.C. §342 — Notice"
      },
      "text": "\nS14\n"
    }
  ],
  "fallback-en-desktop": [
    {
      "attributes": {
        "href": "https://www.insb.uscourts.gov/sites/insb/files/26-0004.pdf",
        "target": "_blank",
        "aria-label": "General Order 26-0004"
      },
      "text": "\nS04\n"
    },
    {
      "attributes": {
        "href": "https://www.laeb.uscourts.gov/sites/laeb/files/AGO2026-1_BNC101326.pdf",
        "target": "_blank",
        "aria-label": "General Order 2026-1"
      },
      "text": "\nS06\n"
    },
    {
      "attributes": {
        "href": "https://www.nyeb.uscourts.gov/sites/nyeb/files/general-ordes/ord_844.pdf",
        "target": "_blank",
        "aria-label": "Administrative Order 844"
      },
      "text": "\nS07\n"
    },
    {
      "attributes": {
        "href": "https://www.akb.uscourts.gov/news/important-notice-bankruptcy-noticing-center-service-disruption",
        "target": "_blank",
        "aria-label": "Important Notice: BNC Service Disruption"
      },
      "text": "\nS11\n"
    }
  ],
  "fallback-en-mobile": [
    {
      "attributes": {
        "href": "https://www.insb.uscourts.gov/sites/insb/files/26-0004.pdf",
        "target": "_blank",
        "aria-label": "General Order 26-0004"
      },
      "text": "\nS04\n"
    },
    {
      "attributes": {
        "href": "https://www.laeb.uscourts.gov/sites/laeb/files/AGO2026-1_BNC101326.pdf",
        "target": "_blank",
        "aria-label": "General Order 2026-1"
      },
      "text": "\nS06\n"
    },
    {
      "attributes": {
        "href": "https://www.nyeb.uscourts.gov/sites/nyeb/files/general-ordes/ord_844.pdf",
        "target": "_blank",
        "aria-label": "Administrative Order 844"
      },
      "text": "\nS07\n"
    },
    {
      "attributes": {
        "href": "https://www.akb.uscourts.gov/news/important-notice-bankruptcy-noticing-center-service-disruption",
        "target": "_blank",
        "aria-label": "Important Notice: BNC Service Disruption"
      },
      "text": "\nS11\n"
    }
  ],
  "backlog-en-desktop": [],
  "backlog-en-mobile": [],
  "reconciliation-en-desktop": [
    {
      "attributes": {
        "href": "https://www.insb.uscourts.gov/sites/insb/files/BNC_10162026_FAQs.pdf",
        "target": "_blank",
        "aria-label": "BNC Service Interruption: Update and FAQs as of October 16, 2026"
      },
      "text": "\nS05\n"
    },
    {
      "attributes": {
        "href": "https://www.gasb.uscourts.gov/news/important-information-regarding-bankruptcy-noticing-center-bnc-nationwide-service-disruption",
        "target": "_blank",
        "aria-label": "Important Information Regarding BNC Nationwide Service Disruption"
      },
      "text": "\nS10\n"
    },
    {
      "attributes": {
        "href": "https://www.mnb.uscourts.gov/news/update-regarding-bankruptcy-noticing-center-service-interruption",
        "target": "_blank",
        "aria-label": "Update Regarding Bankruptcy Noticing Center Service Interruption"
      },
      "text": "\nS20\n"
    }
  ],
  "reconciliation-en-mobile": [
    {
      "attributes": {
        "href": "https://www.insb.uscourts.gov/sites/insb/files/BNC_10162026_FAQs.pdf",
        "target": "_blank",
        "aria-label": "BNC Service Interruption: Update and FAQs as of October 16, 2026"
      },
      "text": "\nS05\n"
    },
    {
      "attributes": {
        "href": "https://www.gasb.uscourts.gov/news/important-information-regarding-bankruptcy-noticing-center-bnc-nationwide-service-disruption",
        "target": "_blank",
        "aria-label": "Important Information Regarding BNC Nationwide Service Disruption"
      },
      "text": "\nS10\n"
    },
    {
      "attributes": {
        "href": "https://www.mnb.uscourts.gov/news/update-regarding-bankruptcy-noticing-center-service-interruption",
        "target": "_blank",
        "aria-label": "Update Regarding Bankruptcy Noticing Center Service Interruption"
      },
      "text": "\nS20\n"
    }
  ]
};
const sourceAnchors={
  "https://www.txeb.uscourts.gov/news/bnc-service-disruption-notification": "#source-s02",
  "https://www.almb.uscourts.gov/news/nationwide-bankruptcy-noticing-center-outage-october-2026": "#source-s03",
  "https://www.insb.uscourts.gov/sites/insb/files/BNC_10162026_FAQs.pdf": "#source-s05",
  "https://www.uscourts.gov/data-news/judiciary-news/2026/07/28/bankruptcies-rise-122-percent": "#source-s15",
  "https://www.uscourts.gov/sites/default/files/document/bf_f2_0630.2026.pdf": "#source-s16",
  "https://www.uscourts.gov/sites/default/files/document/federal-rules-of-bankruptcy-procedure.pdf": "#source-s12",
  "https://uscode.house.gov/us/usc/119-118/t11/s362/": "#source-s13",
  "https://uscode.house.gov/us/usc/119-118/t11/s342/": "#source-s14",
  "https://www.insb.uscourts.gov/sites/insb/files/26-0004.pdf": "#source-s04",
  "https://www.laeb.uscourts.gov/sites/laeb/files/AGO2026-1_BNC101326.pdf": "#source-s06",
  "https://www.nyeb.uscourts.gov/sites/nyeb/files/general-ordes/ord_844.pdf": "#source-s07",
  "https://www.akb.uscourts.gov/news/important-notice-bankruptcy-noticing-center-service-disruption": "#source-s11",
  "https://www.gasb.uscourts.gov/news/important-information-regarding-bankruptcy-noticing-center-bnc-nationwide-service-disruption": "#source-s10",
  "https://www.mnb.uscourts.gov/news/update-regarding-bankruptcy-noticing-center-service-interruption": "#source-s20"
};
const inverseAnchors=Object.fromEntries(Object.entries(sourceAnchors).map(([url,target])=>[target,url]));
const palette=new Set(["#102830", "#19363e", "#f1f5f2", "#b5c7c8", "#35525a", "#74d6c5", "#f3bf7a", "#f19b87"]);
const allowed=Object.fromEntries(Object.entries({
  "svg": "aria-labelledby height role viewBox width xmlns",
  "defs": "",
  "title": "id",
  "desc": "id",
  "marker": "id markerHeight markerUnits markerWidth orient refX refY",
  "path": "d fill marker-end stroke stroke-width",
  "rect": "fill height rx stroke stroke-dasharray stroke-width width x y",
  "text": "fill font-family font-size font-weight text-anchor x y",
  "line": "marker-end stroke stroke-dasharray stroke-width x1 x2 y1 y2",
  "a": "aria-label href target",
  "circle": "cx cy fill r"
}).map(([tag,fields])=>[tag,new Set(fields ? fields.split(' ') : [])]));
const numeric=new Set('x y width height rx cx cy r x1 y1 x2 y2 font-size stroke-width refX refY markerWidth markerHeight'.split(' '));
function number(raw){assert.equal(typeof raw,'string');assert.ok(raw.length>0&&raw.length<=32);assert.match(raw,/^-?(?:\d{1,4}(?:\.\d{1,18})?|\.\d{1,18})$/u);const n=Number(raw);assert.ok(Number.isFinite(n)&&Math.abs(n)<=10000);return n;}
const value=(n,k,fallback='0')=>number(attrs(n)[k]??fallback);
function inspect(v){
 assert.equal(typeof v.svg,'string');assert.ok(v.svg.length>100&&v.svg.length<40000);assert.doesNotMatch(v.svg,/<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;)/u);assert.equal(XMLValidator.validate(v.svg),true);
 const roots=parser.parse(v.svg);assert.equal(roots.length,1);const root=roots[0];assert.equal(tag(root),'svg');
 const prefix=`bnc-f${kinds.indexOf(v.kind)+1}-${v.lang}-${v.mobile?'m':'d'}`,[,,width,height]=originals[v.key].viewBox.split(' ');
 assert.deepEqual(attrs(root),{xmlns:'http://www.w3.org/2000/svg',width,height,viewBox:originals[v.key].viewBox,role:'img','aria-labelledby':`${prefix}-title ${prefix}-desc`});
 const nodes=xmlNodes(root),ids=[];assert.ok(nodes.length<512);
 for(const n of nodes){assert.ok(Object.hasOwn(allowed,tag(n)));for(const[k,val]of Object.entries(attrs(n))){
  assert.ok(allowed[tag(n)].has(k),`${tag(n)}.${k}`);assert.equal(typeof val,'string');assert.ok(val.length<=8192);
  if(numeric.has(k)){const num=number(val);if(['width','height','rx','r','stroke-width','markerWidth','markerHeight'].includes(k))assert.ok(num>=0);}
  if(k==='fill'||k==='stroke')assert.ok(val==='none'||palette.has(val));
  if(k==='id'){assert.ok(['title','desc','arrow'].some(s=>val===`${prefix}-${s}`));ids.push(val);}
  if(k==='font-family')assert.equal(val,'Arial, Helvetica, sans-serif');if(k==='font-weight')assert.ok(['400','700'].includes(val));if(k==='font-size')assert.ok(number(val)>=12&&number(val)<=47);
  if(k==='text-anchor')assert.ok(['start','middle','end'].includes(val));if(k==='stroke-dasharray')assert.ok(['6 5','5 4','2 5','8 5','4 3'].includes(val));if(k==='d')pathPoints(val);
  if(k==='marker-end')assert.equal(val,`url(#${prefix}-arrow)`);
  if(k==='href'){assert.equal(tag(n),'a');assert.ok(Object.hasOwn(sourceAnchors,val));const url=new URL(val);assert.equal(url.href,val);assert.equal(url.protocol,'https:');assert.equal(url.username,'');assert.equal(url.password,'');assert.equal(url.hash,'');}
  if(k==='target')assert.equal(val,'_blank');if(k==='aria-label')assert.ok(val.length>0&&val.length<200);
 }
 if(tag(n)==='marker'){assert.deepEqual(attrs(n),{id:`${prefix}-arrow`,markerWidth:'8',markerHeight:'8',refX:'7',refY:'4',orient:'auto',markerUnits:'userSpaceOnUse'});assert.equal(children(n).length,1);assert.deepEqual(attrs(children(n)[0]),{d:'M0 0 L8 4 L0 8',fill:'#b5c7c8'});}
 if(tag(n)==='text')assert.ok(children(n).length===1&&tag(children(n)[0])==='#text');
 }
 assert.equal(new Set(ids).size,3);assert.equal(ids.length,3);for(const type of ['title','desc','defs','marker'])assert.equal(nodes.filter(n=>tag(n)===type).length,1);
 assert.deepEqual(nodes.filter(n=>tag(n)==='a').map(n=>({attributes:attrs(n),text:xmlText(n)})),originalNavigation[v.key]);
 return{root,nodes,width:Number(width),height:Number(height)};
}
function faithful(v){inspect(v);let raw=v.svg;const c=textCorrections[v.key];if(c){assert.equal(digest(raw),c.expectedHash);assert.equal(domHash(raw),c.expectedDomHash);for(const[before,after,count]of [...c.pairs].reverse()){assert.equal(raw.split(after).length-1,count);raw=raw.replaceAll(after,before);}}
 assert.equal(digest(raw),originals[v.key].rawHash);assert.equal(domHash(raw),originals[v.key].domHash);
 const projection=n=>tag(n)==='#text'?null:[tag(n),Object.entries(attrs(n)).sort(),children(n).filter(n=>tag(n)!=='#text').map(projection)];assert.equal(digest(JSON.stringify(projection(parser.parse(v.svg)[0]))),originals[v.key].geometryHash);
}
const mutate = (v, change) => { const root = parser.parse(v.svg)[0]; change(root, xmlNodes(root)); return { ...v, svg: builder.build([root]) }; };
const within = (a,b,t=0) => a.x >= b.x-t && a.y >= b.y-t && a.right <= b.right+t && a.bottom <= b.bottom+t;
const overlaps = (a,b) => a.x < b.right && a.right > b.x && a.y < b.bottom && a.bottom > b.y;
const pointsBox = points => { assert.ok(points.length && points.flat().every(Number.isFinite)); return {x:Math.min(...points.map(p=>p[0])),y:Math.min(...points.map(p=>p[1])),right:Math.max(...points.map(p=>p[0])),bottom:Math.max(...points.map(p=>p[1]))}; };
function shapeBox(n) {
  if (tag(n) === 'rect') return { x: value(n, 'x'), y: value(n, 'y'), right: value(n, 'x') + value(n, 'width'), bottom: value(n, 'y') + value(n, 'height') };
  if (tag(n) === 'circle') return { x: value(n, 'cx') - value(n, 'r'), y: value(n, 'cy') - value(n, 'r'), right: value(n, 'cx') + value(n, 'r'), bottom: value(n, 'cy') + value(n, 'r') };
  if (tag(n) === 'line') return pointsBox([[value(n, 'x1'), value(n, 'y1')], [value(n, 'x2'), value(n, 'y2')]]);
  if (tag(n) === 'path') return pointsBox(pathPoints(attrs(n).d));
}
function scene(n) { return ['#text','defs'].includes(tag(n)) ? [] : [n,...children(n).flatMap(scene)]; }
function geometry(v) {
 const {root,width,height}=inspect(v),canvas={x:0,y:0,right:width,bottom:height};
 for(const n of scene(root)){
  if(['rect','circle','line','path'].includes(tag(n))){const b=shapeBox(n),s=attrs(n).stroke&&attrs(n).stroke!=='none'?value(n,'stroke-width','1')/2:0;assert.ok(within({x:b.x-s,y:b.y-s,right:b.right+s,bottom:b.bottom+s},canvas,.01),'shape outside viewBox');}
  if(tag(n)==='text'){const x=value(n,'x'),y=value(n,'y');assert.ok(x>=0&&x<=width&&y>=0&&y<=height,'text anchor outside viewBox');}
  if(attrs(n)['marker-end']){const points=tag(n)==='line'?[[value(n,'x1'),value(n,'y1')],[value(n,'x2'),value(n,'y2')]]:pathPoints(attrs(n).d),a=points.at(-2),b=points.at(-1);assert.ok(a&&b);assert.ok(Math.hypot(b[0]-a[0],b[1]-a[1])>0);const angle=Math.atan2(b[1]-a[1],b[0]-a[0]),scale=1;const triangle=[[0,0],[8,4],[0,8]].map(([x,y])=>{const dx=(x-7)*scale,dy=(y-4)*scale;return[b[0]+Math.cos(angle)*dx-Math.sin(angle)*dy,b[1]+Math.sin(angle)*dx+Math.cos(angle)*dy];});assert.ok(within(pointsBox(triangle),canvas,.01),'marker outside viewBox');}

 }
}


test('BNC variant selection is complete, frozen and rejects coercion and prototype keys',()=>{
 assert.deepEqual(BNC_KINDS,kinds);assert.ok(Object.isFrozen(BNC_KINDS));assert.equal(variants.length,24);
 for(const args of [['xx','channels'],['fr','__proto__'],['fr',{},true],['fr','channels',1],[null,'channels']])assert.throws(()=>bncSvg(...args));
});
test('all24 complete supplied XML trees are recovered with only9 approved text nodes changed',()=>{
 for(const v of variants)faithful(v);assert.equal(Object.keys(textCorrections).length,3);assert.equal(Object.values(textCorrections).reduce((n,c)=>n+c.pairs.length,0),9);
});
test('native shape, original user-space marker and text-anchor bounds remain inside every viewBox',()=>{for(const v of variants)geometry(v);});
test('complete source goldens reject changed geometry, root attributes, paint, labels, fonts and ordering',()=>{
 const v=variants[0];for(const[k,val]of[['width','1'],['height','1'],['viewBox','0 0 5 5'],['aria-labelledby','changed']])assert.throws(()=>faithful(mutate(v,root=>{attrs(root)[k]=val;})));
 for(const[k,val]of[['x','-10'],['font-family','Other'],['fill','#ffffff'],['font-size','11']])assert.throws(()=>faithful(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='text'))[k]=val;})));
 assert.throws(()=>faithful(mutate(v,root=>{root.svg.reverse();})));assert.throws(()=>faithful(mutate(v,(_,ns)=>{ns.find(n=>tag(n)==='text').text=[{'#text':'changed'}];})));
});
test('passive validator rejects executable markup, resource references, added fields and malformed paths',()=>{
 const v=variants[0];for(const type of ['script','foreignObject','image','use','animate','filter','style','metadata','g','tspan'])assert.throws(()=>inspect(mutate(v,root=>{root.svg.push({[type]:[]});})));
 for(const[k,val]of[['onload','alert(1)'],['href','https://example.org'],['xlink:href','javascript:alert(1)'],['constructor','x'],['transform','translate(1 2)'],['style','fill:red'],['x','Infinity'],['x','10001']])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='text'))[k]=val;})));
 for(const d of ['M0 0 L1','M0 0 trailing','M0 0 L1e99 0'])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='path')).d=d;})));
});
test('source navigation preserves all60 original attributes and blocks substituted URLs or new contexts',()=>{
 const v=variants[0];for(const href of ['javascript:alert(1)','data:text/html,x','http://www.txeb.uscourts.gov/','https://www.txeb.uscourts.gov.attacker.example/x','https://example.org/x',Object.keys(sourceAnchors).find(u=>u!==originalNavigation[v.key][0].attributes.href)])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='a')).href=href;})));
 for(const[k,val]of[['target','other'],['rel','opener'],['onclick','alert(1)'],['download','x'],['aria-label','']])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='a'))[k]=val;})));
 assert.equal(variants.reduce((n,v)=>n+inspect(v).nodes.filter(n=>tag(n)==='a').length,0),60);
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
  const bad = ['L0 0', 'M0', 'M0 0 trailing', 'M0 0 Z 1 1', 'MNaN 0', 'M1e999 0', 'M0,,0',
    'M0 0 C1 2 3 4 5', 'M0 0 Q1 2 3', 'M0 0 T1', 'M0 0 C1 2 3 4 5 6 trailing',
    'M0 0 H', 'M0 0 V', 'M0 0 A1 1 0 2 0 1 1', 'M0 0 q1 2 3 4', 'M0 0 S1 2 3 4',
    'M10001 0', 'M0 0 L99999 0', 'M' + '.'.repeat(8000) + ' 0', 'M' + '9'.repeat(8000) + ' 0',
    'M0.' + '9'.repeat(8000) + ' 0', 'M0 0 ' + 'L1 1 '.repeat(513), 'M0 0 ' + 'C1 1 1 1 1 1 '.repeat(300)];
  for (const raw of bad) assert.throws(() => pathPoints(raw));
  for (const raw of ['', null, {}, [], 0, new String('M0 0')]) assert.throws(() => pathPoints(raw));
  const code = `import assert from 'node:assert/strict'; const number=${number.toString()}; const curvePoints=${curvePoints.toString()}; const arcPoints=${arcPoints.toString()}; const paths=${pathPoints.toString()}; for(let i=0;i<100;i++) for(const raw of ${JSON.stringify(bad)}) assert.throws(()=>paths(raw));`;
  execFileSync(process.execPath, ['--input-type=module', '-e', code], { timeout: 5000, maxBuffer: 8192, stdio: 'pipe' });
});
test('responsive component preserves supplied fonts and maps the source palette to both existing themes',()=>{
 const component=read('src/components/BncFigure.astro'),style=component.match(/<style>([\s\S]*?)<\/style>/u)?.[1];assert.ok(style);
 const css=postcss.parse(style),decl=n=>Object.fromEntries(n.nodes.filter(d=>d.type==='decl').map(d=>[d.prop,d.value]));
 const rule=selector=>{const n=css.nodes.find(n=>n.type==='rule'&&n.selector===selector);assert.ok(n,selector);return decl(n);};
 const mapping={"#102830": "ink", "#19363e": "surface", "#f1f5f2": "paper", "#b5c7c8": "muted", "#35525a": "line-strong", "#74d6c5": "signal", "#f3bf7a": "amber", "#f19b87": "accent"};
 for(const[colour,variable]of Object.entries(mapping))assert.deepEqual(rule(`.bnc-figure :global([fill="${colour}"])`),{fill:`var(--color-${variable})`});
 for(const colour of ["#b5c7c8", "#35525a", "#74d6c5", "#f3bf7a", "#f19b87"])assert.deepEqual(rule(`.bnc-figure :global([stroke="${colour}"])`),{stroke:`var(--color-${mapping[colour]})`});
 const base=rule('.bnc-figure');assert.deepEqual([base.width,base['max-width'],base['container-type'],base['padding-bottom'],base.overflow],['100%','696px','inline-size','.85rem','visible']);
 const graphic=rule('.bnc-figure :global(svg)');assert.deepEqual([graphic.width,graphic.height,graphic['max-width'],graphic['letter-spacing'],graphic.overflow],['100%','auto','100%','normal','visible']);
 const mobile=rule('.bnc-mobile');assert.deepEqual([mobile.display,mobile.width,mobile['max-width'],mobile['margin-inline']],['none','100%','420px','auto']);
 assert.equal(css.nodes.filter(n=>n.type==='atrule'&&n.name==='font-face').length,0);css.walkDecls('font-family',()=>assert.fail('Keep the supplied explicit Arial/Helvetica text stack'));assert.doesNotMatch(component,/@font-face|\/fonts\//u);
 for(const name of ['media','container']){const n=css.nodes.find(n=>n.type==='atrule'&&n.name===name&&n.params==='(max-width: 640px)');assert.ok(n);assert.deepEqual(n.nodes.map(n=>[n.selector,decl(n).display]),[['.bnc-desktop','none'],['.bnc-mobile','block']]);}
 const themes={dark:new Map(),light:new Map()};postcss.parse(read('src/styles/global.css')).walkDecls(d=>{if((d.parent.type==='atrule'&&d.parent.name==='theme')||(d.parent.type==='rule'&&d.parent.selector===':root'))themes.dark.set(d.prop,d.value);if(d.parent.type==='rule'&&d.parent.selector===':root[data-theme="light"]')themes.light.set(d.prop,d.value);});
 for(const theme of Object.values(themes))for(const v of [...Object.values(mapping),'surface'])assert.ok(theme.has(`--color-${v}`));
 css.walkDecls(d=>assert.doesNotMatch(d.value,/#(?:[a-f0-9]{3}){1,2}\b|url\(/iu));assert.doesNotMatch(style,/clip-path|overflow\s*:\s*(?:hidden|clip)|transform\s*:|100vw/iu);
 assert.equal((component.match(/set:html=/gu)??[]).length,2);componentSourceAnchors();
 assert.ok(component.includes('id={`figure-${number}`}'));assert.doesNotMatch(component,/<script|client:|fetch\(|innerHTML/u);
});


const mdxNodes=n=>[n,...(n.children??[]).flatMap(mdxNodes)];
const figureSources={"channels": "02 03 05", "filings": "15 16", "deadlines": "12 13 14", "fallback": "04 06 07 11", "backlog": "m01", "reconciliation": "05 10 20"};
function articleFigures(raw,lang){
 const tree=createProcessor().parse(raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),nodes=mdxNodes(tree),figures=nodes.filter(n=>n.name==='BncFigure');assert.equal(figures.length,6);
 const imports=nodes.filter(n=>n.type==='mdxjsEsm');assert.equal(imports.length,1);assert.match(imports[0].value,/^import BncFigure from ['"]\.\.\/\.\.\/components\/BncFigure\.astro['"];?$/u);
 for(const[i,n]of figures.entries()){
  const a=Object.fromEntries(n.attributes.map(a=>{assert.equal(a.type,'mdxJsxAttribute');assert.equal(typeof a.value,'string');return[a.name,a.value];}));
  assert.deepEqual(Object.keys(a).sort(),['caption','kind','lang','number','sources']);assert.equal(a.kind,kinds[i]);assert.equal(a.number,String(i+1).padStart(2,'0'));assert.equal(a.lang,lang);assert.ok(a.caption.length>50);
  assert.equal(a.sources,figureSources[kinds[i]]);const details=mdxNodes(n).filter(c=>c.name==='details');assert.equal(details.length,1);assert.equal(mdxNodes(details[0]).filter(c=>c.name==='summary').length,1);
  const note=mdxNodes(details[0]).filter(c=>c.type==='text').map(c=>c.value).join(' ');assert.ok(note.length>100);
 }
}
test('article native MDX includes six ordered static figures, verified references and method notes',()=>{
 for(const lang of ['fr','en'])articleFigures(read(`src/content/${lang==='fr'?'posts/bnc-faillites-americaines-notifications-risque':'posts-en/bnc-us-bankruptcy-notice-outage-risk'}.mdx`),lang);
});
test('article figure contract rejects reordered, dynamic and incomplete source or method declarations',()=>{
 const raw=read('src/content/posts/bnc-faillites-americaines-notifications-risque.mdx');
 for(const [before,after]of [['kind="channels"','kind="filings"'],['number="01"','number="02"'],['sources="02 03 05"','sources="02"'],['lang="fr"','lang={"fr"}'],['<details>','<aside>']]){assert.ok(raw.includes(before),before);assert.throws(()=>articleFigures(raw.replace(before,after),'fr'));}
});
test('elliptical arcs include actual extrema for both sweeps, large arcs, rotated ellipses and corrected radii',()=>{
 const box=(d)=>pointsBox(pathPoints(d)),expect=(actual,wanted)=>Object.keys(wanted).forEach(k=>near(actual[k],wanted[k]));
 assert.deepEqual(pathPoints('M40 0 L0 0 0 40'),[[40,0],[0,0],[0,40]]);
 assert.deepEqual(pathPoints('M0 0 1 1 2 3'),[[0,0],[1,1],[2,3]]);
 expect(box('M10 0 A10 10 0 0 1 0 10'),{x:0,y:0,right:10,bottom:10});
 expect(box('M10 0 A10 10 0 1 1 0 10'),{x:0,y:0,right:20,bottom:20});
 expect(box('M-10 0 A10 5 0 0 1 10 0'),{x:-10,y:-5,right:10,bottom:0});
 expect(box('M-10 0 A10 5 0 0 0 10 0'),{x:-10,y:0,right:10,bottom:5});
 expect(box('M0 -10 A10 5 90 0 1 0 10'),{x:0,y:-10,right:5,bottom:10});
 expect(box('M-10 0 A1 1 0 0 1 10 0'),{x:-10,y:-10,right:10,bottom:0});
 expect(box('M-10 0 A-10 -5 0 0 1 10 0'),{x:-10,y:-5,right:10,bottom:0});
 expect(box('M1 2 A0 5 20 0 1 8 9'),{x:1,y:2,right:8,bottom:9});
 expect(box('M1 2 A5 5 20 1 1 1 2'),{x:1,y:2,right:1,bottom:2});
 const s=Math.sqrt(50),extent=Math.sqrt(62.5),first=arcPoints([-s,-s],[10,5],45,0,1,[s,s]),second=arcPoints([-s,-s],[10,5],45,0,0,[s,s]);
 expect(pointsBox([...first,...second]),{x:-extent,y:-extent,right:extent,bottom:extent});
 for(const d of ['M0 0 A1 1 0 2 0 1 1','M0 0 A1 1 0 0 -1 1 1','M0 0 A1 1 0 0 1 1','M0 0 A1 1 0 0 1 1 1 trailing','M0 0 a1 1 0 0 1 1 1','M0 0 '+'A1 1 0 0 1 1 1 '.repeat(300)])assert.throws(()=>pathPoints(d));
});

test('relative line and close commands preserve every supplied point and reject malformed input within a deadline',()=>{
 assert.deepEqual(pathPoints('M10 20 l2 -3 l-4 5 L30 40 z'),[[10,20],[12,17],[8,22],[30,40],[10,20]]);
 assert.deepEqual(pathPoints('M0 0 L10 5 L0 10 z'),[[0,0],[10,5],[0,10],[0,0]]);
 const bad=['l0 0','M0 0 l1','M0 0 l1 2 trailing','M0 0 z 1 2','M0 0 m1 2','M0 0 l1e9 0','M9999 0 l2 0','M0 0 '+'l1 1 '.repeat(513)];
 for(const raw of bad)assert.throws(()=>pathPoints(raw));
 const code=`import assert from 'node:assert/strict';const number=${number.toString()};const curvePoints=${curvePoints.toString()};const arcPoints=${arcPoints.toString()};const paths=${pathPoints.toString()};for(let i=0;i<100;i++)for(const raw of ${JSON.stringify(bad)})assert.throws(()=>paths(raw));`;
 execFileSync(process.execPath,['--input-type=module','-e',code],{timeout:5000,maxBuffer:8192,stdio:'pipe'});
});

function componentSourceAnchors(){const c=read('src/components/BncFigure.astro'),literal=c.match(/const sourceAnchors: Readonly<Record<string, string>> = Object\.freeze\((\{[\s\S]*?\})\);/u)?.[1];assert.ok(literal);const m=JSON.parse(literal);assert.deepEqual(m,sourceAnchors);assert.ok(c.includes(`if (!Object.hasOwn(sourceAnchors, url)) throw new TypeError('Unknown Bnc SVG source URL');`));assert.ok(c.includes(`.replace(/ target="_blank"/gu, ' target="_self"')`));return m;}
function renderOnlySvg(svg){const m=componentSourceAnchors();return svg.replace(/^<svg /u,'<svg style="width:100%;height:auto" ').replace(/ href="([^"]+)"/gu,(_,url)=>{assert.ok(Object.hasOwn(m,url));return ` href="${m[url]}"`;}).replace(/ target="_blank"/gu,' target="_self"');}
const restore=n=>({...n,attrs:n.attrs?.map(a=>a.name==='href'?{...a,value:inverseAnchors[a.value]}:a.name==='target'?{...a,value:'_blank'}:a),childNodes:n.childNodes?.map(restore)});
test('render-only adapter changes exactly60 citation hrefs and targets while retaining all other bytes',()=>{
 let total=0;for(const v of variants){const adapted=renderOnlySvg(v.svg),roots=htmlNodes(parse(adapted)).filter(n=>n.tagName==='svg');assert.equal(roots.length,1);const root=roots[0];assert.equal(root.attrs.find(a=>a.name==='style')?.value,'width:100%;height:auto');
 const links=htmlNodes(root).filter(n=>n.tagName==='a');assert.deepEqual(links.map(n=>Object.fromEntries(n.attrs.map(a=>[a.name,a.value]))),originalNavigation[v.key].map(a=>({...a.attributes,href:sourceAnchors[a.attributes.href],target:'_self'})));total+=links.length;
 const projection=restore({...root,attrs:root.attrs.filter(a=>a.name!=='style')});assert.equal(digest(JSON.stringify(canonical(projection))),textCorrections[v.key]?.expectedDomHash??originals[v.key].domHash);
 let inverse=adapted.replace('<svg style="width:100%;height:auto" ','<svg ').replaceAll(' target="_self"',' target="_blank"');for(const[target,url]of Object.entries(inverseAnchors))inverse=inverse.replaceAll(` href="${target}"`,` href="${url}"`);assert.equal(inverse,v.svg);}
 assert.equal(total,60);assert.equal(Object.keys(sourceAnchors).length,14);
 for(const lang of ['fr','en']){const tree=createProcessor().parse(read(`src/content/${lang==='fr'?'posts/bnc-faillites-americaines-notifications-risque':'posts-en/bnc-us-bankruptcy-notice-outage-risk'}.mdx`).replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),all=mdxNodes(tree);for(const[url,target]of Object.entries(sourceAnchors)){const found=all.filter(n=>n.name==='li'&&n.attributes.some(a=>a.name==='id'&&a.value===target.slice(1)));assert.equal(found.length,1);assert.ok(mdxNodes(found[0]).some(n=>n.name==='a'&&n.attributes.some(a=>a.name==='href'&&a.value===url)));}assert.equal(all.filter(n=>n.name==='li'&&n.attributes.some(a=>a.name==='id'&&a.value==='source-m01')).length,1);}
 for(const u of ['__proto__','https://example.org/','#source-s02'])assert.throws(()=>renderOnlySvg(`<svg ><a href="${u}"></a></svg>`));
});
test('all figure headings use concrete wording and approved labels preserve full numerical groups',()=>{
 for(const v of variants){const ns=inspect(v).nodes;for(const n of ns.filter(n=>tag(n)==='title'||tag(n)==='text'&&attrs(n)['font-weight']==='700'))assert.doesNotMatch(xmlText(n),/—|\b(?:ce que|ce qui|what\b|clocks?|horloges?)|, (?:pas|not) /iu);if(v.kind==='deadlines'&&v.lang==='en')assert.doesNotMatch(ns.filter(n=>tag(n)==='text').map(xmlText).join(' '),/clocks?/iu);}
 const fr=variants.find(v=>v.key==='filings-fr-desktop'),labels=inspect(fr).nodes.filter(n=>tag(n)==='text').map(xmlText);assert.ok(labels.includes('581 570 sur'));assert.ok(labels.includes('608 511 dossiers'));assert.ok(!labels.includes('511 dossiers'));
});
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} ≈ ${b}`);
function quantitative(v){const ns=inspect(v).nodes,labels=ns.filter(n=>tag(n)==='text').map(xmlText),has=t=>assert.ok(labels.some(s=>s.includes(t)),`${v.key}: ${t}`);
 if(v.kind==='filings'){const share=581570/608511*100;near(share,95.5726354987831);near((608511/542529-1)*100,12.16193051431352);has(v.lang==='fr'?'95,6 %':'95.6%');for(const y of ['2022','2023','2024','2025','2026'])has(y);has(v.lang==='fr'?'30 juin':'June 30');}
 if(v.kind==='backlog'){const capacity=[1,1.25,1.5,2];assert.deepEqual(capacity.map(c=>c>1?7/(c-1):null),[null,28,14,7]);has(v.lang==='fr'?'MODÈLE ILLUSTRATIF':'ILLUSTRATIVE MODEL');has('28');has('14');has('7');has('M01');const lines=ns.filter(n=>tag(n)==='line'&&['#f3bf7a','#74d6c5','#f19b87'].includes(attrs(n).stroke)&&attrs(n)['stroke-width']==='3.2');assert.equal(lines.length,3);const x0=v.mobile?56:100,xspan=v.mobile?336:716;for(const n of lines){near(value(n,'x1'),x0);const days=attrs(n).stroke==='#f3bf7a'?28:attrs(n).stroke==='#74d6c5'?14:7;near(value(n,'x2'),x0+xspan*days/28);}}
 if(v.kind==='deadlines')for(const n of ['21','70','60'])has(n);
}
test('filings share, explicit illustrative queue arithmetic and chart slopes agree',()=>{for(const v of variants)quantitative(v);});
test('quantitative and marker mutations are rejected',()=>{
 const v=variants.find(v=>v.kind==='backlog'&&!v.mobile);assert.throws(()=>quantitative(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='line'&&attrs(n)['stroke-width']==='3.2')).x2='999';})));
 assert.throws(()=>faithful(mutate(variants[0],(_,ns)=>{attrs(ns.find(n=>tag(n)==='marker')).markerUnits='strokeWidth';})));
});
