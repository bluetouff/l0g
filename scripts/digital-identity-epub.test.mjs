import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, normalize, relative, resolve } from 'node:path';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import sharp from 'sharp';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const SOURCE = join(ROOT, 'src/epub/votre-identite-dans-un-telephone');
const EPUB = join(ROOT, 'public/publications/votre-identite-dans-un-telephone-enquete-l0g.epub');
const COVER = join(ROOT, 'public/publications/votre-identite-dans-un-telephone-cover.jpg');
const PAGE = join(ROOT, 'src/pages/publications/votre-identite-dans-un-telephone.astro');
const VISUAL_ROOT = join(ROOT, 'public/illustrations/publications');

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => entry.isDirectory() ? listFiles(join(directory, entry.name)) : [join(directory, entry.name)])
    .sort((a, b) => a.localeCompare(b, 'fr'));
}

function textualFiles() {
  return listFiles(SOURCE).filter((path) => /\.(?:css|ncx|opf|svg|xhtml|xml)$/u.test(path));
}

function corpus() {
  return textualFiles().map((path) => readFileSync(path, 'utf8')).join('\n');
}

test('digital identity EPUB container is complete, valid and reproducible', () => {
  assert.ok(existsSync(EPUB));
  const entries = execFileSync('unzip', ['-Z1', EPUB], { encoding: 'utf8' }).trim().split('\n');
  assert.equal(entries[0], 'mimetype');
  assert.equal(execFileSync('unzip', ['-p', EPUB, 'mimetype'], { encoding: 'utf8' }), 'application/epub+zip');
  assert.match(execFileSync('unzip', ['-t', EPUB], { encoding: 'utf8' }), /No errors detected/u);
  assert.match(execFileSync('unzip', ['-lv', EPUB], { encoding: 'utf8' }).split('\n').find((line) => /\bmimetype\s*$/u.test(line)) ?? '', /\bStored\b/u);
  assert.deepEqual(entries.sort(), listFiles(SOURCE).map((path) => relative(SOURCE, path)).sort());

  for (const path of textualFiles()) {
    const markup = readFileSync(path, 'utf8');
    assert.equal(execFileSync('unzip', ['-p', EPUB, relative(SOURCE, path)], { encoding: 'utf8' }), markup);
    if (/\.(?:ncx|opf|svg|xhtml|xml)$/u.test(path)) assert.equal(XMLValidator.validate(markup), true, `${relative(ROOT, path)} must be valid XML`);
  }
});

