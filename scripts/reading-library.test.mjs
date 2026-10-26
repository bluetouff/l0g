import assert from 'node:assert/strict';
import test from 'node:test';
import {
  LIBRARY_STORAGE_KEY, LIBRARY_MAX_ENTRIES, LIBRARY_MAX_STORAGE_CHARS,
  readSavedArticles, writeSavedArticle,
} from '../src/lib/reading-library.ts';
import {
  READING_STORAGE_KEY, READING_MAX_STORAGE_CHARS,
  readReadingPositions, writeReadingPosition,
} from '../src/lib/reading-position.ts';

const now = Date.UTC(2026, 9, 26);
const article = (changes = {}) => ({ path: '/posts/example/', title: 'Example analysis', savedAt: now, ...changes });
const position = (changes = {}) => ({ path: '/posts/example/', revision: '0123456789abcdef', block: 4, fraction: .2, progress: .4, savedAt: now, ...changes });
function storage(raw) {
  const values = new Map(raw === undefined ? [] : [[LIBRARY_STORAGE_KEY, raw]]);
  return {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  };
}
const encoded = (articles) => JSON.stringify({ version: 1, articles });

test('saved analyses keep language variants separate and retain only allowed metadata', () => {
  const store = storage();
  const fr = article();
  const en = article({ path: '/en/analysis/example/', title: 'English analysis' });
  assert.equal(writeSavedArticle(store, fr.path, { ...fr, body: 'Never persist article contents', image: 'https://example.org/image.jpg' }, now), true);
  assert.equal(writeSavedArticle(store, en.path, en, now), true);
  assert.deepEqual(readSavedArticles(store, now), [en, fr]);
  assert.deepEqual(JSON.parse(store.getItem(LIBRARY_STORAGE_KEY)).articles, [en, fr]);
  assert.equal(writeSavedArticle(store, fr.path, null, now), true);
  assert.deepEqual(readSavedArticles(store, now), [en]);
});

test('removing final saved analysis removes only its own storage key', () => {
  const store = storage(encoded([article()]));
  store.setItem('l0g-theme', 'dark');
  store.setItem(READING_STORAGE_KEY, 'positions');
  assert.equal(writeSavedArticle(store, article().path, null, now), true);
  assert.equal(store.getItem(LIBRARY_STORAGE_KEY), null);
  assert.equal(store.getItem('l0g-theme'), 'dark');
  assert.equal(store.getItem(READING_STORAGE_KEY), 'positions');
});

test('external, traversal, query, encoded and malformed paths cannot enter the library', () => {
  for (const path of [
    'https://evil.example/posts/example/', '//evil.example/posts/example/', 'javascript:alert(1)',
    '/posts/../example/', '/posts/%2e%2e/', '/posts/example/?a=1', '/posts/example/#id',
    '/posts/a\\b/', '/posts/<img>/', '/posts/example/\n', '/en/analysis/', '/guides/example/',
    `/posts/${'a'.repeat(251)}/`,
  ]) {
    assert.deepEqual(readSavedArticles(storage(encoded([article({ path })])), now), [], path);
    assert.equal(writeSavedArticle(storage(), path, article({ path }), now), false, path);
    assert.equal(writeSavedArticle(storage(), path, null, now), false, path);
  }
  assert.equal(writeSavedArticle(storage(), '/posts/other/', article(), now), false);
});

test('malformed or oversized storage remains harmless and does not throw', () => {
  for (const raw of ['{', 'null', '[]', '"articles"', '{"version":2,"articles":[]}', '{"version":1,"articles":{}}', 'x'.repeat(LIBRARY_MAX_STORAGE_CHARS + 1)]) {
    assert.deepEqual(readSavedArticles(storage(raw), now), []);
  }
  for (const changes of [{ savedAt: now + 1 }, { savedAt: -1 }, { savedAt: 'today' }, { savedAt: null }, { title: {} }, { title: '' }, { title: ' \n ' }]) {
    assert.deepEqual(readSavedArticles(storage(encoded([article(changes)])), now), []);
    assert.equal(writeSavedArticle(storage(), article().path, article(changes), now), false);
  }
});

test('browser read, write and removal failures are reported without throwing', () => {
  const denied = {
    getItem() { throw new Error('denied'); },
    setItem() { throw new Error('quota'); },
    removeItem() { throw new Error('denied'); },
  };
  assert.deepEqual(readSavedArticles(denied, now), []);
  assert.equal(writeSavedArticle(denied, article().path, article(), now), false);
  assert.equal(writeSavedArticle(denied, article().path, null, now), false);
  const quota = { ...storage(), setItem() { throw new Error('quota'); } };
  assert.equal(writeSavedArticle(quota, article().path, article(), now), false);
  assert.deepEqual(readSavedArticles(quota, now), []);
});

test('the 30 most recent saved analyses are retained, with one entry per path', () => {
  const entries = Array.from({ length: 35 }, (_, index) => article({ path: `/posts/article-${index}/`, savedAt: now - index }));
  const store = storage(encoded([...entries, article({ savedAt: now - 100, path: entries[0].path })]));
  assert.deepEqual(readSavedArticles(store, now), entries.slice(0, LIBRARY_MAX_ENTRIES));
  assert.equal(writeSavedArticle(store, article().path, article(), now), true);
  assert.deepEqual(readSavedArticles(store, now), [article(), ...entries.slice(0, LIBRARY_MAX_ENTRIES - 1)]);
});

test('title whitespace and length are bounded without persisting unrelated fields', () => {
  const store = storage();
  const value = article({ title: `  A\u0000\tB\n${'x'.repeat(500)} `, extra: { anything: true } });
  assert.equal(writeSavedArticle(store, value.path, value, now), true);
  const [saved] = readSavedArticles(store, now);
  assert.equal(saved.title.length, 160);
  assert.equal(saved.title.startsWith('A B x'), true);
  assert.equal(Object.keys(saved).length, 3);
});

test('saved articles and reading positions together stay within 32 KiB of UTF-16 metadata', () => {
  const store = storage();
  const title = 'É'.repeat(160);
  for (let index = 0; index < 40; index++) {
    const path = `/posts/${String(index).padEnd(242, 'a')}/`;
    assert.equal(writeSavedArticle(store, path, article({ path, title }), now), true);
    assert.equal(writeReadingPosition(store, path, position({ path, title }), now), true);
  }
  const library = store.getItem(LIBRARY_STORAGE_KEY);
  const positions = store.getItem(READING_STORAGE_KEY);
  assert.ok(library.length <= LIBRARY_MAX_STORAGE_CHARS);
  assert.ok(positions.length <= READING_MAX_STORAGE_CHARS);
  assert.ok((library.length + positions.length) * 2 <= 32768);
  assert.equal(readSavedArticles(store, now)[0].path, `/posts/${'39'.padEnd(242, 'a')}/`);
  assert.equal(readReadingPositions(store, now)[0].title, title);
});

test('legacy reading positions remain valid while new metadata preserves revision and coordinates', () => {
  const store = storage();
  const legacy = position();
  store.setItem(READING_STORAGE_KEY, JSON.stringify({ version: 1, positions: [legacy] }));
  assert.deepEqual(readReadingPositions(store, now), [legacy]);
  const value = { ...legacy, title: '  Analysis\n title ', body: 'Must not be saved' };
  assert.equal(writeReadingPosition(store, value.path, value, now), true);
  assert.deepEqual(readReadingPositions(store, now), [{ ...legacy, title: 'Analysis title' }]);
  assert.deepEqual(JSON.parse(store.getItem(READING_STORAGE_KEY)).positions, [{ ...legacy, title: 'Analysis title' }]);
});
