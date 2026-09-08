import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import sharp from 'sharp';
import { oilPublication as book, oilChapters } from '../src/config/oil-publication.mjs';
import { standaloneSvg } from './generate-oil-epub.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const SOURCE = join(ROOT, 'src/epub/les-banquiers-du-baril');
const EPUB = join(ROOT, 'public', book.epub);
const files = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]);
const textual = () => files(SOURCE).filter((p) => /\.(css|ncx|opf|svg|xhtml|xml)$/u.test(p));

test('oil EPUB has a valid container and packages exactly its versioned sources', () => {
  const entries = execFileSync('unzip', ['-Z1', EPUB], { encoding: 'utf8' }).trim().split('\n');
  assert.equal(entries[0], 'mimetype');
  assert.equal(execFileSync('unzip', ['-p', EPUB, 'mimetype'], { encoding: 'utf8' }), 'application/epub+zip');
  assert.match(execFileSync('unzip', ['-lv', EPUB], { encoding: 'utf8' }).split('\n').find((s) => /\bmimetype\s*$/u.test(s)), /Stored/u);
  assert.match(execFileSync('unzip', ['-t', EPUB], { encoding: 'utf8' }), /No errors detected/u);
  assert.deepEqual(entries.sort(), files(SOURCE).map((p) => relative(SOURCE, p)).sort());
  for (const path of files(SOURCE)) assert.deepEqual(execFileSync('unzip', ['-p', EPUB, relative(SOURCE, path)]), readFileSync(path));
  for (const path of textual().filter((p) => !p.endsWith('.css'))) assert.equal(XMLValidator.validate(readFileSync(path, 'utf8')), true, path);
});

test('oil edition retains all eight titles, sources, figures and internal destinations', () => {
  for (const chapter of oilChapters) {
    const source = readFileSync(join(ROOT, 'src/content/posts', `${chapter.slug}.md`), 'utf8');
    const { frontmatter } = parseFrontmatter(source);
    assert.equal(chapter.title, frontmatter.title);
    const html = readFileSync(join(SOURCE, 'EPUB/text', chapter.chapter), 'utf8');
    assert.equal((html.match(/<h1\b/gu) ?? []).length, 1, `${chapter.slug}: one chapter heading`);
    assert.equal((html.match(/class="infographic-image"/gu) ?? []).length, 3);
    assert.equal((html.match(/class="infographic-image" alt="[^"]+"/gu) ?? []).length, 3);
    for (const [, id] of source.matchAll(/\bid="([^"]+)"/gu)) {
      if (/^(?:s\d|bdb\d+-fr-s\d)/u.test(id)) assert.ok(html.includes(`id="${id}"`), `Source anchor lost: ${id}`);
    }
    assert.doesNotMatch(html, /<(?:svg|text|rect|path|style)\b|\sstyle="/iu);
  }
  const opf = readFileSync(join(SOURCE, 'EPUB/content.opf'), 'utf8');
  assert.equal((opf.match(/media-type="image\/svg\+xml"/gu) ?? []).length, 24);
  assert.equal((opf.match(/<itemref\b/gu) ?? []).length, 13);
  assert.match(readFileSync(join(SOURCE, 'EPUB/text/ch001.xhtml'), 'utf8'), /Suivre l’argent du pétrole/u);
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

test('oil EPUB is passive, self-contained and its SVG canvas remains dark', () => {
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

test('oil cover, responsive variants, social card and publication page are connected', async () => {
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
  const page = readFileSync(join(ROOT, 'src/pages/publications/les-banquiers-du-baril.astro'), 'utf8');
  assert.match(page, /'@type': 'Book'/u);
  assert.match(page, /createHash\('sha256'\)/u);
  assert.match(page, /serializeInlineScriptData\(jsonLd\)/u);
  assert.match(page, /seoTitle=/u); assert.match(page, /ogTitle=/u);
  assert.match(readFileSync(join(ROOT, 'src/pages/publications/index.astro'), 'utf8'), /publication="oil-trading"/u);
  assert.match(readFileSync(join(ROOT, 'src/pages/publications/index.astro'), 'utf8'), /les-banquiers-du-baril-cover-social\.jpg/u);
  for (const p of book.introduction) assert.doesNotMatch(p, /\u2014/u);
});
