export interface GlossaryReferenceLink {
  label: string;
  href: string;
  detail: string;
}

export interface GlossaryReferenceSection {
  title: string;
  paragraphs: string[];
}

export interface GlossaryReferencePage {
  updatedIso: string;
  standfirst: string;
  relatedSlugs: string[];
  datedFact: {
    label: string;
    text: string;
    sourceHref: string;
  };
  sections: GlossaryReferenceSection[];
  limitation: string;
  analyses: GlossaryReferenceLink[];
  instruments: GlossaryReferenceLink[];
  primarySources: GlossaryReferenceLink[];
}

export interface GlossaryReferenceCandidateGroup {
  label: string;
  rationale: string;
  slugs: string[];
}

// Sélection éditoriale, pas liste de pages indexables. Une notion ne passe en
// index,follow qu'après publication d'un contenu conforme dans
// glossaryReferenceBySlug.
export const glossaryReferenceCandidateGroups: GlossaryReferenceCandidateGroup[] = [
  {
    label: 'Microstructure et plomberie de marché',
    rationale: 'Requêtes techniques où les sources francophones expliquent rarement le mécanisme, la donnée et sa limite ensemble.',
    slugs: [
      'treasury-buyback',
      'off-the-run',
      'when-issued',
      'soumissionnaires-indirects',
      'cross-currency-basis',
      'ligne-de-swap',
      'message-d-ordre',
      'acces-sponsorise',
      'surveillance-des-marches',
      'spoofing',
      'efp',
      'taux-de-pret-de-l-or',
    ],
  },
  {
    label: 'Crédit privé, fonds et assurance',
    rationale: 'Structures de bilan et métriques spécialisées déjà documentées dans les enquêtes l0g mais peu traitées comme objets autonomes.',
    slugs: [
      'slar',
      'rated-feeder-note',
      'pcdr',
      'super-lien',
      'pml',
      'conservatorship',
      'spspa',
      'net-worth-sweep',
      'ercf',
      'g-fee',
      'ddtl',
      'loan-to-cost',
      'valeur-residuelle',
      'ucc-article-9',
      'fonds-prime',
      'break-the-buck',
    ],
  },
  {
    label: 'Souverain, monnaie et institutions',
    rationale: 'Concepts institutionnels précis dont la traduction littérale masque souvent le droit, le bilan ou la règle de décision.',
    slugs: [
      'rmp',
      'restructuration-souveraine',
      'decote-souveraine',
      'cac',
      'risque-de-redenomination',
      'frein-a-la-dette',
      'pspp',
      'target2',
      'unicite-de-la-monnaie',
      'honebuto',
      'ycc',
      'oati',
      'fonds-d-epargne',
      'centralisation',
    ],
  },
  {
    label: 'Eau, électricité et adéquation',
    rationale: 'Vocabulaire physique et opérationnel relié à des outils l0g, avec des définitions publiques dispersées entre plusieurs institutions.',
    slugs: [
      'adequation-electrique',
      'lole',
      'lolp',
      'eens',
      'megawatt-humide',
      'rejet-thermique',
      'cce',
      'prelevement-d-eau',
      'consommation-d-eau',
      'refroidissement-en-circuit-ouvert',
      'refroidissement-sec',
      'tour-aerorefrigerante',
      'step',
      'reserve-hydroelectrique',
      'valeur-d-usage-de-l-eau',
      'energie-de-tete',
    ],
  },
  {
    label: 'Infrastructure numérique et tokenisation',
    rationale: "Briques techniques dont l'enjeu économique se perd lorsqu'elles sont réduites à un lexique crypto généraliste.",
    slugs: [
      'blob',
      'eip-4844',
      'data-availability',
      'sequenceur',
      'account-abstraction',
      'pbs',
      'mev',
      'immobilier-tokenise',
    ],
  },
  {
    label: 'Géoéconomie et angles morts institutionnels',
    rationale: 'Notions difficiles à traduire ou à mesurer, utiles pour relier politique industrielle, sanctions et architecture monétaire.',
    slugs: ['involution', 'sanctions-secondaires', 'cips', 'headroom'],
  },
];

