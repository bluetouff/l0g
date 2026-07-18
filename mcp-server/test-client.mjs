import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const URL_ = process.env.URL || 'http://127.0.0.1:8848/mcp';
const transport = new StreamableHTTPClientTransport(new URL(URL_), {
  requestInit: {
    headers: {
      Accept: "application/json, text/event-stream",
    },
  },
});
const client = new Client({ name: 'l0g-test', version: '1.0.0' });
await client.connect(transport);

const serverCapabilities = client.getServerCapabilities?.() || {};
if (serverCapabilities.resources?.subscribe || serverCapabilities.resources?.listChanged) {
  throw new Error('Le serveur annonce des souscriptions resources sans notifications live');
}
if (!serverCapabilities.prompts || serverCapabilities.prompts.listChanged) {
  throw new Error('Le serveur doit annoncer prompts sans notification listChanged');
}
console.log('CAPABILITIES resources:', JSON.stringify(serverCapabilities.resources || {}));

const { prompts } = await client.listPrompts();
const expectedPrompts = ['audit_financial_narrative', 'explain_risk_change', 'verify_claim', 'replay_as_of'];
if (prompts.length !== expectedPrompts.length || expectedPrompts.some((name) => !prompts.some((prompt) => prompt.name === name))) {
  throw new Error(`prompts/list inattendu: ${prompts.map((prompt) => prompt.name).join(', ')}`);
}
for (const prompt of prompts) {
  if (!prompt.title || !prompt.description) throw new Error(`prompt incomplet: ${prompt.name}`);
}
const promptFixtures = {
  audit_financial_narrative: { topic: 'stablecoins and Treasury demand', language: 'en' },
  explain_risk_change: { window: '7d', language: 'fr' },
  verify_claim: { claim: 'Les stablecoins augmentent la demande marginale de Treasuries.', language: 'fr' },
  replay_as_of: { date: '2026-07-16', question: 'Quel était le niveau de risque publié ?', language: 'fr' },
};
for (const name of expectedPrompts) {
  const rendered = await client.getPrompt({ name, arguments: promptFixtures[name] });
  const text = rendered.messages?.[0]?.content?.text || '';
  if (rendered.messages?.[0]?.role !== 'user' || text.length < 200 || text.includes('undefined')) {
    throw new Error(`prompts/get invalide: ${name}`);
  }
}
let invalidPromptRejected = false;
try {
  await client.getPrompt({ name: 'replay_as_of', arguments: { date: '16-07-2026' } });
} catch {
  invalidPromptRejected = true;
}
if (!invalidPromptRejected) throw new Error('prompts/get accepte une date de replay invalide');
console.log('PROMPTS:', prompts.map((prompt) => prompt.name).join(', '));

const healthUrl = new URL('/healthz', URL_).toString();
const health = await fetch(healthUrl).then((res) => res.json());
if (!health.ok || !health.server?.version || !health.server?.shaStatus || health.server?.dataDir) {
  throw new Error('healthz incomplet ou fuite dataDir');
}
if (!health.agentSurface?.version) throw new Error('healthz sans version Agent Surface');
console.log('healthz -> MCP:', health.server.version, '| Agent:', health.agentSurface.version, '| shaStatus:', health.server.shaStatus);

const { tools } = await client.listTools();
const toolsListBytes = Buffer.byteLength(JSON.stringify({ tools }), 'utf8');
console.log('TOOLS:', tools.map((t) => t.name).join(', '), `| ${tools.length} outils, ${toolsListBytes} octets`);
if (tools.length > 21 || toolsListBytes > 120_000) {
  throw new Error(`tools/list hors budget: ${tools.length} outils, ${toolsListBytes} octets`);
}
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
  'get_risk_diff',
  'get_black_box',
  'build_research_pack',
  'verify_artifact',
  'get_changes',
]) {
  const tool = tools.find((item) => item.name === required);
  if (!tool) throw new Error(`tool manquant: ${required}`);
  if (!tool.outputSchema) throw new Error(`outputSchema manquant: ${required}`);
}
for (const removed of ['get_claim', 'get_claim_evidence', 'list_article_claims', 'find_claims_by_source', 'get_source']) {
  if (tools.some((tool) => tool.name === removed)) throw new Error(`tool legacy encore exposé: ${removed}`);
}

