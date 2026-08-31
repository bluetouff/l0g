import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { readFile, readdir, stat } from 'node:fs/promises';
import { extname, join, relative, resolve } from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { XMLValidator } from 'fast-xml-parser';
import { editorialSourceDomainTiers } from '../src/config/primary-sources.ts';

const execFileAsync = promisify(execFile);
const ROOT = fileURLToPath(new URL('../', import.meta.url));
const CONTENT_ROOTS = [
  'src/content/posts',
  'src/content/posts-en',
  'src/content/guides',
  'src/content/guides-en',
];
const CONTENT_EXTENSIONS = new Set(['.md', '.mdx']);
const TRACKING_PARAMETERS = /^(?:utm_.+|fbclid|gclid|dclid|msclkid|mc_cid|mc_eid|vero_conv|vero_id|ref_src|ref_url)$/iu;
const CONTEMPORARY = /\b(?:actuellement|aujourd['’]hui|à ce jour|courant|current(?:ly)?|today|latest|at present|as of today)\b/giu;
const CAUSAL = /\b(?:provoque|entra[iî]ne|explique|conduit à|en raison de|grâce à|à cause de|causes?|drives?|leads? to|results? in|because of|due to)\b/giu;
const QUANTIFIED_CLAIM = /(?:\d[\d\s.,]*(?:%|\s?(?:milliards?|millions?|billions?|trillions?|Md|Mio|bn|tn|bps?|points? de base|euros?|dollars?|yuans?|RMB|USD|EUR|CNY|CNH|[$€£¥]))|\b(?:19|20)\d{2}\b)/iu;
const NUMBER_PATTERN = String.raw`(?<!\d)(?:\d{1,3}(?:[\u00a0\u202f ]\d{3})+(?:[.,]\d+)?|\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:[.,]\d+)?)(?!\d)`;
const QUANTITY = new RegExp(
  String.raw`(?:(RMB|USD|EUR|JPY|CNY|CNH|yuan|yuans|dollars?|euros?|[$€£¥])\s*)?(${NUMBER_PATTERN})\s*(%|percentage[- ]points?|points?\s+de\s+pourcentage|basis\s+points?|points?\s+de\s+base|bps?|points?|percent|pour\s+cent|mille\s+milliards?|trillions?|tn|milliards?|billions?|Md|millions?|million|Mio|mn|bn|M)?(?:\s*(?:de\s+)?(RMB|USD|EUR|JPY|CNY|CNH|yuan|yuans|dollars?|euros?|[$€£¥]))?`,
  'giu',
);
const SECRET_RULES = [
  ['private-key', /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/gu],
  ['aws-access-key', /(?<![A-Z0-9])AKIA[0-9A-Z]{16}(?![A-Z0-9])/gu],
  ['github-token', /(?<![A-Za-z0-9_])(?:gh[pousr]_[A-Za-z0-9_]{30,}|github_pat_[A-Za-z0-9_]{30,})/gu],
  ['openai-key', /(?<![A-Za-z0-9])(?:sk-proj-[A-Za-z0-9_-]{80,}|sk-[A-Za-z0-9]{40,})(?![A-Za-z0-9])/gu],
  ['slack-token', /(?<![A-Za-z0-9])xox[baprs]-[A-Za-z0-9-]{10,}/gu],
  ['stripe-live-key', /(?<![A-Za-z0-9])(?:sk|rk)_live_[A-Za-z0-9]{20,}/gu],
];

const CATEGORY_ORDER = [
  'Build',
  'Frontmatter',
  'FR/EN numbers',
  'URLs',
  'Primary sources',
  'SVG',
  'Unsourced nums',
  'Causal claims',
  'Contemporary',
  'Style patterns',
  'Secrets',
];

const report = new Map(CATEGORY_ORDER.map((name) => [name, {
  checks: 0,
  notes: [],
  warnings: [],
  errors: [],
}]));

function result(category) {
  const value = report.get(category);
  if (!value) throw new Error(`Unknown publication-check category: ${category}`);
  return value;
}

function checked(category, note) {
  const value = result(category);
  value.checks += 1;
  if (note) value.notes.push(note);
}

function warn(category, message) {
  result(category).warnings.push(message);
}

function fail(category, message) {
  result(category).errors.push(message);
}

function displayPath(path) {
  return relative(ROOT, path).replaceAll('\\', '/');
}

function lineNumber(source, index) {
  return source.slice(0, index).split('\n').length;
}

function cleanScalar(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed.slice(1, -1);
    }
  }
  if (trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1).replaceAll("''", "'");
  return trimmed;
}

