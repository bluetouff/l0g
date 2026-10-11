import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

const audit = fileURLToPath(new URL('./audit-editorial-headings.mjs', import.meta.url));

async function inspect(heading, route = '') {
  const directory = await mkdtemp(join(tmpdir(), 'l0g-heading-'));
  try {
    const target = join(directory, 'dist', route);
    await mkdir(target, { recursive: true });
    await writeFile(join(target, 'index.html'), `<h1>${heading}</h1>`);
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
