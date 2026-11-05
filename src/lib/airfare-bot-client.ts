import {
  AIRFARE_DEFAULTS,
  calculateAirfareScenario,
  airfareTimeline,
} from './airfare-bot-model.ts';

const FIELDS = ['requestsPerIntention', 'filterPct', 'heldSeats', 'sensitivityPct', 'step'] as const;
const MODES = ['observe', 'signal', 'filtered', 'inventory'] as const;
const VALUES = [
  ...FIELDS, 'rawRequests', 'signalRequests', 'filteredRequests', 'queryConversionPct',
  'probability', 'expectedFutureRevenue', 'price', 'extraPrice', 'availableSeats',
  'cheapAvailable', 'heldNow', 'decision',
] as const;

const COPY = {
  fr: {
    play: 'Lancer le scénario', pause: 'Pause', resume: 'Reprendre', replay: 'Rejouer',
    invalid: 'Scénario indisponible : les paramètres doivent rester dans les limites indiquées.',
    open: 'Offre à 180 € ouverte',
    closed: 'Offre à 180 € fermée',
    inventory: 'Tarif de 180 € indisponible',
    inventoryOpen: 'Tarif de 180 € disponible',
    expired: 'Retenues expirées : tarif de 180 € disponible',
    changed: 'Scénario recalculé avec les paramètres affichés.',
    complete: 'Scénario terminé. Les prix affichés sont simulés.',
    reduced: 'Scénario affiché à son terme, sans animation selon votre préférence de mouvement.',
    paused: 'Lecture en pause.',
    chart: (price: string, step: number) => `Offre accessible simulée : ${price}, à l’étape ${step} sur 60. Référence constante : 180 euros.`,
  },
  en: {
    play: 'Run scenario', pause: 'Pause', resume: 'Resume', replay: 'Replay',
    invalid: 'Scenario unavailable: parameters must stay within the displayed limits.',
    open: '€180 offer open',
    closed: '€180 offer closed',
    inventory: '€180 fare unavailable',
    inventoryOpen: '€180 fare available',
    expired: 'Holds expired: €180 fare available',
    changed: 'Scenario recalculated using the displayed parameters.',
    complete: 'Scenario complete. Displayed prices are simulated.',
    reduced: 'The final scenario is shown without animation, following your motion preference.',
    paused: 'Playback paused.',
    chart: (price: string, step: number) => `Simulated available offer: ${price}, at step ${step} of 60. Constant reference: 180 euros.`,
  },
};

