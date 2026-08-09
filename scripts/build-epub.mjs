import { cpSync, mkdtempSync, mkdirSync, readdirSync, renameSync, rmSync, statSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const SOURCE = join(ROOT, 'src/epub/l-argent-d-epstein');
const OUTPUT = join(ROOT, 'public/publications/l-argent-d-epstein-l0g.epub');
const FIXED_TIME = new Date('2026-08-09T17:32:00Z');

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory() ? listFiles(path) : [path];
    })
    .sort((a, b) => a.localeCompare(b, 'en'));
}

function runZip(cwd, args) {
  const result = spawnSync('zip', args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, TZ: 'UTC' },
  });

  if (result.status !== 0) {
    throw new Error(`zip failed (${result.status}):\n${result.stdout}\n${result.stderr}`);
  }
}

const work = mkdtempSync(join(tmpdir(), 'l0g-epub-build-'));
const stagedSource = join(work, 'source');
const stagedOutput = join(work, 'l-argent-d-epstein-l0g.epub');

try {
  cpSync(SOURCE, stagedSource, { recursive: true });

  for (const path of listFiles(stagedSource)) {
    utimesSync(path, FIXED_TIME, FIXED_TIME);
  }

  runZip(stagedSource, ['-X', '-0', stagedOutput, 'mimetype']);

  const contentFiles = listFiles(stagedSource)
    .map((path) => relative(stagedSource, path))
    .filter((path) => path !== 'mimetype');

  runZip(stagedSource, ['-X', '-9', '-D', stagedOutput, ...contentFiles]);

  mkdirSync(dirname(OUTPUT), { recursive: true });
  renameSync(stagedOutput, OUTPUT);

  const bytes = statSync(OUTPUT).size;
  console.log(`EPUB construit : ${relative(ROOT, OUTPUT)} (${bytes} octets)`);
} finally {
  rmSync(work, { recursive: true, force: true });
}
