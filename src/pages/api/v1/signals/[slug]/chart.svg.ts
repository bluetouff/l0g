import type { APIRoute, GetStaticPaths } from 'astro';
import {
  buildSignalSeriesSurface,
  signalSeriesRegistry,
  type SignalKey,
} from '../../../../../lib/signal-history.ts';

export const getStaticPaths = (() =>
  signalSeriesRegistry().map((series) => ({
    params: { slug: series.slug },
    props: { key: series.key },
  }))) satisfies GetStaticPaths;

const WIDTH = 1200;
const HEIGHT = 630;
const PLOT = { left: 92, right: 1140, top: 170, bottom: 500 };

function xml(value: unknown) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = ({ props }) => {
  const surface = buildSignalSeriesSurface(props.key as SignalKey);
  const { series } = surface;
  const observations = surface.observations
    .filter((item) => typeof item.value === 'number')
    .sort((left, right) => left.seriesDate.localeCompare(right.seriesDate));
  const times = observations.map((item) => Date.parse(item.seriesDate));
  const minTime = times.length ? Math.min(...times) : 0;
  const maxTime = times.length ? Math.max(...times) : 1;
  const span = Math.max(1, maxTime - minTime);
  const points = observations.map((item) => {
    const x = observations.length === 1
      ? (PLOT.left + PLOT.right) / 2
      : PLOT.left + ((Date.parse(item.seriesDate) - minTime) / span) * (PLOT.right - PLOT.left);
    const y = PLOT.bottom - ((item.value as number) / 100) * (PLOT.bottom - PLOT.top);
    return { x, y, item };
  });
  const path = points
    .map((point, index) => `${index ? 'L' : 'M'} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`)
    .join(' ');
  const firstDate = observations[0]?.seriesDate.slice(0, 10) ?? 'n/a';
  const lastDate = observations.at(-1)?.seriesDate.slice(0, 10) ?? 'n/a';
  const current = observations.at(-1);
  const description = `${series.description} Période disponible : ${firstDate} à ${lastDate}.`;
  const grid = [0, 25, 50, 75, 100].map((tick) => {
    const y = PLOT.bottom - (tick / 100) * (PLOT.bottom - PLOT.top);
    return `
      <line x1="${PLOT.left}" y1="${y}" x2="${PLOT.right}" y2="${y}" stroke="#2a3441" stroke-width="1"/>
      <text x="72" y="${y + 5}" fill="#9aa3af" font-family="ui-monospace,monospace" font-size="16" text-anchor="end">${tick}</text>`;
  }).join('');
  const dots = points.map((point) =>
    `<circle cx="${point.x.toFixed(2)}" cy="${point.y.toFixed(2)}" r="4.5" fill="#10151d" stroke="#5eead4" stroke-width="2"/>`
  ).join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="title desc">
  <title id="title">${xml(series.name)}</title>
  <desc id="desc">${xml(description)}</desc>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#0b0f14"/>
  <text x="${PLOT.left}" y="64" fill="#5eead4" font-family="ui-monospace,monospace" font-size="18">${xml(series.seriesId)}</text>
  <text x="${PLOT.left}" y="112" fill="#f4f7fb" font-family="ui-sans-serif,system-ui,sans-serif" font-size="34" font-weight="700">${xml(series.name)}</text>
  <text x="${PLOT.left}" y="145" fill="#9aa3af" font-family="ui-sans-serif,system-ui,sans-serif" font-size="17">Série publiée, échelle propre 0-100, sans interpolation</text>
  ${grid}
  ${path ? `<path d="${path}" fill="none" stroke="#5eead4" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>${dots}` : ''}
  <text x="${PLOT.left}" y="535" fill="#9aa3af" font-family="ui-monospace,monospace" font-size="16">${xml(firstDate)}</text>
  <text x="${PLOT.right}" y="535" fill="#9aa3af" font-family="ui-monospace,monospace" font-size="16" text-anchor="end">${xml(lastDate)}</text>
  <text x="${PLOT.left}" y="585" fill="#f4f7fb" font-family="ui-monospace,monospace" font-size="18">Dernier point : ${xml(current?.value ?? 'n/a')}/100</text>
  <text x="${PLOT.right}" y="585" fill="#9aa3af" font-family="ui-monospace,monospace" font-size="16" text-anchor="end">Source : l0g.fr/series/${xml(series.slug)}/ · CC BY 4.0</text>
</svg>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
