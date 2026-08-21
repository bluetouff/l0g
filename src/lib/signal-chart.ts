export const SIGNAL_CHART_DAY_MS = 86_400_000;

export type SignalChartPoint = {
  date: string;
  value: number;
  evidence: 'attested-archive' | 'operational-archive' | 'current-snapshot';
  methodologyVersion: string | null;
};

export type SignalChartSeries = {
  key: string;
  name: string;
  color: string;
  dashPattern?: string;
  points: SignalChartPoint[];
};

export type SignalChartMove = {
  key: string;
  name: string;
  baseline: SignalChartPoint | null;
  latest: SignalChartPoint | null;
  delta: number | null;
  direction: 'up' | 'down' | 'flat' | 'missing';
};

export type SignalChartSnapshot = {
  start: number;
  end: number;
  series: Array<SignalChartSeries & { visiblePoints: SignalChartPoint[] }>;
  moves: SignalChartMove[];
  counts: { up: number; down: number; flat: number; missing: number };
  strongest: SignalChartMove | null;
};

function sortedNumericPoints(points: SignalChartPoint[]) {
  return points
    .filter((point) => Number.isFinite(point.value) && Number.isFinite(Date.parse(point.date)))
    .sort((left, right) => Date.parse(left.date) - Date.parse(right.date));
}
export function directionForDelta(delta: number | null): SignalChartMove['direction'] {
  if (delta == null || !Number.isFinite(delta)) return 'missing';
  if (delta > 0.5) return 'up';
  if (delta < -0.5) return 'down';
  return 'flat';
}

export function buildSignalChartSnapshot(
  series: SignalChartSeries[],
  start: number,
  end: number,
): SignalChartSnapshot {
  const safeStart = Math.min(start, end);
  const safeEnd = Math.max(start, end);
  const moves: SignalChartMove[] = [];

  const visibleSeries = series.map((item) => {
    const points = sortedNumericPoints(item.points).filter((point) => Date.parse(point.date) <= safeEnd);
    const baseline = points.filter((point) => Date.parse(point.date) <= safeStart).at(-1) ?? null;
    const latest = points.at(-1) ?? null;
    const inWindow = points.filter((point) => {
      const time = Date.parse(point.date);
      return time > safeStart && time <= safeEnd;
    });
    const visiblePoints = baseline ? [baseline, ...inWindow] : inWindow;
    const delta = baseline && latest ? latest.value - baseline.value : null;
    moves.push({
      key: item.key,
      name: item.name,
      baseline,
      latest,
      delta,
      direction: directionForDelta(delta),
    });
    return { ...item, visiblePoints };
  });

  const counts = {
    up: moves.filter((move) => move.direction === 'up').length,
    down: moves.filter((move) => move.direction === 'down').length,
    flat: moves.filter((move) => move.direction === 'flat').length,
    missing: moves.filter((move) => move.direction === 'missing').length,
  };
  const strongest = moves
    .filter((move): move is SignalChartMove & { delta: number } => move.delta != null)
    .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta))[0] ?? null;

  return { start: safeStart, end: safeEnd, series: visibleSeries, moves, counts, strongest };
}
