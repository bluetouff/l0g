import { classifyTrafficRequest, parseHumanHtmlRequest, HUMAN_TRAFFIC_RETENTION_DAYS, HUMAN_TRAFFIC_MINIMUM_COHORT } from '../human-traffic-report.mjs';
import { MAX_ROWS } from './storage.mjs';

export const AI_REFERRERS = Object.freeze(['chatgpt.com', 'chat.openai.com', 'perplexity.ai', 'www.perplexity.ai', 'claude.ai', 'copilot.microsoft.com', 'gemini.google.com']);

// A single mutually exclusive partition with complementary suppression. Do
// not publish marginal totals which would reveal suppressed cells by subtraction.
// Log lines are consumed transiently; no raw line, IP, UA or referrer URL survives.
export function privateTraffic(lines, now = new Date()) {
  if (!Array.isArray(lines) || lines.length > MAX_ROWS) throw new Error('traffic_rows_exceeded');
  const cutoff = new Date(now); cutoff.setUTCDate(cutoff.getUTCDate() - HUMAN_TRAFFIC_RETENTION_DAYS + 1);
  const from = cutoff.toISOString().slice(0, 10), through = now.toISOString().slice(0, 10);
  const counts = new Map(); let rejected = 0, parsed = 0;
  for (const line of lines) {
    const classified = classifyTrafficRequest(line);
    if (!classified) { rejected++; continue; }
    parsed++;
    if (classified.day < from || classified.day > through) continue;
    const human = parseHumanHtmlRequest(line);
    const referrer = human && AI_REFERRERS.includes(human.referrer) ? human.referrer : 'unknown_or_other';
    const category = /^l0g(?:\.fr)?[./ _-]/i.test(line.match(/"([^"]*)"$/)?.[1] ?? '') ? 'internal_probe' : classified.category;
    const key = JSON.stringify({ date: classified.day, category, referrer, crawler_authenticity: category === 'known_crawlers' ? 'declared_only' : 'not_determined' });
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const groups = new Map();
  for (const [key, requests] of counts) {
    const cell = { ...JSON.parse(key), requests };
    const group = `${cell.date}:${cell.category}`;
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(cell);
  }
  const cells = [...groups.values()].flatMap(group => {
    const published = group.filter(cell => cell.requests >= HUMAN_TRAFFIC_MINIMUM_COHORT);
    // Existing public class totals must not reveal a small referrer cell by
    // subtraction. Hide an additional cell in that marginal group when needed.
    if (published.length && published.length < group.length) {
      const secondary = [...published].sort((a, b) => a.requests - b.requests || a.referrer.localeCompare(b.referrer))[0];
      return published.filter(cell => cell !== secondary);
    }
    return published;
  });
  return { schema_version: '1.0.0', state: rejected ? (parsed ? 'partial' : 'error') : cells.length ? 'measured' : 'no_data', checked_at: now.toISOString(), period: { from, through }, timezone: 'native Apache calendar dates; timezone not inferred', retention_days: HUMAN_TRAFFIC_RETENTION_DAYS, minimum_cohort: HUMAN_TRAFFIC_MINIMUM_COHORT, filter_version: 'visibility-html-ua-filter-1 + existing human-traffic parser', metric: 'requêtes HTML filtrées avec référent IA observé', cells, rejected_lines: rejected, suppression: 'Single disjoint date/class/referrer partition; cells < k omitted, no overall totals or overlapping margins. Missing cells do not mean zero.', limitations: ['User-Agent does not verify crawler identity.', 'Requests are not sessions, unique people, reads or conversions.', 'Historical Apache collection policy not audited by this import.'] };
}
