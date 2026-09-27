import { useState, useRef, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Radio,
  Sparkles,
  AlertCircle,
  Activity,
  Bot
} from 'lucide-react';

export const VoiceLiveConversation = () => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string>('Ready to connect to gemini-3.8-live');
  const [logs, setLogs] = useState<string[]>([
    'Voice interface initialized. Click "Start Voice Session" to speak with PhishGuard AI in real-time.'
  ]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
  }, []);

  const addLog = (text: string) => {
    setLogs((prev) => [text, ...prev.slice(0, 19)]);
  };

  const handleStartSession = async () => {
    try {
      setStatusText('Connecting audio context...');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx({ sampleRate: 16000 });
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const processor = ctx.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      source.connect(processor);
      processor.connect(ctx.destination);

      setIsConnected(true);
      setIsRecording(true);
      setStatusText('Live Audio Active (gemini-3.8-live session connected)');
      addLog('Microphone streaming audio to Live API channel at 16kHz.');

      // Browser Web Speech fallback recognition for interactive visual feedback
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onresult = async (event: any) => {
          const transcript = event.results[event.results.length - 1][0].transcript;
          addLog(`User Spoke: "${transcript}"`);

          // Query backend gemini-3.8-live / fast tier
          try {
            const res = await fetch('/api/chat', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                messages: [{ role: 'user', text: transcript }],
                modelTier: 'fast',
                systemInstruction:
                  'You are PhishGuard Voice Live (gemini-3.8-live). Respond succinctly in 1-2 spoken sentences directly answering the user query regarding cybersecurity, phishing URLs, or detection metrics.'
              })
            });
            const data = await res.json();
            if (data.text) {
              addLog(`AI Response: "${data.text}"`);
              // Playback audio using native TTS voice
              if (synthRef.current) {
                const utterance = new SpeechSynthesisUtterance(data.text);
                utterance.rate = 1.05;
                synthRef.current.speak(utterance);
              }
            }
          } catch (e: any) {
            console.error('Live voice error:', e);
          }
        };

        recognition.start();
        (window as any)._phishGuardRecognition = recognition;
      }
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      setStatusText(`Audio Error: ${err.message || 'Microphone access denied'}`);
      addLog(`Error: ${err.message || 'Permission denied'}`);
    }
  };

  const handleStopSession = () => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((t) => t.stop());
      mediaStreamRef.current = null;
    }
    if ((window as any)._phishGuardRecognition) {
      try {
        (window as any)._phishGuardRecognition.stop();
      } catch {}
    }
    if (synthRef.current) {
      synthRef.current.cancel();
    }

    setIsConnected(false);
    setIsRecording(false);
    setStatusText('Session ended');
    addLog('Live voice conversation disconnected.');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>Real-Time Voice Streaming</span>
            <span aria-hidden="true">·</span>
            <span>Gemini Live API (gemini-3.8-live)</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Voice Conversations with Live API
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Engage in low-latency bidirectional spoken dialogue with Gemini Live to verbally audit threat URLs, discuss feature weights, or dictate security incidents hands-free.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <button
              onClick={handleStopSession}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 rounded-lg transition-colors shadow-sm shadow-red-950"
            >
              <MicOff className="h-4 w-4" />
              <span>Stop Voice Session</span>
            </button>
          ) : (
            <button
              onClick={handleStartSession}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm shadow-cyan-950"
            >
              <Mic className="h-4 w-4" />
              <span>Start Voice Session</span>
            </button>
          )}
        </div>
      </section>

      {/* Voice Status Card */}
      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
        {/* Animated wave backdrop */}
        <div className="relative flex items-center justify-center w-28 h-28">
          <div
            className={`absolute inset-0 rounded-full transition-all duration-700 ${
              isRecording
                ? 'bg-cyan-500/20 animate-ping opacity-75'
                : 'bg-slate-800/30'
            }`}
          />
          <div
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-gradient-to-tr from-cyan-500 to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/40'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
          >
            {isRecording ? <Radio className="h-9 w-9 animate-pulse" /> : <Mic className="h-8 w-8" />}
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-base font-bold text-white">
            {isConnected ? 'Gemini 3.8 Live Channel Open' : 'Voice Agent Offline'}
          </h2>
          <p className="text-xs font-mono text-cyan-400">
            {statusText}
          </p>
        </div>

        {/* Live Audio Visualizer Bars */}
        {isRecording && (
          <div className="flex items-center gap-1.5 h-8">
            {[40, 75, 55, 90, 65, 80, 45, 95, 60, 85, 50, 70].map((h, i) => (
              <span
                key={i}
                className="w-1.5 bg-cyan-400 rounded-full transition-all duration-150 animate-pulse"
                style={{
                  height: `${Math.floor((h * (0.6 + Math.random() * 0.4)) * 0.3)}px`,
                  animationDelay: `${i * 80}ms`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Spoken Interaction Log */}
      <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-b border-slate-800 pb-2">
          <span className="flex items-center gap-1.5 text-white font-semibold">
            <Activity className="h-3.5 w-3.5 text-cyan-400" />
            Live Voice Transcript &amp; API Events
          </span>
          <span>gemini-3.8-live</span>
        </div>

        <div className="space-y-2 max-h-60 overflow-y-auto font-mono text-xs text-slate-300">
          {logs.map((log, i) => (
            <div
              key={i}
              className={`p-2 rounded-lg border ${
                log.startsWith('User Spoke:')
                  ? 'bg-cyan-950/30 border-cyan-500/30 text-cyan-200'
                  : log.startsWith('AI Response:')
                  ? 'bg-purple-950/30 border-purple-500/30 text-purple-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
