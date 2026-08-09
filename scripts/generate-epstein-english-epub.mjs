import { createHash } from 'node:crypto';
import {
  copyFileSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
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
const SOURCE_ROOT = join(ROOT, 'src/epub/epsteins-money');
const EPUB_ROOT = join(SOURCE_ROOT, 'EPUB');
const MEDIA_ROOT = join(EPUB_ROOT, 'media');
const TEXT_ROOT = join(EPUB_ROOT, 'text');
const PUBLICATION_ROOT = join(ROOT, 'public/publications');
const FRENCH_EPUB_ROOT = join(ROOT, 'src/epub/l-argent-d-epstein');
const SITE = 'https://l0g.fr';
const BOOK_URL = `${SITE}/en/publications/epsteins-money/`;
const BOOK_ID = 'urn:uuid:f4e046aa-61ec-5b27-938b-28439a1d4475';
const MODIFIED = '2026-08-09T21:15:00Z';

const articles = [
  {
    file: 'epstein-money-fortune-without-ledger.md',
    route: '/en/analysis/epstein-money-fortune-without-ledger/',
    chapter: 'ch003.xhtml',
    number: 1,
    date: '7 August 2026',
    minutes: 25,
  },
  {
    file: 'epstein-money-what-the-banks-saw.md',
    route: '/en/analysis/epstein-money-what-the-banks-saw/',
    chapter: 'ch004.xhtml',
    number: 2,
    date: '7 August 2026',
    minutes: 25,
  },
  {
    file: 'epstein-money-client-broker-investor.md',
    route: '/en/analysis/epstein-money-client-broker-investor/',
    chapter: 'ch005.xhtml',
    number: 3,
    date: '8 August 2026',
    minutes: 23,
  },
  {
    file: 'epstein-money-final-ledger.md',
    route: '/en/analysis/epstein-money-final-ledger/',
    chapter: 'ch006.xhtml',
    number: 4,
    date: '8 August 2026',
    minutes: 26,
  },
  {
    file: 'deutsche-bank-epstein-compliance-exception.md',
    route: '/en/analysis/deutsche-bank-epstein-compliance-exception/',
    chapter: 'ch008.xhtml',
    number: 5,
    date: '9 August 2026',
    minutes: 19,
  },
  {
    file: 'barclays-staley-maxwell-two-records-one-boundary.md',
    route: '/en/analysis/barclays-staley-maxwell-two-records-one-boundary/',
    chapter: 'ch009.xhtml',
    number: 6,
    date: '9 August 2026',
    minutes: 19,
  },
  {
    file: 'epstein-european-banks-six-relationships-not-to-confuse.md',
    route: '/en/analysis/epstein-european-banks-six-relationships-not-to-confuse/',
    chapter: 'ch010.xhtml',
    number: 7,
    date: '9 August 2026',
    minutes: 17,
  },
];

const chapterByRoute = new Map(articles.map((article) => [article.route, `text/${article.chapter}#article-${article.number}`]));

function escapeXml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function plainText(value) {
  return toText(fromHtml(String(value), { fragment: true })).trim();
}

function frontmatter(source, key) {
  const block = source.match(/^---\n([\s\S]*?)\n---\n/u)?.[1] ?? '';
  const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'mu'));
  if (!match) return '';
  const value = match[1].trim();
  if (value.startsWith('"') && value.endsWith('"')) {
    return value.slice(1, -1).replaceAll('\\"', '"');
  }
  return value;
}

function markdownBody(source) {
  return source.replace(/^---\n[\s\S]*?\n---\n/u, '');
}

