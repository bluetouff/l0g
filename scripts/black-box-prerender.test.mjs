import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import test from 'node:test';
import { BLACK_BOX_SEED_PATHS } from './black-box-contract.mjs';
import blackBoxPrerender from './black-box-prerender.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const sha = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
const appendScript = fileURLToPath(new URL('./black-box-archive.mjs', import.meta.url));
const timestamp = '2026-10-09T09:00:00Z';
const attestation = 'https://github.com/bluetouff/l0g/actions/runs/1234';

function environment(archive, overrides = {}) {
  return {
    ...process.env,
    L0G_APPEND_BLACK_BOX_FRAME: '1', GITHUB_ACTIONS: 'true', GITHUB_REPOSITORY: 'bluetouff/l0g',
    GITHUB_REF: 'refs/heads/main', GITHUB_SHA: sha, GITHUB_RUN_ID: '1234', GITHUB_RUN_ATTEMPT: '1',
    L0G_BUILD_TIMESTAMP: timestamp, BLACK_BOX_COMPUTED_AT: timestamp,
    BLACK_BOX_ATTESTATION_URL: attestation, L0G_BLACK_BOX_ARCHIVE_DIR: archive,
    ...overrides,
  };
}

function configured(env) {
  const integration = blackBoxPrerender({ environment: env });
  integration.hooks['astro:config:setup']({ command: 'build' });
  integration.hooks['astro:config:done']({ config: { root: pathToFileURL(`${root}/`), site: 'https://l0g.fr' } });
  let factory;
  integration.hooks['astro:build:start']({ setPrerenderer(value) { factory = value; }, logger: { info() {} } });
  return factory;
}

function seedBody(path) {
  if (path === 'api/v1/signals/history.json') {
    const signal = {
      recordType: 'observation', instrument: 'us', seriesDate: timestamp,
      observedAt: '2026-10-08T00:00:00Z', retrievedAt: '2026-10-09T08:50:00Z', value: 21,
    };
    return JSON.stringify({ generated: timestamp, observations: [signal], current: { us: signal } });
  }
  return JSON.stringify({ generated: timestamp, path, snapshots: [], signalFreshness: [], entries: [], count: 0 });
}

function defaultRenderer({ omit, duplicate, respond } = {}) {
  const calls = [];
  const paths = [
    ...BLACK_BOX_SEED_PATHS.filter((path) => path !== omit).map((path) => ({ pathname: `/${path}`, route: { type: 'endpoint' } })),
    { pathname: '/', route: { type: 'page' } },
  ];
  if (duplicate) paths.push(paths.find((item) => item.pathname === `/${duplicate}`));
  let ready = false;
  const renderer = {
    name: 'fixture-default',
    async setup() { ready = true; },
    async getStaticPaths() { assert.ok(ready); return paths; },
    async render(request, options) {
      assert.ok(ready);
      const path = new URL(request.url).pathname.slice(1);
      assert.strictEqual(options.routeData, paths.find((item) => item.pathname === `/${path}`).route);
      calls.push({ path, options });
      const response = respond?.(path) ?? new Response(seedBody(path), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
      // Astro supports both Response and { response, metadata } return values.
      return calls.length % 2 === 0 ? { response, metadata: { contentEntryKeys: [], staticImages: [] } } : response;
    },
    async teardown() { ready = false; },
  };
  return { renderer, paths, calls };
}

function stable(value) {
  if (!value || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stable).join(',')}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stable(value[key])}`).join(',')}}`;
}

