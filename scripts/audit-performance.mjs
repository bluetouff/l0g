import { gzipSync } from 'node:zlib';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { legacySurfaceRedirects } from '../src/config/legacy-surface-redirects.mjs';
import { scanHtmlElements } from '../src/lib/html-utils.ts';

const rootUrl = new URL('../dist/', import.meta.url);
const root = fileURLToPath(rootUrl);
const failures = [];
const pages = new Map();

function decodeHtml(value) {
  const named = new Map([
    ['amp', '&'],
    ['quot', '"'],
    ['#39', "'"],
    ['apos', "'"],
    ['lt', '<'],
    ['gt', '>'],
  ]);
  return String(value || '').replace(/&(?:#x[0-9a-f]+|#[0-9]+|amp|quot|#39|apos|lt|gt);/gi, (entity) => {
    const name = entity.slice(1, -1).toLowerCase();
    if (named.has(name)) return named.get(name);
    const radix = name.startsWith('#x') ? 16 : 10;
    const digits = name.slice(radix === 16 ? 2 : 1);
    const codePoint = Number.parseInt(digits, radix);
    if (!Number.isInteger(codePoint) || codePoint < 0 || codePoint > 0x10ffff
        || (codePoint >= 0xd800 && codePoint <= 0xdfff)) return entity;
    return String.fromCodePoint(codePoint);
  });
}

function jsonLdObjects(value) {
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value)) return value.flatMap(jsonLdObjects);
  return [value, ...Object.values(value).flatMap(jsonLdObjects)];
}

function structuredImageUrl(image) {
  if (typeof image === 'string') return image;
  if (Array.isArray(image)) return image.map(structuredImageUrl).find(Boolean) || '';
  if (image && typeof image === 'object') return image.contentUrl || image.url || '';
  return '';
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(path));
    else files.push(path);
  }
  return files;
}

function assert(condition, message) {
  if (!condition) failures.push(message);
}

