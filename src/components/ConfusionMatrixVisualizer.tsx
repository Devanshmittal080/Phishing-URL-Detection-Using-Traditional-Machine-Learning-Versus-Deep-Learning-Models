import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  Cell
} from 'recharts';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Info,
  Layers,
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  HelpCircle
} from 'lucide-react';
import { MODEL_BENCHMARKS } from '../data/dissertationData';
import { ModelMetrics } from '../types/phishing';

interface ConfusionMatrixVisualizerProps {
  initialMlModelId?: string;
  initialDlModelId?: string;
}

export const ConfusionMatrixVisualizer = ({
  initialMlModelId = 'rf',
  initialDlModelId = 'distilbert'
}: ConfusionMatrixVisualizerProps) => {
  const mlModels = MODEL_BENCHMARKS.filter((m) => m.category === 'ML');
  const dlModels = MODEL_BENCHMARKS.filter((m) => m.category === 'DL');

  const [selectedMlId, setSelectedMlId] = useState<string>(initialMlModelId);
  const [selectedDlId, setSelectedDlId] = useState<string>(initialDlModelId);
  const [viewMode, setViewMode] = useState<'counts' | 'rates' | 'errors'>('counts');

  const mlModel = mlModels.find((m) => m.id === selectedMlId) || mlModels[0];
  const dlModel = dlModels.find((m) => m.id === selectedDlId) || dlModels[0];

  const totalTestUrls = 47159;
  const actualPhishing = 26970;
  const actualLegitimate = 20189;

  // Comparison data for all models error chart
  const errorDistributionData = MODEL_BENCHMARKS.map((m) => ({
    name: m.name.split(' ')[0],
    fullName: m.name,
    category: m.category,
    fpCount: m.fpCount,
    fnCount: m.fnCount,
    totalErrors: m.fpCount + m.fnCount,
    fpr: m.fpr,
    fnr: Number(((m.fnCount / actualPhishing) * 100).toFixed(3)),
    accuracy: m.accuracy
  })).sort((a, b) => a.totalErrors - b.totalErrors);

  // Data for side-by-side quad metrics
  const quadMetricsData = [
    {
      metric: 'True Positives (TP)',
      description: 'Phishing URLs accurately detected & neutralized',
      mlValue: viewMode === 'rates' ? Number(((mlModel.tpCount / actualPhishing) * 100).toFixed(2)) : mlModel.tpCount,
      dlValue: viewMode === 'rates' ? Number(((dlModel.tpCount / actualPhishing) * 100).toFixed(2)) : dlModel.tpCount,
      unit: viewMode === 'rates' ? '%' : 'URLs',
      significance: 'Security Posture (Higher is better)',
      mlColor: '#10b981', // emerald
      dlColor: '#059669'
    },
    {
      metric: 'True Negatives (TN)',
      description: 'Benign URLs accurately allowed through gateway',
      mlValue: viewMode === 'rates' ? Number(((mlModel.tnCount / actualLegitimate) * 100).toFixed(2)) : mlModel.tnCount,
      dlValue: viewMode === 'rates' ? Number(((dlModel.tnCount / actualLegitimate) * 100).toFixed(2)) : dlModel.tnCount,
      unit: viewMode === 'rates' ? '%' : 'URLs',
      significance: 'Business Continuity (Higher is better)',
      mlColor: '#06b6d4', // cyan
      dlColor: '#0891b2'
    },
    {
      metric: 'False Positives (FP)',
      description: 'Benign URLs falsely blocked (Causes SOC alert fatigue)',
      mlValue: viewMode === 'rates' ? mlModel.fpr : mlModel.fpCount,
      dlValue: viewMode === 'rates' ? dlModel.fpr : dlModel.fpCount,
      unit: viewMode === 'rates' ? '%' : 'URLs',
      significance: 'Type I Error (Lower is better)',
      mlColor: '#f59e0b', // amber
      dlColor: '#d97706'
    },
    {
      metric: 'False Negatives (FN)',
      description: 'Phishing URLs that bypassed model (Active Breach Hazard)',
      mlValue: viewMode === 'rates' ? Number(((mlModel.fnCount / actualPhishing) * 100).toFixed(3)) : mlModel.fnCount,
      dlValue: viewMode === 'rates' ? Number(((dlModel.fnCount / actualPhishing) * 100).toFixed(3)) : dlModel.fnCount,
      unit: viewMode === 'rates' ? '%' : 'URLs',
      significance: 'Type II Error (Critical Risk)',
      mlColor: '#f43f5e', // rose
      dlColor: '#e11d48'
    }
  ];

  // Specificity & Sensitivity calculations
  const calcMetrics = (model: ModelMetrics) => {
    const sensitivity = (model.tpCount / (model.tpCount + model.fnCount)) * 100;
    const specificity = (model.tnCount / (model.tnCount + model.fpCount)) * 100;
    const precision = (model.tpCount / (model.tpCount + model.fpCount)) * 100;
    const fnr = (model.fnCount / (model.fnCount + model.tpCount)) * 100;
    return {
      sensitivity: sensitivity.toFixed(2),
      specificity: specificity.toFixed(2),
      precision: precision.toFixed(2),
      fnr: fnr.toFixed(3)
    };
  };

  const mlDerived = calcMetrics(mlModel);
  const dlDerived = calcMetrics(dlModel);

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          {/* ML Model Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400 font-mono">Traditional ML:</span>
            <select
              value={selectedMlId}
              onChange={(e) => setSelectedMlId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs font-medium text-slate-100 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500"
            >
              {mlModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.accuracy.toFixed(2)}%)
                </option>
              ))}
            </select>
          </div>

          <div className="text-slate-600 hidden sm:inline">
            <ArrowRightLeft className="h-4 w-4" />
          </div>

          {/* DL Model Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-pink-400 font-mono">Deep Learning:</span>
            <select
              value={selectedDlId}
              onChange={(e) => setSelectedDlId(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs font-medium text-slate-100 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-pink-500"
            >
              {dlModels.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.accuracy.toFixed(2)}%)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Segmented Controls */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('counts')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'counts'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Raw Counts
          </button>
          <button
            onClick={() => setViewMode('rates')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'rates'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Normalized (%)
          </button>
          <button
            onClick={() => setViewMode('errors')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === 'errors'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Error Breakdown (All Models)
          </button>
        </div>
      </div>

      {/* Main Confusion Matrices: 2x2 Grids for Both Models */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ML Confusion Matrix */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: mlModel.color }}
              />
              <h3 className="text-sm font-bold text-white tracking-tight">
                {mlModel.name} (Traditional ML)
              </h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Accuracy: {mlModel.accuracy.toFixed(2)}%
            </span>
          </div>

          {/* 2x2 Matrix Table */}
          <div className="space-y-2">
            <div className="grid grid-cols-12 text-[11px] font-mono text-slate-400 text-center">
              <div className="col-span-3 text-left">Actual \ Pred</div>
              <div className="col-span-4 text-emerald-400 font-semibold">Pred: Phishing (1)</div>
              <div className="col-span-5 text-slate-300 font-semibold">Pred: Legitimate (0)</div>
            </div>

            {/* Row 1: Actual Phishing */}
            <div className="grid grid-cols-12 gap-2 text-xs">
              <div className="col-span-3 flex items-center text-[11px] font-mono font-semibold text-rose-400">
                Act: Phish
              </div>
              {/* True Positive */}
              <div className="col-span-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-center">
                <div className="text-[10px] font-mono text-emerald-300 font-medium">True Positive (TP)</div>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                  {mlModel.tpCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-300/70 font-mono">
                  {((mlModel.tpCount / actualPhishing) * 100).toFixed(2)}% of threats
                </div>
              </div>
              {/* False Negative */}
              <div className={`col-span-5 p-3 rounded-lg text-center ${
                mlModel.fnCount === 0
                  ? 'bg-slate-950/60 border border-slate-800'
                  : 'bg-rose-950/40 border border-rose-500/40'
              }`}>
                <div className="text-[10px] font-mono text-rose-300 font-medium">False Negative (FN)</div>
                <div className={`text-lg font-bold font-mono mt-0.5 ${
                  mlModel.fnCount === 0 ? 'text-slate-400' : 'text-rose-400'
                }`}>
                  {mlModel.fnCount}
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {mlDerived.fnr}% breach rate
                </div>
              </div>
            </div>

            {/* Row 2: Actual Legitimate */}
            <div className="grid grid-cols-12 gap-2 text-xs">
              <div className="col-span-3 flex items-center text-[11px] font-mono font-semibold text-cyan-400">
                Act: Legitimate
              </div>
              {/* False Positive */}
              <div className={`col-span-4 p-3 rounded-lg text-center ${
                mlModel.fpCount <= 2
                  ? 'bg-slate-950/60 border border-slate-800'
                  : 'bg-amber-950/40 border border-amber-500/40'
              }`}>
                <div className="text-[10px] font-mono text-amber-300 font-medium">False Positive (FP)</div>
                <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                  {mlModel.fpCount}
                </div>
                <div className="text-[10px] text-amber-300/70 font-mono">
                  {mlModel.fpr.toFixed(3)}% FPR (Alarms)
                </div>
              </div>
              {/* True Negative */}
              <div className="col-span-5 p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-center">
                <div className="text-[10px] font-mono text-cyan-300 font-medium">True Negative (TN)</div>
                <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                  {mlModel.tnCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-cyan-300/70 font-mono">
                  {((mlModel.tnCount / actualLegitimate) * 100).toFixed(2)}% of safe traffic
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-2 grid grid-cols-3 gap-2 text-center text-[11px] font-mono border-t border-slate-800/80">
            <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Recall / Sens.</span>
              <span className="text-emerald-400 font-bold">{mlDerived.sensitivity}%</span>
            </div>
            <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Specificity</span>
              <span className="text-cyan-400 font-bold">{mlDerived.specificity}%</span>
            </div>
            <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Total Errors</span>
              <span className="text-amber-400 font-bold">{mlModel.fpCount + mlModel.fnCount} URLs</span>
            </div>
          </div>
        </div>

        {/* DL Confusion Matrix */}
        <div className="p-5 rounded-xl bg-slate-900/70 border border-pink-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: dlModel.color }}
              />
              <h3 className="text-sm font-bold text-white tracking-tight">
                {dlModel.name} (Deep Learning)
              </h3>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-pink-500/10 text-pink-300 border border-pink-500/20">
              Accuracy: {dlModel.accuracy.toFixed(2)}%
            </span>
          </div>

          {/* 2x2 Matrix Table */}
          <div className="space-y-2">
            <div className="grid grid-cols-12 text-[11px] font-mono text-slate-400 text-center">
              <div className="col-span-3 text-left">Actual \ Pred</div>
              <div className="col-span-4 text-emerald-400 font-semibold">Pred: Phishing (1)</div>
              <div className="col-span-5 text-slate-300 font-semibold">Pred: Legitimate (0)</div>
            </div>

            {/* Row 1: Actual Phishing */}
            <div className="grid grid-cols-12 gap-2 text-xs">
              <div className="col-span-3 flex items-center text-[11px] font-mono font-semibold text-rose-400">
                Act: Phish
              </div>
              {/* True Positive */}
              <div className="col-span-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-center">
                <div className="text-[10px] font-mono text-emerald-300 font-medium">True Positive (TP)</div>
                <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
                  {dlModel.tpCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-emerald-300/70 font-mono">
                  {((dlModel.tpCount / actualPhishing) * 100).toFixed(2)}% of threats
                </div>
              </div>
              {/* False Negative */}
              <div className={`col-span-5 p-3 rounded-lg text-center ${
                dlModel.fnCount === 0
                  ? 'bg-slate-950/60 border border-slate-800'
                  : 'bg-rose-950/40 border border-rose-500/40'
              }`}>
                <div className="text-[10px] font-mono text-rose-300 font-medium">False Negative (FN)</div>
                <div className={`text-lg font-bold font-mono mt-0.5 ${
                  dlModel.fnCount === 0 ? 'text-slate-400' : 'text-rose-400'
                }`}>
                  {dlModel.fnCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-rose-300/70 font-mono">
                  {dlDerived.fnr}% breach rate
                </div>
              </div>
            </div>

            {/* Row 2: Actual Legitimate */}
            <div className="grid grid-cols-12 gap-2 text-xs">
              <div className="col-span-3 flex items-center text-[11px] font-mono font-semibold text-cyan-400">
                Act: Legitimate
              </div>
              {/* False Positive */}
              <div className={`col-span-4 p-3 rounded-lg text-center ${
                dlModel.fpCount <= 2
                  ? 'bg-slate-950/60 border border-slate-800'
                  : 'bg-amber-950/40 border border-amber-500/40'
              }`}>
                <div className="text-[10px] font-mono text-amber-300 font-medium">False Positive (FP)</div>
                <div className="text-lg font-bold text-amber-400 font-mono mt-0.5">
                  {dlModel.fpCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-amber-300/70 font-mono">
                  {dlModel.fpr.toFixed(3)}% FPR (Alarms)
                </div>
              </div>
              {/* True Negative */}
              <div className="col-span-5 p-3 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-center">
                <div className="text-[10px] font-mono text-cyan-300 font-medium">True Negative (TN)</div>
                <div className="text-lg font-bold text-cyan-400 font-mono mt-0.5">
                  {dlModel.tnCount.toLocaleString()}
                </div>
                <div className="text-[10px] text-cyan-300/70 font-mono">
                  {((dlModel.tnCount / actualLegitimate) * 100).toFixed(2)}% of safe traffic
                </div>
              </div>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-2 grid grid-cols-3 gap-2 text-center text-[11px] font-mono border-t border-slate-800/80">
            <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Recall / Sens.</span>
              <span className="text-emerald-400 font-bold">{dlDerived.sensitivity}%</span>
            </div>
            <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Specificity</span>
              <span className="text-cyan-400 font-bold">{dlDerived.specificity}%</span>
            </div>
            <div className="p-1.5 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Total Errors</span>
              <span className="text-amber-400 font-bold">{(dlModel.fpCount + dlModel.fnCount).toLocaleString()} URLs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recharts Visualization Section */}
      <div className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
          <div>
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>
                {viewMode === 'errors'
                  ? 'Comparative Error Distribution (False Alarms vs. Missed Threats across All Models)'
                  : `Side-by-Side Quad Metrics Comparison: ${mlModel.name} vs. ${dlModel.name}`}
              </span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {viewMode === 'errors'
                ? 'Empirical breakdown showing how tree ensembles virtually eliminate false alarms compared to deep sequence models'
                : `Visualizing True Positives, True Negatives, False Positives, and False Negatives (${viewMode === 'rates' ? 'Percentage' : 'Absolute Counts'})`}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-cyan-500" />
              <span className="text-slate-300">{mlModel.name.split(' ')[0]} (ML)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-pink-500" />
              <span className="text-slate-300">{dlModel.name.split(' ')[0]} (DL)</span>
            </div>
          </div>
        </div>

        {/* Recharts Chart Rendering */}
        <div className="h-72 w-full pt-2">
          {viewMode === 'errors' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={errorDistributionData}
                margin={{ top: 10, right: 30, left: 10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={11}
                  interval={0}
                  angle={-15}
                  textAnchor="end"
                />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg bg-slate-900/95 border border-slate-700 p-3 shadow-xl text-xs space-y-1.5 font-sans">
                        <div className="font-bold text-white border-b border-slate-800 pb-1 flex items-center justify-between gap-4">
                          <span>{data.fullName}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            data.category === 'ML' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-pink-500/20 text-pink-300'
                          }`}>
                            {data.category}
                          </span>
                        </div>
                        <div className="font-mono text-[11px] space-y-1 pt-1">
                          <div className="flex justify-between gap-4 text-amber-400">
                            <span>False Positives (FP):</span>
                            <span className="font-bold">{data.fpCount.toLocaleString()} ({data.fpr}%)</span>
                          </div>
                          <div className="flex justify-between gap-4 text-rose-400">
                            <span>False Negatives (FN):</span>
                            <span className="font-bold">{data.fnCount.toLocaleString()} ({data.fnr}%)</span>
                          </div>
                          <div className="flex justify-between gap-4 text-slate-300 border-t border-slate-800 pt-1">
                            <span>Total Errors:</span>
                            <span className="font-bold text-white">{data.totalErrors.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between gap-4 text-emerald-400">
                            <span>Accuracy:</span>
                            <span className="font-bold">{data.accuracy.toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  formatter={(value) => (
                    <span className="text-slate-300">
                      {value === 'fpCount' ? 'False Positives (Alarms)' : 'False Negatives (Missed Phishing)'}
                    </span>
                  )}
                />
                <Bar dataKey="fpCount" fill="#f59e0b" name="fpCount" radius={[4, 4, 0, 0]} />
                <Bar dataKey="fnCount" fill="#f43f5e" name="fnCount" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={quadMetricsData}
                margin={{ top: 10, right: 30, left: 10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="metric" stroke="#94a3b8" fontSize={11} />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={11}
                  domain={viewMode === 'rates' ? [0, 105] : ['auto', 'auto']}
                  unit={viewMode === 'rates' ? '%' : ''}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload || !payload.length) return null;
                    const item = payload[0].payload;
                    return (
                      <div className="rounded-lg bg-slate-900/95 border border-slate-700 p-3 shadow-xl text-xs space-y-1.5 font-sans">
                        <div className="font-bold text-white border-b border-slate-800 pb-1">
                          {item.metric}
                        </div>
                        <p className="text-[11px] text-slate-400">{item.description}</p>
                        <div className="font-mono text-[11px] space-y-1 pt-1">
                          <div className="flex justify-between gap-4 text-cyan-400">
                            <span>{mlModel.name} (ML):</span>
                            <span className="font-bold">
                              {Number(item.mlValue).toLocaleString()} {item.unit}
                            </span>
                          </div>
                          <div className="flex justify-between gap-4 text-pink-400">
                            <span>{dlModel.name} (DL):</span>
                            <span className="font-bold">
                              {Number(item.dlValue).toLocaleString()} {item.unit}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-500 pt-0.5">
                            {item.significance}
                          </div>
                        </div>
                      </div>
                    );
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                  formatter={(value) => (
                    <span className="text-slate-300">
                      {value === 'mlValue' ? `${mlModel.name} (ML)` : `${dlModel.name} (DL)`}
                    </span>
                  )}
                />
                <Bar
                  dataKey="mlValue"
                  name="mlValue"
                  fill="#06b6d4"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="dlValue"
                  name="dlValue"
                  fill="#ec4899"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Analytical Takeaway Callout */}
        <div className="p-3.5 rounded-lg bg-slate-950/70 border border-slate-800 flex items-start gap-3 text-xs">
          <Info className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-slate-300">
            <span className="font-semibold text-white">Dissertation Analytical Finding (Devansh Mittal, 2026):</span>
            <p className="leading-relaxed">
              When tested on 47,159 unseen URLs, <strong className="text-cyan-400">{mlModel.name}</strong> produced only{' '}
              <strong className="text-amber-400">{mlModel.fpCount} false positive(s)</strong> and{' '}
              <strong className="text-rose-400">{mlModel.fnCount} missed phishing attack(s)</strong>. By comparison,{' '}
              <strong className="text-pink-400">{dlModel.name}</strong> incurred{' '}
              <strong className="text-amber-400">{dlModel.fpCount} false alarms</strong> due to lack of engineered structural rules (such as homoglyph detection and IP hosting flags). This empirical disparity is what necessitates the two-stage hybrid cascade deployment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
