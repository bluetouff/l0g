/**
 * l0g · Chapter 9 · Deliberately illustrative principal-flow accounting.
 * All money inputs are USD billions. Valuation/FX/coupons/defaults excluded.
 * Original holdings repay the same principal each year (0–20% of opening stock).
 * Newly purchased bonds mature beyond the selected 1–5 year horizon.
 */
export const defaults = Object.freeze({stock:400,maturity:10,newMoney:20,allocation:0,reinvest:100,years:3});
export const limits = Object.freeze({stock:[100,2000],maturity:[0,20],newMoney:[0,100],allocation:[0,100],reinvest:[0,100],years:[1,5]});
export function simulatePurchases(input={}) {
 const p={...defaults,...input};
 for(const [key,[min,max]] of Object.entries(limits)) {
  if(typeof p[key]!=='number'||!Number.isFinite(p[key])||p[key]<min||p[key]>max) throw new RangeError(`Invalid ${key}`);
 }
 if(!Number.isInteger(p.years))throw new RangeError('Invalid years');
 const maturities=p.stock*p.maturity/100;
 const rolled=maturities*p.reinvest/100;
 const newAllocated=p.newMoney*p.allocation/100;
 const purchases=rolled+newAllocated;
 const baselinePurchases=maturities+p.newMoney;
 const annualNet=purchases-maturities;
 const annualForgone=baselinePurchases-purchases;
 const schedule=Array.from({length:p.years+1},(_,year)=>({year,baseline:p.stock+year*p.newMoney,scenario:p.stock+year*annualNet,forgone:year*annualForgone}));
 const last=schedule.at(-1);
 return {params:p,maturities,rolled,newAllocated,purchases,baselinePurchases,annualNet,annualForgone,closing:last.scenario,baselineClosing:last.baseline,cumulativeForgone:last.forgone,activeSales:0,schedule};
}
