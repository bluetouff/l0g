import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { organizationEntity } from '../config/entities.ts';
import { buildNewsSitemap, type NewsSitemapArticle } from '../lib/news-sitemap.ts';

export async function GET({ site }: APIContext) {
  const canonicalSite = site ?? new URL('https://l0g.fr');
  const buildDate = process.env.L0G_BUILD_TIMESTAMP
    ? new Date(process.env.L0G_BUILD_TIMESTAMP)
    : new Date();
  const [frenchPosts, englishPosts] = await Promise.all([
    getCollection('posts', ({ data }) => !data.draft),
    getCollection('postsEn', ({ data }) => !data.draft),
  ]);

  const articles: NewsSitemapArticle[] = [
    ...frenchPosts.map((post) => ({
      language: 'fr' as const,
      publicationDate: post.data.pubDate,
      title: post.data.title,
      url: new URL(`/posts/${post.id}/`, canonicalSite).toString(),
    })),
    ...englishPosts.map((post) => ({
      language: 'en' as const,
      publicationDate: post.data.pubDate,
      title: post.data.title,
      url: new URL(`/en/analysis/${post.id}/`, canonicalSite).toString(),
    })),
  ];

  return new Response(buildNewsSitemap(articles, {
    now: buildDate,
    publicationName: organizationEntity.name,
  }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
