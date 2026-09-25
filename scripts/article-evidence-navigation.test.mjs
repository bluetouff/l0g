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
