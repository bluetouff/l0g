/**
 * Serveur MCP de l0g.fr — lecture seule, transport Streamable HTTP (stateless, JSON).
 *
 * Spec : Model Context Protocol 2025-11-25, transport Streamable HTTP (remplace SSE).
 * SDK  : @modelcontextprotocol/sdk (McpServer + StreamableHTTPServerTransport).
 *
 * Sécurité :
 *   - écoute en 127.0.0.1 uniquement, exposé par Apache en HTTPS.
 *   - valide l'en-tête Host et l'Origin (anti DNS rebinding, exigé par la spec).
 *   - corpus en lecture seule : slugs en allowlist, taille de corps bornée.
 *   - télémétrie optionnelle limitée à des compteurs agrégés sans IP ni identifiant.
 *   - un serveur + un transport neufs par requête (mode stateless, isolation).
 *
 * Données : lues sur le disque, dans le site déjà déployé (Agent Surface, risk.json
 * et debt-risk.json générés au build), avec un cache lié au répertoire réel de la release. Le texte complet d'un article est
 * extrait à la demande depuis le HTML construit.
 */
import http from 'node:http';
import { execFileSync } from 'node:child_process';
import { readFile, realpath } from 'node:fs/promises';
import { join } from 'node:path';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { parse as parseHtml } from 'node-html-parser';
import { agentPrompts, renderAgentPrompt } from '../src/lib/agent-prompts.mjs';
import { createMcpUsageStore } from './usage-telemetry.mjs';

// --- configuration (variables d'environnement, valeurs par défaut sûres) ---
const HOST = process.env.MCP_HOST || '127.0.0.1';
const PORT = parsePositiveInteger(process.env.MCP_PORT, 8848, { min: 1, max: 65535 });
const MCP_PATH = process.env.MCP_PATH || '/mcp';
const MCP_USAGE_PATH = process.env.MCP_USAGE_PATH || '';
const DATA_DIR = process.env.L0G_DATA_DIR || '/var/www/html/l0g/current';
const SITE = (process.env.L0G_SITE || 'https://l0g.fr').replace(/\/$/, '');
const ALLOWED_HOSTS = new Set(
  (process.env.MCP_ALLOWED_HOSTS || 'l0g.fr,127.0.0.1,localhost')
    .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean)
);
const ALLOWED_ORIGINS = new Set(
  (process.env.MCP_ALLOWED_ORIGINS || 'https://l0g.fr')
    .split(',').map((s) => {
      const value = s.trim().toLowerCase();
      if (!value) return '';
      try {
        return new URL(value).origin;
      } catch {
        return value;
      }
    }).filter(Boolean)
);
const MAX_BODY = parsePositiveInteger(process.env.MCP_MAX_BODY_BYTES, 1024 * 1024, { min: 16_384, max: 25_000_000 });
const RATE_MAX = parsePositiveInteger(process.env.MCP_RATE_MAX, 120); // requêtes / minute / IP
const RATE_WIN = 60_000;
const MCP_VERSION = '1.20.4';
const MCP_HEADER_TIMEOUT = parsePositiveInteger(process.env.MCP_HEADER_TIMEOUT, 10_000); // ms
const MCP_REQUEST_TIMEOUT = parsePositiveInteger(process.env.MCP_REQUEST_TIMEOUT, 15_000); // ms
const MCP_KEEP_ALIVE_TIMEOUT = parsePositiveInteger(process.env.MCP_KEEP_ALIVE_TIMEOUT, 5_000); // ms
const MCP_MAX_HEADERS_COUNT = parsePositiveInteger(process.env.MCP_MAX_HEADERS_COUNT, 64); // sécurité parser headers
const MCP_RATE_WINDOW_SECONDS = Math.max(1, Math.round(RATE_WIN / 1000));
const SECURE_HEADERS = {
  'Cache-Control': 'no-store',
  'Pragma': 'no-cache',
  'Referrer-Policy': 'same-origin',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'Cross-Origin-Opener-Policy': 'same-origin',
};
function activeGitSha() {
  if (process.env.MCP_GIT_SHA) return process.env.MCP_GIT_SHA;
  if (process.env.GITHUB_SHA) return process.env.GITHUB_SHA;
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      cwd: process.cwd(),
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return 'unknown';
  }
}

function parsePositiveInteger(value, fallback, options = {}) {
  const parsed = Number.parseInt(value ?? '', 10);
  const min = Number(options.min ?? 1);
  const max = Number(options.max ?? Number.MAX_SAFE_INTEGER);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return fallback;
  return parsed;
}
const CURRENT_SHA = activeGitSha();
const SHA_STATUS = /^[0-9a-f]{40}$/i.test(CURRENT_SHA) ? 'verified-hex' : 'unknown';
const RELEASE_ATTESTED = process.env.MCP_RELEASE_ATTESTED === '1';
const MCP_SERVER_INFO = {
  name: 'l0g.fr',
  version: MCP_VERSION,
  sha: CURRENT_SHA,
  shaStatus: SHA_STATUS,
  releaseAttested: RELEASE_ATTESTED,
  transport: 'streamable-http',
  path: MCP_PATH,
};
const usageStore = createMcpUsageStore({
  path: MCP_USAGE_PATH,
  onError: (error) => console.error('[l0g-mcp] usage telemetry failed', error?.message || error),
});
const NDJSON_FEEDS = {
  catalog: { path: 'api/v1/catalog.ndjson', role: 'catalogue complet pour ingestion RAG' },
  claims: { path: 'api/v1/claims.ndjson', role: 'claims typées avec références embarquées' },
  evidenceGraph: { path: 'api/v1/evidence-graph.ndjson', role: 'evidence graph en nœuds et arêtes ligne à ligne' },
  changes: { path: 'api/v1/changes.ndjson', role: 'changefeed machine incrémental' },
  signalHistory: { path: 'api/v1/signals/history.ndjson', role: 'historique point-in-time des signaux pour backtests' },
};

// --- limiteur de débit par IP (fenêtre glissante simple, en mémoire) ---
const buckets = new Map();
function rateLimited(ip) {
  const now = Date.now();
  let b = buckets.get(ip);
  if (!b || now - b.start >= RATE_WIN) { b = { start: now, n: 0 }; buckets.set(ip, b); }
  b.n++;
  return b.n > RATE_MAX;
}
function clientIp(req) {
  const socketIp = req.socket?.remoteAddress || 'unknown';
  const xff = req.headers['x-forwarded-for'];
  if ((socketIp === '127.0.0.1' || socketIp === '::1') && xff) {
    const forwarded = String(xff).split(',').map((s) => s.trim()).filter(Boolean);
    if (forwarded.length === 1) return forwarded[0];
  }
  return socketIp;
}
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of buckets) if (now - v.start >= RATE_WIN) buckets.delete(k);
}, 5 * RATE_WIN).unref();

// --- cache des données du site ---
let cache = {
  dataDir: null,
  agent: null,
  openapi: null,
  catalog: null,
  searchIndex: null,
  claims: null,
  sources: null,
  freshness: null,
  integrity: null,
  changes: null,
  riskDiff: null,
  blackBox: null,
  evidenceGraph: null,
  risk: null,
  debtRisk: null,
  signalHistory: null,
  riskEvents: null,
  confluence: null,
};
let searchIndexCache = {
  dataDir: null,
  index: null,
};
async function resolveDataDir() {
  try {
    return await realpath(DATA_DIR);
  } catch {
    return DATA_DIR;
  }
}
async function readJson(baseDir, rel) {
  return JSON.parse(await readFile(join(baseDir, rel), 'utf-8'));
}
async function readText(baseDir, rel) {
  return readFile(join(baseDir, rel), 'utf-8');
}
async function loadData() {
  const dataDir = await resolveDataDir();
  // Les releases sont immuables et `current` bascule atomiquement vers un nouveau
  // répertoire réel. Tant que realpath(DATA_DIR) ne change pas, relire et parser
  // plusieurs mégaoctets toutes les 60 s ne peut produire aucune donnée plus fraîche.
  if (cache.catalog && cache.dataDir === dataDir) return cache;
  const agent = await readJson(dataDir, 'agents.json');
  const openapi = await readJson(dataDir, 'openapi.json');
  const catalog = await readJson(dataDir, 'api/v1/catalog.json');
  const searchIndex = await readJson(dataDir, 'api/v1/search-index.json');
  const claims = await readJson(dataDir, 'api/v1/claims.json');
  const sources = await readJson(dataDir, 'api/v1/sources.json');
  const freshness = await readJson(dataDir, 'api/v1/freshness.json');
  const integrity = await readJson(dataDir, 'api/v1/integrity.json');
  const changes = await readJson(dataDir, 'api/v1/changes.json');
  let riskDiff = null;
  try {
    riskDiff = await readJson(dataDir, 'api/v1/risk-diff.json');
  } catch { /* risk diff optionnel */ }
  let blackBox = null;
  try {
    blackBox = await readJson(dataDir, 'api/v1/black-box.json');
  } catch { /* black box optionnelle */ }
  const evidenceGraph = await readJson(dataDir, 'api/v1/evidence-graph.json');
  let risk = null;
  try {
    risk = await readJson(dataDir, 'api/v1/risk.json');
  } catch { /* risk optionnel */ }
  let debtRisk = null;
  try {
    debtRisk = await readJson(dataDir, 'api/v1/debt-risk.json');
  } catch { /* dette US optionnelle */ }
  let signalHistory = null;
  try {
    signalHistory = await readJson(dataDir, 'api/v1/signals/history.json');
  } catch { /* historique signaux optionnel */ }
  let riskEvents = null;
  try {
    riskEvents = await readJson(dataDir, 'risk-events.json');
  } catch { /* historique optionnel */ }
  let confluence = null;
  try {
    confluence = await readJson(dataDir, 'confluence.json');
  } catch { /* confluence optionnelle */ }
  cache = { dataDir, agent, openapi, catalog, searchIndex, claims, sources, freshness, integrity, changes, riskDiff, blackBox, evidenceGraph, risk, debtRisk, signalHistory, riskEvents, confluence };
  return cache;
}

