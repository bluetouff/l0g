import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join, normalize, relative, resolve } from 'node:path';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const editions = [
  {
    lang: 'fr',
    source: join(ROOT, 'src/epub/grand-peage-facture'),
    epub: join(ROOT, 'public/publications/grand-peage-facture-enquete-l0g.epub'),
    page: join(ROOT, 'src/pages/publications/grand-peage-facture.astro'),
    title: 'Le grand péage de la facture',
    intro: 'une obligation et son infrastructure',
    conclusion: 'rendre l’obligation vérifiable',
    toolLabel: 'Outil interactif.',
  },
  {
    lang: 'en',
    source: join(ROOT, 'src/epub/great-e-invoicing-toll'),
    epub: join(ROOT, 'public/publications/great-e-invoicing-toll-investigation-l0g.epub'),
    page: join(ROOT, 'src/pages/en/publications/great-e-invoicing-toll.astro'),
    title: 'The Great E-Invoicing Toll',
    intro: 'an obligation and its infrastructure',
    conclusion: 'make the obligation verifiable',
    toolLabel: 'Interactive tool.',
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
  test(`${edition.lang}: EPUB container is valid, complete and reproducible`, () => {
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
      if (/\.(?:ncx|opf|svg|xhtml|xml)$/u.test(path)) assert.equal(XMLValidator.validate(markup), true, `${relative(ROOT, path)} must be valid XML`);
    }
  });

  test(`${edition.lang}: five investigations, ten infographics and three static tool callouts`, () => {
    const text = corpus(edition.source);
    const opf = readFileSync(join(edition.source, 'EPUB/content.opf'), 'utf8');
    assert.equal((text.match(/id="article-[1-5]"/gu) ?? []).length, 5);
    assert.equal((text.match(/class="infographic-image"/gu) ?? []).length, 10);
    assert.equal(listFiles(join(edition.source, 'EPUB/media')).filter((path) => /file\d+\.svg$/u.test(path)).length, 10);
    assert.equal((text.match(/class="infographic-image" alt="[^"]+"/gu) ?? []).length, 10);
    assert.equal((text.match(new RegExp(edition.toolLabel.replace('.', '\\.'), 'gu')) ?? []).length, 3);
    assert.match(text, new RegExp(edition.intro, 'iu'));
    assert.match(text, new RegExp(edition.conclusion, 'iu'));
    assert.match(opf, new RegExp(`<dc:title>${edition.title}</dc:title>`, 'u'));
    assert.match(opf, /schema:accessibilitySummary/u);
    assert.match(opf, /Creative Commons Attribution 4\.0/u);
    assert.equal(text.includes('\u{2014}'), false, 'the publication must not contain em dashes');
    assert.doesNotMatch(text, /(?:InvoicePlatformCostCalculator|InvoiceDataAccessMap|InvoiceIncidentLog)|<script\b|<foreignObject\b/iu);
  });

  test(`${edition.lang}: every internal file and fragment link resolves`, () => {
    for (const path of textualFiles(edition.source).filter((file) => /\.(?:ncx|opf|xhtml|xml)$/u.test(file))) {
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
}

test('bilingual pages, cover files and catalog expose the exact editions', () => {
  const component = readFileSync(join(ROOT, 'src/components/EInvoicingEpubPage.astro'), 'utf8');
  const spotlight = readFileSync(join(ROOT, 'src/components/PublicationSpotlight.astro'), 'utf8');
  const frIndex = readFileSync(join(ROOT, 'src/pages/publications/index.astro'), 'utf8');
  const enIndex = readFileSync(join(ROOT, 'src/pages/en/publications/index.astro'), 'utf8');
  const enHome = readFileSync(join(ROOT, 'src/pages/en/index.astro'), 'utf8');
  assert.match(readFileSync(editions[0].page, 'utf8'), /EInvoicingEpubPage lang="fr"/u);
  assert.match(readFileSync(editions[1].page, 'utf8'), /EInvoicingEpubPage lang="en"/u);
  assert.match(component, /grand-peage-facture-enquete-l0g\.epub/u);
  assert.match(component, /great-e-invoicing-toll-investigation-l0g\.epub/u);
  assert.match(component, /createHash\('sha256'\)/u);
  assert.match(component, /'@type': 'Book'/u);
  assert.match(component, /class="visual-scroll"/u);
  assert.match(component, /class="wide-visual"/u);
  assert.equal((component.match(/\/outils\//gu) ?? []).length >= 4, true);
  assert.equal((component.match(/\/en\/tools\//gu) ?? []).length >= 4, true);
  assert.match(spotlight, /publication === 'e-invoicing'/u);
  assert.match(frIndex, /PublicationSpotlight publication="e-invoicing"/u);
  assert.match(enIndex, /PublicationSpotlight lang="en" publication="e-invoicing"/u);
  assert.match(enHome, /The Great E-Invoicing Toll: five investigations in one EPUB\./u);
  assert.match(enHome, /PublicationSpotlight lang="en" publication="e-invoicing" headingLevel="h3" showAllPublicationsLink/u);
  assert.match(enHome, /\.publication-highlight\s*\{\s*margin:\s*clamp\([^;]+\)\s+0\s+clamp\([^;]+\);/u);
  assert.match(spotlight, /href=\{isEnglish \? '\/en\/publications\/' : '\/publications\/'\}/u);
  assert.match(spotlight, /isEnglish \? 'All publications' : 'Toutes les publications'/u);
  for (const file of ['grand-peage-facture-cover.png', 'great-e-invoicing-toll-cover.png']) {
    const image = readFileSync(join(ROOT, 'public/publications', file));
    assert.equal(image.subarray(1, 4).toString('ascii'), 'PNG');
    assert.equal(image.readUInt32BE(16), 1600);
    assert.equal(image.readUInt32BE(20), 2560);
  }
});
