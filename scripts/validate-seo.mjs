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
    return { id: `${collection}/${name.replace(/\.mdx?$/, '')}`, data: { title: field('title'), description: field('description'), draft: field('draft') === 'true' } };
  }))
  .filter(({ data }) => !data.draft);
assert(entries.length > 0, 'Aucun contenu à valider');
for (const entry of entries) {
  const editorialTitle = entry.data.title;
  const seo = buildSeoMetadata(entry.data.title, entry.data.description);
  assert(seo.fullTitle.length <= 60, `Title SEO trop long: ${entry.id} (${seo.fullTitle.length})`);
  assert(seo.description.length <= 155, `Meta description trop longue: ${entry.id}`);
  assert.equal(entry.data.title, editorialTitle, `Le titre éditorial a été altéré: ${entry.id}`);
}
console.log(JSON.stringify({ ok: true, entries: entries.length, maxTitle: 60, maxDescription: 155 }));
