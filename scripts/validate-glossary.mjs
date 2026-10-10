import assert from 'node:assert/strict';
import {
  glossaryEntries,
  glossaryAtlasEntries,
  glossaryAtlasEdgeCount,
  glossaryReferenceCandidates,
  glossaryReferenceEntries,
} from '../src/config/glossary.ts';
import {
  glossaryGenericShortSlugs,
  glossaryReferenceBySlug,
  glossaryReferenceCandidateSlugs,
  glossaryReferenceWordCount,
} from '../src/config/glossary-reference-fr.ts';
import { glossaryRedirects } from '../src/config/glossary-redirects.mjs';
import { glossaryAtlasEnBySlug } from '../src/config/glossary-atlas-en.ts';
import { glossarySearchText, textContainsGlossaryToken } from '../src/lib/glossary-matching.mjs';

const mentions = (text, token) => textContainsGlossaryToken(glossarySearchText(text), token);
assert.equal(mentions('Le portail reste disponible.', 'Tail'), false, 'Tail ne doit pas être détecté dans portail');
assert.equal(mentions('Un test destructif est exclu.', 'ESTR'), false, 'ESTR ne doit pas être détecté dans destructif');
assert.equal(mentions("Le tail d'adjudication est positif.", 'Tail'), true, 'Tail doit être détecté comme terme autonome');
assert.equal(mentions('Le taux ESTR est publié par la BCE.', 'ESTR'), true, 'ESTR doit être détecté comme terme autonome');
assert.equal(mentions('[App Store](https://apps.apple.com/fr/app/france-identite)', 'APP'), false, 'APP ne doit pas être détecté dans App Store');
assert.equal(mentions("L'APP de la BCE est terminé.", 'APP'), true, 'APP doit respecter la casse du sigle');
assert.equal(mentions('[TS10](https://github.com/example/repo/blob/main/ts10.md)', 'Blob'), false, 'Blob ne doit pas être détecté dans une URL');
assert.equal(mentions('Un blob Ethereum transporte les données.', 'Blob'), true, 'Blob doit être détecté dans le texte visible');

for (const slug of ['bonification-d-interet', 'psl']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas?.sources?.some(source => source.href.startsWith('https://www.pbc.gov.cn/')));
  assert(en?.atlas?.sources?.some(source => source.href.startsWith('https://www.pbc.gov.cn/')));
  assert.equal(fr.guide, '/posts/chine-credit-immobilier-bonification-mensualites/');
  assert.equal(en.guide, '/en/analysis/china-mortgage-subsidy-household-payments/');
}

for (const slug of ['dora', 'ctpp']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr && en);
  assert.equal(fr.guide, '/posts/les-fournisseurs-invisibles-du-risque-bancaire-europeen/');
  assert.equal(en.guide, '/en/analysis/invisible-suppliers-european-banking-risk/');
  assert.deepEqual(fr.atlas.sources.map(source => source.href), en.atlas.sources.map(source => source.href));
  assert(fr.atlas.sources.every(source => source.href.startsWith('https://www.eba.europa.eu/')));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
}

for (const slug of ['cop', 'pay-as-bid']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr && en);
  assert.equal(fr.guide, '/posts/chaleur-industrielle-if26-prime-carbone-sixieme-annee/');
  assert.equal(en.guide, '/en/analysis/industrial-heat-if26-carbon-premium-year-six/');
  assert.deepEqual(fr.atlas.sources.map(source => source.href), en.atlas.sources.map(source => source.href));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
}

for (const [entry, href] of [
  [glossaryEntries.find(item => item.slug === 'dma'), '/posts/google-donnees-recherche-prix-acces-vie-privee/'],
  [glossaryAtlasEnBySlug.get('dma'), '/en/analysis/google-search-data-access-cost-privacy/'],
]) {
  assert(entry);
  assert.equal(entry.guide, href);
  assert.equal(entry.atlas.articles[0].href, href);
  assert.deepEqual(entry.atlas.related, ['pseudonymisation', 'segment-d-audience']);
  assert.equal(entry.sectionTitle, entry.guide === '/posts/google-donnees-recherche-prix-acces-vie-privee/' ? 'Économie numérique & données' : 'Digital economy & data');
  assert.equal(entry.atlas.sources[0].href, 'https://eur-lex.europa.eu/eli/reg/2022/1925/oj');
  assert.equal(entry.atlas.sources[1].href, 'https://ec.europa.eu/competition/digital_markets_act/cases/202637/DMA_100209_2799.pdf');
}

for (const slug of ['defi', 'facteur-de-sante', 'timelock']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr && en);
  assert.equal(fr.guide, '/posts/defi-intermediaires-acces-mica/');
  assert.equal(en.guide, '/en/analysis/defi-gateways-mica-access/');
  assert.equal(fr.sectionTitle, 'Crypto & stablecoins');
  assert.equal(en.sectionTitle, 'Crypto & stablecoins');
  assert.deepEqual(fr.atlas.sources.map(source => source.href), en.atlas.sources.map(source => source.href));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
  assert(fr.atlas.sources.every(source => ['www.esma.europa.eu', 'ethereum.org', 'aave.com', 'docs.openzeppelin.com'].includes(new URL(source.href).hostname)));
}

