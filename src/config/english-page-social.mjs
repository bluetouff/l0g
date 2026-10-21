import { createHash } from 'node:crypto';

// Editorial sharing cards for English entry points. Content illustrations and
// the dedicated bilingual book cards retain priority in the English layout.
const definitions = [
  ['home', '/en/', 'INDEPENDENT ANALYSIS', ['Independent', 'financial analysis'], ['Macro, credit and public policy.', 'Primary sources, open access.'], 'teal', 'network', ['MACRO', 'CREDIT', 'POLICY']],
  ['asia', '/en/asia/', 'ASIA / GLOBAL LINKS', ['Asia in the', 'global economy'], ['Capital flows, currencies', 'and supply chains.'], 'teal', 'network', ['CAPITAL', 'CURRENCIES', 'SUPPLY CHAINS']],
  ['analysis', '/en/analysis/', 'THE ENGLISH EDITION', ['Financial', 'investigations'], ['Macro, markets, technology and policy.', 'Evidence and uncertainty kept visible.'], 'rose', 'network', ['FINANCE', 'POLICY', 'EVIDENCE']],
  ['guides', '/en/guides/', 'REFERENCE LIBRARY', ['Reference', 'guides'], ['Financial concepts and mechanisms,', 'with primary sources and clear limits.'], 'teal', 'reference', ['CONCEPTS', 'SOURCES', 'METHOD']],
  ['tools', '/en/tools/', 'THE ANALYSIS LAB', ['Interactive', 'research tools'], ['Explore assumptions and mechanisms.', 'Calculations stay in your browser.'], 'teal', 'tools', ['INPUTS', 'MODELS', 'SCENARIOS']],
  ['atlas', '/en/atlas/', 'FINANCING ATLASES', ['Financial', 'networks'], ['Follow institutions, contracts', 'and the movement of money.'], 'amber', 'network', ['INSTITUTIONS', 'CONTRACTS', 'CAPITAL']],
  ['glossary', '/en/glossary/', 'FINANCIAL REFERENCE', ['Financial', 'glossary'], ['Definitions, mechanisms and links', 'to the underlying analysis.'], 'teal', 'reference', ['TERMS', 'MECHANISMS', 'CONTEXT']],
  ['start', '/en/start/', 'START HERE', ['Reading', 'paths'], ['Find an investigation, a guide', 'or a financial mechanism to explore.'], 'teal', 'reference', ['ANALYSES', 'GUIDES', 'TOOLS']],
  ['about', '/en/about/', 'ABOUT L0G', ['Independent', 'economic analysis'], ['A French publication', 'with an English editorial edition.'], 'rose', 'reference', ['INDEPENDENCE', 'SOURCES', 'METHOD']],
  ['api', '/en/api/', 'PUBLIC DATA INTERFACES', ['Public', 'data APIs'], ['Structured evidence and public data', 'in open, documented formats.'], 'amber', 'data', ['JSON', 'NDJSON', 'CSV']],
  ['mcp', '/en/mcp/', 'MODEL CONTEXT PROTOCOL', ['Finance', 'MCP'], ['Read-only access to l0g evidence', 'for research tools and agents.'], 'teal', 'data', ['READ ONLY', 'EVIDENCE', 'SOURCES']],
  ['agent-surface', '/en/agent-surface/', 'THE AGENT SURFACE', ['Machine-readable', 'evidence'], ['Structured publications, sources', 'and documented research interfaces.'], 'teal', 'data', ['DOCUMENTS', 'PROVENANCE', 'INTERFACES']],
  ['risk-diff', '/en/risk-diff/', 'RISK DIFF', ['Changes in', 'the risk picture'], ['Follow published signal revisions', 'with their dates and provenance.'], 'rose', 'data', ['REVISIONS', 'DATES', 'PROVENANCE']],
  ['black-box', '/en/black-box/', 'THE BLACK BOX', ['The public', 'risk record'], ['A dated record of published signals', 'and the evidence behind them.'], 'amber', 'data', ['SIGNALS', 'HISTORY', 'EVIDENCE']],
  ['dashboards', '/en/dashboards/', 'PUBLIC RISK MONITORS', ['Risk', 'dashboards'], ['Explore the public monitors', 'and their underlying methods.'], 'teal', 'tools', ['MONITORS', 'METHODS', 'SOURCES']],
  ['sources', '/en/sources/', 'THE SOURCE LIBRARY', ['Primary', 'sources'], ['Public institutions, original filings', 'and the documents behind the analysis.'], 'teal', 'reference', ['DOCUMENTS', 'FILINGS', 'PUBLIC DATA']],
  ['methodology', '/en/methodology/', 'INDICATORS AND METHODS', ['Risk indicator', 'methodology'], ['Sources, calculations', 'and the limits of each indicator.'], 'amber', 'tools', ['SOURCES', 'FORMULAS', 'LIMITS']],
  ['editorial-protocol', '/en/editorial-protocol/', 'EDITORIAL PROTOCOL', ['Evidence and', 'editorial method'], ['Claims, sources, uncertainty', 'and the path to a correction.'], 'rose', 'reference', ['CLAIMS', 'EVIDENCE', 'CORRECTIONS']],
  ['press-resources', '/en/press-resources/', 'PRESS RESOURCES', ['Charts and', 'public data'], ['Citable research material', 'with sources and attribution.'], 'teal', 'data', ['CHARTS', 'SOURCES', 'ATTRIBUTION']],
  ['manifesto', '/en/manifesto/', 'THE L0G MANIFESTO', ['Independent', 'open research'], ['Readable finance, public evidence', 'and transparent limits.'], 'rose', 'reference', ['INDEPENDENCE', 'OPEN ACCESS', 'EVIDENCE']],
  ['support', '/en/support/', 'READER SUPPORTED', ['Support', 'independent work'], ['Help keep sourced investigations', 'open and freely accessible.'], 'rose', 'reference', ['READERS', 'INDEPENDENCE', 'OPEN ACCESS']],
  ['contact', '/en/contact/', 'CONTACT THE PUBLICATION', ['Contact', 'l0g'], ['Reach the publication about its work,', 'sources or corrections.'], 'teal', 'reference', ['ENQUIRIES', 'SOURCES', 'CORRECTIONS']],
  ['tour', '/en/tour/', 'EXPLORE THE PUBLICATION', ['Explore', 'the publication'], ['Investigations, financial networks', 'and public research tools.'], 'teal', 'network', ['READ', 'EXPLORE', 'VERIFY']],
  ['cooling-adaptation', '/en/tools/cooling-adaptation-quote/', 'WATER AND ELECTRICITY', ['The cooling', 'adaptation quote'], ['Explore the costs and assumptions', 'behind cooling adaptation.'], 'teal', 'tools', ['COSTS', 'CAPACITY', 'ADAPTATION']],
  ['digital-euro-cost', '/en/tools/digital-euro-cost/', 'PAYMENTS ECONOMICS', ['Digital euro', 'cost simulator'], ['Explore payment fees, adoption', 'and the distribution of costs.'], 'amber', 'tools', ['ADOPTION', 'FEES', 'COSTS']],
  ['invoice-incidents', '/en/tools/e-invoice-incident-log/', 'INVOICING CONTINUITY', ['E-invoice', 'incident log'], ['Document incidents, continuity', 'and the path to regularisation.'], 'rose', 'data', ['INCIDENTS', 'EVIDENCE', 'CONTINUITY']],
  ['invoice-cost', '/en/tools/e-invoicing-platform-cost/', 'ELECTRONIC INVOICING', ['Platform cost', 'calculator'], ['Compare published platform costs', 'with explicit business assumptions.'], 'amber', 'tools', ['VOLUME', 'ACCESS', 'COSTS']],
  ['model-pump', '/en/tools/model-pump-adequacy/', 'POWER ADEQUACY', ['The model', 'and the pump'], ['Explore local constraints', 'behind an electricity adequacy model.'], 'teal', 'tools', ['CAPACITY', 'WATER', 'IMPORTS']],
  ['reservoir', '/en/tools/reservoir-arbitrator/', 'HYDROPOWER', ['The reservoir', 'arbitrator'], ['Explore the timing of generation', 'and the value of stored water.'], 'teal', 'tools', ['STORAGE', 'TIMING', 'EFFICIENCY']],
  ['thermal-thresholds', '/en/tools/thermal-discharge-thresholds/', 'WATER AND ELECTRICITY', ['Thermal-discharge', 'thresholds'], ['Explore operating limits', 'with their supporting public sources.'], 'rose', 'tools', ['TEMPERATURE', 'FLOW', 'RULES']],
  ['wet-megawatt', '/en/tools/wet-megawatt-counter/', 'WATER AND ELECTRICITY', ['The wet', 'megawatt counter'], ['Explore water-cooled capacity', 'and the limits of the observable data.'], 'teal', 'tools', ['CAPACITY', 'COOLING', 'COVERAGE']],
  ['danube', '/en/tools/value-of-danube-centimetre/', 'POWER ECONOMICS', ['The value of a', 'Danube centimetre'], ['Explore operating hours, capacity', 'and intervention costs.'], 'amber', 'tools', ['CAPACITY', 'DURATION', 'COSTS']],
  ['identity-requests', '/en/tools/who-asks-for-what/', 'DIGITAL IDENTITY', ['Who asks', 'for what?'], ['Compare requested information', 'with a service’s declared scope.'], 'rose', 'data', ['REQUESTS', 'SCOPE', 'RECEIPTS']],
  ['invoice-access', '/en/tools/who-can-see-my-e-invoice/', 'ELECTRONIC INVOICING', ['E-invoice', 'access map'], ['Explore the regulated chain', 'and optional access to invoice data.'], 'teal', 'network', ['DOCUMENTS', 'ACTORS', 'ACCESS']],
];

