import { getReplayEpisode, type ReplayEpisodeId } from './crisis-episodes.ts';
import type { ReplayLanguage } from './crisis-replay';

export type NetworkEpisodeId = 'lehman' | 'asia' | 'nickel' | 'chf';
type Copy = Record<ReplayLanguage,string>;
type Icon = 'tower'|'fund'|'people'|'paper'|'bank'|'shield'|'globe'|'factory'|'chain'|'gate'|'rates'|'arrows';
interface Node { id:string; x:number; y:number; mx:number; my:number; icon:Icon; }
export interface NetworkLink {
  id:string; from:string; to:string; source:string; since:string; until?:string;
  kind:'pressure'|'exposure'|'response'|'commitment';
  d:string; m:string; label:Copy; x:number; y:number; mx:number; my:number;
}
interface Network { nodes:Node[]; links:NetworkLink[]; note:Copy; method:Copy; related:{frHref:string;enHref:string;label:Copy}; }
const copy=(fr:string,en:string):Copy=>({fr,en});

export const crisisNetworks: Record<NetworkEpisodeId,Network> = {
  lehman:{
    related:{frHref:'/guides/lire-les-fonds-monetaires/',enHref:'/en/guides/read-money-market-funds/',label:copy('Lire les fonds monétaires','Understanding money market funds')},
    nodes:[
      {id:'lehman',x:100,y:60,mx:90,my:60,icon:'tower'},
      {id:'funds',x:320,y:60,mx:270,my:60,icon:'fund'},
      {id:'investors',x:540,y:60,mx:90,my:225,icon:'people'},
      {id:'credit',x:100,y:300,mx:270,my:225,icon:'paper'},
      {id:'banks',x:320,y:300,mx:270,my:390,icon:'bank'},
      {id:'treasury',x:540,y:300,mx:90,my:390,icon:'shield'},
    ],
    links:[
      {id:'mmf-loss',from:'lehman',to:'funds',source:'M02',since:'2008-09-16',kind:'pressure',d:'M178 60H242',m:'M154 60H206',label:copy('perte','loss'),x:210,y:43,mx:180,my:43},
      {id:'mmf-redemptions',from:'funds',to:'investors',source:'M02',since:'2008-09-16',kind:'pressure',d:'M398 60H462',m:'M248 96L112 189',label:copy('rachats','cash'),x:430,y:43,mx:175,my:143},
      {id:'mmf-contagion',from:'funds',to:'credit',source:'M07',since:'2008-09-16',kind:'pressure',d:'M296 96C270 174 100 178 100 264',m:'M270 96V189',label:copy('crédit','credit'),x:165,y:183,mx:308,my:147},
      {id:'mmf-amlf',from:'banks',to:'funds',source:'M03',since:'2008-09-19',kind:'response',d:'M320 264V96',m:'M338 390C342 385 342 362 342 340V110Q342 75 338 60',label:copy('achats d’ABCP','ABCP purchases'),x:374,y:207,mx:285,my:318},
      {id:'mmf-guarantee',from:'treasury',to:'investors',source:'M04',since:'2008-09-19',kind:'commitment',d:'M540 264V96',m:'M90 354V261',label:copy('garantie','guarantee'),x:583,y:185,mx:66,my:316},
    ],
    note:copy('Le cash des achats d’ABCP passe par des emprunteurs bancaires. La garantie du Trésor vise les fonds éligibles adhérents et les avoirs de référence.','Cash from ABCP purchases runs through banking borrowers. Treasury’s guarantee covers eligible participating funds and reference holdings.'),
    method:copy('Le Reserve Primary Fund est le point d’entrée du récit. Le nœud des fonds représente ensuite un secteur composé de fonds différents. La garantie ne doit pas être lue comme une protection du Reserve Primary Fund : elle concerne les fonds éligibles adhérents et les avoirs de référence. L’AMLF finance des achats de certains ABCP par des emprunteurs bancaires éligibles. Les deux étapes du 19 septembre distinguent les instruments, sans imposer un ordre horaire. La contagion au crédit court est éclairée par l’audition de la SEC de juin 2012.','Reserve Primary Fund is the narrative’s starting point. The fund node then represents a sector containing different funds. The guarantee is not a depiction of protection for Reserve Primary Fund: it concerns eligible participating funds and reference holdings. The AMLF finances purchases of qualifying ABCP by eligible banking borrowers. The two 19 September steps separate instruments without imposing an intraday order. Short-term credit contagion draws on the SEC’s June 2012 testimony.'),
  },
  asia:{
    related:{frHref:'/outils/replay-crises/ltcm/',enHref:'/en/tools/crisis-replay/ltcm/',label:copy('LTCM et ses contreparties','LTCM and its counterparties')},
    nodes:[
      {id:'creditors',x:320,y:45,mx:90,my:60,icon:'globe'},
      {id:'thailand',x:100,y:170,mx:90,my:225,icon:'bank'},
      {id:'indonesia',x:320,y:170,mx:270,my:225,icon:'factory'},
      {id:'korea',x:540,y:170,mx:270,my:390,icon:'bank'},
      {id:'balance',x:100,y:310,mx:90,my:390,icon:'chain'},
      {id:'imf',x:540,y:310,mx:270,my:60,icon:'globe'},
    ],
    links:[
      {id:'asia-thai-credit',from:'creditors',to:'thailand',source:'E08',since:'1997-07-02',kind:'pressure',d:'M242 45C145 45 100 84 100 134',m:'M90 96V189',label:copy('crédit','credit'),x:132,y:101,mx:56,my:146},
      {id:'asia-indo-credit',from:'creditors',to:'indonesia',source:'E03',since:'1997-11-05',kind:'pressure',d:'M320 81V134',m:'M112 96L248 189',label:copy('crédit','credit'),x:358,y:113,mx:180,my:142},
      {id:'asia-korea-credit',from:'creditors',to:'korea',source:'E07',since:'1997-12-04',kind:'pressure',d:'M398 45C495 45 540 84 540 134',m:'M112 96C180 160 180 310 248 354',label:copy('crédit','credit'),x:508,y:101,mx:180,my:340},
      {id:'asia-fx-debt',from:'indonesia',to:'balance',source:'E03',since:'1997-11-05',kind:'pressure',d:'M296 206C270 260 200 268 178 300',m:'M248 261L112 354',label:copy('change','FX debt'),x:237,y:253,mx:182,my:312},
      {id:'asia-thai-program',from:'imf',to:'thailand',source:'E02',since:'1997-08-20',kind:'response',d:'M462 310H220Q185 310 185 260V225Q185 214 160 206',m:'M248 96L112 189',label:copy('accord','deal'),x:320,y:333,mx:180,my:174},
      {id:'asia-indo-program',from:'imf',to:'indonesia',source:'E03',since:'1997-11-05',kind:'response',d:'M462 290C400 280 350 249 337 206',m:'M270 96V189',label:copy('accord','deal'),x:409,y:252,mx:306,my:146},
      {id:'asia-korea-program',from:'imf',to:'korea',source:'E04',since:'1997-12-04',kind:'response',d:'M540 274V206',m:'M338 60Q342 60 342 108V345Q342 390 338 390',label:copy('accord','deal'),x:584,y:245,mx:300,my:318},
    ],
    note:copy('Trois parcours nationaux. Les liens de financement deviennent documentés à des dates différentes. La branche de dette en devises illustre le risque exposé pour l’Indonésie.','Three country paths. Funding relationships become documented on different dates. The FX-debt branch illustrates the risk described for Indonesia.'),
    method:copy('La sélection suit la Thaïlande, l’Indonésie et la Corée. Elle ne couvre pas tous les pays touchés. Les liens avec des créanciers communs expliquent un canal de propagation, sans attribuer une cause unique à chaque crise nationale. La branche des bilans illustre une dette en devises non couverte, sans agréger les dettes des trois pays. Les flèches vertes indiquent des accords de financement, avec des conditions et des décaissements propres. Le bilan comparé du FMI est une évaluation de ses programmes. L’édition de l’Occasional Paper est référencée en juin 1999 ; un premier examen avait déjà été présenté publiquement en janvier 1999.','The selection follows Thailand, Indonesia and Korea rather than every affected country. Links to common creditors explain a transmission channel without assigning a single cause to each country’s crisis. The balance-sheet branch illustrates unhedged foreign-currency debt without aggregating the three countries’ debts. Green arrows indicate financing arrangements with their own conditions and disbursements. The IMF’s comparative review evaluates its own programs. The Occasional Paper edition is referenced to June 1999; an initial review had already been publicly presented in January 1999.'),
  },
  nickel:{
    related:{frHref:'/outils/replay-crises/gilts/',enHref:'/en/tools/crisis-replay/gilts/',label:copy('Les appels de marge des fonds LDI','Margin calls in the LDI crisis')},
    nodes:[
      {id:'shorts',x:100,y:60,mx:90,my:60,icon:'arrows'},
      {id:'market',x:320,y:60,mx:270,my:60,icon:'factory'},
      {id:'margins',x:540,y:60,mx:270,my:225,icon:'paper'},
      {id:'members',x:100,y:300,mx:90,my:225,icon:'bank'},
      {id:'clearing',x:540,y:300,mx:270,my:390,icon:'shield'},
      {id:'exchange',x:320,y:300,mx:90,my:390,icon:'gate'},
    ],
    links:[
      {id:'nickel-cover',from:'shorts',to:'market',source:'N06',since:'2022-03-08',kind:'pressure',d:'M178 60H242',m:'M154 60H206',label:copy('achat','buy'),x:210,y:43,mx:180,my:43},
      {id:'nickel-margin',from:'market',to:'margins',source:'N03',since:'2022-03-08',kind:'pressure',d:'M398 60H462',m:'M270 96V189',label:copy('marges','margin'),x:430,y:43,mx:308,my:146},
      {id:'nickel-client',from:'margins',to:'members',source:'N06',since:'2022-03-08',kind:'pressure',d:'M515 96C450 190 175 160 125 264',m:'M206 225H154',label:copy('cash','cash'),x:320,y:176,mx:180,my:206},
      {id:'nickel-close',from:'members',to:'shorts',source:'N06',since:'2022-03-08',kind:'pressure',d:'M100 264V96',m:'M90 189V96',label:copy('réduction','close-out'),x:57,y:186,mx:53,my:150},
      {id:'nickel-clearing',from:'clearing',to:'margins',source:'N03',since:'2022-03-08',kind:'exposure',d:'M540 264V96',m:'M270 354V261',label:copy('garanties','collateral'),x:583,y:185,mx:305,my:312},
      {id:'nickel-rules',from:'exchange',to:'market',source:'N01',since:'2022-03-08',kind:'commitment',d:'M320 264V96',m:'M90 354C150 320 190 157 248 96',label:copy('règles','rules'),x:389,y:230,mx:166,my:320},
    ],
    note:copy('La carte conserve les contraintes historiques : positions, garanties et intermédiaires. Les règles de suspension et de reprise se lisent dans le journal.','The map retains historical constraints: positions, collateral and intermediaries. Suspension and reopening rules are set out in the journal.'),
    method:copy('Les heures des avis sont celles de Londres. La suspension et l’annulation du 8 mars sont deux décisions successives. Le 15 mars prépare la reprise du 16, sans reconstituer son déroulement. Les branches ambre ajoutent des mécanismes décrits par la revue publiée en janvier 2023. Cette revue a été commandée par le LME et exclut l’examen de sa gouvernance et de ses décisions. La décision de la FCA de mars 2025 a un périmètre distinct. Le lecteur ne reconstruit aucun cours de nickel ni volume de transactions.','Notice times are London times. Suspension and cancellation on 8 March are successive decisions. The 15 March notice prepares reopening on the 16th without reconstructing its course. Amber branches add mechanisms described by the review published in January 2023. The LME commissioned that review, whose remit excludes its governance and decision-making. The FCA’s March 2025 decision has a distinct scope. The reader reconstructs no nickel price or trading volume.'),
  },
  chf:{
    related:{frHref:'/outils/replay-crises/asie-1997/',enHref:'/en/tools/crisis-replay/asia-1997/',label:copy('La dette en devises en Asie','Foreign-currency debt in Asia')},
    nodes:[
      {id:'snb',x:100,y:60,mx:90,my:60,icon:'bank'},
      {id:'floor',x:320,y:60,mx:270,my:60,icon:'gate'},
      {id:'fx',x:540,y:60,mx:270,my:225,icon:'arrows'},
      {id:'positions',x:540,y:300,mx:270,my:390,icon:'chain'},
      {id:'brokers',x:320,y:300,mx:90,my:390,icon:'people'},
      {id:'policy',x:100,y:300,mx:90,my:225,icon:'rates'},
    ],
    links:[
      {id:'chf-floor',from:'snb',to:'floor',source:'C01',since:'2011-09-06',until:'2015-01-15',kind:'commitment',d:'M178 60H242',m:'M154 60H206',label:copy('appui','rule'),x:210,y:43,mx:180,my:43},
      {id:'chf-rule',from:'floor',to:'fx',source:'C01',since:'2011-09-06',until:'2015-01-15',kind:'commitment',d:'M398 60H462',m:'M270 96V189',label:copy('plancher','floor'),x:430,y:43,mx:305,my:145},
      {id:'chf-negative',from:'snb',to:'policy',source:'C02',since:'2014-12-18',kind:'commitment',d:'M100 96V264',m:'M90 96V189',label:copy('annonce','rate'),x:53,y:185,mx:50,my:147},
      {id:'chf-intervention',from:'snb',to:'fx',source:'C03',since:'2015-01-15',kind:'commitment',d:'M125 96C220 195 445 195 515 96',m:'M112 96L248 189',label:copy('interventions possibles','possible interventions'),x:320,y:173,mx:180,my:147},
      {id:'chf-exposure',from:'fx',to:'positions',source:'C07',since:'2015-01-15',kind:'pressure',d:'M540 96V264',m:'M270 261V354',label:copy('pertes','losses'),x:587,y:185,mx:307,my:313},
      {id:'chf-brokers',from:'positions',to:'brokers',source:'C07',since:'2015-01-15',kind:'pressure',d:'M462 300H398',m:'M248 354C222 314 138 314 112 354',label:copy('risque','risk'),x:430,y:283,mx:180,my:317},
    ],
    note:copy('Le trait du plancher s’éteint le 15 janvier. Les interventions de change restent possibles. Les taux négatifs sont annoncés en décembre pour une application en janvier.','The minimum-rate link switches off on 15 January. FX interventions remain possible. Negative interest is announced in December for implementation in January.'),
    method:copy('La frise ouvre sur l’installation du plancher en 2011, puis se concentre sur décembre 2014 et le retrait de janvier 2015. Une annonce de taux et sa date d’application sont distinguées : le prélèvement des intérêts négatifs est prévu à partir du 22 janvier. Le retrait du plancher n’éteint pas la possibilité d’intervenir sur le change. Les pertes et contraintes des courtiers apparaissent en ambre avec l’étude de la BRI publiée le 11 décembre 2016. Les arguments sur le coût de la défense du plancher sont attribués à la BNS. Aucun cours ni rendement de portefeuille n’est simulé.','The timeline opens with introduction of the minimum rate in 2011, then focuses on December 2014 and withdrawal in January 2015. Rate announcements and effective dates are distinguished: negative interest is scheduled to be charged from 22 January. Ending the minimum rate does not remove the option of FX intervention. Broker losses and constraints appear in amber using the BIS study published on 11 December 2016. Arguments about the cost of defending the minimum rate are attributed to the SNB. No exchange rate or portfolio return is simulated.'),
  },
};

