import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, realpathSync } from 'node:fs';
import { resolve, sep } from 'node:path';
import { createHash } from 'node:crypto';
import { XMLValidator } from 'fast-xml-parser';
import { fromHtml } from 'hast-util-from-html';
import { toText } from 'hast-util-to-text';
import postcss from 'postcss';

const base = resolve(process.cwd(), 'public/infographies/paramount-warner');
const keys = ['01-timeline','02-capital','03-concentration','04-commitments','05-governance','06-synergies'];
const cuts = [[0,452,730,1170,1730],[0,706,1170],[0,585,1280],[0,690,1240],[0,580,1050,1480],[0,590,1210]];
const maxWidths = [384,336,336,336,384,384];
const originalHashes = {
  "01-timeline-en-mobile.svg": "8fb01dd3f05018c164c0f28a12518c375712767dbe6752fc0033ca5936b6e6b9",
  "01-timeline-en.svg": "5cd1c07808ed2ff59f95980a40b24bcbcc27c2db2e249b248ceee6e540080069",
  "01-timeline-fr-mobile.svg": "729ad716847c6222cf43f5c7a9c240a3e300201bdde432bd9a422f78b0fc5392",
  "01-timeline-fr.svg": "3376a18bc1023adc96e6795d713199c0e7c6dedb634ee660fdd4c01bc8783705",
  "02-capital-en-mobile.svg": "6da6da4ba48b30c80a1910bb14515cba01e8e60218f02de0de9e6f9e216b351c",
  "02-capital-en.svg": "d3a6c41529840f12eddac379f619cc3893b630ed8ddfd786b7a22b4974ac2385",
  "02-capital-fr-mobile.svg": "9e0877188f328bc335361de096b0ef246e3eb4992843f74d852d880143a2a47d",
  "02-capital-fr.svg": "d939d1b9f8f2b1bdd2549b5e69608dbe077548367b76761059ca4d7de72ed412",
  "03-concentration-en-mobile.svg": "a75c854700d1501c9c2ac3174b9b4c7530314a617b3273f5c151ca51a0c372a8",
  "03-concentration-en.svg": "065688aa95b532b9b1bd848bb81ea072edbd1f9e20448477ac3481875c64d052",
  "03-concentration-fr-mobile.svg": "c59510b08f06f48033a8a4ea1859923d2c03f43ee9481c0d7825c51a34305908",
  "03-concentration-fr.svg": "392eefd4f4fdfd9d5827e0299420a0004157e92f0183d34f5bba436e87de89f6",
  "04-commitments-en-mobile.svg": "674fd02621e77a426ebbb68fb52a1ade7a37262747d477c3c9fcbad9d0696f64",
  "04-commitments-en.svg": "4658b12a271f1cac8b92723a41815d29b895b77a78b315ff79c5aa8b3caa5d87",
  "04-commitments-fr-mobile.svg": "7d82a81a1832c4533401ea8bd8d56129c3502cbd8b9a25c6cbdce06bb27863dd",
  "04-commitments-fr.svg": "f95df573e407d9fae72b905b7226ba6d1d0be450f648b8e643e59ded69a6947d",
  "05-governance-en-mobile.svg": "4c1fde05f8a0875556b1aaa90153e6e44c522eb7e14d8b126f362844d0f84157",
  "05-governance-en.svg": "abd19fa8d56efaff269590207c786fc538b9c1a02481b5bb768ce32f22afc213",
  "05-governance-fr-mobile.svg": "17c9fbfa3d9cc9a2720db60d695fb9134a38319a05440638e9da23ceeb77b58f",
  "05-governance-fr.svg": "57af8e0b6e53344aa5624202952c783131f86dc4fddce8135331c8468b7e8ae6",
  "06-synergies-en-mobile.svg": "0594e6a080542e12d646160f3cc5accf4c9ae55ab3ae8bbcbe0f6549888d0384",
  "06-synergies-en.svg": "65c3d2f751a716e2da641b903d752a48fdd9fc0580d31beeb3145388618c08f9",
  "06-synergies-fr-mobile.svg": "38845a7a043563390ca04613bf3a01eda613366ec9a367f8af6d87b96ff4053c",
  "06-synergies-fr.svg": "d1032c6f09223427ed88cf0bdaeae1852d0fa6893e4c5299cf990b2649252cd6"
};
const nodes = tree => [tree, ...(tree.children ?? []).flatMap(nodes)].filter(node => node.type === 'element');
const normal = value => String(value).replace(/\s+/gu, ' ').trim();
const read = name => readFileSync(resolve(base, name), 'utf8');
// User-requested charter correction affects paint only. Geometry signatures and
// the three explicit background-card repairs remain identical to the originals.
const nativeRoles = { ink:'--color-ink', surface:'--color-surface', paper:'--color-paper', muted:'--color-muted', line:'--color-line-strong', amber:'--color-amber', mint:'--color-signal', violet:'--color-accent', blue:'--color-topic-blue', other:'--color-muted', 'ink-text':'--color-ink' };
for (const role of ['amber','mint','violet','blue','other']) nativeRoles[role+'-fill'] = nativeRoles[role];
const nativePaints = {
  dark: { ink:'#0c0d10',surface:'#121419',paper:'#e7e9ee',muted:'#8b909b',line:'rgba(255, 255, 255, 0.20)',amber:'#f5b13d',mint:'#5eead4',violet:'#ff4d87',blue:'#7aa2f7',other:'#8b909b','ink-text':'#0c0d10' },
  light: { ink:'#e7e9ee',surface:'#ffffff',paper:'#1b1d23',muted:'#4d5461',line:'rgba(12, 13, 16, 0.26)',amber:'#92400e',mint:'#0b5f58',violet:'#a50f4d',blue:'#1d4ed8',other:'#4d5461','ink-text':'#e7e9ee' },
};
for (const palette of Object.values(nativePaints)) for (const role of ['amber','mint','violet','blue','other']) palette[role+'-fill'] = palette[role];
const dark = Object.values(nativePaints.dark);
const light = Object.values(nativePaints.light);
const allowedTags = new Set(['svg','title','desc','metadata','style','defs','marker','pattern','clipPath','path','rect','text','tspan','line','circle','g','polyline','polygon','ellipse']);
const allowedAttrs = new Set('xmlns viewBox width height role ariaLabelledBy style id x y x1 y1 x2 y2 cx cy r rx ry fill stroke strokeWidth strokeDashArray strokeLineCap strokeLineJoin opacity fillOpacity strokeOpacity fontFamily fontSize fontWeight textAnchor dy dx d points transform markerWidth markerHeight refX refY orient markerUnits markerEnd markerStart patternUnits clipPath clipPathUnits'.split(' '));

