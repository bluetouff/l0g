/** Reader-facing names for the existing public files. Routes and schemas stay canonical. */
export const datasetTitles: Record<string, string> = {
  'black-box.json':'Les publications archivées',
  'risk-diff.json':'Les mouvements du risque',
  'risk.json':'Les signaux courants',
  'debt-risk.json':'Le risque de dette américaine',
  'confluence.json':'La confluence des déclarations SEC',
  'risk-events.json':'Les changements de niveau',
  'history.ndjson':'Le journal opérationnel',
  'signals/history.json':'L’historique des signaux',
  'signals/history.ndjson':'Les observations en flux',
  'signals/history.csv':'Les observations en tableau',
  'catalog.json':'Le catalogue des publications',
  'search-index.json':'L’index de recherche bilingue',
  'claims.json':'Les affirmations et leurs références',
  'evidence-graph.json':'Le graphe documentaire',
  'catalog.ndjson':'Le catalogue en flux',
  'claims.ndjson':'Les affirmations en flux',
  'evidence-graph.ndjson':'Le graphe en flux',
  'sources.json':'Les sources citées',
  'freshness.json':'La fraîcheur du corpus',
  'integrity.json':'Les empreintes des fichiers',
  'changes.json':'Les publications et révisions',
  'changes.ndjson':'Le journal des révisions en flux',
};

/** Keep only public, documented fields from actual records; never synthesize a value. */
export function riskRecordPreview(indices: unknown): string | undefined {
  if(!Array.isArray(indices))return undefined;
  const records=indices.slice(0,2).flatMap(value=>{
    if(!value||typeof value!=='object')return [];
    const item=value as Record<string,unknown>;
    if(typeof item.key!=='string'||item.key.length>100)return [];
    const record:Record<string,unknown>={key:item.key};
    for(const key of ['value','scale'])if(item[key]===null||typeof item[key]==='number'&&Number.isFinite(item[key]))record[key]=item[key];
    for(const key of ['sourceUpdatedAt','sourceStatus'])if(typeof item[key]==='string'&&item[key].length<=100)record[key]=item[key];
    return [record];
  });
  return records.length?JSON.stringify(records,null,2):undefined;
}
