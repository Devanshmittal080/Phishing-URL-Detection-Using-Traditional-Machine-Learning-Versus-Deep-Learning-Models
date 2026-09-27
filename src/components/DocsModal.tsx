import { X, ExternalLink, BookOpen, Shield, Award, Calendar, FileText } from 'lucide-react';
import { DISSERTATION_META } from '../data/dissertationData';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal = ({ isOpen, onClose }: DocsModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Award className="h-4 w-4" />
              <span>Master of Computer Applications (MCA) Dissertation</span>
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">
              {DISSERTATION_META.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Academic Details Card */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">Author / Candidate:</span>
            <div className="text-white font-bold text-sm font-sans">{DISSERTATION_META.author}</div>
            <div className="text-slate-400">Roll No: {DISSERTATION_META.rollNo}</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">Faculty Supervisor:</span>
            <div className="text-white font-bold text-sm font-sans">{DISSERTATION_META.supervisor}</div>
            <div className="text-slate-400">{DISSERTATION_META.institution}</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">Security Standard:</span>
            <div className="text-cyan-400 font-semibold">{DISSERTATION_META.standardCompliance}</div>
            <div className="text-slate-400">Incident Handling Guidance</div>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 uppercase text-[10px]">Benchmark Scale:</span>
            <div className="text-emerald-400 font-semibold">{DISSERTATION_META.primaryDataset}</div>
            <div className="text-slate-400">{DISSERTATION_META.testSplitSize}</div>
          </div>
        </div>

        {/* Abstract Synopsis */}
        <div className="space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
          <h3 className="font-bold text-white uppercase text-[11px] font-mono tracking-wider">
            Research Abstract &amp; Key Finding
          </h3>
          <p>
            Phishing causes over $100B in annual cyber losses. Because attackers register short-lived domains and exploit homograph and subdomain stuffing tricks, static blocklists fail against zero-day campaigns.
          </p>
          <p>
            This empirical study shows that <strong className="text-cyan-400">Tree-based ensembles (Random Forest, Gradient Boosting) achieve 99.99% accuracy</strong> while executing in <strong className="text-white">0.85 ms</strong> with <strong className="text-white">8.4 MB RAM</strong> and a <strong className="text-emerald-400">0.005% false positive rate (1 false alarm / 47,159 test samples)</strong>. In contrast, Transformer architectures (DistilBERT) achieve 99.82% accuracy directly from raw text, but incur 18.5 ms latency and 410 MB RAM.
          </p>
          <p>
            The study proposes an operational <strong className="text-white">Two-Stage Hybrid Cascade Architecture</strong>: wire-speed GBDT edge filtering (&lt;1.0 ms) resolving 94% of traffic inline, backed by asynchronous DistilBERT deep inspection for borderline cases.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
          >
            Close Specifications
          </button>
        </div>
      </div>
    </div>
  );
};