function xhtmlDocument({ title, body, bodyType = 'bodymatter', bodyId = '' }) {
  const id = bodyId ? ` id="${bodyId}"` : '';
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="generator" content="l0g" />
  <title>${escapeXml(title)}</title>
  <link rel="stylesheet" type="text/css" href="../styles/stylesheet1.css" />
</head>
<body epub:type="${bodyType}"${id}>
${body}
</body>
</html>
`;
}

function sanitizeSvg(svg, label) {
  if (/<(?:script|foreignObject|iframe|object|embed)\b/iu.test(svg)) {
    throw new Error(`${label}: forbidden active SVG content`);
  }
  if (/\son[a-z]+\s*=/iu.test(svg) || /(?:href|src)\s*=\s*["'](?:https?:|data:|javascript:)/iu.test(svg)) {
    throw new Error(`${label}: forbidden SVG event handler or external payload`);
  }
  let clean = svg.replace(/\sstyle="padding-bottom:[^"]+"/gu, '');
  if (!/\sxmlns=/u.test(clean)) clean = clean.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  return `<?xml version="1.0" encoding="UTF-8"?>\n${clean}\n`;
}

function rewriteLinks(html) {
  return html.replace(/href="([^"]+)"/gu, (full, href) => {
    const [path, fragment = ''] = href.split('#');
    const canonicalPath = path.endsWith('/') ? path : `${path}/`;
    const local = chapterByRoute.get(canonicalPath);
    if (local) {
      const [target] = local.split('#');
      return `href="${target.replace('text/', '')}${fragment ? `#${fragment}` : local.slice(local.indexOf('#'))}"`;
    }
    if (href.startsWith('/')) return `href="${SITE}${href}"`;
    return full;
  });
}

function sectionHeadings(html, articleNumber) {
  const headingPattern = /<h2>([\s\S]*?)<\/h2>/gu;
  const headings = [...html.matchAll(headingPattern)];
  if (headings.length === 0) return { html, headings: [] };

  const slugger = new GithubSlugger();
  const sections = [];
  const lead = html.slice(0, headings[0].index);
  for (let index = 0; index < headings.length; index += 1) {
    const match = headings[index];
    const next = headings[index + 1];
    const label = plainText(match[1]);
    const id = `c${articleNumber}-${slugger.slug(label)}`;
    const content = html.slice(match.index + match[0].length, next?.index ?? html.length);
    sections.push({ id, label, html: `<section id="${id}" class="level2">\n<h2>${match[1]}</h2>${content}\n</section>` });
  }

  return { html: `${lead}${sections.map((section) => section.html).join('\n')}`, headings: sections };
}

function extractInfographics(html, articleNumber, infographicOffset) {
  let nextOffset = infographicOffset;
  const rewritten = html.replace(/<svg\b[\s\S]*?<\/svg>/gu, (svg) => {
    const fileName = `file${nextOffset}.svg`;
    const title = plainText(svg.match(/<title[^>]*>([\s\S]*?)<\/title>/u)?.[1] ?? `Infographic ${nextOffset + 1}`);
    const description = plainText(svg.match(/<desc[^>]*>([\s\S]*?)<\/desc>/u)?.[1] ?? title);
    const clean = sanitizeSvg(svg, `article ${articleNumber}, ${fileName}`);
    writeFileSync(join(MEDIA_ROOT, fileName), clean);
    nextOffset += 1;
    return `<img src="../media/${fileName}" class="infographic-image" alt="${escapeXml(description)}" />`;
  });

  return {
    html: rewritten.replace(/<figure class="infographic" style="[^"]*">/gu, '<figure class="infographic">'),
    nextOffset,
  };
}

async function renderArticle(article, infographicOffset) {
  const sourcePath = join(ROOT, 'src/content/posts-en', article.file);
  const source = readFileSync(sourcePath, 'utf8');
  const title = frontmatter(source, 'title');
  const description = frontmatter(source, 'description');
  if (!title || !description) throw new Error(`${basename(sourcePath)}: missing title or description`);

  const rendered = String(
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(markdownBody(source)),
  );

  const figures = extractInfographics(rendered, article.number, infographicOffset);
  const linked = rewriteLinks(figures.html);
  const sectioned = sectionHeadings(linked, article.number);
  const body = `<section id="article-${article.number}" class="level1 article-chapter">
<h1>${escapeXml(title)}</h1>
<p class="chapter-kicker">Chapter ${article.number}</p>
<p class="chapter-dek">${escapeXml(description)}</p>
<p class="chapter-meta">Published ${article.date} · Estimated reading time: ${article.minutes} min · <a href="${SITE}${article.route}">Canonical article on l0g.fr</a></p>
${sectioned.html}
</section>`;

  writeFileSync(
    join(TEXT_ROOT, article.chapter),
    xhtmlDocument({ title, body }),
  );

  return {
    ...article,
    title,
    description,
    headings: sectioned.headings.map(({ id, label }) => ({ id, label })),
    nextOffset: figures.nextOffset,
  };
}

function coverSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2560" viewBox="0 0 1600 2560">
  <rect width="1600" height="2560" fill="#080b0f"/>
  <g stroke="#1a2028" stroke-width="1" opacity="0.85">
    ${Array.from({ length: 14 }, (_, index) => `<path d="M${160 + index * 110} 0V2560"/>`).join('')}
    ${Array.from({ length: 19 }, (_, index) => `<path d="M0 ${120 + index * 130}H1600"/>`).join('')}
  </g>
  <rect x="82" y="82" width="1436" height="2396" fill="none" stroke="#303944" stroke-width="3"/>
  <g font-family="Courier New, monospace">
    <text x="118" y="150" fill="#62dfd0" font-size="41">l0g_ / INVESTIGATION</text>
    <text x="118" y="252" fill="#9ca4af" font-size="28" font-weight="700">SEVEN ARTICLES · AN ACCOUNTING OF EVIDENCE</text>
  </g>
  <g font-family="Arial, Helvetica, sans-serif" font-weight="800" fill="#f2eee8">
    <text x="112" y="602" font-size="142">EPSTEIN&apos;S</text>
    <text x="112" y="770" font-size="190">MONEY</text>
  </g>
  <rect x="112" y="834" width="730" height="11" fill="#f5b13d"/>
  <g font-family="Arial, Helvetica, sans-serif" font-size="61" font-weight="800" fill="#d9dde5">
    <text x="118" y="972">FORTUNE, BANKS</text>
    <text x="118" y="1052">AND EUROPEAN</text>
    <text x="118" y="1132">OPACITY</text>
  </g>
  <g fill="none" stroke-width="9">
    <path d="M130 1648L438 1544" stroke="#5eead4"/>
    <path d="M438 1544L742 1748" stroke="#ff4d87"/>
    <path d="M742 1748L1118 1568" stroke="#f5b13d"/>
  </g>
  <circle cx="130" cy="1648" r="18" fill="#5eead4"/>
  <circle cx="438" cy="1544" r="18" fill="#ff4d87"/>
  <circle cx="742" cy="1748" r="18" fill="#f5b13d"/>
  <circle cx="1118" cy="1568" r="18" fill="#f5b13d"/>
  <g font-family="Arial, Helvetica, sans-serif" fill="#b9c0ca" font-size="31">
    <text x="118" y="2070">From revenues to the estate.</text>
    <text x="118" y="2122">From bank alerts to the boundaries of proof.</text>
  </g>
  <text x="118" y="2328" fill="#8d96a3" font-family="Courier New, monospace" font-size="31">l0g.fr · 2026</text>
  </svg>`;
}