const { resources } = await client.listResources();
const resourcesListBytes = Buffer.byteLength(JSON.stringify({ resources }), 'utf8');
if (resources.length > 20 || resourcesListBytes > 12_000) {
  throw new Error(`resources/list trop volumineux: ${resources.length} ressources, ${resourcesListBytes} octets`);
}
for (const resource of resources) {
  if (/^l0g:\/\/(?:articles|en\/articles|guides|en\/guides|claims|sources|methodologies)\//.test(resource.uri)
    || /^l0g:\/\/signals\/[^/]+\/current$/.test(resource.uri)) {
    throw new Error(`resources/list matérialise encore une instance de template: ${resource.uri}`);
  }
}
console.log('RESOURCES:', resources.length, '| bytes:', resourcesListBytes, '| #1:', resources[0]?.uri);
for (const required of ['l0g://mcp/server', 'l0g://freshness', 'l0g://integrity', 'l0g://changes/latest', 'l0g://risk-diff', 'l0g://black-box', 'l0g://signals/current', 'l0g://signals/history']) {
  if (!resources.some((resource) => resource.uri === required)) throw new Error(`resource manquante: ${required}`);
}

const mcpServerResource = await client.readResource({ uri: 'l0g://mcp/server' });
const mcpServerInfo = JSON.parse(mcpServerResource.contents?.[0]?.text || '{}');
if (!mcpServerInfo.version || !mcpServerInfo.sha || !mcpServerInfo.shaStatus || typeof mcpServerInfo.releaseAttested !== 'boolean') {
  throw new Error('readResource(mcp/server) sans version/SHA/shaStatus/releaseAttested');
}
if (mcpServerInfo.dataDir) throw new Error('readResource(mcp/server) expose dataDir');
if (mcpServerInfo.shaStatus === 'verified-hex' && !/^[0-9a-f]{40}$/i.test(mcpServerInfo.sha)) {
  throw new Error('readResource(mcp/server) shaStatus verified-hex sans SHA hexadécimal');
}
console.log('readResource(mcp/server) -> version:', mcpServerInfo.version, '| sha:', mcpServerInfo.sha.slice(0, 12), '| status:', mcpServerInfo.shaStatus);

const { resourceTemplates } = await client.listResourceTemplates();
console.log('RESOURCE_TEMPLATES:', resourceTemplates.map((template) => template.uriTemplate).join(', '));
for (const required of [
  'l0g://articles/{slug}',
  'l0g://articles/{slug}{?section,offset,limit}',
  'l0g://articles/{slug}{?cursor}',
  'l0g://en/articles/{slug}',
  'l0g://en/articles/{slug}{?section,offset,limit}',
  'l0g://en/articles/{slug}{?cursor}',
  'l0g://guides/{slug}',
  'l0g://guides/{slug}{?section,offset,limit}',
  'l0g://guides/{slug}{?cursor}',
  'l0g://en/guides/{slug}',
  'l0g://en/guides/{slug}{?section,offset,limit}',
  'l0g://en/guides/{slug}{?cursor}',
  'l0g://claims/{claim_id}',
  'l0g://sources/{source_id}',
  'l0g://signals/{instrument}/current',
  'l0g://methodologies/{instrument}',
]) {
  if (!resourceTemplates.some((template) => template.uriTemplate === required)) throw new Error(`resource template manquant: ${required}`);
}
const articleCompletion = await client.complete({
  ref: { type: 'ref/resource', uri: 'l0g://articles/{slug}' },
  argument: { name: 'slug', value: 'economie-des-' },
});
if (!articleCompletion.completion.values.includes('economie-des-intentions')) {
  throw new Error('completion article perdue après bornage de resources/list');
}
console.log('RESOURCE_COMPLETION:', articleCompletion.completion.values.slice(0, 3).join(', '));

const freshnessResource = await client.readResource({ uri: 'l0g://freshness' });
console.log('readResource(freshness) -> contents:', freshnessResource.contents?.length);

const articleResource = await client.readResource({ uri: 'l0g://articles/economie-des-intentions' });
const articleText = articleResource.contents?.[0]?.text || '{}';
const articleDocument = JSON.parse(articleText);
if (!articleDocument.nextCursor || !articleDocument.truncated) throw new Error('readResource(article) sans continuation');
if (articleDocument.textChars > 16000) throw new Error('readResource(article) renvoie une page trop grande par défaut');
if (!Array.isArray(articleDocument.references)) throw new Error('readResource(article) sans références séparées');
console.log('readResource(article) -> title:', articleDocument.title, '| chars:', articleDocument.textChars, '| nextCursor:', Boolean(articleDocument.nextCursor));

