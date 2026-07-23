import { gzipSync } from 'node:zlib';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanHtmlElements } from '../src/lib/html-utils.ts';

const rootUrl = new URL('../dist/', import.meta.url);
const root = fileURLToPath(rootUrl);
const failures = [];
const pages = new Map();

function decodeHtml(value) {
  return String(value || '')
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#([0-9]+);/g, (_, code) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function jsonLdObjects(value) {
  if (!value || typeof value !== 'object') return [];
  if (Array.isArray(value)) return value.flatMap(jsonLdObjects);
  return [value, ...Object.values(value).flatMap(jsonLdObjects)];
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
    assert(/<link rel="canonical" href="https:\/\/l0g\.fr\/[^\"]+">/.test(html), `${name}: redirection sans canonical`);
    continue;
  }
  assert(/<title>[^<]+<\/title>/.test(html), `${name}: title absent`);
  assert(/<meta name="description" content="[^"]+">/.test(html), `${name}: meta description absente`);
  assert(/<link rel="canonical" href="https:\/\/l0g\.fr\/[^"]*">/.test(html), `${name}: canonical absente ou invalide`);
  assert((html.match(/<h1(?:\s|>)/g) || []).length === 1, `${name}: exactement un h1 attendu`);
  if (html.includes('/pagefind/pagefind-ui.js')) {
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

  pages.set(canonical, { name, html, title, description, robots, canonical, alternates, jsonLd });

  if (canonical.startsWith('https://l0g.fr/en/')) {
    assert(title.length <= 60, `${name}: title anglais trop long (${title.length})`);
    assert(description.length <= 155, `${name}: description anglaise trop longue (${description.length})`);
  }

  const isArticle = /^posts\/[^/]+\/index\.html$/.test(name)
    || /^guides\/[^/]+\/index\.html$/.test(name)
    || /^en\/analysis\/(?!page\/)[^/]+\/index\.html$/.test(name)
    || /^en\/guides\/[^/]+\/index\.html$/.test(name);
  if (isArticle) {
    const article = jsonLd.find((item) => item['@type'] === 'Article');
    assert(Boolean(article), `${name}: Article JSON-LD absent`);
    assert(article?.['@id'] === `${canonical}#article`, `${name}: identifiant Article instable`);
    assert(article?.url === canonical, `${name}: URL Article absente ou incohérente`);
    assert(
      typeof article?.image === 'string' && article.image.startsWith('https://l0g.fr/'),
      `${name}: image Article absolue absente`
    );
    assert(article?.isAccessibleForFree === true, `${name}: gratuité Article absente`);
    assert(article?.author?.['@type'] === 'Person', `${name}: author doit être une Person`);
    assert(article?.author?.['@id'] === 'https://l0g.fr/about/#bluetouff', `${name}: identifiant auteur instable`);
    assert(article?.publisher?.['@type'] === 'Organization', `${name}: publisher doit être une Organization`);
    assert(article?.publisher?.['@id'] === 'https://l0g.fr/#org', `${name}: identifiant publisher instable`);
    assert(/<a href="\/about\/#bluetouff" rel="author"[^>]*>(?:Par|By) Bluetouff<\/a>/.test(html), `${name}: byline auteur cliquable absente`);
  }
}

const home = await readFile(new URL('index.html', rootUrl));
const homeText = home.toString('utf8');
const homeGzip = gzipSync(home, { level: 9 });
const inlineScriptSizes = [...homeText.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)]
  .map((match) => Buffer.byteLength(match[1]));
const maxInline = Math.max(0, ...inlineScriptSizes);

assert(home.length <= 90_000, `index.html dépasse 90 Ko (${home.length} octets)`);
assert(homeGzip.length <= 16_000, `index.html gzip dépasse 16 Ko (${homeGzip.length} octets)`);
assert(maxInline <= 2_000, `index.html contient un script inline de ${maxInline} octets`);
assert(!homeText.includes('modelContext.registerTool'), 'WebMCP est de nouveau injecté inline dans index.html');
assert(/<script type="module" src="\/_astro\/WebMCPTools\.[^"]+\.js"><\/script>/.test(homeText), 'module WebMCP externe absent');
assert(!homeText.includes('/pagefind/pagefind-ui.js'), 'Pagefind ne doit pas être chargé sur la home');
assert(!homeText.includes('source en attente'), 'la home contient encore un placeholder de risque');
for (const key of ['us', 'eu', 'yen', 'energie', 'debt']) {
  const tile = homeText.match(new RegExp(`<a[^>]*data-risk="${key}"[^>]*>([\\s\\S]*?)</a>`))?.[1] ?? '';
  assert(Boolean(tile), `home: carte risque ${key} absente`);
  assert(/data-value[^>]*>\s*\d+(?:[.,]\d+)?\s*</.test(tile), `home: valeur statique ${key} absente`);
  assert(/data-status[^>]*>\s*[^<\s][^<]*</.test(tile), `home: statut statique ${key} absent`);
}

const glossary = await readFile(new URL('glossaire/index.html', rootUrl));
const glossaryGzip = gzipSync(glossary, { level: 9 });
assert(glossary.length <= 300_000, `glossaire/index.html dépasse 300 Ko (${glossary.length} octets)`);
assert(glossaryGzip.length <= 60_000, `glossaire/index.html gzip dépasse 60 Ko (${glossaryGzip.length} octets)`);

const search = await readFile(new URL('recherche/index.html', rootUrl), 'utf8');
assert(search.includes('/pagefind/pagefind-ui.js'), 'Pagefind absent de /recherche/');
assert(/<meta name="robots" content="noindex,follow">/.test(search), '/recherche/ doit être noindex,follow');

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
assert(profile?.title === 'Bluetouff, auteur et analyste de l0g · l0g.fr', '/about/: title auteur incorrect');
assert(profilePage?.mainEntity?.['@type'] === 'Person', '/about/: ProfilePage Person absent');
assert(profilePage?.mainEntity?.['@id'] === 'https://l0g.fr/about/#bluetouff', '/about/: identifiant Person incorrect');
assert(
  profilePage?.mainEntity?.sameAs?.includes('https://github.com/bluetouff')
    && profilePage?.mainEntity?.sameAs?.includes('https://x.com/bluetouff'),
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