test('digital identity edition contains eight investigations, introduction, conclusion and 23 infographics', () => {
  const text = corpus();
  const opf = readFileSync(join(SOURCE, 'EPUB/content.opf'), 'utf8');
  assert.equal((text.match(/id="article-[1-8]"/gu) ?? []).length, 8);
  assert.equal((text.match(/class="infographic-image"/gu) ?? []).length, 23);
  assert.equal(listFiles(join(SOURCE, 'EPUB/media')).filter((path) => /file\d+\.svg$/u.test(path)).length, 23);
  assert.equal((text.match(/class="infographic-image" alt="[^"]+"/gu) ?? []).length, 23);
  assert.match(text, /huit preuves à demander avant de déléguer son identité/iu);
  assert.match(text, /publier les preuves d’une identité contrôlable/iu);
  assert.match(text, /Explorateur de traces/u);
  assert.match(text, /comparer les parcours alternatifs/iu);
  assert.match(text, /chronomètre de récupération/iu);
  assert.match(text, /prix de la preuve/iu);
  assert.match(text, /votre téléphone ouvre-t-il vos droits/iu);
  assert.match(text, /Qui demande quoi/iu);
  assert.equal((text.match(/class="epub-disclosure"/gu) ?? []).length, 34);
  assert.equal((text.match(/class="epub-disclosure-title"/gu) ?? []).length, 34);
  assert.match(text, /\.epub-disclosure-title/u);
  const receipt = readFileSync(join(SOURCE, 'EPUB/media/file21.svg'), 'utf8');
  assert.match(receipt, /TABLEAU DE BORD/u);
  assert.match(receipt, /LA PREUVE PRÉCÈDE LA RÉPARATION/u);
  assert.match(opf, /<dc:title>Votre identité dans un téléphone<\/dc:title>/u);
  assert.match(opf, /schema:accessibilitySummary/u);
  assert.match(opf, /Creative Commons Attribution 4\.0/u);
  assert.equal(text.includes('\u{2014}'), false, 'the publication must not contain em dashes');
  assert.doesNotMatch(text, /EudiRequestAudit|<script\b|<foreignObject\b|<iframe\b|javascript:|<\/?(?:details|summary)\b/iu);
  for (const chapter of listFiles(join(SOURCE, 'EPUB/text')).filter((path) => /ch\d+\.xhtml$/u.test(path))) {
    const chapterMarkup = readFileSync(chapter, 'utf8');
    assert.doesNotMatch(chapterMarkup, /\sstyle="/u, `${relative(ROOT, chapter)} must not retain website-only inline styles`);
    assert.doesNotMatch(chapterMarkup, /<(?:svg|text|rect|path|line|circle|ellipse|polyline|polygon|g)\b/iu, `${relative(ROOT, chapter)} must not leak SVG markup into the reading flow`);
  }
});

test('every internal digital identity EPUB file and fragment link resolves', () => {
  for (const path of textualFiles().filter((file) => /\.(?:ncx|opf|xhtml|xml)$/u.test(file))) {
    const markup = readFileSync(path, 'utf8');
    for (const match of markup.matchAll(/\b(?:href|src)="([^"]+)"/gu)) {
      const reference = match[1];
      if (/^(?:[a-z]+:|\/\/)/iu.test(reference)) continue;
      const [rawTarget, fragment] = reference.split('#');
      const target = rawTarget ? normalize(join(dirname(path), decodeURI(rawTarget))) : path;
      assert.ok(existsSync(target), `${relative(ROOT, path)} references ${reference}`);
      if (fragment) assert.match(readFileSync(target, 'utf8'), new RegExp(`id="${fragment.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')}"`, 'u'));
    }
  }
});

test('cover, publication page and catalog expose the exact digital identity edition', async () => {
  const cover = await sharp(COVER).metadata();
  const page = readFileSync(PAGE, 'utf8');
  const spotlight = readFileSync(join(ROOT, 'src/components/PublicationSpotlight.astro'), 'utf8');
  const catalog = readFileSync(join(ROOT, 'src/pages/publications/index.astro'), 'utf8');
  assert.equal(cover.format, 'jpeg');
  assert.equal(cover.width, 1024);
  assert.equal(cover.height, 1638);
  assert.ok(statSync(COVER).size < 256 * 1024, 'the publication cover must stay below 256 KB');
  assert.match(page, /votre-identite-dans-un-telephone-enquete-l0g\.epub/u);
  assert.match(page, /createHash\('sha256'\)/u);
  assert.match(page, /'@type': 'Book'/u);
  assert.match(page, /loading="lazy"/u);
  assert.match(page, /decoding="async"/u);
  assert.match(page, /23 infographies/u);
  assert.match(spotlight, /publication === 'digital-identity'/u);
  assert.match(catalog, /PublicationSpotlight publication="digital-identity"/u);
});

test('the dedicated page and catalog expose five optimized editorial images', async () => {
  const page = readFileSync(PAGE, 'utf8');
  const spotlight = readFileSync(join(ROOT, 'src/components/PublicationSpotlight.astro'), 'utf8');
  const catalog = readFileSync(join(ROOT, 'src/pages/publications/index.astro'), 'utf8');
  const images = [
    { file: 'identite-telephone-chaine.webp', format: 'webp', width: 1200, height: 675 },
    { file: 'identite-telephone-contrats.webp', format: 'webp', width: 1200, height: 675 },
    { file: 'identite-telephone-panne.webp', format: 'webp', width: 1200, height: 675 },
    { file: 'identite-telephone-recu.webp', format: 'webp', width: 1200, height: 675 },
    { file: 'identite-telephone-og.jpg', format: 'jpeg', width: 1200, height: 630 },
  ];

  for (const image of images) {
    const path = join(VISUAL_ROOT, image.file);
    assert.ok(existsSync(path), `${image.file} must exist`);
    const metadata = await sharp(path).metadata();
    assert.equal(metadata.format, image.format);
    assert.equal(metadata.width, image.width);
    assert.equal(metadata.height, image.height);
    assert.ok(statSync(path).size < 256 * 1024, `${image.file} must stay below 256 KB`);
  }

  for (const file of images.slice(0, 4).map((image) => image.file)) assert.match(page, new RegExp(file, 'u'));
  assert.match(page, /Ces illustrations éditoriales sont conceptuelles/u);
  assert.match(page, /identite-telephone-og\.jpg/u);
  assert.match(spotlight, /identite-telephone-chaine\.webp/u);
  assert.match(catalog, /identite-telephone-og\.jpg/u);
});
