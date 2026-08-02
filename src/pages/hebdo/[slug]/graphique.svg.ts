import type { APIRoute } from 'astro';
import { weeklyEditions } from '../../../config/weekly-editions.ts';
import { buildWeeklyChartSvg } from '../../../lib/weekly-package.ts';

export function getStaticPaths() {
  return weeklyEditions.map((edition) => ({ params: { slug: edition.slug }, props: { edition } }));
}

export const GET: APIRoute = ({ props }) => new Response(buildWeeklyChartSvg(props.edition), {
  headers: {
    'Content-Type': 'image/svg+xml; charset=utf-8',
    'Cache-Control': 'public, max-age=300, must-revalidate',
  },
});
