import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { fromHtml } from 'hast-util-from-html';
import { unified } from 'unified';
import rehypeStringify from 'rehype-stringify';
import { XMLValidator } from 'fast-xml-parser';
import sharp from 'sharp';
import { slowdownEditions } from '../src/config/ai-slowdown-publication.mjs';
import { inspectFigure } from './generate-ia-recouvrement-epub.mjs';
export { inspectFigure } from './generate-ia-recouvrement-epub.mjs';
import { assertPassiveTree, prepareReadingHtml } from './generate-scpi-epub.mjs';
import { renderOilMarkdown } from './generate-oil-epub.mjs';
import { escapeXml as xml, extractInfographics, xhtmlDocument } from './generate-e-invoicing-epub-lib.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const TEMPLATE = join(ROOT, 'src/epub/l-argent-d-epstein');
const SITE = 'https://l0g.fr';
const paragraphs = (items) => items.map((p) => `<p>${xml(p)}</p>`).join('\n');

// The six-part edition omits only the web serial's announcement of a future instalment.
export function readingCopy(source) {
  return source
    .replace('Le prochain volet examinera ce qui se passe lorsque le financement recherché n’est plus un prêt, mais l’achat d’actions par de nouveaux investisseurs.', '')
    .replace('The next instalment will examine what changes when the money being sought is equity from new investors rather than a loan.', '');
}

export async function renderSlowdownArticle(source, chapter) {
  if (!Object.values(slowdownEditions).some(book => book.chapters.includes(chapter))) throw new Error('Unconfigured slowdown chapter');
  let markdown = readingCopy(source).replace(/^---\n[\s\S]*?\n---\n/u, '')
    .replace(/<p class="edition-link">[\s\S]*?<\/p>/gu, '');
  if (/^(?:import|export)\s/gmu.test(markdown)) throw new Error('Unexpected article import or export');
  const figures = [];
  markdown = markdown.replace(/<figure\b[\s\S]*?<\/figure>/gu, (figure) => {
    figures.push(inspectFigure(figure));
    return `<div data-slowdown-figure="${figures.length}"></div>`;
  });
  if (figures.length !== chapter.figureCount || /<svg\b/iu.test(markdown)) throw new Error('Unexpected article figures');
  const tree = fromHtml(await renderOilMarkdown(markdown), { fragment: true });
  assertPassiveTree(tree);
  // Markdown table alignment must use CSS in EPUB's HTML5 vocabulary.
  const alignTables = (node) => {
    if (['th', 'td'].includes(node.tagName) && node.properties.align) {
      const alignment = node.properties.align;
      if (!['left', 'right', 'center'].includes(alignment)) throw new Error('Invalid table alignment');
      node.properties.style = `${node.properties.style ?? ''};text-align:${alignment}`;
      delete node.properties.align;
    }
    node.children?.forEach(alignTables);
  };
  alignTables(tree);
  let html = unified().use(rehypeStringify).stringify(tree);
  for (const [index, figure] of figures.entries()) {
    const token = `<div data-slowdown-figure="${index + 1}"></div>`;
    if (html.split(token).length !== 2) throw new Error('Invalid figure placeholder');
    html = html.replace(token, figure);
  }
  return html;
}