const sigles = glossaryEntries.map((entry) => entry.sigle.trim().toLocaleLowerCase('fr'));
assert.equal(new Set(sigles).size, sigles.length, 'Le glossaire contient encore un sigle dupliqué');
assert.equal(glossaryEntries.length, 611, 'Le corpus doit conserver ses 611 définitions uniques');
assert.equal(glossaryAtlasEntries.length, 178, 'Le graphe Atlas doit conserver ses 178 nœuds, dont G-SIB');
const snapshotFr = glossaryEntries.find(entry => entry.slug === 'g-sib');
const snapshotEn = glossaryAtlasEnBySlug.get('g-sib');
assert(snapshotFr && snapshotEn);
assert.equal(snapshotFr.guide, '/posts/banques-prix-photo-31-decembre/');
assert.equal(snapshotEn.guide, '/en/analysis/banks-cost-december-snapshot/');
assert.deepEqual(snapshotFr.atlas.sources.map(source => source.href), snapshotEn.atlas.sources.map(source => source.href));
assert.deepEqual(snapshotFr.atlas.related, ['repo', 'cet1', 'apr']);
assert.deepEqual(snapshotFr.atlas.related, snapshotEn.atlas.related);
assert.match(snapshotFr.def, /conséquences.*défaillance.*probabilité/);
assert.match(snapshotEn.def, /impact of failure.*probability/);
assert.equal(snapshotEn.robots, 'noindex,follow');
const craArticleFr = '/posts/cyber-resilience-act-circuit-alerte/';
const craArticleEn = '/en/analysis/cyber-resilience-act-vulnerability-reporting/';
const craRegulation = 'https://eur-lex.europa.eu/eli/reg/2024/2847/oj';
for (const [slug, sources, related] of [
  ['cra', [craRegulation], ['csirt', 'intendant-de-logiciels-ouverts']],
  ['csirt', ['https://eur-lex.europa.eu/eli/dir/2022/2555/oj', craRegulation], ['cra', 'intendant-de-logiciels-ouverts']],
  ['intendant-de-logiciels-ouverts', [craRegulation], ['cra', 'csirt']],
]) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: définition et sources FR/EN requises`);
  assert.equal(fr.reference, undefined, `${slug}: conserver la fiche courte en noindex`);
  assert.equal(fr.referenceCandidate, false, `${slug}: aucune promotion en fiche de référence`);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert(!glossaryReferenceCandidateSlugs.includes(slug));
  assert.equal(en.robots, 'noindex,follow');
  assert.equal(fr.guide, craArticleFr);
  assert.equal(en.guide, craArticleEn);
  assert.equal(fr.sectionTitle, 'Économie numérique & données');
  assert.equal(en.sectionTitle, 'Digital economy & data');
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas.sources.map(source => source.href), sources);
    assert.deepEqual(entry.atlas.articles.map(article => article.href), [entry.guide]);
    assert.deepEqual(entry.atlas.related, related);
    assert(entry.atlas.sources.every(source => new URL(source.href).hostname === 'eur-lex.europa.eu'));
    for (const neighbor of related) {
      assert(glossaryEntries.some(candidate => candidate.slug === neighbor));
      assert(glossaryAtlasEnBySlug.has(neighbor));
    }
    assert(!entry.def.includes('—'), `${slug}: respecter la charte éditoriale`);
  }
  if (slug === 'cra') {
    assert.match(fr.def, /11 septembre 2026/);
    assert.match(en.def, /11 September 2026/);
    assert.match(fr.def, /vulnérabilités activement exploitées/);
    assert.match(en.def, /actively exploited vulnerabilities/);
  }
  if (slug !== 'csirt') {
    assert.match(fr.def, /11 décembre 2027/);
    assert.match(en.def, /11 December 2027/);
  } else {
    assert.match(fr.def, /coordinateur.*ENISA.*confidentialité/);
    assert.match(en.def, /coordinator.*ENISA.*confidentiality/);
  }
  if (slug === 'intendant-de-logiciels-ouverts') {
    assert.match(fr.def, /distincte du fabricant/);
    assert.match(en.def, /distinct from the manufacturer/);
    assert.match(fr.def, /activités commerciales/);
    assert.match(en.def, /commercial activities/);
  }
}
const dutreilArticleFr = '/posts/dutreil-transmission-fortunes-familiales/';
const dutreilArticleEn = '/en/analysis/dutreil-family-business-inheritance-tax-relief/';
for (const [slug, sources, related] of [
  ['pacte-dutreil', [
    'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053542700',
    'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000053542704',
    'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000024430025',
  ], ['depense-fiscale', 'soulte']],
  ['soulte', [
    'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006432575',
    'https://bofip.impots.gouv.fr/bofip/6509-PGP.html/identifiant=BOI-ENR-DMTG-10-20-40-10-20260810',
  ], ['pacte-dutreil', 'depense-fiscale']],
]) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: définitions et sources FR/EN requises`);
  assert.equal(fr.reference, undefined, `${slug}: conserver la fiche courte en noindex`);
  assert.equal(fr.referenceCandidate, false, `${slug}: aucune promotion en fiche de référence`);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert(!glossaryReferenceCandidateSlugs.includes(slug));
  assert.equal(en.robots, 'noindex,follow');
  assert.equal(fr.guide, dutreilArticleFr);
  assert.equal(en.guide, dutreilArticleEn);
  assert.equal(fr.sectionTitle, 'Macro & banques centrales');
  assert.equal(en.sectionTitle, 'Macro & central banks');
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas.sources.map(source => source.href), sources);
    assert.deepEqual(entry.atlas.articles.map(article => article.href), [entry.guide]);
    assert.deepEqual(entry.atlas.related, related);
    assert(entry.atlas.sources.every(source => ['www.legifrance.gouv.fr', 'bofip.impots.gouv.fr'].includes(new URL(source.href).hostname)));
    for (const neighbor of entry.atlas.related) {
      assert(glossaryEntries.some(candidate => candidate.slug === neighbor));
      assert(glossaryAtlasEnBySlug.has(neighbor));
    }
    assert(!entry.def.includes('—'), `${slug}: respecter la charte éditoriale`);
  }
}
for (const [slug, oldGuideFr, oldGuideEn, oldSource] of [
  ['depense-fiscale', '/posts/aides-entreprises-211-milliards-chiffre-trompeur/', '/en/analysis/france-211-billion-business-aid-misleading-figure/', 'https://www2.assemblee-nationale.fr/static/17/Annexes-DL/PLF-2025/Voies_et_moyens_Tome_2_2025.pdf#page=35'],
  ['contrefactuel', '/posts/reserves-petrolieres-transmission-prix-pompe/', '/en/analysis/emergency-oil-reserves-pass-through-pump-prices/', 'https://www.dallasfed.org/research/papers/2019/wp1916'],
]) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en);
  assert.equal(fr.guide, oldGuideFr, `${slug}: conserver le guide français existant`);
  assert.equal(en.guide, oldGuideEn, `${slug}: conserver le guide anglais existant`);
  assert(fr.atlas.articles.some(article => article.href === dutreilArticleFr));
  assert(en.atlas.articles.some(article => article.href === dutreilArticleEn));
  assert.deepEqual(fr.atlas.sources.map(source => source.href), [oldSource]);
  assert.deepEqual(en.atlas.sources.map(source => source.href), [oldSource]);
  assert.deepEqual(fr.atlas.related, en.atlas.related);
  if (slug === 'contrefactuel') {
    assert.equal(fr.atlas.articles[0].href, oldGuideFr, 'Conserver l’analyse pétrolière dans le contrefactuel');
    assert.equal(en.atlas.articles[0].href, oldGuideEn);
    assert.deepEqual(fr.atlas.related, ['spr']);
  } else {
    assert.deepEqual(fr.atlas.related, ['equivalent-subvention', 'pacte-dutreil', 'soulte']);
  }
}
for (const [slug, related] of [['ot', ['scada']], ['scada', ['ot']]]) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: définitions et sources FR/EN requises`);
  assert.equal(fr.reference, undefined, `${slug}: conserver la fiche courte en noindex`);
  assert.equal(fr.referenceCandidate, false, `${slug}: aucune promotion en fiche de référence`);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert(!glossaryReferenceCandidateSlugs.includes(slug));
  assert.equal(en.robots, 'noindex,follow');
  assert.equal(fr.guide, '/posts/eolien-solaire-acces-cyber-responsabilites/');
  assert.equal(en.guide, '/en/analysis/wind-solar-cyber-access-responsibility/');
  assert.equal(fr.sectionTitle, 'Économie numérique & données');
  assert.equal(en.sectionTitle, 'Digital economy & data');
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas.sources.map(source => source.href), ['https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-82r3.pdf']);
    assert.deepEqual(entry.atlas.articles.map(article => article.href), [entry.guide]);
    assert.deepEqual(entry.atlas.related, related);
    for (const neighbor of entry.atlas.related) {
      assert(glossaryEntries.some(candidate => candidate.slug === neighbor));
      assert(glossaryAtlasEnBySlug.has(neighbor));
    }
    assert(!entry.def.includes('—'), `${slug}: respecter la charte éditoriale`);
  }
}
for (const [slug, sources, related] of [
  ['btf', ['https://www.aft.gouv.fr/fr/nos-produits'], ['risque-de-refinancement', 'prime-de-terme']],
  ['risque-de-refinancement', [
    'https://www.tresor.economie.gouv.fr/Articles/aed3274b-b5a2-482d-a02d-09d0b9f339d6/files/dc0bde49-9fd8-4e29-bd30-fe069abb603b',
    'https://www.oecd.org/en/publications/global-debt-report-2026_e9d80efd-en/full-report/sovereign-borrowing-outlook_4470147b.html',
  ], ['btf', 'prime-de-terme']],
]) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: définitions et sources FR/EN requises`);
  assert.equal(fr.reference, undefined, `${slug}: conserver la fiche courte en noindex`);
  assert.equal(fr.referenceCandidate, false, `${slug}: aucune promotion en fiche de référence`);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert(!glossaryReferenceCandidateSlugs.includes(slug));
  assert.equal(en.robots, 'noindex,follow');
  assert.equal(fr.guide, '/posts/dette-francaise-prix-du-temps/');
  assert.equal(en.guide, '/en/analysis/french-debt-price-of-time/');
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas.sources.map(source => source.href), sources);
    assert.deepEqual(entry.atlas.articles.map(article => article.href), [entry.guide]);
    assert.deepEqual(entry.atlas.related, related);
    for (const neighbor of entry.atlas.related) {
      assert(glossaryEntries.some(candidate => candidate.slug === neighbor));
      assert(glossaryAtlasEnBySlug.has(neighbor));
    }
    assert(!entry.def.includes('—'), `${slug}: respecter la charte éditoriale`);
  }
}
for (const [entry, href] of [
  [glossaryEntries.find(item => item.slug === 'prime-de-terme'), '/posts/dette-francaise-prix-du-temps/'],
  [glossaryAtlasEnBySlug.get('prime-de-terme'), '/en/analysis/french-debt-price-of-time/'],
]) assert(entry?.atlas?.articles?.some(article => article.href === href), 'La prime de terme doit relier la nouvelle enquête dans chaque langue');
const oat = glossaryEntries.find(entry => entry.slug === 'oat');
assert(oat?.def.includes('rendement de marché') && oat.def.includes('coupon contractuel'), 'OAT doit distinguer rendement de marché et coupon');
for (const slug of ['inclusion-forcee', 'proposeur-de-rollup']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: définitions et sources FR/EN requises`);
  assert.equal(fr.reference, undefined);
  assert.equal(fr.referenceCandidate, false);
  assert.equal(en.robots, 'noindex,follow');
  assert.equal(fr.guide, '/posts/blast-abstract-blockchain-fermeture-economie/');
  assert.equal(en.guide, '/en/analysis/blast-abstract-blockchain-shutdown-economics/');
  assert.deepEqual(fr.atlas.sources.map(source => source.href), en.atlas.sources.map(source => source.href));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
  for (const neighbor of fr.atlas.related) {
    assert(glossaryEntries.some(entry => entry.slug === neighbor));
    assert(glossaryAtlasEnBySlug.has(neighbor));
  }
}
for (const slug of ['cryptographie-postquantique', 'poids-de-transaction']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: définitions et sources FR/EN requises`);
  assert.equal(fr.reference, undefined, `${slug}: conserver la fiche courte en noindex`);
  assert.equal(en.robots, 'noindex,follow');
  assert.equal(fr.guide, '/posts/bitcoin-quantique-prix-changement-cles/');
  assert.equal(en.guide, '/en/analysis/bitcoin-quantum-cost-changing-keys/');
  assert.deepEqual(fr.atlas.sources.map(source => source.href), en.atlas.sources.map(source => source.href));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
}
for (const slug of ['irrbb', 'eve', 'nii']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: fiches FR/EN requises`);
  assert.equal(fr.reference, undefined, `${slug}: conserver la fiche courte en noindex`);
  assert.equal(en.robots, 'noindex,follow');
  assert.equal(fr.guide, '/posts/banques-europeennes-dette-souveraine-choc-obligataire/');
  assert.equal(en.guide, '/en/analysis/european-banks-sovereign-debt-bond-shock/');
  assert.deepEqual(fr.atlas.sources.map(source => source.href), en.atlas.sources.map(source => source.href));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
  assert(fr.atlas.sources.every(source => new URL(source.href).hostname === 'www.bis.org'));
}
for (const slug of ['cyclotron', 'tep', 'demi-vie', 'cmo', 'cdmo', 'theranostique']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: fiches FR/EN requises`);
  assert.equal(fr.reference, undefined, `${slug}: conserver la fiche courte en noindex`);
  assert.equal(en.robots, 'noindex,follow');
  assert.equal(fr.sectionTitle, 'Industrie & santé');
  assert.equal(en.sectionTitle, 'Industry & healthcare');
  assert.equal(fr.guide, '/posts/ge-healthcare-achete-du-temps/');
  assert.equal(en.guide, '/en/analysis/ge-healthcare-buys-time/');
  assert.equal(fr.atlas.articles[0].href, fr.guide);
  assert.equal(en.atlas.articles[0].href, en.guide);
  assert.deepEqual(fr.atlas.sources.map(source => source.href), en.atlas.sources.map(source => source.href));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
  for (const related of fr.atlas.related) {
    assert(glossaryEntries.some(entry => entry.slug === related), `${slug}: relation FR absente`);
    assert(glossaryAtlasEnBySlug.has(related), `${slug}: relation EN absente`);
  }
}
for (const slug of ['rsu', 'warrant']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en);
  assert.equal(fr.reference, undefined);
  assert.equal(en.robots, 'noindex,follow');
  assert.equal(fr.guide, '/posts/trump-jr-drones-unusual-machines-draganfly-politique-industrielle/');
  assert.equal(en.guide, '/en/analysis/trump-jr-drones-unusual-machines-draganfly-industrial-policy/');
  assert.deepEqual(fr.atlas.sources.map(source => source.href), en.atlas.sources.map(source => source.href));
  assert(fr.atlas.sources.every(source => new URL(source.href).hostname === 'www.sec.gov'));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
}
for (const slug of ['transmission-des-prix', 'contrefactuel']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: définition et sources FR/EN requises`);
  assert.equal(fr.reference, undefined, `${slug}: aucune promotion automatique de l’indexation`);
  assert.equal(en.robots, 'noindex,follow');
  assert.equal(fr.guide, '/posts/reserves-petrolieres-transmission-prix-pompe/');
  assert.equal(en.guide, '/en/analysis/emergency-oil-reserves-pass-through-pump-prices/');
  assert.deepEqual(fr.atlas.sources.map(source => source.href), en.atlas.sources.map(source => source.href));
  assert(fr.atlas.sources.every(source => ['www.banque-france.fr', 'www.dallasfed.org'].includes(new URL(source.href).hostname)));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
}
for (const slug of ['lc', 'backwardation']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: définition et sources FR/EN requises`);
  assert.equal(en.robots, 'noindex,follow');
  assert.equal(fr.reference, undefined);
  assert.deepEqual(fr.atlas.sources.map(source => source.href), en.atlas.sources.map(source => source.href));
  assert(fr.atlas.articles.some(article => article.href === '/posts/reserves-petrolieres-ventes-echanges-attribution/'));
  assert(en.atlas.articles.some(article => article.href === '/en/analysis/emergency-oil-reserves-sales-exchanges-allocation/'));
}
for (const [entry, href] of [
  [glossaryEntries.find(item => item.slug === 'mvno'), '/posts/sfr-rachat-partage-operateur-prix-forfaits/'],
  [glossaryAtlasEnBySlug.get('mvno'), '/en/analysis/sfr-breakup-phone-bill-networks-competition/'],
]) {
  assert(entry);
  assert.equal(entry.guide, href);
  assert.deepEqual(entry.atlas.articles.map(item => item.href), [href]);
  assert.deepEqual(entry.atlas.sources.map(item => item.href), ['https://www.arcep.fr/mes-demarches-et-services/acteurs-regules/operateurs-telecoms/liste-des-mvno.html']);
}
for (const slug of ['rachat-d-actions', 'actions-propres', 'remuneration-en-actions']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr && en);
  assert.equal(fr.guide, '/posts/rachats-actions-anti-dilution-microsoft-airbus/');
  assert.equal(en.guide, '/en/analysis/share-buybacks-anti-dilution-microsoft-airbus/');
  assert.deepEqual(fr.atlas.sources.map(source => source.href), en.atlas.sources.map(source => source.href));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
  assert.equal(fr.atlas.related.length, 2);
}
const decrement = glossaryEntries.find(entry => entry.slug === 'indice-a-decrement');
assert(decrement?.def.includes('dividendes réinvestis'));
assert.equal(decrement?.guide, '/posts/produits-structures-indices-decrement-risque-epargne/');
assert.equal(decrement?.atlas?.sources?.[0]?.href, 'https://acpr.banque-france.fr/system/files/2026-06/20260622_Note_ACPR-AMF_Produits%20structur%C3%A9s.pdf');
const decrementEn = glossaryAtlasEnBySlug.get('indice-a-decrement');
assert.equal(decrementEn?.guide, '/en/analysis/structured-products-decrement-indices-savings-risk/');
assert.deepEqual(decrementEn?.atlas?.sources?.map(source => source.href), decrement?.atlas?.sources?.map(source => source.href));
assert.equal(glossaryAtlasEdgeCount, 556, 'Le graphe Atlas doit conserver ses 556 relations');
for (const [entry, href] of [
  [glossaryEntries.find(item => item.slug === 'spr'), '/posts/petrole-reserves-strategiques-prets-temps/'],
  [glossaryAtlasEnBySlug.get('spr'), '/en/analysis/strategic-oil-reserves-borrowing-time/'],
]) {
  assert(entry);
  assert.equal(entry.atlas.articles[0].href, href);
  assert(entry.atlas.formula.includes('baril') || entry.atlas.formula.includes('barrel'));
  assert(entry.atlas.whyNow.includes('2029'));
  assert(!entry.def.includes('1.24') && !entry.def.includes('1,24'));
  assert(entry.atlas.sources.some(source => source.href === 'https://www.energy.gov/hgeo/opr/spr-sales-and-exchanges'));
  assert(entry.atlas.sources.some(source => source.href === 'https://www.iea.org/about/oil-security-and-emergency-response'));
}
for (const [entry, href] of [
  [glossaryEntries.find(item => item.slug === 'repricing-obligataire'), '/posts/le-monde-redecouvre-le-prix-de-l-argent/'],
  [glossaryAtlasEnBySlug.get('repricing-obligataire'), '/en/analysis/the-world-rediscovers-the-price-of-money/'],
]) {
  assert(entry);
  assert.equal(entry.guide, href);
  assert.deepEqual(entry.atlas.related, ['duration', 'prime-de-terme', 'courbe-des-taux']);
  assert.equal(entry.atlas.sources[0].href, 'https://www.ecb.europa.eu/stats/financial_markets_and_interest_rates/euro_area_yield_curves/html/index.en.html');
}
for (const [entry, href] of [
  [glossaryEntries.find(item => item.slug === 'ofz'), '/posts/budget-russe-2027-defense-dette-banques-credit/'],
  [glossaryAtlasEnBySlug.get('ofz'), '/en/analysis/russia-2027-budget-defence-debt-banks-credit/'],
]) {
  assert(entry);
  assert.equal(entry.guide, href);
  assert.deepEqual(entry.atlas.related, ['repo', 'duration']);
  assert.equal(entry.atlas.sources[0].href, 'https://www.cbr.ru/eng/press/event/?id=28292');
}
for (const [entry, href] of [
  [glossaryEntries.find((item) => item.slug === 'tokenisation-des-actifs'), '/posts/actions-tokenisees-xstocks-vaults-chaine-credit/'],
  [glossaryAtlasEnBySlug.get('tokenisation-des-actifs'), '/en/analysis/tokenized-stocks-xstocks-vaults-credit-yield/'],
]) {
  assert(entry);
  assert.equal(entry.guide, href);
  assert.deepEqual(entry.atlas.articles.map(item => item.href), [href]);
  assert.deepEqual(entry.atlas.related, ['smart-contract', 'stablecoin']);
  assert.equal(entry.atlas.sources.length, 2);
}
for (const [entry, href] of [
  [glossaryEntries.find((item) => item.slug === 'risque-de-reinvestissement'), '/posts/credit-prive-emprunteurs-refinancement-revenus/'],
  [glossaryAtlasEnBySlug.get('risque-de-reinvestissement'), '/en/analysis/private-credit-borrower-exits-reinvestment-risk/'],
]) {
  assert(entry);
  assert.equal(entry.guide, href);
  assert.deepEqual(entry.atlas.articles.map((item) => item.href), [href]);
  assert.deepEqual(entry.atlas.sources.map((item) => item.href), ['https://www.sec.gov/Archives/edgar/data/1752019/000119312524242920/d815713d424b3.htm']);
  assert.deepEqual(entry.atlas.related, ['credit-prive', 'bdc']);
}
for (const [entry, href] of [
  [glossaryEntries.find((item) => item.slug === 'seigneuriage'), '/posts/londres-sortie-qe-tresor-billets/'],
  [glossaryAtlasEnBySlug.get('seigneuriage'), '/en/analysis/bank-of-england-qe-exit-treasury-banknotes/'],
]) {
  assert(entry);
  assert.equal(entry.guide, href);
  assert.deepEqual(entry.atlas.articles.map((item) => item.href), [href]);
  assert.deepEqual(entry.atlas.sources.map((item) => item.href), ['https://www.bankofengland.co.uk/bank-insights/2026/the-promise-to-pay-what-backs-banknotes']);
  assert.deepEqual(entry.atlas.related, ['repo', 'duration']);
}
for (const [entry, href] of [
  [glossaryEntries.find((item) => item.slug === 'liste-repoussoir'), '/posts/commerce-traces-donnees-apres-fin-contrat/'],
  [glossaryAtlasEnBySlug.get('liste-repoussoir'), '/en/analysis/personal-data-after-the-contract-ends/'],
]) {
  assert(entry);
  assert.equal(entry.guide, href);
  assert.deepEqual(entry.atlas.sources.map((item) => item.href), ['https://www.cnil.fr/fr/comment-utiliser-une-liste-repoussoir-pour-respecter-lopposition-la-prospection-commerciale']);
  assert.deepEqual(entry.atlas.articles.map((item) => item.href), [href]);
  assert.deepEqual(entry.atlas.related, ['profilage']);
}
for (const [slug, source] of [
  ['profilage', 'https://www.cnil.fr/fr/profilage-et-decision-entierement-automatisee'],
  ['segment-d-audience', 'https://iabtechlab.com/standards/data-transparency-standard/'],
]) {
  for (const [entry, href] of [
    [glossaryEntries.find((item) => item.slug === slug), '/posts/commerce-traces-fabrication-profils-donnees-personnelles/'],
    [glossaryAtlasEnBySlug.get(slug), '/en/analysis/personal-data-traces-to-saleable-profiles/'],
  ]) {
    assert(entry);
    assert.equal(entry.guide, href);
    assert.deepEqual(entry.atlas.sources.map((item) => item.href), [source]);
    const articles = slug === 'profilage'
      ? [href, href.startsWith('/en/')
        ? '/en/analysis/ai-debt-collection-1-who-decides-reminder/'
        : '/posts/ia-recouvrement-1-qui-decide-relance/']
      : [href];
    assert.deepEqual(entry.atlas.articles.map((item) => item.href), articles);
    for (const related of entry.atlas.related) assert(glossaryEntries.some((item) => item.slug === related));
  }
}
for (const [slug, source] of [
  ['sdk', 'https://www.cnil.fr/fr/applications-mobiles-comment-integrer-des-sdk-et-respecter-la-vie-privee-des-utilisateurs'],
  ['rtb', 'https://www.ftc.gov/system/files/ftc_gov/pdf/Mobilewalla-Complaint.pdf'],
]) {
  for (const [entry, href] of [
    [glossaryEntries.find((item) => item.slug === slug), '/posts/commerce-traces-economie-collecte-donnees-personnelles/'],
    [glossaryAtlasEnBySlug.get(slug), '/en/analysis/personal-data-economics-collection/'],
  ]) {
    assert(entry);
    assert.equal(entry.guide, href);
    assert.deepEqual(entry.atlas.sources.map((item) => item.href), [source]);
    assert.deepEqual(entry.atlas.articles.map((item) => item.href), [href]);
  }
}
for (const [entry, href] of [
  [glossaryEntries.find((item) => item.slug === 'tarification-algorithmique'), '/posts/prix-automatiques-concurrence-algorithmes/'],
  [glossaryAtlasEnBySlug.get('tarification-algorithmique'), '/en/analysis/pricing-algorithms-competition/'],
]) {
  assert(entry);
  assert.equal(entry.guide, href);
  assert.deepEqual(entry.atlas.articles.map((item) => item.href), [href]);
  assert.deepEqual(entry.atlas.sources.map((item) => item.href), ['https://www.autoritedelaconcurrence.fr/sites/default/files/Algorithms_and_Competition_Working-Paper.pdf']);
}
for (const [slug, source] of [
  ['dscr', 'https://ppp.worldbank.org/sites/default/files/2024-07/VOLUME2-web.pdf'],
  ['step-in-rights', 'https://ppp.worldbank.org/lender-protections-and-government-support-ppps'],
]) {
  const fr = glossaryEntries.find((entry) => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr && en, `${slug} doit conserver ses définitions FR/EN`);
  assert.equal(fr.guide, '/posts/crux-ai-google-blackstone-banques-puces-collateral/');
  assert.equal(en.guide, '/en/analysis/crux-ai-google-blackstone-bank-risk-chip-collateral/');
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas.sources.map((item) => item.href), [source]);
    assert.equal(entry.atlas.articles[0].href, entry.guide);
    for (const related of entry.atlas.related) assert(glossaryEntries.some((item) => item.slug === related));
  }
}
for (const [entry, href] of [
  [glossaryEntries.find(item => item.slug === 'risque-de-sequence'), '/posts/retraite-risque-sequence-rendements/'],
  [glossaryAtlasEnBySlug.get('risque-de-sequence'), '/en/analysis/retirement-sequence-of-returns-risk/'],
]) {
  assert(entry); assert.equal(entry.guide, href);
  assert.deepEqual(entry.atlas.articles.map(item => item.href), [href]);
  assert.deepEqual(entry.atlas.sources.map(item => item.href), ['https://www.soa.org/globalassets/assets/files/resources/research-report/2023/ret-income-strat-de.pdf#page=73']);
}
for (const [entry, href] of [
  [glossaryEntries.find((item) => item.slug === 'reverse-yankee'), '/posts/dette-ia-concurrence-etats-taux-credit/'],
  [glossaryAtlasEnBySlug.get('reverse-yankee'), '/en/analysis/ai-debt-sovereign-borrowers-credit-costs/'],
]) {
  assert(entry, 'Reverse Yankee doit être défini dans les deux langues');
  assert.equal(entry.guide, href);
  assert.deepEqual(entry.atlas?.articles?.map((item) => item.href), [href]);
  assert.deepEqual(entry.atlas?.sources?.map((item) => item.href), ['https://www.ecb.europa.eu/press/other-publications/ire/focus/html/ecb.irebox202506_02~e5ae550b00.en.html']);
  assert.deepEqual(entry.atlas?.related, ['duration', 'prime-de-terme']);
}
for (const slug of ['clarity', 'cloture']) {
  const fr = glossaryEntries.find((entry) => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr && en, `${slug} doit avoir une définition FR et EN`);
  assert.equal(fr.guide, '/posts/clarity-apres-le-vote-49-50/');
  assert.equal(en.guide, '/en/analysis/clarity-after-the-49-50-vote/');
  const expectedSource = slug === 'clarity'
    ? 'https://www.senate.gov/legislative/LIS/roll_call_votes/vote1192/vote_119_2_00234.htm'
    : 'https://www.rpc.senate.gov/glossary';
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas?.sources?.map((source) => source.href), [expectedSource]);
    assert(entry.atlas?.articles?.some((article) => article.href === entry.guide));
    assert.deepEqual(entry.atlas?.related, [slug === 'clarity' ? 'cloture' : 'clarity']);
    assert(!entry.def.includes('—'), `${slug} doit respecter la charte éditoriale`);
  }
}
for (const slug of ['ia-de-frontiere', 'modele-a-poids-ouverts']) {
  const fr = glossaryEntries.find((entry) => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr && en, `${slug} doit avoir une définition FR et EN`);
  assert.equal(fr.guide, '/posts/freiner-frontiere-ia-capital-politique/');
  assert.equal(en.guide, '/en/analysis/pacing-ai-frontier-capital-politics/');
  assert.deepEqual(fr.atlas?.sources?.map((source) => source.href), en.atlas.sources?.map((source) => source.href), `${slug} doit conserver les mêmes sources primaires en FR et EN`);
  assert(fr.atlas?.sources?.some((source) => source.href === 'https://openai.com/index/ai-policy-window/'), `${slug} doit citer la source primaire de politique IA`);
  for (const entry of [fr, en]) assert(!entry.def.includes('—'), `${slug} doit respecter la charte éditoriale`);
}
for (const slug of ['investment-grade', 'vrg']) {
  const entry = glossaryEntries.find((candidate) => candidate.slug === slug);
  assert(entry?.atlas?.sources?.length, slug + ' doit conserver sa source primaire');
  assert.equal(entry.guide, '/posts/openai-note-credit-garantie-nvidia-ipo/');
}
for (const slug of ['arrieres-de-paiement', 'affacturage']) {
  const entry = glossaryEntries.find((candidate) => candidate.slug === slug);
  assert(entry?.atlas?.sources?.length, slug + ' doit conserver sa source institutionnelle');
  assert.equal(entry.guide, '/posts/senegal-arrieres-etat-entreprises-creancieres/');
}
assert.equal(glossaryReferenceCandidateSlugs.length, 70, 'La sélection éditoriale doit contenir 70 notions rares');
assert.equal(new Set(glossaryReferenceCandidateSlugs).size, glossaryReferenceCandidateSlugs.length, 'La sélection contient un slug dupliqué');
assert.equal(glossaryReferenceCandidates.length, glossaryReferenceCandidateSlugs.length, 'Chaque candidate doit correspondre à une entrée du glossaire');
assert.equal(glossaryReferenceEntries.length, 3, 'La première vague doit publier exactement trois fiches de référence');
assert.deepEqual(
  glossaryReferenceEntries.map((entry) => entry.slug).sort(),
  Object.keys(glossaryReferenceBySlug).sort(),
  'Aucune fiche de référence ne doit être perdue sous un slug inconnu',
);

