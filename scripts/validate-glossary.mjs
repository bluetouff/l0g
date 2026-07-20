import assert from 'node:assert/strict';
import { glossaryEntries, glossaryAtlasEntries } from '../src/config/glossary.ts';
import { glossaryRedirects } from '../src/config/glossary-redirects.mjs';

const sigles = glossaryEntries.map((entry) => entry.sigle.trim().toLocaleLowerCase('fr'));
assert.equal(new Set(sigles).size, sigles.length, 'Le glossaire contient encore un sigle dupliqué');
assert.equal(glossaryAtlasEntries.length, 42, 'Le périmètre Atlas indexable doit rester à 42 fiches');
assert.equal(glossaryEntries.length - glossaryAtlasEntries.length, 327, "Les définitions courtes uniques doivent être au nombre de 327 après fusion");
assert.equal(Object.keys(glossaryRedirects).length, 6, 'Les six anciens slugs doivent conserver une redirection');
for (const [from, to] of Object.entries(glossaryRedirects)) {
  assert(from.endsWith('-2'), `Alias inattendu: ${from}`);
  assert(glossaryEntries.some((entry) => entry.url.replace(/\/$/, '') === to), `Cible inconnue: ${to}`);
}

console.log(JSON.stringify({ ok: true, atlasIndexed: 42, shortNoindex: 327, mergedAliases: 6 }));
