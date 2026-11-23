import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import opentype from '@shuding/opentype.js';
import { parse, serializeOuter } from 'parse5';
import { XMLValidator } from 'fast-xml-parser';

const pages = {
  fr: 'posts/nvidia-retour-jensen-huang-controle-conseil',
  en: 'en/analysis/nvidia-jensen-huang-return-board-oversight',
};
const sourceIds = {
  timeline: ['S01', 'S02', 'S03'],
  oversight: ['S01', 'S02', 'S04'],
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
  const x1 = Number(x) + translationOffset.x - (anchor === 'middle' ? advance / 2 : 0);
  const y1 = Number(y) + translationOffset.y - font.ascender * size / font.unitsPerEm;
  return { text, x1, y1, x2: x1 + advance, y2: Number(y) + translationOffset.y - font.descender * size / font.unitsPerEm };
}

function overlaps(a, b) {
  return Math.min(a.x2, b.x2) - Math.max(a.x1, b.x1) > 0.5 && Math.min(a.y2, b.y2) - Math.max(a.y1, b.y1) > 0.5;
}

for (const [lang, route] of Object.entries(pages)) {
  test(`Nvidia XXIII ${lang} scenes retain accessible geometry and the disclosed reporting line`, () => {
    const dom = walk(parse(readFileSync(new URL(`../dist/${route}/index.html`, import.meta.url), 'utf8')));
    const figures = dom.filter(node => node.tagName === 'figure' && hasClass(node, 'nvidia-leadership-figure'));
    assert.equal(figures.length, 2);
    const ids = dom.map(node => attrs(node).id).filter(Boolean);
    for (const [index, name] of ['timeline', 'oversight'].entries()) {
      const figure = figures[index];
      const stem = `nv23-${name}-${lang}`;
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
        assert.ok(height <= 315);
        const nodes = walk(svg);
        const labels = nodes.filter(node => node.tagName === 'text').map(box);
        for (const [i, label] of labels.entries()) {
          assert.ok(label.x1 >= 5 && label.x2 <= width - 5 && label.y1 >= 5 && label.y2 <= height - 5, `${mode}: ${label.text} escapes the safety margins`);
          for (const other of labels.slice(i + 1)) assert.ok(!overlaps(label, other), `${mode}: ${label.text} crosses ${other.text}`);
        }
        const arrow = nodes.filter(node => node.tagName === 'path' && hasClass(node, 'dashed'));
        assert.equal(arrow.length, name === 'oversight' ? 1 : 0);
        if (name === 'oversight') {
          const corridor = mode === 'desktop' ? { x1: 491, y1: 230, x2: 501, y2: 251 } : { x1: 182, y1: 270, x2: 203, y2: 280 };
          assert.equal(attrs(arrow[0]).d, mode === 'desktop' ? 'M496 251V231 M492 236L496 231L500 236' : 'M203 275H183 M187 271L183 275L187 279');
          assert.equal(nodes.filter(node => node.tagName === 'rect' && hasClass(node, 'planned')).length, 1);
          for (const label of labels) assert.ok(!overlaps(label, corridor), `${mode}: ${label.text} crosses the compliance reporting arrow`);
        }
      }
    }
  });
}
