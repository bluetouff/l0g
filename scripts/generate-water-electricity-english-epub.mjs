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
const SOURCE_ROOT = join(ROOT, 'src/epub/water-electricity');
const EPUB_ROOT = join(SOURCE_ROOT, 'EPUB');
const MEDIA_ROOT = join(EPUB_ROOT, 'media');
const TEXT_ROOT = join(EPUB_ROOT, 'text');
const TEMPLATE_ROOT = join(ROOT, 'src/epub/l-argent-d-epstein');
const COVER_ART = join(ROOT, 'src/epub-assets/water-electricity-cover-art.png');
const PUBLICATION_ROOT = join(ROOT, 'public/publications');
const SITE = 'https://l0g.fr';
const BOOK_URL = `${SITE}/en/publications/water-electricity/`;
const BOOK_ID = 'urn:uuid:77d620a4-f0f7-5a23-8e39-b0118442ec62';
const MODIFIED = '2026-08-21T15:30:00Z';
const SOURCE_REVISION = 'e85fc63797c76e749b143398fca5cbccaba44de2';

const articles = [
  ['how-much-is-one-centimetre-of-danube-worth.mdx', 'how-much-is-one-centimetre-of-danube-worth', '20 August 2026', 1],
  ['wet-megawatt-europe-water-electricity.mdx', 'wet-megawatt-europe-water-electricity', '20 August 2026', 2],
  ['the-extra-degree-thermal-discharges-nuclear.mdx', 'the-extra-degree-thermal-discharges-nuclear', '20 August 2026', 3],
  ['the-dam-that-chooses-not-to-generate.mdx', 'the-dam-that-chooses-not-to-generate', '21 August 2026', 4],
  ['model-pump-price-of-adequacy.mdx', 'model-pump-price-of-adequacy', '21 August 2026', 5],
  ['price-of-cooling-water-electricity.mdx', 'price-of-cooling-water-electricity', '21 August 2026', 6],
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
  let body = source
    .replace(/^---\n[\s\S]*?\n---\n/u, '')
    .replace(/^import\s+[^\n]+\n/gmu, '')
    .replace(/<style>\{`[\s\S]*?`\}<\/style>/gu, '');
  const tools = [
    ['DanubeCentimetreCalculator', '/en/tools/value-of-danube-centimetre/'],
    ['WetMegawattCounter', '/en/tools/wet-megawatt-counter/'],
    ['ThermalThresholdSelector', '/en/tools/thermal-discharge-thresholds/'],
    ['ReservoirArbitrator', '/en/tools/reservoir-arbitrator/'],
    ['AdequacyPumpComparator', '/en/tools/model-pump-adequacy/'],
    ['CoolingAdaptationEstimator', '/en/tools/cooling-adaptation-quote/'],
  ];
  for (const [component, route] of tools) {
    body = body.replace(
      new RegExp(`<${component}\\s+lang="en"\\s*\\/>`, 'gu'),
      `> **Interactive tool.** The calculator for this chapter remains available on [l0g.fr](${route}). The EPUB preserves its context and limits but embeds no script or tracking.`,
    );
  }
  return body;
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
  const chapterTitle = `${title.charAt(0).toLocaleUpperCase('en-US')}${title.slice(1)}`;
  const body = `<section id="article-${article.number}" class="level1 article-chapter"><p class="chapter-kicker">Part ${article.number} of 6</p><h1>${escapeXml(chapterTitle)}</h1><p class="chapter-dek">${escapeXml(description)}</p><p class="chapter-meta">Published ${article.date} · <a href="${SITE}${article.route}">Canonical article on l0g.fr</a></p>${sectioned.html}</section>`;
  writeFileSync(join(TEXT_ROOT, article.chapter), xhtmlDocument({ title, body }));
  return { ...article, title, description, headings: sectioned.headings.map(({ id, label }) => ({ id, label })), next: figures.next };
}

function coverSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2560" viewBox="0 0 1600 2560"><defs><linearGradient id="top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#041018" stop-opacity=".99"/><stop offset=".76" stop-color="#041018" stop-opacity=".8"/><stop offset="1" stop-color="#041018" stop-opacity="0"/></linearGradient><linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#041018" stop-opacity="0"/><stop offset="1" stop-color="#041018" stop-opacity=".97"/></linearGradient></defs><rect width="1600" height="1220" fill="url(#top)"/><rect y="1960" width="1600" height="600" fill="url(#bottom)"/><rect x="76" y="76" width="1448" height="2408" rx="2" fill="none" stroke="#4b7d88" stroke-width="3" opacity=".88"/><path d="M112 210H1488" stroke="#34525d" stroke-width="2"/><text x="112" y="158" fill="#67decf" font-family="Courier New,monospace" font-size="40">l0g_ / ENQUÊTE EN SOURCES OUVERTES</text><text x="112" y="284" fill="#a7b8c6" font-family="Courier New,monospace" font-size="27" font-weight="700" letter-spacing="2">SIX VOLETS  ·  VINGT INFOGRAPHIES</text><g font-family="Arial,Helvetica,sans-serif" font-weight="850" fill="#f5f2ec"><text x="106" y="478" font-size="138">L’EAU</text><text x="106" y="646" font-size="148">DERRIÈRE</text><text x="106" y="824" font-size="158">L’ÉLECTRICITÉ</text></g><rect x="112" y="884" width="860" height="10" fill="#e8ad49"/><g font-family="Arial,Helvetica,sans-serif" font-size="37" font-weight="750" fill="#d9e0e7" letter-spacing="1"><text x="112" y="958">DANUBE · BARRAGES · CENTRALES</text><text x="112" y="1014">RÉSEAU · COÛTS · ADAPTATION</text></g><g font-family="Courier New,monospace"><rect x="112" y="2194" width="520" height="54" rx="27" fill="#071d24" stroke="#62dfd0"/><text x="372" y="2230" text-anchor="middle" fill="#86eadf" font-size="25" font-weight="700">ÉDITION PUBLIQUE · 21.08.2026</text><text x="112" y="2350" fill="#c8d3db" font-size="30">Du niveau du fleuve au coût du MWh.</text><text x="112" y="2403" fill="#8fa2af" font-size="29">Une enquête sur le combustible invisible.</text><text x="112" y="2456" fill="#748994" font-size="27">l0g.fr  ·  2026</text></g></svg>`;
}

function englishCoverSvg() {
  return coverSvg()
    .replace('ENQUÊTE EN SOURCES OUVERTES', 'OPEN-SOURCE INVESTIGATION')
    .replace('SIX VOLETS  ·  VINGT INFOGRAPHIES', 'SIX PARTS  ·  TWENTY INFOGRAPHICS')
    .replace('L’EAU', 'THE WATER')
    .replace('DERRIÈRE', 'BEHIND')
    .replace('L’ÉLECTRICITÉ', 'ELECTRICITY')
    .replace('DANUBE · BARRAGES · CENTRALES', 'DANUBE · DAMS · POWER PLANTS')
    .replace('RÉSEAU · COÛTS · ADAPTATION', 'GRID · COSTS · ADAPTATION')
    .replace('ÉDITION PUBLIQUE', 'PUBLIC EDITION')
    .replace('Du niveau du fleuve au coût du MWh.', 'From river level to the cost of a MWh.')
    .replace('Une enquête sur le combustible invisible.', 'An investigation into the invisible fuel.');
}

