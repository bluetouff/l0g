import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import opentype from '@shuding/opentype.js';
import { parse, serializeOuter } from 'parse5';
import { XMLValidator } from 'fast-xml-parser';

const pages = {
  fr: 'posts/nvidia-trump-positions-avant-annonce',
  en: 'en/analysis/nvidia-trump-trades-before-announcement',
};
const sourceIds = {
  timeline: ['S01', 'S02', 'S04', 'S05', 'S15', 'S17'],
  holdings: ['S07', 'S08', 'S09', 'S10'],
};
const fontFile = new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf', import.meta.url);
const fontBytes = readFileSync(fontFile);
const font = opentype.parse(fontBytes.buffer.slice(fontBytes.byteOffset, fontBytes.byteOffset + fontBytes.byteLength));

const walk = node => [node, ...(node.childNodes ?? []).flatMap(walk)];
const attrs = node => Object.fromEntries((node.attrs ?? []).map(attr => [attr.name, attr.value]));
const content = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(content).join('');
const hasClass = (node, className) => (attrs(node).class ?? '').split(' ').includes(className);

function translation(node) {
  const offset = { x: 0, y: 0 };
  for (let parent = node.parentNode; parent?.tagName !== 'svg' && parent; parent = parent.parentNode) {
    if (parent.tagName !== 'g') continue;
    const move = attrs(parent).transform;
    if (!move) continue;
    const match = move.match(/^translate\((-?\d+) (-?\d+)\)$/u);
    assert.ok(match, `Unsupported text transform ${move}`);
    offset.x += Number(match[1]);
    offset.y += Number(match[2]);
  }
  return offset;
}

function box(node) {
  const { x, y, 'font-size': size, 'text-anchor': anchor } = attrs(node);
  const text = content(node);
  for (const char of text) assert.notEqual(font.charToGlyphIndex(char), 0, `Missing glyph ${char}`);
  const translationOffset = translation(node);
  const advance = font.getAdvanceWidth(text, Number(size), { kerning: true });
  const anchorOffset = { start: 0, middle: advance / 2, end: advance };
  const x1 = Number(x) + translationOffset.x - (anchorOffset[anchor ?? 'start']);
  const y1 = Number(y) + translationOffset.y - font.ascender * size / font.unitsPerEm;
  return { text, x1, y1, x2: x1 + advance, y2: Number(y) + translationOffset.y - font.descender * size / font.unitsPerEm };
}

function overlaps(a, b) {
  return Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 0.5 && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 0.5;
}

for (const [lang, route] of Object.entries(pages)) {
  test(`Nvidia XXIV ${lang} scenes retain accessible geometry and the published times and disclosure ranges`, () => {
    const dom = walk(parse(readFileSync(new URL(`../dist/${route}/index.html`, import.meta.url), 'utf8')));
    const figures = dom.filter(node => node.tagName === 'figure' && hasClass(node, 'nvidia-market-disclosure'));
    assert.equal(figures.length, 2);
    const ids = dom.map(node => attrs(node).id).filter(Boolean);
    for (const [index, name] of ['timeline', 'holdings'].entries()) {
      const figure = figures[index];
      const stem = `nv24-${name}-${lang}`;
      assert.equal(attrs(figure).id, stem);
      const elements = walk(figure);
      const captions = elements.filter(node => node.tagName === 'figcaption');
      assert.equal(captions.length, 1);
      const hrefs = walk(captions[0]).filter(node => node.tagName === 'a').map(node => attrs(node).href);
      assert.deepEqual(hrefs, sourceIds[name].map(id => `#source-${id}`));
      for (const href of hrefs) assert.equal(ids.filter(id => id === href.slice(1)).length, 1);
      const svgs = elements.filter(node => node.tagName === 'svg');
      assert.equal(svgs.length, 2);
      for (const [sceneIndex, mode] of ['desktop', 'mobile'].entries()) {
        const svg = svgs[sceneIndex];
        const attributes = attrs(svg);
        assert.ok(hasClass(svg.parentNode, mode));
        assert.equal(attributes.role, 'img');
        assert.match(attributes.width, /^100%$/u);
        const names = attributes['aria-labelledby'].split(' ');
        assert.deepEqual(names, [`${stem}-${mode}-title`, `${stem}-${mode}-desc`]);
        for (const title of names) assert.equal(ids.filter(id => id === title).length, 1);
        const markup = serializeOuter(svg);
        assert.equal(XMLValidator.validate(markup, { allowBooleanAttributes: true }), true);
        assert.doesNotMatch(markup, /<script|<foreignObject|\s(?:on[a-z]+|href|src)\s*=/iu);
        const [, , width, height] = attributes.viewBox.split(' ').map(Number);
        assert.equal(width, mode === 'desktop' ? 600 : 320);
        assert.ok(height <= 333);
        const nodes = walk(svg);
        const labels = nodes.filter(node => node.tagName === 'text').map(box);
        for (const [i, label] of labels.entries()) {
          assert.ok(label.x1 >= 5 && label.x2 <= width - 5 && label.y1 >= 5 && label.y2 <= height - 5, `${mode}: ${label.text} escapes the safety margins`);
          for (const other of labels.slice(i + 1)) assert.ok(!overlaps(label, other), `${mode}: ${label.text} crosses ${other.text}`);
        }
        if (name === 'timeline') {
          const events = nodes.filter(node => node.tagName === 'g' && attrs(node)['data-time']);
          assert.deepEqual(events.map(node => attrs(node)['data-time']), ['13:30', '14:29', '14:55', '15:15', '15:45']);
          const coordinates = events.map(node => attrs(walk(node).find(child => child.tagName === 'circle'))[mode === 'desktop' ? 'cx' : 'cy']);
          const origin = mode === 'desktop' ? 34 : 76;
          const length = mode === 'desktop' ? 528 : 200;
          assert.deepEqual(coordinates.map(Number), [0, 59, 85, 105, 135].map(minutes => Math.round(origin + minutes * length / 135)));
        } else {
          const ranges = nodes.filter(node => node.tagName === 'path' && hasClass(node, 'range'));
          const bandPaths = mode === 'desktop' ? ['M127 111H267 M127 106V116 M267 106V116', 'M127 138H267 M127 133V143 M267 133V143'] : ['M122 100H274 M122 95V105 M274 95V105', 'M122 122H274 M122 117V127 M274 117V127'];
          assert.deepEqual(ranges.map(node => attrs(node).d), bandPaths);
          assert.deepEqual(ranges.map(node => [attrs(node)['data-low'], attrs(node)['data-high']]), [['5', '25'], ['5', '25']]);
          const transactions = nodes.filter(node => node.tagName === 'g').map(node => attrs(node)['data-transaction']).filter(Boolean);
          assert.deepEqual(transactions, ['purchase', 'purchase', 'purchase', 'purchase', 'sale']);
          const unavailable = lang === 'fr' ? ['Position exacte inconnue', 'Gain réalisé inconnu'] : ['Exact position unknown', 'Realized gain unknown'];
          for (const label of unavailable) assert.ok(labels.some(node => node.text === label));
        }
      }
    }
  });
}
