import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import sharp from 'sharp';

const publications = [
  ['fr', '../src/content/posts/reserves-petrolieres-propriete-sagess-financement.md'],
  ['en', '../src/content/posts-en/france-oil-reserves-ownership-sagess-funding.md'],
].map(([language, path]) => ({ language, article: readFileSync(new URL(path, import.meta.url), 'utf8') }));
const viewBoxes = ['0 0 480 370', '0 0 480 480', '0 0 480 440'];
const sourceAnchors = [['#source-s06', '#source-s05'], ['#source-s02'], ['#source-s07', '#source-s09']];
const delegationCsv = readFileSync(new URL('../public/data/reserves-02-delegation.csv', import.meta.url), 'utf8');
const maturityCsv = readFileSync(new URL('../public/data/reserves-02-sagess-maturities-2025.csv', import.meta.url), 'utf8');
// Independently checked legal alternatives and annual-report principal amounts.
const obligationAlternatives = [[44, 56], [10, 90]];
const maturityAmounts = [500, 600, 500, 500, 500, 1000];
const maturityYears = [2027, 2028, 2029, 2030, 2031, 2032];
const attributes = new Set(['xmlns', 'viewBox', 'role', 'ariaLabelledBy', 'style', 'id', 'x', 'y', 'width', 'height', 'rx', 'fill', 'fontFamily', 'fontSize', 'fontWeight', 'textAnchor', 'dataValue']);
const elements = node => [node, ...(node.children ?? []).flatMap(elements)].filter(item => item.type === 'element');
const normalise = text => text.replace(/\s+/gu, ' ').trim();
const numberLabel = text => Number(normalise(text).replace(/[ ,]/gu, ''));

function figureFragments(article) {
  const fragments = [...article.matchAll(/<figure\b[\s\S]*?<\/figure>/gu)].map(match => match[0]);
  assert.equal(fragments.length, 3);
  assert.equal([...article.matchAll(/<svg\b/gu)].length, 3, 'Every SVG belongs to a checked figure');
  return fragments;
}

function figureParts(fragment, index) {
  const nodes = elements(fromHtml(fragment, { fragment: true }));
  const figure = nodes[0];
  assert.equal(figure.tagName, 'figure');
  assert(figure.properties.className.includes('infographic'));
  const style = Object.fromEntries(String(figure.properties.style).split(';').filter(Boolean).map(declaration => declaration.split(':').map(value => value.trim())));
  assert.equal(Object.keys(style).length, 3);
  assert.equal(style['max-width'], '28rem', 'Keep figures compact on desktop');
  assert.equal(style.margin, '2rem auto');
  assert.equal(style['padding-bottom'], '1.25rem', 'Leave room beneath the figure');
  const svgs = [...fragment.matchAll(/<svg\b[\s\S]*?<\/svg>/gu)].map(match => match[0]);
  assert.equal(svgs.length, 1);
  const captions = nodes.filter(node => node.tagName === 'figcaption');
  assert.equal(captions.length, 1);
  const caption = normalise(toText(captions[0]));
  assert(caption);
  for (const href of sourceAnchors[index]) assert(nodes.some(node => node.tagName === 'a' && node.properties.href === href), `Missing source: ${href}`);
  return { svg: svgs[0], caption, nodes };
}

