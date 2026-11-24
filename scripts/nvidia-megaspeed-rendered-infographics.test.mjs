import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import opentype from '@shuding/opentype.js';
import { parse, serializeOuter } from 'parse5';
import { XMLValidator } from 'fast-xml-parser';

const pages = {
  fr: 'posts/nvidia-megaspeed-centres-de-donnees',
  en: 'en/analysis/nvidia-megaspeed-data-center-controls',
};
const sourceIds = {
  timeline: ['S11', 'S13', 'S15', 'S18', 'S20', 'S21', 'S26', 'S01'],
  controls: ['S01', 'S02', 'S03', 'S04'],
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
  test(`Nvidia XXV ${lang} scenes retain accessible geometry and the distinct timelines and scopes`, () => {
    const dom = walk(parse(readFileSync(new URL(`../dist/${route}/index.html`, import.meta.url), 'utf8')));
    const figures = dom.filter(node => node.tagName === 'figure' && hasClass(node, 'nvidia-megaspeed-figure'));
    assert.equal(figures.length, 2);
    const ids = dom.map(node => attrs(node).id).filter(Boolean);
    for (const [index, name] of ['controls', 'timeline'].entries()) {
      const figure = figures[index];
      const stem = `nv25-${name}-${lang}`;
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
        assert.ok(height <= 345);
        const nodes = walk(svg);
        const labels = nodes.filter(node => node.tagName === 'text').map(box);
        for (const [i, label] of labels.entries()) {
          assert.ok(label.x1 >= 5 && label.x2 <= width - 5 && label.y1 >= 5 && label.y2 <= height - 5, `${mode}: ${label.text} escapes the safety margins`);
          for (const other of labels.slice(i + 1)) assert.ok(!overlaps(label, other), `${mode}: ${label.text} crosses ${other.text}`);
        }
        if (name === 'timeline') {
          const years = nodes.filter(node => node.tagName === 'g' && attrs(node)['data-year']);
          assert.deepEqual(years.map(node => attrs(node)['data-year']), ['2025', '2026']);
          const groups = years.map(year => walk(year).filter(node => node.tagName === 'g' && attrs(node)['data-kind']));
          assert.deepEqual(groups.map(rows => rows.map(row => attrs(row)['data-kind'])), [
            ['trade', 'public', 'public', 'trade', 'public'],
            ['public', 'disputed', 'trade', 'public', 'public'],
          ]);
          assert.equal(nodes.filter(node => node.tagName === 'path' && hasClass(node, 'connector')).length, 0);
          for (const [index, group] of groups.entries()) {
            for (const row of group) {
              const text = walk(row).filter(node => node.tagName === 'text').map(box);
              if (mode === 'desktop') for (const label of text) assert.ok(index ? label.x1 >= 316 : label.x2 <= 295, label.text);
            }
          }
        } else {
          const branches = nodes.filter(node => node.tagName === 'g' && attrs(node)['data-jurisdiction']);
          assert.deepEqual(branches.map(branch => attrs(branch)['data-jurisdiction']), ['us', 'my', 'sg']);
          const connectors = nodes.filter(node => node.tagName === 'path' && hasClass(node, 'connector'));
          assert.equal(connectors.length, 3);
          for (const [index, branch] of branches.entries()) {
            const connector = connectors[index];
            assert.equal(connector.parentNode, branch, 'A connector stays inside its own jurisdiction');
            assert.equal(hasClass(connector, 'planned'), index === 1, 'Only the announced advisory uses a dashed arrow');
            const text = walk(branch).filter(node => node.tagName === 'text').map(box);
            const offset = translation(connector);
            const corridor = mode === 'desktop'
              ? { x1: offset.x - 5, x2: offset.x + 5, y1: offset.y + 193, y2: offset.y + 216 }
              : { x1: 137, x2: 159, y1: offset.y + 71, y2: offset.y + 81 };
            for (const label of text) assert.ok(!overlaps(label, corridor), `${mode}: ${label.text} crosses a connector`);
          }
        }
      }
    }
  });
}
