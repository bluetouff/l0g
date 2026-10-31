import { GPU_DEBT_FIELDS, GPU_DEBT_DEFAULTS, calculateGpuDebt, formatGpuDebtMoney, formatGpuDebtNumber } from './gpuDebtStress.mjs';
const bound = new WeakSet();
const RESULT_FIELDS = Object.freeze(['coverage', 'revenue', 'available', 'surplus', 'threshold', 'threshold135']);
export function gpuDebtCopy(lang) {
  if (!['fr', 'en'].includes(lang)) throw new RangeError('Supported language required');
  return lang === 'fr' ? {
    eyebrow: 'CALCUL ET REMBOURSEMENT / SIMULATEUR LOCAL', title: 'Le tarif de location qui couvre l’échéance',
    intro: 'Un projet fictif de huit GPU, financé par un prêt à quatre ans. Faites varier le prix, les heures facturées et les charges pour suivre la trésorerie disponible.',
    controls: 'Faire varier les trois hypothèses', legend: 'Paramètres du scénario fictif',
    labels: ['Tarif facturé par GPU-heure (dollars)', 'Part des heures effectivement facturées (%)', 'Charges annuelles hors dette (dollars)'],
    bounds: 'Tarif : de 1 à 8 dollars par GPU-heure. Heures facturées : de 20 % à 100 %. Charges annuelles : de 30 000 à 150 000 dollars.',
    coverage: 'Couverture simplifiée de l’échéance', covered: 'Échéance couverte', shortfall: 'Besoin de trésorerie',
    resultLabels: ['Recettes annuelles', 'Trésorerie disponible pour la dette', 'Solde après l’échéance annuelle', 'Tarif seuil pour couvrir 1,00×', 'Tarif seuil pour atteindre 1,35×'],
    reset: 'Rétablir l’exemple fictif', method: 'Hypothèses et méthode',
    assumptions: 'Hypothèses fixes : 8 GPU, 320 000 dollars d’investissement initial, dont 240 000 de dette à taux fixe de 10 %, remboursée en quatre annuités égales. Année de 8 760 heures. Les charges hors dette restent fixes.',
    formula: 'L’annuité correspond à quatre versements de fin d’année identiques : dette × taux ÷ [1 − (1 + taux)⁻⁴]. Recettes = GPU × heures annuelles × part facturée × tarif. Trésorerie disponible = recettes − charges. Couverture = trésorerie disponible ÷ annuité. Le tarif seuil divise les charges augmentées de l’annuité ciblée par les GPU-heures facturées.',
    limits: 'Ce modèle pédagogique décrit des hypothèses fictives, distinctes des comptes et des covenants de CoreWeave. Impôts, frais, renouvellement du matériel, refinancement, valeur de revente et variations du fonds de roulement restent hors calcul. Le seuil de 1,35× sert de repère pédagogique.',
    rounding: 'Les calculs utilisent la double précision. Chaque montant est affiché à l’unité de dollar et chaque tarif seuil à deux décimales, après le calcul. Ces arrondis peuvent créer un léger écart entre les valeurs affichées.',
    privacy: 'Les calculs s’effectuent dans cette page. Les réglages restent en mémoire pendant son ouverture.',
    nojs: 'Le scénario initial reste lisible. JavaScript active les réglages.', error: 'Choisissez trois valeurs valides dans les limites indiquées. Les résultats restent indisponibles jusqu’à correction.', unavailable: 'Indisponible', updated: 'Scénario fictif actualisé.',
  } : {
    eyebrow: 'COMPUTE AND REPAYMENT / LOCAL CALCULATOR', title: 'The rental rate that covers the debt payment',
    intro: 'A fictional eight-GPU project with a four-year loan. Change the rate, billed hours and cash costs to follow the money available for repayment.',
    controls: 'Change the three assumptions', legend: 'Fictional scenario inputs',
    labels: ['Realised rate per GPU-hour (USD)', 'Share of hours actually billed (%)', 'Annual cash costs excluding debt (USD)'],
    bounds: 'Rate: $1 to $8 per GPU-hour. Billed hours: 20% to 100%. Annual cash costs: $30,000 to $150,000.',
    coverage: 'Simplified debt-payment coverage', covered: 'Debt payment covered', shortfall: 'Funding shortfall',
    resultLabels: ['Annual revenue', 'Cash available for debt service', 'Cash after the annual payment', 'Rental rate for 1.00× coverage', 'Rental rate for 1.35× coverage'],
    reset: 'Restore fictional example', method: 'Assumptions and method',
    assumptions: 'Fixed inputs: 8 GPUs, $320,000 upfront investment, including $240,000 of debt at 10% fixed interest, repaid in four equal annual instalments. A year contains 8,760 hours. Cash operating costs are held constant.',
    formula: 'The annuity consists of four equal year-end payments: debt × rate ÷ [1 − (1 + rate)⁻⁴]. Revenue = GPUs × annual hours × billed share × rate. Cash available = revenue − operating cash costs. Coverage = cash available ÷ annual debt payment. The rate threshold divides costs plus the target debt payment by billed GPU-hours.',
    limits: 'This teaching model uses fictional inputs, distinct from CoreWeave’s accounts and legal covenants. It excludes taxes, fees, equipment replacement, refinancing, resale proceeds and working-capital changes. The 1.35× threshold is a teaching benchmark.',
    rounding: 'Calculations use double precision. Cash amounts are displayed to the nearest dollar and rate thresholds to two decimal places after calculation. Independent rounding can create small differences between displayed figures.',
    privacy: 'Calculations run in this page. Inputs stay in memory while it is open.',
    nojs: 'The starting scenario remains readable. JavaScript enables changes.', error: 'Choose three valid inputs within the stated limits. Results remain unavailable until corrected.', unavailable: 'Unavailable', updated: 'Fictional scenario updated.',
  };
}
export function gpuDebtDisplay(result, field, lang) {
  if (!RESULT_FIELDS.includes(field)) throw new RangeError('Unknown model output');
  if (field === 'coverage') return `${formatGpuDebtNumber(result.coverage, lang)}×`;
  return formatGpuDebtMoney(result[field], lang, ['threshold', 'threshold135'].includes(field) ? 2 : 0, field === 'surplus');
}
export function bindGpuDebtStress(scope = document) {
  scope.querySelectorAll('[data-gpu-debt-stress]').forEach(root => {
    if (bound.has(root)) return;
    const lang = root.dataset.lang === 'en' ? 'en' : 'fr', copy = gpuDebtCopy(lang);
    const form = root.querySelector('form'), fieldset = root.querySelector('fieldset'), error = root.querySelector('[data-error]'), status = root.querySelector('[data-status]'), funding = root.querySelector('[data-funding]'), meter = root.querySelector('meter');
    const fields = GPU_DEBT_FIELDS.map(key => form?.elements.namedItem(key));
    const outputs = [...root.querySelectorAll('[data-gpu-debt-output]')], readouts = [...root.querySelectorAll('[data-gpu-debt-readout]')];
    if (!form || !fieldset || !error || !status || !funding || !meter || fields.some(field => !field) || outputs.length !== RESULT_FIELDS.length || readouts.length !== GPU_DEBT_FIELDS.length) return;
    bound.add(root);
    function update() {
      try {
        const result = calculateGpuDebt(Object.fromEntries(GPU_DEBT_FIELDS.map((key, index) => [key, fields[index].value])));
        outputs.forEach(output => { output.textContent = gpuDebtDisplay(result, output.dataset.gpuDebtOutput, lang); });
        readouts.forEach(output => {
          const key = output.dataset.gpuDebtReadout;
          if (!GPU_DEBT_FIELDS.includes(key)) throw new RangeError('Unknown input readout');
          output.textContent = key === 'utilization' ? `${formatGpuDebtNumber(result[key], lang, 0)} %` : formatGpuDebtMoney(result[key], lang, key === 'price' ? 2 : 0);
        });
        fields.forEach((field, index) => { field.setAttribute('aria-invalid', 'false'); field.setAttribute('aria-valuetext', readouts.find(output => output.dataset.gpuDebtReadout === GPU_DEBT_FIELDS[index]).textContent); });
        funding.textContent = result.covered ? copy.covered : copy.shortfall;
        funding.dataset.funding = result.covered ? 'covered' : 'shortfall';
        meter.value = Math.max(0, Math.min(2.5, result.coverage));
        meter.setAttribute('aria-valuetext', gpuDebtDisplay(result, 'coverage', lang));
        error.hidden = true; error.textContent = ''; status.textContent = `${copy.updated} ${copy.coverage} : ${gpuDebtDisplay(result, 'coverage', lang)}. ${funding.textContent}.`;
      } catch {
        fields.forEach(field => field.setAttribute('aria-invalid', 'true'));
        [...outputs, ...readouts].forEach(output => { output.textContent = copy.unavailable; });
        funding.textContent = copy.unavailable; funding.dataset.funding = 'unavailable'; meter.value = 0; meter.setAttribute('aria-valuetext', copy.unavailable);
        error.hidden = false; error.textContent = copy.error; status.textContent = copy.error;
      }
    }
    form.addEventListener('input', update); form.addEventListener('change', update); form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', event => { event.preventDefault(); fields.forEach((field, index) => { field.value = GPU_DEBT_DEFAULTS[GPU_DEBT_FIELDS[index]]; }); update(); });
    fieldset.disabled = false; update();
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bindGpuDebtStress(), { once: true }); else bindGpuDebtStress();
  document.addEventListener('astro:page-load', () => bindGpuDebtStress());
}
