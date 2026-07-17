import { createHash } from 'node:crypto';
import { existsSync, lstatSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

export type ArchiveHash = {
  path: string;
  sha256: string;
  bytes: number;
  canonicalization: 'integrity-manifest-v1' | 'canonical-json-v1';
};

export type ArchiveFrame = {
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

const DEFAULT_ARCHIVE_DIR = process.env.L0G_BLACK_BOX_ARCHIVE_DIR
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

export function loadBlackBoxArchive(directory = DEFAULT_ARCHIVE_DIR) {
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
