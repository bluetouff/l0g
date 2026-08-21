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
const SOURCE_ROOT = join(ROOT, 'src/epub/eau-electricite');
const EPUB_ROOT = join(SOURCE_ROOT, 'EPUB');
const MEDIA_ROOT = join(EPUB_ROOT, 'media');
const TEXT_ROOT = join(EPUB_ROOT, 'text');
const TEMPLATE_ROOT = join(ROOT, 'src/epub/l-argent-d-epstein');
const COVER_ART = join(ROOT, 'src/epub-assets/water-electricity-cover-art.png');
const PUBLICATION_ROOT = join(ROOT, 'public/publications');
const SITE = 'https://l0g.fr';
const BOOK_URL = `${SITE}/publications/eau-electricite/`;
const BOOK_ID = 'urn:uuid:6b9c68c0-6c5d-5f39-b518-83f6ec0db44d';
const MODIFIED = '2026-08-21T15:30:00Z';
const SOURCE_REVISION = 'e85fc63797c76e749b143398fca5cbccaba44de2';

const articles = [
  ['combien-vaut-un-centimetre-de-danube.mdx', 'combien-vaut-un-centimetre-de-danube', '20 août 2026', 1],
  ['megawatt-humide-europe-eau-electricite.mdx', 'megawatt-humide-europe-eau-electricite', '20 août 2026', 2],
  ['degre-de-trop-rejets-thermiques-nucleaire.mdx', 'degre-de-trop-rejets-thermiques-nucleaire', '20 août 2026', 3],
  ['barrage-choisit-ne-pas-produire.mdx', 'barrage-choisit-ne-pas-produire', '21 août 2026', 4],
  ['modele-pompe-prix-adequation.mdx', 'modele-pompe-prix-adequation', '21 août 2026', 5],
  ['prix-refroidissement-eau-electricite.mdx', 'prix-refroidissement-eau-electricite', '21 août 2026', 6],
].map(([file, slug, date, number]) => ({ file, route: `/posts/${slug}/`, date, number, chapter: `ch${String(number + 1).padStart(3, '0')}.xhtml` }));

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
    ['DanubeCentimetreCalculator', '/outils/prix-centimetre-danube/'],
    ['WetMegawattCounter', '/outils/compteur-megawatt-humide/'],
    ['ThermalThresholdSelector', '/outils/seuils-rejets-thermiques/'],
    ['ReservoirArbitrator', '/outils/arbitre-reservoir/'],
    ['AdequacyPumpComparator', '/outils/modele-pompe-adequation/'],
    ['CoolingAdaptationEstimator', '/outils/devis-adaptation-refroidissement/'],
  ];
  for (const [component, route] of tools) {
    body = body.replace(
      new RegExp(`<${component}\\s+lang="fr"\\s*\\/>`, 'gu'),
      `> **Outil interactif.** Le calculateur de ce chapitre reste disponible sur [l0g.fr](${route}). L’EPUB en présente le contexte et les limites, sans embarquer de script ni de suivi.`,
    );
  }
  return body;
}

