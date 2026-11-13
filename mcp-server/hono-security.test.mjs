import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createServer, request } from 'node:http';
import test from 'node:test';
import { Hono } from 'hono';
import { csrf } from 'hono/csrf';
import { validator } from 'hono/validator';
import { getRequestListener } from '@hono/node-server';
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

test('mount preserves authorization across encoded backslashes and parent segments', async () => {
  // GHSA-4m76-xfj5-7975: a tiny mounted application, without network or filesystem access.
  const mounted = new Hono();
  mounted.get('/admin/secret', c => c.text('Private fixture'));
  mounted.get('/public', c => c.text('Public fixture'));
  const app = new Hono();
  app.use('/app/admin/*', c => c.text('Unauthorized', 401));
  app.mount('/app', mounted.fetch);
  assert.equal((await app.request('/app/admin/secret')).status, 401);
  const publicResponse = await app.request('/app/public');
  assert.equal(publicResponse.status, 200);
  assert.equal(await publicResponse.text(), 'Public fixture');
  const attack = await app.request('/app/public%5C..%5Cadmin/secret');
  assert.equal(attack.status, 404);
  assert.notEqual(await attack.text(), 'Private fixture');
});

test('wildcard middleware also guards not-found requests containing encoded line terminators', async () => {
  // GHSA-h7mg-cq63-vhpq: exercise the default SmartRouter, including its not-found path.
  const app = new Hono();
  app.use('*', async (c, next) => { c.header('X-Fixture-Guard', 'ran'); await next(); });
  app.notFound(c => c.text('Missing fixture', 404));
  for (const path of ['/ordinary', '/%0A', '/%0D', '/%E2%80%A8', '/%E2%80%A9']) {
    const response = await app.request(path);
    assert.equal(response.status, 404);
    assert.equal(response.headers.get('X-Fixture-Guard'), 'ran', path);
  }
});

test('CSRF rejects cross-site text/ping while retaining same-origin requests', async () => {
  // GHSA-46wx-v44x-9hh2: hyperlink auditing is browser-sendable despite not being an HTML form.
  const app = new Hono();
  app.use('*', csrf());
  app.post('/change', c => c.text('Changed fixture'));
  for (const [origin, site, expected] of [
    ['https://evil.example', 'cross-site', 403],
    ['https://example.test', 'same-origin', 200],
  ]) {
    const response = await app.request('https://example.test/change', {
      method: 'POST', body: 'PING',
      headers: { origin, 'sec-fetch-site': site, 'content-type': 'text/ping' },
    });
    assert.equal(response.status, expected);
  }
});

test('multipart validation sees fields with legal extra parameters and whitespace', async () => {
  // GHSA-4h7h-rv7c-7m2v / GHSA-92p4-j3wq-jmqx: validator and parser must see the same fields.
  const app = new Hono();
  app.post('/upload', validator('form', (value, c) => value.forbidden ? c.text('Rejected', 400) : value),
    async c => c.json(await c.req.parseBody()));
  for (const variant of ['ordinary', 'charset', 'whitespace', 'space-before-semicolon', 'quoted-semicolon']) {
    for (const field of ['forbidden', 'allowed']) {
      const form = new FormData();
      form.set(field, 'Fixture');
      const input = new Request('https://example.test/upload', { method: 'POST', body: form });
      const contentType = input.headers.get('content-type');
      if (variant === 'charset') input.headers.set('content-type', `${contentType}; charset=utf-8`);
      if (variant === 'whitespace') input.headers.set('content-type', contentType.replace('; boundary=', ';  boundary='));
      if (variant === 'space-before-semicolon') input.headers.set('content-type', contentType.replace('multipart/form-data;', 'multipart/form-data ;'));
      if (variant === 'quoted-semicolon') input.headers.set('content-type', `${contentType}; foo="a;b"`);
      const response = await app.request(input);
      assert.equal(response.status, field === 'forbidden' ? 400 : 200, `${variant}: ${field}`);
      if (field === 'allowed') assert.deepEqual(await response.json(), { allowed: 'Fixture' });
    }
  }
});

