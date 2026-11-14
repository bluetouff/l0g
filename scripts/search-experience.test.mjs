import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import { searchContentType, searchDateMetadata, searchTopicLabels } from '../src/lib/search-metadata.ts';
import { postMatchesTopic, primaryTopic, topicForTag, topicHref, topics } from '../src/config/topics.ts';

const source = readFileSync(new URL('../src/scripts/pagefind-init.js', import.meta.url), 'utf8');
const importBoundary = "import('/pagefind/pagefind.js')";
assert.equal(source.split(importBoundary).length, 2, 'Mock only the Pagefind module-loading boundary');
const script = source.replace(importBoundary, '__loadPagefindModule()');

// A deliberately small DOM: executing HTML through this harness is a test failure.
// The production script still creates its own form, fields and result tree.
class Element {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.attributes = new Map();
    this.listeners = new Map();
    this.dataset = {};
    this.className = '';
    this.value = '';
    this.hidden = false;
    this.disabled = false;
    this._text = '';
  }
  set textContent(value) { this._text = String(value); this.children = []; }
  get textContent() { return this._text + this.children.map(child => child.textContent).join(''); }
  set innerHTML(_value) { throw new Error('Unsafe HTML sink used'); }
  set outerHTML(_value) { throw new Error('Unsafe HTML sink used'); }
  insertAdjacentHTML() { throw new Error('Unsafe HTML sink used'); }
  appendChild(child) { this.children.push(child); return child; }
  append(...children) { children.forEach(child => this.appendChild(child)); }
  replaceChildren(...children) { this._text = ''; this.children = [...children]; }
  get childElementCount() { return this.children.length; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  getAttribute(name) { return this.attributes.get(name) ?? null; }
  addEventListener(name, listener) {
    if (!this.listeners.has(name)) this.listeners.set(name, []);
    this.listeners.get(name).push(listener);
  }
  focus() { this.focused = true; }
  dispatch(name, extra = {}) {
    const event = { preventDefault() { this.defaultPrevented = true; }, ...extra };
    (this.listeners.get(name) || []).forEach(listener => listener(event));
    return event;
  }
}
class Option extends Element {
  constructor(label, value) { super('option'); this.textContent = label; this.value = value; }
}
const walk = node => [node, ...node.children.flatMap(walk)];
const tick = () => new Promise(resolve => setImmediate(resolve));
async function settle() { for (let i = 0; i < 5; i += 1) await tick(); }
function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}
const documentResult = (url, title, overrides = {}) => ({
  url, meta: { title, kind: 'analysis', published: '2026-10-31T12:00:00.000Z' }, plain_excerpt: 'A sourced analysis.', ...overrides,
});
const response = (...documents) => ({ results: documents.map(document => ({ data: async () => document })) });

test('section results retain useful anchors without repeating the parent document', async () => {
  const page = documentResult('/posts/inflation/', 'Inflation', {
    sub_results: [
      documentResult('https://l0g.fr/posts/inflation/', 'Inflation'),
      documentResult('/posts/inflation/#method', 'Méthode'),
      documentResult('/posts/inflation/#sources', 'Sources'),
    ],
  });
  const app = await harness({ search: async () => response(page) });
  await app.submit('inflation');
  const links = walk(app.results).filter(node => node.tagName === 'A');
  assert.deepEqual(links.map(node => node.href), ['/posts/inflation/', '/posts/inflation/#method', '/posts/inflation/#sources']);
});

