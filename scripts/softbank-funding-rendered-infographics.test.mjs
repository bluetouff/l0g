import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';

const pages = ['fr', 'en'].map(lang => ({ lang, html: readFileSync(new URL(`../dist/${lang === 'fr' ? 'posts/softbank-openai-echeances-liberte-attendre' : 'en/analysis/softbank-openai-financing-freedom-to-wait'}/index.html`, import.meta.url), 'utf8') }));
const nodes = n => [n, ...(n.childNodes ?? []).flatMap(nodes)];
const attr = (n, k) => n.attrs?.find(a => a.name === k)?.value;
const text = n => n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(text).join('');
const canonical = n => n.nodeName === '#text' ? ['#text', n.value] : [n.tagName, (n.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), (n.childNodes ?? []).filter(c => c.nodeName !== '#text' || c.value.trim() || ['text', 'title', 'desc', 'metadata'].includes(n.tagName)).map(canonical)];
// Full browser-tree goldens independently derived from 24 supplied exports:
// twenty unchanged, two French cash titles and two English trigger-copy edits.
// Every geometry, datum, background and other native field remains pinned.
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
const references = { funding: [1, 2, 3], coupons: [3], ltv: [6, 8], cash: [6], trigger: [5, 7], ipo: [4, 11] };
const classes = (n, name) => (attr(n, 'class') ?? '').split(/\s+/u).includes(name);
function figures(tree, lang) {
  const all = nodes(tree), figures = all.filter(n => n.tagName === 'figure' && classes(n, 'softbank-funding-figure')); assert.equal(figures.length, 6);
  for (const [i, figure] of figures.entries()) {
    assert.deepEqual(['id', 'data-figure', 'data-kind'].map(k => attr(figure, k)), [`figure-${i + 1}`, String(i + 1).padStart(2, '0'), kinds[i]]);
    const roots = nodes(figure).filter(n => n.tagName === 'svg'); assert.equal(roots.length, 2);
    for (const [j, root] of roots.entries()) {
      const key = `${kinds[i]}-${lang}-${j ? 'mobile' : 'desktop'}`, prefix = `sbclock-${kinds[i]}-${lang}-${j ? 'm' : 'd'}`;
      assert.deepEqual(root.attrs.map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), Object.entries({ xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto' }).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
      const hash = createHash('sha256').update(JSON.stringify(canonical(root))).digest('hex'); assert.equal(hash, originals[key].domHash, `${key}: geometry/text/native attributes`);
      assert.ok(classes(root.parentNode, `softbank-funding-${j ? 'mobile' : 'desktop'}`));
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
  const lists = all.filter(n => n.tagName === 'ol' && attr(n, 'class') === 'softbank-funding-sources'); assert.equal(lists.length, 1);
  assert.deepEqual(lists[0].attrs.map(a => [a.name, a.value]), [['class', 'softbank-funding-sources']]);
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
  for (const field of ['viewBox', 'role', 'style', 'aria-labelledby']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'aria-labelledby') === 'sbclock-funding-fr-d-title sbclock-funding-fr-d-desc'); changeAttribute(root, field, 'changed'); assert.throws(() => figures(tree, 'fr')); }
  for (const [field, value] of [['font-family', 'Arial'], ['font-size', '1'], ['x', '0'], ['fill', 'url(https://example.org/x)']]) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'aria-labelledby') === 'sbclock-funding-fr-d-title sbclock-funding-fr-d-desc'), label = nodes(root).find(n => n.tagName === 'text'); changeAttribute(label, field, value); assert.throws(() => figures(tree, 'fr')); }
  for (const type of ['script', 'foreignObject', 'image', 'animate']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'aria-labelledby') === 'sbclock-funding-fr-d-title sbclock-funding-fr-d-desc'); root.childNodes.push({ nodeName: type, tagName: type, attrs: [], childNodes: [] }); assert.throws(() => figures(tree, 'fr')); }
});
test('compiled bibliographies retain sixteen canonical IDs and complete source link fields', () => {
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
