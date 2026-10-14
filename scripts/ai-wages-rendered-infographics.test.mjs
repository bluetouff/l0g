import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';

const pages = ['fr', 'en'].map(lang => ({ lang, html: readFileSync(new URL(`../dist/${lang === 'fr' ? 'posts/ia-salaires-pouvoir-partir' : 'en/analysis/ai-wages-power-walk-away'}/index.html`, import.meta.url), 'utf8') }));
const nodes = n => [n, ...(n.childNodes ?? []).flatMap(nodes)];
const attr = (n, k) => n.attrs?.find(a => a.name === k)?.value;
const text = n => n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(text).join('');
const canonical = n => n.nodeName === '#text' ? ['#text', n.value] : [n.tagName, (n.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), (n.childNodes ?? []).filter(c => c.nodeName !== '#text' || c.value.trim() || ['text', 'title', 'desc', 'metadata'].includes(n.tagName)).map(canonical)];
// Complete tree goldens derived from original exports, never from generated HTML.
const originals = {
  "options-fr-desktop": {
    "rawHash": "414289e235f68f175a0779190b93ee7a741c4bab463dc45f5540a03257253b38",
    "domHash": "f22050be302e29d83e4ae4b2e7436dd927bf585f4c2c03281ea0516fd67d7085",
    "viewBox": "0 0 960 962"
  },
  "options-fr-mobile": {
    "rawHash": "bc4970079a233772257014f277895b2415b1928ddf69c5c3cf7f729a2ab414a5",
    "domHash": "8b5294637cf159f28c7cfbcda0e9184a67f3a235365bcfefa17ce574c14bfd89",
    "viewBox": "0 0 400 1152"
  },
  "entry-fr-desktop": {
    "rawHash": "9cc52141c2e43d8f9b507128ec29195d510ce6188567f79c98f3a4d72a7c9258",
    "domHash": "09cc998e22b203467883ce81d47bb61910f7245190f2a581bdc55e2378b279e3",
    "viewBox": "0 0 960 909"
  },
  "entry-fr-mobile": {
    "rawHash": "21dc484ff578592d36a70361c968a1daf1d47669b5edffc9d8cf891449d98a14",
    "domHash": "bdda8721b66ddd3820ba6afe40c65322b786261a8ac223e67fa702d900cf015c",
    "viewBox": "0 0 400 1175"
  },
  "expectations-fr-desktop": {
    "rawHash": "41e1ab596c53aae5578a646d74a3f90eece5e127b54ea66415178b4942883d37",
    "domHash": "f3041477525d31a12489cb802af8f231f078e602805385af6ddff696b905c864",
    "viewBox": "0 0 960 894"
  },
  "expectations-fr-mobile": {
    "rawHash": "4fbbe1ae1eea5f20bbe81167560c1425718e14cd18d0240b4a3cf91105256323",
    "domHash": "acec12f7b091ff57e1708353696cca6b5df9d7e290f6dfdd0c82c60ec13244b8",
    "viewBox": "0 0 400 1031"
  },
  "sharing-fr-desktop": {
    "rawHash": "833f03b38fd7102c07d20834b228d4f3c1afd06810d352105fe094f13ef13277",
    "domHash": "ce74b8a1503c59e0d013c9013165158d1f3cc17a69756b2fadc7fdbbe576a4c4",
    "viewBox": "0 0 960 833"
  },
  "sharing-fr-mobile": {
    "rawHash": "a774b04b5830a002fa68db2df00fba34145ea13b8d4e3cad0ba5aad09bf8553e",
    "domHash": "b2f77faf3924bf68b972e63b993708c60f6c37154a88c444d3561dd4c6fa9cd4",
    "viewBox": "0 0 400 1098"
  },
  "contracts-fr-desktop": {
    "rawHash": "951f0bed9a944db7c4c6452e0c79dbb2f4aa8e9d846639f4fb5905fc24a60224",
    "domHash": "fabd94ace631b36b9ea785e96215f7220cb43d34baab7edc21c1c3aabfccaf67",
    "viewBox": "0 0 960 849"
  },
  "contracts-fr-mobile": {
    "rawHash": "a096a96922b747f059d090b618a40291bd63f9a6256b81904770c796a8f31da8",
    "domHash": "fed34e96955c0b3b91554ff1cb866c73e90175c53b1941d6793795f8c08d144d",
    "viewBox": "0 0 400 1188"
  },
  "macro-fr-desktop": {
    "rawHash": "86a60078a8b787b4ad9b63ec0c21f217882089ece32d961a760715ac253a1b52",
    "domHash": "590bb4768093eda6fd5dcfb6c9300c1576192d3995937e0d4ae7882c7e9d9437",
    "viewBox": "0 0 960 1045"
  },
  "macro-fr-mobile": {
    "rawHash": "1a08ca1ecc34300ca5301eccf2c6695dfed6e956c92f73f31823512ed8c8dd37",
    "domHash": "9f7890440ce44c5141badcb9a2c704c32bd2e9ad87da89813bf476f3bcb733f5",
    "viewBox": "0 0 400 1393"
  },
  "options-en-desktop": {
    "rawHash": "aa34212263813974ba941ae07a97f6b9d564225c5886391d2a731c70ccfedccb",
    "domHash": "b405828695426c16e2192f82b4a31c200d608298d4757510abe05ba008daae0b",
    "viewBox": "0 0 960 962"
  },
  "options-en-mobile": {
    "rawHash": "0fbc4ae994c4d55ee4dff8fc660c7cacf8da04a20182cd1b149f8f7ff91a0c0b",
    "domHash": "7b0de180c49ddcdda3b915e8499a69f47afadb7da69bb28cd42e49b813fc0402",
    "viewBox": "0 0 400 1125"
  },
  "entry-en-desktop": {
    "rawHash": "e65351a5ecc3af42044234dcc1703a5053d25d2e35af68b1a0920e5abd4defe8",
    "domHash": "0f4bfcbb7b50cbfca808c5fb042561eca16d3beb5c67ec55d8e8f52ad8378478",
    "viewBox": "0 0 960 881"
  },
  "entry-en-mobile": {
    "rawHash": "bfdfe16c578fa24c4f014709d5d584926d7648607a9e8315ee6c32941da0d100",
    "domHash": "6269e27b0fb57771ec89718a1f68aa1398c1b3910d8281009f9fbae48a1e6332",
    "viewBox": "0 0 400 1175"
  },
  "expectations-en-desktop": {
    "rawHash": "641137142d5d62674840354481a6669c7a7c2613e4e4dd3539e4972e2fba0374",
    "domHash": "cac1fe2004c660b39b7ae4922f8cf189e7f20a8c32df40770ef32974731ba89d",
    "viewBox": "0 0 960 851"
  },
  "expectations-en-mobile": {
    "rawHash": "82df029ebb00629667be754feddc51415ac8ded15ded9c4e017d65d19c21f1ad",
    "domHash": "a03b3750a743d7c05d23aa82a35342e7ac6aa9c45eaa6e535b034631c251c0bc",
    "viewBox": "0 0 400 995"
  },
  "sharing-en-desktop": {
    "rawHash": "b80537d94fa764f1756d376c12a8dde7cfaa751e8e12ad8484d88dbef0ad7f88",
    "domHash": "d2e19a2b2fb8a89bc57b1352f827d4e23cc2ff47311a654e068a85ba07c3d417",
    "viewBox": "0 0 960 833"
  },
  "sharing-en-mobile": {
    "rawHash": "cf7e6fb0034655607f646cb8a0c0701ee615bff0d02175ccf9996e1dd439341b",
    "domHash": "415aa85207d643524876fb4bb63de2dc44d7f282acb97327d9f78ab65710231d",
    "viewBox": "0 0 400 1070"
  },
  "contracts-en-desktop": {
    "rawHash": "414f561a52d2fb3ce5e01ad55c21241d9280f6e5194bfbf3058f0c818f97b9ab",
    "domHash": "37187fd4dad237a0e9551f5ef78572b59af6629973dedc8586d57b29666eea19",
    "viewBox": "0 0 960 849"
  },
  "contracts-en-mobile": {
    "rawHash": "683811e9b6a1cf0ece93c201d35fcbef23316c5b4ee721e3d1479b49e4aa4f69",
    "domHash": "72b4e6ef117a416223c6bf388d5dc0a3a881829cea330ca0fc8bf7bded558feb",
    "viewBox": "0 0 400 1224"
  },
  "macro-en-desktop": {
    "rawHash": "66fd6e0e8b6396241ae559b4cb03661d47b776adaa8a9419bdbb8ccba2b5ad72",
    "domHash": "d7852562d22f3d26ac1a5fee00210fa7a5ae8b4ef6a9a4bc1baf121e5a7cee08",
    "viewBox": "0 0 960 1045"
  },
  "macro-en-mobile": {
    "rawHash": "a008adeeb9115b3df5d11913040e69fcd8e6e5cc6be0d67d211b7577374f5702",
    "domHash": "eb75403fd697a5a523c30e76bab0e16a10fee546c2e22b76f7ee8210dcec9581",
    "viewBox": "0 0 400 1393"
  }
};
const kinds = ['options', 'entry', 'expectations', 'sharing', 'contracts', 'macro'];
const references = { options: [1, 2, 3], entry: [5], expectations: [8], sharing: [3], contracts: [11], macro: [1, 9, 10, 12, 13] };
const sourceUrls = [
  "https://www.ecb.europa.eu/press/key/date/2026/html/ecb.sp261013~9db9bf4fd6.en.html",
  "https://www.bde.es/f/webbe/SES/Secciones/Publicaciones/PublicacionesSeriadas/DocumentosTrabajo/25/Files/dt2536e.pdf",
  "https://eminakamura.com/papers/Commoditization.pdf",
  "https://doi.org/10.1093/qje/qjae044",
  "https://digitaleconomy.stanford.edu/app/uploads/2026/08/Canaries_August2026.pdf",
  "https://www.insee.fr/fr/statistiques/8907419",
  "https://www.rfberlin.com/research-insights/still-waters-rapid-currents/",
  "https://www.ecb.europa.eu/press/economic-bulletin/focus/2026/html/ecb.ebbox202602_06~c9f485c478.en.html",
  "https://www.bis.org/publications/working-paper-1325-ai-adoption-productivity-and-employment-evidence-european-firms",
  "https://www.ecb.europa.eu/press/blog/date/2026/html/ecb.blog20260826~e1c1a89999.en.html",
  "https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.pr260916~7bc58ebef4.en.html",
  "https://www.ecb.europa.eu/press/blog/date/2026/html/ecb.blog20261006~35bf3c24cb.en.html",
  "https://www.oecd.org/en/publications/2023/07/oecd-employment-outlook-2023_904bcef3/full-report/social-dialogue-and-collective-bargaining-in-the-age-of-artificial-intelligence_5828691a.html",
  "https://www.ecb.europa.eu/press/blog/date/2026/html/ecb.blog20260304~d9e34fc95f.en.html",
  "https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/3945.pdf",
  "https://www.oecd.org/en/data/indicators/employee-compensation-by-activity.html",
  "https://ec.europa.eu/eurostat/statistics-explained/SEPDF/cache/3278.pdf"
];
const sourceTitles = {
  "fr": [
    "The AI opportunity for Europe",
    "Robot adoption and inflation dynamics",
    "The Commoditization of Labor",
    "Generative AI at Work",
    "Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence",
    "Avec l’essor de l’intelligence artificielle générative, l’investissement numérique tire davantage la croissance aux États-Unis qu’en France, tandis que l’emploi recule dans les activités informatiques des deux côtés de l’Atlantique",
    "Still Waters, Rapid Currents",
    "Adopting and investing in AI: evidence from euro area firms in the SAFE",
    "AI adoption, productivity and employment: evidence from European firms",
    "AI adoption and the productivity promise: what workers report",
    "ECB wage tracker at 2.7% in H1 2027, pointing to a modest uptick in negotiated wage growth",
    "Funding the AI revolution: evidence from euro area sectors",
    "Social dialogue and collective bargaining in the age of artificial intelligence",
    "Artificial Intelligence: friend or foe for hiring in Europe today?",
    "Eurostat : valeur ajoutée",
    "OCDE : rémunération des salariés",
    "Eurostat : excédent brut d’exploitation"
  ],
  "en": [
    "The AI opportunity for Europe",
    "Robot adoption and inflation dynamics",
    "The Commoditization of Labor",
    "Generative AI at Work",
    "Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence",
    "Avec l’essor de l’intelligence artificielle générative, l’investissement numérique tire davantage la croissance aux États-Unis qu’en France, tandis que l’emploi recule dans les activités informatiques des deux côtés de l’Atlantique",
    "Still Waters, Rapid Currents",
    "Adopting and investing in AI: evidence from euro area firms in the SAFE",
    "AI adoption, productivity and employment: evidence from European firms",
    "AI adoption and the productivity promise: what workers report",
    "ECB wage tracker at 2.7% in H1 2027, pointing to a modest uptick in negotiated wage growth",
    "Funding the AI revolution: evidence from euro area sectors",
    "Social dialogue and collective bargaining in the age of artificial intelligence",
    "Artificial Intelligence: friend or foe for hiring in Europe today?",
    "Eurostat: value added",
    "OECD: employee compensation",
    "Eurostat: gross operating surplus"
  ]
};
const supplemental = {
  "fr": {
    "4": [
      [
        "https://danielle.li/assets/docs/GenerativeAIatWork.pdf",
        "texte intégral hébergé par Danielle Li"
      ]
    ],
    "5": [
      [
        "https://digitaleconomy.stanford.edu/news/canariesaug26/",
        "Annonce de la révision."
      ]
    ]
  },
  "en": {
    "4": [
      [
        "https://danielle.li/assets/docs/GenerativeAIatWork.pdf",
        "full paper hosted by Danielle Li"
      ]
    ],
    "5": [
      [
        "https://digitaleconomy.stanford.edu/news/canariesaug26/",
        "Revision announcement."
      ]
    ]
  }
};
const classes = (n, name) => (attr(n, 'class') ?? '').split(/\s+/u).includes(name);
function figures(tree, lang) {
  const all = nodes(tree), figures = all.filter(n => n.tagName === 'figure' && classes(n, 'ai-wages-figure')); assert.equal(figures.length, 6);
  for (const [i, figure] of figures.entries()) {
    assert.deepEqual(['id', 'data-figure', 'data-kind'].map(k => attr(figure, k)), [`figure-${i + 1}`, String(i + 1).padStart(2, '0'), kinds[i]]);
    const roots = nodes(figure).filter(n => n.tagName === 'svg'); assert.equal(roots.length, 2);
    for (const [j, root] of roots.entries()) {
      const key = `${kinds[i]}-${lang}-${j ? 'mobile' : 'desktop'}`, prefix = `aiw-${kinds[i]}-${lang}-${j ? 'm' : 'd'}`;
      assert.deepEqual(root.attrs.map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), Object.entries({ xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto', 'data-ai-wages-kind': kinds[i] }).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
      const hash = createHash('sha256').update(JSON.stringify(canonical(root))).digest('hex'); assert.equal(hash, originals[key].domHash, `${key}: geometry/text/native attributes`);
      assert.ok(classes(root.parentNode, `ai-wages-${j ? 'mobile' : 'desktop'}`));
      for (const type of ['title', 'desc']) { const selected = nodes(root).filter(n => n.tagName === type); assert.equal(selected.length, 1); assert.equal(attr(selected[0], 'id'), `${prefix}-${type}`); assert.ok(text(selected[0]).trim()); }
    }
    const caption = nodes(figure).filter(n => n.tagName === 'figcaption'); assert.equal(caption.length, 1); assert.ok(text(caption[0]).length > 100);
    const links = nodes(caption[0]).filter(n => n.tagName === 'a'); assert.deepEqual(links.map(n => [attr(n, 'href'), text(n)]), references[kinds[i]].map(n => [`#source-${n}`, `[${n}]`]));
    const details = nodes(figure).filter(n => n.tagName === 'details'); assert.equal(details.length, 1); assert.equal(nodes(details[0]).filter(n => n.tagName === 'summary').length, 1); assert.ok(text(details[0]).length > 150);
  }
  const ids = all.map(n => attr(n, 'id')).filter(Boolean); assert.equal(new Set(ids).size, ids.length, 'All document IDs unique');
}
function sourceFields(tree, lang) {
  const all = nodes(tree), lists = all.filter(n => n.tagName === 'ol' && classes(n, 'sources-list')); assert.equal(lists.length, 1);
  const sections = nodes(lists[0]).filter(n => n.tagName === 'li'); assert.deepEqual(sections.map(n => attr(n, 'id')), sourceUrls.map((_, i) => `source-${i + 1}`));
  for (const [i, section] of sections.entries()) {
    const expected = [[sourceUrls[i], sourceTitles[lang][i], undefined, undefined], ...(supplemental[lang][i + 1] ?? []).map(([url, title]) => [url, title, undefined, undefined])];
    const links = nodes(section).filter(n => n.tagName === 'a'); assert.deepEqual(links.map(n => [attr(n, 'href'), text(n), attr(n, 'target'), attr(n, 'rel')]), expected);
    for (const link of links) assert.deepEqual(link.attrs.map(a => a.name), ['href']);
    assert.ok(all.some(n => n.tagName === 'a' && attr(n, 'href') === `#source-${i + 1}`));
  }
}
function changeAttribute(n, k, value) { const a = n.attrs.find(a => a.name === k); assert.ok(a); a.value = value; }
function firstSource() { const tree = parse(pages[0].html), section = nodes(tree).find(n => attr(n, 'id') === 'source-1'), link = nodes(section).find(n => n.tagName === 'a'); return { tree, section, link }; }

test('compiled FR/EN preserve 24 complete original SVGs and six accessible figures each', () => { for (const page of pages) figures(parse(page.html), page.lang); });
test('compiled bibliographies retain all 17 canonical source IDs and complete supplemental links', () => { for (const page of pages) sourceFields(parse(page.html), page.lang); });
test('compiled source checks reject URL, label, field, ID and duplicate-link substitutions', () => {
  const original = sourceUrls[0], host = new URL(original).hostname;
  for (const value of [original + '#hidden', original + '?alias=1', original + '/', original.replace('https:', 'http:'), original.replace(host, `${host}.example.org`), original.replace('https://', 'https://user@'), original.replace('https://', 'https://example.org/'), original.replace('/press/', '/%70ress/'), 'javascript:alert(1)', 'data:text/html,untrusted', ' ' + original]) { const { tree, link } = firstSource(); changeAttribute(link, 'href', value); assert.throws(() => sourceFields(tree, 'fr')); }
  for (const field of ['rel', 'target', 'onload', '__proto__', 'constructor', 'prototype']) { const { tree, link } = firstSource(); link.attrs.push({ name: field, value: 'untrusted' }); assert.throws(() => sourceFields(tree, 'fr')); }
  const a = firstSource(); a.link.childNodes = [{ nodeName: '#text', value: sourceTitles.fr[0] + ' changed' }]; assert.throws(() => sourceFields(a.tree, 'fr'));
  const b = firstSource(); changeAttribute(b.section, 'id', 'source-99'); assert.throws(() => sourceFields(b.tree, 'fr'));
  const c = firstSource(); c.section.childNodes.push({ nodeName: 'a', tagName: 'a', attrs: c.link.attrs.map(x => ({ ...x })), childNodes: [{ nodeName: '#text', value: sourceTitles.fr[0] }] }); assert.throws(() => sourceFields(c.tree, 'fr'));
});
test('compiled SVG expectations detect geometry, text, native attributes and active additions', () => {
  for (const field of ['viewBox', 'role', 'style', 'aria-labelledby', 'data-ai-wages-kind']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'data-ai-wages-kind') === 'options'); changeAttribute(root, field, 'changed'); assert.throws(() => figures(tree, 'fr')); }
  for (const [field, value] of [['font-family', 'Arial'], ['font-size', '1'], ['x', '0'], ['fill', 'url(https://example.org/x)']]) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'data-ai-wages-kind') === 'options'), label = nodes(root).find(n => n.tagName === 'text'); changeAttribute(label, field, value); assert.throws(() => figures(tree, 'fr')); }
  for (const type of ['script', 'foreignObject', 'image', 'animate']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'data-ai-wages-kind') === 'options'); root.childNodes.push({ nodeName: type, tagName: type, attrs: [], childNodes: [] }); assert.throws(() => figures(tree, 'fr')); }
});
