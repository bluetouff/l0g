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
    +labels('subtitle',24,mobile?141:116,width-48,mobile?63:40,mobile?subtitle:[subtitle.join(' ')],mobile?15:18,C.muted,'start',400,mobile?23:26);
}

// Current Microsoft terms reviewed 9 October 2026. This diagram is scoped to
// shared infrastructure and eligible licences with active SA or subscription.
export const CLOUD_RIGHTS_SCOPE = Object.freeze({ reviewedOn:'2026-10-09',infrastructure:'shared',coverage:'active-sa-or-eligible-subscription',historicalDedicatedRights:false });
export const CMA_COMPARISON_SCOPE = Object.freeze({ year:2024,geography:'Azure UK',minimumAnnualAzureSpendUSD:10000,windows:'AHB',sql:'PAYG-IaaS',adjustment:'utilisation',supplierCost:'hypothetical-SPLA',azureSpend:'licensing-IP-net-of-discounts' });

export function microsoftCloudLicensingSvg(lang='fr',kind='rights',mobile=false) {
  if(!['fr','en'].includes(lang))throw new RangeError('Unknown Microsoft-cloud-licensing figure language');
  if(!['rights','comparison'].includes(kind))throw new RangeError('Unknown Microsoft-cloud-licensing figure kind');
  if(typeof mobile!=='boolean')throw new TypeError('Microsoft-cloud-licensing mobile flag must be boolean');
  const fr=lang==='fr',width=mobile?400:1000,id=`microsoft-cloud-licensing-${kind}-${lang}-${mobile?'mobile':'desktop'}`;
  if(kind==='rights') {
    const title=fr?['Deux logiciels,','trois voies cloud']:['Two products,','three cloud routes'];
    const subtitle=fr?['Exemple de service utilisant SQL Server','et Windows Server, sur matériel mutualisé.']:['Example service using SQL Server','and Windows Server, on shared hardware.'];
    let body=heading(mobile,fr?'DROITS DE DÉPLOIEMENT':'DEPLOYMENT RIGHTS',title,subtitle);
    const appX=mobile?72:345,appY=mobile?221:173,appW=mobile?256:310;
    body+=`<g data-service="two-product-workload">${rect(appX,appY,appW,135,C.surface,12,C['line-strong'],1.5)}</g>`;
    body+=labels('service-heading',appX+8,appY+7,appW-16,38,[fr?'Service métier':'Business service'],20,C.paper,'middle',700);
    for(const [i,name]of ['SQL Server','Windows Server'].entries()) {
      const y=appY+51+i*38;
      body+=`<g data-layer="${i===0?'sql':'windows'}">${rect(appX+16,y,appW-32,31,C['surface-2'],4)}</g>`;
      body+=labels(`source-product-${i}`,appX+23,y-2,appW-46,35,[name],16,i===0?C.signal:C.paper,'middle',700);
    }
    const xs=mobile?[54,54,54]:[32,354,676],ys=mobile?[400,607,814]:[353,353,353],panelW=mobile?314:292,panelH=mobile?168:167;
    if(mobile) {
      for(const [layer,color]of [[0,C.signal],[1,C.paper]]) {
        const x=20+layer*10,joinY=379+layer*11,originX=193+layer*14;
        body+=`<g data-flow-layer="${layer===0?'sql':'windows'}">`+line(originX,364,originX,joinY,color,1.5)+line(x,joinY,originX,joinY,color,1.5)+line(x,joinY,x,ys[2]+111+layer*38,color,1.5);
        for(const y of ys)body+=arrow(x,y+111+layer*38,46,y+111+layer*38,color);
        body+='</g>';
      }
    } else {
      for(const [layer,color]of [[0,C.signal],[1,C.paper]]) {
        const offset=layer===0?-7:7,joinY=321+layer*11;
        body+=`<g data-flow-layer="${layer===0?'sql':'windows'}">`+line(500+offset,316,500+offset,joinY,color,1.5)+line(178+offset,joinY,822+offset,joinY,color,1.5);
        for(const x of [178,500,822])body+=arrow(x+offset,joinY,x+offset,345,color);
        body+='</g>';
      }
    }
    const routes=[
      {key:'azure',name:'Azure',mechanism:'Azure Hybrid Benefit',sql:fr?'Licence SQL éligible':'Eligible SQL licence',windows:fr?'Licence Windows éligible':'Eligible Windows licence',note:fr?'Réutiliser les licences éligibles':'Use eligible existing licences'},
      {key:'outsourcer',name:fr?'Hébergeur autorisé':'Authorized Outsourcer',mechanism:'Flexible Virtualization Benefit',sql:fr?'Licence SQL éligible':'Eligible SQL licence',windows:fr?'Licence Windows éligible':'Eligible Windows licence',note:fr?'Hors Listed Providers et leur cloud':'Outside Listed Providers’ clouds'},
      {key:'listed',name:'AWS / Google',mechanism:fr?'Partenaire de mobilité qualifié':'Qualified Mobility Partner',sql:fr?'SQL : License Mobility':'SQL: License Mobility',windows:fr?'Windows fourni par l’hébergeur':'Windows supplied by the host',note:fr?'SQL : éligibilité et formulaire':'SQL: eligibility and verification'},
    ];
    for(const [i,r]of routes.entries()) {
      const x=xs[i],y=ys[i];
      body+=`<g data-route="${r.key}">${rect(x,y,panelW,panelH,C.surface,11,C['line-strong'],1)}</g>`;
      body+=labels(`route-${i}`,x+7,y+6,panelW-14,43,[r.name],mobile?21:22,C.paper,'middle',700);
      body+=labels(`mechanism-${i}`,x+4,y+47,panelW-8,35,[r.mechanism],mobile?14:13,C.muted,'middle');
      body+=line(x+14,y+87,x+panelW-14,y+87,C['line-strong'],1);
      body+=rect(x+12,y+96,panelW-24,30,C['surface-2'],4)+rect(x+12,y+134,panelW-24,30,C['surface-2'],4);
      body+=labels(`sql-${i}`,x+10,y+94,panelW-20,34,[r.sql],mobile?16:16,C.signal,'middle',700);
      body+=labels(`windows-${i}`,x+10,y+132,panelW-20,35,[r.windows],mobile?15:15,i===2?C.amber:C.paper,'middle',700);
      body+=labels(`route-note-${i}`,x-8,y+panelH+6,panelW+16,35,[r.note],mobile?13:13,C.muted,'middle');
    }
    const footerY=mobile?1036:578;
    body+=line(32,footerY,width-32,footerY,C['line-strong'],1);
    body+=labels('rights-scope',24,footerY+10,width-48,mobile?111:63,mobile?(fr?['Licences éligibles, avec Software Assurance','ou abonnement actif. Vue simplifiée.','Les droits historiques et le matériel dédié','relèvent de conditions distinctes.']:['Eligible licences with active Software','Assurance or subscription. Simplified view.','Historical rights and dedicated hardware','have separate conditions.']):(fr?['Licences éligibles avec Software Assurance ou abonnement actif. Vue simplifiée.','Les droits historiques et le matériel dédié relèvent de conditions distinctes.']:['Eligible licences with active Software Assurance or subscription. Simplified view.','Historical rights and dedicated hardware have separate conditions.']),mobile?14:16,C.muted,'start',400,23);
    body+=labels('rights-source',24,footerY+(mobile?123:75),width-48,mobile?65:38,mobile?(fr?['Sources : conditions et guides Microsoft,','vérifiés le 9 octobre 2026.']:['Sources: Microsoft terms and guidance,','reviewed 9 October 2026.']):[fr?'Sources : conditions et guides Microsoft, vérifiés le 9 octobre 2026.':'Sources: Microsoft terms and guidance, reviewed 9 October 2026.'],mobile?14:16,C.muted,'start',400,23);
    return shell(id,width,mobile?1248:709,title.join(' '),fr?'Service composé de SQL Server et Windows Server, sur infrastructure partagée, avec licences éligibles et Software Assurance ou abonnement actif. Azure permet de réutiliser des licences éligibles via Azure Hybrid Benefit. Un Authorized Outsourcer hors Listed Providers et leurs infrastructures permet le Flexible Virtualization Benefit pour les deux logiciels. Chez AWS ou Google en tant que partenaire de mobilité qualifié, SQL Server peut relever de License Mobility et Windows Server est fourni par l’hébergeur. Les droits historiques et le matériel dédié sont hors de ce schéma simplifié.':'Service comprising SQL Server and Windows Server on shared infrastructure, with eligible licences and active Software Assurance or subscription. Azure allows eligible licences to be reused through Azure Hybrid Benefit. An Authorized Outsourcer outside Listed Providers and their infrastructure permits Flexible Virtualization Benefit for both products. With AWS or Google as a qualified Mobility Partner, SQL Server can use License Mobility and Windows Server is supplied by the host. Historical rights and dedicated hardware fall outside this simplified diagram.',body);
  }
  const title=fr?['Comparer les licences','à usage constant']:['Comparing licences','at constant usage'];
  const subtitle=fr?['Méthode CMA · Azure au Royaume-Uni · 2024 ·','Windows Server sous AHB · SQL Server en PAYG']:['CMA method · Azure UK · 2024 ·','Windows Server with AHB · SQL Server PAYG'];
  let body=heading(mobile,fr?'PRIX AMONT ET PRIX CLIENT':'INPUT AND CUSTOMER PRICES',title,subtitle);
  const usageX=mobile?40:240,usageY=mobile?223:173,usageW=mobile?320:520;
  body+=`<g data-input="same-azure-usage">${rect(usageX,usageY,usageW,83,C.surface,10,C['line-strong'],1.5)}</g>`;
  body+=labels('usage',usageX+8,usageY+5,usageW-16,42,[fr?'Usage Azure UK · 2024':'Azure UK usage · 2024'],mobile?20:23,C.paper,'middle',700);
  body+=labels('usage-unit',usageX+8,usageY+43,usageW-16,35,[fr?'Heures-cœurs virtuels, ajustées':'vcore-hours adjusted for utilisation'],mobile?14:16,C.muted,'middle');
  const panelXs=mobile?[54,54]:[32,538],panelYs=mobile?[367,570]:[299,299],panelW=mobile?310:430,panelH=mobile?164:166;
  if(mobile) {
    body+=line(200,314,200,341,C.muted,2)+line(20,341,200,341,C.muted,2)+line(20,341,20,632,C.muted,2);
    for(const y of panelYs)body+=arrow(20,y+62,46,y+62,C.signal);
  } else {
    body+=line(500,264,500,274,C.muted,2)+line(247,274,753,274,C.muted,2);
    for(const x of [247,753])body+=arrow(x,274,x,287,C.signal);
  }
  for(let i=0;i<2;i++) {
    const x=panelXs[i],y=panelYs[i],color=i===0?C.amber:C.signal;
    body+=`<g data-comparison="${i===0?'supplier-hypothesis':'azure-customer-spend'}">${rect(x,y,panelW,panelH,C.surface,10,color,1.5)}</g>`;
    body+=labels(`channel-${i}`,x+8,y+7,panelW-16,35,[i===0?'MICROSOFT → AWS / GOOGLE':(fr?'MICROSOFT AZURE → CLIENT':'MICROSOFT AZURE → CUSTOMER')],mobile?13:14,C.muted,'middle',700);
    body+=labels(`operation-${i}`,x+8,y+46,panelW-16,39,[i===0?(fr?'Usage ajusté × prix SPLA':'Adjusted usage × SPLA price'):(fr?'Dépense pour ce même usage':'Spend for the same usage')],mobile?17:21,color,'middle',700);
    body+=line(x+16,y+93,x+panelW-16,y+93,C['line-strong'],1);
    body+=labels(`result-${i}`,x+8,y+101,panelW-16,66,i===0?(fr?['Coût fournisseur','hypothétique']:['Hypothetical','supplier input cost']):(fr?['Dépense client de licence','nette des remises']:['Customer licence spend','net of discounts']),mobile?18:20,C.paper,'middle',700,25);
  }
  if(mobile) {
    body+=line(372,483,383,483,C.amber,2,'5 5')+line(383,483,383,761,C.amber,2,'5 5');
    body+=line(372,689,383,689,C.signal,2)+line(200,761,383,761,C.muted,2)+arrow(200,761,200,785,C.paper);
  } else {
    body+=line(247,473,247,490,C.amber,2,'5 5')+line(247,490,500,490,C.amber,2,'5 5');
    body+=line(753,473,753,490,C.signal,2)+line(500,490,753,490,C.signal,2)+arrow(500,490,500,513,C.paper);
  }
  const resultX=mobile?32:260,resultY=mobile?797:526,resultW=mobile?336:480;
  body+=rect(resultX,resultY,resultW,84,C['surface-2'],10);
  body+=labels('difference-formula',resultX+8,resultY+6,resultW-16,40,[fr?'Coût hypothétique − dépense client':'Hypothetical cost − customer spend'],mobile?16:21,C.paper,'middle',700);
  body+=labels('difference-meaning',resultX+8,resultY+45,resultW-16,35,[fr?'Écart calculé par la CMA':'Difference calculated by the CMA'],mobile?17:19,C.signal,'middle');
  const footerY=mobile?914:636;
  body+=line(32,footerY,width-32,footerY,C['line-strong'],1);
  body+=labels('comparison-scope',24,footerY+9,width-48,mobile?136:64,mobile?(fr?['Périmètre : licences, usage IaaS uniquement.','Clients avec au moins 10 000 $ de dépenses','Azure annuelles. Coût fournisseur reconstruit,','dépense client fournie par Microsoft.','Montants détaillés non publics.']:['Scope: licences, IaaS usage only.','Customers with at least $10,000 in annual','Azure spend. Supplier cost reconstructed;','customer spend reported by Microsoft.','Detailed amounts are not public.']):(fr?['Périmètre : licences IaaS, clients avec au moins 10 000 $ de dépenses Azure annuelles.']:['Scope: IaaS licences, customers with at least $10,000 in annual Azure spend.']),mobile?14:16,C.muted,'start',400,23);
  body+=labels('comparison-source',24,footerY+(mobile?144:49),width-48,mobile?65:40,mobile?(fr?['Source : CMA, annexe T, paragraphes','T.5, T.8, T.25, T.55–65 et T.72 (2025).']:['Source: CMA, Appendix T, paragraphs','T.5, T.8, T.25, T.55–65 and T.72 (2025).']):[fr?'Source : CMA, annexe T, T.5, T.8, T.25, T.55–65 et T.72 (2025). Montants caviardés.':'Source: CMA, Appendix T, T.5, T.8, T.25, T.55–65 and T.72 (2025). Amounts redacted.'],mobile?14:16,C.muted,'start',400,23);
  return shell(id,width,mobile?1148:735,title.join(' '),fr?'Méthode de comparaison de la CMA, données Azure UK 2024. L’usage mesuré en vcore-heures et ajusté pour l’utilisation est valorisé aux prix SPLA facturés par Microsoft à AWS ou Google, pour reconstruire un coût fournisseur hypothétique. Ce coût est comparé à la dépense de licence du client Azure pour le même usage, nette des remises. La différence concerne des prix amont et des prix clients, et non deux factures finales ou le coût interne réel de Microsoft. Périmètre : Windows Server sous Azure Hybrid Benefit, SQL Server PAYG en IaaS, clients dépensant au moins 10 000 dollars par an sur Azure. Les montants détaillés ne sont pas publics.':'CMA comparison methodology using Azure UK data for 2024. Usage in vcore-hours, adjusted for utilisation, is valued at Microsoft’s SPLA prices to AWS or Google to reconstruct a hypothetical supplier input cost. This is compared with the Azure customer’s licence spend for the same usage, net of discounts. The difference concerns upstream and customer-facing prices, not two final customer bills or Microsoft’s actual internal cost. Scope: Windows Server under Azure Hybrid Benefit, SQL Server PAYG IaaS, customers spending at least 10,000 dollars annually on Azure. Detailed amounts are not public.',body);
}
