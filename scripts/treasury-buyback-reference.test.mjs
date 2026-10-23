import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import test from 'node:test';
import { glossaryEntries } from '../src/config/glossary.ts';
import { glossaryAtlasEnBySlug, englishGlossaryRobots } from '../src/config/glossary-atlas-en.ts';
import { glossaryReferenceBySlug, glossaryReferenceWordCount } from '../src/config/glossary-reference-fr.ts';
import { treasuryBuybackExample, glossaryReferenceEnBySlug } from '../src/config/treasury-buyback-reference.ts';

test('le rachat fictif sépare plafond, nominal, prix et paiement', () => {
  const e = treasuryBuybackExample;
  assert(e.acceptedPar <= e.maximumPar && e.maximumPar < e.offeredPar);
  assert.equal(e.acceptedPar * e.weightedCleanPricePer100 / 100, e.cleanPayment);
  assert.equal(e.cleanPayment + e.accruedInterest, e.settlementPayment);
  assert.notEqual(e.settlementPayment, e.acceptedPar);
});

test('seule la nouvelle référence complète est admise dans les deux langues', () => {
  const fr = glossaryEntries.find(entry => entry.slug === 'treasury-buyback');
  const en = glossaryAtlasEnBySlug.get('treasury-buyback');
  assert(fr.reference && en);
  assert.equal(fr.reference, glossaryReferenceBySlug['treasury-buyback']);
  assert.equal(englishGlossaryRobots(en), 'index,follow');
  for (const reference of [fr.reference, glossaryReferenceEnBySlug['treasury-buyback']]) {
    const words = glossaryReferenceWordCount(reference);
    assert(words >= 800 && words <= 1200);
    assert.equal(reference.mechanism, 'treasury-buyback');
    assert(reference.sections.every(section => section.sources?.length));
    assert(reference.primarySources.some(source => source.href === reference.datedFact.sourceHref));
    for (const item of [...reference.analyses, ...reference.instruments]) {
      const match = item.href.match(/^\/(posts|guides|en\/analysis|en\/guides)\/([^/]+)\/$/);
      assert(match, `Unrecognized reading route: ${item.href}`);
      const collection = { posts: 'posts', guides: 'guides', 'en/analysis': 'posts-en', 'en/guides': 'guides-en' }[match[1]];
      assert(['md', 'mdx'].some(extension => existsSync(new URL(`../src/content/${collection}/${match[2]}.${extension}`, import.meta.url))), `Missing reading: ${item.href}`);
    }
  }
  assert.equal(glossaryEntries.find(entry => entry.slug === 'pcdr').reference, undefined);
  assert.equal(englishGlossaryRobots(glossaryAtlasEnBySlug.get('pcdr')), 'noindex,follow');
});

test('PCDR conserve un univers documenté et une fenêtre, sans population figée ni taux actuel', () => {
  const entries = [glossaryEntries.find(entry => entry.slug === 'pcdr'), glossaryAtlasEnBySlug.get('pcdr')];
  for (const entry of entries) {
    assert.doesNotMatch(entry.def, /1[ ,]?200|\d\s*%/);
    assert.match(entry.def, /RD.*D/);
    assert.equal(entry.atlas.sources.length, 1);
    assert.equal(new URL(entry.atlas.sources[0].href).hostname, 'assets.fitchratings.com');
    assert.match(entry.atlas.sources[0].href, /methodology-30-01-2026/);
  }
  assert.match(entries[0].def, /début et fin.*sans pondération/s);
  assert.match(entries[1].def, /beginning and end.*without debt weighting/s);
});
