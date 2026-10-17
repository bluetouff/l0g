import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLBuilder, XMLParser, XMLValidator } from 'fast-xml-parser';
import { parse } from 'parse5';
import { createProcessor } from '@mdx-js/mdx';
import postcss from 'postcss';
import { franceDebtSvg, FRANCE_DEBT_KINDS } from '../src/lib/franceDebtFigures.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Independent complete supplied XML, browser DOM and attribute-tree goldens.
const originals={
  "auction-fr-desktop": {
    "rawHash": "988d9d1a5e777c6cec42b05f9da8d191e9049df13a6607ae320189b074938026",
    "domHash": "5a33ee41f609eafdad4b7d1bf26a0e934013ce87b9db03fdb50999b184f15ca4",
    "geometryHash": "94a0ce186eb52cc59c5c36ec527587d2e4507248ea3fe0fcdf1e28f8825f477b",
    "viewBox": "0 0 1120 635"
  },
  "auction-fr-mobile": {
    "rawHash": "67e29c1daee82394252132c39917c6535c7daf2f95e08f8c9170fd95d26c6f69",
    "domHash": "575e24de9bc2e958408e60d4c6ae1e549ecaa8735d05b5ceb9bac6ff33914644",
    "geometryHash": "9f73da133c8382f23b1099f218482227a55d5ff3d296a864b5f0f761214bb82b",
    "viewBox": "0 0 560 910"
  },
  "structure-fr-desktop": {
    "rawHash": "9485f8d0b2b29216460001cec02cde52aeea877e5824c49b830b45d10b2b326d",
    "domHash": "b3c15a87c84f29e8a1c30606848e76af9bb291aad318ea73686aa60729a84588",
    "geometryHash": "aae76fd618565226cd44e6387ed559f6138ce988b203d6ebe04b32b889bf94c0",
    "viewBox": "0 0 1120 650"
  },
  "structure-fr-mobile": {
    "rawHash": "47ce0b191a15ab7467d9be5ca12069f4d21b924d229061b054e86c6b7b35e747",
    "domHash": "b04e151761aa4739470307abddc44d271ef5203157479fa3cbb576c13be5cd98",
    "geometryHash": "f8fad61b0eb6b8ababb7db5a06923cd2597796628e3b23aa09eb5607e7104ff4",
    "viewBox": "0 0 560 900"
  },
  "maturities-fr-desktop": {
    "rawHash": "70863cc498f4571152969d6e8418c4d97e0b0ecb13fd54d5f0aeffef89d744c9",
    "domHash": "ce0a340bd1af2472d3bd8378a3d46a12eb5ef1b62028c1f9cff1890b786e1ae6",
    "geometryHash": "62b2947dff2a73854c14e31b1ac23039f3cdde1ae6468497736b6fa1c55efe69",
    "viewBox": "0 0 1120 780"
  },
  "maturities-fr-mobile": {
    "rawHash": "e591b6e038fa15d6a9a7fba454ded577232ce86f104f15a23c4757cd607da738",
    "domHash": "0b36f32e8ae68f314751c490ed88fc0d6d26822bb806b80058b610bc43a7eae1",
    "geometryHash": "258f3f8ae21ba81c77a72a05414a161b1e33be1c1060364885744c7b2b50daa1",
    "viewBox": "0 0 560 1030"
  },
  "cohorts-fr-desktop": {
    "rawHash": "7465a58b66cb8a19d61d17fb633fc5a52b58659c641144707da520c92764211e",
    "domHash": "536f914666b93d1bfb0af53c42612a6d221dd442a31b218d33550d565828a844",
    "geometryHash": "f580c766210f2b1c0998b8dc6763d9325c529cf3d08fc3280afc6a1b1a75ad0d",
    "viewBox": "0 0 1120 830"
  },
  "cohorts-fr-mobile": {
    "rawHash": "6e28f049b73c91fc00082fbb77383b29033989db0bf39fd2da3f38ecc092734b",
    "domHash": "a840a02ced160eb22552a5f16c263e3dec6d8590a08788266825365428dd1645",
    "geometryHash": "2853dc4dd7e7ce06fc3679a68f4149308d2e15bc1c6a311e7b7b8e985969cf5a",
    "viewBox": "0 0 560 1120"
  },
  "financing-fr-desktop": {
    "rawHash": "c88a42ff37efffaf11e7cee2a1bda2fbeade48832ed3fe8e6b5ce7450a372bc4",
    "domHash": "bf5bcbdf9b4f819b973a16a46adcfe9336a5ba8a47b713bfcc7d91c05e2144e2",
    "geometryHash": "6061a7f276ba25fd567ba9a9dfa754caf45ad56205a071b652af5ac4279805cc",
    "viewBox": "0 0 1120 680"
  },
  "financing-fr-mobile": {
    "rawHash": "fcdd6700ed0c382237ac2bb0af52a5d7f6b16b1a259a42afaffc5547242b712c",
    "domHash": "f5281cd4d4afe7d00ee25908cf02523ee64032e88d031122467636a1836e678e",
    "geometryHash": "3ec493ef992043bcb61244239e4fdb96c47b1839a9dc6f3c6b18ab529ae1a025",
    "viewBox": "0 0 560 1010"
  },
  "indexation-fr-desktop": {
    "rawHash": "af9d23067a49c7ef4e07c53d32b869620ad7615359660acb1df8e01b4893ca07",
    "domHash": "7e0606d1e12a191b4068a51b04ff1fde726a444b1f2548d5acaad13bb6dab09e",
    "geometryHash": "fca872aa292c3c19e34092544f0d0276a7540d2d34ca9618285ba24c3bca1a81",
    "viewBox": "0 0 1120 775"
  },
  "indexation-fr-mobile": {
    "rawHash": "aec796a15198f72b205c18ef9de0ff977eeb33569039f783eadf9e81b10180af",
    "domHash": "099686e3c81d7a76d7c23fb5215e4d7e5ebd966dd90da588da34bd8cd0e6044e",
    "geometryHash": "9252523116993e7e49db3d04e716b51922e3ffe42c5b416d7a00410c21592100",
    "viewBox": "0 0 560 1080"
  },
  "auction-en-desktop": {
    "rawHash": "8e436c145b6e443b61dad098f32e13321f0af86f875165c534574532350deb4c",
    "domHash": "b8e44ae3a8141b8bc24d99121e75dd7a072f7c51dd5cc2e623f98c25bf32af18",
    "geometryHash": "c3ba7709fdf1a90382129d40404c9b3090799e48adf8e29a2fa325dc0c60f131",
    "viewBox": "0 0 1120 635"
  },
  "auction-en-mobile": {
    "rawHash": "888c58563b0cde9506c34d1b54acf7609bbbda5343d5fd1ce75b1a3035b9e876",
    "domHash": "8590a116ac534149937e869a15c869ee0d1713a72dd163680ca776bd3657656b",
    "geometryHash": "ff7c20739fc3656938547a6b01ba6ffa53e7bc1d74e2b01e2ba7798c23bd3373",
    "viewBox": "0 0 560 910"
  },
  "structure-en-desktop": {
    "rawHash": "d513c89447f3d9093943799741112de492108a1dd02dd242b5463b17ba42224c",
    "domHash": "f7fabedd02e375308bbd90608ffe57bc22f9b579e9012c4e626431bedcfcb221",
    "geometryHash": "795bfa690d149d657ab22149f00aa617b725873e8eab264391c579ec90c4e1f3",
    "viewBox": "0 0 1120 650"
  },
  "structure-en-mobile": {
    "rawHash": "27c14dd0f6f501180f60a3884b7418b3f3e1ab7e350ec52ce4c91ba68009f556",
    "domHash": "35c78fe9aff32f18c80b350d8c57f7b5c938471f2c00d9254f9b7b31efacc91d",
    "geometryHash": "ac8073f5256085ed0af5eadbd50d0048a15af7187e248f85c55cb7ea8cf0cd87",
    "viewBox": "0 0 560 900"
  },
  "maturities-en-desktop": {
    "rawHash": "6735e055900186ee4f088f615af7c7e0d3c9d91dfc7b1d101fc9217b7ae7b472",
    "domHash": "70400f4f08c700fa67e8df482b9289ca4714be73efbe72fc49ffea8f61458f9b",
    "geometryHash": "8fa284c0481121a3258e6bdeee1ebf664af487819dd619323b56e1e06e36f8c9",
    "viewBox": "0 0 1120 780"
  },
  "maturities-en-mobile": {
    "rawHash": "1d6e7e6d9f390b209d5840b2e98d7e7c7a9b197ade61cc091aa93f27b0afe238",
    "domHash": "300212d71a6ec7cb7bfcc6e1347b6b006cd910e069fd3d7b7ca4dd9d7f28454c",
    "geometryHash": "cba1d3b1cde6eaa99131a7caf035c469f194a2f9932031d163d955a335357805",
    "viewBox": "0 0 560 1030"
  },
  "cohorts-en-desktop": {
    "rawHash": "5d64492860dc1508d4424c62b4dfaec262a889e4bc27b00af85068dc671eb523",
    "domHash": "63c68e5765ed0fd86a2fcd352757dd3f0c9648e6b540e8e4260ad361a29513b4",
    "geometryHash": "11c04fc8f15c7e6d4c9779e9e8bf4106199fe68fda504781e13085ab2c956098",
    "viewBox": "0 0 1120 830"
  },
  "cohorts-en-mobile": {
    "rawHash": "012b305b2402bff82822d4f26cc0f94740a8ac34b0f8c79abbbfcd970f7200d3",
    "domHash": "cb741665687a4dc0573e64e45c3be66ceabb9d1a72a7ec9c1edea1b9c4241bce",
    "geometryHash": "6c96de458f4bf2a8ceeca18dff84a20a037cdd0fbc7134af4dd7888f06277e72",
    "viewBox": "0 0 560 1120"
  },
  "financing-en-desktop": {
    "rawHash": "910596c77d6f871c400eefed2109c3c5cc643ca064c65b534ae1b77a64cac712",
    "domHash": "f76a043c832c027b533aa352bea9e00d31c02385665994da84360ededde8e9b2",
    "geometryHash": "24fa1a7f6dfcf13babdfd695507ccc627f162cf8a75969561ea216fd3b1d3b8e",
    "viewBox": "0 0 1120 680"
  },
  "financing-en-mobile": {
    "rawHash": "95e6925ff3b57d32cf64b2331c4876a77bfb2dc87c0fb6f15a8f76e3d9160e80",
    "domHash": "1a3f3ef0bd2d332335a8bc54ddcc9f249b72aad8e64b9d892883f16f2da6fc08",
    "geometryHash": "0236055a6e4dcfa86ce250aa28519b3533ba83dc73a6d03ab0bada9f8376792e",
    "viewBox": "0 0 560 1010"
  },
  "indexation-en-desktop": {
    "rawHash": "cfef149b3c7864e5ae4325c7b49e87c496286a01800067057c40420d33c097ca",
    "domHash": "d5f38135348860aae0a0c61f6ff0fab6a9e389dc321e5b752a8d66031895e73b",
    "geometryHash": "003b026718754bed82352fb31ebd67dc1553acce40311ca3ca627530c53a41d6",
    "viewBox": "0 0 1120 775"
  },
  "indexation-en-mobile": {
    "rawHash": "939e061ab4cd9a8486ef90356e6fae367c12727b1466055b4e8840156173951f",
    "domHash": "18094887822403c8451f6ed6bf77d901cfb6749f4f66696c960c338ee3279164",
    "geometryHash": "3a603887806d597a350f3c50c3d5d10cd840e53c530c399a645d9b9701b53b6b",
    "viewBox": "0 0 560 1080"
  }
};
const textCorrections={
  "indexation-fr-desktop": {
    "pairs": [
      [
        "<title id=\"dette-fr-06-d-title\">L’inflation a deux dates : la charge et le paiement</title>",
        "<title id=\"dette-fr-06-d-title\">Indexation : charge et remboursement</title>",
        1
      ],
      [
        "<text x=\"40\" y=\"80\" font-size=\"31\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >L’inflation a deux dates : la charge et le paiement</text>",
        "<text x=\"40\" y=\"80\" font-size=\"31\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >Indexation : charge et remboursement</text>",
        1
      ]
    ],
    "expectedHash": "5e6bc78f25b493f0878d4a8d79ef7521987d178ea4db51b73d72e95a56360b07",
    "expectedDomHash": "7e4971f483292064ac020525de5447973a2f9e3e741da41a1b4c5fbc4ab8e077"
  },
  "indexation-fr-mobile": {
    "pairs": [
      [
        "<title id=\"dette-fr-06-m-title\">L’inflation a deux dates : la charge et le paiement</title>",
        "<title id=\"dette-fr-06-m-title\">Indexation : charge et remboursement</title>",
        1
      ],
      [
        "<text x=\"28\" y=\"82\" font-size=\"30\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >L’inflation a deux dates :</text>",
        "<text x=\"28\" y=\"82\" font-size=\"30\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >Indexation : charge</text>",
        1
      ],
      [
        "<text x=\"28\" y=\"118\" font-size=\"30\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >la charge et le paiement</text>",
        "<text x=\"28\" y=\"118\" font-size=\"30\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >et remboursement</text>",
        1
      ]
    ],
    "expectedHash": "78fb64e3067049e9e5b67fc1b6bb68c4c7dd749a011ffcbef9574fdd855ae163",
    "expectedDomHash": "74e3628c88489e488c12373a21f7dedca32809443455f877f49bb9ad03624cc9"
  },
  "indexation-en-desktop": {
    "pairs": [
      [
        "<title id=\"dette-en-06-d-title\">Inflation has two dates: expense and payment</title>",
        "<title id=\"dette-en-06-d-title\">Indexation: accrual and redemption</title>",
        1
      ],
      [
        "<text x=\"40\" y=\"80\" font-size=\"31\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >Inflation has two dates: expense and payment</text>",
        "<text x=\"40\" y=\"80\" font-size=\"31\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >Indexation: accrual and redemption</text>",
        1
      ]
    ],
    "expectedHash": "810b325732c816a31fc932af9327caf9cb773c09fb37ce853f4c15344a8e7117",
    "expectedDomHash": "03c9098bc51afc9818a758dde3c579c715dc8d4c0fcd3a7acc5ad6be71030f4c"
  },
  "indexation-en-mobile": {
    "pairs": [
      [
        "<title id=\"dette-en-06-m-title\">Inflation has two dates: expense and payment</title>",
        "<title id=\"dette-en-06-m-title\">Indexation: accrual and redemption</title>",
        1
      ],
      [
        "<text x=\"28\" y=\"82\" font-size=\"30\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >Inflation has two dates:</text>",
        "<text x=\"28\" y=\"82\" font-size=\"30\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >Indexation: accrual</text>",
        1
      ],
      [
        "<text x=\"28\" y=\"118\" font-size=\"30\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >expense and payment</text>",
        "<text x=\"28\" y=\"118\" font-size=\"30\" fill=\"#143247\" font-weight=\"700\" text-anchor=\"start\" >and redemption</text>",
        1
      ]
    ],
    "expectedHash": "68c839571a75ef9d14e166f328a15fb01404edc9b1a7d5473454ba42e466a406",
    "expectedDomHash": "8b202a7a88b31675e1bf06ea3a910529bfd48d1860eeefa9ad0c37dc984ac0e2"
  }
};
const kinds=["auction", "structure", "maturities", "cohorts", "financing", "indexation"];
const variants=['fr','en'].flatMap(lang=>kinds.flatMap(kind=>[false,true].map(mobile=>({lang,kind,mobile,key:`${kind}-${lang}-${mobile?'mobile':'desktop'}`,svg:franceDebtSvg(lang,kind,mobile)}))));
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
  const token = /[MLHVZCQTA]|-?(?:\d{1,4}(?:\.\d{1,18})?|\.\d{1,18})/uy;
  const tokens = []; let offset = 0;
  while (offset < raw.length) {
    if (/\s/u.test(raw[offset])) { offset++; continue; }
    token.lastIndex = offset; const match = token.exec(raw); assert.ok(match, 'Complete path token');
    tokens.push(match[0]); assert.ok(tokens.length <= 2048); offset = token.lastIndex;
  }
  assert.equal(tokens[0], 'M'); const points = []; let i = 0, current, origin, quadraticControl, count = 0, repeat;
  const pair = () => [number(tokens[i++]), number(tokens[i++])];
  while (i < tokens.length) {
    const command = /^[MLHVZCQTA]$/u.test(tokens[i]) ? tokens[i++] : repeat; assert.ok(['M', 'L', 'H', 'V', 'Z', 'C', 'Q', 'T', 'A'].includes(command));
    assert.ok(++count <= 512); repeat = command === 'M' ? 'L' : command === 'Z' ? undefined : command;
    if (command === 'Z') { assert.ok(origin); current = [...origin]; quadraticControl = undefined; }
    else if (command === 'M' || command === 'L') {
      if (command === 'L') assert.ok(current);
      current = pair(); quadraticControl = undefined;
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
const allowed=Object.fromEntries(Object.entries({
 svg:'xmlns width height viewBox role aria-labelledby lang',title:'id',desc:'id',defs:'',
 pattern:'id width height patternUnits',g:'font-family',
 rect:'x y width height rx fill',path:'d fill stroke stroke-width',
 text:'x y font-size fill font-weight text-anchor',line:'x1 y1 x2 y2 stroke stroke-width',
 polygon:'points fill',polyline:'points fill stroke stroke-width',circle:'cx cy r fill',
}).map(([k,v])=>[k,new Set(v?v.split(' '):[])]));
const palette=new Set(['#f3e3d8','#aa502b','#f7f7f2','#137976','#143247','#526873','#216595','#ffffff','#ced8d9']);
const numeric=new Set('x y width height rx x1 y1 x2 y2 font-size stroke-width cx cy r'.split(' '));
function number(value){assert.equal(typeof value,'string');assert.ok(value.length>0&&value.length<=32);assert.match(value,/^-?(?:\d{1,4}(?:\.\d{1,18})?|\.\d{1,18})$/u);const n=Number(value);assert.ok(Number.isFinite(n)&&Math.abs(n)<=10000);return n;}
const value=(n,k,fallback='0')=>number(attrs(n)[k]??fallback);
function pointPairs(raw){
 assert.equal(typeof raw,'string');assert.ok(raw.length>0&&raw.length<=8192);assert.equal(raw.trim(),raw);
 const pairs=raw.split(/\s+/u);assert.ok(pairs.length>=2&&pairs.length<=512);
 return pairs.map(pair=>{const numbers=pair.split(',');assert.equal(numbers.length,2);return numbers.map(number);});
}
function inspect(v){
 assert.equal(typeof v.svg,'string');assert.ok(v.svg.length>100&&v.svg.length<40000);assert.doesNotMatch(v.svg,/<!|<\?|&(?!amp;|lt;|gt;|quot;|apos;)/u);assert.equal(XMLValidator.validate(v.svg),true);
 const roots=parser.parse(v.svg);assert.equal(roots.length,1);const root=roots[0];assert.equal(tag(root),'svg');
 const index=String(kinds.indexOf(v.kind)+1).padStart(2,'0'),prefix=`dette-${v.lang}-${index}-${v.mobile?'m':'d'}`,[,,width,height]=originals[v.key].viewBox.split(' ').map(number);
 assert.deepEqual(attrs(root),{xmlns:'http://www.w3.org/2000/svg',width:String(width),height:String(height),viewBox:originals[v.key].viewBox,role:'img','aria-labelledby':`${prefix}-title ${prefix}-desc`,lang:v.lang});
 const nodes=xmlNodes(root);assert.ok(nodes.length<512);const ids=[];
 for(const n of nodes){
  assert.ok(Object.hasOwn(allowed,tag(n)),`Passive tag ${tag(n)}`);
  for(const[k,val]of Object.entries(attrs(n))){
   assert.ok(allowed[tag(n)].has(k),`Known field ${tag(n)}.${k}`);assert.equal(typeof val,'string');assert.ok(val.length<=8192);
   if(numeric.has(k)){const num=number(val);if(['width','height','rx','r','stroke-width'].includes(k))assert.ok(num>=0);}
   if(k==='fill'||k==='stroke')assert.ok(val==='none'||palette.has(val)||(tag(n)==='rect'&&k==='fill'&&val===`url(#${prefix}-hatch)`),`Passive local paint ${val}`);
   if(k==='id'){assert.ok(['title','desc','hatch'].some(s=>val===`${prefix}-${s}`));ids.push(val);}
   if(k==='font-family')assert.equal(val,'Arial, Helvetica, sans-serif');
   if(k==='font-weight')assert.ok(['400','700'].includes(val));
   if(k==='font-size')assert.ok(number(val)>=12&&number(val)<=80);
   if(k==='text-anchor')assert.ok(['start','middle','end'].includes(val));
   if(k==='d')pathPoints(val);if(k==='points')pointPairs(val);
  }
  if(tag(n)==='pattern'){
   assert.deepEqual(attrs(n),{id:`${prefix}-hatch`,width:'9',height:'9',patternUnits:'userSpaceOnUse'});assert.equal(children(n).length,2);
   assert.deepEqual(children(n).map(tag),['rect','path']);assert.deepEqual(attrs(children(n)[0]),{width:'9',height:'9',fill:'#f3e3d8'});
   assert.deepEqual(attrs(children(n)[1]),{d:'M-2,2 L2,-2 M0,9 L9,0 M7,11 L11,7',stroke:'#aa502b','stroke-width':'1.2'});
  }
  if(tag(n)==='text')assert.ok(children(n).length===1&&tag(children(n)[0])==='#text');
 }
 assert.equal(new Set(ids).size,3);assert.equal(ids.length,3);
 for(const type of ['title','desc','defs','g']){const found=nodes.filter(n=>tag(n)===type);assert.equal(found.length,1);if(['title','desc'].includes(type))assert.ok(xmlText(found[0]).trim());}
 assert.deepEqual(attrs(nodes.find(n=>tag(n)==='g')),{'font-family':'Arial, Helvetica, sans-serif'});
 return{root,nodes,width,height};
}
function faithful(v){
 inspect(v);let original=v.svg;const correction=textCorrections[v.key];
 if(correction){assert.equal(digest(v.svg),correction.expectedHash);assert.equal(domHash(v.svg),correction.expectedDomHash);for(const[before,after,count]of [...correction.pairs].reverse()){assert.equal(original.split(after).length-1,count);original=original.replaceAll(after,before);}}
 assert.equal(digest(original),originals[v.key].rawHash,`${v.key}: complete supplied XML after exact approved inverse`);assert.equal(domHash(original),originals[v.key].domHash,`${v.key}: complete supplied browser tree`);
 const projection=n=>tag(n)==='#text'?null:[tag(n),Object.entries(attrs(n)).sort(),children(n).filter(n=>tag(n)!=='#text').map(projection)];
 assert.equal(digest(JSON.stringify(projection(parser.parse(v.svg)[0]))),originals[v.key].geometryHash,`${v.key}: every supplied attribute and element order`);
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
  if (['polygon','polyline'].includes(tag(n))) return pointsBox(pointPairs(attrs(n).points));
}
function scene(n) { return ['#text','defs'].includes(tag(n)) ? [] : [n,...children(n).flatMap(scene)]; }
function geometry(v) {
 const {root,width,height}=inspect(v),canvas={x:0,y:0,right:width,bottom:height};
 for(const n of scene(root)){
  if(['rect','circle','line','path','polygon','polyline'].includes(tag(n))){const b=shapeBox(n),s=attrs(n).stroke&&attrs(n).stroke!=='none'?value(n,'stroke-width','1')/2:0;assert.ok(within({x:b.x-s,y:b.y-s,right:b.right+s,bottom:b.bottom+s},canvas,.01),'shape outside viewBox');}
  if(tag(n)==='text'){const x=value(n,'x'),y=value(n,'y');assert.ok(x>=0&&x<=width&&y>=0&&y<=height,'text anchor outside viewBox');}
 }
}

test('France debt variant selection is frozen, complete and rejects coercion or prototypes',()=>{
 assert.deepEqual(FRANCE_DEBT_KINDS,kinds);assert.ok(Object.isFrozen(FRANCE_DEBT_KINDS));assert.equal(variants.length,24);
 for(const lang of ['', 'FR','__proto__','constructor',{},null,['fr']])assert.throws(()=>franceDebtSvg(lang,'auction',false),TypeError);
 for(const kind of ['', '__proto__','constructor','prototype',{},null,['auction']])assert.throws(()=>franceDebtSvg('fr',kind,false),TypeError);
 for(const mobile of [0,1,'','false',null,new Boolean(false),{},[]])assert.throws(()=>franceDebtSvg('fr','auction',mobile),TypeError);
 assert.equal(franceDebtSvg('fr','auction'),franceDebtSvg('fr','auction',false));
});
test('all24 complete supplied XML trees are recovered by the exact approved inverse mapping',()=>{for(const v of variants)faithful(v);});
test('native shape bounds and text anchors remain in viewBoxes; browser QA measures actual platform glyphs',()=>{for(const v of variants)geometry(v);});
test('static checks reject off-canvas source shapes, coordinate lists and text anchors',()=>{
 const v=variants[0];for(const change of [(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).x='9999';},(_,ns)=>{attrs(ns.find(n=>tag(n)==='text')).x='-10';}])assert.throws(()=>geometry(mutate(v,change)));
 const cohort=variants.find(v=>v.kind==='cohorts'&&!v.mobile&&v.lang==='fr');assert.ok(cohort);
 for(const type of ['polygon','polyline'])assert.throws(()=>geometry(mutate(cohort,(_,ns)=>{attrs(ns.find(n=>tag(n)===type)).points='0,0 9999,9999';})));
});
test('full XML goldens reject geometry, text, colour, root fields and child-order changes',()=>{
 const v=variants[0];for(const change of [(_,ns)=>{attrs(ns.find(n=>tag(n)==='text')).x='0';},(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).fill='var(--panel)';},(_,ns)=>{ns.find(n=>tag(n)==='title').title=[{'#text':'Changed'}];},(_,ns)=>{attrs(ns.find(n=>tag(n)==='pattern')).width='10';},root=>{root.svg.reverse();}])assert.throws(()=>faithful(mutate(v,change)));
});
test('passive SVG validator rejects active markup, external resources and malformed fields',()=>{
 const v=variants[0];for(const type of ['script','foreignObject','image','use','a','animate','filter','style','metadata','tspan','marker'])assert.throws(()=>inspect(mutate(v,root=>{root.svg.push({[type]:[]});})));
 for(const[field,val]of [['onload','alert(1)'],['href','https://example.org/'],['xlink:href','javascript:alert(1)'],['constructor','x'],['prototype','x'],['transform','translate(0 0)'],['style','fill:red'],['font-family','Other'],['font-size','Infinity'],['x','1e999'],['x','10001']])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='text'))[field]=val;})));
 for(const val of ['url(#x)','url(https://example.org/x)','var(--bg,red)','#fff','red'])assert.throws(()=>inspect(mutate(v,(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect')).fill=val;})));
 for(const raw of ['<!DOCTYPE svg><svg/>','<?xml version="1.0"?><svg/>','<svg>&external;</svg>','<svg>&#65;</svg>','<svg><text></svg>',v.svg.replace('<text ','<text __proto__="x" ')])assert.throws(()=>inspect({...v,svg:raw}));
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
 const component=read('src/components/FranceDebtFigure.astro'),style=component.match(/<style>([\s\S]*?)<\/style>/u)?.[1];assert.ok(style);
 const css=postcss.parse(style),decl=n=>Object.fromEntries(n.nodes.filter(d=>d.type==='decl').map(d=>[d.prop,d.value]));
 const rule=selector=>{const n=css.nodes.find(n=>n.type==='rule'&&n.selector===selector);assert.ok(n,selector);return decl(n);};
 const mapping={'#f7f7f2':'ink','#f3e3d8':'surface-2','#143247':'paper','#526873':'muted','#137976':'signal','#216595':'topic-blue','#aa502b':'amber','#ced8d9':'line-strong'};
 for(const[colour,variable]of Object.entries(mapping))assert.deepEqual(rule(`.france-debt-figure :global([fill="${colour}"])`),{fill:`var(--color-${variable})`});
 assert.deepEqual(rule('.france-debt-figure :global(rect[fill="#ffffff"])'),{fill:'var(--color-surface)'});assert.deepEqual(rule('.france-debt-figure :global(text[fill="#ffffff"])'),{fill:'var(--color-ink)'});
 for(const colour of ['#137976','#216595','#aa502b','#ced8d9'])assert.deepEqual(rule(`.france-debt-figure :global([stroke="${colour}"])`),{stroke:`var(--color-${mapping[colour]})`});
 const base=rule('.france-debt-figure');assert.deepEqual([base.width,base['max-width'],base['container-type'],base['padding-bottom'],base.overflow],['100%','760px','inline-size','.85rem','visible']);
 const graphic=rule('.france-debt-figure :global(svg)');assert.deepEqual([graphic.width,graphic.height,graphic['max-width'],graphic['letter-spacing'],graphic.overflow],['100%','auto','100%','normal','visible']);
 const mobile=rule('.france-debt-mobile');assert.deepEqual([mobile.display,mobile.width,mobile['max-width'],mobile['margin-inline']],['none','100%','420px','auto']);
 assert.equal(css.nodes.filter(n=>n.type==='atrule'&&n.name==='font-face').length,0);css.walkDecls('font-family',()=>assert.fail('Keep the supplied Arial/Helvetica group stack'));assert.doesNotMatch(component,/@font-face|\/fonts\//u);
 for(const name of ['media','container']){const n=css.nodes.find(n=>n.type==='atrule'&&n.name===name&&n.params==='(max-width: 640px)');assert.ok(n);assert.deepEqual(n.nodes.map(n=>[n.selector,decl(n).display]),[['.france-debt-desktop','none'],['.france-debt-mobile','block']]);}
 const themes={dark:new Map(),light:new Map()};postcss.parse(read('src/styles/global.css')).walkDecls(d=>{if((d.parent.type==='atrule'&&d.parent.name==='theme')||(d.parent.type==='rule'&&d.parent.selector===':root'))themes.dark.set(d.prop,d.value);if(d.parent.type==='rule'&&d.parent.selector===':root[data-theme="light"]')themes.light.set(d.prop,d.value);});
 for(const theme of Object.values(themes))for(const v of [...Object.values(mapping),'surface'])assert.ok(theme.has(`--color-${v}`));
 css.walkDecls(d=>assert.doesNotMatch(d.value,/#(?:[a-f0-9]{3}){1,2}\b|url\(/iu));assert.doesNotMatch(style,/clip-path|overflow\s*:\s*(?:hidden|clip)|transform\s*:|100vw/iu);
 assert.equal((component.match(/set:html=/gu)??[]).length,2);assert.ok(component.includes(`const responsiveSvg = (mobile: boolean) => franceDebtSvg(lang, kind, mobile).replace(/^<svg /u, '<svg style="width:100%;height:auto" ');`));
 assert.ok(component.includes('id={`figure-${number}`}'));assert.doesNotMatch(component,/<script|client:|fetch\(|innerHTML/u);
});


const mdxNodes=n=>[n,...(n.children??[]).flatMap(mdxNodes)];
const figureSources={"auction": "03 04 m1", "structure": "02 m1", "maturities": "07 10 14", "cohorts": "07 m1", "financing": "06", "indexation": "06 12"};
function articleFigures(raw,lang){
 const tree=createProcessor().parse(raw.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/u,'')),nodes=mdxNodes(tree),figures=nodes.filter(n=>n.name==='FranceDebtFigure');assert.equal(figures.length,6);
 const imports=nodes.filter(n=>n.type==='mdxjsEsm');assert.equal(imports.length,1);assert.match(imports[0].value,/^import FranceDebtFigure from ['"]\.\.\/\.\.\/components\/FranceDebtFigure\.astro['"];?$/u);
 for(const[i,n]of figures.entries()){
  const a=Object.fromEntries(n.attributes.map(a=>{assert.equal(a.type,'mdxJsxAttribute');assert.equal(typeof a.value,'string');return[a.name,a.value];}));
  assert.deepEqual(Object.keys(a).sort(),['caption','kind','lang','number','sources']);assert.equal(a.kind,kinds[i]);assert.equal(a.number,String(i+1).padStart(2,'0'));assert.equal(a.lang,lang);assert.ok(a.caption.length>70);
  assert.equal(a.sources,figureSources[kinds[i]]);const details=mdxNodes(n).filter(c=>c.name==='details');assert.equal(details.length,1);assert.equal(mdxNodes(details[0]).filter(c=>c.name==='summary').length,1);
  const note=mdxNodes(details[0]).filter(c=>c.type==='text').map(c=>c.value).join(' ');assert.ok(note.length>100);
 }
}
test('article native MDX includes six ordered static figures, verified references and method notes',()=>{
 for(const lang of ['fr','en'])articleFigures(read(`src/content/${lang==='fr'?'posts/dette-francaise-refinancement-calendrier-taux':'posts-en/france-debt-refinancing-maturity-interest-costs'}.mdx`),lang);
});
test('article figure contract rejects reordered, dynamic and incomplete source or method declarations',()=>{
 const raw=read('src/content/posts/dette-francaise-refinancement-calendrier-taux.mdx');
 for(const [before,after]of [['kind="auction"','kind="structure"'],['number="01"','number="02"'],['sources="03 04 m1"','sources="03 04"'],['lang="fr"','lang={"fr"}'],['<details>','<aside>']]){assert.ok(raw.includes(before),before);assert.throws(()=>articleFigures(raw.replace(before,after),'fr'));}
});
test('comma-delimited coordinate pairs are consumed completely without accepting malformed comma runs',()=>{
 assert.deepEqual(pathPoints('M 1,2 L 3,4 L 5,-6'),[[1,2],[3,4],[5,-6]]);
 for(const d of ['M,1 2','M1,,2','M1, 2','M1 2,','M1 2 L,3 4','M1 2 , L3 4'])assert.throws(()=>pathPoints(d));
});
test('the static root adapter adds exactly the responsive style and preserves the complete passive SVG tree',()=>{
 const component=read('src/components/FranceDebtFigure.astro');assert.ok(component.includes(`const responsiveSvg = (mobile: boolean) => franceDebtSvg(lang, kind, mobile).replace(/^<svg /u, '<svg style="width:100%;height:auto" ');`));
 for(const v of variants){const adapted=v.svg.replace(/^<svg /u,'<svg style="width:100%;height:auto" '),roots=htmlNodes(parse(adapted)).filter(n=>n.tagName==='svg');assert.equal(roots.length,1);const root=roots[0];assert.equal(root.attrs.filter(a=>a.name==='style').length,1);assert.equal(root.attrs.find(a=>a.name==='style').value,'width:100%;height:auto');const projection={...root,attrs:root.attrs.filter(a=>a.name!=='style')};assert.equal(digest(JSON.stringify(canonical(projection))),textCorrections[v.key]?.expectedDomHash??originals[v.key].domHash);assert.equal(adapted.replace('<svg style="width:100%;height:auto" ','<svg '),v.svg);}
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
test('all 24 title surfaces preserve concrete framing and the four approved indexation headings',()=>{
 for(const v of variants){const ns=inspect(v).nodes,title=xmlText(ns.find(n=>tag(n)==='title'));assert.doesNotMatch(title,/—|\b(?:ce que|ce qui|what\b|two clocks|different clocks|deux horloges|2 horloges)|, (?:pas|not) /iu);
  if(v.kind==='indexation'){assert.equal(title,v.lang==='fr'?'Indexation : charge et remboursement':'Indexation: accrual and redemption');const labels=ns.filter(n=>tag(n)==='text').map(xmlText);for(const text of v.mobile?(v.lang==='fr'?['Indexation : charge','et remboursement']:['Indexation: accrual','and redemption']):[title])assert.ok(labels.includes(text));}
 }
});
test('polygon/polyline coordinate lists consume every field and reject malformed or excessive input',()=>{
 assert.deepEqual(pointPairs('1.00,2.00 -3.5,4 5,-6'),[[1,2],[-3.5,4],[5,-6]]);
 const invalid=['','1,2','1,2 3','1,2 3,4,5','1,2 3,,4','1,2 NaN,4','1,2 1e999,4','1,2 10001,4',' 1,2 3,4','1,2 3,4 ', '1,2 '.repeat(512)+'3,4'];
 for(const raw of [...invalid,null,{},[],0])assert.throws(()=>pointPairs(raw));
 const code=`import assert from 'node:assert/strict';const number=${number.toString()};const points=${pointPairs.toString()};for(let i=0;i<100;i++)for(const raw of ${JSON.stringify(invalid)})assert.throws(()=>points(raw));`;
 execFileSync(process.execPath,['--input-type=module','-e',code],{timeout:5000,maxBuffer:8192,stdio:'pipe'});
});

const near=(actual,expected,tolerance=1e-7)=>assert.ok(Math.abs(actual-expected)<=tolerance,`${actual} ≈ ${expected}`);
function quantitativeGeometry(v){
 const{root,nodes}=inspect(v),visible=scene(root),rects=visible.filter(n=>tag(n)==='rect'),labels=nodes.filter(n=>tag(n)==='text').map(xmlText);
 const has=literal=>assert.ok(labels.some(t=>t.includes(literal)),`${v.key}: ${literal}`);
 const coloured=colour=>rects.find(n=>attrs(n).fill===colour),axisWidth=v.mobile?504:1040;
 if(v.kind==='auction'){
  const face=2337000000,price=.8145,proceeds=face*price,discount=face-proceeds;near(proceeds,1903486500);near(discount,433513500);
  const width=v.mobile?504:1000;near(value(coloured('#216595'),'width'),width*price);near(value(coloured('#f3e3d8'),'width'),width*(1-price));near(value(coloured('#216595'),'width')+value(coloured('#f3e3d8'),'width'),width);
  has(v.lang==='fr'?'81,45':'81.45');has(v.lang==='fr'?'433,5':'433.5');has(v.lang==='fr'?'4,10':'4.10');has(v.lang==='fr'?'2031':'2031');
 }
 if(v.kind==='structure'){
  const bills=217658000000,total=2896181146497,share=bills/total;near(share*100,7.51534482790424);
  near(value(coloured('#137976'),'width'),axisWidth*share);near(value(coloured('#216595'),'width'),axisWidth*(1-share));near(value(coloured('#137976'),'width')+value(coloured('#216595'),'width'),axisWidth);
  has('129');has(v.lang==='fr'?'217,658':'217.658');has(v.lang==='fr'?'8 ans':'8 years');
 }
 if(v.kind==='maturities'){
  const amounts=[35.818,38.944,30.59765331,30.797,60.083],bars=rects.filter(n=>Number(attrs(n).height)===(v.mobile?35:39)),scale=v.mobile?425:640;assert.equal(bars.length,5);
  for(const[i,amount]of amounts.entries())near(value(bars[i],'width'),amount/70*scale);
  near(amounts.filter((_,i)=>i!==2).reduce((a,b)=>a+b,0),165.642);near(amounts.reduce((a,b)=>a+b,0),196.23965331);
  assert.ok(attrs(bars[2]).fill.endsWith('-hatch)'));assert.equal(bars.filter(n=>attrs(n).fill==='#216595').length,4);has(v.lang==='fr'?'165,642':'165.642');has(v.lang==='fr'?'30,598':'30.598');
 }
 if(v.kind==='cohorts'){
  const principal=[35818000000,38944000000,30797000000,60083000000],old=[0,.01,.025,.0275],elapsed=[55,144,266,297],days=elapsed.map(n=>365-n),deltas=principal.map((p,i)=>p*(.04-old[i]));
  const annual=deltas.reduce((a,b)=>a+b,0),allocated=deltas.reduce((sum,d,i)=>sum+d*days[i]/365,0);near(annual,3814032500,.001);near(allocated,2189441136.9863014,.001);
  const circles=visible.filter(n=>tag(n)==='circle');assert.equal(circles.length,4);const x0=v.mobile?62:90,y0=v.mobile?490:455,w=v.mobile?462:954,h=v.mobile?244:268;let cumulative=0;
  const expected=[[x0,y0]];
  for(let i=0;i<4;i++){const x=x0+elapsed[i]/365*w;expected.push([x,y0-cumulative/1e9/4.3*h]);cumulative+=deltas[i];const y=y0-cumulative/1e9/4.3*h;expected.push([x,y]);near(value(circles[i],'cx'),x);near(value(circles[i],'cy'),y);}
  expected.push([x0+w,y0-annual/1e9/4.3*h]);
  const line=visible.find(n=>tag(n)==='polyline'),poly=visible.find(n=>tag(n)==='polygon');assert.ok(line&&poly);const actual=pointPairs(attrs(line).points);assert.equal(actual.length,expected.length);
  for(const[i,p]of actual.entries())for(const k of [0,1])near(p[k],expected[i][k],.0051);
  const shaded=pointPairs(attrs(poly).points);assert.deepEqual(shaded.slice(0,-1),actual);assert.deepEqual(shaded.at(-1),[x0+w,y0]);
  has(v.lang==='fr'?'3,814':'3.814');has(v.lang==='fr'?'2,189':'2.189');
 }
 if(v.kind==='financing'){
  const issuance=340,principal=179.5,additional=issuance-principal;near(additional,160.5);near(value(coloured('#216595'),'width'),axisWidth*principal/issuance);near(value(coloured('#137976'),'width'),axisWidth*additional/issuance);near(value(coloured('#216595'),'width')+value(coloured('#137976'),'width'),axisWidth);
  near(179.5+9.7+.6+156.4-6.5,339.7);near(340+2.2+2.5-5,339.7);near(2-8.5,-6.5);near(-8+3,-5);
  has(v.lang==='fr'?'179,5':'179.5');has(v.lang==='fr'?'160,5':'160.5');has(v.lang==='fr'?'339,7':'339.7');
 }
 if(v.kind==='indexation'){
  has(v.lang==='fr'?'8,5':'8.5');has(v.lang==='fr'?'9,7':'9.7');has('2027');
  for(const exact of v.lang==='fr'?['8,5 Md€','9,7 Md€']:['€8.5bn','€9.7bn'])assert.equal(labels.filter(t=>t===exact).length,1,`${v.key}: principal amount ${exact}`);
  const panels=rects.filter(n=>attrs(n).fill==='#ffffff');assert.equal(panels.length,2);
  has(v.lang==='fr'?'CHARGE DE 2027':'2027 EXPENSE');has(v.lang==='fr'?'PAIEMENT DE 2027':'2027 CASH PAYMENT');
  assert.ok(labels.some(t=>/indexation|Indexation/u.test(t)));assert.ok(labels.some(t=>/accumul|Accumulated/u.test(t)));assert.ok(labels.some(t=>/Provision|provision/u.test(t)));
 }
}
test('independent arithmetic matches price/discount, debt stocks, maturity bars, cohort steps and financing scopes',()=>{for(const v of variants)quantitativeGeometry(v);});
test('quantitative guards reject shape-only and numeric-label changes',()=>{
 for(const[kind,change]of[
  ['auction',(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect'&&attrs(n).fill==='#216595')).width='815';}],
  ['structure',(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect'&&attrs(n).fill==='#137976')).width='90';}],
  ['maturities',(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect'&&attrs(n).fill.endsWith('-hatch)'))).width='280';}],
  ['cohorts',(_,ns)=>{attrs(ns.find(n=>tag(n)==='polyline')).points=attrs(ns.find(n=>tag(n)==='polyline')).points.replace('233.75','234.75');}],
  ['financing',(_,ns)=>{attrs(ns.find(n=>tag(n)==='rect'&&attrs(n).fill==='#137976')).width='491.94';}],
  ['indexation',(_,ns)=>{const n=ns.find(n=>tag(n)==='text'&&xmlText(n)==='9,7 Md€');n.text=[{'#text':'9,8 Md€'}];}],
 ])assert.throws(()=>quantitativeGeometry(mutate(variants.find(v=>v.lang==='fr'&&v.kind===kind&&!v.mobile),change)),kind);
});
