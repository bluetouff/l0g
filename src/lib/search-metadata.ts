import { topics, postMatchesTopic } from '../config/topics.ts';

export type SearchContentType = 'analysis' | 'guide' | 'glossary' | 'tool' | 'dossier' | 'page';

const englishTopicLabels: Record<string, string> = {
  'credit-prive': 'Private credit and private markets',
  'liquidite-repo': 'Liquidity, repo and collateral',
  'ormuz-petrole': 'Hormuz and oil',
  'regulation-crypto-us': 'US crypto regulation',
  'macro-banques-centrales': 'Macro and central banks',
  'geopolitique-energie': 'Geopolitics and energy',
  crypto: 'Crypto and stablecoins',
  'marches-valorisations': 'Markets and valuations',
  'politique-us': 'US politics',
};

export function searchTopicLabels(tags: string[], lang: 'fr' | 'en') {
  return topics.filter((topic) => postMatchesTopic(tags, topic))
    .map((topic) => lang === 'en' ? englishTopicLabels[topic.slug] ?? topic.label : topic.label);
}

export function searchContentType(path: string): SearchContentType {
  if (/^\/(?:posts|en\/analysis)\/.+/.test(path)) return 'analysis';
  if (/^\/(?:guides|en\/guides)\/.+/.test(path)) return 'guide';
  if (/^\/(?:glossaire|en\/glossary)(?:\/|$)/.test(path)) return 'glossary';
  if (/^\/(?:outils|en\/tools)(?:\/|$)/.test(path)) return 'tool';
  if (/^\/(?:dossiers|sujet|sujets|en\/topics|atlas|en\/atlas)(?:\/|$)/.test(path)) return 'dossier';
  return 'page';
}

export function searchDateMetadata(value?: Date | string) {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  return {
    iso: date.toISOString(),
    year: new Intl.DateTimeFormat('en', { year: 'numeric', timeZone: 'Europe/Paris' }).format(date),
  };
}
