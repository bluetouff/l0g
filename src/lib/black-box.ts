import { AGENT_SITE, generatedAt, type GuideEntry, type PostEntry } from './agent-surface.ts';
import { loadBlackBoxArchive } from './black-box-archive.ts';

const BLACK_BOX_SCHEMA = `${AGENT_SITE}/openapi.json#/components/schemas/BlackBoxSurface`;
export function buildBlackBoxSurface(_posts: PostEntry[], _guides: GuideEntry[], _risk: unknown) {
  const archive = loadBlackBoxArchive();
  const frames = archive.frames;
  const instruments = [...new Set(frames.flatMap((frame) => frame.signals.map((signal) => String(signal.instrument || '')).filter(Boolean)))].sort();
  return {
    schema: BLACK_BOX_SCHEMA,
    version: '2',
    generated: generatedAt(),
    title: 'Black Box Recorder l0g',
    question: 'Rejouer uniquement les états effectivement archivés au moment de leur publication.',
    coverage: {
      frames: frames.length,
      firstFrameDate: frames[0]?.date ?? null,
      lastFrameDate: frames.at(-1)?.date ?? null,
      instruments,
      pointInTime: true,
      archiveAvailable: archive.available,
    },
    replay: {
      acceptedDateFormat: 'YYYY-MM-DD',
      rule: 'Sélectionner la dernière frame append-only dont date <= date demandée. Aucun état passé n’est recalculé.',
      archiveStartDate: frames[0]?.date ?? null,
      example: {
        requestedDate: frames[0]?.date ?? '2026-07-16',
        result: frames.length ? 'replayable' : 'not-replayable: archive non initialisée dans cet environnement',
      },
    },
    archive: {
      branch: 'black-box-archive',
      layout: 'frames/*.json',
      appendOnly: true,
      hashAlgorithm: 'sha-256',
      validation: 'Chaque frame hashée référence la frame précédente ; CI refuse modification, renommage ou suppression.',
    },
    inputs: {
      signals: `${AGENT_SITE}/api/v1/signals/history.json`,
      freshness: `${AGENT_SITE}/api/v1/freshness.json`,
      changes: `${AGENT_SITE}/api/v1/changes.json`,
      risk: `${AGENT_SITE}/api/v1/risk.json`,
      debtRisk: `${AGENT_SITE}/api/v1/debt-risk.json`,
    },
    frames,
    policy: {
      promise: 'Publier des frames point-in-time append-only, chaînées et reliées au build qui les a produites.',
      noPostHoc: 'Une frame absente reste absente ; aucune donnée actuelle ne remplace un hash historique.',
      genesis: 'La couverture probante commence à la première frame v2. Les anciennes frames dérivées ne sont pas présentées comme immuables.',
      correctionPolicy: `${AGENT_SITE}/protocole-editorial/`,
      changelog: `${AGENT_SITE}/changelog-editorial/`,
    },
    license: 'CC BY 4.0',
    attribution: 'l0g.fr',
  };
}
