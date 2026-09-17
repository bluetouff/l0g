import { BASE_SEQUENCE_INPUT, compareSequences } from './retirementSequenceModel.mjs';
import { sequenceChart, sequenceMoney, escapeSequenceHtml as e } from './retirementSequenceView.mjs';

export function retirementFigureCaption(lang = 'fr', kind = 'capital') {
  if (kind === 'capital') return lang === 'fr'
    ? 'Scénarios fictifs sur 30 ans, sans période historique. Capital initial : 200 000 € ; premier budget : 10 000 €, augmenté ensuite de 2 % par an. Retraits en fin d’année ; frais et impôts nuls. A et B utilisent la même liste de rendements nominaux totaux dans l’ordre inverse. Les retraits effectivement payés divergent après l’épuisement de A. Source : calculs l0g, 17 septembre 2026.'
    : 'Fictional 30-year scenarios, not historical data. Starting portfolio: €200,000; first budget: €10,000, rising 2% annually thereafter. Year-end withdrawals; no fees or taxes. A and B use the same nominal total returns in reverse order. Actual payments diverge once A is exhausted. Source: l0g calculations, 17 September 2026.';
  return lang === 'fr'
    ? 'Calculs fictifs sur 2 ans, en euros nominaux. Retrait de 5 % du capital disponible après le rendement annuel. Aucun apport, frais, impôt ou effet d’inflation. A : −20 %, puis +25 % ; B : +25 %, puis −20 %. La même valeur finale peut accompagner des revenus cumulés différents. Source : calculs l0g, 17 septembre 2026.'
    : 'Fictional two-year calculation in nominal euros. Withdraw 5% of available capital after each annual return. No contributions, fees, taxes or inflation. A: −20%, then +25%; B: +25%, then −20%. Identical final wealth can accompany different cumulative payments. Source: l0g calculations, 17 September 2026.';
}

