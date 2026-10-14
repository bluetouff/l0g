import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';

const pages = ['fr', 'en'].map(lang => ({ lang, html: readFileSync(new URL(`../dist/${lang === 'fr' ? 'posts/humana-blackrock-promesse-cliniques' : 'en/analysis/humana-blackrock-promise-behind-clinics'}/index.html`, import.meta.url), 'utf8') }));
const nodes = n => [n, ...(n.childNodes ?? []).flatMap(nodes)];
const attr = (n, k) => n.attrs?.find(a => a.name === k)?.value;
const text = n => n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(text).join('');
const canonical = n => n.nodeName === '#text' ? ['#text', n.value] : [n.tagName, (n.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), (n.childNodes ?? []).filter(c => c.nodeName !== '#text' || c.value.trim() || ['text', 'title', 'desc', 'metadata'].includes(n.tagName)).map(canonical)];
// Complete native browser-tree goldens independently derived from supplied exports.
const originals = {
  "routes-en-desktop": {
    "rawHash": "246420e39ea89e0b4b42fbf5e5b7ef35d1fe8d1dcffbe7ee3f8c175a38992647",
    "domHash": "855791b5366268d5185c6e3be8af6cb447634db564690a43c3a859c8d2a6cfb4",
    "viewBox": "0 0 1000 770"
  },
  "routes-en-mobile": {
    "rawHash": "6e61a46ed9da14627389678a82aa90ccd0465968e7b651619b68c7dc3cb9108b",
    "domHash": "e9623b0c8f4c2fdff94cdcada69f5e8a534d5ca7ac0dcd18849c13c68242ca84",
    "viewBox": "0 0 400 1120"
  },
  "routes-fr-desktop": {
    "rawHash": "7180e2c3e382c8fc5c753e9df887161ba607f29bb24ba899168d49183bd842b3",
    "domHash": "0896c4b61c35e3be3fc0557a8511beb3df5a3783f28906de50e360f6e32c63e1",
    "viewBox": "0 0 1000 770"
  },
  "routes-fr-mobile": {
    "rawHash": "b205a636415e2882acb8dcd9a22cb0e64a00d3b50ce0e1ff358a75f212db7a15",
    "domHash": "72cf52b4fa4f8ff3ec80ef20953fda21445f55584b38d001d76cc3650acfcbb0",
    "viewBox": "0 0 400 1120"
  },
  "clock-en-desktop": {
    "rawHash": "62ee1f23f358722a22ce98bcb71959d32518c5cb4abbef9fabda0856ec1946fe",
    "domHash": "768bbbf9d5973997ef91f0d6a28bf69c803a4ac4409744a828388e2b2c491c6b",
    "viewBox": "0 0 1000 820"
  },
  "clock-en-mobile": {
    "rawHash": "4e7cb43910f1dfa81466408e375c499ea812bf2566ae586d5611effee87cbd61",
    "domHash": "3ad5ee676c0017e1e548e5d3cc7d74e1c425546d1074ce9dfa8a92b47ab25631",
    "viewBox": "0 0 400 1020"
  },
  "clock-fr-desktop": {
    "rawHash": "27518573c7d7cb479272a2026030b0d5729b6de4847010f49d83714b9e60f65f",
    "domHash": "f7e0a960405c1567d3b08c25b2804b6360daf039ea1e28be0a17d16dcf52b9a0",
    "viewBox": "0 0 1000 820"
  },
  "clock-fr-mobile": {
    "rawHash": "d5779f05fa201f94c8cd40fe6e72a60a119e2447f61d9e10f14b6d1d7b09a29f",
    "domHash": "543668f5e0ebde497436d4a69e1e244cbf03cabb3ba0015bf3381474570185b2",
    "viewBox": "0 0 400 1020"
  },
  "balance-en-desktop": {
    "rawHash": "7262b214c5f0e42bf936445f723a70dc844e77967d8d10bcd9bb33317da0766f",
    "domHash": "8769ccbb2db4a59ba12b81502f0604083d7420c3f46d7a2df274d72dde69ed7d",
    "viewBox": "0 0 1000 810"
  },
  "balance-en-mobile": {
    "rawHash": "5a6deec080d1247d0097a3ed71913c9f0215cf7f8de9282573382f22f0a9a1ee",
    "domHash": "7ea341d4f3c86027800cd13ab593addbef059707ee660c4436ad163b74e47ce0",
    "viewBox": "0 0 400 990"
  },
  "balance-fr-desktop": {
    "rawHash": "67544635fd217f277f7d16ac490c007962b6315158a98324cca8234b227a38c0",
    "domHash": "940f975b5e7e81c575d49e8983d99807e465723d4437c36a2b2730c1e5793048",
    "viewBox": "0 0 1000 810"
  },
  "balance-fr-mobile": {
    "rawHash": "2b91ba81a4b040e338da6052b93a942246a7924584282b737de221f0024a7054",
    "domHash": "2db4413e45e5e6f4cda295874ef05aa40b96bbd0e11ca6c94c019f121e8c6a0b",
    "viewBox": "0 0 400 990"
  },
  "floor-en-desktop": {
    "rawHash": "e2e0ed622e90da20c5b9fd5cac465e85df15999fe6e37dcb2422f230b96600ff",
    "domHash": "aec2f788275648637755f6b95c7af4fffd6395949b620b0bffbd9b450e8db220",
    "viewBox": "0 0 1000 805"
  },
  "floor-en-mobile": {
    "rawHash": "6763ddb038bfb817a307f857e79ac6d0c32dbcbc00643ff8a5186e445963767c",
    "domHash": "cb39037ae72283c69f6e28c094506d7e43ac8ff878484ef9d4dcbe96663ca7b6",
    "viewBox": "0 0 400 1200"
  },
  "floor-fr-desktop": {
    "rawHash": "88f8194c823154d2c7a814d3d3041dca78b4403d8ef166838bd48ab16b3f6307",
    "domHash": "19fc77d586140c995780fcad01971117aba78d37dced20bb0a3137f844bed206",
    "viewBox": "0 0 1000 805"
  },
  "floor-fr-mobile": {
    "rawHash": "c8d018bed23019213acb9970442ed26824508f5bd9f730ba85450f47558d8ad8",
    "domHash": "47625aea6327e89a90c5fd6d1878c79b001154a71fa6f76d53a46e8cb36cc7cd",
    "viewBox": "0 0 400 1200"
  },
  "care-en-desktop": {
    "rawHash": "73080881df0702842cea1ce814af27a044bc6756d7a14cf45d6f9dc36838c323",
    "domHash": "de801d45a2e884095d4ab83258616b1a92e48986aacff20ee28e03528abf793d",
    "viewBox": "0 0 1000 915"
  },
  "care-en-mobile": {
    "rawHash": "bce5792427fa0cbdd399379dc4a30a360b9d30dd8ed54350cc80b6a928c259f8",
    "domHash": "17497966d7c2b78b18d8f7f99b0ee9bd4c374b4587ba6a2f2aaa8b1ce9386c44",
    "viewBox": "0 0 400 1210"
  },
  "care-fr-desktop": {
    "rawHash": "93def22780b9fa9307a0e07ef41dd55ce95cd8a9df9e4f080fbd0084abc8f59d",
    "domHash": "f8d8b6f164c1ea4cdcb51517a6abe1c4f9077e4a4dd03187e6f60efdc1bf9b30",
    "viewBox": "0 0 1000 915"
  },
  "care-fr-mobile": {
    "rawHash": "c1cfc54fc7be83709afd47e418373a92669403a7e88ab8e10b584f9e87d74b10",
    "domHash": "93e8ff197436d099ebc72100f041087375c17fcf885acd5c15f1185610ae7c57",
    "viewBox": "0 0 400 1210"
  },
  "stress-en-desktop": {
    "rawHash": "54085bda39344c0ef7270dc9aff17a1e28474c958983eae8a4d984eaa7f137c0",
    "domHash": "b594058a80c96ab5b645fec8e46aace2508ded149e41a838f69216c67c7a678c",
    "viewBox": "0 0 1000 855"
  },
  "stress-en-mobile": {
    "rawHash": "9ce70f60a4ddfb7da3c6c34da5e825ec63d1a4de9d5f3d21ff5187d5273ad3d0",
    "domHash": "aa1cdb71f29bedefcbfd38c1ac339959f65ca9ab1a0f6288d86248fe7bec6e03",
    "viewBox": "0 0 400 1120"
  },
  "stress-fr-desktop": {
    "rawHash": "b770d3384d4efa5fb539e50e322fbc8102e915f441417a58e97e88b91a8ac073",
    "domHash": "1137f787a2ae77d6c176de0fc97ae4bb5232446e544573f33f5339b9b1f67b65",
    "viewBox": "0 0 1000 855"
  },
  "stress-fr-mobile": {
    "rawHash": "928b42b031ff9007e77cb53222d4379a036331ffcf7b2f07abf87b6e2af99910",
    "domHash": "532bb29677e7cb6e1cbe6b8cdacd2811f9a2ce8ff71d8f030364cfb9979f82ca",
    "viewBox": "0 0 400 1120"
  }
};
// Exact canonical source fields independently reviewed, then frozen from the
// controlled bilingual copy. Every observation retains its published period and scope.
const sourceLinks = {
  "fr": [
    [
      [
        "https://humana.gcs-web.com/news-releases/news-release-details/humana-announces-new-strategic-joint-venture-blackrock-manage",
        "Humana, annonce de la nouvelle coentreprise"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/49071/000004907126000060/hum-20261013.htm",
        "Humana, Form 8-K du 13 octobre 2026"
      ],
      [
        "https://humana.gcs-web.com/static-files/dfe310cd-69fc-4205-ae9f-8477b5a0d9bc",
        "Copie PDF publiée par Humana"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/49071/000004907126000050/hum-20260630.htm",
        "Humana, Form 10-Q au 30 juin 2026"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/49071/000004907126000009/hum-20251231.htm",
        "Humana, Form 10-K pour 2025"
      ]
    ],
    [
      [
        "https://humana.gcs-web.com/node/35751",
        "Humana–WCAS, annonce de la deuxième coentreprise"
      ]
    ],
    [
      [
        "https://humana.gcs-web.com/news-releases/news-release-details/humanas-partners-primary-care-and-welsh-carson-anderson-stowe",
        "Humana–WCAS, annonce du partenariat initial"
      ]
    ],
    [
      [
        "https://www.cms.gov/priorities/innovation/key-concepts/value-based-care",
        "CMS, Value-Based Care"
      ]
    ],
    [
      [
        "https://www.cms.gov/newsroom/fact-sheets/2026-medicare-advantage-part-d-rate-announcement",
        "CMS, annonce finale des paramètres Medicare Advantage 2026"
      ]
    ],
    [
      [
        "https://ir.blackrock.com/news-and-events/press-releases/press-releases-details/2025/BlackRock-Completes-Acquisition-of-HPS-Investment-Partners/default.aspx",
        "BlackRock, finalisation de l’acquisition de HPS"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/49071/000004907126000060/0000049071-26-000060-index.htm",
        "SEC EDGAR, inventaire des pièces du 8-K"
      ]
    ],
    [
      [
        "https://live.euronext.com/en/financial-news/blackrock-replaces-wcas-joint-venture-humana-senior-clinics",
        "Reuters via Euronext, BlackRock replaces WCAS in joint venture with Humana senior clinics"
      ]
    ]
  ],
  "en": [
    [
      [
        "https://humana.gcs-web.com/news-releases/news-release-details/humana-announces-new-strategic-joint-venture-blackrock-manage",
        "Humana, new joint-venture announcement"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/49071/000004907126000060/hum-20261013.htm",
        "Humana, Form 8-K, 13 October 2026"
      ],
      [
        "https://humana.gcs-web.com/static-files/dfe310cd-69fc-4205-ae9f-8477b5a0d9bc",
        "Humana’s PDF copy"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/49071/000004907126000050/hum-20260630.htm",
        "Humana, Form 10-Q for 30 June 2026"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/49071/000004907126000009/hum-20251231.htm",
        "Humana, 2025 Form 10-K"
      ]
    ],
    [
      [
        "https://humana.gcs-web.com/node/35751",
        "Humana–WCAS, second joint-venture announcement"
      ]
    ],
    [
      [
        "https://humana.gcs-web.com/news-releases/news-release-details/humanas-partners-primary-care-and-welsh-carson-anderson-stowe",
        "Humana–WCAS, initial partnership announcement"
      ]
    ],
    [
      [
        "https://www.cms.gov/priorities/innovation/key-concepts/value-based-care",
        "CMS, Value-Based Care"
      ]
    ],
    [
      [
        "https://www.cms.gov/newsroom/fact-sheets/2026-medicare-advantage-part-d-rate-announcement",
        "CMS, final 2026 Medicare Advantage payment announcement"
      ]
    ],
    [
      [
        "https://ir.blackrock.com/news-and-events/press-releases/press-releases-details/2025/BlackRock-Completes-Acquisition-of-HPS-Investment-Partners/default.aspx",
        "BlackRock, completion of the HPS acquisition"
      ]
    ],
    [
      [
        "https://www.sec.gov/Archives/edgar/data/49071/000004907126000060/0000049071-26-000060-index.htm",
        "SEC EDGAR, 8-K filing inventory"
      ]
    ],
    [
      [
        "https://live.euronext.com/en/financial-news/blackrock-replaces-wcas-joint-venture-humana-senior-clinics",
        "Reuters via Euronext, BlackRock replaces WCAS in joint venture with Humana senior clinics"
      ]
    ]
  ]
};
const kinds = ['routes', 'clock', 'balance', 'floor', 'care', 'stress'];
const references = { routes: [1, 2, 9], clock: [2, 3, 5], balance: [2, 3, 4], floor: [2], care: [4, 7], stress: [2, 3, 4, 8] };
const classes = (n, name) => (attr(n, 'class') ?? '').split(/\s+/u).includes(name);
function figures(tree, lang) {
  const all = nodes(tree), figures = all.filter(n => n.tagName === 'figure' && classes(n, 'clinic-risk-figure')); assert.equal(figures.length, 6);
  for (const [i, figure] of figures.entries()) {
    assert.deepEqual(['id', 'data-figure', 'data-kind'].map(k => attr(figure, k)), [`figure-${i + 1}`, String(i + 1).padStart(2, '0'), kinds[i]]);
    const roots = nodes(figure).filter(n => n.tagName === 'svg'); assert.equal(roots.length, 2);
    for (const [j, root] of roots.entries()) {
      const key = `${kinds[i]}-${lang}-${j ? 'mobile' : 'desktop'}`, prefix = `hbr-${kinds[i]}-${lang}-${j ? 'm' : 'd'}`;
      assert.deepEqual(root.attrs.map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), Object.entries({ xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto', 'data-kind': kinds[i] }).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
      const hash = createHash('sha256').update(JSON.stringify(canonical(root))).digest('hex'); assert.equal(hash, originals[key].domHash, `${key}: geometry/text/native attributes`);
      assert.ok(classes(root.parentNode, `clinic-risk-${j ? 'mobile' : 'desktop'}`));
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
  const lists = all.filter(n => n.tagName === 'ol' && attr(n, 'class') === 'sources-list clinic-risk-sources'); assert.equal(lists.length, 1);
  assert.deepEqual(lists[0].attrs.map(a => [a.name, a.value]), [['class', 'sources-list clinic-risk-sources']]);
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
  for (const field of ['viewBox', 'role', 'style', 'aria-labelledby', 'data-kind']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'data-kind') === 'routes'); changeAttribute(root, field, 'changed'); assert.throws(() => figures(tree, 'fr')); }
  for (const [field, value] of [['font-family', 'Arial'], ['font-size', '1'], ['x', '0'], ['fill', 'url(https://example.org/x)']]) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'data-kind') === 'routes'), label = nodes(root).find(n => n.tagName === 'text'); changeAttribute(label, field, value); assert.throws(() => figures(tree, 'fr')); }
  for (const type of ['script', 'foreignObject', 'image', 'animate']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'data-kind') === 'routes'); root.childNodes.push({ nodeName: type, tagName: type, attrs: [], childNodes: [] }); assert.throws(() => figures(tree, 'fr')); }
});
test('compiled bibliographies retain eleven canonical IDs and complete source link fields', () => {
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
