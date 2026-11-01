import { ORACLE_CASH_FIELDS, ORACLE_CASH_DEFAULTS, ORACLE_CASH_RESULTS, calculateOracleCash, oracleCashDisplay, oracleCashEquation } from './oracleCashModel.mjs';
const bound = new WeakSet();
export function oracleCashCopy(lang) {
  if (!['fr', 'en'].includes(lang)) throw new RangeError('Supported language required');
  return lang === 'fr' ? {
    eyebrow: 'ORACLE / ATELIER DE TRÉSORERIE', title: 'Un dollar d’avance, une seule fois',
    intro: 'Faire varier les avances des clients et les investissements du trimestre de juin à août 2026. Les autres flux restent constants : l’atelier explique un mécanisme de trésorerie.',
    controls: 'Modifier les deux montants', legend: 'Montants entiers en millions de dollars américains',
    labels: ['Avances clients identifiées', 'Dépenses d’investissement'], bounds: ['0 à 60 000 millions USD', '0 à 80 000 millions USD'],
    reset: 'Rétablir le trimestre publié', resultLabels: ['Flux opérationnel', 'Flux opérationnel diminué des investissements', 'Décaissement net associé aux investissements', 'Solde après investissements et financement fabricant'], unit: 'Md$',
    initial: 'Trimestre publié : du 1er juin au 31 août 2026. Tous les résultats sont en milliards de dollars américains.',
    scenario: 'Sensibilité pédagogique : montants modifiés, autres flux constants. Résultats en milliards de dollars américains.',
    equations: 'Rapprocher les deux calculs', equationA: 'Lecture A : flux opérationnel, investissements et remboursement fabricant.', equationB: 'Lecture B : flux opérationnel hors avances, diminué du décaissement net.',
    errorExample: 'Comprendre le double comptage des avances', mixedLabel: 'Comparaison erronée, à titre pédagogique', overcountLabel: 'Avances comptées une seconde fois',
    errorExplanation: 'Soustraire le décaissement net au flux opérationnel réutilise les mêmes avances : elles augmentent déjà le premier et réduisent le second. Oracle publie son free cash-flow selon une autre définition.',
    method: 'Périmètre, sources et confidentialité',
    fixed: 'Fixes dans cet atelier : 11 740 millions de flux opérationnel hors avances identifiées et 830 millions de remboursement net de financement à court terme lié aux équipements. Ce remboursement figure dans les flux de financement des comptes.',
    definitions: 'Le free cash-flow publié correspond au flux opérationnel diminué des investissements. Le décaissement net ajoute aux investissements le remboursement fabricant de 830 millions, puis retire les avances identifiées. Le solde de l’atelier tient compte de ces trois postes.',
    limits: 'Les autres flux d’investissement et de financement, dont dividendes, émissions et remboursements de dette, restent hors du solde affiché. Celui-ci diffère donc de la variation globale de trésorerie. Le montant fixe conserve les autres variations du besoin en fonds de roulement du trimestre.',
    scope: 'Les variations sont des sensibilités arithmétiques. Dans la réalité, Oracle pourrait adapter ses investissements et ses financements à ses contrats. L’atelier produit une explication du trimestre, distincte d’un free cash-flow normalisé ou d’une prévision pour 2030.',
    privacy: 'Les calculs s’effectuent dans cette page ; les valeurs restent en mémoire pendant son ouverture. Les entrées sont des millions entiers et les résultats sont affichés en milliards, avec trois décimales.',
    sourceLabel: 'Résultats trimestriels Oracle', filingLabel: 'Formulaire 10-Q, trimestre clos le 31 août 2026', nojs: 'Les chiffres du trimestre et les équations restent lisibles. JavaScript active les réglages.',
    error: 'Saisissez deux montants entiers en millions de dollars, dans les limites indiquées. Les résultats restent indisponibles jusqu’à correction.', unavailable: 'Indisponible', updated: 'Calculs actualisés.',
  } : {
    eyebrow: 'ORACLE / CASH-FLOW WORKSHOP', title: 'One prepaid dollar, counted once',
    intro: 'Change customer advances and investment spending for June–August 2026. Other flows stay constant: this workshop explains a cash-flow mechanism.',
    controls: 'Change the two amounts', legend: 'Whole amounts in millions of US dollars',
    labels: ['Identified customer advances', 'Capital expenditure'], bounds: ['0 to 60,000 USD million', '0 to 80,000 USD million'],
    reset: 'Restore the reported quarter', resultLabels: ['Operating cash flow', 'Operating cash flow less capital expenditure', 'Net cash outlay for capital expenditure', 'Balance after capex and manufacturer financing'], unit: 'USD bn',
    initial: 'Reported quarter: June 1–August 31, 2026. All results are in billions of US dollars.',
    scenario: 'Teaching sensitivity: changed inputs, other flows held constant. Results are in billions of US dollars.',
    equations: 'Reconcile the two calculations', equationA: 'View A: operating cash flow, capex and manufacturer repayment.', equationB: 'View B: operating cash flow excluding advances, less net cash outlay.',
    errorExample: 'Understand the double counting of advances', mixedLabel: 'Incorrect comparison, for illustration', overcountLabel: 'Advances counted a second time',
    errorExplanation: 'Subtracting net cash outlay from operating cash flow reuses the same advances: they already increase the first and reduce the second. Oracle publishes free cash flow using a different definition.',
    method: 'Scope, sources and privacy',
    fixed: 'Held constant: USD11,740 million of operating cash flow excluding identified advances, and USD830 million of net repayment of short-term equipment-related financing. The repayment appears in financing activities in the accounts.',
    definitions: 'Published free cash flow is operating cash flow less capital expenditure. Net cash outlay adds the USD830 million manufacturer repayment to capex, then deducts the identified advances. The workshop balance includes these three components.',
    limits: 'Other investing and financing flows, including dividends, debt issuance and debt repayments, sit outside the displayed balance. It therefore differs from the overall cash movement. The fixed amount retains the quarter’s other working-capital movements.',
    scope: 'Changes are arithmetic sensitivities. In practice, Oracle could adapt investment and funding to its contracts. The workshop explains the quarter, separately from normalised free cash flow or a forecast for 2030.',
    privacy: 'Calculations run in this page; values stay in memory while it is open. Inputs are whole USD millions; results are displayed in USD billions with three decimals.',
    sourceLabel: 'Oracle quarterly results', filingLabel: 'Form 10-Q for the quarter ended August 31, 2026', nojs: 'Reported figures and equations remain readable. JavaScript enables changes.',
    error: 'Enter two whole amounts in USD millions within the displayed limits. Results remain unavailable until corrected.', unavailable: 'Unavailable', updated: 'Calculations updated.',
  };
}
export function bindOracleCashCalculators(scope = document) {
  scope.querySelectorAll('[data-oracle-cash-root]').forEach(root => {
    if (bound.has(root) || !['fr', 'en'].includes(root.dataset.oracleCashLang)) return;
    const lang = root.dataset.oracleCashLang, copy = oracleCashCopy(lang);
    const form = root.querySelector('form'), fieldset = root.querySelector('fieldset'), error = root.querySelector('[data-error]'), status = root.querySelector('[data-status]'), scenario = root.querySelector('[data-scenario]');
    const fields = ORACLE_CASH_FIELDS.map(field => form?.elements.namedItem(field)), outputs = [...root.querySelectorAll('[data-oracle-cash-result]')], equations = [...root.querySelectorAll('[data-oracle-cash-equation]')];
    if (!form || !fieldset || !error || !status || !scenario || fields.some(field => !field) || outputs.length !== ORACLE_CASH_RESULTS.length || equations.length !== 2) return;
    bound.add(root);
    function update() {
      try {
        const result = calculateOracleCash(Object.fromEntries(ORACLE_CASH_FIELDS.map((field, index) => [field, fields[index].value])));
        outputs.forEach(output => { output.textContent = oracleCashDisplay(result, output.dataset.oracleCashResult, lang); });
        equations.forEach(output => { output.textContent = oracleCashEquation(result, output.dataset.oracleCashEquation, lang); });
        const isBaseline = ORACLE_CASH_FIELDS.every(field => result[field] === Number(ORACLE_CASH_DEFAULTS[field]));
        scenario.textContent = isBaseline ? copy.initial : copy.scenario;
        fields.forEach(field => field.setAttribute('aria-invalid', 'false')); error.hidden = true; error.textContent = ''; root.dataset.valid = 'true';
        status.textContent = `${copy.updated} ${copy.resultLabels[3]} : ${oracleCashDisplay(result, 'balance', lang)} ${copy.unit}.`;
      } catch {
        fields.forEach(field => field.setAttribute('aria-invalid', 'true')); outputs.forEach(output => { output.textContent = copy.unavailable; }); equations.forEach(output => { output.textContent = copy.unavailable; });
        scenario.textContent = copy.unavailable; error.hidden = false; error.textContent = copy.error; status.textContent = copy.error; root.dataset.valid = 'false';
      }
    }
    form.addEventListener('input', update); form.addEventListener('change', update); form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', event => { event.preventDefault(); fields.forEach((field, index) => { field.value = ORACLE_CASH_DEFAULTS[ORACLE_CASH_FIELDS[index]]; }); update(); });
    update(); fieldset.disabled = false;
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bindOracleCashCalculators(), { once: true }); else bindOracleCashCalculators();
  document.addEventListener('astro:page-load', () => bindOracleCashCalculators());
}
