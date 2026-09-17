/** Fixed local destination only. Unknown fragments remain on the collection. */
export function legacyAtlasDestination(hash: string): string | null {
  if (hash.length > 1200) return null;
  const destination = '/atlas/financement-ia/';
  if (/^#(?:preuve-[a-z0-9-]+|atlas-relations)$/.test(hash)) return destination + hash;
  const input = new URLSearchParams(hash.replace(/^#/, ''));
  const output = new URLSearchParams();
  const date = input.get('date');
  const relation = input.get('relation');
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) output.set('date', date);
  if (relation && /^[a-z0-9-]+$/.test(relation)) output.set('relation', relation);
  if (!output.size) return null;
  if (input.get('scenario') === 'default') output.set('scenario', 'default');
  return `${destination}#${output}`;
}