function writeStructuralFiles(renderedArticles) {
  const intro = `<section id="introduction" class="level1">
<h1>Introduction: seven investigations, one accounting problem</h1>
<p class="editorial-note">Revenues, transfers, investments, bank accounts, settlements and estate statements do not measure the same thing. This edition brings seven l0g investigations into one reading sequence while preserving their sources, calculations, distinctions and limitations.</p>
<p>The book follows the evidence from the documented origins of Jeffrey Epstein&apos;s fortune to the public record left by banks, private investments and the administration of his estate. The European chapters then examine Deutsche Bank, Barclays and six relationships that cannot be treated as one category.</p>
<p>No missing ledger is reconstructed with assumptions. When the public record does not connect two amounts, the gap remains visible. When a record is an allegation, an estimate or attributed reporting, the text identifies it as such.</p>
<aside class="reading-guide" id="how-to-read">
<h2>How to read this edition</h2>
<ul>
<li>Each chapter links to its canonical article on l0g.fr.</li>
<li>Sources remain clickable and limitations remain attached to each investigation.</li>
<li>The twenty infographics include text alternatives.</li>
<li>Future corrections remain traceable on the canonical pages.</li>
</ul>
</aside>
</section>`;
  writeFileSync(join(TEXT_ROOT, 'ch001.xhtml'), xhtmlDocument({ title: 'Introduction: seven investigations, one accounting problem', body: intro }));

  const partOne = `<section id="part-one" class="level1 part-page">
<p class="part-kicker">Part I</p>
<h1 class="part-title">Reconstructing the money</h1>
<p class="part-intro">Four investigations follow the documented origins of the fortune, the information held by banks, Epstein&apos;s different roles around private investments and the liquidation of his estate.</p>
</section>`;
  writeFileSync(join(TEXT_ROOT, 'ch002.xhtml'), xhtmlDocument({ title: 'Part I: Reconstructing the money', body: partOne }));

  const partTwo = `<section id="part-two" class="level1 part-page">
<p class="part-kicker">Part II</p>
<h1 class="part-title">The European laboratory</h1>
<p class="part-intro">Three investigations identify the precise nature of the Deutsche Bank and Barclays records, then classify six European banking relationships according to the facts each source can establish.</p>
</section>`;
  writeFileSync(join(TEXT_ROOT, 'ch007.xhtml'), xhtmlDocument({ title: 'Part II: The European laboratory', body: partTwo }));

  const conclusion = `<section id="conclusion" class="level1">
<h1>Conclusion: opacity fragments the figures</h1>
<p>These seven investigations do not produce a hidden grand total. They show why the public documents available cannot honestly yield one. The records are distributed across banks, jurisdictions, private companies, civil proceedings, regulators and the administration of the estate.</p>
<p>The evidence nevertheless identifies large, traceable blocks: documented revenues, bank transfers, investment positions, settlements and estate accounts. Their accounting categories and time periods differ. Adding them would count some money more than once and convert incomplete records into a false measure of wealth.</p>
<p>The banking chapters establish that risk can be identified, documented and still treated as manageable. They also show why a bank alert, a suspicious activity report, an account and a court finding must retain their distinct meanings.</p>
<p>The unanswered questions remain public. The institutions, regulators, estate administrators and holders of the underlying ledgers are the parties most likely to resolve them. Until those records are released, the gaps remain part of the result.</p>
</section>`;
  writeFileSync(join(TEXT_ROOT, 'ch011.xhtml'), xhtmlDocument({ title: 'Conclusion: opacity fragments the figures', body: conclusion }));

  const originalArticles = renderedArticles.map((article) => `<li><a href="${SITE}${article.route}">${escapeXml(article.title)}</a></li>`).join('\n');
  const about = `<section id="about-this-edition" class="level1">
<h1>About this edition</h1>
<p class="colophon"><strong>Epstein&apos;s Money</strong> brings together seven investigations published by l0g. The EPUB 3 edition was prepared on 9 August 2026 and contains a structured table of contents, an explicit reading order, twenty adapted infographics and text alternatives.</p>
<p>l0g is an independent editorial observatory focused on risk mechanisms, financial opacity and economic systems. Its analyses begin with public documents, distinguish established facts from attributed information and unknowns, and publish both sources and limitations.</p>
<h2>Canonical articles</h2>
<ol class="original-articles">${originalArticles}</ol>
<p>Texts are licensed under <a href="https://creativecommons.org/licenses/by/4.0/">Creative Commons Attribution 4.0 International</a>. The downloadable file and its SHA-256 checksum are published at <a href="${BOOK_URL}">${BOOK_URL}</a>.</p>
</section>`;
  writeFileSync(join(TEXT_ROOT, 'ch012.xhtml'), xhtmlDocument({ title: 'About this edition', body: about }));
}

