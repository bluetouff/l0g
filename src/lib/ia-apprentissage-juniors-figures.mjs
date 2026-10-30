export const LEARNING_JUNIORS_KINDS = Object.freeze(['loop','employment','learning','diagnosis','time']);
export const LEARNING_JUNIORS_SOURCES = Object.freeze([
 Object.freeze(['R01','R02']),Object.freeze(['R03']),Object.freeze(['R11']),Object.freeze(['R01','R02']),Object.freeze([]),
]);
export function learningJuniorsFigureReferences(lang,kind,number,sources,caption,method){
 if(!['fr','en'].includes(lang)||!LEARNING_JUNIORS_KINDS.includes(kind))throw new TypeError('Unknown AI learning figure');
 const index=LEARNING_JUNIORS_KINDS.indexOf(kind),expected=LEARNING_JUNIORS_SOURCES[index];
 if(number!==index+1||!Array.isArray(sources)||sources.length!==expected.length||sources.some((value,i)=>value!==expected[i]))throw new TypeError('Reviewed figure order and references required');
 if(typeof caption!=='string'||!caption.trim()||caption.length>2000||typeof method!=='string'||!method.trim()||method.length>6000)throw new TypeError('Reviewed caption and method required');
 return [...expected];
}
