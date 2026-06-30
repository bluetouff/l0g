import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { editorialProtocol } from '../../../config/editorial.ts';
import { riskBandScaleCaveat } from '../../../config/methodology.ts';
import { riskSignalMeta } from '../../../config/risk-signals.ts';

/**
 * API publique l0g — v1. Sortie statique : le corps est généré au build à partir
 * des snapshots (/risk.json, /confluence.json). Les en-têtes CORS sont posés par
 * Apache sur /api/ (voir docs), car en statique les headers de Response sont ignorés.
 * Aucun indice « global » fabriqué : on n'expose que les sous-indices réels des outils.
 */

function readJSON(rel: string): any {
  return JSON.parse(readFileSync(join(process.cwd(), rel), 'utf-8'));
}

export const GET: APIRoute = () => {
  const risk = readJSON('public/risk.json');

  const indices: Record<string, unknown> = {};
  for (const it of risk.indices || []) {
    const m = riskSignalMeta[it.key] || { label: undefined, source: undefined, methodology: undefined };
    indices[it.key] = {
      value: it.value,
      scale: it.scale ?? 100,
      level: it.level,
      tone: it.tone,
      label: m.label,
      source: m.source,
      methodology: m.methodology,
      calculation: m.calculation,
    };
  }

  let confluence: unknown = null;
  try {
    const conf = readJSON('public/confluence.json');
    const items: any[] = Array.isArray(conf.items) ? conf.items : [];
    const top = items.reduce<any>((a, b) => (b.score > (a?.score ?? -1) ? b : a), null);
    confluence = {
      updated: conf.updated ?? null,
      count: items.length,
      conviction: items.filter((i) => String(i.quadrant).toLowerCase() === 'conviction').length,
      top: top ? { ticker: top.ticker, score: top.score, quadrant: top.quadrant } : null,
      source: 'https://l0g.fr/confluence/',
    };
  } catch {
    /* confluence optionnel */
  }

  const payload = {
    schema: 'https://l0g.fr/api/',
    version: '1',
    generated: new Date().toISOString(),
    snapshot: risk.updated ?? null,
    indices,
    scaleCaveat: riskBandScaleCaveat,
    precisionGuard: editorialProtocol.precisionGuard,
    confluence,
    feed: 'https://l0g.fr/api/v1/risk.xml',
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
    note:
      "Signaux repris des outils l0g, à la cadence des snapshots (pas de temps réel strict). L’échelle 0-100 est une normalisation d’affichage par instrument, pas un indice global ni une probabilité. Best-effort, pas un conseil en investissement.",
  };

  return new Response(JSON.stringify(payload, null, 2) + '\n', {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
};
