import { assertAtlasDataset, type AtlasDataset } from './engagement-atlas.ts';
import { createHash } from 'node:crypto';

function record(value: unknown, expected: string[]): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)
    || Object.keys(value).length !== expected.length
    || !expected.every(key => Object.hasOwn(value, key))) {
    throw new Error('Atlas translation: missing, obsolete or unexpected fields');
  }
  return value as Record<string, unknown>;
}

function translatedText(value: unknown): string {
  if (typeof value !== 'string') throw new Error('Atlas translation: text required');
  return value;
}

/** Translate prose only. Dates, graph structure, source URLs and exact amounts
 * remain owned by the reviewed source corpus. Incomplete overlays fail closed. */
export function localizeAtlas(source: unknown, translation: unknown): AtlasDataset {
  assertAtlasDataset(source);
  const copy = record(translation, ['sourceSha256', 'title', 'sources', 'nodes', 'relations', 'milestones']);
  const sourceSha256 = createHash('sha256').update(JSON.stringify(source)).digest('hex');
  if (copy.sourceSha256 !== sourceSha256) throw new Error('Atlas translation: source changed; review the English edition');
  const sources = record(copy.sources, source.sources.map(item => item.id));
  const nodes = record(copy.nodes, source.nodes.map(item => item.id));
  const relations = record(copy.relations, source.relations.map(item => item.id));
  const milestones = record(copy.milestones, source.milestones.map(item => item.date));
  const localized: AtlasDataset = {
    ...source,
    title: translatedText(copy.title),
    sources: source.sources.map(item => {
      const text = record(sources[item.id], ['title', 'locator']);
      return { ...item, title: translatedText(text.title), locator: translatedText(text.locator) };
    }),
    nodes: source.nodes.map(item => {
      const text = record(nodes[item.id], ['label', 'role']);
      return { ...item, label: translatedText(text.label), role: translatedText(text.role) };
    }),
    relations: source.relations.map(item => {
      const text = record(relations[item.id], item.reading ? ['reading', 'observations'] : ['observations']);
      const observations = record(text.observations, item.observations.map(observation => observation.publishedOn));
      const result = { ...item };
      if (item.reading) {
        const reading = record(text.reading, ['href', 'label']);
        const href = translatedText(reading.href);
        if (!/^\/en\/analysis\/[a-z0-9-]+\/$/.test(href)) throw new Error('Atlas translation: English reading link required');
        result.reading = { href, label: translatedText(reading.label) };
      }
      result.observations = item.observations.map(observation => {
        const words = record(observations[observation.publishedOn], [
          'label', 'claim', 'limit', 'watch', ...(observation.amount ? ['amountLabel'] : []),
        ]);
        return {
          ...observation,
          label: translatedText(words.label), claim: translatedText(words.claim),
          limit: translatedText(words.limit), watch: translatedText(words.watch),
          ...(observation.amount ? { amount: { ...observation.amount, label: translatedText(words.amountLabel) } } : {}),
        };
      });
      return result;
    }),
    milestones: source.milestones.map(item => {
      const text = record(milestones[item.date], ['label', 'change']);
      return { ...item, label: translatedText(text.label), change: translatedText(text.change) };
    }),
  };
  assertAtlasDataset(localized);
  return localized;
}
