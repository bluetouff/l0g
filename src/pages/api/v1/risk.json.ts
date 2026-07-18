import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { editorialProtocol } from '../../../config/editorial.ts';
import { riskBandScaleCaveat } from '../../../config/methodology.ts';
import { riskSignalMeta } from '../../../config/risk-signals.ts';
import { textResponse } from '../../../lib/agent-surface.ts';

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
    const provenance = risk.provenance?.[it.key] ?? null;
    const { key: _key, ...signal } = it;
    indices[it.key] = {
      ...signal,
      scale: it.scale ?? 100,
      label: m.label,
      source: m.source,
      methodology: m.methodology,
      calculation: m.calculation,
      provenance,
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
    version: '2',
    generated: risk.generated ?? new Date().toISOString(),
    snapshot: risk.aggregateGeneratedAt ?? risk.updated ?? null,
    status: risk.status ?? 'unknown',
    summary: risk.summary ?? null,
    software: risk.software ?? null,
    indices,
    scaleCaveat: riskBandScaleCaveat,
    precisionGuard: editorialProtocol.precisionGuard,
    confluence,
    feed: 'https://l0g.fr/api/v1/risk.xml',
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
    note:
      "Best-effort explicite : snapshot/generated datent l’assemblage. Lire sourceStatus, qualityStatus, fallbackUsed, sourceUpdatedAt, lastAttemptAt et lastSuccessAt pour chaque signal. L’échelle 0-100 est propre à chaque instrument, pas un indice global ni une probabilité.",
  };

  return textResponse(JSON.stringify(payload, null, 2) + '\n', 'application/json; charset=utf-8');
};
