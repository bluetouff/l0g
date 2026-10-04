import assert from 'node:assert/strict';
import test from 'node:test';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import sharp from 'sharp';
import { reservesEditions } from '../src/config/reserves-publication.mjs';
import { bakeReservesSvg, generateReservesEpub, renderReservesArticle } from './generate-reserves-epub.mjs';
import { renderOilMarkdown } from './generate-oil-epub.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const files = dir => readdirSync(dir, { withFileTypes:true }).flatMap(e => e.isDirectory() ? files(join(dir, e.name)) : [join(dir, e.name)]);
const nodes = node => [node, ...(node.children ?? []).flatMap(nodes)];
const plain = tree => toText(tree).replace(/\s+/gu, ' ').trim();
const stripDisplay = node => {
  if (node.tagName === 'svg') return null;
  if ((node.properties?.className ?? []).some(name => /^rsv0[2-6]-(?:wide|mobile)$/u.test(name))) return null;
  if (node.properties?.className?.includes('edition-link')) return null;
  const copy = structuredClone(node);
  copy.children = (node.children ?? []).map(stripDisplay).filter(Boolean);
  return copy;
};
const geometry = tree => nodes(tree).filter(n => n.type === 'element').map(n => ({
  tag:n.tagName,
  properties:Object.fromEntries(Object.entries(n.properties ?? {}).filter(([key]) => !['fill', 'stroke', 'style', 'className', 'xmlns'].includes(key))),
  text:n.children?.filter(c => c.type === 'text').map(c => c.value).join(''),
}));

