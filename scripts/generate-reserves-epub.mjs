import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import { unified } from 'unified';
import rehypeStringify from 'rehype-stringify';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import { XMLValidator } from 'fast-xml-parser';
import sharp from 'sharp';
import { reservesEditions } from '../src/config/reserves-publication.mjs';
import { assertPassiveTree, prepareReadingHtml } from './generate-scpi-epub.mjs';
import { escapeXml as xml, normalizeVoidElements, xhtmlDocument } from './generate-e-invoicing-epub-lib.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const TEMPLATE = join(ROOT, 'src/epub/l-argent-d-epstein');
const SITE = 'https://l0g.fr';
const paragraphs = items => items.map(p => `<p>${xml(p)}</p>`).join('\n');
const elements = node => [node, ...(node.children ?? []).flatMap(elements)];
const serialize = node => unified().use(rehypeStringify).stringify(node);
const element = (tagName, properties, children = []) => ({ type: 'element', tagName, properties, children });
const text = value => ({ type: 'text', value });
const palette = {
  ink: '#0c0d10', surface: '#121419', 'surface-2': '#171a20', paper: '#e7e9ee',
  muted: '#8b909b', signal: '#5eead4', accent: '#ff4d87', amber: '#f5b13d',
  'topic-blue': '#7aa2f7', 'line-strong': 'rgba(255, 255, 255, 0.20)',
};
const svgTags = new Set(['svg', 'title', 'desc', 'metadata', 'defs', 'marker', 'clipPath', 'path', 'rect', 'text', 'g', 'ellipse', 'line', 'circle', 'polyline', 'tspan']);

