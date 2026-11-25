import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { fromHtml } from 'hast-util-from-html';
import { XMLValidator } from 'fast-xml-parser';
import { nvidiaVolumeTwoEditions } from '../src/config/nvidia-volume-two-publication.mjs';
import { extractNvidiaVolumeTwoBody, offlineNvidiaVolumeTwoSvg, renderNvidiaVolumeTwoBody } from './generate-nvidia-volume-two-epub.mjs';

const chapter = { number: 13, title: 'Title', route: '/posts/test/', chapter: 'ch002.xhtml' };
const tree = source => fromHtml(source, { fragment: true }).children[0];
const nodes = node => [node, ...(node.children ?? []).flatMap(nodes)];
const digest = value => createHash('sha256').update(value).digest('hex');
const svg = (width, description, rect = '<rect width="5" height="8" fill="var(--color-signal)"/>') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 16"><desc>${description}</desc>${rect}</svg>`;

test('published article conversion preserves prose and notices with one compact SVG scene', () => {
  const source = '<!doctype html><html><head><link rel="canonical" href="https://l0g.fr/posts/test/"></head><body>' +
    '<aside>Site chrome</aside><article><h1>Title</h1><div data-reading-body><p>Named <a href="#source-S01">[S01]</a>.</p>' +
    `<figure>${svg(600, 'Wide')}${svg(320, 'Compact')}<figcaption>Evidence</figcaption></figure>` +
    '<ol class="sources-list"><li id="source-S01"><details><summary>Source</summary><p>Scope.</p></details></li></ol>' +
    '</div></article></body></html>';
  const input = extractNvidiaVolumeTwoBody(source, chapter);
  const output = renderNvidiaVolumeTwoBody(input, chapter);
  assert.equal(output.figures.length, 1);
  assert.equal(output.assets.length, 1);
  assert.match(output.assets[0].data, /viewBox="0 0 320 16".*Compact.*fill="#5eead4"/u);
  assert.equal(output.figures[0].caption, 'Evidence');
  assert.deepEqual(output.sourceIds, ['source-S01']);
  assert.equal(output.textSha256, digest('Named [S01].EvidenceSourceScope.'));
  assert.throws(() => extractNvidiaVolumeTwoBody(source, { ...chapter, route: '/posts/other/' }), /canonical/);
});

test('converter rejects execution, remote SVG resources and broken local paint references', () => {
  assert.throws(() => renderNvidiaVolumeTwoBody(tree('<div><a href="java&#x73;cript:alert(1)">Bad</a></div>'), chapter), /protocol/);
  assert.throws(() => renderNvidiaVolumeTwoBody(tree('<div><script>bad()</script></div>'), chapter), /Unexpected article body node/);
  assert.throws(() => offlineNvidiaVolumeTwoSvg(tree(svg(320, 'Test', '<script>bad()</script>'))), /Unexpected offline SVG node/);
  assert.throws(() => offlineNvidiaVolumeTwoSvg(tree(svg(320, 'Test', '<use href="https://elsewhere.invalid/#shape"/>'))), /External or broken SVG reference/);
  assert.throws(() => offlineNvidiaVolumeTwoSvg(tree(svg(320, 'Test', '<rect fill="url(#missing)"/>'))), /Unexpected offline SVG paint/);
});

for (const book of Object.values(nvidiaVolumeTwoEditions)) {
  test(`checked-in ${book.lang} edition preserves the exact captured text and has no global reading resources`, () => {
    const root = new URL(`../src/epub/${book.directory}/EPUB/`, import.meta.url);
    const read = path => readFileSync(new URL(path, root), 'utf8');
    const provenance = JSON.parse(read('provenance.json'));
    assert.equal(provenance.lang, book.lang);
    assert.equal(provenance.modified, book.modified);
    assert.match(provenance.deployedSourceSha, /^[a-f0-9]{40}$/u);
    assert.equal(provenance.sourceArticles.length, 14);
    assert.equal(provenance.sourceArticles.reduce((sum, entry) => sum + entry.figures.length, 0), 25);
    assert.equal(provenance.sourceArticles.reduce((sum, entry) => sum + entry.references.length, 0), 157);
    const usedAssets = ['cover.jpg'];
    for (const [index, source] of provenance.sourceArticles.entries()) {
      const configured = book.chapters[index];
      assert.equal(source.number, configured.number);
      assert.equal(source.sourceSha256, configured.sha256);
      assert.equal(source.canonical, `https://l0g.fr${configured.route}`);
      const content = read(`text/${configured.chapter}`);
      assert.equal(XMLValidator.validate(content), true);
      const chapterSection = nodes(fromHtml(content)).find(node => node.properties?.id === `chapter-${source.number}`);
      const body = chapterSection.children.at(-1);
      assert.equal(body.tagName, 'div');
      const monolithic = nodes(body).filter(node => node.type === 'text').map(node => node.value).join('');
      assert.equal(digest(monolithic), source.bodyTextSha256);
      assert.deepEqual(nodes(body).filter(node => node.tagName === 'li' && /^source-/u.test(node.properties.id)).map(node => node.properties.id), source.references);
      assert.deepEqual(nodes(body).filter(node => node.tagName === 'img').map(node => node.properties.src), source.figures.map(figure => `../media/${figure.filename}`));
      for (const figure of source.figures) {
        const saved = read(`media/${figure.filename}`);
        assert.equal(digest(saved), figure.epubSha256);
        assert.equal(XMLValidator.validate(saved), true);
        usedAssets.push(figure.filename);
      }
    }
    assert.deepEqual(readdirSync(new URL('media/', root)).sort(), usedAssets.sort());
  });
}
