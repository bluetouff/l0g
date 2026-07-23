import type { CollectionEntry } from 'astro:content';
import { createHash } from 'node:crypto';
import { claimReviewById, claimReviewRegistry } from '../config/claim-reviews.ts';
import { editorialChangelog, editorialProtocol } from '../config/editorial.ts';
import { glossaryEntries, glossarySections } from '../config/glossary.ts';
import { methodologyPages, riskBandScaleCaveat } from '../config/methodology.ts';
import { primaryInstitutions, primarySourcesUpdatedIso } from '../config/primary-sources.ts';
import { postMatchesTopic, topics } from '../config/topics.ts';
import { buildArticleEvidence } from './article-evidence.ts';
import {
  buildSignalHistoryCsv,
  buildSignalHistoryNdjsonRows,
  buildSignalHistorySurface,
  buildSignalSeriesSurface,
  buildSignalSchemaSurface,
  signalSeriesRegistry,
} from './signal-history.ts';
import { AGENT_VERSION, MCP_COMPACT_PUBLIC_PATH, MCP_PROTOCOL_VERSION, MCP_PUBLIC_PATH } from '../config/agent-contract.mjs';
import toolsetManifest from '../generated/toolset-manifest.json';

const API_SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'SAMEORIGIN',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=(), interest-cohort=()',
  'Cross-Origin-Opener-Policy': 'same-origin',
};

function secureApiHeaders(type: string) {
  return {
    'Content-Type': type,
    ...API_SECURITY_HEADERS,
  };
}

export const AGENT_SITE = 'https://l0g.fr';
export { AGENT_VERSION };
export const AGENT_GENERATED_AT = process.env.L0G_BUILD_TIMESTAMP || new Date().toISOString();
const OPENAPI_SCHEMA_BASE = `${AGENT_SITE}/openapi.json#/components/schemas`;
const SIGNAL_STALE_AFTER: Record<string, string> = {
  us: 'PT36H',
  eu: 'PT36H',
  yen: 'PT12H',
  energie: 'PT6H',
  debt: 'PT6H',
};
const CLAIM_KIND_ENUM = ['fait', 'estimation', 'inférence', 'scénario'];

const RISK_SIGNAL_META: Record<string, { label: string; source: string; methodology: string }> = {
  us: { label: 'US Macro Dashboard', source: 'https://us.l0g.fr', methodology: `${AGENT_SITE}/methodologie/us-macro/` },
  eu: { label: 'EU Macro Dashboard', source: 'https://euro.l0g.fr', methodology: `${AGENT_SITE}/methodologie/euro-macro/` },
  yen: { label: 'Yen Carry Monitor', source: 'https://yct.l0g.fr', methodology: `${AGENT_SITE}/methodologie/yen-carry/` },
  energie: { label: 'Energie Monitor', source: 'https://energie.l0g.fr', methodology: `${AGENT_SITE}/methodologie/energie/` },
  debt: { label: 'Debt Risk Radar', source: 'https://debt.l0g.fr', methodology: `${AGENT_SITE}/methodologie/debt-risk-radar/` },
};

type RiskSnapshotInput = {
  updated?: string | null;
  status?: string | null;
  indices?: Array<{
    key?: string;
    value?: number;
    rawValue?: number;
    scale?: number;
    level?: string;
    tone?: string;
    sourceStatus?: string;
    qualityStatus?: string;
    fallbackUsed?: boolean;
    fallbackReason?: string | null;
    sourceUpdatedAt?: string | null;
    sourcePublishedAt?: string | null;
    observedAt?: string | null;
    retrievedAt?: string | null;
    lastAttemptAt?: string | null;
    lastSuccessAt?: string | null;
    staleAfter?: string;
    timelinessStatus?: string;
    warnings?: string[];
    producerRepository?: string;
    producerRevision?: string | null;
    producerRevisionStatus?: string;
  }>;
  provenance?: Record<string, Record<string, unknown>>;
};

export type ContentLanguage = 'fr' | 'en';
export type PostEntry = CollectionEntry<'posts'> | CollectionEntry<'postsEn'>;
export type GuideEntry = CollectionEntry<'guides'> | CollectionEntry<'guidesEn'>;

export function contentLanguage(entry: PostEntry | GuideEntry): ContentLanguage {
  return entry.collection === 'postsEn' || entry.collection === 'guidesEn' ? 'en' : 'fr';
}

function canonicalId(entry: PostEntry | GuideEntry, contentType: 'article' | 'guide') {
  return `${contentType}:${sourceSlug(entry) ?? entry.id}`;
}

function sourceSlug(entry: PostEntry | GuideEntry): string | null {
  if (entry.collection === 'postsEn') return entry.data.sourceArticle;
  if (entry.collection === 'guidesEn') return entry.data.sourceGuide;
  return null;
}

function sourceContentId(entry: PostEntry | GuideEntry, contentType: 'article' | 'guide') {
  const slug = sourceSlug(entry);
  return slug ? `${contentType}:${slug}` : null;
}

function sourceContentUrl(entry: PostEntry | GuideEntry, contentType: 'article' | 'guide') {
  const slug = sourceSlug(entry);
  if (!slug) return null;
  return contentType === 'article' ? `${AGENT_SITE}/posts/${slug}/` : `${AGENT_SITE}/guides/${slug}/`;
}

function languageCounts(entries: Array<PostEntry | GuideEntry>) {
  return {
    fr: entries.filter((entry) => contentLanguage(entry) === 'fr').length,
    en: entries.filter((entry) => contentLanguage(entry) === 'en').length,
  };
}

type TranslationStatus = 'source' | 'current' | 'stale' | 'missing-source';

export function isTranslationStale(sourceVersion: Date, translatedSourceVersion: Date) {
  return sourceVersion.toISOString().slice(0, 10) > translatedSourceVersion.toISOString().slice(0, 10);
}

function translationStatus(entry: PostEntry | GuideEntry, source?: PostEntry | GuideEntry): TranslationStatus {
  if (contentLanguage(entry) === 'fr') return 'source';
  if (!source) return 'missing-source';
  const sourceVersion = source.data.updatedDate ?? source.data.pubDate;
  const translatedSourceVersion = entry.collection === 'postsEn' || entry.collection === 'guidesEn'
    ? entry.data.sourceUpdatedDate
    : sourceVersion;
  return isTranslationStale(sourceVersion, translatedSourceVersion) ? 'stale' : 'current';
}

export function jsonResponse(payload: unknown) {
  return new Response(JSON.stringify(payload, null, 2) + '\n', {
    headers: secureApiHeaders('application/json; charset=utf-8'),
  });
}

export function toNdjson(rows: unknown[]) {
  return rows.map((row) => JSON.stringify(row)).join('\n') + '\n';
}

export function ndjsonResponse(rows: unknown[]) {
  return new Response(toNdjson(rows), {
    headers: secureApiHeaders('application/x-ndjson; charset=utf-8'),
  });
}

export function textResponse(payload: string, type: string) {
  return new Response(payload, { headers: secureApiHeaders(type) });
}

export function generatedAt() {
  return AGENT_GENERATED_AT;
}

export function isoDate(value?: Date) {
  return value ? value.toISOString().slice(0, 10) : null;
}

function isoDateTimeOrNull(value?: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString();
}

function durationMilliseconds(value: string) {
  const days = value.match(/^P(\d+)D$/);
  if (days) return Number(days[1]) * 24 * 60 * 60 * 1000;
  const hours = value.match(/^PT(\d+)H$/);
  if (hours) return Number(hours[1]) * 60 * 60 * 1000;
  return null;
}

function addDurationIso(value: string, duration: string) {
  const date = new Date(value);
  const milliseconds = durationMilliseconds(duration);
  if (milliseconds == null) return null;
  date.setTime(date.getTime() + milliseconds);
  return date.toISOString();
}

function buildSignalFreshness(risk?: RiskSnapshotInput | null) {
  const computedAt = generatedAt();
  const indexed = new Map((risk?.indices ?? []).map((item) => [item.key, item]));

  return Object.entries(RISK_SIGNAL_META).map(([key, meta]) => {
    const item = indexed.get(key);
    const provenance = risk?.provenance?.[key] ?? {};
    const present = Boolean(item);
    const observedAt = isoDateTimeOrNull(String(item?.observedAt ?? provenance.observedAt ?? '') || null);
    const sourcePublishedAt = isoDateTimeOrNull(
      String(item?.sourcePublishedAt ?? item?.sourceUpdatedAt ?? provenance.sourcePublishedAt ?? provenance.generatedAt ?? '') || null,
    );
    const retrievedAt = isoDateTimeOrNull(
      String(item?.retrievedAt ?? provenance.retrievedAt ?? '') || null,
    );
    const lastAttemptAt = isoDateTimeOrNull(
      String(item?.lastAttemptAt ?? provenance.lastAttemptAt ?? '') || null,
    );
    const lastSuccessAt = isoDateTimeOrNull(
      String(item?.lastSuccessAt ?? provenance.lastSuccessAt ?? '') || null,
    );
    const staleAfter = item?.staleAfter || String(provenance.staleAfter ?? SIGNAL_STALE_AFTER[key] ?? 'P1D');
    // lastSuccessAt mesure la disponibilité de la collecte, pas l'âge de la
    // donnée économique. Sans date producteur/observation, rester unknown.
    const freshnessAnchor = sourcePublishedAt ?? observedAt;
    const expiresAt = freshnessAnchor ? addDurationIso(freshnessAnchor, staleAfter) : null;
    const timelinessStatus = expiresAt && Date.parse(computedAt) > Date.parse(expiresAt)
      ? 'stale'
      : freshnessAnchor
        ? 'fresh'
        : 'unknown';
    const sourceStatus = present
      ? item?.sourceStatus === 'fallback' || provenance.sourceStatus === 'fallback'
        ? 'fallback'
        : 'ok'
      : 'missing';
    const qualityStatus = String(item?.qualityStatus ?? provenance.qualityStatus ?? (present ? 'unknown' : 'missing'));
    const fallbackUsed = item?.fallbackUsed === true || provenance.fallbackUsed === true;
    const fallbackReason = item?.fallbackReason
      ? String(item.fallbackReason)
      : provenance.fallbackReason
        ? String(provenance.fallbackReason)
        : null;
    const coverage = {
      signalPresent: present,
      observedAt: Boolean(observedAt),
      sourcePublishedAt: Boolean(sourcePublishedAt),
      retrievedAt: Boolean(retrievedAt),
      lastAttemptAt: Boolean(lastAttemptAt),
      lastSuccessAt: Boolean(lastSuccessAt),
      computedAt: true,
      staleAfter: durationMilliseconds(staleAfter) !== null,
    };
    const missing = Object.entries(coverage)
      .filter(([, isCovered]) => !isCovered)
      .map(([field]) => field);

    return {
      key,
      label: meta.label,
      source: meta.source,
      methodology: meta.methodology,
      observedAt,
      sourcePublishedAt,
      retrievedAt,
      lastAttemptAt,
      lastSuccessAt,
      computedAt,
      staleAfter,
      expiresAt,
      timelinessStatus,
      sourceStatus,
      qualityStatus,
      fallbackUsed,
      fallbackReason,
      warnings: Array.isArray(item?.warnings) ? item.warnings.map(String).slice(0, 10) : [],
      coverageStatus: missing.length === 0 ? 'complete' : present ? 'partial' : 'missing',
      coverage,
      missing,
      note:
        'La fraîcheur est calculée par signal depuis la date du producteur ou, à défaut, son dernier succès. generated/updated de l’agrégat datent seulement l’assemblage.',
    };
  });
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`)
    .join(',')}}`;
}

function stripVolatileGenerated(value: unknown): unknown {
  if (value === null || typeof value !== 'object') return value;
  if (Array.isArray(value)) return value.map(stripVolatileGenerated);
  const out: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    if (key === 'generated') continue;
    out[key] = stripVolatileGenerated(item);
  }
  return out;
}

export function canonicalJson(value: unknown) {
  return stableStringify(stripVolatileGenerated(value));
}

export function sha256(value: string) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function shortRevisionId(parts: string[]) {
  return sha256(parts.join('|')).slice(0, 16);
}

function versionHash(value: unknown) {
  return sha256(stableStringify(value));
}

function changeObjectId(contentType: 'article' | 'guide' | 'policy', slug: string, language: ContentLanguage = 'fr') {
  if (contentType === 'policy' || language === 'fr') return `${contentType}:${slug}`;
  return `${contentType}:${language}:${slug}`;
}

function contentVersionHash(entry: PostEntry | GuideEntry, contentType: 'article' | 'guide') {
  const base = {
    contentType,
    language: contentLanguage(entry),
    slug: entry.id,
    title: entry.data.title,
    description: entry.data.description,
    pubDate: entry.data.pubDate.toISOString(),
    updatedDate: entry.data.updatedDate?.toISOString() ?? null,
    tags: entry.data.tags,
    body: entry.body ?? '',
  };

  if (contentType === 'article') {
    return versionHash({
      ...base,
      evidence: contentLanguage(entry) === 'fr'
        ? buildArticleEvidenceRecord(entry as PostEntry, { globalClaimIds: true })
        : null,
    });
  }

  return versionHash(base);
}

function editorialVersionHash(entry: (typeof editorialChangelog)[number]) {
  return versionHash({
    contentType: 'policy',
    date: entry.date,
    kind: entry.kind,
    title: entry.title,
    summary: entry.summary,
    links: entry.links,
  });
}

function semanticChangeFor(fields: string[], type: string) {
  if (type.endsWith('published')) return 'publication';
  if (fields.includes('protocol') || fields.includes('methodology') || fields.includes('source-policy')) return 'editorial-policy-change';
  if (fields.includes('evidence')) return 'evidence-update';
  if (fields.includes('sources')) return 'source-update';
  return 'content-revision';
}

function diffMetadata(input: {
  contentType: 'article' | 'guide' | 'policy';
  slug: string;
  language?: ContentLanguage;
  type: string;
  date: string;
  currentHash: string | null;
  changedFields: string[];
  previousVersion?: string | null;
  correctionReason?: string | null;
  diffStatus?: 'current-only' | 'previous-version-known-without-hash' | 'historical-version-without-hash' | 'full-diff';
}) {
  const objectId = changeObjectId(input.contentType, input.slug, input.language ?? 'fr');
  const previousVersion = input.previousVersion ?? null;

  return {
    objectId,
    previousVersion,
    currentVersion: input.date,
    previousHash: null,
    currentHash: input.currentHash,
    replaces: previousVersion ? { objectId, version: previousVersion, hash: null } : null,
    semanticChange: semanticChangeFor(input.changedFields, input.type),
    correctionReason: input.correctionReason ?? null,
    diffStatus: input.diffStatus ?? (previousVersion ? 'previous-version-known-without-hash' : 'current-only'),
  };
}

function graphSafeId(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96) || 'unknown';
}

function hostFromHref(href: string) {
  if (href.startsWith('/')) return 'l0g.fr';
  try {
    return new URL(href).hostname.replace(/^www\./, '');
  } catch {
    return 'unknown';
  }
}

function absoluteHref(href: string) {
  return href.startsWith('/') ? `${AGENT_SITE}${href}` : href;
}

function searchablePlainText(markdown: string) {
  return String(markdown || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<figure[\s\S]*?<\/figure>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[`*_>#]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const openApiEndpoint = (summary: string, description: string, schemaName: string) => ({
  get: {
    summary,
    description,
    operationId: schemaName.charAt(0).toLowerCase() + schemaName.slice(1),
    responses: {
      '200': {
        description: 'Réponse JSON statique générée au build.',
        content: {
          'application/json': {
            schema: { $ref: `#/components/schemas/${schemaName}` },
          },
        },
      },
    },
  },
});

const openApiNdjsonEndpoint = (summary: string, description: string) => ({
  get: {
    summary,
    description,
    responses: {
      '200': {
        description: 'Flux NDJSON statique généré au build, une ligne JSON par objet.',
        content: {
          'application/x-ndjson': {
            schema: { type: 'string' },
          },
        },
      },
    },
  },
});

