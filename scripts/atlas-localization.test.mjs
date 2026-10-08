import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync } from 'node:fs';
import { localizeAtlas } from '../src/lib/atlas-localization.ts';
import { atlasAt, atlasSelection, formatAtlasDate } from '../src/lib/engagement-atlas.ts';
import { atlasAlternateLinks, atlases, englishAtlases } from '../src/config/atlases.ts';

const read = name => JSON.parse(readFileSync(new URL(`../src/data/${name}.json`, import.meta.url), 'utf8'));

for (const name of ['engagement-atlas', 'private-credit-atlas', 'oil-financing-atlas']) {
  const source = read(name), words = read(`${name}.en`);
  test(`${name}: English preserves all graph, date, source and monetary evidence`, () => {
    const en = localizeAtlas(source, words);
    assert.notEqual(en.title, source.title);
    assert.deepEqual(en.sources.map(({ id, url, publishedOn }) => ({ id, url, publishedOn })), source.sources.map(({ id, url, publishedOn }) => ({ id, url, publishedOn })));
    assert.deepEqual(en.nodes.map(({ id, column, row }) => ({ id, column, row })), source.nodes.map(({ id, column, row }) => ({ id, column, row })));
    assert.equal(en.reconstructedOn, source.reconstructedOn);
    for (const milestone of source.milestones) {
      const french = atlasAt(source, milestone.date), english = atlasAt(en, milestone.date);
      const facts = snapshot => snapshot.relations.map(({ id, from, to, observation: { label, claim, limit, watch, amount, ...immutable } }) => ({
        id, from, to, ...immutable,
        ...(amount ? { amount: { value: amount.value, currency: amount.currency, kind: amount.kind } } : {}),
      }));
      assert.deepEqual(facts(english), facts(french));
      for (const relation of english.relations) {
        const hash = `#date=${milestone.date}&relation=${relation.id}&scenario=default`;
        assert.deepEqual(atlasSelection(en, hash), atlasSelection(source, hash));
      }
    }
    for (const relation of en.relations.filter(relation => relation.reading)) {
      const slug = relation.reading.href.match(/^\/en\/analysis\/([a-z0-9-]+)\/$/)?.[1];
      assert.ok(slug);
      const path = ['md', 'mdx'].map(extension => new URL(`../src/content/posts-en/${slug}.${extension}`, import.meta.url)).find(existsSync);
      assert.ok(path, `missing English reading: ${slug}`);
      assert.doesNotMatch(readFileSync(path, 'utf8').split('---')[1], /^draft:\s*true\s*$/m);
    }
  });
  test(`${name}: missing or stale prose and attempts to override evidence fail closed`, () => {
    for (const mutate of [
      t => { delete t.nodes[source.nodes[0].id]; },
      t => { t.sources[source.sources[0].id].url = 'https://evil.example/'; },
      t => { t.relations[source.relations[0].id].observations[source.relations[0].observations[0].publishedOn].recordedOn = '2026-10-08'; },
      t => { t.nodes[source.nodes[0].id].label = '<img src=x onerror=alert(1)>'; },
      t => { t.milestones['2099-01-01'] = { label: 'Unexpected', change: 'Invented' }; },
      t => { t.sourceSha256 = '0'.repeat(64); },
    ]) {
      const candidate = structuredClone(words); mutate(candidate);
      assert.throws(() => localizeAtlas(source, candidate));
    }
    const updated = structuredClone(source);
    updated.title += ' revised';
    assert.throws(() => localizeAtlas(updated, words), /source changed/);
  });
}

test('English reading links retain a narrow safe local destination contract', () => {
  const source = read('oil-financing-atlas'), words = read('oil-financing-atlas.en');
  const id = source.relations.find(relation => relation.reading).id;
  for (const href of [
    '//evil.example/', 'https://l0g.fr/en/analysis/example/', 'javascript:alert(1)',
    '/en/analysis/../admin/', '/en/analysis/%2e%2e/', '/en/analysis/example/?token=secret',
    '/en/analysis/example/#fragment', '/posts/example/', '/en/guides/example/',
  ]) {
    const candidate = structuredClone(words); candidate.relations[id].reading.href = href;
    assert.throws(() => localizeAtlas(source, candidate), href);
  }
});

test('Atlas language pairs preserve French routes and default date formatting', () => {
  assert.equal(formatAtlasDate('2026-09-21'), '21 sept. 2026');
  assert.equal(formatAtlasDate('2026-09-21', 'en'), '21 Sept 2026');
  for (const [index, atlas] of atlases.entries()) {
    assert.deepEqual(atlasAlternateLinks(atlas.id), [
      { hreflang: 'fr', href: `https://l0g.fr${atlas.href}` },
      { hreflang: 'en', href: `https://l0g.fr${englishAtlases[index].href}` },
      { hreflang: 'x-default', href: `https://l0g.fr${atlas.href}` },
    ]);
  }
  assert.throws(() => atlasAlternateLinks('unknown'));
});
