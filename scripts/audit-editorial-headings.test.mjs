import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const audit = fileURLToPath(new URL('./audit-editorial-headings.mjs', import.meta.url));

async function inspect(heading, route = '', tag = 'h1') {
  const directory = await mkdtemp(join(tmpdir(), 'l0g-heading-'));
  try {
    const target = join(directory, 'dist', route);
    await mkdir(target, { recursive: true });
    await writeFile(join(target, 'index.html'), `<${tag}>${heading}</${tag}>`);
    return spawnSync(process.execPath, [audit], { cwd: directory, encoding: 'utf8' });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test('Unicode letters and combining marks keep names and words intact', async () => {
  for (const heading of ['El Niño', 'El Nin\u0303o', 'Niğde', 'Île de Ré', 'écontre', 'contreé', 'noté', 'sanscrit', 'maisons', 'niche']) {
    const result = await inspect(heading);
    assert.equal(result.status, 0, `${heading}: ${result.stderr}`);
  }
});

test('standalone prohibited words and negative contractions remain blocked', async () => {
  for (const heading of ['X, pas Y', 'sans dette', 'mais demain', 'ni A ni B', 'contre le risque', 'not today', 'without debt', 'but tomorrow', 'A versus B', 'neither A nor B', 'A vs. B', "isn't ready", 'can’t continue', 'Énergie : PAS maintenant']) {
    const result = await inspect(heading);
    assert.equal(result.status, 1, `${heading}: ${result.stdout} ${result.stderr}`);
    assert.match(result.stderr, /opposition\(s\) mécanique\(s\)/u);
  }
});

test('the existing analysis-route boundary is preserved', async () => {
  for (const route of ['posts/example', 'en/analysis/example']) {
    const result = await inspect('X, pas Y', route);
    assert.equal(result.status, 0, result.stderr);
  }
});

test('the exact non-recourse glossary term is allowed while surrounding contrasts remain blocked', async () => {
  const route = 'glossaire/financement-sans-recours';
  const allowed = await inspect('Financement sans recours', route);
  assert.equal(allowed.status, 0, allowed.stderr);
  for (const [heading, candidateRoute, tag] of [
    ['Financement sans recours, mais avec dette', route, 'h1'],
    ['Financement sans recours', 'glossaire/example', 'h1'],
    ['Financement sans recours', route, 'h2'],
    ['Un financement sans recours', route, 'h1'],
  ]) {
    const blocked = await inspect(heading, candidateRoute, tag);
    assert.equal(blocked.status, 1, `${candidateRoute} ${tag}: ${blocked.stderr}`);
  }
});

test('the exact non-voting share glossary term is allowed while surrounding contrasts remain blocked', async () => {
  const route = 'glossaire/action-sans-droit-de-vote';
  const allowed = await inspect('Action sans droit de vote', route);
  assert.equal(allowed.status, 0, allowed.stderr);
  for (const [heading, candidateRoute, tag] of [
    ['Action sans droit de vote, mais avec contrôle', route, 'h1'],
    ['Action sans droit de vote', 'glossaire/example', 'h1'],
    ['Action sans droit de vote', route, 'h2'],
    ['Une action sans droit de vote', route, 'h1'],
  ]) {
    const blocked = await inspect(heading, candidateRoute, tag);
    assert.equal(blocked.status, 1, `${candidateRoute} ${tag}: ${blocked.stderr}`);
  }
});

test('the exact unaided-assessment glossary term is allowed only as its own H1', async () => {
  const route = 'glossaire/evaluation-sans-assistance';
  const allowed = await inspect('Évaluation sans assistance', route);
  assert.equal(allowed.status, 0, allowed.stderr);
  for (const [heading, candidateRoute, tag] of [
    ['Évaluation sans assistance, mais avec méthode', route, 'h1'],
    ['Évaluation sans assistance', 'glossaire/example', 'h1'],
    ['Évaluation sans assistance', `${route}-example`, 'h1'],
    ['Évaluation sans assistance', route, 'h2'],
    ['Évaluation sans assistance', route, 'h3'],
    ['Une évaluation sans assistance', route, 'h1'],
  ]) {
    const blocked = await inspect(heading, candidateRoute, tag);
    assert.equal(blocked.status, 1, `${candidateRoute} ${tag}: ${blocked.stderr}`);
  }
});