function xhtmlDocument({ title, body, bodyType = 'bodymatter' }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="fr" xml:lang="fr"><head><meta charset="utf-8" /><meta name="generator" content="l0g" /><title>${escapeXml(title)}</title><link rel="stylesheet" type="text/css" href="../styles/stylesheet1.css" /></head><body epub:type="${bodyType}">${body}</body></html>\n`;
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
    const title = plainText(svg.match(/<title[^>]*>([\s\S]*?)<\/title>/u)?.[1] ?? `Infographie ${next + 1}`);
    const description = plainText(svg.match(/<desc[^>]*>([\s\S]*?)<\/desc>/u)?.[1] ?? svg.match(/aria-label="([^"]+)"/u)?.[1] ?? title);
    writeFileSync(join(MEDIA_ROOT, fileName), sanitizeSvg(svg, `article ${articleNumber}, ${fileName}`));
    next += 1;
    return `<img src="../media/${fileName}" class="infographic-image" alt="${escapeXml(description)}" />`;
  });
  return { html: rewritten.replace(/<figure class="infographic" style="[^"]*">/gu, '<figure class="infographic">'), next };
}

async function renderArticle(article, offset) {
  const sourcePath = join(ROOT, 'src/content/posts', article.file);
  const source = readFileSync(sourcePath, 'utf8');
  const title = frontmatter(source, 'title');
  const description = frontmatter(source, 'description');
  if (!title || !description) throw new Error(`${basename(sourcePath)}: titre ou description absent`);
  const rendered = String(await unified().use(remarkParse).use(remarkGfm).use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw).use(rehypeStringify, { allowDangerousHtml: true }).process(markdownBody(source)));
  const figures = extractInfographics(rendered, article.number, offset);
  const sectioned = sectionHeadings(rewriteLinks(figures.html), article.number);
  const chapterTitle = `${title.charAt(0).toLocaleUpperCase('fr-FR')}${title.slice(1)}`;
  const body = `<section id="article-${article.number}" class="level1 article-chapter"><p class="chapter-kicker">Volet ${article.number} sur 6</p><h1>${escapeXml(chapterTitle)}</h1><p class="chapter-dek">${escapeXml(description)}</p><p class="chapter-meta">Publié le ${article.date} · <a href="${SITE}${article.route}">Article canonique sur l0g.fr</a></p>${sectioned.html}</section>`;
  writeFileSync(join(TEXT_ROOT, article.chapter), xhtmlDocument({ title, body }));
  return { ...article, title, description, headings: sectioned.headings.map(({ id, label }) => ({ id, label })), next: figures.next };
}

function coverSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2560" viewBox="0 0 1600 2560"><defs><linearGradient id="top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#041018" stop-opacity=".99"/><stop offset=".76" stop-color="#041018" stop-opacity=".8"/><stop offset="1" stop-color="#041018" stop-opacity="0"/></linearGradient><linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#041018" stop-opacity="0"/><stop offset="1" stop-color="#041018" stop-opacity=".97"/></linearGradient></defs><rect width="1600" height="1220" fill="url(#top)"/><rect y="1960" width="1600" height="600" fill="url(#bottom)"/><rect x="76" y="76" width="1448" height="2408" rx="2" fill="none" stroke="#4b7d88" stroke-width="3" opacity=".88"/><path d="M112 210H1488" stroke="#34525d" stroke-width="2"/><text x="112" y="158" fill="#67decf" font-family="Courier New,monospace" font-size="40">l0g_ / ENQUÊTE EN SOURCES OUVERTES</text><text x="112" y="284" fill="#a7b8c6" font-family="Courier New,monospace" font-size="27" font-weight="700" letter-spacing="2">SIX VOLETS  ·  VINGT INFOGRAPHIES</text><g font-family="Arial,Helvetica,sans-serif" font-weight="850" fill="#f5f2ec"><text x="106" y="478" font-size="138">L’EAU</text><text x="106" y="646" font-size="148">DERRIÈRE</text><text x="106" y="824" font-size="158">L’ÉLECTRICITÉ</text></g><rect x="112" y="884" width="860" height="10" fill="#e8ad49"/><g font-family="Arial,Helvetica,sans-serif" font-size="37" font-weight="750" fill="#d9e0e7" letter-spacing="1"><text x="112" y="958">DANUBE · BARRAGES · CENTRALES</text><text x="112" y="1014">RÉSEAU · COÛTS · ADAPTATION</text></g><g font-family="Courier New,monospace"><rect x="112" y="2194" width="520" height="54" rx="27" fill="#071d24" stroke="#62dfd0"/><text x="372" y="2230" text-anchor="middle" fill="#86eadf" font-size="25" font-weight="700">ÉDITION PUBLIQUE · 21.08.2026</text><text x="112" y="2350" fill="#c8d3db" font-size="30">Du niveau du fleuve au coût du MWh.</text><text x="112" y="2403" fill="#8fa2af" font-size="29">Une enquête sur le combustible invisible.</text><text x="112" y="2456" fill="#748994" font-size="27">l0g.fr  ·  2026</text></g></svg>`;
}

