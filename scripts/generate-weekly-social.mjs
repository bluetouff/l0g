import { mkdir, writeFile, readFile, readdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { weeklyEditions } from '../src/config/weekly-editions.ts';
import { weeklySocialCard } from '../src/lib/weekly-social.ts';
import { weeklyIllustrations, weeklyCoverImage } from '../src/lib/weekly-presentation.ts';
import { renderWeeklySocialPng } from './weekly-social-card.mjs';

export async function readWeeklyIllustrations() {
  const directory = new URL('../src/content/posts/', import.meta.url);
  const files = (await readdir(directory)).filter((name) => /\.mdx?$/.test(name));
  const posts = await Promise.all(files.map(async (name) => ({
    id: name.replace(/\.mdx?$/, ''),
    data: parseFrontmatter(await readFile(new URL(name, directory), 'utf8')).frontmatter,
  })));
  return weeklyIllustrations(posts);
}

export async function generateWeeklySocial() {
  const illustrations = await readWeeklyIllustrations();
  for (const edition of weeklyEditions) {
    const card = weeklySocialCard(edition, weeklyCoverImage(edition, illustrations));
    const output = new URL(`../public${card.image}`, import.meta.url);
    await mkdir(dirname(fileURLToPath(output)), { recursive: true });
    await writeFile(output, await renderWeeklySocialPng(card));
    console.log(`[og-hebdo] ${card.issueLabel} · ${edition.slug} -> ${card.image}`);
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) await generateWeeklySocial();
