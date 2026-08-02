import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export const MCP_USAGE_SCHEMA_VERSION = '2.0.0';
export const MCP_USAGE_RETENTION_DAYS = 91;
export const MCP_USAGE_CLIENT_DIAGNOSTIC_DAYS = 7;
export const MCP_USAGE_MINIMUM_PUBLIC_COHORT = 5;
export const MCP_USAGE_FLUSH_INTERVAL_MS = 1_000;

const LEGACY_SCHEMA_VERSION = '1.0.0';
const SURFACES = new Set(['compact', 'full', 'legacy']);
const LATENCY_BUCKETS_MS = [5, 10, 25, 50, 100, 250, 500, 1_000, 2_500, 5_000, 10_000, 30_000];
const RESPONSE_SIZE_BUCKETS_BYTES = [
  256, 512, 1_024, 2_048, 4_096, 8_192, 16_384, 32_768,
  65_536, 131_072, 262_144, 524_288, 1_048_576,
];

// Huit familles décisionnelles, plus les deux états de qualité `other` et
// `undeclared`. Les versions et les noms libres ne sont jamais publiés.
const CLIENT_FAMILIES = [
  ['anthropic', /\b(?:claude|anthropic)\b/i],
  ['openai', /\b(?:chatgpt|codex|openai)\b|agents[ _-]?sdk/i],
  ['google', /\b(?:gemini|vertex ai)\b/i],
  ['mcp-inspector', /\bmcp[ _-]?inspector\b/i],
  ['mcp-gateway', /\b(?:mcp[ _-]?remote|mcp[ _-]?proxy|supergateway|smithery)\b/i],
  ['ide', /\b(?:cursor|vscode|visual studio code|windsurf|zed)\b/i],
  ['generic-http', /\b(?:curl|httpie|wget|postman|insomnia)\b/i],
  ['automation', /\b(?:n8n|make\.com|zapier|langchain|llamaindex)\b/i],
];
export const MCP_CLIENT_FAMILY_NAMES = Object.freeze(CLIENT_FAMILIES.map(([family]) => family));
const CLIENT_FAMILY_NAMES = new Set([...MCP_CLIENT_FAMILY_NAMES, 'other', 'undeclared']);

const LEGACY_CLIENT_FAMILY_MAP = new Map([
  ['claude-code', 'anthropic'],
  ['claude', 'anthropic'],
  ['chatgpt', 'openai'],
  ['codex', 'openai'],
  ['openai-agents-sdk', 'openai'],
  ['gemini', 'google'],
  ['cursor', 'ide'],
  ['vscode', 'ide'],
  ['mcp-inspector', 'mcp-inspector'],
  ['mcp-remote', 'mcp-gateway'],
  ['other', 'other'],
  ['undeclared', 'undeclared'],
]);

const KNOWN_TOOLS = new Set([
  'discover_l0g',
  'search_l0g',
  'get_document',
  'get_evidence',
  'get_risk_state',
  'get_agent_manifest',
  'get_risk_indices',
  'get_signal_history',
  'get_risk_diff',
  'get_black_box',
  'get_openapi_schema',
  'get_ndjson_feed',
  'get_freshness',
  'search_content',
  'build_research_pack',
  'get_claims',
  'get_claim',
  'get_claim_evidence',
  'list_article_claims',
  'find_claims_by_source',
  'get_source',
  'verify_artifact',
  'get_changes',
  'get_evidence_graph',
  'list_sources',
  'get_integrity',
  'get_changefeed',
  'list_recent_analyses',
  'list_guides',
  'search_by_topic',
  'get_article',
]);

const KNOWN_PROMPTS = new Set([
  'audit_financial_narrative',
  'explain_risk_change',
  'verify_claim',
  'replay_as_of',
]);

const RESOURCE_EXACT = new Map([
  ['l0g://agent-manifest', 'agent-manifest'],
  ['l0g://mcp/server', 'mcp-server'],
  ['l0g://openapi', 'openapi'],
  ['l0g://freshness', 'freshness'],
  ['l0g://integrity', 'integrity'],
  ['l0g://changes/latest', 'changes'],
  ['l0g://risk-diff', 'risk-diff'],
  ['l0g://black-box', 'black-box'],
  ['l0g://signals/current', 'signals-current'],
  ['l0g://signals/history', 'signals-history'],
]);

const RESOURCE_PREFIXES = [
  ['l0g://articles/', 'articles'],
  ['l0g://en/articles/', 'articles-en'],
  ['l0g://guides/', 'guides'],
  ['l0g://en/guides/', 'guides-en'],
  ['l0g://claims/', 'claims'],
  ['l0g://sources/', 'sources'],
  ['l0g://signals/', 'signals'],
  ['l0g://methodologies/', 'methodologies'],
];
const RESOURCE_FAMILIES = new Set([
  ...RESOURCE_EXACT.values(),
  ...RESOURCE_PREFIXES.map(([, family]) => family),
  'unknown',
]);