const articleSourcesResource = await client.readResource({
  uri: 'l0g://articles/economie-des-intentions?section=sources&offset=0&limit=12000',
});
const articleSourcesDocument = JSON.parse(articleSourcesResource.contents?.[0]?.text || '{}');
if (!articleSourcesDocument.sectionFound || !articleSourcesDocument.text?.toLowerCase().includes('sources principales')) {
  throw new Error('readResource(article section=sources) ne retrouve pas les sources');
}
console.log('readResource(article sources) -> offset:', articleSourcesDocument.offset, '| chars:', articleSourcesDocument.textChars);

const articleCursorResource = await client.readResource({
  uri: `l0g://articles/economie-des-intentions?cursor=${articleDocument.nextCursor}`,
});
const articleCursorDocument = JSON.parse(articleCursorResource.contents?.[0]?.text || '{}');
if (articleCursorDocument.offset !== articleDocument.nextOffset) throw new Error('readResource(article cursor) ne reprend pas au bon offset');
console.log('readResource(article cursor) -> offset:', articleCursorDocument.offset, '| chars:', articleCursorDocument.textChars);

const englishArticleResource = await client.readResource({ uri: 'l0g://en/articles/ai-and-productivity' });
const englishArticleDocument = JSON.parse(englishArticleResource.contents?.[0]?.text || '{}');
if (englishArticleDocument.language !== 'en' || englishArticleDocument.canonicalId !== 'article:ia-et-productivite-entre-gains-mesures-et-effets-supposes') {
  throw new Error('readResource(article-en) sans mapping canonique FR/EN');
}
if (!englishArticleDocument.text?.toLowerCase().includes('productivity')) {
  throw new Error('readResource(article-en) sans corps anglais');
}
console.log('readResource(article-en) ->', englishArticleDocument.canonicalId, '| language:', englishArticleDocument.language);

const englishGuideResource = await client.readResource({ uri: 'l0g://en/guides/read-oil-market' });
const englishGuideDocument = JSON.parse(englishGuideResource.contents?.[0]?.text || '{}');
if (englishGuideDocument.language !== 'en' || !englishGuideDocument.canonicalId?.startsWith('guide:')) {
  throw new Error('readResource(guide-en) sans mapping canonique FR/EN');
}
console.log('readResource(guide-en) ->', englishGuideDocument.canonicalId, '| language:', englishGuideDocument.language);

const signalResource = await client.readResource({ uri: 'l0g://signals/yen/current' });
console.log('readResource(signal) -> instrument:', JSON.parse(signalResource.contents?.[0]?.text || '{}').instrument);

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

async function callExpectError(name, args) {
  const r = await client.callTool({ name, arguments: args || {} });
  if (r.isError !== true) throw new Error(`${name} devrait renvoyer isError=true`);
  if (!r.structuredContent?.error) throw new Error(`${name} devrait conserver un structuredContent.error`);
  const txt = (r.content || []).map((c) => c.text || '').join('');
  if (txt.trim().startsWith('{') || txt.trim().startsWith('[')) {
    throw new Error(`content.text contient encore du JSON pour ${name}`);
  }
  return r.structuredContent;
}

async function expectReadResourceFailure(uri) {
  try {
    await client.readResource({ uri });
  } catch (error) {
    console.log('readResource(error) ->', uri, '|', error.message);
    return;
  }
  throw new Error(`readResource aurait dû échouer pour ${uri}`);
}

const risk = await call('get_risk_indices');
if (!risk.indices?.debt) throw new Error('get_risk_indices doit exposer le signal debt.');
console.log('get_risk_indices -> indices:', Object.keys(risk.indices || {}).join(','), '| snapshot:', risk.snapshot);

const signalHistory = await call('get_signal_history', { key: 'debt', limit: 5 });
if (!signalHistory.current?.debt) throw new Error('get_signal_history(debt) doit exposer le signal courant debt.');
if (!signalHistory.observations?.length || !signalHistory.observations.every((item) => item.instrument === 'debt')) {
  throw new Error('get_signal_history(debt) doit exposer les observations datées de la série debt.');
}
if (!signalHistory.instruments?.[0]?.seriesId || !signalHistory.observations[0]?.seriesDate) {
  throw new Error('get_signal_history(debt) sans identité citable ou seriesDate.');
}
console.log('get_signal_history(debt) -> observations:', signalHistory.observations.length, '| events:', signalHistory.events?.length, '| current:', Boolean(signalHistory.current?.debt));

