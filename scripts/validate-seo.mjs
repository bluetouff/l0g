import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { buildSeoMetadata } from '../src/lib/seo.ts';

const posts = readdirSync(new URL('../src/content/posts/', import.meta.url))
  .filter((name) => /\.mdx?$/.test(name))
  .map((name) => {
    const body = readFileSync(new URL(`../src/content/posts/${name}`, import.meta.url), 'utf8');
    const frontmatter = body.match(/^---\n([\s\S]*?)\n---/)?.[1] || '';
    const field = (key) => frontmatter.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, 'm'))?.[1]?.replace(/["']$/, '') || '';
    return { id: name.replace(/\.mdx?$/, ''), data: { title: field('title'), description: field('description'), draft: field('draft') === 'true' } };
  })
  .filter(({ data }) => !data.draft);
assert(posts.length > 0, 'Aucun article à valider');
for (const post of posts) {
  const editorialTitle = post.data.title;
  const seo = buildSeoMetadata(post.data.title, post.data.description);
  assert(seo.fullTitle.length <= 60, `Title SEO trop long: ${post.id} (${seo.fullTitle.length})`);
  assert(seo.description.length <= 155, `Meta description trop longue: ${post.id}`);
  assert.equal(post.data.title, editorialTitle, `Le titre éditorial a été altéré: ${post.id}`);
}
console.log(JSON.stringify({ ok: true, posts: posts.length, maxTitle: 60, maxDescription: 155 }));
