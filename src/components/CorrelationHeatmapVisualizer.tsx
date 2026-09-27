import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import {
  Grid3X3,
  TrendingUp,
  Info,
  Layers,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Activity,
  Cpu,
  ShieldAlert,
  Zap
} from 'lucide-react';
import { MODEL_BENCHMARKS } from '../data/dissertationData';
import { ModelMetrics } from '../types/phishing';

export interface MetricDefinition {
  key: keyof ModelMetrics;
  label: string;
  shortLabel: string;
  unit: string;
  category: 'effectiveness' | 'efficiency' | 'error';
  higherIsBetter: boolean;
  description: string;
}

const ALL_METRICS: MetricDefinition[] = [
  {
    key: 'accuracy',
    label: 'Overall Accuracy',
    shortLabel: 'Acc',
    unit: '%',
    category: 'effectiveness',
    higherIsBetter: true,
    description: 'Percentage of all test URLs correctly categorized'
  },
  {
    key: 'f1Score',
    label: 'F1-Score',
    shortLabel: 'F1',
    unit: '%',
    category: 'effectiveness',
    higherIsBetter: true,
    description: 'Harmonic mean of precision and recall'
  },
  {
    key: 'precision',
    label: 'Precision',
    shortLabel: 'Prec',
    unit: '%',
    category: 'effectiveness',
    higherIsBetter: true,
    description: 'Proportion of flagged URLs that were genuinely phishing'
  },
  {
    key: 'recall',
    label: 'Recall / Sensitivity',
    shortLabel: 'Recall',
    unit: '%',
    category: 'effectiveness',
    higherIsBetter: true,
    description: 'Proportion of actual phishing threats successfully detected'
  },
  {
    key: 'rocAuc',
    label: 'ROC-AUC Area',
    shortLabel: 'AUC',
    unit: '',
    category: 'effectiveness',
    higherIsBetter: true,
    description: 'Area under the receiver operating characteristic curve'
  },
  {
    key: 'latencyMs',
    label: 'Inference Latency',
    shortLabel: 'Latency',
    unit: 'ms',
    category: 'efficiency',
    higherIsBetter: false,
    description: 'Time taken per individual URL classification'
  },
  {
    key: 'throughputUrlsPerSec',
    label: 'Throughput',
    shortLabel: 'Thruput',
    unit: 'u/s',
    category: 'efficiency',
    higherIsBetter: true,
    description: 'URLs processed per second on standard CPU cores'
  },
  {
    key: 'ramUsageMb',
    label: 'RAM Footprint',
    shortLabel: 'RAM',
    unit: 'MB',
    category: 'efficiency',
    higherIsBetter: false,
    description: 'Active memory required by the model in deployment'
  },
  {
    key: 'fpr',
    label: 'False Positive Rate',
    shortLabel: 'FPR',
    unit: '%',
    category: 'error',
    higherIsBetter: false,
    description: 'Benign URLs falsely blocked (causes SOC alert fatigue)'
  },
  {
    key: 'fnCount',
    label: 'False Negatives',
    shortLabel: 'FN',
    unit: 'URLs',
    category: 'error',
    higherIsBetter: false,
    description: 'Phishing attacks that bypassed detection (critical risk)'
  }
];

const PRIMARY_METRIC_KEYS: (keyof ModelMetrics)[] = [
  'accuracy',
  'rocAuc',
  'latencyMs',
  'throughputUrlsPerSec',
  'ramUsageMb',
  'fpr'
];

// Helper: Calculate Pearson Correlation Coefficient r
function calculatePearson(xVals: number[], yVals: number[]): number {
  const n = xVals.length;
  if (n < 2) return 0;

  const meanX = xVals.reduce((a, b) => a + b, 0) / n;
  const meanY = yVals.reduce((a, b) => a + b, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const diffX = xVals[i] - meanX;
    const diffY = yVals[i] - meanY;
    numerator += diffX * diffY;
    denomX += diffX * diffX;
    denomY += diffY * diffY;
  }

  const denominator = Math.sqrt(denomX * denomY);
  if (denominator === 0) return 0;

  const r = numerator / denominator;
  // Clamp floating rounding anomalies between -1 and 1
  return Math.max(-1, Math.min(1, r));
}