// Frozen signatures were computed from the supplied originals, excluding only
// paint, IDs/references and root sizing. Source typography and all primitives
// remain part of this signature. Only the approved header separator is normalised.
function compositionHash(svg, name) {
  const tree = fromHtml(svg, { fragment: true });
  const omitted = new Set(['id','ariaLabelledBy','fill','stroke','markerEnd','markerStart','style']);
  function visit(node, root = false) {
    if (node.type === 'text') return normal(node.value).replace(/^(0[1-6]) — 04\.10\.2026$/u, '$1 · 04.10.2026');
    if (node.type !== 'element' || ['metadata','style'].includes(node.tagName)) return null;
    const props = Object.fromEntries(Object.entries(node.properties).filter(([key]) => !omitted.has(key) && !key.startsWith('data') && !(root && ['width','height'].includes(key))).sort(([a],[b]) => a.localeCompare(b)));
    if (node.tagName === 'rect' && ['02-capital-fr-mobile.svg','02-capital-en-mobile.svg'].includes(name) && Number(props.x) === 28 && Number(props.y) === 880 && Number(props.width) === 424 && Number(props.height) === 136) props.height = '110';
    if (node.tagName === 'rect' && name === '06-synergies-en.svg' && Number(props.x) === 28 && Number(props.y) === 520 && Number(props.width) === 904 && Number(props.height) === 166) props.height = '125';
    return [node.tagName, props, (node.children ?? []).map(child => visit(child)).filter(value => value !== null && value !== '')];
  }
  return createHash('sha256').update(JSON.stringify(visit(nodes(tree)[0], true))).digest('hex');
}

