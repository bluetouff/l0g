import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const fullUrl = process.env.URL || 'http://127.0.0.1:8848/mcp';
const endpoint = process.env.COMPACT_URL || `${fullUrl.replace(/\/$/, '')}/compact`;
const client = new Client({ name: 'l0g-compact-test', version: '1.0.0' });
await client.connect(new StreamableHTTPClientTransport(new URL(endpoint), {
  requestInit: { headers: { Accept: 'application/json, text/event-stream' } },
}));

try {
  const { tools } = await client.listTools();
  const expected = ['build_research_pack', 'discover_l0g', 'get_document', 'get_evidence', 'get_risk_state', 'search_l0g'];
  const names = tools.map((tool) => tool.name).sort();
  if (JSON.stringify(names) !== JSON.stringify(expected)) throw new Error(`tools compacts inattendus: ${names.join(', ')}`);
  const bytes = Buffer.byteLength(JSON.stringify({ tools }), 'utf8');
  if (bytes > 60_000) throw new Error(`tools/list compact hors budget: ${bytes} octets`);
  for (const tool of tools) {
    const hints = tool.annotations || {};
    if (!tool.title || hints.readOnlyHint !== true || hints.destructiveHint !== false || hints.idempotentHint !== true || hints.openWorldHint !== false) {
      throw new Error(`métadonnées compactes incomplètes: ${tool.name}`);
    }
  }

  const call = async (name, args = {}) => client.callTool({ name, arguments: args });
  const discovery = await call('discover_l0g');
  if (discovery.structuredContent?.surface !== 'compact') throw new Error('discover_l0g sans identification de surface');
  if ((discovery.content || []).filter((item) => item.type === 'resource_link').length < 3) throw new Error('discover_l0g sans resource_link natifs');

  const search = await call('search_l0g', { query: 'stablecoins Treasuries', language: 'en', limit: 2 });
  if (!search.structuredContent?.results?.length) throw new Error('search_l0g sans résultat');
  if (!(search.content || []).some((item) => item.type === 'resource_link')) throw new Error('search_l0g sans lien canonique natif');

  const document = await call('get_document', { slug: 'economie-des-intentions', language: 'fr', limit: 1000 });
  if (!document.structuredContent?.text || typeof document.structuredContent?.truncated !== 'boolean') throw new Error('get_document sans texte ou troncature explicite');

  const evidence = await call('get_evidence', { articleSlug: 'economie-des-intentions', mode: 'claims', limit: 3 });
  if (!evidence.structuredContent?.claims?.length) throw new Error(`get_evidence sans claim: ${JSON.stringify(evidence.structuredContent)}`);

  const pack = await call('build_research_pack', { query: 'stablecoins Treasuries', language: 'en', limit: 2 });
  if (!pack.structuredContent?.documents?.length || !Array.isArray(pack.structuredContent?.citationUrls)) throw new Error('build_research_pack compact incomplet');

  const risk = await call('get_risk_state', { mode: 'current' });
  if (!risk.structuredContent?.indices || risk.structuredContent?.mode !== 'current' || risk.structuredContent?.primary !== true) {
    throw new Error('get_risk_state sans contrat courant stable');
  }
  if (!risk.structuredContent?.asOf || !risk.structuredContent?.source || !risk.structuredContent?.methodology) {
    throw new Error('get_risk_state sans date, source ou méthodologie');
  }
  if (!risk.structuredContent?.freshness?.instruments?.length || risk.structuredContent?.variation?.window !== '7d') {
    throw new Error('get_risk_state current sans fraîcheur compacte ou variation 7d');
  }
  if (risk.structuredContent?.attribution?.requiredLabel !== 'Source : l0g.fr' || !risk.structuredContent?.canonical?.url) {
    throw new Error('get_risk_state sans source canonique ou attribution l0g');
  }
  if ((risk.content || []).filter((item) => item.type === 'resource_link').length < 2) {
    throw new Error('get_risk_state sans liens source et méthode');
  }

  const invalidHistory = await call('get_risk_state', { mode: 'history' });
  if (invalidHistory.isError !== true || !invalidHistory.structuredContent?.error) {
    throw new Error('get_risk_state history accepte un instrument absent');
  }

  console.log(`MCP compact OK: ${tools.length} tools, ${bytes} octets, get_risk_state prioritaire et contrats validés.`);
} finally {
  await client.close();
}