async function harness({ url = 'https://l0g.fr/recherche/', lang = 'fr', search, filters, moduleError } = {}) {
  const container = new Element('div');
  container.className = 'pf-search';
  container.dataset.searchLang = lang;
  const editions = ['fr', 'en'].map(language => {
    const anchor = new Element('a'); anchor.setAttribute('lang', language); return anchor;
  });
  const suggestion = new Element('button');
  suggestion.dataset.searchQuery = 'financement IA';
  const calls = [], lifecycle = [], timers = new Map();
  let timerId = 0;
  const pagefind = {
    options: async options => { lifecycle.push(['options', options]); },
    init: async () => { lifecycle.push(['init']); },
    filters: async () => filters ? filters() : {
      type: { analysis: 6, guide: 4, tool: 2 }, topic: { IA: 3, Assurance: 2 }, year: { 2025: 2, 2026: 8 },
    },
    search: async (query, options) => {
      calls.push({ query, options: JSON.parse(JSON.stringify(options)) });
      return search ? search(query, options) : response();
    },
  };
  const window = {
    location: new URL(url),
    setTimeout(callback) { timers.set(++timerId, callback); return timerId; },
    clearTimeout(id) { timers.delete(id); },
    history: { replaceState(_state, _unused, path) { window.location = new URL(path, window.location); } },
  };
  const document = {
    readyState: 'complete',
    createElement: name => new Element(name),
    querySelectorAll(selector) {
      if (selector === '.pf-search') return [container];
      if (selector === '.search-editions a') return editions;
      if (selector === '[data-search-query]') return [suggestion];
      throw new Error('Unexpected selector: ' + selector);
    },
  };
  vm.runInNewContext(script, {
    window, document, Option, URL, URLSearchParams,
    __loadPagefindModule: () => moduleError ? Promise.reject(moduleError) : Promise.resolve(pagefind),
  }, { filename: 'pagefind-init.js' });
  const find = className => walk(container).find(node => node.className.split(' ').includes(className));
  const field = name => walk(container).find(node => node.tagName === 'SELECT' && node.name === name);
  await settle();
  return {
    container, calls, lifecycle, timers, window, editions, suggestion, find, field,
    input: find('pagefind-ui__search-input'),
    status: find('pagefind-ui__message'),
    results: find('pagefind-ui__results'),
    async submit(query) {
      find('pagefind-ui__search-input').value = query;
      find('pagefind-ui__form').dispatch('submit');
      await settle();
    },
    async change(name, value) { field(name).value = value; field(name).dispatch('change'); await settle(); },
    async flushInput() {
      const pending = [...timers.values()]; timers.clear(); pending.forEach(callback => callback()); await settle();
    },
  };
}

test('content types distinguish FR/EN analyses, guides, glossary, tools and dossier routes', () => {
  const cases = {
    analysis: ['/posts/credit-prive/', '/en/analysis/private-credit/'],
    guide: ['/guides/lire-un-bilan/', '/en/guides/read-a-balance-sheet/'],
    glossary: ['/glossaire/', '/glossaire/repo/', '/en/glossary/', '/en/glossary/repo/'],
    tool: ['/outils/', '/outils/calculateur/', '/en/tools/', '/en/tools/calculator/'],
    dossier: ['/dossiers/dette/', '/sujet/ia/', '/sujets/', '/en/topics/ai/', '/atlas/petrole/', '/en/atlas/oil-financing/'],
    page: ['/', '/en/', '/publications/', '/posts/', '/guides/', '/outil-inconnu/', '/en/toolsmith/'],
  };
  for (const [type, paths] of Object.entries(cases)) {
    for (const path of paths) assert.equal(searchContentType(path), type, path);
  }
});

test('dated metadata keeps the exact instant and uses the Paris calendar year at the UTC boundary', () => {
  assert.deepEqual(searchDateMetadata('2025-12-31T23:30:00.000Z'), { iso: '2025-12-31T23:30:00.000Z', year: '2026' });
  assert.deepEqual(searchDateMetadata(new Date('2025-12-31T22:30:00.000Z')), { iso: '2025-12-31T22:30:00.000Z', year: '2025' });
  assert.deepEqual(searchDateMetadata('2026-01-01T00:30:00+01:00'), { iso: '2025-12-31T23:30:00.000Z', year: '2026' });
  for (const value of [undefined, '', 'not-a-date', new Date(NaN)]) assert.equal(searchDateMetadata(value), null);
});

test('topic facets collapse case, surrounding whitespace and accented or English tag aliases', () => {
  for (const tag of ['crédit privé', '  CRÉDIT PRIVÉ  ', 'credit prive', 'private credit', 'PRIVATE-CREDIT']) {
    assert.deepEqual(searchTopicLabels([tag], 'fr'), ['Crédit privé & marchés privés']);
    assert.deepEqual(searchTopicLabels([tag], 'en'), ['Private credit and private markets']);
  }
  for (const tag of ['énergie', 'ÉNERGIE', ' energie ', 'ENERGY']) {
    assert.deepEqual(searchTopicLabels([tag], 'fr'), ['Géopolitique & énergie']);
    assert.deepEqual(searchTopicLabels([tag], 'en'), ['Geopolitics and energy']);
  }
});

test('multilingual tags retain every matching topic once, including overlapping crypto subjects', () => {
  const frenchTags = ['CRÉDIT PRIVÉ', 'credit prive', 'CLARITY ACT', 'énergie', 'crypto'];
  const englishTags = ['private-credit', 'PRIVATE CREDIT', 'clarity act', 'energy', 'bitcoin'];
  for (const tags of [frenchTags, englishTags]) {
    assert.deepEqual(searchTopicLabels(tags, 'fr'), [
      'Crédit privé & marchés privés', 'CLARITY Act & régulation crypto US', 'Géopolitique & énergie', 'Crypto & stablecoins',
    ]);
    assert.deepEqual(searchTopicLabels(tags, 'en'), [
      'Private credit and private markets', 'US crypto regulation', 'Geopolitics and energy', 'Crypto and stablecoins',
    ]);
  }
  assert.deepEqual(searchTopicLabels(['ORMUZ'], 'fr'), ['Ormuz & marché pétrolier', 'Géopolitique & énergie']);
});

