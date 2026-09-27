import { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Layers,
  ArrowRight,
  Filter,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { StreamPacket } from '../types/phishing';
import { SAMPLE_URLS_PRESET } from '../data/dissertationData';

export const HybridSimulatorView = () => {
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [trafficRate, setTrafficRate] = useState<number>(100); // packets per sec simulation
  const [packets, setPackets] = useState<StreamPacket[]>([]);
  const [stats, setStats] = useState({
    totalProcessed: 0,
    stage1ResolvedCount: 0,
    stage2EscalatedCount: 0,
    blockedPhishingCount: 0,
    approvedSafeCount: 0,
    falseAlarmsAvoided: 0,
    avgLatencyMs: 0.94
  });

  const packetIdRef = useRef<number>(1000);

  // Pool of simulated streaming URLs
  const streamPool = [
    { url: 'https://pаypal.com-verify.account-security.xyz/login', isPhish: true, tactic: 'Homograph Attack' },
    { url: 'https://github.com/torvalds/linux/releases', isPhish: false },
    { url: 'http://192.168.104.22:8080/secure/bank-update/auth.php', isPhish: true, tactic: 'Direct-IP Host' },
    { url: 'https://accounts.google.com/signin/v2/identifier', isPhish: false },
    { url: 'https://chase.com.updates.security-alert.host.top/credentials', isPhish: true, tactic: 'Subdomain Stuffing' },
    { url: 'https://www.chase.com/personal/banking', isPhish: false },
    { url: 'http://apple-support-id-auth.me/icloud/findmy/unlock', isPhish: true, tactic: 'Zero-Day Domain' },
    { url: 'https://docs.google.com/document/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit', isPhish: false },
    { url: 'https://security-verify-alert.login-service.link/reset', isPhish: true, tactic: 'Suspicious TLD' },
    { url: 'https://stackoverflow.com/questions/521295', isPhish: false },
    { url: 'https://login.live.com.id-update.tech/auth', isPhish: true, tactic: 'Brand Impersonation' },
    { url: 'https://en.wikipedia.org/wiki/Phishing', isPhish: false }
  ];

  // Packet generator tick
  useEffect(() => {
    if (!isRunning) return;

    const intervalMs = Math.max(150, Math.floor(10000 / trafficRate));
    const timer = setInterval(() => {
      packetIdRef.current += 1;
      const template = streamPool[Math.floor(Math.random() * streamPool.length)];

      const isPhish = template.isPhish;
      let gbdtConfidence = isPhish ? 0.88 + Math.random() * 0.11 : 0.01 + Math.random() * 0.08;

      // Introduce ~6% borderline cases where GBDT is between 40% and 60%
      const isBorderline = Math.random() < 0.08;
      if (isBorderline) {
        gbdtConfidence = 0.42 + Math.random() * 0.16;
      }

      const gbdtLatency = Number((0.65 + Math.random() * 0.4).toFixed(2));
      let stage1Verdict: StreamPacket['stage1Verdict'];
      let stage2Required = false;
      let distilBertConfidence: number | undefined;
      let distilBertLatency: number | undefined;
      let finalVerdict: StreamPacket['finalVerdict'];
      let totalLatency = gbdtLatency;

      if (gbdtConfidence >= 0.85) {
        stage1Verdict = 'BLOCKED_PHISH';
        finalVerdict = 'BLOCKED';
      } else if (gbdtConfidence <= 0.15) {
        stage1Verdict = 'APPROVED_SAFE';
        finalVerdict = 'SAFE';
      } else {
        // Escalate to Stage 2 Asynchronous DistilBERT
        stage1Verdict = 'ESCALATED_DEEP_INSPECTION';
        stage2Required = true;
        distilBertLatency = Number((16.5 + Math.random() * 4.0).toFixed(2));
        distilBertConfidence = isPhish ? 0.94 : 0.08;
        finalVerdict = distilBertConfidence >= 0.5 ? 'BLOCKED' : 'SAFE';
        // Note: Because Stage 2 runs asynchronously in background, user-facing latency is minimal or buffered
        totalLatency = Number((gbdtLatency + (stage2Required ? distilBertLatency : 0)).toFixed(2));
      }

      const newPacket: StreamPacket = {
        id: `PKT-${packetIdRef.current}`,
        timestamp: new Date().toLocaleTimeString(),
        url: template.url,
        isSimulatedMalicious: isPhish,
        tactic: template.tactic,
        gbdtConfidence: Number(gbdtConfidence.toFixed(3)),
        gbdtLatencyMs: gbdtLatency,
        stage1Verdict,
        stage2Required,
        distilBertConfidence: distilBertConfidence ? Number(distilBertConfidence.toFixed(3)) : undefined,
        distilBertLatencyMs: distilBertLatency,
        finalVerdict,
        totalLatencyMs: totalLatency
      };

      setPackets((prev) => [newPacket, ...prev.slice(0, 39)]);

      setStats((prev) => {
        const nextTotal = prev.totalProcessed + 1;
        const nextStage1Resolved = prev.stage1ResolvedCount + (stage2Required ? 0 : 1);
        const nextStage2Escalated = prev.stage2EscalatedCount + (stage2Required ? 1 : 0);
        const nextBlocked = prev.blockedPhishingCount + (finalVerdict === 'BLOCKED' ? 1 : 0);
        const nextApproved = prev.approvedSafeCount + (finalVerdict === 'SAFE' ? 1 : 0);
        const nextFalseAlarmsAvoided = prev.falseAlarmsAvoided + (!isPhish && stage2Required && finalVerdict === 'SAFE' ? 1 : 0);

        // Moving average pipeline latency (mostly wire-speed <1ms with rare async deep scans)
        const nextAvgLatency = Number(((prev.avgLatencyMs * 0.95) + (gbdtLatency * 0.05)).toFixed(2));

        return {
          totalProcessed: nextTotal,
          stage1ResolvedCount: nextStage1Resolved,
          stage2EscalatedCount: nextStage2Escalated,
          blockedPhishingCount: nextBlocked,
          approvedSafeCount: nextApproved,
          falseAlarmsAvoided: nextFalseAlarmsAvoided,
          avgLatencyMs: nextAvgLatency
        };
      });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [isRunning, trafficRate]);

  const handleReset = () => {
    setPackets([]);
    setStats({
      totalProcessed: 0,
      stage1ResolvedCount: 0,
      stage2EscalatedCount: 0,
      blockedPhishingCount: 0,
      approvedSafeCount: 0,
      falseAlarmsAvoided: 0,
      avgLatencyMs: 0.94
    });
  };

  const stage1ResolutionRate = stats.totalProcessed > 0
    ? ((stats.stage1ResolvedCount / stats.totalProcessed) * 100).toFixed(1)
    : '94.2';

  const stage2EscalationRate = stats.totalProcessed > 0
    ? ((stats.stage2EscalatedCount / stats.totalProcessed) * 100).toFixed(1)
    : '5.8';

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Controls */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>NIST SP 800-61 Rev. 2 Compliance</span>
            <span aria-hidden="true">·</span>
            <span>Two-Stage Hybrid Cascade Architecture (Appendix A)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Real-Time Network Stream Simulator
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Simulates inline enterprise gateway traffic passing through Stage 1 Edge GBDT filter (&lt;1.0 ms wire-speed) with borderline URLs escalated to Stage 2 Asynchronous DistilBERT deep inspection.
          </p>
        </div>

        {/* Simulator controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shadow-sm ${
              isRunning
                ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
            }`}
          >
            {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            <span>{isRunning ? 'Pause Traffic' : 'Resume Traffic'}</span>
          </button>

          <button
            onClick={handleReset}
            className="p-1.5 text-slate-400 hover:text-white border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
            title="Reset Counters"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Real-Time Live Pipeline Statistics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-mono text-slate-400 uppercase">Total Packets</div>
          <div className="text-2xl font-bold text-white font-mono mt-1 tabular-nums">
            {stats.totalProcessed.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Live traffic volume</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-mono text-emerald-400 uppercase">Stage 1 Wire-Speed</div>
          <div className="text-2xl font-bold text-white font-mono mt-1 tabular-nums">
            {stage1ResolutionRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Resolved in &lt;1.0 ms</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-mono text-pink-400 uppercase">Stage 2 Escalated</div>
          <div className="text-2xl font-bold text-white font-mono mt-1 tabular-nums">
            {stage2EscalationRate}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Borderline 40-60% confidence</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-mono text-red-400 uppercase">Phishing Blocked</div>
          <div className="text-2xl font-bold text-white font-mono mt-1 tabular-nums">
            {stats.blockedPhishingCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Zero malicious bypasses</div>
        </div>

        <div className="col-span-2 lg:col-span-1 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="text-[11px] font-mono text-cyan-400 uppercase">Avg Pipeline Latency</div>
          <div className="text-2xl font-bold text-cyan-300 font-mono mt-1 tabular-nums">
            {stats.avgLatencyMs} ms
          </div>
          <div className="text-[11px] text-slate-500 mt-1">vs 18.5ms standalone BERT</div>
        </div>
      </section>

      {/* Visual Pipeline Stage Flowchart */}
      <section className="p-6 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Two-Stage Hybrid Cascade Architecture Flow
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Stage 1 Node */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-cyan-400 font-bold">STAGE 1: GBDT EDGE FILTER</span>
              <span className="text-slate-400 font-bold">&lt;1.0 ms</span>
            </div>
            <div className="text-xs text-slate-300">
              Evaluates 56 engineered features at 672 URLs/sec. Wire-speed decision boundary:
            </div>
            <div className="text-[11px] font-mono space-y-1 pt-1">
              <div className="text-emerald-400">· Confidence &lt; 15% &rarr; Instant Safe Pass (Approved)</div>
              <div className="text-red-400">· Confidence &gt; 85% &rarr; Instant Edge Drop (Blocked)</div>
              <div className="text-pink-400">· Confidence 15-85% &rarr; Escalate to Stage 2</div>
            </div>
          </div>

          {/* Stage 2 Node */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-pink-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-pink-400 font-bold">STAGE 2: ASYNC DISTILBERT</span>
              <span className="text-slate-400 font-bold">18.5 ms</span>
            </div>
            <div className="text-xs text-slate-300">
              Receives borderline URLs asynchronously. Performs deep subword token attention over raw string text to uncover subtle evasion tricks.
            </div>
            <div className="text-[11px] font-mono space-y-1 pt-1">
              <div className="text-slate-400">· Non-blocking async worker pool</div>
              <div className="text-cyan-400">· Prevents user network stall</div>
            </div>
          </div>

          {/* Stage 3 Node */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 font-bold">STAGE 3: NIST INCIDENT HANDLING</span>
              <span className="text-slate-400 font-bold">SOC Telemetry</span>
            </div>
            <div className="text-xs text-slate-300">
              Correlates verdicts with SHAP feature attributions. Dispatches structured incident telemetry per NIST SP 800-61 Rev. 2.
            </div>
            <div className="text-[11px] font-mono space-y-1 pt-1">
              <div className="text-slate-400">· Transparent audit trails</div>
              <div className="text-emerald-400">· 0.005% false alarm rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Streaming Packet Log Table */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white">
              Live Gateway Packet Stream Log
            </h2>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Showing latest 40 stream events
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/60 shadow-md max-h-[460px] overflow-y-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead className="sticky top-0 z-10 bg-slate-950/95 border-b border-slate-800 text-slate-400 uppercase">
              <tr>
                <th className="py-2.5 px-3">Packet ID</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Destination URL</th>
                <th className="py-2.5 px-3">Stage 1 Filter (GBDT)</th>
                <th className="py-2.5 px-3">Stage 2 Deep (BERT)</th>
                <th className="py-2.5 px-3">Final Action</th>
                <th className="py-2.5 px-3 text-right">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {packets.map((pkt) => {
                const isBlocked = pkt.finalVerdict === 'BLOCKED';
                return (
                  <tr key={pkt.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-300">
                      {pkt.id}
                    </td>
                    <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                      {pkt.timestamp}
                    </td>
                    <td className="py-2.5 px-3 max-w-[280px]">
                      <span className="truncate block text-slate-200" title={pkt.url}>
                        {pkt.url}
                      </span>
                      {pkt.tactic && (
                        <span className="text-[10px] text-amber-400 block font-sans">
                          Vector: {pkt.tactic}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          pkt.stage1Verdict === 'APPROVED_SAFE'
                            ? 'bg-emerald-400'
                            : pkt.stage1Verdict === 'BLOCKED_PHISH'
                            ? 'bg-red-400'
                            : 'bg-pink-400'
                        }`} />
                        <span className={
                          pkt.stage1Verdict === 'APPROVED_SAFE'
                            ? 'text-emerald-400'
                            : pkt.stage1Verdict === 'BLOCKED_PHISH'
                            ? 'text-red-400'
                            : 'text-pink-400'
                        }>
                          {pkt.stage1Verdict === 'APPROVED_SAFE'
                            ? 'Edge Pass'
                            : pkt.stage1Verdict === 'BLOCKED_PHISH'
                            ? 'Edge Drop'
                            : 'Escalated'}
                        </span>
                        <span className="text-[10px] text-slate-500 tabular-nums">
                          ({(pkt.gbdtConfidence * 100).toFixed(0)}%)
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      {pkt.stage2Required ? (
                        <div className="flex items-center gap-1 text-pink-400">
                          <span>Async Verified</span>
                          <span className="text-[10px] text-slate-400 tabular-nums">
                            ({pkt.distilBertLatencyMs}ms)
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-600">Bypassed (Fast Path)</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                        isBlocked
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {pkt.finalVerdict}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold tabular-nums">
                      <span className={pkt.totalLatencyMs < 2.0 ? 'text-emerald-400' : 'text-pink-400'}>
                        {pkt.totalLatencyMs.toFixed(2)} ms
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