const htmlFiles = (await walk(root)).filter((file) => file.endsWith('.html'));
for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  const name = relative(root, file);
  const isRedirect = /<meta http-equiv="refresh" content="0;url=[^"]+">/.test(html);
  if (isRedirect) {
    assert(/<meta name="robots" content="noindex">/.test(html), `${name}: redirection sans noindex`);
    const route = `/${name.replace(/\/index\.html$/, '')}`;
    const expectedDestination = legacySurfaceRedirects[route];
    if (expectedDestination) {
      const absoluteDestination = new URL(expectedDestination, 'https://l0g.fr').toString();
      assert(
        html.includes(`<meta http-equiv="refresh" content="0;url=${expectedDestination}">`),
        `${name}: destination de migration incorrecte`
      );
      assert(
        html.includes(`<link rel="canonical" href="${absoluteDestination}">`),
        `${name}: canonical de migration incorrecte`
      );
    } else {
      assert(/<link rel="canonical" href="https:\/\/l0g\.fr\/[^\"]+">/.test(html), `${name}: redirection sans canonical`);
    }
    continue;
  }
  assert(/<title>[^<]+<\/title>/.test(html), `${name}: title absent`);
  assert(/<meta name="description" content="[^"]+">/.test(html), `${name}: meta description absente`);
  assert(/<link rel="canonical" href="https:\/\/l0g\.fr\/[^"]*">/.test(html), `${name}: canonical absente ou invalide`);
  assert((html.match(/<h1(?:\s|>)/g) || []).length === 1, `${name}: exactement un h1 attendu`);
  if (html.includes('/_astro/pagefind-init.')) {
    assert(name === 'recherche/index.html', `${name}: Pagefind chargé hors de la page de recherche`);
  }

  const elements = scanHtmlElements(html);
  for (const image of elements.filter((element) => element.name === 'img')) {
    assert(image.attributes.has('alt'), `${name}: image sans alt`);
    assert(Number(image.attributes.get('width')) > 0, `${name}: image sans largeur intrinsèque`);
    assert(Number(image.attributes.get('height')) > 0, `${name}: image sans hauteur intrinsèque`);
    assert(image.attributes.get('loading') === 'lazy', `${name}: image sans loading=lazy`);
    assert(image.attributes.get('decoding') === 'async', `${name}: image sans decoding=async`);
  }
  const title = decodeHtml(html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim());
  const description = decodeHtml(elements.find((element) =>
    element.name === 'meta' && element.attributes.get('name') === 'description'
  )?.attributes.get('content'));
  const robots = elements.find((element) =>
    element.name === 'meta' && element.attributes.get('name') === 'robots'
  )?.attributes.get('content') || '';
  const canonical = elements.find((element) =>
    element.name === 'link' && element.attributes.get('rel') === 'canonical'
  )?.attributes.get('href') || '';
  const alternates = elements
    .filter((element) => element.name === 'link'
      && element.attributes.get('rel') === 'alternate'
      && element.attributes.has('hreflang'))
    .map((element) => ({
      hreflang: element.attributes.get('hreflang'),
      href: element.attributes.get('href'),
    }));
  const jsonLd = elements
    .filter((element) => element.name === 'script' && element.attributes.get('type') === 'application/ld+json')
    .flatMap((element) => {
      try {
        return jsonLdObjects(JSON.parse(element.body));
      } catch {
        assert(false, `${name}: JSON-LD invalide`);
        return [];
      }
    });
  for (const dataset of jsonLd.filter((item) => item['@type'] === 'Dataset')) {
    assert(
      dataset.creator?.['@id'] === 'https://l0g.fr/#org',
      `${name}: creator du Dataset absent ou incohérent`
    );
  }

  pages.set(canonical, { name, html, title, description, robots, canonical, alternates, jsonLd });

  if (canonical.startsWith('https://l0g.fr/en/')) {
    assert(title.length <= 60, `${name}: title anglais trop long (${title.length})`);
    assert(description.length <= 155, `${name}: description anglaise trop longue (${description.length})`);
  }

  const isNewsAnalysis = /^posts\/[^/]+\/index\.html$/.test(name)
    || /^en\/analysis\/(?!page\/)[^/]+\/index\.html$/.test(name);
  const isGuide = /^guides\/[^/]+\/index\.html$/.test(name)
    || /^en\/guides\/[^/]+\/index\.html$/.test(name);
  const isArticle = isNewsAnalysis || isGuide;
  if (isArticle) {
    const expectedType = isNewsAnalysis ? 'NewsArticle' : 'Article';
    const article = jsonLd.find((item) => item['@type'] === expectedType);
    assert(Boolean(article), `${name}: ${expectedType} JSON-LD absent`);
    assert(article?.['@id'] === `${canonical}#article`, `${name}: identifiant Article instable`);
    assert(article?.url === canonical, `${name}: URL Article absente ou incohérente`);
    const articleImageUrl = structuredImageUrl(article?.image);
    assert(
      articleImageUrl.startsWith('https://l0g.fr/'),
      `${name}: image Article absolue absente`
    );
    assert(article?.isAccessibleForFree === true, `${name}: gratuité Article absente`);
    assert(article?.publisher?.['@type'] === 'NewsMediaOrganization', `${name}: publisher doit être une NewsMediaOrganization`);
    assert(article?.publisher?.['@id'] === 'https://l0g.fr/#org', `${name}: identifiant publisher instable`);
    const authorLink = elements.find((element) =>
      element.name === 'a'
      && element.attributes.get('href') === '/about/'
      && element.attributes.get('rel') === 'author'
    );
    if (isNewsAnalysis) {
      assert(typeof article?.headline === 'string' && article.headline.length > 0, `${name}: headline NewsArticle absent`);
      assert(Boolean(article?.datePublished), `${name}: datePublished NewsArticle absente`);
      assert(Boolean(article?.dateModified), `${name}: dateModified NewsArticle absente`);
      assert(article?.author?.['@type'] === 'Person', `${name}: author NewsArticle doit être une Person`);
      assert(article?.author?.['@id'] === 'https://l0g.fr/about/#bluetouff', `${name}: identifiant auteur instable`);
      assert(article?.author?.url === 'https://l0g.fr/about/', `${name}: profil auteur NewsArticle incohérent`);
      assert(
        Boolean(authorLink)
          && /<a href="\/about\/" rel="author"[^>]*>(?:By )?Olivier Laurelli \/ bluetouff<\/a>/.test(html),
        `${name}: signature personnelle cliquable absente`
      );
      const ogImage = elements.find((element) =>
        element.name === 'meta' && element.attributes.get('property') === 'og:image'
      )?.attributes.get('content') || '';
      const visibleImage = elements.find((element) =>
        element.name === 'img' && element.attributes.has('data-article-image')
      );
      const visibleImageUrl = visibleImage
        ? new URL(decodeHtml(visibleImage.attributes.get('src')), canonical).toString()
        : '';
      assert(Boolean(visibleImage), `${name}: image principale absente du HTML`);
      assert(articleImageUrl === ogImage, `${name}: NewsArticle.image diffère de og:image`);
      assert(articleImageUrl === visibleImageUrl, `${name}: image HTML diffère de NewsArticle.image`);
    } else {
      assert(article?.author?.['@type'] === 'NewsMediaOrganization', `${name}: author du guide doit être une NewsMediaOrganization`);
      assert(article?.author?.['@id'] === 'https://l0g.fr/#org', `${name}: identifiant auteur du guide instable`);
      assert(
        /<a href="\/(?:en\/)?about\/" rel="author"[^>]*>(?:(?:Par|By) )?l0g<\/a>/.test(html),
        `${name}: byline l0g cliquable du guide absente`
      );
    }
  }
}

