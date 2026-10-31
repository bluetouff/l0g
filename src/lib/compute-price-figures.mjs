export const COMPUTE_PRICE_KINDS=Object.freeze(['prices','maturities','risk','stress','matrix']);
export const COMPUTE_PRICE_SOURCES=Object.freeze([Object.freeze(['S05']),Object.freeze(['S01']),Object.freeze(['S03','S04']),Object.freeze([]),Object.freeze([])]);
export function computePriceFigureReferences(lang,kind,number,sources,caption,method){
 if(!['fr','en'].includes(lang)||!COMPUTE_PRICE_KINDS.includes(kind))throw new TypeError('Unknown compute-price scene');
 const index=COMPUTE_PRICE_KINDS.indexOf(kind),expected=COMPUTE_PRICE_SOURCES[index];
 if(number!==index+1||!Array.isArray(sources)||sources.length!==expected.length||sources.some((v,i)=>v!==expected[i]))throw new TypeError('Reviewed scene order and source set required');
 if(typeof caption!=='string'||!caption.trim()||caption.length>2000||typeof method!=='string'||!method.trim()||method.length>6000)throw new TypeError('Reviewed caption and method required');return[...expected];
}
