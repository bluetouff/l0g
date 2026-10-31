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
import { glossaryAtlasEn, glossaryAtlasEnBySlug, englishGlossaryRobots } from '../src/config/glossary-atlas-en.ts';
import { glossaryReferenceEnBySlug } from '../src/config/treasury-buyback-reference.ts';
import { glossarySearchText, textContainsGlossaryToken } from '../src/lib/glossary-matching.mjs';

const mentions = (text, token) => textContainsGlossaryToken(glossarySearchText(text), token);


// Household budgets preserve periods, expenditure weights and housing conventions.
const inflationBudgetFr = '/posts/inflation-budget/';
const inflationBudgetEn = '/en/analysis/why-your-budget-tells-a-different-inflation-story/';
const inflationBudgetSources = {"glissement-annuel": ["https://www.insee.fr/fr/statistiques/documentation/IPC_Note_methodologique_en_bref_2026.pdf", "https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_inflation.en.html"], "ponderation-de-consommation": ["https://www.insee.fr/fr/statistiques/documentation/IPC_Note_methodologique_en_bref_2026.pdf", "https://www.insee.fr/fr/statistiques/2418131"], "taux-d-effort-en-logement": ["https://www.insee.fr/fr/statistiques/9053584"], "depenses-pre-engagees": ["https://www.insee.fr/fr/metadonnees/definition/c1358"]};
for (const [slug, expectedSources] of Object.entries(inflationBudgetSources)) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  assert.deepEqual(fr[0].atlas.related, en[0].atlas.related);
  for (const [entry, article] of [[fr[0], inflationBudgetFr], [en[0], inflationBudgetEn]]) {
    assert.equal(entry.guide, article);
    assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
    assert.deepEqual(entry.atlas.sources.map(source => source.href), expectedSources);
    assert(!entry.def.includes('—'));
  }
  for (const neighbor of fr[0].atlas.related) {
    assert(Object.hasOwn(inflationBudgetSources, neighbor));
    assert(glossaryEntries.some(entry => entry.slug === neighbor));
    assert(glossaryAtlasEnBySlug.has(neighbor));
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'glissement-annuel').def, /douze mois.*neuf mois/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'ponderation-de-consommation').def, /actualisées chaque année.*chaînés annuellement/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'taux-d-effort-en-logement').def, /sommes.*impôts directs.*capital remboursé/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'depenses-pre-engagees').def, /contrats.*court terme.*hors assurance-vie.*loyers imputés/u);
assert.match(glossaryAtlasEnBySlug.get('depenses-pre-engagees').def, /excluding life insurance.*imputed rents/u);

// Learning assessments, occupational exposure and uncertainty keep distinct scopes.
const learningJuniorsFr = '/posts/ia-apprentissage-juniors/';
const learningJuniorsEn = '/en/analysis/learning-work-with-ai/';
const learningJuniorsSources = {"afest": ["https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000038022325"], "exposition-professionnelle-ia": ["https://www.ilo.org/publications/workers%E2%80%99-exposure-ai-what-indicators-tell-us-%E2%80%93-and-what-they-don%E2%80%99t"], "evaluation-sans-assistance": ["https://arxiv.org/abs/2601.20245v2", "https://doi.org/10.1073/pnas.2422633122"], "erreur-standard": ["https://doi.org/10.1073/pnas.2422633122"]};
for (const [slug, expectedSources] of Object.entries(learningJuniorsSources)) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  assert.deepEqual(fr[0].atlas.related, en[0].atlas.related);
  for (const [entry, article] of [[fr[0], learningJuniorsFr], [en[0], learningJuniorsEn]]) {
    assert.equal(entry.guide, article);
    assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
    assert.deepEqual(entry.atlas.sources.map(source => source.href), expectedSources);
    assert(!entry.def.includes('—'));
  }
  for (const neighbor of fr[0].atlas.related) {
    assert(Object.hasOwn(learningJuniorsSources, neighbor));
    assert(glossaryEntries.some(entry => entry.slug === neighbor));
    assert(glossaryAtlasEnBySlug.has(neighbor));
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'afest').def, /phases réflexives distinctes de l’exécution/u);
assert.match(glossaryAtlasEnBySlug.get('afest').def, /reflection separate from task execution/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'exposition-professionnelle-ia').def, /adoption effective.*effets sur l’emploi/u);
assert.match(glossaryAtlasEnBySlug.get('exposition-professionnelle-ia').def, /Actual adoption.*employment outcomes/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'evaluation-sans-assistance').def, /quiz immédiat.*maintien dans le temps.*tâches éloignées/u);
assert.match(glossaryAtlasEnBySlug.get('evaluation-sans-assistance').def, /immediate quiz.*longer-term retention.*different tasks/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'erreur-standard').def, /même unité.*regroupées par classe.*dispersion.*intervalle de confiance à 95 %/u);
assert.match(glossaryAtlasEnBySlug.get('erreur-standard').def, /same units.*clustered by classroom.*individual scores.*95% confidence interval/u);

// Customs units, threshold valuation and VAT collection remain separate short entries.
const smallParcelsFr = '/posts/petits-colis-frais/';
const smallParcelsEn = '/en/analysis/small-parcels-fees/';
for (const slug of ['ioss', 'article-douanier', 'valeur-intrinseque']) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  assert.deepEqual(fr[0].atlas.related, en[0].atlas.related);
  assert.deepEqual(fr[0].atlas.sources.map(source => source.href), en[0].atlas.sources.map(source => source.href));
  for (const [entry, article] of [[fr[0], smallParcelsFr], [en[0], smallParcelsEn]]) {
    assert.equal(entry.guide, article);
    assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
  }
  for (const neighbor of fr[0].atlas.related) {
    assert(glossaryEntries.some(entry => entry.slug === neighbor));
    assert(glossaryAtlasEnBySlug.has(neighbor));
  }
}
for (const [entry, article] of [[glossaryEntries.find(entry => entry.slug === 'incidence-fiscale'), smallParcelsFr], [glossaryAtlasEnBySlug.get('incidence-fiscale'), smallParcelsEn]]) {
  assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
}

// PC memory keeps working memory, storage and average selling prices distinct.
const pcMemoryFr = '/posts/ia-memoire-prix-ordinateurs/';
const pcMemoryEn = '/en/analysis/ai-memory-pc-prices/';
for (const slug of ['dram', 'asp']) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  assert.deepEqual(fr[0].atlas.related, en[0].atlas.related);
  assert.deepEqual(fr[0].atlas.sources.map(source => source.href), en[0].atlas.sources.map(source => source.href));
  for (const [entry, article] of [[fr[0], pcMemoryFr], [en[0], pcMemoryEn]]) {
    assert.equal(entry.guide, article);
    assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'dram').def, /volatile.*rafraîchissement.*NAND/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'asp').def, /composition des ventes.*qualité comparable/u);
for (const slug of ['hbm', 'nand', 'ssd', 'wafer']) {
  for (const [entry, article] of [[glossaryEntries.find(entry => entry.slug === slug), pcMemoryFr], [glossaryAtlasEnBySlug.get(slug), pcMemoryEn]]) {
    assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
    assert.equal(entry.atlas.related.filter(link => link === 'dram').length, 1);
  }
}

// Blended finance keeps first-loss size, concessionality and financial additionality distinct.
const transitionFirstLossFr = '/posts/transition-energetique-premiere-perte-finance-mixte/';
const transitionFirstLossEn = '/en/analysis/energy-transition-first-loss-blended-finance/';
for (const slug of ['financement-mixte', 'premiere-perte', 'concessionnalite', 'additionnalite-financiere']) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  assert.deepEqual(fr[0].atlas.related, en[0].atlas.related);
  assert.deepEqual(fr[0].atlas.sources.map(link => link.href), en[0].atlas.sources.map(link => link.href));
  for (const [entry, article] of [[fr[0], transitionFirstLossFr], [en[0], transitionFirstLossEn]]) {
    assert.equal(entry.guide, article);
    assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'concessionnalite').def, /prix de référence et un dénominateur/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'additionnalite-financiere').def, /situation crédible sans cette intervention/u);

// Stablecoin reserve income, the issuer principal and the company-defined RLDC remain distinct.
const reserveIncomeFr = '/posts/stablecoins-remuneration-reserves-occ-circle-coinbase/';
const reserveIncomeEn = '/en/analysis/stablecoins-yield-reserves-occ-circle-coinbase/';
for (const slug of ['rldc', 'revenu-de-reserve']) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug), en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  assert.deepEqual(fr[0].atlas.related, en[0].atlas.related);
  assert.deepEqual(fr[0].atlas.sources.map(link => link.href), en[0].atlas.sources.map(link => link.href));
  for (const [entry, article] of [[fr[0], reserveIncomeFr], [en[0], reserveIncomeEn]]) {
    assert.equal(entry.guide, article);
    assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'rldc').def, /définie par Circle.*avant les charges opérationnelles/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'revenu-de-reserve').def, /distinct du principal.*récompense/u);

// AI governance distinguishes a company purpose, special control rights and public ownership.
const aiGovernanceFr = '/posts/gouvernance-ia-anthropic-etat-nationalisation/';
const aiGovernanceEn = '/en/analysis/ai-governance-anthropic-state-ownership/';
for (const [slug, sources] of [["pbc", ["https://delcode.delaware.gov/title8/c001/sc15/index.html"]], ["golden-share", ["https://www.ussteel.com/documents/40705/17349221/Q1%2B2026%2BCondensed%2BConsolidated%2BFinancial%2BStatements%2BvPosting.pdf/f60026fb-7682-7f9b-5c9d-af201ece1735?t=1778673519786", "https://www.nipponsteel.com/en/newsroom/news/2025/pdf/20250614_100.pdf"]], ["fonds-souverain", ["https://ifswf.org/sites/default/files/santiagoprinciples_0_0.pdf"]]]) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(en[0].robots, 'noindex,follow');
  assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  assert.deepEqual(fr[0].atlas.related, en[0].atlas.related);
  for (const [entry, article] of [[fr[0], aiGovernanceFr], [en[0], aiGovernanceEn]]) {
    assert.equal(entry.guide, article);
    assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
    assert.deepEqual(entry.atlas.sources.map(source => source.href), sources);
    assert.doesNotMatch(entry.def, /[—]/u);
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'pbc').def, /but lucratif.*équilibrer.*actionnaires.*matériellement affectées/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'golden-share').def, /décisions définies.*participation économique.*matières énumérées/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'fonds-souverain').def, /administrations publiques.*macroéconomiques.*objectifs financiers/u);
assert.doesNotMatch(glossaryEntries.find(entry => entry.slug === 'fonds-souverain').def, /[0-9]|Anthropic|OpenAI/u);
assert.match(glossaryAtlasEnBySlug.get('fonds-souverain').def, /owned by general government.*macroeconomic purposes/u);

// Meta financing definitions keep voting rights, ownership and settlement distinct.
const metaFinancingFr = '/posts/meta-financement-actions-c-droits-vote/';
const metaFinancingEn = '/en/analysis/meta-financing-class-c-voting-rights/';
for (const slug of ['forward-sur-actions', 'dilution-du-capital', 'action-sans-droit-de-vote']) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(en[0].robots, 'noindex,follow');
  assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  assert.deepEqual(fr[0].atlas.sources.map(link => link.href), en[0].atlas.sources.map(link => link.href));
  assert.deepEqual(fr[0].atlas.related, en[0].atlas.related);
  for (const [entry, article] of [[fr[0], metaFinancingFr], [en[0], metaFinancingEn]]) {
    assert.equal(entry.guide, article);
    assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
    assert(entry.atlas.sources.every(link => new URL(link.href).origin === 'https://www.sec.gov'));
    assert.doesNotMatch(entry.def, /[—]/u);
  }
}
for (const [entry, article] of [[glossaryEntries.find(entry => entry.slug === 'capex'), metaFinancingFr], [glossaryAtlasEnBySlug.get('capex'), metaFinancingEn]]) {
  assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
  assert.equal(entry.atlas.articles.length, 5);
}

// Service continuity and card acquiring retain distinct operational scopes.
const blackoutArticleFr = '/posts/blackout-heures-autonomie-financement/';
const blackoutArticleEn = '/en/analysis/blackouts-who-pays-service-continuity/';
for (const [slug, sources, related] of [
  ['continuite-de-service', [
    'https://csrc.nist.gov/glossary/term/business_continuity_plan',
    'https://www.arcep.fr/uploads/tx_gspublication/reseaux-du-futur_note-synthese_resilience-des-reseaux_mai2025.pdf',
  ], ['disponibilite-de-service', 'rto', 'acquereur-de-paiements']],
  ['acquereur-de-paiements', [
    'https://www.riksbank.se/en-gb/payments--cash/payment-preparedness/offline-payments/',
  ], ['continuite-de-service']],
]) {
  const frMatches = glossaryEntries.filter(entry => entry.slug === slug);
  const enMatches = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(frMatches.length, 1); assert.equal(enMatches.length, 1);
  const fr = frMatches[0], en = enMatches[0];
  assert(fr.atlas && en.atlas);
  assert.equal(fr.sectionTitle, 'Économie numérique & données');
  assert.equal(en.sectionTitle, 'Digital economy & data');
  assert.equal(fr.reference, undefined); assert.equal(fr.referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert.equal(englishGlossaryRobots(en), 'noindex,follow');
  assert.notEqual(fr.def, en.def);
  for (const [entry, article] of [[fr, blackoutArticleFr], [en, blackoutArticleEn]]) {
    assert.equal(entry.guide, article);
    assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
    assert.deepEqual(entry.atlas.sources.map(link => link.href), sources);
    assert.deepEqual(entry.atlas.related, related);
    assert.doesNotMatch(entry.def, /[—]/u);
  }
  for (const peer of related) {
    assert(glossaryEntries.some(entry => entry.slug === peer));
    assert(glossaryAtlasEnBySlug.has(peer));
  }
}
for (const [entry, article] of [
  [glossaryEntries.find(term => term.slug === 'disponibilite-de-service'), blackoutArticleFr],
  [glossaryAtlasEnBySlug.get('disponibilite-de-service'), blackoutArticleEn],
]) {
  assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
  assert.equal(entry.atlas.articles.length, 3);
}
assert.match(glossaryEntries.find(entry => entry.slug === 'continuite-de-service').def, /fonction utile.*personnes.*équipements.*procédures.*partenaires.*utilisateurs/u);
assert.match(glossaryAtlasEnBySlug.get('continuite-de-service').def, /useful function.*people.*equipment.*procedures.*partners.*users/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'acquereur-de-paiements').def, /reconnexion.*commerçant.*émetteur/u);
assert.match(glossaryAtlasEnBySlug.get('acquereur-de-paiements').def, /reconnection.*merchant.*issuer/u);

