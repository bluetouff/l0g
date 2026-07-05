import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { textResponse } from '../../../lib/agent-surface.ts';

/**
 * Snapshot Dette US dedie. Il reprend le fichier public genere au build depuis
 * https://debt.l0g.fr/latest.json, sans appel reseau cote navigateur.
 */

function readJSON(rel: string): any {
  return JSON.parse(readFileSync(join(process.cwd(), rel), 'utf-8'));
}

export const GET: APIRoute = () => {
  const snapshot = readJSON('public/debt-latest.json');
  return textResponse(JSON.stringify(snapshot, null, 2) + '\n', 'application/json; charset=utf-8');
};
