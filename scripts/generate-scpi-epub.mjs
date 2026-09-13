import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import { unified } from 'unified';
import rehypeStringify from 'rehype-stringify';
import GithubSlugger from 'github-slugger';
import { XMLValidator } from 'fast-xml-parser';
import sharp from 'sharp';
import { scpiEditions } from '../src/config/scpi-publication.mjs';
import { renderOilMarkdown, standaloneSvg } from './generate-oil-epub.mjs';
import { escapeXml as xml, extractInfographics, normalizeVoidElements, xhtmlDocument } from './generate-e-invoicing-epub-lib.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const TEMPLATE = join(ROOT, 'src/epub/l-argent-d-epstein');
const SITE = 'https://l0g.fr';
const paragraphs = (items) => items.map((p) => `<p>${xml(p)}</p>`).join('\n');

// Read only controlled repository content. Reject active markup even when an
// entity or mixed-case spelling hides it in the source. Do not "repair" it.
export function assertPassiveTree(tree) {
  function inspect(node) {
    if (['script', 'iframe', 'object', 'embed', 'foreignObject', 'form', 'input', 'template', 'base', 'audio', 'video', 'animate', 'set'].includes(node.tagName)) throw new Error(`Active EPUB element: ${node.tagName}`);
    for (const [key, value] of Object.entries(node.properties ?? {})) {
      if (/^on/iu.test(key) || ['srcDoc', 'srcSet'].includes(key)) throw new Error(`Active EPUB attribute: ${key}`);
      if (['href', 'src', 'xLinkHref'].includes(key)) {
        const target = String(value);
        if (/[\u0000-\u0020\u007f\\]/u.test(target) || target.startsWith('//')) throw new Error('Unsafe EPUB URL');
        if (key !== 'href' && !/^\.\.\/media\/(?:cover\.jpg|file\d+\.svg)$/u.test(target) && !target.startsWith('#')) throw new Error('External EPUB resource');
        if (/^[a-z][a-z\d+.-]*:/iu.test(target) && !['https:', 'http:', 'mailto:'].includes(new URL(target).protocol)) throw new Error('Unsafe EPUB URL scheme');
      }
    }
    node.children?.forEach(inspect);
    if (node.content) inspect(node.content);
  }
  inspect(tree);
}

export function prepareReadingHtml(html, routes, number) {
  const tree = fromHtml(html, { fragment: true });
  assertPassiveTree(tree);
  const headings = [];
  const slugger = new GithubSlugger();
  function visit(node) {
    if (node.tagName === 'details') { node.tagName = 'section'; delete node.properties.open; }
    if (node.tagName === 'summary') { node.tagName = 'p'; node.properties.className = ['reading-box-title']; }
    if (node.tagName === 'h2') {
      const label = toText(node);
      node.properties.id ??= `c${number}-${slugger.slug(label)}`;
      headings.push({ title: label, id: node.properties.id });
    }
    if (node.tagName === 'a' && node.properties.href) {
      const href = String(node.properties.href);
      if (!href.startsWith('#')) {
        const url = new URL(href, SITE);
        if (url.origin === SITE && routes.has(url.pathname)) {
          const chapter = routes.get(url.pathname);
          node.properties.href = `${chapter.split('#')[0]}${url.hash || `#${chapter.split('#')[1]}`}`;
        } else if (href.startsWith('/')) node.properties.href = url.href;
      }
    }
    node.children?.forEach(visit);
  }
  visit(tree);
  return { html: normalizeVoidElements(unified().use(rehypeStringify).stringify(tree)), headings };
}

