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
const TEMPLATE_ROOT = join(ROOT, 'src/epub/l-argent-d-epstein');
const PUBLICATION_ROOT = join(ROOT, 'public/publications');
const SITE = 'https://l0g.fr';
const MODIFIED = '2026-08-22T18:30:00Z';

const sharedArticles = [
  {
    number: 1,
    frFile: 'le-grand-peage-de-la-facture-1-le-portail-ampute.mdx',
    frRoute: '/posts/le-grand-peage-de-la-facture-1-le-portail-ampute/',
    enFile: 'the-great-e-invoicing-toll-1-the-severed-public-portal.mdx',
    enRoute: '/en/analysis/the-great-e-invoicing-toll-1-the-severed-public-portal/',
  },
  {
    number: 2,
    frFile: 'le-grand-peage-de-la-facture-2-147-plateformes-combien-de-tuyaux.mdx',
    frRoute: '/posts/le-grand-peage-de-la-facture-2-147-plateformes-combien-de-tuyaux/',
    enFile: 'the-great-e-invoicing-toll-2-147-platforms-how-many-pipes.mdx',
    enRoute: '/en/analysis/the-great-e-invoicing-toll-2-147-platforms-how-many-pipes/',
  },
  {
    number: 3,
    frFile: 'le-grand-peage-de-la-facture-3-le-prix-du-gratuit.mdx',
    frRoute: '/posts/le-grand-peage-de-la-facture-3-le-prix-du-gratuit/',
    enFile: 'the-great-e-invoicing-toll-3-the-price-of-free.mdx',
    enRoute: '/en/analysis/the-great-e-invoicing-toll-3-the-price-of-free/',
  },
  {
    number: 4,
    frFile: 'le-grand-peage-de-la-facture-4-qui-lit-vos-factures.mdx',
    frRoute: '/posts/le-grand-peage-de-la-facture-4-qui-lit-vos-factures/',
    enFile: 'the-great-e-invoicing-toll-4-who-reads-your-invoices.mdx',
    enRoute: '/en/analysis/the-great-e-invoicing-toll-4-who-reads-your-invoices/',
  },
  {
    number: 5,
    frFile: 'le-grand-peage-de-la-facture-5-le-jour-ou-le-tuyau-casse.mdx',
    frRoute: '/posts/le-grand-peage-de-la-facture-5-le-jour-ou-le-tuyau-casse/',
    enFile: 'the-great-e-invoicing-toll-5-when-the-pipe-breaks.mdx',
    enRoute: '/en/analysis/the-great-e-invoicing-toll-5-when-the-pipe-breaks/',
  },
];

