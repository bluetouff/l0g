import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';

const pages = ['fr', 'en'].map(lang => ({ lang, html: readFileSync(new URL(`../dist/${lang === 'fr' ? 'posts/commerce-mondial-rythme-commandes-ia' : 'en/analysis/world-trade-rhythm-ai-orders'}/index.html`, import.meta.url), 'utf8') }));
const nodes = n => [n, ...(n.childNodes ?? []).flatMap(nodes)];
const attr = (n, k) => n.attrs?.find(a => a.name === k)?.value;
const text = n => n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(text).join('');
const canonical = n => n.nodeName === '#text' ? ['#text', n.value] : [n.tagName, (n.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), (n.childNodes ?? []).filter(c => c.nodeName !== '#text' || c.value.trim() || ['text', 'title', 'desc', 'metadata'].includes(n.tagName)).map(canonical)];
// Complete native browser-tree goldens independently derived from supplied exports.
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
const references = { momentum: [3, 12], taiwan: [4], borders: [5, 6], buyers: [7, 14], inventory: [9], macro: [5, 10, 11] };
const classes = (n, name) => (attr(n, 'class') ?? '').split(/\s+/u).includes(name);
function figures(tree, lang) {
  const all = nodes(tree), figures = all.filter(n => n.tagName === 'figure' && classes(n, 'trade-cycle-figure')); assert.equal(figures.length, 6);
  for (const [i, figure] of figures.entries()) {
    assert.deepEqual(['id', 'data-figure', 'data-kind'].map(k => attr(figure, k)), [`figure-${i + 1}`, String(i + 1).padStart(2, '0'), kinds[i]]);
    const roots = nodes(figure).filter(n => n.tagName === 'svg'); assert.equal(roots.length, 2);
    for (const [j, root] of roots.entries()) {
      const key = `${kinds[i]}-${lang}-${j ? 'mobile' : 'desktop'}`, prefix = `tc-${kinds[i]}-${lang}-${j ? 'm' : 'd'}`;
      assert.deepEqual(root.attrs.map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), Object.entries({ xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto', 'data-kind': kinds[i], 'data-lang': lang, 'data-mobile': String(Boolean(j)) }).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
      const hash = createHash('sha256').update(JSON.stringify(canonical(root))).digest('hex'); assert.equal(hash, originals[key].domHash, `${key}: geometry/text/native attributes`);
      assert.ok(classes(root.parentNode, `trade-cycle-${j ? 'mobile' : 'desktop'}`));
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
  const lists = all.filter(n => n.tagName === 'ol' && attr(n, 'class') === 'sources-list trade-cycle-sources'); assert.equal(lists.length, 1);
  assert.deepEqual(lists[0].attrs.map(a => [a.name, a.value]), [['class', 'sources-list trade-cycle-sources']]);
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
  for (const field of ['viewBox', 'role', 'style', 'aria-labelledby', 'data-kind', 'data-lang', 'data-mobile']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'data-kind') === 'momentum'); changeAttribute(root, field, 'changed'); assert.throws(() => figures(tree, 'fr')); }
  for (const [field, value] of [['font-family', 'Arial'], ['font-size', '1'], ['x', '0'], ['fill', 'url(https://example.org/x)']]) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'data-kind') === 'momentum'), label = nodes(root).find(n => n.tagName === 'text'); changeAttribute(label, field, value); assert.throws(() => figures(tree, 'fr')); }
  for (const type of ['script', 'foreignObject', 'image', 'animate']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'data-kind') === 'momentum'); root.childNodes.push({ nodeName: type, tagName: type, attrs: [], childNodes: [] }); assert.throws(() => figures(tree, 'fr')); }
});
test('compiled bibliographies retain fourteen canonical IDs and complete source link fields', () => {
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