function writeStructuralFiles(rendered) {
  const intro = `<section id="introduction" class="level1"><p class="chapter-kicker">Introduction</p><h1>L’électricité a besoin d’eau</h1><p class="chapter-dek">Six enquêtes pour suivre un mégawatt depuis le niveau d’un fleuve jusqu’au coût de son adaptation.</p><p>Quand on allume une lampe, l’eau n’apparaît sur aucune facture. Elle est pourtant partout dans le système électrique européen : devant une pompe sur le Danube, dans le Rhône qui reçoit de la chaleur, derrière un barrage qui choisit son heure, dans les tours d’une centrale et jusque dans les modèles qui promettent que l’offre couvrira la demande.</p><p>Cette série part d’incidents très concrets de l’été 2026. En Roumanie et en Hongrie, quelques centimètres de niveau ont séparé la production de l’arrêt. En France, des règles thermiques ont relié la température des fleuves aux besoins du réseau. Ailleurs, les réserves hydroélectriques ont montré que garder l’eau peut valoir davantage que produire immédiatement.</p><h2 id="fil-enquete">Le fil de l’enquête</h2><p>Les six chapitres changent progressivement d’échelle. Le premier mesure le prix d’un centimètre au droit d’une prise d’eau. Le deuxième demande quelles centrales européennes dépendent réellement d’un fleuve, d’une mer ou d’une nappe. Le troisième suit les limites de rejet thermique. Le quatrième entre dans l’arbitrage des barrages. Le cinquième confronte le modèle d’adéquation à ses coûts physiques. Le dernier compare les options d’adaptation, des tours au refroidissement sec.</p><p>Le résultat tient en une idée simple : un mégawatt n’est pas seulement une machine et un combustible. Il dépend aussi d’un lieu, d’une géométrie de prise, d’une température, d’un débit, d’un stock et d’une règle d’exploitation.</p><h2 id="methode-enquete">Ce que les sources permettent de mesurer</h2><p>L’enquête privilégie les textes officiels, décisions environnementales, données d’opérateurs, rapports publics et publications scientifiques. Les informations de presse servent à établir une chronologie ou à attribuer une déclaration lorsque la pièce primaire ne suffit pas.</p><p>Les coûts publiés ne donnent pas toujours leur dénominateur. Un chantier peut être chiffré sans révéler les mégawattheures qu’il sécurise. Un modèle peut conclure à une adéquation suffisante sans comptabiliser le coût physique des pompes, imports ou réserves qui rendent ce résultat possible. Ces manques restent visibles dans l’édition.</p><h2 id="etat-corpus">Un état public daté</h2><p>Les chapitres correspondent aux versions servies sur l0g.fr le 21 août 2026, révision <code>${SOURCE_REVISION}</code>. Les faits, estimations, scénarios et inconnues conservent le statut donné dans chaque article. Les liens canoniques permettent de consulter les corrections ultérieures.</p><aside class="reading-guide" id="guide-lecture"><h2>Comment lire cette édition</h2><ul><li>Les six chapitres suivent la chaîne physique de l’eau et de l’électricité.</li><li>Les sources, dates, unités et limites restent attachées aux analyses.</li><li>Les 20 infographies disposent d’une alternative textuelle.</li><li>Chaque outil interactif reste accessible sur le site, sans pistage.</li></ul></aside></section>`;
  writeFileSync(join(TEXT_ROOT, 'ch001.xhtml'), xhtmlDocument({ title: 'Introduction', body: intro }));
  const conclusion = `<section id="conclusion" class="level1"><h1>Conclusion : compter l’électricité avec son eau</h1><p>Les six volets convergent vers la même méthode. Il faut relier chaque unité de production à sa ressource de refroidissement, à ses seuils, à ses pertes possibles et au coût des réponses disponibles. Sans cette chaîne, les registres de capacité surestiment ce que le système sait réellement garantir pendant un épisode extrême.</p><p>Aucune adaptation ne fait disparaître la contrainte. Un seuil modifie le fleuve, une tour réduit le prélèvement tout en augmentant l’évaporation, le refroidissement sec paie l’économie d’eau par le rendement, et le réseau déplace le problème vers les imports, le stockage ou la demande. La bonne décision dépend du site et du nombre de mégawattheures effectivement protégés.</p><p>La suite logique consiste à publier ces dénominateurs. MW sécurisés, MWh de déclassement évités, durée de vie, consommation nette d’eau, effets écologiques et coût complet devraient accompagner chaque investissement. L’électricité deviendrait alors plus simple à comparer, parce que son eau ne resterait plus invisible.</p></section>`;
  writeFileSync(join(TEXT_ROOT, 'ch008.xhtml'), xhtmlDocument({ title: 'Conclusion', body: conclusion }));
  const links = rendered.map((article) => `<li><a href="${SITE}${article.route}">${escapeXml(article.title)}</a></li>`).join('');
  const about = `<section id="a-propos" class="level1"><h1>À propos de cette édition</h1><p class="colophon"><strong>L’eau derrière l’électricité</strong> réunit six enquêtes publiées par l0g les 20 et 21 août 2026. Cette édition EPUB 3 a été préparée le 21 août 2026 avec un ordre de lecture explicite, un sommaire structuré, 20 infographies adaptées et des liens vers six outils pédagogiques.</p><h2>Articles canoniques</h2><ol class="original-articles">${links}</ol><p>Textes sous licence <a href="https://creativecommons.org/licenses/by/4.0/deed.fr">Creative Commons Attribution 4.0 International</a>.</p></section>`;
  writeFileSync(join(TEXT_ROOT, 'ch009.xhtml'), xhtmlDocument({ title: 'À propos de cette édition', body: about }));
}

