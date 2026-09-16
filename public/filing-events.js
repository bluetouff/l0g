/* Journal public : texte via le DOM, liens SEC reconstruits depuis des identifiants stricts. */
const KINDS = {
  baseline: 'État initial',
  filing_observed: 'Dépôt observé',
  amendment_observed: 'Amendement observé',
  data_revised: 'Données révisées',
};
const COMPOSITION = {
  complete: 'Composition complète',
  missing_base: 'Dépôt initial manquant',
  missing_amendment: 'Amendement manquant',
  unknown_amendment: 'Amendement non classé',
};

export function secSourceUrl(cik, source) {
  if (typeof cik !== 'string' || typeof source?.accession !== 'string' || !/^[0-9]{10}$/.test(cik) || Number(cik) === 0 ||
      !/^[0-9]{10}-[0-9]{2}-[0-9]{6}$/.test(source?.accession)) return null;
  const expected = `https://www.sec.gov/Archives/edgar/data/${Number(cik)}/${source.accession.replaceAll('-', '')}/`;
  return source.url === expected ? expected : null;
}

function timestamp(value) {
  const date = typeof value === 'string' ? new Date(value) : null;
  return date && Number.isFinite(date.getTime())
    ? date.toLocaleString('fr-FR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Paris' })
    : 'date indisponible';
}

export function stateSummary(state) {
  if (!state) return 'Aucune observation antérieure dans ce journal.';
  const status = Object.hasOwn(COMPOSITION, state.composition_status) ? COMPOSITION[state.composition_status] : 'Composition inconnue';
  if (state.composition_status !== 'complete') return `${status} ; total reconstitué indisponible.`;
  const positions = Number.isSafeInteger(state.positions) && state.positions >= 0 ? `${state.positions} positions` : 'nombre de positions indisponible';
  const value = typeof state.portfolio_value_usd === 'number' && Number.isFinite(state.portfolio_value_usd) && state.portfolio_value_usd >= 0
    ? state.portfolio_value_usd.toLocaleString('fr-FR', { maximumFractionDigits: 20 }) + ' USD'
    : 'valeur indisponible';
  return `${status} : ${positions} ; ${value}.`;
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text != null) node.textContent = text;
  if (className) node.className = className;
  return node;
}

export function renderFilingEvents(feed) {
  const root = document.querySelector('[data-filing-events]');
  if (!root) return;
  const status = root.querySelector('[data-filing-status]');
  const list = root.querySelector('[data-filing-list]');
  const valid = feed?.version === 1 && Array.isArray(feed.events) &&
    ['ok', 'catching_up', 'unavailable'].includes(feed.status);
  list.replaceChildren();
  if (!valid) {
    status.textContent = 'Journal indisponible : aucune observation datée reçue.';
    return;
  }
  const lastSuccess = Date.parse(feed.lastSuccessAt);
  const stale = !Number.isFinite(lastSuccess) || Date.now() - lastSuccess > 26 * 3600 * 1000;
  const parts = [feed.status === 'unavailable' || stale
    ? 'Collecte indisponible ou ancienne : observations conservées.'
    : feed.status === 'catching_up' ? 'Rattrapage du journal en cours.' : 'Journal reçu.'];
  parts.push('Dernière collecte réussie : ' + timestamp(feed.lastSuccessAt) + '.');
  if (feed.startedAt) parts.push('Journal commencé le ' + timestamp(feed.startedAt) + '.');
  if (feed.historyResetAt) parts.push('Historique repris après changement du flux le ' + timestamp(feed.historyResetAt) + '.');
  const events = feed.events.filter(event => event && Object.hasOwn(KINDS, event.kind) && event.fund && event.after)
    .slice(-12).reverse();
  parts.push(`${events.length} observations affichées sur ${feed.events.length} conservées ici (100 au maximum).`);
  status.textContent = parts.join(' ');
  if (!events.length) list.append(element('p', 'Aucune observation disponible dans cette fenêtre.'));
  for (const event of events) {
    const detail = element('details', null, 'filing-event');
    detail.append(element('summary', `${event.fund.label} · ${KINDS[event.kind]} · positions au ${event.report_date}`));
    const content = element('div', null, 'filing-event-content');
    content.append(element('p', `Avant : ${stateSummary(event.before)}`));
    content.append(element('p', `Après : ${stateSummary(event.after)}`));
    if (Array.isArray(event.changed_fields) && event.changed_fields.includes('holdings_hash')) {
      content.append(element('p', 'Le contenu des positions ou leurs identifiants a changé.'));
    }
    const amendment = event.after.amendment_type;
    if (amendment === 'NEW HOLDINGS' || amendment === 'RESTATEMENT') {
      content.append(element('p', amendment === 'NEW HOLDINGS'
        ? 'NEW HOLDINGS : ajout de lignes à la déclaration du trimestre.'
        : 'RESTATEMENT : remplacement de la déclaration du trimestre.'));
    }
    content.append(element('p', `Publication SEC : ${event.after.published_on} (précision au jour). Observé par 13FLOW : ${timestamp(event.recorded_at)}. Reçu par l0g : ${timestamp(event.firstSeenAt)}.`, 'text-muted'));
    const sources = element('p', 'Sources du nouvel état : ');
    for (const source of (Array.isArray(event.after.sources) ? event.after.sources : []).slice(0, 100)) {
      const url = secSourceUrl(event.fund.cik, source);
      if (!url) continue;
      const link = element('a', source.accession, 'link-term');
      link.href = url;
      sources.append(link, document.createTextNode(' '));
    }
    content.append(sources);
    detail.append(content);
    list.append(detail);
  }
}