export function isNetworkEpisode(id:string): id is NetworkEpisodeId {
  return Object.hasOwn(crisisNetworks,id);
}

/** Visibility is source-dated. Hindsight may explain past events, never activate future responses. */
export function networkMapState(id:ReplayEpisodeId,date:string,mode:'announcements'|'hindsight') {
  if (!isNetworkEpisode(id)) return null;
  const network=crisisNetworks[id];
  const sources=getReplayEpisode(id).sources;
  const links=network.links.map(link=>{
    const source=sources.find(source=>source.id===link.source);
    if (!source) throw new Error(`Missing network source: ${link.source}`);
    const available=source.published<=date;
    const occurred=link.since<=date&&(!link.until||date<link.until);
    const active=occurred&&(available||mode==='hindsight');
    return {id:link.id,active,retrospective:active&&!available};
  });
  let note=network.note;
  if (id==='lehman'&&date<'2008-09-19') note=date<'2008-09-16'
    ? copy('La faillite de la holding constitue le point d’entrée. Les liens grisés servent de repères de lecture.','The holding company’s bankruptcy is the starting point. Grey links provide structural context.')
    : copy('Le Reserve annonce une perte et un délai de versement des rachats. Les circuits de soutien grisés sont documentés aux étapes suivantes.','Reserve announces a loss and delayed redemption payments. Grey support channels are documented in subsequent stages.');
  if (id==='chf') note=date<'2014-12-18'
    ? copy('La BNS annonce qu’elle défendra le cours plancher par des achats de devises. Les autres branches sont des repères de lecture.','The SNB announces that it will enforce the minimum rate through foreign-currency purchases. Other branches provide structural context.')
    : date<'2015-01-15'
      ? copy('Le plancher est réaffirmé. La BNS annonce des taux négatifs à partir du 22 janvier, au-delà des seuils d’exemption.','The minimum rate is reaffirmed. The SNB announces negative interest from 22 January on balances above exemption thresholds.')
      : copy('Le cours plancher est retiré. La BNS annonce un taux plus bas et conserve la possibilité d’intervenir sur le change.','The minimum rate is removed. The SNB announces a lower interest rate and retains the option of FX intervention.');
  return {links,retrospective:links.some(link=>link.retrospective),floor:id==='chf'&&date<'2015-01-15',suspended:id==='nickel'&&date<'2022-03-16',note};
}