function resolveColour(value) {
  let resolved = String(value).replace(/var\(--color-([\w-]+)\)/gu, (_, key) => {
    if (!Object.hasOwn(palette, key)) throw new Error(`Unknown reserves colour: ${key}`);
    return palette[key];
  });
  const tint = resolved.match(/^color-mix\(in srgb, (#[a-f\d]{6}) 10%, (#[a-f\d]{6})\)$/iu);
  if (tint) {
    const mix = [0, 2, 4].map(i => Math.round(parseInt(tint[1].slice(i + 1, i + 3), 16) * .1 + parseInt(tint[2].slice(i + 1, i + 3), 16) * .9));
    resolved = `#${mix.map(v => v.toString(16).padStart(2, '0')).join('')}`;
  }
  if (resolved.includes('var(') || resolved.includes('color-mix(')) throw new Error('Unresolved EPUB colour');
  return resolved;
}

// Baking the existing charter colours leaves geometry, text and typography intact.
// A fixed dark canvas also works in reading engines without CSS custom properties.
export function bakeReservesSvg(original) {
  const tree = typeof original === 'string' ? fromHtml(original, { fragment: true }) : structuredClone(original);
  if (typeof original === 'string' && (/<!DOCTYPE|<!ENTITY/iu.test(original) || XMLValidator.validate(original) !== true)) throw new Error('Invalid reserves SVG XML');
  const nodes = elements(tree), svg = nodes.find(n => n.tagName === 'svg');
  if (!svg || nodes.filter(n => n.tagName === 'svg').length !== 1) throw new Error('Expected one reserves SVG');
  const ids = new Set(nodes.map(n => n.properties?.id).filter(Boolean));
  if (ids.size !== nodes.filter(n => n.properties?.id).length) throw new Error('Duplicate SVG ID');
  for (const node of nodes.filter(n => n.type === 'element')) {
    if (!svgTags.has(node.tagName)) throw new Error(`Forbidden reserves SVG element: ${node.tagName}`);
    for (const [key, raw] of Object.entries(node.properties ?? {})) {
      const value = String(raw);
      if (/^on/iu.test(key) || ['href', 'xLinkHref', 'src', 'srcSet', 'srcDoc'].includes(key)) throw new Error('Forbidden reserves SVG attribute');
      if (key === 'style') {
        if (node !== svg || value !== 'width:100%;height:auto') throw new Error('Unexpected reserves SVG style');
        delete node.properties.style;
      } else if (value.includes('url(')) {
        const ref = value.match(/^url\(#([\w-]+)\)$/u);
        if (!ref || !ids.has(ref[1])) throw new Error('External or missing SVG resource');
      } else if (value.includes('var(') || value.includes('color-mix(')) node.properties[key] = resolveColour(value);
      else if (/@import|javascript:/iu.test(value)) throw new Error('Active SVG value');
    }
  }
  delete svg.properties.className;
  svg.properties.xmlns = 'http://www.w3.org/2000/svg';
  const box = String(svg.properties.viewBox).split(' ').map(Number);
  if (box.length !== 4 || box.some(v => !Number.isFinite(v)) || box[2] <= 0 || box[3] <= 0) throw new Error('Invalid reserves SVG viewBox');
  // The existing first rectangle already paints all originals; no layout alteration.
  const result = serialize(svg);
  if (XMLValidator.validate(result) !== true) throw new Error('Invalid baked reserves SVG');
  return result;
}

function inspectWebFigure(figure, chapter) {
  for (const node of elements(figure).filter(n => n.type === 'element')) {
    if (['script', 'iframe', 'object', 'embed', 'foreignObject', 'form', 'input', 'template', 'base', 'audio', 'video', 'animate', 'set', 'style'].includes(node.tagName)) throw new Error('Active EPUB figure');
    for (const [key, value] of Object.entries(node.properties ?? {})) {
      if (/^on/iu.test(key) || ['srcDoc', 'srcSet'].includes(key)) throw new Error('Active EPUB figure attribute');
      if (key === 'href' && !String(value).startsWith('#')) {
        const target = String(value);
        if (/[\\\u0000-\u0020\u007f]/u.test(target) || target.startsWith('//')) throw new Error('Unsafe figure link');
        if (/^[a-z][a-z\d+.-]*:/iu.test(target) && !['https:', 'http:', 'mailto:'].includes(new URL(target).protocol)) throw new Error('Unsafe figure link');
      }
    }
    if (node.tagName === 'img') {
      const src = String(node.properties.src);
      const prefix = `/infographies/${chapter.infographicDirectory}/panels/`;
      if (!src.startsWith(prefix) || /[\\\u0000-\u0020\u007f]/u.test(src) || src.includes('..') || !/\.(?:dark|light)\.svg$/u.test(src)) throw new Error('External EPUB figure resource');
      if (!(node.properties.className ?? []).some(name => /^rsv0[3-6]-panel-(?:dark|light)$/u.test(name))) throw new Error('Unexpected panel image');
    }
  }
}

export async function renderReservesArticle(source, chapter, offset = 0) {
  const book = Object.values(reservesEditions).find(b => b.chapters.includes(chapter));
  if (!book) throw new Error('Unconfigured reserves chapter');
  const { frontmatter: meta, content } = parseFrontmatter(source);
  if (!meta.title || !meta.description || meta.draft || (book.lang === 'en' && meta.sourceArticle !== chapter.sourceSlug)) throw new Error('Incomplete reserves article');
  if (/^(?:import|export)\s/gmu.test(content) || /<!DOCTYPE|<!ENTITY/iu.test(content)) throw new Error('Unexpected article declaration');
  const processor = unified().use(remarkParse).use(remarkGfm).use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw);
  const tree = await processor.run(processor.parse(content));
  for (const node of elements(tree).filter(n => n.type === 'element')) {
    const style = node.properties?.style;
    if (node.tagName === 'style' || /@import|url\s*\(/iu.test(String(style ?? ''))) throw new Error('Active EPUB style');
    if (style && !(node.tagName === 'svg' && style === 'width:100%;height:auto')) throw new Error('Unexpected EPUB style');
  }
  const figures = elements(tree).filter(n => n.tagName === 'figure');
  if (figures.length !== chapter.figureCount) throw new Error('Unexpected article figures');
  const attachments = [];
  const appendSvg = (node, kind) => {
    const svg = bakeReservesSvg(node), parsed = fromHtml(svg, { fragment: true });
    const description = elements(parsed).find(n => n.tagName === 'desc');
    const title = elements(parsed).find(n => n.tagName === 'title');
    const name = `file${offset + attachments.length}.svg`;
    attachments.push({ name, svg, kind, chapter: chapter.number });
    return { name, image: element('img', { src: `../media/${name}`, className: ['infographic-image'], alt: toText(description ?? title).trim() }) };
  };
  for (const [index, figure] of figures.entries()) {
    if (!(figure.properties.className ?? []).includes(`l0g-reserves0${chapter.number}-figure`)) throw new Error('Unexpected reserves figure class');
    inspectWebFigure(figure, chapter);
    const nodes = elements(figure), caption = figure.children.filter(n => n.tagName === 'figcaption');
    if (caption.length !== 1) throw new Error('Missing original figure caption');
    const svgs = nodes.filter(n => n.tagName === 'svg');
    if (svgs.length !== (chapter.number <= 2 ? 2 : 1)) throw new Error('Unexpected reserves SVG count');
    const full = appendSvg(svgs[0], 'complete');
    let mobile;
    if (chapter.number <= 2) mobile = [appendSvg(svgs[1], 'reading').image];
    else {
      const panelNodes = nodes.filter(n => n.tagName === 'img' && n.properties.className?.some(name => /^rsv0[3-6]-panel-dark$/u.test(name)));
      if (panelNodes.length < 2 || panelNodes.length > 4) throw new Error('Missing reading panels');
      mobile = panelNodes.map(node => {
        const path = resolve(ROOT, 'public', String(node.properties.src).slice(1));
        if (!path.startsWith(`${join(ROOT, 'public/infographies', chapter.infographicDirectory)}/panels/`)) throw new Error('Panel path outside configured directory');
        const image = appendSvg(readFileSync(path, 'utf8'), 'reading').image;
        image.properties.alt = node.properties.alt;
        return image;
      });
    }
    figure.properties = { id: figure.properties.id ?? `c${chapter.number}-infographic-${index + 1}`, className: ['infographic'] };
    figure.children = [
      element('div', { className: ['infographic-wide'] }, [full.image]),
      element('div', { className: ['infographic-reading'] }, mobile),
      element('p', { className: ['figure-enlarge'] }, [element('a', { href: `../media/${full.name}` }, [text(book.lang === 'fr' ? 'Ouvrir la composition complète' : 'Open the complete composition')])]),
      ...caption,
    ];
  }
  // The download invitation is website navigation, redundant inside the book.
  function clean(node) {
    if (node.properties) {
      if (['th', 'td'].includes(node.tagName) && node.properties.align) {
        const alignment = node.properties.align;
        if (!['left', 'right', 'center'].includes(alignment)) throw new Error('Invalid table alignment');
        node.properties.style = `text-align:${alignment}`;
        delete node.properties.align;
      }
      delete node.properties.tabIndex;
      if (!['th', 'td'].includes(node.tagName)) delete node.properties.style;
    }
    if (node.children) {
      node.children = node.children.filter(n => !n.properties?.className?.includes('edition-link'));
      node.children.forEach(clean);
    }
  }
  clean(tree);
  assertPassiveTree(tree);
  if (elements(tree).some(n => n.tagName === 'svg')) throw new Error('Unpackaged article SVG');
  return { html: normalizeVoidElements(serialize(tree)), attachments, next: offset + attachments.length };
}

export async function generateReservesEpub(lang = 'fr') {
  if (!['fr', 'en'].includes(lang)) throw new Error('Unsupported reserves edition language');
  const book = reservesEditions[lang], isEn = lang === 'en', chapters = book.chapters;
  const tr = (fr, en) => isEn ? en : fr;
  const sourceDir = join(ROOT, 'src/epub', book.directory), epubDir = join(sourceDir, 'EPUB');
  const media = join(epubDir, 'media'), textDir = join(epubDir, 'text');
  for (const dir of [media, textDir, join(epubDir, 'styles'), join(sourceDir, 'META-INF'), join(ROOT, 'public/publications')]) mkdirSync(dir, { recursive: true });
  for (const file of ['mimetype', 'META-INF/container.xml', 'META-INF/com.apple.ibooks.display-options.xml']) copyFileSync(join(TEMPLATE, file), join(sourceDir, file));
  const saveXml = (path, content) => {
    const valid = XMLValidator.validate(content);
    if (valid !== true) throw new Error(`${relative(ROOT, path)}: invalid EPUB XML: ${JSON.stringify(valid)}`);
    writeFileSync(path, content);
  };
  const writeChapter = (file, title, body, bodyType = 'bodymatter') => {
    const document = xhtmlDocument(book, { title, body, bodyType });
    saveXml(join(textDir, file), bodyType === 'frontmatter cover' ? document.replace('<body ', '<body class="cover-page" ') : document);
  };
  const css = readFileSync(join(TEMPLATE, 'EPUB/styles/stylesheet1.css'), 'utf8');
  writeFileSync(join(epubDir, 'styles/stylesheet1.css'), `${css}\nfigure { margin:1.6em auto 2em; max-width:38em; }\n.infographic-image { width:100%; height:auto; background:#0c0d10; }\n.infographic-reading { display:none; }\n.infographic-reading .infographic-image { margin:0 auto 1em; max-width:28em; page-break-inside:avoid; break-inside:avoid; }\n.figure-enlarge { font-size:.75em; }\n.chapter-art { width:100%; margin:1.5em auto 2em; }\n.chapter-art img { width:100%; }\n.sources li { margin-bottom:1em; }\n.source-meta { display:block; font-size:.85em; color:#555c66; }\n.source-id { font-family:monospace; }\n.reading-box-title { font-weight:bold; }\n.cover-page { max-width:none; margin:0; padding:0; }\n@media(max-width:36em) { .infographic-wide { display:none; } .infographic-reading { display:block; } figure.infographic { page-break-inside:auto; break-inside:auto; } }\n`);
  const cover = await sharp(join(ROOT, `src/epub-assets/${book.directory}-cover.png`)).resize(1024, 1638, { fit:'contain', background:'#0c0d10' }).jpeg({ quality:85, mozjpeg:true }).toBuffer();
  writeFileSync(join(media, 'cover.jpg'), cover);
  writeFileSync(join(ROOT, 'public', book.cover), cover);
  for (const width of [320, 640, 960]) await sharp(cover).resize({ width }).webp({ quality:84 }).toFile(join(ROOT, 'public', book.cover.replace('.jpg', `-${width}.webp`)));
  // Social artwork is deliberately generated separately in the site's OG workflow.
  const panorama = await sharp(join(ROOT, 'src/epub-assets/reserves-publication-panorama.png')).resize(1600, 800, { fit:'cover' }).jpeg({ quality:86, mozjpeg:true }).toBuffer();
  writeFileSync(join(ROOT, 'public', book.panorama), panorama);
  writeFileSync(join(media, 'panorama.jpg'), panorama);
  for (const width of [640, 960, 1600]) await sharp(panorama).resize({ width }).webp({ quality:82 }).toFile(join(ROOT, 'public', book.panorama.replace('.jpg', `-${width}.webp`)));
  writeChapter('cover.xhtml', tr('Couverture', 'Cover'), `<img src="../media/cover.jpg" alt="${xml(book.title)}" />`, 'frontmatter cover');
  writeChapter('title_page.xhtml', book.title, `<section class="titlepage" epub:type="titlepage"><h1>${xml(book.title)}</h1><p class="subtitle">${xml(book.subtitle)}</p><p class="author">l0g</p><p>${tr('4 octobre 2026 · Édition française', '4 October 2026 · English edition')}</p><p>${tr('Six articles, vingt-quatre infographies, une introduction et une conclusion originales.', 'Six complete articles, twenty-four infographics, an original introduction and conclusion.')}</p><p>${tr('Documentation arrêtée au 3 octobre 2026. Les six premiers volets d’une série annoncée en sept parties.', 'Documentary cut-off: 3 October 2026. The first six instalments of a series announced as seven parts.')}</p><p>Creative Commons Attribution 4.0 International</p></section>`, 'frontmatter');
  writeChapter('ch001.xhtml', book.introductionTitle, `<section id="introduction" epub:type="introduction"><p class="chapter-kicker">Introduction</p><h1>${xml(book.introductionTitle)}</h1><figure class="chapter-art"><img src="../media/panorama.jpg" alt="${tr('Parcours conceptuel du carburant : cuves, contrats, transport, raffinerie et pompe.', 'Conceptual fuel journey through tanks, contracts, transport, a refinery and a pump.')}" /><figcaption>${tr('Illustration conceptuelle créée avec une assistance d’intelligence artificielle. Aucun site, réseau ou flux mesuré représenté.', 'Conceptual illustration created with AI assistance. It depicts no actual facility, network or measured flow.')}</figcaption></figure>${paragraphs(book.introduction)}<p>${tr('Les mécanismes et les références de cette synthèse sont développés dans les', 'The mechanisms and references behind this overview are developed in the')} <a href="../nav.xhtml#toc">${tr('six chapitres', 'six chapters')}</a>.</p></section>`);
  const routes = new Map(chapters.map(c => [c.route, `${c.chapter}#article-${c.number}`]));
  const nav = [{ title:`Introduction${tr(' : ', ': ')}${book.introductionTitle}`, href:'text/ch001.xhtml' }];
  const attachments = [];
  for (const chapter of chapters) {
    const source = readFileSync(join(ROOT, isEn ? 'src/content/posts-en' : 'src/content/posts', `${chapter.slug}.md`), 'utf8');
    const meta = parseFrontmatter(source).frontmatter;
    const assembled = await renderReservesArticle(source, chapter, attachments.length);
    for (const attachment of assembled.attachments) saveXml(join(media, attachment.name), attachment.svg);
    attachments.push(...assembled.attachments);
    const reading = prepareReadingHtml(assembled.html, routes, chapter.number);
    reading.html += `<nav aria-label="${tr('Autres chapitres', 'Other chapters')}"><h2>${tr('Poursuivre la lecture', 'Continue reading')}</h2><ol>${chapters.filter(c => c.number !== chapter.number).map(c => `<li><a href="${c.chapter}#article-${c.number}">${c.number}. ${xml(c.title)}</a></li>`).join('')}</ol></nav>`;
    copyFileSync(join(ROOT, 'public', chapter.image), join(media, `chapter-${chapter.number}.jpg`));
    const date = new Intl.DateTimeFormat(book.locale, { dateStyle:'long', timeZone:'Europe/Paris' }).format(new Date(meta.pubDate));
    writeChapter(chapter.chapter, meta.title, `<section id="article-${chapter.number}"><p class="chapter-kicker">${tr('Chapitre', 'Chapter')} ${chapter.number}</p><h1>${xml(meta.title)}</h1><p class="chapter-dek">${xml(meta.description)}</p><p class="chapter-meta">${xml(date)} · <a href="${SITE}${chapter.route}">${tr('Version en ligne', 'Online article')}</a></p><figure class="chapter-art"><img src="../media/chapter-${chapter.number}.jpg" alt="${xml(chapter.imageAlt)}" /><figcaption>${tr('Illustration conceptuelle. Les faits et les relations étudiées sont décrits et sourcés dans le chapitre.', 'Conceptual illustration. The facts and relationships examined are described and sourced in the chapter.')}</figcaption></figure>${reading.html}</section>`);
    nav.push({ title:`${chapter.number}. ${chapter.title}`, href:`text/${chapter.chapter}`, children:reading.headings.map(h => ({ title:h.title, href:`text/${chapter.chapter}#${h.id}` })) });
  }
  if (attachments.filter(a => a.kind === 'complete').length !== book.figureCount) throw new Error('Reserves figure count drift');
  writeChapter('ch008.xhtml', book.conclusionTitle, `<section id="conclusion" epub:type="conclusion"><p class="chapter-kicker">Conclusion</p><h1>${xml(book.conclusionTitle)}</h1>${paragraphs(book.conclusion)}<p>${tr('Les sources de cette synthèse restent attachées aux', 'The sources for this synthesis remain attached to the')} <a href="../nav.xhtml#toc">${tr('chapitres correspondants', 'corresponding chapters')}</a>.</p></section>`);
  nav.push({ title:`Conclusion${tr(' : ', ': ')}${book.conclusionTitle}`, href:'text/ch008.xhtml' });
  const aboutTitle = tr('À propos de cette édition', 'About this edition');
  writeChapter('ch009.xhtml', aboutTitle, `<section id="edition"><h1>${aboutTitle}</h1><p>${tr('Cette édition publiée le 4 octobre 2026 rassemble les six premiers articles de l’enquête sur les réserves pétrolières. La documentation est arrêtée au 3 octobre 2026. La série en ligne est annoncée en sept volets ; le présent recueil ne prétend pas la clore. Les textes, tableaux, dates, attributions, limites, sources et vingt-quatre infographies originales sont conservés. L’introduction et la conclusion proposent une synthèse des chapitres, sans donnée nouvelle.', 'Published on 4 October 2026, this edition collects the first six articles of the investigation into emergency oil reserves. Its documentary cut-off is 3 October 2026. The online series is announced as seven parts; this collection does not claim to conclude it. The full texts, tables, dates, attributions, qualifications, sources and twenty-four original infographics are retained. The introduction and conclusion synthesise the chapters without introducing new data.')}</p><p>${tr('Le texte se redistribue selon l’écran. Les compositions intégrales des graphiques et les adaptations de lecture sur petit écran sont embarquées, avec la charte sombre de l0g. Leur géométrie, leurs textes et leur typographie sont conservés. Les panneaux existants se suivent dans l’ordre, sans contrôles de galerie ni script. Le sommaire, les renvois de sources et les liens entre les six chapitres fonctionnent hors ligne. Les sources externes, le glossaire et les téléchargements CSV en ligne nécessitent une connexion. L’ouverture des compositions complètes et leur agrandissement dépendent de la liseuse.', 'Text reflows to fit the screen. Complete chart compositions and their small-screen reading adaptations are embedded using l0g’s dark palette. Geometry, text and typography are retained. Existing panels follow in order, without gallery controls or scripts. Contents, source references and links between the six chapters work offline. External sources, the glossary and online CSV downloads require a connection. Opening or enlarging the complete compositions depends on the reading application.')}</p><p>${tr('La couverture, le panorama et les six illustrations de chapitre sont des compositions conceptuelles créées avec une assistance d’intelligence artificielle. Elles ne représentent aucun site réel, contrat particulier ou flux mesuré.', 'The cover, panorama and six chapter illustrations are conceptual compositions created with AI assistance. They depict no actual facility, specific contract or measured flow.')}</p><p>${tr('Aucun script, police distante ou outil de suivi n’est embarqué.', 'No scripts, remote fonts or tracking tools are embedded.')}</p><h2>${tr('Articles d’origine', 'Original articles')}</h2><ol>${chapters.map(c => `<li><a href="${SITE}${c.route}">${xml(c.title)}</a></li>`).join('')}</ol><p><a href="${SITE}${book.path}">${tr('Page de l’édition et corrections ultérieures', 'Edition page and subsequent corrections')}</a></p><p><a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a> · l0g</p></section>`);
  nav.push({ title:aboutTitle, href:'text/ch009.xhtml' });
  const navList = items => `<ol>${items.map(e => `<li><a href="${e.href}">${xml(e.title)}</a>${e.children ? navList(e.children) : ''}</li>`).join('')}</ol>`;
  saveXml(join(epubDir, 'nav.xhtml'), xhtmlDocument(book, { title:tr('Sommaire', 'Contents'), bodyType:'frontmatter', body:`<nav epub:type="toc" id="toc"><h1>${tr('Sommaire', 'Contents')}</h1>${navList(nav)}</nav>` }).replace('../styles/stylesheet1.css', 'styles/stylesheet1.css'));
  let order = 0;
  const ncx = items => items.map(e => { const n = ++order; return `<navPoint id="nav-${n}" playOrder="${n}"><navLabel><text>${xml(e.title)}</text></navLabel><content src="${e.href}"/>${e.children ? ncx(e.children) : ''}</navPoint>`; }).join('');
  saveXml(join(epubDir, 'toc.ncx'), `<?xml version="1.0" encoding="UTF-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="${book.lang}"><head><meta name="dtb:uid" content="${book.id}"/><meta name="dtb:depth" content="2"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>${xml(book.title)}</text></docTitle><navMap>${ncx(nav)}</navMap></ncx>`);
  const sections = Array.from({ length:9 }, (_, i) => `ch${String(i + 1).padStart(3, '0')}`);
  saveXml(join(epubDir, 'content.opf'), `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="${book.lang}" prefix="schema: http://schema.org/">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${book.id}</dc:identifier><dc:title>${xml(book.title)}</dc:title><dc:language>${book.lang}</dc:language><dc:creator>l0g</dc:creator><dc:publisher>l0g.fr</dc:publisher><dc:date>${book.date}</dc:date><dc:description>${xml(book.description)}</dc:description><dc:source>${SITE}${book.path}</dc:source><dc:rights>Creative Commons Attribution 4.0 International</dc:rights><meta property="dcterms:modified">${book.modified}</meta><meta name="cover" content="cover-image"/><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityHazard">none</meta><meta property="schema:accessibilitySummary">${tr('Texte redistribuable, navigation structurée, tableaux, sources cliquables et descriptions alternatives. Vingt-quatre infographies avec compositions complètes et adaptations de lecture hors ligne. Agrandissement selon la liseuse.', 'Reflowable text, structured navigation, tables, linked sources and text alternatives. Twenty-four infographics with complete compositions and offline reading adaptations. Enlargement depends on the reading app.')}</meta></metadata>
<manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="css" href="styles/stylesheet1.css" media-type="text/css"/><item id="cover-image" href="media/cover.jpg" media-type="image/jpeg" properties="cover-image"/><item id="panorama" href="media/panorama.jpg" media-type="image/jpeg"/><item id="cover" href="text/cover.xhtml" media-type="application/xhtml+xml"/><item id="title" href="text/title_page.xhtml" media-type="application/xhtml+xml"/>${sections.map(id => `<item id="${id}" href="text/${id}.xhtml" media-type="application/xhtml+xml"/>`).join('')}${chapters.map(c => `<item id="art-${c.number}" href="media/chapter-${c.number}.jpg" media-type="image/jpeg"/>`).join('')}${attachments.map((a, i) => `<item id="fig-${i}" href="media/${a.name}" media-type="image/svg+xml"/>`).join('')}</manifest>
<spine toc="ncx"><itemref idref="cover"/><itemref idref="title"/><itemref idref="nav"/>${sections.map(id => `<itemref idref="${id}"/>`).join('')}</spine></package>`);
  console.log(`${book.title}: six complete articles, introduction, conclusion, 24 original diagrams, ${attachments.length} offline SVG compositions and reading panels.`);
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
  for (const lang of ['fr', 'en']) await generateReservesEpub(lang);
}
