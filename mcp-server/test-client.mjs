import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StreamableHTTPClientTransport } from '@modelcontextprotocol/sdk/client/streamableHttp.js';

const URL_ = process.env.URL || 'http://127.0.0.1:8848/mcp';
const transport = new StreamableHTTPClientTransport(new URL(URL_));
const client = new Client({ name: 'l0g-test', version: '1.0.0' });
await client.connect(transport);

const { tools } = await client.listTools();
console.log('TOOLS:', tools.map((t) => t.name).join(', '));

async function call(name, args) {
  const r = await client.callTool({ name, arguments: args || {} });
  const txt = (r.content || []).map((c) => c.text || '').join('');
  let parsed; try { parsed = JSON.parse(txt); } catch { parsed = txt; }
  return parsed;
}

const risk = await call('get_risk_indices');
console.log('get_risk_indices -> indices:', Object.keys(risk.indices || {}).join(','), '| snapshot:', risk.snapshot);

const search = await call('search_content', { query: 'stablecoins', limit: 3 });
console.log('search_content(stablecoins) ->', search.count, 'résultats; #1:', search.results?.[0]?.title);

const recent = await call('list_recent_analyses', { limit: 3 });
console.log('list_recent_analyses ->', recent.count, '; #1:', recent.analyses?.[0]?.title);

const gd = await call('list_guides');
console.log('list_guides ->', gd.count, 'guides');

const byTopic = await call('search_by_topic', { topic: 'crypto', limit: 3 });
console.log('search_by_topic(crypto) ->', byTopic.count, '; label:', byTopic.label);

const art = await call('get_article', { slug: 'clarity-act-trump-obstacle-conflit-interets' });
console.log('get_article -> title:', art.title, '| words:', art.words, '| truncated:', art.truncated);

const bad = await call('get_article', { slug: '../../etc/passwd' });
console.log('get_article(path traversal) -> error:', bad.error);

await client.close();
console.log('OK');
