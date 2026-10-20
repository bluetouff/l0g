export type PeageLayer = 'obligation' | 'capital' | 'infrastructure' | 'contrat';
export type PeageEvidence = { source: string; locator: string };
export type PeageRelation = {
  id: string;
  from: string;
  to: string;
  layer: PeageLayer;
  title: string;
  status: 'documente' | 'declare';
  statement: string;
  asOf: string;
  limit: string;
  question: string;
  evidence: PeageEvidence[];
};
export type PeageDossier = {
  version: 1;
  id: string;
  title: string;
  reviewedOn: string;
  scope: string;
  sources: { id: string; title: string; publisher: string; url: string; datedOn: string; dateKind: string }[];
  nodes: { id: string; label: string; detail: string }[];
  relations: PeageRelation[];
  exits: {
    id: string; title: string; timing: string; statement: string;
    limit: string; evidence: PeageEvidence[];
  }[];
  requests: { id: string; title: string; question: string; relations: string[]; exits: string[] }[];
  unknowns: string[];
};

export const layerLabels: Record<PeageLayer, string> = {
  obligation: 'Obligation', capital: 'Capital', infrastructure: 'Infrastructure', contrat: 'Contrat',
};

const validId = /^[a-z][a-z0-9-]{0,70}$/;
const validDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;

// Fail the build on broken evidence references or unsafe external links.
export function assertPeageDossier(dossier: PeageDossier): void {
  const require = (condition: boolean, message: string) => {
    if (!condition) throw new Error(`Péage : ${message}`);
  };
  const ids = (items: { id: string }[]) => {
    require(items.length > 0, 'collection vide');
    require(items.every(item => validId.test(item.id)), 'identifiant invalide');
    const result = new Set(items.map(item => item.id));
    require(result.size === items.length, 'identifiant dupliqué');
    return result;
  };
  require(dossier.version === 1 && validId.test(dossier.id), 'version ou dossier invalide');
  require(validDate(dossier.reviewedOn), 'date de revue invalide');
  const sources = ids(dossier.sources);
  const nodes = ids(dossier.nodes);
  const relations = ids(dossier.relations);
  const exits = ids(dossier.exits);
  ids(dossier.requests);
  for (const source of dossier.sources) {
    const url = new URL(source.url);
    require(url.protocol === 'https:' && !url.username && !url.password, 'URL source non sûre');
    require(validDate(source.datedOn) && source.datedOn <= dossier.reviewedOn, 'date source invalide');
    require(Boolean(source.title && source.publisher && source.dateKind), 'source incomplète');
  }
  const checkEvidence = (item: { evidence: PeageEvidence[]; limit: string; statement: string }) => {
    require(Boolean(item.statement && item.limit), 'preuve sans périmètre ou limite');
    require(item.evidence.length > 0 && item.evidence.every(
      evidence => sources.has(evidence.source) && Boolean(evidence.locator.trim()),
    ), 'référence de preuve introuvable');
  };
  for (const relation of dossier.relations) {
    require(nodes.has(relation.from) && nodes.has(relation.to) && relation.from !== relation.to, 'parties invalides');
    require(Object.hasOwn(layerLabels, relation.layer), 'couche inconnue');
    require(['documente', 'declare'].includes(relation.status), 'statut inconnu');
    require(validDate(relation.asOf) && relation.asOf <= dossier.reviewedOn, 'date relation invalide');
    require(Boolean(relation.question), 'question manquante');
    checkEvidence(relation);
  }
  dossier.exits.forEach(checkEvidence);
  for (const request of dossier.requests) {
    require(request.relations.length > 0 && request.relations.every(id => relations.has(id)), 'demande sans relation');
    require(request.exits.every(id => exits.has(id)), 'démarche de sortie introuvable');
  }
  require(dossier.unknowns.length > 0, 'limites manquantes');
}

export function peageSelection(hash: string, allowedIds: readonly string[]): string | null {
  if (hash.length > 100 || !hash.startsWith('#preuve-')) return null;
  const id = hash.slice(8);
  return validId.test(id) && allowedIds.includes(id) ? id : null;
}

export function peageMarkdown(dossier: PeageDossier): string {
  assertPeageDossier(dossier);
  const evidence = (refs: PeageEvidence[]) => refs.map(ref => {
    const source = dossier.sources.find(item => item.id === ref.source)!;
    return `- ${source.title} (${source.datedOn}, ${source.dateKind}), ${ref.locator} : ${source.url}`;
  }).join('\n');
  return [
    `# ${dossier.title}`,
    `Revue documentaire : ${dossier.reviewedOn}\n\n${dossier.scope}`,
    '## Relations',
    ...dossier.relations.map(item => `### ${item.title}\n\nStatut : ${item.status === 'declare' ? 'déclaration du fournisseur' : 'documenté'}. Situation documentée : ${item.asOf}.\n\n${item.statement}\n\nLimite : ${item.limit}\n\nÀ demander : ${item.question}\n\n${evidence(item.evidence)}`),
    '## Préparer une sortie',
    ...dossier.exits.map(item => `### ${item.title} : ${item.timing}\n\n${item.statement}\n\nLimite : ${item.limit}\n\n${evidence(item.evidence)}`),
    '## Pièces à demander',
    ...dossier.requests.map(item => `- [ ] ${item.title} : ${item.question}`),
    '## Inconnues',
    ...dossier.unknowns.map(item => `- ${item}`),
    '',
  ].join('\n\n');
}