function inspect(svg, index) {
  assert(!/<!DOCTYPE|<!ENTITY|<\?/iu.test(svg), 'SVG must not declare entities or processing instructions');
  assert.equal(XMLValidator.validate(svg), true, 'SVG must be valid XML');
  const nodes = elements(fromHtml(svg, { fragment: true }));
  assert.equal(nodes[0]?.tagName, 'svg');
  assert.equal(nodes.filter(node => node.tagName === 'svg').length, 1);
  const ids = new Set();
  for (const node of nodes) {
    assert(['svg', 'title', 'desc', 'rect', 'text'].includes(node.tagName), `Unsafe SVG element: ${node.tagName}`);
    for (const [name, value] of Object.entries(node.properties)) {
      assert(attributes.has(name), `Unexpected SVG attribute: ${name}`);
      assert(!name.toLowerCase().startsWith('on'));
      assert(!String(value).toLowerCase().includes('url('), 'No external paint server or asset');
      if (name === 'style') assert.equal(node.tagName, 'svg');
      if (name === 'fill') assert.match(String(value), /^var\(--color-(?:surface|paper|signal|muted|accent)\)$/u, 'Use native l0g colour variables');
      if (name === 'id') {
        assert(!ids.has(value), 'Accessible IDs must be unique');
        ids.add(value);
      }
    }
  }
  const root = nodes[0].properties;
  assert.equal(root.xmlns, 'http://www.w3.org/2000/svg');
  assert.equal(root.viewBox, viewBoxes[index]);
  assert.equal(root.style, 'width:100%;height:auto');
  assert.equal(root.role, 'img');
  assert(Array.isArray(root.ariaLabelledBy));
  assert.equal(root.ariaLabelledBy.length, 2);
  for (const [i, id] of root.ariaLabelledBy.entries()) {
    const targets = nodes.filter(node => node.properties.id === id);
    assert.equal(targets.length, 1);
    assert.equal(targets[0].tagName, i === 0 ? 'title' : 'desc');
    assert(normalise(toText(targets[0])));
  }
  return nodes;
}

async function geometry(svg, index) {
  const nodes = inspect(svg, index);
  const height = Number(viewBoxes[index].split(' ').at(-1));
  const labels = [];
  for (const node of nodes.filter(item => item.tagName === 'text')) {
    const p = node.properties;
    const label = toText(node), size = Number(p.fontSize), x = Number(p.x), y = Number(p.y);
    assert([size, x, y].every(Number.isFinite));
    assert(size >= 18 && size <= 24, `Unreadable label size: ${label}`);
    assert.equal(p.fontFamily, 'Arial, Helvetica, sans-serif');
    assert([400, 700].includes(Number(p.fontWeight)));
    assert(['start', 'middle', 'end'].includes(p.textAnchor));
    const escaped = label.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
    const { info } = await sharp(Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="8192" height="128"><text x="8" y="70" fill="white" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${p.fontWeight}">${escaped}</text></svg>`)).trim().raw().toBuffer({ resolveWithObject: true });
    const width = info.width + 3;
    const left = x - (p.textAnchor === 'middle' ? width / 2 : p.textAnchor === 'end' ? width : 0);
    const box = { left: left - 1, right: left + width + 1, top: y - size * .95 - 1, bottom: y + 5, label };
    assert(box.left >= 4 && box.right <= 476 && box.top >= 4 && box.bottom <= height - 4, `Label leaves safe viewBox: ${label}`);
    labels.push(box);
  }
  const overlaps = (a, b) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
  for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) assert(!overlaps(labels[i], labels[j]), `Labels overlap: ${labels[i].label} / ${labels[j].label}`);
  for (const node of nodes.filter(item => item.tagName === 'rect')) {
    const p = node.properties;
    const x = Number(p.x ?? 0), y = Number(p.y ?? 0), width = Number(p.width), h = Number(p.height);
    assert([x, y, width, h].every(Number.isFinite));
    assert(width >= 0 && h >= 0 && x >= 0 && y >= 0 && x + width <= 480 && y + h <= height, 'Rectangle leaves viewBox');
    if (x === 0 && y === 0 && width === 480 && h === height) continue;
    for (const label of labels) assert(!overlaps(label, { left: x, right: x + width, top: y, bottom: y + h }), `Shape obscures label: ${label.label}`);
  }
}

function bars(nodes) {
  return nodes.filter(node => node.tagName === 'rect' && node.properties.dataValue !== undefined);
}

function checkBar(node, { value, x, y, width, height, fill }) {
  const p = node.properties;
  assert.equal(Number(p.dataValue), value);
  assert.equal(Number(p.x), x, 'Correct zero or preceding segment boundary');
  assert.equal(Number(p.y), y);
  assert.equal(Number(p.height), height);
  assert(Math.abs(Number(p.width) - width) < 1e-7, 'Bar uses the independently specified linear scale');
  assert.equal(p.fill, fill);
}