// --- helpers ---
const norm = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
function score(item, tokens) {
  const t = norm(item.title), d = norm(item.description), g = norm((item.tags || []).join(' ') + ' ' + (item.topics || []).join(' '));
  let s = 0;
  for (const tok of tokens) {
    if (t.includes(tok)) s += 3;
    if (g.includes(tok)) s += 2;
    if (d.includes(tok)) s += 1;
  }
  return s;
}
function tokensOf(query) {
  return norm(query).split(/[^\p{L}\p{N}]+/u).filter((token) => token.length > 1).slice(0, 12);
}
function countToken(haystack, token) {
  let count = 0;
  let index = haystack.indexOf(token);
  while (index !== -1 && count < 20) {
    count++;
    index = haystack.indexOf(token, index + token.length);
  }
  return count;
}
function textOf(node) {
  return (node ? node.text : '').replace(/\s+/g, ' ').trim();
}
function excerptFor(text, tokens, fallback) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (!clean) return fallback || '';
  const normalized = norm(clean);
  const positions = tokens.map((token) => normalized.indexOf(token)).filter((index) => index >= 0);
  const first = positions.length ? Math.min(...positions) : 0;
  const start = Math.max(0, first - 160);
  const end = Math.min(clean.length, first + 360);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < clean.length ? '...' : '';
  return `${prefix}${clean.slice(start, end).trim()}${suffix}`;
}
function encodeCursor(cursor) {
  return Buffer.from(JSON.stringify(cursor), 'utf8').toString('base64url');
}
function decodeCursor(cursor) {
  if (!cursor) return null;
  try {
    const parsed = JSON.parse(Buffer.from(String(cursor), 'base64url').toString('utf8'));
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}
function articleChunk(text, options = {}) {
  const full = String(text || '');
  const totalChars = full.length;
  const totalWords = full ? full.split(/\s+/).filter(Boolean).length : 0;
  const cursor = decodeCursor(options.cursor);
  const section = cursor?.section || options.section || 'body';
  const requestedLength = Number.isFinite(cursor?.limit)
    ? cursor.limit
    : Number.isFinite(options.limit)
      ? options.limit
      : Number.isFinite(options.length)
        ? options.length
        : 16000;
  const length = Math.max(1000, Math.min(50000, requestedLength));
  let offset = Math.max(0, Math.min(Number.isFinite(cursor?.offset) ? cursor.offset : Number.isFinite(options.offset) ? options.offset : 0, totalChars));
  let sectionFound = true;

  if (section === 'head') {
    offset = 0;
  } else if (section === 'tail') {
    offset = Math.max(0, totalChars - length);
  } else if (section === 'sources') {
    const normalized = norm(full);
    const markers = ['sources principales', 'sources', 'references', 'références'];
    const positions = markers.map((marker) => normalized.lastIndexOf(norm(marker))).filter((index) => index >= 0);
    if (positions.length) {
      offset = Math.min(...positions);
    } else {
      sectionFound = false;
      offset = Math.max(0, totalChars - length);
    }
  }

  const end = Math.min(totalChars, offset + length);
  const chunk = full.slice(offset, end);
  const nextOffset = end < totalChars ? end : null;
  const nextCursor = nextOffset === null ? null : encodeCursor({ section, offset: nextOffset, limit: length });
  return {
    text: chunk,
    section,
    sectionFound,
    totalChars,
    totalWords,
    textChars: chunk.length,
    words: chunk ? chunk.split(/\s+/).filter(Boolean).length : 0,
    offset,
    limit: length,
    length,
    nextOffset,
    nextCursor,
    hasMore: nextOffset !== null,
    truncated: nextOffset !== null,
  };
}
async function readSearchDocument(dataDir, candidate) {
  let bodyText = '';
  let pageTitle = candidate.title;
  try {
    const html = await readText(dataDir, candidate.rel);
    const root = parseHtml(html);
    const titleEl = root.querySelector('article h1') || root.querySelector('h1') || root.querySelector('title');
    const body = root.querySelector('[data-pagefind-body]') || root.querySelector('.prose') || root.querySelector('article') || root.querySelector('main');
    pageTitle = textOf(titleEl) || candidate.title;
    bodyText = textOf(body);
  } catch {
    bodyText = '';
  }
  const description = candidate.description || '';
  const tags = candidate.tags || [];
  const topics = candidate.topics || [];
  const text = [description, bodyText].filter(Boolean).join(' ');
  return {
    ...candidate,
    title: pageTitle,
    description,
    tags,
    topics,
    text,
    normTitle: norm(pageTitle),
    normDescription: norm(description),
    normMeta: norm([...tags, ...topics, candidate.category, candidate.shortName, candidate.name].filter(Boolean).join(' ')),
    normText: norm(text),
  };
}
async function buildSearchIndex(dataDir, catalog, sharedSearchIndex) {
  if (searchIndexCache.index && searchIndexCache.dataDir === dataDir) {
    return searchIndexCache.index;
  }
  const candidates = Array.isArray(sharedSearchIndex?.documents) && sharedSearchIndex.documents.length
    ? sharedSearchIndex.documents.map((item) => ({ ...item, rel: null }))
    : [
    ...(catalog.articles || []).map((item) => ({
      ...item,
      type: 'article',
      rel: `posts/${item.slug}/index.html`,
    })),
    ...(catalog.guides || []).map((item) => ({
      ...item,
      type: 'guide',
      rel: `guides/${item.slug}/index.html`,
    })),
    ...(catalog.glossary || []).map((item) => ({
      ...item,
      type: 'glossary',
      title: `${item.sigle || item.name} - ${item.name || item.sigle}`,
      description: item.definition,
      tags: [item.category, item.sigle, item.name].filter(Boolean),
      rel: `glossaire/${item.slug}/index.html`,
    })),
    ...(catalog.methodologies || []).map((item) => ({
      ...item,
      type: 'methodology',
      tags: [item.label, item.dashboard].filter(Boolean),
      rel: `methodologie/${item.slug}/index.html`,
    })),
    ...(catalog.primarySources || []).map((item) => ({
      ...item,
      type: 'source',
      title: item.shortName ? `${item.shortName} - ${item.name}` : item.name,
      tags: [item.category, item.shortName, item.officialUrl].filter(Boolean),
      rel: `sources/${item.slug}/index.html`,
    })),
    ];
  const index = [];
  for (const candidate of candidates) {
    if (candidate.rel) index.push(await readSearchDocument(dataDir, candidate));
    else {
      const text = [candidate.description, candidate.text].filter(Boolean).join(' ');
      index.push({
        ...candidate,
        text,
        normTitle: norm(candidate.title),
        normDescription: norm(candidate.description),
        normMeta: norm([...(candidate.tags || []), ...(candidate.topics || [])].join(' ')),
        normText: norm(text),
      });
    }
  }
  searchIndexCache = { dataDir, index };
  return index;
}
function rankSearchDocument(doc, tokens, queryNorm) {
  let value = 0;
  const matched = [];
  const fields = new Set();
  for (const token of tokens) {
    let tokenScore = 0;
    if (doc.normTitle.includes(token)) { tokenScore += 30; fields.add('title'); }
    if (doc.normMeta.includes(token)) { tokenScore += 12; fields.add('tags'); }
    if (doc.normDescription.includes(token)) { tokenScore += 8; fields.add('description'); }
    const bodyCount = countToken(doc.normText, token);
    if (bodyCount) {
      tokenScore += Math.min(bodyCount, 12);
      fields.add('body');
    }
    if (tokenScore) matched.push(token);
    value += tokenScore;
  }
  if (!value) return null;
  if (queryNorm && doc.normTitle.includes(queryNorm)) value += 80;
  if (queryNorm && doc.normText.includes(queryNorm)) value += 40;
  value += Math.min(matched.length, 6) * 3;
  return { value, matched, fields: [...fields] };
}
async function searchFullText(dataDir, catalog, sharedSearchIndex, query, limit, language) {
  const tokens = tokensOf(query);
  if (!tokens.length) return [];
  const queryNorm = tokens.join(' ');
  const index = await buildSearchIndex(dataDir, catalog, sharedSearchIndex);
  return index
    .filter((doc) => !language || doc.language === language)
    .map((doc) => ({ doc, ranking: rankSearchDocument(doc, tokens, queryNorm) }))
    .filter((item) => item.ranking)
    .sort((a, b) => b.ranking.value - a.ranking.value || String(b.doc.date || '').localeCompare(String(a.doc.date || '')))
    .slice(0, limit)
    .map(({ doc, ranking }) => ({
      type: doc.type,
      canonicalId: doc.canonicalId,
      language: doc.language || 'fr',
      translationStatus: doc.translationStatus || 'source',
      title: doc.title,
      url: doc.url,
      date: doc.date || doc.updated || null,
      description: doc.description,
      excerpt: excerptFor(doc.text, tokens, doc.description),
      score: ranking.value,
      matchedTerms: ranking.matched,
      matchedFields: ranking.fields,
    }));
}
const JsonValue = z.lazy(() => z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
  z.array(JsonValue),
  z.record(JsonValue),
]));
const AnyRecord = z.record(z.string(), JsonValue);
const ToolOutput = z.object({ error: z.string().optional() }).catchall(JsonValue);
const UrlString = z.string();
const NullableString = z.string().nullable().optional();
const ClaimKindSchema = z.enum(['fait', 'estimation', 'inférence', 'scénario', 'unclassified-assertion']);
const LanguageSchema = z.enum(['fr', 'en']);
const EvidenceReferenceSchema = z.object({
  label: z.string(),
  href: z.string(),
  host: NullableString,
  kind: NullableString,
  date: NullableString,
  dateLabel: NullableString,
  sourcePublicationDate: NullableString,
  sourcePublicationDateLabel: NullableString,
  retrievedAt: NullableString,
  indexedAt: NullableString,
}).strict();
const CompactClaimSchema = z.object({
  id: z.string(),
  canonicalId: z.string(),
  language: LanguageSchema,
  articleSlug: z.string(),
  articleTitle: z.string().optional(),
  articleUrl: UrlString.optional(),
  kind: ClaimKindSchema,
  claim: z.string(),
  date: NullableString,
  dateLabel: NullableString,
  claimDate: NullableString,
  claimDateLabel: NullableString,
  observationDate: NullableString,
  observationDateLabel: NullableString,
  observationStart: NullableString,
  observationEnd: NullableString,
  temporalPrecision: z.enum(['day', 'month', 'quarter', 'year', 'range', 'unknown']).optional(),
  confidence: z.string().optional(),
  reviewStatus: z.enum(['unreviewed', 'reviewed']).optional(),
  reviewedAt: NullableString,
  reviewedBy: NullableString,
  reviewNote: NullableString,
  reviewedProofDepth: z.enum(['direct-proof', 'reproduction']).nullable().optional(),
  evidenceLocator: z.object({
    type: z.enum(['page', 'paragraph', 'section', 'table', 'series', 'cell', 'form', 'accession', 'doi', 'calculation', 'other']),
    value: z.string(),
  }).nullable().optional(),
  reviewSourceUrl: NullableString,
  reviewSourceDate: NullableString,
  reviewSourceType: z.enum(['primary', 'secondary', 'issuer', 'dataset']).nullable().optional(),
  reproductionArtifact: NullableString,
  classifier: AnyRecord.optional(),
  references: z.array(EvidenceReferenceSchema),
}).strict();
const SearchResultSchema = z.object({
  type: z.enum(['article', 'guide', 'glossary', 'methodology', 'source']),
  canonicalId: z.string().optional(),
  language: LanguageSchema,
  translationStatus: z.enum(['source', 'current', 'stale', 'missing-source']).optional(),
  title: z.string(),
  url: UrlString.optional(),
  date: NullableString,
  description: z.string().optional(),
  excerpt: z.string().optional(),
  score: z.number(),
  matchedTerms: z.array(z.string()).optional(),
  matchedFields: z.array(z.enum(['title', 'tags', 'description', 'body'])).optional(),
}).strict();
const EvidenceGraphNodeSchema = z.object({
  id: z.string(),
  type: z.enum(['article', 'claim', 'reference', 'host', 'primarySource', 'dataset']),
  label: z.string(),
  url: z.string().nullable().optional(),
  meta: AnyRecord.optional(),
}).strict();
const EvidenceGraphEdgeSchema = z.object({
  id: z.string(),
  from: z.string(),
  to: z.string(),
  type: z.enum(['contains', 'cites', 'hostedBy', 'matchesPrimarySource', 'providesDataset']),
  meta: AnyRecord.optional(),
}).strict();
const GraphSectionSchema = z.object({
  scope: z.enum(['directEvidence', 'relatedContent']),
  policy: z.string(),
  returned: AnyRecord.optional(),
  nodes: z.array(EvidenceGraphNodeSchema),
  edges: z.array(EvidenceGraphEdgeSchema),
}).strict();
const SnapshotSchema = z.object({
  path: z.string(),
  url: UrlString.optional(),
  role: z.string().optional(),
  mediaType: z.string().optional(),
  canonicalSha256: z.string(),
  canonicalBytes: z.number().optional(),
}).strict();
const ChangefeedReplacementSchema = z.object({
  objectId: z.string(),
  version: z.string(),
  hash: z.string().nullable(),
}).strict();
const ChangeEntrySchema = z.object({
  id: z.string(),
  objectId: z.string(),
  date: z.string(),
  type: z.enum(['article-published', 'article-revised', 'guide-published', 'guide-revised', 'editorial-change']),
  contentType: z.enum(['article', 'guide', 'policy']),
  language: LanguageSchema,
  slug: z.string(),
  title: z.string(),
  url: UrlString,
  changedFields: z.array(z.string()),
  summary: z.string(),
  previousVersion: z.string().nullable(),
  currentVersion: z.string(),
  previousHash: z.string().nullable(),
  currentHash: z.string().nullable(),
  replaces: ChangefeedReplacementSchema.nullable(),
  semanticChange: z.enum(['publication', 'content-revision', 'source-update', 'evidence-update', 'editorial-policy-change']),
  correctionReason: z.string().nullable(),
  diffStatus: z.enum(['current-only', 'previous-version-known-without-hash', 'historical-version-without-hash', 'full-diff']),
}).strict();
const PrimarySourceSchema = z.object({
  type: z.literal('primarySource').optional(),
  slug: z.string(),
  url: UrlString.optional(),
  name: z.string(),
  shortName: z.string().optional(),
  category: z.string().optional(),
  officialUrl: UrlString.optional(),
  description: z.string().optional(),
  datasets: z.array(AnyRecord).optional(),
  limits: z.array(z.string()).optional(),
  verification: z.array(z.string()).optional(),
}).catchall(JsonValue);
const ReferenceHostSchema = z.object({
  type: z.literal('referenceHost').optional(),
  host: z.string(),
  references: z.number().optional(),
  articles: z.number().optional(),
  kinds: z.array(z.string()).optional(),
}).strict();
const AgentManifestOutput = ToolOutput.extend({
  version: z.string().optional(),
  name: z.string().optional(),
  description: z.string().optional(),
  capabilities: z.array(z.string()).optional(),
  endpoints: AnyRecord.optional(),
  counts: AnyRecord.optional(),
  proofPolicy: AnyRecord.optional(),
  server: AnyRecord.optional(),
}).passthrough();
const RiskIndicesOutput = ToolOutput.extend({
  snapshot: z.string().nullable().optional(),
  generated: z.string().nullable().optional(),
  indices: AnyRecord.optional(),
  confluence: z.any().optional(),
  source: z.string().optional(),
}).passthrough();
const SignalHistoryOutput = ToolOutput.extend({
  version: z.string().optional(),
  generated: z.string().nullable().optional(),
  updated: z.string().nullable().optional(),
  coverage: AnyRecord.optional(),
  filters: AnyRecord.optional(),
  instruments: z.array(AnyRecord).optional(),
  current: AnyRecord.optional(),
  observations: z.array(z.any()).optional(),
  levelChanges: z.array(z.any()).optional(),
  events: z.array(z.any()).optional(),
  policy: AnyRecord.optional(),
  confluence: AnyRecord.optional(),
  caveat: z.string().optional(),
}).passthrough();
const RiskDiffOutput = ToolOutput.extend({
  version: z.string().optional(),
  generated: z.string().optional(),
  anchorDate: z.string().optional(),
  filters: AnyRecord.optional(),
  windows: z.array(z.any()).optional(),
  selectedWindow: z.any().optional(),
  freshness: z.any().optional(),
  limitations: z.array(z.string()).optional(),
}).passthrough();
const BlackBoxOutput = ToolOutput.extend({
  version: z.string().optional(),
  generated: z.string().optional(),
  coverage: AnyRecord.optional(),
  replay: AnyRecord.optional(),
  requestedDate: z.string().nullable().optional(),
  replayable: z.boolean().optional(),
  frame: z.any().nullable().optional(),
  latestFrame: z.any().nullable().optional(),
  frames: z.array(z.any()).optional(),
  policy: AnyRecord.optional(),
}).passthrough();
const OpenapiOutput = ToolOutput.extend({
  openapi: z.string().optional(),
  info: AnyRecord.optional(),
  servers: z.array(z.any()).optional(),
  pathCount: z.number().optional(),
  paths: z.any().optional(),
  schemas: z.array(z.string()).optional(),
}).passthrough();
const NdjsonOutput = ToolOutput.extend({
  feed: z.string().optional(),
  path: z.string().optional(),
  role: z.string().optional(),
  totalLines: z.number().optional(),
  totalMatches: z.number().optional(),
  count: z.number().optional(),
  truncated: z.boolean().optional(),
  recordType: z.string().nullable().optional(),
  records: z.array(z.any()).optional(),
}).passthrough();
const SignalFreshnessSchema = z.object({
  key: z.enum(['us', 'eu', 'yen', 'energie', 'debt']),
  label: z.string(),
  source: z.string().url(),
  methodology: z.string().url(),
  observedAt: z.string().datetime({ offset: true }).nullable(),
  sourcePublishedAt: z.string().datetime({ offset: true }).nullable(),
  retrievedAt: z.string().datetime({ offset: true }).nullable(),
  computedAt: z.string().datetime({ offset: true }),
  staleAfter: z.string(),
  expiresAt: z.string().datetime({ offset: true }).nullable(),
  timelinessStatus: z.enum(['fresh', 'stale', 'unknown']),
  coverageStatus: z.enum(['complete', 'partial', 'missing']),
  coverage: z.object({
    signalPresent: z.boolean(),
    observedAt: z.boolean(),
    sourcePublishedAt: z.boolean(),
    retrievedAt: z.boolean(),
    computedAt: z.boolean(),
    staleAfter: z.boolean(),
  }).strict(),
  missing: z.array(z.enum(['signalPresent', 'observedAt', 'sourcePublishedAt', 'retrievedAt', 'computedAt', 'staleAfter'])),
  note: z.string(),
}).strict();
const FreshnessOutput = ToolOutput.extend({
  version: z.string().optional(),
  generated: z.string().optional(),
  latest: z.array(z.any()).optional(),
  corpus: AnyRecord.optional(),
  endpoints: z.array(z.any()).optional(),
  signalFreshness: z.array(SignalFreshnessSchema).optional(),
  freshnessPolicy: AnyRecord.optional(),
}).passthrough();
const SearchOutput = ToolOutput.extend({
  query: z.string().optional(),
  language: LanguageSchema.nullable().optional(),
  mode: z.enum(['fulltext', 'catalog']).optional(),
  backend: z.enum(['shared-agent-search-index', 'catalog-weighted-lexical']).optional(),
  coverage: z.array(z.enum(['title', 'tags', 'topics', 'description', 'body'])).optional(),
  count: z.number().optional(),
  results: z.array(SearchResultSchema).optional(),
}).strict();
const ResearchPackOutput = ToolOutput.extend({
  version: z.string().optional(),
  query: z.string().optional(),
  language: LanguageSchema.optional(),
  parameters: AnyRecord.optional(),
  asOf: AnyRecord.optional(),
  documents: z.array(z.any()).optional(),
  claims: z.array(z.any()).optional(),
  primarySources: z.array(z.any()).optional(),
  claimEvidence: z.array(z.any()).optional(),
  freshness: AnyRecord.optional(),
  riskDiff: z.any().nullable().optional(),
  adversarialFindings: z.array(z.any()).optional(),
  knownLimitations: z.array(z.string()).optional(),
  citationUrls: z.array(z.string()).optional(),
}).passthrough();
const ClaimsOutput = ToolOutput.extend({
  version: z.string().optional(),
  count: z.number().optional(),
  filters: AnyRecord.optional(),
  claimKinds: z.array(ClaimKindSchema).optional(),
  claims: z.array(CompactClaimSchema).optional(),
  policy: AnyRecord.optional(),
}).strict();
const EvidenceGraphOutput = ToolOutput.extend({
  version: z.string().optional(),
  generated: z.string().optional(),
  counts: AnyRecord.optional(),
  returned: AnyRecord.optional(),
  filters: AnyRecord.optional(),
  graphPolicy: AnyRecord.optional(),
  directEvidence: GraphSectionSchema.optional(),
  relatedContent: GraphSectionSchema.optional(),
  nodes: z.array(EvidenceGraphNodeSchema).optional(),
  edges: z.array(EvidenceGraphEdgeSchema).optional(),
}).strict();
const SourcesOutput = ToolOutput.extend({
  version: z.string().optional(),
  counts: AnyRecord.optional(),
  sourcePolicy: AnyRecord.optional(),
  primarySources: z.array(PrimarySourceSchema).optional(),
  referenceHosts: z.array(ReferenceHostSchema).optional(),
}).strict();
const IntegrityOutput = ToolOutput.extend({
  version: z.string().optional(),
  generated: z.string().optional(),
  algorithm: z.string().optional(),
  canonicalization: AnyRecord.optional(),
  count: z.number().optional(),
  snapshots: z.array(SnapshotSchema).optional(),
  verification: AnyRecord.optional(),
}).strict();
const ChangefeedOutput = ToolOutput.extend({
  version: z.string().optional(),
  generated: z.string().optional(),
  count: z.number().optional(),
  feedPolicy: AnyRecord.optional(),
  entries: z.array(ChangeEntrySchema).optional(),
}).strict();
const AnalysisListOutput = ToolOutput.extend({
  count: z.number().optional(),
  analyses: z.array(z.any()).optional(),
}).passthrough();
const GuideListOutput = ToolOutput.extend({
  count: z.number().optional(),
  guides: z.array(z.any()).optional(),
}).passthrough();
const TopicOutput = AnalysisListOutput.extend({
  topic: z.string().optional(),
  label: z.string().optional(),
  requested: z.string().optional(),
  topics: z.array(z.any()).optional(),
}).passthrough();
const ArticleOutput = ToolOutput.extend({
  slug: z.string().optional(),
  canonicalId: z.string().optional(),
  language: LanguageSchema.nullable().optional(),
  translationStatus: z.enum(['source', 'current', 'stale', 'missing-source']).optional(),
  type: z.enum(['article', 'guide']).optional(),
  url: z.string().optional(),
  title: z.string().optional(),
  words: z.number().optional(),
  totalWords: z.number().optional(),
  totalChars: z.number().optional(),
  textChars: z.number().optional(),
  offset: z.number().optional(),
  limit: z.number().optional(),
  length: z.number().optional(),
  nextOffset: z.number().nullable().optional(),
  nextCursor: z.string().nullable().optional(),
  hasMore: z.boolean().optional(),
  section: z.enum(['body', 'head', 'tail', 'sources']).optional(),
  sectionFound: z.boolean().optional(),
  truncated: z.boolean().optional(),
  text: z.string().optional(),
  references: z.array(EvidenceReferenceSchema).optional(),
}).strict();
const ClaimOutput = ToolOutput.extend({
  claimId: z.string().optional(),
  claim: CompactClaimSchema.optional(),
  resource: z.string().optional(),
  articleResource: z.string().optional(),
  evidenceTool: AnyRecord.optional(),
}).strict();
const ClaimEvidenceOutput = ToolOutput.extend({
  claimId: z.string().optional(),
  claim: CompactClaimSchema.optional(),
  evidence: AnyRecord.optional(),
  references: z.array(EvidenceReferenceSchema).optional(),
  directEvidence: GraphSectionSchema.optional(),
  relatedContent: GraphSectionSchema.optional(),
  nodes: z.array(EvidenceGraphNodeSchema).optional(),
  edges: z.array(EvidenceGraphEdgeSchema).optional(),
  returned: AnyRecord.optional(),
}).strict();
const ArticleClaimsOutput = ToolOutput.extend({
  articleSlug: z.string().optional(),
  article: AnyRecord.optional(),
  count: z.number().optional(),
  filters: AnyRecord.optional(),
  claims: z.array(CompactClaimSchema).optional(),
  resources: z.array(z.string()).optional(),
}).strict();
const ClaimsBySourceOutput = ToolOutput.extend({
  sourceId: z.string().optional(),
  source: z.union([PrimarySourceSchema, ReferenceHostSchema]).nullable().optional(),
  count: z.number().optional(),
  filters: AnyRecord.optional(),
  claims: z.array(CompactClaimSchema.extend({ matchingReferences: z.array(EvidenceReferenceSchema) })).optional(),
}).strict();
const SourceOutput = ToolOutput.extend({
  sourceId: z.string().optional(),
  sourceType: z.enum(['primarySource', 'referenceHost', 'referenceMatch']).optional(),
  source: z.union([PrimarySourceSchema, ReferenceHostSchema]).nullable().optional(),
  claimsCount: z.number().optional(),
  claims: z.array(CompactClaimSchema.extend({ matchingReferences: z.array(EvidenceReferenceSchema) })).optional(),
}).strict();
const VerifyArtifactOutput = ToolOutput.extend({
  path: z.string().optional(),
  verified: z.boolean().nullable().optional(),
  algorithm: z.string().optional(),
  expectedSha256: z.string().optional(),
  providedSha256: z.string().nullable().optional(),
  snapshot: SnapshotSchema.optional(),
  canonicalization: AnyRecord.optional(),
  verification: AnyRecord.optional(),
  knownPaths: z.array(z.string()).optional(),
}).strict();
const ChangesOutput = ToolOutput.extend({
  version: z.string().optional(),
  generated: z.string().optional(),
  count: z.number().optional(),
  filters: AnyRecord.optional(),
  feedPolicy: AnyRecord.optional(),
  entries: z.array(ChangeEntrySchema).optional(),
}).strict();
function summarizePayload(payload) {
  if (payload?.error) return `Erreur : ${payload.error}.`;
  if (payload?.claim && payload?.evidence) return `Preuve de claim : ${payload.claim.id} (${payload.evidence.proofDepth}).`;
  if (payload?.claim && payload?.claimId) return `Claim ${payload.claimId} : ${payload.claim.kind}.`;
  if (payload?.source && payload?.claims) return `${payload.claimsCount ?? payload.count ?? payload.claims.length} claim(s) liées à cette source.`;
  if (payload?.verified !== undefined && payload?.path) return `Artefact ${payload.path} : ${payload.verified === null ? 'empreinte publiée' : payload.verified ? 'empreinte vérifiée' : 'empreinte différente'}.`;
  if (payload?.indices) {
    const parts = Object.entries(payload.indices)
      .map(([key, item]) => `${key}: ${item?.value ?? 'n/a'} (${item?.level ?? item?.tone ?? 'n/a'})`);
    return `Signaux l0g : ${parts.join(', ')}.`;
  }
  if (payload?.selectedWindow) return `Risk Diff ${payload.selectedWindow.window} : confiance ${payload.selectedWindow.confidence?.label ?? 'n/a'}.`;
  if (payload?.windows) return `Risk Diff : ${payload.windows.length} fenêtre(s) disponibles.`;
  if (payload?.replayable !== undefined && payload?.requestedDate) return payload.replayable ? `Black Box : frame rejouée pour ${payload.requestedDate}.` : `Black Box : ${payload.requestedDate} non rejouable.`;
  if (payload?.latestFrame && payload?.coverage) return `Black Box : ${payload.coverage.frames ?? 0} frame(s), dernière date ${payload.latestFrame.date ?? 'n/a'}.`;
  if (payload?.claims) return `${payload.count ?? payload.claims.length} claim(s) structurée(s) avec références.`;
  if (payload?.nodes && payload?.edges) return `Sous-graphe de preuve : ${payload.returned?.nodes ?? payload.nodes.length} nœud(s), ${payload.returned?.edges ?? payload.edges.length} arête(s).`;
  if (payload?.entries) return `${payload.count ?? payload.entries.length} changement(s) dans le changefeed.`;
  if (payload?.analyses) return `${payload.count ?? payload.analyses.length} analyse(s) trouvée(s).`;
  if (payload?.guides) return `${payload.count ?? payload.guides.length} guide(s) disponible(s).`;
  if (payload?.records) return `${payload.count ?? payload.records.length} ligne(s) NDJSON structurée(s).`;
  if (payload?.latest) return `${payload.latest.length} contenu(s) récent(s), snapshot ${payload.generated ?? 'non daté'}.`;
  if (payload?.snapshots) return `${payload.count ?? payload.snapshots.length} empreinte(s) d’intégrité.`;
  if (payload?.text && payload?.title) return `${payload.title} — ${payload.words ?? 0} mots${payload.truncated ? ' (tronqué)' : ''}.`;
  return 'Réponse structurée disponible dans structuredContent.';
}
function reply(payload, text) {
  return {
    content: [{ type: 'text', text: text || summarizePayload(payload) }],
    structuredContent: payload,
  };
}
function errorReply(payload, text) {
  return {
    content: [{ type: 'text', text: text || summarizePayload(payload) }],
    structuredContent: payload,
    isError: true,
  };
}
function resourceNotFound(kind, id) {
  throw new McpError(ErrorCode.InvalidParams, `${kind} introuvable`, { id });
}
function compactClaim(claim) {
  return {
    id: claim.id,
    canonicalId: claim.canonicalId,
    language: claim.language || 'fr',
    articleSlug: claim.articleSlug,
    articleTitle: claim.articleTitle,
    articleUrl: claim.articleUrl,
    kind: claim.kind,
    claim: claim.claim,
    date: claim.date,
    dateLabel: claim.dateLabel,
    claimDate: claim.claimDate,
    claimDateLabel: claim.claimDateLabel,
    observationDate: claim.observationDate,
    observationDateLabel: claim.observationDateLabel,
    observationStart: claim.observationStart,
    observationEnd: claim.observationEnd,
    temporalPrecision: claim.temporalPrecision,
    confidence: claim.confidence,
    reviewStatus: claim.reviewStatus,
    reviewedAt: claim.reviewedAt,
    reviewedBy: claim.reviewedBy,
    reviewNote: claim.reviewNote,
    reviewedProofDepth: claim.reviewedProofDepth,
    evidenceLocator: claim.evidenceLocator,
    reviewSourceUrl: claim.reviewSourceUrl,
    reviewSourceDate: claim.reviewSourceDate,
    reviewSourceType: claim.reviewSourceType,
    reproductionArtifact: claim.reproductionArtifact,
    classifier: claim.classifier,
    references: (claim.references || []).map((r) => ({
      label: r.label,
      href: r.href,
      host: r.host,
      kind: r.kind,
      date: r.date,
      dateLabel: r.dateLabel,
      sourcePublicationDate: r.sourcePublicationDate,
      sourcePublicationDateLabel: r.sourcePublicationDateLabel,
      retrievedAt: r.retrievedAt,
      indexedAt: r.indexedAt,
    })),
  };
}
function compactSnapshot(snapshot) {
  return {
    path: snapshot.path,
    url: snapshot.url,
    role: snapshot.role,
    mediaType: snapshot.mediaType,
    canonicalSha256: snapshot.canonicalSha256,
    canonicalBytes: snapshot.canonicalBytes,
  };
}
function resourceJson(uri, payload) {
  return {
    contents: [{
      uri,
      mimeType: 'application/json',
      text: JSON.stringify(payload, null, 2),
    }],
  };
}
function uriValue(value) {
  return decodeURIComponent(String(value || '').trim());
}
function summarizeOpenapi(openapi, path) {
  const paths = openapi.paths || {};
  const selectedPaths = path ? Object.fromEntries(Object.entries(paths).filter(([key]) => key === path)) : paths;
  return {
    openapi: openapi.openapi,
    info: openapi.info,
    servers: openapi.servers || [],
    pathCount: Object.keys(paths).length,
    paths: Object.entries(selectedPaths).map(([key, value]) => ({
      path: key,
      methods: Object.keys(value || {}).map((method) => method.toUpperCase()),
      summary: Object.values(value || {})[0]?.summary || Object.values(value || {})[0]?.description || null,
    })),
    schemas: Object.keys(openapi.components?.schemas || {}),
  };
}
async function readNdjsonFeed(dataDir, feed, limit, recordType) {
  const spec = NDJSON_FEEDS[feed];
  const raw = await readText(dataDir, spec.path);
  const records = [];
  let total = 0;
  let matches = 0;
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    total++;
    let parsed;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      parsed = { parseError: true, raw: trimmed.slice(0, 500) };
    }
    if (recordType && parsed.recordType !== recordType) continue;
    matches++;
    if (records.length < limit) records.push(parsed);
  }
  return { spec, totalLines: total, totalMatches: matches, records };
}

