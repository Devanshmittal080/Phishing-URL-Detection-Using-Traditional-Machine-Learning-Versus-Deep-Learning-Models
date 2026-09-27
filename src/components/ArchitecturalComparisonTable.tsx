import { useState, useMemo } from 'react';
import {
  Cpu,
  Layers,
  Search,
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Sparkles,
  Clock,
  HardDrive,
  FileCode2,
  Binary,
  ArrowRight,
  Info,
  Scale
} from 'lucide-react';
import { ARCHITECTURAL_SPECS } from '../data/dissertationData';
import { ModelArchitectureSpec } from '../types/phishing';

interface ArchitecturalComparisonTableProps {
  onSelectModel?: (modelId: string) => void;
  selectedModelId?: string;
}

export const ArchitecturalComparisonTable = ({
  onSelectModel,
  selectedModelId
}: ArchitecturalComparisonTableProps) => {
  const [filterCategory, setFilterCategory] = useState<'ALL' | 'ML' | 'DL'>('ALL');
  const [activeViewTab, setActiveViewTab] = useState<'overview' | 'features' | 'hardware'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedModelId, setExpandedModelId] = useState<string | null>(selectedModelId || 'rf');
  const [copiedState, setCopiedState] = useState(false);

  // Filtered models
  const filteredSpecs = useMemo(() => {
    return ARCHITECTURAL_SPECS.filter((spec) => {
      if (filterCategory !== 'ALL' && spec.category !== filterCategory) return false;
      if (!searchQuery.trim()) return true;
      const query = searchQuery.toLowerCase();
      return (
        spec.name.toLowerCase().includes(query) ||
        spec.paradigm.toLowerCase().includes(query) ||
        spec.featureExtractionTechnique.toLowerCase().includes(query) ||
        spec.totalParameters.toLowerCase().includes(query) ||
        spec.trainingHardwareProfile.toLowerCase().includes(query)
      );
    });
  }, [filterCategory, searchQuery]);

  // Copy Markdown Table to Clipboard
  const handleCopyMarkdown = () => {
    const header = '| Model | Paradigm | Category | Total Parameters | Feature Extraction Technique | Input Shape | RAM | Latency | NIST Stage |\n|---|---|---|---|---|---|---|---|---|';
    const rows = filteredSpecs.map(
      (s) =>
        `| ${s.name} | ${s.paradigm} | ${s.category} | ${s.totalParameters} | ${s.featureExtractionCategory} | ${s.inputDimensions} | ${s.memoryConsumptionMb} MB | ${s.runtimeInferenceMs} ms | ${s.nistPipelineStage} |`
    );
    const md = [header, ...rows].join('\n');
    navigator.clipboard.writeText(md);
    setCopiedState(true);
    setTimeout(() => setCopiedState(false), 2000);
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      'Model ID',
      'Model Name',
      'Category',
      'Paradigm',
      'Total Parameters',
      'Parameter Breakdown',
      'Feature Extraction Technique',
      'Feature Extraction Category',
      'Feature Pipeline Latency (ms)',
      'Input Representation',
      'Input Dimensions',
      'Training Hardware Profile',
      'Training Time',
      'Inference Complexity (Big-O)',
      'Memory Consumption (MB)',
      'Runtime Inference Latency (ms)',
      'Adversarial Vulnerability',
      'Interpretability Method',
      'NIST Pipeline Stage',
      'Key Architectural Advantage',
      'Key Architectural Limitation'
    ];

    const csvRows = filteredSpecs.map((s) => [
      `"${s.modelId}"`,
      `"${s.name}"`,
      `"${s.category}"`,
      `"${s.paradigm}"`,
      `"${s.totalParameters}"`,
      `"${s.parameterBreakdown.replace(/"/g, '""')}"`,
      `"${s.featureExtractionTechnique.replace(/"/g, '""')}"`,
      `"${s.featureExtractionCategory}"`,
      s.featurePipelineLatencyMs,
      `"${s.inputRepresentation.replace(/"/g, '""')}"`,
      `"${s.inputDimensions.replace(/"/g, '""')}"`,
      `"${s.trainingHardwareProfile.replace(/"/g, '""')}"`,
      `"${s.trainingTime}"`,
      `"${s.inferenceBigO.replace(/"/g, '""')}"`,
      s.memoryConsumptionMb,
      s.runtimeInferenceMs,
      `"${s.adversarialVulnerability.replace(/"/g, '""')}"`,
      `"${s.interpretabilityMethod.replace(/"/g, '""')}"`,
      `"${s.nistPipelineStage.replace(/"/g, '""')}"`,
      `"${s.keyArchitecturalAdvantage.replace(/"/g, '""')}"`,
      `"${s.keyArchitecturalLimitation.replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...csvRows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PhishGuard_Model_Architectural_Comparison_${filterCategory}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getLogScaleWidth = (paramNumber: number) => {
    // 112 -> log10 ~ 2.04
    // 66,362,880 -> log10 ~ 7.82
    const minLog = 2.0;
    const maxLog = 7.85;
    const logVal = Math.log10(Math.max(10, paramNumber));
    const pct = Math.max(4, Math.min(100, ((logVal - minLog) / (maxLog - minLog)) * 100));
    return `${pct.toFixed(1)}%`;
  };

  return (
    <section className="space-y-5 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-xl backdrop-blur-sm">
      {/* Section Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Architectural Comparison Matrix: Traditional ML vs Deep Learning
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-4xl leading-relaxed">
            Rigorous cross-paradigm analysis contrasting parameter scalability, manual feature engineering versus learned subword representations, computational Big-O complexity, and operational deployment feasibility under NIST SP 800-61 Rev. 2.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            title="Copy Table as GitHub Markdown"
          >
            {copiedState ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
            <span>{copiedState ? 'Copied Markdown!' : 'Copy Markdown'}</span>
          </button>
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm shadow-cyan-950"
            title="Export Architectural Specifications to CSV"
          >
            <Download className="h-3.5 w-3.5 text-slate-950" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* High-Level Paradigm Dichotomy Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Traditional ML Paradigm Card */}
        <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/20 via-slate-900/60 to-slate-900/90 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
              <h3 className="text-sm font-bold text-cyan-300 uppercase tracking-wider">
                Traditional Machine Learning
              </h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 rounded">
              RF · GBDT · SVM · Naïve Bayes
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Relies on <strong className="text-white">handcrafted domain heuristics (56 features)</strong> pre-extracted from URLs. Decouples feature parsing from classification, enabling orders-of-magnitude lighter parameter sizes and microsecond inference.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Parameter Range</span>
              <span className="text-cyan-400 font-bold">112 to ~120K</span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Avg Inference Speed</span>
              <span className="text-emerald-400 font-bold">0.83 ms</span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Memory Footprint</span>
              <span className="text-slate-200 font-bold">4.2 – 12.6 MB</span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Hardware Profile</span>
              <span className="text-slate-300 font-semibold">Commodity CPU</span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Explainability</span>
              <span className="text-emerald-400 font-bold">TreeSHAP (Exact)</span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Primary NIST Fit</span>
              <span className="text-cyan-300 font-semibold truncate" title="Stage 1 Line-Rate Edge Filter">Stage 1: Line-Rate</span>
            </div>
          </div>
        </div>

        {/* Deep Learning Paradigm Card */}
        <div className="rounded-xl border border-pink-500/30 bg-gradient-to-br from-pink-950/20 via-slate-900/60 to-slate-900/90 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-400" />
              <h3 className="text-sm font-bold text-pink-300 uppercase tracking-wider">
                Deep Learning Architectures
              </h3>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-mono font-semibold bg-pink-500/10 text-pink-300 border border-pink-500/20 rounded">
              DistilBERT · 1D-CNN · Bi-LSTM · ANN
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Extracts <strong className="text-white">latent character/subword representations end-to-end</strong>. Eliminates feature engineering parser overhead but scales to tens of millions of parameters, demanding GPU acceleration and substantial RAM.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-mono text-[11px]">
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Parameter Range</span>
              <span className="text-pink-400 font-bold">15.6K to 66.4M</span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Avg Inference Speed</span>
              <span className="text-amber-400 font-bold">9.74 ms</span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Memory Footprint</span>
              <span className="text-pink-400 font-bold">18.2 – 410 MB</span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Hardware Profile</span>
              <span className="text-pink-300 font-semibold">NVIDIA GPU (A100/T4)</span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Explainability</span>
              <span className="text-amber-400 font-semibold">Attention / Saliency</span>
            </div>
            <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
              <span className="text-slate-500 text-[10px] block">Primary NIST Fit</span>
              <span className="text-pink-300 font-semibold truncate" title="Stage 2 Deep Asynchronous Inspection">Stage 2: Deep Sandbox</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search, Category Filters, and Table Views */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Paradigm Category Filter */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setFilterCategory('ALL')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                filterCategory === 'ALL'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All 8 Models
            </button>
            <button
              onClick={() => setFilterCategory('ML')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                filterCategory === 'ML'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-cyan-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              Traditional ML
            </button>
            <button
              onClick={() => setFilterCategory('DL')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 ${
                filterCategory === 'DL'
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                  : 'text-slate-400 hover:text-pink-400'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-pink-400" />
              Deep Learning
            </button>
          </div>

          {/* Perspective View Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
            <button
              onClick={() => setActiveViewTab('overview')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeViewTab === 'overview'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Parameters &amp; Complexity
            </button>
            <button
              onClick={() => setActiveViewTab('features')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeViewTab === 'features'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Feature Extraction Pipelines
            </button>
            <button
              onClick={() => setActiveViewTab('hardware')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                activeViewTab === 'hardware'
                  ? 'bg-slate-800 text-cyan-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Compute &amp; Robustness
            </button>
          </div>
        </div>

        {/* Live Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search architecture, parameters..."
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
        </div>
      </div>

      {/* Main Architectural Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/80 shadow-md">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-300 font-semibold uppercase tracking-wider">
              <th className="py-3 px-4">Model &amp; Paradigm</th>
              <th className="py-3 px-3">Type</th>
              {activeViewTab === 'overview' && (
                <>
                  <th className="py-3 px-4">Total Parameters &amp; Scale</th>
                  <th className="py-3 px-4">Parameter Structure Breakdown</th>
                  <th className="py-3 px-3">Input Vector / Tensor</th>
                  <th className="py-3 px-3 text-right">Big-O Inference</th>
                  <th className="py-3 px-3 text-right">RAM</th>
                  <th className="py-3 px-3 text-right">Latency</th>
                </>
              )}
              {activeViewTab === 'features' && (
                <>
                  <th className="py-3 px-4">Feature Extraction Technique</th>
                  <th className="py-3 px-3">Extraction Category</th>
                  <th className="py-3 px-3 text-right">Extractor Overhead</th>
                  <th className="py-3 px-4">Input Representation Flow</th>
                  <th className="py-3 px-3">Pre-processing Needs</th>
                </>
              )}
              {activeViewTab === 'hardware' && (
                <>
                  <th className="py-3 px-4">Training Hardware Requirement</th>
                  <th className="py-3 px-3">Train Duration</th>
                  <th className="py-3 px-4">Adversarial Attack Vulnerability</th>
                  <th className="py-3 px-3">Explainability Engine</th>
                  <th className="py-3 px-4">NIST Deployment Fit</th>
                </>
              )}
              <th className="py-3 px-3 text-center">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono">
            {filteredSpecs.map((spec) => {
              const isExpanded = expandedModelId === spec.modelId;
              const isMl = spec.category === 'ML';

              return (
                <tr
                  key={spec.modelId}
                  onClick={() => {
                    setExpandedModelId(isExpanded ? null : spec.modelId);
                    if (onSelectModel) onSelectModel(spec.modelId);
                  }}
                  className={`cursor-pointer transition-colors ${
                    isExpanded ? 'bg-cyan-500/10 hover:bg-cyan-500/15' : 'hover:bg-slate-900/60'
                  }`}
                >
                  {/* Model & Paradigm */}
                  <td className="py-3 px-4 font-sans font-medium text-slate-200">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: spec.color }} />
                      <div>
                        <div className="text-white font-semibold text-xs">{spec.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono font-normal">{spec.paradigm}</div>
                      </div>
                    </div>
                  </td>

                  {/* Type Badge */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded ${
                        isMl ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30' : 'bg-pink-500/15 text-pink-300 border border-pink-500/30'
                      }`}
                    >
                      {spec.category}
                    </span>
                  </td>

                  {/* VIEW 1: Overview & Parameters */}
                  {activeViewTab === 'overview' && (
                    <>
                      {/* Total Parameters & Visual Log Scale */}
                      <td className="py-3 px-4">
                        <div className="space-y-1 max-w-[200px]">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-white tabular-nums">{spec.totalParameters}</span>
                            <span className="text-[10px] text-slate-500">
                              {spec.paramScaleNumber > 1000000 ? `${(spec.paramScaleNumber / 1000000).toFixed(1)}M` : spec.paramScaleNumber > 1000 ? `${(spec.paramScaleNumber / 1000).toFixed(0)}K` : spec.paramScaleNumber}
                            </span>
                          </div>
                          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: getLogScaleWidth(spec.paramScaleNumber),
                                backgroundColor: spec.color
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Parameter Breakdown */}
                      <td className="py-3 px-4 font-sans text-slate-300 text-[11px] max-w-[240px]">
                        <span className="line-clamp-2" title={spec.parameterBreakdown}>
                          {spec.parameterBreakdown}
                        </span>
                      </td>

                      {/* Input Vector / Dimensions */}
                      <td className="py-3 px-3 text-slate-300 text-[11px]">
                        <span className="font-mono text-cyan-400/90">{spec.inputDimensions}</span>
                      </td>

                      {/* Big-O Inference */}
                      <td className="py-3 px-3 text-right text-slate-300 text-[11px]">
                        <span className="font-mono text-amber-300/90">{spec.inferenceBigO}</span>
                      </td>

                      {/* RAM */}
                      <td className="py-3 px-3 text-right tabular-nums">
                        <span className={spec.memoryConsumptionMb > 50 ? 'text-pink-400 font-semibold' : 'text-slate-300'}>
                          {spec.memoryConsumptionMb.toFixed(1)} MB
                        </span>
                      </td>

                      {/* Latency */}
                      <td className="py-3 px-3 text-right tabular-nums">
                        <span
                          className={`font-semibold ${
                            spec.runtimeInferenceMs < 1.0
                              ? 'text-emerald-400'
                              : spec.runtimeInferenceMs < 5.0
                              ? 'text-cyan-400'
                              : 'text-pink-400'
                          }`}
                        >
                          {spec.runtimeInferenceMs.toFixed(2)} ms
                        </span>
                      </td>
                    </>
                  )}

                  {/* VIEW 2: Feature Extraction Pipelines */}
                  {activeViewTab === 'features' && (
                    <>
                      {/* Feature Extraction Technique */}
                      <td className="py-3 px-4 font-sans text-slate-300 text-[11px] max-w-[300px]">
                        <span className="line-clamp-2" title={spec.featureExtractionTechnique}>
                          {spec.featureExtractionTechnique}
                        </span>
                      </td>

                      {/* Extraction Category */}
                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-[10px] font-sans font-semibold rounded ${
                            spec.featureExtractionCategory === 'Handcrafted Domain Features'
                              ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/20'
                              : spec.featureExtractionCategory === 'Contextual Subword Tokenization'
                              ? 'bg-pink-500/10 text-pink-300 border border-pink-500/20'
                              : spec.featureExtractionCategory === 'End-to-End Character n-grams'
                              ? 'bg-teal-500/10 text-teal-300 border border-teal-500/20'
                              : 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                          }`}
                        >
                          {spec.featureExtractionCategory}
                        </span>
                      </td>

                      {/* Extractor Overhead */}
                      <td className="py-3 px-3 text-right tabular-nums font-mono">
                        <span
                          className={`font-bold ${
                            spec.featurePipelineLatencyMs === 0 ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {spec.featurePipelineLatencyMs === 0 ? '0.00 ms (Zero)' : `${spec.featurePipelineLatencyMs.toFixed(2)} ms`}
                        </span>
                      </td>

                      {/* Input Representation Flow */}
                      <td className="py-3 px-4 font-sans text-slate-300 text-[11px] max-w-[260px]">
                        <span className="line-clamp-2 font-mono text-[10px] text-slate-400" title={spec.inputRepresentation}>
                          {spec.inputRepresentation}
                        </span>
                      </td>

                      {/* Pre-processing Needs */}
                      <td className="py-3 px-3 font-sans text-slate-400 text-[11px]">
                        {spec.featurePipelineLatencyMs > 0 ? (
                          <span className="text-amber-300 flex items-center gap-1">
                            <Binary className="h-3 w-3" /> 56-feature extractor
                          </span>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <Sparkles className="h-3 w-3" /> Raw URL String
                          </span>
                        )}
                      </td>
                    </>
                  )}

                  {/* VIEW 3: Compute & Robustness */}
                  {activeViewTab === 'hardware' && (
                    <>
                      {/* Hardware Profile */}
                      <td className="py-3 px-4 font-sans text-slate-200 text-[11px]">
                        <span className="font-semibold text-slate-200">{spec.trainingHardwareProfile}</span>
                      </td>

                      {/* Train Duration */}
                      <td className="py-3 px-3 font-mono text-cyan-400 text-[11px] whitespace-nowrap">
                        {spec.trainingTime}
                      </td>

                      {/* Adversarial Vulnerability */}
                      <td className="py-3 px-4 font-sans text-slate-300 text-[11px] max-w-[260px]">
                        <span className="line-clamp-2" title={spec.adversarialVulnerability}>
                          {spec.adversarialVulnerability}
                        </span>
                      </td>

                      {/* Explainability Engine */}
                      <td className="py-3 px-3 font-sans text-slate-300 text-[11px]">
                        <span className="font-mono text-emerald-400 text-[10px]">{spec.interpretabilityMethod}</span>
                      </td>

                      {/* NIST Deployment Fit */}
                      <td className="py-3 px-4 font-sans text-[11px]">
                        <span className="text-slate-300 line-clamp-1" title={spec.nistPipelineStage}>
                          {spec.nistPipelineStage}
                        </span>
                      </td>
                    </>
                  )}

                  {/* Expand Chevron */}
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedModelId(isExpanded ? null : spec.modelId);
                      }}
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title={isExpanded ? 'Collapse dossier' : 'Expand detailed architectural dossier'}
                    >
                      {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Expanded Model Architectural Dossier (Accordion Deep-Dive) */}
      {expandedModelId && (
        <div className="rounded-xl border border-cyan-500/40 bg-slate-950 p-5 space-y-4 shadow-lg animate-in fade-in duration-300">
          {(() => {
            const spec = ARCHITECTURAL_SPECS.find((s) => s.modelId === expandedModelId) || ARCHITECTURAL_SPECS[0];
            return (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: spec.color }} />
                    <h3 className="text-base font-bold text-white tracking-wide">
                      {spec.name} — Full Architectural Dossier
                    </h3>
                    <span className="px-2 py-0.5 text-xs font-mono font-semibold bg-slate-800 text-cyan-300 border border-slate-700 rounded">
                      {spec.category} · {spec.paradigm}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-slate-400">Total Parameters: <strong className="text-white">{spec.totalParameters}</strong></span>
                    <span className="text-slate-400">RAM: <strong className="text-cyan-400">{spec.memoryConsumptionMb} MB</strong></span>
                  </div>
                </div>

                {/* 3-Column Detailed Breakdown Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {/* Card 1: Feature Extraction Pipeline */}
                  <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-cyan-400 uppercase font-mono tracking-wider font-semibold text-[11px]">
                      <FileCode2 className="h-4 w-4" />
                      Feature Extraction Architecture
                    </div>
                    <p className="text-slate-200 leading-relaxed font-sans">
                      {spec.featureExtractionTechnique}
                    </p>
                    <div className="space-y-1 pt-2 border-t border-slate-800 font-mono text-[11px]">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Input Representation:</span>
                        <span className="text-slate-200">{spec.inputDimensions}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Feature Extraction Latency:</span>
                        <span className={spec.featurePipelineLatencyMs === 0 ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                          {spec.featurePipelineLatencyMs === 0 ? '0.00 ms (Direct URL)' : `${spec.featurePipelineLatencyMs.toFixed(2)} ms (Parser)`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total System Latency:</span>
                        <span className="text-cyan-400 font-bold">
                          {(spec.featurePipelineLatencyMs + spec.runtimeInferenceMs).toFixed(2)} ms
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Computational Profile & Complexity */}
                  <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-amber-400 uppercase font-mono tracking-wider font-semibold text-[11px]">
                      <Scale className="h-4 w-4" />
                      Computational Big-O &amp; Hardware
                    </div>
                    <div className="space-y-1.5 font-sans text-slate-300">
                      <div>
                        <span className="text-slate-400 font-mono block text-[10px]">Parameter Topology:</span>
                        <span className="text-white font-medium">{spec.parameterBreakdown}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-mono block text-[10px]">Inference Big-O:</span>
                        <code className="text-amber-300 font-mono text-[11px] bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          {spec.inferenceBigO}
                        </code>
                      </div>
                      <div>
                        <span className="text-slate-400 font-mono block text-[10px]">Training Hardware &amp; Time:</span>
                        <span className="text-slate-200 font-mono text-[11px]">
                          {spec.trainingHardwareProfile} · <strong className="text-emerald-400">{spec.trainingTime}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card 3: Cyber Security & Deployment Fit */}
                  <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 space-y-2">
                    <div className="flex items-center gap-2 text-pink-400 uppercase font-mono tracking-wider font-semibold text-[11px]">
                      <ShieldAlert className="h-4 w-4" />
                      Adversarial Resilience &amp; NIST Fit
                    </div>
                    <div className="space-y-1.5 font-sans">
                      <div>
                        <span className="text-slate-400 font-mono block text-[10px]">Adversarial Attack Vulnerability:</span>
                        <p className="text-slate-200 text-[11px] leading-relaxed">
                          {spec.adversarialVulnerability}
                        </p>
                      </div>
                      <div>
                        <span className="text-slate-400 font-mono block text-[10px]">Explainability Engine:</span>
                        <span className="text-emerald-400 font-mono text-[11px] font-semibold">
                          {spec.interpretabilityMethod}
                        </span>
                      </div>
                      <div className="pt-1">
                        <span className="text-slate-400 font-mono block text-[10px]">NIST SP 800-61 Rev. 2 Role:</span>
                        <span className="text-cyan-300 text-[11px] font-medium block">
                          {spec.nistPipelineStage}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Architectural Trade-off Summary Banner */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-xs">
                  <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-slate-300 flex items-start gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-300 font-semibold block text-[11px]">Primary Architectural Advantage:</strong>
                      <span className="text-slate-200 leading-relaxed">{spec.keyArchitecturalAdvantage}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-slate-300 flex items-start gap-2">
                    <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300 font-semibold block text-[11px]">Primary Architectural Limitation:</strong>
                      <span className="text-slate-200 leading-relaxed">{spec.keyArchitecturalLimitation}</span>
                    </div>
                  </div>
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* Feature Extraction Pipeline Flow Comparison Callout */}
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/60 space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Comparative Feature Extraction Pipeline Dynamics (ML vs DL)
          </h4>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs font-mono">
          {/* Traditional ML Pipeline Flow */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-cyan-300 font-semibold">
              <span>Traditional ML Feature Pipeline</span>
              <span className="text-slate-400 text-[10px]">Total Latency: ~4.25 ms</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300">
              <span className="px-2 py-1 bg-slate-950 rounded border border-slate-800">Raw URL</span>
              <ArrowRight className="h-3 w-3 text-slate-500" />
              <span className="px-2 py-1 bg-amber-500/10 text-amber-300 rounded border border-amber-500/20" title="Extracts 16 Lexical, 14 Structural, 14 Domain/SSL, 12 Statistical">
                Feature Extractor (3.40 ms)
              </span>
              <ArrowRight className="h-3 w-3 text-slate-500" />
              <span className="px-2 py-1 bg-slate-950 rounded border border-slate-800">56-Dim Vector</span>
              <ArrowRight className="h-3 w-3 text-slate-500" />
              <span className="px-2 py-1 bg-cyan-500/10 text-cyan-300 rounded border border-cyan-500/20">
                Tree Ensemble (0.85 ms)
              </span>
              <ArrowRight className="h-3 w-3 text-slate-500" />
              <span className="px-2 py-1 bg-emerald-500/15 text-emerald-300 rounded border border-emerald-500/30">
                Verdict
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-400 leading-relaxed pt-1">
              • <strong>Trade-off:</strong> Requires a pre-extraction stage (3.40 ms) before tree evaluation, but the classifier itself is blazing fast (0.85 ms, 672 req/sec) and requires just 8.4 MB of memory.
            </p>
          </div>

          {/* Deep Learning Pipeline Flow */}
          <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-pink-300 font-semibold">
              <span>Deep Learning Contextual Pipeline (DistilBERT)</span>
              <span className="text-slate-400 text-[10px]">Total Latency: ~18.70 ms</span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-slate-300">
              <span className="px-2 py-1 bg-slate-950 rounded border border-slate-800">Raw URL</span>
              <ArrowRight className="h-3 w-3 text-slate-500" />
              <span className="px-2 py-1 bg-teal-500/10 text-teal-300 rounded border border-teal-500/20" title="Byte-Pair Encoding WordPiece subword tokenization">
                BPE Tokenizer (0.20 ms)
              </span>
              <ArrowRight className="h-3 w-3 text-slate-500" />
              <span className="px-2 py-1 bg-slate-950 rounded border border-slate-800">128 Subword Tokens</span>
              <ArrowRight className="h-3 w-3 text-slate-500" />
              <span className="px-2 py-1 bg-pink-500/10 text-pink-300 rounded border border-pink-500/20">
                6-Layer Transformer (18.50 ms)
              </span>
              <ArrowRight className="h-3 w-3 text-slate-500" />
              <span className="px-2 py-1 bg-emerald-500/15 text-emerald-300 rounded border border-emerald-500/30">
                Verdict
              </span>
            </div>
            <p className="text-[11px] font-sans text-slate-400 leading-relaxed pt-1">
              • <strong>Trade-off:</strong> Ingests raw URL strings directly with zero manual feature extraction, but quadratic self-attention ($O(L^2 \cdot d)$) consumes 410 MB RAM and 18.5 ms of GPU compute.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
