import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, resolve } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { SVG_TEST_SUITES, svgTestFiles } from './svg-test-suites.mjs';
import { parseSvgTestArguments, svgTestArguments, SVG_SOURCE_SHARDS } from './run-svg-tests.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// These three SVG suites retain their separate existing build commands.
const separatelyCovered = new Map([
  ['scripts/ai-frontier-infographics.test.mjs', 'test:ai-frontier'],
  ['scripts/budget-2027-infographics.test.mjs', 'test:budget-2027-tool'],
  ['scripts/debt-hedge-funds-infographics.test.mjs', 'test:repo-stress'],
]);

// Preserve the model/legacy suites previously embedded in the inline SVG command
// or imported by Taiwan's rendered-output suite. New *-infographics files below
// are discovered automatically, so forgetting to classify one fails this check.
const legacySuites = [
  'scripts/aircraft-engine-tool.test.mjs',
  'scripts/asia-dollar-hedge-model.test.mjs',
  'scripts/asia-dollar-purchases.test.mjs',
  'scripts/asia-dollar-stress.test.mjs',
  'scripts/cocoa-financing-tool.test.mjs',
  'scripts/debt-correction-infographic.test.mjs',
  'scripts/ge-healthcare-model.test.mjs',
  'scripts/gpu-credit-model.test.mjs',
  'scripts/iran-flights-infographic.test.mjs',
  'scripts/medicine-supply.test.mjs',
  'scripts/retirement-sequence.test.mjs',
  'scripts/software-debt-stress.test.mjs',
  'scripts/taiwan-inline-svg.test.mjs',
];

test('SVG groups partition every existing suite exactly once', () => {
  const all = svgTestFiles();
  assert.ok(SVG_TEST_SUITES.source.length > 0);
  assert.ok(SVG_TEST_SUITES.rendered.length > 0);
  assert.equal(new Set(all).size, all.length, 'No suite may run in both phases');
  const expected = [
    ...legacySuites,
    ...readdirSync(resolve(root, 'scripts'))
      .filter((name) => name.endsWith('-infographics.test.mjs'))
      .map((name) => `scripts/${name}`)
      .filter((file) => !separatelyCovered.has(file)),
  ].sort();
  assert.deepEqual(all, expected, 'Classify every new SVG suite without dropping legacy coverage');
  const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'));
  const buildCommands = new Set();
  const inspectCommand = (name) => {
    if (buildCommands.has(name)) return;
    buildCommands.add(name);
    for (const match of (pkg.scripts[name] || '').matchAll(/\bnpm run ([a-z0-9:-]+)/gu)) {
      inspectCommand(match[1]);
    }
  };
  inspectCommand('build');
  for (const [file, command] of separatelyCovered) {
    assert.ok(pkg.scripts[command]?.includes(file), `${file}: separate coverage disappeared`);
    assert.ok(buildCommands.has(command), `${command}: build coverage disappeared`);
  }
});

