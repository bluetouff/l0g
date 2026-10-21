import { OG, h } from './og-kit.mjs';

const artWidth = 344;
const artHeight = 320;

function svgImage(source) {
  return {
    type: 'img',
    props: {
      src: `data:image/svg+xml;base64,${Buffer.from(source).toString('base64')}`,
      width: artWidth,
      height: artHeight,
      style: { position: 'absolute', left: 0, top: 0 },
    },
  };
}

function schematic(motif, accent) {
  const teal = OG.teal;
  const rose = OG.rose;
  const amber = OG.amber;
  const muted = '#343d43';
  const surface = '#11171a';
  const node = (x, y, color, radius = 7) => `<circle cx="${x}" cy="${y}" r="${radius + 9}" fill="${surface}"/><circle cx="${x}" cy="${y}" r="${radius}" fill="${OG.ink}" stroke="${color}" stroke-width="2"/><circle cx="${x}" cy="${y}" r="2" fill="${color}"/>`;
  let drawing;

  if (motif === 'reference') {
    drawing = `
      <path d="M55 63L168 80L281 63V253L168 273L55 253Z" fill="${surface}" stroke="${muted}" stroke-width="1.5"/>
      <path d="M168 80V273M70 51L168 67L266 51V239L168 257L70 239Z" fill="${OG.ink}" stroke="${accent}" stroke-opacity=".65" stroke-width="1.5"/>
      <path d="M168 67V257" fill="none" stroke="${accent}" stroke-opacity=".65" stroke-width="1.5"/>
      <path d="M91 96L143 104M91 116L143 124M91 136L143 144M192 104L245 96M192 124L245 116M192 144L245 136M91 185L143 193M192 193L245 185" fill="none" stroke="${muted}" stroke-width="3" stroke-linecap="round"/>
      <path d="M116 177V158H216V177" fill="none" stroke="${accent}" stroke-width="1.5"/>
      ${node(116, 177, teal)}${node(216, 177, rose)}
      <path d="M22 286H144M192 286H322" stroke="${muted}" stroke-width="1"/>
      ${node(168, 286, amber, 5)}
    `;
  } else if (motif === 'tools') {
    drawing = `
      <rect x="20" y="43" width="304" height="231" rx="17" fill="${surface}" stroke="${muted}" stroke-width="1.5"/>
      <path d="M47 103H297M47 159H297M47 215H297" stroke="${muted}" stroke-width="2" stroke-linecap="round"/>
      <path d="M47 103H206" stroke="${teal}" stroke-width="2" stroke-linecap="round"/>
      <path d="M47 159H112" stroke="${rose}" stroke-width="2" stroke-linecap="round"/>
      <path d="M47 215H253" stroke="${amber}" stroke-width="2" stroke-linecap="round"/>
      ${node(206, 103, teal, 11)}${node(112, 159, rose, 11)}${node(253, 215, amber, 11)}
      <path d="M47 87V119M297 87V119M47 143V175M297 143V175M47 199V231M297 199V231" stroke="${muted}" stroke-width="1.5"/>
      <path d="M87 288H257" stroke="${muted}" stroke-width="1"/>
      <path d="M150 288H194" stroke="${accent}" stroke-width="2"/>
    `;
  } else if (motif === 'data') {
    drawing = `
      <path d="M77 88H171V157H264M77 242H171V157" fill="none" stroke="${muted}" stroke-width="2"/>
      <path d="M77 88H171V157" fill="none" stroke="${accent}" stroke-width="1.5"/>
      <rect x="25" y="53" width="104" height="70" rx="10" fill="${surface}" stroke="${teal}" stroke-opacity=".65" stroke-width="1.5"/>
      <rect x="212" y="122" width="104" height="70" rx="10" fill="${surface}" stroke="${rose}" stroke-opacity=".65" stroke-width="1.5"/>
      <rect x="25" y="207" width="104" height="70" rx="10" fill="${surface}" stroke="${amber}" stroke-opacity=".65" stroke-width="1.5"/>
      <path d="M45 77H78M45 95H108M232 146H265M232 164H295M45 231H78M45 249H108" stroke="${muted}" stroke-width="3" stroke-linecap="round"/>
      ${node(171, 157, accent, 7)}
      <path d="M171 208V274H296" fill="none" stroke="${muted}" stroke-width="1.5" stroke-dasharray="4 7"/>
      ${node(296, 274, accent, 5)}
    `;
  } else {
    drawing = `
      <circle cx="172" cy="157" r="105" fill="none" stroke="${muted}" stroke-width="1"/>
      <ellipse cx="172" cy="157" rx="150" ry="74" transform="rotate(-34 172 157)" fill="none" stroke="${muted}" stroke-width="1"/>
      <path d="M73 87C138 39 240 58 270 145C289 205 208 275 124 251" fill="none" stroke="${teal}" stroke-opacity=".68" stroke-width="2"/>
      <path d="M73 87C95 180 176 210 270 145" fill="none" stroke="${teal}" stroke-opacity=".32" stroke-width="1.5"/>
      <path d="M270 145C210 129 161 178 124 251" fill="none" stroke="${rose}" stroke-opacity=".5" stroke-width="1.5"/>
      <path d="M124 251C122 193 123 145 73 87" fill="none" stroke="${amber}" stroke-opacity=".5" stroke-width="1.5"/>
      <circle cx="172" cy="157" r="32" fill="${surface}" stroke="${teal}" stroke-opacity=".35" stroke-width="1.5"/>
      <path d="M160 157H184M172 145V169" stroke="${teal}" stroke-opacity=".7" stroke-width="1.5" stroke-linecap="round"/>
      ${node(73, 87, teal, 10)}${node(270, 145, rose, 10)}${node(124, 251, amber, 10)}
      <circle cx="218" cy="64" r="3" fill="${teal}"/>
      <circle cx="227" cy="225" r="3" fill="${rose}"/>
      <circle cx="93" cy="180" r="3" fill="${amber}"/>
    `;
  }

  return svgImage(`<svg xmlns="http://www.w3.org/2000/svg" width="${artWidth}" height="${artHeight}" viewBox="0 0 ${artWidth} ${artHeight}">${drawing}</svg>`);
}

