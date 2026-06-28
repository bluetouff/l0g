import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const URL_ = process.env.URL || 'http://127.0.0.1:8848/mcp';
const transport = new StreamableHTTPClientTransport(new URL(URL_));
const client = new Client({ name: 'l0g-test', version: '1.0.0' });
await client.connect(transport);

const { tools } = await client.listTools();
console.log('TOOLS:', tools.map((t) => t.name).join(', '));
for (const required of [
  'get_agent_manifest',
  'get_claims',
  'get_evidence_graph',
  'list_sources',
  'get_freshness',
  'get_integrity',
  'get_changefeed',
  'get_openapi_schema',
  'get_ndjson_feed',
  'get_signal_history',
  'get_claim',
  'get_claim_evidence',
  'list_article_claims',
  'find_claims_by_source',
  'get_source',
  'verify_artifact',
  'get_changes',
]) {
  const tool = tools.find((item) => item.name === required);
  if (!tool) throw new Error(`tool manquant: ${required}`);
  if (!tool.outputSchema) throw new Error(`outputSchema manquant: ${required}`);
}

const { resources } = await client.listResources();
console.log('RESOURCES:', resources.length, '| #1:', resources[0]?.uri);
for (const required of ['l0g://freshness', 'l0g://integrity', 'l0g://changes/latest', 'l0g://signals/current']) {
  if (!resources.some((resource) => resource.uri === required)) throw new Error(`resource manquante: ${required}`);
}

const { resourceTemplates } = await client.listResourceTemplates();
console.log('RESOURCE_TEMPLATES:', resourceTemplates.map((template) => template.uriTemplate).join(', '));
for (const required of [
  'l0g://articles/{slug}',
  'l0g://guides/{slug}',
  'l0g://claims/{claim_id}',
  'l0g://sources/{source_id}',
  'l0g://signals/{instrument}/current',
  'l0g://methodologies/{instrument}',
]) {
  if (!resourceTemplates.some((template) => template.uriTemplate === required)) throw new Error(`resource template manquant: ${required}`);
}

const freshnessResource = await client.readResource({ uri: 'l0g://freshness' });
console.log('readResource(freshness) -> contents:', freshnessResource.contents?.length);

const articleResource = await client.readResource({ uri: 'l0g://articles/repo-collateral-fabrique-liquidite' });
const articleText = articleResource.contents?.[0]?.text || '{}';
console.log('readResource(article) -> title:', JSON.parse(articleText).title);

const signalResource = await client.readResource({ uri: 'l0g://signals/yen/current' });
console.log('readResource(signal) -> instrument:', JSON.parse(signalResource.contents?.[0]?.text || '{}').instrument);

const subscription = await client.subscribeResource({ uri: 'l0g://changes/latest' });
console.log('subscribeResource(changes) -> accepted:', subscription._meta?.accepted === true);
await client.unsubscribeResource({ uri: 'l0g://changes/latest' });

async function call(name, args) {
  const r = await client.callTool({ name, arguments: args || {} });
  if (!r.structuredContent || typeof r.structuredContent !== 'object') {
    throw new Error(`structuredContent manquant pour ${name}`);
  }
  const txt = (r.content || []).map((c) => c.text || '').join('');
  if (txt.trim().startsWith('{') || txt.trim().startsWith('[')) {
    throw new Error(`content.text contient encore du JSON pour ${name}`);
  }
  return r.structuredContent;
}

const risk = await call('get_risk_indices');
console.log('get_risk_indices -> indices:', Object.keys(risk.indices || {}).join(','), '| snapshot:', risk.snapshot);

const signalHistory = await call('get_signal_history', { key: 'yen', limit: 5 });
console.log('get_signal_history(yen) -> events:', signalHistory.events?.length, '| current:', Boolean(signalHistory.current?.yen));

const manifest = await call('get_agent_manifest');
console.log('get_agent_manifest -> version:', manifest.version, '| endpoints:', Object.keys(manifest.endpoints || {}).length);

const openapi = await call('get_openapi_schema', { mode: 'path', path: '/api/v1/claims.json' });
console.log('get_openapi_schema(path) -> paths:', openapi.paths?.length, '| schemas:', openapi.schemas?.length);

const ndjson = await call('get_ndjson_feed', { feed: 'claims', recordType: 'claim', limit: 3 });
console.log('get_ndjson_feed(claims) ->', ndjson.count, '| path:', ndjson.path);

