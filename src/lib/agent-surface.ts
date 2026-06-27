import type { CollectionEntry } from 'astro:content';
import { createHash } from 'node:crypto';
import { editorialChangelog, editorialProtocol } from '../config/editorial.ts';
import { glossaryEntries, glossarySections } from '../config/glossary.ts';
import { methodologyPages, riskBandScaleCaveat } from '../config/methodology.ts';
import { primaryInstitutions } from '../config/primary-sources.ts';
import { postMatchesTopic, topics } from '../config/topics.ts';
import { buildArticleEvidence } from './article-evidence.ts';

export const AGENT_SITE = 'https://l0g.fr';
export const AGENT_VERSION = '1.2.0';
export const AGENT_GENERATED_AT = new Date().toISOString();
const OPENAPI_SCHEMA_BASE = `${AGENT_SITE}/openapi.json#/components/schemas`;

export type PostEntry = CollectionEntry<'posts'>;
export type GuideEntry = CollectionEntry<'guides'>;

export function jsonResponse(payload: unknown) {
  return new Response(JSON.stringify(payload, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export function toNdjson(rows: unknown[]) {
  return rows.map((row) => JSON.stringify(row)).join('\n') + '\n';
}

export function ndjsonResponse(rows: unknown[]) {
  return new Response(toNdjson(rows), {
    headers: { 'Content-Type': 'application/x-ndjson; charset=utf-8' },
  });
}

export function generatedAt() {
  return AGENT_GENERATED_AT;
}

export function isoDate(value?: Date) {
  return value ? value.toISOString().slice(0, 10) : null;
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
      '/api/v1/claims.json': openApiEndpoint('Graphe affirmation-source', 'Affirmations typées reliées à des références cliquables et datées.', 'ClaimsSurface'),
      '/api/v1/claims.ndjson': openApiNdjsonEndpoint('Claims NDJSON', 'Claims en lignes NDJSON, une affirmation typée par ligne avec références.'),
      '/api/v1/evidence-graph.json': openApiEndpoint('Evidence graph', 'Graphe articles, claims, références, hôtes, institutions et datasets, exprimé en nœuds et arêtes.', 'EvidenceGraphSurface'),
      '/api/v1/evidence-graph.ndjson': openApiNdjsonEndpoint('Evidence graph NDJSON', 'Evidence graph en lignes NDJSON : nœuds puis arêtes, pour ingestion streaming.'),
      '/api/v1/sources.json': openApiEndpoint('Registre sources', 'Sources primaires institutionnelles, hôtes cités, règles de citation et limites.', 'SourcesSurface'),
      '/api/v1/freshness.json': openApiEndpoint('Fraîcheur', 'Derniers contenus, compteurs de corpus, endpoints et politique de fraîcheur.', 'FreshnessSurface'),
      '/api/v1/integrity.json': openApiEndpoint('Intégrité', 'Empreintes SHA-256 canoniques des surfaces Agent Surface pour vérification de snapshot.', 'IntegritySurface'),
      '/api/v1/changes.json': openApiEndpoint('Changefeed', 'Flux machine des publications, révisions déclarées et changements éditoriaux structurants.', 'ChangefeedSurface'),
      '/api/v1/changes.ndjson': openApiNdjsonEndpoint('Changefeed NDJSON', 'Changefeed machine en lignes NDJSON, une publication ou révision par ligne.'),
      '/api/v1/risk.json': openApiEndpoint('Signaux de risque', 'Snapshots des dashboards de risque et caveats de normalisation.', 'RiskSnapshot'),
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
    },
    components: {
      schemas: {
        EvidenceReference: {
          type: 'object',
          required: ['label', 'href', 'dateLabel'],
          properties: {
            label: { type: 'string' },
            href: { type: 'string' },
            host: { type: ['string', 'null'] },
            kind: { type: ['string', 'null'] },
            date: { type: ['string', 'null'], format: 'date' },
            dateLabel: { type: 'string' },
          },
        },
        Claim: {
          type: 'object',
          required: ['id', 'articleSlug', 'kind', 'claim', 'dateLabel', 'references'],
          properties: {
            id: { type: 'string' },
            localId: { type: 'string' },
            articleSlug: { type: 'string' },
            articleUrl: { type: 'string', format: 'uri' },
            articleTitle: { type: 'string' },
            kind: { enum: ['fait', 'estimation', 'inférence', 'scénario'] },
            claim: { type: 'string' },
            date: { type: ['string', 'null'], format: 'date' },
            dateLabel: { type: 'string' },
            confidence: { enum: ['auto-backfill', 'structurée'] },
            references: { type: 'array', items: { $ref: '#/components/schemas/EvidenceReference' } },
          },
        },
        AgentManifest: { type: 'object', additionalProperties: true },
        Catalog: { type: 'object', additionalProperties: true },
        ClaimsSurface: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'counts', 'claims', 'references'],
          properties: {
            schema: { type: 'string' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            counts: { type: 'object', additionalProperties: true },
            policy: { type: 'object', additionalProperties: true },
            claims: { type: 'array', items: { $ref: '#/components/schemas/Claim' } },
            references: { type: 'array', items: { type: 'object', additionalProperties: true } },
          },
        },
        SourcesSurface: { type: 'object', additionalProperties: true },
        EvidenceGraphNode: {
          type: 'object',
          required: ['id', 'type', 'label'],
          properties: {
            id: { type: 'string' },
            type: { enum: ['article', 'claim', 'reference', 'host', 'primarySource', 'dataset'] },
            label: { type: 'string' },
            url: { type: ['string', 'null'] },
            meta: { type: 'object', additionalProperties: true },
          },
        },
        EvidenceGraphEdge: {
          type: 'object',
          required: ['id', 'from', 'to', 'type'],
          properties: {
            id: { type: 'string' },
            from: { type: 'string' },
            to: { type: 'string' },
            type: { enum: ['contains', 'cites', 'hostedBy', 'matchesPrimarySource', 'providesDataset'] },
            meta: { type: 'object', additionalProperties: true },
          },
        },
        EvidenceGraphSurface: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'counts', 'nodes', 'edges'],
          properties: {
            schema: { type: 'string' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            counts: { type: 'object', additionalProperties: true },
            graphPolicy: { type: 'object', additionalProperties: true },
            nodes: { type: 'array', items: { $ref: '#/components/schemas/EvidenceGraphNode' } },
            edges: { type: 'array', items: { $ref: '#/components/schemas/EvidenceGraphEdge' } },
          },
        },
        FreshnessSurface: { type: 'object', additionalProperties: true },
        IntegritySurface: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'algorithm', 'canonicalization', 'snapshots'],
          properties: {
            schema: { type: 'string' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            algorithm: { const: 'sha-256' },
            canonicalization: { type: 'object', additionalProperties: true },
            snapshots: {
              type: 'array',
              items: {
                type: 'object',
                required: ['path', 'url', 'canonicalSha256'],
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
        ChangefeedSurface: {
          type: 'object',
          required: ['schema', 'version', 'generated', 'counts', 'entries'],
          properties: {
            schema: { type: 'string' },
            version: { type: 'string' },
            generated: { type: 'string', format: 'date-time' },
            counts: { type: 'object', additionalProperties: true },
            feedPolicy: { type: 'object', additionalProperties: true },
            entries: {
              type: 'array',
              items: {
                type: 'object',
                required: ['id', 'date', 'type', 'contentType', 'slug', 'title', 'url', 'changedFields', 'summary'],
                properties: {
                  id: { type: 'string' },
                  date: { type: 'string', format: 'date-time' },
                  type: { enum: ['article-published', 'article-revised', 'guide-published', 'guide-revised', 'editorial-change'] },
                  contentType: { enum: ['article', 'guide', 'policy'] },
                  slug: { type: 'string' },
                  title: { type: 'string' },
                  url: { type: 'string', format: 'uri' },
                  changedFields: { type: 'array', items: { type: 'string' } },
                  summary: { type: 'string' },
                },
              },
            },
          },
        },
        RiskSnapshot: { type: 'object', additionalProperties: true },
      },
    },
  };
}

export function postUrl(post: PostEntry) {
  return `${AGENT_SITE}/posts/${post.id}/`;
}

export function guideUrl(guide: GuideEntry) {
  return `${AGENT_SITE}/guides/${guide.id}/`;
}

export function sortPosts(posts: PostEntry[]) {
  return [...posts].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function sortGuides(guides: GuideEntry[]) {
  return [...guides].sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());
}

export function buildArticleEvidenceRecord(post: PostEntry, opts: { globalClaimIds?: boolean } = {}) {
  const evidence = buildArticleEvidence(post.body ?? '', {
    published: post.data.pubDate,
    updated: post.data.updatedDate,
    url: postUrl(post),
    title: post.data.title,
  });

  return {
    claims: evidence.claims.map((claim) => ({
      id: opts.globalClaimIds ? `${post.id}:${claim.id}` : claim.id,
      localId: claim.id,
      articleSlug: post.id,
      articleUrl: postUrl(post),
      articleTitle: post.data.title,
      kind: claim.kind,
      claim: claim.claim,
      date: claim.dateIso ?? null,
      dateLabel: claim.dateLabel,
      confidence: claim.confidence,
      references: claim.references.map((ref) => ({
        label: ref.label,
        href: ref.href,
        host: ref.host ?? null,
        kind: ref.kind ?? null,
        date: ref.dateIso ?? claim.dateIso ?? null,
        dateLabel: ref.dateLabel ?? claim.dateLabel,
      })),
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

export function buildArticleRecord(post: PostEntry) {
  return {
    slug: post.id,
    url: postUrl(post),
    title: post.data.title,
    date: isoDate(post.data.pubDate),
    updated: isoDate(post.data.updatedDate),
    description: post.data.description,
    tags: post.data.tags ?? [],
    topics: topics.filter((topic) => postMatchesTopic(post.data.tags ?? [], topic)).map((topic) => topic.slug),
    evidence: buildArticleEvidenceRecord(post),
    revisions: {
      published: isoDate(post.data.pubDate),
      updated: isoDate(post.data.updatedDate),
      policy: `${AGENT_SITE}/protocole-editorial/`,
      changelog: `${AGENT_SITE}/changelog-editorial/`,
    },
  };
}

export function buildGuideRecord(guide: GuideEntry) {
  return {
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
  const articles = sortPosts(posts).map(buildArticleRecord);
  const sortedGuides = sortGuides(guides).map(buildGuideRecord);

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
      guides: sortedGuides.length,
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
    note: 'Catalogue best-effort. Le texte complet des analyses est servi par les pages /posts/.',
  };
}

export function buildClaimsSurface(posts: PostEntry[]) {
  const articles = sortPosts(posts).map((post) => ({
    ...buildArticleRecord(post),
    evidence: buildArticleEvidenceRecord(post, { globalClaimIds: true }),
  }));
  const claims = articles.flatMap((article) => article.evidence.claims);
  const references = claims.flatMap((claim) => claim.references.map((reference) => ({
    claimId: claim.id,
    articleSlug: claim.articleSlug,
    label: reference.label,
    href: reference.href,
    host: reference.host,
    kind: reference.kind,
    date: reference.date,
    dateLabel: reference.dateLabel,
  })));

  return {
    schema: `${OPENAPI_SCHEMA_BASE}/ClaimsSurface`,
    version: AGENT_VERSION,
    generated: generatedAt(),
    counts: {
      articles: articles.length,
      claims: claims.length,
      references: references.length,
      claimKinds: [...new Set(claims.map((claim) => claim.kind))].sort(),
    },
    policy: {
      relation: 'Chaque entrée relie une affirmation textuelle à une ou plusieurs références cliquables et datées.',
      caveat: 'Extraction automatique best-effort : la relation exacte doit rester vérifiable dans la page source.',
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
    current.articles.add(ref.articleSlug);
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
    const articleId = `article:${claim.articleSlug}`;
    const claimId = `claim:${claim.id}`;
    addNode({
      id: articleId,
      type: 'article',
      label: claim.articleTitle,
      url: claim.articleUrl,
      meta: {
        slug: claim.articleSlug,
      },
    });
    addNode({
      id: claimId,
      type: 'claim',
      label: claim.claim,
      url: `${claim.articleUrl}#${claim.localId}`,
      meta: {
        localId: claim.localId,
        articleSlug: claim.articleSlug,
        kind: claim.kind,
        date: claim.date,
        dateLabel: claim.dateLabel,
        confidence: claim.confidence,
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
      caveat: 'Extraction automatique best-effort : une arête signale une relation exploitable, pas une validation humaine exhaustive.',
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

export function buildFreshnessSurface(posts: PostEntry[], guides: GuideEntry[]) {
  const sortedPosts = sortPosts(posts);
  const sortedGuides = sortGuides(guides);
  const latestContent = [
    ...sortedPosts.map((post) => ({ type: 'article', slug: post.id, title: post.data.title, url: postUrl(post), date: post.data.pubDate })),
    ...sortedGuides.map((guide) => ({ type: 'guide', slug: guide.id, title: guide.data.title, url: guideUrl(guide), date: guide.data.updatedDate ?? guide.data.pubDate })),
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  return {
    schema: `${OPENAPI_SCHEMA_BASE}/FreshnessSurface`,
    version: AGENT_VERSION,
    generated: generatedAt(),
    latest: latestContent.slice(0, 20).map((item) => ({
      type: item.type,
      slug: item.slug,
      title: item.title,
      url: item.url,
      date: isoDate(item.date),
    })),
    corpus: {
      articles: sortedPosts.length,
      guides: sortedGuides.length,
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
      { path: '/api/v1/claims.json', role: 'Graphe affirmation-source', update: 'à chaque build' },
      { path: '/api/v1/claims.ndjson', role: 'Claims en NDJSON', update: 'à chaque build' },
      { path: '/api/v1/evidence-graph.json', role: 'Evidence graph en nœuds et arêtes', update: 'à chaque build' },
      { path: '/api/v1/evidence-graph.ndjson', role: 'Evidence graph en NDJSON', update: 'à chaque build' },
      { path: '/api/v1/sources.json', role: 'Registre sources et hôtes cités', update: 'à chaque build' },
      { path: '/api/v1/freshness.json', role: 'Fraîcheur et derniers contenus', update: 'à chaque build' },
      { path: '/api/v1/integrity.json', role: 'Empreintes SHA-256 des surfaces M2M', update: 'à chaque build' },
      { path: '/api/v1/changes.json', role: 'Changefeed machine des publications et révisions', update: 'à chaque build' },
      { path: '/api/v1/changes.ndjson', role: 'Changefeed machine en NDJSON', update: 'à chaque build' },
      { path: '/llms.txt', role: 'Carte concise pour agents', update: 'à chaque build' },
      { path: '/llms-full.txt', role: 'Corpus textuel étendu', update: 'à chaque build' },
    ],
    freshnessPolicy: {
      rule: 'Les agents doivent privilégier le champ date ou updated du contenu, puis generated pour la fraîcheur du fichier.',
      caveat: 'l0g.fr n’est pas un flux temps réel strict ; les snapshots indiquent leur date utile.',
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
    language: 'fr',
    capabilities: [
      'search-ready catalog',
      'streamable ndjson feeds',
      'claim-source graph',
      'evidence graph',
      'dated clickable references',
      'freshness manifest',
      'primary-source registry',
      'editorial correction policy',
      'verifiable snapshot hashes',
      'machine-readable changefeed',
      'MCP-compatible corpus',
    ],
    endpoints: {
      openapi: `${AGENT_SITE}/openapi.json`,
      catalog: `${AGENT_SITE}/api/v1/catalog.json`,
      catalogNdjson: `${AGENT_SITE}/api/v1/catalog.ndjson`,
      claims: `${AGENT_SITE}/api/v1/claims.json`,
      claimsNdjson: `${AGENT_SITE}/api/v1/claims.ndjson`,
      evidenceGraph: `${AGENT_SITE}/api/v1/evidence-graph.json`,
      evidenceGraphNdjson: `${AGENT_SITE}/api/v1/evidence-graph.ndjson`,
      sources: `${AGENT_SITE}/api/v1/sources.json`,
      freshness: `${AGENT_SITE}/api/v1/freshness.json`,
      integrity: `${AGENT_SITE}/api/v1/integrity.json`,
      changes: `${AGENT_SITE}/api/v1/changes.json`,
      changesNdjson: `${AGENT_SITE}/api/v1/changes.ndjson`,
      risk: `${AGENT_SITE}/api/v1/risk.json`,
      llms: `${AGENT_SITE}/llms.txt`,
      llmsFull: `${AGENT_SITE}/llms-full.txt`,
      mcp: `${AGENT_SITE}/mcp`,
      docs: `${AGENT_SITE}/donnees/agents/`,
    },
    preferredUse: [
      'Citer les URL canoniques des articles, guides ou sources.',
      'Utiliser claims.json pour relier une affirmation à une source datée.',
      'Utiliser evidence-graph.json pour parcourir articles, claims, références, hôtes, sources et datasets.',
      'Utiliser les variantes .ndjson pour ingestion streaming, pipelines RAG et traitements ligne à ligne.',
      'Utiliser freshness.json pour éviter de présenter un snapshot ancien comme temps réel.',
      'Utiliser integrity.json pour vérifier les empreintes canoniques des surfaces agent.',
      'Utiliser changes.json pour suivre les publications et révisions sans rescanner tout le corpus.',
      'Lire les champs caveat, limits et correctionPolicy avant synthèse.',
    ],
    prohibitedUse: [
      'Présenter les scores 0-100 comme probabilités directement comparables.',
      'Supprimer l’attribution l0g.fr.',
      'Transformer une inférence ou un scénario en fait observé.',
    ],
    counts: {
      articles: posts.length,
      guides: guides.length,
      methodologies: methodologyPages.length,
      glossary: glossaryEntries.length,
      primarySources: primaryInstitutions.length,
    },
    proofPolicy: {
      claimKinds: ['fait', 'estimation', 'inférence', 'scénario'],
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
      const url = postUrl(post);
      const published = {
        id: shortRevisionId(['article-published', post.id, post.data.pubDate.toISOString()]),
        date: post.data.pubDate.toISOString(),
        type: 'article-published',
        contentType: 'article',
        slug: post.id,
        title: post.data.title,
        url,
        changedFields: ['title', 'description', 'body', 'evidence'],
        summary: `Publication de l’analyse : ${post.data.title}.`,
      };
      const revised = post.data.updatedDate && post.data.updatedDate.getTime() !== post.data.pubDate.getTime()
        ? [{
            id: shortRevisionId(['article-revised', post.id, post.data.updatedDate.toISOString()]),
            date: post.data.updatedDate.toISOString(),
            type: 'article-revised',
            contentType: 'article',
            slug: post.id,
            title: post.data.title,
            url,
            changedFields: ['updatedDate', 'body', 'sources', 'evidence'],
            summary: `Révision publiée pour l’analyse : ${post.data.title}.`,
          }]
        : [];
      return [published, ...revised];
    }),
    ...sortGuides(guides).flatMap((guide) => {
      const url = guideUrl(guide);
      const published = {
        id: shortRevisionId(['guide-published', guide.id, guide.data.pubDate.toISOString()]),
        date: guide.data.pubDate.toISOString(),
        type: 'guide-published',
        contentType: 'guide',
        slug: guide.id,
        title: guide.data.title,
        url,
        changedFields: ['title', 'description', 'body'],
        summary: `Publication du guide : ${guide.data.title}.`,
      };
      const revised = guide.data.updatedDate && guide.data.updatedDate.getTime() !== guide.data.pubDate.getTime()
        ? [{
            id: shortRevisionId(['guide-revised', guide.id, guide.data.updatedDate.toISOString()]),
            date: guide.data.updatedDate.toISOString(),
            type: 'guide-revised',
            contentType: 'guide',
            slug: guide.id,
            title: guide.data.title,
            url,
            changedFields: ['updatedDate', 'body', 'sources'],
            summary: `Révision publiée pour le guide : ${guide.data.title}.`,
          }]
        : [];
      return [published, ...revised];
    }),
  ];

  const editorialEntries = editorialChangelog.map((entry) => ({
    id: shortRevisionId(['editorial-change', entry.date, entry.kind, entry.title]),
    date: `${entry.date}T00:00:00.000Z`,
    type: 'editorial-change',
    contentType: 'policy',
    slug: `${entry.date}-${entry.kind}`,
    title: entry.title,
    url: `${AGENT_SITE}/changelog-editorial/`,
    changedFields: ['protocol', 'methodology', 'source-policy'],
    summary: entry.summary,
  }));

  const entries = [...contentEntries, ...editorialEntries]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || a.id.localeCompare(b.id));

  return {
    schema: `${OPENAPI_SCHEMA_BASE}/ChangefeedSurface`,
    version: AGENT_VERSION,
    generated: generatedAt(),
    counts: {
      entries: entries.length,
      articles: posts.length,
      guides: guides.length,
      editorialChanges: editorialEntries.length,
    },
    feedPolicy: {
      scope: 'Publications, révisions déclarées par updatedDate et changements éditoriaux structurants.',
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
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
  };
}
