import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const historyRelative = `.cache/signal-history-provenance-${process.pid}.ndjson`;
const metaRelative = `.cache/signal-history-provenance-${process.pid}.meta.json`;
const historyPath = resolve(historyRelative);
const metaPath = resolve(metaRelative);
const repository = 'https://github.com/bluetouff/macro_dashboard';
const revision = '1e5ce9a394a3d8a1df0c34cc9e08070bde2138c0';

function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}

function surfaceAt(directory, timestamp) {
  const moduleUrl = new URL('../src/lib/signal-history.ts', import.meta.url).href;
  return JSON.parse(execFileSync(process.execPath, ['--experimental-strip-types', '--input-type=module', '-e',
    `import { buildSignalHistorySurface } from ${JSON.stringify(moduleUrl)}; console.log(JSON.stringify(buildSignalHistorySurface()));`,
  ], {
    cwd: directory,
    env: { ...process.env, L0G_BUILD_TIMESTAMP: timestamp, L0G_BLACK_BOX_ARCHIVE_DIR: resolve(directory, 'archive') },
    encoding: 'utf8',
  }));
}

test('la republication date les nouveaux points après leur collecte et exclut les anciennes frames antidatées', async () => {
  const temporary = await mkdtemp(resolve(tmpdir(), 'l0g-signal-chronology-'));
  const source = {
    key: 'yen', value: 13, scale: 100, sourceStatus: 'ok', qualityStatus: 'nominal',
    observedAt: '2026-09-18T00:00:00Z', sourcePublishedAt: '2026-09-18T20:53:12Z',
    retrievedAt: '2026-09-18T21:03:10Z',
  };
  const oldTime = '2026-09-18T22:48:40+02:00';
  const oldId = '20260918T224840+0200-abcdef123456';
  const core = {
    schemaVersion: '2', frameId: oldId, computedAt: oldTime, previousFrameHash: null,
    contemporaryHashes: [{ path: '/api/v1/risk.json', sha256: 'a'.repeat(64), bytes: 1 }],
    signals: [{ ...source, recordType: 'observation', instrument: 'yen', seriesDate: oldTime, computedAt: oldTime, pointInTime: true, backtestUsable: true }],
  };
  const frame = { ...core, frameHash: createHash('sha256').update(stableStringify(core)).digest('hex') };
  const framePath = resolve(temporary, 'archive/frames', `${oldId}.json`);
  const frameBytes = JSON.stringify(frame);
  try {
    await mkdir(resolve(temporary, 'public'), { recursive: true });
    await mkdir(dirname(framePath), { recursive: true });
    await writeFile(framePath, frameBytes);
    await writeFile(resolve(temporary, 'public/risk.json'), JSON.stringify({ indices: [source] }));
    const rebuilt = surfaceAt(temporary, oldTime);
    const current = rebuilt.current.yen;
    assert.equal(rebuilt.generated, '2026-09-18T21:03:10.000Z');
    assert.equal(current.seriesDate, rebuilt.generated);
    assert.equal(current.pointInTime, true);
    assert.equal(current.backtestUsable, true);
    const historical = rebuilt.observations.find((item) => item.archiveFrameId === oldId);
    assert.equal(historical.seriesDate, '2026-09-18T20:48:40.000Z');
    assert.equal(historical.pointInTime, false);
    assert.equal(historical.backtestUsable, false);
    assert.match(historical.limitations.join(' '), /antérieure/);
    assert.equal(await readFile(framePath, 'utf8'), frameBytes);
    assert.equal(surfaceAt(temporary, oldTime).current.yen.recordId, current.recordId);

    // Un événement économique futur ne devient pas exploitable en avançant le build.
    await writeFile(resolve(temporary, 'public/risk.json'), JSON.stringify({ indices: [{ ...source, observedAt: '2026-09-19T00:00:00Z' }] }));
    assert.equal(surfaceAt(temporary, oldTime).current.yen.backtestUsable, false);

    const dist = resolve(temporary, 'dist');
    const paths = ['agents.json', 'openapi.json', 'api/v1/catalog.json', 'api/v1/search-index.json',
      'api/v1/claims.json', 'api/v1/evidence-graph.json', 'api/v1/sources.json', 'api/v1/freshness.json',
      'api/v1/changes.json', 'api/v1/risk-diff.json', 'api/v1/risk.json', 'api/v1/debt-risk.json', 'api/v1/integrity.json'];
    for (const path of paths) {
      await mkdir(dirname(resolve(dist, path)), { recursive: true });
      await writeFile(resolve(dist, path), '{}');
    }
    await mkdir(resolve(dist, 'api/v1/signals'), { recursive: true });
    await writeFile(resolve(dist, 'api/v1/signals/history.json'), JSON.stringify(rebuilt));
    execFileSync(process.execPath, [fileURLToPath(new URL('./black-box-archive.mjs', import.meta.url)),
      'append', '--archive', resolve(temporary, 'archive'), '--dist', dist,
      '--computed-at', oldTime, '--git-sha', 'b'.repeat(40), '--id-suffix', 'test',
    ]);
    const files = (await readdir(dirname(framePath))).sort();
    assert.equal(files[0], `${oldId}.json`);
    assert.match(files[1], /^utc-/);
    const appended = JSON.parse(await readFile(resolve(dirname(framePath), files[1]), 'utf8'));
    assert.equal(appended.computedAt, rebuilt.generated);
    assert.equal(appended.previousFrameHash, frame.frameHash);
    assert.equal(await readFile(framePath, 'utf8'), frameBytes);
    const archived = surfaceAt(temporary, oldTime).observations.find((item) => item.archiveFrameId === appended.frameId);
    assert.equal(archived.backtestUsable, true);
    assert.equal(archived.appendOnlyVerified, true);
  } finally {
    await rm(temporary, { recursive: true, force: true });
  }
});