function removeLiveNotificationCapabilities(server) {
  const capabilities = server.server.getCapabilities();
  for (const scope of ['resources', 'tools', 'prompts']) {
    if (!capabilities[scope]) continue;
    delete capabilities[scope].listChanged;
  }
  if (capabilities.resources) delete capabilities.resources.subscribe;
}

// --- fabrique d'un serveur MCP (neuf par requête) ---
function buildServer(data) {
  const server = new McpServer({ name: 'l0g.fr', version: MCP_VERSION });
  const { agent, openapi, catalog, searchIndex: sharedSearchIndex, claims, sources, freshness, integrity, changes, riskDiff, blackBox, evidenceGraph, risk, debtRisk, signalHistory, riskEvents, confluence } = data;
  const dataDir = data.dataDir || DATA_DIR;
  const articles = catalog.articles || [];
  const guides = catalog.guides || [];
  const articlesFr = articles.filter((item) => item.language !== 'en');
  const articlesEn = articles.filter((item) => item.language === 'en');
  const guidesFr = guides.filter((item) => item.language !== 'en');
  const guidesEn = guides.filter((item) => item.language === 'en');
  const topicsList = catalog.topics || [];
  const claimKinds = ['fait', 'estimation', 'inférence', 'scénario', 'unclassified-assertion'];
  const claimsList = claims.claims || [];
  const methodologies = catalog.methodologies || [];
  const primarySources = sources.primarySources || [];
  const referenceHosts = sources.referenceHosts || [];
  const signals = { ...(risk?.indices || {}) };
  if (debtRisk?.signal?.key === 'debt') {
    signals.debt = {
      ...debtRisk.signal,
      label: debtRisk.provenance?.label || 'Debt Risk Radar',
      source: debtRisk.provenance?.source || `${SITE}/api/v1/debt-risk.json`,
      methodology: debtRisk.provenance?.methodology || `${SITE}/methodologie/debt-risk-radar/`,
      provenance: debtRisk.provenance || null,
    };
  }

  function referencesForArticle(record) {
    const slug = record?.evidenceRef?.articleSlug || record?.slug;
    const seen = new Set();
    const references = [];
    for (const claim of claimsList.filter((item) => item.articleSlug === slug)) {
      for (const reference of claim.references || []) {
        const key = `${reference.href || ''}|${reference.label || ''}`;
        if (seen.has(key)) continue;
        seen.add(key);
        references.push({
          label: reference.label,
          href: reference.href,
          host: reference.host,
          kind: reference.kind,
          date: reference.date,
          dateLabel: reference.dateLabel,
          sourcePublicationDate: reference.sourcePublicationDate,
          sourcePublicationDateLabel: reference.sourcePublicationDateLabel,
          retrievedAt: reference.retrievedAt,
          indexedAt: reference.indexedAt,
        });
      }
    }
    return references;
  }

  function readOptionsFromUri(uri, variables = {}) {
    const query = uri?.searchParams;
    const section = uriValue(variables.section || query?.get('section') || 'body');
    const offset = Number.parseInt(uriValue(variables.offset || query?.get('offset') || '0'), 10);
    const limit = Number.parseInt(uriValue(variables.limit || query?.get('limit') || ''), 10);
    const cursor = uriValue(variables.cursor || query?.get('cursor') || '');
    return {
      section: ['body', 'head', 'tail', 'sources'].includes(section) ? section : 'body',
      offset: Number.isFinite(offset) ? offset : 0,
      limit: Number.isFinite(limit) ? limit : undefined,
      cursor: cursor || undefined,
    };
  }

  async function readDocument(slug, type, options = {}) {
    const raw = uriValue(slug);
    const clean = cleanSlug(raw);
    const pool = type === 'guide' ? guides : articles;
    const inferredLanguage = /(?:^|\/)en\/(?:analysis|guides)\//.test(raw) ? 'en' : null;
    const language = options.language || inferredLanguage;
    const candidates = pool.filter((item) => item.slug === clean && (!language || item.language === language));
    const record = candidates.find((item) => item.language === 'fr') || candidates[0];
    if (!record) resourceNotFound(type, clean);
    const pathname = new URL(record.url, SITE).pathname.replace(/^\/+|\/+$/g, '');
    const allowedPath = /^(?:posts|guides|en\/analysis|en\/guides)\/[a-z0-9][a-z0-9-]*$/;
    if (!allowedPath.test(pathname)) resourceNotFound(type, clean);
    const html = await readFile(join(dataDir, pathname, 'index.html'), 'utf-8');
    const root = parseHtml(html);
    const titleEl = root.querySelector('article h1') || root.querySelector('h1');
    const body = root.querySelector('.prose') || root.querySelector('[data-pagefind-body]') || root.querySelector('article');
    const text = (body ? body.text : '').replace(/\s+/g, ' ').trim();
    const chunk = articleChunk(text, options);
    return {
      ...record,
      type,
      title: titleEl ? titleEl.text.replace(/\s+/g, ' ').trim() : record.title,
      ...chunk,
      references: referencesForArticle(record),
    };
  }

  function cleanSlug(value) {
    return String(value || '').trim().replace(/^https?:\/\/[^/]+/i, '').replace(/[?#].*$/, '').replace(/^\/+|\/+$/g, '').replace(/^(?:posts|guides|en\/analysis|en\/guides)\//, '');
  }

  function resolveCatalogDocument(value, type, language) {
    const raw = String(value || '');
    const clean = cleanSlug(raw);
    const inferredLanguage = /(?:^|\/)en\/(?:analysis|guides)\//.test(raw) ? 'en' : null;
    const requestedLanguage = language || inferredLanguage;
    const pool = type === 'guide' ? guides : type === 'article' ? articles : [...articles, ...guides];
    const matches = pool.filter((item) => item.slug === clean && (!requestedLanguage || item.language === requestedLanguage));
    return matches.find((item) => item.language === 'fr') || matches[0] || null;
  }

  function normalizeId(value, prefix) {
    return uriValue(value).replace(new RegExp(`^l0g://${prefix}/`, 'i'), '');
  }

  function hostFromUrl(value) {
    try {
      return new URL(value).hostname.replace(/^www\./, '').toLowerCase();
    } catch {
      return '';
    }
  }

  function findClaimById(claimId) {
    const id = normalizeId(claimId, 'claims');
    return { id, claim: claimsList.find((item) => item.id === id) };
  }

  function findSource(sourceId) {
    const id = normalizeId(sourceId, 'sources');
    const raw = norm(id);
    if (!raw) return { id, sourceType: null, source: null };
    const primary = primarySources.find((source) => {
      const aliases = [source.slug, source.name, source.shortName, hostFromUrl(source.officialUrl)];
      return aliases.some((alias) => norm(alias) === raw);
    }) || primarySources.find((source) => {
      const aliases = [source.slug, source.name, source.shortName, source.officialUrl, hostFromUrl(source.officialUrl)];
      return aliases.some((alias) => norm(alias).includes(raw) || raw.includes(norm(alias)));
    });
    if (primary) return { id, sourceType: 'primarySource', source: primary };
    const host = referenceHosts.find((item) => norm(item.host) === raw)
      || referenceHosts.find((item) => norm(item.host).includes(raw) || raw.includes(norm(item.host)));
    if (host) return { id, sourceType: 'referenceHost', source: host };
    return { id, sourceType: null, source: null };
  }

  function referenceMatchesSource(reference, sourceId, resolvedSource) {
    const raw = norm(sourceId);
    if (!raw) return false;
    const refHost = norm(reference.host || hostFromUrl(reference.href));
    const refUrlHost = norm(hostFromUrl(reference.href));
    const haystack = norm([reference.label, reference.href, reference.host, reference.kind].filter(Boolean).join(' '));
    if (raw && (refHost === raw || refUrlHost === raw || haystack.includes(raw))) return true;
    if (resolvedSource?.sourceType === 'primarySource') {
      const source = resolvedSource.source;
      const sourceHost = norm(hostFromUrl(source.officialUrl));
      const aliases = [source.slug, source.name, source.shortName, sourceHost].map(norm).filter(Boolean);
      return aliases.some((alias) => refHost === alias || refUrlHost === alias || haystack.includes(alias));
    }
    if (resolvedSource?.sourceType === 'referenceHost') {
      const host = norm(resolvedSource.source.host);
      return refHost === host || refUrlHost === host || haystack.includes(host);
    }
    return false;
  }

  function claimsForSource(sourceId, options = {}) {
    const { kind, limit = 20 } = options;
    const resolved = findSource(sourceId);
    const list = [];
    for (const claim of claimsList) {
      if (kind && claim.kind !== kind) continue;
      const matchingReferences = (claim.references || []).filter((reference) => referenceMatchesSource(reference, resolved.id, resolved));
      if (!matchingReferences.length) continue;
      list.push({ ...compactClaim(claim), matchingReferences });
      if (list.length >= limit) break;
    }
    return { resolved, claims: list };
  }

  function proofDepthForClaim(claim) {
    const refs = claim.references || [];
    const externallyLinkedRefs = refs.filter((reference) => reference.href && reference.kind !== 'publication interne');
    const linked = externallyLinkedRefs.length;
    const primaryRefs = refs.filter((reference) => norm(reference.kind).includes('primaire'));
    const datedRefs = refs.filter((reference) => reference.sourcePublicationDate || reference.date);
    const datedPrimaryRefs = primaryRefs.filter((reference) => reference.href && (reference.sourcePublicationDate || reference.date));
    const hosts = new Set(refs.map((reference) => reference.host || hostFromUrl(reference.href)).filter(Boolean));
    const reviewedDirect = claim.reviewStatus === 'reviewed' && claim.reviewedProofDepth === 'direct-proof';
    const reviewedReproduction = claim.reviewStatus === 'reviewed' && claim.reviewedProofDepth === 'reproduction';
    let label = 'mention';
    if (reviewedReproduction) label = 'reproduction';
    else if (reviewedDirect) label = 'preuve directe';
    else if (datedPrimaryRefs.length) label = 'source primaire liée et datée';
    else if (linked && datedRefs.length) label = 'source liée et datée';
    else if (linked) label = 'source liée';
    else if (refs.length) label = 'référence';
    return {
      proofDepth: label,
      proofDepthStatus: reviewedDirect || reviewedReproduction ? 'revue humaine' : 'automatique',
      directProofReservedFor: [
        'relation explicitement encodée',
        'relecture humaine',
        'localisation précise dans la source',
        'calcul ou donnée reproductible',
      ],
      caveat:
        "Une source primaire liée et datée indique une proximité documentaire vérifiable ; elle ne prouve pas automatiquement que la source soutient précisément la proposition.",
      references: refs.length,
      linkedReferences: linked,
      datedReferences: datedRefs.length,
      primaryReferences: primaryRefs.length,
      datedPrimaryReferences: datedPrimaryRefs.length,
      uniqueHosts: hosts.size,
      claimKind: claim.kind,
      confidence: claim.confidence || null,
      reviewStatus: claim.reviewStatus || 'unreviewed',
      reviewedProofDepth: claim.reviewedProofDepth || null,
      reviewNote: claim.reviewNote || null,
    };
  }

  const graphNodesById = new Map((evidenceGraph.nodes || []).map((node) => [node.id, node]));
  const graphEdges = evidenceGraph.edges || [];

  function graphSection(scope, policy, nodes, edges, limit) {
    const limitedNodes = nodes.slice(0, limit);
    const ids = new Set(limitedNodes.map((node) => node.id));
    const limitedEdges = edges
      .filter((edge) => ids.has(edge.from) && ids.has(edge.to))
      .slice(0, Math.max(limit * 3, 20));
    return {
      scope,
      policy,
      returned: {
        nodes: limitedNodes.length,
        edges: limitedEdges.length,
        truncated: nodes.length > limitedNodes.length || edges.length > limitedEdges.length,
      },
      nodes: limitedNodes,
      edges: limitedEdges,
    };
  }

  function graphNodesFromIds(ids) {
    return [...ids].map((id) => graphNodesById.get(id)).filter(Boolean);
  }

  function claimArticleEdge(claimId) {
    return graphEdges.find((edge) => edge.type === 'contains' && edge.to === claimId);
  }

  function addEdgeToScope(edge, ids, edgeMap) {
    if (!edge) return;
    ids.add(edge.from);
    ids.add(edge.to);
    edgeMap.set(edge.id, edge);
  }

  function directEvidenceForClaims(claimIds, limit = 80) {
    const ids = new Set();
    const edgeMap = new Map();
    const anchors = { hosts: new Set(), primarySources: new Set(), datasets: new Set(), references: new Set(), claims: new Set(), articles: new Set() };

    for (const claimId of claimIds) {
      ids.add(claimId);
      anchors.claims.add(claimId);
      const contains = claimArticleEdge(claimId);
      if (contains) {
        addEdgeToScope(contains, ids, edgeMap);
        anchors.articles.add(contains.from);
      }

      for (const cites of graphEdges.filter((edge) => edge.type === 'cites' && edge.from === claimId)) {
        addEdgeToScope(cites, ids, edgeMap);
        anchors.references.add(cites.to);

        for (const hostedBy of graphEdges.filter((edge) => edge.type === 'hostedBy' && edge.from === cites.to)) {
          addEdgeToScope(hostedBy, ids, edgeMap);
          anchors.hosts.add(hostedBy.to);
        }
        for (const sourceMatch of graphEdges.filter((edge) => edge.type === 'matchesPrimarySource' && edge.from === cites.to)) {
          addEdgeToScope(sourceMatch, ids, edgeMap);
          anchors.primarySources.add(sourceMatch.to);
          for (const dataset of graphEdges.filter((edge) => edge.type === 'providesDataset' && edge.from === sourceMatch.to)) {
            addEdgeToScope(dataset, ids, edgeMap);
            anchors.datasets.add(dataset.to);
          }
        }
      }
    }

    return {
      section: graphSection(
        'directEvidence',
        'Sous-graphe directionnel limité à article -> claim -> référence -> hôte/source primaire -> dataset. Aucune autre claim attirée par hôte commun.',
        graphNodesFromIds(ids),
        [...edgeMap.values()],
        limit
      ),
      anchors,
    };
  }

  function relatedContentForAnchors(anchors, limit = 80) {
    const ids = new Set();
    const edgeMap = new Map();
    const excludedClaims = anchors.claims || new Set();
    const excludedArticles = anchors.articles || new Set();
    const addRelatedClaimPath = (referenceEdge, anchorEdge) => {
      for (const cites of graphEdges.filter((edge) => edge.type === 'cites' && edge.to === referenceEdge.from)) {
        if (excludedClaims.has(cites.from)) continue;
        const contains = claimArticleEdge(cites.from);
        if (contains && excludedArticles.has(contains.from)) continue;
        addEdgeToScope(anchorEdge, ids, edgeMap);
        addEdgeToScope(cites, ids, edgeMap);
        addEdgeToScope(contains, ids, edgeMap);
      }
    };

    for (const hostId of anchors.hosts || []) {
      for (const hostedBy of graphEdges.filter((edge) => edge.type === 'hostedBy' && edge.to === hostId)) {
        if ((anchors.references || new Set()).has(hostedBy.from)) continue;
        addRelatedClaimPath(hostedBy, hostedBy);
      }
    }
    for (const sourceId of anchors.primarySources || []) {
      for (const sourceMatch of graphEdges.filter((edge) => edge.type === 'matchesPrimarySource' && edge.to === sourceId)) {
        if ((anchors.references || new Set()).has(sourceMatch.from)) continue;
        addRelatedClaimPath(sourceMatch, sourceMatch);
      }
    }
    return graphSection(
      'relatedContent',
      'Claims et articles reliés par le même hôte, la même source primaire ou le même dataset. Ce contexte n’est pas une preuve directe de la claim initiale.',
      graphNodesFromIds(ids),
      [...edgeMap.values()],
      limit
    );
  }

  function filterChanges({ contentType, slug, since, limit }) {
    let entries = changes.entries || [];
    if (contentType) entries = entries.filter((entry) => entry.contentType === contentType);
    if (slug) entries = entries.filter((entry) => entry.slug === cleanSlug(slug));
    if (since) {
      const sinceDate = new Date(since);
      if (!Number.isNaN(sinceDate.getTime())) entries = entries.filter((entry) => new Date(entry.date).getTime() >= sinceDate.getTime());
    }
    return entries.slice(0, limit);
  }

  function registerStaticResource(name, uri, config, payload) {
    server.registerResource(name, uri, config, async () => resourceJson(uri, typeof payload === 'function' ? payload() : payload));
  }

  registerStaticResource('agent-manifest', 'l0g://agent-manifest', {
    title: 'Agent manifest',
    description: 'Manifeste Agent Surface : capacités, endpoints, règles d’usage et politiques de preuve.',
    mimeType: 'application/json',
  }, () => agent);
  registerStaticResource('mcp-server', 'l0g://mcp/server', {
    title: 'MCP server runtime',
    description: 'Version, SHA et transport du serveur MCP actif.',
    mimeType: 'application/json',
  }, () => MCP_SERVER_INFO);
  registerStaticResource('openapi', 'l0g://openapi', {
    title: 'OpenAPI',
    description: 'Contrat OpenAPI 3.1 public de l’Agent Surface.',
    mimeType: 'application/json',
  }, () => openapi);
  registerStaticResource('freshness', 'l0g://freshness', {
    title: 'Freshness',
    description: 'Fraîcheur du corpus, derniers contenus, compteurs et endpoints disponibles.',
    mimeType: 'application/json',
  }, () => freshness);
  registerStaticResource('integrity', 'l0g://integrity', {
    title: 'Integrity',
    description: 'Empreintes SHA-256 canoniques des surfaces JSON et NDJSON.',
    mimeType: 'application/json',
  }, () => integrity);
  registerStaticResource('changes-latest', 'l0g://changes/latest', {
    title: 'Latest changes',
    description: 'Dernières publications, révisions et changements éditoriaux structurants.',
    mimeType: 'application/json',
  }, () => ({ ...changes, entries: (changes.entries || []).slice(0, 50) }));
  registerStaticResource('risk-diff', 'l0g://risk-diff', {
    title: 'Risk Diff',
    description: 'Diff du risque sur 1, 7 et 30 jours : signaux, sources, claims, modèles, articles et confiance.',
    mimeType: 'application/json',
  }, () => riskDiff || {
    schema: `${SITE}/openapi.json#/components/schemas/RiskDiffSurface`,
    windows: [],
    limitations: ['Risk Diff indisponible dans ce build.'],
  });
  registerStaticResource('black-box', 'l0g://black-box', {
    title: 'Black Box Recorder',
    description: 'Frames point-in-time hashées pour rejouer l’état public des signaux de risque à une date donnée.',
    mimeType: 'application/json',
  }, () => blackBox || {
    schema: `${SITE}/openapi.json#/components/schemas/BlackBoxSurface`,
    coverage: { frames: 0 },
    frames: [],
    policy: { noPostHoc: 'Une frame absente reste absente.' },
  });
  registerStaticResource('signals-current', 'l0g://signals/current', {
    title: 'Current signals',
    description: 'État courant des signaux de risque normalisés par instrument.',
    mimeType: 'application/json',
  }, () => ({
    snapshot: risk?.snapshot ?? null,
    generated: risk?.generated ?? null,
    indices: signals,
    confluence: risk?.confluence ?? null,
    caveat: "Les scores 0-100 sont normalisés par instrument et ne sont pas comparables comme probabilités.",
  }));
  registerStaticResource('signals-history', 'l0g://signals/history', {
    title: 'Signal history',
    description: 'Historique point-in-time des signaux l0g pour audit, replay et backtests.',
    mimeType: 'application/json',
  }, () => signalHistory || {
    schema: `${SITE}/api/v1/signals/schema.json`,
    observations: [],
    levelChanges: riskEvents?.events || [],
    caveat: 'Historique signaux non disponible dans ce build.',
  });

  server.registerResource(
    'article',
    new ResourceTemplate('l0g://articles/{slug}', {
      complete: { slug: (value) => articlesFr.map((article) => article.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    {
      title: 'Article',
      description: 'Analyse l0g lue comme document ressource paginé, avec métadonnées, références et texte.',
      mimeType: 'application/json',
    },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'article', { ...readOptionsFromUri(uri, variables), language: 'fr' })),
  );

  server.registerResource(
    'article-page',
    new ResourceTemplate('l0g://articles/{slug}{?section,offset,limit}', {
      complete: { slug: (value) => articlesFr.map((article) => article.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    {
      title: 'Article page',
      description: 'Page ciblée d’une analyse l0g : section, offset et limit explicites.',
      mimeType: 'application/json',
    },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'article', { ...readOptionsFromUri(uri, variables), language: 'fr' })),
  );

  server.registerResource(
    'article-cursor',
    new ResourceTemplate('l0g://articles/{slug}{?cursor}', {
      complete: { slug: (value) => articlesFr.map((article) => article.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    {
      title: 'Article cursor',
      description: 'Continuation opaque d’une analyse l0g via nextCursor.',
      mimeType: 'application/json',
    },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'article', { ...readOptionsFromUri(uri, variables), language: 'fr' })),
  );

  server.registerResource(
    'article-en',
    new ResourceTemplate('l0g://en/articles/{slug}', {
      complete: { slug: (value) => articlesEn.map((article) => article.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    { title: 'English article', description: 'Published English l0g analysis with canonical French evidence references.', mimeType: 'application/json' },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'article', { ...readOptionsFromUri(uri, variables), language: 'en' })),
  );

  server.registerResource(
    'article-en-page',
    new ResourceTemplate('l0g://en/articles/{slug}{?section,offset,limit}', {
      complete: { slug: (value) => articlesEn.map((article) => article.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    { title: 'English article page', description: 'Paginated English analysis.', mimeType: 'application/json' },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'article', { ...readOptionsFromUri(uri, variables), language: 'en' })),
  );

  server.registerResource(
    'article-en-cursor',
    new ResourceTemplate('l0g://en/articles/{slug}{?cursor}', {
      complete: { slug: (value) => articlesEn.map((article) => article.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    { title: 'English article cursor', description: 'Opaque continuation cursor for an English analysis.', mimeType: 'application/json' },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'article', { ...readOptionsFromUri(uri, variables), language: 'en' })),
  );

  server.registerResource(
    'guide',
    new ResourceTemplate('l0g://guides/{slug}', {
      complete: { slug: (value) => guidesFr.map((guide) => guide.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    {
      title: 'Guide',
      description: 'Guide de référence l0g lu comme document ressource paginé.',
      mimeType: 'application/json',
    },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'guide', { ...readOptionsFromUri(uri, variables), language: 'fr' })),
  );

  server.registerResource(
    'guide-page',
    new ResourceTemplate('l0g://guides/{slug}{?section,offset,limit}', {
      complete: { slug: (value) => guidesFr.map((guide) => guide.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    {
      title: 'Guide page',
      description: 'Page ciblée d’un guide l0g : section, offset et limit explicites.',
      mimeType: 'application/json',
    },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'guide', { ...readOptionsFromUri(uri, variables), language: 'fr' })),
  );

  server.registerResource(
    'guide-cursor',
    new ResourceTemplate('l0g://guides/{slug}{?cursor}', {
      complete: { slug: (value) => guidesFr.map((guide) => guide.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    {
      title: 'Guide cursor',
      description: 'Continuation opaque d’un guide l0g via nextCursor.',
      mimeType: 'application/json',
    },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'guide', { ...readOptionsFromUri(uri, variables), language: 'fr' })),
  );

  server.registerResource(
    'guide-en',
    new ResourceTemplate('l0g://en/guides/{slug}', {
      complete: { slug: (value) => guidesEn.map((guide) => guide.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    { title: 'English guide', description: 'Published English l0g reference guide.', mimeType: 'application/json' },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'guide', { ...readOptionsFromUri(uri, variables), language: 'en' })),
  );

  server.registerResource(
    'guide-en-page',
    new ResourceTemplate('l0g://en/guides/{slug}{?section,offset,limit}', {
      complete: { slug: (value) => guidesEn.map((guide) => guide.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    { title: 'English guide page', description: 'Paginated English reference guide.', mimeType: 'application/json' },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'guide', { ...readOptionsFromUri(uri, variables), language: 'en' })),
  );

  server.registerResource(
    'guide-en-cursor',
    new ResourceTemplate('l0g://en/guides/{slug}{?cursor}', {
      complete: { slug: (value) => guidesEn.map((guide) => guide.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    { title: 'English guide cursor', description: 'Opaque continuation cursor for an English guide.', mimeType: 'application/json' },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'guide', { ...readOptionsFromUri(uri, variables), language: 'en' })),
  );

  server.registerResource(
    'claim',
    new ResourceTemplate('l0g://claims/{claim_id}', {
      complete: { claim_id: (value) => claimsList.map((claim) => claim.id).filter((id) => id.startsWith(value)).slice(0, 20) },
    }),
    {
      title: 'Claim',
      description: 'Relation affirmation-source avec références datées quand détectable et cliquables.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const id = uriValue(variables.claim_id);
      const claim = claimsList.find((item) => item.id === id);
      if (!claim) resourceNotFound('claim', id);
      return resourceJson(uri.toString(), compactClaim(claim));
    },
  );

  server.registerResource(
    'source',
    new ResourceTemplate('l0g://sources/{source_id}', {
      complete: {
        source_id: (value) => [
          ...primarySources.map((source) => source.slug),
          ...referenceHosts.map((host) => host.host),
        ].filter((id) => id.startsWith(value)).slice(0, 20),
      },
    }),
    {
      title: 'Source',
      description: 'Source primaire suivie par l0g ou hôte effectivement cité par les claims.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const id = uriValue(variables.source_id);
      const source = primarySources.find((item) => item.slug === id) || referenceHosts.find((item) => item.host === id);
      if (!source) resourceNotFound('source', id);
      return resourceJson(uri.toString(), { id, ...source });
    },
  );

  server.registerResource(
    'signal-current',
    new ResourceTemplate('l0g://signals/{instrument}/current', {
      complete: { instrument: (value) => Object.keys(signals).filter((key) => key.startsWith(value)).slice(0, 20) },
    }),
    {
      title: 'Current signal',
      description: 'Signal de risque courant pour un instrument.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const instrument = uriValue(variables.instrument);
      if (!signals[instrument]) resourceNotFound('signal', instrument);
      return resourceJson(uri.toString(), {
        instrument,
        snapshot: risk?.snapshot ?? null,
        generated: risk?.generated ?? null,
        current: signals[instrument],
        history: (riskEvents?.events || []).filter((event) => event.key === instrument),
        caveat: "Signal normalisé par instrument ; ne pas lire comme probabilité ou indice global comparable.",
      });
    },
  );

  server.registerResource(
    'methodology',
    new ResourceTemplate('l0g://methodologies/{instrument}', {
      complete: { instrument: (value) => methodologies.map((item) => item.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    {
      title: 'Methodology',
      description: 'Fiche méthodologique d’un dashboard ou signal l0g.',
      mimeType: 'application/json',
    },
    async (uri, variables) => {
      const instrument = uriValue(variables.instrument);
      const methodology = methodologies.find((item) => item.slug === instrument);
      if (!methodology) resourceNotFound('méthodologie', instrument);
      return resourceJson(uri.toString(), methodology);
    },
  );

  for (const prompt of agentPrompts) {
    const argsSchema = Object.fromEntries(prompt.arguments.map((argument) => {
      let schema = argument.values
        ? z.enum(argument.values)
        : z.string().min(argument.required ? 1 : 0).max(argument.maxLength || 4000);
      if (argument.pattern) schema = schema.regex(new RegExp(argument.pattern));
      if (!argument.required) schema = schema.optional();
      return [argument.name, schema.describe(argument.description)];
    }));
    server.registerPrompt(
      prompt.name,
      {
        title: prompt.title,
        description: prompt.description,
        argsSchema,
      },
      async (args) => renderAgentPrompt(prompt.name, args),
    );
  }

  server.registerTool(
    'get_agent_manifest',
    {
      description:
        "Renvoie le manifeste Agent Surface de l0g.fr : capacités, endpoints, règles d'usage, politiques de preuve et compteurs. " +
        "Point d'entrée recommandé pour découvrir les surfaces machine sans scraper.",
      inputSchema: {},
      outputSchema: AgentManifestOutput,
      annotations: { readOnlyHint: true },
    },
    async () => reply({
      version: agent.version,
      name: agent.name,
      description: agent.description,
      capabilities: agent.capabilities,
      endpoints: agent.endpoints,
      preferredUse: agent.preferredUse,
      prohibitedUse: agent.prohibitedUse,
      counts: agent.counts,
      proofPolicy: agent.proofPolicy,
      server: MCP_SERVER_INFO,
    })
  );

  server.registerTool(
    'get_risk_indices',
    {
      description:
        "Indices de risque publiés par l0g.fr (tableaux de bord macro US et zone euro, Yen Carry, Energie, Dette US) " +
        "à la cadence des snapshots, plus un résumé de la confluence 13F. Pas de temps réel strict, pas un conseil en investissement.",
      inputSchema: {},
      outputSchema: RiskIndicesOutput,
      annotations: { readOnlyHint: true },
    },
    async () => {
      if (!risk) return errorReply({ error: 'indices indisponibles' });
      return reply({
        snapshot: risk.snapshot ?? null,
        generated: risk.generated ?? null,
        indices: risk.indices ?? {},
        confluence: risk.confluence ?? null,
        source: SITE + '/api/',
      });
    }
  );

  server.registerTool(
    'get_signal_history',
    {
      description:
        "Renvoie les observations datées des séries l0g, leur identité citable, leur version méthodologique, " +
        "les changements de niveau, l'état courant des scores et la confluence 13FLOW.",
      inputSchema: {
        key: z.enum(['us', 'eu', 'yen', 'energie', 'debt']).optional().describe('Signal optionnel : us, eu, yen, energie ou debt.'),
        limit: z.number().int().min(1).max(500).default(100).describe("Nombre maximum d'observations et d'événements retournés."),
      },
      outputSchema: SignalHistoryOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ key, limit }) => {
      const history = signalHistory || {};
      const historyCurrent = history.current && typeof history.current === 'object' ? history.current : signals;
      let observations = Array.isArray(history.observations) ? history.observations.slice() : [];
      let levelChanges = Array.isArray(history.levelChanges)
        ? history.levelChanges.slice()
        : Array.isArray(riskEvents?.events)
          ? riskEvents.events.slice()
          : [];
      if (key) {
        observations = observations.filter((item) => item.instrument === key || item.key === key);
        levelChanges = levelChanges.filter((item) => item.instrument === key || item.key === key);
      }
      observations.sort((a, b) => String(b.seriesDate || b.observedAt).localeCompare(String(a.seriesDate || a.observedAt)));
      levelChanges.sort((a, b) => String(b.observedAt || b.ts).localeCompare(String(a.observedAt || a.ts)));
      const instruments = Array.isArray(history.instruments)
        ? history.instruments.filter((item) => !key || item.key === key)
        : [];
      return reply({
        version: history.version || '2',
        generated: history.generated || null,
        updated: history.generated || riskEvents?.updated || risk?.snapshot || risk?.generated || null,
        coverage: history.coverage || {},
        filters: { key: key || null },
        instruments,
        current: key ? { [key]: historyCurrent[key] ?? null } : historyCurrent,
        observations: observations.slice(0, limit),
        levelChanges: levelChanges.slice(0, limit),
        events: levelChanges.slice(0, limit),
        policy: history.policy || {},
        confluence: {
          updated: confluence?.updated || risk?.confluence?.updated || null,
          items: (confluence?.items || []).slice(0, 20),
          summary: risk?.confluence || null,
        },
        caveat: "Les scores 0-100 sont normalisés par instrument. Utiliser seriesDate pour la publication l0g et observedAt pour la date économique amont lorsqu'elle existe.",
      });
    }
  );

  server.registerTool(
    'get_risk_diff',
    {
      description:
        "Renvoie le Risk Diff l0g : ce qui a changé dans le risque depuis 1, 7 ou 30 jours. " +
        "Inclut signaux, sources fraîches ou stale, claims, modèles, articles reliés et niveau de confiance.",
      inputSchema: {
        window: z.enum(['1d', '7d', '30d']).optional().describe('Fenêtre optionnelle : 1d, 7d ou 30d.'),
      },
      outputSchema: RiskDiffOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ window }) => {
      if (!riskDiff) return errorReply({ error: 'risk diff indisponible', url: `${SITE}/api/v1/risk-diff.json` });
      const windows = Array.isArray(riskDiff.windows) ? riskDiff.windows : [];
      if (window) {
        const selectedWindow = windows.find((item) => item.window === window);
        if (!selectedWindow) {
          return errorReply({
            error: 'fenêtre inconnue',
            requestedWindow: window,
            availableWindows: windows.map((item) => item.window),
          });
        }
        return reply({
          version: riskDiff.version,
          generated: riskDiff.generated,
          anchorDate: riskDiff.anchorDate,
          filters: { window },
          selectedWindow,
          freshness: riskDiff.freshness,
          limitations: riskDiff.limitations,
        });
      }
      return reply({
        version: riskDiff.version,
        generated: riskDiff.generated,
        anchorDate: riskDiff.anchorDate,
        filters: { window: null },
        windows,
        freshness: riskDiff.freshness,
        limitations: riskDiff.limitations,
      });
    }
  );

  server.registerTool(
    'get_black_box',
    {
      description:
        "Renvoie le Black Box Recorder l0g : frames point-in-time hashées des signaux de risque. " +
        "Avec une date, sélectionne la dernière frame publiée avant ou le jour demandé, sans reconstruction rétroactive.",
      inputSchema: {
        date: z.string().optional().describe('Date à rejouer au format YYYY-MM-DD. Si absente, renvoie la dernière frame.'),
        limitFrames: z.number().int().min(1).max(30).default(5).describe('Nombre de frames récentes à inclure quand date est absente.'),
      },
      outputSchema: BlackBoxOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ date, limitFrames }) => {
      if (!blackBox) return errorReply({ error: 'black box indisponible', url: `${SITE}/api/v1/black-box.json` });
      const frames = Array.isArray(blackBox.frames) ? blackBox.frames : [];
      const sortedFrames = [...frames].sort((a, b) => String(a.date).localeCompare(String(b.date)));
      if (date) {
        const requestedDate = String(date).trim().slice(0, 10);
        if (!/^\d{4}-\d{2}-\d{2}$/.test(requestedDate)) {
          return errorReply({ error: 'date invalide', requestedDate: date, acceptedDateFormat: 'YYYY-MM-DD' });
        }
        const frame = sortedFrames.filter((item) => String(item.date) <= requestedDate).at(-1) || null;
        return reply({
          version: blackBox.version,
          generated: blackBox.generated,
          coverage: blackBox.coverage,
          replay: blackBox.replay,
          requestedDate,
          replayable: Boolean(frame),
          frame,
          policy: blackBox.policy,
        });
      }
      const latestFrame = sortedFrames.at(-1) || null;
      return reply({
        version: blackBox.version,
        generated: blackBox.generated,
        coverage: blackBox.coverage,
        replay: blackBox.replay,
        requestedDate: null,
        latestFrame,
        frames: sortedFrames.slice(-limitFrames),
        policy: blackBox.policy,
      });
    }
  );

  server.registerTool(
    'get_openapi_schema',
    {
      description:
        "Expose le contrat OpenAPI public de l'Agent Surface l0g. Permet à un agent de découvrir les chemins, méthodes et schémas " +
        "sans récupérer tout le fichier si un résumé suffit.",
      inputSchema: {
        mode: z.enum(['summary', 'path', 'full']).default('summary').describe('summary pour index, path pour un endpoint, full pour le contrat complet.'),
        path: z.string().optional().describe('Chemin OpenAPI exact, par exemple /api/v1/claims.json, utilisé avec mode=path.'),
      },
      outputSchema: OpenapiOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ mode, path }) => {
      if (mode === 'full') return reply(openapi);
      if (mode === 'path') {
        const clean = String(path || '').trim();
        if (!clean.startsWith('/')) return errorReply({ error: 'path invalide', note: 'utiliser un chemin exact commençant par /' });
        const summary = summarizeOpenapi(openapi, clean);
        if (!summary.paths.length) return errorReply({ error: 'path inconnu', path: clean, knownPaths: Object.keys(openapi.paths || {}) });
        return reply(summary);
      }
      return reply(summarizeOpenapi(openapi));
    }
  );

  server.registerTool(
    'get_ndjson_feed',
    {
      description:
        "Lit les variantes NDJSON publiques de l'Agent Surface : catalog, claims, evidenceGraph, changes ou signalHistory. " +
        "Le feed est allowlisté ; aucun chemin arbitraire n'est accepté.",
      inputSchema: {
        feed: z.enum(['catalog', 'claims', 'evidenceGraph', 'changes', 'signalHistory']).describe('Flux NDJSON à lire.'),
        recordType: z.string().optional().describe('Filtre recordType optionnel, par exemple claim, article, node, edge ou change.'),
        limit: z.number().int().min(1).max(200).default(50).describe('Nombre maximum de lignes renvoyées.'),
      },
      outputSchema: NdjsonOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ feed, recordType, limit }) => {
      const { spec, totalLines, totalMatches, records } = await readNdjsonFeed(dataDir, feed, limit, recordType);
      return reply({
        feed,
        path: `/${spec.path}`,
        role: spec.role,
        totalLines,
        totalMatches,
        count: records.length,
        truncated: records.length < totalMatches,
        recordType: recordType || null,
        records,
      });
    }
  );

  server.registerTool(
    'get_freshness',
    {
      description:
        "Renvoie la fraîcheur du corpus l0g : derniers contenus, compteurs, endpoints disponibles et politique de fraîcheur. " +
        "À appeler avant de présenter un snapshot comme actuel.",
      inputSchema: {
        limit: z.number().int().min(1).max(20).default(10).describe('Nombre de derniers contenus à renvoyer.'),
      },
      outputSchema: FreshnessOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ limit }) => reply({
      version: freshness.version,
      generated: freshness.generated,
      latest: (freshness.latest || []).slice(0, limit),
      corpus: freshness.corpus,
      endpoints: freshness.endpoints,
      signalFreshness: freshness.signalFreshness,
      freshnessPolicy: freshness.freshnessPolicy,
    })
  );

  server.registerTool(
    'search_content',
    {
      description:
        "Recherche plein texte locale dans l0g.fr : analyses, guides, glossaire, fiches méthodologiques et sources primaires. " +
        "Par défaut, le serveur utilise l'index bilingue canonique partagé avec l'Agent Surface et WebMCP, sans fournisseur externe. " +
        "Le mode catalog conserve l'ancien scoring léger sur titre, tags, topics et description.",
      inputSchema: {
        query: z.string().min(1).max(200).describe('Termes de recherche.'),
        language: LanguageSchema.optional().describe('Langue optionnelle : fr ou en. Sans filtre, recherche bilingue.'),
        mode: z.enum(['fulltext', 'catalog']).default('fulltext').describe('fulltext pour le corps des pages, catalog pour le scoring catalogue historique.'),
        limit: z.number().int().min(1).max(10).default(5).describe('Nombre maximum de résultats.'),
      },
      outputSchema: SearchOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ query, language, mode, limit }) => {
      const tokens = norm(query).split(/\s+/).filter(Boolean);
      if (!tokens.length) return reply({ query, mode: mode || 'fulltext', count: 0, results: [] });
      if ((mode || 'fulltext') === 'fulltext') {
        const results = await searchFullText(dataDir, catalog, sharedSearchIndex, query, limit, language);
        return reply({
          query,
          language: language || null,
          mode: 'fulltext',
          backend: 'shared-agent-search-index',
          coverage: ['title', 'tags', 'topics', 'description', 'body'],
          count: results.length,
          results,
        });
      }
      const pool = [
        ...articles.map((a) => ({ ...a, type: 'article' })),
        ...guides.map((g) => ({ ...g, type: 'guide' })),
      ].filter((item) => !language || item.language === language);
      const ranked = pool
        .map((it) => ({ it, s: score(it, tokens) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s || String(b.it.date).localeCompare(String(a.it.date)))
        .slice(0, limit)
        .map((x) => ({
          type: x.it.type, title: x.it.title, url: x.it.url,
          canonicalId: x.it.canonicalId, language: x.it.language || 'fr', translationStatus: x.it.translationStatus,
          date: x.it.date, description: x.it.description, score: x.s,
        }));
      return reply({
        query,
        language: language || null,
        mode: 'catalog',
        backend: 'catalog-weighted-lexical',
        coverage: ['title', 'tags', 'topics', 'description'],
        count: ranked.length,
        results: ranked,
      });
    }
  );

  server.registerTool(
    'build_research_pack',
    {
      description:
        "Compose en un appel un paquet de recherche déterministe : documents classés, claims canoniques, sources primaires, " +
        "liens claim -> preuve, fraîcheur, Risk Diff, éléments adverses, limites et URLs citables. Ne produit aucune opinion d’investissement.",
      inputSchema: {
        query: z.string().min(2).max(200).describe('Question ou thème de recherche.'),
        language: LanguageSchema.describe('Langue des documents recherchés : fr ou en.'),
        asOf: z.string().optional().describe('Date point-in-time optionnelle au format YYYY-MM-DD.'),
        riskWindow: z.enum(['1d', '7d', '30d']).default('7d').describe('Fenêtre Risk Diff.'),
        limit: z.number().int().min(1).max(10).default(5).describe('Nombre maximum de documents.'),
      },
      outputSchema: ResearchPackOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ query, language, asOf, riskWindow, limit }) => {
      const requestedAsOf = asOf ? String(asOf).trim() : null;
      if (requestedAsOf && !/^\d{4}-\d{2}-\d{2}$/.test(requestedAsOf)) {
        return errorReply({ error: 'asOf invalide', acceptedDateFormat: 'YYYY-MM-DD' });
      }
      const queryTokens = tokensOf(query);
      const searched = await searchFullText(dataDir, catalog, sharedSearchIndex, query, Math.min(10, limit * 2), language);
      const minimumMatchedTerms = Math.min(queryTokens.length, Math.max(2, Math.ceil(queryTokens.length * 0.6)));
      const supported = searched.filter((document) => (document.matchedTerms || []).length >= minimumMatchedTerms);
      const documents = supported
        .filter((document) => !requestedAsOf || !document.date || String(document.date).slice(0, 10) <= requestedAsOf)
        .slice(0, limit);
      const canonicalArticleSlugs = new Set(documents
        .filter((document) => document.type === 'article' && String(document.canonicalId || '').startsWith('article:'))
        .map((document) => String(document.canonicalId).slice('article:'.length)));
      const rankedClaims = claimsList
        .filter((claim) => canonicalArticleSlugs.has(claim.articleSlug))
        .map((claim) => {
          const text = norm(`${claim.claim} ${claim.articleTitle}`);
          const relevance = queryTokens.reduce((total, token) => total + (text.includes(token) ? 1 : 0), 0);
          return { claim, relevance };
        })
        .sort((a, b) => b.relevance - a.relevance || String(a.claim.id).localeCompare(String(b.claim.id)))
        .slice(0, Math.min(30, Math.max(limit * 4, limit)))
        .map(({ claim }) => compactClaim(claim));
      const referenceMap = new Map();
      for (const claim of rankedClaims) {
        for (const reference of claim.references || []) {
          if (reference.href && !referenceMap.has(reference.href)) referenceMap.set(reference.href, reference);
        }
      }
      const referenceHostsUsed = new Set([...referenceMap.values()].map((reference) => reference.host || hostFromUrl(reference.href)).filter(Boolean));
      const selectedPrimarySources = primarySources.filter((source) => {
        const sourceHost = hostFromUrl(source.officialUrl);
        return [...referenceHostsUsed].some((host) => host === sourceHost || host.endsWith(`.${sourceHost}`));
      });
      const claimEvidence = rankedClaims.map((claim) => ({
        claimId: claim.id,
        claimResource: `l0g://claims/${encodeURIComponent(claim.id)}`,
        evidenceTool: { name: 'get_claim_evidence', arguments: { claimId: claim.id } },
        articleUrl: claim.articleUrl,
        references: (claim.references || []).map((reference) => reference.href),
      }));
      const selectedRiskWindow = (riskDiff?.windows || []).find((item) => item.window === riskWindow) || null;
      const archiveFrames = Array.isArray(blackBox?.frames) ? [...blackBox.frames].sort((a, b) => String(a.date).localeCompare(String(b.date))) : [];
      const selectedFrame = requestedAsOf ? archiveFrames.filter((frame) => String(frame.date) <= requestedAsOf).at(-1) || null : archiveFrames.at(-1) || null;
      const adversePattern = /\b(?:risque|baisse|contraction|stress|dégradation|degradation|incertitude|inversement|adverse|downside|decline|contraction|uncertainty|contradiction|counterpoint)\b/iu;
      const adversarialFindings = rankedClaims
        .filter((claim) => ['inférence', 'scénario'].includes(claim.kind) || adversePattern.test(claim.claim))
        .slice(0, 10)
        .map((claim) => ({
          claimId: claim.id,
          kind: claim.kind,
          text: claim.claim,
          status: 'candidate-not-verified-contradiction',
          basis: ['inférence', 'scénario'].includes(claim.kind) ? 'claim prospective ou inférentielle' : 'marqueur lexical adverse',
        }));
      const knownLimitations = [
        'Composition déterministe de surfaces existantes ; aucune opinion ni recommandation d’investissement.',
        'Les claims anglaises ne sont pas dupliquées : les documents EN pointent vers les claims canoniques françaises.',
        'Les éléments adverses sont des candidats lexicaux ou typés, pas des contradictions validées automatiquement.',
        ...(riskDiff?.limitations || []),
      ];
      if (requestedAsOf && !selectedFrame) knownLimitations.push('Aucune frame Black Box archivée avant asOf : le paquet est filtré par date mais ne constitue pas un replay point-in-time probant.');
      if (requestedAsOf && selectedFrame) knownLimitations.push('La frame asOf atteste les hashes et l’état Black Box archivés ; les documents et claims renvoyés restent le corpus courant filtré par date, pas une copie historique de leurs octets.');
      const citationUrls = [...new Set([
        ...documents.map((document) => document.url),
        ...rankedClaims.map((claim) => claim.articleUrl),
        ...referenceMap.keys(),
        ...selectedPrimarySources.map((source) => source.officialUrl),
      ].filter(Boolean))];
      return reply({
        version: '1', query, language,
        parameters: { asOf: requestedAsOf, riskWindow, limit },
        asOf: {
          requested: requestedAsOf,
          replayable: requestedAsOf ? Boolean(selectedFrame) : null,
          scope: requestedAsOf ? 'black-box-frame-only' : null,
          frameId: selectedFrame?.frameId || null,
          frameHash: selectedFrame?.frameHash || null,
          archiveStartDate: blackBox?.replay?.archiveStartDate || null,
        },
        documents,
        claims: rankedClaims,
        primarySources: selectedPrimarySources,
        claimEvidence,
        freshness: {
          generated: freshness.generated,
          corpus: freshness.corpus,
          signalFreshness: freshness.signalFreshness,
          translations: documents.filter((document) => document.language === 'en').map((document) => ({ canonicalId: document.canonicalId, status: document.translationStatus })),
        },
        riskDiff: selectedRiskWindow ? { anchorDate: riskDiff.anchorDate, window: selectedRiskWindow, freshness: riskDiff.freshness } : null,
        adversarialFindings,
        knownLimitations,
        citationUrls,
      });
    }
  );


  server.registerTool(
    'get_claims',
    {
      description:
        "Interroge les relations affirmation-source extraites des articles l0g. Filtrage par article, type de claim " +
        "(fait, estimation, inférence, scénario, assertion non classée) et texte. Renvoie les références cliquables, datées quand détectable.",
      inputSchema: {
        articleSlug: z.string().optional().describe("Slug d'article optionnel."),
        language: LanguageSchema.optional().describe('Langue du slug fourni. Une claim reste canonique en français.'),
        kind: ClaimKindSchema.optional().describe('Type de claim optionnel.'),
        query: z.string().optional().describe('Filtre texte optionnel dans la claim ou le titre article.'),
        limit: z.number().int().min(1).max(50).default(10).describe('Nombre maximum de claims.'),
      },
      outputSchema: ClaimsOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ articleSlug, language, kind, query, limit }) => {
      let list = claims.claims || [];
      if (articleSlug) {
        const record = resolveCatalogDocument(articleSlug, 'article', language);
        const clean = record?.evidenceRef?.articleSlug || cleanSlug(articleSlug);
        list = list.filter((claim) => claim.articleSlug === clean);
      }
      if (kind) list = list.filter((claim) => claim.kind === kind);
      if (query) {
        const tokens = norm(query).split(/\s+/).filter(Boolean);
        list = list.filter((claim) => tokens.every((tok) => norm(`${claim.claim} ${claim.articleTitle}`).includes(tok)));
      }
      list = list.slice(0, limit).map(compactClaim);
      return reply({
        version: claims.version,
        count: list.length,
        filters: { articleSlug: articleSlug || null, language: language || null, kind: kind || null, query: query || null },
        claimKinds,
        claims: list,
        policy: claims.policy,
      });
    }
  );

  server.registerTool(
    'get_claim',
    {
      description:
        "Renvoie une claim précise par identifiant, avec ses références cliquables, datées quand détectable. " +
        "Utiliser list_article_claims ou get_claims pour découvrir les identifiants.",
      inputSchema: {
        claimId: z.string().min(1).describe("Identifiant de claim, par exemple dollar-yen-intervention-risque-carry-2026:claim-a1b2c3d4e5f6a7."),
      },
      outputSchema: ClaimOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ claimId }) => {
      const { id, claim } = findClaimById(claimId);
      if (!claim) return errorReply({ error: 'claim inconnue', claimId: id });
      return reply({
        claimId: id,
        claim: compactClaim(claim),
        resource: `l0g://claims/${encodeURIComponent(id)}`,
        articleResource: `l0g://articles/${encodeURIComponent(claim.articleSlug)}`,
        evidenceTool: { name: 'get_claim_evidence', arguments: { claimId: id } },
      });
    }
  );

  server.registerTool(
    'get_claim_evidence',
    {
      description:
        "Renvoie la preuve d'une claim : affirmation, type, références, profondeur de preuve et voisinage du graphe " +
        "article -> claim -> référence -> source. Les contenus reliés par hôte/source commune sont séparés de la preuve directe.",
      inputSchema: {
        claimId: z.string().min(1).describe("Identifiant de claim."),
        limit: z.number().int().min(10).max(160).default(80).describe('Nombre maximum de nœuds dans le voisinage de preuve.'),
      },
      outputSchema: ClaimEvidenceOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ claimId, limit }) => {
      const { id, claim } = findClaimById(claimId);
      if (!claim) return errorReply({ error: 'claim inconnue', claimId: id });
      const direct = directEvidenceForClaims([`claim:${id}`], limit);
      const related = relatedContentForAnchors(direct.anchors, limit);
      return reply({
        claimId: id,
        claim: compactClaim(claim),
        evidence: proofDepthForClaim(claim),
        references: (claim.references || []).map((reference) => ({
          label: reference.label,
          href: reference.href,
          host: reference.host,
          kind: reference.kind,
          date: reference.date,
          dateLabel: reference.dateLabel,
          sourcePublicationDate: reference.sourcePublicationDate,
          sourcePublicationDateLabel: reference.sourcePublicationDateLabel,
          retrievedAt: reference.retrievedAt,
          indexedAt: reference.indexedAt,
          })),
        returned: {
          directEvidence: direct.section.returned,
          relatedContent: related.returned,
        },
        directEvidence: direct.section,
        relatedContent: related,
        nodes: direct.section.nodes,
        edges: direct.section.edges,
      });
    }
  );

  server.registerTool(
    'list_article_claims',
    {
      description:
        "Liste les claims d'un article donné, avec filtrage optionnel par type. " +
        "C'est le chemin recommandé pour passer d'un article à ses affirmations vérifiables.",
      inputSchema: {
        articleSlug: z.string().min(1).describe("Slug d'article."),
        language: LanguageSchema.optional().describe('Langue du slug fourni. Les claims renvoyées restent canoniques en français.'),
        kind: ClaimKindSchema.optional().describe('Type de claim optionnel.'),
        limit: z.number().int().min(1).max(100).default(50).describe('Nombre maximum de claims.'),
      },
      outputSchema: ArticleClaimsOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ articleSlug, language, kind, limit }) => {
      const article = resolveCatalogDocument(articleSlug, 'article', language);
      const slug = article?.evidenceRef?.articleSlug || cleanSlug(articleSlug);
      if (!article) return errorReply({ error: 'article inconnu', articleSlug: slug });
      let list = claimsList.filter((claim) => claim.articleSlug === slug);
      if (kind) list = list.filter((claim) => claim.kind === kind);
      list = list.slice(0, limit).map(compactClaim);
      return reply({
        articleSlug: slug,
        article,
        count: list.length,
        filters: { language: language || null, kind: kind || null },
        claims: list,
        resources: list.map((claim) => `l0g://claims/${encodeURIComponent(claim.id)}`),
      });
    }
  );

  server.registerTool(
    'find_claims_by_source',
    {
      description:
        "Trouve les claims liées à une source primaire ou à un hôte cité. Accepte un slug de source l0g " +
        "(ex: federal-reserve-fred), un nom ou un host (ex: fred.stlouisfed.org).",
      inputSchema: {
        sourceId: z.string().min(1).describe('Slug de source, nom ou host.'),
        kind: ClaimKindSchema.optional().describe('Type de claim optionnel.'),
        limit: z.number().int().min(1).max(100).default(20).describe('Nombre maximum de claims.'),
      },
      outputSchema: ClaimsBySourceOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ sourceId, kind, limit }) => {
      const { resolved, claims: sourceClaims } = claimsForSource(sourceId, { kind, limit });
      return reply({
        sourceId: resolved.id,
        source: resolved.source ? { type: resolved.sourceType, ...resolved.source } : null,
        count: sourceClaims.length,
        filters: { kind: kind || null },
        claims: sourceClaims,
      });
    }
  );

  server.registerTool(
    'get_source',
    {
      description:
        "Renvoie une source primaire l0g ou un hôte cité, puis les claims qui s'y rattachent. " +
        "Complète list_sources quand un agent veut auditer une institution ou un domaine précis.",
      inputSchema: {
        sourceId: z.string().min(1).describe('Slug de source, nom ou host.'),
        limit: z.number().int().min(1).max(50).default(10).describe('Nombre maximum de claims liées.'),
      },
      outputSchema: SourceOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ sourceId, limit }) => {
      const { resolved, claims: sourceClaims } = claimsForSource(sourceId, { limit });
      if (!resolved.source && !sourceClaims.length) return errorReply({ error: 'source inconnue', sourceId: resolved.id });
      return reply({
        sourceId: resolved.id,
        sourceType: resolved.sourceType || 'referenceMatch',
        source: resolved.source,
        claimsCount: sourceClaims.length,
        claims: sourceClaims,
      });
    }
  );

  server.registerTool(
    'verify_artifact',
    {
      description:
        "Vérifie un artefact Agent Surface à partir du manifeste d'intégrité publié. " +
        "Le chemin doit correspondre à un snapshot connu ; aucune lecture de chemin arbitraire n'est faite.",
      inputSchema: {
        path: z.string().min(1).describe('Chemin public, par exemple /api/v1/evidence-graph.json.'),
        sha256: z.string().optional().describe('Empreinte SHA-256 optionnelle à comparer au snapshot canonique.'),
      },
      outputSchema: VerifyArtifactOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ path, sha256 }) => {
      const cleanPath = String(path || '').trim();
      const snapshot = (integrity.snapshots || []).find((item) => item.path === cleanPath);
      if (!snapshot) {
        return reply({
          error: 'artefact inconnu',
          path: cleanPath,
          knownPaths: (integrity.snapshots || []).map((item) => item.path),
        });
      }
      const expected = String(snapshot.canonicalSha256 || '').toLowerCase();
      const provided = sha256 ? String(sha256).trim().toLowerCase() : null;
      return reply({
        path: cleanPath,
        verified: provided ? provided === expected : null,
        algorithm: integrity.algorithm,
        expectedSha256: expected,
        providedSha256: provided,
        snapshot: compactSnapshot(snapshot),
        canonicalization: integrity.canonicalization,
        verification: integrity.verification,
      });
    }
  );

  server.registerTool(
    'get_changes',
    {
      description:
        "Interroge le changefeed machine avec filtres de type, slug et date minimale. " +
        "Inclut objectId, version/hash courant, statut de diff et type de changement sémantique.",
      inputSchema: {
        contentType: z.enum(['article', 'guide', 'policy']).optional().describe('Type de contenu optionnel.'),
        slug: z.string().optional().describe('Slug optionnel pour cibler un contenu.'),
        since: z.string().optional().describe('Date ISO optionnelle, incluse, par exemple 2026-06-27.'),
        limit: z.number().int().min(1).max(100).default(20).describe("Nombre maximum d'entrées."),
      },
      outputSchema: ChangesOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ contentType, slug, since, limit }) => {
      const entries = filterChanges({ contentType, slug, since, limit });
      return reply({
        version: changes.version,
        generated: changes.generated,
        count: entries.length,
        filters: { contentType: contentType || null, slug: slug ? cleanSlug(slug) : null, since: since || null },
        feedPolicy: changes.feedPolicy,
        entries,
      });
    }
  );

  server.registerTool(
    'get_evidence_graph',
    {
      description:
        "Renvoie un sous-graphe de preuve l0g : articles, claims, références, hôtes, sources primaires et datasets. " +
        "Avec articleSlug, la preuve directe est séparée des contenus reliés par hôte/source/dataset commun.",
      inputSchema: {
        articleSlug: z.string().optional().describe("Slug d'article optionnel pour extraire son voisinage de graphe."),
        language: LanguageSchema.optional().describe('Langue du slug fourni. Le graphe de preuve reste canonique en français.'),
        nodeType: z.enum(['article', 'claim', 'reference', 'host', 'primarySource', 'dataset']).optional().describe('Type de nœud optionnel.'),
        limit: z.number().int().min(1).max(200).default(80).describe('Nombre maximum de nœuds renvoyés.'),
      },
      outputSchema: EvidenceGraphOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ articleSlug, language, nodeType, limit }) => {
      let nodes = evidenceGraph.nodes || [];
      const edges = evidenceGraph.edges || [];
      let directSection = null;
      let relatedSection = null;
      if (articleSlug) {
        const record = resolveCatalogDocument(articleSlug, 'article', language);
        const clean = record?.evidenceRef?.articleSlug || cleanSlug(articleSlug);
        const articleId = `article:${clean}`;
        const articleClaimIds = edges
          .filter((edge) => edge.type === 'contains' && edge.from === articleId)
          .map((edge) => edge.to);
        const direct = directEvidenceForClaims(articleClaimIds, limit);
        directSection = direct.section;
        relatedSection = relatedContentForAnchors(direct.anchors, limit);
        nodes = directSection.nodes;
        if (nodeType) {
          nodes = nodes.filter((node) => node.type === nodeType);
          const typedIds = new Set(nodes.map((node) => node.id));
          const typedEdges = directSection.edges.filter((edge) => typedIds.has(edge.from) && typedIds.has(edge.to));
          directSection = graphSection(
            'directEvidence',
            directSection.policy,
            nodes,
            typedEdges,
            limit
          );
        }
        const selectedIds = new Set(directSection.nodes.map((node) => node.id));
        const selectedEdges = directSection.edges.filter((edge) => selectedIds.has(edge.from) && selectedIds.has(edge.to));
        return reply({
          version: evidenceGraph.version,
          generated: evidenceGraph.generated,
          counts: evidenceGraph.counts,
          returned: {
            nodes: selectedIds.size,
            edges: selectedEdges.length,
            directEvidence: directSection.returned,
            relatedContent: relatedSection.returned,
          },
          filters: { articleSlug: clean, requestedLanguage: language || null, canonicalLanguage: 'fr', nodeType: nodeType || null },
          graphPolicy: {
            ...evidenceGraph.graphPolicy,
            traversal:
              'Le filtre articleSlug renvoie uniquement la preuve directe de l’article. Les contenus reliés par hôte/source/dataset commun sont isolés dans relatedContent.',
          },
          directEvidence: directSection,
          relatedContent: relatedSection,
          nodes: directSection.nodes.slice(0, limit),
          edges: selectedEdges,
        });
      }
      if (nodeType) nodes = nodes.filter((node) => node.type === nodeType);
      const candidateIds = new Set(nodes.map((node) => node.id));
      const candidateEdges = edges.filter((edge) => candidateIds.has(edge.from) && candidateIds.has(edge.to));
      let selectedEdges = [];
      let selectedIds = new Set();
      if (!nodeType && candidateEdges.length) {
        const articleId = articleSlug
          ? `article:${String(articleSlug).trim().replace(/^https?:\/\/[^/]+/i, '').replace(/^\/+|\/+$/g, '').replace(/^posts\//, '')}`
          : null;
        const rank = (edge) => {
          if (articleId && (edge.from === articleId || edge.to === articleId)) return 0;
          if (edge.type === 'contains') return 1;
          if (edge.type === 'cites') return 2;
          if (edge.type === 'hostedBy') return 3;
          if (edge.type === 'matchesPrimarySource') return 4;
          return 5;
        };
        for (const edge of [...candidateEdges].sort((a, b) => rank(a) - rank(b))) {
          const next = new Set(selectedIds);
          next.add(edge.from);
          next.add(edge.to);
          if (next.size > limit && selectedEdges.length > 0) continue;
          selectedIds = next;
          selectedEdges.push(edge);
          if (selectedIds.size >= limit) break;
        }
        nodes = nodes.filter((node) => selectedIds.has(node.id));
      } else {
        selectedIds = new Set(nodes.slice(0, limit).map((node) => node.id));
        selectedEdges = candidateEdges.filter((edge) => selectedIds.has(edge.from) && selectedIds.has(edge.to));
        nodes = nodes.slice(0, limit);
      }
      selectedEdges = selectedEdges.slice(0, Math.max(limit * 3, 20));
      return reply({
        version: evidenceGraph.version,
        generated: evidenceGraph.generated,
        counts: evidenceGraph.counts,
        returned: { nodes: selectedIds.size, edges: selectedEdges.length },
        filters: { articleSlug: articleSlug || null, nodeType: nodeType || null },
        graphPolicy: evidenceGraph.graphPolicy,
        nodes: nodes.slice(0, limit),
        edges: selectedEdges,
      });
    }
  );

  server.registerTool(
    'list_sources',
    {
      description:
        "Liste les sources primaires institutionnelles suivies par l0g et les hôtes effectivement cités par les claims. " +
        "Utile pour auditer l'origine des preuves.",
      inputSchema: {
        mode: z.enum(['primary', 'hosts', 'both']).default('both').describe('Type de sources à renvoyer.'),
        limit: z.number().int().min(1).max(100).default(30).describe('Nombre maximum de sources ou hôtes.'),
      },
      outputSchema: SourcesOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ mode, limit }) => reply({
      version: sources.version,
      counts: sources.counts,
      sourcePolicy: sources.sourcePolicy,
      primarySources: mode === 'hosts' ? [] : (sources.primarySources || []).slice(0, limit),
      referenceHosts: mode === 'primary' ? [] : (sources.referenceHosts || []).slice(0, limit),
    })
  );

  server.registerTool(
    'get_integrity',
    {
      description:
        "Renvoie les empreintes SHA-256 canoniques des surfaces Agent Surface, JSON et NDJSON. " +
        "Utile pour vérifier qu'un agent a ingéré un snapshot précis.",
      inputSchema: {
        path: z.string().optional().describe('Chemin optionnel, par exemple /api/v1/claims.ndjson.'),
      },
      outputSchema: IntegrityOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ path }) => {
      let snapshots = integrity.snapshots || [];
      if (path) snapshots = snapshots.filter((snapshot) => snapshot.path === path);
      return reply({
        version: integrity.version,
        generated: integrity.generated,
        algorithm: integrity.algorithm,
        canonicalization: integrity.canonicalization,
        count: snapshots.length,
        snapshots: snapshots.map(compactSnapshot),
        verification: integrity.verification,
      });
    }
  );

  server.registerTool(
    'get_changefeed',
    {
      description:
        "Renvoie les dernières publications, révisions et politiques avec objectId, version/hash courant, statut de diff et changement sémantique. " +
        "À utiliser pour surveiller le corpus sans tout rescanner.",
      inputSchema: {
        contentType: z.enum(['article', 'guide', 'policy']).optional().describe('Type de contenu optionnel.'),
        limit: z.number().int().min(1).max(100).default(20).describe("Nombre maximum d'entrées."),
      },
      outputSchema: ChangefeedOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ contentType, limit }) => {
      let entries = changes.entries || [];
      if (contentType) entries = entries.filter((entry) => entry.contentType === contentType);
      entries = entries.slice(0, limit);
      return reply({
        version: changes.version,
        generated: changes.generated,
        count: entries.length,
        feedPolicy: changes.feedPolicy,
        entries,
      });
    }
  );

  server.registerTool(
    'list_recent_analyses',
    {
      description:
        "Liste les analyses (articles) les plus récentes de l0g.fr, de la plus récente à la plus ancienne, " +
        "avec titre, URL, date, description et thèmes.",
      inputSchema: {
        language: LanguageSchema.optional().describe('Langue optionnelle : fr ou en. Sans filtre, liste bilingue.'),
        limit: z.number().int().min(1).max(20).default(5).describe("Nombre d'analyses à renvoyer."),
      },
      outputSchema: AnalysisListOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ language, limit }) => {
      const list = articles.filter((a) => !language || a.language === language).slice(0, limit).map((a) => ({
        canonicalId: a.canonicalId, language: a.language, translationStatus: a.translationStatus,
        title: a.title, url: a.url, date: a.date, description: a.description, tags: a.tags,
      }));
      return reply({ language: language || null, count: list.length, analyses: list });
    }
  );

  server.registerTool(
    'list_guides',
    {
      description:
        "Liste les guides de référence de l0g.fr (pages piliers durables : 13F, Form 4, GENIUS Act, OFAC, MiCA...), " +
        "avec titre, URL, description et résumé définitionnel.",
      inputSchema: {
        language: LanguageSchema.optional().describe('Langue optionnelle : fr ou en. Sans filtre, liste bilingue.'),
      },
      outputSchema: GuideListOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ language }) => {
      const list = guides.filter((g) => !language || g.language === language).map((g) => ({
        canonicalId: g.canonicalId, language: g.language, translationStatus: g.translationStatus,
        title: g.title, url: g.url, date: g.date, description: g.description, summary: g.summary, tags: g.tags,
      }));
      return reply({ language: language || null, count: list.length, guides: list });
    }
  );

  server.registerTool(
    'search_by_topic',
    {
      description:
        "Liste les analyses rattachées à un sujet (hub thématique) de l0g.fr. Sujets disponibles (slug : libellé) : " +
        topicsList.map((t) => `${t.slug} : ${t.label}`).join(' ; ') + ". Accepte le slug ou un libellé approchant.",
      inputSchema: {
        topic: z.string().describe('Slug ou libellé du sujet.'),
        language: LanguageSchema.optional().describe('Langue optionnelle : fr ou en. Sans filtre, recherche bilingue.'),
        limit: z.number().int().min(1).max(20).default(10).describe("Nombre maximum d'analyses."),
      },
      outputSchema: TopicOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ topic, language, limit }) => {
      const raw = norm(topic);
      if (!raw) return errorReply({ error: 'sujet vide', topics: topicsList });
      let match = topicsList.find((t) => t.slug === raw);
      if (!match) match = topicsList.find((t) => norm(t.label).includes(raw) || t.slug.includes(raw) || raw.includes(t.slug));
      if (!match) return errorReply({ error: 'sujet inconnu', requested: topic, topics: topicsList });
      const list = articles
        .filter((a) => (!language || a.language === language) && (a.topics || []).includes(match.slug))
        .slice(0, limit)
        .map((a) => ({ canonicalId: a.canonicalId, language: a.language, translationStatus: a.translationStatus, title: a.title, url: a.url, date: a.date, description: a.description }));
      return reply({ topic: match.slug, label: match.label, language: language || null, count: list.length, analyses: list });
    }
  );

  server.registerTool(
    'get_article',
    {
      description:
        "Renvoie le texte d'une analyse ou d'un guide l0g à partir de son slug. " +
        "Le résultat est paginable par offset/length et expose nextOffset pour récupérer la suite. " +
        "Utiliser section=tail ou section=sources pour atteindre rapidement conclusion, limites, méthodologie et sources. " +
        "Pour lire le document complet comme objet, utiliser aussi la ressource l0g://articles/{slug} ou l0g://guides/{slug}.",
      inputSchema: {
        slug: z.string().min(1).describe("Slug de l'article ou du guide."),
        language: LanguageSchema.optional().describe('Langue optionnelle : fr ou en. Une URL /en/... permet aussi de l’inférer.'),
        offset: z.number().int().min(0).default(0).describe('Position de départ en caractères pour paginer le texte.'),
        cursor: z.string().optional().describe('Curseur opaque nextCursor renvoyé par un appel précédent.'),
        limit: z.number().int().min(1000).max(50000).optional().describe('Alias de length, recommandé pour les clients agents.'),
        length: z.number().int().min(1000).max(50000).default(16000).describe('Longueur maximale du segment renvoyé.'),
        section: z.enum(['body', 'head', 'tail', 'sources']).default('body').describe('Section pratique : body avec offset, head, tail ou sources.'),
      },
      outputSchema: ArticleOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ slug, language, offset, cursor, limit, length, section: requestedSection }) => {
      const clean = cleanSlug(slug);
      const record = resolveCatalogDocument(slug, null, language);
      if (!record) return errorReply({ error: 'slug inconnu', slug: clean, language: language || null });
      const type = guides.includes(record) ? 'guide' : 'article';
      try {
        const document = await readDocument(record.slug, type, {
          language: record.language || language || 'fr',
          offset,
          cursor,
          limit: limit ?? length,
          section: requestedSection || 'body',
        });
        return reply({
          slug: document.slug,
          canonicalId: document.canonicalId,
          language: document.language,
          translationStatus: document.translationStatus,
          type,
          url: document.url,
          title: document.title,
          words: document.words,
          totalWords: document.totalWords,
          totalChars: document.totalChars,
          textChars: document.textChars,
          offset: document.offset,
          limit: document.limit,
          length: document.length,
          nextOffset: document.nextOffset,
          nextCursor: document.nextCursor,
          hasMore: document.hasMore,
          section: document.section,
          sectionFound: document.sectionFound,
          truncated: document.truncated,
          text: document.text,
          references: document.references,
        });
      } catch {
        return errorReply({ error: 'contenu introuvable', slug: clean, language: record.language, url: record.url });
      }
    }
  );

  removeLiveNotificationCapabilities(server);
  return server;
}

// --- validation de sécurité (Host + Origin) ---
function hostAllowed(req) {
  let host = String(req.headers.host || '')
    .trim()
    .toLowerCase()
    .replace(/\.+$/, '');
  const ipv6Match = host.match(/^\[(.+)\](?::\d+)?$/);
  host = ipv6Match ? ipv6Match[1] : host.split(':')[0];
  return ALLOWED_HOSTS.has(host);
}
function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // clients natifs : pas d'Origin
  try {
    const normalized = new URL(String(origin)).origin.toLowerCase();
    return ALLOWED_ORIGINS.has(normalized);
  } catch {
    return false;
  }
}

function send(res, code, obj, extraHeaders = {}) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { ...SECURE_HEADERS, ...extraHeaders, 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

function rateLimitHeaders() {
  return {
    'Retry-After': String(MCP_RATE_WINDOW_SECONDS),
    'X-RateLimit-Limit': String(RATE_MAX),
    'X-RateLimit-Window': `${MCP_RATE_WINDOW_SECONDS}s`,
  };
}

// --- serveur HTTP ---
const httpServer = http.createServer(async (req, res) => {
  let url;
  try {
    url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  } catch {
    return send(res, 400, { error: 'requête invalide' });
  }
  const acceptHeader = req.headers.accept;
  if (typeof acceptHeader === 'undefined' || !/text\/event-stream/i.test(acceptHeader) || !/application\/json/i.test(acceptHeader)) {
    req.headers.accept = `${acceptHeader ? `${acceptHeader}, ` : ''}application/json, text/event-stream`;
  }

  // sonde de santé
  if (req.method === 'GET' && url.pathname === '/healthz') {
    try {
      const data = await loadData();
      return send(res, 200, {
        ok: true,
        server: MCP_SERVER_INFO,
        agentSurface: {
          version: data.agent?.version || null,
          generated: data.agent?.generated || null,
        },
        data: {
          freshnessVersion: data.freshness?.version || null,
          freshnessGenerated: data.freshness?.generated || null,
          claimsVersion: data.claims?.version || null,
          claimsGenerated: data.claims?.generated || null,
        },
        usage: usageStore.status(),
      });
    } catch (error) {
      console.error('[l0g-mcp] healthz failed', error);
      return send(res, 503, {
        ok: false,
        server: MCP_SERVER_INFO,
        error: 'service indisponible',
      });
    }
  }

  const usageEndpoint = `${MCP_PATH.replace(/\/$/, '')}/usage`;
  if (url.pathname !== MCP_PATH && url.pathname !== usageEndpoint) return send(res, 404, { error: 'not found' });
  if (!hostAllowed(req)) return send(res, 421, { error: 'host non autorisé' });
  if (!originAllowed(req)) return send(res, 403, { error: 'origin non autorisée' });

  if (url.pathname === usageEndpoint) {
    if (req.method !== 'GET') return send(res, 405, { error: 'method not allowed' }, { Allow: 'GET' });
    try {
      return send(res, 200, await usageStore.publicReport(), {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      });
    } catch (error) {
      console.error('[l0g-mcp] usage report failed', error?.message || error);
      return send(res, 503, { error: 'usage report unavailable' });
    }
  }

  const contentLength = Number(req.headers['content-length']);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY) {
    return send(res, 413, { error: 'payload too large' });
  }

  // Streamable HTTP stateless : seul POST est utile (pas de flux serveur en mode JSON).
  if (req.method === 'GET' || req.method === 'DELETE') {
    return send(res, 405, { jsonrpc: '2.0', error: { code: -32000, message: 'Method Not Allowed' }, id: null }, { Allow: 'POST' });
  }
  if (req.method !== 'POST') return send(res, 405, { error: 'method not allowed' }, { Allow: 'POST' });
  if (rateLimited(clientIp(req))) {
    return send(res, 429, {
      error: 'too many requests',
      retryAfter: MCP_RATE_WINDOW_SECONDS,
      limitPerMinute: RATE_MAX,
    }, rateLimitHeaders());
  }
  const contentType = req.headers['content-type'];
  if (!contentType || !/^application\/json\b/i.test(String(contentType))) {
    return send(res, 415, { error: 'unsupported content type' });
  }

  // lecture du corps, bornée
  const chunks = [];
  let rawBytes = 0;
  let tooBig = false;
  req.on('data', (c) => {
    const chunk = Buffer.isBuffer(c) ? c : Buffer.from(c);
    rawBytes += chunk.length;
    chunks.push(chunk);
    if (rawBytes > MAX_BODY) { tooBig = true; req.destroy(); }
  });
  req.on('end', async () => {
    if (tooBig) return send(res, 413, { error: 'payload too large' });
    let body;
    try {
      const raw = Buffer.concat(chunks).toString('utf8');
      body = raw ? JSON.parse(raw) : undefined;
    } catch {
      return send(res, 400, { jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' }, id: null });
    }
    try {
      const data = await loadData();
      const server = buildServer(data);
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless
        enableJsonResponse: true, // réponse JSON, pas de SSE
      });
      res.on('close', () => { transport.close(); server.close(); });
      res.on('finish', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) usageStore.recordRpc(body);
      });
      await server.connect(transport);
      await transport.handleRequest(req, res, body);
    } catch (e) {
      console.error('[l0g-mcp] streamable request failed', e);
      if (!res.headersSent) send(res, 500, { jsonrpc: '2.0', error: { code: -32603, message: 'internal error' }, id: null });
    }
  });
});

httpServer.listen(PORT, HOST, () => {
  httpServer.maxHeadersCount = MCP_MAX_HEADERS_COUNT;
  httpServer.headersTimeout = MCP_HEADER_TIMEOUT;
  httpServer.requestTimeout = MCP_REQUEST_TIMEOUT;
  httpServer.keepAliveTimeout = MCP_KEEP_ALIVE_TIMEOUT;
  console.error(`[l0g-mcp] écoute sur http://${HOST}:${PORT}${MCP_PATH} — données : ${DATA_DIR}`);
});

let shuttingDown = false;
async function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  const deadline = setTimeout(() => process.exit(1), 5_000);
  deadline.unref();
  try {
    await new Promise((resolve, reject) => {
      httpServer.close((error) => error ? reject(error) : resolve());
    });
    await usageStore.flush();
    clearTimeout(deadline);
  } catch (error) {
    console.error(`[l0g-mcp] arrêt ${signal} incomplet`, error?.message || error);
    process.exitCode = 1;
  }
}

process.once('SIGINT', () => void shutdown('SIGINT'));
process.once('SIGTERM', () => void shutdown('SIGTERM'));
