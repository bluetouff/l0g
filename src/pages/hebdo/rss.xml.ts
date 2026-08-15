import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { weeklyEditions } from '../../config/weekly-editions.ts';

export const GET: APIRoute = (context) => rss({
  title: 'L’Hebdo l0g',
  description: 'Une édition chaque dimanche, avec une URL stable, ses analyses, son graphique et ses formats réutilisables.',
  site: context.site ?? new URL('https://l0g.fr'),
  items: [...weeklyEditions]
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
    .map((edition) => ({
      title: edition.title,
      description: edition.description,
      pubDate: new Date(edition.publishedAt),
      link: `/hebdo/${edition.slug}/`,
      categories: ['hebdo'],
    })),
  customData: '<language>fr-FR</language>',
});