test('suite paths exist, are local and cannot register another suite twice', () => {
  for (const file of svgTestFiles()) {
    assert.match(file, /^scripts\/[a-z0-9-]+\.test\.mjs$/u);
    assert.ok(existsSync(resolve(root, file)), file);
    const source = readFileSync(resolve(root, file), 'utf8');
    assert.doesNotMatch(source, /\b(?:import\s*\(|(?:import|export)\s)[^;]*?['"][^'"]+\.test\.mjs['"]/u, `${file}: keep suite registration in the manifest`);
  }
});

test('suites reading generated pages cannot enter the source-only job', () => {
  for (const file of SVG_TEST_SUITES.source) {
    const source = readFileSync(resolve(root, file), 'utf8');
    assert.doesNotMatch(source, /['"`][^'"`\n]*\bdist(?:\/|['"`])/u, `${file}: generated-page assertions belong to the rendered group`);
  }
});

test('group selection cannot silently omit tests or accept extra CLI arguments', () => {
  assert.deepEqual(parseSvgTestArguments([]), { group: 'all', shard: undefined });
  for (const group of ['all', 'source', 'rendered']) {
    assert.deepEqual(parseSvgTestArguments(['--group', group]), { group, shard: undefined });
    assert.deepEqual(svgTestArguments(group, 4).slice(3), svgTestFiles(group));
  }
  for (const args of [
    ['--group'], ['--unknown', 'all'], ['--group', 'invalid'],
    ['--group=source'], ['--group', 'source', '--group', 'rendered'],
    ['--group', 'source', 'scripts/unreviewed.test.mjs'],
  ]) assert.throws(() => parseSvgTestArguments(args));
  assert.throws(() => svgTestFiles('__proto__'));
});

test('only the four complete source shards are accepted without filtering the file list', () => {
  assert.deepEqual(SVG_SOURCE_SHARDS, ['1/4', '2/4', '3/4', '4/4']);
  for (const shard of SVG_SOURCE_SHARDS) {
    assert.deepEqual(parseSvgTestArguments(['--group', 'source', '--shard', shard]), { group: 'source', shard });
    const args = svgTestArguments('source', 4, shard);
    assert.equal(args[3], `--test-shard=${shard}`);
    assert.deepEqual(args.slice(4), svgTestFiles('source'));
    for (const group of ['all', 'rendered']) {
      assert.throws(() => parseSvgTestArguments(['--group', group, '--shard', shard]));
      assert.throws(() => svgTestArguments(group, 4, shard));
    }
  }
  for (const shard of ['', '0/4', '5/4', '1/3', '1/04', '01/4', '1/4 ', '--test-only', null, 1]) {
    assert.throws(() => parseSvgTestArguments(['--group', 'source', '--shard', shard]));
    assert.throws(() => svgTestArguments('source', 4, shard));
  }
  for (const args of [
    ['--shard', '1/4'], ['--group', 'source', '--shard'],
    ['--group', 'source', '--shard=1/4'], ['--group', 'source', '--shard', '1/4', '--test-only'],
  ]) assert.throws(() => parseSvgTestArguments(args));
});

test('native Node sharding executes each manifest path exactly once across all four jobs', (t) => {
  const temporary = mkdtempSync(resolve(tmpdir(), 'l0g-svg-shards-'));
  t.after(() => rmSync(temporary, { recursive: true, force: true }));
  mkdirSync(resolve(temporary, 'scripts'));
  const files = svgTestFiles('source');
  // Use lightweight marker modules at every real manifest path, so this checks
  // Node's actual partitioning without running expensive SVG rendering twice.
  for (const file of files) {
    writeFileSync(resolve(temporary, file), `import { appendFileSync } from 'node:fs';\nappendFileSync(new URL('../executed.txt', import.meta.url), ${JSON.stringify(`${file}\n`)});\n`);
  }
  const environment = { ...process.env };
  delete environment.NODE_TEST_CONTEXT;
  const observed = [];
  for (const shard of SVG_SOURCE_SHARDS) {
    const result = spawnSync(process.execPath, svgTestArguments('source', 4, shard), {
      cwd: temporary, encoding: 'utf8', env: environment, timeout: 60_000,
    });
    assert.equal(result.status, 0, `${shard}: ${result.stderr}\n${result.stdout}`);
    const executed = readFileSync(resolve(temporary, 'executed.txt'), 'utf8').trim().split('\n');
    assert.ok(executed.length >= Math.floor(files.length / 4) && executed.length <= Math.ceil(files.length / 4));
    observed.push(...executed);
    rmSync(resolve(temporary, 'executed.txt'));
  }
  assert.deepEqual(observed.sort(), [...files].sort(), 'Every source suite must run exactly once across the matrix');
});

test('Node test concurrency stays bounded on small and large machines', () => {
  for (const [cpus, expected] of [[1, 1], [2, 1], [4, 3], [128, 3]]) {
    const args = svgTestArguments('source', cpus);
    assert.deepEqual(args.slice(0, 3), ['--experimental-strip-types', '--test', `--test-concurrency=${expected}`]);
  }
  for (const value of [0, -1, 1.5, Infinity, NaN]) assert.throws(() => svgTestArguments('source', value));
});

test('invalid CLI requests fail before starting test execution', () => {
  const result = spawnSync(process.execPath, ['scripts/run-svg-tests.mjs', '--group', 'missing'], { cwd: root, encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Unknown SVG test group/u);
  assert.equal(result.stdout, '');
});