/** One generous layout stays legible at article and phone widths. */
export function retirementFigureSvg(lang = 'fr', kind = 'capital') {
  lang = lang === 'en' ? 'en' : 'fr';
  const fr = lang === 'fr', capital = kind === 'capital';
  const title = capital ? (fr ? 'L’ordre change la trajectoire' : 'Order changes the outcome') : (fr ? 'Même capital, revenus différents' : 'Same balance, different income');
  const text = (x, y, content, color = '#b9cad6', size = 24, anchor = 'start') => `<text x="${x}" y="${y}" fill="${color}" font-size="${size}" text-anchor="${anchor}">${e(content)}</text>`;
  const amber = '#f7bc74', mint = '#55ead4';
  let body;
  if (capital) {
    const compared = compareSequences(BASE_SEQUENCE_INPUT);
    const chart = sequenceChart(BASE_SEQUENCE_INPUT, compared, lang, true)
      .replace('viewBox="0 0 360 320"', 'x="10" y="220" width="500" height="444" viewBox="0 0 360 320"')
      .replace('style="display:block;width:100%;height:auto;font-family:system-ui,sans-serif"', 'style="font-family:system-ui,sans-serif"');
    body = text(28, 86, fr ? 'Capital initial : 200 000 €' : 'Starting portfolio: €200,000')
      + text(28, 119, fr ? 'Budget initial : 10 000 € par an' : 'First annual budget: €10,000')
      + text(28, 152, fr ? 'Inflation : 2 % · frais : 0 %' : 'Inflation: 2% · fees: 0%')
      + text(28, 196, fr ? '━━ A · ordre saisi' : '━━ A · entered order', amber, 22)
      + text(277, 196, fr ? '┄┄ B · inversé' : '┄┄ B · reversed', mint, 22)
      + chart
      + text(28, 708, fr ? `A : retrait incomplet en année ${compared.a.firstUnfunded}` : `A: incomplete payment in year ${compared.a.firstUnfunded}`, amber, 23)
      + text(28, 745, fr ? `B : capital final de ${sequenceMoney(compared.b.closing, lang)}` : `B: final balance ${sequenceMoney(compared.b.closing, lang)}`, mint, 23);
  } else {
    const input = { ...BASE_SEQUENCE_INPUT, mode: 'proportional', inflation: 0, returns: [-20, 25] };
    const compared = compareSequences(input), base = 577, y = v => base - v / 15000 * 285;
    body = text(28, 86, fr ? 'Capital initial : 200 000 €' : 'Starting portfolio: €200,000')
      + text(28, 119, fr ? 'Retrait : 5 % des actifs disponibles' : 'Withdraw 5% of available assets')
      + text(28, 152, fr ? 'Inflation et frais : 0 %' : 'Inflation and fees: 0%')
      + text(28, 194, 'A · −20 % / +25 %', amber, 22)
      + text(277, 194, 'B · +25 % / −20 %', mint, 22)
      + text(28, 252, fr ? 'Versements en euros nominaux' : 'Payments in nominal euros');
    for (const v of [0, 5000, 10000, 15000]) body += `<line x1="74" y1="${y(v)}" x2="490" y2="${y(v)}" stroke="#314353"/>` + text(61, y(v) + 7, v === 0 ? '0' : `${v / 1000}k`, '#b9cad6', 22, 'end');
    for (const [i, item] of [{ key: 'a', year: 0 }, { key: 'b', year: 0 }, { key: 'a', year: 1 }, { key: 'b', year: 1 }].entries()) {
      const x = [94, 185, 312, 403][i], paid = compared[item.key].rows[item.year].paid, color = item.key === 'a' ? amber : mint;
      body += `<rect x="${x}" y="${y(paid)}" width="60" height="${base - y(paid)}" rx="4" fill="${color}"/>`
        + text(x + 30, y(paid) - 16, new Intl.NumberFormat(fr ? 'fr-FR' : 'en-GB').format(paid), '#f0f6fa', 22, 'middle')
        + text(x + 30, 610, item.key.toUpperCase(), color, 24, 'middle');
    }
    body += text(170, 646, fr ? 'Année 1' : 'Year 1', '#b9cad6', 24, 'middle') + text(386, 646, fr ? 'Année 2' : 'Year 2', '#b9cad6', 24, 'middle')
      + text(28, 699, fr ? `Capital final : ${sequenceMoney(compared.a.closing, lang)}` : `Final balance: ${sequenceMoney(compared.a.closing, lang)}`, '#f0f6fa', 26)
      + text(28, 739, fr ? `Versé : A ${sequenceMoney(compared.a.totalPaid, lang)} · B ${sequenceMoney(compared.b.totalPaid, lang)}` : `Paid: A ${sequenceMoney(compared.a.totalPaid, lang)} · B ${sequenceMoney(compared.b.totalPaid, lang)}`, '#b9cad6', 23);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 520 870" role="img" aria-label="${e(title)}" style="display:block;width:100%;height:auto;font-family:system-ui,sans-serif"><title>${e(title)}</title><desc>${e(retirementFigureCaption(lang, kind))}</desc><rect width="520" height="870" rx="12" fill="#0c0d10"/>${text(28, 44, title, '#f0f6fa', 27)}${body}<line x1="28" y1="781" x2="492" y2="781" stroke="#314353"/>${text(28, 817, fr ? 'Source : calculs l0g · scénarios fictifs' : 'Source: l0g · fictional scenarios', '#b9cad6', 22)}${text(28, 851, fr ? '17 septembre 2026' : '17 September 2026', '#b9cad6', 22)}</svg>`;
}

export function renderRetirementFigure(lang = 'fr', kind = 'capital') {
  return `<figure class="rs-figure"><div class="rs-figure-art">${retirementFigureSvg(lang, kind)}</div><figcaption>${e(retirementFigureCaption(lang, kind))}</figcaption></figure>`;
}
