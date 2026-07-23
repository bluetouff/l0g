import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { sitemapLastmod } from '../src/config/sitemap-lastmod.mjs';

const cases = [
  {
    url: 'https://l0g.fr/posts/13flow/',
    source: new URL('../src/content/posts/13flow.md', import.meta.url),
  },
  {
    url: 'https://l0g.fr/guides/lire-le-cpi-inflation-us/',
    source: new URL('../src/content/guides/lire-le-cpi-inflation-us.md', import.meta.url),
  },
  {
    url: 'https://l0g.fr/en/analysis/13flow-institutional-and-insider-signals/',
    source: new URL('../src/content/posts-en/13flow-institutional-and-insider-signals.md', import.meta.url),
  },
  {
    url: 'https://l0g.fr/en/guides/read-cpi-inflation-us/',
    source: new URL('../src/content/guides-en/read-cpi-inflation-us.md', import.meta.url),
  },
];

function field(frontmatter, name) {
  return frontmatter.match(new RegExp(`^${name}:\\s*(.+?)\\s*$`, 'm'))?.[1]
    ?.trim()
    .replace(/^['"]|['"]$/g, '');
}

for (const entry of cases) {
  test(`${entry.url} utilise sa date éditoriale`, async () => {
    const source = await readFile(entry.source, 'utf8');
    const frontmatter = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
    const expected = field(frontmatter, 'updatedDate') ?? field(frontmatter, 'pubDate');
    assert.ok(expected, `date éditoriale absente dans ${entry.source.pathname}`);
    assert.equal(Date.parse(sitemapLastmod(entry.url)), Date.parse(expected));
  });
}
