import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fromHtml } from 'hast-util-from-html';
import { glossaryEntries } from '../src/config/glossary.ts';
import { glossaryAtlasEnBySlug, englishGlossaryRobots } from '../src/config/glossary-atlas-en.ts';
import { glossaryReferenceBySlug, glossaryReferenceWordCount } from '../src/config/glossary-reference-fr.ts';
import { treasuryBuybackExample, glossaryReferenceEnBySlug } from '../src/config/treasury-buyback-reference.ts';

const treasurySlug = 'treasury-buyback';
const renderedLinks = (links = []) => links.map(({ label, href, detail }) => ({ label, href, detail }));

// The two route templates render selected fields from shared dictionaries. Keep
// this projection in step with their rendering when those templates change.
// Definitions of neighbouring terms and bodies of linked articles are absent.
function treasuryRenderProjection(lang, {
  entries = lang === 'fr' ? glossaryEntries : [...glossaryAtlasEnBySlug.values()],
  reference = lang === 'fr' ? glossaryReferenceBySlug[treasurySlug] : glossaryReferenceEnBySlug[treasurySlug],
  englishEntries = glossaryAtlasEnBySlug,
} = {}) {
  const bySlug = new Map(entries.map(entry => [entry.slug, entry]));
  const entry = bySlug.get(treasurySlug);
  assert(entry && reference, `${lang}: Treasury reference missing`);
  const atlas = entry.atlas;
  const resolveRelated = slugs => (slugs ?? []).map(slug => bySlug.get(slug)).filter(Boolean).slice(0, 10);
  const referenceRelated = resolveRelated(reference.relatedSlugs);
  const atlasRelated = resolveRelated(atlas?.related);
  const related = lang === 'en' ? atlasRelated : referenceRelated.length ? referenceRelated
    : atlasRelated.length ? atlasRelated
      : entries.filter(candidate => candidate.sectionSlug === entry.sectionSlug && candidate.slug !== entry.slug).slice(0, 6);

  return {
    term: {
      slug: entry.slug, sigle: entry.sigle, nom: entry.nom, def: entry.def,
      guide: entry.guide, sectionTitle: entry.sectionTitle, accent: entry.accent,
      ...(lang === 'fr'
        ? { url: entry.url, sectionSlug: entry.sectionSlug, englishSibling: englishEntries.has(entry.slug) }
        : { robots: englishGlossaryRobots(entry) }),
    },
    reference: {
      mechanism: reference.mechanism, standfirst: reference.standfirst,
      datedFact: {
        label: reference.datedFact.label, text: reference.datedFact.text,
        sourceHref: reference.datedFact.sourceHref,
      },
      sections: reference.sections.map(section => ({
        title: section.title, paragraphs: section.paragraphs,
        // Section citations display the label and URL, without their detail.
        sources: (section.sources ?? []).map(({ label, href }) => ({ label, href })),
      })),
      limitation: reference.limitation,
      analyses: renderedLinks(reference.analyses),
      instruments: renderedLinks(reference.instruments),
      primarySources: renderedLinks(reference.primarySources),
    },
    atlas: atlas ? {
      intuition: atlas.intuition, formula: atlas.formula, whyNow: atlas.whyNow,
      articles: renderedLinks(atlas.articles), guides: renderedLinks(atlas.guides),
      datasets: renderedLinks(atlas.datasets), signals: renderedLinks(atlas.signals),
      sources: renderedLinks(atlas.sources),
    } : null,
    related: related.map(({ slug, sigle, nom, url, accent }) => ({
      slug, sigle, nom, accent, ...(lang === 'fr' ? { url } : {}),
    })),
  };
}

function treasuryFingerprint(lang, input) {
  return createHash('sha256').update(JSON.stringify(treasuryRenderProjection(lang, input))).digest('hex');
}

// The sitemap uses the existing editorial review date, also visible on the
// reference and in its structured data. A changed fingerprint requires a fresh
// editorial review of that date before updating this dated baseline. Never
// replace the date with a build time or a shared dictionary's modification time.
const treasuryEditorialReview = {
  fr: { date: '2026-10-23', sha256: '8b1197f1e0df245870b098b4c43ee6601004eb4505a53c2e04f624ca69088dd7' },
  en: { date: '2026-10-23', sha256: 'fc053179995ba2c53a048674873d7f9916e83c5888274f2b32dcd2fdf27daf40' },
};

