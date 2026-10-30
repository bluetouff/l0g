import { PC_AI_PRICE_FIELDS, PC_AI_PRICE_DEFAULTS, calculatePcAiPrice, parsePcAiPriceQuantity, formatPcAiPriceMoney, formatPcAiPricePercent } from './pcAiPriceCalculator.mjs';
const bound = new WeakSet();
export function pcAiPriceCopy(lang) {
  if (!['fr', 'en'].includes(lang)) throw new RangeError('Supported language required');
  return lang === 'en' ? {
    eyebrow: 'COMPUTER PRICES / LOCAL CALCULATOR', title: 'Simulate the transmission of a component-cost increase',
    intro: 'Fictional starting example: a €1,000 computer, €150 of exposed costs, a 100% increase in that cost and 60% passed on to the buyer. All amounts exclude tax.',
    controls: 'Change the four assumptions', legend: 'Fictional inputs for the same computer configuration',
    fields: ['Initial computer price (€ excluding tax)', 'Initial exposed cost (€ excluding tax)', 'Increase in that cost (%)', 'Share passed on to the buyer (%)'],
    bounds: 'Initial price: €1 to €100,000. Exposed cost: €0 up to the initial price. Cost increase: 0% to 300%; share passed on: 0% to 100%. Up to two decimal places; decimal point or comma without thousands separators.',
    presets: 'Compare the share passed on', presetLabels: ['0% passed on', '60% passed on', '100% passed on'], reset: 'Restore fictional example',
    labels: ['Final price, excluding tax', 'Additional cost', 'Passed on to the buyer', 'Absorbed along the sales chain', 'Increase in the initial price'],
    method: 'Calculation and scope', formula: 'Final price = initial price + exposed initial cost × cost increase / 100 × share passed on / 100.',
    scope: 'All four inputs are fictional assumptions. The model holds the configuration, exchange rate, tax rate and all other costs constant. It does not estimate memory’s market share, actual computer-price inflation or the contribution of AI.',
    absorbed: 'Absorbed means the extra cost is not added to the buyer’s price. The model does not identify the company bearing it and does not calculate a profit margin. Inventories, contracts, promotions and timing remain outside this exercise.',
    rounding: 'Calculations retain their precision until display. Each amount is rounded independently to cents; displayed parts may differ by a cent when added.',
    privacy: 'Calculations run in this page. Inputs stay in memory while it is open.', nojs: 'The fictional starting example remains readable. JavaScript enables changes.',
    error: 'Enter four valid values within the limits. The exposed cost must be no greater than the initial price. Results remain unavailable until corrected.', unavailable: 'Unavailable', updated: 'Fictional scenario updated.',
  } : {
    eyebrow: 'PRIX DES ORDINATEURS / CALCULATEUR LOCAL', title: 'Simuler la transmission d’une hausse de coût',
    intro: 'Exemple fictif de départ : un ordinateur à 1 000 €, un coût exposé de 150 €, une hausse de ce coût de 100 % et 60 % transmis au client. Tous les montants sont hors taxes.',
    controls: 'Modifier les quatre hypothèses', legend: 'Paramètres fictifs, pour une même configuration',
    fields: ['Prix initial de l’ordinateur (€ HT)', 'Coût initial exposé (€ HT)', 'Hausse de ce coût (%)', 'Part transmise au client (%)'],
    bounds: 'Prix initial : de 1 à 100 000 €. Coût exposé : de 0 € au prix initial. Hausse du coût : de 0 % à 300 % ; part transmise : de 0 % à 100 %. Deux décimales au maximum ; point ou virgule, sans séparateur de milliers.',
    presets: 'Comparer la part transmise', presetLabels: ['0 % transmis', '60 % transmis', '100 % transmis'], reset: 'Rétablir l’exemple fictif',
    labels: ['Prix final hors taxes', 'Surcoût total', 'Transmis au client', 'Absorbé dans la chaîne de vente', 'Hausse du prix initial'],
    method: 'Calcul et périmètre', formula: 'Prix final = prix initial + coût initial exposé × hausse du coût / 100 × part transmise / 100.',
    scope: 'Les quatre paramètres sont des hypothèses fictives. La configuration, le change, le taux de taxe et tous les autres coûts restent fixes. Le modèle ne mesure ni la part moyenne de mémoire, ni la hausse réelle des prix des ordinateurs, ni la contribution de l’IA.',
    absorbed: 'Absorbé signifie que le surcoût est laissé hors du prix facturé au client. Le modèle n’identifie pas l’entreprise qui le supporte et ne calcule aucune marge bénéficiaire. Stocks, contrats, promotions et délais restent hors exercice.',
    rounding: 'Les calculs gardent leur précision jusqu’à l’affichage. Chaque montant est arrondi au centime séparément ; la somme des parts affichées peut donc différer d’un centime.',
    privacy: 'Les calculs restent dans cette page. Les valeurs sont conservées en mémoire pendant son ouverture.', nojs: 'L’exemple fictif initial reste lisible. JavaScript permet de modifier les hypothèses.',
    error: 'Saisissez quatre valeurs valides dans les limites. Le coût exposé doit rester inférieur ou égal au prix initial. Les résultats restent indisponibles jusqu’à correction.', unavailable: 'Indisponible', updated: 'Scénario fictif actualisé.',
  };
}
export function bindPcAiPriceCalculators(scope = document) {
  scope.querySelectorAll('[data-pc-ai-price-calculator]').forEach(root => {
    if (bound.has(root)) return;
    const lang = root.dataset.lang === 'en' ? 'en' : 'fr', copy = pcAiPriceCopy(lang);
    const form = root.querySelector('form'), fieldset = root.querySelector('fieldset'), error = root.querySelector('[data-error]'), status = root.querySelector('[data-status]');
    const fields = PC_AI_PRICE_FIELDS.map(key => form?.elements.namedItem(key));
    const outputs = [...root.querySelectorAll('[data-pc-price-output]')], presets = [...root.querySelectorAll('[data-pass-through]')];
    if (!form || !fieldset || !error || !status || fields.some(field => !field) || outputs.length !== 5 || presets.length !== 3) return;
    bound.add(root);
    function update() {
      try {
        const result = calculatePcAiPrice(Object.fromEntries(PC_AI_PRICE_FIELDS.map((key, i) => [key, fields[i].value])));
        outputs.forEach(output => {
          const key = output.dataset.pcPriceOutput;
          if (key === 'relative') output.textContent = formatPcAiPricePercent(result.increaseNumerator, result.increaseDenominator, lang);
          else if (['finalPrice', 'shock', 'passed', 'absorbed'].includes(key)) output.textContent = formatPcAiPriceMoney(result[key], lang);
          else throw new RangeError('Unknown result field');
        });
        fields.forEach(field => field.setAttribute('aria-invalid', 'false'));
        presets.forEach(button => button.setAttribute('aria-pressed', String(parsePcAiPriceQuantity(fields[3].value, 'passThrough') === parsePcAiPriceQuantity(button.dataset.passThrough, 'passThrough'))));
        error.hidden = true; error.textContent = ''; status.textContent = `${copy.updated} ${copy.labels[0]} : ${formatPcAiPriceMoney(result.finalPrice, lang)}`;
      } catch {
        fields.forEach(field => field.setAttribute('aria-invalid', 'true')); outputs.forEach(output => { output.textContent = copy.unavailable; });
        presets.forEach(button => button.setAttribute('aria-pressed', 'false'));
        error.hidden = false; error.textContent = copy.error; status.textContent = copy.error;
      }
    }
    form.addEventListener('input', update); form.addEventListener('change', update); form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', event => { event.preventDefault(); fields.forEach((field, i) => { field.value = PC_AI_PRICE_DEFAULTS[PC_AI_PRICE_FIELDS[i]]; }); update(); });
    presets.forEach(button => button.addEventListener('click', () => { fields[3].value = button.dataset.passThrough; update(); }));
    fieldset.disabled = false; update();
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bindPcAiPriceCalculators(), { once: true }); else bindPcAiPriceCalculators();
  document.addEventListener('astro:page-load', () => bindPcAiPriceCalculators());
}
