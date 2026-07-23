import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = join(process.cwd(), 'dist');
const collisions = [];

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(path);
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      await audit(path);
    }
  }
}

async function audit(path) {
  const html = await readFile(path, 'utf8');
  const patterns = [
    { side: 'avant', regex: /[\p{L}\p{N}]<a\b/gu },
    { side: 'après', regex: /<\/a>[\p{L}\p{N}]/gu },
  ];

  for (const { side, regex } of patterns) {
    for (const match of html.matchAll(regex)) {
      const start = Math.max(0, match.index - 45);
      const end = Math.min(html.length, match.index + match[0].length + 45);
      collisions.push({
        file: relative(root, path),
        side,
        context: html
          .slice(start, end)
          .replace(/<[^>]+>/g, '')
          .replace(/\s+/g, ' ')
          .trim(),
      });
    }
  }
}

await walk(root);

if (collisions.length > 0) {
  console.error(`Espacements de liens : ${collisions.length} collision(s) détectée(s).`);
  for (const collision of collisions.slice(0, 30)) {
    console.error(`- ${collision.file} (${collision.side}) : ${collision.context}`);
  }
  if (collisions.length > 30) {
    console.error(`… et ${collisions.length - 30} autre(s).`);
  }
  process.exit(1);
}

console.log('Espacements de liens : aucun texte collé à une balise <a>.');
