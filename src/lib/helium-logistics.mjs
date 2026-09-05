/** Illustrative steady-flow model. One unit is one baseline day of demand.
 * No physical helium losses or prices are inferred. Fleet=baseline fleet+extra.
 */
export const defaults=Object.freeze({delay:15,extraFleet:0,origin:100,buffer:10});
export const cases=Object.freeze([
 Object.freeze({delay:0,extraFleet:0,origin:100,buffer:10}),
 defaults,
 Object.freeze({delay:15,extraFleet:50,origin:100,buffer:10}),
 Object.freeze({delay:15,extraFleet:50,origin:70,buffer:10})
]);
export function simulateHelium(input={}) {
 const p={...defaults,...input};
 for(const [key,max] of Object.entries({delay:90,extraFleet:100,origin:100,buffer:60})) {
  if(typeof p[key]!=='number'||!Number.isFinite(p[key])||p[key]<0||p[key]>max)throw new RangeError(`Invalid ${key}`);
 }
 const normalCycle=30,horizon=90,cycle=normalCycle+p.delay;
 const transport=(1+p.extraFleet/100)*normalCycle/cycle;
 const origin=p.origin/100;
 const delivered=Math.min(1,transport,origin);
 const deficit=Math.max(0,1-delivered);
 const stockout=deficit<1e-12?null:p.buffer/deficit;
 const schedule=[0,15,30,45,60,75,90].map(day=>({day,stock:Math.max(0,p.buffer-deficit*day),unserved:Math.max(0,deficit*day-p.buffer)}));
 return {cycle,horizon,transport:transport*100,origin:p.origin,delivered:delivered*100,deficit:deficit*100,stockout,remaining:schedule.at(-1).stock,unserved:schedule.at(-1).unserved,schedule};
}
