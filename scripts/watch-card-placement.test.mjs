import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('Watch card is passive, bilingual and links to the matching Watch edition', async () => {
  const component = await read('../src/components/WatchCard.astro');

  assert.match(component, /href=\{lang === 'en' \? 'https:\/\/watch\.l0g\.fr\/en\/' : 'https:\/\/watch\.l0g\.fr\/'\}/);
  assert.match(component, /target="_blank"[\s\S]*rel="noopener noreferrer"/);
  assert.doesNotMatch(component, /watch-new|>new</i);
  assert.match(component, /La mémoire privée de votre veille\./);
  assert.match(component, /Your private monitoring memory\./);
  assert.match(component, /Souscriptions ouvertes/);
  assert.match(component, /Subscriptions open/);
  assert.doesNotMatch(component, /<(?:script|iframe|img)\b/i);
});

test('Watch stays reachable on French and English homes and articles', async () => {
  const [homeFr, articleFr, homeEn, articleEn] = await Promise.all([
    read('../src/components/HomeSidebar.astro'),
    read('../src/pages/posts/[...slug].astro'),
    read('../src/pages/en/index.astro'),
    read('../src/pages/en/analysis/[...slug].astro'),
  ]);

  assert.match(homeFr, /<WatchCard \/>/);
  assert.match(articleFr, /<ArticleNavigator[\s\S]*<ArticleServices \/>/);
  assert.match(homeEn, /class="en-hero-rail"[\s\S]*<WatchCard lang="en" \/>/);
  assert.match(articleEn, /class="en-article-sidebar"[\s\S]*<ArticleServices lang="en" \/>/);
  const services = await read('../src/components/ArticleServices.astro');
  assert.match(services, /en \? 'https:\/\/watch\.l0g\.fr\/en\/' : 'https:\/\/watch\.l0g\.fr\/'/);
  assert.match(services, /target="_blank" rel="noopener noreferrer"/);
  assert.doesNotMatch(services, /<(?:script|iframe|img)\b/i);
});
