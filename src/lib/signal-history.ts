import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  SIGNAL_KEYS,
  riskSignalMeta,
  type RiskSignalKey,
} from '../config/risk-signals.ts';
import { loadBlackBoxArchive, type ArchiveFrame } from './black-box-archive.ts';

const SITE = 'https://l0g.fr';
const VERSION = '2';
const SIGNAL_GENERATED_AT = process.env.L0G_BUILD_TIMESTAMP || new Date().toISOString();

export type SignalKey = RiskSignalKey;
export type MethodologyVersionStatus = 'versioned' | 'unversioned-legacy';

type RiskIndexInput = {
  key?: string;
  value?: number;
  scale?: number;
  level?: string;
  tone?: string;
};

type RiskEventInput = {
  ts?: string;
  key?: string;
  label?: string;
  from?: string;
  to?: string;
  value?: number;
  tone?: string;
  source?: string;
};

export type SignalObservation = {
  recordType: 'observation';
  schemaVersion: string;
  recordId: string;
  sourceRecordId: string | null;
  instrument: SignalKey;
  seriesId: string;
  seriesSlug: string;
  name: string;
  shortName: string;
  citationName: string;
  label: string;
  seriesDate: string;
  observedAt: string | null;
  sourcePublishedAt: string | null;
  retrievedAt: string | null;
  computedAt: string;
  archivedAt: string | null;
  value: number | null;
  rawValue: number | null;
  scale: number;
  level: string | null;
  tone: string | null;
  identityVersion: string;
  methodologyVersion: string | null;
  methodologyVersionStatus: MethodologyVersionStatus;
  methodologyEffectiveFrom: string;
  sourceUrl: string;
  methodologyUrl: string;
  methodologyChangelogUrl: string;
  sourceSnapshotUrl: string;
  calculatorRepo: string | null;
  calculatorRevision: string | null;
  snapshotHash: string;
  archiveFrameId: string | null;
  archiveFrameHash: string | null;
  appendOnlyVerified: boolean;
  pointInTime: boolean;
  backtestUsable: boolean;
  limitations: string[];
};

export type SignalLevelChange = {
  recordType: 'level-change';
  schemaVersion: string;
  eventId: string;
  instrument: SignalKey;
  seriesId: string;
  seriesSlug: string;
  name: string;
  label: string;
  observedAt: string | null;
  previousLevel: string | null;
  currentLevel: string | null;
  value: number | null;
  tone: string | null;
  sourceUrl: string;
  methodologyUrl: string;
  pointInTime: boolean;
  backtestUsable: boolean;
  limitations: string[];
};

export type SignalSeriesMetadata = {
  key: SignalKey;
  label: string;
  seriesId: string;
  slug: string;
  name: string;
  shortName: string;
  citationName: string;
  description: string;
  dashboardLabel: string;
  identityVersion: string;
  identityEffectiveFrom: string;
  methodologyVersion: string;
  methodologyEffectiveFrom: string;
  source: string;
  methodology: string;
  methodologyChangelog: string;
  page: string;
  downloads: {
    json: string;
    ndjson: string;
    csv: string;
  };
  recommendedCitation: string;
  coverage: {
    observations: number;
    appendOnlyVerifiedObservations: number;
    firstSeriesDate: string | null;
    lastSeriesDate: string | null;
    firstObservedAt: string | null;
    lastObservedAt: string | null;
  };
};

export type SignalHistoryPolicy = {
  purpose: string;
  appendOnlyTarget: string;
  dateDiscipline: string;
  methodologyDiscipline: string;
  noRetroactiveBackfill: string;
  backtestRule: string;
  caveat: string;
  license: string;
  attribution: string;
};

