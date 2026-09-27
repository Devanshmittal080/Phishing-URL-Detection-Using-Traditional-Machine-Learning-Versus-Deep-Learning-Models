import { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Send,
  Bot,
  User as UserIcon,
  Sparkles,
  Zap,
  Cpu,
  RefreshCw,
  Search,
  MapPin,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  sources?: { uri: string; title: string }[];
  places?: { uri: string; title: string }[];
}

export const GeminiChatAssistant = () => {
  const { user } = useAuth();
  const [modelTier, setModelTier] = useState<'general' | 'complex' | 'fast'>('general');
  const [groundingMode, setGroundingMode] = useState<'none' | 'search' | 'maps'>('none');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'msg-init',
      role: 'model',
      text: 'Hello! I am your PhishGuard Security Research Assistant. You can ask me about comparative ML vs DL trade-offs, the UCI PhiUSIIL 56-feature vector, NIST SP 800-61 incident response, or verify live domain reputations with real-time Google Search and Maps grounding.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputMessage.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      role: 'user',
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      if (groundingMode === 'search') {
        const res = await fetch('/api/grounding/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: trimmed })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'model',
            text: data.text,
            sources: data.sources || [],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else if (groundingMode === 'maps') {
        let lat: number | undefined;
        let lng: number | undefined;

        if (navigator.geolocation) {
          try {
            const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
            });
            lat = pos.coords.latitude;
            lng = pos.coords.longitude;
          } catch {
            // Geolocation fallback
          }
        }

        const res = await fetch('/api/grounding/maps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: trimmed, latitude: lat, longitude: lng })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'model',
            text: data.text,
            places: data.places || [],
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      } else {
        // Standard multi-turn chat with chosen tier
        const historyPayload = messages.concat(userMsg).map((m) => ({
          role: m.role,
          text: m.text
        }));

        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: historyPayload,
            modelTier
          })
        });
        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'model',
            text: data.text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'model',
          text: `Error contacting Gemini API: ${err.message || 'Please check your connection and try again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
            <span>Gemini Cyber Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Multi-Turn Chat, Search &amp; Maps Grounding</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Security Intelligence Assistant
          </h1>
          <p className="mt-1 text-sm text-slate-400 max-w-2xl">
            Query dissertation findings, analyze complex threat signatures with <strong className="text-slate-200">gemini-3.1-pro-preview</strong>, query general security with <strong className="text-slate-200">gemini-3.5-flash</strong>, or utilize real-time Google Search and Maps Grounding.
          </p>
        </div>

        {/* Model Tier Selector */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setModelTier('fast')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
              modelTier === 'fast'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Fast responses via gemini-3.1-flash-lite"
          >
            <Zap className="h-3 w-3 text-amber-400" />
            <span>Fast (flash-lite)</span>
          </button>
          <button
            onClick={() => setModelTier('general')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
              modelTier === 'general'
                ? 'bg-slate-800 text-cyan-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="General reasoning via gemini-3.5-flash"
          >
            <Sparkles className="h-3 w-3 text-cyan-400" />
            <span>General (3.5-flash)</span>
          </button>
          <button
            onClick={() => setModelTier('complex')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
              modelTier === 'complex'
                ? 'bg-slate-800 text-purple-400 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Complex reasoning via gemini-3.1-pro-preview"
          >
            <Cpu className="h-3 w-3 text-purple-400" />
            <span>Complex (3.1-pro)</span>
          </button>
        </div>
      </section>

      {/* Grounding Controls Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <span className="text-slate-400">Grounding Source:</span>
          <button
            onClick={() => setGroundingMode('none')}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-colors ${
              groundingMode === 'none'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            Standard Chat History
          </button>
          <button
            onClick={() => setGroundingMode('search')}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5 ${
              groundingMode === 'search'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <Search className="h-3 w-3 text-blue-400" />
            <span>Google Search Grounding (gemini-3.5-flash)</span>
          </button>
          <button
            onClick={() => setGroundingMode('maps')}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-colors flex items-center gap-1.5 ${
              groundingMode === 'maps'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="h-3 w-3 text-emerald-400" />
            <span>Google Maps Grounding (gemini-3.5-flash)</span>
          </button>
        </div>

        <span className="text-[11px] font-mono text-slate-500">
          User: {user ? user.email : 'Guest Analyst'}
        </span>
      </div>

      {/* Chat Thread Container */}
      <div className="h-[520px] rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col overflow-hidden shadow-inner">
        {/* Messages scroll area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                    isUser
                      ? 'bg-cyan-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-cyan-400 border border-slate-700'
                  }`}
                >
                  {isUser ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div className="space-y-2">
                  <div
                    className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-cyan-500 text-slate-950 font-medium rounded-tr-none'
                        : 'bg-slate-950/80 text-slate-200 border border-slate-800/80 rounded-tl-none'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{m.text}</div>

                    {/* Google Search Web Sources */}
                    {m.sources && m.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 font-mono text-xs">
                        <div className="text-[11px] text-blue-400 uppercase font-semibold flex items-center gap-1">
                          <Search className="h-3 w-3" />
                          <span>Google Search Grounding Sources:</span>
                        </div>
                        <div className="space-y-1">
                          {m.sources.map((src, i) => (
                            <a
                              key={i}
                              href={src.uri}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 hover:underline truncate"
                            >
                              <ExternalLink className="h-3 w-3 shrink-0" />
                              <span className="truncate">{src.title || src.uri}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Google Maps Place Sources */}
                    {m.places && m.places.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-800 space-y-1.5 font-mono text-xs">
                        <div className="text-[11px] text-emerald-400 uppercase font-semibold flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>Google Maps Grounding Places:</span>
                        </div>
                        <div className="space-y-1">
                          {m.places.map((place, i) => (
                            <a
                              key={i}
                              href={place.uri}
                              target="_blank"
                              rel="noreferrer noopener"
                              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 hover:underline truncate"
                            >
                              <ExternalLink className="h-3 w-3 shrink-0" />
                              <span className="truncate">{place.title || place.uri}</span>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div
                    className={`text-[10px] font-mono text-slate-500 ${
                      isUser ? 'text-right' : 'text-left'
                    }`}
                  >
                    {m.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-3xl">
              <div className="h-8 w-8 rounded-lg bg-slate-800 text-cyan-400 border border-slate-700 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4" />
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-400 flex items-center gap-2">
                <span className="animate-spin h-3.5 w-3.5 border-2 border-cyan-400 border-t-transparent rounded-full" />
                <span>PhishGuard AI is generating response...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSendMessage} className="p-3 bg-slate-950/90 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              groundingMode === 'search'
                ? 'Search recent phishing campaigns (Google Search Grounding)...'
                : groundingMode === 'maps'
                ? 'Ask about security response centers or local cybersecurity hubs (Maps Grounding)...'
                : 'Ask a question about model accuracy, latency, loss metrics, or RFC syntax...'
            }
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="p-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold disabled:opacity-40 disabled:pointer-events-none transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
