import { BASE_SEQUENCE_INPUT, LONG_RETURNS, parseSequence, validateSequenceInput, compareSequences, sequenceCSV } from './retirementSequenceModel.mjs';
import { SEQUENCE_COPY, sequenceMoney, sequencePercent, sequencePlot } from './retirementSequenceView.mjs';

/** Update existing nodes without interpreting input or DOM text as markup. */
export function updateSequenceResults(root, input, lang) {
  const copy = SEQUENCE_COPY[lang], result = compareSequences(input), doc = root.ownerDocument;
  const money = value => sequenceMoney(value, lang), percent = value => sequencePercent(value, lang);
  const { a, b } = result;
  root.querySelector('.rseq-metrics').textContent = `${a.years} ${copy.years} · ${copy.cagr} ${copy.gross}: ${percent(a.cagr)} · ${copy.net}: ${percent(a.netCagr)} · ${copy.fraction}: ${percent(a.fraction * 100)}`;
  for (const key of ['a', 'b']) {
    const data = result[key], card = root.querySelector(`.rseq-card-${key}`);
    card.querySelector('strong').textContent = money(data.closing);
    const first = input.mode === 'fixed' ? data.firstUnfunded : data.firstBudgetGap;
    const values = [money(data.realClosing), money(data.totalPaid), money(data.totalShortfall), first === null ? copy.none : `${copy.year} ${first}`];
    card.querySelectorAll('dt')[3].textContent = input.mode === 'fixed' ? copy.unfunded : copy.budgetGap;
    card.querySelectorAll('dd').forEach((node, index) => { node.textContent = values[index]; });
  }
  for (const svg of root.querySelectorAll('[data-sequence-chart]')) {
    const plot = sequencePlot(input, result, lang, svg.dataset.sequenceChart === 'small');
    svg.querySelector('desc').textContent = `A: ${money(a.closing)}. B: ${money(b.closing)}.`;
    plot.yTicks.forEach((tick, index) => { svg.querySelector(`[data-y-tick="${index}"]`).textContent = tick.label; });
    for (const key of ['a', 'b']) {
      svg.querySelector(`[data-series="${key}"]`).setAttribute('d', plot[key].d);
      const end = svg.querySelector(`[data-end="${key}"]`);
      end.setAttribute('cx', String(plot[key].x)); end.setAttribute('cy', String(plot[key].y));
    }
    svg.querySelector('[data-x-ticks]').replaceChildren(...plot.xTicks.map(tick => {
      const node = doc.createElementNS('http://www.w3.org/2000/svg', 'text');
      for (const [name, value] of Object.entries({ x: tick.x, y: plot.h - plot.bottom + 28, 'text-anchor': 'middle', fill: '#b9cad6', 'font-size': plot.fs })) node.setAttribute(name, String(value));
      node.textContent = String(tick.label); return node;
    }));
  }
  root.querySelector('tbody').replaceChildren(...a.rows.map((row, index) => {
    const other = b.rows[index], tr = doc.createElement('tr');
    const values = [row.year, percent(row.returnPct), percent(other.returnPct), money(row.budget), money(row.paid), money(other.paid), money(row.closing), money(other.closing)];
    values.forEach((value, column) => { const cell = doc.createElement(column === 0 ? 'th' : 'td'); if (column === 0) cell.scope = 'row'; cell.textContent = String(value); tr.append(cell); });
    return tr;
  }));
  return result;
}

/** Calculations and export stay local. Invalid input hides stale results. */
export function mountRetirementSequence(scope = document) {
  for (const root of scope.querySelectorAll('[data-retirement-sequence]')) {
    if (root.dataset.mounted === 'true') continue;
    const lang = root.dataset.lang === 'en' ? 'en' : 'fr', copy = SEQUENCE_COPY[lang];
    const form = root.querySelector('[data-sequence-form]'), results = root.querySelector('[data-sequence-results]');
    const error = root.querySelector('[data-sequence-error]'), exportButton = root.querySelector('[data-sequence-export]');
    const field = name => form.querySelector(`[name="${name}"]`);
    let current = null;
    const read = () => {
      const values = { mode: field('mode').value, returns: parseSequence(field('returns').value) };
      for (const key of ['initial', 'withdrawal', 'inflation', 'fee']) values[key] = field(key).value.trim() === '' ? NaN : Number(field(key).value);
      return validateSequenceInput(values);
    };
    const update = () => {
      try {
        const next = read(); updateSequenceResults(results, next, lang); current = next;
        results.hidden = false; error.hidden = true; error.textContent = ''; exportButton.disabled = false;
      } catch (err) {
        current = null; results.hidden = true;
        error.textContent = Object.hasOwn(copy.errors, err?.message) ? copy.errors[err.message] : copy.errors.series;
        error.hidden = false; exportButton.disabled = true;
      }
    };
    root.querySelector('[data-sequence-apply]').addEventListener('click', update);
    form.addEventListener('input', update); form.addEventListener('change', update);
    for (const button of root.querySelectorAll('[data-preset]')) {
      button.addEventListener('click', () => {
        const preset = button.dataset.preset;
        if (preset === 'zero') field('withdrawal').value = '0';
        else if (preset === 'two' || preset === 'long') {
          for (const key of ['initial', 'withdrawal', 'fee']) field(key).value = String(BASE_SEQUENCE_INPUT[key]);
          field('inflation').value = preset === 'two' ? '0' : '2';
          field('returns').value = (preset === 'two' ? [-20, 25] : LONG_RETURNS).join('; '); field('mode').value = 'fixed';
        }
        update();
      });
      button.disabled = false;
    }
    exportButton.addEventListener('click', () => {
      if (!current) return;
      const url = URL.createObjectURL(new Blob([sequenceCSV(current)], { type: 'text/csv;charset=utf-8' }));
      const link = root.ownerDocument.createElement('a'); link.href = url; link.download = `l0g-retirement-sequence-${lang}.csv`;
      root.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    form.disabled = false; root.dataset.mounted = 'true'; update();
  }
}
