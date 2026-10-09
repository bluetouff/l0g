// Inert authored SVG. Article props and external data never enter this markup.
const native = { ink:'#0c0d10',surface:'#121419','surface-2':'#171a20',paper:'#e7e9ee',muted:'#8b909b','line-strong':'rgba(255, 255, 255, 0.20)',signal:'#5eead4',amber:'#f5b13d',accent:'#ff4d87' };
const C = Object.fromEntries(Object.entries(native).map(([role,value])=>[role,`var(--color-${role}, ${value})`]));
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const text = (x,y,value,size=20,color=C.paper,weight=400,anchor='start') => `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${escape(value)}</text>`;
const rect = (x,y,width,height,fill=C.surface,radius=0,stroke='none',strokeWidth=1) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
const line = (x1,y1,x2,y2,color=C['line-strong'],width=2,dash='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const path = (d,color,width=2,fill='none',dash='') => `<path d="${d}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const region = (name,x,y,width,height,body) => `<g data-region="${name}" data-bounds="${x} ${y} ${width} ${height}">${body}</g>`;
const labels = (name,x,y,width,height,values,size=20,color=C.paper,anchor='start',weight=400,gap=size+8) => region(name,x,y,width,Math.max(height,Math.ceil(size*1.3)+14+(values.length-1)*gap),values.map((value,i)=>text(anchor==='middle'?x+width/2:anchor==='end'?x+width-8:x+10,y+size+8+i*gap,value,size,color,weight,anchor)).join(''));
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

const node = (name,x,y,w,h,fill=C['surface-2'],stroke='none') => `<g data-node="${name}">${rect(x,y,w,h,fill,8,stroke)}</g>`;
const edge = (name,body) => `<g data-edge="${name}">${body}</g>`;

// Commission Cloud Sovereignty Framework v1.2.1, October 2025, pp. 2 and 6;
// implementation guidance, June 2026, pp. 9–11. The two scores are distinct.
export const SOVEREIGNTY = Object.freeze({
  minimumPerObjective:2, weights:Object.freeze([15,10,10,15,20,15,10,5]),
  aggregateSeal:'minimum', score:'weighted-normalized-objective-scores',
  contribution:'tender-quality', candidateScores:null,
});
// Regulation (EU) 2023/2854, Article 25. Durations are legal bounds, not data
// points or a total migration estimate. No starting date is assigned to the
// seven-month alternative in this figure; Article 25(4) names a transition.
export const SWITCHING = Object.freeze({
  noticeMonths:2, transitionCalendarDays:30, retrievalMinimumCalendarDays:30,
  infeasibilityNoticeWorkingDays:14, alternativeTransitionMonths:7,
  customerExtensions:1, erasureCondition:'successful-switch',
  terminationCondition:'successful-switch', timelineScale:false,
});
const objectiveNames = lang => lang==='fr'
  ? ['Stratégie','Droit et juridiction','Données et IA','Opérations','Chaîne de fournisseurs','Technologie','Sécurité et conformité','Environnement']
  : ['Strategy','Law and jurisdiction','Data and AI','Operations','Supply chain','Technology','Security and compliance','Environment'];

function sovereignty(lang,mobile) {
  const fr=lang==='fr',width=mobile?400:1000,names=objectiveNames(lang);
  const title=fr?['Un seuil, puis','un score pondéré']:['A threshold, then','a weighted score'];
  let body=heading(mobile,fr?'CHOIX DU CLOUD':'CLOUD PROCUREMENT',title,fr?['Marché de la Commission européenne','Cadre 2025 · guide de mise en œuvre 2026']:['European Commission procurement','2025 framework · 2026 implementation guide']);
  if(!mobile) {
    body+=node('objectives',32,184,337,330,C.surface,C['line-strong']);
    body+=labels('objectives-heading',40,191,321,38,[fr?'8 OBJECTIFS ÉVALUÉS':'8 OBJECTIVES ASSESSED'],16,C.paper,'start',700);
    names.forEach((name,i)=>{
      const y=235+i*34;
      body+=labels(`objective-${i+1}`,44,y,313,34,[`${i+1} · ${name}`],17,C.paper);
      body+=edge(`objective-${i+1}-to-threshold`,path(`M377 ${y+20} C401 ${y+20} 410 326 437 326`,C.muted,1.5));
    });
    body+=node('minimum-gate',445,222,224,202,C.surface,C.signal);
    body+=labels('threshold-heading',453,233,208,36,[fr?'SEUIL DU MARCHÉ':'TENDER THRESHOLD'],15,C.signal,'middle',700);
    body+=labels('minimum',453,272,208,72,['SEAL 2'],40,C.paper,'middle',700);
    body+=labels('minimum-rule',453,346,208,70,fr?['Au minimum sur','chacun des 8 objectifs']:['Minimum required','for every objective'],17,C.paper,'middle',500,26);
    body+=edge('threshold-passed',arrow(677,287,713,287));
    body+=node('eligible',722,236,246,147);
    body+=labels('eligible-label',730,249,230,114,fr?['SEUIL SATISFAIT','L’offre peut être','comparée par son score']:['THRESHOLD MET','The offer can proceed','to score comparison'],17,C.signal,'middle',700,31);
    body+=edge('threshold-failed',arrow(557,432,557,466,C.amber));
    body+=labels('rejection',429,472,274,61,fr?['Un objectif sous le seuil :','offre écartée']:['Any objective below the threshold:','offer rejected'],15,C.amber,'middle',500,24);
    body+=edge('eligible-to-score',path('M845 391 L845 542 L430 542',C.signal)+arrow(430,542,430,566));
    body+=labels('weights-heading',24,570,784,38,[fr?'Poids des objectifs 1 à 8 · total 100 %':'Weights of objectives 1 to 8 · total 100%'],17,C.paper,'start',700);
    let x=32;
    SOVEREIGNTY.weights.forEach((weight,i)=>{
      const w=772*weight/100;
      body+=`<g data-weight="${weight}" data-objective="${i+1}">${rect(x,617,w,43,C.signal)}${i?line(x,617,x,660,C.ink,2):''}</g>`;
      body+=labels(`weight-${i+1}`,x,621,w,35,[`${weight}${fr?' %':'%'}`],13,C.ink,'middle',700);
      body+=labels(`weight-index-${i+1}`,x,666,w,31,[String(i+1)],13,C.muted,'middle');
      x+=w;
    });
    body+=edge('score-to-quality',arrow(814,637,836,637));
    body+=labels('quality',840,592,136,95,fr?['Contribue','au score','de qualité']:['Contributes','to the','quality score'],17,C.signal,'middle',700,26);
    body+=labels('sovereignty-source',24,711,952,35,[fr?'Source : Commission européenne · Score de chaque objectif normalisé par son maximum, puis pondéré.':'Source: European Commission · Each objective score is divided by its maximum, then weighted.'],13,C.muted);
  } else {
    body+=node('objectives',32,220,336,333,C.surface,C['line-strong']);
    body+=labels('objectives-heading',40,229,320,38,[fr?'8 OBJECTIFS ÉVALUÉS':'8 OBJECTIVES ASSESSED'],16,C.paper,'start',700);
    names.forEach((name,i)=>body+=labels(`objective-${i+1}`,44,271+i*34,312,34,[`${i+1} · ${name}`],17));
    body+=edge('objectives-to-threshold',arrow(200,561,200,595));
    body+=node('minimum-gate',32,605,336,169,C.surface,C.signal);
    body+=labels('threshold-heading',40,613,320,38,[fr?'SEUIL DU MARCHÉ':'TENDER THRESHOLD'],15,C.signal,'middle',700);
    body+=labels('minimum',40,651,320,62,['SEAL 2'],40,C.paper,'middle',700);
    body+=labels('minimum-rule',40,716,320,45,[fr?'Au minimum sur chacun des 8 objectifs':'Minimum required for every objective'],16,C.paper,'middle',500);
    body+=edge('threshold-passed',arrow(116,782,116,821));
    body+=edge('threshold-failed',arrow(284,782,284,821,C.amber));
    body+=node('eligible',32,831,158,116);
    body+=labels('eligible-label',40,841,142,96,fr?['Seuil satisfait','Score comparé']:['Threshold met','Score compared'],16,C.signal,'middle',700,35);
    body+=node('rejected',210,831,158,116);
    body+=labels('rejection',218,836,142,103,fr?['Un objectif','sous le seuil :','offre écartée']:['Any objective','below threshold:','offer rejected'],15,C.amber,'middle',500,28);
    body+=edge('eligible-to-score',path('M116 955 L116 981 L200 981',C.signal)+arrow(200,981,200,1007));
    body+=labels('weights-heading',24,1019,352,68,fr?['Poids des objectifs 1 à 8','Total : 100 %']:['Weights of objectives 1 to 8','Total: 100%'],17,C.paper,'start',700,26);
    let y=1110;
    SOVEREIGNTY.weights.forEach((weight,i)=>{
      const h=300*weight/100;
      body+=`<g data-weight="${weight}" data-objective="${i+1}">${rect(48,y,92,h,C.signal)}${i?line(48,y,140,y,C.ink,2):''}</g>`;
      body+=labels(`weight-${i+1}`,153,y+h/2-19,215,38,[`${fr?'Objectif':'Objective'} ${i+1} · ${weight}${fr?' %':'%'}`],15,C.paper);
      y+=h;
    });
    body+=edge('score-to-quality',arrow(200,1430,200,1460));
    body+=labels('quality',24,1470,352,68,fr?['Le score de souveraineté','contribue au score de qualité.']:['The sovereignty score contributes','to the tender’s quality score.'],18,C.signal,'middle',700,29);
    body+=labels('sovereignty-source',24,1560,352,108,fr?['Source : Commission européenne.','Chaque score est divisé par son','maximum, puis pondéré.','Aucune note de candidat représentée.']:['Source: European Commission.','Each score is divided by its maximum,','then weighted.','No candidate scores are shown.'],13,C.muted,'start',400,24);
  }
  const desc=fr?'Marché cloud de la Commission européenne. Huit objectifs doivent chacun atteindre au moins SEAL 2. Un seul objectif insuffisant entraîne le rejet. Le niveau SEAL global est le minimum des huit niveaux, et non leur moyenne. Les offres satisfaisant le seuil peuvent ensuite être comparées par leur score de souveraineté : chaque score d’objectif est divisé par son maximum, puis pondéré à 15, 10, 10, 15, 20, 15, 10 et 5 pour cent. Ce score contribue au score de qualité. Aucun score candidat ni poids dans la note finale du marché n’est représenté.':'European Commission cloud procurement. All eight objectives must reach at least SEAL 2. Failure on any objective leads to rejection. The overall SEAL is the minimum of the eight levels, not their average. Offers meeting the threshold can then be compared through their sovereignty score: each objective score is divided by its maximum and weighted at 15, 10, 10, 15, 20, 15, 10 and 5 percent. The result contributes to the quality score. No candidate scores or weight within the overall tender score are represented.';
  return shell(`microsoft-choice-sovereignty-${lang}-${mobile?'mobile':'desktop'}`,width,mobile?1690:758,title.join(' '),desc,body);
}

function switching(lang,mobile) {
  const fr=lang==='fr',width=mobile?400:1000;
  const title=fr?['Les étapes','d’une sortie cloud']:['The stages','of a cloud exit'];
  let body=heading(mobile,'DATA ACT',title,fr?['Contrat de service couvert · article 25','Délais distincts · schéma sans échelle de temps']:['Covered service contract · Article 25','Separate deadlines · diagram not to time scale']);
  if(!mobile) {
    body+=node('technical-extension',32,190,460,124,C.surface,C.amber);
    body+=labels('technical-label',40,198,444,108,fr?['IMPOSSIBILITÉ TECHNIQUE MOTIVÉE','Notification sous 14 jours ouvrables dès la demande','Transition alternative : 7 mois au maximum']:['JUSTIFIED TECHNICAL INFEASIBILITY','Notice within 14 working days of the switching request','Alternative transition: up to 7 months'],16,C.amber,'start',500,31);
    body+=node('customer-extension',534,190,434,124,C.surface,C.signal);
    body+=labels('customer-label',542,198,418,107,fr?['CHOIX DU CLIENT','Une prolongation de la transition','Pour une durée qu’il juge appropriée']:['CUSTOMER’S CHOICE','One extension of the transition','For a period the customer considers appropriate'],16,C.signal,'start',500,31);
    body+=edge('technical-to-transition',path('M262 322 L262 338 L400 338',C.amber));
    body+=edge('customer-to-transition',path('M751 322 L751 338 L400 338',C.signal));
    body+=edge('extensions-modify-transition',arrow(400,338,400,360));
    body+=node('notice',32,370,202,222);
    body+=node('transition',276,370,254,222);
    body+=node('retrieval',572,370,218,222);
    body+=node('erasure',830,370,138,222);
    body+=labels('notice-stage',40,382,186,38,[fr?'PRÉAVIS':'NOTICE'],15,C.muted,'start',700);
    body+=labels('notice-duration',40,425,186,57,[fr?'≤ 2 mois':'≤ 2 months'],29,C.paper,'start',700);
    body+=labels('notice-rule',40,487,186,83,fr?['À compter de','la demande','de changement']:['From the','switching request'],17,C.paper,'start',400,26);
    body+=edge('notice-to-transition',arrow(242,477,268,477));
    body+=labels('transition-stage',284,382,238,38,[fr?'TRANSITION':'TRANSITION'],15,C.muted,'start',700);
    body+=labels('transition-duration',284,425,238,57,[fr?'≤ 30 jours':'≤ 30 days'],30,C.paper,'start',700);
    body+=labels('transition-rule',284,487,238,84,fr?['Calendaires · règle normale','Après le préavis','Service maintenu']:['Calendar days · standard rule','After the notice period','Service continues'],16,C.paper,'start',400,26);
    body+=edge('transition-to-retrieval',arrow(538,477,564,477));
    body+=labels('retrieval-stage',580,382,202,38,[fr?'RÉCUPÉRATION':'RETRIEVAL'],15,C.muted,'start',700);
    body+=labels('retrieval-duration',580,425,202,57,[fr?'≥ 30 jours':'≥ 30 days'],29,C.paper,'start',700);
    body+=labels('retrieval-rule',580,487,202,83,fr?['Calendaires','Après la fin de','la transition convenue']:['Calendar days','After the agreed','transition ends'],16,C.paper,'start',400,26);
    body+=edge('retrieval-to-erasure',arrow(798,477,822,477));
    body+=labels('erasure-stage',838,382,122,38,[fr?'EFFACEMENT':'ERASURE'],13,C.muted,'middle',700);
    body+=labels('erasure-rule',838,438,122,140,fr?['Après le délai','de récupération','ou à une date','ultérieure','convenue','Si le changement','a réussi']:['After the','retrieval period','or at a later','agreed date','If switching','succeeded'],13,C.paper,'middle',500,21);
    body+=labels('termination',24,615,952,44,[fr?'Au succès du changement : résiliation du contrat, notifiée par le fournisseur.':'On successful switching: the provider notifies the customer of contract termination.'],18,C.signal,'start',500);
    body+=labels('switching-source',24,674,952,34,[fr?'Source : règlement (UE) 2023/2854, article 25, § 2 à 5 · Les branches modifient la transition.':'Source: Regulation (EU) 2023/2854, Article 25(2)–(5) · Branches modify the transition.'],13,C.muted);
  } else {
    body+=node('notice',32,220,336,152);
    body+=labels('notice-stage',40,228,320,38,[fr?'PRÉAVIS':'NOTICE'],15,C.muted,'start',700);
    body+=labels('notice-duration',40,267,320,54,[fr?'≤ 2 mois':'≤ 2 months'],32,C.paper,'start',700);
    body+=labels('notice-rule',40,326,320,38,[fr?'Dès la demande de changement':'From the switching request'],16,C.paper);
    // A through-route and two optional branches converge on the transition.
    body+=edge('notice-to-transition',path('M200 380 L200 698',C.muted)+arrow(200,698,200,720,C.muted));
    body+=node('technical-extension',24,429,156,225,C.surface,C.amber);
    body+=node('customer-extension',220,429,156,225,C.surface,C.signal);
    body+=labels('technical-label',32,438,140,209,fr?['Impossibilité','technique motivée','Notification sous','14 jours ouvrables','dès la demande','Transition alternative','≤ 7 mois']:['Justified technical','infeasibility','Notice within','14 working days','of the request','Alternative transition','≤ 7 months'],13,C.amber,'middle',500,27);
    body+=labels('customer-label',228,448,140,182,fr?['Choix du client','Une prolongation','de la transition','Durée qu’il juge','appropriée']:['Customer’s choice','One extension','of the transition','For a period','the customer','deems suitable'],14,C.signal,'middle',500,28);
    body+=edge('technical-to-transition',path('M102 662 L102 690 L200 690',C.amber));
    body+=edge('customer-to-transition',path('M298 662 L298 690 L200 690',C.signal));
    body+=node('transition',32,730,336,200);
    body+=labels('transition-stage',40,740,320,38,[fr?'TRANSITION':'TRANSITION'],15,C.muted,'start',700);
    body+=labels('transition-duration',40,781,320,53,[fr?'≤ 30 jours calendaires':'≤ 30 calendar days'],27,C.paper,'start',700);
    body+=labels('transition-rule',40,841,320,82,fr?['Règle normale, après le préavis','Service maintenu','Les branches modifient cette période.']:['Standard rule, after the notice period','Service continues','Branches modify this period.'],16,C.paper,'start',400,26);
    body+=edge('transition-to-retrieval',arrow(200,938,200,987));
    body+=node('retrieval',32,997,336,178);
    body+=labels('retrieval-stage',40,1007,320,38,[fr?'RÉCUPÉRATION':'RETRIEVAL'],15,C.muted,'start',700);
    body+=labels('retrieval-duration',40,1048,320,53,[fr?'≥ 30 jours calendaires':'≥ 30 calendar days'],27,C.paper,'start',700);
    body+=labels('retrieval-rule',40,1107,320,60,fr?['Après la fin de la transition','convenue avec le fournisseur']:['After the transition agreed','with the provider has ended'],17,C.paper,'start',400,27);
    body+=edge('retrieval-to-erasure',arrow(200,1183,200,1223));
    body+=node('erasure',32,1233,336,155);
    body+=labels('erasure-stage',40,1243,320,38,[fr?'EFFACEMENT':'ERASURE'],15,C.muted,'start',700);
    body+=labels('erasure-rule',40,1285,320,91,fr?['Après le délai de récupération,','ou à une date ultérieure convenue,','si le changement a réussi.']:['After the retrieval period,','or at a later agreed date,','if switching has succeeded.'],17,C.paper,'start',400,27);
    body+=labels('termination',24,1415,352,110,fr?['Au succès du changement :','résiliation du contrat,','notifiée par le fournisseur.']:['On successful switching:','the provider notifies the customer','of contract termination.'],18,C.signal,'start',500,29);
    body+=labels('switching-source',24,1550,352,72,fr?['Source : règlement (UE) 2023/2854,','article 25, § 2 à 5.']:['Source: Regulation (EU) 2023/2854,','Article 25(2)–(5).'],13,C.muted,'start',400,24);
  }
  const desc=fr?'Article 25 du Data Act, services couverts. Dès la demande, préavis de deux mois au maximum, puis transition normalement de trente jours calendaires au maximum, avec continuité du service. Si ce délai est techniquement impossible, le fournisseur le justifie et le notifie sous quatorze jours ouvrables à compter de la demande, avec une transition alternative de sept mois au maximum. Le client peut prolonger la transition une fois pour une durée qu’il juge appropriée. Le schéma ne calcule aucune durée totale et ne fixe pas le départ des sept mois. La récupération dure au moins trente jours calendaires après la fin de la transition convenue. L’effacement suit ce délai, ou une date ultérieure convenue, si le changement a réussi. Le contrat est résilié au succès du changement, avec notification au client.':'Article 25 of the Data Act for covered services. The request starts a notice period of up to two months, followed by a standard transition of up to thirty calendar days with service continuity. If this is technically unfeasible, the provider must justify and notify it within fourteen working days of the request, with an alternative transition of up to seven months. The customer may extend the transition once for a period it considers appropriate. This diagram calculates no total duration and assigns no starting point to the seven months. Retrieval lasts at least thirty calendar days after the agreed transition ends. Erasure follows that period, or a later agreed date, if switching succeeded. The contract terminates on successful switching and the customer is notified.';
  return shell(`microsoft-choice-switching-${lang}-${mobile?'mobile':'desktop'}`,width,mobile?1650:722,title.join(' '),desc,body);
}

export function microsoftChoiceSvg(lang='fr',kind='sovereignty',mobile=false) {
  if(!['fr','en'].includes(lang))throw new RangeError('Unknown Microsoft-choice figure language');
  if(!['sovereignty','switching'].includes(kind))throw new RangeError('Unknown Microsoft-choice figure kind');
  if(typeof mobile!=='boolean')throw new TypeError('Microsoft-choice mobile flag must be boolean');
  return kind==='sovereignty'?sovereignty(lang,mobile):switching(lang,mobile);
}