function emptyHistogram(buckets) {
  return buckets.map(() => 0);
}

function emptyEndpoint(surface) {
  return {
    surface,
    requests: 0,
    successes: 0,
    errors: 0,
    events: {
      initializations: 0,
      toolsList: 0,
      toolCalls: 0,
      resourceReads: 0,
      promptGets: 0,
    },
    clients: [],
    tools: [],
    resources: [],
    prompts: [],
    latencyHistogram: emptyHistogram(LATENCY_BUCKETS_MS),
    responseSizeHistogram: emptyHistogram(RESPONSE_SIZE_BUCKETS_BYTES),
    responseBytesTotal: 0,
  };
}

function emptyState() {
  return {
    schemaVersion: MCP_USAGE_SCHEMA_VERSION,
    updatedAt: null,
    days: [],
  };
}

function dayKey(date) {
  return date.toISOString().slice(0, 10);
}

function isCount(value) {
  return Number.isSafeInteger(value) && value >= 0;
}

function isFiniteNonNegative(value) {
  return Number.isFinite(value) && value >= 0;
}

function isIsoDate(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function incrementRow(rows, key, value, amount = 1) {
  let row = rows.find((item) => item[key] === value);
  if (!row) {
    row = { [key]: value, count: 0 };
    rows.push(row);
  }
  row.count += amount;
  return row;
}

function normalizeOtherCandidate(name) {
  if (typeof name !== 'string') return null;
  const normalized = name
    .normalize('NFKC')
    .toLowerCase()
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\b(?:v(?:ersion)?\s*)?\d+(?:[._-]\d+){1,}\b/gi, 'v#')
    .replace(/[0-9a-f]{12,}/gi, '#')
    .replace(/[^a-z0-9._+ /-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 48);
  return normalized || null;
}

function sortRows(rows, key) {
  rows.sort((left, right) => left[key].localeCompare(right[key]));
}

function sortState(state) {
  state.days.sort((left, right) => left.day.localeCompare(right.day));
  for (const day of state.days) {
    day.endpoints.sort((left, right) => left.surface.localeCompare(right.surface));
    sortRows(day.otherCandidates, 'name');
    for (const endpoint of day.endpoints) {
      sortRows(endpoint.clients, 'family');
      sortRows(endpoint.tools, 'name');
      sortRows(endpoint.resources, 'family');
      sortRows(endpoint.prompts, 'name');
    }
  }
  return state;
}

function validRows(rows, key) {
  return Array.isArray(rows) && rows.every((row) => (
    row && typeof row === 'object' && typeof row[key] === 'string' && isCount(row.count)
  ));
}

function validHistogram(histogram, buckets) {
  return Array.isArray(histogram)
    && histogram.length === buckets.length
    && histogram.every(isCount);
}

function validToolRows(rows) {
  return Array.isArray(rows) && rows.every((row) => (
    row
    && typeof row === 'object'
    && typeof row.name === 'string'
    && isCount(row.count)
    && isCount(row.successes)
    && isCount(row.errors)
    && row.successes + row.errors <= row.count
    && validHistogram(row.latencyHistogram, LATENCY_BUCKETS_MS)
    && validHistogram(row.responseSizeHistogram, RESPONSE_SIZE_BUCKETS_BYTES)
    && isCount(row.responseBytesTotal)
  ));
}

function migrateLegacyState(value) {
  if (!value || value.schemaVersion !== LEGACY_SCHEMA_VERSION || !Array.isArray(value.days)) return null;
  const migrated = emptyState();
  migrated.updatedAt = value.updatedAt ?? null;
  for (const legacyDay of value.days) {
    if (!legacyDay || !/^\d{4}-\d{2}-\d{2}$/.test(legacyDay.day)) return null;
    const endpoint = emptyEndpoint('legacy');
    endpoint.events.initializations = Number(legacyDay.initializations) || 0;
    endpoint.events.toolCalls = Number(legacyDay.toolCalls) || 0;
    endpoint.events.resourceReads = Number(legacyDay.resourceReads) || 0;
    endpoint.events.promptGets = Number(legacyDay.promptGets) || 0;
    for (const row of legacyDay.clients ?? []) {
      const family = LEGACY_CLIENT_FAMILY_MAP.get(row.family) ?? 'other';
      incrementRow(endpoint.clients, 'family', family, Number(row.count) || 0);
    }
    for (const row of legacyDay.tools ?? []) {
      const tool = {
        name: classifyMcpTool(row.name),
        count: Number(row.count) || 0,
        successes: 0,
        errors: 0,
        latencyHistogram: emptyHistogram(LATENCY_BUCKETS_MS),
        responseSizeHistogram: emptyHistogram(RESPONSE_SIZE_BUCKETS_BYTES),
        responseBytesTotal: 0,
      };
      endpoint.tools.push(tool);
    }
    for (const row of legacyDay.resources ?? []) {
      incrementRow(endpoint.resources, 'family', classifyMcpResourceFamily(row.family), Number(row.count) || 0);
    }
    for (const row of legacyDay.prompts ?? []) {
      incrementRow(endpoint.prompts, 'name', classifyMcpPrompt(row.name), Number(row.count) || 0);
    }
    migrated.days.push({ day: legacyDay.day, endpoints: [endpoint], otherCandidates: [] });
  }
  return sortState(migrated);
}

function normalizeState(value) {
  const candidate = value?.schemaVersion === LEGACY_SCHEMA_VERSION ? migrateLegacyState(value) : value;
  if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) return null;
  if (candidate.schemaVersion !== MCP_USAGE_SCHEMA_VERSION || !Array.isArray(candidate.days)) return null;
  if (candidate.updatedAt !== null && !isIsoDate(candidate.updatedAt)) return null;
  for (const day of candidate.days) {
    if (!day || typeof day !== 'object' || !/^\d{4}-\d{2}-\d{2}$/.test(day.day)) return null;
    if (!Array.isArray(day.endpoints) || !validRows(day.otherCandidates, 'name')) return null;
    for (const endpoint of day.endpoints) {
      if (!endpoint || !SURFACES.has(endpoint.surface)) return null;
      if (![endpoint.requests, endpoint.successes, endpoint.errors, endpoint.responseBytesTotal].every(isCount)) return null;
      if (endpoint.successes + endpoint.errors > endpoint.requests) return null;
      if (!endpoint.events || ![
        endpoint.events.initializations,
        endpoint.events.toolsList,
        endpoint.events.toolCalls,
        endpoint.events.resourceReads,
        endpoint.events.promptGets,
      ].every(isCount)) return null;
      if (!validRows(endpoint.clients, 'family') || endpoint.clients.some((row) => !CLIENT_FAMILY_NAMES.has(row.family))) return null;
      if (!validToolRows(endpoint.tools)) return null;
      if (endpoint.tools.some((row) => row.name !== 'unknown' && !KNOWN_TOOLS.has(row.name))) return null;
      if (!validRows(endpoint.resources, 'family') || endpoint.resources.some((row) => !RESOURCE_FAMILIES.has(row.family))) return null;
      if (!validRows(endpoint.prompts, 'name') || endpoint.prompts.some((row) => row.name !== 'unknown' && !KNOWN_PROMPTS.has(row.name))) return null;
      if (!validHistogram(endpoint.latencyHistogram, LATENCY_BUCKETS_MS)) return null;
      if (!validHistogram(endpoint.responseSizeHistogram, RESPONSE_SIZE_BUCKETS_BYTES)) return null;
    }
  }
  return sortState(structuredClone(candidate));
}