const ENGLISH_INTRO = `<section id="introduction" class="level1"><p class="chapter-kicker">Introduction</p><h1>Electricity needs water</h1><p class="chapter-dek">Six investigations following a megawatt from river level to the cost of adaptation.</p><p>Water appears nowhere on an electricity bill. It is nevertheless present throughout the European power system: in front of an intake pump on the Danube, in the Rhône receiving waste heat, behind a dam choosing when to generate, inside a power plant’s cooling system and in the models that promise supply will cover demand.</p><p>This series begins with concrete events from the summer of 2026. In Romania and Hungary, a few centimetres of river level separated production from shutdown. In France, thermal rules connected river temperatures to grid needs. Elsewhere, hydropower reserves showed why holding water can be worth more than generating immediately.</p><h2 id="investigation-thread">The investigation thread</h2><p>The six chapters move gradually across scales. The first measures the value of one centimetre at an intake. The second asks which European plants actually depend on a river, sea or aquifer. The third follows thermal-discharge limits. The fourth enters reservoir arbitrage. The fifth tests an adequacy model against its physical costs. The final chapter compares adaptation options, from cooling towers to dry cooling.</p><p>The result is a simple idea: a megawatt is not only a machine and a fuel. It also depends on a place, intake geometry, temperature, flow, stored water and an operating rule.</p><h2 id="investigation-method">What the sources can measure</h2><p>The investigation prioritises official texts, environmental decisions, operator data, public reports and scientific publications. News reporting is used to establish chronology or attribute a statement when the primary record is incomplete.</p><p>Published costs do not always include their denominator. Construction can be priced without revealing the megawatt-hours it secures. A model can find adequate supply without counting the physical cost of the pumps, imports or reserves that make that result possible. The edition keeps those gaps visible.</p><h2 id="corpus-status">A dated public record</h2><p>The chapters correspond to the versions served on l0g.fr on 21 August 2026, revision <code>${SOURCE_REVISION}</code>. Facts, estimates, scenarios and unknowns retain the status used in each article. Canonical links provide a path to later corrections.</p><aside class="reading-guide" id="reading-guide"><h2>How to read this edition</h2><ul><li>The six chapters follow the physical water and electricity chain.</li><li>Sources, dates, units and limitations stay attached to the analysis.</li><li>All 20 infographics include text alternatives.</li><li>Each interactive tool remains available on the site, with no tracking.</li></ul></aside></section>`;

const ENGLISH_CONCLUSION = `<section id="conclusion" class="level1"><h1>Conclusion: count electricity with its water</h1><p>The six parts converge on one method. Every generating unit should be linked to its cooling resource, operating thresholds, possible losses and the cost of available responses. Without that chain, capacity registers overstate what the system can actually guarantee during an extreme event.</p><p>No adaptation eliminates the constraint. A sill changes the river, a wet tower reduces withdrawals while increasing evaporation, dry cooling pays for water savings through lower efficiency, and the grid shifts the problem to imports, storage or demand. The right decision depends on the site and the number of megawatt-hours actually protected.</p><p>The next step is to publish those denominators. Secured MW, avoided derating, lifetime, net water consumption, environmental effects and full cost should accompany every investment. Electricity would become easier to compare once its water is no longer invisible.</p></section>`;

function writeStructuralFiles(rendered) {
  writeFileSync(join(TEXT_ROOT, 'ch001.xhtml'), xhtmlDocument({ title: 'Introduction', body: ENGLISH_INTRO }));
  writeFileSync(join(TEXT_ROOT, 'ch008.xhtml'), xhtmlDocument({ title: 'Conclusion', body: ENGLISH_CONCLUSION }));
  const links = rendered.map((article) => `<li><a href="${SITE}${article.route}">${escapeXml(article.title)}</a></li>`).join('');
  const about = `<section id="about" class="level1"><h1>About this edition</h1><p class="colophon"><strong>The Water Behind Electricity</strong> brings together six investigations published by l0g on 20 and 21 August 2026. This EPUB 3 edition was prepared on 21 August 2026 with an explicit reading order, a structured table of contents, 20 adapted infographics and links to six educational tools.</p><h2>Canonical articles</h2><ol class="original-articles">${links}</ol><p>Texts licensed under <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a>.</p></section>`;
  writeFileSync(join(TEXT_ROOT, 'ch009.xhtml'), xhtmlDocument({ title: 'About this edition', body: about }));
}

