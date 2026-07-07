import type { CollectionEntry } from 'astro:content';
import { createHash } from 'node:crypto';
import {
  AGENT_SITE,
  buildChangefeedSurface,
  buildFreshnessSurface,
  buildIntegritySurface,
  generatedAt,
  sortGuides,
  sortPosts,
} from './agent-surface.ts';
import { buildSignalHistorySurface, type SignalObservation, type SignalLevelChange } from './signal-history.ts';

type PostEntry = CollectionEntry<'posts'>;
type GuideEntry = CollectionEntry<'guides'>;

type RiskSnapshotInput = {
  updated?: string | null;
  indices?: Array<{ key?: string; value?: number; scale?: number; level?: string; tone?: string }>;
  provenance?: Record<string, { sources?: Array<{ source?: string; latestDate?: string; metrics?: number }> }>;
};

const BLACK_BOX_SCHEMA = `${AGENT_SITE}/openapi.json#/components/schemas/BlackBoxSurface`;
const SIGNAL_KEYS = ['us', 'eu', 'yen', 'energie', 'debt'] as const;

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(',')}}`;
}

function sha256(value: unknown) {
  return createHash('sha256').update(typeof value === 'string' ? value : stableStringify(value), 'utf8').digest('hex');
}

function iso(value?: string | Date | null) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function day(value?: string | null) {
  const normalized = iso(value);
  return normalized ? normalized.slice(0, 10) : null;
}

function endOfDay(date: string) {
  return `${date}T23:59:59.999Z`;
}

function latestByInstrument(observations: SignalObservation[], until: string) {
  const byInstrument = new Map<string, SignalObservation>();
  for (const observation of observations) {
    if (!observation.observedAt || Date.parse(observation.observedAt) > Date.parse(until)) continue;
    const current = byInstrument.get(observation.instrument);
    if (!current || String(observation.observedAt).localeCompare(String(current.observedAt)) > 0) {
      byInstrument.set(observation.instrument, observation);
    }
  }
  return Object.fromEntries([...byInstrument.entries()].sort(([a], [b]) => a.localeCompare(b)));
}

function levelChangesOnDate(changes: SignalLevelChange[], date: string) {
  return changes
    .filter((event) => day(event.observedAt) === date)
    .map((event) => ({
      eventId: event.eventId,
      instrument: event.instrument,
      label: event.label,
      observedAt: event.observedAt,
      previousLevel: event.previousLevel,
      currentLevel: event.currentLevel,
      value: event.value,
      tone: event.tone,
      sourceUrl: event.sourceUrl,
    }));
}

function freshnessState(current: Record<string, SignalObservation>, date: string) {
  const until = Date.parse(endOfDay(date));
  const items = SIGNAL_KEYS.map((key) => {
    const signal = current[key];
    const observedAt = signal?.observedAt ?? null;
    const ageDays = observedAt ? Math.max(0, Math.floor((until - Date.parse(observedAt)) / 86400000)) : null;
    const status = !signal ? 'missing' : ageDays != null && ageDays > 7 ? 'stale' : 'fresh';
    return {
      instrument: key,
      status,
      observedAt,
      ageDays,
    };
  });

  return {
    status: items.some((item) => item.status === 'missing')
      ? 'partial'
      : items.some((item) => item.status === 'stale')
        ? 'stale'
        : 'fresh',
    completeSignals: items.filter((item) => item.status !== 'missing').length,
    staleSignals: items.filter((item) => item.status === 'stale').length,
    missingSignals: items.filter((item) => item.status === 'missing').map((item) => item.instrument),
    signals: items,
  };
}

function sourceState(current: Record<string, SignalObservation>) {
  const available = Object.values(current)
    .map((signal) => ({
      instrument: signal.instrument,
      label: signal.label,
      sourceUrl: signal.sourceUrl,
      sourceSnapshotUrl: signal.sourceSnapshotUrl,
      sourcePublishedAt: signal.sourcePublishedAt,
      retrievedAt: signal.retrievedAt,
      snapshotHash: signal.snapshotHash,
    }))
    .sort((a, b) => a.instrument.localeCompare(b.instrument));
  return {
    available,
    missingSignals: SIGNAL_KEYS.filter((key) => !current[key]),
  };
}

function modelState(current: Record<string, SignalObservation>) {
  return Object.values(current)
    .map((signal) => ({
      instrument: signal.instrument,
      methodologyUrl: signal.methodologyUrl,
      calculatorRepo: signal.calculatorRepo,
      calculatorRevision: signal.calculatorRevision,
    }))
    .sort((a, b) => a.instrument.localeCompare(b.instrument));
}

function entriesOnDate(entries: any[], date: string) {
  return entries.filter((entry) => day(entry.date) === date);
}

function buildFrame(input: {
  date: string;
  observations: SignalObservation[];
  levelChanges: SignalLevelChange[];
  changeEntries: any[];
  integritySnapshots: any[];
}) {
  const until = endOfDay(input.date);
  const current = latestByInstrument(input.observations, until) as Record<string, SignalObservation>;
  const changes = entriesOnDate(input.changeEntries, input.date);
  const articles = changes.filter((entry) => entry.contentType === 'article');
  const methodologyChanges = changes.filter(
    (entry) =>
      entry.contentType === 'policy' ||
      entry.contentType === 'guide' ||
      entry.semanticChange === 'editorial-policy-change' ||
      entry.changedFields?.includes('methodology')
  );
  const triggeredSignals = levelChangesOnDate(input.levelChanges, input.date);
  const freshness = freshnessState(current, input.date);
  const signals = Object.values(current)
    .map((signal) => ({
      instrument: signal.instrument,
      label: signal.label,
      observedAt: signal.observedAt,
      value: signal.value,
      rawValue: signal.rawValue,
      scale: signal.scale,
      level: signal.level,
      tone: signal.tone,
      snapshotHash: signal.snapshotHash,
      sourceUrl: signal.sourceUrl,
      sourceSnapshotUrl: signal.sourceSnapshotUrl,
      methodologyUrl: signal.methodologyUrl,
      calculatorRevision: signal.calculatorRevision,
    }))
    .sort((a, b) => a.instrument.localeCompare(b.instrument));

  const frameCore = {
    date: input.date,
    replayableAt: until,
    signals,
    sources: sourceState(current),
    models: modelState(current),
    articles,
    methodologyChanges,
    triggeredSignals,
    freshness,
    integrity: {
      algorithm: 'sha-256',
      surfaces: input.integritySnapshots.map((snapshot) => ({
        path: snapshot.path,
        canonicalSha256: snapshot.canonicalSha256,
        canonicalBytes: snapshot.canonicalBytes,
      })),
    },
    limitations: [
      'Frame point-in-time dérivée uniquement des observations et changements déjà publiés dans les surfaces publiques.',
      'Aucun signal manquant n’est reconstruit après coup.',
      'Les hashes d’intégrité référencent les surfaces canoniques disponibles au build, pas une attestation externe quotidienne indépendante.',
    ],
  };

  return {
    ...frameCore,
    frameHash: sha256(frameCore),
  };
}

function frameDates(observations: SignalObservation[], levelChanges: SignalLevelChange[], changeEntries: any[]) {
  const dates = new Set<string>();
  for (const observation of observations) {
    const value = day(observation.observedAt);
    if (value) dates.add(value);
  }
  for (const event of levelChanges) {
    const value = day(event.observedAt);
    if (value) dates.add(value);
  }
  for (const entry of changeEntries) {
    const value = day(entry.date);
    if (value) dates.add(value);
  }
  return [...dates].sort();
}

export function buildBlackBoxSurface(posts: PostEntry[], guides: GuideEntry[], risk: RiskSnapshotInput | null) {
  const sortedPosts = sortPosts(posts);
  const sortedGuides = sortGuides(guides);
  const signalHistory = buildSignalHistorySurface();
  const changes = buildChangefeedSurface(sortedPosts, sortedGuides);
  const freshness = buildFreshnessSurface(sortedPosts, sortedGuides, risk);
  const integrity = buildIntegritySurface(sortedPosts, sortedGuides);
  const signalDates = signalHistory.observations
    .map((observation) => day(observation.observedAt))
    .filter((date): date is string => Boolean(date))
    .sort();
  const firstSignalFrameDate = signalDates[0] ?? null;
  const dates = frameDates(signalHistory.observations, signalHistory.levelChanges, changes.entries).filter(
    (date) => !firstSignalFrameDate || date >= firstSignalFrameDate
  );
  const frames = dates.map((date) =>
    buildFrame({
      date,
      observations: signalHistory.observations,
      levelChanges: signalHistory.levelChanges,
      changeEntries: changes.entries,
      integritySnapshots: integrity.snapshots,
    })
  );

  return {
    schema: BLACK_BOX_SCHEMA,
    version: '1',
    generated: generatedAt(),
    title: 'Black Box Recorder l0g',
    question: 'Rejouer l’état public des signaux de risque à une date donnée.',
    coverage: {
      frames: frames.length,
      firstFrameDate: frames[0]?.date ?? null,
      lastFrameDate: frames.at(-1)?.date ?? null,
      instruments: signalHistory.coverage.instruments,
      observations: signalHistory.coverage.observations,
      levelChanges: signalHistory.coverage.levelChanges,
      pointInTime: signalHistory.coverage.pointInTime,
    },
    replay: {
      acceptedDateFormat: 'YYYY-MM-DD',
      rule: 'Sélectionner la dernière frame publiée dont date <= date demandée. Si aucune frame n’existe, retourner not-replayable.',
      archiveStartDate: firstSignalFrameDate,
      example: {
        requestedDate: '2026-03-12',
        result:
          frames.some((frame) => frame.date <= '2026-03-12')
            ? 'replayable'
            : 'not-replayable: aucune frame publique antérieure ou égale à 2026-03-12',
      },
    },
    inputs: {
      signals: `${AGENT_SITE}/api/v1/signals/history.json`,
      integrity: `${AGENT_SITE}/api/v1/integrity.json`,
      freshness: `${AGENT_SITE}/api/v1/freshness.json`,
      changes: `${AGENT_SITE}/api/v1/changes.json`,
      risk: `${AGENT_SITE}/api/v1/risk.json`,
      debtRisk: `${AGENT_SITE}/api/v1/debt-risk.json`,
    },
    currentFreshness: {
      signalFreshness: freshness.signalFreshness,
      policy: freshness.freshnessPolicy,
    },
    frames,
    policy: {
      promise:
        'Publier des frames datées, hashées et rejouables pour exposer les erreurs comme les bons signaux.',
      noPostHoc:
        'Une frame absente reste absente. Les dates antérieures au premier signal archivé ne sont pas reconstruites avec des calculs rétrospectifs.',
      correctionPolicy: `${AGENT_SITE}/protocole-editorial/`,
      changelog: `${AGENT_SITE}/changelog-editorial/`,
    },
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
  };
}
