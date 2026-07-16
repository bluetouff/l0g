import { getCollection } from 'astro:content';
import { sortGuides, sortPosts, type GuideEntry, type PostEntry } from './agent-surface.ts';

export async function loadAgentContent(): Promise<{ posts: PostEntry[]; guides: GuideEntry[] }> {
  const [postsFr, postsEn, guidesFr, guidesEn] = await Promise.all([
    getCollection('posts', ({ data }) => !data.draft),
    getCollection('postsEn', ({ data }) => !data.draft),
    getCollection('guides', ({ data }) => !data.draft),
    getCollection('guidesEn', ({ data }) => !data.draft),
  ]);

  return {
    posts: sortPosts([...postsFr, ...postsEn]),
    guides: sortGuides([...guidesFr, ...guidesEn]),
  };
}