test('topic facets expose the curated ten subjects and never invent a topic from unknown raw tags', () => {
  const tags = ['private-credit', 'repo', 'ormuz', 'clarity act', 'macro', 'energy', 'bitcoin', 'markets', 'us politics', 'ai financing'];
  assert.deepEqual(searchTopicLabels(tags, 'en'), [
    'Private credit and private markets', 'Liquidity, repo and collateral', 'Hormuz and oil', 'US crypto regulation',
    'Macro and central banks', 'Geopolitics and energy', 'Crypto and stablecoins', 'Markets and valuations', 'US politics',
    'AI financing',
  ]);
  for (const lang of ['fr', 'en']) {
    for (const input of [[], ['unlisted-subject'], ['<script>custom-subject</script>'], ['', '   ']]) {
      assert.deepEqual(searchTopicLabels(input, lang), []);
    }
    assert.deepEqual(searchTopicLabels(['repo', 'unlisted-subject'], lang), searchTopicLabels(['repo'], lang));
  }
});

test('AI financing aliases form one bilingual facet without classifying generic AI coverage', () => {
  const topic = topics.find(topic => topic.slug === 'financement-ia');
  assert.ok(topic);
  const aliases = ['financement de l’ia', "financement de l'ia", 'financement ia', 'financement-ia', 'ai financing', 'ai-financing'];
  for (const alias of aliases) {
    const tag = `  ${alias.toUpperCase()}  `;
    assert.equal(topicForTag(tag), 'financement-ia');
    assert.deepEqual(searchTopicLabels([tag], 'fr'), ['Financement de l’IA']);
    assert.deepEqual(searchTopicLabels([tag], 'en'), ['AI financing']);
  }
  assert.deepEqual(searchTopicLabels(aliases, 'en'), ['AI financing']);
  for (const tag of ['AI', 'IA', 'Nvidia', 'OpenAI', 'Anthropic', 'intelligence artificielle', 'data centers']) {
    assert.equal(postMatchesTopic([tag], topic), false, tag);
    assert.ok(!searchTopicLabels([tag], 'en').includes('AI financing'), tag);
  }
  assert.deepEqual(searchTopicLabels(['IA'], 'en'), ['Markets and valuations']);
  assert.equal(primaryTopic(['private-credit', 'ai financing'])?.slug, 'credit-prive');
});

test('curated historical analyses receive the financing facet by identity while unrelated articles keep tag classification', () => {
  const topic = topics.find(topic => topic.slug === 'financement-ia');
  const frenchId = 'financement-circulaire-ia';
  const englishId = 'ai-circular-financing';
  for (const id of [frenchId, englishId]) {
    assert.equal(postMatchesTopic([], topic, id), true);
    assert.equal(primaryTopic([], id)?.slug, 'financement-ia');
  }
  assert.deepEqual(searchTopicLabels(['marchés'], 'fr', frenchId), ['Marchés & valorisations', 'Financement de l’IA']);
  assert.deepEqual(searchTopicLabels(['markets'], 'en', englishId), ['Markets and valuations', 'AI financing']);
  assert.deepEqual(searchTopicLabels(['IA'], 'en', 'unrelated-ai-analysis'), ['Markets and valuations']);
  assert.equal(postMatchesTopic([], topic, 'ai-circular-financing-copy'), false);
  assert.equal(postMatchesTopic([], topic), false);
});

test('AI financing uses its existing canonical dossier while previous topic routes and order stay stable', () => {
  const existingSlugs = [
    'credit-prive', 'liquidite-repo', 'ormuz-petrole', 'regulation-crypto-us', 'macro-banques-centrales',
    'geopolitique-energie', 'crypto', 'marches-valorisations', 'politique-us',
  ];
  assert.deepEqual(topics.map(topic => topic.slug), [...existingSlugs, 'financement-ia']);
  for (const topic of topics) {
    const expected = topic.slug === 'financement-ia' ? '/dossiers/financement-ia/' : `/sujet/${topic.slug}/`;
    assert.equal(topicHref(topic), expected);
    assert.equal(topicHref(topic.slug), expected);
  }
});

