import { CUMCUM_REFORM_FIELDS, CUMCUM_REFORM_PRESETS, calculateCumCumReform } from './cumCumReformLab.mjs';
export const CUMCUM_REFORM_OUTPUTS = Object.freeze(['y0', 'y1', 'delta', 'points', 'base', 'rate', 'sum', 'growth']);
const bound = new WeakSet();
export function cumCumReformCopy(lang) {
  return lang === 'en' ? {
    title: 'Separate the dividend base from the collection yield', eyebrow: 'FICTIONAL SCENARIOS',
    intro: 'Two fictional periods show how larger tax receipts can coexist with a lower collection yield.',
    controlsTitle: 'Change the assumptions',
    fields: ['Initial dividends', 'Initial net receipts', 'Final dividends', 'Final net receipts'],
    labels: ['Initial collection yield', 'Final collection yield', 'Change in receipts', 'Change in yield', 'Dividend-base effect', 'Collection-yield effect', 'Sum of both effects', 'Receipt growth'],
    presets: ['More dividends, lower yield', 'Constant yield', 'Higher yield'],
    bounds: 'EUR million. Dividends: 0.01 to 1,000,000. Receipts: zero to the corresponding dividends. At most two decimal places; use a decimal point or comma, without thousands separators.',
    error: 'Invalid scenario. Enter four decimal amounts within the limits. Receipts must not exceed the corresponding dividends. All results are unavailable until the inputs are corrected.',
    unavailable: 'Unavailable', zero: 'Unavailable: initial receipts are zero', updated: 'Fictional scenario updated.',
    nojs: 'The initial fictional scenario remains readable. JavaScript is required to change the assumptions.',
    methodTitle: 'Calculation and interpretation',
    method: 'Collection yield = net receipts / dividends. Base effect = (final dividends − initial dividends) × initial yield. Yield effect = final dividends × (final yield − initial yield). Their sum equals the change in receipts. These are accounting scenarios, not measurements of fraud or compliance.',
    rounding: 'Results have two decimal places. Any presentation rounding remainder is assigned to the yield effect so that the displayed effects add up exactly to the change in receipts.',
    reset: 'Reset', legend: 'Fictional amounts in EUR million', money: ' €m', pct: '%', pp: ' pp',
  } : {
    title: 'Distinguer la base de dividendes et le rendement de collecte', eyebrow: 'SCÉNARIOS FICTIFS',
    intro: 'Deux périodes fictives illustrent la hausse des recettes fiscales malgré un rendement de collecte réduit.',
    controlsTitle: 'Modifier les hypothèses',
    fields: ['Dividendes initiaux', 'Recettes nettes initiales', 'Dividendes finaux', 'Recettes nettes finales'],
    labels: ['Rendement de collecte initial', 'Rendement de collecte final', 'Variation des recettes', 'Variation du rendement', 'Effet de la base de dividendes', 'Effet du rendement de collecte', 'Somme des deux effets', 'Croissance des recettes'],
    presets: ['Plus de dividendes, rendement réduit', 'Rendement constant', 'Rendement accru'],
    bounds: 'Millions d’euros. Dividendes : de 0,01 à 1 000 000. Recettes : de zéro au montant des dividendes correspondants. Deux décimales au maximum ; point ou virgule décimale, sans séparateur de milliers.',
    error: 'Scénario invalide. Saisissez quatre montants décimaux dans les limites. Les recettes doivent rester inférieures ou égales aux dividendes correspondants. Tous les résultats sont indisponibles jusqu’à correction.',
    unavailable: 'Indisponible', zero: 'Indisponible : recettes initiales nulles', updated: 'Scénario fictif actualisé.',
    nojs: 'Le scénario fictif initial reste lisible. JavaScript est nécessaire pour modifier les hypothèses.',
    methodTitle: 'Calcul et interprétation',
    method: 'Rendement de collecte = recettes nettes / dividendes. Effet de base = (dividendes finaux − dividendes initiaux) × rendement initial. Effet de rendement = dividendes finaux × (rendement final − rendement initial). Leur somme égale la variation des recettes. Ces scénarios comptables ne mesurent ni la fraude ni la conformité.',
    rounding: 'Les résultats ont deux décimales. L’éventuel écart d’arrondi de présentation est affecté à l’effet de rendement pour que les effets affichés égalent exactement la variation des recettes.',
    reset: 'Réinitialiser', legend: 'Montants fictifs en millions d’euros', money: ' M€', pct: ' %', pp: ' points',
  };
}
export function formatCumCumLabValue(value, lang, signed = false) {
  const negative = value.startsWith('-');
  const [whole, fraction] = (negative ? value.slice(1) : value).split('.');
  const zero = whole === '0' && fraction === '00';
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'en' ? ',' : '\u202f');
  return `${negative && !zero ? '−' : signed && !zero ? '+' : ''}${grouped}${lang === 'en' ? '.' : ','}${fraction}`;
}
export function cumCumLabOutputText(key, value, lang) {
  const copy = cumCumReformCopy(lang);
  if (value === null) return copy.zero;
  const suffix = key === 'points' ? copy.pp : ['y0', 'y1', 'growth'].includes(key) ? copy.pct : copy.money;
  return formatCumCumLabValue(value, lang, !['y0', 'y1'].includes(key)) + suffix;
}
export function bindCumCumReformLabs(scope = document) {
  scope.querySelectorAll('[data-cumcum-reform-lab]').forEach(root => {
    if (bound.has(root)) return;
    const lang = root.dataset.lang === 'en' ? 'en' : 'fr', copy = cumCumReformCopy(lang);
    const form = root.querySelector('form'), fieldset = root.querySelector('fieldset');
    const error = root.querySelector('[data-error]'), status = root.querySelector('[data-status]');
    const fields = CUMCUM_REFORM_FIELDS.map(key => form?.elements.namedItem(key));
    const outputs = CUMCUM_REFORM_OUTPUTS.map(key => root.querySelector(`[data-output="${key}"]`));
    if (!form || !fieldset || !error || !status || fields.some(x => !x) || outputs.some(x => !x)) return;
    bound.add(root);
    const buttons = [...root.querySelectorAll('[data-preset]')];
    function update() {
      try {
        const input = Object.fromEntries(CUMCUM_REFORM_FIELDS.map((key, i) => [key, fields[i].value]));
        const result = calculateCumCumReform(input);
        fields.forEach(field => field.setAttribute('aria-invalid', 'false'));
        outputs.forEach((output, i) => { output.textContent = cumCumLabOutputText(CUMCUM_REFORM_OUTPUTS[i], result[CUMCUM_REFORM_OUTPUTS[i]], lang); });
        error.hidden = true; error.textContent = '';
        status.textContent = `${copy.updated} ${copy.labels[2]}${lang === 'en' ? ':' : ' :'} ${cumCumLabOutputText('delta', result.delta, lang)}`;
        buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(CUMCUM_REFORM_FIELDS.every(key => input[key] === CUMCUM_REFORM_PRESETS[i][key]))));
      } catch {
        fields.forEach(field => field.setAttribute('aria-invalid', 'true'));
        outputs.forEach(output => { output.textContent = copy.unavailable; });
        buttons.forEach(button => button.setAttribute('aria-pressed', 'false'));
        error.hidden = false; error.textContent = copy.error; status.textContent = copy.error;
      }
    }
    function setPreset(index) {
      const preset = CUMCUM_REFORM_PRESETS[index];
      if (!preset) return;
      fields.forEach((field, i) => { field.value = preset[CUMCUM_REFORM_FIELDS[i]]; });
      update();
    }
    form.addEventListener('input', update);
    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', event => { event.preventDefault(); setPreset(0); });
    buttons.forEach((button, index) => { button.disabled = false; button.addEventListener('click', () => setPreset(index)); });
    fieldset.disabled = false; update();
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bindCumCumReformLabs(), { once: true });
  else bindCumCumReformLabs();
  document.addEventListener('astro:page-load', () => bindCumCumReformLabs());
}
