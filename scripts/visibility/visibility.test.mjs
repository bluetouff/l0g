import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, realpath, rm, stat, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import vm from 'node:vm';
import { ROOT, VERSION, privateDirectory, locked, readPrivate, writePrivate, readBounded, parseJson, csv, cleanUrl, safeEvidenceUrl } from './storage.mjs';
import { normalizeSearchImport, mergeImports, searchSummary, csvDocument } from './imports.mjs';
import { validatePanel, validateCoverage, normalizeObservations, normalizeCitation, brandMention, panelMetrics } from './panel.mjs';
import { privateTraffic } from './traffic.mjs';
import { buildReport, freshness } from './report.mjs';
import { inspectHtml, metadataFindings, translationFindings } from './audit.mjs';
import { allowedUrl, publicAddress, probeLive } from './network.mjs';
import { changedUrls, notifyIndexNow } from './indexnow.mjs';
import { main } from './cli.mjs';
import { schedule } from './schedule.mjs';
import { organizationEntity, authorEntity, websiteEntity, ORGANIZATION_ID, AUTHOR_ID } from '../../src/config/entities.ts';
import { serializeInlineScriptData } from '../../src/lib/security.ts';

async function fixture(t) {
  const dir = await mkdtemp(join(await realpath(tmpdir()), 'l0g-visibility-test-'));
  t.after(() => rm(dir, { recursive: true, force: true }));
  return dir;
}
function search(overrides = {}) {
  return { schema_version: VERSION, source: 'gsc', format: 'normalized-v1', metadata: { property: 'sc-domain:l0g.fr', report: 'performance', period: { from: '2026-01-01', through: '2026-01-31' }, exported_at: '2026-02-01T00:00:00Z', timezone: 'America/Los_Angeles', dimensions: ['page'], filters: {}, complete: true, limitations: ['Synthetic test.'] }, rows: [{ dimensions: { page: 'https://l0g.fr/example/?utm_source=synthetic' }, metrics: { clicks: 10, impressions: 100, position: 2 } }], ...overrides };
}
function panel() {
  return validatePanel({ schema_version: '1.0', panel_version: 'synthetic-v1', paid_execution_enabled: false, questions: ['fr', 'en'].map(language => ({ id: `synthetic-${language}`, pair_id: 'synthetic', topic: 'test', language, brand_mode: 'unbranded', intent: 'mechanism', prompt: language === 'fr' ? 'Question synthétique ?' : 'Synthetic question?', pilot: true })) });
}
function observations(overrides = {}) {
  return { schema_version: VERSION, panel_version: 'synthetic-v1', run: { id: 'synthetic-run', provider: 'synthetic-provider', surface: 'manual_ui', model: 'unknown', region: 'unknown', parameters: {}, isolated_context: true, domain_forced: false, session_protocol: 'Synthetic isolated test, no memory, files or MCP.' }, planned: [{ question_id: 'synthetic-fr', repetition: 1 }], observations: [{ question_id: 'synthetic-fr', repetition: 1, at: '2026-02-01T00:00:00Z', duration_ms: 100, status: 'valid', response_language: 'fr', web_search: 'observed', answer: 'l0g explique le mécanisme.', citations: [], intermediate_queries: 'not_available', cost: null }], ...overrides };
}

test('private storage rejects repository, served roots, ancestors, traversal, and symlink destinations', async t => {
  const dir = await fixture(t);
  for (const path of [ROOT, join(ROOT, 'public/private-data'), '/var/www/html/visibility', '/srv/www/private-data', '/']) await assert.rejects(privateDirectory(path), /forbidden/);
  await symlink(ROOT, join(dir, 'repo'));
  await assert.rejects(privateDirectory(join(dir, 'repo/private-data')), /forbidden/);
  await mkdir(join(dir, 'outside'));
  await symlink(join(dir, 'outside'), join(dir, 'alias'));
  await assert.rejects(privateDirectory(join(dir, 'alias/sub')), /symlink/);
  const store = await privateDirectory(join(dir, 'store'));
  await writePrivate(store, 'value.json', { ok: true });
  assert.equal((await stat(store)).mode & 0o777, 0o700);
  assert.equal((await stat(join(store, 'value.json'))).mode & 0o777, 0o600);
  assert.deepEqual(await readPrivate(store, 'value.json'), { ok: true });
  await assert.rejects(writePrivate(store, '../escape.json', {}), /filename/);
  await symlink(join(store, 'value.json'), join(store, 'alias.json'));
  await assert.rejects(writePrivate(store, 'alias.json', {}), /symlink/);
  await assert.rejects(readBounded(join(store, 'alias.json')));
  await assert.rejects(privateDirectory(store, [dir]), /forbidden/);
});

