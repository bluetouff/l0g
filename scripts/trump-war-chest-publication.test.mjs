import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';
import sharp from 'sharp';
import { trumpWarChestEditions } from '../src/config/trump-war-chest-publication.mjs';
import { getPublicationSocial } from '../src/config/publication-social.mjs';
import { renderedPublicationCards } from './publication-catalog-test-utils.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const site = 'https://l0g.fr';
const nodeAttr = (node, name) => node?.attrs?.find(attribute => attribute.name === name)?.value;
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
const nodes = node => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const hasClass = (node, name) => (nodeAttr(node, 'class') ?? '').split(/\s+/u).includes(name);

for (const book of Object.values(trumpWarChestEditions)) {
  test(`${book.lang} war chest publication links the six original chapters and exact EPUB from its catalogue`, async () => {
    const other = trumpWarChestEditions[book.lang === 'fr' ? 'en' : 'fr'];
    const page = nodes(parse(readFileSync(join(root, 'dist', book.path, 'index.html'), 'utf8')));
    const main = nodes(page.find(node => node.tagName === 'main'));
    const links = main.filter(node => node.tagName === 'a');
    const href = node => nodeAttr(node, 'href');
    assert.equal(text(main.find(node => node.tagName === 'h1')).trim(), book.title);
    assert.equal(href(page.find(node => node.tagName === 'link' && nodeAttr(node, 'rel') === 'canonical')), site + book.path);
    assert.equal(href(page.find(node => node.tagName === 'link' && nodeAttr(node, 'hreflang') === other.lang)), site + other.path);
    assert.ok(links.some(node => href(node) === other.path && nodeAttr(node, 'hreflang') === other.lang));
    assert.ok(links.some(node => href(node) === book.epub && nodeAttr(node, 'download') !== undefined));
    assert.deepEqual(links.map(href).filter(value => book.chapters.some(chapter => chapter.route === value)), book.chapters.map(chapter => chapter.route));
    assert.equal(book.chapters.length, 6);

    const card = renderedPublicationCards(root, book.lang)
      .find(node => hasClass(node, 'publication-spotlight--trump-war-chest'));
    assert.ok(card);
    assert.ok(nodes(card).some(node => node.tagName === 'a' && href(node) === book.path));
    assert.ok(nodes(card).some(node => node.tagName === 'a' && href(node) === book.epub && nodeAttr(node, 'download') !== undefined));

    const archive = readFileSync(join(root, 'dist', book.epub));
    const sha256 = createHash('sha256').update(archive).digest('hex');
    const schema = page.filter(node => nodeAttr(node, 'type') === 'application/ld+json')
      .map(node => JSON.parse(text(node))).find(data => data['@type'] === 'Book');
    assert.equal(schema.associatedMedia.contentUrl, site + book.epub);
    assert.equal(schema.associatedMedia.sha256, sha256);
    assert.equal(schema.associatedMedia.contentSize, `${archive.length} bytes`);

    const social = getPublicationSocial(book.path);
    for (const key of ['og:image', 'twitter:image']) {
      const entry = page.find(node => node.tagName === 'meta' && [nodeAttr(node, 'property'), nodeAttr(node, 'name')].includes(key));
      assert.equal(nodeAttr(entry, 'content'), site + social.image);
    }
    for (const [path, width, height] of [[book.cover, 1024, 1536], [book.panorama, 1600, 840], [social.image, 1200, 630]]) {
      const dimensions = await sharp(join(root, 'dist', path)).metadata();
      assert.equal(dimensions.width, width, path);
      assert.equal(dimensions.height, height, path);
    }
  });
}
