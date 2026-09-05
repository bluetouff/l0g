export const CHINA_EXTERNAL_BALANCE_SHEET_LENS_MODEL_VERSION = '1.0.0';

export type ChinaExternalUnit = 'USD bn' | 'RMB tn';
export type ChinaExternalRelation =
  | 'same'
  | 'disjoint_additive'
  | 'nettable'
  | 'component_overlap'
  | 'subset_overlap'
  | 'scope_or_date_mismatch'
  | 'unit_mismatch'
  | 'not_comparable';

export interface ChinaExternalLayer {
  id: string;
  labelFr: string;
  labelEn: string;
  value: number;
  unit: ChinaExternalUnit;
  date: string;
  family: string;
  parentId?: string;
  dimension: 'asset' | 'liability' | 'net' | 'stock' | 'sector-total';
  sourceFr: string;
  sourceEn: string;
  perimeterFr: string;
  perimeterEn: string;
}

export interface ChinaExternalComparison {
  left: ChinaExternalLayer;
  right: ChinaExternalLayer;
  relation: ChinaExternalRelation;
  canAdd: boolean;
  canNet: boolean;
  calculatedValue: number | null;
  officialReference: number | null;
  roundingGap: number | null;
  titleFr: string;
  titleEn: string;
  explanationFr: string;
  explanationEn: string;
}

