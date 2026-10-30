export const SMALL_PARCELS_KINDS = Object.freeze(['timeline','lines','volumes','logistics','incidence']);
export const SMALL_PARCELS_SOURCES = Object.freeze([
 Object.freeze(['R01','R03','R09','R10']),Object.freeze(['R01','R02','R06','R07']),Object.freeze(['R12']),Object.freeze(['R05','R06','R07']),Object.freeze(['R01','R08']),
]);
export function smallParcelsFigureReferences(lang,kind,number,sources,caption,method){
 if(!['fr','en'].includes(lang)||!SMALL_PARCELS_KINDS.includes(kind))throw new TypeError('Unknown small-parcel figure');
 const index=SMALL_PARCELS_KINDS.indexOf(kind),expected=SMALL_PARCELS_SOURCES[index];
 if(number!==index+1||!Array.isArray(sources)||sources.length!==expected.length||sources.some((value,i)=>value!==expected[i]))throw new TypeError('Reviewed figure order and references required');
 if(typeof caption!=='string'||!caption.trim()||caption.length>2000||typeof method!=='string'||!method.trim()||method.length>6000)throw new TypeError('Reviewed caption and method required');
 return [...expected];
}
