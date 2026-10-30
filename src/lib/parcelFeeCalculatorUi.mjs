import { PARCEL_FEE_FIELDS, PARCEL_FEE_DEFAULTS, calculateParcelFee, parseParcelFeeQuantity, formatParcelFeeMoney } from './parcelFeeCalculator.mjs';
const bound = new WeakSet();
export function parcelFeeCopy(lang) {
  if (!['fr', 'en'].includes(lang)) throw new RangeError('Supported language required');
  return lang === 'en' ? {
    eyebrow: 'IMPORTED ONLINE ORDERS / LOCAL CALCULATOR', title: 'Simulate who bears the new handling fee',
    intro: 'Fictional starting example: €20 before VAT, two assumed taxable declaration lines, half of the new fee passed on, and an assumed 20% VAT rate. The starting price including VAT is €24.',
    controls: 'Change the four assumptions', legend: 'Fictional parameters with VAT collected at sale',
    fields: ['Initial basket price (€ excluding VAT)', 'Assumed taxable declaration lines', 'Share passed on to the buyer (%)', 'Assumed VAT rate (%)'],
    bounds: 'Initial price: €1 to €100,000. Lines: an integer from 0 to 1,000. Share passed on: 0% to 100%; assumed VAT: 0% to 30%. Up to two decimal places, except for the integer line count; decimal point or comma, without thousands separators.',
    presets: 'Compare the share passed on', presetLabels: ['0% passed on', '50% passed on', '100% passed on'], reset: 'Restore fictional example',
    labels: ['Final price including VAT', 'Initial price including VAT', 'New fee, excluding VAT', 'Passed on, excluding VAT', 'Absorbed by the seller', 'Additional VAT', 'Buyer’s total increase'],
    method: 'Calculation and scope', formula: 'New fee = €2 × assumed taxable lines. Final price including VAT = (initial price excluding VAT + new fee × share passed on / 100) × (1 + VAT rate / 100).',
    scope: 'The model isolates the additional handling fee applying from 1 November 2026. The earlier €3 duty and other costs are already included in the starting price and held constant. Inputs are assumptions, not observed pass-through rates or retail forecasts.',
    tax: 'Only a VAT-at-sale example in which the amount charged on enters the taxable consideration is shown. The model determines no tariff classification, taxable-line grouping, intrinsic value, IOSS eligibility, exemption or actual customs liability. Import-VAT collection regimes are outside this simulation.',
    absorbed: 'The unpassed portion is borne by the seller in this simplified example. Inventory, promotions, quantities and all other selling conditions remain fixed. Private carrier charges are excluded.',
    rounding: 'Calculations retain precision until display. Each amount is rounded independently to cents; displayed parts may differ by a cent when added.',
    privacy: 'Calculations run in this page. Inputs stay in memory while it is open.', nojs: 'The fictional starting example remains readable. JavaScript enables changes.',
    error: 'Enter four valid values within the limits. The number of lines must be an integer. Results remain unavailable until corrected.', unavailable: 'Unavailable', updated: 'Fictional scenario updated.',
  } : {
    eyebrow: 'ACHATS IMPORTÉS EN LIGNE / CALCULATEUR LOCAL', title: 'Simuler le partage des nouveaux frais de traitement',
    intro: 'Exemple fictif de départ : panier de 20 € HT, deux lignes douanières supposées assujetties, moitié des nouveaux frais transmise au client et TVA supposée de 20 %. Le prix initial TTC est de 24 €.',
    controls: 'Modifier les quatre hypothèses', legend: 'Paramètres fictifs, avec TVA collectée à la vente',
    fields: ['Prix initial du panier (€ HT)', 'Lignes douanières supposées assujetties', 'Part transmise au client (%)', 'Taux de TVA supposé (%)'],
    bounds: 'Prix initial : de 1 à 100 000 €. Lignes : entier de 0 à 1 000. Part transmise : de 0 % à 100 % ; TVA supposée : de 0 % à 30 %. Deux décimales au maximum, sauf pour le nombre entier de lignes ; point ou virgule, sans séparateur de milliers.',
    presets: 'Comparer la part transmise', presetLabels: ['0 % transmis', '50 % transmis', '100 % transmis'], reset: 'Rétablir l’exemple fictif',
    labels: ['Prix final TTC', 'Prix initial TTC', 'Nouveaux frais hors TVA', 'Transmis au client hors TVA', 'Absorbé par le vendeur', 'TVA supplémentaire', 'Supplément total du client'],
    method: 'Calcul et périmètre', formula: 'Nouveaux frais = 2 € × lignes supposées assujetties. Prix final TTC = (prix initial HT + nouveaux frais × part transmise / 100) × (1 + taux de TVA / 100).',
    scope: 'Le modèle isole le supplément de frais de traitement applicable à partir du 1er novembre 2026. Le droit antérieur de 3 € et les autres coûts sont déjà compris dans le prix initial et restent fixes. Les paramètres sont des hypothèses, distinctes des taux de transmission observés ou des prévisions de prix.',
    tax: 'L’exemple retient uniquement une TVA collectée à la vente, lorsque le montant refacturé entre dans la contrepartie taxable. Le modèle ne détermine ni classement tarifaire, ni regroupement des lignes, ni valeur intrinsèque, ni admissibilité IOSS, ni exonération ou dette douanière réelle. Les régimes de TVA collectée à l’importation restent hors simulation.',
    absorbed: 'La part non transmise reste à la charge du vendeur dans cet exemple simplifié. Stocks, promotions, quantités et autres conditions de vente restent fixes. Les frais privés des transporteurs sont exclus.',
    rounding: 'Les calculs gardent leur précision jusqu’à l’affichage. Chaque montant est arrondi au centime séparément ; la somme des parts affichées peut donc différer d’un centime.',
    privacy: 'Les calculs restent dans cette page. Les valeurs sont conservées en mémoire pendant son ouverture.', nojs: 'L’exemple fictif initial reste lisible. JavaScript permet de modifier les hypothèses.',
    error: 'Saisissez quatre valeurs valides dans les limites. Le nombre de lignes doit être entier. Les résultats restent indisponibles jusqu’à correction.', unavailable: 'Indisponible', updated: 'Scénario fictif actualisé.',
  };
}
export function bindParcelFeeCalculators(scope = document) {
  scope.querySelectorAll('[data-parcel-fee-calculator]').forEach(root => {
    if (bound.has(root)) return;
    const lang = root.dataset.lang === 'en' ? 'en' : 'fr', copy = parcelFeeCopy(lang);
    const form = root.querySelector('form'), fieldset = root.querySelector('fieldset'), error = root.querySelector('[data-error]'), status = root.querySelector('[data-status]');
    const fields = PARCEL_FEE_FIELDS.map(key => form?.elements.namedItem(key));
    const outputs = [...root.querySelectorAll('[data-parcel-fee-output]')], presets = [...root.querySelectorAll('[data-pass-through]')];
    if (!form || !fieldset || !error || !status || fields.some(field => !field) || outputs.length !== 7 || presets.length !== 3) return;
    bound.add(root);
    function update() {
      try {
        const result = calculateParcelFee(Object.fromEntries(PARCEL_FEE_FIELDS.map((key, i) => [key, fields[i].value])));
        outputs.forEach(output => {
          const key = output.dataset.parcelFeeOutput;
          if (!['finalInclVat', 'initialInclVat', 'fee', 'passed', 'absorbed', 'additionalVat', 'customerIncrease'].includes(key)) throw new RangeError('Unknown result field');
          output.textContent = formatParcelFeeMoney(result[key], lang);
        });
        fields.forEach(field => field.setAttribute('aria-invalid', 'false'));
        presets.forEach(button => button.setAttribute('aria-pressed', String(parseParcelFeeQuantity(fields[2].value, 'passThrough') === parseParcelFeeQuantity(button.dataset.passThrough, 'passThrough'))));
        error.hidden = true; error.textContent = ''; status.textContent = `${copy.updated} ${copy.labels[0]} : ${formatParcelFeeMoney(result.finalInclVat, lang)}`;
      } catch {
        fields.forEach(field => field.setAttribute('aria-invalid', 'true')); outputs.forEach(output => { output.textContent = copy.unavailable; }); presets.forEach(button => button.setAttribute('aria-pressed', 'false'));
        error.hidden = false; error.textContent = copy.error; status.textContent = copy.error;
      }
    }
    form.addEventListener('input', update); form.addEventListener('change', update); form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', event => { event.preventDefault(); fields.forEach((field, i) => { field.value = PARCEL_FEE_DEFAULTS[PARCEL_FEE_FIELDS[i]]; }); update(); });
    presets.forEach(button => button.addEventListener('click', () => { fields[2].value = button.dataset.passThrough; update(); }));
    fieldset.disabled = false; update();
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bindParcelFeeCalculators(), { once: true }); else bindParcelFeeCalculators();
  document.addEventListener('astro:page-load', () => bindParcelFeeCalculators());
}
