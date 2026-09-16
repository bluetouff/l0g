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

const sigles = glossaryEntries.map((entry) => entry.sigle.trim().toLocaleLowerCase('fr'));
assert.equal(new Set(sigles).size, sigles.length, 'Le glossaire contient encore un sigle dupliqué');
assert.equal(glossaryEntries.length, 532, 'Le corpus doit conserver ses 532 définitions uniques');
assert.equal(glossaryAtlasEntries.length, 85, 'Le graphe Atlas doit conserver ses 85 nœuds');
assert.equal(glossaryAtlasEdgeCount, 380, 'Le graphe Atlas doit conserver ses 380 relations');
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

console.log(JSON.stringify({
  ok: true,
  atlasNodes: glossaryAtlasEntries.length,
  referenceCandidates: glossaryReferenceCandidates.length,
  referenceIndexed: glossaryReferenceEntries.length,
  shortNoindex: glossaryEntries.length - glossaryReferenceEntries.length,
  mergedAliases: Object.keys(glossaryRedirects).length,
}));