const editions = {
  fr: {
    lang: 'fr',
    locale: 'fr-FR',
    contentDirectory: 'posts',
    sourceDirectory: 'grand-peage-facture',
    publicationPage: '/publications/grand-peage-facture/',
    epubFile: 'grand-peage-facture-enquete-l0g.epub',
    coverFile: 'grand-peage-facture-cover.png',
    bookId: 'urn:uuid:5be9c028-f866-5fa2-9f84-e31062cb4e1a',
    title: 'Le grand péage de la facture',
    subtitle: 'Du portail public aux plateformes agréées',
    publicationDate: '22 août 2026',
    chapterKicker: (number) => `Volet ${number} sur 5`,
    canonicalLabel: 'Article canonique sur l0g.fr',
    publishedLabel: 'Publié le',
    coverLabel: 'ENQUÊTE EN CINQ VOLETS',
    coverTopics: ['PORTAIL PUBLIC', 'PLATEFORMES', 'COÛTS', 'DONNÉES', 'INCIDENTS'],
    introTitle: 'Introduction : une obligation et son infrastructure',
    introDek: 'Cinq enquêtes pour comprendre qui transporte les factures électroniques françaises, à quel prix, avec quels accès et selon quelles garanties de continuité.',
    introParagraphs: [
      'La facture électronique est souvent présentée comme un changement de format. Elle est aussi une infrastructure : les entreprises doivent choisir un intermédiaire, raccorder leurs logiciels, confier des données commerciales et prévoir ce qui se passe lorsque la chaîne s’arrête.',
      'Cette édition suit le déplacement du projet, du portail public initialement prévu vers un marché de plateformes agréées. Elle examine ensuite le nombre d’acteurs réellement visibles, les offres dites gratuites, les personnes susceptibles d’accéder aux données et les décisions à prendre pendant un incident.',
      'Les cinq chapitres ne cherchent pas à prédire une panne ni à attribuer une intention aux acteurs. Ils rassemblent les documents disponibles, distinguent les faits des questions ouvertes et indiquent ce que les registres publics ne permettent pas encore de vérifier.',
    ],
    readingTitle: 'Le fil de l’enquête',
    readingItems: [
      'Le portail public et la nouvelle architecture de circulation des factures.',
      'Les 148 marques inscrites et la question des moteurs techniques sous-jacents.',
      'Le périmètre réel du gratuit, les options payantes et le coût de sortie.',
      'Les données contenues dans une facture et les accès possibles selon les rôles.',
      'La continuité d’activité, la preuve, la reprise et les responsabilités en cas d’incident.',
    ],
    stateTitle: 'Une photographie datée',
    stateParagraph: 'Les chapitres correspondent aux versions publiées le 22 août 2026. Les liens canoniques permettent de consulter les corrections ou mises à jour ultérieures. Les outils interactifs restent sur le site afin que le livre demeure lisible hors ligne et n’embarque aucun script.',
    conclusionTitle: 'Conclusion : rendre l’obligation vérifiable',
    conclusionParagraphs: [
      'Les cinq volets ne démontrent ni que toutes les plateformes présentent le même risque, ni qu’un incident majeur est inévitable. Ils montrent en revanche qu’une obligation publique dépend désormais d’une chaîne d’intermédiaires dont le coût, les dépendances techniques, les accès aux données et les procédures de secours doivent pouvoir être examinés.',
      'Le Parlement peut demander des réponses publiables : quels résultats complets ont livré les pilotes ? Combien d’opérateurs techniques se trouvent derrière les marques enregistrées ? Quelles dépendances communes existent entre hébergeurs, logiciels et sous-traitants ? Qui accède au contenu, aux métadonnées et aux journaux ? Quelles durées de conservation s’appliquent ? Comment une entreprise change-t-elle de plateforme sans perdre son historique ni interrompre ses flux ?',
      'Il reste aussi à préciser ce qui se passe quand la chaîne se rompt : quel mode de secours est accepté, qui horodate la preuve, dans quel délai les entreprises sont informées, comment les données sont restaurées et comment les responsabilités sont réparties. Ces questions ne condamnent pas la réforme. Elles définissent les conditions minimales pour qu’une infrastructure obligatoire soit contrôlable, réversible et digne de confiance.',
      'Une obligation gagne en légitimité lorsque chacun peut vérifier son coût, ses intermédiaires, son niveau de protection et son plan de secours. C’est sur ces éléments concrets que le débat parlementaire peut encore agir.',
    ],
    aboutTitle: 'À propos de cette édition',
    aboutParagraph: 'Le grand péage de la facture réunit cinq enquêtes publiées par l0g le 22 août 2026. Cette édition EPUB 3 ajoute une introduction, une conclusion, un sommaire structuré, dix infographies adaptées et des liens vers trois outils pédagogiques.',
    canonicalHeading: 'Articles canoniques',
    coverTitleLines: ['LE GRAND', 'PÉAGE DE LA', 'FACTURE'],
    opfDescription: 'Cinq enquêtes illustrées sur l’architecture, les plateformes, les coûts, les données et la continuité de la facture électronique en France.',
    opfSubjects: ['facture électronique', 'plateformes agréées', 'données d’entreprise', 'continuité d’activité'],
    accessibilitySummary: 'Ordre de lecture explicite, sommaire structuré et description textuelle des dix infographies.',
    outputMessage: 'Source EPUB Le grand péage de la facture générée',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/deed.fr',
  },
  en: {
    lang: 'en',
    locale: 'en-GB',
    contentDirectory: 'posts-en',
    sourceDirectory: 'great-e-invoicing-toll',
    publicationPage: '/en/publications/great-e-invoicing-toll/',
    epubFile: 'great-e-invoicing-toll-investigation-l0g.epub',
    coverFile: 'great-e-invoicing-toll-cover.png',
    bookId: 'urn:uuid:68ba2ea1-29e9-50af-b3b3-275458d71d2b',
    title: 'The Great E-Invoicing Toll',
    subtitle: 'From the public portal to approved platforms',
    publicationDate: '22 August 2026',
    chapterKicker: (number) => `Part ${number} of 5`,
    canonicalLabel: 'Canonical article on l0g.fr',
    publishedLabel: 'Published',
    coverLabel: 'A FIVE-PART INVESTIGATION',
    coverTopics: ['PUBLIC PORTAL', 'PLATFORMS', 'COSTS', 'DATA', 'INCIDENTS'],
    introTitle: 'Introduction: an obligation and its infrastructure',
    introDek: 'Five investigations into who carries French e-invoices, at what price, with which access and under what continuity guarantees.',
    introParagraphs: [
      'E-invoicing is often described as a change of format. It is also infrastructure: businesses must choose an intermediary, connect their software, entrust commercial data and decide what to do when the chain stops.',
      'This edition follows the project’s move from the planned public portal to a market of approved platforms. It then examines the number of visible actors, free offers, the people who may access invoice data and the decisions required during an incident.',
      'The five chapters do not predict a failure or assign motives to participants. They assemble the available records, separate established facts from open questions and show what public registers still do not allow readers to verify.',
    ],
    readingTitle: 'The investigation’s path',
    readingItems: [
      'The public portal and the new architecture for moving invoices.',
      'The 148 registered brands and the technical engines that may sit beneath them.',
      'The actual boundary of free offers, paid options and the cost of leaving.',
      'The data contained in an invoice and possible access according to each role.',
      'Business continuity, evidence, recovery and responsibility during an incident.',
    ],
    stateTitle: 'A dated public snapshot',
    stateParagraph: 'The chapters reproduce the versions published on 22 August 2026. Canonical links provide a route to later corrections or updates. Interactive tools remain on the website so that the book stays readable offline and contains no scripts.',
    conclusionTitle: 'Conclusion: make the obligation verifiable',
    conclusionParagraphs: [
      'The five parts do not show that every platform presents the same risk, or that a major incident is inevitable. They do show that a public obligation now depends on a chain of intermediaries whose cost, technical dependencies, data access and backup procedures must be open to examination.',
      'Parliament can ask for publishable answers. What did the pilots show in full? How many technical operators sit behind the registered brands? Which hosting, software and subcontracting dependencies are shared? Who can access content, metadata and logs? How long is each category retained? How can a business move to another platform without losing its history or interrupting its flows?',
      'The failure path also needs precision. Which fallback mode is accepted, who timestamps the evidence, how quickly are businesses informed, how are records restored and how is responsibility allocated? These questions do not reject the reform. They define the minimum conditions for mandatory infrastructure to be controllable, reversible and worthy of trust.',
      'An obligation gains legitimacy when people can verify its cost, intermediaries, protection level and backup plan. Those are concrete matters on which parliamentary scrutiny can still act.',
    ],
    aboutTitle: 'About this edition',
    aboutParagraph: 'The Great E-Invoicing Toll brings together five l0g investigations published on 22 August 2026. This EPUB 3 edition adds an introduction, a conclusion, a structured table of contents, ten adapted infographics and links to three educational tools.',
    canonicalHeading: 'Canonical articles',
    coverTitleLines: ['THE GREAT', 'E-INVOICING', 'TOLL'],
    opfDescription: 'Five illustrated investigations into the architecture, platforms, costs, data and continuity of mandatory e-invoicing in France.',
    opfSubjects: ['electronic invoicing', 'approved platforms', 'business data', 'business continuity'],
    accessibilitySummary: 'Explicit reading order, structured table of contents and text alternatives for ten infographics.',
    outputMessage: 'Source EPUB The Great E-Invoicing Toll generated',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
  },
};

