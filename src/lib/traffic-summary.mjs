const HTTP_CLASSES = ['human_html', 'mcp_api', 'social_previews', 'known_crawlers', 'scans', 'other'];

// The classes are mutually exclusive in human-traffic-report. A missing category
// makes the total unknown; it must never become an implicit zero.
export function totalHttpRequests(report) {
  const totals = report?.traffic_classes?.totals;
  if (!totals || HTTP_CLASSES.some(key => !Number.isSafeInteger(totals[key]) || totals[key] < 0)) return null;
  const total = HTTP_CLASSES.reduce((sum, key) => sum + totals[key], 0);
  return Number.isSafeInteger(total) ? total : null;
}
