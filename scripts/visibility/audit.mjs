import { readFile, readdir } from 'node:fs/promises';
import { join, relative, resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import * as yaml from 'js-yaml';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import { auditBuiltSite } from '../audit-indexation-cohort.mjs';
import { scanHtmlElements } from '../../src/lib/html-utils.ts';
import { ROOT, VERSION, digest } from './storage.mjs';

export const SITE = 'https://l0g.fr';
export function revision() { return execFileSync('git', ['rev-parse', 'HEAD'], { cwd: ROOT, encoding: 'utf8' }).trim(); }

export function inspectHtml(html, url) {
  const elements = scanHtmlElements(html);
  const head = html.slice(0, html.indexOf('</head>') + 7);
  const headElements = scanHtmlElements(head);
  const meta = name => headElements.filter(e => e.name === 'meta' && e.attributes.get('name')?.toLowerCase() === name).map(e => e.attributes.get('content') ?? '');
  const canonicals = headElements.filter(e => e.name === 'link' && /\bcanonical\b/.test(e.attributes.get('rel') ?? '')).map(e => e.attributes.get('href'));
  const alternates = headElements.filter(e => e.name === 'link' && e.attributes.has('hreflang')).map(e => ({ language: e.attributes.get('hreflang'), url: e.attributes.get('href') }));
  const h1 = elements.filter(e => e.name === 'h1').length;
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  const mainText = mainMatch ? toText(fromHtml(mainMatch[1], { fragment: true })).trim() : '';
  const jsonLd = [];
  let invalidJsonLd = false;
  for (const e of elements.filter(e => e.name === 'script' && e.attributes.get('type') === 'application/ld+json')) {
    try { const data = JSON.parse(e.body); jsonLd.push(...(data['@graph'] ?? [data])); } catch { invalidJsonLd = true; }
  }
  return {
    url, canonicals, alternates, h1, main_text_characters: mainText.length,
    description: meta('description'), robots: meta('robots').join(','),
    title: head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '',
    language: elements.find(e => e.name === 'html')?.attributes.get('lang') ?? '',
    redirect: headElements.some(e => e.name === 'meta' && e.attributes.get('http-equiv')?.toLowerCase() === 'refresh'),
    ids: elements.flatMap(e => e.attributes.has('id') ? [e.attributes.get('id')] : []),
    section_ids: elements.filter(e => /^h[2-6]$/.test(e.name)).map(e => e.attributes.get('id') ?? null),
    json_ld: jsonLd.flatMap(e => [e, ...(Array.isArray(e.mainEntity) ? e.mainEntity.filter(child => child['@type'] === 'Dataset') : [])]).map(e => ({ type: e['@type'], id: e['@id'], name: e.name, publisher_id: e.publisher?.['@id'], author_id: e.author?.['@id'], datePublished: e.datePublished, dateModified: e.dateModified })), invalid_json_ld: invalidJsonLd,
  };
}

export function metadataFindings(page, indexed = true) {
  const issues = [];
  const add = (id, severity, evidence, test) => issues.push({ id, severity, url: page.url, evidence, test, proposal: 'Corriger le générateur responsable après vérification du périmètre.' });
  if (page.redirect) return issues;
  if (indexed && (page.canonicals.length !== 1 || page.canonicals[0] !== page.url)) add('canonical', 'error', page.canonicals, 'Une canonique absolue propre à cette page.');
  if (indexed && /noindex/i.test(page.robots)) add('sitemap-noindex', 'error', page.robots, 'Exclusion du sitemap ou correction justifiée de la politique.');
  if (indexed && !page.title.trim()) add('title', 'error', 'absent', 'Title présent dans le HTML initial.');
  if (indexed && (page.description.length !== 1 || !page.description[0])) add('description', 'error', page.description, 'Une description existante rendue dans le head.');
  if (indexed && page.h1 !== 1) add('h1', 'warning', page.h1, 'Un H1 principal.');
  if (indexed && !page.main_text_characters) add('main-text', 'error', 0, 'Texte principal disponible sans JavaScript.');
  if (page.invalid_json_ld) add('json-ld', 'error', 'invalid', 'JSON-LD parsable.');
  for (const node of page.json_ld ?? []) {
    const path = new URL(page.url).pathname;
    const dynamicPage = (path === '/status/' && node.id?.endsWith('/status/#integrity')) || (path === '/maintenant/' && node.id?.endsWith('/maintenant/#page'));
    const assembledDataset = path === '/donnees/' && node.type === 'Dataset' && !['risk.json', 'debt-risk.json', 'confluence.json', 'risk-events.json'].includes(node.name);
    if ((dynamicPage || assembledDataset) && node.dateModified !== undefined) add('assembly-date-as-revision', 'error', node.id ?? node.name, 'Garder la date d’assemblage visible sans la présenter comme une révision documentée.');
    if (path === '/preuves/' && node.id?.endsWith('/preuves/#changelog') && node.dateModified !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(node.dateModified)) add('changelog-revision-date', 'error', node.dateModified, 'Utiliser le jour du dernier commit du journal, ou omettre si indisponible.');
  }
  if (page.url.endsWith('/404.html') && !/noindex/.test(page.robots)) add('error-indexed', 'error', page.robots, 'Page erreur noindex.');
  return issues;
}

export function translationFindings(pages) {
  const byUrl = new Map(pages.map(page => [page.url, page]));
  const findings = [];
  for (const page of pages) {
    for (const alternate of page.alternates.filter(a => a.language !== 'x-default')) {
      const other = byUrl.get(alternate.url);
      if (!other || !other.alternates.some(a => a.url === page.url && a.language === page.language)) findings.push({ id: 'alternate-reciprocity', severity: 'error', url: page.url, evidence: alternate });
    }
    if (page.translation && !page.alternates.some(a => a.url === page.translation)) findings.push({ id: 'alternate-missing', severity: 'error', url: page.url, evidence: page.translation });
  }
  return findings;
}

async function contentEntries() {
  const results = [];
  for (const [folder, prefix, language, type] of [['posts', '/posts/', 'fr', 'article'], ['posts-en', '/en/analysis/', 'en', 'article'], ['guides', '/guides/', 'fr', 'guide'], ['guides-en', '/en/guides/', 'en', 'guide']]) {
    for (const file of await readdir(join(ROOT, 'src/content', folder))) {
      if (!/\.mdx?$/.test(file)) continue;
      const source = join('src/content', folder, file);
      const body = await readFile(join(ROOT, source), 'utf8');
      const data = yaml.load(body.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '', { schema: yaml.JSON_SCHEMA }) ?? {};
      const slug = file.replace(/\.mdx?$/, '');
      results.push({ id: `${folder}/${slug}`, canonical_id: `${type}:${data.sourceArticle ?? data.sourceGuide ?? slug}`, source, url: `${SITE}${prefix}${slug}/`, language, type, draft: data.draft === true, title: data.title, date: data.pubDate, modified: data.updatedDate ?? data.pubDate, translation_source: data.sourceArticle ?? data.sourceGuide ?? null });
    }
  }
  return results;
}

export async function audit(distPath = 'dist') {
  const dist = resolve(distPath);
  const started = performance.now();
  const existing = await auditBuiltSite(dist);
  const content = await contentEntries();
  const byUrl = new Map(content.map(e => [e.url, e]));
  const catalog = JSON.parse(await readFile(join(dist, 'api/v1/catalog.json'), 'utf8'));
  const publicEntries = [...catalog.articles, ...catalog.guides];
  const catalogByUrl = new Map(publicEntries.map(e => [e.url, e]));
  const pages = [], findings = [];
  for (const [route, old] of existing.pages) {
    const file = join(dist, route.endsWith('/') ? `${route}index.html` : route);
    const html = await readFile(file, 'utf8');
    const url = `${SITE}${route}`;
    const inspected = inspectHtml(html, url);
    delete inspected.ids; // Full DOM IDs remain inspectable on demand; avoid duplicating navigation IDs in every receipt.
    const entry = byUrl.get(url);
    const indexed = existing.sitemap.has(route);
    findings.push(...metadataFindings(inspected, indexed));
    pages.push({ ...inspected, source: entry?.source ?? `src/pages (route ${route})`, id: entry?.id ?? route, canonical_id: entry?.canonical_id ?? null, type: entry?.type ?? 'page', publication: entry?.draft ? 'draft' : 'public', expected_indexation: old.noindex ? 'noindex_declared' : old.redirect ? 'redirect' : indexed ? 'indexed' : 'excluded_from_sitemap', sitemap: indexed, translation: catalogByUrl.get(url)?.alternateUrl ?? null, inlinks: existing.inlinks.get(route)?.size ?? 0, depth: existing.depths.get(route) ?? null, html_sha256: digest(html), build_file: relative(ROOT, file) });
    if (entry && !entry.draft && !catalogByUrl.has(url)) findings.push({ id: 'agent-missing', severity: 'error', url, evidence: entry.id });
    if (entry) {
      const exported = catalogByUrl.get(url);
      if (exported && (exported.canonicalId !== entry.canonical_id || exported.language !== entry.language || exported.title !== entry.title)) findings.push({ id: 'agent-identity', severity: 'error', url, evidence: entry.id });
    }
  }
  const byPageUrl = new Map(pages.map(p => [p.url, p]));
  for (const entry of content.filter(e => !e.draft)) {
    if (!byPageUrl.has(entry.url)) findings.push({ id: 'source-build-missing', severity: 'error', url: entry.url, evidence: entry.source, proposal: 'Reconstruire le site depuis les sources courantes.', test: 'HTML et export agents présents après build.' });
  }
  findings.push(...translationFindings(pages));
  for (const page of pages) {
    if (page.type === 'article' && page.sitemap && page.depth === null) findings.push({ id: 'orphan', severity: 'warning', url: page.url, evidence: 'Non atteignable depuis les hubs existants.' });
  }
  for (const entry of content.filter(e => e.draft)) {
    if (byPageUrl.has(entry.url) || catalogByUrl.has(entry.url) || existing.sitemap.has(new URL(entry.url).pathname)) findings.push({ id: 'draft-public', severity: 'error', url: entry.url, evidence: entry.source });
  }
  for (const problem of existing.sitemapUndesirable) findings.push({ id: 'sitemap', severity: 'error', url: `${SITE}${problem.route}`, evidence: problem.reasons });
  for (const problem of existing.undesirableInternalDestinations) findings.push({ id: 'internal-redirect', severity: 'warning', url: `${SITE}${problem.from}`, evidence: problem.to });
  const sourceRobots = await readFile(join(ROOT, 'public/robots.txt'), 'utf8');
  const buildRobots = await readFile(join(dist, 'robots.txt'), 'utf8');
  if (sourceRobots !== buildRobots) findings.push({ id: 'robots-build', severity: 'error', evidence: 'source != build' });
  return { schema_version: VERSION, checked_at: new Date().toISOString(), source_sha: revision(), scope: 'local_build', build_freshness: 'Compare source SHA and build receipts before inferring deployment.', duration_ms: Math.round(performance.now() - started), robots_sha256: digest(buildRobots), routes: pages, unpublished: content.filter(e => e.draft), findings, agents: { preserved: true, catalog_entries: publicEntries.length }, summary: { pages: pages.length, errors: findings.filter(f => f.severity === 'error').length, warnings: findings.filter(f => f.severity === 'warning').length } };
}
