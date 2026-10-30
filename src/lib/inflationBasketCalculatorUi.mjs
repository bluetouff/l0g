import { INFLATION_BASKET_CATEGORIES, INFLATION_BASKET_DEFAULTS, INFLATION_BASKET_PRESETS, calculateInflationBasket, parseInflationBasketAmount, formatInflationBasketMoney, formatInflationBasketPercent } from './inflationBasketCalculator.mjs';
const bound = new WeakSet();
export function inflationBasketCopy(lang) {
  if (!['fr', 'en'].includes(lang)) throw new RangeError('Supported language required');
  return lang === 'en' ? {
    eyebrow: 'PRICES AND HOUSEHOLD BUDGETS / LOCAL CALCULATOR', title: 'Compare five-category baskets',
    intro: 'Constructed starting basket: €2,000 at December 2025 conditions, using national 2026 weights as a conventional composition. Applying definitive September 2026 indices gives €2,062.44. Change the starting amounts to explore the weighting mechanism.',
    controls: 'Change the five starting amounts', legend: 'Chosen amounts in euros, at December 2025 conditions',
    categories: ['Food', 'Tobacco', 'Manufactured goods', 'Energy', 'Services'],
    bounds: 'Each amount: €0 to €1,000,000, with up to two decimal places. Use a point or comma, without thousands separators. The comparison always covers December 2025 to September 2026: nine months, without annualisation.',
    presets: 'Three constructed €2,000 starting baskets', presetLabels: ['2026 benchmark', '20% energy', '30% food'], reset: 'Restore the benchmark',
    totals: ['Starting basket', 'Comparative cost', 'Cost difference', 'Calculated change'], detail: 'Category breakdown', rowLabels: ['Starting share', 'Comparative cost', 'Contribution to the change'],
    empty: 'Zero basket: cost totals are zero and percentage changes, shares and contributions are unavailable. Enter a positive amount to explore a comparison.',
    ready: 'A comparison of unchanged quantities and broad national categories; it is not an official individual inflation rate.',
    method: 'Calculation and scope',
    formula: 'Each starting amount is multiplied by its category’s September 2026 index divided by its December 2025 index. Every category cost is rounded to the nearest cent, half up, before summation. Shares and percentage-point contributions use those rounded costs. Independently rounded percentages can differ slightly when added.',
    scope: 'These are fictional five-category baskets. Each category retains its national internal composition. Energy combines heating and fuels; services combine rent with other services. Savings, property purchases, loan repayments and direct taxes remain outside this consumption basket. It does not estimate income or purchasing power.',
    source: 'Source: Insee CPI, base 2025, France, all households, unadjusted; definitive December 2025 and September 2026 levels, checked on 30 October 2026.',
    privacy: 'All calculations run in this page. Inputs remain in memory while it is open.', nojs: 'The starting example remains readable; JavaScript enables changes.',
    error: 'Enter five valid euro amounts within the limits. Results stay unavailable until all fields are corrected.', unavailable: 'Unavailable', updated: 'Constructed basket updated.',
  } : {
    eyebrow: 'PRIX ET BUDGET DES MÉNAGES / CALCULATEUR LOCAL', title: 'Comparer des paniers à cinq postes',
    intro: 'Panier de départ construit : 2 000 € aux conditions de décembre 2025, avec les proportions nationales 2026 comme composition conventionnelle. Les indices définitifs de septembre 2026 donnent 2 062,44 €. Modifiez les montants de départ pour examiner l’effet des pondérations.',
    controls: 'Modifier les cinq montants de départ', legend: 'Montants choisis en euros, aux conditions de décembre 2025',
    categories: ['Alimentation', 'Tabac', 'Produits manufacturés', 'Énergie', 'Services'],
    bounds: 'Chaque montant : de 0 € à 1 000 000 €, avec deux décimales au maximum. Point ou virgule, sans séparateur de milliers. La comparaison reste fixée de décembre 2025 à septembre 2026 : neuf mois, sans annualisation.',
    presets: 'Trois paniers de départ construits de 2 000 €', presetLabels: ['Repère 2026', 'Énergie à 20 %', 'Alimentation à 30 %'], reset: 'Rétablir le repère',
    totals: ['Panier initial', 'Coût comparatif', 'Écart de coût', 'Variation calculée'], detail: 'Détail par catégorie', rowLabels: ['Part initiale', 'Coût comparatif', 'Contribution à la variation'],
    empty: 'Panier nul : les coûts sont nuls et les variations en pourcentage, parts et contributions sont indisponibles. Saisissez un montant positif pour examiner une comparaison.',
    ready: 'Une comparaison à quantités et grandes catégories nationales constantes, distincte d’un taux officiel d’inflation individuel.',
    method: 'Calcul et périmètre',
    formula: 'Chaque montant initial est multiplié par le rapport entre l’indice de septembre 2026 et celui de décembre 2025 de sa catégorie. Chaque coût est arrondi au centime le plus proche, à la hausse en cas d’égalité, avant sommation. Les parts et contributions en points utilisent ces coûts arrondis. Les pourcentages arrondis séparément peuvent légèrement différer à l’addition.',
    scope: 'Les cinq postes composent des paniers fictifs. Chaque catégorie conserve sa composition nationale interne. L’énergie regroupe chauffage et carburants ; les services, loyers et autres consommations. Épargne, achat immobilier, remboursements d’emprunt et impôts directs restent hors de ce panier de consommation. Le revenu et le pouvoir d’achat demandent une analyse distincte.',
    source: 'Source : IPC Insee, base 2025, France, ensemble des ménages, non corrigé ; niveaux définitifs de décembre 2025 et septembre 2026, vérifiés le 30 octobre 2026.',
    privacy: 'Les calculs restent dans cette page. Les montants sont gardés en mémoire pendant son ouverture.', nojs: 'L’exemple initial reste lisible ; JavaScript permet de modifier les montants.',
    error: 'Saisissez cinq montants en euros valides dans les limites. Les résultats restent indisponibles jusqu’à correction de tous les champs.', unavailable: 'Indisponible', updated: 'Panier construit actualisé.',
  };
}
export function bindInflationBasketCalculators(scope = document) {
  scope.querySelectorAll('[data-inflation-basket-calculator]').forEach(root => {
    if (bound.has(root)) return;
    const lang = root.dataset.lang === 'en' ? 'en' : 'fr', copy = inflationBasketCopy(lang), form = root.querySelector('form'), fieldset = root.querySelector('fieldset'), error = root.querySelector('[data-error]'), status = root.querySelector('[data-status]'), note = root.querySelector('[data-basket-note]');
    const fields = INFLATION_BASKET_CATEGORIES.map(row => form?.elements.namedItem(row.key)), outputs = [...root.querySelectorAll('output')], presets = [...root.querySelectorAll('[data-basket-preset]')];
    if (!form || !fieldset || !error || !status || !note || fields.some(field => !field) || outputs.length !== 19 || presets.length !== 3) return;
    bound.add(root);
    function update() {
      try {
        const input = Object.fromEntries(INFLATION_BASKET_CATEGORIES.map((row, i) => [row.key, fields[i].value])), result = calculateInflationBasket(input);
        outputs.forEach(output => {
          const totalKey = output.dataset.basketTotal, rowKey = output.dataset.basketCategory, metric = output.dataset.basketMetric;
          if (['initial', 'comparative', 'difference', 'change'].includes(totalKey)) output.textContent = totalKey === 'change' ? formatInflationBasketPercent(result.change, lang) : formatInflationBasketMoney(result[totalKey], lang);
          else {
            const row = result.rows.find(item => item.key === rowKey);
            if (!row || !['share', 'comparative', 'contribution'].includes(metric)) throw new RangeError('Unknown result field');
            output.textContent = metric === 'comparative' ? formatInflationBasketMoney(row.comparative, lang) : formatInflationBasketPercent(row[metric], lang, metric === 'contribution');
          }
        });
        presets.forEach(button => { const p = INFLATION_BASKET_PRESETS[button.dataset.basketPreset]; button.setAttribute('aria-pressed', String(Boolean(p) && INFLATION_BASKET_CATEGORIES.every((row, i) => parseInflationBasketAmount(fields[i].value) === parseInflationBasketAmount(p[row.key])))); });
        fields.forEach(field => field.setAttribute('aria-invalid', 'false')); error.hidden = true; error.textContent = ''; note.textContent = result.empty ? copy.empty : copy.ready; status.textContent = `${copy.updated} ${copy.totals[1]} : ${formatInflationBasketMoney(result.comparative, lang)}`;
      } catch {
        fields.forEach(field => field.setAttribute('aria-invalid', 'true')); outputs.forEach(output => { output.textContent = copy.unavailable; }); presets.forEach(button => button.setAttribute('aria-pressed', 'false')); note.textContent = ''; error.hidden = false; error.textContent = copy.error; status.textContent = copy.error;
      }
    }
    form.addEventListener('input', update); form.addEventListener('change', update); form.addEventListener('submit', event => event.preventDefault());
    function setPreset(preset) { fields.forEach((field, i) => { field.value = preset[INFLATION_BASKET_CATEGORIES[i].key]; }); update(); }
    form.addEventListener('reset', event => { event.preventDefault(); setPreset(INFLATION_BASKET_DEFAULTS); });
    presets.forEach(button => button.addEventListener('click', () => { const preset = INFLATION_BASKET_PRESETS[button.dataset.basketPreset]; if (preset) setPreset(preset); }));
    fieldset.disabled = false; update();
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bindInflationBasketCalculators(), { once: true }); else bindInflationBasketCalculators();
  document.addEventListener('astro:page-load', () => bindInflationBasketCalculators());
}
