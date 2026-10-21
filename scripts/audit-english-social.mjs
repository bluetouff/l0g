import { readFile, readdir, realpath } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { getEnglishPageSocial } from '../src/config/english-page-social.mjs';
import { scanHtmlElements } from '../src/lib/html-utils.ts';

const SITE_ORIGIN = 'https://l0g.fr';
const FRENCH_BRAND_CARDS = new Set([
  '/og-default.png', '/og-home.png', '/og-manifeste.png', '/og-terminal.png',
  '/og-status.png', '/og-donnees.png', '/og-protocole-editorial.png',
  '/og-changelog-editorial.png', '/og-l-argent-d-epstein.png',
]);
const FRENCH_ALT_COPY = /(?:^|[^\p{L}\p{N}])(?:carte sociale|sources primaires|aucun tracker|zéro tracker|édition française)(?=$|[^\p{L}\p{N}])/iu;

function within(directory, target) {
  const path = relative(directory, target);
  return path !== '' && !isAbsolute(path) && path !== '..' && !path.startsWith(`..${sep}`);
}

function imageReference(raw) {
  try {
    const url = new URL(raw);
    if (url.origin !== SITE_ORIGIN || url.username || url.password || url.search || url.hash) return null;
    // A canonical absolute URL avoids URL-normalisation tricks and cache aliases.
    if (url.href !== raw || /%(?:2f|5c)/iu.test(url.pathname)) return null;
    const path = decodeURIComponent(url.pathname);
    if (/[\u0000-\u001f\\]/u.test(path) || path.split('/').some(part => part === '.' || part === '..')) return null;
    return { url: url.href, path };
  } catch {
    return null;
  }
}

function genuineRedirect(elements, metadata, route) {
  if ([...metadata.keys()].some(key => key.startsWith('og:') || key.startsWith('twitter:'))) return false;
  const refresh = elements.find(element => element.name === 'meta' &&
    element.attributes.get('http-equiv')?.toLowerCase() === 'refresh');
  const destination = refresh?.attributes.get('content')?.match(/^0\s*;\s*url\s*=\s*(\S+)\s*$/iu)?.[1];
  const canonical = elements.find(element => element.name === 'link' &&
    element.attributes.get('rel')?.toLowerCase() === 'canonical')?.attributes.get('href');
  if (!destination || !canonical || !/(?:^|[\s,])noindex(?:$|[\s,])/iu.test(metadata.get('robots') ?? '')) return false;
  try {
    const target = new URL(destination, SITE_ORIGIN);
    return target.origin === SITE_ORIGIN && !target.username && !target.password && !target.search && !target.hash &&
      target.pathname.startsWith('/en/') && target.pathname !== route && target.href === canonical;
  } catch {
    return false;
  }
}

/** Validate rendered metadata and its local asset; no requests or OCR are performed. */
export async function validateEnglishSocialHtml(html, route, { distDir = 'dist', metadataCache = new Map() } = {}) {
  const elements = scanHtmlElements(html);
  const metadata = new Map();
  const duplicates = new Set();
  for (const element of elements) {
    if (element.name !== 'meta') continue;
    const key = (element.attributes.get('property') ?? element.attributes.get('name') ?? '').toLowerCase();
    if (!key) continue;
    if (metadata.has(key)) duplicates.add(key);
    metadata.set(key, element.attributes.get('content') ?? '');
  }
  if (genuineRedirect(elements, metadata, route)) return { route, redirect: true, errors: [] };

  const errors = [];
  const language = elements.find(element => element.name === 'html')?.attributes.get('lang') ?? '';
  if (!/^en(?:-[a-z0-9]+)*$/iu.test(language)) errors.push('The page language must be English.');
  const image = metadata.get('og:image');
  const twitter = metadata.get('twitter:image');
  if (!image?.trim()) errors.push('og:image is required.');
  if (twitter !== image || !twitter?.trim()) errors.push('twitter:image must match og:image.');
  for (const key of ['og:image', 'twitter:image', 'og:image:alt', 'twitter:image:alt']) {
    if (duplicates.has(key)) errors.push(`${key} must occur once.`);
  }
  for (const key of ['og:image:alt', 'twitter:image:alt']) {
    const alt = metadata.get(key)?.trim();
    if (!alt || FRENCH_ALT_COPY.test(alt)) errors.push(`${key} must contain English alternative text.`);
  }
  const reference = imageReference(image);
  if (!reference) {
    errors.push('The image must use a canonical HTTPS URL on l0g.fr, without credentials, query or fragment.');
    return { route, redirect: false, errors };
  }
  if (FRENCH_BRAND_CARDS.has(reference.path)) errors.push('A French generic sharing card is forbidden on an English page.');
  if (route === '/en/asia/' && reference.path !== getEnglishPageSocial(route)?.image) {
    errors.push('The Asia hub must use its dedicated English sharing card.');
  }

  const root = resolve(distDir);
  const asset = resolve(root, `.${reference.path}`);
  if (!within(root, asset)) {
    errors.push('The image path must remain inside the built site.');
    return { route, redirect: false, errors };
  }
  const cacheKey = `${root}\u0000${asset}`;
  if (!metadataCache.has(cacheKey)) {
    metadataCache.set(cacheKey, (async () => {
      try {
        const actualRoot = await realpath(root);
        const actualAsset = await realpath(asset);
        if (!within(actualRoot, actualAsset)) return { error: 'The image path must remain inside the built site.' };
        const dimensions = await sharp(actualAsset).metadata();
        return { width: dimensions.width, height: dimensions.height };
      } catch {
        return { error: 'The sharing image must exist and be a readable local image.' };
      }
    })());
  }
  const dimensions = await metadataCache.get(cacheKey);
  if (dimensions.error) errors.push(dimensions.error);
  else if (dimensions.width !== 1200 || dimensions.height !== 630) errors.push('The sharing image must measure 1200 × 630 pixels.');
  return { route, redirect: false, image: reference.url, imagePath: reference.path, errors };
}

async function htmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(path));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(path);
  }
  return files;
}

export async function auditEnglishSocial(distDir = 'dist') {
  const root = resolve(distDir);
  const metadataCache = new Map();
  const results = [];
  for (const file of await htmlFiles(resolve(root, 'en'))) {
    const route = `/${relative(root, file).split(sep).join('/')}`.replace(/index\.html$/u, '');
    results.push(await validateEnglishSocialHtml(await readFile(file, 'utf8'), route, { distDir: root, metadataCache }));
  }
  return {
    pages: results.filter(result => !result.redirect).length,
    redirects: results.filter(result => result.redirect).length,
    images: new Set(results.map(result => result.image).filter(Boolean)).size,
    failures: results.filter(result => result.errors.length > 0),
  };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const report = await auditEnglishSocial();
  if (report.failures.length) {
    for (const failure of report.failures) console.error(`${failure.route}: ${failure.errors.join(' ')}`);
    console.error(`English social metadata failed on ${report.failures.length} page(s).`);
    process.exitCode = 1;
  } else {
    console.log(`English social metadata OK: ${report.pages} pages, ${report.images} images, ${report.redirects} redirect(s).`);
  }
}
