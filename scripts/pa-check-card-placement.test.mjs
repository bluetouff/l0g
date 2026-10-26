import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('both footers expose PA Check through its canonical URL', async () => {
  for (const name of ['SiteFooter', 'EnglishFooter']) {
    const footer = await read(`../src/components/${name}.astro`);
    assert.match(footer, /https:\/\/pa\.l0g\.fr\//);
    assert.match(footer, /PA Check/);
  }
});

test('French sidebars retain support and Watch without the PA Check card', async () => {
  const [home, article] = await Promise.all([
    read('../src/components/HomeSidebar.astro'),
    read('../src/pages/posts/[...slug].astro'),
  ]);
  assert.match(home, /<SupportCard \/>[\s\S]*<WatchCard \/>[\s\S]*<WeeklyCta variant="home" \/>/);
  assert.match(article, /<SupportCard compact \/>[\s\S]*<WatchCard compact \/>/);
  for (const source of [home, article]) assert.doesNotMatch(source, /PaCheckCard|pa-card/);
});
