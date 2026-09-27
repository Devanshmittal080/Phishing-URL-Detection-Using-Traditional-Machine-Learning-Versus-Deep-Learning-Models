import { useState } from 'react';
import {
  Search,
  ShieldCheck,
  ShieldAlert,
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle,
  Copy,
  Check,
  Clock
} from 'lucide-react';
import { extractUrlFeatures, evaluateModelsOnUrl } from '../utils/featureExtractor';
import { SAMPLE_URLS_PRESET } from '../data/dissertationData';
import { ExtractedFeatures, ModelPrediction } from '../types/phishing';

interface RealTimeDetectorViewProps {
  initialUrl?: string;
}

export const RealTimeDetectorView = ({ initialUrl }: RealTimeDetectorViewProps) => {
  const [inputUrl, setInputUrl] = useState<string>(
    initialUrl || 'https://pаypal.com-verify.account-security.xyz/login'
  );
  const [copied, setCopied] = useState<boolean>(false);

  const features: ExtractedFeatures = extractUrlFeatures(inputUrl);
  const predictions: ModelPrediction[] = evaluateModelsOnUrl(features);

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSelectPreset = (url: string) => {
    setInputUrl(url);
  };

  const rfPred = predictions.find((p) => p.modelId === 'rf')!;
  const distilbertPred = predictions.find((p) => p.modelId === 'distilbert')!;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <section className="border-b border-slate-800/80 pb-6">
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
          <span>Real-Time Detection Engine</span>
          <span aria-hidden="true">·</span>
          <span>56-Feature Vector Pipeline + Model Inference</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Interactive Live Phishing URL Inspector
        </h1>
        <p className="mt-1 text-sm text-slate-400 max-w-2xl">
          Enter any URL to execute the 56-feature extraction pipeline, calculate Shannon character entropy, and evaluate side-by-side inference across ML and DL models.
        </p>
      </section>

      {/* Input Box & Presets */}
      <section className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
            <span>Target URL to Inspect</span>
            <span className="text-slate-500 font-mono text-[11px]">Accepts IPv4, subdomains, punycode &amp; query params</span>
          </label>
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="e.g. https://pаypal.com-verify.xyz/login"
              className="w-full px-4 py-3 pl-11 pr-24 text-sm font-mono bg-slate-950 border border-slate-700/80 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all shadow-inner"
            />
            <Search className="absolute left-3.5 h-4 w-4 text-slate-400 pointer-events-none" />
            <div className="absolute right-2 flex items-center gap-1.5">
              <button
                onClick={() => handleCopyUrl(inputUrl)}
                className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors flex items-center gap-1"
                title="Copy URL"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span className="text-[11px] font-mono">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Curated Dissertation Test Samples */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-medium text-slate-400">
            Dissertation Test Vectors (Click to load):
          </span>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_URLS_PRESET.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectPreset(preset.url)}
                className={`text-xs px-3 py-1.5 rounded-lg border text-left transition-all ${
                  inputUrl === preset.url
                    ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300 font-medium'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <span className="font-semibold text-slate-200 block">{preset.label}</span>
                <span className="text-[10px] text-slate-400 block font-mono">{preset.tag}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Head-to-Head Top Banner: RF vs DistilBERT */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Random Forest Verdict */}
        <div className={`p-5 rounded-xl border transition-all ${
          rfPred.isPhishing
            ? 'bg-gradient-to-br from-red-950/30 to-slate-900 border-red-500/40'
            : 'bg-gradient-to-br from-emerald-950/30 to-slate-900 border-emerald-500/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-cyan-400 uppercase font-semibold">
              Traditional ML Benchmark
            </span>
            <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
              <span>{rfPred.inferenceTimeMs} ms</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Random Forest (RF)</h2>
            <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
              rfPred.isPhishing
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {rfPred.isPhishing ? 'MALICIOUS PHISHING' : 'LEGITIMATE SAFE'}
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Phishing Risk:</span>
              <span className={`font-bold tabular-nums ${rfPred.isPhishing ? 'text-red-400' : 'text-emerald-400'}`}>
                {(rfPred.phishingProbability * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  rfPred.isPhishing ? 'bg-red-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${rfPred.phishingProbability * 100}%` }}
              />
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400 leading-relaxed font-sans">
            {rfPred.decisionRule}
          </p>
        </div>

        {/* DistilBERT Verdict */}
        <div className={`p-5 rounded-xl border transition-all ${
          distilbertPred.isPhishing
            ? 'bg-gradient-to-br from-pink-950/30 to-slate-900 border-pink-500/40'
            : 'bg-gradient-to-br from-emerald-950/30 to-slate-900 border-emerald-500/40'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-pink-400 uppercase font-semibold">
              Deep Learning Benchmark
            </span>
            <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
              <Clock className="h-3.5 w-3.5 text-pink-400" />
              <span>{distilbertPred.inferenceTimeMs} ms</span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">DistilBERT Transformer</h2>
            <div className={`px-2.5 py-0.5 rounded-full text-xs font-bold font-mono ${
              distilbertPred.isPhishing
                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {distilbertPred.isPhishing ? 'MALICIOUS PHISHING' : 'LEGITIMATE SAFE'}
            </div>
          </div>

          <div className="mt-3 space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Phishing Risk:</span>
              <span className={`font-bold tabular-nums ${distilbertPred.isPhishing ? 'text-pink-400' : 'text-emerald-400'}`}>
                {(distilbertPred.phishingProbability * 100).toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  distilbertPred.isPhishing ? 'bg-pink-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${distilbertPred.phishingProbability * 100}%` }}
              />
            </div>
          </div>

          <p className="mt-3 text-xs text-slate-400 leading-relaxed font-sans">
            {distilbertPred.decisionRule}
          </p>
        </div>
      </section>

      {/* SHAP Feature Attribution Analysis */}
      {rfPred.shapContributions && rfPred.shapContributions.length > 0 && (
        <section className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-cyan-400" />
              <h2 className="text-base font-bold text-white">
                SHAP Feature Attribution (Tree Interpretability)
              </h2>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Contribution to Phishing Score
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Unlike black-box transformers, Random Forest exposes exact feature attributions for security analyst review:
          </p>

          <div className="space-y-2.5 pt-1">
            {rfPred.shapContributions.map((shap, idx) => {
              const isPositive = shap.impactScore > 0;
              const widthPct = Math.min(100, Math.abs(shap.impactScore) * 180);
              return (
                <div key={idx} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-mono mb-1">
                    <span className="text-slate-200 font-semibold">{shap.featureName}</span>
                    <span className={isPositive ? 'text-red-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {isPositive ? `+${(shap.impactScore * 100).toFixed(0)}% Risk` : `${(shap.impactScore * 100).toFixed(0)}% Safe`}
                    </span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden mb-1.5">
                    <div
                      className={`h-full rounded-full ${isPositive ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Observed Value: <strong className="text-slate-200">{shap.value}</strong></span>
                    <span>{shap.description}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Extracted 56-Feature Pipeline Attributes Grid */}
      <section className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">
              Extracted Feature Vector Attributes (4 Categories)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Shannon Entropy: <strong className="text-cyan-400">{features.shannonEntropy} bits</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          {/* Category 1: Lexical */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
              1. Lexical Attributes
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">URL Length:</span>
                <span className="font-bold text-white">{features.urlLength}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Domain Length:</span>
                <span className="font-bold text-white">{features.domainLength}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dots / Hyphens:</span>
                <span>{features.numDots} / {features.numHyphens}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Auth Keywords:</span>
                <span className={features.suspiciousKeywordsCount > 0 ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                  {features.suspiciousKeywordsCount} ({features.detectedKeywords.join(', ') || 'None'})
                </span>
              </div>
            </div>
          </div>

          {/* Category 2: Structural */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider">
              2. Structural Attributes
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Subdomains:</span>
                <span className={features.numSubdomains >= 3 ? 'text-amber-400 font-bold' : 'text-white'}>
                  {features.numSubdomains}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Direct-IP Host:</span>
                <span className={features.hasIpAddress ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  {features.hasIpAddress ? 'YES (Triggered)' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">@ Symbol Redirect:</span>
                <span>{features.hasAtSymbol ? 'Present' : 'None'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Non-Standard Port:</span>
                <span>{features.hasPortInUrl ? 'Port Open' : 'Standard'}</span>
              </div>
            </div>
          </div>

          {/* Category 3: Domain & SSL */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-violet-400 uppercase tracking-wider">
              3. Domain &amp; SSL Attributes
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">TLD Extension:</span>
                <span className={features.tldRiskLevel === 'High' ? 'text-red-400 font-bold' : 'text-white'}>
                  .{features.tld} ({features.tldRiskLevel} Risk)
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Homograph / Punycode:</span>
                <span className={features.isHomographSuspicious ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  {features.isHomographSuspicious ? 'SPOOF DETECTED' : 'Clean ASCII'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Domain Age:</span>
                <span>~{features.domainAgeEstimateDays} days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">SSL Trust Score:</span>
                <span className={features.sslTrustScore < 40 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  {features.sslTrustScore}/100
                </span>
              </div>
            </div>
          </div>

          {/* Category 4: Statistical */}
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="text-[11px] font-bold text-pink-400 uppercase tracking-wider">
              4. Statistical Attributes
            </div>
            <div className="space-y-1.5 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-500">Shannon Entropy:</span>
                <span className="font-bold text-white">{features.shannonEntropy} bits</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Digit Ratio:</span>
                <span>{(features.digitRatio * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Vowel Ratio:</span>
                <span>{(features.vowelRatio * 100).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Special Char Ratio:</span>
                <span>{(features.specialCharRatio * 100).toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* 56-Feature Normalized Vector Preview */}
        <div className="p-3 rounded-lg bg-slate-950/90 border border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>56-Dimensional Vector Preview (Standardized Float Input to Tree Ensembles):</span>
            <span className="text-cyan-400">16 / 56 Dimension Sample</span>
          </div>
          <div className="flex flex-wrap gap-1 font-mono text-[10px]">
            {features.vector56Preview.map((val, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 tabular-nums"
              >
                [{idx}]: {val.toFixed(3)}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Full 6-Model Prediction Benchmark Table */}
      <section className="space-y-3">
        <h2 className="text-base font-bold text-white">
          Simultaneous 6-Model Inference Breakdown
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 uppercase">
                <th className="py-2.5 px-4">Model Name</th>
                <th className="py-2.5 px-3">Type</th>
                <th className="py-2.5 px-3">Verdict</th>
                <th className="py-2.5 px-3 text-right">Phishing Risk</th>
                <th className="py-2.5 px-3 text-right">Inference Latency</th>
                <th className="py-2.5 px-3 text-right">RAM Footprint</th>
                <th className="py-2.5 px-4">Model Decision Logic</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {predictions.map((p) => (
                <tr key={p.modelId} className="hover:bg-slate-800/30">
                  <td className="py-2.5 px-4 font-sans font-medium text-white">
                    {p.modelName}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={p.category === 'ML' ? 'text-cyan-400' : 'text-pink-400'}>
                      {p.category}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`font-semibold ${p.isPhishing ? 'text-red-400' : 'text-emerald-400'}`}>
                      {p.isPhishing ? 'PHISHING' : 'SAFE'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right font-bold text-white tabular-nums">
                    {(p.phishingProbability * 100).toFixed(1)}%
                  </td>
                  <td className="py-2.5 px-3 text-right tabular-nums">
                    <span className={p.inferenceTimeMs < 2.0 ? 'text-emerald-400 font-bold' : 'text-pink-400'}>
                      {p.inferenceTimeMs.toFixed(2)} ms
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-300 tabular-nums">
                    {p.ramUsageMb} MB
                  </td>
                  <td className="py-2.5 px-4 font-sans text-slate-400 text-[11px]">
                    {p.decisionRule}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
