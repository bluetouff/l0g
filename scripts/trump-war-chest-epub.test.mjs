import assert from 'node:assert/strict';
import { readEpubEntries } from './epub-test-archive.mjs';
import { readFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { fromHtml } from 'hast-util-from-html';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { trumpWarChestEditions } from '../src/config/trump-war-chest-publication.mjs';
import { trumpWarChestBookText } from '../src/publication-text/trump-war-chest-book.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const parser = new XMLParser({ ignoreAttributes: false });
const nodes = node => [node, ...(node.children ?? []).flatMap(nodes)];
const documents = ['ch001', 'method', 'conclusion', 'glossary', 'figures', 'colophon'];

for (const book of Object.values(trumpWarChestEditions)) {
  const archive = join(root, 'public', book.epub);
  test(`${book.lang}: complete EPUB 3 package with the published six-part series`, () => {
    const entries = readEpubEntries(archive);
    const files = [...entries.keys()];
    const entry = file => entries.get(file);
    const read = file => entry(file).toString('utf8');
    const start = readFileSync(archive);
    assert.equal(start.readUInt16LE(8), 0, 'EPUB requires a stored mimetype');
    assert.equal(files[0], 'mimetype');
    assert.equal(read('mimetype'), 'application/epub+zip');
    assert.deepEqual(entry('EPUB/media/cover.jpg'), readFileSync(join(root, 'public', book.cover)));
    const byName = new Map(files.filter(file => /\.(?:xml|opf|xhtml|svg)$/u.test(file)).map(file => [file, read(file)]));
    for (const [file, source] of byName) assert.equal(XMLValidator.validate(source), true, file);
    const { package: opf } = parser.parse(byName.get('EPUB/content.opf'));
    assert.equal(opf['@_version'], '3.0');
    assert.equal(opf.metadata['dc:language'], book.lang);
    assert.equal(opf.metadata['dc:source'], `https://l0g.fr${book.path}`);
    assert.deepEqual(
      opf.spine.itemref.filter(ref => ref['@_linear'] !== 'no').map(ref => ref['@_idref']),
      ['cover', 'title_page', 'nav', ...documents.slice(0, 2), ...book.chapters.map(chapter => chapter.chapter.slice(0, -6)), ...documents.slice(2)],
    );
    assert.equal(opf.manifest.item.filter(item => item['@_properties'] === 'cover-image').length, 1);
    for (const item of opf.manifest.item) assert.ok(files.includes(`EPUB/${item['@_href']}`));
    const copy = trumpWarChestBookText[book.lang];
    assert.equal(parser.parse(byName.get('EPUB/text/ch001.xhtml')).html.body.section.h1, copy.introductionTitle);
    assert.equal(parser.parse(byName.get('EPUB/text/conclusion.xhtml')).html.body.section.h1, copy.conclusionTitle);

    let references = 0;
    let offlineCrosslinks = 0;
    let figures = 0;
    for (const chapter of book.chapters) {
      const chapterPath = `EPUB/text/${chapter.chapter}`;
      const html = byName.get(chapterPath);
      assert.ok(html.includes(`href="https://l0g.fr${chapter.route}"`));
      assert.ok(byName.get('EPUB/nav.xhtml').includes(`href="text/${chapter.chapter}"`));
      const tree = fromHtml(html);
      const article = readFileSync(join(root, 'src/content', book.lang === 'fr' ? 'posts' : 'posts-en', `${chapter.slug}.mdx`), 'utf8');
      const sourceIds = [...article.matchAll(/<li id="(source-S\d{2})">/gu)].map(([, id]) => `c${chapter.number}-${id}`);
      const sources = nodes(tree).filter(node => node.tagName === 'li' && node.properties.id?.includes('-source-'));
      assert.deepEqual(sources.map(node => node.properties.id), sourceIds, 'published source order and IDs survive');
      for (const source of sources) {
        assert.ok(source.children.some(node => node.tagName === 'a' && /^https?:\/\//u.test(node.properties.href)));
        assert.ok(source.children.some(node => node.tagName === 'section'), 'source scope remains readable offline');
      }
      references += sources.length;
      figures += nodes(tree).filter(node => node.tagName === 'figure').length;
      offlineCrosslinks += nodes(tree).filter(node => node.tagName === 'a' && /^ch\d{3}\.xhtml#chapter-/u.test(node.properties.href)).length;
      assert.ok(nodes(tree).some(node => node.tagName === 'a' && node.properties.href === 'figures.xhtml#description-c' + chapter.number + '-f1'));
    }
    assert.equal(references, 167);
    assert.ok(offlineCrosslinks >= 5);
    assert.equal(figures, 16);
    assert.equal(files.filter(file => /^EPUB\/media\/file\d+\.svg$/u.test(file)).length, 32);
    assert.equal([...byName.get('EPUB/text/glossary.xhtml').matchAll(/id="glossary-[a-z0-9-]+"/gu)].length, copy.glossary.length);
    const alternate = trumpWarChestEditions[book.lang === 'fr' ? 'en' : 'fr'];
    assert.ok(byName.get('EPUB/text/colophon.xhtml').includes(`href="https://l0g.fr${alternate.path}"`));
    assert.equal([...byName.get('EPUB/text/figures.xhtml').matchAll(/id="description-c\d-f\d"/gu)].length, 16);
    for (const [file, source] of byName) {
      if (file.endsWith('.svg')) {
        const scene = nodes(fromHtml(source, { fragment: true })).find(node => node.tagName === 'svg');
        assert.equal(scene.properties.role, 'img');
        assert.ok(scene.children.some(node => node.tagName === 'desc'));
        assert.match(source, /data:font\/woff2;base64,/u);
        assert.doesNotMatch(source, /\bvar\(--color-|<script\b|<foreignObject\b|https?:\/\/(?!www\.w3\.org\/2000\/svg)/iu);
      }
      if (!file.endsWith('.xhtml')) continue;
      for (const [, href] of source.matchAll(/(?:href|src)="([^"]+)"/gu)) {
        if (/^https?:/u.test(href)) continue;
        const [path, id] = href.split('#');
        const target = path ? posix.normalize(posix.join(dirname(file), path)) : file;
        assert.ok(files.includes(target), `${file}: unresolved target ${href}`);
        if (id) assert.ok(byName.get(target)?.includes(`id="${decodeURIComponent(id)}"`), `${file}: unresolved anchor ${href}`);
      }
    }
  });
}
