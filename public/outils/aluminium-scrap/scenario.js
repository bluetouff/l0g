/* l0g.fr | Pure, deterministic material-balance model. No market calibration. */
(function (root) {
  'use strict';
  const bounds = Object.freeze({q: [0, 1e8], a: [0, 100], c: [0, 1e8], d: [0, 1e8], y: [0, 100]});
  /**
   * @param {{q:number,a:number,c:number,d:number,y:number}} input
   * q,c,d: tonnes of incoming scrap equivalent over the same horizon.
   * a: compatible fraction after sorting (%); y: output recovery yield (%).
   * Capacity and demand are ADDITIONAL, net of already committed activity.
   * Residuals are outside the selected route, not necessarily permanent losses.
   */
  function compute(input) {
    if (!input || typeof input !== 'object') throw new TypeError('Expected a scenario object.');
    const v = {};
    for (const [key, [min, max]] of Object.entries(bounds)) {
      const x = input[key];
      if (typeof x !== 'number' || !Number.isFinite(x) || x < min || x > max) {
        throw new RangeError(`${key} must be a finite number between ${min} and ${max}.`);
      }
      v[key] = x;
    }
    const compatible = v.q * v.a / 100;
    const treated = Math.min(compatible, v.c, v.d);
    const metal = treated * v.y / 100;
    const residual = treated - metal;
    const unassigned = v.q - treated;
    const epsilon = Math.max(1, v.q, v.c, v.d) * 1e-10;
    const constraints = [['quality', compatible], ['capacity', v.c], ['outlets', v.d]];
    const binding = v.q === 0 ? [] : constraints.filter(([, x]) => Math.abs(x - treated) <= epsilon).map(([k]) => k);
    return Object.freeze({compatible, treated, metal, residual, unassigned, binding,
      recoveredShare: v.q > 0 ? metal / v.q * 100 : 0,
      balanceError: v.q - metal - residual - unassigned});
  }
  const api = Object.freeze({compute, bounds});
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.AluminiumScenario = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
