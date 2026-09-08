export const oilPublicationEn = {
  title: 'Banking on Oil',
  subtitle: 'Credit, cargoes and the power of oil',
  date: '2026-09-08',
  modified: '2026-09-08T20:23:06Z',
  path: '/en/publications/banking-on-oil/',
  epub: '/publications/banking-on-oil-l0g.epub',
  cover: '/publications/banking-on-oil-cover.jpg',
  social: '/publications/banking-on-oil-cover-social.jpg',
  introduction: [
    'An oil tanker leaves port. Its cargo has a buyer, a price and a destination. It also has a financial timetable: money advanced to buy it, guarantees required by a bank, cash tied up in a price hedge, and payment expected on arrival. Someone has to fund the gaps between those dates.',
    'Banking on Oil follows that money through eight investigations. The journey starts with the financing of a cargo and moves to the banks that lend to commodity traders. It then follows Chad’s oil revenues pledged to creditors, the construction of a price benchmark, and the refineries, terminals and filling stations that give trading a physical base.',
    'Two court cases open a different perspective. Trafigura’s nickel case examines the controls around a financed cargo. The Trafigura–Petrobras case traces bribery through contracts and payments. Each has its own parties, dates and legal findings. They help explain responsibilities and failures of control; their conclusions cannot be extended to the whole industry.',
    'The final chapter connects these mechanisms to the continuity of deliveries. When collateral falls due before a sale brings in cash, timing becomes critical. Energy-sector cases from 2022 help examine the available backstops. They concern gas and electricity in particular and do not describe a worldwide interruption of oil trading.',
    'Contracts, accounts, decisions and institutional publications accompany the analysis throughout. Hypothetical examples remain labelled, and figures retain their dates and scope. This edition brings together the English articles published from 6 to 8 September 2026 in one continuous reading order, with their source references and links to the online versions.',
  ],
};

export const oilChaptersEn = [
  ['banking-on-oil-1-cargo-trade-finance', 'Who pays for an oil cargo before you do?', 'Credit, collateral and the financial timetable of a cargo.'],
  ['banking-on-oil-2-banks-financing-trafigura', 'The banks behind Trafigura’s oil trading', 'The lenders and instruments that finance commodity trading.'],
  ['banking-on-oil-3-chad-glencore-oil-backed-debt', 'Chad and Glencore: the oil revenues pledged to creditors', 'Debt, export receipts and the government budget.'],
  ['banking-on-oil-4-trafigura-platts-fuel-oil-benchmark', 'Trafigura and the making of a fuel-oil benchmark', 'The CFTC case and the construction of a Platts price assessment.'],
  ['banking-on-oil-5-vitol-refineries-terminals-engen', 'Vitol’s refineries, terminals and the power to choose suppliers', 'Infrastructure ownership and conditions of competition.'],
  ['banking-on-oil-6-trafigura-nickel-fraud', 'Trafigura’s nickel fraud and the limits of paper collateral', 'Misdescribed cargoes and the controls around trade finance.'],
  ['banking-on-oil-7-trafigura-petrobras-bribery', 'Trafigura and Petrobras: how bribery entered the oil trade', 'Intermediaries, payments and penalties.'],
  ['banking-on-oil-8-credit-squeeze-oil-supplies', 'Can a credit squeeze disrupt oil supplies?', 'Margin calls, liquidity and supply backstops.'],
].map(([slug, title, summary], index) => ({
  number: index + 1, slug, title, summary,
  route: `/en/analysis/${slug}/`,
  chapter: `ch${String(index + 2).padStart(3, '0')}.xhtml`,
}));
