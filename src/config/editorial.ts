export type EditorialPrinciple = {
  id: string;
  title: string;
  text: string;
};

export type EditorialStep = {
  id: string;
  title: string;
  checks: string[];
};

export type EditorialEvidenceLevel = {
  label: string;
  rank: string;
  description: string;
};

export type EditorialProofDepthLevel = {
  id: 'mention' | 'reference' | 'linked-source' | 'direct-proof' | 'reproduction';
  label: string;
  meaning: string;
  status: 'automatique' | 'semi-structuré' | 'objectif';
};

export type EditorialPrecisionGuard = {
  title: string;
  summary: string;
  requirements: string[];
  warning: string;
};

export type EditorialCorrectionPolicy = {
  title: string;
  summary: string;
  correctionTypes: Array<{ label: string; description: string }>;
  revisionRules: string[];
};

export type EditorialChangelogEntry = {
  date: string;
  title: string;
  kind: 'protocole' | 'traçabilité' | 'sources' | 'données' | 'sécurité' | 'méthode';
  summary: string;
  links: Array<{ label: string; href: string }>;
};

export const editorialProtocolRelease = {
  title: 'l0g Editorial Protocol 1.0',
  version: '1.0.0',
  status: 'stable',
  released: '2026-07-16',
  repositoryUrl: 'https://github.com/bluetouff/l0g',
  releaseUrl: 'https://github.com/bluetouff/l0g/tree/main/releases/l0g-editorial-protocol-1.0.0',
  specificationUrl: 'https://github.com/bluetouff/l0g/blob/main/releases/l0g-editorial-protocol-1.0.0/SPECIFICATION.md',
  schemasUrl: 'https://github.com/bluetouff/l0g/tree/main/releases/l0g-editorial-protocol-1.0.0/schemas',
  exampleUrl: 'https://github.com/bluetouff/l0g/tree/main/releases/l0g-editorial-protocol-1.0.0/example',
  testsUrl: 'https://github.com/bluetouff/l0g/tree/main/releases/l0g-editorial-protocol-1.0.0/tests',
  citationUrl: 'https://github.com/bluetouff/l0g/blob/main/CITATION.cff',
  licenseUrl: 'https://github.com/bluetouff/l0g/blob/main/LICENSE',
} as const;

