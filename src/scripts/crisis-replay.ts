import { getReplayEpisode, replayEpisodes, type ReplayEpisodeId } from '../data/crisis-episodes';
import { parseReplayHash, replayHash, replayMapState } from '../lib/crisis-replay';
import { networkMapState } from '../data/crisis-networks';

for (const root of document.querySelectorAll<HTMLElement>('[data-crisis-replay]')) {
  const fr = root.dataset.language !== 'en';
  const candidate=root.dataset.episode??'';
  const episodeId: ReplayEpisodeId = Object.hasOwn(replayEpisodes,candidate) ? candidate as ReplayEpisodeId : 'gilts';
  const replayChapters = getReplayEpisode(episodeId).chapters;
  const t = (f: string, e: string) => fr ? f : e;
  const find = <T extends HTMLElement>(selector: string) => {
    const element = root.querySelector<T>(selector);
    if (!element) throw new Error(`Replay element missing: ${selector}`);
    return element;
  };
  const cards = [...root.querySelectorAll<HTMLElement>('[data-replay-chapter]')];
  const steps = [...root.querySelectorAll<HTMLAnchorElement>('[data-replay-step]')];
  const range = find<HTMLInputElement>('[data-replay-range]');
  const play = find<HTMLButtonElement>('[data-replay-play]');
  const previous = find<HTMLButtonElement>('[data-replay-prev]');
  const next = find<HTMLButtonElement>('[data-replay-next]');
  const status = find<HTMLElement>('[data-replay-status]');
  const perspective = find<HTMLElement>('[data-map-perspective]');
  let { index, mode } = parseReplayHash(location.hash, episodeId);
  const episodeNav=root.querySelector<HTMLElement>('.replay-episodes');
  const currentEpisode=episodeNav?.querySelector<HTMLElement>('[aria-current="page"]');
  if (episodeNav&&currentEpisode) episodeNav.scrollLeft+=currentEpisode.getBoundingClientRect().left-episodeNav.getBoundingClientRect().left;
  let timer: ReturnType<typeof setInterval> | undefined;

  function stop() {
    if (timer !== undefined) clearInterval(timer);
    timer = undefined;
    root.dataset.playing = 'false';
    find('[data-play-icon]').textContent = '▶';
    find('[data-play-label]').textContent = t('Lire', 'Play');
    play.setAttribute('aria-label', t('Lancer la lecture automatique', 'Start automatic playback'));
  }
  function render(updateUrl = false) {
    find('[data-replay-share-status]').textContent = '';
    const chapter = replayChapters[index];
    const state = replayMapState(index, mode, episodeId);
    root.dataset.ltcmModel=String(state.ltcmModel);
    root.dataset.ltcmCapital=String(state.ltcmCapital);
    root.dataset.ltcmCoordination=String(state.ltcmCoordination);
    root.dataset.loop = String(state.loop);
    root.dataset.purchases = String(state.purchases);
    root.dataset.repo = String(state.repo);
    root.dataset.resolution = String(state.resolution);
    root.dataset.protection = String(state.protection);
    root.dataset.funding = String(state.funding);
    root.dataset.terraHalted = String(state.halt);
    root.dataset.aigLending = String(state.aigLending);
    root.dataset.aigCds = String(state.aigCds);
    root.dataset.aigMl2 = String(state.aigMl2);
    root.dataset.aigMl3 = String(state.aigMl3);
    root.dataset.aigLendingRetro = String(state.aigLendingRetro);
    root.dataset.aigCdsRetro = String(state.aigCdsRetro);
    root.dataset.mapRetrospective = String(state.retrospective);
    root.style.setProperty('--replay-highlight', state.retrospective ? 'var(--color-amber)' : 'var(--color-accent)');
    for (const [i, card] of cards.entries()) card.hidden = i !== index;
    for (const [i, step] of steps.entries()) {
      if (i === index) step.setAttribute('aria-current', 'step');
      else step.removeAttribute('aria-current');
      step.dataset.visited = String(i <= index);
    }
    root.querySelectorAll<HTMLButtonElement>('[data-replay-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.replayMode === mode)));
    root.querySelectorAll<HTMLElement>('[data-replay-hindsight]').forEach(note => note.hidden = mode !== 'hindsight');
    const wires: Record<string, boolean> = { loop:state.loop, withdrawals:state.loop, purchases:state.purchases, repo:state.repo,
      securities:state.securities, resolution:state.resolution, protection:state.protection, funding:state.funding,
      anchor:state.loop, support:state.support, conversion:state.conversion, issuance:state.loop, sales:state.loop, feedback:state.loop,
      'ltcm-model':state.ltcmModel,'ltcm-funding':state.ltcmFunding,'ltcm-risk':state.ltcmRisk,'ltcm-capital':state.ltcmCapital,'ltcm-coordination':state.ltcmCoordination,
      'aig-credit':state.aigCredit, 'aig-lending':state.aigLending, 'aig-cds':state.aigCds,
      'aig-ml2-funding':state.aigMl2, 'aig-ml3-funding':state.aigMl3, 'aig-ml2-purchase':state.aigMl2, 'aig-ml3-purchase':state.aigMl3 };
    root.querySelectorAll<SVGPathElement>('[data-wire]').forEach(path => { path.dataset.active = String(wires[path.dataset.wire ?? ''] ?? false); });
    root.querySelectorAll<SVGTextElement>('[data-loop-label]').forEach(label => label.style.opacity = state.loop ? '1' : '.35');
    root.querySelectorAll<SVGTextElement>('[data-purchase-label]').forEach(label => label.style.opacity = state.purchases ? '1' : '.35');
    root.querySelectorAll<SVGTextElement>('[data-repo-label]').forEach(label => label.style.opacity = state.repo ? '1' : '.35');
    perspective.textContent = state.retrospective
      ? t('Boucle LDI reconstituée avec l’analyse de décembre 2022. Relations en pointillés ambre.', 'LDI loop reconstructed from December 2022 analysis. Relationships shown in dashed amber.')
      : state.exit
        ? t('La fenêtre d’achats est fermée. La boucle reste visible comme mécanisme documenté de la crise.', 'The purchase window is closed. The loop remains as a documented mechanism of the crisis.')
        : state.loop
          ? t('Le mécanisme LDI est décrit dans la lettre publiée le 6 octobre.', 'The LDI mechanism is described in the letter published on 6 October.')
          : state.purchases
            ? t('Achats annoncés. La carte LDI est accessible dans la lecture rétrospective.', 'Purchases announced. The LDI map is available in the hindsight view.')
            : t('Le cadre du marché. La boucle LDI reste un repère, détaillé dans les publications ultérieures.', 'Market structure. The LDI loop is structural context, detailed in later publications.');
    if (episodeId === 'svb') perspective.textContent = state.retrospective
      ? t('Retraits reconstitués avec le rapport de la Fed du 28 avril 2023. Liaisons en ambre.', 'Withdrawals reconstructed using the Fed’s 28 April 2023 review. Relationships shown in amber.')
      : state.loop ? t('Le bank run du 9 mars est documenté dans le rapport publié le 28 avril.', 'The 9 March bank run is documented in the review published on 28 April.')
      : state.funding ? t('FDIC : résolution de SVB. BTFP : prêts aux établissements éligibles du système bancaire.', 'FDIC: SVB resolution. BTFP: lending to eligible institutions across the banking system.')
      : state.resolution ? t('La FDIC prend en charge la résolution de la banque fermée.', 'The FDIC takes charge of the closed bank’s resolution.')
      : t('La vente des titres est annoncée. Le bank run est expliqué dans la lecture rétrospective.', 'The securities sale is announced. The bank run is explained in the hindsight view.');
    if (episodeId === 'terra') perspective.textContent = state.retrospective
      ? t('La boucle est éclairée par l’analyse de la BRI du 21 juin. Le bilan LFG devient public le 16 mai.', 'The loop draws on the BIS’s 21 June analysis. LFG’s account becomes public on 16 May.')
      : state.halt ? t('Arrêt annoncé au bloc 7 603 700. Le circuit reste visible comme mécanisme historique.', 'Halt announced at block 7,603,700. The circuit remains visible as a historical mechanism.')
      : state.exit ? t('Les projets de relance suivent la rupture de parité. La boucle décrit le système en crise.', 'Revival proposals follow the peg failure. The loop depicts the system during the crisis.')
      : chapter.id === 'bilan-reserves' ? t('Les opérations passées sont rapportées par LFG le 16 mai. Les réserves soutiennent l’UST, hors conversion.', 'LFG reports past operations on 16 May. Reserve support for UST is separate from conversion.')
      : chapter.id === 'diagnostic-bri' ? t('La BRI décrit les émissions de LUNA et une demande devenue insuffisante pour les absorber.', 'The BIS describes LUNA issuance and demand becoming insufficient to absorb it.')
      : state.loop ? t('Boucle décrite dans la proposition du 11 mai. Le soutien LFG est annoncé séparément.', 'Loop described in the 11 May proposal. LFG support is announced separately.')
      : t('Soutien LFG annoncé le 9 mai. La boucle détaillée apparaît dans les documents suivants.', 'LFG support announced on 9 May. The detailed loop appears in subsequent documents.');
    if (episodeId === 'aig') perspective.textContent = state.retrospective
      ? t('Les canaux en ambre sont ajoutés avec le témoignage de la Fed du 26 mai 2010.', 'Amber channels are added using the Fed’s 26 May 2010 testimony.')
      : chapter.id === 'rapport-sigtarp' ? t('Le rapport critique du SIGTARP examine les négociations et les garanties conservées par les contreparties.', 'SIGTARP’s critical audit examines negotiations and collateral retained by counterparties.')
      : chapter.id === 'temoignage-fed' ? t('La Fed présente son analyse rétrospective. Les portefeuilles restent alors en gestion.', 'The Fed presents its retrospective account. The portfolios remain under management at that point.')
      : chapter.id === 'maiden-lane-ii' ? t('Modalités publiées le 16 décembre : un achat de RMBS du 12 décembre est rapporté. La carte conserve les circuits historiques.', 'Terms published on 16 December report an RMBS purchase on 12 December. The map retains the historical channels.')
      : chapter.id === 'maiden-lane-iii' ? t('Les achats de CDO s’accompagnent de la résiliation des dérivés associés. La carte conserve les circuits historiques.', 'CDO purchases come with termination of the associated derivatives. The map retains the historical channels.')
      : state.aigMl2 ? t('Deux véhicules sont annoncés : RMBS vers Maiden Lane II, CDO vers Maiden Lane III.', 'Two vehicles are announced: RMBS to Maiden Lane II, CDOs to Maiden Lane III.')
      : state.aigLending ? t('Le communiqué du 8 octobre décrit le remboursement du cash du prêt de titres.', 'The 8 October release describes cash settlements under securities lending.')
      : t('Crédit d’urgence annoncé. Les deux circuits sont détaillés dans les documents suivants.', 'Emergency credit announced. The two channels are detailed in subsequent documents.');
    if (episodeId === 'ltcm') perspective.textContent=state.retrospective
      ? t('Mécanisme éclairé par les auditions du 1er octobre. Le capital du consortium apparaît à leur date dans ce corpus.', 'Mechanism informed by the 1 October hearings. Consortium capital appears at their date in this corpus.')
      : chapter.id==='choc-russe' ? t('Mesures russes annoncées le 17 août. Les liens avec LTCM sont documentés dans les auditions ultérieures.', 'Russian measures announced on 17 August. Links to LTCM are documented in later hearings.')
      : chapter.id==='conditions-financieres' ? t('Politique monétaire générale. Le financement du consortium est présenté dans le récit du 1er octobre.', 'Economy-wide monetary policy. Consortium funding is presented in the 1 October account.')
      : chapter.id==='rapport-gao' ? t('Rapport daté du 29 octobre 1999, rendu public le 19 novembre. Les circuits restent des repères historiques.', 'Report dated 29 October 1999, publicly released on 19 November. The channels remain historical context.')
      : chapter.id==='rapport-pwg' ? t('Le rapport commun examine le levier et la gestion des contreparties après la recapitalisation.', 'The joint report examines leverage and counterparty management after the recapitalisation.')
      : chapter.id==='illusion-liquidite' ? t('Fisher décrit les tensions de plusieurs marchés. La branche des ventes reste le scénario de défaut invoqué dans les auditions.', 'Fisher discusses strains across markets. The sales branch remains the default scenario invoked in the hearings.')
      : t('Capital apporté par le consortium. Liaison pointillée : médiation de la Fed. Ventes forcées : scénario de défaut.', 'Capital supplied by the consortium. Dotted link: Fed facilitation. Forced sales: a default scenario.');
    const network=networkMapState(episodeId,chapter.date,mode);
    if (network) {
      for (const link of network.links) {
        root.querySelectorAll<SVGPathElement>(`[data-wire="${link.id}"]`).forEach(path=>{path.dataset.active=String(link.active);path.dataset.retrospective=String(link.retrospective);});
        root.querySelectorAll<SVGTextElement>(`[data-network-label="${link.id}"]`).forEach(label=>label.dataset.active=String(link.active));
      }
      root.dataset.networkSuspended=String(network.suspended);
      root.dataset.networkFloor=String(network.floor);
      perspective.textContent=network.note[fr?'fr':'en']+(network.retrospective?t(' Les relations ambre s’appuient sur les sources ultérieures citées.',' Amber relationships draw on the cited later sources.'):'');
      root.querySelectorAll<SVGTextElement>('[data-network-status]').forEach(label=>{
        label.textContent=episodeId==='chf'?(network.floor?t('Plancher en vigueur','Minimum rate in force'):t('Plancher retiré','Minimum rate removed')):episodeId==='nickel'?(network.suspended?t('Échanges suspendus','Trading suspended'):t('Mécanisme historique','Historical mechanism')):episodeId==='asia'?t('Trois parcours nationaux','Three country paths'):t('Financement et garantie','Funding and guarantee');
      });
    }
    range.value = String(index);
    const date = new Intl.DateTimeFormat(fr ? 'fr-FR' : 'en-GB', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(`${chapter.date}T12:00:00Z`));
    range.setAttribute('aria-valuetext', `${date} · ${chapter.short[fr ? 'fr' : 'en']}`);
    previous.disabled = index === 0;
    next.disabled = index === replayChapters.length - 1;
    if (updateUrl) {
      try { history.replaceState(null, '', replayHash(index, mode, episodeId)); } catch { /* Reading remains available if history is restricted. */ }
    }
    status.textContent = `${index + 1} / ${replayChapters.length} · ${date} · ${chapter.title[fr ? 'fr' : 'en']}`;
    const current = steps[index];
    const timeline = current.parentElement!;
    // Scroll the timeline itself; never move the reader's page during playback.
    if (timeline.scrollWidth > timeline.clientWidth) timeline.scrollLeft = current.offsetLeft - timeline.offsetLeft - (timeline.clientWidth - current.offsetWidth) / 2;
  }
  function select(value: number) {
    if (!Number.isInteger(value) || value < 0 || value >= replayChapters.length) return;
    stop();
    index = value;
    render(true);
  }
  steps.forEach((step, i) => step.addEventListener('click', event => {
    // Preserve browser open-in-new-tab and copy-link gestures.
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    select(i);
  }));
  previous.addEventListener('click', () => select(index - 1));
  next.addEventListener('click', () => select(index + 1));
  range.addEventListener('input', () => select(Number(range.value)));
  find('[data-replay-restart]').addEventListener('click', () => select(0));
  root.querySelectorAll<HTMLButtonElement>('[data-replay-mode]').forEach(button => button.addEventListener('click', () => {
    stop();
    mode = button.dataset.replayMode === 'hindsight' ? 'hindsight' : 'announcements';
    render(true);
  }));
  play.addEventListener('click', () => {
    if (timer !== undefined) return stop();
    if (index === replayChapters.length - 1) { index = 0; render(true); }
    root.dataset.playing = 'true';
    find('[data-play-icon]').textContent = 'Ⅱ';
    find('[data-play-label]').textContent = 'Pause';
    play.setAttribute('aria-label', t('Mettre en pause la lecture', 'Pause playback'));
    timer = setInterval(() => {
      index += 1;
      render(true);
      if (index === replayChapters.length - 1) stop();
    }, 12_000);
  });
  root.querySelectorAll<HTMLButtonElement>('[data-replay-actor]').forEach(button => {
    button.disabled = false;
    button.addEventListener('click', () => {
      stop();
      const actor = button.dataset.replayActor;
      const selected = button.getAttribute('aria-pressed') !== 'true';
      root.querySelectorAll<HTMLButtonElement>('[data-replay-actor]').forEach(node => node.setAttribute('aria-pressed', String(node === button && selected)));
      root.querySelectorAll<HTMLElement>('[data-actor-description]').forEach(note => note.hidden = !selected || note.dataset.actorDescription !== actor);
      find('[data-actor-hint]').hidden = selected;
    });
  });
  find('[data-replay-share]').addEventListener('click', async () => {
    stop();
    const url = new URL(location.href);
    url.hash = replayHash(index, mode, episodeId);
    try {
      await navigator.clipboard.writeText(url.href);
      find('[data-replay-share-status]').textContent = t('Lien copié.', 'Link copied.');
    } catch {
      render(true);
      find('[data-replay-share-status]').textContent = t('Copie indisponible. Le lien est dans la barre d’adresse.', 'Copy unavailable. Use the address bar link.');
    }
  });
  window.addEventListener('hashchange', () => {
    if (!location.hash.startsWith('#etape=') && !location.hash.startsWith('#chapter-')) return;
    stop();
    const state = parseReplayHash(location.hash, episodeId);
    index = state.index;
    mode = state.mode;
    render();
  });
  // Safari pointer clicks need not focus a button: Escape must also work from the body.
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && timer !== undefined) stop(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  window.addEventListener('pagehide', stop);
  render();
  root.querySelectorAll<HTMLElement>('[data-replay-controls]').forEach(control => control.hidden = false);
  root.dataset.ready = 'true';
}
