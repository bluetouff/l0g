/** One-year fictional scenario, in monetary units. No observed company inputs.
 * Receipts and costs are settled within the year. Interest uses opening debt;
 * PIK is added at year-end. No tax, capex, working capital, principal repayment,
 * opening cash or intra-year compounding. This is not a default forecast.
 */
export const BASE = Object.freeze({ revenue: 100, costs: 70, debt: 200 });
export const LIMITS = Object.freeze({
  revenueDrop: Object.freeze([0, 40]), costCut: Object.freeze([0, 30]),
  rate: Object.freeze([2, 20]), pikShare: Object.freeze([0, 100]),
});
export const PRESETS = Object.freeze({
  baseline: Object.freeze({ revenueDrop: 0, costCut: 0, rate: 10, pikShare: 0 }),
  pressure: Object.freeze({ revenueDrop: 15, costCut: 5, rate: 10, pikShare: 0 }),
  adaptation: Object.freeze({ revenueDrop: 10, costCut: 20, rate: 10, pikShare: 0 }),
  deferral: Object.freeze({ revenueDrop: 25, costCut: 0, rate: 10, pikShare: 75 }),
});
/** @param {{revenueDrop: number, costCut: number, rate: number, pikShare: number}} input */
export function calculateSoftwareDebt(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('A parameter object is required.');
  for (const [key, [min, max]] of Object.entries(LIMITS)) {
    if (!Object.hasOwn(input, key)) throw new TypeError(`Missing ${key}.`);
    const value = input[key];
    if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(`${key} must be finite.`);
    if (value < min || value > max) throw new RangeError(`${key} is outside the model bounds.`);
  }
  const revenue = BASE.revenue * (1 - input.revenueDrop / 100);
  const costs = BASE.costs * (1 - input.costCut / 100);
  const operating = revenue - costs;
  const totalInterest = BASE.debt * input.rate / 100;
  const pikInterest = totalInterest * input.pikShare / 100;
  const cashInterest = totalInterest - pikInterest;
  return Object.freeze({ revenue, costs, operating, totalInterest, pikInterest, cashInterest,
    cashResidual: operating - cashInterest, economicResidual: operating - totalInterest,
    endDebt: BASE.debt + pikInterest, coverage: operating / totalInterest });
}