function parseFrontmatter(source, path = '<memory>') {
  const match = source.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/u);
  if (!match) return { path, block: '', body: source, fields: new Map(), valid: false };
  const fields = new Map();
  for (const line of match[1].split(/\r?\n/u)) {
    const field = line.match(/^([A-Za-z][A-Za-z0-9]*):\s*(.*?)\s*$/u);
    if (field) fields.set(field[1], cleanScalar(field[2]));
  }
  return {
    path,
    block: match[1],
    body: source.slice(match[0].length),
    fields,
    valid: true,
  };
}

function contentKind(path) {
  const name = displayPath(path);
  if (name.startsWith('src/content/posts-en/')) return 'post-en';
  if (name.startsWith('src/content/guides-en/')) return 'guide-en';
  if (name.startsWith('src/content/posts/')) return 'post-fr';
  if (name.startsWith('src/content/guides/')) return 'guide-fr';
  return null;
}

function contentSlug(path) {
  return path.slice(0, -extname(path).length).split('/').at(-1);
}

function validateFrontmatter(record) {
  checked('Frontmatter');
  const name = displayPath(record.path);
  if (!record.valid) {
    fail('Frontmatter', `${name}: missing or malformed frontmatter delimiters`);
    return;
  }

  const required = ['title', 'description', 'pubDate', 'tags', 'draft'];
  if (record.kind === 'post-en') required.push('sourceArticle', 'sourceUpdatedDate');
  if (record.kind === 'guide-en') required.push('sourceGuide', 'sourceUpdatedDate');
  for (const field of required) {
    if (!record.fields.get(field)) fail('Frontmatter', `${name}: missing ${field}`);
  }

  for (const field of ['pubDate', 'updatedDate', 'sourceUpdatedDate']) {
    const value = record.fields.get(field);
    if (value && Number.isNaN(Date.parse(value))) fail('Frontmatter', `${name}: invalid ${field} (${value})`);
  }
}

