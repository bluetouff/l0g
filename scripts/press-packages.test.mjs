import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import { pressPackages, buildPressSvg, buildPressCsv, buildPressMethod, buildPressCitation, pressPackagePaths, pressRights } from '../src/lib/press-packages.ts';
import { pressInvestigations } from '../src/config/press-investigations.ts';
import { getStaticPaths, GET } from '../src/pages/press/investigations/[...asset].ts';

const row = (pack, id) => pack.rows.find((item) => item.id === id);
const [coreweave, trafigura] = pressPackages;
const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@' });
const array = (value) => Array.isArray(value) ? value : [value];

test('the selected investigations have two bilingual export packages', async () => {
  assert.equal(pressPackages.length, 2);
  const selected = pressInvestigations.filter((item) => item.packageId);
  assert.deepEqual(selected.map((item) => item.packageId), pressPackages.map((pack) => pack.id));
  for (const pack of pressPackages) {
    for (const locale of ['fr', 'en']) {
      const file = locale === 'fr' ? 'src/pages/ressources-journalistes.astro' : 'src/pages/en/press-resources/index.astro';
      const page = await readFile(new URL(`../${file}`, import.meta.url), 'utf8');
      assert.ok(page.includes(`<PressInvestigationPackages locale="${locale}" />`));
      const article = pack.investigation[locale].split('/').filter(Boolean).at(-1);
      const directory = locale === 'fr' ? 'posts' : 'posts-en';
      const exists = await Promise.any(['md', 'mdx'].map((extension) => readFile(new URL(`../src/content/${directory}/${article}.${extension}`, import.meta.url), 'utf8')));
      assert.ok(exists.length > 0);
      assert.doesNotMatch(pack.title[locale], /ce qu|what .*(reveals|means)|—/i);
    }
  }
});

test('capacity and liquidity calculations retain their distinct perimeters', () => {
  assert.equal(row(coreweave, 'initial_capacity').value, 7500);
  assert.equal(row(coreweave, 'conditional_ceiling').value, 8500);
  assert.equal(row(coreweave, 'conditional_increment').value, 1000);
  assert.equal(row(coreweave, 'conditional_increment').approximate, true);
  assert.equal(row(coreweave, 'conditional_increment').relationship, 'included_in:conditional_ceiling');
  assert.equal(row(trafigura, 'available_cash').value, 7700);
  assert.equal(row(trafigura, 'undrawn_committed').value, 11700);
  assert.equal(row(trafigura, 'total_liquidity').value, 19400);
  assert.equal(row(trafigura, 'contingent_included').value, 3000);
  assert.equal(row(trafigura, 'contingent_included').relationship, 'included_in:undrawn_committed');
  assert.equal(row(trafigura, 'total_liquidity').formula, 'available_cash + undrawn_committed');
});

test('dates, definitions, calculation provenance and third-party rights travel with exports', () => {
  for (const pack of pressPackages) {
    assert.equal(pack.date, '2026-03-31');
    assert.equal(pack.reviewed, '2026-10-23');
    for (const locale of ['fr', 'en']) {
      const csv = buildPressCsv(pack, locale);
      const method = buildPressMethod(pack, locale);
      assert.match(csv, /value_usd_millions,nature,approximate,relationship,formula/);
      for (const item of pack.rows) assert.ok(csv.includes(`,${item.value},${item.nature},`));
      for (const source of pack.sources) {
        assert.ok(csv.includes(source.url));
        assert.ok(method.includes(source.published));
        assert.equal(new URL(source.url).protocol, 'https:');
      }
      assert.ok(csv.includes(`https://l0g.fr${pressPackagePaths(pack, locale).method}`));
      assert.ok(method.includes(pack.scope[locale]));
      assert.ok(method.includes(pack.limits[locale]));
      assert.ok(method.includes(pressRights[locale]));
      assert.ok(buildPressCitation(pack, locale).includes(`#${pack.id}`));
      assert.match(buildPressCitation(pack, locale), /2026-03-31.*2026-10-23/);
    }
  }
});