export const CHINA_EXTERNAL_LAYERS: readonly ChinaExternalLayer[] = [
  { id: 'iip-assets-2026q1', labelFr: 'Actifs extérieurs totaux', labelEn: 'Total external assets', value: 11975.7, unit: 'USD bn', date: '2026-03-31', family: 'iip-2026q1', dimension: 'asset', sourceFr: 'SAFE, position extérieure', sourceEn: 'SAFE, international investment position', perimeterFr: 'Tous les actifs financiers extérieurs des résidents chinois couverts par la position extérieure.', perimeterEn: 'All external financial assets of Chinese residents covered by the IIP.' },
  { id: 'iip-liabilities-2026q1', labelFr: 'Passifs extérieurs totaux', labelEn: 'Total external liabilities', value: 7969.6, unit: 'USD bn', date: '2026-03-31', family: 'iip-2026q1', dimension: 'liability', sourceFr: 'SAFE, position extérieure', sourceEn: 'SAFE, international investment position', perimeterFr: 'Tous les passifs financiers extérieurs couverts par la position extérieure.', perimeterEn: 'All external financial liabilities covered by the IIP.' },
  { id: 'iip-net-2026q1', labelFr: 'Actifs extérieurs nets officiels', labelEn: 'Official net external assets', value: 4006.0, unit: 'USD bn', date: '2026-03-31', family: 'iip-2026q1', dimension: 'net', sourceFr: 'SAFE, position extérieure', sourceEn: 'SAFE, international investment position', perimeterFr: 'Solde officiel actifs moins passifs, publié avec arrondis.', perimeterEn: 'Official assets-minus-liabilities balance, published with rounding.' },
  { id: 'iip-direct-2026q1', labelFr: 'Investissement direct, actifs', labelEn: 'Direct investment assets', value: 3605.2, unit: 'USD bn', date: '2026-03-31', family: 'iip-assets-2026q1', parentId: 'iip-assets-2026q1', dimension: 'asset', sourceFr: 'SAFE, position extérieure', sourceEn: 'SAFE, international investment position', perimeterFr: 'Composante des actifs extérieurs totaux.', perimeterEn: 'Component of total external assets.' },
  { id: 'iip-portfolio-2026q1', labelFr: 'Investissements de portefeuille, actifs', labelEn: 'Portfolio investment assets', value: 2046.6, unit: 'USD bn', date: '2026-03-31', family: 'iip-assets-2026q1', parentId: 'iip-assets-2026q1', dimension: 'asset', sourceFr: 'SAFE, position extérieure', sourceEn: 'SAFE, international investment position', perimeterFr: 'Composante des actifs extérieurs totaux.', perimeterEn: 'Component of total external assets.' },
  { id: 'iip-derivatives-2026q1', labelFr: 'Dérivés financiers, actifs', labelEn: 'Financial derivative assets', value: 29.5, unit: 'USD bn', date: '2026-03-31', family: 'iip-assets-2026q1', parentId: 'iip-assets-2026q1', dimension: 'asset', sourceFr: 'SAFE, position extérieure', sourceEn: 'SAFE, international investment position', perimeterFr: 'Valeur de marché positive des dérivés hors réserves, pas leur notionnel.', perimeterEn: 'Positive market value of derivatives excluding reserves, not notional.' },
  { id: 'iip-other-2026q1', labelFr: 'Autres investissements, actifs', labelEn: 'Other investment assets', value: 2543.2, unit: 'USD bn', date: '2026-03-31', family: 'iip-assets-2026q1', parentId: 'iip-assets-2026q1', dimension: 'asset', sourceFr: 'SAFE, position extérieure', sourceEn: 'SAFE, international investment position', perimeterFr: 'Dépôts, prêts, crédits commerciaux et autres créances.', perimeterEn: 'Deposits, loans, trade credit and other claims.' },
  { id: 'iip-reserves-2026q1', labelFr: 'Actifs de réserve', labelEn: 'Reserve assets', value: 3751.1, unit: 'USD bn', date: '2026-03-31', family: 'iip-assets-2026q1', parentId: 'iip-assets-2026q1', dimension: 'asset', sourceFr: 'SAFE, position extérieure', sourceEn: 'SAFE, international investment position', perimeterFr: 'Réserves officielles au sens de la position extérieure, incluant plus que les seules réserves de change.', perimeterEn: 'Official reserve assets in the IIP, broader than foreign-exchange reserves alone.' },
  { id: 'fx-reserves-2026m7', labelFr: 'Réserves de change mensuelles', labelEn: 'Monthly foreign-exchange reserves', value: 3418.8, unit: 'USD bn', date: '2026-07-31', family: 'monthly-fx-reserves', dimension: 'stock', sourceFr: 'SAFE, série mensuelle', sourceEn: 'SAFE, monthly series', perimeterFr: 'Réserves de change uniquement, à une date postérieure à la position extérieure.', perimeterEn: 'Foreign-exchange reserves only, at a later date than the IIP.' },
  { id: 'banks-assets-2026q1', labelFr: 'Actifs extérieurs des banques', labelEn: 'Banks external assets', value: 2108.6, unit: 'USD bn', date: '2026-03-31', family: 'banks-2026q1', dimension: 'asset', sourceFr: 'SAFE, bilan extérieur bancaire', sourceEn: 'SAFE, banking external balance sheet', perimeterFr: 'Sous-ensemble sectoriel de la position extérieure, avec sa propre ventilation.', perimeterEn: 'Sectoral subset of the IIP, with a separate breakdown.' },
  { id: 'banks-liabilities-2026q1', labelFr: 'Passifs extérieurs des banques', labelEn: 'Banks external liabilities', value: 1485.1, unit: 'USD bn', date: '2026-03-31', family: 'banks-2026q1', dimension: 'liability', sourceFr: 'SAFE, bilan extérieur bancaire', sourceEn: 'SAFE, banking external balance sheet', perimeterFr: 'Passifs extérieurs du secteur bancaire.', perimeterEn: 'External liabilities of the banking sector.' },
  { id: 'banks-net-2026q1', labelFr: 'Actifs extérieurs nets des banques', labelEn: 'Banks net external assets', value: 623.6, unit: 'USD bn', date: '2026-03-31', family: 'banks-2026q1', dimension: 'net', sourceFr: 'SAFE, bilan extérieur bancaire', sourceEn: 'SAFE, banking external balance sheet', perimeterFr: 'Solde officiel des actifs et passifs bancaires, avec arrondis.', perimeterEn: 'Official balance of bank external assets and liabilities, with rounding.' },
  { id: 'nonreserve-portfolio-2025', labelFr: 'Portefeuille extérieur hors réserves', labelEn: 'External portfolio assets excluding reserves', value: 1987.5, unit: 'USD bn', date: '2025-12-31', family: 'nonreserve-portfolio-2025', dimension: 'stock', sourceFr: 'SAFE, enquête par destination et secteur', sourceEn: 'SAFE, destination and holder-sector release', perimeterFr: 'Titres de portefeuille des résidents, réserves officielles exclues.', perimeterEn: 'Residents portfolio securities, official reserves excluded.' },
  { id: 'nonreserve-us-2025', labelFr: 'Portefeuille hors réserves vers les États-Unis', labelEn: 'Non-reserve portfolio assets in the United States', value: 364.0, unit: 'USD bn', date: '2025-12-31', family: 'nonreserve-portfolio-2025', parentId: 'nonreserve-portfolio-2025', dimension: 'stock', sourceFr: 'SAFE, destination déclarée', sourceEn: 'SAFE, reported destination', perimeterFr: 'Destination États-Unis dans les actifs de portefeuille hors réserves.', perimeterEn: 'United States destination within non-reserve portfolio assets.' },
  { id: 'us-securities-mainland-2025', labelFr: 'Titres américains attribués à la Chine continentale', labelEn: 'U.S. securities attributed to mainland China', value: 1279.0, unit: 'USD bn', date: '2025-06-30', family: 'tic-annual-2025', dimension: 'stock', sourceFr: 'Trésor américain, enquête annuelle TIC', sourceEn: 'U.S. Treasury annual TIC survey', perimeterFr: 'Titres américains officiels et privés attribués par la chaîne de conservation; Hong Kong et Macao séparés.', perimeterEn: 'Official and private U.S. securities attributed through custody records; Hong Kong and Macau separate.' },
  { id: 'treasuries-mainland-2026m6', labelFr: 'Treasuries attribués à la Chine continentale', labelEn: 'Treasuries attributed to mainland China', value: 633.4, unit: 'USD bn', date: '2026-06-30', family: 'tic-monthly-2026m6', dimension: 'stock', sourceFr: 'Trésor américain, TIC mensuel', sourceEn: 'U.S. Treasury monthly TIC', perimeterFr: 'Bons, notes et obligations du Trésor attribués aux dépositaires; détention économique imparfaitement identifiée.', perimeterEn: 'Treasury bills, notes and bonds attributed through custody data; economic ownership imperfectly identified.' },
  { id: 'cic-assets-2023', labelFr: 'Actifs totaux de CIC', labelEn: 'CIC total assets', value: 1330.0, unit: 'USD bn', date: '2023-12-31', family: 'cic-2023', dimension: 'sector-total', sourceFr: 'China Investment Corporation, rapport 2023', sourceEn: 'China Investment Corporation, 2023 report', perimeterFr: 'Actifs consolidés de CIC, incluant des activités et participations qui ne doivent pas être additionnées aux réserves.', perimeterEn: 'CIC consolidated assets, including activities and stakes that must not be added to reserves.' },
  { id: 'insurance-assets-2026q2', labelFr: 'Actifs des assureurs et gérants d’assurance', labelEn: 'Insurance companies and asset managers assets', value: 43.9, unit: 'RMB tn', date: '2026-06-30', family: 'insurance-2026q2', dimension: 'sector-total', sourceFr: 'NFRA, indicateurs du deuxième trimestre', sourceEn: 'NFRA, second-quarter indicators', perimeterFr: 'Bilan total domestique du secteur, pas son portefeuille extérieur.', perimeterEn: 'Total domestic-sector balance sheet, not its foreign portfolio.' },
] as const;

