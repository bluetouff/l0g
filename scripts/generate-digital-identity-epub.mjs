import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeStringify from 'rehype-stringify';
import sharp from 'sharp';
import {
  escapeXml,
  extractInfographics,
  frontmatter,
  normalizeVoidElements,
  rewriteLinks,
  sectionHeadings,
  xhtmlDocument,
} from './generate-e-invoicing-epub-lib.mjs';

const ROOT = resolve(new URL('..', import.meta.url).pathname);
const TEMPLATE_ROOT = join(ROOT, 'src/epub/l-argent-d-epstein');
const SOURCE_ROOT = join(ROOT, 'src/epub/votre-identite-dans-un-telephone');
const EPUB_ROOT = join(SOURCE_ROOT, 'EPUB');
const MEDIA_ROOT = join(EPUB_ROOT, 'media');
const TEXT_ROOT = join(EPUB_ROOT, 'text');
const PUBLICATION_ROOT = join(ROOT, 'public/publications');
const COVER_ART = join(ROOT, 'src/epub-assets/votre-identite-dans-un-telephone-cover-art.png');
const SITE = 'https://l0g.fr';
const MODIFIED = '2026-08-29T08:53:27Z';
const BOOK_ID = 'urn:uuid:9f6ea653-c7b4-5f72-9a0f-6e47afc9a66d';
const TITLE = 'Votre identité dans un téléphone';
const SUBTITLE = 'France Identité, portefeuille européen et preuves de souveraineté';
const PUBLICATION_PAGE = '/publications/votre-identite-dans-un-telephone/';
const COVER_FILE = 'votre-identite-dans-un-telephone-cover.png';
const INFOGRAPHIC_COUNT = 23;
const DISCLOSURE_COUNT = 34;

const DISCLOSURE_CSS = `
/* Les boîtes interactives du site deviennent des sections statiques dans l’EPUB. */
.epub-disclosure {
  margin: 1.15em 0;
  padding: 0.8em 0.95em;
  border: 1px solid #9ca6af;
  border-radius: 0.45em;
  color: inherit;
  page-break-inside: avoid;
  break-inside: avoid;
  hyphens: none;
  overflow-wrap: break-word;
}

.epub-disclosure-title {
  margin: 0 0 0.65em;
  padding: 0 0 0.5em;
  border: 0;
  border-bottom: 1px solid #cbd1d7;
  color: inherit;
  font-family: "Helvetica Neue", Arial, sans-serif;
  font-size: 1em;
  line-height: 1.35;
  hyphens: none;
}

.epub-disclosure p,
.epub-disclosure li,
.epub-disclosure strong,
.epub-disclosure div {
  color: inherit;
  font-size: 1em;
  line-height: 1.58;
  hyphens: none;
}
`;

const config = { lang: 'fr', locale: 'fr-FR', title: TITLE };

const articles = [
  {
    number: 1,
    file: 'votre-identite-dans-un-telephone-1-la-carte-d-identite-qui-devient-un-service.md',
    route: '/posts/votre-identite-dans-un-telephone-1-la-carte-d-identite-qui-devient-un-service/',
  },
  {
    number: 2,
    file: 'votre-identite-dans-un-telephone-2-facultative-mais-a-quel-prix.md',
    route: '/posts/votre-identite-dans-un-telephone-2-facultative-mais-a-quel-prix/',
  },
  {
    number: 3,
    file: 'votre-identite-dans-un-telephone-3-l-identite-souveraine-sous-contrat.md',
    route: '/posts/votre-identite-dans-un-telephone-3-l-identite-souveraine-sous-contrat/',
  },
  {
    number: 4,
    file: 'votre-identite-dans-un-telephone-4-votre-age-devient-une-autorisation.md',
    route: '/posts/votre-identite-dans-un-telephone-4-votre-age-devient-une-autorisation/',
  },
  {
    number: 5,
    file: 'votre-identite-dans-un-telephone-5-le-jour-ou-votre-identite-ne-repond-plus.md',
    route: '/posts/votre-identite-dans-un-telephone-5-le-jour-ou-votre-identite-ne-repond-plus/',
  },
  {
    number: 6,
    file: 'votre-identite-dans-un-telephone-6-votre-identite-est-gratuite-la-preuve-peut-etre-facturee.md',
    route: '/posts/votre-identite-dans-un-telephone-6-votre-identite-est-gratuite-la-preuve-peut-etre-facturee/',
  },
  {
    number: 7,
    file: 'votre-identite-dans-un-telephone-7-une-identite-souveraine-sur-un-telephone-americain.md',
    route: '/posts/votre-identite-dans-un-telephone-7-une-identite-souveraine-sur-un-telephone-americain/',
  },
  {
    number: 8,
    file: 'votre-identite-dans-un-telephone-8-votre-identite-doit-vous-laisser-un-recu.mdx',
    route: '/posts/votre-identite-dans-un-telephone-8-votre-identite-doit-vous-laisser-un-recu/',
  },
].map((article) => ({
  ...article,
  chapter: `ch${String(article.number + 1).padStart(3, '0')}.xhtml`,
}));

