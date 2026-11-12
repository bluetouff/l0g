const identifier = '[A-Za-z_$][\\w$]*';
const whitespace = '[ \\t\\r\\n]';
const namedImports = '\\{[\\w$ \\t\\r\\n,]*\\}';
const namespaceImport = `\\*${whitespace}+as${whitespace}+${identifier}`;
const bindings = `(?:${identifier}(?:${whitespace}*,${whitespace}*(?:${namedImports}|${namespaceImport}))?|${namedImports}|${namespaceImport})`;
const staticImport = new RegExp(
  `^import[ \\t]+(?:(?:type[ \\t]+)?${bindings}${whitespace}+from${whitespace}+)?(['"])[^'"\\r\\n]+\\1[ \\t]*;?[ \\t]*\\r?(?=\\n|$)`
);

/** Remove MDX setup declarations from prose without changing fenced code examples. */
export function stripMdxImports(value: string) {
  const lines = String(value || '').split('\n');
  const output: string[] = [];
  let fence: { character: string; length: number } | undefined;

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (marker) {
      if (!fence) {
        fence = { character: marker[1][0], length: marker[1].length };
      } else if (marker[1][0] === fence.character && marker[1].length >= fence.length && !marker[2].trim()) {
        fence = undefined;
      }
      output.push(line);
      continue;
    }
    if (!fence && /^import[ \t]/.test(line)) {
      const declaration = lines.slice(index).join('\n').match(staticImport)?.[0];
      if (declaration) {
        const lineCount = declaration.split('\n').length;
        output.push(...Array(lineCount).fill(''));
        index += lineCount - 1;
        continue;
      }
    }
    output.push(line);
  }
  return output.join('\n');
}
