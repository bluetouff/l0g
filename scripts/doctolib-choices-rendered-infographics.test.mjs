import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';

const pages = ['fr', 'en'].map(lang => ({ lang, html: readFileSync(new URL(`../dist/${lang === 'fr' ? 'posts/doctolib-nvidia-liberte-changer-outil' : 'en/analysis/doctolib-nvidia-freedom-to-switch-tools'}/index.html`, import.meta.url), 'utf8') }));
const nodes = n => [n, ...(n.childNodes ?? []).flatMap(nodes)];
const attr = (n, k) => n.attrs?.find(a => a.name === k)?.value;
const text = n => n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(text).join('');
const canonical = n => n.nodeName === '#text' ? ['#text', n.value] : [n.tagName, (n.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), (n.childNodes ?? []).filter(c => c.nodeName !== '#text' || c.value.trim() || ['text', 'title', 'desc', 'metadata'].includes(n.tagName)).map(canonical)];
// All complete browser-tree goldens independently derive from supplied SVG exports.
const originals = {
  "lifecycle-fr-desktop": {"rawHash":"043a8dc5a201eb288e76b83a9d22bb2b748e9cc08974eb63cea04c29e1460176","domHash":"e6489aa1f0c508b6ff4c466c155a4554bc011d72c1cb4c3d2cf44affcd94109a","viewBox":"0 0 1000 857"},
  "lifecycle-fr-mobile": {"rawHash":"cd21a9e7924756faa7e0b8479090794e7186109938d0f96c18699e3738ef973d","domHash":"3bf8f2bc52da9ea5c7814d1f5e8839cf6a67153f6aa68aee33de99b42d03f16c","viewBox":"0 0 400 1233"},
  "lifecycle-en-desktop": {"rawHash":"a52e827431f51dab72190d25abddda415c080c553979a2173b86e2db521fea52","domHash":"bcdf2017bf2c71d9f0fe07f5fd38ce33bb5f873f1aab8a8a9d109f9cbb5a365c","viewBox":"0 0 1000 857"},
  "lifecycle-en-mobile": {"rawHash":"ba1ef0ffcac555f2e6757b711d86e3d0bcb20f27a3c87940f3cb22b245b038bd","domHash":"638140b92784c42c96cfc57f101dbc399939fc46b0e3e6eadbacd9472a67ce74","viewBox":"0 0 400 1233"},
  "evidence-fr-desktop": {"rawHash": "8fef851b8919bad098cf1faf820f3e34ad1519281af3569544068b0ec583c354", "domHash": "d46206a6f2dd18b0d116d590d479fe5e661e6f57afa3359117cb5e59ed7b128e", "viewBox": "0 0 1000 833"},
  "evidence-fr-mobile": {"rawHash": "bb131e7e0026891c7407e8d27970f0fdb2ecb0fe994d60192c8afbe4aad0efcd", "domHash": "dc289c41fb9d6a650dd96dcac0dec430578630ebb6bd8108ab67d95d9552c3bf", "viewBox": "0 0 400 1039"},
  "evidence-en-desktop": {"rawHash": "d7413544bdc31caf894eb8f541922333d612b8ce360e1332261c3378e9376646", "domHash": "93c2abad399901aed5d0ac7a6479e4e46e7420be9232b6651d1be9bf9ee779f5", "viewBox": "0 0 1000 833"},
  "evidence-en-mobile": {"rawHash": "708f0a7bfacb855ea48fbc4e02c3742b2998365b66aae95cbebde4a4d4bee97f", "domHash": "d731bedb48fd5c24e860b4050059c7fda8e29f094a6eedda136203043639c043", "viewBox": "0 0 400 1039"},
  "network-fr-desktop": {"rawHash": "ffdece8d33daf8e9d141fd41687dadcb522dd6df118ce5bf0b129b0c1aaa2948", "domHash": "fc53102d408539183e5cd504ccbd5982b115b9d91968268b3888fcb3b27381b2", "viewBox": "0 0 1000 845"},
  "network-fr-mobile": {"rawHash": "b87efd70ada814112329d9e933fe8b38ce7b2f0697a17dcc6a876d7f9d043cbc", "domHash": "43c1e7bb531cb0b0dda6473c994a64565beebfac513a7873223584d0c7a2cd5f", "viewBox": "0 0 400 1173"},
  "network-en-desktop": {"rawHash": "17303da764f54d3b7ece4ffb1df7d8223c442cb3e3c3e9e2d528a9131a6eb924", "domHash": "b888a6b57e34246fa3b15d35b6c77ba9bd348705dc69ad82529c3119d57cca9a", "viewBox": "0 0 1000 845"},
  "network-en-mobile": {"rawHash": "0f9fba3d213fdd8f0345bef44962bf37420c50dc9bd22cfd320084ea2f99c4db", "domHash": "a808fa5b7f4232e5b6b29f8c8ddc4dd67586e6623534821502b7a71570532c5a", "viewBox": "0 0 400 1173"},
  "routes-fr-desktop": {"rawHash": "d458af073ea92cafe06864e60f82f83c9e7b04a62629f1acbc288563bb765a43", "domHash": "840a19a18c5fb9f0695e4e1884d2aed0874fe66fd3ac93253e0fbc6a3122699f", "viewBox": "0 0 1000 886"},
  "routes-fr-mobile": {"rawHash": "3294f96914c439c82bb8d83a5be701286e9419c653343cc61edd1a6f316cddca", "domHash": "4d7d43d02d9cd3eddf9b92d3e4aef8c1f5c874e6898e1d7cd5daad095904c9c0", "viewBox": "0 0 400 1221"},
  "routes-en-desktop": {"rawHash": "02ca5b7939b77e80f5498361bc76f8431586d9959f7d764eac4b8a8a3ebad2da", "domHash": "ee6dfd56ecf4b2ba7d9e965d2461773b0d48388100d590ddae0a86436ffb607c", "viewBox": "0 0 1000 886"},
  "routes-en-mobile": {"rawHash": "a624f32e1042998c6445b652178095bcd0802805a6d16dba4b62980cad1be5ce", "domHash": "9fad185a75a6a62065a3749b55d9edb5ce225d26c77a92515cd2d0f7437a14f7", "viewBox": "0 0 400 1221"},
  "export-fr-desktop": {"rawHash": "1c386fea187323a50133fb7017f6dc36c4df7917c0100a76590fc7afffdf1235", "domHash": "3ca373eea0710be58b36b575969b56c506ff85264514890e52020b6aef6fba78", "viewBox": "0 0 1000 884"},
  "export-fr-mobile": {"rawHash": "c0ef18377338b2aeffdb1ad20ea7a13229d8d6fb06eeb97c705a8d91601f3ad0", "domHash": "1633774d860e3f9c6f683b2b54a04a3c79d08fa51c74a24ef27fa0719065419a", "viewBox": "0 0 400 1311"},
  "export-en-desktop": {"rawHash": "29a990dd83101fb483b7690fb9bcfeb8cf6f5628ed2e80a9effa0cc8d55d2abf", "domHash": "c6906c2021823bdba518821acb5da0033f66a4313de96b02a85117edb52139a0", "viewBox": "0 0 1000 884"},
  "export-en-mobile": {"rawHash": "190fa81079bd526af042d3325cbbdecb3a0be143a964043cf8df7671d6128d18", "domHash": "0e054ac2451cd2a9e00f89bd5ba6709f15f82d5c66a849356cd2218471b092c2", "viewBox": "0 0 400 1311"},
  "autonomy-fr-desktop": {"rawHash": "e3c6f344a02703fb0b45d42fb3f7173258452db0f53c196beb71bd282dd09e20", "domHash": "cda22f01fb24ca5dd31536d9660073d8455121fdfe8d6bd41414816a21762f26", "viewBox": "0 0 1000 880"},
  "autonomy-fr-mobile": {"rawHash": "32ea7b9fcfd896dff3e4c060ddae311a59a17f7bea2ec1be51f850b8f8ece3c7", "domHash": "d37f5bb761d42ff1cced8c2290ccffe9b57fa20a2809dd0cf14dc27641a744b9", "viewBox": "0 0 400 1453"},
  "autonomy-en-desktop": {"rawHash": "4b14015d2bda0ea1a17997d9e1abe74c527a43830b3c135a1c2e82727ed78276", "domHash": "66cb2636d48bf2909aaad3573908abc800b6141cc8de4ffdc09fb033970fb757", "viewBox": "0 0 1000 880"},
  "autonomy-en-mobile": {"rawHash": "52c6c35ecd8f0541172dc5e6073e73998212712b9d49a980f5404bbf797d01d1", "domHash": "287395a830aa72bc34b903ef18cc421ba10b8d68163e7f947daa527162c3e51e", "viewBox": "0 0 400 1453"}
};
const reviewedReferences = [[["https://about.doctolib.fr/news/doctolib-va-accelerer-dans-lia-en-sante-grace-a-un-investissement-de-nvidia/","Doctolib va accélérer dans l’IA en santé grâce à un investissement de NVIDIA"]],[["https://community.doctolib.fr/t/nvidia-rejoint-doctolib-pour-accelerer-lia-en-sante-en-europe/203785","NVIDIA rejoint Doctolib pour accélérer l’IA en santé, en Europe"]],[["https://live.euronext.com/en/financial-news/nvidia-buys-stakes-french-tech-startups-doctolib-genesis-ai","Nvidia buys stakes in French tech startups Doctolib, Genesis AI"]],[["https://doctolib.zendesk.com/hc/fr/articles/30839804494996-Comment-utiliser-l-Assistant-de-consultation-avec-Doctolib-M%C3%A9decin","Comment utiliser l’Assistant de consultation avec Doctolib Médecin ?"]],[["https://doctolib.zendesk.com/hc/fr/articles/31108321772436-M-informer-sur-la-confidentialit%C3%A9-et-la-s%C3%A9curit%C3%A9-des-donn%C3%A9es-de-l-Assistant-de-consultation","Confidentialité et sécurité des données de l’Assistant de consultation"]],[["https://doctolib.zendesk.com/hc/fr/articles/37479338946452-Comment-utiliser-l-Assistant-de-consultation-autonome","Comment utiliser l’Assistant de consultation autonome ?"]],[["https://doctolib.zendesk.com/hc/fr/articles/4767400892308-Exporter-ma-base-patients-Doctolib-M%C3%A9decin","Exporter ma base patients Doctolib Médecin"]],[["https://doctolib.zendesk.com/hc/fr/articles/4409598721940-Exporter-un-dossier-patient-dans-Doctolib-M%C3%A9decin","Exporter un dossier patient dans Doctolib Médecin"]],[["https://academic.oup.com/jamia/article/33/5/990/8494986","Comparing ambient scribes: a randomized crossover clinical trial addressing ambient scribe technologies’ impact on physician burnout"]],[["https://esante.gouv.fr/produits-services/hds","Certification HDS : tout savoir"]],[["https://www.autoritedelaconcurrence.fr/en/press-release/autorite-fines-doctolib-eu4665000-abusing-its-dominant-position-online-medical","The Autorité fines Doctolib €4,665,000 for abusing its dominant position"]],[["https://www.autoritedelaconcurrence.fr/sites/default/files/integral_texts/2025-11/25d06_version_publique.pdf","Décision 25-D-06, version publique"]],[["https://www.autoritedelaconcurrence.fr/fr/decision/relative-des-pratiques-mises-en-oeuvre-dans-le-secteur-de-la-prise-de-rendez-vous-medicaux","Décision 25-D-06 : suivi du recours"]],[["https://about.doctolib.com/news/doctolib-will-appeal-the-decision-of-the-french-competition-authority/","Doctolib will appeal the decision of the French Competition Authority"]],[["https://esante.gouv.fr/ens/offre/ci-sis","CI-SIS : Cadre d’interopérabilité des systèmes d’information de santé"]],[["https://health.ec.europa.eu/ehealth-digital-health-and-care/european-health-data-space-regulation-ehds_en","European Health Data Space Regulation"]],[["https://doctolib.zendesk.com/hc/fr/articles/15593310583700-D%C3%A9sactiver-la-r%C3%A9utilisation-des-donn%C3%A9es-par-Doctolib","Désactiver la réutilisation des données par Doctolib"]],[["https://about.doctolib.fr/expertise-medicale/","Expertise médicale"]],[["https://www.cnil.fr/fr/definir-une-finalite-0","IA : définir une finalité"]],[["https://www.cnil.fr/fr/assurer-que-le-traitement-est-licite-reutilisation-des-donnees","IA : réutilisation des données, tests et vérifications nécessaires"]]];
const sourceLinks = {fr:reviewedReferences,en:reviewedReferences};
const kinds = ['lifecycle','evidence','network','routes','export','autonomy'];
const references = {lifecycle:[4,5],evidence:[9],network:[11,12,13,14],routes:[4,6],export:[7,8,15],autonomy:[1,2,7,10,15]};
const classes = (n, name) => (attr(n, 'class') ?? '').split(/\s+/u).includes(name);
function figures(tree, lang) {
  const all = nodes(tree), figures = all.filter(n => n.tagName === 'figure' && classes(n, 'doctolib-choices-figure')); assert.equal(figures.length, 6);
  for (const [i, figure] of figures.entries()) {
    assert.deepEqual(['id', 'data-figure', 'data-kind'].map(k => attr(figure, k)), [`figure-${i + 1}`, String(i + 1).padStart(2, '0'), kinds[i]]);
    const roots = nodes(figure).filter(n => n.tagName === 'svg'); assert.equal(roots.length, 2);
    for (const [j, root] of roots.entries()) {
      const key = `${kinds[i]}-${lang}-${j ? 'mobile' : 'desktop'}`, prefix = `dn-${kinds[i]}-${lang}-${j ? 'mobile' : 'desktop'}`;
      assert.deepEqual(root.attrs.map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), Object.entries({ xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto', 'data-doctolib-kind': kinds[i] }).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
      const hash = createHash('sha256').update(JSON.stringify(canonical(root))).digest('hex'); assert.equal(hash, originals[key].domHash, `${key}: geometry/text/native attributes`);
      assert.ok(classes(root.parentNode, `doctolib-choices-${j ? 'mobile' : 'desktop'}`));
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
  const lists = all.filter(n => n.tagName === 'ol' && attr(n, 'class') === 'doctolib-choices-sources'); assert.equal(lists.length, 1);
  assert.deepEqual(lists[0].attrs.map(a => [a.name, a.value]), [['class', 'doctolib-choices-sources']]);
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
  for (const field of ['viewBox', 'role', 'style', 'aria-labelledby']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'aria-labelledby') === 'dn-lifecycle-fr-desktop-title dn-lifecycle-fr-desktop-desc'); changeAttribute(root, field, 'changed'); assert.throws(() => figures(tree, 'fr')); }
  for (const [field, value] of [['font-family', 'Arial'], ['font-size', '1'], ['x', '0'], ['fill', 'url(https://example.org/x)']]) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'aria-labelledby') === 'dn-lifecycle-fr-desktop-title dn-lifecycle-fr-desktop-desc'), label = nodes(root).find(n => n.tagName === 'text'); changeAttribute(label, field, value); assert.throws(() => figures(tree, 'fr')); }
  for (const type of ['script', 'foreignObject', 'image', 'animate']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'aria-labelledby') === 'dn-lifecycle-fr-desktop-title dn-lifecycle-fr-desktop-desc'); root.childNodes.push({ nodeName: type, tagName: type, attrs: [], childNodes: [] }); assert.throws(() => figures(tree, 'fr')); }
});
test('compiled bibliographies retain twenty canonical IDs and complete source link fields', () => {
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