export const glossaryReferenceCandidateSlugs = glossaryReferenceCandidateGroups.flatMap((group) => group.slugs);

export const glossaryGenericShortSlugs = ['cpi', 'etf', 'per', 'vix', 'm2', 'kyc'] as const;

export const glossaryReferenceBySlug: Record<string, GlossaryReferencePage> = {
  slar: {
    updatedIso: '2026-09-02',
    standfirst: "Le Short-Term Liquid Assets Ratio mesure le coussin d'actifs très courts des fonds obligataires d'entreprise américains à partir de leurs déclarations N-PORT. Il aide à voir ce qui absorbe les rachats avant une vente d'obligations, sans constituer un seuil réglementaire ni une promesse de liquidité.",
    relatedSlugs: ['mmf', '2a-7', 'fonds-prime', 'repo', 't-bill', 'break-the-buck'],
    datedFact: {
      label: 'Échantillon publié le 8 mai 2026',
      text: "La note FEDS couvre 369 fonds, 5 458 observations trimestrielles entre le quatrième trimestre 2019 et le troisième trimestre 2025, et 450,635 milliards de dollars d'actifs nets au dernier trimestre observé.",
      sourceHref: 'https://www.federalreserve.gov/econres/notes/feds-notes/measuring-mutual-fund-liquidity-with-n-port-20260508.html',
    },
    sections: [
      {
        title: 'Ce que le ratio additionne',
        paragraphs: [
          "Le numérateur rassemble quatre poches identifiables dans le formulaire N-PORT : le cash et les équivalents de cash, les bons du Trésor américain arrivant à échéance dans 90 jours ou moins, les opérations de pension américaines de même maturité maximale et les véhicules américains d'investissement à court terme, ou STIV. Le dénominateur est l'actif net du fonds. Un SLAR de 5 % signifie donc que cinq dollars sur cent d'actif net répondent à cette définition opérationnelle. Cela ne signifie pas que les 95 dollars restants seraient invendables.",
          "Ce choix compte parce qu'un relevé du seul cash sous-estime le premier rideau de liquidité. Dans l'échantillon agrégé de la Fed, les STIV représentent plus de la moitié des actifs liquides pendant la plupart des périodes, autour de 3,2 % des actifs nets. Le repo pèse environ 1,5 %, le cash environ 0,4 %, tandis que les T-bills courts restent une composante mineure. Le coussin dépend ainsi de marchés monétaires non bancaires qui sont liquides en temps normal, mais dont le fonctionnement peut lui-même se tendre.",
        ],
      },
      {
        title: 'Interpréter le niveau et la trajectoire',
        paragraphs: [
          "Sur l'ensemble de la période, le fonds moyen affiche un SLAR de 4,7 % et le fonds médian de 3,4 %. L'écart interquartile va d'environ 1,5 % à 7,2 %. Cette dispersion interdit de transformer la moyenne en norme. Deux fonds au même ratio peuvent porter des obligations très différentes, subir des profils de rachats distincts et disposer de lignes de crédit ou de règles de gestion qui ne figurent pas au numérateur.",
          "La direction du ratio est souvent plus informative que son niveau isolé. Au premier trimestre 2020, le SLAR agrégé pondéré par les actifs recule de 6,5 % à 4,9 % pendant le choc de rachats, avant une reconstitution. Entre les deuxième et troisième trimestres 2025, il baisse de 5,1 % à 4,3 % après des sorties importantes. Ce mouvement est compatible avec l'usage d'un coussin pour payer des investisseurs. Il ne prouve cependant pas, à lui seul, qu'un fonds est proche d'une vente forcée.",
        ],
      },
      {
        title: 'N-PORT et la liquidité reconstituée',
        paragraphs: [
          "Les fonds enregistrés déclarent mensuellement leurs positions dans N-PORT. Les données publiques donnent notamment le type d'actif, l'émetteur, le domicile, l'échéance et la valeur. En revanche, la classification réglementaire de liquidité de chaque position demandée à l'item C.7 n'est pas publiée. Les auteurs reconstruisent donc une mesure observable à partir des caractéristiques des instruments et rapprochent N-PORT du formulaire annuel N-CEN pour identifier les fonds domestiques ouverts investis à long terme en dette d'entreprise.",
          "L'échantillon retient les fonds dont la maturité moyenne pondérée atteint au moins trois ans et dont la dette d'entreprise émise aux États-Unis représente au moins 55 % de l'actif net. Les ETF sont exclus. Ces critères produisent une population cohérente pour l'étude, mais ils restent des choix de recherche. Le ratio ne doit pas être transposé sans adaptation aux fonds européens, aux fonds de prêts, aux ETF obligataires ou aux stratégies mondiales.",
        ],
      },
      {
        title: "Ce qu'un suivi utile doit ajouter",
        paragraphs: [
          "Un diagnostic de liquidité confronte le SLAR aux flux nets, à la concentration des porteurs, à la qualité et à la profondeur du portefeuille, aux appels de marge, aux facilités de crédit et au calendrier de règlement. Il vérifie aussi la composition du coussin : un dollar de cash, un repo et une part de STIV peuvent porter des contraintes opérationnelles différentes. La maturité très courte réduit le risque de taux, mais ne supprime ni le risque de contrepartie ni le risque de marché.",
          "Le bon usage est donc comparatif et daté. On suit un même fonds dans le temps, on compare des stratégies proches et on documente les changements de composition. Une baisse après des rachats peut montrer que le tampon a joué son rôle. Une baisse persistante combinée à des sorties, à des actifs difficiles à céder et à un marché monétaire tendu mérite davantage d'attention. Le SLAR ouvre l'enquête ; il ne rend pas son verdict.",
        ],
      },
    ],
    limitation: "Le SLAR est une construction de chercheurs de la Réserve fédérale, pas un ratio prudentiel officiel. Il ne remplace ni les catégories de liquidité de la règle SEC 22e-4, ni le minimum interne d'investissements hautement liquides lorsqu'il s'applique. Les données publiques s'arrêtent au troisième trimestre 2025 dans la note du 8 mai 2026, certaines classifications restent confidentielles et aucun plancher universel de 5 % ou 10 % ne peut être déduit de l'étude.",
    analyses: [
      {
        label: 'Cash, pas cash : le coussin des fonds obligataires',
        href: '/posts/cash-pas-cash-coussin-liquidite-fonds-obligataires/',
        detail: 'Enquête l0g sur la composition du tampon, les flux et les limites de N-PORT.',
      },
    ],
    instruments: [],
    primarySources: [
      {
        label: 'Federal Reserve Board : Measuring Mutual Fund Liquidity with N-PORT',
        href: 'https://www.federalreserve.gov/econres/notes/feds-notes/measuring-mutual-fund-liquidity-with-n-port-20260508.html',
        detail: 'Définition du SLAR, échantillon, résultats et limites, 8 mai 2026.',
      },
      {
        label: 'SEC : Form N-PORT data sets',
        href: 'https://www.sec.gov/data-research/sec-markets-data/form-n-port-data-sets',
        detail: 'Jeux de données réglementaires utilisés pour reconstruire les positions.',
      },
    ],
  },
  'megawatt-humide': {
    updatedIso: '2026-09-02',
    standfirst: "Le mégawatt humide est une catégorie d'analyse l0g pour les capacités électriques dont la production, le stockage ou le refroidissement dépend directement de l'eau. Elle sert à poser les bonnes questions unité par unité, pas à fabriquer un score unique de vulnérabilité climatique.",
    relatedSlugs: ['prelevement-d-eau', 'consommation-d-eau', 'refroidissement-en-circuit-ouvert', 'rejet-thermique', 'step', 'valeur-d-usage-de-l-eau'],
    datedFact: {
      label: 'Prélèvements observés en 2020-2023',
      text: "L'Agence européenne pour l'environnement estime que le refroidissement électrique a prélevé environ 62 milliards de mètres cubes d'eau douce par an dans l'Union européenne, soit 33 % des prélèvements sectoriels sur cette période.",
      sourceHref: 'https://www.eea.europa.eu/en/analysis/indicators/water-abstraction-by-source-and',
    },
    sections: [
      {
        title: "Ce que l'expression cherche à rendre visible",
        paragraphs: [
          "Une centrale hydroélectrique transforme un débit ou un stock d'eau en électricité. Une centrale nucléaire ou thermique utilise une source froide pour évacuer la chaleur. Une station de transfert d'énergie par pompage déplace de l'eau entre deux bassins. Toutes dépendent de l'eau, mais par des mécanismes incompatibles avec un classement binaire. Le mégawatt humide nomme ce périmètre commun afin d'obliger l'analyse à préciser ensuite la ressource, le circuit, le seuil et la perte possible.",
          "Pour une unité donnée, la fiche utile relierait la puissance disponible à une masse d'eau, au type de refroidissement, au caractère ouvert ou fermé du stockage, aux limites de débit ou de température et aux réductions effectivement observées. Ces champs permettent de distinguer une contrainte de stock, une impossibilité de prélèvement, une limite environnementale sur le rejet, un échauffement qui dégrade le rendement ou une indisponibilité sans rapport avec l'eau.",
        ],
      },
      {
        title: 'Pourquoi la donnée européenne reste fragmentée',
        paragraphs: [
          "ENTSO-E publie capacités, technologies, production et indisponibilités. PRIS suit les réacteurs nucléaires. Eurostat consolide les capacités nationales. L'Agence européenne pour l'environnement agrège les prélèvements par secteur. Le portail européen des émissions industrielles décrit de nombreux sites. Pris séparément, chacun répond à une question légitime. Aucun de ces systèmes ne relie publiquement et de façon homogène chaque unité à son eau, son circuit, ses seuils physiques et les mégawatts perdus lorsque ces seuils sont franchis.",
          "Le Centre commun de recherche avait déjà posé une partie du bon schéma dans JRC-PPDB-OPEN. Sa base comporte des informations sur le type d'eau, le refroidissement, le prélèvement et la consommation. Le catalogue officiel la présente toutefois comme une première tentative encore incomplète. La version publique a été émise en juillet 2019, modifiée le même mois et sa fréquence de mise à jour est irrégulière. Elle prouve la faisabilité du rapprochement, pas l'état actuel du parc.",
        ],
      },
      {
        title: 'Du volume prélevé à la perte électrique',
        paragraphs: [
          "Un circuit ouvert retire un grand volume, le fait passer dans un condenseur puis en restitue l'essentiel, plus chaud. Une tour humide prélève moins, recircule l'eau et en consomme davantage par évaporation. Un refroidissement sec réduit fortement la demande d'eau, au prix d'équipements, d'auxiliaires et d'une possible pénalité de puissance lorsque l'air est chaud. Le volume prélevé ne suffit donc ni à mesurer la pression nette sur la ressource ni à prévoir la perte électrique.",
          "L'indicateur de l'EEA aide à mesurer l'échelle, avec environ 62 milliards de mètres cubes prélevés annuellement pour le refroidissement électrique en 2020-2023, contre environ 90 milliards durant les années 2000. Cette baisse de 30 % accompagne notamment l'évolution du mix. Elle ne dit pas quelles unités sont exposées pendant une semaine de sécheresse, car le chiffre agrège l'Union, plusieurs technologies, des saisons différentes et des retours d'eau que la méthode ne déduit pas du prélèvement brut.",
        ],
      },
      {
        title: 'Passer de la capacité au risque',
        paragraphs: [
          "Le risque apparaît lorsqu'une dépendance rencontre un seuil. Pour l'hydraulique, il faut distinguer débit instantané, réserve, hauteur de chute et usages concurrents. Pour le thermique, on documente la température et le débit de la source froide, les autorisations de prélèvement et de rejet, le circuit de refroidissement, le minimum technique et les éventuelles dérogations. Une capacité nominale de 1 000 MW ne devient pas automatiquement indisponible quand un indicateur hydrologique baisse.",
          "Le suivi doit conserver la preuve de chaque événement : unité concernée, heure, motif publié, puissance avant et après, mesure hydrologique et règle applicable. Il devient alors possible de séparer la capacité liée à l'eau, la capacité exposée à un seuil donné et la perte réellement observée. Cette distinction empêche qu'un grand total européen soit présenté comme une prévision de coupure. Elle rend aussi les comparaisons entre bassins et technologies auditables.",
          "Un registre exploitable devrait en outre dater chaque observation et conserver la provenance du champ. Le type de refroidissement peut venir d'une base technique, le seuil d'un arrêté local et la perte d'un avis d'indisponibilité. Les fusionner sans identifiant d'unité ni historique rendrait la donnée invérifiable. La qualité du mégawatt humide dépend moins d'un modèle complexe que de cette chaîne de preuves.",
        ],
      },
    ],
    limitation: "Le mégawatt humide n'est ni une statistique européenne officielle, ni une unité physique supplémentaire, ni une estimation des capacités simultanément menacées. Il inclut des dépendances très différentes et ne doit jamais additionner sans étiquette l'hydraulique, le nucléaire, le thermique humide et les STEP. Les 62 milliards de mètres cubes décrivent un prélèvement annuel agrégé, pas une consommation nette, un risque local ou une perte de production.",
    analyses: [
      {
        label: "Le mégawatt humide que l'Europe ne sait pas compter",
        href: '/posts/megawatt-humide-europe-eau-electricite/',
        detail: 'Enquête sur les registres, les catégories physiques et les champs manquants.',
      },
    ],
    instruments: [
      {
        label: 'Compteur de mégawatts humides',
        href: '/outils/compteur-megawatt-humide/',
        detail: "Simulateur de périmètre qui rend explicite l'hypothèse sur le thermique refroidi par eau.",
      },
      {
        label: "Devis d'adaptation du refroidissement",
        href: '/outils/devis-adaptation-refroidissement/',
        detail: "Comparaison documentée de réponses techniques à une contrainte d'eau ou de chaleur.",
      },
    ],
    primarySources: [
      {
        label: 'EEA : Water abstraction by source and economic sector',
        href: 'https://www.eea.europa.eu/en/analysis/indicators/water-abstraction-by-source-and',
        detail: 'Prélèvements sectoriels 2000-2023, définitions et méthodologie.',
      },
      {
        label: 'JRC : Open Power Plants Database',
        href: 'https://data.jrc.ec.europa.eu/dataset/9810feeb-f062-49cd-8e76-8d8cfd488a05',
        detail: "Base européenne au niveau des unités, publiée en 2019 et qualifiée d'incomplète.",
      },
      {
        label: 'JRC : documentation EIGL',
        href: 'https://joint-research-centre.ec.europa.eu/system/files/2023-11/Data%20documentation%20EIGL%20v1_6.pdf',
        detail: 'Table JRC_OPEN_UNITS : champs eau et refroidissement, page 5 de la documentation.',
      },
      {
        label: 'ENTSO-E Transparency Platform',
        href: 'https://transparency.entsoe.eu/',
        detail: 'Capacités, production et indisponibilités du système électrique européen.',
      },
    ],
  },
  'valeur-d-usage-de-l-eau': {
    updatedIso: '2026-09-02',
    standfirst: "La valeur d'usage de l'eau est le coût d'opportunité d'un stock hydraulique : produire aujourd'hui détruit la possibilité de produire plus tard avec la même eau. Cette valeur guide l'arbitrage des barrages-réservoirs, sous contraintes de sécurité, d'environnement et d'usages concurrents.",
    relatedSlugs: ['reserve-hydroelectrique', 'energie-de-tete', 'step', 'adequation-electrique', 'megawatt-humide', 'eens'],
    datedFact: {
      label: 'Repère officiel mis à jour le 27 mars 2026',
      text: "Le régulateur norvégien rappelle que près de 90 % de la production électrique du pays vient de l'hydraulique et que plus de 1 000 réservoirs peuvent stocker de l'eau, ce qui donne une portée systémique au calcul de vannverdi.",
      sourceHref: 'https://www.nve.no/reguleringsmyndigheten/slik-fungerer-kraftsystemet/hva-er-vannverdi/',
    },
    sections: [
      {
        title: "Un prix pour l'option de produire plus tard",
        paragraphs: [
          "Une unité d'eau stockée ne vaut pas seulement l'électricité qu'elle produirait au prix actuel. Tant qu'elle reste dans le réservoir, elle conserve une option : être turbinée pendant une pointe de consommation, remplacer une production thermique chère, couvrir une période sèche ou répondre à une tension du système. La valeur d'usage représente ce revenu futur espéré, corrigé des pertes, des apports attendus et des contraintes qui peuvent empêcher la production.",
          "La règle économique est simple à écrire. Si le gain net d'une production immédiate dépasse la valeur attribuée à l'eau conservée, la centrale a intérêt à produire. Dans le cas inverse, elle attend. Le calcul réel est dynamique : chaque décision modifie le stock restant, les centrales situées en aval peuvent réutiliser la même eau et les prévisions de pluie, de neige, de température, de demande et de prix changent en permanence.",
        ],
      },
      {
        title: "Pourquoi un niveau trop bas ou trop haut coûte cher",
        paragraphs: [
          "Le régulateur norvégien décrit deux erreurs symétriques. Une valeur trop faible pousse à produire trop tôt. Les réservoirs peuvent alors approcher de l'épuisement avant la fin de l'hiver, au moment où les apports sont faibles et la demande élevée. Le système s'expose à des prix extrêmes, à des importations contraintes ou, dans un cas sévère, à un rationnement. Une valeur trop élevée retarde au contraire la production et renchérit l'électricité disponible aujourd'hui.",
          "Conserver trop d'eau n'est pas sans risque. Si le réservoir reste haut quand arrivent la fonte des neiges ou de fortes pluies, une partie des apports peut devoir être déversée sans passer par les turbines. L'option de produire plus tard expire alors sans valeur. Le calcul cherche à répartir une ressource incertaine sur la saison, pas à maximiser mécaniquement le prix de vente de chaque mégawattheure.",
        ],
      },
      {
        title: 'La technologie fixe l’horizon de décision',
        paragraphs: [
          "RTE classe les ouvrages français selon le temps nécessaire pour remplir leur réserve. Les centrales de lac, au-delà de 400 heures, se gèrent sur un horizon annuel afin d'utiliser l'eau lorsque sa valeur pour le système est la plus forte. Les ouvrages éclusés, entre 2 et 400 heures, arbitrent plutôt du jour à la semaine. Le fil de l'eau, sous deux heures de réserve, dépend surtout des apports instantanés et dispose de peu de capacité pour reporter la production.",
          "Une STEP ajoute une autre logique. Elle consomme de l'électricité pour pomper de l'eau vers un bassin supérieur, puis la restitue plus tard en turbinant. Sa décision dépend du différentiel de prix et du rendement du cycle, pas seulement d'un apport naturel. Employer une même valeur d'usage sans identifier lac, éclusée, fil de l'eau ou pompage-turbinage mélange donc des stocks, des horizons et des contraintes physiques différents.",
        ],
      },
      {
        title: 'Les contraintes de gestion du réservoir',
        paragraphs: [
          "La valeur économique calculée par un producteur reste encadrée par le droit de l'eau et par l'exploitation du système. Débits réservés, eau potable, irrigation, sûreté des ouvrages, navigation, tourisme et protection des écosystèmes peuvent réduire le volume mobilisable ou imposer un calendrier. Une réserve stratégique peut aussi obliger à conserver de l'énergie même lorsque le prix courant inciterait à vendre. Le prix de marché devient alors une entrée du calcul parmi d'autres.",
          "Pour lire un stock publié, il faut connaître sa convention. Un pays peut exprimer l'énergie de la centrale directement reliée au réservoir ; un autre peut compter toute la cascade aval. Certains agrégats réunissent réservoirs naturels et pompage-turbinage. Deux valeurs en gigawattheures ne sont comparables que si le périmètre, la date, les réserves indisponibles, les usages non électriques et la méthode de conversion sont documentés.",
        ],
      },
      {
        title: 'Comment utiliser le concept',
        paragraphs: [
          "La valeur d'usage permet d'interpréter une baisse volontaire de production hydraulique sans la confondre avec une panne. Elle aide aussi à comprendre pourquoi une importation bon marché peut préserver un stock domestique ou pourquoi une centrale ne suit pas un prix positif à une heure donnée. Le signal utile associe le prix courant à la trajectoire du stock, aux apports prévus, au calendrier saisonnier et aux capacités de production futures.",
          "Un modèle pédagogique peut comparer vente immédiate et valeur future pondérée par la quantité encore mobilisable. Son résultat reste un scénario. Les exploitants disposent de modèles hydrologiques, de contraintes de vallée et d'informations opérationnelles beaucoup plus détaillés. La transparence consiste à publier les hypothèses et les unités, puis à montrer comment la décision change quand les apports, les prix ou la réserve obligatoire varient.",
        ],
      },
    ],
    limitation: "La valeur d'usage n'est ni le prix physique de l'eau, ni le tarif payé par tous ses usagers, ni une cotation publique unique. Elle dépend du réservoir, de la cascade, de l'horizon, des apports anticipés, du rendement, des prix futurs et des contraintes non électriques. Le repère norvégien de près de 90 % décrit le poids national de l'hydraulique ; il ne mesure pas une valeur marginale et ne se transpose pas directement au parc français.",
    analyses: [
      {
        label: 'Le barrage qui choisit de ne pas produire',
        href: '/posts/barrage-choisit-ne-pas-produire/',
        detail: "Réserve suisse, vannverdi norvégienne et conventions européennes de mesure des stocks.",
      },
    ],
    instruments: [
      {
        label: 'Arbitre de réservoir',
        href: '/outils/arbitre-reservoir/',
        detail: "Scénarios de vente immédiate, valeur future, réserve et énergie mobilisable.",
      },
    ],
    primarySources: [
      {
        label: 'RTE : Production hydraulique',
        href: 'https://analysesetdonnees.rte-france.com/production/hydraulique',
        detail: "Catégories d'ouvrages, horizons de gestion, production et stock agrégés.",
      },
      {
        label: 'NVE/RME : Hva er vannverdi?',
        href: 'https://www.nve.no/reguleringsmyndigheten/slik-fungerer-kraftsystemet/hva-er-vannverdi/',
        detail: "Définition officielle de la valeur de l'eau et erreurs de calibration.",
      },
      {
        label: 'NVE : méthode des statistiques de réservoir',
        href: 'https://www.nve.no/energi/analyser-og-statistikk/om-magasinstatistikken/',
        detail: 'Conversion du stock en énergie et prise en compte des centrales en aval.',
      },
      {
        label: 'ENTSO-E : stock hydraulique agrégé, article 16.1.D',
        href: 'https://transparencyplatform.zendesk.com/hc/en-us/articles/16648275841684-Aggregate-Filling-Rate-of-Water-Reservoirs-and-Hydro-Storage-Plants-16-1-D',
        detail: 'Agrégation des réservoirs et du pompage-turbinage sans méthode de calcul standard.',
      },
    ],
  },
};

const referenceText = (reference: GlossaryReferencePage) => [
  reference.standfirst,
  reference.datedFact.label,
  reference.datedFact.text,
  ...reference.sections.flatMap((section) => [section.title, ...section.paragraphs]),
  reference.limitation,
].join(' ');

export const glossaryReferenceWordCount = (reference: GlossaryReferencePage) =>
  referenceText(reference).trim().split(/\s+/u).filter(Boolean).length;
