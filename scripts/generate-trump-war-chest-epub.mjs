import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { transform } from '@astrojs/compiler-rs';
import * as astroRuntime from 'astro/compiler-runtime';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
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
import ts from 'typescript';
import { unified } from 'unified';
import { trumpWarChestEditions } from '../src/config/trump-war-chest-publication.mjs';
import { trumpWarChestBookText } from '../src/publication-text/trump-war-chest-book.mjs';
import {
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
const figureChapters = [
  { component: 'TrumpTreasuryFigure', directory: 'trump-treasury', kinds: ['circuit', 'controls', 'timeline'] },
  { component: 'TrumpBudgetFigure', directory: 'trump-budget', kinds: ['contract', 'expiry', 'transfer'] },
  { component: 'TrumpCustodyFigure', directory: 'trump-custody', kinds: ['custody', 'ledger', 'parks'] },
  { component: 'TrumpDetentionFigure', directory: 'trump-detention', kinds: ['acquisitions', 'ownership', 'buybacks'] },
  { component: 'TrumpFamilyCapitalFigure', kinds: ['hadrian', 'swaps'] },
  { component: 'TrumpFederalFundingFigure', kinds: ['calendar', 'balances'] },
];
const referenceCounts = [14, 17, 25, 48, 33, 30];
const nodes = node => [node, ...(node.children ?? []).flatMap(nodes)];
const element = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });
const text = value => ({ type: 'text', value });
const serialize = tree => unified().use(rehypeStringify, {
  closeSelfClosing: true,
  characterReferences: { useNamedReferences: false },
}).stringify(tree);

const svgTags = new Set('svg title desc circle g line path rect text'.split(' '));
const svgAttributes = new Set(('xmlns ariaHidden ariaLabelledBy cx cy d fill fillOpacity fontSize fontWeight ' +
  'height id r role rx stroke strokeDashArray strokeLineCap strokeLineJoin strokeWidth style textAnchor ' +
  'transform viewBox width x x1 x2 xmlLang y y1 y2').split(' '));