test('publication prepass appends the same frame as the former dist-based append and retains the old frame', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'l0g-black-box-test-'));
  const archive = join(temporary, 'archive');
  const baseline = join(temporary, 'baseline');
  const seed = join(temporary, 'dist');
  try {
    await mkdir(join(archive, 'frames'), { recursive: true });
    const core = {
      schemaVersion: '2', frameId: 'utc-20261001T000000Z-old', previousFrameHash: null,
      computedAt: '2026-10-01T00:00:00Z', signals: [],
      contemporaryHashes: [{ path: '/agents.json', sha256: 'a'.repeat(64), bytes: 2 }],
    };
    const oldBytes = JSON.stringify({ ...core, frameHash: createHash('sha256').update(stable(core)).digest('hex') });
    const oldName = `${core.frameId}.json`;
    await writeFile(join(archive, 'frames', oldName), oldBytes);
    await cp(archive, baseline, { recursive: true });
    for (const path of BLACK_BOX_SEED_PATHS) {
      await mkdir(dirname(join(seed, path)), { recursive: true });
      await writeFile(join(seed, path), seedBody(path));
    }
    execFileSync(process.execPath, [appendScript, 'append', '--archive', baseline, '--dist', seed,
      '--git-sha', sha, '--computed-at', timestamp, '--attestation', attestation, '--id-suffix', '1234-1'],
    { encoding: 'utf8' });

    const { renderer, paths, calls } = defaultRenderer();
    const wrapped = configured(environment(archive))(renderer);
    await wrapped.setup();
    assert.strictEqual(await wrapped.getStaticPaths(), paths);
    assert.equal(calls.length, 14);
    assert.deepEqual(calls.map((call) => call.path), BLACK_BOX_SEED_PATHS);
    assert.strictEqual(await wrapped.getStaticPaths(), paths);
    assert.equal(calls.length, 14, 'a second getStaticPaths call must not append again');
    const files = (await readdir(join(archive, 'frames'))).sort();
    assert.equal(files.length, 2);
    for (const file of files) {
      assert.equal(await readFile(join(archive, 'frames', file), 'utf8'), await readFile(join(baseline, 'frames', file), 'utf8'));
    }
    assert.equal(await readFile(join(archive, 'frames', oldName), 'utf8'), oldBytes);
    const added = JSON.parse(await readFile(join(archive, 'frames', files[1]), 'utf8'));
    assert.equal(added.gitSha, sha);
    assert.equal(added.attestation.reference, attestation);
    const options = { routeData: paths[0].route, collectMetadata: true };
    await wrapped.render(new Request('https://l0g.fr/agents.json'), options);
    assert.strictEqual(calls.at(-1).options, options, 'normal renders must retain all Astro options');
    await wrapped.teardown();
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('ordinary builds and dev do not acquire an archive writer', () => {
  assert.deepEqual(blackBoxPrerender({ environment: {} }).hooks, {});
  assert.throws(() => blackBoxPrerender({ environment: { L0G_APPEND_BLACK_BOX_FRAME: 'true' } }), /doit valoir 1/);
  const integration = blackBoxPrerender({ environment: environment('/tmp/unused') });
  assert.throws(() => integration.hooks['astro:config:setup']({ command: 'dev' }), /réservée à astro build/);
});

test('publication rejects a foreign checkout, unverified run identity and inconsistent timestamps before rendering', () => {
  for (const overrides of [
    { GITHUB_SHA: 'a'.repeat(40) }, { GITHUB_SHA: 'abc' }, { GITHUB_REPOSITORY: 'other/repo' },
    { GITHUB_REF: 'refs/pull/1/merge' }, { GITHUB_ACTIONS: '' }, { GITHUB_RUN_ID: '' },
    { GITHUB_RUN_ATTEMPT: '0' }, { BLACK_BOX_ATTESTATION_URL: 'https://example.com/run' },
    { L0G_BUILD_TIMESTAMP: '' }, { BLACK_BOX_COMPUTED_AT: '2026-10-08T09:00:00Z' },
    { L0G_BUILD_TIMESTAMP: '2026-02-30T00:00:00Z', BLACK_BOX_COMPUTED_AT: '2026-02-30T00:00:00Z' },
    { L0G_BLACK_BOX_ARCHIVE_DIR: '' },
  ]) {
    assert.throws(() => configured(environment('/tmp/unused', overrides)), /Black Box prepass:/);
  }
});

test('a missing, duplicate or failing seed endpoint prevents any frame and cleans temporary files', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'l0g-black-box-test-'));
  try {
    const before = (await readdir(tmpdir())).filter((name) => name.startsWith('l0g-black-box-seed-')).sort();
    for (const fixture of [
      { omit: 'agents.json' }, { duplicate: 'agents.json' },
      { respond: (path) => path === 'api/v1/integrity.json' ? new Response('{}', { status: 503, headers: { 'Content-Type': 'application/json' } }) : undefined },
      { respond: () => new Response('{}', { headers: { 'Content-Type': 'text/html' } }) },
      { respond: () => new Response('broken', { headers: { 'Content-Type': 'application/json' } }) },
      { respond: () => new Response('null', { headers: { 'Content-Type': 'application/json' } }) },
      { respond: () => new Response('[]', { headers: { 'Content-Type': 'application/json' } }) },
    ]) {
      const archive = join(temporary, `archive-${Math.random().toString(36).slice(2)}`);
      const wrapped = configured(environment(archive))(defaultRenderer(fixture).renderer);
      await wrapped.setup();
      await assert.rejects(wrapped.getStaticPaths(), /Black Box prepass:/);
      await assert.rejects(readdir(archive), { code: 'ENOENT' });
      await wrapped.teardown();
    }
    assert.deepEqual((await readdir(tmpdir())).filter((name) => name.startsWith('l0g-black-box-seed-')).sort(), before);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('a corrupt archive fails closed and the seed is removed', async () => {
  const temporary = await mkdtemp(join(tmpdir(), 'l0g-black-box-test-'));
  const archive = join(temporary, 'archive');
  try {
    await mkdir(join(archive, 'frames'), { recursive: true });
    const invalid = '{"schemaVersion":"2","frameId":"corrupt","frameHash":"invalid"}';
    await writeFile(join(archive, 'frames/corrupt.json'), invalid);
    const before = (await readdir(tmpdir())).filter((name) => name.startsWith('l0g-black-box-seed-')).sort();
    const wrapped = configured(environment(archive))(defaultRenderer().renderer);
    await wrapped.setup();
    await assert.rejects(wrapped.getStaticPaths(), /frameHash/);
    assert.deepEqual(await readdir(join(archive, 'frames')), ['corrupt.json']);
    assert.equal(await readFile(join(archive, 'frames/corrupt.json'), 'utf8'), invalid);
    assert.deepEqual((await readdir(tmpdir())).filter((name) => name.startsWith('l0g-black-box-seed-')).sort(), before);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('the public Astro prerenderer API builds final pages and JSON from the newly appended frame in one pass', async () => {
  await mkdir(join(root, '.cache'), { recursive: true });
  // Keeping the fixture below the checkout resolves its installed Astro and the
  // real Git HEAD without copying dependencies or creating another repository.
  const temporary = await mkdtemp(join(root, '.cache/black-box-prerender-fixture-'));
  const archive = join(temporary, 'archive');
  try {
    await mkdir(join(temporary, 'src/pages'), { recursive: true });
    await mkdir(join(archive, 'frames'), { recursive: true });
    await writeFile(join(temporary, 'package.json'), '{"type":"module"}\n');
    await writeFile(join(temporary, 'astro.config.mjs'), `
      import blackBoxPrerender from ${JSON.stringify(new URL('./black-box-prerender.mjs', import.meta.url).href)};
      export default { site: 'https://l0g.fr', integrations: [blackBoxPrerender()] };
    `);
    await writeFile(join(temporary, 'src/pages/[...path].json.ts'), `
      import { readdirSync } from 'node:fs';
      import { join } from 'node:path';
      const timestamp = ${JSON.stringify(timestamp)};
      ${seedBody.toString()}
      export function getStaticPaths() {
        return ${JSON.stringify(BLACK_BOX_SEED_PATHS)}.map((path) => ({ params: { path: path.replace(/\\.json$/, '') } }));
      }
      export function GET({ params }) {
        const body = JSON.parse(seedBody(params.path + '.json'));
        body.archiveFrames = readdirSync(join(process.env.L0G_BLACK_BOX_ARCHIVE_DIR, 'frames')).filter((path) => path.endsWith('.json')).length;
        return new Response(JSON.stringify(body), { headers: { 'Content-Type': 'application/json' } });
      }
    `);
    await writeFile(join(temporary, 'src/pages/index.astro'), `---
      import { readdirSync, readFileSync } from 'node:fs';
      import { join } from 'node:path';
      const directory = join(process.env.L0G_BLACK_BOX_ARCHIVE_DIR, 'frames');
      const frames = readdirSync(directory).filter((path) => path.endsWith('.json')).map((path) => JSON.parse(readFileSync(join(directory, path), 'utf8')));
      ---
      <html><head><title>Black Box integration fixture</title></head><body><p id="count">{frames.length}</p><p id="sha">{frames.at(-1)?.gitSha}</p></body></html>
    `);
    const output = execFileSync(process.execPath, [join(root, 'node_modules/astro/bin/astro.mjs'), 'build'], {
      cwd: temporary, env: environment(archive), encoding: 'utf8', stdio: 'pipe', timeout: 60_000,
    });
    assert.match(output, /Frame ajoutée:/);
    assert.equal((output.match(/Frame ajoutée:/g) || []).length, 1);
    const html = await readFile(join(temporary, 'dist/index.html'), 'utf8');
    assert.match(html, /id="count">1<\/p>/);
    assert.ok(html.includes(`id="sha">${sha}</p>`));
    for (const path of BLACK_BOX_SEED_PATHS) {
      const result = JSON.parse(await readFile(join(temporary, 'dist', path), 'utf8'));
      assert.equal(result.archiveFrames, 1, `${path} must see the completed archive`);
    }
    const frames = await readdir(join(archive, 'frames'));
    assert.equal(frames.length, 1);
    const frame = JSON.parse(await readFile(join(archive, 'frames', frames[0]), 'utf8'));
    assert.equal(frame.gitSha, sha);
    assert.equal(frame.contemporaryHashes.length, 13);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});
