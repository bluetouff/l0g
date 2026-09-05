#!/usr/bin/env node

import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { scanHtmlElements } from '../src/lib/html-utils.ts';
import { glossaryRedirects } from '../src/config/glossary-redirects.mjs';
import { legacySurfaceRedirects } from '../src/config/legacy-surface-redirects.mjs';

const SITE = 'https://l0g.fr';
const GONE_ROUTES = new Set(['/hard-commodities/', '/calendrier-eco/']);
const REDIRECTS = new Map(Object.entries({ ...glossaryRedirects, ...legacySurfaceRedirects })
  .map(([from, to]) => [normalizeRoute(from), to]));
const HUBS = ['/', '/en/', '/guides/', '/en/guides/', '/analyse/', '/en/analysis/', '/sujets/'];
const REQUIRED_COLUMNS = [
  'url',
  'statut_gsc',
  'derniere_exploration',
  'canonical_utilisateur',
  'canonical_google',
  'sitemap',
  'date_publication',
];

function normalizeHeader(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
}

export function parseCsv(input) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  const text = input.replace(/^\uFEFF/, '');
  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    if (quoted) {
      if (char === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') quoted = false;
      else field += char;
    } else if (char === '"') quoted = true;
    else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      if (row.some((value) => value !== '')) rows.push(row);
      row = [];
      field = '';
    } else field += char;
  }
  if (quoted) throw new Error('csv_guillemet_non_ferme');
  if (field || row.length) {
    row.push(field.replace(/\r$/, ''));
    if (row.some((value) => value !== '')) rows.push(row);
  }
  if (!rows.length) throw new Error('csv_vide');
  const headers = rows[0].map(normalizeHeader);
  const duplicates = headers.filter((header, index) => headers.indexOf(header) !== index);
  if (duplicates.length) throw new Error(`csv_colonnes_dupliquees:${[...new Set(duplicates)].join(',')}`);
  return rows.slice(1).map((values) => Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ''])));
}

