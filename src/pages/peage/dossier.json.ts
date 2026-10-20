import type { APIRoute } from 'astro';
import { peageDossier } from '../../data/peage-dossier.ts';
import { assertPeageDossier } from '../../lib/peage.ts';

export const GET: APIRoute = () => {
  assertPeageDossier(peageDossier);
  return new Response(JSON.stringify(peageDossier, null, 2), {
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'X-Content-Type-Options': 'nosniff' },
  });
};