function entries(rendered) {
  return [{ title: 'Introduction', href: 'text/ch001.xhtml', children: [{ title: 'How to read this edition', href: 'text/ch001.xhtml#reading-guide' }] }, ...rendered.map((article) => ({ title: article.title, href: `text/${article.chapter}`, children: article.headings.map((heading) => ({ title: heading.label, href: `text/${article.chapter}#${heading.id}` })) })), { title: 'Conclusion', href: 'text/ch008.xhtml' }, { title: 'About this edition', href: 'text/ch009.xhtml' }];
}

function writeNavigation(rendered) {
  const toc = entries(rendered);
  const list = (items) => `<ol>${items.map((item) => `<li><a href="${item.href}">${escapeXml(item.title)}</a>${item.children?.length ? list(item.children) : ''}</li>`).join('')}</ol>`;
  writeFileSync(join(EPUB_ROOT, 'nav.xhtml'), `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en"><head><meta charset="utf-8"/><title>The Water Behind Electricity</title><link rel="stylesheet" href="styles/stylesheet1.css" type="text/css"/></head><body epub:type="frontmatter"><nav epub:type="toc" id="toc"><h1>The Water Behind Electricity</h1>${list(toc)}</nav><nav epub:type="landmarks" hidden="hidden"><ol><li><a href="text/cover.xhtml" epub:type="cover">Cover</a></li><li><a href="text/title_page.xhtml" epub:type="titlepage">Title page</a></li></ol></nav></body></html>\n`);
  let order = 0;
  const points = (items) => items.map((item) => { order += 1; const current = order; return `<navPoint id="navPoint-${current}" playOrder="${current}"><navLabel><text>${escapeXml(item.title)}</text></navLabel><content src="${item.href}"/>${item.children?.length ? points(item.children) : ''}</navPoint>`; }).join('');
  writeFileSync(join(EPUB_ROOT, 'toc.ncx'), `<?xml version="1.0" encoding="UTF-8"?><ncx version="2005-1" xmlns="http://www.daisy.org/z3986/2005/ncx/"><head><meta name="dtb:uid" content="${BOOK_ID}"/><meta name="dtb:depth" content="2"/></head><docTitle><text>The Water Behind Electricity</text></docTitle><navMap>${points(toc)}</navMap></ncx>\n`);
}

function writePackage(infographicCount) {
  const chapters = Array.from({ length: 9 }, (_, i) => String(i + 1).padStart(3, '0'));
  const manifest = chapters.map((ch) => `<item id="ch${ch}" href="text/ch${ch}.xhtml" media-type="application/xhtml+xml"/>`).join('');
  const spine = chapters.map((ch) => `<itemref idref="ch${ch}"/>`).join('');
  const media = Array.from({ length: infographicCount }, (_, i) => `<item id="file${i}" href="media/file${i}.svg" media-type="image/svg+xml"/>`).join('');
  writeFileSync(join(EPUB_ROOT, 'content.opf'), `<?xml version="1.0" encoding="UTF-8"?><package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id" prefix="schema: http://schema.org/"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${BOOK_ID}</dc:identifier><dc:title>The Water Behind Electricity</dc:title><dc:language>en</dc:language><dc:creator>l0g</dc:creator><dc:date>2026-08-21</dc:date><dc:subject>water and electricity</dc:subject><dc:subject>Danube</dc:subject><dc:subject>power plant cooling</dc:subject><dc:subject>hydropower</dc:subject><dc:description>Six illustrated investigations into water, power plants, dams, electricity adequacy and the cost of adaptation in Europe.</dc:description><dc:publisher>l0g.fr</dc:publisher><dc:rights>Creative Commons Attribution 4.0 International (CC BY 4.0).</dc:rights><dc:source>${BOOK_URL}</dc:source><meta property="dcterms:modified">${MODIFIED}</meta><meta name="cover" content="cover-image"/><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityHazard">none</meta><meta property="schema:accessibilitySummary">Explicit reading order, structured table of contents and text descriptions for all infographics.</meta></metadata><manifest><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="css" href="styles/stylesheet1.css" media-type="text/css"/><item id="cover" href="text/cover.xhtml" media-type="application/xhtml+xml" properties="svg"/><item id="title" href="text/title_page.xhtml" media-type="application/xhtml+xml"/><item id="cover-image" href="media/cover.png" media-type="image/png" properties="cover-image"/>${manifest}${media}</manifest><spine toc="ncx"><itemref idref="cover"/><itemref idref="title"/><itemref idref="nav"/>${spine}</spine><guide><reference type="cover" title="Cover" href="text/cover.xhtml"/><reference type="toc" title="Table of contents" href="nav.xhtml"/></guide></package>\n`);
}

