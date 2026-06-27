import {
  primaryInstitutions,
  type PrimarySourceInstitution,
} from '../config/primary-sources.ts';

export interface EvidenceLink {
  label: string;
  href: string;
  host?: string;
  kind?: string;
}

export interface PrimaryEvidence {
  source: PrimarySourceInstitution;
  reason: 'lien' | 'mention';
  links: EvidenceLink[];
}

export interface ArticleEvidence {
  primary: PrimaryEvidence[];
  secondary: EvidenceLink[];
  internalData: EvidenceLink[];
  context: EvidenceLink[];
  stats: {
    externalLinks: number;
    internalLinks: number;
    primarySources: number;
  };
}

const SITE_HOSTS = new Set(['l0g.fr', 'www.l0g.fr']);
const DASHBOARD_HOSTS = new Map([
  ['13flow.eu', '13FLOW'],
  ['us.l0g.fr', 'US Macro'],
  ['euro.l0g.fr', 'Euro Macro'],
  ['energie.l0g.fr', 'Énergie'],
  ['yct.l0g.fr', 'Yen Carry'],
]);

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

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

function sourceHosts(source: PrimarySourceInstitution) {
  return new Set(
    [source.url, ...source.datasets.map((dataset) => dataset.url)]
      .map((url) => hostOf(url))
      .filter(Boolean)
  );
}

function mentioned(source: PrimarySourceInstitution, text: string) {
  const tokens = new Set<string>();
  tokens.add(source.name);
  tokens.add(source.shortName);
  for (const part of source.shortName.split('/')) tokens.add(part.trim());
  for (const dataset of source.datasets) tokens.add(dataset.name);

  return [...tokens]
    .filter((token) => token.length >= 3)
    .some((token) => new RegExp(`(^|[^\\p{L}\\p{N}])${escapeRegExp(token)}([^\\p{L}\\p{N}]|$)`, 'iu').test(text));
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

export function buildArticleEvidence(markdown: string): ArticleEvidence {
  const links = extractLinks(markdown);
  const primary: PrimaryEvidence[] = [];

  for (const source of primaryInstitutions) {
    const hosts = sourceHosts(source);
    const matchedLinks = links.filter((link) => link.host && [...hosts].some((host) => isSameOrSubHost(link.host!, host)));
    const hasMention = mentioned(source, markdown);
    if (matchedLinks.length || hasMention) {
      primary.push({
        source,
        reason: matchedLinks.length ? 'lien' : 'mention',
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

  return {
    primary,
    secondary,
    internalData,
    context,
    stats: {
      externalLinks: externalLinks.length,
      internalLinks: internal.length,
      primarySources: primary.length,
    },
  };
}
