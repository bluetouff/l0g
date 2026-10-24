import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import test from 'node:test';
import { parse } from 'parse5';
import sharp from 'sharp';
import postcss from 'postcss';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { cyberRecoveryEditions } from '../src/config/cyber-recovery-publication.mjs';
import { getPublicationSocial } from '../src/config/publication-social.mjs';
import { editorialTitleViolation } from './editorial-title-policy.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const SITE = 'https://l0g.fr';
const nodes = node => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const attr = (node, name) => node.attrs?.find(attribute => attribute.name === name)?.value;
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
const plain = node => text(node).replace(/\s+/gu, ' ').trim();
const hasClass = (node, name) => (attr(node, 'class') ?? '').split(/\s+/u).includes(name);
const pageHtml = book => readFileSync(join(ROOT, 'dist', book.path, 'index.html'), 'utf8');
const mediaFor = edition => {
  const bytes = readFileSync(join(ROOT, 'public', edition.epub));
  return { bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex') };
};

function assertCyberRecoveryPage(html, book) {
  const all = nodes(parse(html));
  const article = all.filter(node => node.tagName === 'article' && hasClass(node, 'cyber-recovery-book'));
  assert.equal(article.length, 1);
  const inside = nodes(article[0]);
  const headings = inside.filter(node => ['h1', 'h2', 'h3'].includes(node.tagName));
  const h1 = headings.filter(node => node.tagName === 'h1');
  assert.equal(h1.length, 1);
  assert.equal(plain(h1[0]), book.title);
  for (const heading of headings) assert.equal(editorialTitleViolation(plain(heading)), null, plain(heading));

  const canonical = all.filter(node => node.tagName === 'link' && attr(node, 'rel') === 'canonical');
  assert.equal(canonical.length, 1);
  assert.equal(attr(canonical[0], 'href'), `${SITE}${book.path}`);
  const alternates = all.filter(node => node.tagName === 'link' && attr(node, 'rel') === 'alternate' && attr(node, 'hreflang'));
  assert.deepEqual(alternates.map(node => [attr(node, 'hreflang'), attr(node, 'href')]).sort(), [
    ['fr', `${SITE}${cyberRecoveryEditions.fr.path}`], ['en', `${SITE}${cyberRecoveryEditions.en.path}`], ['x-default', `${SITE}${cyberRecoveryEditions.fr.path}`],
  ].sort());
  const robots = all.filter(node => node.tagName === 'meta' && attr(node, 'name') === 'robots');
  assert.equal(robots.length, 1);
  assert.equal(attr(robots[0], 'content'), 'index,follow,max-image-preview:large');
  assert.equal(attr(all.find(node => node.tagName === 'html'), 'lang'), book.lang);
  const descriptions = all.filter(node => node.tagName === 'meta' && attr(node, 'name') === 'description');
  assert.equal(descriptions.length, 1);assert.equal(attr(descriptions[0], 'content'), book.description);
  assert.ok(book.description.length <= 160, 'Native SEO description must fit without truncation');

  const social = getPublicationSocial(book.path);
  assert(social);
  assert.equal(social.image, book.social);
  for (const [attribute, name] of [['property', 'og:image'], ['name', 'twitter:image']]) {
    const meta = all.filter(node => node.tagName === 'meta' && attr(node, attribute) === name);
    assert.equal(meta.length, 1);
    assert.equal(attr(meta[0], 'content'), `${SITE}${social.image}`);
  }
  for (const [name, expected] of [['og:image:width', '1200'], ['og:image:height', '630'], ['og:image:alt', social.alt]]) {
    assert.equal(attr(all.find(node => node.tagName === 'meta' && attr(node, 'property') === name), 'content'), expected);
  }

  const downloadAnchors = inside.filter(node => node.tagName === 'a' && attr(node, 'download') !== undefined);
  assert.equal(book.theme, 'dark');
  assert.equal(downloadAnchors.length, 1);
  assert.equal(attr(downloadAnchors[0], 'href'), book.epub);
  assert.equal(attr(downloadAnchors[0], 'id'), 'telecharger');
  const hero = inside.find(node => node.tagName === 'section' && hasClass(node, 'book-hero'));
  assert(hero);
  assert(nodes(hero).includes(downloadAnchors[0]));
  assert.equal(downloadAnchors[0].childNodes.filter(node => node.nodeName === '#text').map(text).join('').trim(), book.lang === 'fr' ? 'Télécharger l’EPUB sombre' : 'Download the dark EPUB');
  const fileLinks = inside.filter(node => node.tagName === 'a' && attr(node, 'href') && new URL(attr(node, 'href'), SITE).pathname.toLowerCase().endsWith('.epub'));
  assert.deepEqual(fileLinks, downloadAnchors);
  assert.equal(inside.filter(node => hasClass(node, 'download-card') || hasClass(node, 'download-grid') || hasClass(node, 'reading-swatch')).length, 0);
  assert.doesNotMatch(plain(article[0]), /(?:fond clair|EPUB clair|sombre (?:et|ou) clair|dark (?:and|or) light|light EPUB|light edition|two backgrounds|deux fonds)/iu);
  assert(!inside.some(node => attr(node, 'href') === `/publications/${book.directory}-light-l0g.epub`));

  const schemas = all.filter(node => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json').map(node => JSON.parse(text(node)));
  const bookSchemas = schemas.filter(schema => schema['@type'] === 'Book');
  assert.equal(bookSchemas.length, 1);
  const schema = bookSchemas[0];
  assert.equal(schema['@context'], 'https://schema.org');
  assert.equal(schema['@id'], `${SITE}${book.path}#book`);
  assert.equal(schema.url, `${SITE}${book.path}`);
  assert.equal(schema.name, book.title);
  assert.equal(schema.description, book.description);
  assert.equal(schema.inLanguage, book.lang);
  assert.equal(schema.datePublished, book.date);
  assert.equal(schema.dateModified, book.modified);
  assert.deepEqual(schema.author, { '@id': `${SITE}/about/#bluetouff` });
  assert.deepEqual(schema.publisher, { '@id': `${SITE}/#org` });
  assert.equal(schema.license, 'https://creativecommons.org/licenses/by/4.0/');
  assert.equal(schema.bookFormat, 'https://schema.org/EBook');
  assert.equal(schema.isAccessibleForFree, true);
  assert.deepEqual(schema.hasPart, book.chapters.map(chapter => ({ '@type': 'Article', name: chapter.title, url: `${SITE}${chapter.route}` })));
  assert.deepEqual(schema.associatedMedia, [{
    '@type': 'MediaObject', name: `${book.title} · ${book.lang === 'fr' ? 'EPUB sombre' : 'Dark EPUB'}`,
    contentUrl: `${SITE}${book.epub}`, encodingFormat: 'application/epub+zip',
    contentSize: `${mediaFor(book).bytes} bytes`, sha256: mediaFor(book).sha256,
  }]);
  assert.equal(schema.image, `${SITE}${book.cover}`);
  const visibleDigests = inside.filter(node => node.tagName === 'code');
  assert.equal(visibleDigests.length, 1);
  assert.equal(plain(visibleDigests[0]), mediaFor(book).sha256);
  const alternate = cyberRecoveryEditions[book.lang === 'fr' ? 'en' : 'fr'];
  assert.deepEqual(schema[book.lang === 'fr' ? 'workTranslation' : 'translationOfWork'], { '@type': 'Book', '@id': `${SITE}${alternate.path}#book`, inLanguage: alternate.lang });

  const chapters = inside.find(node => node.tagName === 'ol' && hasClass(node, 'chapter-grid'));
  assert(chapters);
  const chapterLinks = nodes(chapters).filter(node => node.tagName === 'a');
  assert.deepEqual(chapterLinks.map(node => attr(node, 'href')), book.chapters.map(chapter => chapter.route));
  assert.equal(chapterLinks.length, 8);
  for (const [index, link] of chapterLinks.entries()) {
    const heading = nodes(link).find(node => node.tagName === 'h3');
    assert.equal(plain(heading), book.chapters[index].title);
  }
  const glossary = inside.find(node => node.tagName === 'dl' && hasClass(node, 'glossary-list'));
  assert(glossary);
  assert.deepEqual(nodes(glossary).filter(node => node.tagName === 'a').map(node => attr(node, 'href')), book.glossary.slice(0, 6).map(entry => entry.path));
  for (const entry of book.glossary.slice(0, 6)) assert(plain(glossary).includes(entry.definition));
  for (const paragraph of [...book.introduction.slice(0, 2), ...book.conclusion.slice(0, 2), ...book.method.slice(0, 1)]) assert(plain(article[0]).includes(paragraph));
  assert(inside.some(node => node.tagName === 'a' && attr(node, 'href') === (book.lang === 'fr' ? '/publications/' : '/en/publications/')));
  assert(inside.some(node => node.tagName === 'a' && attr(node, 'href') === alternate.path && attr(node, 'hreflang') === alternate.lang));
  const ids = inside.map(node => attr(node, 'id')).filter(Boolean);
  assert.equal(ids.length, new Set(ids).size);
  for (const link of inside.filter(node => node.tagName === 'a' && attr(node, 'href')?.startsWith('#'))) assert(ids.includes(attr(link, 'href').slice(1)));
  return { article: article[0], all };
}

test('cyber-recovery editions expose the fixed bilingual routes and single dark file contract', () => {
  assert.deepEqual(Object.keys(cyberRecoveryEditions).sort(), ['en', 'fr']);
  for (const [lang, directory] of [['fr', 'apres-la-cyberattaque'], ['en', 'after-the-cyberattack']]) {
    const book = cyberRecoveryEditions[lang];
    assert.equal(book.lang, lang);assert.equal(book.theme, 'dark');
    assert.equal(book.path, `${lang === 'en' ? '/en' : ''}/publications/${directory}/`);
    assert.equal(book.epub, `/publications/${directory}-l0g.epub`);
    assert.equal(book.cover, `/publications/${directory}-cover.jpg`);
    assert.equal(book.social, `/publications/${directory}-og-v1.jpg`);
    assert.equal(book.panorama, '/publications/cyber-recovery-publication-panorama.jpg');
    assert.equal(book.title, lang === 'fr' ? 'Après la cyberattaque' : 'After the cyberattack');
    assert.equal(book.subtitle, lang === 'fr' ? 'Qui finance la reprise ?' : 'Who pays for recovery?');
    assert.equal(book.chapters.length, 8);assert.equal(book.figureCount, 32);
    assert.deepEqual(book.chapters.map(chapter => chapter.number), [1,2,3,4,5,6,7,8]);
    assert.equal(new Set(book.chapters.map(chapter => chapter.route)).size, 8);
  }
});

test('dynamic article routes select only the eight configured chapter slugs and emit one controlled teaser', () => {
  for (const [lang, route] of [['fr', 'src/pages/posts/[...slug].astro'], ['en', 'src/pages/en/analysis/[...slug].astro']]) {
    const source = readFileSync(join(ROOT, route), 'utf8');
    assert.match(source, new RegExp(`const hasCyberRecoveryEpub = cyberRecoveryEditions\\.${lang}\\.chapters\\.some\\(chapter => chapter\\.slug === post\\.id\\);`, 'u'));
    assert.equal(source.split(`<CyberRecoveryEpubCard lang="${lang}" />`).length - 1, 1);
    assert.match(source, /\{hasCyberRecoveryEpub && <CyberRecoveryEpubCard /u);
  }
  const card = readFileSync(join(ROOT, 'src/components/CyberRecoveryEpubCard.astro'), 'utf8');
  assert.equal((card.match(/<a\s/gu) ?? []).length, 1);
  assert.match(card, /<aside class="cyber-recovery-epub" data-pagefind-ignore/u);
  assert.match(card, /href=\{book\.path\}/u);
  assert.doesNotMatch(card, /<script\b|set:html/u);
});

test('catalogue downloads retain readable text on their tinted surface in both themes', () => {
  const component = readFileSync(join(ROOT, 'src/components/PublicationSpotlight.astro'), 'utf8');
  const css = postcss.parse(component.match(/<style>([\s\S]*?)<\/style>/u)[1]);
  const rules = [];css.walkRules(rule => { if (rule.selector === '.publication-primary') rules.push(rule); });
  assert.equal(rules.length, 1);
  const declarations = new Map(rules[0].nodes.map(node => [node.prop, node.value]));
  assert.equal(declarations.get('color'), 'var(--color-bright)');
  assert.equal(declarations.get('background'), 'color-mix(in srgb, var(--color-amber) 9%, var(--color-surface))');
  const hover = [];css.walkRules(rule => { if (rule.selector === '.publication-primary:hover') hover.push(rule); });
  assert.equal(hover.length, 1);
  assert.equal(hover[0].nodes.find(node => node.prop === 'background').value, 'color-mix(in srgb, var(--color-amber) 12%, var(--color-surface))');
  const globalCss = postcss.parse(readFileSync(join(ROOT, 'src/styles/global.css'), 'utf8'));
  const rgb = value => {assert.match(value, /^#[0-9a-f]{6}$/iu);return [1,3,5].map(i => parseInt(value.slice(i,i+2),16));};
  const luminance = channels => channels.reduce((sum,v,i) => sum + [.2126,.7152,.0722][i] * (v/255 <= .04045 ? v/255/12.92 : ((v/255+.055)/1.055)**2.4), 0);
  for (const theme of ['dark', 'light']) {
    const tokens = new Map();
    globalCss.walkAtRules('theme', rule => rule.walkDecls(decl => tokens.set(decl.prop, decl.value)));
    if (theme === 'light') globalCss.walkRules(rule => { if (rule.selector === ':root[data-theme="light"]') rule.walkDecls(decl => tokens.set(decl.prop, decl.value)); });
    const surface = rgb(tokens.get('--color-surface')), amber = rgb(tokens.get('--color-amber'));
    for (const tint of [.09, .12]) {
      const background = surface.map((channel, i) => channel * (1 - tint) + amber[i] * tint);
      const b = luminance(background);
      for (const token of ['--color-bright', '--color-muted']) {
        const a = luminance(rgb(tokens.get(token)));
        assert.ok((Math.max(a,b)+.05)/(Math.min(a,b)+.05) >= 4.5, `${theme}, tint ${tint}: ${token} must retain small-text contrast`);
      }
    }
  }
});

test('each compiled language exposes exactly one dark EPUB with complete SEO metadata', () => {
  for (const book of Object.values(cyberRecoveryEditions)) assertCyberRecoveryPage(pageHtml(book), book);
});

test('publication checks reject complete-field URL substitutions, missing downloads and altered file integrity', () => {
  const book = cyberRecoveryEditions.fr;
  const html = pageHtml(book);
  const epub = book.epub;
  const invalid = [`${epub}?alias=1`, `${epub}#hidden`, `${epub}/`, `https://example.org${epub}`, `//l0g.fr${epub}`, `https://l0g.fr.example.org${epub}`, `https://user@l0g.fr${epub}`, 'javascript:alert(1)'];
  for (const replacement of invalid) {
    const altered = html.replace(`href="${epub}"`, `href="${replacement}"`);
    assert.notEqual(altered, html);
    assert.throws(() => assertCyberRecoveryPage(altered, book), replacement);
  }
  const changedDigest = html.replace(mediaFor(book).sha256, '0'.repeat(64));
  assert.notEqual(changedDigest, html);
  assert.throws(() => assertCyberRecoveryPage(changedDigest, book));
  const changedDownload = html.replace(`href="${epub}" download`, `href="${epub}" data-removed-download`);
  assert.notEqual(changedDownload, html);
  assert.throws(() => assertCyberRecoveryPage(changedDownload, book));
  for (const link of [
    `<a href="${epub}" download>Duplicate dark EPUB</a>`,
    `<a href="${epub}">Duplicate file link</a>`,
    `<a href="/publications/${book.directory}-light-l0g.epub" download>Light EPUB</a>`,
    `<a href="/publications/${book.directory}-light-l0g.epub">Light EPUB</a>`,
    `<a href="/publications/${book.directory}-light-l0g.epub?alias=1">Light EPUB</a>`,
    `<a href="/publications/${book.directory}-light-l0g.epub#download">Light EPUB</a>`,
  ]) {
    const altered = html.replace('</article>', `${link}</article>`);
    assert.notEqual(altered, html);
    assert.throws(() => assertCyberRecoveryPage(altered, book), link);
  }
});

test('both catalogues retain the cyber-recovery book after the insurer edition with one dark download per language', () => {
  for (const book of Object.values(cyberRecoveryEditions)) {
    const route = book.lang === 'fr' ? 'publications' : 'en/publications';
    const html = readFileSync(join(ROOT, 'dist', route, 'index.html'), 'utf8');
    const cards = nodes(parse(html)).filter(node => node.tagName === 'article' && hasClass(node, 'publication-spotlight'));
    assert.equal(cards.length, book.lang === 'fr' ? 16 : 13);
    assert(hasClass(cards[0], 'publication-spotlight--insurance-promise'));
    assert(hasClass(cards[1], 'publication-spotlight--cyber-recovery'));
    const cyberCard = cards[1];
    const first = nodes(cyberCard);
    assert(first.some(node => node.tagName === 'a' && attr(node, 'href') === book.path));
    const downloads = first.filter(node => node.tagName === 'a' && attr(node, 'download') !== undefined);
    assert.equal(downloads.length, 1);
    assert(hasClass(downloads[0], 'publication-primary'));
    assert(plain(downloads[0]).includes(book.lang === 'fr' ? 'Télécharger l’EPUB' : 'Download the EPUB'));
    assert.deepEqual(downloads.map(node => attr(node, 'href')), [book.epub]);
    assert.doesNotMatch(plain(cyberCard), /(?:fond clair|EPUB clair|sombre (?:et|ou) clair|dark (?:and|or) light|light EPUB|light edition)/iu);
    assert(!first.some(node => attr(node, 'href') === `/publications/${book.directory}-light-l0g.epub`));
    assert(plain(cyberCard).includes(String(book.figureCount)));
    assert.equal(attr(first.find(node => node.tagName === 'img'), 'src'), book.cover);
    const chapterTotal = cards.reduce((total, card) => {
      const facts = nodes(card).find(node => node.tagName === 'ul' && hasClass(node, 'publication-facts'));
      return total + Number(plain(nodes(facts).find(node => node.tagName === 'strong')));
    }, 0);
    assert.equal(chapterTotal, book.lang === 'fr' ? 114 : 87);
    if (book.lang === 'fr') {
      const stats = nodes(parse(html)).find(node => node.tagName === 'dl' && hasClass(node, 'page-hero-stats'));
      assert(stats);
      const values = nodes(stats).filter(node => node.tagName === 'dd').map(node => Number(plain(node)));
      const totalChapters = cards.reduce((total, card) => {
        const facts = nodes(card).find(node => node.tagName === 'ul' && hasClass(node, 'publication-facts'));
        const firstCount = nodes(facts).find(node => node.tagName === 'strong');
        return total + Number(plain(firstCount));
      }, 0);
      const totalDownloads = cards.reduce((total, card) => total + nodes(card).filter(node => node.tagName === 'a' && attr(node, 'download') !== undefined).length, 0);
      assert.deepEqual(values, [cards.length, totalChapters, totalDownloads]);
      assert.deepEqual(values, [16, 114, 16]);
    }
  }
});

test('all sixteen articles link back to their book after the analysis while preserving publication dates', () => {
  for (const book of Object.values(cyberRecoveryEditions)) {
    for (const chapter of book.chapters) {
      const html = readFileSync(join(ROOT, 'dist', chapter.route, 'index.html'), 'utf8');
      const all = nodes(parse(html));
      const cards = all.filter(node => node.tagName === 'aside' && hasClass(node, 'cyber-recovery-epub'));
      assert.equal(cards.length, 1, chapter.route);
      const links = nodes(cards[0]).filter(node => node.tagName === 'a');
      assert.equal(links.length, 1);
      assert.equal(attr(links[0], 'href'), book.path);
      assert.doesNotMatch(plain(cards[0]), /(?:fond clair|EPUB clair|sombre (?:et|ou) clair|dark (?:and|or) light|light EPUB|light edition)/iu);
      assert.equal(attr(cards[0], 'data-pagefind-ignore'), '');
      const body = all.find(node => attr(node, 'data-reading-body') !== undefined);
      assert(body);
      assert.equal(cards[0].parentNode, body.parentNode);
      const siblings = body.parentNode.childNodes.filter(node => node.tagName);
      assert.equal(siblings[siblings.indexOf(body) + 1], cards[0]);
      const image = nodes(cards[0]).find(node => node.tagName === 'img');
      assert.equal(attr(image, 'src'), book.cover);
      assert.equal(attr(image, 'loading'), 'lazy');
      const source = readFileSync(join(ROOT, 'src/content', book.lang === 'fr' ? 'posts' : 'posts-en', `${chapter.slug}.mdx`), 'utf8');
      const meta = parseFrontmatter(source).frontmatter;
      const schemas = all.filter(node => node.tagName === 'script' && attr(node, 'type') === 'application/ld+json').flatMap(node => {
        const schema = JSON.parse(text(node));
        return schema['@graph'] ?? [schema];
      });
      const articles = schemas.filter(schema => schema['@type'] === 'NewsArticle');
      assert.equal(articles.length, 1);
      assert.equal(articles[0].datePublished, new Date(meta.pubDate).toISOString());
      assert.equal(articles[0].dateModified, new Date(meta.updatedDate ?? meta.pubDate).toISOString());
    }
  }
  for (const route of ['/posts/quitter-microsoft-7-liberte-choix/', '/en/analysis/leaving-microsoft-7-freedom-to-choose/']) {
    const all = nodes(parse(readFileSync(join(ROOT, 'dist', route, 'index.html'), 'utf8')));
    assert.equal(all.filter(node => node.tagName === 'aside' && hasClass(node, 'cyber-recovery-epub')).length, 0, route);
  }
});

test('publication images are distinct, responsive and backed by actual assets', async () => {
  for (const book of Object.values(cyberRecoveryEditions)) {
    const social = getPublicationSocial(book.path);
    assert.notEqual(book.cover, book.social);
    for (const [asset, width, height] of [[book.cover, 1024, 1638], [book.social, 1200, 630], [book.panorama, 1600, 800]]) {
      const metadata = await sharp(join(ROOT, 'public', asset)).metadata();
      assert.equal(metadata.width, width, asset);
      assert.equal(metadata.height, height, asset);
    }
    assert.notDeepEqual(readFileSync(join(ROOT, 'public', book.social)), readFileSync(join(ROOT, 'public', social.art)));
    const { article } = assertCyberRecoveryPage(pageHtml(book), book);
    for (const image of nodes(article).filter(node => node.tagName === 'img')) {
      assert(attr(image, 'alt')?.trim());
      const source = attr(image, 'src');
      assert(source.startsWith('/'));
      const meta = await sharp(join(ROOT, 'public', source)).metadata();
      assert.equal(meta.width, Number(attr(image, 'width')), source);
      assert.equal(meta.height, Number(attr(image, 'height')), source);
      const variants = attr(image, 'srcset');
      if (variants) for (const item of variants.split(',')) {
        const [file, descriptor] = item.trim().split(/\s+/u);
        const width = Number(descriptor.slice(0, -1));
        assert.equal(descriptor, `${width}w`);
        assert.equal((await sharp(join(ROOT, 'public', file)).metadata()).width, width, file);
      }
    }
  }
});


test('book-page guards reject changed byte counts, translated canonicals and omitted chapters', () => {
  const book = cyberRecoveryEditions.fr, html = pageHtml(book), bytes = mediaFor(book).bytes;
  for (const [before, after] of [
    [`"contentSize":"${bytes} bytes"`, `"contentSize":"${bytes + 1} bytes"`],
    [`rel="canonical" href="${SITE}${book.path}"`, `rel="canonical" href="${SITE}${cyberRecoveryEditions.en.path}"`],
    [`href="${book.chapters[0].route}"`, 'href="/posts/unknown-recovery-chapter/"'],
  ]) {
    const changed = html.replace(before, after);assert.notEqual(changed, html, 'Mutation must alter its complete target');
    assert.throws(() => assertCyberRecoveryPage(changed, book));
  }
});
