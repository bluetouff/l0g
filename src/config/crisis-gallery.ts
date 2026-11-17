import { replayEpisodes, type ReplayEpisodeId } from '../data/crisis-episodes.ts';
import type { ReplayLanguage } from '../data/crisis-replay.ts';

type Copy = Record<ReplayLanguage, string>;
export const crisisGallery: Record<ReplayEpisodeId, {
  art: string; name: Copy; shortName?: Copy; mechanism: Copy; summary: Copy; alt: Copy; ogTitle: Record<ReplayLanguage, string[]>;
}> = {
  gilts: {
    art:'gilts', shortName:{fr:'Gilts / LDI',en:'Gilts / LDI'}, name:{fr:'La spirale des gilts',en:'The gilt spiral'},
    mechanism:{fr:'Appels de marge · levier',en:'Margin calls · leverage'},
    summary:{fr:'Des fonds de retraite cherchent du cash. Les ventes d’obligations alimentent les tensions qui poussent la Banque d’Angleterre à intervenir.',en:'Pension funds need cash. Bond sales intensify the strains that bring the Bank of England into the market.'},
    alt:{fr:'Illustration conceptuelle : de fines plaques d’ivoire basculent en chaîne, retenues par un appui turquoise.',en:'Conceptual illustration: thin ivory slabs tilt in a chain, caught by a turquoise support.'},
    ogTitle:{fr:['La spirale','des gilts.'],en:['The gilt','spiral.']},
  },
  svb: {
    art:'svb', shortName:{fr:'SVB',en:'SVB'}, name:{fr:'SVB. La fuite des dépôts',en:'SVB. The deposit flight'},
    mechanism:{fr:'Bilan · dépôts · résolution',en:'Balance sheet · deposits · resolution'},
    summary:{fr:'Des titres longs financés par des dépôts à vue. Une annonce de pertes, une ruée sur les fonds, puis la fermeture de Silicon Valley Bank.',en:'Long-duration securities funded by withdrawable deposits. A loss announcement, a run on funds and the closure of Silicon Valley Bank.'},
    alt:{fr:'Illustration conceptuelle : un bâtiment bancaire translucide laisse échapper un flux turquoise par sa base.',en:'Conceptual illustration: a translucent bank building releases a turquoise flow from its base.'},
    ogTitle:{fr:['SVB.','La fuite','des dépôts.'],en:['SVB.','The deposit','flight.']},
  },
  terra: {
    art:'terra-luna', shortName:{fr:'Terra / Luna',en:'Terra / Luna'}, name:{fr:'Terra / Luna. La spirale',en:'Terra / Luna. The spiral'},
    mechanism:{fr:'Parité · conversion · dilution',en:'Peg · conversion · dilution'},
    summary:{fr:'La conversion des UST crée des LUNA. Quand la confiance disparaît, le mécanisme de stabilisation devient une source de dilution.',en:'Converting UST creates LUNA. As confidence disappears, the stabilisation mechanism becomes a source of dilution.'},
    alt:{fr:'Illustration conceptuelle : deux anneaux imbriqués se désassemblent en une spirale de fragments de céramique et de cuivre.',en:'Conceptual illustration: two interlocking rings unravel into a spiral of ceramic and copper fragments.'},
    ogTitle:{fr:['Terra / Luna.','La spirale.'],en:['Terra / Luna.','The spiral.']},
  },
  ltcm: {
    art:'ltcm', shortName:{fr:'LTCM',en:'LTCM'}, name:{fr:'LTCM. Le piège de la convergence',en:'LTCM. The convergence trap'},
    mechanism:{fr:'Convergence · levier · contreparties',en:'Convergence · leverage · counterparties'},
    summary:{fr:'Les écarts de taux se creusent et les pertes se cumulent. Un réseau de contreparties entoure le fonds, jusqu’à la recapitalisation par un consortium privé.',en:'Spreads widen and losses accumulate. A network of counterparties surrounds the fund, leading to recapitalisation by a private consortium.'},
    alt:{fr:'Illustration conceptuelle : deux rails de cuivre divergent et mettent sous tension une structure de verre reliée à plusieurs contrepoids.',en:'Conceptual illustration: two copper rails diverge, straining a glass structure connected to several counterweights.'},
    ogTitle:{fr:['LTCM.','Le piège de','la convergence.'],en:['LTCM.','The convergence','trap.']},
  },
  aig: {
    art:'aig', shortName:{fr:'AIG',en:'AIG'}, name:{fr:'AIG. Le cash manque',en:'AIG. Cash runs short'},
    mechanism:{fr:'CDS · prêt de titres · soutien public',en:'CDS · securities lending · public support'},
    summary:{fr:'Des garanties à fournir et du cash à restituer. Deux circuits de liquidité mettent AIG sous pression, avant les achats d’actifs de Maiden Lane.',en:'Collateral to post and cash to return. Two liquidity channels put AIG under pressure before the Maiden Lane asset purchases.'},
    alt:{fr:'Illustration conceptuelle : une structure de verre distribue deux flux distincts, soutenus par deux ponts de cuivre et de lumière turquoise.',en:'Conceptual illustration: a glass structure distributes two distinct flows, supported by copper and turquoise bridges.'},
    ogTitle:{fr:['AIG.','Le cash manque.'],en:['AIG.','Cash runs short.']},
  },
  lehman:{
    art:'lehman',shortName:{fr:'Lehman / fonds',en:'Lehman / funds'},name:{fr:'Lehman. La contagion aux fonds monétaires',en:'Lehman. The money fund run'},
    mechanism:{fr:'Crédit · rachats · garantie',en:'Credit · redemptions · guarantee'},
    summary:{fr:'Une perte sur la dette Lehman brise la valeur stable d’un fonds. Les retraits se propagent, puis la Fed et le Trésor ouvrent deux circuits de soutien.',en:'A loss on Lehman debt breaks a fund’s stable share value. Withdrawals spread, and the Fed and Treasury establish separate support channels.'},
    alt:{fr:'Illustration conceptuelle : une tour d’ivoire fissurée jouxte un réservoir de verre relié à des canaux de financement.',en:'Conceptual illustration: a cracked ivory tower stands beside a glass reservoir connected to funding channels.'},
    ogTitle:{fr:['Lehman.','La contagion','aux fonds.'],en:['Lehman.','The money','fund run.']},
  },
  asia:{
    art:'asia-1997',shortName:{fr:'Asie 1997',en:'Asia 1997'},name:{fr:'Asie. Le piège de la dette en devises',en:'Asia. The foreign-currency debt trap'},
    mechanism:{fr:'Change · dette extérieure · banques',en:'Currencies · external debt · banks'},
    summary:{fr:'La Thaïlande, l’Indonésie et la Corée subissent des tensions de financement et de change. Les programmes se succèdent sur fond de bilans fragiles.',en:'Thailand, Indonesia and Korea face funding and currency strains. Successive programs respond to vulnerabilities in financial and corporate balance sheets.'},
    alt:{fr:'Illustration conceptuelle : trois structures d’ivoire sur des îlots distincts sont reliées par des ponts de crédit en cuivre sous tension.',en:'Conceptual illustration: three ivory structures on separate islands are connected by strained copper credit bridges.'},
    ogTitle:{fr:['Asie 1997.','Le piège','des devises.'],en:['Asia 1997.','The currency','debt trap.']},
  },
  nickel:{
    art:'nickel',shortName:{fr:'Nickel / LME',en:'Nickel / LME'},name:{fr:'Nickel. Le marché suspendu',en:'Nickel. Trading suspended'},
    mechanism:{fr:'Positions vendeuses · marges · compensation',en:'Short positions · margin · clearing'},
    summary:{fr:'Les garanties à fournir mettent les intermédiaires sous pression. Le LME suspend le nickel, annule des transactions et prépare une reprise encadrée.',en:'Collateral demands put intermediaries under pressure. The LME suspends nickel trading, cancels trades and prepares a controlled reopening.'},
    alt:{fr:'Illustration conceptuelle : un mécanisme de nickel et de cuivre est tendu par un ressort et des contrepoids, devant une barrière fermée.',en:'Conceptual illustration: a nickel-and-copper mechanism is strained by a spring and counterweights behind a closed gate.'},
    ogTitle:{fr:['Nickel.','Le marché','suspendu.'],en:['Nickel.','Trading','suspended.']},
  },
  chf:{
    art:'swiss-franc',shortName:{fr:'Franc suisse',en:'Swiss franc'},name:{fr:'Franc suisse. Le plancher disparaît',en:'Swiss franc. The floor disappears'},
    mechanism:{fr:'Plancher · change · intermédiation',en:'Minimum rate · FX · intermediation'},
    summary:{fr:'La BNS retire sa règle de change face à l’euro. Le choc atteint les positions exposées et les intermédiaires, tandis que les autres instruments monétaires restent disponibles.',en:'The SNB removes its exchange-rate rule against the euro. The shock reaches exposed positions and intermediaries while other monetary instruments remain available.'},
    alt:{fr:'Illustration conceptuelle : le retrait d’un seuil d’ivoire libère un contrepoids de verre et tend un réseau de fils turquoise.',en:'Conceptual illustration: removing an ivory threshold releases a glass counterweight and strains a network of turquoise threads.'},
    ogTitle:{fr:['Franc suisse.','Le plancher','disparaît.'],en:['Swiss franc.','The floor','disappears.']},
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
  fr:{title:'Replay des crises',description:'Neuf crises à explorer, des gilts à Lehman, de l’Asie au nickel et au franc suisse. Cartes interactives, annonces datées et sources primaires pour suivre la transmission des chocs.',ogTitle:['Replay','des crises.']},
  en:{title:'Crisis replay',description:'Explore nine crises, from gilts to Lehman, Asia, nickel and the Swiss franc. Interactive maps, dated releases and primary sources trace how financial shocks travel.',ogTitle:['Crisis','replay.']},
};
