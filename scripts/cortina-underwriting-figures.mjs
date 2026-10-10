import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const CORTINA_SIMULATION = Object.freeze({
  annualProgrammePremiumUsd: 100_000_000,
  annualExpertiseCostUsd: 200_000,
  leadShares: Object.freeze([0.2, 0.1]),
});

export const CORTINA_FIGURE_SOURCES = Object.freeze({
  principle: 'https://www.lloyds.com/market-resources/market-oversight/principles-for-doing-business-at-lloyds/underwriting-profitability',
  guidance: 'https://www.lloyds.com/market-resources/delegated-authorities/market-knowledge/delegated-underwriting-guidance',
});

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const color = name => `var(--color-${name})`;
const path = (d, role = 'signal', extra = '') => `<path d="${d}" fill="none" stroke="${color(role)}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const rect = (x, y, w, h, role = 'line-strong', extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9" fill="none" stroke="${color(role)}" stroke-width="1.5" ${extra}/>`;
const label = (x, y, value, size = 22, role = 'paper', weight = 400, anchor = 'start', extra = '') => `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="${color(role)}" ${extra}>${escape(value)}</text>`;
const region = (name, bounds, content) => `<g data-region="${name}" data-bounds="${bounds.join(' ')}">${content}</g>`;
const round = value => Math.round(value * 1000) / 1000;

function arrow(points, role, flow, dashed = false) {
  const [endX, endY] = points.at(-1), [priorX, priorY] = points.at(-2);
  const length = Math.hypot(endX - priorX, endY - priorY);
  const dx = (endX - priorX) / length, dy = (endY - priorY) / length;
  const wings = [-1, 1].map(side => [round(endX - 8 * dx + side * 4 * dy), round(endY - 8 * dy - side * 4 * dx)]);
  const d = points.map(([x, y], index) => `${index ? 'L' : 'M'} ${x} ${y}`).join(' ');
  return path(d, role, `data-flow="${flow}" data-rail="true"${dashed ? ' stroke-dasharray="5 7"' : ''}`)
    + path(`M ${wings[0].join(' ')} L ${endX} ${endY} L ${wings[1].join(' ')}`, role);
}

function frame(lang, kind, height, title, desc, inner, width = 480, layout = 'mobile') {
  const prefix = `cortina-${lang}-${kind}-${layout}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="${prefix}-title ${prefix}-desc" style="width:100%;height:auto" class="cortina-figure-${layout}" data-cortina-figure="${kind}" data-layout="${layout}" lang="${lang}"><title id="${prefix}-title">${escape(title)}</title><desc id="${prefix}-desc">${escape(desc)}</desc><rect x="1" y="1" width="${width - 2}" height="${height - 2}" rx="16" fill="${color('surface')}" stroke="${color('line-strong')}" stroke-width="1"/>${inner}</svg>`;
}