test('la méthode opérationnelle est attribuée uniquement à la révision producteur attestée', async () => {
  await mkdir(dirname(historyPath), { recursive: true });
  await writeFile(historyPath, [
    JSON.stringify({
      snapshot: '2026-07-30T23:55:00Z',
      us: 31,
      us_source_status: 'ok',
      us_quality_status: 'nominal',
      us_observed_at: '2026-07-29T00:00:00Z',
      us_fallback: false,
      us_producer_repository: repository,
      us_producer_revision: revision,
      us_producer_revision_status: 'reported',
    }),
    JSON.stringify({
      snapshot: '2026-07-31T23:55:00Z',
      us: 32,
      us_source_status: 'ok',
      us_quality_status: 'nominal',
      us_observed_at: '2026-07-30T00:00:00Z',
      us_fallback: false,
      us_producer_repository: repository,
      us_producer_revision: '0'.repeat(40),
      us_producer_revision_status: 'reported',
    }),
    JSON.stringify({
      snapshot: '2026-08-01T23:55:00Z',
      us: 33,
      us_source_status: 'ok',
      us_quality_status: 'nominal',
      us_fallback: false,
      us_producer_repository: repository,
      us_producer_revision: revision,
      us_producer_revision_status: 'reported',
    }),
  ].join('\n') + '\n');
  await writeFile(metaPath, '{}\n');
  process.env.L0G_OPERATIONAL_HISTORY_PATH = historyRelative;
  process.env.L0G_OPERATIONAL_HISTORY_META_PATH = metaRelative;
  process.env.L0G_BUILD_TIMESTAMP = '2026-08-03T00:00:00Z';

  try {
    const { buildSignalHistorySurface } = await import(`../src/lib/signal-history.ts?test=${process.pid}`);
    const observations = buildSignalHistorySurface().observations.filter((item) => (
      item.instrument === 'us' && item.evidenceTier === 'operational-archive'
    ));
    const attested = observations.find((item) => item.seriesDate === '2026-07-30T23:55:00.000Z');
    const divergent = observations.find((item) => item.seriesDate === '2026-07-31T23:55:00.000Z');
    const undated = observations.find((item) => item.seriesDate === '2026-08-01T23:55:00.000Z');

    assert.equal(attested?.methodologyVersion, '2.0.0');
    assert.equal(attested?.methodologyVersionStatus, 'versioned');
    assert.equal(attested?.calculatorRepo, repository);
    assert.equal(attested?.calculatorRevision, revision);
    assert.equal(attested?.observedAt, '2026-07-29T00:00:00.000Z');
    assert.equal(attested?.backtestUsable, true);
    assert.equal(divergent?.methodologyVersion, null);
    assert.equal(divergent?.methodologyVersionStatus, 'unversioned-legacy');
    assert.equal(divergent?.calculatorRevision, null);
    assert.equal(undated?.observedAt, null);
    assert.equal(undated?.backtestUsable, false);
    assert.match(undated?.limitations.join(' ') || '', /exclu des backtests sans biais/);
  } finally {
    await Promise.all([rm(historyPath, { force: true }), rm(metaPath, { force: true })]);
  }
});

test('la valeur native courante reste distincte de la normalisation 0-100', async () => {
  const temporary = await mkdtemp(resolve(tmpdir(), 'l0g-signal-history-'));
  const previousCwd = process.cwd();
  await mkdir(resolve(temporary, 'public'), { recursive: true });
  await writeFile(resolve(temporary, 'public/risk.json'), JSON.stringify({
    updated: '2026-08-03T08:00:00Z',
    indices: [{
      key: 'us',
      value: 31,
      rawValue: 0.04,
      scale: 100,
      level: 'Modéré',
      tone: 'moderate',
      sourceStatus: 'ok',
      qualityStatus: 'nominal',
      fallbackUsed: false,
      sourceUpdatedAt: '2026-08-03T04:03:17Z',
      observedAt: '2026-08-01T00:00:00Z',
    }],
  }));

  try {
    process.chdir(temporary);
    const { buildSignalHistorySurface } = await import(`../src/lib/signal-history.ts?raw=${process.pid}`);
    const current = buildSignalHistorySurface().observations.find((item) => (
      item.instrument === 'us' && item.evidenceTier === 'current-snapshot'
    ));

    assert.equal(current?.value, 31);
    assert.equal(current?.rawValue, 0.04);
    assert.equal(current?.observedAt, '2026-08-01T00:00:00.000Z');
    assert.equal(current?.backtestUsable, true);
  } finally {
    process.chdir(previousCwd);
    await rm(temporary, { force: true, recursive: true });
  }
});
