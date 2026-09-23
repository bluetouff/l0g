/** Documentary relations, never an estimate of market contagion or cash paid. */
export type AtlasSource = { id: string; title: string; url: string; publishedOn: string; locator: string };
export type AtlasNode = { id: string; label: string; role: string; column: number; row: number };
export type AtlasObservation = {
  publishedOn: string;
  recordedOn: string;
  review: 'reviewed' | 'proposed';
  kind: 'announcement' | 'contract' | 'limitation';
  label: string;
  claim: string;
  limit: string;
  watch: string;
  sources: string[];
  amount?: { value: string; currency: 'USD'; kind: 'conditional-cap'; label: string };
};
export type AtlasRelation = { id: string; from: string; to: string; observations: AtlasObservation[]; reading?: { href: string; label: string } };
export type AtlasDataset = {
  version: 1;
  id: string;
  title: string;
  reconstructedOn: string;
  sources: AtlasSource[];
  nodes: AtlasNode[];
  relations: AtlasRelation[];
  milestones: { date: string; label: string; change: string }[];
};
export type AtlasVisibleRelation = Omit<AtlasRelation, 'observations'> & { observation: AtlasObservation; changed: boolean };

const allowedOrigins = new Set([
  'https://www.sec.gov', 'https://ir.blackrock.com', 'https://www.apollo.com',
  'https://www.quadrantchambers.com', 'https://eiti.org', 'https://www.trafigura.com',
  'https://aligneddc.com', 'https://arcc.ares.com',
  'https://newsweb.oslobors.no',
]);
/** Canonical source URL shared by corpus validation and the browser link sink. */
export function atlasSourceUrl(value: string): string {
  text(value, 1500);
  const url = new URL(value);
  if (url.protocol !== 'https:' || !allowedOrigins.has(url.origin) || url.username || url.password || url.search || url.hash) throw new Error('Atlas : origine ou URL source refusée');
  if (url.origin === 'https://www.sec.gov' && !/^\/Archives\/edgar\/data\/\d+\/\d+\/[a-zA-Z0-9._-]+\.htm$/.test(url.pathname)) throw new Error('Atlas : chemin SEC refusé');
  if (url.origin === 'https://newsweb.oslobors.no' && !/^\/message\/\d+$/.test(url.pathname)) throw new Error('Atlas : chemin NewsWeb refusé');
  return url.href;
}
const idPattern = /^[a-z][a-z0-9-]{0,79}$/;
function requireValue(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`Atlas : ${message}`);
}
function object(value: unknown): asserts value is Record<string, unknown> {
  requireValue(value !== null && typeof value === 'object' && !Array.isArray(value), 'objet attendu');
}
function keys(value: Record<string, unknown>, names: string[]) {
  requireValue(Object.keys(value).every(key => names.includes(key)), 'champ inattendu');
}
function text(value: unknown, max = 1400): asserts value is string {
  requireValue(typeof value === 'string' && value.trim().length > 0 && value.length <= max && !/[<>\u0000-\u001f]/u.test(value), 'texte invalide');
}
export function isAtlasDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)
    && Number.isFinite(Date.parse(`${value}T00:00:00Z`))
    && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value;
}
function date(value: unknown): asserts value is string { requireValue(isAtlasDate(value), 'date civile invalide'); }
function id(value: unknown): asserts value is string { requireValue(typeof value === 'string' && idPattern.test(value), 'identifiant invalide'); }
function list(value: unknown, max: number): asserts value is unknown[] { requireValue(Array.isArray(value) && value.length > 0 && value.length <= max, 'liste vide ou excessive'); }
function uniqueIds(items: unknown[]): Set<string> {
  const ids = new Set<string>();
  for (const item of items) { object(item); id(item.id); requireValue(!ids.has(item.id), 'identifiant dupliqué'); ids.add(item.id); }
  return ids;
}

