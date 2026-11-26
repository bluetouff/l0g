import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';
import sharp from 'sharp';
import { shadowFleetEditions } from '../src/config/shadow-fleet-publication.mjs';
import { getPublicationSocial } from '../src/config/publication-social.mjs';
import { renderedPublicationCards } from './publication-catalog-test-utils.mjs';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const SITE = 'https://l0g.fr';
const nodes = node => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const attr = (node, name) => node?.attrs?.find(attribute => attribute.name === name)?.value;
const hasClass = (node, name) => (attr(node, 'class') ?? '').split(/\s+/u).includes(name);
const text = (node) => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
const plain = node => text(node).replace(/\s+/gu, ' ').trim();

for (const book of Object.values(shadowFleetEditions)) {
  test(`${book.lang} shadow fleet edition links the complete four-chapter book from its catalogue`, async () => {
    const page = nodes(parse(readFileSync(join(ROOT, 'dist', book.path, 'index.html'), 'utf8')));
    const alternate = shadowFleetEditions[book.lang === 'fr' ? 'en' : 'fr'];
    const article = page.find(node => node.tagName === 'article' && hasClass(node, 'fleet-book'));
    assert(article, book.path);
    const content = nodes(article);
    const links = content.filter(node => node.tagName === 'a');
    const downloads = links.filter(node => attr(node, 'download') !== undefined);
    const social = getPublicationSocial(book.path);
    const ogImage = page.find(node => node.tagName === 'meta' && attr(node, 'property') === 'og:image');
    const twitterImage = page.find(node => node.tagName === 'meta' && attr(node, 'name') === 'twitter:image');
    const canonical = page.find(node => node.tagName === 'link' && attr(node, 'rel') === 'canonical');
    const languageLink = page.find(node => node.tagName === 'link' && attr(node, 'rel') === 'alternate' && attr(node, 'hreflang') === alternate.lang);

    assert.equal(attr(canonical, 'href'), SITE + book.path);
    assert.equal(attr(languageLink, 'href'), SITE + alternate.path);
    assert.equal(attr(ogImage, 'content'), SITE + social.image);
    assert.equal(attr(twitterImage, 'content'), SITE + social.image);
    assert.equal(plain(content.find(node => node.tagName === 'h1')), book.title);
    assert.deepEqual(downloads.map(node => attr(node, 'href')), [book.epub]);
    assert(links.some(node => attr(node, 'hreflang') === alternate.lang && attr(node, 'href') === alternate.path));
    const chapters = nodes(content.find(node => node.tagName === 'ol' && hasClass(node, 'chapter-grid'))).filter(node => node.tagName === 'a');
    assert.equal(chapters.length, 4);
    assert.deepEqual(chapters.map(node => attr(node, 'href')), book.chapters.map(chapter => chapter.route));
    for (const node of chapters) readFileSync(join(ROOT, 'dist', attr(node, 'href'), 'index.html'));

    const data = page.filter(node => attr(node, 'type') === 'application/ld+json').map(node => JSON.parse(text(node)));
    const schema = data.find(item => item['@type'] === 'Book');
    const file = readFileSync(join(ROOT, 'dist', book.epub));
    const sha256 = createHash('sha256').update(file).digest('hex');
    assert.equal(schema.associatedMedia.contentUrl, SITE + book.epub);
    assert.equal(schema.associatedMedia.contentSize, `${file.length} bytes`);
    assert.equal(schema.associatedMedia.sha256, sha256);
    assert.equal(plain(content.find(node => node.tagName === 'code')), sha256);

    const catalogueCard = renderedPublicationCards(ROOT, book.lang)
      .find(node => hasClass(node, 'publication-spotlight--shadow-fleet'));
    assert.ok(catalogueCard, 'Shadow fleet retains a catalogue card');
    const card = nodes(catalogueCard);
    assert.equal(plain(card.find(node => node.tagName === 'h2')), book.title);
    assert.equal(attr(card.find(node => node.tagName === 'a' && attr(node, 'download') !== undefined), 'href'), book.epub);
    assert.equal(attr(card.find(node => node.tagName === 'img'), 'src'), book.cover);
    for (const [path, width, height] of [[book.cover, 1024, 1536], [book.panorama, 1600, 840], [social.image, 1200, 630]]) {
      const meta = await sharp(join(ROOT, 'dist', path)).metadata();
      assert.equal(meta.width, width, path);
      assert.equal(meta.height, height, path);
    }
  });
}