const riskDiff = await call('get_risk_diff', { window: '7d' });
if (!riskDiff.selectedWindow?.window) throw new Error('get_risk_diff(7d) doit exposer une fenêtre sélectionnée.');
console.log('get_risk_diff(7d) -> confidence:', riskDiff.selectedWindow?.confidence?.label);

const blackBox = await call('get_black_box', { date: '2026-03-12' });
if (blackBox.replayable !== false) throw new Error('get_black_box(2026-03-12) doit refuser la reconstruction rétroactive.');
console.log('get_black_box(2026-03-12) -> replayable:', blackBox.replayable);

const manifest = await call('get_agent_manifest');
if (!manifest.server?.version || !manifest.server?.sha) throw new Error('get_agent_manifest sans version/SHA serveur MCP');
console.log(
  'get_agent_manifest -> version:',
  manifest.version,
  '| endpoints:',
  Object.keys(manifest.endpoints || {}).length,
  '| MCP:',
  manifest.server.version,
  manifest.server.sha.slice(0, 12)
);

const openapi = await call('get_openapi_schema', { mode: 'path', path: '/api/v1/claims.json' });
console.log('get_openapi_schema(path) -> paths:', openapi.paths?.length, '| schemas:', openapi.schemas?.length);

const ndjson = await call('get_ndjson_feed', { feed: 'claims', recordType: 'claim', limit: 3 });
console.log('get_ndjson_feed(claims) ->', ndjson.count, '| path:', ndjson.path);

const search = await call('search_content', { query: 'trilemme bilan', limit: 3 });
if (!search.results?.[0]?.excerpt) throw new Error('search_content plein texte sans excerpt');
console.log('search_content(trilemme bilan) ->', search.count, 'résultats; mode:', search.mode, '; #1:', search.results?.[0]?.title);

const englishSearch = await call('search_content', { query: 'productivity gains', language: 'en', limit: 5 });
if (englishSearch.backend !== 'shared-agent-search-index' || !englishSearch.results?.length) {
  throw new Error('search_content anglais n’utilise pas l’index partagé');
}
if (englishSearch.results.some((result) => result.language !== 'en')) {
  throw new Error('search_content(language=en) laisse passer un résultat français');
}
console.log('search_content(productivity gains,en) ->', englishSearch.count, 'résultats; backend:', englishSearch.backend);

const catalogSearch = await call('search_content', { query: 'stablecoins', mode: 'catalog', limit: 3 });
console.log('search_content(stablecoins,catalog) ->', catalogSearch.count, 'résultats; #1:', catalogSearch.results?.[0]?.title);

const researchPack = await call('build_research_pack', { query: 'productivity gains', language: 'en', riskWindow: '7d', limit: 3 });
if (!researchPack.documents?.length || researchPack.documents.some((document) => document.language !== 'en')) {
  throw new Error('build_research_pack ne respecte pas la langue anglaise');
}
if (!Array.isArray(researchPack.claimEvidence) || !Array.isArray(researchPack.citationUrls)) {
  throw new Error('build_research_pack incomplet');
}
if (researchPack.claims?.some((claim) => claim.language !== 'fr')) {
  throw new Error('build_research_pack duplique des claims anglaises');
}
console.log('build_research_pack(en) -> documents:', researchPack.documents.length, '| claims:', researchPack.claims.length, '| replay:', researchPack.asOf?.replayable);

const historicalPack = await call('build_research_pack', { query: 'dollar yen', language: 'fr', asOf: '2026-03-12', limit: 2 });
if (historicalPack.asOf?.replayable !== false) throw new Error('build_research_pack doit signaler un asOf antérieur à la genesis comme non rejouable');

const recent = await call('list_recent_analyses', { limit: 3 });
console.log('list_recent_analyses ->', recent.count, '; #1:', recent.analyses?.[0]?.title);

const gd = await call('list_guides');
console.log('list_guides ->', gd.count, 'guides');

const byTopic = await call('search_by_topic', { topic: 'crypto', limit: 3 });
console.log('search_by_topic(crypto) ->', byTopic.count, '; label:', byTopic.label);

