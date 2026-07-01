export type MethodologyAccent = 'teal' | 'blue' | 'pink' | 'amber';

export interface MethodologySource {
  name: string;
  role: string;
  cadence: string;
  delay: string;
  url: string;
}

export interface MethodologyPage {
  slug: string;
  label: string;
  shortLabel: string;
  eyebrow: string;
  accent: MethodologyAccent;
  title: string;
  description: string;
  question: string;
  dashboardUrl: string;
  repoUrl: string;
  updated: string;
  quickRead: string[];
  sources: MethodologySource[];
  calculation: string[];
  formula?: string;
  interpretation: string[];
  limits: string[];
  useFor: string[];
  notFor: string[];
  reproducibility: string[];
}

export const methodologyUpdated = '30 juin 2026';
export const methodologyUpdatedIso = '2026-06-30';

export const riskBandScaleCaveat = {
  title: 'Normalisation d’affichage, pas indice unique',
  summary:
    'Les indicateurs du bandeau utilisent une échelle commune 0-100 pour rendre les signaux lisibles côte à côte. Ils ne mesurent ni le même phénomène, ni la même fréquence, ni le même horizon.',
  correctLabel: 'tableau de bord consolidé de signaux de risque',
  wrongLabel: 'indice consolidé de risque systémique',
  details: [
    'Un score US Macro de 43 n’est pas statistiquement équivalent à un score Yen Carry de 45, Énergie de 47 ou Dette US de 54.',
    'Le chiffre sert à comparer un instrument à son propre régime, pas à comparer directement les instruments entre eux.',
    'Le libellé et la fiche méthodologique de chaque dashboard priment sur le chiffre isolé.',
  ],
};

