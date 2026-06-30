import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { riskSignalMeta } from '../config/risk-signals.ts';

const SITE = 'https://l0g.fr';
const VERSION = '1';
const SIGNAL_KEYS = ['us', 'eu', 'yen', 'energie', 'debt'] as const;
const SIGNAL_GENERATED_AT = new Date().toISOString();

type SignalKey = (typeof SIGNAL_KEYS)[number];

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
  instrument: SignalKey;
  label: string;
  observedAt: string | null;
  sourcePublishedAt: string | null;
  retrievedAt: string | null;
  computedAt: string;
  value: number | null;
  rawValue: number | null;
  scale: number;
  level: string | null;
  tone: string | null;
  sourceUrl: string;
  methodologyUrl: string;
  sourceSnapshotUrl: string;
  calculatorRepo: string | null;
  calculatorRevision: string | null;
  snapshotHash: string;
  pointInTime: boolean;
  backtestUsable: boolean;
  limitations: string[];
};

export type SignalLevelChange = {
  recordType: 'level-change';
  schemaVersion: string;
  eventId: string;
  instrument: SignalKey;
  label: string;
  observedAt: string | null;
  previousLevel: string | null;
  currentLevel: string | null;
  value: number | null;
  tone: string | null;
  sourceUrl: string;
  pointInTime: boolean;
  backtestUsable: boolean;
  limitations: string[];
};

