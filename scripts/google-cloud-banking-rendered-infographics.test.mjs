import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';
import { assertGoogleCloudBankingArticleReferences } from './google-cloud-banking-svg-assertions.mjs';
const all = node => [node, ...(node.childNodes ?? []).flatMap(all)];
const attributes = node => Object.fromEntries((node.attrs ?? []).map(attribute => [attribute.name, attribute.value]));
const pages = [['fr', 'posts/google-cloud-banques-automates-londres'], ['en', 'en/analysis/google-cloud-banks-london-power-control-failure']].map(([lang, path]) => ({ lang, html: readFileSync(new URL(`../dist/${path}/index.html`, import.meta.url), 'utf8') }));
function mutateFigure(html, change) {
  const figure = all(parse(html, { sourceCodeLocationInfo: true })).find(node => node.tagName === 'svg' && attributes(node).class === 'l0g-google-cloud-svg');
  assert.ok(figure);
  const { startOffset, endOffset } = figure.sourceCodeLocation, old = html.slice(startOffset, endOffset), next = change(old);
  assert.notEqual(next, old);
  return html.slice(0, startOffset) + next + html.slice(endOffset);
}
test('compiled bilingual pages retain twenty complete native mechanisms, exact source records and accessible methods', () => {
  for (const page of pages) assertGoogleCloudBankingArticleReferences(page.html, page.lang);
});
test('compiled geometry, labels, source links, palette and accessibility mutations fail closed', () => {
  const page = pages[0];
  for (const change of [
    svg => svg.replace('06:53 BST', '06:52 BST'),
    svg => svg.replace('width:100%;height:auto', 'width:1300px;height:auto'),
    svg => svg.replace('viewBox="0 0 1300 850"', 'viewBox="0 0 1300 840"'),
    svg => svg.replace('fill="var(--color-signal)"', 'fill="var(--color-accent)"'),
    svg => svg.replace('font-family="l0g Google Cloud Banking"', 'font-family="Arial"'),
    svg => svg.replace('role="img"', 'role="presentation"'),
  ]) assert.throws(() => assertGoogleCloudBankingArticleReferences(mutateFigure(page.html, change), page.lang));
  for (const [from, to] of [['id="source-s16"', 'id="source-s15"'], ['href="#source-s01"', 'href="#source-s02"'], ['<summary>', '<aside>']]) assert.throws(() => assertGoogleCloudBankingArticleReferences(page.html.replaceAll(from, to), page.lang));
});
