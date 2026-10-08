// Inert, authored SVG only. No article content or remote data enters this module.
const native = { ink:'#0c0d10',surface:'#121419','surface-2':'#171a20',paper:'#e7e9ee',muted:'#8b909b','line-strong':'rgba(255, 255, 255, 0.20)',signal:'#5eead4',amber:'#f5b13d',accent:'#ff4d87' };
const C = Object.fromEntries(Object.entries(native).map(([role,value])=>[role,`var(--color-${role}, ${value})`]));
const escape = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const text = (x,y,value,size=20,color=C.paper,weight=400,anchor='start') => `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${escape(value)}</text>`;
const rect = (x,y,width,height,fill=C.surface,radius=0,stroke='none',strokeWidth=1) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
const line = (x1,y1,x2,y2,color=C['line-strong'],width=2,dash='') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const circle = (x,y,radius,fill=C.surface,stroke='none',width=1) => `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const path = (d,color,width=2,fill='none',dash='') => `<path d="${d}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dash?` stroke-dasharray="${dash}"`:''}/>`;
const region = (name,x,y,width,height,body) => `<g data-region="${name}" data-bounds="${x} ${y} ${width} ${height}">${body}</g>`;
const labels = (name,x,y,width,height,values,size=20,color=C.paper,anchor='start',weight=400,gap=size+8) => region(name,x,y,width,height,values.map((value,i)=>text(anchor==='middle'?x+width/2:anchor==='end'?x+width-8:x+8,y+size+8+i*gap,value,size,color,weight,anchor)).join(''));
function arrow(x1,y1,x2,y2,color=C.signal,dash='') {
  const angle=Math.atan2(y2-y1,x2-x1),length=8,spread=4;
  const bx=x2-Math.cos(angle)*length,by=y2-Math.sin(angle)*length;
  return line(x1,y1,x2,y2,color,2,dash)+path(`M${bx-Math.sin(angle)*spread} ${by+Math.cos(angle)*spread} L${x2} ${y2} L${bx+Math.sin(angle)*spread} ${by-Math.cos(angle)*spread}`,color,2);
}
function document(x,y,color=C.paper) {
  return path(`M${x-20} ${y-29} L${x+7} ${y-29} L${x+20} ${y-16} L${x+20} ${y+29} L${x-20} ${y+29} L${x-20} ${y-29}`,color,2)
    +path(`M${x+7} ${y-29} L${x+7} ${y-16} L${x+20} ${y-16}`,color,2)
    +line(x-10,y-4,x+10,y-4,color,2)+line(x-10,y+7,x+10,y+7,color,2)+line(x-10,y+18,x+3,y+18,color,2);
}
function account(x,y,color=C.paper) {
  return circle(x,y-13,10,'none',color,2)+path(`M${x-22} ${y+25} C${x-22} ${y-1} ${x+22} ${y-1} ${x+22} ${y+25}`,color,2)+line(x-22,y+25,x+22,y+25,color,2);
}
function application(x,y,color=C.paper) {
  return rect(x-25,y-25,50,50,C.surface,7,color,2)+line(x-25,y-10,x+25,y-10,color,2)
    +path(`M${x-10} ${y} L${x-16} ${y+6} L${x-10} ${y+12}`,color,2)
    +path(`M${x+10} ${y} L${x+16} ${y+6} L${x+10} ${y+12}`,color,2)+line(x+3,y-1,x-3,y+14,color,2);
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

// Schleswig-Holstein parliamentary reply 20/3911, 5 January 2026, answer 4.
// Positions are dated snapshots/targets, not measurements of progress in 2026.
export const OFFICE_EXCEPTION_SERIES = Object.freeze([
  Object.freeze({ date:'2025-10',value:5042,status:'reported' }),
  Object.freeze({ date:'2026-12',value:4107,status:'target' }),
  Object.freeze({ date:'2027-12',value:3320,status:'target' }),
  Object.freeze({ date:'2028-12',value:2944,status:'target' }),
  Object.freeze({ date:'2029-12',value:101,status:'target' }),
]);
export const OFFICE_EXCEPTION_SCOPE = Object.freeze({ announcedOn:'2026-01-05',excludes:'tax-administration',unit:'workstations-requiring-office',maximum:6000 });

export function microsoftExitSvg(lang='fr',kind='dependencies',mobile=false) {
  if (!['fr','en'].includes(lang)) throw new RangeError('Unknown Microsoft-exit figure language');
  if (!['dependencies','exceptions','identity'].includes(kind)) throw new RangeError('Unknown Microsoft-exit figure kind');
  if (typeof mobile!=='boolean') throw new TypeError('Microsoft-exit mobile flag must be boolean');
  const fr=lang==='fr',width=mobile?400:1000,id=`microsoft-exit-${kind}-${lang}-${mobile?'mobile':'desktop'}`;
  if (kind==='dependencies') {
    const title=fr?['Les liens qui font','fonctionner le service']:['The connections','behind a working service'];
    const subtitle=fr?['SharePoint → SharePoint : le contenu','et les relations du service à reconstituer.']:['SharePoint → SharePoint: content','and the service relationships to rebuild.'];
    let body=heading(mobile,fr?'DÉPENDANCES':'DEPENDENCIES',title,subtitle);
    const left=mobile?70:155,right=mobile?330:845,documentY=mobile?299:225,accountY=mobile?498:337,appY=mobile?702:445;
    body+=labels('source',24,mobile?214:157,mobile?126:262,42,[fr?'Source':'Source'],mobile?18:22,C.paper,'middle',700);
    body+=labels('destination',mobile?250:714,mobile?214:157,mobile?126:262,42,[fr?'Destination':'Destination'],mobile?18:22,C.paper,'middle',700);
    for(const [side,x] of [['source',left],['destination',right]]) {
      body+=document(x,documentY,side==='source'?C.paper:C.signal)+account(x,accountY,side==='source'?C.paper:C.amber)+application(x,appY,side==='source'?C.paper:C.amber);
      const labelWidth=mobile?116:224,labelX=x-labelWidth/2;
      body+=labels(`${side}-documents`,labelX,documentY+38,labelWidth,38,[fr?'Fichiers':'Files'],mobile?16:20,C.paper,'middle',700);
      body+=labels(`${side}-accounts`,labelX,accountY+34,labelWidth,38,[fr?'Comptes':'Accounts'],mobile?16:20,C.paper,'middle',700);
      body+=labels(`${side}-apps`,labelX,appY+34,labelWidth,mobile?64:40,mobile?(fr?['Apps et','automatismes']:['Apps and','automation']):[fr?'Apps et automatismes':'Apps and automation'],mobile?14:18,C.paper,'middle',700,mobile?21:26);
    }
    const bridgeX=mobile?111:324,bridgeW=mobile?176:352;
    body+=arrow(left+40,documentY,right-40,documentY,C.signal);
    body+=labels('content-transfer',bridgeX,documentY-(mobile?68:63),bridgeW,mobile?60:42,mobile?(fr?['Migrer','le contenu']:['Migrate','content']):[fr?'Migrer le contenu':'Migrate content'],mobile?17:22,C.signal,'middle',700,mobile?23:30);
    body+=arrow(left+40,accountY,right-40,accountY,C.amber,'5 6');
    body+=labels('account-mapping',bridgeX,accountY-(mobile?66:62),bridgeW,mobile?60:42,mobile?(fr?['Rapprocher','les identités']:['Map','identities']):[fr?'Rapprocher les identités':'Map identities'],mobile?17:22,C.amber,'middle',700,mobile?23:30);
    body+=mobile?arrow(right,accountY-37,right,documentY+91,C.amber,'5 6'):line(right+32,accountY,right+68,accountY,C.amber,2,'5 6')+line(right+68,accountY,right+68,documentY+20,C.amber,2,'5 6')+arrow(right+68,documentY+20,right+31,documentY+20,C.amber,'5 6');
    body+=labels('permission-check',mobile?133:650,mobile?347:250,170,88,fr?['Droits maintenus','si les identités','correspondent']:['Access retained','if identities','are mapped'],mobile?15:16,C.muted,'middle',400,22);
    body+=arrow(left+40,appY,right-40,appY,C.amber,'5 6');
    body+=labels('app-reconnection',bridgeX,appY-(mobile?89:84),bridgeW,86,fr?['Republier les apps,','recréer les flux,','puis les reconnecter']:['Republish apps,','recreate flows,','then reconnect them'],mobile?16:18,C.amber,'middle',700,23);
    const railX=mobile?382:969;
    body+=line(right+32,appY,railX,appY,C.amber,2,'5 6')+line(railX,appY,railX,documentY,C.amber,2,'5 6')+arrow(railX,documentY,right+31,documentY,C.amber,'5 6');
    const legendY=mobile?821:535;
    body+=line(32,legendY, width-32,legendY,C['line-strong'],1);
    body+=line(33,legendY+32,69,legendY+32,C.signal,2);
    body+=labels('content-legend',76,legendY+12,mobile?292:320,39,[fr?'Transfert du contenu':'Content transfer'],mobile?15:18,C.paper);
    const secondY=mobile?legendY+73:legendY+32,secondX=mobile?33:512;
    body+=line(secondX,secondY,secondX+36,secondY,C.amber,2,'5 6');
    body+=labels('relations-legend',secondX+43,secondY-20,mobile?292:398,39,[fr?'Relations à rapprocher ou rétablir':'Relationships to map or restore'],mobile?15:18,C.paper);
    body+=labels('dependencies-scope',24,mobile?928:587,width-48,mobile?113:40,mobile?(fr?['Périmètre : migration entre environnements','Microsoft. Les opérations varient selon l’outil.','Source : Microsoft Learn, 7 mai 2026.']:['Scope: migration between Microsoft','environments. Steps depend on the tool.','Source: Microsoft Learn, 7 May 2026.']):[fr?'Source : Microsoft Learn · SharePoint entre tenants Microsoft · 7 mai 2026.':'Source: Microsoft Learn · SharePoint across Microsoft tenants · 7 May 2026.'],mobile?14:16,C.muted,'start',400,mobile?23:26);
    return shell(id,width,mobile?1039:638,title.join(' '),fr?'Schéma pédagogique de migration SharePoint vers SharePoint. Le contenu est transféré, les identités rapprochées, les droits sont maintenus si les identités correspondent, les applications republiées et les flux recréés et reconnectés à destination. Les flèches continues indiquent le contenu, les pointillés les relations à traiter. Ce périmètre Microsoft vers Microsoft ne mesure pas une sortie vers un autre fournisseur.':'Educational SharePoint-to-SharePoint migration diagram. Content is transferred, identities mapped, access is retained if identities are mapped, apps republished and automation recreated and reconnected at the destination. Solid arrows show content; dashed arrows show relationships to address. This Microsoft-to-Microsoft scope does not measure a move to another provider.',body);
  }
  if (kind==='exceptions') {
    const title=fr?['Les exceptions ont','un calendrier']:['Exceptions have','a timetable'];
    const subtitle=fr?['Postes nécessitant encore Microsoft Office.','Schleswig-Holstein · administration fiscale exclue']:['Workstations still requiring Microsoft Office.','Schleswig-Holstein · tax administration excluded'];
    let body=heading(mobile,fr?'LE RESTE DU PARCOURS':'THE REMAINING JOURNEY',title,subtitle);
    const left=mobile?76:120,right=mobile?352:920,top=mobile?290:279,bottom=mobile?626:633,scale=(bottom-top)/6000,forecastX=left+(right-left)*7/50;
    body+=rect(forecastX,top-67,width-forecastX-24,bottom-top+72,C.surface,9);
    body+=labels('forecast-window',forecastX+3,top-64,width-forecastX-35,mobile?60:43,mobile?(fr?['Prévisions publiées','le 5 janvier 2026']:['Forecasts published','5 January 2026']):[fr?'PRÉVISIONS PUBLIÉES LE 5 JANVIER 2026':'FORECASTS PUBLISHED ON 5 JANUARY 2026'],mobile?15:17,C.amber,'middle',700,mobile?22:25);
    for(const value of [0,2000,4000,6000]) {
      const y=bottom-value*scale;
      body+=line(left-4,y,right+10,y,C['line-strong'],value===0?2:1,value===0?'':'3 6');
      body+=labels(`tick-${value}`,mobile?12:28,y-18,mobile?50:76,35,[value===0?'0':String(value/1000)+' 000'],mobile?13:16,C.muted,'end');
    }
    body+=line(forecastX,top,forecastX,bottom,C['line-strong'],1,'4 6');
    const points=OFFICE_EXCEPTION_SERIES.map((item,i)=>({ ...item,x:left+(right-left)*[0,14,26,38,50][i]/50,y:bottom-item.value*scale }));
    body+=`<g data-series="office-exceptions" data-scale="${scale}" data-zero="${bottom}">${path(points.map((p,i)=>`${i?'L':'M'}${p.x} ${p.y}`).join(' '),C.amber,3,'none','7 7')}</g>`;
    const numbers=new Intl.NumberFormat(fr?'fr-FR':'en-US');
    for(const [i,p]of points.entries()) {
      body+=`<g data-observation="${p.date}" data-status="${p.status}" data-value="${p.value}">${circle(p.x,p.y,mobile?5:7,i===0?C.signal:C.ink,i===0?C.signal:C.amber,2)}</g>`;
      const regionWidth=mobile?68:154,regionX=p.x-regionWidth/2;
      body+=labels(`point-${i}`,i===4?(mobile?342:907):i===2?regionX+(mobile?11:54):regionX,p.y-(i===1?(mobile?57:62):i===2&&!mobile?43:(mobile?44:51)),i===4?(mobile?54:90):regionWidth,mobile?37:48,[numbers.format(p.value)],mobile?17:26,i===0?C.signal:C.amber,'middle',700);
      body+=labels(`year-${i}`,regionX,bottom+13,regionWidth,38,[p.date.slice(0,4)],mobile?15:20,C.paper,'middle',700);
      body+=labels(`period-${i}`,regionX,bottom+47,regionWidth,34,[i===0?(fr?'oct.':'Oct'):(fr?'fin':'end')],mobile?13:16,C.muted,'middle');
    }
    const legendY=mobile?745:746;
    body+=circle(40,legendY+15,5,C.signal,C.signal,2)+labels('reported-legend',48,legendY-7,mobile?323:370,40,[fr?'Situation déclarée en octobre 2025':'Reported position in October 2025'],mobile?15:18,C.paper);
    const targetY=mobile?legendY+54:legendY+15,targetX=mobile?33:544;
    body+=line(targetX,targetY,targetX+33,targetY,C.amber,2,'5 6')+labels('target-legend',targetX+41,targetY-22,mobile?299:390,40,[fr?'Prévisions publiées en janvier 2026':'Forecasts published in January 2026'],mobile?14:18,C.paper);
    body+=labels('exceptions-source',24,mobile?845:804,width-48,mobile?91:67,mobile?(fr?['Source : Landtag, réponse 20/3911, question 4.','5 janvier 2026. Axe vertical partant de zéro.','Aucun bilan de réalisation 2026 représenté.']:['Source: Landtag, reply 20/3911, question 4.','5 January 2026. Vertical axis starts at zero.','No 2026 delivery assessment is shown.']):(fr?['Source : Landtag, réponse 20/3911 du 5 janvier 2026, question 4. Axe vertical partant de zéro.','Aucun bilan de réalisation 2026 représenté.']:['Source: Landtag, reply 20/3911 of 5 January 2026, question 4. Vertical axis starts at zero.','No 2026 delivery assessment is shown.']),mobile?14:16,C.muted,'start',400,mobile?23:26);
    return shell(id,width,mobile?961:896,title.join(' '),fr?'Schleswig-Holstein, postes nécessitant encore Microsoft Office hors administration fiscale. Situation déclarée : 5 042 en octobre 2025. Prévisions publiées le 5 janvier 2026 : 4 107 fin 2026, 3 320 fin 2027, 2 944 fin 2028 et 101 fin 2029. Toutes les liaisons vers les objectifs sont en pointillés. Axe vertical de zéro à six mille. Aucun bilan de réalisation en 2026 n’est représenté.':'Schleswig-Holstein workstations still requiring Microsoft Office, excluding the tax administration. Reported position: 5,042 in October 2025. Forecasts published on 5 January 2026: 4,107 at end-2026, 3,320 at end-2027, 2,944 at end-2028 and 101 at end-2029. All connections to targets are dashed. Vertical axis runs from zero to six thousand. No assessment of 2026 delivery is shown.',body);
  }
  const title=fr?['Une mauvaise paire,','une autre boîte']:['A broken pairing,','a different mailbox'];
  const subtitle=fr?['Exemple pédagogique, données fictives.','Adresse et identifiant doivent rester associés.']:['Teaching example, fictional data.','Address and identifier must remain paired.'];
  let body=heading(mobile,fr?'INTÉGRITÉ DE LA MIGRATION':'MIGRATION INTEGRITY',title,subtitle);
  const tableWidth=mobile?336:288,tableXs=mobile?[32,32,32]:[32,356,680],tableYs=mobile?[262,577,922]:[251,251,251];
  const original=[['C','03'],['A','01'],['B','02']],broken=[['A','03'],['B','01'],['C','02']],repaired=[['A','01'],['B','02'],['C','03']];
  const tables=[{name:'original',data:original,color:C.paper,title:fr?'01 · Paires d’origine':'01 · Original pairs'}, {name:'broken',data:broken,color:C.accent,title:fr?'02 · Une colonne triée':'02 · One column sorted'}, {name:'verified',data:repaired,color:C.signal,title:fr?'03 · Paires vérifiées':'03 · Verified pairs'}];
  for(const [index,table]of tables.entries()) {
    const x=tableXs[index],y=tableYs[index],mid=x+tableWidth/2;
    body+=labels(`${table.name}-heading`,x-8,y-54,tableWidth+16,44,[table.title],mobile?20:21,table.color,'start',700);
    body+=rect(x,y,tableWidth,220,C.surface,10,C['line-strong'],1);
    body+=rect(x+1,y+1,tableWidth-2,45,C['surface-2'],8);
    body+=labels(`${table.name}-left-col`,x+7,y+1,tableWidth/2-14,40,[fr?'Adresse':'Address'],16,C.muted,'middle',700);
    body+=labels(`${table.name}-right-col`,mid+7,y+1,tableWidth/2-14,40,[fr?'Identifiant':'Identifier'],16,C.muted,'middle',700);
    for(const [row,[mail,identity]]of table.data.entries()) {
      const rowY=y+50+row*54,cy=rowY+24;
      body+=`<g data-pair="${table.name}" data-address="${mail}" data-identity="${identity}">`;
      body+=labels(`${table.name}-address-${row}`,x+12,rowY,tableWidth/2-36,43,[`${fr?'Boîte':'Mailbox'} ${mail}`],mobile?18:17,C.paper,'middle',700);
      body+=labels(`${table.name}-id-${row}`,mid+22,rowY,tableWidth/2-36,43,[`ID ${identity}`],mobile?18:17,table.color,'middle',700);
      if(index===1)body+=path(`M${mid-5} ${cy-5} L${mid+5} ${cy+5} M${mid-5} ${cy+5} L${mid+5} ${cy-5}`,C.accent,2);
      else body+=arrow(mid-12,cy,mid+12,cy,index===2?C.signal:C.muted);
      body+='</g>';
      if(row<2)body+=line(x+14,rowY+48,x+tableWidth-14,rowY+48,C['line-strong'],1);
    }
    if(index<2) {
      if(mobile)body+=arrow(index===0?200:360,y+229,index===0?200:360,y+252,index===0?C.accent:C.signal,'4 5');
      else body+=arrow(x+tableWidth+7,y+112,tableXs[index+1]-7,y+112,index===0?C.accent:C.signal,'4 5');
    }
  }
  if(mobile) {
    body+=labels('broken-explainer',24,818,352,44,[fr?'A a été relié à l’identifiant de C.':'A was linked to C’s identifier.'],16,C.accent,'middle',700);
    body+=labels('pair-validation',24,1159,352,86,fr?['Comparer les paires au fichier d’origine.','Faire vérifier la correspondance','par un second opérateur.']:['Compare pairs with the original file.','Have a second operator','verify the mapping.'],16,C.signal,'start',400,24);
  } else {
    body+=labels('original-explainer',24,487,304,89,fr?['L’ordre importe peu.','Chaque adresse garde','son identifiant.']:['Order does not matter.','Each address retains','its own identifier.'],18,C.muted,'start',400,26);
    body+=labels('broken-explainer',348,487,304,89,fr?['L’ordre des identifiants','n’a pas suivi celui des adresses.','A se retrouve associé à ID 03.']:['Identifiers did not move','with their addresses.','A is now paired with ID 03.'],17,C.accent,'start',400,26);
    body+=labels('pair-validation',672,487,304,89,fr?['Comparer au fichier d’origine.','Faire vérifier les paires','par un second opérateur.']:['Compare with the original file.','Have a second operator','verify the pairs.'],17,C.signal,'start',400,26);
  }
  const incidentY=mobile?1273:629;
  body+=line(32,incidentY,width-32,incidentY,C['line-strong'],1);
  body+=labels('incident-label',24,incidentY+17,width-48,36,[fr?'INCIDENT DOCUMENTÉ · 6–7 AOÛT 2025':'DOCUMENTED INCIDENT · 6–7 AUGUST 2025'],mobile?13:15,C.muted,'start',700);
  body+=labels('incident-count',24,incidentY+55,mobile?142:171,80,['790'],mobile?48:54,C.paper,'start',700);
  body+=labels('incident-unit',mobile?163:192,incidentY+66,mobile?213:768,70,fr?['comptes affectés','selon Dataport']:['accounts affected','according to Dataport'],mobile?19:21,C.paper,'start',400,27);
  body+=labels('incident-source',24,incidentY+155,width-48,mobile?115:68,mobile?(fr?['Le rapport attribue l’incident à un tri partiel','et à l’absence du contrôle à quatre yeux.','Source : rapport Dataport, 15 août 2025,','annexé à la réponse 20/3628 du Landtag.']:['The report attributes the incident to a partial','sort and a missing four-eyes check.','Source: Dataport report, 15 August 2025,','annexed to Landtag reply 20/3628.']):(fr?['Le rapport attribue l’incident à un tri partiel et à l’absence du contrôle à quatre yeux.','Source : rapport Dataport du 15 août 2025, annexé à la réponse 20/3628 du Landtag.']:['The report attributes the incident to a partial sort and a missing four-eyes check.','Source: Dataport report of 15 August 2025, annexed to Landtag reply 20/3628.']),mobile?14:17,C.muted,'start',400,mobile?23:26);
  return shell(id,width,mobile?1572:877,title.join(' '),fr?'Exemple pédagogique avec données fictives : C est associé à ID 03, A à ID 01, B à ID 02. Trier seulement la colonne des adresses donne A avec ID 03, B avec ID 01 et C avec ID 02. Comparer avec les paires d’origine et effectuer un second contrôle permet de vérifier les associations A–01, B–02 et C–03. Séparément, le rapport Dataport du 15 août 2025 documente 790 comptes affectés par un mauvais rapprochement lors de la migration des 6 et 7 août. Les trois lignes fictives ne reproduisent pas ces comptes.':'Teaching example with fictional data: C maps to ID 03, A to ID 01 and B to ID 02. Sorting only the address column yields A with ID 03, B with ID 01 and C with ID 02. Comparing against the original pairs and performing a second check verifies A–01, B–02 and C–03. Separately, Dataport’s report of 15 August 2025 documents 790 accounts affected by a mapping error during the 6–7 August migration. The three fictional rows do not reproduce those accounts.',body);
}