const byId = new Map(CHINA_EXTERNAL_LAYERS.map((layer) => [layer.id, layer]));

export const CHINA_EXTERNAL_COMPARISON_PRESETS = [
  { id: 'components', left: 'iip-direct-2026q1', right: 'iip-portfolio-2026q1', labelFr: 'Deux composantes additives', labelEn: 'Two additive components' },
  { id: 'net', left: 'iip-assets-2026q1', right: 'iip-liabilities-2026q1', labelFr: 'Actifs moins passifs', labelEn: 'Assets minus liabilities' },
  { id: 'double-count', left: 'iip-assets-2026q1', right: 'iip-reserves-2026q1', labelFr: 'Le double compte classique', labelEn: 'The classic double count' },
  { id: 'banks', left: 'iip-assets-2026q1', right: 'banks-assets-2026q1', labelFr: 'Un secteur déjà inclus', labelEn: 'A sector already included' },
  { id: 'us', left: 'us-securities-mainland-2025', right: 'nonreserve-us-2025', labelFr: 'Deux mesures américaines incompatibles', labelEn: 'Two incompatible U.S. measures' },
  { id: 'reserves', left: 'iip-reserves-2026q1', right: 'fx-reserves-2026m7', labelFr: 'Deux dates, deux réserves', labelEn: 'Two dates, two reserve concepts' },
  { id: 'units', left: 'insurance-assets-2026q2', right: 'banks-assets-2026q1', labelFr: 'Unités et périmètres différents', labelEn: 'Different units and scopes' },
] as const;