// Helper: Color mapping for correlation r (-1 to +1)
function getCorrelationColor(r: number): { bg: string; text: string; border: string } {
  if (r >= 0.85) {
    return { bg: 'bg-emerald-500/90', text: 'text-white', border: 'border-emerald-400' };
  } else if (r >= 0.6) {
    return { bg: 'bg-emerald-600/70', text: 'text-emerald-100', border: 'border-emerald-500/50' };
  } else if (r >= 0.3) {
    return { bg: 'bg-cyan-600/50', text: 'text-cyan-100', border: 'border-cyan-500/40' };
  } else if (r >= 0.1) {
    return { bg: 'bg-cyan-900/40', text: 'text-cyan-200', border: 'border-cyan-700/30' };
  } else if (r > -0.1) {
    return { bg: 'bg-slate-800/80', text: 'text-slate-400', border: 'border-slate-700/50' };
  } else if (r > -0.3) {
    return { bg: 'bg-amber-950/40', text: 'text-amber-200', border: 'border-amber-700/30' };
  } else if (r > -0.6) {
    return { bg: 'bg-rose-900/50', text: 'text-rose-100', border: 'border-rose-500/40' };
  } else if (r > -0.85) {
    return { bg: 'bg-rose-600/70', text: 'text-white', border: 'border-rose-500/50' };
  } else {
    return { bg: 'bg-rose-500/90', text: 'text-white', border: 'border-rose-400' };
  }
}

function getCorrelationInterpretation(metricA: MetricDefinition, metricB: MetricDefinition, r: number) {
  const absR = Math.abs(r);
  let strength = 'negligible';
  if (absR >= 0.8) strength = 'very strong';
  else if (absR >= 0.6) strength = 'strong';
  else if (absR >= 0.4) strength = 'moderate';
  else if (absR >= 0.2) strength = 'weak';

  const direction = r > 0 ? 'positive (direct)' : 'negative (inverse)';

  // Domain-specific interpretation rules
  if (
    (metricA.key === 'latencyMs' && metricB.key === 'throughputUrlsPerSec') ||
    (metricA.key === 'throughputUrlsPerSec' && metricB.key === 'latencyMs')
  ) {
    return `Inherent inverse law of line-speed networking (r = ${r.toFixed(3)}): as individual URL inference latency rises, throughput collapses exponentially, explaining why tree models sustain wire speed.`;
  }

  if (
    (metricA.key === 'latencyMs' && metricB.key === 'ramUsageMb') ||
    (metricA.key === 'ramUsageMb' && metricB.key === 'latencyMs')
  ) {
    return `Model scale footprint penalty (r = ${r.toFixed(3)}): deep sequence transformer layers incur both severe memory expansion (410 MB) and higher latency (18.5 ms) compared to tree ensembles (<10 MB / <1 ms).`;
  }

  if (
    (metricA.key === 'latencyMs' && metricB.key === 'fpr') ||
    (metricA.key === 'fpr' && metricB.key === 'latencyMs')
  ) {
    return `Counter-intuitive research finding (r = ${r.toFixed(3)}): slower deep models in raw token space produce higher False Positive Rates due to the absence of deterministic structural checks (homoglyphs, IP hosting).`;
  }

  if (
    (metricA.key === 'ramUsageMb' && metricB.key === 'accuracy') ||
    (metricA.key === 'accuracy' && metricB.key === 'ramUsageMb')
  ) {
    return `Efficiency inflection: 48x greater RAM footprint in deep models does not confer higher accuracy; 56-feature Random Forest hits the 99.99% ceiling with 98% less memory.`;
  }

  return `A ${strength} ${direction} correlation (r = ${r.toFixed(3)}, R² = ${(r * r * 100).toFixed(1)}%) exists between ${metricA.label} and ${metricB.label}.`;
}

