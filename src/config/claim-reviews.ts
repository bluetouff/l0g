import type { ClaimKind, EvidenceDepth } from '../lib/article-evidence.ts';

export type ClaimReviewEntry = {
  claimId: string;
  reviewedAt: string;
  reviewedBy: string;
  kind?: ClaimKind;
  note: string;
  proofDepth?: Extract<EvidenceDepth['id'], 'direct-proof' | 'reproduction'>;
};

export const claimReviewRegistry = {
  version: '2026-06-28',
  updated: '2026-06-28',
  policy:
    'Une claim ne devient reviewed que si son identifiant global articleSlug:claim-id est inscrit dans ce registre avec reviewer, date et note.',
  entries: [] as ClaimReviewEntry[],
};

export const claimReviewById = new Map(claimReviewRegistry.entries.map((entry) => [entry.claimId, entry]));
