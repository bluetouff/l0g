export interface RiskSignalCalculation {
  summary: string;
  sourceCode?: string;
  sourceRevision?: string;
  formula?: string[];
  buckets?: Array<{ key: string; label: string; weight: number }>;
  thresholds?: Array<{ label: string; value: number }>;
  notes?: string[];
}

export interface RiskSignalMeta {
  label: string;
  source: string;
  methodology: string;
  calculation?: RiskSignalCalculation;
}

export const riskSignalMeta: Record<string, RiskSignalMeta> = {
  us: {
    label: 'US Macro Dashboard',
    source: 'https://us.l0g.fr',
    methodology: 'https://l0g.fr/methodologie/us-macro/',
  },
  eu: {
    label: 'EU Macro Dashboard',
    source: 'https://euro.l0g.fr',
    methodology: 'https://l0g.fr/methodologie/euro-macro/',
  },
  yen: {
    label: 'Yen Carry Monitor',
    source: 'https://yct.l0g.fr',
    methodology: 'https://l0g.fr/methodologie/yen-carry/',
  },
  energie: {
    label: 'Energie Monitor',
    source: 'https://energie.l0g.fr',
    methodology: 'https://l0g.fr/methodologie/energie/',
  },
  debt: {
    label: 'Debt Risk Radar',
    source: 'https://debt.l0g.fr',
    methodology: 'https://l0g.fr/methodologie/debt-risk-radar/',
    calculation: {
      summary:
        'Score de stress courant Debt Risk Radar calcule par bucket_scores(metrics) puis overall_score(buckets, exclude=cbo_projection). Les projections CBO restent publiees comme vulnerabilite structurelle de long terme.',
      sourceCode: 'https://github.com/bluetouff/debt-risk-radar',
      formula: [
        'z = (valeur - moyenne_fenetre) / ecart_type_fenetre',
        'signed_z = z si direction=up, -z si direction=down',
        'risk_score = clip(50 + signed_z * 15, 0, 100)',
        'score_famille = moyenne ponderee des risk_score disponibles dans la famille',
        'score_structurel_cbo = score_famille des projections CBO',
        'score_courant = moyenne ponderee des score_famille disponibles hors cbo_projection',
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
        'Sources institutionnelles principales : Treasury Fiscal Data, FRED, BIS, CBO, World Bank.',
        'Les prix, ETF et ratios de marche passent par Massive Market Data quand MASSIVE_API_KEY est configuree cote serveur.',
        'Les sources optionnelles absentes sont exclues du score, avec renormalisation par familles disponibles.',
      ],
    },
  },
};