const search = await call('search_content', { query: 'trilemme bilan', limit: 3 });
if (!search.results?.[0]?.excerpt) throw new Error('search_content plein texte sans excerpt');
console.log('search_content(trilemme bilan) ->', search.count, 'résultats; mode:', search.mode, '; #1:', search.results?.[0]?.title);

const catalogSearch = await call('search_content', { query: 'stablecoins', mode: 'catalog', limit: 3 });
console.log('search_content(stablecoins,catalog) ->', catalogSearch.count, 'résultats; #1:', catalogSearch.results?.[0]?.title);

const recent = await call('list_recent_analyses', { limit: 3 });
console.log('list_recent_analyses ->', recent.count, '; #1:', recent.analyses?.[0]?.title);

const gd = await call('list_guides');
console.log('list_guides ->', gd.count, 'guides');

const byTopic = await call('search_by_topic', { topic: 'crypto', limit: 3 });
console.log('search_by_topic(crypto) ->', byTopic.count, '; label:', byTopic.label);

const claims = await call('get_claims', { kind: 'fait', limit: 3 });
console.log('get_claims(fait) ->', claims.count, '; #1:', claims.claims?.[0]?.articleSlug);

const claim = await call('get_claim', { claimId: 'dollar-yen-intervention-risque-carry-2026:claim-1' });
console.log('get_claim ->', claim.claimId, '| kind:', claim.claim?.kind);

const claimEvidence = await call('get_claim_evidence', { claimId: 'dollar-yen-intervention-risque-carry-2026:claim-1', limit: 40 });
console.log('get_claim_evidence -> depth:', claimEvidence.evidence?.proofDepth, '| nodes:', claimEvidence.returned?.nodes);

const articleClaims = await call('list_article_claims', { articleSlug: 'dollar-yen-intervention-risque-carry-2026', limit: 5 });
console.log('list_article_claims ->', articleClaims.count, '| #1:', articleClaims.claims?.[0]?.id);

const claimsBySource = await call('find_claims_by_source', { sourceId: 'fred.stlouisfed.org', limit: 3 });
console.log('find_claims_by_source(fred) ->', claimsBySource.count);

const source = await call('get_source', { sourceId: 'federal-reserve-fred', limit: 3 });
console.log('get_source(federal-reserve-fred) ->', source.sourceType, '| claims:', source.claimsCount);

const graph = await call('get_evidence_graph', { articleSlug: 'dollar-yen-intervention-risque-carry-2026', limit: 30 });
console.log('get_evidence_graph -> nodes:', graph.returned?.nodes, '| edges:', graph.returned?.edges);

const sources = await call('list_sources', { mode: 'both', limit: 3 });
console.log('list_sources -> primary:', sources.primarySources?.length, '| hosts:', sources.referenceHosts?.length);

const freshness = await call('get_freshness', { limit: 3 });
console.log('get_freshness -> latest:', freshness.latest?.length);

const integrity = await call('get_integrity', { path: '/api/v1/evidence-graph.json' });
console.log('get_integrity -> snapshots:', integrity.count, '| algo:', integrity.algorithm);

const verified = await call('verify_artifact', { path: '/api/v1/evidence-graph.json' });
console.log('verify_artifact -> expected:', Boolean(verified.expectedSha256), '| verified:', verified.verified);

const changefeed = await call('get_changefeed', { contentType: 'article', limit: 3 });
console.log('get_changefeed(article) ->', changefeed.count);

const changes = await call('get_changes', { contentType: 'article', since: '2026-06-27', limit: 3 });
console.log('get_changes(article) ->', changes.count);

const art = await call('get_article', { slug: 'economie-des-intentions', length: 5000 });
if (!art.nextOffset || !art.truncated) throw new Error('get_article ne fournit pas de continuation sur article long');
console.log('get_article(page 1) -> title:', art.title, '| chars:', art.textChars, '/', art.totalChars, '| next:', art.nextOffset);

const artNext = await call('get_article', { slug: 'economie-des-intentions', offset: art.nextOffset, length: 5000 });
console.log('get_article(page 2) -> offset:', artNext.offset, '| chars:', artNext.textChars, '| next:', artNext.nextOffset);

const artSources = await call('get_article', { slug: 'economie-des-intentions', section: 'sources', length: 12000 });
if (!artSources.sectionFound || !artSources.text?.toLowerCase().includes('sources principales')) {
  throw new Error('get_article(section=sources) ne retrouve pas les sources');
}
console.log('get_article(sources) -> offset:', artSources.offset, '| chars:', artSources.textChars);

const bad = await call('get_article', { slug: '../../etc/passwd' });
console.log('get_article(path traversal) -> error:', bad.error);

await client.close();
console.log('OK');