const introduction = {
  title: 'Introduction : huit preuves à demander avant de déléguer son identité',
  dek: 'Huit enquêtes pour suivre France Identité et le futur portefeuille européen depuis la carte physique jusqu’au journal de transaction.',
  paragraphs: [
    'Une carte d’identité se montre. Une identité numérique s’exécute. Entre le titre et le service qui le vérifie apparaissent un téléphone, une application, des serveurs, des certificats, des journaux, des prestataires et des règles de recours. Cette édition examine cette infrastructure couche après couche.',
    'France Identité aujourd’hui, l’identité numérique certifiée et le portefeuille européen EUDI ne désignent pas le même service. Les huit chapitres conservent cette distinction. Ils séparent aussi les obligations juridiques, les fonctions déjà disponibles, les expérimentations, les déclarations des acteurs et les informations qui restent absentes des documents publics.',
    'Le livre ne prédit ni panne générale ni basculement obligatoire. Il rassemble les pièces accessibles, montre où une preuve peut être vérifiée et formule les données nécessaires pour mesurer l’accès, le coût, la continuité, la souveraineté technique et la responsabilité.',
  ],
  readingTitle: 'Le fil de l’enquête',
  readingItems: [
    'Suivre les données et les traces lorsqu’une carte d’identité devient un service.',
    'Mesurer le coût réel des parcours alternatifs lorsque l’application reste facultative.',
    'Identifier qui tient le code, les clés, les contrats et la capacité de reprise.',
    'Comprendre comment une date de naissance devient une autorisation d’accès.',
    'Chronométrer la révocation, la récupération et les solutions de secours.',
    'Rendre visibles les coûts de la preuve, de la signature et de l’échec.',
    'Distinguer le contrôle de l’État de la dépendance au téléphone et à sa plateforme.',
    'Vérifier le demandeur, la donnée réclamée et le reçu laissé par la transaction.',
  ],
  stateTitle: 'Une édition datée et révisable',
  stateParagraph: 'Les chapitres reproduisent les versions publiées le 28 août 2026, avec la dernière mise à jour du huitième volet au 29 août 2026. Les liens canoniques donnent accès aux corrections ultérieures. L’outil interactif Qui demande quoi ? reste sur l0g.fr afin que l’EPUB demeure lisible hors ligne et n’embarque aucun script.',
};

const conclusion = {
  title: 'Conclusion : publier les preuves d’une identité contrôlable',
  paragraphs: [
    'Les huit enquêtes ne démontrent pas que France Identité échoue, que tous les téléphones seront exclus ou que chaque preuve deviendra payante. Elles établissent une méthode de contrôle. Une identité numérique doit pouvoir être examinée à travers ses données, ses alternatives, ses contrats, ses coûts, ses dépendances, ses incidents et ses traces.',
    'La souveraineté ne se résume pas au propriétaire de l’application. Elle dépend aussi de la capacité à auditer le code, remplacer un prestataire, récupérer après une panne, distribuer une mise à jour, expliquer un refus de compatibilité et préserver l’accès au droit lorsque le téléphone ne répond plus.',
    'Les preuves à publier sont concrètes : dictionnaire des données et durées de conservation, contenu des journaux, mesures d’accessibilité, délais des parcours alternatifs, dépendances techniques, exercices de réversibilité, coûts par transaction, statistiques d’incident, registre des services demandeurs et interface de contrôle lisible par machine.',
    'Le droit européen transforme une partie de ces exigences en propriétés testables. Leur présence dans un texte ne prouve pas encore la qualité de l’exécution française. Un reçu peut documenter une demande ou un échec sans attribuer automatiquement une responsabilité ni réparer un préjudice.',
    'L’identité numérique peut permettre de révéler moins de données, prouver un âge sans donner un nom, identifier celui qui demande et conserver la trace d’un refus. Ces bénéfices deviennent crédibles lorsque les preuves de fonctionnement, d’inclusion, de coût et de recours sont publiques. Alors l0g les comptera.',
  ],
};

