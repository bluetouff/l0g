import { AIRFARE_DEFAULTS, AIRFARE_SEATS, applyAirfareAction, calculateAirfareScenario } from './airfare-bot-model.ts';
import type { AirfareAction, AirfareScenario } from './airfare-bot-model.ts';

export function bindAirfareLabs(scope: ParentNode = document) {
  for (const root of scope.querySelectorAll<HTMLElement>('[data-airfare-lab]')) {
    if (root.dataset.ready === 'true') continue;
    const controls = root.querySelector<HTMLFieldSetElement>('[data-controls]');
    const result = root.querySelector<HTMLElement>('[data-result]');
    const error = root.querySelector<HTMLElement>('[data-error]');
    const price = root.querySelector<HTMLElement>('[data-price]');
    const available = root.querySelector<HTMLElement>('[data-available]');
    const explanation = root.querySelector<HTMLElement>('[data-explanation]');
    const seatsSummary = root.querySelector<HTMLElement>('[data-seats-summary]');
    const seats = [...root.querySelectorAll<HTMLElement>('[data-seat]')];
    const buttons = [...root.querySelectorAll<HTMLButtonElement>('[data-action]')];
    if (!controls || !result || !error || !price || !available || !explanation || !seatsSummary
      || seats.length !== 12 || buttons.length !== 3
      || ['search', 'hold', 'release'].some(action => buttons.filter(button => button.dataset.action === action).length !== 1)
      || (root.dataset.lang !== 'fr' && root.dataset.lang !== 'en')) continue;
    const fr = root.dataset.lang === 'fr';
    const money = (value: number) => fr ? `${value} €` : `€${value}`;
    let state = { ...AIRFARE_DEFAULTS };
    let last = calculateAirfareScenario(state);
    const message = (data: AirfareScenario, action?: AirfareAction): string => {
      if (action === 'release') return fr ? 'Les bots libèrent les places. Le billet revient à 180 €.' : 'The bots release the seats. Tickets are available again from €180.';
      if (data.price === null) return fr ? 'Les 12 places sont temporairement bloquées. Aucun billet n’est disponible.' : 'All 12 seats are temporarily held. No ticket is available.';
      if (action === 'search') return fr ? `Les bots cherchent, sans retenir de place. Le prix reste à ${money(data.price)}.` : `The bots search without holding any seats. The price stays at ${money(data.price)}.`;
      if (action === 'hold' && data.price !== last.price) return fr ? `Les places à ${money(last.price!)} sont bloquées. Les suivantes coûtent ${money(data.price)}.` : `The ${money(last.price!)} seats are held. The next available tickets cost ${money(data.price)}.`;
      return fr ? `Il reste ${data.remainingAtPrice} places à ${money(data.price)}. Le prix ${action ? 'reste à' : 'de départ est'} ${money(data.price)}.` : `${data.remainingAtPrice} seats remain at ${money(data.price)}. The ${action ? 'price stays at' : 'starting price is'} ${money(data.price)}.`;
    };
    const render = (action?: AirfareAction) => {
      const data = calculateAirfareScenario(state);
      price.textContent = data.price === null ? (fr ? 'Indisponible' : 'Unavailable') : money(data.price);
      available.textContent = fr ? `${data.availableSeats} places disponibles` : `${data.availableSeats} seats available`;
      explanation.textContent = message(data, action);
      root.dataset.priceState = data.price === null ? 'unavailable' : data.price > 180 ? 'higher' : 'initial';
      seats.forEach((seat, index) => { seat.dataset.state = index < data.heldSeats ? 'held' : 'free'; });
      const summary = [180, 240, 300].map(fare => {
        const count = AIRFARE_SEATS.slice(data.heldSeats).filter(seat => seat.price === fare).length;
        return fr ? `${count} places à ${money(fare)}` : `${count} seats at ${money(fare)}`;
      }).join(', ');
      seatsSummary.setAttribute('aria-label', fr ? `${data.heldSeats} places bloquées ; ${summary}.` : `${data.heldSeats} held seats; ${summary}.`);
      buttons.forEach(button => { button.disabled = button.dataset.action === 'hold' ? data.heldSeats === 12 : button.dataset.action === 'release' && data.heldSeats === 0; });
      last = data;
      result.hidden = false;
      error.hidden = true;
    };
    buttons.forEach(button => button.addEventListener('click', () => {
      try {
        const action = button.dataset.action;
        state = applyAirfareAction(state, action);
        render(action as AirfareAction);
      } catch {
        result.hidden = true;
        error.hidden = false;
        error.textContent = fr ? 'L’exemple est indisponible. Rechargez la page pour recommencer.' : 'This example is unavailable. Reload the page to start again.';
        controls.disabled = true;
      }
    }));
    render();
    controls.disabled = false;
    root.dataset.ready = 'true';
  }
}

bindAirfareLabs();
document.addEventListener('astro:page-load', () => bindAirfareLabs());