function pairKey(a: string, b: string): string {
  return [a, b].sort().join('|');
}

const explicitlyNotComparable = new Set([
  pairKey('us-securities-mainland-2025', 'nonreserve-us-2025'),
  pairKey('us-securities-mainland-2025', 'treasuries-mainland-2026m6'),
  pairKey('nonreserve-us-2025', 'treasuries-mainland-2026m6'),
  pairKey('cic-assets-2023', 'iip-reserves-2026q1'),
  pairKey('cic-assets-2023', 'iip-assets-2026q1'),
]);

const subsetOfIip = new Set(['banks-assets-2026q1', 'nonreserve-portfolio-2025', 'cic-assets-2023']);

export function getChinaExternalLayer(id: string): ChinaExternalLayer {
  return byId.get(id) ?? CHINA_EXTERNAL_LAYERS[0];
}

function relationCopy(relation: ChinaExternalRelation): Pick<ChinaExternalComparison, 'titleFr' | 'titleEn' | 'explanationFr' | 'explanationEn'> {
  switch (relation) {
    case 'same': return { titleFr: 'Même statistique', titleEn: 'Same statistic', explanationFr: 'Les deux sélections désignent exactement la même série. Les additionner créerait un double compte.', explanationEn: 'Both selections refer to the same series. Adding them would double count it.' };
    case 'disjoint_additive': return { titleFr: 'Addition possible dans ce cadre', titleEn: 'Addition is valid in this frame', explanationFr: 'Les deux montants sont des composantes distinctes du même agrégat, à la même date et dans la même unité. Leur somme reste partielle.', explanationEn: 'The two values are disjoint components of the same aggregate, at the same date and in the same unit. Their sum is still partial.' };
    case 'nettable': return { titleFr: 'Soustraction pertinente, avec arrondis', titleEn: 'Subtraction is meaningful, with rounding', explanationFr: 'Les actifs et passifs du même cadre peuvent être soustraits. Le résultat calculé peut différer légèrement du solde officiel à cause des arrondis.', explanationEn: 'Assets and liabilities in the same frame can be netted. The calculated result may differ slightly from the official balance because of rounding.' };
    case 'component_overlap': return { titleFr: 'Le second montant est déjà inclus', titleEn: 'The second value is already included', explanationFr: 'Un total et l’une de ses composantes ne doivent pas être additionnés. Le montant composant est déjà contenu dans le total.', explanationEn: 'A total and one of its components must not be added. The component is already contained in the total.' };
    case 'subset_overlap': return { titleFr: 'Chevauchement probable ou certain', titleEn: 'Probable or certain overlap', explanationFr: 'Le montant sectoriel ou institutionnel recoupe un agrégat plus large. Sans table de consolidation, une somme fabriquerait un double compte.', explanationEn: 'The sectoral or institutional figure overlaps a broader aggregate. Without a consolidation table, adding them would create double counting.' };
    case 'scope_or_date_mismatch': return { titleFr: 'Date ou définition différente', titleEn: 'Different date or definition', explanationFr: 'Les deux séries peuvent éclairer le même sujet, mais elles ne portent pas sur le même jour ou le même contenu. Leur écart n’est pas un flux.', explanationEn: 'The two series may illuminate the same topic, but they do not cover the same date or content. Their difference is not a flow.' };
    case 'unit_mismatch': return { titleFr: 'Unités incompatibles', titleEn: 'Incompatible units', explanationFr: 'Un montant en dollars et un total en renminbi ne peuvent pas être combinés sans taux de change daté. Leurs périmètres diffèrent également.', explanationEn: 'A dollar value and a renminbi total cannot be combined without a dated exchange rate. Their scopes also differ.' };
    default: return { titleFr: 'Comparaison descriptive seulement', titleEn: 'Descriptive comparison only', explanationFr: 'Les méthodes, les détenteurs, les dates ou les actifs couverts diffèrent. La comparaison est utile pour comprendre la visibilité statistique, pas pour calculer un total.', explanationEn: 'Methods, holders, dates or covered assets differ. The comparison is useful for understanding statistical visibility, not for calculating a total.' };
  }
}

