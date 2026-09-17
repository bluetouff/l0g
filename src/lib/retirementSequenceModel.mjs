/** Deterministic educational model. No market data, probabilities or advice. */
export const SEQUENCE_VERSION = '1.0.0';
export const LONG_RETURNS = Object.freeze([-20,-10,5,8,12,10,7,15,4,11,6,9,3,14,8,5,12,6,10,7,9,4,13,8,11,5,15,6,12,9]);
export const BASE_SEQUENCE_INPUT = Object.freeze({initial:200000, withdrawal:10000, inflation:2, fee:0, mode:'fixed', returns:LONG_RETURNS});

/** @param {string} text @returns {number[]} Percentages, separated by semicolons or whitespace. */
export function parseSequence(text) {
  if (typeof text !== 'string' || text.length > 4096 || !text.trim()) throw new Error('series');
  const tokens = text.trim().split(/[;\s]+/u).filter(Boolean);
  if (tokens.length < 2 || tokens.length > 60) throw new Error('length');
  return tokens.map(token => {
    const clean = token.replace(/%$/u,'').replace(/,/g,'.').replace(/−/g,'-');
    if (!/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(clean)) throw new Error('series');
    const n=Number(clean);
    if (!Number.isFinite(n) || n < -100 || n > 300) throw new Error('returns');
    return n;
  });
}
export function validateSequenceInput(input) {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) throw new Error('series');
  for (const key of ['initial','withdrawal','inflation','fee','mode','returns']) if (!Object.hasOwn(input,key)) throw new Error('series');
  for (const key of ['initial','withdrawal','inflation','fee']) if (!Number.isFinite(input[key])) throw new Error(key);
  if (input.initial < 100 || input.initial > 10000000) throw new Error('initial');
  if (input.withdrawal < 0 || input.withdrawal > 1000000) throw new Error('withdrawal');
  if (input.inflation < 0 || input.inflation > 15) throw new Error('inflation');
  if (input.fee < 0 || input.fee > 5) throw new Error('fee');
  if (!['fixed','proportional'].includes(input.mode)) throw new Error('mode');
  if (input.mode === 'proportional' && input.withdrawal >= input.initial) throw new Error('proportion');
  if (!Array.isArray(input.returns) || input.returns.length < 2 || input.returns.length > 60) throw new Error('length');
  for (let i=0; i<input.returns.length; i++) {
    if (!Object.hasOwn(input.returns,i) || !Number.isFinite(input.returns[i]) || input.returns[i] < -100 || input.returns[i] > 300) throw new Error('returns');
  }
  return input;
}
/** Returns are nominal total returns, before the optional annual fee. Withdrawals are at year end.
 * The first budget is withdrawal; budget in year t is withdrawal*(1+inflation)^(t-1).
 * The real closing balance is deflated to time 0 by (1+inflation)^t.
 * In proportional mode the withdrawal fraction is withdrawal/initial and is applied after return/fee.
 * Payments cannot exceed available assets. No negative balances, borrowing or later replenishment.
 */
export function runSequence(input) {
  validateSequenceInput(input);
  const {initial,withdrawal,inflation,fee,mode,returns}=input;
  let capital=initial, totalPaid=0, totalShortfall=0, firstUnfunded=null, firstBudgetGap=null, firstExhaustion=null;
  const fraction=withdrawal/initial, inflationFactor=1+inflation/100, feeFactor=1-fee/100;
  const rows=returns.map((r,index)=>{
    const year=index+1, opening=capital;
    const available=Math.max(0,opening*(1+r/100)*feeFactor);
    const budget=withdrawal*Math.pow(inflationFactor,index);
    const requested=mode==='fixed' ? budget : available*fraction;
    const paid=Math.min(available,requested);
    const shortfall=Math.max(0,budget-paid);
    capital=Math.max(0,available-paid);
    if (paid < requested-0.000001 && firstUnfunded===null) firstUnfunded=year;
    if (shortfall > 0.000001 && firstBudgetGap===null) firstBudgetGap=year;
    if (capital===0 && firstExhaustion===null) firstExhaustion=year;
    totalPaid+=paid; totalShortfall+=shortfall;
    return {year,returnPct:r,opening,available,budget,requested,paid,shortfall,closing:capital,realClosing:capital/Math.pow(inflationFactor,year)};
  });
  const growth=returns.reduce((product,r)=>product*(1+r/100),1);
  return {rows,closing:capital,realClosing:rows.at(-1).realClosing,totalPaid,totalShortfall,firstUnfunded,firstBudgetGap,firstExhaustion,
    arithmetic:returns.reduce((a,b)=>a+b,0)/returns.length,cagr:(Math.pow(growth,1/returns.length)-1)*100,
    netCagr:(Math.pow(growth,1/returns.length)*feeFactor-1)*100,fraction,years:returns.length};
}
export function compareSequences(input) {
  validateSequenceInput(input);
  return {a:runSequence({...input,returns:[...input.returns]}),b:runSequence({...input,returns:[...input.returns].reverse()})};
}
export function sequenceCSV(input) {
  const compared=compareSequences(input);
  const header=['sequence','year','return_pct','initial_eur','first_budget_eur','inflation_pct','annual_fee_pct','mode','budget_nominal_eur','requested_nominal_eur','paid_nominal_eur','budget_gap_nominal_eur','closing_nominal_eur','closing_time0_eur'];
  const rows=[header.join(',')];
  for(const [label,result] of [['A',compared.a],['B',compared.b]]) for(const r of result.rows) rows.push([label,r.year,r.returnPct,input.initial,input.withdrawal,input.inflation,input.fee,input.mode,r.budget.toFixed(8),r.requested.toFixed(8),r.paid.toFixed(8),r.shortfall.toFixed(8),r.closing.toFixed(8),r.realClosing.toFixed(8)].join(','));
  return rows.join('\n')+'\n';
}
