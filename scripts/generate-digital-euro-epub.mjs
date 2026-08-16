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
const SOURCE_ROOT = join(ROOT, 'src/epub/euro-numerique');
const EPUB_ROOT = join(SOURCE_ROOT, 'EPUB');
const MEDIA_ROOT = join(EPUB_ROOT, 'media');
const TEXT_ROOT = join(EPUB_ROOT, 'text');
const TEMPLATE_ROOT = join(ROOT, 'src/epub/l-argent-d-epstein');
const COVER_ART = join(ROOT, 'src/epub-assets/euro-numerique-cover-art.png');
const PUBLICATION_ROOT = join(ROOT, 'public/publications');
const SITE = 'https://l0g.fr';
const BOOK_URL = `${SITE}/publications/euro-numerique-enquete/`;
const BOOK_ID = 'urn:uuid:3db87d1a-c9ea-54ea-8d15-71bd5477f318';
const MODIFIED = '2026-08-16T10:00:00Z';

const articles = [
  ['euro-numerique-1-euro-change-de-debiteur.mdx', 'euro-numerique-1-euro-change-de-debiteur', '13 août 2026', 1],
  ['euro-numerique-2-699-milliards-anatomie-stress-test.mdx', 'euro-numerique-2-699-milliards-anatomie-stress-test', '13 août 2026', 2],
  ['euro-numerique-3-prive-comme-du-cash.mdx', 'euro-numerique-3-prive-comme-du-cash', '14 août 2026', 3],
  ['euro-numerique-4-argent-programmable-frontiere-juridique.mdx', 'euro-numerique-4-argent-programmable-frontiere-juridique', '14 août 2026', 4],
  ['euro-numerique-5-prix-souverainete.mdx', 'euro-numerique-5-prix-souverainete', '14 août 2026', 5],
  ['euro-numerique-6-qui-controle-machine.mdx', 'euro-numerique-6-qui-controle-machine', '15 août 2026', 6],
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
  return source
    .replace(/^---\n[\s\S]*?\n---\n/u, '')
    .replace(/^import\s+[^\n]+\n/gmu, '')
    .replace(/<style>\{`[\s\S]*?`\}<\/style>/gu, '')
    .replace(
      /<DigitalEuroCostSimulator\s+lang="fr"\s*\/>/gu,
      '> **Simulateur interactif.** Le modèle de coût reste disponible sur [l0g.fr](/outils/prix-euro-numerique/). Cette édition conserve les hypothèses, les formules et l’analyse du chapitre, mais n’embarque aucun script.',
    );
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
  const shortTitle = title.replace(/^Euro numérique, \d\/6 : /u, '');
  const chapterTitle = `${shortTitle.charAt(0).toLocaleUpperCase('fr-FR')}${shortTitle.slice(1)}`;
  const body = `<section id="article-${article.number}" class="level1 article-chapter"><p class="chapter-kicker">Volet ${article.number} sur 6</p><h1>${escapeXml(chapterTitle)}</h1><p class="chapter-dek">${escapeXml(description)}</p><p class="chapter-meta">Publié le ${article.date} · <a href="${SITE}${article.route}">Article canonique sur l0g.fr</a></p>${sectioned.html}</section>`;
  writeFileSync(join(TEXT_ROOT, article.chapter), xhtmlDocument({ title, body }));
  return { ...article, title, description, headings: sectioned.headings.map(({ id, label }) => ({ id, label })), next: figures.next };
}

function coverSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2560" viewBox="0 0 1600 2560"><defs><linearGradient id="top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b10" stop-opacity=".98"/><stop offset=".66" stop-color="#070b10" stop-opacity=".88"/><stop offset="1" stop-color="#070b10" stop-opacity="0"/></linearGradient><linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#070b10" stop-opacity="0"/><stop offset="1" stop-color="#070b10" stop-opacity=".96"/></linearGradient></defs><rect width="1600" height="1040" fill="url(#top)"/><rect y="1980" width="1600" height="580" fill="url(#bottom)"/><rect x="76" y="76" width="1448" height="2408" rx="2" fill="none" stroke="#567080" stroke-width="3" opacity=".82"/><path d="M112 210H1488" stroke="#314655" stroke-width="2"/><text x="112" y="158" fill="#67decf" font-family="Courier New,monospace" font-size="40">l0g_ / ENQUÊTE EN SOURCES OUVERTES</text><text x="112" y="284" fill="#9eabb8" font-family="Courier New,monospace" font-size="27" font-weight="700" letter-spacing="2">SIX VOLETS  ·  VINGT-DEUX INFOGRAPHIES</text><g font-family="Arial,Helvetica,sans-serif" font-weight="850" fill="#f5f2ec"><text x="106" y="484" font-size="132">L’EURO</text><text x="106" y="654" font-size="178">NUMÉRIQUE</text></g><rect x="112" y="716" width="732" height="10" fill="#e8ad49"/><g font-family="Arial,Helvetica,sans-serif" font-size="40" font-weight="750" fill="#d9e0e7" letter-spacing="1"><text x="112" y="790">BILANS · DONNÉES · DROIT</text><text x="112" y="848">COÛTS · INFRASTRUCTURE</text></g><g font-family="Courier New,monospace"><rect x="112" y="2200" width="458" height="54" rx="27" fill="#0b1d21" stroke="#62dfd0"/><text x="341" y="2236" text-anchor="middle" fill="#86eadf" font-size="25" font-weight="700">ÉTAT DU DOSSIER · 16.08.2026</text><text x="112" y="2352" fill="#c0c9d1" font-size="30">Ce qui changerait vraiment.</text><text x="112" y="2402" fill="#8d9aa7" font-size="30">Ce que le projet ne décide pas encore.</text><text x="112" y="2456" fill="#74828e" font-size="27">l0g.fr  ·  2026</text></g></svg>`;
}

