import assert from 'node:assert/strict';
import test from 'node:test';
import { buildPaginationItems } from '../src/lib/pagination.ts';
import { publicationEntries, publicationPage, publicationPageHref, PUBLICATIONS_PER_PAGE } from '../src/config/publication-catalog.mjs';

const compact = (currentPage, totalPages) => buildPaginationItems(currentPage, totalPages)
  .map((item) => item.type === 'page' ? item.page : '…');

test('keeps short archives fully navigable', () => {
  assert.deepEqual(compact(4, 7), [1, 2, 3, 4, 5, 6, 7]);
});

test('shows the leading window and final page on the first page', () => {
  assert.deepEqual(compact(1, 17), [1, 2, 3, 4, 5, '…', 17]);
});

test('keeps the current page in a compact middle window', () => {
  assert.deepEqual(compact(9, 17), [1, '…', 8, 9, 10, '…', 17]);
});

test('shows the trailing window and first page on the last page', () => {
  assert.deepEqual(compact(17, 17), [1, '…', 13, 14, 15, 16, 17]);
});

test('stays bounded for very large archives', () => {
  const items = compact(2_500, 5_000);
  assert.deepEqual(items, [1, '…', 2_499, 2_500, 2_501, '…', 5_000]);
  assert.equal(items.length, 7);
});

test('rejects impossible archive states', () => {
  assert.throws(() => buildPaginationItems(0, 17), /Invalid pagination state/);
  assert.throws(() => buildPaginationItems(18, 17), /Invalid pagination state/);
});

for (const lang of ['fr', 'en']) {
  test(`${lang}: every publication appears once across bounded catalogue pages, in editorial order`, () => {
    const entries = publicationEntries(lang);
    const { totalPages } = publicationPage(lang);
    const pages = Array.from({ length: totalPages }, (_, index) => publicationPage(lang, index + 1));
    assert.deepEqual(pages.flatMap((page) => page.items), entries);
    assert.equal(new Set(entries.map((entry) => entry.id)).size, entries.length);
    for (const page of pages) {
      assert.ok(page.items.length > 0 && page.items.length <= PUBLICATIONS_PER_PAGE);
      assert.equal(page.end - page.start + 1, page.items.length);
      assert.equal(page.total, entries.length);
    }
    assert.equal(pages.at(-1).end, entries.length);
  });

  test(`${lang}: page one retains its canonical catalogue URL`, () => {
    const base = lang === 'en' ? '/en/publications/' : '/publications/';
    assert.equal(publicationPageHref(lang, 1), base);
    assert.equal(publicationPageHref(lang, 2), `${base}page/2/`);
  });

  test(`${lang}: invalid or out-of-range catalogue pages are rejected`, () => {
    const { totalPages } = publicationPage(lang);
    for (const page of [0, -1, 1.5, NaN, Infinity, '2', totalPages + 1]) {
      assert.throws(() => publicationPage(lang, page), /Invalid publication page/);
    }
    for (const page of [0, -1, 1.5, NaN, Infinity]) {
      assert.throws(() => publicationPageHref(lang, page), /Invalid publication page/);
    }
  });
}

test('English pagination omits French-only editions and preserves the complete final slice', () => {
  const fr = publicationEntries('fr').map((entry) => entry.id);
  const en = publicationEntries('en').map((entry) => entry.id);
  for (const id of ['commerce-traces', 'digital-identity', 'auditer-opacite']) {
    assert.ok(fr.includes(id));
    assert.ok(!en.includes(id));
  }
  const { totalPages } = publicationPage('en');
  const last = publicationPage('en', totalPages);
  assert.deepEqual(last.items.map((entry) => entry.id), en.slice((totalPages - 1) * PUBLICATIONS_PER_PAGE));
  assert.equal(last.items.length, en.length % PUBLICATIONS_PER_PAGE || PUBLICATIONS_PER_PAGE);
  assert.throws(() => publicationEntries('de'), /Unsupported publication language/);
  assert.throws(() => publicationPageHref('de', 1), /Unsupported publication language/);
});
