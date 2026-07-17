import type { APIRoute, GetStaticPaths } from 'astro';
import {
  buildSignalHistoryNdjsonRows,
  signalSeriesRegistry,
  type SignalKey,
} from '../../../../../lib/signal-history.ts';
import { ndjsonResponse } from '../../../../../lib/agent-surface.ts';

export const getStaticPaths = (() =>
  signalSeriesRegistry().map((series) => ({
    params: { slug: series.slug },
    props: { key: series.key },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  ndjsonResponse(buildSignalHistoryNdjsonRows(props.key as SignalKey));
