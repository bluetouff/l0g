#!/usr/bin/env node

import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TRAFFIC_CLASSES } from './human-traffic-report.mjs';

const LABELS = {
  human_html: 'Lectures HTML humaines',
  mcp_api: 'MCP et API',
  social_previews: 'Prévisualisations sociales',
  known_crawlers: 'Robots connus',
  scans: 'Scans opportunistes',
  other: 'Autres requêtes',
};

export function buildWeeklyAudienceTable(report, { through } = {}) {
  const rolling = report?.traffic_classes?.rolling_7_days;
  if (!rolling?.requests || !rolling.from || !rolling.through) {
    throw new Error('human_traffic_schema_1_1_required');
  }
  if (through && through !== rolling.through) {
    throw new Error(`fenetre_indisponible:${through};rapport=${rolling.through}`);
  }
  const minimum = Number(report.minimum_public_cohort) || 5;
  const requests = Object.fromEntries(TRAFFIC_CLASSES.map((category) => [
    category,
    rolling.requests[category] ?? null,
  ]));
  return {
    schema_version: '1.0.0',
    generated_at: new Date().toISOString(),
    source: '/api/v1/human-traffic.json',
    source_generated_at: report.generated_at,
    interval: { from: rolling.from, through: rolling.through, days: 7 },
    unit: 'requêtes servies',
    audience_metric: {
      name: 'lectures_html_humaines',
      value: requests.human_html,
      definition: report.traffic_classes.definitions?.human_html,
      caveat: 'Une lecture HTML servie n’est pas une personne unique.',
    },
    operations: {
      mcp_api: requests.mcp_api,
      social_previews: requests.social_previews,
      known_crawlers: requests.known_crawlers,
      scans: requests.scans,
      other: requests.other,
    },
    suppression: `Les valeurs inférieures à k=${minimum} sont nulles.`,
    forbidden_interpretation: 'Les classes techniques ne sont pas une audience et ne doivent pas être additionnées aux lectures HTML.',
  };
}

export function weeklyAudienceMarkdown(table) {
  const value = (count) => count === null ? '< k' : String(count);
  const lines = [
    `# Audience l0g, ${table.interval.from} au ${table.interval.through}`,
    '',
    '| Mesure | Requêtes | Usage |',
    '| --- | ---: | --- |',
    `| ${LABELS.human_html} | ${value(table.audience_metric.value)} | Audience, avec la réserve qu’une lecture n’est pas une personne |`,
    `| ${LABELS.mcp_api} | ${value(table.operations.mcp_api)} | Usage machine |`,
    `| ${LABELS.social_previews} | ${value(table.operations.social_previews)} | Distribution, pas audience |`,
    `| ${LABELS.known_crawlers} | ${value(table.operations.known_crawlers)} | Indexation et automatisation |`,
    `| ${LABELS.scans} | ${value(table.operations.scans)} | Sécurité et bruit |`,
    `| ${LABELS.other} | ${value(table.operations.other)} | Assets, redirections, erreurs et non-classé |`,
    '',
    `Source : ${table.source}. ${table.forbidden_interpretation}`,
    '',
  ];
  return lines.join('\n');
}

async function runCli() {
  const args = process.argv.slice(2);
  const get = (name) => {
    const prefix = `${name}=`;
    const inline = args.find((arg) => arg.startsWith(prefix));
    if (inline) return inline.slice(prefix.length);
    const index = args.indexOf(name);
    return index >= 0 ? args[index + 1] : null;
  };
  const input = get('--input');
  if (!input) throw new Error('--input est requis');
  const format = get('--format') ?? 'markdown';
  if (!['markdown', 'json'].includes(format)) throw new Error('--format doit être markdown ou json');
  const report = JSON.parse(await readFile(resolve(input), 'utf8'));
  const table = buildWeeklyAudienceTable(report, { through: get('--through') ?? undefined });
  const rendered = format === 'json' ? `${JSON.stringify(table, null, 2)}\n` : weeklyAudienceMarkdown(table);
  const output = get('--output');
  if (output) await writeFile(resolve(output), rendered);
  else process.stdout.write(rendered);
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  await runCli();
}