function mechanism(lang) {
  const fr = lang === 'fr';
  const title = fr ? 'Qui porte l’expertise ?' : 'Who provides the expertise?';
  let s = region('heading', [16, 14, 448, 108],
    label(28, 40, '01 / LEAD → FOLLOW', 20, 'muted')
    + label(28, 79, title, 28, 'paper', 700)
    + label(28, 110, fr ? 'Un cadre, plusieurs porteurs de risque' : 'One framework, several risk carriers', 20, 'muted'));
  // An underwriting instrument, then a contract: the two drawings represent
  // different functions rather than an inventory of entities.
  s += `<g data-node="expertise">${path('M 31 182 L 77 182 M 54 152 L 54 202 M 37 182 L 31 198 L 44 198 L 37 182 M 71 182 L 65 198 L 78 198 L 71 182', 'amber')}${path('M 35 209 L 74 209', 'amber')}</g>`;
  s += region('expertise-copy', [86, 140, 354, 90],
    label(98, 171, fr ? 'Expertise du lead' : 'Lead underwriting expertise', 24, 'amber', 700)
    + label(98, 205, fr ? 'Analyser, tarifer, négocier' : 'Assess, price, negotiate', 21));
  s += arrow([[240, 226], [240, 253]], 'amber', 'pricing');
  s += `<g data-node="contract">${rect(58, 257, 364, 100, 'signal', 'data-panel="contract-copy"')}${path('M 77 277 L 91 277 M 77 287 L 91 287 M 77 297 L 91 297', 'signal')}</g>`;
  s += region('contract-copy', [99, 266, 310, 84],
    label(112, 299, fr ? 'Prix, garanties, exclusions' : 'Price, coverage, exclusions', 22, 'signal', 700)
    + label(112, 332, fr ? 'Un contrat à partager' : 'A contract to share', 21));
  s += region('allocation-copy', [20, 371, 440, 42], label(240, 403, fr ? 'Primes et risque, par quote-part' : 'Premium and risk, by signed share', 21, 'muted', 400, 'middle'));
  s += arrow([[240, 359], [240, 368]], 'signal', 'contract-allocation');
  s += arrow([[240, 416], [240, 430], [130, 430], [130, 449]], 'signal', 'allocation-lead');
  s += arrow([[240, 430], [340, 430], [340, 449]], 'signal', 'allocation-follower');
  for (const [x, name] of [[130, 'lead-share'], [340, 'follow-share']]) {
    s += `<g data-node="${name}"><circle cx="${x}" cy="484" r="30" fill="none" stroke="${color('signal')}" stroke-width="1.7"/>${path(`M ${x - 13} 467 L ${x + 13} 467 L ${x + 13} 486 L ${x} 500 L ${x - 13} 486 L ${x - 13} 467`, 'signal')}</g>`;
  }
  s += region('lead-share-copy', [29, 516, 202, 71], label(130, 546, 'Lead', 24, 'paper', 700, 'middle') + label(130, 578, fr ? 'Part conservée' : 'Retained share', 20, 'muted', 400, 'middle'));
  s += region('follow-share-copy', [235, 516, 211, 71], label(340, 546, fr ? 'Capital suiveur' : 'Follow capital', 24, 'paper', 700, 'middle') + label(340, 578, fr ? 'Part souscrite' : 'Subscribed share', 20, 'muted', 400, 'middle'));
  // Dashed rail denotes an economic design question, never an observed fee.
  s += arrow([[372, 484], [450, 484], [450, 188], [425, 188]], 'amber', 'expertise-remuneration', true);
  s += path('M 28 618 L 74 618', 'amber', 'stroke-dasharray="5 7"');
  s += region('return-copy', [81, 590, 370, 76], label(91, 624, fr ? 'Rémunérer l’expertise :' : 'Paying for expertise:', 22, 'amber', 700) + label(91, 654, fr ? 'un accord à préciser' : 'an agreement to define', 21));
  s += region('scope-copy', [16, 675, 448, 70], label(28, 706, fr ? 'Mécanisme général de souscription.' : 'General underwriting mechanism.', 20, 'muted') + label(28, 736, fr ? 'Honoraires Cortina non documentés.' : 'Cortina fees remain undocumented.', 20, 'muted'));
  return frame(lang, 'mechanism', 754, title,
    fr ? 'L’expertise du lead définit le prix et les conditions. Le contrat répartit primes et risque entre la part conservée et le capital suiveur. Un retour en pointillé identifie la rémunération de cette expertise comme un accord à préciser, sans décrire les honoraires de Cortina.' : 'Lead expertise establishes pricing and terms. A contract allocates premium and risk between the retained share and follow capital. A dashed return identifies remuneration for expertise as an agreement to define, without describing Cortina fees.', s);
}

