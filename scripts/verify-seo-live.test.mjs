import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';
import {
  SEO_LIVE_PROBES,
  validateSeoObservation,
  verifySeoLive,
} from './verify-seo-live.mjs';

test('le contrat live couvre les entrées SEO, contact, MCP, OAuth et icônes', () => {
  const paths = SEO_LIVE_PROBES.map(({ path }) => path);
  for (const path of [
    '/sitemap.xml',
    '/contact/',
    '/en/contact/',
    '/.well-known/mcp',
    '/.well-known/oauth-protected-resource',
    '/favicon.ico',
    '/apple-touch-icon.png',
  ]) assert.ok(paths.includes(path), path);
});

const execFileAsync = promisify(execFile);
const SOURCE_SHA = 'a'.repeat(40);

function mockFetch(sourceBody) {
  return async (url, options) => {
    assert.equal(new URL(url).origin, 'https://l0g.fr');
    if (url === 'https://l0g.fr/source.env') {
      return new Response(sourceBody);
    }
    assert.equal(options.method, 'HEAD');
    assert.equal(options.redirect, 'manual');
    const probe = SEO_LIVE_PROBES.find(({ path }) => url === `https://l0g.fr${path}`);
    assert.ok(probe, url);
    const contentType = probe.path.endsWith('.xml') ? 'application/xml'
      : probe.path.includes('.well-known') ? 'application/json'
        : probe.path.endsWith('.ico') || probe.path.endsWith('.png') ? 'image/png' : 'text/html';
    return new Response(null, { status: probe.status, headers: {
      'content-type': contentType,
      ...(probe.location ? { location: probe.location } : {}),
    } });
  };
}

test('le corps distant ne fournit au rapport que 40 caractères hexadécimaux ou null', async (t) => {
  for (const [body, expected] of [
    [`L0G_RELEASE_SOURCE_SHA=${SOURCE_SHA}\n`, SOURCE_SHA],
    [`AUTRE=valeur\r\nL0G_RELEASE_SOURCE_SHA=${SOURCE_SHA}\r\n`, SOURCE_SHA],
    [`L0G_RELEASE_SOURCE_SHA=${SOURCE_SHA}\n<script>payload</script>`, SOURCE_SHA],
    [`L0G_RELEASE_SOURCE_SHA=${SOURCE_SHA}<script>payload</script>`, null],
    [`L0G_RELEASE_SOURCE_SHA=${SOURCE_SHA}a`, null],
    [`L0G_RELEASE_SOURCE_SHA=${SOURCE_SHA.slice(1)}`, null],
    ['L0G_RELEASE_SOURCE_SHA=../../payload.js', null],
    ['L0G_RELEASE_SOURCE_SHA=$(touch payload)', null],
    ['<script>payload</script>', null],
  ]) {
    t.mock.method(globalThis, 'fetch', mockFetch(body));
    const report = await verifySeoLive();
    assert.equal(report.source_commit, expected);
    assert.equal(report.results.length, SEO_LIVE_PROBES.length);
    assert.equal(report.ok, true);
    assert.doesNotMatch(JSON.stringify(report), /payload/);
    t.mock.restoreAll();
  }
});

test('la CLI écrit uniquement son rapport JSON au chemin local demandé', async (t) => {
  const root = await mkdtemp(join(tmpdir(), 'l0g-seo-live-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const moduleUrl = new URL('./verify-seo-live.mjs', import.meta.url);
  const preload = join(root, 'mock-fetch.mjs');
  await writeFile(preload, `import assert from 'node:assert/strict';
const SEO_LIVE_PROBES = ${JSON.stringify(SEO_LIVE_PROBES)};
globalThis.fetch = (${mockFetch.toString()})(${JSON.stringify(`L0G_RELEASE_SOURCE_SHA=${SOURCE_SHA}\n<script>payload</script>`)});
`);
  const output = join(root, 'reports', 'observation.json');
  const { stdout } = await execFileAsync(process.execPath, [
    '--import', preload, fileURLToPath(moduleUrl), '--output', output,
  ]);
  const stored = await readFile(output, 'utf8');
  assert.equal(stored, stdout);
  const report = JSON.parse(stored);
  assert.equal(report.source_commit, SOURCE_SHA);
  assert.equal(report.ok, true);
  assert.doesNotMatch(stored, /payload/);
});

test('les erreurs de statut, location et type sont explicites', () => {
  const probe = { status: 301, location: 'https://l0g.fr/cible', type: /^text\/html/ };
  assert.deepEqual(validateSeoObservation(probe, {
    status: 404,
    location: null,
    content_type: 'application/json',
  }), [
    'status:404!=301',
    'location:(absente)!=https://l0g.fr/cible',
    'content-type:application/json',
  ]);
});
