/** Authored, inert SVG. No user text, network data or executable markup is interpolated. */
export const CRA_FACTS = Object.freeze({
  manufacturerReporting: '2026-09-11', stewardReporting: '2027-12-11',
  generalRequirements: '2027-12-11', awarenessHours: Object.freeze([24,72]),
  illustrativeWarningHour: 6, documentedCounterOffsetHours: 48,
  vulnerabilityFinalDaysAfterMeasure: 14, incidentFinalMonthsAfterNotification: 1,
  curl: Object.freeze(['2023-09-30','2023-10-03','2023-10-11']),
  faqAsOf: '2026-10-03', reviewedAsOf: '2026-10-10',
});
export const CRA_KINDS = Object.freeze(['threshold','clocks','routing','curl','feedback']);
// Native l0g paints only. All supplied primitives, labels and font metrics remain.
const C=Object.freeze({
  "ink": "var(--color-ink, #0c0d10)",
  "surface": "var(--color-surface, #121419)",
  "surface2": "var(--color-surface-2, #171a20)",
  "paper": "var(--color-paper, #e7e9ee)",
  "muted": "var(--color-muted, #8b909b)",
  "line": "var(--color-line-strong, rgba(255, 255, 255, 0.20))",
  "signal": "var(--color-signal, #5eead4)",
  "amber": "var(--color-amber, #f5b13d)",
  "blue": "var(--color-topic-blue, #7aa2f7)",
  "accent": "var(--color-accent, #ff4d87)"
});
const esc=v=>String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const rect=(x,y,w,h,fill=C.surface,r=10,stroke='none',sw=1)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const line=(x1,y1,x2,y2,col=C.line,sw=2,dash='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${sw}"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const path=(d,col=C.line,sw=2,fill='none',dash='')=>`<path d="${d}" fill="${fill}" stroke="${col}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const circle=(x,y,r,fill=C.ink,stroke=C.signal,sw=2)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const text=(x,y,v,size=22,col=C.paper,weight=400,anchor='start')=>`<text x="${x}" y="${y}" fill="${col}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}">${esc(v)}</text>`;
function block(name,x,y,w,lines,size=22,col=C.paper,weight=400,anchor='start',gap=size*1.35){
  const h=lines.length*gap+8, tx=anchor==='middle'?x+w/2:anchor==='end'?x+w:x;
  return `<g data-label="${name}" data-bounds="${x} ${y} ${w} ${h}">${lines.map((v,i)=>text(tx,y+size+i*gap,v,size,col,weight,anchor)).join('')}</g>`;
}
function arrow(x1,y1,x2,y2,col=C.signal,sw=2.5,dash=''){
 const a=Math.atan2(y2-y1,x2-x1),l=9,s=5,bx=x2-l*Math.cos(a),by=y2-l*Math.sin(a);
 return line(x1,y1,x2,y2,col,sw,dash)+path(`M${bx-s*Math.sin(a)} ${by+s*Math.cos(a)} L${x2} ${y2} L${bx+s*Math.sin(a)} ${by-s*Math.cos(a)}`,col,sw);
}
function dotLetter(x,y,l,col=C.amber){return circle(x,y,14,C.ink,col)+text(x,y+5,l,16,col,700,'middle');}
function chip(x,y,w,label,col=C.signal){return rect(x,y,w,30,C.surface2,15)+text(x+w/2,y+21,label,14,col,700,'middle');}
function head(m,section,title,sub){const w=m?400:1000;
 return block('eyebrow',28,23,w-56,[`l0g / ${section}`],m?14:16,C.signal,700)
 +block('heading',28,63,w-56,m?title:[title.join(' ')],m?31:38,C.paper,700,'start',m?36:46)
 +block('subtitle',28,m?146:119,w-56,m?sub:[sub.join(' · ')],m?18:20,C.muted,400,'start',m?25:27);
}
function foot(m,y,lines){return line(28,y-16,(m?400:1000)-28,y-16)+block('footer',28,y,(m?400:1000)-56,lines,m?14:15,C.muted);}
function shell(id,w,h,title,desc,body){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="${id}-title ${id}-desc" data-cra-kind="${id}" style="display:block;width:100%;height:auto"><title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(desc)}</desc>${rect(0,0,w,h,C.ink,18)}${body}</svg>`;}
function componentIcon(x,y,w,h,active='closed'){
 let b=rect(x,y,w,h,C.surface2,8,C.line,1.5);
 b+=rect(x+12,y+12,w-24,28,C.ink,5)+line(x+22,y+26,x+w-28,y+26,C.muted,3);
 const knee=x+w*.52, out=x+w-20;
 b+=line(x+20,y+66,x+w*.4,y+66,C.blue,3)+path(`M${x+w*.4} ${y+66} L${knee} ${y+66} L${knee} ${y+94} L${out} ${y+94}`,C.blue,3);
 if(active==='closed'){b+=line(knee-8,y+79,knee+8,y+79,C.amber,5)+line(knee-8,y+73,knee-8,y+85,C.amber,2)+line(knee+8,y+73,knee+8,y+85,C.amber,2);}
 else{b+=arrow(knee+3,y+94,out,y+94,active==='exploit'?C.accent:C.blue,3);}
 b+=circle(out,y+94,7,active==='exploit'?C.accent:C.ink,active==='closed'?C.muted:C.blue,2);
 return b;
}
function threshold(fr,m,id){
 const title=fr?['Le même code,','trois situations']:['The same code,','three situations'];
 let b=head(m,fr?'01 / QUALIFIER':'01 / ASSESS',title,fr?['Exemple pédagogique','Le produit détermine le déclencheur']:['Illustrative example','The reporting trigger is product-specific']);
 const names=fr?['Fonction inaccessible','Fonction accessible','Exploitation établie']:['Function unreachable','Function reachable','Exploitation established'];
 const subs=fr?[
 ['Le chemin vers le code','vulnérable est fermé.'],['Aucune exploitation dans','ce produit n’est établie.'],['Preuves fiables dans','le produit du fabricant.']]:[
 ['The path to the vulnerable','code cannot be reached.'],['Exploitation in this product','has not been established.'],['Reliable evidence in the','manufacturer’s product.']];
 const outcomes=fr?[['Déclencheur absent','dans cette configuration'],['Exploitation non établie','Qualification à poursuivre'],['Déclencheur satisfait','Notification obligatoire']]:[['Trigger absent','in this configuration'],['Exploitation not established','Continue assessment'],['Reporting trigger met','Mandatory notification']];
 if(!m){
  b+=rect(355,188,290,76,C.surface2,10,C.blue)+block('library',374,199,252,fr?['Bibliothèque commune','Composant intégré']:['Shared library','An integrated component'],22,C.paper,500,'middle',27);
  b+=path('M500 264 L500 295 M178 295 L822 295',C.blue,2.5);
  [42,364,686].forEach((x,i)=>{
   b+=arrow(x+136,295,x+136,329,C.blue);
   b+=rect(x,339,272,347,C.surface,12,C.line);
   b+=block(`product-${i}`,x+16,351,240,[`${fr?'PRODUIT':'PRODUCT'} ${String.fromCharCode(65+i)}`],15,C.muted,700,'middle');
   b+=componentIcon(x+58,389,156,124,['closed','open','exploit'][i]);
   b+=block(`condition-${i}`,x+12,528,248,[names[i]],20,i===2?C.accent:C.paper,700,'middle');
   b+=block(`context-${i}`,x+16,565,240,subs[i],18,C.muted,400,'middle',25);
   b+=block(`outcome-${i}`,x+12,627,248,outcomes[i],17,i===2?C.signal:C.amber,600,'middle',23);
  });
  b+=rect(42,718,916,76,C.surface2,10)+block('incident-note',61,729,878,fr?['Incident grave : un autre test, à examiner séparément.','Les trois branches ne sont ni des fréquences ni un classement de sûreté.']:['Severe incident: a separate reporting test.','These branches are neither frequencies nor a ranking of safety.'],20,C.paper,400,'middle',29);
  b+=foot(false,824,[fr?'Sources : CRA, art. 3 et 14 · Orientations de la Commission, § 218 · Analyse au 10.10.2026':'Sources: CRA, Arts. 3 and 14 · Commission guidance, § 218 · Reviewed 10 Oct 2026']);
  return shell(id,1000,870,title.join(' '),fr?'Une bibliothèque est intégrée à trois produits : fonction inaccessible, exploitation non établie, exploitation confirmée. Seule la troisième branche satisfait ici le déclencheur AEV.':'A library is used in three products: unreachable function, exploitation not established, and confirmed exploitation. Only the third branch meets the AEV trigger in this example.',b);
 }
 b+=rect(68,218,290,82,C.surface2,10,C.blue)+block('library',84,228,258,fr?['Bibliothèque commune','Composant intégré']:['Shared library','Integrated component'],21,C.paper,600,'middle',28);
 b+=path('M68 259 L32 259 L32 1070',C.blue,2.5);
 [337,603,869].forEach((y,i)=>{
  b+=arrow(32,y+110,63,y+110,C.blue);
  b+=rect(73,y,295,233,C.surface,12,C.line);
  b+=block(`product-${i}`,90,y+12,260,[`${fr?'PRODUIT':'PRODUCT'} ${String.fromCharCode(65+i)}`],14,C.muted,700);
  b+=componentIcon(91,y+51,91,112,['closed','open','exploit'][i]);
  const ns=fr?[['Fonction','inaccessible'],['Fonction','accessible'],['Exploitation','établie']]:[['Function','unreachable'],['Function','reachable'],['Exploitation','established']];
  const ss=fr?[['Chemin fermé.'],['Aucune preuve','dans ce produit.'],['Preuves fiables','dans ce produit.']]:[['Closed path.'],['No evidence in','this product.'],['Reliable evidence','in this product.']];
  b+=block(`condition-${i}`,199,y+51,153,ns[i],20,i===2?C.accent:C.paper,700,'start',26);
  b+=block(`context-${i}`,199,y+114,153,ss[i],16,C.muted,400,'start',22);
  b+=block(`outcome-${i}`,88,y+174,266,outcomes[i],18,i===2?C.signal:C.amber,600,'middle',24);
 });
 b+=block('incident-note',32,1135,336,fr?['Incident grave : test distinct.','Ces branches ne mesurent','ni fréquence ni sûreté.']:['Severe incident: a separate test.','Branches do not measure','frequency or safety.'],19,C.paper,400,'start',27);
 b+=foot(true,1250,fr?['CRA, art. 3 et 14 · Orientations, § 218','Exemple fictif · Analyse au 10.10.2026']:['CRA, Arts. 3 and 14 · Guidance, § 218','Illustrative · Reviewed 10 Oct 2026']);
 return shell(id,400,1325,title.join(' '),fr?'Trois produits fictifs partagent une bibliothèque, mais le signalement dépend de l’exploitation dans chaque produit.':'Three illustrative products share a library, but reporting depends on exploitation in each product.',b);
}
function finalGate(fr,m,x,y,w,kind){
 const vuln=kind==='vuln';let b=rect(x,y,w,m?170:167,C.surface,12,C.line);
 b+=block(`final-${kind}-title`,x+16,y+12,w-32,[fr?(vuln?'VULNÉRABILITÉ EXPLOITÉE':'INCIDENT GRAVE'):(vuln?'ACTIVELY EXPLOITED VULNERABILITY':'SEVERE INCIDENT')],m?14:16,C.muted,700);
 b+=block(`final-${kind}-start`,x+16,y+48,w-32,fr?(vuln?['Mesure corrective ou','d’atténuation disponible']:['Notification de l’incident','à 72 h envoyée']):(vuln?['Corrective or mitigating','measure becomes available']:['72-hour incident notification','has been submitted']),m?18:19,C.paper,400,'start',25);
 b+=arrow(x+18,y+122,x+75,y+122,C.signal);
 b+=block(`final-${kind}-end`,x+90,y+102,w-108,[fr?(vuln?'14 jours au plus':'1 mois au plus'):(vuln?'Within 14 days':'Within 1 month'),fr?'Rapport final':'Final report'],m?19:21,C.signal,600,'start',25);
 return b;
}
function clocks(fr,m,id){
 const title=fr?['Deux horloges,','un même départ légal']:['Two clocks,','one legal starting point'];
 let b=head(m,fr?'02 / LE TEMPS':'02 / TIMING',title,fr?['Hypothèse : alerte envoyée à +6 h','Les délais sont des maxima']:['Example: early warning sent at +6 h','Legal deadlines are maximum limits']);
 if(!m){
  const xx=h=>72+h*(856/72);
  b+=line(xx(0),225,xx(72),225,C.line,2);
  [0,24,48,72].forEach(h=>{b+=line(xx(h),219,xx(h),233,C.muted,2)+text(xx(h),205,`${h} h`,18,C.muted,600,'middle');});
  b+=block('awareness',45,244,227,fr?['0 = prise de connaissance']:['0 = awareness'],17,C.muted);
  b+=line(xx(0),294,xx(72),294,C.signal,5)+circle(xx(24),294,7,C.ink,C.signal,2)+circle(xx(72),294,10,C.signal,C.signal);
  b+=block('early-maximum',xx(24)-120,312,240,[fr?'Alerte précoce : ≤ 24 h':'Early warning: ≤ 24 h'],17,C.signal,500,'middle');
  b+=block('legal-maximum',605,244,323,[fr?'Notification : ≤ 72 h':'Fuller notification: ≤ 72 h'],24,C.signal,700,'end');
  b+=arrow(xx(6),393,xx(54),393,C.amber,5)+circle(xx(6),393,8,C.amber,C.amber)+line(xx(54),376,xx(54),426,C.amber,3);
  b+=block('example-warning',72,348,220,[fr?'Envoi à +6 h':'Sent at +6 h'],19,C.amber,600);
  b+=block('counter-48',305,348,235,[fr?'Compteur : +48 h':'Counter: +48 h'],20,C.amber,600,'middle');
  b+=block('counter-54',xx(54)-97,432,194,[fr?'Affichage : +54 h':'Display: +54 h'],18,C.amber,600,'middle');
  b+=line(xx(72),309,xx(72),497,C.signal,1.5,'5 6');
  b+=path(`M${xx(54)} 476 V489 H${xx(72)} V476`,C.paper,2);
  b+=block('gap',xx(54),494,xx(72)-xx(54),[fr?'18 h d’écart':'18 h difference'],23,C.paper,700,'middle');
  b+=block('finals-label',42,551,916,[fr?'LE RAPPORT FINAL CHANGE DE POINT DE DÉPART':'FINAL REPORTS USE DIFFERENT STARTING POINTS'],17,C.muted,700);
  b+=finalGate(fr,false,42,587,438,'vuln')+finalGate(fr,false,520,587,438,'incident');
  b+=foot(false,789,[fr?'Sources : CRA, art. 14 · FAQ ENISA du 03.10.2026, question 26 · Axe supérieur en heures':'Sources: CRA, Art. 14 · ENISA FAQ, 3 Oct 2026, question 26 · Upper axis in hours']);
  return shell(id,1000,837,title.join(' '),fr?'Sur un axe de 72 heures depuis la prise de connaissance, une alerte envoyée après 6 heures produit un affichage à 54 heures selon le compteur documenté. La différence est de 18 heures. Les rapports finaux ont des déclencheurs distincts.':'On a 72-hour axis from awareness, a warning submitted after 6 hours yields a displayed deadline at hour 54 under the documented counter. The gap is 18 hours. Final reports use different triggers.',b);
 }
 const yy=h=>240+h*7;
 b+=line(66,yy(0),66,yy(72),C.line,2);
 [0,24,48,72].forEach(h=>{b+=line(57,yy(h),74,yy(h),C.muted,2)+text(45,yy(h)+6,`${h} h`,15,C.muted,600,'end');});
 b+=block('awareness',102,219,266,fr?['Prise de connaissance','Début des délais légaux']:['Awareness','Legal deadlines start'],18,C.paper,600,'start',24);
 b+=arrow(83,yy(0)+6,83,yy(72),C.signal,3);
 b+=circle(66,yy(6),7,C.amber,C.amber)+block('warning',103,yy(6)+4,265,fr?['+6 h : envoi de l’alerte','Hypothèse choisie']:['+6 h: early warning sent','Chosen illustration'],18,C.amber,600,'start',25);
 b+=circle(83,yy(24),7,C.ink,C.signal)+block('24h',103,yy(24)-27,265,fr?['24 h au plus','pour l’alerte précoce']:['Within 24 h','for the early warning'],20,C.signal,600,'start',26);
 b+=path(`M105 ${yy(6)} H95 V${yy(54)} H110`,C.amber,2.5);
 b+=block('48-offset',123,473,213,fr?['Le compteur ajoute','48 h à l’envoi.']:['The counter adds','48 h to submission.'],18,C.amber,400,'start',25);
 b+=circle(95,yy(54),7,C.amber,C.amber)+block('54h',124,yy(54)-23,236,fr?['+54 h','Échéance affichée']:['+54 h','Displayed deadline'],23,C.amber,700,'start',30);
 b+=path(`M354 ${yy(54)} H365 V${yy(72)} H354`,C.paper,2);
 b+=block('gap',132,674,212,[fr?'18 h d’écart':'18 h difference'],22,C.paper,700);
 b+=circle(83,yy(72),9,C.signal,C.signal)+block('72h',105,yy(72)-16,239,fr?['72 h au plus','pour la notification']:['Within 72 h','for the notification'],22,C.signal,700,'start',29);
 b+=block('finals-label',28,812,344,fr?['Rapports finaux :','d’autres points de départ']:['Final reports:','different starting points'],20,C.paper,600,'start',26);
 b+=finalGate(fr,true,28,888,344,'vuln')+finalGate(fr,true,28,1085,344,'incident');
 b+=foot(true,1290,fr?['CRA, art. 14 · FAQ ENISA, Q26','03.10.2026 · Axe vertical en heures','Agir sans retard injustifié reste requis.']:['CRA, Art. 14 · ENISA FAQ, Q26','3 Oct 2026 · Vertical axis in hours','Acting without undue delay is required.']);
 return shell(id,400,1390,title.join(' '),fr?'Exemple arithmétique : 6 plus 48 égale 54 heures, soit 18 heures avant le plafond de 72 heures depuis la prise de connaissance.':'Arithmetic example: 6 plus 48 is 54 hours, 18 hours before the 72-hour legal maximum from awareness.',b);
}
function routing(fr,m,id){
 const title=fr?['Le signalement','reste confidentiel']:['Reporting remains','confidential'];
 let b=head(m,fr?'03 / LA CIRCULATION':'03 / INFORMATION FLOW',title,fr?['Régime normal et restrictions','Schéma logique des destinataires']:['Normal route and restrictions','A logical map of recipients']);
 if(!m){
  b+=rect(305,180,390,347,C.surface,18,C.line)+block('srp',324,194,352,['SINGLE REPORTING PLATFORM'],16,C.muted,700,'middle');
  b+=rect(40,270,215,112,C.surface2,10)+block('manufacturer',56,284,183,fr?['Fabricant','Dossier enrichi']:['Manufacturer','Updated report'],21,C.paper,600,'middle',34);
  b+=arrow(257,326,326,326,C.signal,3)+path('M327 326 L352 326 L352 282 L390 282 M352 326 L352 425 L390 425',C.signal,2.5);
  b+=rect(399,243,259,88,C.ink,10,C.signal)+block('coordinator',413,251,231,fr?['CSIRT coordinateur','Destinataire initial']:['Coordinating CSIRT','Initial recipient'],21,C.paper,600,'middle',28);
  b+=rect(399,384,259,88,C.ink,10,C.signal)+block('enisa',413,394,231,['ENISA',fr?'Destinataire simultané':'Simultaneous recipient'],21,C.paper,600,'middle',28);
  b+=arrow(660,281,756,281,C.signal,2.5)+dotLetter(710,281,'A');
  b+=rect(768,243,191,120,C.surface2,10)+block('other-csirts',783,254,161,fr?['Autres CSIRT','Marchés où le','produit est fourni']:['Other CSIRTs','Relevant product','markets'],19,C.paper,600,'middle',28);
  b+=dotLetter(378,425,'B');
  b+=block('A-note',724,390,235,fr?['A / Report motivé','vers d’autres CSIRT','si conditions réunies']:['A / A justified delay','to other CSIRTs','if conditions are met'],18,C.amber,500,'start',26);
  b+=block('B-note',326,480,350,fr?['B / À 72 h : restriction exceptionnelle','des détails reçus par l’ENISA']:['B / At 72 h: an exceptional restriction','on the details received by ENISA'],16,C.amber,500,'middle',22);
  b+=path('M148 384 L148 596 L517 596',C.blue,2.5)+arrow(517,596,544,596,C.blue);
  b+=block('user-route',185,529,330,fr?['Communication proportionnée','Mesures utiles à la protection']:['Proportionate communication','Information users can act on'],20,C.blue,400,'middle',28);
  b+=rect(557,552,402,91,C.surface2,10,C.blue)+block('users',573,562,370,fr?['Utilisateurs touchés','Et tous les utilisateurs, si approprié']:['Affected users','All users where appropriate'],21,C.paper,600,'middle',30);
  b+=line(42,683,958,683)+block('public-route-label',42,704,916,[fr?'BASE PUBLIQUE EUVD : UNE ÉTAPE SOUS CONDITIONS':'PUBLIC EUVD DATABASE: A CONDITIONAL STEP'],17,C.muted,700);
  const vals=fr?['Information déjà publique','Mesure disponible','Accord du fabricant']:['Already-public information','Available measure','Manufacturer agreement'];
  [42,354,666].forEach((x,i)=>{b+=rect(x,748,292,59,C.surface,9)+block(`pub-${i}`,x+8,762,276,[vals[i]],19,C.blue,600,'middle');if(i<2)b+=text(x+302,785,'+',21,C.muted,500,'middle');});
  b+=foot(false,843,[fr?'Sources : CRA, art. 14, 16 et 17 · Règlement délégué 2026/881 · Détails des exceptions dans le texte':'Sources: CRA, Arts. 14, 16 and 17 · Delegated Regulation 2026/881 · Exceptions explained in the article']);
  return shell(id,1000,889,title.join(' '),fr?'Un dépôt dans la plateforme est transmis au coordinateur et à ENISA, puis aux autres coordinateurs concernés. Des reports motivés sont possibles. Les utilisateurs reçoivent des informations protectrices séparément. L’EUVD publique suit un autre régime.':'A platform submission reaches the coordinating CSIRT and ENISA, then other relevant coordinators. Justified delays can apply. Users receive protective information separately. Public EUVD publication follows a different regime.',b);
 }
 b+=rect(67,217,293,81,C.surface2,10)+block('manufacturer',85,230,257,[fr?'Fabricant':'Manufacturer',fr?'Dossier progressif':'Progressive reporting'],22,C.paper,600,'middle',28);
 b+=rect(35,343,338,371,C.surface,15,C.line)+block('srp',53,357,302,['SINGLE REPORTING PLATFORM'],13,C.muted,700,'middle');
 b+=arrow(214,299,214,334,C.signal,2.5)+path('M214 389 L214 399 L117 399 L117 424 M214 399 L286 399 L286 424',C.signal,2.5);
 b+=rect(51,434,139,138,C.ink,10,C.signal)+block('coordinator',59,455,123,fr?['CSIRT','coordinateur','Initial']:['Coordinating','CSIRT','Initial'],19,C.paper,600,'middle',30);
 b+=rect(213,434,144,138,C.ink,10,C.signal)+block('enisa',225,455,120,['ENISA',fr?'En même':'At the',fr?'temps':'same time'],21,C.paper,600,'middle',30);
 b+=arrow(119,574,119,747,C.signal,2.5)+dotLetter(119,634,'A');
 b+=block('A-note',147,598,204,fr?['Report motivé possible','vers d’autres CSIRT.']:['A justified delay','to other CSIRTs.'],17,C.amber,500,'start',24);
 b+=block('B-note',147,656,204,fr?['B / À 72 h, détails ENISA','exceptionnellement limités.']:['B / At 72 h, ENISA details','exceptionally restricted.'],15,C.amber,500,'start',22);
 b+=rect(66,759,294,102,C.surface2,10)+block('other-csirts',82,771,262,fr?['Autres CSIRT concernés','Marchés où le produit','est mis à disposition']:['Other relevant CSIRTs','Markets where the product','is made available'],20,C.paper,600,'middle',27);
 b+=path('M66 258 L18 258 L18 968 L57 968',C.blue,2.5)+arrow(57,968,66,968,C.blue);
 b+=rect(77,910,283,132,C.surface2,10,C.blue)+block('users',95,927,247,fr?['Utilisateurs touchés','Mesures de protection','Tous, si approprié']:['Affected users','Protective measures','All, where appropriate'],21,C.paper,600,'middle',31);
 b+=block('public-route-label',30,1085,340,fr?['EUVD publique : autre circuit','Information déjà publique','+ mesure disponible','+ accord du fabricant']:['Public EUVD: a separate route','Already-public information','+ an available measure','+ manufacturer agreement'],19,C.blue,500,'start',29);
 b+=foot(true,1239,fr?['CRA, art. 14, 16 et 17','Règlement délégué 2026/881','Exceptions détaillées dans l’article.']:['CRA, Arts. 14, 16 and 17','Delegated Regulation 2026/881','Exceptions explained in the article.']);
 return shell(id,400,1343,title.join(' '),fr?'Deux destinataires initiaux, puis les autres coordinateurs concernés. Les utilisateurs sont informés par un circuit distinct et proportionné.':'Two initial recipients, followed by other relevant coordinators. Users are informed through a distinct, proportionate route.',b);
}
function curl(fr,m,id){
 const title=fr?['Onze jours','de coordination']:['Eleven days','of coordination'];
 let b=head(m,fr?'04 / UN CAS DOCUMENTÉ':'04 / A DOCUMENTED CASE',title,fr?['curl · CVE-2023-38545','Une chronologie de 2023, avant le CRA']:['curl · CVE-2023-38545','A 2023 timeline, before the CRA']);
 const dates=fr?['30 SEPT. 2023','03 OCT. 2023','11 OCT. 2023']:['30 SEP 2023','03 OCT 2023','11 OCT 2023'];
 if(!m){
  const xs=[80,80+840*3/11,920];
  b+=rect(xs[0],315,xs[1]-xs[0],30,C.blue,0)+rect(xs[1],315,xs[2]-xs[1],30,C.signal,0);
  for(let d=0;d<=11;d++)b+=line(80+840*d/11,347,80+840*d/11,356,C.line,1);
  b+=block('date0',44,215,228,[dates[0]],23,C.paper,700)+block('date1',xs[1]-114,215,228,[dates[1]],23,C.paper,700,'middle')+block('date2',689,215,235,[dates[2]],23,C.paper,700,'end');
  xs.forEach((x,i)=>{b+=line(x,264,x,312,C.muted,2)+circle(x,330,9,C.ink,i===2?C.signal:C.blue,3);});
  b+=block('event0',44,370,245,fr?['Signalement reçu','par le projet']:['Report received','by the project'],23,C.paper,600);
  b+=block('event1',xs[1]-24,422,278,fr?['Contact avec la liste','des distributions']:['Distribution coordination','list contacted'],22,C.paper,600);
  b+=block('event2',674,370,252,fr?['libcurl 8.4.0','et avis de sécurité']:['libcurl 8.4.0','and security advisory'],23,C.paper,600,'end');
  b+=block('interval3',80,267,xs[1]-80,[fr?'3 jours':'3 days'],21,C.blue,700,'middle');
  b+=block('interval8',xs[1],267,920-xs[1],[fr?'8 jours':'8 days'],21,C.signal,700,'middle');
  b+=path('M80 510 V530 H920 V510',C.line,2);
  b+=text(69,658,'11',105,C.paper,700)+block('total-label',220,579,703,fr?['jours calendaires entre le signalement et la sortie.','La date de protection de chaque utilisateur','n’est pas établie par cette chronologie.']:['calendar days from report to release.','This timeline does not establish when','each user became protected.'],25,C.paper,400,'start',36);
  b+=foot(false,722,fr?['Sources : avis curl CVE-2023-38545 et procédure du projet · Axe proportionnel en jours','Ce cas ne démontre pas une exploitation malveillante déclenchant l’article 14.']:['Sources: curl CVE-2023-38545 advisory and project policy · Axis proportional in days','This case does not establish malicious exploitation that would trigger Article 14.']);
  return shell(id,1000,803,title.join(' '),fr?'Entre le 30 septembre et le 11 octobre 2023, onze jours calendaires : trois avant le contact avec les distributions, puis huit jusqu’à la sortie corrigée et l’avis de sécurité.':'Eleven calendar days from 30 September to 11 October 2023: three before the distribution-list contact, then eight to the corrected release and advisory.',b);
 }
 const ys=[256,256+57*3,256+57*11];
 b+=line(78,ys[0],78,ys[1],C.blue,5)+line(78,ys[1],78,ys[2],C.signal,5);
 for(let d=0;d<=11;d++)b+=line(68,256+57*d,78,256+57*d,C.line,1.5);
 ys.forEach((y,i)=>{b+=circle(78,y,9,C.ink,i===2?C.signal:C.blue,3);});
 b+=block('date0',109,232,263,[dates[0]],24,C.paper,700)+block('event0',109,270,263,fr?['Signalement reçu','par le projet']:['Report received','by the project'],21,C.paper,500,'start',29);
 b+=block('interval3',110,352,256,[fr?'3 jours':'3 days'],27,C.blue,700);
 b+=block('date1',109,ys[1]-20,263,[dates[1]],24,C.paper,700)+block('event1',109,ys[1]+21,263,fr?['Contact avec la liste','des distributions']:['Distribution coordination','list contacted'],20,C.paper,500,'start',29);
 b+=text(114,660,'8',83,C.signal,700)+block('interval8',174,611,182,fr?['jours','jusqu’à la sortie']:['days','until release'],23,C.signal,600,'start',33);
 b+=block('coordination-note',110,711,250,fr?['Des destinataires peuvent','préparer la réponse avant','l’annonce publique.']:['Recipients can prepare','their response before','the public announcement.'],18,C.muted,400,'start',27);
 b+=block('date2',109,ys[2]-21,263,[dates[2]],24,C.paper,700)+block('event2',109,ys[2]+20,263,fr?['libcurl 8.4.0','et avis de sécurité']:['libcurl 8.4.0','and security advisory'],21,C.paper,600,'start',29);
 b+=block('total',29,1001,342,fr?['11 jours calendaires','Installation chez les utilisateurs :','date non établie par cet avis.']:['11 calendar days','Installation by users:','date not given in this advisory.'],20,C.paper,600,'start',30);
 b+=foot(true,1137,fr?['Source : curl, avis CVE-2023-38545','Axe proportionnel en jours · Cas de 2023','Aucune exploitation active démontrée ici.']:['Source: curl CVE-2023-38545 advisory','Proportional in days · A 2023 case','Active exploitation not established here.']);
 return shell(id,400,1242,title.join(' '),fr?'Onze jours calendaires, trois puis huit, entre les trois jalons documentés par curl.':'Eleven calendar days, three then eight, between the three milestones documented by curl.',b);
}
function softwareNode(fr,x,y,w,h,type){
 let b=rect(x,y,w,h,C.surface,12,C.line);
 const ttl=fr?{project:'PROJET AMONT',maker:'FABRICANT',user:'UTILISATEUR'}:{project:'UPSTREAM PROJECT',maker:'MANUFACTURER',user:'USER'};
 b+=block(`node-${type}-title`,x+14,y+12,w-28,[ttl[type]],16,C.muted,700,'middle');
 if(type==='project'){
  b+=rect(x+w/2-44,y+51,71,58,C.ink,5,C.blue)+rect(x+w/2-34,y+61,71,58,C.ink,5,C.blue)+line(x+w/2-20,y+78,x+w/2+20,y+78,C.blue,3)+line(x+w/2-20,y+94,x+w/2+10,y+94,C.blue,3);
 }else if(type==='maker'){
  b+=rect(x+w/2-63,y+52,126,75,C.ink,7,C.muted)+rect(x+w/2-48,y+68,40,39,C.surface2,4,C.blue)+rect(x+w/2+5,y+68,40,39,C.surface2,4,C.line)+line(x+w/2-8,y+87,x+w/2+5,y+87,C.signal,3);
 }else{
  b+=rect(x+w/2-62,y+52,124,65,C.ink,7,C.signal)+line(x+w/2,y+118,x+w/2,y+129,C.muted,3)+line(x+w/2-24,y+130,x+w/2+24,y+130,C.muted,3)+path(`M${x+w/2-21} ${y+85} L${x+w/2-6} ${y+99} L${x+w/2+23} ${y+70}`,C.signal,3);
 }
 return b;
}
function feedback(fr,m,id){
 const title=fr?['Un retour amont','pour les corrections']:['A route upstream','for security fixes'];
 let b=head(m,fr?'05 / LE RETOUR AMONT':'05 / UPSTREAM FEEDBACK',title,fr?['Article 13(6) : à partir du 11.12.2027','Les durées techniques restent variables']:['Article 13(6): from 11 Dec 2027','Technical stages have no fixed duration']);
 if(!m){
  b+=softwareNode(fr,42,226,254,231,'project')+softwareNode(fr,373,226,254,231,'maker')+softwareNode(fr,704,226,254,231,'user');
  b+=block('project-action',58,378,222,fr?['Maintient et examine','la correction proposée']:['Maintains and reviews','the proposed fix'],20,C.paper,500,'middle',28);
  b+=block('maker-action',389,378,222,fr?['Intègre, teste','et livre une version']:['Integrates, tests','and ships a version'],20,C.paper,500,'middle',28);
  b+=block('user-action',720,378,222,fr?['Applique et vérifie','la mesure disponible']:['Applies and verifies','the available measure'],20,C.paper,500,'middle',28);
  b+=arrow(298,322,370,322,C.blue,3)+arrow(629,322,701,322,C.signal,3);
  b+=block('forward1',280,472,132,[fr?'Code intégré':'Code integrated'],15,C.blue,600,'middle')+block('forward2',605,472,132,[fr?'Version livrée':'Release delivered'],15,C.signal,600,'middle');
  b+=path('M501 458 L501 598 L169 598 L169 470',C.amber,3)+arrow(169,470,169,459,C.amber,3)+dotLetter(337,598,'A');
  b+=block('reverse-label',545,545,401,fr?['A / Le retour de connaissance','Vulnérabilité du composant +','code ou documentation du correctif','si une modification a été développée.']:['A / Knowledge returning upstream','Component vulnerability +','relevant fix code or documentation','where a modification was developed.'],20,C.amber,500,'start',29);
  b+=block('acceptance',42,667,916,fr?['Partager donne au mainteneur de quoi examiner. L’acceptation du correctif reste distincte.','Le signalement aux autorités par les fabricants s’applique déjà depuis septembre 2026.']:['Sharing enables maintainer review. Acceptance of the proposed fix remains a separate step.','Manufacturers’ reporting to authorities already applies from September 2026.'],19,C.paper,400,'start',30);
  b+=foot(false,766,[fr?'Sources : CRA, art. 13(6), 14 et 71 · Orientations, § 222–229 · Circuit technique schématique':'Sources: CRA, Arts. 13(6), 14 and 71 · Guidance, §§ 222–229 · Schematic technical workflow']);
  return shell(id,1000,817,title.join(' '),fr?'Le projet distribue du code, le fabricant l’intègre dans une version livrée, l’utilisateur applique et vérifie. À partir de décembre 2027, les défauts du composant et les modifications développées pour le corriger remontent selon l’article 13(6).':'The project supplies code, the manufacturer integrates it into a release, and the user applies and verifies the measure. From December 2027, component defects and developed fixes flow upstream under Article 13(6).',b);
 }
 b+=softwareNode(fr,74,219,284,205,'project')+softwareNode(fr,74,530,284,218,'maker')+softwareNode(fr,74,867,284,211,'user');
 b+=block('project-action',90,371,252,fr?['Maintient et examine']:['Maintains and reviews'],20,C.paper,500,'middle');
 b+=block('maker-action',90,683,252,fr?['Intègre, teste et livre']:['Integrates, tests and ships'],20,C.paper,500,'middle');
 b+=block('user-action',90,1020,252,fr?['Applique et vérifie']:['Applies and verifies'],20,C.paper,500,'middle');
 b+=arrow(216,427,216,520,C.blue,3)+block('forward1',239,450,134,fr?['Code','intégré']:['Integrated','code'],18,C.blue,500,'start',25);
 b+=arrow(216,751,216,856,C.signal,3)+block('forward2',238,778,136,fr?['Version','livrée']:['Shipped','release'],18,C.signal,500,'start',25);
 b+=path('M74 637 L32 637 L32 321 L61 321',C.amber,3)+arrow(61,321,73,321,C.amber,3)+dotLetter(32,479,'A');
 b+=rect(29,1119,342,157,C.surface2,12)+block('reverse-label',47,1135,306,fr?['A / Retour amont, dès le 11.12.2027','Défaut du composant + code ou','documentation de la modification','développée pour le corriger.']:['A / Upstream, from 11 Dec 2027','Component defect + relevant code','or documentation of a modification','developed to address it.'],18,C.amber,500,'start',29);
 b+=block('acceptance',29,1306,342,fr?['Le mainteneur examine la proposition.','Il reste libre de ne pas l’accepter.','Article 14 : fabricants déjà soumis','au signalement depuis septembre 2026.']:['The maintainer reviews the proposal.','Acceptance is not compulsory.','Article 14: manufacturers already report','since September 2026.'],18,C.paper,400,'start',27);
 b+=foot(true,1456,fr?['CRA, art. 13(6), 14 et 71','Orientations, § 222–229','Circuit schématique, sans durée mesurée.']:['CRA, Arts. 13(6), 14 and 71','Guidance, §§ 222–229','Schematic, with no measured duration.']);
 return shell(id,400,1560,title.join(' '),fr?'Un circuit descend du projet vers le fabricant et l’utilisateur. Un retour distinct ramène les défauts et les corrections du composant au projet amont.':'One flow runs from the project through the manufacturer to the user. A return path carries component defects and fixes upstream.',b);
}
export function craDisclosureSvg(lang,kind,mobile=false){
 if(!['fr','en'].includes(lang))throw new TypeError('Unsupported CRA figure language');
 if(typeof kind!=='string'||!CRA_KINDS.includes(kind))throw new TypeError('Unsupported CRA figure kind');
 if(typeof mobile!=='boolean')throw new TypeError('mobile must be boolean');
 const id=`cra-disclosure-${kind}-${lang}-${mobile?'mobile':'desktop'}`;
 return {threshold,clocks,routing,curl,feedback}[kind](lang==='fr',mobile,id);
}

export function validateCraDisclosureFigure(props) {
  if (!props || typeof props !== 'object' || Array.isArray(props)) throw new TypeError('Invalid CRA props');
  const { lang = 'fr', kind, number, caption, sources } = props;
  if (lang !== 'fr' && lang !== 'en') throw new TypeError('Invalid CRA language');
  if (typeof kind !== 'string' || !CRA_KINDS.includes(kind)) throw new TypeError('Invalid CRA kind');
  if (typeof number !== 'string' || !/^0?[1-5]$/.test(number) || Number(number) !== CRA_KINDS.indexOf(kind) + 1) throw new TypeError('Invalid CRA figure number');
  if (typeof caption !== 'string' || !caption.trim()) throw new TypeError('Invalid CRA caption');
  if (typeof sources !== 'string') throw new TypeError('Invalid CRA sources');
  const references = sources.trim().split(/\s+/);
  if (!references.length || references.some(id => !/^[1-9]\d?$/.test(id)) || new Set(references).size !== references.length) throw new TypeError('Invalid CRA sources');
  return { lang, kind, number: number.padStart(2, '0'), caption, references };
}
