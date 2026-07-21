export type ScannedHtmlElement = {
  name: string;
  attributes: ReadonlyMap<string, string>;
  body: string;
  start: number;
  end: number;
};

const RAW_TEXT_ELEMENTS = new Set(['script', 'style']);

function isSpace(character: string) {
  return character === ' ' || character === '\n' || character === '\r' || character === '\t' || character === '\f';
}

function isNameCharacter(character: string) {
  const code = character.charCodeAt(0);
  return (code >= 48 && code <= 57) || (code >= 65 && code <= 90) ||
    (code >= 97 && code <= 122) || character === ':' || character === '-' || character === '_';
}

function findTagEnd(source: string, start: number) {
  let quote = '';
  for (let index = start; index < source.length; index += 1) {
    const character = source[index];
    if (quote) {
      if (character === quote) quote = '';
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character === '>') {
      return index;
    }
  }
  return -1;
}

function parseAttributes(source: string, start: number, end: number) {
  const attributes = new Map<string, string>();
  let index = start;
  while (index < end) {
    while (index < end && (isSpace(source[index]) || source[index] === '/')) index += 1;
    const nameStart = index;
    while (index < end && isNameCharacter(source[index])) index += 1;
    if (nameStart === index) {
      index += 1;
      continue;
    }
    const name = source.slice(nameStart, index).toLowerCase();
    while (index < end && isSpace(source[index])) index += 1;
    let value = '';
    if (source[index] === '=') {
      index += 1;
      while (index < end && isSpace(source[index])) index += 1;
      const quote = source[index] === '"' || source[index] === "'" ? source[index] : '';
      if (quote) index += 1;
      const valueStart = index;
      if (quote) {
        while (index < end && source[index] !== quote) index += 1;
        value = source.slice(valueStart, index);
        if (source[index] === quote) index += 1;
      } else {
        while (index < end && !isSpace(source[index]) && source[index] !== '>') index += 1;
        value = source.slice(valueStart, index);
      }
    }
    if (!attributes.has(name)) attributes.set(name, value);
  }
  return attributes;
}

function findClosingElement(lower: string, name: string, start: number) {
  let cursor = start;
  while (cursor < lower.length) {
    const candidate = lower.indexOf(`</${name}`, cursor);
    if (candidate < 0) return -1;
    const boundary = lower[candidate + name.length + 2] || '';
    if (!boundary || isSpace(boundary) || boundary === '>') return candidate;
    cursor = candidate + 2;
  }
  return -1;
}

export function scanHtmlElements(value: string): ScannedHtmlElement[] {
  const source = String(value || '');
  const lower = source.toLowerCase();
  const elements: ScannedHtmlElement[] = [];
  let cursor = 0;
  while (cursor < source.length) {
    const start = source.indexOf('<', cursor);
    if (start < 0) break;
    if (source.startsWith('<!--', start)) {
      const commentEnd = source.indexOf('-->', start + 4);
      cursor = commentEnd < 0 ? source.length : commentEnd + 3;
      continue;
    }
    let index = start + 1;
    if (source[index] === '/' || source[index] === '!' || source[index] === '?') {
      cursor = Math.max(start + 1, findTagEnd(source, index + 1) + 1);
      continue;
    }
    const nameStart = index;
    while (index < source.length && isNameCharacter(source[index])) index += 1;
    if (nameStart === index) {
      cursor = start + 1;
      continue;
    }
    const name = source.slice(nameStart, index).toLowerCase();
    const openingEnd = findTagEnd(source, index);
    if (openingEnd < 0) break;
    const attributes = parseAttributes(source, index, openingEnd);
    let body = '';
    let end = openingEnd + 1;
    if (RAW_TEXT_ELEMENTS.has(name)) {
      const closingStart = findClosingElement(lower, name, openingEnd + 1);
      if (closingStart < 0) {
        body = source.slice(openingEnd + 1);
        end = source.length;
      } else {
        body = source.slice(openingEnd + 1, closingStart);
        const closingEnd = findTagEnd(source, closingStart + name.length + 2);
        end = closingEnd < 0 ? source.length : closingEnd + 1;
      }
    }
    elements.push({ name, attributes, body, start, end });
    cursor = end;
  }
  return elements;
}

function looksLikeTag(source: string, start: number) {
  let index = start + 1;
  if (source[index] === '/') index += 1;
  return source.startsWith('!--', index) || isNameCharacter(source[index] || ' ');
}

export function stripHtmlTags(value: string) {
  const source = String(value || '');
  let output = '';
  let cursor = 0;
  while (cursor < source.length) {
    const start = source.indexOf('<', cursor);
    if (start < 0) return output + source.slice(cursor);
    output += source.slice(cursor, start);
    if (!looksLikeTag(source, start)) {
      output += '<';
      cursor = start + 1;
      continue;
    }
    const end = source.startsWith('<!--', start)
      ? source.indexOf('-->', start + 4)
      : findTagEnd(source, start + 1);
    if (end < 0) return output + source.slice(start);
    output += ' ';
    cursor = source.startsWith('<!--', start) ? end + 3 : end + 1;
  }
  return output;
}

export function removeHtmlElementBlocks(value: string, elementName: string) {
  const source = String(value || '');
  const name = elementName.toLowerCase();
  const lower = source.toLowerCase();
  let output = '';
  let cursor = 0;
  while (cursor < source.length) {
    const start = lower.indexOf(`<${name}`, cursor);
    if (start < 0) return output + source.slice(cursor);
    const boundary = lower[start + name.length + 1] || '';
    if (boundary && !isSpace(boundary) && boundary !== '>' && boundary !== '/') {
      output += source.slice(cursor, start + 1);
      cursor = start + 1;
      continue;
    }
    output += source.slice(cursor, start);
    const openingEnd = findTagEnd(source, start + name.length + 1);
    if (openingEnd < 0) return output;
    const closingStart = findClosingElement(lower, name, openingEnd + 1);
    if (closingStart < 0) {
      cursor = openingEnd + 1;
      continue;
    }
    const closingEnd = findTagEnd(source, closingStart + name.length + 2);
    cursor = closingEnd < 0 ? source.length : closingEnd + 1;
    output += ' ';
  }
  return output;
}
