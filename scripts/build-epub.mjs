import { cpSync, mkdtempSync, mkdirSync, readdirSync, renameSync, rmSync, statSync, utimesSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const FIXED_TIME = new Date('2026-08-09T17:32:00Z');
const BOOKS = [
  {
    source: join(ROOT, 'src/epub/grand-peage-facture'),
    output: join(ROOT, 'public/publications/grand-peage-facture-enquete-l0g.epub'),
    fixedTime: new Date('2026-08-22T18:30:00Z'),
  },
  {
    source: join(ROOT, 'src/epub/great-e-invoicing-toll'),
    output: join(ROOT, 'public/publications/great-e-invoicing-toll-investigation-l0g.epub'),
    fixedTime: new Date('2026-08-22T18:30:00Z'),
  },
  {
    source: join(ROOT, 'src/epub/eau-electricite'),
    output: join(ROOT, 'public/publications/eau-electricite-europe-l0g.epub'),
    fixedTime: new Date('2026-08-21T15:30:00Z'),
  },
  {
    source: join(ROOT, 'src/epub/water-electricity'),
    output: join(ROOT, 'public/publications/water-electricity-europe-l0g.epub'),
    fixedTime: new Date('2026-08-21T15:30:00Z'),
  },
  {
    source: join(ROOT, 'src/epub/euro-numerique'),
    output: join(ROOT, 'public/publications/euro-numerique-enquete-l0g.epub'),
    fixedTime: new Date('2026-08-16T10:00:00Z'),
  },
  {
    source: join(ROOT, 'src/epub/digital-euro'),
    output: join(ROOT, 'public/publications/digital-euro-investigation-l0g.epub'),
    fixedTime: new Date('2026-08-16T10:00:00Z'),
  },
  {
    source: join(ROOT, 'src/epub/l-argent-d-epstein'),
    output: join(ROOT, 'public/publications/l-argent-d-epstein-l0g.epub'),
  },
  {
    source: join(ROOT, 'src/epub/epsteins-money'),
    output: join(ROOT, 'public/publications/epsteins-money-l0g.epub'),
  },
  {
    source: join(ROOT, 'src/epub/auditer-l-opacite'),
    output: join(ROOT, 'public/publications/auditer-l-opacite-bluetouff.epub'),
    fixedTime: new Date('2026-08-12T17:00:00Z'),
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
      const fixedTime = book.fixedTime ?? FIXED_TIME;
      utimesSync(path, fixedTime, fixedTime);
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