export const CorrelationHeatmapVisualizer = () => {
  const [modelCohort, setModelCohort] = useState<'ALL' | 'ML' | 'DL'>('ALL');
  const [viewScope, setViewScope] = useState<'primary' | 'all'>('primary');
  const [selectedPair, setSelectedPair] = useState<[keyof ModelMetrics, keyof ModelMetrics]>([
    'latencyMs',
    'ramUsageMb'
  ]);
  const [hoveredPair, setHoveredPair] = useState<[keyof ModelMetrics, keyof ModelMetrics] | null>(null);

  // Active models based on cohort filter
  const activeModels = useMemo(() => {
    if (modelCohort === 'ALL') return MODEL_BENCHMARKS;
    return MODEL_BENCHMARKS.filter((m) => m.category === modelCohort);
  }, [modelCohort]);

  // Active metrics based on view scope
  const activeMetrics = useMemo(() => {
    if (viewScope === 'primary') {
      return ALL_METRICS.filter((m) => PRIMARY_METRIC_KEYS.includes(m.key));
    }
    return ALL_METRICS;
  }, [viewScope]);

  // Compute 2D Pearson Correlation Matrix
  const correlationMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, number>> = {};

    activeMetrics.forEach((rowMetric) => {
      matrix[rowMetric.key] = {};
      const rowVals = activeModels.map((m) => m[rowMetric.key] as number);

      activeMetrics.forEach((colMetric) => {
        if (rowMetric.key === colMetric.key) {
          matrix[rowMetric.key][colMetric.key] = 1.0;
        } else {
          const colVals = activeModels.map((m) => m[colMetric.key] as number);
          matrix[rowMetric.key][colMetric.key] = calculatePearson(rowVals, colVals);
        }
      });
    });

    return matrix;
  }, [activeMetrics, activeModels]);

  const activeMetricA =
    ALL_METRICS.find((m) => m.key === selectedPair[0]) || ALL_METRICS[5]; // latency
  const activeMetricB =
    ALL_METRICS.find((m) => m.key === selectedPair[1]) || ALL_METRICS[7]; // ram

  const currentR = correlationMatrix[activeMetricA.key]?.[activeMetricB.key] ?? 0;

  // Scatter plot data for selected pair
  const scatterData = useMemo(() => {
    return activeModels.map((m) => {
      const xVal = m[activeMetricA.key] as number;
      const yVal = m[activeMetricB.key] as number;
      return {
        id: m.id,
        name: m.name,
        category: m.category,
        color: m.color,
        x: xVal,
        y: yVal,
        accuracy: m.accuracy,
        latency: m.latencyMs,
        ram: m.ramUsageMb
      };
    });
  }, [activeModels, activeMetricA, activeMetricB]);

  // Linear regression fit line points
  const regressionLine = useMemo(() => {
    if (scatterData.length < 2) return [];
    const n = scatterData.length;
    let sumX = 0;
    let sumY = 0;
    let sumXY = 0;
    let sumX2 = 0;

    scatterData.forEach((d) => {
      sumX += d.x;
      sumY += d.y;
      sumXY += d.x * d.y;
      sumX2 += d.x * d.x;
    });

    const denom = n * sumX2 - sumX * sumX;
    if (denom === 0) return [];
    const slope = (n * sumXY - sumX * sumY) / denom;
    const intercept = (sumY - slope * sumX) / n;

    const minX = Math.min(...scatterData.map((d) => d.x));
    const maxX = Math.max(...scatterData.map((d) => d.x));

    return [
      { x: minX, fitY: slope * minX + intercept },
      { x: maxX, fitY: slope * maxX + intercept }
    ];
  }, [scatterData]);

  // Current display pair (hovered or selected)
  const displayPair = hoveredPair || selectedPair;
  const displayMetricA = ALL_METRICS.find((m) => m.key === displayPair[0])!;
  const displayMetricB = ALL_METRICS.find((m) => m.key === displayPair[1])!;
  const displayR = correlationMatrix[displayMetricA.key]?.[displayMetricB.key] ?? 0;

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-cyan-400" />
            <span className="text-xs font-semibold text-white">Cohort Sample:</span>
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-700/80">
              <button
                onClick={() => setModelCohort('ALL')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  modelCohort === 'ALL'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All 8 Models
              </button>
              <button
                onClick={() => setModelCohort('ML')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  modelCohort === 'ML'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Traditional ML (5)
              </button>
              <button
                onClick={() => setModelCohort('DL')}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                  modelCohort === 'DL'
                    ? 'bg-pink-500/20 text-pink-300 font-semibold border border-pink-500/30'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Deep Learning (4)
              </button>
            </div>
          </div>
        </div>

        {/* View Scope Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Dimensions:</span>
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-700/80">
            <button
              onClick={() => setViewScope('primary')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewScope === 'primary'
                  ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Primary KPIs (6x6)
            </button>
            <button
              onClick={() => setViewScope('all')}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                viewScope === 'all'
                  ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Comprehensive (10x10)
            </button>
          </div>
        </div>
      </div>

      {/* Main Heatmap + Scatter Drilldown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Heatmap Matrix Grid (7 cols) */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4 overflow-x-auto">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Grid3X3 className="h-4 w-4 text-cyan-400" />
                <span>Pearson Correlation Matrix</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Click any cell to plot the bivariate scatter relationship and regression line
              </p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400/90 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-800/40">
              N = {activeModels.length} Models
            </span>
          </div>

          {/* Matrix Container */}
          <div className="min-w-[420px]">
            {/* Column Headers */}
            <div className="grid" style={{ gridTemplateColumns: `72px repeat(${activeMetrics.length}, minmax(0, 1fr))` }}>
              <div className="p-1 text-[10px] font-mono text-slate-500 flex items-center justify-center">
                Var \ Var
              </div>
              {activeMetrics.map((m) => (
                <div
                  key={m.key}
                  className="p-1 text-[11px] font-mono font-semibold text-slate-300 text-center truncate"
                  title={`${m.label} (${m.unit})`}
                >
                  {m.shortLabel}
                </div>
              ))}
            </div>

            {/* Matrix Rows */}
            <div className="space-y-1 mt-1">
              {activeMetrics.map((rowMetric) => (
                <div
                  key={rowMetric.key}
                  className="grid items-center gap-1"
                  style={{ gridTemplateColumns: `72px repeat(${activeMetrics.length}, minmax(0, 1fr))` }}
                >
                  {/* Row Label */}
                  <div
                    className="text-[11px] font-mono font-semibold text-slate-300 pr-1 truncate text-right"
                    title={`${rowMetric.label} (${rowMetric.unit})`}
                  >
                    {rowMetric.shortLabel}
                  </div>

                  {/* Cells */}
                  {activeMetrics.map((colMetric) => {
                    const r = correlationMatrix[rowMetric.key]?.[colMetric.key] ?? 0;
                    const isSelected =
                      (selectedPair[0] === rowMetric.key && selectedPair[1] === colMetric.key) ||
                      (selectedPair[1] === rowMetric.key && selectedPair[0] === colMetric.key);
                    const isDiagonal = rowMetric.key === colMetric.key;
                    const style = getCorrelationColor(r);

                    return (
                      <button
                        key={colMetric.key}
                        onClick={() => setSelectedPair([rowMetric.key, colMetric.key])}
                        onMouseEnter={() => setHoveredPair([rowMetric.key, colMetric.key])}
                        onMouseLeave={() => setHoveredPair(null)}
                        className={`h-9 rounded flex items-center justify-center text-[11px] font-mono font-bold transition-all relative group cursor-pointer ${
                          style.bg
                        } ${style.text} ${
                          isSelected
                            ? 'ring-2 ring-white shadow-lg scale-105 z-10'
                            : 'hover:scale-105 hover:ring-1 hover:ring-cyan-300'
                        }`}
                        title={`${rowMetric.label} vs ${colMetric.label}: r = ${r.toFixed(3)}`}
                      >
                        <span>{isDiagonal ? '1.00' : r.toFixed(2)}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Color Scale Legend */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <span>Correlation Gradient:</span>
            </span>
            <div className="flex items-center gap-1">
              <span className="text-rose-400">-1.00 (Inv)</span>
              <div className="h-3 w-36 rounded-full bg-gradient-to-r from-rose-500 via-slate-800 to-emerald-500 border border-slate-700" />
              <span className="text-emerald-400">+1.00 (Dir)</span>
            </div>
          </div>
        </div>

        {/* Selected Pair Scatter Plot & Regression Line (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Bivariate Relationship
                </h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-sm font-bold text-cyan-300 font-mono">
                    {displayMetricA.shortLabel}
                  </span>
                  <span className="text-slate-500">vs.</span>
                  <span className="text-sm font-bold text-pink-300 font-mono">
                    {displayMetricB.shortLabel}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div
                  className={`inline-block px-2.5 py-1 rounded text-xs font-mono font-bold ${
                    displayR > 0.3
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : displayR < -0.3
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  r = {displayR >= 0 ? `+${displayR.toFixed(3)}` : displayR.toFixed(3)}
                </div>
                <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                  R² = {(displayR * displayR * 100).toFixed(1)}% variance
                </div>
              </div>
            </div>

            {/* Scatter Chart */}
            <div className="h-56 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 15, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name={displayMetricA.label}
                    unit={displayMetricA.unit ? ` ${displayMetricA.unit}` : ''}
                    stroke="#94a3b8"
                    fontSize={10}
                    domain={['dataMin', 'dataMax']}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name={displayMetricB.label}
                    unit={displayMetricB.unit ? ` ${displayMetricB.unit}` : ''}
                    stroke="#94a3b8"
                    fontSize={10}
                    domain={['dataMin', 'dataMax']}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload || !payload.length) return null;
                      const pt = payload[0].payload;
                      return (
                        <div className="rounded-lg bg-slate-900/95 border border-slate-700 p-2.5 shadow-xl text-xs space-y-1 font-sans">
                          <div className="font-bold text-white flex items-center justify-between gap-3 border-b border-slate-800 pb-1">
                            <span>{pt.name}</span>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                                pt.category === 'ML'
                                  ? 'bg-cyan-500/20 text-cyan-300'
                                  : 'bg-pink-500/20 text-pink-300'
                              }`}
                            >
                              {pt.category}
                            </span>
                          </div>
                          <div className="font-mono text-[11px] space-y-0.5 pt-0.5">
                            <div className="flex justify-between gap-3 text-cyan-400">
                              <span>{displayMetricA.label}:</span>
                              <span className="font-bold">
                                {pt.x} {displayMetricA.unit}
                              </span>
                            </div>
                            <div className="flex justify-between gap-3 text-pink-400">
                              <span>{displayMetricB.label}:</span>
                              <span className="font-bold">
                                {pt.y} {displayMetricB.unit}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }}
                  />
                  <Scatter name="Models" data={scatterData} fill="#06b6d4">
                    {scatterData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.category === 'ML' ? '#06b6d4' : '#ec4899'}
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Dynamic Correlation Finding Takeaway */}
          <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold font-mono text-[11px]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Statistical Inference</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {getCorrelationInterpretation(displayMetricA, displayMetricB, displayR)}
            </p>
          </div>
        </div>
      </div>

      {/* Hidden Relationships Cards Revealed by Dissertation Heatmap */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-cyan-400" />
          <h4 className="text-sm font-bold text-white tracking-tight">
            Key Hidden Relationships Identified in Empirical Analysis
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Card 1 */}
          <div
            onClick={() => setSelectedPair(['latencyMs', 'fpr'])}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-colors space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                Latency vs. FPR (r = +0.76)
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <h5 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
              The "Raw Sequence Token" Alarm Penalty
            </h5>
            <p className="text-slate-400 leading-relaxed">
              Deep Transformer models that take longer to evaluate subwords (18.5 ms) exhibit higher False Positive Rates (4.59% FPR) because they lack deterministic structural rules (homoglyphs, IP hosting) and over-attend to benign brand substrings.
            </p>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => setSelectedPair(['latencyMs', 'throughputUrlsPerSec'])}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-colors space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Latency vs. Throughput (r = -0.89)
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <h5 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
              Wire-Speed Network Demarcation
            </h5>
            <p className="text-slate-400 leading-relaxed">
              Throughput drops exponentially beyond 2.0 ms latency. Random Forest sustains 672 URLs/sec at 0.85 ms, whereas DistilBERT achieves only 88 URLs/sec at 18.5 ms, making standalone DL non-viable for inline enterprise firewalls.
            </p>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => setSelectedPair(['ramUsageMb', 'accuracy'])}
            className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-cyan-500/50 cursor-pointer transition-colors space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                RAM vs. Accuracy (r = -0.18)
              </span>
              <ArrowRight className="h-3.5 w-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
            </div>
            <h5 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
              The Feature Engineering Superiority
            </h5>
            <p className="text-slate-400 leading-relaxed">
              Increasing memory footprint by 48.8x (410 MB vs 8.4 MB) yields no accuracy dividend. Structured 56-feature engineering delivers 99.99% ceiling accuracy on tree ensembles without requiring deep multi-head attention.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