test('atomic writes and lock protect concurrent execution; release after failure', async t => {
  const dir = await fixture(t);
  await locked(dir, async () => {
    await assert.rejects(locked(dir, () => {}), /locked/);
    await writePrivate(dir, 'value.json', { version: 1 });
    assert.deepEqual(await readPrivate(dir, 'value.json'), { version: 1 });
  });
  await assert.rejects(locked(dir, () => { throw new Error('expected'); }), /expected/);
  await locked(dir, () => {});
});

test('inputs have size/depth/prototype limits and CSV output neutralizes formulas', async t => {
  const dir = await fixture(t);
  await writeFile(join(dir, 'large'), 'x'.repeat(8 * 1024 * 1024 + 1));
  await assert.rejects(readBounded(join(dir, 'large')), /size/);
  assert.throws(() => parseJson('['.repeat(30) + ']'.repeat(30)), /depth/);
  assert.throws(() => parseJson('{"__proto__":{}}'), /forbidden/);
  const output = csv([{ a: '=SUM(1)', b: '\t+1', c: '"quoted"', d: 'ordinary' }], ['a', 'b', 'c', 'd']);
  assert.match(output, /'=SUM/); assert.match(output, /'\t\+1/); assert.match(output, /""quoted""/);
});

test('tracking cleanup preserves functional and signed link parameters', () => {
  const clean = new URL(cleanUrl('https://example.test/search?q=repo%20rate&v=42&utm_source=synthetic#g'));
  assert.equal(clean.searchParams.get('q'), 'repo rate'); assert.equal(clean.searchParams.get('v'), '42');
  assert.equal(clean.searchParams.has('utm_source'), false); assert.ok(clean.search.includes('repo%20rate'));
  const signed = 'https://example.test/document?q=repo%20rate&signature=a%2Fb&utm_source=signed';
  assert.equal(cleanUrl(signed), signed);
  assert.throws(() => safeEvidenceUrl(signed), /sensitive/);
  assert.throws(() => safeEvidenceUrl('https://user:password@example.test/'), /invalid/);
  assert.throws(() => safeEvidenceUrl('https://chatgpt.com/c/synthetic-private'), /conversation/);
});

test('search imports retain native dates, missing values, separate grains and weighted CTR', () => {
  const input = search(); input.rows.push({ dimensions: { page: 'https://l0g.fr/another/' }, metrics: { clicks: 20, impressions: 1000, position: 3 } });
  const result = normalizeSearchImport('gsc', input), summary = searchSummary(result);
  assert.equal(summary.ctr, 30 / 1100); assert.equal(result.metadata.timezone, 'America/Los_Angeles');
  assert.equal(result.rows[0].dimensions.page, 'https://l0g.fr/example/');
  result.rows[1].metrics.impressions = null;
  assert.equal(searchSummary(result).ctr, null);
  assert.throws(() => normalizeSearchImport('bing', input), /schema/);
  assert.throws(() => normalizeSearchImport('gsc', { ...input, schema_version: 'unknown' }), /schema/);
  const partial = normalizeSearchImport('gsc', search()); partial.metadata.complete = false;
  assert.equal(searchSummary(partial).state, 'partial');
  const empty = normalizeSearchImport('gsc', search({ rows: [] }));
  assert.equal(searchSummary(empty).state, 'no_data');
});

