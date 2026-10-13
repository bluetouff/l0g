import { writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const DANFOSS_FIGURE_KINDS = Object.freeze(['control', 'responsibility', 'loss']);
export const DANFOSS_FIGURE_SOURCES = Object.freeze({
  controller: 'https://assets.danfoss.com/documents/206320/BC365212986197en-000201.pdf',
  update: 'https://www.danfoss.com/en/service-and-support/downloads/dcs/adap-kool-software/ak-sm-800a/',
  security: 'https://www.danfoss.com/fr-fr/service-and-support/fix-and-troubleshooting/cooling-installer-hub/electronic-controllers-services-faqs/cybersecurity-best-practices/',
  alert: 'https://www.cert.ssi.gouv.fr/alerte/CERTFR-2026-ALE-012/',
  alsense: 'https://www.danfoss.com/en/products/dcs/monitoring-and-services/alsense-food-retail/alsense-food-retail-iot-cloud-application-for-supermarkets/',
  terms: 'https://assets.danfoss.com/documents/latest/464285/AH480457335598fr-FR0102.pdf',
});

const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const ink = role => `var(--color-${role})`;
const path = (d, role = 'signal', extra = '') => `<path d="${d}" fill="none" stroke="${ink(role)}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}/>`;
const box = (x, y, w, h, role = 'line-strong', extra = '') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="${ink('surface')}" stroke="${ink(role)}" stroke-width="1.5" ${extra}/>`;
const circle = (x, y, r, role = 'signal') => `<circle cx="${x}" cy="${y}" r="${r}" fill="${ink('surface')}" stroke="${ink(role)}" stroke-width="1.8"/>`;
const label = (x, y, copy, size = 20, role = 'paper', weight = 400, anchor = 'start') => `<text x="${x}" y="${y}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" fill="${ink(role)}">${esc(copy)}</text>`;
const region = (name, bounds, content) => `<g data-region="${name}" data-bounds="${bounds.join(' ')}">${content}</g>`;
const node = (name, content) => `<g data-node="${name}">${content}</g>`;

function arrow(points, role, flow, dashed = false) {
  const [x, y] = points.at(-1), [px, py] = points.at(-2);
  const length = Math.hypot(x - px, y - py), dx = (x - px) / length, dy = (y - py) / length;
  const tip = side => [x - 7 * dx + side * 4 * dy, y - 7 * dy - side * 4 * dx].map(n => Math.round(n * 1000) / 1000).join(' ');
  return path(points.map(([a, b], i) => `${i ? 'L' : 'M'} ${a} ${b}`).join(' '), role, `data-flow="${flow}" data-rail="true"${dashed ? ' stroke-dasharray="5 6"' : ''}`)
    + path(`M ${tip(-1)} L ${x} ${y} L ${tip(1)}`, role);
}

function icon(kind, x, y, role = 'signal') {
  if (kind === 'sensor') return circle(x, y + 12, 8, role) + path(`M ${x - 4} ${y + 5} L ${x - 4} ${y - 20} L ${x + 4} ${y - 20} L ${x + 4} ${y + 5} M ${x} ${y - 12} L ${x} ${y + 12} M ${x + 12} ${y - 15} L ${x + 20} ${y - 15} M ${x + 12} ${y - 5} L ${x + 17} ${y - 5}`, role);
  if (kind === 'screen') return box(x - 27, y - 22, 54, 38, role) + path(`M ${x} ${y + 17} L ${x} ${y + 26} M ${x - 15} ${y + 26} L ${x + 15} ${y + 26} M ${x - 17} ${y + 3} L ${x - 8} ${y - 7} L ${x + 1} ${y + 3} L ${x + 17} ${y - 10}`, role);
  if (kind === 'gate') return box(x - 18, y - 2, 36, 25, role) + path(`M ${x - 10} ${y - 3} L ${x - 10} ${y - 16} L ${x + 10} ${y - 16} L ${x + 10} ${y - 3} M ${x} ${y + 7} L ${x} ${y + 15}`, role);
  if (kind === 'valve') return path(`M ${x - 23} ${y} L ${x + 23} ${y} M ${x - 15} ${y - 12} L ${x + 15} ${y + 12} L ${x + 15} ${y - 12} L ${x - 15} ${y + 12} L ${x - 15} ${y - 12} M ${x} ${y} L ${x} ${y - 23} M ${x - 10} ${y - 23} L ${x + 10} ${y - 23}`, role);
  if (kind === 'fridge') return box(x - 26, y - 42, 52, 84, role) + path(`M ${x - 21} ${y - 12} L ${x + 21} ${y - 12} M ${x + 15} ${y - 30} L ${x + 15} ${y - 20} M ${x + 15} ${y + 2} L ${x + 15} ${y + 15} M ${x - 16} ${y + 25} L ${x + 9} ${y + 25} M ${x - 12} ${y + 19} L ${x - 12} ${y + 25} M ${x - 3} ${y + 14} L ${x - 3} ${y + 25}`, role);
  if (kind === 'bell') return path(`M ${x - 20} ${y + 12} L ${x - 12} ${y + 3} L ${x - 12} ${y - 12} L ${x - 5} ${y - 19} L ${x + 5} ${y - 19} L ${x + 12} ${y - 12} L ${x + 12} ${y + 3} L ${x + 20} ${y + 12} L ${x - 20} ${y + 12} M ${x - 5} ${y + 19} L ${x + 5} ${y + 19}`, role);
  if (kind === 'document') return box(x - 23, y - 28, 46, 56, role) + path(`M ${x - 13} ${y - 13} L ${x + 11} ${y - 13} M ${x - 13} ${y - 3} L ${x + 11} ${y - 3} M ${x - 13} ${y + 9} L ${x - 5} ${y + 17} L ${x + 13} ${y + 1}`, role);
  if (kind === 'network') return box(x - 25, y - 11, 50, 24, role) + path(`M ${x} ${y - 12} L ${x} ${y - 25} M ${x - 15} ${y + 14} L ${x - 15} ${y + 24} M ${x} ${y + 14} L ${x} ${y + 24} M ${x + 15} ${y + 14} L ${x + 15} ${y + 24} M ${x - 15} ${y} L ${x - 10} ${y} M ${x + 10} ${y} L ${x + 15} ${y}`, role);
  if (kind === 'store') return path(`M ${x - 27} ${y - 8} L ${x - 20} ${y - 22} L ${x + 20} ${y - 22} L ${x + 27} ${y - 8} L ${x - 27} ${y - 8} M ${x - 23} ${y - 7} L ${x - 23} ${y + 23} L ${x + 23} ${y + 23} L ${x + 23} ${y - 7} M ${x - 15} ${y + 23} L ${x - 15} ${y + 4} L ${x - 3} ${y + 4} L ${x - 3} ${y + 23} M ${x + 7} ${y + 3} L ${x + 17} ${y + 3} L ${x + 17} ${y + 13} L ${x + 7} ${y + 13} L ${x + 7} ${y + 3}`, role);
  if (kind === 'stock') return path(`M ${x - 26} ${y - 15} L ${x + 26} ${y - 15} L ${x + 26} ${y + 20} L ${x - 26} ${y + 20} L ${x - 26} ${y - 15} M ${x} ${y - 15} L ${x} ${y + 20} M ${x - 26} ${y + 2} L ${x + 26} ${y + 2} M ${x - 19} ${y - 7} L ${x - 7} ${y - 7} M ${x + 7} ${y + 10} L ${x + 19} ${y + 10}`, role);
  if (kind === 'pause') return circle(x, y, 24, role) + path(`M ${x - 7} ${y - 10} L ${x - 7} ${y + 10} M ${x + 7} ${y - 10} L ${x + 7} ${y + 10}`, role);
  throw new TypeError('Unknown icon');
}

function frame(lang, kind, mobile, title, desc, content) {
  const layout = mobile ? 'mobile' : 'desktop', w = mobile ? 400 : 720, h = mobile ? 640 : 480;
  const id = `danfoss-${lang}-${kind}-${layout}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-labelledby="${id}-title ${id}-desc" style="width:100%;height:auto" class="danfoss-figure-${layout}" data-danfoss-figure="${kind}" data-layout="${layout}" lang="${lang}"><title id="${id}-title">${esc(title)}</title><desc id="${id}-desc">${esc(desc)}</desc>${box(1, 1, w - 2, h - 2)}${content}</svg>`;
}

function heading(fr, mobile, number, title, subtitle) {
  const w = mobile ? 400 : 720;
  return region('heading', [16, 14, w - 32, 100], label(28, 40, `${number} / ${fr ? 'MÉCANISME' : 'MECHANISM'}`, 20, 'muted')
    + label(28, 76, title, mobile ? 26 : 28, 'paper', 700)
    + label(28, 106, subtitle, mobile ? 20 : 18, 'muted'));
}

function control(lang, mobile) {
  const fr = lang === 'fr';
  const title = fr ? 'Le froid, une boucle pilotée' : 'Refrigeration under control';
  let s = heading(fr, mobile, '01', title, fr ? 'Schéma général de fonctionnement' : 'General operating diagram');
  if (!mobile) {
    s += region('remote-copy', [22, 123, 236, 40], label(34, 153, fr ? 'Télémaintenance' : 'Remote maintenance', 21, 'amber', 700));
    s += region('access-copy', [264, 123, 225, 40], label(276, 153, fr ? 'Accès autorisé' : 'Authorised access', 21, 'amber', 700));
    s += region('alarm-copy', [534, 123, 162, 40], label(546, 153, fr ? 'Alarme' : 'Alarm', 21, 'accent', 700));
    s += node('remote', icon('screen', 74, 188, 'amber')) + node('access-boundary', icon('gate', 336, 185, 'amber')) + node('alarm', icon('bell', 604, 190, 'accent'));
    s += arrow([[109, 189], [303, 189]], 'amber', 'remote-access');
    s += arrow([[336, 216], [336, 249]], 'amber', 'authorised-setting');
    s += region('setpoint-copy', [342, 210, 149, 37], label(354, 237, fr ? 'Consigne' : 'Setpoint', 18, 'amber'));
    s += region('measurement-copy', [122, 244, 180, 36], label(134, 272, fr ? 'Mesure' : 'Reading', 18, 'signal'));
    s += region('command-copy', [375, 283, 120, 35], label(385, 309, fr ? 'Commande' : 'Command', 18, 'signal'));
    s += node('sensor', icon('sensor', 92, 284)) + node('supervisor', icon('screen', 336, 283)) + node('actuator', icon('valve', 521, 283)) + node('cold-process', icon('fridge', 646, 283));
    s += arrow([[120, 283], [300, 283]], 'signal', 'measurement');
    s += arrow([[373, 283], [488, 283]], 'signal', 'command');
    s += arrow([[553, 283], [610, 283]], 'signal', 'physical-action');
    s += arrow([[377, 265], [486, 265], [486, 190], [573, 190]], 'accent', 'alarm-notification');
    s += arrow([[646, 334], [646, 377], [18, 377], [18, 299], [72, 299]], 'muted', 'thermal-feedback', true);
    s += region('thermal-copy', [150, 343, 380, 34], label(340, 369, fr ? 'Retour thermique' : 'Thermal response', 18, 'muted', 400, 'middle'));
    for (const [key, x, w, value] of [
      ['sensor', 26, 174, fr ? 'Capteur' : 'Sensor'],
      ['supervisor', 240, 204, fr ? 'Régulateur' : 'Controller'],
      ['actuator', 456, 148, fr ? 'Actionneur' : 'Actuator'],
    ]) s += region(`${key}-copy`, [x, 310, w, 47], label(x + w / 2, 336, value, 20, 'paper', 700, 'middle'));
    s += region('distinction', [22, 386, 676, 76], label(34, 414, fr ? 'Mesurer → comparer à la consigne → agir → mesurer à nouveau' : 'Measure → compare with setpoint → act → measure again', 20, 'signal', 700)
      + label(34, 448, fr ? 'Alarmes : seuils et délais configurés, notification à vérifier.' : 'Alarms: configured thresholds and delays; verify delivery.', 18, 'muted'));
  } else {
    s += region('remote-copy', [20, 122, 360, 38], label(32, 149, fr ? 'Télémaintenance' : 'Remote maintenance', 21, 'amber', 700));
    s += node('remote', icon('screen',  60, 185, 'amber')) + node('access-boundary', icon('gate', 200, 181, 'amber'));
    s += arrow([[96, 184], [171, 184]], 'amber', 'remote-access');
    s += region('access-copy', [234, 162, 146, 64], label(247, 187, fr ? 'Accès' : 'Authorised', 20, 'amber', 700) + label(247, 216, fr ? 'autorisé' : 'access', 20, 'amber', 700));
    s += arrow([[200, 215], [200, 251]], 'amber', 'authorised-setting');
    s += region('setpoint-copy', [220, 219, 158, 38], label(234, 247, fr ? 'Consigne' : 'Setpoint', 20, 'amber'));
    s += region('measurement-copy', [15, 239, 117, 37], label(28, 266, fr ? 'Mesure' : 'Reading', 20, 'signal'));
    s += region('command-copy', [78, 351, 134, 39], label(92, 379, fr ? 'Commande' : 'Command', 20, 'signal'));
    s += node('supervisor', icon('screen', 200, 280));
    s += region('supervisor-copy', [89, 315, 222, 40], label(200, 343, fr ? 'Régulateur' : 'Controller', 21, 'paper', 700, 'middle'));
    s += node('sensor', icon('sensor',  60, 414)) + node('actuator', icon('valve', 218, 414)) + node('cold-process', icon('fridge', 338, 414));
    s += arrow([[ 60, 383], [ 60, 280], [161, 280]], 'signal', 'measurement');
    s += arrow([[218, 358], [218, 382]], 'signal', 'command');
    s += arrow([[250, 414], [302, 414]], 'signal', 'physical-action');
    s += arrow([[338, 465], [338, 512], [18, 512], [18, 430], [49, 430]], 'muted', 'thermal-feedback', true);
    s += region('thermal-copy', [89, 477, 230, 34], label(200, 502, fr ? 'Retour thermique' : 'Thermal response', 20, 'muted', 400, 'middle'));
    s += region('sensor-copy', [20, 442, 136, 36], label(32, 468, fr ? 'Capteur' : 'Sensor', 20, 'paper', 700));
    s += region('actuator-copy', [152, 442, 143, 36], label(164, 468, fr ? 'Actionneur' : 'Actuator', 20, 'paper', 700));
    s += node('alarm', icon('bell', 338, 280, 'accent')) + arrow([[237, 280], [304, 280]], 'accent', 'alarm-notification');
    s += region('alarm-copy', [292, 315, 92, 40], label(304, 343, fr ? 'Alarme' : 'Alarm', 20, 'accent', 700));
    s += region('distinction', [20, 509, 360, 112], label(32, 539, fr ? 'Une consigne guide l’action.' : 'A setpoint guides the response.', 20, 'signal', 700)
      + label(32, 573, fr ? 'La sonde mesure localement.' : 'The sensor measures locally.', 20)
      + label(32, 607, fr ? 'Alarmes : seuils, délais, envoi.' : 'Alarms: thresholds, delays, delivery.', 20, 'muted'));
  }
  return frame(lang, 'control', mobile, title, fr ? 'Schéma général, sans reconstruction de l’attaque. Un accès distant autorisé permet la configuration. La mesure du capteur est comparée à la consigne, puis une commande agit sur le froid ou le dégivrage. La température revient au capteur. L’alarme utilise des seuils et délais configurés ; sa voie logique de notification ne présume pas de canal physique indépendant. Le verrou indique une autorisation d’accès, sans garantir la sûreté du réglage. Une consigne ou une température de sonde ne mesure pas la température à cœur des denrées.' : 'General diagram, not a reconstruction of the attack. Authorised remote access allows configuration. A sensor reading is compared with the setpoint, then a command controls cooling or defrosting. Temperature feeds back to the sensor. Alarms use configured thresholds and delays; the logical notification path does not imply a physically independent channel. The lock indicates authorised access, not a guarantee that a setting is safe. Neither a setpoint nor a sensor reading measures food core temperature.', s);
}

// Fixed coordinates are intentionally explicit: no diagram input comes from users or APIs.

function responsibility(lang, mobile) {
  const fr = lang === 'fr';
  const title = fr ? 'Du bulletin au contrôle' : 'From notice to verification';
  let s = heading(fr, mobile, '02', title, fr ? 'Chaque transfert laisse une trace' : 'Evidence at every handoff');
  const stages = fr ? [
    ['Avis reçu', 'Fabricant → destinataire', 'Date · réception'],
    ['Parc identifié', 'Exploitant + intégrateur', 'Modèles · versions · sites'],
    ['Mandat validé', 'Exploitant / contrat', 'Accès · budget · fenêtre'],
    ['Correctif posé', 'Mainteneur mandaté', 'Version · journal'],
    ['Contrôle réalisé', 'Exploitant + mainteneur', 'Test · alarmes · compte rendu'],
  ] : [
    ['Notice received', 'Maker → named recipient', 'Date · receipt'],
    ['Scope identified', 'Operator + integrator', 'Models · versions · sites'],
    ['Work authorised', 'Operator / contract', 'Access · budget · window'],
    ['Patch installed', 'Appointed maintainer', 'Version · log'],
    ['Result verified', 'Operator + maintainer', 'Test · alarms · report'],
  ];
  const keys = ['notice', 'scope', 'mandate', 'installation', 'verification'];
  const first = mobile ? 155 : 173, step = mobile ? 94 : 60, x = mobile ? 44 : 52;
  if (!mobile) {
    s += region('action-heading', [82, 118, 285, 33], label(96, 142, fr ? 'ACTION ET MANDAT' : 'ACTION AND MANDATE', 18, 'muted'));
    s += region('evidence-heading', [390, 118, 305, 33], label(408, 142, fr ? 'TRACE À CONSERVER' : 'EVIDENCE TO RETAIN', 18, 'muted'));
    s += path('M 382 125 L 382 439', 'line-strong', 'stroke-dasharray="3 8"');
  }
  for (let i = 0; i < stages.length; i++) {
    const y = first + i * step, role = i === 2 ? 'amber' : 'signal';
    // The breaks in the process rail are deliberate: a handoff needs a recipient and a record.
    s += node(keys[i], circle(x, y, i === 2 ? 12 : 7, role));
    if (i < stages.length - 1) s += arrow([[x, y + 18], [x, y + step - 19]], role, `${keys[i]}-handoff`);
    if (mobile) {
      s += region(`${keys[i]}-copy`, [71, y - 29, 313, 93], label(84, y - 2, stages[i][0], 23, role, 700)
        + label(84, y + 27, stages[i][1], 20, 'paper')
        + label(84, y + 55, stages[i][2], 20, 'muted'));
    } else {
      s += region(`${keys[i]}-copy`, [82, y - 29, 285, 61], label(96, y - 2, stages[i][0], 22, role, 700)
        + label(96, y + 24, stages[i][1], 18, 'muted'));
      s += region(`${keys[i]}-evidence`, [390, y - 25, 305, 53], label(408, y + 7, stages[i][2], 20, 'paper'));
      s += path(`M 370 ${y - 7} L 377 ${y} L 370 ${y + 7}`, role);
    }
  }
  const installed = first + 3 * step, verified = first + 4 * step;
  s += arrow([[x - 15, verified], [16, verified], [16, installed], [x - 15, installed]], 'accent', 'verification-failed', true);
  s += region('failure-copy', mobile ? [71, 598, 313, 32] : [82, 444, 614, 30], label(mobile ? 84 : 96, mobile ? 622 : 466, fr ? 'Échec : intervenir à nouveau' : 'Failed check: repeat the work', mobile ? 20 : 18, 'accent', 700));
  return frame(lang, 'responsibility', mobile, title, fr ? 'Chaîne de traitement à établir, sans désigner le responsable juridique de l’incident. Le bulletin doit être reçu, les appareils concernés identifiés, puis un mandat préciser les accès, le budget et la fenêtre d’intervention. L’installation laisse un journal de version. Le contrôle inclut le fonctionnement et les alarmes, avec réception du compte rendu. Un contrôle négatif renvoie à l’intervention. Les rôles et obligations sont à vérifier dans les contrats ; plusieurs fonctions peuvent être exercées par une même entreprise. Aucune étape n’est présumée accomplie dans le cas étudié.' : 'A workflow to establish, without identifying legal liability for the incident. A notice must reach its recipient, affected devices must be identified, and a mandate must specify access, budget and a maintenance window. Installation leaves a version log. Verification includes operation and alarms, with receipt of the report. A failed check returns to the intervention. Roles and obligations must be checked against contracts. One company may perform several roles. No stage is presumed complete in the case under discussion.', s);
}

function loss(lang, mobile) {
  const fr = lang === 'fr';
  const title = fr ? 'Le risque atteint la caisse' : 'Shared risk hits cash flow';
  let s = heading(fr, mobile, '03', title, fr ? 'Froid rétabli ≠ stock reconstitué' : 'Cooling restored ≠ stock replaced');
  if (!mobile) {
    s += node('shared-dependency', icon('network', 77, 167, 'amber'));
    s += region('dependency-copy', [20, 185, 189, 61], label(32, 210, fr ? 'Dépendance' : 'Shared', 20, 'amber', 700) + label(32, 236, fr ? 'commune' : 'dependency', 20, 'amber', 700));
    for (const [i, x] of [315, 465, 615].entries()) {
      s += node(`site-${i}`, icon('store', x, 160));
      s += arrow([[111, 167], [184, 167], [184, 124], [x, 124], [x, 130]], 'amber', `shared-site-${i}`, true);
    }
    s += region('sites-copy', [247, 192, 443, 36], label(465, 219, fr ? 'Incidents possibles sur plusieurs sites' : 'Possible incidents across several sites', 20, 'signal', 700, 'middle'));
    s += arrow([[465, 235], [465, 245], [76, 245], [76, 272]], 'accent', 'stock-loss', true);
    s += arrow([[465, 245], [420, 245], [420, 272]], 'accent', 'interruption', true);
    s += node('stock', icon('stock', 76, 296, 'accent')) + node('interruption', icon('pause', 420, 296, 'accent'));
    s += path('M 54 279 L 98 314 M 54 314 L 98 279', 'accent');
    s += region('stock-copy', [109, 268, 245, 59], label(122, 294, fr ? 'Stock détruit' : 'Stock destroyed', 22, 'accent', 700) + label(122, 319, fr ? 'Perte irréversible' : 'Irreversible loss', 18, 'muted'));
    s += region('interruption-copy', [455, 268, 241, 59], label(468, 294, fr ? 'Ventes empêchées' : 'Sales prevented', 22, 'accent', 700) + label(468, 319, fr ? 'Marge non générée' : 'Margin not earned', 18, 'muted'));
    s += arrow([[76, 326], [76, 352]], 'amber', 'stock-replenishment');
    s += arrow([[420, 326], [420, 352]], 'accent', 'lost-receipts');
    s += region('replacement-copy', [26, 355, 328, 42], label(42, 384, fr ? 'Réassort : argent à avancer' : 'Restocking needs new cash', 21, 'amber', 700));
    s += region('receipts-copy', [379, 355, 317, 42], label(394, 384, fr ? 'Encaissements perdus' : 'Cash receipts lost', 21, 'accent', 700));
    s += arrow([[196, 400], [196, 411], [252, 411], [252, 422]], 'amber', 'cash-stock');
    s += arrow([[539, 400], [539, 411], [252, 411]], 'accent', 'cash-interruption');
    s += region('cash-copy', [20, 427, 409, 46], label(36, 459, fr ? 'Trésorerie sous pression' : 'Cash under pressure', 24, 'paper', 700));
    s += region('recovery-copy', [465, 423, 232, 52], label(477, 445, fr ? 'Dommage + garantie' : 'Loss + applicable cover', 18, 'amber') + label(477, 467, fr ? 'Indemnité éventuelle' : 'Possible indemnity', 18, 'amber', 700));
    s += arrow([[465, 235], [705, 235], [705, 455], [699, 455]], 'amber', 'claim-eligibility', true);
    s += arrow([[462, 453], [434, 453]], 'amber', 'conditional-recovery', true);
  } else {
    s += node('shared-dependency', icon('network', 54, 155, 'amber'));
    s += region('dependency-copy', [95, 128, 287, 57], label(109, 156, fr ? 'Dépendance commune' : 'Shared dependency', 22, 'amber', 700));
    for (const [i, x] of [60, 200, 340].entries()) {
      s += arrow([[54, 187], [54, 197], [x, 197], [x, 207]], 'amber', `shared-site-${i}`, true);
      s += node(`site-${i}`, icon('store', x, 236));
    }
    s += region('sites-copy', [20, 266, 361, 34], label(200, 291, fr ? 'Incidents corrélés possibles' : 'Possible correlated incidents', 20, 'signal', 700, 'middle'));
    s += arrow([[200, 307], [200, 314], [90, 314], [90, 327]], 'accent', 'stock-loss', true);
    s += arrow([[200, 314], [302, 314], [302, 327]], 'accent', 'interruption', true);
    s += node('stock', icon('stock', 90, 352, 'accent')) + node('interruption', icon('pause', 302, 352, 'accent'));
    s += path('M 68 335 L 112 369 M 68 369 L 112 335', 'accent');
    s += region('stock-copy', [12, 377, 183, 36], label(90, 404, fr ? 'Stock détruit' : 'Lost stock', 21, 'accent', 700, 'middle'));
    s += region('interruption-copy', [211, 377, 177, 36], label(300, 404, fr ? 'Ventes perdues' : 'Sales lost', 21, 'accent', 700, 'middle'));
    s += arrow([[90, 419], [90, 436]], 'amber', 'stock-replenishment');
    s += arrow([[302, 419], [302, 436]], 'accent', 'lost-receipts');
    s += region('replacement-copy', [20, 438, 174, 63], label(90, 465, fr ? 'Réassort' : 'Restocking', 22, 'amber', 700, 'middle') + label(90, 493, fr ? 'à financer' : 'needs cash', 20, 'amber', 400, 'middle'));
    s += region('receipts-copy', [210, 438, 179, 63], label(300, 465, fr ? 'Encaissements' : 'Cash receipts', 20, 'accent', 700, 'middle') + label(300, 493, fr ? 'perdus' : 'lost', 20, 'accent', 400, 'middle'));
    s += arrow([[90, 509], [90, 519], [200, 519], [200, 529]], 'amber', 'cash-stock');
    s += arrow([[300, 509], [300, 519], [200, 519]], 'accent', 'cash-interruption');
    s += region('cash-copy', [20, 531, 360, 41], label(200, 558, fr ? 'Trésorerie sous pression' : 'Cash under pressure', 23, 'paper', 700, 'middle'));
    s += region('recovery-copy', [45, 578, 310, 57], label(200, 602, fr ? 'Dommage + garantie' : 'Loss + applicable cover', 20, 'amber', 400, 'middle') + label(200, 627, fr ? 'Indemnité éventuelle' : 'Possible indemnity', 20, 'amber', 700, 'middle'));
    s += arrow([[200, 307], [388, 307], [388, 615], [359, 615]], 'amber', 'claim-eligibility', true);
    s += arrow([[200, 577], [200, 567]], 'amber', 'conditional-recovery', true);
  }
  return frame(lang, 'loss', mobile, title, fr ? 'Schéma qualitatif de propagation possible, sans nombre de victimes, montant ni durée. Une dépendance commune peut produire des incidents corrélés sur plusieurs sites, avec des pertes possibles. Un stock détruit reste perdu quand le froid redémarre et son réassort demande de l’argent à avancer. L’interruption empêche des ventes, empêche de générer la marge correspondante et réduit les encaissements. Les deux voies mettent la trésorerie sous pression. Une garantie applicable et un dommage justifié peuvent permettre une indemnité éventuelle, dirigée vers la trésorerie pour la soulager ; le principe, le montant et le délai restent conditionnels. Les icônes et longueurs de flèches ne représentent aucune quantité.' : 'Qualitative diagram of possible propagation, with no victim count, amount or duration. A shared dependency can produce correlated incidents across sites, with possible losses. Destroyed stock remains lost when cooling restarts, and replenishment requires new cash. Interruption prevents sales, prevents the corresponding margin from being earned and reduces cash receipts. Both paths put cash under pressure. Applicable cover and a substantiated loss may lead to a possible indemnity, shown flowing into cash to relieve pressure; availability, amount and timing remain conditional. Icon counts and arrow lengths encode no quantities.', s);
}

export function danfossSvg(lang, kind, layout = 'mobile') {
  if (!['fr', 'en'].includes(lang)) throw new TypeError('Unsupported figure language');
  if (!DANFOSS_FIGURE_KINDS.includes(kind)) throw new TypeError('Unsupported figure kind');
  if (!['mobile', 'desktop'].includes(layout)) throw new TypeError('Unsupported figure layout');
  return { control, responsibility, loss }[kind](lang, layout === 'mobile');
}

const captions = {
  fr: {
    control: 'Schéma général, sans reconstruction de l’attaque. Consigne, mesure d’une sonde et température des denrées sont distinctes. Le modèle et les réglages déterminent la régulation et les alarmes.',
    responsibility: 'Chaîne de traitement à documenter, sans présumer son exécution dans l’incident. Les rôles, mandats et obligations dépendent des contrats ; une entreprise peut cumuler plusieurs fonctions. Un contrôle négatif impose une nouvelle intervention.',
    loss: 'Propagation possible, sans échelle, montant ni durée. Les icônes ne comptent pas les victimes. La pression sur la trésorerie combine dépenses de reprise et encaissements perdus. Indemnisation et recours dépendent des contrats et du droit applicable ; aucune couverture n’est présumée.',
  },
  en: {
    control: 'General mechanism, not a reconstruction of the attack. Setpoints, sensor readings and food temperature are distinct. The model and settings determine control and alarm behaviour.',
    responsibility: 'A workflow to document, without assuming it was completed in this incident. Roles, mandates and duties depend on contracts; one business may perform several. Failed verification calls for another intervention.',
    loss: 'Possible propagation, with no scale, amount or duration. Icons do not count victims. Cash pressure combines recovery spending and lost receipts. Insurance and recovery depend on contracts and applicable law; coverage is not assumed.',
  },
};

export function danfossFigure(lang, kind) {
  const svg = ['desktop', 'mobile'].map(layout => danfossSvg(lang, kind, layout)).join('');
  const refs = kind === 'control' ? [['controller', 'Danfoss'], ['alsense', 'Alsense']]
    : kind === 'responsibility' ? [['update', 'Danfoss'], ['security', lang === 'fr' ? 'Danfoss / cybersécurité' : 'Danfoss / cybersecurity']]
      : [['alert', 'CERT-FR'], ['terms', lang === 'fr' ? 'CGV Danfoss' : 'Danfoss terms']];
  const links = refs.map(([key, name]) => `<a href="${DANFOSS_FIGURE_SOURCES[key]}">${name}</a>`).join(' · ');
  return `<figure class="danfoss-figure">${svg}<figcaption style="font-size:.9rem;line-height:1.55;color:var(--color-muted);margin-top:.85rem">${esc(captions[lang][kind])} ${lang === 'fr' ? 'Sources :' : 'Sources:'} ${links}.</figcaption></figure>`;
}

export function danfossFigures(lang) { return DANFOSS_FIGURE_KINDS.map(kind => danfossFigure(lang, kind)).join('\n\n'); }

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const lang = process.argv[2], output = process.argv[3] ?? `/private/tmp/danfoss-figures-${lang}.html`;
  writeFileSync(output, danfossFigures(lang), 'utf8');
  process.stdout.write(`${output}\n`);
}
