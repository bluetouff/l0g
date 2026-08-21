import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, normalize, relative, resolve } from 'node:path';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const REVISION = 'e85fc63797c76e749b143398fca5cbccaba44de2';
const editions = [
  {
    lang: 'fr', source: join(ROOT, 'src/epub/eau-electricite'), epub: join(ROOT, 'public/publications/eau-electricite-europe-l0g.epub'),
    page: join(ROOT, 'src/pages/publications/eau-electricite.astro'), title: 'L’eau derrière l’électricité', intro: 'L’électricité a besoin d’eau', conclusion: 'compter l’électricité avec son eau',
  },
  {
    lang: 'en', source: join(ROOT, 'src/epub/water-electricity'), epub: join(ROOT, 'public/publications/water-electricity-europe-l0g.epub'),
    page: join(ROOT, 'src/pages/en/publications/water-electricity.astro'), title: 'The Water Behind Electricity', intro: 'Electricity needs water', conclusion: 'count electricity with its water',
  },
];

function listFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => entry.isDirectory() ? listFiles(join(directory, entry.name)) : [join(directory, entry.name)])
    .sort((a, b) => a.localeCompare(b, 'en'));
}

function textualFiles(source) {
  return listFiles(source).filter((path) => /\.(?:css|ncx|opf|svg|xhtml|xml)$/u.test(path));
}

function corpus(source) {
  return textualFiles(source).map((path) => readFileSync(path, 'utf8')).join('\n');
}

for (const edition of editions) {
  test(`${edition.lang}: conteneur EPUB valide, complet et reproductible`, () => {
    assert.ok(existsSync(edition.epub));
    const entries = execFileSync('unzip', ['-Z1', edition.epub], { encoding: 'utf8' }).trim().split('\n');
    assert.equal(entries[0], 'mimetype');
    assert.equal(execFileSync('unzip', ['-p', edition.epub, 'mimetype'], { encoding: 'utf8' }), 'application/epub+zip');
    assert.match(execFileSync('unzip', ['-t', edition.epub], { encoding: 'utf8' }), /No errors detected/u);
    assert.match(execFileSync('unzip', ['-lv', edition.epub], { encoding: 'utf8' }).split('\n').find((line) => /\bmimetype\s*$/u.test(line)) ?? '', /\bStored\b/u);
    assert.deepEqual(entries.sort(), listFiles(edition.source).map((path) => relative(edition.source, path)).sort());
    for (const path of textualFiles(edition.source)) {
      const markup = readFileSync(path, 'utf8');
      assert.equal(execFileSync('unzip', ['-p', edition.epub, relative(edition.source, path)], { encoding: 'utf8' }), markup);
      if (/\.(?:ncx|opf|svg|xhtml|xml)$/u.test(path)) {
        assert.equal(XMLValidator.validate(markup), true, `${relative(ROOT, path)} doit être du XML valide`);
      }
    }
  });

  test(`${edition.lang}: six chapitres, vingt infographies et six outils statiques`, () => {
    const text = corpus(edition.source);
    const opf = readFileSync(join(edition.source, 'EPUB/content.opf'), 'utf8');
    assert.equal((text.match(/id="article-[1-6]"/gu) ?? []).length, 6);
    assert.equal((text.match(/class="infographic-image"/gu) ?? []).length, 20);
    assert.equal(listFiles(join(edition.source, 'EPUB/media')).filter((path) => /file\d+\.svg$/u.test(path)).length, 20);
    assert.equal((text.match(/class="infographic-image" alt="[^"]+"/gu) ?? []).length, 20);
    assert.equal((text.match(/Outil interactif\.|Interactive tool\./gu) ?? []).length, 6);
    assert.match(text, new RegExp(edition.intro, 'u'));
    assert.match(text, new RegExp(edition.conclusion, 'iu'));
    assert.match(text, new RegExp(REVISION, 'u'));
    assert.match(opf, new RegExp(`<dc:title>${edition.title}</dc:title>`, 'u'));
    assert.match(opf, /schema:accessibilitySummary/u);
    assert.match(opf, /Creative Commons Attribution 4\.0/u);
    assert.equal(text.includes('\u{2014}'), false, 'aucun tiret quadratin ne doit être publié');
    assert.doesNotMatch(text, /(?:DanubeCentimetreCalculator|WetMegawattCounter|ThermalThresholdSelector|ReservoirArbitrator|AdequacyPumpComparator|CoolingAdaptationEstimator)|<script\b|<foreignObject\b/iu);
  });

  test(`${edition.lang}: tous les liens et fragments internes se résolvent`, () => {
    for (const path of textualFiles(edition.source).filter((file) => /\.(?:ncx|opf|xhtml|xml)$/u.test(file))) {
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
}

test('les pages bilingues, les couvertures et le catalogue exposent les éditions exactes', () => {
  const component = readFileSync(join(ROOT, 'src/components/WaterElectricityEpubPage.astro'), 'utf8');
  const spotlight = readFileSync(join(ROOT, 'src/components/PublicationSpotlight.astro'), 'utf8');
  const frIndex = readFileSync(join(ROOT, 'src/pages/publications/index.astro'), 'utf8');
  const enIndex = readFileSync(join(ROOT, 'src/pages/en/publications/index.astro'), 'utf8');
  assert.match(readFileSync(editions[0].page, 'utf8'), /WaterElectricityEpubPage lang="fr"/u);
  assert.match(readFileSync(editions[1].page, 'utf8'), /WaterElectricityEpubPage lang="en"/u);
  assert.match(component, /eau-electricite-europe-l0g\.epub/u);
  assert.match(component, /water-electricity-europe-l0g\.epub/u);
  assert.match(component, /createHash\('sha256'\)/u);
  assert.match(component, /loading="lazy"/u);
  assert.match(component, /decoding="async"/u);
  assert.match(component, /eau-electricite-infographie\.png/u);
  assert.match(component, /class="visual-card summary-visual"/u);
  assert.equal((component.match(/\/outils\//gu) ?? []).length >= 7, true);
  assert.equal((component.match(/\/en\/tools\//gu) ?? []).length >= 7, true);
  assert.match(spotlight, /publication === 'water-electricity'/u);
  assert.match(frIndex, /PublicationSpotlight publication="water-electricity"/u);
  assert.match(enIndex, /PublicationSpotlight lang="en" publication="water-electricity"/u);
  for (const file of ['eau-electricite-cover.png', 'water-electricity-cover.png']) {
    const image = readFileSync(join(ROOT, 'public/publications', file));
    assert.equal(image.subarray(1, 4).toString('ascii'), 'PNG');
    assert.equal(image.readUInt32BE(16), 1600);
    assert.equal(image.readUInt32BE(20), 2560);
  }
  const summaryImage = readFileSync(join(ROOT, 'public/publications/eau-electricite-infographie.png'));
  assert.equal(summaryImage.subarray(1, 4).toString('ascii'), 'PNG');
  assert.equal(summaryImage.readUInt32BE(16), 1055);
  assert.equal(summaryImage.readUInt32BE(20), 1491);
});
