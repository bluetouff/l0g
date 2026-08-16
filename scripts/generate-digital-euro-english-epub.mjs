import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import GithubSlugger from 'github-slugger';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const SOURCE_ROOT = join(ROOT, 'src/epub/digital-euro');
const EPUB_ROOT = join(SOURCE_ROOT, 'EPUB');
const MEDIA_ROOT = join(EPUB_ROOT, 'media');
const TEXT_ROOT = join(EPUB_ROOT, 'text');
const TEMPLATE_ROOT = join(ROOT, 'src/epub/l-argent-d-epstein');
const COVER_ART = join(ROOT, 'src/epub-assets/euro-numerique-cover-art.png');
const PUBLICATION_ROOT = join(ROOT, 'public/publications');
const SITE = 'https://l0g.fr';
const BOOK_URL = `${SITE}/en/publications/digital-euro/`;
const BOOK_ID = 'urn:uuid:e968da9c-070c-55b7-b2dc-2b17f21b9ba4';
const MODIFIED = '2026-08-16T10:00:00Z';

const articles = [
  ['digital-euro-1-the-euro-that-changes-its-debtor.mdx', 'digital-euro-1-the-euro-that-changes-its-debtor', '13 August 2026', 1],
  ['digital-euro-2-699-billion-anatomy-stress-test.mdx', 'digital-euro-2-699-billion-anatomy-stress-test', '13 August 2026', 2],
  ['digital-euro-3-as-private-as-cash.mdx', 'digital-euro-3-as-private-as-cash', '14 August 2026', 3],
  ['digital-euro-4-programmable-money-legal-boundary.mdx', 'digital-euro-4-programmable-money-legal-boundary', '14 August 2026', 4],
  ['digital-euro-5-price-of-sovereignty.mdx', 'digital-euro-5-price-of-sovereignty', '14 August 2026', 5],
  ['digital-euro-6-who-controls-the-machine.mdx', 'digital-euro-6-who-controls-the-machine', '15 August 2026', 6],
].map(([file, slug, date, number]) => ({ file, route: `/en/analysis/${slug}/`, date, number, chapter: `ch${String(number + 1).padStart(3, '0')}.xhtml` }));

const chapterByRoute = new Map(articles.map((article) => [article.route, `${article.chapter}#article-${article.number}`]));

function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

function plainText(value) {
  return toText(fromHtml(String(value), { fragment: true })).trim();
}

function frontmatter(source, key) {
  const block = source.match(/^---\n([\s\S]*?)\n---\n/u)?.[1] ?? '';
  const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'mu'));
  if (!match) return '';
  const value = match[1].trim();
  return value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1).replaceAll('\\"', '"') : value;
}

function markdownBody(source) {
  return source
    .replace(/^---\n[\s\S]*?\n---\n/u, '')
    .replace(/^import\s+[^\n]+\n/gmu, '')
    .replace(/<style>\{`[\s\S]*?`\}<\/style>/gu, '')
    .replace(
      /<DigitalEuroCostSimulator\s+lang="en"\s*\/>/gu,
      '> **Interactive simulator.** The cost model remains available on [l0g.fr](/en/tools/digital-euro-cost/). This edition preserves the assumptions, formulas and chapter analysis, but embeds no script.',
    );
}

function xhtmlDocument({ title, body, bodyType = 'bodymatter' }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en"><head><meta charset="utf-8" /><meta name="generator" content="l0g" /><title>${escapeXml(title)}</title><link rel="stylesheet" type="text/css" href="../styles/stylesheet1.css" /></head><body epub:type="${bodyType}">${body}</body></html>\n`;
}