function treasuryStyleRanges(source) {
  const ranges = [];
  function inspect(fragment, base = 0) {
    const tree = fromHtml(fragment, {
      fragment: true, verbose: true,
      onerror(error) {
        if (error.ruleId.startsWith('eof-') && error.ruleId !== 'eof-in-element-that-can-contain-only-text') {
          throw new Error(`Treasury source structure is incomplete: ${error.ruleId}`);
        }
      },
    });
    function visit(node) {
      const tags = node.data?.position;
      if (node.type === 'element' && node.tagName === 'script') {
        const openingStart = tags?.opening?.start.offset;
        const openingEnd = tags?.opening?.end.offset;
        const end = node.position?.end.offset;
        assert([openingStart, openingEnd, end].every(Number.isInteger) && 0 <= openingStart
          && openingStart < openingEnd && openingEnd <= end && end <= fragment.length,
          'Treasury script source positions are invalid');
        // Astro permits <script ... />. HTML treats its following source as raw
        // script text; inspect that source span separately, without rewriting it.
        if (fragment.slice(openingStart, openingEnd).endsWith('/>')) {
          inspect(fragment.slice(openingEnd, end), base + openingEnd);
          return;
        }
        assert(tags.closing, 'Treasury source has an unclosed script');
      }
      if (node.type === 'element' && node.tagName === 'style') {
        const offsets = [tags?.opening?.start.offset, tags?.opening?.end.offset,
          tags?.closing?.start.offset, tags?.closing?.end.offset];
        const [start, cssStart, cssEnd, end] = offsets;
        assert(offsets.every(Number.isInteger) && 0 <= start && start < cssStart
          && cssStart <= cssEnd && cssEnd < end && end <= fragment.length,
        'Treasury style source is unclosed or has invalid positions');
        ranges.push({ start: base + start, cssStart: base + cssStart, cssEnd: base + cssEnd, end: base + end });
      }
      for (const child of node.children ?? []) visit(child);
      if (node.content) visit(node.content);
    }
    visit(tree);
  }
  inspect(source);
  ranges.sort((left, right) => left.start - right.start);
  let previousEnd = 0;
  for (const range of ranges) {
    assert(previousEnd <= range.start && range.end <= source.length, 'Treasury style source ranges overlap or exceed the source');
    previousEnd = range.end;
  }
  return ranges;
}

function treasurySourceFingerprint(source) {
  const hash = createHash('sha256');
  let cursor = 0;
  for (const { start, end } of treasuryStyleRanges(source)) {
    hash.update(source.slice(cursor, start));
    cursor = end;
  }
  hash.update(source.slice(cursor));
  return hash.digest('hex');
}

// Static labels, figures and source URLs also live outside the dictionaries.
// Review both editorial dates before updating this dated baseline. A justified
// same-day revision may retain the date; CSS-only changes need no date review.
const treasurySourceReview = {
  dates: { fr: '2026-10-23', en: '2026-10-23' },
  files: {
    'src/components/TreasuryBuybackMechanism.astro': '80be748b80b5e9f7d05919d711595dd4598774ac05a89ca86b408d0d1c11f7ec',
    'src/components/OperationalGlossaryReference.astro': '5a8cc0a09958af1d6a21009ea4dc098f60440f92b59ff4ad576f2da428007900',
    'src/pages/glossaire/[slug].astro': 'da8d36c0c1ec01c2be4214b34ea8be167c62084e347c2b2558bfb1de14b85c68',
    'src/pages/en/glossary/[slug].astro': 'be58f5446a29f70a37ae1eedac141134422183c055af7e15e35fdfc44893710b',
  },
};

test('Treasury : composants et templates conservent leur revue éditoriale datée', () => {
  for (const lang of ['fr', 'en']) {
    const reference = lang === 'fr' ? glossaryReferenceBySlug[treasurySlug] : glossaryReferenceEnBySlug[treasurySlug];
    assert.equal(reference.updatedIso, treasurySourceReview.dates[lang], `${lang}: static-source review and editorial date must agree`);
  }
  for (const [path, sha256] of Object.entries(treasurySourceReview.files)) {
    const source = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
    assert.equal(treasuryStyleRanges(source).length, 1, `${path}: expected one explicit Astro style block`);
    assert.equal(treasurySourceFingerprint(source), sha256,
      `${path}: static Treasury content changed; review the editorial dates before updating this dated fingerprint. A justified same-day revision may retain the date.`);
  }
});

