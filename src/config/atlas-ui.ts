export type AtlasLanguage = 'fr' | 'en';

export const atlasUi = {
  fr: {
    kinds: { announcement: 'Annonce des parties', contract: 'Relation déclarée', limitation: 'Limites documentées' },
    kicker: '// carte interactive · acteurs et contrats', titlePrefix: 'Atlas du',
    network: 'Le réseau documenté', actors: 'acteurs et structures', relations: 'relations',
    chooseDate: 'Choisir une date de publication', announcement: 'Annonce', contract: 'Relation déclarée', selected: 'Relation sélectionnée',
    legend: 'Traits sans échelle financière ; nature du lien dans la fiche',
    chooseRelation: 'Choisir une relation', all: 'Toutes', allRelations: 'Toutes les relations à cette date', relatedTo: 'Relations de', explore: 'explorer',
    published: 'Publication du', reviewed: 'revue le', limit: 'La limite', watch: 'À vérifier ensuite',
    scenarioOpen: 'Explorer un défaut du locataire', scenarioClose: 'Fermer le scénario de défaut',
    scenarioWarning: 'Hypothèse, aucun défaut réel représenté.',
    scenarioExplanation: 'Le chemin met en évidence le bail, la garantie et le recours en remboursement. Les conditions contractuelles et les récupérations restent déterminantes ; aucun montant de perte n’est calculé.',
    sources: 'Consulter les sources', copy: 'Copier ce point de lecture', copied: 'Lien copié.', copyFallback: 'Copiez l’adresse de cette page :',
    method: 'Méthode et périmètre de l’atlas', history: 'Lire les relations et leur historique sans la carte', limitShort: 'Limite :',
    reconstructionPrefix: 'La chronologie est une', reconstruction: 'reconstitution documentaire réalisée le',
    reconstructionExplanation: 'Les dates de la carte désignent la publication des pièces, pas la date à laquelle l0g les aurait connues ou archivées. Une relation ancienne peut avoir évolué depuis sa dernière pièce.',
    methodExplanation: 'Les annonces sont attribuées à leurs auteurs. Les engagements conditionnels restent distincts des paiements. L’absence d’un lien signifie qu’il n’est pas établi dans ce corpus, sans démontrer son inexistence.',
  },
  en: {
    kinds: { announcement: 'Announcement by the parties', contract: 'Reported relationship', limitation: 'Documented limits' },
    kicker: '// interactive map · actors and contracts', titlePrefix: 'Atlas of',
    network: 'The documented network', actors: 'actors and entities', relations: 'relationships',
    chooseDate: 'Choose a publication date', announcement: 'Announcement', contract: 'Reported relationship', selected: 'Selected relationship',
    legend: 'Lines do not show financial scale; select a relationship for its meaning',
    chooseRelation: 'Choose a relationship', all: 'All', allRelations: 'All relationships at this date', relatedTo: 'Relationships involving', explore: 'explore',
    published: 'Published', reviewed: 'reviewed', limit: 'The limitation', watch: 'What to check next',
    scenarioOpen: 'Explore a tenant default', scenarioClose: 'Close the default scenario',
    scenarioWarning: 'Hypothetical scenario; no actual default is represented.',
    scenarioExplanation: 'The path highlights the lease, guarantee and reimbursement claim. Contract terms and recoveries remain decisive; no loss amount is calculated.',
    sources: 'Read the sources', copy: 'Copy this view', copied: 'Link copied.', copyFallback: 'Copy this page address:',
    method: 'Atlas methodology and scope', history: 'Read the relationships and their history without the map', limitShort: 'Limitation:',
    reconstructionPrefix: 'This timeline is a', reconstruction: 'documentary reconstruction made on',
    reconstructionExplanation: 'Map dates refer to document publication, not when l0g first knew of or archived them. An older relationship may have changed since its latest source.',
    methodExplanation: 'Announcements are attributed to the parties that made them. Conditional commitments remain distinct from payments. A missing link means this corpus does not establish it; it does not prove that no relationship exists.',
  },
} as const;

export function atlasRelationCount(count: number, language: AtlasLanguage): string {
  const noun = language === 'en' ? 'relationship' : 'relation';
  return `${count} ${noun}${count === 1 ? '' : 's'}`;
}
