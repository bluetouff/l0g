import {
  primaryInstitutions,
  type PrimarySourceInstitution,
} from '../config/primary-sources.ts';
import { claimReviewById } from '../config/claim-reviews.ts';

export interface EvidenceLink {
  label: string;
  href: string;
  host?: string;
  kind?: string;
  dateLabel?: string;
  dateIso?: string;
  sourcePublicationDateLabel?: string;
  sourcePublicationDateIso?: string;
  retrievedAt?: string | null;
}

export interface PrimaryEvidence {
  source: PrimarySourceInstitution;
  reason: 'source-liée';
  links: EvidenceLink[];
}

export type ClaimKind = 'fait' | 'estimation' | 'inférence' | 'scénario' | 'unclassified-assertion';

export interface ClaimEvidence {
  id: string;
  kind: ClaimKind;
  claim: string;
  dateLabel: string;
  dateIso?: string;
  claimDateLabel: string;
  claimDateIso?: string;
  observationDateLabel: string;
  observationDateIso?: string;
  references: EvidenceLink[];
  confidence: 'auto-backfill' | 'structurée';
  reviewStatus: 'unreviewed' | 'reviewed';
  reviewedAt?: string | null;
  reviewedBy?: string | null;
  reviewNote?: string | null;
  reviewedProofDepth?: Extract<EvidenceDepth['id'], 'direct-proof' | 'reproduction'> | null;
  classifier: {
    method: 'lexical-heuristic-v1';
    matchedRule: string;
    caveat: string;
    reviewedOverride?: string;
  };
}

export interface EvidenceDepth {
  id: 'mention' | 'reference' | 'linked-source' | 'direct-proof' | 'reproduction';
  label: string;
  detail: string;
  score: 1 | 2 | 3 | 4 | 5;
  automated: boolean;
}

export interface ArticleEvidence {
  badges: EvidenceBadge[];
  depth: EvidenceDepth;
  claims: ClaimEvidence[];
  primary: PrimaryEvidence[];
  secondary: EvidenceLink[];
  internalData: EvidenceLink[];
  context: EvidenceLink[];
  stats: {
    externalLinks: number;
    internalLinks: number;
    primarySources: number;
    claimRelations: number;
  };
}

interface ArticleEvidenceOptions {
  published?: Date;
  updated?: Date;
  url?: string;
  title?: string;
  articleSlug?: string;
}

export interface EvidenceBadge {
  id: 'primary-source' | 'public-data' | 'secondary-source' | 'scenario' | 'internal-context';
  label: string;
  detail: string;
  tone: 'strong' | 'data' | 'secondary' | 'scenario' | 'context';
}

const SITE_HOSTS = new Set(['l0g.fr', 'www.l0g.fr']);
const DASHBOARD_HOSTS = new Map([
  ['13flow.eu', '13FLOW'],
  ['us.l0g.fr', 'US Macro'],
  ['euro.l0g.fr', 'Euro Macro'],
  ['energie.l0g.fr', 'Énergie'],
  ['yct.l0g.fr', 'Yen Carry'],
]);
const EVIDENCE_RETRIEVED_AT = new Date().toISOString();

function cleanLabel(value: string | undefined, fallback: string) {
  return String(value || fallback)
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 90);
}

