import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import sharp from 'sharp';
import { oilPublication as book, oilChapters as articles } from '../src/config/oil-publication.mjs';
import { escapeXml as xml, extractInfographics, normalizeVoidElements, rewriteLinks, sectionHeadings, xhtmlDocument } from './generate-e-invoicing-epub-lib.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const SOURCE = join(ROOT, 'src/epub/les-banquiers-du-baril');
const EPUB = join(SOURCE, 'EPUB');
const MEDIA = join(EPUB, 'media');
const TEXT = join(EPUB, 'text');
const TEMPLATE = join(ROOT, 'src/epub/l-argent-d-epstein');
const SITE = 'https://l0g.fr';
const ID = 'urn:uuid:2e744d8f-3968-43b8-84ec-c6d8ed931fac';
const config = { lang: 'fr' };
const paragraphs = (items) => items.map((p) => `<p>${xml(p)}</p>`).join('\n');

// Resolve the controlled article palette before packaging standalone images.
// Older reading engines do not implement CSS custom properties consistently.
export function standaloneSvg(svg) {
  if (/@import/iu.test(svg)) throw new Error('Remote SVG styles are forbidden');
  for (const [, target] of svg.matchAll(/url\(([^)]+)\)/giu)) {
    if (!target.trim().replace(/^["']|["']$/gu, '').startsWith('#')) throw new Error('External SVG resources are forbidden');
  }
  // Episode 1 applies its dark palette from article-level CSS. Bake that exact
  // mapping into the three standalone figures instead of depending on the page.
  if (/id="bdb1-fr-/u.test(svg)) {
    const fills = { '#f5f7f3': '#121419', '#e6eee7': '#171a20', '#18352e': '#e7e9ee', '#28634f': '#5eead4', '#475c54': '#8b909b', '#ffffff': '#0c0d10' };
    svg = svg.replace(/<rect\b[^>]*>/gu, (tag) => tag.replace('fill="#18352e"', 'fill="#5eead4"'))
      .replace(/fill="(#[a-f0-9]+)"/gu, (attribute, color) => fills[color] ? `fill="${fills[color]}"` : attribute)
      .replace(/stroke="(?:#d4dfd6|#475c54)"/gu, 'stroke="#47505c"');
  }
  const variables = new Map([...svg.matchAll(/(--[\w-]+)\s*:\s*([^;"}]+)/gu)].map((m) => [m[1], m[2].trim()]));
  let resolved = svg;
  while (resolved.includes('var(')) {
    const start = resolved.indexOf('var(');
    let depth = 1;
    let end = start + 4;
    for (; end < resolved.length && depth > 0; end++) {
      if (resolved[end] === '(') depth++;
      if (resolved[end] === ')') depth--;
    }
    if (depth) throw new Error('Unclosed SVG custom property');
    const expression = resolved.slice(start + 4, end - 1);
    const comma = expression.indexOf(',');
    const key = (comma < 0 ? expression : expression.slice(0, comma)).trim();
    const value = variables.get(key) ?? (comma < 0 ? '' : expression.slice(comma + 1).trim());
    if (!value || value.includes('var(')) throw new Error(`Unsupported SVG property: ${key}`);
    resolved = resolved.slice(0, start) + value + resolved.slice(end);
  }
  resolved = resolved.replace(/--[\w-]+\s*:[^;"}]+;?/gu, '');
  const box = resolved.match(/viewBox="([\d.]+) ([\d.]+) ([\d.]+) ([\d.]+)"/u);
  if (!box) throw new Error('Missing SVG viewBox');
  // A painted canvas survives a white reader background and SVG background-CSS gaps.
  return resolved.replace(/(<svg\b[^>]*>)/u, `$1<rect x="${box[1]}" y="${box[2]}" width="${box[3]}" height="${box[4]}" fill="#0b0d10"/>`);
}

export async function renderOilMarkdown(markdown) {
  // SVGs are already protected by placeholders. Remove website presentation
  // from parsed nodes so deleting source text cannot assemble new HTML tags.
  function removeWebsitePresentation() {
    function clean(node) {
      if (node.properties) {
        delete node.properties.style;
        delete node.properties.tabIndex;
      }
      if (node.children) {
        node.children = node.children.filter((child) => child.type !== 'element' || child.tagName !== 'style');
        node.children.forEach(clean);
      }
      if (node.content) clean(node.content);
    }
    return clean;
  }
  return String(await unified().use(remarkParse).use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw)
    .use(removeWebsitePresentation).use(rehypeStringify).process(markdown));
}

export async function generateOilEpub() {
  for (const directory of [TEXT, MEDIA, join(EPUB, 'styles'), join(SOURCE, 'META-INF')]) mkdirSync(directory, { recursive: true });
  for (const file of ['mimetype', 'META-INF/container.xml', 'META-INF/com.apple.ibooks.display-options.xml']) copyFileSync(join(TEMPLATE, file), join(SOURCE, file));
  const css = readFileSync(join(TEMPLATE, 'EPUB/styles/stylesheet1.css'), 'utf8');
  writeFileSync(join(EPUB, 'styles/stylesheet1.css'), `${css}\n.infographic-image { width: 100%; background: #0b0d10; }\n.chapter-meta, .edition-note { font-size: .85em; color: #555c66; }\n`);
  const master = join(ROOT, 'src/epub-assets/les-banquiers-du-baril-cover.png');
  const cover = await sharp(master).resize(1024, 1638, { fit: 'fill' }).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  writeFileSync(join(MEDIA, 'cover.jpg'), cover);
  writeFileSync(join(ROOT, 'public', book.cover), cover);
  for (const width of [320, 640, 960]) {
    await sharp(master).resize({ width }).webp({ quality: 84 }).toFile(join(ROOT, 'public', book.cover.replace('.jpg', `-${width}.webp`)));
  }
  await sharp(master).resize(1200, 630, { fit: 'contain', background: '#080c10' }).jpeg({ quality: 85, mozjpeg: true }).toFile(join(ROOT, 'public', book.social));
  writeFileSync(join(TEXT, 'cover.xhtml'), xhtmlDocument(config, { title: 'Couverture', bodyType: 'frontmatter cover', body: `<img src="../media/cover.jpg" alt="Couverture de ${xml(book.title)}" />` }));
  writeFileSync(join(TEXT, 'title_page.xhtml'), xhtmlDocument(config, { title: book.title, bodyType: 'frontmatter', body: `<section class="titlepage" epub:type="titlepage"><h1>${xml(book.title)}</h1><p class="subtitle">${xml(book.subtitle)}</p><p class="author">l0g</p><p>8 septembre 2026</p><p>Édition française · huit enquêtes · vingt-quatre infographies</p><p>Creative Commons Attribution 4.0 International</p></section>` }));

  const chapterByRoute = new Map(articles.map((a) => [a.route, `${a.chapter}#article-${a.number}`]));
  const rendered = [];
  let offset = 0;
  for (const article of articles) {
    const source = readFileSync(join(ROOT, 'src/content/posts', `${article.slug}.md`), 'utf8');
    const { frontmatter: meta } = parseFrontmatter(source);
    if (meta.title !== article.title || !meta.description) throw new Error(`Oil publication metadata drift: ${article.slug}`);
    const figures = [];
    const markdown = source.replace(/^---\n[\s\S]*?\n---\n/u, '').replace(/<svg\b[\s\S]*?<\/svg>/gu, (svg) => {
      const token = `<div data-oil-figure="${figures.length}"></div>`;
      figures.push(standaloneSvg(svg));
      return token;
    });
    if (figures.length !== 3) throw new Error(`${article.slug}: expected three figures`);
    let html = await renderOilMarkdown(markdown);
    figures.forEach((svg, index) => {
      const token = `<div data-oil-figure="${index}"></div>`;
      if (!html.includes(token)) throw new Error(`${article.slug}: missing figure ${index}`);
      html = html.replace(token, svg);
    });
    const extracted = extractInfographics(html, article.number, offset, MEDIA);
    offset = extracted.next;
    html = extracted.html;
    html = html.replace(/href="https:\/\/l0g\.fr(\/posts\/les-banquiers-du-baril-[^"]+)"/gu, 'href="$1"');
    const sectioned = sectionHeadings(normalizeVoidElements(rewriteLinks(html, chapterByRoute)), article.number);
    const date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'Europe/Paris' }).format(new Date(meta.pubDate));
    const body = `<section id="article-${article.number}" class="article-chapter"><p class="chapter-kicker">Volet ${article.number} sur 8</p><h1>${xml(meta.title)}</h1><p class="chapter-dek">${xml(meta.description)}</p><p class="chapter-meta">Publié le ${xml(date)} · <a href="${SITE}${article.route}">Version en ligne</a></p>${sectioned.html}</section>`;
    writeFileSync(join(TEXT, article.chapter), xhtmlDocument(config, { title: article.title, body }));
    rendered.push({ ...article, headings: sectioned.headings });
  }
  if (offset !== 24) throw new Error(`Expected 24 infographics, found ${offset}`);
  writeFileSync(join(TEXT, 'ch001.xhtml'), xhtmlDocument(config, { title: 'Introduction : suivre l’argent du pétrole', body: `<section id="introduction" epub:type="introduction"><p class="chapter-kicker">Introduction</p><h1>Suivre l’argent du pétrole</h1>${paragraphs(book.introduction)}<h2>Parcours de lecture</h2><ol>${articles.map((a) => `<li><a href="${a.chapter}#article-${a.number}">${xml(a.title)}</a> : ${xml(a.summary)}</li>`).join('')}</ol></section>` }));
  writeFileSync(join(TEXT, 'ch010.xhtml'), xhtmlDocument(config, { title: 'À propos de cette édition', body: `<section id="edition"><h1>À propos de cette édition</h1><p>Cette édition française du 8 septembre 2026 rassemble les huit articles de la série Les banquiers du baril, avec une introduction originale et 24 infographies. Les chapitres conservent leurs sources, leurs réserves et leurs dates. Les liens vers les autres volets ouvrent le chapitre correspondant dans le livre ; les autres liens nécessitent une connexion.</p><p>La couverture est une illustration conceptuelle générée avec une assistance d’intelligence artificielle. Le navire, le terminal et le registre représentés ne décrivent aucune installation, société ou transaction réelle. Les chiffres décoratifs du registre ne sont pas des données de l’enquête.</p><p>Le texte et les graphiques sont lisibles hors ligne. Aucun script, police distante ou ressource de suivi n’est embarqué. Les descriptions alternatives accompagnent les graphiques. Le rendu et les possibilités d’agrandissement dépendent de la liseuse.</p><h2>Articles d’origine</h2><ol>${articles.map((a) => `<li><a href="${SITE}${a.route}">${xml(a.title)}</a></li>`).join('')}</ol><p>Retrouvez les éventuelles corrections sur <a href="${SITE}${book.path}">la page de l’édition</a>.</p><p>Publication l0g · <a href="https://creativecommons.org/licenses/by/4.0/deed.fr">Creative Commons Attribution 4.0 International</a>.</p></section>` }));

  const nav = [{ title: 'Introduction : suivre l’argent du pétrole', href: 'text/ch001.xhtml' }, ...rendered.map((a) => ({ title: `${a.number}. ${a.title}`, href: `text/${a.chapter}`, children: a.headings.map((h) => ({ title: h.label, href: `text/${a.chapter}#${h.id}` })) })), { title: 'À propos de cette édition', href: 'text/ch010.xhtml' }];
  const navList = (entries) => `<ol>${entries.map((e) => `<li><a href="${e.href}">${xml(e.title)}</a>${e.children ? navList(e.children) : ''}</li>`).join('')}</ol>`;
  writeFileSync(join(EPUB, 'nav.xhtml'), xhtmlDocument(config, { title: 'Sommaire', bodyType: 'frontmatter', body: `<nav epub:type="toc" id="toc"><h1>Sommaire</h1>${navList(nav)}</nav>` }).replace('../styles/stylesheet1.css', 'styles/stylesheet1.css'));
  let playOrder = 0;
  const ncxPoints = (entries) => entries.map((e) => { const order = ++playOrder; return `<navPoint id="nav-${order}" playOrder="${order}"><navLabel><text>${xml(e.title)}</text></navLabel><content src="${e.href}"/>${e.children ? ncxPoints(e.children) : ''}</navPoint>`; }).join('');
  const points = ncxPoints(nav);
  writeFileSync(join(EPUB, 'toc.ncx'), `<?xml version="1.0" encoding="UTF-8"?><ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1" xml:lang="fr"><head><meta name="dtb:uid" content="${ID}"/><meta name="dtb:depth" content="2"/><meta name="dtb:totalPageCount" content="0"/><meta name="dtb:maxPageNumber" content="0"/></head><docTitle><text>${xml(book.title)}</text></docTitle><navMap>${points}</navMap></ncx>`);
  const chapters = Array.from({ length: 10 }, (_, i) => `ch${String(i + 1).padStart(3, '0')}`);
  writeFileSync(join(EPUB, 'content.opf'), `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="fr" prefix="schema: http://schema.org/">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${ID}</dc:identifier><dc:title>${xml(book.title)}</dc:title><dc:language>fr</dc:language><dc:creator>l0g</dc:creator><dc:publisher>l0g.fr</dc:publisher><dc:date>${book.date}</dc:date><dc:description>${xml(book.subtitle)}. Huit enquêtes et vingt-quatre infographies.</dc:description><dc:source>${SITE}${book.path}</dc:source><dc:rights>Creative Commons Attribution 4.0 International</dc:rights><meta property="dcterms:modified">${book.modified}</meta><meta name="cover" content="cover-image"/><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityHazard">none</meta><meta property="schema:accessibilitySummary">Texte redistribuable, sommaire hiérarchisé, sources cliquables et descriptions alternatives pour les 24 infographies. L’agrandissement des images dépend de la liseuse.</meta></metadata>
<manifest><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="css" href="styles/stylesheet1.css" media-type="text/css"/><item id="cover-image" href="media/cover.jpg" media-type="image/jpeg" properties="cover-image"/><item id="cover" href="text/cover.xhtml" media-type="application/xhtml+xml"/><item id="title" href="text/title_page.xhtml" media-type="application/xhtml+xml"/>${chapters.map((id) => `<item id="${id}" href="text/${id}.xhtml" media-type="application/xhtml+xml"/>`).join('')}${Array.from({ length: 24 }, (_, i) => `<item id="fig-${i}" href="media/file${i}.svg" media-type="image/svg+xml"/>`).join('')}</manifest>
<spine toc="ncx"><itemref idref="cover"/><itemref idref="title"/><itemref idref="nav"/>${chapters.map((id) => `<itemref idref="${id}"/>`).join('')}</spine></package>`);
  console.log('Les banquiers du baril : introduction, 8 enquêtes et 24 infographies générées.');
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) await generateOilEpub();
