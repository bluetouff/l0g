export const MICROSOFT_AI_ACCOUNTS_KINDS = Object.freeze(['migrations','segments','allocation','cash','depreciation','leases','openai']);
export const MICROSOFT_AI_ACCOUNTS_SOURCES = Object.freeze(['M02','M02','M03','M03','F04 M03','F03 M03','M03 F05']);
export function microsoftAiAccountsFigureReferences(lang,kind,number,sources,caption) {
 if (typeof lang !== 'string' || !['fr','en'].includes(lang) || typeof kind !== 'string' || !MICROSOFT_AI_ACCOUNTS_KINDS.includes(kind) || typeof number !== 'string' || !/^0[1-7]$/.test(number) || MICROSOFT_AI_ACCOUNTS_KINDS.indexOf(kind)+1!==Number(number) || typeof sources !== 'string' || typeof caption !== 'string' || !caption.trim()) throw new TypeError('Unexpected Microsoft accounts figure');
 const refs=sources.trim()?sources.trim().split(/\s+/):[];
 if (new Set(refs).size!==refs.length || refs.join(' ')!==MICROSOFT_AI_ACCOUNTS_SOURCES[MICROSOFT_AI_ACCOUNTS_KINDS.indexOf(kind)]) throw new TypeError('Invalid Microsoft accounts source references');
 return refs;
}