// Tax terms retain their legal scope and stay short, sourced definitions.
const cumCumArticleFr = '/posts/cumcum-01-dividende-mecanisme/';
const cumCumArticleEn = '/en/analysis/cum-cum-01-dividend-mechanism/';
for (const slug of ['retenue-a-la-source', 'pret-de-titres', 'beneficiaire-effectif', 'cjip']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: sourced bilingual definitions required`);
  assert.equal(fr.reference, undefined);
  assert.equal(fr.referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert.equal(englishGlossaryRobots(en), 'noindex,follow');
  assert.equal(fr.guide, cumCumArticleFr);
  assert.equal(en.guide, cumCumArticleEn);
  assert.deepEqual(fr.atlas.sources.map(source => source.href), en.atlas.sources.map(source => source.href));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
  for (const [entry, article] of [[fr, cumCumArticleFr], [en, cumCumArticleEn]]) {
    assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
    assert(entry.atlas.sources.every(source => ['https://www.justice.gouv.fr', 'https://www.conseil-etat.fr', 'https://www.ecb.europa.eu', 'https://bofip.impots.gouv.fr'].includes(new URL(source.href).origin)));
    assert(!entry.def.includes('—'));
  }
  for (const neighbor of fr.atlas.related) {
    assert(glossaryEntries.some(entry => entry.slug === neighbor));
    assert(glossaryAtlasEnBySlug.has(neighbor));
  }
}
for (const [entry, article] of [[glossaryEntries.find(item => item.slug === 'trs'), cumCumArticleFr], [glossaryAtlasEnBySlug.get('trs'), cumCumArticleEn]]) {
  assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
  assert.equal(entry.atlas.sources.length, 2);
  assert.deepEqual(entry.atlas.related, ['risque-de-contrepartie', 'ensemble-de-compensation', 'notionnel']);
}
assert.equal(glossaryEntries.find(item => item.slug === 'trs').guide, '/posts/barclays-credit-prive-trs-risque/');
assert.equal(glossaryAtlasEnBySlug.get('trs').guide, '/en/analysis/barclays-private-credit-trs-risk/');

// Tax procedure distinguishes proposed adjustments from collection and preserves prior guides.
const cumCumTimelineFr = '/posts/cumcum-02-alertes-chronologie/';
const cumCumTimelineEn = '/en/analysis/cum-cum-02-warnings-timeline/';
for (const slug of ['proposition-de-rectification', 'retenue-a-la-source', 'pret-de-titres', 'cjip']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en?.atlas, `${slug}: bilingual timeline links required`);
  for (const [entry, article] of [[fr, cumCumTimelineFr], [en, cumCumTimelineEn]]) {
    assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
  }
}
const proposedAdjustmentFr = glossaryEntries.find(entry => entry.slug === 'proposition-de-rectification');
const proposedAdjustmentEn = glossaryAtlasEnBySlug.get('proposition-de-rectification');
assert.equal(proposedAdjustmentFr.reference, undefined);
assert.equal(proposedAdjustmentFr.referenceCandidate, false);
assert.equal(englishGlossaryRobots(proposedAdjustmentEn), 'noindex,follow');
assert.equal(proposedAdjustmentFr.guide, cumCumTimelineFr);
assert.equal(proposedAdjustmentEn.guide, cumCumTimelineEn);
assert.deepEqual(proposedAdjustmentFr.atlas.sources.map(source => source.href), proposedAdjustmentEn.atlas.sources.map(source => source.href));
assert.deepEqual(proposedAdjustmentFr.atlas.related, proposedAdjustmentEn.atlas.related);
for (const entry of [proposedAdjustmentFr, proposedAdjustmentEn]) {
  assert.equal(entry.atlas.sources.length, 2);
  assert(entry.atlas.sources.every(source => new URL(source.href).origin === 'https://bofip.impots.gouv.fr'));
  assert(!entry.def.includes('—'));
}

// Feeder debt remains a sourced short definition; cash and capital follow distinct contracts.
const feederArticleFr = '/posts/credit-prive-porte-assureurs-rated-feeders/';
const feederArticleEn = '/en/analysis/private-credit-route-insurers-rated-feeders/';
for (const slug of ['rated-feeder-note', 'rehaussement-de-credit', 'rbc', 'pik', 'nav']) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined);
  // Keep the historical feeder candidate without admitting it as an indexed reference.
  assert.equal(fr[0].referenceCandidate, slug === 'rated-feeder-note');
  assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  for (const [entry, article] of [[fr[0], feederArticleFr], [en[0], feederArticleEn]]) {
    assert(entry.atlas.articles.some(link => link.href === article));
    assert(!entry.def.includes('—'));
  }
}
for (const slug of ['rated-feeder-note', 'rehaussement-de-credit']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert.equal(fr.guide, feederArticleFr); assert.equal(en.guide, feederArticleEn);
  assert.deepEqual(fr.atlas.sources.map(source => source.href), en.atlas.sources.map(source => source.href));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
  for (const entry of [fr, en]) {
    assert.equal(entry.atlas.sources.length, 3);
    for (const source of entry.atlas.sources) {
      const url = new URL(source.href);
      assert.equal(url.protocol, 'https:');
      assert(['https://assets.fitchratings.com', 'https://content.naic.org', 'https://www.investor.gov'].some(origin => url.origin === origin));
    }
    for (const related of entry.atlas.related) {
      assert(glossaryEntries.some(candidate => candidate.slug === related));
      assert(glossaryAtlasEnBySlug.has(related));
    }
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'rated-feeder-note').def, /qualification comptable.*désignation de crédit.*règles applicables/);
assert.match(glossaryAtlasEnBySlug.get('rated-feeder-note').def, /accounting classification.*credit designation.*applicable rules/);
assert.match(glossaryEntries.find(entry => entry.slug === 'rehaussement-de-credit').def, /absorbent des pertes.*portée dépend.*conditions contractuelles/);
assert.match(glossaryAtlasEnBySlug.get('rehaussement-de-credit').def, /absorb losses.*effect depends.*contractual terms/);
assert.equal(glossaryEntries.find(entry => entry.slug === 'rbc').guide, '/guides/lire-la-solidite-d-un-assureur-vie/');
assert.equal(glossaryAtlasEnBySlug.get('rbc').guide, '/en/guides/read-life-insurer-health/');
assert.equal(glossaryEntries.find(entry => entry.slug === 'pik').guide, '/posts/credit-prive-logiciels-ia-revenus-dette/');
assert.equal(glossaryAtlasEnBySlug.get('pik').guide, '/en/analysis/private-credit-software-ai-cash-flows-debt/');

// Ore mass bases retain their moisture distinction and remain sourced short pages.
const ironOreArticleFr = '/posts/minerai-fer-prix-attente-fortescue-cmrg/';
const ironOreArticleEn = '/en/analysis/iron-ore-price-of-waiting-fortescue-cmrg/';
for (const slug of ['wmt', 'dmt']) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert(!glossaryReferenceCandidateSlugs.includes(slug));
  assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  for (const [entry, article] of [[fr[0], ironOreArticleFr], [en[0], ironOreArticleEn]]) {
    assert.equal(entry.guide, article);
    assert.deepEqual(entry.atlas.articles.map(link => link.href), [article]);
    assert.equal(entry.atlas.sources.length, 2);
    assert.deepEqual(entry.atlas.related, [slug === 'wmt' ? 'dmt' : 'wmt', 'c1']);
    assert(!entry.def.includes('—'));
  }
  assert.match(fr[0].def, /humidité|humide/);
  assert.match(en[0].def, /moisture/);
}
for (const [terms, article, originalBfrGuide, originalC1Guide] of [
  [glossaryEntries, ironOreArticleFr, '/posts/cacao-ghana-financement-tresorerie/', '/posts/soufre-crise-golfe-engrais-nickel/'],
  [glossaryAtlasEn, ironOreArticleEn, '/en/analysis/ghana-cocoa-financing-cash-crisis/', '/en/analysis/sulfur-gulf-crisis-fertilizers-nickel/'],
]) {
  for (const slug of ['bfr', 'c1', 'cfr']) {
    const entry = terms.find(term => term.slug === slug);
    assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
  }
  assert.equal(terms.find(term => term.slug === 'bfr').guide, originalBfrGuide);
  assert.equal(terms.find(term => term.slug === 'c1').guide, originalC1Guide);
  assert(terms.find(term => term.slug === 'c1').atlas.sources.some(link => new URL(link.href).origin === 'https://www.ivanhoemines.com'));
  assert(terms.find(term => term.slug === 'cfr').atlas.sources.some(link => new URL(link.href).origin === 'https://academy.iccwbo.org'));
  assert.deepEqual(terms.find(term => term.slug === 'c1').atlas.related, ['wmt', 'dmt']);
}

// Semiconductor terms remain distinct, sourced definitions with reciprocal links.
const heliumWaferArticleFr = '/posts/helium-geopolitique-sous-les-puces/';
const heliumWaferArticleEn = '/en/analysis/helium-geopolitics-beneath-the-wafer/';
for (const [slug, sources, related] of [["wafer", ["https://news.samsung.com/global/eight-major-steps-to-semiconductor-fabrication-part-1-creating-the-wafer"], ["esc", "conductivite-thermique"]], ["esc", ["https://csmantech.org/wp-content/acfrcwduploads/field_5e8cddf5ddd10/post_6573/15.3_Characterization_of_Electrostatic_Chuck.pdf"], ["wafer", "conductivite-thermique"]], ["conductivite-thermique", ["https://srdata.nist.gov/insulation/Home/DataFieldDef?Length=4", "https://tsapps.nist.gov/publication/get_pdf.cfm?pub_id=957066"], ["wafer", "esc"]]]) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert(!glossaryReferenceCandidateSlugs.includes(slug));
  assert.equal(en[0].robots, 'noindex,follow');
  assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  assert.notEqual(fr[0].def, en[0].def);
  for (const [entry, article, terms] of [[fr[0], heliumWaferArticleFr, glossaryEntries], [en[0], heliumWaferArticleEn, glossaryAtlasEn]]) {
    assert.equal(entry.guide, article);
    assert.deepEqual(entry.atlas.articles.map(link => link.href), slug === 'wafer' ? [article.startsWith('/en/') ? pcMemoryEn : pcMemoryFr, article] : [article]);
    assert.deepEqual(entry.atlas.sources.map(link => link.href), sources);
    assert.deepEqual(entry.atlas.related, slug === 'wafer' ? ['dram', ...related] : related);
    for (const peer of related) assert(terms.find(term => term.slug === peer).atlas.related.includes(slug));
    assert(!entry.def.includes('—'));
  }
}
for (const [entry, article, originalGuide] of [[glossaryEntries.find(term => term.slug === 'fonderie'), heliumWaferArticleFr, '/posts/tsmc-puces-data-centers-risque-electrique/'], [glossaryAtlasEnBySlug.get('fonderie'), heliumWaferArticleEn, '/en/analysis/tsmc-chip-demand-data-center-power-risk/']]) {
  assert.equal(entry.guide, originalGuide);
  assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
}

// Survey definitions retain their sample scope, primary sources and short-page indexation.
const cesArticleFr = '/posts/bce-menages-facture-plus-lourde/';
const cesArticleEn = '/en/analysis/ecb-households-bigger-bills/';
for (const [slug, sources, related] of [
  ['ces', ['https://www.ecb.europa.eu/stats/ecb_surveys/consumer_exp_survey/shared/pdf/CES_methodological_guide.en.pdf'], ['winsorisation', 'quintile-de-revenu', 'ipch']],
  ['winsorisation', ['https://www.ecb.europa.eu/stats/ecb_surveys/consumer_exp_survey/shared/pdf/CES_aggregate_statistics_guide.en.pdf'], ['ces', 'quintile-de-revenu']],
  ['quintile-de-revenu', ['https://www.ecb.europa.eu/stats/ecb_surveys/consumer_exp_survey/shared/pdf/CES_aggregate_statistics_guide.en.pdf'], ['ces', 'winsorisation']],
  ['ipch', ['https://ec.europa.eu/eurostat/web/hicp/overview', 'https://www.ecb.europa.eu/mopo/strategy/pricestab/html/index.en.html'], ['ces']],
]) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert(!glossaryReferenceCandidateSlugs.includes(slug));
  assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  if (slug !== 'ipch') assert.equal(fr[0].guide, cesArticleFr);
  for (const [entry, article, terms] of [[fr[0], cesArticleFr, glossaryEntries], [en[0], cesArticleEn, glossaryAtlasEn]]) {
    assert.deepEqual(entry.atlas.articles.map(link => link.href), [article]);
    assert.deepEqual(entry.atlas.sources.map(link => link.href), sources);
    assert.deepEqual(entry.atlas.related, related);
    for (const peer of related) assert(terms.find(term => term.slug === peer).atlas.related.includes(slug));
    assert(!entry.def.includes('—'));
  }
}

// Accounting expense recognition and a bank's cost ratio remain sourced short definitions.
const barclaysAiArticleFr = '/posts/barclays-ia-preuves-suppressions-postes/';
const barclaysAiArticleEn = '/en/analysis/barclays-ai-job-cuts-productivity-evidence/';
for (const [slug, sources, related] of [
  ['provision-comptable', ['https://www.ifrs.org/issued-standards/list-of-standards/ias-37-provisions-contingent-liabilities-and-contingent-assets/', 'https://www.ifrs.org/news-and-events/updates/ifric/2024/ifric-update-march-2024/', 'https://www.ifrs.org/issued-standards/list-of-standards/ias-19-employee-benefits/'], ['coefficient-d-exploitation']],
  ['coefficient-d-exploitation', ['https://home.barclays/content/dam/home-barclays/documents/investor-relations/ResultAnnouncements/Q32026Results/Q326-BPLC-Results-RA.pdf'], ['provision-comptable']],
]) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert(!glossaryReferenceCandidateSlugs.includes(slug));
  assert.equal(en[0].robots, 'noindex,follow');
  assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  for (const [entry, article, terms] of [[fr[0], barclaysAiArticleFr, glossaryEntries], [en[0], barclaysAiArticleEn, glossaryAtlasEn]]) {
    assert.equal(entry.guide, article);
    assert.deepEqual(entry.atlas.articles.map(link => link.href), [article]);
    assert.deepEqual(entry.atlas.sources.map(link => link.href), sources);
    assert.deepEqual(entry.atlas.related, related);
    for (const peer of related) assert(terms.find(term => term.slug === peer).atlas.related.includes(slug));
    assert(!entry.def.includes('—'));
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'provision-comptable').def, /IAS 37.*obligation actuelle.*sortie probable.*estimation fiable.*IAS 19/);
assert.match(glossaryAtlasEnBySlug.get('provision-comptable').def, /IAS 37.*present obligation.*probable outflow.*reliable estimate.*IAS 19/);
assert.match(glossaryEntries.find(entry => entry.slug === 'coefficient-d-exploitation').def, /dépenses totales d’exploitation par le revenu total.*varier.*revenus progressent plus vite/);
assert.match(glossaryAtlasEnBySlug.get('coefficient-d-exploitation').def, /total operating expenses divided by total income.*vary.*income grows faster/);
for (const slug of ['rachat-d-actions', 'actions-propres']) {
  for (const [entry, article] of [[glossaryEntries.find(term => term.slug === slug), barclaysAiArticleFr], [glossaryAtlasEnBySlug.get(slug), barclaysAiArticleEn]]) {
    assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
  }
}

// Ratings and outlooks remain distinct, sourced bilingual short definitions.
const ratingsArticleFr = '/posts/france-moodys-budget-2027-prix-dette/';
const ratingsArticleEn = '/en/analysis/france-moodys-reprieve-2027-borrowing-costs/';
for (const slug of ['agence-de-notation', 'perspective-de-notation']) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert(!glossaryReferenceCandidateSlugs.includes(slug));
  assert.equal(en[0].robots, 'noindex,follow');
  assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  assert.deepEqual(fr[0].atlas.sources.map(link => link.href), en[0].atlas.sources.map(link => link.href));
  assert.deepEqual(fr[0].atlas.related, en[0].atlas.related);
  for (const [entry, article, terms] of [[fr[0], ratingsArticleFr, glossaryEntries], [en[0], ratingsArticleEn, glossaryAtlasEn]]) {
    assert.equal(entry.guide, article);
    assert.deepEqual(entry.atlas.articles.map(link => link.href), [article]);
    for (const peer of entry.atlas.related) assert(terms.find(term => term.slug === peer).atlas.related.includes(slug));
    assert(!entry.def.includes('—'));
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'agence-de-notation').def, /prospective.*supervision directe d’ESMA.*distinct du rendement/);
assert.match(glossaryAtlasEnBySlug.get('agence-de-notation').def, /forward-looking.*directly supervised by ESMA.*separate question from market prices/);
assert.match(glossaryEntries.find(entry => entry.slug === 'perspective-de-notation').def, /distincte de la note.*perspective stable.*sans dégradation/);
assert.match(glossaryAtlasEnBySlug.get('perspective-de-notation').def, /separate from the current rating.*stable outlook.*without a downgrade/);
for (const slug of ['oat', 'btf', 'coupon-obligataire', 'decote-d-emission', 'prime-d-emission', 'investment-grade']) {
  for (const [entry, article] of [[glossaryEntries.find(term => term.slug === slug), ratingsArticleFr], [glossaryAtlasEnBySlug.get(slug), ratingsArticleEn]]) {
    assert.equal(entry.atlas.articles.filter(link => link.href === article).length, 1);
  }
}
assert.equal(glossaryEntries.find(entry => entry.slug === 'oat').reference, undefined);
assert.equal(englishGlossaryRobots(glossaryAtlasEnBySlug.get('oat')), 'noindex,follow');

// ModCo retains both assets and reserves; its two glossary neighbours link back.
for (const [entry, article] of [[glossaryEntries.find(item => item.slug === 'modco'), '/posts/assureurs-03-bermudes-reassurance-jackson-athene/'], [glossaryAtlasEnBySlug.get('modco'), '/en/analysis/bermuda-reinsurance-jackson-athene/']]) {
  assert(entry?.atlas);
  assert.equal(entry.guide, article);
  assert.deepEqual(entry.atlas.articles.map(link => link.href), [article]);
  assert.deepEqual(entry.atlas.sources.map(link => link.href), ['https://cdn.bma.bm/documents/2024-09-06-12-10-21-Bermuda-Long-Term-Insurance-Collateral-Structures.pdf']);
  assert.deepEqual(entry.atlas.related, ['funds-withheld', 'recapture']);
  for (const slug of entry.atlas.related) {
    assert(glossaryEntries.find(term => term.slug === slug).atlas.related.includes('modco'));
    assert(glossaryAtlasEnBySlug.get(slug).atlas.related.includes('modco'));
  }
}
assert.equal(glossaryEntries.find(item => item.slug === 'modco').reference, undefined);
assert.equal(englishGlossaryRobots(glossaryAtlasEnBySlug.get('modco')), 'noindex,follow');
assert.match(glossaryEntries.find(item => item.slug === 'modco').def, /conserve les actifs et les réserves/);
assert.match(glossaryAtlasEnBySlug.get('modco').def, /retains both assets and reserves/);

// Pension insurance keeps the legal obligor and jurisdiction explicit.
const pensionArticleFr = '/posts/assureurs-01-contrat-change-de-mains/';
const pensionArticleEn = '/en/analysis/when-pension-contracts-change-hands/';
for (const [slug, sources, related] of [
  ['pension-risk-transfer', ['https://content.naic.org/cipr_topics/topic_pension_risk_transfer.htm', 'https://www.pbgc.gov/guidance/annuities'], ['buy-in-buy-out']],
  ['buy-in-buy-out', ['https://www.thepensionsregulator.gov.uk/en/document-library/scheme-management-detailed-guidance/funding-and-investment-detailed-guidance/new-models-and-options-in-defined-benefit-pensions-schemes'], ['pension-risk-transfer']],
]) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert.equal(en[0].robots, 'noindex,follow'); assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  for (const [entry, article, terms] of [[fr[0], pensionArticleFr, glossaryEntries], [en[0], pensionArticleEn, glossaryAtlasEn]]) {
    assert.equal(entry.guide, article);
    assert.deepEqual(entry.atlas.articles.map(item => item.href), [article]);
    assert.deepEqual(entry.atlas.sources.map(item => item.href), sources);
    assert.deepEqual(entry.atlas.related, related);
    for (const neighbor of related) assert(terms.find(term => term.slug === neighbor).atlas.related.includes(slug));
    assert(!entry.def.includes('—'));
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'pension-risk-transfer').def, /prestations définies.*débiteur légal.*protection/);
assert.match(glossaryAtlasEnBySlug.get('pension-risk-transfer').def, /defined-benefit.*legally responsible.*protection/);
assert.match(glossaryEntries.find(entry => entry.slug === 'buy-in-buy-out').def, /Royaume-Uni.*actif.*trustees restent juridiquement responsables.*buy-out.*directement responsable/);
assert.match(glossaryAtlasEnBySlug.get('buy-in-buy-out').def, /In the UK.*scheme asset.*trustees remain legally responsible.*buy-out.*directly responsible/);
for (const slug of ['alm', 'reassurance-adossee-a-l-actif', 'recapture']) {
  assert(glossaryEntries.find(entry => entry.slug === slug).atlas.articles.some(link => link.href === pensionArticleFr));
  assert(glossaryAtlasEnBySlug.get(slug).atlas.articles.some(link => link.href === pensionArticleEn));
}

// Manufacturing capacity and investment spending retain their distinct scopes in both languages.
for (const [slug, sources] of [
  ['fonderie', ['https://www.tsmc.com/english/aboutTSMC/company_profile']],
  ['capex', ['https://www.sec.gov/about/reports-publications/investorpubsbegfinstmtguide', 'https://www.microsoft.com/en-us/investor/events/fy-2026/earnings-fy-2026-q4']],
]) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert.equal(en[0].robots, 'noindex,follow'); assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  assert.notEqual(fr[0].def, en[0].def); assert.deepEqual(fr[0].atlas.related, en[0].atlas.related);
  for (const [entry, article, terms] of [[fr[0], '/posts/tsmc-puces-data-centers-risque-electrique/', glossaryEntries], [en[0], '/en/analysis/tsmc-chip-demand-data-center-power-risk/', glossaryAtlasEn]]) {
    const expectedArticles = slug === 'capex'
      ? [terms === glossaryEntries ? '/posts/microsoft-profit-ia-segments-capex-tresorerie/' : '/en/analysis/microsoft-ai-profit-segments-capex-cash-flow/', article, terms === glossaryEntries ? '/posts/nebius-citi-credit-364-jours-gpu/' : '/en/analysis/nebius-citi-364-day-gpu-credit/', terms === glossaryEntries ? '/posts/aimants-terres-rares-gm-vac-usine-contrat/' : '/en/analysis/us-rare-earth-magnets-gm-vac-offtake-risk/', terms === glossaryEntries ? metaFinancingFr : metaFinancingEn]
      : [article, terms === glossaryEntries ? heliumWaferArticleFr : heliumWaferArticleEn];
    assert.equal(entry.guide, article); assert.deepEqual(entry.atlas.articles.map(link => link.href), expectedArticles);
    assert.deepEqual(entry.atlas.sources.map(source => source.href), sources);
    assert.doesNotMatch(entry.def, /[—]/u);
    for (const neighbor of entry.atlas.related) {
      const related = terms.find(term => term.slug === neighbor);
      assert(related, `${slug}: missing related term ${neighbor}`);
      assert(related.atlas.related.includes(slug), `${slug}: missing reciprocal relation from ${neighbor}`);
    }
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'fonderie').def, /clients.*circuits intégrés.*conçus.*wafers/u);
assert.match(glossaryAtlasEnBySlug.get('fonderie').def, /integrated circuits designed by its customers.*silicon wafers/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'capex').def, /périmètre publié.*investissements payés.*location.*engagements futurs.*budget.*prévues.*période/u);
assert.match(glossaryAtlasEnBySlug.get('capex').def, /scope.*cash investment.*leases.*future commitments.*budget.*planned.*actual expenditure.*period/u);

// Industrial funding distinguishes a remedy standstill, project recourse and tax-credit proceeds.
const vacArticleFr = '/posts/aimants-terres-rares-gm-vac-usine-contrat/';
const vacArticleEn = '/en/analysis/us-rare-earth-magnets-gm-vac-offtake-risk/';
for (const [slug, source, related] of [["forbearance", "https://www.sec.gov/Archives/edgar/data/1385849/000106299326005306/exhibit99-2.htm", ["covenant"]], ["financement-sans-recours", "https://ppp.worldbank.org/financing/project-finance-concepts", ["offtake", "collateral"]], ["credit-d-impot-transferable", "https://www.irs.gov/credits-deductions/elective-pay-and-transferability-frequently-asked-questions-transferability", ["capex"]]]) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert.equal(en[0].robots, 'noindex,follow'); assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  assert.notEqual(fr[0].def, en[0].def);
  for (const [entry, article, terms] of [[fr[0], vacArticleFr, glossaryEntries], [en[0], vacArticleEn, glossaryAtlasEn]]) {
    assert.equal(entry.guide, article);
    assert.deepEqual(entry.atlas.articles.map(link => link.href), [article]);
    assert.deepEqual(entry.atlas.sources.map(link => link.href), [source]);
    assert.deepEqual(entry.atlas.related, related);
    for (const neighbor of related) assert(terms.find(term => term.slug === neighbor).atlas.related.includes(slug));
    assert(!entry.def.includes('—'));
  }
}
for (const slug of ['forbearance', 'financement-sans-recours', 'credit-d-impot-transferable', 'covenant', 'capex', 'offtake', 'collateral', 'credit-renouvelable', 'pret-senior-garanti']) {
  for (const [entry, article] of [[glossaryEntries.find(term => term.slug === slug), vacArticleFr], [glossaryAtlasEnBySlug.get(slug), vacArticleEn]]) {
    assert.deepEqual(entry.atlas.articles.filter(link => link.href === article).map(link => link.href), [article], `${slug}: missing or duplicate GM/VAC backlink`);
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'forbearance').def, /temporairement.*recours.*manquements.*sans prolonger.*échéance.*principal/u);
assert.match(glossaryAtlasEnBySlug.get('forbearance').def, /temporarily.*remedies.*defaults.*maturity and principal unchanged/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'financement-sans-recours').def, /flux et les actifs du projet.*actionnaires.*garanties, exceptions/u);
assert.match(glossaryAtlasEnBySlug.get('financement-sans-recours').def, /cash flows and assets.*shareholders.*Guarantees, exceptions/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'credit-d-impot-transferable').def, /6418.*48C.*tiers non lié.*numéraire.*prix brut.*trésorerie nette/u);
assert.match(glossaryAtlasEnBySlug.get('credit-d-impot-transferable').def, /6418.*48C.*unrelated party.*cash.*gross sale proceeds.*net cash/u);

// The Nebius analysis connects funding terms without promoting short glossary pages.
for (const slug of ['sofr', 'rpo', 'capex', 'collateral', 'covenant', 'revenus-differes']) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  for (const [entry, article] of [[fr[0], '/posts/nebius-citi-credit-364-jours-gpu/'], [en[0], '/en/analysis/nebius-citi-364-day-gpu-credit/']]) {
    assert.deepEqual(entry.atlas.articles.filter(link => link.href === article).map(link => link.href), [article], `${slug}: missing or duplicate Nebius backlink`);
  }
}
for (const [slug, sources] of [
  ['sofr', ['https://www.newyorkfed.org/markets/reference-rates/sofr', 'https://www.cmegroup.com/market-data/cme-group-benchmark-administration/term-sofr.html']],
  ['covenant', ['https://www.sec.gov/Archives/edgar/data/1513845/000110465926117978/tm2628078d1_6k.htm']],
  ['revenus-differes', ['https://www.sec.gov/Archives/edgar/data/1513845/000110465926094844/nbis-20260812xex99d2.htm']],
]) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert.equal(en.robots, 'noindex,follow');
  assert.notEqual(fr.def, en.def);
  assert.deepEqual(fr.atlas.sources.map(link => link.href), sources);
  assert.deepEqual(en.atlas.sources.map(link => link.href), sources);
}
assert.match(glossaryEntries.find(entry => entry.slug === 'sofr').def, /jour le jour.*Term SOFR.*prospectif.*contrats à terme.*marge contractuelle/u);
assert.match(glossaryAtlasEnBySlug.get('sofr').def, /overnight.*Term SOFR.*forward-looking.*futures.*contractual margin/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'covenant').def, /seuil financier.*définitions.*exceptions.*manquement.*modalités précises/u);
assert.match(glossaryAtlasEnBySlug.get('covenant').def, /financial threshold.*definitions.*exceptions.*breach.*detailed terms/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'revenus-differes').def, /Passif.*payé avant.*prestation.*remboursées.*solde au bilan.*tableau des flux/u);
assert.match(glossaryAtlasEnBySlug.get('revenus-differes').def, /liability.*paid before.*performance obligations.*refundable.*balance-sheet.*cash-flow/u);

// Product and geographic scopes must remain explicit in EIA inventory comparisons.
for (const [slug, sources] of [
  ['distillats', ['https://www.eia.gov/tools/glossary/index.php?id=distillate']],
  ['padd', ['https://www.eia.gov/TOOLS/GLOSSARY/index.php?id=petroleum', 'https://www.eia.gov/todayinenergy/detail.php?id=4890']],
]) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert.equal(en[0].robots, 'noindex,follow'); assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  assert.equal(fr[0].sectionTitle, 'Énergie & géopolitique'); assert.equal(en[0].sectionTitle, 'Energy & geopolitics');
  assert.notEqual(fr[0].def, en[0].def); assert.deepEqual(fr[0].atlas.related, en[0].atlas.related);
  for (const [entry, article, terms] of [[fr[0], '/posts/petrole-flux-gazole-stocks-tresorerie/', glossaryEntries], [en[0], '/en/analysis/oil-flows-diesel-stocks-liquidity/', glossaryAtlasEn]]) {
    assert.equal(entry.guide, article); assert.deepEqual(entry.atlas.articles.map(link => link.href), [article]);
    assert.deepEqual(entry.atlas.sources.map(source => source.href), sources);
    assert.doesNotMatch(entry.def, /[—]/u);
    for (const neighbor of entry.atlas.related) {
      const related = terms.find(term => term.slug === neighbor);
      assert(related, `${slug}: missing related term ${neighbor}`);
      assert(related.atlas.related.includes(slug), `${slug}: missing reciprocal relation from ${neighbor}`);
    }
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'distillats').def, /statistiques de l’EIA.*diesel.*fiouls.*chauffage.*dépasse le seul gazole routier/u);
assert.match(glossaryAtlasEnBySlug.get('distillats').def, /diesel fuels.*fuel oils.*heating oil.*EIA statistics.*beyond road diesel/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'padd').def, /cinquante États.*DC.*cinq districts.*PADD 1.*côte Est.*PADD 6 et 7.*exclus des totaux/u);
assert.match(glossaryAtlasEnBySlug.get('padd').def, /fifty states.*DC.*five districts.*PADD 1.*East Coast.*PADDs 6 and 7.*excluded.*US totals/u);

// Total-return transfer, counterparty default and recognised netting have separate scopes.
for (const [slug, sourceUrls] of [
  ['trs', ['https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/sftr/article-3-definitions', 'https://www.gov.uk/hmrc-internal-manuals/corporate-finance-manual/cfm13380']],
  ['risque-de-contrepartie', ['https://www.bis.org/committees/bcbs/basel-framework/standard/cre/50/inforce/2019-12-15/published/2024-07-05']],
  ['ensemble-de-compensation', ['https://www.bis.org/committees/bcbs/basel-framework/standard/cre/50/inforce/2019-12-15/published/2024-07-05']],
]) {
  const frMatches = glossaryEntries.filter(entry => entry.slug === slug);
  const enMatches = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(frMatches.length, 1); assert.equal(enMatches.length, 1);
  const fr = frMatches[0], en = enMatches[0];
  assert.equal(fr.reference, undefined); assert.equal(fr.referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert.equal(en.robots, 'noindex,follow'); assert.equal(englishGlossaryRobots(en), 'noindex,follow');
  assert.equal(fr.sectionTitle, 'Banques & gestion du bilan');
  assert.equal(en.sectionTitle, 'Banking & balance-sheet management');
  assert.notEqual(fr.def, en.def);
  assert.deepEqual(fr.atlas.sources.map(source => source.href), sourceUrls);
  assert.deepEqual(fr.atlas.sources.map(source => source.href), en.atlas.sources.map(source => source.href));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
  for (const [entry, article, terms] of [[fr, '/posts/barclays-credit-prive-trs-risque/', glossaryEntries], [en, '/en/analysis/barclays-private-credit-trs-risk/', glossaryAtlasEn]]) {
    assert.equal(entry.guide, article);
    const articles = slug === 'trs' ? [article, entry === fr ? cumCumArticleFr : cumCumArticleEn] : [article];
    assert.deepEqual(entry.atlas.articles.map(link => link.href), articles);
    assert.doesNotMatch(entry.def, /[—]/u);
    for (const source of entry.atlas.sources) {
      const url = new URL(source.href);
      assert.equal(url.protocol, 'https:'); assert.equal(url.username, ''); assert.equal(url.password, '');
    }
    for (const neighbor of entry.atlas.related) {
      const related = terms.find(term => term.slug === neighbor);
      assert(related, `${slug}: missing related term ${neighbor}`);
      assert(related.atlas.related.includes(slug), `${slug}: missing reciprocal relation from ${neighbor}`);
    }
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'trs').def, /revenus.*variations de prix.*pertes de crédit.*propriété juridique/u);
assert.match(glossaryAtlasEnBySlug.get('trs').def, /income.*price movements.*credit losses.*legal ownership/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'risque-de-contrepartie').def, /défaut avant.*valeur économique positive/u);
assert.match(glossaryAtlasEnBySlug.get('risque-de-contrepartie').def, /defaults before.*positive economic value/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'ensemble-de-compensation').def, /cadre de Bâle.*même contrepartie.*juridiquement exécutoire.*capital réglementaire.*propre ensemble/u);
assert.match(glossaryAtlasEnBySlug.get('ensemble-de-compensation').def, /Basel framework.*single counterparty.*legally enforceable.*regulatory capital.*own set/u);

// Distribution, household spending responses and macroeconomic effects use different denominators.
for (const slug of ['niveau-de-vie', 'propension-marginale-a-consommer', 'multiplicateur-budgetaire']) {
  const frMatches = glossaryEntries.filter(entry => entry.slug === slug);
  const enMatches = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(frMatches.length, 1); assert.equal(enMatches.length, 1);
  const fr = frMatches[0], en = enMatches[0];
  assert.equal(fr.reference, undefined); assert.equal(fr.referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert.equal(en.robots, 'noindex,follow'); assert.equal(englishGlossaryRobots(en), 'noindex,follow');
  assert.equal(fr.sectionTitle, 'Macro & banques centrales'); assert.equal(en.sectionTitle, 'Macro & central banks');
  assert.notEqual(fr.def, en.def);
  assert.deepEqual(fr.atlas.sources.map(source => source.href), en.atlas.sources.map(source => source.href));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
  for (const [entry, article] of [[fr, '/posts/budget-2027-repartition-effort-risque/'], [en, '/en/analysis/france-2027-budget-distribution-economic-risk/']]) {
    assert.equal(entry.guide, article); assert.deepEqual(entry.atlas.articles.map(link => link.href), [article]);
    assert.doesNotMatch(entry.def, /[—]/u);
    for (const source of entry.atlas.sources) {
      const url = new URL(source.href);
      assert.equal(url.protocol, 'https:'); assert.equal(url.username, ''); assert.equal(url.password, '');
    }
    for (const related of entry.atlas.related) {
      assert(glossaryEntries.some(term => term.slug === related)); assert(glossaryAtlasEnBySlug.has(related));
    }
  }
}
const livingStandardFr = glossaryEntries.find(entry => entry.slug === 'niveau-de-vie');
assert.equal(livingStandardFr.atlas.sources[0].href, 'https://www.insee.fr/fr/metadonnees/definition/c1890');

// Tax basis, annual loss use and MiCA classification retain separate legal scopes.
for (const slug of ['prix-de-revient-fiscal', 'imputation-des-moins-values', 'emt', 'art']) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(fr.length, 1); assert.equal(en.length, 1);
  assert.equal(fr[0].reference, undefined); assert.equal(fr[0].referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert.equal(englishGlossaryRobots(en[0]), 'noindex,follow');
  assert.equal(en[0].robots, 'noindex,follow');
  assert.notEqual(fr[0].def, en[0].def);
  assert.deepEqual(fr[0].atlas.sources.map(source => source.href), en[0].atlas.sources.map(source => source.href));
  assert.deepEqual(fr[0].atlas.related, en[0].atlas.related);
  for (const [entry, article] of [[fr[0], '/posts/stablecoins-fiscalite-calcul-plus-values/'], [en[0], '/en/analysis/france-stablecoin-tax-capital-gains/']]) {
    assert(entry.atlas.articles.some(link => link.href === article));
    assert.doesNotMatch(entry.def, /[0-9%£€$—]/u);
    for (const source of entry.atlas.sources) {
      const url = new URL(source.href);
      assert.equal(url.protocol, 'https:'); assert.equal(url.username, ''); assert.equal(url.password, '');
    }
    for (const related of entry.atlas.related) {
      assert(glossaryEntries.some(term => term.slug === related));
      assert(glossaryAtlasEnBySlug.has(related));
    }
  }
}
const taxBasisFr = glossaryEntries.find(entry => entry.slug === 'prix-de-revient-fiscal');
const taxBasisEn = glossaryAtlasEnBySlug.get('prix-de-revient-fiscal');
assert.match(taxBasisFr.atlas.whyNow, /régime français actuel.*réforme proposée/u);
assert.match(taxBasisEn.atlas.whyNow, /current regime.*proposed change/u);
assert(taxBasisFr.atlas.sources.some(source => source.href.startsWith('https://bofip.impots.gouv.fr/')));
assert(taxBasisFr.atlas.sources.some(source => source.href === 'https://www.assemblee-nationale.fr/dyn/17/amendements/3210A/AN/3898.pdf'));
assert.match(glossaryEntries.find(entry => entry.slug === 'imputation-des-moins-values').def, /patrimoine privé en France.*même nature.*même année.*exclut le report/u);
assert.match(glossaryAtlasEnBySlug.get('imputation-des-moins-values').def, /privately managed crypto-assets in France.*same type.*same year.*no carryforward/u);
assert.equal(glossaryEntries.find(entry => entry.slug === 'art').atlas.sources[0].href, 'https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mica/article-3-definitions');
assert.match(glossaryEntries.find(entry => entry.slug === 'art').def, /référence à une valeur, un droit ou une combinaison/u);
assert.match(glossaryAtlasEnBySlug.get('art').def, /reference to a value, a right or a combination/u);

// Market activity, execution quality and contractual size retain distinct scopes.
for (const [slug, sourceUrls] of [
  ['wash-trading', ['https://www.cmegroup.com/rulebook/files/cme-group-Rule-534.pdf']],
  ['slippage', [
    'https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/executing-order',
    'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-14',
  ]],
  ['teneur-de-marche', [
    'https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mifid-ii/article-4-definitions',
    'https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/executing-order',
  ]],
  ['notionnel', ['https://www.bis.org/publications/qr-202512/international-finance-through-lens-bis-statistics-derivatives-markets']],
]) {
  const frMatches = glossaryEntries.filter(entry => entry.slug === slug);
  const enMatches = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(frMatches.length, 1); assert.equal(enMatches.length, 1);
  const fr = frMatches[0], en = enMatches[0];
  assert.equal(fr.reference, undefined); assert.equal(fr.referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert.equal(englishGlossaryRobots(en), 'noindex,follow');
  for (const entry of [fr, en]) {
    assert(entry.atlas); assert(!entry.def.includes('—'));
    assert.deepEqual(entry.atlas.sources.map(source => source.href), sourceUrls);
    assert(entry.atlas.articles.some(article => article.href === (entry === fr
      ? '/posts/fifa-predictstreet-volume-wash-trading/'
      : '/en/analysis/fifa-predictstreet-trading-volume-risk/')));
    for (const neighbor of entry.atlas.related) {
      assert(glossaryEntries.some(term => term.slug === neighbor));
      assert(glossaryAtlasEnBySlug.has(neighbor));
    }
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'wash-trading').def, /intention.*contrôle des comptes/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'wash-trading').def, /accidentel.*position finale nulle.*ne suffit pas/u);
assert.match(glossaryAtlasEnBySlug.get('wash-trading').def, /accidental.*flat ending position.*does not by itself/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'slippage').def, /référence.*exécution.*quantités.*favorable ou défavorable.*frais/u);
assert.match(glossaryAtlasEnBySlug.get('slippage').def, /reference price.*actually obtained.*quantities.*favour or disadvantage.*fees/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'notionnel').def, /principal effectivement payable.*paiement éventuel.*base de calcul/u);
assert.match(glossaryAtlasEnBySlug.get('notionnel').def, /principal that must be paid.*contingent payout.*reference for calculating/u);
assert.doesNotMatch(glossaryEntries.find(entry => entry.slug === 'notionnel').def, /sans être lui-même échangé|surestime largement/u);
assert.equal(glossaryEntries.find(entry => entry.slug === 'teneur-de-marche').guide, '/guides/lire-le-gamma-des-dealers/');
assert.equal(glossaryEntries.find(entry => entry.slug === 'notionnel').guide, '/guides/lire-les-swaps-de-taux/');

// Recovery objectives must not overwrite the existing accounting meaning of RPO.
const recoverySlugs = ['rto', 'rpo-reprise', 'mtd'];
const continuitySource = 'https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-34r1.pdf';
const googleCloudBankingArticleFr = '/posts/google-cloud-banques-automates-londres/';
const googleCloudBankingArticleEn = '/en/analysis/google-cloud-banks-london-power-control-failure/';
for (const slug of recoverySlugs) {
  const frMatches = glossaryEntries.filter(entry => entry.slug === slug);
  const enMatches = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(frMatches.length, 1); assert.equal(enMatches.length, 1);
  const fr = frMatches[0], en = enMatches[0];
  assert.equal(fr.sectionTitle, 'Économie numérique & données');
  assert.equal(en.sectionTitle, 'Digital economy & data');
  assert.equal(fr.guide, '/posts/apres-cyberattaque-08-prix-reprise/');
  assert.equal(en.guide, '/en/analysis/after-cyberattack-08-faster-recovery-cost/');
  assert.equal(fr.reference, undefined); assert.equal(fr.referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert.equal(englishGlossaryRobots(en), 'noindex,follow');
  assert.notEqual(fr.def, en.def);
  for (const [entry, googleCloudArticle] of [[fr, googleCloudBankingArticleFr], [en, googleCloudBankingArticleEn]]) {
    assert.deepEqual(entry.atlas.sources.map(link => link.href), [continuitySource]);
    assert.deepEqual(entry.atlas.articles.map(link => link.href), slug === 'mtd' ? [entry.guide] : [entry.guide, googleCloudArticle]);
    assert.deepEqual(entry.atlas.related, recoverySlugs.filter(value => value !== slug));
    assert.doesNotMatch(entry.def, /[0-9%£€$—]/u);
  }
}
const accountingRpo = glossaryEntries.find(entry => entry.slug === 'rpo');
assert.equal(accountingRpo.nom, 'Obligations de performance restantes');
assert.equal(glossaryAtlasEnBySlug.get('rpo').nom, 'Remaining performance obligations');
assert.notEqual(accountingRpo.guide, glossaryEntries.find(entry => entry.slug === 'rpo-reprise').guide);
assert(!accountingRpo.atlas.articles.some(link => link.href === googleCloudBankingArticleFr));
assert(!glossaryAtlasEnBySlug.get('rpo').atlas.articles.some(link => link.href === googleCloudBankingArticleEn));
assert.match(glossaryEntries.find(entry => entry.slug === 'rpo-reprise').def, /perte maximale de données admissible.*durée/u);
assert.match(glossaryAtlasEnBySlug.get('rpo-reprise').def, /maximum acceptable data loss.*duration/u);

// A lender's cash advance, conditional public cover and UKEF's exposure ceiling have different scopes.
for (const [slug, sources, related] of [
  ['garantie-de-pret', ["https://www.gov.uk/guidance/export-development-guarantee", "https://committees.parliament.uk/publications/49980/documents/269099/default/"], ['pret-relais', 'responsabilite-maximale']],
  ['responsabilite-maximale', ["https://www.gov.uk/government/publications/uk-export-finance-annual-report-and-accounts-2025-to-2026/glossary-of-terms", "https://www.gov.uk/government/publications/uk-export-finance-business-supported-2025-to-2026/business-supported-2025-to-2026"], ['garantie-de-pret', 'pret-relais']],
]) {
  const frMatches = glossaryEntries.filter(entry => entry.slug === slug);
  const enMatches = glossaryAtlasEn.filter(entry => entry.slug === slug);
  assert.equal(frMatches.length, 1, `${slug}: unique French definition`);
  assert.equal(enMatches.length, 1, `${slug}: unique native English definition`);
  const fr = frMatches[0], en = enMatches[0];
  assert(fr.atlas && en.atlas);
  assert.equal(fr.guide, '/posts/apres-cyberattaque-07-etat-financement-crise/');
  assert.equal(en.guide, '/en/analysis/after-cyberattack-07-public-crisis-financing/');
  assert.equal(fr.sectionTitle, 'Banques & gestion du bilan');
  assert.equal(en.sectionTitle, 'Banking & balance-sheet management');
  assert.equal(fr.reference, undefined); assert.equal(fr.referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined, `${slug}: no reference-page promotion`);
  assert.equal(en.robots, 'noindex,follow');
  assert.equal(englishGlossaryRobots(en), 'noindex,follow');
  assert.notEqual(fr.def, en.def, `${slug}: native bilingual wording`);
  for (const entry of [fr, en]) {
    assert.equal(entry.accent, 'var(--color-topic-blue)');
    assert(entry.def.length >= 150 && entry.def.length <= 650, `${slug}: concise definition`);
    assert.doesNotMatch(entry.def, /[0-9%£€$—]/u, `${slug}: no invented amounts or rates`);
    assert.deepEqual(entry.atlas.articles.map(link => [link.href, link.kind]), [[entry.guide, 'article']]);
    assert.deepEqual(entry.atlas.sources.map(link => link.href), sources);
    assert.equal(new Set(entry.atlas.sources.map(link => link.href)).size, sources.length);
    for (const source of entry.atlas.sources) {
      assert.equal(source.kind, 'source');
      const url = new URL(source.href);
      assert.equal(url.href, source.href); assert.equal(url.protocol, 'https:');
      assert.equal(url.username, ''); assert.equal(url.password, ''); assert.equal(url.hash, '');
    }
    assert.deepEqual(entry.atlas.related, related);
    assert.equal(new Set(entry.atlas.related).size, related.length);
    for (const neighbor of related) {
      assert.equal(glossaryEntries.filter(term => term.slug === neighbor).length, 1);
      assert(glossaryAtlasEnBySlug.has(neighbor), `${slug}: bilingual related term ${neighbor}`);
    }
  }
}
const publicGuaranteeFr = glossaryEntries.find(entry => entry.slug === 'garantie-de-pret');
const publicGuaranteeEn = glossaryAtlasEnBySlug.get('garantie-de-pret');
assert.match(publicGuaranteeFr.def, /banques avancent.*tirage/u);
assert.match(publicGuaranteeFr.def, /emprunteur reste tenu de rembourser/u);
assert.match(publicGuaranteeFr.def, /conditions d’appel/u);
assert.match(publicGuaranteeFr.def, /engagement éventuel.*décaissement/u);
assert.match(publicGuaranteeEn.def, /Banks advance funds.*draws/u);
assert.match(publicGuaranteeEn.def, /borrower remains liable for repayment/u);
assert.match(publicGuaranteeEn.def, /claim conditions/u);
assert.match(publicGuaranteeEn.def, /contingent commitment/u);
const maximumLiabilityFr = glossaryEntries.find(entry => entry.slug === 'responsabilite-maximale');
const maximumLiabilityEn = glossaryAtlasEnBySlug.get('responsabilite-maximale');
assert.match(maximumLiabilityFr.def, /glossaire d’UKEF/u);
assert.match(maximumLiabilityFr.def, /intérêts compris/u);
assert.match(maximumLiabilityFr.def, /exposition avant émission/u);
assert.match(maximumLiabilityFr.def, /principal.*montant tiré.*perte réalisée/u);
assert.match(maximumLiabilityFr.def, /contrat.*références/u);
assert.match(maximumLiabilityEn.def, /UKEF’s glossary/u);
assert.match(maximumLiabilityEn.def, /including interest/u);
assert.match(maximumLiabilityEn.def, /exposure before cover is issued/u);
assert.match(maximumLiabilityEn.def, /principal.*amount drawn.*realised loss/u);
assert.match(maximumLiabilityEn.def, /contract and transaction references/u);

// Cyber cover depends on the insured relationship and the selected policy option.
for (const [slug, sources, related] of [
  ['pertes-d-exploitation-dependantes', [
    'https://www.beazley.com/en-001/cyber-customer-centre/cyber-risk-management-tools/cyber-business-interruption/policy-wording/',
    'https://www.hiscox.co.uk/sites/default/files/documents/2023-05/19029%20WD-PIP-UK-CCLEAR(5).pdf',
    'https://www.cfc.com/en-gb/knowledge/resources/articles/2026/01/cyber-coverage-highlights-customer-business-interruption/',
  ], ['franchise-temporelle', 'bfr']],
  ['franchise-temporelle', [
    'https://www.hiscox.co.uk/sites/default/files/documents/2023-05/19029%20WD-PIP-UK-CCLEAR(5).pdf',
  ], ['pertes-d-exploitation-dependantes', 'bfr']],
]) {
  const matches = glossaryEntries.filter(entry => entry.slug === slug);
  assert.equal(matches.length, 1, `${slug}: unique French definition`);
  const fr = matches[0], en = glossaryAtlasEnBySlug.get(slug);
  assert(fr.atlas && en?.atlas, `${slug}: native bilingual definitions and primary sources required`);
  assert.equal(fr.guide, '/posts/apres-cyberattaque-03-cyberassurance-panne-client/');
  assert.equal(en.guide, '/en/analysis/after-cyberattack-03-insurance-customer-disruption/');
  assert.equal(fr.reference, undefined); assert.equal(fr.referenceCandidate, false);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert.equal(englishGlossaryRobots(en), 'noindex,follow');
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas.sources.map(source => source.href), sources);
    assert.deepEqual(entry.atlas.articles.map(article => article.href), [entry.guide]);
    assert.deepEqual(entry.atlas.related, related);
    assert(!entry.def.includes('—'));
    for (const neighbor of related) { assert(glossaryEntries.some(term => term.slug === neighbor)); assert(glossaryAtlasEnBySlug.has(neighbor)); }
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'pertes-d-exploitation-dependantes').def, /tiers défini au contrat/);
assert.match(glossaryAtlasEnBySlug.get('pertes-d-exploitation-dependantes').def, /third party defined in the policy/);
assert.match(glossaryEntries.find(entry => entry.slug === 'franchise-temporelle').def, /loss of income.*Hiscox 04\/23.*exclues/u);
assert.match(glossaryAtlasEnBySlug.get('franchise-temporelle').def, /income-loss option.*04\/23 specimen.*excluded/u);
assert.match(glossaryEntries.find(entry => entry.slug === 'franchise-temporelle').def, /franchise monétaire/u);
assert.match(glossaryAtlasEnBySlug.get('franchise-temporelle').def, /monetary excess/u);

// Statutory protection, notice and sanctions retain their separate scopes.
{
  const fr = glossaryEntries.find(entry => entry.slug === 'automatic-stay');
  const en = glossaryAtlasEnBySlug.get('automatic-stay');
  assert(fr?.atlas && en?.atlas);
  assert.equal(fr.reference, undefined); assert.equal(fr.referenceCandidate, false);
  assert.equal(englishGlossaryRobots(en), 'noindex,follow');
  assert.equal(fr.guide, '/posts/bnc-faillites-americaines-notifications-risque/');
  assert.equal(en.guide, '/en/analysis/bnc-us-bankruptcy-notice-outage-risk/');
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas.sources.map(source => source.href), ['https://uscode.house.gov/us/usc/119-118/t11/s362/']);
    assert.deepEqual(entry.atlas.related, ['disponibilite-de-service']);
    assert.equal(entry.atlas.articles[0].href, entry.guide);
  }
  assert.match(fr.def, /exceptions/); assert.match(en.def, /exceptions/);
  assert.match(fr.def, /connaissance du créancier/); assert.match(en.def, /creditor’s knowledge/);
}

// Availability concerns authorised, usable access rather than confidentiality alone.
{
  const slug = 'disponibilite-de-service';
  const fr = glossaryEntries.find(entry => entry.slug === slug), en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en?.atlas);
  assert.equal(fr.reference, undefined); assert.equal(fr.referenceCandidate, false);
  assert.equal(englishGlossaryRobots(en), 'noindex,follow');
  assert.equal(fr.guide, '/posts/starshield-ukraine-controle-connexion/');
  assert.equal(en.guide, '/en/analysis/starshield-ukraine-terms-of-connection/');
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas.sources.map(source => source.href), ['https://csrc.nist.gov/glossary/term/availability']);
    assert.deepEqual(entry.atlas.related, ['interoperabilite', 'reversibilite', 'portabilite']);
    assert.equal(entry.atlas.articles[0].href, entry.guide);
  }
}

// Issue-price adjustments retain their own accounting scope and reference qualification.
for (const slug of ['decote-d-emission', 'prime-d-emission']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug), en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en?.atlas, `${slug}: sourced bilingual definitions required`);
  assert.equal(fr.reference, undefined); assert.equal(fr.referenceCandidate, false);
  assert.equal(englishGlossaryRobots(en), 'noindex,follow');
  assert.equal(fr.guide, '/posts/dette-francaise-refinancement-calendrier-taux/');
  assert.equal(en.guide, '/en/analysis/france-debt-refinancing-maturity-interest-costs/');
  assert.deepEqual(fr.atlas.sources.map(item => item.href), ['https://www.assemblee-nationale.fr/dyn/opendata/RAPPANR5L17B1492-tI.html']);
  assert.deepEqual(fr.atlas.sources, en.atlas.sources.map(item => ({...item, label: 'Assemblée nationale, comptes 2024 : primes et décotes'})));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
  assert.equal(fr.atlas.articles[0].href, fr.guide); assert.equal(en.atlas.articles[0].href, en.guide);
  for (const peer of fr.atlas.related) { assert(glossaryEntries.some(entry => entry.slug === peer)); assert(glossaryAtlasEnBySlug.has(peer)); }
}

// Investment approach, investable shares and relative risk remain distinct concepts.
for (const [slug, sourceUrls] of [["flottant", ["https://www.msci.com/index/methodology/latest/FreeFloatData", "https://www.msci.com/index/methodology/latest/GIMI"]], ["gestion-passive", ["https://www.bis.org/publications/implications-passive-investing-securities-markets", "https://www.esma.europa.eu/sites/default/files/library/2015/11/esma-2014-0011-01-00_en_0.pdf"]], ["tracking-error", ["https://www.msci.com/documents/1296102/1336482/Introducing_MSCI_IndexMetrics.pdf/23cbc36f-cf2c-4bf0-96c3-206eecdfdf6d", "https://www.msci.com/research-and-insights/blog-post/bond-index-replication-while-navigating-volatility", "https://www.esma.europa.eu/sites/default/files/library/2015/11/esma-2014-0011-01-00_en_0.pdf"]], ["etf", ["https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-24"]]]) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en?.atlas, `${slug}: fiches FR/EN et sources requises`);
  assert.equal(fr.reference, undefined); assert.equal(fr.referenceCandidate, false);
  assert.equal(englishGlossaryRobots(en), 'noindex,follow');
  assert.equal(fr.guide, '/posts/msci-indonesie-flottant-risque-indices/');
  assert.equal(en.guide, '/en/analysis/msci-indonesia-free-float-index-risk/');
  assert.deepEqual(fr.atlas.sources.map(item => item.href), sourceUrls);
  assert.deepEqual(en.atlas.sources.map(item => item.href), sourceUrls);
  assert.deepEqual(fr.atlas.related, en.atlas.related);
  assert.deepEqual(fr.atlas.related, ["flottant", "gestion-passive", "tracking-error", "etf"].filter(item => item !== slug));
  assert.equal(fr.atlas.articles[0].href, fr.guide); assert.equal(en.atlas.articles[0].href, en.guide);
  for (const related of fr.atlas.related) {
    assert(glossaryEntries.some(entry => entry.slug === related)); assert(glossaryAtlasEnBySlug.has(related));
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'flottant').def, /informations publiques/);
assert.match(glossaryAtlasEnBySlug.get('flottant').def, /foreign ownership restrictions/);
assert.match(glossaryEntries.find(entry => entry.slug === 'flottant').def, /Foreign Inclusion Factor.*coefficient.*arrondi.*restrictions étrangères/);
assert.match(glossaryAtlasEnBySlug.get('flottant').def, /Foreign Inclusion Factor.*adjustment factor.*rounding conventions.*foreign ownership restrictions/);
assert.match(glossaryEntries.find(entry => entry.slug === 'gestion-passive').def, /échantillon/);
assert.match(glossaryAtlasEnBySlug.get('gestion-passive').def, /synthetic/);
assert.match(glossaryEntries.find(entry => entry.slug === 'tracking-error').def, /Écart-type/);
assert.match(glossaryAtlasEnBySlug.get('tracking-error').def, /standard deviation/);
assert.match(glossaryEntries.find(entry => entry.slug === 'tracking-error').def, /réalisée.*prévisionnelle/);
assert.match(glossaryAtlasEnBySlug.get('tracking-error').def, /Realized.*ex-ante/);
assert.match(glossaryEntries.find(entry => entry.slug === 'etf').def, /stratégie indicielle ou active/);
assert.match(glossaryAtlasEnBySlug.get('etf').def, /index or an active strategy/);
assert.match(glossaryEntries.find(entry => entry.slug === 'etf').def, /transactions entre investisseurs.*parts.*créations et rachats.*généralement.*participants autorisés.*titres.*espèces/);
assert.match(glossaryAtlasEnBySlug.get('etf').def, /Trades between investors.*fund shares.*Creations and redemptions.*generally.*authorised participants.*securities.*cash/);

// Only individually qualified, complete English references may be indexed.
assert.deepEqual(Object.keys(glossaryReferenceEnBySlug), ['treasury-buyback']);
for (const entry of glossaryAtlasEnBySlug.values()) {
  const reference = glossaryReferenceEnBySlug[entry.slug];
  if (reference) {
    assert.equal(englishGlossaryRobots(entry), 'index,follow', `${entry.slug}: the qualified English reference must be indexable`);
    assert(glossaryReferenceWordCount(reference) >= 800 && glossaryReferenceWordCount(reference) <= 1_200, `${entry.slug}: complete English reference required`);
    assert(reference.primarySources.length >= 3, `${entry.slug}: primary sources required`);
    assert.equal(reference.updatedIso, glossaryReferenceBySlug[entry.slug]?.updatedIso, `${entry.slug}: bilingual review dates must agree`);
  } else {
    assert.equal(englishGlossaryRobots(entry), 'noindex,follow', `${entry.slug}: reference qualification required before indexation`);
  }
}

{
  const fr = glossaryEntries.find(entry => entry.slug === 'swift'), en = glossaryAtlasEnBySlug.get('swift');
  assert(fr?.atlas && en, 'SWIFT : définition et preuves FR/EN requises');
  assert.equal(fr.guide, '/posts/a7-banques-detour-paiements-russes/');
  assert.equal(en.guide, '/en/analysis/a7-banks-russia-payment-detour/');
  assert.equal(fr.reference, undefined); assert.equal(fr.referenceCandidate, false); assert.equal(en.robots, 'noindex,follow');
  for (const entry of [fr, en]) {
    assert.equal(entry.nom, 'Society for Worldwide Interbank Financial Telecommunication');
    assert.deepEqual(entry.atlas.sources.map(item => item.href), [
      'https://www.swift.com/about-us/who-we-are',
      'https://www.swift.com/about-us/media-centre/press-releases/swift-appoints-michael-manos-chief-information-officer',
      'https://www.swift.com/about-us/legal/compliance-0/swift-and-sanctions',
      'https://www.govinfo.gov/content/pkg/FR-2026-10-05/html/2026-20371.htm',
    ]);
    assert.equal(entry.atlas.articles.length, 3);
    assert.equal(entry.atlas.articles[0].href, entry.guide);
    assert.deepEqual(entry.atlas.related, ['stablecoin', 'usdt']);
    for (const neighbor of entry.atlas.related) {
      assert(glossaryEntries.some(candidate => candidate.slug === neighbor));
      assert(glossaryAtlasEnBySlug.has(neighbor));
    }
    assert(!entry.def.includes('—'));
  }
  assert(fr.atlas.articles.every(item => item.href.startsWith('/posts/')));
  assert(en.atlas.articles.every(item => item.href.startsWith('/en/analysis/')));
  assert.match(fr.def, /ne détient pas les fonds/); assert.match(fr.def, /ne gère pas les comptes/);
  assert.match(en.def, /does not hold funds or manage accounts/);
  assert.match(fr.def, /dont le champ dépend du droit applicable/); assert.match(en.def, /scope depends on the applicable law/);
}

{
  const slug = 'pret-relais';
  const fr = glossaryEntries.find(entry => entry.slug === slug), en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, 'Prêt-relais : définition et preuves FR/EN requises');
  assert.equal(fr.guide, '/posts/softbank-openai-echeances-liberte-attendre/');
  assert.equal(en.guide, '/en/analysis/softbank-openai-financing-freedom-to-wait/');
  assert.equal(fr.reference, undefined); assert.equal(fr.referenceCandidate, false); assert.equal(en.robots, 'noindex,follow');
  assert.equal(fr.sectionTitle, 'Crédit privé & marchés'); assert.equal(en.sectionTitle, 'Private credit & markets');
  for (const [entry, definitionSource] of [
    [fr, 'https://www.bdc.ca/fr/articles-outils/boite-outils-entrepreneur/gabarits-documents-guides-affaires/glossaire/financement-provisoire'],
    [en, 'https://www.bdc.ca/en/articles-tools/entrepreneur-toolkit/templates-business-guides/glossary/bridge-capital'],
  ]) {
    assert.deepEqual(entry.atlas.sources.map(item => item.href), [definitionSource, 'https://group.softbank/en/news/press/20260909']);
    assert.deepEqual(entry.atlas.articles.map(item => item.href), [entry.guide]);
    assert.deepEqual(entry.atlas.related, ['risque-de-refinancement', 'coupon-obligataire']);
    assert(!entry.def.includes('—'));
  }
  assert.match(fr.def, /court terme/); assert.match(fr.def, /ne doivent pas être additionnés/);
  assert.match(en.def, /short-term/); assert.match(en.def, /must not be added together/);
}

{
  const slug = 'entrepot-sous-douane';
  const fr = glossaryEntries.find(entry => entry.slug === slug), en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, 'Entrepôt sous douane : définition et preuves FR/EN requises');
  assert.equal(fr.guide, '/posts/cuivre-stocks-americains-conditions-retour/');
  assert.equal(en.guide, '/en/analysis/copper-us-stockpiles-conditions-for-return/');
  assert.equal(fr.reference, undefined); assert.equal(fr.referenceCandidate, false); assert.equal(en.robots, 'noindex,follow');
  assert.equal(fr.sectionTitle, 'Énergie & géopolitique'); assert.equal(en.sectionTitle, 'Energy & geopolitics');
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas.sources.map(item => item.href), [
      'https://www.ecfr.gov/current/title-19/chapter-I/part-141/subpart-E/section-141.69',
      'https://www.ecfr.gov/current/title-19/chapter-I/part-144/subpart-D/section-144.38',
    ]);
    assert.deepEqual(entry.atlas.articles.map(item => item.href), [entry.guide]);
    assert.deepEqual(entry.atlas.related, ['warrant-d-entrepot']);
    assert(!entry.def.includes('—'));
  }
  assert.match(fr.def, /Aux États-Unis/); assert.match(fr.def, /en principe/); assert.match(fr.def, /lots/);
  assert.match(en.def, /In the United States/); assert.match(en.def, /generally/); assert.match(en.def, /individual lots/);
}

for (const [slug, sources, related, sections] of [
  ['capitation', ['https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-B/part-422/subpart-E/section-422.208', 'https://www.sec.gov/Archives/edgar/data/49071/000004907126000009/hum-20251231.htm'], ['rofo'], ['Industrie & santé', 'Industry & healthcare']],
  ['rofo', ['https://www.sec.gov/Archives/edgar/data/49071/000004907126000060/hum-20261013.htm'], ['capitation'], ['Crédit privé & marchés', 'Private credit & markets']],
]) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: définitions et sources FR/EN requises`);
  assert.equal(fr.guide, '/posts/humana-blackrock-promesse-cliniques/');
  assert.equal(en.guide, '/en/analysis/humana-blackrock-promise-behind-clinics/');
  assert.equal(fr.reference, undefined);
  assert.equal(fr.referenceCandidate, false);
  assert.equal(en.robots, 'noindex,follow');
  assert.equal(fr.sectionTitle, sections[0]);
  assert.equal(en.sectionTitle, sections[1]);
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas.sources.map(item => item.href), sources);
    assert.deepEqual(entry.atlas.articles.map(item => item.href), [entry.guide]);
    assert.deepEqual(entry.atlas.related, related);
    for (const neighbor of related) {
      assert(glossaryEntries.some(candidate => candidate.slug === neighbor));
      assert(glossaryAtlasEnBySlug.has(neighbor));
    }
    assert(!entry.def.includes('—'));
  }
}

