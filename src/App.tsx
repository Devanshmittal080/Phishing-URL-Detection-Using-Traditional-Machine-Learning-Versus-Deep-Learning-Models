import { useState } from 'react';
import { Header } from './components/Header';
import { OverviewView } from './components/OverviewView';
import { ModelBenchmarksView } from './components/ModelBenchmarksView';
import { LossMetricsView } from './components/LossMetricsView';
import { RealTimeDetectorView } from './components/RealTimeDetectorView';
import { HybridSimulatorView } from './components/HybridSimulatorView';
import { TaxonomyView } from './components/TaxonomyView';
import { DocsModal } from './components/DocsModal';
import { MODEL_BENCHMARKS, DISSERTATION_META } from './data/dissertationData';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [inspectedUrl, setInspectedUrl] = useState<string>(
    'https://pаypal.com-verify.account-security.xyz/login'
  );
  const [isDocsModalOpen, setIsDocsModalOpen] = useState<boolean>(false);

  const handleSelectSampleUrl = (url: string) => {
    setInspectedUrl(url);
    setActiveTab('detector');
  };

  const handleExportCsv = () => {
    const headers = [
      'Model Name',
      'Category',
      'Paradigm',
      'Accuracy (%)',
      'F1-Score (%)',
      'Precision (%)',
      'Recall (%)',
      'ROC-AUC',
      'Latency (ms)',
      'Throughput (URLs/sec)',
      'RAM Usage (MB)',
      'FPR (%)',
      'FP Count',
      'FN Count',
      'Interpretability',
      'Deployment Suitability'
    ];

    const rows = MODEL_BENCHMARKS.map((m) => [
      `"${m.name}"`,
      m.category,
      `"${m.paradigm}"`,
      m.accuracy,
      m.f1Score,
      m.precision,
      m.recall,
      m.rocAuc,
      m.latencyMs,
      m.throughputUrlsPerSec,
      m.ramUsageMb,
      m.fpr,
      m.fpCount,
      m.fnCount,
      m.interpretability,
      `"${m.deploymentSuitability}"`
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'PhishGuard_ML_vs_DL_Benchmark_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Top Navigation Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExportCsv={handleExportCsv}
        onOpenDocModal={() => setIsDocsModalOpen(true)}
      />

      {/* Main Viewport Container (1440px baseline) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'overview' && (
          <OverviewView
            onNavigate={(tab) => setActiveTab(tab)}
            onSelectSampleUrl={handleSelectSampleUrl}
          />
        )}

        {activeTab === 'benchmarks' && <ModelBenchmarksView />}

        {activeTab === 'loss' && <LossMetricsView />}

        {activeTab === 'detector' && (
          <RealTimeDetectorView initialUrl={inspectedUrl} />
        )}

        {activeTab === 'simulator' && <HybridSimulatorView />}

        {activeTab === 'taxonomy' && <TaxonomyView />}
      </main>

      {/* Quiet Academic Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-mono">
            <span>{DISSERTATION_META.author}</span>
            <span aria-hidden="true">·</span>
            <span>The NorthCap University</span>
            <span aria-hidden="true">·</span>
            <span>{DISSERTATION_META.date}</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Aligned with {DISSERTATION_META.standardCompliance}</span>
            <button
              onClick={() => setIsDocsModalOpen(true)}
              className="hover:text-cyan-400 underline underline-offset-4 transition-colors"
            >
              Academic Specifications
            </button>
          </div>
        </div>
      </footer>

      {/* Dissertation Specifications Modal */}
      <DocsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
      />
    </div>
  );
}
