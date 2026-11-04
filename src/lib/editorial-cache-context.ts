import { getCollection } from 'astro:content';
import { financingReadingPaths } from '../config/english-reading-paths.ts';
import { frenchDossiers } from '../config/french-dossiers.ts';
import { englishEditorialLinks } from '../config/english-editorial-links.ts';
import { editorialReadingSuggestions } from '../config/editorial-reading-links.ts';
import { createStaticEntryEligibility, editorialCacheKey } from './editorial-build-cache.mjs';

type EditorialCollection = 'posts' | 'postsEn' | 'guides' | 'guidesEn';

/** getCollection-only reads are explicit dependencies of a page's cache key. */
export async function createEditorialCacheKeys() {
  const [posts, postsEn, guides, guidesEn] = await Promise.all([
    getCollection('posts'), getCollection('postsEn'), getCollection('guides'), getCollection('guidesEn'),
  ]);
  const collections = { posts, postsEn, guides, guidesEn };
  const config = { paths: financingReadingPaths, frenchDossiers, englishLinks: englishEditorialLinks, suggestions: editorialReadingSuggestions };
  const eligible = createStaticEntryEligibility();
  return (collection: EditorialCollection, entry: (typeof collections)[EditorialCollection][number]) =>
    eligible(entry) ? editorialCacheKey(collection, entry, collections, config) : undefined;
}
