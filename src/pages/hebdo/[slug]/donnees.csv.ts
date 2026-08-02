import type { APIRoute } from 'astro';
import { weeklyEditions } from '../../../config/weekly-editions.ts';
import { buildWeeklyCsv } from '../../../lib/weekly-package.ts';

export function getStaticPaths() {
  return weeklyEditions.map((edition) => ({ params: { slug: edition.slug }, props: { edition } }));
}

export const GET: APIRoute = ({ props }) => new Response(buildWeeklyCsv(props.edition), {
  headers: {
    'Content-Type': 'text/csv; charset=utf-8',
    'Content-Disposition': `attachment; filename="l0g-hebdo-${props.edition.slug}.csv"`,
    'Cache-Control': 'public, max-age=300, must-revalidate',
  },
});
