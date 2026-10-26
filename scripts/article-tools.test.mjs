import assert from 'node:assert/strict';
import test from 'node:test';
import { articleToolUrl, articleReferenceId, articleExcerpt } from '../src/lib/article-tools.ts';

const page = 'https://l0g.fr/posts/example/';
test('reading previews reject active schemes, credentials, malformed URLs and control characters', () => {
  for (const value of ['javascript:alert(1)', 'data:text/html,<script>', 'file:///tmp/source', 'https://name:secret@example.org/', 'https://[', '\nhttps://example.org/', 'java\tscript:alert(1)']) {
    assert.equal(articleToolUrl(value, page), null, value);
  }
  assert.equal(articleToolUrl('https://ecb.europa.eu/report.pdf#page=3', page)?.href, 'https://ecb.europa.eu/report.pdf#page=3');
  assert.equal(articleToolUrl('/glossaire/#repo', page)?.href, 'https://l0g.fr/glossaire/#repo');
});

test('only same-document source and footnote anchors become source previews', () => {
  for (const id of ['source-s01', 'source-12', 'source-m1', 'ref-2', 'user-content-fn-1', 'fn-note', 'S03']) {
    assert.equal(articleReferenceId(`#${id}`, page), id);
  }
  for (const href of ['https://other.org/posts/example/#source-1', '/posts/elsewhere/#source-1', '?page=2#source-1', '#section-1', '#user-content-fnref-1', '#%E0%A4%A']) {
    assert.equal(articleReferenceId(href, page), null, href);
  }
});

test('copied excerpts preserve wording and link to an existing section without tracking parameters', () => {
  const copied = articleExcerpt('  Premier paragraphe.\n\nSecond paragraphe.  ', 'Titre de l’analyse', `${page}?tracking=1#old`, 'échelle-et-risque');
  assert.equal(copied, `« Premier paragraphe.\n\nSecond paragraphe. »\n\nTitre de l’analyse\n${page}#%C3%A9chelle-et-risque`);
  assert.equal(articleExcerpt('A quotation.', 'Analysis', page, '', true), `“A quotation.”\n\nAnalysis\n${page}`);
});

test('empty or oversized selections fail without silent truncation', () => {
  assert.equal(articleExcerpt('   ', 'Title', page, ''), null);
  assert.equal(articleExcerpt('x'.repeat(12001), 'Title', page, ''), null);
  assert.equal(articleExcerpt('text', 'Title', 'javascript:alert(1)', ''), null);
});
