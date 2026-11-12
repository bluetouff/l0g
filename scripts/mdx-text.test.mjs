import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { build } from 'esbuild';
import { stripMdxImports } from '../src/lib/mdx-text.ts';

const imports = [
  "import GpuDebtStress from '../../components/GpuDebtStress.astro';",
  "import ComputePriceFigure from '../../components/ComputePriceFigure.astro';",
  "import '../../styles/cra-disclosure.css';",
  "import Figure, {\n  caption as label,\n  type Scale\n} from '../../components/Figure.astro';",
  'import * as Figures from "../../components/figures.js"',
];
const paragraph = 'La baisse des tarifs de location réduit les recettes disponibles pour rembourser les équipements déjà financés. Les échéances contractuelles conservent leur calendrier.';

test('MDX setup imports disappear while prose, links and line boundaries remain', () => {
  for (const declaration of imports) {
    const markdown = `${declaration}\n\n${paragraph}\n\n[Source](https://www.bis.org/publ/bisbull120.htm)`;
    const result = stripMdxImports(markdown);
    assert.doesNotMatch(result, /components\/|styles\//);
    assert.match(result, /La baisse des tarifs/);
    assert.match(result, /https:\/\/www.bis.org\/publ\/bisbull120.htm/);
    assert.equal(result.split('\n').length, markdown.split('\n').length);
  }
});

test('ordinary import prose and code examples retain their contents', () => {
  const examples = [
    'import prices increased as tariffs took effect.',
    'Les importations ont progressé.',
    `    ${imports[0]}`,
    `\`\`\`js\n${imports[0]}\n\`\`\``,
    `~~~js\n${imports[0]}\n~~~`,
    `\`\`\`\`js\n\`\`\`\n${imports[0]}\n\`\`\`\``,
  ];
  for (const example of examples) assert.equal(stripMdxImports(example), example);
  assert.equal(stripMdxImports(`${examples[3]}\n${imports[0]}\n${paragraph}`), `${examples[3]}\n\n${paragraph}`);
});

test('the exact component imports found by Search Console are removed from both articles', () => {
  for (const path of ['posts/prix-calcul-ia-gpu-dette.mdx', 'posts-en/ai-compute-price-collapse-gpu-debt.mdx']) {
    const markdown = readFileSync(new URL(`../src/content/${path}`, import.meta.url), 'utf8');
    assert.match(markdown, /import GpuDebtStress/);
    assert.match(markdown, /import ComputePriceFigure/);
    const result = stripMdxImports(markdown);
    assert.doesNotMatch(result, /import (?:GpuDebtStress|ComputePriceFigure)/);
    assert.match(result, /<GpuDebtStress/);
    assert.match(result, /<ComputePriceFigure/);
  }
});

const body = `${imports.slice(0, 3).join('\n')}\n\n${paragraph}\n\n[Source](https://www.bis.org/publ/bisbull120.htm)`;
const postData = {
  title: 'Tarifs du calcul et dette', description: paragraph, pubDate: new Date('2026-10-31T00:00:00Z'), tags: [],
};
const posts = [
  { id: 'prix-calcul-ia-gpu-dette', collection: 'posts', body, data: postData },
  { id: 'ai-compute-price-collapse-gpu-debt', collection: 'postsEn', body, data: { ...postData, sourceArticle: 'prix-calcul-ia-gpu-dette', sourceUpdatedDate: postData.pubDate } },
];

async function bundleModule(path, plugins = []) {
  const result = await build({ entryPoints: [fileURLToPath(new URL(path, import.meta.url))], bundle: true, platform: 'node', format: 'esm', write: false, plugins });
  const code = `${result.outputFiles[0].text}\n//# sourceURL=${path.split('/').at(-1)}-test-bundle`;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
}

const { buildArticleEvidence } = await bundleModule('../src/lib/article-evidence.ts');
const { buildSearchIndexSurface } = await bundleModule('../src/lib/agent-surface.ts');

test('MDX imports cannot become fallback claims or source references', () => {
  const evidence = buildArticleEvidence(`${imports.slice(0, 2).join('\n')}\n\n${paragraph}`, {
    title: postData.title, published: postData.pubDate, url: 'https://l0g.fr/posts/prix-calcul-ia-gpu-dette/',
  });
  assert.equal(evidence.claims[0].claim, paragraph);
  assert.doesNotMatch(JSON.stringify(evidence), /components\/|import Gpu/);
});

test('shared search documents retain article prose without component paths', () => {
  const index = buildSearchIndexSurface(posts, []);
  for (const post of posts) {
    const document = index.documents.find((entry) => entry.slug === post.id && entry.type === 'article');
    assert.ok(document);
    assert.match(document.text, /La baisse des tarifs de location/);
    assert.doesNotMatch(document.text, /components\/|styles\/cra-disclosure|import Gpu/);
  }
});

test('both corpus endpoints publish article prose without MDX setup paths', async () => {
  const fixture = {
    name: 'published-content-fixture',
    setup(builder) {
      builder.onLoad({ filter: /\/agent-content\.ts$/ }, () => ({ contents: `export async function loadAgentContent() { const posts = ${JSON.stringify(posts)}; for (const post of posts) post.data.pubDate = new Date(post.data.pubDate); return { posts, guides: [] }; }`, loader: 'js' }));
      builder.onLoad({ filter: /\/agent-surface\.ts$/ }, () => ({ contents: 'export const textResponse = (body, type) => new Response(body, { headers: { "Content-Type": type } });', loader: 'js' }));
    },
  };
  for (const path of ['../src/pages/llms-full.txt.ts', '../src/pages/llms-full-en.txt.ts']) {
    const { GET } = await bundleModule(path, [fixture]);
    const response = await GET();
    const text = await response.text();
    assert.equal(response.status, 200);
    assert.match(text, /La baisse des tarifs de location/);
    assert.doesNotMatch(text, /components\/|styles\/cra-disclosure|import Gpu/);
  }
});
