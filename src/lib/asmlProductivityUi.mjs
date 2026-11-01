import { ASML_PRODUCTIVITY_FIELDS, ASML_PRODUCTIVITY_DEFAULTS, ASML_PRODUCTIVITY_RESULTS, calculateAsmlProductivity, formatAsmlProductivity, asmlProductivityDisplay, asmlProductivityPlot } from './asmlProductivityModel.mjs';
const bound = new WeakSet();
export function asmlProductivityCopy(lang) {
  if (!['fr', 'en'].includes(lang)) throw new RangeError('Supported language required');
  return lang === 'fr' ? {
    eyebrow: 'ASML / CAPACITÉ INDUSTRIELLE', title: 'Le prix de l’arrêt, mesuré en production',
    intro: 'Une machine accélérée peut d’abord perdre du terrain pendant son arrêt. Comparez les volumes cumulés avec une machine qui continue de tourner à sa cadence initiale.',
    controls: 'Faire varier les hypothèses', legend: 'Six paramètres du scénario',
    labels: ['Cadence avant intervention', 'Cadence après intervention', 'Durée de l’arrêt', 'Horizon depuis le début de l’arrêt', 'Disponibilité commune', 'Charge commune'],
    bounds: ['1 à 1 000 passages de wafer par heure', '1 à 1 000 passages de wafer par heure', '0 à 365 jours', '1 à 1 460 jours', '1 à 100 %', '1 à 100 %'],
    reset: 'Rétablir l’exemple historique', preset: 'Disponibilité et charge à 100 %',
    initial: 'SCÉNARIO PÉDAGOGIQUE : 230 puis 295 passages par heure et six semaines d’arrêt proviennent d’un exemple ASML de 2021. L’horizon de 365 jours, la disponibilité de 90 % et la charge de 80 % sont des hypothèses l0g.',
    scenario: 'SCÉNARIO PÉDAGOGIQUE : les résultats appliquent vos paramètres. Ils décrivent des passages à une étape de fabrication, distincts des puces finies et d’un retour financier.',
    resultLabels: ['Volume avec la cadence initiale', 'Volume avec la modernisation', 'Écart de volume cumulé', 'Rattrapage depuis le début de l’arrêt'],
    units: ['passages', 'passages', 'passages', 'jours'],
    statuses: { identical: 'Les deux trajectoires sont identiques sur tout l’horizon.', never: 'Avec ces cadences et cet arrêt, la trajectoire modernisée reste en retrait.', beyond: 'Le rattrapage se situe au-delà de l’horizon affiché, en prolongeant les mêmes hypothèses.', within: 'Le rattrapage se situe dans l’horizon affiché.' },
    delta: 'Écart sur l’horizon choisi', restart: 'Après la remise en route',
    chartTitle: 'Deux trajectoires de volume cumulé', baseline: 'Cadence initiale', upgraded: 'Après modernisation', down: 'Arrêt', dayAxis: 'Jours depuis le début',
    chartDescription: 'Le volume à cadence initiale augmente dès le début ; la trajectoire modernisée commence à produire après l’arrêt.',
    method: 'Hypothèses, formule et source',
    methodText: 'La disponibilité représente la fraction du temps où la machine peut fonctionner ; la charge représente la part de cette capacité mobilisée. Le modèle applique les mêmes taux aux deux trajectoires. La cadence après intervention est atteinte immédiatement au redémarrage. Les autres étapes de l’usine, la montée en cadence, les coûts, les prix et les marges restent hors du calcul.',
    formula: 'Rattrapage depuis le début = durée d’arrêt × cadence après ÷ (cadence après − cadence avant), lorsque la cadence augmente.',
    historical: 'Les paramètres techniques historiques concernent le passage NXT:1960 vers NXT:1980 présenté en 2021. ASML indiquait que des périodes de moindre utilisation pouvaient faciliter les interventions matérielles longues.',
    source: 'ASML Investor Day 2021, diapositives 21–22', privacy: 'Tous les calculs restent dans cette page. Les réglages sont conservés uniquement pendant son ouverture.',
    nojs: 'Le scénario initial et son graphique restent lisibles. JavaScript active les réglages.',
    error: 'Vérifiez les six paramètres : respectez les limites indiquées et trois décimales au maximum. Les résultats restent indisponibles jusqu’à correction.', unavailable: 'Indisponible', updated: 'Scénario pédagogique recalculé.',
  } : {
    eyebrow: 'ASML / INDUSTRIAL CAPACITY', title: 'Downtime has a production cost',
    intro: 'A faster machine can first fall behind while its upgrade is installed. Compare cumulative volumes with a machine that keeps running at its original speed.',
    controls: 'Change the assumptions', legend: 'Six scenario parameters',
    labels: ['Throughput before the upgrade', 'Throughput after the upgrade', 'Downtime', 'Horizon from the start of downtime', 'Common availability', 'Common loading'],
    bounds: ['1 to 1,000 wafer passes per hour', '1 to 1,000 wafer passes per hour', '0 to 365 days', '1 to 1,460 days', '1 to 100%', '1 to 100%'],
    reset: 'Restore the historical example', preset: 'Set availability and loading to 100%',
    initial: 'TEACHING SCENARIO: throughput of 230 then 295 wafer passes per hour and six weeks of downtime come from an ASML example published in 2021. The 365-day horizon, 90% availability and 80% loading are l0g assumptions.',
    scenario: 'TEACHING SCENARIO: results apply your parameters. They describe passes at one manufacturing step, separate from finished chips and a financial return.',
    resultLabels: ['Volume at the original speed', 'Volume with the upgrade', 'Cumulative volume difference', 'Catch-up from the start of downtime'],
    units: ['passes', 'passes', 'passes', 'days'],
    statuses: { identical: 'The two paths are identical throughout the horizon.', never: 'With these speeds and downtime, the upgraded path remains behind.', beyond: 'Catch-up falls beyond the displayed horizon, extending the same assumptions.', within: 'Catch-up falls within the displayed horizon.' },
    delta: 'Difference over the selected horizon', restart: 'After restart',
    chartTitle: 'Two cumulative-volume paths', baseline: 'Original speed', upgraded: 'With the upgrade', down: 'Downtime', dayAxis: 'Days from the start',
    chartDescription: 'Volume at the original speed increases from the start; the upgraded path begins producing after downtime.',
    method: 'Assumptions, formula and source',
    methodText: 'Availability is the fraction of time when the machine can operate; loading is the share of that capacity used. Both paths use the same rates. The upgraded speed is reached immediately at restart. Other factory steps, ramp-up, costs, prices and margins are outside this calculation.',
    formula: 'Catch-up from the start = downtime × upgraded speed ÷ (upgraded speed − original speed), when throughput increases.',
    historical: 'The historical technical parameters concern the NXT:1960 to NXT:1980 upgrade presented in 2021. ASML explained that periods of lower utilization could accommodate lengthy hardware upgrades.',
    source: 'ASML Investor Day 2021, slides 21–22', privacy: 'All calculations run in this page. Settings remain in memory only while it is open.',
    nojs: 'The initial scenario and chart remain readable. JavaScript enables changes.',
    error: 'Check all six parameters against the stated limits, using at most three decimal places. Results remain unavailable until corrected.', unavailable: 'Unavailable', updated: 'Teaching scenario recalculated.',
  };
}
export function asmlProductivityNotes(result, lang) {
  const copy = asmlProductivityCopy(lang);
  return {
    delta: `${result.percent > 0 ? '+' : ''}${formatAsmlProductivity(result.percent, lang, 1)} % · ${copy.delta}`,
    catchup: result.status === 'identical' || result.catchup === null ? copy.statuses[result.status] : `${copy.statuses[result.status]} ${copy.restart} : ${formatAsmlProductivity(result.afterRestart, lang, 1)} ${copy.units[3]}.`,
    description: `${copy.chartDescription} ${formatAsmlProductivity(result.values.horizon, lang, 1)} ${copy.units[3]} : ${asmlProductivityDisplay(result, 'baseline', lang)} / ${asmlProductivityDisplay(result, 'upgraded', lang)} ${copy.units[0]}.`,
  };
}
function drawAsmlPlot(svg, result, lang) {
  const plot = asmlProductivityPlot(result, svg.dataset.asmlPlot, lang);
  svg.querySelector('[data-asml-baseline]').setAttribute('d', plot.baseline);
  svg.querySelector('[data-asml-upgraded]').setAttribute('d', plot.upgraded);
  svg.querySelector('[data-asml-downtime]').setAttribute('width', plot.downtimeWidth);
  const marker = svg.querySelector('[data-asml-catchup]');
  marker.setAttribute('visibility', plot.catchupVisible ? 'visible' : 'hidden'); marker.setAttribute('cx', plot.catchupX); marker.setAttribute('cy', plot.catchupY);
  [...svg.querySelectorAll('[data-asml-y-tick]')].forEach((text, i) => { text.setAttribute('y', String(Number(plot.yTicks[i].y) + 5)); text.textContent = plot.yTicks[i].label; });
  [...svg.querySelectorAll('[data-asml-grid]')].forEach((line, i) => { line.setAttribute('y1', plot.yTicks[i].y); line.setAttribute('y2', plot.yTicks[i].y); });
  [...svg.querySelectorAll('[data-asml-x-tick]')].forEach((text, i) => { text.textContent = plot.xTicks[i].label; });
  svg.querySelector('desc').textContent = asmlProductivityNotes(result, lang).description;
}
export function bindAsmlProductivityCalculators(scope = document) {
  scope.querySelectorAll('[data-asml-productivity-root]').forEach(root => {
    if (bound.has(root) || !['fr', 'en'].includes(root.dataset.asmlProductivityLang)) return;
    const lang = root.dataset.asmlProductivityLang, copy = asmlProductivityCopy(lang), form = root.querySelector('form'), fieldset = root.querySelector('fieldset');
    const inputs = ASML_PRODUCTIVITY_FIELDS.map(field => form?.elements.namedItem(field));
    const outputs = [...root.querySelectorAll('[data-asml-productivity-result]')], catchupUnit = root.querySelector('[data-asml-result-unit="catchup"]'), charts = [...root.querySelectorAll('[data-asml-plot]')];
    const error = root.querySelector('[data-error]'), status = root.querySelector('[data-status]'), scenario = root.querySelector('[data-scenario]'), deltaNote = root.querySelector('[data-asml-delta-note]'), catchupNote = root.querySelector('[data-asml-catchup-note]'), chartWrap = root.querySelector('[data-asml-chart-wrap]'), chartUnit = root.querySelector('[data-asml-chart-unit]'), preset = root.querySelector('[data-asml-full-use]');
    if (!form || !fieldset || inputs.some(input => !input) || outputs.length !== ASML_PRODUCTIVITY_RESULTS.length || charts.length !== 2 || !error || !status || !scenario || !deltaNote || !catchupNote || !chartWrap || !chartUnit || !preset || !catchupUnit) return;
    if (charts.some(svg => !['desktop', 'mobile'].includes(svg.dataset.asmlPlot) || !svg.querySelector('[data-asml-baseline]') || !svg.querySelector('[data-asml-upgraded]') || !svg.querySelector('[data-asml-downtime]') || !svg.querySelector('[data-asml-catchup]') || !svg.querySelector('desc') || svg.querySelectorAll('[data-asml-y-tick]').length !== 5 || svg.querySelectorAll('[data-asml-grid]').length !== 5 || svg.querySelectorAll('[data-asml-x-tick]').length !== (svg.dataset.asmlPlot === 'mobile' ? 3 : 5))) return;
    bound.add(root);
    function update() {
      const raw = Object.fromEntries(ASML_PRODUCTIVITY_FIELDS.map((field, i) => [field, inputs[i].value]));
      try {
        const result = calculateAsmlProductivity(raw), notes = asmlProductivityNotes(result, lang);
        outputs.forEach(output => { output.textContent = asmlProductivityDisplay(result, output.dataset.asmlProductivityResult, lang); });
        deltaNote.textContent = notes.delta; catchupNote.textContent = notes.catchup; catchupUnit.hidden = result.catchup === null;
        scenario.textContent = ASML_PRODUCTIVITY_FIELDS.every(field => raw[field] === ASML_PRODUCTIVITY_DEFAULTS[field]) ? copy.initial : copy.scenario;
        charts.forEach(svg => drawAsmlPlot(svg, result, lang)); chartWrap.hidden = false; chartUnit.textContent = asmlProductivityPlot(result, 'mobile', lang).unit;
        inputs.forEach(input => input.setAttribute('aria-invalid', 'false')); error.hidden = true; error.textContent = ''; root.dataset.valid = 'true';
        status.textContent = `${copy.updated} ${copy.resultLabels[2]} : ${asmlProductivityDisplay(result, 'delta', lang)} ${copy.units[2]}.`;
      } catch {
        outputs.forEach(output => { output.textContent = copy.unavailable; }); deltaNote.textContent = ''; catchupNote.textContent = ''; scenario.textContent = copy.unavailable;
        chartWrap.hidden = true; catchupUnit.hidden = true; chartUnit.textContent = copy.unavailable; root.dataset.valid = 'false';
        inputs.forEach((input, i) => { let valid = true; try { calculateAsmlProductivity({ ...ASML_PRODUCTIVITY_DEFAULTS, [ASML_PRODUCTIVITY_FIELDS[i]]: input.value }); } catch { valid = false; } input.setAttribute('aria-invalid', valid ? 'false' : 'true'); });
        error.hidden = false; error.textContent = copy.error; status.textContent = copy.error;
      }
    }
    form.addEventListener('input', update); form.addEventListener('change', update); form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', event => { event.preventDefault(); inputs.forEach((input, i) => { input.value = ASML_PRODUCTIVITY_DEFAULTS[ASML_PRODUCTIVITY_FIELDS[i]]; }); update(); });
    preset.addEventListener('click', () => { inputs[4].value = '100'; inputs[5].value = '100'; update(); });
    update(); fieldset.disabled = false;
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bindAsmlProductivityCalculators(), { once: true }); else bindAsmlProductivityCalculators();
  document.addEventListener('astro:page-load', () => bindAsmlProductivityCalculators());
}
