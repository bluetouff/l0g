// scripts/check-internal-links.mjs
// Vérifie que tous les liens internes du site généré (dist/) pointent vers
// une cible réellement produite. Fait échouer le build si un lien est mort.
// Attrape la classe de bugs "lien interne cassé", y compris les liens
// relatifs (ex. un slug de guide nu dans le glossaire qui produit un lien
// relatif inexistant).
//
//   node scripts/check-internal-links.mjs
//
// À lancer APRÈS `astro build` et `pagefind` (leurs fichiers doivent exister).

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, extname } from 'node:path';
import { scanHtmlElements } from '../src/lib/html-utils.ts';

const DIST = 'dist';
const SITE_ORIGIN = 'https://l0g.fr';
const SOCIAL_IMAGE_METADATA = new Set([
  'og:image',
  'og:image:url',
  'og:image:secure_url',
  'twitter:image',
]);

// Endpoints servis au runtime par le serveur (pas générés dans dist/).
// À maintenir à la main ; garder au strict minimum.
const RUNTIME_ENDPOINTS = new Set([
  '/api/mcp',
  '/api/mcp/compact',
  '/api/mcp/usage',
  '/api/v1/history.ndjson',
  '/api/v1/human-traffic.json',
]);

function walkFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walkFiles(full, out);
    else out.push(full);
  }
  return out;
}

// Chemin URL d'un fichier de dist, ex "dist/guides/x/index.html" -> "/guides/x/".
function pageUrl(file) {
  const rel = '/' + relative(DIST, file).split('\\').join('/');
  return rel.endsWith('/index.html') ? rel.slice(0, -'index.html'.length) : rel;
}

function urlPathsFor(file) {
  const rel = '/' + relative(DIST, file).split('\\').join('/');
  const paths = new Set([rel]);
  if (rel.endsWith('/index.html')) {
    const dir = rel.slice(0, -'index.html'.length);
    paths.add(dir);
    paths.add(dir.replace(/\/$/, '') || '/');
  }
  return paths;
}

const files = walkFiles(DIST);
const htmlFiles = files.filter((f) => f.endsWith('.html'));

// Ensemble des chemins servables statiquement.
const valid = new Set();
for (const f of files) for (const p of urlPathsFor(f)) valid.add(p);
valid.add('/');

function resolves(path) {
  if (valid.has(path)) return true;
  if (valid.has(path + '/')) return true;
  if (path.endsWith('/') && valid.has(path.slice(0, -1))) return true;
  if (!extname(path) && valid.has(path + '/index.html')) return true;
  return false;
}

// true si le href est externe / non résolvable (à ignorer).
function isExternal(href) {
  if (!href) return true;
  if (href.startsWith('#')) return true;
  if (href.startsWith('//')) return true; // protocole-relatif
  if (/^[a-z][a-z0-9+.-]*:/i.test(href)) return true; // http:, mailto:, tel:, data:, javascript:
  return false;
}

function socialImageReference(element) {
  if (element.name !== 'meta') return null;
  const key = (element.attributes.get('property') || element.attributes.get('name') || '').toLowerCase();
  return SOCIAL_IMAGE_METADATA.has(key) ? element.attributes.get('content') : null;
}

function internalPath(raw, base, allowSameOriginAbsolute = false) {
  if (!raw) return null;
  if (!allowSameOriginAbsolute && isExternal(raw)) return null;
  try {
    const url = new URL(raw, base);
    if (allowSameOriginAbsolute && url.origin !== SITE_ORIGIN && url.origin !== 'https://l0g.local') {
      return null;
    }
    return url.pathname;
  } catch {
    return null;
  }
}

const broken = [];
let checked = 0;

for (const file of htmlFiles) {
  const elements = scanHtmlElements(readFileSync(file, 'utf8'));
  const base = 'https://l0g.local' + pageUrl(file);
  const seen = new Set();
  for (const element of elements) {
    if (element.name === 'script' || element.name === 'style') continue;
    const references = [
      ['href', element.attributes.get('href'), false],
      ['src', element.attributes.get('src'), false],
      ['content', socialImageReference(element), true],
    ];
    for (const [attribute, raw, allowSameOriginAbsolute] of references) {
      const path = internalPath(raw, base, allowSameOriginAbsolute);
      if (!path) continue;
      if (seen.has(path)) continue;
      seen.add(path);
      if (RUNTIME_ENDPOINTS.has(path)) continue;
      checked += 1;
      if (!resolves(path)) broken.push({ from: '/' + relative(DIST, file), href: `${attribute}=${raw}`, path });
    }
  }
}

if (broken.length > 0) {
  const byFile = new Map();
  for (const b of broken) {
    if (!byFile.has(b.from)) byFile.set(b.from, []);
    byFile.get(b.from).push(b.path === b.href ? b.href : `${b.href}  (→ ${b.path})`);
  }
  console.error(`\nLiens internes cassés : ${broken.length}\n`);
  for (const [from, hrefs] of byFile) {
    console.error(`  ${from}`);
    for (const h of [...new Set(hrefs)]) console.error(`    -> ${h}`);
  }
  console.error('');
  throw new Error(`${broken.length} lien(s) interne(s) cassé(s) dans dist/.`);
}

console.log(`Liens internes OK : ${checked} liens vérifiés sur ${htmlFiles.length} pages, aucun cassé.`);
