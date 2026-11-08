# Private visibility tools

Node tooling for the existing static site. No browser analytics, provider SDK,
database, subscription, public report or new content route. No dependency added.
The public CI runs synthetic tests and public build validation only.

## Storage and commands

Default storage is `~/.local/share/l0g-visibility/`. Override with
`L0G_VISIBILITY_DIR` or `--data-dir /absolute/private/path`. Directories use 0700;
files use 0600. Repository paths, `/var/www`, `/srv/www`, the macOS web root,
their ancestors and symlink destinations are refused. Additional served roots
can be listed in the private `config.json` as `served_roots`. The operator must
declare any other document roots on their host. Do not put imports in this repo,
including ignored directories. A path ending in a symlink is not private storage.

```sh
npm run visibility:audit -- --dist dist
npm run visibility:live -- --max-urls 20 --rps 1
npm run visibility:import -- --source gsc --file /private/path/export.json
npm run visibility:import -- --source bing-ai --file /private/path/export.csv --metadata /private/path/metadata.json
npm run visibility:import -- --source panel-definition --file /private/path/questions.json
npm run visibility:import -- --source panel --file /private/path/observations.json
npm run visibility:import -- --source traffic --file /private/path/access.log
npm run visibility:report
npm run visibility:indexnow -- --dry-run
npm run test:visibility
```

The audit extends `audit-indexation-cohort.mjs` and the shared HTML scanner.
Source inventory is read with the installed YAML parser, preserving source IDs,
drafts and translation linkage. No source date is changed. The same audit runs
after the existing build through `visibility:check-build`, without writing a
private report, accessing private configuration or running a second Astro build.
Use `visibility:audit -- --strict` to return exit 2 for local audit findings;
without `--strict` the findings are still explicitly recorded as errors.

Report files are `report.html`, `report.json`, `search.csv` and `panel.csv`.
Open HTML directly from disk. It requires no server or network. Filters operate
locally. Export links point to local evidence files with SHA-256 and JSON keys.
The report has no access to credentials and executes no imported HTML or code.
It shows each import separately, never sums page and query projections.

The report reads optional private `deployment-verification.json` and
`console-connections.json` evidence. A verified deployment needs matching
expected/remote/served SHAs, one successful completed build and CodeQL run for
that SHA, and a matching successful live probe. Missing, stale, future-dated or
inconsistent evidence cannot produce a verified state. The dated deployment
summary is separate from the collapsed historical action log. A verified Bing
property, a missing import and an imported empty export are distinct states.

Use `visibility:import -- --demo ... --data-dir /private/separate-demo` for
synthetic examples. The data mode is fixed by the first import. Mixing real
and demo imports is refused. Demo reports carry a visible synthetic banner,
and IndexNow sending is blocked in demo mode. Never import these examples
into a real measurement directory.

Console states start as **not configured**. An imported file does not establish
a live authenticated connection. No paid adapter is executable in this version;
the budget and incurred API cost remain zero. Manual observations and API
observations are distinct categories. Source-collection automation can be added
later only with verified APIs, tariffs, currency-specific reservations and quotas.

## Search imports: normalized v1 only

`gsc`, `bing` and `bing-ai` accept the project's normalized format, not unverified
native console exports. For CSV, provide the metadata object separately using
`--metadata`. Convert a console export privately, keeping its native dates and
timezone and documenting missing/anonymized rows. Unknown layouts are rejected.

Synthetic example (not a measurement):

```json
{
  "schema_version": "1.0.0",
  "source": "gsc",
  "format": "normalized-v1",
  "metadata": {
    "property": "sc-domain:l0g.fr",
    "report": "performance",
    "period": { "from": "2026-01-01", "through": "2026-01-31" },
    "exported_at": "2026-02-01T00:00:00Z",
    "timezone": "America/Los_Angeles",
    "dimensions": ["page"],
    "filters": {},
    "complete": false,
    "limitations": ["SYNTHETIC EXAMPLE; not an export from a console."]
  },
  "rows": [{
    "dimensions": { "page": "https://l0g.fr/synthetic-example/" },
    "metrics": { "clicks": 10, "impressions": 100, "position": null }
  }]
}
```

CSV headers use dimension names followed by metric names, such as
`page,clicks,impressions,position`. Numbers are unformatted decimal numbers.
Empty metrics become `null`, not zero. Allowed dimensions: `date`, `page`,
`query`, `country`, `device`, `theme`. Search metrics: `clicks`, `impressions`,
`position`. Bing AI metrics: `citations`, `cited_pages`; use native report labels
and describe their meaning and scope in `metadata.limitations`. Cited-page
counts and average positions are non-additive. Query-level citations are not
summed into an overall citation count. Google clicks are not labeled AI clicks.

