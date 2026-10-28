import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { parse } from 'parse5';
import sharp from 'sharp';
import postcss from 'postcss';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { cumcumEditions } from '../src/config/cumcum-publication.mjs';
import { getPublicationSocial } from '../src/config/publication-social.mjs';
import { editorialTitleViolation } from './editorial-title-policy.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const SITE = 'https://l0g.fr';
const nodes = node => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
const plain = node => text(node).replace(/\s+/gu, ' ').trim();
const hasClass = (node, name) => (attr(node, 'class') ?? '').split(/\s+/u).includes(name);
const compiled = book => readFileSync(join(ROOT, 'dist', book.path, 'index.html'), 'utf8');
const media = book => {
  const bytes = readFileSync(join(ROOT, 'public', book.epub));
  return { bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
};
const sole = (all, predicate, label) => {
  const found = all.filter(predicate);
  assert.equal(found.length, 1, label);
  return found[0];
};
const meta = (all, key, value) => attr(sole(all, node => node.tagName === 'meta' && attr(node, key) === value, value), 'content');

function checkPage(html, book) {
  const all = nodes(parse(html));
  const article = sole(all, node => node.tagName === 'article' && hasClass(node, 'cumcum-book'), 'one publication article');
  const inside = nodes(article);
  const h1 = sole(inside, node => node.tagName === 'h1', 'one book title');
  assert.equal(plain(h1), book.title);
  for (const heading of inside.filter(node => /^h[1-6]$/u.test(node.tagName ?? ''))) {
    assert.equal(editorialTitleViolation(plain(heading)), null, plain(heading));
  }
  assert.equal(attr(sole(all, node => node.tagName === 'link' && attr(node, 'rel') === 'canonical', 'canonical'), 'href'), `${SITE}${book.path}`);
  assert.equal(attr(all.find(node => node.tagName === 'html'), 'lang'), book.lang);
  assert.equal(all.filter(node => node.tagName === 'header' && attr(node, 'data-english-header') !== undefined).length, book.lang === 'en' ? 1 : 0);
  assert.equal(meta(all, 'name', 'robots'), 'index,follow,max-image-preview:large');
  assert.equal(meta(all, 'name', 'description'), book.description);
  assert.ok(book.description.length <= 160);
  const alternates = all.filter(node => node.tagName === 'link' && attr(node, 'rel') === 'alternate' && attr(node, 'hreflang'));
  assert.deepEqual(alternates.map(node => [attr(node, 'hreflang'), attr(node, 'href')]).sort(), [
    ['fr', `${SITE}${cumcumEditions.fr.path}`], ['en', `${SITE}${cumcumEditions.en.path}`], ['x-default', `${SITE}${cumcumEditions.fr.path}`],
  ].sort());
  const social = getPublicationSocial(book.path);
  assert(social, 'dedicated social artwork must be registered');
  assert.equal(social.image, book.social);
  assert.equal(meta(all, 'property', 'og:image'), `${SITE}${book.social}`);
  assert.equal(meta(all, 'name', 'twitter:image'), `${SITE}${book.social}`);
  for (const [name, value] of [['og:image:width', '1200'], ['og:image:height', '630'], ['og:image:alt', social.alt]]) assert.equal(meta(all, 'property', name), value);
  const links = inside.filter(node => node.tagName === 'a');
  const downloads = links.filter(node => attr(node, 'download') !== undefined);
  assert.equal(downloads.length, 1, 'one clear EPUB download');
  assert.equal(attr(downloads[0], 'href'), book.epub);
  assert.equal(attr(downloads[0], 'id'), 'telecharger');
  const hero = sole(inside, node => node.tagName === 'section' && hasClass(node, 'book-hero'), 'hero');
  assert(nodes(hero).includes(downloads[0]), 'the download must be visible in the hero');
  assert.deepEqual(links.filter(node => attr(node, 'href') && new URL(attr(node, 'href'), SITE).pathname.toLowerCase().endsWith('.epub')), downloads);
  const chapters = sole(inside, node => node.tagName === 'ol' && hasClass(node, 'chapter-grid'), 'chapter sequence');
  const chapterLinks = nodes(chapters).filter(node => node.tagName === 'a');
  assert.deepEqual(chapterLinks.map(node => attr(node, 'href')), book.chapters.map(chapter => chapter.route));
  assert.equal(chapterLinks.length, 6);
  for (const [index, link] of chapterLinks.entries()) {
    assert.equal(plain(sole(nodes(link), node => node.tagName === 'h3', 'chapter title')), book.chapters[index].title.replace(/\s+/gu, ' ').trim());
    assert(plain(link).includes(book.chapters[index].summary.replace(/\s+/gu, ' ').trim()));
  }
  for (const paragraph of [book.readerGuide[0], ...book.introduction.slice(0, 2), ...book.conclusion.slice(0, 2), ...book.method.slice(0, 1)]) assert(plain(article).includes(paragraph.replace(/\s+/gu, ' ').trim()));
  const glossary = sole(inside, node => node.tagName === 'dl' && hasClass(node, 'glossary-list'), 'glossary');
  assert.deepEqual(nodes(glossary).filter(node => node.tagName === 'a').map(node => attr(node, 'href')), book.glossary.slice(0, 6).map(entry => entry.path));
  for (const entry of book.glossary.slice(0, 6)) assert(plain(glossary).includes(entry.definition));
  const alternate = cumcumEditions[book.lang === 'fr' ? 'en' : 'fr'];
  assert(links.some(node => attr(node, 'href') === alternate.path && attr(node, 'hreflang') === alternate.lang));
  assert(links.some(node => attr(node, 'href') === (book.lang === 'fr' ? '/publications/' : '/en/publications/')));
  const support = sole(inside, node => node.tagName === 'p' && hasClass(node, 'support-note'), 'support note');
  assert(plain(support).includes('Bitcoin'));
  assert.equal(attr(sole(nodes(support), node => node.tagName === 'a', 'support link'), 'href'), book.lang === 'fr' ? '/soutenir/' : '/en/support/');
  const ids = inside.map(node => attr(node, 'id')).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size, 'unique section targets');
  for (const link of links.filter(node => attr(node, 'href')?.startsWith('#'))) assert(ids.includes(attr(link, 'href').slice(1)));

  const schemas = all.filter(node => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json').map(node => JSON.parse(text(node)));
  const schema = sole(schemas, item => item['@type'] === 'Book', 'one Book schema');
  for (const [key, value] of Object.entries({ '@context': 'https://schema.org', '@id': `${SITE}${book.path}#book`, url: `${SITE}${book.path}`, name: book.title, description: book.description, inLanguage: book.lang, datePublished: book.date, dateModified: book.modified, bookFormat: 'https://schema.org/EBook', isAccessibleForFree: true, image: `${SITE}${book.cover}`, license: 'https://creativecommons.org/licenses/by/4.0/' })) assert.equal(schema[key], value, key);
  assert.deepEqual(schema.author, { '@id': `${SITE}/about/#bluetouff` });
  assert.deepEqual(schema.publisher, { '@id': `${SITE}/#org` });
  assert.deepEqual(schema.hasPart, book.chapters.map(chapter => ({ '@type': 'Article', name: chapter.title, url: `${SITE}${chapter.route}` })));
  assert.deepEqual(schema[book.lang === 'fr' ? 'workTranslation' : 'translationOfWork'], { '@type': 'Book', '@id': `${SITE}${alternate.path}#book`, inLanguage: alternate.lang });
  assert.deepEqual(schema.associatedMedia, [{ '@type': 'MediaObject', name: `${book.title} · ${book.lang === 'fr' ? 'EPUB sombre' : 'Dark EPUB'}`, contentUrl: `${SITE}${book.epub}`, encodingFormat: 'application/epub+zip', contentSize: `${media(book).bytes} bytes`, sha256: media(book).sha256 }]);
  assert.equal(plain(sole(inside, node => node.tagName === 'code', 'visible digest')), media(book).sha256);
  assert.doesNotMatch(plain(article), /—|(?:2|deux|two)\s+(?:horloges|clocks)/iu);
  return { all, article };
}

test('cum-cum editions preserve the six-chapter bilingual publication contract', () => {
  assert.deepEqual(Object.keys(cumcumEditions).sort(), ['en', 'fr']);
  for (const [lang, directory, title] of [['fr', 'cumcum-la-bataille-de-l-impot', 'Cum-cum : la bataille de l’impôt'], ['en', 'cumcum-the-tax-battle', 'Cum-cum: The Tax Battle']]) {
    const book = cumcumEditions[lang];
    assert.equal(book.lang, lang);assert.equal(book.theme, 'dark');assert.equal(book.title, title);
    assert.equal(book.path, `${lang === 'en' ? '/en' : ''}/publications/${directory}/`);
    assert.equal(book.epub, `/publications/${directory}-l0g.epub`);
    assert.equal(book.cover, `/publications/${directory}-cover.jpg`);
    assert.equal(book.social, `/publications/${directory}-og-v1.jpg`);
    assert.equal(book.panorama, '/publications/cumcum-publication-panorama.jpg');
    assert.equal(book.date, '2026-10-28');assert.equal(book.documentationDate, '2026-10-28');
    assert.equal(book.chapters.length, 6);assert.equal(book.figureCount, 26);assert.equal(book.sourceCount, 93);
    assert.deepEqual(book.chapters.map(chapter => chapter.number), [1, 2, 3, 4, 5, 6]);
    assert.equal(new Set(book.chapters.map(chapter => chapter.route)).size, 6);
  }
});

test('both compiled pages preserve native metadata, all six chapters and authentic file integrity', () => {
  for (const book of Object.values(cumcumEditions)) checkPage(compiled(book), book);
});

test('page contract rejects complete URL substitutions, altered hashes and missing chapter links', () => {
  const book = cumcumEditions.fr, html = compiled(book);
  for (const replacement of [`${book.epub}?alias=1`, `${book.epub}#hidden`, `${book.epub}/`, `https://example.org${book.epub}`, `//l0g.fr${book.epub}`, `https://l0g.fr.example.org${book.epub}`, `https://user@l0g.fr${book.epub}`, 'javascript:alert(1)']) {
    const altered = html.replace(`href="${book.epub}"`, `href="${replacement}"`);
    assert.notEqual(altered, html);assert.throws(() => checkPage(altered, book), replacement);
  }
  for (const [before, after] of [[media(book).sha256, '0'.repeat(64)], [`"contentSize":"${media(book).bytes} bytes"`, `"contentSize":"${media(book).bytes + 1} bytes"`], [`href="${book.chapters[5].route}"`, 'href="/posts/other/"']]) {
    const altered = html.replace(before, after);assert.notEqual(altered, html);assert.throws(() => checkPage(altered, book));
  }
  for (const link of [`<a href="${book.epub}" download>Extra download</a>`, `<a href="${book.epub}">Extra file</a>`]) {
    const altered = html.replace('</article>', `${link}</article>`);assert.notEqual(altered, html);assert.throws(() => checkPage(altered, book));
  }
});

test('both catalogues expose the new book first while retaining the older publications and truthful totals', () => {
  for (const book of Object.values(cumcumEditions)) {
    const route = book.lang === 'fr' ? 'publications' : 'en/publications';
    const all = nodes(parse(readFileSync(join(ROOT, 'dist', route, 'index.html'), 'utf8')));
    const cards = all.filter(node => node.tagName === 'article' && hasClass(node, 'publication-spotlight'));
    assert.equal(cards.length, book.lang === 'fr' ? 17 : 14);
    assert(hasClass(cards[0], 'publication-spotlight--cumcum'));
    assert(hasClass(cards[1], 'publication-spotlight--insurance-promise'));
    const first = nodes(cards[0]);
    const downloads = first.filter(node => node.tagName === 'a' && attr(node, 'download') !== undefined);
    assert.equal(downloads.length, 1);assert.equal(attr(downloads[0], 'href'), book.epub);
    assert(first.some(node => node.tagName === 'a' && attr(node, 'href') === book.path));
    assert.equal(plain(first.find(node => node.tagName === 'h2')), book.title);
    assert.equal(attr(first.find(node => node.tagName === 'img'), 'src'), book.cover);
    const facts = nodes(first.find(node => node.tagName === 'ul' && hasClass(node, 'publication-facts'))).filter(node => node.tagName === 'strong');
    assert.equal(plain(facts[0]), '6');assert.equal(plain(facts[1]), '26');
    const totalChapters = cards.reduce((sum, card) => sum + Number(plain(nodes(nodes(card).find(node => node.tagName === 'ul' && hasClass(node, 'publication-facts'))).find(node => node.tagName === 'strong'))), 0);
    assert.equal(totalChapters, book.lang === 'fr' ? 120 : 93);
    const totalDownloads = cards.reduce((sum, card) => sum + nodes(card).filter(node => node.tagName === 'a' && attr(node, 'download') !== undefined).length, 0);
    assert.equal(totalDownloads, cards.length);
    if (book.lang === 'fr') {
      const heroStats = nodes(sole(all, node => node.tagName === 'dl' && hasClass(node, 'page-hero-stats'), 'catalogue statistics')).filter(node => node.tagName === 'dd').map(node => Number(plain(node)));
      assert.deepEqual(heroStats, [cards.length, totalChapters, totalDownloads]);
    }
    assert.equal(meta(all, 'property', 'og:image'), `${SITE}${book.social}`);
  }
});

test('covers, landscape cards and panorama use distinct real raster assets with accurate dimensions and variants', async () => {
  for (const book of Object.values(cumcumEditions)) {
    assert.notEqual(book.cover, book.social);assert.notEqual(book.cover, book.panorama);assert.notEqual(book.social, book.panorama);
    for (const [asset, width, height] of [[book.cover, 1024, 1638], [book.social, 1200, 630], [book.panorama, 1600, 800]]) {
      const info = await sharp(join(ROOT, 'public', asset)).metadata();assert.equal(info.width, width, asset);assert.equal(info.height, height, asset);
    }
    const social = getPublicationSocial(book.path);assert.notDeepEqual(readFileSync(join(ROOT, 'public', book.social)), readFileSync(join(ROOT, 'public', social.art)));
    const { article } = checkPage(compiled(book), book);
    for (const image of nodes(article).filter(node => node.tagName === 'img')) {
      assert(attr(image, 'alt')?.trim());const path = attr(image, 'src');assert(path.startsWith('/'));
      const info = await sharp(join(ROOT, 'public', path)).metadata();assert.equal(info.width, Number(attr(image, 'width')), path);assert.equal(info.height, Number(attr(image, 'height')), path);
      for (const item of (attr(image, 'srcset') ?? '').split(',').filter(Boolean)) {
        const [file, descriptor] = item.trim().split(/\s+/u), width = Number(descriptor.slice(0, -1));
        assert.equal(descriptor, `${width}w`);assert.equal((await sharp(join(ROOT, 'public', file)).metadata()).width, width, file);
      }
    }
  }
});

test('publication presentation preserves theme tokens, responsive images and keyboard affordances without local scripting', () => {
  const component = readFileSync(join(ROOT, 'src/components/CumCumPublication.astro'), 'utf8');
  assert.doesNotMatch(component, /<script(?! type="application\/ld\+json")|<svg\b|<foreignObject|on(?:click|load)\s*=|\bfetch\s*\(|\blocalStorage\b/u);
  assert.match(component, /serializeInlineScriptData\(jsonLd\)/u);
  const css = postcss.parse(component.match(/<style>([\s\S]*?)<\/style>/u)[1]);
  const declarations = selector => {
    const found=[];css.walkRules(rule=>{if(rule.selector===selector && rule.parent.type==='root')found.push(rule);});assert.equal(found.length,1,selector);
    return new Map(found[0].nodes.filter(node=>node.type==='decl').map(node=>[node.prop,node.value]));
  };
  assert.equal(declarations('.download-action').get('color'), 'var(--color-bright)');
  assert.equal(declarations('.book-shell > img').get('width'), '100%');assert.equal(declarations('.book-shell > img').get('height'), 'auto');
  assert.equal(declarations('.panorama img').get('width'), '100%');assert.equal(declarations('.panorama img').get('height'), 'auto');
  assert.equal(declarations('a:focus-visible,summary:focus-visible').get('outline'), '2px solid var(--color-signal)');
  assert.match(component, /@media\(max-width:780px\)/u);assert.match(component, /@media\(prefers-reduced-motion:reduce\)/u);
});

test('article entrypoints target the six existing slugs and emit one controlled publication teaser', () => {
  for (const [lang, route] of [['fr', 'src/pages/posts/[...slug].astro'], ['en', 'src/pages/en/analysis/[...slug].astro']]) {
    const source = readFileSync(join(ROOT, route), 'utf8');
    assert.match(source, new RegExp(`const hasCumCumEpub = cumcumEditions\\.${lang}\\.chapters\\.some\\(chapter => chapter\\.slug === post\\.id\\);`, 'u'));
    assert.equal(source.split(`<CumCumEpubCard lang="${lang}" />`).length - 1, 1);
    assert.match(source, /\{hasCumCumEpub && <CumCumEpubCard /u);
  }
  const card = readFileSync(join(ROOT, 'src/components/CumCumEpubCard.astro'), 'utf8');
  assert.equal((card.match(/<a\s/gu) ?? []).length, 1);
  assert.match(card, /<aside class="cumcum-epub" data-pagefind-ignore/u);
  assert.match(card, /href=\{book\.path\}/u);
  assert.doesNotMatch(card, /<script\b|set:html/u);
});

test('all twelve canonical analyses link to their language book after the article body without changing article dates', () => {
  for (const book of Object.values(cumcumEditions)) for (const chapter of book.chapters) {
    const all = nodes(parse(readFileSync(join(ROOT, 'dist', chapter.route, 'index.html'), 'utf8')));
    const card = sole(all, node => node.tagName === 'aside' && hasClass(node, 'cumcum-epub'), chapter.route);
    assert.equal(attr(card, 'data-pagefind-ignore'), '');
    const link = sole(nodes(card), node => node.tagName === 'a', 'one publication link');assert.equal(attr(link, 'href'), book.path);
    const body = sole(all, node => attr(node, 'data-reading-body') !== undefined, 'article body');
    assert.equal(card.parentNode, body.parentNode);
    const siblings = body.parentNode.childNodes.filter(node => node.tagName);assert.equal(siblings[siblings.indexOf(body)+1], card);
    const image = sole(nodes(card), node => node.tagName === 'img', 'teaser cover');assert.equal(attr(image, 'src'), book.cover);assert.equal(attr(image, 'loading'), 'lazy');
    const schemas = all.filter(node => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json').flatMap(node => {const schema=JSON.parse(text(node));return schema['@graph'] ?? [schema];});
    const article = sole(schemas, schema => schema['@type'] === 'NewsArticle', 'article dates');
    const source = readFileSync(join(ROOT, 'src/content', book.lang === 'fr' ? 'posts' : 'posts-en', `${chapter.slug}.mdx`), 'utf8');
    const frontmatter = parseFrontmatter(source).frontmatter;
    assert.equal(article.datePublished, new Date(frontmatter.pubDate).toISOString());
    assert.equal(article.dateModified, new Date(frontmatter.updatedDate ?? frontmatter.pubDate).toISOString());
  }
  for (const route of ['/posts/assureurs-fonds-08-solidite-promesse/', '/en/analysis/insurers-asset-managers-08-promise/']) {
    const all = nodes(parse(readFileSync(join(ROOT, 'dist', route, 'index.html'), 'utf8')));
    assert.equal(all.filter(node => node.tagName === 'aside' && hasClass(node, 'cumcum-epub')).length, 0, route);
  }
});
