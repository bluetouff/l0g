import {
  buildSignalChartSnapshot,
  SIGNAL_CHART_DAY_MS,
  type SignalChartPoint,
  type SignalChartSeries,
} from '../lib/signal-chart.ts';

const SVG_NS = 'http://www.w3.org/2000/svg';
const WIDTH = 920;
const HEIGHT = 360;
const PAD_X = 50;
const PAD_TOP = 32;
const PAD_BOTTOM = 48;
const PLOT_WIDTH = WIDTH - PAD_X * 2;
const PLOT_HEIGHT = HEIGHT - PAD_TOP - PAD_BOTTOM;
const EVIDENCE_LABELS: Record<SignalChartPoint['evidence'], string> = {
  'operational-archive': 'historique opérationnel',
  'attested-archive': 'archive attestée',
  'current-snapshot': 'point courant',
};

function svgElement<K extends keyof SVGElementTagNameMap>(name: K, attributes: Record<string, string | number> = {}) {
  const element = document.createElementNS(SVG_NS, name);
  for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, String(value));
  return element;
}

function formatDate(value: string | number) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(value));
}

function formatAxisDate(value: number) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(value));
}

function plural(count: number, singular: string, pluralForm: string) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

document.querySelectorAll<HTMLElement>('[data-signal-history-chart]').forEach((root) => {
  if (root.dataset.ready === 'true') return;
  const dataNode = root.querySelector<HTMLElement>('[data-chart-data]');
  const layer = root.querySelector<SVGGElement>('[data-series-layer]');
  const startLabel = root.querySelector<SVGTextElement>('[data-axis-start]');
  const endLabel = root.querySelector<SVGTextElement>('[data-axis-end]');
  const summary = root.querySelector<HTMLElement>('[data-chart-summary]');
  const subtitle = root.querySelector<HTMLElement>('[data-chart-subtitle]');
  const tooltip = root.querySelector<HTMLElement>('[data-chart-tooltip]');
  const tooltipDate = root.querySelector<HTMLElement>('[data-tooltip-date]');
  const tooltipName = root.querySelector<HTMLElement>('[data-tooltip-name]');
  const tooltipValue = root.querySelector<HTMLElement>('[data-tooltip-value]');
  const tooltipEvidence = root.querySelector<HTMLElement>('[data-tooltip-evidence]');
  const tooltipMethod = root.querySelector<HTMLElement>('[data-tooltip-method]');
  const plot = root.querySelector<SVGSVGElement>('[data-chart-plot]');
  const freeRange = root.querySelector<HTMLElement>('[data-free-range]');
  const startInput = root.querySelector<HTMLInputElement>('[data-range-start]');
  const endInput = root.querySelector<HTMLInputElement>('[data-range-end]');
  if (!dataNode || !layer || !startLabel || !endLabel || !summary || !subtitle || !tooltip || !plot || !freeRange || !startInput || !endInput) return;
  const chartLayer = layer;
  const chartStartLabel = startLabel;
  const chartEndLabel = endLabel;
  const chartSummary = summary;
  const chartSubtitle = subtitle;
  const chartTooltip = tooltip;
  const chartPlot = plot;

  let series: SignalChartSeries[];
  try {
    series = JSON.parse(dataNode.textContent || '[]') as SignalChartSeries[];
  } catch {
    return;
  }
  const allDates = series.flatMap((item) => item.points.map((point) => Date.parse(point.date))).filter(Number.isFinite);
  if (!allDates.length) return;
  const absoluteStart = Math.min(...allDates);
  const absoluteEnd = Math.max(...allDates);
  let start = absoluteEnd - 7 * SIGNAL_CHART_DAY_MS;
  let end = absoluteEnd;
  let isolatedKey: string | null = null;
  let activeWindow = '7';

  startInput.min = new Date(absoluteStart).toISOString().slice(0, 10);
  startInput.max = new Date(absoluteEnd).toISOString().slice(0, 10);
  startInput.value = new Date(start).toISOString().slice(0, 10);
  endInput.min = startInput.min;
  endInput.max = startInput.max;
  endInput.value = new Date(end).toISOString().slice(0, 10);

  function xFor(date: string) {
    const ratio = Math.max(0, Math.min(1, (Date.parse(date) - start) / Math.max(1, end - start)));
    return PAD_X + ratio * PLOT_WIDTH;
  }

  function yFor(value: number) {
    return HEIGHT - PAD_BOTTOM - (value / 100) * PLOT_HEIGHT;
  }

  function hideTooltip() {
    chartTooltip.hidden = true;
  }

  function showTooltip(point: SignalChartPoint, item: SignalChartSeries, x: number, y: number) {
    if (tooltipDate) tooltipDate.textContent = formatDate(point.date);
    if (tooltipName) tooltipName.textContent = item.name;
    if (tooltipValue) tooltipValue.textContent = `${point.value}/100`;
    if (tooltipEvidence) tooltipEvidence.textContent = EVIDENCE_LABELS[point.evidence];
    if (tooltipMethod) tooltipMethod.textContent = point.methodologyVersion
      ? `méthode v${point.methodologyVersion}`
      : 'méthode non versionnée';
    chartTooltip.hidden = false;
    const plotRect = chartPlot.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    const cssX = plotRect.left - rootRect.left + (x / WIDTH) * plotRect.width;
    const cssY = plotRect.top - rootRect.top + (y / HEIGHT) * plotRect.height;
    const tooltipWidth = chartTooltip.offsetWidth;
    const left = Math.max(8, Math.min(root.clientWidth - tooltipWidth - 8, cssX - tooltipWidth / 2));
    chartTooltip.style.left = `${left}px`;
    chartTooltip.style.top = `${Math.max(8, cssY - chartTooltip.offsetHeight - 16)}px`;
  }

  function renderSummary() {
    const snapshot = buildSignalChartSnapshot(series, start, end);
    const strongest = snapshot.strongest;
    const missing = snapshot.counts.missing
      ? ` ${plural(snapshot.counts.missing, 'comparaison manque', 'comparaisons manquent')} faute de baseline.`
      : '';
    const strongestText = strongest?.delta != null
      ? ` Plus fort mouvement : ${strongest.name}, ${strongest.delta > 0 ? '+' : ''}${strongest.delta.toFixed(1).replace('.0', '')} points.`
      : '';
    const windowLabel = activeWindow === '1' ? 'Depuis 24 heures' : activeWindow === '7'
      ? 'Depuis sept jours' : activeWindow === '30' ? 'Depuis trente jours' : `Du ${formatDate(start)} au ${formatDate(end)}`;
    chartSummary.textContent = `${windowLabel} : ${plural(snapshot.counts.up, 'score monte', 'scores montent')}, ${plural(snapshot.counts.down, 'baisse', 'baissent')}, ${plural(snapshot.counts.flat, 'reste stable', 'restent stables')}.${strongestText}${missing}`;
    chartSubtitle.textContent = `Fenêtre du ${formatDate(start)} au ${formatDate(end)}. La comparaison prend le dernier point publié au plus tard au début de la période.`;
  }

  function renderLegendState() {
    root.querySelectorAll<HTMLButtonElement>('[data-series-toggle]').forEach((button) => {
      const selected = isolatedKey === button.dataset.seriesToggle;
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('is-selected', selected);
      button.classList.toggle('is-muted', isolatedKey !== null && !selected);
    });
  }

  function renderChart() {
    hideTooltip();
    const snapshot = buildSignalChartSnapshot(series, start, end);
    chartLayer.replaceChildren();
    chartStartLabel.textContent = formatAxisDate(start);
    chartEndLabel.textContent = formatAxisDate(end);

    for (const item of snapshot.series) {
      if (isolatedKey && isolatedKey !== item.key) continue;
      const points = item.visiblePoints;
      if (!points.length) continue;
      const coordinates = points.map((point) => ({ point, x: xFor(point.date), y: yFor(point.value) }));
      const pathData = coordinates.map(({ x, y }, index) => `${index ? 'L' : 'M'} ${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');

      if (coordinates.length > 1) {
        const glow = svgElement('path', {
          d: pathData,
          fill: 'none',
          stroke: item.color,
          'stroke-width': 9,
          'stroke-opacity': 0.12,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
        });
        chartLayer.append(glow);
      }
      const path = svgElement('path', {
        d: pathData,
        fill: 'none',
        stroke: item.color,
        'stroke-width': isolatedKey ? 3.6 : 2.8,
        'stroke-dasharray': item.dashPattern || '',
        'stroke-linecap': 'round',
        'stroke-linejoin': 'round',
      });
      chartLayer.append(path);

      for (const coordinate of coordinates) {
        const { point, x, y } = coordinate;
        const group = svgElement('g', { transform: `translate(${x} ${y})` });
        group.classList.add('chart-point');
        const title = svgElement('title');
        title.textContent = `${item.name} · ${formatDate(point.date)} · ${point.value}/100 · ${EVIDENCE_LABELS[point.evidence]} · ${point.methodologyVersion ? `méthode v${point.methodologyVersion}` : 'méthode non versionnée'}`;
        group.append(title);
        if (point.evidence === 'current-snapshot') {
          group.append(svgElement('rect', {
            x: -4,
            y: -4,
            width: 8,
            height: 8,
            rx: 1,
            fill: item.color,
            stroke: '#f8fafc',
            'stroke-width': 1.2,
          }));
        } else {
          group.append(svgElement('circle', {
            cx: 0,
            cy: 0,
            r: 3.6,
            fill: point.evidence === 'attested-archive' ? item.color : '#0b0f14',
            stroke: item.color,
            'stroke-width': point.evidence === 'attested-archive' ? 1 : 1.7,
          }));
        }
        const hit = svgElement('circle', {
          cx: 0,
          cy: 0,
          r: 12,
          fill: 'transparent',
          stroke: 'transparent',
          tabindex: 0,
          role: 'button',
          'aria-label': `${item.name}, ${formatDate(point.date)}, ${point.value} sur 100, ${EVIDENCE_LABELS[point.evidence]}, ${point.methodologyVersion ? `méthode version ${point.methodologyVersion}` : 'méthode non versionnée'}`,
        });
        hit.addEventListener('pointerenter', () => showTooltip(point, item, x, y));
        hit.addEventListener('pointerdown', (event) => {
          event.preventDefault();
          showTooltip(point, item, x, y);
        });
        hit.addEventListener('focus', () => showTooltip(point, item, x, y));
        hit.addEventListener('blur', hideTooltip);
        group.append(hit);
        chartLayer.append(group);
      }
    }
    renderSummary();
    renderLegendState();
  }

  root.querySelectorAll<HTMLButtonElement>('[data-window]').forEach((button) => {
    button.addEventListener('click', () => {
      const days = button.dataset.window;
      activeWindow = days || '7';
      root.querySelectorAll<HTMLButtonElement>('[data-window]').forEach((item) => {
        const selected = item === button;
        item.setAttribute('aria-pressed', String(selected));
        item.classList.toggle('is-active', selected);
      });
      const isFree = days === 'free';
      freeRange.hidden = !isFree;
      if (!isFree) {
        end = absoluteEnd;
        start = Math.max(absoluteStart, end - Number(days) * SIGNAL_CHART_DAY_MS);
        startInput.value = new Date(start).toISOString().slice(0, 10);
        endInput.value = new Date(end).toISOString().slice(0, 10);
        renderChart();
      }
    });
  });

  root.querySelector<HTMLButtonElement>('[data-range-apply]')?.addEventListener('click', () => {
    const parsedStart = Date.parse(`${startInput.value}T00:00:00Z`);
    const parsedEnd = Date.parse(`${endInput.value}T23:59:59.999Z`);
    if (!Number.isFinite(parsedStart) || !Number.isFinite(parsedEnd) || parsedStart > parsedEnd) {
      startInput.setCustomValidity('La date de début doit précéder la date de fin.');
      startInput.reportValidity();
      return;
    }
    startInput.setCustomValidity('');
    start = Math.max(absoluteStart, parsedStart);
    end = Math.min(absoluteEnd, parsedEnd);
    renderChart();
  });

  root.querySelectorAll<HTMLButtonElement>('[data-series-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      isolatedKey = isolatedKey === button.dataset.seriesToggle ? null : button.dataset.seriesToggle || null;
      renderChart();
    });
  });

  chartPlot.addEventListener('pointerleave', (event) => {
    if (!(event.relatedTarget instanceof Element) || !chartTooltip.contains(event.relatedTarget)) hideTooltip();
  });
  chartPlot.addEventListener('pointerdown', (event) => {
    if (event.target === chartPlot) hideTooltip();
  });
  root.dataset.ready = 'true';
  renderChart();
});
