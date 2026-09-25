import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';
import { recouvrementBook as book, recouvrementChapters as chapters } from '../src/config/ia-recouvrement-publication.mjs';
import { inspectFigure, renderRecouvrementArticle, readingCopy } from './generate-ia-recouvrement-epub.mjs';
import { renderOilMarkdown } from './generate-oil-epub.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const SOURCE = join(ROOT, 'src/epub', book.directory);
const EPUB = join(ROOT, 'public', book.epub);
const files = dir => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]);
const elements = tree => [tree, ...(tree.children ?? []).flatMap(elements)];
const plain = tree => toText(tree).replace(/\s+/gu, ' ').trim();

test('recouvrement EPUB container packages all source files without corruption', () => {
  const entries = execFileSync('unzip', ['-Z1', EPUB], { encoding: 'utf8' }).trim().split('\n');
  assert.equal(entries[0], 'mimetype');
  assert.equal(execFileSync('unzip', ['-p', EPUB, 'mimetype'], { encoding: 'utf8' }), 'application/epub+zip');
  assert.match(execFileSync('unzip', ['-lv', EPUB], { encoding: 'utf8' }).split('\n').find(line => /\bmimetype$/u.test(line)), /Stored/u);
  assert.match(execFileSync('unzip', ['-t', EPUB], { encoding: 'utf8' }), /No errors detected/u);
  assert.deepEqual(entries.sort(), files(SOURCE).map(f => relative(SOURCE, f)).sort());
  for (const file of files(SOURCE)) assert.deepEqual(execFileSync('unzip', ['-p', EPUB, relative(SOURCE, file)]), readFileSync(file));
});