function axis(nodes, y, values, positions) {
  const ticks = nodes.filter(node => node.tagName === 'text' && Number(node.properties.y) === y);
  assert.deepEqual(ticks.map(node => normalise(toText(node)).replace(/\s|,/gu, '')), values);
  assert.deepEqual(ticks.map(node => Number(node.properties.x)), positions);
}

function delegation(fragment, language) {
  const { svg, caption, nodes: figureNodes } = figureParts(fragment, 0);
  const nodes = inspect(svg, 0), segments = bars(nodes);
  assert.equal(segments.length, 4);
  obligationAlternatives.forEach(([direct, delegated], row) => {
    assert.equal(direct + delegated, 100);
    const y = row === 0 ? 132 : 220;
    checkBar(segments[2 * row], { value: direct, x: 24, y, width: direct * 4, height: 22, fill: 'var(--color-accent)' });
    checkBar(segments[2 * row + 1], { value: delegated, x: 24 + direct * 4, y, width: delegated * 4, height: 22, fill: 'var(--color-signal)' });
    assert.equal(Number(segments[2 * row + 1].properties.x) + Number(segments[2 * row + 1].properties.width), 424);
    const rowText = nodes.filter(node => node.tagName === 'text' && Number(node.properties.y) === (row === 0 ? 116 : 204)).map(toText).join('');
    assert.equal(normalise(rowText).replace(/\s/gu, ''), `${direct}%direct·${delegated}%CPSSP`);
  });
  axis(nodes, 276, ['0', '50', '100%'], [24, 224, 424]);
  const subtitle = nodes.find(node => node.tagName === 'text' && Number(node.properties.y) === 74);
  assert.match(normalise(toText(subtitle)), /obligation\s*=\s*100\s*%/u);
  assert.match(caption, language === 'fr' ? /obligation est normalisée à 100 %/u : /obligation is normalised to 100%/u);
  assert.match(caption, language === 'fr' ? /ni la propriété ni le contenu physique/u : /without measuring ownership or physical reserve contents/u);
  assert(figureNodes.some(node => node.properties.href === '/data/reserves-02-delegation.csv'));
}

function maturities(fragment, language) {
  const { svg, caption, nodes: figureNodes } = figureParts(fragment, 1);
  const nodes = inspect(svg, 1), rectangles = bars(nodes);
  assert.equal(rectangles.length, 6);
  maturityAmounts.forEach((amount, i) => {
    checkBar(rectangles[i], { value: amount, x: 24, y: 122 + 48 * i, width: amount * .4, height: 14, fill: 'var(--color-signal)' });
    const labels = nodes.filter(node => node.tagName === 'text' && Number(node.properties.y) === 112 + 48 * i);
    assert.equal(labels.length, 2);
    assert.equal(numberLabel(toText(labels[0])), maturityYears[i]);
    assert.equal(numberLabel(toText(labels[1])), amount);
  });
  axis(nodes, 420, ['0', '500', language === 'fr' ? '1000M€' : '1000€m'], [24, 224, 424]);
  const subtitle = normalise(toText(nodes.find(node => node.tagName === 'text' && Number(node.properties.y) === 74)));
  assert.match(subtitle, /2025/u);
  assert.match(subtitle, language === 'fr' ? /nominal en M€/u : /principal, €m/u);
  const total = normalise(toText(nodes.find(node => node.tagName === 'text' && Number(node.properties.y) === 460)));
  assert.match(total, /3[ ,]600/u);
  assert.equal(maturityAmounts.reduce((sum, amount) => sum + amount, 0), 3600);
  assert.equal(3600 + 545, 4145);
  assert.match(caption, language === 'fr' ? /31 décembre 2025/u : /31 December 2025/u);
  assert.match(caption, /545/u);
  assert.match(caption, language === 'fr' ? /ligne bancaire inutilisée de 1 Md€/u : /€1bn undrawn bank facility/u);
  assert.match(caption, language === 'fr' ? /émission de février 2026 sont exclus/u : /February 2026 issue are excluded/u);
  assert.match(caption, language === 'fr' ? /ne mesure pas la charge annuelle d’intérêts/u : /not annual interest expense/u);
  assert(figureNodes.some(node => node.properties.href === '/data/reserves-02-sagess-maturities-2025.csv'));
}

