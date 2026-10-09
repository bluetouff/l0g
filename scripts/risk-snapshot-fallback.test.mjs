import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const updater = new URL('scripts/update-risk-snapshot.mjs', root).href;
const validator = new URL('scripts/validate-risk-snapshot.mjs', root).pathname;
const previous = JSON.parse(await readFile(new URL('public/risk.json', root), 'utf8'));
const confluence = JSON.parse(await readFile(new URL('public/confluence.json', root), 'utf8'));
const riskClient = await readFile(new URL('src/scripts/risk.js', root), 'utf8');

// Deliberately distinct fixture values expose accidental joins across snapshots.
const oldDebt = previous.indices.find((item) => item.key === 'debt');
Object.assign(oldDebt, {
  value: 41,
  observedAt: '2026-09-01T00:00:00.000Z',
  observedAtMethod: 'latest-component-observation',
  observationWindow: { oldest: '2026-08-01T00:00:00.000Z', latest: '2026-09-01T00:00:00.000Z' },
  sourcePublishedAt: '2026-09-02T10:00:00.000Z',
  sourceUpdatedAt: '2026-09-02T10:00:00.000Z',
  lastSuccessAt: '2026-09-02T11:00:00.000Z',
});
previous.provenance.debt.scoreRaw = 40.7;
previous.provenance.debt.scoreRounded = 41;
previous.provenance.debt.generatedAt = oldDebt.sourcePublishedAt;
previous.provenance.debt.lastSuccessAt = oldDebt.lastSuccessAt;
const aggregate = structuredClone(previous);
aggregate.indices.find((item) => item.key === 'debt').value = 55;
delete aggregate.provenance;
const availableDebt = {
  generated_at: '2026-09-10T10:00:00Z',
  score: { current_stress: 53.4, status: 'Elevated' },
  sources: [{ source: 'fixture', latest_date: '2026-09-09' }],
};

function institutionalDebt() {
  return {
    ...availableDebt,
    schema_version: '1.2', source_sha: 'a'.repeat(40),
    methodology: { id: 'us-debt-institutional', version: '2.0' },
    generated_at: new Date(Date.now() - 60_000).toISOString(),
    valid_until: new Date(Date.now() + 29 * 60_000).toISOString(),
    score: { ...availableDebt.score, coverage: 1, expected_signals: 31, eligible_signals: 31 },
  };
}

test('institutional publication carries its method and exact producer revision', async (t) => {
  const { result, risk, snapshot } = await runSnapshot(t, { debt: institutionalDebt() });
  assert.equal(result.status, 0, result.stderr);
  const signal = risk.indices.find((item) => item.key === 'debt');
  assert.equal(signal.methodologyVersion, '2.0');
  assert.equal(signal.producerRevision, 'a'.repeat(40));
  assert.equal(signal.producerRevisionStatus, 'reported');
  assert.equal(snapshot.provenance.methodologyVersion, '2.0');
  assert.equal(snapshot.provenance.calculatorRevision, signal.producerRevision);
});

test('institutional expired, future, incomplete and unknown publications stay unavailable', async (t) => {
  const patches = [
    { valid_until: new Date(Date.now() - 1).toISOString() },
    { generated_at: new Date(Date.now() + 120_000).toISOString() },
    { methodology: { id: 'us-debt-institutional', version: '3.0' } },
    { score: { current_stress: 54, coverage: 0.99, expected_signals: 31, eligible_signals: 30 } },
    { score: { current_stress: 101, coverage: 1, expected_signals: 31, eligible_signals: 31 } },
  ];
  for (const fields of patches) {
    assertCoherentFallback(await runSnapshot(t, { debt: { ...institutionalDebt(), ...fields } }));
  }
});

test('confirmed delayed quarterly data remains labelled in static debt snapshots', async (t) => {
  const debt = institutionalDebt();
  debt.quality = { status: 'official-delayed', policy_version: '2' };
  const { result, risk, snapshot } = await runSnapshot(t, { debt });
  assert.equal(result.status, 0, result.stderr);
  const signal = risk.indices.find((item) => item.key === 'debt');
  assert.equal(signal.qualityStatus, 'official-delayed');
  assert.equal(signal.freshnessPolicyVersion, '2');
  assert.equal(signal.sourceStatus, 'ok');
  assert.equal(signal.fallbackUsed, false);
  assert.equal(snapshot.signal.qualityStatus, 'official-delayed');
  assert.match(signal.warnings[0], /FRED/);
});

