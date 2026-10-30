import { LEARNING_TIME_FIELDS, LEARNING_TIME_DEFAULTS, calculateLearningTime, parseLearningTimeQuantity, formatLearningTime, formatLearningTimeCount } from './learningTimeCalculator.mjs';
const bound = new WeakSet();
const OUTPUTS = Object.freeze(['net', 'baseline', 'assisted', 'learning', 'other', 'sessions', 'remainder']);
export function learningTimeCopy(lang) {
  if (!['fr', 'en'].includes(lang)) throw new RangeError('Supported language required');
  return lang === 'en' ? {
    eyebrow: 'WORK AND LEARNING / LOCAL CALCULATOR', title: 'Give the time saved a destination',
    intro: 'Constructed example: 100 cases per month, initially taking 30 minutes each. Assistance saves an assumed 10 minutes per case and adds 3 minutes of checking. Half of the net saving is reserved for learning, in 30-minute sessions.',
    controls: 'Change the six assumptions', legend: 'Fictional monthly workload and allocation',
    fields: ['Cases per month', 'Initial time per case (minutes)', 'Gross saving per case (minutes)', 'Additional checking per case (minutes)', 'Net saving reserved for learning (%)', 'Length of a learning session (minutes)'],
    bounds: 'Cases: an integer from 0 to 1,000,000. Initial time and session length: 0.01 to 1,440 minutes. Gross saving and additional checking: 0 to 1,440 minutes. The gross saving must fit within the initial time. Learning share: 0% to 100%. Up to two decimal places, except for the integer case count; decimal point or comma, without thousands separators.',
    presets: 'Compare the learning share', presetLabels: ['0% for learning', '50% for learning', '100% for learning'], reset: 'Restore constructed example',
    labels: ['Net time saved (negative means extra work)', 'Initial monthly work', 'Monthly work with assistance and checking', 'Time reserved for learning', 'Time available for other uses', 'Complete learning sessions', 'Learning time left after complete sessions'],
    positive: 'The net saving is split between learning and other uses.', zero: 'Net time saved and time available for learning are zero.',
    negative: 'Checking takes longer than the gross saving. Additional monthly work: ', negativeEnd: '. Available time for learning is zero.',
    method: 'Calculation and scope', formula: 'Initial work = cases × initial minutes. Assisted work = cases × (initial minutes − gross saving + additional checking). Net saving = initial work − assisted work. If the net saving is positive, the chosen share is allocated to learning; otherwise the available amount is zero. Complete sessions are rounded down, with the remainder kept separate.',
    scope: 'All inputs are chosen assumptions. Volume and required work quality are held constant. The model allocates time; learning outcomes, future expertise and employment require separate evidence.',
    mentor: 'A colleague’s additional mentoring time and implementation costs need their own budget. The checking allowance here belongs to the assumed time spent on each case.',
    rounding: 'Exact calculations precede display. Durations are rounded independently to the nearest second, so displayed parts may differ by a second when added. Complete sessions use the exact unrounded time.',
    privacy: 'Calculations run in this page. Inputs stay in memory while it is open.', nojs: 'The constructed starting example remains readable. JavaScript enables changes.',
    error: 'Enter six valid values within the limits. Cases must be an integer and gross saving must fit within the initial time. Results remain unavailable until corrected.', unavailable: 'Unavailable', updated: 'Constructed scenario updated.',
  } : {
    eyebrow: 'TRAVAIL ET APPRENTISSAGE / CALCULATEUR LOCAL', title: 'Donner une destination au temps gagné',
    intro: 'Exemple construit : 100 cas par mois, initialement de 30 minutes chacun. L’assistance économise par hypothèse 10 minutes par cas et ajoute 3 minutes de vérification. La moitié du gain net est réservée à l’apprentissage, par séances de 30 minutes.',
    controls: 'Modifier les six hypothèses', legend: 'Charge mensuelle et répartition fictives',
    fields: ['Cas par mois', 'Temps initial par cas (minutes)', 'Gain brut par cas (minutes)', 'Vérification supplémentaire par cas (minutes)', 'Gain net réservé à l’apprentissage (%)', 'Durée d’une séance d’apprentissage (minutes)'],
    bounds: 'Cas : entier de 0 à 1 000 000. Temps initial et durée d’une séance : de 0,01 à 1 440 minutes. Gain brut et vérification supplémentaire : de 0 à 1 440 minutes. Le gain brut doit tenir dans le temps initial. Part réservée à l’apprentissage : de 0 % à 100 %. Deux décimales au maximum, sauf pour le nombre entier de cas ; point ou virgule, sans séparateur de milliers.',
    presets: 'Comparer la part réservée à l’apprentissage', presetLabels: ['0 % pour apprendre', '50 % pour apprendre', '100 % pour apprendre'], reset: 'Rétablir l’exemple construit',
    labels: ['Temps gagné net (négatif : charge en plus)', 'Travail mensuel initial', 'Travail mensuel avec assistance et vérification', 'Temps réservé à l’apprentissage', 'Temps disponible pour les autres usages', 'Séances d’apprentissage complètes', 'Temps d’apprentissage restant après ces séances'],
    positive: 'Le gain net se répartit entre apprentissage et autres usages.', zero: 'Le gain net et le temps disponible pour l’apprentissage sont nuls.',
    negative: 'Les vérifications prennent plus de temps que l’assistance en économise. Charge mensuelle supplémentaire : ', negativeEnd: '. Le temps disponible pour l’apprentissage est nul.',
    method: 'Calcul et périmètre', formula: 'Travail initial = cas × minutes initiales. Travail assisté = cas × (minutes initiales − gain brut + vérification supplémentaire). Gain net = travail initial − travail assisté. Si le gain net est positif, la part choisie finance l’apprentissage ; autrement le temps disponible est nul. Les séances complètes sont arrondies à l’entier inférieur, avec le reliquat conservé à part.',
    scope: 'Les valeurs sont des hypothèses choisies. Le volume et la qualité requise du travail restent constants. Le modèle répartit du temps ; la progression des compétences, l’expertise future et les effectifs demandent des observations distinctes.',
    mentor: 'Le temps supplémentaire d’un collègue tuteur et les coûts de mise en place exigent un budget séparé. Les vérifications retenues ici font partie des minutes supposées consacrées à chaque cas.',
    rounding: 'Le calcul exact précède l’affichage. Chaque durée est arrondie à la seconde la plus proche ; la somme des parts affichées peut donc différer d’une seconde. Le nombre de séances complètes utilise les durées exactes.',
    privacy: 'Les calculs restent dans cette page. Les valeurs sont conservées en mémoire pendant son ouverture.', nojs: 'L’exemple construit initial reste lisible. JavaScript permet de modifier les hypothèses.',
    error: 'Saisissez six valeurs valides dans les limites. Le nombre de cas doit être entier et le gain brut doit tenir dans le temps initial. Les résultats restent indisponibles jusqu’à correction.', unavailable: 'Indisponible', updated: 'Scénario construit actualisé.',
  };
}
export function bindLearningTimeCalculators(scope = document) {
  scope.querySelectorAll('[data-learning-time-calculator]').forEach(root => {
    if (bound.has(root)) return;
    const lang = root.dataset.lang === 'en' ? 'en' : 'fr', copy = learningTimeCopy(lang);
    const form = root.querySelector('form'), fieldset = root.querySelector('fieldset'), error = root.querySelector('[data-error]'), status = root.querySelector('[data-status]'), balance = root.querySelector('[data-time-balance]');
    const fields = LEARNING_TIME_FIELDS.map(key => form?.elements.namedItem(key));
    const outputs = [...root.querySelectorAll('[data-learning-time-output]')], presets = [...root.querySelectorAll('[data-learning-share]')];
    if (!form || !fieldset || !error || !status || !balance || fields.some(field => !field) || outputs.length !== OUTPUTS.length || presets.length !== 3) return;
    bound.add(root);
    function update() {
      try {
        const result = calculateLearningTime(Object.fromEntries(LEARNING_TIME_FIELDS.map((key, i) => [key, fields[i].value])));
        outputs.forEach(output => {
          const key = output.dataset.learningTimeOutput;
          if (!OUTPUTS.includes(key)) throw new RangeError('Unknown result field');
          output.textContent = key === 'sessions' ? formatLearningTimeCount(result[key], lang) : formatLearningTime(result[key], lang);
        });
        balance.textContent = result.net < 0n ? `${copy.negative}${formatLearningTime(result.extraLoad, lang)}${copy.negativeEnd}` : result.net === 0n ? copy.zero : copy.positive;
        balance.dataset.extraLoad = String(result.net < 0n);
        fields.forEach(field => field.setAttribute('aria-invalid', 'false'));
        presets.forEach(button => button.setAttribute('aria-pressed', String(parseLearningTimeQuantity(fields[4].value, 'learningShare') === parseLearningTimeQuantity(button.dataset.learningShare, 'learningShare'))));
        error.hidden = true; error.textContent = ''; status.textContent = `${copy.updated} ${copy.labels[0]} : ${formatLearningTime(result.net, lang)}`;
      } catch {
        fields.forEach(field => field.setAttribute('aria-invalid', 'true')); outputs.forEach(output => { output.textContent = copy.unavailable; }); presets.forEach(button => button.setAttribute('aria-pressed', 'false'));
        balance.textContent = ''; balance.dataset.extraLoad = 'false'; error.hidden = false; error.textContent = copy.error; status.textContent = copy.error;
      }
    }
    form.addEventListener('input', update); form.addEventListener('change', update); form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', event => { event.preventDefault(); fields.forEach((field, i) => { field.value = LEARNING_TIME_DEFAULTS[LEARNING_TIME_FIELDS[i]]; }); update(); });
    presets.forEach(button => button.addEventListener('click', () => { fields[4].value = button.dataset.learningShare; update(); }));
    fieldset.disabled = false; update();
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bindLearningTimeCalculators(), { once: true }); else bindLearningTimeCalculators();
  document.addEventListener('astro:page-load', () => bindLearningTimeCalculators());
}
