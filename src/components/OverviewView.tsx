import { useState } from 'react';
import {
  ShieldAlert,
  Zap,
  Cpu,
  Layers,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  Database,
  Lock,
  GitCompare,
  Sparkles,
  History,
  Info,
  FileText
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import {
  DISSERTATION_META,
  MODEL_BENCHMARKS,
  HISTORICAL_DATASET_EVOLUTION,
  HistoricalTrendPoint
} from '../data/dissertationData';

interface OverviewViewProps {
  onNavigate: (tabId: string) => void;
  onSelectSampleUrl: (url: string) => void;
  onOpenPdfModal?: () => void;
}

export const OverviewView = ({ onNavigate, onSelectSampleUrl, onOpenPdfModal }: OverviewViewProps) => {
  const [selectedPoint, setSelectedPoint] = useState<HistoricalTrendPoint>(
    HISTORICAL_DATASET_EVOLUTION[HISTORICAL_DATASET_EVOLUTION.length - 1]
  );
  const [chartMetric, setChartMetric] = useState<'all' | 'rf_vs_dl'>('all');

  const rf = MODEL_BENCHMARKS.find((m) => m.id === 'rf')!;
  const distilbert = MODEL_BENCHMARKS.find((m) => m.id === 'distilbert')!;
  const ann = MODEL_BENCHMARKS.find((m) => m.id === 'ann')!;
  const gbdt = MODEL_BENCHMARKS.find((m) => m.id === 'gbdt')!;

  return (
    <div className="space-y-8 pb-12">
      {/* Editorial Academic Header */}
      <section className="border-b border-slate-800/80 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-2">
              <span>MCA Dissertation Research</span>
              <span aria-hidden="true">·</span>
              <span>The NorthCap University, 2026</span>
              <span aria-hidden="true">·</span>
              <span>NIST SP 800-61 Rev. 2</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white max-w-4xl text-balance">
              Phishing URL Detection: A Comparative Analysis of Machine Learning &amp; Deep Learning Models
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
              Empirical evaluation across <strong className="text-slate-200">235,795 URLs</strong> with 56 engineered features benchmarking five traditional ML classifiers against four deep neural architectures under wire-speed network latency constraints.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {onOpenPdfModal && (
              <button
                onClick={onOpenPdfModal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-cyan-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 rounded-lg transition-colors whitespace-nowrap shadow-sm"
                title="Generate Academic Research PDF Report"
              >
                <FileText className="h-4 w-4 text-cyan-400" />
                <span>Academic PDF</span>
              </button>
            )}
            <button
              onClick={() => onNavigate('detector')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm"
            >
              <span>Inspect Live URL</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => onNavigate('simulator')}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>NIST Stream Simulator</span>
            </button>
          </div>
        </div>
      </section>

      {/* Primary KPI Metrics Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Peak Accuracy */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Ceiling Accuracy</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            99.99%
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Random Forest &amp; GBDT on UCI PhiUSIIL (cross-validated with Bao et al. 2026)
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>ANN: 99.98%</span>
            <span>DistilBERT: 99.82%</span>
          </div>
        </div>

        {/* Card 2: Inference Latency */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Wire-Speed Latency</span>
            <Zap className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            0.85 ms
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Random Forest edge latency vs <span className="text-pink-400 font-mono">18.50 ms</span> for Transformer (21.8x speedup)
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Throughput: 672 URLs/s</span>
            <span>BERT: 88 URLs/s</span>
          </div>
        </div>

        {/* Card 3: False Positive Rate */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">False Positive Rate</span>
            <ShieldAlert className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            0.005%
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Random Forest: 1 false alarm / 47,159 test samples vs 929 for DistilBERT (4.59%)
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>RF FP: 1 URL</span>
            <span>BERT FP: 929 URLs</span>
          </div>
        </div>

        {/* Card 4: Memory Footprint */}
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">RAM Footprint</span>
            <Cpu className="h-4 w-4 text-violet-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
            8.4 MB
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Tree ensemble in-memory footprint vs <span className="text-pink-400 font-mono">410.0 MB</span> for DistilBERT (98% reduction)
          </p>
          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Inline Gateway Safe</span>
            <span>Zero GPU Required</span>
          </div>
        </div>
      </section>

      {/* Head-to-Head Comparison Banner */}
      <section className="rounded-xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/30 p-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400">
              <Sparkles className="h-4 w-4" />
              <span>Pivotal Empirical Finding (Felix 2025; Ogunleye 2024 Alignment)</span>
            </div>
            <h2 className="text-xl font-bold text-white">
              Why Traditional Tree Ensembles Dominate Real-Time Inline Web Gateways
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              When equipped with a 56-feature pipeline (lexical, structural, WHOIS age, and Shannon entropy), <strong className="text-cyan-300">Random Forest and Gradient Boosting achieve 99.99% accuracy</strong> while executing in under 1 millisecond. Deep learning Transformers achieve competitive raw accuracy (99.82%) directly from raw strings, but incur <strong className="text-pink-300">15–20x higher latency</strong>, <strong className="text-pink-300">48x more RAM</strong>, and a higher false alarm rate on clean enterprise traffic.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch lg:items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => onNavigate('benchmarks')}
              className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap text-center"
            >
              Explore Full Benchmark Table
            </button>
            <button
              onClick={() => onNavigate('loss')}
              className="px-4 py-2.5 text-xs font-semibold text-cyan-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap text-center"
            >
              View Loss &amp; ROC Curves
            </button>
          </div>
        </div>
      </section>

      {/* Historical Performance Evolution: Recharts Interactive Chart */}
      <section className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">
                Historical Accuracy Evolution across 2026 Dataset Iterations
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Recharts comparison showing how ML feature engineering matured from lexical alpha to 56-feature gold standard versus Transformers.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 border border-slate-800 rounded-lg">
            <button
              onClick={() => setChartMetric('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                chartMetric === 'all'
                  ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All 4 Model Tracks
            </button>
            <button
              onClick={() => setChartMetric('rf_vs_dl')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                chartMetric === 'rf_vs_dl'
                  ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              RF vs Transformer Head-to-Head
            </button>
          </div>
        </div>

        {/* Recharts LineChart */}
        <div className="w-full h-72 sm:h-80 bg-slate-950/80 rounded-xl border border-slate-800/80 p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={HISTORICAL_DATASET_EVOLUTION}
              margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
              onClick={(e: any) => {
                if (e && e.activePayload && e.activePayload[0]) {
                  setSelectedPoint(e.activePayload[0].payload as HistoricalTrendPoint);
                }
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis
                dataKey="releaseDate"
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
              />
              <YAxis
                domain={[96.0, 100.0]}
                stroke="#64748b"
                tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                unit="%"
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#020617',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  color: '#f8fafc',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                }}
                formatter={(val: any, name: any) => {
                  const labelMap: Record<string, string> = {
                    rfAccuracy: 'Random Forest (RF)',
                    gbdtAccuracy: 'Gradient Boosting (GBDT)',
                    annAccuracy: 'Neural Net (ANN / MLP)',
                    transformerAccuracy: 'DistilBERT Transformer'
                  };
                  return [`${Number(val).toFixed(2)}%`, labelMap[name] || name];
                }}
                labelFormatter={(label: any, payload: any) => {
                  const pt = payload?.[0]?.payload;
                  return pt ? `${pt.datasetVersion} (${pt.releaseDate}) · ${pt.featuresUsed} Features` : label;
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingTop: '10px' }}
                formatter={(value: string) => {
                  const map: Record<string, string> = {
                    rfAccuracy: 'Random Forest (RF)',
                    gbdtAccuracy: 'Gradient Boosting (GBDT)',
                    annAccuracy: 'Neural Net (ANN)',
                    transformerAccuracy: 'DistilBERT Transformer'
                  };
                  return map[value] || value;
                }}
              />

              {/* Line 1: Random Forest (Cyan) */}
              <Line
                type="monotone"
                dataKey="rfAccuracy"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 5, fill: '#06b6d4', stroke: '#fff', strokeWidth: 1.5 }}
                activeDot={{ r: 8, stroke: '#06b6d4', strokeWidth: 2 }}
                name="rfAccuracy"
              />

              {/* Line 2: DistilBERT Transformer (Pink) */}
              <Line
                type="monotone"
                dataKey="transformerAccuracy"
                stroke="#ec4899"
                strokeWidth={2.5}
                strokeDasharray="4 3"
                dot={{ r: 5, fill: '#ec4899', stroke: '#fff', strokeWidth: 1.5 }}
                activeDot={{ r: 8, stroke: '#ec4899', strokeWidth: 2 }}
                name="transformerAccuracy"
              />

              {/* Optional lines when 'all' is chosen */}
              {chartMetric === 'all' && (
                <>
                  <Line
                    type="monotone"
                    dataKey="gbdtAccuracy"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#10b981' }}
                    name="gbdtAccuracy"
                  />
                  <Line
                    type="monotone"
                    dataKey="annAccuracy"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ r: 4, fill: '#8b5cf6' }}
                    name="annAccuracy"
                  />
                </>
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Selected Release Milestone Deep-Dive Card */}
        <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                Milestone Focus: {selectedPoint.datasetVersion}
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
              <span>Scale: <strong className="text-white">{selectedPoint.urlCount.toLocaleString()} URLs</strong></span>
              <span aria-hidden="true">·</span>
              <span>Pipeline: <strong className="text-cyan-400">{selectedPoint.featuresUsed} Features</strong></span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
            <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
              <span className="text-cyan-400">RF Acc:</span>
              <span className="text-white font-bold">{selectedPoint.rfAccuracy.toFixed(2)}%</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
              <span className="text-emerald-400">GBDT Acc:</span>
              <span className="text-white font-bold">{selectedPoint.gbdtAccuracy.toFixed(2)}%</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
              <span className="text-violet-400">ANN Acc:</span>
              <span className="text-white font-bold">{selectedPoint.annAccuracy.toFixed(2)}%</span>
            </div>
            <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between items-center">
              <span className="text-pink-400">BERT Acc:</span>
              <span className="text-white font-bold">{selectedPoint.transformerAccuracy.toFixed(2)}%</span>
            </div>
          </div>

          <p className="text-xs text-slate-300 font-sans leading-relaxed pt-1">
            <strong className="text-cyan-300">Phase Finding: </strong>
            {selectedPoint.description}
          </p>
        </div>
      </section>

      {/* Two-Stage Hybrid Cascade Architecture Blueprint (NIST SP 800-61 Rev. 2) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              Two-Stage Hybrid Cascade Architecture
            </h2>
            <p className="text-xs text-slate-400">
              Dissertation-proposed operational framework reconciling wire-speed edge throughput with deep sequence inspection
            </p>
          </div>
          <button
            onClick={() => onNavigate('simulator')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1"
          >
            Launch Interactive Pipeline Stream <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Stage 1 */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 relative">
            <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
              <span>STAGE 1: EDGE FILTER</span>
              <span className="text-slate-400">&lt;1.0 ms</span>
            </div>
            <h3 className="text-base font-semibold text-white">
              Fast GBDT Edge Demarcation
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Processes 672 URLs/sec at network firewalls and DNS resolvers. Instantly approves clearly safe traffic (&lt;10% risk) and drops confirmed phishing (&gt;90% risk). Resolves ~94% of enterprise traffic inline.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Model: GBDT / RF</span>
              <span className="text-emerald-400 font-mono font-medium">94% Instant Verdict</span>
            </div>
          </div>

          {/* Stage 2 */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 relative">
            <div className="flex items-center justify-between text-xs font-mono text-pink-400 mb-2">
              <span>STAGE 2: DEEP INSPECTION</span>
              <span className="text-slate-400">18.5 ms (Async)</span>
            </div>
            <h3 className="text-base font-semibold text-white">
              Asynchronous DistilBERT
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Receives borderline URLs (40% to 60% confidence band). Runs subword token attention over raw URL text to catch semantic anomalies and zero-day variants without stalling the user browser thread.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Model: DistilBERT / Bi-LSTM</span>
              <span className="text-pink-400 font-mono font-medium">~6% Traffic Volume</span>
            </div>
          </div>

          {/* Stage 3 */}
          <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800 relative">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2">
              <span>STAGE 3: INCIDENT HANDLING</span>
              <span className="text-slate-400">NIST SP 800-61</span>
            </div>
            <h3 className="text-base font-semibold text-white">
              SHAP Attribution &amp; SOC Alerts
            </h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Tree ensemble decision paths export SHAP feature attributions directly into SOC telemetry. Security analysts audit why a domain was blocked with zero black-box obscurity.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Telemetry: Auditable</span>
              <span className="text-cyan-400 font-mono font-medium">0.005% False Alarm</span>
            </div>
          </div>
        </div>
      </section>

      {/* Dataset & Evaluation Rigor */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Database className="h-4 w-4 text-cyan-400" />
            <span>Benchmark Datasets (235,795 URLs Primary)</span>
          </div>
          <h3 className="text-base font-bold text-white">
            Rigorous Empirical Dataset Partitioning
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The study utilizes the <strong className="text-slate-200">UCI PhiUSIIL (Phusion) dataset</strong> containing 134,850 phishing and 100,945 legitimate links evaluated under a stratified 80/20 train-test split (47,159 test samples).
          </p>
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-300 font-medium">UCI PhiUSIIL (56 Features)</span>
              <span className="font-mono text-cyan-400">235,795 URLs</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-300 font-medium">Kaggle Spam &amp; Phishing (Out-of-Distribution)</span>
              <span className="font-mono text-cyan-400">58,572 URLs</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-300 font-medium">UNB ISCX-URL2016 (Multi-Class 5-Category)</span>
              <span className="font-mono text-cyan-400">~45,222 URLs</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 px-3 rounded-lg bg-slate-950/60 border border-slate-800">
              <span className="text-slate-300 font-medium">PhishTank / OpenPhish + Tranco Top 1M</span>
              <span className="font-mono text-cyan-400">Live Raw URL Stream</span>
            </div>
          </div>
        </div>

        {/* Quick Test Vectors Preset */}
        <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <Lock className="h-4 w-4 text-emerald-400" />
              <span>Adversarial Evasion Stress-Testing</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">3 Tested Vectors</span>
          </div>
          <h3 className="text-base font-bold text-white">
            Tested Real-World Evasion Tactics
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            The study empirically tested models against tactics designed to evade static blacklists and clean split models:
          </p>

          <div className="space-y-2 pt-1">
            <button
              onClick={() => {
                onSelectSampleUrl('https://pаypal.com-verify.account-security.xyz/login');
                onNavigate('detector');
              }}
              className="w-full text-left p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 transition-colors group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 group-hover:text-cyan-400">
                  1. Homograph Substitution (Cyrillic Spoof)
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">RF: 99.8% Flag</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-1 truncate">
                https://pаypal.com-verify.account-security.xyz/login
              </p>
            </button>

            <button
              onClick={() => {
                onSelectSampleUrl('http://192.168.104.22:8080/secure/bank-update/auth.php');
                onNavigate('detector');
              }}
              className="w-full text-left p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 transition-colors group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 group-hover:text-cyan-400">
                  2. Direct-IP Hosting (No Registered Domain)
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">RF: 100% Flag</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-1 truncate">
                http://192.168.104.22:8080/secure/bank-update/auth.php
              </p>
            </button>

            <button
              onClick={() => {
                onSelectSampleUrl('https://chase.com.updates.security-alert.host.top/credentials');
                onNavigate('detector');
              }}
              className="w-full text-left p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 transition-colors group"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200 group-hover:text-cyan-400">
                  3. Multi-Tier Subdomain Stuffing
                </span>
                <span className="text-[11px] text-emerald-400 font-mono">RF: 99.9% Flag</span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono mt-1 truncate">
                https://chase.com.updates.security-alert.host.top/credentials
              </p>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
