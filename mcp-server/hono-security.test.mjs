import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { Hono } from 'hono';
import { serveStatic } from 'hono/serve-static';
import { serveStatic as serveNodeStatic } from '@hono/node-server/serve-static';
import { ssgParams, toSSG } from 'hono/ssg';
import { parseBody } from 'hono/utils/body';
import { getQueryParam, getQueryParams } from 'hono/utils/url';
import { jsx } from 'hono/jsx';
import { renderToString, renderToReadableStream } from 'hono/jsx/dom/server';

// Dependency-level checks; the l0g server does not call these helpers.
// SSG uses a recording-only filesystem. Form cases stay below 100 KB.
test('static serving cannot decode a path past prefix authorization', async () => {
  const reads = [];
  const app = new Hono();
  app.use('/static/admin/*', (c) => c.text('Unauthorized', 401));
  app.use('/static/*', serveStatic({
    getContent: async (path) => { reads.push(path); return 'Public fixture'; },
  }));

  assert.equal((await app.request('/static/admin/secret.txt')).status, 401);
  // GHSA-5r4p-p66f-jhc7: the router and file resolver must agree on the path.
  for (const path of ['/static/%%36%31dmin/secret.txt', '/static/%2Fadmin/secret.txt', '/static/100%25.txt']) {
    assert.equal((await app.request(path)).status, 404);
  }
  assert.deepEqual(reads, []);

  for (const path of ['/static/hello%20world.txt', '/static/%E7%82%8E.txt']) {
    const response = await app.request(path);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'Public fixture');
  }
  assert.deepEqual(reads, ['static/hello world.txt', 'static/炎.txt']);
});

test('Node static adapter rejects second-decoding bypasses before resolving fixture files', async () => {
  // GHSA-rmxm-3fg6-px4f: tiny fake files and direct app.request calls, without TCP.
  const root = mkdtempSync(join(tmpdir(), 'l0g-node-static-'));
  const secret = 'Private test fixture only';
  const resolved = [], found = [];
  try {
    mkdirSync(join(root, 'static', 'admin'), { recursive: true });
    for (const [name, value] of [
      ['admin/secret.txt', secret], ['hello world.txt', 'Public space fixture'],
      ['炎.txt', 'Public Unicode fixture'], ['100%.txt', 'Public percent fixture'],
    ]) writeFileSync(join(root, 'static', name), value);
    const app = new Hono();
    app.use('/static/admin/*', c => c.text('Unauthorized', 401));
    app.use('/static/*', serveNodeStatic({
      root,
      rewriteRequestPath: path => { resolved.push(path); return path; },
      onFound: path => { found.push(path); },
    }));
    for (const path of ['/static/admin/secret.txt', '/static/%61dmin/secret.txt']) {
      const response = await app.request(path);
      assert.equal(response.status, 401);
      assert.equal(await response.text(), 'Unauthorized');
    }
    for (const path of ['/static/%%36%31dmin/secret.txt', '/static/%2Fadmin/secret.txt', '/static/100%25.txt']) {
      const response = await app.request(path);
      assert.equal(response.status, 404);
      assert.notEqual(await response.text(), secret);
    }
    assert.deepEqual(resolved, []);
    assert.deepEqual(found, []);
    for (const [path, value] of [['/static/hello%20world.txt', 'Public space fixture'], ['/static/%E7%82%8E.txt', 'Public Unicode fixture']]) {
      const response = await app.request(path);
      assert.equal(response.status, 200);
      assert.equal(await response.text(), value);
    }
    assert.deepEqual(resolved, ['/static/hello world.txt', '/static/炎.txt']);
    assert.deepEqual(found, [join(root, 'static', 'hello world.txt'), join(root, 'static', '炎.txt')]);
    // Explicit opt-in remains supported for an entirely public fixture directory.
    mkdirSync(join(root, 'public', 'static'), { recursive: true });
    writeFileSync(join(root, 'public', 'static', '100%.txt'), 'Public percent fixture');
    const publicApp = new Hono();
    publicApp.use('/static/*', serveNodeStatic({ root: join(root, 'public'), allowPercentInPath: true }));
    const percent = await publicApp.request('/static/100%25.txt');
    assert.equal(percent.status, 200);
    assert.equal(await percent.text(), 'Public percent fixture');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

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

test('JSX server rendering escapes untrusted text at the root in string and stream modes', async () => {
  const text = '<img src=x onerror=alert(1)>&';
  const escaped = '&lt;img src=x onerror=alert(1)&gt;&amp;';
  assert.equal(renderToString(text), escaped);
  assert.equal(await new Response(await renderToReadableStream(text)).text(), escaped);
});

test('JSX server rendering preserves controlled elements and escapes their text children', async () => {
  const element = jsx('span', {}, 'safe < & >');
  const expected = '<span>safe &lt; &amp; &gt;</span>';
  assert.equal(renderToString(element), expected);
  assert.equal(await new Response(await renderToReadableStream(element)).text(), expected);
});
