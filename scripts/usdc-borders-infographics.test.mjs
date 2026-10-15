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
import { usdcBorderSvg, USDC_BORDER_KINDS } from '../src/lib/usdcBorderFigures.mjs';
import { assertFontLicenseReferences } from './font-license-assertions.mjs';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const digest = value => createHash('sha256').update(value).digest('hex');
// Independent raw and complete browser-tree goldens derived from all 24 passive supplied XML exports.
const originals = {
  "oversight-fr-desktop": {
    "rawHash": "0b115eb5c7f78ac066227d077d71bc868ad107bed652d8e640ce8be11b15200e",
    "domHash": "d40da38220188bbdcb24a10d6d54eb4d5f5989ac73717f84fa1c8d7dc641ef56",
    "viewBox": "0 0 1000 786"
  },
  "oversight-fr-mobile": {
    "rawHash": "f9a863a836d251e82694002e33bd9266165b7ec2eda0eda1d957346b7997ceb7",
    "domHash": "3c5eb1a2e67d20a93d51c0ad66fa9a02c13fbe1a2fdec2fb3d8ef09ff67ef18f",
    "viewBox": "0 0 400 1118"
  },
  "migration-fr-desktop": {
    "rawHash": "49f0bee01fd448e12198cc55d674af455103416e96a1c3d9fa380d6a62746170",
    "domHash": "4a6de31bac65e14caafc17b32ad8adcdeea9fe888cbf9f0cb6764f17c6a0fbad",
    "viewBox": "0 0 1000 845"
  },
  "migration-fr-mobile": {
    "rawHash": "68b4d564282447112378772d91cc02fd97573fb10e3274f1445270975c322d46",
    "domHash": "8e42d452055537638719663bec559270712fceb0162d1f15b7b27654db7e29ac",
    "viewBox": "0 0 400 1012"
  },
  "information-fr-desktop": {
    "rawHash": "fc8690ab514d4e907699a9c369d39ac86d9cf9c4cc3602c4fc12991692d5f046",
    "domHash": "2b80d8f28dbe8b03a3b38cbecd8966797acbea2c5a435c3e52bc19276c2afad7",
    "viewBox": "0 0 1000 773"
  },
  "information-fr-mobile": {
    "rawHash": "c6d19b5f8a83c9d0683a4d56ca4cf1eb923017a0a1394dc92a9507fde3b3a323",
    "domHash": "ff4dd0a4a04706ae6647535e810d6d5f2166db80548f8005dff67fbfefbfe006",
    "viewBox": "0 0 400 1065"
  },
  "buffers-fr-desktop": {
    "rawHash": "0e8013af3f2c133e4b1b2797ea5563f15030658620a704d2b9d35edbadc60a97",
    "domHash": "5f8a013160165158fe574c5a1688c36a36e50985c751b564644cd8cbb855444f",
    "viewBox": "0 0 1000 770"
  },
  "buffers-fr-mobile": {
    "rawHash": "d32dbc2867e5a4c2876fb342ef62d865b5b62fd61dd5e53437ace35fbd45d8b1",
    "domHash": "fef3477d61412a90e1a29299e37921207ccd37e87f6223e6c60552243332c3e1",
    "viewBox": "0 0 400 923"
  },
  "banking-fr-desktop": {
    "rawHash": "fe39de526552b565fb76a922a7e892a504ccc700f67a1d3f384ed5d4600d483b",
    "domHash": "f87d63f4c4377f5b3ff090286801dd41895b6da3ae4a678164f085fff9822d28",
    "viewBox": "0 0 1000 830"
  },
  "banking-fr-mobile": {
    "rawHash": "bdb99cb93409643f270c50d8e066796ab3d8021e02bdefabc8e83e456c1896b8",
    "domHash": "c94fd2ed007ef690ff82eee194b393e8b8d16c4408dec9d1732bf60706312ff5",
    "viewBox": "0 0 400 1152"
  },
  "exit-fr-desktop": {
    "rawHash": "fc2b1bd63f13834c9440ba64493d8fbaeeb2292411825730d645eb1ccb36bd80",
    "domHash": "087e86267e4b16ae01b33e68b2ac838b6d9e2a3b2757f0a86919eb276d9cb578",
    "viewBox": "0 0 1000 828"
  },
  "exit-fr-mobile": {
    "rawHash": "a03b4a13442c5ea6e7128506f67ee64b4e6a55433420b14a82a21e1902c0ea26",
    "domHash": "76edd188675889d0cb482ed7dd61cd90dd8546012bd59968d6971612f9da7e11",
    "viewBox": "0 0 400 1230"
  },
  "oversight-en-desktop": {
    "rawHash": "d373b0e47b925e128553c30f950ea48e0f9127f0ee4a7582abfc5cb2fc7678c9",
    "domHash": "2744028a4a997e4ca5e474d93bc005f02790f48bafa5fd9cf7195261a4b4ba78",
    "viewBox": "0 0 1000 786"
  },
  "oversight-en-mobile": {
    "rawHash": "4f7335e28cb3462782b38f14e04f26929f213aca80a254740cafd1886624086f",
    "domHash": "6b7c6f4fe6480b7bf2cbc8984799b57829026dcf889d2f637a237e3294bd74fb",
    "viewBox": "0 0 400 1118"
  },
  "migration-en-desktop": {
    "rawHash": "9fd3b191dc59ced7ff93a38796428672f9baf64e864e3b8ae0b61f206a1f60a1",
    "domHash": "cc973bdfbf7277968d8755b30aa1adb6ba7c341b2fca56a4ae911e743cf462e3",
    "viewBox": "0 0 1000 845"
  },
  "migration-en-mobile": {
    "rawHash": "47fa610d4d5445fee4b7e08dd5795646a1ce3eb5c65dbbe53f209d74f520bcc0",
    "domHash": "73a677b9ed6cafb1fbbe185fe4aea52f99f02d56014e79c251cb6188a772c099",
    "viewBox": "0 0 400 1012"
  },
  "information-en-desktop": {
    "rawHash": "5101f08fe74bca53f3a0e6613dcc7b50dd4b555c1758b3dfae4a859349914fda",
    "domHash": "f41b4d703313b2d445f255f2c6078316c33d2ef9bed1abb5a61c6bac92c4f7e4",
    "viewBox": "0 0 1000 773"
  },
  "information-en-mobile": {
    "rawHash": "8789586fae2f2e944594238d21d4fc7bde4f9eb094420ce63aab8f3d654b8102",
    "domHash": "3b446b18b8536f7c88bb968349a7f056ed771f6e5a8fbe4b01506af6259f550d",
    "viewBox": "0 0 400 1065"
  },
  "buffers-en-desktop": {
    "rawHash": "4be2ad4516ee37b51a962180e4ba5a66b5a664741fcd28d5478891e710276e6b",
    "domHash": "ca267384388a10c91ff48519943f61f713c68a4350fbf776f5ef88116704993f",
    "viewBox": "0 0 1000 770"
  },
  "buffers-en-mobile": {
    "rawHash": "47fd26109aa975cf953be4002af7b387e4f95f5208493603bab56bce8463692f",
    "domHash": "322507f74957572372158db8cd717ad9c15228fd1a73ecb75ddde6ef40805a92",
    "viewBox": "0 0 400 923"
  },
  "banking-en-desktop": {
    "rawHash": "ae5910afb140c756ea68aca3e673481a507df9f59371160499843abaf7e90baf",
    "domHash": "7b040b5a5cf4a8cf458978fcba1e2de7aba92ad91a7318169480f8e67a0dfb61",
    "viewBox": "0 0 1000 830"
  },
  "banking-en-mobile": {
    "rawHash": "254425cb3ee27f5f53c7f91042f9658ba7a996983033e6cdb0c3b89677248f74",
    "domHash": "71fb75edafd7d553053cb00580f4f31d9c1e1c34dc60df5968bb05e2c85997ee",
    "viewBox": "0 0 400 1152"
  },
  "exit-en-desktop": {
    "rawHash": "eda839f060008b65b84d7509eebe633b43d826c8187ff2c2edf6e2e4329673a5",
    "domHash": "a690315e8467951ddbf87d658e34c430e3676369b2a20aa6b65cb6f36fc90a91",
    "viewBox": "0 0 1000 828"
  },
  "exit-en-mobile": {
    "rawHash": "b9e195a5b58a118add3ef865172c2898dee4ab4990120ef3fc568227243e3d04",
    "domHash": "23260bb2bc27195a7993259c05cb13c14ea071e05d165f203269265926518650",
    "viewBox": "0 0 400 1230"
  }
};
const sourcesByKind = {
  "oversight": [
    {
      "id": 1,
      "url": "https://www.eba.europa.eu/publications-and-media/press-releases/eba-classifies-usdc-first-significant-e-money-token-european-union"
    },
    {
      "id": 4,
      "url": "https://www.circle.com/legal/mica-usdc-whitepaper"
    },
    {
      "id": 9,
      "url": "https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-58-specific-additional-obligations"
    },
    {
      "id": 14,
      "url": "https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-56-classification-e-money-tokens"
    }
  ],
  "migration": [
    {
      "id": 4,
      "url": "https://www.circle.com/legal/mica-usdc-whitepaper"
    },
    {
      "id": 5,
      "url": "https://www.fsb.org/uploads/P121026-2.pdf"
    }
  ],
  "information": [
    {
      "id": 4,
      "url": "https://www.circle.com/legal/mica-usdc-whitepaper"
    },
    {
      "id": 5,
      "url": "https://www.fsb.org/uploads/P121026-2.pdf"
    },
    {
      "id": 6,
      "url": "https://www.circle.com/legal/casp-emt-data-reporting"
    }
  ],
  "buffers": [
    {
      "id": 7,
      "url": "https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-54-investment-funds-received"
    },
    {
      "id": 8,
      "url": "https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-45-specific-additional-obligations"
    },
    {
      "id": 9,
      "url": "https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-58-specific-additional-obligations"
    },
    {
      "id": 10,
      "url": "https://www.ecb.europa.eu/press/consultationresponse/pdf/ecb.conresp202609_micarreview.de.pdf"
    }
  ],
  "banking": [
    {
      "id": 10,
      "url": "https://www.ecb.europa.eu/press/consultationresponse/pdf/ecb.conresp202609_micarreview.de.pdf"
    },
    {
      "id": 13,
      "url": "https://www.federalreserve.gov/econres/notes/feds-notes/in-the-shadow-of-bank-run-lessons-from-the-silicon-valley-bank-failure-and-its-impact-on-stablecoins-20251217.html"
    }
  ],
  "exit": [
    {
      "id": 2,
      "url": "https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-49-issuance-and-redeemability-e"
    },
    {
      "id": 3,
      "url": "https://www.circle.com/legal/mica-redemption-policy"
    },
    {
      "id": 15,
      "url": "https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-46-recovery-plan"
    },
    {
      "id": 16,
      "url": "https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-55-recovery-and-redemption-plans"
    }
  ]
};
const statuses = {"oversight": "documented-mechanism", "migration": "hypothetical", "information": "documented-mechanism", "buffers": "statutory-not-actual", "banking": "hypothetical", "exit": "documented-mechanism"};
const kinds = ["oversight", "migration", "information", "buffers", "banking", "exit"];
const figureSources = {"oversight":[1,4,9,14,19],"migration":[4,5],"information":[4,5,6],"buffers":[7,8,9,10],"banking":[10,13],"exit":[2,3,15,16]};
const variants = ['fr', 'en'].flatMap(lang => kinds.flatMap(kind => [false, true].map(mobile => ({ lang, kind, mobile, key: `${kind}-${lang}-${mobile ? 'mobile' : 'desktop'}`, svg: usdcBorderSvg(lang, kind, mobile) }))));
const articles = () => ['fr', 'en'].map(lang => ({ lang, raw: read(`src/content/${lang === 'fr' ? 'posts/usdc-reserves-suivre-jeton-mica' : 'posts-en/usdc-reserves-follow-token-mica'}.mdx`) }));
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
  svg: 'xmlns viewBox role aria-labelledby style data-usdc-kind',
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
  const prefix = `usdc-${v.kind}-${v.lang}-${v.mobile ? 'm' : 'd'}`;
  assert.deepEqual(attrs(root), { xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[v.key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto', 'data-usdc-kind': v.kind });
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
      if (k === 'font-size') assert.ok(number(val) >= 12 && number(val) <= 64);
      if (k === 'text-anchor') assert.ok(['start', 'middle', 'end'].includes(val));
      if (k === 'stroke-dasharray') assert.ok(['4 3', '6 5'].includes(val));
      if (k === 'stroke-linecap' || k === 'stroke-linejoin') assert.equal(val, 'round');
      if (k === 'd') pathPoints(val);
      if (k === 'opacity') assert.fail('No authored USDC opacity');
      if (k === 'transform') assert.fail('No authored USDC transforms');
    }
  }
  assert.deepEqual(ids.sort(), [`${prefix}-desc`, `${prefix}-title`]);

  for (const type of ['title', 'desc', 'metadata']) { const found = nodes.filter(n => tag(n) === type); assert.equal(found.length, 1); assert.ok(xmlText(found[0]).trim()); }
  const meta = JSON.parse(xmlText(nodes.find(n => tag(n) === 'metadata')));
  assert.deepEqual(meta, { asOf: '2026-10-15', kind: v.kind, language: v.lang, layout: v.mobile ? 'mobile' : 'desktop', status: statuses[v.kind], sources: sourcesByKind[v.kind] });
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
const fonts = Object.fromEntries([400, 700].map(w => [w, fontFrom(`public/fonts/usdc-borders/liberation-sans-${w}.ttf`)]));
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
test('USDC borders variant selection is frozen, complete and rejects prototypes or coercion', () => {
  assert.deepEqual(USDC_BORDER_KINDS, kinds); assert.ok(Object.isFrozen(USDC_BORDER_KINDS)); assert.equal(variants.length, 24);
  for (const lang of ['', 'FR', '__proto__', 'constructor', {}, null, ['fr']]) assert.throws(() => usdcBorderSvg(lang, 'oversight', false), TypeError);
  for (const kind of ['', '__proto__', 'constructor', 'prototype', {}, null, ['oversight']]) assert.throws(() => usdcBorderSvg('fr', kind, false), TypeError);
  for (const mobile of [0, 1, '', 'false', null, new Boolean(false), {}, []]) assert.throws(() => usdcBorderSvg('fr', 'oversight', mobile), TypeError);
  assert.equal(usdcBorderSvg('fr', 'oversight'), usdcBorderSvg('fr', 'oversight', false));
});
test('all 24 complete SVG exports remain byte-identical to the supplied passive XML', () => { for (const v of variants) faithful(v); });
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
    if ([1, 16].includes(record.id)) assert.equal(record.value, 'l0g USDC Sans');
    if ([2, 17].includes(record.id)) assert.equal(record.value, style);
    if ([3, 4, 18].includes(record.id)) assert.equal(record.value, `l0g USDC Sans ${style}`);
    if (record.id === 6) assert.equal(record.value, `l0gUSDCSans-${style}`);
  }
}
test('redistributed font subsets retain copyrights and use the licensed derivative family name', () => {
  for (const weight of [400, 700]) {
    const subsetBytes = readFileSync(new URL(`../public/fonts/usdc-borders/liberation-sans-${weight}.ttf`, import.meta.url));
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
  const licence = read('public/fonts/usdc-borders/LICENSE.txt'); assertFontLicenseReferences(licence, 'liberation');
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
  const component = read('src/components/UsdcBorderFigure.astro'), styles = component.match(/<style>([\s\S]*?)<\/style>/u); assert.ok(styles);
  const css = postcss.parse(styles[1]), declarations = n => Object.fromEntries(n.nodes.filter(d => d.type === 'decl').map(d => [d.prop, d.value]));
  const base = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.usdc-border-figure'));
  assert.deepEqual([base.width, base['max-width'], base['container-type'], base['padding-bottom']], ['100%', '760px', 'inline-size', '.85rem']);
  assert.equal(base.overflow, 'visible');
  const graphic = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.usdc-border-figure :global(svg)'));
  assert.deepEqual([graphic.width, graphic.height, graphic.overflow, graphic['letter-spacing']], ['100%', 'auto', 'visible', 'normal']);
  const labelFont = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.usdc-border-figure :global(svg text)'));
  assert.equal(labelFont['font-family'], "'l0g USDC Borders', 'Liberation Sans', Arial, sans-serif");
  const mobile = declarations(css.nodes.find(n => n.type === 'rule' && n.selector === '.usdc-border-mobile'));
  assert.deepEqual([mobile.display, mobile.width, mobile['max-width'], mobile['margin-inline']], ['none', '100%', '400px', 'auto']);
  for (const kind of ['media', 'container']) {
    const rule = css.nodes.find(n => n.type === 'atrule' && n.name === kind && n.params === '(max-width: 640px)'); assert.ok(rule);
    assert.deepEqual(rule.nodes.map(n => [n.selector, declarations(n).display]), [['.usdc-border-desktop', 'none'], ['.usdc-border-mobile', 'block']]);
  }
  const faces = css.nodes.filter(n => n.type === 'atrule' && n.name === 'font-face').map(n => declarations(n));
  assert.deepEqual(faces.map(d => [d['font-family'], d.src, d['font-weight'], d['font-style']]), [400, 700].map(w => ["'l0g USDC Borders'", `url('/fonts/usdc-borders/liberation-sans-${w}.ttf') format('truetype')`, String(w), 'normal']));
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
  const figures = mdxNodes(tree).filter(n => n.name === 'UsdcBorderFigure'); assert.equal(figures.length, 6);
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
  assert.doesNotMatch(raw, /horloges|clocks|—/iu);
}
test('six article figures per language preserve native MDX order, static captions, references and method notes', () => {
  for (const { lang, raw } of articles()) articleFigures(raw, lang);
});
test('article figure contracts reject wrong kinds, source references and executable captions', () => {
  const raw = mdxBody(articles()[0].raw);
  for (const [a, b] of [['kind="oversight"', 'kind="exit"'], ['number="01"', 'number="06"'], ['sources="1 4 9 14 19"', 'sources="1 4 9 99"'], ['lang="fr"', 'lang="en"']]) assert.throws(() => articleFigures(raw.replace(a, b), 'fr'));
  const first = mdxNodes(createProcessor().parse(raw)).find(n => n.name === 'UsdcBorderFigure');
  const attribute = first.attributes.find(a=>a.name==='caption');
  const invalid = raw.slice(0, attribute.position.start.offset) + 'caption={process.env.SECRET}' + raw.slice(attribute.position.end.offset);
  assert.throws(() => articleFigures(invalid, 'fr'));
});


function quantitativeGeometry(v) {
  const { nodes } = inspect(v), labels = nodes.filter(n => tag(n) === 'text').map(xmlText);
  const meta = JSON.parse(xmlText(nodes.find(n => tag(n) === 'metadata')));
  if (v.kind === 'migration') {
    assert.equal(meta.status, 'hypothetical');
    const bars = nodes.filter(n => tag(n) === 'rect' && value(n, 'rx') === 0 && ['var(--color-signal, #5eead4)', 'var(--color-topic-blue, #7aa2f7)'].includes(attrs(n).fill));
    assert.equal(bars.length, 12);
    const expected = [[200, 800], [200, 800], [350, 650], [200, 800], [350, 650], [350, 650]];
    const base = v.mobile ? 344 : 676, start = v.mobile ? 28 : 288;
    for (let i = 0; i < 6; i++) {
      const [eu, rest] = bars.slice(i * 2, i * 2 + 2);
      assert.equal(attrs(eu).fill, 'var(--color-signal, #5eead4)');
      assert.equal(attrs(rest).fill, 'var(--color-topic-blue, #7aa2f7)');
      assert.equal(value(eu, 'x'), start); assert.equal(value(rest, 'y'), value(eu, 'y'));
      assert.equal(value(eu, 'height'), 33); assert.equal(value(rest, 'height'), 33);
      for (const [n, expectedValue] of [[eu, expected[i][0]], [rest, expected[i][1]]]) assert.ok(Math.abs(value(n, 'width') / base * 1000 - expectedValue) < 1e-9);
      assert.ok(Math.abs(value(rest, 'x') - value(eu, 'x') - value(eu, 'width')) < 1e-9);
      assert.ok(Math.abs(value(eu, 'width') + value(rest, 'width') - base) < 1e-9, 'Each measure retains its own constant base 1000');
    }
    const gap = nodes.filter(n => tag(n) === 'rect' && attrs(n)['stroke-dasharray'] === '4 3'); assert.equal(gap.length, 1);
    assert.ok(Math.abs(value(gap[0], 'width') / base * 1000 - 150) < 1e-9);
    assert.equal(value(gap[0], 'y'), value(bars[6], 'y'));
    assert.match(xmlText(nodes.find(n => tag(n) === 'desc')), /ficti/iu);
    assert.ok(labels.some(label => /[Ff]icti/u.test(label))); assert.ok(labels.includes(v.lang === 'fr' ? '350 + 650 = 1 000' : '350 + 650 = 1,000'));
  }
  if (v.kind === 'buffers') {
    assert.equal(meta.status, 'statutory-not-actual');
    const baseBars = nodes.filter(n => tag(n) === 'rect' && value(n, 'rx') === 0 && attrs(n).fill === 'var(--color-surface-2, #171a20)');
    const deposits = nodes.filter(n => tag(n) === 'rect' && value(n, 'rx') === 0 && attrs(n).fill === 'var(--color-topic-blue, #7aa2f7)');
    assert.equal(baseBars.length, 2); assert.equal(deposits.length, 2);
    assert.equal(value(baseBars[0], 'width'), value(baseBars[1], 'width'));
    for (let i = 0; i < 2; i++) {
      assert.deepEqual(['x','y','height'].map(k => value(deposits[i], k)), ['x','y','height'].map(k => value(baseBars[i], k)));
      assert.ok(Math.abs(value(deposits[i], 'width') / value(baseBars[i], 'width') - [.3, .6][i]) < 1e-12);
    }
    for (const s of ['0','100','30','60',v.lang === 'fr' ? '≥ 30 %' : '≥ 30%',v.lang === 'fr' ? '≥ 60 %' : '≥ 60%']) assert.ok(labels.includes(s));
    assert.match(xmlText(nodes.find(n => tag(n) === 'desc')), /planchers|floors/u);
  }
  if (v.kind === 'banking') {
    assert.equal(meta.status, 'hypothetical');
    assert.equal(nodes.filter(n => tag(n) === 'circle').length, 10);
    assert.equal(labels.filter(label => label === '10').length, 10);
    assert.ok(labels.includes('10 × 10 = 100') && labels.includes('100'));
    assert.match(xmlText(nodes.find(n => tag(n) === 'desc')), /[Ff]icti/u);
    assert.ok(labels.some(label => /[Ff]icti/u.test(label)));
  }
  if (v.kind === 'exit') {
    assert.equal(meta.status, 'documented-mechanism');
    const desc = xmlText(nodes.find(n => tag(n) === 'desc'));
    assert.match(desc, /condition/u); assert.match(desc, /Circle/u);
    assert.ok(labels.some(label => /5 (?:jours ouvrés|business days)/u.test(label)), 'Five business days retains business-day unit');
  }
}
test('fictional transfers conserve each total; legal deposit floors retain zero origin and proportional bars', () => { for (const v of variants) quantitativeGeometry(v); });
test('quantitative guards reject changed bases, gaps, floors, bank concentration and fictional status', () => {
  for (const v of variants.filter(v => ['migration', 'buffers'].includes(v.kind))) {
    assert.throws(() => quantitativeGeometry(mutate(v, (_, ns) => { const n = ns.find(n => tag(n) === 'rect' && attrs(n).fill === (v.kind === 'migration' ? 'var(--color-signal, #5eead4)' : 'var(--color-topic-blue, #7aa2f7)') && value(n, 'rx') === 0); attrs(n).width = '1'; })));
  }
  for (const v of variants.filter(v => ['migration','banking'].includes(v.kind))) assert.throws(() => quantitativeGeometry(mutate(v, (_, ns) => { const n = ns.find(n => tag(n) === 'metadata'), m = JSON.parse(xmlText(n)); m.status = 'published-measurement'; n.metadata = [{ '#text': JSON.stringify(m) }]; })));
  for (const v of variants.filter(v => v.kind === 'banking')) assert.throws(() => quantitativeGeometry(mutate(v, root => { root.svg.splice(root.svg.findIndex(n => tag(n) === 'circle'), 1); })));
});
