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
  ['publication without SVG dependency', 'publish',
    (job) => replace(job, 'needs: [build, svg-source]', 'needs: [build]'), /publication doit attendre tous les tests/],
  ['build with publication permissions', 'build',
    (job) => replace(job, 'contents: read', 'contents: write'), /seul le job final/],
  ['PR gate without SVG dependency', 'validate-pr',
    (job) => replace(job, 'needs: [validate-pr-build, svg-source]', 'needs: [validate-pr-build]'), /check PR historique/],
  ['PR gate ignoring a failed SVG result', 'validate-pr',
    (job) => replace(job, ' && test "$SVG_RESULT" = success', ''), /check PR historique/],
  ['a second Astro invocation in the workflow', 'build',
    (job) => replace(job, '    steps:\n', '    steps:\n      - run: npx astro build\n'), /rendu Astro unique/],
  ['a PR job writing the OG cache', 'validate-pr-build',
    (job) => replace(job, 'actions/cache/restore@', 'actions/cache/save@'), /écritures PR/],
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