async function runSnapshot(t, { debt = { score: { current_stress: null } }, aggregateValue = aggregate, prior = previous, priorConfluence = confluence, confluenceValue = confluence } = {}) {
  const directory = await mkdtemp(join(tmpdir(), 'l0g-debt-fallback-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(join(directory, 'public'));
  await mkdir(join(directory, 'src/scripts'), { recursive: true });
  const input = `${JSON.stringify(prior)}\n`;
  await writeFile(join(directory, 'public/risk.json'), input);
  await writeFile(join(directory, 'public/confluence.json'), JSON.stringify(priorConfluence));
  await writeFile(join(directory, 'src/scripts/risk.js'), riskClient);
  const responses = join(directory, 'responses.json');
  await writeFile(responses, JSON.stringify({
    'https://l0g.fr/risk.json': aggregateValue,
    'https://debt.l0g.fr/latest.json': debt,
    'https://l0g.fr/confluence.json': confluenceValue,
  }));
  const code = `
    import { readFileSync } from 'node:fs';
    const responses = JSON.parse(readFileSync(process.argv[1], 'utf8'));
    globalThis.fetch = async (url) => {
      if (!Object.hasOwn(responses, url)) throw new Error('Unexpected test URL');
      if (responses[url] === null) throw new Error('Fixture provider unavailable');
      return Response.json(responses[url]);
    };
    await import(${JSON.stringify(updater)});
  `;
  const env = { ...process.env };
  for (const name of ['L0G_RISK_AGGREGATE_URL', 'DEBT_RISK_LATEST_URL', 'L0G_CONFLUENCE_URL']) delete env[name];
  const result = spawnSync(process.execPath, ['--input-type=module', '--eval', code, responses], {
    cwd: directory, env, encoding: 'utf8', timeout: 10_000,
  });
  const output = await readFile(join(directory, 'public/risk.json'), 'utf8');
  if (result.status !== 0) return { result, output, input };
  const validation = spawnSync(process.execPath, [validator], { cwd: directory, encoding: 'utf8', timeout: 10_000 });
  assert.equal(validation.status, 0, validation.stderr);
  return {
    result,
    risk: JSON.parse(output),
    confluence: JSON.parse(await readFile(join(directory, 'public/confluence.json'), 'utf8')),
    snapshot: JSON.parse(await readFile(join(directory, 'public/debt-latest.json'), 'utf8')),
  };
}

function assertCoherentFallback({ result, risk, snapshot }) {
  assert.equal(result.status, 0, result.stderr);
  const signal = risk.indices.find((item) => item.key === 'debt');
  assert.equal(signal.value, 41);
  assert.equal(signal.sourceStatus, 'fallback');
  assert.equal(signal.fallbackUsed, true);
  assert.equal(signal.backtestUsable, false);
  assert.equal(signal.observedAt, oldDebt.observedAt);
  assert.equal(signal.sourcePublishedAt, oldDebt.sourcePublishedAt);
  assert.equal(signal.lastSuccessAt, oldDebt.lastSuccessAt);
  assert.equal(risk.provenance.debt.scoreRaw, 40.7);
  assert.equal(risk.provenance.debt.scoreRounded, 41);
  assert.equal(risk.provenance.debt.generatedAt, previous.provenance.debt.generatedAt);
  assert.equal(risk.provenance.debt.sourceStatus, 'fallback');
  assert.equal(risk.provenance.debt.lastSuccessAt, previous.provenance.debt.lastSuccessAt);
  assert.equal(snapshot.status, 'fallback');
  assert.deepEqual(snapshot.signal, signal);
  assert.deepEqual(snapshot.provenance, risk.provenance.debt);
}

test('an unavailable debt score preserves the previous observation and its provenance together', async (t) => {
  assertCoherentFallback(await runSnapshot(t));
});

test('a debt transport failure uses the same explicitly degraded pair', async (t) => {
  assertCoherentFallback(await runSnapshot(t, { debt: null }));
});

test('an explicit null current score cannot be replaced by a legacy overall score', async (t) => {
  assertCoherentFallback(await runSnapshot(t, { debt: { score: { current_stress: null, overall: 99 } } }));
});

test('simultaneous provider failures preserve the dated pair', async (t) => {
  assertCoherentFallback(await runSnapshot(t, { debt: null, aggregateValue: null }));
});

test('a valid direct publication replaces both score and provenance', async (t) => {
  const { result, risk, snapshot } = await runSnapshot(t, { debt: availableDebt });
  assert.equal(result.status, 0, result.stderr);
  const signal = risk.indices.find((item) => item.key === 'debt');
  assert.equal(signal.value, 53);
  assert.equal(signal.sourceStatus, 'ok');
  assert.equal(signal.fallbackUsed, false);
  assert.equal(signal.observedAt, '2026-09-09T00:00:00.000Z');
  assert.equal(risk.provenance.debt.scoreRaw, 53.4);
  assert.equal(risk.provenance.debt.scoreRounded, 53);
  assert.equal(risk.provenance.debt.generatedAt, availableDebt.generated_at);
  assert.deepEqual(snapshot.signal, signal);
  assert.deepEqual(snapshot.provenance, risk.provenance.debt);
});

test('an incoherent prior pair fails before writing a new snapshot', async (t) => {
  const prior = structuredClone(previous);
  prior.provenance.debt.scoreRounded = 42;
  const { result, output, input } = await runSnapshot(t, { prior });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /aucune paire valeur\/provenance cohérente/);
  assert.equal(output, input);
});


test('a failed static refresh retains dated filing observations without refreshing their success', async (t) => {
  const filingEvents = { version: 1, status: 'ok', cursor: 7, lastSuccessAt: '2026-09-10T10:00:00Z',
    events: [{ id: 'synthetic-event', firstSeenAt: '2026-09-09T10:00:00Z' }] };
  const result = await runSnapshot(t, { priorConfluence: { ...confluence, filingEvents }, confluenceValue: null });
  assert.equal(result.result.status, 0, result.result.stderr);
  assert.equal(result.confluence.filingEvents.status, 'unavailable');
  assert.equal(result.confluence.filingEvents.lastSuccessAt, filingEvents.lastSuccessAt);
  assert.equal(result.confluence.filingEvents.cursor, 7);
  assert.deepEqual(result.confluence.filingEvents.events, filingEvents.events);
});