export function classifyMcpClient(clientInfo) {
  if (!clientInfo || typeof clientInfo !== 'object' || Array.isArray(clientInfo)) return 'undeclared';
  if (typeof clientInfo.name !== 'string') return 'undeclared';
  const name = clientInfo.name.trim().slice(0, 120);
  if (!name) return 'undeclared';
  return CLIENT_FAMILIES.find(([, pattern]) => pattern.test(name))?.[0] ?? 'other';
}

export function isInternalL0gUserAgent(userAgent) {
  if (typeof userAgent !== 'string') return false;
  const value = userAgent.trim().toLowerCase();
  return /^(?:l0g|l0g\.fr)(?:[./ _-]|$)/.test(value);
}

export function classifyMcpTool(name) {
  return typeof name === 'string' && KNOWN_TOOLS.has(name) ? name : 'unknown';
}

export function classifyMcpPrompt(name) {
  return typeof name === 'string' && KNOWN_PROMPTS.has(name) ? name : 'unknown';
}

function classifyMcpResourceFamily(family) {
  return typeof family === 'string' && RESOURCE_FAMILIES.has(family) ? family : 'unknown';
}

export function classifyMcpResource(uri) {
  if (typeof uri !== 'string') return 'unknown';
  if (RESOURCE_EXACT.has(uri)) return RESOURCE_EXACT.get(uri);
  return RESOURCE_PREFIXES.find(([prefix]) => uri.startsWith(prefix))?.[1] ?? 'unknown';
}