test('identical reimports are idempotent, overlaps rejected, exact replacement explicit', () => {
  const first = { ...normalizeSearchImport('gsc', search()), content_hash: 'one' };
  assert.equal(mergeImports([first], first).length, 1);
  const second = { ...first, content_hash: 'two' };
  assert.throws(() => mergeImports([first], second), /overlap/);
  assert.equal(mergeImports([first], second, true)[0].content_hash, 'two');
  const overlap = structuredClone(second); overlap.metadata.period.from = '2026-01-15';
  assert.throws(() => mergeImports([first], overlap, true), /overlap/);
  const query = { ...first, grain_id: 'different-projection', content_hash: 'three' };
  assert.equal(mergeImports([first], query).length, 2);
});

test('normalized CSV has explicit metadata, missing metrics, and rejects native/unknown layouts', () => {
  const result = csvDocument('gsc', 'page,clicks,impressions,position\nhttps://l0g.fr/example/,5,100,\n', search().metadata);
  assert.equal(result.rows[0].metrics.position, null);
  assert.throws(() => csvDocument('gsc', 'Top pages,Clicks\na,1', search().metadata), /schema/);
  assert.throws(() => csvDocument('gsc', 'page,clicks\na,1', null), /metadata/);
  assert.throws(() => csvDocument('gsc', 'page,clicks,impressions\nhttps://l0g.fr/,bad,10', search().metadata), /number/);
  assert.throws(() => csvDocument('gsc', 'page,clicks\nhttps://l0g.fr/,1,2\n', search().metadata), /shape/);
  const bad = search(); bad.rows[0].metrics.clicks = -1;
  assert.throws(() => normalizeSearchImport('gsc', bad), /clicks/);
});

test('panel pairs are versioned, branded series separate and no paid execution enabled', () => {
  assert.equal(panel().questions.length, 2);
  const invalid = panel(); invalid.paid_execution_enabled = true;
  assert.throws(() => validatePanel(invalid), /schema/);
  const unpaired = panel(); unpaired.questions.pop();
  assert.throws(() => validatePanel(unpaired), /pair/);
  assert.throws(() => normalizeObservations({ ...observations(), panel_version: 'different' }, panel()), /mismatch/);
});

test('coverage review is bound to the exact private panel and does not imply a measured citation', () => {
  const definition = panel();
  const review = { schema_version: VERSION, panel_version: definition.panel_version, panel_hash: definition.content_hash, reviewer: 'synthetic reviewer', reviewed_at: '2026-02-01T00:00:00Z', questions: [{ question_id: 'synthetic-fr', status: 'partial', reason: 'Only one mechanism covered.', evidence: [{ url: 'https://l0g.fr/synthetic-example/', locator: 'Synthetic section' }] }] };
  assert.equal(validateCoverage(review, definition).state, 'partial');
  assert.throws(() => validateCoverage({ ...review, panel_hash: 'wrong' }, definition), /mismatch/);
  assert.equal(buildReport({ panel: definition, coverage: review }).summary.panel.state, 'no_data');
});

test('mention, final citation, consulted source, imitation and subdomain are distinct', () => {
  assert.equal(brandMention('A catalogue of logarithms'), false);
  assert.equal(brandMention('Selon l0g, cette analyse'), true);
  assert.equal(brandMention('l0g.fr.example.org'), false);
  assert.equal(brandMention('Read https://l0g.fr/example/'), true);
  assert.equal(brandMention('Read https://example.org/l0g.fr'), false);
  const input = observations();
  input.observations[0].citations = [
    { url: 'https://l0g.fr/example/?utm_source=synthetic', kind: 'final' },
    { url: 'https://l0g.fr/example/', kind: 'final' },
    { url: 'https://l0g.fr/example/#source', kind: 'final' },
    { url: 'https://l0g.fr/other/', kind: 'consulted' },
    { url: 'https://l0g.fr.example.org/', kind: 'final' },
    { url: 'https://watch.l0g.fr/', kind: 'final' },
  ];
  const normalized = normalizeObservations(input, panel(), ['watch.l0g.fr']);
  assert.equal(normalized.observations[0].citations.length, 5);
  assert.deepEqual(normalized.observations[0].citations.map(c => c.scope), ['main', 'main', 'main', 'external', 'allowed_subdomain']);
  assert.equal(normalized.run.model, 'unknown');
  const metrics = panelMetrics([normalized])[0];
  assert.equal(metrics.citation_rate.numerator, 1); assert.equal(metrics.fidelity.denominator, 0);
  assert.equal(metrics.fidelity.states.not_reviewed, 2);
  const mentionOnly = panelMetrics([normalizeObservations(observations(), panel())])[0];
  assert.equal(mentionOnly.mentions, 1); assert.equal(mentionOnly.citation_rate.numerator, 0);
});

