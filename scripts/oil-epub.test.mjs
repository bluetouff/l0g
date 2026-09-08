import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { fromHtml } from 'hast-util-from-html';
import sharp from 'sharp';
import { oilPublication, oilChapters as frenchChapters } from '../src/config/oil-publication.mjs';
import { oilPublicationEn, oilChaptersEn } from '../src/config/oil-publication-en.mjs';
import { generateOilEpub, renderOilMarkdown, standaloneSvg } from './generate-oil-epub.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const files = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]);

test('oil Markdown removes parsed website styles without reassembling markup', async () => {
  const inputs = [
    '<sty<style>discard</style>le>body{display:none}</style><p>Fin</p>',
    '<STYLE media="all">body{display:none}</STYLE><p>Fin</p>',
    '<style>body{display:none}</style ><p>Fin</p>',
    '<p>Fin</p><style>body{display:none}',
    '<template><style>body{display:none}</style><p style="color:red" tabindex="0">Fin</p></template>',
    '<div STYLE=color:red TABINDEX=0><p style=\'display:none\'>Fin</p></div>',
  ];
  function inspect(node) {
    assert.notEqual(node.tagName, 'style');
    assert.equal(node.properties?.style, undefined);
    assert.equal(node.properties?.tabIndex, undefined);
    node.children?.forEach(inspect);
    if (node.content) inspect(node.content);
  }
  for (const input of inputs) {
    const html = await renderOilMarkdown(input);
    inspect(fromHtml(html, { fragment: true }));
    assert.match(html, /Fin/u);
  }
});