export function buildOpenApiContract() {
  const signalSeriesSlugs = signalSeriesRegistry().map((series) => series.slug);
  const seriesParameter = {
    name: 'series',
    in: 'path',
    required: true,
    description: 'Slug stable de la série l0g.',
    schema: { type: 'string', enum: signalSeriesSlugs },
  };
  return {
    openapi: '3.1.0',
    info: {
      title: 'l0g.fr Agent Surface API',
      version: AGENT_VERSION,
      description:
        'Contrat public pour agents IA : manifeste, catalogue, graphe affirmation-source, evidence graph, NDJSON, registre de sources, fraîcheur, intégrité, changefeed, risque et corpus.',
      license: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
    },
    servers: [{ url: AGENT_SITE }],
    paths: {
      '/agents.json': openApiEndpoint('Manifeste agent', 'Découverte des capacités, endpoints, règles d’usage et politiques de preuve.', 'AgentManifest'),
      '/api/v1/catalog.json': openApiEndpoint('Catalogue complet', 'Articles, guides, méthodologies, glossaire, sources primaires et protocole éditorial.', 'Catalog'),
      '/api/v1/catalog.ndjson': openApiNdjsonEndpoint('Catalogue NDJSON', 'Catalogue en lignes NDJSON : articles, guides, méthodologies, glossaire, sources primaires et protocole.'),
      '/api/v1/search-index.json': openApiEndpoint('Index de recherche partagé', 'Index bilingue canonique consommé par Agent Surface, MCP serveur et WebMCP.', 'SearchIndexSurface'),
      '/api/v1/agent-bench.json': openApiEndpoint('l0g Agent Bench', 'Résultats déterministes FR/EN de recherche, preuve, parité, asOf, refus, fraîcheur et classification.', 'AgentBenchSurface'),
      '/api/v1/claims.json': openApiEndpoint('Graphe affirmation-source', 'Affirmations typées reliées à des références cliquables, datées quand détectable.', 'ClaimsSurface'),
      '/api/v1/claims.ndjson': openApiNdjsonEndpoint('Claims NDJSON', 'Claims en lignes NDJSON, une affirmation typée par ligne avec références.'),
      '/api/v1/evidence-graph.json': openApiEndpoint('Evidence graph', 'Graphe articles, claims, références, hôtes, institutions et datasets, exprimé en nœuds et arêtes.', 'EvidenceGraphSurface'),
      '/api/v1/evidence-graph.ndjson': openApiNdjsonEndpoint('Evidence graph NDJSON', 'Evidence graph en lignes NDJSON : nœuds puis arêtes, pour ingestion streaming.'),
      '/api/v1/sources.json': openApiEndpoint('Registre sources', 'Sources primaires institutionnelles, hôtes cités, règles de citation et limites.', 'SourcesSurface'),
      '/api/v1/freshness.json': openApiEndpoint('Fraîcheur', 'Derniers contenus, compteurs de corpus, endpoints et politique de fraîcheur.', 'FreshnessSurface'),
      '/api/v1/integrity.json': openApiEndpoint('Intégrité', 'Empreintes SHA-256 canoniques des surfaces Agent Surface pour vérification de snapshot.', 'IntegritySurface'),
      '/api/v1/toolset-manifest.json': openApiEndpoint('Manifeste des tools MCP', 'Versions sémantiques et empreintes anti-dérive des contrats MCP complet et compact.', 'ToolsetManifest'),
      '/api/v1/changes.json': openApiEndpoint('Changefeed', 'Flux machine des publications, révisions et politiques, avec version courante, hash, statut de diff et changement sémantique.', 'ChangefeedSurface'),
      '/api/v1/changes.ndjson': openApiNdjsonEndpoint('Changefeed NDJSON', 'Changefeed machine en lignes NDJSON, une publication ou révision par ligne.'),
      '/api/v1/risk-diff.json': openApiEndpoint('Risk Diff', 'Diff du risque : signaux, sources, claims, modèles, articles et confiance par fenêtre 1, 7 et 30 jours.', 'RiskDiffSurface'),
      '/api/v1/black-box.json': openApiEndpoint('Black Box Recorder', 'Frames point-in-time du risque : scores, sources, modèles, freshness, hashes, changements et replay par date.', 'BlackBoxSurface'),
      '/api/v1/risk.json': openApiEndpoint('Signaux de risque', 'Snapshots des dashboards de risque et caveats de normalisation.', 'RiskSnapshot'),
      '/api/v1/history.ndjson': openApiNdjsonEndpoint('Journal de risque opérationnel', 'Chaque assemblage serveur append-only : continuité fine, sans attestation CI individuelle. La surface canonique fusionnée est /api/v1/signals/history.json.'),
      '/api/v1/debt-risk.json': openApiEndpoint('Dette US', 'Snapshot canonique Dette US importé depuis Debt Risk Radar latest.json, avec stress courant hors CBO, couverture, provenance, buckets, sources et top signaux.', 'DebtRiskSnapshot'),
      '/api/v1/signals/current.json': openApiEndpoint('Signaux courants', 'Dernières observations point-in-time par instrument, dérivées de l’historique public.', 'SignalCurrentSurface'),
      '/api/v1/signals/history.json': openApiEndpoint('Historique fusionné des signaux', 'Observations quotidiennes du journal opérationnel, frames Black Box attestées, snapshot courant, evidenceTier, couverture et politique de backtest.', 'SignalHistorySurface'),
      '/api/v1/signals/history.ndjson': openApiNdjsonEndpoint('Historique des signaux NDJSON', 'Historique des signaux ligne à ligne : meta, observations puis événements de seuil.'),
      '/api/v1/signals/history.csv': {
        get: {
          summary: 'Historique des signaux CSV',
          description: 'Observations point-in-time à plat pour pandas, R, DuckDB ou tableur.',
          responses: { '200': { description: 'CSV statique généré au build.', content: { 'text/csv': { schema: { type: 'string' } } } } },
        },
      },
      '/api/v1/signals/{series}/history.json': {
        get: {
          summary: 'Série de signal dédiée en JSON',
          description: 'Identité citable, couverture, méthode versionnée, observations et alertes pour une seule série.',
          parameters: [seriesParameter],
          responses: {
            '200': {
              description: 'Série point-in-time nommée.',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/SignalSeriesSurface' } } },
            },
          },
        },
      },
      '/api/v1/signals/{series}/history.ndjson': {
        get: {
          summary: 'Série de signal dédiée en NDJSON',
          description: 'Meta, observations puis événements de seuil pour une seule série.',
          parameters: [seriesParameter],
          responses: {
            '200': {
              description: 'Flux NDJSON statique.',
              content: { 'application/x-ndjson': { schema: { type: 'string' } } },
            },
          },
        },
      },
      '/api/v1/signals/{series}/history.csv': {
        get: {
          summary: 'Série de signal dédiée en CSV',
          description: 'Observations datées d’une seule série pour pandas, R, DuckDB ou tableur.',
          parameters: [seriesParameter],
          responses: {
            '200': {
              description: 'CSV statique.',
              content: { 'text/csv': { schema: { type: 'string' } } },
            },
          },
        },
      },
      '/api/v1/signals/schema.json': openApiEndpoint('Schéma des signaux', 'Schéma JSON des lignes meta, observation et level-change.', 'SignalLineSchema'),
      '/llms.txt': {
        get: {
          summary: 'Carte concise agents',
          responses: { '200': { description: 'Texte brut.', content: { 'text/plain': { schema: { type: 'string' } } } } },
        },
      },
      '/llms-full.txt': {
        get: {
          summary: 'Corpus agents étendu',
          responses: { '200': { description: 'Texte brut.', content: { 'text/plain': { schema: { type: 'string' } } } } },
        },
      },
      '/llms-full-en.txt': {
        get: {
          summary: 'Complete English agent corpus',
          responses: { '200': { description: 'Plain text.', content: { 'text/plain': { schema: { type: 'string' } } } } },
        },
      },
    },
    components: {
      schemas: {
        EvidenceReference: {
          type: 'object',
          required: ['label', 'href', 'dateLabel', 'indexedAt'],
          additionalProperties: false,
          properties: {
            label: { type: 'string' },
            href: { type: 'string' },
            host: { type: ['string', 'null'] },
            kind: { type: ['string', 'null'] },
            date: { type: ['string', 'null'], format: 'date' },
            dateLabel: { type: 'string' },
            sourcePublicationDate: { type: ['string', 'null'], format: 'date' },
            sourcePublicationDateLabel: { type: ['string', 'null'] },
            retrievedAt: { type: ['string', 'null'], format: 'date-time' },
            indexedAt: { type: ['string', 'null'], format: 'date-time' },
          },
        },
        ClaimClassifier: {
          type: 'object',
          required: ['method', 'matchedRule', 'caveat'],
          additionalProperties: false,
          properties: {
            method: { const: 'lexical-heuristic-v2' },
            matchedRule: { enum: ['scenario-marker', 'estimate-marker', 'inference-marker', 'cited-fact-default'] },
            caveat: { type: 'string' },
            reviewedOverride: { type: 'string' },
          },
        },
        LanguageCounts: {
          type: 'object',
          required: ['fr', 'en'],
          additionalProperties: false,
          properties: {
            fr: { type: 'integer' },
            en: { type: 'integer' },
          },
        },
        Claim: {
          type: 'object',
          required: [
            'id',
            'canonicalId',
            'language',
            'articleSlug',
            'kind',
            'claim',
            'dateLabel',
            'claimDate',
            'claimDateLabel',
            'observationDate',
            'observationDateLabel',
            'temporalPrecision',
            'reviewStatus',
            'classifier',
            'references',
          ],
          additionalProperties: false,
          properties: {
            id: { type: 'string' },
            localId: { type: 'string' },
            canonicalId: { type: 'string' },
            language: { enum: ['fr', 'en'] },
            articleSlug: { type: 'string' },
            articleUrl: { type: 'string', format: 'uri' },
            articleTitle: { type: 'string' },
            kind: { enum: CLAIM_KIND_ENUM },
            claim: { type: 'string' },
            date: { type: ['string', 'null'], format: 'date' },
            dateLabel: { type: 'string' },
            claimDate: { type: ['string', 'null'], format: 'date' },
            claimDateLabel: { type: 'string' },
            observationDate: { type: ['string', 'null'], format: 'date' },
            observationDateLabel: { type: 'string' },
            observationStart: { type: ['string', 'null'], format: 'date' },
            observationEnd: { type: ['string', 'null'], format: 'date' },
            temporalPrecision: { enum: ['day', 'month', 'quarter', 'year', 'range', 'unknown'] },
            confidence: { enum: ['auto-backfill', 'structurée'] },
            reviewStatus: { enum: ['unreviewed', 'reviewed'] },
            reviewedAt: { type: ['string', 'null'], format: 'date-time' },
            reviewedBy: { type: ['string', 'null'] },
            reviewNote: { type: ['string', 'null'] },
            reviewedProofDepth: { anyOf: [{ enum: ['direct-proof', 'reproduction'] }, { type: 'null' }] },
            evidenceLocator: {
              anyOf: [
                {
                  type: 'object',
                  required: ['type', 'value'],
                  additionalProperties: false,
                  properties: {
                    type: { enum: ['page', 'paragraph', 'section', 'table', 'series', 'cell', 'form', 'accession', 'doi', 'calculation', 'other'] },
                    value: { type: 'string' },
                  },
                },
                { type: 'null' },
              ],
            },
            reviewSourceUrl: { type: ['string', 'null'], format: 'uri' },
            reviewSourceDate: { type: ['string', 'null'], format: 'date' },
            reviewSourceType: { anyOf: [{ enum: ['primary', 'secondary', 'issuer', 'dataset'] }, { type: 'null' }] },
            reproductionArtifact: { type: ['string', 'null'] },
            classifier: { $ref: '#/components/schemas/ClaimClassifier' },
            references: { type: 'array', items: { $ref: '#/components/schemas/EvidenceReference' } },
          },
        },
        ArticleEvidenceCounts: {
          type: 'object',
          required: ['externalLinks', 'internalLinks', 'primarySources', 'claimRelations'],
          additionalProperties: false,
          properties: {
            externalLinks: { type: 'integer' },
            internalLinks: { type: 'integer' },
            primarySources: { type: 'integer' },
            claimRelations: { type: 'integer' },
          },
        },
        EvidenceDepth: {
          type: 'object',
          required: ['id', 'label', 'detail', 'score', 'automated'],
          additionalProperties: false,
          properties: {
            id: { enum: ['mention', 'reference', 'linked-source', 'direct-proof', 'reproduction'] },
            label: { type: 'string' },
            detail: { type: 'string' },
            score: { type: 'integer', minimum: 1, maximum: 5 },
            automated: { type: 'boolean' },
          },
        },
        EvidenceBadge: {
          type: 'object',
          required: ['id', 'label', 'detail'],
          additionalProperties: false,
          properties: {
            id: { enum: ['primary-source', 'public-data', 'secondary-source', 'scenario', 'internal-context'] },
            label: { type: 'string' },
            detail: { type: 'string' },
          },
        },
        PrimarySourceMention: {
          type: 'object',
          required: ['slug', 'name', 'url', 'reason'],
          additionalProperties: false,
          properties: {
            slug: { type: 'string' },
            name: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            reason: { enum: ['source-liée'] },
          },
        },
        ArticleEvidenceSummary: {
          type: 'object',
          required: ['claims', 'depth', 'badges', 'primarySources', 'counts'],
          additionalProperties: false,
          properties: {
            claims: { type: 'array', items: { $ref: '#/components/schemas/Claim' } },
            depth: { $ref: '#/components/schemas/EvidenceDepth' },
            badges: { type: 'array', items: { $ref: '#/components/schemas/EvidenceBadge' } },
            primarySources: { type: 'array', items: { $ref: '#/components/schemas/PrimarySourceMention' } },
            counts: { $ref: '#/components/schemas/ArticleEvidenceCounts' },
          },
        },
        ArticleRevisionPolicy: {
          type: 'object',
          required: ['published', 'updated', 'policy', 'changelog'],
          additionalProperties: false,
          properties: {
            published: { type: ['string', 'null'], format: 'date' },
            updated: { type: ['string', 'null'], format: 'date' },
            policy: { type: 'string', format: 'uri' },
            changelog: { type: 'string', format: 'uri' },
          },
        },
        CanonicalEvidenceRef: {
          type: 'object',
          required: ['language', 'articleSlug', 'claimsUrl', 'evidenceGraphUrl'],
          additionalProperties: false,
          properties: {
            language: { const: 'fr' },
            articleSlug: { type: 'string' },
            claimsUrl: { type: 'string', format: 'uri' },
            evidenceGraphUrl: { type: 'string', format: 'uri' },
          },
        },
        ContentSummary: {
          type: 'object',
          required: ['canonicalId', 'language', 'translationOf', 'alternateUrl', 'translationStatus', 'slug', 'url', 'title', 'date', 'description'],
          additionalProperties: false,
          properties: {
            canonicalId: { type: 'string' },
            language: { enum: ['fr', 'en'] },
            translationOf: { type: ['string', 'null'] },
            alternateUrl: { type: ['string', 'null'], format: 'uri' },
            translationStatus: { enum: ['source', 'current', 'stale', 'missing-source'] },
            slug: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            title: { type: 'string' },
            date: { type: 'string', format: 'date' },
            updated: { type: ['string', 'null'], format: 'date' },
            description: { type: 'string' },
            summary: { type: ['string', 'null'] },
            tags: { type: 'array', items: { type: 'string' } },
            topics: { type: 'array', items: { type: 'string' } },
            evidence: { $ref: '#/components/schemas/ArticleEvidenceSummary' },
            evidenceRef: { anyOf: [{ $ref: '#/components/schemas/CanonicalEvidenceRef' }, { type: 'null' }] },
            revisions: { $ref: '#/components/schemas/ArticleRevisionPolicy' },
          },
        },
        GlossaryAtlasLink: {
          type: 'object',
          required: ['label', 'href'],
          additionalProperties: false,
          properties: {
            label: { type: 'string' },
            href: { type: 'string', format: 'uri' },
            detail: { type: 'string' },
            kind: { type: 'string', enum: ['article', 'guide', 'dataset', 'signal', 'source', 'methodology'] },
          },
        },
        GlossaryAtlas: {
          type: 'object',
          required: ['intuition', 'formula', 'whyNow', 'related', 'articles', 'guides', 'datasets', 'signals', 'sources'],
          additionalProperties: false,
          properties: {
            intuition: { type: ['string', 'null'] },
            formula: { type: ['string', 'null'] },
            whyNow: { type: ['string', 'null'] },
            related: { type: 'array', items: { type: 'string' } },
            articles: { type: 'array', items: { $ref: '#/components/schemas/GlossaryAtlasLink' } },
            guides: { type: 'array', items: { $ref: '#/components/schemas/GlossaryAtlasLink' } },
            datasets: { type: 'array', items: { $ref: '#/components/schemas/GlossaryAtlasLink' } },
            signals: { type: 'array', items: { $ref: '#/components/schemas/GlossaryAtlasLink' } },
            sources: { type: 'array', items: { $ref: '#/components/schemas/GlossaryAtlasLink' } },
          },
        },
        GlossaryEntry: {
          type: 'object',
          required: ['slug', 'url', 'name', 'definition', 'category', 'atlas'],
          additionalProperties: false,
          properties: {
            slug: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            sigle: { type: ['string', 'null'] },
            name: { type: 'string' },
            definition: { type: 'string' },
            category: { type: 'string' },
            guide: { type: ['string', 'null'] },
            atlas: { anyOf: [{ $ref: '#/components/schemas/GlossaryAtlas' }, { type: 'null' }] },
          },
        },
        Topic: {
          type: 'object',
          required: ['slug', 'label', 'blurb'],
          additionalProperties: false,
          properties: {
            slug: { type: 'string' },
            label: { type: 'string' },
            blurb: { type: 'string' },
          },
        },
        Dataset: {
          type: 'object',
          required: ['name', 'role', 'url'],
          additionalProperties: false,
          properties: {
            name: { type: 'string' },
            role: { type: 'string' },
            cadence: { type: 'string' },
            delay: { type: 'string' },
            url: { type: 'string', format: 'uri' },
          },
        },
        RiskBandScaleCaveat: {
          type: 'object',
          required: ['title', 'summary', 'correctLabel', 'wrongLabel', 'details'],
          additionalProperties: false,
          properties: {
            title: { type: 'string' },
            summary: { type: 'string' },
            correctLabel: { type: 'string' },
            wrongLabel: { type: 'string' },
            details: { type: 'array', items: { type: 'string' } },
          },
        },
        MethodologySource: {
          type: 'object',
          required: ['name', 'role', 'url'],
          additionalProperties: false,
          properties: {
            name: { type: 'string' },
            role: { type: 'string' },
            cadence: { type: 'string' },
            delay: { type: 'string' },
            url: { type: 'string', format: 'uri' },
          },
        },
        PrimarySource: {
          type: 'object',
          required: ['slug', 'url', 'name', 'category', 'officialUrl', 'description'],
          additionalProperties: false,
          properties: {
            slug: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            name: { type: 'string' },
            shortName: { type: 'string' },
            category: { type: 'string' },
            officialUrl: { type: 'string', format: 'uri' },
            description: { type: 'string' },
            datasets: { type: 'array', items: { $ref: '#/components/schemas/Dataset' } },
            limits: { type: 'array', items: { type: 'string' } },
            verification: { type: 'array', items: { type: 'string' } },
          },
        },
        MethodologySummary: {
          type: 'object',
          required: ['slug', 'url', 'title', 'label', 'description', 'question', 'updated'],
          additionalProperties: false,
          properties: {
            slug: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            title: { type: 'string' },
            label: { type: 'string' },
            description: { type: 'string' },
            question: { type: 'string' },
            dashboard: { type: ['string', 'null'], format: 'uri' },
            repo: { type: ['string', 'null'], format: 'uri' },
            updated: { type: 'string' },
            scaleCaveat: { anyOf: [{ $ref: '#/components/schemas/RiskBandScaleCaveat' }, { type: 'null' }] },
            sources: { type: 'array', items: { $ref: '#/components/schemas/MethodologySource' } },
          },
        },
        ProofDepthLevel: {
          type: 'object',
          required: ['id', 'label', 'meaning', 'status'],
          additionalProperties: false,
          properties: {
            id: { enum: ['mention', 'reference', 'linked-source', 'direct-proof', 'reproduction'] },
            label: { type: 'string' },
            meaning: { type: 'string' },
            status: { enum: ['automatique', 'semi-structuré', 'objectif'] },
          },
        },
        EditorialPrecisionGuard: {
          type: 'object',
          required: ['title', 'summary', 'requirements', 'warning'],
          additionalProperties: false,
          properties: {
            title: { type: 'string' },
            summary: { type: 'string' },
            requirements: { type: 'array', items: { type: 'string' } },
            warning: { type: 'string' },
          },
        },
        AgentCounts: {
          type: 'object',
          required: ['articles', 'articlesByLanguage', 'guides', 'guidesByLanguage', 'methodologies', 'glossary', 'primarySources'],
          additionalProperties: false,
          properties: {
            articles: { type: 'integer' },
            articlesByLanguage: { $ref: '#/components/schemas/LanguageCounts' },
            guides: { type: 'integer' },
            guidesByLanguage: { $ref: '#/components/schemas/LanguageCounts' },
            methodologies: { type: 'integer' },
            glossary: { type: 'integer' },
            primarySources: { type: 'integer' },
          },
        },
        AgentProofPolicy: {
          type: 'object',
          required: ['claimKinds', 'depthScale', 'precisionGuard', 'correctionPolicy', 'changelog', 'riskBandScaleCaveat'],
          additionalProperties: false,
          properties: {
            claimKinds: { type: 'array', items: { enum: CLAIM_KIND_ENUM } },
            depthScale: { type: 'array', items: { $ref: '#/components/schemas/ProofDepthLevel' } },
            precisionGuard: { $ref: '#/components/schemas/EditorialPrecisionGuard' },
            correctionPolicy: { type: 'string', format: 'uri' },
            changelog: { type: 'string', format: 'uri' },
            riskBandScaleCaveat: { $ref: '#/components/schemas/RiskBandScaleCaveat' },
          },
        },
        AgentEndpointMap: {
          type: 'object',
          required: [
            'openapi',
            'catalog',
            'catalogNdjson',
            'searchIndex',
            'agentBench',
            'claims',
            'claimsNdjson',
            'evidenceGraph',
            'evidenceGraphNdjson',
            'sources',
            'freshness',
            'integrity',
            'toolsetManifest',
            'changes',
            'changesNdjson',
            'riskDiff',
            'blackBox',
            'risk',
            'debtRisk',
            'signalCurrent',
            'signalHistory',
            'signalHistoryNdjson',
            'signalHistoryCsv',
            'signalSeriesRegistry',
            'signalSchema',
            'llms',
            'llmsFull',
            'llmsFullEn',
            'mcpEndpoint',
            'mcpCompactEndpoint',
            'mcpDocumentation',
            'docs',
            'agentBenchDocumentation',
          ],
          additionalProperties: false,
          properties: Object.fromEntries([
            'openapi',
            'catalog',
            'catalogNdjson',
            'searchIndex',
            'agentBench',
            'claims',
            'claimsNdjson',
            'evidenceGraph',
            'evidenceGraphNdjson',
            'sources',
            'freshness',
            'integrity',
            'toolsetManifest',
            'changes',
            'changesNdjson',
            'riskDiff',
            'blackBox',
            'risk',
            'debtRisk',
            'signalCurrent',
            'signalHistory',
            'signalHistoryNdjson',
            'signalHistoryCsv',
            'signalSeriesRegistry',
            'signalSchema',
            'llms',
            'llmsFull',
            'llmsFullEn',
            'mcpEndpoint',
            'mcpCompactEndpoint',
            'mcpDocumentation',
            'docs',
            'agentBenchDocumentation',
          ].map((key) => [key, { type: 'string', format: 'uri' }])),
        },
        AgentManifest: {
          type: 'object',
          required: [
            'schema',
            'version',
            'generated',
            'name',
            'url',
            'description',
            'license',
            'attribution',
            'language',
            'languages',
            'defaultLanguage',
            'capabilities',
            'endpoints',
            'preferredUse',
            'prohibitedUse',
            'counts',
            'proofPolicy',
          ],
          additionalProperties: false,
          properties: {
            schema: { type: 'string', format: 'uri' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            name: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            description: { type: 'string' },
            license: { type: 'string' },
            attribution: { type: 'string' },
            language: { type: 'string' },
            languages: { type: 'array', minItems: 2, uniqueItems: true, items: { enum: ['fr', 'en'] } },
            defaultLanguage: { enum: ['fr', 'en'] },
            capabilities: { type: 'array', items: { type: 'string' } },
            endpoints: { $ref: '#/components/schemas/AgentEndpointMap' },
            preferredUse: { type: 'array', items: { type: 'string' } },
            prohibitedUse: { type: 'array', items: { type: 'string' } },
            counts: { $ref: '#/components/schemas/AgentCounts' },
            proofPolicy: { $ref: '#/components/schemas/AgentProofPolicy' },
          },
        },
        CatalogCounts: {
          type: 'object',
          required: ['articles', 'articlesByLanguage', 'guides', 'guidesByLanguage', 'topics', 'methodologies', 'glossary', 'primarySources', 'editorialChangelog'],
          additionalProperties: false,
          properties: {
            articles: { type: 'integer' },
            articlesByLanguage: { $ref: '#/components/schemas/LanguageCounts' },
            guides: { type: 'integer' },
            guidesByLanguage: { $ref: '#/components/schemas/LanguageCounts' },
            topics: { type: 'integer' },
            methodologies: { type: 'integer' },
            glossary: { type: 'integer' },
            primarySources: { type: 'integer' },
            editorialChangelog: { type: 'integer' },
          },
        },
        GlossaryCategory: {
          type: 'object',
          required: ['slug', 'title', 'count'],
          additionalProperties: false,
          properties: {
            slug: { type: 'string' },
            title: { type: 'string' },
            count: { type: 'integer' },
          },
        },
        EditorialLink: {
          type: 'object',
          required: ['label', 'href'],
          additionalProperties: false,
          properties: {
            label: { type: 'string' },
            href: { type: 'string' },
          },
        },
        EditorialPrinciple: {
          type: 'object',
          required: ['id', 'title', 'text'],
          additionalProperties: false,
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            text: { type: 'string' },
          },
        },
        EditorialStep: {
          type: 'object',
          required: ['id', 'title', 'checks'],
          additionalProperties: false,
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            checks: { type: 'array', items: { type: 'string' } },
          },
        },
        EditorialEvidenceLevel: {
          type: 'object',
          required: ['label', 'rank', 'description'],
          additionalProperties: false,
          properties: {
            label: { type: 'string' },
            rank: { type: 'string' },
            description: { type: 'string' },
          },
        },
        EditorialCorrectionType: {
          type: 'object',
          required: ['label', 'description'],
          additionalProperties: false,
          properties: {
            label: { type: 'string' },
            description: { type: 'string' },
          },
        },
        EditorialCorrectionPolicy: {
          type: 'object',
          required: ['title', 'summary', 'correctionTypes', 'revisionRules'],
          additionalProperties: false,
          properties: {
            title: { type: 'string' },
            summary: { type: 'string' },
            correctionTypes: { type: 'array', items: { $ref: '#/components/schemas/EditorialCorrectionType' } },
            revisionRules: { type: 'array', items: { type: 'string' } },
          },
        },
        EditorialProtocol: {
          type: 'object',
          required: [
            'url',
            'updated',
            'promise',
            'principles',
            'steps',
            'evidenceLevels',
            'proofDepthLevels',
            'precisionGuard',
            'correctionPolicy',
          ],
          additionalProperties: false,
          properties: {
            url: { type: 'string', format: 'uri' },
            updated: { type: 'string', format: 'date' },
            promise: { type: 'string' },
            principles: { type: 'array', items: { $ref: '#/components/schemas/EditorialPrinciple' } },
            steps: { type: 'array', items: { $ref: '#/components/schemas/EditorialStep' } },
            evidenceLevels: { type: 'array', items: { $ref: '#/components/schemas/EditorialEvidenceLevel' } },
            proofDepthLevels: { type: 'array', items: { $ref: '#/components/schemas/ProofDepthLevel' } },
            precisionGuard: { $ref: '#/components/schemas/EditorialPrecisionGuard' },
            correctionPolicy: { $ref: '#/components/schemas/EditorialCorrectionPolicy' },
          },
        },
        EditorialChangelogItem: {
          type: 'object',
          required: ['date', 'title', 'kind', 'summary', 'links', 'url'],
          additionalProperties: false,
          properties: {
            date: { type: 'string', format: 'date' },
            title: { type: 'string' },
            kind: { enum: ['protocole', 'traçabilité', 'sources', 'données', 'sécurité', 'méthode'] },
            summary: { type: 'string' },
            links: { type: 'array', items: { $ref: '#/components/schemas/EditorialLink' } },
            url: { type: 'string', format: 'uri' },
          },
        },
        CatalogEditorial: {
          type: 'object',
          required: ['protocol', 'changelog'],
          additionalProperties: false,
          properties: {
            protocol: { $ref: '#/components/schemas/EditorialProtocol' },
            changelog: { type: 'array', items: { $ref: '#/components/schemas/EditorialChangelogItem' } },
          },
        },
        Catalog: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'counts', 'articles', 'guides', 'topics', 'methodologies', 'glossary', 'primarySources'],
          additionalProperties: false,
          properties: {
            schema: { type: 'string', format: 'uri' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            note: { type: 'string' },
            license: { type: 'string' },
            attribution: { type: 'string' },
            counts: { $ref: '#/components/schemas/CatalogCounts' },
            articles: { type: 'array', items: { $ref: '#/components/schemas/ContentSummary' } },
            guides: { type: 'array', items: { $ref: '#/components/schemas/ContentSummary' } },
            topics: { type: 'array', items: { $ref: '#/components/schemas/Topic' } },
            methodologies: { type: 'array', items: { $ref: '#/components/schemas/MethodologySummary' } },
            glossary: { type: 'array', items: { $ref: '#/components/schemas/GlossaryEntry' } },
            glossaryCategories: { type: 'array', items: { $ref: '#/components/schemas/GlossaryCategory' } },
            primarySources: { type: 'array', items: { $ref: '#/components/schemas/PrimarySource' } },
            editorial: { $ref: '#/components/schemas/CatalogEditorial' },
            riskBandScaleCaveat: { $ref: '#/components/schemas/RiskBandScaleCaveat' },
          },
        },
        SearchIndexDocument: {
          type: 'object',
          required: ['canonicalId', 'language', 'translationOf', 'alternateUrl', 'translationStatus', 'type', 'slug', 'url', 'title', 'date', 'updated', 'description', 'tags', 'topics', 'text'],
          additionalProperties: false,
          properties: {
            canonicalId: { type: 'string' },
            language: { enum: ['fr', 'en'] },
            translationOf: { type: ['string', 'null'] },
            alternateUrl: { type: ['string', 'null'], format: 'uri' },
            translationStatus: { enum: ['source', 'current', 'stale', 'missing-source'] },
            type: { enum: ['article', 'guide', 'glossary', 'methodology', 'source'] },
            slug: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            title: { type: 'string' },
            date: { type: ['string', 'null'], format: 'date' },
            updated: { type: ['string', 'null'] },
            description: { type: 'string' },
            summary: { type: ['string', 'null'] },
            tags: { type: 'array', items: { type: 'string' } },
            topics: { type: 'array', items: { type: 'string' } },
            text: { type: 'string' },
          },
        },
        SearchIndexCounts: {
          type: 'object',
          required: ['documents', 'byLanguage', 'byType'],
          additionalProperties: false,
          properties: {
            documents: { type: 'integer' },
            byLanguage: { $ref: '#/components/schemas/LanguageCounts' },
            byType: {
              type: 'object',
              required: ['article', 'guide', 'glossary', 'methodology', 'source'],
              additionalProperties: false,
              properties: Object.fromEntries(['article', 'guide', 'glossary', 'methodology', 'source'].map((type) => [type, { type: 'integer' }])),
            },
          },
        },
        SearchIndexSurface: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'counts', 'policy', 'documents', 'license', 'attribution'],
          additionalProperties: false,
          properties: {
            schema: { type: 'string', format: 'uri' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            counts: { $ref: '#/components/schemas/SearchIndexCounts' },
            policy: {
              type: 'object',
              required: ['source', 'ranking', 'caveat'],
              additionalProperties: false,
              properties: {
                source: { type: 'string' },
                ranking: { type: 'string' },
                caveat: { type: 'string' },
              },
            },
            documents: { type: 'array', items: { $ref: '#/components/schemas/SearchIndexDocument' } },
            license: { type: 'string' },
            attribution: { type: 'string' },
          },
        },
        AgentBenchSurface: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'surfaces', 'methodology', 'results'],
          properties: {
            schema: { type: 'string', format: 'uri' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            status: { type: 'string' },
            benchmarkHash: { type: 'string' },
            surfaces: { type: 'object' },
            methodology: { type: 'object' },
            summary: { anyOf: [{ type: 'object' }, { type: 'null' }] },
            results: { type: 'array', items: { type: 'object' } },
            note: { type: 'string' },
          },
        },
        ClaimsSurface: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'counts', 'policy', 'reviewRegistry', 'claims', 'references'],
          additionalProperties: false,
          properties: {
            schema: { type: 'string' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            counts: { $ref: '#/components/schemas/ClaimsCounts' },
            policy: { $ref: '#/components/schemas/ClaimsPolicy' },
            reviewRegistry: { $ref: '#/components/schemas/ClaimReviewRegistry' },
            claims: { type: 'array', items: { $ref: '#/components/schemas/Claim' } },
            references: { type: 'array', items: { $ref: '#/components/schemas/ClaimReference' } },
            license: { type: 'string' },
            attribution: { type: 'string' },
          },
        },
        ClaimsCounts: {
          type: 'object',
          required: ['articles', 'articlesByLanguage', 'claims', 'reviewedClaims', 'references', 'claimKinds'],
          additionalProperties: false,
          properties: {
            articles: { type: 'integer' },
            articlesByLanguage: { $ref: '#/components/schemas/LanguageCounts' },
            claims: { type: 'integer' },
            reviewedClaims: { type: 'integer' },
            references: { type: 'integer' },
            claimKinds: { type: 'array', items: { enum: CLAIM_KIND_ENUM } },
          },
        },
        ClaimReviewRegistry: {
          type: 'object',
          required: ['version', 'updated', 'policy', 'reviewedClaims', 'legacyReviews', 'signalClaims', 'entries'],
          additionalProperties: false,
          properties: {
            version: { type: 'string' },
            updated: { type: 'string', format: 'date' },
            policy: { type: 'string' },
            reviewedClaims: { type: 'integer' },
            legacyReviews: { type: 'integer' },
            signalClaims: {
              type: 'object',
              required: ['declared', 'canonicallyReviewed', 'coverage', 'usages'],
              additionalProperties: false,
              properties: {
                declared: { type: 'integer' },
                canonicallyReviewed: { type: 'integer' },
                coverage: { type: 'number', minimum: 0, maximum: 1 },
                usages: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: ['signal', 'claimId', 'role'],
                    additionalProperties: false,
                    properties: {
                      signal: { enum: ['us', 'eu', 'yen', 'energie', 'debt'] },
                      claimId: { type: 'string' },
                      role: { enum: ['input', 'threshold', 'interpretation'] },
                    },
                  },
                },
              },
            },
            entries: {
              type: 'array',
              items: {
                type: 'object',
                required: ['status', 'claimId', 'reviewedAt', 'reviewedBy', 'note'],
                additionalProperties: false,
                properties: {
                  status: { enum: ['legacy', 'canonical'] },
                  claimId: { type: 'string' },
                  reviewedAt: { type: 'string', format: 'date-time' },
                  reviewedBy: { type: 'string' },
                  kind: { enum: CLAIM_KIND_ENUM },
                  note: { type: 'string' },
                  proofDepth: { enum: ['direct-proof', 'reproduction'] },
                  evidenceLocator: {
                    type: 'object',
                    required: ['type', 'value'],
                    additionalProperties: false,
                    properties: {
                      type: { enum: ['page', 'paragraph', 'section', 'table', 'series', 'cell', 'form', 'accession', 'doi', 'calculation', 'other'] },
                      value: { type: 'string' },
                    },
                  },
                  sourceUrl: { type: 'string', format: 'uri' },
                  sourceDate: { type: 'string', format: 'date' },
                  sourceType: { enum: ['primary', 'secondary', 'issuer', 'dataset'] },
                  reproductionArtifact: { type: 'string' },
                },
              },
            },
          },
        },
        ClaimsPolicy: {
          type: 'object',
          required: ['relation', 'caveat', 'selection', 'maxClaimsPerArticle', 'classification', 'review', 'dateModel', 'correctionPolicy'],
          additionalProperties: false,
          properties: {
            relation: { type: 'string' },
            caveat: { type: 'string' },
            selection: { type: 'string' },
            maxClaimsPerArticle: { type: 'integer', const: 3 },
            classification: { type: 'string' },
            review: { type: 'string' },
            dateModel: { type: 'string' },
            correctionPolicy: { type: 'string', format: 'uri' },
          },
        },
        ClaimReference: {
          type: 'object',
          required: [
            'claimId',
            'canonicalId',
            'language',
            'articleSlug',
            'label',
            'href',
            'host',
            'kind',
            'date',
            'dateLabel',
            'claimDate',
            'observationDate',
            'observationStart',
            'observationEnd',
            'temporalPrecision',
            'sourcePublicationDate',
            'retrievedAt',
            'indexedAt',
          ],
          additionalProperties: false,
          properties: {
            claimId: { type: 'string' },
            canonicalId: { type: 'string' },
            language: { enum: ['fr', 'en'] },
            articleSlug: { type: 'string' },
            label: { type: 'string' },
            href: { type: 'string' },
            host: { type: ['string', 'null'] },
            kind: { type: ['string', 'null'] },
            date: { type: ['string', 'null'], format: 'date' },
            dateLabel: { type: 'string' },
            claimDate: { type: ['string', 'null'], format: 'date' },
            observationDate: { type: ['string', 'null'], format: 'date' },
            observationStart: { type: ['string', 'null'], format: 'date' },
            observationEnd: { type: ['string', 'null'], format: 'date' },
            temporalPrecision: { enum: ['day', 'month', 'quarter', 'year', 'range', 'unknown'] },
            sourcePublicationDate: { type: ['string', 'null'], format: 'date' },
            retrievedAt: { type: ['string', 'null'], format: 'date-time' },
            indexedAt: { type: ['string', 'null'], format: 'date-time' },
          },
        },
        SourcesSurface: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'registry', 'counts', 'sourcePolicy', 'primarySources', 'referenceHosts'],
          additionalProperties: false,
          properties: {
            schema: { type: 'string', format: 'uri' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            registry: { $ref: '#/components/schemas/PrimarySourceRegistry' },
            counts: {
              type: 'object',
              required: ['primarySources', 'referenceHosts', 'references'],
              additionalProperties: false,
              properties: {
                primarySources: { type: 'integer' },
                referenceHosts: { type: 'integer' },
                references: { type: 'integer' },
              },
            },
            sourcePolicy: {
              type: 'object',
              required: ['preferred', 'fallback', 'citationRule'],
              additionalProperties: false,
              properties: {
                preferred: { type: 'string' },
                fallback: { type: 'string' },
                citationRule: { type: 'string' },
              },
            },
            primarySources: { type: 'array', items: { $ref: '#/components/schemas/PrimarySource' } },
            referenceHosts: { type: 'array', items: { $ref: '#/components/schemas/ReferenceHost' } },
            license: { type: 'string' },
            attribution: { type: 'string' },
          },
        },
        PrimarySourceRegistry: {
          type: 'object',
          required: ['version', 'updated', 'scope', 'testPolicy', 'caveat'],
          additionalProperties: false,
          properties: {
            version: { type: 'string' },
            updated: { type: 'string', format: 'date' },
            scope: { type: 'string' },
            testPolicy: { type: 'string' },
            caveat: { type: 'string' },
          },
        },
        ReferenceHost: {
          type: 'object',
          required: ['host', 'references', 'articles', 'kinds'],
          additionalProperties: false,
          properties: {
            host: { type: 'string' },
            references: { type: 'integer' },
            articles: { type: 'integer' },
            kinds: { type: 'array', items: { type: 'string' } },
          },
        },
        EvidenceGraphNode: {
          type: 'object',
          required: ['id', 'type', 'label'],
          additionalProperties: false,
          properties: {
            id: { type: 'string' },
            type: { enum: ['article', 'claim', 'reference', 'host', 'primarySource', 'dataset'] },
            label: { type: 'string' },
            url: { type: ['string', 'null'] },
            meta: { $ref: '#/components/schemas/EvidenceGraphNodeMeta' },
          },
        },
        EvidenceGraphEdge: {
          type: 'object',
          required: ['id', 'from', 'to', 'type'],
          additionalProperties: false,
          properties: {
            id: { type: 'string' },
            from: { type: 'string' },
            to: { type: 'string' },
            type: { enum: ['contains', 'cites', 'hostedBy', 'matchesPrimarySource', 'providesDataset'] },
            meta: { $ref: '#/components/schemas/EvidenceGraphEdgeMeta' },
          },
        },
        EvidenceGraphNodeMeta: {
          type: 'object',
          additionalProperties: false,
          properties: {
            slug: { type: 'string' },
            canonicalId: { type: 'string' },
            language: { enum: ['fr', 'en'] },
            localId: { type: 'string' },
            articleSlug: { type: 'string' },
            kind: {
              enum: [
                'fait',
                'estimation',
                'inférence',
                'scénario',
                'source primaire',
                'source secondaire',
                'contexte',
                'dashboard',
                'publication interne',
              ],
            },
            date: { type: ['string', 'null'], format: 'date' },
            dateLabel: { type: 'string' },
            claimDate: { type: ['string', 'null'], format: 'date' },
            observationDate: { type: ['string', 'null'], format: 'date' },
            observationStart: { type: ['string', 'null'], format: 'date' },
            observationEnd: { type: ['string', 'null'], format: 'date' },
            temporalPrecision: { enum: ['day', 'month', 'quarter', 'year', 'range', 'unknown'] },
            sourcePublicationDate: { type: ['string', 'null'], format: 'date' },
            retrievedAt: { type: ['string', 'null'], format: 'date-time' },
            indexedAt: { type: ['string', 'null'], format: 'date-time' },
            confidence: { enum: ['auto-backfill', 'structurée'] },
            reviewStatus: { enum: ['unreviewed', 'reviewed'] },
            href: { type: 'string' },
            host: { type: 'string' },
            sourceSlug: { type: 'string' },
            role: { type: 'string' },
            cadence: { type: 'string' },
            delay: { type: 'string' },
            name: { type: 'string' },
            category: { type: 'string' },
            officialUrl: { type: 'string', format: 'uri' },
          },
        },
        EvidenceGraphEdgeMeta: {
          type: 'object',
          additionalProperties: false,
          properties: {
            kind: {
              anyOf: [
                {
                  enum: [
                    'fait',
                    'estimation',
                    'inférence',
                    'scénario',
                    'source primaire',
                    'source secondaire',
                    'contexte',
                    'dashboard',
                    'publication interne',
                  ],
                },
                { type: 'null' },
              ],
            },
            dateLabel: { type: 'string' },
            cadence: { type: 'string' },
            source: { type: 'string' },
          },
        },
        EvidenceGraphSurface: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'counts', 'nodes', 'edges'],
          additionalProperties: false,
          properties: {
            schema: { type: 'string' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            counts: { $ref: '#/components/schemas/EvidenceGraphCounts' },
            graphPolicy: { $ref: '#/components/schemas/EvidenceGraphPolicy' },
            nodes: { type: 'array', items: { $ref: '#/components/schemas/EvidenceGraphNode' } },
            edges: { type: 'array', items: { $ref: '#/components/schemas/EvidenceGraphEdge' } },
            license: { type: 'string' },
            attribution: { type: 'string' },
          },
        },
        EvidenceGraphCounts: {
          type: 'object',
          required: ['nodes', 'edges', 'articles', 'claims', 'references', 'hosts', 'primarySources', 'datasets'],
          additionalProperties: false,
          properties: {
            nodes: { type: 'integer' },
            edges: { type: 'integer' },
            articles: { type: 'integer' },
            claims: { type: 'integer' },
            references: { type: 'integer' },
            hosts: { type: 'integer' },
            primarySources: { type: 'integer' },
            datasets: { type: 'integer' },
          },
        },
        EvidenceGraphPolicy: {
          type: 'object',
          required: ['relation', 'traversal', 'caveat', 'correctionPolicy'],
          additionalProperties: false,
          properties: {
            relation: { type: 'string' },
            traversal: { type: 'string' },
            caveat: { type: 'string' },
            correctionPolicy: { type: 'string', format: 'uri' },
          },
        },
        FreshnessSurface: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'latest', 'corpus', 'endpoints', 'signalFreshness', 'freshnessPolicy', 'license', 'attribution'],
          additionalProperties: false,
          properties: {
            schema: { type: 'string', format: 'uri' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            latest: { type: 'array', items: { $ref: '#/components/schemas/FreshnessItem' } },
            corpus: { $ref: '#/components/schemas/FreshnessCorpus' },
            endpoints: { type: 'array', items: { $ref: '#/components/schemas/FreshnessEndpoint' } },
            signalFreshness: { type: 'array', items: { $ref: '#/components/schemas/SignalFreshness' } },
            freshnessPolicy: {
              type: 'object',
              required: ['rule', 'caveat', 'correctionPolicy', 'changelog'],
              additionalProperties: false,
              properties: {
                rule: { type: 'string' },
                caveat: { type: 'string' },
                correctionPolicy: { type: 'string', format: 'uri' },
                changelog: { type: 'string', format: 'uri' },
              },
            },
            license: { type: 'string' },
            attribution: { type: 'string' },
          },
        },
        FreshnessCorpus: {
          type: 'object',
          required: ['articles', 'articlesByLanguage', 'guides', 'guidesByLanguage', 'methodologies', 'glossary', 'primarySources', 'editorialChangelog'],
          additionalProperties: false,
          properties: {
            articles: { type: 'integer' },
            articlesByLanguage: { $ref: '#/components/schemas/LanguageCounts' },
            guides: { type: 'integer' },
            guidesByLanguage: { $ref: '#/components/schemas/LanguageCounts' },
            methodologies: { type: 'integer' },
            glossary: { type: 'integer' },
            primarySources: { type: 'integer' },
            editorialChangelog: { type: 'integer' },
          },
        },
        SignalFreshnessCoverage: {
          type: 'object',
          required: ['signalPresent', 'observedAt', 'sourcePublishedAt', 'retrievedAt', 'lastAttemptAt', 'lastSuccessAt', 'computedAt', 'staleAfter'],
          additionalProperties: false,
          properties: {
            signalPresent: { type: 'boolean' },
            observedAt: { type: 'boolean' },
            sourcePublishedAt: { type: 'boolean' },
            retrievedAt: { type: 'boolean' },
            lastAttemptAt: { type: 'boolean' },
            lastSuccessAt: { type: 'boolean' },
            computedAt: { type: 'boolean' },
            staleAfter: { type: 'boolean' },
          },
        },
        SignalFreshness: {
          type: 'object',
          required: [
            'key',
            'label',
            'source',
            'methodology',
            'observedAt',
            'sourcePublishedAt',
            'retrievedAt',
            'lastAttemptAt',
            'lastSuccessAt',
            'computedAt',
            'staleAfter',
            'expiresAt',
            'timelinessStatus',
            'sourceStatus',
            'qualityStatus',
            'fallbackUsed',
            'fallbackReason',
            'warnings',
            'coverageStatus',
            'coverage',
            'missing',
            'note',
          ],
          additionalProperties: false,
          properties: {
            key: { enum: ['us', 'eu', 'yen', 'energie', 'debt'] },
            label: { type: 'string' },
            source: { type: 'string', format: 'uri' },
            methodology: { type: 'string', format: 'uri' },
            observedAt: { type: ['string', 'null'], format: 'date-time' },
            sourcePublishedAt: { type: ['string', 'null'], format: 'date-time' },
            retrievedAt: { type: ['string', 'null'], format: 'date-time' },
            lastAttemptAt: { type: ['string', 'null'], format: 'date-time' },
            lastSuccessAt: { type: ['string', 'null'], format: 'date-time' },
            computedAt: { type: 'string', format: 'date-time' },
            staleAfter: { type: 'string', pattern: '^P(?:\\d+D|T\\d+H)$' },
            expiresAt: { type: ['string', 'null'], format: 'date-time' },
            timelinessStatus: { enum: ['fresh', 'stale', 'unknown'] },
            sourceStatus: { enum: ['ok', 'fallback', 'missing'] },
            qualityStatus: { enum: ['nominal', 'degraded', 'official-delayed', 'unknown', 'missing'] },
            fallbackUsed: { type: 'boolean' },
            fallbackReason: { type: ['string', 'null'] },
            warnings: { type: 'array', items: { type: 'string' } },
            coverageStatus: { enum: ['complete', 'partial', 'missing'] },
            coverage: { $ref: '#/components/schemas/SignalFreshnessCoverage' },
            missing: {
              type: 'array',
              items: { enum: ['signalPresent', 'observedAt', 'sourcePublishedAt', 'retrievedAt', 'lastAttemptAt', 'lastSuccessAt', 'computedAt', 'staleAfter'] },
            },
            note: { type: 'string' },
          },
        },
        FreshnessItem: {
          type: 'object',
          required: ['type', 'canonicalId', 'language', 'slug', 'title', 'url', 'date'],
          additionalProperties: false,
          properties: {
            type: { enum: ['article', 'guide'] },
            canonicalId: { type: 'string' },
            language: { enum: ['fr', 'en'] },
            slug: { type: 'string' },
            title: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            date: { type: 'string', format: 'date' },
          },
        },
        FreshnessEndpoint: {
          type: 'object',
          required: ['path', 'role', 'update'],
          additionalProperties: false,
          properties: {
            path: { type: 'string' },
            role: { type: 'string' },
            update: { type: 'string' },
          },
        },
        IntegritySurface: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'algorithm', 'canonicalization', 'counts', 'snapshots', 'verification', 'externalAuthenticity'],
          additionalProperties: false,
          properties: {
            schema: { type: 'string' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            algorithm: { const: 'sha-256' },
            canonicalization: { $ref: '#/components/schemas/IntegrityCanonicalization' },
            counts: { $ref: '#/components/schemas/IntegrityCounts' },
            verification: { $ref: '#/components/schemas/IntegrityVerification' },
            externalAuthenticity: { $ref: '#/components/schemas/ExternalAuthenticityPolicy' },
            license: { type: 'string' },
            attribution: { type: 'string' },
            snapshots: {
              type: 'array',
              items: {
                type: 'object',
                required: ['path', 'url', 'canonicalSha256'],
                additionalProperties: false,
                properties: {
                  path: { type: 'string' },
                  url: { type: 'string', format: 'uri' },
                  role: { type: 'string' },
                  mediaType: { type: 'string' },
                  canonicalSha256: { type: 'string', pattern: '^[a-f0-9]{64}$' },
                  canonicalBytes: { type: 'integer' },
                },
              },
            },
          },
        },
        ToolsetManifest: {
          type: 'object',
          required: ['serverVersion', 'protocolVersion', 'toolsetHash', 'tools', 'surfaces'],
          additionalProperties: false,
          properties: {
            serverVersion: { type: 'string' },
            protocolVersion: { const: MCP_PROTOCOL_VERSION },
            toolsetHash: { type: 'string', pattern: '^[a-f0-9]{64}$' },
            tools: { type: 'array', items: { $ref: '#/components/schemas/ToolContractFingerprint' } },
            surfaces: { type: 'object', additionalProperties: { $ref: '#/components/schemas/ToolsetSurface' } },
          },
        },
        ToolContractFingerprint: {
          type: 'object',
          required: ['name', 'semanticVersion', 'descriptionHash', 'inputSchemaHash', 'outputSchemaHash', 'changeType'],
          additionalProperties: false,
          properties: {
            name: { type: 'string' },
            semanticVersion: { type: 'string' },
            descriptionHash: { type: 'string', pattern: '^[a-f0-9]{64}$' },
            inputSchemaHash: { type: 'string', pattern: '^[a-f0-9]{64}$' },
            outputSchemaHash: { type: 'string', pattern: '^[a-f0-9]{64}$' },
            changeType: { enum: ['initial', 'non-breaking', 'breaking'] },
          },
        },
        ToolsetSurface: {
          type: 'object',
          required: ['path', 'toolsetHash', 'tools', 'toolCount', 'toolsListBytes'],
          additionalProperties: false,
          properties: {
            path: { type: 'string' },
            toolsetHash: { type: 'string', pattern: '^[a-f0-9]{64}$' },
            tools: { type: 'array', items: { type: 'string' } },
            toolCount: { type: 'integer' },
            toolsListBytes: { type: 'integer' },
          },
        },
        IntegrityCounts: {
          type: 'object',
          required: ['snapshots', 'articles', 'guides'],
          additionalProperties: false,
          properties: {
            snapshots: { type: 'integer' },
            articles: { type: 'integer' },
            guides: { type: 'integer' },
          },
        },
        IntegrityCanonicalization: {
          type: 'object',
          required: ['format', 'ndjson', 'omittedFields', 'reason'],
          additionalProperties: false,
          properties: {
            format: { type: 'string' },
            ndjson: { type: 'string' },
            omittedFields: { type: 'array', items: { type: 'string' } },
            reason: { type: 'string' },
          },
        },
        IntegrityVerification: {
          type: 'object',
          required: ['rule', 'caveat'],
          additionalProperties: false,
          properties: {
            rule: { type: 'string' },
            caveat: { type: 'string' },
          },
        },
        ExternalAuthenticityPolicy: {
          type: 'object',
          required: ['status', 'mechanism', 'subjects', 'currentGuarantee', 'missingGuarantee', 'verification', 'recommendedNextSteps'],
          additionalProperties: false,
          properties: {
            status: { enum: ['github-sigstore-attestation-configured'] },
            mechanism: { type: 'string' },
            subjects: { type: 'array', items: { type: 'string' } },
            currentGuarantee: { type: 'string' },
            missingGuarantee: { type: 'string' },
            verification: { type: 'string' },
            recommendedNextSteps: { type: 'array', items: { type: 'string' } },
          },
        },
        ChangefeedSurface: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'counts', 'entries'],
          additionalProperties: false,
          properties: {
            schema: { type: 'string' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            counts: { $ref: '#/components/schemas/ChangefeedCounts' },
            feedPolicy: { $ref: '#/components/schemas/ChangefeedPolicy' },
            entries: {
              type: 'array',
              items: { $ref: '#/components/schemas/ChangefeedEntry' },
            },
            license: { type: 'string' },
            attribution: { type: 'string' },
          },
        },
        ChangefeedCounts: {
          type: 'object',
          required: ['entries', 'articles', 'articlesByLanguage', 'guides', 'guidesByLanguage', 'editorialChanges'],
          additionalProperties: false,
          properties: {
            entries: { type: 'integer' },
            articles: { type: 'integer' },
            articlesByLanguage: { $ref: '#/components/schemas/LanguageCounts' },
            guides: { type: 'integer' },
            guidesByLanguage: { $ref: '#/components/schemas/LanguageCounts' },
            editorialChanges: { type: 'integer' },
          },
        },
        ChangefeedPolicy: {
          type: 'object',
          required: ['scope', 'diffModel', 'caveat', 'correctionPolicy', 'changelog'],
          additionalProperties: false,
          properties: {
            scope: { type: 'string' },
            diffModel: { type: 'string' },
            caveat: { type: 'string' },
            correctionPolicy: { type: 'string', format: 'uri' },
            changelog: { type: 'string', format: 'uri' },
          },
        },
        ChangefeedReplacement: {
          type: 'object',
          required: ['objectId', 'version', 'hash'],
          additionalProperties: false,
          properties: {
            objectId: { type: 'string' },
            version: { type: 'string', format: 'date-time' },
            hash: { type: ['string', 'null'], pattern: '^[a-f0-9]{64}$' },
          },
        },
        ChangefeedEntry: {
          type: 'object',
          required: [
            'id',
            'objectId',
            'date',
            'type',
            'contentType',
            'language',
            'slug',
            'title',
            'url',
            'changedFields',
            'summary',
            'previousVersion',
            'currentVersion',
            'previousHash',
            'currentHash',
            'replaces',
            'semanticChange',
            'correctionReason',
            'diffStatus',
          ],
          additionalProperties: false,
          properties: {
            id: { type: 'string' },
            objectId: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            type: { enum: ['article-published', 'article-revised', 'guide-published', 'guide-revised', 'editorial-change'] },
            contentType: { enum: ['article', 'guide', 'policy'] },
            language: { enum: ['fr', 'en'] },
            slug: { type: 'string' },
            title: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            changedFields: { type: 'array', items: { type: 'string' } },
            summary: { type: 'string' },
            previousVersion: { type: ['string', 'null'], format: 'date-time' },
            currentVersion: { type: 'string', format: 'date-time' },
            previousHash: { type: ['string', 'null'], pattern: '^[a-f0-9]{64}$' },
            currentHash: { type: ['string', 'null'], pattern: '^[a-f0-9]{64}$' },
            replaces: { anyOf: [{ $ref: '#/components/schemas/ChangefeedReplacement' }, { type: 'null' }] },
            semanticChange: { enum: ['publication', 'content-revision', 'source-update', 'evidence-update', 'editorial-policy-change'] },
            correctionReason: { type: ['string', 'null'] },
            diffStatus: { enum: ['current-only', 'previous-version-known-without-hash', 'historical-version-without-hash', 'full-diff'] },
          },
        },
        RiskDiffSurface: {
          type: 'object',
          required: [
            'schema',
            'version',
            'generated',
            'anchorDate',
            'question',
            'windows',
            'inputs',
            'freshness',
            'limitations',
            'license',
            'attribution',
          ],
          additionalProperties: false,
          properties: {
            schema: { type: 'string', format: 'uri' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            anchorDate: { type: 'string', format: 'date-time' },
            question: { type: 'string' },
            windows: { type: 'array', items: { $ref: '#/components/schemas/RiskDiffWindow' } },
            inputs: { $ref: '#/components/schemas/RiskDiffInputs' },
            freshness: { $ref: '#/components/schemas/RiskDiffFreshness' },
            limitations: { type: 'array', items: { type: 'string' } },
            license: { type: 'string' },
            attribution: { type: 'string' },
          },
        },
        RiskDiffInputs: {
          type: 'object',
          required: ['signals', 'currentRisk', 'debtRisk', 'claims', 'changes', 'freshness'],
          additionalProperties: false,
          properties: {
            signals: { type: 'string', format: 'uri' },
            currentRisk: { type: 'string', format: 'uri' },
            debtRisk: { type: 'string', format: 'uri' },
            claims: { type: 'string', format: 'uri' },
            changes: { type: 'string', format: 'uri' },
            freshness: { type: 'string', format: 'uri' },
          },
        },
        RiskDiffFreshness: {
          type: 'object',
          required: ['signalFreshness', 'policy'],
          additionalProperties: false,
          properties: {
            signalFreshness: { type: 'array', items: { $ref: '#/components/schemas/SignalFreshness' } },
            policy: {
              type: 'object',
              required: ['rule', 'caveat', 'correctionPolicy', 'changelog'],
              additionalProperties: false,
              properties: {
                rule: { type: 'string' },
                caveat: { type: 'string' },
                correctionPolicy: { type: 'string', format: 'uri' },
                changelog: { type: 'string', format: 'uri' },
              },
            },
          },
        },
        RiskDiffWindow: {
          type: 'object',
          required: ['window', 'label', 'since', 'until', 'signalMoves', 'sources', 'claims', 'models', 'articles', 'confidence'],
          additionalProperties: false,
          properties: {
            window: { enum: ['1d', '7d', '30d'] },
            label: { type: 'string' },
            since: { type: 'string', format: 'date-time' },
            until: { type: 'string', format: 'date-time' },
            signalMoves: { $ref: '#/components/schemas/RiskDiffSignalMoves' },
            sources: { $ref: '#/components/schemas/RiskDiffSources' },
            claims: { $ref: '#/components/schemas/RiskDiffClaims' },
            models: { $ref: '#/components/schemas/RiskDiffModels' },
            articles: { type: 'array', items: { $ref: '#/components/schemas/RiskDiffArticle' } },
            confidence: { $ref: '#/components/schemas/RiskDiffConfidence' },
          },
        },
        RiskDiffSignalMoves: {
          type: 'object',
          required: ['rising', 'falling', 'flat', 'missingBaseline', 'coverage'],
          additionalProperties: false,
          properties: {
            rising: { type: 'array', items: { $ref: '#/components/schemas/RiskDiffSignalMove' } },
            falling: { type: 'array', items: { $ref: '#/components/schemas/RiskDiffSignalMove' } },
            flat: { type: 'array', items: { $ref: '#/components/schemas/RiskDiffSignalMove' } },
            missingBaseline: { type: 'array', items: { $ref: '#/components/schemas/RiskDiffSignalMove' } },
            coverage: { $ref: '#/components/schemas/RiskDiffSignalCoverage' },
          },
        },
        RiskDiffSignalMove: {
          type: 'object',
          required: ['instrument', 'label', 'source', 'methodology', 'current', 'baseline', 'delta', 'direction', 'levelChanged', 'limitations'],
          additionalProperties: false,
          properties: {
            instrument: { enum: ['us', 'eu', 'yen', 'energie', 'debt'] },
            label: { type: 'string' },
            source: { type: ['string', 'null'], format: 'uri' },
            methodology: { type: ['string', 'null'], format: 'uri' },
            current: { anyOf: [{ $ref: '#/components/schemas/RiskDiffSignalPoint' }, { type: 'null' }] },
            baseline: { anyOf: [{ $ref: '#/components/schemas/RiskDiffSignalPoint' }, { type: 'null' }] },
            delta: { type: ['number', 'null'] },
            direction: { enum: ['up', 'down', 'flat', 'missing'] },
            levelChanged: { type: 'boolean' },
            limitations: { type: 'array', items: { type: 'string' } },
          },
        },
        RiskDiffSignalPoint: {
          type: 'object',
          required: ['seriesDate', 'observedAt', 'value', 'level', 'tone', 'snapshotHash'],
          additionalProperties: false,
          properties: {
            seriesDate: { type: 'string', format: 'date-time' },
            observedAt: { type: ['string', 'null'], format: 'date-time' },
            value: { type: ['number', 'null'] },
            level: { type: ['string', 'null'] },
            tone: { type: ['string', 'null'] },
            snapshotHash: { type: 'string', pattern: '^[a-f0-9]{64}$' },
          },
        },
        RiskDiffSignalCoverage: {
          type: 'object',
          required: ['instruments', 'withBaseline', 'historyFirstSeriesDate', 'historyLastSeriesDate', 'historyFirstObservedAt', 'historyLastObservedAt'],
          additionalProperties: false,
          properties: {
            instruments: { type: 'integer' },
            withBaseline: { type: 'integer' },
            historyFirstSeriesDate: { type: ['string', 'null'], format: 'date-time' },
            historyLastSeriesDate: { type: ['string', 'null'], format: 'date-time' },
            historyFirstObservedAt: { type: ['string', 'null'], format: 'date-time' },
            historyLastObservedAt: { type: ['string', 'null'], format: 'date-time' },
          },
        },
        RiskDiffSources: {
          type: 'object',
          required: ['newData', 'stale', 'futureDated', 'coverage'],
          additionalProperties: false,
          properties: {
            newData: { type: 'array', items: { $ref: '#/components/schemas/RiskDiffSource' } },
            stale: { type: 'array', items: { $ref: '#/components/schemas/RiskDiffSource' } },
            futureDated: { type: 'array', items: { $ref: '#/components/schemas/RiskDiffSource' } },
            coverage: { $ref: '#/components/schemas/RiskDiffSourceCoverage' },
          },
        },
        RiskDiffSource: {
          type: 'object',
          required: ['name', 'latestDate', 'metrics', 'maxRisk', 'changedInWindow', 'stale', 'ageDays', 'dateStatus'],
          additionalProperties: false,
          properties: {
            name: { type: 'string' },
            latestDate: { type: ['string', 'null'], format: 'date-time' },
            metrics: { type: ['integer', 'null'] },
            maxRisk: { type: ['number', 'null'] },
            changedInWindow: { type: 'boolean' },
            stale: { type: 'boolean' },
            ageDays: { type: ['integer', 'null'] },
            dateStatus: { enum: ['observed', 'future-dated', 'missing'] },
          },
        },
        RiskDiffSourceCoverage: {
          type: 'object',
          required: ['trackedSources', 'latestInWindow', 'staleSources', 'futureDatedSources', 'staleRule', 'dateCaveat'],
          additionalProperties: false,
          properties: {
            trackedSources: { type: 'integer' },
            latestInWindow: { type: 'integer' },
            staleSources: { type: 'integer' },
            futureDatedSources: { type: 'integer' },
            staleRule: { type: 'string' },
            dateCaveat: { type: 'string' },
          },
        },
        RiskDiffClaims: {
          type: 'object',
          required: ['added', 'corrected', 'reviewed', 'counts'],
          additionalProperties: false,
          properties: {
            added: { type: 'array', items: { $ref: '#/components/schemas/Claim' } },
            corrected: { type: 'array', items: { $ref: '#/components/schemas/RiskDiffClaimReview' } },
            reviewed: { type: 'array', items: { $ref: '#/components/schemas/RiskDiffClaimReview' } },
            counts: { $ref: '#/components/schemas/RiskDiffClaimCounts' },
          },
        },
        RiskDiffClaimReview: {
          type: 'object',
          required: ['claimId', 'reviewedAt', 'reviewedBy', 'note'],
          additionalProperties: false,
          properties: {
            claimId: { type: 'string' },
            reviewedAt: { type: 'string', format: 'date-time' },
            reviewedBy: { type: 'string' },
            kind: { enum: CLAIM_KIND_ENUM },
            note: { type: 'string' },
            proofDepth: { enum: ['direct-proof', 'reproduction'] },
            evidenceLocator: {
              type: 'object',
              required: ['type', 'value'],
              additionalProperties: false,
              properties: {
                type: { enum: ['page', 'section', 'table', 'series', 'cell', 'form', 'calculation', 'other'] },
                value: { type: 'string' },
              },
            },
            reproductionArtifact: { type: 'string' },
          },
        },
        RiskDiffClaimCounts: {
          type: 'object',
          required: ['added', 'corrected', 'reviewedInWindow', 'totalClaims', 'totalReviewedClaims'],
          additionalProperties: false,
          properties: {
            added: { type: 'integer' },
            corrected: { type: 'integer' },
            reviewedInWindow: { type: 'integer' },
            totalClaims: { type: 'integer' },
            totalReviewedClaims: { type: 'integer' },
          },
        },
        RiskDiffModels: {
          type: 'object',
          required: ['modified', 'relatedMethodologies', 'caveat'],
          additionalProperties: false,
          properties: {
            modified: { type: 'array', items: { $ref: '#/components/schemas/ChangefeedEntry' } },
            relatedMethodologies: { type: 'array', items: { $ref: '#/components/schemas/RiskDiffMethodology' } },
            caveat: { type: 'string' },
          },
        },
        RiskDiffMethodology: {
          type: 'object',
          required: ['slug', 'title', 'url', 'updated'],
          additionalProperties: false,
          properties: {
            slug: { type: 'string' },
            title: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            updated: { type: ['string', 'null'], format: 'date-time' },
          },
        },
        RiskDiffArticle: {
          type: 'object',
          required: ['slug', 'title', 'url', 'date', 'type', 'summary', 'changedFields'],
          additionalProperties: false,
          properties: {
            slug: { type: 'string' },
            title: { type: 'string' },
            url: { type: 'string', format: 'uri' },
            date: { type: 'string', format: 'date-time' },
            type: { enum: ['article-published', 'article-revised', 'guide-published', 'guide-revised', 'editorial-change'] },
            summary: { type: 'string' },
            changedFields: { type: 'array', items: { type: 'string' } },
          },
        },
        RiskDiffConfidence: {
          type: 'object',
          required: ['score', 'label', 'basis'],
          additionalProperties: false,
          properties: {
            score: { type: 'integer', minimum: 0, maximum: 100 },
            label: { enum: ['haut', 'moyen', 'limité'] },
            basis: { type: 'array', items: { type: 'string' } },
          },
        },
        BlackBoxSurface: {
          type: 'object',
          required: [
            'schema',
            'version',
            'generated',
            'title',
            'question',
            'coverage',
            'replay',
            'archive',
            'inputs',
            'frames',
            'policy',
            'license',
            'attribution',
          ],
          additionalProperties: false,
          properties: {
            schema: { type: 'string', format: 'uri' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            title: { type: 'string' },
            question: { type: 'string' },
            coverage: { $ref: '#/components/schemas/BlackBoxCoverage' },
            replay: { $ref: '#/components/schemas/BlackBoxReplayPolicy' },
            archive: { $ref: '#/components/schemas/BlackBoxArchivePolicy' },
            inputs: { $ref: '#/components/schemas/BlackBoxInputs' },
            frames: { type: 'array', items: { $ref: '#/components/schemas/BlackBoxFrame' } },
            policy: { $ref: '#/components/schemas/BlackBoxPolicy' },
            license: { type: 'string' },
            attribution: { type: 'string' },
          },
        },
        BlackBoxCoverage: {
          type: 'object',
          required: ['frames', 'firstFrameDate', 'lastFrameDate', 'instruments', 'pointInTime', 'archiveAvailable'],
          additionalProperties: false,
          properties: {
            frames: { type: 'integer' },
            firstFrameDate: { type: ['string', 'null'], format: 'date' },
            lastFrameDate: { type: ['string', 'null'], format: 'date' },
            instruments: { type: 'array', items: { type: 'string' } },
            pointInTime: { const: true },
            archiveAvailable: { type: 'boolean' },
          },
        },
        BlackBoxReplayPolicy: {
          type: 'object',
          required: ['acceptedDateFormat', 'rule', 'archiveStartDate', 'example'],
          additionalProperties: false,
          properties: {
            acceptedDateFormat: { const: 'YYYY-MM-DD' },
            rule: { type: 'string' },
            archiveStartDate: { type: ['string', 'null'], format: 'date' },
            example: {
              type: 'object',
              required: ['requestedDate', 'result'],
              additionalProperties: false,
              properties: {
                requestedDate: { type: 'string', format: 'date' },
                result: { type: 'string' },
              },
            },
          },
        },
        BlackBoxInputs: {
          type: 'object',
          required: ['signals', 'freshness', 'changes', 'risk', 'debtRisk'],
          additionalProperties: false,
          properties: {
            signals: { type: 'string', format: 'uri' },
            freshness: { type: 'string', format: 'uri' },
            changes: { type: 'string', format: 'uri' },
            risk: { type: 'string', format: 'uri' },
            debtRisk: { type: 'string', format: 'uri' },
          },
        },
        BlackBoxFrame: {
          type: 'object',
          required: [
            'schemaVersion',
            'frameId',
            'date', 'observedAt', 'retrievedAt', 'computedAt', 'gitSha',
            'previousFrameHash',
            'attestation',
            'contemporaryHashes',
            'signals',
            'freshness',
            'changes',
            'limitations',
            'frameHash',
          ],
          additionalProperties: false,
          properties: {
            schemaVersion: { const: '2' },
            frameId: { type: 'string' },
            date: { type: 'string', format: 'date' },
            observedAt: { type: ['string', 'null'], format: 'date-time' },
            retrievedAt: { type: ['string', 'null'], format: 'date-time' },
            computedAt: { type: 'string', format: 'date-time' },
            gitSha: { type: 'string', pattern: '^[a-fA-F0-9]{7,64}$' },
            previousFrameHash: { type: ['string', 'null'], pattern: '^[a-f0-9]{64}$' },
            attestation: { $ref: '#/components/schemas/BlackBoxAttestation' },
            contemporaryHashes: { type: 'array', minItems: 1, items: { $ref: '#/components/schemas/BlackBoxContemporaryHash' } },
            signals: { type: 'array', items: { type: 'object' } },
            freshness: { type: 'object' },
            changes: { type: 'object' },
            limitations: { type: 'array', items: { type: 'string' } },
            frameHash: { type: 'string', pattern: '^[a-f0-9]{64}$' },
          },
        },
        BlackBoxArchivePolicy: {
          type: 'object',
          required: ['branch', 'layout', 'appendOnly', 'hashAlgorithm', 'validation'],
          additionalProperties: false,
          properties: {
            branch: { const: 'black-box-archive' },
            layout: { const: 'frames/*.json' },
            appendOnly: { const: true },
            hashAlgorithm: { const: 'sha-256' },
            validation: { type: 'string' },
          },
        },
        BlackBoxAttestation: {
          type: 'object',
          required: ['provider', 'reference', 'subjects'],
          additionalProperties: false,
          properties: {
            provider: { enum: ['github-sigstore', 'none'] },
            reference: { type: 'string' },
            subjects: { type: 'array', items: { type: 'string' } },
          },
        },
        BlackBoxContemporaryHash: {
          type: 'object',
          required: ['path', 'sha256', 'bytes', 'canonicalization'],
          additionalProperties: false,
          properties: {
            path: { type: 'string' },
            sha256: { type: 'string', pattern: '^[a-f0-9]{64}$' },
            bytes: { type: 'integer', minimum: 0 },
            canonicalization: { enum: ['integrity-manifest-v1', 'canonical-json-v1'] },
          },
        },
        BlackBoxSignal: {
          type: 'object',
          required: [
            'instrument',
            'label',
            'observedAt',
            'value',
            'rawValue',
            'scale',
            'level',
            'tone',
            'snapshotHash',
            'sourceUrl',
            'sourceSnapshotUrl',
            'methodologyUrl',
            'calculatorRevision',
          ],
          additionalProperties: false,
          properties: {
            instrument: { enum: ['us', 'eu', 'yen', 'energie', 'debt'] },
            label: { type: 'string' },
            observedAt: { type: ['string', 'null'], format: 'date-time' },
            value: { type: ['number', 'null'] },
            rawValue: { type: ['number', 'null'] },
            scale: { type: 'number' },
            level: { type: ['string', 'null'] },
            tone: { type: ['string', 'null'] },
            snapshotHash: { type: 'string', pattern: '^[a-f0-9]{64}$' },
            sourceUrl: { type: 'string', format: 'uri' },
            sourceSnapshotUrl: { type: 'string', format: 'uri' },
            methodologyUrl: { type: 'string', format: 'uri' },
            calculatorRevision: { type: ['string', 'null'] },
          },
        },
        BlackBoxSources: {
          type: 'object',
          required: ['available', 'missingSignals'],
          additionalProperties: false,
          properties: {
            available: { type: 'array', items: { $ref: '#/components/schemas/BlackBoxSourceState' } },
            missingSignals: { type: 'array', items: { enum: ['us', 'eu', 'yen', 'energie', 'debt'] } },
          },
        },
        BlackBoxSourceState: {
          type: 'object',
          required: ['instrument', 'label', 'sourceUrl', 'sourceSnapshotUrl', 'sourcePublishedAt', 'retrievedAt', 'snapshotHash'],
          additionalProperties: false,
          properties: {
            instrument: { enum: ['us', 'eu', 'yen', 'energie', 'debt'] },
            label: { type: 'string' },
            sourceUrl: { type: 'string', format: 'uri' },
            sourceSnapshotUrl: { type: 'string', format: 'uri' },
            sourcePublishedAt: { type: ['string', 'null'], format: 'date-time' },
            retrievedAt: { type: ['string', 'null'], format: 'date-time' },
            snapshotHash: { type: 'string', pattern: '^[a-f0-9]{64}$' },
          },
        },
        BlackBoxModelState: {
          type: 'object',
          required: ['instrument', 'methodologyUrl', 'calculatorRepo', 'calculatorRevision'],
          additionalProperties: false,
          properties: {
            instrument: { enum: ['us', 'eu', 'yen', 'energie', 'debt'] },
            methodologyUrl: { type: 'string', format: 'uri' },
            calculatorRepo: { type: ['string', 'null'], format: 'uri' },
            calculatorRevision: { type: ['string', 'null'] },
          },
        },
        BlackBoxTriggeredSignal: {
          type: 'object',
          required: ['eventId', 'instrument', 'label', 'observedAt', 'previousLevel', 'currentLevel', 'value', 'tone', 'sourceUrl'],
          additionalProperties: false,
          properties: {
            eventId: { type: 'string' },
            instrument: { enum: ['us', 'eu', 'yen', 'energie', 'debt'] },
            label: { type: 'string' },
            observedAt: { type: ['string', 'null'], format: 'date-time' },
            previousLevel: { type: ['string', 'null'] },
            currentLevel: { type: ['string', 'null'] },
            value: { type: ['number', 'null'] },
            tone: { type: ['string', 'null'] },
            sourceUrl: { type: 'string', format: 'uri' },
          },
        },
        BlackBoxFrameFreshness: {
          type: 'object',
          required: ['status', 'completeSignals', 'staleSignals', 'missingSignals', 'signals'],
          additionalProperties: false,
          properties: {
            status: { enum: ['fresh', 'stale', 'partial'] },
            completeSignals: { type: 'integer' },
            staleSignals: { type: 'integer' },
            missingSignals: { type: 'array', items: { enum: ['us', 'eu', 'yen', 'energie', 'debt'] } },
            signals: { type: 'array', items: { $ref: '#/components/schemas/BlackBoxSignalFreshness' } },
          },
        },
        BlackBoxSignalFreshness: {
          type: 'object',
          required: ['instrument', 'status', 'observedAt', 'ageDays'],
          additionalProperties: false,
          properties: {
            instrument: { enum: ['us', 'eu', 'yen', 'energie', 'debt'] },
            status: { enum: ['fresh', 'stale', 'missing'] },
            observedAt: { type: ['string', 'null'], format: 'date-time' },
            ageDays: { type: ['integer', 'null'] },
          },
        },
        BlackBoxFrameIntegrity: {
          type: 'object',
          required: ['algorithm', 'surfaces'],
          additionalProperties: false,
          properties: {
            algorithm: { const: 'sha-256' },
            surfaces: { type: 'array', items: { $ref: '#/components/schemas/BlackBoxIntegritySurface' } },
          },
        },
        BlackBoxIntegritySurface: {
          type: 'object',
          required: ['path', 'canonicalSha256', 'canonicalBytes'],
          additionalProperties: false,
          properties: {
            path: { type: 'string' },
            canonicalSha256: { type: 'string', pattern: '^[a-f0-9]{64}$' },
            canonicalBytes: { type: 'integer' },
          },
        },
        BlackBoxPolicy: {
          type: 'object',
          required: ['promise', 'noPostHoc', 'genesis', 'correctionPolicy', 'changelog'],
          additionalProperties: false,
          properties: {
            promise: { type: 'string' },
            noPostHoc: { type: 'string' },
            genesis: { type: 'string' },
            correctionPolicy: { type: 'string', format: 'uri' },
            changelog: { type: 'string', format: 'uri' },
          },
        },
        SignalObservation: {
          type: 'object',
          required: [
            'recordType', 'schemaVersion', 'recordId', 'sourceRecordId', 'instrument', 'seriesId', 'seriesSlug',
            'name', 'shortName', 'citationName', 'label', 'seriesDate', 'observedAt', 'sourcePublishedAt',
            'retrievedAt', 'computedAt', 'archivedAt', 'value', 'rawValue', 'scale', 'level', 'tone',
            'identityVersion', 'methodologyVersion', 'methodologyVersionStatus', 'methodologyEffectiveFrom',
            'sourceUrl', 'methodologyUrl', 'methodologyChangelogUrl', 'sourceSnapshotUrl', 'calculatorRepo',
            'calculatorRevision', 'snapshotHash', 'archiveFrameId', 'archiveFrameHash', 'appendOnlyVerified',
            'evidenceTier', 'sourceStatus', 'qualityStatus', 'fallbackUsed', 'fallbackReason',
            'pointInTime', 'backtestUsable', 'limitations',
          ],
          additionalProperties: false,
          properties: {
            recordType: { const: 'observation' },
            schemaVersion: { type: 'string' },
            recordId: { type: 'string' },
            sourceRecordId: { type: ['string', 'null'] },
            instrument: { enum: ['us', 'eu', 'yen', 'energie', 'debt'] },
            seriesId: { type: 'string' },
            seriesSlug: { type: 'string' },
            name: { type: 'string' },
            shortName: { type: 'string' },
            citationName: { type: 'string' },
            label: { type: 'string' },
            seriesDate: { type: 'string', format: 'date-time' },
            observedAt: { type: ['string', 'null'], format: 'date-time' },
            sourcePublishedAt: { type: ['string', 'null'], format: 'date-time' },
            retrievedAt: { type: ['string', 'null'], format: 'date-time' },
            computedAt: { type: 'string', format: 'date-time' },
            archivedAt: { type: ['string', 'null'], format: 'date-time' },
            value: { type: ['number', 'null'] },
            rawValue: { type: ['number', 'null'] },
            scale: { type: 'number' },
            level: { type: ['string', 'null'] },
            tone: { type: ['string', 'null'] },
            identityVersion: { type: 'string' },
            methodologyVersion: { type: ['string', 'null'] },
            methodologyVersionStatus: { enum: ['versioned', 'unversioned-legacy'] },
            methodologyEffectiveFrom: { type: 'string', format: 'date' },
            sourceUrl: { type: 'string', format: 'uri' },
            methodologyUrl: { type: 'string', format: 'uri' },
            methodologyChangelogUrl: { type: 'string', format: 'uri' },
            sourceSnapshotUrl: { type: 'string', format: 'uri' },
            calculatorRepo: { type: ['string', 'null'], format: 'uri' },
            calculatorRevision: { type: ['string', 'null'] },
            snapshotHash: { type: 'string', pattern: '^[a-f0-9]{64}$' },
            archiveFrameId: { type: ['string', 'null'] },
            archiveFrameHash: { type: ['string', 'null'], pattern: '^[a-f0-9]{64}$' },
            appendOnlyVerified: { type: 'boolean' },
            evidenceTier: { enum: ['attested-archive', 'operational-archive', 'current-snapshot'] },
            sourceStatus: { enum: ['ok', 'fallback', 'unknown'] },
            qualityStatus: { enum: ['nominal', 'degraded', 'official-delayed', 'unknown'] },
            fallbackUsed: { type: 'boolean' },
            fallbackReason: { type: ['string', 'null'] },
            pointInTime: { type: 'boolean' },
            backtestUsable: { const: true },
            limitations: { type: 'array', items: { type: 'string' } },
          },
        },
        SignalLevelChange: {
          type: 'object',
          required: ['recordType', 'schemaVersion', 'eventId', 'instrument', 'seriesId', 'seriesSlug', 'name', 'label', 'observedAt', 'previousLevel', 'currentLevel', 'value', 'tone', 'sourceUrl', 'methodologyUrl', 'pointInTime', 'backtestUsable', 'limitations'],
          additionalProperties: false,
          properties: {
            recordType: { const: 'level-change' },
            schemaVersion: { type: 'string' },
            eventId: { type: 'string' },
            instrument: { enum: ['us', 'eu', 'yen', 'energie', 'debt'] },
            seriesId: { type: 'string' },
            seriesSlug: { type: 'string' },
            name: { type: 'string' },
            label: { type: 'string' },
            observedAt: { type: ['string', 'null'], format: 'date-time' },
            previousLevel: { type: ['string', 'null'] },
            currentLevel: { type: ['string', 'null'] },
            value: { type: ['number', 'null'] },
            tone: { type: ['string', 'null'] },
            sourceUrl: { type: 'string', format: 'uri' },
            methodologyUrl: { type: 'string', format: 'uri' },
            pointInTime: { type: 'boolean' },
            backtestUsable: { const: false },
            limitations: { type: 'array', items: { type: 'string' } },
          },
        },
        SignalCoverage: {
          type: 'object',
          required: ['observations', 'appendOnlyVerifiedObservations', 'methodologyVersionedObservations', 'attestedObservations', 'operationalObservations', 'currentObservations', 'archiveFrames', 'levelChanges', 'instruments', 'firstSeriesDate', 'lastSeriesDate', 'firstObservedAt', 'lastObservedAt', 'pointInTime', 'operationalImport'],
          additionalProperties: false,
          properties: {
            observations: { type: 'integer' },
            appendOnlyVerifiedObservations: { type: 'integer' },
            methodologyVersionedObservations: { type: 'integer' },
            attestedObservations: { type: 'integer' },
            operationalObservations: { type: 'integer' },
            currentObservations: { type: 'integer' },
            archiveFrames: { type: 'integer' },
            levelChanges: { type: 'integer' },
            instruments: { type: 'array', items: { enum: ['us', 'eu', 'yen', 'energie', 'debt'] } },
            firstSeriesDate: { type: ['string', 'null'], format: 'date-time' },
            lastSeriesDate: { type: ['string', 'null'], format: 'date-time' },
            firstObservedAt: { type: ['string', 'null'], format: 'date-time' },
            lastObservedAt: { type: ['string', 'null'], format: 'date-time' },
            pointInTime: { type: 'boolean' },
            operationalImport: { $ref: '#/components/schemas/SignalOperationalImport' },
          },
        },
        SignalOperationalImport: {
          type: 'object',
          required: ['status', 'source', 'attemptedAt', 'retrievedAt', 'rows', 'dailyObservations', 'firstSnapshot', 'lastSnapshot', 'sampling', 'reason'],
          additionalProperties: false,
          properties: {
            status: { enum: ['ok', 'fallback', 'missing'] },
            source: { type: 'string' },
            attemptedAt: { type: ['string', 'null'], format: 'date-time' },
            retrievedAt: { type: ['string', 'null'], format: 'date-time' },
            rows: { type: ['integer', 'null'] },
            dailyObservations: { type: 'integer' },
            firstSnapshot: { type: ['string', 'null'], format: 'date-time' },
            lastSnapshot: { type: ['string', 'null'], format: 'date-time' },
            sampling: { type: 'string' },
            reason: { type: ['string', 'null'] },
          },
        },
        SignalHistoryPolicy: {
          type: 'object',
          required: ['purpose', 'appendOnlyTarget', 'dateDiscipline', 'methodologyDiscipline', 'noRetroactiveBackfill', 'backtestRule', 'caveat', 'license', 'attribution'],
          additionalProperties: false,
          properties: {
            purpose: { type: 'string' },
            appendOnlyTarget: { type: 'string' },
            dateDiscipline: { type: 'string' },
            methodologyDiscipline: { type: 'string' },
            noRetroactiveBackfill: { type: 'string' },
            backtestRule: { type: 'string' },
            caveat: { type: 'string' },
            license: { type: 'string' },
            attribution: { type: 'string' },
          },
        },
        SignalInstrument: {
          type: 'object',
          required: ['key', 'label', 'seriesId', 'slug', 'name', 'shortName', 'citationName', 'description', 'dashboardLabel', 'identityVersion', 'identityEffectiveFrom', 'methodologyVersion', 'methodologyEffectiveFrom', 'source', 'methodology', 'methodologyChangelog', 'page', 'downloads', 'recommendedCitation', 'coverage'],
          additionalProperties: false,
          properties: {
            key: { enum: ['us', 'eu', 'yen', 'energie', 'debt'] },
            label: { type: 'string' },
            seriesId: { type: 'string' },
            slug: { type: 'string' },
            name: { type: 'string' },
            shortName: { type: 'string' },
            citationName: { type: 'string' },
            description: { type: 'string' },
            dashboardLabel: { type: 'string' },
            identityVersion: { type: 'string' },
            identityEffectiveFrom: { type: 'string', format: 'date' },
            methodologyVersion: { type: 'string' },
            methodologyEffectiveFrom: { type: 'string', format: 'date' },
            source: { type: 'string', format: 'uri' },
            methodology: { type: 'string', format: 'uri' },
            methodologyChangelog: { type: 'string', format: 'uri' },
            page: { type: 'string', format: 'uri' },
            downloads: { $ref: '#/components/schemas/SignalDownloads' },
            recommendedCitation: { type: 'string' },
            coverage: { $ref: '#/components/schemas/SignalInstrumentCoverage' },
          },
        },
        SignalDownloads: {
          type: 'object',
          required: ['json', 'ndjson', 'csv', 'svg'],
          additionalProperties: false,
          properties: {
            json: { type: 'string', format: 'uri' },
            ndjson: { type: 'string', format: 'uri' },
            csv: { type: 'string', format: 'uri' },
            svg: { type: 'string', format: 'uri' },
          },
        },
        SignalInstrumentCoverage: {
          type: 'object',
          required: ['observations', 'appendOnlyVerifiedObservations', 'attestedObservations', 'operationalObservations', 'currentObservations', 'firstSeriesDate', 'lastSeriesDate', 'firstObservedAt', 'lastObservedAt'],
          additionalProperties: false,
          properties: {
            observations: { type: 'integer' },
            appendOnlyVerifiedObservations: { type: 'integer' },
            attestedObservations: { type: 'integer' },
            operationalObservations: { type: 'integer' },
            currentObservations: { type: 'integer' },
            firstSeriesDate: { type: ['string', 'null'], format: 'date-time' },
            lastSeriesDate: { type: ['string', 'null'], format: 'date-time' },
            firstObservedAt: { type: ['string', 'null'], format: 'date-time' },
            lastObservedAt: { type: ['string', 'null'], format: 'date-time' },
          },
        },
        SignalHistorySurface: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'coverage', 'policy', 'instruments', 'current', 'observations', 'levelChanges'],
          additionalProperties: false,
          properties: {
            schema: { type: 'string', format: 'uri' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            coverage: { $ref: '#/components/schemas/SignalCoverage' },
            policy: { $ref: '#/components/schemas/SignalHistoryPolicy' },
            instruments: { type: 'array', items: { $ref: '#/components/schemas/SignalInstrument' } },
            current: { type: 'object', additionalProperties: { $ref: '#/components/schemas/SignalObservation' } },
            observations: { type: 'array', items: { $ref: '#/components/schemas/SignalObservation' } },
            levelChanges: { type: 'array', items: { $ref: '#/components/schemas/SignalLevelChange' } },
          },
        },
        SignalCurrentSurface: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'coverage', 'current', 'policy'],
          additionalProperties: false,
          properties: {
            schema: { type: 'string', format: 'uri' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            coverage: { $ref: '#/components/schemas/SignalCoverage' },
            current: { type: 'object', additionalProperties: { $ref: '#/components/schemas/SignalObservation' } },
            policy: { $ref: '#/components/schemas/SignalHistoryPolicy' },
          },
        },
        SignalSeriesCoverage: {
          type: 'object',
          required: ['observations', 'appendOnlyVerifiedObservations', 'attestedObservations', 'operationalObservations', 'currentObservations', 'firstSeriesDate', 'lastSeriesDate', 'firstObservedAt', 'lastObservedAt', 'methodologyVersionedObservations', 'archiveFrames', 'levelChanges', 'pointInTime'],
          additionalProperties: false,
          properties: {
            observations: { type: 'integer' },
            appendOnlyVerifiedObservations: { type: 'integer' },
            attestedObservations: { type: 'integer' },
            operationalObservations: { type: 'integer' },
            currentObservations: { type: 'integer' },
            firstSeriesDate: { type: ['string', 'null'], format: 'date-time' },
            lastSeriesDate: { type: ['string', 'null'], format: 'date-time' },
            firstObservedAt: { type: ['string', 'null'], format: 'date-time' },
            lastObservedAt: { type: ['string', 'null'], format: 'date-time' },
            methodologyVersionedObservations: { type: 'integer' },
            archiveFrames: { type: 'integer' },
            levelChanges: { type: 'integer' },
            pointInTime: { type: 'boolean' },
          },
        },
        SignalSeriesSurface: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'series', 'coverage', 'policy', 'current', 'observations', 'levelChanges', 'license', 'attribution'],
          additionalProperties: false,
          properties: {
            schema: { type: 'string', format: 'uri' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            series: { $ref: '#/components/schemas/SignalInstrument' },
            coverage: { $ref: '#/components/schemas/SignalSeriesCoverage' },
            policy: { $ref: '#/components/schemas/SignalHistoryPolicy' },
            current: { anyOf: [{ $ref: '#/components/schemas/SignalObservation' }, { type: 'null' }] },
            observations: { type: 'array', items: { $ref: '#/components/schemas/SignalObservation' } },
            levelChanges: { type: 'array', items: { $ref: '#/components/schemas/SignalLevelChange' } },
            license: { type: 'string' },
            attribution: { type: 'string' },
          },
        },
        SignalLineSchema: {
          anyOf: [
            { $ref: '#/components/schemas/SignalObservation' },
            { $ref: '#/components/schemas/SignalLevelChange' },
          ],
        },
        RiskSignal: {
          type: 'object',
          required: ['value', 'scale', 'level', 'tone', 'label', 'source', 'methodology', 'sourceStatus', 'qualityStatus', 'fallbackUsed', 'fallbackLayer', 'fallbackReason', 'sourceUpdatedAt', 'sourcePublishedAt', 'retrievedAt', 'lastAttemptAt', 'lastSuccessAt', 'staleAfter', 'ageSeconds', 'timelinessStatus', 'sourceSnapshotUrl', 'warnings'],
          additionalProperties: false,
          properties: {
            value: { type: 'number' },
            rawValue: { type: 'number' },
            scale: { type: 'number' },
            level: { type: 'string' },
            tone: { enum: ['low', 'normal', 'calm', 'moderate', 'elevated', 'stress', 'crisis', 'risk-on', 'risk-off'] },
            label: { type: 'string' },
            source: { type: 'string', format: 'uri' },
            methodology: { type: 'string', format: 'uri' },
            sourceStatus: { enum: ['ok', 'fallback'] },
            qualityStatus: { enum: ['nominal', 'degraded', 'official-delayed', 'unknown'] },
            fallbackUsed: { type: 'boolean' },
            fallbackLayer: { type: ['string', 'null'] },
            fallbackReason: { type: ['string', 'null'] },
            sourceUpdatedAt: { type: ['string', 'null'], format: 'date-time' },
            sourcePublishedAt: { type: ['string', 'null'], format: 'date-time' },
            retrievedAt: { type: ['string', 'null'], format: 'date-time' },
            lastAttemptAt: { type: ['string', 'null'], format: 'date-time' },
            lastSuccessAt: { type: ['string', 'null'], format: 'date-time' },
            staleAfter: { type: 'string' },
            ageSeconds: { type: ['integer', 'null'] },
            timelinessStatus: { enum: ['fresh', 'stale', 'unknown'] },
            sourceSnapshotUrl: { type: ['string', 'null'], format: 'uri' },
            warnings: { type: 'array', items: { type: 'string' } },
            componentDates: { type: 'object', additionalProperties: { type: ['string', 'null'] } },
            componentSources: { type: 'object' },
            producerRepository: { type: 'string', format: 'uri' },
            producerRevision: { type: ['string', 'null'] },
            producerRevisionStatus: { enum: ['reported', 'unreported'] },
            calculation: {
              anyOf: [
                {
                  type: 'object',
                  required: ['summary'],
                  additionalProperties: false,
                  properties: {
                    summary: { type: 'string' },
                    sourceCode: { type: 'string', format: 'uri' },
                    sourceRevision: { type: 'string' },
                    formula: { type: 'array', items: { type: 'string' } },
                    buckets: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['key', 'label', 'weight'],
                        additionalProperties: false,
                        properties: {
                          key: { type: 'string' },
                          label: { type: 'string' },
                          weight: { type: 'number' },
                        },
                      },
                    },
                    thresholds: {
                      type: 'array',
                      items: {
                        type: 'object',
                        required: ['label', 'value'],
                        additionalProperties: false,
                        properties: {
                          label: { type: 'string' },
                          value: { type: 'number' },
                        },
                      },
                    },
                    notes: { type: 'array', items: { type: 'string' } },
                  },
                },
                { type: 'null' },
              ],
            },
            provenance: {
              anyOf: [
                { $ref: '#/components/schemas/RiskSignalProvenance' },
                { type: 'null' },
              ],
            },
          },
        },
        DebtRiskTileSignal: {
          type: 'object',
          required: ['key', 'value', 'scale', 'level', 'tone'],
          additionalProperties: false,
          properties: {
            key: { const: 'debt' },
            value: { type: 'number' },
            rawValue: { type: 'number' },
            scale: { type: 'number' },
            level: { type: 'string' },
            tone: { enum: ['calm', 'moderate', 'elevated', 'stress', 'crisis'] },
            sourceStatus: { enum: ['ok', 'fallback'] },
            qualityStatus: { enum: ['nominal', 'degraded', 'official-delayed', 'unknown'] },
            fallbackUsed: { type: 'boolean' },
            fallbackLayer: { type: ['string', 'null'] },
            fallbackReason: { type: ['string', 'null'] },
            sourceUpdatedAt: { type: ['string', 'null'], format: 'date-time' },
            sourcePublishedAt: { type: ['string', 'null'], format: 'date-time' },
            retrievedAt: { type: ['string', 'null'], format: 'date-time' },
            lastAttemptAt: { type: ['string', 'null'], format: 'date-time' },
            lastSuccessAt: { type: ['string', 'null'], format: 'date-time' },
            staleAfter: { type: 'string' },
            ageSeconds: { type: ['integer', 'null'] },
            timelinessStatus: { enum: ['fresh', 'stale', 'unknown'] },
            sourceSnapshotUrl: { type: ['string', 'null'], format: 'uri' },
            warnings: { type: 'array', items: { type: 'string' } },
            producerRepository: { type: 'string', format: 'uri' },
            producerRevision: { type: ['string', 'null'] },
            producerRevisionStatus: { enum: ['reported', 'unreported'] },
          },
        },
        RiskSignalProvenanceBucket: {
          type: 'object',
          required: ['key', 'label', 'score', 'status', 'weight', 'metrics'],
          additionalProperties: false,
          properties: {
            key: { type: 'string' },
            label: { type: 'string' },
            score: { type: 'number' },
            status: { type: 'string' },
            weight: { type: 'number' },
            metrics: { type: 'integer' },
          },
        },
        RiskSignalProvenanceSource: {
          type: 'object',
          required: ['source', 'latestDate', 'metrics', 'maxRisk'],
          additionalProperties: false,
          properties: {
            source: { type: 'string' },
            latestDate: { type: 'string' },
            metrics: { type: 'integer' },
            maxRisk: { type: 'number' },
          },
        },
        RiskSignalProvenanceTopSignal: {
          type: 'object',
          required: ['family', 'name', 'source', 'date', 'current', 'unit', 'riskScore', 'signedZ', 'rationale'],
          additionalProperties: false,
          properties: {
            family: { type: 'string' },
            name: { type: 'string' },
            source: { type: 'string' },
            date: { type: 'string' },
            current: { type: 'number' },
            unit: { type: 'string' },
            riskScore: { type: 'number' },
            signedZ: { type: ['number', 'null'] },
            rationale: { type: 'string' },
          },
        },
        RiskSignalProvenance: {
          type: 'object',
          required: [
            'label',
            'source',
            'latestJsonUrl',
            'methodology',
            'calculator',
            'calculatorRevision',
            'generatedAt',
            'retrievedAt',
            'schemaVersion',
            'scoreRaw',
            'scoreRounded',
            'status',
            'issues',
            'thresholds',
            'refresh',
            'scope',
            'buckets',
            'sources',
            'topSignals',
            'calculation',
          ],
          additionalProperties: false,
          properties: {
            label: { type: 'string' },
            source: { type: 'string', format: 'uri' },
            latestJsonUrl: { type: 'string', format: 'uri' },
            methodology: { type: 'string', format: 'uri' },
            calculator: { type: 'string', format: 'uri' },
            calculatorRevision: { type: ['string', 'null'] },
            generatedAt: { type: 'string', format: 'date-time' },
            retrievedAt: { type: 'string', format: 'date-time' },
            schemaVersion: { type: ['string', 'null'] },
            scoreRaw: { type: 'number' },
            scoreRounded: { type: 'number' },
            status: { type: 'string' },
            sourceStatus: { enum: ['ok', 'fallback'] },
            qualityStatus: { enum: ['nominal', 'degraded', 'official-delayed', 'unknown'] },
            fallbackUsed: { type: 'boolean' },
            fallbackReason: { type: ['string', 'null'] },
            lastAttemptAt: { type: ['string', 'null'], format: 'date-time' },
            lastSuccessAt: { type: ['string', 'null'], format: 'date-time' },
            staleAfter: { type: 'string' },
            coverage: { type: ['number', 'null'], minimum: 0, maximum: 1 },
            coverageNote: { type: ['string', 'null'] },
            issues: { type: 'array', items: { type: 'string' } },
            thresholds: {
              type: 'object',
              required: ['stress', 'watch'],
              additionalProperties: false,
              properties: {
                stress: { type: 'number' },
                watch: { type: 'number' },
              },
            },
            refresh: {
              type: 'object',
              required: ['auto_refresh_seconds', 'source_ttl_seconds'],
              additionalProperties: false,
              properties: {
                auto_refresh_seconds: { type: 'integer' },
                source_ttl_seconds: {
                  type: 'object',
                  required: ['institutional', 'market'],
                  additionalProperties: false,
                  properties: {
                    institutional: { type: 'integer' },
                    market: { type: 'integer' },
                  },
                },
              },
            },
            scope: {
              type: 'object',
              required: ['country', 'focus', 'market_data'],
              additionalProperties: false,
              properties: {
                country: { type: 'string' },
                focus: { type: 'string' },
                market_data: { type: 'string' },
              },
            },
            buckets: {
              type: 'array',
              items: { $ref: '#/components/schemas/RiskSignalProvenanceBucket' },
            },
            sources: {
              type: 'array',
              items: { $ref: '#/components/schemas/RiskSignalProvenanceSource' },
            },
            topSignals: {
              type: 'array',
              items: { $ref: '#/components/schemas/RiskSignalProvenanceTopSignal' },
            },
            calculation: { type: 'string' },
          },
        },
        RiskSnapshot: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'snapshot', 'status', 'summary', 'indices', 'note', 'license', 'attribution'],
          additionalProperties: false,
          properties: {
            schema: { type: 'string' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            snapshot: { type: 'string', format: 'date-time' },
            status: { enum: ['ok', 'degraded', 'failed'] },
            summary: {
              type: 'object',
              required: ['expected', 'present', 'ok', 'fallback', 'stale', 'degraded', 'missing'],
              properties: {
                expected: { type: 'integer' },
                present: { type: 'integer' },
                ok: { type: 'integer' },
                fallback: { type: 'integer' },
                stale: { type: 'integer' },
                degraded: { type: 'integer' },
                missing: { type: 'array', items: { type: 'object' } },
              },
            },
            software: {
              anyOf: [
                {
                  type: 'object',
                  required: ['repository', 'revision', 'revisionStatus', 'sourceSha256'],
                  additionalProperties: false,
                  properties: {
                    repository: { type: 'string', format: 'uri' },
                    revision: { type: ['string', 'null'] },
                    revisionStatus: { enum: ['reported', 'unreported'] },
                    sourceSha256: { type: ['string', 'null'], pattern: '^[a-f0-9]{64}$' },
                  },
                },
                { type: 'null' },
              ],
            },
            indices: {
              type: 'object',
              required: ['us', 'eu', 'yen', 'energie', 'debt'],
              additionalProperties: false,
              properties: {
                us: { $ref: '#/components/schemas/RiskSignal' },
                eu: { $ref: '#/components/schemas/RiskSignal' },
                yen: { $ref: '#/components/schemas/RiskSignal' },
                energie: { $ref: '#/components/schemas/RiskSignal' },
                debt: { $ref: '#/components/schemas/RiskSignal' },
              },
            },
            confluence: { anyOf: [{ $ref: '#/components/schemas/RiskConfluence' }, { type: 'null' }] },
            feed: { type: 'string', format: 'uri' },
            note: { type: 'string' },
            precisionGuard: { $ref: '#/components/schemas/EditorialPrecisionGuard' },
            scaleCaveat: { $ref: '#/components/schemas/RiskBandScaleCaveat' },
            license: { type: 'string' },
            attribution: { type: 'string' },
          },
        },
        DebtRiskSnapshot: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'retrievedAt', 'signal', 'provenance'],
          additionalProperties: false,
          properties: {
            schema: { type: 'string', format: 'uri' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            retrievedAt: { type: 'string', format: 'date-time' },
            status: { enum: ['ok', 'fallback'] },
            signal: { $ref: '#/components/schemas/DebtRiskTileSignal' },
            provenance: { $ref: '#/components/schemas/RiskSignalProvenance' },
          },
        },
        RiskConfluenceTop: {
          type: 'object',
          required: ['ticker', 'score', 'quadrant'],
          additionalProperties: false,
          properties: {
            ticker: { type: 'string' },
            score: { type: 'number' },
            quadrant: { type: 'string' },
          },
        },
        RiskConfluence: {
          type: 'object',
          required: ['updated', 'count', 'conviction', 'top', 'source'],
          additionalProperties: false,
          properties: {
            updated: { type: ['string', 'null'], format: 'date-time' },
            count: { type: 'integer' },
            conviction: { type: 'integer' },
            top: { anyOf: [{ $ref: '#/components/schemas/RiskConfluenceTop' }, { type: 'null' }] },
            source: { type: 'string', format: 'uri' },
          },
        },
      },
    },
  };
}