// Include the rendering revision in the fingerprint when the visual template changes.
export const englishPageSocialCards = definitions.map(([key, path, label, titleLines, subtitleLines, accent, motif, tags]) => {
  const copy = { key, path, label, titleLines, subtitleLines, accent, motif, tags };
  const fingerprint = createHash('sha256').update(JSON.stringify({ revision: 1, ...copy })).digest('hex').slice(0, 12);
  return { ...copy, image: `/og/en/pages/${key}-${fingerprint}.png`, alt: `${titleLines.join(' ')}. ${subtitleLines.join(' ')} l0g English edition.` };
});

const byPath = new Map(englishPageSocialCards.map(card => [card.path, card]));
const homeCard = byPath.get('/en/');
if (!homeCard) throw new Error('The English edition requires a home sharing card.');
export const defaultEnglishPageSocial = homeCard;

/** Section cards cover pagination and definitions; unknown EN pages use English brand artwork. */
export function getEnglishPageSocial(pathname) {
  if (typeof pathname !== 'string' || !/^\/en(?:\/|$)/.test(pathname)) return null;
  const path = `${pathname.replace(/\/+$/, '')}/`;
  if (byPath.has(path)) return byPath.get(path);
  for (const section of ['/en/analysis/', '/en/glossary/', '/en/guides/', '/en/tools/', '/en/atlas/']) {
    if (path.startsWith(section)) return byPath.get(section);
  }
  return defaultEnglishPageSocial;
}
