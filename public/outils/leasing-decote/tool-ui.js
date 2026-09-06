(function () {
  'use strict';
  const host = document.querySelector('[data-lease-tool]');
  if (!host || !globalThis.L0gLeaseDepreciation) return;
  const model = globalThis.L0gLeaseDepreciation;
  let lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'fr';
  const form = host.querySelector('form');
  const keys = ['purchaseA', 'resaleA', 'purchaseB', 'resaleB', 'months'];
  const dictionary = {
    fr: {
      title: 'Le laboratoire de la décote',
      subtitle: 'Le prix du neuf ne suffit pas. Faites varier la revente pour isoler la perte de valeur à couvrir chaque mois.',
      flag: 'EXEMPLES FICTIFS · PAS UN DEVIS',
      instruction: 'Deux scénarios, une même durée. Les valeurs de départ sont inventées et ne représentent aucune offre commerciale.',
      first: 'A · Référence', second: 'B · Simulation', purchase: 'Prix payé par le loueur (€)', resale: 'Revente attendue (€)', months: 'Durée commune (mois)',
      presetLabel: 'Reprendre un cas de l’article', presetPrice: 'Seul l’achat baisse', presetSame: 'Les baisses se compensent', presetReverse: 'La revente baisse davantage', reset: 'Réinitialiser',
      result: 'Le calcul de la décote', aResult: 'A · Décote par mois', bResult: 'B · Décote par mois', difference: 'Écart mensuel B − A', totalA: 'Décote totale A', totalB: 'Décote totale B',
      threshold: 'Revente B pour égaler A', notApplicable: 'Non calculable', same: 'La composante de décote est identique dans les deux scénarios.', more: 'B exige davantage chaque mois pour couvrir la décote.', less: 'B exige moins chaque mois pour couvrir la décote.',
      thresholdText: 'À ce prix de revente B, la décote mensuelle serait la même que dans A.', impossible: 'Aucun seuil positif dans le domaine du modèle : même avec une revente B à 0 €, sa décote reste plus faible que dans A.',
      sensitivity: 'Une revente attendue plus basse de 1 000 € ajoute', unit: 'par mois', sensitivityEnd: 'à la décote mensuelle, au même prix d’achat et sur cette durée.',
      error: 'Saisissez tous les montants. Prix d’achat : de 1 à 1 000 000 €. Revente : de 0 au prix d’achat correspondant. Durée : de 1 à 120 mois entiers.',
      limits: 'Le modèle isole (achat − revente) ÷ mois. Il exclut versement initial, coût du financement, taxes, frais de revente ou de restitution, services et marge. La revente est une hypothèse, pas une garantie ni nécessairement le prix d’une option d’achat.',
      methodTitle: 'Pourquoi aucun taux d’intérêt ?', method: 'Pour rendre visible un mécanisme précis. Ce résultat n’est pas une estimation du loyer qui vous serait proposé. Tous les montants doivent utiliser la même base fiscale ; aucune taxe n’est calculée. Le modèle n’inclut pas les cas où la voiture prend de la valeur.',
      sourceLabel: 'Mécanisme : CFPB, Regulation M (§ 1013.4). Repères français : Service Public, LOA / LLD.',
      privacy: 'Calcul local. Aucun compte, aucune API, aucun stockage et aucun envoi de vos saisies.',
      theme: 'Clair / sombre', switchLang: 'Read in English', back: 'Lire l’article',
    },
    en: {
      title: 'The depreciation lab',
      subtitle: 'A new-car price tells only part of the story. Change the resale assumption to isolate the value lost each month.',
      flag: 'FICTIONAL SCENARIOS · NOT A QUOTE',
      instruction: 'Two scenarios share one term. The starting values are invented and do not represent a commercial offer.',
      first: 'A · Baseline', second: 'B · Scenario', purchase: 'Price paid by the lessor (€)', resale: 'Expected resale value (€)', months: 'Common term (months)',
      presetLabel: 'Load a case from the article', presetPrice: 'Only purchase price falls', presetSame: 'The reductions cancel out', presetReverse: 'Resale falls by more', reset: 'Reset',
      result: 'The depreciation calculation', aResult: 'A · Monthly depreciation', bResult: 'B · Monthly depreciation', difference: 'Monthly difference B − A', totalA: 'Total depreciation A', totalB: 'Total depreciation B',
      threshold: 'Resale B needed to match A', notApplicable: 'Not available', same: 'Both scenarios have the same depreciation component.', more: 'B needs a larger monthly amount to cover depreciation.', less: 'B needs a smaller monthly amount to cover depreciation.',
      thresholdText: 'At this resale value for B, monthly depreciation would match A.', impossible: 'No non-negative threshold within this model: even at a €0 resale value, B still has less depreciation than A.',
      sensitivity: 'A €1,000 reduction in expected resale value adds', unit: 'per month', sensitivityEnd: 'to monthly depreciation, at the same purchase price and over this term.',
      error: 'Fill in all amounts. Purchase prices: €1 to €1,000,000. Resale: from zero to the corresponding purchase price. Term: 1 to 120 whole months.',
      limits: 'The model isolates (purchase − resale) ÷ months. It excludes upfront payments, financing, taxes, selling or return charges, services and profit margin. Resale is an assumption, not a guarantee or necessarily a purchase-option price.',
      methodTitle: 'Why is there no interest rate?', method: 'To make one mechanism visible. This is not an estimate of a lease payment you would be offered. All values must use the same tax basis; no tax is calculated. The model does not cover cars that appreciate in value.',
      sourceLabel: 'Mechanism: CFPB, Regulation M (§ 1013.4). French contracts: Service Public, LOA / LLD.',
      privacy: 'Local calculation. No account, API, storage or transmission of your inputs.',
      theme: 'Light / dark', switchLang: 'Lire en français', back: 'Read the article',
    }
  };
  const text = (name, value) => { const el = host.querySelector('[data-output="' + name + '"]'); if (el) el.textContent = value; };
  function currency(value, signed) {
    const rounded = Math.abs(value) < .005 ? 0 : value;
    return new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-IE', {style: 'currency', currency: 'EUR', maximumFractionDigits: 2, minimumFractionDigits: 2, signDisplay: signed ? 'exceptZero' : 'auto'}).format(rounded);
  }
  function calculate() {
    const error = host.querySelector('[data-error]');
    const result = host.querySelector('[data-results]');
    try {
      const input = {};
      keys.forEach(key => {
        const field = form.elements.namedItem(key);
        if (field.value.trim() === '') throw new Error('empty');
        input[key] = field.valueAsNumber;
      });
      const out = model.evaluate(input);
      error.hidden = true;
      result.hidden = false;
      text('monthlyA', currency(out.a.monthly)); text('monthlyB', currency(out.b.monthly));
      text('delta', currency(out.monthlyDifference, true));
      text('totalA', currency(out.a.depreciation)); text('totalB', currency(out.b.depreciation));
      text('per1000', currency(out.per1000Monthly));
      text('threshold', out.thresholdFeasible ? currency(out.resaleThresholdB) : dictionary[lang].notApplicable);
      text('thresholdNote', out.thresholdFeasible ? dictionary[lang].thresholdText : dictionary[lang].impossible);
      const key = Math.abs(out.monthlyDifference) < 1e-9 ? 'same' : out.monthlyDifference > 0 ? 'more' : 'less';
      text('interpretation', dictionary[lang][key]);
      host.querySelectorAll('[data-unit]').forEach(el => {el.textContent = dictionary[lang].unit;});
    } catch (_) {
      error.hidden = false; result.hidden = true;
      error.textContent = dictionary[lang].error;
    }
  }
  function applyLanguage() {
    document.documentElement.lang = lang;
    document.title = dictionary[lang].title + ' · l0g';
    host.querySelectorAll('[data-i18n]').forEach(el => { const value = dictionary[lang][el.dataset.i18n]; if (value) el.textContent = value; });
    const back = host.querySelector('[data-back]');
    const offline = host.dataset.offline === 'true';
    back.href = offline ? (lang === 'fr' ? 'LIRE-FR.html' : 'READ-EN.html') : (lang === 'fr' ? '/posts/leasing-auto-prix-revente-mensualite/' : '/en/analysis/car-leasing-residual-value-payments/');
    calculate();
  }
  function loadPreset(resaleB) {
    const values = {...model.defaults, resaleB};
    keys.forEach(key => {form.elements.namedItem(key).value = values[key];});
    calculate();
  }
  form.addEventListener('submit', e => e.preventDefault());
  form.addEventListener('input', calculate);
  host.querySelector('[data-lang]').addEventListener('click', () => {lang = lang === 'fr' ? 'en' : 'fr'; applyLanguage();});
  host.querySelector('[data-theme-button]').addEventListener('click', () => {document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';});
  host.querySelectorAll('[data-preset]').forEach(button => {button.addEventListener('click', () => loadPreset(Number(button.dataset.preset)));});
  host.querySelector('[data-reset]').addEventListener('click', () => loadPreset(model.defaults.resaleB));
  applyLanguage();
})();
