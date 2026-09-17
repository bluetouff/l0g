import { DEFAULTS, compareSupply, csvSupply } from './medicineSupplyModel.mjs';
import { SUPPLY_TEXT, supplyFmt, supplyPlot } from './medicineSupplyView.mjs';

/** Update controlled nodes only. No browser HTML parser, network or storage. */
export function updateSupplyResults(root, input, lang) {
  const result = compareSupply(input), t = SUPPLY_TEXT[lang], doc = root.ownerDocument;
  for (const [key, data] of [['base', result.baseline], ['backup', result.backup]]) {
    root.querySelector(`[data-metric="first-${key}"]`).textContent = data.firstShortage === null ? t.none : `${t.day} ${data.firstShortage}`;
    root.querySelector(`[data-metric="unmet-${key}"]`).textContent = `${supplyFmt(lang, data.totalUnmet, 1)} ${t.units}`;
    root.querySelector(`[data-metric="rate-${key}"]`).textContent = `${supplyFmt(lang, data.serviceRate * 100, 1)} %`;
  }
  for (const svg of root.querySelectorAll('[data-supply-chart]')) {
    const plot = supplyPlot(lang, result, svg.dataset.supplyChart === 'small');
    plot.ticks.forEach((tick, index) => { svg.querySelector(`[data-y-tick="${index}"]`).textContent = tick.label; });
    for (const key of ['a', 'b']) svg.querySelector(`[data-series="${key}"]`).setAttribute('points', plot[key]);
    svg.querySelector('[data-x-ticks]').replaceChildren(...plot.days.map(tick => {
      const node = doc.createElementNS('http://www.w3.org/2000/svg', 'text');
      for (const [key, value] of Object.entries({ x: tick.x, y: plot.h - plot.bottom + 26, 'text-anchor': 'middle', fill: '#bacbd6', 'font-size': 18 })) node.setAttribute(key, String(value));
      node.textContent = String(tick.day); return node;
    }));
  }
  root.querySelector('tbody').replaceChildren(...result.baseline.rows.map((a, index) => {
    const b = result.backup.rows[index], row = doc.createElement('tr');
    [a.day, a.demand, a.endingStock, a.unmet, b.endingStock, b.unmet].forEach((value, column) => {
      const cell = doc.createElement(column === 0 ? 'th' : 'td');
      if (column === 0) cell.scope = 'row';
      cell.textContent = supplyFmt(lang, value, 1); row.append(cell);
    });
    return row;
  }));
  return result;
}

export function mountMedicineSupplyLabs(scope = document) {
  for (const root of scope.querySelectorAll('[data-medicine-lab]')) {
    if (root.dataset.mounted === 'true') continue;
    const lang = root.dataset.lang === 'en' ? 'en' : 'fr', t = SUPPLY_TEXT[lang];
    const form = root.querySelector('.ms-form'), error = root.querySelector('.ms-error');
    const results = root.querySelector('[data-results]'), rows = root.querySelector('[data-rows]'), exportButton = root.querySelector('[data-export]');
    const field = key => form.querySelector(`[name="${key}"]`);
    let current = null;
    const update = () => {
      try {
        const input = Object.fromEntries(Object.keys(DEFAULTS).map(key => [key, field(key).value.trim() === '' ? NaN : Number(field(key).value)]));
        updateSupplyResults(root, input, lang); current = input;
        results.hidden = false; rows.hidden = false; error.hidden = true; exportButton.disabled = false;
      } catch {
        current = null; results.hidden = true; rows.hidden = true;
        error.textContent = t.invalid; error.hidden = false; exportButton.disabled = true;
      }
    };
    form.addEventListener('input', update);
    root.querySelector('[data-apply]').addEventListener('click', update);
    root.querySelector('[data-reset]').addEventListener('click', () => {
      for (const [key, value] of Object.entries(DEFAULTS)) field(key).value = String(value);
      update();
    });
    exportButton.addEventListener('click', () => {
      update(); if (!current) return;
      const url = URL.createObjectURL(new Blob([csvSupply(current)], { type: 'text/csv;charset=utf-8;' }));
      const link = root.ownerDocument.createElement('a'); link.href = url; link.download = `l0g-medicine-supply-${lang}.csv`;
      root.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    form.disabled = false; root.dataset.mounted = 'true'; update();
  }
}
