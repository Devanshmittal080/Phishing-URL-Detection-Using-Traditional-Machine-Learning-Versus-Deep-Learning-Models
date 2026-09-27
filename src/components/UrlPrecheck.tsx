import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Globe,
  HelpCircle,
  Info,
  Server,
  Zap,
  ArrowRight,
  ShieldCheck,
  ShieldAlert,
  Save,
  Check
} from 'lucide-react';
import { validateUrlSyntax, SyntaxCheckResult } from '../utils/urlValidator';
import { extractUrlFeatures, evaluateModelsOnUrl } from '../utils/featureExtractor';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { useAuth } from '../hooks/useAuth';

interface UrlPrecheckProps {
  currentUrl: string;
  onApplyUrl: (url: string) => void;
}

export const UrlPrecheck = ({ currentUrl, onApplyUrl }: UrlPrecheckProps) => {
  const { user } = useAuth();
  const [testUrl, setTestUrl] = useState<string>(currentUrl);
  const [activeAnalysis, setActiveAnalysis] = useState<SyntaxCheckResult>(
    validateUrlSyntax(currentUrl)
  );
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);

  const handleRunSyntaxCheck = (input: string) => {
    setTestUrl(input);
    const result = validateUrlSyntax(input);
    setActiveAnalysis(result);
    setIsSaved(false);
  };

  const handleSaveToFirestore = async () => {
    if (!activeAnalysis.isValid) return;
    setSaving(true);
    try {
      const features = extractUrlFeatures(activeAnalysis.normalizedUrl || testUrl);
      const preds = evaluateModelsOnUrl(features);
      const rf = preds.find((p) => p.modelId === 'rf');

      await addDoc(collection(db, 'verifications'), {
        userId: user ? user.uid : 'anonymous',
        userEmail: user ? user.email : 'guest',
        url: testUrl,
        normalizedUrl: activeAnalysis.normalizedUrl,
        isSyntacticallyValid: activeAnalysis.isValid,
        syntaxErrors: activeAnalysis.errors.join('; '),
        domain: activeAnalysis.hostname,
        tld: features.tld,
        hasDirectIp: activeAnalysis.isIpv4 || activeAnalysis.isIpv6,
        hasHomograph: features.isHomographSuspicious,
        entropy: features.shannonEntropy,
        rfPrediction: rf?.isPhishing ? 'PHISHING' : 'SAFE',
        rfProbability: rf?.phishingProbability ?? 0,
        stage1Verdict: rf?.isPhishing ? 'BLOCKED' : 'APPROVED',
        finalVerdict: rf?.isPhishing ? 'MALICIOUS_PHISH' : 'LEGITIMATE',
        verifiedAt: new Date().toISOString()
      });
      setIsSaved(true);
    } catch (e) {
      console.error('Failed to log verification in Firestore:', e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>URL Syntax &amp; Formatting Pre-Validator</span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                Independent of ML/DL Features
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Verifies if the target URL is technically sound according to RFC 3986/3987 standard specifications before feeding into the 56-feature model pipeline.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {activeAnalysis.isValid ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="h-3.5 w-3.5" />
              RFC Valid URL
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
              <XCircle className="h-3.5 w-3.5" />
              Syntax Malformed ({activeAnalysis.errors.length} Errors)
            </span>
          )}
        </div>
      </div>

      {/* Input row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        <input
          type="text"
          value={testUrl}
          onChange={(e) => handleRunSyntaxCheck(e.target.value)}
          placeholder="Test URL syntax (e.g. https://domain.com/path, 192.168.1.1, xn--...)"
          className="flex-1 px-3.5 py-2 text-xs font-mono bg-slate-950 border border-slate-700/80 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />

        <div className="flex items-center gap-2">
          <button
            onClick={() => onApplyUrl(testUrl)}
            disabled={!activeAnalysis.isValid}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Load into ML Pipeline</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={handleSaveToFirestore}
            disabled={saving || !activeAnalysis.isValid}
            className="px-3 py-2 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1.5 whitespace-nowrap"
            title="Log this validation to Firestore"
          >
            {isSaved ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Save className="h-3.5 w-3.5 text-cyan-400" />}
            <span>{isSaved ? 'Saved to DB' : saving ? 'Logging...' : 'Log in DB'}</span>
          </button>
        </div>
      </div>

      {/* RFC Syntax Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2 text-xs font-mono">
        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
          <div className="text-[10px] text-slate-500 uppercase">Scheme</div>
          <div className="font-bold text-white truncate">{activeAnalysis.scheme || 'N/A'}</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
          <div className="text-[10px] text-slate-500 uppercase">Host Authority</div>
          <div className="font-bold text-cyan-300 truncate" title={activeAnalysis.hostname}>
            {activeAnalysis.hostname || 'None'}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
          <div className="text-[10px] text-slate-500 uppercase">Port</div>
          <div className="font-bold text-white">{activeAnalysis.port || '80 / 443'}</div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
          <div className="text-[10px] text-slate-500 uppercase">IP Address</div>
          <div className={activeAnalysis.isIpv4 || activeAnalysis.isIpv6 ? 'font-bold text-amber-400' : 'text-slate-400'}>
            {activeAnalysis.isIpv4 ? 'IPv4 Host' : activeAnalysis.isIpv6 ? 'IPv6 Host' : 'Domain FQDN'}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
          <div className="text-[10px] text-slate-500 uppercase">Pathname</div>
          <div className="font-bold text-slate-300 truncate" title={activeAnalysis.pathname}>
            {activeAnalysis.pathname || '/'}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-0.5">
          <div className="text-[10px] text-slate-500 uppercase">Punycode / IDN</div>
          <div className={activeAnalysis.hasPunycode ? 'font-bold text-pink-400' : 'text-emerald-400'}>
            {activeAnalysis.hasPunycode ? 'Detected (xn--)' : 'Standard ASCII'}
          </div>
        </div>
      </div>

      {/* Errors and Warnings List */}
      {(activeAnalysis.errors.length > 0 || activeAnalysis.warnings.length > 0) && (
        <div className="space-y-2 pt-1">
          {activeAnalysis.errors.map((err, i) => (
            <div
              key={`err-${i}`}
              className="flex items-start gap-2 p-2.5 rounded-lg bg-red-950/30 border border-red-500/30 text-xs text-red-200"
            >
              <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-red-400 font-semibold font-mono">RFC Syntax Error: </strong>
                <span>{err}</span>
              </div>
            </div>
          ))}

          {activeAnalysis.warnings.map((warn, i) => (
            <div
              key={`warn-${i}`}
              className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200"
            >
              <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-400 font-semibold font-mono">Syntax Warning: </strong>
                <span>{warn}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
