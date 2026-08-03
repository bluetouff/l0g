export const SIGNAL_FRESHNESS_KEYS = ['us', 'eu', 'yen', 'energie', 'debt'];
export const SIGNAL_FRESHNESS_TIMELINESS_STATUSES = ['fresh', 'stale', 'unknown'];
export const SIGNAL_FRESHNESS_SOURCE_STATUSES = ['ok', 'fallback', 'missing'];
export const SIGNAL_FRESHNESS_QUALITY_STATUSES = [
  'nominal',
  'degraded',
  'official-delayed',
  'unknown',
  'missing',
];
export const SIGNAL_FRESHNESS_COVERAGE_STATUSES = ['complete', 'partial', 'missing'];
export const SIGNAL_FRESHNESS_MISSING_FIELDS = [
  'signalPresent',
  'observedAt',
  'sourcePublishedAt',
  'retrievedAt',
  'lastAttemptAt',
  'lastSuccessAt',
  'computedAt',
  'staleAfter',
];

const coverageProperties = Object.fromEntries(
  SIGNAL_FRESHNESS_MISSING_FIELDS.map((field) => [field, { type: 'boolean' }]),
);

export const SIGNAL_FRESHNESS_COVERAGE_OPENAPI_SCHEMA = {
  type: 'object',
  required: SIGNAL_FRESHNESS_MISSING_FIELDS,
  additionalProperties: false,
  properties: coverageProperties,
};

export const SIGNAL_FRESHNESS_OPENAPI_SCHEMA = {
  type: 'object',
  required: [
    'key',
    'label',
    'source',
    'methodology',
    'observedAt',
    'sourcePublishedAt',
    'sourceCheckedAt',
    'retrievedAt',
    'lastAttemptAt',
    'lastSuccessAt',
    'computedAt',
    'staleAfter',
    'expiresAt',
    'timelinessStatus',
    'sourceStatus',
    'qualityStatus',
    'fallbackUsed',
    'fallbackReason',
    'warnings',
    'coverageStatus',
    'coverage',
    'missing',
    'note',
  ],
  additionalProperties: false,
  properties: {
    key: { enum: SIGNAL_FRESHNESS_KEYS },
    label: { type: 'string' },
    source: { type: 'string', format: 'uri' },
    methodology: { type: 'string', format: 'uri' },
    observedAt: { type: ['string', 'null'], format: 'date-time' },
    sourcePublishedAt: { type: ['string', 'null'], format: 'date-time' },
    sourceCheckedAt: { type: ['string', 'null'], format: 'date-time' },
    retrievedAt: { type: ['string', 'null'], format: 'date-time' },
    lastAttemptAt: { type: ['string', 'null'], format: 'date-time' },
    lastSuccessAt: { type: ['string', 'null'], format: 'date-time' },
    computedAt: { type: 'string', format: 'date-time' },
    staleAfter: { type: 'string', pattern: '^P(?:\\d+D|T\\d+H)$' },
    expiresAt: { type: ['string', 'null'], format: 'date-time' },
    timelinessStatus: { enum: SIGNAL_FRESHNESS_TIMELINESS_STATUSES },
    sourceStatus: { enum: SIGNAL_FRESHNESS_SOURCE_STATUSES },
    qualityStatus: { enum: SIGNAL_FRESHNESS_QUALITY_STATUSES },
    fallbackUsed: { type: 'boolean' },
    fallbackReason: { type: ['string', 'null'] },
    warnings: { type: 'array', items: { type: 'string' } },
    coverageStatus: { enum: SIGNAL_FRESHNESS_COVERAGE_STATUSES },
    coverage: { $ref: '#/components/schemas/SignalFreshnessCoverage' },
    missing: { type: 'array', items: { enum: SIGNAL_FRESHNESS_MISSING_FIELDS } },
    note: { type: 'string' },
  },
};
