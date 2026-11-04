import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { copyFile, cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

const sourceRoot = new URL('../', import.meta.url);

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'l0g-ci-policy-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(join(root, 'scripts'));
  await mkdir(join(root, '.github'));
  await Promise.all([
    copyFile(new URL('./audit-ci-policy.mjs', import.meta.url), join(root, 'scripts/audit-ci-policy.mjs')),
    copyFile(new URL('package.json', sourceRoot), join(root, 'package.json')),
    cp(new URL('.github/workflows/', sourceRoot), join(root, '.github/workflows'), { recursive: true }),
  ]);
  return root;
}

function replace(source, before, after) {
  assert.ok(source.includes(before), `fixture no longer contains ${JSON.stringify(before)}`);
  return source.replace(before, after);
}

function changeJob(source, name, mutate) {
  const marker = `\n  ${name}:\n`;
  const start = source.indexOf(marker);
  assert.ok(start >= 0, `fixture job missing: ${name}`);
  const bodyStart = start + marker.length;
  const next = source.slice(bodyStart).search(/\n  [a-z][a-z-]*:\n/);
  const end = next < 0 ? source.length : bodyStart + next;
  return source.slice(0, start) + mutate(source.slice(start, end)) + source.slice(end);
}

function audit(root) {
  return spawnSync(process.execPath, [join(root, 'scripts/audit-ci-policy.mjs')], {
    cwd: root, encoding: 'utf8', timeout: 10_000,
  });
}

test('the current workflow and package contracts satisfy the CI policy', async (t) => {
  const result = audit(await fixture(t));
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /CI policy OK:/);
});

const workflowRegressions = [
  ['binary release payload returning to Git', 'publish',
    (job) => replace(job, 'node scripts/publish-static-assets.mjs release publish',
      'bash deploy/prepare-static-transport.sh release publish'), /assets hors Git/],
  ['publisher missing the Release asset publisher', 'publish',
    (job) => replace(job, '            /scripts/publish-static-assets.mjs\n', ''), /publisher doit charger/],
  ['publisher missing a verifier dependency', 'publish',
    (job) => replace(job, '            /scripts/black-box-contract.mjs\n', ''), /publisher doit charger/],
  ['a full binary history checkout', 'build',
    (job) => replace(job, 'fetch-depth: 1', 'fetch-depth: 0'), /checkout peu profond/],
  ['recompressing already compressed release parts', 'publish',
    (job) => replace(job, 'git config core.compression 0', 'git config core.compression 6'), /transport gzip/],
  ['delta search over compressed release parts', 'publish',
    (job) => replace(job, 'git config pack.window 0', 'git config pack.window 10'), /transport gzip/],
  ['publication without SVG dependency', 'publish',
    (job) => replace(job, 'needs: [build, svg-source]', 'needs: [build]'), /publication doit attendre tous les tests/],
  ['build with publication permissions', 'build',
    (job) => replace(job, 'contents: read', 'contents: write'), /seul le job final/],
  ['PR gate without SVG dependency', 'validate-pr',
    (job) => replace(job, 'needs: [validate-pr-build, svg-source]', 'needs: [validate-pr-build]'), /check PR historique/],
  ['PR gate ignoring a failed SVG result', 'validate-pr',
    (job) => replace(job, ' && test "$SVG_RESULT" = success', ''), /check PR historique/],
  ['a missing SVG shard', 'svg-source',
    (job) => replace(job, "['1/4', '2/4', '3/4', '4/4']", "['1/4', '2/4', '3/4']"), /quatre partitions SVG/],
  ['a duplicated SVG shard', 'svg-source',
    (job) => replace(job, "['1/4', '2/4', '3/4', '4/4']", "['1/4', '2/4', '3/4', '3/4']"), /quatre partitions SVG/],
  ['an excluded SVG shard', 'svg-source',
    (job) => replace(job, "        shard: ['1/4', '2/4', '3/4', '4/4']\n", "        shard: ['1/4', '2/4', '3/4', '4/4']\n        exclude:\n          - shard: '4/4'\n"), /quatre partitions SVG/],
  ['SVG fail-fast dropping unfinished partitions', 'svg-source',
    (job) => replace(job, 'fail-fast: false', 'fail-fast: true'), /quatre partitions SVG/],
  ['an optional SVG shard job', 'svg-source',
    (job) => replace(job, '    strategy:\n', '    continue-on-error: true\n    strategy:\n'), /quatre partitions SVG/],
  ['a conditionally skipped SVG shard job', 'svg-source',
    (job) => replace(job, '    strategy:\n', "    if: matrix.shard != '4/4'\n    strategy:\n"), /quatre partitions SVG/],
  ['the shard index replaced with one fixed partition', 'svg-source',
    (job) => replace(job, 'SVG_SHARD: ${{ matrix.shard }}', "SVG_SHARD: '1/4'"), /quatre partitions SVG/],
  ['a source suite failure ignored by the shell', 'svg-source',
    (job) => replace(job, 'npm run test:inline-svg:source -- --shard "$SVG_SHARD"', 'npm run test:inline-svg:source -- --shard "$SVG_SHARD" || true'), /quatre partitions SVG/],
  ['a second Astro invocation in the workflow', 'build',
    (job) => replace(job, '    steps:\n', '    steps:\n      - run: npx astro build\n'), /rendu Astro unique/],
  ['a PR job writing the OG cache', 'validate-pr-build',
    (job) => replace(job, 'actions/cache/restore@', 'actions/cache/save@'), /écritures PR/],
  ['restoring the whole Astro cache including executable metadata', 'build',
    (job) => replace(job, '            .cache/astro-incremental/incremental-build.json\n', '            .cache/astro-incremental\n'), /cache éditorial limité/],
  ['restoring live public snapshots as cache', 'validate-pr-build',
    (job) => replace(job, '            .cache/derived-assets\n', '            public\n'), /cache éditorial limité/],
  ['restoring an unversioned shared cache key', 'build',
    (job) => replace(job, '-editorial-v1-', '-editorial-'), /cache éditorial limité/],
  ['saving editorial cache outside canonical main', 'build',
    (job) => replace(job, "if: github.repository == 'bluetouff/l0g' && github.ref == 'refs/heads/main' && github.event_name != 'pull_request'", "if: github.ref == 'refs/heads/main'"), /cache éditorial doit être sauvé/],
  ['saving editorial cache after a failed build', 'build',
    (job) => replace(job, "if: github.repository == 'bluetouff/l0g'", "if: always() && github.repository == 'bluetouff/l0g'"), /cache éditorial doit être sauvé/],
  ['saving editorial cache without integrity receipt', 'build',
    (job) => {
      const marker = job.indexOf('      - name: Save verified editorial build cache');
      assert.ok(marker > 0);
      return job.slice(0, marker) + replace(job.slice(marker), '            .cache/astro-incremental/l0g-integrity.json\n', '');
    }, /cache éditorial doit être sauvé/],
];