function fixedCost(lang) {
  const fr = lang === 'fr';
  const title = fr ? 'Quand la base se réduit' : 'When the premium base shrinks';
  const premiumBase = CORTINA_SIMULATION.leadShares.map(share => CORTINA_SIMULATION.annualProgrammePremiumUsd * share);
  const ratios = premiumBase.map(value => CORTINA_SIMULATION.annualExpertiseCostUsd / value);
  let s = region('heading', [16, 14, 448, 108], label(28, 40, fr ? '02 / SIMULATION FICTIVE' : '02 / HYPOTHETICAL EXAMPLE', 20, 'muted') + label(28, 79, title, fr ? 28 : 26, 'paper', 700) + label(28, 111, fr ? 'Programme : 100 M USD de primes/an' : 'Programme: USD 100m premium/year', 20, 'muted'));
  s += rect(28, 139, 424, 78, 'amber', 'data-panel="fixed-budget"');
  s += region('fixed-budget', [34, 142, 412, 71], label(44, 171, fr ? 'Budget d’expertise annuel fixe' : 'Fixed annual expertise budget', 20, 'muted') + label(44, 203, fr ? '200 000 USD' : 'USD 200,000', 29, 'amber', 700));
  for (const [i, share] of CORTINA_SIMULATION.leadShares.entries()) {
    const y = 265 + i * 150, base = premiumBase[i], ratio = ratios[i];
    s += region(`scenario-${i}-heading`, [28, y - 32, 424, 38], label(40, y - 5, fr ? `Lead : ${share * 100} %` : `Lead: ${share * 100}%`, 22, 'paper', 700) + label(440, y - 5, fr ? `${base / 1e6} M USD` : `USD ${base / 1e6}m`, 24, 'signal', 700, 'end'));
    s += `<rect x="40" y="${y + 12}" width="400" height="28" rx="3" fill="none" stroke="${color('line-strong')}" stroke-width="1"/>`;
    s += `<rect x="40" y="${y + 12}" width="${400 * base / 20_000_000}" height="28" rx="3" fill="${color('signal')}" data-premium-bar="${i}" data-premium-usd="${base}"/>`;
    s += region(`scenario-${i}-calculation`, [28, y + 50, 424, 52], label(40, y + 86, fr ? `200 000 ÷ ${base === 20e6 ? '20' : '10'} 000 000` : `200,000 ÷ ${base === 20e6 ? '20' : '10'},000,000`, 20) + label(440, y + 86, fr ? `${ratio * 100} %` : `${ratio * 100}%`, 32, 'amber', 700, 'end', `data-cost-ratio="${ratio}"`));
  }
  s += path('M 40 541 L 440 541', 'line-strong', 'data-axis="premium-zero"');
  for (const [x, value] of [[40, 0], [240, 10], [440, 20]]) {
    s += path(`M ${x} 536 L ${x} 547`, 'line-strong');
    s += region(`tick-${value}`, [value === 0 ? 28 : value === 20 ? 380 : 205, 548, value === 10 ? 70 : 72, 38], label(x, 578, String(value), 20, 'muted', 400, value === 0 ? 'start' : value === 20 ? 'end' : 'middle'));
  }
  s += region('axis-copy', [16, 588, 448, 40], label(240, 617, fr ? 'Primes signées par le lead, M USD/an' : 'Lead signed premium, USD m/year', 20, 'muted', 400, 'middle'));
  s += region('mechanism-copy', [16, 647, 448, 108], label(28, 678, fr ? 'Même coût ÷ moitié de primes' : 'Same cost ÷ half the premium', 24, 'paper', 700) + label(28, 712, fr ? 'Le poids du coût fixe double.' : 'The fixed-cost ratio doubles.', 24, 'amber', 700) + label(28, 746, fr ? 'Prix et couverture restent constants.' : 'Price and coverage stay unchanged.', 20, 'muted'));
  return frame(lang, 'fixed-cost', 766, title,
    fr ? 'Simulation fictive d’un programme de cent millions de dollars de primes par an et d’un budget d’expertise fixe de deux cent mille dollars par an. Une part du lead de vingt pour cent produit vingt millions de primes signées et un ratio de coût de un pour cent ; dix pour cent produit dix millions de primes et deux pour cent. Les barres partent de zéro, sur une échelle commune. Prix unitaire et couverture inchangés. Ce calcul ne décrit pas Cortina.' : 'Hypothetical programme with one hundred million dollars in annual premium and a fixed annual expertise budget of two hundred thousand dollars. A twenty percent lead share produces twenty million in signed premium and a one percent cost ratio; ten percent produces ten million and two percent. Bars share a zero-based scale. Unit price and coverage stay unchanged. This calculation does not describe Cortina.', s);
}

