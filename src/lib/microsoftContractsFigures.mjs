// Inert authored SVG. Article props and external data never enter this markup.
const native = { ink:'#0c0d10',surface:'#121419','surface-2':'#171a20',paper:'#e7e9ee',muted:'#8b909b','line-strong':'rgba(255, 255, 255, 0.20)',signal:'#5eead4',amber:'#f5b13d',accent:'#ff4d87' };
const C = Object.fromEntries(Object.entries(native).map(([role,value])=>[role,`var(--color-${role}, ${value})`]));
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const text = (x,y,value,size=20,color=C.paper,weight=400,anchor='start') => `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${escape(value)}</text>`;
const rect = (x,y,width,height,fill=C.surface,radius=0,stroke='none',strokeWidth=1) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
const line = (x1,y1,x2,y2,color=C['line-strong'],width=2,dash='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const circle = (x,y,radius,fill=C.surface,stroke='none',width=1) => `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const path = (d,color,width=2,fill='none',dash='') => `<path d="${d}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const region = (name,x,y,width,height,body) => `<g data-region="${name}" data-bounds="${x} ${y} ${width} ${height}">${body}</g>`;
const labels = (name,x,y,width,height,values,size=20,color=C.paper,anchor='start',weight=400,gap=size+8) => region(name,x,y,width,Math.max(height,Math.ceil(size*1.3)+14+(values.length-1)*gap),values.map((value,i)=>text(anchor==='middle'?x+width/2:anchor==='end'?x+width-8:x+8,y+size+8+i*gap,value,size,color,weight,anchor)).join(''));
function arrow(x1,y1,x2,y2,color=C.signal,dash='') {
  const angle=Math.atan2(y2-y1,x2-x1),length=8,spread=4;
  const bx=x2-Math.cos(angle)*length,by=y2-Math.sin(angle)*length;
  return line(x1,y1,x2,y2,color,2,dash)+path(`M${bx-Math.sin(angle)*spread} ${by+Math.cos(angle)*spread} L${x2} ${y2} L${bx+Math.sin(angle)*spread} ${by-Math.cos(angle)*spread}`,color,2);
}
function account(x,y,color=C.paper) {
  return circle(x,y-14,11,'none',color,2)+path(`M${x-22} ${y+25} C${x-22} ${y-1} ${x+22} ${y-1} ${x+22} ${y+25}`,color,2)+line(x-22,y+25,x+22,y+25,color,2);
}
function offer(x,y) {
  return `<g data-offer="anonymous">${rect(x-24,y-29,48,58,C.ink,5,C.paper,2)}${line(x-13,y-13,x+13,y-13,C.muted)}${line(x-13,y,x+13,y,C.muted)}${line(x-13,y+13,x+5,y+13,C.muted)}</g>`;
}
function shell(id,width,height,title,desc,body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="width:100%;height:auto" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${escape(title)}</title><desc id="${id}-desc">${escape(desc)}</desc>${rect(0,0,width,height,C.ink,18)}${body}</svg>`;
}
function heading(mobile,section,title,subtitle) {
  const width=mobile?400:1000;
  return labels('eyebrow',24,16,width-48,34,[`l0g / ${section}`],mobile?13:15,C.signal,'start',700)
    +labels('heading',24,55,width-48,mobile?82:59,mobile?title:[title.join(' ')],mobile?28:34,C.paper,'start',700,mobile?34:42)
    +labels('subtitle',24,mobile?141:116,width-48,mobile?63:40,mobile?subtitle:[subtitle.join(' ')],mobile?15:18,C.muted,'start',400,mobile?23:26);
}

// Croydon award notice 2025/S 000-039343, published 11 July 2025.
// These are criterion weights, not bidders' scores or software market shares.
export const CROYDON_AWARD = Object.freeze({ tenders:4,winner:'Bytes Software Services Limited',start:'2025-07-01',end:'2028-06-30',notice:'2025-07-11' });
export const CROYDON_CRITERIA = Object.freeze([
  Object.freeze({ key:'price',weight:70 }),
  Object.freeze({ key:'technical',weight:20 }),
  Object.freeze({ key:'social',weight:10 }),
]);

export function microsoftContractsSvg(lang='fr',kind='procurement',mobile=false) {
  if (!['fr','en'].includes(lang)) throw new RangeError('Unknown Microsoft-contracts figure language');
  if (!['procurement','activation'].includes(kind)) throw new RangeError('Unknown Microsoft-contracts figure kind');
  if (typeof mobile!=='boolean') throw new TypeError('Microsoft-contracts mobile flag must be boolean');
  const fr=lang==='fr',width=mobile?400:1000,id=`microsoft-contracts-${kind}-${lang}-${mobile?'mobile':'desktop'}`;
  if (kind==='procurement') {
    const title=fr?['Le besoin délimite','la concurrence']:['The specification','sets the competition'];
    const subtitle=fr?['Croydon, 2025 : quatre offres reçues','pour un environnement déjà défini.']:['Croydon, 2025: four bids received','for an already specified environment.'];
    let body=heading(mobile,fr?'COMMANDE PUBLIQUE':'PUBLIC PROCUREMENT',title,subtitle);
    const scopeY=mobile?220:174,scopeH=mobile?245:166;
    body+=`<g data-scope="Microsoft Enterprise Agreement and Azure">${rect(32,scopeY,width-64,scopeH,C.surface,12,C['line-strong'])}`;
    body+=labels('scope-heading',mobile?40:48,scopeY+10,mobile?320:452,37,[fr?'BESOIN DÉFINI EN AMONT':'SPECIFIED REQUIREMENT'],mobile?13:15,C.muted,'start',700);
    body+=labels('scope-product',mobile?40:48,scopeY+47,mobile?320:454,84,['Microsoft Enterprise','Agreement + Azure'],mobile?22:27,C.paper,'start',700,mobile?29:34);
    const offersY=mobile?406:274,offerXs=mobile?[80,160,240,320]:[582,688,794,900];
    body+=labels('offers-heading',mobile?40:538,mobile?340:193,mobile?320:418,39,[fr?'4 offres reçues':'4 bids received'],mobile?18:22,C.signal,'middle',700);
    for(const x of offerXs)body+=offer(x,offersY);
    body+='</g>';
    // Each submitted offer enters the same weighted evaluation.
    const joinY=mobile?491:362,joinX=mobile?200:700;
    for(const x of offerXs)body+=line(x,offersY+34,x,joinY,C.muted,1.5);
    body+=line(offerXs[0],joinY,offerXs[3],joinY,C.muted,1.5);
    body+=arrow(joinX,joinY,joinX,mobile?523:400,C.signal);
    const barX=mobile?40:40,barY=mobile?594:411,barW=mobile?320:680,barH=mobile?40:42;
    body+=labels('weights-heading',24,mobile?529:365,mobile?352:680,mobile?59:39,mobile?(fr?['Critères d’attribution','Pondération totale : 100 %']:['Award criteria','Total weighting: 100%']):[fr?'Critères d’attribution · pondération totale : 100 %':'Award criteria · total weighting: 100%'],mobile?17:19,C.paper,'start',700,mobile?25:27);
    let offset=0;
    for(const [index,criterion]of CROYDON_CRITERIA.entries()) {
      const w=barW*criterion.weight/100,x=barX+offset;
      body+=`<g data-criterion="${criterion.key}" data-weight="${criterion.weight}" data-bar-width="${barW}">${rect(x,barY,w,barH,[C.signal,C.amber,C.muted][index])}</g>`;
      // On mobile the narrow ten-percent segment is keyed to the legend below.
      if(!mobile)body+=labels(`weight-${criterion.key}`,x,barY,w,barH,[`${criterion.weight} %`],18,C.ink,'middle',700);
      offset+=w;
    }
    const legend=fr?['Prix · 70 %','Technique · 20 %','Valeur sociale · 10 %']:['Price · 70%','Technical · 20%','Social value · 10%'];
    if(mobile) {
      for(let i=0;i<3;i++) {
        body+=rect(40,658+i*38,12,12,[C.signal,C.amber,C.muted][i],2);
        body+=labels(`criterion-${i}`,60,642+i*38,306,39,[legend[i]],17,C.paper,'start',i===0?700:400);
      }
      body+=arrow(200,767,200,803,C.signal);
      body+=labels('winner-label',24,810,352,35,[fr?'MARCHÉ ATTRIBUÉ À':'CONTRACT AWARDED TO'],13,C.muted,'middle',700);
      body+=labels('winner',24,843,352,51,['Bytes'],32,C.signal,'middle',700);
      body+=labels('winner-full',24,892,352,37,['Bytes Software Services Limited'],15,C.paper,'middle');
    } else {
      body+=labels('criterion-price',40,462,476,39,[fr?'Prix':'Price'],18,C.paper,'middle');
      body+=labels('criterion-technical',516,462,136,39,[fr?'Technique':'Technical'],17,C.paper,'middle');
      body+=labels('criterion-social',642,462,88,62,fr?['Valeur','sociale']:['Social','value'],15,C.paper,'middle',400,22);
      body+=arrow(737,432,801,432,C.signal);
      body+=labels('winner-label',799,361,177,38,[fr?'ATTRIBUTAIRE':'AWARDED TO'],14,C.muted,'middle',700);
      body+=labels('winner',799,402,177,57,['Bytes'],34,C.signal,'middle',700);
      body+=labels('winner-full',799,466,177,65,['Software Services','Limited'],14,C.paper,'middle',400,22);
    }
    const footerY=mobile?956:550;
    body+=line(32,footerY,width-32,footerY,C['line-strong'],1);
    body+=labels('contract-dates',24,footerY+13,width-48,mobile?65:40,mobile?(fr?['Contrat : 1 juillet 2025','au 30 juin 2028']:['Contract: 1 July 2025','to 30 June 2028']):[fr?'Contrat : 1 juillet 2025 au 30 juin 2028':'Contract: 1 July 2025 to 30 June 2028'],mobile?17:18,C.paper,'start',400,26);
    body+=labels('procurement-source',24,footerY+(mobile?88:57),width-48,mobile?65:40,mobile?(fr?['Source : avis 039343-2025, Find a Tender.','Publié le 11 juillet 2025.']:['Source: notice 039343-2025, Find a Tender.','Published 11 July 2025.']):[fr?'Source : Find a Tender, avis 039343-2025, publié le 11 juillet 2025.':'Source: Find a Tender, notice 039343-2025, published 11 July 2025.'],mobile?14:16,C.muted,'start',400,23);
    return shell(id,width,mobile?1124:655,title.join(' '),fr?'Croydon a défini un besoin Microsoft Enterprise Licensing Agreement et Azure. Quatre offres ont été reçues. La pondération des critères d’attribution est de 70 % pour le prix, 20 % pour la technique et 10 % pour la valeur sociale, sur un total de 100 %. Ces pourcentages sont des poids de critères, pas des notes obtenues. Le marché a été attribué à Bytes Software Services Limited pour la période du 1 juillet 2025 au 30 juin 2028. Avis publié le 11 juillet 2025.':'Croydon specified a Microsoft Enterprise Licensing Agreement and Azure requirement. Four bids were received. Award criteria were weighted 70% price, 20% technical and 10% social value, totalling 100%. These percentages are criterion weights, not bidders’ scores. The contract was awarded to Bytes Software Services Limited for 1 July 2025 to 30 June 2028. Notice published 11 July 2025.',body);
  }
  const title=fr?['Une règle de groupe','ouvre des services']:['A group policy','grants service access'];
  const subtitle=fr?['Entra attribue les licences.','L’administrateur choisit les plans de service.']:['Entra assigns the licences.','The administrator chooses the service plans.'];
  let body=heading(mobile,fr?'DU COMPTE À L’ACCÈS':'FROM ACCOUNT TO ACCESS',title,subtitle);
  const userX=mobile?83:85,userY=mobile?248:302;
  body+=account(userX,userY,C.paper);
  body+=labels('account',mobile?126:24,mobile?222:344,mobile?248:134,mobile?70:66,fr?['Compte','utilisateur']:['User','account'],mobile?20:17,C.paper,mobile?'start':'middle',700,mobile?28:24);
  const groupX=mobile?96:183,groupY=mobile?333:253,groupW=mobile?208:204,boxH=mobile?80:96;
  body+=`<g data-node="group">${rect(groupX,groupY,groupW,boxH,C.surface,10,C['line-strong'],2)}</g>`;
  body+=labels('group',groupX+8,groupY+9,groupW-16,40,[fr?'Groupe':'Group'],23,C.paper,'middle',700);
  body+=labels('group-detail',groupX+8,groupY+45,groupW-16,34,[fr?'Règle d’attribution':'Assignment policy'],mobile?14:15,C.muted,'middle');
  body+=mobile?arrow(200,292,200,325):arrow(122,302,175,302);
  const licenseX=mobile?96:453,licenseY=mobile?474:253,licenseW=mobile?208:184;
  body+=`<g data-node="product-licence">${rect(licenseX,licenseY,licenseW,boxH,C.surface,10,C.signal,2)}</g>`;
  body+=labels('product',licenseX+8,licenseY+10,licenseW-16,40,[fr?'Licence produit':'Product licence'],mobile?21:20,C.signal,'middle',700);
  body+=labels('product-detail',licenseX+8,licenseY+46,licenseW-16,34,[fr?'Héritée du groupe':'From the group'],14,C.muted,'middle');
  body+=`<g data-link="group-to-licence">${mobile?arrow(200,421,200,466):arrow(395,302,445,302)}</g>`;
  body+=labels('administrator',mobile?24:700,mobile?565:195,mobile?156:276,mobile?62:40,mobile?(fr?['Choix de','l’administrateur']:['Administrator','choice']):[fr?'Plans choisis par l’administrateur':'Administrator-selected plans'],mobile?14:16,C.amber,'start',700,22);
  const planXs=mobile?[24,209]:[728,728],planYs=mobile?[634,634]:[248,371],planW=mobile?167:240,planH=mobile?112:78;
  // One product licence branches into separately enabled or disabled plans.
  if(mobile) {
    body+=line(200,554,200,616,C.signal,2);
    body+=line(108,616,292,616,C.signal,2);
    body+=`<g data-link="licence-to-enabled">${arrow(108,616,108,626)}</g><g data-link="licence-to-disabled">${arrow(292,616,292,626,C.amber,'4 5')}</g>`;
  } else {
    body+=line(645,302,682,302,C.signal,2)+line(682,287,682,410,C.signal,2);
    body+=`<g data-link="licence-to-enabled">${arrow(682,287,720,287)}</g><g data-link="licence-to-disabled">${arrow(682,410,720,410,C.amber,'4 5')}</g>`;
  }
  for(let i=0;i<2;i++) {
    const x=planXs[i],y=planYs[i],color=i===0?C.signal:C.amber;
    body+=`<g data-plan="${i===0?'enabled':'disabled'}">${rect(x,y,planW,planH,C.surface,10,color,1.5)}</g>`;
    body+=labels(`plan-${i}`,x+4,y+8,planW-8,38,[i===0?(fr?'Plan activé':'Enabled plan'):(fr?'Plan désactivé':'Disabled plan')],mobile?17:20,color,'middle',700);
    body+=labels(`access-${i}`,x+4,y+43,planW-8,34,[i===0?(fr?'Accès autorisé':'Access granted'):(fr?'Service écarté':'Service excluded')],mobile?14:16,C.paper,'middle');
    if(mobile)body+=rect(x+64,y+88,38,12,C.ink,6,color,1)+circle(x+(i===0?95:71),y+94,4,color);
  }
  const eventsY=mobile?779:470;
  body+=labels('membership-enter',24,eventsY,mobile?352:462,mobile?61:70,fr?['Rejoindre le groupe :','sa licence est attribuée au compte.']:['Join the group:','its licence is assigned to the account.'],mobile?17:18,C.signal,'start',400,25);
  body+=labels('membership-leave',mobile?24:504,mobile?eventsY+77:eventsY,mobile?352:472,mobile?61:70,fr?['Quitter le groupe :','cette attribution est retirée.']:['Leave the group:','this assignment is removed.'],mobile?17:18,C.amber,'start',400,25);
  const footerY=mobile?949:564;
  body+=line(32,footerY,width-32,footerY,C['line-strong'],1);
  body+=labels('activation-scope',24,footerY+12,width-48,mobile?114:61,mobile?(fr?['Cas pédagogique : attribution de droits d’accès.','L’installation du logiciel est une autre étape.','D’autres groupes ou attributions directes','peuvent maintenir la même licence.']:['Teaching example: assigning access rights.','Software installation is a separate step.','Other groups or direct assignments','can retain the same licence.']):(fr?['Cas pédagogique : attribution de droits d’accès. L’installation du logiciel est une autre étape.','D’autres groupes ou attributions directes peuvent maintenir la même licence.']:['Teaching example: assigning access rights. Software installation is a separate step.','Other groups or direct assignments can retain the same licence.']),mobile?14:16,C.muted,'start',400,mobile?23:25);
  body+=labels('activation-source',24,footerY+(mobile?121:80),width-48,mobile?63:40,mobile?(fr?['Sources : Microsoft Learn, attribution','des licences par groupes, consulté le 8 oct. 2026.']:['Sources: Microsoft Learn, group-based','licensing, accessed 8 October 2026.']):[fr?'Sources : Microsoft Learn, attribution des licences par groupes, consulté le 8 octobre 2026.':'Sources: Microsoft Learn, group-based licensing, accessed 8 October 2026.'],mobile?14:16,C.muted,'start',400,23);
  return shell(id,width,mobile?1152:700,title.join(' '),fr?'Schéma pédagogique du mécanisme Entra : un compte membre d’un groupe reçoit la licence produit attribuée à ce groupe. L’administrateur peut activer ou désactiver les plans de service du produit. Rejoindre le groupe déclenche l’attribution, le quitter retire cette attribution. D’autres groupes ou attributions directes peuvent maintenir la même licence. Le schéma porte sur les droits d’accès ; l’installation du logiciel est une autre étape.':'Educational Entra mechanism: an account belonging to a group inherits the product licence assigned to that group. The administrator can enable or disable the product’s service plans. Joining the group triggers assignment; leaving removes this assignment. Other groups or direct assignments can retain the same licence. This diagram concerns access rights; software installation is a separate step.',body);
}
