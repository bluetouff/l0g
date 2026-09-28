import { calculateRepoStress, DEFAULT_REPO_INPUT } from './repo-stress.mjs';

const boundLabs = new WeakSet();
const uiCopy = {
  fr: {
    error:'Valeurs invalides : position 1–10 000 M€, décote initiale 1–20 %, décote finale entre la décote initiale et 40 %, baisse 0–10 %, réserve entre 0 et la position initiale.',
    needs:'Calcul local actualisé. ',
    success:'Le financement redevient compatible avec la décote après ces ventes, au prix stressé supposé constant.',
    failure:'Même la vente de toute la position ne suffit pas : une dette reste à rembourser. Le modèle ne transforme pas ce déficit en vente impossible.',
    none:'La réserve disponible couvre le besoin de liquidité : aucune vente n’est nécessaire dans ce modèle.',
    sold:'vendus', kept:'conservés', all:'de la position après choc',
    million:' M€', share:' %', initial:'× (position isolée, hors réserve et dérivés)'
  },
  en: {
    error:'Invalid values: position €1–10,000m; initial haircut 1–20%; final haircut between the initial haircut and 40%; price fall 0–10%; cash between 0 and the initial position.',
    needs:'Local calculation updated. ',
    success:'After these sales, financing satisfies the haircut at the assumed unchanged stressed price.',
    failure:'Even selling the whole position is insufficient: debt remains unpaid. The model does not disguise this deficit as an impossible sale.',
    none:'Available cash covers the liquidity requirement: this model requires no bond sales.',
    sold:'sold', kept:'retained', all:'of the post-shock position',
    million:'m', share:'%', initial:'× (isolated position, excluding cash and derivatives)'
  }
};

export function bindRepoLabs() {
  document.querySelectorAll('[data-repo-lab]').forEach((root) => {
    if (boundLabs.has(root)) return;
    boundLabs.add(root);
    const lang = root.dataset.lang === 'en' ? 'en' : 'fr';
    const copy = uiCopy[lang];
    const nf = new Intl.NumberFormat(lang === 'fr' ? 'fr-FR' : 'en-GB', {maximumFractionDigits:2});
    const money = (number) => lang === 'fr' ? nf.format(number)+copy.million : '€'+nf.format(number)+copy.million;
    const form = root.querySelector('form');
    const error = root.querySelector('[data-error]');
    const result = root.querySelector('[data-results]');
    const status = root.querySelector('[data-status]');
    if (!form || !error || !result || !status) return;
    const put = (name, text) => { const node = root.querySelector(`[data-output="${name}"]`); if (node) node.textContent=text; };
    const update = () => {
      const input = {};
      for (const key of Object.keys(DEFAULT_REPO_INPUT)) {
        const field = form.elements.namedItem(key);
        input[key] = field && field.value.trim() !== '' ? field.valueAsNumber : NaN;
      }
      try {
        const r = calculateRepoStress(input);
        error.hidden=true;
        const pending=root.querySelector('[data-pending]'); if (pending) pending.hidden=true;
        result.hidden=false;
        const uncovered = root.querySelector('[data-uncovered]');
        if (uncovered) uncovered.hidden = r.feasible;
        for (const key of ['debtBefore','valueAfter','loanCapacity','liquidityCall','cashUsed','gap','sale','remainingCollateral','remainingDebt','uncoveredDebt','priceLoss','priceContribution','haircutContribution']) put(key, money(r[key]));
        put('saleShare', nf.format(r.saleShare*100)+copy.share);
        put('positionLeverage', nf.format(r.positionLeverage)+copy.initial);
        put('status', r.feasible ? (r.gap < 1e-9 ? copy.none : copy.success) : copy.failure);
        const sold = root.querySelector('[data-sold-bar]');
        const kept = root.querySelector('[data-kept-bar]');
        const width = Math.max(0,Math.min(820, r.saleShare*820));
        if (sold) sold.setAttribute('width', width.toFixed(3));
        if (kept) {kept.setAttribute('x', (40+width).toFixed(3)); kept.setAttribute('width', (820-width).toFixed(3));}
        put('barSold', `${money(r.sale)} ${copy.sold}`);
        put('barKept', `${money(r.remainingCollateral)} ${copy.kept}`);
        put('barDesc', `${money(r.sale)} ${copy.sold}; ${money(r.remainingCollateral)} ${copy.kept}.`);
        status.textContent = copy.needs + money(r.liquidityCall) + ' / ' + money(r.sale);
      } catch (_) {
        const pending=root.querySelector('[data-pending]'); if (pending) pending.hidden=true;
        result.hidden=true;
        error.hidden=false;
        error.textContent=copy.error;
        status.textContent=copy.error;
      }
    };
    form.addEventListener('input', () => {
      result.hidden=true; error.hidden=true;
      const pending=root.querySelector('[data-pending]');
      if (pending) { pending.hidden=false; status.textContent=pending.textContent; }
    });
    form.addEventListener('submit', (event) => {event.preventDefault(); update();});
    root.querySelectorAll('button[data-preset]').forEach((button) => {
      button.addEventListener('click', () => {
        const preset = button.dataset.preset;
        const values = {...DEFAULT_REPO_INPUT};
        if (preset==='haircut') values.priceFall=0;
        if (preset==='buffer') values.cashBuffer=5;
        for (const [name, value] of Object.entries(values)) {
          const field = form.elements.namedItem(name);
          if (field) field.value=String(value);
        }
        update();
      });
    });
    const fields = root.querySelector('fieldset[data-inputs]');
    if (fields) fields.disabled = false;
    update();
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bindRepoLabs, {once:true});
  else bindRepoLabs();
  document.addEventListener('astro:page-load', bindRepoLabs);
}
