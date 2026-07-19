import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('postsEn', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime()
  );

  return rss({
    title: 'l0g.fr in English',
    description: 'Macro, crypto, finance — analyses and weak signals from l0g.fr, in English. By Bluetouff.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/en/analysis/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: '<language>en</language>',
  });
}
