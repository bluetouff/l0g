/** l0g.fr | Figures de l'enquête Google Cloud / finance, 24 octobre 2026.
 *  SVG générés à partir de valeurs et jalons explicitement sourcés.
 *  Ce module ne comporte aucune dépendance réseau.
 */
export const GOOGLE_CLOUD_KINDS = Object.freeze(['power', 'cascade', 'timeline', 'bank-impact', 'regulation']);
export const GOOGLE_CLOUD_SOURCES = Object.freeze(['01 04', '01 10', '01', '02 03 04 14', '05 06 07 15 01']);
const C = Object.freeze({bg:'var(--color-ink)',panel:'var(--color-surface)',panel2:'var(--color-surface-2)',line:'var(--color-line-strong)',muted:'var(--color-muted)',white:'var(--color-paper)',blue:'var(--color-signal)',cyan:'var(--color-signal)',amber:'var(--color-amber)',red:'var(--color-accent)',green:'var(--color-signal)'});
const E = s => String(s).replace(/[&<>"']/gu, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
let scene;
const rect=(x,y,w,h,fill=C.panel,rx=20,stroke='none',sw=1)=>{
 const id=`${scene.id}-panel-${scene.panels.length}`;
 scene.panels.push({id,x,y,w,h});
 return `<rect id="${id}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
};
const text=(x,y,str,size=24,color=C.white,weight=400,anchor='start')=>{
 size=Math.max(size,scene.mobile?30:22); weight=weight>=600?700:400;
 if(str.includes('\n')) return str.split('\n').map((value,i)=>text(x,y+i*(scene.mobile?40:28),value,size,color,weight,anchor)).join('');
 const panel=scene.panels.findLast(p=>x>=p.x&&x<=p.x+p.w&&y>p.y&&y<p.y+p.h)??scene.panels[0];
 const maxWidth=anchor==='middle'?2*Math.min(x-panel.x-12,panel.x+panel.w-x-12):anchor==='end'?x-panel.x-12:panel.x+panel.w-x-12;
 return `<text data-panel="${panel.id}" data-max-width="${maxWidth}" x="${x}" y="${y}" font-family="l0g Google Cloud Banking" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${E(str)}</text>`;
};
const line=(x1,y1,x2,y2,color=C.line,w=3,dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${w}"${dash?' stroke-dasharray="8 7"':''}/>`;
const path=(d,color=C.line,w=3,dash='')=>`<path d="${d}" fill="none" stroke="${color}" stroke-width="${w}"${dash?' stroke-dasharray="8 7"':''}/>`;
const circle=(cx,cy,r,fill)=>`<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"/>`;
const tag=(x,y,str,ink=C.cyan)=>`${rect(x,y-32,Math.max(208,str.length*17+30),52,C.panel2,14)}${text(x+17,y+4,str,scene.mobile?30:24,ink,700)}`;
const arrow=(x1,y1,x2,y2,color=C.cyan,w=4)=>{
 const angle=Math.atan2(y2-y1,x2-x1), c=Math.cos(angle),s=Math.sin(angle);
 const a=[x2-11*c+8*s,y2-11*s-8*c], b=[x2-11*c-8*s,y2-11*s+8*c];
 return `${line(x1,y1,x2,y2,color,w)}${path(`M ${a[0]} ${a[1]} L ${x2} ${y2} L ${b[0]} ${b[1]}`,color,w)}`;
};
function svgStart(k,lang,mobile,title,sub) {
 const W=mobile?740:1300,H=mobile?1240:850,id=`google-cloud-${lang}-f${GOOGLE_CLOUD_KINDS.indexOf(k)+1}-${mobile?'m':'d'}`;
 scene={id,mobile,panels:[]};
 let s=`<svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto" viewBox="0 0 ${W} ${H}" class="l0g-google-cloud-svg" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${E(title)}</title><desc id="${id}-desc">${E(lang==='fr'?'Mécanismes et jalons du 20 octobre 2026. Rapport Google préliminaire et sources dans la légende. Les perturbations publiquement rapportées ne décrivent pas les architectures bancaires.':'Mechanisms and milestones from 20 October 2026. Preliminary Google report and sources in the caption. Publicly reported disruption does not identify bank architectures.')}</desc>`;
 s+=rect(0,0,W,H,C.bg,20);
 s+=rect(28,26,W-56,143,C.panel,18);
 s+=text(52,67,lang==='fr'?'L0G / INFRASTRUCTURES':'L0G / INFRASTRUCTURE',mobile?30:24,C.cyan,700);
 s+=text(52,115,title,mobile?31:37,C.white,700);
 s+=text(52,153,sub,mobile?30:22,C.muted);
 return {W,H,id,s};
}
const finish=(s,W,H,src,lang,method)=>{
 const fr=lang==='fr';
 src=src.replace('rapport préliminaire',fr?'préliminaire':'preliminary');
 return s+`${line(52,H-108,W-52,H-108,C.line,2)}${text(58,H-70,src,scene.mobile?30:22,C.muted)}${text(58,H-28,method,scene.mobile?30:22,C.muted)}</svg>`;
};
function power(lang,mobile){
 const fr=lang==='fr';const a=svgStart('power',lang,mobile,fr?'Sept minutes avant la panne':'Seven minutes before the outage',fr?'Londres · 20 octobre 2026 · BST':'London · 20 October 2026 · BST');let {s,W,H}=a;
 if(!mobile){
 s+=tag(60,219,'06:53 BST',C.amber)+tag(1025,219,'07:00 BST',C.red);
 s+=rect(60,254,234,148,C.panel2,16)+text(82,300,fr?'RÉSEAU':'GRID',23,C.blue,700)+text(82,335,fr?'Coupure':'Outage',28,C.white,700)+text(82,369,fr?'électrique':'of supply',21,C.muted);
 s+=rect(342,254,252,148,C.panel2,16)+text(364,300,'UPS',27,C.cyan,750)+text(364,335,fr?'Batteries':'Battery banks',24,C.white,700)+text(363,372,fr?'Alimentation relais':'Temporary bridging',19,C.muted);
 s+=rect(628,254,240,148,C.panel2,16)+text(648,300,fr?'GÉNÉRATEURS':'GENERATORS',22,C.amber,750)+text(648,336,fr?'Pas de reprise':'No load transfer',22,C.white,700)+text(648,371,fr?'de la charge':'to generators',19,C.muted);
 s+=rect(912,254,325,148,C.panel2,16)+text(932,300,'EUROPE-WEST2-B',19,C.red,750)+text(922,339,fr?'Hôtes, réseau, stockage':'Hosts, network, storage',22,C.white,700)+text(932,373,fr?'Hors ligne':'Offline',23,C.red,750);
 s+=arrow(294,328,335,328,C.cyan);s+=line(594,328,617,328,C.red,4,'7 8');s+=text(612,315,'×',31,C.red,750,'middle');s+=arrow(869,328,901,328,C.red);
 s+=rect(60,440,1177,228,C.panel,18);
 s+=text(83,482,fr?'LOGIQUE AUTOMATIQUE DE SECOURS':'AUTOMATIC BACKUP CONTROL',22,C.blue,800);
 s+=rect(84,517,490,97,C.panel,14,C.line)+text(111,553,fr?'Automate principal (PLC)':'Primary controller (PLC)',24,C.white,700)+text(111,588,fr?'Échec du démarrage / transfert':'Start / transfer command failed',20,C.red);
 s+=rect(600,517,605,97,C.panel,14,C.line)+text(630,553,fr?'Automate de secours (PLC)':'Backup controller (PLC)',24,C.white,700)+text(630,588,fr?'Échec également documenté':'Failure also reported',20,C.red);
 s+=circle(1170,479,11,C.red);s+=text(1148,486,fr?'2 défaillances':'2 failures',22,C.red,700,'end');
 s+=text(86,646,fr?'6:53 → 7:00 : intervalle entre coupure et début d’épuisement des batteries':'06:53 → 07:00: grid failure to the beginning of battery depletion',17,C.muted);
 } else {
 s+=tag(56,215,'06:53 BST',C.amber);s+=rect(54,246,632,126,C.panel2,16)+text(82,290,fr?'RÉSEAU ÉLECTRIQUE':'ELECTRICAL GRID',23,C.blue,750)+text(82,327,fr?'Interruption de l’alimentation':'Power supply interruption',27,C.white,700);
 s+=line(369,372,369,414,C.cyan,4)+circle(369,416,7,C.cyan);
 s+=rect(54,433,632,138,C.panel2,16)+text(82,484,'UPS / BATTERIES',27,C.cyan,750)+text(82,526,fr?'La charge passe sur batteries':'Batteries temporarily supply load',23,C.white,650);
 s+=line(369,571,369,611,C.red,4,'8 6');
 s+=rect(54,624,302,142,C.panel2,16)+text(76,667,fr?'PLC PRINCIPAL':'PRIMARY PLC',21,C.white,750)+text(76,703,fr?'Échec du\ntransfert':'Transfer\nfailed',20,C.red,650);
 s+=rect(379,624,307,142,C.panel2,16)+text(399,667,fr?'PLC SECOURS':'BACKUP PLC',21,C.white,750)+text(399,703,fr?'Échec\négalement':'Also failed',20,C.red,650);
 s+=text(367,805,fr?'Générateurs : aucune reprise de charge':'Generators: failed to take over the load',22,C.amber,650,'middle');
 s+=line(368,828,368,852,C.red,4);s+=tag(56,875,'07:00 BST',C.red);
 s+=rect(54,907,632,158,C.panel,16)+text(82,954,'EUROPE-WEST2-B',26,C.white,750)+text(82,1000,fr?'Serveurs, réseau,\nstockage hors ligne':'Hosts, network and\nstorage offline',23,C.red,650);
 }
 return finish(s,W,H,'Google Cloud · rapport préliminaire · 22.10.2026',lang,fr?'Séquence reconstituée':'Reconstructed sequence');
}
function cascade(lang,mobile){
 const fr=lang==='fr';let {s,W,H}=svgStart('cascade',lang,mobile,fr?'Une zone tombe, la région ralentit':'One zone fails, the region slows',fr?'Deux voies de propagation documentées':'Two documented propagation paths');
 if(!mobile){
 s+=rect(61,198,337,361,C.panel,24,C.panel,2)+text(91,247,'EUROPE-WEST2-B',25,C.red,760)+text(91,290,fr?'Zone indisponible':'Offline zone',28,C.white,700);
 s+=rect(91,333,274,69,C.panel,12)+text(114,362,fr?'Calcul / disques /\nréseau':'Compute / disks /\nnetwork',19,C.white,650);
 s+=rect(91,425,274,69,C.panel,12)+text(113,451,fr?'Données et\nmétadonnées':'Data and metadata',20,C.white,650);
 s+=rect(487,199,748,139,C.panel2,20)+text(518,242,fr?'ROUTE 1 · DÉPORT DE CHARGE':'PATH 1 · FAILOVER LOAD',21,C.cyan,750)+text(518,283,fr?'Zones A et C disponibles, capacité finie':'Zones A and C remain up, with finite capacity',25,C.white,700)+text(518,312,fr?'Files d’attente · reports de bases · erreurs 500 / 503':'Queues · database failovers · HTTP 500 / 503',18,C.muted);
 s+=rect(487,376,748,139,C.panel2,20)+text(518,420,fr?'ROUTE 2 · DÉPENDANCE DE CONTRÔLE':'PATH 2 · CONTROL PLANE DEPENDENCY',21,C.amber,750)+text(518,458,fr?'Appels synchrones vers des éléments hors ligne':'Synchronous calls to unavailable components',24,C.white,700)+text(518,490,fr?'Timeouts → soumission de tâches et API ralenties':'Timeouts → job submissions and APIs slow down',18,C.muted);
 s+=path('M398 367 H444 V268 H475',C.cyan,4)+circle(475,268,7,C.cyan)+path('M398 451 H445 V445 H475',C.amber,4)+circle(475,445,7,C.amber);
 s+=rect(61,582,1174,97,C.panel,16)+text(89,621,fr?'EFFET RÉGIONAL MESURÉ PAR GOOGLE':'REGIONAL EFFECT REPORTED BY GOOGLE',20,C.cyan,750)+text(89,659,fr?'Des charges hébergées dans A et C ont aussi subi des erreurs.':'Some workloads hosted in zones A and C also saw errors.',25,C.white,650);
 }else{
 s+=rect(54,204,632,214,C.panel,20,C.panel,2)+text(85,254,'EUROPE-WEST2-B',29,C.red,800)+text(85,302,fr?'Hôtes, réseau, stockage hors ligne':'Hosts, network, storage offline',25,C.white,650)+text(85,358,fr?'Déclenche 2 effets documentés':'Triggers two documented effects',24,C.muted);
 s+=path('M368 420 V472',C.red,5);s+=circle(368,473,7,C.red);
 s+=rect(54,496,632,217,C.panel2,20)+text(82,542,fr?'01 · DÉPORT DE CHARGE':'01 · FAILOVER LOAD',25,C.cyan,780)+text(82,585,fr?'Capacités de A et C saturées':'Zones A and C face saturation',25,C.white,700)+text(82,628,fr?'Files, latences, erreurs 500/503':'Queues, latency, errors 500/503',22,C.muted)+text(82,674,fr?'La redondance réclame de la capacité':'Redundancy requires spare capacity',20,C.cyan);
 s+=rect(54,742,632,228,C.panel2,20)+text(82,789,fr?'02 · DÉPENDANCE DE CONTRÔLE':'02 · CONTROL DEPENDENCY',24,C.amber,780)+text(82,834,fr?'Appels vers la zone hors ligne':'Calls to unavailable components',24,C.white,650)+text(82,879,fr?'→ délais et requêtes bloquées':'→ timeouts and blocked requests',23,C.muted)+text(82,925,fr?'Présente aussi hors de la zone B':'Also affects workloads outside zone B',19,C.amber);
 }return finish(s,W,H,'Google Cloud · rapport préliminaire · 22.10.2026',lang,fr?'Propagation dans la plateforme Google':'Propagation within Google’s platform');
}
function timeline(lang,mobile){
 const fr=lang==='fr'; let {s,W,H}=svgStart('timeline',lang,mobile,fr?'La panne et la reprise progressive':'The outage and its recovery tail',fr?'20 octobre 2026 · Londres (BST)':'20 October 2026 · London (BST)');
 const events=[['06:53',fr?'Coupure réseau':'Grid disruption',C.amber],['07:00',fr?'Début incident':'Service outage',C.red],['07:08',fr?'Alerte Google':'Google detects',C.red],['12:29',fr?'Services centraux revenus':'Core services restored',C.cyan],['12:46',fr?'Nouvelles VM possibles':'New VM creation resumes',C.cyan],['13:10',fr?'Rétablissement majoritaire':'Vast majority recovered',C.green],['15:03',fr?'Clôture du statut':'Status closure',C.blue]];
 if(!mobile){
 const x0=107,xFinal=1161,xtail=107+((13*60+10-7*60)/(15*60+3-7*60))*1054;
 s+=rect(58,199,1180,158,C.panel,18);
 s+=text(90,244,fr?'Dégradation de la plateforme Google':'Google platform disruption',23,C.white,730);
 s+=rect(x0,270,xtail-x0,52,C.red,12)+rect(xtail,270,xFinal-xtail,52,C.cyan,12);
 s+=text(x0+15,301,fr?'07:00 · début':'07:00 · start',20,C.bg,760);
 s+=text((x0+xtail)/2,301,fr?'6 h 10 min':'6h 10m',25,C.bg,800,'middle');
 s+=text(xtail+6,342,'13:10',19,C.cyan,720);
 s+=text(xFinal-5,342,'15:03',19,C.blue,730,'end');
 s+=text(xFinal-14,301,fr?'clôture':'closure',18,C.bg,700,'end');
 const cards=[
 ['06:53',fr?'Coupure électrique':'Grid interruption',fr?'7 min avant le début de l’incident':'7 min before the incident starts',C.amber],
 ['07:08',fr?'Alerte des équipes Google':'Google engineering alert',fr?'Erreurs API, serveurs injoignables':'API errors, unreachable infrastructure',C.red],
 ['12:29',fr?'Retour des principaux services':'Major services restored',fr?'Fin de la première phase (5 h 29)':'First phase ends (5h 29m)',C.cyan],
 ['12:46',fr?'Création de nouvelles VM':'New VM creation resumes',fr?'13:10 : plus de 99 % des VM saines':'13:10: over 99% of VMs healthy',C.green]
 ];
 cards.forEach((v,i)=>{const x=58+(i%2)*599,y=379+Math.floor(i/2)*135;
 s+=rect(x,y,581,117,C.panel2,13,C.line,1)+rect(x+15,y+18,113,54,C.panel,11)+text(x+31,y+54,v[0],25,v[3],780);
 s+=text(x+146,y+48,v[1],24,C.white,730)+text(x+146,y+83,v[2],18,C.muted,470);
 });
 s+=text(82,668,fr?'La reprise des applications clientes suit un calendrier distinct.':'Platform and customer recoveries follow separate timelines.',19,C.amber,630);
 }else{
 s+=rect(55,195,632,844,C.panel,18);
 s+=rect(90,237,15,686,C.panel,8);
 events.forEach((e,i)=>{const y=247+i*98;s+=circle(98,y,11,e[2]);s+=text(136,y-1,e[0],29,e[2],760)+text(266,y-1,e[1],24,C.white,570);if(i!==events.length-1)s+=line(98,y+14,98,y+83,C.line,3);});
 s+=rect(125,941,520,64,C.panel,12)+text(147,981,fr?'6 h 10 : 07:00 → 13:10 BST':'6h 10m: 07:00 → 13:10 BST',23,C.cyan,740);
 }return finish(s,W,H,'Google Cloud · rapport préliminaire · 22.10.2026',lang,fr?'Heures locales · reconstitution':'Local times · reconstruction');
}
function bankImpact(lang,mobile){
 const fr=lang==='fr';let {s,W,H}=svgStart('bank-impact',lang,mobile,fr?'Même incident, services différents':'One incident, different services',fr?'Effets publiquement rapportés':'Publicly reported effects');
 const banks=[{name:'REVOLUT',accent:C.red,items:fr?['Connexion, cartes,\nvirements','Retraits et opérations\nboursières','18:00 BST :\n6 services/27 actifs']:['Login, cards, transfers','ATMs and stock trading','18:00 BST:\n6 of 27 services up'],src:'Reuters 20.10'},{name:'LLOYDS / HALIFAX',accent:C.amber,items:fr?['Application et banque\nen ligne','Difficultés variables\nselon le service','Architecture non publiée']:['App and online banking','Disruptions varied\nby service','Architecture not disclosed'],src:'Reuters / AP 20.10'},{name:'HSBC',accent:C.blue,items:fr?['Accès à certains services','Perturbations reconnues','Architecture non publiée']:['Access to some services','Disruption acknowledged','Architecture not disclosed'],src:'Reuters / AP 20.10'}];
 if(!mobile){
 banks.forEach((b,i)=>{const x=54+i*406;s+=rect(x,220,382,383,C.panel2,20,C.line,2)+rect(x+19,240,6,63,b.accent,3)+text(x+45,278,b.name,27,C.white,770);b.items.forEach((v,j)=>{s+=circle(x+41,344+j*77,7,b.accent)+text(x+62,352+j*77,v,i===0?19:20,C.white,520)});s+=line(x+24,550,x+358,550,C.line,2)+text(x+30,587,b.src,17,C.muted)});
 s+=rect(54,628,1194,81,C.panel,15)+text(80,662,fr?'INCONNU À CE STADE':'NOT PUBLICLY ESTABLISHED',20,C.amber,770)+text(80,689,fr?'Services Google consommés par chaque banque, bascule réelle et pertes clients.':'Each bank’s affected Google services, failover design and customer losses.',20,C.white,550);
 }else{
 banks.forEach((b,i)=>{const y=194+i*255;s+=rect(54,y,632,231,C.panel2,17,C.line,2)+rect(72,y+22,7,51,b.accent,3)+text(97,y+58,b.name,28,C.white,770);b.items.forEach((v,j)=>{s+=circle(96,y+102+j*39,6,b.accent)+text(119,y+109+j*39,v.replaceAll('\n',' '),22,C.white,500)})});
 s+=rect(54,971,632,110,C.panel,14)+text(80,1008,fr?'Chaînes internes des banques :\nnon publiées':'Banks’ internal service maps:\nnot disclosed',21,C.amber,750);
 }return finish(s,W,H,'Reuters / AP · 20.10.2026',lang,fr?'« 6/27 » = état UK à un instant T':'“6/27” = UK status snapshot');
}
function regulation(lang,mobile){
 const fr=lang==='fr';let {s,W,H}=svgStart('regulation',lang,mobile,fr?'Les règles à l’épreuve du réel':'Resilience rules meet reality',fr?'Désignation · exercice · incident · enquête':'Designation · drill · outage · scrutiny');
 const ev=[['13.07','2026',fr?'4 prestataires\ncritiques':'4 critical\nproviders',fr?'désignés au\nRoyaume-Uni':'designated\nin the UK',C.blue],['08.10','2026',fr?'38 institutions':'38 institutions',fr?'exercice SIMEX26':'SIMEX26 exercise',C.cyan],['20.10','2026',fr?'Panne de Londres':'London outage',fr?'courrier du Parlement':'Parliamentary letter',C.red],['22.10','2026',fr?'Rapport provisoire':'Preliminary report',fr?'automates et\nreport de charge':'PLCs and regional spillover',C.amber]];
 if(!mobile){
 s+=rect(55,202,1190,415,C.panel,17)+line(123,328,1177,328,C.line,7);
 ev.forEach((v,i)=>{const x=165+i*303;s+=circle(x,328,17,v[4])+line(x,346,x,389,v[4],3)+text(x,269,v[0],29,v[4],760,'middle')+text(x,297,v[1],19,C.muted,600,'middle')+text(x,433,v[2],22,C.white,740,'middle')+text(x,497,v[3],19,C.muted,530,'middle')});
 s+=rect(77,535,1143,65,C.panel,11)+text(102,577,fr?'4 NOV. 2026 : PREMIER RETOUR DEMANDÉ · 20 JANV. 2027 : RÉPONSE COMPLÈTE':'4 NOV 2026: INITIAL RESPONSE REQUESTED · 20 JAN 2027: FULL RESPONSE',20,C.white,720);
 s+=text(70,660,fr?'38 : institutions participant à l’exercice SIMEX26.':'38: institutions participating in the SIMEX26 exercise.',20,C.amber,650);
 }else{
 ev.forEach((v,i)=>{const y=200+i*196;s+=rect(54,y,631,172,C.panel2,17,C.line,1)+rect(75,y+23,128,54,C.panel,13)+text(89,y+60,v[0],27,v[4],790)+text(232,y+57,v[2],26,C.white,700)+text(88,y+139,v[3].replaceAll('\n',' '),21,C.muted,500)});
 s+=rect(54,1001,631,104,C.panel,11)+text(76,1042,fr?'4 nov. : premier retour\n20 janv. : réponse complète':'4 Nov: first reply\n20 Jan: full reply requested',20,C.cyan,710);
 }return finish(s,W,H,'FCA · BoE · UK Parliament · Google',lang,fr?'Jalons institutionnels datés':'Dated institutional milestones');
}
export function googleCloudBankingSvg(lang,kind,mobile=false){
 if(typeof lang!=='string'||!['fr','en'].includes(lang)) throw new Error('lang must be fr or en');
 if(typeof kind!=='string'||!GOOGLE_CLOUD_KINDS.includes(kind)) throw new Error('Unknown kind');
 if(typeof mobile!=='boolean') throw new TypeError('mobile must be a boolean');
 const f={power,cascade,timeline,'bank-impact':bankImpact,regulation}[kind];return f(lang,mobile);
}
