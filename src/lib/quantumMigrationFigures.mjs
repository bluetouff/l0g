// All SVG content is controlled here. Article prose and source references are
// escaped by Astro in QuantumMigrationFigure, never interpolated into this SVG.
// Native dark-theme fallbacks keep exported standalone SVGs usable. The same
// semantic variables pick up the live site's light palette when embedded.
const native = { ink:'#0c0d10',surface:'#121419','surface-2':'#171a20',paper:'#e7e9ee',muted:'#8b909b','line-strong':'rgba(255, 255, 255, 0.20)',signal:'#5eead4',amber:'#f5b13d',accent:'#ff4d87' };
const C = Object.fromEntries(Object.entries(native).map(([role,value])=>[role,`var(--color-${role}, ${value})`]));
const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const text = (x, y, value, size = 20, color = C.paper, weight = 400, anchor = 'start') => `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" fill="${color}" text-anchor="${anchor}">${escape(value)}</text>`;
const rect = (x, y, width, height, fill = C.surface, radius = 0, stroke = 'none', strokeWidth = 1) => `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}"/>`;
const line = (x1, y1, x2, y2, color = C['line-strong'], width = 2, dash = '') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const circle = (x, y, radius, fill = C.surface, stroke = 'none', width = 1) => `<circle cx="${x}" cy="${y}" r="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${width}"/>`;
const path = (d, color, width = 2, fill = 'none', dash = '') => `<path d="${d}" fill="${fill}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`;
const region = (name, x, y, width, height, body) => `<g data-region="${name}" data-bounds="${x} ${y} ${width} ${height}">${body}</g>`;
const labels = (name, x, y, width, height, lines, size = 20, color = C.paper, anchor = 'start', weight = 400, gap = size + 8) => region(name, x, y, width, height, lines.map((label, i) => label ? text(anchor === 'middle' ? x + width / 2 : x + 8, y + size + 8 + i * gap, label, size, color, weight, anchor) : '').join(''));
function arrow(x1, y1, x2, y2, color = C.signal, dash = '') {
  const angle = Math.atan2(y2 - y1, x2 - x1), length = 8, spread = 4;
  const bx = x2 - Math.cos(angle) * length, by = y2 - Math.sin(angle) * length;
  return line(x1, y1, x2, y2, color, 2, dash) + path(`M${bx - Math.sin(angle) * spread} ${by + Math.cos(angle) * spread} L${x2} ${y2} L${bx + Math.sin(angle) * spread} ${by - Math.cos(angle) * spread}`, color, 2);
}
function key(x, y, size, color) {
  const r = size * .19;
  return circle(x - size * .23, y, r, 'none', color, 3)
    + line(x - size * .04, y, x + size * .4, y, color, 3)
    + line(x + size * .2, y, x + size * .2, y + size * .13, color, 3)
    + line(x + size * .36, y, x + size * .36, y + size * .13, color, 3);
}
function lock(x, y, size, color) {
  const a = size * .23;
  return path(`M${x-a} ${y-size*.05} L${x-a} ${y-size*.22} C${x-a} ${y-size*.53} ${x+a} ${y-size*.53} ${x+a} ${y-size*.22} L${x+a} ${y-size*.05}`, color, 3)
    + rect(x-size*.34, y-size*.04, size*.68, size*.45, C.surface, 6, color, 2)
    + circle(x, y+size*.15, size*.05, color);
}
function quantum(x, y, size) {
  const r = size * .34;
  let body = circle(x, y, r + 9, C.surface, C.amber, 2) + circle(x, y, r, 'none', C['line-strong'], 1);
  const nodes = [[x-r*.75,y-r*.5],[x+r*.65,y-r*.55],[x-r*.1,y+r*.77]];
  nodes.forEach(([nx,ny], i) => { const [tx,ty]=nodes[(i+1)%nodes.length]; body += line(nx,ny,tx,ty,C.amber,2); });
  for (const [nx,ny] of nodes) body += circle(nx,ny,size*.065,C.amber);
  return body + circle(x,y,size*.09,C.ink,C.amber,2);
}
function signature(x, y, size, color) {
  return rect(x-size*.42,y-size*.35,size*.84,size*.7,C.surface,6,C['line-strong'],2)
    + path(`M${x-size*.29} ${y+size*.1} C${x-size*.16} ${y-size*.2} ${x-size*.05} ${y+size*.28} ${x+size*.03} ${y-size*.09} C${x+size*.13} ${y-size*.3} ${x+size*.1} ${y+size*.25} ${x+size*.3} ${y-size*.02}`,color,3)
    + line(x-size*.28,y+size*.24,x+size*.28,y+size*.24,C['line-strong'],1);
}
function network(x, y, size) {
  const points = [[x,y-size*.3],[x-size*.32,y+size*.24],[x+size*.32,y+size*.24]];
  let body = '';
  points.forEach(([nx,ny],i)=>{const [tx,ty]=points[(i+1)%3];body+=line(nx,ny,tx,ty,C.signal,2);});
  for(const [nx,ny] of points) body+=rect(nx-size*.1,ny-size*.1,size*.2,size*.2,C.surface,4,C.signal,2);
  return body;
}
function coin(x, y, size, color) {
  return circle(x,y,size*.43,C.surface,color,2)+circle(x,y,size*.32,'none',C['line-strong'],1)+lock(x,y,size*.52,color);
}
function shell(id, width, height, title, desc, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" style="width:100%;height:auto" role="img" aria-labelledby="${id}-title ${id}-desc"><title id="${id}-title">${escape(title)}</title><desc id="${id}-desc">${escape(desc)}</desc>${rect(0,0,width,height,C.ink,18)}${body}</svg>`;
}
function heading(mobile, section, title, subtitle) {
  const width = mobile ? 400 : 1000;
  return labels('eyebrow',24,15,width-48,34,[`l0g / ${section}`],mobile?13:15,C.signal,'start',700)
    + labels('heading',24,51,width-48,mobile?78:60,mobile?title:[title.join(' ')],mobile?28:34,C.paper,'start',700,mobile?33:42)
    + labels('subtitle',24,mobile?130:112,width-48,mobile?55:34,mobile?subtitle:[subtitle.join(' ')],mobile?16:18,C.muted,'start',400,mobile?23:26);
}