/** Enhancement is entirely local. Neither URLs nor persisted state are read. */
export function bindAirfareLabs(scope: ParentNode = document) {
  for (const root of scope.querySelectorAll<HTMLElement>('[data-airfare-lab]')) {
    if (root.dataset.ready === 'true') continue;
    const fieldset = root.querySelector<HTMLFieldSetElement>('fieldset[data-controls]');
    if (!fieldset) continue;
    fieldset.disabled = true;

    const fields = Object.fromEntries(FIELDS.map(key => [key,
      root.querySelector<HTMLInputElement>(`[data-field="${key}"]`),
    ])) as Record<typeof FIELDS[number], HTMLInputElement | null>;
    const outputs = Object.fromEntries(VALUES.map(key => [key,
      [...root.querySelectorAll<HTMLElement>(`[data-value="${key}"]`)],
    ])) as Record<typeof VALUES[number], HTMLElement[]>;
    const presets = [...root.querySelectorAll<HTMLButtonElement>('[data-mode]')];
    const play = root.querySelector<HTMLButtonElement>('[data-play]');
    const reset = root.querySelector<HTMLButtonElement>('[data-reset]');
    const status = root.querySelector<HTMLElement>('[data-status]');
    const error = root.querySelector<HTMLElement>('[data-error]');
    const result = root.querySelector<HTMLElement>('[data-result]');
    const signalControls = [...root.querySelectorAll<HTMLElement>('[data-signal-controls]')];
    const holdControls = root.querySelector<HTMLElement>('[data-hold-controls]');
    const forecast = root.querySelector<HTMLElement>('[data-forecast]');
    const inventory = root.querySelector<HTMLElement>('[data-inventory]');
    const seats = [...root.querySelectorAll<HTMLElement>('[data-seat]')];
    const filterBar = root.querySelector<HTMLElement>('[data-filter-bar]');
    const probabilityBar = root.querySelector<HTMLElement>('[data-probability-bar]');
    const priceLine = root.querySelector<SVGPolylineElement>('[data-price-line]');
    const cursor = root.querySelector<SVGLineElement>('[data-cursor]');
    const marker = root.querySelector<SVGCircleElement>('[data-price-marker]');
    const priceArea = root.querySelector<SVGPathElement>('[data-price-area]');
    const chartSummary = root.querySelector<SVGDescElement>('[data-chart-summary]');
    const chart = root.querySelector<SVGSVGElement>('[data-price-chart]');

    // An incomplete template stays static and disabled rather than partly interactive.
    if (Object.values(fields).some(value => !value) || Object.values(outputs).some(value => !value.length)
      || (root.dataset.lang !== 'fr' && root.dataset.lang !== 'en')
      || presets.length !== MODES.length || MODES.some(mode => presets.filter(button => button.dataset.mode === mode).length !== 1)
      || !play || !reset || !status || !error || !result || !signalControls.length || !holdControls
      || !forecast || !inventory || seats.length !== 24 || !filterBar || !probabilityBar
      || !priceLine || !cursor || !marker || !priceArea || !chartSummary || !chart) continue;

    const validFields = fields as Record<typeof FIELDS[number], HTMLInputElement>;
    const lang = root.dataset.lang === 'en' ? 'en' : 'fr';
    const copy = COPY[lang];
    const nf = new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { maximumFractionDigits: 2 });
    const precise = new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { maximumFractionDigits: 6 });
    const conversion = new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', { maximumFractionDigits: 4 });
    const money = (value: number) => lang === 'fr' ? `${nf.format(value)} €` : `€${nf.format(value)}`;
    const percent = (value: number) => `${nf.format(value)}${lang === 'fr' ? ' ' : ''}%`;
    const suffix = lang === 'fr' ? ' %' : '%';
    const thresholdProbability = (value: number) => Math.abs(value - 0.6) < 0.0001
      ? `${precise.format(value * 100)}${suffix}` : percent(value * 100);
    const thresholdRevenue = (value: number) => Math.abs(value - 180) < 0.1
      ? lang === 'fr' ? `${precise.format(value)} €` : `€${precise.format(value)}` : money(value);
    let state = { ...AIRFARE_DEFAULTS };
    let playing = false;
    let animation = 0;
    let startTime = 0;
    let startStep = 0;
    let chartWidth = 640;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const put = (key: typeof VALUES[number], text: string) => {
      for (const output of outputs[key]) output.textContent = text;
    };
    const playLabel = () => {
      play.textContent = playing ? copy.pause : state.step === 60 ? copy.replay : state.step === 0 ? copy.play : copy.resume;
      play.setAttribute('aria-pressed', String(playing));
    };
    const stop = () => {
      playing = false;
      window.cancelAnimationFrame(animation);
      root.dataset.playing = 'false';
      playLabel();
    };
    const fail = () => {
      stop();
      error.hidden = false;
      error.textContent = copy.invalid;
      result.hidden = true;
      status.textContent = copy.invalid;
    };
    const syncFields = () => {
      for (const key of FIELDS) validFields[key].value = String(state[key]);
    };
    const render = (drawTimeline = true) => {
      const data = calculateAirfareScenario(state);
      result.hidden = false;
      error.hidden = true;
      root.dataset.activeMode = state.mode;
      for (const control of signalControls) control.hidden = state.mode !== 'signal';
      holdControls.hidden = state.mode !== 'inventory';
      forecast.hidden = state.mode === 'inventory';
      inventory.hidden = state.mode !== 'inventory';
      for (const button of presets) {
        const active = button.dataset.mode === 'filtered' ? state.mode === 'signal' && state.filterPct === 100
          : button.dataset.mode === 'signal' ? state.mode === 'signal' && state.filterPct < 100
            : button.dataset.mode === state.mode;
        button.setAttribute('aria-pressed', String(active));
      }
      for (const key of FIELDS) put(key,
        key === 'filterPct' || key === 'sensitivityPct' ? percent(state[key]) : nf.format(state[key]));
      for (const key of ['rawRequests', 'signalRequests', 'filteredRequests', 'availableSeats', 'cheapAvailable', 'heldNow'] as const) {
        put(key, nf.format(data[key]));
      }
      put('queryConversionPct', `${conversion.format(data.queryConversionPct)}${suffix}`);
      put('probability', thresholdProbability(data.probability));
      put('expectedFutureRevenue', thresholdRevenue(data.expectedFutureRevenue));
      put('price', money(data.price));
      put('extraPrice', `${data.extraPrice > 0 ? '+' : ''}${money(data.extraPrice)}`);
      put('decision', state.mode === 'inventory' && state.step >= 50 && state.heldSeats > 0 ? copy.expired
        : state.mode === 'inventory' ? data.price > data.baselinePrice ? copy.inventory : copy.inventoryOpen
          : data.price > data.baselinePrice ? copy.closed : copy.open);
      seats.forEach((seat, index) => { seat.dataset.state = index < data.heldNow ? 'held' : index < 8 ? 'cheap' : 'free'; });
      const particles = [...root.querySelectorAll<HTMLElement>('.airfare-lab__lane--bots i')];
      const activeParticles = Math.ceil(particles.length * (data.intensity - 10) / 990);
      particles.forEach((particle, index) => { particle.hidden = index >= activeParticles; });
      filterBar.style.width = `${state.mode === 'signal' ? state.filterPct : 0}%`;
      probabilityBar.style.width = `${data.probability * 100}%`;
      const measured = chart.getBoundingClientRect().width;
      const widthChanged = measured > 72 && Math.round(measured * 10) / 10 !== chartWidth;
      chartWidth = measured > 72 ? Math.round(measured * 10) / 10 : chartWidth;
      const right = chartWidth - 16;
      const chartX = (step: number) => 56 + step / 60 * (right - 56);
      chart.setAttribute('viewBox', `0 0 ${chartWidth} 220`);
      for (const line of chart.querySelectorAll<SVGLineElement>('.airfare-lab__grid, .airfare-lab__baseline')) {
        line.setAttribute('x2', String(right));
      }
      for (const tick of chart.querySelectorAll<SVGTextElement>('[data-chart-tick]')) {
        const step = Number(tick.dataset.chartTick);
        if ([0, 20, 40, 60].includes(step)) tick.setAttribute('x', String(chartX(step)));
      }
      chart.querySelector('[data-chart-x-axis]')?.setAttribute('x', String((56 + right) / 2));
      const x = chartX(state.step);
      const y = data.price === 180 ? 142 : 42;
      cursor.setAttribute('x1', String(x));
      cursor.setAttribute('x2', String(x));
      marker.setAttribute('cx', String(x));
      marker.setAttribute('cy', String(y));
      if (drawTimeline || widthChanged) {
        const timeline = airfareTimeline(state);
        const points = timeline.map(point => [chartX(point.step), point.price === 180 ? 142 : 42]);
        priceLine.setAttribute('points', points.map(point => point.join(',')).join(' '));
        priceArea.setAttribute('d', `M56,142 ${points.map(point => `L${point[0]},${point[1]}`).join(' ')} L${right},142 Z`);
      }
      chartSummary.textContent = copy.chart(money(data.price), state.step);
      playLabel();
    };
    const read = () => {
      const updated = { ...state };
      for (const key of FIELDS) {
        const raw = validFields[key].value;
        // No whitespace, exponential notation, truncation or implicit empty-to-zero fallback.
        if (!/^(?:0|[1-9]\d{0,3})$/.test(raw)) throw new RangeError('Invalid integer');
        updated[key] = Number(raw);
      }
      calculateAirfareScenario(updated);
      state = updated;
    };
    for (const input of Object.values(validFields)) {
      input.addEventListener('input', () => {
        stop();
        try { read(); render(input !== validFields.step); }
        catch { fail(); }
      });
      input.addEventListener('change', () => {
        if (error.hidden) status.textContent = copy.changed;
      });
    }
    for (const button of presets) {
      button.addEventListener('click', () => {
        stop();
        const mode = button.dataset.mode;
        if (!MODES.some(value => value === mode)) { fail(); return; }
        state = { ...state, mode: mode === 'filtered' ? 'signal' : mode as typeof state.mode,
          filterPct: mode === 'filtered' ? 100 : 0, step: mode === 'inventory' ? 35 : 60 };
        syncFields();
        try { render(); status.textContent = copy.changed; }
        catch { fail(); }
      });
    }
    reset.addEventListener('click', () => {
      stop();
      state = { ...AIRFARE_DEFAULTS };
      syncFields();
      try { render(); status.textContent = copy.changed; }
      catch { fail(); }
    });
    const tick = (time: number) => {
      if (!playing) return;
      if (!startTime) startTime = time;
      const step = Math.min(60, startStep + Math.floor((time - startTime) / 200));
      if (step !== state.step) {
        state = { ...state, step };
        validFields.step.value = String(step);
        try { render(false); }
        catch { fail(); return; }
      }
      if (step >= 60) {
        stop();
        status.textContent = copy.complete;
      } else animation = window.requestAnimationFrame(tick);
    };
    play.addEventListener('click', () => {
      if (playing) { stop(); status.textContent = copy.paused; return; }
      try { read(); }
      catch { fail(); return; }
      if (reducedMotion.matches) {
        state = { ...state, step: 60 };
        syncFields();
        render();
        status.textContent = copy.reduced;
        return;
      }
      if (state.step === 60) state = { ...state, step: 0 };
      syncFields();
      render();
      startStep = state.step;
      startTime = 0;
      playing = true;
      root.dataset.playing = 'true';
      playLabel();
      animation = window.requestAnimationFrame(tick);
    });
    const pause = () => { if (playing) { stop(); status.textContent = copy.paused; } };
    const lifecycle = new AbortController();
    const options = { signal: lifecycle.signal };
    document.addEventListener('visibilitychange', () => { if (document.hidden) pause(); }, options);
    window.addEventListener('pagehide', pause, options);
    reducedMotion.addEventListener('change', pause, options);
    const resize = new ResizeObserver(() => {
      const width = Math.round(chart.getBoundingClientRect().width * 10) / 10;
      if (width > 72 && width !== chartWidth && error.hidden) {
        try { render(); }
        catch { fail(); }
      }
    });
    resize.observe(chart);
    document.addEventListener('astro:before-swap', () => {
      pause();
      resize.disconnect();
      lifecycle.abort();
    }, { once: true, signal: lifecycle.signal });
    const form = root.querySelector('form');
    form?.addEventListener('submit', event => event.preventDefault());
    syncFields();
    try {
      render();
      root.dataset.ready = 'true';
      root.dataset.playing = 'false';
      fieldset.disabled = false;
    } catch { fail(); }
  }
}

bindAirfareLabs();
document.addEventListener('astro:page-load', () => bindAirfareLabs());