test('initial unfiltered search is idle, accessible and uses the CSP-compatible Pagefind initialization', async () => {
  const h = await harness();
  assert.equal(h.calls.length, 0);
  assert.equal(h.status.getAttribute('role'), 'status');
  assert.equal(h.status.getAttribute('aria-live'), 'polite');
  assert.equal(h.status.textContent, '');
  assert.equal(h.lifecycle[0][0], 'options');
  assert.equal(h.lifecycle[0][1].noWorker, true);
  assert.equal(h.lifecycle[1][0], 'init');
  assert.equal(h.field('type').disabled, false);
  assert.deepEqual(h.field('year').children.map(option => option.value), ['', '2026', '2025']);
});

test('known URL state restores the query, all facets and newest order before the first search', async () => {
  const h = await harness({ url: 'https://l0g.fr/recherche/?q=cr%C3%A9dit&type=analysis&topic=IA&year=2026&sort=newest&focus=1' });
  assert.equal(h.input.value, 'crédit');
  assert.equal(h.input.focused, true);
  assert.deepEqual(h.calls, [{ query: 'crédit', options: { filters: { type: 'analysis', topic: 'IA', year: '2026' }, sort: { date: 'desc' } } }]);
  assert.equal(h.find('search-date-note').hidden, false);
  assert.equal(h.find('search-reset').hidden, false);
  assert.equal(h.window.location.search, '?q=cr%C3%A9dit&type=analysis&topic=IA&year=2026&sort=newest');
});

test('unknown URL facets and sort values are discarded without sending fabricated filters', async () => {
  const h = await harness({ url: 'https://l0g.fr/en/search/?q=debt&type=unknown&topic=Injected&year=2040&sort=external', lang: 'en' });
  assert.deepEqual(h.calls, [{ query: 'debt', options: { filters: {} } }]);
  assert.equal(h.window.location.search, '?q=debt');
  assert.equal(h.field('type').value, '');
  assert.equal(h.field('topic').value, '');
  assert.equal(h.field('year').value, '');
  assert.equal(h.field('sort').value, '');
});

test('facet changes send the combined type, subject and year, and relevance removes the explicit sort', async () => {
  const h = await harness();
  await h.submit('  assurance  ');
  await h.change('type', 'guide');
  await h.change('topic', 'Assurance');
  await h.change('year', '2025');
  await h.change('sort', 'newest');
  assert.deepEqual(h.calls.at(-1), { query: 'assurance', options: { filters: { type: 'guide', topic: 'Assurance', year: '2025' }, sort: { date: 'desc' } } });
  await h.change('sort', '');
  assert.deepEqual(h.calls.at(-1), { query: 'assurance', options: { filters: { type: 'guide', topic: 'Assurance', year: '2025' } } });
  assert.equal(h.window.location.search, '?q=assurance&type=guide&topic=Assurance&year=2025');
});

test('an empty query with a facet uses Pagefind null browsing, while a complete reset becomes idle', async () => {
  const h = await harness();
  await h.change('type', 'tool');
  assert.deepEqual(h.calls, [{ query: null, options: { filters: { type: 'tool' } } }]);
  await h.submit('   ');
  assert.equal(h.calls.at(-1).query, null);
  h.find('search-reset').dispatch('click');
  await settle();
  const count = h.calls.length;
  await h.submit('');
  assert.equal(h.calls.length, count);
  assert.equal(h.status.textContent, '');
  assert.equal(h.results.children.length, 0);
  assert.equal(h.window.location.search, '');
});

test('typing debounces the query and clear preserves selected facets', async () => {
  const h = await harness();
  for (const value of ['c', 'cr', 'crédit']) { h.input.value = value; h.input.dispatch('input'); }
  assert.equal(h.calls.length, 0);
  assert.equal(h.timers.size, 1);
  await h.flushInput();
  assert.equal(h.calls.length, 1);
  assert.equal(h.calls[0].query, 'crédit');
  await h.change('type', 'analysis');
  h.find('pagefind-ui__search-clear').dispatch('click');
  await settle();
  assert.equal(h.input.value, '');
  assert.equal(h.input.focused, true);
  assert.deepEqual(h.calls.at(-1), { query: null, options: { filters: { type: 'analysis' } } });
});

test('query URLs are encoded, edition links remain local and suggestions invoke the same search', async () => {
  const h = await harness();
  await h.submit('IA & crédit ? #');
  assert.equal(h.window.location.search, '?q=IA+%26+cr%C3%A9dit+%3F+%23');
  assert.equal(h.editions[0].href, '/recherche/?q=IA%20%26%20cr%C3%A9dit%20%3F%20%23');
  assert.equal(h.editions[1].href, '/en/search/?q=IA%20%26%20cr%C3%A9dit%20%3F%20%23');
  h.suggestion.dispatch('click');
  await settle();
  assert.equal(h.calls.at(-1).query, 'financement IA');
});

