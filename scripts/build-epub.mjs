import { cpSync, mkdtempSync, mkdirSync, readdirSync, renameSync, rmSync, statSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const FIXED_TIME = new Date('2026-08-09T17:32:00Z');
const BOOKS = [
  {
    source: join(ROOT, 'src/epub/l-argent-d-epstein'),
    output: join(ROOT, 'public/publications/l-argent-d-epstein-l0g.epub'),
  },
  {
    source: join(ROOT, 'src/epub/epsteins-money'),
    output: join(ROOT, 'public/publications/epsteins-money-l0g.epub'),
  },
];

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

for (const [index, book] of BOOKS.entries()) {
  const work = mkdtempSync(join(tmpdir(), `l0g-epub-build-${index}-`));
  const stagedSource = join(work, 'source');
  const stagedOutput = join(work, basename(book.output));

  try {
    cpSync(book.source, stagedSource, { recursive: true });

    for (const path of listFiles(stagedSource)) {
      utimesSync(path, FIXED_TIME, FIXED_TIME);
    }

    runZip(stagedSource, ['-X', '-0', stagedOutput, 'mimetype']);

    const contentFiles = listFiles(stagedSource)
      .map((path) => relative(stagedSource, path))
      .filter((path) => path !== 'mimetype');

    runZip(stagedSource, ['-X', '-9', '-D', stagedOutput, ...contentFiles]);

    mkdirSync(dirname(book.output), { recursive: true });
    renameSync(stagedOutput, book.output);

    const bytes = statSync(book.output).size;
    console.log(`EPUB construit : ${relative(ROOT, book.output)} (${bytes} octets)`);
  } finally {
    rmSync(work, { recursive: true, force: true });
  }
}
