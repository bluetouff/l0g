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
assert.equal(glossaryEntries.length, 491, 'Le corpus doit conserver ses 491 définitions uniques');
assert.equal(glossaryAtlasEntries.length, 50, 'Le graphe Atlas doit conserver ses 50 nœuds');
assert.equal(glossaryAtlasEdgeCount, 338, 'Le graphe Atlas doit conserver ses 338 relations');
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
