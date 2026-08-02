import type { WeeklyEdition } from '../config/weekly-editions.ts';

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
}

function csvCell(value: string | number | boolean) {
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export function buildWeeklyCsv(edition: WeeklyEdition) {
  const header = [
    'observation_date',
    'measure',
    'value_usd_billions',
    'nature',
    'scope',
    'additive',
    'primary_source',
    'canonical_analysis',
  ];
  const rows = edition.chart.points.map((point) => [
    edition.chart.observationDate,
    point.label,
    point.value,
    point.nature,
    point.scope,
    point.additive,
    edition.chart.sourceUrl,
    `https://l0g.fr${edition.analysis.href}`,
  ]);
  return `${[header, ...rows].map((row) => row.map(csvCell).join(',')).join('\n')}\n`;
}

export function buildWeeklyCitationText(edition: WeeklyEdition) {
  const date = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Europe/Paris',
  }).format(new Date(edition.publishedAt));
  return `l0g.fr, « ${edition.title} », L'hebdo no ${edition.issue}, ${date}, https://l0g.fr/hebdo/${edition.slug}/, CC BY 4.0.`;
}

export function buildWeeklyLinkedInText(edition: WeeklyEdition) {
  return `${edition.linkedin}\n`;
}

export function buildWeeklyThreadText(edition: WeeklyEdition) {
  return `${edition.threadX.join('\n\n')}\n`;
}

export function buildWeeklyChartSvg(edition: WeeklyEdition) {
  const width = 1200;
  const height = 700;
  const chartX = 370;
  const chartWidth = 720;
  const max = Math.max(...edition.chart.points.map((point) => point.value));
  const colors = { signal: '#5eead4', accent: '#ff4d87', amber: '#f5b13d' } as const;
  const bars = edition.chart.points.map((point, index) => {
    const y = 170 + index * 92;
    const barWidth = Math.max(8, Math.round((point.value / max) * chartWidth));
    const color = colors[point.tone];
    return `<g>
      <text x="62" y="${y + 19}" fill="#d6d9df" font-size="20">${escapeXml(point.shortLabel)}</text>
      <text x="62" y="${y + 45}" fill="#8b909b" font-size="14">${escapeXml(point.nature)}</text>
      <rect x="${chartX}" y="${y}" width="${chartWidth}" height="48" rx="8" fill="#20242b"/>
      <rect x="${chartX}" y="${y}" width="${barWidth}" height="48" rx="8" fill="${color}" opacity="0.86"/>
      <text x="${Math.min(chartX + barWidth + 16, 1125)}" y="${y + 32}" fill="${color}" font-size="22" font-weight="700">${escapeXml(point.valueLabel)}</text>
    </g>`;
  }).join('\n');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title desc">
  <title id="title">${escapeXml(edition.chart.title)}</title>
  <desc id="desc">${escapeXml(edition.chart.subtitle)} ${escapeXml(edition.chart.note)}</desc>
  <rect width="${width}" height="${height}" fill="#0b0f14"/>
  <path d="M0 0H1200" stroke="#5eead4" stroke-width="8"/>
  <text x="62" y="72" fill="#5eead4" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20">// l0g · hebdo no ${edition.issue}</text>
  <text x="62" y="116" fill="#f5f6f8" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="750">${escapeXml(edition.chart.title)}</text>
  <text x="62" y="146" fill="#8b909b" font-family="Inter, Arial, sans-serif" font-size="17">${escapeXml(edition.chart.subtitle)}</text>
  <g font-family="ui-monospace, SFMono-Regular, Menlo, monospace">${bars}</g>
  <rect x="62" y="552" width="1076" height="82" rx="10" fill="#21131a" stroke="#ff4d87" stroke-opacity="0.55"/>
  <text x="88" y="585" fill="#ff4d87" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="18" font-weight="700">NE PAS ADDITIONNER</text>
  <text x="88" y="612" fill="#d6d9df" font-family="Inter, Arial, sans-serif" font-size="16">${escapeXml(edition.chart.note)}</text>
  <text x="62" y="674" fill="#8b909b" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="13">Source : ${escapeXml(edition.chart.sourceLabel)} · Graphique l0g.fr · CC BY 4.0</text>
</svg>`;
}
