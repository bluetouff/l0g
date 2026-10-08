import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { totalHttpRequests } from '../src/lib/traffic-summary.mjs';
import {
  buildHumanTrafficReport,
  classifyTrafficRequest,
  parseHumanHtmlRequest,
} from './human-traffic-report.mjs';
import {
  buildWeeklyAudienceTable,
  weeklyAudienceMarkdown,
} from './weekly-audience-report.mjs';

const root = new URL('../', import.meta.url);

function log({
  ip = '203.0.113.9',
  date = '30/Jul/2026:12:34:56 +0200',
  method = 'GET',
  path = '/analyse/',
  status = 200,
  referrer = 'https://www.google.com/search?q=l0g',
  userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Safari/605.1.15',
} = {}) {
  return `${ip} - - [${date}] "${method} ${path} HTTP/2.0" ${status} 1234 "${referrer}" "${userAgent}"`;
}

test('ne conserve que les GET 200 de documents HTML humains', () => {
  assert.deepEqual(parseHumanHtmlRequest(log()), {
    day: '2026-07-30',
    page: '/analyse/',
    referrer: 'google.com',
  });
  assert.equal(parseHumanHtmlRequest(log({ method: 'POST' })), null);
  assert.equal(parseHumanHtmlRequest(log({ status: 301 })), null);
  assert.equal(parseHumanHtmlRequest(log({ path: '/api/mcp/compact' })), null);
  assert.equal(parseHumanHtmlRequest(log({ path: '/wp-admin/' })), null);
  assert.equal(parseHumanHtmlRequest(log({ path: '/rss.xml' })), null);
  assert.equal(parseHumanHtmlRequest(log({ path: '/_astro/app.abc.js' })), null);
  assert.equal(parseHumanHtmlRequest(log({ userAgent: 'Googlebot/2.1' })), null);
  assert.equal(parseHumanHtmlRequest(log({ userAgent: 'WhatsApp/2.26' })), null);
  assert.equal(parseHumanHtmlRequest(log({ userAgent: 'SkypeUriPreview/1.0' })), null);
  assert.equal(parseHumanHtmlRequest(log({ userAgent: 'l0g-health-probe/1' })), null);
});

test('normalise la page et réduit le référent au domaine', () => {
  assert.deepEqual(parseHumanHtmlRequest(log({
    path: '/guides/index.html?utm_source=test',
    referrer: 'https://news.ycombinator.com/item?id=42',
  })), {
    day: '2026-07-30',
    page: '/guides/',
    referrer: 'news.ycombinator.com',
  });
  assert.equal(parseHumanHtmlRequest(log({ referrer: '-' }))?.referrer, '(direct)');
  assert.equal(parseHumanHtmlRequest(log({ referrer: 'mailto:test@example.test' }))?.referrer, '(unknown)');
});

test('exclut les clients HTTP déclarés sans les confondre avec les crawlers ou les navigateurs', () => {
  for (const userAgent of ['python-httpx2/2.7.0', 'python-httpx/0.28.1', 'Python/3.11', 'Python-urllib/3.14', 'python-requests/2.32.5', 'curl/8.0', 'Wget/1.25', 'HTTPie/3.2', 'Python/3.12 aiohttp/3.9']) {
    assert.equal(parseHumanHtmlRequest(log({ userAgent })), null, userAgent);
    assert.equal(classifyTrafficRequest(log({ userAgent }))?.category, 'other', userAgent);
    assert.equal(classifyTrafficRequest(log({ userAgent, path: '/api/mcp' }))?.category, 'mcp_api');
    assert.equal(classifyTrafficRequest(log({ userAgent, path: '/wp-login.php' }))?.category, 'scans');
  }
  const report = buildHumanTrafficReport([
    ...Array.from({ length: 5 }, () => log()),
    ...Array.from({ length: 5 }, () => log({ userAgent: 'python-httpx/0.28.1' })),
  ], { now: new Date('2026-07-30T20:00:00Z') });
  assert.equal(report.totals.html_gets, 5);
  assert.equal(report.traffic_classes.totals.other, 5);
  assert.equal(report.traffic_classes.rolling_7_days.human_referrers.google, 5);
  const table = buildWeeklyAudienceTable(report);
  assert.equal(table.source_filter_version, 'html-ua-filter-2');
  assert.match(weeklyAudienceMarkdown(table), /Filtre : html-ua-filter-2/);
  delete report.measurement.filter_version;
  assert.equal(buildWeeklyAudienceTable(report).source_filter_version, null);
  assert.match(weeklyAudienceMarkdown(buildWeeklyAudienceTable(report)), /version non renseignée/);
});

