import type { AnalysisTool } from './analysis-tools.ts';

// These tools live inside their investigations. The catalogue points to existing
// component anchors and keeps their scenario assumptions in the source article.
export const embeddedAnalysisTools: AnalysisTool[] = [
  {
    "id": "airfare-bots-article",
    "status": "active",
    "category": "economics",
    "updatedAt": "2026-11-05",
    "placement": "article",
    "embeddedComponent": "AirfareBotLab",
    "fr": {
      "title": "Les bots, le signal et le billet",
      "eyebrow": "économie et coûts",
      "question": "Comment les requêtes et les retenues de places peuvent-elles modifier une offre ?",
      "description": "Animer les recherches, filtrer les répétitions et suivre les disponibilités dans des scénarios tarifaires entièrement fictifs.",
      "href": "/posts/billets-avion-agents-ia-signal-demande/#airfare-bot-lab-fr",
      "articleHref": "/posts/billets-avion-agents-ia-signal-demande/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Bots, signals and the fare",
      "eyebrow": "economics and costs",
      "question": "How can search requests and temporary inventory holds change an offer?",
      "description": "Animate searches, filter repeated requests and track availability in entirely fictional pricing scenarios.",
      "href": "/en/analysis/airfares-ai-agents-demand-signals/#airfare-bot-lab-en",
      "articleHref": "/en/analysis/airfares-ai-agents-demand-signals/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "asmlproductivity-article",
    "status": "active",
    "category": "markets",
    "updatedAt": "2026-11-01",
    "placement": "article",
    "embeddedComponent": "AsmlProductivityCalculator",
    "fr": {
      "title": "Productivité et arrêt d’une machine",
      "eyebrow": "financement et marchés",
      "question": "Quand un gain de cadence rattrape-t-il un arrêt de production ?",
      "description": "Comparer le volume produit avant et après une amélioration, avec une durée d’arrêt réglable.",
      "href": "/posts/asml-seconde-vie-financiere-machines-puces/#asml-productivity-fr-title",
      "articleHref": "/posts/asml-seconde-vie-financiere-machines-puces/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Machine productivity and downtime",
      "eyebrow": "financing and markets",
      "question": "When does higher throughput make up for downtime?",
      "description": "Compare output before and after an upgrade, with adjustable downtime.",
      "href": "/en/analysis/asml-earnings-engine-installed-base/#asml-productivity-en-title",
      "articleHref": "/en/analysis/asml-earnings-engine-installed-base/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "oraclecash-article",
    "status": "active",
    "category": "markets",
    "updatedAt": "2026-11-01",
    "placement": "article",
    "embeddedComponent": "OracleCashCalculator",
    "fr": {
      "title": "Avances clients et trésorerie d’Oracle",
      "eyebrow": "financement et marchés",
      "question": "Comment rapprocher les avances et les investissements ?",
      "description": "Faire varier avances et capex d’un trimestre, avec les autres flux constants, puis rapprocher deux lectures de la trésorerie.",
      "href": "/posts/oracle-qui-finance-le-chantier-des-225-milliards/#oracle-cash-fr-title",
      "articleHref": "/posts/oracle-qui-finance-le-chantier-des-225-milliards/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Oracle customer prepayments and cash flow",
      "eyebrow": "financing and markets",
      "question": "How can prepayments and capital spending be reconciled?",
      "description": "Vary one quarter’s prepayments and capex, holding other flows constant, then reconcile two views of cash flow.",
      "href": "/en/analysis/oracle-who-funds-the-225-billion-buildout/#oracle-cash-en-title",
      "articleHref": "/en/analysis/oracle-who-funds-the-225-billion-buildout/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "stellantiscash-article",
    "status": "active",
    "category": "markets",
    "updatedAt": "2026-11-01",
    "placement": "article",
    "embeddedComponent": "StellantisCashCalculator",
    "fr": {
      "title": "Le seuil de trésorerie de Stellantis",
      "eyebrow": "financement et marchés",
      "question": "Quel dernier trimestre permettrait d’atteindre l’équilibre ?",
      "description": "Faire varier le dernier trimestre et calculer le solde annuel, sans en faire une prévision.",
      "href": "/posts/stellantis-facture-redressement-tresorerie-2027/#stellantis-cash-fr-title",
      "articleHref": "/posts/stellantis-facture-redressement-tresorerie-2027/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Stellantis cash-flow threshold",
      "eyebrow": "financing and markets",
      "question": "Which final-quarter result would reach break-even?",
      "description": "Vary the final quarter and calculate the annual balance without treating it as a forecast.",
      "href": "/en/analysis/stellantis-price-of-turnaround-cash-flow-2027/#stellantis-cash-en-title",
      "articleHref": "/en/analysis/stellantis-price-of-turnaround-cash-flow-2027/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "pik-article",
    "status": "active",
    "category": "markets",
    "updatedAt": "2026-10-31",
    "placement": "article",
    "embeddedComponent": "PikCalculator",
    "fr": {
      "title": "Le coût des intérêts reportés",
      "eyebrow": "financement et marchés",
      "question": "Comment la dette grossit-elle quand les intérêts sont capitalisés ?",
      "description": "Suivre rémunération payée, rémunération reportée et montant à refinancer selon les paramètres choisis.",
      "href": "/posts/ia-pik-interets-reportes-prix-attente/#pik-fr-title",
      "articleHref": "/posts/ia-pik-interets-reportes-prix-attente/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "The cost of deferred interest",
      "eyebrow": "financing and markets",
      "question": "How does debt grow when interest is capitalised?",
      "description": "Track cash-pay interest, deferred remuneration and the amount to refinance under chosen assumptions.",
      "href": "/en/analysis/ai-pik-financing-cost-of-deferring-interest/#pik-en-title",
      "articleHref": "/en/analysis/ai-pik-financing-cost-of-deferring-interest/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "gpudebt-article",
    "status": "active",
    "category": "markets",
    "updatedAt": "2026-10-31",
    "placement": "article",
    "embeddedComponent": "GpuDebtStress",
    "fr": {
      "title": "Prix du calcul et dette des GPU",
      "eyebrow": "financement et marchés",
      "question": "Le revenu du parc couvre-t-il encore ses paiements ?",
      "description": "Faire varier tarif et utilisation des GPU, puis observer le cash et la couverture de la dette du scénario.",
      "href": "/posts/prix-calcul-ia-gpu-dette/#gpu-debt-fr-title",
      "articleHref": "/posts/prix-calcul-ia-gpu-dette/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Compute prices and GPU debt",
      "eyebrow": "financing and markets",
      "question": "Does fleet revenue still cover its payments?",
      "description": "Vary GPU pricing and utilisation, then inspect scenario cash flow and debt coverage.",
      "href": "/en/analysis/ai-compute-price-collapse-gpu-debt/#gpu-debt-en-title",
      "articleHref": "/en/analysis/ai-compute-price-collapse-gpu-debt/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "learningtime-article",
    "status": "active",
    "category": "economics",
    "updatedAt": "2026-10-30",
    "placement": "article",
    "embeddedComponent": "LearningTimeCalculator",
    "fr": {
      "title": "Temps de travail et apprentissage",
      "eyebrow": "économie et coûts",
      "question": "Comment répartir le temps gagné avec l’IA ?",
      "description": "Comparer durée des tâches, vérification et temps consacré à l’apprentissage dans un scénario explicite.",
      "href": "/posts/ia-apprentissage-juniors/#learning-time-fr-title",
      "articleHref": "/posts/ia-apprentissage-juniors/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Working time and learning",
      "eyebrow": "economics and costs",
      "question": "How can time saved with AI be allocated?",
      "description": "Compare task time, verification and time allocated to learning under explicit assumptions.",
      "href": "/en/analysis/learning-work-with-ai/#learning-time-en-title",
      "articleHref": "/en/analysis/learning-work-with-ai/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "pcaiprice-article",
    "status": "active",
    "category": "economics",
    "updatedAt": "2026-10-30",
    "placement": "article",
    "embeddedComponent": "PcAiPriceCalculator",
    "fr": {
      "title": "Mémoire et prix d’un ordinateur",
      "eyebrow": "économie et coûts",
      "question": "Comment un coût de composant atteint-il le prix final ?",
      "description": "Faire varier le coût de la mémoire et sa transmission au prix dans un exemple paramétrable.",
      "href": "/posts/ia-memoire-prix-ordinateurs/#pc-price-fr-title",
      "articleHref": "/posts/ia-memoire-prix-ordinateurs/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Memory and PC prices",
      "eyebrow": "economics and costs",
      "question": "How does a component cost reach the final price?",
      "description": "Vary memory costs and their pass-through to prices in an adjustable example.",
      "href": "/en/analysis/ai-memory-pc-prices/#pc-price-en-title",
      "articleHref": "/en/analysis/ai-memory-pc-prices/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "inflationbasket-article",
    "status": "active",
    "category": "macro",
    "updatedAt": "2026-10-30",
    "placement": "article",
    "embeddedComponent": "InflationBasketCalculator",
    "fr": {
      "title": "Inflation et budget personnel",
      "eyebrow": "macroéconomie",
      "question": "Comment la composition des dépenses change-t-elle le résultat ?",
      "description": "Pondérer les postes de dépenses et comparer un panier personnalisé à la référence publiée, avec son périmètre.",
      "href": "/posts/inflation-budget/#inflation-basket-fr-title",
      "articleHref": "/posts/inflation-budget/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Inflation and a personal budget",
      "eyebrow": "macroeconomics",
      "question": "How does the spending mix change the result?",
      "description": "Weight spending categories and compare a custom basket with the published reference and its scope.",
      "href": "/en/analysis/why-your-budget-tells-a-different-inflation-story/#inflation-basket-en-title",
      "articleHref": "/en/analysis/why-your-budget-tells-a-different-inflation-story/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "parcelfee-article",
    "status": "active",
    "category": "economics",
    "updatedAt": "2026-10-30",
    "placement": "article",
    "embeddedComponent": "ParcelFeeCalculator",
    "fr": {
      "title": "Frais et prix des petits colis",
      "eyebrow": "économie et coûts",
      "question": "Comment répartir les nouveaux frais dans une commande ?",
      "description": "Décomposer les frais, leur transmission et la TVA dans un exemple de commande.",
      "href": "/posts/petits-colis-frais/#parcel-fee-fr-title",
      "articleHref": "/posts/petits-colis-frais/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Small-parcel fees and prices",
      "eyebrow": "economics and costs",
      "question": "How can new fees be allocated within an order?",
      "description": "Break down fees, pass-through and VAT in an example order.",
      "href": "/en/analysis/small-parcels-fees/#parcel-fee-en-title",
      "articleHref": "/en/analysis/small-parcels-fees/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "stablecoinrevenue-article",
    "status": "active",
    "category": "crypto",
    "updatedAt": "2026-10-29",
    "placement": "article",
    "embeddedComponent": "StablecoinRevenueCalculator",
    "fr": {
      "title": "Le partage du revenu des réserves",
      "eyebrow": "crypto",
      "question": "Qui reçoit le revenu produit par les réserves ?",
      "description": "Décomposer revenu brut, frais et partage des recettes avec des hypothèses affichées.",
      "href": "/posts/stablecoins-remuneration-reserves-occ-circle-coinbase/#stablecoin-revenue-fr-title",
      "articleHref": "/posts/stablecoins-remuneration-reserves-occ-circle-coinbase/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Sharing reserve income",
      "eyebrow": "crypto",
      "question": "Who receives the income generated by reserves?",
      "description": "Break down gross income, costs and revenue sharing under stated assumptions.",
      "href": "/en/analysis/stablecoins-yield-reserves-occ-circle-coinbase/#stablecoin-revenue-en-title",
      "articleHref": "/en/analysis/stablecoins-yield-reserves-occ-circle-coinbase/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "tempobill-article",
    "status": "active",
    "category": "economics",
    "updatedAt": "2026-10-29",
    "placement": "article",
    "embeddedComponent": "TempoBillCalculator",
    "fr": {
      "title": "La facture d’électricité Tempo",
      "eyebrow": "économie et coûts",
      "question": "Comment les heures rouges changent-elles la facture ?",
      "description": "Comparer une répartition de consommation et un report vers d’autres heures avec les tarifs documentés.",
      "href": "/posts/tempo-jours-rouges-algorithme-facture/#tempo-bill-fr-title",
      "articleHref": "/posts/tempo-jours-rouges-algorithme-facture/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "The Tempo electricity bill",
      "eyebrow": "economics and costs",
      "question": "How do red-day hours change the bill?",
      "description": "Compare a consumption pattern and load shifting using documented tariffs.",
      "href": "/en/analysis/tempo-red-days-algorithm-electricity-bill/#tempo-bill-en-title",
      "articleHref": "/en/analysis/tempo-red-days-algorithm-electricity-bill/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "transitionfirstloss-article",
    "status": "active",
    "category": "markets",
    "updatedAt": "2026-10-29",
    "placement": "article",
    "embeddedComponent": "TransitionFirstLossCalculator",
    "fr": {
      "title": "Le partage de la première perte",
      "eyebrow": "financement et marchés",
      "question": "Qui absorbe les pertes selon le montage financier ?",
      "description": "Comparer des structures de protection et la répartition des pertes entre acteurs, à paramètres identiques.",
      "href": "/posts/transition-energetique-premiere-perte-finance-mixte/#first-loss-fr-title",
      "articleHref": "/posts/transition-energetique-premiere-perte-finance-mixte/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Sharing the first loss",
      "eyebrow": "financing and markets",
      "question": "Who absorbs losses under each financing structure?",
      "description": "Compare protection structures and how losses are allocated across parties, using the same inputs.",
      "href": "/en/analysis/energy-transition-first-loss-blended-finance/#first-loss-en-title",
      "articleHref": "/en/analysis/energy-transition-first-loss-blended-finance/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "cumcumreform-article",
    "status": "active",
    "category": "economics",
    "updatedAt": "2026-10-28",
    "placement": "article",
    "embeddedComponent": "CumCumReformLab",
    "fr": {
      "title": "Réforme fiscale et résultats mesurables",
      "eyebrow": "économie et coûts",
      "question": "Comment distinguer baisse des opérations et récupération fiscale ?",
      "description": "Faire varier les hypothèses d’un modèle de réforme sans présenter les résultats comme des recettes observées.",
      "href": "/posts/cumcum-06-mesurer-le-recul-de-la-fraude/#cumcum-reform-lab-fr-title",
      "articleHref": "/posts/cumcum-06-mesurer-le-recul-de-la-fraude/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Tax reform and measurable outcomes",
      "eyebrow": "economics and costs",
      "question": "How can fewer transactions be distinguished from tax recovery?",
      "description": "Vary reform assumptions without treating the outputs as observed tax receipts.",
      "href": "/en/analysis/cumcum-06-measuring-reform-results/#cumcum-reform-lab-en-title",
      "articleHref": "/en/analysis/cumcum-06-measuring-reform-results/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "frenchdebtrepo-article",
    "status": "active",
    "category": "markets",
    "updatedAt": "2026-09-28",
    "placement": "article",
    "embeddedComponent": "FrenchDebtRepoLab",
    "fr": {
      "title": "Décote de garantie et ventes forcées",
      "eyebrow": "financement et marchés",
      "question": "Combien vendre lorsque le financement se resserre ?",
      "description": "Modifier le prix des obligations, la décote et la réserve de cash ; suivre la garantie retirée à chaque vente.",
      "href": "/posts/dette-francaise-hedge-funds/#repo-lab-fr",
      "articleHref": "/posts/dette-francaise-hedge-funds/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Collateral haircuts and forced sales",
      "eyebrow": "financing and markets",
      "question": "How much must be sold when funding tightens?",
      "description": "Change bond prices, haircuts and the cash buffer, tracking collateral removed by each sale.",
      "href": "/en/analysis/french-debt-hedge-funds/#repo-lab-en",
      "articleHref": "/en/analysis/french-debt-hedge-funds/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "budget2027-article",
    "status": "active",
    "category": "macro",
    "updatedAt": "2026-09-22",
    "placement": "article",
    "embeddedComponent": "Budget2027Stress",
    "fr": {
      "title": "Taux et coût de la dette publique",
      "eyebrow": "macroéconomie",
      "question": "Comment un choc de taux traverse-t-il la dette ?",
      "description": "Comparer le prix immédiat d’une obligation et la transmission graduelle au coût de la dette dans un scénario pédagogique.",
      "href": "/posts/budget-2027-risque-obligataire-france/#budget2027-fr-title",
      "articleHref": "/posts/budget-2027-risque-obligataire-france/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Yields and public-debt servicing",
      "eyebrow": "macroeconomics",
      "question": "How does a yield shock pass through public debt?",
      "description": "Compare immediate bond repricing with gradual transmission to debt servicing in an educational scenario.",
      "href": "/en/analysis/france-2027-budget-bond-market-risk/#budget2027-en-title",
      "articleHref": "/en/analysis/france-2027-budget-bond-market-risk/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "medicinesupply-article",
    "status": "active",
    "category": "economics",
    "updatedAt": "2026-09-17",
    "placement": "article",
    "embeddedComponent": "MedicineSupplyLab",
    "fr": {
      "title": "Stock et continuité des médicaments",
      "eyebrow": "économie et coûts",
      "question": "Comment un stock absorbe-t-il un retard de livraison ?",
      "description": "Comparer deux scénarios fictifs d’approvisionnement, leur stock disponible et leur niveau de service.",
      "href": "/posts/penuries-medicaments-prix-disponibilite/#medicine-lab-fr-title",
      "articleHref": "/posts/penuries-medicaments-prix-disponibilite/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Medicine stocks and supply continuity",
      "eyebrow": "economics and costs",
      "question": "How does inventory absorb a delivery delay?",
      "description": "Compare two fictional supply scenarios, their available stocks and service levels.",
      "href": "/en/analysis/drug-shortages-price-of-reliability/#medicine-lab-en-title",
      "articleHref": "/en/analysis/drug-shortages-price-of-reliability/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "softwaredebt-article",
    "status": "active",
    "category": "markets",
    "updatedAt": "2026-09-16",
    "placement": "article",
    "embeddedComponent": "SoftwareDebtStress",
    "fr": {
      "title": "Logiciels et capacité de remboursement",
      "eyebrow": "financement et marchés",
      "question": "Quel cash reste disponible pour payer la dette ?",
      "description": "Tester revenus, marge et intérêts dans des scénarios fictifs de financement d’un éditeur de logiciels.",
      "href": "/posts/credit-prive-logiciels-ia-revenus-dette/#software-debt-fr-title",
      "articleHref": "/posts/credit-prive-logiciels-ia-revenus-dette/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Software cash flow and debt servicing",
      "eyebrow": "financing and markets",
      "question": "How much cash remains to service debt?",
      "description": "Test revenue, margins and interest under fictional software-company financing scenarios.",
      "href": "/en/analysis/private-credit-software-ai-cash-flows-debt/#software-debt-en-title",
      "articleHref": "/en/analysis/private-credit-software-ai-cash-flows-debt/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "asiausportfolio-article",
    "status": "active",
    "category": "markets",
    "updatedAt": "2026-09-05",
    "placement": "article",
    "embeddedComponent": "AsiaUSPortfolioStress",
    "fr": {
      "title": "Actifs américains et risque de portefeuille",
      "eyebrow": "financement et marchés",
      "question": "Comment le risque change-t-il selon les actifs détenus ?",
      "description": "Comparer des expositions aux Treasuries, aux titres hypothécaires et au crédit dans des scénarios explicites.",
      "href": "/posts/asie-actifs-americains-treasuries-mbs-credit/#asia-us-portfolio-fr-embed",
      "articleHref": "/posts/asie-actifs-americains-treasuries-mbs-credit/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "US assets and portfolio risk",
      "eyebrow": "financing and markets",
      "question": "How does risk change with the assets held?",
      "description": "Compare Treasury, mortgage-security and credit exposures under explicit scenarios.",
      "href": "/en/analysis/what-asia-really-buys-in-america/#asia-us-portfolio-en-embed",
      "articleHref": "/en/analysis/what-asia-really-buys-in-america/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "asiadollartriple-article",
    "status": "active",
    "category": "markets",
    "updatedAt": "2026-09-05",
    "placement": "article",
    "embeddedComponent": "AsiaDollarTripleStress",
    "fr": {
      "title": "Dollar, couverture et appels de marge",
      "eyebrow": "financement et marchés",
      "question": "Quand une perte de valeur devient-elle un besoin de trésorerie ?",
      "description": "Faire varier prix, change et couverture pour rapprocher pertes et paiements dans un scénario hypothétique.",
      "href": "/posts/asie-dollar-stress-test-trois-risques/#asia-triple-fr",
      "articleHref": "/posts/asie-dollar-stress-test-trois-risques/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Dollar hedging and margin calls",
      "eyebrow": "financing and markets",
      "question": "When does a loss in value become a cash requirement?",
      "description": "Vary prices, exchange rates and hedging to connect losses with payments in a hypothetical scenario.",
      "href": "/en/analysis/asia-dollar-stress-test-three-risks/#asia-triple-en",
      "articleHref": "/en/analysis/asia-dollar-stress-test-three-risks/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "heliumlogistics-article",
    "status": "active",
    "category": "economics",
    "updatedAt": "2026-09-05",
    "placement": "article",
    "embeddedComponent": "HeliumLogisticsLab",
    "fr": {
      "title": "Le cycle logistique de l’hélium",
      "eyebrow": "économie et coûts",
      "question": "Comment un trajet plus long immobilise-t-il la flotte ?",
      "description": "Observer la disponibilité d’une flotte fictive lorsque la durée de rotation change.",
      "href": "/posts/helium-geopolitique-ballon-anniversaire/#helium-lab-fr",
      "articleHref": "/posts/helium-geopolitique-ballon-anniversaire/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "The helium logistics cycle",
      "eyebrow": "economics and costs",
      "question": "How does a longer journey tie up the fleet?",
      "description": "Inspect the availability of a fictional fleet when turnaround time changes.",
      "href": "/en/analysis/helium-geopolitics-birthday-balloon/#helium-lab-en",
      "articleHref": "/en/analysis/helium-geopolitics-birthday-balloon/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "koreafxhedge-article",
    "status": "active",
    "category": "markets",
    "updatedAt": "2026-09-04",
    "placement": "article",
    "embeddedComponent": "KoreaFxHedgeSimulator",
    "fr": {
      "title": "Rendement après couverture de change",
      "eyebrow": "financement et marchés",
      "question": "Que reste-t-il du rendement après la couverture ?",
      "description": "Rapprocher rendement d’un actif étranger, coût de couverture et hypothèses de renouvellement.",
      "href": "/posts/coree-du-sud-prix-couverture-parfaite/#korea-fx-hedge-fr",
      "articleHref": "/posts/coree-du-sud-prix-couverture-parfaite/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Yield after currency hedging",
      "eyebrow": "financing and markets",
      "question": "How much yield remains after hedging?",
      "description": "Bring together foreign-asset yield, hedging costs and rollover assumptions.",
      "href": "/en/analysis/south-korea-price-perfect-fx-hedge/#korea-fx-hedge-en",
      "articleHref": "/en/analysis/south-korea-price-perfect-fx-hedge/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "wheatimport-article",
    "status": "active",
    "category": "economics",
    "updatedAt": "2026-09-03",
    "placement": "article",
    "embeddedComponent": "WheatImportStress",
    "fr": {
      "title": "Le coût d’une importation de blé",
      "eyebrow": "économie et coûts",
      "question": "Comment prix, fret et change se combinent-ils ?",
      "description": "Décomposer une facture d’importation dans un scénario paramétrable et suivre la contribution de chaque poste.",
      "href": "/posts/ble-entre-ormuz-et-bosphore/#wheat-import-fr-title",
      "articleHref": "/posts/ble-entre-ormuz-et-bosphore/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "The cost of importing wheat",
      "eyebrow": "economics and costs",
      "question": "How do price, freight and exchange rates interact?",
      "description": "Break down an import bill under adjustable assumptions and inspect each contribution.",
      "href": "/en/analysis/wheat-between-hormuz-and-the-bosphorus/#wheat-import-en-title",
      "articleHref": "/en/analysis/wheat-between-hormuz-and-the-bosphorus/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "europeancornbalance-article",
    "status": "active",
    "category": "economics",
    "updatedAt": "2026-09-03",
    "placement": "article",
    "embeddedComponent": "EuropeanCornBalanceStress",
    "fr": {
      "title": "Le bilan du maïs européen",
      "eyebrow": "économie et coûts",
      "question": "Comment combler un écart entre récolte et besoins ?",
      "description": "Tester production, consommation, stocks et importations dans un bilan cohérent.",
      "href": "/posts/mais-europe-recolte-importations-ukraine-etats-unis/#corn-balance-fr-title",
      "articleHref": "/posts/mais-europe-recolte-importations-ukraine-etats-unis/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "The European corn balance",
      "eyebrow": "economics and costs",
      "question": "How can a gap between harvest and demand be closed?",
      "description": "Test production, consumption, stocks and imports in a consistent balance.",
      "href": "/en/analysis/europe-corn-deficit-trade-map/#corn-balance-en-title",
      "articleHref": "/en/analysis/europe-corn-deficit-trade-map/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "sovereignrefinancing-article",
    "status": "active",
    "category": "macro",
    "updatedAt": "2026-09-02",
    "placement": "article",
    "embeddedComponent": "SovereignRefinancingSimulator",
    "fr": {
      "title": "Le calendrier du refinancement souverain",
      "eyebrow": "macroéconomie",
      "question": "À quelle vitesse un nouveau taux atteint-il le stock de dette ?",
      "description": "Comparer deux profils de refinancement pour un même stock et un même choc de taux.",
      "href": "/posts/etats-raccourci-meche-refinancement/#sovereign-refinancing-fr-title",
      "articleHref": "/posts/etats-raccourci-meche-refinancement/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "The sovereign refinancing calendar",
      "eyebrow": "macroeconomics",
      "question": "How quickly does a new yield reach the debt stock?",
      "description": "Compare two refinancing profiles for the same debt stock and yield shock.",
      "href": "/en/analysis/governments-shortened-fuse-refinancing/#sovereign-refinancing-en-title",
      "articleHref": "/en/analysis/governments-shortened-fuse-refinancing/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "serverusefullife-article",
    "status": "active",
    "category": "markets",
    "updatedAt": "2026-09-01",
    "placement": "article",
    "embeddedComponent": "ServerUsefulLifeSimulator",
    "fr": {
      "title": "Amortissement d’un serveur d’IA",
      "eyebrow": "financement et marchés",
      "question": "Comment la durée comptable déplace-t-elle le résultat ?",
      "description": "Modifier une durée d’amortissement et comparer charge comptable, résultat et trésorerie.",
      "href": "/posts/combien-de-temps-vit-serveur-ia/#server-useful-life-fr",
      "articleHref": "/posts/combien-de-temps-vit-serveur-ia/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "AI server depreciation",
      "eyebrow": "financing and markets",
      "question": "How does useful life change reported earnings?",
      "description": "Change a depreciation period and compare the accounting charge, earnings and cash flow.",
      "href": "/en/analysis/how-long-does-ai-server-live/#server-useful-life-en",
      "articleHref": "/en/analysis/how-long-does-ai-server-live/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "goldloan-article",
    "status": "active",
    "category": "markets",
    "updatedAt": "2026-08-26",
    "placement": "article",
    "embeddedComponent": "GoldLoanStress",
    "fr": {
      "title": "Un prêt garanti par de l’or",
      "eyebrow": "financement et marchés",
      "question": "Comment une variation du collatéral affecte-t-elle le prêt ?",
      "description": "Rapprocher prix de l’or, ratio prêt-valeur et marge de sécurité dans un scénario pédagogique.",
      "href": "/posts/quand-or-monte-dette-aussi/#gold-loan-stress-fr",
      "articleHref": "/posts/quand-or-monte-dette-aussi/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "A gold-backed loan",
      "eyebrow": "financing and markets",
      "question": "How does a collateral-price change affect the loan?",
      "description": "Bring together gold prices, loan-to-value ratios and the safety margin in an educational scenario.",
      "href": "/en/analysis/when-gold-rises-so-does-debt/#gold-loan-stress-en",
      "articleHref": "/en/analysis/when-gold-rises-so-does-debt/",
      "articleLabel": "Read the analysis and sources"
    }
  },
  {
    "id": "returnperiodrisk-article",
    "status": "active",
    "category": "markets",
    "updatedAt": "2026-08-23",
    "placement": "article",
    "embeddedComponent": "ReturnPeriodRiskCalculator",
    "fr": {
      "title": "Risque rare sur plusieurs années",
      "eyebrow": "financement et marchés",
      "question": "Comment lire une période de retour sur un horizon d’investissement ?",
      "description": "Convertir une probabilité annuelle en probabilité cumulée sous des hypothèses affichées.",
      "href": "/posts/data-center-meta-trop-gros-assurance-sopaipilla/#return-period-risk-fr",
      "articleHref": "/posts/data-center-meta-trop-gros-assurance-sopaipilla/",
      "articleLabel": "Lire l’analyse et ses sources"
    },
    "en": {
      "title": "Rare-event risk over several years",
      "eyebrow": "financing and markets",
      "question": "How should a return period be read over an investment horizon?",
      "description": "Translate annual probability into cumulative probability under stated assumptions.",
      "href": "/en/analysis/when-meta-data-center-too-big-insurance-sopaipilla/#return-period-risk-en",
      "articleHref": "/en/analysis/when-meta-data-center-too-big-insurance-sopaipilla/",
      "articleLabel": "Read the analysis and sources"
    }
  }
];
