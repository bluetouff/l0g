import { CLOUDFLARE_REVENUE_FIELDS, CLOUDFLARE_REVENUE_DEFAULTS, CLOUDFLARE_REVENUE_RESULTS, CLOUDFLARE_REVENUE_PRESETS, parseCloudflareRevenueValue, calculateCloudflareRevenue, cloudflareRevenueDisplay } from './cloudflareRevenueModel.mjs';
const bound = new WeakSet();
export function cloudflareRevenueCopy(lang) {
  if (!['fr', 'en'].includes(lang)) throw new RangeError('Supported language required');
  return lang === 'fr' ? {
    eyebrow: 'CLOUDFLARE / ATELIER DE REVENUS', title: 'Comparer le revenu des usages à une perte de visites',
    intro: 'Explorez deux contributions sur un même mois fictif, en dollars américains. Chaque réglage est une hypothèse pédagogique indépendante des tarifs et revenus réels de Cloudflare.',
    controls: 'Modifier les sept hypothèses', legend: 'Un mois fictif, des volumes constants',
    labels: ['Usages potentiels par mois', 'Part couverte et facturable (%)', 'Prix par usage facturable ($US)', 'Déductions agrégées (%)', 'Coûts mensuels additionnels ($US)', 'Visites humaines perdues, scénario', 'Contribution nette pour 1 000 visites ($US)'],
    help: ['De 0 à 1 000 milliards d’usages, entiers. Le volume décrit des usages possibles du contenu.', 'De 0 à 100 %, par pas de 0,1 point. Participation, périmètre contractuel, déclaration et validation sont regroupés.', 'De 0 à 100 $US, six décimales au maximum. Le prix initial de 0,002 $US est fictif.', 'De 0 à 100 %, par pas de 0,1 point. Les 10 % initiaux sont une hypothèse de retenues, distincte d’une commission annoncée.', 'De 0 à 1 milliard de dollars, deux décimales au maximum. Suivi et intégration supposés.', 'De 0 à 1 000 milliards de visites, entières. Cette perte est une hypothèse, sans attribution causale à l’IA.', 'De 0 à 100 000 $US pour mille visites, deux décimales au maximum. Visites et pages vues gardent des périmètres distincts.'],
    presetLabel: 'Explorer la couverture', presets: ['Couverture de 5 %', 'Couverture de 20 %', 'Couverture de 50 %'], reset: 'Rétablir l’exemple',
    initial: 'SCÉNARIO PÉDAGOGIQUE : un million d’usages possibles, 20 % couverts, 0,002 $US par usage, 10 % de déductions et 100 $US de coûts. La référence suppose 50 000 visites perdues à 10 $US pour mille visites.',
    scenario: 'SCÉNARIO PÉDAGOGIQUE : les résultats appliquent vos sept hypothèses au même mois et à la même devise.',
    resultLabels: ['Usages facturables attendus', 'Recette brute', 'Recette après déductions', 'Contribution des usages avant fiscalité', 'Référence des visites humaines', 'Écart à la référence', 'Prix nécessaire à couverture inchangée', 'Couverture nécessaire à prix inchangé'],
    results: 'Détail des recettes et des seuils',
    statuses: { below: 'La contribution des usages reste inférieure à la référence des visites dans ce scénario.', equal: 'Les deux contributions sont égales dans ce scénario.', above: 'La contribution des usages dépasse la référence des visites dans ce scénario.' },
    coverage: { undefined: 'La cible positive et la base de recettes nulle ne permettent aucun seuil fini à prix inchangé.', unreachable: 'Le seuil dépasse 100 % des usages possibles : atteindre la cible demande d’ajuster le prix, le volume ou les autres hypothèses.', reachable: 'Le seuil de couverture est compris entre 0 et 100 % des usages possibles.' },
    method: 'Calcul et périmètre',
    equations: ['N = U × a × p × (1 − f) − K', 'H = L × r / 1 000', 'p* = (H + K) / [U × a × (1 − f)]', 'a* = (H + K) / [U × p × (1 − f)]'],
    methodText: 'U désigne les usages possibles, a la part couverte, p le prix, f les déductions et K les coûts additionnels. L et r définissent la référence de visites H. Les pourcentages sont convertis en fractions pour le calcul. Un objectif et des coûts nuls donnent un seuil de zéro ; une cible positive avec une base nulle laisse le seuil indéfini.',
    limits: 'Le taux de couverture agrège plusieurs filtres commerciaux et techniques ; il ne mesure pas la fraude. Les volumes restent constants quand le prix change. La réaction des acheteurs, la fiscalité et les délais d’encaissement restent hors du modèle. Les résultats sont des contributions mensuelles hypothétiques, avant fiscalité. Le signe ≈ indique un arrondi ; les très petits montants restent visibles en notation scientifique.',
    source: 'Cloudflare, Pay Per Use, annonce du 30 septembre 2026', privacy: 'Le calcul s’effectue sur votre appareil, dans cette page. Les réglages restent en mémoire pendant son ouverture.',
    nojs: 'Le scénario initial et ses résultats sont disponibles. JavaScript active les réglages.', error: 'Renseignez les sept hypothèses dans les limites indiquées et corrigez les champs signalés. Les résultats seront rétablis après correction.', unavailable: 'Indisponible', updated: 'Scénario hypothétique recalculé.'
  } : {
    eyebrow: 'CLOUDFLARE / REVENUE WORKSHOP', title: 'Compare usage revenue with a traffic-loss scenario',
    intro: 'Explore two contributions for the same fictional month, in US dollars. Every input is a teaching assumption separate from Cloudflare’s actual prices and revenues.',
    controls: 'Change the seven assumptions', legend: 'One fictional month, with volumes held constant',
    labels: ['Potential uses per month', 'Covered and billable share (%)', 'Price per billable use (USD)', 'Aggregate deductions (%)', 'Additional monthly costs (USD)', 'Lost human visits, assumed', 'Net contribution per 1,000 visits (USD)'],
    help: ['From 0 to 1 trillion whole uses. The volume describes possible uses of the content.', 'From 0 to 100%, in 0.1-point steps. Participation, contractual scope, reporting and validation are combined.', 'From 0 to USD100, with at most six decimals. The initial USD0.002 price is fictional.', 'From 0 to 100%, in 0.1-point steps. The initial 10% is an assumed deduction, separate from any announced commission.', 'From 0 to USD1 billion, with at most two decimals. Assumed integration and monitoring costs.', 'From 0 to 1 trillion whole visits. This loss is assumed, with no causal attribution to AI.', 'From 0 to USD100,000 per thousand visits, with at most two decimals. Visits and page views retain separate scopes.'],
    presetLabel: 'Explore coverage', presets: ['5% coverage', '20% coverage', '50% coverage'], reset: 'Restore the example',
    initial: 'TEACHING SCENARIO: one million possible uses, 20% covered, USD0.002 per use, 10% deductions and USD100 in costs. The benchmark assumes 50,000 lost visits contributing USD10 per thousand visits.',
    scenario: 'TEACHING SCENARIO: results apply your seven assumptions to the same month and currency.',
    resultLabels: ['Expected billable uses', 'Gross revenue', 'Revenue after deductions', 'Usage contribution before tax', 'Human-visit benchmark', 'Gap against the benchmark', 'Required price at unchanged coverage', 'Required coverage at unchanged price'],
    results: 'Revenue and threshold details',
    statuses: { below: 'Usage contribution remains below the visit benchmark in this scenario.', equal: 'The two contributions are equal in this scenario.', above: 'Usage contribution exceeds the visit benchmark in this scenario.' },
    coverage: { undefined: 'A positive target with a zero revenue base has no finite threshold at the unchanged price.', unreachable: 'The threshold exceeds 100% of possible uses: reaching the target requires changing other assumptions.', reachable: 'The coverage threshold falls between 0 and 100% of possible uses.' },
    method: 'Calculation and scope',
    equations: ['N = U × a × p × (1 − f) − K', 'H = L × r / 1,000', 'p* = (H + K) / [U × a × (1 − f)]', 'a* = (H + K) / [U × p × (1 − f)]'],
    methodText: 'U is possible uses, a the covered share, p the price, f deductions and K additional costs. L and r define the visit benchmark H. Percentages become fractions for the calculation. A zero target and zero costs give a threshold of zero; a positive target with a zero base leaves the threshold undefined.',
    limits: 'Coverage combines several commercial and technical filters; it does not measure fraud. Volumes stay constant as the price changes. Buyer responses, taxation and payment timing remain outside the model. Outputs are hypothetical monthly contributions before tax. The ≈ sign indicates rounding; very small amounts remain visible in scientific notation.',
    source: 'Cloudflare, Pay Per Use, 30 September 2026 announcement', privacy: 'Calculations run on your device in this page. Settings remain in memory while it is open.',
    nojs: 'The initial scenario and results remain available. JavaScript enables changes.', error: 'Enter all seven assumptions within their stated bounds and correct the marked fields. Results will return after correction.', unavailable: 'Unavailable', updated: 'Hypothetical scenario recalculated.'
  };
}
export function bindCloudflareRevenueCalculators(scope = document) {
  scope.querySelectorAll('[data-cloudflare-revenue-root]').forEach(root => {
    if (bound.has(root) || !['fr', 'en'].includes(root.dataset.cloudflareRevenueLang)) return;
    const lang = root.dataset.cloudflareRevenueLang, copy = cloudflareRevenueCopy(lang), form = root.querySelector('form'), fieldset = root.querySelector('fieldset');
    const inputs = CLOUDFLARE_REVENUE_FIELDS.map(field => form?.elements.namedItem(field));
    const outputs = [...root.querySelectorAll('[data-cloudflare-revenue-result]')], presets = [...root.querySelectorAll('[data-cloudflare-revenue-preset]')];
    const error = root.querySelector('[data-error]'), status = root.querySelector('[data-status]'), scenario = root.querySelector('[data-scenario]'), classification = root.querySelector('[data-cloudflare-revenue-status]'), coverage = root.querySelector('[data-cloudflare-revenue-coverage]');
    if (!form || !fieldset || inputs.some(input => !input) || outputs.length !== CLOUDFLARE_REVENUE_RESULTS.length || presets.length !== CLOUDFLARE_REVENUE_PRESETS.length || !error || !status || !scenario || !classification || !coverage) return;
    if (new Set(outputs.map(output => output.dataset.cloudflareRevenueResult)).size !== CLOUDFLARE_REVENUE_RESULTS.length || new Set(presets.map(button => button.dataset.cloudflareRevenuePreset)).size !== CLOUDFLARE_REVENUE_PRESETS.length || outputs.some(output => !CLOUDFLARE_REVENUE_RESULTS.includes(output.dataset.cloudflareRevenueResult)) || presets.some(button => !CLOUDFLARE_REVENUE_PRESETS.includes(button.dataset.cloudflareRevenuePreset))) return;
    bound.add(root);
    function update() {
      const raw = Object.fromEntries(CLOUDFLARE_REVENUE_FIELDS.map((field, i) => [field, inputs[i].value]));
      try {
        const result = calculateCloudflareRevenue(raw);
        outputs.forEach(output => { output.textContent = cloudflareRevenueDisplay(result, output.dataset.cloudflareRevenueResult, lang); });
        classification.textContent = copy.statuses[result.status]; coverage.textContent = copy.coverage[result.coverageStatus];
        scenario.textContent = CLOUDFLARE_REVENUE_FIELDS.every(field => raw[field] === CLOUDFLARE_REVENUE_DEFAULTS[field]) ? copy.initial : copy.scenario;
        inputs.forEach(input => input.setAttribute('aria-invalid', 'false')); error.hidden = true; error.textContent = ''; root.dataset.valid = 'true';
        status.textContent = `${copy.updated} ${copy.resultLabels[3]} : ${cloudflareRevenueDisplay(result, 'net', lang)}. ${copy.resultLabels[5]} : ${cloudflareRevenueDisplay(result, 'gap', lang)}.`;
      } catch {
        outputs.forEach(output => { output.textContent = copy.unavailable; }); classification.textContent = copy.unavailable; coverage.textContent = copy.unavailable; scenario.textContent = copy.unavailable; root.dataset.valid = 'false';
        inputs.forEach((input, i) => { let valid = true; try { parseCloudflareRevenueValue(CLOUDFLARE_REVENUE_FIELDS[i], input.value); } catch { valid = false; } input.setAttribute('aria-invalid', valid ? 'false' : 'true'); });
        error.hidden = false; error.textContent = copy.error; status.textContent = copy.error;
      }
    }
    form.addEventListener('input', update); form.addEventListener('change', update); form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', event => { event.preventDefault(); inputs.forEach((input, i) => { input.value = CLOUDFLARE_REVENUE_DEFAULTS[CLOUDFLARE_REVENUE_FIELDS[i]]; }); update(); });
    presets.forEach(button => button.addEventListener('click', () => { inputs[1].value = button.dataset.cloudflareRevenuePreset; update(); }));
    update(); fieldset.disabled = false;
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bindCloudflareRevenueCalculators(), { once: true });
  else bindCloudflareRevenueCalculators();
}
