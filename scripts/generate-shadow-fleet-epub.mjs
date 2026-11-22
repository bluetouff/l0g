import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import GithubSlugger from 'github-slugger';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import sharp from 'sharp';
import { unified } from 'unified';
import { shadowFleetEditions } from '../src/config/shadow-fleet-publication.mjs';
import { shadowFleetBookText } from '../src/publication-text/shadow-fleet-book.mjs';
import {
  aiCreditorsComponentLiteral,
  aiCreditorsEpubCss,
  aiCreditorsPalette,
  assertAiCreditorsPassiveTree,
  parseAiCreditorsFrontmatter,
  prepareAiCreditorsReading,
} from './generate-ai-creditors-epub.mjs';
import { cyberFontFiles } from './generate-cyber-recovery-epub.mjs';
import { escapeXml as xml, xhtmlDocument } from './generate-e-invoicing-epub-lib.mjs';
import { editorialTitleViolation } from './editorial-title-policy.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const site = 'https://l0g.fr';
const figures = [
  ['ownership', 'transfer', 'network'],
  ['credit', 'fx', 'cashflow'],
  ['payment', 'clearing', 'volume'],
  ['insurance', 'certificate', 'limits'],
];
const referenceCounts = [16, 16, 23, 22];
const nodes = node => [node, ...(node.children ?? []).flatMap(nodes)];
const element = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });
const text = value => ({ type: 'text', value });
const serialize = tree => unified().use(rehypeStringify, {
  closeSelfClosing: true,
  characterReferences: { useNamedReferences: false },
}).stringify(tree);

const svgTags = new Set('svg title desc metadata defs marker circle ellipse g line linearGradient path rect stop text'.split(' '));
const svgAttributes = new Set(('xmlns ariaHidden ariaLabelledBy className cx cy d fill fontFamily fontSize ' +
  'fontWeight height id markerEnd markerHeight markerUnits markerWidth offset opacity orient r refX refY ' +
  'role rx ry stopColor stopOpacity stroke strokeDashArray strokeLineCap strokeLineJoin strokeOpacity ' +
  'strokeWidth style textAnchor transform viewBox width x x1 x2 xmlLang y y1 y2').split(' '));

