import { MAX_ROWS, VERSION, digest, safeEvidenceUrl } from './storage.mjs';
import { requiredString, timestamp, count } from './imports.mjs';

export const FIDELITY = ['supports', 'partially_supports', 'does_not_support', 'outdated_for_claim', 'not_reviewed', 'source_unavailable'];
const EXECUTION = ['valid', 'error', 'quota', 'refused', 'search_unavailable'];
export function validatePanel(panel) {
  if (!['1.0', VERSION].includes(panel.schema_version) || !Array.isArray(panel.questions) || !panel.questions.length || panel.questions.length > MAX_ROWS || panel.paid_execution_enabled !== false) throw new Error('panel_schema_invalid');
  requiredString(panel.panel_version, 'panel_version', 120);
  const ids = new Set(), pairs = new Map();
  for (const q of panel.questions) {
    for (const field of ['id', 'pair_id', 'topic', 'intent', 'prompt']) requiredString(q[field], field, field === 'prompt' ? 4000 : 150);
    if (!['fr', 'en'].includes(q.language) || !['branded', 'brand_diagnostic', 'unbranded'].includes(q.brand_mode) || typeof q.pilot !== 'boolean' || ids.has(q.id)) throw new Error('panel_question_invalid');
    ids.add(q.id);
    if (!pairs.has(q.pair_id)) pairs.set(q.pair_id, []);
    pairs.get(q.pair_id).push(q);
  }
  for (const pair of pairs.values()) {
    if (pair.length !== 2 || new Set(pair.map(q => q.language)).size !== 2 || new Set(pair.map(q => `${q.topic}|${q.brand_mode}|${q.pilot}`)).size !== 1) throw new Error('panel_pair_invalid');
  }
  return { ...panel, content_hash: digest(panel.questions), imported_at: new Date().toISOString() };
}

export function validateCoverage(document, panel) {
  if (!panel || document.schema_version !== VERSION || document.panel_version !== panel.panel_version || document.panel_hash !== panel.content_hash || !Array.isArray(document.questions)) throw new Error('coverage_panel_mismatch');
  const reviewedAt = timestamp(document.reviewed_at);
  requiredString(document.reviewer, 'reviewer');
  const ids = new Set(panel.questions.map(q => q.id)), seen = new Set();
  for (const row of document.questions) {
    if (!ids.has(row.question_id) || seen.has(row.question_id) || !['supported_in_scope', 'partial', 'not_covered', 'not_reviewed'].includes(row.status)) throw new Error('coverage_question_invalid');
    seen.add(row.question_id);
    requiredString(row.reason, 'coverage_reason', 4000);
    if (!Array.isArray(row.evidence) || row.evidence.length > 20) throw new Error('coverage_evidence_invalid');
    for (const proof of row.evidence) {
      if (new URL(safeEvidenceUrl(proof.url)).origin !== 'https://l0g.fr') throw new Error('coverage_source_invalid');
      requiredString(proof.locator, 'locator', 1000);
    }
  }
  return { ...document, reviewed_at: reviewedAt, state: seen.size === ids.size && document.questions.every(q => q.status !== 'not_reviewed') ? 'measured' : 'partial' };
}

