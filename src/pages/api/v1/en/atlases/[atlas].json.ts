import type { APIRoute } from 'astro';
import { englishAtlasDatasets } from '../../../../../config/english-atlas-datasets';

export function getStaticPaths() {
  return Object.entries(englishAtlasDatasets).map(([atlas, dataset]) => ({ params: { atlas }, props: { dataset } }));
}

export const GET: APIRoute = ({ props }) => new Response(JSON.stringify({
  ...props.dataset,
  temporalContract: 'Reconstructed documentary history. publishedOn is a source publication date; recordedOn is the review date. Select the latest reviewed observation at or before your cutoff. Translation does not renew the source review. Older relations may have changed since their latest cited source.',
  interpretation: 'Relations do not measure capital paid, probable loss, causal strength or portfolio exposure. A shared actor does not establish financing between its counterparties.',
}), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff' } });