export function compareChinaExternalLayers(leftId: string, rightId: string): ChinaExternalComparison {
  const left = getChinaExternalLayer(leftId);
  const right = getChinaExternalLayer(rightId);
  let relation: ChinaExternalRelation = 'not_comparable';
  let calculatedValue: number | null = null;
  let officialReference: number | null = null;
  let roundingGap: number | null = null;

  if (left.id === right.id) {
    relation = 'same';
  } else if (left.unit !== right.unit) {
    relation = 'unit_mismatch';
  } else if (left.parentId === right.id || right.parentId === left.id) {
    relation = 'component_overlap';
  } else if (left.parentId && right.parentId && left.parentId === right.parentId && left.date === right.date) {
    relation = 'disjoint_additive';
    calculatedValue = left.value + right.value;
  } else if (left.family === right.family && left.date === right.date && ((left.dimension === 'asset' && right.dimension === 'liability') || (left.dimension === 'liability' && right.dimension === 'asset'))) {
    relation = 'nettable';
    calculatedValue = left.dimension === 'asset' ? left.value - right.value : right.value - left.value;
    const net = CHINA_EXTERNAL_LAYERS.find((layer) => layer.family === left.family && layer.dimension === 'net');
    officialReference = net?.value ?? null;
    roundingGap = officialReference == null ? null : calculatedValue - officialReference;
  } else if ((left.id === 'iip-assets-2026q1' && subsetOfIip.has(right.id)) || (right.id === 'iip-assets-2026q1' && subsetOfIip.has(left.id))) {
    relation = 'subset_overlap';
  } else if (explicitlyNotComparable.has(pairKey(left.id, right.id))) {
    relation = 'not_comparable';
  } else if (left.date !== right.date || left.family !== right.family) {
    relation = 'scope_or_date_mismatch';
  }

  const copy = relationCopy(relation);
  return {
    left,
    right,
    relation,
    canAdd: relation === 'disjoint_additive',
    canNet: relation === 'nettable',
    calculatedValue,
    officialReference,
    roundingGap,
    ...copy,
  };
}
