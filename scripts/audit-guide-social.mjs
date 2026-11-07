import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load, JSON_SCHEMA } from 'js-yaml';
import sharp from 'sharp';
import { fromHtml } from 'hast-util-from-html';
import { guideSocialCard } from '../src/lib/guide-social.mjs';

const elementsIn = node => [...(node.type === 'element' ? [node] : []), ...(node.children ?? []).flatMap(elementsIn)];
const plain = node => node.type === 'text' ? node.value : (node.children ?? []).map(plain).join('');
const normalize = value => value.replace(/\s+/gu, ' ').trim();
const origin = 'https://l0g.fr';

export async function auditGuideSocial(root = process.cwd()) {
  let count = 0, totalBytes = 0, largest = 0;
  for (const [collection, lang, prefix] of [['guides', 'fr', 'guides'], ['guides-en', 'en', 'en/guides']]) {
    for (const file of (await fs.readdir(path.join(root, 'src/content', collection))).filter(name => /\.mdx?$/u.test(name))) {
      const source = await fs.readFile(path.join(root, 'src/content', collection, file), 'utf8');
      const data = load(source.match(/^---\r?\n([\s\S]*?)\r?\n---/u)?.[1] ?? '', { schema: JSON_SCHEMA });
      const slug = file.replace(/\.mdx?$/u, '');
      const card = guideSocialCard({ id: slug, data }, lang);
      if (!card) continue;
      const html = await fs.readFile(path.join(root, 'dist', prefix, slug, 'index.html'), 'utf8');
      const elements = elementsIn(fromHtml(html));
      for (const [key, value] of [['og:image', origin + card.image], ['twitter:image', origin + card.image], ['og:image:alt', card.alt], ['twitter:image:alt', card.alt], ['og:title', card.title], ['twitter:title', card.title], ['twitter:card', 'summary_large_image']]) {
        const metas = elements.filter(element => element.tagName === 'meta' && (element.properties.property ?? element.properties.name) === key);
        if (metas.length !== 1 || metas[0].properties.content !== value) throw new Error(`Guide OG: stale or mismatched ${key} (${lang}/${slug}).`);
      }
      const headings = elements.filter(element => element.tagName === 'h1');
      const lede = elements.find(element => element.properties.className?.includes('post-lede'));
      if (headings.length !== 1 || normalize(plain(headings[0])) !== normalize(data.title) || !lede || normalize(plain(lede)) !== normalize(data.description)) throw new Error(`Guide OG: visible guide copy changed (${lang}/${slug}).`);
      const graph = elements.filter(element => element.tagName === 'script' && element.properties.type === 'application/ld+json')
        .flatMap(element => { const json = JSON.parse(plain(element)); return json['@graph'] ?? [json]; });
      const article = graph.find(item => item['@type'] === 'Article');
      const image = typeof article?.image === 'string' ? article.image : article?.image?.url;
      if (image !== origin + card.image || article.inLanguage !== lang || article.headline !== data.title) throw new Error(`Guide OG: inconsistent structured image (${lang}/${slug}).`);
      const bytes = await fs.readFile(path.join(root, 'dist', card.image));
      const meta = await sharp(bytes, { failOn: 'warning', limitInputPixels: 1200 * 630 }).metadata();
      if (meta.format !== 'jpeg' || meta.width !== 1200 || meta.height !== 630 || bytes.length > 200_000) throw new Error(`Guide OG: invalid image budget (${lang}/${slug}).`);
      totalBytes += bytes.length; largest = Math.max(largest, bytes.length); count++;
    }
  }
  console.log(`Guide OG OK: ${count} bilingual cards; ${(totalBytes / 1_000_000).toFixed(1)} MB; largest ${largest} bytes; guide copy preserved.`);
  return { count, totalBytes, largest };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) await auditGuideSocial();