for (const [slug, source, related] of [
  ['capacite-de-soutirage', 'https://www.eia.gov/naturalgas/storage/basics/', ['gaz-utile', 'gaz-coussin']],
  ['gaz-utile', 'https://publications.jrc.ec.europa.eu/repository/bitstream/JRC122592/jrc122592_v5.pdf', ['gaz-coussin', 'capacite-de-soutirage']],
  ['gaz-coussin', 'https://publications.jrc.ec.europa.eu/repository/bitstream/JRC122592/jrc122592_v5.pdf', ['gaz-utile', 'capacite-de-soutirage']],
]) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: définitions et sources FR/EN requises`);
  assert.equal(fr.guide, '/posts/gaz-europeen-tenir-entre-deux-cargaisons/');
  assert.equal(en.guide, '/en/analysis/european-gas-bridging-gap-between-cargoes/');
  assert.equal(fr.reference, undefined);
  assert.equal(fr.referenceCandidate, false);
  assert.equal(en.robots, 'noindex,follow');
  assert.equal(fr.sectionTitle, 'Énergie & géopolitique');
  assert.equal(en.sectionTitle, 'Energy & geopolitics');
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas.sources.map(item => item.href), [source]);
    assert.deepEqual(entry.atlas.articles.map(item => item.href), [entry.guide]);
    assert.deepEqual(entry.atlas.related, related);
    for (const neighbor of related) {
      assert(glossaryEntries.some(candidate => candidate.slug === neighbor));
      assert(glossaryAtlasEnBySlug.has(neighbor));
    }
    assert(!entry.def.includes('—'));
  }
}

for (const [slug, sources, related] of [
  ['option-exterieure', ['https://books.core-econ.org/the-economy-v1/book/text/06.html', 'https://eminakamura.com/papers/Commoditization.pdf'], ['part-du-travail', 'wage-tracker-bce']],
  ['part-du-travail', ['https://www.oecd.org/en/publications/oecd-compendium-of-productivity-indicators-2024_b96cd88a-en/full-report/component-9.html', 'https://www.oecd.org/en/data/indicators/employee-compensation-by-activity.html'], ['option-exterieure', 'wage-tracker-bce']],
  ['wage-tracker-bce', ['https://www.ecb.europa.eu/press/pr/date/2026/html/ecb.pr260916~7bc58ebef4.en.html'], ['option-exterieure', 'part-du-travail']],
]) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: définitions et sources FR/EN requises`);
  assert.equal(fr.guide, '/posts/ia-salaires-pouvoir-partir/');
  assert.equal(en.guide, '/en/analysis/ai-wages-power-walk-away/');
  assert.equal(fr.reference, undefined);
  assert.equal(fr.referenceCandidate, false);
  assert.equal(en.robots, 'noindex,follow');
  assert.equal(fr.sectionTitle, 'Macro & banques centrales');
  assert.equal(en.sectionTitle, 'Macro & central banks');
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas.sources.map(item => item.href), sources);
    assert.deepEqual(entry.atlas.articles.map(item => item.href), [entry.guide]);
    assert.deepEqual(entry.atlas.related, related);
    for (const neighbor of related) {
      assert(glossaryEntries.some(candidate => candidate.slug === neighbor));
      assert(glossaryAtlasEnBySlug.has(neighbor));
    }
    assert(!entry.def.includes('—'));
  }
}
assert.equal(glossaryAtlasEnBySlug.size, 369, 'Le corpus ajoute deux notions bilingues sur les données du véhicule');

