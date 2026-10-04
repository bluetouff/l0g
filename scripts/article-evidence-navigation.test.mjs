import test from 'node:test';
import assert from 'node:assert/strict';
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';

const bundled = await build({
  entryPoints: [fileURLToPath(new URL('../src/lib/article-evidence.ts', import.meta.url))],
  bundle: true,
  platform: 'node',
  format: 'esm',
  write: false,
});
const { buildArticleEvidence } = await import(`data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString('base64')}`);

const options = {
  published: new Date('2026-09-25T06:00:07Z'),
  url: 'https://l0g.fr/posts/example/',
  title: 'Example',
};
const paragraph = 'Une correction doit parvenir aux outils qui utilisent les données du dossier. Le contrôle porte sur les opérations suivantes et sur les informations effectivement utilisées.';

test('fallback claims skip long French and English series navigation', () => {
  for (const prefix of ['Lire aussi', 'Read also']) {
    const navigation = `*${prefix} : [Volet 1 : décisions](/posts/one/) · [Volet 2 : résultats](/posts/two/) · [Volet 4 : corriger le dossier](/posts/four/).*`;
    const result = buildArticleEvidence(`${navigation}\n\n${paragraph}`, options);
    assert.equal(result.claims.length, 1);
    assert.equal(result.claims[0].claim, paragraph);
    assert.deepEqual(buildArticleEvidence(navigation, options).claims, []);
  }
});

test('fallback still retains prose while excluding a menu made only of internal links', () => {
  const menu = '[Comprendre les décisions automatisées du recouvrement](/posts/one/) · [Comparer les résultats documentés des plateformes](/posts/two/)';
  const result = buildArticleEvidence(`${menu}\n\n${paragraph}`, options);
  assert.equal(result.claims[0].claim, paragraph);
  assert.equal(buildArticleEvidence(paragraph, options).claims[0].claim, paragraph);
});

test('a substantive externally cited claim keeps its source instead of becoming a fallback', () => {
  const cited = 'Le document décrit les règles applicables aux demandes de rectification et les conditions de limitation du traitement. [Source](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3)';
  const result = buildArticleEvidence(cited, options);
  assert.equal(result.claims.length, 1);
  assert(result.claims[0].references.some(ref => ref.href === 'https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3'));
});

test('source periods keep their labels without synthetic publication days', () => {
  for (const [label, path, expectedLabel] of [
    ['Report', '/date/2026/report.html', '2026'],
    ['Report September 2026', '/report.html', 'September 2026'],
    ['Report Q3 2026', '/report.html', 'T3 2026'],
  ]) {
    const result = buildArticleEvidence(`${paragraph} [${label}](https://www.ecb.europa.eu${path})`, options);
    const reference = result.claims[0].references[0];
    assert.equal(reference.sourcePublicationDateLabel, expectedLabel);
    assert.equal(reference.sourcePublicationDateIso, undefined);
    assert.equal(reference.dateIso, undefined);
  }
});

test('source dates preserve valid full dates and reject impossible calendar days', () => {
  for (const [label, expected] of [
    ['Report 2026-01-01', '2026-01-01'],
    ['Report 2026-09-29', '2026-09-29'],
    ['Report 29 septembre 2026', '2026-09-29'],
    ['Report September 29, 2026', '2026-09-29'],
    ['Report 2024-02-29', '2024-02-29'],
    ['Report 2026-02-29', undefined],
    ['Report 2026-13-02', undefined],
    ['Report 2026-04-31', undefined],
  ]) {
    const result = buildArticleEvidence(`${paragraph} [${label}](https://www.ecb.europa.eu/report.html)`, options);
    assert.equal(result.claims[0].references[0].sourcePublicationDateIso, expected);
  }
});

test('an undated external source does not inherit the article publication date', () => {
  const result = buildArticleEvidence(`${paragraph} [Report](https://www.ecb.europa.eu/report.html)`, options);
  const claim = result.claims[0];
  assert.equal(claim.claimDateIso, '2026-09-25');
  assert.equal(claim.references[0].sourcePublicationDateIso, undefined);
  assert.equal(claim.references[0].dateIso, undefined);
  const fallback = buildArticleEvidence(paragraph, options).claims[0];
  assert.equal(fallback.references[0].href, options.url);
  assert.equal(fallback.references[0].sourcePublicationDateIso, '2026-09-25');
});

test('source precision changes preserve normalized observation periods', () => {
  const result = buildArticleEvidence('En 2026, le document décrit les règles applicables aux demandes de rectification et les conditions de limitation du traitement [Report](https://www.ecb.europa.eu/date/2026/report.html).', options);
  assert.equal(result.claims[0].observationDateIso, '2026-01-01');
  assert.equal(result.claims[0].temporalPrecision, 'year');
  assert.equal(result.claims[0].references[0].sourcePublicationDateIso, undefined);
  const quarterly = buildArticleEvidence('En T2 2025, le document décrit les règles applicables aux demandes de rectification et les conditions de limitation du traitement [Report](https://www.ecb.europa.eu/date/2026/report.html).', options).claims[0];
  assert.equal(quarterly.observationDateIso, '2025-04-01');
  assert.equal(quarterly.temporalPrecision, 'quarter');
  assert.equal(quarterly.claimDateIso, '2026-09-25');
  assert.equal(quarterly.references[0].sourcePublicationDateIso, undefined);
});