test('a late query response cannot replace a newer query or its results', async () => {
  const old = deferred();
  const h = await harness({ search: query => query === 'old' ? old.promise : response(documentResult('/posts/new/', 'Current result')) });
  await h.submit('old');
  await h.submit('new');
  old.resolve(response(documentResult('/posts/old/', 'Obsolete result')));
  await settle();
  assert.equal(h.results.children.length, 1);
  assert.match(h.results.textContent, /Current result/);
  assert.doesNotMatch(h.results.textContent, /Obsolete/);
  assert.match(h.status.textContent, /new/);
});

test('late document data and stale network errors cannot overwrite newer successful results', async () => {
  const oldData = deferred(), staleError = deferred();
  const h = await harness({ search: query => {
    if (query === 'old-data') return { results: [{ data: () => oldData.promise }] };
    if (query === 'old-error') return staleError.promise;
    return response(documentResult('/posts/current/', 'Fresh result'));
  } });
  await h.submit('old-data');
  await h.submit('old-error');
  await h.submit('current');
  oldData.resolve(documentResult('/posts/old/', 'Old data'));
  staleError.reject(new Error('Disconnected'));
  await settle();
  assert.equal(h.results.children.length, 1);
  assert.match(h.results.textContent, /Fresh result/);
  assert.doesNotMatch(h.results.textContent, /Old data/);
  assert.match(h.status.textContent, /current/);
  assert.doesNotMatch(h.status.textContent, /indisponible/);
});

test('module, facet, query and document failures expose a visible status instead of a silent empty result', async () => {
  const unavailable = /indisponible/;
  for (const setup of [
    { moduleError: new Error('Index failed') },
    { filters: () => Promise.reject(new Error('Filters failed')) },
  ]) {
    const h = await harness(setup);
    assert.match(h.status.textContent, unavailable);
    assert.equal(h.status.hidden, false);
  }
  const h = await harness({ search: () => Promise.reject(new Error('Query failed')) });
  await h.submit('dette');
  assert.match(h.status.textContent, unavailable);
  const broken = await harness({ lang: 'en', search: () => ({ results: [{ data: async () => { throw new Error('Fragment failed'); } }] }) });
  await broken.submit('debt');
  assert.match(broken.status.textContent, /cannot be displayed/);
});

test('untrusted titles and excerpts stay literal text while external, credentialed and executable URLs are skipped', async () => {
  const maliciousText = '<img src=x onerror=alert(1)><script>run()</script>';
  const urls = ['javascript:alert(1)', 'data:text/html,<script>run()</script>', 'https://evil.example/path', '//evil.example/path', 'https://user:pass@l0g.fr/posts/private/', '/posts/\ninvalid/'];
  const documents = urls.map((url, index) => documentResult(url, 'Rejected ' + index));
  documents.push(documentResult('/posts/safe/?a=1#source', maliciousText, {
    meta: { title: maliciousText, kind: 'analysis', date: '<svg onload=alert(1)>' },
    plain_excerpt: maliciousText,
    sub_results: [
      documentResult('https://evil.example/nested', 'Rejected nested'),
      documentResult('/posts/safe/#section', '<svg onload=run()>Section</svg>'),
    ],
  }));
  const h = await harness({ search: () => response(...documents) });
  await h.submit('safe');
  assert.equal(h.results.children.length, 1);
  const nodes = walk(h.results), links = nodes.filter(node => node.tagName === 'A');
  assert.deepEqual(links.map(link => link.href), ['/posts/safe/?a=1#source', '/posts/safe/#section']);
  assert.equal(links[0].textContent, maliciousText);
  assert.match(h.results.textContent, /<svg onload=alert\(1\)>/);
  assert.match(h.results.textContent, /<img src=x onerror=alert\(1\)>/);
  assert.equal(nodes.some(node => ['IMG', 'SCRIPT', 'SVG'].includes(node.tagName)), false);
});

test('Pagefind loading is shared across requests and same-origin absolute result URLs become local links', async () => {
  const h = await harness({ search: () => response(documentResult('https://l0g.fr/posts/local/?ref=source#chart', 'Local result')) });
  await h.submit('first');
  await h.submit('second');
  assert.equal(h.lifecycle.filter(([name]) => name === 'options').length, 1);
  assert.equal(h.lifecycle.filter(([name]) => name === 'init').length, 1);
  assert.equal(walk(h.results).find(node => node.tagName === 'A').href, '/posts/local/?ref=source#chart');
});