// Cryptographic and uniqueness claims do not confer civil identity or payment authority.
for (const slug of ['preuve-d-humanite', 'zkp', 'calcul-multipartite']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: sourced bilingual definitions required`);
  assert.equal(fr.reference, undefined);
  assert.equal(fr.referenceCandidate, false);
  assert.equal(englishGlossaryRobots(en), 'noindex,follow');
  assert.equal(fr.guide, '/posts/world-id-finance-preuve-humanite/');
  assert.equal(en.guide, '/en/analysis/world-id-banking-proof-of-human/');
  assert.deepEqual(fr.atlas.sources.map(item => item.href), en.atlas.sources.map(item => item.href));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
}
assert.match(glossaryEntries.find(entry => entry.slug === 'preuve-d-humanite').def, /ne suffit pas à établir l’identité civile/);
assert.match(glossaryAtlasEnBySlug.get('preuve-d-humanite').def, /does not by itself establish a civil identity/);
assert.match(glossaryEntries.find(entry => entry.slug === 'calcul-multipartite').def, /participants compromis/);
assert.match(glossaryAtlasEnBySlug.get('calcul-multipartite').def, /compromised participants/);

// Financing capacity and repayment protection do not establish cash received or a public loss guarantee.
for (const slug of ['credit-renouvelable', 'pret-senior-garanti']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: sourced bilingual definitions required`);
  assert.equal(fr.reference, undefined);
  assert.equal(fr.referenceCandidate, false);
  assert.equal(englishGlossaryRobots(en), 'noindex,follow');
  assert.equal(fr.guide, '/posts/jpmorgan-capital-strategique/');
  assert.equal(en.guide, '/en/analysis/jpmorgan-industrial-power-investment/');
  assert.deepEqual(fr.atlas.sources.map(item => item.href), en.atlas.sources.map(item => item.href));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
}
assert.match(glossaryEntries.find(entry => entry.slug === 'credit-renouvelable').def, /plafond engagé se distingue du montant effectivement tiré/);
assert.match(glossaryAtlasEnBySlug.get('credit-renouvelable').def, /committed limit differs from the amount drawn/);
assert.match(glossaryEntries.find(entry => entry.slug === 'pret-senior-garanti').def, /ni une prise en charge automatique des pertes par un État/);
assert.match(glossaryAtlasEnBySlug.get('pret-senior-garanti').def, /automatically make a government responsible for losses/);

