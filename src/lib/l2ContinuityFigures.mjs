// This module contains only controlled diagrams. Article captions and source
// references remain escaped by Astro; arbitrary markup never enters these SVGs.
const native = { ink:'#0c0d10',surface:'#121419','surface-2':'#171a20',paper:'#e7e9ee',muted:'#8b909b','line-strong':'rgba(255, 255, 255, 0.20)',signal:'#5eead4',amber:'#f5b13d',accent:'#ff4d87' };
const C = Object.fromEntries(Object.entries(native).map(([role,value])=>[role,`var(--color-${role}, ${value})`]));
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const text = (x,y,value,size=20,color=C.paper,weight=400,anchor='start') => `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${escape(value)}</text>`;
const rect = (x,y,width,height,fill=C.surface,radius=0,stroke='none',strokeWidth=1) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
const line = (x1,y1,x2,y2,color=C['line-strong'],width=2,dash='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const circle = (x,y,radius,fill=C.surface,stroke='none',width=1) => `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const path = (d,color,width=2,fill='none',dash='') => `<path d="${d}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const region = (name,x,y,width,height,body) => `<g data-region="${name}" data-bounds="${x} ${y} ${width} ${height}">${body}</g>`;
const labels = (name,x,y,width,height,lines,size=20,color=C.paper,anchor='start',weight=400,gap=size+8) => region(name,x,y,width,height,lines.map((value,i)=>value?text(anchor==='middle'?x+width/2:anchor==='end'?x+width-8:x+8,y+size+8+i*gap,value,size,color,weight,anchor):'').join(''));
function arrow(x1,y1,x2,y2,color=C.signal,dash='') {
  const angle=Math.atan2(y2-y1,x2-x1),length=8,spread=4;
  const bx=x2-Math.cos(angle)*length,by=y2-Math.sin(angle)*length;
  return line(x1,y1,x2,y2,color,2,dash)+path(`M${bx-Math.sin(angle)*spread} ${by+Math.cos(angle)*spread} L${x2} ${y2} L${bx+Math.sin(angle)*spread} ${by-Math.cos(angle)*spread}`,color,2);
}
function person(x,y,s,color) {
  return circle(x,y-s*.23,s*.14,'none',color,3)+path(`M${x-s*.3} ${y+s*.3} C${x-s*.3} ${y-s*.02} ${x+s*.3} ${y-s*.02} ${x+s*.3} ${y+s*.3}`,color,3)+line(x-s*.3,y+s*.3,x+s*.3,y+s*.3,color,3);
}
function application(x,y,s,color) {
  let body=rect(x-s*.36,y-s*.36,s*.72,s*.72,C.surface,8,color,2);
  for(const dx of [-.16,.16]) for(const dy of [-.16,.16]) body+=rect(x+s*dx-s*.065,y+s*dy-s*.065,s*.13,s*.13,color,2);
  return body;
}
function block(x,y,s,color) {
  return path(`M${x} ${y-s*.34} L${x+s*.32} ${y-s*.15} L${x+s*.32} ${y+s*.21} L${x} ${y+s*.4} L${x-s*.32} ${y+s*.21} L${x-s*.32} ${y-s*.15} L${x} ${y-s*.34}`,color,2)
    +line(x-s*.32,y-s*.15,x,y+s*.04,color,2)+line(x+s*.32,y-s*.15,x,y+s*.04,color,2)+line(x,y+s*.04,x,y+s*.4,color,2);
}
function ethereum(x,y,s,color) {
  return path(`M${x} ${y-s*.42} L${x-s*.24} ${y+s*.02} L${x} ${y+s*.17} L${x+s*.24} ${y+s*.02} L${x} ${y-s*.42}`,color,2)
    +path(`M${x-s*.24} ${y+s*.1} L${x} ${y+s*.42} L${x+s*.24} ${y+s*.1} L${x} ${y+s*.23} L${x-s*.24} ${y+s*.1}`,color,2)
    +line(x,y-s*.42,x,y+s*.17,C['line-strong'],1);
}
function support(x,y,s,color) {
  return circle(x,y-s*.17,s*.17,'none',color,2)+path(`M${x-s*.34} ${y+s*.1} L${x-s*.16} ${y+s*.3} L${x+s*.16} ${y+s*.3} L${x+s*.34} ${y+s*.1}`,color,3)+line(x-s*.34,y+s*.1,x-s*.18,y+s*.1,color,3)+line(x+s*.18,y+s*.1,x+s*.34,y+s*.1,color,3);
}
function verify(x,y,s,color) {
  return path(`M${x} ${y-s*.38} L${x+s*.3} ${y-s*.23} L${x+s*.24} ${y+s*.21} L${x} ${y+s*.4} L${x-s*.24} ${y+s*.21} L${x-s*.3} ${y-s*.23} L${x} ${y-s*.38}`,color,2)+path(`M${x-s*.14} ${y} L${x-s*.02} ${y+s*.12} L${x+s*.16} ${y-s*.13}`,color,3);
}
function claim(x,y,s,color) {
  return rect(x-s*.34,y-s*.27,s*.68,s*.55,C.surface,7,color,2)+rect(x+s*.06,y-s*.08,s*.28,s*.16,C.surface,3,color,2)+circle(x+s*.2,y,s*.025,color)+arrow(x-s*.15,y-s*.46,x-s*.15,y-s*.15,color);
}
function shell(id,width,height,title,desc,body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="width:100%;height:auto" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${escape(title)}</title><desc id="${id}-desc">${escape(desc)}</desc>${rect(0,0,width,height,C.ink,18)}${body}</svg>`;
}
function heading(mobile,section,title,subtitle) {
  const width=mobile?400:1000;
  return labels('eyebrow',24,15,width-48,34,[`l0g / ${section}`],mobile?13:15,C.signal,'start',700)
    +labels('heading',24,51,width-48,mobile?79:58,mobile?title:[title.join(' ')],mobile?28:34,C.paper,'start',700,mobile?33:42)
    +labels('subtitle',24,mobile?135:112,width-48,mobile?61:37,mobile?subtitle:[subtitle.join(' ')],mobile?15:18,C.muted,'start',400,mobile?23:26);
}

export const L2_FEE_PERIOD = Object.freeze({ from:'2026-09-01', through:'2026-09-30', timezone:'UTC', days:30 });
export const L2_DAILY_FEES_USD = Object.freeze({
  blast:Object.freeze([14,20,17,47,10,9.07,15,118,11,31,52,425,46,55,14,16,11,374,98,35,53,76,76,22,92,22,51,203,31,23]),
  abstract:Object.freeze([4173,4078,4175,3628,3231,3272,2844,3002,2888,2959,3034,2723,2465,3214,3765,4297,4322,6053,4731,4899,4511,5453,5279,4985,4504,4327,5725,5092,3345,4309]),
});
// Integer cents preserve the source's cents without summing binary decimals.
export const L2_FEES_USD = Object.freeze(Object.fromEntries(Object.entries(L2_DAILY_FEES_USD).map(([chain,values])=>[chain,values.reduce((sum,value)=>sum+Math.round(value*100),0)/100])));

export function l2ContinuitySvg(lang='fr',kind='money',mobile=false) {
  if (!['fr','en'].includes(lang)) throw new RangeError('Unknown L2-continuity figure language');
  if (!['money','fees','exit'].includes(kind)) throw new RangeError('Unknown L2-continuity figure kind');
  if (typeof mobile!=='boolean') throw new TypeError('L2-continuity mobile flag must be boolean');
  const fr=lang==='fr',width=mobile?400:1000,id=`l2-continuity-${kind}-${lang}-${mobile?'mobile':'desktop'}`;
  if (kind==='money') {
    const title=fr?['Deux circuits derrière','un achat sur la chaîne']:['Two circuits behind','an on-chain purchase'];
    const subtitle=fr?['Le paiement dans l’application et les frais','du réseau suivent des destinations distinctes.']:['The app payment and network fees','follow separate routes.'];
    let body=heading(mobile,fr?'LE TRAJET DE L’ARGENT':'FOLLOWING THE MONEY',title,subtitle);
    if (mobile) {
      body+=circle(74,245,34,C['surface-2'],C['line-strong'],1)+person(74,245,55,C.paper);
      body+=circle(322,245,34,C['surface-2'],C['line-strong'],1)+application(322,245,55,C.signal);
      body+=arrow(116,245,278,245,C.signal);
      body+=labels('purchase',110,198,174,37,[fr?'Paiement de l’achat':'Purchase payment'],15,C.signal,'middle',700);
      body+=labels('buyer',24,290,100,60,fr?['Acheteur']:['Buyer'],16,C.paper,'middle',700);
      body+=labels('app',268,290,108,60,fr?['Application']:['Application'],16,C.paper,'middle',700);
      body+=line(74,285,16,285,C.amber,2)+line(16,285,16,421,C.amber,2)+arrow(16,421,149,421,C.amber);
      body+=labels('execution-fee',90,321,280,59,fr?['Frais de la transaction','versés au réseau']:['Transaction fee','paid to the network'],17,C.amber,'start',700,25);
      body+=circle(200,421,42,C['surface-2'],C.amber,1)+block(200,421,68,C.amber);
      body+=labels('chain',100,477,200,37,[fr?'Fonctionnement L2':'L2 operation'],17,C.paper,'middle',700);
      body+=line(244,421,376,421,C.amber,2)+line(376,421,376,616,C.amber,2)+arrow(376,616,304,616,C.amber);
      body+=circle(258,616,35,C['surface-2'],C['line-strong'],1)+ethereum(258,616,61,C.paper);
      body+=labels('l1-costs',24,537,336,61,fr?['Publication et règlement sur Ethereum','selon le protocole']:['Publication and settlement on Ethereum','according to the protocol'],15,C.paper,'start',400,23);
      body+=labels('ethereum',194,665,170,37,['Ethereum · L1'],16,C.paper,'middle',700);
      body+=line(244,397,376,397,C.signal,2,'4 5')+line(376,397,376,245,C.signal,2,'4 5')+arrow(376,245,358,245,C.signal,'4 5');
      body+=labels('redistribution',24,714,352,64,fr?['Redistributions éventuelles vers les apps','selon les règles du réseau et du contrat']:['Possible distributions to apps','under network and contract rules'],15,C.signal,'start',400,23);
      body+=line(32,792,368,792,C['line-strong'],1);
      body+=support(65,850,56,C.accent)+line(106,850,386,850,C.accent,2,'4 5')+line(386,850,386,446,C.accent,2,'4 5')+arrow(386,446,236,446,C.accent,'4 5');
      body+=labels('funding',24,884,352,84,fr?['Soutien de l’entité portant le réseau','Un financement distinct des frais','pour faire fonctionner l’infrastructure.']:['Support from the entity behind the network','Funding alongside transaction fees','to operate the infrastructure.'],15,C.paper,'start',400,23);
      body+=labels('money-scope',24,990,352,60,fr?['Relations qualitatives. Montants et parts','conservées dépendent du réseau.']:['Qualitative routes. Amounts and retained','shares depend on the network.'],14,C.muted,'start',400,22);
    } else {
      body+=circle(103,317,48,C['surface-2'],C['line-strong'],1)+person(103,317,76,C.paper);
      body+=circle(872,227,48,C['surface-2'],C['line-strong'],1)+application(872,227,76,C.signal);
      body+=line(136,282,188,227,C.signal,2)+arrow(188,227,809,227,C.signal);
      body+=labels('purchase',251,176,480,43,[fr?'Paiement de l’achat dans l’application':'Purchase payment within the app'],21,C.signal,'middle',700);
      body+=labels('buyer',26,380,154,43,[fr?'Acheteur':'Buyer'],21,C.paper,'middle',700);
      body+=labels('app',762,290,216,43,[fr?'Application':'Application'],21,C.paper,'middle',700);
      body+=line(151,333,215,399,C.amber,2)+arrow(215,399,465,399,C.amber);
      body+=labels('execution-fee',232,315,230,63,fr?['Frais de la transaction','versés au réseau']:['Transaction fee','paid to the network'],19,C.amber,'start',700,26);
      body+=circle(530,399,53,C['surface-2'],C.amber,1)+block(530,399,85,C.amber);
      body+=labels('chain',404,466,252,42,[fr?'Fonctionnement L2':'L2 operation'],21,C.paper,'middle',700);
      body+=arrow(596,399,817,399,C.amber);
      body+=labels('l1-costs',623,330,188,60,fr?['Publication','et règlement']:['Publication','and settlement'],18,C.paper,'middle',400,25);
      body+=circle(872,399,48,C['surface-2'],C['line-strong'],1)+ethereum(872,399,79,C.paper);
      body+=labels('ethereum',762,466,216,42,['Ethereum · L1'],21,C.paper,'middle',700);
      body+=line(568,360,650,278,C.signal,2,'4 5')+line(650,278,794,278,C.signal,2,'4 5')+arrow(794,278,831,256,C.signal,'4 5');
      body+=labels('redistribution',334,261,286,67,fr?['Redistributions éventuelles','selon réseau et contrat']:['Possible distributions','under network / contract rules'],17,C.signal,'start',400,25);
      body+=support(103,581,76,C.accent)+line(152,581,320,581,C.accent,2,'4 5')+line(320,581,320,447,C.accent,2,'4 5')+arrow(320,447,479,447,C.accent,'4 5');
      body+=labels('funding',28,630,932,42,[fr?'Soutien de l’entité du réseau : financement distinct des frais pour faire fonctionner l’infrastructure.':'Support from the network entity: funding alongside fees to operate the infrastructure.'],17,C.paper,'start',400);
      body+=labels('support-label',26,519,284,39,[fr?'Entité portant le réseau':'Entity behind the network'],18,C.accent,'start',700);
      body+=labels('money-scope',360,552,608,61,fr?['Relations qualitatives. Montants et parts conservées dépendent du réseau.','Publication et règlement sur Ethereum selon le protocole.']:['Qualitative routes. Amounts and retained shares depend on the network.','Publication and settlement on Ethereum depend on the protocol.'],16,C.muted,'start',400,24);
    }
    return shell(id,width,mobile?1075:698,title.join(' '),fr?'Le paiement de l’achat arrive à l’application. Les frais de la transaction sont payés au réseau, qui supporte des coûts de publication et de règlement sur Ethereum selon son protocole. Des redistributions peuvent bénéficier aux applications selon les règles du réseau et du contrat. L’entité soutenant le réseau peut apporter un financement distinct pour le fonctionnement de l’infrastructure. Les flèches ne représentent aucun montant ni part conservée.':'The purchase payment reaches the application. Transaction fees are paid to the network, which incurs Ethereum publication and settlement costs according to its protocol. Applications may receive distributions under network and contract rules. The entity supporting the network can provide separate infrastructure funding. Arrows represent neither amounts nor retained shares.',body);
  }
  if (kind==='fees') {
    const title=fr?['Trente jours de frais,','une même échelle']:['Thirty days of fees,','one shared scale'];
    const subtitle=fr?['Séries de frais publiées par DefiLlama.','1–30 septembre 2026 · USD · UTC']:['Fee series published by DefiLlama.','1–30 September 2026 · USD · UTC'];
    let body=heading(mobile,fr?'MESURER UNE ACTIVITÉ':'MEASURING ACTIVITY',title,subtitle);
    const left=32,right=width-32,full=right-left,top=mobile?252:216,second=mobile?363:318;
    const number=new Intl.NumberFormat(fr?'fr-FR':'en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
    for(const [chain,y,color] of [['blast',top,C.amber],['abstract',second,C.signal]]) {
      body+=labels(`${chain}-label`,24,y-49,mobile?145:400,43,[chain==='blast'?'Blast':'Abstract'],mobile?20:24,C.paper,'start',700);
      body+=labels(`${chain}-value`,mobile?152:462,y-49,mobile?224:514,43,[`${number.format(L2_FEES_USD[chain])} USD`],mobile?20:26,color,'end',700);
      body+=rect(left,y,full,32,C['surface-2'],4);
      body+=`<g data-total-bar="${chain}">${rect(left,y,full*L2_FEES_USD[chain]/L2_FEES_USD.abstract,32,color)}</g>`;
    }
    const axisY=second+55;
    body+=line(left,axisY,right,axisY,C['line-strong'],1);
    (mobile?[0,60000,120000]:[0,40000,80000,120000]).forEach((value,i,values)=>{
      const x=left+full*value/L2_FEES_USD.abstract,last=i===values.length-1;
      body+=line(x,axisY-4,x,axisY+4,C['line-strong'],1);
      body+=region(`total-axis-${i}`,i===0?24:last?right-84:x-47,axisY+7,i===0?75:last?92:94,34,text(x,axisY+28,value===0?'0':`${value/1000} 000`,mobile?13:15,C.muted,400,i===0?'start':last?'end':'middle'));
    });
    const dailyTop=mobile?575:465,dailyBottom=dailyTop+99,maxDaily=Math.max(...L2_DAILY_FEES_USD.abstract),slot=full/30,barWidth=slot*.31;
    body+=labels('daily-heading',24,dailyTop-64,width-48,41,[fr?'Le profil des trente journées':'The thirty-day profile'],mobile?19:22,C.paper,'start',700);
    body+=labels('daily-scale',24,dailyTop-32,mobile?222:660,34,[fr?(mobile?'Par jour · échelle commune':'Échelle quotidienne commune'):(mobile?'Per day · shared scale':'Shared daily scale')],mobile?13:15,C.muted,'start',400);
    body+=labels('daily-range',width-(mobile?154:252),dailyTop-32,mobile?130:228,34,[fr?'0–6 053 USD / jour':'0–6,053 USD / day'],mobile?13:15,C.muted,'end',400);
    body+=line(left,dailyTop,right,dailyTop,C['line-strong'],1,'3 5');
    body+=line(left,dailyBottom,right,dailyBottom,C['line-strong'],1);
    for(let day=0;day<30;day++) for(const [chain,offset,color] of [['blast',.12,C.amber],['abstract',.52,C.signal]]) {
      const h=99*L2_DAILY_FEES_USD[chain][day]/maxDaily;
      body+=`<g data-daily-bar="${chain}" data-day="${day+1}">${rect(left+slot*(day+offset),dailyBottom-h,barWidth,h,color)}</g>`;
    }
    body+=labels('first-day',24,dailyBottom+7,100,34,[fr?'1 sept.':'1 Sep'],13,C.muted,'start');
    body+=labels('last-day',width-124,dailyBottom+7,100,34,[fr?'30 sept.':'30 Sep'],13,C.muted,'end');
    const legendY=mobile?710:604;
    body+=region('daily-legend-blast',24,legendY,150,36,circle(38,legendY+15,4,C.amber)+text(50,legendY+20,'Blast',13,C.amber,700));
    body+=region('daily-legend-abstract',180,legendY,178,36,circle(194,legendY+15,4,C.signal)+text(206,legendY+20,'Abstract',13,C.signal,700));
    body+=labels('scope',24,mobile?754:646,width-48,mobile?105:76,fr?(mobile?['30 observations quotidiennes pour chaque chaîne.','La couverture dépend de l’adaptateur.','Aucun coût ni revenu net retranché.']:['30 observations quotidiennes pour chaque chaîne. La couverture dépend de l’adaptateur.','Aucun coût ni revenu net retranché.']):(mobile?['30 daily observations for each chain.','Coverage depends on the adapter.','No costs or net revenue deducted.']:['30 daily observations for each chain. Coverage depends on the adapter.','No costs or net revenue deducted.']),mobile?15:17,C.muted,'start',400,mobile?23:25);
    return shell(id,width,mobile?877:740,title.join(' '),fr?'Séries dailyFees publiées par DefiLlama, somme des trente journées du 1 au 30 septembre 2026 UTC : Blast 2 067,07 dollars, Abstract 121 283 dollars. Les deux barres de total partent de zéro à la même échelle. Le profil quotidien utilise une même échelle verticale pour les deux séries. La couverture dépend de chaque adaptateur et les modèles de facturation diffèrent. Aucun coût ni revenu net n’est retranché, ces montants ne mesurent pas un bénéfice.':'DefiLlama dailyFees series, summed across the thirty days from 1 to 30 September 2026 UTC: Blast 2,067.07 dollars; Abstract 121,283 dollars. Both total bars share a zero baseline and scale. The daily profile shares a vertical scale across both series. Coverage depends on each adapter and billing models differ. No costs or net revenue are deducted; these amounts do not measure profit.',body);
  }
  const title=fr?['Sortir exige encore','une chaîne d’opérations']:['Exiting still requires','a chain of operations'];
  const subtitle=fr?['Une demande sur L2 doit aboutir','à une réclamation exécutable sur Ethereum.']:['An L2 request must reach','an executable Ethereum claim.'];
  let body=heading(mobile,fr?'LA CONTINUITÉ D’UNE SORTIE':'EXIT CONTINUITY',title,subtitle);
  const stages=fr?[
    ['Demande L2',['Retrait initié','sur le réseau']],
    ['État sur Ethereum',['Lot et état','publiés sur L1']],
    ['Règlement',['Preuve ou délai','selon protocole']],
    ['Réclamation L1',['Actifs libérés','par le contrat L1']],
  ]:[
    ['L2 request',['Withdrawal initiated','on the network']],
    ['Ethereum state',['Batch and state','published on L1']],
    ['Settlement',['Proof or delay','under the protocol']],
    ['L1 claim',['Assets released','by the L1 contract']],
  ];
  const centers=mobile?[[82,251],[310,251],[310,475],[82,475]]:[[127,226],[377,226],[627,226],[877,226]],icons=[claim,block,verify,claim];
  if(mobile) {
    body+=arrow(130,251,262,251,C.signal)+line(356,251,386,251,C.signal,2)+line(386,251,386,475,C.signal,2)+arrow(386,475,356,475,C.signal)+arrow(262,475,130,475,C.signal);
  } else for(let i=0;i<3;i++) body+=arrow(centers[i][0]+58,226,centers[i+1][0]-58,226,C.signal);
  centers.forEach(([x,y],i)=>{
    body+=circle(x,y,mobile?39:46,C['surface-2'],C['line-strong'],1)+icons[i](x,y,mobile?59:70,i===3?C.signal:C.paper);
    const bx=mobile?(x===82?8:228):x-117,bw=mobile?148:234;
    body+=labels(`exit-stage-${i}`,bx,y+52,bw,40,[stages[i][0]],mobile?15:20,C.paper,'middle',700);
    body+=labels(`exit-detail-${i}`,bx,y+(mobile?74:91),bw,65,stages[i][1],mobile?14:17,C.muted,'middle',400,mobile?22:26);
  });
  if(mobile) {
    body+=support(62,666,54,C.amber)+line(98,666,394,666,C.amber,2,'4 5')+line(394,666,394,376,C.amber,2,'4 5')+arrow(394,376,386,376,C.amber,'4 5');
    body+=labels('operator-dependency',92,603,276,67,fr?['Publication et finalisation','avec des acteurs disponibles.']:['Publication and finalisation','with available actors.'],15,C.amber,'start',700,24);
    body+=line(32,704,368,704,C['line-strong'],1);
    body+=labels('blast-date',24,726,352,42,[fr?'Blast · 26 octobre 2026':'Blast · 26 October 2026'],22,C.paper,'start',700);
    body+=line(32,791,240,791,C.amber,2)+line(240,782,240,800,C.amber,2)+arrow(254,791,368,791,C.amber,'4 5');
    body+=labels('blast-interface',24,808,352,59,fr?['Fin prévue de l’interface normale.','Voie via contrats L1 annoncée ensuite.']:['Normal interface scheduled to end.','An L1-contract route is announced after it.'],15,C.paper,'start',400,23);
    body+=labels('blast-block-limit',24,869,352,36,[fr?'Date du dernier bloc non publiée.':'No final-block date published.'],14,C.muted);
    body+=labels('abstract-date',24,930,352,42,[fr?'Abstract · 15 décembre 2026':'Abstract · 15 December 2026'],22,C.paper,'start',700);
    body+=line(32,995,341,995,C.accent,2)+line(341,986,341,1004,C.accent,3);
    body+=labels('abstract-processing',24,1012,352,82,fr?['Fin annoncée du traitement normal.','Perte d’accès annoncée aux actifs restants.','Aucune récupération promise.']:['Normal processing announced to end.','Access to remaining assets said to be lost.','No recovery promised.'],15,C.paper,'start',400,23);
    body+=labels('exit-scope',24,1121,352,61,fr?['Schéma explicatif. Disponibilité réelle','des opérations à vérifier pour chaque réseau.']:['Explanatory sequence. Check actual operation','availability for each network.'],14,C.muted,'start',400,23);
  } else {
    body+=support(93,448,64,C.amber)+line(136,448,706,448,C.amber,2,'4 5')+line(706,448,706,279,C.amber,2,'4 5')+arrow(706,279,666,264,C.amber,'4 5');
    body+=labels('operator-dependency',163,382,530,66,fr?['Publication et finalisation exigent','des opérations et des acteurs disponibles.']:['Publication and finalisation require','available operations and actors.'],19,C.amber,'start',700,26);
    body+=line(32,493,968,493,C['line-strong'],1);
    body+=labels('blast-date',24,518,326,44,[fr?'Blast · 26 octobre 2026':'Blast · 26 October 2026'],23,C.paper,'start',700);
    body+=line(367,545,640,545,C.amber,2)+line(640,536,640,554,C.amber,2)+arrow(656,545,944,545,C.amber,'4 5');
    body+=labels('blast-interface',355,563,620,68,fr?['Interface normale : fin prévue. Retraits via contrats L1 annoncés ensuite.','L’annonce ne publie aucune date de dernier bloc.']:['Normal interface: scheduled closure. Later L1-contract route announced.','The announcement provides no final-block date.'],16,C.paper,'start',400,25);
    body+=labels('abstract-date',24,658,332,44,[fr?'Abstract · 15 décembre 2026':'Abstract · 15 December 2026'],23,C.paper,'start',700);
    body+=line(367,685,944,685,C.accent,2)+line(944,676,944,694,C.accent,3);
    body+=labels('abstract-processing',355,703,620,69,fr?['Fin annoncée du traitement normal et perte d’accès aux actifs restants.','Aucune récupération promise.']:['Normal processing and access to remaining assets announced to end.','No recovery promised.'],16,C.paper,'start',400,25);
    body+=labels('exit-scope',24,807,952,38,[fr?'Schéma explicatif. Disponibilité réelle des opérations à vérifier pour chaque réseau.':'Explanatory sequence. Check actual availability of the operations for each network.'],17,C.muted);
  }
  return shell(id,width,mobile?1201:864,title.join(' '),fr?'Pour sortir, une demande sur L2 doit être suivie de la publication d’un lot et d’un état sur Ethereum, du règlement selon le protocole par preuve ou délai, puis d’une réclamation auprès du contrat L1. Publication et finalisation nécessitent des opérations et des acteurs encore disponibles. Blast annonce la fin de son interface normale le 26 octobre 2026, avec une voie de retrait via contrats L1 annoncée ensuite, sans publier de date de dernier bloc. Abstract annonce la fin du traitement normal le 15 décembre 2026 et une perte d’accès aux actifs restants, sans récupération promise. Ces dates ne constituent pas des heures de fermeture. Ce schéma n’audite pas la configuration effective des réseaux.':'Exiting requires an L2 request, publication of a batch and state on Ethereum, settlement under the protocol by proof or delay, then a claim against the L1 contract. Publication and finalisation need available operations and actors. Blast announces the end of its normal interface on 26 October 2026 and a subsequent L1-contract withdrawal route, without giving a final-block date. Abstract announces an end to normal processing on 15 December 2026 and loss of access to remaining assets, with no recovery promised. These dates specify no closure time. This diagram is not an audit of the effective network configurations.',body);
}