test('Node adapter rejects raw path backslashes before calling the application', async t => {
  // GHSA-jpvv-r467-5p4w: node:http preserves the raw target that fetch/URL would normalize.
  const seen = [];
  const server = createServer(getRequestListener(req => {
    seen.push(req.url);
    return new Response('Public fixture');
  }, { overrideGlobalObjects: false }));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => server.close(resolve)));
  const send = path => new Promise((resolve, reject) => {
    const input = request({ host: '127.0.0.1', port: server.address().port, path,
      headers: { connection: 'close' } }, response => {
      response.resume();
      response.on('end', () => resolve(response.statusCode));
    });
    input.setTimeout(1500, () => input.destroy(new Error('Fixture request timed out')));
    input.on('error', reject);
    input.end();
  });
  for (const path of ['/admin\\secret', '/public\\..\\admin/secret', '/admin\\secret?next=public']) {
    assert.equal(await send(path), 400, path);
  }
  assert.deepEqual(seen, []);
  for (const path of ['/mcp/compact', '/admin%5Csecret', '/public?q=\\admin\\secret']) {
    assert.equal(await send(path), 200, path);
    assert.equal(seen.at(-1), `http://127.0.0.1:${server.address().port}${path}`);
  }
  assert.equal(seen.length, 3);
});

test('asynchronous WebSocket upgrades survive TCP resets and keep serving', () => {
  // GHSA-qv5m-9pm6-hqp3: isolate a potential process crash and bound the entire probe.
  // A recording-only WebSocketServerLike must never handshake an abandoned socket.
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    import { EventEmitter } from 'node:events';
    import { connect } from 'node:net';
    import { Hono } from 'hono';
    import { createAdaptorServer, upgradeWebSocket } from '@hono/node-server';
    const wss = new EventEmitter();
    wss.options = { noServer: true };
    wss.close = () => {}; // The recording-only server owns no WebSocket connections.
    let handshakes = 0, entered, release;
    wss.handleUpgrade = () => { handshakes++; throw new Error('Handshake on an abandoned socket'); };
    const app = new Hono();
    app.use('/ws', async (_c, next) => {
      const gate = new Promise(resolve => { release = resolve; });
      entered();
      await gate;
      await next();
    });
    app.get('/ws', upgradeWebSocket(() => ({})));
    app.get('/health', c => c.text('Healthy fixture'));
    const server = createAdaptorServer({ fetch: app.fetch, websocket: { server: wss } });
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    const port = server.address().port;
    try {
      for (let attempt = 0; attempt < 2; attempt++) {
        const running = new Promise(resolve => { entered = resolve; });
        const socket = connect(port, '127.0.0.1', () => socket.write(
          'GET /ws HTTP/1.1\\r\\nHost: 127.0.0.1:' + port + '\\r\\n' +
          'Upgrade: websocket\\r\\nConnection: Upgrade\\r\\n' +
          'Sec-WebSocket-Version: 13\\r\\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\\r\\n\\r\\n'
        ));
        const closed = new Promise(resolve => socket.once('close', resolve));
        socket.on('error', () => {}); // Only the resetting client, never the server.
        await running;
        socket.resetAndDestroy();
        await closed;
        await new Promise(resolve => setTimeout(resolve, 30));
        release();
        await new Promise(resolve => setTimeout(resolve, 150));
        assert.equal(handshakes, 0);
        const response = await fetch('http://127.0.0.1:' + port + '/health', {
          headers: { connection: 'close' }, signal: AbortSignal.timeout(1000),
        });
        assert.equal(response.status, 200);
        assert.equal(await response.text(), 'Healthy fixture');
      }
    } finally {
      await new Promise(resolve => server.close(resolve));
    }
  `], { cwd: new URL('./', import.meta.url), timeout: 5000, encoding: 'utf8', maxBuffer: 64 * 1024 });
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr);
});
