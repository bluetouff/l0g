import type { APIRoute } from 'astro';
import { weeklyEditions } from '../../../config/weekly-editions.ts';
import { buildWeeklyLinkedInText } from '../../../lib/weekly-package.ts';

export function getStaticPaths() {
  return weeklyEditions.map((edition) => ({ params: { slug: edition.slug }, props: { edition } }));
}

export const GET: APIRoute = ({ props }) => new Response(buildWeeklyLinkedInText(props.edition), {
  headers: {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'public, max-age=300, must-revalidate',
  },
});