test('oil Markdown preserves prose, source links, literal markup and figure placeholders', async () => {
  const html = await renderOilMarkdown('## Réserves & pétrole\n\n[Source](/posts/source/#s1) et `<style>exemple</style>`.\n\n&lt;style&gt;texte&lt;/style&gt;\n\n<div data-oil-figure="0"></div>\n\n<p title="<style>littéral</style>">Texte</p>\n\n| Unité | Valeur |\n| --- | --- |\n| Baril | 1 |');
  assert.match(html, /<h2>Réserves &#x26; pétrole<\/h2>/u);
  assert.match(html, /href="\/posts\/source\/#s1"/u);
  assert.match(html, /<code>&#x3C;style>exemple&#x3C;\/style><\/code>/u);
  assert.match(html, /&#x3C;style>texte&#x3C;\/style>/u);
  assert.match(html, /<div data-oil-figure="0"><\/div>/u);
  assert.match(html, /<table>/u);
  const tree = fromHtml(html, { fragment: true });
  assert.equal(tree.children.find((node) => node.properties?.title)?.properties.title, '<style>littéral</style>');
});

test('oil generator rejects unsupported languages before writing files', async () => {
  await assert.rejects(generateOilEpub('de'), /Unsupported oil edition language/u);
});

for (const { book, oilChapters, lang, directory, pageFile } of [
  { book: oilPublication, oilChapters: frenchChapters, lang: 'fr', directory: 'les-banquiers-du-baril', pageFile: 'src/pages/publications/les-banquiers-du-baril.astro' },
  { book: oilPublicationEn, oilChapters: oilChaptersEn, lang: 'en', directory: 'banking-on-oil', pageFile: 'src/pages/en/publications/banking-on-oil.astro' },
]) {
const SOURCE = join(ROOT, 'src/epub', directory);
const EPUB = join(ROOT, 'public', book.epub);
const textual = () => files(SOURCE).filter((p) => /\.(css|ncx|opf|svg|xhtml|xml)$/u.test(p));
test(`${lang}: oil EPUB has a valid container and packages exactly its versioned sources`, () => {
  const entries = execFileSync('unzip', ['-Z1', EPUB], { encoding: 'utf8' }).trim().split('\n');
  assert.equal(entries[0], 'mimetype');
  assert.equal(execFileSync('unzip', ['-p', EPUB, 'mimetype'], { encoding: 'utf8' }), 'application/epub+zip');
  assert.match(execFileSync('unzip', ['-lv', EPUB], { encoding: 'utf8' }).split('\n').find((s) => /\bmimetype\s*$/u.test(s)), /Stored/u);
  assert.match(execFileSync('unzip', ['-t', EPUB], { encoding: 'utf8' }), /No errors detected/u);
  assert.deepEqual(entries.sort(), files(SOURCE).map((p) => relative(SOURCE, p)).sort());
  for (const path of files(SOURCE)) assert.deepEqual(execFileSync('unzip', ['-p', EPUB, relative(SOURCE, path)]), readFileSync(path));
  for (const path of textual().filter((p) => !p.endsWith('.css'))) assert.equal(XMLValidator.validate(readFileSync(path, 'utf8')), true, path);
});

test(`${lang}: oil edition retains all eight titles, sources, figures and internal destinations`, async () => {
  for (const chapter of oilChapters) {
    const source = readFileSync(join(ROOT, lang === 'fr' ? 'src/content/posts' : 'src/content/posts-en', `${chapter.slug}.md`), 'utf8');
    const { frontmatter } = parseFrontmatter(source);
    assert.equal(chapter.title, frontmatter.title);
    const html = readFileSync(join(SOURCE, 'EPUB/text', chapter.chapter), 'utf8');
    assert.equal((html.match(/<h1\b/gu) ?? []).length, 1, `${chapter.slug}: one chapter heading`);
    assert.equal((html.match(/class="infographic-image"/gu) ?? []).length, 3);
    assert.equal((html.match(/class="infographic-image" alt="[^"]+"/gu) ?? []).length, 3);
    const prose = source.replace(/<svg\b[\s\S]*?<\/svg>/gu, '');
    for (const [, id] of prose.matchAll(/\bid="([^"]+)"/gu)) assert.ok(html.includes(`id="${id}"`), `Source anchor lost: ${id}`);
    const hrefs = (tree) => {
      const found = [];
      const visit = (node) => { if (node.tagName === 'a') found.push(node.properties.href); node.children?.forEach(visit); };
      visit(tree);
      return found;
    };
    const expected = hrefs(fromHtml(await renderOilMarkdown(prose.replace(/^---\n[\s\S]*?\n---\n/u, '')), { fragment: true }));
    const actual = hrefs(fromHtml(html, { fragment: true }));
    for (const href of expected.filter((href) => /^https?:/u.test(href) && !href.startsWith('https://l0g.fr/'))) assert.ok(actual.includes(href), `External source lost: ${href}`);
    assert.match(html, new RegExp(`<html[^>]+lang="${lang}"`, 'u'));
    assert.doesNotMatch(html, /<(?:svg|text|rect|path|style)\b|\sstyle="/iu);
  }
  const opf = readFileSync(join(SOURCE, 'EPUB/content.opf'), 'utf8');
  assert.equal((opf.match(/media-type="image\/svg\+xml"/gu) ?? []).length, 24);
  assert.equal((opf.match(/<itemref\b/gu) ?? []).length, 13);
  assert.ok(readFileSync(join(SOURCE, 'EPUB/text/ch001.xhtml'), 'utf8').includes(lang === 'fr' ? 'Suivre l’argent du pétrole' : 'Following the money in oil'));
  assert.ok(opf.includes(`<dc:language>${lang}</dc:language>`));
  assert.ok(opf.includes(book.title));
  assert.ok(opf.includes(book.modified));
  assert.match(opf, /2026-09-08/u);
  for (const path of textual().filter((p) => !/\.(?:css|svg)$/u.test(p))) {
    for (const [, reference] of readFileSync(path, 'utf8').matchAll(/\b(?:href|src)="([^"]+)"/gu)) {
      if (/^(?:https?:|mailto:)/iu.test(reference)) continue;
      assert.doesNotMatch(reference, /^(?:[a-z]+:|\/\/)/iu);
      const [file, fragment] = reference.split('#');
      const target = file ? resolve(dirname(path), decodeURI(file)) : path;
      assert.ok(target.startsWith(`${SOURCE}/`), `Path escapes EPUB: ${reference}`);
      assert.ok(existsSync(target), `Missing EPUB target: ${path}: ${reference}`);
      if (fragment) assert.ok(readFileSync(target, 'utf8').includes(`id="${decodeURI(fragment)}"`), `Missing fragment: ${reference}`);
    }
  }
});

test(`${lang}: oil EPUB is passive, self-contained and its SVG canvas remains dark`, () => {
  for (const path of textual()) {
    const value = readFileSync(path, 'utf8');
    assert.doesNotMatch(value, /<(?:script|iframe|object|embed|foreignObject|form)\b|\son\w+\s*=|javascript:|data:text\/html|@import|\u2014/iu, path);
    assert.doesNotMatch(value, /(?:src|xlink:href)=["'](?:https?:|\/\/|data:)/iu, path);
    if (path.endsWith('.svg')) {
      assert.doesNotMatch(value, /var\(|<image\b/iu, path);
      assert.match(value, /<rect[^>]+fill="#0b0d10"/u, path);
      assert.match(value, /viewBox="0 0 [\d.]+ [\d.]+"/u, path);
      assert.doesNotMatch(value, /fill="(?:#f5f7f3|#18352e|#ffffff)"/u, 'the legacy light palette must not travel into the EPUB');
      if (/class="b-/u.test(value)) assert.match(value, /<style>[^<]*text\{fill:currentColor\}/u, 'class-based SVG needs its local stylesheet');
    }
  }
  const sample = '<svg viewBox="0 0 540 600" style="--color-surface:#0b0d10"><rect style="fill:var(--color-surface,#fff);stroke:var(--line,rgba(255,255,255,.2))"/></svg>';
  const fixed = standaloneSvg(sample);
  assert.match(fixed, /fill:#0b0d10;stroke:rgba\(255,255,255,.2\)/u);
  assert.throws(() => standaloneSvg('<svg viewBox="0 0 1 1" style="fill:var(--missing)"/>'), /Unsupported/u);
  assert.throws(() => standaloneSvg('<svg viewBox="0 0 1 1"><style>@import "https://example.com/font.css";</style></svg>'), /forbidden/u);
  assert.throws(() => standaloneSvg('<svg viewBox="0 0 1 1" style="fill:url(https://example.com/a.svg)"/>'), /forbidden/u);
});

test(`${lang}: oil cover, responsive variants, social card and publication page are connected`, async () => {
  const cover = await sharp(join(ROOT, 'public', book.cover)).metadata();
  assert.equal(cover.width, 1024); assert.equal(cover.height, 1638);
  assert.ok(statSync(join(ROOT, 'public', book.cover)).size < 256_000);
  const social = await sharp(join(ROOT, 'public', book.social)).metadata();
  assert.equal(social.width, 1200); assert.equal(social.height, 630);
  for (const width of [320, 640, 960]) {
    const path = join(ROOT, 'public', book.cover.replace('.jpg', `-${width}.webp`));
    assert.equal((await sharp(path).metadata()).width, width);
    assert.ok(statSync(path).size < 256_000);
  }
  const page = readFileSync(join(ROOT, pageFile), 'utf8');
  assert.match(page, /'@type': 'Book'/u);
  assert.match(page, /createHash\('sha256'\)/u);
  assert.match(page, /serializeInlineScriptData\(jsonLd\)/u);
  assert.match(page, /seoTitle=/u); assert.match(page, /ogTitle=/u);
  const index = readFileSync(join(ROOT, lang === 'fr' ? 'src/pages/publications/index.astro' : 'src/pages/en/publications/index.astro'), 'utf8');
  assert.match(index, /publication="oil-trading"/u);
  assert.ok(index.includes(book.social));
  assert.match(page, /hreflang: 'fr'/u);
  assert.match(page, /hreflang: 'en'/u);
  if (lang === 'en') {
    assert.match(page, /translationOfWork/u);
    const opf = readFileSync(join(SOURCE, 'EPUB/content.opf'), 'utf8');
    assert.doesNotMatch(opf, /2e744d8f-3968-43b8-84ec-c6d8ed931fac/u, 'The English book needs its own identifier');
    assert.match(readFileSync(join(SOURCE, 'EPUB/text/title_page.xhtml'), 'utf8'), /English edition/u);
  }
  for (const p of book.introduction) assert.doesNotMatch(p, /\u2014/u);
});

}
