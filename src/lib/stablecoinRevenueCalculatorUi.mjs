import { STABLECOIN_REVENUE_FIELDS, STABLECOIN_REVENUE_DEFAULTS, calculateStablecoinRevenue, formatStablecoinMoney, formatStablecoinThreshold } from './stablecoinRevenueCalculator.mjs';
export const STABLECOIN_REVENUE_OUTPUTS = Object.freeze(['reserveIncome', 'issuerBeforeCosts', 'platformBeforeRewards', 'rewards', 'platformAfterRewards', 'additionalFunding', 'thresholdMicroPercent']);
const bound = new WeakSet();
export function stablecoinRevenueCopy(lang) {
  if (!['fr', 'en'].includes(lang)) throw new RangeError('Supported language required');
  return lang === 'en' ? {
    eyebrow: 'STABLECOINS / LOCAL CALCULATOR', title: 'Divide the income from a fictional reserve',
    intro: 'Fictional example over one year, with a constant reserve and simple annual rates. These inputs describe a teaching model rather than a Circle or Coinbase contract.',
    principalLabel: 'Principal kept in the reserve', controls: 'Change the four assumptions', legend: 'Constant principal and simple annual rates',
    fields: ['Principal (USD)', 'Reserve return (% per year)', 'Platform share of reserve income (%)', 'Customer reward (% of principal per year)'],
    bounds: 'Principal: $0 to $1 billion. Reserve and reward rates: 0% to 20%. Platform share: 0% to 100%. Up to two decimal places; decimal point or comma, without thousands separators.',
    labels: ['Annual reserve income', 'Issuer share before other costs', 'Platform allocation before rewards', 'Annual customer rewards', 'Platform remainder before other items', 'Additional funding required', 'Reward rate covered by this allocation'],
    reset: 'Restore fictional example', method: 'Method and limits',
    scope: 'Reserve income = principal × reserve return. The platform allocation is reserve income × its share; rewards = principal × reward rate. The remainder is the allocation less rewards. A negative remainder creates an additional funding need within this model.',
    threshold: 'For a positive principal, the arithmetic threshold equals reserve return × platform share. At zero principal, this rate is unavailable. It measures the reward budget before every other cost.',
    exclusions: 'Principal stays separate from income. Operating costs, taxes, losses, reserve buffers, financing and legal restrictions fall outside the exercise. Actual distributable income and reward eligibility depend on the applicable rules and contracts.',
    rounding: 'Money is calculated exactly in integer units, then rounded independently to cents. Displayed amounts can therefore differ by a cent when added.',
    privacy: 'Calculations run in this page. Inputs remain in memory while it is open.',
    nojs: 'The fictional starting scenario remains readable. JavaScript enables changes.',
    error: 'Enter four numbers within the stated limits, using up to two decimal places. Results remain unavailable until corrected.',
    unavailable: 'Unavailable', updated: 'Fictional scenario updated.',
  } : {
    eyebrow: 'STABLECOINS / CALCULATEUR LOCAL', title: 'Répartir le revenu d’une réserve fictive',
    intro: 'Exemple fictif sur une année, à réserve constante et taux annuels simples. Les paramètres décrivent un modèle pédagogique, distinct des contrats de Circle ou Coinbase.',
    principalLabel: 'Principal conservé dans la réserve', controls: 'Modifier les quatre hypothèses', legend: 'Principal constant et taux annuels simples',
    fields: ['Principal (dollars)', 'Rendement de la réserve (% par an)', 'Part du revenu attribuée à la plateforme (%)', 'Récompense client (% du principal par an)'],
    bounds: 'Principal : de 0 à 1 milliard de dollars. Rendement et récompense : de 0 % à 20 %. Part de la plateforme : de 0 % à 100 %. Deux décimales au maximum ; point ou virgule, sans séparateur de milliers.',
    labels: ['Revenu annuel de réserve', 'Part de l’émetteur avant autres coûts', 'Allocation à la plateforme avant récompenses', 'Récompenses annuelles des clients', 'Solde de la plateforme avant autres postes', 'Financement supplémentaire nécessaire', 'Taux de récompense couvert par cette allocation'],
    reset: 'Rétablir l’exemple fictif', method: 'Méthode et périmètre',
    scope: 'Revenu de réserve = principal × rendement. L’allocation à la plateforme vaut ce revenu × sa part ; les récompenses valent principal × taux client. Le solde est l’allocation diminuée des récompenses. Un solde négatif crée un besoin de financement supplémentaire dans ce modèle.',
    threshold: 'Pour un principal positif, le seuil arithmétique vaut rendement de réserve × part de la plateforme. Pour un principal nul, ce taux est indisponible. Il mesure le budget de récompense avant tous les autres coûts.',
    exclusions: 'Le principal reste séparé du revenu. Charges opérationnelles, impôts, pertes, coussins de réserve, financement et contraintes juridiques restent hors exercice. Le revenu réellement distribuable et l’éligibilité des récompenses dépendent des règles et des contrats applicables.',
    rounding: 'Les montants sont calculés exactement en unités entières, puis arrondis au centime séparément. Leur somme à l’affichage peut donc différer d’un centime.',
    privacy: 'Les calculs restent dans cette page. Les valeurs sont conservées en mémoire pendant son ouverture.',
    nojs: 'Le scénario fictif initial reste lisible. JavaScript permet de modifier les hypothèses.',
    error: 'Saisissez quatre nombres dans les limites indiquées, avec deux décimales au maximum. Les résultats restent indisponibles jusqu’à correction.',
    unavailable: 'Indisponible', updated: 'Scénario fictif actualisé.',
  };
}
export function stablecoinRevenueOutputText(key, value, lang) {
  return key === 'thresholdMicroPercent' ? formatStablecoinThreshold(value, lang) : formatStablecoinMoney(value, lang);
}
export function bindStablecoinRevenueCalculators(scope = document) {
  scope.querySelectorAll('[data-stablecoin-revenue-calculator]').forEach(root => {
    if (bound.has(root)) return;
    const lang = root.dataset.lang === 'en' ? 'en' : 'fr', copy = stablecoinRevenueCopy(lang);
    const form = root.querySelector('form'), fieldset = root.querySelector('fieldset');
    const error = root.querySelector('[data-error]'), status = root.querySelector('[data-status]');
    const fields = STABLECOIN_REVENUE_FIELDS.map(key => form?.elements.namedItem(key));
    const outputs = STABLECOIN_REVENUE_OUTPUTS.map(key => root.querySelector(`[data-output="${key}"]`));
    const principal = root.querySelector('[data-principal]');
    if (!form || !fieldset || !error || !status || !principal || fields.some(field => !field) || outputs.some(output => !output)) return;
    bound.add(root);
    function update() {
      try {
        const input = Object.fromEntries(STABLECOIN_REVENUE_FIELDS.map((key, index) => [key, fields[index].value]));
        const result = calculateStablecoinRevenue(input);
        fields.forEach(field => field.setAttribute('aria-invalid', 'false'));
        outputs.forEach((output, index) => { output.textContent = stablecoinRevenueOutputText(STABLECOIN_REVENUE_OUTPUTS[index], result[STABLECOIN_REVENUE_OUTPUTS[index]], lang); });
        principal.textContent = formatStablecoinMoney(result.principal, lang);
        error.hidden = true; error.textContent = '';
        status.textContent = `${copy.updated} ${copy.labels[4]} : ${formatStablecoinMoney(result.platformAfterRewards, lang)}`;
      } catch {
        fields.forEach(field => field.setAttribute('aria-invalid', 'true'));
        outputs.forEach(output => { output.textContent = copy.unavailable; });
        principal.textContent = copy.unavailable;
        error.hidden = false; error.textContent = copy.error; status.textContent = copy.error;
      }
    }
    form.addEventListener('input', update); form.addEventListener('change', update);
    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', event => { event.preventDefault(); fields.forEach((field, index) => { field.value = STABLECOIN_REVENUE_DEFAULTS[STABLECOIN_REVENUE_FIELDS[index]]; }); update(); });
    fieldset.disabled = false; update();
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bindStablecoinRevenueCalculators(), { once: true });
  else bindStablecoinRevenueCalculators();
  document.addEventListener('astro:page-load', () => bindStablecoinRevenueCalculators());
}
