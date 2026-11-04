import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parse } from 'parse5';
import { publicationPage, publicationPageHref } from '../src/config/publication-catalog.mjs';

const nodes = (node) => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const attr = (node, name) => node?.attrs?.find((attribute) => attribute.name === name)?.value;
const text = (node) => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');

/** Read every rendered catalogue page while checking pagination and completeness. */
export function renderedPublicationCards(root, lang) {
  const { totalPages } = publicationPage(lang);
  const cards = [];
  for (let number = 1; number <= totalPages; number += 1) {
    const page = publicationPage(lang, number);
    const route = publicationPageHref(lang, number);
    const all = nodes(parse(readFileSync(join(root, 'dist', route, 'index.html'), 'utf8')));
    const pageCards = all.filter((node) => node.tagName === 'article'
      && (attr(node, 'class') ?? '').split(/\s+/u).includes('publication-spotlight'));
    assert.equal(pageCards.length, page.items.length, `${route}: complete bounded page`);
    const canonical = all.find((node) => node.tagName === 'link' && attr(node, 'rel') === 'canonical');
    assert.equal(attr(canonical, 'href'), `https://l0g.fr${route}`);
    const pager = all.find((node) => node.tagName === 'nav'
      && attr(node, 'aria-label') === (lang === 'fr' ? 'Pagination des publications' : 'Publications pagination'));
    assert.ok(pager, `${route}: accessible pagination`);
    const navigation = nodes(pager);
    assert.equal(text(navigation.find((node) => attr(node, 'aria-current') === 'page')), String(number));
    for (const [rel, target] of [
      ['prev', number > 1 ? publicationPageHref(lang, number - 1) : undefined],
      ['next', number < totalPages ? publicationPageHref(lang, number + 1) : undefined],
    ]) {
      assert.equal(attr(navigation.find((node) => node.tagName === 'a' && attr(node, 'rel') === rel), 'href'), target);
    }
    cards.push(...pageCards);
  }
  const downloads = cards.map((card) => attr(nodes(card).find((node) => node.tagName === 'a' && attr(node, 'download') !== undefined), 'href'));
  assert.ok(downloads.every(Boolean), 'Every edition keeps its download');
  assert.equal(new Set(downloads).size, cards.length, 'No edition repeats across catalogue pages');
  return cards;
}