const claims = await call('get_claims', { kind: 'fait', limit: 3 });
if (!claims.claims?.length || claims.claims.some((claim) => claim.kind !== 'fait')) throw new Error('get_claims ne filtre pas les faits');
console.log('get_claims(fait) ->', claims.count, '; #1:', claims.claims?.[0]?.articleSlug);

const articleClaims = await call('get_claims', { articleSlug: 'dollar-yen-intervention-risque-carry-2026', limit: 5 });
const dollarYenClaimId = articleClaims.claims?.[0]?.id;
if (!dollarYenClaimId) throw new Error('get_claims ne renvoie aucune claim dollar-yen');
console.log('get_claims(article) ->', articleClaims.count, '| #1:', dollarYenClaimId);

const englishArticleClaims = await call('get_claims', { articleSlug: 'dollar-yen-intervention-carry-unwind', language: 'en', limit: 5 });
if (!englishArticleClaims.claims?.length || englishArticleClaims.claims[0].articleSlug !== 'dollar-yen-intervention-risque-carry-2026') {
  throw new Error('get_claims ne résout pas la traduction vers les claims françaises');
}
if (englishArticleClaims.claims.some((item) => item.language !== 'fr')) {
  throw new Error('get_claims duplique des claims anglaises');
}
console.log('get_claims(en) -> canonical:', englishArticleClaims.claims[0].articleSlug, '| claims:', englishArticleClaims.count);

const claim = await call('get_claims', { claimId: dollarYenClaimId });
if (claim.claims?.length !== 1) throw new Error('get_claims(claimId) doit renvoyer une seule claim');
console.log('get_claims(claimId) ->', claim.claimId, '| kind:', claim.claims?.[0]?.kind);

const unknownClaim = await callExpectError('get_claims', { claimId: 'claim-inconnue' });
console.log('get_claims(error) ->', unknownClaim.error);

const claimEvidence = await call('get_claims', { claimId: dollarYenClaimId, includeEvidence: true });
if (claimEvidence.evidence?.proofDepth === 'preuve directe') {
  throw new Error('get_claim_evidence ne doit pas attribuer preuve directe automatiquement');
}
const claimEvidenceHasDate = (claimEvidence.references || []).some((reference) => reference.sourcePublicationDate || reference.date);
if (!claimEvidenceHasDate && /datée/.test(claimEvidence.evidence?.proofDepth || '')) {
  throw new Error(`niveau de preuve daté sans date source: ${claimEvidence.evidence?.proofDepth}`);
}
if (!claimEvidence.directEvidence?.nodes?.length) throw new Error('get_claims sans section directEvidence');
if (!claimEvidence.relatedContent?.nodes) throw new Error('get_claims sans section relatedContent');
console.log(
  'get_claims(evidence) -> depth:',
  claimEvidence.evidence?.proofDepth,
  '| direct:',
  claimEvidence.directEvidence?.nodes?.length,
  '| related:',
  claimEvidence.relatedContent?.nodes?.length
);

const claimsBySource = await call('get_claims', { sourceId: 'fred.stlouisfed.org', limit: 3 });
console.log('get_claims(source) ->', claimsBySource.count);

const source = await call('list_sources', { sourceId: 'federal-reserve-fred', includeClaims: true, limit: 3 });
console.log('list_sources(federal-reserve-fred) ->', source.sourceType, '| claims:', source.claimsCount);

const unknownSource = await callExpectError('list_sources', { sourceId: 'source-inconnue' });
console.log('list_sources(error) ->', unknownSource.error);

const graph = await call('get_evidence_graph', { articleSlug: 'dollar-yen-intervention-risque-carry-2026', limit: 30 });
if (!graph.directEvidence?.nodes?.length) throw new Error('get_evidence_graph sans section directEvidence');
console.log('get_evidence_graph -> nodes:', graph.returned?.nodes, '| edges:', graph.returned?.edges, '| related:', graph.relatedContent?.nodes?.length);

const sources = await call('list_sources', { mode: 'both', limit: 3 });
console.log('list_sources -> primary:', sources.primarySources?.length, '| hosts:', sources.referenceHosts?.length);

const freshness = await call('get_freshness', { limit: 3 });
if (!freshness.signalFreshness?.length) throw new Error('get_freshness sans fraîcheur par signal');
console.log('get_freshness -> latest:', freshness.latest?.length, '| signals:', freshness.signalFreshness?.length);

const integrity = await call('get_integrity', { path: '/api/v1/evidence-graph.json' });
console.log('get_integrity -> snapshots:', integrity.count, '| algo:', integrity.algorithm);