function tocEntries(renderedArticles) {
  const byNumber = new Map(renderedArticles.map((article) => [article.number, article]));
  return [
    { title: 'Introduction: seven investigations, one accounting problem', href: 'text/ch001.xhtml', children: [{ title: 'How to read this edition', href: 'text/ch001.xhtml#how-to-read' }] },
    { title: 'Reconstructing the money', href: 'text/ch002.xhtml' },
    ...[1, 2, 3, 4].map((number) => {
      const article = byNumber.get(number);
      return { title: article.title, href: `text/${article.chapter}`, children: article.headings.map((heading) => ({ title: heading.label, href: `text/${article.chapter}#${heading.id}` })) };
    }),
    { title: 'The European laboratory', href: 'text/ch007.xhtml' },
    ...[5, 6, 7].map((number) => {
      const article = byNumber.get(number);
      return { title: article.title, href: `text/${article.chapter}`, children: article.headings.map((heading) => ({ title: heading.label, href: `text/${article.chapter}#${heading.id}` })) };
    }),
    { title: 'Conclusion: opacity fragments the figures', href: 'text/ch011.xhtml' },
    { title: 'About this edition', href: 'text/ch012.xhtml' },
  ];
}

function writeNavigation(renderedArticles) {
  const entries = tocEntries(renderedArticles);
  let id = 0;
  const navList = (items) => `<ol class="toc">${items.map((item) => {
    id += 1;
    const children = item.children?.length ? navList(item.children) : '';
    return `<li id="toc-li-${id}"><a href="${item.href}">${escapeXml(item.title)}</a>${children}</li>`;
  }).join('')}</ol>`;
  const nav = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en">
<head><meta charset="utf-8" /><title>Epstein&apos;s Money</title><link rel="stylesheet" type="text/css" href="styles/stylesheet1.css" /></head>
<body epub:type="frontmatter">
<nav epub:type="toc" id="toc"><h1 id="toc-title">Epstein&apos;s Money</h1>${navList(entries)}</nav>
<nav epub:type="landmarks" id="landmarks" hidden="hidden"><ol><li><a href="text/title_page.xhtml" epub:type="titlepage">Title page</a></li><li><a href="text/cover.xhtml" epub:type="cover">Cover</a></li><li><a href="#toc" epub:type="toc">Table of contents</a></li></ol></nav>
</body>
</html>
`;
  writeFileSync(join(EPUB_ROOT, 'nav.xhtml'), nav);

  let playOrder = 0;
  const navPoints = (items, depth = 0) => items.map((item) => {
    playOrder += 1;
    const current = playOrder;
    const children = item.children?.length ? navPoints(item.children, depth + 1) : '';
    return `<navPoint id="navPoint-${current}" playOrder="${current}"><navLabel><text>${escapeXml(item.title)}</text></navLabel><content src="${item.href}" />${children}</navPoint>`;
  }).join('');
  const ncx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx version="2005-1" xmlns="http://www.daisy.org/z3986/2005/ncx/">
<head><meta name="dtb:uid" content="${BOOK_ID}" /><meta name="dtb:depth" content="2" /><meta name="dtb:totalPageCount" content="0" /><meta name="dtb:maxPageNumber" content="0" /></head>
<docTitle><text>Epstein&apos;s Money</text></docTitle><navMap>${navPoints(entries)}</navMap>
</ncx>
`;
  writeFileSync(join(EPUB_ROOT, 'toc.ncx'), ncx);
}

