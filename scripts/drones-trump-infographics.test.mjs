import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { XMLParser, XMLValidator } from 'fast-xml-parser';
import postcss from 'postcss';

// Frozen from the supplied original XML, before the l0g palette adaptation.
// Only paints and root responsive style are omitted; two explicitly checked
// arrow detours are reverted for comparison. All labels and units remain.
const frozen = {
  "01-mecanisme-en-mobile.svg": "3c2621acb65e6747d15b1a467354fe350e01de71b3f6dc88395eebce7a790c9e",
  "01-mecanisme-en.svg": "b9dc97c72f29d8feec8cd0112221ed146e9402a9b8ab85197deafde8fa6fb588",
  "01-mecanisme-fr-mobile.svg": "23489eeb209474b8d7d1a28566e7ee812dffdd9d856e47ef2e75adc5fafc3c22",
  "01-mecanisme-fr.svg": "8ba6a0fec1192b6733f3683a75aff3d24eec593180498b50dac7c83866fd4988",
  "02-titres-en-mobile.svg": "f54859986ca5605049ab17c956a51b168977d4631bb2d8ffce997ce756d33f76",
  "02-titres-en.svg": "db8b816413fedc6c180bc0bb48db1b062330297a413a705210c22fba00572253",
  "02-titres-fr-mobile.svg": "9942d33385d13242a9a80595e955d5e09331ec63dbab2a8a327d9a4e390f7071",
  "02-titres-fr.svg": "6e6f261608b77f4ac510d89555a0db824215946ffeb83d283cdaa7c3753fd0a6",
  "03-regles-en-mobile.svg": "2d60078d1140c0d07015f65cbdb954fbb0a6c06884632f7c6ff4b233eda3535a",
  "03-regles-en.svg": "445ea70025f87dd1496a616ecca709fb1694a6bb97fb7cf348ce95aee8236501",
  "03-regles-fr-mobile.svg": "6993487e87827c228fb0ce00759b5642794da1ec4cbaa1d00a9384d59c61c482",
  "03-regles-fr.svg": "44aa575a9c1097565f4d4241da8833b7aec290c9c77eb2fa4c745190abdb19b5",
  "04-commandes-en-mobile.svg": "8703a95d8780b829f33c43d877631d0a2d227b14178d700ddc45a99d038c43e1",
  "04-commandes-en.svg": "a912546cdf78f9deedfd3a9ea8d6bbceb8cd8618650d3b4c72906e17b4ca2f30",
  "04-commandes-fr-mobile.svg": "e293fc37a688c13cd22c52271842182dc0fa52c8879e0a883d6b778b51c5dbb2",
  "04-commandes-fr.svg": "4671c3ca222238ccd68431b088e59dc903ae0eeb5c06511f5a9943a9e65d7d44",
  "05-resultat-en-mobile.svg": "cd5caa78b4127d4ac7902492e15e704c39dbfc5c84f1a4a236f1427565dcc688",
  "05-resultat-en.svg": "7c9ef22401950e75fa6b38db445a69a698cf652a751731144751b4f8a3289017",
  "05-resultat-fr-mobile.svg": "401379fffb3aa9df27caafb089729616422514773187c18b669c914ddd1de5ac",
  "05-resultat-fr.svg": "b10d64b8a6f1aef4acfcd5c5cf87d74c1e53b5272d383117df07b1b974d014d9",
  "06-investissements-en-mobile.svg": "9c94f71e0a79d47d630aaf44280f81a84931b8942f46d790ac69e0e856f02755",
  "06-investissements-en.svg": "ee3456319c6b2cb17b5433a94fecae88362183075fcbb1f325812524d5c9bcc2",
  "06-investissements-fr-mobile.svg": "eeefe891cab57e32520f45eb4f654ef6d2c27f3b6e599b6814ad343d666fa3a0",
  "06-investissements-fr.svg": "a495c56356d42941bb024cb9cd39c31edbb08d4d5f1eba9d26b6edfb55627f2a"
};
const directory = resolve('public/images/drones-trump-jr');
const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, attributeNamePrefix: '', trimValues: false, parseTagValue: false, parseAttributeValue: false });
const allowedTags = new Set('svg title desc defs marker path rect line text circle'.split(' '));
const allowedAttrs = new Set('xmlns width height viewBox role aria-labelledby id refX refY markerWidth markerHeight orient d fill stroke stroke-width stroke-linecap stroke-linejoin marker-end stroke-dasharray stroke-dashoffset transform x y rx font-family font-size font-weight text-anchor x1 y1 x2 y2 opacity cx cy r style'.split(' '));
const tag = node => Object.keys(node).find(key => key !== ':@');
const attrs = node => node[':@'] ?? {};
const children = node => node[tag(node)] ?? [];
const elements = node => tag(node) === '#text' ? [] : [node, ...children(node).flatMap(elements)];
const text = node => tag(node) === '#text' ? node['#text'] : children(node).map(text).join('');
const files = readdirSync(directory).filter(name => name.endsWith('.svg')).sort();
const trees = new Map(files.map(name => {
  const source = readFileSync(resolve(directory, name), 'utf8');
  assert.equal(XMLValidator.validate(source), true, name);
  assert.ok(!/<!|<\?/u.test(source), 'No DTD, entity declarations or processing instructions');
  const tree = parser.parse(source);
  assert.equal(tree.length, 1);
  return [name, tree[0]];
}));
const native = {};
postcss.parse(readFileSync('src/styles/global.css', 'utf8')).walkDecls(decl => {
  if (decl.parent.type === 'atrule' && decl.parent.name === 'theme') native[decl.prop] = decl.value;
});
const paint = role => `var(--color-${role}, ${native[`--color-${role}`]})`;
const nodes = name => elements(trees.get(name));
const get = (figure, lang, mobile = false) => nodes(`${figure}-${lang}${mobile ? '-mobile' : ''}.svg`);
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-7, `${a} != ${b}`);
const number = (node, key, fallback = 0) => {
  const value = Number(attrs(node)[key] ?? fallback);
  assert.ok(Number.isFinite(value), key);
  return value;
};

