import { BROADCOM_GUARANTEE_FIELDS, BROADCOM_GUARANTEE_DEFAULTS, BROADCOM_GUARANTEE_RESULTS, BROADCOM_GUARANTEE_PRESETS, parseBroadcomGuaranteeValue, calculateBroadcomGuarantee, broadcomGuaranteeDisplay, broadcomGuaranteeEquation } from './broadcomGuaranteeModel.mjs';
const bound = new WeakSet();
export function broadcomGuaranteeCopy(lang) {
  if (!['fr', 'en'].includes(lang)) throw new RangeError('Supported language required');
  return lang === 'fr' ? {
    eyebrow: 'BROADCOM / SOUTIEN CONDITIONNEL', title: 'Le défaut et la revente déterminent le soutien',
    intro: 'Faites varier un solde de bail et le produit de vente des équipements pour explorer la branche « défaut puis cession » décrite dans le dépôt de Broadcom.',
    controls: 'Modifier les hypothèses', legend: 'Deux montants dans la même unité fictive',
    labels: ['Solde du bail restant dû, L', 'Produit de vente des équipements, V'], bounds: 'De 0 à 100 unités fictives ; trois décimales au maximum.',
    defaultLabel: 'Supposer un défaut suivi de la vente des équipements', defaultHelp: 'Cette case décrit un scénario pédagogique. Le paiement normal des loyers laisse le soutien à zéro dans cette branche.',
    presetLabel: 'Exemples de produit de vente', presets: ['Vente à 30 unités', 'Vente à 60 unités', 'Vente à 90 unités'], reset: 'Rétablir le scénario initial',
    initial: 'SCÉNARIO PÉDAGOGIQUE : solde de 100 unités, vente à 50 et défaut supposé. Ces valeurs sont fictives et restent distinctes des 63 milliards financés et du maximum potentiel de 43 milliards de dollars.',
    scenario: 'SCÉNARIO PÉDAGOGIQUE : les résultats appliquent vos hypothèses en unités fictives, dans la branche défaut suivi d’une vente.',
    resultLabels: ['Soutien conditionnel calculé, G', 'Base de calcul : 72,5 % du solde L'], unit: 'unités fictives',
    statuses: { paying: 'Loyers payés selon l’hypothèse : le soutien reste à zéro dans ce modèle.', support: 'Défaut et vente supposés : le produit de vente est inférieur à la base de calcul ; l’écart détermine le soutien.', covered: 'Défaut et vente supposés : le produit de vente couvre la base de calcul ; le soutien calculé est nul.' },
    equationLabel: 'Calcul appliqué aux hypothèses', method: 'Formule, source et périmètre',
    methodText: 'Le formulaire 8-K décrit un soutien fondé, en cas de défaut sur les loyers, sur la différence entre 72,5 % des sommes contractuelles restant dues et le produit de vente des équipements. Le modèle ramène les deux montants à une échelle fictive de 0 à 100. Il représente uniquement cette branche contractuelle.',
    limits: 'Les autres recours, frais, délais, sûretés et priorités entre créanciers demandent leurs propres calculs. Les notes convertibles de 42 milliards relèvent d’un contrat distinct. Le résultat décrit un soutien conditionnel ; la perte de chaque financeur et sa probabilité restent hors du modèle.',
    source: 'Broadcom, 8-K du 27 octobre 2026, événement du 26 octobre', privacy: 'Les calculs restent dans cette page. Les réglages sont conservés uniquement pendant son ouverture.',
    nojs: 'Le scénario initial et ses résultats restent lisibles. JavaScript active les réglages.',
    error: 'Saisissez deux valeurs entre 0 et 100, avec trois décimales au maximum. Corrigez les champs signalés pour rétablir les résultats.', unavailable: 'Indisponible', updated: 'Scénario pédagogique recalculé.'
  } : {
    eyebrow: 'BROADCOM / CONDITIONAL SUPPORT', title: 'Default and resale determine the support',
    intro: 'Change a remaining lease balance and equipment sale proceeds to explore the default-followed-by-sale branch described in Broadcom’s filing.',
    controls: 'Change the assumptions', legend: 'Two amounts in the same fictional unit',
    labels: ['Remaining lease balance, L', 'Equipment sale proceeds, V'], bounds: 'From 0 to 100 fictional units; at most three decimal places.',
    defaultLabel: 'Assume a default followed by the equipment sale', defaultHelp: 'This checkbox describes a teaching scenario. Rent paid as agreed leaves support at zero in this branch.',
    presetLabel: 'Sale-proceeds examples', presets: ['Sale at 30 units', 'Sale at 60 units', 'Sale at 90 units'], reset: 'Restore the initial scenario',
    initial: 'TEACHING SCENARIO: a balance of 100 units, sale proceeds of 50 and an assumed default. These fictional amounts are separate from the $63 billion financing and the potential maximum of $43 billion.',
    scenario: 'TEACHING SCENARIO: results apply your fictional-unit assumptions to the default-followed-by-sale branch.',
    resultLabels: ['Calculated conditional support, G', 'Calculation base: 72.5% of balance L'], unit: 'fictional units',
    statuses: { paying: 'Rent paid as assumed: support remains zero in this model.', support: 'Default and sale assumed: proceeds fall below the calculation base; the gap determines support.', covered: 'Default and sale assumed: proceeds cover the calculation base; calculated support is zero.' },
    equationLabel: 'Calculation applied to the assumptions', method: 'Formula, source and scope',
    methodText: 'The 8-K describes support following a rent default, based on the difference between 72.5% of remaining contractual lease amounts and equipment sale proceeds. This model puts both amounts on a fictional scale from 0 to 100. It represents only that contractual branch.',
    limits: 'Other remedies, costs, timing, collateral and creditor priorities require their own assessment. The $42 billion convertible notes belong to a separate agreement. This result describes conditional support; each financier’s loss and its probability are outside this model.',
    source: 'Broadcom, 27 October 2026 8-K, event dated 26 October', privacy: 'All calculations run in this page. Settings remain in memory only while it is open.',
    nojs: 'The initial scenario and results remain readable. JavaScript enables changes.',
    error: 'Enter two values from 0 to 100, using at most three decimal places. Correct the marked fields to restore results.', unavailable: 'Unavailable', updated: 'Teaching scenario recalculated.'
  };
}
export function bindBroadcomGuaranteeCalculators(scope = document) {
  scope.querySelectorAll('[data-broadcom-guarantee-root]').forEach(root => {
    if (bound.has(root) || !['fr', 'en'].includes(root.dataset.broadcomGuaranteeLang)) return;
    const lang = root.dataset.broadcomGuaranteeLang, copy = broadcomGuaranteeCopy(lang), form = root.querySelector('form'), fieldset = root.querySelector('fieldset');
    const inputs = BROADCOM_GUARANTEE_FIELDS.map(field => form?.elements.namedItem(field)), defaultBox = form?.elements.namedItem('defaulted');
    const outputs = [...root.querySelectorAll('[data-broadcom-guarantee-result]')], presets = [...root.querySelectorAll('[data-broadcom-guarantee-preset]')];
    const error = root.querySelector('[data-error]'), status = root.querySelector('[data-status]'), scenario = root.querySelector('[data-scenario]'), classification = root.querySelector('[data-broadcom-guarantee-status]'), equation = root.querySelector('[data-broadcom-guarantee-equation]');
    if (!form || !fieldset || inputs.some(input => !input) || !defaultBox || typeof defaultBox.checked !== 'boolean' || outputs.length !== BROADCOM_GUARANTEE_RESULTS.length || presets.length !== BROADCOM_GUARANTEE_PRESETS.length || !error || !status || !scenario || !classification || !equation) return;
    if (new Set(outputs.map(output => output.dataset.broadcomGuaranteeResult)).size !== BROADCOM_GUARANTEE_RESULTS.length || new Set(presets.map(button => button.dataset.broadcomGuaranteePreset)).size !== BROADCOM_GUARANTEE_PRESETS.length || outputs.some(output => !BROADCOM_GUARANTEE_RESULTS.includes(output.dataset.broadcomGuaranteeResult)) || presets.some(button => !BROADCOM_GUARANTEE_PRESETS.includes(button.dataset.broadcomGuaranteePreset))) return;
    bound.add(root);
    function update() {
      const raw = { lease: inputs[0].value, resale: inputs[1].value, defaulted: defaultBox.checked };
      try {
        const result = calculateBroadcomGuarantee(raw);
        outputs.forEach(output => { output.textContent = broadcomGuaranteeDisplay(result, output.dataset.broadcomGuaranteeResult, lang); });
        equation.textContent = broadcomGuaranteeEquation(result, lang); classification.textContent = copy.statuses[result.status];
        scenario.textContent = raw.lease === BROADCOM_GUARANTEE_DEFAULTS.lease && raw.resale === BROADCOM_GUARANTEE_DEFAULTS.resale && raw.defaulted === BROADCOM_GUARANTEE_DEFAULTS.defaulted ? copy.initial : copy.scenario;
        inputs.forEach(input => input.setAttribute('aria-invalid', 'false')); error.hidden = true; error.textContent = ''; root.dataset.valid = 'true';
        status.textContent = `${copy.updated} ${copy.resultLabels[0]} : ${broadcomGuaranteeDisplay(result, 'support', lang)} ${copy.unit}.`;
      } catch {
        outputs.forEach(output => { output.textContent = copy.unavailable; }); equation.textContent = copy.unavailable; classification.textContent = copy.unavailable; scenario.textContent = copy.unavailable; root.dataset.valid = 'false';
        inputs.forEach(input => { let valid = true; try { parseBroadcomGuaranteeValue(input.value); } catch { valid = false; } input.setAttribute('aria-invalid', valid ? 'false' : 'true'); });
        error.hidden = false; error.textContent = copy.error; status.textContent = copy.error;
      }
    }
    form.addEventListener('input', update); form.addEventListener('change', update); form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('reset', event => { event.preventDefault(); inputs.forEach((input, i) => { input.value = BROADCOM_GUARANTEE_DEFAULTS[BROADCOM_GUARANTEE_FIELDS[i]]; }); defaultBox.checked = BROADCOM_GUARANTEE_DEFAULTS.defaulted; update(); });
    presets.forEach(button => button.addEventListener('click', () => { inputs[1].value = button.dataset.broadcomGuaranteePreset; update(); }));
    update(); fieldset.disabled = false;
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => bindBroadcomGuaranteeCalculators(), { once: true });
  else bindBroadcomGuaranteeCalculators();
}