function writePackage() {
  const chapterManifest = Array.from({ length: 12 }, (_, index) => {
    const chapter = String(index + 1).padStart(3, '0');
    return `    <item id="ch${chapter}_xhtml" href="text/ch${chapter}.xhtml" media-type="application/xhtml+xml" />`;
  }).join('\n');
  const spine = Array.from({ length: 12 }, (_, index) => {
    const chapter = String(index + 1).padStart(3, '0');
    return `    <itemref idref="ch${chapter}_xhtml" />`;
  }).join('\n');
  const media = Array.from({ length: 20 }, (_, index) => `    <item id="file${index}_svg" href="media/file${index}.svg" media-type="image/svg+xml" />`).join('\n');
  const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="epub-id-1" prefix="schema: http://schema.org/">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:identifier id="epub-id-1">${BOOK_ID}</dc:identifier>
    <dc:title id="epub-title-1">Epstein&apos;s Money</dc:title>
    <dc:date id="epub-date">2026-08-09</dc:date>
    <dc:language>en</dc:language>
    <dc:creator id="epub-creator-1">l0g</dc:creator>
    <meta refines="#epub-creator-1" property="role" scheme="marc:relators">aut</meta>
    <dc:subject>Jeffrey Epstein</dc:subject><dc:subject>banks</dc:subject><dc:subject>compliance</dc:subject><dc:subject>financial opacity</dc:subject><dc:subject>Europe</dc:subject>
    <dc:description>Seven investigations into Jeffrey Epstein&apos;s documented fortune, the banks that processed related flows and the European banking relationships found in the public record.</dc:description>
    <dc:publisher>l0g.fr</dc:publisher><dc:type>text</dc:type><dc:source>${BOOK_URL}</dc:source>
    <dc:rights>Texts licensed under Creative Commons Attribution 4.0 International (CC BY 4.0).</dc:rights>
    <meta name="cover" content="cover_png" /><meta property="dcterms:modified">${MODIFIED}</meta>
    <meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessModeSufficient">textual</meta>
    <meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta>
    <meta property="schema:accessibilityHazard">none</meta><meta property="schema:accessibilitySummary">The book follows an explicit reading order, provides a structured table of contents and includes a text description for every infographic.</meta>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml" /><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav" />
    <item id="stylesheet1" href="styles/stylesheet1.css" media-type="text/css" /><item id="cover_xhtml" href="text/cover.xhtml" media-type="application/xhtml+xml" properties="svg" /><item id="title_page_xhtml" href="text/title_page.xhtml" media-type="application/xhtml+xml" />
${chapterManifest}
    <item properties="cover-image" id="cover_png" href="media/cover.png" media-type="image/png" />
${media}
  </manifest>
  <spine toc="ncx" page-progression-direction="ltr"><itemref idref="cover_xhtml" /><itemref idref="title_page_xhtml" linear="yes" /><itemref idref="nav" />
${spine}
  </spine>
  <guide><reference type="toc" title="Epstein&apos;s Money" href="nav.xhtml" /><reference type="cover" title="Cover" href="text/cover.xhtml" /></guide>
</package>
`;
  writeFileSync(join(EPUB_ROOT, 'content.opf'), opf);
}

async function generate() {
  rmSync(SOURCE_ROOT, { recursive: true, force: true });
  mkdirSync(MEDIA_ROOT, { recursive: true });
  mkdirSync(TEXT_ROOT, { recursive: true });
  mkdirSync(join(EPUB_ROOT, 'styles'), { recursive: true });
  mkdirSync(join(SOURCE_ROOT, 'META-INF'), { recursive: true });
  mkdirSync(PUBLICATION_ROOT, { recursive: true });

  copyFileSync(join(FRENCH_EPUB_ROOT, 'mimetype'), join(SOURCE_ROOT, 'mimetype'));
  copyFileSync(join(FRENCH_EPUB_ROOT, 'META-INF/container.xml'), join(SOURCE_ROOT, 'META-INF/container.xml'));
  copyFileSync(join(FRENCH_EPUB_ROOT, 'META-INF/com.apple.ibooks.display-options.xml'), join(SOURCE_ROOT, 'META-INF/com.apple.ibooks.display-options.xml'));
  copyFileSync(join(FRENCH_EPUB_ROOT, 'EPUB/styles/stylesheet1.css'), join(EPUB_ROOT, 'styles/stylesheet1.css'));

  const cover = await sharp(Buffer.from(coverSvg())).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
  writeFileSync(join(MEDIA_ROOT, 'cover.png'), cover);
  writeFileSync(join(PUBLICATION_ROOT, 'epsteins-money-cover.png'), cover);

  const coverPage = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en" xml:lang="en"><head><meta charset="utf-8" /><title>Cover</title><link rel="stylesheet" type="text/css" href="../styles/stylesheet1.css" /></head><body epub:type="frontmatter cover" id="cover"><div id="cover-image"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="100%" height="100%" viewBox="0 0 1600 2560" preserveAspectRatio="xMidYMid meet"><image width="1600" height="2560" xlink:href="../media/cover.png" /></svg></div></body></html>\n`;
  writeFileSync(join(TEXT_ROOT, 'cover.xhtml'), coverPage);

  const titlePage = `<section class="titlepage" epub:type="titlepage"><h1 class="title">Epstein&apos;s Money</h1><p class="subtitle">Fortune, banks and European opacity</p><p class="author">l0g</p><p class="publisher">l0g.fr</p><p class="date">9 August 2026</p><p class="rights">Creative Commons Attribution 4.0 International</p></section>`;
  writeFileSync(join(TEXT_ROOT, 'title_page.xhtml'), xhtmlDocument({ title: "Epstein's Money", body: titlePage, bodyType: 'frontmatter' }));

  const renderedArticles = [];
  let infographicOffset = 0;
  for (const article of articles) {
    const rendered = await renderArticle(article, infographicOffset);
    renderedArticles.push(rendered);
    infographicOffset = rendered.nextOffset;
  }
  if (infographicOffset !== 20) throw new Error(`Expected 20 infographics, generated ${infographicOffset}`);

  writeStructuralFiles(renderedArticles);
  writeNavigation(renderedArticles);
  writePackage();

  for (const [source, target] of [[0, 1], [3, 2]]) {
    const svg = readFileSync(join(MEDIA_ROOT, `file${source}.svg`));
    writeFileSync(join(PUBLICATION_ROOT, `epsteins-money-infographic-${target}.svg`), svg);
  }

  const sourceFingerprint = createHash('sha256')
    .update(articles.map((article) => readFileSync(join(ROOT, 'src/content/posts-en', article.file))).join('\n'))
    .digest('hex');
  console.log(`English EPUB source generated: 7 investigations, 20 infographics, source ${sourceFingerprint.slice(0, 12)}`);
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
