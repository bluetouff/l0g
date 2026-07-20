// scripts/lint-editorial.mjs
// Lint éditorial du contenu (posts + guides). Deux niveaux :
//   ERREUR  (fait échouer le build) : tiret cadratin — interdit.
//   AVERTISSEMENT (informatif)      : tiret demi-cadratin –, et le tic
//                                     « ce que / ce qui » (titres + densité).
//
//   node scripts/lint-editorial.mjs           # erreurs + avertissements
//   node scripts/lint-editorial.mjs --quiet   # erreurs seulement (build)

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIRS = ['src/content/posts', 'src/content/guides'];
const QUIET = process.argv.includes('--quiet');

const EM_DASH = '—'; // —
const EN_DASH = '–'; // –

function contentFiles() {
  const out = [];
  for (const dir of DIRS) {
    for (const name of readdirSync(dir)) {
      if (name.endsWith('.md') || name.endsWith('.mdx')) out.push(join(dir, name));
    }
  }
  return out;
}

function snippet(line, marker) {
  const i = line.indexOf(marker);
  const start = Math.max(0, i - 30);
  const end = Math.min(line.length, i + 30);
  return (start > 0 ? '…' : '') + line.slice(start, end).trim() + (end < line.length ? '…' : '');
}

const errors = [];
const warnings = [];
// « ce que / ce qui », hors idiomes à inversion (« serait-ce que », « est-ce que »).
const CE_QUE = /(?<!-)\bce qu[ei]\b/i;
const CE_QUE_ALL = /(?<!-)\bce qu[ei]\b/gi;
// Plage de dates ou de nombres tolérée : demi-cadratin collé entre chiffres ou mois.
const MONTH = '(?:jan|fév|mars|avril|mai|juin|juil|août|sept|oct|nov|déc|January|February|March|April|May|June|July|August|September|October|November|December)[a-z]*\\.?';
const EN_DASH_RANGE = new RegExp(`(?:\\d|${MONTH})\\s?–\\s?(?:\\d|${MONTH})`, 'i');
// Tics de construction confirmés (avertissement) : varier les tournures.
const TICS = [
  [/\bautrement dit\b/i, '« autrement dit »'],
  [/\bc'est exactement\b/i, '« c\'est exactement »'],
  [/\bvoilà pourquoi\b/i, '« voilà pourquoi »'],
  [/\bc'est précisément\b/i, '« c\'est précisément »'],
];

for (const file of contentFiles()) {
  const lines = readFileSync(file, 'utf8').split('\n');
  let ceQueCount = 0;
  lines.forEach((line, idx) => {
    const ln = idx + 1;
    if (line.includes(EM_DASH)) {
      errors.push({ file, ln, msg: `tiret cadratin (${EM_DASH}) interdit`, ctx: snippet(line, EM_DASH) });
    }
    if (line.includes(EN_DASH) && !EN_DASH_RANGE.test(line)) {
      warnings.push({ file, ln, msg: `tiret demi-cadratin (${EN_DASH}) : plage de dates ? sinon éviter`, ctx: snippet(line, EN_DASH) });
    }
    if (/^#{1,6}\s/.test(line) && CE_QUE.test(line)) {
      warnings.push({ file, ln, msg: 'tic « ce que / ce qui » dans un titre', ctx: line.trim() });
    }
    if (CE_QUE.test(line)) ceQueCount += (line.match(CE_QUE_ALL) || []).length;
    for (const [re, label] of TICS) {
      if (re.test(line)) {
        warnings.push({ file, ln, msg: `tic ${label} : varier la tournure`, ctx: snippet(line, line.match(re)[0]) });
      }
    }
  });
  if (ceQueCount >= 6) {
    warnings.push({ file, ln: 0, msg: `densité élevée de « ce que / ce qui » (${ceQueCount})`, ctx: 'varier les formulations' });
  }
}

function print(list, label) {
  if (list.length === 0) return;
  const byFile = new Map();
  for (const it of list) {
    if (!byFile.has(it.file)) byFile.set(it.file, []);
    byFile.get(it.file).push(it);
  }
  console.error(`\n${label} : ${list.length}\n`);
  for (const [file, items] of byFile) {
    console.error(`  ${file}`);
    for (const it of items) {
      const at = it.ln ? `:${it.ln}` : '';
      console.error(`    ${it.msg}${at}  ${it.ctx}`);
    }
  }
}

print(errors, 'ERREURS');
if (!QUIET) print(warnings, 'AVERTISSEMENTS');

if (errors.length > 0) {
  console.error('');
  throw new Error(`${errors.length} erreur(s) éditoriale(s) (tirets cadratins).`);
}

const warnNote = warnings.length && QUIET ? ` (+ ${warnings.length} avertissement(s), voir npm run lint:editorial)` : '';
console.log(`Lint éditorial OK : aucun tiret cadratin sur ${contentFiles().length} fichiers${warnNote}.`);
