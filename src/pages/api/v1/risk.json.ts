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
  const expectedKeys = ['us', 'eu', 'yen', 'energie', 'debt'];
  const availableKeys = new Set((risk.indices || []).map((item: any) => item.key));
  const complete = expectedKeys.every((key) => availableKeys.has(key));
  const snapshot = risk.aggregateGeneratedAt ?? risk.updated ?? null;
  const snapshotAge = snapshot ? Date.now() - Date.parse(snapshot) : Number.POSITIVE_INFINITY;
  const snapshotFresh = Number.isFinite(snapshotAge) && snapshotAge <= 30 * 60 * 1000;

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
    const contractValid = String(conf.version) === '2' && Array.isArray(conf.items) &&
      conf.lastAttemptAt && !Number.isNaN(Date.parse(conf.lastAttemptAt));
    const fallback = conf.sourceStatus === 'fallback' || conf.fallbackUsed === true;
    const items: any[] = contractValid && !fallback ? conf.items : [];
    const top = items.reduce<any>((a, b) => (b.score > (a?.score ?? -1) ? b : a), null);
    confluence = {
      generated: conf.generated ?? null,
      updated: conf.updated ?? null,
      retrievedAt: conf.retrievedAt ?? conf.updated ?? null,
      lastAttemptAt: conf.lastAttemptAt ?? null,
      lastSuccessAt: conf.lastSuccessAt ?? conf.retrievedAt ?? conf.updated ?? null,
      sourceStatus: contractValid ? (conf.sourceStatus ?? 'unknown') : 'failed',
      qualityStatus: contractValid ? (conf.qualityStatus ?? 'unknown') : 'degraded',
      fallbackUsed: contractValid ? conf.fallbackUsed === true : false,
      fallbackReason: contractValid ? (conf.fallbackReason ?? null) : 'contrat v2 daté absent ou invalide',
      staleAfter: conf.staleAfter ?? 'PT26H',
      ageSeconds: typeof conf.ageSeconds === 'number' ? conf.ageSeconds : null,
      timelinessStatus: contractValid ? (conf.timelinessStatus ?? 'unknown') : 'unknown',
      provenanceStatus: contractValid ? (conf.provenanceStatus ?? 'partial') : 'unverified',
      freshness: contractValid ? (conf.freshness ?? null) : null,
      count: items.length,
      conviction: items.filter((i) => String(i.quadrant).toLowerCase() === 'conviction').length,
      top: top ? { ticker: top.ticker, score: top.score, quadrant: top.quadrant } : null,
      source: 'https://l0g.fr/confluence/',
      note: conf.note ?? 'Copie statique du build ; consulter /confluence.json pour le contrat vivant.',
    };
  } catch {
    /* confluence optionnel */
  }

  const exposedIndices = complete && snapshotFresh ? indices : {};
  const payload = {
    schema: 'https://l0g.fr/api/',
    version: '2',
    generated: risk.generated ?? new Date().toISOString(),
    snapshot,
    staleAfter: 'PT30M',
    status: complete && snapshotFresh ? (risk.status ?? 'unknown') : 'failed',
    summary: complete && snapshotFresh ? (risk.summary ?? null) : {
      expected: expectedKeys.length,
      present: 0,
      ok: 0,
      fallback: 0,
      stale: snapshotFresh ? 0 : expectedKeys.length,
      degraded: 0,
      missing: expectedKeys.map((key) => ({
        key,
        reason: snapshotFresh ? 'absent du snapshot de build' : 'snapshot statique trop ancien, valeur retirée',
      })),
    },
    software: risk.software ?? null,
    indices: exposedIndices,
    scaleCaveat: riskBandScaleCaveat,
    precisionGuard: editorialProtocol.precisionGuard,
    confluence,
    feed: 'https://l0g.fr/api/v1/risk.xml',
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
    note:
      "Fallback statique du build : en production, l’Alias Apache /api/v1/risk.json sert l’agrégat vivant. Un snapshot incomplet échoue explicitement sans prétendre couvrir cinq instruments. Lire sourceStatus, qualityStatus, fallbackUsed, sourceUpdatedAt, lastAttemptAt et lastSuccessAt pour chaque signal. L’échelle 0-100 est propre à chaque instrument, pas un indice global ni une probabilité.",
  };

  return textResponse(JSON.stringify(payload, null, 2) + '\n', 'application/json; charset=utf-8');
};
