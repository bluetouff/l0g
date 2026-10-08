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

// Sources: MHCLG guides dated 27 February 2025 and public solution 1.0.0.13.
// This is the successful processing path, not a claim about deployed volumes.
export const CONSULTATION_SCOPE = Object.freeze({ jurisdiction:'England',publishedOn:'2025-02-27',solutionVersion:'1.0.0.13',schedule:'daily',input:'unread-emails',acknowledgement:'optional',export:'list-fields-and-links',attachments:'remain-in-SharePoint' });
export const REPORTING_SCOPE = Object.freeze({ cnsaCampaign:2025,atihCampaign:2026,scope:'preparation-and-collection',thirdPartyFormat:'structured-text',reviewOutput:'Excel' });

function consultation(lang,mobile) {
  const fr=lang==='fr',width=mobile?400:1000;
  const title=fr?['Le circuit derrière','l’export Excel']:['The workflow behind','an Excel export'];
  const subtitle=fr?['Consultations locales en Angleterre','Solution publique MHCLG · 27 février 2025']:['Local plan consultations in England','Public MHCLG solution · 27 February 2025'];
  let body=heading(mobile,fr?'PROCÉDURE ET DONNÉES':'WORKFLOW AND DATA',title,subtitle);
  const citizen={x:mobile?64:32,y:mobile?222:200,w:mobile?272:164,h:70};
  const mailbox={x:mobile?64:32,y:mobile?347:350,w:mobile?272:164,h:96};
  const engine={x:mobile?64:284,y:mobile?505:177,w:mobile?272:354,h:mobile?285:355};
  const storage={x:mobile?64:710,y:mobile?835:177,w:mobile?272:258,h:mobile?270:355};
  const citizenCopy=fr?['Participant','Courriel + pièces jointes']:['Participant','Email + attachments'];
  body+=`<g data-node="participant">${rect(citizen.x,citizen.y,citizen.w,citizen.h,C.surface,10,C['line-strong'])}</g>`;
  body+=labels('participant-title',citizen.x+4,citizen.y+2,citizen.w-8,38,[citizenCopy[0]],mobile?21:20,C.paper,'middle',700);
  body+=labels('participant-detail',citizen.x,citizen.y+36,citizen.w,34,[citizenCopy[1]],mobile?14:13,C.muted,'middle');
  body+=`<g data-node="mailbox">${rect(mailbox.x,mailbox.y,mailbox.w,mailbox.h,C.surface,10,C['line-strong'])}</g>`;
  body+=labels('mailbox-title',mailbox.x+4,mailbox.y+3,mailbox.w-8,38,['Office 365'],mobile?22:21,C.paper,'middle',700);
  body+=labels('mailbox-detail',mailbox.x+2,mailbox.y+40,mailbox.w-4,56,fr?['Messagerie partagée','Messages non lus']:['Shared mailbox','Unread messages'],mobile?15:14,C.muted,'middle',400,22);
  body+=`<g data-node="power-automate">${rect(engine.x,engine.y,engine.w,engine.h,C.surface,12,C['line-strong'])}</g>`;
  body+=labels('engine-title',engine.x+5,engine.y+5,engine.w-10,42,['Power Automate'],mobile?22:24,C.paper,'middle',700);
  body+=labels('engine-frequency',engine.x+5,engine.y+46,engine.w-10,35,[fr?'Chaque jour · étapes réussies':'Daily · successful processing path'],mobile?13:15,C.muted,'middle');
  const stepY=mobile?[582,637,711]:[276,348,424];
  const stepCopy=fr?[['Archiver le message'],['Corps HTML → texte','Créer une ligne : statut « New »'],['Joindre les pièces à la ligne']]:[['Archive the message'],['HTML body → text','Create a row: status “New”'],['Attach files to the row']];
  for(let i=0;i<3;i++) {
    body+=`<g data-step="${['archive-message','convert-and-create-row','attach-files'][i]}">`;
    body+=labels(`engine-step-${i}`,engine.x+9,stepY[i],engine.w-18,i===1?64:36,stepCopy[i],mobile?15:17,C.signal,'middle',700,mobile?23:26);
    body+='</g>';
    if(i<2)body+=arrow(engine.x+engine.w/2,stepY[i]+(i===1?61:39),engine.x+engine.w/2,stepY[i+1]-5,C.muted);
  }
  if(!mobile)body+=labels('engine-final-state',engine.x+8,485,engine.w-16,36,[fr?'Accusé facultatif, puis message lu':'Optional reply, then mark as read'],15,C.muted,'middle');
  body+=`<g data-node="sharepoint">${rect(storage.x,storage.y,storage.w,storage.h,C.surface,12,C['line-strong'])}</g>`;
  body+=labels('sharepoint-title',storage.x+7,storage.y+5,storage.w-14,44,['SharePoint'],mobile?23:24,C.paper,'middle',700);
  const archiveY=mobile?892:254,listY=mobile?989:383;
  body+=`<g data-storage="message-file">${rect(storage.x+12,archiveY,storage.w-24,78,C['surface-2'],6)}</g>`;
  body+=labels('message-archive',storage.x+15,archiveY+3,storage.w-30,72,fr?['Bibliothèque','Message enregistré']:['Document library','Saved email'],mobile?17:18,C.paper,'middle',700,26);
  body+=`<g data-storage="list-item">${rect(storage.x+12,listY,storage.w-24,mobile?102:121,C['surface-2'],6)}</g>`;
  body+=labels('list-fields',storage.x+15,listY+2,storage.w-30,100,fr?['Liste de suivi','Expéditeur · date · texte','Lien du message · pièces jointes']:['Response list','Sender · date · text','Email link · attachments'],mobile?14:14,C.paper,'middle',400,26);
  if(mobile) {
    body+=`<g data-edge="email-input">${arrow(200,300,200,335)}</g>`;
    body+=`<g data-edge="unread-input">${arrow(200,451,200,493)}</g>`;
    body+=`<g data-edge="store-results">${arrow(200,798,200,823)}</g>`;
    // The two return paths are independent: optional acknowledgement and read state.
    body+=`<g data-edge="optional-acknowledgement">${path('M64 766 L24 766 L24 256 L52 256',C.amber,2,'none','5 5')}${arrow(42,256,52,256,C.amber)}</g>`;
    body+=`<g data-edge="mark-as-read">${path('M336 784 L374 784 L374 394 L348 394',C.paper,2)}${arrow(358,394,348,394,C.paper)}</g>`;
    body+=labels('return-paths',24,1130,352,63,fr?['Pointillé : accusé facultatif.','Trait plein : message marqué comme lu.']:['Dashed: optional acknowledgement.','Solid: message marked as read.'],14,C.muted,'start',400,23);
  } else {
    body+=`<g data-edge="email-input">${arrow(114,278,114,338)}</g>`;
    body+=`<g data-edge="unread-input">${path('M204 374 L252 374 L252 244 L272 244',C.signal,2)}${arrow(262,244,272,244)}</g>`;
    body+=`<g data-edge="archive-output">${arrow(646,296,698,296)}</g>`;
    body+=`<g data-edge="row-output">${path('M646 377 L674 377 L674 407 L698 407',C.signal,2)}${arrow(688,407,698,407)}</g>`;
    body+=`<g data-edge="attachment-output">${arrow(646,443,698,443)}</g>`;
    body+=`<g data-edge="optional-acknowledgement">${path('M284 490 L220 490 L220 233 L208 233',C.amber,2,'none','5 5')}${arrow(218,233,208,233,C.amber)}</g>`;
    body+=`<g data-edge="mark-as-read">${path('M284 516 L234 516 L234 418 L208 418',C.paper,2)}${arrow(218,418,208,418,C.paper)}</g>`;
    body+=labels('return-paths',24,470,244,70,fr?['Accusé : trait pointillé','Message lu : trait plein']:['Optional reply: dashed','Mark as read: solid'],13,C.muted,'start',400,22);
  }
  const frontierY=mobile?1230:595,excelY=mobile?1288:629,excelX=mobile?64:620,excelW=mobile?272:348;
  body+=line(32,frontierY,width-32,frontierY,C.amber,1.5,'6 6');
  body+=labels('export-boundary',24,frontierY-45,mobile?352:536,40,[fr?'EXPORT DE LA LISTE':'EXPORT THE LIST'],mobile?14:16,C.amber,'start',700);
  const exportStart=mobile?1113:540;
  if(mobile)body+=`<g data-edge="list-export">${line(352,exportStart,382,exportStart,C.signal,2)}${line(382,exportStart,382,1261,C.signal,2)}${line(200,1261,382,1261,C.signal,2)}${arrow(200,1261,200,1276)}</g>`;
  else body+=`<g data-edge="list-export">${arrow(839,exportStart,839,617)}</g>`;
  body+=`<g data-node="excel-export">${rect(excelX,excelY,excelW,119,C['surface-2'],10)}</g>`;
  body+=labels('excel-title',excelX+8,excelY+4,excelW-16,42,['Excel'],22,C.paper,'middle',700);
  body+=labels('excel-fields',excelX+7,excelY+46,excelW-14,70,fr?['Champs de la liste + lien du message','Nombre de pièces jointes']:['List fields + link to the email','Number of attached files'],mobile?14:16,C.paper,'middle',400,25);
  body+=labels('export-limit',mobile?24:24,mobile?1430:641,mobile?352:548,90,mobile?(fr?['Messages et pièces jointes restent','dans SharePoint. Leur accès dépend','des connexions et des autorisations.']:['Emails and attached files remain','in SharePoint. Access depends on','connections and permissions.']):(fr?['Messages et pièces jointes restent dans SharePoint.','Connexions et autorisations assurent l’accès aux services.']:['Emails and attachments remain in SharePoint.','Connections and permissions govern service access.']),mobile?15:17,C.muted,'start',400,25);
  const footerY=mobile?1530:784;
  body+=line(32,footerY,width-32,footerY,C['line-strong'],1);
  body+=labels('consultation-source',24,footerY+10,width-48,mobile?70:40,mobile?(fr?['Sources : guides MHCLG du 27 février 2025','et solution publique 1.0.0.13.']:['Sources: MHCLG guides, 27 February 2025,','and public solution 1.0.0.13.']):[fr?'Sources : guides MHCLG du 27 février 2025 et solution publique 1.0.0.13.':'Sources: MHCLG guides, 27 February 2025, and public solution 1.0.0.13.'],mobile?14:16,C.muted,'start',400,23);
  return shell(`microsoft-workflow-consultation-${lang}-${mobile?'mobile':'desktop'}`,width,mobile?1630:857,title.join(' '),fr?'Circuit documenté de la solution MHCLG pour les consultations locales en Angleterre. Chaque jour, Power Automate lit les courriels non lus d’une boîte de messagerie Microsoft 365 partagée, archive les messages dans une bibliothèque SharePoint, convertit le corps HTML en texte et crée une ligne de suivi au statut New. Les pièces jointes sont associées à cette ligne. Un accusé peut être envoyé au participant, puis le message est marqué comme lu. L’export Excel emporte des champs et un lien vers le message, ainsi que le nombre de pièces jointes ; les fichiers restent dans SharePoint. Les accès nécessitent des connexions et des autorisations. Schéma du chemin de succès, sans mesure de volumes déployés.':'Documented MHCLG workflow for local plan consultations in England. Each day, Power Automate reads unread messages in a shared Microsoft 365 mailbox, archives the emails in a SharePoint document library, converts the HTML body to text and creates a response-list row with New status. Attachments are added to that row. An optional acknowledgement is sent to the participant, then the email is marked as read. The Excel export contains list fields, a link to the saved email and the number of attachments; the files remain in SharePoint. Access requires connections and permissions. Successful processing path, without claims about deployed volumes.',body);
}

