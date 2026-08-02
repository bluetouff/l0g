import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const frenchText = 'Les articles publiés sur l0g sont le fruit d’un travail de dialogue analytique avec l’intelligence artificielle, utilisée comme outil de recherche, de confrontation des hypothèses et d’approfondissement. L’IA ne constitue ni une source ni un auteur. La sélection, la vérification et l’interprétation des sources restent humaines, tout comme les choix éditoriaux et la validation finale des textes. La responsabilité juridique des contenus publiés est intégralement assumée par l0g et leur auteur.';

test('la note de transparence conserve le texte validé et le lien canonique', async () => {
  const component = await read('src/components/AiEditorialDisclosure.astro');
  assert.match(component, new RegExp(frenchText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  assert.match(component, /href="\/protocole-editorial\/"/);
  assert.match(component, /AI is neither a source nor an author\./);
});

test('les analyses et guides FR et EN affichent la note après leur bloc de preuves ou de citation', async () => {
  const templates = [
    ['src/pages/posts/[...slug].astro', 'fr', '<ArticleEvidence'],
    ['src/pages/guides/[...slug].astro', 'fr', '<CitationBox'],
    ['src/pages/en/analysis/[...slug].astro', 'en', '<div class="citation-en"'],
    ['src/pages/en/guides/[...slug].astro', 'en', '<div class="citation-en"'],
  ];

  for (const [path, lang, previousBlock] of templates) {
    const source = await read(path);
    const disclosure = `<AiEditorialDisclosure lang="${lang}" />`;
    assert.match(source, /import AiEditorialDisclosure from /, `${path}: import absent`);
    assert.notEqual(source.indexOf(disclosure), -1, `${path}: note absente`);
    assert(
      source.indexOf(disclosure) > source.indexOf(previousBlock),
      `${path}: la note doit suivre ${previousBlock}`,
    );
  }
});
