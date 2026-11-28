import assert from 'node:assert/strict';
import { readEpubEntries } from './epub-test-archive.mjs';
import { readFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { shadowFleetEditions } from '../src/config/shadow-fleet-publication.mjs';
import { shadowFleetBookText } from '../src/publication-text/shadow-fleet-book.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const parser = new XMLParser({ ignoreAttributes: false });
const documents = ['ch001', 'method', 'conclusion', 'glossary', 'figures', 'colophon'];

for (const book of Object.values(shadowFleetEditions)) {
  const archive = join(root, 'public', book.epub);
  test(`${book.lang}: complete EPUB 3 package with the published four-part series`, () => {
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
    const copy = shadowFleetBookText[book.lang];
    assert.equal(parser.parse(byName.get('EPUB/text/ch001.xhtml')).html.body.section.h1, copy.introductionTitle);
    assert.equal(parser.parse(byName.get('EPUB/text/conclusion.xhtml')).html.body.section.h1, copy.conclusionTitle);

    let references = 0;
    let figures = 0;
    for (const chapter of book.chapters) {
      const chapterPath = `EPUB/text/${chapter.chapter}`;
      const html = byName.get(chapterPath);
      assert.ok(html.includes(`href="https://l0g.fr${chapter.route}"`));
      assert.ok(byName.get('EPUB/nav.xhtml').includes(`href="text/${chapter.chapter}"`));
      references += [...html.matchAll(/<li id="c\d-source-S\d\d">/gu)].length;
      figures += [...html.matchAll(/<figure id="c\d-figure-\d" class="infographic">/gu)].length;
    }
    assert.equal(references, 77);
    assert.equal(figures, 8);
    assert.equal(files.filter(file => /^EPUB\/media\/file\d+\.svg$/u.test(file)).length, 16);
    assert.equal([...byName.get('EPUB/text/glossary.xhtml').matchAll(/id="glossary-[a-z0-9-]+"/gu)].length, copy.glossary.length);
    for (const [file, source] of byName) {
      if (file.endsWith('.svg')) {
        assert.match(source, /<desc\b/u);
        assert.doesNotMatch(source, /\bvar\(--color-|<script\b|<foreignObject\b/iu);
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