for (const slug of glossaryGenericShortSlugs) {
  assert(!glossaryReferenceCandidateSlugs.includes(slug), `${slug} doit rester une définition générique courte`);
}

for (const entry of glossaryReferenceEntries) {
  assert(entry.referenceCandidate, `${entry.slug} doit appartenir à la sélection éditoriale`);
  const reference = entry.reference;
  assert(reference, `${entry.slug} doit fournir un contenu de référence`);
  assert(/^\d{4}-\d{2}-\d{2}$/.test(reference.updatedIso) && !Number.isNaN(Date.parse(reference.updatedIso)), `${entry.slug} doit fournir une date de révision ISO valide`);
  const words = glossaryReferenceWordCount(reference);
  assert(words >= 800 && words <= 1_200, `${entry.slug} doit contenir entre 800 et 1 200 mots éditoriaux, reçu ${words}`);
  assert(reference.primarySources.length > 0, `${entry.slug} doit citer au moins une source primaire`);
  for (const source of reference.primarySources) {
    const url = new URL(source.href);
    assert(url.protocol === 'https:' && !url.username && !url.password, `${entry.slug} doit citer une URL HTTPS sans identifiants`);
  }
  assert(reference.relatedSlugs.length >= 4, `${entry.slug} doit relier au moins quatre concepts voisins`);
  for (const relatedSlug of reference.relatedSlugs) {
    assert(glossaryEntries.some((candidate) => candidate.slug === relatedSlug), `${entry.slug} référence un concept voisin inconnu: ${relatedSlug}`);
  }
  assert(reference.primarySources.some((source) => source.href === reference.datedFact.sourceHref), `${entry.slug} doit relier son chiffre daté à une source primaire listée`);
  assert(reference.analyses.some((link) => link.href.startsWith('/posts/')), `${entry.slug} doit relier au moins une analyse l0g`);
  assert(reference.limitation.trim().length >= 120, `${entry.slug} doit expliciter une limite substantielle`);
}

