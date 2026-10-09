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

// Government responses: 20/3632 (7 October 2025, pp. 3–4),
// 20/5509 (4 November 2025, pp. 2–3), 20/6328 (19 March 2026, p. 4).
export const QUALIFICATION = Object.freeze({
  isolatedVersion:'6.4', snapshot:'2025-10-07', eJuVa:'completed', visJustiz:'ongoing',
  sameWorkstation:true, deliveryReported:'2025-11-04', deliveryMonth:'2025-10',
  deliveryScope:'some-installations-including-justice', deliveredVersion:null,
  laterSnapshot:'2026-03-19', thunderbird:'available', webRoute:'separate-development',
});
// Historical process described by Munich. No assertion about its current estate.
export const UPSTREAM = Object.freeze({
  localUseThrough:'2023-12', contributionFirst:'tdf-main-branch', qa:'tdf',
  localPortCondition:'qa-approved', sharedContribution:true,
});
const node = (name,x,y,w,h,fill=C['surface-2'],stroke='none') => `<g data-node="${name}">${rect(x,y,w,h,fill,8,stroke)}</g>`;
const edge = (name,body) => `<g data-edge="${name}">${body}</g>`;

function qualification(lang,mobile) {
  const fr=lang==='fr',width=mobile?400:1000;
  const title=fr?['Qualifier le travail','sur un même poste']:['Qualifying the workflow','on one workstation'];
  let body=heading(mobile,fr?'MIGRATION EN PRATIQUE':'MIGRATION IN PRACTICE',title,fr?['Schleswig-Holstein · courriels et dossiers','États documentés en 2025 et 2026']:['Schleswig-Holstein · email and case files','Documented states in 2025 and 2026']);
  if(!mobile) {
    body+=labels('correction-stage',24,177,280,40,[fr?'1 · CORRECTION':'1 · CORRECTION'],16,C.signal,'start',700);
    body+=labels('qualification-stage',326,177,382,40,[fr?'2 · QUALIFICATION CROISÉE':'2 · CROSS-APPLICATION TESTS'],16,C.signal,'middle',700);
    body+=labels('delivery-stage',750,177,226,40,[fr?'3 · LIVRAISON LOCALE':'3 · LOCAL DELIVERY'],16,C.signal,'start',700);
    body+=node('isolated-test',32,234,260,262);
    body+=labels('mail-origin',44,242,236,65,fr?['Thunderbird','Courriel + pièces jointes']:['Thunderbird','Email + attachments'],19,C.paper,'middle',500,28);
    body+=edge('mail-to-correction',arrow(162,316,162,342,C.muted));
    body+=labels('corrected-version',44,353,236,40,['eJuVa 6.4 (PDV)'],22,C.paper,'middle',700);
    body+=labels('isolated-result',44,400,236,74,fr?['Format corrigé','Test isolé réussi']:['Format corrected','Isolated test passed'],18,C.signal,'middle',500,30);
    body+=node('same-workstation',334,234,366,262,C.surface,C['line-strong']);
    body+=labels('same-workstation-label',342,245,350,45,[fr?'UN MÊME POSTE':'ONE WORKSTATION'],18,C.paper,'middle',700);
    body+=node('ejuva',350,305,150,131);
    body+=node('vis',534,305,150,131);
    body+=labels('ejuva-title',354,317,142,42,['eJuVa'],20,C.paper,'middle',700);
    body+=labels('vis-title',538,317,142,42,['VIS-Justiz'],20,C.paper,'middle',700);
    body+=labels('ejuva-status',354,368,142,60,fr?['Test','achevé']:['Test','completed'],17,C.signal,'middle',500,24);
    body+=labels('vis-status',538,368,142,60,fr?['Tests miroirs','en cours']:['Mirror tests','ongoing'],16,C.amber,'middle',500,24);
    body+=edge('cross-qualification',arrow(506,352,528,352,C.muted)+arrow(528,386,506,386,C.muted));
    body+=labels('snapshot',342,448,350,40,[fr?'Constat du 7 octobre 2025':'Status on 7 October 2025'],16,C.muted,'middle');
    body+=edge('isolated-to-cross',arrow(300,344,326,344));
    body+=node('local-delivery',758,234,210,262);
    body+=labels('delivery-date',766,246,194,65,fr?['4 novembre 2025','Compte rendu']:['4 November 2025','Progress report'],17,C.muted,'middle',500,28);
    body+=labels('delivery-result',766,329,194,144,fr?['Fonction livrée','en octobre','Certaines installations,','dont la justice']:['Feature delivered','in October','Some installations,','including justice'],16,C.paper,'middle',700,31);
    body+=edge('later-report',arrow(710,344,748,344,C.muted,'4 5'));
    body+=labels('later-status',24,521,952,40,[fr?'19 MARS 2026 · DEUX PARCOURS DISTINCTS':'19 MARCH 2026 · TWO DISTINCT ROUTES'],15,C.muted,'start',700);
    body+=node('thunderbird-route',32,570,435,63);
    body+=labels('thunderbird-route-label',42,581,415,42,[fr?'Thunderbird → dossier : disponible':'Thunderbird → case file: available'],18,C.signal,'middle',500);
    body+=node('web-route',501,570,467,63);
    body+=labels('web-route-label',511,581,447,42,[fr?'Parcours web : développement séparé':'Web route: separate development'],18,C.amber,'middle',500);
    body+=labels('qualification-source',24,661,952,35,[fr?'Sources : Landtag, 20/3632, p. 3–4 ; 20/5509, p. 2–3 ; 20/6328, p. 4 · Pointillés : constat ultérieur':'Sources: Landtag, 20/3632, pp. 3–4; 20/5509, pp. 2–3; 20/6328, p. 4 · Dashes: later report'],13,C.muted,'start');
  } else {
    body+=labels('correction-stage',24,218,352,39,[fr?'1 · CORRECTION':'1 · CORRECTION'],16,C.signal,'start',700);
    body+=node('isolated-test',32,269,336,200);
    body+=labels('mail-origin',40,279,320,40,[fr?'Thunderbird · courriel + pièces jointes':'Thunderbird · email + attachments'],16,C.paper,'middle',500);
    body+=edge('mail-to-correction',arrow(200,328,200,354,C.muted));
    body+=labels('corrected-version',40,365,320,41,['eJuVa 6.4 (PDV)'],23,C.paper,'middle',700);
    body+=labels('isolated-result',40,420,320,40,[fr?'Format corrigé · test isolé réussi':'Format corrected · isolated test passed'],16,C.signal,'middle',500);
    body+=edge('isolated-to-cross',arrow(200,478,200,509));
    body+=labels('qualification-stage',24,521,352,40,[fr?'2 · QUALIFICATION CROISÉE':'2 · CROSS-APPLICATION TESTS'],16,C.signal,'start',700);
    body+=node('same-workstation',32,575,336,258,C.surface,C['line-strong']);
    body+=labels('same-workstation-label',40,585,320,43,[fr?'UN MÊME POSTE':'ONE WORKSTATION'],18,C.paper,'middle',700);
    body+=node('ejuva',48,650,136,116);
    body+=node('vis',216,650,136,116);
    body+=labels('ejuva-title',52,659,128,41,['eJuVa'],20,C.paper,'middle',700);
    body+=labels('vis-title',220,659,128,41,['VIS-Justiz'],20,C.paper,'middle',700);
    body+=labels('ejuva-status',52,706,128,58,fr?['Test','achevé']:['Test','completed'],16,C.signal,'middle',500,23);
    body+=labels('vis-status',220,706,128,58,fr?['Tests miroirs','en cours']:['Mirror tests','ongoing'],16,C.amber,'middle',500,23);
    body+=edge('cross-qualification',arrow(190,685,210,685,C.muted)+arrow(210,725,190,725,C.muted));
    body+=labels('snapshot',40,783,320,39,[fr?'Constat du 7 octobre 2025':'Status on 7 October 2025'],16,C.muted,'middle');
    body+=edge('later-report',arrow(200,842,200,876,C.muted,'4 5'));
    body+=labels('delivery-stage',24,890,352,40,[fr?'3 · LIVRAISON LOCALE':'3 · LOCAL DELIVERY'],16,C.signal,'start',700);
    body+=node('local-delivery',32,944,336,155);
    body+=labels('delivery-date',40,951,320,40,[fr?'Compte rendu du 4 novembre 2025':'Progress report · 4 November 2025'],16,C.muted,'middle');
    body+=labels('delivery-result',40,1005,320,80,fr?['Fonction livrée en octobre','Certaines installations,','dont la justice.']:['Feature delivered in October','in some installations, including justice.'],16,C.paper,'middle',700,28);
    body+=labels('later-status',24,1125,352,40,[fr?'19 MARS 2026 · LES PARCOURS':'19 MARCH 2026 · THE ROUTES'],16,C.muted,'start',700);
    body+=node('thunderbird-route',32,1179,336,71);
    body+=labels('thunderbird-route-label',40,1182,320,65,fr?['Thunderbird → dossier','Disponible']:['Thunderbird → case file','Available'],17,C.signal,'middle',500,26);
    body+=node('web-route',32,1266,336,71);
    body+=labels('web-route-label',40,1269,320,65,fr?['Parcours web','Développement séparé']:['Web route','Separate development'],17,C.amber,'middle',500,26);
    body+=labels('qualification-source',24,1363,352,96,fr?['Sources : Landtag, 20/3632, p. 3–4 ;','20/5509, p. 2–3 ; 20/6328, p. 4.','Pointillés : constat ultérieur.']:['Sources: Landtag, 20/3632, pp. 3–4;','20/5509, pp. 2–3; 20/6328, p. 4.','Dashes: later report.'],13,C.muted,'start',400,24);
  }
  return shell(`microsoft-migration-practice-qualification-${lang}-${mobile?'mobile':'desktop'}`,width,mobile?1470:710,title.join(' '),fr?'Schleswig-Holstein. Au 7 octobre 2025, eJuVa 6.4, édité par PDV, corrige le format des courriels et pièces jointes transférés de Thunderbird vers eJuVa. Le test isolé a réussi. La qualification commune eJuVa et VIS-Justiz sur le même poste reste nécessaire : test eJuVa achevé, tests miroirs VIS-Justiz en cours. Le rapport du 4 novembre annonce une livraison de la fonctionnalité en octobre dans certaines installations, dont la justice, sans nommer la version livrée. Le 19 mars 2026, le parcours Thunderbird est disponible et le parcours web fait l’objet d’un développement séparé.':'Schleswig-Holstein. On 7 October 2025, eJuVa 6.4, supplied by PDV, corrects the format of email and attachments transferred from Thunderbird to eJuVa. Its isolated test passed. Joint qualification with VIS-Justiz on the same workstation is still required: the eJuVa test is complete and mirror tests in VIS-Justiz are ongoing. The 4 November report records delivery of the feature in October to some installations, including justice, without identifying the delivered version. On 19 March 2026, the Thunderbird route is available and the web route is under separate development.',body);
}