export async function generateSlowdownEpub(lang = 'fr') {
  if (!['fr', 'en'].includes(lang)) throw new Error('Unsupported slowdown edition language');
  const isEn = lang === 'en';
  const book = slowdownEditions[lang];
  const chapters = book.chapters;
  const tr = (fr, en) => isEn ? en : fr;
  const sourceDir = join(ROOT, 'src/epub', book.directory);
  const epubDir = join(sourceDir, 'EPUB');
  const media = join(epubDir, 'media');
  const textDir = join(epubDir, 'text');
  for (const dir of [media, textDir, join(epubDir, 'styles'), join(sourceDir, 'META-INF')]) mkdirSync(dir, { recursive: true });
  for (const file of ['mimetype', 'META-INF/container.xml', 'META-INF/com.apple.ibooks.display-options.xml']) copyFileSync(join(TEMPLATE, file), join(sourceDir, file));
  const saveXml = (path, content) => {
    const valid = XMLValidator.validate(content);
    if (valid !== true) throw new Error(`${path}: invalid EPUB XML: ${JSON.stringify(valid)}`);
    writeFileSync(path, content);
  };
  const writeChapter = (file, title, body, bodyType = 'bodymatter') => {
    const document = xhtmlDocument(book, { title, body, bodyType });
    saveXml(join(textDir, file), bodyType === 'frontmatter cover' ? document.replace('<body ', '<body class="cover-page" ') : document);
  };
  const css = readFileSync(join(TEMPLATE, 'EPUB/styles/stylesheet1.css'), 'utf8');
  writeFileSync(join(epubDir, 'styles/stylesheet1.css'), `${css}\nfigure { max-width:30em; margin:1.6em auto 2em; }\n.infographic-image { width:100%; max-width:27em; background:#0b0d10; }\n.chapter-art { width:100%; margin:1.5em auto 2em; }\n.art-caption { font-size:.75em; color:#555c66; }\n.sources li { margin-bottom:1em; }\n.source-meta { display:block; font-size:.85em; color:#555c66; }\n.source-id { font-family:monospace; }\n.reading-box-title { font-weight:bold; }\n.cover-page { max-width:none; margin:0; padding:0; }\n`);
  const master = join(ROOT, `src/epub-assets/${book.directory}-cover.png`);
  const cover = await sharp(master).resize(1024, 1638, { fit: 'contain', background: '#0b0d10' }).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  writeFileSync(join(media, 'cover.jpg'), cover);
  writeFileSync(join(ROOT, 'public', book.cover), cover);
  for (const width of [320, 640, 960]) await sharp(cover).resize({ width }).webp({ quality: 84 }).toFile(join(ROOT, 'public', book.cover.replace('.jpg', `-${width}.webp`)));
  await sharp(cover).resize(1200, 630, { fit: 'contain', background: '#0b0d10' }).jpeg({ quality: 86, mozjpeg: true }).toFile(join(ROOT, 'public', book.social));
  const panorama = await sharp(join(ROOT, 'src/epub-assets/ai-slowdown-panorama.png')).resize(1600, 800, { fit: 'cover' }).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  writeFileSync(join(ROOT, 'public', book.panorama), panorama);
  writeFileSync(join(media, 'panorama.jpg'), panorama);
  for (const width of [640, 960, 1600]) await sharp(panorama).resize({ width }).webp({ quality: 82 }).toFile(join(ROOT, 'public', book.panorama.replace('.jpg', `-${width}.webp`)));
  writeChapter('cover.xhtml', tr('Couverture', 'Cover'), `<img src="../media/cover.jpg" alt="${xml(book.title)}" style="max-height:95vh" />`, 'frontmatter cover');
  writeChapter('title_page.xhtml', book.title, `<section class="titlepage"><h1>${xml(book.title)}</h1><p class="subtitle">${xml(book.subtitle)}</p><p class="author">l0g</p><p>${tr("27 septembre 2026 · Édition française", "27 September 2026 · English edition")}</p><p>${tr("Six analyses, quatorze infographies, une introduction et une conclusion originales.", "Six complete investigations, fourteen diagrams, an introduction and a conclusion.")}</p><p>Creative Commons Attribution 4.0 International</p></section>`, 'frontmatter');
  writeChapter('ch001.xhtml', book.introductionTitle, `<section id="introduction" epub:type="introduction"><p class="chapter-kicker">Introduction</p><h1>${xml(book.introductionTitle)}</h1><figure class="chapter-art"><img src="../media/panorama.jpg" alt="${tr("Un sablier de puces entre des serveurs et des contrats : les calendriers du calcul et du financement.", "An hourglass of chips between servers and contracts: the timetables of computing and finance.")}" /><figcaption>${tr("Illustration conceptuelle du parcours de lecture, créée avec une assistance d’intelligence artificielle.", "Conceptual illustration of the reading journey, created with AI assistance.")}</figcaption></figure>${paragraphs(book.introduction)}<p>${tr("Les dossiers et leurs références figurent dans les", "The investigations and their references are included in the")} <a href="../nav.xhtml#toc">${tr("six chapitres de l’enquête", "six chapters of the book")}</a>.</p></section>`);
  const routes = new Map(chapters.map((a) => [a.route, `${a.chapter}#article-${a.number}`]));
  const nav = [{ title: `${tr('Introduction : ', 'Introduction: ')}${book.introductionTitle}`, href: 'text/ch001.xhtml' }];
  let count = 0;
  for (const chapter of chapters) {
    const source = readFileSync(join(ROOT, isEn ? 'src/content/posts-en' : 'src/content/posts', `${chapter.slug}.md`), 'utf8');
    const { frontmatter: meta } = parseFrontmatter(source);
    if (!meta.title || !meta.description || meta.draft) throw new Error(`Incomplete article: ${chapter.slug}`);
    const html = await renderSlowdownArticle(source, chapter);
    const extracted = extractInfographics(html, chapter.number, count, media);
    count = extracted.next;
    const reading = prepareReadingHtml(extracted.html, routes, chapter.number);
    reading.html += `<nav aria-label="${tr('Autres chapitres', 'Other chapters')}"><h2>${tr('Poursuivre la lecture', 'Continue reading')}</h2><ol>${chapters.filter(c => c.number !== chapter.number).map(c => `<li><a href="${c.chapter}#article-${c.number}">${c.number}. ${xml(c.title)}</a></li>`).join('')}</ol></nav>`;
    copyFileSync(join(ROOT, 'public', chapter.image), join(media, `chapter-${chapter.number}.jpg`));
    const date = new Intl.DateTimeFormat(book.locale, { dateStyle: 'long', timeZone: 'Europe/Paris' }).format(new Date(meta.pubDate));
    writeChapter(chapter.chapter, chapter.title, `<section id="article-${chapter.number}"><p class="chapter-kicker">${tr("Chapitre", "Chapter")} ${chapter.number}</p><h1>${xml(chapter.title)}</h1><p class="chapter-dek">${xml(meta.description)}</p><p class="chapter-meta">${xml(date)} · <a href="${SITE}${chapter.route}">${tr("Version en ligne", "Online article")}</a></p><figure class="chapter-art"><img src="../media/chapter-${chapter.number}.jpg" alt="${xml(chapter.imageAlt)}" /><figcaption>${tr("Illustration conceptuelle. Les relations étudiées sont décrites et sourcées dans le chapitre.", "Conceptual illustration. The relationships examined are described and sourced in the chapter.")}</figcaption></figure>${reading.html}</section>`);
    nav.push({ title: `${chapter.number}. ${chapter.title}`, href: `text/${chapter.chapter}`, children: reading.headings.map((h) => ({ title: h.title, href: `text/${chapter.chapter}#${h.id}` })) });
  }
  if (count !== book.figureCount) throw new Error('Slowdown figure count drift');
  writeChapter('ch008.xhtml', book.conclusionTitle, `<section id="conclusion" epub:type="conclusion"><p class="chapter-kicker">Conclusion</p><h1>${xml(book.conclusionTitle)}</h1>${paragraphs(book.conclusion)}<p>${tr("Les mécanismes contractuels et leurs sources sont détaillés au", "Contractual mechanisms and their sources are detailed in")} <a href="ch007.xhtml#article-6">${tr("chapitre six", "chapter six")}</a>.</p></section>`);
  nav.push({ title: `${tr('Conclusion : ', 'Conclusion: ')}${book.conclusionTitle}`, href: 'text/ch008.xhtml' });
  writeChapter('ch009.xhtml', tr('À propos de cette édition', 'About this edition'), `<section id="edition"><h1>${tr("À propos de cette édition", "About this edition")}</h1><p>${tr("Cette édition du 27 septembre 2026 réunit les six volets de l’enquête sur le ralentissement de l’IA publiés le même jour, leurs quatorze infographies, une introduction et une conclusion originales. Les références, dates, attributions et exemples explicitement fictifs restent attachés aux textes. L’annonce d’un prochain article à la fin du sixième volet est retirée pour cette édition en six chapitres.", "This English edition, dated 27 September 2026, brings together the six investigations into an AI slowdown published that day, their fourteen diagrams, an introduction and a conclusion. References, dates, attributions and explicitly hypothetical examples remain attached to the text. The announcement of a forthcoming article at the end of part six is omitted from this six-chapter edition.")}</p><p>${tr("Le texte se redistribue selon l’écran. Le sommaire, les renvois de sources et les liens entre les six chapitres fonctionnent hors ligne. Les documents externes et le glossaire en ligne nécessitent une connexion. L’agrandissement des images dépend de la liseuse.", "The text reflows to fit the screen. The contents, source references and links between the six chapters work offline. External documents and the online glossary require an internet connection. Image enlargement depends on the reading app.")}</p><p>${tr("La couverture, le panorama et les six illustrations de chapitre ont été créés avec une assistance d’intelligence artificielle. Ces compositions conceptuelles accompagnent la lecture ; elles ne représentent aucun équipement réel ni une relation contractuelle précise.", "The cover, panorama and six chapter illustrations were created with AI assistance. They are conceptual compositions, without representing actual equipment or a particular contractual relationship.")}</p><p>${tr("Aucun script, police distante ou outil de suivi n’est embarqué.", "No scripts, remote fonts or tracking tools are embedded.")}</p><h2>${tr("Articles d’origine", "Original articles")}</h2><ol>${chapters.map((a) => `<li><a href="${SITE}${a.route}">${xml(a.title)}</a></li>`).join('')}</ol><p><a href="${SITE}${book.path}">${tr("Page de l’édition et mises à jour", "Edition page and updates")}</a></p><p><a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a> · l0g</p></section>`);
  nav.push({ title: tr('À propos de cette édition', 'About this edition'), href: 'text/ch009.xhtml' });
  const navList = (items) => `<ol>${items.map((e) => `<li><a href="${e.href}">${xml(e.title)}</a>${e.children ? navList(e.children) : ''}</li>`).join('')}</ol>`;
  saveXml(join(epubDir, 'nav.xhtml'), xhtmlDocument(book, { title: tr('Sommaire', 'Contents'), bodyType: 'frontmatter', body: `<nav epub:type="toc" id="toc"><h1>${tr("Sommaire", "Contents")}</h1>${navList(nav)}</nav>` }).replace('../styles/stylesheet1.css', 'styles/stylesheet1.css'));
  let order = 0;
  const ncx = (items) => items.map((e) => { const n = ++order; return `<navPoint id="nav-${n}" playOrder="${n}"><navLabel><text>${xml(e.title)}</text></navLabel><content src="${e.href}"/>${e.children ? ncx(e.children) : ''}</navPoint>`; }).join('');
  saveXml(join(epubDir, 'toc.ncx'), `<?xml version="1.0" encoding="UTF-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="${book.lang}"><head><meta name="dtb:uid" content="${book.id}"/><meta name="dtb:depth" content="2"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>${xml(book.title)}</text></docTitle><navMap>${ncx(nav)}</navMap></ncx>`);
  const sections = Array.from({ length: 9 }, (_, i) => `ch${String(i + 1).padStart(3, '0')}`);
  saveXml(join(epubDir, 'content.opf'), `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="${book.lang}" prefix="schema: http://schema.org/">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${book.id}</dc:identifier><dc:title>${xml(book.title)}</dc:title><dc:language>${book.lang}</dc:language><dc:creator>l0g</dc:creator><dc:publisher>l0g.fr</dc:publisher><dc:date>${book.date}</dc:date><dc:description>${xml(book.description)}</dc:description><dc:source>${SITE}${book.path}</dc:source><dc:rights>Creative Commons Attribution 4.0 International</dc:rights><meta property="dcterms:modified">${book.modified}</meta><meta name="cover" content="cover-image"/><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityHazard">none</meta><meta property="schema:accessibilitySummary">${tr("Texte redistribuable, navigation structurée, sources cliquables et descriptions alternatives des quatorze infographies. Agrandissement selon la liseuse.", "Reflowable text, structured navigation, linked sources and alternative descriptions for all fourteen diagrams. Image enlargement depends on the reading app.")}</meta></metadata>
<manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="css" href="styles/stylesheet1.css" media-type="text/css"/><item id="cover-image" href="media/cover.jpg" media-type="image/jpeg" properties="cover-image"/><item id="panorama" href="media/panorama.jpg" media-type="image/jpeg"/><item id="cover" href="text/cover.xhtml" media-type="application/xhtml+xml"/><item id="title" href="text/title_page.xhtml" media-type="application/xhtml+xml"/>${sections.map((id) => `<item id="${id}" href="text/${id}.xhtml" media-type="application/xhtml+xml"/>`).join('')}${chapters.map((c) => `<item id="art-${c.number}" href="media/chapter-${c.number}.jpg" media-type="image/jpeg"/>`).join('')}${Array.from({ length: count }, (_, i) => `<item id="fig-${i}" href="media/file${i}.svg" media-type="image/svg+xml"/>`).join('')}</manifest>
<spine toc="ncx"><itemref idref="cover"/><itemref idref="title"/><itemref idref="nav"/>${sections.map((id) => `<itemref idref="${id}"/>`).join('')}</spine></package>`);
  for (const [index, name] of [[8, tr('attente', 'waiting')], [12, tr('garantie', 'guarantee')]]) copyFileSync(join(media, `file${index}.svg`), join(ROOT, 'public/publications', `${book.directory}-${tr('apercu', 'preview')}-${name}.svg`));
  console.log(`${book.title}: six complete analyses, introduction, conclusion, ${count} figures and eight illustrations.`);
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  for (const lang of ['fr', 'en']) await generateSlowdownEpub(lang);
}