function selection(lang) {
  const fr = lang === 'fr';
  const title = fr ? 'Deux choix façonnent le suivi' : 'Two gates shape the portfolio';
  let s = region('heading', [16, 14, 448, 110], label(28, 40, fr ? '03 / CHOIX DE PORTEFEUILLE' : '03 / PORTFOLIO CHOICES', 20, 'muted') + label(28, 79, title, fr ? 27 : 28, 'paper', 700) + label(28, 112, fr ? 'Schéma qualitatif, sans volumes' : 'Qualitative diagram, no volumes', 20, 'muted'));
  // The source and resulting portfolio use the same geometry: no funnel width
  // or icon count is offered as a numerical selection rate.
  function portfolio(y, role, name) {
    let content = '';
    for (let i = 0; i < 3; i++) content += `<rect x="${203 + i * 21}" y="${y + 6 - i * 4}" width="32" height="42" rx="3" fill="${color('surface')}" stroke="${color(role)}" stroke-width="1.7"/>`;
    return `<g data-node="${name}">${content}</g>`;
  }
  s += portfolio(151, 'line-strong', 'eligible-portfolio');
  s += region('eligible-copy', [20, 208, 440, 38], label(240, 237, fr ? 'Portefeuille éligible' : 'Eligible portfolio', 24, 'paper', 700, 'middle'));
  s += arrow([[240, 250], [240, 277]], 'signal', 'eligible-to-client');
  s += path('M 90 288 L 217 288 M 263 288 L 390 288', 'line-strong', 'data-gate="client"');
  s += path('M 217 288 L 250 258 M 263 288 L 276 288', 'signal');
  s += region('client-copy', [20, 304, 440, 70], label(240, 334, fr ? 'Choix du client' : 'Client choice', 24, 'signal', 700, 'middle') + label(240, 366, fr ? 'Quels contrats entrent ?' : 'Which contracts enter?', 21, 'paper', 400, 'middle'));
  s += arrow([[240, 381], [240, 409]], 'signal', 'client-to-manager');
  s += path('M 90 423 L 217 423 M 263 423 L 390 423', 'line-strong', 'data-gate="manager"');
  s += path('M 217 423 L 250 393 M 263 423 L 276 423', 'amber');
  s += region('manager-copy', [20, 439, 440, 70], label(240, 469, fr ? 'Acceptation du gestionnaire' : 'Manager acceptance', 24, 'amber', 700, 'middle') + label(240, 501, fr ? 'Limites, exclusions, cumuls' : 'Limits, exclusions, accumulations', 21, 'paper', 400, 'middle'));
  s += arrow([[240, 516], [240, 548]], 'signal', 'manager-to-effective');
  s += portfolio(558, 'signal', 'effective-portfolio');
  s += region('effective-copy', [20, 613, 440, 39], label(240, 643, fr ? 'Portefeuille effectif' : 'Actual portfolio', 24, 'paper', 700, 'middle'));
  // A common source can enter the eligible and selected portfolios. Neither
  // route estimates its frequency, severity or a selection rate.
  s += `<g data-node="common-exposure"><circle cx="56" cy="380" r="12" fill="none" stroke="${color('amber')}" stroke-width="1.7"/>${path('M 49 381 L 53 375 L 57 386 L 62 378', 'amber')}</g>`;
  s += arrow([[56, 365], [56, 180], [196, 180]], 'amber', 'common-risk-eligible', true);
  s += arrow([[56, 395], [56, 582], [196, 582]], 'amber', 'common-risk-effective', true);
  // A control loop connects what was accepted to the next underwriting gate.
  s += arrow([[280, 582], [424, 582], [424, 423], [395, 423]], 'amber', 'portfolio-control', true);
  s += region('control-copy', [16, 667, 448, 108], label(28, 699, fr ? 'Des risques communs restent possibles.' : 'Shared risks can survive selection.', 22, 'amber', 700) + label(28, 733, fr ? 'Le gestionnaire surveille les cumuls' : 'The manager monitors accumulations', 21, 'paper') + label(28, 762, fr ? 'et ajuste les paramètres du suivi.' : 'and adjusts follow parameters.', 21));
  return frame(lang, 'selection', 784, title,
    fr ? 'Le portefeuille éligible passe par le choix des clients puis par l’acceptation et les limites du gestionnaire, pour devenir le portefeuille effectif. Un retour de contrôle relie les expositions retenues aux paramètres du gestionnaire. Des risques communs peuvent demeurer après ces choix. Schéma qualitatif : aucune largeur ni quantité d’icônes ne mesure une proportion.' : 'An eligible portfolio passes through client choice and manager acceptance and limits to become the actual portfolio. A control loop feeds accepted exposures back into manager parameters. Selection retains the possibility of common underlying risks. This is a qualitative diagram: neither widths nor icon counts encode proportions.', s);
}

