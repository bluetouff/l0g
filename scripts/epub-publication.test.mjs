import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, normalize, relative, resolve } from 'node:path';
import test from 'node:test';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const SOURCE = join(ROOT, 'src/epub/l-argent-d-epstein');
const EPUB = join(ROOT, 'public/publications/l-argent-d-epstein-l0g.epub');
const PAGE = join(ROOT, 'src/pages/publications/l-argent-d-epstein.astro');
const MAPS = [
  {
    path: join(ROOT, 'public/publications/l-argent-d-epstein-carte-consolidee-1.png'),
    width: 1972,
    height: 1594,
  },
  {
    path: join(ROOT, 'public/publications/l-argent-d-epstein-carte-consolidee-2.png'),
    width: 1964,
    height: 1380,
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

function textualFiles() {
  return listFiles(SOURCE).filter((path) => /\.(?:css|ncx|opf|xhtml|xml)$/u.test(path));
}

function localReferences(markup) {
  return [...markup.matchAll(/\b(?:href|src)="([^"]+)"/gu)]
    .map((match) => match[1])
    .filter((href) => !/^(?:[a-z]+:|\/\/)/iu.test(href));
}

function assertSvgTextFits(label, source, width, margin) {
  for (const match of source.matchAll(/<ns0:text\b([^>]*)>([^<]*)<\/ns0:text>/gu)) {
    const attributes = match[1];
    const text = match[2].replaceAll('&amp;', '&').replaceAll('&#39;', '’');
    const x = Number(attributes.match(/\bx="([0-9.]+)"/u)?.[1] ?? 0);
    const fontSize = Number(attributes.match(/font-size="([0-9.]+)"/u)?.[1] ?? 16);
    const anchor = attributes.match(/text-anchor="([^"]+)"/u)?.[1] ?? 'start';
    const estimatedWidth = text.length * fontSize * 0.64;
    const left = anchor === 'middle' ? x - estimatedWidth / 2 : anchor === 'end' ? x - estimatedWidth : x;
    const right = anchor === 'middle' ? x + estimatedWidth / 2 : anchor === 'end' ? x : x + estimatedWidth;

    assert.ok(
      left >= margin / 2 && right <= width - margin,
      `${label} risque de déborder : « ${text} » (${left.toFixed(1)} à ${right.toFixed(1)} sur ${width})`,
    );
  }
}

test('l’archive EPUB respecte les contraintes de conteneur', () => {
  assert.ok(existsSync(EPUB), 'le fichier EPUB public doit exister');

  const entries = execFileSync('unzip', ['-Z1', EPUB], { encoding: 'utf8' }).trim().split('\n');
  assert.equal(entries[0], 'mimetype', 'mimetype doit être la première entrée');
  assert.equal(entries.filter((entry) => entry === 'mimetype').length, 1);

  const listing = execFileSync('unzip', ['-lv', EPUB], { encoding: 'utf8' });
  const mimetypeLine = listing.split('\n').find((line) => /\bmimetype\s*$/u.test(line));
  assert.match(mimetypeLine ?? '', /\bStored\b/u, 'mimetype doit être stocké sans compression');

  const mimetype = execFileSync('unzip', ['-p', EPUB, 'mimetype'], { encoding: 'utf8' });
  assert.equal(mimetype, 'application/epub+zip');
});

test('le contenu embarqué correspond exactement aux sources versionnées', () => {
  const expected = listFiles(SOURCE).map((path) => relative(SOURCE, path));
  const archived = execFileSync('unzip', ['-Z1', EPUB], { encoding: 'utf8' }).trim().split('\n').sort();
  assert.deepEqual(archived, expected.sort());

  for (const path of textualFiles()) {
    const archivedText = execFileSync('unzip', ['-p', EPUB, relative(SOURCE, path)], { encoding: 'utf8' });
    assert.equal(archivedText, readFileSync(path, 'utf8'), relative(ROOT, path));
  }
});

test('les titres, ressources et métadonnées sont propres', () => {
  const corpus = textualFiles().map((path) => readFileSync(path, 'utf8')).join('\n');
  const opf = readFileSync(join(SOURCE, 'EPUB/content.opf'), 'utf8');
  const css = readFileSync(join(SOURCE, 'EPUB/styles/stylesheet1.css'), 'utf8');
  const svgFiles = listFiles(join(SOURCE, 'EPUB/media')).filter((path) => path.endsWith('.svg'));

  assert.equal(corpus.includes('\u{2014}'), false, 'aucun tiret quadratin ne doit être publié');
  assert.equal(corpus.includes('.svgz'), false, 'aucune fausse extension SVG compressée');
  assert.doesNotMatch(corpus, /<title>ch\d+\.xhtml<\/title>/u);
  assert.doesNotMatch(corpus, /class="level1 part-title part-page"/u);
  assert.equal(svgFiles.length, 20, 'les vingt infographies doivent être présentes');
  assert.equal((corpus.match(/class="infographic-image"/gu) ?? []).length, 20);
  assert.match(css, /\.part-page > \.part-title/u);
  assert.match(opf, /schema:accessibilitySummary/u);
  assert.match(opf, /https:\/\/l0g\.fr\/publications\/l-argent-d-epstein\//u);
});

test('les libellés des vingt SVG gardent une marge de sécurité', () => {
  for (const path of listFiles(join(SOURCE, 'EPUB/media')).filter((file) => file.endsWith('.svg'))) {
    const source = readFileSync(path, 'utf8');
    const width = Number(source.match(/viewBox="0 0 ([0-9.]+)/u)?.[1]);
    const desktop = source.replace(/<ns0:g class="mobile"[\s\S]*?<\/ns0:g>/gu, '');
    const mobile = source.match(/<ns0:g class="mobile"[^>]*>([\s\S]*?)<\/ns0:g>/u)?.[1];

    assert.ok(Number.isFinite(width), `${relative(ROOT, path)} doit déclarer un viewBox`);
    assertSvgTextFits(`${relative(ROOT, path)} desktop`, desktop, width, width >= 700 ? 36 : 24);

    if (mobile) {
      assertSvgTextFits(`${relative(ROOT, path)} mobile`, mobile, 350, 20);
    }
  }
});

test('tous les liens locaux et fragments internes se résolvent', () => {
  for (const path of textualFiles().filter((file) => /\.(?:ncx|opf|xhtml|xml)$/u.test(file))) {
    const markup = readFileSync(path, 'utf8');

    for (const reference of localReferences(markup)) {
      const [rawTarget, fragment] = reference.split('#');
      const targetPath = rawTarget ? normalize(join(dirname(path), decodeURI(rawTarget))) : path;

      assert.ok(existsSync(targetPath), `${relative(ROOT, path)} référence ${reference}`);

      if (fragment) {
        const target = readFileSync(targetPath, 'utf8');
        const decodedFragment = decodeURIComponent(fragment);
        assert.ok(
          target.includes(`id="${decodedFragment}"`),
          `${relative(ROOT, path)} référence le fragment absent ${reference}`,
        );
      }
    }
  }
});

test('la page de publication expose le bon fichier et sa traçabilité', () => {
  const page = readFileSync(PAGE, 'utf8');
  const bytes = readFileSync(EPUB);
  const sha256 = createHash('sha256').update(bytes).digest('hex');

  assert.match(page, /\/publications\/l-argent-d-epstein-l0g\.epub/u);
  assert.match(page, /download/u);
  assert.match(page, /createHash\('sha256'\)/u);
  assert.match(page, /l-argent-d-epstein-carte-consolidee-1\.png/u);
  assert.match(page, /l-argent-d-epstein-carte-consolidee-2\.png/u);

  for (const map of MAPS) {
    const image = readFileSync(map.path);
    assert.equal(image.subarray(1, 4).toString('ascii'), 'PNG');
    assert.equal(image.readUInt32BE(16), map.width);
    assert.equal(image.readUInt32BE(20), map.height);
  }

  assert.equal(sha256.length, 64);
});
