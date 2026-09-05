/**
 * l0g educational stress test, v1.0.0, 2026-09-05.
 * Initial USD bond sleeve N=100; initial local currency/USD spot S0=1.
 * Fixed USD principal hedge, no carry or forward-curve repricing.
 * Market shock is instantaneous; cash is checked over a chosen five-day window.
 * All cash inputs are local-currency units per initial 100 bond units.
 * Not a full balance sheet, capital ratio, institutional estimate or forecast.
 */
export const VERSION = '1.0.0';
export const DEFAULTS = Object.freeze({fx:-10, rate:100, spread:100, hedge:70, cash:5, outflow:8, otherMargin:2, available:25, discount:2, maturity:40, noRoll:25});
export const LIMITS = Object.freeze({fx:[-20,20],rate:[-150,150],spread:[0,300],hedge:[0,100],cash:[0,20],outflow:[0,30],otherMargin:[0,20],available:[0,100],discount:[0,10],maturity:[0,100],noRoll:[0,100]});
export const PRESETS = Object.freeze({
  fxOnly: {...DEFAULTS,rate:0,spread:0,outflow:0,otherMargin:0},
  combined: {...DEFAULTS},
  dollarUp: {...DEFAULTS,fx:10},
  delayed: {...DEFAULTS,available:0},
});
export function calculate(input={}) {
  const p={};
  for(const [key,[lo,hi]] of Object.entries(LIMITS)) {
    const value=input[key] ?? DEFAULTS[key];
    if(typeof value!=='number' || !Number.isFinite(value) || value<lo || value>hi) throw new RangeError(`Invalid ${key}`);
    p[key]=value;
  }
  const n=100, fx=p.fx/100, h=p.hedge/100, spot=1+fx;
  // Modified rate duration 7; credit share 30%; spread duration 6.
  const rateEffect=-n*7*p.rate/10000;
  const creditEffect=-n*0.3*6*p.spread/10000;
  const usdBond=n+rateEffect+creditEffect;
  const localBond=usdBond*spot;
  const fxEffect=usdBond*fx;
  const hedgePnl=-n*h*fx;
  const pnl=localBond-n+hedgePnl;
  const usableGain=Math.max(hedgePnl,0)*p.available/100;
  // Assumes full payment of any adverse FX-hedge variation within the window.
  // This is a disclosed stress convention, not a universal CSA provision.
  const fxPayment=Math.max(-hedgePnl,0);
  const resources=p.cash+usableGain;
  const needs=p.outflow+p.otherMargin+fxPayment;
  const cashBalance=resources-needs;
  const gap=Math.max(-cashBalance,0);
  const saleFairValue=Math.min(gap/(1-p.discount/100),localBond);
  const saleProceeds=saleFairValue*(1-p.discount/100);
  const saleLoss=saleFairValue-saleProceeds;
  const remainingGap=Math.max(gap-saleProceeds,0);
  const dueUsd=n*h*p.maturity/100;
  const noRollUsd=dueUsd*p.noRoll/100;
  return {...p,spot,rateEffect,creditEffect,usdBond,localBond,fxEffect,hedgePnl,pnl,usableGain,fxPayment,resources,needs,cashBalance,gap,saleFairValue,saleProceeds,saleLoss,remainingGap,pnlAfterSale:pnl-saleLoss,dueUsd,noRollUsd};
}