export const editorialProtocol = {
  updated: editorialProtocolRelease.released,
  promise:
    "Séparer les faits, les sources, les hypothèses et les conclusions afin que chaque analyse l0g puisse être relue, contestée et corrigée.",
  principles: [
    {
      id: 'source-first',
      title: 'Source avant récit',
      text:
        "Une source primaire ou réglementaire passe avant une synthèse de marché quand elle existe. Les sources secondaires servent à contextualiser, pas à remplacer l'archive d'origine.",
    },
    {
      id: 'method-visible',
      title: 'Méthode visible',
      text:
        'Les dashboards, scores, seuils et hypothèses doivent pointer vers une fiche méthodologique ou un bloc de preuve lisible. Une simple mention d’autorité ne vaut pas preuve directe, et un chiffre précis ne vaut pas connaissance précise.',
    },
    {
      id: 'uncertainty-explicit',
      title: 'Incertitude explicite',
      text:
        'Les scénarios, estimations et signaux faibles sont signalés comme tels. Une projection ne doit pas être présentée comme un fait observé.',
    },
    {
      id: 'correction-public',
      title: 'Correction publique',
      text:
        'Les changements importants de protocole, de sources ou de lecture éditoriale doivent être inscrits dans le changelog éditorial.',
    },
  ] satisfies EditorialPrinciple[],
  steps: [
    {
      id: 'collecte',
      title: 'Collecte',
      checks: [
        'Identifier la source primaire disponible.',
        'Noter la date de publication et la fenêtre de fraîcheur utile.',
        'Isoler les agrégateurs et commentaires comme sources secondaires.',
      ],
    },
    {
      id: 'verification',
      title: 'Vérification',
      checks: [
        'Contrôler les chiffres critiques sur la source d’origine.',
        'Repérer les révisions, délais de publication et ruptures de série.',
        'Comparer le narratif public aux données observables.',
      ],
    },
    {
      id: 'redaction',
      title: 'Rédaction',
      checks: [
        'Distinguer fait, estimation, inférence et scénario.',
        'Relier chaque affirmation structurée à une preuve et à un localisateur exact.',
        'Préserver les liens vers méthodologie, données et sources primaires.',
      ],
    },
    {
      id: 'publication',
      title: 'Publication',
      checks: [
        'Vérifier build statique, métadonnées sociales et accessibilité de base.',
        'Exposer les artefacts utiles dans le catalogue machine.',
        'Documenter les changements éditoriaux structurants.',
      ],
    },
  ] satisfies EditorialStep[],
  evidenceLevels: [
    {
      label: 'Source primaire',
      rank: 'niveau 1',
      description: 'Institution, régulateur, dépôt officiel, base publique ou document légal directement cité.',
    },
    {
      label: 'Donnée publique',
      rank: 'niveau 2',
      description: 'Snapshot, API, série statistique ou fichier public dont la date utile est lisible.',
    },
    {
      label: 'Source secondaire',
      rank: 'niveau 3',
      description: 'Média, recherche, commentaire ou analyse externe utilisé pour situer un débat.',
    },
    {
      label: 'Hypothèse / scénario',
      rank: 'niveau 4',
      description: 'Projection, lecture conditionnelle, estimation ou risque à surveiller.',
    },
    {
      label: 'Contexte l0g',
      rank: 'niveau 5',
      description: 'Lien interne vers méthode, glossaire, données, preuve, statut ou historique l0g.',
    },
  ] satisfies EditorialEvidenceLevel[],
  proofDepthLevels: [
    {
      id: 'mention',
      label: 'Mention non probante',
      meaning: 'Signal historique faible : une autorité est nommée sans relation affirmation-source. Ce niveau ne vaut pas preuve article.',
      status: 'automatique',
    },
    {
      id: 'reference',
      label: 'Référence',
      meaning: 'Un document, dataset ou organisme identifiable est cité dans le texte.',
      status: 'automatique',
    },
    {
      id: 'linked-source',
      label: 'Source liée',
      meaning: 'Le document ou dataset est accessible par URL vérifiable.',
      status: 'automatique',
    },
    {
      id: 'direct-proof',
      label: 'Preuve directe',
      meaning: 'La source soutient précisément une affirmation donnée, avec relation claim → source.',
      status: 'semi-structuré',
    },
    {
      id: 'reproduction',
      label: 'Reproduction',
      meaning: 'La donnée, le calcul ou la transformation peut être reproduit par le lecteur.',
      status: 'objectif',
    },
  ] satisfies EditorialProofDepthLevel[],
  precisionGuard: {
    title: 'Illusion de précision',
    summary:
      'Les scores numériques et les badges donnent une impression de rigueur. Cette impression doit toujours être soutenue par des éléments vérifiables.',
    requirements: [
      'données complètes',
      'calcul reproductible',
      'couverture',
      'fraîcheur',
      'incertitude',
      'performance historique',
    ],
    warning:
      'Sinon, la mise en forme peut devenir plus précise que la connaissance sous-jacente.',
  } satisfies EditorialPrecisionGuard,
  correctionPolicy: {
    title: 'Politique de correction',
    summary:
      'Une correction est publiée quand elle change la lecture d’un fait, d’une source, d’un calcul, d’une limite ou d’une conclusion. Les micro-corrections typographiques restent dans Git.',
    correctionTypes: [
      {
        label: 'Correction factuelle',
        description: 'Erreur de chiffre, date, attribution, citation, lien ou qualification d’une source.',
      },
      {
        label: 'Révision méthodologique',
        description: 'Changement de formule, seuil, classification, périmètre ou limite d’un instrument.',
      },
      {
        label: 'Mise à jour éditoriale',
        description: 'Ajout de contexte, source nouvelle, changement de scénario ou clarification de conclusion.',
      },
    ],
    revisionRules: [
      'Chaque article expose sa date de publication et, si elle existe, sa date de révision.',
      'Les changements structurants sont consignés dans le changelog éditorial.',
      'Les modifications techniques restent vérifiables dans l’historique Git public.',
    ],
  } satisfies EditorialCorrectionPolicy,
};