for (const book of Object.values(reservesEditions)) {
  const SOURCE = join(ROOT, 'src/epub', book.directory), EPUB = join(ROOT, 'public', book.epub);
  const contentRoot = book.lang === 'en' ? 'src/content/posts-en' : 'src/content/posts';
  const article = chapter => readFileSync(join(ROOT, contentRoot, `${chapter.slug}.md`), 'utf8');

  test(`${book.lang}: reserves EPUB container preserves its source files byte for byte`, () => {
    const entries = execFileSync('unzip', ['-Z1', EPUB], { encoding:'utf8' }).trim().split('\n');
    assert.equal(entries[0], 'mimetype');
    assert.equal(execFileSync('unzip', ['-p', EPUB, 'mimetype'], { encoding:'utf8' }), 'application/epub+zip');
    assert.match(execFileSync('unzip', ['-lv', EPUB], { encoding:'utf8' }).split('\n').find(line => /\bmimetype$/u.test(line)), /Stored/u);
    assert.match(execFileSync('unzip', ['-t', EPUB], { encoding:'utf8' }), /No errors detected/u);
    assert.deepEqual(entries.sort(), files(SOURCE).map(f => relative(SOURCE, f)).sort());
    for (const file of files(SOURCE)) assert.deepEqual(execFileSync('unzip', ['-p', EPUB, relative(SOURCE, file)]), readFileSync(file));
    assert(statSync(EPUB).size < 5_000_000);
  });

  test(`${book.lang}: all six complete articles retain prose, source anchors, tables and original captions`, async () => {
    for (const chapter of book.chapters) {
      const original = article(chapter);
      const expected = stripDisplay(fromHtml(await renderOilMarkdown(parseFrontmatter(original).content), { fragment:true }));
      const actual = fromHtml(readFileSync(join(SOURCE, 'EPUB/text', chapter.chapter), 'utf8'));
      const prose = plain(actual), rendered = nodes(actual);
      const hrefs = rendered.filter(n => n.tagName === 'a').map(n => n.properties.href);
      for (const node of nodes(expected)) {
        if (['p', 'li', 'td', 'th', 'summary', 'figcaption'].includes(node.tagName) && plain(node)) assert(prose.includes(plain(node)), `${chapter.slug}: lost text ${plain(node).slice(0, 120)}`);
        if (node.tagName === 'a' && /^https?:/u.test(node.properties.href) && new URL(node.properties.href).origin !== 'https://l0g.fr') assert(hrefs.includes(node.properties.href), `Lost source ${node.properties.href}`);
        if (node.properties?.id) assert(rendered.some(n => n.properties?.id === node.properties.id), `Lost source anchor ${node.properties.id}`);
      }
      assert.equal(rendered.filter(n => n.tagName === 'h1').length, 1);
      assert.equal(rendered.filter(n => n.tagName === 'figure' && n.properties.className?.includes('infographic')).length, 4);
      for (const cell of rendered.filter(n => ['td', 'th'].includes(n.tagName))) assert(!('align' in cell.properties));
      for (const other of book.chapters.filter(c => c !== chapter)) assert(hrefs.includes(`${other.chapter}#article-${other.number}`));
      const ids = rendered.map(n => n.properties?.id).filter(Boolean);
      assert.equal(new Set(ids).size, ids.length, `Duplicate article ID in ${chapter.slug}`);
      assert(!hrefs.includes(book.path), 'Download invitation does not recur inside downloaded book');
    }
  });

  test(`${book.lang}: all 24 original diagram geometries, labels and type settings are unchanged`, async () => {
    let count = 0;
    for (const chapter of book.chapters) {
      const originalTree = fromHtml(await renderOilMarkdown(parseFrontmatter(article(chapter)).content), { fragment:true });
      const figures = nodes(originalTree).filter(n => n.tagName === 'figure');
      const assembled = await renderReservesArticle(article(chapter), chapter);
      const complete = assembled.attachments.filter(a => a.kind === 'complete');
      assert.equal(complete.length, 4);
      for (const [index, figure] of figures.entries()) {
        const originalSvg = nodes(figure).find(n => n.tagName === 'svg');
        const actualSvg = nodes(fromHtml(complete[index].svg, { fragment:true })).find(n => n.tagName === 'svg');
        assert.deepEqual(geometry(actualSvg), geometry(originalSvg), `${chapter.slug}: complete composition changed`);
        count++;
      }
      const originals = nodes(originalTree).filter(n => n.tagName === 'svg');
      if (chapter.number <= 2) {
        const reading = assembled.attachments.filter(a => a.kind === 'reading');
        for (let i = 0; i < 4; i++) assert.deepEqual(geometry(fromHtml(reading[i].svg, { fragment:true })), geometry(fromHtml(bakeReservesSvg(originals[i * 2 + 1]), { fragment:true })));
      }
      for (const a of assembled.attachments) {
        assert.equal(XMLValidator.validate(a.svg), true);
        assert.doesNotMatch(a.svg, /var\(|color-mix\(|<style|<script|<foreignObject|\son[a-z]+=/iu);
        assert.match(a.svg, /fill="#(?:121419|0c0d10)"/u);
      }
    }
    assert.equal(count, book.figureCount);
  });

  test(`${book.lang}: metadata, manifest, fragments and offline assets are internally consistent`, () => {
    const parser = new XMLParser({ ignoreAttributes:false });
    const opf = parser.parse(readFileSync(join(SOURCE, 'EPUB/content.opf'), 'utf8')).package;
    assert.equal(opf.metadata['dc:title'], book.title);
    assert.equal(opf.metadata['dc:language'], book.lang);
    assert.equal(opf.metadata['dc:identifier']['#text'], book.id);
    assert.equal(opf.metadata['dc:source'], `https://l0g.fr${book.path}`);
    assert.equal(opf.metadata['dc:date'], '2026-10-04');
    assert.equal(opf.manifest.item.filter(i => i['@_media-type'] === 'image/svg+xml').length, 76);
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
            const [name, fragment] = String(value).split('#');
            const target = name ? resolve(key === '@_full-path' ? SOURCE : dirname(file), decodeURIComponent(name)) : file;
            assert(target.startsWith(`${SOURCE}/`) && existsSync(target), `Unresolved ${file}: ${value}`);
            if (fragment) assert(readFileSync(target, 'utf8').includes(`id="${decodeURIComponent(fragment)}"`), `Missing fragment ${value}`);
          }
          if (key === '@_src') assert(!/^(?:https?:|data:|\/\/)/u.test(String(value)), 'Media is available offline');
          visit(value);
        }
      }
      visit(parser.parse(raw));
      assert.doesNotMatch(raw, /<(?:script|iframe|object|embed|foreignObject|form|input|audio|video)\b|\son\w+=|javascript:|@import|—/iu);
    }
    const colophon = plain(fromHtml(readFileSync(join(SOURCE, 'EPUB/text/ch009.xhtml'), 'utf8')));
    assert.match(colophon, book.lang === 'fr' ? /3 octobre 2026/u : /3 October 2026/u);
    assert.match(colophon, book.lang === 'fr' ? /sept volets/u : /seven parts/u);
    const introduction = plain(fromHtml(readFileSync(join(SOURCE, 'EPUB/text/ch001.xhtml'), 'utf8')));
    const conclusion = plain(fromHtml(readFileSync(join(SOURCE, 'EPUB/text/ch008.xhtml'), 'utf8')));
    for (const paragraph of book.introduction) assert(introduction.includes(paragraph), 'Original introduction retained');
    for (const paragraph of book.conclusion) assert(conclusion.includes(paragraph), 'Original conclusion retained');
  });

  test(`${book.lang}: article assembly rejects foreign chapters, active HTML and remote figure resources`, async () => {
    const chapter = book.chapters[0], original = article(chapter);
    await assert.rejects(renderReservesArticle(original, { ...chapter }), /Unconfigured/u);
    for (const payload of ['\nimport x from "./x";', '\n<script>alert(1)</script>', '\n<a href="java&#x73;cript:alert(1)">x</a>', '\n<img src="https://example.com/pixel"/>', '\n<style>@import "https://example.com/a";</style>', '\n<div style="background:url(https://example.com/pixel)">x</div>', '\n<div style="color:expression(alert(1))">x</div>']) await assert.rejects(renderReservesArticle(original + payload, chapter));
    await assert.rejects(renderReservesArticle(original.replace('class="infographic l0g-reserves01-figure"', 'class="infographic"'), chapter), /Unexpected reserves figure/u);
    const panelChapter = book.chapters[2], panelSource = article(panelChapter);
    await assert.rejects(renderReservesArticle(panelSource.replace('/infographies/reserves-logistics/panels/', '/infographies/reserves-logistics/panels/../../'), panelChapter), /External EPUB figure/u);
    await assert.rejects(renderReservesArticle(panelSource.replace('/infographies/reserves-logistics/panels/', 'https://example.com/'), panelChapter), /External EPUB figure/u);
  });

  test(`${book.lang}: cover, panorama and responsive assets use the intended dimensions`, async () => {
    for (const [path, width, height, budget] of [[book.cover, 1024, 1638, 256000], [book.panorama, 1600, 800, 300000]]) {
      const target = join(ROOT, 'public', path), meta = await sharp(target).metadata();
      assert.equal(meta.width, width); assert.equal(meta.height, height); assert(statSync(target).size < budget);
    }
    for (const [path, widths] of [[book.cover, [320, 640, 960]], [book.panorama, [640, 960, 1600]]]) for (const width of widths) assert.equal((await sharp(join(ROOT, 'public', path.replace('.jpg', `-${width}.webp`))).metadata()).width, width);
    assert.deepEqual(readFileSync(join(SOURCE, 'EPUB/media/cover.jpg')), readFileSync(join(ROOT, 'public', book.cover)));
    assert.deepEqual(readFileSync(join(SOURCE, 'EPUB/media/panorama.jpg')), readFileSync(join(ROOT, 'public', book.panorama)));
    assert(!existsSync(join(ROOT, 'public/publications', `${book.directory}-cover-social.jpg`)), 'EPUB generator does not create a letterboxed social cover');
  });
}

