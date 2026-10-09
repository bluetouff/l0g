// Editorial collision guard for the two SQL Server branches of CRS 3.3.7 rule
// 951220. It is not a replacement for the complete rule or its sql-errors.data
// prefilter. Keep its scope to homepages and publication pages.
// https://raw.githubusercontent.com/coreruleset/coreruleset/v3.3.7/rules/RESPONSE-951-DATA-LEAKAGES-SQL.conf
// ModSecurity applies DOTALL: an unrelated SVG coordinate or SHA further down
// the response can match, including across newlines.
export const modSecurityMssqlResponsePattern = /SQL Server[\s\S]*(?:Driver|[0-9a-f]{8})/i;

/** Accept a repository-relative built HTML path, as supplied by the audit. */
export function isMssqlResponseGuardPage(relativeFile) {
  return relativeFile === 'dist/index.html'
    || relativeFile === 'dist/en/index.html'
    || /^dist\/(?:en\/)?publications\/.+\.html$/u.test(relativeFile);
}

export function assertNoMssqlResponseCollision(relativeFile, html) {
  if (isMssqlResponseGuardPage(relativeFile) && modSecurityMssqlResponsePattern.test(html)) {
    throw new Error(`${relativeFile}: collision de contenu éditorial avec OWASP CRS 951220 dans la réponse HTML`);
  }
}