function markdownBody(source) {
  return source
    .replace(/^---\n[\s\S]*?\n---\n/u, '')
    .replace(/^import\s+[^\n]+\n/gmu, '')
    .replace(
      /<EudiRequestAudit\s+lang="fr"\s+mode="embed"\s*\/>/gu,
      '> **Outil interactif.** [Qui demande quoi ?](/outils/qui-demande-quoi/) compare localement les catégories déclarées avec celles demandées et contrôle les champs minimaux du reçu. L’EPUB en conserve le contexte et les limites, sans embarquer de script.',
    );
}

function protectInfographicFigures(markdown) {
  const figures = [];
  const protectedMarkdown = markdown.replace(/<figure\b(?=[^>]*\bclass="[^"]*\binfographic\b[^"]*")[^>]*>[\s\S]*?<\/figure>/gu, (figure) => {
    const token = `epub-infographic-${figures.length}`;
    figures.push({ token, figure });
    return `<div data-epub-infographic="${token}"></div>`;
  });
  return {
    markdown: protectedMarkdown,
    restore(html) {
      return figures.reduce((restored, { token, figure }) => {
        const placeholder = `<div data-epub-infographic="${token}"></div>`;
        if (!restored.includes(placeholder)) throw new Error(`Missing infographic placeholder: ${token}`);
        return restored.replace(placeholder, figure);
      }, html);
    },
  };
}

function shortTitle(title) {
  const value = title.replace(/^Votre identité dans un téléphone,\s*\d\/8\s*:\s*/u, '');
  return `${value.charAt(0).toLocaleUpperCase('fr-FR')}${value.slice(1)}`;
}

function staticDisclosureHtml(html) {
  const disclosureCount = (html.match(/<details\b/gu) ?? []).length;
  const summaryCount = (html.match(/<summary\b/gu) ?? []).length;
  if (disclosureCount !== summaryCount) throw new Error(`Disclosure mismatch: ${disclosureCount} details, ${summaryCount} summaries`);
  return {
    count: disclosureCount,
    html: html
      .replace(/<details\b[^>]*>/gu, '<section class="epub-disclosure">')
      .replace(/<\/details>/gu, '</section>')
      .replace(/<summary\b[^>]*>/gu, '<h3 class="epub-disclosure-title">')
      .replace(/<\/summary>/gu, '</h3>')
      .replace(/\sstyle="[^"]*"/gu, '')
      .replace(/\stabindex="[^"]*"/gu, ''),
  };
}

function coverOverlaySvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2560" viewBox="0 0 1600 2560">
  <defs>
    <linearGradient id="top" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#03070b" stop-opacity=".99"/><stop offset=".72" stop-color="#03070b" stop-opacity=".76"/><stop offset="1" stop-color="#03070b" stop-opacity="0"/></linearGradient>
    <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#03070b" stop-opacity="0"/><stop offset="1" stop-color="#03070b" stop-opacity=".96"/></linearGradient>
  </defs>
  <rect width="1600" height="1120" fill="url(#top)"/>
  <rect y="1960" width="1600" height="600" fill="url(#bottom)"/>
  <rect x="72" y="72" width="1456" height="2416" fill="none" stroke="#38515f" stroke-width="3"/>
  <text x="110" y="154" fill="#62dfd1" font-family="Courier New,monospace" font-size="38">l0g_ / ENQUÊTE EN HUIT VOLETS</text>
  <text x="1490" y="154" text-anchor="end" fill="#8295a2" font-family="Courier New,monospace" font-size="27">29.08.2026</text>
  <path d="M110 204H1490" stroke="#38515f" stroke-width="2"/>
  <g fill="#f7f2e9" font-family="Arial,Helvetica,sans-serif" font-weight="900" letter-spacing="-5">
    <text x="104" y="390" font-size="148">VOTRE IDENTITÉ</text>
    <text x="104" y="565" font-size="148">DANS UN</text>
    <text x="104" y="740" font-size="154">TÉLÉPHONE</text>
  </g>
  <rect x="110" y="792" width="930" height="9" fill="#e8ad49"/>
  <text x="110" y="870" fill="#dce4e8" font-family="Arial,Helvetica,sans-serif" font-size="34" font-weight="700">FRANCE IDENTITÉ · PORTEFEUILLE EUROPÉEN</text>
  <text x="110" y="925" fill="#9fb0bb" font-family="Courier New,monospace" font-size="25">DONNÉES · ACCÈS · COÛTS · SOUVERAINETÉ · PREUVES</text>
  <g font-family="Courier New,monospace">
    <text x="110" y="2245" fill="#e8ad49" font-size="27" font-weight="700">8 ENQUÊTES · 23 INFOGRAPHIES · 6 OUTILS</text>
    <text x="110" y="2332" fill="#dce4e8" font-size="31">Ce que le téléphone permet. Ce que la preuve doit montrer.</text>
    <text x="110" y="2420" fill="#8295a2" font-size="27">l0g.fr · EPUB 3 · CC BY 4.0</text>
  </g>
  </svg>`;
}

function structuralBody(rendered) {
  const intro = `<section id="introduction" class="level1"><p class="chapter-kicker">Introduction</p><h1>${escapeXml(introduction.title)}</h1><p class="chapter-dek">${escapeXml(introduction.dek)}</p>${introduction.paragraphs.map((paragraph) => `<p>${escapeXml(paragraph)}</p>`).join('')}<h2 id="fil-enquete">${escapeXml(introduction.readingTitle)}</h2><ol>${introduction.readingItems.map((item) => `<li>${escapeXml(item)}</li>`).join('')}</ol><h2 id="etat-corpus">${escapeXml(introduction.stateTitle)}</h2><p>${escapeXml(introduction.stateParagraph)}</p></section>`;
  const ending = `<section id="conclusion" class="level1"><h1>${escapeXml(conclusion.title)}</h1>${conclusion.paragraphs.map((paragraph) => `<p>${escapeXml(paragraph)}</p>`).join('')}</section>`;
  const links = rendered.map((article) => `<li><a href="${SITE}${article.route}">${escapeXml(article.canonicalTitle)}</a></li>`).join('');
  const about = `<section id="about" class="level1"><h1>À propos de cette édition</h1><p class="colophon">${escapeXml(TITLE)} réunit huit enquêtes publiées par l0g les 28 et 29 août 2026. Cette édition EPUB 3 ajoute une introduction, une conclusion, un sommaire structuré, vingt-trois infographies adaptées et six outils pédagogiques.</p><h2>Articles canoniques</h2><ol class="original-articles">${links}</ol><p>Creative Commons Attribution 4.0 International : <a href="https://creativecommons.org/licenses/by/4.0/deed.fr">CC BY 4.0</a>.</p></section>`;
  return { intro, ending, about };
}

function navigationEntries(rendered) {
  return [
    { title: 'Introduction', href: 'text/ch001.xhtml', children: [{ title: introduction.readingTitle, href: 'text/ch001.xhtml#fil-enquete' }] },
    ...rendered.map((article) => ({
      title: `Volet ${article.number} : ${article.title}`,
      href: `text/${article.chapter}`,
      children: article.headings.map((heading) => ({ title: heading.label, href: `text/${article.chapter}#${heading.id}` })),
    })),
    { title: conclusion.title, href: 'text/ch010.xhtml' },
    { title: 'À propos de cette édition', href: 'text/ch011.xhtml' },
  ];
}

function writeNavigation(rendered) {
  const toc = navigationEntries(rendered);
  const list = (items) => `<ol>${items.map((item) => `<li><a href="${item.href}">${escapeXml(item.title)}</a>${item.children?.length ? list(item.children) : ''}</li>`).join('')}</ol>`;
  writeFileSync(join(EPUB_ROOT, 'nav.xhtml'), `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="fr" xml:lang="fr"><head><meta charset="utf-8"/><title>${escapeXml(TITLE)}</title><link rel="stylesheet" href="styles/stylesheet1.css" type="text/css"/></head><body epub:type="frontmatter"><nav epub:type="toc" id="toc"><h1>${escapeXml(TITLE)}</h1>${list(toc)}</nav><nav epub:type="landmarks" hidden="hidden"><ol><li><a href="text/cover.xhtml" epub:type="cover">Couverture</a></li><li><a href="text/title_page.xhtml" epub:type="titlepage">Page de titre</a></li></ol></nav></body></html>\n`);
  let order = 0;
  const points = (items) => items.map((item) => {
    order += 1;
    const current = order;
    return `<navPoint id="navPoint-${current}" playOrder="${current}"><navLabel><text>${escapeXml(item.title)}</text></navLabel><content src="${item.href}"/>${item.children?.length ? points(item.children) : ''}</navPoint>`;
  }).join('');
  writeFileSync(join(EPUB_ROOT, 'toc.ncx'), `<?xml version="1.0" encoding="UTF-8"?><ncx version="2005-1" xmlns="http://www.daisy.org/z3986/2005/ncx/"><head><meta name="dtb:uid" content="${BOOK_ID}"/><meta name="dtb:depth" content="2"/></head><docTitle><text>${escapeXml(TITLE)}</text></docTitle><navMap>${points(toc)}</navMap></ncx>\n`);
}