export function extractMcpUsageEvents(body) {
  const messages = Array.isArray(body) ? body : [body];
  const events = [];
  for (const message of messages) {
    if (!message || typeof message !== 'object' || Array.isArray(message)) continue;
    if (message.method === 'initialize') {
      const clientFamily = classifyMcpClient(message.params?.clientInfo);
      events.push({
        type: 'initialize',
        clientFamily,
        otherCandidate: clientFamily === 'other'
          ? normalizeOtherCandidate(message.params?.clientInfo?.name)
          : null,
      });
    } else if (message.method === 'tools/list') {
      events.push({ type: 'tools_list' });
    } else if (message.method === 'tools/call') {
      events.push({ type: 'tool_call', toolName: classifyMcpTool(message.params?.name) });
    } else if (message.method === 'resources/read') {
      events.push({ type: 'resource_read', resourceFamily: classifyMcpResource(message.params?.uri) });
    } else if (message.method === 'prompts/get') {
      events.push({ type: 'prompt_get', promptName: classifyMcpPrompt(message.params?.name) });
    }
  }
  return events;
}

function incrementHistogram(histogram, buckets, value) {
  const numeric = Math.max(0, Number(value) || 0);
  let index = buckets.findIndex((upperBound) => numeric <= upperBound);
  if (index < 0) index = buckets.length - 1;
  histogram[index] += 1;
}

function observationOutcome(observation) {
  if (observation.outcome === 'success' || observation.outcome === 'error') return observation.outcome;
  const statusCode = Number(observation.statusCode);
  return statusCode >= 200 && statusCode < 400 ? 'success' : 'error';
}

function normalizeObservation(observation) {
  if (!observation || typeof observation !== 'object' || Array.isArray(observation)) return null;
  const surface = SURFACES.has(observation.surface) ? observation.surface : null;
  if (!surface || surface === 'legacy') return null;
  const durationMs = Number(observation.durationMs);
  const responseBytes = Number(observation.responseBytes);
  if (!isFiniteNonNegative(durationMs) || !isCount(responseBytes)) return null;
  return {
    surface,
    outcome: observationOutcome(observation),
    durationMs,
    responseBytes,
    events: Array.isArray(observation.events)
      ? observation.events
      : extractMcpUsageEvents(observation.body),
  };
}

function newToolRow(name) {
  return {
    name,
    count: 0,
    successes: 0,
    errors: 0,
    latencyHistogram: emptyHistogram(LATENCY_BUCKETS_MS),
    responseSizeHistogram: emptyHistogram(RESPONSE_SIZE_BUCKETS_BYTES),
    responseBytesTotal: 0,
  };
}

function getToolRow(rows, name) {
  let row = rows.find((item) => item.name === name);
  if (!row) {
    row = newToolRow(name);
    rows.push(row);
  }
  return row;
}

export function aggregateMcpUsage(state, observations, now = new Date()) {
  const normalized = normalizeState(state);
  const values = Array.isArray(observations) ? observations : [observations];
  if (!normalized || !(now instanceof Date) || !Number.isFinite(now.getTime())) {
    throw new Error('mcp_usage_schema_mismatch');
  }
  const accepted = values.map(normalizeObservation).filter(Boolean);

  const cutoff = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  cutoff.setUTCDate(cutoff.getUTCDate() - (MCP_USAGE_RETENTION_DAYS - 1));
  const diagnosticCutoff = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  diagnosticCutoff.setUTCDate(diagnosticCutoff.getUTCDate() - (MCP_USAGE_CLIENT_DIAGNOSTIC_DAYS - 1));
  const next = structuredClone(normalized);
  next.days = next.days
    .filter((day) => Date.parse(`${day.day}T00:00:00Z`) >= cutoff.getTime())
    .map((day) => ({
      ...day,
      otherCandidates: Date.parse(`${day.day}T00:00:00Z`) >= diagnosticCutoff.getTime()
        ? day.otherCandidates
        : [],
    }));

  if (!accepted.length) return next;
  let day = next.days.find((item) => item.day === dayKey(now));
  if (!day) {
    day = { day: dayKey(now), endpoints: [], otherCandidates: [] };
    next.days.push(day);
  }

  for (const observation of accepted) {
    let endpoint = day.endpoints.find((item) => item.surface === observation.surface);
    if (!endpoint) {
      endpoint = emptyEndpoint(observation.surface);
      day.endpoints.push(endpoint);
    }
    endpoint.requests += 1;
    endpoint[observation.outcome === 'success' ? 'successes' : 'errors'] += 1;
    incrementHistogram(endpoint.latencyHistogram, LATENCY_BUCKETS_MS, observation.durationMs);
    incrementHistogram(endpoint.responseSizeHistogram, RESPONSE_SIZE_BUCKETS_BYTES, observation.responseBytes);
    endpoint.responseBytesTotal += observation.responseBytes;

    for (const event of observation.events) {
      if (event?.type === 'initialize') {
        endpoint.events.initializations += 1;
        incrementRow(endpoint.clients, 'family', CLIENT_FAMILY_NAMES.has(event.clientFamily) ? event.clientFamily : 'other');
        if (event.otherCandidate) incrementRow(day.otherCandidates, 'name', event.otherCandidate);
      } else if (event?.type === 'tools_list') {
        endpoint.events.toolsList += 1;
      } else if (event?.type === 'tool_call') {
        endpoint.events.toolCalls += 1;
        const tool = getToolRow(endpoint.tools, classifyMcpTool(event.toolName));
        tool.count += 1;
        tool[observation.outcome === 'success' ? 'successes' : 'errors'] += 1;
        incrementHistogram(tool.latencyHistogram, LATENCY_BUCKETS_MS, observation.durationMs);
        incrementHistogram(tool.responseSizeHistogram, RESPONSE_SIZE_BUCKETS_BYTES, observation.responseBytes);
        tool.responseBytesTotal += observation.responseBytes;
      } else if (event?.type === 'resource_read') {
        endpoint.events.resourceReads += 1;
        incrementRow(endpoint.resources, 'family', classifyMcpResourceFamily(event.resourceFamily));
      } else if (event?.type === 'prompt_get') {
        endpoint.events.promptGets += 1;
        incrementRow(endpoint.prompts, 'name', classifyMcpPrompt(event.promptName));
      }
    }
  }

  next.updatedAt = now.toISOString();
  return sortState(next);
}

