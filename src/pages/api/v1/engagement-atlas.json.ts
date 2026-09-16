import type { APIRoute } from 'astro';
import dataset from '../../../data/engagement-atlas.json';
import { assertAtlasDataset } from '../../../lib/engagement-atlas.ts';

export const GET: APIRoute = () => {
  assertAtlasDataset(dataset);
  return new Response(JSON.stringify({
    ...dataset,
    temporalContract: 'Reconstructed documentary history. publishedOn is a source publication date; recordedOn is the review date. Select the latest reviewed observation at or before your cutoff. Older relations may have changed since their latest cited source.',
    interpretation: 'Relations do not measure capital paid, probable loss, causal strength or portfolio exposure. A shared actor does not establish financing between its counterparties.',
  }), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff' } });
};