for (const [name, jobName, mutate, reason] of workflowRegressions) {
  test(`CI policy rejects ${name}`, async (t) => {
    const root = await fixture(t);
    const file = join(root, '.github/workflows/build.yml');
    await writeFile(file, changeJob(await readFile(file, 'utf8'), jobName, mutate));
    const result = audit(root);
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, reason);
  });
}

const packageRegressions = [
  ['local build dropping SVG validation', 'build', ' && npm run test:inline-svg', '', /mêmes contrôles complets/],
  ['CI build dropping rendered SVG validation', 'build:ci', ' && npm run test:inline-svg:rendered', '', /mêmes contrôles complets/],
  ['all builds dropping secret scanning', 'build:verify', ' && npm run test:secrets', '', /analyser les secrets/],
  ['a second Astro invocation in the CI script', 'build:ci', 'astro build', 'astro build && astro build', /rendu Astro unique/],
  ['skipping native cache preflight', 'build:ci', 'node scripts/incremental-cache.mjs prepare && ', '', /mêmes contrôles complets/],
  ['sealing before output validation', 'build:ci', 'npm run build:verify && node scripts/incremental-cache.mjs seal', 'node scripts/incremental-cache.mjs seal && npm run build:verify', /mêmes contrôles complets/],
  ['dropping cache integrity tests', 'build:prepare', 'npm run test:incremental-cache && ', '', /tester le repli sûr/],
];

for (const [name, script, before, after, reason] of packageRegressions) {
  test(`CI policy rejects ${name}`, async (t) => {
    const root = await fixture(t);
    const file = join(root, 'package.json');
    const pkg = JSON.parse(await readFile(file, 'utf8'));
    pkg.scripts[script] = replace(pkg.scripts[script], before, after);
    await writeFile(file, JSON.stringify(pkg));
    const result = audit(root);
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, reason);
  });
}
