import { AIRFARE_DEFAULTS, calculateAirfareScenario, nextAirfareStage } from './airfare-bot-model.ts';
import { airfareStoryCopy } from './airfare-bot-copy.ts';

export function bindAirfareLabs(scope: ParentNode = document) {
  for (const root of scope.querySelectorAll<HTMLElement>('[data-airfare-lab]')) {
    if (root.dataset.ready === 'true') continue;
    const button = root.querySelector<HTMLButtonElement>('[data-next]');
    const result = root.querySelector<HTMLElement>('[data-result]');
    const error = root.querySelector<HTMLElement>('[data-error]');
    const requests = root.querySelector<HTMLElement>('[data-requests]');
    const group = root.querySelector<HTMLElement>('[data-group]');
    const bot = root.querySelector<HTMLElement>('[data-bot-speech]');
    const caption = root.querySelector<HTMLElement>('[data-request-caption]');
    const seller = root.querySelector<HTMLElement>('[data-seller-speech]');
    const signal = root.querySelector<HTMLElement>('[data-signal]');
    const low = root.querySelector<HTMLElement>('[data-low-status]');
    const high = root.querySelector<HTMLElement>('[data-high-status]');
    const price = root.querySelector<HTMLElement>('[data-price]');
    const difference = root.querySelector<HTMLElement>('[data-difference]');
    const explanation = root.querySelector<HTMLElement>('[data-explanation]');
    const step = root.querySelector<HTMLElement>('[data-step]');
    const dots = [...root.querySelectorAll<HTMLElement>('[data-dot]')];
    if (!button || !result || !error || !requests || !group || !bot || !caption || !seller
      || !signal || !low || !high || !price || !difference || !explanation || !step
      || dots.length !== 100 || (root.dataset.lang !== 'fr' && root.dataset.lang !== 'en')) continue;

    const copy = airfareStoryCopy(root.dataset.lang);
    let state = { ...AIRFARE_DEFAULTS };
    let frame = 0;
    let animating = false;
    const lifecycle = new AbortController();
    const showRequests = (count: number) => {
      requests.textContent = String(count);
      dots.forEach((dot, index) => { dot.hidden = index >= count; });
    };
    const render = () => {
      const data = calculateAirfareScenario(state);
      const scene = copy.scenes[data.stage];
      root.dataset.stage = String(data.stage);
      showRequests(data.requests);
      group.hidden = !data.recognized;
      bot.textContent = scene.bot;
      caption.textContent = scene.caption;
      seller.textContent = scene.seller;
      signal.textContent = scene.signal;
      low.textContent = scene.low;
      high.textContent = scene.high;
      price.textContent = scene.price;
      difference.textContent = scene.difference;
      explanation.textContent = scene.explanation;
      step.textContent = `${data.stage + 1} / 3`;
      button.textContent = scene.button;
      button.disabled = false;
      result.hidden = false;
      error.hidden = true;
    };
    const fail = () => {
      cancelAnimationFrame(frame);
      animating = false;
      button.disabled = true;
      result.hidden = true;
      explanation.textContent = '';
      error.textContent = copy.error;
      error.hidden = false;
    };
    const finish = () => {
      cancelAnimationFrame(frame);
      if (!animating) return;
      animating = false;
      try {
        state = nextAirfareStage(state);
        render();
      } catch { fail(); }
    };
    button.addEventListener('click', () => {
      if (animating) return;
      try {
        if (state.stage !== 0 || matchMedia('(prefers-reduced-motion: reduce)').matches) {
          state = nextAirfareStage(state);
          render();
          return;
        }
        animating = true;
        button.disabled = true;
        button.textContent = copy.loading;
        bot.textContent = copy.loadingBot;
        caption.textContent = copy.loadingCaption;
        explanation.textContent = copy.loadingExplanation;
        const started = performance.now();
        const animate = (now: number) => {
          if (!animating) return;
          const progress = Math.min(1, Math.max(0, (now - started) / 2200));
          showRequests(1 + Math.floor(progress * 99));
          if (progress >= 1) finish();
          else frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
      } catch { fail(); }
    }, { signal: lifecycle.signal });
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) finish();
    }, { signal: lifecycle.signal });
    window.addEventListener('pagehide', finish, { signal: lifecycle.signal });
    document.addEventListener('astro:before-swap', () => {
      finish();
      lifecycle.abort();
    }, { once: true, signal: lifecycle.signal });
    try {
      render();
      root.dataset.ready = 'true';
    } catch { fail(); }
  }
}

bindAirfareLabs();
document.addEventListener('astro:page-load', () => bindAirfareLabs());
