import { TEMPO_DEFAULTS, TEMPO_VOLUME_FIELDS, calculateTempoBill, formatTempoMoney, formatTempoEnergy } from './tempoBillCalculator.mjs';
export const TEMPO_OUTPUT_FIELDS = Object.freeze(['tempoBefore', 'tempoAfter', 'saving', 'variable', 'subscription', 'totalWh', 'redPeakCost', 'redEnergyShare', 'redCostShare', 'redPeakAfterWh', 'redOffPeakAfterWh', 'base', 'baseDifference']);
const bound = new WeakSet();
export function tempoBillCopy(lang) {
  return lang === 'en' ? {
    eyebrow: 'ELECTRICITY / LOCAL CALCULATOR', title: 'Measure the weight of red peak hours',
    intro: 'Fictional starting point: 8 peak kWh and 4 off-peak kWh every day, for 365 days. EDF prices stay fixed at 1 August 2026, including taxes.',
    controls: 'Change annual volumes and shift red peak use', legend: 'Annual consumption, in kWh',
    fields: ['Blue peak', 'Blue off-peak', 'White peak', 'White off-peak', 'Red peak', 'Red off-peak'],
    capacity: 'Subscribed capacity', shift: 'Shift red peak to red off-peak (kWh)',
    bounds: 'Each volume: 0 to 200,000 kWh, up to three decimal places. Use a decimal point or comma, without thousands separators. The shift must fit within entered red peak consumption.',
    labels: ['Tempo before shift', 'Tempo after shift', 'Saving from shift', 'Energy charge before shift', 'Subscription, 12 months', 'Total energy, conserved', 'Red peak charge before shift', 'Red peak share of energy', 'Red peak share of energy charge', 'Red peak after shift', 'Red off-peak after shift', 'Base 6 kVA comparison', 'Base less Tempo after shift'],
    comparison: 'Base comparison is available at 6 kVA. Base at 9 kVA is closed to new subscriptions.',
    scope: 'Six annual volumes × their energy prices, plus twelve published rounded monthly subscriptions. The Base comparison uses the same total kWh, €0.2001/kWh and 12 × €15.86. A shift conserves energy and the subscription; equipment losses, comfort, practical feasibility, special surcharges and future price changes fall outside this calculation.',
    share: 'Energy-charge shares exclude the subscription. Zero denominators display “Unavailable”. Each monetary result is calculated exactly, then rounded to cents independently.',
    privacy: 'Calculations stay in this page. Values remain in memory while it is open.',
    reset: 'Restore fictional example', nojs: 'The initial scenario stays readable. JavaScript enables changes.',
    error: 'Enter quantities within the limits and a shift no greater than red peak consumption. Results remain unavailable until corrected.',
    unavailable: 'Unavailable', updated: 'Scenario updated.', method: 'Method and scope', reference: 'EDF price schedule, effective 1 August 2026',
  } : {
    eyebrow: 'ÉLECTRICITÉ / CALCULATEUR LOCAL', title: 'Mesurer le poids des heures pleines rouges',
    intro: 'Point de départ fictif : 8 kWh pleins et 4 kWh creux chaque jour, pendant 365 jours. Prix EDF maintenus au 1er août 2026, toutes taxes comprises.',
    controls: 'Modifier les volumes annuels et le report rouge', legend: 'Consommation annuelle, en kWh',
    fields: ['Bleu plein', 'Bleu creux', 'Blanc plein', 'Blanc creux', 'Rouge plein', 'Rouge creux'],
    capacity: 'Puissance souscrite', shift: 'Reporter les HP rouges vers les HC rouges (kWh)',
    bounds: 'Chaque volume : de 0 à 200 000 kWh, trois décimales au maximum. Point ou virgule décimale, sans séparateur de milliers. Le report doit tenir dans les heures pleines rouges saisies.',
    labels: ['Tempo avant report', 'Tempo après report', 'Économie du report', 'Énergie facturée avant report', 'Abonnement, 12 mois', 'Énergie totale, conservée', 'Coût des HP rouges avant report', 'Part des HP rouges dans l’énergie', 'Part des HP rouges dans le coût d’énergie', 'HP rouges après report', 'HC rouges après report', 'Comparatif Base 6 kVA', 'Base moins Tempo après report'],
    comparison: 'Le comparatif Base est disponible à 6 kVA. L’option Base à 9 kVA est en extinction.',
    scope: 'Six volumes annuels × leur prix d’énergie, plus douze abonnements mensuels publiés et arrondis. Le comparatif Base reprend le même total de kWh, 0,2001 €/kWh et 12 × 15,86 €. Le report conserve l’énergie et l’abonnement ; pertes d’équipement, confort, faisabilité, majorations particulières et futurs prix restent hors calcul.',
    share: 'Les parts du coût d’énergie excluent l’abonnement. Un dénominateur nul affiche « Indisponible ». Chaque montant est calculé exactement, puis arrondi au centime séparément.',
    privacy: 'Calculs dans cette page. Les valeurs restent en mémoire pendant son ouverture.',
    reset: 'Rétablir l’exemple fictif', nojs: 'Le scénario initial reste lisible. JavaScript permet de modifier les hypothèses.',
    error: 'Saisissez des volumes dans les limites et un report inférieur ou égal aux HP rouges. Les résultats restent indisponibles jusqu’à correction.',
    unavailable: 'Indisponible', updated: 'Scénario actualisé.', method: 'Méthode et périmètre', reference: 'Grille EDF applicable au 1er août 2026',
  };
}
export function tempoOutputText(key, value, lang) {
  if (value === null) return tempoBillCopy(lang).unavailable;
  if (['redEnergyShare', 'redCostShare'].includes(key)) return (lang === 'en' ? value : value.replace('.', ',')) + '\u00a0%';
  return ['totalWh', 'redPeakAfterWh', 'redOffPeakAfterWh'].includes(key) ? formatTempoEnergy(value, lang) : formatTempoMoney(value, lang);
}
export function bindTempoBillCalculators(scope = document) {
  scope.querySelectorAll('[data-tempo-bill-calculator]').forEach(root => {
    if (bound.has(root)) return;
    const lang = root.dataset.lang === 'en' ? 'en' : 'fr', copy = tempoBillCopy(lang);
    const form = root.querySelector('form'), fieldset = root.querySelector('fieldset');
    const error = root.querySelector('[data-error]'), status = root.querySelector('[data-status]');
    const keys = [...TEMPO_VOLUME_FIELDS, 'capacity', 'shift'];
    const fields = keys.map(key => form?.elements.namedItem(key));
    const outputs = TEMPO_OUTPUT_FIELDS.map(key => root.querySelector(`[data-output="${key}"]`));
    if (!form || !fieldset || !error || !status || fields.some(field => !field) || outputs.some(output => !output)) return;
    bound.add(root);
    function update() {
      try {
        const input = Object.fromEntries(keys.map((key, index) => [key, fields[index].value]));
        const result = calculateTempoBill(input);
        fields.forEach(field => field.setAttribute('aria-invalid', 'false'));
        outputs.forEach((output, index) => { output.textContent = tempoOutputText(TEMPO_OUTPUT_FIELDS[index], result[TEMPO_OUTPUT_FIELDS[index]], lang); });
        error.hidden = true; error.textContent = '';
        status.textContent = `${copy.updated} ${copy.labels[1]} : ${formatTempoMoney(result.tempoAfter, lang)}`;
      } catch {
        fields.forEach(field => field.setAttribute('aria-invalid', 'true'));
        outputs.forEach(output => { output.textContent = copy.unavailable; });
        error.hidden = false; error.textContent = copy.error; status.textContent = copy.error;
      }
    }
    form.addEventListener('input', update);
    form.addEventListener('change', update);
    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', event => {
      event.preventDefault();
      fields.forEach((field, index) => { field.value = TEMPO_DEFAULTS[keys[index]]; });
      update();
    });
    fieldset.disabled = false; update();
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bindTempoBillCalculators(), { once: true });
  else bindTempoBillCalculators();
  document.addEventListener('astro:page-load', () => bindTempoBillCalculators());
}