const home = await readFile(new URL('index.html', rootUrl));
const homeText = home.toString('utf8');
const homePage = pages.get('https://l0g.fr/');
const homeWebsite = homePage?.jsonLd.find((item) => item['@type'] === 'WebSite');
assert(homeWebsite?.name === 'l0g', 'home: WebSite.name doit être l0g');
assert(homeWebsite?.alternateName === 'l0g.fr', 'home: WebSite.alternateName doit être l0g.fr');
assert(homeWebsite?.url === 'https://l0g.fr/', 'home: WebSite.url incohérente');
assert(homeWebsite?.publisher?.['@id'] === 'https://l0g.fr/#org', 'home: publisher WebSite incohérent');
assert(homeWebsite?.creator?.['@id'] === 'https://l0g.fr/about/#bluetouff', 'home: creator WebSite incohérent');
const homeGzip = gzipSync(home, { level: 9 });
const inlineScriptSizes = [...homeText.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
  .map((match) => Buffer.byteLength(match[1]));
const maxInline = Math.max(0, ...inlineScriptSizes);

// Les styles critiques sont intégrés au document : le budget porte sur le
// transfert HTML+CSS complet, sans requête de feuille de style bloquante.
assert(home.length <= 200_000, `index.html dépasse 200 Ko (${home.length} octets)`);
assert(homeGzip.length <= 32_000, `index.html gzip dépasse 32 Ko (${homeGzip.length} octets)`);
assert(maxInline <= 2_000, `index.html contient un script inline de ${maxInline} octets`);
assert(!/<link\s[^>]*rel="stylesheet"/i.test(homeText), 'home: feuille CSS externe bloquante détectée');
assert(!/class="[^"]*\brise\b[^"]*\bhome-intro\b|class="[^"]*\bhome-intro\b[^"]*\brise\b/.test(homeText), 'home: animation d’entrée appliquée au contenu LCP');
assert(!homeText.includes('modelContext.registerTool'), 'WebMCP est de nouveau injecté inline dans index.html');
const webMcpLoaderHref = homeText.match(/<script type="module" src="(\/_astro\/WebMCPTools\.[^"]+\.js)"><\/script>/)?.[1];
assert(Boolean(webMcpLoaderHref), 'chargeur WebMCP externe absent');
if (webMcpLoaderHref) {
  const webMcpLoader = await readFile(new URL(`.${webMcpLoaderHref}`, rootUrl), 'utf8');
  assert(Buffer.byteLength(webMcpLoader) <= 2_000, `chargeur WebMCP trop lourd (${Buffer.byteLength(webMcpLoader)} octets)`);
  assert(webMcpLoader.includes('modelContext'), 'détection de compatibilité WebMCP absente du chargeur');
  assert(webMcpLoader.includes('import('), 'import dynamique WebMCP absent du chargeur');
  assert(!webMcpLoader.includes('registerTool'), 'le runtime WebMCP est encore inclus dans le chargeur critique');
}
const astroJsFiles = (await walk(join(root, '_astro'))).filter((file) => file.endsWith('.js'));
const webMcpRuntimeFiles = [];
for (const file of astroJsFiles) {
  const source = await readFile(file, 'utf8');
  if (source.includes('registerTool') && source.includes('modelContext')) webMcpRuntimeFiles.push(file);
}
assert(webMcpRuntimeFiles.length === 1, `runtime WebMCP conditionnel introuvable ou dupliqué (${webMcpRuntimeFiles.length})`);
for (const file of webMcpRuntimeFiles) {
  assert(!homeText.includes(`/_astro/${relative(join(root, '_astro'), file)}`), 'runtime WebMCP encore chargé directement par la home');
}
assert(!homeText.includes('/_astro/pagefind-init.'), 'Pagefind ne doit pas être chargé sur la home');
assert(!homeText.includes('/risk.js'), 'le script risque non versionné est encore chargé sur la home');
assert(
  /<script src="\/_astro\/risk\.[^"]+\.js" defer><\/script>/.test(homeText),
  'asset risque versionné absent de la home'
);
const fontPreloads = [...homeText.matchAll(
  /<link rel="preload" href="(\/_astro\/[^"]+\.woff2)" as="font" type="font\/woff2" crossorigin="anonymous">/g
)].map((match) => match[1]);
assert(fontPreloads.length === 2, `home: exactement deux polices critiques doivent être préchargées (${fontPreloads.length})`);
assert(
  fontPreloads.some((href) => href.includes('/inter-latin-wght-normal.')),
  'home: préchargement de la police Inter latin absent'
);
assert(
  fontPreloads.some((href) => href.includes('/jetbrains-mono-latin-wght-normal.')),
  'home: préchargement de la police JetBrains Mono latin absent'
);
assert(!homeText.includes('source en attente'), 'la home contient encore un placeholder de risque');
const featuredPosition = homeText.indexOf('id="featured-title"');
const riskPosition = homeText.indexOf('class="home-risk"');
const needsPosition = homeText.indexOf('id="home-needs-title"');
assert(featuredPosition > 0 && featuredPosition < riskPosition, 'home: analyse vedette absente ou placée après les signaux');
assert(riskPosition < needsPosition, 'home: signaux absents ou placés après les cartes d’orientation');
for (const key of ['us', 'eu', 'yen', 'energie', 'debt']) {
  const tile = homeText.match(new RegExp(`<article[^>]*data-risk="${key}"[^>]*>([\\s\\S]*?)</article>`))?.[1] ?? '';
  assert(Boolean(tile), `home: carte risque ${key} absente`);
  const hasNumericValue = /data-value[^>]*>\s*\d+(?:[.,]\d+)?\s*</.test(tile);
  const failsClosed = /data-value[^>]*>\s*—\s*</.test(tile)
    && /data-level[^>]*>\s*INDISPONIBLE\s*</.test(tile);
  assert(
    hasNumericValue || failsClosed,
    `home: ${key} doit exposer une valeur statique ou un état INDISPONIBLE explicite`,
  );
  assert(/data-status[^>]*>\s*[^<\s][^<]*</.test(tile), `home: statut statique ${key} absent`);
  assert(
    /class="risk-tile-main risk-dashboard-link"[^>]*target="_blank"/.test(tile),
    `home: accès principal au dashboard ${key} absent`,
  );
  assert(
    new RegExp(`class="risk-proof-link"[^>]*href="/maintenant/#signal-${key}"`).test(tile),
    `home: preuve interne ${key} absente`,
  );
}

