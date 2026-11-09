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

for (const [name, before, after] of [
  ['a foreign CodeQL bundle repository', 'api.github.com/repos/github/codeql-action/releases/assets/', 'api.github.com/repos/untrusted/tool/releases/assets/'],
  ['an unchecked CodeQL bundle', 'sha256sum --check --strict', 'true'],
  ['an unbounded CodeQL download', '--max-time 300', ''],
  ['CodeQL using another file', 'tools: ${{ runner.temp }}/codeql-bundle-2.27.4.tar.zst', 'tools: ${{ runner.temp }}/unverified.tar.zst'],
]) {
  test(`CI policy rejects ${name}`, async t => {
    const root = await fixture(t), file = join(root, '.github/workflows/codeql.yml');
    await writeFile(file, replace(await readFile(file, 'utf8'), before, after));
    const result = audit(root);
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, /bundle CodeQL officiel|bundle local vérifié/);
  });
}

const canonicalCodeqlBundleUrl = 'https://api.github.com/repos/github/codeql-action/releases/assets/692235033';
const canonicalCodeqlBundleLine = '            ' + canonicalCodeqlBundleUrl + ' ' + '\\';

for (const [name, mutate] of [
  ['LF', source => source],
  ['CRLF', source => source.replaceAll('\n', '\r\n')],
  ['a harmless URL comment', source => source + '\n# Reference: https://example.invalid/codeql\n'],
  ['equivalent YAML indentation', source => source.replace(/^ {10}/gmu, '            ')],
]) {
  test(`CI policy accepts the canonical CodeQL bundle URL with ${name}`, async t => {
    const root = await fixture(t), file = join(root, '.github/workflows/codeql.yml');
    await writeFile(file, mutate(await readFile(file, 'utf8')));
    const result = audit(root);
    assert.equal(result.status, 0, result.stderr);
  });
}

for (const [name, replacement] of [
  ['a suffixed official hostname', canonicalCodeqlBundleUrl.replace('api.github.com', 'api.github.com.evil.invalid')],
  ['the official hostname used as userinfo', canonicalCodeqlBundleUrl.replace('api.github.com', 'api.github.com@evil.invalid')],
  ['credentials on the official hostname', canonicalCodeqlBundleUrl.replace('api.github.com', 'user@api.github.com')],
  ['a trusted URL hidden in a foreign query', `https://evil.invalid/?next=${canonicalCodeqlBundleUrl}`],
  ['a trusted URL hidden in a foreign fragment', `https://evil.invalid/#${canonicalCodeqlBundleUrl}`],
  ['a trusted URL hidden in a foreign path', `https://evil.invalid/${canonicalCodeqlBundleUrl}`],
  ['a query appended to the official URL', `${canonicalCodeqlBundleUrl}?other=1`],
  ['a fragment appended to the official URL', `${canonicalCodeqlBundleUrl}#other`],
  ['text prefixed to the official URL', `prefix${canonicalCodeqlBundleUrl}`],
  ['a shell command before the official URL', `echo ${canonicalCodeqlBundleUrl}`],
  ['an HTTP official URL', canonicalCodeqlBundleUrl.replace('https:', 'http:')],
  ['a different asset ID', canonicalCodeqlBundleUrl.replace('692235033', '692235034')],
  ['an encoded hostname delimiter', canonicalCodeqlBundleUrl.replace('api.github.com', 'api%2egithub.com')],
  ['a control character within the URL', canonicalCodeqlBundleUrl.replace('api.github.com', 'api.github.com\t')],
]) {
  test(`CI policy rejects ${name}`, async t => {
    const root = await fixture(t), file = join(root, '.github/workflows/codeql.yml');
    await writeFile(file, replace(await readFile(file, 'utf8'), canonicalCodeqlBundleUrl, replacement));
    const result = audit(root);
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, /bundle CodeQL officiel/);
  });
}

for (const [name, replacement] of [
  ['a missing CodeQL asset operand', ''],
  ['duplicate CodeQL asset operands', `${canonicalCodeqlBundleLine}\n${canonicalCodeqlBundleLine}`],
  ['a commented CodeQL asset operand', '          # ' + canonicalCodeqlBundleUrl],
  ['a foreign operand with a trusted comment decoy', `            https://evil.invalid/bundle \\\n          # ${canonicalCodeqlBundleUrl}`],
]) {
  test(`CI policy rejects ${name}`, async t => {
    const root = await fixture(t), file = join(root, '.github/workflows/codeql.yml');
    await writeFile(file, replace(await readFile(file, 'utf8'), canonicalCodeqlBundleLine, replacement));
    const result = audit(root);
    assert.equal(result.status, 1, result.stderr);
    assert.match(result.stderr, /bundle CodeQL officiel/);
  });
}

test('CI policy rejects an extra schemeless HTTPS curl operand', async t => {
  const root = await fixture(t), file = join(root, '.github/workflows/codeql.yml');
  await writeFile(file, replace(await readFile(file, 'utf8'), 'curl --proto', 'curl --proto-default https --url evil.invalid --proto'));
  const result = audit(root);
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stderr, /bundle CodeQL officiel/);
});

const workflowRegressions = [
  ['an unbounded PR build', 'validate-pr-build',
    (job) => replace(job, '    timeout-minutes: 30\n', ''), /validation PR doit être bornée/],
  ['an oversized static build budget', 'build',
    (job) => replace(job, 'timeout-minutes: 30', 'timeout-minutes: 360'), /build statique doit rester borné/],
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

test('CI policy rejects an unbounded MCP build', async t => {
  const root = await fixture(t), file = join(root, '.github/workflows/publish-mcp.yml');
  await writeFile(file, changeJob(await readFile(file, 'utf8'), 'build', job => replace(job, '    timeout-minutes: 30\n', '')));
  const result = audit(root);
  assert.equal(result.status, 1, result.stderr);
  assert.match(result.stderr, /build MCP doit rester borné/);
});

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