function ratio(numerator, denominator) {
  return denominator > 0 ? Number((numerator / denominator).toFixed(6)) : null;
}

function sumHistogram(target, source) {
  for (let index = 0; index < target.length; index += 1) target[index] += source[index];
}

function percentile(histogram, buckets, quantile) {
  const total = histogram.reduce((sum, count) => sum + count, 0);
  if (!total) return null;
  const rank = Math.ceil(total * quantile);
  let cumulative = 0;
  for (let index = 0; index < histogram.length; index += 1) {
    cumulative += histogram[index];
    if (cumulative >= rank) return buckets[index];
  }
  return buckets.at(-1);
}

function metrics(row) {
  const responseObservations = row.responseSizeHistogram.reduce((sum, count) => sum + count, 0);
  return {
    latency_ms: {
      p50: percentile(row.latencyHistogram, LATENCY_BUCKETS_MS, 0.5),
      p95: percentile(row.latencyHistogram, LATENCY_BUCKETS_MS, 0.95),
    },
    response_bytes: {
      average: responseObservations > 0 ? Math.round(row.responseBytesTotal / responseObservations) : null,
      p50: percentile(row.responseSizeHistogram, RESPONSE_SIZE_BUCKETS_BYTES, 0.5),
      p95: percentile(row.responseSizeHistogram, RESPONSE_SIZE_BUCKETS_BYTES, 0.95),
    },
  };
}

function mergeSimpleRows(endpoints, source, key) {
  const rows = new Map();
  for (const endpoint of endpoints) {
    for (const item of endpoint[source]) rows.set(item[key], (rows.get(item[key]) ?? 0) + item.count);
  }
  return [...rows.entries()]
    .map(([value, count]) => ({ [key]: value, count }))
    .sort((left, right) => right.count - left.count || left[key].localeCompare(right[key]));
}

function mergeToolRows(endpoints) {
  const rows = new Map();
  for (const endpoint of endpoints) {
    for (const source of endpoint.tools) {
      let target = rows.get(source.name);
      if (!target) {
        target = newToolRow(source.name);
        rows.set(source.name, target);
      }
      target.count += source.count;
      target.successes += source.successes;
      target.errors += source.errors;
      target.responseBytesTotal += source.responseBytesTotal;
      sumHistogram(target.latencyHistogram, source.latencyHistogram);
      sumHistogram(target.responseSizeHistogram, source.responseSizeHistogram);
    }
  }
  return [...rows.values()]
    .map((row) => ({
      name: row.name,
      count: row.count,
      successes: row.successes,
      errors: row.errors,
      outcome_unavailable: row.count - row.successes - row.errors,
      success_rate: ratio(row.successes, row.successes + row.errors),
      ...metrics({ ...row, requests: row.count }),
    }))
    .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
}

function buildRecurringToolUsage(days, toolName) {
  const activeDays = days
    .map((day) => ({
      day: day.day,
      calls: mergeToolRows(day.endpoints).find((row) => row.name === toolName)?.count ?? 0,
    }))
    .filter((day) => day.calls > 0);

  return {
    metric: 'repeat_active_days',
    active_days: activeDays.length,
    repeat_active_days: Math.max(0, activeDays.length - 1),
    first_active_day: activeDays.at(0)?.day ?? null,
    last_active_day: activeDays.at(-1)?.day ?? null,
    returning_clients: null,
    interpretation: 'Jours avec au moins un appel get_risk_state, puis jours actifs après le premier jour observé. Ce signal mesure la récurrence du produit, pas des clients uniques.',
  };
}

