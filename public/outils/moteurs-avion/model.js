/* l0g.fr: pedagogical scenario model. All monetary inputs are hypothetical USD.
   Shared by the browser and Node tests. No network, persistence or dependencies. */
(function (root) {
  'use strict';
  const defaults = Object.freeze({days:120, lag:10, contribution:12000, rent:4000, usage:1000, fixed:100000, compensation:1500, deposit:250000, rate:8});
  const limits = Object.freeze({days:[0,730], lag:[0,730], contribution:[0,1000000], rent:[0,1000000], usage:[0,1000000], fixed:[0,100000000], compensation:[0,1000000], deposit:[0,1000000000], rate:[0,100]});
  function calculate(input) {
    if (!input || typeof input !== 'object') throw new TypeError('An input object is required.');
    const x = {};
    for (const key of Object.keys(defaults)) {
      const value = input[key];
      if (typeof value !== 'number' || !Number.isFinite(value)) throw new TypeError('Invalid number: ' + key);
      if (value < limits[key][0] || value > limits[key][1]) throw new RangeError('Out of range: ' + key);
      if ((key === 'days' || key === 'lag') && !Number.isInteger(value)) throw new RangeError('Whole days required: ' + key);
      x[key] = value;
    }
    const restoredDays = Math.max(0, x.days - x.lag);
    const groundCost = x.days * (x.contribution - x.compensation);
    if (!restoredDays) return Object.freeze({feasible:false, restoredDays:0, groundCost, leaseCost:null, benefit:null, breakEvenRent:null, fundingCost:0, depositTiedUp:0, rentalCost:0, usageCost:0, fixedCost:0, initialGroundCost:groundCost});
    const initialGroundCost = x.lag * (x.contribution - x.compensation);
    const rentalCost = restoredDays * x.rent;
    const usageCost = restoredDays * x.usage;
    const fundingCost = x.deposit * (x.rate / 100) * restoredDays / 365;
    const leaseCost = initialGroundCost + rentalCost + usageCost + x.fixed + fundingCost;
    const benefit = groundCost - leaseCost;
    const breakEvenRent = x.contribution - x.compensation - x.usage - (x.fixed + fundingCost) / restoredDays;
    return Object.freeze({feasible:true, restoredDays, groundCost, leaseCost, benefit, breakEvenRent, fundingCost, depositTiedUp:x.deposit, rentalCost, usageCost, fixedCost:x.fixed, initialGroundCost});
  }
  const api = Object.freeze({defaults, limits, calculate});
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.EngineScenario = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
