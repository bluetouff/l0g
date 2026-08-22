import XMLBuilder from 'fast-xml-builder';

export const NEWS_SITEMAP_MAX_AGE_MS = 2 * 24 * 60 * 60 * 1000;
export const NEWS_SITEMAP_MAX_ENTRIES = 1_000;

export type NewsLanguage = 'fr' | 'en';

export type NewsSitemapArticle = {
  language: NewsLanguage;
  publicationDate: Date;
  title: string;
  url: string;
};

type NewsSitemapOptions = {
  now?: Date;
  publicationName?: string;
};

function normalizeArticle(article: NewsSitemapArticle): NewsSitemapArticle {
  const publicationDate = new Date(article.publicationDate);
  const timestamp = publicationDate.getTime();
  if (!Number.isFinite(timestamp)) {
    throw new Error(`Date de publication Google News invalide pour ${article.url}`);
  }

  const url = new URL(article.url);
  if (url.protocol !== 'https:' && url.protocol !== 'http:') {
    throw new Error(`URL Google News non HTTP(S) : ${article.url}`);
  }

  const title = article.title.trim();
  if (!title) {
    throw new Error(`Titre Google News vide pour ${article.url}`);
  }

  if (article.language !== 'fr' && article.language !== 'en') {
    throw new Error(`Langue Google News non prise en charge pour ${article.url}`);
  }

  return {
    ...article,
    publicationDate,
    title,
    url: url.toString(),
  };
}

export function selectNewsSitemapArticles(
  articles: NewsSitemapArticle[],
  now = new Date(),
): NewsSitemapArticle[] {
  const nowTimestamp = now.getTime();
  if (!Number.isFinite(nowTimestamp)) {
    throw new Error('Date de generation du sitemap Google News invalide');
  }

  const cutoff = nowTimestamp - NEWS_SITEMAP_MAX_AGE_MS;
  const selected = articles
    .map(normalizeArticle)
    .filter(({ publicationDate }) => {
      const timestamp = publicationDate.getTime();
      return timestamp >= cutoff && timestamp <= nowTimestamp;
    })
    .sort((a, b) => b.publicationDate.getTime() - a.publicationDate.getTime());

  const seenUrls = new Set<string>();
  for (const article of selected) {
    if (seenUrls.has(article.url)) {
      throw new Error(`URL dupliquee dans le sitemap Google News : ${article.url}`);
    }
    seenUrls.add(article.url);
  }

  if (selected.length > NEWS_SITEMAP_MAX_ENTRIES) {
    throw new Error(
      `Le sitemap Google News contient ${selected.length} entrees, au-dela de la limite de ${NEWS_SITEMAP_MAX_ENTRIES}`,
    );
  }

  return selected;
}

export function buildNewsSitemap(
  articles: NewsSitemapArticle[],
  { now = new Date(), publicationName = 'l0g' }: NewsSitemapOptions = {},
): string {
  const normalizedPublicationName = publicationName.trim();
  if (!normalizedPublicationName) {
    throw new Error('Nom de publication Google News vide');
  }

  const selected = selectNewsSitemapArticles(articles, now);
  const document = {
    '?xml': {
      '@_version': '1.0',
      '@_encoding': 'UTF-8',
    },
    urlset: {
      '@_xmlns': 'http://www.sitemaps.org/schemas/sitemap/0.9',
      '@_xmlns:news': 'http://www.google.com/schemas/sitemap-news/0.9',
      url: selected.map((article) => ({
        loc: article.url,
        'news:news': {
          'news:publication': {
            'news:name': normalizedPublicationName,
            'news:language': article.language,
          },
          'news:publication_date': article.publicationDate.toISOString(),
          'news:title': article.title,
        },
      })),
    },
  };

  return new XMLBuilder({
    format: true,
    ignoreAttributes: false,
    suppressBooleanAttributes: false,
    suppressEmptyNode: false,
  }).build(document);
}
