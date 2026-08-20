import assert from 'node:assert/strict';
import test from 'node:test';
import { buildPaginationItems } from '../src/lib/pagination.ts';

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