export async function generateScpiEpub(lang) {
  if (!['fr', 'en'].includes(lang)) throw new Error('Unsupported SCPI edition language');
  const book = scpiEditions[lang];
  const tr = (fr, en) => lang === 'fr' ? fr : en;
  const sourceDir = join(ROOT, 'src/epub', book.directory);
  const epubDir = join(sourceDir, 'EPUB');
  const media = join(epubDir, 'media');
  const textDir = join(epubDir, 'text');
  for (const dir of [media, textDir, join(epubDir, 'styles'), join(sourceDir, 'META-INF')]) mkdirSync(dir, { recursive: true });
  for (const file of ['mimetype', 'META-INF/container.xml', 'META-INF/com.apple.ibooks.display-options.xml']) copyFileSync(join(TEMPLATE, file), join(sourceDir, file));
  const saveXml = (path, text) => {
    const valid = XMLValidator.validate(text);
    if (valid !== true) throw new Error(`${path}: invalid EPUB XML: ${JSON.stringify(valid)}`);
    writeFileSync(path, text);
  };
  const writeChapter = (file, title, body, bodyType = 'bodymatter') => saveXml(join(textDir, file), xhtmlDocument(book, { title, body, bodyType }));
  const css = readFileSync(join(TEMPLATE, 'EPUB/styles/stylesheet1.css'), 'utf8');
  writeFileSync(join(epubDir, 'styles/stylesheet1.css'), `${css}\n.infographic-image { width:100%; background:#0b0d10; }\nfigure { max-width:520px; margin:1.6em auto 2em; }\n.reading-box-title { font-weight:bold; }\nsection[class*="exercise"], section[class*="sources"] { border:1px solid #cfd4da; padding:.7em; margin:1.3em 0; }\ntable { font-size:.85em; }\n@media(max-width:30em) { table { font-size:.82em; } th,td { padding:.3em; } }\n`);
  const master = join(ROOT, 'src/epub-assets', `${book.directory}-cover.png`);
  const cover = await sharp(master).resize(1024, 1638, { fit: 'contain', background: '#0b0d10' }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  writeFileSync(join(media, 'cover.jpg'), cover);
  writeFileSync(join(ROOT, 'public', book.cover), cover);
  for (const width of [320, 640, 960]) await sharp(cover).resize({ width }).webp({ quality: 84 }).toFile(join(ROOT, 'public', book.cover.replace('.jpg', `-${width}.webp`)));
  await sharp(cover).resize(1200, 630, { fit: 'contain', background: '#0b0d10' }).jpeg({ quality: 85, mozjpeg: true }).toFile(join(ROOT, 'public', book.social));
  const edition = tr('13 septembre 2026', '13 September 2026');
  writeChapter('cover.xhtml', tr('Couverture', 'Cover'), `<img src="../media/cover.jpg" alt="${xml(book.title)}" />`, 'frontmatter cover');
  writeChapter('title_page.xhtml', book.title, `<section class="titlepage"><h1>${xml(book.title)}</h1><p class="subtitle">${xml(book.subtitle)}</p><p class="author">l0g</p><p>${edition}</p><p>${tr('Édition française', 'English edition')}</p><p>${tr('Six analyses, un chapitre inédit, une introduction et une conclusion. Dix-huit infographies.', 'Six analyses, an additional chapter, an introduction and a conclusion. Eighteen infographics.')}</p><p>Creative Commons Attribution 4.0 International</p></section>`, 'frontmatter');
  const routes = new Map(book.chapters.map((a) => [a.route, `${a.chapter}#article-${a.number}`]));
  const nav = [{ title: `Introduction${tr(' : ', ': ')}${book.introductionTitle}`, href: 'text/ch001.xhtml' }];
  writeChapter('ch001.xhtml', book.introductionTitle, `<section id="introduction" epub:type="introduction"><p class="chapter-kicker">Introduction</p><h1>${xml(book.introductionTitle)}</h1>${paragraphs(book.introduction)}<p>${tr('Pour les règles de fonctionnement : ', 'For the structure and exit rules: ')}<a href="${book.introductionSource}">${tr('le guide SCPI de l’AMF', 'the AMF’s SCPI explainer (in French)')}</a>. ${tr('Les règles de l’assurance-vie sont sourcées au chapitre six.', 'The insurance rules and their sources are detailed in chapter six.')}</p></section>`);
  let count = 0;
  for (const article of book.chapters) {
    const source = readFileSync(join(ROOT, 'src/content', tr('posts', 'posts-en'), `${article.slug}.md`), 'utf8');
    const { frontmatter: meta } = parseFrontmatter(source);
    if (meta.title !== article.title || !meta.description || meta.draft) throw new Error(`SCPI metadata drift: ${article.slug}`);
    const figures = [];
    const markdown = source.replace(/^---\n[\s\S]*?\n---\n/u, '').replace(/<svg\b[\s\S]*?<\/svg>/gu, (svg) => {
      if (XMLValidator.validate(svg) !== true) throw new Error('Invalid article SVG');
      assertPassiveTree(fromHtml(svg, { fragment: true }));
      figures.push(standaloneSvg(svg));
      return `<div data-scpi-figure="${figures.length - 1}"></div>`;
    });
    if (figures.length !== 3) throw new Error(`${article.slug}: expected three figures`);
    let html = await renderOilMarkdown(markdown);
    figures.forEach((svg, index) => { const token = `<div data-scpi-figure="${index}"></div>`; if (!html.includes(token)) throw new Error('Missing SVG placeholder'); html = html.replace(token, svg); });
    const extracted = extractInfographics(html, article.number, count, media);
    count = extracted.next;
    const reading = prepareReadingHtml(extracted.html, routes, article.number);
    const date = new Intl.DateTimeFormat(tr('fr-FR', 'en-GB'), { dateStyle: 'long', timeZone: 'Europe/Paris' }).format(new Date(meta.pubDate));
    writeChapter(article.chapter, article.title, `<section id="article-${article.number}"><p class="chapter-kicker">${tr('Chapitre', 'Chapter')} ${article.number}</p><h1>${xml(article.title)}</h1><p class="chapter-dek">${xml(meta.description)}</p><p class="chapter-meta">${xml(date)} · <a href="${SITE}${article.route}">${tr('Version en ligne', 'Read online')}</a></p>${reading.html}</section>`);
    nav.push({ title: `${article.number}. ${article.title}`, href: `text/${article.chapter}`, children: reading.headings.map((h) => ({ title: h.title, href: `text/${article.chapter}#${h.id}` })) });
  }
  if (count !== book.figureCount) throw new Error('SCPI figure count drift');
  const bonus = prepareReadingHtml(await renderOilMarkdown(readFileSync(join(ROOT, 'src/publication-text', `scpi-private-credit-${lang}.md`), 'utf8')), routes, 7);
  writeChapter('ch008.xhtml', book.bonusTitle, `<section id="private-credit"><p class="chapter-kicker">${tr('Chapitre inédit', 'Additional chapter')} · 7</p><h1>${xml(book.bonusTitle)}</h1>${bonus.html}</section>`);
  nav.push({ title: `7. ${book.bonusTitle}`, href: 'text/ch008.xhtml', children: bonus.headings.map((h) => ({ title: h.title, href: `text/ch008.xhtml#${h.id}` })) });
  writeChapter('ch009.xhtml', book.conclusionTitle, `<section id="conclusion" epub:type="conclusion"><p class="chapter-kicker">Conclusion</p><h1>${xml(book.conclusionTitle)}</h1>${paragraphs(book.conclusion)}</section>`);
  nav.push({ title: `Conclusion${tr(' : ', ': ')}${book.conclusionTitle}`, href: 'text/ch009.xhtml' });
  const aboutTitle = tr('À propos de cette édition', 'About this edition');
  writeChapter('ch010.xhtml', aboutTitle, `<section id="edition"><h1>${xml(aboutTitle)}</h1><p>${xml(tr('Cette édition du 13 septembre 2026 réunit les six analyses SCPI, une introduction, un chapitre comparatif original et une conclusion. Les dates, réserves, sources et exemples fictifs des articles sont conservés. Les encadrés sont dépliés pour la lecture hors ligne. Les tableaux peuvent se lire en orientation paysage sur les petits écrans.', 'This edition of 13 September 2026 includes the six SCPI analyses, an introduction, an original comparative chapter and a conclusion. Article dates, qualifications, sources and hypothetical examples are retained. Boxes are expanded for offline reading. Landscape orientation can help with tables on smaller screens.'))}</p><p>${xml(tr('La couverture est une illustration conceptuelle créée avec une assistance d’intelligence artificielle. Elle ne représente aucun immeuble, fonds ni taux d’occupation réel.', 'The cover is a conceptual illustration created with AI assistance. It depicts no real building, fund or occupancy rate.'))}</p><p>${xml(tr('Les textes et les 18 graphiques sont disponibles hors ligne. Aucun script, police distante ou outil de suivi n’est embarqué. Les sources externes et le glossaire en ligne nécessitent une connexion. Le rendu et l’agrandissement des images dépendent de la liseuse.', 'Text and all 18 graphics are available offline. No scripts, remote fonts or trackers are included. External sources and the online glossary require a connection. Rendering and image enlargement depend on the reading application.'))}</p><h2>${tr('Articles d’origine', 'Original articles')}</h2><ol>${book.chapters.map((a) => `<li><a href="${SITE}${a.route}">${xml(a.title)}</a></li>`).join('')}</ol><p><a href="${SITE}${book.path}">${tr('Page de l’édition et corrections ultérieures', 'Edition page and subsequent corrections')}</a></p><p><a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a> · l0g</p></section>`);
  nav.push({ title: aboutTitle, href: 'text/ch010.xhtml' });
  const navList = (items) => `<ol>${items.map((e) => `<li><a href="${e.href}">${xml(e.title)}</a>${e.children ? navList(e.children) : ''}</li>`).join('')}</ol>`;
  saveXml(join(epubDir, 'nav.xhtml'), xhtmlDocument(book, { title: tr('Sommaire', 'Contents'), bodyType: 'frontmatter', body: `<nav epub:type="toc" id="toc"><h1>${tr('Sommaire', 'Contents')}</h1>${navList(nav)}</nav>` }).replace('../styles/stylesheet1.css', 'styles/stylesheet1.css'));
  let order = 0;
  const ncx = (items) => items.map((e) => { const n = ++order; return `<navPoint id="nav-${n}" playOrder="${n}"><navLabel><text>${xml(e.title)}</text></navLabel><content src="${e.href}"/>${e.children ? ncx(e.children) : ''}</navPoint>`; }).join('');
  saveXml(join(epubDir, 'toc.ncx'), `<?xml version="1.0" encoding="UTF-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="${lang}"><head><meta name="dtb:uid" content="${book.id}"/><meta name="dtb:depth" content="2"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>${xml(book.title)}</text></docTitle><navMap>${ncx(nav)}</navMap></ncx>`);
  const chapters = Array.from({ length: 10 }, (_, i) => `ch${String(i + 1).padStart(3, '0')}`);
  saveXml(join(epubDir, 'content.opf'), `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="${lang}" prefix="schema: http://schema.org/">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${book.id}</dc:identifier><dc:title>${xml(book.title)}</dc:title><dc:language>${lang}</dc:language><dc:creator>l0g</dc:creator><dc:publisher>l0g.fr</dc:publisher><dc:date>${book.date}</dc:date><dc:description>${xml(book.subtitle)}</dc:description><dc:source>${SITE}${book.path}</dc:source><dc:rights>Creative Commons Attribution 4.0 International</dc:rights><meta property="dcterms:modified">${book.modified}</meta><meta name="cover" content="cover-image"/><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityHazard">none</meta><meta property="schema:accessibilitySummary">${xml(tr('Texte redistribuable, sommaire structuré, encadrés ouverts, sources cliquables et descriptions alternatives des 18 infographies. Agrandissement selon la liseuse.', 'Reflowable text, structured navigation, expanded boxes, clickable sources and text alternatives for 18 infographics. Enlargement depends on the reader.'))}</meta></metadata>
<manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="css" href="styles/stylesheet1.css" media-type="text/css"/><item id="cover-image" href="media/cover.jpg" media-type="image/jpeg" properties="cover-image"/><item id="cover" href="text/cover.xhtml" media-type="application/xhtml+xml"/><item id="title" href="text/title_page.xhtml" media-type="application/xhtml+xml"/>${chapters.map((id) => `<item id="${id}" href="text/${id}.xhtml" media-type="application/xhtml+xml"/>`).join('')}${Array.from({ length: count }, (_, i) => `<item id="fig-${i}" href="media/file${i}.svg" media-type="image/svg+xml"/>`).join('')}</manifest>
<spine toc="ncx"><itemref idref="cover"/><itemref idref="title"/><itemref idref="nav"/>${chapters.map((id) => `<itemref idref="${id}"/>`).join('')}</spine></package>`);
  console.log(`${book.title}: six analyses, original comparison, introduction, conclusion and ${count} figures.`);
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  await generateScpiEpub('fr');
  await generateScpiEpub('en');
}
