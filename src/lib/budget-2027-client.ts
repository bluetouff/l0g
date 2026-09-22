import { DEFAULTS, LIMITS, evaluate, parseNumber, type ModelInputs } from './budget-2027-model.mjs';

class L0gBudget2027 extends HTMLElement {
  connectedCallback() {
    if (this.dataset.ready === 'true') return;
    const fields = this.querySelector<HTMLFieldSetElement>('[data-fields]');
    const inputs = Array.from(this.querySelectorAll<HTMLInputElement>('input[data-param]'));
    const reset = this.querySelector<HTMLButtonElement>('[data-reset]');
    const error = this.querySelector<HTMLElement>('[data-error]');
    const results = this.querySelector<HTMLElement>('[data-results]');
    const status = this.querySelector<HTMLElement>('[data-status]');
    const tbody = this.querySelector<HTMLTableSectionElement>('[data-rows]');
    const keys = Object.keys(DEFAULTS) as (keyof ModelInputs)[];
    const isKey = (key: string | undefined): key is keyof ModelInputs => keys.some(k => k === key);
    if (!fields || !reset || !error || !results || !status || !tbody ||
        inputs.length !== keys.length || keys.some(key => inputs.filter(input => input.dataset.param === key).length !== 1)) return;
    const fr = this.dataset.lang !== 'en';
    const number = new Intl.NumberFormat(fr ? 'fr-FR' : 'en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const signed = new Intl.NumberFormat(fr ? 'fr-FR' : 'en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2, signDisplay: 'exceptZero' });
    const fmt = (value: number, sign = false) => (sign ? signed : number).format(Math.abs(value) < 1e-9 ? 0 : value);
    const outputKeys = ['gap', 'priceChange', 'interestGap', 'stabilising', 'priceBefore', 'priceAfter', 'shockedRate'] as const;
    const outputs = outputKeys.map(key => this.querySelector<HTMLElement>(`[data-output="${key}"]`));
    if (outputs.some(output => !output)) return;
    const update = () => {
      const raw: Partial<Record<keyof ModelInputs, string>> = Object.create(null);
      let invalid = false;
      for (const input of inputs) {
        const key = input.dataset.param;
        if (!isKey(key)) { invalid = true; continue; }
        raw[key] = input.value;
        try {
          const n = parseNumber(input.value);
          const [min, max] = LIMITS[key];
          const ok = n >= min && n <= max && (key !== 'maturity' || Number.isInteger(n));
          input.setAttribute('aria-invalid', String(!ok));
          if (!ok) invalid = true;
        } catch {
          input.setAttribute('aria-invalid', 'true');
          invalid = true;
        }
      }
      try {
        if (invalid) throw new RangeError('INPUT_FIELDS');
        const r = evaluate(raw);
        const values = [fmt(r.debtGap, true), fmt(r.priceChangePct, true) + ' %', fmt(r.interestGap, true),
          fmt(r.stabilisingDeficit) + ' %', fmt(r.priceBefore), fmt(r.priceAfter), fmt(r.shockedMarketRate) + ' %'];
        outputs.forEach((output, index) => { if (output) output.textContent = values[index]; });
        const fragment = document.createDocumentFragment();
        r.reference.forEach((base, k) => {
          const row = document.createElement('tr');
          [String(base.year), fmt(base.debt), fmt(r.stressed[k].debt), fmt(r.stressed[k].debt - base.debt, true)].forEach((value, index) => {
            const cell = document.createElement(index === 0 ? 'th' : 'td');
            if (index === 0) cell.scope = 'row';
            cell.textContent = value;
            row.append(cell);
          });
          fragment.append(row);
        });
        tbody.replaceChildren(fragment);
        results.hidden = false;
        error.hidden = true;
        error.textContent = '';
        status.textContent = fr
          ? `Calcul actualisé. Écart de dette en 2032 : ${fmt(r.debtGap, true)} points de PIB. Variation du prix : ${fmt(r.priceChangePct, true)} pour cent.`
          : `Calculation updated. Debt gap in 2032: ${fmt(r.debtGap, true)} GDP percentage points. Price change: ${fmt(r.priceChangePct, true)} per cent.`;
      } catch (e) {
        // Invalid inputs never leave a previous scenario visible.
        results.hidden = true;
        error.hidden = false;
        status.textContent = '';
        const combinedRateError = e instanceof RangeError && e.message === 'SHOCKED_RATE';
        if (combinedRateError) {
          for (const input of inputs) if (input.dataset.param === 'marketRate' || input.dataset.param === 'shock') input.setAttribute('aria-invalid', 'true');
        }
        error.textContent = combinedRateError
          ? (fr ? 'Le taux après choc doit rester entre 0 et 15 %. Corrigez le taux de marché ou le choc.' : 'The post-shock yield must be between 0 and 15%. Adjust the market yield or shock.')
          : (fr ? 'Saisissez des nombres dans les bornes indiquées. La maturité doit être entière. Les résultats restent masqués jusqu’à correction.' : 'Enter numbers within the displayed bounds. Maturity must be a whole number. Results remain hidden until the inputs are corrected.');
      }
    };
    this.addEventListener('input', event => {
      if (event.target instanceof HTMLInputElement && inputs.includes(event.target)) update();
    });
    reset.addEventListener('click', () => {
      for (const input of inputs) if (isKey(input.dataset.param)) input.value = String(DEFAULTS[input.dataset.param]);
      update();
    });
    update();
    fields.disabled = false;
    this.dataset.ready = 'true';
  }
}
if (!customElements.get('l0g-budget-2027')) customElements.define('l0g-budget-2027', L0gBudget2027);