function mergeEndpointRows(endpoints, surface) {
  const total = emptyEndpoint(surface);
  for (const endpoint of endpoints.filter((item) => item.surface === surface)) {
    total.requests += endpoint.requests;
    total.successes += endpoint.successes;
    total.errors += endpoint.errors;
    total.responseBytesTotal += endpoint.responseBytesTotal;
    for (const key of Object.keys(total.events)) total.events[key] += endpoint.events[key];
    sumHistogram(total.latencyHistogram, endpoint.latencyHistogram);
    sumHistogram(total.responseSizeHistogram, endpoint.responseSizeHistogram);
    for (const sourceTool of endpoint.tools) {
      const targetTool = getToolRow(total.tools, sourceTool.name);
      targetTool.count += sourceTool.count;
      targetTool.successes += sourceTool.successes;
      targetTool.errors += sourceTool.errors;
      targetTool.responseBytesTotal += sourceTool.responseBytesTotal;
      sumHistogram(targetTool.latencyHistogram, sourceTool.latencyHistogram);
      sumHistogram(targetTool.responseSizeHistogram, sourceTool.responseSizeHistogram);
    }
  }
  return total;
}

function endpointPath(surface) {
  if (surface === 'compact') return '/api/mcp/compact';
  if (surface === 'full') return '/api/mcp';
  return 'historique non attribué';
}

function publicEndpointRow(endpoint) {
  const primary = endpoint.tools.find((row) => row.name === 'get_risk_state');
  return {
    endpoint: endpointPath(endpoint.surface),
    coverage: endpoint.surface === 'legacy' ? 'legacy_events_only' : 'complete',
    requests: endpoint.requests,
    successes: endpoint.successes,
    errors: endpoint.errors,
    success_rate: ratio(endpoint.successes, endpoint.successes + endpoint.errors),
    events: {
      initializations: endpoint.events.initializations,
      tools_list: endpoint.events.toolsList,
      tool_calls: endpoint.events.toolCalls,
      resource_reads: endpoint.events.resourceReads,
      prompt_gets: endpoint.events.promptGets,
    },
    primary_tool: primary ? {
      name: 'get_risk_state',
      calls: primary.count,
      successes: primary.successes,
      errors: primary.errors,
      success_rate: ratio(primary.successes, primary.successes + primary.errors),
      ...metrics({ ...primary, requests: primary.count }),
    } : {
      name: 'get_risk_state',
      calls: 0,
      successes: 0,
      errors: 0,
      success_rate: null,
      latency_ms: { p50: null, p95: null },
      response_bytes: { average: null, p50: null, p95: null },
    },
    ...metrics(endpoint),
  };
}

