import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { AGENT_SITE, generatedAt, type GuideEntry, type PostEntry } from './agent-surface.ts';

type ArchiveHash = { path: string; sha256: string; bytes: number; canonicalization: 'integrity-manifest-v1' | 'canonical-json-v1' };
type ArchiveFrame = {
  schemaVersion: '2';
  frameId: string;
  date: string;
  observedAt: string | null;
  retrievedAt: string | null;
  computedAt: string;
  gitSha: string;
  previousFrameHash: string | null;
  frameHash: string;
  attestation: { provider: string; reference: string; subjects: string[] };
  contemporaryHashes: ArchiveHash[];
  signals: Array<Record<string, unknown>>;
  freshness: Record<string, unknown>;
  changes: Record<string, unknown>;
  limitations: string[];
};

const BLACK_BOX_SCHEMA = `${AGENT_SITE}/openapi.json#/components/schemas/BlackBoxSurface`;
const ARCHIVE_DIR = process.env.L0G_BLACK_BOX_ARCHIVE_DIR
  ? resolve(process.env.L0G_BLACK_BOX_ARCHIVE_DIR)
  : resolve(process.cwd(), '.black-box-archive');

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`).join(',')}}`;
}

function sha256(value: unknown) {
  return createHash('sha256').update(stableStringify(value), 'utf8').digest('hex');
}

function frameCore(frame: ArchiveFrame) {
  const { frameHash: _frameHash, ...core } = frame;
  return core;
}

function assertFrame(frame: ArchiveFrame, previous: ArchiveFrame | null, file: string) {
  if (frame.schemaVersion !== '2') throw new Error(`Black Box: schemaVersion invalide dans ${file}`);
  if (!/^[a-f0-9]{64}$/.test(frame.frameHash)) throw new Error(`Black Box: frameHash invalide dans ${file}`);
  if (sha256(frameCore(frame)) !== frame.frameHash) throw new Error(`Black Box: empreinte altérée dans ${file}`);
  const expectedPrevious = previous?.frameHash ?? null;
  if (frame.previousFrameHash !== expectedPrevious) throw new Error(`Black Box: chaîne rompue dans ${file}`);
  if (!Array.isArray(frame.contemporaryHashes) || !frame.contemporaryHashes.length) {
    throw new Error(`Black Box: hashes contemporains absents dans ${file}`);
  }
}

export function loadBlackBoxArchive(directory = ARCHIVE_DIR) {
  const framesDirectory = resolve(directory, 'frames');
  if (!existsSync(framesDirectory)) return { directory, available: false, frames: [] as ArchiveFrame[] };
  const files = readdirSync(framesDirectory).filter((file) => file.endsWith('.json')).sort();
  const frames: ArchiveFrame[] = [];
  for (const file of files) {
    const path = resolve(framesDirectory, file);
    const stat = lstatSync(path);
    if (!stat.isFile() || stat.isSymbolicLink() || stat.size > 5_000_000) throw new Error(`Black Box: fichier archive refusé ${file}`);
    const frame = JSON.parse(readFileSync(path, 'utf8')) as ArchiveFrame;
    assertFrame(frame, frames.at(-1) ?? null, file);
    if (frames.some((item) => item.frameId === frame.frameId)) throw new Error(`Black Box: frameId dupliqué ${frame.frameId}`);
    frames.push(frame);
  }
  return { directory, available: true, frames };
}

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
