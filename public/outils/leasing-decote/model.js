/* Educational depreciation model. Monetary inputs use one consistent tax basis.
 * No market data, financing, taxes, services, return fees or profit margin.
 * A conventional depreciating asset is required: 0 <= resale <= purchase.
 * The same whole-month duration is applied to A and B. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.L0gLeaseDepreciation = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const limits = Object.freeze({ minPurchase: 1, maxPurchase: 1000000, minMonths: 1, maxMonths: 120 });
  const defaults = Object.freeze({ purchaseA: 30000, resaleA: 18000, purchaseB: 27000, resaleB: 12000, months: 36 });
  function finite(value, name) {
    if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError(name);
    return value;
  }
  function evaluate(input) {
    if (!input || typeof input !== 'object') throw new TypeError('input');
    const months = finite(input.months, 'months');
    if (!Number.isInteger(months) || months < limits.minMonths || months > limits.maxMonths) throw new RangeError('months');
    function scenario(letter) {
      const purchase = finite(input['purchase' + letter], 'purchase' + letter);
      const resale = finite(input['resale' + letter], 'resale' + letter);
      if (purchase < limits.minPurchase || purchase > limits.maxPurchase) throw new RangeError('purchase' + letter);
      if (resale < 0 || resale > purchase) throw new RangeError('resale' + letter);
      const depreciation = purchase - resale;
      return Object.freeze({ purchase, resale, depreciation, monthly: depreciation / months });
    }
    const a = scenario('A'), b = scenario('B');
    const resaleThresholdB = b.purchase - a.depreciation;
    return Object.freeze({
      a, b, months,
      monthlyDifference: (b.depreciation - a.depreciation) / months,
      purchaseDifference: b.purchase - a.purchase,
      resaleDifference: b.resale - a.resale,
      depreciationDifference: b.depreciation - a.depreciation,
      per1000Monthly: 1000 / months,
      resaleThresholdB,
      thresholdFeasible: resaleThresholdB >= 0 && resaleThresholdB <= b.purchase
    });
  }
  return Object.freeze({ evaluate, defaults, limits });
});
