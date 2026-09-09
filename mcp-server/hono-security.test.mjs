import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import test from 'node:test';
import { Hono } from 'hono';
import { ssgParams, toSSG } from 'hono/ssg';
import { parseBody } from 'hono/utils/body';
import { getQueryParam, getQueryParams } from 'hono/utils/url';

// Dependency-level checks; the l0g server does not call these three helpers.
// SSG uses a recording-only filesystem. Form cases stay below 100 KB.
async function renderStatic(slug) {
  const writes = [];
  const app = new Hono();
  app.get('/pages/:slug', ssgParams([{ slug }]), (c) => c.text('Static content'));
  const result = await toSSG(app, {
    mkdir: async () => {},
    writeFile: async (path, content) => { writes.push({ path: resolve(path), content }); },
  }, { dir: '/bounded-ssg-output', plugins: [] });
  return { ...result, writes };
}

test('SSG rejects consecutive parent segments before any filesystem write', async () => {
  for (const slug of ['nested/a/../../../../outside', 'nested/a/..\\..\\..\\..\\outside']) {
    const result = await renderStatic(slug);
    assert.equal(result.success, false);
    assert.match(result.error?.message || '', /outside the output directory|traversal/i);
    assert.deepEqual(result.writes, []);
  }
});

test('SSG still renders an ordinary static parameter inside its output directory', async () => {
  const result = await renderStatic('ordinary');
  assert.equal(result.success, true);
  assert.deepEqual(result.writes, [{ path: '/bounded-ssg-output/pages/ordinary.txt', content: 'Static content' }]);
});

const requestFor = (body) => new Request('https://example.test/form', { method: 'POST', body });
const nestedKey = (objects) => Array(objects + 1).fill('level').join('.');

test('dot forms accept the nesting boundary and reject deeper URL-encoded and multipart keys', async () => {
  const body = new URLSearchParams({ [nestedKey(32)]: 'value' });
  let parsed = await parseBody(requestFor(body), { dot: true });
  for (let i = 0; i < 33; i += 1) parsed = parsed.level;
  assert.equal(parsed, 'value');
  for (const form of [new URLSearchParams(), new FormData()]) {
    form.append(nestedKey(33), 'value');
    await assert.rejects(parseBody(requestFor(form), { dot: true }), /Nesting limit exceeded/);
  }
});

test('dot forms also cap total objects across many shallow-enough fields', async () => {
  const body = new URLSearchParams();
  // 312 * 32 + 16 = 10,000 objects, then one extra object crosses the cap.
  for (let i = 0; i < 312; i += 1) body.append(`field${i}.${nestedKey(31)}`, 'value');
  body.append(`last.${nestedKey(15)}`, 'value');
  assert(Buffer.byteLength(body.toString()) < 100_000);
  const parsed = await parseBody(requestFor(body), { dot: true });
  assert.equal(Object.keys(parsed).length, 313);
  body.append('extra.value', 'value');
  await assert.rejects(parseBody(requestFor(body), { dot: true }), /Nesting limit exceeded/);
});

test('default literal keys, ordinary nested forms and repeated values remain supported', async () => {
  const literal = nestedKey(100);
  assert.equal((await parseBody(requestFor(new URLSearchParams({ [literal]: 'value' }))))[literal], 'value');
  const parsed = await parseBody(requestFor(new URLSearchParams([
    ['profile.name', 'l0g'], ['tags', 'credit'], ['tags', 'AI'],
  ])), { dot: true, all: true });
  assert.equal(parsed.profile.name, 'l0g');
  assert.deepEqual(parsed.tags, ['credit', 'AI']);
});

test('query helpers stop at fragments in single, multi-value and all-key modes', () => {
  for (const url of [
    'https://example.test/page#section?item=unexpected',
    'https://example.test/page?valid=yes#section&item=unexpected',
  ]) {
    assert.equal(getQueryParam(url, 'item'), undefined);
    assert.equal(getQueryParams(url, 'item'), undefined);
    assert.equal(getQueryParam(url).item, undefined);
    assert.equal(getQueryParams(url).item, undefined);
  }
  const url = 'https://example.test/page?item=one&item=two#section?item=three';
  assert.equal(getQueryParam(url, 'item'), 'one');
  assert.deepEqual(getQueryParams(url, 'item'), ['one', 'two']);
});

test('query helpers preserve encoded delimiters and normal repeated parameters', () => {
  const url = 'https://example.test/page?item=one%23two&item=three+four&key%20name=a%26b';
  assert.equal(getQueryParam(url, 'item'), 'one#two');
  assert.deepEqual(getQueryParams(url, 'item'), ['one#two', 'three four']);
  assert.equal(getQueryParam(url, 'key name'), 'a&b');
});
