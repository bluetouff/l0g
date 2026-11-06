export function collectionQuery(value: string): string[] {
  return value.slice(0,160).toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().split(/\s+/).filter(Boolean);
}
export function collectionMatches(text: string, query: string[]): boolean {
  const normalized = text.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  return query.every(word => normalized.includes(word));
}
