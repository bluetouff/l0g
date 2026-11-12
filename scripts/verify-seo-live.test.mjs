import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import test from 'node:test';
import { legacySurfaceRedirects } from '../src/config/legacy-surface-redirects.mjs';
import {
  SEO_LIVE_PROBES,
  validateSeoObservation,
  verifySeoLive,
} from './verify-seo-live.mjs';

test('le contrat live couvre les entrées SEO, contact, MCP, OAuth et icônes', () => {
  const paths = SEO_LIVE_PROBES.map(({ path }) => path);
  for (const path of [
    '/sitemap.xml',
    '/og/le-grand-peage-de-la-facture-1-le-portail-ampute.png',
    '/og/le-grand-peage-de-la-facture-3-le-prix-du-gratuit.png',
    '/contact/',
    '/en/contact/',
    '/.well-known/mcp',
    '/.well-known/oauth-protected-resource',
    '/favicon.ico',
    '/apple-touch-icon.png',
    '/visite-guidee/',
    '/posts/athora-bilan-apollo-non-consolide/',
    '/en/analysis/athora-the-balance-sheet-apollo-does-not-consolidate/',
    '/fonts/jlr/LICENSE-inter.txt',
    '/fonts/jlr/LICENSE-jetbrains-mono.txt',
    '/fonts/hebdo/OFL.txt',
    '/robots.txt',
    '/llms-full.txt',
  ]) assert.ok(paths.includes(path), path);
  assert.equal(new Set(paths).size, paths.length, 'Une seule observation par chemin');
});

test('Apache redirige chaque ancienne surface en un saut sans capturer ses descendants', async () => {
  const source = await readFile(new URL('../deploy/l0g.fr.apache.conf', import.meta.url), 'utf8');
  const rules = [...source.matchAll(/^\s*RedirectMatch 301 "([^"]+)" "([^"]+)"\s*$/gm)]
    .map(([, pattern, destination]) => ({ pattern: new RegExp(pattern), destination }));
  for (const [from, to] of Object.entries(legacySurfaceRedirects)) {
    for (const path of [from, `${from}/`]) {
      const matches = rules.filter(({ pattern }) => pattern.test(path));
      assert.equal(matches.length, 1, `${path}: une seule redirection serveur`);
      assert.equal(new URL(path.replace(matches[0].pattern, matches[0].destination), 'https://l0g.fr').href,
        new URL(to, 'https://l0g.fr').href, path);
      const probe = SEO_LIVE_PROBES.find((probe) => probe.path === path);
      assert.equal(probe?.status, 301, `${path}: contrat HTTP public`);
      assert.equal(probe.location, new URL(to, 'https://l0g.fr').href, path);
    }
    for (const path of [`${from}/suite`, `/prefixe${from}`]) {
      assert.equal(rules.some(({ pattern }) => pattern.test(path)), false, path);
    }
  }
});

test('la directive Apache noindex ne vise que les licences de polices', async () => {
  const source = await readFile(new URL('../deploy/l0g.fr.apache.conf', import.meta.url), 'utf8');
  const blocks = [...source.matchAll(/<LocationMatch "([^"]+)">([\s\S]*?)<\/LocationMatch>/g)]
    .filter(([, pattern]) => pattern.startsWith('^/fonts/'));
  assert.equal(blocks.length, 1, 'Une seule règle pour les licences de polices');
  const [, expression, body] = blocks[0];
  const pattern = new RegExp(expression);
  assert.match(body, /^\s*Header always set X-Robots-Tag "noindex"\s*$/);
  const fontFiles = await readdir(new URL('../public/fonts/', import.meta.url), { recursive: true });
  const licences = fontFiles.filter((path) => /\.txt$/.test(path));
  assert.ok(licences.length > 0);
  for (const path of licences) assert.equal(pattern.test(`/fonts/${path}`), true, path);
  for (const path of [
    '/robots.txt', '/llms.txt', '/llms-full.txt', '/llms-full-en.txt', '/.well-known/security.txt',
    '/publications/LICENSE.txt', '/fonts/jlr/README.txt', '/fonts/jlr/sources.txt',
    '/fonts/hebdo/InstrumentSerif-Regular.ttf', '/fonts/jlr/LICENSE-inter.woff2',
    '/fonts/jlr/LICENSE-inter.txt/suite', '/fonts/jlr/LICENSE-interXtxt',
    '/fonts/jlr/sous-dossier/LICENSE.txt', '/fonts/../LICENSE.txt',
  ]) assert.equal(pattern.test(path), false, path);
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
    const contentType = probe.path.endsWith('.txt') ? 'text/plain' : probe.path.endsWith('.jpg') ? 'image/jpeg' : probe.path.endsWith('.xml') ? 'application/xml'
      : probe.path.includes('.well-known') ? 'application/json'
        : probe.path.endsWith('.ico') || probe.path.endsWith('.png') ? 'image/png' : 'text/html';
    return new Response(null, { status: probe.status, headers: {
      'content-type': contentType,
      ...(probe.location ? { location: probe.location } : {}),
      ...(probe.noindex ? { 'x-robots-tag': 'noindex' } : {}),
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

test('le contrôle live exige noindex sur les licences et le refuse sur les pages éditoriales', () => {
  const observation = { status: 200 };
  for (const value of ['noindex', 'NOINDEX', 'googlebot: noindex, follow']) {
    assert.deepEqual(validateSeoObservation({ status: 200, noindex: true }, { ...observation, x_robots_tag: value }), []);
    assert.equal(validateSeoObservation({ status: 200, noindex: false }, { ...observation, x_robots_tag: value }).length, 1);
  }
  for (const value of [null, '', 'index,follow', 'noindexing']) {
    assert.deepEqual(validateSeoObservation({ status: 200, noindex: false }, { ...observation, x_robots_tag: value }), []);
    assert.equal(validateSeoObservation({ status: 200, noindex: true }, { ...observation, x_robots_tag: value }).length, 1);
  }
});