export const methodologyPages: MethodologyPage[] = [
  {
    slug: '13flow',
    label: '13FLOW',
    shortLabel: '13FLOW',
    eyebrow: '// confluence 13F x Form 4',
    accent: 'teal',
    title: "13FLOW : l'argent lourd et l'argent qui sait",
    description:
      "Méthodologie de 13FLOW : comment lire la confluence entre accumulation institutionnelle 13F et achats d'initiés Form 4 depuis SEC EDGAR.",
    question:
      "Quels titres concentrent à la fois une accumulation de fonds suivis et des achats récents d'initiés ?",
    dashboardUrl: 'https://13flow.eu',
    repoUrl: 'https://github.com/bluetouff/13flow',
    updated: methodologyUpdated,
    quickRead: [
      "Le 13F est lent mais large : il montre les positions longues de grands gérants avec jusqu'à 45 jours de retard.",
      "Le Form 4 est frais mais étroit : il montre les transactions d'initiés sous deux jours ouvrés.",
      "13FLOW ne cherche pas un signal parfait ; il cherche une intersection rare entre deux populations indépendantes.",
    ],
    sources: [
      {
        name: 'SEC EDGAR · 13F-HR',
        role: 'Positions longues trimestrielles des gérants institutionnels suivis.',
        cadence: 'Trimestrielle',
        delay: "Jusqu'à 45 jours après la fin du trimestre",
        url: 'https://www.sec.gov/edgar/search/',
      },
      {
        name: 'SEC EDGAR · Form 4',
        role: "Achats et ventes déclarés par dirigeants, administrateurs et actionnaires à plus de 10 %.",
        cadence: 'Au fil des dépôts',
        delay: 'Deux jours ouvrés en régime normal',
        url: 'https://www.sec.gov/edgar/search/',
      },
      {
        name: 'SEC company_tickers.json',
        role: "Résolution des émetteurs et rapprochement entre CUSIP, nom d'émetteur et ticker.",
        cadence: 'Mise à jour SEC',
        delay: 'Variable',
        url: 'https://www.sec.gov/files/company_tickers.json',
      },
      {
        name: 'OpenFIGI',
        role: 'Résolution optionnelle des CUSIP quand la limite gratuite le permet.',
        cadence: 'À la demande',
        delay: 'Temps API',
        url: 'https://www.openfigi.com/api',
      },
    ],
    calculation: [
      "Les dépôts 13F sont parsés fonds par fonds, puis comparés trimestre contre trimestre pour isoler nouvelles lignes, renforcements, allègements et sorties.",
      "Les lignes 13F ne portant que des CUSIP, une chaîne de résolution conserve la provenance et un niveau de confiance : override manuel, OpenFIGI, préfixe CUSIP, correspondance SEC, puis non résolu.",
      "Les Form 4 sont filtrés par codes économiques : les achats au marché comptent, les attributions, exercices mécaniques et retenues fiscales sont exclus du score.",
      "Le score de confluence combine largeur institutionnelle, conviction des initiés, dollars engagés, fraîcheur du signal et accord entre les deux familles de données.",
    ],
    formula:
      "score = largeur_13F + conviction_inities + dollars_engages + accord\n" +
      "fraicheur : demi-vie d'environ 30 jours sur les achats d'initiés\n" +
      "cluster : plusieurs initiés dans une fenêtre courte renforcent le signal\n" +
      "quadrant : qualifie la nature du signal, le score n'en mesure que l'intensité",
    interpretation: [
      "Un score élevé signale une intensité, pas automatiquement une conviction propre : un titre peut être très actif mais divergent.",
      "Le quadrant est donc aussi important que le score : conviction, divergent, institutionnel ou insider-led ne racontent pas la même histoire.",
      "La ligne la plus intéressante n'est pas toujours la première du tableau ; c'est souvent celle où les fonds sont alignés et où les achats d'initiés sont frais.",
    ],
    limits: [
      "Le 13F ne montre que les positions longues sur titres éligibles ; shorts, dérivés complexes, cash et positions privées restent invisibles.",
      "Le retard de publication interdit toute lecture temps réel des portefeuilles institutionnels.",
      "L'univers dépend des fonds suivis et des tickers résolus avec assez de confiance.",
      "Un achat d'initié peut avoir des raisons personnelles ou fiscales que le formulaire ne révèle pas.",
      "Le score 13FLOW n'est pas comparable aux scores macro, yen ou énergie : il mesure une intensité de confluence sur actions.",
    ],
    useFor: [
      "Repérer des dossiers qui méritent une analyse fondamentale plus poussée.",
      "Comparer la fraîcheur du signal insider avec la lenteur du signal institutionnel.",
      "Construire une watchlist auditable à partir de données publiques.",
    ],
    notFor: [
      "Déduire l'exposition nette d'un fonds.",
      "Acheter un titre sur le seul score.",
      "Remplacer la lecture du 10-K, du bilan, des risques et de la valorisation.",
    ],
    reproducibility: [
      "Le code est publié sous AGPL-3.0-or-later.",
      "Les données de base viennent de SEC EDGAR, domaine public américain.",
      "Le dépôt contient des tests hors ligne pour parsing, résolution, base, valorisation, alertes, sécurité et comptes.",
    ],
  },
  {
    slug: 'yen-carry',
    label: 'Yen Carry Monitor',
    shortLabel: 'Yen Carry',
    eyebrow: '// yen carry trade',
    accent: 'pink',
    title: 'Yen Carry Monitor : mesurer le risque de débouclage',
    description:
      "Méthodologie du Yen Carry Monitor : positionnement CFTC, USD/JPY, différentiel de taux et lecture du risque de débouclage du carry trade yen.",
    question:
      "Les fonds sont-ils encore massivement vendeurs de yen, et le risque de débouclage violent augmente-t-il ?",
    dashboardUrl: 'https://yct.l0g.fr',
    repoUrl: 'https://github.com/bluetouff/carry-yen-monitor',
    updated: methodologyUpdated,
    quickRead: [
      "Le carry trade gagne quand le différentiel de taux reste large et que le yen ne se renforce pas.",
      "Le risque monte quand les positions vendeuses sont encombrées, que le yen remonte et que le différentiel de taux se compresse.",
      "Le score est un thermomètre de fragilité, pas une prévision de change.",
    ],
    sources: [
      {
        name: 'CFTC · Commitments of Traders',
        role: 'Positionnement spéculatif net sur les futures yen.',
        cadence: 'Hebdomadaire',
        delay: 'Publication avec quelques jours de décalage',
        url: 'https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm',
      },
      {
        name: 'BCE · taux de change de référence',
        role: 'USD/JPY quotidien via taux de référence officiels.',
        cadence: 'Quotidienne',
        delay: 'Jour ouvré',
        url: 'https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html',
      },
      {
        name: 'FRED · Fed policy rate',
        role: 'Taux directeur américain utilisé dans le différentiel de taux.',
        cadence: 'Selon décisions Fed',
        delay: 'Faible',
        url: 'https://fred.stlouisfed.org/',
      },
      {
        name: 'Configuration BoJ',
        role: 'Taux directeur japonais ajusté à chaque décision de la Banque du Japon.',
        cadence: 'Selon décisions BoJ',
        delay: 'Manuel',
        url: 'https://www.boj.or.jp/en/',
      },
    ],
    calculation: [
      "Le builder régénère un snapshot statique depuis les sources publiques et conserve la dernière valeur connue si une source tombe.",
      "Le contrat yen standard est conservé lorsque les données CFTC renvoient aussi un micro-contrat, afin d'éviter un double comptage.",
      "Le score combine trois composantes : encombrement des shorts, appréciation récente du yen et compression du différentiel Fed-BoJ.",
      "Le navigateur ne contacte pas les fournisseurs : il lit le fichier de snapshot servi en same-origin.",
    ],
    formula:
      "risque = 0.45 x surcharge_shorts\n" +
      "       + 0.35 x appreciation_yen_4s\n" +
      "       + 0.20 x compression_differentiel\n\n" +
      "bandes : <30 faible · <55 modéré · <78 élevé · sinon critique",
    interpretation: [
      "Un score faible indique que le carry domine encore : le trade reste payé et la pression de rachat du yen est limitée.",
      "Un score modéré signale un terrain qui se fragilise, surtout si le positionnement CFTC est déjà très court.",
      "Un score élevé ou critique signifie que le moindre choc peut forcer des rachats de yen et amplifier le mouvement.",
    ],
    limits: [
      "Le COT ne couvre que les futures déclarés à la CFTC, pas l'ensemble des positions OTC ni les livres internes des banques.",
      "Le taux BoJ est maintenu en configuration ; une décision mal reportée peut fausser temporairement le différentiel.",
      "Un débouclage peut être déclenché par un choc exogène absent du score.",
      "La liquidité intrajournalière du change n'est pas mesurée.",
      "Le score 0-100 est propre au risque de débouclage yen ; il ne se compare pas directement aux scores macro ou énergie.",
    ],
    useFor: [
      "Surveiller l'encombrement d'un trade macro très consensuel.",
      "Relier positionnement, taux et mouvement du yen dans une lecture unique.",
      "Déclencher une lecture plus détaillée des marchés actions et taux quand le score monte vite.",
    ],
    notFor: [
      "Prévoir un niveau cible USD/JPY.",
      "Timer une position de change à court terme.",
      "Mesurer toutes les expositions de carry financées en yen.",
    ],
    reproducibility: [
      "Architecture snapshot statique, sans tracker ni appel tiers côté navigateur.",
      "Builder Python documenté dans le dépôt public.",
      "Les sources officielles sont préférées aux agrégateurs.",
    ],
  },
  {
    slug: 'energie',
    label: 'Energie Monitor',
    shortLabel: 'Énergie',
    eyebrow: '// stress énergétique',
    accent: 'amber',
    title: "Energie Monitor : lire la tension de marché, pas l'actualité brute",
    description:
      "Méthodologie de l'Energie Monitor : indice de stress des marchés de l'énergie à partir de pétrole, gaz, électricité, positionnement et contexte EUR/USD.",
    question:
      "Pétrole, gaz, électricité : le marché de l'énergie est-il anormalement tendu par rapport à son propre régime récent ?",
    dashboardUrl: 'https://energie.l0g.fr',
    repoUrl: 'https://github.com/bluetouff/energie-stress-monitor',
    updated: methodologyUpdated,
    quickRead: [
      "L'indice mesure la dynamique de stress de marché : écart à la normale et momentum.",
      "Il ne mesure pas directement le risque géopolitique ; il mesure ce que ce risque produit dans les séries observées.",
      "En sortie de crise, les prix peuvent rester hauts tandis que l'indice baisse si la tension marginale reflue.",
    ],
    sources: [
      {
        name: 'EIA',
        role: 'Prix et stocks énergie, notamment pétrole et stocks américains.',
        cadence: 'Selon séries',
        delay: 'Variable',
        url: 'https://www.eia.gov/',
      },
      {
        name: 'GIE AGSI',
        role: 'Remplissage des stockages gaziers européens.',
        cadence: 'Quotidienne',
        delay: 'Faible',
        url: 'https://agsi.gie.eu/',
      },
      {
        name: 'ENTSO-E',
        role: 'Données électricité européennes quand la clé est activée.',
        cadence: 'Infraquotidienne à quotidienne',
        delay: 'Variable',
        url: 'https://transparency.entsoe.eu/',
      },
      {
        name: 'CFTC',
        role: 'Positionnement spéculatif WTI et gaz naturel.',
        cadence: 'Hebdomadaire',
        delay: 'Quelques jours',
        url: 'https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm',
      },
      {
        name: 'ODRE / données publiques énergie',
        role: 'Compléments électricité France et Allemagne selon disponibilité.',
        cadence: 'Variable',
        delay: 'Variable',
        url: 'https://opendata.reseaux-energies.fr/',
      },
    ],
    calculation: [
      "Chaque indicateur est comparé à son propre historique récent, puis orienté dans le sens du risque.",
      "Les sous-indices pétrole, gaz, électricité, positionnement et contexte sont calculés séparément.",
      "Le composite est une moyenne pondérée des sous-indices disponibles, renormalisée si une série devient stale.",
      "Une source indisponible ne fait pas planter le build : la dernière valeur connue est conservée et marquée stale.",
    ],
    formula:
      "stress_indicateur = ecart_a_la_normale + momentum_oriente_risque\n" +
      "sous_indice = moyenne des composants non stale\n" +
      "composite = moyenne pondérée des sous_indices disponibles, bornée 0-100",
    interpretation: [
      "Détendu : les séries suivies ne signalent pas de tension inhabituelle.",
      "Normal : les marchés ne sont pas calmes au sens absolu, mais restent dans leur régime récent.",
      "Tendu : plusieurs composantes s'écartent simultanément de leur comportement habituel.",
      "Crise : le stress est large, rapide ou concentré sur une composante critique.",
    ],
    limits: [
      "L'indice ne remplace pas une analyse géopolitique qualitative.",
      "Certaines séries gratuites ont des trous, délais ou changements de format.",
      "Le TTF européen propre est difficile à obtenir en API gratuite robuste.",
      "Les pondérations résument un régime de marché ; elles ne capturent pas tous les chocs locaux.",
      "Le score 0-100 mesure le stress énergétique relatif au régime de ses propres séries, pas une probabilité de crise comparable aux autres dashboards.",
    ],
    useFor: [
      "Suivre si un choc énergie se transmet réellement aux marchés observables.",
      "Distinguer un prix élevé d'une tension qui accélère.",
      "Repérer quelle poche, pétrole, gaz, électricité ou positionnement, porte le stress.",
    ],
    notFor: [
      "Mesurer le risque militaire ou diplomatique brut.",
      "Prévoir le prix du Brent, du gaz ou de l'électricité.",
      "Comparer directement des marchés locaux sans tenir compte de leur structure.",
    ],
    reproducibility: [
      "Builder Python sans dépendance externe, bibliothèque standard uniquement.",
      "Écriture atomique du snapshot pour éviter les fichiers servis à moitié.",
      "Les clés éventuelles restent côté serveur et ne sont jamais exposées au navigateur.",
    ],
  },
  {
    slug: 'debt-risk-radar',
    label: 'Debt Risk Radar',
    shortLabel: 'Debt Risk',
    eyebrow: '// dette souveraine et spreads',
    accent: 'blue',
    title: 'Debt Risk Radar : lire la dette comme un système de risque',
    description:
      'Méthodologie de Debt Risk Radar : dette publique, projections budgétaires, crédit privé, spreads et signaux de marché à partir de sources ouvertes et d’API gratuites.',
    question:
      'Dette publique, crédit privé, projections budgétaires et signaux de marché : où le risque de dette se tend-il ?',
    dashboardUrl: 'https://debt.l0g.fr',
    repoUrl: 'https://github.com/bluetouff/debt-risk-radar',
    updated: methodologyUpdated,
    quickRead: [
      'Le dashboard ne mesure pas une crise de dette unique ; il surveille plusieurs canaux qui peuvent se renforcer.',
      'Les séries institutionnelles donnent la structure lente : dette, déficit, intérêts, crédit privé, service de la dette.',
      'Les séries de marché donnent la partie nerveuse : taux, courbe, spreads, ETF et actifs sensibles au risque de refinancement.',
    ],
    sources: [
      {
        name: 'US Treasury Fiscal Data',
        role: 'Dette publique fédérale quotidienne, notamment Debt to the Penny.',
        cadence: 'Quotidienne',
        delay: 'Faible, selon publication Treasury',
        url: 'https://fiscaldata.treasury.gov/',
      },
      {
        name: 'FRED · Federal Reserve Bank of St. Louis',
        role: 'Dette / PIB, dette détenue par le public, déficit, intérêts, taux, courbe, spreads IG et HY.',
        cadence: 'Selon séries',
        delay: 'Variable',
        url: 'https://fred.stlouisfed.org/',
      },
      {
        name: 'BIS Data Portal',
        role: 'Credit-to-GDP gap et debt service ratios pour suivre le levier privé et la charge de dette.',
        cadence: 'Trimestrielle à annuelle selon série',
        delay: 'Variable',
        url: 'https://data.bis.org/',
      },
      {
        name: 'CBO Open Data',
        role: 'Projections budgétaires long terme : dette détenue par le public, dette brute, déficit et intérêts.',
        cadence: 'Selon publication CBO',
        delay: 'Publication officielle',
        url: 'https://www.cbo.gov/data/budget-economic-data',
      },
      {
        name: 'World Bank Open Data',
        role: 'Comparables internationaux annuels, notamment dette, croissance et agrégats macro.',
        cadence: 'Annuelle',
        delay: 'Variable selon pays et indicateur',
        url: 'https://data.worldbank.org/',
      },
      {
        name: 'Massive Market Data',
        role: 'Prix et ratios de marché : ETF obligataires, actions bancaires, spreads proxy et actifs sensibles au stress de dette.',
        cadence: 'À chaque consultation si clé configurée',
        delay: 'Selon couverture de marché',
        url: 'https://massive.com/',
      },
    ],
    calculation: [
      'Le score publié par l0g reprend le score de stress courant exposé par https://debt.l0g.fr/latest.json, pas une valeur codée côté navigateur.',
      'Dans le code du radar, les séries sont converties par zscore_latest(), notées par risk_points_from_z() ou risk_points_from_level(), regroupées par bucket_scores(), puis agrégées par overall_score().',
      'Chaque série est transformée en z-score glissant, cinq ans par défaut, dix ou trente ans pour certaines séries lentes BIS, World Bank ou CBO, puis orientée dans le sens du risque.',
      'Les indicateurs sont classés par familles : solvabilité fiscale, stress de taux et marché, levier privé, liquidité, comparables globaux, BIS, CBO et prix Massive.',
      'Le stress courant agrège les familles rapides et institutionnelles hors projections CBO : fiscal 22 %, taux et marché 18 %, levier privé 12 %, liquidité 10 %, Treasury daily 10 %, World Bank 4 %, BIS 10 %, Massive 4 %.',
      'Les projections CBO restent publiées comme vulnérabilité structurelle de long terme, mais elles ne tirent plus le score courant affiché dans le bandeau l0g.',
      'Les connecteurs optionnels ne bloquent pas le dashboard : si une famille courante manque, elle est imputée à 50 au lieu de renormaliser tout le score sur les seules familles disponibles.',
    ],
    formula:
      'z = (valeur - moyenne_5_ans) / ecart_type_5_ans\n' +
      'signed_z = z si une hausse augmente le risque, -z si une baisse augmente le risque\n' +
      'score_serie = clip(50 + signed_z x 15, 0, 100)\n' +
      'score_famille = moyenne ponderee des series disponibles dans la famille\n' +
      'score_structurel_cbo = score_famille des projections CBO\n' +
      'score_courant = moyenne ponderee des familles hors CBO, familles absentes = 50\n' +
      'seuils Debt Risk Radar : 50 elevated, 65 watch, 80 stress',
    interpretation: [
      'Un score bas indique que les séries suivies restent proches de leur régime récent ou orientées dans un sens moins risqué.',
      'Un score intermédiaire signale que certains canaux se tendent, sans stress large.',
      'Au-dessus des seuils watch et stress, il faut lire quelles familles portent le signal courant : fiscal, marché, crédit privé, liquidité ou comparables institutionnels.',
      'La trajectoire compte autant que le niveau : un score qui monte vite peut signaler un changement de régime avant que les ratios publics annuels ne bougent.',
    ],
    limits: [
      'Les séries fiscales et budgétaires sont lentes, révisées et parfois publiées avec retard.',
      'Les projections CBO ne sont pas des prévisions de marché ; elles reposent sur hypothèses légales, macroéconomiques et budgétaires, et sont lues séparément du stress courant.',
      'La stabilité en cas de sources manquantes est traitée par imputation neutre et couverture publiée ; les pondérations restent des choix de modèle explicites, pas des coefficients optimisés.',
      'Les données BIS et World Bank améliorent la comparaison internationale mais ne sont pas temps réel.',
      'Les prix de marché via Massive Market Data ajoutent de la réactivité, mais ne remplacent pas une analyse de liquidité, duration et bilan.',
      'Le score 0-100 est une lecture interne du risque de dette ; il ne se compare pas directement aux scores US Macro, Yen Carry ou Énergie.',
    ],
    useFor: [
      'Surveiller si le risque de dette vient plutôt de la solvabilité publique, des taux, du crédit privé ou du marché.',
      'Comparer la vulnérabilité CBO de long terme aux signaux plus rapides des spreads, taux, prix de marché et données Treasury.',
      'Construire une lecture de risque avant d’ouvrir les séries sources et les rapports budgétaires détaillés.',
    ],
    notFor: [
      'Prédire un défaut souverain ou un downgrade à date fixe.',
      'Remplacer une analyse pays, duration, devise, maturité ou structure de détenteurs.',
      'Produire un signal d’achat ou de vente sur obligations, ETF, banques ou devises.',
    ],
    reproducibility: [
      'Le code est publié dans un dépôt GitHub public.',
      'Les sources institutionnelles principales sont gratuites et documentées.',
      'Les clés FRED et Massive restent côté serveur dans l’environnement systemd, jamais dans le dépôt ni dans le navigateur.',
      'Streamlit écoute uniquement en local derrière Apache, avec service systemd dédié et port applicatif non exposé.',
    ],
  },
  {
    slug: 'euro-macro',
    label: 'EU Macro Dashboard',
    shortLabel: 'Euro Macro',
    eyebrow: '// macro zone euro',
    accent: 'blue',
    title: 'EU Macro Dashboard : un thermomètre du risque macro européen',
    description:
      'Méthodologie du dashboard macro zone euro : indicateurs BCE et Eurostat, z-scores glissants, score 0-100 et signaux avancés.',
    question:
      "La zone euro glisse-t-elle vers un régime de stress macro, indicateur par indicateur ?",
    dashboardUrl: 'https://euro.l0g.fr',
    repoUrl: 'https://github.com/bluetouff/euro-macro-dashboard',
    updated: methodologyUpdated,
    quickRead: [
      "Le dashboard compare chaque série à son propre comportement des cinq dernières années.",
      "La couleur d'une tuile indique un écart orienté risque, pas un jugement absolu.",
      "Le score global sert à situer un régime, jamais à remplacer la lecture des sous-composantes.",
    ],
    sources: [
      {
        name: 'BCE · ECB Data Portal',
        role: 'Taux, €STR, CISS, rendements souverains, monnaie, crédit et variables financières.',
        cadence: 'Selon séries',
        delay: 'Variable',
        url: 'https://data.ecb.europa.eu/',
      },
      {
        name: 'Eurostat',
        role: 'HICP, production industrielle, ventes de détail, confiance, ESI, faillites.',
        cadence: 'Mensuelle à trimestrielle',
        delay: 'Variable selon publication',
        url: 'https://ec.europa.eu/eurostat',
      },
      {
        name: 'CEPR',
        role: 'Datation des récessions zone euro utilisée pour lecture historique.',
        cadence: 'Ponctuelle',
        delay: 'Ex post',
        url: 'https://cepr.org/',
      },
    ],
    calculation: [
      "Une trentaine d'indicateurs sont récupérés depuis des sources officielles gratuites et sans clé.",
      "Chaque série est transformée en z-score glissant sur cinq ans, puis orientée dans le sens du risque.",
      "Les indicateurs sont agrégés en score 0-100 et reconstruits historiquement depuis 2008 quand les données le permettent.",
      "Les signaux avancés, comme pente des taux, monnaie ou anticipations d'emploi, sont distingués des indicateurs coïncidents.",
    ],
    formula:
      "z = (valeur - moyenne_5_ans) / ecart_type_5_ans\n" +
      "stress = z orienté dans le sens du risque\n" +
      "score_global = agrégation bornée 0-100 des stress disponibles",
    interpretation: [
      "Moins de 45 : expansion ou environnement peu stressé.",
      "45 à 55 : zone neutre, signal composite sans direction forte.",
      "55 à 70 : prudence, plusieurs séries commencent à se tendre.",
      "Plus de 70 : stress macro large ou intense.",
    ],
    limits: [
      "Les données européennes arrivent souvent avec retard, surtout les séries réelles.",
      "Les révisions statistiques peuvent modifier la lecture historique.",
      "Un z-score à cinq ans peut banaliser une tension durable si le régime a changé.",
      "Le score global peut masquer des divergences fortes entre pays de la zone euro.",
      "Le score 0-100 est une échelle interne au dashboard euro ; il ne vaut pas équivalence statistique avec US Macro, Yen Carry ou Énergie.",
    ],
    useFor: [
      "Situer rapidement le régime macro zone euro.",
      "Identifier les poches qui tirent le stress : crédit, taux, activité, sentiment ou marchés.",
      "Comparer l'état européen avec les lectures US, énergie et liquidité.",
    ],
    notFor: [
      "Prédire une récession à date fixe.",
      "Résumer la situation de chaque pays de la zone euro.",
      "Remplacer les communiqués BCE, Eurostat et analyses nationales.",
    ],
    reproducibility: [
      "Version web statique : un script Python génère un snapshot, la page HTML le lit.",
      "Aucune clé API ni secret requis pour les sources principales.",
      "Le PMI propriétaire est remplacé par l'ESI officiel et gratuit.",
    ],
  },
  {
    slug: 'us-macro',
    label: 'US Macro Dashboard',
    shortLabel: 'US Macro',
    eyebrow: '// macro américaine',
    accent: 'teal',
    title: 'US Macro Dashboard : lire le régime macro américain',
    description:
      'Méthodologie du dashboard macro US : séries FRED, z-scores, backtest historique et conversion du score dans le bandeau l0g.',
    question:
      "Croissance, inflation, emploi, conditions financières : où pointe le risque macro américain ?",
    dashboardUrl: 'https://us.l0g.fr',
    repoUrl: 'https://github.com/bluetouff/macro_dashboard',
    updated: methodologyUpdated,
    quickRead: [
      "Le dashboard agrège des séries FRED dans une lecture de stress macro américain.",
      "Le score source est un z-score signé centré sur 0 ; l0g le convertit en échelle 0-100 pour le bandeau consolidé.",
      "La valeur utile est autant dans les composantes que dans le chiffre final.",
    ],
    sources: [
      {
        name: 'FRED · Federal Reserve Bank of St. Louis',
        role: 'Catalogue principal de séries macro, taux, inflation, activité, emploi et conditions financières.',
        cadence: 'Selon séries',
        delay: 'Variable',
        url: 'https://fred.stlouisfed.org/',
      },
      {
        name: 'NBER',
        role: 'Datation des récessions américaines utilisée pour calibration et lecture historique.',
        cadence: 'Ponctuelle',
        delay: 'Ex post',
        url: 'https://www.nber.org/research/business-cycle-dating',
      },
    ],
    calculation: [
      "Les séries sont téléchargées depuis FRED, mises en cache, puis transformées selon les règles du catalogue local.",
      "Chaque indicateur contribue à un stress signé, pondéré par famille macro.",
      "Le score est calibré sur l'historique et les récessions NBER pour vérifier sa capacité à signaler les régimes passés.",
      "Le moteur combine écart à la normale, drift et momentum par moyenne pondérée des composantes disponibles, au lieu de retenir mécaniquement le signal le plus élevé.",
      "Le backtest mesure aussi les alertes hors fenêtre de récession et pénalise les séries qui produisent trop de faux positifs.",
      "Pour l'API l0g, le z-score source est projeté sur une échelle 0-100 en respectant les seuils d'alerte de l'application.",
    ],
    formula:
      "z_source = moyenne pondérée des stress par série\n" +
      "conversion l0g :\n" +
      "0   -> 30\n" +
      "1.5 -> 55\n" +
      "2.5 -> 75\n" +
      "interpolation linéaire, bornée 0-100",
    interpretation: [
      "Un score bas indique un régime macro moins tendu, pas une absence de risque financier.",
      "Autour des seuils d'alerte, il faut regarder quelles familles tirent le mouvement.",
      "Une hausse rapide du score compte souvent plus qu'un niveau isolé.",
    ],
    limits: [
      "FRED agrège des séries dont les calendriers, révisions et définitions varient.",
      "Les récessions NBER sont datées ex post ; elles ne constituent pas une vérité temps réel.",
      "La calibration repose sur quatre récessions seulement ; la pénalité de faux positifs réduit le sur-apprentissage mais ne transforme pas l'échantillon en preuve statistique large.",
      "La moyenne pondérée z-score, drift et momentum réduit le biais d'alerte, mais reste sensible au choix des poids de composantes.",
      "Un choc de marché peut précéder les séries macro mensuelles.",
      "La conversion 0-100 est une normalisation l0g, pas l'échelle native du dashboard.",
      "Le score 0-100 sert au bandeau de lecture ; il ne rend pas le risque US statistiquement équivalent aux autres instruments.",
    ],
    useFor: [
      "Situer le régime macro américain en un coup d'œil.",
      "Surveiller les familles de séries qui passent en stress.",
      "Comparer le risque US aux lectures euro, yen et énergie.",
    ],
    notFor: [
      "Prédire la prochaine décision de la Fed.",
      "Se substituer aux publications BLS, BEA, Fed ou NBER.",
      "Produire un signal d'achat ou de vente.",
    ],
    reproducibility: [
      "Le dépôt documente les fichiers de catalogue, données et calcul.",
      "La clé FRED reste côté environnement et n'est pas codée en dur.",
      "Le cache accélère les relances sans modifier la méthode.",
    ],
  },
];

export const methodologyBySlug = new Map(methodologyPages.map((page) => [page.slug, page]));

export function methodologyUrl(slug: string): string {
  return `/methodologie/${slug}/`;
}