function writeStructuralFiles(rendered) {
  const intro = `<section id="introduction" class="level1"><p class="chapter-kicker">Introduction</p><h1>Enquêter sur une monnaie qui n’existe pas encore</h1><p class="chapter-dek">Une enquête en sources ouvertes sur l’euro numérique, ses pièces publiques et les décisions que ces pièces ne permettent pas encore de connaître.</p><p>L’euro numérique produit déjà des certitudes très assurées. Il supprimerait le cash, permettrait de surveiller chaque achat, sauverait la souveraineté européenne ou fragiliserait les banques. Le problème est que l’objet décrit par ces affirmations n’existe pas encore. Le règlement n’est pas adopté, la décision d’émettre n’est pas prise et plusieurs paramètres déterminants restent en négociation.</p><p>Comment enquêter sur un système absent du monde réel ? En traitant le projet comme une infrastructure en construction et non comme une promesse de communication. Il faut partir des traces qu’il laisse déjà : textes législatifs, mandats de négociation, rapports de stabilité financière, projets de règles, marchés publics, estimations de coûts, contrats-cadres, auditions, lettres et documents techniques.</p><h2 id="sources-ouvertes">Ce que signifie « sources ouvertes »</h2><p>Une source ouverte n’est pas seulement une page accessible sans mot de passe. C’est une pièce dont l’origine, la date, le statut et le périmètre peuvent être contrôlés par le lecteur. Dans cette enquête, les documents de la Banque centrale européenne, du Conseil de l’Union européenne, de la Commission, du Parlement et des autorités publiques constituent le premier niveau de preuve. Les travaux académiques et professionnels servent à tester une méthode ou à éclairer un angle. Les estimations commandées par une partie prenante restent attribuées à cette partie prenante.</p><p>Cette hiérarchie évite de mettre sur le même plan un article de règlement proposé, un scénario demandé aux banques, un plafond contractuel de marché public et une dépense effectivement engagée. Tous sont des chiffres publiés. Ils ne décrivent pourtant ni la même réalité, ni le même degré de décision.</p><h2 id="methode-enquete">La méthode de l’enquête</h2><p>Les six volets suivent l’euro numérique couche après couche. Le premier identifie le débiteur inscrit derrière l’unité monétaire. Le deuxième reconstruit le stress test bancaire de la BCE. Le troisième cartographie les données et les possibilités de rapprochement. Le quatrième sépare monnaie programmable, paiement conditionnel et contrôle légal. Le cinquième compare des coûts dont les périmètres divergent. Le dernier entre dans les marchés publics, le code, les clés, les appareils et la réversibilité.</p><p>Chaque chapitre applique la même discipline. Un fait adopté est distingué d’une proposition. Une valeur de test n’est pas présentée comme un choix final. Un plafond contractuel n’est pas transformé en dépense. Une absence de document public est décrite comme une limite de vérification, pas comme la preuve d’un dispositif caché. Lorsqu’une affirmation ne peut pas être reproduite avec le corpus disponible, le manque reste visible.</p><h2 id="limites-enquete">Ce que cette enquête ne peut pas établir</h2><p>Les sources ouvertes ne donnent pas accès aux données prudentielles banque par banque utilisées dans le stress test. Elles ne publient pas tous les sous-traitants, toutes les clauses de sortie, la répartition complète du code, la garde des clés ou le détail final des données antifraude. Elles ne permettent pas davantage de prédire l’adoption, l’usage ou le coût total du système.</p><p>Ces limites ne réduisent pas l’enquête à un commentaire de documents. Elles en définissent le résultat. Le corpus public permet de montrer ce que l’architecture déplacerait, qui verrait quelles données, où se situeraient les dépendances et quelles questions doivent encore recevoir une réponse vérifiable.</p><aside class="reading-guide" id="guide-lecture"><h2>Comment lire cette édition</h2><ul><li>Les faits établis sont séparés des hypothèses de test et des choix encore ouverts.</li><li>Chaque chapitre conserve ses sources cliquables et ses limites.</li><li>Les 22 infographies disposent d’une alternative textuelle.</li><li>Le simulateur du chapitre 5 reste accessible sur le site, sans pistage.</li></ul></aside></section>`;
  writeFileSync(join(TEXT_ROOT, 'ch001.xhtml'), xhtmlDocument({ title: 'Introduction', body: intro }));
  const conclusion = `<section id="conclusion" class="level1"><h1>Conclusion : une monnaie publique, une architecture à contrôler</h1><p>Les six volets convergent sur un constat : la qualité publique de la créance ne suffit pas à décrire le système. Le plafond organise le passage entre bilans, la confidentialité dépend de la séparation des données, la non-programmabilité n’abolit pas les contrôles juridiques, et la souveraineté se mesure à la capacité de reprendre chaque composant.</p><p>Le règlement final, le plafond, les commissions, plusieurs paramètres du hors ligne et une partie des contrats restent ouverts. Ces inconnues ne sont pas un angle mort à combler par une prédiction. Elles constituent l’état exact du dossier au 16 août 2026.</p></section>`;
  writeFileSync(join(TEXT_ROOT, 'ch008.xhtml'), xhtmlDocument({ title: 'Conclusion', body: conclusion }));
  const links = rendered.map((article) => `<li><a href="${SITE}${article.route}">${escapeXml(article.title)}</a></li>`).join('');
  const about = `<section id="a-propos" class="level1"><h1>À propos de cette édition</h1><p class="colophon"><strong>L’euro numérique</strong> réunit six enquêtes publiées par l0g du 13 au 15 août 2026. L’édition EPUB 3 a été préparée le 16 août 2026 avec un ordre de lecture explicite, un sommaire structuré et 22 infographies adaptées.</p><h2>Articles canoniques</h2><ol class="original-articles">${links}</ol><p>Textes sous licence <a href="https://creativecommons.org/licenses/by/4.0/deed.fr">Creative Commons Attribution 4.0 International</a>.</p></section>`;
  writeFileSync(join(TEXT_ROOT, 'ch009.xhtml'), xhtmlDocument({ title: 'À propos de cette édition', body: about }));
}

