import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { fromHtml } from 'hast-util-from-html';
import { XMLValidator } from 'fast-xml-parser';
import sharp from 'sharp';
import { commerceTracesBook as book, commerceTracesChapters as chapters } from '../src/config/commerce-traces-publication.mjs';
import { assertPassiveTree, prepareReadingHtml } from './generate-scpi-epub.mjs';
import { renderOilMarkdown, standaloneSvg } from './generate-oil-epub.mjs';
import { escapeXml as xml, extractInfographics, xhtmlDocument } from './generate-e-invoicing-epub-lib.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const TEMPLATE = join(ROOT, 'src/epub/l-argent-d-epstein');
const SITE = 'https://l0g.fr';
const paragraphs = (items) => items.map((p) => `<p>${xml(p)}</p>`).join('\n');

export function inspectFigure(figure) {
  const tree = fromHtml(figure, { fragment: true });
  assertPassiveTree(tree);
  const allowed = new Set(['svg', 'title', 'desc', 'rect', 'text', 'line', 'polyline', 'path', 'circle', 'g', 'tspan']);
  function visit(node, inSvg = false) {
    const inside = inSvg || node.tagName === 'svg';
    if (inside && node.type === 'element') {
      if (!allowed.has(node.tagName)) throw new Error(`Unsupported figure element: ${node.tagName}`);
      for (const [key, value] of Object.entries(node.properties ?? {})) {
        if (['href', 'xLinkHref', 'src'].includes(key) || /url\s*\(/iu.test(String(value))) throw new Error('Figure resource is forbidden');
      }
    }
    node.children?.forEach((child) => visit(child, inside));
  }
  visit(tree);
  const svgs = [...figure.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)];
  if (svgs.length !== 1 || XMLValidator.validate(svgs[0][0]) !== true) throw new Error('Invalid EPUB figure');
  return figure.replace(svgs[0][0], standaloneSvg(svgs[0][0]));
}