test('errors, wrong language and absent search are excluded without treating failures as no citations', () => {
  const input = observations();
  input.planned = [1, 2, 3, 4, 5].map(repetition => ({ question_id: 'synthetic-fr', repetition }));
  input.observations = [1, 2, 3, 4].map(repetition => ({ ...input.observations[0], repetition }));
  input.observations[1].status = 'error'; input.observations[2].response_language = 'en'; input.observations[3].web_search = 'unknown';
  const [m, execution] = panelMetrics([normalizeObservations(input, panel())]);
  assert.equal(m.citation_rate.denominator, 1); assert.equal(m.exclusions.length, 3);
  assert.equal(execution.planned, 5); assert.equal(execution.valid, 1); assert.equal(execution.missing, 1);
});

test('automatic fidelity never masquerades as human review', () => {
  const input = observations();
  const review = { status: 'supports', method: 'automatic', reviewer: 'synthetic', at: '2026-02-01T00:00:00Z', reason: 'Synthetic evidence.', excerpt: 'Synthetic passage.' };
  input.observations[0].citations = [{ url: 'https://l0g.fr/example/', kind: 'final', review }];
  assert.equal(panelMetrics([normalizeObservations(input, panel())])[0].fidelity.denominator, 0);
  review.method = 'human';
  assert.equal(panelMetrics([normalizeObservations(input, panel())])[0].fidelity.denominator, 1);
  assert.throws(() => normalizeCitation({ url: 'https://l0g.fr/', kind: 'final', review: { status: 'supports' } }), /required/);
  const unavailable = normalizeCitation({ url: 'https://l0g.fr/example/', kind: 'final', review: { ...review, status: 'source_unavailable', reason: 'Synthetic unavailable source.', excerpt: null } });
  assert.equal(unavailable.review.excerpt, null, 'An unavailable source must not require an invented quotation.');
});

test('traffic consumes sensitive log fields transiently, suppresses small cohorts and preserves classes', () => {
  const line = (path, ua, ref = 'https://chatgpt.com/c/synthetic-conversation?utm_source=secret') => `203.0.113.9 - - [01/Feb/2026:12:00:00 +0100] "GET ${path} HTTP/2.0" 200 42 "${ref}" "${ua}"`;
  const lines = ['/example/?utm_source=secret#private', '/api/mcp', '/wp-login.php'].flatMap(path => Array(5).fill(line(path, 'Mozilla/5.0')));
  lines.push(...Array(5).fill(line('/example/', 'Googlebot/2.1')));
  lines.push(...Array(5).fill(line('/example/', 'l0g-visibility-probe/1.0')));
  lines.push(...Array(5).fill(line('/example/', 'Twitterbot/1.0')));
  lines.push(...Array(5).fill(line('/ordinary/', 'Mozilla/5.0', 'https://ordinary.example/')));
  lines.push(line('/small/', 'Mozilla/5.0', 'https://rare.example/'));
  const result = privateTraffic(lines, new Date('2026-02-01T18:00:00Z'));
  const serialized = JSON.stringify(result);
  for (const value of ['203.0.113', 'utm_', 'synthetic-conversation', 'Mozilla', 'rare.example', '#private']) assert.equal(serialized.includes(value), false, value);
  assert.deepEqual(new Set(result.cells.map(c => c.category)), new Set(['human_html', 'mcp_api', 'scans', 'known_crawlers', 'internal_probe', 'social_previews']));
  assert.equal(result.cells.find(c => c.category === 'human_html').referrer, 'chatgpt.com');
  assert.equal(result.cells.find(c => c.category === 'known_crawlers').crawler_authenticity, 'declared_only');
  assert.equal('total' in result, false); assert.equal(result.minimum_cohort, 5); assert.equal(result.retention_days, 91);
});

