import { createHash } from 'node:crypto';
import { copyFileSync, lstatSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';
import sharp from 'sharp';
import { nvidiaVolumeTwoEditions } from '../src/config/nvidia-volume-two-publication.mjs';
import { assertCyberContentModel, assertCyberLink, cyberEpubCss, cyberFontFiles } from './generate-cyber-recovery-epub.mjs';
import { escapeXml as xml, xhtmlDocument } from './generate-e-invoicing-epub-lib.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const site = 'https://l0g.fr';
const directories = { fr: 'qui-gouverne-nvidia', en: 'who-governs-nvidia' };
const sourceFile = /^src\/content\/(?:posts|posts-en)\/[a-z0-9-]+\.mdx?$/u;
const validId = /^[\p{L}\p{N}_.:-]+$/u;
const elements = new Set('p a strong em b i sup sub code pre blockquote ol ul li h1 h2 h3 h4 h5 h6 hr br table caption thead tbody tfoot tr th td del s section div figure figcaption span details summary dl dt dd cite abbr small mark'.split(' '));
const svgElements = new Set('svg title desc defs marker g path rect circle ellipse line polyline polygon text tspan linearGradient radialGradient stop pattern clipPath mask use'.split(' '));
const svgAttributes = new Set(('xmlns xmlLang viewBox preserveAspectRatio width height role ariaLabelledBy ariaHidden focusable id x y x1 x2 y1 y2 dx dy ' +
  'cx cy r rx ry d points transform textAnchor dominantBaseline baselineShift letterSpacing fontFamily fontWeight fontSize fontStyle textLength lengthAdjust ' +
  'fill fillOpacity fillRule stroke strokeWidth strokeOpacity strokeLineCap strokeLineJoin strokeDashArray strokeDashOffset opacity ' +
  'markerStart markerMid markerEnd markerWidth markerHeight markerUnits refX refY orient gradientUnits gradientTransform offset stopColor stopOpacity ' +
  'patternUnits patternTransform clipPath clipPathUnits clipRule mask maskUnits maskContentUnits href xLinkHref style').split(' '));
const references = new Set(['markerStart', 'markerMid', 'markerEnd', 'clipPath', 'mask', 'href', 'xLinkHref']);
const paints = new Set(['fill', 'stroke', 'stopColor']);
const palette = {
  ink: '#0c0d10', paper: '#e7e9ee', surface: '#121419', 'surface-2': '#171a20',
  'line-strong': 'rgba(255, 255, 255, 0.20)', line: 'rgba(255, 255, 255, 0.10)', bright: '#f5f6f8', muted: '#8b909b',
  signal: '#5eead4', accent: '#ff4d87', amber: '#f5b13d', 'topic-blue': '#7aa2f7',
};
const hash = value => createHash('sha256').update(value).digest('hex');
const nodes = node => [node, ...(node.children ?? []).flatMap(nodes)];
const el = (tagName, properties = {}, children = []) => ({ type: 'element', tagName, properties, children });
const serialize = node => unified().use(rehypeStringify, {
  closeSelfClosing: true, characterReferences: { useNamedReferences: false },
}).stringify(node);
const normalized = value => value.replace(/\s+/gu, ' ').trim();
const proseText = node => nodes(node).filter(item => item.type === 'text').map(item => item.value).join('');

function fileBytes(file, maxBytes = 3_000_000) {
  const stat = lstatSync(file);
  if (!stat.isFile() || stat.size === 0 || stat.size > maxBytes) throw new Error(`Invalid input file: ${file}`);
  return readFileSync(file);
}

function svgPaint(value, ids) {
  const theme = /^var\(--color-([\w-]+)(?:,\s*(#[0-9a-f]{3,8}))?\)$/iu.exec(value);
  if (theme) {
    const colour = Object.hasOwn(palette, theme[1]) ? palette[theme[1]] : theme[2];
    if (colour) return colour;
  }
  if (value === 'currentColor') return palette.paper;
  const local = /^url\(#([\w.:-]+)\)$/u.exec(value);
  if (local && ids.has(local[1])) return value;
  if (/^(?:none|transparent|white|black|#[0-9a-f]{3,8}|rgba?\([\d\s,.%/]+\))$/iu.test(value)) return value;
  throw new Error(`Unexpected offline SVG paint: ${value}`);
}

export function offlineNvidiaVolumeTwoSvg(svg) {
  const children = nodes(svg).filter(node => node.type === 'element');
  if (svg.tagName !== 'svg') throw new Error('Invalid SVG root');
  const ids = new Set();
  for (const { properties: { id } } of children) {
    if (!id) continue;
    if (!validId.test(id) || ids.has(id)) throw new Error(`Invalid SVG identifier: ${id}`);
    ids.add(id);
  }
  for (const node of children) {
    if (!svgElements.has(node.tagName)) throw new Error(`Unexpected offline SVG node: ${node.tagName}`);
    for (const [name, value] of Object.entries(node.properties)) {
      if (name.startsWith('data') || name === 'className') {
        delete node.properties[name];
        continue;
      }
      if (!svgAttributes.has(name) || /[\u0000-\u001f\u007f]|(?:javascript|data):|@import/iu.test(String(value))) {
        throw new Error(`Unexpected offline SVG attribute: ${name}`);
      }
      if (name === 'style') {
        if (/url\s*\(|expression\s*\(/iu.test(value)) throw new Error('Unsafe offline SVG style');
        // Cascading layout is part of the website. Carry over only font
        // properties that affect figure legibility and are safe as SVG attributes.
        for (const declaration of String(value).split(';')) {
          const [property, ...parts] = declaration.split(':');
          const setting = parts.join(':').trim();
          if (!setting) continue;
          if (property.trim() === 'font-family') node.properties.fontFamily = 'sans-serif';
          if (property.trim() === 'font-weight' && /^\d{3}$/u.test(setting)) node.properties.fontWeight = setting;
        }
        delete node.properties.style;
      } else if (paints.has(name)) {
        node.properties[name] = svgPaint(String(value), ids);
      } else if (references.has(name)) {
        const local = /^(?:url\(#([\w.:-]+)\)|#([\w.:-]+)|none)$/u.exec(value);
        if (!local || (value !== 'none' && !ids.has(local[1] ?? local[2]))) throw new Error(`External or broken SVG reference: ${value}`);
      } else if (/url\s*\(/iu.test(String(value))) {
        throw new Error(`Unexpected SVG URL: ${name}`);
      }
    }
  }
  const coordinates = String(svg.properties.viewBox).trim().split(/[\s,]+/u).map(Number);
  if (coordinates.length !== 4 || coordinates.some(value => !Number.isFinite(value)) || coordinates[2] <= 0 || coordinates[3] <= 0) {
    throw new Error('Invalid offline SVG viewBox');
  }
  svg.properties.xmlns = 'http://www.w3.org/2000/svg';
  svg.properties.width = coordinates[2];
  svg.properties.height = coordinates[3];
  const description = children.find(node => node.tagName === 'desc') ?? children.find(node => node.tagName === 'title');
  const alt = description && normalized(toText(description));
  if (!alt) throw new Error('Missing offline SVG description');
  return { alt, source: serialize(svg) };
}

export function extractNvidiaVolumeTwoBody(html, chapter) {
  const document = fromHtml(html);
  const canonical = nodes(document).filter(node => node.tagName === 'link' && node.properties.rel?.includes('canonical'));
  if (canonical.length !== 1 || canonical[0].properties.href !== site + chapter.route) {
    throw new Error(`Incorrect source canonical URL: ${chapter.route}`);
  }
  const bodies = nodes(document).filter(node => node.type === 'element' && Object.hasOwn(node.properties, 'dataReadingBody'));
  if (bodies.length !== 1) throw new Error(`Expected one published article body: ${chapter.route}`);
  const articles = nodes(document).filter(node => node.tagName === 'article' && nodes(node).includes(bodies[0]));
  const heading = articles.length === 1 && nodes(articles[0]).find(node => node.tagName === 'h1');
  if (!heading || normalized(toText(heading)) !== normalized(chapter.title)) throw new Error(`Incorrect published article title: ${chapter.route}`);
  return bodies[0];
}

const classNames = value => Array.isArray(value) ? value.filter(name => /^[\w:-]+$/u.test(name)) : [];
const usedStyles = new Set(['sources-list', 'source-meta', 'source-id', 'infographic-block', 'infographic-visuals']);

export function renderNvidiaVolumeTwoBody(source, chapter) {
  const assets = [], figures = [];
  const omittedScenes = new Set();
  for (const figure of nodes(source).filter(item => item.tagName === 'figure')) {
    const variants = nodes(figure).filter(item => item.tagName === 'svg');
    if (variants.length < 2) continue;
    const widths = variants.map(item => Number(String(item.properties.viewBox).split(/\s+/u)[2]));
    if (variants.length !== 2 || !widths.every(Number.isFinite) || widths[0] === widths[1]) {
      throw new Error(`Unclear responsive figure variants: ${chapter.route}`);
    }
    omittedScenes.add(variants[widths[0] < widths[1] ? 1 : 0]);
  }
  const originalText = (node) => {
    if (['svg', 'style'].includes(node.tagName)) return '';
    if (node.type === 'text') return node.value;
    return (node.children ?? []).map(originalText).join('');
  };

  function clean(node) {
    if (node.type === 'text') return [node];
    if (node.type === 'comment' || node.tagName === 'style') return [];
    if (node.tagName === 'svg') {
      if (omittedScenes.has(node)) return [];
      const before = hash(serialize(node));
      const { source: svg, alt } = offlineNvidiaVolumeTwoSvg(node);
      if (XMLValidator.validate(svg) !== true) throw new Error(`Invalid compiled SVG: ${chapter.route}`);
      const filename = `figure-${chapter.number}-${assets.length + 1}.svg`;
      assets.push({ filename, data: svg, sourceSha256: before, epubSha256: hash(svg) });
      return [el('img', { src: `../media/${filename}`, alt, className: ['infographic-image'] })];
    }
    if (node.type !== 'element' || !elements.has(node.tagName)) {
      throw new Error(`Unexpected article body node ${node.tagName ?? node.type}: ${chapter.route}`);
    }
    const { tagName } = node;
    const properties = {};
    const safeProperties = ['id', 'title', 'ariaLabel', 'rowSpan', 'colSpan', 'scope', 'start', 'value'];
    for (const name of safeProperties) if (Object.hasOwn(node.properties, name)) properties[name] = node.properties[name];
    if (properties.id && !validId.test(properties.id)) throw new Error(`Invalid chapter identifier ${properties.id}: ${chapter.route}`);
    if (tagName === 'a') {
      assertCyberLink(node.properties.href);
      properties.href = node.properties.href;
    }
    const classes = classNames(node.properties.className);
    const retainedClasses = classes.filter(name => usedStyles.has(name));
    if (retainedClasses.length) properties.className = [...new Set(retainedClasses)];
    if (tagName === 'figure' && !properties.id) properties.id = `figure-${chapter.number}-${figures.length + 1}`;
    const firstAsset = assets.length;
    const children = node.children.flatMap(clean);
    if (tagName === 'figure') {
      if (assets.length === firstAsset) throw new Error(`Figure without SVG: ${chapter.route}`);
      const caption = children.find(child => child.tagName === 'figcaption');
      figures.push({ id: properties.id, caption: normalized(toText(caption ?? children[0])) });
    }
    if (tagName === 'summary') return [el('p', properties, [el('strong', {}, children)])];
    return [el(tagName === 'details' ? 'section' : tagName, properties, children)];
  }
  const textBefore = originalText(source);
  const tree = el('div', {}, source.children.flatMap(clean));
  assertCyberContentModel(tree);
  if (proseText(tree) !== textBefore) throw new Error(`Body text changed during conversion: ${chapter.route}`);
  const ids = new Set();
  for (const node of nodes(tree)) {
    const id = node.properties?.id;
    if (!id) continue;
    if (ids.has(id)) throw new Error(`Duplicate chapter identifier ${id}: ${chapter.route}`);
    ids.add(id);
  }
  const sourceIds = nodes(tree).filter(node => node.tagName === 'li' && /^source-/iu.test(node.properties.id))
    .map(node => node.properties.id);
  const headings = nodes(tree).filter(node => /^h[2-6]$/u.test(node.tagName) && node.properties.id)
    .map(node => ({ title: normalized(toText(node)), href: `text/${chapter.chapter}#${node.properties.id}` }));
  return { chapter, tree, assets, figures, ids, sourceIds, headings, textSha256: hash(textBefore) };
}

function chapterLinks(rendered, routes, glossary) {
  for (const node of nodes(rendered.tree)) {
    if (node.tagName !== 'a') continue;
    const href = node.properties.href;
    const url = new URL(href, site + rendered.chapter.route);
    if (href.startsWith('#')) {
      if (!rendered.ids.has(decodeURIComponent(url.hash.slice(1)))) {
        throw new Error(`Unresolved source fragment ${href}: ${rendered.chapter.route}`);
      }
    } else if (url.origin === site && routes.has(url.pathname) && !url.search) {
      const target = routes.get(url.pathname);
      if (url.hash && !target.ids.has(decodeURIComponent(url.hash.slice(1)))) {
        throw new Error(`Unresolved linked chapter fragment: ${href}`);
      }
      node.properties.href = target.chapter.chapter + (url.hash || `#chapter-${target.chapter.number}`);
    } else if (url.origin === site && !url.hash && !url.search && glossary.has(url.pathname)) {
      node.properties.href = `glossary.xhtml#glossary-${glossary.get(url.pathname)}`;
    } else if (!/^[a-z][a-z0-9+.-]*:/iu.test(href)) {
      node.properties.href = url.href;
    }
  }
}

function validateBook(book, lang) {
  if (book.lang !== lang || book.directory !== directories[lang] || book.chapters.length !== 14 ||
      book.cover !== `/publications/${book.directory}-cover.jpg` ||
      !/^\d{4}-\d{2}-\d{2}$/u.test(book.date) || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/u.test(book.modified) ||
      !/^urn:uuid:[0-9a-f-]{36}$/u.test(book.id)) throw new Error(`Invalid edition: ${lang}`);
  for (const [index, chapter] of book.chapters.entries()) {
    const expectedRoute = `${lang === 'fr' ? '/posts/' : '/en/analysis/'}${chapter.slug}/`;
    if (!/^[a-z0-9-]+$/u.test(chapter.slug) || !sourceFile.test(chapter.file) || chapter.route !== expectedRoute ||
        chapter.number !== index + 13 || chapter.chapter !== `ch${String(index + 2).padStart(3, '0')}.xhtml`) {
      throw new Error(`Invalid chapter metadata: ${chapter.slug}`);
    }
  }
}

function prose(book, paragraphs) {
  const knownIds = new Set((book.synthesisSources ?? []).map(source => source.id));
  return (paragraphs ?? []).map(paragraph => `<p>${xml(paragraph).replace(/\[(B\d{2})\]/gu, (_, id) => {
    if (!knownIds.has(id)) throw new Error(`Unknown synthesis citation: ${id}`);
    return `<a href="synthesis-sources.xhtml#book-source-${id}">[${id}]</a>`;
  })}</p>`).join('\n');
}

function sourceLink(rendered, reference, lang) {
  const page = rendered.find(entry => entry.chapter.number === reference.chapter);
  const id = `source-${reference.reference}`;
  if (!page?.sourceIds.includes(id)) throw new Error(`Unresolved chapter reference: ${reference.chapter}/${id}`);
  const notice = nodes(page.tree).find(node => node.properties?.id === id);
  if (reference.url && !nodes(notice).some(node => node.tagName === 'a' && node.properties.href === reference.url)) {
    throw new Error(`Chapter reference URL drift: ${reference.chapter}/${id}`);
  }
  return `<a href="${page.chapter.chapter}#${xml(id)}">${lang === 'fr' ? 'Chapitre' : 'Chapter'} ${reference.chapter}, ${xml(reference.reference)}</a>`;
}

function sourceRelationships(source, rendered, lang) {
  if (source.references?.length) {
    return `<p>${source.references.map(reference => sourceLink(rendered, reference, lang)).join(' · ')}</p>`;
  }
  if (!source.chapters?.length) return '';
  const links = source.chapters.map(number => {
    const chapter = rendered.find(entry => entry.chapter.number === number)?.chapter;
    if (!chapter) throw new Error(`Unresolved synthesis chapter: ${number}`);
    return `<a href="${chapter.chapter}#chapter-${number}">${number}</a>`;
  });
  return `<p>${lang === 'fr' ? 'Chapitres' : 'Chapters'} · ${links.join(' · ')}</p>`;
}

function checkedXml(content) {
  if (XMLValidator.validate(content) !== true) throw new Error('Invalid EPUB XML');
  return content;
}

export async function generateNvidiaVolumeTwoEpub(snapshotRoot, sha, lang) {
  if (!/^[a-f0-9]{40}$/u.test(sha)) throw new Error('Expected the exact deployed source SHA used for snapshots');
  if (!Object.hasOwn(directories, lang)) throw new Error('Unsupported edition language');
  const { nvidiaVolumeTwoText } = await import('../src/publication-text/nvidia-volume-two.mjs');
  const book = { ...nvidiaVolumeTwoEditions[lang], ...nvidiaVolumeTwoText[lang] };
  validateBook(book, lang);
  const tr = (fr, en) => lang === 'fr' ? fr : en;
  const capture = JSON.parse(fileBytes(join(snapshotRoot, 'manifest.json')).toString('utf8'));
  if (capture.baseSha !== sha || !Array.isArray(capture.chapters) || capture.chapters.length !== 28 ||
      new Date(capture.stop).toISOString() !== new Date(book.modified).toISOString()) throw new Error('Incorrect snapshot manifest or editorial cutoff');
  const rendered = book.chapters.map(chapter => {
    const snapshot = fileBytes(join(snapshotRoot, lang, `${chapter.slug}.html`), 5_000_000);
    const matches = capture.chapters.filter(item => item.lang === lang && item.slug === chapter.slug);
    if (matches.length !== 1 || matches[0].number !== chapter.number || matches[0].url !== site + chapter.route ||
        matches[0].sha256 !== hash(snapshot)) throw new Error(`Snapshot provenance drift: ${chapter.route}`);
    const source = fileBytes(join(root, chapter.file));
    const { frontmatter } = parseFrontmatter(source.toString('utf8'));
    if (frontmatter.title !== chapter.title || (chapter.sha256 && chapter.sha256 !== hash(source))) {
      throw new Error(`Approved article changed: ${chapter.file}`);
    }
    const result = renderNvidiaVolumeTwoBody(extractNvidiaVolumeTwoBody(snapshot.toString('utf8'), chapter), chapter);
    if (result.figures.length !== chapter.figureCount || result.assets.length !== chapter.figureCount ||
        result.sourceIds.length !== chapter.sourceCount) {
      throw new Error(`Unexpected source or figure inventory: ${chapter.route} (${result.figures.length} figures, ${result.sourceIds.length} sources)`);
    }
    return { ...result, source, frontmatter, snapshotSha256: hash(snapshot), retrievedAt: matches[0].retrievedAt };
  });
  const routes = new Map(rendered.map(entry => [entry.chapter.route, entry]));
  const glossary = new Map((book.glossary ?? []).filter(entry => entry.path).map(entry => [entry.path, entry.slug]));
  for (const chapter of rendered) chapterLinks(chapter, routes, glossary);

  const cover = fileBytes(join(root, 'public', book.cover));
  const coverInfo = await sharp(cover).metadata();
  if (coverInfo.format !== 'jpeg' || coverInfo.width !== 1024 || coverInfo.height !== 1536) throw new Error('Invalid edition cover');
  const media = rendered.flatMap(entry => entry.assets);
  const documents = [];
  const writeChapter = (name, title, body, type = 'bodymatter') => {
    const output = xhtmlDocument(book, { title, body, bodyType: type });
    documents.push({ id: name, path: `text/${name}.xhtml`, mime: 'application/xhtml+xml', content: checkedXml(output) });
  };
  const section = (id, title, body) => `<section id="${id}"><h1>${xml(title)}</h1>${body}</section>`;
  const contents = tr('Sommaire', 'Contents');
  const nav = [];
  function addSection(id, title, body, type) {
    writeChapter(id, title, section(id, title, body), type);
    nav.push({ title, href: `text/${id}.xhtml#${id}` });
  }
  writeChapter('cover', tr('Couverture', 'Cover'), `<div class="cover-page"><img src="../media/cover.jpg" alt="${xml(book.title)}" /></div>`, 'frontmatter');
  writeChapter('half_title', book.title, `<section class="half-title"><p class="chapter-kicker">${xml(book.volumeLabel)}</p><h1>${xml(book.title)}</h1></section>`, 'frontmatter');
  writeChapter('title_page', book.title, `<section class="titlepage"><p class="chapter-kicker">${xml(book.volumeLabel)}</p><h1>${xml(book.title)}</h1><p class="subtitle">${xml(book.subtitle)}</p><p class="author">l0g · ${xml(book.date)}</p></section>`, 'frontmatter');
  addSection('reader-guide', book.readerGuideTitle ?? tr('Pour lire ce tome', 'How to read this volume'), prose(book, book.readerGuide), 'frontmatter');
  addSection('method', book.methodTitle ?? tr('Méthode', 'Method'), prose(book, book.method), 'frontmatter');
  addSection('ch001', book.introductionTitle ?? 'Introduction', prose(book, book.introduction));
  for (const { chapter, tree, headings, frontmatter } of rendered) {
    const id = `chapter-${chapter.number}`;
    const published = xml(String(frontmatter.pubDate));
    const modified = frontmatter.updatedDate && frontmatter.updatedDate !== frontmatter.pubDate
      ? ` · ${tr('Révision', 'Revised')} ${xml(String(frontmatter.updatedDate))}` : '';
    const meta = `<p class="chapter-kicker">${tr('Volet', 'Part')} ${chapter.number}</p><p class="chapter-meta">${tr('Publié le', 'Published')} ${published}${modified} · <a href="${xml(site + chapter.route)}">${tr('Article original', 'Original article')}</a></p>`;
    writeChapter(chapter.chapter.slice(0, -6), chapter.title, section(id, chapter.title, meta + serialize(tree)));
    nav.push({ title: chapter.title, href: `text/${chapter.chapter}#${id}`, children: headings });
  }
  addSection('conclusion', book.conclusionTitle ?? 'Conclusion', prose(book, book.conclusion), 'backmatter');
  const glossaryContent = (book.glossary ?? []).map(item => `<section class="glossary-entry" id="glossary-${xml(item.slug)}"><h2>${xml(item.title)}</h2>${prose(book, [item.definition])}${item.sources?.length ? `<p>${item.sources.map(reference => reference.reference ? sourceLink(rendered, reference, lang) : externalLink(reference.url, reference.title)).join(' · ')}</p>` : ''}</section>`).join('');
  addSection('glossary', book.glossaryTitle ?? tr('Glossaire', 'Glossary'), glossaryContent, 'backmatter');
  const sourcesContent = (book.synthesisSources ?? []).map(source => `<li id="book-source-${xml(source.id)}"><p class="source-meta">${xml(source.id)}${source.publication ? ` · ${tr('Publication', 'Published')} ${xml(source.publication)}` : ''}${source.consultation ? ` · ${tr('Consultation', 'Accessed')} ${xml(source.consultation)}` : ''}</p>${externalLink(source.url, source.title)}<p>${xml(source.scope ?? source.detail ?? '')}</p>${sourceRelationships(source, rendered, lang)}</li>`).join('');
  addSection('synthesis-sources', book.synthesisSourcesTitle ?? tr('Sources de la synthèse', 'Synthesis sources'), `<ol class="sources-list">${sourcesContent}</ol>`, 'backmatter');
  const figureLinks = rendered.flatMap(entry => entry.figures.map(figure => `<li><a href="${entry.chapter.chapter}#${xml(figure.id)}">${xml(figure.caption || entry.chapter.title)}</a></li>`));
  addSection('figures', tr('Table des infographies', 'List of infographics'), `<ol>${figureLinks.join('')}</ol>`, 'backmatter');
  addSection('colophon', book.colophonTitle ?? 'Colophon', prose(book, book.colophon) + `<p class="source-meta">${tr('Arrêté éditorial', 'Editorial cutoff')} · ${xml(book.modified)} (UTC).</p><p>${externalLink(site + book.path, tr('Édition en ligne', 'Online edition'))}</p>`, 'backmatter');
  const licences = cyberFontFiles.map(font => `<h2>${xml(font.family)}</h2><pre class="license-text">${xml(readFileSync(join(root, 'public/fonts/jlr', font.license), 'utf8'))}</pre>`).join('');
  addSection('licenses', tr('Droits et licences', 'Rights and licences'), `<p>l0g · <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a></p><p>${tr('Les citations, documents, photographies et marques de tiers conservent leurs droits respectifs.', 'Third-party quotations, documents, photographs and trademarks retain their respective rights.')}</p>${licences}`, 'backmatter');

  const navList = items => `<ol>${items.map(item => `<li><a href="${xml(item.href)}">${xml(item.title)}</a>${item.children?.length ? navList(item.children) : ''}</li>`).join('')}</ol>`;
  const navBody = `<nav epub:type="toc" id="toc"><h1>${contents}</h1>${navList(nav)}</nav><nav epub:type="landmarks"><h2>${tr('Repères', 'Landmarks')}</h2><ol><li><a epub:type="cover" href="text/cover.xhtml">${tr('Couverture', 'Cover')}</a></li><li><a epub:type="bodymatter" href="text/ch001.xhtml">Introduction</a></li><li><a epub:type="glossary" href="text/glossary.xhtml">${tr('Glossaire', 'Glossary')}</a></li></ol></nav>`;
  const toc = checkedXml(xhtmlDocument(book, { title: contents, body: navBody, bodyType: 'frontmatter' }).replace('../styles/stylesheet1.css', 'styles/stylesheet1.css'));
  const provenance = {
    schemaVersion: 1, edition: book.id, lang, modified: book.modified, deployedSourceSha: sha,
    captureStart: capture.start, captureStop: capture.stop,
    sourceArticles: rendered.map(entry => ({
      number: entry.chapter.number, file: entry.chapter.file, canonical: site + entry.chapter.route,
      sourceSha256: hash(entry.source), snapshotSha256: entry.snapshotSha256, bodyTextSha256: entry.textSha256, retrievedAt: entry.retrievedAt,
      published: String(entry.frontmatter.pubDate), updated: String(entry.frontmatter.updatedDate ?? entry.frontmatter.pubDate),
      references: entry.sourceIds, figures: entry.assets.map(({ filename, sourceSha256, epubSha256 }) => ({ filename, sourceSha256, epubSha256 })),
    })),
    coverSha256: hash(cover),
  };
  const entries = [
    { id: 'nav', path: 'nav.xhtml', mime: 'application/xhtml+xml', properties: 'nav', content: toc },
    { id: 'stylesheet', path: 'styles/stylesheet1.css', mime: 'text/css', content: offlineCss },
    { id: 'provenance', path: 'provenance.json', mime: 'application/json', content: JSON.stringify(provenance, null, 2) + '\n' },
    { id: 'cover-image', path: 'media/cover.jpg', mime: 'image/jpeg', properties: 'cover-image', content: cover },
    ...documents,
    ...media.map((asset, index) => ({ id: `svg-${index + 1}`, path: `media/${asset.filename}`, mime: 'image/svg+xml', content: asset.data })),
    ...cyberFontFiles.flatMap((font, index) => [
      { id: `font-${index}`, path: `fonts/${font.name}`, mime: 'font/woff2', file: join(root, font.source) },
      { id: `font-license-${index}`, path: `fonts/${font.license}`, mime: 'text/plain', file: join(root, 'public/fonts/jlr', font.license) },
    ]),
  ];
  const spine = documents.map(document => document.id);
  spine.splice(3, 0, 'nav');
  const manifest = entries.map(entry => `<item id="${entry.id}" href="${entry.path}" media-type="${entry.mime}"${entry.properties ? ` properties="${entry.properties}"` : ''}/>`).join('');
  const epubMetadata = `<metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${book.id}</dc:identifier><dc:title>${xml(book.title)}</dc:title><dc:language>${lang}</dc:language><dc:creator>l0g</dc:creator><dc:publisher>l0g.fr</dc:publisher><dc:date>${book.date}</dc:date><dc:description>${xml(book.description)}</dc:description><dc:source>${xml(site + book.path)}</dc:source><dc:rights>Creative Commons Attribution 4.0 International</dc:rights><meta property="dcterms:modified">${book.modified}</meta><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta></metadata>`;
  const opf = checkedXml(`<?xml version="1.0" encoding="UTF-8"?><package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="book-id" xml:lang="${lang}" prefix="schema: http://schema.org/">${epubMetadata}<manifest>${manifest}</manifest><spine>${spine.map(id => `<itemref idref="${id}"/>`).join('')}</spine></package>`);
  const directory = join(root, 'src/epub', book.directory);
  rmSync(directory, { recursive: true, force: true });
  for (const path of ['META-INF', 'EPUB/text', 'EPUB/media', 'EPUB/fonts', 'EPUB/styles']) mkdirSync(join(directory, path), { recursive: true });
  writeFileSync(join(directory, 'mimetype'), 'application/epub+zip');
  writeFileSync(join(directory, 'META-INF/container.xml'), '<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="EPUB/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>');
  writeFileSync(join(directory, 'EPUB/content.opf'), opf);
  for (const entry of entries) {
    const output = join(directory, 'EPUB', entry.path);
    if (entry.file) copyFileSync(entry.file, output);
    else writeFileSync(output, entry.content);
  }
  console.log(`${book.title}: ${rendered.length} chapters, ${rendered.reduce((sum, item) => sum + item.sourceIds.length, 0)} source notices, ${figureLinks.length} figures and ${media.length} SVG scenes.`);
}

function externalLink(href, title) {
  assertCyberLink(href);
  if (!/^https?:\/\//u.test(href)) throw new Error(`Expected an external canonical URL: ${href}`);
  return `<a href="${xml(href)}">${xml(title ?? href)}</a>`;
}

const offlineCss = `${cyberEpubCss}
h1,h2,h3,h4{hyphens:none;overflow-wrap:normal;word-break:normal}.source-meta{display:block}.sources-list{padding-left:1.25em}.sources-list li{margin-bottom:1.2em}.sources-list section{margin:.4em 0 0}.sources-list section p{margin:.3em 0}
.infographic-block{break-inside:auto}.infographic-image{margin:0 auto;max-width:30em}
`;

// The source tree is reproducible from the two sets of saved, canonical HTML
// pages and the named deployed SHA. Run this command offline in that checkout.
// Keep the acquisition-time source.env checks before/after the capture. CI
// packages the checked-in edition with build-epub.mjs and never fetches pages.
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [snapshotRoot, sha] = process.argv.slice(2);
  if (!snapshotRoot || !sha || process.argv.length !== 4) {
    throw new Error('Usage: node scripts/generate-nvidia-volume-two-epub.mjs <snapshot-directory> <deployed-sha>');
  }
  for (const lang of ['fr', 'en']) await generateNvidiaVolumeTwoEpub(resolve(snapshotRoot), sha, lang);
}
