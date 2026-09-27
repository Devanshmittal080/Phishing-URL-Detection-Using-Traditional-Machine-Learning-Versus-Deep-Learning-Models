import { useState } from 'react';
import {
  Layers,
  Search,
  BookOpen,
  ShieldAlert,
  CheckCircle2,
  ExternalLink,
  Cpu,
  Lock,
  GitBranch,
  ArrowRight
} from 'lucide-react';
import {
  FEATURE_TAXONOMY_56,
  LITERATURE_SYNTHESIS,
  EVASION_TACTICS_DATA
} from '../data/dissertationData';

export const TaxonomyView = () => {
  const [activeTab, setActiveTab] = useState<'taxonomy' | 'evasion' | 'literature'>('taxonomy');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredFeatures = FEATURE_TAXONOMY_56.filter((f) => {
    const matchesCat = selectedCategory === 'ALL' || f.category === selectedCategory;
    const matchesQuery =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.sampleVariable.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>Methodology &amp; Literature Review</span>
            <span aria-hidden="true">·</span>
            <span>Chapters 2 &amp; 3 Synthesized</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Feature Taxonomy, Evasion Robustness &amp; Literature Matrix
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Examine the 56-feature engineering pipeline, empirical testing against adversarial evasion tricks, and cross-validation against peer-reviewed publications.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveTab('taxonomy')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'taxonomy'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            56-Feature Pipeline
          </button>
          <button
            onClick={() => setActiveTab('evasion')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'evasion'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Evasion Robustness
          </button>
          <button
            onClick={() => setActiveTab('literature')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'literature'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Literature Matrix (Table 2.1)
          </button>
        </div>
      </section>

      {/* Tab 1: 56-Feature Pipeline */}
      {activeTab === 'taxonomy' && (
        <section className="space-y-6">
          {/* Controls: Search + Category Pills */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search feature attributes (e.g. entropy, hyphen, IP, SSL)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 pl-9 text-xs bg-slate-950 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              {['ALL', 'Lexical', 'Structural', 'Domain & SSL', 'Statistical'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* 4 Category Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-cyan-400 uppercase font-mono">1. Lexical</div>
              <p className="text-xs text-slate-400">
                URL string length, delimiter symbol counts (hyphens, dots), and credential keyword frequencies.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-emerald-400 uppercase font-mono">2. Structural</div>
              <p className="text-xs text-slate-400">
                Subdomain depth, direct-IP address usage, @ redirect symbols, and directory path depth.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-violet-400 uppercase font-mono">3. Domain &amp; SSL</div>
              <p className="text-xs text-slate-400">
                High-risk TLD lookups (.xyz, .top), WHOIS domain age, and SSL certificate trust scores.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 space-y-1">
              <div className="text-xs font-bold text-pink-400 uppercase font-mono">4. Statistical</div>
              <p className="text-xs text-slate-400">
                Shannon character entropy, digit-to-letter ratios, and vowel/consonant distribution randomness.
              </p>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFeatures.map((feat) => (
              <div
                key={feat.id}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-white">{feat.name}</h3>
                    <span className="text-[11px] font-mono text-cyan-400">
                      Category: {feat.category}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-white tabular-nums">
                      Weight: {feat.importanceWeight}/100
                    </span>
                    <div className="w-20 bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1">
                      <div
                        className="bg-cyan-400 h-full rounded-full"
                        style={{ width: `${feat.importanceWeight}%` }}
                      />
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {feat.description}
                </p>

                <div className="p-2 rounded bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
                  <div>
                    <span className="text-slate-500">Evaluation rule: </span>
                    <span className="text-slate-200">{feat.sampleVariable}</span>
                  </div>
                  <div className="text-slate-400 font-sans">
                    {feat.detectionRule}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab 2: Adversarial Evasion Robustness */}
      {activeTab === 'evasion' && (
        <section className="space-y-6">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h2 className="text-base font-bold text-white">
              Adversarial Evasion Testing Protocol (Section 3.8 &amp; 4.4)
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              Following training on clean splits, top models from each paradigm were subjected to stress-testing against real-world obfuscation methods crafted to bypass static filters and naive tokenizers.
            </p>
          </div>

          <div className="space-y-4">
            {EVASION_TACTICS_DATA.map((tactic) => (
              <div
                key={tactic.id}
                className="p-6 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-amber-400" />
                    <h3 className="text-base font-bold text-white">{tactic.name}</h3>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    Tested Attack Vector
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 break-all">
                  Target: {tactic.exampleUrl}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong className="text-white">Attack Mechanism: </strong>
                  {tactic.attackMechanism}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-cyan-500/20 space-y-1">
                    <span className="text-cyan-400 font-bold">Random Forest (ML) Result:</span>
                    <p className="text-slate-300 font-sans">{tactic.rfResult}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-pink-500/20 space-y-1">
                    <span className="text-pink-400 font-bold">DistilBERT (DL) Result:</span>
                    <p className="text-slate-300 font-sans">{tactic.distilBertResult}</p>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs">
                  <span className="text-emerald-400 font-bold font-mono">Defensive Mitigation Rule: </span>
                  <span className="text-slate-200">{tactic.mitigationRule}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tab 3: Literature Matrix */}
      {activeTab === 'literature' && (
        <section className="space-y-6">
          <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
            <h2 className="text-base font-bold text-white">
              Table 2.1: Literature Synthesis Matrix &amp; Comparative Benchmarks
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              Consolidation of peer-reviewed empirical studies situationally positioning this dissertation&apos;s 99.99% ceiling accuracy and wire-speed latency findings against external literature.
            </p>
          </div>

          <div className="space-y-4">
            {LITERATURE_SYNTHESIS.map((lit) => (
              <div
                key={lit.id}
                className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-cyan-400" />
                    <h3 className="text-sm font-bold text-white">{lit.citation}</h3>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                    <span>Year: {lit.studyYear}</span>
                    <span aria-hidden="true">·</span>
                    <span>Dataset: {lit.datasetSize}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-slate-500 uppercase">Evaluated Models &amp; Peak Accuracy:</span>
                    <div className="text-slate-200 font-sans font-semibold pt-0.5">{lit.reportedModels}</div>
                    <div className="text-cyan-400 font-bold">{lit.rfAccuracy}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-slate-500 uppercase">Identified Research Gaps:</span>
                    <p className="text-slate-300 font-sans pt-0.5">{lit.identifiedGaps}</p>
                  </div>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                  <strong className="text-white">Principal Finding: </strong>
                  {lit.keyFindings}
                </div>
              </div>
            ))}
          </div>

          {/* Research Gaps Identified Summary (Section 2.6) */}
          <div className="p-6 rounded-xl bg-slate-900/80 border border-cyan-500/20 space-y-3">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider">
              Dissertation Contribution &amp; Gaps Addressed (Section 2.6)
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed list-disc list-inside">
              <li>
                <strong className="text-white">Cross-Paradigm, Multi-Metric Benchmarking:</strong> Unlike prior works that report accuracy alone, this dissertation jointly profiles accuracy, wire-speed latency, memory usage, and false alarms under identical hardware.
              </li>
              <li>
                <strong className="text-white">Dataset Scale Effects:</strong> Clarifies why Taha et al. (2024) reported 96.89% on 11k URLs while Bao et al. (2026) and this dissertation reached 99.99% on 235k URLs: feature richness and training scale expand the achievable ceiling.
              </li>
              <li>
                <strong className="text-white">Operational Deployment Blueprint:</strong> Translates theoretical benchmark numbers into a practical, NIST SP 800-61 Rev. 2 compliant two-stage hybrid cascade architecture for real-world network gateways.
              </li>
            </ul>
          </div>
        </section>
      )}
    </div>
  );
};
