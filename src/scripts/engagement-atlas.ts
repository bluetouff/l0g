import { assertAtlasDataset, atlasAt, atlasSelection, atlasSourceUrl, formatAtlasDate, type AtlasDataset } from '../lib/engagement-atlas.ts';

function initAtlas(root: HTMLElement) {
  let dataset: AtlasDataset;
  try {
    const parsed: unknown = JSON.parse(root.querySelector('[data-atlas-data]')?.textContent ?? '');
    assertAtlasDataset(parsed);
    dataset = parsed;
  } catch { return; } // Keep the source-backed static reading path usable.

  const find = <T extends Element = HTMLElement>(selector: string) => root.querySelector<T>(selector)!;
  const preferredRelation = root.dataset.atlasInitialRelation;
  let state = atlasSelection(dataset, location.hash, preferredRelation);
  let focusNode = '';
  const map = find('[data-atlas-map]');
  const svg = find<SVGSVGElement>('[data-atlas-lines]');
  const paths = find<SVGGElement>('[data-atlas-paths]');
  const relationList = find('[data-atlas-relation-list]');
  const kindLabels = { announcement: 'Annonce des parties', contract: 'Relation déclarée', limitation: 'Limites documentées' };
  const nodeLabel = (id: string) => id === 'aip' && state.date < '2025-03-19' ? 'GAIIP' : dataset.nodes.find(item => item.id === id)!.label;
  const put = (selector: string, text: string) => { find(selector).textContent = text; };
  const scenarioIds = new Set(['openai-sb-lease', 'nvidia-sb-guarantee', 'openai-nvidia-indemnity']);

  function draw() {
    paths.replaceChildren();
    if (map.clientWidth < 700 || getComputedStyle(svg).display === 'none') return;
    const bounds = map.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    svg.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    const colors = getComputedStyle(root);
    const snapshot = atlasAt(dataset, state.date);
    const firstNodeTop = Math.min(...snapshot.nodes.map(node => find(`[data-atlas-node="${node.id}"]`).getBoundingClientRect().top)) - bounds.top;
    for (const [index, relation] of snapshot.relations.entries()) {
      const startNode = find<HTMLElement>(`[data-atlas-node="${relation.from}"]`);
      const endNode = find<HTMLElement>(`[data-atlas-node="${relation.to}"]`);
      const a = startNode.getBoundingClientRect(), b = endNode.getBoundingClientRect();
      const sameColumn = Math.abs(a.x - b.x) < 5;
      let d: string;
      if (sameColumn) {
        const x = a.right - bounds.left;
        const y1 = a.y + a.height / 2 - bounds.top, y2 = b.y + b.height / 2 - bounds.top;
        const turn = Math.min(bounds.width - 12, x + 28);
        d = `M${x},${y1} C${turn},${y1} ${turn},${y2} ${x},${y2}`;
      } else {
        const forward = b.x > a.x;
        const x1 = (forward ? a.right : a.left) - bounds.left, x2 = (forward ? b.left : b.right) - bounds.left;
        const y1 = a.y + a.height / 2 - bounds.top, y2 = b.y + b.height / 2 - bounds.top;
        const columnsApart = Math.abs(nodePosition(relation.from) - nodePosition(relation.to));
        if (columnsApart > 1) {
          // Use the gutter above the nodes so a long link cannot imply an intermediate connection.
          const offset = forward ? 12 : -12;
          const rail = Math.max(6, firstNodeTop - 10 - (index % 6) * 2);
          d = `M${x1},${y1} H${x1 + offset} V${rail} H${x2 - offset} V${y2} H${x2}`;
        } else {
          d = `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`;
        }
      }
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const selected = state.scenario ? scenarioIds.has(relation.id) : relation.id === state.relation;
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', colors.getPropertyValue(selected ? '--color-signal' : '--color-muted').trim());
      path.setAttribute('stroke-width', selected ? '2.5' : '1.25');
      path.setAttribute('opacity', selected ? '1' : focusNode || state.scenario ? '.2' : '.55');
      path.setAttribute('marker-end', 'url(#atlas-arrow)');
      if (relation.observation.kind === 'announcement') path.setAttribute('stroke-dasharray', '5 5');
      paths.append(path);
    }
  }

  function nodePosition(id: string) { return dataset.nodes.find(node => node.id === id)!.column; }

  function render(updateLocation = true) {
    const focusedRelation = document.activeElement instanceof HTMLElement ? document.activeElement.dataset.atlasRelation : undefined;
    const snapshot = atlasAt(dataset, state.date);
    const selected = snapshot.relations.find(item => item.id === state.relation) ?? snapshot.relations.at(-1)!;
    state.relation = selected.id;
    if (!snapshot.relations.some(item => item.id === 'nvidia-sb-guarantee')) state.scenario = false;
    if (!snapshot.nodes.some(item => item.id === focusNode)) focusNode = '';
    root.querySelectorAll<HTMLButtonElement>('[data-atlas-date]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.atlasDate === state.date)));
    put('[data-atlas-change]', snapshot.milestone!.change);
    put('[data-atlas-count]', `${snapshot.nodes.length} acteurs et structures · ${snapshot.relations.length} relations`);
    root.querySelectorAll<HTMLElement>('[data-record-date]').forEach(element => { element.hidden = element.dataset.recordDate! > state.date; });
    root.querySelectorAll<HTMLElement>('[data-record-relation]').forEach(element => { element.hidden = !snapshot.relations.some(item => item.id === element.dataset.recordRelation); });
    for (const element of root.querySelectorAll<HTMLElement>('[data-atlas-node]')) {
      const id = element.dataset.atlasNode!;
      element.hidden = !snapshot.nodes.some(item => item.id === id);
      const links = snapshot.relations.filter(item => item.from === id || item.to === id);
      element.querySelector('[data-node-label]')!.textContent = nodeLabel(id);
      element.querySelector('[data-node-count]')!.textContent = `${links.length} relation${links.length > 1 ? 's' : ''}`;
      const active = state.scenario ? links.some(item => scenarioIds.has(item.id)) : id === selected.from || id === selected.to;
      element.dataset.selected = String(active);
      element.dataset.dim = String((Boolean(focusNode) || state.scenario) && !active && id !== focusNode);
      element.setAttribute('aria-label', `${nodeLabel(id)}, explorer ${links.length} relation${links.length > 1 ? 's' : ''}`);
    }
    relationList.replaceChildren();
    const shown = snapshot.relations.filter(item => !focusNode || item.from === focusNode || item.to === focusNode);
    for (const relation of shown) {
      const link = document.createElement('a');
      link.href = `#preuve-${relation.id}`;
      link.dataset.atlasRelation = relation.id;
      link.classList.toggle('is-selected', relation.id === selected.id);
      if (relation.id === selected.id) link.setAttribute('aria-current', 'true');
      const name = document.createElement('span'), label = document.createElement('small');
      name.textContent = `${nodeLabel(relation.from)} → ${nodeLabel(relation.to)}`;
      label.textContent = relation.observation.label;
      link.append(name, label); relationList.append(link);
    }
    if (focusedRelation) relationList.querySelector<HTMLAnchorElement>(`[data-atlas-relation="${focusedRelation}"]`)?.focus({ preventScroll: true });
    put('[data-atlas-filter]', focusNode ? `Relations de ${nodeLabel(focusNode)}` : 'Toutes les relations à cette date');
    find('[data-atlas-reset]').hidden = !focusNode;
    put('[data-proof-kind]', kindLabels[selected.observation.kind]);
    put('[data-proof-title]', `${nodeLabel(selected.from)} → ${nodeLabel(selected.to)}`);
    put('[data-proof-date]', `Publication du ${formatAtlasDate(selected.observation.publishedOn)} · revue le ${formatAtlasDate(selected.observation.recordedOn)}`);
    for (const field of ['claim', 'limit', 'watch'] as const) put(`[data-proof-${field}]`, selected.observation[field]);
    put('[data-proof-amount]', selected.observation.amount?.label ?? '');
    find('[data-proof-amount]').hidden = !selected.observation.amount;
    const reading = find('[data-atlas-reading]');
    reading.hidden = !selected.reading;
    const readingLink = reading.querySelector('a')!;
    readingLink.textContent = selected.reading?.label ?? '';
    if (selected.reading) readingLink.setAttribute('href', selected.reading.href);
    else readingLink.removeAttribute('href');
    const scenario = root.querySelector<HTMLElement>('[data-atlas-scenario]');
    if (scenario) {
      scenario.hidden = !scenarioIds.has(selected.id);
      find('[data-scenario-toggle]').setAttribute('aria-pressed', String(state.scenario));
      put('[data-scenario-toggle]', state.scenario ? 'Fermer le scénario de défaut' : 'Explorer un défaut du locataire');
      find('[data-scenario-text]').hidden = !state.scenario;
    }
    const sources = find('[data-proof-sources]'); sources.replaceChildren();
    for (const id of selected.observation.sources) {
      const source = snapshot.sources.find(item => item.id === id)!;
      const li = document.createElement('li'), a = document.createElement('a'), locator = document.createElement('p');
      a.href = atlasSourceUrl(source.url); a.target = '_blank'; a.rel = 'noopener noreferrer'; a.textContent = `${source.title} ↗`;
      locator.textContent = source.locator; li.append(a, locator); sources.append(li);
    }
    put('[data-copy-status]', '');
    if (updateLocation) {
      const hash = new URLSearchParams({ date: state.date, relation: state.relation });
      if (state.scenario) hash.set('scenario', 'default');
      try { history.replaceState(null, '', `#${hash}`); } catch { /* Navigation remains optional. */ }
    }
    draw();
  }

  root.querySelectorAll<HTMLElement>('[data-atlas-controls]').forEach(element => { element.hidden = false; });
  root.addEventListener('click', async event => {
    if (!(event.target instanceof Element)) return;
    const target = event.target.closest<HTMLElement>('button,a');
    if (!target || !root.contains(target)) return;
    if (target.dataset.atlasDate) {
      state.date = target.dataset.atlasDate; focusNode = ''; state.scenario = false; render();
    } else if (target.dataset.atlasNode) {
      event.preventDefault(); focusNode = focusNode === target.dataset.atlasNode ? '' : target.dataset.atlasNode;
      if (focusNode) state.relation = atlasAt(dataset, state.date).relations.find(item => item.from === focusNode || item.to === focusNode)!.id;
      state.scenario = false; render();
      if (matchMedia('(max-width:760px)').matches) find('[data-atlas-relation-list]').scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth' });
    } else if (target.dataset.atlasRelation) {
      event.preventDefault(); state.relation = target.dataset.atlasRelation; state.scenario = false; render();
      if (matchMedia('(max-width:760px)').matches) find('[data-atlas-proof]').scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth' });
    } else if (target.hasAttribute('data-atlas-reset')) { focusNode = ''; render();
    } else if (target.hasAttribute('data-scenario-toggle')) { state.scenario = !state.scenario; render();
    } else if (target.dataset.atlasEntry) {
      focusNode = '';
      const params = new URLSearchParams({
        date: target.dataset.entryDate ?? '',
        relation: target.dataset.atlasEntry,
        scenario: target.dataset.entryScenario ?? '',
      });
      state = atlasSelection(dataset, `#${params}`, preferredRelation);
      render(); find('[data-atlas-map]').scrollIntoView({ block: 'center', behavior: matchMedia('(prefers-reduced-motion:reduce)').matches ? 'instant' : 'smooth' });
    } else if (target.hasAttribute('data-atlas-copy')) {
      try { await navigator.clipboard.writeText(location.href); put('[data-copy-status]', 'Lien copié.'); }
      catch { put('[data-copy-status]', `Copiez l’adresse de cette page : ${location.href}`); }
    }
  });
  window.addEventListener('hashchange', () => {
    if (!location.hash.startsWith('#date=')) return;
    state = atlasSelection(dataset, location.hash, preferredRelation); focusNode = ''; render(false);
  });
  new ResizeObserver(draw).observe(map);
  new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  void document.fonts.ready.then(draw);
  render(false);
}

document.querySelectorAll<HTMLElement>('[data-engagement-atlas]').forEach(initAtlas);
