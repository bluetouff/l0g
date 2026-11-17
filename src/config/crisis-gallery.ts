import { replayEpisodes, type ReplayEpisodeId } from '../data/crisis-episodes.ts';
import type { ReplayLanguage } from '../data/crisis-replay.ts';

type Copy = Record<ReplayLanguage, string>;
export const crisisGallery: Record<ReplayEpisodeId, {
  art: string; name: Copy; mechanism: Copy; summary: Copy; alt: Copy; ogTitle: Record<ReplayLanguage, string[]>;
}> = {
  gilts: {
    art:'gilts', name:{fr:'La spirale des gilts',en:'The gilt spiral'},
    mechanism:{fr:'Appels de marge · levier',en:'Margin calls · leverage'},
    summary:{fr:'Des fonds de retraite cherchent du cash. Les ventes d’obligations alimentent les tensions qui poussent la Banque d’Angleterre à intervenir.',en:'Pension funds need cash. Bond sales intensify the strains that bring the Bank of England into the market.'},
    alt:{fr:'Illustration conceptuelle : de fines plaques d’ivoire basculent en chaîne, retenues par un appui turquoise.',en:'Conceptual illustration: thin ivory slabs tilt in a chain, caught by a turquoise support.'},
    ogTitle:{fr:['La spirale','des gilts.'],en:['The gilt','spiral.']},
  },
  svb: {
    art:'svb', name:{fr:'SVB. La fuite des dépôts',en:'SVB. The deposit flight'},
    mechanism:{fr:'Bilan · dépôts · résolution',en:'Balance sheet · deposits · resolution'},
    summary:{fr:'Des titres longs financés par des dépôts à vue. Une annonce de pertes, une ruée sur les fonds, puis la fermeture de Silicon Valley Bank.',en:'Long-duration securities funded by withdrawable deposits. A loss announcement, a run on funds and the closure of Silicon Valley Bank.'},
    alt:{fr:'Illustration conceptuelle : un bâtiment bancaire translucide laisse échapper un flux turquoise par sa base.',en:'Conceptual illustration: a translucent bank building releases a turquoise flow from its base.'},
    ogTitle:{fr:['SVB.','La fuite','des dépôts.'],en:['SVB.','The deposit','flight.']},
  },
  terra: {
    art:'terra-luna', name:{fr:'Terra / Luna. La spirale',en:'Terra / Luna. The spiral'},
    mechanism:{fr:'Parité · conversion · dilution',en:'Peg · conversion · dilution'},
    summary:{fr:'La conversion des UST crée des LUNA. Quand la confiance disparaît, le mécanisme de stabilisation devient une source de dilution.',en:'Converting UST creates LUNA. As confidence disappears, the stabilisation mechanism becomes a source of dilution.'},
    alt:{fr:'Illustration conceptuelle : deux anneaux imbriqués se désassemblent en une spirale de fragments de céramique et de cuivre.',en:'Conceptual illustration: two interlocking rings unravel into a spiral of ceramic and copper fragments.'},
    ogTitle:{fr:['Terra / Luna.','La spirale.'],en:['Terra / Luna.','The spiral.']},
  },
  aig: {
    art:'aig', name:{fr:'AIG. Le cash manque',en:'AIG. Cash runs short'},
    mechanism:{fr:'CDS · prêt de titres · soutien public',en:'CDS · securities lending · public support'},
    summary:{fr:'Des garanties à fournir et du cash à restituer. Deux circuits de liquidité mettent AIG sous pression, avant les achats d’actifs de Maiden Lane.',en:'Collateral to post and cash to return. Two liquidity channels put AIG under pressure before the Maiden Lane asset purchases.'},
    alt:{fr:'Illustration conceptuelle : une structure de verre distribue deux flux distincts, soutenus par deux ponts de cuivre et de lumière turquoise.',en:'Conceptual illustration: a glass structure distributes two distinct flows, supported by copper and turquoise bridges.'},
    ogTitle:{fr:['AIG.','Le cash manque.'],en:['AIG.','Cash runs short.']},
  },
};

export function getCrisisGallery(lang: ReplayLanguage) {
  return Object.values(replayEpisodes).map(episode=>({
    ...crisisGallery[episode.id], id:episode.id, number:episode.number,
    href:lang==='fr'?episode.frHref:episode.enHref, period:episode.period[lang],
    chapters:episode.chapters.length, documents:episode.sources.length,
  }));
}

export const crisisCollection = {
  fr:{title:'Replay des crises',description:'Explorez les crises des gilts, de SVB, de Terra / Luna et d’AIG. Des replays interactifs, des annonces datées et des documents primaires pour suivre les mécanismes de transmission.',ogTitle:['Replay','des crises.']},
  en:{title:'Crisis replay',description:'Explore the gilt, SVB, Terra / Luna and AIG crises through interactive replays, dated announcements and primary documents tracing the mechanisms of financial stress.',ogTitle:['Crisis','replay.']},
};