// New short definitions retain the existing opt-in reference-page boundary.
for (const slug of ['offtake', 'silvopastoralisme', 'permanence-du-carbone']) {
  const fr = glossaryEntries.filter(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert.equal(fr.length, 1, `${slug}: one French definition`);
  assert(en && fr[0].atlas, `${slug}: bilingual source-backed entries`);
  assert.equal(fr[0].reference, undefined);
  assert.equal(fr[0].referenceCandidate, false);
  assert.equal(englishGlossaryRobots(en), 'noindex,follow');
  assert.equal(fr[0].guide, '/posts/google-mckinsey-carbone-paturages/');
  assert.equal(en.guide, '/en/analysis/google-mckinsey-pasture-carbon-timber/');
  assert.notEqual(fr[0].def, en.def, `${slug}: native English wording`);
  for (const entry of [fr[0], en]) {
    assert(entry.atlas.sources.length > 0);
    assert(entry.atlas.articles.some(item => item.href === entry.guide));
  }
}


for (const [slug, source, related] of [
  ['apd', 'https://www.oecd.org/en/data/insights/data-explainers/2024/07/frequently-asked-questions-on-official-development-assistance-oda.html', ['equivalent-don', 'ida', 'compte-courant']],
  ['equivalent-don', 'https://www.oecd.org/en/topics/sub-issues/oda-standards/modernising-official-development-assistance-oda.html', ['apd', 'ida']],
  ['ida', 'https://ida.worldbank.org/en/financing', ['apd', 'compte-courant']],
]) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: définitions et sources FR/EN requises`);
  assert.equal(fr.guide, '/posts/aide-internationale-retrait-deborde-budgets/');
  assert.equal(en.guide, '/en/analysis/foreign-aid-cuts-beyond-government-budgets/');
  assert.equal(fr.reference, undefined);
  assert.equal(fr.referenceCandidate, false);
  assert.equal(en.robots, 'noindex,follow');
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas.sources.map(item => item.href), [source]);
    assert.deepEqual(entry.atlas.articles.map(item => item.href), [entry.guide]);
    assert.deepEqual(entry.atlas.related, related);
    for (const neighbor of related) {
      assert(glossaryEntries.some(candidate => candidate.slug === neighbor));
      assert(glossaryAtlasEnBySlug.has(neighbor));
    }
    assert(!entry.def.includes('—'));
  }
}

for (const [slug, source, related] of [
  ['reassurance-adossee-a-l-actif', 'https://www.iais.org/uploads/2025/11/Issues-Paper-on-structural-shifts-in-the-life-insurance-sector.pdf', ['reassurance', 'recapture', 'funds-withheld', 'matching-adjustment', 'rbc']],
  ['recapture', 'https://www.bankofengland.co.uk/-/media/boe/files/prudential-regulation/supervisory-statement/2025/ss524-october-2025.pdf', ['reassurance-adossee-a-l-actif', 'funds-withheld', 'matching-adjustment', 'modco']],
  ['matching-adjustment', 'https://www.bankofengland.co.uk/prudential-regulation/publication/2025/november/list-2025-results-report', ['reassurance-adossee-a-l-actif', 'recapture', 'duration']],
  ['funds-withheld', 'https://www.iais.org/uploads/2025/11/Issues-Paper-on-structural-shifts-in-the-life-insurance-sector.pdf', ['reassurance-adossee-a-l-actif', 'recapture', 'reassurance', 'modco']],
]) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: définitions et sources FR/EN requises`);
  assert.equal(fr.guide, '/posts/retraites-bermudes-prix-du-retour/');
  assert.equal(en.guide, '/en/analysis/pensions-bermuda-recapture-risk/');
  assert.equal(fr.reference, undefined, `${slug}: conserver une définition courte en noindex`);
  assert.equal(fr.referenceCandidate, false);
  assert.equal(en.robots, 'noindex,follow');
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas.sources.map(item => item.href), [source, ...(slug === 'reassurance-adossee-a-l-actif' ? ['https://content.naic.org/sites/default/files/inline-files/2025-10-L%20RBC%20Asset%20Credit%20Modco-FWH%20proposal.pdf'] : []), ...(slug === 'funds-withheld' ? ['https://www.justgroupplc.co.uk/~/media/Files/J/Just-Retirement-Corp/investor-docs/financial-reports-and-presentations/2026/just-group-annual-report-2025.pdf'] : [])]);
    assert.deepEqual(entry.atlas.articles.map(item => item.href), [...(slug === 'recapture' ? [entry === fr ? '/posts/assureurs-fonds-08-solidite-promesse/' : '/en/analysis/insurers-asset-managers-08-promise/'] : []), entry === fr ? '/posts/assureurs-fonds-07-retour-risques/' : '/en/analysis/insurers-asset-managers-07-risks-return/', ...(slug === 'reassurance-adossee-a-l-actif' ? [entry === fr ? '/posts/assureurs-fonds-06-traitement-risque/' : '/en/analysis/insurers-asset-managers-06-risk-treatment/'] : []), entry.guide, ...(['reassurance-adossee-a-l-actif', 'recapture'].includes(slug) ? [entry === fr ? pensionArticleFr : pensionArticleEn] : []), ...(['reassurance-adossee-a-l-actif', 'recapture', 'funds-withheld'].includes(slug) ? [entry === fr ? '/posts/assureurs-03-bermudes-reassurance-jackson-athene/' : '/en/analysis/bermuda-reinsurance-jackson-athene/'] : [])]);
    assert.deepEqual(entry.atlas.related, related);
    for (const neighbor of related) {
      assert(glossaryEntries.some(candidate => candidate.slug === neighbor));
      assert(glossaryAtlasEnBySlug.has(neighbor));
    }
    assert(!entry.def.includes('—'));
  }
}
assert.match(glossaryEntries.find(entry => entry.slug === 'reassurance-adossee-a-l-actif').def, /conserve son obligation/);
assert.match(glossaryAtlasEnBySlug.get('reassurance-adossee-a-l-actif').def, /remains responsible/);
const fundsWithheldDefFr = glossaryEntries.find(entry => entry.slug === 'funds-withheld').def;
const fundsWithheldDefEn = glossaryAtlasEnBySlug.get('funds-withheld').def;
assert.match(fundsWithheldDefFr, /le cédant conserve les actifs tandis que le traité attribue au réassureur les revenus et risques convenus/);
assert.match(fundsWithheldDefFr, /La propriété juridique, les droits sur les flux et la reconnaissance comptable dépendent du montage et des règles applicables/);
assert.match(fundsWithheldDefFr, /Dans son rapport 2025, Just décrit des prêts viagers détenus juridiquement et gérés par le groupe/);
assert.match(fundsWithheldDefFr, /dont les rendements vont au réassureur et qui ne sont pas reconnus comme ses actifs IFRS/);
assert.match(fundsWithheldDefEn, /the cedant retains assets while the treaty allocates agreed income and risks to the reinsurer/);
assert.match(fundsWithheldDefEn, /Legal ownership, cash-flow rights and accounting recognition depend on the structure and applicable rules/);
assert.match(fundsWithheldDefEn, /In its 2025 report, Just describes lifetime mortgages legally held and managed by the group/);
assert.match(fundsWithheldDefEn, /whose returns go to the reinsurer and which are not recognised as its IFRS assets/);
assert.match(glossaryEntries.find(entry => entry.slug === 'matching-adjustment').def, /sans produire de trésorerie/);
assert.match(glossaryAtlasEnBySlug.get('matching-adjustment').def, /without generating immediate cash/);
assert.match(glossaryEntries.find(entry => entry.slug === 'recapture').def, /ne mesure pas une perte définitive/);
assert.match(glossaryAtlasEnBySlug.get('recapture').def, /not a measure of permanent loss/);
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
  assert.deepEqual(fr.atlas.articles.map(link => link.href), [fr.guide, googleCloudBankingArticleFr]);
  assert.deepEqual(en.atlas.articles.map(link => link.href), [en.guide, googleCloudBankingArticleEn]);
}

