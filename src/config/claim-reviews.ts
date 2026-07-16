import type { ClaimKind, EvidenceDepth } from '../lib/article-evidence.ts';
import registryData from './claim-reviews.json';

export type ClaimReviewEntry = {
  status?: 'legacy' | 'canonical';
  claimId: string;
  reviewedAt: string;
  reviewedBy: string;
  kind?: ClaimKind;
  note: string;
  proofDepth?: Extract<EvidenceDepth['id'], 'direct-proof' | 'reproduction'>;
  evidenceLocator?: {
    type: 'page' | 'paragraph' | 'section' | 'table' | 'series' | 'cell' | 'form' | 'accession' | 'doi' | 'calculation' | 'other';
    value: string;
  };
  sourceUrl?: string;
  sourceDate?: string;
  sourceType?: 'primary' | 'secondary' | 'issuer' | 'dataset';
  reproductionArtifact?: string;
};

const rawEntries = registryData.entries as ClaimReviewEntry[];
const entries = rawEntries.map((entry) => ({ ...entry, status: entry.status === 'canonical' ? 'canonical' as const : 'legacy' as const }));
const canonicalEntries = entries.filter((entry) => entry.status === 'canonical');
const legacyEntries = entries.filter((entry) => entry.status === 'legacy');
const canonicalKinds = new Set<ClaimKind>(['fait', 'estimation', 'inférence', 'scénario']);
const canonicalByArticle = new Map<string, number>();

for (const entry of canonicalEntries) {
  if (!entry.kind || !canonicalKinds.has(entry.kind)) throw new Error(`Review canonique sans type défendable: ${entry.claimId}`);
  if (!entry.proofDepth || !entry.evidenceLocator?.value) throw new Error(`Review canonique sans locator ni profondeur: ${entry.claimId}`);
  if (!entry.sourceUrl || !/^https:\/\//.test(entry.sourceUrl)) throw new Error(`Review canonique sans source HTTPS: ${entry.claimId}`);
  const parsedSourceDate = new Date(`${entry.sourceDate}T00:00:00Z`);
  if (!entry.sourceDate || !/^\d{4}-\d{2}-\d{2}$/.test(entry.sourceDate) || Number.isNaN(parsedSourceDate.getTime()) || parsedSourceDate.toISOString().slice(0, 10) !== entry.sourceDate) {
    throw new Error(`Review canonique sans date source valide: ${entry.claimId}`);
  }
  if (!entry.sourceType) throw new Error(`Review canonique sans type de source: ${entry.claimId}`);
  if (entry.proofDepth === 'reproduction' && !entry.reproductionArtifact) throw new Error(`Reproduction sans artefact: ${entry.claimId}`);
  const articleSlug = entry.claimId.split(':claim-')[0];
  canonicalByArticle.set(articleSlug, (canonicalByArticle.get(articleSlug) || 0) + 1);
}
for (const [articleSlug, count] of canonicalByArticle) {
  if (count > 3) throw new Error(`Plus de trois claims canoniques pour ${articleSlug}: ${count}`);
}

export const claimReviewRegistry = {
  version: registryData.version,
  updated: registryData.updated,
  policy:
    'Une claim ne devient reviewed que si son entrée status=canonical contient un type explicite, une source et sa date, un locator exact et une profondeur direct-proof ou reproduction. Les anciennes revues restent publiées comme legacy mais ne certifient plus les claims. Maximum trois claims canoniques par analyse.',
  entries,
  canonicalEntries,
  legacyEntries,
};

export const claimReviewById = new Map(canonicalEntries.map((entry) => [entry.claimId, entry]));