function offlineSvg(source, fontCss) {
  const svg = structuredClone(source);
  const elements = nodes(svg).filter(node => node.type === 'element');
  for (const node of elements) {
    if (!svgTags.has(node.tagName)) throw new Error(`Unexpected SVG node: ${node.tagName}`);
    for (const [attribute, value] of Object.entries(node.properties)) {
      if (!svgAttributes.has(attribute)) throw new Error(`Unexpected SVG attribute: ${attribute}`);
      if (attribute === 'style') {
        if (node !== svg || value !== 'width:100%;height:auto') throw new Error('Unexpected SVG style');
        delete node.properties.style;
      }
      if (['fill', 'stroke'].includes(attribute)) {
        const token = /^var\(--color-([a-z0-9-]+)\)$/u.exec(value);
        if (token && Object.hasOwn(aiCreditorsPalette, token[1])) {
          const paint = aiCreditorsPalette[token[1]];
          const alpha = /^rgba\(255, 255, 255, (0\.\d+)\)$/u.exec(paint);
          node.properties[attribute] = alpha ? '#ffffff' : paint;
          if (alpha) node.properties[`${attribute}Opacity`] = Number(alpha[1]) * Number(node.properties[`${attribute}Opacity`] ?? 1);
        } else if (!/^(?:none|#[0-9a-f]{6})$/iu.test(value)) {
          throw new Error(`Unknown SVG paint: ${value}`);
        }
      }
    }
  }
  const viewBox = String(svg.properties.viewBox).split(/\s+/u).map(Number);
  const [x, y, width, height] = viewBox;
  if (viewBox.length !== 4 || x !== 0 || y !== 0 ||
    !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
    throw new Error('Invalid SVG viewBox');
  }
  svg.properties.width = width;
  svg.properties.height = height;
  svg.properties.role = 'img';
  delete svg.properties.ariaHidden;
  svg.children.unshift(element('defs', {}, [element('style', {}, [text(fontCss)])]));
  const descriptionNode = elements.find(node => node.tagName === 'desc');
  const description = descriptionNode ? toText(descriptionNode).trim() : '';
  if (!description || svg.properties.xmlLang && !['fr', 'en'].includes(svg.properties.xmlLang)) {
    throw new Error('Invalid SVG description or locale');
  }
  return { svg: serialize(svg).replace(/[ \t]+$/gmu, ''), description };
}

const compilerRuntime = 'astro/compiler-runtime';

async function compileFigure(source, filename) {
  const { code } = await transform(source, { filename, internalURL: compilerRuntime });
  const { outputText } = ts.transpileModule(code, {
    compilerOptions: { target: ts.ScriptTarget.ESNext, module: ts.ModuleKind.CommonJS },
  });
  const exports = {};
  const requireRuntime = specifier => {
    if (specifier !== compilerRuntime) throw new Error(`Unsupported figure dependency: ${specifier}`);
    // These standalone components use no Vite hydration metadata.
    return { ...astroRuntime, createMetadata: () => ({}) };
  };
  runInNewContext(outputText, { exports, require: requireRuntime }, { filename, timeout: 5000 });
  return exports.default;
}

async function renderFigures(lang, fontCss) {
  const astro = await AstroContainer.create();
  return Promise.all(figureChapters.map(async ({ component, directory, kinds }) => {
    const file = join(root, 'src/components', `${component}.astro`);
    let source = readFileSync(file, 'utf8');
    source = source.replace(/\n<style>[^]*?<\/style>\s*$/u, '');
    if (directory) {
      const glob = `import.meta.glob('../figures/${directory}/*.svg', { query: '?raw', import: 'default', eager: true })`;
      if (!source.includes(glob)) throw new Error(`Unexpected SVG loader: ${component}`);
      const assets = Object.fromEntries(kinds.flatMap(kind => ['.svg', '.mobile.svg'].map(extension => {
        const name = `${lang}-${kind}${extension}`;
        const asset = readFileSync(join(root, 'src/figures', directory, name), 'utf8');
        if (/<!DOCTYPE|<!ENTITY/iu.test(asset) || XMLValidator.validate(asset) !== true) {
          throw new Error(`Invalid figure SVG: ${directory}/${name}`);
        }
        return [`../figures/${directory}/${name}`, asset];
      })));
      source = source.replace(glob, () => JSON.stringify(assets));
    }
    // Compile the six checked-in figure components. Article imports and expressions are never run.
    const figure = await compileFigure(source, file);
    const entries = [];
    for (const kind of kinds) {
      const tree = fromHtml(await astro.renderToString(figure, { props: { lang, kind } }), { fragment: true });
      const rendered = nodes(tree);
      const scenes = rendered.filter(node => node.tagName === 'svg');
      const [caption, ...otherCaptions] = rendered.filter(node => node.tagName === 'figcaption');
      if (scenes.length !== 2 || !caption || otherCaptions.length) throw new Error(`Unexpected figure layouts: ${component}/${kind}`);
      const paragraphs = caption.children.filter(node => node.type === 'text').map(node => node.value.trim()).filter(Boolean);
      const sources = caption.children.filter(node => node.tagName === 'a').map(node => {
        const label = toText(node).trim();
        if (!/^S\d{2}$/u.test(label) || node.properties.href !== `#source-${label}`) {
          throw new Error(`Invalid figure source: ${component}/${kind}`);
        }
        return label;
      });
      if (!paragraphs.length || !sources.length) throw new Error(`Missing figure caption: ${component}/${kind}`);
      entries.push({ caption: paragraphs.join(' '), sources, scenes: scenes.map(svg => offlineSvg(svg, fontCss)) });
    }
    return entries;
  }));
}

const paragraphBlocks = new Set(['figure', 'section', 'p', 'ol', 'ul', 'li']);
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
    if (typeof value !== 'string') throw new Error(`Non-literal MDX attribute: ${name}`);
    result[name] = value;
  }
  return result;
}

function sourceArticle(book, chapter) {
  return parseAiCreditorsFrontmatter(readFileSync(join(
    root, 'src/content', book.lang === 'fr' ? 'posts' : 'posts-en', `${chapter.slug}.mdx`,
  ), 'utf8'));
}

