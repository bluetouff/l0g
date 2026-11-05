import { analysisTools } from '../config/analysis-tools.ts';
import { topics, postMatchesTopic, topicLabelForTags } from '../config/topics.ts';
import { readingTime } from './reading-time.ts';
import { validDiscoveryEntry, type DiscoveryEntry } from './reading-discovery-model.ts';
interface Entry { id: string; body?: string; data: { title: string; description: string; pubDate: Date; updatedDate?: Date; tags?: string[]; draft?: boolean; quickTake?: { fact: string; importance: string; uncertainty: string } }; }
export function discoveryTool(path: string, lang: 'fr' | 'en' = 'fr') {
  return analysisTools.find(t => t[lang].articleHref === path)?.[lang].href;
}
export function buildDiscoveryCatalog(posts: Entry[], lang: 'fr' | 'en' = 'fr'): DiscoveryEntry[] {
  return posts.filter(p => !p.data.draft).map(p => {
    const path = `${lang === 'fr' ? '/posts/' : '/en/analysis/'}${p.id}/`;
    const entry: DiscoveryEntry = { path, title: p.data.title, description: p.data.description,
      published: p.data.pubDate.toISOString(), ...(p.data.updatedDate ? { updated: p.data.updatedDate.toISOString() } : {}),
      minutes: readingTime(p.body), topics: topics.filter(t => postMatchesTopic(p.data.tags ?? [], t)).map(t => t.slug),
      topicLabel: topicLabelForTags(p.data.tags ?? []) ?? (lang === 'fr' ? 'analyse' : 'analysis'), ...(p.data.quickTake ? { summary: p.data.quickTake } : {}),
      ...(discoveryTool(path, lang) ? { tool: discoveryTool(path, lang) } : {}) };
    if (!validDiscoveryEntry(entry)) throw new Error(`Invalid reading catalogue entry: ${path}`);
    return entry;
  }).sort((a,b) => Date.parse(b.published) - Date.parse(a.published) || a.path.localeCompare(b.path));
}
