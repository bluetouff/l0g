import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';

const pages = ['fr', 'en'].map(lang => ({ lang, html: readFileSync(new URL(`../dist/${lang === 'fr' ? 'posts/cuivre-stocks-americains-conditions-retour' : 'en/analysis/copper-us-stockpiles-conditions-for-return'}/index.html`, import.meta.url), 'utf8') }));
const nodes = n => [n, ...(n.childNodes ?? []).flatMap(nodes)];
const attr = (n, k) => n.attrs?.find(a => a.name === k)?.value;
const text = n => n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(text).join('');
const canonical = n => n.nodeName === '#text' ? ['#text', n.value] : [n.tagName, (n.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), (n.childNodes ?? []).filter(c => c.nodeName !== '#text' || c.value.trim() || ['text', 'title', 'desc', 'metadata'].includes(n.tagName)).map(canonical)];
// Full browser-tree goldens independently derived from 24 supplied SVGs and
// eight approved heading-only variants and four closing-label contrast-only
// variants; every other geometry/native field remains pinned.
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
const references = { capacity: [1, 2, 3, 4, 5], thresholds: [11, 12], receipt: [13, 14, 15], customs: [16, 17], hedge: [19, 20], flows: [13] };
const classes = (n, name) => (attr(n, 'class') ?? '').split(/\s+/u).includes(name);
function figures(tree, lang) {
  const all = nodes(tree), figures = all.filter(n => n.tagName === 'figure' && classes(n, 'copper-border-figure')); assert.equal(figures.length, 6);
  for (const [i, figure] of figures.entries()) {
    assert.deepEqual(['id', 'data-figure', 'data-kind'].map(k => attr(figure, k)), [`figure-${i + 1}`, String(i + 1).padStart(2, '0'), kinds[i]]);
    const roots = nodes(figure).filter(n => n.tagName === 'svg'); assert.equal(roots.length, 2);
    for (const [j, root] of roots.entries()) {
      const key = `${kinds[i]}-${lang}-${j ? 'mobile' : 'desktop'}`, prefix = `cb-${kinds[i]}-${lang}-${j ? 'm' : 'd'}`;
      assert.deepEqual(root.attrs.map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), Object.entries({ xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto', 'data-copper-kind': kinds[i] }).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
      if (kinds[i] === 'flows') {
        const labels = nodes(root).filter(n => n.tagName === 'text' && text(n) === (lang === 'fr' ? 'stock final' : 'closing stock'));
        assert.equal(labels.length, 2, `${key}: closing-stock labels`);
        for (const label of labels) assert.equal(attr(label, 'fill'), 'var(--color-paper, #e7e9ee)', `${key}: high-contrast label ink`);
      }
      const hash = createHash('sha256').update(JSON.stringify(canonical(root))).digest('hex'); assert.equal(hash, originals[key].domHash, `${key}: geometry/text/native attributes`);
      assert.ok(classes(root.parentNode, `copper-border-${j ? 'mobile' : 'desktop'}`));
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
  const lists = all.filter(n => n.tagName === 'ol' && attr(n, 'class') === 'copper-border-sources'); assert.equal(lists.length, 1);
  assert.deepEqual(lists[0].attrs.map(a => [a.name, a.value]), [['class', 'copper-border-sources']]);
  for (const n of nodes(lists[0])) assert.ok(n.nodeName === '#text' || ['ol', 'li', 'a', 'strong'].includes(n.tagName), 'Passive bibliography markup');
  for (const n of nodes(lists[0]).filter(n => n.tagName === 'strong')) assert.deepEqual(n.attrs, [], 'Publisher markup retains no substituted native fields');
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
  for (const field of ['viewBox', 'role', 'style', 'aria-labelledby', 'data-copper-kind']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'data-copper-kind') === 'capacity'); changeAttribute(root, field, 'changed'); assert.throws(() => figures(tree, 'fr')); }
  for (const [field, value] of [['font-family', 'Arial'], ['font-size', '1'], ['x', '0'], ['fill', 'url(https://example.org/x)']]) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'data-copper-kind') === 'capacity'), label = nodes(root).find(n => n.tagName === 'text'); changeAttribute(label, field, value); assert.throws(() => figures(tree, 'fr')); }
  for (const type of ['script', 'foreignObject', 'image', 'animate']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'data-copper-kind') === 'capacity'); root.childNodes.push({ nodeName: type, tagName: type, attrs: [], childNodes: [] }); assert.throws(() => figures(tree, 'fr')); }
  for (const page of pages) for (const mobile of [false, true]) {
    const tree = parse(page.html), roots = nodes(tree).filter(n => n.tagName === 'svg' && attr(n, 'data-copper-kind') === 'flows');
    const label = nodes(roots[mobile ? 1 : 0]).find(n => n.tagName === 'text' && text(n) === (page.lang === 'fr' ? 'stock final' : 'closing stock'));
    assert.ok(label); changeAttribute(label, 'fill', 'var(--color-muted, #8b909b)'); assert.throws(() => figures(tree, page.lang));
  }
});
test('compiled bibliographies retain twenty-one canonical IDs and complete source link fields', () => {
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
  const e = firstSource(); nodes(e.section).find(n => n.tagName === 'strong').attrs.push({ name: 'onclick', value: 'bad' }); assert.throws(() => sourceFields(e.tree, 'fr'));
});