function wideHeading(lang, number, eyebrow, title, subtitle) {
  return region('heading', [16, 12, 688, 104],
    label(26, 37, `${number} / ${eyebrow}`, 18, 'muted')
    + label(26, 72, title, 26, 'paper', 700)
    + label(26, 103, subtitle, 18, 'muted'));
}

function wideMechanism(lang) {
  const fr = lang === 'fr';
  const title = fr ? 'Qui porte l’expertise ?' : 'Who provides the expertise?';
  let s = wideHeading(lang, '01', 'LEAD → FOLLOW', title,
    fr ? 'Un cadre, plusieurs porteurs de risque' : 'One framework, several risk carriers');
  s += `<g data-node="expertise">${rect(28, 130, 190, 164, 'amber')}${path('M 107 147 L 139 147 M 123 139 L 123 165 M 112 147 L 107 159 L 117 159 L 112 147 M 134 147 L 129 159 L 139 159 L 134 147', 'amber')}</g>`;
  s += region('expertise-copy', [32, 168, 182, 121],
    label(123, 194, fr ? 'Expertise du lead' : 'Lead expertise', 20, 'amber', 700, 'middle')
    + label(123, 230, fr ? 'Analyser, tarifer,' : 'Assess, price,', 18, 'paper', 400, 'middle')
    + label(123, 257, fr ? 'négocier' : 'negotiate', 18, 'paper', 400, 'middle'));
  s += arrow([[222, 213], [257, 213]], 'amber', 'pricing');
  s += `<g data-node="contract">${rect(266, 130, 206, 164, 'signal', 'data-panel="contract-copy"')}</g>`;
  s += region('contract-copy', [270, 134, 198, 156],
    label(369, 179, fr ? 'Prix, garanties,' : 'Price, coverage,', 20, 'signal', 700, 'middle')
    + label(369, 208, 'exclusions', 20, 'signal', 700, 'middle')
    + label(369, 259, fr ? 'Contrat partagé' : 'Shared contract', 18, 'paper', 400, 'middle'));
  s += region('allocation-copy', [510, 115, 194, 34], label(607, 140, fr ? 'Primes et risque' : 'Premium and risk', 18, 'muted', 400, 'middle'));
  s += arrow([[474, 213], [500, 213]], 'signal', 'contract-allocation');
  s += arrow([[500, 213], [510, 213], [510, 180], [531, 180]], 'signal', 'allocation-lead');
  s += arrow([[510, 213], [510, 263], [531, 263]], 'signal', 'allocation-follower');
  for (const [y, name] of [[151, 'lead-share'], [234, 'follow-share']]) {
    s += `<g data-node="${name}">${rect(536, y, 160, 63, 'signal')}</g>`;
  }
  s += region('lead-share-copy', [538, 155, 156, 55],
    label(616, 178, 'Lead', 20, 'paper', 700, 'middle')
    + label(616, 202, fr ? 'Part conservée' : 'Retained share', 18, 'muted', 400, 'middle'));
  s += region('follow-share-copy', [538, 238, 156, 55],
    label(616, 260, fr ? 'Capital suiveur' : 'Follow capital', 18, 'paper', 700, 'middle')
    + label(616, 285, fr ? 'Part souscrite' : 'Subscribed share', 18, 'muted', 400, 'middle'));
  s += arrow([[698, 263], [704, 263], [704, 376], [123, 376], [123, 299]], 'amber', 'expertise-remuneration', true);
  s += region('return-copy', [230, 315, 354, 57],
    label(242, 341, fr ? 'Rémunérer l’expertise' : 'Paying for expertise', 20, 'amber', 700)
    + label(242, 364, fr ? 'Un accord à préciser' : 'An agreement to define', 18));
  s += region('scope-copy', [16, 388, 688, 36], label(26, 415,
    fr ? 'Mécanisme général · honoraires Cortina non documentés.' : 'General underwriting mechanism · Cortina fees remain undocumented.', 18, 'muted'));
  // Both layouts share the same economic scope; only the drawing changes.
  return frame(lang, 'mechanism', 430, title,
    fr ? 'L’expertise fixe le prix et les conditions du contrat partagé entre lead et capital suiveur. Le retour en pointillé pose la question de la rémunération de cette expertise. Mécanisme général ; honoraires Cortina non documentés.' : 'Expertise sets pricing and terms of the contract shared by the lead and follow capital. The dashed return raises the question of paying for expertise. General underwriting mechanism; Cortina fees remain undocumented.', s, 720, 'desktop');
}