export function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&apos;');
}

export function plainText(value) {
  return toText(fromHtml(String(value), { fragment: true })).trim();
}

export function frontmatter(source, key) {
  const block = source.match(/^---\n([\s\S]*?)\n---\n/u)?.[1] ?? '';
  const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'mu'));
  if (!match) return '';
  const value = match[1].trim();
  return value.startsWith('"') && value.endsWith('"') ? value.slice(1, -1).replaceAll('\\"', '"') : value;
}

export function xhtmlDocument(config, { title, body, bodyType = 'bodymatter' }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${config.lang}" xml:lang="${config.lang}"><head><meta charset="utf-8" /><meta name="generator" content="l0g" /><title>${escapeXml(title)}</title><link rel="stylesheet" type="text/css" href="../styles/stylesheet1.css" /></head><body epub:type="${bodyType}">${body}</body></html>\n`;
}

export function sanitizeSvg(svg, label) {
  if (/<(?:script|foreignObject|iframe|object|embed)\b/iu.test(svg)) throw new Error(`${label}: active SVG content is forbidden`);
  if (/\son[a-z]+\s*=/iu.test(svg) || /(?:href|src)\s*=\s*["'](?:https?:|data:|javascript:)/iu.test(svg)) throw new Error(`${label}: external or executable SVG payload is forbidden`);
  let clean = svg.replace(/\sstyle="padding-bottom:[^"]+"/gu, '');
  if (!/\sxmlns=/u.test(clean)) clean = clean.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
  return `<?xml version="1.0" encoding="UTF-8"?>\n${clean}\n`;
}

function markdownBody(source, config) {
  let body = source
    .replace(/^---\n[\s\S]*?\n---\n/u, '')
    .replace(/^import\s+[^\n]+\n/gmu, '')
    .replace(/<style>\{`[\s\S]*?`\}<\/style>/gu, '');
  const tools = config.lang === 'fr'
    ? [
        ['InvoicePlatformCostCalculator', '/outils/cout-plateforme-facturation-electronique/', 'Le calculateur de coût des plateformes'],
        ['InvoiceDataAccessMap', '/outils/qui-peut-voir-ma-facture/', 'La carte des accès à une facture'],
        ['InvoiceIncidentLog', '/outils/journal-incident-facture/', 'Le journal d’incident'],
      ]
    : [
        ['InvoicePlatformCostCalculator', '/en/tools/e-invoicing-platform-cost/', 'The platform cost calculator'],
        ['InvoiceDataAccessMap', '/en/tools/who-can-see-my-e-invoice/', 'The invoice access map'],
        ['InvoiceIncidentLog', '/en/tools/e-invoice-incident-log/', 'The incident log'],
      ];
  for (const [component, route, label] of tools) {
    body = body.replace(
      new RegExp(`<${component}\\s+lang="${config.lang}"\\s+mode="embed"\\s*\\/>`, 'gu'),
      config.lang === 'fr'
        ? `> **Outil interactif.** [${label}](${route}) reste disponible sur l0g.fr. Le livre en conserve le contexte et les limites, sans embarquer de script.`
        : `> **Interactive tool.** [${label}](${route}) remains available on l0g.fr. The book preserves its context and limitations without embedding scripts.`,
    );
  }
  return body;
}

export function rewriteLinks(html, chapterByRoute) {
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

export function normalizeVoidElements(html) {
  return html.replace(/<(area|base|br|col|embed|hr|img|input|link|meta|param|source|track|wbr)(\s[^>]*?)?>/giu, (full, tag, attributes = '') => {
    if (/\/>$/u.test(full)) return full;
    return `<${tag}${attributes} />`;
  });
}

export function sectionHeadings(html, articleNumber) {
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

export function extractInfographics(html, articleNumber, offset, mediaRoot) {
  let next = offset;
  const rewritten = html.replace(/<svg\b[\s\S]*?<\/svg>/gu, (svg) => {
    const fileName = `file${next}.svg`;
    const title = plainText(svg.match(/<title[^>]*>([\s\S]*?)<\/title>/u)?.[1] ?? `Infographic ${next + 1}`);
    const description = plainText(svg.match(/<desc[^>]*>([\s\S]*?)<\/desc>/u)?.[1] ?? svg.match(/aria-label="([^"]+)"/u)?.[1] ?? title);
    writeFileSync(join(mediaRoot, fileName), sanitizeSvg(svg, `article ${articleNumber}, ${fileName}`));
    next += 1;
    return `<img src="../media/${fileName}" class="infographic-image" alt="${escapeXml(description)}" />`;
  });
  return { html: rewritten.replace(/<figure class="infographic" style="[^"]*">/gu, '<figure class="infographic">'), next };
}

function coverSvg(config) {
  const title = config.coverTitleLines;
  const topics = config.coverTopics;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="2560" viewBox="0 0 1600 2560">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#03070c"/><stop offset=".55" stop-color="#07131c"/><stop offset="1" stop-color="#0b0710"/></linearGradient>
    <linearGradient id="paper" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#f4efe6"/><stop offset="1" stop-color="#cfd8d8"/></linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="20"/></filter>
    <pattern id="grid" width="58" height="58" patternUnits="userSpaceOnUse"><path d="M58 0H0V58" fill="none" stroke="#27404f" stroke-width="1" opacity=".3"/></pattern>
  </defs>
  <rect width="1600" height="2560" fill="url(#bg)"/>
  <rect width="1600" height="2560" fill="url(#grid)"/>
  <circle cx="1280" cy="1030" r="390" fill="#e64b84" opacity=".09" filter="url(#glow)"/>
  <circle cx="330" cy="1700" r="430" fill="#52d7ca" opacity=".08" filter="url(#glow)"/>
  <rect x="74" y="74" width="1452" height="2412" fill="none" stroke="#416171" stroke-width="3"/>
  <text x="110" y="155" fill="#62dfd1" font-family="Courier New,monospace" font-size="40">l0g_ / PUBLICATION</text>
  <text x="1490" y="155" text-anchor="end" fill="#92a3af" font-family="Courier New,monospace" font-size="28">22.08.2026</text>
  <path d="M110 205H1490" stroke="#395363" stroke-width="2"/>
  <text x="110" y="285" fill="#e8ad49" font-family="Courier New,monospace" font-size="28" font-weight="700" letter-spacing="3">${config.coverLabel}</text>
  <g fill="#f7f2e9" font-family="Arial,Helvetica,sans-serif" font-weight="900" letter-spacing="-5">
    <text x="104" y="472" font-size="145">${title[0]}</text>
    <text x="104" y="642" font-size="145">${title[1]}</text>
    <text x="104" y="812" font-size="156">${title[2]}</text>
  </g>
  <rect x="110" y="865" width="970" height="10" fill="#e64b84"/>
  <text x="110" y="945" fill="#c9d3da" font-family="Arial,Helvetica,sans-serif" font-size="37" font-weight="700">${config.subtitle.toLocaleUpperCase(config.locale)}</text>
  <g transform="translate(0 70)">
    <path d="M180 1425H1420" stroke="#233f4e" stroke-width="34" stroke-linecap="round"/>
    <path d="M180 1425H1420" stroke="#62dfd1" stroke-width="4" stroke-linecap="round" stroke-dasharray="18 16"/>
    <rect x="415" y="1125" width="770" height="620" rx="18" fill="url(#paper)" transform="rotate(-3 800 1435)" opacity=".96"/>
    <g transform="rotate(-3 800 1435)" fill="#172632">
      <rect x="476" y="1194" width="220" height="22" rx="5"/><rect x="476" y="1242" width="530" height="13" rx="4" opacity=".45"/>
      <rect x="476" y="1290" width="640" height="2" opacity=".4"/><rect x="476" y="1334" width="390" height="14" rx="4" opacity=".55"/>
      <rect x="476" y="1380" width="620" height="2" opacity=".3"/><rect x="476" y="1424" width="590" height="14" rx="4" opacity=".45"/>
      <rect x="476" y="1470" width="620" height="2" opacity=".3"/><rect x="476" y="1514" width="440" height="14" rx="4" opacity=".5"/>
      <rect x="476" y="1572" width="258" height="84" rx="6" fill="#e64b84" opacity=".9"/><rect x="838" y="1572" width="258" height="84" rx="6" fill="#52cfc4" opacity=".9"/>
    </g>
    ${topics.map((topic, index) => {
      const x = 180 + (index * 310);
      const y = index % 2 === 0 ? 1040 : 1795;
      const accent = index === 4 ? '#e64b84' : index === 2 ? '#e8ad49' : '#62dfd1';
      return `<g><circle cx="${x}" cy="1425" r="54" fill="#08131b" stroke="${accent}" stroke-width="5"/><text x="${x}" y="1440" text-anchor="middle" fill="${accent}" font-family="Courier New,monospace" font-size="40" font-weight="900">0${index + 1}</text><path d="M${x} ${index % 2 === 0 ? 1370 : 1480}V${index % 2 === 0 ? 1130 : 1732}" stroke="${accent}" stroke-width="3"/><rect x="${x - 118}" y="${y}" width="236" height="62" rx="31" fill="#08131b" stroke="${accent}" stroke-width="2"/><text x="${x}" y="${y + 40}" text-anchor="middle" fill="${accent}" font-family="Courier New,monospace" font-size="19" font-weight="700">${topic}</text></g>`;
    }).join('')}
  </g>
  <g font-family="Courier New,monospace">
    <text x="110" y="2252" fill="#e8ad49" font-size="27" font-weight="700">5 ${config.lang === 'fr' ? 'ENQUÊTES' : 'INVESTIGATIONS'}  ·  10 INFOGRAPHIES  ·  3 ${config.lang === 'fr' ? 'OUTILS' : 'TOOLS'}</text>
    <text x="110" y="2335" fill="#dce4e8" font-size="31">${config.lang === 'fr' ? 'Architecture, prix, données et continuité.' : 'Architecture, price, data and continuity.'}</text>
    <text x="110" y="2418" fill="#8295a2" font-size="27">l0g.fr  ·  EPUB 3  ·  CC BY 4.0</text>
  </g>
  </svg>`;
}

function structuralBody(config, rendered) {
  const intro = `<section id="introduction" class="level1"><p class="chapter-kicker">Introduction</p><h1>${escapeXml(config.introTitle)}</h1><p class="chapter-dek">${escapeXml(config.introDek)}</p>${config.introParagraphs.map((paragraph) => `<p>${escapeXml(paragraph)}</p>`).join('')}<h2 id="fil-enquete">${escapeXml(config.readingTitle)}</h2><ol>${config.readingItems.map((item) => `<li>${escapeXml(item)}</li>`).join('')}</ol><h2 id="etat-corpus">${escapeXml(config.stateTitle)}</h2><p>${escapeXml(config.stateParagraph)}</p></section>`;
  const conclusion = `<section id="conclusion" class="level1"><h1>${escapeXml(config.conclusionTitle)}</h1>${config.conclusionParagraphs.map((paragraph) => `<p>${escapeXml(paragraph)}</p>`).join('')}</section>`;
  const links = rendered.map((article) => `<li><a href="${SITE}${article.route}">${escapeXml(article.title)}</a></li>`).join('');
  const about = `<section id="about" class="level1"><h1>${escapeXml(config.aboutTitle)}</h1><p class="colophon">${escapeXml(config.aboutParagraph)}</p><h2>${escapeXml(config.canonicalHeading)}</h2><ol class="original-articles">${links}</ol><p>Creative Commons Attribution 4.0 International: <a href="${config.licenseUrl}">CC BY 4.0</a>.</p></section>`;
  return { intro, conclusion, about };
}

function navigationEntries(config, rendered) {
  return [
    { title: 'Introduction', href: 'text/ch001.xhtml', children: [{ title: config.readingTitle, href: 'text/ch001.xhtml#fil-enquete' }] },
    ...rendered.map((article) => ({ title: article.title, href: `text/${article.chapter}`, children: article.headings.map((heading) => ({ title: heading.label, href: `text/${article.chapter}#${heading.id}` })) })),
    { title: config.conclusionTitle, href: 'text/ch007.xhtml' },
    { title: config.aboutTitle, href: 'text/ch008.xhtml' },
  ];
}

function writeNavigation(config, epubRoot, rendered) {
  const toc = navigationEntries(config, rendered);
  const list = (items) => `<ol>${items.map((item) => `<li><a href="${item.href}">${escapeXml(item.title)}</a>${item.children?.length ? list(item.children) : ''}</li>`).join('')}</ol>`;
  writeFileSync(join(epubRoot, 'nav.xhtml'), `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${config.lang}" xml:lang="${config.lang}"><head><meta charset="utf-8"/><title>${escapeXml(config.title)}</title><link rel="stylesheet" href="styles/stylesheet1.css" type="text/css"/></head><body epub:type="frontmatter"><nav epub:type="toc" id="toc"><h1>${escapeXml(config.title)}</h1>${list(toc)}</nav><nav epub:type="landmarks" hidden="hidden"><ol><li><a href="text/cover.xhtml" epub:type="cover">Cover</a></li><li><a href="text/title_page.xhtml" epub:type="titlepage">Title page</a></li></ol></nav></body></html>\n`);
  let order = 0;
  const points = (items) => items.map((item) => { order += 1; const current = order; return `<navPoint id="navPoint-${current}" playOrder="${current}"><navLabel><text>${escapeXml(item.title)}</text></navLabel><content src="${item.href}"/>${item.children?.length ? points(item.children) : ''}</navPoint>`; }).join('');
  writeFileSync(join(epubRoot, 'toc.ncx'), `<?xml version="1.0" encoding="UTF-8"?><ncx version="2005-1" xmlns="http://www.daisy.org/z3986/2005/ncx/"><head><meta name="dtb:uid" content="${config.bookId}"/><meta name="dtb:depth" content="2"/></head><docTitle><text>${escapeXml(config.title)}</text></docTitle><navMap>${points(toc)}</navMap></ncx>\n`);
}

function writePackage(config, epubRoot, infographicCount) {
  const chapters = Array.from({ length: 8 }, (_, index) => String(index + 1).padStart(3, '0'));
  const manifest = chapters.map((chapter) => `<item id="ch${chapter}" href="text/ch${chapter}.xhtml" media-type="application/xhtml+xml"/>`).join('');
  const spine = chapters.map((chapter) => `<itemref idref="ch${chapter}"/>`).join('');
  const media = Array.from({ length: infographicCount }, (_, index) => `<item id="file${index}" href="media/file${index}.svg" media-type="image/svg+xml"/>`).join('');
  const subjects = config.opfSubjects.map((subject) => `<dc:subject>${escapeXml(subject)}</dc:subject>`).join('');
  writeFileSync(join(epubRoot, 'content.opf'), `<?xml version="1.0" encoding="UTF-8"?><package version="3.0" xmlns="http://www.idpf.org/2007/opf" unique-identifier="book-id" prefix="schema: http://schema.org/"><metadata xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:identifier id="book-id">${config.bookId}</dc:identifier><dc:title>${escapeXml(config.title)}</dc:title><dc:language>${config.lang}</dc:language><dc:creator>l0g</dc:creator><dc:date>2026-08-22</dc:date>${subjects}<dc:description>${escapeXml(config.opfDescription)}</dc:description><dc:publisher>l0g.fr</dc:publisher><dc:rights>Creative Commons Attribution 4.0 International (CC BY 4.0).</dc:rights><dc:source>${SITE}${config.publicationPage}</dc:source><meta property="dcterms:modified">${MODIFIED}</meta><meta name="cover" content="cover-image"/><meta property="schema:accessMode">textual</meta><meta property="schema:accessMode">visual</meta><meta property="schema:accessibilityFeature">alternativeText</meta><meta property="schema:accessibilityFeature">readingOrder</meta><meta property="schema:accessibilityFeature">structuralNavigation</meta><meta property="schema:accessibilityFeature">tableOfContents</meta><meta property="schema:accessibilityHazard">none</meta><meta property="schema:accessibilitySummary">${escapeXml(config.accessibilitySummary)}</meta></metadata><manifest><item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="css" href="styles/stylesheet1.css" media-type="text/css"/><item id="cover" href="text/cover.xhtml" media-type="application/xhtml+xml" properties="svg"/><item id="title" href="text/title_page.xhtml" media-type="application/xhtml+xml"/><item id="cover-image" href="media/cover.png" media-type="image/png" properties="cover-image"/>${manifest}${media}</manifest><spine toc="ncx"><itemref idref="cover"/><itemref idref="title"/><itemref idref="nav"/>${spine}</spine><guide><reference type="cover" title="Cover" href="text/cover.xhtml"/><reference type="toc" title="Table of contents" href="nav.xhtml"/></guide></package>\n`);
}

export async function generateEInvoicingEdition(lang) {
  const config = editions[lang];
  if (!config) throw new Error(`Unsupported language: ${lang}`);
  const sourceRoot = join(ROOT, 'src/epub', config.sourceDirectory);
  const epubRoot = join(sourceRoot, 'EPUB');
  const mediaRoot = join(epubRoot, 'media');
  const textRoot = join(epubRoot, 'text');
  const articles = sharedArticles.map((article) => ({
    number: article.number,
    file: lang === 'fr' ? article.frFile : article.enFile,
    route: lang === 'fr' ? article.frRoute : article.enRoute,
    chapter: `ch${String(article.number + 1).padStart(3, '0')}.xhtml`,
  }));
  const chapterByRoute = new Map(articles.map((article) => [article.route, `${article.chapter}#article-${article.number}`]));

  rmSync(sourceRoot, { recursive: true, force: true });
  for (const directory of [mediaRoot, textRoot, join(epubRoot, 'styles'), join(sourceRoot, 'META-INF'), PUBLICATION_ROOT]) mkdirSync(directory, { recursive: true });
  for (const file of ['mimetype', 'META-INF/container.xml', 'META-INF/com.apple.ibooks.display-options.xml']) copyFileSync(join(TEMPLATE_ROOT, file), join(sourceRoot, file));
  copyFileSync(join(TEMPLATE_ROOT, 'EPUB/styles/stylesheet1.css'), join(epubRoot, 'styles/stylesheet1.css'));

  const cover = await sharp(Buffer.from(coverSvg(config))).png({ compressionLevel: 9, adaptiveFiltering: true }).toBuffer();
  writeFileSync(join(mediaRoot, 'cover.png'), cover);
  writeFileSync(join(PUBLICATION_ROOT, config.coverFile), cover);
  writeFileSync(join(textRoot, 'cover.xhtml'), `<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE html><html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xmlns:xlink="http://www.w3.org/1999/xlink" lang="${config.lang}"><head><meta charset="utf-8"/><title>Cover</title></head><body epub:type="frontmatter cover"><svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 1600 2560"><image width="1600" height="2560" xlink:href="../media/cover.png"/></svg></body></html>\n`);
  writeFileSync(join(textRoot, 'title_page.xhtml'), xhtmlDocument(config, { title: config.title, body: `<section class="titlepage" epub:type="titlepage"><h1 class="title">${escapeXml(config.title)}</h1><p class="subtitle">${escapeXml(config.subtitle)}</p><p class="author">l0g</p><p class="publisher">l0g.fr</p><p class="date">${escapeXml(config.publicationDate)}</p><p class="rights">Creative Commons Attribution 4.0 International</p></section>`, bodyType: 'frontmatter' }));

  const rendered = [];
  let offset = 0;
  for (const article of articles) {
    const sourcePath = join(ROOT, 'src/content', config.contentDirectory, article.file);
    const source = readFileSync(sourcePath, 'utf8');
    const title = frontmatter(source, 'title');
    const description = frontmatter(source, 'description');
    if (!title || !description) throw new Error(`${basename(sourcePath)}: missing title or description`);
    const renderedHtml = String(await unified().use(remarkParse).use(remarkGfm).use(remarkRehype, { allowDangerousHtml: true }).use(rehypeRaw).use(rehypeStringify, { allowDangerousHtml: true }).process(markdownBody(source, config)));
    const figures = extractInfographics(renderedHtml, article.number, offset, mediaRoot);
    const sectioned = sectionHeadings(normalizeVoidElements(rewriteLinks(figures.html, chapterByRoute)), article.number);
    const chapterTitle = `${title.charAt(0).toLocaleUpperCase(config.locale)}${title.slice(1)}`;
    const body = `<section id="article-${article.number}" class="level1 article-chapter"><p class="chapter-kicker">${escapeXml(config.chapterKicker(article.number))}</p><h1>${escapeXml(chapterTitle)}</h1><p class="chapter-dek">${escapeXml(description)}</p><p class="chapter-meta">${escapeXml(config.publishedLabel)} ${escapeXml(config.publicationDate)} · <a href="${SITE}${article.route}">${escapeXml(config.canonicalLabel)}</a></p>${sectioned.html}</section>`;
    writeFileSync(join(textRoot, article.chapter), xhtmlDocument(config, { title, body }));
    rendered.push({ ...article, title, description, headings: sectioned.headings.map(({ id, label }) => ({ id, label })) });
    offset = figures.next;
  }
  if (offset !== 10) throw new Error(`Expected 10 infographics, generated ${offset}`);

  const structure = structuralBody(config, rendered);
  writeFileSync(join(textRoot, 'ch001.xhtml'), xhtmlDocument(config, { title: 'Introduction', body: structure.intro }));
  writeFileSync(join(textRoot, 'ch007.xhtml'), xhtmlDocument(config, { title: config.conclusionTitle, body: structure.conclusion }));
  writeFileSync(join(textRoot, 'ch008.xhtml'), xhtmlDocument(config, { title: config.aboutTitle, body: structure.about }));
  writeNavigation(config, epubRoot, rendered);
  writePackage(config, epubRoot, offset);

  const fingerprint = createHash('sha256').update(articles.map((article) => readFileSync(join(ROOT, 'src/content', config.contentDirectory, article.file))).join('\n')).digest('hex');
  console.log(`${config.outputMessage}: 5 investigations, 10 infographics, source ${fingerprint.slice(0, 12)}`);
}
