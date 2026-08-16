import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, normalize, relative, resolve } from 'node:path';
import test from 'node:test';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const SOURCE = join(ROOT, 'src/epub/euro-numerique');
const EPUB = join(ROOT, 'public/publications/euro-numerique-enquete-l0g.epub');
const EN_SOURCE = join(ROOT, 'src/epub/digital-euro');
const EN_EPUB = join(ROOT, 'public/publications/digital-euro-investigation-l0g.epub');
const FR_PAGE = join(ROOT, 'src/pages/publications/euro-numerique.astro');
const EN_PAGE = join(ROOT, 'src/pages/en/publications/digital-euro.astro');
const PAGE_COMPONENT = join(ROOT, 'src/components/DigitalEuroEpubPage.astro');

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => entry.isDirectory() ? listFiles(join(directory, entry.name)) : [join(directory, entry.name)])
    .sort((a, b) => a.localeCompare(b, 'fr'));
}

function textualFiles() {
  return listFiles(SOURCE).filter((path) => /\.(?:css|ncx|opf|svg|xhtml|xml)$/u.test(path));
}

test('l’EPUB Euro numérique est un conteneur valide et reproductible', () => {
  assert.ok(existsSync(EPUB));
  const entries = execFileSync('unzip', ['-Z1', EPUB], { encoding: 'utf8' }).trim().split('\n');
  assert.equal(entries[0], 'mimetype');
  assert.equal(execFileSync('unzip', ['-p', EPUB, 'mimetype'], { encoding: 'utf8' }), 'application/epub+zip');
  assert.match(execFileSync('unzip', ['-lv', EPUB], { encoding: 'utf8' }).split('\n').find((line) => /\bmimetype\s*$/u.test(line)) ?? '', /\bStored\b/u);
  assert.deepEqual(entries.sort(), listFiles(SOURCE).map((path) => relative(SOURCE, path)).sort());
  for (const path of textualFiles()) {
    assert.equal(execFileSync('unzip', ['-p', EPUB, relative(SOURCE, path)], { encoding: 'utf8' }), readFileSync(path, 'utf8'));
  }
});

test('le livre contient les six enquêtes et vingt-deux infographies accessibles', () => {
  const corpus = textualFiles().map((path) => readFileSync(path, 'utf8')).join('\n');
  const opf = readFileSync(join(SOURCE, 'EPUB/content.opf'), 'utf8');
  const articles = corpus.match(/id="article-[1-6]"/gu) ?? [];
  const images = corpus.match(/class="infographic-image"/gu) ?? [];
  const svgFiles = listFiles(join(SOURCE, 'EPUB/media')).filter((path) => path.endsWith('.svg'));
  assert.equal(articles.length, 6);
  assert.equal(images.length, 22);
  assert.equal(svgFiles.length, 22);
  assert.equal(corpus.includes('\u{2014}'), false, 'aucun tiret quadratin ne doit être publié');
  assert.doesNotMatch(corpus, /DigitalEuroCostSimulator|<script\b|<foreignObject\b/iu);
  assert.match(corpus, /Simulateur interactif/u);
  assert.match(corpus, /Enquêter sur une monnaie qui n’existe pas encore/u);
  assert.match(corpus, /Ce que signifie « sources ouvertes »/u);
  assert.match(corpus, /Ce que cette enquête ne peut pas établir/u);
  assert.match(opf, /schema:accessibilitySummary/u);
  assert.match(opf, /Creative Commons Attribution 4\.0/u);
  for (const image of corpus.matchAll(/class="infographic-image" alt="([^"]*)"/gu)) assert.ok(image[1].trim(), 'chaque infographie doit avoir une alternative textuelle');
});

test('tous les liens et fragments internes se résolvent', () => {
  for (const path of textualFiles().filter((file) => /\.(?:ncx|opf|xhtml|xml)$/u.test(file))) {
    const markup = readFileSync(path, 'utf8');
    for (const match of markup.matchAll(/\b(?:href|src)="([^"]+)"/gu)) {
      const reference = match[1];
      if (/^(?:[a-z]+:|\/\/)/iu.test(reference)) continue;
      const [rawTarget, fragment] = reference.split('#');
      const target = rawTarget ? normalize(join(dirname(path), decodeURI(rawTarget))) : path;
      assert.ok(existsSync(target), `${relative(ROOT, path)} référence ${reference}`);
      if (fragment) assert.match(readFileSync(target, 'utf8'), new RegExp(`id="${fragment.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}"`, 'u'));
    }
  }
});

test('the English edition is complete, accessible and reproducible', () => {
  assert.ok(existsSync(EN_EPUB));
  const entries = execFileSync('unzip', ['-Z1', EN_EPUB], { encoding: 'utf8' }).trim().split('\n');
  assert.equal(entries[0], 'mimetype');
  assert.equal(execFileSync('unzip', ['-p', EN_EPUB, 'mimetype'], { encoding: 'utf8' }), 'application/epub+zip');
  assert.deepEqual(entries.sort(), listFiles(EN_SOURCE).map((path) => relative(EN_SOURCE, path)).sort());
  const corpus = listFiles(EN_SOURCE).filter((path) => /\.(?:ncx|opf|svg|xhtml|xml)$/u.test(path)).map((path) => readFileSync(path, 'utf8')).join('\n');
  assert.equal((corpus.match(/id="article-[1-6]"/gu) ?? []).length, 6);
  assert.equal((corpus.match(/class="infographic-image"/gu) ?? []).length, 23);
  assert.equal(listFiles(join(EN_SOURCE, 'EPUB/media')).filter((path) => path.endsWith('.svg')).length, 23);
  assert.match(corpus, /Investigating a currency that does not yet exist/u);
  assert.match(corpus, /What “open sources” means here/u);
  assert.match(corpus, /<dc:language>en<\/dc:language>/u);
  assert.equal(corpus.includes('\u{2014}'), false);
  assert.doesNotMatch(corpus, /DigitalEuroCostSimulator|<script\b|<foreignObject\b/iu);
});

test('the bilingual publication pages expose both exact downloads', () => {
  assert.match(readFileSync(FR_PAGE, 'utf8'), /DigitalEuroEpubPage lang="fr"/u);
  assert.match(readFileSync(EN_PAGE, 'utf8'), /DigitalEuroEpubPage lang="en"/u);
  const component = readFileSync(PAGE_COMPONENT, 'utf8');
  assert.match(component, /euro-numerique-enquete-l0g\.epub/u);
  assert.match(component, /digital-euro-investigation-l0g\.epub/u);
  assert.match(component, /createHash\('sha256'\)/u);
  assert.match(component, /hreflang: 'fr'/u);
  assert.match(component, /hreflang: 'en'/u);
});
