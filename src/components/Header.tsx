import { ShieldCheck, ExternalLink, FileSpreadsheet, FileText, LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onExportCsv: () => void;
  onOpenDocModal: () => void;
  onOpenPdfModal: () => void;
}

export const Header = ({
  activeTab,
  setActiveTab,
  onExportCsv,
  onOpenDocModal,
  onOpenPdfModal
}: HeaderProps) => {
  const { user, loginWithGoogle, logout } = useAuth();

  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'benchmarks', label: 'Model Benchmarks' },
    { id: 'loss', label: 'Loss & Dynamics' },
    { id: 'detector', label: 'Live URL Inspector' },
    { id: 'simulator', label: 'NIST Hybrid Stream' },
    { id: 'taxonomy', label: 'Feature Taxonomy' },
    { id: 'ai-chat', label: 'Gemini Assistant' },
    { id: 'ai-voice', label: 'Voice Live (3.8)' },
    { id: 'ai-video', label: 'Veo Video' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <button
            onClick={() => setActiveTab('overview')}
            className="text-left text-base font-bold tracking-tight text-white hover:text-cyan-400 transition-colors"
          >
            PhishGuard Benchmark
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`whitespace-nowrap transition-colors pb-0.5 relative text-xs ${
                  isActive
                    ? 'text-cyan-400 font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-[-18px] left-0 right-0 h-[2px] bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Actions + Google Auth */}
        <div className="flex items-center gap-2">
          {/* User Sign-In with Google */}
          {user ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-4 h-4 text-cyan-400" />
              )}
              <span className="text-xs text-slate-300 hidden md:inline max-w-[110px] truncate">
                {user.displayName || user.email}
              </span>
              <button
                onClick={logout}
                className="text-slate-400 hover:text-red-400 transition-colors ml-1 p-0.5"
                title="Sign out of Firebase"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <LogIn className="h-3.5 w-3.5 text-cyan-400" />
              <span>Sign In with Google</span>
            </button>
          )}

          <button
            onClick={onOpenDocModal}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white border border-slate-700/80 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap"
            title="View Dissertation Metadata"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Specs</span>
          </button>

          <button
            onClick={onOpenPdfModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-100 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-cyan-500/50 rounded-lg transition-colors whitespace-nowrap"
            title="Generate Academic Research PDF Report"
          >
            <FileText className="h-3.5 w-3.5 text-cyan-400" />
            <span>PDF Report</span>
          </button>

          <button
            onClick={onExportCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm shadow-cyan-950 whitespace-nowrap"
            title="Download CSV Dataset"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Sub-Navigation Bar for medium & mobile screens */}
      <div className="flex xl:hidden overflow-x-auto border-t border-slate-800/80 px-4 py-2 scrollbar-none gap-2 bg-slate-900/60">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
