import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildHumanTrafficReport,
  parseHumanHtmlRequest,
} from './human-traffic-report.mjs';

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
  assert.equal(parseHumanHtmlRequest(log({ path: '/rss.xml' })), null);
  assert.equal(parseHumanHtmlRequest(log({ path: '/_astro/app.abc.js' })), null);
  assert.equal(parseHumanHtmlRequest(log({ userAgent: 'Googlebot/2.1' })), null);
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