function wideFixedCost(lang) {
  const fr = lang === 'fr';
  const title = fr ? 'Quand la base se réduit' : 'When the premium base shrinks';
  let s = wideHeading(lang, '02', fr ? 'SIMULATION FICTIVE' : 'HYPOTHETICAL EXAMPLE', title,
    fr ? 'Programme : 100 M USD de primes/an' : 'Programme: USD 100m premium/year');
  for (const [i, share] of CORTINA_SIMULATION.leadShares.entries()) {
    const base = CORTINA_SIMULATION.annualProgrammePremiumUsd * share;
    const ratio = CORTINA_SIMULATION.annualExpertiseCostUsd / base;
    const y = 150 + 86 * i;
    s += region(`scenario-${i}-heading`, [28, y - 27, 424, 35],
      label(40, y, fr ? `Lead : ${share * 100} %` : `Lead: ${share * 100}%`, 20, 'paper', 700)
      + label(440, y, fr ? `${base / 1e6} M USD` : `USD ${base / 1e6}m`, 20, 'signal', 700, 'end'));
    s += `<rect x="40" y="${y + 12}" width="400" height="20" rx="3" fill="none" stroke="${color('line-strong')}" stroke-width="1"/>`;
    s += `<rect x="40" y="${y + 12}" width="${400 * base / 20_000_000}" height="20" rx="3" fill="${color('signal')}" data-premium-bar="${i}" data-premium-usd="${base}"/>`;
    s += region(`scenario-${i}-calculation`, [28, y + 35, 424, 37],
      label(40, y + 62, fr ? `200 000 ÷ ${i === 0 ? '20' : '10'} 000 000` : `200,000 ÷ ${i === 0 ? '20' : '10'},000,000`, 18)
      + label(440, y + 62, fr ? `${ratio * 100} %` : `${ratio * 100}%`, 24, 'amber', 700, 'end', `data-cost-ratio="${ratio}"`));
  }
  s += path('M 40 317 L 440 317', 'line-strong', 'data-axis="premium-zero"');
  for (const [x, value] of [[40, 0], [240, 10], [440, 20]]) {
    s += path(`M ${x} 312 L ${x} 322`, 'line-strong');
    s += region(`tick-${value}`, [value === 0 ? 28 : value === 20 ? 380 : 205, 326, value === 10 ? 70 : 72, 34], label(x, 352, String(value), 18, 'muted', 400, value === 0 ? 'start' : value === 20 ? 'end' : 'middle'));
  }
  s += region('axis-copy', [16, 365, 436, 32], label(240, 389,
    fr ? 'Primes du lead, M USD/an' : 'Lead signed premium, USD m/year', 18, 'muted', 400, 'middle'));
  s += rect(474, 130, 218, 129, 'amber', 'data-panel="fixed-budget"');
  s += region('fixed-budget', [478, 134, 210, 121],
    label(490, 163, fr ? 'Budget annuel' : 'Annual expertise', 18, 'muted')
    + label(490, 190, fr ? 'd’expertise fixe' : 'budget: fixed', 18, 'muted')
    + label(490, 234, fr ? '200 000 USD' : 'USD 200,000', 26, 'amber', 700));
  s += region('mechanism-copy', [474, 272, 230, 117],
    label(486, 300, fr ? 'Le poids du coût' : 'The fixed-cost ratio', 20, 'amber', 700)
    + label(486, 328, fr ? 'fixe double' : 'doubles', 20, 'amber', 700)
    + label(486, 359, fr ? 'Base divisée par deux.' : 'as the base halves.', 18));
  s += region('scope-copy', [16, 394, 688, 30], label(26, 416,
    fr ? 'Même coût, moitié de primes · prix et couverture constants.' : 'Same cost, half the premium · price and coverage stay unchanged.', 18, 'muted'));
  return frame(lang, 'fixed-cost', 430, title,
    fr ? 'Simulation fictive : cent millions de dollars de primes annuelles et deux cent mille dollars de budget d’expertise fixe. À vingt pour cent, le lead signe vingt millions de primes et le ratio vaut un pour cent. À dix pour cent, dix millions et deux pour cent. Barres de même échelle, origine zéro. Prix et couverture constants. Ce calcul ne décrit pas Cortina.' : 'Hypothetical annual programme premium of one hundred million dollars and a fixed expertise budget of two hundred thousand dollars. A twenty percent lead share gives twenty million in premium and a one percent ratio; ten percent gives ten million and two percent. Bars share a zero-based scale. Price and coverage stay unchanged. This calculation does not describe Cortina.', s, 720, 'desktop');
}