test('all six complete articles retain paragraphs, sources, anchors and figure captions', async () => {
  for (const chapter of chapters) {
    const original = readFileSync(join(ROOT, 'src/content/posts', `${chapter.slug}.md`), 'utf8');
    const expected = fromHtml(await renderOilMarkdown(readingCopy(original).replace(/^---\n[\s\S]*?\n---\n/u, '').replace(/<svg\b[\s\S]*?<\/svg>/gu, '')), { fragment: true });
    const actual = fromHtml(readFileSync(join(SOURCE, 'EPUB/text', chapter.chapter), 'utf8'));
    const prose = plain(actual), nodes = elements(actual);
    const hrefs = nodes.filter(e => e.tagName === 'a').map(e => e.properties.href);
    for (const node of elements(expected)) {
      if (['p', 'li', 'td', 'th', 'summary', 'figcaption'].includes(node.tagName) && plain(node) && !node.properties?.className?.includes('edition-link')) assert(prose.includes(plain(node)), `${chapter.slug}: lost text ${plain(node).slice(0, 100)}`);
      if (node.tagName === 'a' && /^https?:/u.test(node.properties.href) && new URL(node.properties.href).origin !== 'https://l0g.fr') assert(hrefs.includes(node.properties.href), `Lost source ${node.properties.href}`);
      if (node.properties?.id) assert(nodes.some(n => n.properties?.id === node.properties.id), `Lost anchor ${node.properties.id}`);
    }
    assert.equal(nodes.filter(n => n.tagName === 'h1').length, 1);
    assert.equal(nodes.filter(n => n.tagName === 'img').length, chapter.figureCount + 1);
    assert.equal(nodes.filter(n => n.tagName === 'img' && n.properties.className?.includes('infographic-image')).length, chapter.figureCount);
    assert.equal(hrefs.filter(href => /^ch\d{3}\.xhtml#article-\d$/u.test(href)).length, 5);
    assert(!hrefs.includes(book.path), 'Download invitation omitted inside the book');
    const ids = nodes.map(n => n.properties?.id).filter(Boolean);
    assert.equal(new Set(ids).size, ids.length, `Duplicate ID in ${chapter.slug}`);
  }
});

test('EPUB metadata, manifest, spine and every local fragment are valid', () => {
  const parser = new XMLParser({ ignoreAttributes: false });
  const opf = parser.parse(readFileSync(join(SOURCE, 'EPUB/content.opf'), 'utf8')).package;
  assert.equal(opf.metadata['dc:title'], book.title);
  assert.equal(opf.metadata['dc:language'], 'fr');
  assert.equal(opf.manifest.item.filter(i => i['@_media-type'] === 'image/svg+xml').length, 9);
  assert.equal(opf.manifest.item.filter(i => i['@_media-type'] === 'image/jpeg').length, 8);
  assert.equal(opf.spine.itemref.length, 12);
  const itemIds = new Set(opf.manifest.item.map(i => i['@_id']));
  for (const ref of opf.spine.itemref) assert(itemIds.has(ref['@_idref']));
  for (const file of files(SOURCE).filter(f => /\.(?:xhtml|xml|opf|ncx|svg)$/u.test(f))) {
    const raw = readFileSync(file, 'utf8');
    assert.equal(XMLValidator.validate(raw), true, file);
    function visit(node) {
      if (!node || typeof node !== 'object') return;
      for (const [key, value] of Object.entries(node)) {
        if (['@_href', '@_src', '@_full-path'].includes(key) && !/^(?:https?:|mailto:)/u.test(value)) {
          const [name, fragment] = value.split('#');
          const target = name ? resolve(key === '@_full-path' ? SOURCE : dirname(file), decodeURIComponent(name)) : file;
          assert(target.startsWith(`${SOURCE}/`) && existsSync(target), `Unresolved ${file}: ${value}`);
          if (fragment) assert(readFileSync(target, 'utf8').includes(`id="${decodeURIComponent(fragment)}"`), `Missing fragment ${value}`);
        }
        visit(value);
      }
    }
    visit(parser.parse(raw));
  }
  for (const name of ['ch001.xhtml', 'ch008.xhtml']) assert(statSync(join(SOURCE, 'EPUB/text', name)).size > 3000);
});

test('article assembly rejects active content, foreign chapters and invalid figures', async () => {
  const chapter = chapters[0];
  const original = readFileSync(join(ROOT, 'src/content/posts', `${chapter.slug}.md`), 'utf8');
  await assert.rejects(renderRecouvrementArticle(original, { ...chapter, slug: '../outside' }), /Unconfigured/u);
  await assert.rejects(renderRecouvrementArticle(original + '\nimport x from "./x";', chapter), /Unexpected article import/u);
  await assert.rejects(renderRecouvrementArticle(original + '\n<script>alert(1)</script>', chapter), /Active EPUB/u);
  await assert.rejects(renderRecouvrementArticle(original + '\n<a href="java&#x73;cript:alert(1)">x</a>', chapter), /Unsafe EPUB/u);
  await assert.rejects(renderRecouvrementArticle(original + '\n<img src="https://example.com/pixel"/>', chapter), /External EPUB/u);
  await assert.rejects(renderRecouvrementArticle(original.replace(/<figure\b[\s\S]*?<\/figure>/u, ''), chapter), /Unexpected article figures/u);
  const fixture = '<figure><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 400"><title>Diagramme</title><rect width="480" height="400" fill="#000"/></svg><figcaption>Source locale</figcaption></figure>';
  assert.match(inspectFigure(fixture), /fill="#0b0d10"/u);
  for (const payload of ['<script>alert(1)</script>', '<foreignObject/>', '<image href="https://example.com/pixel"/>', '<style>@import "https://example.com/a";</style>', '<animate attributeName="href"/>']) assert.throws(() => inspectFigure(fixture.replace('</svg>', `${payload}</svg>`)));
  assert.throws(() => inspectFigure(fixture.replace('<rect ', '<rect onload="alert(1)" ')));
  assert.throws(() => inspectFigure(fixture.replace('fill="#000"', 'fill="url(https://example.com/a)"')));
  assert.throws(() => inspectFigure(fixture.replace('<figure>', '<figure><style>@import "https://example.com/a";</style>')));
  assert.throws(() => inspectFigure(fixture.replace('<figure>', '<figure style="background:url(https://example.com/pixel)">')));
});

test('ebook is passive, self-contained and uses direct editorial wording', () => {
  for (const file of files(SOURCE).filter(f => /\.(?:xhtml|svg|css)$/u.test(f))) {
    const content = readFileSync(file, 'utf8');
    assert.doesNotMatch(content, /<(?:script|iframe|object|embed|foreignObject|form|input|audio|video)\b|\son\w+=|javascript:|@import|—/iu);
    assert.doesNotMatch(content, /(?:src|xlink:href)=["'](?:https?:|\/\/|data:)/iu);
    if (file.endsWith('.xhtml')) assert.doesNotMatch(plain(fromHtml(content)), /ne prouve (?:pas|ni)/iu);
    if (file.endsWith('.svg')) {
      assert.match(content, /<rect[^>]+fill="#0b0d10"/u);
      assert.doesNotMatch(content, /var\(/u, 'Reader does not depend on website custom properties');
      assert.match(content, /fill="#e7e9ee"/u);
    }
  }
});

test('dedicated cover, panorama and responsive assets meet publication budgets', async () => {
  for (const [path, width, height, budget] of [[book.cover, 1024, 1638, 256000], [book.social, 1200, 630, 200000], [book.panorama, 1600, 800, 300000]]) {
    const target = join(ROOT, 'public', path), meta = await sharp(target).metadata();
    assert.equal(meta.width, width); assert.equal(meta.height, height); assert(statSync(target).size < budget);
  }
  for (const [path, widths] of [[book.cover, [320, 640, 960]], [book.panorama, [640, 960, 1600]]]) {
    for (const width of widths) assert.equal((await sharp(join(ROOT, 'public', path.replace('.jpg', `-${width}.webp`))).metadata()).width, width);
  }
  assert.deepEqual(readFileSync(join(SOURCE, 'EPUB/media/cover.jpg')), readFileSync(join(ROOT, 'public', book.cover)));
  const page = readFileSync(join(ROOT, 'src/pages/publications/ia-recouvrement.astro'), 'utf8');
  assert.match(page, /'@type': 'Book'/u); assert.match(page, /serializeInlineScriptData\(jsonLd\)/u);
  assert.match(page, /createHash\('sha256'\)/u); assert.match(page, /ogImage=\{book.social\}/u);
  const catalogue = readFileSync(join(ROOT, 'src/pages/publications/index.astro'), 'utf8');
  assert(catalogue.indexOf('publication="ia-recouvrement"') < catalogue.indexOf('publication="commerce-traces"'));
  assert(catalogue.includes(book.social));
});