function hostOf(href: string) {
  try {
    return new URL(href, 'https://l0g.fr').hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

function isSameOrSubHost(host: string, base: string) {
  return host === base || host.endsWith(`.${base}`);
}

function normalizeHref(raw: string) {
  return raw
    .trim()
    .replace(/^<|>$/g, '')
    .replace(/[.,;:!?]+$/g, '');
}

function extractLinks(markdown: string): EvidenceLink[] {
  const links = new Map<string, EvidenceLink>();
  const add = (label: string | undefined, rawHref: string) => {
    const href = normalizeHref(rawHref);
    if (!href || href.startsWith('#') || href.startsWith('mailto:')) return;
    const host = href.startsWith('http') ? hostOf(href) : undefined;
    const clean = cleanLabel(label, host || href);
    if (!links.has(href)) links.set(href, { label: clean, href, host });
  };

  for (const match of markdown.matchAll(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    add(match[1], match[2]);
  }
  for (const match of markdown.matchAll(/href=["']([^"']+)["']/g)) {
    add(undefined, match[1]);
  }
  for (const match of markdown.matchAll(/<((?:https?:\/\/)[^>\s]+)>/g)) {
    add(undefined, match[1]);
  }
  for (const match of markdown.matchAll(/(^|[\s(])((?:https?:\/\/)[^\s)<]+)(?=$|[\s)])/g)) {
    add(undefined, match[2]);
  }

  return [...links.values()];
}

function stripMarkdown(value: string) {
  return String(value || '')
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<figure[\s\S]*?<\/figure>/gi, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[`*_>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function splitEvidenceBlocks(markdown: string) {
  return String(markdown || '')
    .replace(/```[\s\S]*?```/g, '\n')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter((block) => block && /(?:\[[^\]]+\]\([^)]+\)|https?:\/\/|href=["'])/i.test(block));
}

function firstMeaningfulBlock(markdown: string) {
  return String(markdown || '')
    .replace(/```[\s\S]*?```/g, '\n')
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .map(stripMarkdown)
    .filter((block) => block.length > 80 && !/^tags?\b/i.test(block))
    .at(0);
}

function sourceHosts(source: PrimarySourceInstitution) {
  return new Set(
    [source.url, ...source.datasets.map((dataset) => dataset.url)]
      .map((url) => hostOf(url))
      .filter(Boolean)
  );
}

function classifyClaimWithRule(text: string): { kind: ClaimKind; matchedRule: string } {
  const value = text.toLowerCase();
  if (/(sc[eé]nario|hypoth[eè]se|projection|conditionnel|pourrait|pourraient|[àa] surveiller|si |dans ce cas|trajectoire)/iu.test(value)) {
    return { kind: 'scénario', matchedRule: 'scenario-marker' };
  }
  if (/(estime|estimation|pr[eé]vision|environ|autour de|fourchette|probabilit[eé]|consensus|table sur|selon)/iu.test(value)) {
    return { kind: 'estimation', matchedRule: 'estimate-marker' };
  }
  if (/(donc|sugg[eè]re|implique|signale|indique|lecture|interpr[eè]te|ce qui veut dire|en clair|j'en d[eé]duis)/iu.test(value)) {
    return { kind: 'inférence', matchedRule: 'inference-marker' };
  }
  return { kind: 'unclassified-assertion', matchedRule: 'unclassified-assertion' };
}

export function classifyClaim(text: string): ClaimKind {
  return classifyClaimWithRule(text).kind;
}

function monthNumber(raw: string) {
  const months: Record<string, string> = {
    janvier: '01',
    février: '02',
    fevrier: '02',
    mars: '03',
    avril: '04',
    mai: '05',
    juin: '06',
    juillet: '07',
    août: '08',
    aout: '08',
    septembre: '09',
    octobre: '10',
    novembre: '11',
    décembre: '12',
    decembre: '12',
  };
  return months[raw.toLowerCase()];
}

function formatDate(value: Date) {
  return value.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Europe/Paris',
  });
}

function publicationDate(fallback?: Date) {
  return fallback
    ? { label: `publication ${formatDate(fallback)}`, iso: fallback.toISOString().slice(0, 10) }
    : { label: 'date non indiquée' };
}

function undetectedObservationDate() {
  return { label: 'observation non détectée', iso: undefined };
}

function extractDateFromText(text: string): { label: string; iso?: string } | null {
  const iso = text.match(/\b(20\d{2})-(\d{2})-(\d{2})\b/);
  if (iso) return { label: `${iso[3]}/${iso[2]}/${iso[1]}`, iso: `${iso[1]}-${iso[2]}-${iso[3]}` };

  const full = text.match(/\b([0-3]?\d)\s+(janvier|f[eé]vrier|mars|avril|mai|juin|juillet|ao[uû]t|septembre|octobre|novembre|d[eé]cembre)\s+(20\d{2})\b/iu);
  if (full) {
    const month = monthNumber(full[2].normalize('NFD').replace(/\p{Diacritic}/gu, '')) || monthNumber(full[2]);
    const day = full[1].padStart(2, '0');
    return { label: `${day}/${month}/${full[3]}`, iso: `${full[3]}-${month}-${day}` };
  }

  const monthYear = text.match(/\b(janvier|f[eé]vrier|mars|avril|mai|juin|juillet|ao[uû]t|septembre|octobre|novembre|d[eé]cembre)\s+(20\d{2})\b/iu);
  if (monthYear) {
    const month = monthNumber(monthYear[1].normalize('NFD').replace(/\p{Diacritic}/gu, '')) || monthNumber(monthYear[1]);
    return { label: `${monthYear[1]} ${monthYear[2]}`, iso: `${monthYear[2]}-${month}-01` };
  }

  const quarter = text.match(/\b[QT]([1-4])\s+(20\d{2})\b/i);
  if (quarter) return { label: `T${quarter[1]} ${quarter[2]}`, iso: `${quarter[2]}-${String((Number(quarter[1]) - 1) * 3 + 1).padStart(2, '0')}-01` };

  const year = text.match(/\b(20\d{2})\b/);
  if (year) return { label: year[1], iso: `${year[1]}-01-01` };

  return null;
}

function observationDateForBlock(block: string) {
  const text = stripMarkdown(block);
  const cue = text.match(
    /\b(?:au|à fin|a fin|fin|début|debut|depuis|en|pour|sur|d['’]ici|lors de|pendant|au cours de)\s+(.{0,80}?(?:20\d{2}|T[1-4]\s+20\d{2}|Q[1-4]\s+20\d{2}))/iu
  );
  if (cue) return extractDateFromText(cue[0]) ?? undetectedObservationDate();
  const quarter = text.match(/\b[QT][1-4]\s+20\d{2}\b/i);
  if (quarter) return extractDateFromText(quarter[0]) ?? undetectedObservationDate();
  return undetectedObservationDate();
}

function sourcePublicationDateForLink(link: EvidenceLink) {
  return extractDateFromText(`${link.label} ${link.href}`);
}

function claimClassifier(text: string): ClaimEvidence['classifier'] {
  const { matchedRule } = classifyClaimWithRule(text);
  return {
    method: 'lexical-heuristic-v1',
    matchedRule,
    caveat:
      'Classification automatique par marqueurs lexicaux ; elle doit être relue avant d’être traitée comme annotation éditoriale validée.',
  };
}

function buildFallbackClaim(markdown: string, opts: ArticleEvidenceOptions): ClaimEvidence[] {
  const claim = firstMeaningfulBlock(markdown);
  if (!claim || !opts.url) return [];
  const date = publicationDate(opts.published);
  const observation = observationDateForBlock(claim);

  return [
    {
      id: 'claim-backfill-1',
      kind: classifyClaim(claim),
      claim: claim.slice(0, 340),
      dateLabel: observation.iso ? observation.label : date.label,
      dateIso: observation.iso ?? date.iso,
      claimDateLabel: date.label,
      claimDateIso: date.iso,
      observationDateLabel: observation.label,
      observationDateIso: observation.iso,
      references: [
        {
          label: opts.title ? `Article l0g : ${opts.title}` : 'Article l0g',
          href: opts.url,
          host: hostOf(opts.url),
          kind: 'publication interne',
          dateLabel: date.label,
          dateIso: date.iso,
          sourcePublicationDateLabel: date.label,
          sourcePublicationDateIso: date.iso,
          retrievedAt: EVIDENCE_RETRIEVED_AT,
        },
      ],
      confidence: 'auto-backfill',
      reviewStatus: 'unreviewed',
      reviewedAt: null,
      reviewedBy: null,
      reviewNote: null,
      reviewedProofDepth: null,
      classifier: claimClassifier(claim),
    },
  ];
}

function relationKind(link: EvidenceLink, primaryHosts: Set<string>) {
  if (link.host && [...primaryHosts].some((host) => isSameOrSubHost(link.host!, host))) return 'source primaire';
  if (link.kind === 'dashboard' || link.kind === 'donnée' || link.kind === 'méthode') return link.kind;
  if (isInternal(link)) return 'contexte';
  return 'source secondaire';
}

function internalKind(href: string) {
  if (href.startsWith('/glossaire')) return 'glossaire';
  if (href.startsWith('/guides')) return 'guide';
  if (href.startsWith('/methodologie')) return 'méthode';
  if (href.startsWith('/sources')) return 'source';
  if (href.startsWith('/sujet')) return 'fil';
  if (href.startsWith('/posts')) return 'article';
  if (href.startsWith('/api') || href.startsWith('/donnees') || href.startsWith('/llms') || href.startsWith('/status') || href.startsWith('/preuves')) return 'donnée';
  return 'l0g';
}

function isInternal(link: EvidenceLink) {
  if (link.href.startsWith('/')) return true;
  return Boolean(link.host && SITE_HOSTS.has(link.host));
}

function toLocalPath(link: EvidenceLink) {
  if (link.href.startsWith('/')) return link.href;
  try {
    const url = new URL(link.href);
    return url.pathname + url.hash;
  } catch {
    return link.href;
  }
}

function dedupeByHost(links: EvidenceLink[]) {
  const seen = new Set<string>();
  const out: EvidenceLink[] = [];
  for (const link of links) {
    const key = link.host || link.href;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(link);
  }
  return out;
}

function detectScenario(markdown: string) {
  return /(^|[^a-zà-ÿ])(hypoth[eè]se|sc[eé]nario|projection|estimation|probabilit[eé]|fourchette|conditionnel|[àa] surveiller)([^a-zà-ÿ]|$)/iu.test(markdown);
}

function buildBadges(args: {
  primary: PrimaryEvidence[];
  secondary: EvidenceLink[];
  internalData: EvidenceLink[];
  context: EvidenceLink[];
  markdown: string;
}): EvidenceBadge[] {
  const badges: EvidenceBadge[] = [];
  if (args.primary.length > 0) {
    badges.push({
      id: 'primary-source',
      label: 'source primaire',
      detail: `${args.primary.length} institution${args.primary.length > 1 ? 's' : ''} détectée${args.primary.length > 1 ? 's' : ''}`,
      tone: 'strong',
    });
  }
  if (args.internalData.length > 0) {
    badges.push({
      id: 'public-data',
      label: 'donnée publique',
      detail: `${args.internalData.length} lien${args.internalData.length > 1 ? 's' : ''} dataset/dashboard`,
      tone: 'data',
    });
  }
  if (args.secondary.length > 0) {
    badges.push({
      id: 'secondary-source',
      label: 'source secondaire',
      detail: `${args.secondary.length} domaine${args.secondary.length > 1 ? 's' : ''} externe${args.secondary.length > 1 ? 's' : ''}`,
      tone: 'secondary',
    });
  }
  if (detectScenario(args.markdown)) {
    badges.push({
      id: 'scenario',
      label: 'hypothèse / scénario',
      detail: 'langage conditionnel détecté',
      tone: 'scenario',
    });
  }
  if (args.context.length > 0) {
    badges.push({
      id: 'internal-context',
      label: 'contexte l0g',
      detail: `${args.context.length} renvoi${args.context.length > 1 ? 's' : ''} interne${args.context.length > 1 ? 's' : ''}`,
      tone: 'context',
    });
  }
  return badges;
}

function buildEvidenceDepth(args: {
  claims: ClaimEvidence[];
  primary: PrimaryEvidence[];
  secondary: EvidenceLink[];
  internalData: EvidenceLink[];
  context: EvidenceLink[];
}): EvidenceDepth {
  const hasPrimaryLink = args.primary.some((item) => item.links.length > 0);
  const hasReviewedDirectProof = args.claims.some(
    (claim) => claim.reviewStatus === 'reviewed' && claim.reviewedProofDepth === 'direct-proof'
  );
  const hasDocumentLink = hasPrimaryLink || args.secondary.length > 0 || args.internalData.length > 0;
  const hasReference = args.primary.length > 0 || args.context.length > 0 || hasDocumentLink;

  if (hasReviewedDirectProof) {
    return {
      id: 'direct-proof',
      label: 'preuve directe',
      detail: 'relation affirmation → source validée explicitement par revue humaine',
      score: 4,
      automated: false,
    };
  }

  if (hasPrimaryLink || args.internalData.length > 0) {
    return {
      id: 'linked-source',
      label: 'source liée',
      detail: 'document, dataset ou dashboard accessible par URL ; relation exacte à l’affirmation non garantie automatiquement',
      score: 3,
      automated: true,
    };
  }

  if (hasDocumentLink || hasReference) {
    return {
      id: 'reference',
      label: 'référence',
      detail: 'document, institution ou contexte identifiable cité ; lien direct primaire non systématique',
      score: 2,
      automated: true,
    };
  }

  return {
    id: 'mention',
    label: 'mention',
    detail: 'aucune source primaire liée détectée automatiquement dans le registre l0g',
    score: 1,
    automated: true,
  };
}

export function buildArticleEvidence(markdown: string, opts: ArticleEvidenceOptions = {}): ArticleEvidence {
  const links = extractLinks(markdown).map((link) => {
    const sourceDate = sourcePublicationDateForLink(link);
    return {
      ...link,
      dateLabel: sourceDate?.label,
      dateIso: sourceDate?.iso,
      sourcePublicationDateLabel: sourceDate?.label,
      sourcePublicationDateIso: sourceDate?.iso,
      retrievedAt: EVIDENCE_RETRIEVED_AT,
    };
  });
  const primary: PrimaryEvidence[] = [];

  for (const source of primaryInstitutions) {
    const hosts = sourceHosts(source);
    const matchedLinks = links.filter((link) => link.host && [...hosts].some((host) => isSameOrSubHost(link.host!, host)));
    if (matchedLinks.length) {
      primary.push({
        source,
        reason: 'source-liée',
        links: matchedLinks.slice(0, 3),
      });
    }
  }

  const primaryHosts = new Set(primary.flatMap((item) => [...sourceHosts(item.source)]));
  const externalLinks = links.filter((link) => !isInternal(link) && !DASHBOARD_HOSTS.has(link.host || ''));
  const secondary = dedupeByHost(
    externalLinks.filter((link) => link.host && ![...primaryHosts].some((host) => isSameOrSubHost(link.host!, host)))
  ).slice(0, 10);

  const internal = links
    .filter(isInternal)
    .map((link) => ({ ...link, href: toLocalPath(link), kind: internalKind(toLocalPath(link)) }));

  const dashboards = links
    .filter((link) => link.host && DASHBOARD_HOSTS.has(link.host))
    .map((link) => ({ ...link, label: DASHBOARD_HOSTS.get(link.host!) || link.label, kind: 'dashboard' }));

  const internalData = [
    ...internal.filter((link) => link.kind === 'donnée' || link.kind === 'méthode'),
    ...dashboards,
  ].slice(0, 8);

  const context = internal
    .filter((link) => ['glossaire', 'guide', 'source', 'fil', 'article'].includes(link.kind || ''))
    .slice(0, 12);

  const linkClaims = splitEvidenceBlocks(markdown)
    .map((block, index): ClaimEvidence | null => {
      const blockLinks = extractLinks(block)
        .map((link) => {
          const local = isInternal(link) ? { ...link, href: toLocalPath(link), kind: internalKind(toLocalPath(link)) } : link;
          const dashboard = local.host && DASHBOARD_HOSTS.has(local.host)
            ? { ...local, label: DASHBOARD_HOSTS.get(local.host) || local.label, kind: 'dashboard' }
            : local;
          const sourceDate = sourcePublicationDateForLink(dashboard);
          return {
            ...dashboard,
            kind: relationKind(dashboard, primaryHosts),
            dateLabel: sourceDate?.label ?? 'date source non détectée',
            dateIso: sourceDate?.iso,
            sourcePublicationDateLabel: sourceDate?.label,
            sourcePublicationDateIso: sourceDate?.iso,
            retrievedAt: EVIDENCE_RETRIEVED_AT,
          };
        })
        .filter((link) => !link.href.startsWith('#'));

      if (!blockLinks.length) return null;

      const claim = stripMarkdown(block).slice(0, 340);
      if (!claim) return null;
      const claimDate = publicationDate(opts.published);
      const observationDate = observationDateForBlock(block);
      const classification = classifyClaimWithRule(claim);
      return {
        id: `claim-${index + 1}`,
        kind: classification.kind,
        claim,
        dateLabel: observationDate.iso ? observationDate.label : claimDate.label,
        dateIso: observationDate.iso ?? claimDate.iso,
        claimDateLabel: claimDate.label,
        claimDateIso: claimDate.iso,
        observationDateLabel: observationDate.label,
        observationDateIso: observationDate.iso,
        references: blockLinks.slice(0, 5),
        confidence: 'auto-backfill',
        reviewStatus: 'unreviewed',
        reviewedAt: null,
        reviewedBy: null,
        reviewNote: null,
        reviewedProofDepth: null,
        classifier: {
          method: 'lexical-heuristic-v1',
          matchedRule: classification.matchedRule,
          caveat:
            'Classification automatique par marqueurs lexicaux ; elle doit être relue avant d’être traitée comme annotation éditoriale validée.',
        },
      };
    })
    .filter((claim): claim is ClaimEvidence => Boolean(claim))
    .slice(0, 24);

  const claims = (linkClaims.length ? linkClaims : buildFallbackClaim(markdown, opts)).map((claim) => {
    const review = opts.articleSlug ? claimReviewById.get(`${opts.articleSlug}:${claim.id}`) : undefined;
    if (!review) return claim;
    return {
      ...claim,
      kind: review.kind ?? claim.kind,
      reviewStatus: 'reviewed' as const,
      reviewedAt: review.reviewedAt,
      reviewedBy: review.reviewedBy,
      reviewNote: review.note,
      reviewedProofDepth: review.proofDepth ?? null,
      classifier: {
        ...claim.classifier,
        reviewedOverride: `${review.reviewedAt} ${review.reviewedBy}`,
        caveat:
          'Classification initiale par marqueurs lexicaux ; type ou profondeur éventuellement corrigés par revue humaine encodée.',
      },
    };
  });

  return {
    badges: buildBadges({ primary, secondary, internalData, context, markdown }),
    depth: buildEvidenceDepth({ claims, primary, secondary, internalData, context }),
    claims,
    primary,
    secondary,
    internalData,
    context,
    stats: {
      externalLinks: externalLinks.length,
      internalLinks: internal.length,
      primarySources: primary.length,
      claimRelations: claims.length,
    },
  };
}
