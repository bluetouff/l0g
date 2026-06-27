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
import { SubscribeRequestSchema, UnsubscribeRequestSchema } from '@modelcontextprotocol/sdk/types.js';
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
const MCP_VERSION = '1.4.0';
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
function reply(payload) {
  return { content: [{ type: 'text', text: JSON.stringify(payload, null, 2) }] };
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

  async function readDocument(slug, type) {
    const clean = uriValue(slug).replace(/^https?:\/\/[^/]+/i, '').replace(/^\/+|\/+$/g, '').replace(/^(posts|guides)\//, '');
    const pool = type === 'guide' ? guides : articles;
    const record = pool.find((item) => item.slug === clean);
    if (!record) return { error: `${type} inconnu`, slug: clean };
    const section = type === 'guide' ? 'guides' : 'posts';
    const html = await readFile(join(DATA_DIR, section, clean, 'index.html'), 'utf-8');
    const root = parseHtml(html);
    const titleEl = root.querySelector('article h1') || root.querySelector('h1');
    const body = root.querySelector('.prose') || root.querySelector('[data-pagefind-body]') || root.querySelector('article');
    let text = (body ? body.text : '').replace(/\s+/g, ' ').trim();
    const MAX = 30000;
    const truncated = text.length > MAX;
    if (truncated) text = text.slice(0, MAX);
    return {
      ...record,
      type,
      title: titleEl ? titleEl.text.replace(/\s+/g, ' ').trim() : record.title,
      words: text ? text.split(/\s+/).length : 0,
      truncated,
      text,
    };
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
      description: 'Analyse l0g lue comme document ressource, avec métadonnées et texte.',
      mimeType: 'application/json',
    },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'article')),
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
      description: 'Guide de référence l0g lu comme document ressource.',
      mimeType: 'application/json',
    },
    async (uri, variables) => resourceJson(uri.toString(), await readDocument(variables.slug, 'guide')),
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
      return resourceJson(uri.toString(), claim ? compactClaim(claim) : { error: 'claim inconnue', id });
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
      return resourceJson(uri.toString(), source ? { id, ...source } : { error: 'source inconnue', id });
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
      return resourceJson(uri.toString(), {
        instrument,
        snapshot: risk?.snapshot ?? null,
        generated: risk?.generated ?? null,
        current: signals[instrument] ?? null,
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
      return resourceJson(uri.toString(), methodology || { error: 'méthodologie inconnue', instrument });
    },
  );

  server.server.registerCapabilities({ resources: { subscribe: true, listChanged: true } });
  const subscriptionNote = {
    mode: 'stateless-http',
    accepted: true,
    liveNotifications: false,
    note:
      "Souscription acceptée pour compatibilité MCP. Le service actuel est stateless en requête/réponse ; surveiller l0g://changes/latest ou get_changefeed pour détecter les mises à jour. Les notifications push nécessitent une variante sessionnée.",
  };
  server.server.setRequestHandler(SubscribeRequestSchema, async (request) => ({
    _meta: { ...subscriptionNote, uri: request.params.uri },
  }));
  server.server.setRequestHandler(UnsubscribeRequestSchema, async (request) => ({
    _meta: { mode: 'stateless-http', accepted: true, uri: request.params.uri },
  }));

  server.registerTool(
    'get_agent_manifest',
    {
      description:
        "Renvoie le manifeste Agent Surface de l0g.fr : capacités, endpoints, règles d'usage, politiques de preuve et compteurs. " +
        "Point d'entrée recommandé pour découvrir les surfaces machine sans scraper.",
      inputSchema: {},
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
      annotations: { readOnlyHint: true },
    },
    async () => {
      if (!risk) return reply({ error: 'indices indisponibles' });
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
      annotations: { readOnlyHint: true },
    },
    async ({ mode, path }) => {
      if (mode === 'full') return reply(openapi);
      if (mode === 'path') {
        const clean = String(path || '').trim();
        if (!clean.startsWith('/')) return reply({ error: 'path invalide', note: 'utiliser un chemin exact commençant par /' });
        const summary = summarizeOpenapi(openapi, clean);
        if (!summary.paths.length) return reply({ error: 'path inconnu', path: clean, knownPaths: Object.keys(openapi.paths || {}) });
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
      annotations: { readOnlyHint: true },
    },
    async ({ limit }) => reply({
      version: freshness.version,
      generated: freshness.generated,
      latest: (freshness.latest || []).slice(0, limit),
      corpus: freshness.corpus,
      endpoints: freshness.endpoints,
      freshnessPolicy: freshness.freshnessPolicy,
    })
  );

  server.registerTool(
    'search_content',
    {
      description:
        "Recherche dans le catalogue de l0g.fr (analyses et guides de référence) par titre, description, thèmes et sujets. " +
        "Renvoie titre, type, URL, date et description. Pour le texte complet, enchaîner avec get_article.",
      inputSchema: {
        query: z.string().describe('Termes de recherche.'),
        limit: z.number().int().min(1).max(10).default(5).describe('Nombre maximum de résultats.'),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ query, limit }) => {
      const tokens = norm(query).split(/\s+/).filter(Boolean);
      if (!tokens.length) return reply({ query, count: 0, results: [] });
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
      return reply({ query, count: ranked.length, results: ranked });
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
    'get_evidence_graph',
    {
      description:
        "Renvoie un sous-graphe de preuve l0g : articles, claims, références, hôtes, sources primaires et datasets. " +
        "Limiter par articleSlug ou nodeType pour éviter les payloads trop larges.",
      inputSchema: {
        articleSlug: z.string().optional().describe("Slug d'article optionnel pour extraire son voisinage de graphe."),
        nodeType: z.enum(['article', 'claim', 'reference', 'host', 'primarySource', 'dataset']).optional().describe('Type de nœud optionnel.'),
        limit: z.number().int().min(1).max(200).default(80).describe('Nombre maximum de nœuds renvoyés.'),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ articleSlug, nodeType, limit }) => {
      let nodes = evidenceGraph.nodes || [];
      const edges = evidenceGraph.edges || [];
      let selected = null;
      if (articleSlug) {
        const clean = String(articleSlug).trim().replace(/^https?:\/\/[^/]+/i, '').replace(/^\/+|\/+$/g, '').replace(/^posts\//, '');
        const articleId = `article:${clean}`;
        selected = new Set([articleId]);
        let changed = true;
        while (changed && selected.size < 800) {
          changed = false;
          for (const edge of edges) {
            if (selected.has(edge.from) && !selected.has(edge.to)) { selected.add(edge.to); changed = true; }
            if (selected.has(edge.to) && !selected.has(edge.from)) { selected.add(edge.from); changed = true; }
          }
        }
        nodes = nodes.filter((node) => selected.has(node.id));
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
        "Renvoie les dernières publications, révisions déclarées et changements éditoriaux structurants de l0g. " +
        "À utiliser pour surveiller le corpus sans tout rescanner.",
      inputSchema: {
        contentType: z.enum(['article', 'guide', 'policy']).optional().describe('Type de contenu optionnel.'),
        limit: z.number().int().min(1).max(100).default(20).describe("Nombre maximum d'entrées."),
      },
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
      annotations: { readOnlyHint: true },
    },
    async ({ topic, limit }) => {
      const raw = norm(topic);
      if (!raw) return reply({ error: 'sujet vide', topics: topicsList });
      let match = topicsList.find((t) => t.slug === raw);
      if (!match) match = topicsList.find((t) => norm(t.label).includes(raw) || t.slug.includes(raw) || raw.includes(t.slug));
      if (!match) return reply({ error: 'sujet inconnu', requested: topic, topics: topicsList });
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
        "Renvoie le texte complet d'une analyse ou d'un guide de l0g.fr à partir de son slug " +
        "(dernier segment de l'URL). Récupérer les slugs via search_content, list_recent_analyses ou list_guides.",
      inputSchema: {
        slug: z.string().describe("Slug de l'article ou du guide."),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ slug }) => {
      const clean = String(slug || '').trim().replace(/^https?:\/\/[^/]+/i, '').replace(/^\/+|\/+$/g, '').replace(/^(posts|guides)\//, '');
      if (!slugs.has(clean)) return reply({ error: 'slug inconnu', slug: clean });
      const isGuide = guides.some((g) => g.slug === clean);
      const section = isGuide ? 'guides' : 'posts';
      const url = `${SITE}/${section}/${clean}/`;
      try {
        const html = await readFile(join(DATA_DIR, section, clean, 'index.html'), 'utf-8');
        const root = parseHtml(html);
        const titleEl = root.querySelector('article h1') || root.querySelector('h1');
        const body = root.querySelector('.prose') || root.querySelector('[data-pagefind-body]') || root.querySelector('article');
        let text = (body ? body.text : '').replace(/\s+/g, ' ').trim();
        const MAX = 16000;
        const truncated = text.length > MAX;
        if (truncated) text = text.slice(0, MAX);
        return reply({
          slug: clean, type: isGuide ? 'guide' : 'article', url,
          title: titleEl ? titleEl.text.replace(/\s+/g, ' ').trim() : clean,
          words: text ? text.split(/\s+/).length : 0, truncated, text,
        });
      } catch {
        return reply({ error: 'contenu introuvable', slug: clean, url });
      }
    }
  );

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
