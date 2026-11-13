import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { XMLValidator } from 'fast-xml-parser';
import opentype from '@shuding/opentype.js';

const component = readFileSync(new URL('../src/components/infographics/NvidiaGuarantees2026.astro', import.meta.url), 'utf8');
const marker = 'const art = ';
const start = component.indexOf(marker), end = component.indexOf(' as const;', start);
assert.ok(start >= 0 && end > start);
const art = JSON.parse(component.slice(start + marker.length, end));
const fontBytes = readFileSync(new URL('../public/fonts/ukraine-reparations/liberation-sans-400.ttf', import.meta.url));
const font = opentype.parse(fontBytes.buffer.slice(fontBytes.byteOffset, fontBytes.byteOffset + fontBytes.byteLength));
const textEntities = Object.freeze({ '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': "'" });
const decode = s => s.replace(/&(?:amp|lt|gt|quot|#x27);/gu, entity => textEntities[entity]);
test('text entities are decoded once before font measurement', () => {
  assert.equal(decode('&amp;lt;script&amp;gt;'), '&lt;script&gt;');
  assert.equal(decode('&amp;#x27;'), '&#x27;');
  assert.equal(decode('&amp;lt;&lt;'), '&lt;<');
  assert.equal(decode('R&amp;D &lt;GPU&gt; &quot;cap&quot; &#x27;value&#x27;'), 'R&D <GPU> "cap" \'value\'');
  assert.equal(decode('GPU · 25 %'), 'GPU · 25 %');
});
const attrs = source => Object.fromEntries([...source.matchAll(/([\w:-]+)="([^"]*)"/gu)].map(m => [m[1], m[2]]));
const overlap = (a,b) => Math.min(a.x2,b.x2)-Math.max(a.x1,b.x1)>1 && Math.min(a.y2,b.y2)-Math.max(a.y1,b.y1)>1;
const zones = (kind,mobile) => kind === 'financing' ? mobile ? {
  header:[11,8,309,60], lender:[8,121,77,146], vehicle:[123,121,197,146], customer:[241,121,315,146],
  loan:[75,62,128,84], lease:[189,62,247,84], rent:[186,165,273,188], service:[43,165,138,188], failure:[11,204,309,231],
  recovery:[63,235,157,283], shortfall:[200,236,309,283], support:[61,319,150,384], residual:[212,319,311,385],
} : {
  header:[16,8,784,65], lender:[26,135,146,163], vehicle:[280,135,520,163], customer:[644,135,776,163],
  loan:[160,69,310,95], lease:[460,69,650,95], rent:[472,183,638,211], service:[125,183,345,211], failure:[18,234,781,262],
  recovery:[109,271,242,322], shortfall:[304,271,444,322], support:[560,248,780,299], residual:[560,321,780,371],
} : mobile ? {
  header:[11,8,309,60], 'sg-title':[11,71,309,97], seller:[59,105,147,151], buyers:[200,104,309,151], purchase:[11,156,309,181],
  'sg-period':[11,179,309,202], charges:[11,201,309,224], 'my-title':[11,240,309,266], parent:[11,271,104,296],
  subsidiary:[169,271,309,296], ownership:[88,292,169,316], imports:[63,323,205,349], review:[63,345,205,389], destination:[269,364,291,388],
} : {
  header:[16,8,784,65], 'sg-title':[18,72,782,100], seller:[99,115,242,166], buyers:[474,115,690,166], purchase:[253,101,451,175],
  'sg-period':[18,181,401,207], charges:[401,181,782,207], 'my-title':[18,237,782,264], parent:[19,279,166,330],
  subsidiary:[314,274,467,325], review:[559,273,782,323], footer:[18,349,782,377],
};

for (const lang of ['fr','en']) for (const kind of ['financing','asia']) for (const mode of ['desktop','mobile']) {
  const svg = art[lang][kind][mode], mobile = mode === 'mobile', width = mobile ? 320 : 800;
  test(`${lang} ${kind} ${mode}: safe XML and accessible identity`, () => {
    assert.equal(XMLValidator.validate(svg), true);
    assert.doesNotMatch(svg, /<!DOCTYPE|<!ENTITY|<foreignObject|<script|\bon\w+=|\b(?:href|src)=|url\(/iu);
    assert.match(svg, new RegExp(`viewBox="0 0 ${width} 400"`));
    assert.match(svg, /width="100%" style="height:auto"/u);
    const ids = [...svg.matchAll(/\bid="([^"]+)"/gu)].map(m => m[1]);
    assert.equal(ids.length, 2); assert.equal(new Set(ids).size, 2);
    for (const id of ids) assert.equal(svg.split(id).length - 1, 2);
    assert.match(svg, /font-weight="400"/u); assert.doesNotMatch(svg, /font-weight="(?:[5-9]\d\d|bold)"/u);
    assert.doesNotMatch(svg, /—/u);
  });
  test(`${lang} ${kind} ${mode}: regular labels stay in their intended zones`, () => {
    const boxes=[];
    for (const match of svg.matchAll(/<text ([^>]+)>([^<]*)<\/text>/gu)) {
      const a = attrs(match[1]), s=decode(match[2]), size=Number(a['font-size']);
      const advance = font.getAdvanceWidth(s,size,{kerning:true});
      const x=Number(a.x)-(a['text-anchor']==='middle'?advance/2:a['text-anchor']==='end'?advance:0);
      const b={value:s,x1:x,x2:x+advance,y1:Number(a.y)-font.ascender*size/font.unitsPerEm,y2:Number(a.y)-font.descender*size/font.unitsPerEm};
      const z=zones(kind,mobile)[a['data-zone']]; assert.ok(z,`Missing zone ${a['data-zone']}`);
      assert.ok(b.x1>=z[0]&&b.y1>=z[1]&&b.x2<=z[2]&&b.y2<=z[3],`${s}: ${JSON.stringify(b)} outside ${JSON.stringify(z)}`);
      const effective = size*(mobile?280/320:600/800);
      assert.ok(effective>=11.5&&effective<=17,`${s}: ${effective}px`);
      for (const c of s) assert.notEqual(font.charToGlyphIndex(c),0,`Missing glyph ${c}`);
      boxes.push(b);
    }
    for(let i=0;i<boxes.length;i++)for(let j=i+1;j<boxes.length;j++)assert.ok(!overlap(boxes[i],boxes[j]),`${boxes[i].value} overlaps ${boxes[j].value}`);
    const height=400*(mobile?288/320:600/800); assert.ok(height<=360);
  });
  test(`${lang} ${kind} ${mode}: financial and legal scopes remain distinct`, () => {
    if (kind==='financing') {
      for(const relation of ['lending-to-vehicle','leased-compute','rent-payments','debt-service','asset-recovery','shortfall-allocation'])assert.match(svg,new RegExp(`data-relationship="${relation}"`));
      assert.doesNotMatch(svg,/25\s*%|first.loss|première perte/iu);
      assert.match(svg,/Nvidia/u); assert.match(svg, /cap|plafond/u);
    } else {
      for(const relation of ['aperia-to-buyers','parent-subsidiary','possible-reexport'])assert.match(svg,new RegExp(`data-relationship="${relation}"`));
      assert.match(svg,/917/u); assert.match(svg,/41 transactions/u); assert.match(svg,/Superphi/u); assert.match(svg,/Speedmatrix/u);
      assert.doesNotMatch(svg,/data-relationship="(?:aperia-to-megaspeed|aperia-to-speedmatrix)"/u);
    }
  });
}

test('responsive contract retains compact figures and caption spacing',()=>{
  assert.match(component,/max-width:37\.5rem/u); assert.match(component,/max-width:18rem/u);
  assert.match(component,/@container\(max-width:568px\)/u); assert.match(component,/padding-bottom:1rem/u);
  assert.match(component,/padding-bottom:\.35rem/u); assert.match(component,/font-weight:400/u);
});