for (const slug of ['dora', 'ctpp', 'rto', 'rpo-reprise']) {
  for (const [entry, href] of [[glossaryEntries.find(item => item.slug === slug), googleCloudBankingArticleFr], [glossaryAtlasEnBySlug.get(slug), googleCloudBankingArticleEn]]) {
    const articles = entry.atlas.articles.filter(link => link.href === href);
    assert.equal(articles.length, 1);
    assert.equal(articles[0].kind, 'article');
    assert(articles[0].detail?.trim());
  }
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
assert.equal(glossaryEntries.length, 756, 'Le corpus ajoute deux notions courtes sur les données du véhicule');
assert.equal(glossaryAtlasEntries.length, 359, 'Les deux notions sur les données du véhicule disposent de sources et de liens');
for (const [slug, sources, related] of [
  ['risque-de-base', ['https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CFTCGlossary/index.htm', 'https://www.ecb.europa.eu/press/financial-stability-publications/fsr/special/html/ecb.fsrart202211_01~173476301a.en.html'], ['brent', 'future', 'couverture-de-change', 'distillats']],
  ['couverture-de-change', ['https://www.bis.org/publications/qr-201709/fx-swaps-and-forwards-missing-global-debt'], ['risque-de-base', 'future', 'compte-courant']],
  ['termes-de-l-echange', ['https://www.oecd.org/en/data/indicators/terms-of-trade.html'], ['compte-courant', 'transmission-des-prix', 'couverture-de-change']],
]) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: définitions et sources FR/EN requises`);
  assert.equal(fr.guide, '/posts/dollar-facture-energie/');
  assert.equal(en.guide, '/en/analysis/dollar-facture-energie/');
  assert.equal(fr.reference, undefined);
  assert.equal(fr.referenceCandidate, false);
  assert.equal(en.robots, 'noindex,follow');
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas.sources.map(item => item.href), sources);
    assert.deepEqual(entry.atlas.articles.map(item => item.href), [entry.guide]);
    assert.deepEqual(entry.atlas.related, related);
    for (const neighbor of related) {
      assert(glossaryEntries.some(candidate => candidate.slug === neighbor));
      assert(glossaryAtlasEnBySlug.has(neighbor));
    }
    assert(!entry.def.includes('—'));
  }
}
assert.equal([...glossaryAtlasEnBySlug.values()].filter(entry => englishGlossaryRobots(entry) === 'index,follow').length, 1, 'Seule la référence Treasury buyback qualifiée est ouverte en anglais');
const mortgageArticleFr = '/posts/credits-americains-risque-3-pourcent/';
const mortgageArticleEn = '/en/analysis/us-mortgages-three-percent-moving-risk/';
for (const [slug, source, related] of [
  ['cpr', 'https://capitalmarkets.freddiemac.com/mbs/docs/dpr_guide.pdf', ['wal', 'msr', 'duration']],
  ['wal', 'https://capitalmarkets.freddiemac.com/crt/docs/legal-documents/stacr/series-2016-hqa2/16_hqa2_1120281sto.pdf', ['cpr', 'dv01', 'duration']],
  ['dv01', 'https://www.cmegroup.com/trading/interest-rates/files/Calculating_the_Dollar_Value_of_a_Basis_Point.pdf', ['duration', 'repo', 'wal']],
  ['msr', 'https://www.federalreserve.gov/econres/notes/feds-notes/mortgage-servicing-right-valuations-under-stress-20260604.html', ['cpr', 'wal', 'repo']],
]) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: définitions et sources FR/EN requises`);
  assert.equal(fr.guide, mortgageArticleFr);
  assert.equal(en.guide, mortgageArticleEn);
  assert.equal(fr.sectionTitle, 'Crédit privé & marchés');
  assert.equal(en.sectionTitle, 'Private credit & markets');
  assert.equal(fr.reference, undefined, `${slug}: conserver la fiche courte en noindex`);
  assert.equal(fr.referenceCandidate, false, `${slug}: aucune promotion en fiche de référence`);
  assert.equal(glossaryReferenceBySlug[slug], undefined);
  assert(!glossaryReferenceCandidateSlugs.includes(slug));
  assert.equal(en.robots, 'noindex,follow');
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas.articles.map(article => article.href), [entry.guide]);
    assert.deepEqual(entry.atlas.sources.map(item => item.href), [source]);
    assert.deepEqual(entry.atlas.related, related);
    assert(['capitalmarkets.freddiemac.com', 'www.cmegroup.com', 'www.federalreserve.gov'].includes(new URL(source).hostname));
    for (const neighbor of related) {
      assert(glossaryEntries.some(candidate => candidate.slug === neighbor));
      assert(glossaryAtlasEnBySlug.has(neighbor));
    }
    assert(!entry.def.includes('—'), `${slug}: respecter la charte éditoriale`);
  }
  if (slug === 'cpr') {
    for (const entry of [fr, en]) assert(entry.atlas.formula.includes('SMM = 1 − (1 − CPR)^(1/12)'));
    assert.match(fr.def, /observations.*hypothèse.*proportions/);
    assert.match(en.def, /observed.*assumption.*proportions/);
  }
  if (slug === 'wal') {
    assert.match(fr.def, /principal.*années.*intérêts.*actualisation.*duration/);
    assert.match(en.def, /principal.*years.*interest.*discounting.*duration/);
    for (const entry of [fr, en]) assert(entry.atlas.formula.includes('Σ(') && entry.atlas.formula.includes(' / Σ('));
  }
  if (slug === 'dv01') {
    assert.match(fr.def, /locale.*0,01.*valeur absolue.*valeur de marché.*0,0001.*perte réalisée/);
    assert.match(en.def, /local.*0\.01.*absolute.*market value.*0\.0001.*realised loss/);
    assert(fr.atlas.formula.includes('0,0001') && en.atlas.formula.includes('0.0001'));
  }
  if (slug === 'msr') {
    assert.match(fr.def, /distinct du titre MBS.*anticipé.*recettes.*défauts.*coûts/);
    assert.match(en.def, /distinct from an MBS.*Prepayment.*revenues.*defaults.*costs/);
  }
}
for (const slug of ['headroom', 'pret-a-recours-limite', 'era']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en, `${slug}: définition et sources FR/EN requises`);
  assert.equal(fr.guide, '/posts/ukraine-interets-reparations/');
  assert.equal(en.guide, '/en/analysis/europe-ukraine-loan-cost-of-waiting/');
  assert.equal(fr.reference, undefined, `${slug}: conserver la fiche courte en noindex`);
  assert.equal(en.robots, 'noindex,follow');
  assert.deepEqual(fr.atlas.sources.map(source => source.href), en.atlas.sources.map(source => source.href));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
  for (const entry of [fr, en]) {
    assert.deepEqual(entry.atlas.articles.map(article => article.href), [entry.guide]);
    assert(entry.atlas.sources.length > 0);
    assert(entry.atlas.sources.every(source => ['commission.europa.eu', 'eur-lex.europa.eu', 'www.consilium.europa.eu'].includes(new URL(source.href).hostname)));
    for (const neighbor of entry.atlas.related) {
      assert(glossaryEntries.some(candidate => candidate.slug === neighbor));
      assert(glossaryAtlasEnBySlug.has(neighbor));
    }
  }
  if (slug !== 'headroom') {
    assert.equal(fr.referenceCandidate, false, `${slug}: aucune promotion en fiche de référence`);
    assert(!glossaryReferenceCandidateSlugs.includes(slug));
  }
  if (slug === 'headroom') {
    assert.match(fr.def, /plafond.*paiements.*ressources nécessaires/);
    assert.match(en.def, /ceiling for payments.*resources needed/);
    assert(!fr.def.includes('hors du bilan'), 'Une garantie ne justifie pas une affirmation générale sur la comptabilité nationale');
  }
  if (slug === 'pret-a-recours-limite') {
    assert.match(fr.def, /exceptions.*conditions démocratiques.*fraude/);
    assert.match(en.def, /exceptions.*democratic conditions.*fraud/);
  }
  if (slug === 'era') {
    assert.match(fr.def, /ressources disponibles.*distincts du capital/);
    assert.match(en.def, /available resources.*distinct from.*principal/);
  }
}
for (const slug of ['el-nino', 'roni']) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr && en);
  assert.equal(fr.guide, '/posts/el-nino-secours-meme-pluie/');
  assert.equal(en.guide, '/en/analysis/el-nino-backup-same-rain/');
  assert.deepEqual(fr.atlas.sources.map(source => source.href), en.atlas.sources.map(source => source.href));
  assert.deepEqual(fr.atlas.related, en.atlas.related);
  assert(fr.atlas.sources.every(source => new URL(source.href).hostname.endsWith('.noaa.gov')));
  assert.equal(en.robots, 'noindex,follow');
}
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
    assert.deepEqual(entry.atlas.articles.map(article => article.href), slug === 'risque-de-refinancement' ? [entry === fr ? '/posts/dette-etats-06-prix-sortie/' : '/en/analysis/dette-etats-06-prix-sortie/', entry.guide] : [entry.guide, entry === fr ? ratingsArticleFr : ratingsArticleEn]);
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
assert.equal(glossaryAtlasEdgeCount, 980, 'Le corpus ajoute quatre relations entre données du véhicule et vie privée');
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
  assert.deepEqual(entry.atlas.articles.map(item => item.href), [href, href.startsWith('/en/') ? '/en/analysis/tokenized-markets-weekend-funding/' : '/posts/tokenisation-qui-finance-weekend/']);
  assert.deepEqual(entry.atlas.related, ['smart-contract', 'stablecoin', 'reglement-atomique', 'compensation-nette', 'oracle-de-prix']);
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
assert.equal(glossaryReferenceEntries.length, 4, 'Les trois références initiales et Treasury buyback sont les seules fiches admises');
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

