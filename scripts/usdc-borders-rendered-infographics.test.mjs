import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parse } from 'parse5';

const pages = ['fr', 'en'].map(lang => ({ lang, html: readFileSync(new URL(`../dist/${lang === 'fr' ? 'posts/usdc-reserves-suivre-jeton-mica' : 'en/analysis/usdc-reserves-follow-token-mica'}/index.html`, import.meta.url), 'utf8') }));
const nodes = n => [n, ...(n.childNodes ?? []).flatMap(nodes)];
const attr = (n, k) => n.attrs?.find(a => a.name === k)?.value;
const text = n => n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(text).join('');
const canonical = n => n.nodeName === '#text' ? ['#text', n.value] : [n.tagName, (n.attrs ?? []).map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), (n.childNodes ?? []).filter(c => c.nodeName !== '#text' || c.value.trim() || ['text', 'title', 'desc', 'metadata'].includes(n.tagName)).map(canonical)];
// Independent complete browser-tree fingerprints of all 24 unmodified supplied SVG exports.
const originals = {
  "oversight-fr-desktop": {
    "rawHash": "0b115eb5c7f78ac066227d077d71bc868ad107bed652d8e640ce8be11b15200e",
    "domHash": "d40da38220188bbdcb24a10d6d54eb4d5f5989ac73717f84fa1c8d7dc641ef56",
    "viewBox": "0 0 1000 786"
  },
  "oversight-fr-mobile": {
    "rawHash": "f9a863a836d251e82694002e33bd9266165b7ec2eda0eda1d957346b7997ceb7",
    "domHash": "3c5eb1a2e67d20a93d51c0ad66fa9a02c13fbe1a2fdec2fb3d8ef09ff67ef18f",
    "viewBox": "0 0 400 1118"
  },
  "migration-fr-desktop": {
    "rawHash": "49f0bee01fd448e12198cc55d674af455103416e96a1c3d9fa380d6a62746170",
    "domHash": "4a6de31bac65e14caafc17b32ad8adcdeea9fe888cbf9f0cb6764f17c6a0fbad",
    "viewBox": "0 0 1000 845"
  },
  "migration-fr-mobile": {
    "rawHash": "68b4d564282447112378772d91cc02fd97573fb10e3274f1445270975c322d46",
    "domHash": "8e42d452055537638719663bec559270712fceb0162d1f15b7b27654db7e29ac",
    "viewBox": "0 0 400 1012"
  },
  "information-fr-desktop": {
    "rawHash": "fc8690ab514d4e907699a9c369d39ac86d9cf9c4cc3602c4fc12991692d5f046",
    "domHash": "2b80d8f28dbe8b03a3b38cbecd8966797acbea2c5a435c3e52bc19276c2afad7",
    "viewBox": "0 0 1000 773"
  },
  "information-fr-mobile": {
    "rawHash": "c6d19b5f8a83c9d0683a4d56ca4cf1eb923017a0a1394dc92a9507fde3b3a323",
    "domHash": "ff4dd0a4a04706ae6647535e810d6d5f2166db80548f8005dff67fbfefbfe006",
    "viewBox": "0 0 400 1065"
  },
  "buffers-fr-desktop": {
    "rawHash": "0e8013af3f2c133e4b1b2797ea5563f15030658620a704d2b9d35edbadc60a97",
    "domHash": "5f8a013160165158fe574c5a1688c36a36e50985c751b564644cd8cbb855444f",
    "viewBox": "0 0 1000 770"
  },
  "buffers-fr-mobile": {
    "rawHash": "d32dbc2867e5a4c2876fb342ef62d865b5b62fd61dd5e53437ace35fbd45d8b1",
    "domHash": "fef3477d61412a90e1a29299e37921207ccd37e87f6223e6c60552243332c3e1",
    "viewBox": "0 0 400 923"
  },
  "banking-fr-desktop": {
    "rawHash": "fe39de526552b565fb76a922a7e892a504ccc700f67a1d3f384ed5d4600d483b",
    "domHash": "f87d63f4c4377f5b3ff090286801dd41895b6da3ae4a678164f085fff9822d28",
    "viewBox": "0 0 1000 830"
  },
  "banking-fr-mobile": {
    "rawHash": "bdb99cb93409643f270c50d8e066796ab3d8021e02bdefabc8e83e456c1896b8",
    "domHash": "c94fd2ed007ef690ff82eee194b393e8b8d16c4408dec9d1732bf60706312ff5",
    "viewBox": "0 0 400 1152"
  },
  "exit-fr-desktop": {
    "rawHash": "fc2b1bd63f13834c9440ba64493d8fbaeeb2292411825730d645eb1ccb36bd80",
    "domHash": "087e86267e4b16ae01b33e68b2ac838b6d9e2a3b2757f0a86919eb276d9cb578",
    "viewBox": "0 0 1000 828"
  },
  "exit-fr-mobile": {
    "rawHash": "a03b4a13442c5ea6e7128506f67ee64b4e6a55433420b14a82a21e1902c0ea26",
    "domHash": "76edd188675889d0cb482ed7dd61cd90dd8546012bd59968d6971612f9da7e11",
    "viewBox": "0 0 400 1230"
  },
  "oversight-en-desktop": {
    "rawHash": "d373b0e47b925e128553c30f950ea48e0f9127f0ee4a7582abfc5cb2fc7678c9",
    "domHash": "2744028a4a997e4ca5e474d93bc005f02790f48bafa5fd9cf7195261a4b4ba78",
    "viewBox": "0 0 1000 786"
  },
  "oversight-en-mobile": {
    "rawHash": "4f7335e28cb3462782b38f14e04f26929f213aca80a254740cafd1886624086f",
    "domHash": "6b7c6f4fe6480b7bf2cbc8984799b57829026dcf889d2f637a237e3294bd74fb",
    "viewBox": "0 0 400 1118"
  },
  "migration-en-desktop": {
    "rawHash": "9fd3b191dc59ced7ff93a38796428672f9baf64e864e3b8ae0b61f206a1f60a1",
    "domHash": "cc973bdfbf7277968d8755b30aa1adb6ba7c341b2fca56a4ae911e743cf462e3",
    "viewBox": "0 0 1000 845"
  },
  "migration-en-mobile": {
    "rawHash": "47fa610d4d5445fee4b7e08dd5795646a1ce3eb5c65dbbe53f209d74f520bcc0",
    "domHash": "73a677b9ed6cafb1fbbe185fe4aea52f99f02d56014e79c251cb6188a772c099",
    "viewBox": "0 0 400 1012"
  },
  "information-en-desktop": {
    "rawHash": "5101f08fe74bca53f3a0e6613dcc7b50dd4b555c1758b3dfae4a859349914fda",
    "domHash": "f41b4d703313b2d445f255f2c6078316c33d2ef9bed1abb5a61c6bac92c4f7e4",
    "viewBox": "0 0 1000 773"
  },
  "information-en-mobile": {
    "rawHash": "8789586fae2f2e944594238d21d4fc7bde4f9eb094420ce63aab8f3d654b8102",
    "domHash": "3b446b18b8536f7c88bb968349a7f056ed771f6e5a8fbe4b01506af6259f550d",
    "viewBox": "0 0 400 1065"
  },
  "buffers-en-desktop": {
    "rawHash": "4be2ad4516ee37b51a962180e4ba5a66b5a664741fcd28d5478891e710276e6b",
    "domHash": "ca267384388a10c91ff48519943f61f713c68a4350fbf776f5ef88116704993f",
    "viewBox": "0 0 1000 770"
  },
  "buffers-en-mobile": {
    "rawHash": "47fd26109aa975cf953be4002af7b387e4f95f5208493603bab56bce8463692f",
    "domHash": "322507f74957572372158db8cd717ad9c15228fd1a73ecb75ddde6ef40805a92",
    "viewBox": "0 0 400 923"
  },
  "banking-en-desktop": {
    "rawHash": "ae5910afb140c756ea68aca3e673481a507df9f59371160499843abaf7e90baf",
    "domHash": "7b040b5a5cf4a8cf458978fcba1e2de7aba92ad91a7318169480f8e67a0dfb61",
    "viewBox": "0 0 1000 830"
  },
  "banking-en-mobile": {
    "rawHash": "254425cb3ee27f5f53c7f91042f9658ba7a996983033e6cdb0c3b89677248f74",
    "domHash": "71fb75edafd7d553053cb00580f4f31d9c1e1c34dc60df5968bb05e2c85997ee",
    "viewBox": "0 0 400 1152"
  },
  "exit-en-desktop": {
    "rawHash": "eda839f060008b65b84d7509eebe633b43d826c8187ff2c2edf6e2e4329673a5",
    "domHash": "a690315e8467951ddbf87d658e34c430e3676369b2a20aa6b65cb6f36fc90a91",
    "viewBox": "0 0 1000 828"
  },
  "exit-en-mobile": {
    "rawHash": "b9e195a5b58a118add3ef865172c2898dee4ab4990120ef3fc568227243e3d04",
    "domHash": "23260bb2bc27195a7993259c05cb13c14ea071e05d165f203269265926518650",
    "viewBox": "0 0 400 1230"
  }
};
const kinds = ["oversight", "migration", "information", "buffers", "banking", "exit"];
const references = {"oversight":[1,4,9,14,19],"migration":[4,5],"information":[4,5,6],"buffers":[7,8,9,10],"banking":[10,13],"exit":[2,3,15,16]};
const classes = (n, name) => (attr(n, 'class') ?? '').split(/\s+/u).includes(name);
function figures(tree, lang) {
  const all = nodes(tree), figures = all.filter(n => n.tagName === 'figure' && classes(n, 'usdc-border-figure')); assert.equal(figures.length, 6);
  for (const [i, figure] of figures.entries()) {
    assert.deepEqual(['id', 'data-figure', 'data-kind'].map(k => attr(figure, k)), [`figure-${i + 1}`, String(i + 1).padStart(2, '0'), kinds[i]]);
    const roots = nodes(figure).filter(n => n.tagName === 'svg'); assert.equal(roots.length, 2);
    for (const [j, root] of roots.entries()) {
      const key = `${kinds[i]}-${lang}-${j ? 'mobile' : 'desktop'}`, prefix = `usdc-${kinds[i]}-${lang}-${j ? 'm' : 'd'}`;
      assert.deepEqual(root.attrs.map(a => [a.name, a.value]).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0), Object.entries({ xmlns: 'http://www.w3.org/2000/svg', viewBox: originals[key].viewBox, role: 'img', 'aria-labelledby': `${prefix}-title ${prefix}-desc`, style: 'display:block;width:100%;height:auto', 'data-usdc-kind': kinds[i] }).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0));
      const hash = createHash('sha256').update(JSON.stringify(canonical(root))).digest('hex'); assert.equal(hash, originals[key].domHash, `${key}: geometry/text/native attributes`);
      assert.ok(classes(root.parentNode, `usdc-border-${j ? 'mobile' : 'desktop'}`));
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
  for (const field of ['viewBox', 'role', 'style', 'aria-labelledby']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'aria-labelledby') === 'usdc-oversight-fr-d-title usdc-oversight-fr-d-desc'); changeAttribute(root, field, 'changed'); assert.throws(() => figures(tree, 'fr')); }
  for (const [field, value] of [['font-family', 'Arial'], ['font-size', '1'], ['x', '0'], ['fill', 'url(https://example.org/x)']]) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'aria-labelledby') === 'usdc-oversight-fr-d-title usdc-oversight-fr-d-desc'), label = nodes(root).find(n => n.tagName === 'text'); changeAttribute(label, field, value); assert.throws(() => figures(tree, 'fr')); }
  for (const type of ['script', 'foreignObject', 'image', 'animate']) { const tree = parse(pages[0].html), root = nodes(tree).find(n => n.tagName === 'svg' && attr(n, 'aria-labelledby') === 'usdc-oversight-fr-d-title usdc-oversight-fr-d-desc'); root.childNodes.push({ nodeName: type, tagName: type, attrs: [], childNodes: [] }); assert.throws(() => figures(tree, 'fr')); }
});
