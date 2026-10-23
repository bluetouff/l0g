import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import test from 'node:test';
import { parse, parseFragment, serializeOuter } from 'parse5';
import { XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';
import sharp from 'sharp';
import postcss from 'postcss';
import { jlrNumber } from './jlr-svg-assertions.mjs';
import { treasuryBuybackExample as example } from '../src/config/treasury-buyback-reference.ts';

// The SVG runner uses the repository cwd; a validated build can also be checked
// by invoking this suite from that build's repository, without a new build.
const output = resolve(process.cwd(), 'dist');
const nodes = node => [node, ...(node.childNodes ?? []).flatMap(nodes)];
const attr = (node, name) => node.attrs?.find(item => item.name === name)?.value;
const has = (node, name) => (attr(node, 'class') ?? '').split(/\s+/u).includes(name);
const text = node => node.nodeName === '#text' ? node.value : (node.childNodes ?? []).map(text).join('');
const pages = ['fr', 'en'].map(lang => {
  const route = lang === 'fr' ? 'glossaire/treasury-buyback' : 'en/glossary/treasury-buyback';
  const html = readFileSync(resolve(output, route, 'index.html'), 'utf8');
  const tree = parse(html);
  const figure = nodes(tree).filter(node => node.tagName === 'figure' && has(node, 'buyback-mechanism'));
  assert.equal(figure.length, 1, `${lang}: one mechanism figure`);
  const css = [...nodes(tree).filter(node => node.tagName === 'link' && attr(node, 'rel') === 'stylesheet')
    .map(node => readFileSync(resolve(output, attr(node, 'href').replace(/^\//u, '')), 'utf8')),
    ...nodes(tree).filter(node => node.tagName === 'style').map(text)].join('\n');
  return { lang, figure: figure[0], css, svgs: nodes(figure[0]).filter(node => node.tagName === 'svg').map(serializeOuter) };
});

// Exact, versioned fallback-font metrics, following existing SVG suites. Browser
// QA covers Inter's native metrics; this CI check does not claim to emulate them.
const bytes = readFileSync(new URL('../public/fonts/stablecoins/dejavu-sans-400.ttf', import.meta.url));
const font = opentype.parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
const palette = { surface:'#121419', paper:'#e7e9ee', 'line-strong':'#373941', signal:'#5eead4', amber:'#f5b13d', muted:'#8b909b' };
const inherited = (node, name) => attr(node, name) ?? (node.parentNode ? inherited(node.parentNode, name) : undefined);
const inside = (box, panel, padding = 0) => box.left >= panel.left + padding && box.top >= panel.top + padding && box.right <= panel.right - padding && box.bottom <= panel.bottom - padding;

function inspect(svg, variant) {
  assert.equal(XMLValidator.validate(svg), true);
  const root = parseFragment(svg).childNodes.find(node => node.tagName === 'svg');
  assert(root);
  const expected = variant === 0 ? '0 0 720 300' : '0 0 360 370';
  assert.equal(attr(root, 'viewBox'), expected);
  assert.equal(attr(root, 'style'), 'width:100%;height:auto');
  assert.equal(attr(root, 'class'), variant === 0 ? 'wide' : 'narrow');
  assert.equal(attr(root, 'role'), 'img');
  const all = nodes(root);
  const labels = (attr(root, 'aria-labelledby') ?? '').split(' ');
  assert.equal(labels.length, 2);
  for (const [index, id] of labels.entries()) {
    const found = all.filter(node => attr(node, 'id') === id);
    assert.equal(found.length, 1);
    assert.equal(found[0].tagName, index === 0 ? 'title' : 'desc');
    assert(text(found[0]).trim());
  }
  for (const node of all.filter(node => node.tagName)) {
    assert(['svg', 'title', 'desc', 'g', 'rect', 'path', 'text'].includes(node.tagName));
    for (const item of node.attrs ?? []) {
      assert.doesNotMatch(item.name, /^on/iu);
      if (item.name !== 'xmlns') assert.doesNotMatch(item.value, /(?:javascript:|https?:|data:|url\()/iu, 'Passive local geometry');
    }
  }
  const numeric = all.filter(node => node.tagName === 'text').flatMap(node => text(node).match(/\d+/gu) ?? []).map(Number).sort((a,b) => a-b);
  assert.deepEqual(numeric, [example.accruedInterest, example.cleanPayment, example.settlementPayment, example.acceptedPar, example.acceptedPar].sort((a,b) => a-b));
  return { root, all, width: variant === 0 ? 720 : 360, height: variant === 0 ? 300 : 370 };
}

async function geometry(svg, variant) {
  const { root, all, width, height } = inspect(svg, variant);
  const panels = all.filter(node => node.tagName === 'rect').map(node => {
    const left = jlrNumber(attr(node, 'x')), top = jlrNumber(attr(node, 'y'));
    return { left, top, right:left+jlrNumber(attr(node,'width')), bottom:top+jlrNumber(attr(node,'height')) };
  });
  const canvas = {left:0, top:0, right:width, bottom:height};
  for (const panel of panels) assert(inside(panel, canvas), 'Panel inside viewBox');
  const boxes = [];
  for (const node of all.filter(node => node.tagName === 'text')) {
    const label = text(node), size = jlrNumber(inherited(node, 'font-size'));
    assert(size >= 16 && size <= 21, `Readable label: ${label}`);
    for (const glyph of label) assert(font.charToGlyphIndex(glyph) > 0, `Known glyph: ${glyph}`);
    const advance = font.getAdvanceWidth(label, size, {kerning:true});
    const anchor = inherited(node, 'text-anchor');
    const x = jlrNumber(attr(node,'x')) - (anchor === 'middle' ? advance/2 : anchor === 'end' ? advance : 0);
    const y = jlrNumber(attr(node,'y'));
    const box = {left:Infinity, top:Infinity, right:-Infinity, bottom:-Infinity, label};
    const scale = size/font.unitsPerEm;
    font.forEachGlyph(label,x,y,size,{kerning:true},(glyph,gx,gy)=>{
      if(!Number.isFinite(glyph.xMin)||glyph.xMin===glyph.xMax&&glyph.yMin===glyph.yMax)return;
      box.left=Math.min(box.left,gx+glyph.xMin*scale);box.right=Math.max(box.right,gx+glyph.xMax*scale);
      box.top=Math.min(box.top,gy-glyph.yMax*scale);box.bottom=Math.max(box.bottom,gy-glyph.yMin*scale);
    });
    assert(inside(box, canvas, 2), `Text inside viewBox: ${label}`);
    const panel = panels.find(item => jlrNumber(attr(node,'x')) > item.left && jlrNumber(attr(node,'x')) < item.right && y > item.top && y < item.bottom);
    if (panel) assert(inside(box, panel, 2), `Text inside its panel: ${label}`);
    for (const previous of boxes) assert(!(box.left < previous.right && box.right > previous.left && box.top < previous.bottom && box.bottom > previous.top), `Labels overlap: ${label} / ${previous.label}`);
    boxes.push(box);
  }
  // Rasterise the actual SVG paths, including relative commands and arrow tips;
  // no custom path grammar or clipped viewBox can hide painted overflow.
  for (const node of all.filter(node => node.tagName === 'text')) node.childNodes = [];
  root.attrs = root.attrs.filter(item => item.name !== 'style');
  root.attrs.find(item => item.name === 'viewBox').value = `-32 -32 ${width+64} ${height+64}`;
  root.attrs.push({name:'width',value:String(width+64)},{name:'height',value:String(height+64)});
  const padded = serializeOuter(root).replace(/var\(--color-([\w-]+)\)/gu, (_, role) => {assert(palette[role]);return palette[role];});
  const {data,info} = await sharp(Buffer.from(padded)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
  for(let y=0;y<info.height;y++) for(let x=0;x<info.width;x++) {
    if(x>=32&&x<width+32&&y>=32&&y<height+32) continue;
    assert.equal(data[(y*info.width+x)*info.channels+3],0,`Paint outside viewBox: ${x},${y}`);
  }
}

test('Treasury FR/EN renders accessible, responsive paired mechanisms with the fictional amounts', async () => {
  for(const page of pages) {
    assert.equal(page.svgs.length,2);
    const ids=nodes(page.figure).map(node=>attr(node,'id')).filter(Boolean);
    assert.equal(ids.length,new Set(ids).size);
    assert.match(text(page.figure),page.lang==='fr'?/EXEMPLE FICTIF/u:/FICTIONAL EXAMPLE/u);
    assert(nodes(page.figure).some(node=>node.tagName==='a'&&attr(node,'href')==='https://www.ecfr.gov/current/title-31/subtitle-B/chapter-II/subchapter-A/part-375'));
    const rules=[];
    postcss.parse(page.css).walkRules(rule=>rules.push(rule));
    const mobileQueries=new Set(['(max-width:600px)','(width<=600px)']);
    const display=(selector,value,mobile)=>rules.some(rule=>rule.selector.includes(selector)&&Boolean(rule.parent.type==='atrule'&&rule.parent.name==='media'&&mobileQueries.has(rule.parent.params.replace(/\s/gu,'')))===mobile&&rule.nodes.some(node=>node.prop==='display'&&node.value===value));
    assert(display('.narrow','none',false));
    assert(display('.narrow','block',true));
    assert(display('.wide','none',true));
    assert(page.css.includes('font-family:var(--font-read)'));
    for(const [variant,svg] of page.svgs.entries()) await geometry(svg,variant);
  }
});

test('rendered amount, text bounds and painted overflow regressions are rejected', async () => {
  const svg=pages[0].svgs[0];
  assert.throws(()=>inspect(svg.replace('100 M$','101 M$'),0));
  await assert.rejects(geometry(svg.replace('x="90" y="113"','x="710" y="113"'),0),/Text inside/);
  await assert.rejects(geometry(svg.replace('M176 90H544M536 84l8 6-8 6','M176 90H744'),0),/Paint outside viewBox/);
});
