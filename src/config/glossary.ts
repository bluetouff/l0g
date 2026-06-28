export interface GlossarySourceEntry { sigle: string; nom: string; def: string; guide?: string; }
export interface GlossarySourceSection { titre: string; accent: string; entries: GlossarySourceEntry[]; }

const rawGlossarySections: GlossarySourceSection[] = [
  {
    titre: 'Macro & banques centrales',
    accent: 'var(--color-signal)',
    entries: [
      { sigle: 'CPI', nom: 'Consumer Price Index', def: "Indice des prix à la consommation américain, publié par le BLS. Mesure l'évolution du panier de biens et services des ménages. Équivalent de l'IPC français." },
      { sigle: 'IPC', nom: 'Indice des prix à la consommation', def: "Mesure française et européenne de l'inflation vécue par les ménages. Pendant du CPI américain." },
      { sigle: 'PIB', nom: 'Produit intérieur brut', def: "Valeur totale des biens et services produits dans un pays sur une période. Mesure de référence de l'activité économique." },
      { sigle: 'BCE', nom: 'Banque centrale européenne', def: "Institution qui conduit la politique monétaire de la zone euro : fixation des taux directeurs, contrôle de l'inflation." },
      { sigle: 'BoJ', nom: 'Bank of Japan', def: "Banque centrale du Japon. Fixe la politique monétaire japonaise, pilote les achats ou ventes d'actifs et peut agir comme agent opérationnel lors d'interventions de change décidées par le ministère des Finances." },
      { sigle: 'MoF', nom: 'Ministry of Finance Japan', def: "Ministère japonais des Finances. Autorité responsable de la politique de change et des décisions d'intervention sur le yen." },
      { sigle: 'FMI', nom: 'Fonds monétaire international', def: "Institution multilatérale qui surveille le système monétaire mondial et prête aux États en difficulté de balance des paiements." },
      { sigle: 'BIS', nom: 'Bank for International Settlements', def: "Banque des règlements internationaux, à Bâle. La « banque centrale des banques centrales », référence pour les statistiques bancaires et de dette mondiales." },
      { sigle: 'ADB', nom: 'Asian Development Bank', def: "Banque asiatique de développement, à Manille. Référence pour les prévisions de croissance et d'inflation de la région Asie-Pacifique." },
      { sigle: 'OAT', nom: 'Obligation assimilable du Trésor', def: "Titre de dette émis par l'État français à moyen et long terme. Son taux sert de référence au coût d'emprunt de la France." },
      { sigle: 'INSEE', nom: "Institut national de la statistique et des études économiques", def: "Producteur officiel des statistiques économiques et démographiques françaises (inflation, croissance, emploi)." },
      { sigle: 'EIA', nom: 'Energy Information Administration', def: "Agence statistique du département américain de l'Énergie. Référence pour les données pétrole, gaz et énergie." },
      { sigle: 'IEA', nom: 'International Energy Agency', def: "Agence internationale de l'énergie, basée à Paris. Analyses et projections sur les marchés énergétiques mondiaux." },
      { sigle: 'FOMC', nom: 'Federal Open Market Committee', def: "Comité de politique monétaire de la Fed, qui fixe les taux directeurs. Se réunit huit fois par an, dont quatre réunions accompagnées de projections." },
      { sigle: 'SEP', nom: 'Summary of Economic Projections', def: "Projections trimestrielles des membres du FOMC (croissance, chômage, inflation, taux), publiées en mars, juin, septembre et décembre. Inclut le fameux dot plot, le nuage de points où chaque membre situe le taux qu'il juge approprié." },
      { sigle: 'FFR', nom: 'Federal Funds Rate', def: "Taux directeur de la Fed : fourchette cible pour le taux au jour le jour entre banques. Principal levier de la politique monétaire américaine." },
      { sigle: 'QE', nom: 'Quantitative Easing', def: "Assouplissement quantitatif : achats massifs d'obligations par la banque centrale pour injecter des liquidités et peser sur les taux longs." },
      { sigle: 'H.4.1', nom: 'Factors Affecting Reserve Balances', def: "Relevé statistique hebdomadaire de la Réserve fédérale détaillant son bilan : titres détenus, prises en pension, prêts et lignes de swap à l'actif ; monnaie en circulation, compte du Trésor, prises en pension inverse et réserves bancaires au passif. Publié le jeudi à 16 h 30 heure de New York." },
      { sigle: 'Réserves bancaires', nom: 'Dépôts des institutions de dépôt à la Fed', def: "Dépôts que les banques détiennent à la Réserve fédérale, liquidité ultime de règlement. Dans le bilan de la Fed, elles sont un résidu : l'actif de la banque centrale moins la monnaie en circulation, le compte du Trésor et les prises en pension inverse." },
      { sigle: 'QT', nom: 'Quantitative Tightening', def: "Resserrement quantitatif, l'inverse du QE : la banque centrale laisse filer ou vend ses obligations, retirant des liquidités du système et tendant les taux longs." },
      { sigle: 'Liquidité nette', nom: 'Net liquidity', def: "Indicateur suivi par les marchés : bilan de la Réserve fédérale diminué du compte du Trésor (TGA) et des prises en pension inversées (RRP). Proxy de la liquidité disponible, utile en tendance mais trompeur aux retournements.", guide: '/guides/liquidite-tresor-dts-tga-rrp/' },
      { sigle: 'TGA', nom: 'Treasury General Account', def: "Compte courant de l'État fédéral américain à la Réserve fédérale. Quand il gonfle (émissions de dette), il draine les réserves bancaires ; quand il baisse (dépenses), il en réinjecte." },
      { sigle: 'RRP', nom: 'Reverse Repo (ON RRP)', def: "Facilité de prises en pension inversées au jour le jour de la Fed, où les fonds monétaires placent leur cash. Longtemps amortisseur de liquidité, tombée près de zéro en 2025." },
      { sigle: 'DTS', nom: 'Daily Treasury Statement', def: "Relevé quotidien du Trésor américain (Bureau of the Fiscal Service) détaillant encaissements, décaissements et solde de trésorerie. Source primaire pour suivre le TGA au jour le jour." },
      { sigle: 'Réhypothécation', nom: 'Réutilisation du collatéral', def: "Droit, pour celui qui reçoit un titre en garantie, de le redonner lui-même en garantie d'un autre engagement. Un même titre garantit alors plusieurs créances superposées, formant des chaînes de collatéral. Crée de la liquidité, mais aussi du levier caché et un risque de blocage en cascade." },
      { sigle: 'Vélocité du collatéral', nom: 'Velocity of collateral', def: "Rapport entre le volume total de collatéral reçu par les intermédiaires et le collatéral d'origine. Mesure de l'intensité de la réutilisation, sur le modèle de la vitesse de circulation de la monnaie. Estimée autour de 3 avant 2008, en baisse après Lehman, puis en rebond. Concept proposé par Manmohan Singh (FMI)." },
      { sigle: 'Repo', nom: 'Pension livrée (repurchase agreement)', def: "Vente d'un titre, le plus souvent une obligation du Trésor, assortie d'un rachat le lendemain à un prix légèrement supérieur. Prêt de cash garanti par le collatéral, brique de base du financement de marché au jour le jour." },
      { sigle: 'SRF', nom: 'Standing Repo Facility / Standing Repo Program', def: "Facilité permanente de la Fed permettant aux contreparties éligibles d'emprunter du cash contre Treasuries et MBS d'agence. Agit comme plafond sur les taux courts. Plafond agrégé supprimé et passage en allotissement intégral le 10 décembre 2025." },
      { sigle: 'IORB', nom: 'Interest On Reserve Balances', def: "Taux auquel la Fed rémunère les réserves que les banques détiennent chez elle. Outil central de pilotage des taux courts dans le régime de réserves abondantes : les banques n'ont guère intérêt à prêter en dessous." },
      { sigle: 'EFFR', nom: 'Effective Federal Funds Rate', def: "Taux effectif moyen des prêts en blanc au jour le jour entre banques américaines. Cible opérationnelle de la politique monétaire, encadrée par l'IORB, le RRP et le SRP." },
      { sigle: 'COFER', nom: 'Currency Composition of Official Foreign Exchange Reserves', def: "Base trimestrielle du FMI mesurant la composition en devises des réserves de change mondiales, hors or. Le dollar y pèse encore autour de 58 pour cent en 2025, contre près de 70 pour cent en 2000. À distinguer de la part de l'or, mesurée sur les réserves totales." },
      { sigle: 'Dédollarisation', nom: 'Diversification hors du dollar', def: "Réduction progressive de la part du dollar dans les réserves, les échanges et les financements, au profit d'autres devises et de l'or. Mouvement graduel et partiel, accéléré par la crainte des sanctions depuis 2022, plus qu'un abandon brutal du billet vert." },
      { sigle: 'Eurodollar', nom: 'Dollar offshore', def: "Dollar détenu ou prêté hors du système bancaire américain, sans lien avec la monnaie euro. Couche internationale du dollar, née dans les années 1950-1960, largement hors du champ direct de la Fed. Le crédit dollar aux non-banques hors US atteignait 14 300 milliards de dollars fin 2025." },
      { sigle: 'CIP', nom: 'Covered Interest Parity (parité couverte des taux)', def: "Relation théorique selon laquelle emprunter une devise directement ou la fabriquer en passant par une autre devise et un contrat à terme doit revenir au même. Considérée comme quasi inviolable avant 2008, elle ne tient plus depuis." },
      { sigle: 'Cross-currency basis', nom: 'Base cross-devises', def: "Écart résiduel quand la parité couverte des taux ne tient pas : prime payée pour obtenir des dollars en synthétique via un swap de change. Thermomètre du stress de financement en dollar, négatif et persistant depuis 2008, qui se creuse aux dates de bilan et en crise." },
      { sigle: 'Swap de change', nom: 'FX swap', def: "Échange de devises au comptant assorti de l'opération inverse à terme. Économiquement proche d'un repo, avec une devise comme collatéral, mais enregistré hors bilan. Source d'une dette dollar « manquante » estimée par la BIS à des dizaines de milliers de milliards." },
      { sigle: 'SOFR', nom: 'Secured Overnight Financing Rate', def: "Taux de référence des financements garantis au jour le jour aux États-Unis, adossé aux pensions sur Treasuries. Thermomètre des tensions sur le marché du financement." },
      { sigle: 'PCE', nom: 'Personal Consumption Expenditures', def: "Indice des prix des dépenses de consommation, mesure d'inflation préférée de la Fed pour sa cible de 2 %, distincte de l'IPC." },
    ],
  },
  {
    titre: 'Crédit privé & marchés',
    accent: '#ff4d87',
    entries: [
      { sigle: 'Crédit privé', nom: 'Private credit', def: "Prêts accordés directement par des gérants non bancaires à des entreprises, sans cotation ni marché secondaire actif. Marché illiquide, peu réglementé et valorisé au modèle, de l'ordre de 1 300 milliards de dollars aux États-Unis.", guide: '/guides/analyser-credit-prive/' },
      { sigle: 'BDC', nom: 'Business Development Company', def: "Véhicule coté américain qui prête aux entreprises de taille moyenne. Pilier du crédit privé, souvent à effet de levier." },
      { sigle: 'Interval fund', nom: 'Fonds à intervalle', def: "Fonds semi-liquide qui n'autorise les rachats que par fenêtres périodiques et plafonnées. Tout en détenant des actifs illiquides, d'où un risque de gating en cas d'afflux de sorties." },
      { sigle: 'NAV', nom: 'Net Asset Value', def: "Valeur nette d'inventaire : valeur des actifs d'un fonds moins ses dettes. Pour les fonds privés, elle est estimée et non cotée, d'où des questions d'opacité." },
      { sigle: 'NAV loan', nom: 'Prêt sur valeur liquidative', def: "Emprunt contracté par un fonds contre la valeur liquidative de l'ensemble de son portefeuille, souvent pour financer distributions ou rachats. Levier ajouté au niveau du fonds, peu visible." },
      { sigle: 'AUM', nom: 'Assets Under Management', def: "Encours sous gestion : montant total des actifs gérés par un fonds ou une société de gestion." },
      { sigle: 'PIK', nom: 'Payment In Kind', def: "Paiement en nature : intérêts d'une dette versés non en cash mais en dette supplémentaire. Signal de tension sur la trésorerie de l'emprunteur." },
      { sigle: 'LP', nom: 'Limited Partner', def: "Investisseur commanditaire d'un fonds (assureur, fonds de pension, family office) qui apporte le capital sans gérer." },
      { sigle: 'ETF', nom: 'Exchange-Traded Fund', def: "Fonds indiciel coté en bourse, qui réplique un indice ou un panier d'actifs et se négocie comme une action." },
      { sigle: 'Yen carry', nom: 'Yen carry trade', def: "Stratégie qui consiste à emprunter en yen, devise historiquement peu rémunérée, pour acheter des actifs ou devises offrant un rendement supérieur. Fonctionne tant que le yen reste faible et que la volatilité demeure contenue." },
      { sigle: 'LME metals', nom: 'London Metal Exchange', def: "Bourse londonienne des métaux industriels. Son contrat cuivre sert de référence mondiale pour le prix physique et financier du cuivre." },
      { sigle: 'ICSG', nom: 'International Copper Study Group', def: "Organisation intergouvernementale qui publie les statistiques mondiales de production, d'usage, de stocks et de prix du cuivre." },
      { sigle: 'SX-EW', nom: 'Solvent Extraction Electrowinning', def: "Procédé hydrométallurgique d'extraction du cuivre : le minerai est lixivié, souvent avec de l'acide sulfurique, puis le métal est récupéré par électrolyse." },
      { sigle: 'Financement circulaire', nom: 'Circular financing', def: "Arrangement où un petit groupe d'acteurs interconnectés s'investissent et se facturent mutuellement, si bien que le capital injecté revient en chiffre d'affaires. Peut donner l'apparence d'une demande organique. Au cœur du débat sur les valorisations de l'IA en 2025-2026." },
      { sigle: 'Vendor financing', nom: 'Financement fournisseur', def: "Pratique par laquelle un fournisseur finance ses propres clients (prêts, prises de participation, garanties d'achat) pour soutenir la demande de ses produits. Légitime en soi, elle peut masquer la fragilité de la demande réelle, comme lors de la bulle télécoms des années 1990." },
      { sigle: 'IPO', nom: 'Initial Public Offering', def: "Introduction en bourse : première mise sur le marché des actions d'une société auprès du public." },
      { sigle: 'NDFI', nom: 'Non-Depository Financial Institution', def: "Institution financière non bancaire (fonds de crédit privé, assureurs). Au cœur du « shadow banking » car peu régulée comme les banques." },
      { sigle: 'AIMA', nom: 'Alternative Investment Management Association', def: "Association professionnelle mondiale des gérants d'actifs alternatifs (hedge funds, crédit privé)." },
      { sigle: 'NBFI', nom: 'Non-Bank Financial Intermediation (intermédiation financière non bancaire)', def: "Ensemble des acteurs qui font du crédit ou de la transformation d'épargne hors du système bancaire : fonds monétaires, hedge funds, fonds d'investissement, assureurs, crédit privé, véhicules de titrisation. Terme préféré par les régulateurs à « shadow banking ». Pesait 256 800 milliards de dollars fin 2024, soit 51 pour cent des actifs financiers mondiaux." },
      { sigle: 'FSB', nom: 'Financial Stability Board', def: "Conseil de stabilité financière, qui coordonne au niveau international la surveillance des risques systémiques." },
      { sigle: 'PCDR', nom: 'Private Credit Default Rate', def: "Indice de Fitch mesurant le taux de défaut sur environ 1 200 emprunteurs du middle market dans le crédit privé. Mesure élargie du défaut, plus complète que le seul défaut de paiement." },
      { sigle: 'PMR', nom: 'Privately Monitored Rating', def: "Composante de l'univers Fitch portant sur les plus gros emprunteurs sous LBO notés en privé. Son taux de défaut est structurellement plus élevé que l'indice large PCDR." },
      { sigle: 'LME', nom: 'Liability Management Exercise', def: "Gestion de passif hors tribunal (échange de dette, extension de maturité, rachat sous le pair) qui permet d'éviter ou de repousser un défaut formel. Devenue le mode dominant de traitement de la détresse dans le crédit privé." },
      { sigle: 'LBO', nom: 'Leveraged Buyout', def: "Rachat d'entreprise financé majoritairement par de la dette, remboursée par les flux de trésorerie de la cible." },
      { sigle: 'SPV', nom: 'Special Purpose Vehicle', def: "Véhicule ad hoc créé pour isoler un actif ou un financement. Sert par exemple à acheter du matériel puis à le louer, en gardant la dette hors du bilan de l'utilisateur." },
      { sigle: 'EBITDA', nom: 'Earnings Before Interest, Taxes, Depreciation and Amortization', def: "Résultat avant intérêts, impôts, dépréciations et amortissements. Proxy de la génération de cash opérationnel, sur lequel on dimensionne la dette." },
    ],
  },
  {
    titre: 'Crypto & stablecoins',
    accent: 'var(--color-amber)',
    entries: [
      { sigle: 'BTC', nom: 'Bitcoin', def: "Première cryptomonnaie, décentralisée, à offre plafonnée à 21 millions d'unités. Distincte de l'écosystème DeFi par sa conception." },
      { sigle: 'ETH', nom: 'Ether', def: "Cryptomonnaie native de la blockchain Ethereum, qui sert à payer les transactions et fait tourner les contrats intelligents." },
      { sigle: 'Stablecoin', nom: 'Jeton stable', def: "Jeton numérique adossé un pour un à une monnaie (le dollar dans près de 99 % des cas) et remboursable au pair. Sa valeur ne tient qu'à la qualité et à la liquidité de ses réserves.", guide: '/guides/stablecoins-genius-act/' },
      { sigle: 'WLFI', nom: 'World Liberty Financial', def: "Plateforme crypto liée à la famille Trump, émettrice du stablecoin USD1 et du jeton de gouvernance WLFI. Une entité du président en détient une large part et capte une fraction majeure du produit des ventes de jetons." },
      { sigle: 'Memecoin', nom: 'Jeton mème', def: "Crypto-actif sans utilité sous-jacente claire, dont la valeur repose sur la notoriété, le sentiment social ou une figure publique. Le jeton à l'effigie de Donald Trump en est l'exemple le plus médiatisé." },
      { sigle: 'USDT', nom: 'Tether', def: "Plus grand stablecoin en circulation, censé valoir un dollar. Émis par Tether, souvent au cœur des débats sur la transparence des réserves." },
      { sigle: 'USDC', nom: 'USD Coin', def: "Stablecoin adossé au dollar émis par Circle, présenté comme plus transparent sur ses réserves que l'USDT." },
      { sigle: 'RLUSD', nom: 'Ripple USD', def: "Stablecoin dollar émis par Ripple, plus récent, adossé à des liquidités et bons du Trésor." },
      { sigle: 'TVL', nom: 'Total Value Locked', def: "Valeur totale verrouillée dans un protocole DeFi : montant des actifs déposés. Mesure d'adoption, mais sensible aux effets de levier." },
      { sigle: 'DAO', nom: 'Decentralized Autonomous Organization', def: "Organisation autonome décentralisée : structure gouvernée par des votes on-chain plutôt que par une hiérarchie classique." },
      { sigle: 'RWA', nom: 'Real World Assets', def: "Actifs du monde réel (obligations, immobilier) tokenisés sur une blockchain pour être échangés on-chain." },
      { sigle: 'DeFi', nom: 'Decentralized Finance', def: "Finance décentralisée : services financiers (prêt, échange) opérés par des contrats intelligents sans intermédiaire bancaire." },
      { sigle: 'MiCA', nom: 'Markets in Crypto-Assets', def: "Règlement (UE) 2023/1114, cadre unifié de l'Union pour les crypto-actifs non couverts par la réglementation financière existante. Un agrément national ouvre un passeport vers les 27 États membres.", guide: '/guides/mica-sigle-par-sigle/' },
      { sigle: 'CASP', nom: 'Crypto-Asset Service Provider', def: "Prestataire de services sur crypto-actifs (échange, conservation, exécution) soumis à agrément sous MiCA." },
      { sigle: 'ART', nom: 'Asset-Referenced Token', def: "Stablecoin adossé à un panier d'actifs (devises, matières premières, crypto), par opposition à l'EMT adossé à une seule monnaie." },
      { sigle: 'EMT', nom: 'E-Money Token', def: "Stablecoin indexé 1:1 sur une seule monnaie fiduciaire (EURC, USDC), régime le plus strict sous MiCA." },
      { sigle: 'ESMA', nom: 'European Securities and Markets Authority', def: "Autorité européenne des marchés financiers : coordonne l'application harmonisée de MiCA et tient le registre des agréments." },
      { sigle: 'EBA', nom: 'European Banking Authority', def: "Autorité bancaire européenne : supervise directement les émetteurs de stablecoins jugés significatifs sous MiCA et fixe les normes prudentielles de réserves et de fonds propres." },
      { sigle: 'NCA', nom: 'National Competent Authority', def: "Autorité nationale compétente (AMF en France, HCMC en Grèce) qui délivre l'agrément MiCA ouvrant le passeport européen." },
      { sigle: 'MCP', nom: 'Model Context Protocol', def: "Standard ouvert d'Anthropic (novembre 2024, JSON-RPC 2.0) reliant une IA à des outils et données externes. Confié à la Linux Foundation (AAIF) en décembre 2025. Adopté par OpenAI, Google et Microsoft." },
      { sigle: 'A2A', nom: 'Agent2Agent', def: "Protocole ouvert lancé par Google en avril 2025 permettant à des agents IA de fournisseurs différents de se découvrir, s'authentifier et se déléguer des tâches. Confié à la Linux Foundation en juin 2025." },
      { sigle: 'x402', nom: 'HTTP 402 Payment', def: "Standard ouvert de Coinbase (mai 2025) incrustant un paiement en stablecoin dans la requête HTTP, sans compte ni clé d'API, en réactivant le code 402 « Payment Required »." },
      { sigle: 'AP2', nom: 'Agent Payments Protocol', def: "Protocole de paiement agentique de Google (2025) ; x402 en est le facilitateur stablecoin. Orchestre l'autorisation et le règlement d'achats initiés par des agents." },
      { sigle: 'ACP', nom: 'Agentic Commerce Protocol', def: "Protocole co-développé par OpenAI et Stripe (septembre 2025), socle du Instant Checkout de ChatGPT pour des achats initiés par un agent." },
      { sigle: 'CBDC', nom: 'Central Bank Digital Currency', def: "Monnaie numérique de banque centrale. L'euro numérique de la BCE en est l'exemple européen, visant une première émission potentielle en 2029." },
    ],
  },
  {
    titre: 'Énergie & géopolitique',
    accent: 'var(--color-amber)',
    entries: [
      { sigle: 'WTI', nom: 'West Texas Intermediate', def: "Pétrole brut de référence américain, coté à New York. Avec le Brent, l'un des deux prix de référence mondiaux." },
      { sigle: 'Brent', nom: 'Brent Crude', def: "Pétrole brut de référence mondial, issu de la mer du Nord et coté à Londres. Avec le WTI, l'un des deux prix de référence du marché pétrolier." },
      { sigle: 'GNL', nom: 'Gaz naturel liquéfié', def: "Gaz refroidi à l'état liquide pour le transport par méthanier. Permet d'exporter le gaz hors gazoducs." },
      { sigle: 'GPL', nom: 'Gaz de pétrole liquéfié', def: "Mélange de propane et de butane liquéfié sous pression, utilisé pour le chauffage, la cuisson et certains transports. Distinct du GNL." },
      { sigle: 'OPEP', nom: 'Organisation des pays exportateurs de pétrole', def: "Cartel de producteurs (Arabie saoudite, etc.) qui coordonne les quotas de production pour influencer le prix du baril." },
      { sigle: 'IRGC', nom: 'Islamic Revolutionary Guard Corps', def: "Gardiens de la révolution islamique : force armée d'élite iranienne, acteur clé des tensions dans le détroit d'Ormuz." },
      { sigle: 'MOU', nom: 'Memorandum of Understanding', def: "Mémorandum d'entente : accord écrit fixant des engagements entre parties, sans toujours la force contraignante d'un traité. Exemple : le MOU USA-Iran du 17 juin 2026." },
      { sigle: 'FAO', nom: "Food and Agriculture Organization", def: "Organisation des Nations unies pour l'alimentation et l'agriculture. Référence sur les prix alimentaires mondiaux et la sécurité alimentaire." },
      { sigle: 'WFP', nom: 'World Food Programme', def: "Programme alimentaire mondial de l'ONU, en charge de l'aide alimentaire d'urgence." },
      { sigle: 'PNUD', nom: 'Programme des Nations unies pour le développement', def: "Agence de l'ONU pilotant l'aide au développement ; publie des estimations sur la pauvreté et l'impact économique des crises." },
    ],
  },
  {
    titre: 'Régulation & institutions US',
    accent: '#7aa2f7',
    entries: [
      { sigle: 'SEC', nom: 'Securities and Exchange Commission', def: "Gendarme boursier américain. Supervise les marchés, les introductions en bourse et les obligations de transparence des sociétés cotées." },
      { sigle: 'Basis trade', nom: 'Arbitrage de base sur Treasuries', def: "Arbitrage à effet de levier qui capte l'écart de prix entre une obligation du Trésor au comptant et son contrat à terme : achat du titre au comptant, vente du futures, financement en repo. Apporte de la liquidité en temps normal, amplifie le stress en cas de débouclage forcé." },
      { sigle: 'FICC', nom: 'Fixed Income Clearing Corporation', def: "Chambre de compensation des titres à revenu fixe américains, filiale de la DTCC. Longtemps seule contrepartie centrale agréée pour les Treasuries, avant l'arrivée de CME et ICE. Au cœur du mandat de compensation obligatoire de la SEC." },
      { sigle: 'CCP', nom: 'Central Counterparty (contrepartie centrale)', def: "Chambre de compensation qui s'interpose entre acheteur et vendeur, devenant contrepartie de chaque transaction. Réduit le risque de contrepartie et organise la gestion de défaut, au prix d'appels de marge plus systématiques." },
      { sigle: 'COT', nom: 'Commitments of Traders', def: "Relevé hebdomadaire de la CFTC détaillant, par catégorie d'intervenant, les positions ouvertes sur les marchés à terme américains. Publié le vendredi à 15 h 30 heure de New York, sur données arrêtées au mardi précédent, soit un décalage de trois jours." },
      { sigle: 'Future', nom: 'Contrat à terme', def: "Contrat standardisé d'achat ou de vente d'un actif à une date future et un prix fixé d'avance, négocié sur un marché organisé. Sert à se couvrir ou à spéculer. Le positionnement sur ces contrats est ce que mesure le COT." },
      { sigle: 'Open interest', nom: 'Position ouverte', def: "Nombre total de contrats à terme ouverts et non encore dénoués à un instant donné. Le total des positions longues y égale toujours le total des positions courtes. Masse que le COT répartit entre catégories de traders." },
      { sigle: 'CFTC', nom: 'Commodity Futures Trading Commission', def: "Régulateur américain des marchés de dérivés et de matières premières. Publie le rapport de positionnement « Commitment of Traders »." },
      { sigle: 'OFAC', nom: 'Office of Foreign Assets Control', def: "Bureau du Trésor américain chargé d'appliquer les sanctions économiques (gel d'avoirs, listes noires).", guide: '/guides/ofac-sdn-list/' },
      { sigle: 'SDN List', nom: 'Specially Designated Nationals and Blocked Persons List', def: "Liste de l'OFAC recensant les personnes et entités avec lesquelles tout ressortissant américain a interdiction de traiter, et dont les avoirs sous juridiction américaine sont gelés.", guide: '/guides/ofac-sdn-list/' },
      { sigle: 'IEEPA', nom: 'International Emergency Economic Powers Act', def: "Loi américaine de 1977 servant de base juridique à de nombreuses sanctions. En 2024-2025, les tribunaux ont jugé qu'elle ne permet pas de sanctionner des contrats intelligents immuables (affaire Tornado Cash)." },
      { sigle: '13F', nom: 'Formulaire 13F', def: "Déclaration trimestrielle imposée par la SEC aux gérants institutionnels exerçant un pouvoir de décision sur plus de 100 millions de dollars de titres américains éligibles. Liste leurs positions longues, avec jusqu'à 45 jours de retard.", guide: '/guides/analyser-13f-sec/' },
      { sigle: 'Form 4', nom: 'Statement of Changes in Beneficial Ownership', def: "Déclaration SEC des transactions d'initiés (dirigeants, administrateurs, actionnaires à plus de 10 %), à déposer dans les deux jours ouvrés. Donnée directionnelle et bien plus fraîche que le 13F.", guide: '/guides/analyser-form-4-sec/' },
      { sigle: '13D', nom: 'Schedule 13D', def: "Déclaration SEC de franchissement de 5 % du capital avec intention d'influence ou de contrôle. Formulaire long de l'activiste ; sa rubrique 4 expose les projets visant la société.", guide: '/guides/13d-vs-13g-sec/' },
      { sigle: '13G', nom: 'Schedule 13G', def: "Version courte du 13D, réservée aux détenteurs passifs et aux institutionnels qualifiés au-delà de 5 % du capital. Le passage du 13G au 13D signale un passage à l'action.", guide: '/guides/13d-vs-13g-sec/' },
      { sigle: '10-K', nom: 'Formulaire 10-K', def: "Rapport annuel d'une société cotée américaine déposé auprès de la SEC : activité, facteurs de risque, comptes audités et discussion de la direction. Le document public le plus complet sur une entreprise.", guide: '/guides/lire-le-10-k-sec/' },
      { sigle: 'EDGAR', nom: 'Electronic Data Gathering, Analysis, and Retrieval', def: "Base de données publique de la SEC où sont déposés tous les documents réglementaires (10-K, 13F, S-1)." },
      { sigle: 'BLS', nom: 'Bureau of Labor Statistics', def: "Agence statistique américaine du travail. Publie le CPI, l'emploi, et les indices de prix import/export." },
      { sigle: 'CLARITY', nom: 'CLARITY Act', def: "Projet de loi américain visant à clarifier la répartition de la régulation crypto entre SEC et CFTC." },
      { sigle: 'GENIUS', nom: 'GENIUS Act', def: "Loi fédérale américaine sur les stablecoins de paiement, promulguée le 18 juillet 2025 : réserves intégrales, émetteurs agréés, audits.", guide: '/guides/stablecoins-genius-act/' },
      { sigle: 'NASAA', nom: 'North American Securities Administrators Association', def: "Association des régulateurs boursiers des États américains, du Canada et du Mexique." },
      { sigle: 'USAID', nom: 'U.S. Agency for International Development', def: "Agence américaine pour le développement international, en charge de l'aide étrangère." },
      { sigle: 'SWIFT', nom: 'Society for Worldwide Interbank Financial Telecommunication', def: "Réseau de messagerie interbancaire mondial pour les transferts. Exclure un pays de SWIFT est une arme de sanction majeure." },
      { sigle: 'CIPS', nom: 'Cross-Border Interbank Payment System', def: "Système de paiement transfrontalier chinois, présenté comme une alternative à SWIFT." },
      { sigle: 'FSOC', nom: 'Financial Stability Oversight Council', def: "Conseil américain de supervision de la stabilité financière. Peut désigner des non-banques comme systémiques." },
      { sigle: 'OFR', nom: 'Office of Financial Research', def: "Bureau de recherche financière rattaché au Trésor américain. Produit données et analyses sur les risques systémiques." },
      { sigle: 'Form PF', nom: 'Private Fund (formulaire de reporting SEC)', def: "Formulaire de reporting confidentiel des fonds privés à la SEC. Principale source de données réglementaires sur leur levier et leurs contreparties." },
      { sigle: 'CET1', nom: 'Common Equity Tier 1', def: "Ratio de fonds propres durs des banques rapportés aux actifs pondérés du risque. Mesure centrale de leur solvabilité." },
    ],
  },
];

export interface GlossaryEntry extends GlossarySourceEntry {
  slug: string;
  url: string;
  sectionTitle: string;
  sectionSlug: string;
  accent: string;
}

export const slugifyGlossary = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const seenSlugs = new Map<string, number>();
const uniqueSlug = (value: string) => {
  const base = slugifyGlossary(value) || 'terme';
  const n = (seenSlugs.get(base) ?? 0) + 1;
  seenSlugs.set(base, n);
  return n === 1 ? base : `${base}-${n}`;
};

export const glossarySections = rawGlossarySections.map((section) => {
  const sectionSlug = slugifyGlossary(section.titre);
  return {
    ...section,
    slug: sectionSlug,
    entries: section.entries.map((entry): GlossaryEntry => {
      const slug = uniqueSlug(entry.sigle);
      return {
        ...entry,
        slug,
        url: `/glossaire/${slug}/`,
        sectionTitle: section.titre,
        sectionSlug,
        accent: section.accent,
      };
    }),
  };
});

export const glossaryEntries = glossarySections.flatMap((section) => section.entries);
export const totalGlossaryEntries = glossaryEntries.length;
export const glossaryEntryBySlug = new Map(glossaryEntries.map((entry) => [entry.slug, entry]));