function inspect(svg, { panel = false, theme } = {}) {
  assert(!/<!DOCTYPE|<!ENTITY|<\?/iu.test(svg), 'No DTD/entities/processing instructions');
  assert.equal(XMLValidator.validate(svg), true);
  const all = nodes(fromHtml(svg, { fragment: true }));
  assert.equal(all[0].tagName, 'svg');
  assert.equal(all.filter(node => node.tagName === 'svg').length, 1);
  const ids = all.flatMap(node => node.properties.id ? [node.properties.id] : []);
  assert.equal(ids.length, new Set(ids).size);
  assert(ids.every(id => /^pw2026-[a-z0-9-]+$/u.test(id)));
  for (const node of all) {
    assert(allowedTags.has(node.tagName), `Unsupported/active tag ${node.tagName}`);
    if (node.tagName === 'metadata') {
      assert(!(node.children ?? []).some(child => child.type === 'element'));
      const metadata = JSON.parse(toText(node));
      assert.deepEqual(Object.keys(metadata).sort(), ['asOf','caption','source','sourceGeometrySha256','sources']);
      assert.equal(metadata.asOf, '2026-10-04');
      assert.match(metadata.source, /^(?:0[1-6])-[a-z]+-(?:fr|en)(?:-mobile)?\.svg$/u);
      assert.match(metadata.sourceGeometrySha256, /^[a-f0-9]{64}$/u);
      assert(metadata.caption.length > 40 && metadata.sources.every(id => /^S\d{2}$/u.test(id)));
      continue;
    }
    if (node.tagName === 'style') {
      assert(!panel, 'Panel paint is explicit; only full exports contain controlled theme styles');
      const css = postcss.parse(toText(node));
      assert.equal(css.nodes.length, 2);
      assert.equal(css.nodes[0].selector, ':root');
      assert.equal(css.nodes[1].name, 'media');
      assert.equal(css.nodes[1].params, '(prefers-color-scheme:light)');
      css.walkDecls(decl => {
        const theme = decl.parent.parent.type === 'atrule' ? 'light' : 'dark';
        const role = decl.prop.slice('--pw-'.length);
        assert(decl.prop === 'color-scheme' ? decl.value === theme : decl.prop.startsWith('--pw-') && Object.hasOwn(nativePaints[theme], role) && decl.value === nativePaints[theme][role], 'Exact native semantic palette only');
      });
      assert(!toText(node).includes('@import'));
      continue;
    }
    for (const [key,value] of Object.entries(node.properties)) {
      assert(allowedAttrs.has(key) || /^data[A-Z][A-Za-z0-9]*$/u.test(key), `Unsafe/unexpected attribute ${key}`);
      assert(!key.toLowerCase().startsWith('on'));
      if (String(value).includes('url(')) {
        const ref = /^url\(#([a-z0-9-]+)\)$/u.exec(String(value));
        assert(ref && ids.includes(ref[1]), 'References resolve locally');
      }
      if (['fill','stroke'].includes(key)) {
        const valid = value === 'none' || /^url\(#[a-z0-9-]+\)$/u.test(value) || (panel ? (theme === 'dark' ? dark : light).includes(value) : /^var\(--pw-[a-z-]+\)$/u.test(value));
        assert(valid, `Unexpected ${theme ?? 'semantic'} paint ${value}`);
      }
      if (key === 'style') { assert.equal(node.tagName, 'svg'); assert.equal(value, 'width:100%;height:auto'); }
      if (key === 'fontFamily') assert.equal(value, 'Arial, Helvetica, sans-serif');
    }
  }
  const named = all[0].properties.ariaLabelledBy;
  assert.equal(all[0].properties.role, 'img');
  assert(Array.isArray(named) && named.length === 2);
  named.forEach((id,index) => {
    const matching = all.filter(node => node.properties.id === id);
    assert.equal(matching.length, 1);
    assert.equal(matching[0].tagName, index ? 'desc' : 'title');
    assert(normal(toText(matching[0])).length > 5);
  });
  return all;
}

test('All 84 SVGs are valid, inert, local and use bounded controlled paints', () => {
  assert.equal(readdirSync(base).filter(name => name.endsWith('.svg')).length, 24);
  const panels = readdirSync(resolve(base, 'panels'));
  assert.equal(panels.length, 60);
  for (const name of readdirSync(base).filter(name => name.endsWith('.svg'))) inspect(read(name));
  for (const name of panels) {
    const file = realpathSync(resolve(base, 'panels', name));
    assert(file.startsWith(realpathSync(base) + sep));
    inspect(read('panels/' + name), { panel: true, theme: name.includes('.dark.') ? 'dark' : 'light' });
  }
  const global = postcss.parse(readFileSync(resolve(process.cwd(), 'src/styles/global.css'), 'utf8'));
  const tokens = { dark:{},light:{} };
  global.walkAtRules('theme', rule => rule.walkDecls(decl => { tokens.dark[decl.prop] = decl.value; }));
  global.walkRules(rule => { if (rule.selector === ':root[data-theme="light"]') rule.walkDecls(decl => { tokens.light[decl.prop] = decl.value; }); });
  const scoped = postcss.parse(readFileSync(resolve(process.cwd(), 'src/styles/paramount-warner-infographics.css'), 'utf8'));
  for (const theme of ['dark','light']) {
    const selector = (theme === 'light' ? ':root[data-theme="light"] ' : '') + '.l0g-pw-figure .pw-wide>svg';
    const rules = scoped.nodes.filter(node => node.type === 'rule' && node.selector === selector);
    assert.equal(rules.length, 1);
    assert.equal(rules[0].nodes.length, Object.keys(nativeRoles).length);
    for (const [role,token] of Object.entries(nativeRoles)) {
      assert.equal(tokens[theme][token], nativePaints[theme][role], 'Native site token remains the reviewed value');
      assert.equal(rules[0].nodes.find(decl => decl.prop === '--pw-'+role)?.value, `var(${token}, ${nativePaints[theme][role]})`, 'Inline SVG inherits the actual site token, with the exact theme fallback');
    }
  }
});

test('Source compositions remain intact with exactly three approved card backgrounds enlarged', () => {
  assert.equal(Object.keys(originalHashes).length, 24);
  for (const [name,expected] of Object.entries(originalHashes)) assert.equal(compositionHash(read(name), name), expected, name);
  for (const [name,y,width,height] of [['02-capital-fr-mobile.svg',880,424,136],['02-capital-en-mobile.svg',880,424,136],['06-synergies-en.svg',520,904,166]]) {
    const cards = inspect(read(name)).filter(node => node.tagName === 'rect' && Number(node.properties.x) === 28 && Number(node.properties.y) === y && Number(node.properties.width) === width);
    assert.equal(cards.length, 1);
    assert.equal(Number(cards[0].properties.height), height);
  }
});

test('Mobile crops cover each original once, preserve complete modules and remain below 500 pixels', () => {
  for (const [figure,key] of keys.entries()) for (const lang of ['fr','en']) {
    const original = inspect(read(`${key}-${lang}-mobile.svg`));
    assert.equal(Number(original[0].properties.viewBox.split(/\s/u)[3]), cuts[figure].at(-1));
    for (let panel = 1; panel < cuts[figure].length; panel++) {
      const start = cuts[figure][panel-1], end = cuts[figure][panel];
      assert((end - start) * maxWidths[figure] / 480 < 500);
      for (const theme of ['dark','light']) {
        const all = inspect(read(`panels/${key}-${lang}-p${panel}.${theme}.svg`), { panel: true, theme });
        assert.equal(all[0].properties.viewBox, `0 ${start} 480 ${end-start}`);
        assert.equal(Number(all[0].properties.dataCropStart), start);
        assert.equal(Number(all[0].properties.dataCropEnd), end);
        const group = all.find(node => node.properties.dataSourceComposition === 'complete-original');
        assert(group && group.properties.clipPath, 'Original complete geometry remains in the crop');
        assert.equal(nodes(group).length - 1, original.filter(node => !['svg','title','desc','metadata','style','defs','marker','pattern'].includes(node.tagName)).length - original.filter(node => ['path'].includes(node.tagName) && !node.properties.fontSize && (node.properties.d?.startsWith('M0 0 L8') || node.properties.d?.startsWith('M-2 2'))).length);
      }
      const cards = original.filter(node => node.tagName === 'rect' && Number(node.properties.rx) > 0 && Number(node.properties.x) > 0);
      for (const card of cards) {
        const top = Number(card.properties.y), bottom = top + Number(card.properties.height);
        assert(!(top < start && start < bottom || top < end && end < bottom), 'Crop never crosses a source card');
      }
    }
  }
});

test('Equity bars encode the five projected stakes and distinguish voting control', () => {
  for (const lang of ['fr','en']) {
    const all = inspect(read(`02-capital-${lang}.svg`));
    const bars = all.filter(node => node.tagName === 'rect' && Number(node.properties.y) === 197);
    assert.equal(bars.length, 5);
    [15.1,12.8,10.6,11,50.5].forEach((share,index) => assert(Math.abs(Number(bars[index].properties.width) / 904 * 100 - share) < 1e-9));
    const metadata = JSON.parse(toText(all.find(node => node.tagName === 'metadata')));
    assert(/38[.,]5/u.test(metadata.caption));
    assert(/projection/iu.test(metadata.caption));
    assert(/vot/u.test(metadata.caption));
  }
});

test('Market shares remain attributed and settlement and synergy totals retain their scope', () => {
  for (const lang of ['fr','en']) {
    const market = inspect(read(`03-concentration-${lang}.svg`));
    const marketCaption = JSON.parse(toText(market.find(node => node.tagName === 'metadata'))).caption;
    assert(/27/u.test(toText(market.find(node => node.tagName === 'desc'))));
    assert(/États|states/u.test(marketCaption));
    const quota = inspect(read(`04-commitments-${lang}.svg`));
    const quotaText = normal(quota.filter(node => ['text','desc'].includes(node.tagName)).map(toText).join(' '));
    assert(/156/u.test(quotaText) && /103/u.test(quotaText));
    assert.equal([30,30,32,32,32].reduce((sum,n) => sum+n), 156);
    assert.equal([20,20,21,21,21].reduce((sum,n) => sum+n), 103);
    const synergy = inspect(read(`06-synergies-${lang}.svg`));
    const synergyCaption = JSON.parse(toText(synergy.find(node => node.tagName === 'metadata'))).caption;
    assert(/Octus/u.test(synergyCaption));
    assert(/32[.,]1/u.test(synergyCaption));
    assert.equal(Math.round(6 / 18.7 * 1000) / 10, 32.1);
  }
});

test('Native galleries are accessible, bounded and keep all six captions and sources', () => {
  const css = readFileSync(resolve(process.cwd(), 'src/styles/paramount-warner-infographics.css'), 'utf8');
  assert.doesNotThrow(() => postcss.parse(css));
  assert(css.includes('scroll-snap-type:x mandatory') && css.includes(':focus-visible') && css.includes('prefers-reduced-motion'));
  assert(css.includes('@media(max-width:640px)') && css.includes('max-width:21rem'));
  const articles = [
    ['fr','src/content/posts/paramount-warner-ellison-trump-fcc-medias.md'],
    ['en','src/content/posts-en/paramount-warner-ellison-trump-fcc-media.md'],
  ];
  for (const [lang,path] of articles) {
    const source = readFileSync(resolve(process.cwd(), path), 'utf8');
    const all = nodes(fromHtml(source, { fragment: true }));
    const figures = all.filter(node => node.tagName === 'figure' && node.properties.className?.includes('l0g-pw-figure'));
    assert.equal(figures.length, 6);
    figures.forEach((figure,index) => {
      const descendants = nodes(figure);
      const byClass = name => descendants.filter(node => node.properties.className?.includes(name));
      const gallery = byClass('pw-gallery');
      assert.equal(gallery.length, 1); assert.equal(gallery[0].properties.tabIndex, 0); assert.equal(gallery[0].properties.role, 'region');
      assert.equal(byClass('pw-panel').length, cuts[index].length - 1);
      assert.equal(descendants.filter(node => node.tagName === 'svg').length, 1);
      const ids = byClass('pw-panel').map(node => node.properties.id);
      assert.deepEqual(nodes(byClass('pw-pagination')[0]).filter(node => node.tagName === 'a').map(node => node.properties.href), ids.map(id => '#'+id));
      for (const image of descendants.filter(node => node.tagName === 'img')) {
        assert.match(image.properties.src, /^\/infographies\/paramount-warner\/panels\/[a-z0-9.-]+\.svg$/u);
        assert(normal(image.properties.alt).length > 30);
        assert.equal(Number(image.properties.width), 480);
      }
      const caption = descendants.find(node => node.tagName === 'figcaption');
      assert(caption && toText(caption).length > 80);
      const sourceLinks = nodes(caption).filter(node => node.tagName === 'a');
      assert(sourceLinks.length > 0 && sourceLinks.every(node => /^#source-s\d{2}$/u.test(node.properties.href)));
    });
  }
});
