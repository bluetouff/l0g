export interface RefinancingParams {
  stock: number;
  oldRate: number;
  newRate: number;
  slowShare: number;
  fastShare: number;
  years: number;
}

export interface RefinancingYear {
  year: number;
  slowRepricedShare: number;
  fastRepricedShare: number;
  slowEffectiveRate: number;
  fastEffectiveRate: number;
  slowInterest: number;
  fastInterest: number;
  slowExtraInterest: number;
  fastExtraInterest: number;
}

function finite(name: string, value: number): void {
  if (!Number.isFinite(value)) throw new TypeError(`${name} must be finite`);
}

export function validateRefinancingParams(p: RefinancingParams): void {
  finite('stock', p.stock);
  finite('oldRate', p.oldRate);
  finite('newRate', p.newRate);
  finite('slowShare', p.slowShare);
  finite('fastShare', p.fastShare);
  finite('years', p.years);
  if (p.stock <= 0) throw new RangeError('stock must be greater than zero');
  if (p.oldRate < -5 || p.oldRate > 100) throw new RangeError('oldRate outside supported range');
  if (p.newRate < -5 || p.newRate > 100) throw new RangeError('newRate outside supported range');
  if (p.slowShare <= 0 || p.slowShare > 100) throw new RangeError('slowShare must be in (0, 100]');
  if (p.fastShare <= 0 || p.fastShare > 100) throw new RangeError('fastShare must be in (0, 100]');
  if (!Number.isInteger(p.years) || p.years < 1 || p.years > 30) throw new RangeError('years must be an integer from 1 to 30');
}

function path(stock: number, oldRate: number, newRate: number, annualShare: number, year: number) {
  const repricedShare = Math.min(1, (annualShare / 100) * year);
  const effectiveRate = oldRate * (1 - repricedShare) + newRate * repricedShare;
  const interest = stock * effectiveRate / 100;
  const baselineInterest = stock * oldRate / 100;
  return {
    repricedShare,
    effectiveRate,
    interest,
    extraInterest: interest - baselineInterest,
  };
}

export function simulateRefinancing(p: RefinancingParams): RefinancingYear[] {
  validateRefinancingParams(p);
  const rows: RefinancingYear[] = [];
  for (let year = 1; year <= p.years; year += 1) {
    const slow = path(p.stock, p.oldRate, p.newRate, p.slowShare, year);
    const fast = path(p.stock, p.oldRate, p.newRate, p.fastShare, year);
    rows.push({
      year,
      slowRepricedShare: slow.repricedShare,
      fastRepricedShare: fast.repricedShare,
      slowEffectiveRate: slow.effectiveRate,
      fastEffectiveRate: fast.effectiveRate,
      slowInterest: slow.interest,
      fastInterest: fast.interest,
      slowExtraInterest: slow.extraInterest,
      fastExtraInterest: fast.extraInterest,
    });
  }
  return rows;
}
