export interface RiskSignalCalculation {
  summary: string;
  sourceCode?: string;
  sourceRevision?: string;
  formula?: string[];
  buckets?: Array<{ key: string; label: string; weight: number }>;
  thresholds?: Array<{ label: string; value: number }>;
  notes?: string[];
}

export const SIGNAL_KEYS = ['us', 'eu', 'yen', 'energie', 'debt'] as const;
export type RiskSignalKey = (typeof SIGNAL_KEYS)[number];

export interface RiskSignalIdentity {
  seriesId: string;
  slug: string;
  name: string;
  shortName: string;
  citationName: string;
  description: string;
  identityVersion: string;
  identityEffectiveFrom: string;
  methodologyVersion: string;
  methodologyEffectiveFrom: string;
  methodologyChangelog: string;
}

export interface RiskSignalMeta {
  label: string;
  source: string;
  methodology: string;
  identity: RiskSignalIdentity;
  calculation?: RiskSignalCalculation;
}

const VERSIONED_FROM = '2026-07-17';
const CHANGELOG = 'https://l0g.fr/changelog-editorial/';

export const riskSignalMeta: Record<RiskSignalKey, RiskSignalMeta> & Record<string, RiskSignalMeta> = {
  us: {
    label: 'US Macro Dashboard',
    source: 'https://us.l0g.fr',
    methodology: 'https://l0g.fr/methodologie/us-macro/',
    identity: {
      seriesId: 'l0g.signal.us-macro-stress',
      slug: 'barometre-stress-macro-us',
      name: 'Baromètre de stress macro américain l0g',
      shortName: 'Stress macro US l0g',
      citationName: 'Baromètre de stress macro américain l0g',
      description: 'Stress macroéconomique américain normalisé sur 0-100 à partir du signal publié par US Macro Dashboard.',
      identityVersion: '1.0.0',
      identityEffectiveFrom: VERSIONED_FROM,
      methodologyVersion: '1.0.0',
      methodologyEffectiveFrom: VERSIONED_FROM,
      methodologyChangelog: CHANGELOG,
    },
  },
  eu: {
    label: 'EU Macro Dashboard',
    source: 'https://euro.l0g.fr',
    methodology: 'https://l0g.fr/methodologie/euro-macro/',
    identity: {
      seriesId: 'l0g.signal.euro-macro-stress',
      slug: 'barometre-stress-macro-euro',
      name: 'Baromètre de stress macro zone euro l0g',
      shortName: 'Stress macro euro l0g',
      citationName: 'Baromètre de stress macro zone euro l0g',
      description: 'Stress macroéconomique de la zone euro normalisé sur 0-100 à partir du signal publié par EU Macro Dashboard.',
      identityVersion: '1.0.0',
      identityEffectiveFrom: VERSIONED_FROM,
      methodologyVersion: '1.0.0',
      methodologyEffectiveFrom: VERSIONED_FROM,
      methodologyChangelog: CHANGELOG,
    },
  },
  yen: {
    label: 'Yen Carry Monitor',
    source: 'https://yct.l0g.fr',
    methodology: 'https://l0g.fr/methodologie/yen-carry/',
    identity: {
      seriesId: 'l0g.signal.yen-carry-fragility',
      slug: 'thermometre-fragilite-carry-yen',
      name: 'Thermomètre de fragilité du carry yen l0g',
      shortName: 'Fragilité carry yen l0g',
      citationName: 'Thermomètre de fragilité du carry yen l0g',
      description: 'Fragilité du carry trade financé en yen, normalisée sur 0-100 à partir du signal publié par Yen Carry Monitor.',
      identityVersion: '1.0.0',
      identityEffectiveFrom: VERSIONED_FROM,
      methodologyVersion: '1.0.0',
      methodologyEffectiveFrom: VERSIONED_FROM,
      methodologyChangelog: CHANGELOG,
    },
  },
  energie: {
    label: 'Energie Monitor',
    source: 'https://energie.l0g.fr',
    methodology: 'https://l0g.fr/methodologie/energie/',
    identity: {
      seriesId: 'l0g.signal.energy-market-stress',
      slug: 'indice-tension-energie',
      name: 'Indice de tension des marchés de l’énergie l0g',
      shortName: 'Tension énergie l0g',
      citationName: 'Indice de tension des marchés de l’énergie l0g',
      description: 'Tension relative des marchés de l’énergie, normalisée sur 0-100 à partir du signal publié par Energie Monitor.',
      identityVersion: '1.0.0',
      identityEffectiveFrom: VERSIONED_FROM,
      methodologyVersion: '1.0.0',
      methodologyEffectiveFrom: VERSIONED_FROM,
      methodologyChangelog: CHANGELOG,
    },
  },
  debt: {
    label: 'Debt Risk Radar',
    source: 'https://debt.l0g.fr',
    methodology: 'https://l0g.fr/methodologie/debt-risk-radar/',
    identity: {
      seriesId: 'l0g.signal.debt-stress',
      slug: 'thermometre-stress-dette',
      name: 'Thermomètre de stress de la dette l0g',
      shortName: 'Stress de la dette l0g',
      citationName: 'Thermomètre de stress de la dette l0g',
      description: 'Stress courant de la dette publique et privée normalisé sur 0-100 à partir du signal publié par Debt Risk Radar.',
      identityVersion: '1.0.0',
      identityEffectiveFrom: VERSIONED_FROM,
      methodologyVersion: '1.0.0',
      methodologyEffectiveFrom: VERSIONED_FROM,
      methodologyChangelog: CHANGELOG,
    },
    calculation: {
      summary:
        'Score de stress courant Debt Risk Radar calcule par bucket_scores(metrics) puis overall_score(buckets, exclude=cbo_projection, expected=current_stress_buckets, neutral_missing=50). Les projections CBO restent publiees comme vulnerabilite structurelle de long terme.',
      sourceCode: 'https://github.com/bluetouff/debt-risk-radar',
      formula: [
        'z = (valeur - moyenne_fenetre) / ecart_type_fenetre',
        'signed_z = z si direction=up, -z si direction=down',
        'risk_score = clip(50 + signed_z * 15, 0, 100)',
        'score_famille = moyenne ponderee des risk_score disponibles dans la famille',
        'score_structurel_cbo = score_famille des projections CBO',
        'score_courant = moyenne ponderee des score_famille disponibles hors cbo_projection, avec score neutre 50 pour les familles courantes absentes',
      ],
      buckets: [
        { key: 'fiscal', label: 'Fiscal solvency', weight: 0.22 },
        { key: 'rates_market', label: 'Rates and market stress', weight: 0.18 },
        { key: 'private_leverage', label: 'Private leverage', weight: 0.12 },
        { key: 'liquidity', label: 'Liquidity plumbing', weight: 0.1 },
        { key: 'treasury_daily', label: 'Treasury daily debt', weight: 0.1 },
        { key: 'world_bank', label: 'Global comparables', weight: 0.04 },
        { key: 'global_credit', label: 'BIS global credit', weight: 0.1 },
        { key: 'cbo_projection', label: 'CBO projections', weight: 0.1 },
        { key: 'market_prices', label: 'Massive market prices', weight: 0.04 },
      ],
      thresholds: [
        { label: 'Elevated', value: 50 },
        { label: 'Watch', value: 65 },
        { label: 'Stress', value: 80 },
      ],
      notes: [
        'La valeur publiee par l0g est importee depuis score.current_stress dans https://debt.l0g.fr/latest.json au moment du build.',
        'Le bucket cbo_projection est conserve dans la provenance, mais il ne contribue pas au score courant affiche.',
        'Les buckets courants absents ne renormalisent plus tout le score : ils sont imputes a 50 et la couverture est exposee dans latest.json.',
        'Sources institutionnelles principales : Treasury Fiscal Data, FRED, BIS, CBO, World Bank.',
        'Les prix, ETF et ratios de marche passent par Massive Market Data quand MASSIVE_API_KEY est configuree cote serveur.',
        'Les sources optionnelles absentes sont visibles dans issues et amorties par imputation neutre si leur famille courante manque.',
      ],
    },
  },
};