function sanitizeSvg(svg, label) {
  if (/<(?:script|foreignObject|iframe|object|embed)\b/iu.test(svg)) throw new Error(`${label}: contenu SVG actif interdit`);
  if (/\son[a-z]+\s*=/iu.test(svg) || /(?:href|src)\s*=\s*["'](?:https?:|data:|javascript:)/iu.test(svg)) throw new Error(`${label}: charge utile SVG interdite`);
  let clean = svg.replace(/\sstyle="padding-bottom:[^"]+"/gu, '');
  if (!/\sxmlns=/u.test(clean)) clean = clean.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  return `<?xml version="1.0" encoding="UTF-8"?>\n${clean}\n`;
}

function rewriteLinks(html) {
  return html.replace(/href="([^"]+)"/gu, (full, href) => {
    if (href.startsWith('#')) return full;
    const [path, fragment = ''] = href.split('#');
    const canonicalPath = path.endsWith('/') ? path : `${path}/`;
    const local = chapterByRoute.get(canonicalPath);
    if (local) return `href="${local.split('#')[0]}${fragment ? `#${fragment}` : local.slice(local.indexOf('#'))}"`;
    if (href.startsWith('/')) return `href="${SITE}${href}"`;
    return full;
  });
}

function sectionHeadings(html, articleNumber) {
  const matches = [...html.matchAll(/<h2>([\s\S]*?)<\/h2>/gu)];
  if (!matches.length) return { html, headings: [] };
  const slugger = new GithubSlugger();
  const sections = matches.map((match, index) => {
    const label = plainText(match[1]);
    const id = `c${articleNumber}-${slugger.slug(label)}`;
    const content = html.slice(match.index + match[0].length, matches[index + 1]?.index ?? html.length);
    return { id, label, html: `<section id="${id}" class="level2"><h2>${match[1]}</h2>${content}</section>` };
  });
  return { html: `${html.slice(0, matches[0].index)}${sections.map((section) => section.html).join('\n')}`, headings: sections };
}

function extractInfographics(html, articleNumber, offset) {
  let next = offset;
  const rewritten = html.replace(/<svg\b[\s\S]*?<\/svg>/gu, (svg) => {
    const fileName = `file${next}.svg`;
    const title = plainText(svg.match(/<title[^>]*>([\s\S]*?)<\/title>/u)?.[1] ?? `Infographic ${next + 1}`);
    const description = plainText(svg.match(/<desc[^>]*>([\s\S]*?)<\/desc>/u)?.[1] ?? svg.match(/aria-label="([^"]+)"/u)?.[1] ?? title);
    writeFileSync(join(MEDIA_ROOT, fileName), sanitizeSvg(svg, `article ${articleNumber}, ${fileName}`));
    next += 1;
    return `<img src="../media/${fileName}" class="infographic-image" alt="${escapeXml(description)}" />`;
  });
  return { html: rewritten.replace(/<figure class="infographic" style="[^"]*">/gu, '<figure class="infographic">'), next };
}

async function renderArticle(article, offset) {
  const sourcePath = join(ROOT, 'src/content/posts-en', article.file);
  const source = readFileSync(sourcePath, 'utf8');
  const title = frontmatter(source, 'title');
  const description = frontmatter(source, 'description');
  if (!title || !description) throw new Error(`${basename(sourcePath)}: missing title or description`);
  const rendered = String(await unified().use(remarkParse).use(remarkGfm).use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw).use(rehypeStringify, { allowDangerousHtml: true }).process(markdownBody(source)));
  const figures = extractInfographics(rendered, article.number, offset);
  const sectioned = sectionHeadings(rewriteLinks(figures.html), article.number);
  const shortTitle = title.replace(/^Digital euro, \d\/6: /iu, '');
  const chapterTitle = `${shortTitle.charAt(0).toLocaleUpperCase('en-US')}${shortTitle.slice(1)}`;
  const body = `<section id="article-${article.number}" class="level1 article-chapter"><p class="chapter-kicker">Part ${article.number} of 6</p><h1>${escapeXml(chapterTitle)}</h1><p class="chapter-dek">${escapeXml(description)}</p><p class="chapter-meta">Published ${article.date} · <a href="${SITE}${article.route}">Canonical article on l0g.fr</a></p>${sectioned.html}</section>`;
  writeFileSync(join(TEXT_ROOT, article.chapter), xhtmlDocument({ title, body }));
  return { ...article, title, description, headings: sectioned.headings.map(({ id, label }) => ({ id, label })), next: figures.next };
}

function coverSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2560" viewBox="0 0 1600 2560"><defs><linearGradient id="top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b10" stop-opacity=".98"/><stop offset=".66" stop-color="#070b10" stop-opacity=".88"/><stop offset="1" stop-color="#070b10" stop-opacity="0"/></linearGradient><linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b10" stop-opacity="0"/><stop offset="1" stop-color="#070b10" stop-opacity=".96"/></linearGradient></defs><rect width="1600" height="1040" fill="url(#top)"/><rect y="1980" width="1600" height="580" fill="url(#bottom)"/><rect x="76" y="76" width="1448" height="2408" rx="2" fill="none" stroke="#567080" stroke-width="3" opacity=".82"/><path d="M112 210H1488" stroke="#314655" stroke-width="2"/><text x="112" y="158" fill="#67decf" font-family="Courier New,monospace" font-size="40">l0g_ / ENQUÊTE EN SOURCES OUVERTES</text><text x="112" y="284" fill="#9eabb8" font-family="Courier New,monospace" font-size="27" font-weight="700" letter-spacing="2">SIX VOLETS  ·  VINGT-DEUX INFOGRAPHIES</text><g font-family="Arial,Helvetica,sans-serif" font-weight="850" fill="#f5f2ec"><text x="106" y="484" font-size="132">L’EURO</text><text x="106" y="654" font-size="178">NUMÉRIQUE</text></g><rect x="112" y="716" width="732" height="10" fill="#e8ad49"/><g font-family="Arial,Helvetica,sans-serif" font-size="40" font-weight="750" fill="#d9e0e7" letter-spacing="1"><text x="112" y="790">BILANS · DONNÉES · DROIT</text><text x="112" y="848">COÛTS · INFRASTRUCTURE</text></g><g font-family="Courier New,monospace"><rect x="112" y="2200" width="458" height="54" rx="27" fill="#0b1d21" stroke="#62dfd0"/><text x="341" y="2236" text-anchor="middle" fill="#86eadf" font-size="25" font-weight="700">ÉTAT DU DOSSIER · 16.08.2026</text><text x="112" y="2352" fill="#c0c9d1" font-size="30">Ce qui changerait vraiment.</text><text x="112" y="2402" fill="#8d9aa7" font-size="30">Ce que le projet ne décide pas encore.</text><text x="112" y="2456" fill="#74828e" font-size="27">l0g.fr  ·  2026</text></g></svg>`;
}

function englishCoverSvg() {
  return coverSvg()
    .replace('ENQUÊTE EN SOURCES OUVERTES', 'OPEN-SOURCE INVESTIGATION')
    .replace('SIX VOLETS  ·  VINGT-DEUX INFOGRAPHIES', 'SIX PARTS  ·  TWENTY-THREE INFOGRAPHICS')
    .replace('L’EURO', 'THE DIGITAL')
    .replace('NUMÉRIQUE', 'EURO')
    .replace('BILANS · DONNÉES · DROIT', 'BALANCE SHEETS · DATA · LAW')
    .replace('COÛTS · INFRASTRUCTURE', 'COSTS · INFRASTRUCTURE')
    .replace('ÉTAT DU DOSSIER', 'DOSSIER STATUS')
    .replace('Ce qui changerait vraiment.', 'What would actually change.')
    .replace('Ce que le projet ne décide pas encore.', 'What the project has not decided yet.');
}