function upstream(lang,mobile) {
  const fr=lang==='fr',width=mobile?400:1000;
  const title=fr?['Faire circuler','les améliorations']:['Sharing improvements','with LibreOffice'];
  let body=heading(mobile,fr?'ENTRETENIR UNE ALTERNATIVE':'MAINTAINING AN ALTERNATIVE',title,fr?['Circuit historique décrit par Munich','LibreOffice dans LiMux jusqu’à fin 2023']:['Historical process described by Munich','LibreOffice in LiMux through the end of 2023']);
  if(!mobile) {
    body+=node('municipality',32,199,280,375,C.surface,C['line-strong']);
    body+=node('common-project',416,199,552,375,C.surface,C['line-strong']);
    body+=labels('city-heading',44,209,256,43,['MUNICH'],19,C.paper,'start',700);
    body+=labels('project-heading',428,209,528,43,['THE DOCUMENT FOUNDATION'],19,C.signal,'start',700);
    body+=node('contribution',48,273,248,110);
    body+=labels('contribution-label',56,284,232,95,fr?['Corrections de bugs','et fonctionnalités','Contributions municipales']:['Bug fixes','and features','Municipal contributions'],17,C.paper,'middle',500,27);
    body+=node('main-branch',440,273,254,110);
    body+=labels('main-branch-label',448,289,238,82,fr?['Branche principale','de LibreOffice']:['LibreOffice','main branch'],22,C.signal,'middle',700,31);
    body+=edge('contribute-upstream',arrow(304,327,432,327));
    body+=labels('first',312,274,112,38,[fr?'D’ABORD':'FIRST'],14,C.signal,'middle',700);
    body+=edge('main-to-qa',arrow(567,391,567,419));
    body+=node('quality-assurance',440,430,254,110);
    body+=labels('qa-label',448,441,238,83,fr?['Assurance qualité','chez TDF','Validation']:['Quality assurance','at TDF','Approval'],18,C.paper,'middle',700,26);
    body+=node('local-version',48,430,248,110);
    body+=labels('local-version-label',56,445,232,79,fr?['Version municipale','de LibreOffice']:['Municipal version','of LibreOffice'],20,C.paper,'middle',700,31);
    body+=edge('approved-local-port',arrow(432,485,304,485));
    body+=labels('after-approval',307,406,126,61,fr?['APRÈS','VALIDATION']:['AFTER','APPROVAL'],13,C.signal,'middle',700,23);
    body+=node('shared-benefit',750,430,194,110);
    body+=labels('shared-benefit-label',758,441,178,87,fr?['Contributions','dans LibreOffice','partagé']:['Contributions','in shared','LibreOffice'],17,C.signal,'middle',500,27);
    body+=edge('shared-contribution',arrow(702,485,742,485));
    body+=labels('shared-note',730,283,228,98,fr?['Un même travail','intégré au projet','commun.']:['The same work','becomes part of','the common project.'],18,C.muted,'middle',400,28);
    body+=labels('process-note',24,598,952,64,fr?['La ville décrit un passage par le projet commun avant le retour dans sa propre version.','Ce circuit retrace la période d’utilisation municipale de LibreOffice dans LiMux.']:['The city describes work passing through the common project before returning to its own version.','This process relates to the historical use of LibreOffice within LiMux.'],18,C.muted,'start',400,28);
    body+=labels('upstream-source',24,675,952,34,[fr?'Source : Munich Open Source, page « LibreOffice » · Schéma historique du circuit de contribution':'Source: Munich Open Source, “LibreOffice” page · Historical contribution process'],13,C.muted,'start');
  } else {
    body+=node('municipality',32,219,336,152,C.surface,C['line-strong']);
    body+=labels('city-heading',40,228,320,41,['MUNICH'],19,C.paper,'start',700);
    body+=labels('contribution-label',40,277,320,82,fr?['Corrections de bugs et fonctionnalités','Contributions municipales']:['Bug fixes and features','Municipal contributions'],17,C.paper,'middle',500,28);
    body+=`<g data-node="contribution"/>`;
    body+=edge('contribute-upstream',arrow(200,379,200,447));
    body+=labels('first',213,389,155,42,[fr?'D’ABORD':'FIRST'],14,C.signal,'start',700);
    body+=node('common-project',32,458,336,528,C.surface,C['line-strong']);
    body+=labels('project-heading',40,472,320,65,['THE DOCUMENT','FOUNDATION'],18,C.signal,'middle',700,26);
    body+=node('main-branch',64,558,272,91);
    body+=labels('main-branch-label',72,568,256,77,fr?['Branche principale','de LibreOffice']:['LibreOffice','main branch'],21,C.signal,'middle',700,29);
    body+=edge('main-to-qa',arrow(200,657,200,687));
    body+=node('quality-assurance',64,697,272,106);
    body+=labels('qa-label',72,707,256,87,fr?['Assurance qualité chez TDF','Validation']:['Quality assurance at TDF','Approval'],18,C.paper,'middle',700,31);
    body+=edge('shared-contribution',arrow(200,811,200,845));
    body+=node('shared-benefit',64,855,272,105);
    body+=labels('shared-benefit-label',72,868,256,84,fr?['Contributions intégrées','à LibreOffice partagé']:['Contributions included','in shared LibreOffice'],18,C.signal,'middle',500,30);
    body+=edge('approved-local-port',path('M64 750 L16 750 L16 1172 L56 1172',C.signal)+arrow(40,1172,56,1172));
    body+=labels('after-approval',32,1022,336,61,fr?['APRÈS VALIDATION','Retour vers la version municipale']:['AFTER APPROVAL','Back to the municipal version'],15,C.signal,'middle',700,25);
    body+=node('local-version',64,1110,304,118);
    body+=labels('local-version-label',72,1121,288,91,fr?['MUNICH','Version municipale','de LibreOffice']:['MUNICH','Municipal version','of LibreOffice'],18,C.paper,'middle',700,28);
    body+=labels('process-note',24,1260,352,101,fr?['Circuit historique décrit par la ville.','Usage de LibreOffice dans LiMux','jusqu’à fin 2023.']:['Historical process described by the city.','LibreOffice was used within LiMux','through the end of 2023.'],15,C.muted,'start',400,27);
    body+=labels('upstream-source',24,1380,352,65,fr?['Source : Munich Open Source,','page « LibreOffice ».']:['Source: Munich Open Source,','“LibreOffice” page.'],13,C.muted,'start',400,24);
  }
  return shell(`microsoft-migration-practice-upstream-${lang}-${mobile?'mobile':'desktop'}`,width,mobile?1460:720,title.join(' '),fr?'Circuit historique de contribution décrit par Munich, où LibreOffice était utilisé au sein de LiMux jusqu’à fin 2023. Les corrections et fonctions municipales étaient d’abord proposées dans la branche principale LibreOffice de The Document Foundation, puis passaient son assurance qualité. Après validation, elles étaient portées dans la version municipale. Elles bénéficient également au LibreOffice partagé. Ce schéma ne décrit pas le parc informatique actuel de Munich.':'Historical contribution process described by Munich, where LibreOffice was used within LiMux through the end of 2023. Municipal fixes and features first entered The Document Foundation LibreOffice main branch, then underwent its quality assurance. After approval, they were ported to the municipal version. The contributions also benefit shared LibreOffice. This diagram does not describe Munich’s current IT estate.',body);
}

export function microsoftMigrationPracticeSvg(lang='fr',kind='qualification',mobile=false) {
  if(!['fr','en'].includes(lang))throw new RangeError('Unknown Microsoft-migration-practice figure language');
  if(!['qualification','upstream'].includes(kind))throw new RangeError('Unknown Microsoft-migration-practice figure kind');
  if(typeof mobile!=='boolean')throw new TypeError('Microsoft-migration-practice mobile flag must be boolean');
  return kind==='qualification'?qualification(lang,mobile):upstream(lang,mobile);
}