Grain is source + property + report + dimensions + filters + native timezone.
Same-grain overlapping periods are rejected; an exact period can be replaced
explicitly with `--replace`. Identical imports are idempotent. Disjoint periods
remain separate records. Each CSV or JSON is limited to 8 MiB, 20,000 rows and
24 JSON nesting levels. Private state files have a separate 32 MiB ceiling;
exceeding it fails explicitly rather than silently truncating observations.

## Panel and observations

Panel definitions accept schema `1.0` or `1.0.0`, a `panel_version`,
`paid_execution_enabled: false`, and `questions`. Each question has `id`,
`pair_id`, `topic`, `language` (`fr`/`en`), `brand_mode` (`unbranded`,
`brand_diagnostic` or `branded`), `intent`, `prompt`, and boolean `pilot`.
Pairs must contain exactly one question per language and agree on theme,
brand mode and pilot membership. Changing question content under the same
version is refused. Previous panel definitions remain archived by hash.
Coverage review is a private human task; keyword proximity does not approve
an editorial relationship or establish full coverage.

Import a coverage review with `--source panel-coverage`. It carries schema
`1.0.0`, `panel_version`, exact `panel_hash` from the imported panel,
`reviewed_at`, `reviewer`, and `questions`. Review rows have `question_id`,
`status` (`supported_in_scope`, `partial`, `not_covered`, `not_reviewed`),
`reason`, and `evidence` (same-site `url` plus section `locator`). Missing
reviews make the coverage state partial. Coverage does not freeze a proposal,
create an answer or count as a fidelity review of an AI citation.

An observation file uses schema `1.0.0`, `panel_version`, `run`, `planned` and
`observations`. `run` contains `id`, `provider`, `surface` (`manual_ui`/`api`),
`model`, `region`, `parameters` (object), `isolated_context: true`,
`domain_forced` (boolean) and `session_protocol`. Record `unknown` for model or
region when unidentifiable. The protocol describes absence of l0g history,
memory, local files and MCP; the importer records the operator's declaration,
not a claim that it can inspect a third-party session. A forced-domain run
never contributes to spontaneous discovery.

`planned` is an array of `{ "question_id": "synthetic-fr", "repetition": 1 }`.
Each observation repeats those two fields and supplies:

- `at` (timezone-qualified timestamp, normalized to UTC), `duration_ms` (number
  or null), `status` (`valid`, `error`, `quota`, `refused`, `search_unavailable`);
- `response_language` (`fr`, `en`, `other`, `unknown`), `web_search`
  (`observed`, `not_observed`, `unknown`), `answer`;
- `citations` (array), `intermediate_queries` (array of observed queries or
  the literal `not_available`), `cost` (null or `{ "amount": 0, "currency": "USD" }`).

An observation is eligible for the search-citation denominator only when its
execution is valid, its language matches the question and web search was
observed. Other observations remain in execution accounting and exclusions.
Missing observations remain missing. Run IDs are immutable; use a new run for
each wave. The importer never creates an observation from a planned slot.

Citations have `url`, `kind` (`final`, `consulted` or `link`), optional `claim`, and
optional `review`. An unreviewed citation defaults to `not_reviewed`.
Review states: `supports`, `partially_supports`, `does_not_support`,
`outdated_for_claim`, `not_reviewed`, `source_unavailable`. A completed review
requires `method` (`human`/`automatic`), `reviewer`, `at`, `reason`, `excerpt`.
For `source_unavailable`, use `excerpt: null` when no passage is available.
Only human reviews with available evidence enter the fidelity denominator;
partials, disagreements and outdated evidence remain in it. Automatic opinions
do not become human reviews. The report exposes review coverage and all states.

The main hostname is matched exactly. Any permitted subdomains must be listed
explicitly in private `config.json` under `allowed_subdomains`; they remain
separate from main-domain citation rates. Tracking parameters are removed from
retained URLs; functional parameters survive. URLs containing credentials,
secret parameters or assistant conversation paths are refused. No external
citation-fetching mode is enabled. Source fidelity therefore requires a real
manual review; it is never inferred from a successful HTTP response.

The standalone URL cleaner preserves the exact query of signed URLs. It does
not rewrite their encoding or remove fields covered by a signature. Sensitive
signed URLs are refused by evidence retention instead of being copied into
reports. Citation deduplication preserves section fragments and distinct claims.