test('all 16 static routes serve the advertised localized formats', async () => {
  const paths = getStaticPaths();
  assert.equal(paths.length, 16);
  assert.equal(new Set(paths.map(({ params }) => params.asset)).size, 16);
  for (const { props, params } of paths) {
    const response = await GET({ props });
    assert.equal(response.status, 200);
    const text = await response.text();
    assert.ok(text.length > 100);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
    assert.match(params.asset, /^[a-z0-9-]+\/(fr|en)\/(figure\.svg|data\.csv|method\.txt|citation\.txt)$/);
    if (props.format === 'figure.svg') assert.match(response.headers.get('content-type'), /^image\/svg\+xml/);
    if (props.format === 'data.csv') assert.match(response.headers.get('content-disposition'), /attachment; filename="l0g-/);
  }
});

test('standalone SVGs are well-formed, accessible and contain only controlled local artwork', () => {
  for (const pack of pressPackages) for (const locale of ['fr', 'en']) {
    const svg = buildPressSvg(pack, locale);
    assert.equal(XMLValidator.validate(svg), true);
    assert.doesNotMatch(svg, /<(script|foreignObject|image|use|iframe)\b|\bon\w+\s*=|\b(?:NaN|Infinity)\b/i);
    const parsed = parser.parse(svg).svg;
    assert.equal(parsed['@viewBox'], '0 0 480 720');
    assert.equal(parsed['@lang'], locale);
    assert.equal(parsed['@aria-labelledby'], 'title desc');
    assert.equal(parsed.title['#text'], pack.title[locale]);
    assert.ok(parsed.desc['#text'].includes(pack.limits[locale]));
    assert.match(parsed['@style'], /width:100%;height:auto/);
    for (const rectangle of array(parsed.rect)) {
      assert.ok(Number(rectangle['@x'] ?? 0) >= 0);
      assert.ok(Number(rectangle['@y'] ?? 0) >= 0);
      assert.ok(Number(rectangle['@x'] ?? 0) + Number(rectangle['@width']) <= 480);
      assert.ok(Number(rectangle['@y'] ?? 0) + Number(rectangle['@height']) <= 720);
    }
    const values = array(parsed.rect).filter((rectangle) => rectangle['@data-value']);
    const scale = pack === coreweave ? 8500 : 19400;
    for (const rectangle of values) assert.ok(Math.abs(Number(rectangle['@width']) / 424 - Number(rectangle['@data-value']) / scale) < 1e-12);
  }
});

test('invalid financial inputs fail rather than drawing plausible charts', () => {
  for (const [pack, id, value] of [[coreweave, 'initial_capacity', -1], [coreweave, 'conditional_ceiling', 0], [coreweave, 'conditional_increment', 2000], [trafigura, 'total_liquidity', 22400], [trafigura, 'contingent_included', 20000]]) {
    const copy = structuredClone(pack);
    row(copy, id).value = value;
    assert.throws(() => buildPressSvg(copy, 'en'), /Invalid|Inconsistent/);
  }
  const copy = structuredClone(coreweave);
  copy.rows = copy.rows.filter((item) => item.id !== 'initial_capacity');
  assert.throws(() => buildPressSvg(copy, 'fr'), /Invalid/);
});

test('text labels are escaped and spreadsheet formulas cannot become active cells', () => {
  const copy = structuredClone(coreweave);
  for (const title of [
    '<script>alert(1)</script>',
    '<SCRIPT>alert(1)</SCRIPT>',
    '</title><ScRiPt data-test="x">alert(1)</ScRiPt><title>',
    'Cash & capacity < 10 "units"',
  ]) {
    copy.title.en = title;
    const svg = buildPressSvg(copy, 'en');
    assert.equal(XMLValidator.validate(svg), true);
    assert.deepEqual(parser.parse(svg).svg.title, { '#text': title, '@id': 'title' });
  }
  copy.rows[0].label.en = '=HYPERLINK("https://example.test")';
  assert.ok(buildPressCsv(copy, 'en').includes('"\'=HYPERLINK(""https://example.test"")"'));
});