function stripTrailingUrlPunctuation(value) {
  let output = value;
  while (/[.,;:!?'”’\]}]$/u.test(output)) output = output.slice(0, -1);
  while (output.endsWith(')') && (output.match(/\(/gu)?.length ?? 0) < (output.match(/\)/gu)?.length ?? 0)) {
    output = output.slice(0, -1);
  }
  return output;
}

function extractUrls(source) {
  const sourceWithoutSvg = source.replace(/<svg\b[\s\S]*?<\/svg>/giu, ' ');
  return [...sourceWithoutSvg.matchAll(/https?:\/\/[^\s<>"']+/giu)]
    .map((match) => ({ raw: stripTrailingUrlPunctuation(match[0]), index: match.index }))
    .filter(({ raw }) => raw.length > 8);
}

function normalizedHostname(hostname) {
  return hostname.toLowerCase().replace(/^www\./u, '');
}

function domainMatches(hostname, configured) {
  return configured.some((domain) => hostname === domain || hostname.endsWith(`.${domain}`));
}

function normalizeUrl(raw) {
  const url = new URL(raw);
  url.hash = '';
  for (const key of [...url.searchParams.keys()]) {
    if (TRACKING_PARAMETERS.test(key)) url.searchParams.delete(key);
  }
  url.searchParams.sort();
  if (url.pathname !== '/') url.pathname = url.pathname.replace(/\/+$/u, '');
  return url.toString();
}

function auditUrls(record) {
  checked('URLs');
  checked('Primary sources');
  const name = displayPath(record.path);
  const urls = extractUrls(record.source);
  const unique = new Set();
  const tiers = { primary: new Set(), reference: new Set(), other: new Set() };

  for (const { raw, index } of urls) {
    let url;
    try {
      url = new URL(raw);
    } catch {
      fail('URLs', `${name}:${lineNumber(record.source, index)} invalid URL`);
      continue;
    }
    const hostname = normalizedHostname(url.hostname);
    const tracking = [...url.searchParams.keys()].filter((key) => TRACKING_PARAMETERS.test(key));
    if (tracking.length) {
      fail('URLs', `${name}:${lineNumber(record.source, index)} tracking parameter(s): ${tracking.join(', ')}`);
    }
    if (url.protocol !== 'https:') warn('URLs', `${name}:${lineNumber(record.source, index)} source URL is not HTTPS: ${hostname}`);
    const normalized = normalizeUrl(raw);
    unique.add(normalized);
    if (domainMatches(hostname, editorialSourceDomainTiers.primary)) tiers.primary.add(normalized);
    else if (domainMatches(hostname, editorialSourceDomainTiers.reference)) tiers.reference.add(normalized);
    else tiers.other.add(normalized);
  }

  record.externalUrls = unique;
  record.sourceTiers = tiers;
  record.sourceCounts = {
    primary: tiers.primary.size,
    reference: tiers.reference.size,
    other: tiers.other.size,
    total: unique.size,
  };
  if (urls.length === 0) warn('Primary sources', `${name}: no external source URL found`);
  else if (tiers.primary.size === 0) {
    warn('Primary sources', `${name}: no recognised primary source among ${unique.size} external URL(s); review attribution and evidence depth`);
  }
}

function extractInlineSvgs(source) {
  return [...source.matchAll(/<svg\b[\s\S]*?<\/svg>/giu)].map((match) => ({
    markup: match[0],
    index: match.index,
  }));
}

function attributes(markup) {
  const values = new Map();
  for (const match of markup.matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gu)) {
    values.set(match[1], match[2] ?? match[3] ?? match[4] ?? '');
  }
  return values;
}

function numericAttribute(attrs, name, fallback = null) {
  const value = attrs.get(name);
  if (value === undefined) return fallback;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseViewBox(svg) {
  const opening = svg.match(/^<svg\b[^>]*>/iu)?.[0] ?? '';
  const root = attributes(opening);
  const values = (root.get('viewBox') ?? '').trim().split(/[\s,]+/u).map(Number);
  if (values.length !== 4 || values.some((value) => !Number.isFinite(value)) || values[2] <= 0 || values[3] <= 0) {
    return { root, box: null };
  }
  return { root, box: { x: values[0], y: values[1], width: values[2], height: values[3] } };
}

function boundsOutside(bounds, box) {
  const epsilon = 0.01;
  return bounds.left < box.x - epsilon
    || bounds.top < box.y - epsilon
    || bounds.right > box.x + box.width + epsilon
    || bounds.bottom > box.y + box.height + epsilon;
}

function geometryBounds(tag, attrs) {
  if (tag === 'rect' || tag === 'image' || tag === 'use') {
    const x = numericAttribute(attrs, 'x', 0);
    const y = numericAttribute(attrs, 'y', 0);
    const width = numericAttribute(attrs, 'width');
    const height = numericAttribute(attrs, 'height');
    if ([x, y, width, height].some((value) => value === null)) return null;
    return { left: x, top: y, right: x + width, bottom: y + height };
  }
  if (tag === 'line') {
    const x1 = numericAttribute(attrs, 'x1', 0);
    const y1 = numericAttribute(attrs, 'y1', 0);
    const x2 = numericAttribute(attrs, 'x2', 0);
    const y2 = numericAttribute(attrs, 'y2', 0);
    return { left: Math.min(x1, x2), top: Math.min(y1, y2), right: Math.max(x1, x2), bottom: Math.max(y1, y2) };
  }
  if (tag === 'circle') {
    const cx = numericAttribute(attrs, 'cx', 0);
    const cy = numericAttribute(attrs, 'cy', 0);
    const radius = numericAttribute(attrs, 'r');
    if (radius === null) return null;
    return { left: cx - radius, top: cy - radius, right: cx + radius, bottom: cy + radius };
  }
  if (tag === 'ellipse') {
    const cx = numericAttribute(attrs, 'cx', 0);
    const cy = numericAttribute(attrs, 'cy', 0);
    const rx = numericAttribute(attrs, 'rx');
    const ry = numericAttribute(attrs, 'ry');
    if (rx === null || ry === null) return null;
    return { left: cx - rx, top: cy - ry, right: cx + rx, bottom: cy + ry };
  }
  if (tag === 'text') {
    const x = numericAttribute(attrs, 'x');
    const y = numericAttribute(attrs, 'y');
    if (x === null || y === null) return null;
    return { left: x, top: y, right: x, bottom: y };
  }
  if (tag === 'polygon' || tag === 'polyline') {
    const points = (attrs.get('points') ?? '').trim().split(/[\s,]+/u).map(Number);
    if (points.length < 2 || points.length % 2 !== 0 || points.some((value) => !Number.isFinite(value))) return null;
    const xs = points.filter((_, index) => index % 2 === 0);
    const ys = points.filter((_, index) => index % 2 === 1);
    return { left: Math.min(...xs), top: Math.min(...ys), right: Math.max(...xs), bottom: Math.max(...ys) };
  }
  return null;
}

function analyzeSvg(svg) {
  const errors = [];
  const warnings = [];
  const validation = XMLValidator.validate(svg, { allowBooleanAttributes: true });
  if (validation !== true) errors.push(`invalid XML: ${validation.err?.msg ?? 'unknown XML error'}`);

  const { root, box } = parseViewBox(svg);
  if (!box) errors.push('missing or invalid viewBox');
  const style = (root.get('style') ?? '').replaceAll(/\s+/gu, '').toLowerCase();
  const responsiveWidth = root.get('width') === '100%' || style.includes('width:100%');
  const responsiveHeight = root.get('height') === 'auto' || style.includes('height:auto');
  if (!responsiveWidth || !responsiveHeight) errors.push('root SVG must declare width:100% and height:auto');
  if (root.get('role') !== 'img') warnings.push('missing role="img"');
  if (!root.get('aria-label') && !root.get('aria-labelledby')) warnings.push('missing aria-label or aria-labelledby');
  if (/<script\b|\son[a-z]+\s*=/iu.test(svg)) errors.push('script or event handler is forbidden');
  if (/<foreignObject\b/iu.test(svg)) warnings.push('foreignObject requires explicit review');
  for (const match of svg.matchAll(/(?:href|xlink:href)\s*=\s*["']([^"']+)["']/giu)) {
    if (!match[1].startsWith('#')) errors.push('external SVG reference is forbidden');
  }

  let transformed = false;
  if (box) {
    const nearX = Math.max(6, box.width * 0.01);
    const nearY = Math.max(6, box.height * 0.01);
    for (const match of svg.matchAll(/<(rect|image|use|line|circle|ellipse|text|polygon|polyline)\b([^>]*)>/giu)) {
      const tag = match[1].toLowerCase();
      const attrs = attributes(match[2]);
      if (attrs.has('transform')) transformed = true;
      const bounds = geometryBounds(tag, attrs);
      if (!bounds) continue;
      if (boundsOutside(bounds, box)) errors.push(`${tag} geometry exceeds viewBox`);
      if (tag === 'text' && (
        bounds.left - box.x < nearX
        || box.x + box.width - bounds.right < nearX
        || bounds.top - box.y < nearY
        || box.y + box.height - bounds.bottom < nearY
      )) warnings.push('text anchor is very close to a viewBox edge');
    }
  }
  if (transformed) warnings.push('transformed geometry requires rendered bounds review');
  if (/<path\b/iu.test(svg)) warnings.push('path geometry requires rendered bounds review');
  return { errors: [...new Set(errors)], warnings: [...new Set(warnings)] };
}

function auditSvgs(record) {
  const svgs = extractInlineSvgs(record.source);
  checked('SVG', `${displayPath(record.path)}: ${svgs.length} inline SVG(s)`);
  for (const [index, svg] of svgs.entries()) {
    const analysis = analyzeSvg(svg.markup);
    const label = `${displayPath(record.path)}:${lineNumber(record.source, svg.index)} SVG ${index + 1}`;
    for (const message of analysis.errors) fail('SVG', `${label}: ${message}`);
    for (const message of analysis.warnings) warn('SVG', `${label}: ${message}`);
  }
}

function sourceParagraphs(record) {
  const withoutSvg = record.body
    .replace(/<figure\b[\s\S]*?<\/figure>/giu, ' ')
    .replace(/<svg\b[\s\S]*?<\/svg>/giu, ' ')
    .replace(/```[\s\S]*?```/gu, ' ');
  return withoutSvg.split(/\r?\n\s*\r?\n/gu).map((text) => text.trim()).filter(Boolean);
}

function auditEditorialSignals(record) {
  const name = displayPath(record.path);
  const paragraphs = sourceParagraphs(record);
  checked('Unsourced nums');
  checked('Causal claims');
  checked('Contemporary');
  checked('Style patterns');

  const unsourced = [];
  paragraphs.forEach((paragraph, index) => {
    if (!QUANTIFIED_CLAIM.test(paragraph)) return;
    const neighbourhood = paragraphs.slice(Math.max(0, index - 3), index + 4).join('\n');
    if (!/https?:\/\//iu.test(neighbourhood)) unsourced.push(paragraph.replaceAll(/\s+/gu, ' ').slice(0, 130));
  });
  if (unsourced.length) {
    warn('Unsourced nums', `${name}: ${unsourced.length} quantified paragraph(s) without a nearby external source; first: ${unsourced[0]}`);
  }

  const causalCount = [...record.body.matchAll(CAUSAL)].length;
  if (causalCount) warn('Causal claims', `${name}: ${causalCount} causal formulation(s) require evidence/qualification review`);
  const contemporaryCount = [...record.body.matchAll(CONTEMPORARY)].length;
  if (contemporaryCount) warn('Contemporary', `${name}: ${contemporaryCount} contemporary formulation(s) require timestamp/freshness review`);

  if (record.source.includes('—')) fail('Style patterns', `${name}: em dash is forbidden`);
  const oppositionCount = (record.body.match(/(?:ce n['’]est pas[\s\S]{0,100}c['’]est|\bnot\b[^.!?\n]{0,100}\bbut\b)/giu) ?? []).length;
  if (oppositionCount >= 3) warn('Style patterns', `${name}: repeated “not X, but Y” construction (${oppositionCount})`);
  const paragraphButCount = paragraphs.filter((paragraph) => /^(?:Mais|But)\b/u.test(paragraph)).length;
  if (paragraphButCount >= 4) warn('Style patterns', `${name}: ${paragraphButCount} paragraphs begin with “Mais/But”`);
  const trueQuestionCount = (record.body.match(/\b(?:La vraie question|The real question)\b/giu) ?? []).length;
  if (trueQuestionCount >= 2) warn('Style patterns', `${name}: “La vraie question/The real question” repeated ${trueQuestionCount} times`);
}

function parseLocaleNumber(raw, locale) {
  let value = raw.replaceAll(/[\u00a0\u202f ]/gu, '');
  if (locale === 'fr') {
    if (value.includes(',') && value.includes('.')) value = value.replaceAll('.', '').replace(',', '.');
    else if (value.includes(',')) value = value.replace(',', '.');
  } else if (value.includes(',') && value.includes('.')) value = value.replaceAll(',', '');
  else if (/^\d{1,3}(?:,\d{3})+$/u.test(value)) value = value.replaceAll(',', '');
  else if (value.includes(',')) value = value.replace(',', '.');
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function currencyCode(value) {
  const normalized = (value ?? '').toLowerCase();
  if (['rmb', 'cny', 'cnh', 'yuan', 'yuans', '¥'].includes(normalized)) return 'RMB';
  if (['usd', 'dollar', 'dollars', '$'].includes(normalized)) return 'USD';
  if (['eur', 'euro', 'euros', '€'].includes(normalized)) return 'EUR';
  if (['jpy', '£'].includes(normalized)) return normalized === 'jpy' ? 'JPY' : 'GBP';
  return '';
}

function normalizedNumericValue(value) {
  if (Number.isInteger(value)) return String(value);
  return Number(value.toPrecision(12)).toString();
}

function quantityKey(match, locale) {
  const value = parseLocaleNumber(match[2], locale);
  if (value === null) return null;
  const unit = (match[3] ?? '').toLowerCase().replaceAll(/\s+/gu, ' ').trim();
  const currency = currencyCode(match[1]) || currencyCode(match[4]);
  if (unit === '%' || unit === 'percent' || unit === 'pour cent') return `pct:${normalizedNumericValue(value)}`;
  if (/^(?:percentage[- ]points?|points? de pourcentage|points?)$/u.test(unit)) return `pp:${normalizedNumericValue(value)}`;
  if (/^(?:basis points?|points? de base|bps?|bp)$/u.test(unit)) return `bps:${normalizedNumericValue(value)}`;
  let multiplier = 1;
  if (/^(?:millions?|mio|mn|m)$/u.test(unit)) multiplier = 1e6;
  else if (/^(?:milliards?|billions?|md|bn)$/u.test(unit)) multiplier = 1e9;
  else if (/^(?:mille milliards?|trillions?|tn)$/u.test(unit)) multiplier = 1e12;
  const scaled = value * multiplier;
  if (currency) return `${currency}:${normalizedNumericValue(scaled)}`;
  if (multiplier !== 1) return `scaled:${normalizedNumericValue(scaled)}`;
  if (value >= 1900 && value <= 2100 && Number.isInteger(value)) return `year:${value}`;
  return `num:${normalizedNumericValue(value)}`;
}

function comparableText(record) {
  let text = record.body
    .replace(/<svg\b[\s\S]*?<\/svg>/giu, ' ')
    .replace(/```[\s\S]*?```/gu, ' ')
    .replace(/https?:\/\/[^\s<>"']+/giu, ' ')
    .replace(/<[^>]+>/gu, ' ');
  const writtenNumbers = record.kind.endsWith('-en')
    ? [['thirteen', '13']]
    : [['treize', '13']];
  for (const [word, number] of writtenNumbers) text = text.replace(new RegExp(`\\b${word}\\b`, 'giu'), number);
  if (!record.kind.endsWith('-en')) {
    const scale = String.raw`(?:mille\s+milliards?|milliards?|millions?|Md|Mio)`;
    const currency = String.raw`(?:RMB|USD|EUR|JPY|CNY|CNH|yuan|yuans|dollars?|euros?|[$€£¥])`;
    const range = new RegExp(String.raw`\bde\s+(${NUMBER_PATTERN})\s+à\s+(${NUMBER_PATTERN})\s+(${scale})(\s+(?:de\s+)?${currency})?`, 'giu');
    text = text.replace(range, (_match, from, to, unit, suffix = '') => `de ${from} ${unit}${suffix} à ${to} ${unit}${suffix}`);
  }
  return text;
}

function quantities(record) {
  const locale = record.kind.endsWith('-en') ? 'en' : 'fr';
  const values = new Map();
  for (const match of comparableText(record).matchAll(QUANTITY)) {
    const key = quantityKey(match, locale);
    if (!key) continue;
    if (!values.has(key)) values.set(key, new Set());
    values.get(key).add(match[0].trim());
  }
  return values;
}

function comparableQuantityKey(key) {
  const [kind, value] = key.split(':');
  return ['RMB', 'USD', 'EUR', 'JPY', 'GBP', 'scaled'].includes(kind) ? `amount:${value}` : key;
}

function translationKey(record) {
  if (record.kind === 'post-en') return `post:${record.fields.get('sourceArticle') ?? ''}`;
  if (record.kind === 'guide-en') return `guide:${record.fields.get('sourceGuide') ?? ''}`;
  if (record.kind === 'post-fr') return `post:${record.slug}`;
  if (record.kind === 'guide-fr') return `guide:${record.slug}`;
  return '';
}

function sourceDate(record) {
  return record.fields.get('updatedDate') || record.fields.get('pubDate') || '';
}

function isoDay(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

function auditPair(fr, en) {
  checked('FR/EN numbers', `${fr.slug} ↔ ${en.slug}`);
  const label = `${displayPath(fr.path)} ↔ ${displayPath(en.path)}`;
  const expectedSource = fr.slug;
  const actualSource = en.kind === 'post-en' ? en.fields.get('sourceArticle') : en.fields.get('sourceGuide');
  if (actualSource !== expectedSource) fail('FR/EN numbers', `${label}: English source linkage is ${actualSource || 'missing'}, expected ${expectedSource}`);

  const translatedAt = isoDay(en.fields.get('sourceUpdatedDate') ?? '');
  const sourceUpdatedAt = isoDay(sourceDate(fr));
  if (!translatedAt || !sourceUpdatedAt || translatedAt < sourceUpdatedAt) {
    fail('FR/EN numbers', `${label}: sourceUpdatedDate ${translatedAt || 'invalid'} is older than French source ${sourceUpdatedAt || 'invalid'}`);
  }

  const frNumbers = quantities(fr);
  const enNumbers = quantities(en);
  const enComparable = new Set([...enNumbers.keys()].map(comparableQuantityKey));
  const frComparable = new Set([...frNumbers.keys()].map(comparableQuantityKey));
  const missingEn = [...frNumbers.keys()].filter((key) => !enComparable.has(comparableQuantityKey(key)));
  const missingFr = [...enNumbers.keys()].filter((key) => !frComparable.has(comparableQuantityKey(key)));
  if (missingEn.length || missingFr.length) {
    const render = (keys, values) => keys.slice(0, 8).map((key) => [...values.get(key)].join('/')).join(', ');
    const parts = [];
    if (missingEn.length) parts.push(`FR-only ${render(missingEn, frNumbers)}`);
    if (missingFr.length) parts.push(`EN-only ${render(missingFr, enNumbers)}`);
    warn('FR/EN numbers', `${label}: probable numeric divergence (${parts.join('; ')})`);
  }

  const frUrls = fr.externalUrls ?? new Set(extractUrls(fr.source).map(({ raw }) => normalizeUrl(raw)));
  const enUrls = en.externalUrls ?? new Set(extractUrls(en.source).map(({ raw }) => normalizeUrl(raw)));
  const urlsMissingEn = [...frUrls].filter((url) => !enUrls.has(url));
  const urlsMissingFr = [...enUrls].filter((url) => !frUrls.has(url));
  if (urlsMissingEn.length || urlsMissingFr.length) {
    warn('FR/EN numbers', `${label}: external source URL sets differ (FR-only ${urlsMissingEn.length}, EN-only ${urlsMissingFr.length})`);
  }
}

async function filesUnder(directory) {
  const output = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) output.push(...await filesUnder(path));
    else if (entry.isFile() && CONTENT_EXTENSIONS.has(extname(entry.name))) output.push(path);
  }
  return output;
}

async function allContentFiles() {
  const lists = await Promise.all(CONTENT_ROOTS.map((directory) => filesUnder(join(ROOT, directory))));
  return lists.flat();
}

async function changedFiles() {
  const options = { cwd: ROOT, encoding: 'utf8', maxBuffer: 20 * 1024 * 1024 };
  const [{ stdout: changed }, { stdout: untracked }] = await Promise.all([
    execFileAsync('git', ['diff', '--name-only', '--diff-filter=ACMR', '-z', 'HEAD'], options),
    execFileAsync('git', ['ls-files', '--others', '--exclude-standard', '-z'], options),
  ]);
  return [...new Set(`${changed}${untracked}`.split('\0').filter(Boolean))].map((path) => resolve(ROOT, path));
}

async function loadRecord(path) {
  const source = await readFile(path, 'utf8');
  const parsed = parseFrontmatter(source, path);
  return {
    ...parsed,
    source,
    kind: contentKind(path),
    slug: contentSlug(path),
  };
}

async function auditChangedSecrets(paths) {
  checked('Secrets');
  for (const path of paths) {
    let metadata;
    try {
      metadata = await stat(path);
    } catch {
      continue;
    }
    if (!metadata.isFile() || metadata.size > 5 * 1024 * 1024) continue;
    const source = await readFile(path);
    if (source.includes(0)) continue;
    const text = source.toString('utf8');
    for (const [name, pattern] of SECRET_RULES) {
      pattern.lastIndex = 0;
      if (pattern.test(text)) fail('Secrets', `${displayPath(path)}: potential ${name}; value not displayed`);
    }
    const name = displayPath(path);
    if (/^src\/.*\.(?:astro|[cm]?[jt]sx?)$/u.test(name) && /\bconsole\.(?:debug|log)\s*\(|\bdebugger\s*;/u.test(text)) {
      warn('Secrets', `${name}: possible debug output found in application code`);
    }
  }
}

function tail(value, lines = 18) {
  let redacted = value;
  for (const [name, pattern] of SECRET_RULES) {
    pattern.lastIndex = 0;
    redacted = redacted.replace(pattern, `[REDACTED:${name}]`);
  }
  return redacted.trim().split('\n').slice(-lines).join('\n');
}

async function runSubcheck(category, label, command, args) {
  try {
    const { stdout, stderr } = await execFileAsync(command, args, {
      cwd: ROOT,
      encoding: 'utf8',
      env: process.env,
      maxBuffer: 40 * 1024 * 1024,
    });
    checked(category, label);
    return { ok: true, output: `${stdout}${stderr}` };
  } catch (error) {
    const output = `${error.stdout ?? ''}${error.stderr ?? ''}`;
    fail(category, `${label} failed${output.trim() ? `:\n${tail(output)}` : ''}`);
    return { ok: false, output };
  }
}

function printReport(records) {
  const errorCount = [...report.values()].reduce((sum, item) => sum + item.errors.length, 0);
  const warningCount = [...report.values()].reduce((sum, item) => sum + item.warnings.length, 0);
  const sourceSets = records.reduce((sets, record) => {
    for (const key of ['primary', 'reference', 'other']) {
      for (const url of record.sourceTiers?.[key] ?? []) sets[key].add(url);
    }
    return sets;
  }, { primary: new Set(), reference: new Set(), other: new Set() });
  const totalSources = new Set([...sourceSets.primary, ...sourceSets.reference, ...sourceSets.other]).size;

  console.log('\nl0g publication check\n');
  for (const category of CATEGORY_ORDER) {
    const item = result(category);
    const symbol = item.errors.length ? '✗' : item.warnings.length ? '⚠' : '✓';
    let detail = item.notes.at(-1) ?? `${item.checks} check(s)`;
    if (category === 'Build') detail = `${item.checks} check(s)`;
    if (category === 'Primary sources') detail = `${sourceSets.primary.size} primary / ${totalSources} external`;
    if (item.errors.length) detail = `${item.errors.length} error(s)`;
    else if (item.warnings.length) detail = `${item.warnings.length} warning(s)`;
    console.log(`${category.padEnd(18)} ${symbol} ${detail}`);
  }

  for (const level of ['errors', 'warnings']) {
    const heading = level === 'errors' ? 'ERRORS' : 'WARNINGS TO REVIEW';
    const entries = CATEGORY_ORDER.flatMap((category) => result(category)[level].map((message) => ({ category, message })));
    if (!entries.length) continue;
    console.log(`\n${heading}\n`);
    for (const { category, message } of entries.slice(0, 30)) console.log(`- [${category}] ${message}`);
    if (entries.length > 30) console.log(`- … ${entries.length - 30} more ${level}`);
  }

  console.log('');
  if (errorCount) console.log(`FAIL WITH ${errorCount} ERROR(S) AND ${warningCount} WARNING(S)`);
  else if (warningCount) console.log(`PASS WITH ${warningCount} WARNING(S)`);
  else console.log('PASS');
  return errorCount === 0;
}

function runSelfTest() {
  const parsed = parseFrontmatter('---\ntitle: "Test"\npubDate: 2026-08-31\n---\nBody');
  assert.equal(parsed.valid, true);
  assert.equal(parsed.fields.get('title'), 'Test');
  assert.equal(parseFrontmatter('title: missing delimiters').valid, false);

  const record = (body, kind) => ({ body, kind });
  const fr = quantities(record('373 Md$; 8 900 milliards de yuans; 53,9 %; 2026', 'post-fr'));
  const en = quantities(record('$373bn; RMB 8.9tn; 53.9%; 2026', 'post-en'));
  assert.deepEqual([...fr.keys()], [...en.keys()]);
  assert.ok(quantities(record('Q1 2021', 'post-en')).has('year:2021'));
  assert.deepEqual(
    [...quantities(record('0,2 point; treize points', 'post-fr')).keys()],
    [...quantities(record('0.2 percentage-point; 13 percentage points', 'post-en')).keys()],
  );

  const responsiveSvg = '<svg viewBox="0 0 100 50" role="img" aria-label="Test" style="width:100%;height:auto"><rect x="0" y="0" width="100" height="50"/></svg>';
  assert.deepEqual(analyzeSvg(responsiveSvg), { errors: [], warnings: [] });
  const overflowingSvg = '<svg viewBox="0 0 100 50" style="width:100%;height:auto"><rect x="90" y="0" width="20" height="50"/></svg>';
  assert.ok(analyzeSvg(overflowingSvg).errors.some((message) => message.includes('exceeds viewBox')));
  const externalSvg = '<svg viewBox="0 0 100 50" style="width:100%;height:auto"><image href="https://example.com/a.png" width="10" height="10"/></svg>';
  assert.ok(analyzeSvg(externalSvg).errors.some((message) => message.includes('external SVG reference')));
  assert.equal(normalizeUrl('https://example.com/a/?utm_source=x&b=2'), 'https://example.com/a?b=2');
  console.log('publish:check self-test OK');
}

async function main() {
  const argumentsList = process.argv.slice(2);
  if (argumentsList.includes('--self-test')) {
    runSelfTest();
    return;
  }

  const repositoryChanges = await changedFiles();
  const explicit = argumentsList.filter((argument) => !argument.startsWith('--')).map((path) => resolve(ROOT, path));
  const selected = argumentsList.includes('--all')
    ? await allContentFiles()
    : explicit.length ? explicit : repositoryChanges.filter((path) => contentKind(path));
  const contentPaths = [...new Set(selected)].filter((path) => contentKind(path) && CONTENT_EXTENSIONS.has(extname(path)));
  const records = await Promise.all(contentPaths.map(loadRecord));

  for (const record of records) {
    validateFrontmatter(record);
    auditUrls(record);
    auditSvgs(record);
    auditEditorialSignals(record);
  }
  if (!records.length) {
    checked('Frontmatter', 'no modified content file');
    checked('FR/EN numbers', 'no modified bilingual pair');
    checked('URLs', 'no modified content file');
    checked('Primary sources', 'no modified content file');
    checked('SVG', 'no modified content file');
    checked('Unsourced nums', 'no modified content file');
    checked('Causal claims', 'no modified content file');
    checked('Contemporary', 'no modified content file');
    checked('Style patterns', 'no modified content file');
  }

  const changedRecordsByPath = new Map(records.map((record) => [record.path, record]));
  const allRecords = await Promise.all((await allContentFiles()).map((path) => changedRecordsByPath.get(path) ?? loadRecord(path)));
  const byKey = new Map();
  for (const record of allRecords) {
    const key = translationKey(record);
    if (!byKey.has(key)) byKey.set(key, {});
    byKey.get(key)[record.kind.endsWith('-en') ? 'en' : 'fr'] = record;
  }
  const changedKeys = new Set(records.map(translationKey));
  for (const key of changedKeys) {
    const pair = byKey.get(key);
    if (!pair?.fr || !pair?.en) {
      const changed = records.find((record) => translationKey(record) === key);
      if (changed?.kind.endsWith('-en')) fail('FR/EN numbers', `${displayPath(changed.path)}: linked French source not found`);
      else checked('FR/EN numbers', `${changed?.slug ?? key}: no English counterpart`);
      continue;
    }
    if (!pair.fr.externalUrls) auditUrls(pair.fr);
    if (!pair.en.externalUrls) auditUrls(pair.en);
    auditPair(pair.fr, pair.en);
  }

  await auditChangedSecrets(repositoryChanges);
  if (!argumentsList.includes('--no-build')) {
    const astro = join(ROOT, 'node_modules/astro/bin/astro.mjs');
    await runSubcheck('Build', 'Astro check', process.execPath, [astro, 'check']);
    const build = await runSubcheck('Build', 'Astro build', process.execPath, [astro, 'build']);
    if (build.ok) await runSubcheck('URLs', 'Internal links', process.execPath, [join(ROOT, 'scripts/check-internal-links.mjs')]);
    await runSubcheck('Style patterns', 'Editorial lint', process.execPath, [join(ROOT, 'scripts/lint-editorial.mjs'), '--quiet']);
    await runSubcheck('Secrets', 'Repository/dist secret scan', process.execPath, [join(ROOT, 'scripts/audit-secrets.mjs')]);
  } else {
    checked('Build', 'skipped by --no-build');
  }

  process.exitCode = printReport(records) ? 0 : 1;
}

await main();