export const editorialChangelog: EditorialChangelogEntry[] = [
  {
    date: '2026-07-17',
    title: 'Claims structurants typés et sélectionnés par le risque',
    kind: 'méthode',
    summary:
      'La surface limite désormais chaque article à trois claims structurants maximum et supprime le type assertion non classée. Chaque claim est classée en fait, estimation, inférence ou scénario ; ce typage heuristique reste distinct d’une revue canonique complète.',
    links: [
      { label: 'claims', href: '/api/v1/claims.json' },
      { label: 'politique de revue', href: '/protocole-editorial/' },
    ],
  },
  {
    date: '2026-07-17',
    title: 'Registre des séries de risque nommées et versionnées',
    kind: 'données',
    summary:
      'Chaque jauge du tableau consolidé reçoit un identifiant stable, un nom citable, des exports JSON, NDJSON et CSV dédiés, une date de série issue de la frame Black Box et une version méthodologique. Les frames antérieures au registre restent explicitement non versionnées ; aucun backfill rétroactif n’est produit.',
    links: [
      { label: 'séries', href: '/series/' },
      { label: 'backtests', href: '/backtests/' },
      { label: 'schéma', href: '/api/v1/signals/schema.json' },
    ],
  },
  {
    date: '2026-07-16',
    title: 'l0g Editorial Protocol 1.0 stable',
    kind: 'protocole',
    summary:
      'Publication du noyau normatif versionné : exigences EP-001 à EP-009, schémas article et paquet de preuves, article exemple, tests de conformité, empreintes, licences et métadonnées de citation.',
    links: [
      { label: 'protocole', href: '/protocole-editorial/' },
      { label: 'release 1.0.0', href: editorialProtocolRelease.releaseUrl },
    ],
  },
  {
    date: '2026-06-27',
    title: 'Relations affirmation-source et historique des révisions',
    kind: 'traçabilité',
    summary:
      'Les articles exposent désormais des relations affirmation-source typées, avec dates séparées quand elles sont détectables, historique de publication et politique de correction. Cette entrée décrit le premier contrat, remplacé depuis par la sélection structurante Agent Surface 1.15.',
    links: [
      { label: 'protocole', href: '/protocole-editorial/' },
      { label: 'catalogue', href: '/api/v1/catalog.json' },
    ],
  },
  {
    date: '2026-06-27',
    title: 'Garde-fou contre l’illusion de précision',
    kind: 'protocole',
    summary:
      'Le protocole explicite que scores et badges doivent être soutenus par données complètes, calcul reproductible, couverture, fraîcheur, incertitude et performance historique.',
    links: [
      { label: 'protocole', href: '/protocole-editorial/' },
      { label: 'méthodologie', href: '/methodologie/' },
    ],
  },
  {
    date: '2026-06-27',
    title: 'Clarification de l’échelle 0-100 des dashboards',
    kind: 'méthode',
    summary:
      'Le bandeau est désormais présenté comme un tableau consolidé de signaux de risque : les scores 0-100 sont une normalisation d’affichage par instrument, pas un indice unique ni une probabilité comparable.',
    links: [
      { label: 'méthodologie', href: '/methodologie/' },
      { label: 'api risk', href: '/api/v1/risk.json' },
    ],
  },
  {
    date: '2026-06-27',
    title: 'Échelle de profondeur de preuve',
    kind: 'traçabilité',
    summary:
      'Le protocole distingue désormais relation affirmation-source, référence, source liée, preuve directe et reproduction afin de ne pas confondre présence lexicale d’une autorité et preuve d’une affirmation.',
    links: [
      { label: 'protocole', href: '/protocole-editorial/' },
      { label: 'catalogue', href: '/api/v1/catalog.json' },
    ],
  },
  {
    date: '2026-06-27',
    title: 'Badges de niveau de preuve',
    kind: 'traçabilité',
    summary:
      'Les articles affichent désormais les niveaux de preuve détectés : source primaire, donnée publique, source secondaire, hypothèse ou contexte l0g.',
    links: [
      { label: 'preuves', href: '/preuves/' },
      { label: 'catalogue', href: '/api/v1/catalog.json' },
    ],
  },
  {
    date: '2026-06-27',
    title: 'Traçabilité des articles v2',
    kind: 'traçabilité',
    summary:
      'Ajout d’un bloc de preuves par article : sources primaires détectées, citations internes, statistiques et liens de vérification.',
    links: [
      { label: 'articles', href: '/' },
      { label: 'sources primaires', href: '/sources/' },
    ],
  },
  {
    date: '2026-06-27',
    title: 'Pages sources primaires par institution',
    kind: 'sources',
    summary:
      'Chaque grande institution suivie par l0g dispose d’une page dédiée : rôle, jeux de données, cadence, limites et lien officiel.',
    links: [
      { label: 'sources', href: '/sources/' },
      { label: 'sites de référence', href: '/sites-reference/' },
    ],
  },
  {
    date: '2026-06-27',
    title: 'Données, citations internes et surfaces sécurité',
    kind: 'données',
    summary:
      'Formalisation de l’inventaire des données publiques, des citations internes, du security.txt et de la CSP déclarée côté déploiement.',
    links: [
      { label: 'données', href: '/donnees/' },
      { label: 'statut', href: '/status/' },
    ],
  },
  {
    date: '2026-06-27',
    title: 'Méthodologies dashboards v2',
    kind: 'méthode',
    summary:
      'Les dashboards ont reçu des fiches fonctionnelles pour expliquer leur lecture, leurs signaux, leurs limites et leurs sources.',
    links: [
      { label: 'méthodologie', href: '/methodologie/' },
      { label: 'dashboards', href: '/dashboards/' },
    ],
  },
  {
    date: '2026-06-27',
    title: 'Protocole éditorial public',
    kind: 'protocole',
    summary:
      'Publication du protocole éditorial : chaîne source → vérification → rédaction → publication, niveaux de preuve et politique de correction.',
    links: [
      { label: 'protocole', href: '/protocole-editorial/' },
      { label: 'changelog éditorial', href: '/changelog-editorial/' },
    ],
  },
];
