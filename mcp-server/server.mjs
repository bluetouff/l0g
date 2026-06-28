/**
 * Serveur MCP de l0g.fr — lecture seule, transport Streamable HTTP (stateless, JSON).
 *
 * Spec : Model Context Protocol 2025-11-25, transport Streamable HTTP (remplace SSE).
 * SDK  : @modelcontextprotocol/sdk (McpServer + StreamableHTTPServerTransport).
 *
 * Sécurité :
 *   - écoute en 127.0.0.1 uniquement, exposé par Apache en HTTPS.
 *   - valide l'en-tête Host et l'Origin (anti DNS rebinding, exigé par la spec).
 *   - lecture seule : aucune écriture, slugs en allowlist, taille de corps bornée.
 *   - un serveur + un transport neufs par requête (mode stateless, isolation).
 *
 * Données : lues sur le disque, dans le site déjà déployé (Agent Surface + risk.json
 * générés au build), avec un petit cache TTL. Le texte complet d'un article est
 * extrait à la demande depuis le HTML construit.
 */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { ErrorCode, McpError } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { parse as parseHtml } from 'node-html-parser';

// --- configuration (variables d'environnement, valeurs par défaut sûres) ---
const HOST = process.env.MCP_HOST || '127.0.0.1';
const PORT = parseInt(process.env.MCP_PORT || '8848', 10);
const MCP_PATH = process.env.MCP_PATH || '/mcp';
const DATA_DIR = process.env.L0G_DATA_DIR || '/var/www/html/l0g/current';
const SITE = (process.env.L0G_SITE || 'https://l0g.fr').replace(/\/$/, '');
const ALLOWED_HOSTS = (process.env.MCP_ALLOWED_HOSTS || 'l0g.fr,127.0.0.1,localhost')
  .split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
const ALLOWED_ORIGINS = (process.env.MCP_ALLOWED_ORIGINS || 'https://l0g.fr')
  .split(',').map((s) => s.trim()).filter(Boolean);
const MAX_BODY = 1024 * 1024; // 1 Mo
const CACHE_TTL = 60_000; // 60 s
const RATE_MAX = parseInt(process.env.MCP_RATE_MAX || '120', 10); // requêtes / minute / IP
const RATE_WIN = 60_000;
const MCP_VERSION = '1.11.3';
const NDJSON_FEEDS = {
  catalog: { path: 'api/v1/catalog.ndjson', role: 'catalogue complet pour ingestion RAG' },
  claims: { path: 'api/v1/claims.ndjson', role: 'claims typées avec références embarquées' },
  evidenceGraph: { path: 'api/v1/evidence-graph.ndjson', role: 'evidence graph en nœuds et arêtes ligne à ligne' },
  changes: { path: 'api/v1/changes.ndjson', role: 'changefeed machine incrémental' },
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
  // Derriere un unique proxy de confiance (Apache), la vraie IP cliente est la
  // DERNIERE entree de X-Forwarded-For, celle ajoutee par Apache. Prendre la
  // premiere serait spoofable par le client pour contourner le rate-limit.
  const xff = req.headers['x-forwarded-for'];
  if (xff) {
    const parts = String(xff).split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return req.socket.remoteAddress || 'unknown';
}
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of buckets) if (now - v.start >= RATE_WIN) buckets.delete(k);
}, 5 * RATE_WIN).unref();

