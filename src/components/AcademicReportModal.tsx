import { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  Copy,
  Check,
  X,
  GraduationCap,
  ShieldCheck,
  CheckCircle2,
  Table,
  History,
  Layers,
  BookOpen,
  Award
} from 'lucide-react';
import {
  DISSERTATION_META,
  MODEL_BENCHMARKS,
  HISTORICAL_DATASET_EVOLUTION,
  LITERATURE_SYNTHESIS
} from '../data/dissertationData';
import { generateAcademicPdfReport, PdfReportOptions } from '../utils/pdfReportGenerator';

interface AcademicReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AcademicReportModal = ({ isOpen, onClose }: AcademicReportModalProps) => {
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [options, setOptions] = useState<PdfReportOptions>({
    includeAbstract: true,
    includeBenchmarkTable: true,
    includeHistoricalEvolution: true,
    includeTaxonomySummary: true,
    includeLiteratureMatrix: true,
    includeArchitectureAnalysis: true,
    includeSignatureBlock: true,
    customNotes: ''
  });

  if (!isOpen) return null;

  const handleDownloadPdf = async () => {
    try {
      setIsGeneratingPdf(true);
      // Allow UI thread to update spinner
      await new Promise((r) => setTimeout(r, 120));
      const doc = generateAcademicPdfReport(options);
      const filename = `PhishGuard_Academic_Research_Report_${DISSERTATION_META.author.replace(/\s+/g, '_')}_${DISSERTATION_META.rollNo}.pdf`;
      doc.save(filename);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCitation = (type: 'bibtex' | 'apa' | 'ieee') => {
    let citation = '';
    if (type === 'bibtex') {
      citation = `@mastersthesis{mittal2026phishing,
  author       = {Devansh Mittal},
  title        = {Phishing URL Detection: A Comparative Analysis of Machine Learning and Deep Learning Models for Real-Time Web Security},
  school       = {The NorthCap University, Gurugram},
  year         = {2026},
  month        = {September},
  note         = {Supervised by Dr. Shilpa, MCA Dissertation; NIST SP 800-61 Rev. 2 Compliant}
}`;
    } else if (type === 'apa') {
      citation = `Mittal, D. (2026). Phishing URL Detection: A Comparative Analysis of Machine Learning and Deep Learning Models for Real-Time Web Security (Master's dissertation, The NorthCap University). Supervised by Dr. Shilpa.`;
    } else {
      citation = `D. Mittal, "Phishing URL Detection: A Comparative Analysis of Machine Learning and Deep Learning Models for Real-Time Web Security," M.C.A. dissertation, Dept. Multidisciplinary Eng., The NorthCap Univ., Gurugram, India, 2026.`;
    }

    navigator.clipboard.writeText(citation);
    setCopiedFormat(type);
    setTimeout(() => setCopiedFormat(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-tight">
                  Academic Research Report Generator
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  PDF / Print Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Dissertation Submission Format · {DISSERTATION_META.institution}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
              title="Print document"
            >
              <Printer className="h-3.5 w-3.5 text-slate-400" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm shadow-cyan-950 disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Academic PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors ml-1"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Split into Settings Sidebar and Document Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-hidden">
          {/* Left Column: Report Customizer (4 cols) */}
          <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-slate-800 p-5 bg-slate-950/50 overflow-y-auto space-y-5 text-xs">
            {/* Metadata Summary */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Dissertation Credentials
              </span>
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5 text-slate-300 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500">Candidate:</span>
                  <span className="font-semibold text-white">{DISSERTATION_META.author}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Roll No:</span>
                  <span className="text-cyan-400">{DISSERTATION_META.rollNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Supervisor:</span>
                  <span className="text-slate-200">{DISSERTATION_META.supervisor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Standard:</span>
                  <span className="text-emerald-400">NIST SP 800-61 Rev. 2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Split:</span>
                  <span>47,159 URLs (80/20)</span>
                </div>
              </div>
            </div>

            {/* Inclusions Checkboxes */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Report Sections Included
              </span>
              <div className="space-y-2">
                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={options.includeAbstract}
                    onChange={(e) => setOptions({ ...options, includeAbstract: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                  />
                  <BookOpen className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-slate-200">1. Executive Abstract</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={options.includeBenchmarkTable}
                    onChange={(e) => setOptions({ ...options, includeBenchmarkTable: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                  />
                  <Table className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-slate-200">2. Primary Benchmark Matrix (8 Models)</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={options.includeArchitectureAnalysis}
                    onChange={(e) => setOptions({ ...options, includeArchitectureAnalysis: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                  />
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-slate-200">3. Computational Efficiency & SOC Analysis</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={options.includeHistoricalEvolution}
                    onChange={(e) => setOptions({ ...options, includeHistoricalEvolution: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                  />
                  <History className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-slate-200">4. 2026 Historical Dataset Revisions</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={options.includeTaxonomySummary}
                    onChange={(e) => setOptions({ ...options, includeTaxonomySummary: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                  />
                  <Layers className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-slate-200">5. 56-Feature Extraction Taxonomy</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={options.includeLiteratureMatrix}
                    onChange={(e) => setOptions({ ...options, includeLiteratureMatrix: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                  />
                  <Award className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-slate-200">6. Literature Synthesis (Table 2.1)</span>
                </label>

                <label className="flex items-center gap-2.5 p-2 rounded-lg bg-slate-900/60 hover:bg-slate-800/60 border border-slate-800/80 cursor-pointer transition-colors">
                  <input
                    type="checkbox"
                    checked={options.includeSignatureBlock}
                    onChange={(e) => setOptions({ ...options, includeSignatureBlock: e.target.checked })}
                    className="rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
                  />
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span className="text-slate-200">7. Candidate & Supervisor Signature Block</span>
                </label>
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-1.5">
                Examiner Addenda / Custom Notes
              </span>
              <textarea
                value={options.customNotes}
                onChange={(e) => setOptions({ ...options, customNotes: e.target.value })}
                placeholder="Optional notes or institutional submission remarks to attach in Section 7..."
                rows={2}
                className="w-full rounded-lg bg-slate-900 border border-slate-800 p-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Academic Citations */}
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Copy Academic Citation
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => handleCopyCitation('bibtex')}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition-colors"
                >
                  {copiedFormat === 'bibtex' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>BibTeX</span>
                </button>
                <button
                  onClick={() => handleCopyCitation('ieee')}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition-colors"
                >
                  {copiedFormat === 'ieee' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>IEEE</span>
                </button>
                <button
                  onClick={() => handleCopyCitation('apa')}
                  className="flex items-center justify-center gap-1 py-1.5 px-2 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition-colors"
                >
                  {copiedFormat === 'apa' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                  <span>APA</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Live Academic Document Preview (8 cols) */}
          <div className="lg:col-span-8 p-6 overflow-y-auto bg-slate-900/30">
            {/* Simulated Paper Container */}
            <div className="max-w-3xl mx-auto bg-white text-slate-900 rounded-lg shadow-xl p-8 sm:p-10 font-serif border border-slate-200 text-xs leading-relaxed space-y-6">
              {/* Paper Header */}
              <div className="border-b border-slate-200 pb-5 text-center space-y-2">
                <div className="text-[10px] font-bold tracking-widest text-slate-500 uppercase font-sans">
                  The NorthCap University · Department of Multidisciplinary Engineering
                </div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-slate-900 leading-snug">
                  A Comparative Analysis of Phishing URL Detection: Traditional Machine Learning Versus Deep Learning Models for Real-Time Web Security
                </h1>
                <div className="text-xs text-slate-600 font-sans space-y-0.5">
                  <p className="font-semibold text-slate-800">
                    {DISSERTATION_META.author} (Roll No: {DISSERTATION_META.rollNo})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Supervised by: {DISSERTATION_META.supervisor} · Master of Computer Applications (MCA)
                  </p>
                  <p className="text-[10px] text-slate-400">
                    Academic Year 2026 · Aligned with {DISSERTATION_META.standardCompliance}
                  </p>
                </div>
              </div>

              {/* Section 1: Abstract */}
              {options.includeAbstract && (
                <div className="space-y-2 bg-slate-50 p-4 rounded border border-slate-200 font-sans">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    1. Executive Abstract
                  </h3>
                  <p className="text-[11px] text-slate-700 leading-relaxed text-justify">
                    Phishing attacks continue to represent one of the primary threat vectors targeting enterprise networks and consumer digital identities. This research conducts an empirical comparative benchmark evaluating Traditional Machine Learning (Random Forest, Gradient Boosted Decision Trees, Support Vector Machines, and Naïve Bayes) versus Deep Learning architectures (Deep Artificial Neural Networks, 1D-CNN, Bidirectional LSTM with Attention, and fine-tuned DistilBERT Transformers). Evaluated across 235,795 URLs using a 56-feature multidimensional vector under NIST SP 800-61 Rev. 2 guidelines, empirical results demonstrate that Tree-Ensemble algorithms achieve optimal wire-speed classification (Random Forest: 99.99% accuracy, 0.85 ms latency, 8.4 MB RAM footprint), substantially outperforming deep sequence models in operational throughput and hardware efficiency.
                  </p>
                </div>
              )}

              {/* Section 2: Benchmark Table */}
              {options.includeBenchmarkTable && (
                <div className="space-y-2 font-sans">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                      2. Primary Model Performance Benchmark
                    </h3>
                    <span className="text-[10px] text-slate-500">UCI PhiUSIIL (47,159 Test Split)</span>
                  </div>
                  <div className="overflow-x-auto border border-slate-200 rounded">
                    <table className="w-full text-left text-[10px]">
                      <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-1.5 px-2">Model Architecture</th>
                          <th className="py-1.5 px-2 text-center">Cat</th>
                          <th className="py-1.5 px-2 text-right">Accuracy</th>
                          <th className="py-1.5 px-2 text-right">F1-Score</th>
                          <th className="py-1.5 px-2 text-right">Latency</th>
                          <th className="py-1.5 px-2 text-right">Throughput</th>
                          <th className="py-1.5 px-2 text-right">RAM</th>
                          <th className="py-1.5 px-2 text-right">FPR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {MODEL_BENCHMARKS.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50/80">
                            <td className="py-1 px-2 font-semibold text-slate-900">{m.name}</td>
                            <td className="py-1 px-2 text-center font-mono text-[9px] text-slate-600">{m.category}</td>
                            <td className="py-1 px-2 text-right font-bold text-cyan-700">{m.accuracy.toFixed(2)}%</td>
                            <td className="py-1 px-2 text-right text-slate-700">{m.f1Score.toFixed(2)}%</td>
                            <td className="py-1 px-2 text-right font-mono text-slate-700">{m.latencyMs.toFixed(2)}ms</td>
                            <td className="py-1 px-2 text-right font-mono text-slate-700">{m.throughputUrlsPerSec} u/s</td>
                            <td className="py-1 px-2 text-right font-mono text-slate-700">{m.ramUsageMb.toFixed(1)}MB</td>
                            <td className="py-1 px-2 text-right text-slate-700">{m.fpr.toFixed(3)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Section 3: Computational Efficiency */}
              {options.includeArchitectureAnalysis && (
                <div className="space-y-1.5 font-sans">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    3. Efficiency & NIST Two-Stage Cascade
                  </h3>
                  <p className="text-[11px] text-slate-700 leading-relaxed text-justify">
                    A critical finding of this dissertation is the drastic 21.7x latency penalty and 48.8x RAM inflation observed in DistilBERT relative to Random Forest (18.5 ms / 410 MB vs. 0.85 ms / 8.4 MB). Inline network firewalls require sub-2.0 millisecond response times. Hence, the recommended architecture implements a two-stage hybrid cascade: Stage 1 evaluates 100% of URLs at wire-speed using GBDT/RF; Stage 2 activates DistilBERT only for the 1.6% of candidates within the borderline confidence threshold [0.35 - 0.70].
                  </p>
                </div>
              )}

              {/* Section 4: Historical Revisions */}
              {options.includeHistoricalEvolution && (
                <div className="space-y-2 font-sans">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    4. Historical Benchmark Dataset Evolution (2026 Releases)
                  </h3>
                  <div className="overflow-x-auto border border-slate-200 rounded">
                    <table className="w-full text-left text-[10px]">
                      <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-1.5 px-2">Release</th>
                          <th className="py-1.5 px-2">Date</th>
                          <th className="py-1.5 px-2 text-right">URLs</th>
                          <th className="py-1.5 px-2 text-right">RF Acc</th>
                          <th className="py-1.5 px-2 text-right">GBDT</th>
                          <th className="py-1.5 px-2 text-right">DistilBERT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {HISTORICAL_DATASET_EVOLUTION.map((h) => (
                          <tr key={h.datasetVersion}>
                            <td className="py-1 px-2 font-semibold text-slate-900">{h.datasetVersion}</td>
                            <td className="py-1 px-2 text-slate-600">{h.releaseDate}</td>
                            <td className="py-1 px-2 text-right font-mono text-slate-700">{h.urlCount.toLocaleString()}</td>
                            <td className="py-1 px-2 text-right font-bold text-cyan-700">{h.rfAccuracy.toFixed(2)}%</td>
                            <td className="py-1 px-2 text-right text-slate-700">{h.gbdtAccuracy.toFixed(2)}%</td>
                            <td className="py-1 px-2 text-right text-slate-700">{h.transformerAccuracy.toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Section 6: Literature Comparison */}
              {options.includeLiteratureMatrix && (
                <div className="space-y-2 font-sans">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    6. Literature Comparison Synthesis (Table 2.1)
                  </h3>
                  <div className="overflow-x-auto border border-slate-200 rounded">
                    <table className="w-full text-left text-[10px]">
                      <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                        <tr>
                          <th className="py-1.5 px-2">Citation</th>
                          <th className="py-1.5 px-2">Dataset</th>
                          <th className="py-1.5 px-2 text-right">Accuracy</th>
                          <th className="py-1.5 px-2">Key Finding</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {LITERATURE_SYNTHESIS.slice(0, 4).map((lit) => (
                          <tr key={lit.id}>
                            <td className="py-1 px-2 font-semibold text-slate-900">{lit.citation}</td>
                            <td className="py-1 px-2 text-slate-600">{lit.datasetName}</td>
                            <td className="py-1 px-2 text-right font-bold text-slate-800">{lit.rfAccuracy}</td>
                            <td className="py-1 px-2 text-[9px] text-slate-600 max-w-[200px] truncate">{lit.keyFindings}</td>
                          </tr>
                        ))}
                        <tr className="bg-cyan-50/50">
                          <td className="py-1 px-2 font-bold text-cyan-900">Present Study (2026)</td>
                          <td className="py-1 px-2 text-cyan-900 font-medium">UCI PhiUSIIL (235,795 URLs)</td>
                          <td className="py-1 px-2 text-right font-bold text-cyan-800">99.99% (RF)</td>
                          <td className="py-1 px-2 text-[9px] text-cyan-900">Tree models lead wire-speed; 2-stage hybrid cascade validates edge defense.</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Section 7: Sign-off block */}
              {options.includeSignatureBlock && (
                <div className="pt-4 border-t border-slate-200 font-sans grid grid-cols-2 gap-4 text-[10px]">
                  <div className="border border-slate-200 p-2.5 rounded bg-slate-50">
                    <p className="font-bold text-slate-800 uppercase text-[9px]">Candidate Declaration</p>
                    <p className="text-slate-600 mt-1">
                      Submitted in partial fulfillment of the MCA degree at The NorthCap University.
                    </p>
                    <p className="font-bold text-slate-900 mt-3">{DISSERTATION_META.author}</p>
                    <p className="text-slate-500">Roll No: {DISSERTATION_META.rollNo}</p>
                  </div>
                  <div className="border border-slate-200 p-2.5 rounded bg-slate-50">
                    <p className="font-bold text-slate-800 uppercase text-[9px]">Faculty Endorsement</p>
                    <p className="text-slate-600 mt-1">
                      Approved for academic examination and repository archiving.
                    </p>
                    <p className="font-bold text-slate-900 mt-3">{DISSERTATION_META.supervisor}</p>
                    <p className="text-slate-500">Department of Multidisciplinary Engineering</p>
                  </div>
                </div>
              )}

              {/* Watermark / Verification Token */}
              <div className="pt-2 text-center text-[9px] text-slate-400 font-mono">
                NCU-MCA-2026-DIS-019 · Aligned with NIST SP 800-61 Rev. 2 · Generated via PhishGuard Research Engine
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