const glossary = await readFile(new URL('glossaire/index.html', rootUrl));
const glossaryGzip = gzipSync(glossary, { level: 9 });
assert(glossary.length <= 300_000, `glossaire/index.html dépasse 300 Ko (${glossary.length} octets)`);
assert(glossaryGzip.length <= 60_000, `glossaire/index.html gzip dépasse 60 Ko (${glossaryGzip.length} octets)`);

const search = await readFile(new URL('recherche/index.html', rootUrl), 'utf8');
assert(/<script src="\/_astro\/pagefind-init\.[^"]+\.js" defer><\/script>/.test(search), 'asset Pagefind versionné absent de /recherche/');
assert(!search.includes('/pagefind-init.js'), 'initialiseur Pagefind non versionné encore chargé sur /recherche/');
assert(!search.includes('/pagefind/pagefind-ui.js'), 'UI Pagefind à sinks DOM encore chargée sur /recherche/');
assert(/<meta name="robots" content="noindex,follow">/.test(search), '/recherche/ doit être noindex,follow');
assert(search.includes('aria-keyshortcuts="/ Meta+K Control+K"'), '/recherche/: raccourcis clavier non documentés');
const searchPageScriptHref = search.match(/src="(\/_astro\/recherche\.astro[^"]+\.js)"/)?.[1];
assert(Boolean(searchPageScriptHref), '/recherche/: script de page versionné absent');
if (searchPageScriptHref) {
  const searchPageScript = await readFile(new URL(`.${searchPageScriptHref}`, rootUrl), 'utf8');
  assert(searchPageScript.includes('focus') && searchPageScript.includes('.focus()'), '/recherche/: focus demandé par raccourci non pris en charge');
}

