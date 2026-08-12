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
const PUBLICATIONS_INDEX = join(ROOT, 'src/pages/publications/index.astro');
const PUBLICATION_SPOTLIGHT = join(ROOT, 'src/components/PublicationSpotlight.astro');
const HOME = join(ROOT, 'src/pages/[...page].astro');
const NAVIGATION = join(ROOT, 'src/components/SiteNavigation.astro');
const FOOTER = join(ROOT, 'src/components/SiteFooter.astro');
const ENGLISH_SOURCE = join(ROOT, 'src/epub/epsteins-money');
const ENGLISH_EPUB = join(ROOT, 'public/publications/epsteins-money-l0g.epub');
const ENGLISH_PAGE = join(ROOT, 'src/pages/en/publications/epsteins-money.astro');
const ENGLISH_PUBLICATIONS_INDEX = join(ROOT, 'src/pages/en/publications/index.astro');
const ENGLISH_HOME = join(ROOT, 'src/pages/en/index.astro');
const ENGLISH_LAYOUT = join(ROOT, 'src/layouts/EnglishGuidesLayout.astro');
const ENGLISH_COVER = join(ROOT, 'public/publications/epsteins-money-cover.png');
const ENGLISH_PREVIEWS = [
  join(ROOT, 'public/publications/epsteins-money-infographic-1.svg'),
  join(ROOT, 'public/publications/epsteins-money-infographic-2.svg'),
];
const AUDITER_SOURCE = join(ROOT, 'src/epub/auditer-l-opacite');
const AUDITER_EPUB = join(ROOT, 'public/publications/auditer-l-opacite-bluetouff.epub');
const AUDITER_PAGE = join(ROOT, 'src/pages/publications/auditer-l-opacite.astro');
const AUDITER_COVER = join(ROOT, 'public/publications/auditer-l-opacite-cover.jpg');
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

function textualFiles(source = SOURCE) {
  return listFiles(source).filter((path) => /\.(?:css|ncx|opf|xhtml|xml)$/u.test(path));
}

function localReferences(markup) {
  return [...markup.matchAll(/\b(?:href|src)="([^"]+)"/gu)]
    .map((match) => match[1])
    .filter((href) => !/^(?:[a-z]+:|\/\/)/iu.test(href));
}

