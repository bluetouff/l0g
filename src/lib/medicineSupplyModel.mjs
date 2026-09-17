/** Deterministic teaching model. All quantities are fictitious product units, not patient doses. */
export const DEFAULTS = Object.freeze({dailyDemand:1000,stockDays:14,outageDays:60,lostShare:60,backupShare:20,backupDelayDays:14});
export function validateInputs(input) {
  const limits = {dailyDemand:[1,1e9],stockDays:[0,365],outageDays:[1,365],lostShare:[0,100],backupShare:[0,100],backupDelayDays:[0,365]};
  if (input === null || typeof input !== 'object' || Array.isArray(input) ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(input)) ||
      Object.keys(input).some(key => !Object.hasOwn(DEFAULTS, key))) {
    throw new RangeError('Invalid simulation configuration.');
  }
  const p = {...DEFAULTS,...input};
  for (const [key,[min,max]] of Object.entries(limits)) {
    if (typeof p[key] !== 'number' || !Number.isFinite(p[key]) || p[key]<min || p[key]>max || !Number.isInteger(p[key])) {
      throw new RangeError(`${key} must be an integer between ${min} and ${max}.`);
    }
  }
  return p;
}
export function simulateSupply(input = {}) {
  const p = validateInputs(input);
  const effectiveBackupShare = Math.min(p.backupShare,p.lostShare);
  const baseFlow = p.dailyDemand*(1-p.lostShare/100);
  let stock = p.dailyDemand*p.stockDays, totalDelivered=0, totalUnmet=0, firstShortage=null, shortageDays=0;
  const initialStock = stock;
  const eps = 1e-9 * Math.max(1,p.dailyDemand);
  const rows=[];
  for(let day=1;day<=p.outageDays;day++) {
    const backupFlow = day>p.backupDelayDays ? p.dailyDemand*effectiveBackupShare/100 : 0;
    const beginningStock=stock, inflow=baseFlow+backupFlow;
    const delivered=Math.min(p.dailyDemand,Math.max(0,stock+inflow));
    const unmet=Math.max(0,p.dailyDemand-delivered);
    stock=Math.max(0,stock+inflow-delivered);
    if(stock<eps) stock=0;
    if(unmet>eps) { firstShortage ??= day; shortageDays++; }
    totalDelivered+=delivered; totalUnmet+=unmet;
    rows.push({day,beginningStock,baseFlow,backupFlow,inflow,demand:p.dailyDemand,delivered,unmet,endingStock:stock,cumulativeUnmet:totalUnmet});
  }
  return {inputs:p,effectiveBackupShare,initialStock,endingStock:stock,totalDelivered,totalUnmet,firstShortage,shortageDays,serviceRate:totalDelivered/(p.dailyDemand*p.outageDays),rows};
}
export function compareSupply(input={}) {
  const p=validateInputs(input);
  return {baseline:simulateSupply({...p,backupShare:0}),backup:simulateSupply(p)};
}
export function csvSupply(input={}) {
  const {baseline,backup}=compareSupply(input);
  const lines=['day,demand,baseline_inflow,baseline_stock_end,baseline_delivered,baseline_unmet,backup_inflow,backup_stock_end,backup_delivered,backup_unmet'];
  for(let i=0;i<baseline.rows.length;i++) {
    const a=baseline.rows[i],b=backup.rows[i];
    lines.push([a.day,a.demand,a.inflow,a.endingStock,a.delivered,a.unmet,b.inflow,b.endingStock,b.delivered,b.unmet].map(v=>Number(v.toFixed(8))).join(','));
  }
  return lines.join('\n')+'\n';
}