test('network validates hostnames, credentials, ports and public IPv4/IPv6 including redirects', async () => {
  for (const ip of ['127.0.0.1', '10.1.2.3', '169.254.169.254', '100.64.0.1', '192.168.1.1', '::1', '::ffff:127.0.0.1', 'fe80::1', 'fc00::1', '2001:db8::1', '2002:7f00:1::']) assert.equal(publicAddress(ip), false, ip);
  assert.equal(publicAddress('1.1.1.1'), true); assert.equal(publicAddress('2606:4700:4700::1111'), true);
  for (const url of ['http://l0g.fr/', 'https://l0g.fr.example.org/', 'https://127.0.0.1/', 'https://user:pass@l0g.fr/', 'https://l0g.fr:444/']) assert.throws(() => allowedUrl(url), /forbidden/);
  let calls = 0;
  const result = await probeLive([], { maxUrls: 4, rps: 1 }, async url => { calls++; return { status: url.includes('missing') ? 404 : 301, headers: { location: 'https://127.0.0.1/' }, body: '' }; });
  assert.equal(calls, 4); assert.equal(result.state, 'partial');
  assert.equal(result.requests.at(-1).state, 'error');
});

test('malformed traffic is an explicit error or partial import, never an empty successful measurement', () => {
  const now = new Date('2026-02-01T18:00:00Z');
  assert.equal(privateTraffic(['not an Apache combined log'], now).state, 'error');
  const valid = '203.0.113.9 - - [01/Feb/2026:12:00:00 +0100] "GET /example/ HTTP/2.0" 200 42 "-" "Mozilla/5.0"';
  assert.equal(privateTraffic([valid, 'broken'], now).state, 'partial');
  assert.equal(privateTraffic([], now).state, 'no_data');
  assert.throws(() => privateTraffic(Array(20_001).fill(valid), now), /rows_exceeded/);
});

test('complementary suppression prevents a public class total from exposing a small assistant cohort', () => {
  const line = referrer => `203.0.113.9 - - [01/Feb/2026:12:00:00 +0100] "GET /example/ HTTP/2.0" 200 42 "${referrer}" "Mozilla/5.0"`;
  const result = privateTraffic([...Array(5).fill(line('https://chatgpt.com/')), line('https://perplexity.ai/')], new Date('2026-02-01T18:00:00Z'));
  assert.deepEqual(result.cells, [], 'Hiding only the one-request cell would expose it as 6 minus 5.');
});

test('HTML checks preserve intentional noindex and detect canonical, alternates, main content and JSON-LD defects', () => {
  const html = '<html lang="en"><head><title>Example</title><link rel="canonical" href="https://l0g.fr/fr/"><meta name="description" content="Synthetic"><meta name="robots" content="noindex,follow"><script type="application/ld+json">{broken}</script></head><body><main><h1>Example</h1><h2 id="source">Source</h2><a href="#source">Evidence</a></main></body></html>';
  const page = inspectHtml(html, 'https://l0g.fr/en/example/');
  assert.deepEqual(metadataFindings(page).map(f => f.id), ['canonical', 'sitemap-noindex', 'json-ld']);
  assert.deepEqual(metadataFindings({ ...page, invalid_json_ld: false }, false), []);
  assert.equal(page.ids.includes('source'), true); assert.ok(page.main_text_characters > 0);
});

test('shared publisher, author and inline JSON-LD escaping remain consistent', () => {
  assert.equal(organizationEntity['@id'], ORGANIZATION_ID);
  assert.equal(authorEntity['@id'], AUTHOR_ID);
  assert.equal(websiteEntity.publisher['@id'], ORGANIZATION_ID);
  const serialized = serializeInlineScriptData({ name: '</script><script>synthetic()</script>' });
  assert.equal(serialized.includes('<'), false); assert.equal(JSON.parse(serialized).name, '</script><script>synthetic()</script>');
});