function entries(rendered) {
  return [{ title: 'Introduction', href: 'text/ch001.xhtml', children: [{ title: 'Comment lire cette édition', href: 'text/ch001.xhtml#guide-lecture' }] }, ...rendered.map((article) => ({ title: article.title, href: `text/${article.chapter}`, children: article.headings.map((heading) => ({ title: heading.label, href: `text/${article.chapter}#${heading.id}` })) })), { title: 'Conclusion', href: 'text/ch008.xhtml' }, { title: 'À propos de cette édition', href: 'text/ch009.xhtml' }];
}

function writeNavigation(rendered) {
  const toc = entries(rendered);
  const list = (items) => `<ol>${items.map((item) => `<li><a href="${item.href}">${escapeXml(item.title)}</a>${item.children?.length ? list(item.children) : ''}</li>`).join('')}</ol>`;
  writeFileSync(join(EPUB_ROOT, 'nav.xhtml'), `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="fr" xml:lang="fr"><head><meta charset="utf-8"/><title>L’eau derrière l’électricité</title><link rel="stylesheet" href="styles/stylesheet1.css" type="text/css"/></head><body epub:type="frontmatter"><nav epub:type="toc" id="toc"><h1>L’eau derrière l’électricité</h1>${list(toc)}</nav><nav epub:type="landmarks" hidden="hidden"><ol><li><a href="text/cover.xhtml" epub:type="cover">Couverture</a></li><li><a href="text/title_page.xhtml" epub:type="titlepage">Page de titre</a></li></ol></nav></body></html>\n`);
  let order = 0;
  const points = (items) => items.map((item) => { order += 1; const current = order; return `<navPoint id="navPoint-${current}" playOrder="${current}"><navLabel><text>${escapeXml(item.title)}</text></navLabel><content src="${item.href}"/>${item.children?.length ? points(item.children) : ''}</navPoint>`; }).join('');
  writeFileSync(join(EPUB_ROOT, 'toc.ncx'), `<?xml version="1.0" encoding="UTF-8"?><ncx version="2005-1" xmlns="http://www.daisy.org/z3986/2005/ncx/"><head><meta name="dtb:uid" content="${BOOK_ID}"/><meta name="dtb:depth" content="2"/></head><docTitle><text>L’eau derrière l’électricité</text></docTitle><navMap>${points(toc)}</navMap></ncx>\n`);
}

