import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load, JSON_SCHEMA } from 'js-yaml';
import sharp from 'sharp';
import { fromHtml } from 'hast-util-from-html';

function elementsIn(node) {
  return [...(node.type === 'element' ? [node] : []), ...(node.children ?? []).flatMap(elementsIn)];
}
import { articleSocialCard } from '../src/lib/article-social.mjs';

const origin = 'https://l0g.fr';
const imageUrl = image => typeof image === 'string' ? image : image?.contentUrl ?? image?.url;

/** Fail closed on stale cards, mismatched languages, altered heroes or broken metadata. */
export async function auditArticleSocial(root = process.cwd()) {
  let count = 0, totalBytes = 0, largest = 0;
  for (const [collection, lang, prefix] of [['posts', 'fr', 'posts'], ['posts-en', 'en', 'en/analysis']]) {
    for (const file of (await fs.readdir(path.join(root, 'src/content', collection))).filter(name => /\.mdx?$/u.test(name))) {
      const source = await fs.readFile(path.join(root, 'src/content', collection, file), 'utf8');
      const data = load(source.match(/^---\r?\n([\s\S]*?)\r?\n---/u)?.[1] ?? '', { schema: JSON_SCHEMA });
      const slug = file.replace(/\.mdx?$/u, '');
      const card = articleSocialCard({ id: slug, data }, lang, { publicDirectory: path.join(root, 'public') });
      if (!card) continue;
      const html = await fs.readFile(path.join(root, 'dist', prefix, slug, 'index.html'), 'utf8');
      const elements = elementsIn(fromHtml(html));
      for (const [key, value] of [['og:image', origin + card.image], ['twitter:image', origin + card.image], ['og:image:alt', card.alt], ['twitter:image:alt', card.alt]]) {
        const metas = elements.filter(element => element.tagName === 'meta' && (element.properties.property ?? element.properties.name) === key);
        if (metas.length !== 1 || metas[0].properties.content !== value) throw new Error(`Article OG: stale or mismatched ${key} (${lang}/${slug}).`);
      }
      const hero = elements.find(element => element.tagName === 'img' && Object.hasOwn(element.properties, 'dataArticleImage'));
      if (!hero || new URL(hero.properties.src, origin).href !== origin + data.ogImage) throw new Error(`Article OG: original illustration changed (${lang}/${slug}).`);
      const graph = elements.filter(element => element.tagName === 'script' && element.properties.type === 'application/ld+json')
        .flatMap(element => { const json = JSON.parse(element.children.map(child => child.value ?? '').join('')); return json['@graph'] ?? [json]; });
      const article = graph.find(item => item['@type'] === 'NewsArticle');
      const images = Array.isArray(article?.image) ? article.image.map(imageUrl) : [imageUrl(article?.image)];
      if (images[0] !== origin + data.ogImage || !images.includes(origin + card.image)) throw new Error(`Article OG: inconsistent structured images (${lang}/${slug}).`);
      const bytes = await fs.readFile(path.join(root, 'dist', card.image));
      const meta = await sharp(bytes, { failOn: 'warning', limitInputPixels: 1200 * 630 }).metadata();
      if (meta.format !== 'jpeg' || meta.width !== 1200 || meta.height !== 630 || bytes.length > 400_000) throw new Error(`Article OG: invalid image budget (${lang}/${slug}).`);
      totalBytes += bytes.length; largest = Math.max(largest, bytes.length); count++;
    }
  }
  console.log(`Article OG OK: ${count} bilingual cards; ${(totalBytes / 1_000_000).toFixed(1)} MB; largest ${largest} bytes; original heroes preserved.`);
  return { count, totalBytes, largest };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) await auditArticleSocial();
