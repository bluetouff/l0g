import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { load, JSON_SCHEMA } from 'js-yaml';
import { guideSocialCard } from '../src/lib/guide-social.mjs';
import { renderGuideSocialJpeg } from './guide-social-card.mjs';

function outputFile(root, image) {
  let current = fs.realpathSync(root);
  for (const part of `public${image}`.split('/')) {
    current = path.join(current, part);
    try {
      const stat = fs.lstatSync(current);
      if (stat.isSymbolicLink() || (!stat.isDirectory() && (!stat.isFile() || stat.nlink !== 1))) throw new Error('Guide OG: unsafe output path.');
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  fs.mkdirSync(path.dirname(current), { recursive: true });
  return current;
}

export async function generateGuideSocial(root = process.cwd()) {
  let count = 0, bytes = 0;
  for (const [collection, lang] of [['guides', 'fr'], ['guides-en', 'en']]) {
    const directory = path.join(root, 'src/content', collection);
    for (const file of fs.readdirSync(directory).filter(name => /\.mdx?$/u.test(name)).sort()) {
      const source = fs.readFileSync(path.join(directory, file), 'utf8');
      const yaml = source.match(/^---\r?\n([\s\S]*?)\r?\n---/u)?.[1];
      if (yaml === undefined) throw new Error(`Guide OG: missing frontmatter (${collection}/${file}).`);
      const data = load(yaml, { schema: JSON_SCHEMA });
      const card = guideSocialCard({ id: file.replace(/\.mdx?$/u, ''), data }, lang);
      if (!card) continue;
      const image = await renderGuideSocialJpeg(card);
      fs.writeFileSync(outputFile(root, card.image), image, { flag: fs.constants.O_WRONLY | fs.constants.O_CREAT | fs.constants.O_TRUNC | fs.constants.O_NOFOLLOW, mode: 0o644 });
      count++; bytes += image.length;
    }
  }
  console.log(`[guide-og] ${count} cards; ${(bytes / 1_000_000).toFixed(1)} MB; build-time JPEGs, no request-time rendering.`);
  return { count, bytes };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) await generateGuideSocial();