function csvCell(value) {
  const string = value === null || value === undefined ? '' : String(value);
  return /[",\n\r]/.test(string) ? `"${string.replace(/"/g, '""')}"` : string;
}

export function stringifyCsv(rows, columns) {
  return `${[columns, ...rows.map((row) => columns.map((column) => row[column] ?? ''))]
    .map((values) => values.map(csvCell).join(','))
    .join('\n')}\n`;
}

export function normalizeRoute(value) {
  let url;
  try {
    url = new URL(value, SITE);
  } catch {
    return null;
  }
  if (url.origin !== SITE) return null;
  let path = url.pathname.replace(/\/{2,}/g, '/');
  if (path.endsWith('/index.html')) path = path.slice(0, -'index.html'.length);
  if (path.endsWith('.html')) path = path.slice(0, -'.html'.length) || '/';
  if (path !== '/' && !extname(path) && !path.endsWith('/')) path += '/';
  return path;
}

async function walk(directory, output = []) {
  for (const name of await readdir(directory)) {
    const path = join(directory, name);
    if ((await stat(path)).isDirectory()) await walk(path, output);
    else output.push(path);
  }
  return output;
}

function routeFromHtmlFile(dist, file) {
  const path = `/${relative(dist, file).split('\\').join('/')}`;
  return path.endsWith('/index.html') ? path.slice(0, -'index.html'.length) : path;
}

function routeFromBuiltFile(dist, file) {
  return `/${relative(dist, file).split('\\').join('/')}`;
}

function internalRoute(raw, baseRoute) {
  if (!raw || raw.startsWith('#') || raw.startsWith('//')) return null;
  try {
    const url = new URL(raw, `${SITE}${baseRoute}`);
    if (url.origin !== SITE) return null;
    return normalizeRoute(url.href);
  } catch {
    return null;
  }
}

function pageMetadata(html, route) {
  const elements = scanHtmlElements(html);
  const links = new Set();
  let canonical = null;
  let robots = '';
  let lang = '';
  let publicationDate = '';
  for (const element of elements) {
    if (element.name === 'html') lang = element.attributes.get('lang') ?? '';
    if (element.name === 'a') {
      const target = internalRoute(element.attributes.get('href'), route);
      if (target) links.add(target);
    }
    if (element.name === 'link' && /\bcanonical\b/i.test(element.attributes.get('rel') ?? '')) {
      canonical = normalizeRoute(element.attributes.get('href') ?? '');
    }
    if (element.name === 'meta' && /^(?:robots|googlebot)$/i.test(element.attributes.get('name') ?? '')) {
      robots += ` ${(element.attributes.get('content') ?? '').toLowerCase()}`;
    }
    if (
      element.name === 'meta'
      && /^(?:article:published_time|datepublished)$/i.test(element.attributes.get('property') ?? element.attributes.get('name') ?? '')
    ) publicationDate ||= element.attributes.get('content') ?? '';
  }
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim() ?? '';
  publicationDate ||= html.match(/"datePublished"\s*:\s*"([^"]+)"/i)?.[1] ?? '';
  const text = html
    .replace(/<(?:script|style|svg)\b[\s\S]*?<\/(?:script|style|svg)>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&(?:[a-z]+|#\d+|#x[0-9a-f]+);/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return {
    route,
    canonical,
    lang,
    noindex: /\bnoindex\b/.test(robots),
    redirect: /<meta\s+[^>]*http-equiv=["']?refresh\b/i.test(html),
    title,
    word_count: text ? text.split(' ').length : 0,
    publication_date: publicationDate,
    links: [...links],
  };
}

function parseSitemap(xml) {
  return new Set([...xml.matchAll(/<loc>(https:\/\/l0g\.fr[^<]+)<\/loc>/g)].map((match) => normalizeRoute(match[1])).filter(Boolean));
}

function computeDepth(pages) {
  const depths = new Map();
  const queue = [];
  for (const hub of HUBS) {
    if (!pages.has(hub)) continue;
    depths.set(hub, 0);
    queue.push(hub);
  }
  while (queue.length) {
    const route = queue.shift();
    const nextDepth = depths.get(route) + 1;
    for (const link of pages.get(route)?.links ?? []) {
      if (!pages.has(link) || depths.has(link)) continue;
      depths.set(link, nextDepth);
      queue.push(link);
    }
  }
  return depths;
}

export async function auditBuiltSite(distPath) {
  const dist = resolve(distPath);
  const files = await walk(dist);
  const pages = new Map();
  const assets = new Set(files.map((file) => routeFromBuiltFile(dist, file)));
  for (const file of files.filter((path) => path.endsWith('.html'))) {
    const route = routeFromHtmlFile(dist, file);
    pages.set(route, pageMetadata(await readFile(file, 'utf8'), route));
  }
  const sitemap = new Set();
  for (const file of files.filter((path) => /sitemap-\d+\.xml$/.test(path))) {
    for (const route of parseSitemap(await readFile(file, 'utf8'))) sitemap.add(route);
  }
  const inlinks = new Map([...pages.keys()].map((route) => [route, new Set()]));
  for (const [from, page] of pages) {
    for (const to of page.links) if (pages.has(to)) inlinks.get(to).add(from);
  }
  const depths = computeDepth(pages);
  const titles = new Map();
  for (const page of pages.values()) {
    const key = page.title.toLowerCase();
    if (!key) continue;
    if (!titles.has(key)) titles.set(key, []);
    titles.get(key).push(page.route);
  }
  const sitemapUndesirable = [];
  for (const route of sitemap) {
    const page = pages.get(route);
    const reasons = [];
    if (!page) reasons.push('absent_du_build');
    else {
      if (page.noindex) reasons.push('noindex');
      if (page.redirect || REDIRECTS.has(route)) reasons.push('redirection');
      if (page.canonical && page.canonical !== route) reasons.push(`canonical:${page.canonical}`);
    }
    if (reasons.length) sitemapUndesirable.push({ route, reasons });
  }
  const undesirableInternalDestinations = [];
  for (const [from, page] of pages) {
    for (const to of page.links) {
      const target = pages.get(to);
      const reasons = [];
      if (REDIRECTS.has(to) || target?.redirect) reasons.push('redirection');
      if (target?.canonical && target.canonical !== to) reasons.push(`canonical:${target.canonical}`);
      if (reasons.length) undesirableInternalDestinations.push({ from, to, reasons });
    }
  }
  return { pages, assets, sitemap, inlinks, depths, titles, sitemapUndesirable, undesirableInternalDestinations };
}

function intendedNoindex(route, page, site) {
  if (!page?.noindex) return false;
  if (route === '/recherche/' || route === '/404.html') return true;
  return route.startsWith('/glossaire/') && !site.sitemap.has(route);
}

function cohortLocation(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return null;
  }
  if (!['http:', 'https:'].includes(url.protocol) || !/(?:^|\.)l0g\.fr$/i.test(url.hostname)) return null;
  const canonicalOrigin = url.protocol === 'https:' && url.hostname.toLowerCase() === 'l0g.fr';
  const route = canonicalOrigin ? normalizeRoute(url.href) : normalizeRoute(`${SITE}${url.pathname}`);
  const canonicalPath = url.pathname === route;
  return { url, route, canonicalOrigin, canonicalPath };
}

function intendedMachineSurface(route, site) {
  if (!route) return false;
  if (/^\/api(?:\/|$)/.test(route) || /^\/\.well-known(?:\/|$)/.test(route)) return true;
  if (/^\/(?:llms(?:-full(?:-en)?)?|agents|server|openapi)\.(?:txt|json)$/.test(route)) return true;
  return site.assets.has(route) && !site.pages.has(route);
}

function unwantedProbeRoute(route) {
  return /\*/.test(route) || /^\/wp-(?:admin|content|includes|[^/]*\.php)(?:\/|$)/i.test(route);
}

export function classifyCohortRow(row, site) {
  const location = cohortLocation(row.url);
  if (!location) throw new Error(`url_hors_site_ou_invalide:${row.url}`);
  const { url, route, canonicalOrigin, canonicalPath } = location;
  const primaryHost = ['l0g.fr', 'www.l0g.fr'].includes(url.hostname.toLowerCase());
  const page = primaryHost ? site.pages.get(route) : null;
  let decision;
  let reason;
  if (!canonicalOrigin) {
    if (url.hostname.toLowerCase() === 'l0g.fr' || url.hostname.toLowerCase() === 'www.l0g.fr') {
      decision = 'redirection';
      reason = `consolider l’origine vers ${SITE}${route}`;
    } else {
      decision = 'inconnue';
      reason = `sous-domaine hors build statique: ${url.origin}`;
    }
  } else if (REDIRECTS.has(route) || page?.redirect) {
    decision = 'redirection';
    reason = REDIRECTS.get(route) ?? page?.canonical ?? 'redirection du build';
  } else if (GONE_ROUTES.has(route)) {
    decision = 'supprimee_410';
    reason = 'retrait volontaire sans équivalent sémantique';
  } else if (intendedNoindex(route, page, site)) {
    decision = 'noindex_voulu';
    reason = 'politique noindex explicite';
  } else if (intendedMachineSurface(route, site)) {
    decision = 'noindex_voulu';
    reason = 'surface machine ou format non HTML, hors pages de recherche';
  } else if (unwantedProbeRoute(route)) {
    decision = 'noindex_voulu';
    reason = 'motif de sonde WordPress sans ressource éditoriale, 404 attendu';
  } else if (!canonicalPath) {
    decision = 'redirection';
    reason = `normaliser le chemin vers ${route}`;
  } else if (!page) {
    decision = /detect|détect|crawl|explor/i.test(row.statut_gsc) ? 'erreur_reelle' : 'inconnue';
    reason = 'URL absente du build; équivalent ou retrait à décider';
  } else if (page.noindex) {
    decision = 'inconnue';
    reason = 'noindex hors politique documentée';
  } else if (page.canonical && page.canonical !== route) {
    decision = 'redirection';
    reason = `consolider vers ${page.canonical}`;
  } else {
    decision = 'a_indexer';
    reason = 'page 200 indexable avec canonical propre dans le build';
  }
  const duplicateTitle = page?.title ? (site.titles.get(page.title.toLowerCase()) ?? []).filter((candidate) => candidate !== route) : [];
  return {
    ...row,
    route,
    canonical_utilisateur: row.canonical_utilisateur || (page?.canonical ? `${SITE}${page.canonical}` : ''),
    sitemap: row.sitemap || (primaryHost && site.sitemap.has(route) ? 'oui' : 'non'),
    date_publication: row.date_publication || page?.publication_date || '',
    decision,
    raison_decision: reason,
    present_build: page ? 'oui' : 'non',
    present_sitemap_build: primaryHost && site.sitemap.has(route) ? 'oui' : 'non',
    canonical_build: page?.canonical ? `${SITE}${page.canonical}` : '',
    robots_build: page?.noindex ? 'noindex' : page ? 'index' : '',
    langue_build: page?.lang ?? '',
    mots_build: page?.word_count ?? '',
    inlinks_build: primaryHost ? site.inlinks.get(route)?.size ?? 0 : 0,
    profondeur_hub: primaryHost ? site.depths.get(route) ?? '' : '',
    titles_dupliques: duplicateTitle.join('|'),
  };
}

export function buildCohort(rows, site) {
  const urls = new Set();
  return rows.map((row) => {
    for (const column of REQUIRED_COLUMNS) {
      if (!(column in row)) throw new Error(`csv_colonne_absente:${column}`);
    }
    let uniqueUrl;
    try {
      uniqueUrl = new URL(row.url).href;
    } catch {
      throw new Error(`url_hors_site_ou_invalide:${row.url}`);
    }
    if (urls.has(uniqueUrl)) throw new Error(`csv_url_dupliquee:${row.url}`);
    urls.add(uniqueUrl);
    return classifyCohortRow(row, site);
  });
}

export function siteSummary(site) {
  const strategic = [
    '/en/guides/read-h41-fed-balance-sheet/',
    '/en/analysis/nvidia-the-500-billion-that-does-not-exist-yet/',
    '/en/analysis/realt-liquidation-token-without-the-deed/',
    '/en/analysis/kospi-concentrated-liquidation-samsung-sk-hynix/',
  ].map((route) => ({ route, inlinks: site.inlinks.get(route)?.size ?? 0, depth: site.depths.get(route) ?? null }));
  return {
    pages: site.pages.size,
    sitemap_urls: site.sitemap.size,
    sitemap_undesirable: site.sitemapUndesirable,
    undesirable_internal_destinations: site.undesirableInternalDestinations,
    strategic_inlinks: strategic,
  };
}

async function runCli() {
  const args = process.argv.slice(2);
  const get = (name) => {
    const prefix = `${name}=`;
    const inline = args.find((arg) => arg.startsWith(prefix));
    if (inline) return inline.slice(prefix.length);
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : null;
  };
  const dist = get('--dist') ?? 'dist';
  const site = await auditBuiltSite(dist);
  const summary = siteSummary(site);
  const input = get('--input');
  if (input) {
    const rows = parseCsv(await readFile(resolve(input), 'utf8'));
    const expected = Number(get('--expected') ?? rows.length);
    if (rows.length !== expected) throw new Error(`cohort_taille:${rows.length}!=${expected}`);
    const cohort = buildCohort(rows, site);
    const output = get('--output');
    if (!output) throw new Error('--output est requis avec --input');
    const columns = [...REQUIRED_COLUMNS, 'route', 'decision', 'raison_decision', 'present_build', 'present_sitemap_build', 'canonical_build', 'robots_build', 'langue_build', 'mots_build', 'inlinks_build', 'profondeur_hub', 'titles_dupliques'];
    await writeFile(resolve(output), stringifyCsv(cohort, columns));
    const statuses = [...new Set(cohort.map(({ statut_gsc }) => statut_gsc))].sort();
    summary.cohort = {
      rows: cohort.length,
      decisions: Object.fromEntries([...new Set(cohort.map(({ decision }) => decision))].sort().map((decision) => [decision, cohort.filter((row) => row.decision === decision).length])),
      gsc_statuses: Object.fromEntries(statuses.map((status) => [status, cohort.filter((row) => row.statut_gsc === status).length])),
      by_status: Object.fromEntries(statuses.map((status) => {
        const rowsForStatus = cohort.filter((row) => row.statut_gsc === status);
        const decisions = [...new Set(rowsForStatus.map(({ decision }) => decision))].sort();
        return [status, {
          rows: rowsForStatus.length,
          decisions: Object.fromEntries(decisions.map((decision) => [decision, rowsForStatus.filter((row) => row.decision === decision).length])),
        }];
      })),
      indexable_quality: {
        zero_inlinks: cohort.filter((row) => row.decision === 'a_indexer' && Number(row.inlinks_build) === 0).map(({ url }) => url),
        deeper_than_three_or_unreachable: cohort
          .filter((row) => row.decision === 'a_indexer' && (row.profondeur_hub === '' || Number(row.profondeur_hub) > 3))
          .map(({ url }) => url),
      },
    };
  }
  const summaryBody = `${JSON.stringify(summary, null, 2)}\n`;
  const summaryOutput = get('--summary');
  if (summaryOutput) await writeFile(resolve(summaryOutput), summaryBody);
  process.stdout.write(summaryBody);
  if (summary.sitemap_undesirable.length || summary.undesirable_internal_destinations.length) process.exitCode = 1;
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  await runCli();
}