function ticket(fragment, language) {
  const { svg, caption } = figureParts(fragment, 2);
  const nodes = inspect(svg, 2), rectangles = bars(nodes);
  assert.equal(rectangles.length, 3);
  checkBar(rectangles[0], { value: 100, x: 24, y: 146, width: 400, height: 24, fill: 'var(--color-signal)' });
  checkBar(rectangles[1], { value: 70, x: 24, y: 280, width: 280, height: 24, fill: 'var(--color-signal)' });
  checkBar(rectangles[2], { value: 30, x: 304, y: 280, width: 120, height: 24, fill: 'var(--color-accent)' });
  assert.equal(70 + 30, 100, 'Coverage sums to the physical stock, not another physical stock');
  assert.equal(Number(rectangles[0].properties.width), Number(rectangles[1].properties.width) + Number(rectangles[2].properties.width));
  const textAt = y => normalise(toText(nodes.find(node => node.tagName === 'text' && Number(node.properties.y) === y)));
  assert.equal(textAt(74), language === 'fr' ? 'Exemple fictif · 100 tonnes physiques' : 'Fictional example · 100 physical tonnes');
  assert.match(textAt(126), language === 'fr' ? /Propriété avant l’achat : A/u : /Ownership before purchase: A/u);
  assert.match(textAt(202), language === 'fr' ? /A possède les 100 tonnes/u : /A owns all 100 tonnes/u);
  assert.match(textAt(418), language === 'fr' ? /Stock physique inchangé : 100 t/u : /Physical inventory stays at 100 t/u);
  assert.match(caption, language === 'fr' ? /sans correspondance avec un contrat observé/u : /not an observed contract/u);
  assert.match(caption, language === 'fr' ? /même stock en tonnes/u : /same stock in tonnes/u);
}

function csvTable(text, expectedHeader) {
  // Bounded one-line publication records; quoted commas and doubled quotes are supported.
  const lines = text.trim().split(/\r?\n/u);
  const cells = line => {
    const fields = [];
    let value = '', quoted = false, closed = false;
    for (let i = 0; i <= line.length; i++) {
      const c = line[i];
      if (quoted) {
        if (c === '"' && line[i + 1] === '"') { value += '"'; i++; }
        else if (c === '"') { quoted = false; closed = true; }
        else { assert(c !== undefined, 'Unclosed CSV quote'); value += c; }
      } else if (c === ',' || c === undefined) { fields.push(value); value = ''; closed = false; }
      else if (c === '"') { assert(value === '' && !closed, 'Quote must start a CSV cell'); quoted = true; }
      else { assert(!closed, 'Characters after closing CSV quote'); value += c; }
    }
    return fields;
  };
  assert.deepEqual(cells(lines[0]), expectedHeader, 'CSV header preserves units and meaning');
  return lines.slice(1).map(line => {
    const values = cells(line);
    assert.equal(values.length, expectedHeader.length);
    return Object.fromEntries(expectedHeader.map((name, i) => [name, values[i]]));
  });
}

function checkDelegationCsv(text) {
  const rows = csvTable(text, ['reviewed_at', 'arrangement', 'direct_obligation_percent', 'delegated_cpssp_percent', 'scope', 'source']);
  assert.equal(rows.length, 2);
  rows.forEach((row, i) => {
    assert.equal(row.reviewed_at, '2026-10-03');
    assert.equal(row.arrangement, obligationAlternatives[i].join('/'));
    assert.match(row.direct_obligation_percent, /^\d+$/u);
    assert.match(row.delegated_cpssp_percent, /^\d+$/u);
    assert.deepEqual([Number(row.direct_obligation_percent), Number(row.delegated_cpssp_percent)], obligationAlternatives[i]);
    assert.equal(Number(row.direct_obligation_percent) + Number(row.delegated_cpssp_percent), 100);
    assert.match(row.scope, /^Approved operators in metropolitan France; obligation normalised to\s*100 percent; not physical stock shares$/u);
    assert.equal(row.source, 'https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000031946331');
  });
  return rows;
}