// Only the six explicitly configured, static component bodies are included.
// Never evaluate MDX/JavaScript or resolve an import supplied by the article.
export async function renderCommerceArticle(source, chapter, componentSource) {
  if (!chapters.includes(chapter)) throw new Error('Unconfigured commerce chapter');
  const expectedImport = `import ${chapter.component} from "../../components/${chapter.component}.astro";`;
  const imports = source.match(/^import[^\n]+/gmu) ?? [];
  if (imports.length !== 1 || imports[0] !== expectedImport) throw new Error('Unexpected article import');
  let markdown = source.replace(/^---\n[\s\S]*?\n---\n/u, '').replace(expectedImport, '');
  // The website's download invitation is redundant inside the downloaded book.
  markdown = markdown.replace(/<p class="edition-link">[\s\S]*?<\/p>/gu, '');
  const figures = new Map();
  const pattern = /\{lang === ["']fr["'] && figure === ([123]) && \(\s*(<figure\b[\s\S]*?<\/figure>)\s*\)\}/gu;
  for (const match of componentSource.matchAll(pattern)) {
    if (figures.has(match[1])) throw new Error('Duplicate component figure');
    figures.set(match[1], inspectFigure(match[2]));
  }
  if (figures.size !== 3) throw new Error('Expected three static French figures');
  const replacements = [];
  const componentPattern = new RegExp(`<${chapter.component} lang="fr" figure=\\{([123])\\} \\/>`, 'gu');
  markdown = markdown.replace(componentPattern, (_, number) => {
    replacements.push(number);
    return `<div data-commerce-figure="${number}"></div>`;
  });
  if (replacements.join(',') !== '1,2,3' || /<Commerce|^import\s/gmu.test(markdown)) throw new Error('Unexpected MDX figure contract');
  let html = await renderOilMarkdown(markdown);
  assertPassiveTree(fromHtml(html, { fragment: true }));
  for (const [number, figure] of figures) {
    const token = `<div data-commerce-figure="${number}"></div>`;
    if (!html.includes(token)) throw new Error('Lost figure placeholder');
    html = html.replace(token, figure);
  }
  return html;
}

export async function generateCommerceTracesEpub() {
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
  const master = join(ROOT, 'src/epub-assets/le-commerce-de-nos-traces-cover.png');
  const cover = await sharp(master).resize(1024, 1638, { fit: 'contain', background: '#0b0d10' }).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
  writeFileSync(join(media, 'cover.jpg'), cover);
  writeFileSync(join(ROOT, 'public', book.cover), cover);
  for (const width of [320, 640, 960]) await sharp(cover).resize({ width }).webp({ quality: 84 }).toFile(join(ROOT, 'public', book.cover.replace('.jpg', `-${width}.webp`)));
  await sharp(cover).resize(1200, 630, { fit: 'contain', background: '#0b0d10' }).jpeg({ quality: 86, mozjpeg: true }).toFile(join(ROOT, 'public', book.social));
  const panorama = await sharp(join(ROOT, 'src/epub-assets/le-commerce-de-nos-traces-panorama.png')).resize(1600, 800, { fit: 'cover' }).jpeg({ quality: 86, mozjpeg: true }).toBuffer();
  writeFileSync(join(ROOT, 'public', book.panorama), panorama);
  writeFileSync(join(media, 'panorama.jpg'), panorama);
  for (const width of [640, 960, 1600]) await sharp(panorama).resize({ width }).webp({ quality: 82 }).toFile(join(ROOT, 'public', book.panorama.replace('.jpg', `-${width}.webp`)));
  writeChapter('cover.xhtml', 'Couverture', `<img src="../media/cover.jpg" alt="${xml(book.title)}" style="max-height:95vh" />`, 'frontmatter cover');
  writeChapter('title_page.xhtml', book.title, `<section class="titlepage"><h1>${xml(book.title)}</h1><p class="subtitle">${xml(book.subtitle)}</p><p class="author">l0g</p><p>19 septembre 2026 · Édition française</p><p>Six analyses, dix-huit infographies, une introduction et une conclusion originales.</p><p>Creative Commons Attribution 4.0 International</p></section>`, 'frontmatter');
  writeChapter('ch001.xhtml', book.introductionTitle, `<section id="introduction" epub:type="introduction"><p class="chapter-kicker">Introduction</p><h1>${xml(book.introductionTitle)}</h1><figure class="chapter-art"><img src="../media/panorama.jpg" alt="Des plaques de verre traversent six stations, de leur collecte à leur retrait." /><figcaption>Illustration conceptuelle du parcours de lecture, créée avec une assistance d’intelligence artificielle.</figcaption></figure>${paragraphs(book.introduction)}<p>Les dossiers et leurs références figurent dans les <a href="../nav.xhtml#toc">six chapitres de l’enquête</a>.</p></section>`);
  const routes = new Map(chapters.map((a) => [a.route, `${a.chapter}#article-${a.number}`]));
  const nav = [{ title: `Introduction : ${book.introductionTitle}`, href: 'text/ch001.xhtml' }];
  let count = 0;
  for (const chapter of chapters) {
    const source = readFileSync(join(ROOT, 'src/content/posts', `${chapter.slug}.mdx`), 'utf8');
    const { frontmatter: meta } = parseFrontmatter(source);
    if (!meta.title || !meta.description || meta.draft) throw new Error(`Incomplete article: ${chapter.slug}`);
    const component = readFileSync(join(ROOT, 'src/components', `${chapter.component}.astro`), 'utf8');
    const html = await renderCommerceArticle(source, chapter, component);
    const extracted = extractInfographics(html, chapter.number, count, media);
    count = extracted.next;
    const reading = prepareReadingHtml(extracted.html, routes, chapter.number);
    copyFileSync(join(ROOT, 'public', chapter.image), join(media, `chapter-${chapter.number}.jpg`));
    const date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'Europe/Paris' }).format(new Date(meta.pubDate));
    writeChapter(chapter.chapter, chapter.title, `<section id="article-${chapter.number}"><p class="chapter-kicker">Chapitre ${chapter.number}</p><h1>${xml(chapter.title)}</h1><p class="chapter-dek">${xml(meta.description)}</p><p class="chapter-meta">${xml(date)} · <a href="${SITE}${chapter.route}">Version en ligne</a></p><figure class="chapter-art"><img src="../media/chapter-${chapter.number}.jpg" alt="${xml(chapter.imageAlt)}" /><figcaption>Illustration conceptuelle. Les relations étudiées sont décrites et sourcées dans le chapitre.</figcaption></figure>${reading.html}</section>`);
    nav.push({ title: `${chapter.number}. ${chapter.title}`, href: `text/${chapter.chapter}`, children: reading.headings.map((h) => ({ title: h.title, href: `text/${chapter.chapter}#${h.id}` })) });
  }
  if (count !== book.figureCount) throw new Error('Commerce figure count drift');
  writeChapter('ch008.xhtml', book.conclusionTitle, `<section id="conclusion" epub:type="conclusion"><p class="chapter-kicker">Conclusion</p><h1>${xml(book.conclusionTitle)}</h1>${paragraphs(book.conclusion)}<p>Les règles et le bilan DROP sont détaillés et sourcés au <a href="ch007.xhtml#article-6">chapitre six</a>.</p></section>`);
  nav.push({ title: `Conclusion : ${book.conclusionTitle}`, href: 'text/ch008.xhtml' });
  writeChapter('ch009.xhtml', 'À propos de cette édition', `<section id="edition"><h1>À propos de cette édition</h1><p>Cette édition du 19 septembre 2026 réunit les six analyses du Commerce de nos traces publiées du 17 au 19 septembre 2026, leurs dix-huit infographies, une introduction et une conclusion originales. Les références, dates, attributions et exemples explicitement fictifs restent attachés aux textes. La relecture éditoriale a simplifié certaines formulations.</p><p>Le texte se redistribue selon l’écran. Le sommaire, les renvois de sources et les liens entre les six chapitres fonctionnent hors ligne. Les documents externes et le glossaire en ligne nécessitent une connexion. L’agrandissement des images dépend de la liseuse.</p><p>La couverture, le panorama et les six illustrations de chapitre ont été créés avec une assistance d’intelligence artificielle. Ces compositions conceptuelles accompagnent la lecture ; elles ne représentent aucun fichier réel ni une chaîne commerciale entre toutes les entreprises citées.</p><p>Aucun script, police distante ou outil de suivi n’est embarqué.</p><h2>Articles d’origine</h2><ol>${chapters.map((a) => `<li><a href="${SITE}${a.route}">${xml(a.title)}</a></li>`).join('')}</ol><p><a href="${SITE}${book.path}">Page de l’édition et mises à jour</a></p><p><a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a> · l0g</p></section>`);
  nav.push({ title: 'À propos de cette édition', href: 'text/ch009.xhtml' });
  const navList = (items) => `<ol>${items.map((e) => `<li><a href="${e.href}">${xml(e.title)}</a>${e.children ? navList(e.children) : ''}</li>`).join('')}</ol>`;
  saveXml(join(epubDir, 'nav.xhtml'), xhtmlDocument(book, { title: 'Sommaire', bodyType: 'frontmatter', body: `<nav epub:type="toc" id="toc"><h1>Sommaire</h1>${navList(nav)}</nav>` }).replace('../styles/stylesheet1.css', 'styles/stylesheet1.css'));
  let order = 0;
  const ncx = (items) => items.map((e) => { const n = ++order; return `<navPoint id="nav-${n}" playOrder="${n}"><navLabel><text>${xml(e.title)}</text></navLabel><content src="${e.href}"/>${e.children ? ncx(e.children) : ''}</navPoint>`; }).join('');
  saveXml(join(epubDir, 'toc.ncx'), `<?xml version="1.0" encoding="UTF-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="fr"><head><meta name="dtb:uid" content="${book.id}"/><meta name="dtb:depth" content="2"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>${xml(book.title)}</text></docTitle><navMap>${ncx(nav)}</navMap></ncx>`);
  const sections = Array.from({ length: 9 }, (_, i) => `ch${String(i + 1).padStart(3, '0')}`);
  saveXml(join(epubDir, 'content.opf'), `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="fr" prefix="schema: http://schema.org/">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${book.id}</dc:identifier><dc:title>${xml(book.title)}</dc:title><dc:language>fr</dc:language><dc:creator>l0g</dc:creator><dc:publisher>l0g.fr</dc:publisher><dc:date>${book.date}</dc:date><dc:description>${xml(book.description)}</dc:description><dc:source>${SITE}${book.path}</dc:source><dc:rights>Creative Commons Attribution 4.0 International</dc:rights><meta property="dcterms:modified">${book.modified}</meta><meta name="cover" content="cover-image"/><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityHazard">none</meta><meta property="schema:accessibilitySummary">Texte redistribuable, navigation structurée, sources cliquables et descriptions alternatives des dix-huit infographies. Agrandissement selon la liseuse.</meta></metadata>
<manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="css" href="styles/stylesheet1.css" media-type="text/css"/><item id="cover-image" href="media/cover.jpg" media-type="image/jpeg" properties="cover-image"/><item id="panorama" href="media/panorama.jpg" media-type="image/jpeg"/><item id="cover" href="text/cover.xhtml" media-type="application/xhtml+xml"/><item id="title" href="text/title_page.xhtml" media-type="application/xhtml+xml"/>${sections.map((id) => `<item id="${id}" href="text/${id}.xhtml" media-type="application/xhtml+xml"/>`).join('')}${chapters.map((c) => `<item id="art-${c.number}" href="media/chapter-${c.number}.jpg" media-type="image/jpeg"/>`).join('')}${Array.from({ length: count }, (_, i) => `<item id="fig-${i}" href="media/file${i}.svg" media-type="image/svg+xml"/>`).join('')}</manifest>
<spine toc="ncx"><itemref idref="cover"/><itemref idref="title"/><itemref idref="nav"/>${sections.map((id) => `<itemref idref="${id}"/>`).join('')}</spine></package>`);
  for (const [index, name] of [[8, 'profils'], [13, 'copies']]) copyFileSync(join(media, `file${index}.svg`), join(ROOT, 'public/publications', `commerce-traces-apercu-${name}.svg`));
  console.log(`${book.title}: six complete analyses, introduction, conclusion, ${count} figures and eight illustrations.`);
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) await generateCommerceTracesEpub();
