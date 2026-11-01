import { STELLANTIS_CASH_DEFAULTS, STELLANTIS_CASH_PRESETS, STELLANTIS_CASH_RESULTS, calculateStellantisCash, stellantisCashDisplay, stellantisCashEquation } from './stellantisCashModel.mjs';
const bound = new WeakSet();
export function stellantisCashCopy(lang) {
  if (!['fr', 'en'].includes(lang)) throw new RangeError('Supported language required');
  return lang === 'fr' ? {
    eyebrow: 'STELLANTIS / SENSIBILITÉ DE TRÉSORERIE', title: 'Un trimestre pour deux seuils',
    intro: 'Les neuf premiers mois de 2026 ont absorbé 4,930 milliards d’euros de cash industriel. Le flux du dernier trimestre reste inconnu. Cet atelier calcule un résultat annuel à partir de votre hypothèse.',
    controls: 'Choisir une hypothèse de quatrième trimestre', legend: 'Hypothèse de flux industriel pour octobre–décembre 2026', label: 'Cash-flow industriel du T4, en milliards d’euros', bounds: 'De −8 à +8 Md€, avec trois décimales au maximum',
    presets: ['+0,405 : égaler 2025', '+2,784 : répéter le T4 2025', '+4,930 : équilibre annuel'],
    reset: 'Rétablir l’hypothèse de zéro au T4', resultLabels: ['Flux industriel annuel 2026 simulé', 'Écart au flux annuel 2025'], unit: 'Md€',
    initial: 'SCÉNARIO PÉDAGOGIQUE : le T4 est fixé à zéro par hypothèse. Le résultat calculé est distinct du cumul publié à septembre et d’une prévision.',
    scenario: 'SCÉNARIO PÉDAGOGIQUE : le résultat annuel applique votre hypothèse au T4 encore inconnu.',
    statuses: { worse: 'Flux annuel inférieur à 2025 dans ce scénario.', equalPrior: 'Flux annuel égal à 2025 dans ce scénario.', improvedNegative: 'Amélioration par rapport à 2025 ; le flux annuel reste déficitaire.', breakEven: 'Équilibre annuel dans ce scénario.', positive: 'Flux annuel positif dans ce scénario.' },
    equations: 'Lire le calcul et les repères', equationLabel: 'Cumul publié à septembre + hypothèse de T4 = flux annuel simulé, en milliards d’euros.',
    prior: 'Le flux industriel annuel 2025 était de −4,525 Md€. Un T4 de +0,405 Md€ permettrait de l’égaler ; une amélioration stricte demande un montant supérieur.',
    historical: 'Le repère +2,784 Md€ reproduit exactement le T4 2025 et donnerait −2,146 Md€ pour 2026. C’est une répétition historique choisie pour l’illustration.',
    balance: 'Un T4 de +4,930 Md€ ramènerait le flux industriel annuel à zéro. Ce seuil est distinct de l’objectif de la direction pour 2027.',
    method: 'Périmètre, sources et confidentialité',
    scope: 'L’atelier utilise le cash-flow industriel disponible défini par Stellantis, un indicateur non-GAAP distinct du bénéfice, du flux de trésorerie consolidé et d’un budget de restructuration. Les repères sont arithmétiques ; ils ignorent les variations de saisonnalité, de marge et de paiements qui détermineront le T4 réel.',
    privacy: 'Les calculs s’effectuent dans cette page ; les réglages restent en mémoire pendant son ouverture. Les hypothèses en milliards sont converties exactement en millions entiers, puis les résultats sont affichés avec trois décimales.',
    sources: ['Résultats du T3 2026', 'Comparatifs trimestriels 2025', 'Rapport annuel 2025'],
    nojs: 'Le scénario initial et les repères restent lisibles. JavaScript active les réglages.',
    error: 'Saisissez une hypothèse de −8 à +8 milliards d’euros, avec trois décimales au maximum. Les résultats restent indisponibles jusqu’à correction.', unavailable: 'Indisponible', updated: 'Scénario pédagogique recalculé.',
  } : {
    eyebrow: 'STELLANTIS / CASH-FLOW SENSITIVITY', title: 'One quarter, two thresholds',
    intro: 'Industrial cash absorption totalled €4.930 billion in the first nine months of 2026. Q4 cash flow remains unknown. This workshop calculates an annual outcome from your assumption.',
    controls: 'Choose a fourth-quarter assumption', legend: 'Assumed industrial cash flow for October–December 2026', label: 'Q4 industrial cash flow, EUR billions', bounds: '−8 to +8 EUR bn, with up to three decimal places',
    presets: ['+0.405: match 2025', '+2.784: repeat Q4 2025', '+4.930: annual break-even'],
    reset: 'Restore the zero-Q4 assumption', resultLabels: ['Simulated 2026 annual industrial cash flow', 'Change versus 2025 annual cash flow'], unit: 'EUR bn',
    initial: 'TEACHING SCENARIO: Q4 is assumed to be zero. The calculated result is separate from reported September year-to-date cash flow and from a forecast.',
    scenario: 'TEACHING SCENARIO: the annual result applies your assumption to the still-unknown Q4.',
    statuses: { worse: 'Annual cash flow below 2025 in this scenario.', equalPrior: 'Annual cash flow equal to 2025 in this scenario.', improvedNegative: 'Improved from 2025; annual cash flow remains negative.', breakEven: 'Annual break-even in this scenario.', positive: 'Positive annual cash flow in this scenario.' },
    equations: 'Read the calculation and reference points', equationLabel: 'Reported cash flow through September + assumed Q4 = simulated full-year cash flow, EUR billions.',
    prior: 'Full-year 2025 industrial cash flow was −€4.525bn. Q4 of +€0.405bn would match it; a strict improvement requires a higher amount.',
    historical: 'The +€2.784bn reference repeats Q4 2025 exactly and would produce −€2.146bn for 2026. This is a historical repetition selected for illustration.',
    balance: 'Q4 of +€4.930bn would bring annual industrial cash flow to zero. This threshold is separate from management’s 2027 target.',
    method: 'Scope, sources and privacy',
    scope: 'The workshop uses Stellantis-defined industrial free cash flow, a non-GAAP measure separate from profit, consolidated cash flow and a restructuring budget. The reference points are arithmetic; seasonality, margins and payment timing will determine actual Q4 cash flow.',
    privacy: 'Calculations run in this page; settings stay in memory while it is open. Billion-euro assumptions convert exactly to whole millions; results display three decimal places.',
    sources: ['Q3 2026 results', '2025 quarterly comparisons', '2025 annual report'],
    nojs: 'The initial scenario and reference points remain readable. JavaScript enables changes.',
    error: 'Enter an assumption from −8 to +8 billion euros with up to three decimal places. Results remain unavailable until corrected.', unavailable: 'Unavailable', updated: 'Teaching scenario recalculated.',
  };
}
export function bindStellantisCashCalculators(scope = document) {
  scope.querySelectorAll('[data-stellantis-cash-root]').forEach(root => {
    if (bound.has(root) || !['fr', 'en'].includes(root.dataset.stellantisCashLang)) return;
    const lang = root.dataset.stellantisCashLang, copy = stellantisCashCopy(lang), form = root.querySelector('form'), fieldset = root.querySelector('fieldset'), input = form?.elements.namedItem('q4');
    const error = root.querySelector('[data-error]'), status = root.querySelector('[data-status]'), scenario = root.querySelector('[data-scenario]'), classification = root.querySelector('[data-stellantis-cash-status]'), equation = root.querySelector('[data-stellantis-cash-equation]');
    const outputs = [...root.querySelectorAll('[data-stellantis-cash-result]')], presets = [...root.querySelectorAll('[data-stellantis-preset]')];
    if (!form || !fieldset || !input || !error || !status || !scenario || !classification || !equation || outputs.length !== STELLANTIS_CASH_RESULTS.length || presets.length !== STELLANTIS_CASH_PRESETS.length) return;
    bound.add(root);
    function update() {
      try {
        const result = calculateStellantisCash({ q4: input.value });
        outputs.forEach(output => { output.textContent = stellantisCashDisplay(result, output.dataset.stellantisCashResult, lang); });
        equation.textContent = stellantisCashEquation(result, lang); classification.textContent = copy.statuses[result.status];
        scenario.textContent = result.q4 === 0 ? copy.initial : copy.scenario;
        input.setAttribute('aria-invalid', 'false'); error.hidden = true; error.textContent = ''; root.dataset.valid = 'true';
        status.textContent = `${copy.updated} ${copy.resultLabels[0]} : ${stellantisCashDisplay(result, 'annual', lang)} ${copy.unit}. ${copy.statuses[result.status]}`;
      } catch {
        outputs.forEach(output => { output.textContent = copy.unavailable; }); equation.textContent = copy.unavailable; classification.textContent = copy.unavailable; scenario.textContent = copy.unavailable;
        input.setAttribute('aria-invalid', 'true'); error.hidden = false; error.textContent = copy.error; status.textContent = copy.error; root.dataset.valid = 'false';
      }
    }
    form.addEventListener('input', update); form.addEventListener('change', update); form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', event => { event.preventDefault(); input.value = STELLANTIS_CASH_DEFAULTS.q4; update(); });
    presets.forEach(button => button.addEventListener('click', () => { const raw = button.dataset.stellantisPreset; if (!STELLANTIS_CASH_PRESETS.includes(raw)) { input.value = ''; update(); return; } input.value = raw; update(); }));
    update(); fieldset.disabled = false;
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bindStellantisCashCalculators(), { once: true }); else bindStellantisCashCalculators();
  document.addEventListener('astro:page-load', () => bindStellantisCashCalculators());
}
