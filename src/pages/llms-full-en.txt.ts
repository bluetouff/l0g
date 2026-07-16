import type { APIRoute } from 'astro';
import { loadAgentContent } from '../lib/agent-content.ts';
import { textResponse } from '../lib/agent-surface.ts';

const SITE = 'https://l0g.fr';
const MAX_PER_DOC = 24000;

function toPlain(markdown: string) {
  return String(markdown || '')
    .replace(/<figure[\s\S]*?<\/figure>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s*#{1,6}\s*/gm, '')
    .replace(/[*_`>]/g, '')
    .replace(/\s*[\u2014\u2013]\s*/g, ' · ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export const GET: APIRoute = async () => {
  const { posts, guides } = await loadAgentContent();
  const postsEn = posts.filter((entry) => entry.collection === 'postsEn');
  const guidesEn = guides.filter((entry) => entry.collection === 'guidesEn');
  const date = (value?: Date) => value ? value.toISOString().slice(0, 10) : '';
  const separator = '\n\n' + '='.repeat(76) + '\n';
  const out = [
    '# l0g.fr · complete English corpus',
    '',
    '> Full text of the published English analyses and reference guides. Infographics are removed. CC BY 4.0, attribution l0g.fr. Not investment advice.',
    '',
    `Generated ${new Date().toISOString()}. ${guidesEn.length} guides, ${postsEn.length} analyses.`,
    `Concise map: ${SITE}/llms.txt`,
    `French corpus: ${SITE}/llms-full.txt`,
  ];

  for (const guide of guidesEn) {
    let body = toPlain(guide.body ?? '');
    if (body.length > MAX_PER_DOC) body = body.slice(0, MAX_PER_DOC) + '\n[...]';
    out.push(separator);
    out.push(`REFERENCE GUIDE: ${guide.data.title}`);
    out.push(`URL: ${SITE}/en/guides/${guide.id}/`);
    out.push(`Canonical French source: ${SITE}/guides/${guide.data.sourceGuide}/`);
    out.push(`Date: ${date(guide.data.pubDate)}${guide.data.updatedDate ? ` (reviewed ${date(guide.data.updatedDate)})` : ''}`);
    out.push('-'.repeat(76));
    out.push(body);
  }

  for (const post of postsEn) {
    let body = toPlain(post.body ?? '');
    if (body.length > MAX_PER_DOC) body = body.slice(0, MAX_PER_DOC) + '\n[...]';
    out.push(separator);
    out.push(`ANALYSIS: ${post.data.title}`);
    out.push(`URL: ${SITE}/en/analysis/${post.id}/`);
    out.push(`Canonical French source: ${SITE}/posts/${post.data.sourceArticle}/`);
    out.push(`Date: ${date(post.data.pubDate)}${post.data.updatedDate ? ` (reviewed ${date(post.data.updatedDate)})` : ''}`);
    if (post.data.tags?.length) out.push(`Topics: ${post.data.tags.join(', ')}`);
    out.push('-'.repeat(76));
    out.push(body);
  }

  return textResponse(out.join('\n') + '\n', 'text/plain; charset=utf-8');
};