export function buildPublicMcpUsageReport(state, minimumCohort = MCP_USAGE_MINIMUM_PUBLIC_COHORT) {
  const value = normalizeState(state);
  if (!value || !Number.isSafeInteger(minimumCohort) || minimumCohort < 2) {
    throw new Error('mcp_usage_schema_mismatch');
  }

  const allEndpoints = value.days.flatMap((day) => day.endpoints);
  const totals = mergeEndpointRows(allEndpoints, 'legacy');
  for (const surface of ['compact', 'full']) {
    const row = mergeEndpointRows(allEndpoints, surface);
    totals.requests += row.requests;
    totals.successes += row.successes;
    totals.errors += row.errors;
    totals.responseBytesTotal += row.responseBytesTotal;
    for (const key of Object.keys(totals.events)) totals.events[key] += row.events[key];
    sumHistogram(totals.latencyHistogram, row.latencyHistogram);
    sumHistogram(totals.responseSizeHistogram, row.responseSizeHistogram);
  }

  const clients = mergeSimpleRows(allEndpoints, 'clients', 'family');
  const declared = clients.filter((row) => row.family !== 'undeclared').reduce((sum, row) => sum + row.count, 0);
  const other = clients.find((row) => row.family === 'other')?.count ?? 0;
  const updatedDay = value.updatedAt?.slice(0, 10) ?? value.days.at(-1)?.day ?? null;
  const recentCutoff = updatedDay ? new Date(`${updatedDay}T00:00:00Z`) : null;
  recentCutoff?.setUTCDate(recentCutoff.getUTCDate() - (MCP_USAGE_CLIENT_DIAGNOSTIC_DAYS - 1));
  const recentEndpoints = recentCutoff
    ? value.days
      .filter((day) => Date.parse(`${day.day}T00:00:00Z`) >= recentCutoff.getTime())
      .flatMap((day) => day.endpoints)
    : [];
  const recentClients = mergeSimpleRows(recentEndpoints, 'clients', 'family');
  const recentInitializations = recentEndpoints.reduce((sum, endpoint) => sum + endpoint.events.initializations, 0);
  const recentOther = recentClients.find((row) => row.family === 'other')?.count ?? 0;
  const recentOtherShare = ratio(recentOther, recentInitializations);
  const tools = mergeToolRows(allEndpoints);
  const primaryTool = tools.find((row) => row.name === 'get_risk_state') ?? {
    name: 'get_risk_state',
    count: 0,
    successes: 0,
    errors: 0,
    outcome_unavailable: 0,
    success_rate: null,
    latency_ms: { p50: null, p95: null },
    response_bytes: { average: null, p50: null, p95: null },
  };
  const recurringUsage = buildRecurringToolUsage(value.days, 'get_risk_state');
  const endpointTotals = ['compact', 'full', 'legacy']
    .map((surface) => mergeEndpointRows(allEndpoints, surface))
    .filter((row) => row.requests >= minimumCohort || Object.values(row.events).reduce((sum, count) => sum + count, 0) >= minimumCohort)
    .map(publicEndpointRow);

  return {
    schema_version: MCP_USAGE_SCHEMA_VERSION,
    updated_at: value.updatedAt,
    retention_days: MCP_USAGE_RETENTION_DAYS,
    minimum_public_cohort: minimumCohort,
    measurement: {
      requests: 'Requêtes POST MCP externes agrégées par jour et endpoint ; succès et erreurs incluent les erreurs JSON-RPC et isError des tools.',
      latency: 'p50 et p95 sont estimés depuis des histogrammes bornés ; aucune durée individuelle n’est conservée.',
      response_size: 'Taille de réponse agrégée en octets et histogrammes bornés ; aucun contenu de réponse n’est conservé.',
      clients: 'Huit familles stables dérivées de clientInfo.name ; les libellés other restent privés sept jours pour recalibrer la taxonomie.',
      recurring_usage: 'Le KPI de récurrence compte les jours où get_risk_state est utilisé, puis les jours actifs après le premier jour observé. Il ne repose pas sur les initialisations.',
      privacy: 'User-agents internes l0g exclus avant agrégation ; aucune IP, session, empreinte, cookie ou chaîne user-agent n’est conservé.',
    },
    totals: {
      requests: totals.requests,
      successes: totals.successes,
      errors: totals.errors,
      initializations: totals.events.initializations,
      tools_list: totals.events.toolsList,
      tool_calls: totals.events.toolCalls,
      resource_reads: totals.events.resourceReads,
      prompt_gets: totals.events.promptGets,
      client_info_declared: declared,
      client_info_declaration_rate: ratio(declared, totals.events.initializations),
      ...metrics(totals),
    },
    product_kpi: {
      ...primaryTool,
      share_of_tool_calls: ratio(primaryTool.count, totals.events.toolCalls),
      recurring_usage: recurringUsage,
      role: 'Produit agentique principal de l0g ; le reste du catalogue est présenté comme parcours secondaire.',
    },
    taxonomy: {
      stable_families: MCP_CLIENT_FAMILY_NAMES,
      recent_window_days: MCP_USAGE_CLIENT_DIAGNOSTIC_DAYS,
      recent_initializations: recentInitializations,
      other_initializations: recentOther,
      other_share: recentOtherShare,
      retained_other_share: ratio(other, totals.events.initializations),
      decision_ready: recentInitializations >= minimumCohort && recentOtherShare <= 0.1,
      private_diagnostic_window_days: MCP_USAGE_CLIENT_DIAGNOSTIC_DAYS,
      public_raw_names: false,
    },
    endpoints: endpointTotals,
    clients: clients.filter((row) => row.count >= minimumCohort),
    tools,
    resources: mergeSimpleRows(allEndpoints, 'resources', 'family'),
    prompts: mergeSimpleRows(allEndpoints, 'prompts', 'name'),
    daily: value.days.flatMap((day) => day.endpoints
      .filter((endpoint) => (
        endpoint.requests >= minimumCohort
        || Object.values(endpoint.events).reduce((sum, count) => sum + count, 0) >= minimumCohort
      ))
      .map((endpoint) => ({ date: day.day, ...publicEndpointRow(endpoint) }))),
    limitations: [
      'Les jours antérieurs au schéma 2 conservent les événements, mais pas l’endpoint, le résultat, la latence ni la taille de réponse.',
      'Les tentatives et retries peuvent augmenter les compteurs.',
      'Les familles client et diagnostics sous le seuil k=5 sont masqués.',
      'Les appels de tools ne sont pas reliés à une personne ni à une famille client en mode MCP stateless.',
      'Aucune donnée ne permet de compter des personnes ou des intégrations uniques.',
      'returning_clients reste null : la récurrence publiée porte sur les jours actifs de get_risk_state, sans identifiant persistant.',
    ],
  };
}