function offlineSvg(file) {
  const source = readFileSync(file, 'utf8');
  if (/<!DOCTYPE|<!ENTITY/iu.test(source) || XMLValidator.validate(source) !== true) {
    throw new Error(`Invalid source SVG: ${file}`);
  }
  const tree = fromHtml(source, { fragment: true });
  const [svg, ...siblings] = tree.children.filter(node => node.type !== 'text' || node.value.trim());
  if (svg?.tagName !== 'svg' || siblings.length) throw new Error(`Unexpected SVG root: ${file}`);
  const elements = nodes(svg).filter(node => node.type === 'element');
  const ids = new Set(elements.map(node => node.properties.id).filter(Boolean));
  for (const node of elements) {
    if (!svgTags.has(node.tagName)) throw new Error(`Unexpected SVG node: ${node.tagName}`);
    for (const [attribute, value] of Object.entries(node.properties)) {
      if (!svgAttributes.has(attribute)) throw new Error(`Unexpected SVG attribute: ${attribute}`);
      if (attribute === 'style') {
        if (node !== svg || value !== 'width:100%;height:auto') throw new Error('Unexpected SVG style');
        delete node.properties.style;
      }
      if (['fill', 'stroke', 'stopColor', 'markerEnd'].includes(attribute)) {
        const token = /^var\(--color-([a-z0-9-]+)\)$/u.exec(value);
        const reference = /^url\(#([\w-]+)\)$/u.exec(value);
        if (token && Object.hasOwn(aiCreditorsPalette, token[1])) node.properties[attribute] = aiCreditorsPalette[token[1]];
        else if (!(reference && ids.has(reference[1])) && !/^(?:none|#[0-9a-f]{6})$/iu.test(value)) {
          throw new Error(`Unknown SVG paint or reference: ${value}`);
        }
      }
    }
  }
  const [x, y, width, height] = String(svg.properties.viewBox).split(/\s+/u).map(Number);
  if (x !== 0 || y !== 0 || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error(`Invalid SVG viewBox: ${file}`);
  }
  svg.properties.width = width;
  svg.properties.height = height;
  const descriptionNode = elements.find(node => node.tagName === 'desc');
  const description = descriptionNode ? toText(descriptionNode).trim() : '';
  if (!description) throw new Error(`Missing SVG description: ${file}`);
  return { svg: serialize(svg), description };
}

const paragraphBlocks = new Set(['figure', 'section', 'p']);
function splitParagraphs(node) {
  if (!node.children) return [node];
  node.children = node.children.flatMap(splitParagraphs);
  if (node.tagName !== 'p' || !node.children.some(child => paragraphBlocks.has(child.tagName))) return [node];

  const result = [];
  let inline = [];
  function flush() {
    if (inline.some(child => child.type !== 'text' || child.value.trim())) {
      result.push(element('p', node.properties, inline));
    }
    inline = [];
  }
  for (const child of node.children) {
    if (paragraphBlocks.has(child.tagName)) {
      flush();
      result.push(child);
    } else inline.push(child);
  }
  flush();
  return result;
}

const passiveJsx = {
  a: ['href', 'target', 'rel'],
  details: [],
  summary: [],
  p: ['class', 'className'],
  span: ['class', 'className'],
  ol: ['class', 'className', 'role'],
  li: ['id'],
  strong: [],
};

function props(node, allowed) {
  const result = Object.create(null);
  for (const attribute of node.attributes) {
    const { name, value } = attribute;
    if (attribute.type !== 'mdxJsxAttribute' || !allowed.includes(name) || Object.hasOwn(result, name)) {
      throw new Error(`Unexpected MDX attribute: ${name}`);
    }
    const literal = value?.data?.estree?.body;
    if (typeof value === 'string') result[name] = value;
    else if (name === 'number' && literal?.length === 1 && literal[0].type === 'ExpressionStatement' &&
      literal[0].expression.type === 'Literal' && Number.isSafeInteger(literal[0].expression.value)) {
      result.number = literal[0].expression.value;
    } else throw new Error(`Non-literal MDX attribute: ${name}`);
  }
  return result;
}

function sourceArticle(book, chapter) {
  return parseAiCreditorsFrontmatter(readFileSync(join(
    root, 'src/content', book.lang === 'fr' ? 'posts' : 'posts-en', `${chapter.slug}.mdx`,
  ), 'utf8'));
}

async function renderArticle(book, chapter) {
  const { lang } = book;
  const tr = (fr, en) => lang === 'fr' ? fr : en;
  const { content, frontmatter: meta } = sourceArticle(book, chapter);
  const effectiveDate = meta.updatedDate ?? meta.pubDate;
  if (meta.title !== chapter.title || meta.description !== chapter.summary || meta.draft !== false ||
    ![meta.pubDate, effectiveDate].every(date => typeof date === 'string' && Date.parse(date) <= Date.parse(book.modified))) {
    throw new Error(`Unexpected article metadata: ${chapter.slug}`);
  }
  if (lang === 'en') {
    const france = shadowFleetEditions.fr;
    const { frontmatter: original } = sourceArticle(france, france.chapters[chapter.number - 1]);
    if (meta.sourceArticle !== chapter.sourceSlug || meta.sourceUpdatedDate !== (original.updatedDate ?? original.pubDate)) {
      throw new Error(`English edition source drift: ${chapter.slug}`);
    }
  }

  const tree = unified().use(remarkParse).use(remarkGfm).use(remarkMdx).parse(content);
  const importPath = `../../components/${chapter.component}.astro`;
  const statements = nodes(tree).filter(node => node.type === 'mdxjsEsm').flatMap(node => node.data?.estree?.body ?? []);
  const [statement] = statements;
  const [specifier] = statement?.specifiers ?? [];
  if (statements.length !== 1 || statement.type !== 'ImportDeclaration' || statement.source.value !== importPath ||
    statement.specifiers.length !== 1 || specifier.type !== 'ImportDefaultSpecifier' || specifier.local.name !== chapter.component) {
    throw new Error(`Unexpected MDX import: ${chapter.slug}`);
  }
  if (nodes(tree).some(node => ['mdxFlowExpression', 'mdxTextExpression', 'html', 'image', 'imageReference'].includes(node.type))) {
    throw new Error(`Active or unexpected article content: ${chapter.slug}`);
  }
  tree.children = tree.children.filter(node => node.type !== 'mdxjsEsm');

  const [directory, ...kinds] = figures[chapter.number - 1];
  const copy = aiCreditorsComponentLiteral(readFileSync(join(root, 'src/components', `${chapter.component}.astro`), 'utf8'), 'copy');
  const attachments = [];
  const artwork = [];
  function handle(state, node) {
    if (node.name === chapter.component) {
      const index = artwork.length;
      const { kind, lang: figureLang, number } = props(node, ['kind', 'lang', 'number']);
      if (node.children.length || figureLang !== lang || number !== index + 1 || kind !== kinds[index]) {
        throw new Error(`Unexpected figure: ${chapter.slug}`);
      }
      const { caption, credit, sources } = copy[lang][kind];
      if (typeof caption !== 'string' || !caption.trim() || typeof credit !== 'string' || !credit.trim() ||
        !Array.isArray(sources) || !sources.length || sources.some(([id, label]) => !/^S\d{2}$/u.test(id) || typeof label !== 'string')) {
        throw new Error(`Incomplete figure caption: ${chapter.slug}/${kind}`);
      }
      const id = `figure-${number}`;
      const descriptionId = `description-c${chapter.number}-f${number}`;
      const scenes = ['desktop', 'mobile'].map((variant, sceneIndex) => {
        const name = `file${(chapter.number - 1) * 4 + index * 2 + sceneIndex}.svg`;
        const baked = offlineSvg(join(root, 'src/figures', `shadow-fleet-${directory}-2026`, `${kind}.${lang}.${variant}.svg`));
        attachments.push({ name, ...baked });
        return element('a', {
          className: [`infographic-${variant}`],
          href: `../media/${name}`,
          ariaLabel: tr('Agrandir l’infographie', 'Open infographic at full size'),
        }, [element('img', {
          alt: baked.description,
          className: ['infographic-image'],
          src: `../media/${name}`,
        }, [])]);
      });
      artwork.push({ id, number, caption, descriptionId, description: attachments.at(-2).description });
      const citations = sources.flatMap(([source, label], position) => [
        text(position === 0 ? tr('Sources : ', 'Sources: ') : ' · '),
        element('a', { href: `#source-${source}` }, [text(label)]),
      ]);
      return element('figure', { id, className: ['infographic'] }, [
        ...scenes,
        element('figcaption', {}, [
          element('span', { className: ['figure-number'] }, [text(`FIG. 0${number}`)]),
          text(caption),
          element('span', { className: ['figure-source'] }, citations),
          element('span', { className: ['figure-credit'] }, [text(credit)]),
          element('a', { className: ['figure-alt-link'], href: `figures.xhtml#${descriptionId}` }, [
            text(tr('Description textuelle', 'Text description')),
          ]),
        ]),
      ]);
    }

    if (!Object.hasOwn(passiveJsx, node.name)) throw new Error(`Unexpected MDX element: ${node.name}`);
    const attributes = props(node, passiveJsx[node.name]);
    if (attributes.target && attributes.target !== '_blank' ||
      attributes.rel && attributes.rel !== 'noopener noreferrer' ||
      attributes.role && attributes.role !== 'list') throw new Error('Unexpected MDX link or list behavior');
    const classes = attributes.className ?? attributes.class;
    const properties = {};
    for (const key of ['id', 'href']) if (attributes[key]) properties[key] = attributes[key];
    if (classes) properties.className = classes.split(/\s+/u);
    if (node.name === 'summary') properties.className = ['reading-box-title'];
    const tag = { details: 'section', summary: 'p' }[node.name] ?? node.name;
    let children = state.all(node);
    if (tag === 'p' && children.length === 1 && children[0].tagName === 'p') children = children[0].children;
    return element(tag, properties, children);
  }

  const rendered = await unified().use(remarkRehype, {
    handlers: { mdxJsxFlowElement: handle, mdxJsxTextElement: handle },
  }).run(tree);
  splitParagraphs(rendered);
  const ids = new Map();
  const headings = [];
  const slugger = new GithubSlugger();
  for (const node of nodes(rendered)) {
    const { tagName, properties } = node;
    if (/^h[2-6]$/u.test(tagName ?? '')) properties.id ??= slugger.slug(toText(node));
    if (properties?.id) {
      const id = properties.id;
      if (ids.has(id) || !/^[-\p{L}\p{N}_]+$/u.test(id)) throw new Error(`Duplicate or unsafe ID: ${id}`);
      properties.id = `c${chapter.number}-${id}`;
      ids.set(id, properties.id);
    }
    if (tagName === 'h2') headings.push({ title: toText(node), id: properties.id });
    if (['td', 'th'].includes(tagName) && properties.align) {
      properties.className = [`align-${properties.align}`];
      delete properties.align;
    }
  }
  for (const figure of artwork) figure.id = ids.get(figure.id);
  const references = nodes(rendered).filter(node => node.tagName === 'li' && /-source-S\d{2}$/u.test(node.properties.id ?? ''));
  if (artwork.length !== kinds.length || references.length !== referenceCounts[chapter.number - 1]) {
    throw new Error(`Figure or bibliography count drift: ${chapter.slug}`);
  }
  assertAiCreditorsPassiveTree(rendered);
  return { tree: rendered, chapter, meta, ids, headings, figures: artwork, attachments };
}

export async function generateShadowFleetEpub(lang) {
  const book = shadowFleetEditions[lang];
  if (!book) throw new Error(`Unknown edition language: ${lang}`);
  const copy = shadowFleetBookText[lang];
  const tr = (fr, en) => lang === 'fr' ? fr : en;
  const rendered = await Promise.all(book.chapters.map(chapter => renderArticle(book, chapter)));
  const routes = new Map(rendered.map(chapter => [chapter.chapter.route, chapter]));
  const glossary = new Map(copy.glossary.filter(term => term.path).map(term => [term.path, term.slug]));
  const cover = readFileSync(join(root, 'public', book.cover));
  const { format, height, width } = await sharp(cover).metadata();
  if (format !== 'jpeg' || width !== book.coverWidth || height !== book.coverHeight) throw new Error('Unexpected EPUB cover');

  const files = new Map();
  const manifest = [];
  const spine = [];
  const contents = [];
  function checked(file, value) {
    const validation = XMLValidator.validate(value);
    if (validation !== true) throw new Error(`${file}: ${JSON.stringify(validation)}`);
    files.set(file, value);
  }
  function register(id, href, media, properties) {
    manifest.push(`<item id="${id}" href="${href}" media-type="${media}"${properties ? ` properties="${properties}"` : ''}/>`);
  }
  function section(file, title, body, { type = 'bodymatter', toc = true, children } = {}) {
    if (typeof title !== 'string' || editorialTitleViolation(title)) throw new Error(`Forbidden EPUB heading: ${title}`);
    const tree = fromHtml(body, { fragment: true });
    assertAiCreditorsPassiveTree(tree);
    const href = `text/${file}.xhtml`;
    const xhtml = xhtmlDocument(book, { title, body, bodyType: type });
    checked(`EPUB/${href}`, file === 'cover' ? xhtml.replace('<body ', '<body class="cover-page" ') : xhtml);
    register(file, href, 'application/xhtml+xml');
    spine.push(file);
    if (toc) contents.push({ title, href, children });
  }
  function prose(values) {
    return values.map(value => `<p>${xml(value)}</p>`).join('\n');
  }
  function essay(file, title, values, type = 'bodymatter') {
    section(file, title, `<section><h1>${xml(title)}</h1>${prose(values)}</section>`, { type });
  }

  files.set('mimetype', 'application/epub+zip');
  checked('META-INF/container.xml', '<?xml version="1.0" encoding="UTF-8"?><container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0"><rootfiles><rootfile full-path="EPUB/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
  files.set('EPUB/styles/stylesheet1.css', aiCreditorsEpubCss);
  register('styles', 'styles/stylesheet1.css', 'text/css');
  for (const font of cyberFontFiles) {
    register(font.name.replace('.woff2', ''), `fonts/${font.name}`, 'font/woff2');
    files.set(`EPUB/fonts/${font.name}`, readFileSync(join(root, font.source)));
  }
  files.set('EPUB/media/cover.jpg', cover);
  register('cover-image', 'media/cover.jpg', 'image/jpeg', 'cover-image');
  section('cover', tr('Couverture', 'Cover'), `<img src="../media/cover.jpg" alt="${xml(book.coverAlt)}"/>`, {
    type: 'frontmatter cover', toc: false,
  });
  const publicationDate = new Intl.DateTimeFormat(book.locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(book.date));
  section('title_page', book.title, `<section class="titlepage"><h1>${xml(book.title)}</h1><p class="subtitle">${xml(book.subtitle)}</p><p class="author">l0g</p><p>${xml(publicationDate)}</p></section>`, {
    type: 'frontmatter titlepage', toc: false,
  });
  spine.push('nav');
  essay('ch001', copy.introductionTitle, copy.introduction);
  if (copy.method) essay('method', copy.methodTitle, copy.method, 'frontmatter');
  for (const article of rendered) {
    const { chapter, meta, headings, attachments } = article;
    const chapterBody = prepareAiCreditorsReading(article, chapter, routes, glossary);
    const date = `${tr('Publié le', 'Published')} ${meta.pubDate}${meta.updatedDate && meta.updatedDate !== meta.pubDate ? ` · ${tr('Révisé le', 'Updated')} ${meta.updatedDate}` : ''}`;
    section(chapter.chapter.replace('.xhtml', ''), chapter.title,
      `<section id="chapter-${chapter.number}"><p class="chapter-kicker">${tr('Chapitre', 'Chapter')} ${chapter.number}</p><h1>${xml(chapter.title)}</h1><p class="chapter-meta">${xml(date)}</p><p><a href="${site}${chapter.route}">${tr('Enquête originale en ligne', 'Original online investigation')}</a></p>${chapterBody}</section>`, {
        children: headings.map(heading => ({ title: heading.title, href: `text/${chapter.chapter}#${heading.id}` })),
      });
    for (const attachment of attachments) {
      checked(`EPUB/media/${attachment.name}`, attachment.svg);
      register(attachment.name.replace('.svg', ''), `media/${attachment.name}`, 'image/svg+xml');
    }
  }
  essay('conclusion', copy.conclusionTitle, copy.conclusion, 'backmatter');
  const glossaryEntries = copy.glossary.map(term => {
    const article = rendered[term.chapter - 1];
    const id = article?.ids.get(`source-${term.reference}`);
    if (!id) throw new Error(`Unknown glossary reference: ${term.slug}`);
    return `<section class="glossary-entry" id="glossary-${xml(term.slug)}"><h2>${xml(term.title)}</h2><p>${xml(term.definition)}</p><p><a href="${article.chapter.chapter}#${id}">${tr('Chapitre', 'Chapter')} ${term.chapter}, ${tr('source', 'reference')} ${xml(term.reference)}</a></p></section>`;
  }).join('');
  section('glossary', copy.glossaryTitle, `<h1>${xml(copy.glossaryTitle)}</h1>${glossaryEntries}`, { type: 'backmatter glossary' });
  const figuresTitle = tr('Table des infographies', 'List of infographics');
  const descriptions = rendered.flatMap(({ chapter, figures }) => figures.map(figure =>
    `<li id="${figure.descriptionId}"><a href="${chapter.chapter}#${figure.id}">${tr('Chapitre', 'Chapter')} ${chapter.number}, ${tr('figure', 'figure')} ${figure.number}</a><p>${xml(figure.caption)}</p><p>${xml(figure.description)}</p></li>`,
  )).join('');
  section('figures', figuresTitle, `<h1>${figuresTitle}</h1><ol>${descriptions}</ol>`, { type: 'backmatter' });
  const licences = cyberFontFiles.map(font => {
    const licence = readFileSync(join(root, 'public/fonts/jlr', font.license), 'utf8');
    return `<h2>${xml(font.family)}</h2><pre class="license-text">${xml(licence)}</pre>`;
  }).join('');
  section('colophon', copy.colophonTitle,
    `<h1>${xml(copy.colophonTitle)}</h1>${prose(copy.colophon)}<p><a href="${site}${book.path}">${tr('Page de l’édition et corrections', 'Edition page and corrections')}</a></p><p><a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a></p>${licences}`, {
      type: 'backmatter colophon',
    });

  const navList = entries => `<ol>${entries.map(entry => `<li><a href="${xml(entry.href)}">${xml(entry.title)}</a>${entry.children?.length ? navList(entry.children) : ''}</li>`).join('')}</ol>`;
  const contentsTitle = tr('Sommaire', 'Contents');
  checked('EPUB/nav.xhtml', xhtmlDocument(book, {
    title: contentsTitle,
    bodyType: 'frontmatter',
    body: `<nav epub:type="toc" id="toc"><h1>${contentsTitle}</h1>${navList(contents)}</nav><nav epub:type="landmarks"><h2>${tr('Repères', 'Landmarks')}</h2><ol><li><a epub:type="cover" href="text/cover.xhtml">${tr('Couverture', 'Cover')}</a></li><li><a epub:type="bodymatter" href="text/ch001.xhtml">${xml(copy.introductionTitle)}</a></li><li><a epub:type="glossary" href="text/glossary.xhtml">${xml(copy.glossaryTitle)}</a></li></ol></nav>`,
  }).replace('../styles/stylesheet1.css', 'styles/stylesheet1.css'));
  register('nav', 'nav.xhtml', 'application/xhtml+xml', 'nav');
  const figureSpine = rendered.flatMap(chapter => chapter.attachments.map(attachment =>
    `<itemref idref="${attachment.name.replace('.svg', '')}" linear="no"/>`,
  )).join('');
  checked('EPUB/content.opf', `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="publication-id" xml:lang="${lang}" prefix="schema: http://schema.org/">
<metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="publication-id">${site}${book.path}</dc:identifier><dc:title>${xml(book.title)}</dc:title><dc:language>${lang}</dc:language><dc:creator>l0g</dc:creator><dc:publisher>l0g.fr</dc:publisher><dc:date>${book.date}</dc:date><dc:description>${xml(book.description)}</dc:description><dc:source>${site}${book.path}</dc:source><dc:rights>Creative Commons Attribution 4.0 International</dc:rights><meta property="dcterms:modified">${book.modified}</meta><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityHazard">none</meta></metadata>
<manifest>${manifest.join('')}</manifest><spine>${spine.map(id => `<itemref idref="${id}"/>`).join('')}${figureSpine}</spine></package>`);

  const output = join(root, 'src/epub', book.directory);
  rmSync(output, { recursive: true, force: true });
  for (const directory of ['META-INF', 'EPUB', 'EPUB/fonts', 'EPUB/media', 'EPUB/styles', 'EPUB/text']) {
    mkdirSync(join(output, directory), { recursive: true });
  }
  for (const [file, payload] of files) writeFileSync(join(output, file), payload);
  console.log(`${book.title}: ${book.chapters.length} chapters, ${book.figureCount} figures, ${book.sourceCount} references.`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const lang of ['fr', 'en']) await generateShadowFleetEpub(lang);
}