test('sépare strictement audience, MCP/API, previews, crawlers et scans', () => {
  assert.equal(classifyTrafficRequest(log())?.category, 'human_html');
  assert.equal(classifyTrafficRequest(log({ method: 'POST', path: '/api/mcp' }))?.category, 'mcp_api');
  assert.equal(classifyTrafficRequest(log({ path: '/og/card.png', userAgent: 'Twitterbot/1.0' }))?.category, 'social_previews');
  assert.equal(classifyTrafficRequest(log({ userAgent: 'WhatsApp/2.26' }))?.category, 'social_previews');
  assert.equal(classifyTrafficRequest(log({ path: '/wp-login.php' }))?.category, 'scans');
  assert.equal(classifyTrafficRequest(log({ userAgent: 'Googlebot/2.1' }))?.category, 'known_crawlers');
  assert.equal(classifyTrafficRequest(log({ path: '/favicon.svg' }))?.category, 'other');
  for (const userAgent of ['', '-']) {
    assert.equal(classifyTrafficRequest(log({ userAgent }))?.category, 'other');
    assert.equal(parseHumanHtmlRequest(log({ userAgent })), null);
  }
});

test('les canaux hebdomadaires agrègent avant k sans confondre Google et un domaine usurpé', () => {
  const lines = [];
  for (let day = 24; day <= 30; day += 1) {
    for (const referrer of ['https://google.fr/search', 'https://t.co/example', '-', 'https://google.com.evil.test/']) {
      lines.push(log({ date: `${day}/Jul/2026:12:00:00 +0200`, referrer }));
    }
  }
  const report = buildHumanTrafficReport(lines, { now: new Date('2026-07-30T20:00:00Z') });
  assert.deepEqual(report.daily, []); // every day is below k, each weekly channel is publishable
  assert.deepEqual(report.traffic_classes.rolling_7_days.human_referrers, { google: 7, x: 7, direct: 7, other: 7 });
  assert.equal(report.traffic_classes.rolling_7_days.requests.human_html, 28);
  assert.equal(report.traffic_classes.rolling_7_days.days_observed, 7);
  const table = buildWeeklyAudienceTable(report);
  assert.equal(table.acquisition.google, 7);
  assert.match(weeklyAudienceMarkdown(table), /Google \| 7/);
  delete report.traffic_classes.rolling_7_days.human_referrers;
  assert.equal(buildWeeklyAudienceTable(report).acquisition, null);
  assert.match(weeklyAudienceMarkdown(buildWeeklyAudienceTable(report)), /Indisponible/);
});

test('agrège par jour, page et domaine avec k supérieur ou égal à cinq', () => {
  const lines = [];
  for (let index = 0; index < 5; index += 1) lines.push(log());
  for (let index = 0; index < 4; index += 1) {
    lines.push(log({
      ip: `198.51.100.${index}`,
      path: '/article-secret/',
      referrer: 'https://small.example/private/path',
    }));
  }
  lines.push(log({ userAgent: 'ClaudeBot/1.0' }));
  const report = buildHumanTrafficReport(lines, { now: new Date('2026-07-30T20:00:00Z') });
  const serialized = JSON.stringify(report);

  assert.equal(report.totals.html_gets, 9);
  assert.deepEqual(report.daily, [{
    date: '2026-07-30',
    html_gets: 9,
    pages: [{ page: '/analyse/', count: 5 }],
    referrers: [{ domain: 'google.com', count: 5 }],
  }]);
  assert.doesNotMatch(serialized, /203\.0\.113|198\.51\.100|small\.example|private\/path/);
  assert.deepEqual(report.traffic_classes.totals, {
    human_html: 9,
    mcp_api: 0,
    social_previews: 0,
    known_crawlers: 1,
    scans: 0,
    other: 0,
  });
});