export function buildPrivateClientTaxonomyDiagnostics(
  state,
  minimumCohort = MCP_USAGE_MINIMUM_PUBLIC_COHORT,
) {
  const value = normalizeState(state);
  if (!value || !Number.isSafeInteger(minimumCohort) || minimumCohort < 2) {
    throw new Error('mcp_usage_schema_mismatch');
  }
  const reference = value.updatedAt ? new Date(value.updatedAt) : new Date();
  const cutoff = new Date(Date.UTC(reference.getUTCFullYear(), reference.getUTCMonth(), reference.getUTCDate()));
  cutoff.setUTCDate(cutoff.getUTCDate() - (MCP_USAGE_CLIENT_DIAGNOSTIC_DAYS - 1));
  const rows = new Map();
  for (const day of value.days) {
    if (Date.parse(`${day.day}T00:00:00Z`) < cutoff.getTime()) continue;
    for (const row of day.otherCandidates) rows.set(row.name, (rows.get(row.name) ?? 0) + row.count);
  }
  return {
    schema_version: MCP_USAGE_SCHEMA_VERSION,
    generated_at: value.updatedAt,
    private: true,
    window_days: MCP_USAGE_CLIENT_DIAGNOSTIC_DAYS,
    minimum_cohort: minimumCohort,
    candidates: [...rows.entries()]
      .filter(([, count]) => count >= minimumCohort)
      .map(([name, count]) => ({ name, count }))
      .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name)),
    note: 'Diagnostic local uniquement. Ajouter une famille stable exige une revue explicite ; aucun libellé libre ne doit être publié.',
  };
}

async function loadState(path) {
  if (!path) return emptyState();
  try {
    const parsed = JSON.parse(await readFile(path, 'utf8'));
    const normalized = normalizeState(parsed);
    if (!normalized) throw new Error('mcp_usage_schema_mismatch');
    return normalized;
  } catch (error) {
    if (error?.code === 'ENOENT') return emptyState();
    throw error;
  }
}

async function persistState(path, state) {
  await mkdir(dirname(path), { recursive: true, mode: 0o700 });
  const temporary = `${path}.${process.pid}.tmp`;
  await writeFile(temporary, `${JSON.stringify(state)}\n`, { mode: 0o600 });
  await rename(temporary, path);
}

export function createMcpUsageStore({
  path,
  now = Date.now,
  minimumCohort = MCP_USAGE_MINIMUM_PUBLIC_COHORT,
  flushIntervalMs = MCP_USAGE_FLUSH_INTERVAL_MS,
  onError = () => {},
} = {}) {
  const enabled = typeof path === 'string' && path.length > 0;
  if (!Number.isSafeInteger(flushIntervalMs) || flushIntervalMs < 0) throw new Error('mcp_usage_flush_interval_invalid');
  let lastError = null;
  let statePromise = loadState(enabled ? path : null).catch((error) => {
    lastError = error;
    onError(error);
    return emptyState();
  });
  let queue = Promise.resolve();
  let pendingObservations = [];
  let flushTimer = null;

  function enqueue(observations) {
    if (!enabled || !observations.length) return;
    queue = queue.then(async () => {
      const state = await statePromise;
      const next = aggregateMcpUsage(state, observations, new Date(now()));
      await persistState(path, next);
      statePromise = Promise.resolve(next);
      lastError = null;
    }).catch((error) => {
      lastError = error;
      onError(error);
    });
  }

  function drainPending() {
    if (flushTimer) clearTimeout(flushTimer);
    flushTimer = null;
    const observations = pendingObservations;
    pendingObservations = [];
    enqueue(observations);
  }

  function schedule(observation) {
    if (!enabled || !observation || isInternalL0gUserAgent(observation.userAgent)) return;
    const normalized = normalizeObservation({
      ...observation,
      events: extractMcpUsageEvents(observation.body),
    });
    if (!normalized) return;
    pendingObservations.push(normalized);
    if (flushTimer) return;
    flushTimer = setTimeout(drainPending, flushIntervalMs);
    flushTimer.unref?.();
  }

  return {
    enabled,
    schemaVersion: MCP_USAGE_SCHEMA_VERSION,
    status() {
      return { enabled, schemaVersion: MCP_USAGE_SCHEMA_VERSION, storageHealthy: lastError === null };
    },
    recordRequest(observation) {
      schedule(observation);
    },
    async flush() {
      drainPending();
      await queue;
    },
    async publicReport() {
      drainPending();
      await queue;
      return {
        enabled,
        storage_healthy: lastError === null,
        ...buildPublicMcpUsageReport(await statePromise, minimumCohort),
      };
    },
    async privateClientTaxonomyReport() {
      drainPending();
      await queue;
      return buildPrivateClientTaxonomyDiagnostics(await statePromise, minimumCohort);
    },
  };
}