test('assembly clocks and comparison window endpoints never become structured revision dates', () => {
  const page = (path, node) => ({ url: `https://l0g.fr${path}`, canonicals: [], robots: '', json_ld: [node] });
  const generated = '2026-02-01T12:34:56Z';
  assert.equal(metadataFindings(page('/status/', { id: 'https://l0g.fr/status/#integrity', dateModified: generated }), false)[0].id, 'assembly-date-as-revision');
  assert.equal(metadataFindings(page('/maintenant/', { id: 'https://l0g.fr/maintenant/#page', dateModified: generated }), false)[0].id, 'assembly-date-as-revision');
  assert.equal(metadataFindings(page('/donnees/', { type: 'Dataset', name: 'catalog.json', dateModified: generated }), false)[0].id, 'assembly-date-as-revision');
  assert.deepEqual(metadataFindings(page('/donnees/', { type: 'Dataset', name: 'risk.json', dateModified: generated }), false), []);
  assert.deepEqual(metadataFindings(page('/preuves/', { id: 'https://l0g.fr/preuves/#changelog', dateModified: '2026-02-01' }), false), []);
});

test('translations need their own canonical and reciprocal alternates, unpaired pages get no invented translation', () => {
  const fr = { url: 'https://l0g.fr/example/', language: 'fr', alternates: [{ language: 'en', url: 'https://l0g.fr/en/example/' }], translation: 'https://l0g.fr/en/example/' };
  const en = { url: 'https://l0g.fr/en/example/', language: 'en', alternates: [{ language: 'fr', url: fr.url }], translation: fr.url };
  assert.deepEqual(translationFindings([fr, en]), []);
  assert.deepEqual(translationFindings([{ ...fr, alternates: [] }, en]).map(f => f.id), ['alternate-missing', 'alternate-reciprocity']);
  assert.deepEqual(translationFindings([{ ...fr, alternates: [], translation: null }]), []);
});