export type SignalSurface = {
  schema: string;
  version: string;
  generated: string;
  coverage: {
    observations: number;
    appendOnlyVerifiedObservations: number;
    methodologyVersionedObservations: number;
    archiveFrames: number;
    levelChanges: number;
    instruments: SignalKey[];
    firstSeriesDate: string | null;
    lastSeriesDate: string | null;
    firstObservedAt: string | null;
    lastObservedAt: string | null;
    pointInTime: boolean;
  };
  policy: SignalHistoryPolicy;
  instruments: SignalSeriesMetadata[];
  current: Partial<Record<SignalKey, SignalObservation>>;
  observations: SignalObservation[];
  levelChanges: SignalLevelChange[];
};

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(',')}}`;
}

function sha256(value: string) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function readJson<T>(rel: string, fallback: T): T {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), rel), 'utf-8')) as T;
  } catch {
    return fallback;
  }
}

function isoOrNull(value: unknown): string | null {
  if (!value) return null;
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function signalKey(value: unknown): SignalKey | null {
  return SIGNAL_KEYS.includes(value as SignalKey) ? (value as SignalKey) : null;
}

function uniqueStrings(values: string[]) {
  return [...new Set(values.filter(Boolean))];
}

function seriesUrls(key: SignalKey) {
  const slug = riskSignalMeta[key].identity.slug;
  const root = `${SITE}/api/v1/signals/${slug}/history`;
  return {
    page: `${SITE}/series/${slug}/`,
    downloads: {
      json: `${root}.json`,
      ndjson: `${root}.ndjson`,
      csv: `${root}.csv`,
    },
  };
}

function seriesMetadata(key: SignalKey, observations: SignalObservation[] = []): SignalSeriesMetadata {
  const meta = riskSignalMeta[key];
  const identity = meta.identity;
  const dates = observations.map((item) => item.seriesDate).sort();
  const urls = seriesUrls(key);
  return {
    key,
    label: meta.label,
    seriesId: identity.seriesId,
    slug: identity.slug,
    name: identity.name,
    shortName: identity.shortName,
    citationName: identity.citationName,
    description: identity.description,
    dashboardLabel: meta.label,
    identityVersion: identity.identityVersion,
    identityEffectiveFrom: identity.identityEffectiveFrom,
    methodologyVersion: identity.methodologyVersion,
    methodologyEffectiveFrom: identity.methodologyEffectiveFrom,
    source: meta.source,
    methodology: meta.methodology,
    methodologyChangelog: identity.methodologyChangelog,
    page: urls.page,
    downloads: urls.downloads,
    recommendedCitation:
      `l0g.fr (2026), « ${identity.citationName} », ${identity.seriesId}, ` +
      `méthodologie ${identity.methodologyVersion}, CC BY 4.0, ${urls.page}`,
    coverage: {
      observations: observations.length,
      appendOnlyVerifiedObservations: observations.filter((item) => item.appendOnlyVerified).length,
      firstSeriesDate: dates[0] ?? null,
      lastSeriesDate: dates.at(-1) ?? null,
      firstObservedAt: dates[0] ?? null,
      lastObservedAt: dates.at(-1) ?? null,
    },
  };
}

export function signalSeriesRegistry() {
  return SIGNAL_KEYS.map((key) => seriesMetadata(key));
}

export function signalKeyFromSlug(slug: string): SignalKey | null {
  return SIGNAL_KEYS.find((key) => riskSignalMeta[key].identity.slug === slug) ?? null;
}

function normalizeObservation(
  parsed: Partial<SignalObservation> & Record<string, unknown>,
  key: SignalKey,
  fallbackComputedAt: string,
  options: { frame?: ArchiveFrame; current?: boolean } = {},
): SignalObservation {
  const meta = riskSignalMeta[key];
  const identity = meta.identity;
  const frame = options.frame;
  const computedAt = isoOrNull(parsed.computedAt ?? frame?.computedAt ?? fallbackComputedAt) ?? fallbackComputedAt;
  const seriesDate = isoOrNull(frame?.computedAt ?? parsed.seriesDate ?? parsed.computedAt ?? parsed.observedAt ?? fallbackComputedAt) ?? computedAt;
  const parsedHash = typeof parsed.snapshotHash === 'string' && /^[a-f0-9]{64}$/.test(parsed.snapshotHash)
    ? parsed.snapshotHash
    : sha256(stableStringify(parsed));
  const methodologyVersion = typeof parsed.methodologyVersion === 'string'
    ? parsed.methodologyVersion
    : options.current
      ? identity.methodologyVersion
      : null;
  const archivedAt = frame ? isoOrNull(frame.computedAt) : isoOrNull(parsed.archivedAt);
  const appendOnlyVerified = Boolean(frame) || parsed.appendOnlyVerified === true;
  const sourceRecordId = parsed.sourceRecordId
    ? String(parsed.sourceRecordId)
    : parsed.recordId
      ? String(parsed.recordId)
      : null;
  const limitations = Array.isArray(parsed.limitations) ? parsed.limitations.map(String) : [];
  if (!methodologyVersion) {
    limitations.push('Point antérieur au registre méthodologique versionné lancé le 17 juillet 2026.');
  }
  if (!parsed.sourcePublishedAt && key !== 'debt') {
    limitations.push('Date de publication de la source amont non exposée par le snapshot historique.');
  }

  return {
    recordType: 'observation',
    schemaVersion: VERSION,
    recordId: `obs:${key}:${seriesDate}:${parsedHash.slice(0, 12)}`,
    sourceRecordId,
    instrument: key,
    seriesId: identity.seriesId,
    seriesSlug: identity.slug,
    name: identity.name,
    shortName: identity.shortName,
    citationName: identity.citationName,
    label: String(parsed.label ?? meta.label),
    seriesDate,
    observedAt: isoOrNull(parsed.observedAt),
    sourcePublishedAt: isoOrNull(parsed.sourcePublishedAt),
    retrievedAt: isoOrNull(parsed.retrievedAt),
    computedAt,
    archivedAt,
    value: typeof parsed.value === 'number' ? parsed.value : null,
    rawValue: typeof parsed.rawValue === 'number' ? parsed.rawValue : null,
    scale: typeof parsed.scale === 'number' ? parsed.scale : 100,
    level: parsed.level ? String(parsed.level) : null,
    tone: parsed.tone ? String(parsed.tone) : null,
    identityVersion: identity.identityVersion,
    methodologyVersion,
    methodologyVersionStatus: methodologyVersion ? 'versioned' : 'unversioned-legacy',
    methodologyEffectiveFrom: identity.methodologyEffectiveFrom,
    sourceUrl: String(parsed.sourceUrl ?? meta.source),
    methodologyUrl: String(parsed.methodologyUrl ?? meta.methodology),
    methodologyChangelogUrl: identity.methodologyChangelog,
    sourceSnapshotUrl: String(parsed.sourceSnapshotUrl ?? `${SITE}/api/v1/risk.json`),
    calculatorRepo: parsed.calculatorRepo ? String(parsed.calculatorRepo) : null,
    calculatorRevision: parsed.calculatorRevision ? String(parsed.calculatorRevision) : null,
    snapshotHash: parsedHash,
    archiveFrameId: frame?.frameId ?? (parsed.archiveFrameId ? String(parsed.archiveFrameId) : null),
    archiveFrameHash: frame?.frameHash ?? (parsed.archiveFrameHash ? String(parsed.archiveFrameHash) : null),
    appendOnlyVerified,
    pointInTime: parsed.pointInTime !== false,
    backtestUsable: parsed.backtestUsable !== false,
    limitations: uniqueStrings(limitations),
  };
}

function readLegacyNdjsonObservations(computedAt: string): SignalObservation[] {
  const abs = join(process.cwd(), 'public/signals-history.ndjson');
  if (!existsSync(abs)) return [];

  const rows: SignalObservation[] = [];
  for (const line of readFileSync(abs, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const parsed = JSON.parse(trimmed) as Partial<SignalObservation> & Record<string, unknown>;
      const key = signalKey(parsed.instrument);
      if (parsed.recordType !== 'observation' || !key) continue;
      rows.push(normalizeObservation(parsed, key, computedAt));
    } catch {
      /* Ignore malformed legacy rows; the append-only frame reader remains authoritative. */
    }
  }
  return rows;
}

function readArchivedObservations(computedAt: string): SignalObservation[] {
  const archive = loadBlackBoxArchive();
  if (!archive.available) return [];
  const rows: SignalObservation[] = [];
  for (const frame of archive.frames) {
    for (const raw of frame.signals) {
      const parsed = raw as Partial<SignalObservation> & Record<string, unknown>;
      const key = signalKey(parsed.instrument);
      if (parsed.recordType !== 'observation' || !key) continue;
      rows.push(normalizeObservation(parsed, key, computedAt, { frame }));
    }
  }
  return rows;
}

function currentObservations(computedAt: string): SignalObservation[] {
  const risk = readJson<{ updated?: string; indices?: RiskIndexInput[]; provenance?: Record<string, any> }>('public/risk.json', { indices: [] });
  const debt = readJson<any | null>('public/debt-latest.json', null);

  return (risk.indices ?? [])
    .map((item) => {
      const key = signalKey(item.key);
      if (!key) return null;
      const meta = riskSignalMeta[key];
      const provenance = risk.provenance?.[key] ?? (key === 'debt' ? debt?.provenance : null) ?? null;
      const sourcePublishedAt = isoOrNull(provenance?.generatedAt ?? provenance?.sourcePublishedAt ?? (key === 'debt' ? debt?.generated : null));
      const retrievedAt = isoOrNull(provenance?.retrievedAt ?? (key === 'debt' ? debt?.retrievedAt : null));
      const observedAt = key === 'debt'
        ? isoOrNull(provenance?.observedAt ?? sourcePublishedAt ?? retrievedAt)
        : isoOrNull(provenance?.observedAt);
      const signalPayload = {
        key,
        value: item.value ?? null,
        scale: item.scale ?? 100,
        level: item.level ?? null,
        tone: item.tone ?? null,
        provenance,
      };
      const snapshotHash = sha256(stableStringify(signalPayload));
      const sourceUrl = String(provenance?.latestJsonUrl ?? provenance?.source ?? meta.source);
      const sourceSnapshotUrl = key === 'debt' ? `${SITE}/api/v1/debt-risk.json` : `${SITE}/api/v1/risk.json`;
      return normalizeObservation({
        recordType: 'observation',
        schemaVersion: VERSION,
        instrument: key,
        label: meta.label,
        seriesDate: computedAt,
        observedAt,
        sourcePublishedAt,
        retrievedAt,
        computedAt,
        value: typeof item.value === 'number' ? item.value : null,
        rawValue: typeof provenance?.scoreRaw === 'number' ? provenance.scoreRaw : typeof item.value === 'number' ? item.value : null,
        scale: typeof item.scale === 'number' ? item.scale : 100,
        level: item.level ?? null,
        tone: item.tone ?? null,
        sourceUrl,
        methodologyUrl: meta.methodology,
        sourceSnapshotUrl,
        calculatorRepo: provenance?.calculator ?? meta.calculation?.sourceCode ?? null,
        calculatorRevision: provenance?.calculatorRevision ?? meta.calculation?.sourceRevision ?? null,
        snapshotHash,
        pointInTime: true,
        backtestUsable: true,
        limitations: [
          'Score normalisé par instrument, pas une probabilité.',
          'seriesDate date la publication l0g ; observedAt reste nullable si la source amont ne fournit pas sa date.',
        ],
      }, key, computedAt, { current: true });
    })
    .filter((item): item is SignalObservation => Boolean(item));
}

function levelChanges(): SignalLevelChange[] {
  const data = readJson<{ updated?: string; events?: RiskEventInput[] }>('public/risk-events.json', { events: [] });
  return (data.events ?? [])
    .map((event) => {
      const key = signalKey(event.key);
      if (!key) return null;
      const meta = riskSignalMeta[key];
      const identity = meta.identity;
      const observedAt = isoOrNull(event.ts);
      return {
        recordType: 'level-change' as const,
        schemaVersion: VERSION,
        eventId: `event:${key}:${observedAt ?? 'unknown'}:${sha256(stableStringify(event)).slice(0, 12)}`,
        instrument: key,
        seriesId: identity.seriesId,
        seriesSlug: identity.slug,
        name: identity.name,
        label: event.label ?? meta.label,
        observedAt,
        previousLevel: event.from ?? null,
        currentLevel: event.to ?? null,
        value: typeof event.value === 'number' ? event.value : null,
        tone: event.tone ?? null,
        sourceUrl: event.source ?? meta.source,
        methodologyUrl: meta.methodology,
        pointInTime: true,
        backtestUsable: false,
        limitations: [
          'Événement de franchissement de seuil, pas une observation complète.',
          'Utiliser observations pour un backtest, levelChanges pour les alertes.',
        ],
      };
    })
    .filter((item): item is SignalLevelChange => Boolean(item))
    .sort((a, b) => String(a.observedAt).localeCompare(String(b.observedAt)));
}

function mergeObservations(observations: SignalObservation[]) {
  const byId = new Map<string, SignalObservation>();
  for (const observation of observations) byId.set(observation.recordId, observation);
  return Array.from(byId.values()).sort(
    (a, b) => a.seriesDate.localeCompare(b.seriesDate) || a.instrument.localeCompare(b.instrument)
  );
}

function historyPolicy(): SignalHistoryPolicy {
  return {
    purpose: 'Historique public point-in-time des signaux l0g pour audit, citation, replay et backtest.',
    appendOnlyTarget: 'black-box-archive/frames/*.json',
    dateDiscipline:
      'seriesDate date la publication l0g archivée ; observedAt date le phénomène amont ; sourcePublishedAt date la publication amont ; retrievedAt date la collecte ; computedAt date le calcul.',
    methodologyDiscipline:
      'Chaque point expose methodologyVersion. Les frames antérieures au 17 juillet 2026 restent explicitement unversioned-legacy.',
    noRetroactiveBackfill:
      'Aucun point absent n’est reconstruit après coup. La série probante commence à la première frame Black Box disponible.',
    backtestRule: 'Utiliser observations et seriesDate. Les levelChanges sont des alertes dérivées, pas des points de série.',
    caveat: 'Best-effort, pas du temps réel strict, pas un conseil en investissement.',
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
  };
}

export function buildSignalHistorySurface(): SignalSurface {
  const computedAt = isoOrNull(SIGNAL_GENERATED_AT) ?? SIGNAL_GENERATED_AT;
  const observations = mergeObservations([
    ...currentObservations(computedAt),
    ...readLegacyNdjsonObservations(computedAt),
    ...readArchivedObservations(computedAt),
  ]);
  const changes = levelChanges();
  const dates = observations.map((item) => item.seriesDate).sort();
  const current: Partial<Record<SignalKey, SignalObservation>> = {};
  for (const observation of observations) current[observation.instrument] = observation;

  return {
    schema: `${SITE}/api/v1/signals/schema.json`,
    version: VERSION,
    generated: computedAt,
    coverage: {
      observations: observations.length,
      appendOnlyVerifiedObservations: observations.filter((item) => item.appendOnlyVerified).length,
      methodologyVersionedObservations: observations.filter((item) => item.methodologyVersionStatus === 'versioned').length,
      archiveFrames: new Set(observations.map((item) => item.archiveFrameId).filter(Boolean)).size,
      levelChanges: changes.length,
      instruments: SIGNAL_KEYS.filter((key) => observations.some((item) => item.instrument === key)),
      firstSeriesDate: dates[0] ?? null,
      lastSeriesDate: dates.at(-1) ?? null,
      firstObservedAt: dates[0] ?? null,
      lastObservedAt: dates.at(-1) ?? null,
      pointInTime: true,
    },
    policy: historyPolicy(),
    instruments: SIGNAL_KEYS.map((key) => seriesMetadata(key, observations.filter((item) => item.instrument === key))),
    current,
    observations,
    levelChanges: changes,
  };
}

export function buildSignalSeriesSurface(key: SignalKey) {
  const history = buildSignalHistorySurface();
  const observations = history.observations.filter((item) => item.instrument === key);
  const levelChanges = history.levelChanges.filter((item) => item.instrument === key);
  const series = seriesMetadata(key, observations);
  return {
    schema: history.schema,
    version: history.version,
    generated: history.generated,
    series,
    coverage: {
      ...series.coverage,
      methodologyVersionedObservations: observations.filter((item) => item.methodologyVersionStatus === 'versioned').length,
      archiveFrames: new Set(observations.map((item) => item.archiveFrameId).filter(Boolean)).size,
      levelChanges: levelChanges.length,
      pointInTime: true,
    },
    policy: history.policy,
    current: history.current[key] ?? null,
    observations,
    levelChanges,
    license: history.policy.license,
    attribution: history.policy.attribution,
  };
}

export function buildSignalHistoryNdjsonRows(key?: SignalKey) {
  const surface = key ? buildSignalSeriesSurface(key) : buildSignalHistorySurface();
  const observations = surface.observations;
  const levelChanges = surface.levelChanges;
  return [
    {
      recordType: 'meta',
      version: surface.version,
      generated: surface.generated,
      schema: surface.schema,
      coverage: surface.coverage,
      policy: surface.policy,
      ...('series' in surface ? { series: surface.series } : {}),
    },
    ...observations,
    ...levelChanges,
  ];
}

function csvCell(value: unknown) {
  if (value == null) return '';
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function buildSignalHistoryCsv(key?: SignalKey) {
  const headers = [
    'seriesDate',
    'instrument',
    'seriesId',
    'seriesSlug',
    'name',
    'value',
    'rawValue',
    'scale',
    'level',
    'tone',
    'observedAt',
    'sourcePublishedAt',
    'retrievedAt',
    'computedAt',
    'archivedAt',
    'identityVersion',
    'methodologyVersion',
    'methodologyVersionStatus',
    'sourceUrl',
    'methodologyUrl',
    'sourceSnapshotUrl',
    'calculatorRepo',
    'calculatorRevision',
    'snapshotHash',
    'archiveFrameId',
    'archiveFrameHash',
    'appendOnlyVerified',
  ];
  const observations = buildSignalHistorySurface().observations.filter((item) => !key || item.instrument === key);
  const rows = observations.map((observation) =>
    headers.map((header) => csvCell(observation[header as keyof SignalObservation])).join(',')
  );
  return `${headers.join(',')}\n${rows.join('\n')}\n`;
}

export function buildSignalSchemaSurface() {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: `${SITE}/api/v1/signals/schema.json`,
    title: 'l0g signal history v2',
    description: 'Contrat des séries nommées, observations point-in-time et événements de seuil des signaux l0g.',
    oneOf: [
      { $ref: '#/$defs/meta' },
      { $ref: '#/$defs/observation' },
      { $ref: '#/$defs/levelChange' },
    ],
    $defs: {
      meta: {
        type: 'object',
        required: ['recordType', 'version', 'generated', 'coverage', 'policy'],
        properties: {
          recordType: { const: 'meta' },
          generated: { type: 'string', format: 'date-time' },
        },
        additionalProperties: true,
      },
      observation: {
        type: 'object',
        required: [
          'recordType', 'recordId', 'instrument', 'seriesId', 'seriesSlug', 'name', 'seriesDate',
          'value', 'snapshotHash', 'methodologyVersionStatus', 'appendOnlyVerified', 'backtestUsable',
        ],
        properties: {
          recordType: { const: 'observation' },
          instrument: { enum: SIGNAL_KEYS },
          seriesDate: { type: 'string', format: 'date-time' },
          observedAt: { type: ['string', 'null'], format: 'date-time' },
          value: { type: ['number', 'null'] },
          rawValue: { type: ['number', 'null'] },
          methodologyVersion: { type: ['string', 'null'] },
          methodologyVersionStatus: { enum: ['versioned', 'unversioned-legacy'] },
          appendOnlyVerified: { type: 'boolean' },
          backtestUsable: { const: true },
        },
        additionalProperties: true,
      },
      levelChange: {
        type: 'object',
        required: ['recordType', 'eventId', 'instrument', 'seriesId', 'observedAt', 'previousLevel', 'currentLevel', 'backtestUsable'],
        properties: {
          recordType: { const: 'level-change' },
          instrument: { enum: SIGNAL_KEYS },
          observedAt: { type: ['string', 'null'], format: 'date-time' },
          backtestUsable: { const: false },
        },
        additionalProperties: true,
      },
    },
  };
}