const ENGLISH_INTRO = `<section id="introduction" class="level1"><p class="chapter-kicker">Introduction</p><h1>Investigating a currency that does not yet exist</h1><p class="chapter-dek">An open-source investigation into the digital euro, its public record and the decisions that record cannot yet reveal.</p><p>The digital euro already attracts confident claims. It would eliminate cash, enable surveillance of every purchase, rescue European sovereignty or destabilise banks. The problem is that the object described by those claims does not yet exist. The regulation has not been adopted, no issuance decision has been made and several decisive parameters remain under negotiation.</p><p>How can one investigate a system that is absent from the real world? By treating the project as infrastructure under construction, not as a communication promise. The starting point is the trail it already leaves: legislative texts, negotiating mandates, financial-stability reports, draft rules, procurement notices, cost estimates, framework agreements, hearings, letters and technical documents.</p><h2 id="open-sources">What “open sources” means here</h2><p>An open source is not merely a page available without a password. It is a record whose origin, date, status and scope the reader can verify. In this investigation, documents from the European Central Bank, the Council of the European Union, the Commission, Parliament and other public authorities form the first level of evidence. Academic and professional work is used to test a method or illuminate an angle. Estimates commissioned by an interested party remain attributed to that party.</p><p>This hierarchy avoids placing a proposed regulatory article, a scenario submitted to banks, a procurement ceiling and actual expenditure on the same evidentiary level. All are published figures. They do not describe the same reality or the same degree of decision.</p><h2 id="investigation-method">The investigation method</h2><p>The six parts follow the digital euro layer by layer. The first identifies the debtor behind the monetary unit. The second reconstructs the ECB banking stress test. The third maps data and the possibilities for linking it. The fourth separates programmable money, conditional payments and legal controls. The fifth compares costs with divergent scopes. The final part enters procurement, code, keys, devices and reversibility.</p><p>Each chapter applies the same discipline. An adopted fact is distinguished from a proposal. A test value is not presented as a final choice. A contractual ceiling is not turned into expenditure. The absence of a public document is described as a verification limit, not as evidence of a hidden system. When a claim cannot be reproduced from the available corpus, the gap remains visible.</p><h2 id="investigation-limits">What this investigation cannot establish</h2><p>Open sources do not provide access to the bank-level prudential data used in the stress test. They do not disclose every subcontractor, exit clause, allocation of code, key-custody arrangement or final antifraud data field. Nor can they predict adoption, usage or the system’s total cost.</p><p>These limits do not reduce the investigation to commentary on documents. They define its result. The public corpus can show what the architecture would move, who would see which data, where dependencies would lie and which questions still require a verifiable answer.</p><aside class="reading-guide" id="reading-guide"><h2>How to read this edition</h2><ul><li>Established facts are separated from test assumptions and unresolved choices.</li><li>Each chapter preserves its clickable sources and limitations.</li><li>All 23 infographics include text alternatives.</li><li>The chapter 5 simulator remains available on the site, with no tracking.</li></ul></aside></section>`;

const ENGLISH_CONCLUSION = `<section id="conclusion" class="level1"><h1>Conclusion: public money, an architecture to control</h1><p>The six parts converge on one finding: the public nature of the claim is not enough to describe the system. The holding limit governs movement between balance sheets, privacy depends on data separation, non-programmability does not remove legal controls, and sovereignty is measured by the ability to take over each component.</p><p>The final regulation, holding limit, fees, several offline parameters and part of the contractual architecture remain open. These unknowns are not a gap to be filled with prediction. They are the exact state of the dossier on 16 August 2026.</p></section>`;

function writeStructuralFiles(rendered) {
  writeFileSync(join(TEXT_ROOT, 'ch001.xhtml'), xhtmlDocument({ title: 'Introduction', body: ENGLISH_INTRO }));
  writeFileSync(join(TEXT_ROOT, 'ch008.xhtml'), xhtmlDocument({ title: 'Conclusion', body: ENGLISH_CONCLUSION }));
  const links = rendered.map((article) => `<li><a href="${SITE}${article.route}">${escapeXml(article.title)}</a></li>`).join('');
  const about = `<section id="about" class="level1"><h1>About this edition</h1><p class="colophon"><strong>The Digital Euro</strong> brings together six investigations published by l0g from 13 to 15 August 2026. This EPUB 3 edition was prepared on 16 August 2026 with an explicit reading order, a structured table of contents and 22 adapted infographics.</p><h2>Canonical articles</h2><ol class="original-articles">${links}</ol><p>Texts licensed under <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a>.</p></section>`;
  writeFileSync(join(TEXT_ROOT, 'ch009.xhtml'), xhtmlDocument({ title: 'About this edition', body: about }));
}

