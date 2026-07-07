import type { CollectionEntry } from 'astro:content';
import { riskSignalMeta } from '../config/risk-signals.ts';
import {
  AGENT_SITE,
  buildChangefeedSurface,
  buildClaimsSurface,
  buildFreshnessSurface,
  generatedAt,
  sortGuides,
  sortPosts,
} from './agent-surface.ts';
import { buildSignalHistorySurface, type SignalObservation } from './signal-history.ts';

type PostEntry = CollectionEntry<'posts'>;
type GuideEntry = CollectionEntry<'guides'>;

type RiskSourceInput = {
  source?: string;
  latestDate?: string;
  metrics?: number;
  maxRisk?: number;
};

type RiskSnapshotInput = {
  updated?: string | null;
  indices?: Array<{ key?: string; value?: number; level?: string; tone?: string }>;
  provenance?: Record<string, { sources?: RiskSourceInput[]; buckets?: Array<{ key?: string; label?: string; score?: number; status?: string }> }>;
};

const RISK_DIFF_SCHEMA = `${AGENT_SITE}/openapi.json#/components/schemas/RiskDiffSurface`;

type WindowSpec = {
  key: '1d' | '7d' | '30d';
  label: string;
  days: number;
};

const WINDOW_SPECS: WindowSpec[] = [
  { key: '1d', label: 'Depuis 24 heures', days: 1 },
  { key: '7d', label: 'Depuis 7 jours', days: 7 },
  { key: '30d', label: 'Depuis 30 jours', days: 30 },
];

function iso(value?: string | Date | null) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function daysBetween(a: string, b: string) {
  return Math.round((Date.parse(a) - Date.parse(b)) / 86400000);
}

