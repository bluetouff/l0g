const shared = {
  date: '2026-09-13', modified: '2026-09-13T19:53:36Z',
  figureCount: 18,
  introductionSource: 'https://www.amf-france.org/fr/espace-epargnants/comprendre-les-produits-financiers/placements-collectifs/scpi-un-autre-moyen-dinvestir-dans-limmobilier',
};

const chapters = {
  fr: [
    ['scpi-retraits-parts-attente-liquidite-registres', 'SCPI : derrière la baisse de 31 % du montant en attente', 'Ce que les registres disent des demandes de sortie.'],
    ['scpi-prix-revente-decote-marche-secondaire', 'SCPI : le prix de la sortie', 'Les transactions, leurs volumes et les frais de revente.'],
    ['scpi-rendement-dividendes-reserves-revenus', 'SCPI : le rendement et les euros', 'Les dividendes, leur origine et les réserves.'],
    ['scpi-bureaux-vacance-franchises-loyers-travaux', 'SCPI de bureaux : la facture des locaux vides', 'La location, les franchises et le coût des travaux.'],
    ['scpi-dette-cessions-refinancement', 'SCPI : la dette impose son calendrier', 'Les échéances de dette et l’argent des cessions.'],
    ['scpi-assurance-vie-banques-contagion', 'SCPI : qui porte les pertes ?', 'Les associés, l’assurance-vie et les banques prêteuses.'],
  ],
  en: [
    ['french-scpi-exit-queues-liquidity-register-reset', 'French SCPI funds: what lies behind the fall in exit queues', 'What the registers reveal about requests to leave.'],
    ['french-scpi-resale-prices-liquidity-discounts', 'French SCPI funds: the price of getting out', 'Transactions, volumes and the cost of selling.'],
    ['french-scpi-yields-income-dividends-reserves', 'SCPI: the income behind the yield', 'Distributions, their sources and retained earnings.'],
    ['french-scpi-office-vacancy-rent-free-incentives', 'French office SCPI funds: the cost of empty space', 'Leasing, rent-free periods and refurbishment costs.'],
    ['french-scpi-debt-property-sales-refinancing', 'French SCPI funds: when debt sets the timetable', 'Debt maturities and the proceeds of property sales.'],
    ['scpi-life-insurance-banks-contagion', 'SCPI funds: who bears the losses?', 'Investors, life insurance and lending banks.'],
  ],
};

/** @param {'fr' | 'en'} lang */
function editionChapters(lang) {
  return chapters[lang].map(([slug, title, summary], index) => ({
    slug, title, summary, number: index + 1,
    route: `${lang === 'fr' ? '/posts/' : '/en/analysis/'}${slug}/`,
    chapter: `ch${String(index + 2).padStart(3, '0')}.xhtml`,
  }));
}