// --- cache des données du site ---
let cache = {
  at: 0,
  agent: null,
  openapi: null,
  catalog: null,
  claims: null,
  sources: null,
  freshness: null,
  integrity: null,
  changes: null,
  evidenceGraph: null,
  risk: null,
  riskEvents: null,
  confluence: null,
};
let searchIndexCache = {
  at: 0,
  dataDir: null,
  index: null,
};
async function readJson(rel) {
  return JSON.parse(await readFile(join(DATA_DIR, rel), 'utf-8'));
}
async function readText(rel) {
  return readFile(join(DATA_DIR, rel), 'utf-8');
}
async function loadData() {
  const now = Date.now();
  if (cache.catalog && now - cache.at < CACHE_TTL) return cache;
  const agent = await readJson('agents.json');
  const openapi = await readJson('openapi.json');
  const catalog = await readJson('api/v1/catalog.json');
  const claims = await readJson('api/v1/claims.json');
  const sources = await readJson('api/v1/sources.json');
  const freshness = await readJson('api/v1/freshness.json');
  const integrity = await readJson('api/v1/integrity.json');
  const changes = await readJson('api/v1/changes.json');
  const evidenceGraph = await readJson('api/v1/evidence-graph.json');
  let risk = null;
  try {
    risk = await readJson('api/v1/risk.json');
  } catch { /* risk optionnel */ }
  let riskEvents = null;
  try {
    riskEvents = await readJson('risk-events.json');
  } catch { /* historique optionnel */ }
  let confluence = null;
  try {
    confluence = await readJson('confluence.json');
  } catch { /* confluence optionnelle */ }
  cache = { at: now, agent, openapi, catalog, claims, sources, freshness, integrity, changes, evidenceGraph, risk, riskEvents, confluence };
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
async function readSearchDocument(candidate) {
  let bodyText = '';
  let pageTitle = candidate.title;
  try {
    const html = await readText(candidate.rel);
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
async function buildSearchIndex(catalog) {
  const now = Date.now();
  if (searchIndexCache.index && searchIndexCache.dataDir === DATA_DIR && now - searchIndexCache.at < CACHE_TTL) {
    return searchIndexCache.index;
  }
  const candidates = [
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
    index.push(await readSearchDocument(candidate));
  }
  searchIndexCache = { at: now, dataDir: DATA_DIR, index };
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
async function searchFullText(catalog, query, limit) {
  const tokens = tokensOf(query);
  if (!tokens.length) return [];
  const queryNorm = tokens.join(' ');
  const index = await buildSearchIndex(catalog);
  return index
    .map((doc) => ({ doc, ranking: rankSearchDocument(doc, tokens, queryNorm) }))
    .filter((item) => item.ranking)
    .sort((a, b) => b.ranking.value - a.ranking.value || String(b.doc.date || '').localeCompare(String(a.doc.date || '')))
    .slice(0, limit)
    .map(({ doc, ranking }) => ({
      type: doc.type,
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
const ClaimKindSchema = z.enum(['fait', 'estimation', 'inférence', 'scénario']);
const EvidenceReferenceSchema = z.object({
  label: z.string(),
  href: z.string(),
  host: NullableString,
  kind: NullableString,
  date: NullableString,
  dateLabel: NullableString,
}).strict();
const CompactClaimSchema = z.object({
  id: z.string(),
  articleSlug: z.string(),
  articleTitle: z.string().optional(),
  articleUrl: UrlString.optional(),
  kind: ClaimKindSchema,
  claim: z.string(),
  date: NullableString,
  dateLabel: NullableString,
  confidence: z.string().optional(),
  references: z.array(EvidenceReferenceSchema),
}).strict();
const SearchResultSchema = z.object({
  type: z.enum(['article', 'guide', 'glossary', 'methodology', 'source']),
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
}).passthrough();
const RiskIndicesOutput = ToolOutput.extend({
  snapshot: z.string().nullable().optional(),
  generated: z.string().nullable().optional(),
  indices: AnyRecord.optional(),
  confluence: z.any().optional(),
  source: z.string().optional(),
}).passthrough();
const SignalHistoryOutput = ToolOutput.extend({
  updated: z.string().nullable().optional(),
  filters: AnyRecord.optional(),
  current: AnyRecord.optional(),
  events: z.array(z.any()).optional(),
  confluence: AnyRecord.optional(),
  caveat: z.string().optional(),
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
  key: z.enum(['us', 'eu', 'yen', 'energie']),
  label: z.string(),
  source: z.string().url(),
  methodology: z.string().url(),
  observedAt: z.string().datetime().nullable(),
  sourcePublishedAt: z.string().datetime().nullable(),
  retrievedAt: z.string().datetime().nullable(),
  computedAt: z.string().datetime(),
  staleAfter: z.string(),
  expiresAt: z.string().datetime().nullable(),
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
  mode: z.enum(['fulltext', 'catalog']).optional(),
  backend: z.enum(['local-html-index', 'catalog-weighted-lexical']).optional(),
  coverage: z.array(z.enum(['title', 'tags', 'topics', 'description', 'body'])).optional(),
  count: z.number().optional(),
  results: z.array(SearchResultSchema).optional(),
}).strict();
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
    articleSlug: claim.articleSlug,
    articleTitle: claim.articleTitle,
    articleUrl: claim.articleUrl,
    kind: claim.kind,
    claim: claim.claim,
    date: claim.date,
    dateLabel: claim.dateLabel,
    confidence: claim.confidence,
    references: (claim.references || []).map((r) => ({
      label: r.label,
      href: r.href,
      host: r.host,
      kind: r.kind,
      date: r.date,
      dateLabel: r.dateLabel,
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
function resourceSummary(uri, name, description, mimeType = 'application/json') {
  return { uri, name, description, mimeType };
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
async function readNdjsonFeed(feed, limit, recordType) {
  const spec = NDJSON_FEEDS[feed];
  const raw = await readText(spec.path);
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
  const { agent, openapi, catalog, claims, sources, freshness, integrity, changes, evidenceGraph, risk, riskEvents, confluence } = data;
  const articles = catalog.articles || [];
  const guides = catalog.guides || [];
  const topicsList = catalog.topics || [];
  const slugs = new Set([...articles.map((a) => a.slug), ...guides.map((g) => g.slug)]);
  const claimKinds = ['fait', 'estimation', 'inférence', 'scénario'];
  const claimsList = claims.claims || [];
  const methodologies = catalog.methodologies || [];
  const primarySources = sources.primarySources || [];
  const referenceHosts = sources.referenceHosts || [];
  const signals = risk?.indices || {};

  function referencesForArticle(slug) {
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
    const clean = uriValue(slug).replace(/^https?:\/\/[^/]+/i, '').replace(/[?#].*$/, '').replace(/^\/+|\/+$/g, '').replace(/^(posts|guides)\//, '');
    const pool = type === 'guide' ? guides : articles;
    const record = pool.find((item) => item.slug === clean);
    if (!record) resourceNotFound(type, clean);
    const section = type === 'guide' ? 'guides' : 'posts';
    const html = await readFile(join(DATA_DIR, section, clean, 'index.html'), 'utf-8');
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
      references: referencesForArticle(clean),
    };
  }

  function cleanSlug(value) {
    return String(value || '').trim().replace(/^https?:\/\/[^/]+/i, '').replace(/[?#].*$/, '').replace(/^\/+|\/+$/g, '').replace(/^(posts|guides)\//, '');
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
    const linked = refs.filter((reference) => reference.href).length;
    const primary = refs.filter((reference) => norm(reference.kind).includes('primaire')).length;
    const dated = refs.filter((reference) => reference.date || reference.dateLabel).length;
    const hosts = new Set(refs.map((reference) => reference.host || hostFromUrl(reference.href)).filter(Boolean));
    let label = 'mention';
    if (primary && linked && dated) label = 'source primaire liée et datée';
    else if (linked && dated) label = 'source liée et datée';
    else if (linked) label = 'source liée';
    else if (refs.length) label = 'référence';
    return {
      proofDepth: label,
      proofDepthStatus: 'automatique',
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
      datedReferences: dated,
      primaryReferences: primary,
      uniqueHosts: hosts.size,
      claimKind: claim.kind,
      confidence: claim.confidence || null,
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

  server.registerResource(
    'article',
    new ResourceTemplate('l0g://articles/{slug}', {
      list: async () => ({
        resources: articles.map((article) => resourceSummary(
          `l0g://articles/${encodeURIComponent(article.slug)}`,
          article.title,
          article.description,
        )),
      }),
      complete: { slug: (value) => articles.map((article) => article.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    {
      title: 'Article',
      description: 'Analyse l0g lue comme document ressource paginé, avec métadonnées, références et texte.',
      mimeType: 'application/json',
    },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'article', readOptionsFromUri(uri, variables))),
  );

  server.registerResource(
    'article-page',
    new ResourceTemplate('l0g://articles/{slug}{?section,offset,limit}', {
      complete: { slug: (value) => articles.map((article) => article.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    {
      title: 'Article page',
      description: 'Page ciblée d’une analyse l0g : section, offset et limit explicites.',
      mimeType: 'application/json',
    },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'article', readOptionsFromUri(uri, variables))),
  );

  server.registerResource(
    'article-cursor',
    new ResourceTemplate('l0g://articles/{slug}{?cursor}', {
      complete: { slug: (value) => articles.map((article) => article.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    {
      title: 'Article cursor',
      description: 'Continuation opaque d’une analyse l0g via nextCursor.',
      mimeType: 'application/json',
    },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'article', readOptionsFromUri(uri, variables))),
  );

  server.registerResource(
    'guide',
    new ResourceTemplate('l0g://guides/{slug}', {
      list: async () => ({
        resources: guides.map((guide) => resourceSummary(
          `l0g://guides/${encodeURIComponent(guide.slug)}`,
          guide.title,
          guide.description,
        )),
      }),
      complete: { slug: (value) => guides.map((guide) => guide.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    {
      title: 'Guide',
      description: 'Guide de référence l0g lu comme document ressource paginé.',
      mimeType: 'application/json',
    },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'guide', readOptionsFromUri(uri, variables))),
  );

  server.registerResource(
    'guide-page',
    new ResourceTemplate('l0g://guides/{slug}{?section,offset,limit}', {
      complete: { slug: (value) => guides.map((guide) => guide.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    {
      title: 'Guide page',
      description: 'Page ciblée d’un guide l0g : section, offset et limit explicites.',
      mimeType: 'application/json',
    },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'guide', readOptionsFromUri(uri, variables))),
  );

  server.registerResource(
    'guide-cursor',
    new ResourceTemplate('l0g://guides/{slug}{?cursor}', {
      complete: { slug: (value) => guides.map((guide) => guide.slug).filter((slug) => slug.startsWith(value)).slice(0, 20) },
    }),
    {
      title: 'Guide cursor',
      description: 'Continuation opaque d’un guide l0g via nextCursor.',
      mimeType: 'application/json',
    },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'guide', readOptionsFromUri(uri, variables))),
  );

  server.registerResource(
    'claim',
    new ResourceTemplate('l0g://claims/{claim_id}', {
      list: async () => ({
        resources: claimsList.map((claim) => resourceSummary(
          `l0g://claims/${encodeURIComponent(claim.id)}`,
          claim.claim.slice(0, 90),
          `${claim.kind} · ${claim.articleTitle}`,
        )),
      }),
      complete: { claim_id: (value) => claimsList.map((claim) => claim.id).filter((id) => id.startsWith(value)).slice(0, 20) },
    }),
    {
      title: 'Claim',
      description: 'Relation affirmation-source avec références datées et cliquables.',
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
      list: async () => ({
        resources: [
          ...primarySources.map((source) => resourceSummary(
            `l0g://sources/${encodeURIComponent(source.slug)}`,
            source.shortName || source.name,
            source.description,
          )),
          ...referenceHosts.map((host) => resourceSummary(
            `l0g://sources/${encodeURIComponent(host.host)}`,
            host.host,
            `${host.references} référence(s), ${host.articles} article(s)`,
          )),
        ],
      }),
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
      list: async () => ({
        resources: Object.keys(signals).map((instrument) => resourceSummary(
          `l0g://signals/${encodeURIComponent(instrument)}/current`,
          `${instrument} current signal`,
          `Signal courant ${instrument}`,
        )),
      }),
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
      list: async () => ({
        resources: methodologies.map((methodology) => resourceSummary(
          `l0g://methodologies/${encodeURIComponent(methodology.slug)}`,
          methodology.title,
          methodology.description,
        )),
      }),
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
    })
  );

  server.registerTool(
    'get_risk_indices',
    {
      description:
        "Indices de risque publiés par l0g.fr (tableaux de bord macro US et zone euro, Yen Carry, Energie) " +
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
        "Renvoie l'historique des changements de niveau des signaux l0g, l'état courant des scores et la confluence 13FLOW. " +
        "À utiliser pour distinguer niveau courant, franchissement de seuil et signal de marché historisé.",
      inputSchema: {
        key: z.enum(['us', 'eu', 'yen', 'energie']).optional().describe('Signal optionnel : us, eu, yen ou energie.'),
        limit: z.number().int().min(1).max(50).default(20).describe("Nombre maximum d'événements historiques."),
      },
      outputSchema: SignalHistoryOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ key, limit }) => {
      const current = risk?.indices || {};
      let events = Array.isArray(riskEvents?.events) ? riskEvents.events.slice() : [];
      if (key) events = events.filter((event) => event.key === key);
      events.sort((a, b) => String(b.ts).localeCompare(String(a.ts)));
      return reply({
        updated: riskEvents?.updated || risk?.snapshot || risk?.generated || null,
        filters: { key: key || null },
        current: key ? { [key]: current[key] ?? null } : current,
        events: events.slice(0, limit),
        confluence: {
          updated: confluence?.updated || risk?.confluence?.updated || null,
          items: (confluence?.items || []).slice(0, 20),
          summary: risk?.confluence || null,
        },
        caveat: "Les scores 0-100 sont normalisés par instrument ; l'historique signale surtout les franchissements de niveau.",
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
        "Lit les variantes NDJSON publiques de l'Agent Surface : catalog, claims, evidenceGraph ou changes. " +
        "Le feed est allowlisté ; aucun chemin arbitraire n'est accepté.",
      inputSchema: {
        feed: z.enum(['catalog', 'claims', 'evidenceGraph', 'changes']).describe('Flux NDJSON à lire.'),
        recordType: z.string().optional().describe('Filtre recordType optionnel, par exemple claim, article, node, edge ou change.'),
        limit: z.number().int().min(1).max(200).default(50).describe('Nombre maximum de lignes renvoyées.'),
      },
      outputSchema: NdjsonOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ feed, recordType, limit }) => {
      const { spec, totalLines, totalMatches, records } = await readNdjsonFeed(feed, limit, recordType);
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
        "Par défaut, le serveur lit les HTML construits et score titre, métadonnées, description et corps de page, sans fournisseur externe. " +
        "Le mode catalog conserve l'ancien scoring léger sur titre, tags, topics et description.",
      inputSchema: {
        query: z.string().min(1).max(200).describe('Termes de recherche.'),
        mode: z.enum(['fulltext', 'catalog']).default('fulltext').describe('fulltext pour le corps des pages, catalog pour le scoring catalogue historique.'),
        limit: z.number().int().min(1).max(10).default(5).describe('Nombre maximum de résultats.'),
      },
      outputSchema: SearchOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ query, mode, limit }) => {
      const tokens = norm(query).split(/\s+/).filter(Boolean);
      if (!tokens.length) return reply({ query, mode: mode || 'fulltext', count: 0, results: [] });
      if ((mode || 'fulltext') === 'fulltext') {
        const results = await searchFullText(catalog, query, limit);
        return reply({
          query,
          mode: 'fulltext',
          backend: 'local-html-index',
          coverage: ['title', 'tags', 'topics', 'description', 'body'],
          count: results.length,
          results,
        });
      }
      const pool = [
        ...articles.map((a) => ({ ...a, type: 'article' })),
        ...guides.map((g) => ({ ...g, type: 'guide' })),
      ];
      const ranked = pool
        .map((it) => ({ it, s: score(it, tokens) }))
        .filter((x) => x.s > 0)
        .sort((a, b) => b.s - a.s || String(b.it.date).localeCompare(String(a.it.date)))
        .slice(0, limit)
        .map((x) => ({
          type: x.it.type, title: x.it.title, url: x.it.url,
          date: x.it.date, description: x.it.description, score: x.s,
        }));
      return reply({
        query,
        mode: 'catalog',
        backend: 'catalog-weighted-lexical',
        coverage: ['title', 'tags', 'topics', 'description'],
        count: ranked.length,
        results: ranked,
      });
    }
  );

  server.registerTool(
    'get_claims',
    {
      description:
        "Interroge les relations affirmation-source extraites des articles l0g. Filtrage par article, type de claim " +
        "(fait, estimation, inférence, scénario) et texte. Renvoie les références cliquables et datées.",
      inputSchema: {
        articleSlug: z.string().optional().describe("Slug d'article optionnel."),
        kind: z.enum(['fait', 'estimation', 'inférence', 'scénario']).optional().describe('Type de claim optionnel.'),
        query: z.string().optional().describe('Filtre texte optionnel dans la claim ou le titre article.'),
        limit: z.number().int().min(1).max(50).default(10).describe('Nombre maximum de claims.'),
      },
      outputSchema: ClaimsOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ articleSlug, kind, query, limit }) => {
      let list = claims.claims || [];
      if (articleSlug) {
        const clean = String(articleSlug).trim().replace(/^https?:\/\/[^/]+/i, '').replace(/^\/+|\/+$/g, '').replace(/^posts\//, '');
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
        filters: { articleSlug: articleSlug || null, kind: kind || null, query: query || null },
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
        "Renvoie une claim précise par identifiant, avec ses références cliquables et datées. " +
        "Utiliser list_article_claims ou get_claims pour découvrir les identifiants.",
      inputSchema: {
        claimId: z.string().min(1).describe("Identifiant de claim, par exemple dollar-yen-intervention-risque-carry-2026:claim-1."),
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
        kind: z.enum(['fait', 'estimation', 'inférence', 'scénario']).optional().describe('Type de claim optionnel.'),
        limit: z.number().int().min(1).max(100).default(50).describe('Nombre maximum de claims.'),
      },
      outputSchema: ArticleClaimsOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ articleSlug, kind, limit }) => {
      const slug = cleanSlug(articleSlug);
      const article = articles.find((item) => item.slug === slug);
      if (!article) return errorReply({ error: 'article inconnu', articleSlug: slug });
      let list = claimsList.filter((claim) => claim.articleSlug === slug);
      if (kind) list = list.filter((claim) => claim.kind === kind);
      list = list.slice(0, limit).map(compactClaim);
      return reply({
        articleSlug: slug,
        article,
        count: list.length,
        filters: { kind: kind || null },
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
        kind: z.enum(['fait', 'estimation', 'inférence', 'scénario']).optional().describe('Type de claim optionnel.'),
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
        nodeType: z.enum(['article', 'claim', 'reference', 'host', 'primarySource', 'dataset']).optional().describe('Type de nœud optionnel.'),
        limit: z.number().int().min(1).max(200).default(80).describe('Nombre maximum de nœuds renvoyés.'),
      },
      outputSchema: EvidenceGraphOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ articleSlug, nodeType, limit }) => {
      let nodes = evidenceGraph.nodes || [];
      const edges = evidenceGraph.edges || [];
      let directSection = null;
      let relatedSection = null;
      if (articleSlug) {
        const clean = String(articleSlug).trim().replace(/^https?:\/\/[^/]+/i, '').replace(/^\/+|\/+$/g, '').replace(/^posts\//, '');
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
          filters: { articleSlug: clean, nodeType: nodeType || null },
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
        limit: z.number().int().min(1).max(20).default(5).describe("Nombre d'analyses à renvoyer."),
      },
      outputSchema: AnalysisListOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ limit }) => {
      const list = articles.slice(0, limit).map((a) => ({
        title: a.title, url: a.url, date: a.date, description: a.description, tags: a.tags,
      }));
      return reply({ count: list.length, analyses: list });
    }
  );

  server.registerTool(
    'list_guides',
    {
      description:
        "Liste les guides de référence de l0g.fr (pages piliers durables : 13F, Form 4, GENIUS Act, OFAC, MiCA...), " +
        "avec titre, URL, description et résumé définitionnel.",
      inputSchema: {},
      outputSchema: GuideListOutput,
      annotations: { readOnlyHint: true },
    },
    async () => {
      const list = guides.map((g) => ({
        title: g.title, url: g.url, date: g.date, description: g.description, summary: g.summary, tags: g.tags,
      }));
      return reply({ count: list.length, guides: list });
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
        limit: z.number().int().min(1).max(20).default(10).describe("Nombre maximum d'analyses."),
      },
      outputSchema: TopicOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ topic, limit }) => {
      const raw = norm(topic);
      if (!raw) return errorReply({ error: 'sujet vide', topics: topicsList });
      let match = topicsList.find((t) => t.slug === raw);
      if (!match) match = topicsList.find((t) => norm(t.label).includes(raw) || t.slug.includes(raw) || raw.includes(t.slug));
      if (!match) return errorReply({ error: 'sujet inconnu', requested: topic, topics: topicsList });
      const list = articles
        .filter((a) => (a.topics || []).includes(match.slug))
        .slice(0, limit)
        .map((a) => ({ title: a.title, url: a.url, date: a.date, description: a.description }));
      return reply({ topic: match.slug, label: match.label, count: list.length, analyses: list });
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
        offset: z.number().int().min(0).default(0).describe('Position de départ en caractères pour paginer le texte.'),
        cursor: z.string().optional().describe('Curseur opaque nextCursor renvoyé par un appel précédent.'),
        limit: z.number().int().min(1000).max(50000).optional().describe('Alias de length, recommandé pour les clients agents.'),
        length: z.number().int().min(1000).max(50000).default(16000).describe('Longueur maximale du segment renvoyé.'),
        section: z.enum(['body', 'head', 'tail', 'sources']).default('body').describe('Section pratique : body avec offset, head, tail ou sources.'),
      },
      outputSchema: ArticleOutput,
      annotations: { readOnlyHint: true },
    },
    async ({ slug, offset, cursor, limit, length, section: requestedSection }) => {
      const clean = String(slug || '').trim().replace(/^https?:\/\/[^/]+/i, '').replace(/[?#].*$/, '').replace(/^\/+|\/+$/g, '').replace(/^(posts|guides)\//, '');
      if (!slugs.has(clean)) return errorReply({ error: 'slug inconnu', slug: clean });
      const isGuide = guides.some((g) => g.slug === clean);
      const section = isGuide ? 'guides' : 'posts';
      const url = `${SITE}/${section}/${clean}/`;
      try {
        const html = await readFile(join(DATA_DIR, section, clean, 'index.html'), 'utf-8');
        const root = parseHtml(html);
        const titleEl = root.querySelector('article h1') || root.querySelector('h1');
        const body = root.querySelector('.prose') || root.querySelector('[data-pagefind-body]') || root.querySelector('article');
        const fullText = (body ? body.text : '').replace(/\s+/g, ' ').trim();
        const chunk = articleChunk(fullText, { offset, cursor, limit: limit ?? length, section: requestedSection || 'body' });
        return reply({
          slug: clean, type: isGuide ? 'guide' : 'article', url,
          title: titleEl ? titleEl.text.replace(/\s+/g, ' ').trim() : clean,
          references: referencesForArticle(clean),
          ...chunk,
        });
      } catch {
        return errorReply({ error: 'contenu introuvable', slug: clean, url });
      }
    }
  );

  removeLiveNotificationCapabilities(server);
  return server;
}

// --- validation de sécurité (Host + Origin) ---
function hostAllowed(req) {
  const host = String(req.headers.host || '').toLowerCase().split(':')[0];
  return ALLOWED_HOSTS.includes(host);
}
function originAllowed(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // clients natifs : pas d'Origin
  return ALLOWED_ORIGINS.includes(origin);
}

function send(res, code, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(body);
}

// --- serveur HTTP ---
const httpServer = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // sonde de santé
  if (req.method === 'GET' && url.pathname === '/healthz') return send(res, 200, { ok: true });

  if (url.pathname !== MCP_PATH) return send(res, 404, { error: 'not found' });
  if (!hostAllowed(req)) return send(res, 421, { error: 'host non autorisé' });
  if (!originAllowed(req)) return send(res, 403, { error: 'origin non autorisée' });

  // Streamable HTTP stateless : seul POST est utile (pas de flux serveur en mode JSON).
  if (req.method === 'GET' || req.method === 'DELETE') {
    res.writeHead(405, { Allow: 'POST', 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ jsonrpc: '2.0', error: { code: -32000, message: 'Method Not Allowed' }, id: null }));
  }
  if (req.method !== 'POST') return send(res, 405, { error: 'method not allowed' });
  if (rateLimited(clientIp(req))) return send(res, 429, { error: 'too many requests' });

  // lecture du corps, bornée
  let raw = '';
  let tooBig = false;
  req.on('data', (c) => {
    raw += c;
    if (raw.length > MAX_BODY) { tooBig = true; req.destroy(); }
  });
  req.on('end', async () => {
    if (tooBig) return send(res, 413, { error: 'payload too large' });
    let body;
    try { body = raw ? JSON.parse(raw) : undefined; }
    catch { return send(res, 400, { jsonrpc: '2.0', error: { code: -32700, message: 'Parse error' }, id: null }); }
    try {
      const data = await loadData();
      const server = buildServer(data);
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless
        enableJsonResponse: true, // réponse JSON, pas de SSE
      });
      res.on('close', () => { transport.close(); server.close(); });
      await server.connect(transport);
      await transport.handleRequest(req, res, body);
    } catch (e) {
      if (!res.headersSent) send(res, 500, { jsonrpc: '2.0', error: { code: -32603, message: 'Internal error' }, id: null });
    }
  });
});

httpServer.listen(PORT, HOST, () => {
  console.error(`[l0g-mcp] écoute sur http://${HOST}:${PORT}${MCP_PATH} — données : ${DATA_DIR}`);
});