function addDays(anchor: string, days: number) {
  const date = new Date(anchor);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

function latestObservation(observations: SignalObservation[]) {
  return observations
    .filter((item) => item.value != null && item.observedAt)
    .sort((a, b) => String(b.observedAt).localeCompare(String(a.observedAt)))[0] ?? null;
}

function baselineObservation(observations: SignalObservation[], since: string) {
  return observations
    .filter((item) => item.value != null && item.observedAt && Date.parse(item.observedAt) <= Date.parse(since))
    .sort((a, b) => String(b.observedAt).localeCompare(String(a.observedAt)))[0] ?? null;
}

function moveTone(delta: number | null) {
  if (delta == null) return 'missing';
  if (delta > 0.5) return 'up';
  if (delta < -0.5) return 'down';
  return 'flat';
}

function scoreConfidence(input: {
  signalCoverage: number;
  freshSources: number;
  staleSources: number;
  reviewedClaims: number;
  unreviewedClaims: number;
  explicitLimitations: number;
}) {
  const sourceBalance = input.freshSources + input.staleSources === 0
    ? 0.55
    : input.freshSources / (input.freshSources + input.staleSources);
  const reviewBalance = input.reviewedClaims + input.unreviewedClaims === 0
    ? 0.65
    : input.reviewedClaims / (input.reviewedClaims + input.unreviewedClaims);
  const raw =
    input.signalCoverage * 0.45 +
    sourceBalance * 0.25 +
    reviewBalance * 0.2 +
    Math.max(0, 1 - input.explicitLimitations * 0.12) * 0.1;
  const score = Math.max(0, Math.min(100, Math.round(raw * 100)));
  const label = score >= 75 ? 'haut' : score >= 55 ? 'moyen' : 'limité';
  return { score, label };
}

function sourceFreshness(risk: RiskSnapshotInput | null, since: string, anchor: string) {
  const debtSources = risk?.provenance?.debt?.sources ?? [];
  const all = debtSources
    .filter((source) => source.source)
    .map((source) => {
      const latestDate = iso(source.latestDate);
      const futureDated = latestDate ? Date.parse(latestDate) > Date.parse(anchor) : false;
      const ageDays = latestDate && !futureDated ? daysBetween(anchor, latestDate) : null;
      return {
        name: source.source!,
        latestDate,
        metrics: source.metrics ?? null,
        maxRisk: source.maxRisk ?? null,
        changedInWindow: latestDate ? !futureDated && Date.parse(latestDate) >= Date.parse(since) : false,
        stale: futureDated ? false : ageDays == null ? true : ageDays > 45,
        ageDays,
        dateStatus: latestDate ? (futureDated ? 'future-dated' : 'observed') : 'missing',
      };
    });

  return {
    newData: all.filter((source) => source.changedInWindow).slice(0, 12),
    stale: all.filter((source) => source.stale).slice(0, 12),
    futureDated: all.filter((source) => source.dateStatus === 'future-dated').slice(0, 12),
    coverage: {
      trackedSources: all.length,
      latestInWindow: all.filter((source) => source.changedInWindow).length,
      staleSources: all.filter((source) => source.stale).length,
      futureDatedSources: all.filter((source) => source.dateStatus === 'future-dated').length,
      staleRule: 'Une source Debt Risk est marquée stale si latestDate est absent ou plus ancien que 45 jours.',
      dateCaveat: 'Les dates postérieures à l’ancre du snapshot sont traitées comme horizons de projection, pas comme nouvelles observations.',
    },
  };
}

function articleChanges(posts: PostEntry[], guides: GuideEntry[], since: string) {
  return buildChangefeedSurface(sortPosts(posts), sortGuides(guides)).entries
    .filter((entry: any) => entry.date && Date.parse(entry.date) >= Date.parse(since))
    .slice(0, 24);
}

function isCorrectionReview(entry: any) {
  return /corrig|rectifi|correction|modifi|révis|revis|mise à jour/i.test(String(entry.note ?? ''));
}

function claimChanges(posts: PostEntry[], since: string) {
  const claimsSurface = buildClaimsSurface(sortPosts(posts));
  const added = claimsSurface.claims
    .filter((claim: any) => {
      const date = claim.observationDate ?? claim.claimDate ?? claim.date;
      return date && Date.parse(date) >= Date.parse(since);
    })
    .slice(0, 18);
  const reviewed = (claimsSurface.reviewRegistry?.entries ?? [])
    .filter((entry: any) => entry.reviewedAt && Date.parse(entry.reviewedAt) >= Date.parse(since))
    .slice(0, 18);
  const corrected = reviewed.filter(isCorrectionReview);

  return {
    added,
    corrected,
    reviewed,
    counts: {
      added: added.length,
      corrected: corrected.length,
      reviewedInWindow: reviewed.length,
      totalClaims: claimsSurface.counts.claims,
      totalReviewedClaims: claimsSurface.counts.reviewedClaims,
    },
  };
}

function modelChanges(guides: GuideEntry[], changes: any[]) {
  const methodologyUpdates = sortGuides(guides)
    .filter((guide) => /method|méthode|modele|modèle|risk|signal/i.test(`${guide.data.title} ${guide.data.description}`))
    .slice(0, 8)
    .map((guide) => ({
      slug: guide.id,
      title: guide.data.title,
      url: `${AGENT_SITE}/guides/${guide.id}/`,
      updated: iso(guide.data.updatedDate ?? guide.data.pubDate),
    }));

  return {
    modified: changes.filter((entry) => entry.contentType === 'policy' || entry.changedFields?.includes('methodology')).slice(0, 10),
    relatedMethodologies: methodologyUpdates,
    caveat:
      'Les diffs de modèle sont limités aux changements éditoriaux, guides et méthodologies exposés publiquement. Le diff ligne à ligne du code de calcul n’est pas encore publié dans Risk Diff.',
  };
}

function buildSignalMoves(window: WindowSpec, anchor: string) {
  const history = buildSignalHistorySurface();
  const since = addDays(anchor, -window.days);
  const grouped = new Map<string, SignalObservation[]>();
  for (const observation of history.observations) {
    const list = grouped.get(observation.instrument) ?? [];
    list.push(observation);
    grouped.set(observation.instrument, list);
  }

  const moves = [...grouped.entries()].map(([instrument, observations]) => {
    const current = latestObservation(observations);
    const baseline = baselineObservation(observations, since);
    const delta = current?.value != null && baseline?.value != null ? current.value - baseline.value : null;
    const tone = moveTone(delta);
    return {
      instrument,
      label: riskSignalMeta[instrument]?.label ?? instrument,
      source: riskSignalMeta[instrument]?.source ?? null,
      methodology: riskSignalMeta[instrument]?.methodology ?? null,
      current: current ? {
        observedAt: current.observedAt,
        value: current.value,
        level: current.level,
        tone: current.tone,
        snapshotHash: current.snapshotHash,
      } : null,
      baseline: baseline ? {
        observedAt: baseline.observedAt,
        value: baseline.value,
        level: baseline.level,
        tone: baseline.tone,
        snapshotHash: baseline.snapshotHash,
      } : null,
      delta,
      direction: tone,
      levelChanged: Boolean(current?.level && baseline?.level && current.level !== baseline.level),
      limitations: baseline ? [] : ['Pas de point historique antérieur ou égal au début de fenêtre.'],
    };
  });

  return {
    rising: moves.filter((move) => move.direction === 'up').sort((a, b) => (b.delta ?? 0) - (a.delta ?? 0)),
    falling: moves.filter((move) => move.direction === 'down').sort((a, b) => (a.delta ?? 0) - (b.delta ?? 0)),
    flat: moves.filter((move) => move.direction === 'flat'),
    missingBaseline: moves.filter((move) => move.direction === 'missing'),
    coverage: {
      instruments: moves.length,
      withBaseline: moves.filter((move) => move.baseline).length,
      historyFirstObservedAt: history.coverage.firstObservedAt,
      historyLastObservedAt: history.coverage.lastObservedAt,
    },
  };
}

export function buildRiskDiffSurface(posts: PostEntry[], guides: GuideEntry[], risk: RiskSnapshotInput | null) {
  const signalHistory = buildSignalHistorySurface();
  const anchor =
    signalHistory.coverage.lastObservedAt ??
    iso(risk?.updated) ??
    generatedAt();
  const freshness = buildFreshnessSurface(sortPosts(posts), sortGuides(guides), risk);

  const windows = WINDOW_SPECS.map((window) => {
    const since = addDays(anchor, -window.days);
    const signalMoves = buildSignalMoves(window, anchor);
    const sources = sourceFreshness(risk, since, anchor);
    const changes = articleChanges(posts, guides, since);
    const claims = claimChanges(posts, since);
    const models = modelChanges(guides, changes);
    const articles = changes
      .filter((entry: any) => entry.contentType === 'article')
      .map((entry: any) => ({
        slug: entry.slug,
        title: entry.title,
        url: entry.url,
        date: entry.date,
        type: entry.type,
        summary: entry.summary,
        changedFields: entry.changedFields,
      }))
      .slice(0, 12);
    const signalCoverage = signalMoves.coverage.instruments
      ? signalMoves.coverage.withBaseline / signalMoves.coverage.instruments
      : 0;
    const confidence = scoreConfidence({
      signalCoverage,
      freshSources: sources.coverage.latestInWindow,
      staleSources: sources.coverage.staleSources,
      reviewedClaims: claims.counts.reviewedInWindow,
      unreviewedClaims: claims.counts.added,
      explicitLimitations: signalMoves.missingBaseline.length + (models.modified.length ? 0 : 1),
    });

    return {
      window: window.key,
      label: window.label,
      since,
      until: anchor,
      signalMoves,
      sources,
      claims,
      models,
      articles,
      confidence: {
        ...confidence,
        basis: [
          `${signalMoves.coverage.withBaseline}/${signalMoves.coverage.instruments} signaux avec baseline`,
          `${sources.coverage.latestInWindow}/${sources.coverage.trackedSources} sources Debt Risk mises à jour dans la fenêtre`,
          `${claims.counts.reviewedInWindow} claims relues dans la fenêtre, ${claims.counts.corrected} correction(s) explicite(s)`,
        ],
      },
    };
  });

  return {
    schema: RISK_DIFF_SCHEMA,
    version: '1',
    generated: generatedAt(),
    anchorDate: anchor,
    question:
      'Qu’est-ce qui a changé dans le risque depuis hier, depuis 7 jours, depuis 30 jours ?',
    windows,
    inputs: {
      signals: `${AGENT_SITE}/api/v1/signals/history.json`,
      currentRisk: `${AGENT_SITE}/api/v1/risk.json`,
      debtRisk: `${AGENT_SITE}/api/v1/debt-risk.json`,
      claims: `${AGENT_SITE}/api/v1/claims.json`,
      changes: `${AGENT_SITE}/api/v1/changes.json`,
      freshness: `${AGENT_SITE}/api/v1/freshness.json`,
    },
    freshness: {
      signalFreshness: freshness.signalFreshness,
      policy: freshness.freshnessPolicy,
    },
    limitations: [
      'Risk Diff ne fabrique pas de diff de modèle quand aucun historique public de modèle n’existe.',
      'Les mouvements de signaux utilisent signals/history et ne comparent que les instruments disposant d’une baseline dans la fenêtre.',
      'Les sources devenues stale sont détectées à partir des dates publiées dans les snapshots publics, pas par refetch externe au build.',
      'Les dates de source postérieures à l’ancre du snapshot sont signalées comme horizons de projection et exclues des nouvelles données intégrées.',
      'Les claims ajoutées sont dérivées des dates de publication, observation ou révision exposées dans claims.json.',
    ],
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
  };
}