test('produit le tableau hebdomadaire depuis human-traffic sans métrique GoAccess unique', () => {
  const lines = [];
  for (let day = 24; day <= 30; day += 1) {
    for (let index = 0; index < 5; index += 1) lines.push(log({ date: `${day}/Jul/2026:12:00:00 +0200` }));
    lines.push(log({ date: `${day}/Jul/2026:12:00:00 +0200`, method: 'POST', path: '/api/mcp' }));
  }
  const report = buildHumanTrafficReport(lines, { now: new Date('2026-07-30T20:00:00Z') });
  const table = buildWeeklyAudienceTable(report, { through: '2026-07-30' });
  const markdown = weeklyAudienceMarkdown(table);

  assert.equal(table.audience_metric.value, 35);
  assert.equal(table.operations.mcp_api, 7);
  assert.match(markdown, /Lectures HTML filtrées \| 35/);
  assert.doesNotMatch(markdown, /visiteurs uniques|unique visitors|GoAccess/i);
});

test('masque un jour entier sous k et coupe la rétention', () => {
  const lines = [
    ...Array.from({ length: 4 }, () => log()),
    ...Array.from({ length: 5 }, () => log({ date: '01/Jan/2026:12:00:00 +0100' })),
  ];
  const report = buildHumanTrafficReport(lines, { now: new Date('2026-07-30T20:00:00Z') });
  assert.deepEqual(report.daily, []);
  assert.equal(report.totals.html_gets, 0);
});

test('exécute le collecteur sans root avec un accès borné aux logs Apache', async () => {
  const [service, installer] = await Promise.all([
    readFile(new URL('deploy/l0g-human-traffic.service', root), 'utf8'),
    readFile(new URL('deploy/install-human-traffic.sh', root), 'utf8'),
  ]);
  assert.match(service, /^User=l0grisk$/m);
  assert.match(service, /^Group=l0grisk$/m);
  assert.match(service, /^SupplementaryGroups=adm$/m);
  assert.match(service, /^ExecStart=\/opt\/nodejs-lts\/bin\/node /m);
  assert.match(service, /^CapabilityBoundingSet=$/m);
  assert.match(service, /^ReadOnlyPaths=\/var\/log\/apache2 /m);
  assert.match(installer, /getent group adm/);
  assert.match(installer, /NODE_BIN="\/opt\/nodejs-lts\/bin\/node"/);
  assert.match(installer, /"\$NODE_MAJOR" -lt 22/);
});


test('HTTP total sums disjoint classes and preserves missing or invalid counts as unknown', () => {
  const report = buildHumanTrafficReport([
    ...Array.from({ length: 5 }, () => log()),
    log({ path: '/api/mcp' }),
    log({ userAgent: 'Twitterbot/1.0' }),
    log({ userAgent: 'Googlebot/2.1' }),
    log({ path: '/wp-login.php' }),
    log({ path: '/_astro/main.js' }),
  ], { now: new Date('2026-07-30T20:00:00Z') });
  assert.equal(totalHttpRequests(report), 10);
  assert.equal(report.totals.html_gets, 5);
  assert.equal(totalHttpRequests({}), null);
  for (const value of [undefined, null, -1, 0.5, '2', Number.MAX_SAFE_INTEGER]) {
    const invalid = structuredClone(report);
    invalid.traffic_classes.totals.other = value;
    assert.equal(totalHttpRequests(invalid), null);
  }
  assert.equal(totalHttpRequests(buildHumanTrafficReport([], { now: new Date('2026-07-30T20:00:00Z') })), 0);
});