/** Also used for untrusted agent proposals. Validation is not editorial approval. */
export function assertAtlasDataset(value: unknown, allowProposals = false): asserts value is AtlasDataset {
  object(value);
  keys(value, ['version', 'id', 'title', 'reconstructedOn', 'sources', 'nodes', 'relations', 'milestones']);
  requireValue(value.version === 1, 'version non prise en charge'); id(value.id); text(value.title, 160); date(value.reconstructedOn);
  list(value.sources, 100); list(value.nodes, 40); list(value.relations, 120); list(value.milestones, 40);
  const sourceIds = uniqueIds(value.sources), nodeIds = uniqueIds(value.nodes);
  uniqueIds(value.relations);
  const sources = new Map<string, string>();
  for (const source of value.sources) {
    object(source); id(source.id); text(source.title, 240); text(source.locator, 400); date(source.publishedOn); text(source.url, 1500);
    keys(source, ['id', 'title', 'url', 'publishedOn', 'locator']);
    atlasSourceUrl(source.url);
    sources.set(source.id, source.publishedOn);
  }
  const positions = new Set<string>();
  for (const node of value.nodes) {
    object(node); text(node.label, 45); text(node.role, 70);
    keys(node, ['id', 'label', 'role', 'column', 'row']);
    requireValue(Number.isInteger(node.column) && Number(node.column) >= 0 && Number(node.column) <= 3 && Number.isInteger(node.row) && Number(node.row) >= 0 && Number(node.row) <= 4, 'position invalide');
    const position = `${node.column}:${node.row}`; requireValue(!positions.has(position), 'positions superposées'); positions.add(position);
  }
  const observationDates = new Set<string>();
  for (const relation of value.relations) {
    object(relation); id(relation.from); id(relation.to);
    keys(relation, ['id', 'from', 'to', 'observations', 'reading']);
    if (relation.reading !== undefined) {
      object(relation.reading); keys(relation.reading, ['href', 'label']);
      text(relation.reading.label, 160);
      requireValue(typeof relation.reading.href === 'string' && /^\/posts\/[a-z0-9-]+\/$/.test(relation.reading.href), 'lien de lecture interne invalide');
    }
    requireValue(nodeIds.has(relation.from) && nodeIds.has(relation.to) && relation.from !== relation.to, 'relation orpheline');
    list(relation.observations, 40);
    let previous = '';
    for (const observation of relation.observations) {
      object(observation); date(observation.publishedOn); date(observation.recordedOn);
      keys(observation, ['publishedOn', 'recordedOn', 'review', 'kind', 'label', 'claim', 'limit', 'watch', 'sources', 'amount']);
      requireValue(observation.publishedOn > previous, 'observations non ordonnées ou dupliquées'); previous = observation.publishedOn;
      requireValue(observation.recordedOn >= observation.publishedOn && observation.recordedOn >= value.reconstructedOn, 'antidatage de la revue');
      requireValue(observation.review === 'reviewed' || (allowProposals && observation.review === 'proposed'), 'proposition non relue');
      requireValue(['announcement', 'contract', 'limitation'].includes(String(observation.kind)), 'type d’observation invalide');
      for (const key of ['label', 'claim', 'limit', 'watch']) text(observation[key], key === 'label' ? 100 : 1400);
      list(observation.sources, 12);
      for (const source of observation.sources) requireValue(typeof source === 'string' && sourceIds.has(source) && sources.get(source)! <= observation.publishedOn, 'source absente ou publiée dans le futur');
      requireValue(observation.sources.some(source => sources.get(String(source)) === observation.publishedOn), 'date sans publication justificative');
      if (observation.amount !== undefined) {
        object(observation.amount);
        keys(observation.amount, ['value', 'currency', 'kind', 'label']);
        requireValue(typeof observation.amount.value === 'string' && /^(?:0|[1-9]\d{0,17})(?:\.\d{1,6})?$/.test(observation.amount.value), 'montant exact attendu');
        requireValue(observation.amount.currency === 'USD' && observation.amount.kind === 'conditional-cap', 'unité ou nature monétaire invalide');
        text(observation.amount.label, 160);
      }
      observationDates.add(observation.publishedOn);
    }
  }
  let previous = '';
  const milestoneDates = new Set<string>();
  for (const milestone of value.milestones) {
    object(milestone); date(milestone.date); text(milestone.label, 100); text(milestone.change, 600);
    keys(milestone, ['date', 'label', 'change']);
    requireValue(milestone.date > previous && observationDates.has(milestone.date), 'jalon sans observation ou non ordonné');
    previous = milestone.date; milestoneDates.add(milestone.date);
  }
  requireValue([...observationDates].every(item => milestoneDates.has(item)), 'observation sans jalon');
}

/** Cut off sources AND revisions before building any visible or exported state. */
export function atlasAt(dataset: AtlasDataset, asOf: string) {
  requireValue(isAtlasDate(asOf), 'date de lecture invalide');
  const milestone = dataset.milestones.filter(item => item.date <= asOf).at(-1) ?? null;
  const relations: AtlasVisibleRelation[] = dataset.relations.flatMap(relation => {
    const observation = relation.observations.filter(item => item.review === 'reviewed' && item.publishedOn <= asOf).at(-1);
    return observation ? [{ id: relation.id, from: relation.from, to: relation.to, reading: relation.reading, observation, changed: observation.publishedOn === milestone?.date }] : [];
  });
  const visibleNodeIds = new Set(relations.flatMap(item => [item.from, item.to]));
  const visibleSourceIds = new Set(relations.flatMap(item => item.observation.sources));
  return { asOf, milestone, relations, nodes: dataset.nodes.filter(item => visibleNodeIds.has(item.id)), sources: dataset.sources.filter(item => item.publishedOn <= asOf && visibleSourceIds.has(item.id)) };
}

export function atlasSelection(dataset: AtlasDataset, hash: string, preferredRelation?: string) {
  const params = new URLSearchParams(hash.slice(0, 1200).replace(/^#/, ''));
  const requestedDate = params.get('date');
  const date = dataset.milestones.some(item => item.date === requestedDate) ? requestedDate! : dataset.milestones.at(-1)!.date;
  const snapshot = atlasAt(dataset, date);
  const relation = snapshot.relations.find(item => item.id === params.get('relation'))?.id
    ?? snapshot.relations.find(item => item.id === preferredRelation)?.id
    ?? snapshot.relations.find(item => item.id === 'nvidia-sb-guarantee')?.id ?? snapshot.relations.at(-1)?.id ?? '';
  return { date, relation, scenario: dataset.id === 'financement-ia' && params.get('scenario') === 'default'
    && ['nvidia-sb-guarantee', 'openai-sb-lease', 'openai-nvidia-indemnity'].includes(relation)
    && snapshot.relations.some(item => item.id === 'nvidia-sb-guarantee') };
}

export function formatAtlasDate(date: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`));
}
