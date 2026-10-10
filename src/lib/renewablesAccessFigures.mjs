// Authored, inert SVG. No remote markup, addresses or user-provided strings.
const native = { ink:'#0c0d10', surface:'#121419', 'surface-2':'#171a20', paper:'#e7e9ee', muted:'#8b909b', 'line-strong':'rgba(255, 255, 255, 0.20)', signal:'#5eead4', amber:'#f5b13d', accent:'#ff4d87' };
const C=Object.fromEntries(Object.entries(native).map(([k,v])=>[k,`var(--color-${k}, ${v})`]));
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const rect=(x,y,w,h,fill=C.surface,r=12,stroke='none',sw=1)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const line=(x,y,xx,yy,c=C['line-strong'],sw=2,dash='')=>`<line x1="${x}" y1="${y}" x2="${xx}" y2="${yy}" stroke="${c}" stroke-width="${sw}"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const path=(d,c=C.signal,sw=2,dash='',fill='none')=>`<path d="${d}" fill="${fill}" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const circle=(x,y,r,c=C.signal,fill=C.ink,sw=2)=>`<circle cx="${x}" cy="${y}" r="${r}" stroke="${c}" fill="${fill}" stroke-width="${sw}"/>`;
function arrow(x,y,xx,yy,c=C.signal,dash='') {
 const a=Math.atan2(yy-y,xx-x),l=8,spread=4,bx=xx-l*Math.cos(a),by=yy-l*Math.sin(a);
 return line(x,y,xx,yy,c,2,dash)+path(`M${bx-spread*Math.sin(a)} ${by+spread*Math.cos(a)} L${xx} ${yy} L${bx+spread*Math.sin(a)} ${by-spread*Math.cos(a)}`,c);
}
function text(x,y,s,size=18,c=C.paper,weight=400,anchor='start') {return `<text x="${x}" y="${y}" fill="${c}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${esc(s)}</text>`;}
function label(name,x,y,w,strings,size=18,c=C.paper,weight=400,anchor='start',gap=size*1.4) {
 const a=Array.isArray(strings)?strings:[strings],h=size*1.45+(a.length-1)*gap;
 return `<g data-region="${esc(name)}" data-bounds="${x} ${y} ${w} ${h}">${a.map((s,i)=>text(anchor==='middle'?x+w/2:anchor==='end'?x+w:x,y+size+2+i*gap,s,size,c,weight,anchor)).join('')}</g>`;
}
const node=(name,x,y,w,h,body='',stroke=C['line-strong'],fill=C.surface)=>`<g data-node="${name}">${rect(x,y,w,h,fill,12,stroke)}${body}</g>`;
const edge=(name,s)=>`<g data-edge="${name}">${s}</g>`;
function head(mobile,kicker,lines,sub) {
 const w=mobile?400:1000;
 return label('kicker',28,24,w-56,`l0g / ${kicker}`,mobile?13:14,C.signal,700)
 +label('title',28,65,w-56,lines,mobile?28:34,C.paper,700,'start',mobile?34:42)
 +label('subtitle',28,mobile?146:116,w-56,sub,mobile?15:17,C.muted,400,'start',22);
}
function footer(mobile,y,lines) {return line(28,y, mobile?372:972,y)+label('footer',28,y+12,mobile?344:944,lines,mobile?13:14,C.muted);}
function shell(lang,kind,mobile,h,title,desc,body){const w=mobile?400:1000,id=`renewables-${lang}-${kind}-${mobile?'mobile':'desktop'}`;return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${id}-title ${id}-desc" style="width:100%;height:auto"><title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(desc)}</desc>${rect(0,0,w,h,C.ink,18)}${body}</svg>`;}
export const EXPOSURE=Object.freeze({total:8547,solar:7942,wind:605,countries:35,published:'2026-10-06',unit:'systems',observationDate:null,plants:null,megawatts:null});
function exposure(lang,mobile){
 const f=lang==='fr',fmt=n=>f?String(n).replace(/\B(?=(\d{3})+(?!\d))/g,' '):n.toLocaleString('en-US');
 let b=head(mobile,f?'MESURER L’EXPOSITION':'MEASURING EXPOSURE',mobile?(f?['Voir une interface,','puis établir l’effet']:['Seeing an interface,','then proving impact']):(f?['Voir une interface, puis établir l’effet']:['Seeing an interface, then proving impact']),mobile?(f?['Modat · publication du 6 octobre 2026','Systèmes déclarés, non vérifiés par l0g']:['Modat · published 6 October 2026','Reported systems, not verified by l0g']):(f?'Modat · publication du 6 octobre 2026 · systèmes déclarés, non vérifiés par l0g':'Modat · published 6 October 2026 · reported systems, not verified by l0g'));
 const x=mobile?28:40,w=mobile?344:920,yy=mobile?208:184;
 b+=label('total',x,yy,w,fmt(EXPOSURE.total),mobile?64:76,C.paper,700);
 b+=label('unit',x,yy+(mobile?86:100),w,f?'systèmes · 35 pays européens':'systems · 35 European countries',mobile?17:20,C.muted);
 const barY=mobile?379:349,solarW=w*EXPOSURE.solar/EXPOSURE.total;
 b+=`<g data-count-bar="true" data-total="8547" data-unit="systems">${rect(x,barY,solarW,22,C.signal,0)}${rect(x+solarW,barY,w-solarW,22,C.amber,0)}${line(x+solarW,barY,x+solarW,barY+22,C.ink,3)}</g>`;
 b+=label('solar-count',x,barY-38,mobile?210:440,(f?'Solaire':'Solar')+'  '+fmt(EXPOSURE.solar),mobile?17:21,C.signal,700);
 b+=label('wind-count',mobile?230:600,barY-38,mobile?142:360,(f?'Éolien':'Wind')+'  '+fmt(EXPOSURE.wind),mobile?17:21,C.amber,700,'end');
 b+=label('unit-warning',x,barY+39,w,mobile?(f?['Le total ne mesure ni un nombre de parcs','ni une puissance contrôlable.']:['The total measures neither plant count','nor controllable capacity.']):(f?'Le total ne mesure ni un nombre de parcs ni une puissance contrôlable.':'The total measures neither plant count nor controllable capacity.'),mobile?15:18,C.muted);
 const names=f?['Droits d’accès','Commande possible','Effet sur le site','Perte financière']:['Access rights','Control capability','Physical impact','Financial loss'];
 const details=f?[['Authentification','et permissions'],['Périmètre réellement','joignable'],['Protections et état','de l’installation'],['Coûts et recettes','selon les contrats']]:[['Authentication','and permissions'],['Equipment actually','reachable'],['Protection systems','and operating state'],['Costs and revenue','under the contracts']];
 if(!mobile){
  b+=label('proof-heading',40,470,920,f?'QUATRE QUESTIONS SUPPLÉMENTAIRES':'FOUR FURTHER QUESTIONS',15,C.muted,700);
  names.forEach((n,i)=>{let xx=40+i*236;b+=node(`proof-${i}`,xx,519,212,163,label(`step-${i}`,xx+18,533,176,`0${i+1}`,15,C.signal,700)+label(`proof-title-${i}`,xx+18,566,176,n,18,C.paper,700)+label(`proof-body-${i}`,xx+18,603,176,details[i],16,C.muted));if(i<3)b+=arrow(xx+215,600,xx+233,600,C.muted);});
  b+=label('no-conversion',40,708,920,f?'Aucun taux de passage connu entre ces étapes. Aucune estimation de MW menacés.':'No known conversion rate between these steps. No estimate of threatened MW.',17,C.amber);
  b+=footer(false,761,f?'Sources : Modat [1–2] · étapes de lecture l0g, éclairées par le NIST [7].':'Sources: Modat [1–2] · l0g analytical stages, informed by NIST [7].');
 }else{
  b+=label('proof-heading',28,493,344,f?'POURSUIVRE LA PREUVE':'FOLLOW THE EVIDENCE',14,C.muted,700);
  names.forEach((n,i)=>{let yy=545+i*140;b+=line(49,yy+32,49,yy+130,C['line-strong'],2,i===3?'5 6':'')+circle(49,yy+29,20,C.signal)+text(49,yy+35,`${i+1}`,17,C.signal,700,'middle')+label(`proof-title-${i}`,86,yy,280,n,20,C.paper,700)+label(`proof-body-${i}`,86,yy+39,280,details[i],17,C.muted);});
  b+=label('no-conversion',28,1117,344,f?['Aucun taux de passage connu.','Aucune estimation de MW menacés.']:['No known conversion rates.','No estimate of threatened MW.'],16,C.amber);
  b+=footer(true,1190,f?['Sources : Modat [1–2].','Étapes de lecture : l0g et NIST [7].']:['Sources: Modat [1–2].','Analytical stages: l0g and NIST [7].']);
 }
 return shell(lang,'exposure',mobile,mobile?1270:828,f?'Des systèmes visibles à une perte à établir':'From visible systems to a loss to be established',f?'Modat compte 7 942 systèmes solaires et 605 éoliens. Les droits, la commande, l’effet physique et la perte sont des questions distinctes, sans quantité connue.':'Modat counts 7,942 solar and 605 wind systems. Permissions, control, physical consequences and loss are distinct questions with no known quantities.',b);
}
function boundaries(lang,mobile){
 const f=lang==='fr';
 let b=head(mobile,f?'POLOGNE · UN INCIDENT DISTINCT':'POLAND · A SEPARATE INCIDENT',mobile?(f?['Deux accès au','même équipement']:['Two ways into','the same device']):(f?['Deux accès au même équipement']:['Two ways into the same device']),mobile?(f?['Attaque du 29 décembre 2025','Rapport complémentaire · 8 août 2026']:['Attack on 29 December 2025','Follow-up report · 8 August 2026']):(f?'Attaque du 29 décembre 2025 · rapport complémentaire du 8 août 2026':'Attack on 29 December 2025 · follow-up report published 8 August 2026'));
 if(!mobile){
  b+=rect(32,191,649,395,C.surface,15,C['line-strong'])+label('site-label',52,205,595,f?'SUR LE SITE ÉOLIEN':'AT THE WIND SITE',14,C.muted,700);
  b+=node('operations',54,277,228,101,label('operations-title',72,291,192,f?'Téléconduite':'Operational control',19,C.paper,700)+label('operations-body',72,326,192,f?'Liaison série spécifiée':'Specified serial link',17,C.signal),C.signal);
  b+=node('router',387,257,271,294,label('router-title',407,272,231,f?'ROUTEUR':'ROUTER',16,C.paper,700));
  b+=rect(402,320,240,64,C['surface-2'],9,C.signal)+label('data-interface',416,334,214,f?'Liaison opérationnelle':'Operational link',18,C.signal,700);
  b+=rect(402,443,240,66,C['surface-2'],9,C.amber)+label('admin-interface',416,458,214,f?'Administration':'Administration',18,C.amber,700);
  b+=arrow(290,352,395,352,C.signal)+label('requirement-met',290,290,100,f?['Exigence','satisfaite']:['Requirement','met'],14,C.signal);
  b+=node('admin-entry',54,439,228,106,label('admin-entry-title',72,453,192,f?['Accès distant','compromis']:['Compromised','remote access'],19,C.paper,700),C.amber);
  b+=arrow(290,476,395,476,C.amber)+label('requirement-missing',290,416,100,f?['Exigence','absente']:['Requirement','missing'],14,C.amber);
  b+=node('private-network',745,276,221,112,label('private-net',764,291,183,f?['Réseau privé','du gestionnaire','de distribution']:['Distribution','operator’s','private network'],18,C.paper,600));
  b+=arrow(666,351,737,351,C.signal);
  b+=edge('reconstruction',path('M855 396 L855 410',C.amber,2,'6 7')+arrow(855,471,855,520,C.amber,'6 7'));
  b+=label('reconstruction-label',730,414,243,f?['Prolongement reconstitué','par le CERT']:['Onward path reconstructed','by the CERT'],15,C.amber,400,'middle');
  b+=node('other-site',745,529,221,83,label('other-site-title',764,547,183,f?'Autre site industriel':'Another industrial site',17,C.paper,600));
  b+=label('reading',40,637,920,f?['Vérifier la liaison attendue ne suffit pas à examiner les moyens de la reconfigurer.','La lacune technique ne tranche pas, à elle seule, la responsabilité juridique.']:['Checking the intended link does not establish how that link can be reconfigured.','The technical gap does not, on its own, settle legal responsibility.'],19,C.paper,400,'start',31);
  b+=footer(false,727,f?'Source : CERT Polska [4], p. 7–9 · architecture simplifiée ; reconstitution comportant des incertitudes.':'Source: CERT Polska [4], pp. 7–9 · simplified architecture; reconstruction retains uncertainties.');
 }else{
  b+=rect(28,211,344,599,C.surface,14,C['line-strong'])+label('site-label',48,225,304,f?'SUR LE SITE ÉOLIEN':'AT THE WIND SITE',14,C.muted,700);
  b+=node('operations',48,277,304,90,label('operations',68,289,264,f?['Téléconduite','Liaison série spécifiée']:['Operational control','Specified serial link'],17,C.paper,600),C.signal);
  b+=arrow(144,375,144,477,C.signal)+label('requirement-met',174,399,171,f?['Exigence','satisfaite']:['Requirement','met'],16,C.signal);
  b+=node('router',48,486,304,114,label('router',66,498,268,f?'UN MÊME ROUTEUR':'THE SAME ROUTER',16,C.paper,700));
  b+=circle(144,548,10,C.signal)+label('data-port',74,564,140,f?'Données':'Operational data',15,C.signal,400,'middle');
  b+=circle(280,548,10,C.amber)+label('admin-port',211,564,131,f?'Administration':'Administration',15,C.amber,400,'middle');
  b+=arrow(280,685,280,608,C.amber)+label('requirement-missing',61,624,180,f?['Exigence absente','sur cet accès']:['No requirements','for this access'],16,C.amber);
  b+=node('admin-entry',48,694,304,82,label('admin',67,708,266,f?['Accès distant compromis','vers l’administration']:['Compromised remote access','to administration'],17,C.paper,600),C.amber);
  b+=edge('private-link',path('M360 548 L383 548 L383 865 L353 865',C.signal)+arrow(353,865,344,865,C.signal));
  b+=node('private-network',48,837,296,94,label('private',68,849,256,f?['Réseau privé du gestionnaire','de distribution']:['Distribution operator’s','private network'],17,C.paper,600));
  b+=line(198,939,198,951,C.amber,2,'6 7')+arrow(198,991,198,1031,C.amber,'6 7')+label('reconstruction',28,958,344,f?['Prolongement reconstitué par le CERT']:['Onward path reconstructed by the CERT'],14,C.amber,400,'middle');
  b+=node('other-site',48,1040,304,70,label('other',66,1058,268,f?'Autre site industriel':'Another industrial site',18,C.paper,600,'middle'));
  b+=label('reading',28,1140,344,f?['La conformité d’une liaison et la sécurité','de son administration se vérifient','séparément.']:['Link compliance and the security','of its administration require','separate checks.'],17,C.paper);
  b+=footer(true,1231,f?['Source : CERT Polska [4], p. 7–9.','Schéma simplifié ; reconstitution incertaine','sur certaines étapes.']:['Source: CERT Polska [4], pp. 7–9.','Simplified diagram; some reconstructed','steps remain uncertain.']);
 }
 return shell(lang,'boundaries',mobile,mobile?1330:795,f?'La liaison opérationnelle et l’administration doivent être examinées séparément':'The operational link and its administration require separate checks',f?'Dans un incident polonais distinct, les exigences couvraient la liaison opérationnelle mais pas l’interface administrative du routeur. Le CERT a reconstitué un chemin vers un réseau privé puis un autre site.':'In a separate Polish incident, requirements covered the operational link but not the router administration interface. The CERT reconstructed a path into a private network and another site.',b);
}
function handoff(lang,mobile){
 const f=lang==='fr';
 let b=head(mobile,f?'DU CONTRAT AU GESTE TECHNIQUE':'FROM CONTRACT TO EXECUTION',mobile?(f?['Un avis doit devenir','une intervention']:['A notice must become','an intervention']):(f?['Un avis doit devenir une intervention']:['A notice must become an intervention']),mobile?(f?['Information, mandat, exécution','Modèle d’organisation proposé par l0g']:['Information, authority, execution','Organisational model proposed by l0g']):(f?'Information, mandat, exécution · modèle d’organisation proposé par l0g':'Information, authority, execution · organisational model proposed by l0g'));
 const top=f?[
 ['FABRICANT','Publier le correctif',['Le rendre disponible','et documenter le changement']],
 ['CLIENT PROFESSIONNEL','Transmettre l’avis',['Relais décrit par les','conditions SMA, art. III.4']],
 ['EXPLOITATION','Identifier le périmètre',['Rapprocher le bulletin','des équipements du parc']]
 ]:[
 ['MANUFACTURER','Release the patch',['Make the remedy available','and document the change']],
 ['BUSINESS CUSTOMER','Pass on the notice',['Relay described in SMA','terms, Article III.4']],
 ['OPERATIONS','Identify the scope',['Match the bulletin to','equipment at the plant']]
 ];
 if(!mobile){
  top.forEach((v,i)=>{const x=40+i*320;b+=node(`information-${i}`,x,199,280,155,label(`role-${i}`,x+18,212,244,v[0],13,C.signal,700)+label(`action-${i}`,x+18,248,244,v[1],20,C.paper,700)+label(`detail-${i}`,x+18,287,244,v[2],16,C.muted));if(i<2)b+=arrow(x+286,277,x+313,277);});
  b+=edge('information-to-work',path('M820 362 L820 401 L510 401',C.signal)+arrow(510,401,510,442));
  b+=node('mandate',40,450,280,176,label('mandate-title',58,466,244,f?'MANDAT ET MOYENS':'AUTHORITY AND RESOURCES',14,C.amber,700)+label('mandate-content',58,505,244,f?['Qui autorise et paie ?','Qui détient l’accès ?','Quel travail est inclus ?']:['Who approves and pays?','Who holds the access?','Which work is included?'],18,C.paper,400,'start',31),C.amber);
  b+=arrow(328,535,359,535,C.amber);
  b+=node('qualification',367,450,286,137,label('qualification-title',387,466,246,f?'Qualifier et tester':'Assess and test',22,C.paper,700)+label('qualification-detail',387,511,246,f?['Préparer le déploiement','et la récupération']:['Prepare deployment','and recovery'],18,C.muted),C.signal);
  b+=arrow(661,518,699,518)+label('validated',664,478,102,f?'Validé':'Ready',13,C.signal);
  b+=node('install',706,450,254,137,label('install-title',725,466,215,f?'Installer':'Deploy',22,C.paper,700)+label('install-detail',725,511,215,f?['Exécuter le changement','autorisé']:['Perform the authorised','change'],18,C.muted),C.signal);
  b+=arrow(833,595,833,653);
  b+=node('proof',706,662,254,124,label('proof-title',725,676,216,f?'Constater le résultat':'Verify the result',20,C.signal,700)+label('proof-detail',725,717,216,f?['Configuration vérifiée','et dossier mis à jour']:['Verified configuration','and updated records'],17,C.paper),C.signal);
  b+=arrow(510,595,510,653,C.amber)+label('deferred',531,611,150,f?'Si report':'If deferred',15,C.amber);
  b+=node('temporary',367,662,286,124,label('temporary-title',385,676,250,f?'Réduire le risque':'Reduce the risk',20,C.amber,700)+label('temporary-detail',385,718,250,f?['Protection temporaire','et date de réexamen']:['Temporary protection','and a review date'],17,C.paper),C.amber);
  b+=edge('review-loop',path('M510 794 L510 824 L344 824 L344 566',C.amber,2,'5 6')+arrow(344,566,359,566,C.amber,'5 6'));
  b+=footer(false,855,f?'Sources : SMA [5–6, 15] et NIST [7] · les rôles exacts restent à vérifier dans chaque contrat.':'Sources: SMA [5–6, 15] and NIST [7] · actual roles must be checked against each contract.');
 }else{
  top.forEach((v,i)=>{const y=215+i*181;b+=node(`information-${i}`,28,y,344,143,label(`role-${i}`,46,y+12,308,v[0],13,C.signal,700)+label(`action-${i}`,46,y+44,308,v[1],21,C.paper,700)+label(`detail-${i}`,46,y+84,308,v[2],16,C.muted));if(i<2)b+=arrow(200,y+151,200,y+172);});
  b+=arrow(200,728,200,752,C.amber);
  b+=node('mandate',28,761,344,121,label('mandate-title',46,775,308,f?'MANDAT ET MOYENS':'AUTHORITY AND RESOURCES',14,C.amber,700)+label('mandate-detail',46,810,308,f?['Autorisation, accès et budget','pour la tâche convenue']:['Approval, access and funding','for the agreed task'],18,C.paper),C.amber);
  b+=arrow(200,890,200,916);
  b+=node('qualification',28,925,344,110,label('qualification-title',46,937,308,f?'Qualifier et tester':'Assess and test',22,C.paper,700)+label('qualification-detail',46,979,308,f?['Préparer le déploiement et la récupération']:['Prepare deployment and recovery'],16,C.muted),C.signal);
  b+=arrow(115,1043,115,1102,C.amber)+label('deferred',143,1059,207,f?'Si report':'If deferred',16,C.amber);
  b+=node('temporary',28,1111,301,116,label('temporary-title',46,1124,265,f?'Réduire le risque':'Reduce the risk',20,C.amber,700)+label('temporary-detail',46,1164,265,f?['Protection temporaire','et réexamen programmé']:['Temporary protection','and scheduled review'],16,C.paper),C.amber);
  b+=edge('review-loop',path('M20 1171 L12 1171 L12 983',C.amber,2,'5 6')+arrow(12,983,24,983,C.amber,'5 6'));
  b+=edge('validated-path',path('M380 980 L389 980 L389 1303 L370 1303',C.signal)+arrow(370,1303,359,1303,C.signal));
  b+=label('validated',28,1251,331,f?'APRÈS VALIDATION':'ONCE VALIDATED',14,C.signal,700);
  b+=node('install',28,1286,323,84,label('install-title',46,1304,285,f?'Installer le correctif':'Deploy the patch',22,C.paper,700),C.signal);
  b+=arrow(200,1378,200,1406);
  b+=node('proof',28,1415,344,112,label('proof-title',46,1428,308,f?'Constater le résultat':'Verify the result',22,C.signal,700)+label('proof-detail',46,1473,308,f?['Configuration vérifiée, dossier mis à jour']:['Verified configuration, updated records'],16,C.paper),C.signal);
  b+=footer(true,1557,f?['Sources : SMA [5–6, 15] et NIST [7].','Modèle l0g, pas un contrat de parc.']:['Sources: SMA [5–6, 15] and NIST [7].','l0g model, not an actual plant contract.']);
 }
 return shell(lang,'handoff',mobile,mobile?1640:922,f?'Relier l’avis, le mandat d’intervention et la preuve d’exécution':'Connect the notice, authority to act and evidence of execution',f?'Le fabricant publie, le client professionnel relaie l’information. L’organisation doit ensuite définir le périmètre, le mandat et les moyens, tester, déployer et vérifier. Un report demande une protection temporaire et un réexamen.':'The manufacturer publishes and the business customer relays information. The organisation must define scope, authority and resources, then test, deploy and verify. Deferral calls for temporary protection and review.',b);
}
function gate(name,x,y,w,h,title,num,mobile){
 const s=15;
 return `<g data-node="${name}">${path(`M${x+s} ${y} H${x+w-s} L${x+w} ${y+h/2} L${x+w-s} ${y+h} H${x+s} L${x} ${y+h/2} Z`,C['line-strong'],1.5,'',C.surface)}${label(name+'-num',x+22,y+13,w-44,num,13,C.signal,700)}${label(name+'-label',x+22,y+46,w-44,title,mobile?20:18,C.paper,700)}</g>`;
}
function coverage(lang,mobile){
 const f=lang==='fr';
 let b=head(mobile,f?'ASSURANCE · LIRE LE PÉRIMÈTRE':'INSURANCE · READ THE SCOPE',mobile?(f?['Trois filtres avant','une indemnité']:['Three filters before','an indemnity']):(f?['Trois filtres avant une indemnité']:['Three filters before an indemnity']),mobile?(f?['Grille de lecture contractuelle','Aucune police de parc n’est présumée']:['A policy-reading framework','No plant’s actual wording is assumed']):(f?'Grille de lecture contractuelle · aucune police de parc n’est présumée':'A policy-reading framework · no plant’s actual wording is assumed'));
 if(!mobile){
  b+=node('lma5401',40,185,295,192,label('5401-title',60,201,255,'LMA5401',19,C.amber,700)+label('5401-body',60,246,255,f?['Exclusion cyber large','dans ce modèle']:['Broad cyber exclusion','in this model'],21,C.paper,600)+label('5401-limit',60,320,255,f?'Application à vérifier':'Actual incorporation must be checked',14,C.muted));
  b+=node('lma5400',358,185,602,192,label('5400-title',378,201,562,'LMA5400',19,C.signal,700)+label('5400-body',378,246,562,f?['Reprise limitée : incendie ou explosion','Dommages physiques uniquement']:['Narrow write-back: fire or explosion','Physical damage only'],21,C.paper,600)+label('5400-limit',378,320,562,f?['Cyber Incident, sans lien avec un Cyber Act, selon le texte.','Pas de couverture générale des pertes d’exploitation.']:['Cyber Incident, with no connection to a Cyber Act, under the wording.','No general business-interruption cover.'],15,C.muted));
  const titles=f?[['Cause entrant','dans la garantie ?'],['Bien et perte','assurés ?'],['Conditions','satisfaites ?']]:[['Cause within','the coverage?'],['Property and','loss insured?'],['Conditions','satisfied?']];
  titles.forEach((t,i)=>{const x=40+i*248;b+=gate(`gate-${i}`,x,440,208,140,t,`0${i+1}`,false);if(i<2)b+=arrow(x+216,510,x+240,510);b+=line(x+104,589,x+104,646,C.amber,2);});
  b+=arrow(752,510,797,510);
  b+=node('possible-payment',806,448,154,124,label('payment',822,465,122,f?['Indemnité','possible']:['Possible','indemnity'],18,C.signal,700)+label('limit',822,524,122,f?['Limites et','franchise']:['Limits and','deductible'],15,C.muted),C.signal);
  b+=line(144,646,640,646,C.amber)+line(391,646,391,657,C.amber)+arrow(391,690,391,703,C.amber);
  b+=label('not-covered',40,661,920,f?'Exclusion ou condition non remplie pour le poste examiné':'Exclusion or unmet condition for the loss item being examined',16,C.amber,400,'middle');
  b+=node('retained',202,712,574,77,label('retained',224,732,530,f?'Reste à charge / autres recours à examiner':'Retained loss / other recovery routes to assess',20,C.paper,600,'middle'),C.amber);
  b+=footer(false,828,f?'Sources : modèles LMA [9–11, 16] · schéma l0g ; ni avis de couverture ni décision d’indemnisation.':'Sources: LMA models [9–11, 16] · l0g framework; not a coverage opinion or a claims decision.');
 }else{
  b+=node('lma5401',28,214,344,121,label('5401-title',46,226,308,'LMA5401',20,C.amber,700)+label('5401-body',46,269,308,f?['Exclusion cyber large','dans ce modèle']:['Broad cyber exclusion','in this model'],18,C.paper));
  b+=node('lma5400',28,355,344,188,label('5400-title',46,368,308,'LMA5400',20,C.signal,700)+label('5400-body',46,408,308,f?['Dommages physiques d’incendie','ou d’explosion : Cyber Incident,','sans lien avec un Cyber Act.']:['Physical fire or explosion damage:','Cyber Incident, with no connection','to a Cyber Act.'],17,C.paper)+label('5400-limit',46,494,308,f?['Reprise limitée, selon les conditions du texte.']:['Limited write-back, subject to the wording.'],14,C.muted));
  const titles=f?[['Cause entrant','dans la garantie ?'],['Bien et perte','assurés ?'],['Conditions','satisfaites ?']]:[['Cause within','the coverage?'],['Property and','loss insured?'],['Conditions','satisfied?']];
  titles.forEach((t,i)=>{const yy=604+i*196;b+=gate(`gate-${i}`,28,yy,284,149,t,`0${i+1}`,true);if(i<2)b+=arrow(170,yy+157,170,yy+185);b+=line(320,yy+75,352,yy+75,C.amber);});
  b+=path('M352 679 L352 1403 L324 1403',C.amber)+arrow(324,1403,310,1403,C.amber);
  b+=arrow(170,1153,170,1184);
  b+=node('possible-payment',28,1193,284,101,label('payment',46,1207,248,f?'Indemnité possible':'Possible indemnity',21,C.signal,700)+label('limit',46,1250,248,f?'Limites et franchise à appliquer':'Apply limits and deductible',15,C.muted),C.signal);
  b+=label('not-covered',28,1324,302,f?['Si exclusion ou condition non remplie']:['If excluded or a condition is unmet'],14,C.amber);
  b+=node('retained',28,1365,274,109,label('retained',46,1381,238,f?['Reste à charge','Autres recours à examiner']:['Retained loss','Other recoveries to assess'],17,C.paper,600),C.amber);
  b+=footer(true,1514,f?['Sources : modèles LMA [9–11, 16].','Schéma l0g, pas une décision de couverture.']:['Sources: LMA models [9–11, 16].','l0g framework, not a coverage decision.']);
 }
 return shell(lang,'coverage',mobile,mobile?1595:896,f?'Le contrat filtre l’événement, la perte et les conditions de paiement':'The contract filters cause, loss and payment conditions',f?'LMA5401 et LMA5400 sont des modèles de clauses. Une indemnité dépend de la cause couverte, du bien et de la perte assurés et du respect des conditions. Le schéma ne décrit aucune police obtenue auprès d’un parc.':'LMA5401 and LMA5400 are model wordings. An indemnity depends on a covered cause, insured property and loss, and fulfilment of conditions. This diagram describes no actual plant policy.',b);
}
function cash(lang,mobile){
 const f=lang==='fr';
 let b=head(mobile,f?'FINANCE · DEUX HORLOGES':'FINANCE · TWO CLOCKS',mobile?(f?['Payer la remise','en service']:['Funding the','restoration']):(f?['Payer la remise en service avant le règlement']:['Funding restoration before a claim is settled']),mobile?(f?['Scénario qualitatif, sans durée ni montant','L’indemnité reste conditionnelle']:['Qualitative scenario; no times or amounts','Any indemnity remains conditional']):(f?'Scénario qualitatif, sans durée ni montant · l’indemnité reste conditionnelle':'Qualitative scenario; no times or amounts · any indemnity remains conditional'));
 if(!mobile){
  const sx=247,ex=936;
  b+=arrow(sx,211,ex,211,C.muted)+label('qualitative-order',247,170,689,f?'REPÈRES ILLUSTRATIFS · PAS UNE ÉCHELLE DE TEMPS':'ILLUSTRATIVE LANDMARKS · NOT A TIME SCALE',13,C.muted,700);
  b+=label('technical',40,263,190,f?['Service','technique']:['Technical','service'],20,C.paper,700);
  b+=rect(sx,294,379,19,C.amber,4)+line(635,303,ex,303,C.signal,3)+circle(632,303,7,C.signal);
  b+=label('restore-work',sx,252,364,f?'Diagnostic et restauration':'Diagnosis and restoration',18,C.amber)+label('restored',654,252,290,f?'Fonction rétablie':'Function restored',18,C.signal);
  b+=line(40,363,960,363);
  b+=label('generation',40,398,190,f?['Production','de courant']:['Electricity','generation'],20,C.paper,700);
  b+=line(sx,421,ex,421,C.signal,3)+label('generation-continued',sx,380,689,f?'Peut continuer malgré la perte de supervision':'May continue despite lost monitoring',18,C.signal);
  b+=path(`M${sx} 469 L356 469 L356 498 L610 498 L610 469 L${ex} 469`,C.amber,2,'6 6');
  b+=label('generation-outage',sx,508,689,f?'Autre scénario : arrêt éventuel, à établir et à chiffrer':'Alternative scenario: any outage must be established and quantified',16,C.amber);
  b+=line(40,561,960,561);
  b+=label('payments',40,594,190,f?['Décaissements','du propriétaire']:['Owner’s','cash payments'],20,C.paper,700);
  b+=line(sx,641,ex,641,C['line-strong']);
  [310,523,723].forEach((x,i)=>{b+=circle(x,610,5,C.amber)+arrow(x,618,x,660,C.amber);});
  b+=label('expenses',247,674,689,f?'Travaux et échéances restant dus selon les contrats':'Restoration costs and obligations still due under the contracts',17,C.amber);
  b+=line(40,725,960,725);
  b+=label('insurance',40,759,190,f?['Dossier','d’assurance']:['Insurance','claim'],20,C.paper,700);
  b+=line(sx,807,ex,807,C.muted,2,'6 7')+circle(486,807,7,C.muted)+circle(862,807,8,C.signal);
  b+=label('claim-examination',247,756,368,f?'Instruction et justificatifs':'Assessment and supporting evidence',18,C.muted);
  b+=label('advance',337,833,287,f?'Avance éventuelle':'Possible advance',16,C.muted,'400','middle')+label('settlement',722,833,238,f?'Indemnité, si due':'Indemnity, if due',17,C.signal,600,'middle');
  b+=path('M247 896 L247 912 L862 912 L862 896',C.amber,2)+label('bridge',247,929,689,f?'Un besoin de financement peut subsister dans l’intervalle.':'A funding requirement may remain in the intervening period.',20,C.paper,600,'middle');
  b+=footer(false,991,f?'Modèle l0g · continuité de production : CERT Polska [3] ; indemnité conditionnelle : [10–11].':'l0g model · continued generation: CERT Polska [3]; conditional indemnity: [10–11].');
 }else{
  b+=label('technical',28,219,344,f?'01 / RÉTABLIR LE SERVICE':'01 / RESTORE THE SERVICE',15,C.paper,700);
  b+=rect(36,292,209,16,C.amber,4)+line(252,300,365,300,C.signal,3)+circle(249,300,7,C.signal);
  b+=label('restore-work',28,252,228,f?'Diagnostic, restauration':'Diagnosis, restoration',16,C.amber)+label('restored',265,252,107,f?'Reprise':'Restored',16,C.signal,'400','end');
  b+=line(28,356,372,356);
  b+=label('generation',28,378,344,f?'02 / OBSERVER LA PRODUCTION':'02 / CHECK GENERATION',15,C.paper,700);
  b+=line(36,462,365,462,C.signal,3)+label('generation-continued',28,418,344,f?'Elle peut continuer.':'It may continue.',18,C.signal);
  b+=path('M36 513 L111 513 L111 543 L255 543 L255 513 L365 513',C.amber,2,'6 6');
  b+=label('generation-outage',28,569,344,f?['Ou s’arrêter : effet et perte','restent à établir.']:['Or stop: both the effect and the loss','still need to be established.'],17,C.amber);
  b+=line(28,643,372,643);
  b+=label('payments',28,665,344,f?'03 / FINANCER LES DÉPENSES':'03 / FUND THE EXPENDITURE',15,C.paper,700);
  b+=line(36,742,365,742,C['line-strong']);[99,201,308].forEach(x=>{b+=circle(x,719,5,C.amber)+arrow(x,727,x,774,C.amber);});
  b+=label('expenses',28,795,344,f?['Travaux et échéances restant dus','selon les contrats.']:['Restoration costs and obligations','still due under the contracts.'],17,C.amber);
  b+=line(28,873,372,873);
  b+=label('insurance',28,895,344,f?'04 / INSTRUIRE LE SINISTRE':'04 / ASSESS THE CLAIM',15,C.paper,700);
  b+=line(36,982,365,982,C.muted,2,'6 7')+circle(117,982,7,C.muted)+circle(323,982,8,C.signal);
  b+=label('claim-examination',28,936,344,f?'Instruction et justificatifs':'Assessment and supporting evidence',17,C.muted);
  b+=label('advance',28,1007,174,f?['Avance','éventuelle']:['Possible','advance'],16,C.muted,'400','middle')+label('settlement',220,1007,152,f?['Indemnité,','si due']:['Indemnity,','if due'],16,C.signal,600,'middle');
  b+=node('bridge',28,1102,344,146,label('bridge-title',46,1117,308,f?'BESOIN INTERMÉDIAIRE':'INTERIM FUNDING NEED',14,C.amber,700)+label('bridge-body',46,1155,308,f?['L’argent à avancer peut différer','de la perte finalement conservée.','Aucun montant n’est estimé ici.']:['Cash needed upfront can differ','from the loss ultimately retained.','No amount is estimated here.'],17,C.paper),C.amber);
  b+=footer(true,1281,f?['Modèle l0g · sources [3, 10–11].','Repères illustratifs, pas une échelle de temps.']:['l0g model · sources [3, 10–11].','Illustrative landmarks, not a time scale.']);
 }
 return shell(lang,'cash',mobile,mobile?1368:1059,f?'Le besoin de trésorerie et la perte finale sont différents':'The liquidity need and the final loss are different',f?'Scénario qualitatif : restauration, production, dépenses et règlement d’assurance peuvent suivre des temporalités différentes. La production peut continuer. Les dépenses restant dues doivent être financées ; une avance ou indemnité est conditionnelle. Aucun montant ni délai n’est mesuré.':'Qualitative scenario: restoration, generation, expenditure and claim settlement can follow different timelines. Generation may continue. Obligations still due need funding; an advance or indemnity is conditional. No amounts or durations are measured.',b);
}
const renderers=Object.freeze({exposure,boundaries,handoff,coverage,cash});
export function renewablesAccessSvg(lang,kind,mobile=false){
 if(lang!=='fr'&&lang!=='en')throw new TypeError('Unsupported figure language');
 if(typeof kind!=='string'||!Object.hasOwn(renderers,kind))throw new TypeError('Unsupported figure kind');
 if(typeof mobile!=='boolean')throw new TypeError('mobile must be a boolean');
 return renderers[kind](lang,mobile);
}

// Only enumerated static compositions enter set:html. Captions remain Astro text.
export function validateRenewablesAccessFigure(props) {
 if (!props || typeof props !== 'object' || Array.isArray(props)) throw new TypeError('Invalid renewables figure props');
 const {lang='fr', kind, number, caption, sources}=props;
 if (lang!=='fr' && lang!=='en') throw new TypeError('Unsupported figure language');
 const kinds=['exposure','boundaries','handoff','coverage','cash'];
 if (typeof kind!=='string' || !kinds.includes(kind)) throw new TypeError('Unsupported figure kind');
 if (typeof number!=='string' || !/^0?[1-5]$/.test(number) || Number(number)!==kinds.indexOf(kind)+1) throw new TypeError('Invalid renewables figure number');
 if (typeof caption!=='string' || !caption.trim()) throw new TypeError('Invalid renewables figure caption');
 if (typeof sources!=='string') throw new TypeError('Invalid renewables figure source reference');
 const references=sources.split(/\s+/).filter(Boolean);
 if (!references.length || references.some(id=>!/^[1-9]\d?$/.test(id)) || new Set(references).size!==references.length) throw new TypeError('Invalid renewables figure source reference');
 return {lang,kind,number,caption,references};
}
