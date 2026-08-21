import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { buildSeoMetadata } from '../src/lib/seo.ts';

const collections = [
  ['posts', new URL('../src/content/posts/', import.meta.url)],
  ['posts-en', new URL('../src/content/posts-en/', import.meta.url)],
  ['guides', new URL('../src/content/guides/', import.meta.url)],
  ['guides-en', new URL('../src/content/guides-en/', import.meta.url)],
];
const entries = collections.flatMap(([collection, directory]) => readdirSync(directory)
  .filter((name) => /\.mdx?$/.test(name))
  .map((name) => {
    const body = readFileSync(new URL(name, directory), 'utf8');
    const frontmatter = body.match(/^---\n([\s\S]*?)\n---/)?.[1] || '';
    const field = (key) => frontmatter.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, 'm'))?.[1]?.replace(/["']$/, '') || '';
    return {
      id: `${collection}/${name.replace(/\.mdx?$/, '')}`,
      collection,
      data: {
        title: field('title'),
        seoTitle: field('seoTitle'),
        ogTitle: field('ogTitle'),
        description: field('description'),
        draft: field('draft') === 'true',
      },
    };
  }))
  .filter(({ data }) => !data.draft);
assert(entries.length > 0, 'Aucun contenu à valider');
const effectiveTitles = new Map();
for (const entry of entries) {
  const editorialTitle = entry.data.title;
  const seo = buildSeoMetadata(entry.data.title, entry.data.description, { seoTitle: entry.data.seoTitle });
  if (entry.data.seoTitle) {
    assert(entry.data.seoTitle.length <= 90, `Title SEO explicite trop long: ${entry.id} (${entry.data.seoTitle.length})`);
    assert.notEqual(entry.data.seoTitle, editorialTitle, `Title SEO identique au H1: ${entry.id}`);
    assert(/\s[|\-·]\s*l0g(?:\.fr)?$/i.test(entry.data.seoTitle), `Marque finale absente du title SEO: ${entry.id}`);
  } else {
    assert(seo.fullTitle.length <= 60, `Title SEO de repli trop long: ${entry.id} (${seo.fullTitle.length})`);
  }
  if (entry.data.ogTitle) {
    assert(entry.data.ogTitle.length <= 100, `og:title trop long: ${entry.id} (${entry.data.ogTitle.length})`);
  }
  assert(!/[<>]/.test(entry.data.seoTitle), `Balisage interdit dans title SEO: ${entry.id}`);
  assert(!/[<>]/.test(entry.data.ogTitle), `Balisage interdit dans og:title: ${entry.id}`);
  assert(seo.description.length <= 155, `Meta description trop longue: ${entry.id}`);
  assert.equal(entry.data.title, editorialTitle, `Le titre éditorial a été altéré: ${entry.id}`);
  const uniquenessKey = `${entry.collection}:${seo.fullTitle.toLocaleLowerCase()}`;
  assert(!effectiveTitles.has(uniquenessKey), `Title SEO dupliqué: ${entry.id} et ${effectiveTitles.get(uniquenessKey)}`);
  effectiveTitles.set(uniquenessKey, entry.id);
}
assert.equal(
  buildSeoMetadata('H1 éditorial', 'Description', { seoTitle: 'Titre SEO exact | l0g' }).fullTitle,
  'Titre SEO exact | l0g',
  'Un title SEO explicite ne doit jamais être tronqué ou suffixé automatiquement'
);
console.log(JSON.stringify({
  ok: true,
  entries: entries.length,
  explicitSeoTitles: entries.filter(({ data }) => data.seoTitle).length,
  explicitOgTitles: entries.filter(({ data }) => data.ogTitle).length,
  fallbackMaxTitle: 60,
  explicitMaxTitle: 90,
  maxDescription: 155,
}));
