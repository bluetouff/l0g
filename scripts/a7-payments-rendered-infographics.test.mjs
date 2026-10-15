import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';

const pages = ['fr', 'en'].map(lang => ({ lang, html: readFileSync(new URL(`../dist/${lang === 'fr' ? 'posts/a7-banques-detour-paiements-russes' : 'en/analysis/a7-banks-russia-payment-detour'}/index.html`, import.meta.url), 'utf8') }));
const nodes = n => [n, ...(n.childNodes ?? []).flatMap(nodes)];
const attr = (n, k) => n.attrs?.find(a => a.name === k)?.value;
const text = n => n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(text).join('');
const canonical = n => n.nodeName === '#text' ? ['#text', n.value] : [n.tagName, (n.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), (n.childNodes ?? []).filter(c => c.nodeName !== '#text' || c.value.trim() || ['text', 'title', 'desc', 'metadata'].includes(n.tagName)).map(canonical)];
// Independent complete browser-tree fingerprints of the supplied SVG exports, with four approved heading edits and four metadata-only attribution clarifications.
const originals = {
  "mirror-fr-desktop": {
    "rawHash": "8550838ce388700c90aa05511701b5aaaff1a9af17702d60ac8a29e0c5ea1b26",
    "domHash": "791cf54caab9bcc9c4d398570c888f4c24c0a78358e818d05fadc146f4b875ca",
    "viewBox": "0 0 1000 730"
  },
  "mirror-fr-mobile": {
    "rawHash": "20b3c5572c10a5c1aa310476a2f24a998369b2cad4f6ae923e42b9726c94aaee",
    "domHash": "3d857e9201718372935bb36bcfd21e13a439df328bcebe152de7829f4db87740",
    "viewBox": "0 0 400 1010"
  },
  "backing-fr-desktop": {
    "rawHash": "84ddb0ff6cd50d7702cc9a0eaf4a253f3d3b44ad4ccb0d5fc4be65e7594303a7",
    "domHash": "17011f5107798c6092ff7f30c2ea76b640ab39a15a96190edd55acc2245c70ff",
    "viewBox": "0 0 1000 765"
  },
  "backing-fr-mobile": {
    "rawHash": "1fa42126e3deaf2c08198ffa59e07560134b67eae843b071f8758b00a20543ed",
    "domHash": "621d418f8bb67045523167d274a3d65b4c97784f488a0319bfdf178edbd8824b",
    "viewBox": "0 0 400 1235"
  },
  "turnover-fr-desktop": {
    "rawHash": "6d25eda778ed9256f29ccd5733afe587023272b8a622ed39e85f8f9528801862",
    "domHash": "daf73b83789802bd3a4965dc89d8882c62ee2ccbaf1bd5faba8b86ab6b02dfcb",
    "viewBox": "0 0 1000 789"
  },
  "turnover-fr-mobile": {
    "rawHash": "95211594ebcb95d9e7cc34c67eb2108d75e4b2f17f446fce2b98a9718d3e8995",
    "domHash": "8d4e2efcc6fe6c8622fbc2a267d59adc1f6667c50340e3ce831ee7bd32fc6dc5",
    "viewBox": "0 0 400 1105"
  },
  "activity-fr-desktop": {
    "rawHash": "559e51214c4de9da62289e43b94ca29f5ac042e2241189d3d78ffc6f6c248669",
    "domHash": "75867e201b539cc8ffcf398a670afc8b66a16a22ba426afc1406bae978f14e7e",
    "viewBox": "0 0 1000 768"
  },
  "activity-fr-mobile": {
    "rawHash": "b25815a8bb2b5da25dcfda5f2097e57b0ad6af426022096edbc1818c04fd5d5c",
    "domHash": "b48a60a8027c89f6f6ea8ded8e1c5cdcc909c3d0440709d4fe3825c8fb389f63",
    "viewBox": "0 0 400 946"
  },
  "measures-fr-desktop": {
    "rawHash": "90032f6e29154157a4d77269a90ecfcf1e2c2f0173c959a228d8220261c1df8e",
    "domHash": "06b4627cd6147066459b8057f240b4dac691c5cdcda8d21db635b65d6dc6b446",
    "viewBox": "0 0 1000 837"
  },
  "measures-fr-mobile": {
    "rawHash": "eb690dbcc74827abd568f2de1a00e1de9874a819761130a58c976e4044037393",
    "domHash": "443d7a23c17b4b944b497b75ad8d60ea7e7337a5231295faa609fbf41b5eff47",
    "viewBox": "0 0 400 1237"
  },
  "liquidity-fr-desktop": {
    "rawHash": "e9997e2d6e5a356dc44740d295de725d7bc8d2776d2b0120f2973cda7940fb4c",
    "domHash": "6cc7a40151d090f2dcf9fa577deda6159f5e2451b4d541b2ce419a357e18e64a",
    "viewBox": "0 0 1000 790"
  },
  "liquidity-fr-mobile": {
    "rawHash": "eba8f77d01d33bd1d0016500eca72544f62866fc898f16bea77a3767275e19fa",
    "domHash": "c3186fffce4627c25b33a723014600217ec15867e409e9aa06d99a3b2bd6e04a",
    "viewBox": "0 0 400 997"
  },
  "mirror-en-desktop": {
    "rawHash": "051641aa4160be420e649c8f5e007a17d00aea7834b49a09c85dda3563bcdaf2",
    "domHash": "90bb17a8e06128922b2da7df540202c019dd07f847031aa34c99ff66ae4eae7d",
    "viewBox": "0 0 1000 730"
  },
  "mirror-en-mobile": {
    "rawHash": "7106942477d3a6f7cb801d75976488e58ba38a207a84012b00865ad2bd6aa768",
    "domHash": "ea54d455f9e0b5f2bea0b6e988f88e41a78138bd71c863b1c3bd8db410950358",
    "viewBox": "0 0 400 1010"
  },
  "backing-en-desktop": {
    "rawHash": "9ee0a0b667b7406504c5460e1525379d230cdfdc0ffead31725b84b6f97799fb",
    "domHash": "7d318b615313eed29f33b6d329cc73a6a0d4f238034db6928aa3ca006916cd64",
    "viewBox": "0 0 1000 765"
  },
  "backing-en-mobile": {
    "rawHash": "197c94c429bbc64e94806341c2c903833ddde97b31e047968f73cdc118054d36",
    "domHash": "9c9a72a19dd84cc54ca214c85eb1c985a4dfba5e2f30a4a17590815d2fa0b78c",
    "viewBox": "0 0 400 1235"
  },
  "turnover-en-desktop": {
    "rawHash": "8ea219dcd643a3c4e7cf9f197b54fd42f20ba9d0ad44be77c3a1f4c4c94ed07a",
    "domHash": "7ab24454793df5911c35aa29fa670fa3538740ea8bed37ba760cda8d026609bb",
    "viewBox": "0 0 1000 789"
  },
  "turnover-en-mobile": {
    "rawHash": "f7feb92f73692122be33055c5f7cc17d0a3afc3c68338afba49edbabe7e89408",
    "domHash": "80d95e7387c6933f3a265ad2b24899371bed55f9aa808007a3e5b038ecb69d74",
    "viewBox": "0 0 400 1105"
  },
  "activity-en-desktop": {
    "rawHash": "fce22bb3d165d8638f311344ce89c6e9c28327272892a572ea1bcf7e3f895296",
    "domHash": "f633c14a67aa5f6b050f13531d8acbcfe40a2dc49eaa6a5cf7c07a84adf46804",
    "viewBox": "0 0 1000 768"
  },
  "activity-en-mobile": {
    "rawHash": "ff141ad435f5c97fb8d2e9a69a69691ab2a4a7169475667e835966172525e355",
    "domHash": "87163932ec83428289e796ef682ab8b1dc47866c21787060e17921dcc79dc7d5",
    "viewBox": "0 0 400 946"
  },
  "measures-en-desktop": {
    "rawHash": "683eaf6029e2683e99a3f32ccba5ceadaec28355857549f954e47a58264a0787",
    "domHash": "5f70e459a05d877495643f172cdc4cd0cb841563cc2d9461ece95e8cf7c5b7ef",
    "viewBox": "0 0 1000 837"
  },
  "measures-en-mobile": {
    "rawHash": "8b3175a6064b28a18c3ddc47e2af1cae9321dbc48580e6c08f0581a9081d2adb",
    "domHash": "2f143f0b3d18001dd8870e18a04868780145cffd5cfb2c514423a710803f2c53",
    "viewBox": "0 0 400 1237"
  },
  "liquidity-en-desktop": {
    "rawHash": "4389db911bb66c2a7b95ebd5ee792358bf6dc750fce42d96b554c9125c49d08d",
    "domHash": "1a67b2bec0934c5cb8dcec6b3406cde67573073e7bd766c8ade2cd79f6325230",
    "viewBox": "0 0 1000 790"
  },
  "liquidity-en-mobile": {
    "rawHash": "053db57e9b1e50641ccb81a57f374e108d10ea1828c5953a57744545e00c72d0",
    "domHash": "6ab2a4293e221f7f253af3bf190ae35c04c0e789e962dea69e461978272586aa",
    "viewBox": "0 0 400 997"
  }
};
const kinds = ["mirror","backing","turnover","activity","measures","liquidity"];
const references = {"mirror":[1,2,5],"backing":[6,16],"turnover":[5,7],"activity":[11],"measures":[5,7,12,13,14,15],"liquidity":[5,16]};
const classes = (n, name) => (attr(n, 'class') ?? '').split(/\s+/u).includes(name);
function figures(tree, lang) {
  const all = nodes(tree), figures = all.filter(n => n.tagName === 'figure' && classes(n, 'a7-payments-figure')); assert.equal(figures.length, 6);
  for (const [i, figure] of figures.entries()) {
    assert.deepEqual(['id', 'data-figure', 'data-kind'].map(k => attr(figure, k)), [`figure-${i + 1}`, String(i + 1).padStart(2, '0'), kinds[i]]);
    const roots = nodes(figure).filter(n => n.tagName === 'svg'); assert.equal(roots.length, 2);
    for (const [j, root] of roots.entries()) {
      const key = `${kinds[i]}-${lang}-${j ? 'mobile' : 'desktop'}`, prefix = `a7-${kinds[i]}-${lang}-${j ? 'mobile' : 'desktop'}`;
      assert.deepEqual(root.attrs.map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), Object.entries({ xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto' }).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
      const hash = createHash('sha256').update(JSON.stringify(canonical(root))).digest('hex'); assert.equal(hash, originals[key].domHash, `${key}: geometry/text/native attributes`);
      assert.ok(classes(root.parentNode, `a7-payments-${j ? 'mobile' : 'desktop'}`));
      for (const type of ['title', 'desc']) { const selected = nodes(root).filter(n => n.tagName === type); assert.equal(selected.length, 1); assert.equal(attr(selected[0], 'id'), `${prefix}-${type}`); assert.ok(text(selected[0]).trim()); }
    }
    const caption = nodes(figure).filter(n => n.tagName === 'figcaption'); assert.equal(caption.length, 1); assert.ok(text(caption[0]).length > 100);
    const links = nodes(caption[0]).filter(n => n.tagName === 'a'); assert.deepEqual(links.map(n => [attr(n, 'href'), text(n)]), references[kinds[i]].map(n => [`#source-${n}`, `[${n}]`]));
    const details = nodes(figure).filter(n => n.tagName === 'details'); assert.equal(details.length, 1); assert.equal(nodes(details[0]).filter(n => n.tagName === 'summary').length, 1); assert.ok(text(details[0]).length > 150);
  }
  const ids = all.map(n => attr(n, 'id')).filter(Boolean); assert.equal(new Set(ids).size, ids.length, 'All document IDs unique');
}
function changeAttribute(n, k, value) { const a = n.attrs.find(a => a.name === k); assert.ok(a); a.value = value; }
test('compiled FR/EN preserve 24 complete reviewed SVGs and six accessible figures each', () => { for (const page of pages) figures(parse(page.html), page.lang); });
test('compiled SVG expectations detect geometry, text, native attributes and active additions', () => {
  for (const field of ['viewBox', 'role', 'style', 'aria-labelledby']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'aria-labelledby') === 'a7-mirror-fr-desktop-title a7-mirror-fr-desktop-desc'); changeAttribute(root, field, 'changed'); assert.throws(() => figures(tree, 'fr')); }
  for (const [field, value] of [['font-family', 'Arial'], ['font-size', '1'], ['x', '0'], ['fill', 'url(https://example.org/x)']]) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'aria-labelledby') === 'a7-mirror-fr-desktop-title a7-mirror-fr-desktop-desc'), label = nodes(root).find(n => n.tagName === 'text'); changeAttribute(label, field, value); assert.throws(() => figures(tree, 'fr')); }
  for (const type of ['script', 'foreignObject', 'image', 'animate']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'aria-labelledby') === 'a7-mirror-fr-desktop-title a7-mirror-fr-desktop-desc'); root.childNodes.push({ nodeName: type, tagName: type, attrs: [], childNodes: [] }); assert.throws(() => figures(tree, 'fr')); }
});