export const QUANTUM_SIGNATURE_BYTES = Object.freeze({ schnorr: 64, mlDsa44: 2420 });

export function quantumMigrationSvg(lang = 'fr', kind = 'threat', mobile = false) {
  if (!['fr','en'].includes(lang)) throw new RangeError('Unknown quantum figure language');
  if (!['threat','size','migration'].includes(kind)) throw new RangeError('Unknown quantum figure kind');
  if (typeof mobile !== 'boolean') throw new TypeError('Quantum figure mobile flag must be boolean');
  const fr = lang === 'fr', width = mobile ? 400 : 1000;
  const id = `quantum-migration-${kind}-${lang}-${mobile?'mobile':'desktop'}`;
  if (kind === 'threat') {
    const title = fr ? ['La signature devient','l’arme de l’attaquant'] : ['The signature becomes','the attacker’s weapon'];
    const subtitle = fr ? ['Scénario conditionnel : ordinateur quantique','capable de casser la cryptographie de la clé.'] : ['Conditional scenario: a quantum computer','able to break the key’s cryptography.'];
    let body = heading(mobile,fr?'MÉCANISME DE VOL':'THEFT MECHANISM',title,subtitle);
    const centers = mobile ? [[88,240],[312,240],[312,477],[88,477]] : [[145,228],[385,228],[625,228],[865,228]];
    const icons = [key,quantum,signature,network];
    const stages = fr ? [
      ['Clé publique',['Visible dans la sortie','ou lors d’une dépense']],
      ['Calcul quantique',['Retrouve la clé privée','si la machine suffit']],
      ['Signature forgée',['Autorise une dépense','avec la clé récupérée']],
      ['Nœuds du réseau',['Vérifient la validité','de la signature']]
    ] : [
      ['Public key',['Visible in the output','or during a spend']],
      ['Quantum attack',['Finds the private key','if hardware is capable']],
      ['Forged signature',['Authorises a spend','with the recovered key']],
      ['Network nodes',['Check the signature','for validity']]
    ];
    if (mobile) {
      body += arrow(145,240,253,240,C.amber);
      body += line(357,240,390,240,C.amber,2,'4 5') + line(390,240,390,477,C.accent,2,'4 5') + arrow(390,477,359,477,C.accent,'4 5');
      body += arrow(253,477,145,477,C.accent);
    } else {
      for (let i=0;i<3;i++) body += arrow(centers[i][0]+66,228,centers[i+1][0]-66,228,i===0?C.amber:C.accent,i===0?'4 5':'');
    }
    centers.forEach(([x,y],i)=>{
      body += circle(x,y,mobile?45:55,C['surface-2'],C['line-strong'],1);
      body += icons[i](x,y,mobile?74:88,i===0?C.amber:i===2?C.accent:C.signal);
      const bx = mobile ? (x===88?8:224) : x-111, bw = mobile?168:222;
      body += labels(`stage-${i}`,bx,y+(mobile?57:73),bw,40,[stages[i][0]],mobile?17:21,C.paper,'middle',700);
      body += labels(`stage-${i}-detail`,bx,y+(mobile?92:114),bw,mobile?64:69,stages[i][1],mobile?14:17,C.muted,'middle',400,mobile?22:26);
    });
    const by = mobile?634:418;
    body += line(32,by,width-32,by,C['line-strong'],1);
    body += labels('takeaway',24,by+14,width-48,mobile?86:61,fr?(mobile?['Une signature correcte passe le contrôle.','La clé volée permet d’imiter son propriétaire.']:['Une signature correcte passe le contrôle. La clé volée permet d’imiter son propriétaire.']):(mobile?['A valid signature passes verification.','A stolen key can impersonate its owner.']:['A valid signature passes verification. A stolen key can impersonate its owner.']),mobile?16:21,C.paper,'start',400,mobile?25:28);
    return shell(id,width,mobile?748:514,title.join(' '),fr?'Une clé publique exposée peut permettre à un ordinateur quantique suffisamment puissant de retrouver une clé privée. L’attaquant peut alors créer une signature acceptée par les règles classiques. Le schéma n’indique ni date de faisabilité ni vitesse d’attaque.':'An exposed public key may let a sufficiently powerful quantum computer recover its private key. The attacker can then create a signature accepted under classical rules. This diagram specifies neither a feasibility date nor an attack speed.',body);
  }
  if (kind === 'size') {
    const title = fr?['Une signature peut','occuper 37,8 fois plus'] : ['One signature can','take 37.8× the space'];
    const subtitle = fr?['Tailles des primitives : Schnorr BIP 340','et ML-DSA-44 du NIST, à la même échelle.'] : ['Primitive sizes: BIP 340 Schnorr','and NIST ML-DSA-44, on the same scale.'];
    let body=heading(mobile,fr?'LE POIDS DES OCTETS':'THE WEIGHT OF BYTES',title,subtitle);
    const left=32,right=width-32,full=right-left,top=mobile?225:198,second=mobile?351:311;
    const unit=fr?'octets':'bytes',first=QUANTUM_SIGNATURE_BYTES.schnorr,other=QUANTUM_SIGNATURE_BYTES.mlDsa44;
    body+=labels('classical-label',24,top-48,width-48,42,['Schnorr · BIP 340'],mobile?19:23,C.paper,'start',700);
    body+=rect(left,top,full,34,C['surface-2'],4);
    body+=`<g data-bar="schnorr">${rect(left,top,full*first/other,34,C.signal,0)}</g>`;
    body+=labels('classical-value',mobile?70:82,top-7,mobile?200:480,43,[`64 ${unit}`],mobile?22:27,C.signal,'start',700);
    body+=labels('pq-label',24,second-48,width-48,42,['ML-DSA-44 · NIST'],mobile?19:23,C.paper,'start',700);
    body+=`<g data-bar="ml-dsa-44">${rect(left,second,full,34,C.amber,0)}</g>`;
    body+=labels('pq-value',24,second+44,width-48,51,[`${fr?'2 420':'2,420'} ${unit}`],mobile?27:31,C.amber,'start',700);
    const scaleY=second+108;
    body+=line(left,scaleY,right,scaleY,C['line-strong'],1);
    const ticks=mobile?[0,1200,2420]:[0,600,1200,1800,2420];
    ticks.forEach((v,i)=>{const x=left+full*v/other;body+=line(x,scaleY-5,x,scaleY+5,C['line-strong'],1);body+=region(`axis-${i}`,i===0?24:i===ticks.length-1?right-74:x-34,scaleY+7,i===0?74:i===ticks.length-1?82:68,35,text(x,scaleY+28,new Intl.NumberFormat(fr?'fr-FR':'en-GB').format(v),mobile?14:16,C.muted,400,i===0?'start':i===ticks.length-1?'end':'middle'));});
    const footer=mobile?528:499;
    body+=line(left,footer,right,footer,C['line-strong'],1);
    body+=labels('ratio',24,footer+12,width-48,mobile?54:48,[fr?'× 37,8125 · +2 356 octets':'× 37.8125 · +2,356 bytes'],mobile?23:27,C.paper,'start',700);
    body+=labels('scope',24,footer+66,width-48,mobile?90:62,fr?(mobile?['Par signature. Clé publique, transaction','et autres données à ajouter.','ML-DSA-44 sert ici de référence de taille.']:['Par signature. Clé publique, transaction et autres données à ajouter.','ML-DSA-44 sert ici de référence de taille.']):(mobile?['Per signature. Public key, transaction','and other data add further space.','ML-DSA-44 is a size reference here.']:['Per signature. Public key, transaction and other data add further space.','ML-DSA-44 is a size reference here.']),mobile?15:17,C.muted,'start',400,mobile?23:25);
    return shell(id,width,mobile?716:644,title.join(' '),fr?'Comparaison à origine zéro : une signature Schnorr BIP 340 mesure 64 octets ; une signature ML-DSA-44 mesure 2 420 octets. Le ratio calculé est 37,8125 et l’écart est 2 356 octets. Les tailles des clés publiques et des transactions sont exclues. Cette comparaison ne décrit pas un protocole Bitcoin adopté.':'Zero-based comparison: a BIP 340 Schnorr signature is 64 bytes; a ML-DSA-44 signature is 2,420 bytes. The calculated ratio is 37.8125 and the difference is 2,356 bytes. Public keys and transactions are excluded. This comparison does not describe an adopted Bitcoin protocol.',body);
  }
  const title=fr?['Changer le verrou','exige un transfert'] : ['Changing the lock','requires a transfer'];
  const subtitle=fr?['Déplacer ses fonds et adopter','les règles qui les protègent.'] : ['Move the coins and adopt','the rules that protect them.'];
  let body=heading(mobile,fr?'LE PROBLÈME DE TRANSITION':'THE TRANSITION PROBLEM',title,subtitle);
  if (mobile) {
    const xs=[70,200,330],a=274,b=497;
    body+=labels('active-lane',24,194,352,38,[fr?'Propriétaire qui agit':'Owner takes action'],18,C.signal,'start',700);
    body+=coin(xs[0],a,68,C.muted)+signature(xs[1],a,68,C.signal)+coin(xs[2],a,68,C.signal);
    body+=arrow(105,a,161,a,C.signal)+arrow(238,a,292,a,C.signal);
    body+=labels('old-output',28,322,84,73,fr?['Ancienne','sortie']:['Old','output'],15,C.muted,'middle',400,22);
    body+=labels('transfer',151,322,98,73,fr?['Dépense','signée']:['Signed','spend'],15,C.paper,'middle',400,22);
    body+=labels('new-output',286,322,88,73,fr?['Nouvelle','protection*']:['New','protection*'],15,C.signal,'middle',400,22);
    body+=line(32,410,368,410,C['line-strong'],1);
    body+=labels('idle-lane',24,414,352,37,[fr?'Aucun transfert initié':'No transfer initiated'],18,C.amber,'start',700);
    body+=coin(88,b,68,C.amber)+line(124,b,350,b,C.amber,2,'4 5')+circle(350,b,4,C.amber);
    body+=labels('stays-old',158,443,210,75,fr?['Les fonds restent sous','l’ancienne condition.']:['Coins retain their','old spending condition.'],15,C.paper,'start',400,23);
    body+=labels('dormant',24,548,352,63,fr?['Dormance : la clé peut être disponible,','perdue ou inaccessible.']:['A dormant key may still be available,','lost or inaccessible.'],15,C.muted,'start',400,23);
    body+=rect(32,640,336,83,C['surface-2'],12,C['line-strong'],1);
    body+=labels('consensus',43,647,314,68,fr?['Règles communes à adopter','Traitement des anciennes sorties']:['Shared rules to adopt','Treatment of old outputs'],16,C.paper,'middle',700,25);
    body+=arrow(200,635,200,607,C.amber,'4 5');
    body+=labels('future',24,736,352,83,fr?['*Protection postquantique : hypothèse.','Adoption et modalités à définir.']:['*Post-quantum protection: hypothetical.','Adoption and terms remain to be set.'],15,C.muted,'start',400,23);
  } else {
    body+=labels('active-lane',24,153,952,39,[fr?'Propriétaire qui agit':'Owner takes action'],21,C.signal,'start',700);
    const xs=[102,338,604];
    body+=coin(xs[0],233,83,C.muted)+signature(xs[1],233,83,C.signal)+coin(xs[2],233,83,C.signal);
    body+=arrow(149,233,286,233,C.signal)+arrow(390,233,553,233,C.signal);
    body+=labels('old-output',26,279,152,40,[fr?'Ancienne sortie':'Old output'],18,C.muted,'middle');
    body+=labels('transfer',250,279,176,40,[fr?'Dépense signée':'Signed spend'],18,C.paper,'middle');
    body+=labels('new-output',495,279,218,40,[fr?'Nouvelle protection*':'New protection*'],18,C.signal,'middle');
    body+=line(32,343,713,343,C['line-strong'],1);
    body+=labels('idle-lane',24,351,690,39,[fr?'Aucun transfert initié':'No transfer initiated'],21,C.amber,'start',700);
    body+=coin(102,447,83,C.amber)+line(149,447,660,447,C.amber,2,'4 5')+circle(660,447,4,C.amber);
    body+=labels('stays-old',190,408,508,70,fr?['Les fonds restent sous l’ancienne condition.']:['Coins retain their old spending condition.'],19,C.paper,'start');
    body+=labels('dormant',24,500,690,39,[fr?'Dormance : clé disponible, perdue ou inaccessible.':'A dormant key may be available, lost or inaccessible.'],17,C.muted,'start');
    body+=rect(748,177,220,313,C['surface-2'],14,C['line-strong'],1);
    body+=network(858,246,95);
    body+=labels('consensus',758,313,200,139,fr?['Règles communes','à adopter','','Traitement des','anciennes sorties']:['Shared rules','to adopt','','Treatment of','old outputs'],18,C.paper,'middle',700,24);
    body+=arrow(747,234,692,234,C.signal,'4 5')+arrow(747,448,696,448,C.amber,'4 5');
    body+=labels('future',24,550,952,37,[fr?'*Protection postquantique : hypothèse. Adoption et modalités à définir.':'*Post-quantum protection: hypothetical. Adoption and terms remain to be set.'],17,C.muted);
  }
  return shell(id,width,mobile?828:600,title.join(' '),fr?'Un propriétaire peut signer une dépense qui transfère ses fonds vers une nouvelle sortie. Sans transfert, les fonds restent sous l’ancienne condition. Une transition postquantique exigerait des règles communes, y compris sur le traitement des anciennes sorties. Les conditions de cette protection future restent hypothétiques.':'An owner can sign a spend that moves coins to a new output. Without a transfer, coins retain their old spending condition. A post-quantum transition would require shared rules, including treatment of old outputs. The terms of that future protection remain hypothetical.',body);
}