function assertSvgTextFits(label, source, width, margin) {
  for (const match of source.matchAll(/<(?:ns0:)?text\b([^>]*)>([^<]*)<\/(?:ns0:)?text>/gu)) {
    const attributes = match[1];
    const text = match[2].replaceAll('&#39;', '’').replaceAll('&amp;', '&');
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

function jpegDimensions(image) {
  let offset = 2;
  const frameMarkers = new Set([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf]);
  while (offset + 9 < image.length) {
    if (image[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = image[offset + 1];
    if (frameMarkers.has(marker)) {
      return { height: image.readUInt16BE(offset + 5), width: image.readUInt16BE(offset + 7) };
    }
    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
      continue;
    }
    const segmentLength = image.readUInt16BE(offset + 2);
    offset += 2 + segmentLength;
  }
  throw new Error('dimensions JPEG introuvables');
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

test('la publication reste accessible depuis l’accueil et la navigation', () => {
  const index = readFileSync(PUBLICATIONS_INDEX, 'utf8');
  const spotlight = readFileSync(PUBLICATION_SPOTLIGHT, 'utf8');
  const home = readFileSync(HOME, 'utf8');
  const navigation = readFileSync(NAVIGATION, 'utf8');
  const footer = readFileSync(FOOTER, 'utf8');

  assert.match(index, /<PublicationSpotlight/u);
  assert.match(spotlight, /href=\{publicationUrl\}/u);
  assert.match(spotlight, /href=\{epubUrl\}/u);
  assert.match(home, /<PublicationSpotlight headingLevel="h3"/u);
  assert.ok(
    home.indexOf('id="dernieres-analyses"') < home.indexOf('class="home-topics"'),
    'les dernières analyses doivent précéder les sujets suivis',
  );
  assert.match(navigation, /href: '\/publications\/', label: 'Publications'/u);
  assert.match(footer, /\['\/publications\/', 'Publications'/u);
});

test('the English archive is a valid EPUB container and matches its versioned source', () => {
  assert.ok(existsSync(ENGLISH_EPUB), 'the public English EPUB must exist');
  const entries = execFileSync('unzip', ['-Z1', ENGLISH_EPUB], { encoding: 'utf8' }).trim().split('\n');
  assert.equal(entries[0], 'mimetype');
  assert.equal(entries.filter((entry) => entry === 'mimetype').length, 1);
  const listing = execFileSync('unzip', ['-lv', ENGLISH_EPUB], { encoding: 'utf8' });
  const mimetypeLine = listing.split('\n').find((line) => /\bmimetype\s*$/u.test(line));
  assert.match(mimetypeLine ?? '', /\bStored\b/u);
  assert.equal(execFileSync('unzip', ['-p', ENGLISH_EPUB, 'mimetype'], { encoding: 'utf8' }), 'application/epub+zip');

  const expected = listFiles(ENGLISH_SOURCE).map((path) => relative(ENGLISH_SOURCE, path)).sort();
  assert.deepEqual(entries.sort(), expected);
  for (const path of textualFiles(ENGLISH_SOURCE)) {
    const archived = execFileSync('unzip', ['-p', ENGLISH_EPUB, relative(ENGLISH_SOURCE, path)], { encoding: 'utf8' });
    assert.equal(archived, readFileSync(path, 'utf8'), relative(ROOT, path));
  }
});

test('the English edition preserves all seven investigations and twenty infographics', () => {
  const corpus = textualFiles(ENGLISH_SOURCE).map((path) => readFileSync(path, 'utf8')).join('\n');
  const opf = readFileSync(join(ENGLISH_SOURCE, 'EPUB/content.opf'), 'utf8');
  const svgFiles = listFiles(join(ENGLISH_SOURCE, 'EPUB/media')).filter((path) => path.endsWith('.svg'));
  const articleChapters = ['ch003.xhtml', 'ch004.xhtml', 'ch005.xhtml', 'ch006.xhtml', 'ch008.xhtml', 'ch009.xhtml', 'ch010.xhtml'];

  assert.equal(corpus.includes('\u{2014}'), false, 'no em dash may enter the English EPUB');
  assert.equal(svgFiles.length, 20);
  assert.equal((corpus.match(/class="infographic-image"/gu) ?? []).length, 20);
  assert.equal(articleChapters.filter((chapter) => existsSync(join(ENGLISH_SOURCE, 'EPUB/text', chapter))).length, 7);
  assert.match(opf, /<dc:language>en<\/dc:language>/u);
  assert.match(opf, /schema:accessibilitySummary/u);
  assert.match(opf, /https:\/\/l0g\.fr\/en\/publications\/epsteins-money\//u);

  for (const path of svgFiles) {
    const svg = readFileSync(path, 'utf8');
    assert.doesNotMatch(svg, /<(?:script|foreignObject|iframe|object|embed)\b/iu);
    assert.doesNotMatch(svg, /\son[a-z]+\s*=/iu);
    assert.doesNotMatch(svg, /(?:href|src)\s*=\s*["'](?:https?:|data:|javascript:)/iu);
    const width = Number(svg.match(/viewBox="0 0 ([0-9.]+)/u)?.[1]);
    assert.ok(Number.isFinite(width), `${relative(ROOT, path)} must declare a viewBox`);
    assertSvgTextFits(relative(ROOT, path), svg, width, 12);
  }
});

test('all local links and fragments in the English EPUB resolve', () => {
  for (const path of textualFiles(ENGLISH_SOURCE).filter((file) => /\.(?:ncx|opf|xhtml|xml)$/u.test(file))) {
    const markup = readFileSync(path, 'utf8');
    for (const reference of localReferences(markup)) {
      const [rawTarget, fragment] = reference.split('#');
      const targetPath = rawTarget ? normalize(join(dirname(path), decodeURI(rawTarget))) : path;
      assert.ok(existsSync(targetPath), `${relative(ROOT, path)} references ${reference}`);
      if (fragment) {
        const target = readFileSync(targetPath, 'utf8');
        assert.ok(target.includes(`id="${decodeURIComponent(fragment)}"`), `${relative(ROOT, path)} references missing fragment ${reference}`);
      }
    }
  }
});

test('the English download page exposes the exact file, checksum, cover and safe previews', () => {
  const page = readFileSync(ENGLISH_PAGE, 'utf8');
  const bytes = readFileSync(ENGLISH_EPUB);
  assert.match(page, /\/publications\/epsteins-money-l0g\.epub/u);
  assert.match(page, /createHash\('sha256'\)/u);
  assert.match(page, /download="Epsteins-Money-l0g\.epub"/u);
  assert.match(page, /\/publications\/epsteins-money-cover\.png/u);
  assert.match(page, /epsteins-money-infographic-1\.svg/u);
  assert.match(page, /epsteins-money-infographic-2\.svg/u);
  assert.equal(createHash('sha256').update(bytes).digest('hex').length, 64);

  const cover = readFileSync(ENGLISH_COVER);
  assert.equal(cover.subarray(1, 4).toString('ascii'), 'PNG');
  assert.equal(cover.readUInt32BE(16), 1600);
  assert.equal(cover.readUInt32BE(20), 2560);
  for (const preview of ENGLISH_PREVIEWS) assert.ok(existsSync(preview));
});

test('the English publication is discoverable from navigation and home', () => {
  const index = readFileSync(ENGLISH_PUBLICATIONS_INDEX, 'utf8');
  const home = readFileSync(ENGLISH_HOME, 'utf8');
  const layout = readFileSync(ENGLISH_LAYOUT, 'utf8');
  const spotlight = readFileSync(PUBLICATION_SPOTLIGHT, 'utf8');
  assert.match(index, /<PublicationSpotlight lang="en"/u);
  assert.match(home, /<PublicationSpotlight lang="en"/u);
  assert.match(layout, /href: '\/en\/publications\/'/u);
  assert.match(spotlight, /epsteins-money-l0g\.epub/u);
  assert.match(spotlight, /epsteins-money-cover\.png/u);
});

test('l’essai Auditer l’Opacité est un conteneur EPUB valide et reproductible', () => {
  assert.ok(existsSync(AUDITER_EPUB), 'le fichier EPUB public doit exister');
  const entries = execFileSync('unzip', ['-Z1', AUDITER_EPUB], { encoding: 'utf8' }).trim().split('\n');
  assert.equal(entries[0], 'mimetype');
  assert.equal(entries.filter((entry) => entry === 'mimetype').length, 1);

  const listing = execFileSync('unzip', ['-lv', AUDITER_EPUB], { encoding: 'utf8' });
  const mimetypeLine = listing.split('\n').find((line) => /\bmimetype\s*$/u.test(line));
  assert.match(mimetypeLine ?? '', /\bStored\b/u);
  assert.equal(execFileSync('unzip', ['-p', AUDITER_EPUB, 'mimetype'], { encoding: 'utf8' }), 'application/epub+zip');

  const expected = listFiles(AUDITER_SOURCE).map((path) => relative(AUDITER_SOURCE, path)).sort();
  assert.deepEqual(entries.sort(), expected);
  for (const path of textualFiles(AUDITER_SOURCE)) {
    const archived = execFileSync('unzip', ['-p', AUDITER_EPUB, relative(AUDITER_SOURCE, path)], { encoding: 'utf8' });
    assert.equal(archived, readFileSync(path, 'utf8'), relative(ROOT, path));
  }
});

test('l’essai conserve ses treize chapitres et adopte la charte l0g sans contenu actif', () => {
  const corpus = textualFiles(AUDITER_SOURCE).map((path) => readFileSync(path, 'utf8')).join('\n');
  const opf = readFileSync(join(AUDITER_SOURCE, 'EPUB/content.opf'), 'utf8');
  const css = readFileSync(join(AUDITER_SOURCE, 'EPUB/styles/stylesheet1.css'), 'utf8');
  const chapters = Array.from({ length: 13 }, (_, index) => `ch${String(index + 6).padStart(3, '0')}.xhtml`);

  assert.equal(corpus.includes('\u{2014}'), false, 'aucun tiret quadratin ne doit être publié');
  assert.equal(chapters.filter((chapter) => existsSync(join(AUDITER_SOURCE, 'EPUB/text', chapter))).length, 13);
  assert.doesNotMatch(corpus, /<(?:script|iframe|object|embed|foreignObject)\b/iu);
  assert.doesNotMatch(corpus, /\son[a-z]+\s*=/iu);
  assert.match(opf, /https:\/\/l0g\.fr\/publications\/auditer-l-opacite\//u);
  assert.match(opf, /schema:accessibilitySummary/u);
  assert.match(opf, /© 2026 Bluetouff/u);
  assert.match(css, /#0c0d10/u);
  assert.match(css, /#5eead4/u);
  assert.match(css, /#ff4d87/u);
  assert.match(css, /#f5b13d/u);
});

test('tous les liens et fragments de l’essai Auditer l’Opacité se résolvent', () => {
  for (const path of textualFiles(AUDITER_SOURCE).filter((file) => /\.(?:ncx|opf|xhtml|xml)$/u.test(file))) {
    const markup = readFileSync(path, 'utf8');
    for (const reference of localReferences(markup)) {
      const [rawTarget, fragment] = reference.split('#');
      const targetPath = rawTarget ? normalize(join(dirname(path), decodeURI(rawTarget))) : path;
      assert.ok(existsSync(targetPath), `${relative(ROOT, path)} référence ${reference}`);
      if (fragment) {
        const target = readFileSync(targetPath, 'utf8');
        assert.ok(target.includes(`id="${decodeURIComponent(fragment)}"`), `${relative(ROOT, path)} référence le fragment absent ${reference}`);
      }
    }
  }
});

test('la page Auditer l’Opacité expose le fichier, la couverture, deux cartes et le checksum', () => {
  const page = readFileSync(AUDITER_PAGE, 'utf8');
  const bytes = readFileSync(AUDITER_EPUB);
  const cover = readFileSync(AUDITER_COVER);

  assert.match(page, /\/publications\/auditer-l-opacite-bluetouff\.epub/u);
  assert.match(page, /download="Auditer-l-opacite-Bluetouff\.epub"/u);
  assert.match(page, /createHash\('sha256'\)/u);
  assert.equal((page.match(/<svg\b/gu) ?? []).length, 2);
  assert.equal(page.includes('\u{2014}'), false);
  assert.equal(createHash('sha256').update(bytes).digest('hex').length, 64);
  assert.equal(cover.subarray(0, 2).toString('hex'), 'ffd8');
  assert.deepEqual(jpegDimensions(cover), { width: 1600, height: 2560 });
});

test('le catalogue et la home gardent leurs cartes lisibles et ordonnées sur mobile', () => {
  const index = readFileSync(PUBLICATIONS_INDEX, 'utf8');
  const spotlight = readFileSync(PUBLICATION_SPOTLIGHT, 'utf8');
  const home = readFileSync(HOME, 'utf8');

  assert.ok(index.indexOf('publication="auditer-opacite"') < index.lastIndexOf('<PublicationSpotlight />'));
  assert.match(spotlight, /@media \(max-width: 680px\)[\s\S]*?grid-template-columns: 1fr/u);
  assert.match(spotlight, /@media \(max-width: 680px\)[\s\S]*?grid-template-columns: repeat\(2, minmax\(0, 1fr\)\)/u);
  assert.match(spotlight, /@media \(max-width: 680px\)[\s\S]*?\.publication-actions a \{ width: 100%; \}/u);

  const articles = home.indexOf('id="dernieres-analyses"');
  const epsteinCard = home.lastIndexOf('<PublicationSpotlight headingLevel="h3" />');
  const topics = home.indexOf('<section class="home-topics"');
  assert.ok(articles < epsteinCard && epsteinCard < topics, 'la carte Epstein doit suivre les articles et précéder les sujets');
});