function writePackage() {
  const chapters = Array.from({ length: 11 }, (_, index) => String(index + 1).padStart(3, '0'));
  const manifest = chapters.map((chapter) => `<item id="ch${chapter}" href="text/ch${chapter}.xhtml" media-type="application/xhtml+xml"/>`).join('');
  const spine = chapters.map((chapter) => `<itemref idref="ch${chapter}"/>`).join('');
  const media = Array.from({ length: INFOGRAPHIC_COUNT }, (_, index) => `<item id="file${index}" href="media/file${index}.svg" media-type="image/svg+xml"/>`).join('');
  writeFileSync(join(EPUB_ROOT, 'content.opf'), `<?xml version="1.0" encoding="UTF-8"?><package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id" prefix="schema: http://schema.org/"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${BOOK_ID}</dc:identifier><dc:title>${escapeXml(TITLE)}</dc:title><dc:language>fr</dc:language><dc:creator>l0g</dc:creator><dc:date>2026-08-29</dc:date><dc:subject>France Identité</dc:subject><dc:subject>identité numérique</dc:subject><dc:subject>portefeuille européen EUDI</dc:subject><dc:subject>souveraineté numérique</dc:subject><dc:description>Huit enquêtes illustrées sur les données, les alternatives, les contrats, les coûts, les plateformes et les traces de France Identité et du portefeuille européen.</dc:description><dc:publisher>l0g.fr</dc:publisher><dc:rights>Creative Commons Attribution 4.0 International (CC BY 4.0).</dc:rights><dc:source>${SITE}${PUBLICATION_PAGE}</dc:source><meta property="dcterms:modified">${MODIFIED}</meta><meta name="cover" content="cover-image"/><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityHazard">none</meta><meta property="schema:accessibilitySummary">Ordre de lecture explicite, sommaire structuré et description textuelle des vingt-trois infographies.</meta></metadata><manifest><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="css" href="styles/stylesheet1.css" media-type="text/css"/><item id="cover" href="text/cover.xhtml" media-type="application/xhtml+xml" properties="svg"/><item id="title" href="text/title_page.xhtml" media-type="application/xhtml+xml"/><item id="cover-image" href="media/cover.png" media-type="image/png" properties="cover-image"/>${manifest}${media}</manifest><spine toc="ncx"><itemref idref="cover"/><itemref idref="title"/><itemref idref="nav"/>${spine}</spine><guide><reference type="cover" title="Couverture" href="text/cover.xhtml"/><reference type="toc" title="Sommaire" href="nav.xhtml"/></guide></package>\n`);
}

