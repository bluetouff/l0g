export const PC_AI_MEMORY_KINDS = Object.freeze(['index', 'wafers', 'chain', 'average', 'model']);
export const PC_AI_MEMORY_SOURCES = Object.freeze([
  Object.freeze(['R01', 'R03', 'R16', 'R17']), Object.freeze(['R04', 'R14']),
  Object.freeze(['R05', 'R06', 'R09', 'R10', 'R11', 'R12']), Object.freeze(['R11']), Object.freeze([]),
]);
export function pcAiMemoryFigureReferences(lang, kind, number, sources, caption, method) {
  if (!['fr', 'en'].includes(lang) || !PC_AI_MEMORY_KINDS.includes(kind)) throw new TypeError('Unknown PC memory figure');
  const index = PC_AI_MEMORY_KINDS.indexOf(kind);
  if (number !== index + 1 || !Array.isArray(sources) || sources.length !== PC_AI_MEMORY_SOURCES[index].length || sources.some((source, i) => source !== PC_AI_MEMORY_SOURCES[index][i])) throw new TypeError('Figure order or references drifted');
  if (typeof caption !== 'string' || !caption.trim() || caption.length > 1800 || typeof method !== 'string' || !method.trim() || method.length > 5000) throw new TypeError('Reviewed caption and method required');
  return [...PC_AI_MEMORY_SOURCES[index]];
}
