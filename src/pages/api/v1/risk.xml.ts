import type { APIRoute } from 'astro';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Flux Atom des changements de niveau de risque (franchissements de seuil).
 * Lit /risk-events.json — alimenté par le builder zen : à chaque snapshot, si le
 * `level`/`tone` d'un signal change vs le snapshot précédent, on append un événement.
 * Pour bots (Matrix/Signal/Telegram), agrégateurs de veille, SIEM.
 */

const SITE = 'https://l0g.fr';

function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const GET: APIRoute = () => {
  let events: any[] = [];
  let updated = new Date().toISOString();
  try {
    const data = JSON.parse(
      readFileSync(join(process.cwd(), 'public/risk-events.json'), 'utf-8')
    );
    events = Array.isArray(data.events) ? data.events.slice() : [];
    if (data.updated) updated = data.updated;
  } catch {
    /* pas d'événements encore */
  }

  // Plus récents d'abord, plafonné à 50.
  events.sort((a, b) => String(b.ts).localeCompare(String(a.ts)));
  const entries = events
    .slice(0, 50)
    .map((e) => {
      const id = `tag:l0g.fr,2026:risk/${e.key}/${e.ts}`;
      const title = `${e.label || e.key} : ${e.from} → ${e.to} (${e.value})`;
      const link = e.source || `${SITE}/`;
      return `  <entry>
    <title>${esc(title)}</title>
    <id>${esc(id)}</id>
    <updated>${esc(e.ts)}</updated>
    <link href="${esc(link)}"/>
    <category term="${esc(e.tone)}"/>
    <summary>Signal ${esc(e.label || e.key)} passé de ${esc(e.from)} à ${esc(e.to)} (valeur ${esc(e.value)}/100, normalisée par instrument).</summary>
  </entry>`;
    })
    .join('\n');

  const feed = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>l0g — changements de niveau de risque</title>
  <subtitle>Franchissements de seuil des signaux l0g : US Macro, EU Macro, Yen Carry, Énergie, Dette US.</subtitle>
  <link href="${SITE}/api/v1/risk.xml" rel="self"/>
  <link href="${SITE}/api/"/>
  <id>${SITE}/api/v1/risk.xml</id>
  <updated>${esc(updated)}</updated>
  <author><name>l0g.fr</name></author>
  <rights>CC BY 4.0 — l0g.fr</rights>
${entries}
</feed>
`;

  return new Response(feed, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8' },
  });
};