## Traffic

Uses `classifyTrafficRequest` and `parseHumanHtmlRequest` from the existing
human-traffic module. Raw logs are consumed transiently, never copied to the
private store. Output contains only a disjoint date/class/referrer partition,
with k=5 suppression and no overlapping totals. IPs, query strings, cookies,
complete referrers, conversation paths and user agents are not retained.
Complementary suppression hides one additional publishable referrer cell when
a small cell shares a date/class group, preventing subtraction from existing
public class totals. No suppressed-cell counts or additional margins are emitted.
Assistant referrers are a small explicit hostname list in `traffic.mjs`, not
proof of a citation. Internal probes are separate. Declared crawlers are not
authenticated. No IP verification or firewall change is performed. Raw Apache
retention is an independent server policy, not modified by this tool.

Traffic cells older than 91 days are discarded on import and report refresh.
Raw-log imports are limited to 20,000 lines. Rejected log records make an
import partial, or an error when none can be parsed, rather than a false empty
success. Compression is not inferred; provide a bounded plain combined log.
The operator should schedule refresh for automatic pruning. No private traffic
breakdown is added to the existing public traffic API.

## IndexNow and public probes

Probes are bounded (4–100 URLs, 0.2–1 request/second, default 20 at 1 rps), with
the internal User-Agent `l0g-visibility-probe/1.0`. They reuse the existing SEO
live-probe contract. Host allowlist is `l0g.fr` only, HTTPS only. DNS answers and
the actual connection peer are checked, with a pinned address. Responses have
timeouts and size limits; redirects are inspected without following them.
No robot authentication is inferred from a substituted User-Agent. Errors
produce partial results and exit 3. There are no hidden retries or external
crawling. Caller-provided network errors and response bodies are not logged.

IndexNow defaults to offline simulation. A useful delta requires two manifests:

```sh
npm run visibility:indexnow -- --dry-run --deployment /private/current.json --previous /private/previous.json
```

Each manifest has `schema_version: "1.0.0"`, `successful: true`, `sha` (40 hex
characters), `verified_at` (UTC), and `routes` containing public canonical
`url` and `hash` (SHA-256 of the actual deployed HTML). Produce these receipts
from successful releases, not an arbitrary dirty local build. Only changed,
added or removed URLs are selected. No initial mass submission is inferred.

Sending additionally requires `--send`, a recent live SHA matching the current
manifest, current indexable-route validation, and private config:
`indexnow: { enabled: true, key: "…", key_location: "https://l0g.fr/….txt" }`.
The proof file must already be served at the domain root with the exact key.
The tool does not create or publish this proof. Maximum 100 URLs per execution;
acknowledged notification IDs are retained for replay safety. HTTP 200 means
received; 202 means received with key validation pending. Neither proves
indexation or citation. A notification failure never changes a release result.
Protocol reference: [IndexNow documentation](https://www.indexnow.org/documentation).

## Local operation and rollback

`visibility:daily` is a no-op unless private config sets `daily_enabled: true`.
It checks ten public URLs and refreshes the private live receipt. Weekly
consolidation (`visibility:weekly`) generates the report from available local
data and prunes expired traffic. Neither command calls a paid provider.

`visibility:schedule` writes user-systemd services/timers into the private
directory using this host's actual Node and repository paths. It does not
install or start them. Generate on the Debian host where they will run; choose
persistent private storage outside served roots. Link the four files using
`systemctl --user link /absolute/private/l0g-visibility-daily.service` (and the
other service/timers), run `systemctl --user daemon-reload`, then explicitly
enable the selected timers. Stop with `systemctl --user disable --now
l0g-visibility-daily.timer l0g-visibility-weekly.timer`. The daily collection
also has the config kill switch. No root or deploy credential is required.

Every mutating command uses one exclusive lock and atomic file replacement.
Exit codes: 0 completed (inspect explicit data states), 1 input/configuration
error, 2 strict local audit errors, 3 partial execution or network failure,
4 concurrent execution refused. After a crash inspect `.lock`, confirm its PID
is no longer running and remove only that stale lock. No automatic lock theft.

Code rollback uses targeted reverts on main and the existing release rollback
procedure; do not reset unrelated changes. Private schema v1 files remain
readable independently as JSON/CSV, and prior import proofs are retained.
Stopping the tooling does not delete its evidence. No production activation,
console verification, domain proof or performance gain is implied by passing
local tests.