function writePackage(infographicCount) {
  const chapters = Array.from({ length: 9 }, (_, i) => String(i + 1).padStart(3, '0'));
  const manifest = chapters.map((ch) => `<item id="ch${ch}" href="text/ch${ch}.xhtml" media-type="application/xhtml+xml"/>`).join('');
  const spine = chapters.map((ch) => `<itemref idref="ch${ch}"/>`).join('');
  const media = Array.from({ length: infographicCount }, (_, i) => `<item id="file${i}" href="media/file${i}.svg" media-type="image/svg+xml"/>`).join('');
  writeFileSync(join(EPUB_ROOT, 'content.opf'), `<?xml version="1.0" encoding="UTF-8"?><package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id" prefix="schema: http://schema.org/"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${BOOK_ID}</dc:identifier><dc:title>L’eau derrière l’électricité</dc:title><dc:language>fr</dc:language><dc:creator>l0g</dc:creator><dc:date>2026-08-21</dc:date><dc:subject>eau et électricité</dc:subject><dc:subject>Danube</dc:subject><dc:subject>refroidissement des centrales</dc:subject><dc:subject>hydroélectricité</dc:subject><dc:description>Six enquêtes illustrées sur l’eau, les centrales, les barrages, l’adéquation électrique et le coût de l’adaptation en Europe.</dc:description><dc:publisher>l0g.fr</dc:publisher><dc:rights>Creative Commons Attribution 4.0 International (CC BY 4.0).</dc:rights><dc:source>${BOOK_URL}</dc:source><meta property="dcterms:modified">${MODIFIED}</meta><meta name="cover" content="cover-image"/><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityHazard">none</meta><meta property="schema:accessibilitySummary">Ordre de lecture explicite, sommaire structuré et description textuelle des infographies.</meta></metadata><manifest><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="css" href="styles/stylesheet1.css" media-type="text/css"/><item id="cover" href="text/cover.xhtml" media-type="application/xhtml+xml" properties="svg"/><item id="title" href="text/title_page.xhtml" media-type="application/xhtml+xml"/><item id="cover-image" href="media/cover.png" media-type="image/png" properties="cover-image"/>${manifest}${media}</manifest><spine toc="ncx"><itemref idref="cover"/><itemref idref="title"/><itemref idref="nav"/>${spine}</spine><guide><reference type="cover" title="Couverture" href="text/cover.xhtml"/><reference type="toc" title="Sommaire" href="nav.xhtml"/></guide></package>\n`);
}

async function generate() {
  rmSync(SOURCE_ROOT, { recursive: true, force: true });
  for (const directory of [MEDIA_ROOT, TEXT_ROOT, join(EPUB_ROOT, 'styles'), join(SOURCE_ROOT, 'META-INF'), PUBLICATION_ROOT]) mkdirSync(directory, { recursive: true });
  for (const file of ['mimetype', 'META-INF/container.xml', 'META-INF/com.apple.ibooks.display-options.xml']) copyFileSync(join(TEMPLATE_ROOT, file), join(SOURCE_ROOT, file));
  copyFileSync(join(TEMPLATE_ROOT, 'EPUB/styles/stylesheet1.css'), join(EPUB_ROOT, 'styles/stylesheet1.css'));
  const artwork = await sharp(COVER_ART).resize(1600, 2560, { fit: 'cover', position: 'centre' }).png().toBuffer();
  const cover = await sharp(artwork).composite([{ input: Buffer.from(coverSvg()) }]).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
  writeFileSync(join(MEDIA_ROOT, 'cover.png'), cover);
  writeFileSync(join(PUBLICATION_ROOT, 'eau-electricite-cover.png'), cover);
  writeFileSync(join(TEXT_ROOT, 'cover.xhtml'), `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xmlns:xlink="http://www.w3.org/1999/xlink" lang="fr"><head><meta charset="utf-8"/><title>Couverture</title></head><body epub:type="frontmatter cover"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1600 2560"><image width="1600" height="2560" xlink:href="../media/cover.png"/></svg></body></html>\n`);
  writeFileSync(join(TEXT_ROOT, 'title_page.xhtml'), xhtmlDocument({ title: 'L’eau derrière l’électricité', body: '<section class="titlepage" epub:type="titlepage"><h1 class="title">L’eau derrière l’électricité</h1><p class="subtitle">Danube, barrages, centrales, réseau et adaptation</p><p class="author">l0g</p><p class="publisher">l0g.fr</p><p class="date">21 août 2026</p><p class="rights">Creative Commons Attribution 4.0 International</p></section>', bodyType: 'frontmatter' }));
  const rendered = [];
  let offset = 0;
  for (const article of articles) { const result = await renderArticle(article, offset); rendered.push(result); offset = result.next; }
  if (offset !== 20) throw new Error(`20 infographies attendues, ${offset} produites`);
  writeStructuralFiles(rendered);
  writeNavigation(rendered);
  writePackage(offset);
  const fingerprint = createHash('sha256').update(articles.map((article) => readFileSync(join(ROOT, 'src/content/posts', article.file))).join('\n')).digest('hex');
  console.log(`Source EPUB Eau et électricité générée : 6 enquêtes, 20 infographies, source ${fingerprint.slice(0, 12)}`);
}

generate().catch((error) => { console.error(error); process.exitCode = 1; });
