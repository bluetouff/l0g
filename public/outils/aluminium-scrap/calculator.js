/* l0g.fr | Offline bilingual interface. All user text is handled with textContent. */
(function () {
  'use strict';
  const translations = {
    en: {
      rounding:'Display rounded to 0.1 tonne; calculations retain full precision. Rounded components may differ slightly from the displayed total.', source_sortcas:'European Commission / CORDIS: SortCAS', theme:'Light / dark', eyebrow:'COMMODITIES / EDUCATIONAL MODEL', title:'Retained does not mean recycled.',
      dek:'A border measure can change where scrap goes. It does not create the right grade, an available furnace or a customer.',
      notice:'Every prefilled number is hypothetical. This is neither a forecast nor an estimate of the impact of an EU measure.',
      presets:'Three hypothetical starting points', preset_capacity:'Capacity constraint', preset_quality:'Quality constraint', preset_aligned:'Aligned chain',
      inputs:'Your assumptions for one year', units:'Capacity and outlets mean additional volumes, net of existing commitments, expressed as equivalent tonnes of incoming scrap.',
      q_label:'Scrap seeking this processing route (t)', q_help:'An assumed volume, not a measurement of the future regulation’s coverage.',
      a_label:'Compatible share after sorting (%)', a_help:'The share usable in the selected chain, given its feedstock requirements and processes.',
      c_label:'Additional processing capacity (t)', c_help:'A limit on incoming scrap, not on output of finished metal.',
      d_label:'Equivalent commercial outlets (t)', d_help:'Incoming scrap supported by orders at the selected yield. Reassess this input when changing the yield.',
      y_label:'Recovery yield within this route (%)', y_help:'The share of treated material recovered as metal. Residues may have other recovery routes.',
      reset:'Reset the example', results:'Material balance for this route', metal:'Recovered metal', tonnes:'metric tonnes',
      treated:'Scrap treated', compatible:'Compatible scrap', residual:'Residues / unrecovered fractions', unassigned:'Material still needing an outlet',
      legend:'Chart: solid fill = metal; hatching = residues; outline = unassigned material. Residues and unassigned material are not necessarily lost.',
      boundary:'Displayed metal is not a net addition to global production. The model does not calculate prices, emissions, international rerouting or changes in collection.',
      method:'What the tool calculates', formula1:'Compatible flow = incoming volume × compatible share.',
      formula2:'Treated flow = the minimum of compatible flow, capacity and commercial outlets.',
      formula3:'Metal = treated flow × yield. Residues = treated − metal. Unassigned material = incoming − treated.',
      limits:'Assumptions: one period, no inventory carry-over calculation and no alloy-blending model. Sorting is summarised as a compatible share. Capacity and outlets must refer to the same route. These simplifications do not replace a detailed industrial balance.',
      context:'Documentary context: the European Commission and trade associations describe quality and outlet constraints. No model coefficient is calibrated to their data.',
      privacy:'Local calculations. No account, cookies, trackers or API requests. External documentary links are opened only when you choose them.',
      version:'Version: 6 September 2026', error:'Enter all five values within the displayed limits. Quantities must be whole tonnes; percentages can have one decimal place.',
      invalid:'Results are hidden while an input is invalid.', binding:'Binding constraint: ', quality:'compatible feedstock', capacity:'processing capacity', outlets:'commercial outlets', empty:'No incoming material in this scenario.',
      share:'of the incoming scrap volume recovered as metal.', chartTitle:'Breakdown of incoming material', chartDesc:'Hypothetical scenario: recovered metal, route residues and material still needing an outlet.',
      balance:'Incoming = metal + residues + unassigned', pageTitle:'Aluminium scrap: outlet simulator | l0g'
    },
    fr: {
      error:'Renseignez les cinq valeurs dans les limites affichées. Quantités en tonnes entières ; pourcentages avec une décimale au maximum.',
      invalid:'Les résultats sont masqués tant qu’une valeur est invalide.', binding:'Contrainte limitante : ', quality:'matière compatible', capacity:'capacité de traitement', outlets:'débouchés commerciaux',
      empty:'Aucune matière entrante dans ce scénario.', share:'du volume entrant récupéré sous forme de métal.', chartTitle:'Répartition de la matière entrante',
      chartDesc:'Scénario fictif : métal récupéré, résidus du circuit et matière encore à orienter.', balance:'Entrant = métal + résidus + matière à orienter', pageTitle:'Déchets d’aluminium : simulateur de débouchés | l0g'
    }
  };
  const form = document.getElementById('scenario');
  const keys = ['q','a','c','d','y'];
  const inputs = Object.fromEntries(keys.map(k=>[k,document.getElementById(k)]));
  const textNodes = [...document.querySelectorAll('[data-t]')];
  for (const node of textNodes) translations.fr[node.dataset.t] = node.textContent;
  const presets = {
    capacity:{q:100000,a:70,c:60000,d:80000,y:90},
    quality:{q:100000,a:40,c:80000,d:80000,y:90},
    aligned:{q:100000,a:90,c:90000,d:90000,y:90}
  };
  let lang = new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'fr';
  const number = (x, digits=0) => new Intl.NumberFormat(lang==='fr'?'fr-FR':'en-GB', {maximumFractionDigits:digits}).format(x);
  function showLanguage() {
    const t=translations[lang];
    document.documentElement.lang=lang;
    document.title=t.pageTitle;
    for (const node of textNodes) node.textContent=t[node.dataset.t];
    const button=document.getElementById('language');
    button.textContent=lang==='fr'?'English':'Français';
    button.lang=lang==='fr'?'en':'fr';
    document.getElementById('balance-title').textContent=t.chartTitle;
    document.getElementById('balance-desc').textContent=t.chartDesc;
    update();
  }
  function showInvalid() {
    document.getElementById('error').hidden=false;
    document.getElementById('error').textContent=translations[lang].error;
    document.getElementById('result-content').hidden=true;
    document.getElementById('binding').textContent=translations[lang].invalid;
  }
  function update() {
    const input={}; let valid=true;
    for (const key of keys) {
      const element=inputs[key];
      const ok=element.value!=='' && element.checkValidity() && Number.isFinite(element.valueAsNumber);
      element.setAttribute('aria-invalid',String(!ok));
      valid=valid&&ok; input[key]=element.valueAsNumber;
    }
    if (!valid) { showInvalid(); return; }
    let result;
    try { result=AluminiumScenario.compute(input); } catch (_) { showInvalid(); return; }
    document.getElementById('error').hidden=true;
    document.getElementById('result-content').hidden=false;
    for (const key of ['compatible','treated','metal','residual','unassigned']) {
      document.getElementById(key).textContent=number(result[key],1);
    }
    const t=translations[lang];
    document.getElementById('binding').textContent=input.q===0?t.empty:t.binding+result.binding.map(k=>t[k]).join(' + ')+'.';
    document.getElementById('share').textContent=number(result.recoveredShare,1)+' % '+t.share;
    document.getElementById('balance-equation').textContent=t.balance+'\n'+number(input.q,1)+' = '+number(result.metal,1)+' + '+number(result.residual,1)+' + '+number(result.unassigned,1)+' t';
    let x=1;
    for (const key of ['metal','residual','unassigned']) {
      const width=input.q===0?0:398*result[key]/input.q;
      const bar=document.getElementById('bar-'+key); bar.setAttribute('x',String(x)); bar.setAttribute('width',String(width)); x+=width;
    }
    document.getElementById('balance-desc').textContent=t.chartDesc+' '+t.metal+': '+number(result.metal,1)+' t; '+t.residual+': '+number(result.residual,1)+' t; '+t.unassigned+': '+number(result.unassigned,1)+' t.';
    for (const button of document.querySelectorAll('[data-preset]')) {
      const scenario=presets[button.dataset.preset];
      button.setAttribute('aria-pressed',String(keys.every(k=>input[k]===scenario[k])));
    }
  }
  form.addEventListener('submit',event=>event.preventDefault());
  form.addEventListener('input',update);
  form.addEventListener('reset',()=>setTimeout(update,0));
  for (const button of document.querySelectorAll('[data-preset]')) button.addEventListener('click',()=>{
    const scenario=presets[button.dataset.preset];
    for (const key of keys) inputs[key].value=String(scenario[key]);
    update();
  });
  document.getElementById('language').addEventListener('click',()=>{lang=lang==='fr'?'en':'fr';showLanguage();});
  document.getElementById('theme').addEventListener('click',()=>{
    document.documentElement.dataset.theme=document.documentElement.dataset.theme==='light'?'dark':'light';
  });
  showLanguage();
})();
