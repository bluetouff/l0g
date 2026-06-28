import type { ClaimKind, EvidenceDepth } from '../lib/article-evidence.ts';
import registryData from './claim-reviews.json';

export type ClaimReviewEntry = {
  claimId: string;
  reviewedAt: string;
  reviewedBy: string;
  kind?: ClaimKind;
  note: string;
  proofDepth?: Extract<EvidenceDepth['id'], 'direct-proof' | 'reproduction'>;
  evidenceLocator?: {
    type: 'page' | 'section' | 'table' | 'series' | 'cell' | 'form' | 'calculation' | 'other';
    value: string;
  };
  reproductionArtifact?: string;
};

const entries = registryData.entries as ClaimReviewEntry[];

export const claimReviewRegistry = {
  version: registryData.version,
  updated: registryData.updated,
  policy:
    'Une claim ne devient reviewed que si son identifiant global articleSlug:claim-id est inscrit dans ce registre avec reviewer, date et note. Les niveaux direct-proof et reproduction exigent aussi evidenceLocator ; reproduction exige reproductionArtifact.',
  entries,
};

export const claimReviewById = new Map(entries.map((entry) => [entry.claimId, entry]));
