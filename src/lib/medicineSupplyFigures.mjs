import {compareSupply,simulateSupply,DEFAULTS} from './medicineSupplyModel.mjs';
import {esc,supplyFmt} from './medicineSupplyView.mjs';
const C={bg:'#0b0d10',panel:'#14191f',edge:'#365569',text:'#e8f2f5',muted:'#aec4d2',green:'#50ddc0',amber:'#f6bd68'};
const line=(x1,y1,x2,y2,color=C.edge,width=2)=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"/>`;
const rect=(x,y,w,h,fill=C.panel,rx=12)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}"/>`;
const txt=(x,y,text,size=20,color=C.text,weight=400,anchor='start')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" font-weight="${weight}" text-anchor="${anchor}">${esc(text)}</text>`;
const lines=(x,y,texts,size=19,color=C.muted,gap=27)=>texts.map((s,i)=>txt(x,y+i*gap,s,size,color)).join('');
function shell(w,h,id,title,desc,body){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" style="width:100%;height:auto" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(desc)}</desc>${rect(0,0,w,h,C.bg,18)}<g font-family="system-ui, sans-serif">${body}</g></svg>`;}
export function medicineFigureSvg(lang='fr',kind='chain',mobile=false){
 lang=lang==='en'?'en':'fr'; const fr=lang==='fr',w=mobile?400:960,x=mobile?24:38;
 const id=`ms-${kind}-${lang}-${mobile?'small':'wide'}`;
 if(kind==='chain'){
  const h=mobile?734:500;
  const title=fr?'Sept laboratoires, une usine':'Seven companies, one factory';
  let b=txt(x,39,'l0g / '+(fr?'DÉPENDANCE INDUSTRIELLE':'PRODUCTION DEPENDENCY'),mobile?14:15,C.green,700);
  b+=lines(x,mobile?78:88,mobile?(fr?['Sept laboratoires,','une usine']:['Seven companies,','one factory']):[title],mobile?27:35,C.text,mobile?35:43);
  b+=txt(x,mobile?159:134,fr?'Quétiapine · France · épisode 2024-2025':'Quetiapine · France · 2024-2025 episode',mobile?14:18,C.muted);
  const cards=fr?[['1 usine','Pharmathen International','Grèce'],['7 laboratoires','Exploitants sur le marché','français'],['60 %','Part habituelle du marché','français fournie par l’usine']]:[['1 factory','Pharmathen International','Greece'],['7 companies','Marketing companies serving','the French market'],['60%','Usual share of French supply','provided by the factory']];
  cards.forEach((c,i)=>{
   const cx=mobile?24:38+i*305,cy=mobile?190+i*145:188,cw=mobile?352:274,ch=mobile?116:180;
   b+=rect(cx,cy,cw,ch);b+=txt(cx+18,cy+(mobile?36:48),c[0],mobile?28:32,i===2?C.amber:C.green,700);
   b+=lines(cx+18,cy+(mobile?70:101),c.slice(1),mobile?16:17,C.text,mobile?25:30);
   if(i<2) b+=mobile?line(200,cy+ch+4,200,cy+ch+23,C.green,3)+`<path d="M195 ${cy+ch+18} L200 ${cy+ch+25} L205 ${cy+ch+18}" fill="none" stroke="${C.green}" stroke-width="3"/>`:line(cx+cw+4,cy+90,cx+cw+24,cy+90,C.green,3)+`<path d="M${cx+cw+18} ${cy+84} L${cx+cw+26} ${cy+90} L${cx+cw+18} ${cy+96}" fill="none" stroke="${C.green}" stroke-width="3"/>`;
  });
  b+=lines(x,mobile?645:414,fr?(mobile?['Des vendeurs différents peuvent partager','la même dépendance de production.']:['Des vendeurs différents peuvent partager la même dépendance de production.']):(mobile?['Different sellers can share','the same production dependency.']:['Different sellers can share the same production dependency.']),mobile?16:21,C.text,25);
  b+=lines(x,mobile?703:467,fr?['Source : ANSM, 24 avril 2025. Schéma simplifié.']:['Source: ANSM, 24 April 2025. Simplified diagram.'],mobile?12:14,C.muted,17);
  return shell(w,h,id,title,fr?'L’ANSM indique qu’une usine fournissait habituellement 60 % de la quétiapine distribuée en France par sept laboratoires. Épisode historique, pas état des stocks actuels.':'ANSM reported that one factory normally supplied 60% of quetiapine distributed in France through seven marketing companies. Historical episode, not current inventory.',b);
 }
 if(kind==='stock'){
  const h=mobile?865:635;
  const title=fr?'Le stock et le secours':'Inventory and backup supply';
  let b=txt(x,38,'l0g / '+(fr?'SCÉNARIOS FICTIFS':'FICTIONAL SCENARIOS'),mobile?12:14,C.green,700);
  b+=lines(x,mobile?80:91,mobile?(fr?['Le stock et','le secours']:['Inventory and','backup supply']):[title],mobile?27:34,C.text,mobile?35:43);
  b+=lines(x,mobile?153:136,fr?(mobile?['1 000 unités/jour · stock de 14 000 unités','60 % du flux perdu pendant 60 jours']:['1 000 unités/jour · stock initial : 14 000 · 60 % du flux perdu pendant 60 jours']):(mobile?['1,000 units/day · 14,000 units in stock','60% of deliveries lost for 60 days']:['1,000 units/day · initial stock: 14,000 · 60% of deliveries lost for 60 days']),mobile?15:17,C.muted,24);
  const {baseline,backup}=compareSupply(DEFAULTS),full=simulateSupply({...DEFAULTS,backupShare:60});
  const cases=[baseline,backup,full],labels=fr?['Sans secours','Secours : 200 unités/jour','Secours : 600 unités/jour']:['No backup','Backup: 200 units/day','Backup: 600 units/day'];
  const start=mobile?214:186,step=mobile?164:123,bw=w-2*x;
  cases.forEach((q,i)=>{const y=start+i*step;
   b+=txt(x,y,labels[i],mobile?20:23,C.text,700);
   b+=txt(x,y+31,fr?(i?'À partir du jour 15':'Stock seul'):(i?'From day 15':'Inventory only'),mobile?14:16,C.muted);
   b+=rect(x,y+49,bw,18,C.amber,5)+rect(x,y+49,Math.max(0,bw*q.serviceRate),18,C.green,5);
   b+=txt(x,y+94,`${supplyFmt(lang,q.totalUnmet)} ${fr?'unités non livrées':'units unmet'}`,mobile?23:25,C.text,700);
   if(mobile)b+=txt(x,y+120,fr?(q.firstShortage?`Premier manque : jour ${q.firstShortage}`:'Aucun manque sur les 60 jours'):(q.firstShortage?`First gap: day ${q.firstShortage}`:'No gap during the 60 days'),14,C.muted);
  });
  const legendY=mobile?744:553;
  b+=rect(x,legendY-11,16,12,C.green,2)+txt(x+23,legendY,fr?'Demande satisfaite':'Demand served',mobile?14:16,C.muted);
  b+=rect(mobile?207:330,legendY-11,16,12,C.amber,2)+txt(mobile?230:353,legendY,fr?'Non satisfaite':'Unmet',mobile?14:16,C.muted);
  b+=lines(x,mobile?786:592,fr?(mobile?['Source : calculs l0g · unités fictives de produit.','Pas de patients, de doses ni de prévision.','Demande perdue non rattrapée.']:['Source : calculs l0g. Unités fictives de produit fini, pas doses ou patients.','Demande constante ; secours indépendant ; manque non rattrapé.']):(mobile?['Source: l0g calculations · fictional product units.','Not patients, doses or a forecast.','Unmet demand is not made up later.']:['Source: l0g calculations. Fictional finished-product units, not doses or patients.','Constant demand; independent backup; unmet demand is not made up later.']),mobile?14:15,C.muted,18);
  return shell(w,h,id,title,fr?'Sur 60 000 unités demandées, 22 000 restent non livrées sans secours, 12 800 avec un secours de 200 unités par jour à partir du jour 15, et zéro avec 600 unités par jour à la même date.':'Of 60,000 units demanded, 22,000 remain unmet without backup, 12,800 with 200 backup units per day from day 15, and zero with 600 per day from the same date.',b);
 }
 if(kind==='commitments'){
  const h=mobile?1120:696,title=fr?'Quatre engagements distincts':'Four distinct commitments';
  let b=txt(x,39,'l0g / '+(fr?'INSULINE · ALLEMAGNE':'INSULIN · GERMANY'),mobile?12:14,C.green,700);
  b+=lines(x,mobile?79:89,mobile?(fr?['Quatre engagements','distincts']:['Four distinct','commitments']):[title],mobile?28:35,C.text,36);
  b+=lines(x,mobile?157:135,fr?(mobile?['400 M€ autorisés le 8 septembre 2026','Autorisation ≠ versement réalisé']:['400 M€ autorisés le 8 septembre 2026. Autorisation ≠ versement réalisé.']):(mobile?['€400m approved on 8 September 2026','Approval ≠ money disbursed']:['€400m approved on 8 September 2026. Approval ≠ money disbursed.']),mobile?15:18,C.muted,24);
  const cards=fr?[
   ['USINE','Fin 2032',['Nouvelle installation','à Francfort-Höchst.']],
   ['FLUX ANNUEL','Au moins 1,1 t',['Production annuelle d’insuline','jusqu’à fin 2042.']],
   ['STOCK','1 tonne',['Principe actif à conserver','jusqu’à fin 2042.']],
   ['AFFECTATION','Priorité EEE',['Marchés de l’Espace économique','européen en cas de pénurie.']]
  ]:[
   ['FACTORY','End of 2032',['New installation','at Frankfurt-Höchst.']],
   ['ANNUAL FLOW','At least 1.1 t',['Annual insulin production','through the end of 2042.']],
   ['INVENTORY','1 tonne',['Active ingredient held','through the end of 2042.']],
   ['ALLOCATION','EEA priority',['European Economic Area markets','during an insulin shortage.']]
  ];
  cards.forEach((c,i)=>{const cx=mobile?24:38+(i%2)*452,cy=mobile?220+i*186:179+Math.floor(i/2)*207,cw=mobile?352:434,ch=mobile?166:187;
   b+=rect(cx,cy,cw,ch);b+=txt(cx+18,cy+29,c[0],12,C.green,700);b+=txt(cx+18,cy+76,c[1],mobile?29:32,C.text,700);b+=lines(cx+18,cy+113,c[2],mobile?16:19,C.muted,26);
  });
  b+=lines(x,mobile?1004:622,fr?(mobile?['Le stock porte sur le principe actif,','pas sur des médicaments prêts à délivrer.']:['Le stock porte sur le principe actif, pas sur des médicaments prêts à délivrer.']):(mobile?['The reserve contains active ingredient,','not ready-to-dispense medicines.']:['The reserve contains active ingredient, not ready-to-dispense medicines.']),mobile?15:19,C.text,24);
  b+=lines(x,mobile?1071:665,fr?(mobile?['Source : Commission européenne, 8 septembre 2026.','Engagements annoncés, pas bilan d’exécution.']:['Source : Commission européenne, 8 septembre 2026. Engagements annoncés, pas bilan d’exécution.']):(mobile?['Source: European Commission, 8 September 2026.','Announced commitments, not completed results.']:['Source: European Commission, 8 September 2026. Announced commitments, not completed results.']),mobile?14:15,C.muted,18);
  return shell(w,h,id,title,fr?'Quatre catégories non interchangeables : usine avant fin 2032, plancher de production annuelle jusqu’à fin 2042, stock de principe actif jusqu’à fin 2042 et priorité de livraison à l’EEE.':'Four non-interchangeable commitments: a factory by end-2032, annual production floor through end-2042, active-ingredient stock through end-2042 and priority delivery to EEA markets.',b);
 }
 throw new RangeError('Unknown medicine figure kind.');
}
export function renderMedicineFigure(lang='fr',kind='chain'){
 lang=lang==='en'?'en':'fr';const fr=lang==='fr';
 const data={chain:{url:'https://ansm.sante.fr/actualites/point-de-situation-sur-les-tensions-dapprovisionnement-en-quetiapine-une-mobilisation-au-long-cours-pour-couvrir-au-mieux-les-besoins-des-patients',label:fr?'ANSM, 24 avril 2025':'ANSM, 24 April 2025',note:fr?'Épisode de 2024-2025 ; part habituelle du marché français. Schéma simplifié des dépendances, pas carte exhaustive.':'2024-2025 episode; usual French market share. Simplified dependency diagram, not an exhaustive map.'},stock:{note:fr?'Source : calculs l0g. Horizon fictif de 60 jours ; unités abstraites de produit fini ; les 60 % de perte sont une hypothèse, pas une reconstitution de la pénurie de quétiapine.':'Source: l0g calculations. Fictional 60-day horizon; abstract finished-product units; the 60% loss is an assumption, not a reconstruction of the quetiapine shortage.'},commitments:{url:'https://germany.representation.ec.europa.eu/nachrichten-und-veranstaltungen/pressemitteilungen/kommission-genehmigt-deutsche-beihilfe-von-400-mio-euro-zur-versorgungssicherheit-bei-insulin-2026-09-08_de',label:fr?'Commission européenne, 8 septembre 2026':'European Commission, 8 September 2026',note:fr?'Tonnes métriques. Obligations résumées à partir du communiqué, sans vérification de leur exécution future.':'Metric tonnes. Obligations summarised from the announcement, without verification of future performance.'}}[kind];
 return `<figure class="ms-figure"><div class="ms-figure-wide">${medicineFigureSvg(lang,kind,false)}</div><div class="ms-figure-small">${medicineFigureSvg(lang,kind,true)}</div><figcaption>${data.url?`${fr?'Source :':'Source:'} <a href="${data.url}">${esc(data.label)}</a>. `:''}${esc(data.note)}</figcaption></figure>`;
}
