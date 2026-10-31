import { PIK_FIELDS, PIK_DEFAULTS, calculatePik, formatPikNumber } from './pikModel.mjs';
const bound = new WeakSet();
export const PIK_RESULTS = Object.freeze(['debt','cashTotal','gap','requiredEbitda']);
export function pikCopy(lang) {
  if (!['fr','en'].includes(lang)) throw new RangeError('Supported language required');
  return lang === 'fr' ? {
    eyebrow: 'INTÉRÊTS REPORTÉS / SIMULATEUR LOCAL', title: 'Faire varier le prix de l’attente',
    intro: 'Un prêt fictif avec des intérêts payés en espèces ou ajoutés à la dette, une fois par an. Tous les montants sont en millions de dollars.',
    controls: 'Faire varier les six hypothèses', legend: 'Paramètres du modèle fictif M01',
    labels: ['Principal initial (M$)', 'Taux annuel total (%)', 'Durée (années)', 'Part du coupon payée en espèces (%)', 'EBITDA à la sortie (M$)', 'Multiple de refinancement'],
    bounds: ['0,1 à 100 000 M$', '0 à 40 % par an', '1 à 10 ans, années entières', '0 à 100 %, pourcentage entier', '0 à 100 000 M$', '0,1 à 20 fois'],
    resultLabels: ['Dette finale', 'Coupons payés en espèces, cumulés', 'À financer hors nouveau prêt', 'EBITDA nécessaire au multiple choisi'], unit: 'M$',
    reset: 'Rétablir l’exemple fictif', table: 'Voir les flux annuels', tableLabel: 'Flux annuels du modèle fictif, en millions de dollars',
    columns: ['Année', 'Dette initiale', 'Coupon cash', 'PIK ajouté', 'Dette finale'], method: 'Hypothèses et méthode',
    formula: 'À chaque fin d’année : intérêt = dette d’ouverture × taux ; coupon cash = intérêt × part payée en espèces ; dette finale = dette d’ouverture + intérêt conservé dans la dette. À la sortie, capacité de refinancement = EBITDA × multiple. Le besoin à financer est la partie de la dette finale au-delà de cette capacité.',
    limits: 'Le modèle exclut frais, impôts, défauts, remboursements intermédiaires de principal et clauses de rendement minimal. Il décrit des hypothèses fictives, distinctes des contrats d’Applied Digital. Le multiple est une hypothèse de prêt. L’EBITDA est un indicateur avant intérêts, impôts et amortissements, distinct de la trésorerie.',
    rounding: 'Les calculs utilisent la double précision ; les montants sont arrondis à deux décimales après calcul. Les sommes de montants affichés peuvent différer légèrement des totaux arrondis.',
    privacy: 'Les calculs s’effectuent dans cette page. Les réglages restent en mémoire pendant son ouverture.',
    nojs: 'Le scénario initial et ses flux restent lisibles. JavaScript active les réglages.',
    error: 'Vérifiez les six valeurs et les limites indiquées. Les résultats restent indisponibles jusqu’à correction.', unavailable: 'Indisponible', updated: 'Scénario fictif recalculé.',
  } : {
    eyebrow: 'DEFERRED INTEREST / LOCAL CALCULATOR', title: 'Change the cost of waiting',
    intro: 'A fictional loan with interest paid in cash or added to the debt once a year. All amounts are USD millions.',
    controls: 'Change the six assumptions', legend: 'Hypothetical model M01 inputs',
    labels: ['Initial principal ($m)', 'Total annual rate (%)', 'Term (years)', 'Cash share of interest (%)', 'Exit EBITDA ($m)', 'Refinancing multiple'],
    bounds: ['$0.1m to $100,000m', '0% to 40% per year', '1 to 10 whole years', '0% to 100%, whole percentage', '$0m to $100,000m', '0.1 to 20 times'],
    resultLabels: ['Final debt', 'Cumulative cash coupons', 'Funding needed beyond the new loan', 'EBITDA needed at the selected multiple'], unit: 'USD m',
    reset: 'Restore fictional example', table: 'Inspect annual cash flows', tableLabel: 'Hypothetical annual cash flows in USD millions',
    columns: ['Year', 'Opening debt', 'Cash interest', 'Added PIK', 'Closing debt'], method: 'Assumptions and method',
    formula: 'At each year-end: interest = opening debt × rate; cash coupon = interest × cash share; closing debt = opening debt + interest retained in the loan. At exit, refinancing capacity = EBITDA × multiple. The funding need is the portion of final debt above that capacity.',
    limits: 'The model excludes fees, taxes, default, interim principal repayments and minimum-return clauses. Its fictional assumptions are distinct from Applied Digital’s contracts. The multiple is a lending assumption. EBITDA is earnings before interest, taxes, depreciation and amortisation, distinct from cash available.',
    rounding: 'Calculations use double precision; amounts are rounded to two decimals after calculation. Sums of displayed amounts may differ slightly from independently rounded totals.',
    privacy: 'Calculations run in this page. Inputs stay in memory while it is open.',
    nojs: 'The starting scenario and its cash flows remain readable. JavaScript enables changes.',
    error: 'Check the six inputs and their stated limits. Results remain unavailable until corrected.', unavailable: 'Unavailable', updated: 'Fictional scenario recalculated.',
  };
}
export function pikDisplay(result, field, lang) {
  if (!PIK_RESULTS.includes(field)) throw new RangeError('Unknown PIK result');
  return formatPikNumber(result[field], lang);
}
export function bindPikCalculators(scope = document) {
  scope.querySelectorAll('[data-pik-root]').forEach(root => {
    if (bound.has(root)) return;
    const lang = root.dataset.pikLang === 'en' ? 'en' : 'fr', copy = pikCopy(lang);
    const form = root.querySelector('form'), fieldset = root.querySelector('fieldset'), error = root.querySelector('[data-error]'), status = root.querySelector('[data-status]'), tbody = root.querySelector('tbody');
    const fields = PIK_FIELDS.map(field => form?.elements.namedItem(field)), outputs = [...root.querySelectorAll('[data-pik-result]')];
    if (!form || !fieldset || !error || !status || !tbody || fields.some(field => !field) || outputs.length !== PIK_RESULTS.length) return;
    bound.add(root);
    function update() {
      try {
        const result = calculatePik(Object.fromEntries(PIK_FIELDS.map((field,index) => [field, fields[index].value])));
        outputs.forEach(output => { output.textContent = pikDisplay(result, output.dataset.pikResult, lang); });
        const rows = result.annual.map(row => {
          const tr = document.createElement('tr');
          for (const field of ['year','opening','cash','pik','debt']) {
            const cell = document.createElement(field === 'year' ? 'th' : 'td');
            if (field === 'year') cell.setAttribute('scope','row');
            cell.textContent = field === 'year' ? String(row.year) : formatPikNumber(row[field], lang);
            tr.appendChild(cell);
          }
          return tr;
        });
        tbody.replaceChildren(...rows); fields.forEach(field => field.setAttribute('aria-invalid','false'));
        error.hidden = true; error.textContent = ''; root.dataset.valid = 'true';
        status.textContent = `${copy.updated} ${copy.resultLabels[0]} : ${pikDisplay(result,'debt',lang)} ${copy.unit}. ${copy.resultLabels[2]} : ${pikDisplay(result,'gap',lang)} ${copy.unit}.`;
      } catch {
        fields.forEach(field => field.setAttribute('aria-invalid','true'));
        outputs.forEach(output => { output.textContent = copy.unavailable; }); tbody.replaceChildren();
        error.hidden = false; error.textContent = copy.error; status.textContent = copy.error; root.dataset.valid = 'false';
      }
    }
    form.addEventListener('input', update); form.addEventListener('change', update); form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', event => { event.preventDefault(); fields.forEach((field,index) => { field.value = PIK_DEFAULTS[PIK_FIELDS[index]]; }); update(); });
    fieldset.disabled = false; update();
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bindPikCalculators(), { once:true }); else bindPikCalculators();
  document.addEventListener('astro:page-load', () => bindPikCalculators());
}
