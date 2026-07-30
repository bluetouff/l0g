#!/usr/bin/env node

import { createReadStream } from 'node:fs';
import { mkdir, readdir, rename, writeFile } from 'node:fs/promises';
import { createGunzip } from 'node:zlib';
import { basename, dirname, resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { fileURLToPath } from 'node:url';
import { isInternalL0gUserAgent } from '../mcp-server/usage-telemetry.mjs';

export const HUMAN_TRAFFIC_SCHEMA_VERSION = '1.0.0';
export const HUMAN_TRAFFIC_RETENTION_DAYS = 91;
export const HUMAN_TRAFFIC_MINIMUM_COHORT = 5;

const APACHE_COMBINED = /^\S+ \S+ \S+ \[([^\]]+)\] "([A-Z]+) ([^"]+?) HTTP\/[^"]+" ([0-9]{3}) \S+ "([^"]*)" "([^"]*)"$/;
const MONTHS = new Map([
  ['Jan', 1], ['Feb', 2], ['Mar', 3], ['Apr', 4], ['May', 5], ['Jun', 6],
  ['Jul', 7], ['Aug', 8], ['Sep', 9], ['Oct', 10], ['Nov', 11], ['Dec', 12],
]);
const CRAWLER_USER_AGENT = new RegExp([
  'bot', 'crawler', 'spider', 'slurp', 'bingpreview', 'facebookexternalhit',
  'facebot', 'google-inspectiontool', 'google-read-aloud', 'mediapartners-google',
  'adsbot', 'yandex', 'baiduspider', 'duckduckbot', 'petalbot', 'semrush',
  'ahrefs', 'mj12bot', 'dotbot', 'bytespider', 'applebot', 'gptbot',
  'chatgpt-user', 'claudebot', 'anthropic-ai', 'perplexitybot', 'ccbot',
  'ia_archiver', 'archive\\.org_bot', 'uptimerobot', 'pingdom', 'statuscake',
  'headlesschrome', 'lighthouse',
].join('|'), 'i');
const EXCLUDED_PREFIXES = [
  '/api',
  '/_astro',
  '/assets',
  '/fonts',
  '/icons',
  '/images',
  '/pagefind',
  '/stats',
  '/.well-known',
];
const EXCLUDED_EXACT = new Set([
  '/agents.json',
  '/server.json',
  '/openapi.json',
  '/robots.txt',
  '/sitemap-index.xml',
  '/sitemap-0.xml',
  '/rss.xml',
  '/atom.xml',
  '/feed',
  '/feeds',
  '/llms.txt',
  '/llms-full.txt',
  '/llms-full-en.txt',
]);

function dayFromApacheDate(value) {
  const match = /^(\d{2})\/([A-Z][a-z]{2})\/(\d{4}):/.exec(value);
  const month = match ? MONTHS.get(match[2]) : null;
  if (!match || !month) return null;
  return `${match[3]}-${String(month).padStart(2, '0')}-${match[1]}`;
}

function normalizeDocumentPath(target) {
  let url;
  try {
    url = new URL(target, 'https://l0g.fr');
  } catch {
    return null;
  }
  if (url.origin !== 'https://l0g.fr') return null;
  let path = url.pathname.replace(/\/{2,}/g, '/');
  if (path.endsWith('/index.html')) path = `${path.slice(0, -'index.html'.length)}`;
  if (EXCLUDED_EXACT.has(path)) return null;
  if (EXCLUDED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`))) return null;
  if (/^\/(?:rss|atom|feed)(?:[./-]|$)/i.test(path)) return null;
  if (/\/(?:feed|rss|atom)\.(?:xml|json)$/i.test(path)) return null;
  if (/\/(?:og|favicon)[^/]*\.(?:png|jpe?g|webp|svg|ico)$/i.test(path)) return null;

  const lastSegment = path.split('/').filter(Boolean).at(-1) ?? '';
  if (lastSegment.includes('.') && !lastSegment.endsWith('.html')) return null;
  if (path.endsWith('.html')) path = path.slice(0, -'.html'.length) || '/';
  if (path !== '/' && !path.endsWith('/')) path = `${path}/`;
  return path;
}

function referrerDomain(value) {
  if (!value || value === '-') return '(direct)';
  try {
    const url = new URL(value);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return '(unknown)';
    return url.hostname.toLowerCase().replace(/^www\./, '') || '(unknown)';
  } catch {
    return '(unknown)';
  }
}

export function parseHumanHtmlRequest(line) {
  const match = APACHE_COMBINED.exec(line);
  if (!match) return null;
  const [, rawDate, method, target, rawStatus, referrer, userAgent] = match;
  if (method !== 'GET' || Number(rawStatus) !== 200) return null;
  if (!userAgent || userAgent === '-' || CRAWLER_USER_AGENT.test(userAgent) || isInternalL0gUserAgent(userAgent)) return null;
  const day = dayFromApacheDate(rawDate);
  const page = normalizeDocumentPath(target);
  if (!day || !page) return null;
  return { day, page, referrer: referrerDomain(referrer) };
}

function increment(map, key) {
  map.set(key, (map.get(key) ?? 0) + 1);
}

function sortedRows(map, key, minimumCohort) {
  return [...map.entries()]
    .filter(([, count]) => count >= minimumCohort)
    .map(([value, count]) => ({ [key]: value, count }))
    .sort((left, right) => right.count - left.count || left[key].localeCompare(right[key]));
}

export function createHumanTrafficAccumulator(
  {
    now = new Date(),
    retentionDays = HUMAN_TRAFFIC_RETENTION_DAYS,
    minimumCohort = HUMAN_TRAFFIC_MINIMUM_COHORT,
  } = {},
) {
  if (!(now instanceof Date) || !Number.isFinite(now.getTime())) throw new Error('human_traffic_now_invalid');
  if (!Number.isSafeInteger(retentionDays) || retentionDays < 1) throw new Error('human_traffic_retention_invalid');
  if (!Number.isSafeInteger(minimumCohort) || minimumCohort < 2) throw new Error('human_traffic_cohort_invalid');
  const cutoff = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  cutoff.setUTCDate(cutoff.getUTCDate() - (retentionDays - 1));
  const cutoffDay = cutoff.toISOString().slice(0, 10);
  const days = new Map();
  return {
    add(line) {
      const request = parseHumanHtmlRequest(line);
      if (!request || request.day < cutoffDay) return;
      let day = days.get(request.day);
      if (!day) {
        day = { count: 0, pages: new Map(), referrers: new Map() };
        days.set(request.day, day);
      }
      day.count += 1;
      increment(day.pages, request.page);
      increment(day.referrers, request.referrer);
    },
    report() {
      const daily = [...days.entries()]
        .filter(([, day]) => day.count >= minimumCohort)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([date, day]) => ({
          date,
          html_gets: day.count,
          pages: sortedRows(day.pages, 'page', minimumCohort),
          referrers: sortedRows(day.referrers, 'domain', minimumCohort),
        }));

      return {
        schema_version: HUMAN_TRAFFIC_SCHEMA_VERSION,
        generated_at: now.toISOString(),
        retention_days: retentionDays,
        minimum_public_cohort: minimumCohort,
        measurement: {
          numerator: 'GET HTTP 200 de documents HTML uniquement.',
          exclusions: 'Crawlers connus, user-agents internes l0g, feeds, assets, API/MCP, statistiques et fichiers machine.',
          dimensions: 'Agrégation par jour, page canonique et domaine référent seulement.',
          privacy: 'Aucune IP, cookie, session, empreinte, chemin de référent ni identifiant persistant n’est conservé.',
        },
        totals: {
          html_gets: daily.reduce((sum, day) => sum + day.html_gets, 0),
          days_published: daily.length,
        },
        daily,
        limitations: [
          'Un GET HTML est une lecture servie, pas une personne unique.',
          'Les navigateurs qui masquent le référent sont classés en accès direct.',
          'Les robots non déclarés ou aux user-agents nouveaux peuvent subsister jusqu’à mise à jour de la liste.',
          'Les jours, pages et domaines sous k=5 ne sont pas publiés.',
        ],
      };
    },
  };
}

export function buildHumanTrafficReport(lines, options = {}) {
  const accumulator = createHumanTrafficAccumulator(options);
  for (const line of lines) accumulator.add(line);
  return accumulator.report();
}

async function* linesFromPath(path) {
  const source = path === '-' ? process.stdin : createReadStream(path);
  const input = path.endsWith?.('.gz') ? source.pipe(createGunzip()) : source;
  const reader = createInterface({ input, crlfDelay: Infinity });
  for await (const line of reader) yield line;
}

async function runCli() {
  const args = process.argv.slice(2);
  const outputIndex = args.indexOf('--output');
  const output = outputIndex >= 0 ? args[outputIndex + 1] : null;
  if (!output) throw new Error('--output est requis');
  args.splice(outputIndex, 2);
  const logDirectoryIndex = args.indexOf('--apache-log-dir');
  let paths;
  if (logDirectoryIndex >= 0) {
    const logDirectory = resolve(args[logDirectoryIndex + 1] ?? '');
    if (!logDirectory) throw new Error('--apache-log-dir requiert un chemin');
    args.splice(logDirectoryIndex, 2);
    const entries = await readdir(logDirectory);
    paths = entries
      .filter((entry) => /^l0g\.fr-access\.log(?:\.\d+)?(?:\.gz)?$/.test(entry))
      .sort()
      .map((entry) => resolve(logDirectory, entry));
    if (!paths.length) throw new Error(`aucun log Apache l0g dans ${logDirectory}`);
  } else {
    paths = args.length ? args : ['-'];
  }
  const accumulator = createHumanTrafficAccumulator();
  for (const path of paths) {
    for await (const line of linesFromPath(path)) accumulator.add(line);
  }
  const report = accumulator.report();
  const destination = resolve(output);
  await mkdir(dirname(destination), { recursive: true, mode: 0o755 });
  const temporary = `${destination}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(report)}\n`, { mode: 0o644 });
  await rename(temporary, destination);
  process.stdout.write(`${JSON.stringify({
    ok: true,
    output: destination,
    files: paths.map((path) => basename(path)),
    htmlGets: report.totals.html_gets,
    days: report.totals.days_published,
  })}\n`);
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  await runCli();
}
