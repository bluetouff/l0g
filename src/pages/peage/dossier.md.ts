import type { APIRoute } from 'astro';
import { peageDossier } from '../../data/peage-dossier.ts';
import { peageMarkdown } from '../../lib/peage.ts';

export const GET: APIRoute = () => new Response(peageMarkdown(peageDossier), {
  headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'X-Content-Type-Options': 'nosniff' },
});
