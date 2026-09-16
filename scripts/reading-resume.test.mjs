import assert from 'node:assert/strict';
import test from 'node:test';
import {
  READING_STORAGE_KEY, READING_MAX_AGE, READING_MAX_ENTRIES,
  readReadingPositions, writeReadingPosition, readingProgress,
} from '../src/lib/reading-position.ts';

const now = Date.UTC(2026, 8, 16);
const position = (changes = {}) => ({
  path: '/posts/example/', revision: '0123456789abcdef', block: 4,
  fraction: 0.3, progress: 0.4, savedAt: now, ...changes,
});
function storage(raw) {
  const values = new Map(raw === undefined ? [] : [[READING_STORAGE_KEY, raw]]);
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}
const encoded = (positions) => JSON.stringify({ version: 1, positions });

test('positions remain separate for articles and language versions', () => {
  const store = storage();
  const fr = position();
  const en = position({ path: '/en/analysis/example/' });
  assert.equal(writeReadingPosition(store, fr.path, fr, now), true);
  assert.equal(writeReadingPosition(store, en.path, en, now), true);
  assert.deepEqual(readReadingPositions(store, now), [en, fr]);
  writeReadingPosition(store, fr.path, null, now);
  assert.deepEqual(readReadingPositions(store, now), [en]);
});

test('removing the final position leaves no reading storage key', () => {
  const store = storage(encoded([position()]));
  store.setItem('l0g-theme', 'dark');
  writeReadingPosition(store, position().path, null, now);
  assert.equal(store.getItem(READING_STORAGE_KEY), null);
  assert.equal(store.getItem('l0g-theme'), 'dark');
});

test('expired positions, future timestamps and extra fields are not retained', () => {
  const store = storage(encoded([
    position({ path: '/posts/expired/', savedAt: now - READING_MAX_AGE }),
    position({ path: '/posts/future/', savedAt: now + 1 }),
    position({ extra: 'untrusted content' }),
  ]));
  assert.deepEqual(readReadingPositions(store, now), [position()]);
  writeReadingPosition(store, '/posts/absent/', null, now);
  assert.deepEqual(JSON.parse(store.getItem(READING_STORAGE_KEY)).positions, [position()]);
});

test('invalid or oversized storage fails closed without preventing reading', () => {
  for (const raw of ['{', 'null', '[]', '{"version":2,"positions":[]}', 'x'.repeat(32769)]) {
    assert.deepEqual(readReadingPositions(storage(raw), now), []);
  }
  const denied = {
    getItem() { throw new Error('denied'); },
    setItem() { throw new Error('quota'); },
    removeItem() { throw new Error('denied'); },
  };
  assert.deepEqual(readReadingPositions(denied, now), []);
  assert.equal(writeReadingPosition(denied, position().path, position(), now), false);
  assert.equal(writeReadingPosition(denied, position().path, null, now), false);
});

test('untrusted paths and out-of-range coordinates cannot become bookmarks', () => {
  for (const changes of [
    { path: 'https://example.org/posts/example/' }, { path: '//example.org/' },
    { path: '/posts/../rgpd/' }, { path: '/posts/example/?token=anything' },
    { path: '/posts/example/#fragment' }, { path: '/posts/<script>/' },
    { revision: '<img src=x>' }, { block: -1 }, { block: 0.5 }, { block: 10000 },
    { fraction: -0.1 }, { fraction: 1.01 }, { fraction: Infinity },
    { progress: 0 }, { progress: 1 }, { progress: NaN }, { savedAt: 'today' },
  ]) {
    const item = position(changes);
    assert.deepEqual(readReadingPositions(storage(encoded([item])), now), [], JSON.stringify(changes));
    assert.equal(writeReadingPosition(storage(), item.path, item, now), false);
  }
  assert.equal(writeReadingPosition(storage(), '/posts/other/', position(), now), false);
});

test('the 20 most recent articles are retained and duplicate paths collapse', () => {
  const entries = Array.from({ length: 30 }, (_, index) => position({ path: `/posts/article-${index}/`, savedAt: now - index }));
  const store = storage(encoded([...entries, position({ path: entries[0].path, savedAt: now - 100 })]));
  assert.deepEqual(readReadingPositions(store, now), entries.slice(0, READING_MAX_ENTRIES));
  writeReadingPosition(store, position().path, position(), now);
  const saved = readReadingPositions(store, now);
  assert.equal(saved.length, READING_MAX_ENTRIES);
  assert.deepEqual(saved[0], position());
  assert.equal(saved.filter((item) => item.path === entries[0].path).length, 1);
});

test('progress measures the article body, independent of headers and footers', () => {
  assert.equal(readingProgress(1200, 4000, 800), 0);
  assert.equal(readingProgress(0, 4000, 800), 0);
  assert.equal(readingProgress(-1600, 4000, 800), 0.5);
  assert.equal(readingProgress(-3200, 4000, 800), 1);
  assert.equal(readingProgress(-6000, 4000, 800), 1);
  assert.equal(readingProgress(40, 500, 800), 0);
  assert.equal(readingProgress(0, 500, 800), 1);
  for (const args of [[0, 0, 800], [0, NaN, 800], [0, 4000, 0], [Infinity, 4000, 800]]) {
    assert.equal(readingProgress(...args), 0);
  }
});
