import type { CollectionEntry } from 'astro:content';
import { editorialChangelog, editorialProtocol } from '../config/editorial.ts';
import { glossaryEntries } from '../config/glossary.ts';
import { methodologyPages, riskBandScaleCaveat } from '../config/methodology.ts';
import { primaryInstitutions } from '../config/primary-sources.ts';
import { postMatchesTopic, topics } from '../config/topics.ts';
import { buildArticleEvidence } from './article-evidence.ts';

export const AGENT_SITE = 'https://l0g.fr';
export const AGENT_VERSION = '1.0.0';
const OPENAPI_SCHEMA_BASE = `${AGENT_SITE}/openapi.json#/components/schemas`;

export type PostEntry = CollectionEntry<'posts'>;
export type GuideEntry = CollectionEntry<'guides'>;

export function jsonResponse(payload: unknown) {
  return new Response(JSON.stringify(payload, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export function isoDate(value?: Date) {
  return value ? value.toISOString().slice(0, 10) : null;
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
    generated: new Date().toISOString(),
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
    generated: new Date().toISOString(),
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
    generated: new Date().toISOString(),
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
      { path: '/api/v1/claims.json', role: 'Graphe affirmation-source', update: 'à chaque build' },
      { path: '/api/v1/sources.json', role: 'Registre sources et hôtes cités', update: 'à chaque build' },
      { path: '/api/v1/freshness.json', role: 'Fraîcheur et derniers contenus', update: 'à chaque build' },
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
    generated: new Date().toISOString(),
    description:
      'Surface statique de données, preuves et méthodes pour agents IA : articles, claims sourcées, sources primaires, glossaire, dashboards et fraîcheur.',
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
    language: 'fr',
    capabilities: [
      'search-ready catalog',
      'claim-source graph',
      'dated clickable references',
      'freshness manifest',
      'primary-source registry',
      'editorial correction policy',
      'MCP-compatible corpus',
    ],
    endpoints: {
      openapi: `${AGENT_SITE}/openapi.json`,
      catalog: `${AGENT_SITE}/api/v1/catalog.json`,
      claims: `${AGENT_SITE}/api/v1/claims.json`,
      sources: `${AGENT_SITE}/api/v1/sources.json`,
      freshness: `${AGENT_SITE}/api/v1/freshness.json`,
      risk: `${AGENT_SITE}/api/v1/risk.json`,
      llms: `${AGENT_SITE}/llms.txt`,
      llmsFull: `${AGENT_SITE}/llms-full.txt`,
      mcp: `${AGENT_SITE}/mcp`,
      docs: `${AGENT_SITE}/donnees/agents/`,
    },
    preferredUse: [
      'Citer les URL canoniques des articles, guides ou sources.',
      'Utiliser claims.json pour relier une affirmation à une source datée.',
      'Utiliser freshness.json pour éviter de présenter un snapshot ancien comme temps réel.',
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
