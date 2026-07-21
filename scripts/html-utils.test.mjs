import assert from 'node:assert/strict';
import test from 'node:test';
import { removeHtmlElementBlocks, scanHtmlElements, stripHtmlTags } from '../src/lib/html-utils.ts';

test('le scanner ignore le faux HTML contenu dans script et lit les attributs cités', () => {
  const html = `<meta http-equiv='Content-Security-Policy' content="script-src 'self'">
    <script>const fake = '<a href="/jamais/">'; const almost = '</scriptx>';</script><a href='/vrai/' data-x=ok>vrai</a>`;
  const elements = scanHtmlElements(html);
  assert.equal(elements.filter((element) => element.name === 'a').length, 1);
  assert.equal(elements.find((element) => element.name === 'a').attributes.get('href'), '/vrai/');
  assert.match(elements.find((element) => element.name === 'script').body, /jamais/);
  assert.equal(elements.find((element) => element.name === 'meta').attributes.get('http-equiv'), 'Content-Security-Policy');
});

test('le texte brut retire les balises complètes sans avaler les comparaisons', () => {
  assert.equal(stripHtmlTags('1 < 2 <strong title=">">solide</strong>'), '1 < 2  solide ');
  assert.equal(removeHtmlElementBlocks('avant<figure><svg><text>x</text></svg></figure>après', 'figure'), 'avant après');
});

test('les commentaires et balises mal fermées ne créent pas de faux éléments', () => {
  const elements = scanHtmlElements('<!-- <script>alert(1)</script> --><a href="/ok/">ok');
  assert.deepEqual(elements.map((element) => element.name), ['a']);
  assert.equal(stripHtmlTags('x<!-- secret -->y'), 'x y');
});