async function generate() {
  rmSync(SOURCE_ROOT, { recursive: true, force: true });
  for (const directory of [MEDIA_ROOT, TEXT_ROOT, join(EPUB_ROOT, 'styles'), join(SOURCE_ROOT, 'META-INF'), PUBLICATION_ROOT]) mkdirSync(directory, { recursive: true });
  for (const file of ['mimetype', 'META-INF/container.xml', 'META-INF/com.apple.ibooks.display-options.xml']) copyFileSync(join(TEMPLATE_ROOT, file), join(SOURCE_ROOT, file));
  const stylesheetPath = join(EPUB_ROOT, 'styles/stylesheet1.css');
  copyFileSync(join(TEMPLATE_ROOT, 'EPUB/styles/stylesheet1.css'), stylesheetPath);
  writeFileSync(stylesheetPath, `${readFileSync(stylesheetPath, 'utf8').trimEnd()}\n${DISCLOSURE_CSS}`);

  const cover = await sharp(COVER_ART)
    .resize(1600, 2560, { fit: 'cover', position: 'centre' })
    .composite([{ input: Buffer.from(coverOverlaySvg()) }])
    .png({ compressionLevel: 9, adaptiveFiltering: true })
    .toBuffer();
  writeFileSync(join(MEDIA_ROOT, 'cover.png'), cover);
  writeFileSync(join(PUBLICATION_ROOT, COVER_FILE), cover);
  writeFileSync(join(TEXT_ROOT, 'cover.xhtml'), `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xmlns:xlink="http://www.w3.org/1999/xlink" lang="fr"><head><meta charset="utf-8"/><title>Couverture</title></head><body epub:type="frontmatter cover"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1600 2560"><image width="1600" height="2560" xlink:href="../media/cover.png"/></svg></body></html>\n`);
  writeFileSync(join(TEXT_ROOT, 'title_page.xhtml'), xhtmlDocument(config, { title: TITLE, body: `<section class="titlepage" epub:type="titlepage"><h1 class="title">${escapeXml(TITLE)}</h1><p class="subtitle">${escapeXml(SUBTITLE)}</p><p class="author">l0g</p><p class="publisher">l0g.fr</p><p class="date">29 août 2026</p><p class="rights">Creative Commons Attribution 4.0 International</p></section>`, bodyType: 'frontmatter' }));

  const chapterByRoute = new Map(articles.map((article) => [article.route, `${article.chapter}#article-${article.number}`]));
  const rendered = [];
  let offset = 0;
  let disclosureOffset = 0;
  for (const article of articles) {
    const sourcePath = join(ROOT, 'src/content/posts', article.file);
    const source = readFileSync(sourcePath, 'utf8');
    const canonicalTitle = frontmatter(source, 'title');
    const description = frontmatter(source, 'description');
    if (!canonicalTitle || !description) throw new Error(`${basename(sourcePath)}: title or description missing`);
    const protectedArticle = protectInfographicFigures(markdownBody(source));
    const renderedHtml = String(await unified().use(remarkParse).use(remarkGfm).use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw).use(rehypeStringify, { allowDangerousHtml: true }).process(protectedArticle.markdown));
    const restoredHtml = protectedArticle.restore(renderedHtml);
    const figures = extractInfographics(restoredHtml, article.number, offset, MEDIA_ROOT);
    const disclosures = staticDisclosureHtml(figures.html);
    const sectioned = sectionHeadings(normalizeVoidElements(rewriteLinks(disclosures.html, chapterByRoute)), article.number);
    const title = shortTitle(canonicalTitle);
    const body = `<section id="article-${article.number}" class="level1 article-chapter"><p class="chapter-kicker">Volet ${article.number} sur 8</p><h1>${escapeXml(title)}</h1><p class="chapter-dek">${escapeXml(description)}</p><p class="chapter-meta">Publié les 28 et 29 août 2026 · <a href="${SITE}${article.route}">Article canonique sur l0g.fr</a></p>${sectioned.html}</section>`;
    writeFileSync(join(TEXT_ROOT, article.chapter), xhtmlDocument(config, { title, body }));
    rendered.push({ ...article, title, canonicalTitle, description, headings: sectioned.headings.map(({ id, label }) => ({ id, label })) });
    offset = figures.next;
    disclosureOffset += disclosures.count;
  }
  if (offset !== INFOGRAPHIC_COUNT) throw new Error(`Expected ${INFOGRAPHIC_COUNT} infographics, generated ${offset}`);
  if (disclosureOffset !== DISCLOSURE_COUNT) throw new Error(`Expected ${DISCLOSURE_COUNT} static disclosures, generated ${disclosureOffset}`);

  const structure = structuralBody(rendered);
  writeFileSync(join(TEXT_ROOT, 'ch001.xhtml'), xhtmlDocument(config, { title: 'Introduction', body: structure.intro }));
  writeFileSync(join(TEXT_ROOT, 'ch010.xhtml'), xhtmlDocument(config, { title: conclusion.title, body: structure.ending }));
  writeFileSync(join(TEXT_ROOT, 'ch011.xhtml'), xhtmlDocument(config, { title: 'À propos de cette édition', body: structure.about }));
  writeNavigation(rendered);
  writePackage();

  const fingerprint = createHash('sha256').update(articles.map((article) => readFileSync(join(ROOT, 'src/content/posts', article.file))).join('\n')).digest('hex');
  console.log(`Source EPUB Votre identité dans un téléphone générée : 8 enquêtes, ${INFOGRAPHIC_COUNT} infographies, ${DISCLOSURE_COUNT} boîtes statiques, source ${fingerprint.slice(0, 12)}`);
}

generate().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
