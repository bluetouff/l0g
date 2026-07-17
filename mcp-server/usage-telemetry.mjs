import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

export const MCP_USAGE_SCHEMA_VERSION = '1.0.0';
export const MCP_USAGE_RETENTION_DAYS = 91;
export const MCP_USAGE_MINIMUM_PUBLIC_COHORT = 5;
export const MCP_USAGE_FLUSH_INTERVAL_MS = 1_000;

const CLIENT_FAMILIES = [
  ['claude-code', /\bclaude[ _-]?code\b/i],
  ['claude', /\bclaude\b|\banthropic\b/i],
  ['chatgpt', /\bchatgpt\b/i],
  ['codex', /\bcodex\b/i],
  ['openai-agents-sdk', /openai.*agents|agents.*sdk/i],
  ['gemini', /\bgemini\b/i],
  ['cursor', /\bcursor\b/i],
  ['vscode', /visual studio code|\bvscode\b/i],
  ['mcp-inspector', /mcp[ _-]?inspector/i],
  ['mcp-remote', /mcp[ _-]?remote/i],
];
const CLIENT_FAMILY_NAMES = new Set([...CLIENT_FAMILIES.map(([family]) => family), 'other', 'undeclared']);

const KNOWN_TOOLS = new Set([
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

function isIsoDate(value) {
  return typeof value === 'string' && Number.isFinite(Date.parse(value));
}

function incrementRow(rows, key, value) {
  let row = rows.find((item) => item[key] === value);
  if (!row) {
    row = { [key]: value, count: 0 };
    rows.push(row);
  }
  row.count += 1;
}

function sortState(state) {
  state.days.sort((left, right) => left.day.localeCompare(right.day));
  for (const day of state.days) {
    day.clients.sort((left, right) => left.family.localeCompare(right.family));
    day.tools.sort((left, right) => left.name.localeCompare(right.name));
    day.resources.sort((left, right) => left.family.localeCompare(right.family));
    day.prompts.sort((left, right) => left.name.localeCompare(right.name));
  }
  return state;
}

function validRows(rows, key) {
  return Array.isArray(rows) && rows.every((row) => (
    row && typeof row === 'object' && typeof row[key] === 'string' && isCount(row.count)
  ));
}

function normalizeState(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (value.schemaVersion !== MCP_USAGE_SCHEMA_VERSION || !Array.isArray(value.days)) return null;
  if (value.updatedAt !== null && !isIsoDate(value.updatedAt)) return null;
  for (const day of value.days) {
    if (!day || typeof day !== 'object' || !/^\d{4}-\d{2}-\d{2}$/.test(day.day)) return null;
    if (![day.initializations, day.toolCalls, day.resourceReads, day.promptGets].every(isCount)) return null;
    if (!validRows(day.clients, 'family') || !validRows(day.tools, 'name')) return null;
    if (!validRows(day.resources, 'family') || !validRows(day.prompts, 'name')) return null;
    if (day.clients.some((row) => !CLIENT_FAMILY_NAMES.has(row.family))) return null;
    if (day.tools.some((row) => row.name !== 'unknown' && !KNOWN_TOOLS.has(row.name))) return null;
    if (day.resources.some((row) => !RESOURCE_FAMILIES.has(row.family))) return null;
    if (day.prompts.some((row) => row.name !== 'unknown' && !KNOWN_PROMPTS.has(row.name))) return null;
  }
  return sortState(structuredClone(value));
}

export function classifyMcpClient(clientInfo) {
  if (!clientInfo || typeof clientInfo !== 'object' || Array.isArray(clientInfo)) return 'undeclared';
  if (typeof clientInfo.name !== 'string') return 'undeclared';
  const name = clientInfo.name.trim().slice(0, 120);
  if (!name) return 'undeclared';
  return CLIENT_FAMILIES.find(([, pattern]) => pattern.test(name))?.[0] ?? 'other';
}

export function classifyMcpTool(name) {
  return typeof name === 'string' && KNOWN_TOOLS.has(name) ? name : 'unknown';
}

export function classifyMcpPrompt(name) {
  return typeof name === 'string' && KNOWN_PROMPTS.has(name) ? name : 'unknown';
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
      events.push({ type: 'initialize', clientFamily: classifyMcpClient(message.params?.clientInfo) });
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

export function aggregateMcpUsage(state, events, now = new Date()) {
  const normalized = normalizeState(state);
  if (!normalized || !Array.isArray(events) || !(now instanceof Date) || !Number.isFinite(now.getTime())) {
    throw new Error('mcp_usage_schema_mismatch');
  }

  const cutoff = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  cutoff.setUTCDate(cutoff.getUTCDate() - (MCP_USAGE_RETENTION_DAYS - 1));
  const next = structuredClone(normalized);
  next.days = next.days.filter((day) => Date.parse(`${day.day}T00:00:00Z`) >= cutoff.getTime());

  if (!events.length) return next;
  let day = next.days.find((item) => item.day === dayKey(now));
  if (!day) {
    day = {
      day: dayKey(now),
      initializations: 0,
      toolCalls: 0,
      resourceReads: 0,
      promptGets: 0,
      clients: [],
      tools: [],
      resources: [],
      prompts: [],
    };
    next.days.push(day);
  }

  for (const event of events) {
    if (event?.type === 'initialize') {
      day.initializations += 1;
      incrementRow(day.clients, 'family', CLIENT_FAMILY_NAMES.has(event.clientFamily) ? event.clientFamily : 'other');
    } else if (event?.type === 'tool_call') {
      day.toolCalls += 1;
      incrementRow(day.tools, 'name', classifyMcpTool(event.toolName));
    } else if (event?.type === 'resource_read') {
      day.resourceReads += 1;
      incrementRow(day.resources, 'family', RESOURCE_FAMILIES.has(event.resourceFamily) ? event.resourceFamily : 'unknown');
    } else if (event?.type === 'prompt_get') {
      day.promptGets += 1;
      incrementRow(day.prompts, 'name', classifyMcpPrompt(event.promptName));
    }
  }

  next.updatedAt = now.toISOString();
  return sortState(next);
}

function mergeRows(days, source, key) {
  const rows = new Map();
  for (const day of days) {
    for (const item of day[source]) {
      rows.set(item[key], (rows.get(item[key]) ?? 0) + item.count);
    }
  }
  return [...rows.entries()]
    .map(([value, count]) => ({ [key]: value, count }))
    .sort((left, right) => right.count - left.count || left[key].localeCompare(right[key]));
}

function ratio(numerator, denominator) {
  return denominator > 0 ? Number((numerator / denominator).toFixed(6)) : null;
}

export function buildPublicMcpUsageReport(state, minimumCohort = MCP_USAGE_MINIMUM_PUBLIC_COHORT) {
  const value = normalizeState(state);
  if (!value || !Number.isSafeInteger(minimumCohort) || minimumCohort < 2) {
    throw new Error('mcp_usage_schema_mismatch');
  }

  const totals = value.days.reduce((acc, day) => ({
    initializations: acc.initializations + day.initializations,
    toolCalls: acc.toolCalls + day.toolCalls,
    resourceReads: acc.resourceReads + day.resourceReads,
    promptGets: acc.promptGets + day.promptGets,
  }), { initializations: 0, toolCalls: 0, resourceReads: 0, promptGets: 0 });
  const clients = mergeRows(value.days, 'clients', 'family');
  const declared = clients.filter((row) => row.family !== 'undeclared').reduce((sum, row) => sum + row.count, 0);

  return {
    schema_version: MCP_USAGE_SCHEMA_VERSION,
    updated_at: value.updatedAt,
    retention_days: MCP_USAGE_RETENTION_DAYS,
    minimum_public_cohort: minimumCohort,
    measurement: {
      clients: 'Familles fermées dérivées de clientInfo.name ; le nom libre et la version ne sont jamais conservés.',
      people: 'Aucun utilisateur, appelant ou récurrent n’est estimé : aucune IP, empreinte, session ni cookie n’est utilisé.',
    },
    totals: {
      initializations: totals.initializations,
      tool_calls: totals.toolCalls,
      resource_reads: totals.resourceReads,
      prompt_gets: totals.promptGets,
      client_info_declared: declared,
      client_info_declaration_rate: ratio(declared, totals.initializations),
    },
    clients: clients.filter((row) => row.count >= minimumCohort),
    tools: mergeRows(value.days, 'tools', 'name'),
    resources: mergeRows(value.days, 'resources', 'family'),
    prompts: mergeRows(value.days, 'prompts', 'name'),
    daily: value.days.map((day) => ({
      date: day.day,
      initializations: day.initializations,
      tool_calls: day.toolCalls,
      resource_reads: day.resourceReads,
      prompt_gets: day.promptGets,
    })),
    limitations: [
      'Les tentatives et retries peuvent augmenter les compteurs.',
      'Les familles client sous le seuil public sont masquées.',
      'Les appels de tools ne sont pas reliés à une famille client en mode MCP stateless.',
      'Aucune donnée ne permet de compter des personnes ou des intégrations uniques.',
    ],
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
  let pendingEvents = [];
  let flushTimer = null;

  function enqueue(events) {
    if (!enabled || !events.length) return;
    queue = queue.then(async () => {
      const state = await statePromise;
      const next = aggregateMcpUsage(state, events, new Date(now()));
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
    const events = pendingEvents;
    pendingEvents = [];
    enqueue(events);
  }

  function schedule(events) {
    if (!enabled || !events.length) return;
    pendingEvents.push(...events);
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
    recordRpc(body) {
      schedule(extractMcpUsageEvents(body));
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
  };
}