export function microsoftWorkflowSvg(lang='fr',kind='consultation',mobile=false) {
  if(!['fr','en'].includes(lang))throw new RangeError('Unknown Microsoft-workflow figure language');
  if(!['reporting','consultation'].includes(kind))throw new RangeError('Unknown Microsoft-workflow figure kind');
  if(typeof mobile!=='boolean')throw new TypeError('Microsoft-workflow mobile flag must be boolean');
  if(kind==='reporting')return reporting(lang,mobile);
  return consultation(lang,mobile);
}

function reporting(lang,mobile) {
  const fr=lang==='fr',width=mobile?400:1000;
  const title=fr?['Deux voies pour','remettre un budget']:['Two ways to','submit a budget'];
  const subtitle=fr?['Préparation et collecte des données','Deux périmètres et deux campagnes distincts']:['Preparing and collecting the data','Two different scopes and reporting years'];
  let body=heading(mobile,fr?'PROCÉDURES BUDGÉTAIRES':'BUDGET REPORTING',title,subtitle);
  const box=(key,x,y,w,h,headline,detail=[],color=C.paper,size=20) => `<g data-node="${key}">${rect(x,y,w,h,C.surface,8,C['line-strong'])}</g>`+labels(`${key}-title`,x+3,y+3,w-6,40,[headline],size,color,'middle',700)+(detail.length?labels(`${key}-detail`,x+4,y+43,w-8,detail.length*23+12,detail,mobile?14:15,C.muted,'middle',400,22):'');
  const edge=(key,x1,y1,x2,y2,color=C.signal) => `<g data-edge="${key}">${arrow(x1,y1,x2,y2,color)}</g>`;
  const scopeY=mobile?219:174;
  body+=labels('cnsa-scope',24,scopeY,width-48,62,fr?['CNSA · médico-social · EPRD 2025','Excel requis · février 2025']:['CNSA · social care sector · EPRD 2025','Excel required · February 2025'],mobile?15:19,C.paper,'start',700,26);
  if(mobile) {
    body+=box('cnsa-excel',32,309,154,85,'Microsoft Excel',[fr?'Macros activées':'Macros enabled'],C.paper,17);
    body+=edge('cnsa-generate-tabs',194,351,206,351);
    body+=box('cnsa-tabs',218,309,150,85,fr?'Onglets générés':'Worksheets',[fr?'Puis saisie':'Generate + fill'],C.signal,16);
    body+=`<g data-edge="cnsa-save-frame">${path('M293 402 L293 435 L106 435 L106 463',C.signal,2)}${arrow(106,453,106,463)}</g>`;
    body+=box('cnsa-xls',32,475,148,55,fr?'Cadre .xls':'Workbook .xls',[],C.paper,18);
    body+=edge('cnsa-submit',188,502,206,502);
    body+=box('cnsa-import',218,475,150,55,'ImportEPRD',[],C.signal,19);
  } else {
    body+=box('cnsa-excel',32,262,206,91,'Microsoft Excel',[fr?'Page de garde + macros':'Cover sheet + macros'],C.paper,21);
    body+=edge('cnsa-generate-tabs',246,306,274,306);
    body+=box('cnsa-tabs',286,262,224,91,fr?'Onglets générés':'Generated sheets',[fr?'Puis saisie des données':'Then enter the data'],C.signal,20);
    body+=edge('cnsa-save-frame',518,306,546,306);
    body+=box('cnsa-xls',558,278,152,58,fr?'Cadre .xls':'Workbook .xls',[],C.paper,18);
    body+=edge('cnsa-submit',718,306,746,306);
    body+=box('cnsa-import',758,278,210,58,'ImportEPRD',[],C.signal,21);
  }
  const dividerY=mobile?568:389;
  body+=line(32,dividerY,width-32,dividerY,C['line-strong'],1);
  body+=labels('atih-scope',24,dividerY+14,width-48,62,fr?['ATIH · hôpitaux · EPRD-PGFP 2026','Préparation possible par plusieurs chemins']:['ATIH · hospitals · EPRD-PGFP 2026','Several ways to prepare the submission'],mobile?15:19,C.paper,'start',700,26);
  if(mobile) {
    body+=box('atih-excel',32,672,154,86,'Excel .xlsm',[fr?'Macro de génération':'Generation macro'],C.paper,19);
    body+=box('atih-software',218,672,150,86,fr?'Logiciel financier':'Finance software',[fr?'Export par l’éditeur':'Vendor export'],C.paper,15);
    body+=edge('atih-excel-csv',109,766,109,790);
    body+=edge('atih-software-text',293,766,293,790);
    body+=box('atih-csv',32,802,154,55,'CSV',[],C.signal,21);
    body+=box('atih-structured',218,802,150,55,fr?'Texte structuré':'Structured text',[],C.signal,16);
    body+=`<g data-edge="atih-imports">${line(109,865,109,891,C.signal,2)}${line(293,865,293,891,C.signal,2)}${line(109,891,293,891,C.signal,2)}${arrow(200,891,200,912)}</g>`;
    body+=`<g data-node="ancre">${rect(56,924,288,219,C['surface-2'],12,C['line-strong'])}</g>`;
    body+=labels('ancre-title',64,928,272,42,['ANCRE'],24,C.paper,'middle',700);
    body+=labels('ancre-import-checks',64,975,272,63,fr?['Import : en-tête et lignes contrôlés','FINESS · exercice · codes']:['Import: header and row checks','FINESS · year · codes'],14,C.signal,'middle',400,25);
    body+=line(72,1048,328,1048,C['line-strong'],1);
    body+=labels('ancre-web-entry',64,1061,272,70,fr?['Saisie web directe possible','Collecte et contrôles des données']:['Direct web entry available','Data collection and checks'],15,C.paper,'middle',400,26);
    body+=edge('atih-web-direct',24,1097,44,1097,C.paper);
    body+=edge('atih-review',200,1151,200,1175);
    body+=box('atih-excel-review',56,1187,288,83,fr?'État Excel pour contrôle':'Excel statement for review',[fr?'Étape prévue après la collecte':'A step after data collection'],C.amber,18);
  } else {
    body+=box('atih-excel',32,490,222,83,'Excel .xlsm',[fr?'Macro de génération':'Generation macro'],C.paper,21);
    body+=edge('atih-excel-csv',262,532,300,532);
    body+=box('atih-csv',312,505,230,55,'CSV',[],C.signal,21);
    body+=box('atih-software',32,609,222,86,fr?'Logiciel financier':'Finance software',[fr?'Export développé par l’éditeur':'Vendor-developed export'],C.paper,20);
    body+=edge('atih-software-text',262,651,300,651);
    body+=box('atih-structured',312,624,230,55,fr?'Fichier structuré':'Structured text',[],C.signal,20);
    body+=`<g data-node="ancre">${rect(598,490,188,253,C['surface-2'],12,C['line-strong'])}</g>`;
    body+=labels('ancre-title',604,496,176,44,['ANCRE'],24,C.paper,'middle',700);
    body+=labels('ancre-import-checks',604,550,176,89,fr?['Contrôles d’import','En-tête · lignes','FINESS · exercice']:['Import checks','Header · rows','FINESS · year'],15,C.signal,'middle',400,24);
    body+=line(614,649,770,649,C['line-strong'],1);
    body+=labels('ancre-web-entry',604,662,176,67,fr?['Saisie web directe','et contrôles']:['Direct web entry','and checks'],15,C.paper,'middle',400,25);
    body+=`<g data-edge="atih-imports">${path('M550 532 L571 532 L571 601 L586 601',C.signal,2)}${line(550,651,571,651,C.signal,2)}${line(571,601,571,651,C.signal,2)}${arrow(576,601,586,601)}</g>`;
    body+=labels('atih-web-choice',24,704,520,37,[fr?'La saisie web rejoint directement la collecte ANCRE.':'Web entry goes directly into the ANCRE collection.'],16,C.muted,'start');
    body+=edge('atih-web-direct',548,722,586,722,C.paper);
    body+=edge('atih-review',794,616,812,616,C.amber);
    body+=box('atih-excel-review',824,561,144,123,'Excel',fr?['État pour','contrôle']:['Statement','for review'],C.amber,21);
  }
  const footerY=mobile?1310:783;
  body+=line(32,footerY,width-32,footerY,C['line-strong'],1);
  body+=labels('reporting-scope',24,footerY+9,width-48,mobile?90:41,mobile?(fr?['Schéma de préparation et de collecte.','Les deux circuits concernent des secteurs','et des campagnes distincts.']:['Preparation and collection diagram.','The two workflows cover different','sectors and reporting years.']):[fr?'Préparation et collecte uniquement ; secteurs et campagnes distincts.':'Preparation and collection only; different sectors and reporting years.'],mobile?14:16,C.muted,'start',400,23);
  body+=labels('reporting-source',24,footerY+(mobile?93:49),width-48,mobile?67:40,mobile?(fr?['Sources : consignes CNSA 2025 ;','guide ATIH EPRD-PGFP 2026.']:['Sources: CNSA 2025 guidance;','ATIH EPRD-PGFP 2026 user guide.']):[fr?'Sources : consignes CNSA 2025 ; guide ATIH EPRD-PGFP 2026, § 3.5, 3.6, 3.8 et 3.12.':'Sources: CNSA 2025 guidance; ATIH EPRD-PGFP 2026 guide, sections 3.5, 3.6, 3.8 and 3.12.'],mobile?14:16,C.muted,'start',400,23);
  return shell(`microsoft-workflow-reporting-${lang}-${mobile?'mobile':'desktop'}`,width,mobile?1489:889,title.join(' '),fr?'Deux circuits de préparation et de collecte, sur des secteurs et des campagnes distincts. Pour la campagne médico-sociale CNSA EPRD 2025, les consignes requièrent Excel : les macros génèrent les onglets, les données sont saisies puis le cadre au format xls est déposé dans ImportEPRD. Pour la campagne hospitalière ATIH EPRD-PGFP 2026, la macro du cadre Excel xlsm génère un CSV ; un logiciel financier peut aussi produire un fichier texte structuré conforme, sous réserve du développement de l’export par son éditeur. Les fichiers passent par des contrôles d’import dans ANCRE. La saisie web directe est également disponible. Le guide prévoit un état Excel pour contrôler les données après la collecte. Aucune comparaison de performances ou de taux de migration.':'Two preparation and collection workflows for different sectors and reporting years. CNSA guidance for the 2025 social care EPRD campaign requires Excel: macros generate worksheets, data is entered and the xls workbook is submitted to ImportEPRD. In the 2026 hospital ATIH EPRD-PGFP campaign, the Excel xlsm macro produces a CSV; finance software may also produce conforming structured text, with the export developed by its vendor. Files undergo import checks in ANCRE. Direct web entry is also available. The guide includes an Excel statement for reviewing collected data. This is not a comparison of performance or migration rates.',body);
}
