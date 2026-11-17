import { replayActors, replayChapters, replaySources } from './crisis-replay.ts';
import { svbActors, svbChapters, svbSources } from './crisis-svb.ts';
import { terraActors, terraChapters, terraSources } from './crisis-terra.ts';
import { aigActors, aigChapters, aigSources } from './crisis-aig.ts';
export type ReplayEpisodeId = 'gilts' | 'svb' | 'terra' | 'aig';
export const replayEpisodes = {
  gilts: {
    id:'gilts',number:'01',frHref:'/outils/replay-crises/gilts/',enHref:'/en/tools/crisis-replay/gilts/',initialChapter:3,checkedAt:'2026-11-16',
    chapters:replayChapters,sources:replaySources,actors:replayActors,
    country:{fr:'ROYAUME-UNI',en:'UNITED KINGDOM'},place:{fr:'Londres',en:'London'},period:{fr:'Septembre 2022 → janvier 2023',en:'September 2022 → January 2023'},
    title:{fr:'La spirale des gilts.',en:'The gilt spiral.'},subtitle:{fr:'Rejouer la crise de 2022.',en:'Replay the 2022 crisis.'},
    deck:{fr:'Une obligation d’État. Des retraites à couvrir. Du cash à trouver en urgence. Suivez la chaîne qui conduit la Banque d’Angleterre à intervenir.',en:'Government bonds. Pension hedges. An urgent demand for cash. Follow the chain that brought the Bank of England into the market.'},
    label:{fr:'Crise des gilts et des fonds LDI',en:'The gilt and LDI crisis'},themes:{fr:'Obligations · levier · liquidité',en:'Bonds · leverage · liquidity'},
    rangeStart:{fr:'SEPT. 2022',en:'SEP 2022'},rangeEnd:{fr:'JANV. 2023',en:'JAN 2023'},
    actorSource:'S10',actorSourceLabel:{fr:'Analyse rétrospective · BoE, 13 déc. 2022',en:'Retrospective analysis · BoE, 13 Dec 2022'},
  },
  svb:{
    id:'svb',number:'02',frHref:'/outils/replay-crises/svb/',enHref:'/en/tools/crisis-replay/svb/',initialChapter:1,checkedAt:'2026-11-16',
    chapters:svbChapters,sources:svbSources,actors:svbActors,
    country:{fr:'ÉTATS-UNIS',en:'UNITED STATES'},place:{fr:'Santa Clara',en:'Santa Clara'},period:{fr:'Mars → avril 2023',en:'March → April 2023'},
    title:{fr:'SVB. La fuite des dépôts.',en:'SVB. The deposit flight.'},subtitle:{fr:'Rejouer la faillite de 2023.',en:'Replay the 2023 bank failure.'},
    deck:{fr:'Des titres longs au bilan, des dépôts disponibles à vue. Une annonce de pertes, puis la fermeture. Suivez la ruée sur les dépôts, ou bank run, et les réponses de la FDIC et de la Fed.',en:'Long-duration securities. Deposits withdrawable on demand. A loss announcement, followed by closure. Explore the bank run and the responses of the FDIC and the Fed.'},
    label:{fr:'Silicon Valley Bank, mars 2023',en:'Silicon Valley Bank, March 2023'},themes:{fr:'Bilan · dépôts · résolution',en:'Balance sheet · deposits · resolution'},
    rangeStart:{fr:'MARS 2023',en:'MAR 2023'},rangeEnd:{fr:'AVRIL 2023',en:'APR 2023'},
    actorSource:'V08',actorSourceLabel:{fr:'Analyse rétrospective · Fed, 28 avril 2023',en:'Retrospective analysis · Fed, 28 April 2023'},
  },
  terra:{
    id:'terra',number:'03',frHref:'/outils/replay-crises/terra-luna/',enHref:'/en/tools/crisis-replay/terra-luna/',initialChapter:1,checkedAt:'2026-11-16',
    chapters:terraChapters,sources:terraSources,actors:terraActors,
    country:{fr:'CRYPTOACTIFS',en:'CRYPTOASSETS'},place:{fr:'Terra',en:'Terra'},period:{fr:'Mai → juin 2022',en:'May → June 2022'},
    title:{fr:'Terra / Luna. La spirale.',en:'Terra / Luna. The spiral.'},subtitle:{fr:'Rejouer la rupture de 2022.',en:'Replay the 2022 collapse.'},
    deck:{fr:'Un stablecoin vise le dollar. Sa conversion crée un autre jeton. Quand les sorties s’accélèrent, le mécanisme de stabilisation alimente la dilution. Explorez la boucle UST/LUNA et les tentatives de soutien.',en:'A stablecoin targets the dollar. Its conversion creates another token. As holders rush to exit, the stabilisation mechanism fuels dilution. Explore the UST/LUNA loop and the attempts to support it.'},
    label:{fr:'Terra / Luna, mai 2022',en:'Terra / Luna, May 2022'},themes:{fr:'Parité · conversion · dilution',en:'Peg · conversion · dilution'},
    rangeStart:{fr:'MAI 2022',en:'MAY 2022'},rangeEnd:{fr:'JUIN 2022',en:'JUN 2022'},
    actorSource:'T07',actorSourceLabel:{fr:'Analyse rétrospective · BRI, 21 juin 2022',en:'Retrospective analysis · BIS, 21 June 2022'},
  },
  aig:{
    id:'aig',number:'04',frHref:'/outils/replay-crises/aig/',enHref:'/en/tools/crisis-replay/aig/',initialChapter:2,checkedAt:'2026-11-17',
    chapters:aigChapters,sources:aigSources,actors:aigActors,
    country:{fr:'ÉTATS-UNIS',en:'UNITED STATES'},place:{fr:'New York',en:'New York'},period:{fr:'Septembre 2008 → mai 2010',en:'September 2008 → May 2010'},
    title:{fr:'AIG. Le cash manque.',en:'AIG. Cash runs short.'},subtitle:{fr:'Rejouer le sauvetage de 2008.',en:'Replay the 2008 rescue.'},
    deck:{fr:'Des garanties à fournir sur les dérivés de crédit. Du cash à restituer sur les prêts de titres. Deux circuits sollicitent le groupe AIG. Suivez les interventions, les achats d’actifs et l’examen de leurs conditions.',en:'Collateral demanded on credit derivatives. Cash to return on securities loans. Two channels put pressure on AIG. Follow the interventions, asset purchases and scrutiny of their terms.'},
    label:{fr:'AIG, la crise de liquidité de 2008',en:'AIG’s 2008 liquidity crisis'},themes:{fr:'CDS · prêt de titres · soutien public',en:'CDS · securities lending · public support'},
    rangeStart:{fr:'SEPT. 2008',en:'SEP 2008'},rangeEnd:{fr:'MAI 2010',en:'MAY 2010'},
    actorSource:'A07',actorSourceLabel:{fr:'Témoignage rétrospectif · Fed, 26 mai 2010',en:'Retrospective testimony · Fed, 26 May 2010'},
  },
} as const;
export function getReplayEpisode(id: ReplayEpisodeId = 'gilts') { return replayEpisodes[id]; }
