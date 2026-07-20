/**
 * Serialize data embedded in a <script> raw-text context.
 *
 * JSON.stringify() alone does not neutralize an HTML end tag. Escaping every
 * '<' prevents values such as '</script>' from terminating JSON-LD or widget
 * configuration blocks before the browser hands their contents to JavaScript.
 */
export function serializeInlineScriptData(value: unknown): string {
  const json = JSON.stringify(value);
  if (json === undefined) {
    throw new TypeError('Inline script data must be JSON-serializable');
  }

  return json
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
