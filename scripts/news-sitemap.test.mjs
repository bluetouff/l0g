import assert from 'node:assert/strict';
import test from 'node:test';
import { XMLParser } from 'fast-xml-parser';
import {
  NEWS_SITEMAP_MAX_ENTRIES,
  buildNewsSitemap,
  selectNewsSitemapArticles,
} from '../src/lib/news-sitemap.ts';

const NOW = new Date('2026-08-22T18:30:00.000Z');

function article(overrides = {}) {
  return {
    language: 'fr',
    publicationDate: new Date('2026-08-22T17:00:00.000Z'),
    title: 'Titre de test',
    url: 'https://l0g.fr/posts/test/',
    ...overrides,
  };
}

function parse(xml) {
  return new XMLParser({ ignoreAttributes: false }).parse(xml);
}

test('le sitemap ne retient que les publications des dernieres 48 heures', () => {
  const atCutoff = new Date(NOW.getTime() - 48 * 60 * 60 * 1000);
  const selected = selectNewsSitemapArticles([
    article({ url: 'https://l0g.fr/posts/recent/', publicationDate: new Date('2026-08-22T18:00:00.000Z') }),
    article({ url: 'https://l0g.fr/posts/limite/', publicationDate: atCutoff }),
    article({ url: 'https://l0g.fr/posts/trop-ancien/', publicationDate: new Date(atCutoff.getTime() - 1) }),
    article({ url: 'https://l0g.fr/posts/planifie/', publicationDate: new Date(NOW.getTime() + 1) }),
  ], NOW);

  assert.deepEqual(selected.map(({ url }) => url), [
    'https://l0g.fr/posts/recent/',
    'https://l0g.fr/posts/limite/',
  ]);
});

test('le XML bilingue contient les champs Google News requis et echappe les titres', () => {
  const xml = buildNewsSitemap([
    article({ title: 'Liquidite & credit <sous tension>' }),
    article({
      language: 'en',
      publicationDate: new Date('2026-08-22T16:00:00.000Z'),
      title: 'Markets & policy',
      url: 'https://l0g.fr/en/analysis/test/',
    }),
  ], { now: NOW, publicationName: 'l0g' });
  const parsed = parse(xml);
  const urls = parsed.urlset.url;

  assert.equal(parsed.urlset['@_xmlns'], 'http://www.sitemaps.org/schemas/sitemap/0.9');
  assert.equal(parsed.urlset['@_xmlns:news'], 'http://www.google.com/schemas/sitemap-news/0.9');
  assert.equal(urls.length, 2);
  assert.equal(urls[0].loc, 'https://l0g.fr/posts/test/');
  assert.equal(urls[0]['news:news']['news:publication']['news:name'], 'l0g');
  assert.equal(urls[0]['news:news']['news:publication']['news:language'], 'fr');
  assert.equal(urls[0]['news:news']['news:publication_date'], '2026-08-22T17:00:00.000Z');
  assert.equal(urls[0]['news:news']['news:title'], 'Liquidite & credit <sous tension>');
  assert.equal(urls[1]['news:news']['news:publication']['news:language'], 'en');
  assert.match(xml, /Liquidite &amp; credit &lt;sous tension&gt;/);
});

test('un sitemap sans publication recente reste un document XML valide', () => {
  const xml = buildNewsSitemap([
    article({ publicationDate: new Date('2026-08-01T00:00:00.000Z') }),
  ], { now: NOW });
  const parsed = parse(xml);

  assert.equal(parsed.urlset['@_xmlns:news'], 'http://www.google.com/schemas/sitemap-news/0.9');
  assert.equal(parsed.urlset.url, undefined);
});

test('la limite Google de 1000 entrees echoue explicitement', () => {
  const articles = Array.from({ length: NEWS_SITEMAP_MAX_ENTRIES + 1 }, (_, index) => article({
    url: `https://l0g.fr/posts/test-${index}/`,
  }));

  assert.throws(
    () => buildNewsSitemap(articles, { now: NOW }),
    /au-dela de la limite de 1000/,
  );
});