test('private report supports honest empty/stale/demo states, escaped inputs, exports and working filters without network', () => {
  const empty = buildReport({});
  assert.match(empty.html, /non configuré/); assert.equal(empty.summary.connections.paid_apis.budget, 0);
  assert.equal(freshness({ checked_at: '2026-01-01T00:00:00Z' }, 14, new Date('2026-02-01T00:00:00Z')), 'stale');
  const batch = normalizeObservations(observations(), panel()); batch.run.provider = '</script><script>alert(1)</script>';
  const result = buildReport({ batches: [batch], panel: panel(), demo: true });
  assert.match(result.html, /DÉMONSTRATION SYNTHÉTIQUE/); assert.equal(result.html.includes('<script>alert(1)'), false);
  assert.equal(/<(?:script|link|img)\b[^>]*(?:src|href)="https?:/i.test(result.html), false);
  const controls = [{ dataset: { filter: 'language' }, value: '', addEventListener(_event, fn) { this.change = fn; } }];
  const rows = [{ dataset: { language: 'fr' } }, { dataset: { language: 'en' } }];
  const status = {};
  vm.runInNewContext(result.html.match(/<script>([\s\S]*?)<\/script>/)[1], { document: { querySelectorAll: selector => selector === '[data-filter]' ? controls : rows, getElementById: () => status } });
  controls[0].value = 'en'; controls[0].change();
  assert.equal(rows[0].hidden, true); assert.equal(rows[1].hidden, false); assert.match(status.textContent, /^1 /);
  assert.match(result.panelCsv, /numerator/);
});

test('IndexNow dry run is offline, delta-only, idempotent and gated by proof and deployment', async () => {
  const manifest = routes => ({ schema_version: VERSION, successful: true, sha: 'a'.repeat(40), verified_at: new Date().toISOString(), routes });
  const old = manifest([{ url: 'https://l0g.fr/old/', hash: 'b'.repeat(64) }]);
  const current = manifest([{ url: 'https://l0g.fr/new/', hash: 'c'.repeat(64) }]);
  const delta = changedUrls(current, old);
  assert.deepEqual(delta.map(r => r.change), ['added', 'removed']);
  assert.equal(changedUrls(current, old, delta.map(r => r.notification_id)).length, 0);
  assert.equal(changedUrls({ ...current, sha: 'd'.repeat(40) }, old, delta.map(r => r.notification_id)).length, 2, 'A subsequent release or rollback must not inherit a prior release notification receipt.');
  const dry = await notifyIndexNow({ current, previous: old }, () => { throw new Error('network forbidden in dry run'); });
  assert.equal(dry.urls.length, 2); assert.equal(dry.acknowledged_indexation, false);
  await assert.rejects(notifyIndexNow({ current, previous: old, send: true }), /activation/);
  const accepted = await notifyIndexNow({ current, previous: old, send: true, config: { enabled: true, key: 'synthetic-key-1234', key_location: 'https://l0g.fr/synthetic-key-1234.txt' }, live: { served_sha: current.sha, checked_at: new Date().toISOString() }, audit: { routes: [{ url: 'https://l0g.fr/new/', sitemap: true, expected_indexation: 'indexed' }] } }, async url => url.includes('.txt') ? { status: 200, body: 'synthetic-key-1234' } : { status: 202, body: '' });
  assert.equal(accepted.receipt, 'received_key_validation_pending'); assert.equal(accepted.accepted_ids.length, 2);
});

test('schedules are generated privately, disabled and use the actual runtime without invoking systemctl', async t => {
  const dir = await fixture(t);
  const result = await schedule(dir);
  assert.equal(result.installed, false); assert.equal(result.enabled, false);
  const service = await readFile(join(dir, 'l0g-visibility-daily.service'), 'utf8');
  assert.ok(service.includes(process.execPath)); assert.ok(service.includes(' daily --data-dir '));
  assert.match(service, /UMask=0077/);
  assert.match(await readFile(join(dir, 'l0g-visibility-weekly.timer'), 'utf8'), /OnCalendar=Mon/);
});

test('CLI import/report path works offline, repeated imports do not double counts, no write reaches repository', async t => {
  const dir = await fixture(t), data = join(dir, 'private');
  await writeFile(join(dir, 'input.json'), JSON.stringify(search()));
  for (let i = 0; i < 2; i++) await main(['import', '--demo', '--source', 'gsc', '--file', join(dir, 'input.json'), '--data-dir', data]);
  const state = await readPrivate(data, 'state.json'); assert.equal(state.imports.length, 1);
  await main(['report', '--data-dir', data]);
  assert.match(await readFile(join(data, 'report.html'), 'utf8'), /10 \/ 100/);
  assert.match(await readFile(join(data, 'report.html'), 'utf8'), /DÉMONSTRATION SYNTHÉTIQUE/);
  await assert.rejects(main(['import', '--source', 'gsc', '--file', join(dir, 'input.json'), '--data-dir', data]), /mixing/);
  assert.equal((await readPrivate(data, 'report.json')).search[0].ctr, 0.1);
  await writeFile(join(dir, 'panel.json'), JSON.stringify(panel()));
  await main(['import', '--demo', '--source', 'panel-definition', '--file', join(dir, 'panel.json'), '--data-dir', data]);
  await writeFile(join(dir, 'observations.json'), JSON.stringify(observations()));
  await main(['import', '--demo', '--source', 'panel', '--file', join(dir, 'observations.json'), '--data-dir', data]);
  await main(['report', '--data-dir', data]);
  assert.equal((await readPrivate(data, 'report.json')).panel.metrics[0].citation_rate.denominator, 1);
  await writeFile(join(dir, 'empty.log'), '');
  await main(['import', '--demo', '--source', 'traffic', '--file', join(dir, 'empty.log'), '--data-dir', data]);
  const traffic = await readPrivate(data, 'traffic.json');
  assert.match(traffic.evidence.input_sha256, /^[a-f0-9]{64}$/);
  assert.match(traffic.evidence.coverage, /not a claim of complete/);
});