function entries(rendered) {
  return [{ title: 'Introduction', href: 'text/ch001.xhtml', children: [{ title: 'Comment lire cette édition', href: 'text/ch001.xhtml#guide-lecture' }] }, ...rendered.map((article) => ({ title: article.title, href: `text/${article.chapter}`, children: article.headings.map((heading) => ({ title: heading.label, href: `text/${article.chapter}#${heading.id}` })) })), { title: 'Conclusion', href: 'text/ch008.xhtml' }, { title: 'À propos de cette édition', href: 'text/ch009.xhtml' }];
}

function writeNavigation(rendered) {
  const toc = entries(rendered);
  const list = (items) => `<ol>${items.map((item) => `<li><a href="${item.href}">${escapeXml(item.title)}</a>${item.children?.length ? list(item.children) : ''}</li>`).join('')}</ol>`;
  writeFileSync(join(EPUB_ROOT, 'nav.xhtml'), `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="fr" xml:lang="fr"><head><meta charset="utf-8"/><title>L’euro numérique</title><link rel="stylesheet" href="styles/stylesheet1.css" type="text/css"/></head><body epub:type="frontmatter"><nav epub:type="toc" id="toc"><h1>L’euro numérique</h1>${list(toc)}</nav><nav epub:type="landmarks" hidden="hidden"><ol><li><a href="text/cover.xhtml" epub:type="cover">Couverture</a></li><li><a href="text/title_page.xhtml" epub:type="titlepage">Page de titre</a></li></ol></nav></body></html>\n`);
  let order = 0;
  const points = (items) => items.map((item) => { order += 1; const current = order; return `<navPoint id="navPoint-${current}" playOrder="${current}"><navLabel><text>${escapeXml(item.title)}</text></navLabel><content src="${item.href}"/>${item.children?.length ? points(item.children) : ''}</navPoint>`; }).join('');
  writeFileSync(join(EPUB_ROOT, 'toc.ncx'), `<?xml version="1.0" encoding="UTF-8"?><ncx version="2005-1" xmlns="http://www.daisy.org/z3986/2005/ncx/"><head><meta name="dtb:uid" content="${BOOK_ID}"/><meta name="dtb:depth" content="2"/></head><docTitle><text>L’euro numérique</text></docTitle><navMap>${points(toc)}</navMap></ncx>\n`);
}

function writePackage(infographicCount) {
  const chapters = Array.from({ length: 9 }, (_, i) => String(i + 1).padStart(3, '0'));
  const manifest = chapters.map((ch) => `<item id="ch${ch}" href="text/ch${ch}.xhtml" media-type="application/xhtml+xml"/>`).join('');
  const spine = chapters.map((ch) => `<itemref idref="ch${ch}"/>`).join('');
  const media = Array.from({ length: infographicCount }, (_, i) => `<item id="file${i}" href="media/file${i}.svg" media-type="image/svg+xml"/>`).join('');
  writeFileSync(join(EPUB_ROOT, 'content.opf'), `<?xml version="1.0" encoding="UTF-8"?><package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id" prefix="schema: http://schema.org/"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${BOOK_ID}</dc:identifier><dc:title>L’euro numérique</dc:title><dc:language>fr</dc:language><dc:creator>l0g</dc:creator><dc:date>2026-08-16</dc:date><dc:subject>euro numérique</dc:subject><dc:subject>Banque centrale européenne</dc:subject><dc:subject>paiements</dc:subject><dc:subject>souveraineté</dc:subject><dc:description>Six enquêtes sur la nature monétaire, la stabilité bancaire, les données, le droit, les coûts et l’infrastructure de l’euro numérique.</dc:description><dc:publisher>l0g.fr</dc:publisher><dc:rights>Creative Commons Attribution 4.0 International (CC BY 4.0).</dc:rights><dc:source>${BOOK_URL}</dc:source><meta property="dcterms:modified">${MODIFIED}</meta><meta name="cover" content="cover-image"/><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityHazard">none</meta><meta property="schema:accessibilitySummary">Ordre de lecture explicite, sommaire structuré et description textuelle des infographies.</meta></metadata><manifest><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="css" href="styles/stylesheet1.css" media-type="text/css"/><item id="cover" href="text/cover.xhtml" media-type="application/xhtml+xml" properties="svg"/><item id="title" href="text/title_page.xhtml" media-type="application/xhtml+xml"/><item id="cover-image" href="media/cover.png" media-type="image/png" properties="cover-image"/>${manifest}${media}</manifest><spine toc="ncx"><itemref idref="cover"/><itemref idref="title"/><itemref idref="nav"/>${spine}</spine><guide><reference type="cover" title="Couverture" href="text/cover.xhtml"/><reference type="toc" title="Sommaire" href="nav.xhtml"/></guide></package>\n`);
}

