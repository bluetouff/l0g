import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';

const pages = ['fr', 'en'].map(lang => ({ lang, html: readFileSync(new URL(`../dist/${lang === 'fr' ? 'posts/gaz-europeen-tenir-entre-deux-cargaisons' : 'en/analysis/european-gas-bridging-gap-between-cargoes'}/index.html`, import.meta.url), 'utf8') }));
const nodes = n => [n, ...(n.childNodes ?? []).flatMap(nodes)];
const attr = (n, k) => n.attrs?.find(a => a.name === k)?.value;
const text = n => n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(text).join('');
const canonical = n => n.nodeName === '#text' ? ['#text', n.value] : [n.tagName, (n.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), (n.childNodes ?? []).filter(c => c.nodeName !== '#text' || c.value.trim() || ['text', 'title', 'desc', 'metadata'].includes(n.tagName)).map(canonical)];
// Complete tree goldens derived from original exports plus the single reviewed
// card-height correction, never from generated HTML.
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
const references = { stocks: [2, 5], chain: [1, 2, 6], scenarios: [2], peak: [2, 5], refill: [2], curve: [2, 3] };
const classes = (n, name) => (attr(n, 'class') ?? '').split(/\s+/u).includes(name);
function figures(tree, lang) {
  const all = nodes(tree), figures = all.filter(n => n.tagName === 'figure' && classes(n, 'gas-winter-figure')); assert.equal(figures.length, 6);
  for (const [i, figure] of figures.entries()) {
    assert.deepEqual(['id', 'data-figure', 'data-kind'].map(k => attr(figure, k)), [`figure-${i + 1}`, String(i + 1).padStart(2, '0'), kinds[i]]);
    const roots = nodes(figure).filter(n => n.tagName === 'svg'); assert.equal(roots.length, 2);
    for (const [j, root] of roots.entries()) {
      const key = `${kinds[i]}-${lang}-${j ? 'mobile' : 'desktop'}`, prefix = `gas-${kinds[i]}-${lang}-${j ? 'm' : 'd'}`;
      assert.deepEqual(root.attrs.map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), Object.entries({ xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto', 'data-gas-winter-kind': kinds[i] }).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
      const hash = createHash('sha256').update(JSON.stringify(canonical(root))).digest('hex'); assert.equal(hash, originals[key].domHash, `${key}: geometry/text/native attributes`);
      assert.ok(classes(root.parentNode, `gas-winter-${j ? 'mobile' : 'desktop'}`));
      for (const type of ['title', 'desc']) { const selected = nodes(root).filter(n => n.tagName === type); assert.equal(selected.length, 1); assert.equal(attr(selected[0], 'id'), `${prefix}-${type}`); assert.ok(text(selected[0]).trim()); }
    }
    const caption = nodes(figure).filter(n => n.tagName === 'figcaption'); assert.equal(caption.length, 1); assert.ok(text(caption[0]).length > 100);
    const links = nodes(caption[0]).filter(n => n.tagName === 'a'); assert.deepEqual(links.map(n => [attr(n, 'href'), text(n)]), references[kinds[i]].map(n => [`#source-${n}`, `[${n}]`]));
    const details = nodes(figure).filter(n => n.tagName === 'details'); assert.equal(details.length, 1); assert.equal(nodes(details[0]).filter(n => n.tagName === 'summary').length, 1); assert.ok(text(details[0]).length > 150);
  }
  const ids = all.map(n => attr(n, 'id')).filter(Boolean); assert.equal(new Set(ids).size, ids.length, 'All document IDs unique');
}
function sourceFields(tree, lang) {
  const all = nodes(tree);
  const lists = all.filter(n => n.tagName === 'ol' && attr(n, 'class') === 'sources-list gas-winter-sources'); assert.equal(lists.length, 1);
  assert.deepEqual(lists[0].attrs.map(a => [a.name, a.value]), [['class', 'sources-list gas-winter-sources']]);
  for (const n of nodes(lists[0])) assert.ok(n.nodeName === '#text' || ['ol', 'li', 'a'].includes(n.tagName), 'Passive bibliography markup');
  const sections = nodes(lists[0]).filter(n => n.tagName === 'li');
  assert.deepEqual(sections.map(n => attr(n, 'id')), sourceLinks[lang].map((_, i) => `source-${i + 1}`));
  for (const [i, section] of sections.entries()) {
    assert.deepEqual(section.attrs.map(a => [a.name, a.value]), [['id', `source-${i + 1}`]]);
    const links = nodes(section).filter(n => n.tagName === 'a');
    assert.deepEqual(links.map(n => [attr(n, 'href'), text(n), attr(n, 'target'), attr(n, 'rel')]), sourceLinks[lang][i].map(([url, title]) => [url, title, undefined, undefined]), `Complete source-${i + 1} fields`);
    for (const link of links) assert.deepEqual(link.attrs.map(a => a.name), ['href'], 'Only controlled native link fields');
    assert.ok(all.some(n => n.tagName === 'a' && attr(n, 'href') === `#source-${i + 1}`), `Source ${i + 1} cited`);
  }
  const ids = all.map(n => attr(n, 'id')).filter(Boolean); assert.equal(new Set(ids).size, ids.length);
  for (const n of all.filter(n => n.tagName === 'a' && (attr(n, 'href') ?? '').startsWith('#source-'))) assert.ok(ids.includes(attr(n, 'href').slice(1)), 'Every citation resolves');
}
function changeAttribute(n, k, value) { const a = n.attrs.find(a => a.name === k); assert.ok(a); a.value = value; }
function firstSource() { const tree = parse(pages[0].html), section = nodes(tree).find(n => attr(n, 'id') === 'source-1'), link = nodes(section).find(n => n.tagName === 'a'); return { tree, section, link }; }
test('compiled FR/EN preserve 24 complete reviewed SVGs and six accessible figures each', () => { for (const page of pages) figures(parse(page.html), page.lang); });
test('compiled SVG expectations detect geometry, text, native attributes and active additions', () => {
  for (const field of ['viewBox', 'role', 'style', 'aria-labelledby', 'data-gas-winter-kind']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'data-gas-winter-kind') === 'stocks'); changeAttribute(root, field, 'changed'); assert.throws(() => figures(tree, 'fr')); }
  for (const [field, value] of [['font-family', 'Arial'], ['font-size', '1'], ['x', '0'], ['fill', 'url(https://example.org/x)']]) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'data-gas-winter-kind') === 'stocks'), label = nodes(root).find(n => n.tagName === 'text'); changeAttribute(label, field, value); assert.throws(() => figures(tree, 'fr')); }
  for (const type of ['script', 'foreignObject', 'image', 'animate']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'data-gas-winter-kind') === 'stocks'); root.childNodes.push({ nodeName: type, tagName: type, attrs: [], childNodes: [] }); assert.throws(() => figures(tree, 'fr')); }
});
test('compiled bibliographies retain twelve canonical IDs and seventeen complete source links', () => {
  for (const page of pages) sourceFields(parse(page.html), page.lang);
});
test('compiled source checks reject substituted URLs, labels, native fields and duplicate links', () => {
  for (const [url] of sourceLinks.fr.flat()) {
    const host = new URL(url).hostname;
    for (const value of [url + '#hidden', url + (url.includes('?') ? '&' : '?') + 'alias=1', url + '/', url.replace('https:', 'http:'),
      url.replace(host, `${host}.example.org`), url.replace('https://', 'https://user@'), url.replace('https://', 'https://example.org/'),
      'javascript:alert(1)', 'data:text/html,untrusted', ' ' + url]) {
      const tree = parse(pages[0].html), link = nodes(tree).find(n => n.tagName === 'a' && attr(n, 'href') === url); assert.ok(link);
      changeAttribute(link, 'href', value); assert.throws(() => sourceFields(tree, 'fr'));
    }
  }
  for (const field of ['rel', 'target', 'onload', '__proto__', 'constructor', 'prototype']) { const { tree, link } = firstSource(); link.attrs.push({ name: field, value: 'untrusted' }); assert.throws(() => sourceFields(tree, 'fr')); }
  const a = firstSource(); a.link.childNodes = [{ nodeName: '#text', value: 'Changed' }]; assert.throws(() => sourceFields(a.tree, 'fr'));
  const b = firstSource(); changeAttribute(b.section, 'id', 'source-99'); assert.throws(() => sourceFields(b.tree, 'fr'));
  const c = firstSource(); c.section.childNodes.push({ nodeName: 'a', tagName: 'a', attrs: c.link.attrs.map(x => ({ ...x })), childNodes: [{ nodeName: '#text', value: sourceLinks.fr[0][0][1] }] }); assert.throws(() => sourceFields(c.tree, 'fr'));
  const d = firstSource(); d.section.childNodes.push({ nodeName: 'script', tagName: 'script', attrs: [], childNodes: [] }); assert.throws(() => sourceFields(d.tree, 'fr'));
});
test('compiled strategic-reserve card retains only the audited height repair', () => {
  const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'data-gas-winter-kind') === 'scenarios' && attr(n, 'viewBox') === '0 0 400 1520'); assert.ok(root);
  const card = nodes(root).find(n => n.tagName === 'rect' && attr(n, 'x') === '24' && attr(n, 'y') === '1226.36' && attr(n, 'width') === '352'); assert.ok(card);
  assert.equal(attr(card, 'height'), '160');
  for (const height of ['144', '156', '161']) { changeAttribute(card, 'height', height); assert.throws(() => figures(tree, 'fr')); }
});
