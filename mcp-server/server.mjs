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
 * Données : lues sur le disque, dans le site déjà déployé (catalog.json + risk.json
 * générés au build), avec un petit cache TTL. Le texte complet d'un article est
 * extrait à la demande depuis le HTML construit.
 */
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
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
let cache = { at: 0, catalog: null, risk: null };
async function loadData() {
  const now = Date.now();
  if (cache.catalog && now - cache.at < CACHE_TTL) return cache;
  const catalog = JSON.parse(await readFile(join(DATA_DIR, 'api/v1/catalog.json'), 'utf-8'));
  let risk = null;
  try {
    risk = JSON.parse(await readFile(join(DATA_DIR, 'api/v1/risk.json'), 'utf-8'));
  } catch { /* risk optionnel */ }
  cache = { at: now, catalog, risk };
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

// --- fabrique d'un serveur MCP (neuf par requête) ---
function buildServer(data) {
  const server = new McpServer({ name: 'l0g.fr', version: '1.0.0' });
  const { catalog, risk } = data;
  const articles = catalog.articles || [];
  const guides = catalog.guides || [];
  const topicsList = catalog.topics || [];
  const slugs = new Set([...articles.map((a) => a.slug), ...guides.map((g) => g.slug)]);

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