async function renderArticle(book, chapter, chapterFigures) {
  const { lang } = book;
  const tr = (fr, en) => lang === 'fr' ? fr : en;
  const { content, frontmatter: meta } = sourceArticle(book, chapter);
  const effectiveDate = meta.updatedDate ?? meta.pubDate;
  const { component, kinds } = figureChapters[chapter.number - 1];
  if (meta.title !== chapter.title || meta.draft !== false ||
    ![meta.pubDate, effectiveDate].every(date => typeof date === 'string' && Date.parse(date) <= Date.parse(book.modified))) {
    throw new Error(`Unexpected article metadata: ${chapter.slug}`);
  }
  if (lang === 'en') {
    const france = trumpWarChestEditions.fr;
    const { frontmatter: original } = sourceArticle(france, france.chapters[chapter.number - 1]);
    if (meta.sourceArticle !== chapter.sourceSlug || meta.sourceUpdatedDate !== (original.updatedDate ?? original.pubDate)) {
      throw new Error(`English edition source drift: ${chapter.slug}`);
    }
  }

  const tree = unified().use(remarkParse).use(remarkGfm).use(remarkMdx).parse(content);
  const importPath = `../../components/${component}.astro`;
  const statements = nodes(tree).filter(node => node.type === 'mdxjsEsm').flatMap(node => node.data?.estree?.body ?? []);
  const [statement] = statements;
  const [specifier] = statement?.specifiers ?? [];
  if (statements.length !== 1 || statement.type !== 'ImportDeclaration' || statement.source.value !== importPath ||
    statement.specifiers.length !== 1 || specifier.type !== 'ImportDefaultSpecifier' || specifier.local.name !== component) {
    throw new Error(`Unexpected MDX import: ${chapter.slug}`);
  }
  if (nodes(tree).some(node => ['mdxFlowExpression', 'mdxTextExpression', 'html', 'image', 'imageReference'].includes(node.type))) {
    throw new Error(`Active or unexpected article content: ${chapter.slug}`);
  }
  tree.children = tree.children.filter(node => node.type !== 'mdxjsEsm');

  const attachments = [];
  const artwork = [];
  const figureOffset = figureChapters.slice(0, chapter.number - 1).reduce((sum, entry) => sum + entry.kinds.length, 0);
  function handle(state, node) {
    if (node.name === component) {
      const index = artwork.length;
      const number = index + 1;
      const { kind, lang: figureLang } = props(node, ['kind', 'lang']);
      if (node.children.length || figureLang !== lang || kind !== kinds[index]) {
        throw new Error(`Unexpected figure: ${chapter.slug}`);
      }
      const articleFigure = chapterFigures[index];
      const { caption, sources } = articleFigure;
      const id = `figure-${number}`;
      const descriptionId = `description-c${chapter.number}-f${number}`;
      const scenes = articleFigure.scenes.map((baked, sceneIndex) => {
        const variant = sceneIndex === 0 ? 'desktop' : 'mobile';
        const name = `file${(figureOffset + index) * 2 + sceneIndex}.svg`;
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
      artwork.push({ id, number, caption, descriptionId, description: articleFigure.scenes[0].description });
      const citations = sources.flatMap((source, position) => [
        text(position === 0 ? tr('Sources : ', 'Sources: ') : ' · '),
        element('a', { href: `#source-${source}` }, [text(source)]),
      ]);
      return element('figure', { id, className: ['infographic'] }, [
        ...scenes,
        element('figcaption', {}, [
          text(caption),
          element('span', { className: ['figure-source'] }, citations),
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

export async function generateTrumpWarChestEpub(lang) {
  if (!Object.hasOwn(trumpWarChestEditions, lang)) throw new Error(`Unknown edition language: ${lang}`);
  const book = trumpWarChestEditions[lang];
  const copy = trumpWarChestBookText[lang];
  const tr = (fr, en) => lang === 'fr' ? fr : en;
  const inter = cyberFontFiles[0];
  const font = readFileSync(join(root, inter.source)).toString('base64');
  const fontCss = `@font-face{font-family:"${inter.family}";font-style:normal;font-weight:${inter.weight};src:url(data:font/woff2;base64,${font}) format("woff2")}svg{font-family:"${inter.family}",sans-serif}`;
  const chaptersWithFigures = await renderFigures(lang, fontCss);
  const rendered = await Promise.all(book.chapters.map((chapter, index) => renderArticle(book, chapter, chaptersWithFigures[index])));
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
    `<h1>${xml(copy.colophonTitle)}</h1>${prose(copy.colophon)}<p><a href="${site}${book.path}">${tr('Page de l’édition et corrections', 'Edition page and corrections')}</a></p><p><a href="${site}${trumpWarChestEditions[tr('en', 'fr')].path}">${tr('Lire l’édition anglaise', 'Read the French edition')}</a></p><p><a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a></p>${licences}`, {
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
  for (const lang of ['fr', 'en']) await generateTrumpWarChestEpub(lang);
}