assert(
  glossaryReferenceEntries.filter((entry) => (entry.reference?.instruments.length ?? 0) > 0).length >= 2,
  'Les fiches disposant d’un outil concerné doivent le relier',
);
assert.equal(Object.keys(glossaryRedirects).length, 6, 'Les six anciens slugs doivent conserver une redirection');
for (const [from, to] of Object.entries(glossaryRedirects)) {
  assert(from.endsWith('-2'), `Alias inattendu: ${from}`);
  assert(glossaryEntries.some((entry) => entry.url.replace(/\/$/, '') === to), `Cible inconnue: ${to}`);
}

for (const entry of [glossaryEntries.find(item => item.slug === 'rpo'), glossaryAtlasEnBySlug.get('rpo')]) {
  assert(entry);
  assert.equal(entry.atlas.sources[0].href, 'https://www.sec.gov/Archives/edgar/data/1341439/000119312526389274/orcl-20260831.htm');
  assert(entry.atlas.articles.length);
}

console.log(JSON.stringify({
  ok: true,
  atlasNodes: glossaryAtlasEntries.length,
  referenceCandidates: glossaryReferenceCandidates.length,
  referenceIndexed: glossaryReferenceEntries.length,
  shortNoindex: glossaryEntries.length - glossaryReferenceEntries.length,
  mergedAliases: Object.keys(glossaryRedirects).length,
}));