// The LDI entry keeps its existing French URL and remains a short noindex page.
for (const [entry, guide] of [[glossaryEntries.find(item => item.slug === 'ldi'), '/posts/dette-etats-05-appels-marge/'], [glossaryAtlasEnBySlug.get('ldi'), '/en/analysis/dette-etats-05-appels-marge/']]) {
  assert(entry?.atlas);
  assert.equal(entry.guide, guide);
  assert.equal(entry.atlas.articles[0].href, guide);
  assert.deepEqual(entry.atlas.sources.map(item => item.href), ['https://www.thepensionsregulator.gov.uk/en/document-library/scheme-management-detailed-guidance/funding-and-investment-detailed-guidance/liability-driven-investment']);
  assert.deepEqual(entry.atlas.related, ['duration', 'repo', 'appel-de-marge', 'marge-initiale', 'marge-de-variation']);
}
assert.equal(glossaryReferenceBySlug.ldi, undefined);
assert.equal(glossaryAtlasEnBySlug.get('ldi').robots, 'noindex,follow');

for (const entry of [glossaryEntries.find(item => item.slug === 'appel-de-marge'), glossaryAtlasEnBySlug.get('appel-de-marge')]) {
  assert(entry?.atlas?.formula);
  assert.match(entry.atlas.formula, /max\(0,/);
  assert.doesNotMatch(entry.atlas.formula, /cash et collatéral|cash and.*collateral/);
}

for (const [slug, source] of [
  ['profondeur-de-marche', 'https://libertystreeteconomics.newyorkfed.org/2026/04/treasury-market-liquidity-since-april-2025/'],
  ['coupon-obligataire', 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-86'],
]) {
  const fr = glossaryEntries.find(entry => entry.slug === slug);
  const en = glossaryAtlasEnBySlug.get(slug);
  assert(fr?.atlas && en);
  assert.equal(fr.guide, '/posts/dette-etats-06-prix-sortie/');
  assert.equal(en.guide, '/en/analysis/dette-etats-06-prix-sortie/');
  assert.equal(fr.reference, undefined);
  assert.equal(fr.referenceCandidate, false);
  assert.equal(en.robots, 'noindex,follow');
  assert.deepEqual(fr.atlas.sources.map(item => item.href), [source]);
  assert.deepEqual(en.atlas.sources.map(item => item.href), [source]);
  assert.deepEqual(fr.atlas.related, en.atlas.related);
  for (const neighbor of fr.atlas.related) {
    assert(glossaryEntries.some(entry => entry.slug === neighbor));
    assert(glossaryAtlasEnBySlug.has(neighbor));
  }
}

for (const slug of ['adjudication', 'bid-to-cover', 'risque-de-refinancement', 'prime-de-terme']) {
  for (const [entry, href] of [[glossaryEntries.find(item => item.slug === slug), '/posts/dette-etats-06-prix-sortie/'], [glossaryAtlasEnBySlug.get(slug), '/en/analysis/dette-etats-06-prix-sortie/']]) {
    assert.equal(entry.atlas.articles.filter(item => item.href === href).length, 1);
  }
}


for (const [slug, source] of [
  ['cnrf', 'https://www.bankofengland.co.uk/markets/market-notices/2025/january/contingent-nbfi-repo-facility-market-notice-28-january-2025'],
  ['apf', 'https://www.bankofengland.co.uk/asset-purchase-facility/2026/2026-q2'],
  ['qe', 'https://www.bankofengland.co.uk/asset-purchase-facility/2026/2026-q2'],
]) {
  const fr = glossaryEntries.find(entry => entry.slug === slug), en = glossaryAtlasEnBySlug.get(slug);
  assert(fr && en); assert.equal(fr.reference, undefined); assert.equal(en.robots, 'noindex,follow');
  assert.equal(fr.atlas.sources[0].href, source); assert.deepEqual(fr.atlas.related, en.atlas.related);
  assert.equal(en.atlas.sources[0].href, source);
  assert.equal(fr.atlas.articles[0].href, '/posts/dette-etats-07-dernier-acheteur/');
  assert.equal(en.atlas.articles[0].href, '/en/analysis/dette-etats-07-dernier-acheteur/');
}

console.log(JSON.stringify({
  ok: true,
  atlasNodes: glossaryAtlasEntries.length,
  referenceCandidates: glossaryReferenceCandidates.length,
  referenceIndexed: glossaryReferenceEntries.length,
  shortNoindex: glossaryEntries.length - glossaryReferenceEntries.length,
  mergedAliases: Object.keys(glossaryRedirects).length,
}));
