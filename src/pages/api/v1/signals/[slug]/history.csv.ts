import type { APIRoute, GetStaticPaths } from 'astro';
import {
  buildSignalHistoryCsv,
  signalSeriesRegistry,
  type SignalKey,
} from '../../../../../lib/signal-history.ts';
import { textResponse } from '../../../../../lib/agent-surface.ts';

export const getStaticPaths = (() =>
  signalSeriesRegistry().map((series) => ({
    params: { slug: series.slug },
    props: { key: series.key },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  textResponse(buildSignalHistoryCsv(props.key as SignalKey), 'text/csv; charset=utf-8');