type SignalSurface = {
  schema: string;
  version: string;
  generated: string;
  coverage: {
    observations: number;
    levelChanges: number;
    instruments: SignalKey[];
    firstObservedAt: string | null;
    lastObservedAt: string | null;
    pointInTime: boolean;
  };
  policy: {
    purpose: string;
    appendOnlyTarget: string;
    dateDiscipline: string;
    backtestRule: string;
    caveat: string;
    license: string;
    attribution: string;
  };
  instruments: Array<{
    key: SignalKey;
    label: string;
    source: string;
    methodology: string;
  }>;
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

function readArchivedObservations(computedAt: string): SignalObservation[] {
  const rel = 'public/signals-history.ndjson';
  const abs = join(process.cwd(), rel);
  if (!existsSync(abs)) return [];

  const rows: SignalObservation[] = [];
  for (const line of readFileSync(abs, 'utf-8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const parsed = JSON.parse(trimmed) as Partial<SignalObservation>;
      const key = signalKey(parsed.instrument);
      if (parsed.recordType !== 'observation' || !key) continue;
      rows.push({
        schemaVersion: parsed.schemaVersion ?? VERSION,
        recordType: 'observation',
        recordId: String(parsed.recordId ?? `obs:${key}:${parsed.observedAt ?? 'unknown'}`),
        instrument: key,
        label: String(parsed.label ?? riskSignalMeta[key].label),
        observedAt: isoOrNull(parsed.observedAt),
        sourcePublishedAt: isoOrNull(parsed.sourcePublishedAt),
        retrievedAt: isoOrNull(parsed.retrievedAt),
        computedAt: isoOrNull(parsed.computedAt) ?? computedAt,
        value: typeof parsed.value === 'number' ? parsed.value : null,
        rawValue: typeof parsed.rawValue === 'number' ? parsed.rawValue : null,
        scale: typeof parsed.scale === 'number' ? parsed.scale : 100,
        level: parsed.level ? String(parsed.level) : null,
        tone: parsed.tone ? String(parsed.tone) : null,
        sourceUrl: String(parsed.sourceUrl ?? riskSignalMeta[key].source),
        methodologyUrl: String(parsed.methodologyUrl ?? riskSignalMeta[key].methodology),
        sourceSnapshotUrl: String(parsed.sourceSnapshotUrl ?? `${SITE}/api/v1/risk.json`),
        calculatorRepo: parsed.calculatorRepo ? String(parsed.calculatorRepo) : null,
        calculatorRevision: parsed.calculatorRevision ? String(parsed.calculatorRevision) : null,
        snapshotHash: String(parsed.snapshotHash ?? sha256(stableStringify(parsed))),
        pointInTime: parsed.pointInTime !== false,
        backtestUsable: parsed.backtestUsable !== false,
        limitations: Array.isArray(parsed.limitations) ? parsed.limitations.map(String) : [],
      });
    } catch {
      /* ignore malformed archived rows */
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
      const sourcePublishedAt = isoOrNull(provenance?.generatedAt ?? (key === 'debt' ? debt?.generated : null));
      const retrievedAt = isoOrNull(provenance?.retrievedAt ?? (key === 'debt' ? debt?.retrievedAt : null));
      const observedAt = isoOrNull(risk.updated ?? sourcePublishedAt ?? retrievedAt);
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

      return {
        recordType: 'observation' as const,
        schemaVersion: VERSION,
        recordId: `obs:${key}:${observedAt ?? 'unknown'}:${snapshotHash.slice(0, 12)}`,
        instrument: key,
        label: meta.label,
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
          'Score normalise par instrument, pas une probabilite.',
          'Les dates sourcePublishedAt et retrievedAt peuvent rester null si le dashboard amont ne les expose pas.',
          'La serie historique complete depend de l archive append-only public/signals-history.ndjson.',
        ],
      };
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
      const observedAt = isoOrNull(event.ts);
      return {
        recordType: 'level-change' as const,
        schemaVersion: VERSION,
        eventId: `event:${key}:${observedAt ?? 'unknown'}:${sha256(stableStringify(event)).slice(0, 12)}`,
        instrument: key,
        label: event.label ?? meta.label,
        observedAt,
        previousLevel: event.from ?? null,
        currentLevel: event.to ?? null,
        value: typeof event.value === 'number' ? event.value : null,
        tone: event.tone ?? null,
        sourceUrl: event.source ?? meta.source,
        pointInTime: true,
        backtestUsable: false,
        limitations: [
          'Evenement de franchissement de seuil, pas une observation complete.',
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
    (a, b) =>
      String(a.observedAt).localeCompare(String(b.observedAt)) ||
      a.instrument.localeCompare(b.instrument)
  );
}

export function buildSignalHistorySurface(): SignalSurface {
  const computedAt = SIGNAL_GENERATED_AT;
  const observations = mergeObservations([
    ...readArchivedObservations(computedAt),
    ...currentObservations(computedAt),
  ]);
  const changes = levelChanges();
  const observedDates = observations.map((item) => item.observedAt).filter((value): value is string => Boolean(value));
  const current: Partial<Record<SignalKey, SignalObservation>> = {};
  for (const observation of observations) current[observation.instrument] = observation;

  return {
    schema: `${SITE}/api/v1/signals/schema.json`,
    version: VERSION,
    generated: computedAt,
    coverage: {
      observations: observations.length,
      levelChanges: changes.length,
      instruments: SIGNAL_KEYS.filter((key) => observations.some((item) => item.instrument === key)),
      firstObservedAt: observedDates[0] ?? null,
      lastObservedAt: observedDates.at(-1) ?? null,
      pointInTime: true,
    },
    policy: {
      purpose: 'Historique public point-in-time des signaux l0g pour audit, replay et backtest.',
      appendOnlyTarget: 'public/signals-history.ndjson',
      dateDiscipline:
        'observedAt date la valeur du signal, sourcePublishedAt date la publication amont, retrievedAt date la collecte par l0g, computedAt date la generation du fichier.',
      backtestRule: 'Utiliser seulement observations. Les levelChanges sont des alertes derivees, pas des points de serie.',
      caveat: 'Best-effort, pas du temps reel strict, pas un conseil en investissement.',
      license: 'CC BY 4.0',
      attribution: 'l0g.fr',
    },
    instruments: SIGNAL_KEYS.map((key) => ({
      key,
      label: riskSignalMeta[key].label,
      source: riskSignalMeta[key].source,
      methodology: riskSignalMeta[key].methodology,
    })),
    current,
    observations,
    levelChanges: changes,
  };
}

export function buildSignalHistoryNdjsonRows() {
  const surface = buildSignalHistorySurface();
  return [
    {
      recordType: 'meta',
      version: surface.version,
      schema: surface.schema,
      coverage: surface.coverage,
      policy: surface.policy,
    },
    ...surface.observations,
    ...surface.levelChanges,
  ];
}

function csvCell(value: unknown) {
  if (value == null) return '';
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function buildSignalHistoryCsv() {
  const headers = [
    'observedAt',
    'instrument',
    'label',
    'value',
    'rawValue',
    'scale',
    'level',
    'tone',
    'sourcePublishedAt',
    'retrievedAt',
    'computedAt',
    'sourceUrl',
    'methodologyUrl',
    'sourceSnapshotUrl',
    'calculatorRepo',
    'calculatorRevision',
    'snapshotHash',
  ];
  const rows = buildSignalHistorySurface().observations.map((observation) =>
    headers.map((header) => csvCell(observation[header as keyof SignalObservation])).join(',')
  );
  return `${headers.join(',')}\n${rows.join('\n')}\n`;
}

export function buildSignalSchemaSurface() {
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: `${SITE}/api/v1/signals/schema.json`,
    title: 'l0g signal history',
    description: 'Contrat des observations point-in-time et evenements de franchissement des signaux l0g.',
    oneOf: [
      { $ref: '#/$defs/meta' },
      { $ref: '#/$defs/observation' },
      { $ref: '#/$defs/levelChange' },
    ],
    $defs: {
      meta: {
        type: 'object',
        required: ['recordType', 'version', 'generated', 'coverage', 'policy'],
        properties: { recordType: { const: 'meta' } },
        additionalProperties: true,
      },
      observation: {
        type: 'object',
        required: ['recordType', 'recordId', 'instrument', 'observedAt', 'value', 'snapshotHash', 'backtestUsable'],
        properties: {
          recordType: { const: 'observation' },
          instrument: { enum: SIGNAL_KEYS },
          observedAt: { type: ['string', 'null'], format: 'date-time' },
          value: { type: ['number', 'null'] },
          rawValue: { type: ['number', 'null'] },
          backtestUsable: { const: true },
        },
        additionalProperties: true,
      },
      levelChange: {
        type: 'object',
        required: ['recordType', 'eventId', 'instrument', 'observedAt', 'previousLevel', 'currentLevel', 'backtestUsable'],
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