function checkMaturityCsv(text) {
  const rows = csvTable(text, ['reference_date', 'year_of_maturity', 'bond_principal_EUR_million', 'scope', 'source', 'source_page', 'retrieved_at']);
  assert.equal(rows.length, 6);
  rows.forEach((row, i) => {
    assert.equal(row.reference_date, '2025-12-31');
    assert.match(row.year_of_maturity, /^\d{4}$/u);
    assert.equal(Number(row.year_of_maturity), maturityYears[i]);
    assert.match(row.bond_principal_EUR_million, /^\d+$/u);
    assert.equal(Number(row.bond_principal_EUR_million), maturityAmounts[i]);
    assert.equal(row.scope, 'SAGESS outstanding bonds; excludes commercial paper, interest and 2026 issue');
    const source = new URL(row.source);
    assert.equal(source.protocol, 'https:');
    assert.equal(source.hostname, 'www.sagess.fr');
    assert.equal(source.username + source.password, '');
    assert.match(source.pathname, /^\/(?:fr|en)\/file\/\d+\/download$|^\/sites\/default\/files\/.+\.pdf$/u);
    assert.equal(row.source_page, '61');
    assert.equal(row.retrieved_at, '2026-10-03');
  });
  assert.equal(rows.reduce((sum, row) => sum + Number(row.bond_principal_EUR_million), 0), 3600);
  return rows;
}

function fundingText(article, language) {
  const paragraph = article.split(/\n\s*\n/u).find(text => language === 'fr' ? text.includes('endettement externe') : text.includes('external debt'));
  assert(paragraph, 'External-debt amounts remain present in the article');
  const text = normalise(paragraph.replaceAll('**', ''));
  assert.match(text, language === 'fr' ? /4,145 milliards d’euros d’endettement externe/u : /€4\.145 billion of external debt/u);
  assert.match(text, language === 'fr' ? /3,6 milliards d’obligations/u : /€3\.6 billion of bonds/u);
  assert.match(text, language === 'fr' ? /545 millions de billets de trésorerie/u : /€545 million of commercial paper/u);
  assert.match(text, language === 'fr' ? /hors prêt du CPSSP et hors intérêts dus/u : /excluding the CPSSP loan and interest payable/u);
  assert.match(text, language === 'fr' ? /31 décembre 2025/u : /31 December 2025/u);
}

function change(text, before, after) {
  assert(text.includes(before), `Mutation must match existing input: ${before}`);
  return text.replace(before, after);
}

test('Ownership figures have safe accessible l0g SVG, compact containers and legible non-overlapping geometry', async () => {
  const ids = [];
  for (const { article } of publications) {
    for (const [index, fragment] of figureFragments(article).entries()) {
      const { svg } = figureParts(fragment, index);
      ids.push(...inspect(svg, index).filter(node => node.properties.id).map(node => node.properties.id));
      await geometry(svg, index);
    }
  }
  assert.equal(new Set(ids).size, ids.length);
});

test('Obligation alternatives use a shared zero and sum to 100 without implying national physical-stock shares', () => {
  for (const { article, language } of publications) delegation(figureFragments(article)[0], language);
  checkDelegationCsv(delegationCsv);
});

test('Historical bond maturities preserve nominal EUR millions and exclude unused capacity and later issuance', () => {
  for (const { article, language } of publications) {
    maturities(figureFragments(article)[1], language);
    fundingText(article, language);
  }
  checkMaturityCsv(maturityCsv);
});

test('Fictional ticket maps one 100-tonne stock to ownership and 70/30 coverage without double-counting oil', () => {
  for (const { article, language } of publications) ticket(figureFragments(article)[2], language);
});

