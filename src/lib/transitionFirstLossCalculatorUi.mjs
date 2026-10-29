import { FIRST_LOSS_FIELDS, FIRST_LOSS_DEFAULTS, FIRST_LOSS_ACTORS, calculateFirstLoss, formatFirstLossMoney } from './transitionFirstLossCalculator.mjs';
const bound = new WeakSet();
export function firstLossCopy(lang) {
  if (!['fr', 'en'].includes(lang)) throw new RangeError('Supported language required');
  return lang === 'en' ? {
    eyebrow: 'ENERGY TRANSITION / LOCAL CALCULATOR', title: 'Compare two orders for absorbing a loss',
    intro: 'Fictional example: $100 million of capital, including 10% public capital, 20% private equity and 70% senior debt. A loss of 25% is allocated in two different orders.',
    controls: 'Change the four assumptions', legend: 'Fictional capital and conditional principal loss',
    fields: ['Total capital (USD)', 'Public share of capital (%)', 'Private equity share of capital (%)', 'Loss as a share of total capital (%)'],
    bounds: 'Capital: $0 to $1 billion. Shares and loss: 0% to 100%; public and equity shares together may reach 100%. Senior debt is the remaining share. Up to two decimal places; decimal point or comma, without thousands separators.',
    structures: ['A: public capital absorbs losses first', 'B: private equity absorbs losses first'], actors: ['Public capital', 'Private equity', 'Senior debt'],
    tranche: 'Tranche', columns: ['Capital', 'Loss', 'Remaining'], difference: 'Additional public loss in structure A', totalLoss: 'Total loss in each structure', totalRemaining: 'Total remaining in each structure',
    reset: 'Restore fictional example', method: 'Method and limits',
    scope: 'Losses are allocated in order until each tranche’s initial capital is exhausted. A: public capital, private equity, senior debt. B: private equity, public capital, senior debt. Senior debt absorbs losses after both other tranches in each structure.',
    limits: 'This is the allocation if the stated loss occurs. It is neither an expected loss nor a fiscal-cost estimate. The exercise excludes loss probabilities, interest, fees, guarantees, recoveries and payment timing. The inputs describe none of the transactions discussed in this article.',
    rounding: 'Calculations use exact integer units of one millionth of a dollar. Each displayed amount is rounded independently to cents; displayed rows may therefore differ by a cent when added.', privacy: 'Calculations run in this page. Inputs stay in memory while it is open.',
    nojs: 'The fictional starting example remains readable. JavaScript enables changes.', error: 'Enter four valid numbers within the limits. Public and equity shares must total at most 100%. Results remain unavailable until corrected.', unavailable: 'Unavailable', updated: 'Fictional scenario updated.',
  } : {
    eyebrow: 'TRANSITION ÉNERGÉTIQUE / CALCULATEUR LOCAL', title: 'Comparer deux ordres d’absorption des pertes',
    intro: 'Exemple fictif : 100 millions de dollars de capital, dont 10 % publics, 20 % de fonds propres privés et 70 % de dette senior. Une perte de 25 % est répartie selon deux ordres différents.',
    controls: 'Modifier les quatre hypothèses', legend: 'Capital fictif et perte conditionnelle sur le principal',
    fields: ['Capital total (dollars)', 'Part publique dans le capital (%)', 'Part des fonds propres privés (%)', 'Perte en part du capital total (%)'],
    bounds: 'Capital : de 0 à 1 milliard de dollars. Parts et perte : de 0 % à 100 % ; la somme des parts publique et privée peut atteindre 100 %. La dette senior représente le reste. Deux décimales au maximum ; point ou virgule, sans séparateur de milliers.',
    structures: ['A : le public absorbe les pertes en premier', 'B : les fonds propres privés passent en premier'], actors: ['Capital public', 'Fonds propres privés', 'Dette senior'],
    tranche: 'Tranche', columns: ['Capital', 'Perte', 'Solde'], difference: 'Perte publique supplémentaire dans la structure A', totalLoss: 'Perte totale dans chaque structure', totalRemaining: 'Solde total dans chaque structure',
    reset: 'Rétablir l’exemple fictif', method: 'Méthode et périmètre',
    scope: 'La perte suit l’ordre des tranches jusqu’à épuisement de leur capital initial. A : public, fonds propres privés, dette senior. B : fonds propres privés, public, dette senior. Dans les deux cas, la dette senior absorbe les pertes après les deux autres tranches.',
    limits: 'Le résultat répartit la perte indiquée si elle se produit. Il constitue une allocation conditionnelle, distincte d’une perte attendue ou d’un coût budgétaire. Probabilités, intérêts, frais, garanties, recouvrements et calendrier restent hors exercice. Les paramètres décrivent un modèle fictif, distinct des opérations étudiées dans l’article.',
    rounding: 'Les calculs sont exacts en millionièmes de dollar. Chaque montant affiché est arrondi au centime séparément ; la somme des lignes affichées peut donc différer d’un centime.', privacy: 'Les calculs restent dans cette page. Les valeurs sont conservées en mémoire pendant son ouverture.',
    nojs: 'L’exemple fictif initial reste lisible. JavaScript permet de modifier les hypothèses.', error: 'Saisissez quatre nombres valides dans les limites. La somme des parts publique et privée doit rester inférieure ou égale à 100 %. Les résultats restent indisponibles jusqu’à correction.', unavailable: 'Indisponible', updated: 'Scénario fictif actualisé.',
  };
}
export function bindFirstLossCalculators(scope = document) {
  scope.querySelectorAll('[data-first-loss-calculator]').forEach(root => {
    if (bound.has(root)) return;
    const lang = root.dataset.lang === 'en' ? 'en' : 'fr', copy = firstLossCopy(lang);
    const form = root.querySelector('form'), fieldset = root.querySelector('fieldset'), error = root.querySelector('[data-error]'), status = root.querySelector('[data-status]');
    const fields = FIRST_LOSS_FIELDS.map(key => form?.elements.namedItem(key));
    const outputs = [...root.querySelectorAll('[data-first-loss-output]')];
    if (!form || !fieldset || !error || !status || fields.some(field => !field) || outputs.length !== 21) return;
    bound.add(root);
    function update() {
      try {
        const result = calculateFirstLoss(Object.fromEntries(FIRST_LOSS_FIELDS.map((key, i) => [key, fields[i].value])));
        outputs.forEach(output => {
          const path = output.dataset.firstLossOutput.split('.');
          let value;
          if (path.length === 1 && ['loss', 'remaining', 'publicDifference'].includes(path[0])) value = result[path[0]];
          else if (path.length === 3 && ['publicFirst', 'equityFirst'].includes(path[0]) && FIRST_LOSS_ACTORS.includes(path[1]) && ['capital', 'loss', 'remaining'].includes(path[2])) value = result[path[0]][path[1]][path[2]];
          else throw new RangeError('Invalid result field');
          output.textContent = formatFirstLossMoney(value, lang);
        });
        fields.forEach(field => field.setAttribute('aria-invalid', 'false'));
        error.hidden = true; error.textContent = ''; status.textContent = `${copy.updated} ${copy.difference} : ${formatFirstLossMoney(result.publicDifference, lang)}`;
      } catch {
        fields.forEach(field => field.setAttribute('aria-invalid', 'true')); outputs.forEach(output => { output.textContent = copy.unavailable; });
        error.hidden = false; error.textContent = copy.error; status.textContent = copy.error;
      }
    }
    form.addEventListener('input', update); form.addEventListener('change', update); form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', event => { event.preventDefault(); fields.forEach((field, i) => { field.value = FIRST_LOSS_DEFAULTS[FIRST_LOSS_FIELDS[i]]; }); update(); });
    fieldset.disabled = false; update();
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bindFirstLossCalculators(), { once: true }); else bindFirstLossCalculators();
  document.addEventListener('astro:page-load', () => bindFirstLossCalculators());
}
