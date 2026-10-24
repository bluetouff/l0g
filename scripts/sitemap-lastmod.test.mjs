import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { asiaHubContentSources, parseSitemapContentEntry, referenceEditorialLastmod, sitemapLastmod } from '../src/config/sitemap-lastmod.mjs';
import { treasuryBuybackReferenceFr, treasuryBuybackReferenceEn } from '../src/config/treasury-buyback-reference.ts';

const cases = [
  {
    url: 'https://l0g.fr/posts/13flow/',
    source: new URL('../src/content/posts/13flow.md', import.meta.url),
  },
  {
    url: 'https://l0g.fr/guides/lire-le-cpi-inflation-us/',
    source: new URL('../src/content/guides/lire-le-cpi-inflation-us.md', import.meta.url),
  },
  {
    url: 'https://l0g.fr/en/analysis/13flow-institutional-and-insider-signals/',
    source: new URL('../src/content/posts-en/13flow-institutional-and-insider-signals.md', import.meta.url),
  },
  {
    url: 'https://l0g.fr/en/guides/read-cpi-inflation-us/',
    source: new URL('../src/content/guides-en/read-cpi-inflation-us.md', import.meta.url),
  },
];

function field(frontmatter, name) {
  return frontmatter.match(new RegExp(`^${name}:\\s*(.+?)\\s*$`, 'm'))?.[1]
    ?.trim()
    .replace(/^['"]|['"]$/g, '');
}

for (const entry of cases) {
  test(`${entry.url} utilise sa date éditoriale`, async () => {
    const source = await readFile(entry.source, 'utf8');
    const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    const expected = field(frontmatter, 'updatedDate') ?? field(frontmatter, 'pubDate');
    assert.ok(expected, `date éditoriale absente dans ${entry.source.pathname}`);
    assert.equal(Date.parse(sitemapLastmod(entry.url)), Date.parse(expected));
  });
}

for (const [pathname, reference] of [
  ['/glossaire/treasury-buyback/', treasuryBuybackReferenceFr],
  ['/en/glossary/treasury-buyback/', treasuryBuybackReferenceEn],
]) {
  test(`${pathname} conserve la date éditoriale de sa référence`, () => {
    assert.equal(sitemapLastmod(`https://l0g.fr${pathname}`), `${reference.updatedIso}T00:00:00.000Z`);
  });
}

test('les dates de référence exigent un jour civil ISO réel', () => {
  assert.equal(referenceEditorialLastmod('2024-02-29', '/reference/'), '2024-02-29T00:00:00.000Z');
  for (const value of [undefined, null, '', '2026-02-29', '2026-02-30', '2026-13-01', '2026-10-23T12:00:00Z', '23/10/2026']) {
    assert.throws(() => referenceEditorialLastmod(value, '/reference/'), /date éditoriale de référence invalide/);
  }
});

test('le hub Asie tient compte du parcours effectivement ajouté à sa page', () => {
  const committed = execFileSync(
    'git',
    ['log', '-1', '--format=%cI', '--', 'src/config/english-reading-paths.ts'],
    { cwd: new URL('..', import.meta.url), encoding: 'utf8' }
  ).trim();
  assert.ok(
    Date.parse(sitemapLastmod('https://l0g.fr/en/asia/')) >= Date.parse(committed),
    'Le parcours MSCI/ETF affiché est plus récent que le lastmod du hub'
  );
});

test('un frontmatter valide sans tags conserve les valeurs par défaut Astro', () => {
  const post = parseSitemapContentEntry('src/content/posts-en/new-japanese-finance.md', 'src/content/posts-en', `---
title: "Japanese finance and global funding"
description: "A mechanism connecting Tokyo to overseas funding."
pubDate: 2026-10-23T18:00:00+02:00
sourceArticle: japanese-finance
sourceUpdatedDate: 2026-10-23
---
An analysis.
`);
  assert.deepEqual(post.data.tags, []);
  assert.equal(post.data.draft, false);
  assert.equal(post.data.pubDate.toISOString(), '2026-10-23T16:00:00.000Z');
  assert.deepEqual(asiaHubContentSources([post], [], Date.parse('2026-10-24')), [post.source]);
});

test('le lastmod Asie suit les cinq cartes récentes et les métadonnées des parcours rendus', () => {
  const analysis = (id, pubDate, data = {}) => ({
    id,
    source: `src/content/posts-en/${id}.md`,
    data: { pubDate: new Date(pubDate), tags: ['Asia'], ...data },
  });
  const guide = (id, data = {}) => ({
    id,
    source: `src/content/guides-en/${id}.md`,
    data,
  });
  const recent = Array.from({ length: 6 }, (_, index) => analysis(`recent-${index + 1}`, `2026-10-${23 - index}`));
  const sources = asiaHubContentSources([
    ...recent,
    analysis('unrelated', '2026-10-24', { tags: ['technology'] }),
    analysis('draft', '2026-10-24', { draft: true }),
    analysis('future', '2026-10-25'),
    analysis('the-yen-carry-trade', '2026-01-01'),
    // Curated cards use the page's draft-only filter, unlike its latest feed.
    analysis('chinese-real-estate-risk', '2026-10-25'),
    analysis('semiconductors-a-stack-of-constraints', '2026-10-24', { draft: true }),
    // This link's label lives in the dollar-stage configuration, not its article.
    analysis('asia-invisible-dollar-hedging-machine', '2026-01-01'),
  ], [
    guide('read-credit-ratings'),
    guide('read-life-insurer-health'),
    guide('read-the-carry-trade', { draft: true }),
    guide('unrelated-guide'),
  ], Date.parse('2026-10-24T12:00:00Z'));

  assert.deepEqual(new Set(sources), new Set([
    ...recent.slice(0, 5).map((post) => post.source),
    'src/content/posts-en/the-yen-carry-trade.md',
    'src/content/posts-en/chinese-real-estate-risk.md',
    'src/content/guides-en/read-credit-ratings.md',
    'src/content/guides-en/read-life-insurer-health.md',
  ]));
});
