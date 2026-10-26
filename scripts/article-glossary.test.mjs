import assert from 'node:assert/strict';
import test from 'node:test';
import { articleGlossaryTerms } from '../src/lib/article-glossary.ts';
import { glossaryEntries } from '../src/config/glossary.ts';
import { glossaryAtlasEn } from '../src/config/glossary-atlas-en.ts';

test('article previews include only linked definitions, deduplicated and in their original language', () => {
  const fr = glossaryEntries[0], en = glossaryAtlasEn[0];
  const frUrl = `/glossaire/${fr.slug}/`, enUrl = `/en/glossary/${en.slug}/`;
  const terms = articleGlossaryTerms(`[A](${frUrl}) [B](${enUrl}) [A again](${frUrl})`);
  assert.deepEqual(terms, [
    { label: fr.sigle, name: fr.nom, definition: fr.def, href: frUrl },
    { label: en.sigle, name: en.nom, definition: en.def, href: enUrl },
  ]);
  assert.deepEqual(articleGlossaryTerms('No glossary link or /glossaire/unknown-term-999/.'), []);
});

test('preview metadata stays bounded even for a page linking the complete glossary', () => {
  const terms = articleGlossaryTerms(glossaryEntries.map(entry => `/glossaire/${entry.slug}/`).join(' '));
  assert.ok(terms.length <= 48);
  assert.ok(terms.every(term => /^\/(glossaire|en\/glossary)\/[a-z0-9-]+\/$/.test(term.href)));
});