export const scpiEditions = {
  fr: {
    ...shared, lang: 'fr', directory: 'scpi-liquidite-fantome', chapters: editionChapters('fr'),
    id: 'urn:uuid:3b625f35-1cdb-4444-9a1b-d407c96549f1',
    title: 'La liquidité fantôme des SCPI', subtitle: 'Liquidité, revenus et partage des pertes',
    path: '/publications/scpi-liquidite-fantome/',
    epub: '/publications/scpi-liquidite-fantome-l0g.epub',
    cover: '/publications/scpi-liquidite-fantome-cover.jpg',
    social: '/publications/scpi-liquidite-fantome-cover-social.jpg',
    introductionTitle: 'Le jour où l’on veut récupérer son argent',
    bonusTitle: 'SCPI et private credit : le temps de l’argent',
    conclusionTitle: 'Retrouver la maîtrise du calendrier',
    introduction: [
      'On peut acheter des parts de SCPI pour compléter ses revenus, préparer sa retraite ou investir dans l’immobilier à plusieurs. Puis vient une question très ordinaire : si j’ai besoin de cet argent, comment le récupérer ? C’est par cette question que commence ce livre.',
      'Une société civile de placement immobilier, ou SCPI, réunit l’argent de ses associés pour détenir un patrimoine locatif. Ses parts ne sont pas cotées en Bourse. Les possibilités de retrait et de revente dépendent des règles du véhicule et de l’argent disponible pour financer la sortie.',
      'Les six analyses réunies ici suivent le parcours de l’épargne. D’abord les demandes de sortie et les transactions. Ensuite les euros distribués, les locaux qui produisent les loyers et les emprunts à rembourser. Enfin les contrats et les intermédiaires qui déterminent où une perte se retrouve. Les cas étudiés gardent leurs noms, leurs dates et leurs limites ; ils ne décrivent pas toutes les SCPI.',
      'L’ordre compte. Après avoir lu les deux premiers chapitres, on regarde autrement un rendement affiché. Après les deux suivants, on sait pourquoi un bail signé et un revenu encaissé peuvent être séparés par plusieurs étapes. La dette puis l’assurance-vie élargissent la perspective, jusqu’aux engagements des banques.',
      'Un chapitre inédit prolonge ce parcours vers le crédit privé aux entreprises. La comparaison porte sur des mécanismes précis et sur les structures qui les rendent possibles. Elle permet aussi de comprendre pourquoi deux placements exposés à l’illiquidité peuvent protéger leurs investisseurs de façons très différentes.',
      'Ce livre reprend les analyses arrêtées au 13 septembre 2026, avec leurs sources et leurs exemples pédagogiques explicitement fictifs. Les encadrés se lisent directement dans l’EPUB. Les liens internes permettent de circuler entre les chapitres ; une connexion reste nécessaire pour ouvrir les documents cités. On peut suivre le parcours d’une traite ou revenir à la question qui nous concerne.',
    ],
    conclusion: [
      'Au terme de ce parcours, la question de départ a gagné en précision. Récupérer son argent suppose de connaître le mécanisme de sortie, les conditions d’un échange et le montant qui revient effectivement au vendeur. La valeur inscrite sur un relevé ne répond pas à elle seule à ces questions.',
      'Le même effort de lecture s’applique au revenu. Les chapitres ont distingué le taux affiché des euros distribués, puis remonté de ces euros jusqu’aux loyers, aux réserves, aux cessions et aux remboursements. On peut maintenant demander ce qui soutient un versement et ce qui pourrait le faire évoluer, sans transformer chaque fragilité en prévision.',
      'La comparaison avec le crédit privé ouvre une piste de travail : examiner ensemble ce que possède un fonds et ce qu’il s’engage à rendre, à qui et quand. Elle oblige aussi à regarder les différences. Un associé immobilier, un prêteur, un souscripteur d’assurance-vie et une banque n’occupent pas la même place dans les contrats.',
      'Pour poursuivre l’examen d’un placement, on peut commencer simplement : retrouver la dernière transaction disponible et son volume ; relire l’origine du dividende ; demander le calendrier des emprunts et des dépenses ; identifier les règles de sortie et les possibilités de suspension. Les sources de chaque chapitre donnent les points d’entrée. Quand une information manque, cette absence mérite une question au gestionnaire, sans lui substituer un chiffre.',
      'L’objectif de cette édition est de rendre cette lecture possible. Elle ne classe pas les fonds et ne donne aucune consigne personnelle d’achat ou de vente. Les situations étudiées montrent surtout combien le temps fait partie du placement : le temps nécessaire pour louer, encaisser, rembourser et céder. Le connaître aide à rapprocher un engagement financier de la vie de celui qui le prend.',
    ],
  },
  en: {
    ...shared, lang: 'en', directory: 'scpi-phantom-liquidity', chapters: editionChapters('en'),
    id: 'urn:uuid:7600de34-b1b6-4e4e-a624-de039ca02f08',
    title: 'The Phantom Liquidity of SCPI Funds', subtitle: 'Liquidity, income and who bears the losses',
    path: '/en/publications/scpi-phantom-liquidity/',
    epub: '/publications/scpi-phantom-liquidity-l0g.epub',
    cover: '/publications/scpi-phantom-liquidity-cover.jpg',
    social: '/publications/scpi-phantom-liquidity-cover-social.jpg',
    introductionTitle: 'The day you need your money back',
    bonusTitle: 'SCPI funds and private credit: the time money needs',
    conclusionTitle: 'Understanding the timetable',
    introduction: [
      'People buy shares in French SCPI property funds to supplement their income, prepare for retirement or invest in buildings collectively. Eventually, a very ordinary question may arise: if I need this money, how do I get it back? That is where this book begins.',
      'SCPI stands for société civile de placement immobilier: a French unlisted investment company that pools investors’ money to own rental property. Investors hold units in the company. Unlike an exchange-traded real estate investment trust (REIT), its units have no continuous stock-market trading. Withdrawal and resale depend on the fund’s rules and the money available to finance an exit.',
      'The French terms in this book matter because the legal arrangements are local. In particular, assurance-vie is a life insurance contract widely used to hold investments. A unit-linked option within that contract carries investment risk. It should not be read as a promise of capital protection simply because it is sold through insurance; chapter six explains the insurer’s obligations and their limits.',
      'Its six analyses follow the investment through exit requests and actual transactions, then into distributions, the buildings that generate rents and the loans that must be repaid. The final part examines the contracts and intermediaries that determine where losses fall. Each case retains its name, dates and limitations. These selected funds do not stand for the whole industry.',
      'The sequence matters. The opening chapters change the way a quoted yield looks. The next two explain why signing a lease and receiving rent can be separated by several steps. Debt and life insurance then widen the view to include the commitments of lending banks.',
      'An additional chapter takes this reading into private corporate credit. It compares specific mechanisms and the structures that make them possible. It also explains why investments exposed to illiquidity can offer very different forms of investor protection.',
      'This edition brings together the analyses as at 13 September 2026, retaining their sources and explicitly hypothetical teaching examples. Expandable website boxes are displayed in full in the book. Links between chapters work offline; source documents require a connection. You can read straight through or return to the question that matters to you.',
    ],
    conclusion: [
      'By the end of this journey, the opening question has become more precise. Getting money back requires an exit mechanism, executable terms and a clear view of what the seller receives. A value on a statement cannot answer all of those questions.',
      'Income deserves the same attention. These chapters separated the quoted rate from the euros distributed, then traced those payments to rents, retained earnings, disposals and debt repayments. That makes it possible to ask what supports a distribution and what might change it, without turning every weakness into a forecast.',
      'The private-credit comparison suggests a useful line of inquiry: examine what a fund owns alongside what it has undertaken to pay, to whom and when. The differences remain essential. A property-fund investor, a lender, a life policyholder and a bank occupy different positions in their contracts.',
      'A practical follow-up can start with the latest available transaction and its volume, the sources of the distribution, the schedule of debt and expenditure, and the rules governing exits or suspensions. Each chapter provides starting documents. Missing information is a reason to ask the manager a question, rather than supply an assumed figure.',
      'This edition aims to make that reading possible. It neither ranks funds nor offers personal instructions to buy or sell. Above all, the cases show how time is part of an investment: time to lease, collect, repay and sell. Understanding it helps connect a financial commitment with the life of the person making it.',
    ],
  },
};
