import { useState } from 'react';
import {
  BarChart3,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Clock,
  HardDrive,
  Gauge,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  Info,
  FileText,
  Grid3X3,
  Activity
} from 'lucide-react';
import { MODEL_BENCHMARKS } from '../data/dissertationData';
import { ModelMetrics } from '../types/phishing';
import { ConfusionMatrixVisualizer } from './ConfusionMatrixVisualizer';
import { CorrelationHeatmapVisualizer } from './CorrelationHeatmapVisualizer';
import { ArchitecturalComparisonTable } from './ArchitecturalComparisonTable';

interface ModelBenchmarksViewProps {
  onOpenPdfModal?: () => void;
}

export const ModelBenchmarksView = ({ onOpenPdfModal }: ModelBenchmarksViewProps) => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'ML' | 'DL'>('ALL');
  const [sortBy, setSortBy] = useState<keyof ModelMetrics>('accuracy');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedModel, setSelectedModel] = useState<ModelMetrics>(MODEL_BENCHMARKS[0]);
  const [activeChartTab, setActiveChartTab] = useState<'radar' | 'bars' | 'frontier' | 'matrix' | 'heatmap' | 'architecture'>('frontier');

  const filteredModels = MODEL_BENCHMARKS.filter((m) => {
    if (filterCategory === 'ALL') return true;
    return m.category === filterCategory;
  }).sort((a, b) => {
    const valA = a[sortBy] as number;
    const valB = b[sortBy] as number;
    if (sortOrder === 'desc') return valB - valA;
    return valA - valB;
  });

  const handleSort = (field: keyof ModelMetrics) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Radar chart dimensions
  const radarDimensions = [
    { label: 'Accuracy', getScore: (m: ModelMetrics) => ((m.accuracy - 98) / 2) * 100 }, // scale 98-100% to 0-100
    { label: 'Speed (<2ms)', getScore: (m: ModelMetrics) => Math.max(0, (20 - m.latencyMs) / 20 * 100) },
    { label: 'Throughput', getScore: (m: ModelMetrics) => (m.throughputUrlsPerSec / 850) * 100 },
    { label: 'Low RAM (<20MB)', getScore: (m: ModelMetrics) => Math.max(5, (450 - m.ramUsageMb) / 450 * 100) },
    { label: 'Low FPR (Zero Alarms)', getScore: (m: ModelMetrics) => Math.max(5, (5 - m.fpr) / 5 * 100) },
    { label: 'Interpretability', getScore: (m: ModelMetrics) => m.interpretability === 'High' ? 100 : m.interpretability === 'Moderate' ? 60 : 25 }
  ];

  const rfModel = MODEL_BENCHMARKS.find((m) => m.id === 'rf')!;
  const distilbertModel = MODEL_BENCHMARKS.find((m) => m.id === 'distilbert')!;
  const annModel = MODEL_BENCHMARKS.find((m) => m.id === 'ann')!;

  return (
    <div className="space-y-8 pb-12">
      {/* Header and Controls */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>Table 4.1 &amp; Table 4.3</span>
            <span aria-hidden="true">·</span>
            <span>UCI PhiUSIIL Evaluation (235,795 URLs)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Model Performance &amp; Operational Benchmarks
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Direct controlled comparison across 5 Machine Learning algorithms and 4 Deep Learning architectures under identical hardware and 56-feature vector parameters.
          </p>
        </div>

        {/* Actions & Filter Segmented Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => {
              const el = document.getElementById('architectural-matrix-section');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                setActiveChartTab('architecture');
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 rounded-lg transition-colors whitespace-nowrap shadow-sm"
            title="Jump to Detailed Architectural Comparison Matrix (Parameters & Features)"
          >
            <Cpu className="h-3.5 w-3.5 text-cyan-400" />
            <span>Architecture Specs</span>
          </button>

          {onOpenPdfModal && (
            <button
              onClick={onOpenPdfModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-cyan-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 rounded-lg transition-colors whitespace-nowrap shadow-sm"
              title="Generate Academic Research PDF Report"
            >
              <FileText className="h-3.5 w-3.5 text-cyan-400" />
              <span>Academic PDF Report</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            <button
              onClick={() => setFilterCategory('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterCategory === 'ALL'
                  ? 'bg-slate-800 text-white font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Paradigms ({MODEL_BENCHMARKS.length})
            </button>
            <button
              onClick={() => setFilterCategory('ML')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterCategory === 'ML'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Traditional ML (5)
            </button>
            <button
              onClick={() => setFilterCategory('DL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                filterCategory === 'DL'
                  ? 'bg-pink-500/20 text-pink-300 font-semibold border border-pink-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Deep Learning (4)
            </button>
          </div>
        </div>
      </section>

      {/* Interactive Visualizations Canvas */}
      <section className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Comparative Analysis Visualizer
            </h2>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-lg">
            <button
              onClick={() => setActiveChartTab('frontier')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeChartTab === 'frontier'
                  ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Efficiency Frontier
            </button>
            <button
              onClick={() => setActiveChartTab('matrix')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeChartTab === 'matrix'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Grid3X3 className="h-3 w-3" />
              <span>Confusion Matrix (DL vs ML)</span>
            </button>
            <button
              onClick={() => setActiveChartTab('heatmap')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeChartTab === 'heatmap'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="h-3 w-3" />
              <span>Correlation Heatmap</span>
            </button>
            <button
              onClick={() => setActiveChartTab('architecture')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                activeChartTab === 'architecture'
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Cpu className="h-3 w-3" />
              <span>Architectural Specs (ML vs DL)</span>
            </button>
            <button
              onClick={() => setActiveChartTab('radar')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeChartTab === 'radar'
                  ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              6-Axis Radar
            </button>
            <button
              onClick={() => setActiveChartTab('bars')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeChartTab === 'bars'
                  ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Throughput &amp; RAM
            </button>
          </div>
        </div>

        {/* Chart View 1: Efficiency Frontier Scatter Plot */}
        {activeChartTab === 'frontier' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="text-slate-300">
                Top-Left Quadrant = Ideal (Sub-millisecond wire-speed + High 99.99% Accuracy)
              </span>
              <span className="font-mono text-slate-500">Bubble Area proportional to RAM Footprint (MB)</span>
            </div>

            <div className="relative h-72 sm:h-80 w-full bg-slate-950/90 rounded-xl border border-slate-800/80 p-6 overflow-hidden">
              {/* Grid Lines */}
              <div className="absolute inset-x-8 top-8 bottom-10 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="w-full border-b border-dashed border-slate-600 flex justify-end text-[10px] font-mono text-slate-400">100.0%</div>
                <div className="w-full border-b border-dashed border-slate-600 flex justify-end text-[10px] font-mono text-slate-400">99.5%</div>
                <div className="w-full border-b border-dashed border-slate-600 flex justify-end text-[10px] font-mono text-slate-400">99.0%</div>
                <div className="w-full border-b border-dashed border-slate-600 flex justify-end text-[10px] font-mono text-slate-400">98.5%</div>
                <div className="w-full border-b border-slate-700 flex justify-end text-[10px] font-mono text-slate-400">98.0%</div>
              </div>

              {/* Wire-speed safe zone demarcation */}
              <div className="absolute left-8 top-8 bottom-10 w-28 bg-emerald-500/5 border-r border-emerald-500/20 pointer-events-none flex items-center justify-center">
                <span className="text-[10px] font-mono text-emerald-400/60 uppercase tracking-widest rotate-[-90deg] whitespace-nowrap">
                  Wire-Speed Zone (&lt;2 ms)
                </span>
              </div>

              {/* Scatter Points */}
              <div className="absolute inset-x-12 top-8 bottom-12">
                {MODEL_BENCHMARKS.map((m) => {
                  // Map latency: 0.4ms to 20ms onto 0% to 92%
                  const xPct = Math.min(94, Math.max(4, (m.latencyMs / 20) * 100));
                  // Map accuracy: 98% to 100% onto 90% to 8% (inverted for SVG/CSS top)
                  const yPct = Math.min(92, Math.max(4, 100 - ((m.accuracy - 98) / 2) * 100));
                  // Bubble size based on RAM (4MB to 410MB)
                  const size = Math.min(36, Math.max(12, Math.sqrt(m.ramUsageMb) * 1.6));
                  const isSelected = selectedModel.id === m.id;

                  return (
                    <button
                      key={m.id}
                      onClick={() => setSelectedModel(m)}
                      style={{
                        left: `${xPct}%`,
                        top: `${yPct}%`,
                        width: `${size}px`,
                        height: `${size}px`,
                        transform: 'translate(-50%, -50%)'
                      }}
                      className={`absolute rounded-full transition-all group flex items-center justify-center ${
                        isSelected
                          ? 'ring-4 ring-cyan-400 ring-offset-2 ring-offset-slate-950 scale-125 z-30'
                          : 'hover:scale-110 z-20'
                      }`}
                      title={`${m.name}: ${m.accuracy}% Acc, ${m.latencyMs}ms Latency, ${m.ramUsageMb}MB RAM`}
                    >
                      <div
                        className="w-full h-full rounded-full opacity-85 group-hover:opacity-100 transition-opacity"
                        style={{ backgroundColor: m.color }}
                      />
                      {/* Name Label */}
                      <span
                        className={`absolute left-full ml-2 text-[11px] font-mono whitespace-nowrap font-medium pointer-events-none transition-colors ${
                          isSelected ? 'text-white font-bold' : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        {m.name.split(' ')[0]} ({m.latencyMs}ms)
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Axis Labels */}
              <div className="absolute bottom-2 inset-x-8 flex justify-between text-[11px] font-mono text-slate-500">
                <span>0 ms (Instant)</span>
                <span>5 ms</span>
                <span>10 ms</span>
                <span>15 ms</span>
                <span>20 ms (Transformer Latency Threshold)</span>
              </div>
            </div>
          </div>
        )}

        {/* Chart View 2: 6-Axis Radar Comparison */}
        {activeChartTab === 'radar' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-7 flex justify-center py-4">
              <svg viewBox="0 0 360 360" className="w-full max-w-[340px] overflow-visible">
                {/* Polar concentric grid rings */}
                {[0.2, 0.4, 0.6, 0.8, 1.0].map((level, i) => (
                  <circle
                    key={i}
                    cx="180"
                    cy="180"
                    r={130 * level}
                    fill="none"
                    stroke="#334155"
                    strokeWidth="1"
                    strokeDasharray={i < 4 ? '3 3' : 'none'}
                    opacity="0.4"
                  />
                ))}

                {/* Axis spoke lines */}
                {radarDimensions.map((dim, i) => {
                  const angle = (Math.PI * 2 / radarDimensions.length) * i - Math.PI / 2;
                  const x = 180 + Math.cos(angle) * 130;
                  const y = 180 + Math.sin(angle) * 130;
                  const labelX = 180 + Math.cos(angle) * 155;
                  const labelY = 180 + Math.sin(angle) * 155;

                  return (
                    <g key={dim.label}>
                      <line x1="180" y1="180" x2={x} y2={y} stroke="#475569" strokeWidth="1" opacity="0.5" />
                      <text
                        x={labelX}
                        y={labelY}
                        fill="#94a3b8"
                        fontSize="10"
                        fontFamily="monospace"
                        textAnchor="middle"
                        dominantBaseline="central"
                      >
                        {dim.label}
                      </text>
                    </g>
                  );
                })}

                {/* Radar Polygon: Random Forest (Cyan) */}
                {(() => {
                  const points = radarDimensions.map((dim, i) => {
                    const score = Math.max(10, Math.min(100, dim.getScore(rfModel))) / 100;
                    const angle = (Math.PI * 2 / radarDimensions.length) * i - Math.PI / 2;
                    return `${180 + Math.cos(angle) * 130 * score},${180 + Math.sin(angle) * 130 * score}`;
                  }).join(' ');
                  return (
                    <polygon
                      points={points}
                      fill="rgba(6, 182, 212, 0.25)"
                      stroke="#06b6d4"
                      strokeWidth="2.5"
                    />
                  );
                })()}

                {/* Radar Polygon: DistilBERT (Pink) */}
                {(() => {
                  const points = radarDimensions.map((dim, i) => {
                    const score = Math.max(10, Math.min(100, dim.getScore(distilbertModel))) / 100;
                    const angle = (Math.PI * 2 / radarDimensions.length) * i - Math.PI / 2;
                    return `${180 + Math.cos(angle) * 130 * score},${180 + Math.sin(angle) * 130 * score}`;
                  }).join(' ');
                  return (
                    <polygon
                      points={points}
                      fill="rgba(236, 72, 153, 0.2)"
                      stroke="#ec4899"
                      strokeWidth="2"
                      strokeDasharray="4 2"
                    />
                  );
                })()}

                {/* Radar Polygon: ANN (Violet) */}
                {(() => {
                  const points = radarDimensions.map((dim, i) => {
                    const score = Math.max(10, Math.min(100, dim.getScore(annModel))) / 100;
                    const angle = (Math.PI * 2 / radarDimensions.length) * i - Math.PI / 2;
                    return `${180 + Math.cos(angle) * 130 * score},${180 + Math.sin(angle) * 130 * score}`;
                  }).join(' ');
                  return (
                    <polygon
                      points={points}
                      fill="rgba(139, 92, 246, 0.15)"
                      stroke="#8b5cf6"
                      strokeWidth="1.5"
                    />
                  );
                })()}
              </svg>
            </div>

            {/* Legend & Synthesis */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Multi-Dimensional Trade-off
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Notice the asymmetrical polygon of <strong className="text-cyan-400">Random Forest</strong> (solid cyan): it captures near-maximal coverage across accuracy, sub-millisecond speed, throughput, and near-zero false alarms.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/70 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-cyan-400" />
                    <span className="font-semibold text-slate-200">Random Forest (ML)</span>
                  </div>
                  <span className="font-mono text-cyan-400">672 URLs/s · 0.85ms</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/70 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-violet-400" />
                    <span className="font-semibold text-slate-200">Neural Net (ANN / MLP)</span>
                  </div>
                  <span className="font-mono text-violet-400">408 URLs/s · 2.45ms</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-slate-950/70 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-pink-400" />
                    <span className="font-semibold text-slate-200">DistilBERT Transformer</span>
                  </div>
                  <span className="font-mono text-pink-400">88 URLs/s · 18.5ms</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Chart View 3: Throughput & RAM Bars */}
        {activeChartTab === 'bars' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Throughput */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>Inference Throughput (URLs processed per second)</span>
                <span className="font-mono text-cyan-400">Higher = Better</span>
              </div>
              <div className="space-y-2">
                {MODEL_BENCHMARKS.map((m) => {
                  const widthPct = (m.throughputUrlsPerSec / 850) * 100;
                  return (
                    <div key={m.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span className="truncate max-w-[180px]">{m.name}</span>
                        <span className="font-bold text-white tabular-nums">{m.throughputUrlsPerSec} URLs/s</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${widthPct}%`, backgroundColor: m.color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RAM Usage */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>In-Memory RAM Footprint (MB)</span>
                <span className="font-mono text-emerald-400">Lower = Better</span>
              </div>
              <div className="space-y-2">
                {MODEL_BENCHMARKS.map((m) => {
                  const widthPct = Math.max(3, (m.ramUsageMb / 410) * 100);
                  const isHeavy = m.ramUsageMb > 50;
                  return (
                    <div key={m.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span className="truncate max-w-[180px]">{m.name}</span>
                        <span className={`font-bold tabular-nums ${isHeavy ? 'text-pink-400' : 'text-emerald-400'}`}>
                          {m.ramUsageMb} MB
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${widthPct}%`,
                            backgroundColor: isHeavy ? '#ec4899' : '#10b981'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Chart View 4: Confusion Matrix (DL vs ML) */}
        {activeChartTab === 'matrix' && (
          <div className="pt-2">
            <ConfusionMatrixVisualizer
              initialMlModelId={selectedModel.category === 'ML' ? selectedModel.id : 'rf'}
              initialDlModelId={selectedModel.category === 'DL' ? selectedModel.id : 'distilbert'}
            />
          </div>
        )}

        {/* Chart View 5: Correlation Heatmap Matrix */}
        {activeChartTab === 'heatmap' && (
          <div className="pt-2">
            <CorrelationHeatmapVisualizer />
          </div>
        )}

        {/* Chart View 6: Architectural Comparison Matrix */}
        {activeChartTab === 'architecture' && (
          <div className="pt-2">
            <ArchitecturalComparisonTable
              selectedModelId={selectedModel.id}
              onSelectModel={(id) => {
                const found = MODEL_BENCHMARKS.find((m) => m.id === id);
                if (found) setSelectedModel(found);
              }}
            />
          </div>
        )}
      </section>

      {/* Main Benchmark Data Table */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-white">
              Comparative Metric Matrix (UCI PhiUSIIL 235k Benchmark)
            </h2>
            <span className="text-xs text-slate-500 font-mono">
              Click column headers to sort
            </span>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Active sort: <span className="text-cyan-400 uppercase">{String(sortBy)}</span> ({sortOrder})
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-md">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-300 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Model &amp; Paradigm</th>
                <th
                  onClick={() => handleSort('category')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Type</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('accuracy')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Accuracy</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('f1Score')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>F1-Score</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('precision')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Precision</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('recall')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Recall</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('latencyMs')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Latency</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('throughputUrlsPerSec')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Throughput</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('ramUsageMb')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>RAM</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('fpr')}
                  className="py-3 px-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>FPR %</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Deployment Fit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-mono">
              {filteredModels.map((m) => {
                const isSelected = selectedModel.id === m.id;
                return (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedModel(m)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/10 hover:bg-cyan-500/15'
                        : 'hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 px-4 font-sans font-medium text-slate-200">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: m.color }}
                        />
                        <div>
                          <div className="text-white font-semibold">{m.name}</div>
                          <div className="text-[11px] text-slate-400 font-mono font-normal">
                            {m.paradigm}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[11px] font-semibold ${
                          m.category === 'ML' ? 'text-cyan-400' : 'text-pink-400'
                        }`}
                      >
                        {m.category}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-white tabular-nums">
                      {m.accuracy.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                      {m.f1Score.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                      {m.precision.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                      {m.recall.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      <span
                        className={`font-semibold ${
                          m.latencyMs < 1.5
                            ? 'text-emerald-400'
                            : m.latencyMs < 5.0
                            ? 'text-cyan-400'
                            : 'text-pink-400'
                        }`}
                      >
                        {m.latencyMs.toFixed(2)} ms
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right text-slate-300 tabular-nums">
                      {m.throughputUrlsPerSec} /s
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      <span className={m.ramUsageMb > 50 ? 'text-pink-400 font-semibold' : 'text-slate-300'}>
                        {m.ramUsageMb.toFixed(1)} MB
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right tabular-nums">
                      <span
                        className={
                          m.fpr < 0.1
                            ? 'text-emerald-400 font-semibold'
                            : 'text-amber-400 font-semibold'
                        }
                      >
                        {m.fpr.toFixed(3)}%
                      </span>
                    </td>
                    <td className="py-3 px-4 font-sans text-center">
                      <span className="text-[11px] text-slate-400 block truncate max-w-[200px]" title={m.deploymentSuitability}>
                        {m.deploymentSuitability}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detailed Architectural Comparison Table (Traditional ML vs Deep Learning) */}
      <section id="architectural-matrix-section">
        <ArchitecturalComparisonTable
          selectedModelId={selectedModel.id}
          onSelectModel={(id) => {
            const found = MODEL_BENCHMARKS.find((m) => m.id === id);
            if (found) setSelectedModel(found);
          }}
        />
      </section>

      {/* Selected Model Deep Dive Drawer */}
      <section className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <span
              className="w-3.5 h-3.5 rounded-full"
              style={{ backgroundColor: selectedModel.color }}
            />
            <h3 className="text-lg font-bold text-white">
              {selectedModel.name} — Architecture &amp; Diagnostics
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Category: {selectedModel.category}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-slate-400">Interpretability: <strong className="text-white">{selectedModel.interpretability}</strong></span>
            <span className="text-slate-400">ROC-AUC: <strong className="text-cyan-400">{selectedModel.rocAuc}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="text-slate-400 uppercase font-mono tracking-wider">
              Architecture Description
            </div>
            <p className="text-slate-200 leading-relaxed font-sans">
              {selectedModel.architectureDetails}
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="text-slate-400 uppercase font-mono tracking-wider">
              Held-Out Test Set Breakdown (47,159 URLs)
            </div>
            <div className="space-y-1 font-mono pt-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">True Positives (Phishing):</span>
                <span className="text-emerald-400 font-bold tabular-nums">{selectedModel.tpCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">True Negatives (Legitimate):</span>
                <span className="text-emerald-400 font-bold tabular-nums">{selectedModel.tnCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">False Alarms (FP):</span>
                <span className={selectedModel.fpCount > 10 ? 'text-amber-400 font-bold tabular-nums' : 'text-slate-200 tabular-nums'}>
                  {selectedModel.fpCount} ({selectedModel.fpr.toFixed(3)}%)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Missed Phishing (FN):</span>
                <span className={selectedModel.fnCount > 0 ? 'text-pink-400 font-bold tabular-nums' : 'text-emerald-400 font-bold tabular-nums'}>
                  {selectedModel.fnCount}
                </span>
              </div>
              <div className="flex flex-col gap-1 mt-2 pt-1 border-t border-slate-800">
                <button
                  onClick={() => {
                    setActiveChartTab('matrix');
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium text-cyan-400 hover:text-cyan-300 hover:underline transition-colors"
                >
                  <Grid3X3 className="h-3 w-3" />
                  <span>Open in Confusion Matrix Comparison</span>
                </button>
                <button
                  onClick={() => {
                    setActiveChartTab('heatmap');
                    window.scrollTo({ top: 120, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium text-pink-400 hover:text-pink-300 hover:underline transition-colors"
                >
                  <Activity className="h-3 w-3" />
                  <span>Explore Metrics Correlation Heatmap</span>
                </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('architectural-matrix-section');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      setActiveChartTab('architecture');
                      window.scrollTo({ top: 120, behavior: 'smooth' });
                    }
                  }}
                  className="inline-flex items-center gap-1.5 text-[11px] font-sans font-medium text-purple-400 hover:text-purple-300 hover:underline transition-colors"
                >
                  <Cpu className="h-3 w-3" />
                  <span>Inspect Parameters &amp; Feature Extraction Matrix</span>
                </button>
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800/80 space-y-1">
            <div className="text-slate-400 uppercase font-mono tracking-wider">
              Production Gateway Suitability
            </div>
            <p className="text-slate-200 leading-relaxed font-sans">
              {selectedModel.deploymentSuitability}
            </p>
            <div className="pt-2 text-[11px] font-mono text-cyan-400">
              Latency: {selectedModel.latencyMs} ms · Throughput: {selectedModel.throughputUrlsPerSec} req/sec
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