export function brandMention(text) {
  if (/(?<![\p{L}\p{N}_.@/-])l0g(?:\.fr)?(?![\p{L}\p{N}_-]|\.[\p{L}\p{N}])/iu.test(text)) return true;
  return [...text.matchAll(/https?:\/\/[^\s<>"'()]+/gi)].some(match => {
    try { return new URL(match[0]).hostname === 'l0g.fr'; } catch { return false; }
  });
}

export function normalizeCitation(citation, subdomains = []) {
  if (!Array.isArray(subdomains) || subdomains.some(host => typeof host !== 'string' || !/^(?:[a-z0-9-]+\.)+l0g\.fr$/.test(host))) throw new Error('subdomain_allowlist_invalid');
  if (!['final', 'consulted', 'link'].includes(citation.kind)) throw new Error('citation_kind_invalid');
  const normalized = safeEvidenceUrl(requiredString(citation.url, 'citation_url', 4000));
  const url = new URL(normalized);
  const host = url.hostname.toLowerCase();
  const scope = host === 'l0g.fr' ? 'main' : subdomains.includes(host) ? 'allowed_subdomain' : 'external';
  const fidelity = citation.review?.status ?? 'not_reviewed';
  if (!FIDELITY.includes(fidelity)) throw new Error('citation_review_invalid');
  let review = { status: 'not_reviewed' };
  if (fidelity !== 'not_reviewed') {
    if (!['human', 'automatic'].includes(citation.review.method)) throw new Error('review_method_required');
    review = { status: fidelity, method: citation.review.method, reviewer: requiredString(citation.review.reviewer, 'reviewer', 150), at: timestamp(citation.review.at), reason: requiredString(citation.review.reason, 'reason', 4000), excerpt: fidelity === 'source_unavailable' && citation.review.excerpt === null ? null : requiredString(citation.review.excerpt, 'excerpt', 4000) };
  }
  return { url: normalized, normalized_url: url.href, scope, kind: citation.kind, claim: citation.claim === undefined ? null : requiredString(citation.claim, 'claim', 4000), review };
}

export function normalizeObservations(document, panel, subdomains = []) {
  if (!panel || document.schema_version !== VERSION || document.panel_version !== panel.panel_version) throw new Error('observation_panel_mismatch');
  const run = document.run;
  if (!run || !['manual_ui', 'api'].includes(run.surface) || typeof run.domain_forced !== 'boolean' || run.isolated_context !== true) throw new Error('run_protocol_invalid');
  for (const key of ['id', 'provider', 'model', 'region', 'session_protocol']) requiredString(run[key], key, 2000);
  if (!run.parameters || typeof run.parameters !== 'object' || Array.isArray(run.parameters)) throw new Error('parameters_required');
  if (!Array.isArray(document.planned) || !document.planned.length || document.planned.length > MAX_ROWS || !Array.isArray(document.observations) || document.observations.length > document.planned.length) throw new Error('observation_plan_invalid');
  const questions = new Map(panel.questions.map(q => [q.id, q]));
  const key = row => `${row.question_id}:${row.repetition}`;
  const planned = new Set();
  for (const row of document.planned) {
    if (!questions.has(row.question_id) || !Number.isSafeInteger(row.repetition) || row.repetition < 1 || row.repetition > 100 || planned.has(key(row))) throw new Error('planned_question_invalid');
    planned.add(key(row));
  }
  const seen = new Set();
  const observations = document.observations.map(row => {
    if (!planned.has(key(row)) || seen.has(key(row)) || !EXECUTION.includes(row.status)) throw new Error('observation_invalid');
    seen.add(key(row));
    if (!['observed', 'not_observed', 'unknown'].includes(row.web_search)) throw new Error('web_search_invalid');
    if (!['fr', 'en', 'unknown', 'other'].includes(row.response_language)) throw new Error('response_language_invalid');
    const question = questions.get(row.question_id);
    const answer = row.answer ?? '';
    if (typeof answer !== 'string' || answer.length > 200_000) throw new Error('answer_size_invalid');
    const citations = [], citationKeys = new Set();
    if (!Array.isArray(row.citations) || row.citations.length > 200) throw new Error('citations_invalid');
    for (const citation of row.citations) {
      const normalized = normalizeCitation(citation, subdomains);
      const id = `${normalized.kind}:${normalized.normalized_url}:${normalized.claim ?? ''}`;
      if (!citationKeys.has(id)) { citationKeys.add(id); citations.push(normalized); }
    }
    if (row.intermediate_queries !== 'not_available' && (!Array.isArray(row.intermediate_queries) || row.intermediate_queries.some(q => typeof q !== 'string' || q.length > 4000))) throw new Error('intermediate_queries_invalid');
    const cost = row.cost === null ? null : { amount: count(row.cost?.amount, 'cost', false), currency: requiredString(row.cost?.currency, 'currency', 10) };
    if (cost && (cost.amount === null || !/^[A-Z]{3}$/.test(cost.currency))) throw new Error('cost_invalid');
    const valid = row.status === 'valid' && row.response_language === question.language && row.web_search === 'observed';
    return { question_id: question.id, pair_id: question.pair_id, topic: question.topic, intent: question.intent, language: question.language, brand_mode: question.brand_mode, repetition: row.repetition, at: timestamp(row.at), duration_ms: count(row.duration_ms, 'duration_ms'), status: row.status, response_language: row.response_language, web_search: row.web_search, eligible: valid, exclusion: row.status !== 'valid' ? row.status : row.response_language !== question.language ? 'wrong_or_unknown_language' : row.web_search !== 'observed' ? 'web_search_not_observed' : null, answer, brand_mention: brandMention(answer), citations, intermediate_queries: row.intermediate_queries, cost };
  });
  return { schema_version: VERSION, panel_version: panel.panel_version, panel_hash: panel.content_hash, run: { id: run.id, provider: run.provider, surface: run.surface, model: run.model, region: run.region, parameters: run.parameters, session_protocol: run.session_protocol, isolated_context: true, domain_forced: run.domain_forced }, planned: document.planned, observations };
}

export function panelMetrics(batches) {
  const results = [];
  for (const batch of batches) {
    const scopes = new Map();
    // Do not silently pool waves, providers, surfaces, unknown models, regional
    // contexts, FR/EN, branded questions or domain-forced diagnostics.
    for (const row of batch.observations) {
      const key = `${row.language}:${row.brand_mode}`;
      if (!scopes.has(key)) scopes.set(key, []);
      scopes.get(key).push(row);
    }
    for (const rows of scopes.values()) {
      const valid = rows.filter(r => r.eligible);
      const cited = valid.filter(r => r.citations.some(c => c.kind === 'final' && c.scope === 'main'));
      const finals = valid.flatMap(r => r.citations.filter(c => c.kind === 'final' && c.scope === 'main'));
      const reviewed = finals.filter(c => c.review.method === 'human' && !['not_reviewed', 'source_unavailable'].includes(c.review.status));
      const questions = new Set(valid.map(r => r.question_id));
      const citedQuestions = new Set(cited.map(r => r.question_id));
      results.push({ panel_version: batch.panel_version, run: batch.run, language: rows[0].language, brand_mode: rows[0].brand_mode,
        state: !valid.length ? 'no_data' : valid.length < rows.length ? 'partial' : 'measured', spontaneous: rows[0].brand_mode === 'unbranded' && !batch.run.domain_forced,
        valid: valid.length, observed: rows.length,
        citation_rate: { numerator: cited.length, denominator: valid.length, value: valid.length ? cited.length / valid.length : null },
        question_coverage: { numerator: citedQuestions.size, denominator: questions.size, value: questions.size ? citedQuestions.size / questions.size : null },
        mentions: valid.filter(r => r.brand_mention).length,
        links: valid.flatMap(r => r.citations.filter(c => c.kind === 'link' && c.scope === 'main')).length,
        subdomain_final_citations: Object.fromEntries([...new Set(valid.flatMap(r => r.citations.filter(c => c.kind === 'final' && c.scope === 'allowed_subdomain').map(c => new URL(c.url).hostname)))].map(host => [host, valid.flatMap(r => r.citations.filter(c => c.kind === 'final' && new URL(c.url).hostname === host)).length])),
        fidelity: { numerator: reviewed.filter(c => c.review.status === 'supports').length, denominator: reviewed.length, total_final_citations: finals.length, human_review_count: finals.filter(c => c.review.method === 'human').length, automatic_evaluations: finals.filter(c => c.review.method === 'automatic').length, states: Object.fromEntries(FIDELITY.map(s => [s, finals.filter(c => c.review.status === s).length])), rule: 'Human reviews only; unavailable sources excluded; partial/disagreement/outdated included in denominator.' },
        by_question: [...questions].map(id => ({ id, topic: valid.find(r => r.question_id === id).topic, valid: valid.filter(r => r.question_id === id).length, cited: cited.filter(r => r.question_id === id).length, repetitions: rows.filter(r => r.question_id === id).map(r => r.repetition) })),
        exclusions: rows.filter(r => !r.eligible).map(r => ({ question_id: r.question_id, repetition: r.repetition, reason: r.exclusion })),
        evidence: batch.evidence,
      });
    }
    results.push({ type: 'execution', panel_version: batch.panel_version, run: batch.run, valid: batch.observations.filter(r => r.eligible).length, planned: batch.planned.length, observed: batch.observations.length, missing: batch.planned.length - batch.observations.length, statuses: Object.fromEntries(EXECUTION.map(s => [s, batch.observations.filter(r => r.status === s).length])), evidence: batch.evidence });
  }
  return results;
}
