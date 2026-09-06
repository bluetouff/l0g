/* l0g educational batch-financing model. No market data, no network, no storage.
 * Units: metric tonnes, USD/t, GHS/t, GHS/USD, GHS; simple annual interest, ACT/365.
 * All costs are paid at t0. The buyer's advance is part of (not additional to) revenue.
 * The required loan remains available until final collection; rollover risk is excluded.
 * A credit shortfall makes ALL calculated economics conditional on obtaining that loan.
 */
(function(root,factory){
  'use strict';
  const api=factory();
  if(typeof module==='object' && module.exports) module.exports=api;
  else root.CocoaModel=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  'use strict';
  const defaults=Object.freeze({tonnes:100,farmgate:40000,other:3000,saleUsd:5000,fx:10,ownCash:300000,creditLimit:4000000,advancePct:0,annualRate:24,days:90});
  const bounds=Object.freeze({tonnes:[0.001,1000000],farmgate:[0,1000000],other:[0,1000000],saleUsd:[0,1000000],fx:[0.001,10000],ownCash:[0,1000000000000],creditLimit:[0,1000000000000],advancePct:[0,100],annualRate:[0,200],days:[0,1095]});
  const keys=Object.freeze(Object.keys(defaults));
  function validate(input){
    if(!input || typeof input!=='object' || Array.isArray(input))throw new TypeError('input');
    const p={};
    for(const key of keys){
      const v=input[key];
      if(typeof v!=='number'||!Number.isFinite(v)||v<bounds[key][0]||v>bounds[key][1])throw new RangeError(key);
      p[key]=v;
    }
    if(p.tonnes*(p.farmgate+p.other)>1e13 || p.tonnes*p.saleUsd*p.fx>1e13)throw new RangeError('scale');
    return p;
  }
  function calculate(input){
    const p=validate(input),a=p.advancePct/100;
    const cost=p.tonnes*(p.farmgate+p.other);
    const revenue=p.tonnes*p.saleUsd*p.fx;
    const advance=revenue*a;
    const requiredLoan=Math.max(0,cost-p.ownCash-advance);
    const fundingGap=Math.max(0,requiredLoan-p.creditLimit);
    const openingSurplus=Math.max(0,p.ownCash+advance-cost);
    const interest=requiredLoan*(p.annualRate/100)*p.days/365;
    const operatingMargin=revenue-cost;
    const result=operatingMargin-interest;
    const remainingReceipt=revenue-advance;
    const finalCash=openingSurplus+remainingReceipt-requiredLoan-interest;
    const repaymentShortfall=Math.max(0,-finalCash);
    const k=(p.annualRate/100)*p.days/365;
    const debtAtCost=Math.max(0,cost-p.ownCash-a*cost);
    const breakEvenRevenue=debtAtCost===0?cost:(cost*(1+k)-p.ownCash*k)/(1+a*k);
    const breakEvenUsd=breakEvenRevenue/(p.tonnes*p.fx);
    let breakEvenDays=null,horizon;
    if(operatingMargin<0){horizon='already_negative';}
    else if(requiredLoan===0||p.annualRate===0){horizon='no_interest_limit';}
    else{breakEvenDays=operatingMargin*365/(requiredLoan*(p.annualRate/100));horizon='finite';}
    const fundable=fundingGap<=1e-7;
    const profitable=result>=-1e-7;
    const status=!fundable?(profitable?'gap_profitable':'gap_loss'):(profitable?'fundable_profitable':'fundable_loss');
    const out={cost,revenue,advance,requiredLoan,fundingGap,openingSurplus,interest,operatingMargin,result,remainingReceipt,finalCash,repaymentShortfall,breakEvenRevenue,breakEvenUsd,breakEvenDays,horizon,fundable,profitable,status};
    for(const [key,v] of Object.entries(out))if(typeof v==='number'&&!Number.isFinite(v))throw new RangeError(key);
    return out;
  }
  return Object.freeze({defaults,bounds,keys,calculate,validate,version:'1.0.0'});
});
