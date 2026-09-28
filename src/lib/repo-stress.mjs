/**
 * Educational, isolated cash-bond/repo balance sheet. Amounts: EUR millions.
 * No hedges, interest, settlement delays, portfolio netting or endogenous price impact.
 * Haircut reset is assumed contractually permitted, or applied at refinancing.
 * No data retrieval, state persistence, or investment/probability output.
 */
export const DEFAULT_REPO_INPUT = Object.freeze({position:100, haircutBefore:2, haircutAfter:5, priceFall:2, cashBuffer:1});
export const REPO_LIMITS = Object.freeze({position:Object.freeze([1,10000]), haircutBefore:Object.freeze([1,20]), haircutAfter:Object.freeze([1,40]), priceFall:Object.freeze([0,10]), cashBuffer:Object.freeze([0,10000])});

export function validateRepoInput(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('Invalid input object');
  for (const [key, [min,max]] of Object.entries(REPO_LIMITS)) {
    if (!Object.hasOwn(input, key)) throw new TypeError(`Missing ${key}`);
    const value = input[key];
    if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) {
      throw new RangeError(`Invalid ${key}`);
    }
  }
  if (input.haircutAfter < input.haircutBefore) throw new RangeError('Haircut must not decrease in this adverse-scenario model');
  if (input.cashBuffer > input.position) throw new RangeError('Cash buffer exceeds initial position');
}

export function calculateRepoStress(input) {
  validateRepoInput(input);
  const {position:V0, haircutBefore, haircutAfter, priceFall, cashBuffer:B} = input;
  const h0 = haircutBefore / 100, h1 = haircutAfter / 100, p = priceFall / 100;
  const debtBefore = V0 * (1-h0);
  const valueAfter = V0 * (1-p);
  const loanCapacity = valueAfter * (1-h1);
  const liquidityCall = Math.max(0, debtBefore-loanCapacity);
  const cashUsed = Math.min(B, liquidityCall);
  const gap = Math.max(0, liquidityCall-cashUsed);
  // A sale of X pays down X of debt but also removes (1-h1)*X of borrowing capacity.
  const requiredSale = gap/h1;
  const tolerance = 1e-9*V0;
  const feasible = requiredSale <= valueAfter + tolerance;
  const sale = Math.min(valueAfter, requiredSale);
  const remainingCollateral = Math.max(0, valueAfter-sale);
  const remainingDebt = Math.max(0, debtBefore-cashUsed-sale);
  const uncoveredDebt = feasible ? 0 : remainingDebt;
  return Object.freeze({
    valueBefore:V0, debtBefore, equityInPosition:V0-debtBefore, cashBuffer:B,
    valueAfter, loanCapacity, liquidityCall, cashUsed, gap, requiredSale, sale,
    remainingCollateral, remainingDebt, uncoveredDebt, feasible,
    saleShare: sale/valueAfter,
    priceLoss:V0-valueAfter,
    priceContribution:(1-h0)*(V0-valueAfter),
    haircutContribution:(h1-h0)*valueAfter,
    positionLeverage:1/h0,
    totalOwnFundsAfter: valueAfter-debtBefore+B,
    unusedCash: B-cashUsed
  });
}