test('reserves SVG export rejects scripts, foreign resources, styles, malformed XML and unknown colours', () => {
  const fixture = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 400" style="width:100%;height:auto"><title>Diagram</title><desc>Local description</desc><rect width="480" height="400" fill="var(--color-ink)"/></svg>';
  assert.match(bakeReservesSvg(fixture), /fill="#0c0d10"/u);
  for (const payload of ['<script>alert(1)</script>', '<foreignObject/>', '<image href="https://example.com/a"/>', '<style>@import "https://example.com/a";</style>', '<animate attributeName="href"/>']) assert.throws(() => bakeReservesSvg(fixture.replace('</svg>', `${payload}</svg>`)));
  for (const replacement of ['var(--color-unknown)', 'var(--color-constructor)', 'url(https://example.com/a)', 'url(#missing)', 'javascript:alert(1)']) assert.throws(() => bakeReservesSvg(fixture.replace('var(--color-ink)', replacement)));
  assert.throws(() => bakeReservesSvg(fixture.replace('<rect ', '<rect onload="alert(1)" ')));
  assert.throws(() => bakeReservesSvg(fixture.replace('</svg>', '')));
  assert.throws(() => bakeReservesSvg('<!DOCTYPE svg [<!ENTITY x "payload">]>' + fixture));
});

test('reserves editions have distinct identities and preserve all six English source linkages', async () => {
  assert.notEqual(reservesEditions.fr.id, reservesEditions.en.id);
  assert.notEqual(reservesEditions.fr.epub, reservesEditions.en.epub);
  await assert.rejects(generateReservesEpub('../outside'), /Unsupported reserves/u);
  for (const [index, chapter] of reservesEditions.en.chapters.entries()) assert.equal(parseFrontmatter(readFileSync(join(ROOT, 'src/content/posts-en', `${chapter.slug}.md`), 'utf8')).frontmatter.sourceArticle, reservesEditions.fr.chapters[index].slug);
});
