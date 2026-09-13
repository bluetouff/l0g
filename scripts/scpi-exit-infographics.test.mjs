import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { XMLValidator } from 'fast-xml-parser';
import { glossaryEntries } from '../src/config/glossary.ts';
import { glossaryAtlasEn } from '../src/config/glossary-atlas-en.ts';

const articles = [
  '../src/content/posts/scpi-retraits-parts-attente-liquidite-registres.md',
  '../src/content/posts-en/french-scpi-exit-queues-liquidity-register-reset.md',
].map((path) => readFileSync(new URL(path, import.meta.url), 'utf8'));
const attr = (tag, name) => Number(tag.match(new RegExp('\\b' + name + '="([^"]+)"'))?.[1]);

test('SCPI publication keeps aligned dates, primary sources and passive markup', () => {
  const dates = articles.map((s) => s.match(/^pubDate: '([^']+)'$/m)?.[1]);
  assert.equal(dates[0], dates[1]);
  assert.match(dates[0], /^2026-09-13T\d{2}:\d{2}:\d{2}\+02:00$/);
  assert.equal(articles[1].match(/^sourceUpdatedDate: '([^']+)'$/m)?.[1], dates[0]);
  assert.match(articles[1], /^sourceArticle: scpi-retraits-parts-attente-liquidite-registres$/m);
  for (const source of articles) {
    assert.equal(source.match(/^updatedDate: '([^']+)'$/m)?.[1], dates[0]);
    assert.match(source, /^draft: false$/m);
    assert.match(source, /^ogImage: \/illustrations\/news\/scpi-retraits-registres-v1.jpg$/m);
    assert.match(source, /^seoTitle: '.+ \| l0g'$/m);
    const titles = ['title', 'seoTitle', 'ogTitle'].map((key) => source.match(new RegExp('^' + key + ': (.+)$', 'm'))[1]);
    assert.equal(new Set(titles).size, 3);
    assert.doesNotMatch(source, /<\s*(?:script|iframe|object|embed|foreignObject)\b|\bon\w+\s*=|javascript:|@import|url\(|—/i);
    assert.doesNotMatch(source, /\?t=\d+/);
    const ids = [...source.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
    assert.equal(new Set(ids).size, ids.length);
    for (const domain of ['www.aspim.fr', 'www.amf-france.org', 'www.praemiareim.fr', 'www.lafrancaise-am-partenaires.com', 'www.legifrance.gouv.fr']) assert.ok(source.includes('https://' + domain + '/'));
    assert.match(source, /\/scpi\//);
    assert.match(source, /fictif|Hypothetical/);
    const headings = source.match(/^#{1,3} .+$/gm).join('\n');
    assert.doesNotMatch(headings, /[,;:].*\b(?:pas|not)\b|n’est pas|is not|ne .*pas|does not|do not|need not|cannot/i);
  }
});

test('SCPI SVGs keep a dark responsive canvas and padded internal geometry', () => {
  for (const source of articles) {
    assert.doesNotMatch(source, /overflow\s*:\s*hidden/);
    assert.match(source, /max-width:520px/);
    assert(source.includes('figcaption strong{color:#f5f5f7}'));
    assert(source.includes('.prose figure.scpi-figure figcaption a{color:#5eead4}'));
    const svgs = source.match(/<svg\b[\s\S]*?<\/svg>/g) ?? [];
    assert.equal(svgs.length, 3);
    for (const svg of svgs) {
      assert.equal(XMLValidator.validate(svg), true);
      assert.match(svg, /viewBox="0 0 520 760"/);
      assert.match(svg, /width:100%;height:auto;background:#0b0d10/);
      assert.doesNotMatch(svg, /(?:href|src)=|<image\b|<use\b|<animate\b|<set\b|clipPath|mask\b/i);
      const panels = [...svg.matchAll(/<rect\b[^>]*data-panel="[^"]+"[^>]*\/>/g)].map(([tag]) => ({
        x: attr(tag, 'x'), y: attr(tag, 'y'), width: attr(tag, 'width'), height: attr(tag, 'height'),
      }));
      assert.ok(panels.length >= 2);
      const lines = [];
      for (const [, tag, text] of svg.matchAll(/(<text\b[^>]*>)([^<]*)<\/text>/g)) {
        const x = attr(tag, 'x'); const y = attr(tag, 'y'); const size = attr(tag, 'font-size');
        const width = [...text.replaceAll('&amp;', '&')].length * size * 0.62;
        const left = x; const right = left + width;
        // Reserve extra baseline spacing below large figures, including fractional mobile scaling.
        for (const other of lines.filter((line) => line.size >= 40 && y > line.y && left < line.right && right > line.left)) {
          assert.ok(y - other.y >= size + other.size * 0.25 + 6, text + ' crowds ' + other.text);
        }
        assert.ok(left >= 16 && right <= 504 && y - size >= 10 && y + size * 0.25 <= 755, text);
        for (const p of panels.filter((p) => x >= p.x && x <= p.x + p.width && y >= p.y && y <= p.y + p.height)) {
          assert.ok(left >= p.x + 16 && right <= p.x + p.width - 12 && y - size >= p.y + 2 && y + size * 0.25 <= p.y + p.height - 2, text);
        }
        for (const other of lines.filter((line) => Math.abs(line.y - y) < Math.min(line.size, size))) {
          assert.ok(right <= other.left - 8 || left >= other.right + 8, text + ' overlaps ' + other.text);
        }
        lines.push({ left, right, y, size, text });
      }
    }
  }
});

test('SCPI arithmetic preserves approximate national amounts and distinct register scopes', () => {
  // ASPIM/IEIF: changes in value, in EUR millions, not cash repayments.
  assert.equal(-1200 + 330, -870);
  // Praemia REIM: gross units traded March-June 2026, excluding private transfers.
  const trades = [171, 1756, 2021, 2959];
  const total = trades.reduce((a, b) => a + b, 0);
  assert.equal(total, 6907);
  assert.equal((100 * total / 2190372).toFixed(2), '0.32');
  // Explicit hypothetical price-only example, not an actual SCPI price.
  assert.equal(1000 * 100, 100000);
  assert.equal(1000 * 60, 60000);
  assert.equal(100 * (60000 / 100000 - 1), -40);
  for (const source of articles) {
    for (const value of [/2[ ,]190[ ,]372/, /146[ ,]937/, /6[ ,]907/, /0[,.]32/, /4[,.]9/]) assert.match(source, value);
    assert.match(source, /tiret|dash/);
    assert.match(source, /non confirmées|unconfirmed/);
    assert.match(source, /Ce n’est pas le taux de satisfaction|not the clearance rate/);
    assert.match(source, /au-delà|postérieures à juin|sessions after June/);
    assert.match(source, /10\s?%/);
    assert.match(source, /deux mois suivant cette information|two months of that notification/);
    const chart = source.match(/<svg\b[\s\S]*?<\/svg>/g)[2];
    assert.match(chart, /Flux brut|Gross flow/);
    assert.match(chart, /Hors cessions de gré à gré|Private transfers excluded/);
    assert.doesNotMatch(chart, /0[,.]32/);
  }
});

test('SCPI is defined with AMF sources in both glossaries', () => {
  for (const entries of [glossaryEntries, glossaryAtlasEn]) {
    const entry = entries.find((e) => e.slug === 'scpi');
    assert(entry);
    assert.deepEqual(entry.atlas.sources.map((source) => source.href), [
      'https://www.amf-france.org/fr/espace-epargnants/comprendre-les-produits-financiers/placements-collectifs/scpi-un-autre-moyen-dinvestir-dans-limmobilier',
      'https://www.amf-france.org/fr/le-mediateur/journal-de-bord-du-mediateur/dossiers-du-mois/scpi-contrairement-aux-ordres-de-vente-des-parts-les-demandes-de-retrait-sont-sans-duree-de-validite',
    ]);
    assert.match(entry.guide, /scpi-/);
    assert.match(entry.def, /non coté|unlisted/);
  }
});