function entries(rendered) {
  return [{ title: 'Introduction', href: 'text/ch001.xhtml', children: [{ title: 'How to read this edition', href: 'text/ch001.xhtml#reading-guide' }] }, ...rendered.map((article) => ({ title: article.title, href: `text/${article.chapter}`, children: article.headings.map((heading) => ({ title: heading.label, href: `text/${article.chapter}#${heading.id}` })) })), { title: 'Conclusion', href: 'text/ch008.xhtml' }, { title: 'About this edition', href: 'text/ch009.xhtml' }];
}

function writeNavigation(rendered) {
  const toc = entries(rendered);
  const list = (items) => `<ol>${items.map((item) => `<li><a href="${item.href}">${escapeXml(item.title)}</a>${item.children?.length ? list(item.children) : ''}</li>`).join('')}</ol>`;
  writeFileSync(join(EPUB_ROOT, 'nav.xhtml'), `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en"><head><meta charset="utf-8"/><title>The Digital Euro</title><link rel="stylesheet" href="styles/stylesheet1.css" type="text/css"/></head><body epub:type="frontmatter"><nav epub:type="toc" id="toc"><h1>The Digital Euro</h1>${list(toc)}</nav><nav epub:type="landmarks" hidden="hidden"><ol><li><a href="text/cover.xhtml" epub:type="cover">Cover</a></li><li><a href="text/title_page.xhtml" epub:type="titlepage">Title page</a></li></ol></nav></body></html>\n`);
  let order = 0;
  const points = (items) => items.map((item) => { order += 1; const current = order; return `<navPoint id="navPoint-${current}" playOrder="${current}"><navLabel><text>${escapeXml(item.title)}</text></navLabel><content src="${item.href}"/>${item.children?.length ? points(item.children) : ''}</navPoint>`; }).join('');
  writeFileSync(join(EPUB_ROOT, 'toc.ncx'), `<?xml version="1.0" encoding="UTF-8"?><ncx version="2005-1" xmlns="http://www.daisy.org/z3986/2005/ncx/"><head><meta name="dtb:uid" content="${BOOK_ID}"/><meta name="dtb:depth" content="2"/></head><docTitle><text>The Digital Euro</text></docTitle><navMap>${points(toc)}</navMap></ncx>\n`);
}

function writePackage(infographicCount) {
  const chapters = Array.from({ length: 9 }, (_, i) => String(i + 1).padStart(3, '0'));
  const manifest = chapters.map((ch) => `<item id="ch${ch}" href="text/ch${ch}.xhtml" media-type="application/xhtml+xml"/>`).join('');
  const spine = chapters.map((ch) => `<itemref idref="ch${ch}"/>`).join('');
  const media = Array.from({ length: infographicCount }, (_, i) => `<item id="file${i}" href="media/file${i}.svg" media-type="image/svg+xml"/>`).join('');
  writeFileSync(join(EPUB_ROOT, 'content.opf'), `<?xml version="1.0" encoding="UTF-8"?><package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id" prefix="schema: http://schema.org/"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${BOOK_ID}</dc:identifier><dc:title>The Digital Euro</dc:title><dc:language>en</dc:language><dc:creator>l0g</dc:creator><dc:date>2026-08-16</dc:date><dc:subject>digital euro</dc:subject><dc:subject>European Central Bank</dc:subject><dc:subject>payments</dc:subject><dc:subject>sovereignty</dc:subject><dc:description>Six investigations into the monetary nature, banking stability, data, law, costs and infrastructure of the digital euro.</dc:description><dc:publisher>l0g.fr</dc:publisher><dc:rights>Creative Commons Attribution 4.0 International (CC BY 4.0).</dc:rights><dc:source>${BOOK_URL}</dc:source><meta property="dcterms:modified">${MODIFIED}</meta><meta name="cover" content="cover-image"/><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityHazard">none</meta><meta property="schema:accessibilitySummary">Explicit reading order, structured table of contents and text descriptions for all infographics.</meta></metadata><manifest><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="css" href="styles/stylesheet1.css" media-type="text/css"/><item id="cover" href="text/cover.xhtml" media-type="application/xhtml+xml" properties="svg"/><item id="title" href="text/title_page.xhtml" media-type="application/xhtml+xml"/><item id="cover-image" href="media/cover.png" media-type="image/png" properties="cover-image"/>${manifest}${media}</manifest><spine toc="ncx"><itemref idref="cover"/><itemref idref="title"/><itemref idref="nav"/>${spine}</spine><guide><reference type="cover" title="Cover" href="text/cover.xhtml"/><reference type="toc" title="Table of contents" href="nav.xhtml"/></guide></package>\n`);
}

