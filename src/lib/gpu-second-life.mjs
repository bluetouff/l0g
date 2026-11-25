export const gpuSecondLifeFields = Object.freeze([
  { key: 'cost', initial: 120, min: 0.001, max: 1_000_000, step: 'any' },
  { key: 'originalLife', initial: 6, min: 1, max: 50, step: 'any' },
  { key: 'revisionYear', initial: 2, min: 1, max: 49, step: 1 },
  { key: 'revisedLife', initial: 4, min: 1, max: 50, step: 'any' },
  { key: 'saleYear', initial: 4, min: 1, max: 50, step: 'any' },
  { key: 'salePrice', initial: 12, min: 0, max: 1_000_000, step: 'any' },
]);

/** Amounts are in millions of USD. Years are measured from entry into service. */
export function calculateGpuSecondLife(input) {
  if (!input || !gpuSecondLifeFields.every(({ key, min, max, step }) => {
    const value = input[key];
    return Number.isFinite(value) && value >= min && value <= max
      && (step === 'any' || Number.isInteger(value));
  })) return null;

  const { cost, originalLife, revisionYear, revisedLife, saleYear, salePrice } = input;
  if (revisionYear >= originalLife || revisionYear >= revisedLife || saleYear < revisionYear) {
    return null;
  }

  const bookAtRevision = cost * (originalLife - revisionYear) / originalLife;
  const originalBookAtSale = cost * Math.max(0, originalLife - saleYear) / originalLife;
  const revisedRemainingLife = revisedLife - revisionYear;
  const revisedBookAtSale = bookAtRevision * Math.max(0, revisedLife - saleYear) / revisedRemainingLife;

  return {
    bookAtRevision,
    originalAnnual: cost / originalLife,
    revisedAnnual: bookAtRevision / revisedRemainingLife,
    originalBookAtSale,
    revisedBookAtSale,
    originalSaleResult: salePrice - originalBookAtSale,
    revisedSaleResult: salePrice - revisedBookAtSale,
    netCost: cost - salePrice,
  };
}