export function postUrl(post: PostEntry) {
  return contentLanguage(post) === 'en'
    ? `${AGENT_SITE}/en/analysis/${post.id}/`
    : `${AGENT_SITE}/posts/${post.id}/`;
}

export function guideUrl(guide: GuideEntry) {
  return contentLanguage(guide) === 'en'
    ? `${AGENT_SITE}/en/guides/${guide.id}/`
    : `${AGENT_SITE}/guides/${guide.id}/`;
}

export function sortPosts<T extends PostEntry>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function sortGuides<T extends GuideEntry>(guides: T[]): T[] {
  return [...guides].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function buildArticleEvidenceRecord(post: PostEntry, opts: { globalClaimIds?: boolean } = {}) {
  const language = contentLanguage(post);
  const evidence = buildArticleEvidence(post.body ?? '', {
    published: post.data.pubDate,
    updated: post.data.updatedDate,
    url: postUrl(post),
    title: post.data.title,
    articleSlug: post.id,
  });

  return {
    claims: evidence.claims.map((claim) => ({
      ...(() => {
        const reviewId = `${post.id}:${claim.id}`;
        const globalId = language === 'fr' ? reviewId : `en:${reviewId}`;
        const review = language === 'fr' ? claimReviewById.get(reviewId) : undefined;
        const id = opts.globalClaimIds ? globalId : claim.id;
        const kind = review?.kind ?? claim.kind;
        return {
          id,
          localId: claim.id,
          canonicalId: canonicalId(post, 'article'),
          language,
          articleSlug: post.id,
          articleUrl: postUrl(post),
          articleTitle: post.data.title,
          kind,
          claim: claim.claim,
          date: claim.dateIso ?? null,
          dateLabel: claim.dateLabel,
          claimDate: claim.claimDateIso ?? claim.dateIso ?? null,
          claimDateLabel: claim.claimDateLabel ?? claim.dateLabel,
          observationDate: claim.observationDateIso ?? null,
          observationDateLabel: claim.observationDateLabel ?? claim.dateLabel,
          observationStart: claim.observationStartIso ?? null,
          observationEnd: claim.observationEndIso ?? null,
          temporalPrecision: claim.temporalPrecision,
          confidence: claim.confidence,
          reviewStatus: review ? 'reviewed' : claim.reviewStatus,
          reviewedAt: review?.reviewedAt ?? claim.reviewedAt ?? null,
          reviewedBy: review?.reviewedBy ?? claim.reviewedBy ?? null,
          reviewNote: review?.note ?? claim.reviewNote ?? null,
          reviewedProofDepth: review?.proofDepth ?? claim.reviewedProofDepth ?? null,
          evidenceLocator: review?.evidenceLocator ?? claim.evidenceLocator ?? null,
          reviewSourceUrl: review?.sourceUrl ?? claim.reviewSourceUrl ?? null,
          reviewSourceDate: review?.sourceDate ?? claim.reviewSourceDate ?? null,
          reviewSourceType: review?.sourceType ?? claim.reviewSourceType ?? null,
          reproductionArtifact: review?.reproductionArtifact ?? claim.reproductionArtifact ?? null,
          classifier: {
            ...claim.classifier,
            reviewedOverride: review
              ? 'Type et niveau de preuve éventuellement corrigés par le registre humain claim-reviews.ts.'
              : undefined,
          },
          references: claim.references.map((ref) => ({
            label: ref.label,
            href: ref.href,
            host: ref.host ?? null,
            kind: ref.kind ?? null,
            date: ref.sourcePublicationDateIso ?? ref.dateIso ?? null,
            dateLabel: ref.sourcePublicationDateLabel ?? ref.dateLabel ?? 'date source non détectée',
            sourcePublicationDate: ref.sourcePublicationDateIso ?? ref.dateIso ?? null,
            sourcePublicationDateLabel: ref.sourcePublicationDateLabel ?? ref.dateLabel ?? null,
            retrievedAt: ref.retrievedAt ?? null,
            indexedAt: ref.indexedAt ?? null,
          })),
        };
      })(),
    })),
    depth: evidence.depth,
    badges: evidence.badges.map((badge) => ({
      id: badge.id,
      label: badge.label,
      detail: badge.detail,
    })),
    primarySources: evidence.primary.map((item) => ({
      slug: item.source.slug,
      name: item.source.name,
      url: `${AGENT_SITE}/sources/${item.source.slug}/`,
      reason: item.reason,
    })),
    counts: evidence.stats,
  };
}

export function buildArticleRecord(
  post: PostEntry,
  translations: { source?: PostEntry; alternate?: PostEntry } = {}
) {
  const language = contentLanguage(post);
  const evidenceRef = language === 'en'
    ? {
        language: 'fr' as const,
        articleSlug: sourceSlug(post)!,
        claimsUrl: `${AGENT_SITE}/api/v1/claims.json`,
        evidenceGraphUrl: `${AGENT_SITE}/api/v1/evidence-graph.json`,
      }
    : null;
  return {
    canonicalId: canonicalId(post, 'article'),
    language,
    translationOf: sourceContentId(post, 'article'),
    alternateUrl: translations.alternate ? postUrl(translations.alternate) : sourceContentUrl(post, 'article'),
    translationStatus: translationStatus(post, translations.source),
    slug: post.id,
    url: postUrl(post),
    title: post.data.title,
    date: isoDate(post.data.pubDate),
    updated: isoDate(post.data.updatedDate),
    description: post.data.description,
    tags: post.data.tags ?? [],
    topics: topics.filter((topic) => postMatchesTopic(post.data.tags ?? [], topic)).map((topic) => topic.slug),
    ...(language === 'fr' ? { evidence: buildArticleEvidenceRecord(post) } : {}),
    evidenceRef,
    revisions: {
      published: isoDate(post.data.pubDate),
      updated: isoDate(post.data.updatedDate),
      policy: `${AGENT_SITE}/protocole-editorial/`,
      changelog: `${AGENT_SITE}/changelog-editorial/`,
    },
  };
}

export function buildGuideRecord(
  guide: GuideEntry,
  translations: { source?: GuideEntry; alternate?: GuideEntry } = {}
) {
  return {
    canonicalId: canonicalId(guide, 'guide'),
    language: contentLanguage(guide),
    translationOf: sourceContentId(guide, 'guide'),
    alternateUrl: translations.alternate ? guideUrl(translations.alternate) : sourceContentUrl(guide, 'guide'),
    translationStatus: translationStatus(guide, translations.source),
    slug: guide.id,
    url: guideUrl(guide),
    title: guide.data.title,
    date: isoDate(guide.data.pubDate),
    updated: isoDate(guide.data.updatedDate),
    description: guide.data.description,
    summary: guide.data.summary ?? null,
    tags: guide.data.tags ?? [],
  };
}

export function buildCatalogSurface(posts: PostEntry[], guides: GuideEntry[]) {
  const postsFr = posts.filter((entry): entry is CollectionEntry<'posts'> => entry.collection === 'posts');
  const postsEn = posts.filter((entry): entry is CollectionEntry<'postsEn'> => entry.collection === 'postsEn');
  const guidesFr = guides.filter((entry): entry is CollectionEntry<'guides'> => entry.collection === 'guides');
  const guidesEn = guides.filter((entry): entry is CollectionEntry<'guidesEn'> => entry.collection === 'guidesEn');
  const postSourceBySlug = new Map(postsFr.map((entry) => [entry.id, entry]));
  const postTranslationBySource = new Map(postsEn.map((entry) => [entry.data.sourceArticle, entry]));
  const guideSourceBySlug = new Map(guidesFr.map((entry) => [entry.id, entry]));
  const guideTranslationBySource = new Map(guidesEn.map((entry) => [entry.data.sourceGuide, entry]));
  const articles = sortPosts(posts).map((post) => buildArticleRecord(post, {
    source: post.collection === 'postsEn' ? postSourceBySlug.get(post.data.sourceArticle) : undefined,
    alternate: post.collection === 'posts' ? postTranslationBySource.get(post.id) : undefined,
  }));
  const sortedGuides = sortGuides(guides).map((guide) => buildGuideRecord(guide, {
    source: guide.collection === 'guidesEn' ? guideSourceBySlug.get(guide.data.sourceGuide) : undefined,
    alternate: guide.collection === 'guides' ? guideTranslationBySource.get(guide.id) : undefined,
  }));

  const methodologies = methodologyPages.map((methodology) => ({
    slug: methodology.slug,
    url: `${AGENT_SITE}/methodologie/${methodology.slug}/`,
    title: methodology.title,
    label: methodology.label,
    description: methodology.description,
    question: methodology.question,
    dashboard: methodology.dashboardUrl,
    repo: methodology.repoUrl,
    updated: methodology.updated,
    scaleCaveat: methodology.slug === '13flow' ? null : riskBandScaleCaveat,
    sources: methodology.sources.map((source) => ({ name: source.name, url: source.url, role: source.role })),
  }));

  const glossary = glossaryEntries.map((term) => ({
    slug: term.slug,
    url: `${AGENT_SITE}${term.url}`,
    sigle: term.sigle,
    name: term.nom,
    definition: term.def,
    category: term.sectionTitle,
    guide: term.guide ? `${AGENT_SITE}${term.guide}` : null,
    atlas: term.atlas
      ? {
          intuition: term.atlas.intuition ?? null,
          formula: term.atlas.formula ?? null,
          whyNow: term.atlas.whyNow ?? null,
          related: term.atlas.related ?? [],
          articles: (term.atlas.articles ?? []).map((link) => ({ ...link, href: absoluteHref(link.href) })),
          guides: (term.atlas.guides ?? []).map((link) => ({ ...link, href: absoluteHref(link.href) })),
          datasets: (term.atlas.datasets ?? []).map((link) => ({ ...link, href: absoluteHref(link.href) })),
          signals: (term.atlas.signals ?? []).map((link) => ({ ...link, href: absoluteHref(link.href) })),
          sources: (term.atlas.sources ?? []).map((link) => ({ ...link, href: absoluteHref(link.href) })),
        }
      : null,
  }));

  const primarySources = primaryInstitutions.map((source) => ({
    slug: source.slug,
    url: `${AGENT_SITE}/sources/${source.slug}/`,
    name: source.name,
    shortName: source.shortName,
    category: source.category,
    officialUrl: source.url,
    description: source.description,
    datasets: source.datasets.map((dataset) => ({
      name: dataset.name,
      role: dataset.role,
      cadence: dataset.cadence,
      delay: dataset.delay,
      url: dataset.url,
    })),
    limits: source.limits,
  }));

  const editorial = {
    protocol: {
      url: `${AGENT_SITE}/protocole-editorial/`,
      updated: editorialProtocol.updated,
      promise: editorialProtocol.promise,
      principles: editorialProtocol.principles,
      steps: editorialProtocol.steps,
      evidenceLevels: editorialProtocol.evidenceLevels,
      proofDepthLevels: editorialProtocol.proofDepthLevels,
      precisionGuard: editorialProtocol.precisionGuard,
      correctionPolicy: editorialProtocol.correctionPolicy,
    },
    changelog: editorialChangelog.map((entry) => ({
      ...entry,
      url: `${AGENT_SITE}/changelog-editorial/`,
    })),
  };

  return {
    schema: 'https://l0g.fr/api/',
    version: '1',
    generated: generatedAt(),
    counts: {
      articles: articles.length,
      articlesByLanguage: languageCounts(posts),
      guides: sortedGuides.length,
      guidesByLanguage: languageCounts(guides),
      topics: topics.length,
      methodologies: methodologies.length,
      glossary: glossary.length,
      primarySources: primarySources.length,
      editorialChangelog: editorial.changelog.length,
    },
    topics: topics.map((topic) => ({ slug: topic.slug, label: topic.label, blurb: topic.blurb })),
    glossaryCategories: glossarySections.map((section) => ({ slug: section.slug, title: section.titre, count: section.entries.length })),
    articles,
    guides: sortedGuides,
    methodologies,
    riskBandScaleCaveat,
    editorial,
    primarySources,
    glossary,
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
    note: 'Catalogue bilingue best-effort. Le texte complet est servi par /posts/ et /guides/ en français, /en/analysis/ et /en/guides/ en anglais.',
  };
}

export function buildSearchIndexSurface(posts: PostEntry[], guides: GuideEntry[]) {
  const catalog = buildCatalogSurface(posts, guides);
  const postByKey = new Map(posts.map((entry) => [`${contentLanguage(entry)}:${entry.id}`, entry]));
  const guideByKey = new Map(guides.map((entry) => [`${contentLanguage(entry)}:${entry.id}`, entry]));
  const toContentDocument = (record: ReturnType<typeof buildArticleRecord> | ReturnType<typeof buildGuideRecord>, type: 'article' | 'guide', text: string) => ({
    canonicalId: record.canonicalId,
    language: record.language,
    translationOf: record.translationOf,
    alternateUrl: record.alternateUrl,
    translationStatus: record.translationStatus,
    type,
    slug: record.slug,
    url: record.url,
    title: record.title,
    date: record.date,
    updated: record.updated,
    description: record.description,
    summary: 'summary' in record ? record.summary : null,
    tags: record.tags,
    topics: 'topics' in record ? record.topics : [],
    text,
  });
  const contentDocuments = [
    ...catalog.articles.map((article) => toContentDocument(
      article,
      'article',
      searchablePlainText(postByKey.get(`${article.language}:${article.slug}`)?.body ?? '')
    )),
    ...catalog.guides.map((guide) => toContentDocument(
      guide,
      'guide',
      searchablePlainText(guideByKey.get(`${guide.language}:${guide.slug}`)?.body ?? '')
    )),
  ];

  const referenceDocuments = [
    ...catalog.glossary.map((term) => ({
      canonicalId: `glossary:${term.slug}`,
      language: 'fr' as const,
      translationOf: null,
      alternateUrl: null,
      translationStatus: 'source' as const,
      type: 'glossary' as const,
      slug: term.slug,
      url: term.url,
      title: `${term.sigle} · ${term.name}`,
      date: null,
      updated: null,
      description: term.definition,
      summary: null,
      tags: [term.category, term.sigle, term.name].filter(Boolean),
      topics: [],
      text: [term.definition, term.atlas?.intuition, term.atlas?.formula, term.atlas?.whyNow].filter(Boolean).join(' '),
    })),
    ...catalog.methodologies.map((methodology) => ({
      canonicalId: `methodology:${methodology.slug}`,
      language: 'fr' as const,
      translationOf: null,
      alternateUrl: null,
      translationStatus: 'source' as const,
      type: 'methodology' as const,
      slug: methodology.slug,
      url: methodology.url,
      title: methodology.title,
      date: null,
      updated: methodology.updated,
      description: methodology.description,
      summary: methodology.question,
      tags: [methodology.label],
      topics: [],
      text: `${methodology.description} ${methodology.question}`,
    })),
    ...catalog.primarySources.map((source) => ({
      canonicalId: `source:${source.slug}`,
      language: 'fr' as const,
      translationOf: null,
      alternateUrl: null,
      translationStatus: 'source' as const,
      type: 'source' as const,
      slug: source.slug,
      url: source.url,
      title: `${source.shortName} · ${source.name}`,
      date: null,
      updated: null,
      description: source.description,
      summary: null,
      tags: [source.category, source.shortName].filter(Boolean),
      topics: [],
      text: [source.description, ...source.limits].join(' '),
    })),
  ];

  const documents = [...contentDocuments, ...referenceDocuments];
  return {
    schema: `${OPENAPI_SCHEMA_BASE}/SearchIndexSurface`,
    version: AGENT_VERSION,
    generated: generatedAt(),
    counts: {
      documents: documents.length,
      byLanguage: {
        fr: documents.filter((document) => document.language === 'fr').length,
        en: documents.filter((document) => document.language === 'en').length,
      },
      byType: Object.fromEntries(['article', 'guide', 'glossary', 'methodology', 'source'].map((type) => [
        type,
        documents.filter((document) => document.type === type).length,
      ])),
    },
    policy: {
      source: 'Artefact canonique partagé par Agent Surface, MCP serveur et WebMCP.',
      ranking: 'Le consommateur applique un score lexical déterministe sur title, tags, topics, description et text.',
      caveat: 'Index statique mis à jour au build ; ce n’est pas un moteur temps réel.',
    },
    documents,
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
  };
}

export function buildClaimsSurface(posts: PostEntry[]) {
  const canonicalPosts = posts.filter((post): post is CollectionEntry<'posts'> => post.collection === 'posts');
  const articles = sortPosts(canonicalPosts).map((post) => ({
    ...buildArticleRecord(post),
    evidence: buildArticleEvidenceRecord(post, { globalClaimIds: true }),
  }));
  const claims = articles.flatMap((article) => article.evidence.claims);
  const references = claims.flatMap((claim) => claim.references.map((reference) => ({
    claimId: claim.id,
    canonicalId: claim.canonicalId,
    language: claim.language,
    articleSlug: claim.articleSlug,
    label: reference.label,
    href: reference.href,
    host: reference.host,
    kind: reference.kind,
    date: reference.date,
    dateLabel: reference.dateLabel,
    claimDate: claim.claimDate,
    observationDate: claim.observationDate,
    observationStart: claim.observationStart,
    observationEnd: claim.observationEnd,
    temporalPrecision: claim.temporalPrecision,
    sourcePublicationDate: reference.sourcePublicationDate,
    retrievedAt: reference.retrievedAt,
    indexedAt: reference.indexedAt,
  })));

  return {
    schema: `${OPENAPI_SCHEMA_BASE}/ClaimsSurface`,
    version: AGENT_VERSION,
    generated: generatedAt(),
    counts: {
      articles: articles.length,
      articlesByLanguage: languageCounts(canonicalPosts),
      claims: claims.length,
      reviewedClaims: claims.filter((claim) => claim.reviewStatus === 'reviewed').length,
      references: references.length,
      claimKinds: [...new Set(claims.map((claim) => claim.kind))].sort(),
    },
    reviewRegistry: {
      version: claimReviewRegistry.version,
      updated: claimReviewRegistry.updated,
      policy: claimReviewRegistry.policy,
      reviewedClaims: claimReviewRegistry.canonicalEntries.length,
      legacyReviews: claimReviewRegistry.legacyEntries.length,
      signalClaims: {
        declared: claimReviewRegistry.signalClaimUsage.length,
        canonicallyReviewed: claimReviewRegistry.signalClaimUsage.length,
        coverage: 1,
        usages: claimReviewRegistry.signalClaimUsage,
      },
      entries: claimReviewRegistry.entries,
    },
    policy: {
      relation: 'Chaque entrée relie une affirmation textuelle à une ou plusieurs références cliquables, datées quand détectable.',
      caveat: 'Extraction automatique best-effort : la relation exacte doit rester vérifiable dans la page source.',
      selection:
        'Sélection déterministe fondée sur le risque : priorité aux claims explicitement marquées, sensibles ou juridiques, chiffrées, puis reliées à une source primaire, un dataset, une méthodologie ou un dashboard.',
      maxClaimsPerArticle: 3,
      classification:
        'Chaque analyse expose au maximum trois claims structurants. Les types fait/estimation/inférence/scénario sont produits par un classifieur lexical heuristique v2, exposé par claim.classifier. Une proposition citée sans marqueur prospectif ou inférentiel est classée fait par défaut, sans devenir pour autant une revue canonique.',
      review:
        'Les claims heuristiques restent unreviewed. Une certification exige status=canonical, source et date, locator exact, type explicite et profondeur direct-proof ou reproduction. Les anciennes revues restent legacy et peuvent référencer des claims qui ne font plus partie de la sélection structurante courante.',
      dateModel:
        'claimDate décrit la date portée par l’affirmation ; observationDate décrit l’horizon observé quand il est détectable ; sourcePublicationDate appartient à la référence ; retrievedAt reste null sans fetch réel de la source ; indexedAt indique l’indexation du lien dans le snapshot.',
      correctionPolicy: `${AGENT_SITE}/protocole-editorial/`,
    },
    claims,
    references,
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
  };
}

export function buildSourcesSurface(posts: PostEntry[]) {
  const claimsSurface = buildClaimsSurface(posts);
  const hostCounts = new Map<string, { host: string; references: number; articles: Set<string>; kinds: Set<string> }>();

  for (const ref of claimsSurface.references) {
    const host = ref.host || (ref.href.startsWith('/') ? 'l0g.fr' : 'unknown');
    const current = hostCounts.get(host) ?? { host, references: 0, articles: new Set<string>(), kinds: new Set<string>() };
    current.references += 1;
    current.articles.add(ref.canonicalId);
    if (ref.kind) current.kinds.add(ref.kind);
    hostCounts.set(host, current);
  }

  const referenceHosts = [...hostCounts.values()]
    .sort((a, b) => b.references - a.references || a.host.localeCompare(b.host))
    .map((item) => ({
      host: item.host,
      references: item.references,
      articles: item.articles.size,
      kinds: [...item.kinds].sort(),
    }));

  return {
    schema: `${OPENAPI_SCHEMA_BASE}/SourcesSurface`,
    version: AGENT_VERSION,
    generated: generatedAt(),
    registry: {
      version: primarySourcesUpdatedIso,
      updated: primarySourcesUpdatedIso,
      scope:
        'Référentiel éditorial versionné des institutions reconnues comme sources primaires par l0g ; les hôtes non présents peuvent rester classés comme sources secondaires.',
      testPolicy:
        'Chaque entrée doit conserver slug stable, URL officielle, au moins un dataset, limites et règles de vérification ; les builds Agent Surface valident le schéma public.',
      caveat:
        'La reconnaissance primaire est déterministe mais non exhaustive : une institution officielle absente du registre n’est pas automatiquement promue en source primaire.',
    },
    counts: {
      primarySources: primaryInstitutions.length,
      referenceHosts: referenceHosts.length,
      references: claimsSurface.references.length,
    },
    primarySources: primaryInstitutions.map((source) => ({
      slug: source.slug,
      url: `${AGENT_SITE}/sources/${source.slug}/`,
      name: source.name,
      shortName: source.shortName,
      category: source.category,
      officialUrl: source.url,
      description: source.description,
      datasets: source.datasets.map((dataset) => ({
        name: dataset.name,
        role: dataset.role,
        cadence: dataset.cadence,
        delay: dataset.delay,
        url: dataset.url,
      })),
      limits: source.limits,
      verification: source.verification,
    })),
    referenceHosts,
    sourcePolicy: {
      preferred: 'Sources primaires institutionnelles, données publiques et documents originaux.',
      fallback: 'Presse économique de référence et sources secondaires datées quand la source primaire ne suffit pas.',
      citationRule: 'Une source exploitable par agent doit conserver URL, date, libellé et contexte de claim.',
    },
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
  };
}

export function buildEvidenceGraphSurface(posts: PostEntry[]) {
  const claimsSurface = buildClaimsSurface(posts);
  const nodeMap = new Map<string, {
    id: string;
    type: 'article' | 'claim' | 'reference' | 'host' | 'primarySource' | 'dataset';
    label: string;
    url: string | null;
    meta: Record<string, unknown>;
  }>();
  const edgeMap = new Map<string, {
    id: string;
    from: string;
    to: string;
    type: 'contains' | 'cites' | 'hostedBy' | 'matchesPrimarySource' | 'providesDataset';
    meta: Record<string, unknown>;
  }>();

  const addNode = (node: {
    id: string;
    type: 'article' | 'claim' | 'reference' | 'host' | 'primarySource' | 'dataset';
    label: string;
    url?: string | null;
    meta?: Record<string, unknown>;
  }) => {
    if (!nodeMap.has(node.id)) {
      nodeMap.set(node.id, {
        id: node.id,
        type: node.type,
        label: node.label,
        url: node.url ?? null,
        meta: node.meta ?? {},
      });
    }
  };

  const addEdge = (edge: {
    from: string;
    to: string;
    type: 'contains' | 'cites' | 'hostedBy' | 'matchesPrimarySource' | 'providesDataset';
    meta?: Record<string, unknown>;
  }) => {
    const id = `edge:${edge.type}:${edge.from}:${edge.to}`;
    if (!edgeMap.has(id)) edgeMap.set(id, { id, from: edge.from, to: edge.to, type: edge.type, meta: edge.meta ?? {} });
  };

  for (const source of primaryInstitutions) {
    const sourceId = `primarySource:${source.slug}`;
    addNode({
      id: sourceId,
      type: 'primarySource',
      label: source.shortName,
      url: `${AGENT_SITE}/sources/${source.slug}/`,
      meta: {
        name: source.name,
        category: source.category,
        officialUrl: source.url,
      },
    });

    for (const dataset of source.datasets) {
      const datasetId = `dataset:${source.slug}:${graphSafeId(dataset.name)}`;
      addNode({
        id: datasetId,
        type: 'dataset',
        label: dataset.name,
        url: dataset.url,
        meta: {
          sourceSlug: source.slug,
          role: dataset.role,
          cadence: dataset.cadence,
          delay: dataset.delay,
        },
      });
      addEdge({ from: sourceId, to: datasetId, type: 'providesDataset', meta: { cadence: dataset.cadence } });
    }
  }

  for (const claim of claimsSurface.claims) {
    const articleId = claim.language === 'fr' ? `article:${claim.articleSlug}` : `article:en:${claim.articleSlug}`;
    const claimId = `claim:${claim.id}`;
    addNode({
      id: articleId,
      type: 'article',
      label: claim.articleTitle,
      url: claim.articleUrl,
      meta: {
        slug: claim.articleSlug,
        canonicalId: claim.canonicalId,
        language: claim.language,
      },
    });
    addNode({
      id: claimId,
      type: 'claim',
      label: claim.claim,
      url: `${claim.articleUrl}#${claim.localId}`,
      meta: {
        localId: claim.localId,
        canonicalId: claim.canonicalId,
        language: claim.language,
        articleSlug: claim.articleSlug,
        kind: claim.kind,
        date: claim.date,
        dateLabel: claim.dateLabel,
        claimDate: claim.claimDate,
        observationDate: claim.observationDate,
        observationStart: claim.observationStart,
        observationEnd: claim.observationEnd,
        temporalPrecision: claim.temporalPrecision,
        confidence: claim.confidence,
        reviewStatus: claim.reviewStatus,
      },
    });
    addEdge({ from: articleId, to: claimId, type: 'contains', meta: { kind: claim.kind } });

    for (const reference of claim.references) {
      const refUrl = absoluteHref(reference.href);
      const refHash = sha256(refUrl).slice(0, 16);
      const refId = `reference:${refHash}`;
      const host = reference.host || hostFromHref(reference.href);
      const hostId = `host:${graphSafeId(host)}`;

      addNode({
        id: refId,
        type: 'reference',
        label: reference.label,
        url: refUrl,
        meta: {
          href: reference.href,
          host,
          kind: reference.kind,
          date: reference.date,
          dateLabel: reference.dateLabel,
          claimDate: claim.claimDate,
          observationDate: claim.observationDate,
          observationStart: claim.observationStart,
          observationEnd: claim.observationEnd,
          temporalPrecision: claim.temporalPrecision,
          sourcePublicationDate: reference.sourcePublicationDate,
          retrievedAt: reference.retrievedAt,
          indexedAt: reference.indexedAt,
        },
      });
      addNode({
        id: hostId,
        type: 'host',
        label: host,
        url: host === 'l0g.fr' ? AGENT_SITE : `https://${host}`,
        meta: {},
      });
      addEdge({ from: claimId, to: refId, type: 'cites', meta: { kind: reference.kind, dateLabel: reference.dateLabel } });
      addEdge({ from: refId, to: hostId, type: 'hostedBy' });

      for (const source of primaryInstitutions) {
        const sourceHosts = [source.url, ...source.datasets.map((dataset) => dataset.url)]
          .map((url) => hostFromHref(url))
          .filter(Boolean);
        if (sourceHosts.some((sourceHost) => host === sourceHost || host.endsWith(`.${sourceHost}`))) {
          addEdge({
            from: refId,
            to: `primarySource:${source.slug}`,
            type: 'matchesPrimarySource',
            meta: { source: source.shortName },
          });
        }
      }
    }
  }

  const nodes = [...nodeMap.values()].sort((a, b) => a.type.localeCompare(b.type) || a.id.localeCompare(b.id));
  const edges = [...edgeMap.values()].sort((a, b) => a.type.localeCompare(b.type) || a.id.localeCompare(b.id));

  return {
    schema: `${OPENAPI_SCHEMA_BASE}/EvidenceGraphSurface`,
    version: AGENT_VERSION,
    generated: generatedAt(),
    counts: {
      nodes: nodes.length,
      edges: edges.length,
      articles: nodes.filter((node) => node.type === 'article').length,
      claims: nodes.filter((node) => node.type === 'claim').length,
      references: nodes.filter((node) => node.type === 'reference').length,
      hosts: nodes.filter((node) => node.type === 'host').length,
      primarySources: nodes.filter((node) => node.type === 'primarySource').length,
      datasets: nodes.filter((node) => node.type === 'dataset').length,
    },
    graphPolicy: {
      relation: 'Graphe dérivé des relations article → claim → référence, enrichi par hôtes, sources primaires et datasets.',
      traversal:
        'Le parcours de preuve direct doit rester directionnel : article → claim → référence → hôte/source primaire → dataset. Les autres claims partageant un hôte, une source ou un dataset relèvent du contexte relié.',
      caveat: 'Extraction automatique best-effort : une arête signale une relation exploitable, pas une validation humaine exhaustive ni une preuve directe par simple hôte partagé.',
      correctionPolicy: `${AGENT_SITE}/protocole-editorial/`,
    },
    nodes,
    edges,
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
  };
}

export function buildCatalogNdjsonRows(posts: PostEntry[], guides: GuideEntry[]) {
  const catalog = buildCatalogSurface(posts, guides);
  return [
    { recordType: 'meta', version: catalog.version, counts: catalog.counts, license: catalog.license, attribution: catalog.attribution },
    ...catalog.articles.map((article) => ({ recordType: 'article', ...article })),
    ...catalog.guides.map((guide) => ({ recordType: 'guide', ...guide })),
    ...catalog.methodologies.map((methodology) => ({ recordType: 'methodology', ...methodology })),
    ...catalog.primarySources.map((source) => ({ recordType: 'primarySource', ...source })),
    ...catalog.glossary.map((term) => ({ recordType: 'glossaryTerm', ...term })),
  ];
}

export function buildClaimsNdjsonRows(posts: PostEntry[]) {
  const claimsSurface = buildClaimsSurface(posts);
  return [
    { recordType: 'meta', version: claimsSurface.version, counts: claimsSurface.counts, license: claimsSurface.license, attribution: claimsSurface.attribution },
    ...claimsSurface.claims.map((claim) => ({ recordType: 'claim', ...claim })),
  ];
}

export function buildEvidenceGraphNdjsonRows(posts: PostEntry[]) {
  const graph = buildEvidenceGraphSurface(posts);
  return [
    { recordType: 'meta', version: graph.version, counts: graph.counts, license: graph.license, attribution: graph.attribution },
    ...graph.nodes.map((node) => ({ recordType: 'node', ...node })),
    ...graph.edges.map((edge) => ({ recordType: 'edge', ...edge })),
  ];
}

export function buildChangesNdjsonRows(posts: PostEntry[], guides: GuideEntry[]) {
  const changes = buildChangefeedSurface(posts, guides);
  return [
    { recordType: 'meta', version: changes.version, counts: changes.counts, license: changes.license, attribution: changes.attribution },
    ...changes.entries.map((entry) => ({ recordType: 'change', ...entry })),
  ];
}

export function buildFreshnessSurface(posts: PostEntry[], guides: GuideEntry[], risk?: RiskSnapshotInput | null) {
  const sortedPosts = sortPosts(posts);
  const sortedGuides = sortGuides(guides);
  const latestContent = [
    ...sortedPosts.map((post) => ({ type: 'article', canonicalId: canonicalId(post, 'article'), language: contentLanguage(post), slug: post.id, title: post.data.title, url: postUrl(post), date: post.data.pubDate })),
    ...sortedGuides.map((guide) => ({ type: 'guide', canonicalId: canonicalId(guide, 'guide'), language: contentLanguage(guide), slug: guide.id, title: guide.data.title, url: guideUrl(guide), date: guide.data.updatedDate ?? guide.data.pubDate })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return {
    schema: `${OPENAPI_SCHEMA_BASE}/FreshnessSurface`,
    version: AGENT_VERSION,
    generated: generatedAt(),
    latest: latestContent.slice(0, 20).map((item) => ({
      type: item.type,
      canonicalId: item.canonicalId,
      language: item.language,
      slug: item.slug,
      title: item.title,
      url: item.url,
      date: isoDate(item.date),
    })),
    corpus: {
      articles: sortedPosts.length,
      articlesByLanguage: languageCounts(posts),
      guides: sortedGuides.length,
      guidesByLanguage: languageCounts(guides),
      methodologies: methodologyPages.length,
      glossary: glossaryEntries.length,
      primarySources: primaryInstitutions.length,
      editorialChangelog: editorialChangelog.length,
    },
    endpoints: [
      { path: '/agents.json', role: 'Manifeste de découverte agent', update: 'à chaque build' },
      { path: '/openapi.json', role: 'Contrat OpenAPI public', update: 'à chaque build' },
      { path: '/api/v1/catalog.json', role: 'Catalogue machine complet', update: 'à chaque build' },
      { path: '/api/v1/catalog.ndjson', role: 'Catalogue machine en NDJSON', update: 'à chaque build' },
      { path: '/api/v1/search-index.json', role: 'Index de recherche bilingue partagé', update: 'à chaque build' },
      { path: '/api/v1/agent-bench.json', role: 'Benchmark déterministe FR/EN de l’Agent Surface et du MCP', update: 'à chaque build publié' },
      { path: '/api/v1/claims.json', role: 'Graphe affirmation-source', update: 'à chaque build' },
      { path: '/api/v1/claims.ndjson', role: 'Claims en NDJSON', update: 'à chaque build' },
      { path: '/api/v1/evidence-graph.json', role: 'Evidence graph en nœuds et arêtes', update: 'à chaque build' },
      { path: '/api/v1/evidence-graph.ndjson', role: 'Evidence graph en NDJSON', update: 'à chaque build' },
      { path: '/api/v1/sources.json', role: 'Registre sources et hôtes cités', update: 'à chaque build' },
      { path: '/api/v1/freshness.json', role: 'Fraîcheur et derniers contenus', update: 'à chaque build' },
      { path: '/api/v1/integrity.json', role: 'Empreintes SHA-256 des surfaces M2M', update: 'à chaque build' },
      { path: '/api/v1/toolset-manifest.json', role: 'Empreintes anti-dérive des tools MCP', update: 'à chaque changement de contrat MCP' },
      { path: '/api/v1/changes.json', role: 'Changefeed machine des publications et révisions', update: 'à chaque build' },
      { path: '/api/v1/changes.ndjson', role: 'Changefeed machine en NDJSON', update: 'à chaque build' },
      { path: '/api/v1/risk-diff.json', role: 'Diff du risque : signaux, sources, claims, modèles et articles', update: 'à chaque build' },
      { path: '/api/v1/black-box.json', role: 'Boîte noire point-in-time des frames de risque rejouables', update: 'à chaque build' },
      { path: '/api/v1/debt-risk.json', role: 'Snapshot Dette US avec provenance Debt Risk Radar', update: 'à chaque build' },
      { path: '/api/v1/history.ndjson', role: 'Journal opérationnel brut à chaque assemblage', update: 'toutes les 15 minutes' },
      { path: '/api/v1/signals/current.json', role: 'Dernières observations point-in-time par instrument', update: 'à chaque build' },
      { path: '/api/v1/signals/history.json', role: 'Historique fusionné avec niveau de preuve par observation', update: 'à chaque build, journal opérationnel et archive Black Box' },
      { path: '/api/v1/signals/history.ndjson', role: 'Historique des signaux en NDJSON', update: 'à chaque build et archive append-only' },
      { path: '/api/v1/signals/history.csv', role: 'Observations de signaux à plat pour backtest', update: 'à chaque build et archive append-only' },
      { path: '/api/v1/signals/schema.json', role: 'Schéma des lignes historiques de signaux', update: 'à chaque changement de contrat' },
      { path: '/llms.txt', role: 'Carte concise pour agents', update: 'à chaque build' },
      { path: '/llms-full.txt', role: 'Corpus textuel étendu', update: 'à chaque build' },
      { path: '/llms-full-en.txt', role: 'Corpus textuel anglais étendu', update: 'à chaque build' },
    ],
    signalFreshness: buildSignalFreshness(risk),
    freshnessPolicy: {
      rule: 'Les agents doivent privilégier date/updated pour le contenu éditorial, seriesDate pour la publication des signaux, observedAt pour la date économique amont, sourcePublishedAt pour la publication du producteur, puis computedAt/generated pour la construction du fichier.',
      caveat: 'l0g.fr n’est pas un flux temps réel strict. Une valeur best effort peut être conservée : sourceStatus, qualityStatus, fallbackUsed, lastAttemptAt et lastSuccessAt priment alors sur l’horodatage global d’assemblage.',
      correctionPolicy: `${AGENT_SITE}/protocole-editorial/`,
      changelog: `${AGENT_SITE}/changelog-editorial/`,
    },
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
  };
}

export function buildAgentManifest(posts: PostEntry[], guides: GuideEntry[]) {
  return {
    schema: `${OPENAPI_SCHEMA_BASE}/AgentManifest`,
    version: AGENT_VERSION,
    name: 'l0g.fr Agent Surface',
    url: AGENT_SITE,
    generated: generatedAt(),
    description:
      'Surface statique de données, preuves et méthodes pour agents IA : articles, claims sourcées, sources primaires, glossaire, dashboards et fraîcheur.',
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
    language: 'mul',
    languages: ['fr', 'en'],
    defaultLanguage: 'fr',
    capabilities: [
      'search-ready catalog',
      'shared bilingual search index for Agent Surface, MCP and WebMCP',
      'streamable ndjson feeds',
      'claim-source graph',
      'evidence graph',
      'clickable references with explicit source dates when detected',
      'indexing timestamps on every evidence reference',
      'freshness manifest',
      'primary-source registry',
      'editorial correction policy',
      'verifiable snapshot hashes',
      'machine-readable changefeed',
      'risk diff across signals, sources, claims, models and articles',
      'black box recorder for point-in-time risk replay',
      'point-in-time signal history for backtests',
      'debt-risk current-stress coverage metadata',
      'MCP-compatible corpus',
      'user-selectable MCP research prompts',
      'deterministic bilingual Agent Bench results',
      'named, dated and methodology-versioned risk series',
    ],
    endpoints: {
      openapi: `${AGENT_SITE}/openapi.json`,
      catalog: `${AGENT_SITE}/api/v1/catalog.json`,
      catalogNdjson: `${AGENT_SITE}/api/v1/catalog.ndjson`,
      searchIndex: `${AGENT_SITE}/api/v1/search-index.json`,
      agentBench: `${AGENT_SITE}/api/v1/agent-bench.json`,
      claims: `${AGENT_SITE}/api/v1/claims.json`,
      claimsNdjson: `${AGENT_SITE}/api/v1/claims.ndjson`,
      evidenceGraph: `${AGENT_SITE}/api/v1/evidence-graph.json`,
      evidenceGraphNdjson: `${AGENT_SITE}/api/v1/evidence-graph.ndjson`,
      sources: `${AGENT_SITE}/api/v1/sources.json`,
      freshness: `${AGENT_SITE}/api/v1/freshness.json`,
      integrity: `${AGENT_SITE}/api/v1/integrity.json`,
      toolsetManifest: `${AGENT_SITE}/api/v1/toolset-manifest.json`,
      changes: `${AGENT_SITE}/api/v1/changes.json`,
      changesNdjson: `${AGENT_SITE}/api/v1/changes.ndjson`,
      riskDiff: `${AGENT_SITE}/api/v1/risk-diff.json`,
      blackBox: `${AGENT_SITE}/api/v1/black-box.json`,
      risk: `${AGENT_SITE}/api/v1/risk.json`,
      debtRisk: `${AGENT_SITE}/api/v1/debt-risk.json`,
      signalCurrent: `${AGENT_SITE}/api/v1/signals/current.json`,
      signalHistory: `${AGENT_SITE}/api/v1/signals/history.json`,
      signalHistoryNdjson: `${AGENT_SITE}/api/v1/signals/history.ndjson`,
      signalHistoryCsv: `${AGENT_SITE}/api/v1/signals/history.csv`,
      signalSeriesRegistry: `${AGENT_SITE}/series/`,
      signalSchema: `${AGENT_SITE}/api/v1/signals/schema.json`,
      llms: `${AGENT_SITE}/llms.txt`,
      llmsFull: `${AGENT_SITE}/llms-full.txt`,
      llmsFullEn: `${AGENT_SITE}/llms-full-en.txt`,
      mcpEndpoint: `${AGENT_SITE}${MCP_PUBLIC_PATH}`,
      mcpCompactEndpoint: `${AGENT_SITE}${MCP_COMPACT_PUBLIC_PATH}`,
      mcpDocumentation: `${AGENT_SITE}/mcp/`,
      docs: `${AGENT_SITE}/donnees/agents/`,
      agentBenchDocumentation: `${AGENT_SITE}/agent-bench/`,
    },
    preferredUse: [
      'Citer les URL canoniques des articles, guides ou sources.',
      'Utiliser claims.json pour relier une affirmation à une source datée quand détectable.',
      'Lire séparément claimDate, observationDate, sourcePublicationDate, retrievedAt et indexedAt.',
      'Utiliser evidence-graph.json pour parcourir articles, claims, références, hôtes, sources et datasets.',
      'Utiliser les variantes .ndjson pour ingestion streaming, pipelines RAG et traitements ligne à ligne.',
      'Utiliser freshness.json pour éviter de présenter un snapshot ancien comme temps réel.',
      'Utiliser integrity.json pour vérifier les empreintes canoniques des surfaces agent.',
      'Utiliser toolset-manifest.json pour vérifier la version et les empreintes des descriptions et schémas MCP.',
      'Consulter agent-bench.json pour les performances déterministes de recherche et de preuve de la version publiée.',
      'Utiliser changes.json pour suivre les publications et révisions sans rescanner tout le corpus.',
      'Utiliser risk-diff.json pour voir ce qui a changé dans le risque, avec limites de couverture explicites.',
      'Utiliser black-box.json pour rejouer la dernière frame point-in-time publiée avant une date donnée.',
      'Utiliser signals/history.csv ou signals/history.ndjson pour rejouer les signaux point-in-time sans look-ahead bias.',
      'Utiliser /series/ et les exports dédiés pour citer une série par son nom stable et sa version méthodologique.',
      'Utiliser debt-risk.json pour Dette US : ne pas recalculer le score courant depuis les seuls buckets disponibles.',
      'Lire les champs caveat, limits et correctionPolicy avant synthèse.',
    ],
    prohibitedUse: [
      'Présenter les scores 0-100 comme probabilités directement comparables.',
      'Renormaliser un score Dette US quand des familles de sources manquent.',
      'Supprimer l’attribution l0g.fr.',
      'Transformer une inférence ou un scénario en fait observé.',
    ],
    counts: {
      articles: posts.length,
      articlesByLanguage: languageCounts(posts),
      guides: guides.length,
      guidesByLanguage: languageCounts(guides),
      methodologies: methodologyPages.length,
      glossary: glossaryEntries.length,
      primarySources: primaryInstitutions.length,
    },
    proofPolicy: {
      claimKinds: CLAIM_KIND_ENUM,
      depthScale: editorialProtocol.proofDepthLevels,
      precisionGuard: editorialProtocol.precisionGuard,
      correctionPolicy: `${AGENT_SITE}/protocole-editorial/`,
      changelog: `${AGENT_SITE}/changelog-editorial/`,
      riskBandScaleCaveat,
    },
  };
}

export function buildChangefeedSurface(posts: PostEntry[], guides: GuideEntry[]) {
  const contentEntries = [
    ...sortPosts(posts).flatMap((post) => {
      const language = contentLanguage(post);
      const url = postUrl(post);
      const currentHash = contentVersionHash(post, 'article');
      const publishedDate = post.data.pubDate.toISOString();
      const hasRevision = Boolean(post.data.updatedDate && post.data.updatedDate.getTime() !== post.data.pubDate.getTime());
      const published = {
        id: shortRevisionId([language === 'fr' ? 'article-published' : 'article-published-en', post.id, publishedDate]),
        date: publishedDate,
        type: 'article-published',
        contentType: 'article',
        language,
        slug: post.id,
        title: post.data.title,
        url,
        changedFields: ['title', 'description', 'body', 'evidence'],
        summary: `Publication de l’analyse : ${post.data.title}.`,
        ...diffMetadata({
          contentType: 'article',
          slug: post.id,
          language,
          type: 'article-published',
          date: publishedDate,
          currentHash: hasRevision ? null : currentHash,
          changedFields: ['title', 'description', 'body', 'evidence'],
          diffStatus: hasRevision ? 'historical-version-without-hash' : 'current-only',
        }),
      };
      const revised = hasRevision
        ? (() => {
            const revisedDate = post.data.updatedDate!.toISOString();
            const changedFields = ['updatedDate', 'body', 'sources', 'evidence'];
            return [{
              id: shortRevisionId([language === 'fr' ? 'article-revised' : 'article-revised-en', post.id, revisedDate]),
              date: revisedDate,
              type: 'article-revised',
              contentType: 'article',
              language,
              slug: post.id,
              title: post.data.title,
              url,
              changedFields,
              summary: `Révision publiée pour l’analyse : ${post.data.title}.`,
              ...diffMetadata({
                contentType: 'article',
                slug: post.id,
                language,
                type: 'article-revised',
                date: revisedDate,
                currentHash,
                changedFields,
                previousVersion: publishedDate,
              }),
            }];
          })()
        : [];
      return [published, ...revised];
    }),
    ...sortGuides(guides).flatMap((guide) => {
      const language = contentLanguage(guide);
      const url = guideUrl(guide);
      const currentHash = contentVersionHash(guide, 'guide');
      const publishedDate = guide.data.pubDate.toISOString();
      const hasRevision = Boolean(guide.data.updatedDate && guide.data.updatedDate.getTime() !== guide.data.pubDate.getTime());
      const published = {
        id: shortRevisionId([language === 'fr' ? 'guide-published' : 'guide-published-en', guide.id, publishedDate]),
        date: publishedDate,
        type: 'guide-published',
        contentType: 'guide',
        language,
        slug: guide.id,
        title: guide.data.title,
        url,
        changedFields: ['title', 'description', 'body'],
        summary: `Publication du guide : ${guide.data.title}.`,
        ...diffMetadata({
          contentType: 'guide',
          slug: guide.id,
          language,
          type: 'guide-published',
          date: publishedDate,
          currentHash: hasRevision ? null : currentHash,
          changedFields: ['title', 'description', 'body'],
          diffStatus: hasRevision ? 'historical-version-without-hash' : 'current-only',
        }),
      };
      const revised = hasRevision
        ? (() => {
            const revisedDate = guide.data.updatedDate!.toISOString();
            const changedFields = ['updatedDate', 'body', 'sources'];
            return [{
              id: shortRevisionId([language === 'fr' ? 'guide-revised' : 'guide-revised-en', guide.id, revisedDate]),
              date: revisedDate,
              type: 'guide-revised',
              contentType: 'guide',
              language,
              slug: guide.id,
              title: guide.data.title,
              url,
              changedFields,
              summary: `Révision publiée pour le guide : ${guide.data.title}.`,
              ...diffMetadata({
                contentType: 'guide',
                slug: guide.id,
                language,
                type: 'guide-revised',
                date: revisedDate,
                currentHash,
                changedFields,
                previousVersion: publishedDate,
              }),
            }];
          })()
        : [];
      return [published, ...revised];
    }),
  ];

  const editorialEntries = editorialChangelog.map((entry) => {
    const date = `${entry.date}T00:00:00.000Z`;
    const slug = `${entry.date}-${entry.kind}`;
    const changedFields = ['protocol', 'methodology', 'source-policy'];
    return {
      id: shortRevisionId(['editorial-change', entry.date, entry.kind, entry.title]),
      date,
      type: 'editorial-change',
      contentType: 'policy',
      language: 'fr' as const,
      slug,
      title: entry.title,
      url: `${AGENT_SITE}/changelog-editorial/`,
      changedFields,
      summary: entry.summary,
      ...diffMetadata({
        contentType: 'policy',
        slug,
        language: 'fr',
        type: 'editorial-change',
        date,
        currentHash: editorialVersionHash(entry),
        changedFields,
      }),
    };
  });

  const entries = [...contentEntries, ...editorialEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || a.id.localeCompare(b.id));

  return {
    schema: `${OPENAPI_SCHEMA_BASE}/ChangefeedSurface`,
    version: AGENT_VERSION,
    generated: generatedAt(),
    counts: {
      entries: entries.length,
      articles: posts.length,
      articlesByLanguage: languageCounts(posts),
      guides: guides.length,
      guidesByLanguage: languageCounts(guides),
      editorialChanges: editorialEntries.length,
    },
    feedPolicy: {
      scope: 'Publications, révisions déclarées par updatedDate et changements éditoriaux structurants.',
      diffModel:
        'Chaque entrée expose objectId, version courante, hash courant et, si disponible, version remplacée. Les hashes antérieurs restent null tant qu’aucun snapshot historique canonique n’est publié.',
      caveat: 'Le changefeed signale les changements publiés ; il ne remplace pas l’historique Git ligne à ligne.',
      correctionPolicy: `${AGENT_SITE}/protocole-editorial/`,
      changelog: `${AGENT_SITE}/changelog-editorial/`,
    },
    entries,
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
  };
}

export function buildIntegritySurface(posts: PostEntry[], guides: GuideEntry[]) {
  const signalHistory = buildSignalHistorySurface();
  const signalSeriesResources = signalSeriesRegistry().flatMap((series) => [
    {
      path: `/api/v1/signals/${series.slug}/history.json`,
      role: `Série ${series.name} en JSON`,
      mediaType: 'application/json',
      payload: buildSignalSeriesSurface(series.key),
    },
    {
      path: `/api/v1/signals/${series.slug}/history.ndjson`,
      role: `Série ${series.name} en NDJSON`,
      mediaType: 'application/x-ndjson',
      body: toNdjson(buildSignalHistoryNdjsonRows(series.key)),
    },
    {
      path: `/api/v1/signals/${series.slug}/history.csv`,
      role: `Série ${series.name} en CSV`,
      mediaType: 'text/csv',
      body: buildSignalHistoryCsv(series.key),
    },
  ]);
  const resources = [
    {
      path: '/agents.json',
      role: 'Manifeste de découverte agent',
      mediaType: 'application/json',
      payload: buildAgentManifest(posts, guides),
    },
    {
      path: '/openapi.json',
      role: 'Contrat OpenAPI public',
      mediaType: 'application/json',
      payload: buildOpenApiContract(),
    },
    {
      path: '/api/v1/toolset-manifest.json',
      role: 'Contrat anti-dérive des tools MCP',
      mediaType: 'application/json',
      payload: toolsetManifest,
    },
    {
      path: '/api/v1/catalog.json',
      role: 'Catalogue machine complet',
      mediaType: 'application/json',
      payload: buildCatalogSurface(posts, guides),
    },
    {
      path: '/api/v1/catalog.ndjson',
      role: 'Catalogue machine en NDJSON',
      mediaType: 'application/x-ndjson',
      body: toNdjson(buildCatalogNdjsonRows(posts, guides)),
    },
    {
      path: '/api/v1/search-index.json',
      role: 'Index de recherche bilingue partagé',
      mediaType: 'application/json',
      payload: buildSearchIndexSurface(posts, guides),
    },
    {
      path: '/api/v1/claims.json',
      role: 'Graphe affirmation-source',
      mediaType: 'application/json',
      payload: buildClaimsSurface(posts),
    },
    {
      path: '/api/v1/claims.ndjson',
      role: 'Claims en NDJSON',
      mediaType: 'application/x-ndjson',
      body: toNdjson(buildClaimsNdjsonRows(posts)),
    },
    {
      path: '/api/v1/evidence-graph.json',
      role: 'Evidence graph',
      mediaType: 'application/json',
      payload: buildEvidenceGraphSurface(posts),
    },
    {
      path: '/api/v1/evidence-graph.ndjson',
      role: 'Evidence graph en NDJSON',
      mediaType: 'application/x-ndjson',
      body: toNdjson(buildEvidenceGraphNdjsonRows(posts)),
    },
    {
      path: '/api/v1/sources.json',
      role: 'Registre sources et hôtes cités',
      mediaType: 'application/json',
      payload: buildSourcesSurface(posts),
    },
    {
      path: '/api/v1/freshness.json',
      role: 'Fraîcheur corpus',
      mediaType: 'application/json',
      payload: buildFreshnessSurface(posts, guides),
    },
    {
      path: '/api/v1/changes.json',
      role: 'Changefeed machine',
      mediaType: 'application/json',
      payload: buildChangefeedSurface(posts, guides),
    },
    {
      path: '/api/v1/changes.ndjson',
      role: 'Changefeed machine en NDJSON',
      mediaType: 'application/x-ndjson',
      body: toNdjson(buildChangesNdjsonRows(posts, guides)),
    },
    {
      path: '/api/v1/signals/current.json',
      role: 'Dernières observations point-in-time par instrument',
      mediaType: 'application/json',
      payload: {
        schema: `${AGENT_SITE}/api/v1/signals/schema.json`,
        version: signalHistory.version,
        generated: signalHistory.generated,
        coverage: signalHistory.coverage,
        current: signalHistory.current,
        policy: signalHistory.policy,
      },
    },
    {
      path: '/api/v1/signals/history.json',
      role: 'Historique des signaux',
      mediaType: 'application/json',
      payload: signalHistory,
    },
    {
      path: '/api/v1/signals/history.ndjson',
      role: 'Historique des signaux en NDJSON',
      mediaType: 'application/x-ndjson',
      body: toNdjson(buildSignalHistoryNdjsonRows()),
    },
    {
      path: '/api/v1/signals/history.csv',
      role: 'Historique des signaux en CSV',
      mediaType: 'text/csv',
      body: buildSignalHistoryCsv(),
    },
    {
      path: '/api/v1/signals/schema.json',
      role: 'Schéma historique des signaux',
      mediaType: 'application/json',
      payload: buildSignalSchemaSurface(),
    },
    ...signalSeriesResources,
  ];

  const snapshots = resources.map((resource) => {
    const canonical = 'body' in resource && typeof resource.body === 'string'
      ? resource.body
      : canonicalJson('payload' in resource ? resource.payload : null);
    return {
      path: resource.path,
      url: `${AGENT_SITE}${resource.path}`,
      role: resource.role,
      mediaType: resource.mediaType,
      canonicalSha256: sha256(canonical),
      canonicalBytes: Buffer.byteLength(canonical, 'utf8'),
    };
  });

  return {
    schema: `${OPENAPI_SCHEMA_BASE}/IntegritySurface`,
    version: AGENT_VERSION,
    generated: generatedAt(),
    algorithm: 'sha-256',
    canonicalization: {
      format: 'JSON stable : clés triées récursivement, sans espaces, champ generated ignoré.',
      ndjson: 'NDJSON : lignes JSON dans l’ordre publié, séparées par LF, avec LF final ; les lignes meta NDJSON n’incluent pas generated.',
      omittedFields: ['generated'],
      reason: 'Le champ generated varie à chaque build ; les empreintes visent le contenu utile du snapshot.',
    },
    counts: {
      snapshots: snapshots.length,
      articles: posts.length,
      guides: guides.length,
    },
    snapshots,
    verification: {
      rule: 'Récupérer le JSON, supprimer récursivement les champs generated, trier les clés, sérialiser sans espaces, puis calculer SHA-256.',
      caveat: 'Ces empreintes vérifient les surfaces Agent Surface ; les fichiers externes conservent leur propre politique de version.',
    },
    externalAuthenticity: {
      status: 'github-sigstore-attestation-configured',
      mechanism: 'GitHub Artifact Attestations / Sigstore, émises par le workflow de build avec OIDC GitHub Actions.',
      subjects: ['/agents.json', '/openapi.json', '/api/v1/integrity.json', '/api/v1/toolset-manifest.json'],
      currentGuarantee:
        'Les hashes publiés sur l0g.fr vérifient la cohérence canonique des artefacts servis ; le workflow GitHub signe extérieurement les manifests principaux par attestation Sigstore.',
      missingGuarantee:
        'Une copie locale construite hors CI peut ne pas avoir d’attestation distante ; l’attestation doit être vérifiée côté GitHub pour le commit publié.',
      verification:
        'Vérifier les attestations GitHub du commit publié sur le dépôt bluetouff/l0g pour les sujets /agents.json, /openapi.json, /api/v1/integrity.json et /api/v1/toolset-manifest.json, puis comparer les SHA-256 canoniques exposés.',
      recommendedNextSteps: [
        'Publier un lien de vérification des attestations depuis la page données.',
        'Étendre l’attestation à tous les snapshots JSON et NDJSON si le volume reste acceptable.',
        'Publier périodiquement les empreintes dans un canal social vérifié.',
      ],
    },
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
  };
}
