import { getCollection } from 'astro:content';
import { buildDiscoveryCatalog } from '../../../lib/reading-discovery.ts';
export async function GET() {
  const posts = await getCollection('posts', ({data}) => !data.draft);
  return new Response(JSON.stringify({ version: 1, entries: buildDiscoveryCatalog(posts) }), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}