const notFound = await readFile(new URL('404.html', rootUrl), 'utf8');
assert(/<meta name="robots" content="noindex,follow">/.test(notFound), '/404.html doit être noindex,follow');
assert(notFound.includes('action="/recherche/"'), '/404.html: moteur de recherche absent');
for (const href of ['/', '/sujets/', '/guides/']) {
  assert(notFound.includes(`href="${href}"`), `/404.html: lien de sortie absent ${href}`);
}
assert(!notFound.includes('/_astro/pagefind-init.'), '/404.html ne doit pas charger Pagefind');

const indexablePages = [...pages.values()].filter((page) => !page.robots.includes('noindex'));
const titles = new Map();
for (const page of indexablePages) {
  const entries = titles.get(page.title) || [];
  entries.push(page.name);
  titles.set(page.title, entries);
}
for (const [title, names] of titles) {
  assert(names.length === 1, `title dupliqué "${title}" : ${names.join(', ')}`);
}

for (const page of pages.values()) {
  if (!page.alternates.length) continue;
  assert(page.alternates.some((alternate) => alternate.href === page.canonical), `${page.name}: hreflang self absent`);
  for (const alternate of page.alternates.filter((entry) => entry.hreflang !== 'x-default')) {
    assert(/^https:\/\/l0g\.fr\//.test(alternate.href), `${page.name}: hreflang non absolu`);
    const target = pages.get(alternate.href);
    assert(Boolean(target), `${page.name}: cible hreflang absente ${alternate.href}`);
    if (target) {
      assert(target.alternates.some((entry) => entry.href === page.canonical), `${page.name}: retour hreflang absent depuis ${target.name}`);
    }
  }
}

const profile = pages.get('https://l0g.fr/about/');
const profilePage = profile?.jsonLd.find((item) => item['@type'] === 'ProfilePage');
const profileSameAs = new Set(profilePage?.mainEntity?.sameAs || []);
assert(profile?.title === "l0g, média d'information économique indépendant · l0g.fr", '/about/: title média incorrect');
assert(profilePage?.mainEntity?.['@type'] === 'Person', '/about/: ProfilePage Person absent');
assert(profilePage?.mainEntity?.['@id'] === 'https://l0g.fr/about/#bluetouff', '/about/: identifiant Person incorrect');
assert(
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?(?:Z|[+-]\d{2}:\d{2})$/.test(profilePage?.dateModified ?? '')
    && !Number.isNaN(Date.parse(profilePage.dateModified)),
  '/about/: dateModified doit être un DateTime ISO 8601 avec fuseau horaire'
);
assert(
  profileSameAs.has('https://github.com/bluetouff')
    && profileSameAs.has('https://x.com/bluetouff'),
  '/about/: profils officiels sameAs incomplets'
);
assert(
  Array.isArray(profilePage?.mainEntity?.knowsAbout) && profilePage.mainEntity.knowsAbout.length >= 4,
  '/about/: domaines knowsAbout insuffisants'
);

const requiredTopicPillars = new Map([
  ['https://l0g.fr/sujet/credit-prive/', [
    '/guides/analyser-credit-prive/',
    '/glossaire/credit-prive/',
    '/methodologie/debt-risk-radar/',
  ]],
  ['https://l0g.fr/sujet/liquidite-repo/', [
    '/guides/liquidite-tresor-dts-tga-rrp/',
    '/guides/lire-le-marche-du-repo-sofr/',
    '/glossaire/repo/',
  ]],
  ['https://l0g.fr/sujet/ormuz-petrole/', [
    '/guides/lire-le-marche-petrolier/',
    '/glossaire/chokepoint/',
    '/methodologie/energie/',
  ]],
  ['https://l0g.fr/sujet/regulation-crypto-us/', [
    '/guides/qui-applique-le-genius-act/',
    '/guides/stablecoins-genius-act/',
    '/glossaire/clarity/',
  ]],
]);
for (const [canonical, entryPoints] of requiredTopicPillars) {
  const page = pages.get(canonical);
  assert(Boolean(page), `${canonical}: page-pilier absente`);
  assert(page?.html.includes('data-topic-pillar='), `${canonical}: contrat page-pilier absent`);
  assert(
    page?.jsonLd.some((item) => item['@type'] === 'CollectionPage'),
    `${canonical}: CollectionPage JSON-LD absente`
  );
  for (const href of entryPoints) {
    assert(page?.html.includes(`href="${href}"`), `${canonical}: référence structurante absente ${href}`);
  }
}

const pressFr = pages.get('https://l0g.fr/ressources-journalistes/');
const pressEn = pages.get('https://l0g.fr/en/press-resources/');
assert(Boolean(pressFr), '/ressources-journalistes/: page absente');
assert(Boolean(pressEn), '/en/press-resources/: page absente');
for (const page of [pressFr, pressEn].filter(Boolean)) {
  assert(
    page.jsonLd.some((item) => item['@type'] === 'CollectionPage'),
    `${page.name}: CollectionPage JSON-LD absente`
  );
  for (const format of ['SVG', 'CSV', 'JSON', 'NDJSON']) {
    assert(page.html.includes(`>${format}</a>`), `${page.name}: format ${format} absent`);
  }
}
const signalSlugs = [
  'barometre-stress-macro-us',
  'barometre-stress-macro-euro',
  'thermometre-fragilite-carry-yen',
  'indice-tension-energie',
  'thermometre-stress-dette',
];
for (const slug of signalSlugs) {
  const page = pages.get(`https://l0g.fr/series/${slug}/`);
  const dataset = page?.jsonLd.find((item) => item['@type'] === 'Dataset');
  assert(Boolean(dataset), `${slug}: Dataset JSON-LD absent`);
  assert(
    dataset?.creator?.['@id'] === 'https://l0g.fr/#org',
    `${slug}: creator du Dataset absent ou incohérent`
  );
  const svg = await readFile(join(root, 'api/v1/signals', slug, 'chart.svg'), 'utf8');
  assert(svg.includes('<svg') && svg.includes('width="1200"') && svg.includes('height="630"'), `${slug}: SVG réutilisable invalide`);
  assert(svg.includes(`Source : l0g.fr/series/${slug}/ · CC BY 4.0`), `${slug}: attribution SVG absente`);
}

const sitemapFiles = (await readdir(root)).filter((name) => /^sitemap-\d+\.xml$/.test(name));
const sitemapBlocks = [];
for (const filename of sitemapFiles) {
  const xml = await readFile(join(root, filename), 'utf8');
  sitemapBlocks.push(...xml.matchAll(/<url>([\s\S]*?)<\/url>/g));
}
assert(sitemapBlocks.length > 0, 'sitemap vide');
const sitemapLastmods = new Set();
for (const match of sitemapBlocks) {
  const block = match[1];
  const loc = decodeHtml(block.match(/<loc>([^<]+)<\/loc>/)?.[1]);
  const lastmod = block.match(/<lastmod>([^<]+)<\/lastmod>/)?.[1] || '';
  assert(Boolean(lastmod), `${loc || 'URL inconnue'}: lastmod absent`);
  assert(!Number.isNaN(Date.parse(lastmod)), `${loc || 'URL inconnue'}: lastmod invalide`);
  assert(loc !== 'https://l0g.fr/recherche/', '/recherche/ ne doit pas figurer dans le sitemap');
  if (lastmod) sitemapLastmods.add(lastmod);
}
assert(sitemapLastmods.size > 10, `lastmod insuffisamment spécifique (${sitemapLastmods.size} valeurs)`);

const apache = await readFile(new URL('../deploy/l0g.fr.apache.conf', import.meta.url), 'utf8');
for (const mime of ['text/plain', 'text/javascript', 'application/x-ndjson', 'application/wasm']) {
  assert(apache.includes(mime), `compression Apache absente pour ${mime}`);
}
assert((apache.match(/Protocols h2 http\/1\.1/g) || []).length === 2, 'HTTP/2 absent d’un vhost TLS');
assert(apache.includes('BrotliCompressionQuality 5'), 'qualité Brotli attendue absente');
assert(apache.includes('AddOutputFilterByType BROTLI_COMPRESS'), 'compression Brotli absente');
assert(apache.includes('AddOutputFilterByType DEFLATE'), 'repli gzip absent');
assert(apache.includes('<LocationMatch "^/_astro/">'), 'cache fingerprinté /_astro absent');
assert(apache.includes('max-age=31536000, immutable'), 'cache immutable /_astro absent');

if (failures.length) {
  console.error(`Audit performance/SEO en échec (${failures.length})`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Performance/SEO OK: ${htmlFiles.length} HTML, home ${home.length} o (${homeGzip.length} o gzip), ` +
  `glossaire ${glossary.length} o (${glossaryGzip.length} o gzip), inline max ${maxInline} o, ` +
  `${sitemapBlocks.length} URL datées, images, presse, hreflang et auteur validés.`
);