function wideSelection(lang) {
  const fr = lang === 'fr';
  const title = fr ? 'Deux choix façonnent le suivi' : 'Two gates shape the portfolio';
  let s = wideHeading(lang, '03', fr ? 'CHOIX DE PORTEFEUILLE' : 'PORTFOLIO CHOICES', title,
    fr ? 'Schéma qualitatif, sans volumes' : 'Qualitative diagram, no volumes');
  function portfolio(x, name) {
    let content = '';
    for (let i = 0; i < 3; i++) content += `<rect x="${x + i * 15}" y="${158 - i * 3}" width="26" height="34" rx="3" fill="${color('surface')}" stroke="${color(name === 'eligible-portfolio' ? 'line-strong' : 'signal')}" stroke-width="1.7"/>`;
    return `<g data-node="${name}">${content}</g>`;
  }
  s += portfolio(60, 'eligible-portfolio');
  s += portfolio(604, 'effective-portfolio');
  s += region('eligible-copy', [16, 203, 152, 62],
    label(92, 228, fr ? 'Portefeuille' : 'Eligible', 20, 'paper', 700, 'middle')
    + label(92, 255, fr ? 'éligible' : 'portfolio', 20, 'paper', 700, 'middle'));
  s += region('effective-copy', [552, 203, 152, 62],
    label(628, 228, fr ? 'Portefeuille' : 'Actual', 20, 'paper', 700, 'middle')
    + label(628, 255, fr ? 'effectif' : 'portfolio', 20, 'paper', 700, 'middle'));
  s += arrow([[130, 174], [204, 174]], 'signal', 'eligible-to-client');
  s += path('M 226 132 L 226 160 M 226 188 L 226 203', 'line-strong', 'data-gate="client"');
  s += path('M 226 160 L 247 184', 'signal');
  s += region('client-copy', [177, 213, 162, 92],
    label(258, 241, fr ? 'Choix du client' : 'Client choice', 20, 'signal', 700, 'middle')
    + label(258, 269, fr ? 'Quels contrats' : 'Which contracts', 18, 'paper', 400, 'middle')
    + label(258, 295, fr ? 'entrent ?' : 'enter?', 18, 'paper', 400, 'middle'));
  s += arrow([[250, 174], [390, 174]], 'signal', 'client-to-manager');
  s += path('M 414 132 L 414 160 M 414 188 L 414 203', 'line-strong', 'data-gate="manager"');
  s += path('M 414 160 L 435 184', 'amber');
  s += region('manager-copy', [347, 213, 194, 92],
    label(444, 241, fr ? 'Acceptation' : 'Manager', 20, 'amber', 700, 'middle')
    + label(444, 269, fr ? 'du gestionnaire' : 'acceptance', 20, 'amber', 700, 'middle')
    + label(444, 295, fr ? 'Limites et cumuls' : 'Limits, accumulations', 18, 'paper', 400, 'middle'));
  s += arrow([[438, 174], [590, 174]], 'signal', 'manager-to-effective');
  s += arrow([[632, 150], [632, 123], [414, 123], [414, 130]], 'amber', 'portfolio-control', true);
  s += `<g data-node="common-exposure"><circle cx="92" cy="333" r="12" fill="none" stroke="${color('amber')}" stroke-width="1.7"/>${path('M 85 334 L 89 328 L 93 339 L 98 331', 'amber')}</g>`;
  s += arrow([[76, 333], [14, 333], [14, 174], [52, 174]], 'amber', 'common-risk-eligible', true);
  s += arrow([[108, 333], [708, 333], [708, 174], [668, 174]], 'amber', 'common-risk-effective', true);
  s += region('control-copy', [16, 351, 688, 72],
    label(26, 379, fr ? 'Des risques communs restent possibles.' : 'Shared risks can survive selection.', 20, 'amber', 700)
    + label(26, 410, fr ? 'Le gestionnaire surveille les cumuls et ajuste le suivi.' : 'The manager monitors accumulations and adjusts follow parameters.', 18));
  return frame(lang, 'selection', 430, title,
    fr ? 'Le portefeuille éligible traverse le choix du client puis l’acceptation du gestionnaire. Les limites, exclusions et cumuls encadrent le portefeuille effectif. Un retour relie celui-ci au contrôle du gestionnaire ; des risques communs peuvent demeurer. Schéma qualitatif : aucune largeur ni quantité d’icônes ne mesure une proportion.' : 'The eligible portfolio passes through client choice and manager acceptance. Limits, exclusions and accumulations govern the actual portfolio. A control loop feeds it back to the manager; common risks can survive selection. This is a qualitative diagram: neither widths nor icon counts encode proportions.', s, 720, 'desktop');
}

