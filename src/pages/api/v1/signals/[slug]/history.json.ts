import type { APIRoute, GetStaticPaths } from 'astro';
import {
  buildSignalSeriesSurface,
  signalSeriesRegistry,
  type SignalKey,
} from '../../../../../lib/signal-history.ts';
import { jsonResponse } from '../../../../../lib/agent-surface.ts';

export const getStaticPaths = (() =>
  signalSeriesRegistry().map((series) => ({
    params: { slug: series.slug },
    props: { key: series.key },
  }))) satisfies GetStaticPaths;

export const GET: APIRoute = ({ props }) =>
  jsonResponse(buildSignalSeriesSurface(props.key as SignalKey));