test('24 XML figures are inert, named, responsive and inherit exact l0g theme tokens', () => {
  assert.deepEqual(files, Object.keys(frozen).sort());
  const roles = ['ink', 'surface-2', 'line-strong', 'paper', 'muted', 'signal', 'amber', 'topic-blue', 'down'];
  for (const role of roles) assert.equal(typeof native[`--color-${role}`], 'string');
  const palette = new Set(['none', ...roles.map(paint)]);
  assert.equal(palette.size, 10);
  const idsAcrossFiles = new Set();
  for (const [name, tree] of trees) {
    const all = elements(tree), root = attrs(tree);
    assert.equal(tag(tree), 'svg');
    assert.equal(root.xmlns, 'http://www.w3.org/2000/svg');
    assert.equal(root.role, 'img');
    assert.equal(root.style, 'width:100%;height:auto');
    assert.equal(all.filter(node => tag(node) === 'title').length, 1);
    assert.equal(all.filter(node => tag(node) === 'desc').length, 1);
    const ids = all.map(node => attrs(node).id).filter(Boolean);
    assert.equal(ids.length, new Set(ids).size, name);
    for (const id of ids) { assert.ok(!idsAcrossFiles.has(id), id); idsAcrossFiles.add(id); }
    const aria = root['aria-labelledby'].split(' ');
    assert.equal(aria.length, 2);
    for (const id of aria) assert.ok(all.some(node => attrs(node).id === id && ['title', 'desc'].includes(tag(node)) && text(node).trim()));
    for (const node of all) {
      assert.ok(allowedTags.has(tag(node)), tag(node));
      for (const [key, value] of Object.entries(attrs(node))) {
        assert.ok(allowedAttrs.has(key), key);
        if (key === 'xmlns') { assert.equal(node, tree); assert.equal(value, root.xmlns); }
        if (['fill', 'stroke'].includes(key)) assert.ok(palette.has(value), value);
        if (key === 'style') { assert.equal(node, tree); assert.equal(value, root.style); }
        if (key === 'marker-end') {
          const reference = /^url\(#([\w-]+)\)$/u.exec(value);
          assert.ok(reference, value);
          assert.ok(all.some(item => tag(item) === 'marker' && attrs(item).id === reference[1]));
        } else assert.ok(!String(value).includes('url('), key);
      }
      if (tag(node) === 'text') {
        assert.equal(attrs(node)['font-family'], 'Arial, Helvetica, sans-serif');
        assert.ok(number(node, 'font-size') >= 16);
      }
    }
  }
});

test('compositions match originals apart from the two approved amber-arrow detours', () => {
  for (const [name, tree] of trees) {
    const detour = /^01-mecanisme-(?:fr|en)\.svg$/u.test(name);
    let corrected = 0;
    function signature(node, root = false) {
      if (tag(node) === '#text') return node['#text'];
      const properties = Object.fromEntries(Object.entries(attrs(node)).filter(([key]) => !['fill', 'stroke'].includes(key) && !(root && key === 'style')).sort(([a], [b]) => a.localeCompare(b)));
      if (detour && properties.d === 'M846 334.96 V360.96 H1056 V610.96') {
        assert.equal(attrs(node).stroke, paint('amber'));
        assert.equal(attrs(node)['marker-end'], `url(#aefb879-1-${name.includes('-fr.') ? 'fr' : 'en'}-False)`);
        properties.d = 'M846 334.96 V610.96';
        corrected++;
      }
      return [tag(node), properties, children(node).map(child => signature(child))];
    }
    const hash = createHash('sha256').update(JSON.stringify(signature(tree, true))).digest('hex');
    assert.equal(hash, frozen[name], name);
    assert.equal(corrected, detour ? 1 : 0);
  }
});

test('primitive bounds and text anchors remain inside the original viewBoxes', () => {
  for (const [name, tree] of trees) {
    const [left, top, width, height] = attrs(tree).viewBox.split(' ').map(Number);
    assert.equal(left, 0); assert.equal(top, 0); assert.ok(height > 0);
    assert.equal(width, name.includes('-mobile') ? 620 : 1120);
    const inside = (x, y) => assert.ok(x >= 0 && x <= width && y >= 0 && y <= height, name);
    for (const node of elements(tree)) {
      if (tag(node) === 'rect') {
        const x = number(node, 'x'), y = number(node, 'y'), w = number(node, 'width'), h = number(node, 'height');
        assert.ok(w >= 0 && h >= 0); inside(x, y); inside(x + w, y + h);
      } else if (tag(node) === 'circle') {
        const radius = number(node, 'r') + number(node, 'stroke-width') / 2;
        inside(number(node, 'cx') - radius, number(node, 'cy') - radius);
        inside(number(node, 'cx') + radius, number(node, 'cy') + radius);
      } else if (tag(node) === 'line') {
        inside(number(node, 'x1'), number(node, 'y1')); inside(number(node, 'x2'), number(node, 'y2'));
      } else if (tag(node) === 'text') inside(number(node, 'x'), number(node, 'y'));
    }
  }
  // Glyph extents and card containment are additionally checked in the actual
  // browser preview; anchor bounds cannot establish font-specific text width.
});

test('historical holdings and H1 earnings use the disclosed proportions', () => {
  const holdings = [65790, 200000, 65790], total = holdings.reduce((a, b) => a + b, 0);
  assert.equal(total, 331580);
  const result = [-15.093130, 9.532673, 5.608541, 2.451357], profit = result.reduce((a, b) => a + b, 0);
  near(profit, 2.499441);
  for (const lang of ['fr', 'en']) for (const mobile of [false, true]) {
    const rings = get('02-titres', lang, mobile).filter(node => tag(node) === 'circle' && number(node, 'r') > 100);
    assert.equal(rings.length, 3);
    let used = 0;
    rings.forEach((ring, index) => {
      const circumference = 2 * Math.PI * number(ring, 'r');
      const [arc, gap] = attrs(ring)['stroke-dasharray'].split(' ').map(Number);
      near(arc + gap, circumference); near(arc + 4, circumference * holdings[index] / total);
      near(number(ring, 'stroke-dashoffset'), -used); used += circumference * holdings[index] / total;
    });
    const all = get('05-resultat', lang, mobile);
    assert.ok(text(trees.get(`05-resultat-${lang}${mobile ? '-mobile' : ''}.svg`)).includes('2.499441'));
    const bars = all.filter(node => tag(node) === 'rect' && attrs(node).rx === '0' && (mobile ? number(node, 'height') === 30 : number(node, 'width') === 112));
    assert.equal(bars.length, 5);
    const zero = mobile ? all.find(node => tag(node) === 'line' && attrs(node).stroke === paint('muted') && number(node, 'x1') === number(node, 'x2') && number(node, 'stroke-width') === 2) : all.find(node => tag(node) === 'line' && attrs(node).stroke === paint('muted') && number(node, 'x1') === 96 && number(node, 'stroke-width') === 2);
    assert.ok(zero);
    const origin = number(zero, mobile ? 'x1' : 'y1');
    const scale = mobile ? (556 - origin) / 5 : (origin - number(all.find(node => tag(node) === 'line' && number(node, 'x1') === 96 && number(node, 'y1') > 260 && number(node, 'y1') < 280), 'y1')) / 5;
    let accumulated = 0;
    bars.forEach((bar, index) => {
      const start = index === 4 ? 0 : accumulated, amount = index === 4 ? profit : result[index], end = start + amount;
      near(number(bar, mobile ? 'width' : 'height'), Math.abs(amount) * scale);
      near(number(bar, mobile ? 'x' : 'y'), mobile ? origin + Math.min(start, end) * scale : origin - Math.max(start, end) * scale);
      if (index < 4) accumulated = end;
    });
  }
});

test('the potential policy transmission stays dashed and capital stays distinct from sales', () => {
  for (const lang of ['fr', 'en']) for (const mobile of [false, true]) {
    const policy = get('01-mecanisme', lang, mobile).filter(node => tag(node) === 'path' && attrs(node).stroke === paint('signal'));
    assert.equal(policy.length, 1); assert.equal(attrs(policy[0])['stroke-dasharray'], '8 7');
    const investments = get('06-investissements', lang, mobile);
    assert.ok(text(trees.get(`06-investissements-${lang}${mobile ? '-mobile' : ''}.svg`)).includes(lang === 'fr' ? 'Capitaux d’UMAC' : 'UMAC funds'));
    assert.ok(investments.some(node => tag(node) === 'path' && attrs(node).stroke === paint('amber') && attrs(node)['marker-end']));
    if (!mobile) assert.ok(investments.some(node => tag(node) === 'path' && attrs(node).stroke === paint('signal') && attrs(node)['marker-end']));
  }
});

test('the scoped component switches layouts and all 24 raw imports are used', () => {
  const component = readFileSync('src/components/L0gDronesFigure.astro', 'utf8');
  const sheet = component.match(/<style>([\s\S]*?)<\/style>/u);
  assert.ok(sheet);
  const css = postcss.parse(sheet[1]);
  const declarations = (selector, media) => {
    const result = {};
    css.walkRules(rule => {
      if (rule.selector === selector && (media ? rule.parent.type === 'atrule' && rule.parent.params === media : rule.parent.type === 'root')) rule.walkDecls(decl => { result[decl.prop] = decl.value; });
    });
    return result;
  };
  const svg = declarations('.l0g-drones-figure :global(svg)');
  assert.equal(svg.width, '100%'); assert.equal(svg.height, 'auto'); assert.equal(svg['max-width'], '100%'); assert.equal(svg['letter-spacing'], 'normal');
  assert.equal(declarations('.l0g-drones-mobile').display, 'none');
  assert.equal(declarations('.l0g-drones-desktop', '(max-width: 640px)').display, 'none');
  assert.equal(declarations('.l0g-drones-mobile', '(max-width: 640px)').display, 'block');
  assert.equal(declarations('.l0g-drones-desktop', 'print').display, 'block');
  assert.equal(declarations('.l0g-drones-mobile', 'print').display, 'none');
  for (const [lang, file] of [['fr', 'src/content/posts/trump-jr-drones-unusual-machines-draganfly-politique-industrielle.mdx'], ['en', 'src/content/posts-en/trump-jr-drones-unusual-machines-draganfly-industrial-policy.mdx']]) {
    const article = readFileSync(file, 'utf8');
    const imports = [...article.matchAll(/import\s+(figure\d(?:Mobile)?)\s+from\s+['"][^'"]*drones-trump-jr\/([^'"]+)\.svg\?raw['"]/gu)];
    assert.equal(imports.length, 12);
    assert.deepEqual(imports.map(match => match[2] + '.svg').sort(), files.filter(name => name.includes(`-${lang}.`) || name.includes(`-${lang}-`)));
    assert.equal([...article.matchAll(/<L0gDronesFigure\s/gu)].length, 6);
    for (let figure = 1; figure <= 6; figure++) assert.ok(article.includes(`desktop={figure${figure}} mobile={figure${figure}Mobile}`));
    const sourceIds = new Set([...article.matchAll(/id="source-(S\d+)"/gu)].map(match => match[1]));
    for (const name of files.filter(name => name.includes(`-${lang}.`) || name.includes(`-${lang}-`))) for (const match of text(trees.get(name)).matchAll(/\bS\d{2}\b/gu)) assert.ok(sourceIds.has(match[0]), `${name}: missing ${match[0]}`);
  }
});