async function generate() {
  rmSync(SOURCE_ROOT, { recursive: true, force: true });
  for (const directory of [MEDIA_ROOT, TEXT_ROOT, join(EPUB_ROOT, 'styles'), join(SOURCE_ROOT, 'META-INF'), PUBLICATION_ROOT]) mkdirSync(directory, { recursive: true });
  for (const file of ['mimetype', 'META-INF/container.xml', 'META-INF/com.apple.ibooks.display-options.xml']) copyFileSync(join(TEMPLATE_ROOT, file), join(SOURCE_ROOT, file));
  copyFileSync(join(TEMPLATE_ROOT, 'EPUB/styles/stylesheet1.css'), join(EPUB_ROOT, 'styles/stylesheet1.css'));
  const artwork = await sharp(COVER_ART).resize(1600, 2560, { fit: 'cover', position: 'centre' }).png().toBuffer();
  const cover = await sharp(artwork).composite([{ input: Buffer.from(coverSvg()) }]).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
  writeFileSync(join(MEDIA_ROOT, 'cover.png'), cover);
  writeFileSync(join(PUBLICATION_ROOT, 'euro-numerique-cover.png'), cover);
  writeFileSync(join(TEXT_ROOT, 'cover.xhtml'), `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xmlns:xlink="http://www.w3.org/1999/xlink" lang="fr"><head><meta charset="utf-8"/><title>Couverture</title></head><body epub:type="frontmatter cover"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1600 2560"><image width="1600" height="2560" xlink:href="../media/cover.png"/></svg></body></html>\n`);
  writeFileSync(join(TEXT_ROOT, 'title_page.xhtml'), xhtmlDocument({ title: 'L’euro numérique', body: '<section class="titlepage" epub:type="titlepage"><h1 class="title">L’euro numérique</h1><p class="subtitle">Bilans, données, droit, coûts et souveraineté</p><p class="author">l0g</p><p class="publisher">l0g.fr</p><p class="date">16 août 2026</p><p class="rights">Creative Commons Attribution 4.0 International</p></section>', bodyType: 'frontmatter' }));
  const rendered = [];
  let offset = 0;
  for (const article of articles) { const result = await renderArticle(article, offset); rendered.push(result); offset = result.next; }
  if (offset !== 22) throw new Error(`22 infographies attendues, ${offset} produites`);
  writeStructuralFiles(rendered);
  writeNavigation(rendered);
  writePackage(offset);
  const fingerprint = createHash('sha256').update(articles.map((article) => readFileSync(join(ROOT, 'src/content/posts', article.file))).join('\n')).digest('hex');
  console.log(`Source EPUB Euro numérique générée : 6 enquêtes, 22 infographies, source ${fingerprint.slice(0, 12)}`);
}

generate().catch((error) => { console.error(error); process.exitCode = 1; });