test('False ratios, origins, labels and an invented second physical stock are rejected', () => {
  const fragments = figureFragments(publications[0].article);
  assert.throws(() => delegation(change(fragments[0], 'width="176"', 'width="180"'), 'fr'));
  assert.throws(() => delegation(change(fragments[0], 'data-value="44" x="24"', 'data-value="44" x="34"'), 'fr'));
  assert.throws(() => maturities(change(fragments[1], 'data-value="600"', 'data-value="650"'), 'fr'));
  assert.throws(() => maturities(change(fragments[1], '>2027</text>', '>2026</text>'), 'fr'));
  assert.throws(() => maturities(change(fragments[1], 'x="24" y="420"', 'x="34" y="420"'), 'fr'));
  assert.throws(() => ticket(change(fragments[2], 'width="120"', 'width="280"'), 'fr'));
  assert.throws(() => ticket(change(fragments[2], 'Stock physique inchangé : 100 t', 'Stock physique inchangé : 200 t'), 'fr'));
  assert.throws(() => ticket(change(fragments[2], 'Exemple fictif · 100 tonnes physiques', 'Stock SAGESS mesuré · 100 tonnes physiques'), 'fr'));
});

test('CSV mutations to amounts, year, units, scope and official sources fail while SAGESS URL tokens remain optional', () => {
  assert.throws(() => checkDelegationCsv(change(delegationCsv, ',44,56,', ',45,56,')));
  assert.throws(() => checkDelegationCsv(change(delegationCsv, 'direct_obligation_percent', 'direct_stock_tonnes')));
  assert.throws(() => checkDelegationCsv(change(delegationCsv, '2026-10-03', '2025-10-03')));
  assert.throws(() => checkDelegationCsv(change(delegationCsv, 'not physical stock shares', 'physical stock shares')));
  assert.throws(() => checkMaturityCsv(change(maturityCsv, ',2032,1000,', ',2033,1000,')));
  assert.throws(() => checkMaturityCsv(change(maturityCsv, '2025-12-31', '2026-12-31')));
  assert.throws(() => checkMaturityCsv(change(maturityCsv, 'bond_principal_EUR_million', 'bond_principal_EUR_billion')));
  assert.throws(() => checkMaturityCsv(change(maturityCsv, 'excludes commercial paper, interest and 2026 issue', 'includes undrawn bank facilities')));
  assert.throws(() => checkMaturityCsv(change(maturityCsv, 'https://www.sagess.fr/', 'https://example.com/')));
  assert.throws(() => fundingText(change(publications[0].article, '4,145 milliards', '5,145 milliards'), 'fr'));
  checkMaturityCsv(maturityCsv.replace(/\?token=[^,\r\n]+/gu, ''));
  assert.throws(() => csvTable('a,b\n"unclosed,b', ['a', 'b']));
});

test('Active markup, external assets, theme drift, oversized containers and unreadable labels fail', async () => {
  const fragment = figureFragments(publications[0].article)[0];
  const { svg } = figureParts(fragment, 0);
  for (const unsafe of [
    change(svg, '<svg ', '<svg onload="alert(1)" '),
    change(svg, '</svg>', '<script>alert(1)</script></svg>'),
    change(svg, '</svg>', '<image href="https://example.com/image.svg"/></svg>'),
    change(svg, 'var(--color-signal)', '#153b70'),
    change(svg, 'var(--color-signal)', 'url(https://example.com/image.svg)'),
    change(svg, 'height:auto', 'height:900px'),
  ]) assert.throws(() => inspect(unsafe, 0));
  assert.throws(() => figureParts(change(fragment, 'max-width:28rem', 'max-width:60rem'), 0));
  await assert.rejects(geometry(change(svg, '>Deux formules de délégation</text>', '>Un libellé démesurément long qui déborde nécessairement de la zone lisible du graphique et cache ses données</text>'), 0));
  await assert.rejects(geometry(change(svg, 'font-size="18"', 'font-size="12"'), 0));
  await assert.rejects(geometry(change(svg, 'y="204"', 'y="116"'), 0));
});
