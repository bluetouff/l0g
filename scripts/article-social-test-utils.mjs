import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { load, JSON_SCHEMA } from 'js-yaml';
import { articleSocialCard } from '../src/lib/article-social.mjs';

/** Existing figure suites retain their precise artwork contract after OG composition. */
export function assertArticleSocial(nodes, route, originalArtwork) {
  const lang = route.startsWith('en/') ? 'en' : 'fr';
  const slug = route.split('/').at(-1);
  const collection = lang === 'fr' ? 'posts' : 'posts-en';
  const base = new URL(`../src/content/${collection}/${slug}`, import.meta.url);
  const file = ['.md', '.mdx'].map(extension => new URL(base.href + extension)).find(existsSync);
  assert.ok(file, `Missing source article: ${route}`);
  const source = readFileSync(file, 'utf8');
  const data = load(source.match(/^---\r?\n([\s\S]*?)\r?\n---/u)[1], { schema: JSON_SCHEMA });
  assert.equal(new URL(data.ogImage, 'https://l0g.fr').href, originalArtwork);
  const hero = nodes.find(node => node.tagName === 'img' && Object.hasOwn(node.properties, 'dataArticleImage'));
  assert.ok(hero, 'The original article illustration must remain visible.');
  assert.equal(new URL(hero.properties.src, 'https://l0g.fr').href, originalArtwork);
  const card = articleSocialCard({ id: slug, data }, lang);
  assert.ok(card, 'The illustrated article must have a dedicated sharing card.');
  for (const property of ['og:image', 'twitter:image']) {
    const metas = nodes.filter(node => node.tagName === 'meta' && (node.properties.property === property || node.properties.name === property));
    assert.equal(metas.length, 1);
    assert.equal(metas[0].properties.content, 'https://l0g.fr' + card.image);
  }
  assert.ok(existsSync(path.join('dist', card.image)), 'The built sharing JPEG must exist.');
}