test('Treasury : texte, source et chiffres de la figure déclenchent une révision', () => {
  const source = readFileSync(new URL('../src/components/TreasuryBuybackMechanism.astro', import.meta.url), 'utf8');
  const baseline = treasurySourceFingerprint(source);
  for (const mutate of [
    value => value.replace(/(const title = fr \? ')/, '$1Reviewed '),
    value => value.replace(/(href="https:\/\/[^"#]+)(")/, '$1#review$2'),
    value => value.replace(/(Cash : 98 \+ 1 = )99/, (_, prefix) => `${prefix}100`),
  ]) {
    const changed = mutate(source);
    assert.notEqual(changed, source, 'Mutation must change an existing figure label, source URL or amount');
    assert.notEqual(treasurySourceFingerprint(changed), baseline);
  }
});

test('Treasury : les seules modifications CSS restent neutres', () => {
  for (const path of Object.keys(treasurySourceReview.files)) {
    const source = readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
    const [{ cssStart, cssEnd }] = treasuryStyleRanges(source);
    const changed = `${source.slice(0, cssStart)}\n/* Cosmetic revision */\n${source.slice(cssEnd)}`;
    assert.notEqual(changed, source, `${path}: CSS mutation must change an existing style block`);
    assert.equal(treasurySourceFingerprint(changed), treasurySourceFingerprint(source));
  }
});

test('Treasury : les positions CSS couvrent attributs, blocs multiples et script Astro autofermé', () => {
  const source = '<script type="application/ld+json" set:html={json} />\n<h1>Title</h1>'
    + '<!-- <style>Comment retained</style> --><STYLE data-label=">">a{color:red}</STYLE><style></style>Tail';
  const ranges = treasuryStyleRanges(source);
  assert.equal(ranges.length, 2);
  assert.equal(source.slice(ranges[0].cssStart, ranges[0].cssEnd), 'a{color:red}');
  assert.equal(ranges[1].cssStart, ranges[1].cssEnd);
  const changed = `${source.slice(0, ranges[0].cssStart)}b{color:blue}${source.slice(ranges[0].cssEnd)}`;
  assert.equal(treasurySourceFingerprint(changed), treasurySourceFingerprint(source));
  assert.notEqual(treasurySourceFingerprint(source.replace('Comment retained', 'Comment reviewed')), treasurySourceFingerprint(source));
  const script = '<script>const sample = "<style>literal</style>";</script><style>a{}</style>';
  assert.equal(treasuryStyleRanges(script).length, 1);
  assert.notEqual(treasurySourceFingerprint(script.replace('literal', 'reviewed')), treasurySourceFingerprint(script));
});

test('Treasury : une structure de source incomplète échoue explicitement', () => {
  for (const source of ['<style>a{}', '<style/>tail', '<style data-label="unterminated>', '<script>unclosed']) {
    assert.throws(() => treasurySourceFingerprint(source), /Treasury .*?(?:incomplete|unclosed|invalid)/);
  }
  assert.equal(treasurySourceFingerprint('plain text'), createHash('sha256').update('plain text').digest('hex'));
});

for (const lang of ['fr', 'en']) {
  test(`Treasury ${lang}: la date éditoriale couvre le contenu réellement rendu`, () => {
    const reference = lang === 'fr' ? glossaryReferenceBySlug[treasurySlug] : glossaryReferenceEnBySlug[treasurySlug];
    const review = treasuryEditorialReview[lang];
    assert.equal(reference.updatedIso, review.date, `${lang}: review date and fingerprint baseline must agree`);
    assert.equal(treasuryFingerprint(lang), review.sha256,
      `${lang}: rendered Treasury content changed; review the editorial date before updating its dated fingerprint`);
  });

  test(`Treasury ${lang}: définitions, sources, liens et noms des voisins déclenchent une révision`, () => {
    const originalEntries = lang === 'fr' ? glossaryEntries : [...glossaryAtlasEnBySlug.values()];
    const originalReference = lang === 'fr' ? glossaryReferenceBySlug[treasurySlug] : glossaryReferenceEnBySlug[treasurySlug];
    const baseline = treasuryFingerprint(lang);
    const changed = mutate => {
      const input = { entries: structuredClone(originalEntries), reference: structuredClone(originalReference) };
      mutate(input, input.entries.find(entry => entry.slug === treasurySlug));
      assert.notEqual(treasuryFingerprint(lang, input), baseline);
    };
    changed((input, entry) => { entry.def += ' Reviewed definition.'; });
    changed(input => { input.reference.sections[0].paragraphs[0] += ' Reviewed mechanism.'; });
    changed(input => { input.reference.sections[0].sources[0].href += '#review'; });
    changed(input => { input.reference.primarySources[0].detail += ' Reviewed source.'; });
    changed(input => { input.reference.instruments[0].href += '#review'; });
    changed(input => { input.entries.find(entry => entry.slug === 'duration').nom += ' reviewed'; });
    if (lang === 'en') changed((input, entry) => { entry.atlas.sources[0].href += '#review'; });
  });

  test(`Treasury ${lang}: les autres fiches et les définitions des voisins restent neutres`, () => {
    const entries = structuredClone(lang === 'fr' ? glossaryEntries : [...glossaryAtlasEnBySlug.values()]);
    const reference = structuredClone(lang === 'fr' ? glossaryReferenceBySlug[treasurySlug] : glossaryReferenceEnBySlug[treasurySlug]);
    entries.find(entry => entry.slug === 'pcdr').def += ' Unrelated glossary revision.';
    entries.find(entry => entry.slug === 'duration').def += ' Neighbour definition revision.';
    reference.sections[0].sources[0].detail = 'Detail absent from section citation.';
    // EN chooses its visible neighbours from atlas.related, not relatedSlugs.
    if (lang === 'en') reference.relatedSlugs.push('pcdr');
    assert.equal(treasuryFingerprint(lang, { entries, reference }), treasuryFingerprint(lang));
  });
}

test('Treasury EN: publier un voisin jusque-là absent modifie la projection', () => {
  const entries = structuredClone([...glossaryAtlasEnBySlug.values()]);
  assert.equal(entries.some(entry => entry.slug === 't-bill'), false);
  entries.push({ slug: 't-bill', sigle: 'T-bill', nom: 'Treasury bill', accent: 'var(--color-signal)' });
  assert.notEqual(treasuryFingerprint('en', { entries }), treasuryFingerprint('en'));
});

test('le rachat fictif sépare plafond, nominal, prix et paiement', () => {
  const e = treasuryBuybackExample;
  assert(e.acceptedPar <= e.maximumPar && e.maximumPar < e.offeredPar);
  assert.equal(e.acceptedPar * e.weightedCleanPricePer100 / 100, e.cleanPayment);
  assert.equal(e.cleanPayment + e.accruedInterest, e.settlementPayment);
  assert.notEqual(e.settlementPayment, e.acceptedPar);
});

test('seule la nouvelle référence complète est admise dans les deux langues', () => {
  const fr = glossaryEntries.find(entry => entry.slug === 'treasury-buyback');
  const en = glossaryAtlasEnBySlug.get('treasury-buyback');
  assert(fr.reference && en);
  assert.equal(fr.reference, glossaryReferenceBySlug['treasury-buyback']);
  assert.equal(englishGlossaryRobots(en), 'index,follow');
  for (const reference of [fr.reference, glossaryReferenceEnBySlug['treasury-buyback']]) {
    const words = glossaryReferenceWordCount(reference);
    assert(words >= 800 && words <= 1200);
    assert.equal(reference.mechanism, 'treasury-buyback');
    assert(reference.sections.every(section => section.sources?.length));
    assert(reference.primarySources.some(source => source.href === reference.datedFact.sourceHref));
    for (const item of [...reference.analyses, ...reference.instruments]) {
      const match = item.href.match(/^\/(posts|guides|en\/analysis|en\/guides)\/([^/]+)\/$/);
      assert(match, `Unrecognized reading route: ${item.href}`);
      const collection = { posts: 'posts', guides: 'guides', 'en/analysis': 'posts-en', 'en/guides': 'guides-en' }[match[1]];
      assert(['md', 'mdx'].some(extension => existsSync(new URL(`../src/content/${collection}/${match[2]}.${extension}`, import.meta.url))), `Missing reading: ${item.href}`);
    }
  }
  assert.equal(glossaryEntries.find(entry => entry.slug === 'pcdr').reference, undefined);
  assert.equal(englishGlossaryRobots(glossaryAtlasEnBySlug.get('pcdr')), 'noindex,follow');
});

test('PCDR conserve un univers documenté et une fenêtre, sans population figée ni taux actuel', () => {
  const entries = [glossaryEntries.find(entry => entry.slug === 'pcdr'), glossaryAtlasEnBySlug.get('pcdr')];
  for (const entry of entries) {
    assert.doesNotMatch(entry.def, /1[ ,]?200|\d\s*%/);
    assert.match(entry.def, /RD.*D/);
    assert.equal(entry.atlas.sources.length, 1);
    assert.equal(new URL(entry.atlas.sources[0].href).hostname, 'assets.fitchratings.com');
    assert.match(entry.atlas.sources[0].href, /methodology-30-01-2026/);
  }
  assert.match(entries[0].def, /début et fin.*sans pondération/s);
  assert.match(entries[1].def, /beginning and end.*without debt weighting/s);
});