const verified = await call('verify_artifact', { path: '/api/v1/evidence-graph.json' });
console.log('verify_artifact -> expected:', Boolean(verified.expectedSha256), '| verified:', verified.verified);

const changefeed = await call('get_changefeed', { contentType: 'article', limit: 3 });
if (!changefeed.entries?.[0]?.objectId || !changefeed.entries?.[0]?.currentVersion) {
  throw new Error('get_changefeed sans métadonnées de version');
}
console.log('get_changefeed(article) ->', changefeed.count, '| diff:', changefeed.entries?.[0]?.diffStatus);

const changes = await call('get_changes', { contentType: 'article', since: '2026-06-27', limit: 3 });
if (!changes.entries?.[0]?.semanticChange) throw new Error('get_changes sans semanticChange');
console.log('get_changes(article) ->', changes.count, '| semantic:', changes.entries?.[0]?.semanticChange);

const art = await call('get_article', { slug: 'economie-des-intentions', limit: 5000 });
if (!art.nextOffset || !art.nextCursor || !art.truncated) throw new Error('get_article ne fournit pas de continuation sur article long');
if (!Array.isArray(art.references)) throw new Error('get_article ne renvoie pas les références séparées');
console.log('get_article(page 1) -> title:', art.title, '| chars:', art.textChars, '/', art.totalChars, '| next:', art.nextOffset, '| cursor:', Boolean(art.nextCursor));

const englishArt = await call('get_article', { slug: 'ai-and-productivity', language: 'en', limit: 5000 });
if (englishArt.language !== 'en' || englishArt.canonicalId !== 'article:ia-et-productivite-entre-gains-mesures-et-effets-supposes') {
  throw new Error('get_article(language=en) sans mapping canonique');
}
if (!englishArt.text?.toLowerCase().includes('productivity')) throw new Error('get_article(language=en) sans texte anglais');
console.log('get_article(en) ->', englishArt.canonicalId, '| chars:', englishArt.textChars);

const artNext = await call('get_article', { slug: 'economie-des-intentions', cursor: art.nextCursor });
if (artNext.offset !== art.nextOffset) throw new Error('get_article(cursor) ne reprend pas au bon offset');
console.log('get_article(page 2) -> offset:', artNext.offset, '| chars:', artNext.textChars, '| next:', artNext.nextOffset);

const artSources = await call('get_article', { slug: 'economie-des-intentions', section: 'sources', limit: 12000 });
if (!artSources.sectionFound || !artSources.text?.toLowerCase().includes('sources principales')) {
  throw new Error('get_article(section=sources) ne retrouve pas les sources');
}
console.log('get_article(sources) -> offset:', artSources.offset, '| chars:', artSources.textChars);

const badArticle = await callExpectError('get_article', { slug: '../../etc/passwd' });
console.log('get_article(path traversal) -> error:', badArticle.error);

await expectReadResourceFailure('l0g://claims/claim-inconnue');
await expectReadResourceFailure('l0g://sources/source-inconnue');
await expectReadResourceFailure('l0g://articles/article-inconnu');
await expectReadResourceFailure('l0g://signals/signal-inconnu/current');
await expectReadResourceFailure('l0g://methodologies/methodologie-inconnue');

const usageUrl = `${URL_.replace(/\/$/, '')}/usage`;
const usageResponse = await fetch(usageUrl, { headers: { Accept: 'application/json' } });
if (!usageResponse.ok) throw new Error(`usage report HTTP ${usageResponse.status}`);
const usage = await usageResponse.json();
if (usage.schema_version !== '1.0.0' || usage.retention_days !== 91 || !usage.totals) {
  throw new Error('usage report incomplet');
}
if (usage.enabled && (usage.totals.initializations < 1 || usage.totals.tool_calls < 1 || usage.totals.resource_reads < 1 || usage.totals.prompt_gets < 1)) {
  throw new Error('usage report actif sans compteurs MCP attendus');
}
if (/ip|address|fingerprint|user.?agent/i.test(JSON.stringify(Object.keys(usage.measurement || {})))) {
  throw new Error('usage report expose une dimension identifiante');
}
console.log('usage -> enabled:', usage.enabled, '| init:', usage.totals.initializations, '| tools:', usage.totals.tool_calls, '| resources:', usage.totals.resource_reads, '| prompts:', usage.totals.prompt_gets);

await client.close();
console.log('OK');
