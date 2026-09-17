import type { APIRoute } from 'astro';
import dataset from '../../../data/oil-financing-atlas.json';
import { assertAtlasDataset } from '../../../lib/engagement-atlas.ts';

export const GET: APIRoute = () => {
  assertAtlasDataset(dataset);
  return new Response(JSON.stringify({
    ...dataset,
    temporalContract: 'Reconstructed documentary history. publishedOn is the publication date, not the transaction date. recordedOn is the review date. Sienna transactions date from 2020; the Chad report covers 2023; Trafigura facilities were announced in March 2026. Older relations may have changed. Reading links are current editorial context, not evidence available at the historical cutoff.',
    interpretation: 'Selected oil-trade financing cases. Sale, payment, expected repayment, bank coordination, credit availability and allocation of public revenues are distinct relationships. Trafigura corporate facilities are not exclusively oil financing. The SHT escrow account does not imply that Citibank is a lender. Lines have no financial scale and do not establish current exposure or contagion.',
  }), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff' } });
};
