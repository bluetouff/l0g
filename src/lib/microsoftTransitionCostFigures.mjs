// Inert authored SVG. Article props and external data never enter this markup.
const native = { ink:'#0c0d10',surface:'#121419','surface-2':'#171a20',paper:'#e7e9ee',muted:'#8b909b','line-strong':'rgba(255, 255, 255, 0.20)',signal:'#5eead4',amber:'#f5b13d',accent:'#ff4d87' };
const C = Object.fromEntries(Object.entries(native).map(([role,value])=>[role,`var(--color-${role}, ${value})`]));
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const text = (x,y,value,size=20,color=C.paper,weight=400,anchor='start') => `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${escape(value)}</text>`;
const rect = (x,y,width,height,fill=C.surface,radius=0,stroke='none',strokeWidth=1) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
const line = (x1,y1,x2,y2,color=C['line-strong'],width=2,dash='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const path = (d,color,width=2,fill='none',dash='') => `<path d="${d}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const region = (name,x,y,width,height,body) => `<g data-region="${name}" data-bounds="${x} ${y} ${width} ${height}">${body}</g>`;
const labels = (name,x,y,width,height,values,size=20,color=C.paper,anchor='start',weight=400,gap=size+8) => region(name,x,y,width,Math.max(height,Math.ceil(size*1.3)+14+(values.length-1)*gap),values.map((value,i)=>text(anchor==='middle'?x+width/2:anchor==='end'?x+width-8:x+8,y+size+8+i*gap,value,size,color,weight,anchor)).join(''));
function arrow(x1,y1,x2,y2,color=C.signal,dash='') {
  const angle=Math.atan2(y2-y1,x2-x1),length=8,spread=4;
  const bx=x2-Math.cos(angle)*length,by=y2-Math.sin(angle)*length;
  return line(x1,y1,x2,y2,color,2,dash)+path(`M${bx-Math.sin(angle)*spread} ${by+Math.cos(angle)*spread} L${x2} ${y2} L${bx+Math.sin(angle)*spread} ${by-Math.cos(angle)*spread}`,color,2);
}
function shell(id,width,height,title,desc,body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="width:100%;height:auto" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${escape(title)}</title><desc id="${id}-desc">${escape(desc)}</desc>${rect(0,0,width,height,C.ink,18)}${body}</svg>`;
}
function heading(mobile,section,title,subtitle) {
  const width=mobile?400:1000;
  return labels('eyebrow',24,16,width-48,34,[`l0g / ${section}`],mobile?13:15,C.signal,'start',700)
    +labels('heading',24,55,width-48,mobile?82:59,mobile?title:[title.join(' ')],mobile?28:34,C.paper,'start',700,mobile?34:42)
    +labels('subtitle',24,mobile?141:116,width-48,mobile?63:40,mobile?subtitle:[subtitle.join(' · ')],mobile?15:18,C.muted,'start',400,mobile?23:26);
}


// Government response Umdruck 20/7214, 21 September 2026, page 3.
// Whole euros preserve the published precision; displayed millions are rounded.
export const SPENDING = Object.freeze([
  Object.freeze({period:'2024–2025',partial:false,libreOffice:2495000,openXchange:15576600}),
  Object.freeze({period:'2026',partial:true,libreOffice:253000,openXchange:1674700}),
]);
export const SPENDING_SCALE = Object.freeze({maximum:18000000,desktopPixels:610,mobilePixels:290});
export const OVERLAP_SCOPE = Object.freeze({kind:'generic-method',durationScale:false,costScale:false,exitCondition:'service-closed-and-contract-adjusted',partialWaves:true});
const value = (euros,lang) => (euros/1000000).toFixed(2).replace('.',lang==='fr'?',':'.');

function spending(lang,mobile) {
  const fr=lang==='fr',width=mobile?400:1000;
  const title=fr?['Les dépenses déclarées','pour deux projets']:['Reported spending','on two projects'];
  let body=heading(mobile,fr?'FINANCER LA TRANSITION':'FUNDING THE TRANSITION',title,fr?['Schleswig-Holstein · LibreOffice et Open-Xchange','Réponse du 21 septembre 2026']:[mobile?'Schleswig-Holstein · two projects':'Schleswig-Holstein · LibreOffice and Open-Xchange','Response dated 21 September 2026']);
  const x=mobile?40:248,plotWidth=mobile?290:610,scale=plotWidth/SPENDING_SCALE.maximum;
  const rows=mobile?[332,439,635,742]:[251,319,450,518];
  const periods=mobile?[219,522]:[177,376];
  for(let j=0;j<2;j++) {
    const datum=SPENDING[j];
    body+=labels(`period-${j}`,24,periods[j],width-48,mobile?68:40,mobile?(j===0?(fr?['2024–2025','Deux années cumulées']:['2024–2025','Two years combined']):(fr?['2026 · dépenses à date','Année partielle à la réponse']:['2026 · spending to date','Partial year at the response date'])):[j===0?(fr?'2024–2025 · deux années cumulées':'2024–2025 · two years combined'):(fr?'2026 · dépenses à date · année partielle':'2026 · spending to date · partial year')],mobile?18:21,C.paper,'start',700,27);
    for(let k=0;k<2;k++) {
      const key=k===0?'libreOffice':'openXchange',name=k===0?'LibreOffice':'Open-Xchange',amount=datum[key],y=rows[j*2+k],color=k===0?C.signal:C.amber,w=amount*scale;
      body+=labels(`project-${j}-${k}`,24,mobile?y-43:y-4,mobile?352:202,38,[name],mobile?18:20,C.paper,'start',500);
      body+=`<g data-bar="${j}-${key}" data-euros="${amount}" data-scale="${scale}">${rect(x,y,w,32,color,0)}</g>`;
      body+=labels(`amount-${j}-${k}`,x+w+7,y-7,mobile?78:100,48,[value(amount,lang)],mobile?18:22,color,'start',700);
    }
  }
  const axisY=mobile?817:581;
  body+=line(x,axisY,x+plotWidth,axisY,C['line-strong'],1);
  for(const tick of [0,5,10,15,18]) {
    const tx=x+tick/18*plotWidth;
    body+=line(tx,axisY,tx,axisY+7,C.muted,1);
    body+=labels(`tick-${tick}`,tx-21,axisY+10,42,38,[String(tick)],mobile?14:16,C.muted,'middle');
  }
  body+=labels('unit',24,mobile?863:620,width-48,40,[fr?'Millions d’euros · même échelle pour les quatre barres':'Millions of euros · one scale for all four bars'],mobile?13:16,C.muted,'start');
  if(mobile) {
    body+=labels('scope',24,908,352,83,fr?['Champ : deux projets seulement.','Développement, migration et formations ;','conduite du changement pour LibreOffice.']:['Scope: these two projects only.','Development, migration and training;','change management for LibreOffice.'],14,C.muted,'start',400,23);
    body+=labels('source',24,996,352,67,fr?['Source : Landtag, Umdruck 20/7214, p. 3.','Montants affichés arrondis à 0,01 M€.']:['Source: Landtag, Umdruck 20/7214, p. 3.','Displayed amounts rounded to €0.01m.'],13,C.muted,'start',400,22);
  } else {
    body+=labels('source',24,661,952,33,[fr?'Source : Landtag, 20/7214, p. 3 · Deux projets seulement · Montants arrondis à 0,01 M€.':'Source: Landtag, 20/7214, p. 3 · These two projects only · Amounts rounded to €0.01m.'],14,C.muted,'start');
  }
  return shell(`microsoft-transition-cost-spending-${lang}-${mobile?'mobile':'desktop'}`,width,mobile?1080:700,title.join(' '),fr?'Dépenses déclarées pour LibreOffice et Open-Xchange dans la réponse du gouvernement du Schleswig-Holstein du 21 septembre 2026, page 3. Cumul 2024–2025 : 2,495 et 15,5766 millions d’euros. En 2026, à date de la réponse : 0,253 et 1,6747 million d’euros. Les quatre barres suivent la même échelle linéaire, de zéro à 18 millions d’euros. Les périodes sont distinctes et 2026 est partiel. Champ limité aux deux projets, sans mesure du coût total de sortie ni calcul de rentabilité.':'Spending reported for LibreOffice and Open-Xchange in the Schleswig-Holstein government response of 21 September 2026, page 3. Combined 2024–2025: €2.495m and €15.5766m. In 2026, to the response date: €0.253m and €1.6747m. All four bars use the same linear scale from zero to €18m. The periods differ and 2026 is partial. Scope is limited to these two projects, without an estimate of total exit cost or return on investment.',body);
}

function overlap(lang,mobile) {
  const fr=lang==='fr',width=mobile?400:1000;
  const title=fr?['Financer la période','de coexistence']:['Funding the period','of coexistence'];
  let body=heading(mobile,fr?'LE CALENDRIER DES CHARGES':'WHEN COSTS START AND END',title,fr?['Schéma pédagogique · déroulement par étapes','Durées et montants non représentés']:['Illustrative process · sequence of stages','No duration or spending scale']);
  const panel=(key,x,y,w,h,color=C['surface-2'])=>`<g data-node="${key}">${rect(x,y,w,h,color,6)}</g>`;
  if(!mobile) {
    body+=rect(465,227,283,330,C.surface,10);
    body+=labels('coexistence',465,188,283,38,[fr?'COEXISTENCE':'COEXISTENCE'],16,C.amber,'middle',700);
    body+=labels('prepare-phase',240,188,210,38,[fr?'PRÉPARATION':'PREPARATION'],16,C.muted,'middle',700);
    body+=labels('steady-phase',755,188,213,38,[fr?'EXPLOITATION':'OPERATIONS'],16,C.muted,'middle',700);
    body+=line(248,231,968,231,C['line-strong'],1);
    body+=panel('old-operation',248,267,500,56);
    body+=rect(248,267,5,56,C.amber);
    body+=panel('new-preparation',248,370,196,69);
    body+=panel('validated-waves',480,370,250,69);
    body+=panel('new-maintenance',480,490,488,57);
    body+=rect(480,490,5,57,C.signal);
    body+=labels('old-lane',24,271,207,42,[fr?'Solution existante':'Existing service'],20,C.paper,'start',700);
    body+=labels('old-cost',262,276,469,42,[fr?'Service et contrat encore financés':'Service and contract still funded'],20,C.amber,'middle');
    body+=labels('new-lane',24,368,207,74,fr?['Nouvelle solution','et accompagnement']:['New service','and user support'],18,C.paper,'start',700,26);
    body+=labels('prepare-detail',253,372,186,62,fr?['Adaptations','Formation']:['Adaptation','Training'],18,C.paper,'middle',400,25);
    body+=labels('waves-detail',485,372,240,62,fr?['Valider puis basculer','par vagues']:['Validate, then switch','in waves'],18,C.signal,'middle',700,25);
    body+=`<g data-edge="preparation-to-waves">${arrow(450,404,474,404)}</g>`;
    body+=`<g data-edge="waves-to-support">${arrow(605,447,605,481)}</g>`;
    body+=labels('support-lane',24,494,207,42,[fr?'Service pérenne':'Ongoing service'],20,C.paper,'start',700);
    body+=labels('maintenance-detail',491,498,465,43,[fr?'Support · maintenance · évolutions':'Support · maintenance · development'],20,C.signal,'middle',500);
    body+=`<g data-gate="conditional-exit">${line(748,257,748,335,C.amber,3)}</g>`;
    body+=labels('exit-condition',758,249,211,90,fr?['Service arrêté','et contrat ajusté','Charges libérées¹']:['Service closed','contract adjusted','Costs released¹'],16,C.amber,'start',700,25);
    body+=labels('condition-note',24,585,952,69,fr?['¹ Fin des charges correspondantes selon les conditions du contrat.','Des vagues partielles peuvent prolonger la coexistence.']:['¹ The corresponding costs end subject to the contract terms.','Partial migration waves can extend the period of coexistence.'],18,C.muted,'start',400,27);
    body+=labels('method-source',24,660,952,35,[fr?'Méthode : Cabinet Office, mars 2022 · Green Book, 2026 · Schéma l0g':'Method: Cabinet Office, March 2022 · Green Book, 2026 · l0g diagram'],14,C.muted,'start');
  } else {
    body+=labels('old-lane',24,218,128,41,[fr?'EXISTANT':'EXISTING'],15,C.amber,'middle',700);
    body+=labels('new-lane',168,218,208,41,[fr?'NOUVEAU':'NEW SERVICE'],15,C.signal,'middle',700);
    body+=panel('old-operation',32,282,112,526);
    body+=rect(32,282,5,526,C.amber);
    body+=panel('new-preparation',176,282,192,176);
    body+=panel('validated-waves',176,511,192,122);
    body+=panel('new-maintenance',176,704,192,105);
    body+=rect(176,704,5,105,C.signal);
    body+=labels('old-cost',36,309,104,143,fr?['Service','et contrat','encore','financés']:['Service','and','contract','funded'],15,C.amber,'middle',700,28);
    body+=labels('prepare-detail',184,301,176,125,fr?['Préparation','Adaptations','Formation']:['Preparation','Adaptation','Training'],18,C.paper,'middle',400,34);
    body+=labels('waves-detail',184,523,176,100,fr?['Validation','puis bascules','par vagues']:['Validation','then switching','in waves'],17,C.signal,'middle',700,27);
    body+=labels('maintenance-detail',184,715,176,85,fr?['Support','et maintenance']:['Support','and maintenance'],18,C.signal,'middle',500,29);
    body+=`<g data-edge="preparation-to-waves">${arrow(272,466,272,501)}</g>`;
    body+=`<g data-edge="waves-to-support">${arrow(272,642,272,694)}</g>`;
    body+=labels('coexistence',168,829,208,66,fr?['Deux environnements','à financer']:['Two environments','to fund'],15,C.muted,'middle');
    body+=`<g data-gate="conditional-exit">${line(26,808,150,808,C.amber,3)}${arrow(88,816,88,884,C.amber)}</g>`;
    body+=panel('exit-condition',32,896,336,112);
    body+=labels('exit-condition-detail',40,900,320,100,fr?['Service arrêté + contrat ajusté','Fin des charges correspondantes','selon les conditions du contrat.']:['Service closed + contract adjusted','The corresponding costs end','subject to the contract terms.'],15,C.amber,'middle',700,28);
    body+=`<g data-edge="continuing-maintenance">${path('M368 756 L383 756 L383 1044 L272 1044 L272 1064',C.signal,2)}${arrow(272,1054,272,1064)}</g>`;
    body+=panel('ongoing-support',32,1076,336,69);
    body+=labels('ongoing-support-detail',40,1082,320,60,fr?['Support, maintenance et évolutions','se poursuivent.']:['Support, maintenance and development','continue.'],15,C.signal,'middle',700,25);
    body+=labels('condition-note',24,1171,352,72,fr?['Des vagues partielles peuvent','prolonger la coexistence.']:['Partial migration waves can','extend the coexistence period.'],16,C.muted,'start',400,26);
    body+=labels('method-source',24,1260,352,66,fr?['Méthode : Cabinet Office, mars 2022','et Green Book, 2026 · Schéma l0g']:['Method: Cabinet Office, March 2022','and Green Book, 2026 · l0g diagram'],13,C.muted,'start',400,23);
  }
  return shell(`microsoft-transition-cost-overlap-${lang}-${mobile?'mobile':'desktop'}`,width,mobile?1344:700,title.join(' '),fr?'Schéma pédagogique générique, sans échelle de temps ni de coûts. La solution existante reste financée pendant la préparation de la nouvelle, les adaptations, la formation et les bascules par vagues validées. La fin des charges correspondantes dépend de l’arrêt effectif de l’ancien service et de l’ajustement du contrat. Des vagues partielles peuvent prolonger la coexistence. La nouvelle solution demande ensuite support, maintenance et évolutions.':'Generic teaching diagram without a time or cost scale. The existing service remains funded during preparation, adaptation, training and validated migration waves. Ending the corresponding costs depends on closing the old service and adjusting its contract. Partial waves may prolong coexistence. The new service continues to require support, maintenance and development.',body);
}

export function microsoftTransitionCostSvg(lang='fr',kind='spending',mobile=false) {
  if(!['fr','en'].includes(lang))throw new RangeError('Unknown Microsoft-transition-cost figure language');
  if(!['spending','overlap'].includes(kind))throw new RangeError('Unknown Microsoft-transition-cost figure kind');
  if(typeof mobile!=='boolean')throw new TypeError('Microsoft-transition-cost mobile flag must be boolean');
  return kind==='spending'?spending(lang,mobile):overlap(lang,mobile);
}