const kinds = Object.freeze(['mechanism', 'fixed-cost', 'selection']);
export const CORTINA_FIGURE_KINDS = kinds;
export function cortinaUnderwritingSvg(lang, kind, layout = 'mobile') {
  if (!['fr', 'en'].includes(lang)) throw new TypeError('Unsupported figure language');
  if (!kinds.includes(kind)) throw new TypeError('Unsupported figure kind');
  if (!['mobile', 'desktop'].includes(layout)) throw new TypeError('Unsupported figure layout');
  const draw = layout === 'mobile'
    ? { mechanism, 'fixed-cost': fixedCost, selection }
    : { mechanism: wideMechanism, 'fixed-cost': wideFixedCost, selection: wideSelection };
  return draw[kind](lang);
}

const captions = {
  fr: {
    mechanism: 'Le prix et les conditions précèdent la répartition des primes et du risque. Le retour en pointillé pose la question de la rémunération de l’expertise. Les honoraires de Cortina restent à documenter. Cadre général du partage de l’expertise :',
    'fixed-cost': 'Simulation fictive, montants annuels en USD. Programme de 100 M USD de primes, expertise fixée à 200 000 USD. Seule la part du lead change : 20 %, puis 10 %. Prix unitaire et couverture constants. Ratio : budget d’expertise ÷ primes signées par le lead. Calcul l0g, sans donnée Cortina.',
    selection: 'Le portefeuille obtenu dépend des choix de participation et du contrôle des risques. Schéma qualitatif : les dimensions et les icônes ne représentent aucun taux de sélection. Cadre général des contrôles de portefeuille :',
  },
  en: {
    mechanism: 'Pricing and terms precede the allocation of premium and risk. The dashed return raises the question of paying for expertise. Cortina fees remain undocumented. General framework for sharing expertise:',
    'fixed-cost': 'Hypothetical example, annual amounts in USD. USD 100m programme premium and USD 200,000 fixed expertise budget. Only the lead share changes: 20%, then 10%. Unit price and coverage stay unchanged. Ratio: expertise budget ÷ lead signed premium. l0g calculation, not Cortina data.',
    selection: 'The resulting portfolio depends on participation choices and risk controls. Qualitative diagram: dimensions and icons do not represent selection rates. General framework for portfolio controls:',
  },
};

export function cortinaUnderwritingFigure(lang, kind) {
  const svg = ['desktop', 'mobile'].map(layout => cortinaUnderwritingSvg(lang, kind, layout)).join('');
  const source = kind === 'fixed-cost' ? '' : ` <a href="${CORTINA_FIGURE_SOURCES.guidance}">Lloyd’s</a>.`;
  return `<figure class="cortina-underwriting-figure">${svg}<figcaption style="font-size:.9rem;line-height:1.55;color:var(--color-muted);margin-top:.85rem">${escape(captions[lang][kind])}${source}</figcaption></figure>`;
}

export function cortinaUnderwritingFigures(lang) {
  return kinds.map(kind => cortinaUnderwritingFigure(lang, kind)).join('\n\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const lang = process.argv[2];
  const output = process.argv[3] ?? `/private/tmp/cortina-figures-${lang}.html`;
  writeFileSync(output, cortinaUnderwritingFigures(lang), 'utf8');
  process.stdout.write(`${output}\n`);
}