async function generate() {
  rmSync(SOURCE_ROOT, { recursive: true, force: true });
  for (const directory of [MEDIA_ROOT, TEXT_ROOT, join(EPUB_ROOT, 'styles'), join(SOURCE_ROOT, 'META-INF'), PUBLICATION_ROOT]) mkdirSync(directory, { recursive: true });
  for (const file of ['mimetype', 'META-INF/container.xml', 'META-INF/com.apple.ibooks.display-options.xml']) copyFileSync(join(TEMPLATE_ROOT, file), join(SOURCE_ROOT, file));
  copyFileSync(join(TEMPLATE_ROOT, 'EPUB/styles/stylesheet1.css'), join(EPUB_ROOT, 'styles/stylesheet1.css'));
  const artwork = await sharp(COVER_ART).resize(1600, 2560, { fit: 'cover', position: 'centre' }).png().toBuffer();
  const cover = await sharp(artwork).composite([{ input: Buffer.from(englishCoverSvg()) }]).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
  writeFileSync(join(MEDIA_ROOT, 'cover.png'), cover);
  writeFileSync(join(PUBLICATION_ROOT, 'water-electricity-cover.png'), cover);
  writeFileSync(join(TEXT_ROOT, 'cover.xhtml'), `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xmlns:xlink="http://www.w3.org/1999/xlink" lang="en"><head><meta charset="utf-8"/><title>Cover</title></head><body epub:type="frontmatter cover"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1600 2560"><image width="1600" height="2560" xlink:href="../media/cover.png"/></svg></body></html>\n`);
  writeFileSync(join(TEXT_ROOT, 'title_page.xhtml'), xhtmlDocument({ title: 'The Water Behind Electricity', body: '<section class="titlepage" epub:type="titlepage"><h1 class="title">The Water Behind Electricity</h1><p class="subtitle">Danube, dams, power plants, grid and adaptation</p><p class="author">l0g</p><p class="publisher">l0g.fr</p><p class="date">21 August 2026</p><p class="rights">Creative Commons Attribution 4.0 International</p></section>', bodyType: 'frontmatter' }));
  const rendered = [];
  let offset = 0;
  for (const article of articles) { const result = await renderArticle(article, offset); rendered.push(result); offset = result.next; }
  if (offset !== 20) throw new Error(`Expected 20 infographics, generated ${offset}`);
  writeStructuralFiles(rendered);
  writeNavigation(rendered);
  writePackage(offset);
  const fingerprint = createHash('sha256').update(articles.map((article) => readFileSync(join(ROOT, 'src/content/posts-en', article.file))).join('\n')).digest('hex');
  console.log(`Water and electricity EPUB source generated: 6 investigations, 20 infographics, source ${fingerprint.slice(0, 12)}`);
}

generate().catch((error) => { console.error(error); process.exitCode = 1; });