async function generate() {
  rmSync(SOURCE_ROOT, { recursive: true, force: true });
  for (const directory of [MEDIA_ROOT, TEXT_ROOT, join(EPUB_ROOT, 'styles'), join(SOURCE_ROOT, 'META-INF'), PUBLICATION_ROOT]) mkdirSync(directory, { recursive: true });
  for (const file of ['mimetype', 'META-INF/container.xml', 'META-INF/com.apple.ibooks.display-options.xml']) copyFileSync(join(TEMPLATE_ROOT, file), join(SOURCE_ROOT, file));
  copyFileSync(join(TEMPLATE_ROOT, 'EPUB/styles/stylesheet1.css'), join(EPUB_ROOT, 'styles/stylesheet1.css'));
  const artwork = await sharp(COVER_ART).resize(1600, 2560, { fit: 'cover', position: 'centre' }).png().toBuffer();
  const cover = await sharp(artwork).composite([{ input: Buffer.from(englishCoverSvg()) }]).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
  writeFileSync(join(MEDIA_ROOT, 'cover.png'), cover);
  writeFileSync(join(PUBLICATION_ROOT, 'digital-euro-cover.png'), cover);
  writeFileSync(join(TEXT_ROOT, 'cover.xhtml'), `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xmlns:xlink="http://www.w3.org/1999/xlink" lang="en"><head><meta charset="utf-8"/><title>Cover</title></head><body epub:type="frontmatter cover"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1600 2560"><image width="1600" height="2560" xlink:href="../media/cover.png"/></svg></body></html>\n`);
  writeFileSync(join(TEXT_ROOT, 'title_page.xhtml'), xhtmlDocument({ title: 'The Digital Euro', body: '<section class="titlepage" epub:type="titlepage"><h1 class="title">The Digital Euro</h1><p class="subtitle">Balance sheets, data, law, costs and sovereignty</p><p class="author">l0g</p><p class="publisher">l0g.fr</p><p class="date">16 August 2026</p><p class="rights">Creative Commons Attribution 4.0 International</p></section>', bodyType: 'frontmatter' }));
  const rendered = [];
  let offset = 0;
  for (const article of articles) { const result = await renderArticle(article, offset); rendered.push(result); offset = result.next; }
  if (offset !== 23) throw new Error(`Expected 23 infographics, generated ${offset}`);
  writeStructuralFiles(rendered);
  writeNavigation(rendered);
  writePackage(offset);
  const fingerprint = createHash('sha256').update(articles.map((article) => readFileSync(join(ROOT, 'src/content/posts-en', article.file))).join('\n')).digest('hex');
  console.log(`Digital Euro EPUB source generated: 6 investigations, 23 infographics, source ${fingerprint.slice(0, 12)}`);
}

generate().catch((error) => { console.error(error); process.exitCode = 1; });