function tag(label, style, color) {
  return h('div', {
    position: 'absolute',
    display: 'flex',
    color,
    fontSize: '13px',
    lineHeight: 1,
    letterSpacing: '1.4px',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    ...style,
  }, label);
}

function diagram(card, accent) {
  const tagPositions = card.motif === 'network'
    ? [{ left: 15, top: 24 }, { right: 0, top: 183 }, { left: 22, top: 293 }]
    : card.motif === 'reference'
      ? [{ left: 70, top: 17 }, { right: 0, top: 293 }, { left: 0, top: 293 }]
      : card.motif === 'data'
        ? [{ left: 24, top: 24 }, { right: 0, top: 92 }, { left: 24, top: 293 }]
        : [{ left: 20, top: 13 }, { right: 20, top: 13 }, { left: 0, right: 0, top: 302, justifyContent: 'center' }];
  return h('div', {
    position: 'absolute', left: '792px', top: '172px',
    width: `${artWidth}px`, height: `${artHeight}px`, display: 'flex',
  }, schematic(card.motif, accent),
  ...card.tags.map((label, index) => tag(label, tagPositions[index], [OG.teal, OG.rose, OG.amber][index])));
}

// All copy comes from the controlled English page configuration. The schematic
// communicates relationships only; it does not encode quantities or observations.
export function englishPageCard(card) {
  const accent = OG[card.accent] ?? OG.teal;
  const titleSize = card.titleLines.length > 2 ? 61 : 64;
  return h('div', {
    position: 'relative',
    width: `${OG.width}px`, height: `${OG.height}px`,
    display: 'flex', overflow: 'hidden',
    backgroundColor: OG.ink,
    backgroundImage: `radial-gradient(580px 500px at 1000px 270px, ${accent}0a, transparent 75%)`,
    color: OG.bright, fontFamily: 'JetBrains Mono',
  },
  h('div', {
    position: 'absolute', left: '64px', right: '64px', top: '46px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  },
  h('div', { display: 'flex', alignItems: 'baseline', fontSize: '42px', fontWeight: 700, letterSpacing: '-3px' },
    'l', h('span', { color: OG.teal }, '0'), 'g', h('span', { color: OG.rose, marginLeft: '3px' }, '_')),
  h('div', { display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', letterSpacing: '2px', color: '#b7bec5' },
    h('span', { width: '5px', height: '5px', borderRadius: '50%', backgroundColor: OG.teal }), 'ENGLISH EDITION')),
  h('div', {
    position: 'absolute', left: '64px', top: '148px', width: '650px',
    display: 'flex', alignItems: 'center', color: accent, fontSize: '14px', letterSpacing: '2.4px',
  },
  h('span', { width: '28px', height: '2px', marginRight: '13px', backgroundColor: accent }), card.label),
  h('div', {
    position: 'absolute', left: '60px', top: '190px', width: '654px',
    display: 'flex', flexDirection: 'column',
  },
  ...card.titleLines.map((line, index) => h('div', {
    display: 'flex',
    fontSize: `${titleSize}px`, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-2.2px',
    color: index === card.titleLines.length - 1 ? accent : OG.bright,
    whiteSpace: 'nowrap',
  }, line)),
  h('div', {
    display: 'flex', flexDirection: 'column', marginTop: card.titleLines.length > 2 ? '22px' : '26px',
    paddingLeft: '4px', color: '#b7bec5', fontSize: '22px', lineHeight: 1.5,
  }, ...card.subtitleLines.map((line) => h('div', { display: 'flex', whiteSpace: 'nowrap' }, line)))),
  diagram(card, accent),
  h('div', {
    position: 'absolute', left: '64px', right: '64px', bottom: '112px',
    height: '1px', backgroundColor: '#2b3035',
  }),
  h('div', {
    position: 'absolute', left: '64px', right: '64px', bottom: '60px',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    fontSize: '16px', lineHeight: 1.2,
  },
  h('div', { display: 'flex', color: '#b7bec5' }, `l0g.fr${card.path}`),
  h('div', { display: 'flex', alignItems: 'center', color: '#b7bec5', fontSize: '14px', letterSpacing: '.3px' }, 'PRIMARY SOURCES / OPEN ACCESS')));
}
