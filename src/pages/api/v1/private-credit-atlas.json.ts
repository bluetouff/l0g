import type { APIRoute } from 'astro';
import dataset from '../../../data/private-credit-atlas.json';
import { assertAtlasDataset } from '../../../lib/engagement-atlas.ts';

export const GET: APIRoute = () => {
  assertAtlasDataset(dataset);
  return new Response(JSON.stringify({
    ...dataset,
    temporalContract: 'Reconstructed documentary history. publishedOn is the publication or SEC filing date, not the transaction date. recordedOn is the review date. Older relations may have changed since the cited document.',
    interpretation: 'Selected US-focused examples of corporate direct lending and asset-backed credit. Management mandates, equity holdings, securities investments and lending facilities are distinct relationships. A common bank does not establish financing of a particular underlying loan. Lines have no financial scale.',
  }), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff' } });
};
