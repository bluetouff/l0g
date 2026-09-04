import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import test from 'node:test';

const checker = fileURLToPath(new URL('./check-internal-links.mjs', import.meta.url));

function fixture(t, html, files = []) {
  const root = mkdtempSync(join(tmpdir(), 'l0g-internal-links-'));
  const dist = join(root, 'dist');
  mkdirSync(dist, { recursive: true });
  writeFileSync(join(dist, 'index.html'), html);
  for (const file of files) {
    const target = join(dist, file);
    mkdirSync(join(target, '..'), { recursive: true });
    writeFileSync(target, 'fixture');
  }
  t.after(() => rmSync(root, { recursive: true, force: true }));
  return root;
}

function runChecker(cwd) {
  return spawnSync(process.execPath, ['--experimental-strip-types', checker], {
    cwd,
    encoding: 'utf8',
  });
}

test('une image og:image interne absente fait échouer le contrôle', (t) => {
  const cwd = fixture(t, '<meta property="og:image" content="https://l0g.fr/missing-social.jpg">');
  const result = runChecker(cwd);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /missing-social\.jpg/);
});

test('les images og:image et twitter:image présentes passent', (t) => {
  const cwd = fixture(t, [
    '<meta property="og:image" content="https://l0g.fr/social.jpg">',
    '<meta name="twitter:image" content="https://l0g.fr/social.jpg">',
  ].join('\n'), ['social.jpg']);
  const result = runChecker(cwd);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /aucun cassé/);
});
